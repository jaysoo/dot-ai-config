# Summary - 2025-11-26

## Completed Tasks

### DOC-346: Update Atomizer Documentation for Vite and Vitest Plugins

**Linear Issue**: https://linear.app/nxdev/issue/DOC-346/update-atomizer-pages-for-vite-vitest

Updated the atomizer/task splitting documentation to properly reflect the move of Vitest functionality from `@nx/vite` to `@nx/vitest`.

**Changes Made:**

1. **`split-e2e-tasks.mdoc`** (Feature page)
   - Changed Vitest tab from `nx add @nx/vite` to `nx add @nx/vitest`
   - Updated plugin list to reference `@nx/vitest` instead of `@nx/vite`
   - Updated Vitest configuration link to point to `@nx/vitest` introduction page

2. **`vite/introduction.mdoc`** (Vite plugin docs)
   - Removed "Splitting E2E Tests" section (moved to Vitest)
   - Removed "Customizing atomized unit/e2e tasks group name" section (moved to Vitest)
   - Updated `serveTargetName` to `devTargetName` (deprecated option fix)

3. **`vitest/introduction.mdoc`** (Vitest plugin docs)
   - Fixed option name from `targetName` to `testTargetName` (matching actual plugin interface)
   - Added "Configuring @nx/vitest for both E2E and Unit Tests" section with dual plugin configuration example
   - Added "Splitting E2E Tests" section with migration callout
   - Added "Customizing Atomized Tasks Group Name" section
   - Added migration note explaining that in Nx 21 and earlier this was in `@nx/vite/plugin`, and `@nx/vite` will have Vitest features removed in Nx 23

**Commit**: `24ab59ff4a` - `docs(misc): update atomizer documentation for Vite and Vitest plugins`

### NXC-3519: Update axios to 1.13.2 in @nx/key

**Branch**: NXC-3519

Updated axios dependency in `@nx/key` package from previous version to 1.13.2.

**Investigation:**
- Reviewed axios 1.8.0 breaking change regarding `allowAbsoluteUrls` config option
- Breaking change: When `baseURL` is configured, axios now combines URLs instead of preferring absolute request URLs
- **No impact on @nx/key**: The package only uses relative paths with its configured `baseURL`, so the breaking change doesn't affect it
- Lockfile changes (removing `@nx/key-*` optional dependency stubs) are expected npm cleanup behavior, not caused by axios bump

## Notes

- The `@nx/vitest` plugin is the dedicated Vitest plugin introduced to separate Vitest functionality from the Vite build tool plugin
- This change aligns with the direction that `@nx/vite` will have its Vitest features removed in Nx 23
- axios 1.8.0+ breaking change only affects code that has a `baseURL` configured AND passes absolute URLs to request methods
