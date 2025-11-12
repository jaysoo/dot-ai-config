# Daily Summary - November 11, 2025

## Overview
Completed two critical infrastructure tasks: macOS GitHub Actions runner upgrade and Vite/Vitest configuration file generation updates for Node 24 compatibility.

## Tasks Completed

### NXC-3444: Upgrade MacOS GitHub Actions Runners
- **Issue**: https://linear.app/nxdev/issue/NXC-3444/upgrade-macos-github-actions-runners
- **Problem**: GitHub Actions `macos-13` runners are being deprecated with brownout periods causing temporary job failures. Full deprecation occurs December 8, 2025.
- **Solution**:
  - Updated Intel builds (x86_64-apple-darwin): `macos-13` → `macos-15-intel`
  - Updated ARM64 builds (aarch64-apple-darwin): `macos-13` → `macos-latest`
- **Files Modified**: `.github/workflows/publish.yml` (2 instances)
- **Commit**: 3c85af93af - chore(misc): upgrade macOS GitHub Actions runners
- **Status**: ✅ Complete - merged to master

### NXC-3446: Generate .mts Config Files for Vite/Vitest
- **Issue**: https://linear.app/nxdev/issue/NXC-3446/vitevitest-generate-mts-files
- **Problem**: Node 24+ uses `process.features.typescript` to detect and strip types from `.ts` files. This means `.ts` files are treated according to `package.json` `type` field and `tsconfig` module settings, causing inconsistent behavior. Similar to the Jest `.cts` fix in #33349.
- **Solution**: Force `.mts` extension for all Vite/Vitest config files to ensure they are always treated as ESM modules regardless of package.json or tsconfig settings.
- **Changes Made**:
  - Updated 9 generator files to pass `useEsmExtension: true` to `createOrEditViteConfig`:
    - `packages/vite/src/generators/configuration/configuration.ts`
    - `packages/vitest/src/generators/configuration/configuration.ts`
    - `packages/react/src/generators/application/lib/bundlers/add-vite.ts`
    - `packages/react/src/generators/library/library.ts`
    - `packages/vue/src/generators/application/lib/add-vite.ts`
    - `packages/vue/src/generators/library/lib/add-vite.ts`
    - `packages/web/src/generators/application/application.ts`
    - `packages/nuxt/src/generators/application/lib/add-vitest.ts`
    - `packages/remix/src/generators/application/application.impl.ts`
  - Updated `normalizeViteConfigFilePathWithTree` utility to check for `.mts` files first
  - Updated all test files to expect `.mts` config files instead of `.ts`
  - Updated snapshots to reflect new file extensions
- **Testing**: All vite package tests pass with updated snapshots
- **Commit**: 447870ae42 - fix(vite): generate .mts config files to force ESM
- **Status**: ✅ Complete - committed locally, validation suite running

## Impact

### NXC-3444 (macOS Runners)
- Prevents workflow failures during brownout periods (Nov 4-5, 11-12, 18-19, 25-26)
- Ensures compatibility beyond December 8, 2025 deprecation deadline
- Maintains build support for both Intel and ARM64 macOS architectures

### NXC-3446 (Vite/Vitest .mts Files)
- Ensures consistent ESM behavior across all Node versions and package configurations
- Prevents runtime errors when Node 24+ strips types from `.ts` files
- Aligns with the pattern established for Jest configs (`.cts` extension)
- Affects all new projects generated with Vite/Vitest support

## Technical Details

### Node 24 Type Stripping Behavior
Node 24+ introduces native TypeScript support via `process.features.typescript`, which strips types from `.ts` files before execution. This changes the resolution behavior:

**Before Node 24**:
- `.ts` files processed by ts-node/swc with explicit module settings
- Can control CJS/ESM through tsconfig options

**With Node 24**:
- `.ts` files have types stripped by Node itself
- Resolution follows standard Node rules (package.json `type` field and file extension)
- `.mts` → always ESM, `.cts` → always CJS, `.ts` → depends on package.json

### Related Work
- Jest fix: #33349 (uses `.cts` for CommonJS configs)
- Vite/Vitest fix: NXC-3446 (uses `.mts` for ESM configs)
- Both follow the same pattern of using explicit extensions to force module type

## Next Steps
1. ✅ Push NXC-3446 branch and create PR
2. Monitor validation suite results
3. Address any test failures in affected packages
