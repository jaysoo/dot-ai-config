# 5 Easy GitHub Issues to Fix (< 100 LOC)

## Selected Issues

### 1. Issue #31431: Bun is supported, but missing from the CI deployment documentation
- **URL**: https://github.com/nrwl/nx/issues/31431
- **Type**: docs
- **Estimated LOC**: 5-10
- **What needs to be done**: Add Bun to the list of supported package managers in the CI deployment documentation at https://nx.dev/ci/recipes/other/ci-deployment
- **Why it's easy**: The type definitions already include 'bun' as a valid PackageManager type. Just need to add it to the docs page.

### 2. Issue #30649: Meaning of "*" version in project package.json
- **URL**: https://github.com/nrwl/nx/issues/30649
- **Type**: docs
- **Estimated LOC**: 10-15
- **What needs to be done**: Add a section explaining what the "*" version means in project-specific package.json files within an Nx monorepo
- **Why it's easy**: It's a documentation clarification. Need to explain that "*" in project package.json files resolves to the version specified in the root package.json, not the latest from npm.

### 3. Issue #30768: Where to put @nx/plugin
- **URL**: https://github.com/nrwl/nx/issues/30768
- **Type**: docs
- **Estimated LOC**: 20-30
- **What needs to be done**: Standardize plugin location guidance across multiple documentation pages
- **Why it's easy**: Update inconsistent documentation to provide clear guidance on whether to use `libs/myPlugin` or `tools/myPlugin`

### 4. Issue #30831: `@nx/angular:webpack-browser` has incorrect documentation for `indexhtmltransformer`
- **URL**: https://github.com/nrwl/nx/issues/30831
- **Type**: docs
- **Estimated LOC**: 5-10
- **What needs to be done**: Fix the function signature documentation for indexHtmlTransformer
- **Why it's easy**: The docs incorrectly show `indexHtmlTransformer: async (html: string) => string` but it should be `indexHtmlTransformer: async (config: object, html: string) => string`

### 5. Issue #31111: Undocumented environment variable on Nx Docs
- **URL**: https://github.com/nrwl/nx/issues/31111
- **Type**: docs
- **Estimated LOC**: 10-15
- **What needs to be done**: Add documentation for NX_TUI and NX_TUI_AUTO_EXIT environment variables
- **Why it's easy**: Just need to add two entries to the environment variables reference page with descriptions

## Summary for Gemini Verification

I've identified 5 documentation issues that can each be fixed with minimal code changes:

1. **#31431**: Add Bun to CI deployment docs
2. **#30649**: Explain "*" version meaning in project package.json
3. **#30768**: Standardize plugin location guidance
4. **#30831**: Fix indexHtmlTransformer function signature docs
5. **#31111**: Document NX_TUI and NX_TUI_AUTO_EXIT environment variables

All are documentation-only changes that involve either:
- Adding missing information
- Fixing incorrect information
- Clarifying existing information

Total estimated LOC across all 5 issues: 50-80 lines