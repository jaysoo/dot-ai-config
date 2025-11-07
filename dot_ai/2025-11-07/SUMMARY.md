# Summary - November 7, 2025

## NXC-3215: TypeScript Plugin Performance Optimization ✅

### Commit
- **Hash**: db6a035a7d
- **Files Changed**: `packages/js/src/plugins/typescript/plugin.ts` (225 additions, 160 insertions, 65 deletions)

### Accomplishments

#### 1. Core Performance Optimizations
- **Pre-built Project Boundaries Map**: Eliminates O(depth × references) filesystem walks by building a Set of all project boundaries once at startup
- **Cached Directory Stats**: Implemented `tsConfigDirNames` Map to cache `statSync` results and avoid redundant filesystem operations
- **Unified Reference Resolution**: Created new `resolveProjectReferences()` function that resolves both internal and external references in a single pass
- **Iterative Processing**: Converted recursive functions to iterative approach using stacks for better memory efficiency and no stack overflow risk

#### 2. Critical Bug Fixes - Path Normalization
Fixed duplicate processing bug in **4 functions** where paths were checked in `seen` Set before normalization:

- `resolveInternalProjectReferences()` (lines 956-990)
- `resolveProjectReferences()` (lines 1030-1098)
- `resolveShallowExternalProjectReferences()` (lines 992-1026)
- `hasExternalProjectReferences()` (lines 1100-1144)

**Issue**: References like `./apps/my-app` and `./apps/my-app/tsconfig.json` were treated as different, causing duplicate processing.

**Fix**: Moved `seen` Set checks to occur AFTER path normalization (`join(path, 'tsconfig.json')`), ensuring consistent deduplication.

#### 3. Enhanced Project Boundary Detection
- **Before**: Manual directory traversal with symlink risks, no ignore file handling
- **After**: Used `globWithWorkspaceContextSync()` (later changed to async `globWithWorkspaceContext()`)
  - Automatically respects `.gitignore` and `.nxignore`
  - Handles symlinks correctly via Nx workspace context
  - Leverages Rust-based performance optimizations

#### 4. Improved Error Handling
- Added descriptive logging for initialization failures
- Replaced silent `catch {}` blocks with informative `logger.warn()` messages
- Better error context for debugging filesystem and permission issues

### Technical Details

**Cache Structure**:
```typescript
cache = {
  fileHashes: {},
  rawFiles: {},
  isExternalProjectReference: {},
  tsConfigDirNames: new Map(),      // NEW: Cache stat results
  projectBoundaries: Set<string>    // NEW: Pre-built boundary Set
}
```

**Performance Impact**:
- Eliminated repeated `existsSync` calls in `isExternalProjectReference`
- Removed recursive directory walking per reference
- Single pass for both internal and external reference resolution
- Significant improvements for workspaces with complex TypeScript project reference graphs

### Related Issue
- **Linear**: [NXC-3215](https://linear.app/nxdev/issue/NXC-3215/investigate-performance-issues-related-to-typescriptcreatenodes-and)
- **Goal**: Optimize graph creation from 17-31s down to <10s
- **Scale**: 2,073 tsconfig files, 1.5MB pnpm-lock.yaml

### Status
✅ **Complete** - All changes committed, tested, and built successfully. Branch synced with `origin/NXC-3215`.

---

## NXC-3215: Additional Performance Investigation 🔬

### JS Plugin Performance Analysis
**Task**: `.ai/2025-11-07/tasks/js-plugin-performance-optimizations.md`

Conducted detailed analysis of `nx/js/dependencies-and-lockfile` plugin to identify additional optimization opportunities:

#### Critical Issues Identified
1. **Duplicate Lockfile Reads** (High Impact)
   - Lockfile read twice: once in `internalCreateNodes`, again in `createDependencies`
   - For large pnpm-lock.yaml files (1.5MB), this is expensive
   - **Solution**: Cache lockfile contents at module level with hash-based validation
   - **Estimated Savings**: 50-100ms

2. **Repeated TargetProjectLocator Instantiation** (Medium Impact)
   - New instance created for each `buildExplicitDependencies` call
   - Each instance rebuilds project-to-source map
   - **Solution**: Cache instance per workspace context
   - **Estimated Savings**: 10-50ms

3. **Repeated getLockFilePath Calls** (Low Impact)
   - Function called multiple times with filesystem checks
   - **Solution**: Cache result per package manager
   - **Estimated Savings**: 5-10ms per call

#### Files Analyzed
- `packages/nx/src/plugins/js/index.ts`
- `packages/nx/src/plugins/js/lock-file/lock-file.ts`
- `packages/nx/src/plugins/js/project-graph/build-dependencies/*.ts`

**Total Potential Savings**: 60-150ms per plugin execution

---

## Pathological Workspace Creation for TypeScript Plugin Testing 🧪

### Task: Reproduction Workspace for buildTscTargets Optimization
**Plan**: `.ai/2025-11-07/tasks/nx-typescript-plugin-performance-optimization.md`

Created a pathologically slow workspace to test and optimize the `@nx/js/typescript` plugin's `buildTscTargets` function.

#### Workspace Characteristics
- **620 libraries** (lib-1 through lib-620)
- **10 internal tsconfig files per library** (tsconfig.internal-1.json through tsconfig.internal-10.json)
- **6,820 total tsconfig files** (620 main + 6,200 internal)
- **Complex reference chains**:
  - Each `tsconfig.lib.json` references 10 internal configs
  - Each internal config references 5 other internal configs
  - Creates exponential resolution complexity with circular dependencies
- **Complex include/exclude patterns**: 9 include patterns + 5 exclude patterns per config

#### Performance Results
```bash
rm -rf .nx/workspace-data && \
export NX_DAEMON=false && \
export NX_CACHE_PROJECT_GRAPH=false && \
export NX_PERF_LOGGING=true && \
npx nx report
```

**Baseline Performance**:
- `buildTscTargets` time: **27,327ms** (~27.3 seconds)
- Total plugin time: 55,208ms
- Per-library average: ~44ms (compounds with reference chains)

#### Bottlenecks Identified

1. **`resolveInternalProjectReferences`** (lines 498-521) - CRITICAL
   - Recursive resolution without function-level memoization
   - Deep recursion: 10 refs → 50 refs → 250 refs
   - Same reference chains resolved multiple times
   - No circular reference prevention at resolution level

2. **`isExternalProjectReference`** (lines 575-598) - HIGH IMPACT
   - Walks directory tree for each reference (5-10 `existsSync` calls)
   - Called repeatedly during recursive resolution
   - Caching exists but not effective for resolution patterns

3. **`getInputs`** (lines 282-398) - MEDIUM IMPACT
   - Pattern normalization for 9 includes × N internal refs
   - TypeScript extension arrays recreated repeatedly
   - Multiple Set/Array conversions

#### Optimization Plan (4 Phases)

**Phase 1: Profiling & Measurement** (1-2 hours)
- Add granular timing instrumentation
- Count function call frequencies
- Measure cache hit/miss rates

**Phase 2: Quick Wins** (2-4 hours)
- Implement full result memoization for `resolveInternalProjectReferences`
- Add `seen` Set to prevent circular reference reprocessing
- Cache TypeScript extension arrays per config options
- Build project root map during initialization

**Phase 3: Algorithmic Improvements** (4-8 hours)
- Convert recursive resolution to iterative with work queue
- Deduplicate references before resolution
- Consider parallel processing of independent chains

**Phase 4: Validation** (2-3 hours)
- Benchmark before/after on pathological workspace
- Test on real-world monorepos
- Ensure behavior preservation

**Target**: Reduce 27 seconds → <5 seconds (82% reduction)

---

## Summary

**Focus**: NXC-3215 TypeScript and JS plugin performance optimization

**Completed**:
- ✅ TypeScript plugin core optimizations (pre-built boundaries, cached stats, unified resolution)
- ✅ Critical path normalization bug fixes
- ✅ JS plugin performance analysis with optimization recommendations

**In Progress**:
- 🔬 Created pathological test workspace for `buildTscTargets` optimization
- 📋 Documented 4-phase optimization plan with time estimates

**Next Steps**:
- Implement JS plugin caching optimizations (lockfile, TargetProjectLocator)
- Begin Phase 1 profiling of TypeScript plugin `buildTscTargets` function
- Execute optimization phases 2-4 for TypeScript plugin
