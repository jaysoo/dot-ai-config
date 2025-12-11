# Summary - December 12, 2025

## Completed

### Fix: GitHub Issue #33776 - NestJS serve fails with "Cannot find module 'nx'"

**Issue:** https://github.com/nrwl/nx/issues/33776

After generating a new Nx workspace with `@nx/nest` preset using version 22.2.0, running `nx serve` fails with `Error: Cannot find module 'nx'`.

**Root Cause Analysis:**
1. The `@nx/js` node executor at `packages/js/src/executors/node/node.impl.ts:299` uses `require.resolve('nx')` to fork the nx CLI
2. This fails because:
   - `nx` is only a `devDependency` of `@nx/js`, not a regular dependency
   - pnpm's strict isolation prevents resolving undeclared dependencies
   - The `nx` package doesn't have a `main` field in v22.2.0 (regression)

**Historical Investigation:**
- Discovered the `main` field was never in source code - it was added during build
- Before ts-solution (pre-21.4.0): `@nx/js:tsc` executor added `main` via `updatePackageJson()`
- After ts-solution: `legacy-post-build` executor should add `main: "./bin/nx.js"` but inconsistently works in CI releases
- Version history shows intermittent failures: 21.5.0 (broken), 22.0.0-22.1.3 (working), 22.2.0+ (broken)

**Fix Implemented:**
Changed `node.impl.ts:299` from:
```typescript
require.resolve('nx')
```
to:
```typescript
require.resolve('nx/bin/nx.js', { paths: [context.root] })
```

This resolves the nx binary explicitly from the workspace root where it's always installed, regardless of:
- Package manager hoisting behavior (pnpm/npm/yarn)
- Whether the `main` field exists in the nx package.json

**Commit:** `dc749de18f` on branch `issue-33776`

**Status:** Fix committed locally, verified working against repro at `/tmp/nest1`. Ready for PR.

**Note:** There may be a separate CI/release pipeline issue causing `legacy-post-build` to inconsistently add the `main` field to the published `nx` package. This should be investigated separately.
