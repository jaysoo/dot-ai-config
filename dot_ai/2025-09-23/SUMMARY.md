# Daily Summary - September 23, 2025

## Completed Tasks

### NXC-3108: Remove Deprecated Webpack Options for v22
- **Linear Issue**: [NXC-3108](https://linear.app/nxdev/issue/NXC-3108)
- **Branch**: NXC-3108
- **Goal**: Address TODO(v22) comments in webpack plugin to remove deprecated options

#### Changes Made:
1. **Created Migration** (`update-22-0-0/remove-deprecated-options.ts`)
   - Automatically removes deprecated options from existing project configurations
   - Handles both `@nx/webpack:webpack` and `@nrwl/webpack:webpack` executors
   - Provides console messages explaining the changes to users

2. **Removed Deprecated Options**:
   - **`deleteOutputPath`** (line 87 in nx-app-webpack-plugin-options.ts)
     - Users should now use Webpack's `output.clean` option instead
     - Removed from all interfaces, schemas, and implementations

   - **`sassImplementation`** (line 224 in nx-app-webpack-plugin-options.ts)
     - Option is no longer needed as `sass-embedded` is now the default
     - Hardcoded `sass-embedded` as the implementation in all SASS loaders

3. **Updated Files** (13 total):
   - Interface definitions and type schemas
   - Webpack executor implementation
   - Plugin normalization and configuration files
   - Schema files (both `.json` and `.d.ts`)
   - Utility functions and composable plugins

4. **Added Comprehensive Tests**:
   - Created test suite with 11 test cases covering various scenarios
   - Tests verify correct removal of options from both direct options and configurations
   - All tests passing successfully

#### Testing Results:
- Migration tests: ✅ All 11 tests passing
- Type checking: ✅ No TypeScript errors
- Build validation: ✅ Successful compilation

This work aligns with the v22 cleanup effort, similar to the rspack PR #32756, ensuring a cleaner API surface for users upgrading to Nx v22.

## Notes
- The changes are breaking changes (marked with `!` in commit message) as they remove options from the public API
- A migration ensures existing workspaces will be automatically updated when upgrading to v22
- The pattern followed matches other v22 cleanup work across the Nx monorepo

## Commit
- `25d82d78a8`: feat(webpack)!: remove deprecated deleteOutputPath and sassImplementation options