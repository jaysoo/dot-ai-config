# Summary - November 25, 2025

## Completed

### Fix Rollup CopyAssetsHandler Path Normalization (issue-32398)
- **Branch**: `issue-32398`
- **Commit**: `a7c704f67c` - fix(bundling): normalize asset paths for CopyAssetsHandler in rollup plugin
- **Problem**: E2E test `react-package-legacy.test.ts` failing when assets defined with glob patterns like `{ glob: 'libs/childlib/README.md', input: '.', output: '.' }` were being copied to double-nested paths (`dist/libs/childlib/libs/childlib/README.md`)
- **Root Cause**: After switching from `rollup-plugin-copy` to `CopyAssetsHandler`, path handling was incorrect because `CopyAssetsHandler` expects `input` as a directory and `glob` as a pattern within it (e.g., `input: 'docs'`, `glob: '**/*.md'`), not combined paths
- **Solution**: Created `extractGlobLiteralPrefix` function to split globs into literal directory prefix and remaining pattern
- **Files Changed**:
  - `packages/rollup/src/plugins/nx-copy-assets.plugin.ts` - Added glob prefix extraction and path normalization
  - `packages/rollup/src/plugins/nx-copy-assets.plugin.spec.ts` - Added unit tests for `extractGlobLiteralPrefix`
- **Key Learning**: `CopyAssetsHandler` uses `path.relative(assetGlob.input, src)` internally, which requires both paths to be in the same format (both relative to rootDir) for correct output path calculation

### DOC-347: Update Storybook Docs for Version 10
- **Branch**: `DOC-347`
- **Commit**: `4e33fa94ef` - docs(storybook): update Storybook docs for version 10
- **Linear Issue**: https://linear.app/nxdev/issue/DOC-347
- **Problem**: Storybook generator docs banner said "Nx uses Storybook 7", outdated for Storybook 10 support
- **Changes Made**:
  - Updated banner in `packages/storybook/docs/configuration-generator-examples.md` to "Nx uses Storybook 10"
  - Updated Angular and React storybook-configuration-examples.md to reference Storybook v10
  - Created new `packages/storybook/docs/migrate-10-generator-examples.md` with AI-assisted migration docs
  - Added `examplesFile` reference to `packages/storybook/src/generators/migrate-10/schema.json`
  - Consolidated `storybook-9-setup.mdoc` into `upgrading-storybook.mdoc` as a comprehensive migration guide
  - Added redirect from old storybook-9-setup URL in `astro-docs/netlify.toml`
  - Updated redirect rules in `nx-dev/nx-dev/redirect-rules-docs-to-astro.js`
  - Updated links in introduction.mdoc, overview-react.mdoc, overview-angular.mdoc
  - Updated blog post link in `docs/blog/2025-06-13-nx-21-2-release.md`
- **Key Features Documented**:
  - Migration generators table (migrate-8, migrate-9, migrate-10)
  - `nx migrate` automatic Storybook 9→10 upgrade (Nx 22+)
  - AI-assisted migrations via `ai-migrations/MIGRATE_STORYBOOK_10.md`
  - ESM syntax requirement for Storybook 10 configs
  - Storybook CLI direct upgrade option

## Files Created
- `.ai/2025-11-25/SUMMARY.md` - This summary
- `packages/storybook/docs/migrate-10-generator-examples.md` - New migrate-10 generator documentation

## Files Deleted
- `astro-docs/src/content/docs/technologies/test-tools/storybook/Guides/storybook-9-setup.mdoc` - Merged into upgrading-storybook.mdoc
