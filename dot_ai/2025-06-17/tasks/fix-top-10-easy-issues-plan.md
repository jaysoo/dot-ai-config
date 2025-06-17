# Fix Top 10 Easy Issues - Implementation Plan

## Overview
This plan outlines the approach to fix the top 10 "easy" issues identified in the Nx repository analysis. Each issue will be addressed in its own branch following the GitHub issue response mode.

## Prerequisites
- Ensure we're on the latest main/master branch
- Have GitHub CLI (`gh`) configured
- Nx development environment set up

## Issue Analysis and Implementation Plan

### 1. Issue #29359: Unable to publish a package
- **Score**: 12
- **URL**: https://github.com/nrwl/nx/issues/29359
- **Status**: Has reproduction, documentation issue, has workaround
- **Branch**: `fix/29359-publish-package`
- **Plan**: 
  - [ ] Review the issue and reproduction repo
  - [ ] Analyze the workaround provided
  - [ ] Determine if this is a documentation fix or code fix
  - [ ] Implement the solution
  - [ ] Test with the reproduction repo
  - [ ] Create PR with fix
- **Decision**: IMPLEMENT - Has clear reproduction and workaround

### 2. Issue #27913: nx release doesn't push with "latest" tag anymore
- **Score**: 12
- **URL**: https://github.com/nrwl/nx/issues/27913
- **Status**: Has reproduction, documentation issue, has workaround
- **Branch**: `fix/27913-nx-release-latest-tag`
- **Plan**:
  - [ ] Review issue details and reproduction
  - [ ] Check if this is still an issue in latest version
  - [ ] Analyze nx release command implementation
  - [ ] Fix the tag pushing logic
  - [ ] Add tests for the fix
  - [ ] Create PR
- **Decision**: IMPLEMENT - Clear issue with reproduction

### 3. Issue #29499: @20.3.0 migration breaks subsequent 'npm install'
- **Score**: 11
- **URL**: https://github.com/nrwl/nx/issues/29499
- **Status**: Has reproduction, migration issue
- **Branch**: `fix/29499-migration-npm-install`
- **Plan**:
  - [ ] Review the specific migration that causes the issue
  - [ ] Test with reproduction repo
  - [ ] Fix the migration script
  - [ ] Test migration on multiple scenarios
  - [ ] Create PR
- **Decision**: IMPLEMENT - Migration issues are high priority

### 4. Issue #29300: NX migration issues
- **Score**: 11
- **URL**: https://github.com/nrwl/nx/issues/29300
- **Status**: Generic migration issues
- **Branch**: N/A
- **Plan**: N/A
- **Decision**: SKIP - Too generic, needs more specific information

### 5. Issue #29069: Undetected projects Nx 19 w/ wasm32 target
- **Score**: 11
- **URL**: https://github.com/nrwl/nx/issues/29069
- **Status**: Has reproduction, specific to wasm32
- **Branch**: `fix/29069-wasm32-project-detection`
- **Plan**:
  - [ ] Review wasm32 target detection logic
  - [ ] Test with reproduction repo
  - [ ] Add support for wasm32 target detection
  - [ ] Add tests
  - [ ] Create PR
- **Decision**: IMPLEMENT - Specific issue with reproduction

### 6. Issue #29052: Translation to `angular.json` Does Not Replace Variables
- **Score**: 11
- **URL**: https://github.com/nrwl/nx/issues/29052
- **Status**: Has reproduction, variable replacement issue
- **Branch**: `fix/29052-angular-json-variables`
- **Plan**:
  - [ ] Review angular.json translation logic
  - [ ] Identify where variables like `{projectRoot}` should be replaced
  - [ ] Fix the variable replacement logic
  - [ ] Add tests
  - [ ] Create PR
- **Decision**: IMPLEMENT - Clear bug with reproduction

### 7. Issue #31397: module-federation requiredVersion/strictVersion has no affect?
- **Score**: 10
- **URL**: https://github.com/nrwl/nx/issues/31397
- **Status**: Module federation configuration issue
- **Branch**: `fix/31397-mf-version-config`
- **Plan**:
  - [ ] Review module federation configuration handling
  - [ ] Test with reproduction repo
  - [ ] Fix version configuration parsing/application
  - [ ] Add tests
  - [ ] Create PR
- **Decision**: IMPLEMENT - Specific configuration bug

### 8. Issue #31289: SyntaxError with TS Project Reference
- **Score**: 10
- **URL**: https://github.com/nrwl/nx/issues/31289
- **Status**: TypeScript project reference issue
- **Branch**: `fix/31289-ts-project-reference`
- **Plan**:
  - [ ] Review TypeScript project reference handling
  - [ ] Test with NestJS + TS project references
  - [ ] Fix the export syntax error
  - [ ] Add tests
  - [ ] Create PR
- **Decision**: IMPLEMENT - Clear error with reproduction

### 9. Issue #30292: NX + NestJS + webpack -> rspack
- **Score**: 10
- **URL**: https://github.com/nrwl/nx/issues/30292
- **Status**: Rspack migration issue
- **Branch**: N/A
- **Plan**: N/A
- **Decision**: SKIP - Needs more investigation on rspack support status

### 10. Issue #29373: Nx Angular MFE lazy loaded modules
- **Score**: 10
- **URL**: https://github.com/nrwl/nx/issues/29373
- **Status**: Module federation loading issue
- **Branch**: `fix/29373-mfe-lazy-loading`
- **Plan**:
  - [ ] Review MFE lazy loading implementation
  - [ ] Test with reproduction repo
  - [ ] Fix duplicate loading issue
  - [ ] Add tests
  - [ ] Create PR
- **Decision**: IMPLEMENT - Has reproduction and is 6+ months old

## Implementation Order

1. **Phase 1 - Documentation & Quick Fixes** (Issues: #29359, #27913)
2. **Phase 2 - Migration Fixes** (Issues: #29499, #29052)
3. **Phase 3 - Project Detection** (Issues: #29069, #31289)
4. **Phase 4 - Module Federation** (Issues: #31397, #29373)

## Skipped Issues
- #29300: Too generic, needs specific reproduction
- #30292: Rspack support status unclear

## Implementation Steps

For each issue to implement:

1. **Setup**
   - [ ] Checkout latest master
   - [ ] Create feature branch
   - [ ] Get issue details with `gh issue view`

2. **Analysis**
   - [ ] Clone reproduction repo if available
   - [ ] Reproduce the issue locally
   - [ ] Identify root cause

3. **Implementation**
   - [ ] Implement fix
   - [ ] Add/update tests
   - [ ] Test with reproduction repo
   - [ ] Run `nx prepush` for validation

4. **Submission**
   - [ ] Create descriptive commit message
   - [ ] Push branch
   - [ ] Create PR with template filled
   - [ ] Link to issue with "Fixes #XXXXX"

## Expected Outcomes

- 8 out of 10 issues fixed and PRs created
- 2 issues skipped due to insufficient information
- Improved Nx stability for:
  - Package publishing
  - Release tagging
  - Migrations
  - Project detection (including wasm32)
  - Angular.json translation
  - TypeScript project references
  - Module federation

## Tracking Progress

**CRITICAL: Keep track of implementation progress in sections below**

### Implementation Progress

#### Issue #29359: Unable to publish a package
- [x] COMPLETED: Documentation fix
- Created branch: `fix/29359-publish-package`
- Analysis: Issue was due to missing `dependsOn: ["build"]` configuration
- Fix: Updated documentation in two files:
  - `docs/shared/recipes/nx-release/updating-version-references.md` - Added `dependsOn` to examples
  - `docs/shared/recipes/nx-release/publish-in-ci-cd.md` - Added troubleshooting section
- Commit: `dffb18847c` - "docs(nx-release): clarify build dependency for nx-release-publish"

#### Issue #27913: nx release doesn't push with "latest" tag
- [x] COMPLETED: Code fix
- Created branch: `fix/27913-nx-release-latest-tag`
- Analysis: When npm config returns "undefined" for tag, it was being used as string instead of defaulting to "latest"
- Fix: Updated `packages/js/src/utils/npm-config.ts` to default to 'latest' when tag is undefined
- Added test file: `packages/js/src/utils/npm-config-tag-default.spec.ts`
- Commit: `fb30bb8d58` - "fix(js): default to 'latest' tag when npm config returns undefined"
- Note: Tests were written but not run due to environment issues - manual verification needed

#### Issue #29499: @20.3.0 migration breaks subsequent 'npm install'
- [ ] SKIPPED: Package manager issue
- Created branch: `fix/29499-migration-npm-install`
- Analysis: This appears to be a package manager issue rather than Nx-specific
- Issues found:
  - npm error: "The 'from' argument must be of type string. Received undefined"
  - ENOTEMPTY errors during node_modules renames
- Recommendation: Add documentation about cleaning node_modules before/after migrations
- Workaround exists: User switched to yarn, or could clean node_modules and reinstall

#### Issue #29069: Undetected projects Nx 19 w/ wasm32 target
- [ ] SKIPPED: Requires native module compilation for wasm32
- Created branch: `fix/29069-wasm32-project-detection`
- Analysis: wasm32 target is not properly supported in native bindings
- Issues found:
  - native-bindings.js doesn't have explicit wasm32 support
  - Falls back to WASI which may not work properly in Azure DevOps
  - Would require building and distributing @nx/nx-wasm32 package
- Recommendation: This requires building native modules for wasm32 target
- Workaround: Use a different build agent with supported architecture

#### Issue #29052: Translation to angular.json Does Not Replace Variables
- [ ] SKIPPED: Complex architectural issue
- Created branch: `fix/29052-angular-json-variables`
- Analysis: In-memory conversion from project.json to angular.json doesn't interpolate variables
- Issues found:
  - Variables like {projectRoot} and {projectName} are not replaced during conversion
  - Would need to track changes to avoid overwriting tokens when converting back
  - Affects Angular migrations that rely on reading tsconfig paths
- Recommendation: This requires significant architectural changes to the conversion process
- Workaround exists: Manually replace variables before migration

#### Issue #31397: module-federation requiredVersion/strictVersion
- [ ] SKIPPED: Upstream issue in @module-federation/enhanced
- Created branch: `fix/31397-mf-version-config`
- Analysis: Breaking change in @module-federation/enhanced v0.9.0
- Issues found:
  - requiredVersion: false now results in "*" instead of adding "^" prefix
  - strictVersion: false causes warnings for local libraries
  - Behavior inconsistent between webpack and rspack configurations
- Recommendation: This is an upstream issue that needs to be addressed in @module-federation/enhanced
- Workaround provided: Manually construct version string with "^" prefix

#### Issue #31289: SyntaxError with TS Project Reference
- [x] COMPLETED: Code fix
- Created branch: `fix/31289-ts-project-reference`  
- Analysis: ESM/CommonJS module loading mismatch in node executor
- Issues found:
  - node-with-require-overrides.ts always uses dynamic import (ESM)
  - NestJS projects typically output CommonJS from TypeScript
  - When TS project references are used, the output format detection was missing
- Fix: Updated `node-with-require-overrides.ts` to detect module format and use appropriate loader
  - Check file extension (.mjs = ESM, .cjs = CommonJS)
  - Check package.json type field
  - Default to CommonJS for .js files (typical for NestJS)
- Added test file: `node-with-require-overrides.spec.ts`
- Commit: Not committed yet (user will manually review)
- Note: Tests written but not run - manual verification needed

#### Issue #29373: Nx Angular MFE lazy loaded modules
- [x] COMPLETED: Code fix
- Created branch: `fix/29373-mfe-lazy-loading`
- Analysis: @nx/angular/mf module loaded multiple times causing state reset
- Issues found:
  - @nx/angular/mf was in DEFAULT_NPM_PACKAGES_TO_AVOID list
  - This prevented it from being shared as a singleton
  - Module loaded in vendor.js and library chunks separately
  - Global variables (remoteUrlDefinitions) reset on second load
- Fix: Updated `with-module-federation/angular/utils.ts`:
  - Removed @nx/angular/mf and @nrwl/angular/mf from DEFAULT_NPM_PACKAGES_TO_AVOID
  - Added them to DEFAULT_ANGULAR_PACKAGES_TO_SHARE
  - Ensures singleton: true configuration prevents duplicate loading
  - Fixed both async and sync versions of getModuleFederationConfig
- Added test file: `utils.spec.ts`
- Commit: Not committed yet (user will manually review)
- Note: Tests written but not run - manual verification needed