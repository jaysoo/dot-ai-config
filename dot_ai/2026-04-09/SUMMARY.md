# Summary — 2026-04-09

## NXC-4210: Fix `@nx/next:build` generateLockfile ignoring npm overrides

- **Issue:** https://github.com/nrwl/nx/issues/34529 | https://linear.app/nxdev/issue/NXC-4210
- **PR:** https://github.com/nrwl/nx/pull/35192
- **Status:** PR pushed, ready for review

### Problem

When `generateLockfile: true` is used with npm, the generated `package-lock.json` was missing overridden packages. `npm ci` in the dist output fails with "Missing from lock file" errors.

### Root Causes (two bugs)

1. **`normalizePackageJson()`** stripped `overrides` (npm) and `pnpm.overrides` before passing to lockfile stringifiers. The `overrides` field was missing from both the top-level lockfile and `packages[""]`. (Yarn `resolutions` was already preserved.)

2. **`findTarget()`** in `npm-parser.ts` used strict semver satisfaction to match dependency edges. npm overrides can force versions outside the declared range (e.g. `minimatch@^9.0.4` overridden to `10.2.1`), causing the version check to fail. Overridden packages and their transitive deps were entirely dropped from the pruned graph.

### Fix

- Added `overrides` and `pnpm` to `NormalizedPackageJson` type and `normalizePackageJson()` destructuring
- Added top-level `overrides` output in `stringifyNpmLockfile()`
- Added fallback logic in `findTarget()`: when a package is found at the resolved path but fails the semver check, it's saved as a fallback. If no better match is found walking up the tree, the fallback is returned.
- Added 2 unit tests for overrides in npm lockfile stringification

### Files Changed

- `packages/nx/src/plugins/js/lock-file/utils/package-json.ts` — include `overrides` and `pnpm` in normalized type
- `packages/nx/src/plugins/js/lock-file/npm-parser.ts` — top-level overrides output + findTarget fallback
- `packages/nx/src/plugins/js/lock-file/npm-parser.spec.ts` — 2 new tests

### Verification

- All 168 lock-file tests pass (6 test suites)
- End-to-end verified with reproduction repo (`/tmp/minimatch-override-repro`): `npm ci` succeeds after fix
- Key finding: needed to clear `.nx/workspace-data/lockfile-*` cache files for patched parser to take effect
