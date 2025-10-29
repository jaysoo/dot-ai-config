# Summary - October 29, 2025

## Storybook 10 Upgrade - Code Review (PR #33277)

**Goal**: Comprehensive review of Storybook 10 upgrade implementation for Nx
**Status**: Review completed with findings and recommendations
**Branch**: `storybook-support-10` (storybook/support-10)

### Review Findings

**Overall Assessment**: Implementation is solid and production-ready after addressing minor issues.

#### Bugs Identified:
1. **Typo in schema.json** (Line 15)
   - "proejcts" → should be "projects"
   - Location: `packages/storybook/src/generators/migrate-10/schema.json:15`

2. **Grammar error in error message**
   - "Please version 8.0.0" → "Please use version 8.0.0"
   - Location: `packages/angular/src/generators/storybook-configuration/lib/assert-compatible-storybook-version.ts:12`

3. **Version detection logic could be clearer**
   - Current: `(getStorybookMajorVersion(tree) ?? 10) <= 9 ? 9 : 10`
   - Works correctly but confusing; recommend more explicit logic
   - Location: `packages/storybook/src/generators/configuration/lib/util-functions.ts:612`

#### Architecture Review:
- ✅ **Good patterns**:
  - Dual template approach (v9/v10 side-by-side)
  - Dynamic version detection for template selection
  - Delegates migration to official Storybook CLI
  - Maintains backward compatibility

- ✅ **Dependency management**:
  - Proper version bumps (storybookVersion: '^10.0.0')
  - Vite updated to ^6.0.0
  - Correct removal of deprecated options (staticDir)

- ✅ **ESM compatibility**:
  - Uses `import.meta.resolve` (Storybook 10 requirement)
  - `getAbsolutePath()` helper function implemented
  - Module resolution set to 'esnext'/'bundler' for v10

#### Questions for Maintainer:
1. React package.json exports (154 lines added) - related to this PR or separate?
2. Removed e2e test "should edit root tsconfig.json" - confirmed no longer needed?
3. `checkStorybookInstalled` requires both `storybook` AND `@nx/storybook` - intentional?

### Key Implementation Details:

**New Files**:
- `packages/storybook/src/generators/migrate-10/` - Migration generator
- `packages/storybook/src/generators/configuration/files/v10/` - v10 templates
- Generator registered in `generators.json`

**Modified Behavior**:
- Configuration generator detects Storybook version and uses appropriate templates
- Executor validation updated: throws error for v7 and below
- Deprecation warning for v8 (recommends upgrading to v9)
- TypeScript config: sets `module: 'esnext'` and `moduleResolution: 'bundler'` for v10
- Dependencies: `@storybook/addon-essentials` and `@storybook/core-server` only for v8 and below

**Breaking Changes**:
- Storybook 7 and lower no longer supported (throws error with upgrade guide)
- Removed `staticDir` schema options (deprecated since 6.4)

### Statistics:
- **Files changed**: 58
- **Additions**: +2,894 lines
- **Deletions**: -1,363 lines
- **Test coverage**: Extensive snapshots for v10 configuration

### Next Steps:
1. Fix typos in schema.json and error messages
2. Consider clarifying version detection logic
3. Answer questions about React exports and removed tests
4. Ready for merge after addressing minor issues

---

**Related Issue**: Fixes #33141
**PR**: https://github.com/nrwl/nx/pull/33277
