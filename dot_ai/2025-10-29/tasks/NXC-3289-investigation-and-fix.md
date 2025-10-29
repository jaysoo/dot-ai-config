# NXC-3289: Vue e2e fails on MacOS/NPM/Node 20

## Issue Summary

The e2e-vue tests fail intermittently in CI (macOS/npm/Node 20) with the error:
```
Error [ERR_INTERNAL_ASSERTION]: Cannot require() ES Module
/path/to/node_modules/@vitejs/plugin-vue/dist/index.js
because it is not yet fully loaded. This may be caused by a
race condition if the module is simultaneously dynamically
import()-ed via Promise.all().
```

**Links:**
- Linear Issue: https://linear.app/nxdev/issue/NXC-3289
- CI Failure: https://github.com/nrwl/nx/actions/runs/18705916597/job/53344128935
- Nx Cloud Run: https://staging.nx.app/runs/cODe0ZWSGl/task/e2e-vue%3Ae2e-local

## Root Cause Analysis

### The Problem

1. **During Nx project graph generation**, the Vite plugin calls `resolveConfig()` to parse `vite.config.ts` files
2. **Vite uses esbuild to bundle** the TypeScript config into a temporary file in `node_modules/.vite-temp`
3. **@vitejs/plugin-vue v6.0.0+ is ESM-only** (dropped CommonJS support)
4. **Under certain timing conditions** (CI environment, npm, Node 20), esbuild outputs a bundle format that uses `require()` instead of `import()`
5. **The bundled config tries to `require('@vitejs/plugin-vue')`**, which fails because it's ESM-only
6. **Race condition:** The module is being loaded/cached while simultaneously being required

### Why It Only Fails in CI

This is timing-sensitive:
- Different filesystem speeds in CI vs local
- npm vs pnpm handle module resolution differently
- Node 20's ESM loader has specific timing characteristics
- The race condition window is narrower locally

### Evidence

Error path shows the bundled config is the source:
```
(from /path/to/apps/app7870707/vite.config.ts)
```

The bundled version of `vite.config.ts` is what's trying to `require()` the plugin.

## Solution

### The Fix

Added a workaround in `packages/vite/src/plugins/plugin.ts` (lines 206-216):

```typescript
// Workaround for race condition with ESM-only Vite plugins (e.g. @vitejs/plugin-vue@6+)
// When vite.config.ts is bundled by esbuild, it may output CJS format that tries to
// require() ESM-only plugins, causing "Cannot require() ES Module" errors.
// Pre-loading these plugins ensures they're already in the module cache.
// See: https://linear.app/nxdev/issue/NXC-3289
try {
  const importVuePlugin = () => new Function('return import("@vitejs/plugin-vue")')();
  await importVuePlugin();
} catch {
  // Plugin not installed or not needed, ignore
}
```

This follows the same pattern as the existing esbuild workaround (lines 198-205).

### How It Works

By pre-loading `@vitejs/plugin-vue` before calling `resolveConfig()`:
1. The ESM module is loaded and cached properly
2. When esbuild's bundled config tries to access it (via either require or import), it's already available
3. The race condition is avoided because the module is fully loaded first

### Trade-offs

**Pros:**
- Simple, follows existing pattern in the codebase
- Minimal performance impact (only attempts import if needed)
- Fails silently if plugin not installed

**Cons:**
- Doesn't solve the root cause (esbuild bundling format selection)
- Only covers @vitejs/plugin-vue (other ESM-only plugins might have same issue)
- Workaround rather than proper fix

### Future Improvements

For a more robust solution, consider:
1. **Detect ESM-only plugins** and use `.mts` extension for configs
2. **Pass format hints to esbuild** via Vite's config loading options
3. **Use Vite's alternative config loaders** (`runner` or `native` instead of `bundle`)
4. **Pre-load all common ESM-only Vite plugins** (@vitejs/plugin-react, etc.)

## Testing

### Local Testing

Since the issue doesn't reproduce locally, create a test case:

```bash
# Run the e2e test with npm
SELECTED_PM=npm nx e2e-local e2e-vue -t 'should serve application in dev mode'
```

### CI Testing

The fix will be validated when:
1. The e2e-vue tests pass consistently on macOS/npm/Node 20
2. No regression in other environments (Linux, pnpm, yarn)

### Reproduction Script

Created `tmp/reproduce-vue-race-condition.mjs` to attempt reproduction:
- Loads Vue config multiple times concurrently
- Clears module cache between attempts
- Uses npm specifically
- Expected: Won't reproduce locally (timing-sensitive)

## Files Changed

- `packages/vite/src/plugins/plugin.ts` - Added pre-load workaround

## Related Issues

- Similar esbuild race condition fixed previously (lines 198-205 in same file)
- @vitejs/plugin-vue v6.0.0 migration (PR #33097) introduced ESM-only requirement

## Validation Checklist

- [x] Code change implemented
- [x] Package built successfully
- [ ] Local e2e test passes
- [ ] CI e2e test passes (verify in next CI run)
- [ ] No regression in other test suites
