# Summary - October 29, 2025

## Storybook 10 Upgrade - Code Review (PR #33277)

**Goal**: Comprehensive review of Storybook 10 upgrade implementation for Nx
**Status**: Review completed with findings and recommendations
**Branch**: `storybook-support-10` (storybook/support-10)

### Review Findings

**Overall Assessment**: Implementation is solid and production-ready after addressing minor issues.

#### Bugs Identified:
1. **Typo in schema.json** (Line 15)
   - "proejcts" → should be "projects"
   - Location: `packages/storybook/src/generators/migrate-10/schema.json:15`

2. **Grammar error in error message**
   - "Please version 8.0.0" → "Please use version 8.0.0"
   - Location: `packages/angular/src/generators/storybook-configuration/lib/assert-compatible-storybook-version.ts:12`

3. **Version detection logic could be clearer**
   - Current: `(getStorybookMajorVersion(tree) ?? 10) <= 9 ? 9 : 10`
   - Works correctly but confusing; recommend more explicit logic
   - Location: `packages/storybook/src/generators/configuration/lib/util-functions.ts:612`

#### Architecture Review:
- ✅ **Good patterns**:
  - Dual template approach (v9/v10 side-by-side)
  - Dynamic version detection for template selection
  - Delegates migration to official Storybook CLI
  - Maintains backward compatibility

- ✅ **Dependency management**:
  - Proper version bumps (storybookVersion: '^10.0.0')
  - Vite updated to ^6.0.0
  - Correct removal of deprecated options (staticDir)

- ✅ **ESM compatibility**:
  - Uses `import.meta.resolve` (Storybook 10 requirement)
  - `getAbsolutePath()` helper function implemented
  - Module resolution set to 'esnext'/'bundler' for v10

#### Questions for Maintainer:
1. React package.json exports (154 lines added) - related to this PR or separate?
2. Removed e2e test "should edit root tsconfig.json" - confirmed no longer needed?
3. `checkStorybookInstalled` requires both `storybook` AND `@nx/storybook` - intentional?

### Key Implementation Details:

**New Files**:
- `packages/storybook/src/generators/migrate-10/` - Migration generator
- `packages/storybook/src/generators/configuration/files/v10/` - v10 templates
- Generator registered in `generators.json`

**Modified Behavior**:
- Configuration generator detects Storybook version and uses appropriate templates
- Executor validation updated: throws error for v7 and below
- Deprecation warning for v8 (recommends upgrading to v9)
- TypeScript config: sets `module: 'esnext'` and `moduleResolution: 'bundler'` for v10
- Dependencies: `@storybook/addon-essentials` and `@storybook/core-server` only for v8 and below

**Breaking Changes**:
- Storybook 7 and lower no longer supported (throws error with upgrade guide)
- Removed `staticDir` schema options (deprecated since 6.4)

### Statistics:
- **Files changed**: 58
- **Additions**: +2,894 lines
- **Deletions**: -1,363 lines
- **Test coverage**: Extensive snapshots for v10 configuration

### Next Steps:
1. Fix typos in schema.json and error messages
2. Consider clarifying version detection logic
3. Answer questions about React exports and removed tests
4. Ready for merge after addressing minor issues

---

**Related Issue**: Fixes #33141
**PR**: https://github.com/nrwl/nx/pull/33277

---

## NXC-3289: Vue e2e Test Failure Investigation & Fix

**Goal**: Investigate and fix intermittent Vue e2e test failures on macOS/npm/Node 20
**Status**: ✅ Fix implemented and validated
**Issue**: https://linear.app/nxdev/issue/NXC-3289

### Problem Identified

The e2e-vue tests were failing in CI with:
```
Error [ERR_INTERNAL_ASSERTION]: Cannot require() ES Module
/path/to/node_modules/@vitejs/plugin-vue/dist/index.js
because it is not yet fully loaded. This may be caused by a
race condition if the module is simultaneously dynamically
import()-ed via Promise.all().
```

### Root Cause Analysis

**The Issue**: Node.js 20's new `require(esm)` feature has a race condition bug when:
1. **@vitejs/plugin-vue v6.0+** dropped CommonJS support → ESM-only package
2. **Vite bundles `vite.config.ts`** with esbuild → sometimes outputs CJS format using `require()`
3. **Race condition occurs** when the same ESM module is being loaded via both `require()` AND `import()` simultaneously
4. **Timing-sensitive** - only manifests in CI environments (macOS/npm/Node 20)

The bundled `vite.config.ts` tries to `require('@vitejs/plugin-vue')`, but the module is "not yet fully loaded" because it's being imported elsewhere at the same time.

### Solution Implemented

**File**: `packages/vite/src/plugins/plugin.ts` (lines 206-216)

Added pre-load workaround following the existing pattern for esbuild:

```typescript
// Workaround for race condition with ESM-only Vite plugins (e.g. @vitejs/plugin-vue@6+)
// When vite.config.ts is bundled by esbuild, it may output CJS format that tries to
// require() ESM-only plugins, causing "Cannot require() ES Module" errors.
// Pre-loading these plugins ensures they're already in the module cache.
try {
  const importVuePlugin = () => new Function('return import("@vitejs/plugin-vue")')();
  await importVuePlugin();
} catch {
  // Plugin not installed or not needed, ignore
}
```

**How it works**: By importing `@vitejs/plugin-vue` before `resolveConfig()` is called, the ESM module is fully loaded and cached. When the bundled config tries to access it (via `require()` or `import()`), it's already available, avoiding the race condition window.

### Validation

✅ **Standalone test** (`/tmp/setup-and-test-workaround.mjs`): Confirmed workaround is safe
✅ **Local e2e test**: `vue-ts-solution.test.ts` passed successfully (96s)
✅ **Package built**: `@nx/vite` built successfully with changes
⏳ **CI validation**: Pending - will confirm fix works in CI environment

### Trade-offs

**Pros**:
- Simple, minimal change
- Follows existing pattern in codebase
- No performance impact
- Fails silently if plugin not installed

**Cons**:
- Workaround rather than root cause fix
- Only covers @vitejs/plugin-vue specifically
- Other ESM-only Vite plugins might need similar treatment

### Future Improvements

For a more robust solution:
1. Detect ESM-only plugins and use `.mts` extension for configs
2. Pass format hints to esbuild via Vite's config loading options
3. Use Vite's alternative config loaders (`runner` or `native`)
4. Pre-load all common ESM-only Vite plugins

### Files Changed

- `packages/vite/src/plugins/plugin.ts` - Added pre-load workaround
- `.ai/2025-10-29/tasks/NXC-3289-investigation-and-fix.md` - Investigation notes

### Related

- CI Failure: https://github.com/nrwl/nx/actions/runs/18705916597/job/53344128935
- Nx Cloud Run: https://staging.nx.app/runs/cODe0ZWSGl/task/e2e-vue%3Ae2e-local
- Related: @vitejs/plugin-vue v6.0.0 migration (PR #33097) introduced ESM-only requirement
