# Move convert-ts-solution Generator from Ocean to packages/js

## Task Overview

Move the `convert-ts-solution` generator from `../ocean/libs/nx-cloud-plugin/src/generators/convert-ts-solution` to the `@packages/js` plugin as its own generator and fix the reported issues:

1. Adds imports like @nx/* from @nx/devkit (weird)
2. Add paths to tsconfig.base.json (maybe intended)
3. Added exports to packages that don't need it
4. Removes commonjs from tsconfig.*.json (probably intentional)
5. Add root tsconfig.json but does not add any references (maybe intended)

## Implementation Steps

### Step 1: Publish Nx to Local Registry
**TODO:**
- [x] Run `pnpm nx-release 22.6.26-beta.1 --local` to publish to local npm registry
- [x] Verify the publication was successful

**Reasoning:** This allows us to test the generator with the local version of Nx packages before making changes.

### Step 2: Copy Generator to packages/js
**TODO:**
- [x] Create the new generator directory structure in packages/js/src/generators/convert-ts-solution
- [x] Copy convert-ts-solution.ts from ocean repo
- [x] Copy convert-ts-solution.spec.ts from ocean repo
- [x] Create proper schema.json with documented options
- [x] Update generators.json to include the new generator

**Reasoning:** We need to establish the basic structure in the target location before making modifications.

### Step 3: Fix Import Issues
**TODO:**
- [x] Review all imports in the generator code
- [x] Fix imports that reference @nx/* packages incorrectly
- [x] Ensure all imports use the correct package names (e.g., @nx/devkit instead of relative paths)
- [x] Update the import from '@nx/js/src/utils/package-json/sort-fields' to use proper export path
- [x] Update the import from '@nx/js/src/utils/typescript/ts-solution-setup' to use proper export path

**Reasoning:** The current imports may be using Ocean-specific paths that won't work in the Nx repo.

### Step 4: Create Test Workspace and Verify Current Behavior
**TODO:**
- [x] Create test workspace: `npx create-nx-workspace test1 --preset=ts --no-workspaces`
- [x] Generate 3 libraries in the test workspace
- [x] Verify tsconfig.base.json has paths for the libraries
- [x] Run the generator and document the current behavior
- [x] Check if paths are removed from tsconfig.base.json compilerOptions
- [x] Verify build, test, lint commands work
- [x] Run `nx sync` and verify it works

**Reasoning:** We need to understand the current behavior before fixing issues.

### Step 5: Fix Identified Issues
**TODO:**
- [x] Fix issue 1: Prevent adding weird @nx/* imports from @nx/devkit
  - Analyze where these imports are being added
  - Update the import replacement logic to handle @nx/* packages correctly
- [x] Fix issue 2: Document whether paths in tsconfig.base.json are intended
  - Review the logic for path handling
  - Add comments explaining the intended behavior
- [x] Fix issue 3: Prevent adding exports to packages that don't need it
  - Update the logic to check if a package already has main/module/exports fields
  - Only add exports when necessary for library packages
- [x] Fix issue 4: Document that removing commonjs is intentional
  - Add comments explaining why commonjs is removed
- [x] Fix issue 5: Ensure root tsconfig.json references are properly added
  - Update the logic to add project references to root tsconfig.json
  - Ensure all converted projects are referenced

**Reasoning:** Each issue needs to be addressed systematically to ensure the generator works correctly.

### Step 6: Update Schema and Documentation
**TODO:**
- [x] Create a proper schema.json with all options documented:
  - skipFormat: Skip formatting files
  - skipPlugin: Skip adding the TypeScript plugin
  - skipProjects: Skip updating projects
  - skipInstall: Skip installing packages
  - project: Specific project(s) to convert
- [x] Add JSDoc comments to the main generator function
- [x] Create or update documentation for the generator

**Reasoning:** Proper documentation and schema will make the generator easier to use and maintain.

### Step 7: Create Comprehensive Tests
**TODO:**
- [x] Port existing tests from ocean repo
- [x] Add tests for the fixed issues:
  - Test that @nx/* imports are handled correctly
  - Test that exports are only added when needed
  - Test that root tsconfig references are added
- [x] Add integration tests that create a workspace and run the generator
- [x] Test with different project types (apps, libs, publishable libs)

**Reasoning:** Comprehensive tests ensure the generator works correctly in various scenarios.

### Step 8: Test with nx-examples Repository
**TODO:**
- [ ] Run the generator on the nx-examples repository
- [ ] Verify all projects are converted correctly
- [ ] Run build, test, lint for all projects
- [ ] Run `nx sync` and verify it works
- [ ] Document any issues found

**Reasoning:** Testing on a real repository helps identify edge cases.

### Step 9: Final Testing and Cleanup
**TODO:**
- [ ] Run `pnpm nx-release 22.6.26-beta.2 --local` if needed for updated version
- [ ] Create a fresh test workspace and verify the generator works end-to-end
- [ ] Run all tests in packages/js
- [ ] Update the migration.json if this should be part of a migration
- [ ] Clean up any temporary test workspaces

**Reasoning:** Final verification ensures everything works correctly before completion.

## CRITICAL: Track Progress

When implementing or executing on this task, keep track of progress in this document by updating the TODO checkboxes above.

## Expected Outcome

When the task is completed:
1. The `convert-ts-solution` generator will be available in @nx/js package
2. All reported issues will be fixed with proper documentation
3. The generator will correctly convert non-TS-solution workspaces to TS solution setup
4. Tests will cover all edge cases and ensure reliability
5. The generator will work correctly on both new test workspaces and existing repositories like nx-examples
6. Documentation will be clear about what the generator does and its options