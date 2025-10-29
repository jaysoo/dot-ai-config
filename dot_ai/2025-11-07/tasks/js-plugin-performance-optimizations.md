# JS Plugin Performance Optimizations

**Date**: 2025-11-07
**Context**: NXC-3215 - Performance analysis of `nx/js/dependencies-and-lockfile` plugin
**Files Analyzed**:
- `packages/nx/src/plugins/js/index.ts`
- `packages/nx/src/plugins/js/lock-file/lock-file.ts`
- `packages/nx/src/plugins/js/lock-file/bun-parser.ts`
- `packages/nx/src/plugins/js/project-graph/build-dependencies/build-dependencies.ts`
- `packages/nx/src/plugins/js/project-graph/build-dependencies/explicit-project-dependencies.ts`
- `packages/nx/src/plugins/js/project-graph/build-dependencies/target-project-locator.ts`

---

## 🔴 Critical Issues (High Impact)

### 1. Duplicate Lockfile Reads
**Location**: `packages/nx/src/plugins/js/index.ts:61-64, 106-110`

**Problem**: The lockfile is read **twice** - once in `internalCreateNodes` and again in `createDependencies`. For large lockfiles (especially pnpm-lock.yaml which can be 100K+ lines), this is very expensive.

**Current Code**:
```typescript
// internalCreateNodes (line 61-64)
const lockFileContents =
  packageManager !== 'bun'
    ? readFileSync(lockFilePath, 'utf-8')
    : readBunLockFile(lockFilePath);

// createDependencies (line 106-110)
const lockFileContents =
  packageManager !== 'bun'
    ? readFileSync(lockFilePath, 'utf-8')
    : readBunLockFile(lockFilePath);
```

**Solution**: Cache the lockfile contents at module level:
```typescript
let cachedLockFileContents: string | undefined;
let cachedLockFileHash: string | undefined;

// Reuse cached contents if hash matches
if (cachedLockFileHash === lockFileHash && cachedLockFileContents) {
  lockFileContents = cachedLockFileContents;
} else {
  // read and cache
}
```

**Impact**: Could save 50-100ms for large lockfiles

---

### 2. TargetProjectLocator Recreated Every Time
**Location**: `packages/nx/src/plugins/js/project-graph/build-dependencies/build-dependencies.ts:32-35`

**Problem**: A new `TargetProjectLocator` is instantiated on every `createDependencies` call, which:
- Creates project root mappings
- Reduces all external nodes (Object.values + reduce)
- Reads and parses tsconfig
- Sets up npm projects lookup

**Current Code**:
```typescript
const nodes: Record<string, ProjectGraphProjectNode> = Object.fromEntries(
  Object.entries(ctx.projects).map(([key, config]) => [
    key,
    { name: key, type: null, data: config },
  ])
);
const targetProjectLocator = new TargetProjectLocator(
  nodes,
  ctx.externalNodes
);
```

**Solution**: Cache the `TargetProjectLocator` instance:
```typescript
let cachedTargetProjectLocator: TargetProjectLocator | undefined;
let cachedProjectsHash: string | undefined;

const projectsHash = hashArray([
  Object.keys(ctx.projects),
  Object.keys(ctx.externalNodes)
]);

if (cachedProjectsHash === projectsHash && cachedTargetProjectLocator) {
  targetProjectLocator = cachedTargetProjectLocator;
} else {
  // create new instance and cache
}
```

**Impact**: Could save 10-50ms depending on workspace size

---

### 3. Repeated `getLockFilePath` Calls with `execSync`
**Location**: `packages/nx/src/plugins/js/lock-file/lock-file.ts:208-230`

**Problem**: This function:
- Calls `existsSync` multiple times (lines 211, 215)
- May run `execSync('bun --version')` each time (line 219)
- Is called multiple times per plugin execution

**Current Code**:
```typescript
export function getLockFilePath(packageManager: PackageManager): string {
  if (packageManager === 'bun') {
    try {
      if (existsSync(BUN_TEXT_LOCK_PATH)) {
        return BUN_TEXT_LOCK_PATH;
      }
      if (existsSync(BUN_LOCK_PATH)) {
        return BUN_LOCK_PATH;
      }
      const bunVersion = execSync('bun --version').toString().trim();
      // ...
    }
  }
}
```

**Solution**: Cache at module level:
```typescript
const lockFilePathCache = new Map<PackageManager, string>();

export function getLockFilePath(packageManager: PackageManager): string {
  if (lockFilePathCache.has(packageManager)) {
    return lockFilePathCache.get(packageManager);
  }
  // ... existing logic
  lockFilePathCache.set(packageManager, result);
  return result;
}
```

**Impact**: Eliminates repeated file system checks and command execution

---

## ⚠️ Moderate Issues (Medium Impact)

### 4. Synchronous `execSync` for Bun Binary Format
**Location**: `packages/nx/src/plugins/js/lock-file/bun-parser.ts:152-156`

**Problem**: For binary Bun lockfiles, `execSync('bun ${lockFilePath}')` is called, which:
- Blocks the entire process
- Spawns a subprocess
- Can be slow (50-200ms)

**Current Code**:
```typescript
export function readBunLockFile(lockFilePath: string): string {
  if (lockFilePath.endsWith(BUN_TEXT_LOCK_FILE)) {
    return readFileSync(lockFilePath, { encoding: 'utf-8' });
  }

  return execSync(`bun ${lockFilePath}`, {
    encoding: 'utf-8',
    maxBuffer: 1024 * 1024 * 10,
    windowsHide: false,
  });
}
```

**Note**: The code already prioritizes text format in `getLockFilePath` (lines 211-212), which is good.

**Potential Solutions**:
1. Warn users to migrate to text format when binary is detected
2. Consider async processing (would require architectural changes)
3. Cache the converted result aggressively

**Impact**: Could save 50-200ms for Bun users with binary lockfiles

---

### 5. JSON Cache with Pretty Printing
**Location**: `packages/nx/src/plugins/js/index.ts:159, 173`

**Problem**: Cache files are written with `JSON.stringify(data, null, 2)` which:
- Adds unnecessary whitespace
- Makes files larger
- Slower to write/read

**Current Code**:
```typescript
writeFileSync(externalNodesCache, JSON.stringify(nodes, null, 2));
writeFileSync(dependenciesCache, JSON.stringify(dependencies, null, 2));
```

**Solution**: Remove pretty printing:
```typescript
writeFileSync(externalNodesCache, JSON.stringify(nodes));
writeFileSync(dependenciesCache, JSON.stringify(dependencies));
```

**Impact**: 10-30% faster serialization, smaller cache files

---

### 6. External Nodes Reduction in Constructor
**Location**: `packages/nx/src/plugins/js/project-graph/build-dependencies/target-project-locator.ts:82-94`

**Problem**: On every `TargetProjectLocator` instantiation, all external nodes are reduced to create `npmProjects`. This is O(n) where n = number of external packages.

**Current Code**:
```typescript
this.npmProjects = Object.values(this.externalNodes).reduce((acc, node) => {
  if (node.type === 'npm') {
    const keyWithVersion = `npm:${node.data.packageName}@${node.data.version}`;
    if (!acc[node.name]) {
      acc[node.name] = node;
    }
    if (!acc[keyWithVersion]) {
      acc[keyWithVersion] = node;
    }
  }
  return acc;
}, {} as Record<string, ProjectGraphExternalNode>);
```

**Solution**: Could be cached at module level if externalNodes structure is stable.

**Impact**: Saves 5-20ms for large node_modules

---

## 🟡 Minor Issues (Low Impact)

### 7. TypeScript Config Reading in Constructor
**Location**: `packages/nx/src/plugins/js/project-graph/build-dependencies/target-project-locator.ts:58`

**Problem**: `getRootTsConfig()` is called synchronously in the constructor, even if paths aren't needed.

**Solution**: Make it lazy:
```typescript
private _tsConfig: ReturnType<typeof this.getRootTsConfig> | undefined;
private get tsConfig() {
  return this._tsConfig ??= this.getRootTsConfig();
}
```

**Impact**: Minor, only if tsconfig reading is expensive

---

### 8. Module Resolution Checks with `require.resolve`
**Location**:
- `packages/nx/src/plugins/js/project-graph/build-dependencies/build-dependencies.ts:43-45`
- `packages/nx/src/plugins/js/project-graph/build-dependencies/explicit-project-dependencies.ts:137-142`

**Problem**: Uses try-catch with `require.resolve` to check if TypeScript/Vue is installed. This is called on every execution.

**Current Code**:
```typescript
let tsExists = false;
try {
  require.resolve('typescript');
  tsExists = true;
} catch {}
```

**Solution**: Cache at module level:
```typescript
let tsExists: boolean | undefined;
if (tsExists === undefined) {
  try {
    require.resolve('typescript');
    tsExists = true;
  } catch {
    tsExists = false;
  }
}
```

**Impact**: Minimal, but good practice

---

## 📊 Implementation Priority

### Phase 1 (High Impact - Implement First)
1. ✅ Eliminate duplicate lockfile reads (#1)
2. ✅ Cache TargetProjectLocator (#2)
3. ✅ Cache getLockFilePath result (#3)

**Estimated Savings**: 60-150ms per plugin execution

### Phase 2 (Medium Impact)
4. ✅ Optimize JSON serialization (#5)
5. ✅ Cache external nodes reduction (#6)
6. ⚠️ Address Bun binary lockfile issue (#4) - may require user migration

**Estimated Savings**: 15-50ms per plugin execution

### Phase 3 (Low Impact - Nice to Have)
7. ✅ Lazy TypeScript config (#7)
8. ✅ Cache module resolution checks (#8)

**Estimated Savings**: 5-10ms per plugin execution

---

## Testing Strategy

1. **Benchmarking**: Add performance marks around each optimization
2. **Cache Invalidation**: Ensure caches are cleared when necessary
3. **Large Workspace Testing**: Test with 100+ projects and 1000+ npm packages
4. **Different Package Managers**: Test with npm, yarn, pnpm, and bun
5. **CI Performance**: Measure impact on CI build times

---

## Notes

- The Bun parser is already comprehensive and well-optimized
- Main bottlenecks are repeated file I/O and object creation
- Cache invalidation is critical - must detect when inputs change
- Consider adding DEBUG logging to track cache hit rates

---

## Related Files

Key files that would need changes:
- `packages/nx/src/plugins/js/index.ts` - Main plugin entry
- `packages/nx/src/plugins/js/lock-file/lock-file.ts` - Lock file utilities
- `packages/nx/src/plugins/js/project-graph/build-dependencies/build-dependencies.ts` - Dependency builder
- `packages/nx/src/plugins/js/project-graph/build-dependencies/target-project-locator.ts` - Project resolution
