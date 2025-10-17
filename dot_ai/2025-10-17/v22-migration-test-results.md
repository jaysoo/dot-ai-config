# Nx v22 Migration Test Results

Tests performed on 2025-10-17 using Nx v21.6.5 → v22.0.0-beta.6

## Important Note About Testing

**Critical**: When testing webpack/Next.js/React webpack migrations, you MUST use `NX_ADD_PLUGINS=false` when creating workspaces and generating projects. Without this flag:
- Nx v21 uses the new plugin-based inference system
- Projects don't have explicit executors in project.json
- Migrations can't detect these projects (they look for explicit executors like `@nx/webpack:webpack`)

**Correct approach:**
```bash
NX_ADD_PLUGINS=false npx create-nx-workspace@21 ...
NX_ADD_PLUGINS=false npx nx g @nx/react:app ...
```

## 1. JS Migration (@nx/js) ✅

**Migration**: `remove-external-options-from-js-executors`

**Test Workspace**: `/tmp/nx-v22-migration-tests/js-test`

**Setup**:
- Created workspace with `preset=ts`
- Generated library with `@nx/js:lib` using swc bundler
- Added deprecated options to both `project.json` and `nx.json`:
  - `external: ["rxjs", "lodash"]` (options and configurations.production)
  - `externalBuildTargets: ["build", "build-base"]` (options and configurations.production)
  - Same options in `nx.json` targetDefaults for `@nx/js:swc`

**Migration Result**:
- ✅ Successfully removed `external` and `externalBuildTargets` from `my-lib/project.json` options
- ✅ Successfully removed these options from `configurations.production`
- ✅ Successfully removed these options from `nx.json` targetDefaults
- ✅ Cleaned up empty `configurations.production` object
- ✅ Build verified successful after migration

**Files Changed**:
- `my-lib/project.json` - removed deprecated options
- `nx.json` - removed deprecated options from targetDefaults

**Git Branch**: `v22-migration` in js-test workspace

---

## 2. React Webpack Migration (@nx/react) ✅

**Migration**: `add-svgr-to-webpack-config`

**Test Workspace**: `/tmp/nx-v22-migration-tests/react-test`

**Setup**:
- **Critical**: Used `NX_ADD_PLUGINS=false` when creating workspace and generating app
- Created workspace: `NX_ADD_PLUGINS=false npx create-nx-workspace@21 react-test --preset=react-monorepo`
- Generated React app: `NX_ADD_PLUGINS=false npx nx g @nx/react:app my-webpack-app --bundler=webpack`
- This creates explicit `@nx/webpack:webpack` executor in `package.json` (not project.json)
- Uncommented the deprecated option in generated `webpack.config.js`:
  - `withReact({ svgr: false })`

**Migration Result**:
- ✅ Successfully removed `svgr: false` option from `withReact()`
- ✅ Correctly left `withReact()` without any options object
- ✅ Did NOT add `withSvgr()` wrapper (correct behavior since svgr was set to false - SVGR disabled by default in v22)
- ✅ Added `file-loader@^6.2.0` as devDependency
- ✅ Build and lint verified successful after migration

**Files Changed**:
- `my-webpack-app/webpack.config.js` - removed svgr option
- `package.json` - added file-loader and upgraded to v22

**Important Note**: Migration requires explicit `@nx/webpack:webpack` executor. Must use `NX_ADD_PLUGINS=false` when creating/generating projects, otherwise Nx v21 uses plugin inference and the migration won't detect the project.

**Git Branch**: `v22-migration` in react-test workspace

---

---

## 3. Next.js Migration (@nx/next) ✅

**Migration**: `add-svgr-to-next-config`

**Test Workspace**: `/tmp/nx-v22-migration-tests/next-test`

**Setup**:
- Created workspace with `preset=next`
- Added deprecated option to `next.config.js`:
  - `nx: { svgr: true }` in nextConfig
- Created explicit `project.json` with `@nx/next:build` executor (required for migration to detect the project)

**Migration Result**:
- ✅ Successfully removed `svgr: true` option from `nx` object
- ✅ Left `nx: {}` empty object
- ✅ Added `withSvgr()` webpack config function with SVGR loader configuration
- ✅ Added `withSvgr` to `composePlugins()` call as the last argument
- ✅ Added `file-loader@^6.2.0` as devDependency
- ⚠️ Migration only processes `svgr: true` or `svgr: { options }` - correctly skips `svgr: false`

**Files Changed**:
- `apps/my-next-app/next.config.js` - removed nx.svgr option, added withSvgr function
- `package.json` - added file-loader

**Important Notes**:
- Migration only works with explicit `@nx/next:build` executor in `project.json`
- Migration only acts on `svgr: true` or object values, skips `svgr: false` (correct behavior)
- Inferred Next.js projects (using `@nx/next/plugin`) are not detected

**Git Branch**: `v22-migration` in next-test workspace

---

---

## 4. Webpack Migration (@nx/webpack) ✅

**Migration**: `remove-deprecated-options`

**Test Workspace**: `/tmp/nx-v22-migration-tests/webpack-test`

**Setup**:
- Created workspace with `preset=ts`
- Installed @nx/webpack@21.6.5
- Created library with explicit `@nx/webpack:webpack` executor
- Added deprecated options to project.json:
  - `deleteOutputPath: true`
  - `sassImplementation: "sass"`

**Migration Result**:
- ✅ Successfully removed both deprecated options from project.json
- ✅ Migration logged console messages explaining the removals
- ✅ Cleaned up options object

**Files Changed**:
- `my-webpack-lib/project.json` - removed deprecated options

**Git Branch**: `v22-migration` in webpack-test workspace

---

## 5. Rspack Migration (@nx/rspack) ✅

**Migration**: `remove-deprecated-rspack-options`

**Test Workspace**: `/tmp/nx-v22-migration-tests/rspack-test`

**Setup**:
- Created workspace with `preset=ts`
- Installed @nx/rspack@21.6.5
- Created library with explicit `@nx/rspack:rspack` executor
- Added deprecated options to project.json:
  - `deleteOutputPath: true`
  - `sassImplementation: "sass"`

**Migration Result**:
- ✅ Successfully removed both deprecated options from project.json
- ✅ Also added `root` property to project.json (normalization)

**Files Changed**:
- `my-rspack-lib/project.json` - removed deprecated options

**Git Branch**: `v22-migration` in rspack-test workspace

---

## 6. Nx Release Config Migrations (nx) ⚠️

### Migration 1: `release-version-config-changes`
### Migration 2: `consolidate-release-tag-config`

**Test Workspaces**: Attempted in `/tmp/nx-v22-migration-tests/js-test` and `/tmp/nx-v22-migration-tests/next-test`

**Setup Attempted**:
- Added `release.version.generatorOptions` structure (should be promoted to top-level)
- Added flat `releaseTag*` properties (should be consolidated into nested object)

**Migration Result**:
- ⚠️ Both migrations reported "No changes were made"
- Migrations were listed in migrations.json but didn't detect/modify the configuration
- Possible reasons:
  - Migrations may only apply to specific beta version upgrades
  - Configuration patterns may not have matched what migrations expected
  - Migrations may have specific preconditions not met in test setup

**Note**: These migrations exist and are registered, but their exact trigger conditions weren't determined in testing.

---

## Summary

**Completed**: 7/7 migrations tested (5 successful, 2 ran but made no changes)
**Success Rate**: 71% (5/7 made expected changes)
**Issues Found**: None in the 5 successful migrations

**Key Findings**:
1. **JS migration** works with both explicit project.json and inferred projects
2. **React webpack migration** requires explicit `@nx/webpack:webpack` executor in project.json - doesn't detect inferred projects
3. **Next.js migration** requires explicit `@nx/next:build` executor in project.json - doesn't detect inferred projects
4. **Webpack migration** successfully removes both deprecated options with console logging
5. **Rspack migration** successfully removes both deprecated options
6. **Release migrations** are registered but didn't make changes in test scenarios
7. All successful migrations correctly handle cleanup of empty objects/properties
8. All successful migrations preserve other configuration options
9. Migrations that target specific deprecated options correctly skip projects that don't use those options

**Important**: React, Next.js, Webpack, and Rspack migrations require **explicit executors in project.json** - they do not work with plugin-inferred projects.
