# Nx TypeScript Plugin Performance Optimization

**Date**: 2025-11-07
**Goal**: Optimize `@nx/js/typescript` plugin performance, specifically the `buildTscTargets` function
**Current Performance**: ~27.3 seconds on pathological workspace
**Target**: Under 5 seconds on pathological case

---

## Reproduction Workspace Created

### Workspace Structure
```
org5/
├── 620 libraries (lib-1 through lib-620)
│   ├── Each library contains:
│   │   ├── tsconfig.lib.json (main config)
│   │   │   └── References: 10 internal configs
│   │   ├── tsconfig.internal-1.json through tsconfig.internal-10.json
│   │   │   └── Each references: 5 other internal configs
│   │   └── 10 module directories (src/module-1 through src/module-10)
│
Total: 6,820 tsconfig files (620 main + 6,200 internal)
```

### Performance Metrics
```bash
rm -rf .nx/workspace-data && \
export NX_DAEMON=false && \
export NX_CACHE_PROJECT_GRAPH=false && \
export NX_PERF_LOGGING=true && \
npx nx report
```

**Results:**
- **buildTscTargets time**: 27,327ms (~27.3 seconds)
- **Total plugin time**: 55,208ms
- **Per-library average**: ~44ms (but compounds with reference chains)

---

## What Makes This Workspace Slow

### 1. **Exponential Reference Resolution**
```
Level 1: tsconfig.lib.json → 10 internal references
Level 2: Each of those 10 → 5 more references
Level 3: Each of those 5 → 5 more references
```
- Circular references create repeated traversals
- No deduplication across the resolution tree
- Same reference chains resolved multiple times

### 2. **Complex Include/Exclude Patterns**
Each tsconfig has:
- **9 include patterns**: `*.ts`, `*.tsx`, `*.js`, `*.jsx`, `*.json`, `*.mjs`, `*.cjs`, `*.mts`, `*.cts`
- **5 exclude patterns**: `**/*.spec.ts`, `**/*.test.ts`, `**/node_modules/**`, `**/dist/**`, `**/.nx/**`
- Pattern normalization happens for each file

### 3. **Multiple Source Directories**
- Each internal config has its own module directory
- Plus shared directories: `shared/`, `common/`, `utils/`
- Increases pattern matching complexity in `getInputs`

---

## Primary Bottlenecks Identified

### 1. **`resolveInternalProjectReferences` (lines 498-521)** ⚠️ CRITICAL

**Location**: `node_modules/@nx/js/src/plugins/typescript/plugin.js:498-521`

**What it does:**
- Recursively resolves TypeScript project references within a library
- For each reference, reads tsconfig from cache
- Checks if reference is "internal" vs "external"
- Recursively processes all references in the referenced configs

**Why it's slow:**
- Deep recursion without memoization at function level
- Circular reference handling only at top level (`hasExternalProjectReferences`)
- Processes same reference chains multiple times
- File system checks in `isExternalProjectReference` for each reference

**Code snippet:**
```javascript
function resolveInternalProjectReferences(tsConfig, workspaceRoot, projectRoot, projectReferences = {}) {
    if (!tsConfig.projectReferences?.length) {
        return {};
    }
    for (const ref of tsConfig.projectReferences) {
        let refConfigPath = ref.path;
        if (projectReferences[refConfigPath]) {
            continue; // Already resolved
        }
        // ... existsSync checks
        // ... isExternalProjectReference check (expensive!)
        projectReferences[refConfigPath] = retrieveTsConfigFromCache(refConfigPath, workspaceRoot);
        resolveInternalProjectReferences(projectReferences[refConfigPath], workspaceRoot, projectRoot, projectReferences);
    }
    return projectReferences;
}
```

### 2. **`isExternalProjectReference` (lines 575-598)** ⚠️ HIGH IMPACT

**What it does:**
- Walks up directory tree checking for `package.json`/`project.json`
- Determines if a reference is to another Nx project

**Why it's slow:**
- Multiple `existsSync` calls per reference (can be 5-10 per reference)
- Called for every project reference during resolution
- Has caching but called repeatedly during recursive resolution

**Code snippet:**
```javascript
function isExternalProjectReference(refTsConfigPath, workspaceRoot, projectRoot) {
    const absoluteProjectRoot = path.join(workspaceRoot, projectRoot);
    let currentPath = getTsConfigDirName(refTsConfigPath);

    while (currentPath !== absoluteProjectRoot) {
        if (existsSync(path.join(currentPath, 'package.json')) ||
            existsSync(path.join(currentPath, 'project.json'))) {
            return true; // External project
        }
        currentPath = path.dirname(currentPath);
    }
    return false;
}
```

### 3. **`getInputs` (lines 282-398)** ⚠️ MEDIUM IMPACT

**What it does:**
- Normalizes include/exclude patterns for each tsconfig
- Resolves TypeScript extensions for each pattern
- Builds input arrays for Nx caching

**Why it's slow:**
- Pattern normalization for each include/exclude (9 includes × N internal refs)
- Creates extension arrays repeatedly (line 327-331)
- Multiple Set/Array conversions

---

## Optimization Plan

### **Phase 1: Profiling & Measurement** (1-2 hours)

**Goal**: Get precise timing data on hot spots

Tasks:
- [ ] Add granular timing instrumentation:
  ```javascript
  let resolveInternalRefsTime = 0;
  let isExternalRefTime = 0;
  let getInputsTime = 0;
  ```
- [ ] Count function call frequencies:
  - How many times `resolveInternalProjectReferences` called per library
  - How many times `isExternalProjectReference` called
  - Cache hit/miss rates
- [ ] Measure memory usage (could be creating duplicate objects)
- [ ] Profile with Node.js profiler: `node --prof`

**Expected findings**:
- Exact percentage of time in each bottleneck
- Identify if circular references are actually being hit
- Understand cache effectiveness

---

### **Phase 2: Quick Wins** (2-4 hours)

**Goal**: Implement high-ROI optimizations with minimal risk

#### 2.1 **Full Result Memoization for `resolveInternalProjectReferences`**
```javascript
// Add at top of file
const projectReferencesCache = new Map();

function resolveInternalProjectReferences(tsConfig, workspaceRoot, projectRoot, projectReferences = {}) {
    const cacheKey = `${workspaceRoot}:${projectRoot}:${tsConfig.path}`;

    if (projectReferencesCache.has(cacheKey)) {
        return projectReferencesCache.get(cacheKey);
    }

    // ... existing logic ...

    projectReferencesCache.set(cacheKey, projectReferences);
    return projectReferences;
}
```

**Expected impact**: 50-70% reduction (avoid re-resolving same chains)

#### 2.2 **Prevent Circular Reference Reprocessing**
```javascript
function resolveInternalProjectReferences(tsConfig, workspaceRoot, projectRoot, projectReferences = {}, seen = new Set()) {
    const configPath = tsConfig.path || 'root';

    if (seen.has(configPath)) {
        return projectReferences; // Already processing this path
    }

    seen.add(configPath);
    // ... existing logic ...
}
```

**Expected impact**: 20-30% reduction (stop infinite loops early)

#### 2.3 **Cache TypeScript Extension Arrays**
```javascript
// At function scope or module scope
const extensionCache = new WeakMap();

function getExtensionsForConfig(config) {
    if (extensionCache.has(config)) {
        return extensionCache.get(config);
    }

    const extensions = config.options.allowJs
        ? [...allSupportedExtensions]
        : [...supportedTSExtensions];

    if (config.options.resolveJsonModule) {
        extensions.push(ts.Extension.Json);
    }

    extensionCache.set(config, extensions);
    return extensions;
}
```

**Expected impact**: 5-10% reduction (avoid repeated array creation)

#### 2.4 **Build Project Root Map During Initialization**
```javascript
// Add to initialization phase
let projectRootMap = new Map();

function initializeProjectRootMap(workspaceRoot) {
    // Scan workspace once, build map of all project roots
    // Use for fast lookups in isExternalProjectReference
}

function isExternalProjectReference(refTsConfigPath, workspaceRoot, projectRoot) {
    // Use projectRootMap instead of walking up directory tree
    const refDir = getTsConfigDirName(refTsConfigPath);
    return projectRootMap.has(refDir) && projectRootMap.get(refDir) !== projectRoot;
}
```

**Expected impact**: 10-20% reduction (eliminate repeated fs checks)

---

### **Phase 3: Algorithmic Improvements** (4-8 hours)

**Goal**: Fundamental algorithm changes for better scalability

#### 3.1 **Convert Recursive Resolution to Iterative**
```javascript
function resolveInternalProjectReferences(tsConfig, workspaceRoot, projectRoot) {
    const queue = [tsConfig];
    const projectReferences = {};
    const seen = new Set();

    while (queue.length > 0) {
        const current = queue.shift();

        if (!current.projectReferences?.length) continue;

        for (const ref of current.projectReferences) {
            if (seen.has(ref.path)) continue;
            seen.add(ref.path);

            // ... process reference ...
            queue.push(retrieveTsConfigFromCache(ref.path, workspaceRoot));
        }
    }

    return projectReferences;
}
```

**Expected impact**: 10-15% reduction (reduce call stack overhead)

#### 3.2 **Deduplicate References Before Resolution**
```javascript
function resolveInternalProjectReferences(tsConfig, workspaceRoot, projectRoot) {
    // First pass: collect all unique reference paths
    const uniqueRefs = new Set();
    collectAllReferences(tsConfig, uniqueRefs);

    // Second pass: resolve each unique reference once
    const projectReferences = {};
    for (const refPath of uniqueRefs) {
        projectReferences[refPath] = retrieveTsConfigFromCache(refPath, workspaceRoot);
    }

    return projectReferences;
}
```

**Expected impact**: 20-30% reduction (avoid duplicate work)

#### 3.3 **Consider Parallel Processing**
```javascript
// For independent reference chains
async function resolveInternalProjectReferencesParallel(tsConfig, workspaceRoot, projectRoot) {
    const references = tsConfig.projectReferences || [];

    const results = await Promise.all(
        references.map(ref => resolveReference(ref, workspaceRoot, projectRoot))
    );

    // Merge results
    return results.reduce((acc, refs) => ({ ...acc, ...refs }), {});
}
```

**Expected impact**: 30-50% reduction on multi-core systems

---

### **Phase 4: Validation** (2-3 hours)

**Goal**: Ensure correctness and measure improvements

Tasks:
- [ ] Run full benchmark suite on pathological workspace:
  - Before optimizations: ~27 seconds
  - After Phase 2: Target <15 seconds
  - After Phase 3: Target <5 seconds
- [ ] Test on real-world monorepos:
  - Nx monorepo itself
  - Large open-source TypeScript monorepos
  - Customer workspaces if available
- [ ] Ensure all existing behavior preserved:
  - Run Nx TypeScript plugin tests
  - Verify typecheck target generation
  - Verify build target generation
- [ ] Check for edge cases:
  - Workspaces with no project references
  - Workspaces with only external references
  - Workspaces with deeply nested references (>10 levels)

---

## Testing Strategy

### Benchmark Script
```bash
#!/bin/bash
# benchmark.sh

echo "Running benchmark..."

# Clear cache
rm -rf .nx/workspace-data

# Run with timing
export NX_DAEMON=false
export NX_CACHE_PROJECT_GRAPH=false
export NX_PERF_LOGGING=true

npx nx report 2>&1 | grep "RESULTS"
```

### Expected Outcomes

| Phase | Target Time | Reduction |
|-------|-------------|-----------|
| Baseline | 27,327ms | - |
| After Phase 2 Quick Wins | <15,000ms | ~45% |
| After Phase 3 Algorithmic | <5,000ms | ~82% |

### Success Criteria
- ✅ Pathological case under 5 seconds
- ✅ Real-world cases show measurable improvement
- ✅ All existing tests pass
- ✅ No regression in correctness
- ✅ Memory usage remains stable or improves

---

## Files to Modify

1. **`node_modules/@nx/js/src/plugins/typescript/plugin.js`** (main file)
   - Lines 498-521: `resolveInternalProjectReferences`
   - Lines 575-598: `isExternalProjectReference`
   - Lines 282-398: `getInputs`
   - Lines 187-280: `buildTscTargets`

2. **Test files** (ensure coverage)
   - Find test file for TypeScript plugin
   - Add performance regression tests

---

## Notes & Observations

### Why This Workspace Is Pathological
- Real-world monorepos rarely have >5 internal project references per library
- Circular references are uncommon in well-structured projects
- This represents worst-case for the algorithm

### Cache Effectiveness
- `tsConfigCacheData` caches raw tsconfig data (lines 613-656)
- `cache.isExternalProjectReference` caches external checks (lines 577-584)
- But no caching of full resolution results
- Cache is keyed by file path, not by resolution context

### Algorithm Complexity
- Current: O(N × M × D) where:
  - N = number of libraries
  - M = references per library
  - D = depth of reference chains
- With circular refs: Can approach O(N × M^D) in worst case
- Memoization can reduce to O(N × M) amortized

---

## Next Actions

1. **Immediate**: Add detailed timing instrumentation
2. **Phase 2**: Implement memoization and circular ref prevention
3. **Phase 3**: Convert to iterative algorithm if needed
4. **Validate**: Benchmark and test thoroughly

**Expected total time**: 8-15 hours for all phases
