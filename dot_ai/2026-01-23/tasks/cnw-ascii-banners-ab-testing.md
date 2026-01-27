# CNW ASCII Banners A/B Testing

**Issue:** CLOUD-4147
**Status:** Paused - awaiting requirement clarification
**Date:** 2026-01-23

## Summary

Implementing A/B tested ASCII art banners for the Nx Cloud connection link displayed at the end of `create-nx-workspace` (CNW).

## What's Been Done

### 1. Created Banner Variants (`cloud-banner.ts`)

File: `packages/create-nx-workspace/src/utils/nx/cloud-banner.ts`

Three banner variants matching `tmp/banners.txt`:

- **Variant 1 (plain):** Simple text with colored link
  ```
  Go to Nx Cloud and finish the setup: https://cloud.nx.app/connect/xxx
  ```

- **Variant 2 (bordered):** Slanted box with NX logo on right side
  ```
   _____________________________________________________________  _____  ____   ___    __
   \                                                            \ \    \ \   \  \  \   \ \
    \                - Try the full Nx platform -                \ \    \ \   \  \  \   \ \
     \         https://cloud.nx.app/connect/xxx                   \ \    \ \   \  \  \   \ \
      \      Remote caching * Distribution * Self-healing CI       \ \    \ \   \  \  \   \ \
  ```

- **Variant 3 (ascii-art):** NX logo with clouds scene
  ```
  __/\\\\\_____/\\\_______________                 *             ___
   _\ \\\\\\___\ \\\_______________           +          _______(   )___
    ... (cloud scene with URL embedded)
  ```

### 2. Added A/B Testing Infrastructure (`ab-testing.ts`)

File: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`

Added:
- `BannerVariantCode` type: `'banner-plain' | 'banner-bordered' | 'banner-ascii-art'`
- `getBannerVariant()` function:
  - Returns `banner-plain` for docs generation (`NX_GENERATE_DOCS_PROCESS=true`)
  - Respects `NX_CNW_BANNER_VARIANT` env var for manual testing
  - Otherwise randomly selects one of the three variants

### 3. Wired Up Banners in `nx-cloud.ts`

File: `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts`

Modified `getNxCloudInfo()` to:
1. Get A/B tested banner variant via `getBannerVariant()`
2. Convert code to numeric variant via `bannerCodeToVariant()`
3. Generate banner with `generateCloudBanner(url, variant)`
4. Add "Push your repo" instructions if user hasn't pushed to VCS
5. Display banner as body of success message

## Current State

- **Build:** ✅ Passes
- **Lint:** ✅ Passes
- **Tests:** ✅ All 45 tests pass
- **Git status:** 2 modified files (`ab-testing.ts`, `nx-cloud.ts`)

## Files Changed

```
packages/create-nx-workspace/src/utils/nx/ab-testing.ts   | +37 lines (BannerVariantCode, getBannerVariant)
packages/create-nx-workspace/src/utils/nx/nx-cloud.ts    | +52 lines (banner integration)
packages/create-nx-workspace/src/utils/nx/cloud-banner.ts | (already committed, no changes)
```

## Two Completion Paths

1. **User opts for Nx Cloud** → Shows A/B tested banner with short URL (✅ implemented)
2. **User skips Nx Cloud** → Shows "nx connect" message (⚠️ no banner yet, TODO added)

Current output for skipped case:
```
 NX   Next steps

Run "nx connect" to enable remote caching and speed up your CI.

70% faster CI, 60% less compute, automatically fix broken PRs.
Learn more at https://nx.dev/nx-cloud
```

## TODOs

1. **Pending requirement clarification** - User mentioned potential requirement changes
2. **Skipped cloud banners** - TODO comment added in `nx-cloud.ts` for potentially adding A/B tested banners to the skipped cloud case (without short URL)
3. **Telemetry tracking** - May need to track which banner variant was shown in `recordStat()` for analytics
4. **Testing** - Manual testing with different variants not yet completed

## How to Test

```bash
# Test specific variant
NX_CNW_BANNER_VARIANT=banner-plain npx create-nx-workspace@latest test1 --preset=ts --nxCloud=yes --no-interactive
NX_CNW_BANNER_VARIANT=banner-bordered npx create-nx-workspace@latest test2 --preset=ts --nxCloud=yes --no-interactive
NX_CNW_BANNER_VARIANT=banner-ascii-art npx create-nx-workspace@latest test3 --preset=ts --nxCloud=yes --no-interactive

# Or test with local build
cd /private/tmp
NX_CNW_BANNER_VARIANT=banner-bordered node /path/to/nx/dist/packages/create-nx-workspace/bin/create-nx-workspace.js myapp --preset=ts --nxCloud=yes --no-interactive
```

## Reference Files

- Banner spec: `tmp/banners.txt`
- Test file (from earlier): `tmp/banner-final.ts`

## Notes

- Banners use `chalk` for colors (cyan for URL, white for text, gray for decorations)
- Variant 2 has dynamic box width calculation to accommodate variable-length URLs
- `NX_GENERATE_DOCS_PROCESS=true` forces plain variant for docs generation
