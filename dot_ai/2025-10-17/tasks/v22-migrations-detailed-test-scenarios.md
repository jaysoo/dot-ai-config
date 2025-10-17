# V22 Migrations - Detailed Test Scenarios (Based on Implementation Analysis)

**Date**: 2025-10-17
**Total Migrations**: 7 migrations across 6 packages

This document contains detailed test scenarios derived from analyzing the actual migration implementations and existing spec files.

---

## 1. @nx/js - `remove-external-options-from-js-executors`

**File**: `packages/js/src/migrations/update-22-0-0/remove-external-options-from-js-executors.ts`

### What It Does
- Removes deprecated `external` and `externalBuildTargets` options from `@nx/js:swc` and `@nx/js:tsc` executors
- Scans both project configurations and nx.json targetDefaults
- Cleans up empty options objects after removal
- Preserves empty configurations (users may rely on them)

### Existing Test Coverage
✅ Already has comprehensive tests for:
- Removing options from both executors
- Removing from configurations
- Cleaning up empty options objects
- Preserving empty configurations
- Handling nx.json target defaults
- Handling executor-specific defaults
- Idempotency

### Additional Test Scenarios Needed

#### Edge Case 1: Multiple projects with mixed configurations
```typescript
// Project 1: Has options only in base
// Project 2: Has options only in configurations
// Project 3: Has options in both base and configurations
```

#### Edge Case 2: Nested configuration inheritance
```typescript
// Target with options in nx.json targetDefaults
// Project overrides some but not all options
```

#### Edge Case 3: Only one deprecated option present
```typescript
// Only external present (no externalBuildTargets)
// Only externalBuildTargets present (no external)
```

---

## 2. @nx/next - `add-svgr-to-next-config`

**File**: `packages/next/src/migrations/update-22-0-0/add-svgr-to-next-config.ts`

### What It Does
- Finds Next.js projects using `withNx` with `nx.svgr` option
- Removes `nx.svgr` from next.config.js
- Adds inline `withSvgr` function after imports
- Adds `withSvgr` to `composePlugins` call
- Handles both boolean values and options objects
- Adds `file-loader` as dev dependency

### Existing Test Coverage
✅ Already has comprehensive tests for:
- Removing svgr: false (no migration needed)
- Adding withSvgr when svgr: true
- Handling custom svgr options
- Spread operator patterns
- Multiple Next.js projects
- Preserving other nx options
- Empty nx object handling

### Additional Test Scenarios Needed

#### Edge Case 1: No plugins array declaration
```javascript
// Direct composePlugins call without plugins variable
module.exports = composePlugins(withNx({ nx: { svgr: true } }))(nextConfig);
```

#### Edge Case 2: TypeScript configuration files
```typescript
// next.config.ts instead of next.config.js
const nextConfig: NextConfig = { /* ... */ };
```

#### Edge Case 3: Mixed svgr values across projects
```javascript
// Project 1: svgr: true
// Project 2: svgr: { custom: options }
// Project 3: svgr: false
```

#### Edge Case 4: Existing webpack configuration
```javascript
// nextConfig already has a webpack function
const nextConfig = {
  nx: { svgr: true },
  webpack: (config) => {
    // existing webpack config
    return config;
  }
};
```

#### Edge Case 5: Non-standard composePlugins format
```javascript
// Multiple composePlugins calls
// Nested composePlugins
```

---

## 3. @nx/nx - `release-version-config-changes`

**File**: `packages/nx/src/migrations/update-22-0-0/release-version-config-changes.ts`

### What It Does
- Migrates `generatorOptions` properties to top-level options
- Handles: specifierSource, currentVersionResolver, currentVersionResolverMetadata, fallbackCurrentVersionResolver, versionPrefix, updateDependents, logUnchangedProjects
- Special handling for `preserveLocalDependencyProtocols` (removes if true, sets to false if not present)
- Replaces `packageRoot` with `manifestRootsToUpdate` array
- Moves install options to `versionActionsOptions`: skipLockFileUpdate, installArgs, installIgnoreScripts
- Updates nx.json, project.json, and package.json files
- Handles release groups

### Existing Test Coverage
✅ Already has comprehensive tests for:
- Promoting generatorOptions to top-level
- preserveLocalDependencyProtocols handling
- packageRoot to manifestRootsToUpdate conversion
- Moving to versionActionsOptions
- Release groups migration
- project.json and package.json updates

### Additional Test Scenarios Needed

#### Edge Case 1: Partial migrations
```json
// Some options already migrated, others still in generatorOptions
{
  "release": {
    "version": {
      "specifierSource": "prompt", // already migrated
      "generatorOptions": {
        "updateDependents": "auto" // not yet migrated
      }
    }
  }
}
```

#### Edge Case 2: Multiple release groups with different configurations
```json
// Group 1: All options in generatorOptions
// Group 2: Mixed migrated/unmigrated
// Group 3: Already migrated
```

#### Edge Case 3: Empty generatorOptions after migration
```json
// Should remove generatorOptions property entirely
```

#### Edge Case 4: Non-standard property values
```json
// Test with actual metadata objects, arrays, complex values
```

---

## 4. @nx/nx - `consolidate-release-tag-config`

**File**: `packages/nx/src/migrations/update-22-0-0/consolidate-release-tag-config.ts`

### What It Does
- Migrates flat `releaseTag*` properties to nested `releaseTag` object
- Properties: releaseTagPattern → pattern, releaseTagPatternCheckAllBranchesWhen → checkAllBranchesWhen, etc.
- Prevents overwriting if new format already exists
- Handles nx.json, project.json, package.json
- Handles release groups

### Existing Test Coverage
✅ Already has comprehensive tests for:
- Top-level release configuration
- Release groups
- project.json and package.json
- Not overriding new format with old
- Partial migrations
- No-op when no old properties exist
- Mixed old and new across groups

### Additional Test Scenarios Needed

#### Edge Case 1: Some properties already migrated
```json
// releaseTag object exists with some properties
// Old format properties also present for other options
```

#### Edge Case 2: All five properties present
```json
// Test with all possible releaseTag* properties
```

#### Edge Case 3: Complex property values
```json
// checkAllBranchesWhen with array of branches
// preferDockerVersion with "both" value
```

#### Edge Case 4: Empty releaseTag object after migration
```json
// Should this be kept or removed?
```

---

## 5. @nx/react - `add-svgr-to-webpack-config`

**File**: `packages/react/src/migrations/update-22-0-0/add-svgr-to-webpack-config.ts`

### What It Does
- Handles two patterns: `withReact({ svgr: true })` and `NxReactWebpackPlugin({ svgr: true })`
- For withReact: Removes svgr from options, adds `withSvgr()` function, adds to composePlugins
- For NxReactWebpackPlugin: Removes svgr, wraps module.exports with `withSvgr()(config)`
- Handles both boolean and options object for svgr
- Handles CommonJS and ESM formats
- Adds `file-loader` as dev dependency
- Preserves existing imports and structure

### Existing Test Coverage
✅ Already has comprehensive tests for:
- withReact with svgr: true/false/options
- NxReactWebpackPlugin with svgr: true/false/options
- Preserving imports
- module.exports vs export default
- Variable references
- Multiple configs in workspace

### Additional Test Scenarios Needed

#### Edge Case 1: Mixed patterns in same workspace
```javascript
// App 1: Uses withReact
// App 2: Uses NxReactWebpackPlugin
// App 3: Uses neither
```

#### Edge Case 2: Existing SVG loaders in webpack config
```javascript
// Config already has custom SVG handling
// Should withSvgr function handle this gracefully?
```

#### Edge Case 3: Multiple withReact calls
```javascript
// Nested or chained withReact calls
```

#### Edge Case 4: TypeScript webpack configs
```typescript
// webpack.config.ts files
```

#### Edge Case 5: No imports/requires section
```javascript
// File starts directly with module.exports
```

---

## 6. @nx/rspack - `remove-deprecated-options`

**File**: `packages/rspack/src/migrations/update-22-0-0/remove-deprecated-options.ts`

### What It Does
- Removes `deleteOutputPath` and `sassImplementation` from `@nx/rspack:rspack` and `@nx/rspack:dev-server`
- Updates project.json files
- Also scans rspack.config.ts/js files and replaces options with explanatory comments
- Replacement comments explain migration path

### Existing Test Coverage
✅ Already has comprehensive tests for:
- Removing from options
- Removing from configurations
- Adding comments in config files
- Both options together
- Idempotency
- dev-server executor
- No changes needed scenario

### Additional Test Scenarios Needed

#### Edge Case 1: Multiple rspack configs in one project
```javascript
// rspack.config.js
// rspack.config.prod.js
// rspack.config.dev.js
```

#### Edge Case 2: Config file with complex nested options
```javascript
module.exports = {
  build: {
    deleteOutputPath: true,
    options: {
      sassImplementation: 'sass'
    }
  }
};
```

#### Edge Case 3: Config file uses require for options
```javascript
const options = require('./rspack-options');
module.exports = {
  ...options,
  deleteOutputPath: true
};
```

#### Edge Case 4: Different variations of option values
```javascript
// deleteOutputPath: false (should still remove)
// sassImplementation: "sass" vs 'sass-embedded'
```

#### Edge Case 5: Ignored files
```javascript
// Files in .gitignore or node_modules
// Should these be processed?
```

---

## 7. @nx/webpack - `remove-deprecated-options`

**File**: `packages/webpack/src/migrations/update-22-0-0/remove-deprecated-options.ts`

### What It Does
- Removes `deleteOutputPath` and `sassImplementation` from `@nx/webpack:webpack` executor
- Handles both `@nx/webpack:webpack` and `@nrwl/webpack:webpack` executors
- Updates project configurations only (no config file scanning like rspack)
- Logs messages to console explaining removals

### Existing Test Coverage
✅ Already has comprehensive tests for:
- Removing from options
- Removing from configurations
- Both options together
- Both @nx and @nrwl executors
- Not modifying other executors
- Projects with no targets
- Targets with no options
- Multiple projects

### Additional Test Scenarios Needed

#### Edge Case 1: Mixed executors in same project
```json
// One target uses @nx/webpack:webpack
// Another target uses @nx/vite:build
```

#### Edge Case 2: Console logging verification
```typescript
// Verify correct messages are logged
// Verify project and target names in messages
```

#### Edge Case 3: Different option values
```json
// deleteOutputPath: false (should still remove)
// sassImplementation: "sass" vs "sass-embedded"
```

#### Edge Case 4: No project.json files
```json
// Projects defined only in nx.json (standalone apps)
```

#### Edge Case 5: Corrupted or malformed configurations
```json
// Missing executor property
// Invalid JSON structure
```

---

## Cross-Migration Test Scenarios

### Scenario 1: Running all migrations in sequence
- Create a workspace using deprecated features from all packages
- Run all migrations
- Verify all are properly migrated
- Verify no conflicts between migrations

### Scenario 2: Partial upgrade paths
- User has already manually migrated some packages
- Running migrations should not break or duplicate changes

### Scenario 3: Re-running migrations (idempotency)
- Run each migration twice
- Verify no errors
- Verify no duplicate changes

### Scenario 4: Large monorepos
- 100+ projects
- Performance testing
- Memory usage
- Progress reporting

### Scenario 5: Edge cases across all migrations
- Empty workspaces
- Workspaces with no matching projects
- Workspaces with corrupted config files
- Workspaces with minimal configurations

---

## Testing Strategy Summary

### Unit Tests
Each migration should have tests for:
1. **Happy path**: Standard migration scenario
2. **No-op**: Already migrated or not applicable
3. **Edge cases**: Complex configurations, special values
4. **Error handling**: Malformed configs, missing files
5. **Idempotency**: Running twice produces same result

### Integration Tests
1. Full workspace migrations
2. Multiple migrations in sequence
3. Cross-package interactions
4. Format preservation (formatting, comments, structure)

### Manual Testing Checklist
- [ ] Run each migration on a real project
- [ ] Verify builds still work after migration
- [ ] Verify documentation is accurate
- [ ] Verify error messages are helpful
- [ ] Check for performance issues

### Test Data Requirements
- Sample workspaces for each package
- Edge case configurations
- Performance test fixtures (large workspaces)
- Corrupted/malformed configurations

---

## Coverage Gaps Identified

### @nx/js
- Missing tests for mixed project configurations
- No tests for inheritance scenarios

### @nx/next
- Missing tests for TypeScript configs
- No tests for non-standard patterns
- Missing tests for existing webpack configs

### @nx/nx (release-version)
- Need tests for complex metadata values
- Need tests for empty generatorOptions cleanup

### @nx/nx (release-tag)
- Need tests for all five properties together
- Need tests for complex array/object values

### @nx/react
- Missing tests for mixed patterns across workspace
- No tests for TypeScript webpack configs
- Missing tests for existing SVG loaders

### @nx/rspack
- Missing tests for multiple config files per project
- No tests for complex nested configurations
- Missing tests for ignored files

### @nx/webpack
- Missing tests for console logging
- No tests for corrupted configurations
- Missing tests for standalone apps (no project.json)

---

## Recommendations

1. **Add comprehensive edge case tests** for scenarios identified above
2. **Create integration test suite** that runs all migrations together
3. **Add performance benchmarks** for large workspaces
4. **Document migration behavior** for edge cases
5. **Add validation** to detect incompatible configurations before migration
6. **Improve error messages** with suggestions for manual fixes
7. **Create rollback documentation** for each migration
8. **Add telemetry** to track migration success rates in production
