# V22 Migrations Test Plan

**Date**: 2025-10-17
**Total Migrations**: 7 migrations across 6 packages

## Summary by Package

- @nx/js: 1 migration
- @nx/next: 1 migration
- @nx/nx: 2 migrations
- @nx/react: 1 migration
- @nx/rspack: 1 migration
- @nx/webpack: 1 migration

---

## 1. @nx/js

### Migration: `remove-external-options-from-js-executors`
- **Version**: 22.0.0-beta.0
- **Description**: Remove the deprecated `external` and `externalBuildTargets` options from the `@nx/js:swc` and `@nx/js:tsc` executors.
- **Implementation**: `packages/js/src/migrations/update-22-0-0/remove-external-options-from-js-executors`

#### Test Cases
- [ ] Test case 1: Verify `external` option is removed from `@nx/js:swc` executor config
- [ ] Test case 2: Verify `external` option is removed from `@nx/js:tsc` executor config
- [ ] Test case 3: Verify `externalBuildTargets` option is removed from `@nx/js:swc` executor config
- [ ] Test case 4: Verify `externalBuildTargets` option is removed from `@nx/js:tsc` executor config
- [ ] Test case 5: Verify other executor options remain unchanged
- [ ] Test case 6: Handle projects with no deprecated options (no-op)

---

## 2. @nx/next

### Migration: `update-22-0-0-add-svgr-to-next-config`
- **Version**: 22.0.0-beta.0
- **Description**: Updates next.config.js files to add SVGR webpack configuration directly instead of using the nx.svgr option in withNx.
- **Implementation**: `packages/next/src/migrations/update-22-0-0/add-svgr-to-next-config`
- **CLI**: nx

#### Test Cases
- [ ] Test case 1: Migrate `nx.svgr: true` in withNx to webpack SVGR config
- [ ] Test case 2: Handle next.config.js without svgr option (no-op)
- [ ] Test case 3: Preserve existing webpack configuration
- [ ] Test case 4: Handle TypeScript next.config files
- [ ] Test case 5: Handle both JavaScript and TypeScript config files
- [ ] Test case 6: Verify correct SVGR webpack rule is added

---

## 3. @nx/nx

### Migration 1: `22-0-0-release-version-config-changes`
- **Version**: 22.0.0-beta.1
- **Description**: Updates release version config based on the breaking changes in Nx v22
- **Implementation**: `packages/nx/src/migrations/update-22-0-0/release-version-config-changes`

#### Test Cases
- [ ] Test case 1: Identify deprecated release version config options
- [ ] Test case 2: Update release version config structure
- [ ] Test case 3: Preserve custom release configuration
- [ ] Test case 4: Handle workspaces without release config (no-op)
- [ ] Test case 5: Validate new config structure matches v22 schema

### Migration 2: `22-0-0-consolidate-release-tag-config`
- **Version**: 22.0.0-beta.2
- **Description**: Consolidates releaseTag* options into nested releaseTag object structure
- **Implementation**: `packages/nx/src/migrations/update-22-0-0/consolidate-release-tag-config`

#### Test Cases
- [ ] Test case 1: Consolidate `releaseTagPattern` into `releaseTag.pattern`
- [ ] Test case 2: Consolidate other releaseTag* options into nested structure
- [ ] Test case 3: Handle partial releaseTag* configurations
- [ ] Test case 4: Preserve non-releaseTag configuration
- [ ] Test case 5: Handle workspaces without releaseTag config (no-op)

---

## 4. @nx/react

### Migration: `update-22-0-0-add-svgr-to-webpack-config`
- **Version**: 22.0.0-beta.0
- **Description**: Updates webpack configs using React to use the new withSvgr composable function instead of the svgr option in withReact or NxReactWebpackPlugin.
- **Implementation**: `packages/react/src/migrations/update-22-0-0/add-svgr-to-webpack-config`
- **CLI**: nx

#### Test Cases
- [ ] Test case 1: Replace `svgr` option in withReact with withSvgr composable
- [ ] Test case 2: Replace `svgr` option in NxReactWebpackPlugin with withSvgr
- [ ] Test case 3: Add import for withSvgr function
- [ ] Test case 4: Handle projects without svgr option (no-op)
- [ ] Test case 5: Preserve existing webpack configuration
- [ ] Test case 6: Handle both JS and TS webpack config files

---

## 5. @nx/rspack

### Migration: `remove-deprecated-rspack-options`
- **Version**: 22.0.0-beta.1
- **Description**: Remove deprecated deleteOutputPath and sassImplementation options from rspack configurations.
- **Implementation**: `packages/rspack/src/migrations/update-22-0-0/remove-deprecated-options`
- **CLI**: nx

#### Test Cases
- [ ] Test case 1: Remove `deleteOutputPath` option from rspack config
- [ ] Test case 2: Remove `sassImplementation` option from rspack config
- [ ] Test case 3: Verify other rspack options remain unchanged
- [ ] Test case 4: Handle projects without deprecated options (no-op)
- [ ] Test case 5: Handle both options present simultaneously

---

## 6. @nx/webpack

### Migration: `update-22-0-0-remove-deprecated-options`
- **Version**: 22.0.0-beta.0
- **Description**: Remove deprecated deleteOutputPath and sassImplementation options from @nx/webpack:webpack
- **Implementation**: `packages/webpack/src/migrations/update-22-0-0/remove-deprecated-options`
- **CLI**: nx

#### Test Cases
- [ ] Test case 1: Remove `deleteOutputPath` option from webpack executor
- [ ] Test case 2: Remove `sassImplementation` option from webpack executor
- [ ] Test case 3: Verify other webpack options remain unchanged
- [ ] Test case 4: Handle projects without deprecated options (no-op)
- [ ] Test case 5: Handle both options present simultaneously

---

## Testing Strategy

### Unit Tests
Each migration should have unit tests covering:
- Basic happy path (options present and removed/migrated)
- No-op scenarios (options already migrated or not present)
- Edge cases (multiple projects, nested configurations)
- Error handling (malformed configs)

### Integration Tests
- Test migrations on real workspace fixtures
- Verify migrations can be run sequentially
- Test rollback/idempotency where applicable

### Validation
- All migrations should be idempotent (safe to run multiple times)
- Migrations should not fail on already-migrated workspaces
- Migration output should be clear and actionable
