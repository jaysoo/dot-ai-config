# Summary - November 19, 2025

## Completed Tasks

### NXC-3501: Fix ESLint Flat Config JSON Parsing for Complex Spread Elements
- **Issue**: https://github.com/nrwl/nx/issues/31796
- **Linear**: https://linear.app/nxdev/issue/NXC-3501
- **Plan**: `.ai/2025-11-19/tasks/NXC-3501-flat-config-ast-parsing.md`
- **Goal**: Fix `InvalidSymbol in JSON` error when ESLint flat configs contain complex spread elements

**Problem**: The `hasOverride` and `replaceOverride` functions used regex-based JSON parsing that failed on:
- `...(jest.configs['flat/recommended'])` - parenthesized expressions
- `...getConfig()` - function calls
- `...configs['recommended']` - element access
- Variable references like `parser: jsoncParser`

**Solution**: Replaced regex/JSON parsing in `hasOverride` with AST-based property extraction using TypeScript compiler API. The `replaceOverride` function was left unchanged to preserve proper handling of `languageOptions.parser` during config updates.

**Files Modified**:
- `packages/eslint/src/generators/utils/flat-config/ast-utils.ts`:
  - Added `extractLiteralValue` helper function
  - Added `extractPropertiesFromObjectLiteral` helper function
  - Updated `hasOverride` function to use AST extraction
  - `replaceOverride` unchanged (uses original `parseTextToJson` approach)
- `packages/eslint/src/generators/utils/flat-config/ast-utils.spec.ts`:
  - Added 10 new test cases for `hasOverride` covering all problematic patterns

**Test Results**: 306 tests pass, 155 snapshots pass, prepush validation passes

**Important Note**: Initially modified both `hasOverride` and `replaceOverride`, but this caused a regression where the plugin generator's `languageOptions.parser` was being lost. Reverted `replaceOverride` to only fix the specific function that had the bug.

---

### NXC-3491: Add Node 24 to E2E Nightly Matrix
- **Issue**: https://linear.app/nxdev/issue/NXC-3491/add-node-24-for-nightlies
- **Goal**: Update e2e nightly GitHub Actions workflow to include Node 24 support
- **Files Modified**:
  - `.github/workflows/e2e-matrix.yml` - Added Node 24 to preinstall job matrix
  - `.github/workflows/nightly/process-matrix.ts` - Added Node 24.0.0 to matrix generator

**Changes Made**:
- Added Node 24 to the test matrix for Linux (with npm, pnpm, yarn)
- Updated macOS and Windows to run Node 24 instead of Node 20
- Added `TODO(v23): remove node 20 - EOL April 2026` comments for future cleanup

**Final Matrix Configuration**:
- **Linux**: Node 20, 22, 24 (with npm, pnpm, yarn)
- **macOS**: Node 24 only (with npm)
- **Windows**: Node 24 only (commented out due to gradle issues)

**Commit**: `chore(misc): add Node 24 to e2e nightly matrix`

## Notes
- Node 20 reaches EOL in April 2026 and will be removed from Nx support in v23
- Windows support is currently disabled due to gradle wrapper build failures
