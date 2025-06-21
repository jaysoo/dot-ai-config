# Task: Deprecate simpleName Option in React, Nest, and JS Library Generators

## Background
In the latest commit (74c7c34d25), the `simpleName` option was deprecated for the Angular library generator. The same deprecation needs to be applied to other generators that have this option:
- React library generator
- Nest library generator  
- JS library generator

The deprecation pattern includes:
1. Adding `x-deprecated` property to schema.json
2. Adding runtime warning when the option is used
3. Updating generated documentation

## Goal
Apply the same deprecation pattern used for the Angular library generator to React, Nest, and JS library generators, ensuring consistency across all generators with the `simpleName` option.

## Implementation Plan

### Step 1: Deprecate simpleName in React Library Generator
**Files to modify:**
- `/Users/jack/projects/nx/packages/react/src/generators/library/schema.json`
- `/Users/jack/projects/nx/packages/react/src/generators/library/library.ts`
- `/Users/jack/projects/nx/docs/generated/packages/react/generators/library.json`

**Changes:**
1. Add `x-deprecated` property to schema.json
2. Add runtime warning check with logger import
3. Update generated docs

**TODO:**
- [ ] Update schema.json with x-deprecated
- [ ] Add logger import and warning to library.ts
- [ ] Regenerate docs

### Step 2: Deprecate simpleName in Nest Library Generator
**Files to modify:**
- `/Users/jack/projects/nx/packages/nest/src/generators/library/schema.json`
- `/Users/jack/projects/nx/packages/nest/src/generators/library/library.ts`
- `/Users/jack/projects/nx/docs/generated/packages/nest/generators/library.json`

**Changes:**
1. Add `x-deprecated` property to schema.json
2. Add runtime warning check with logger import
3. Update generated docs

**TODO:**
- [ ] Update schema.json with x-deprecated
- [ ] Add logger import and warning to library.ts
- [ ] Regenerate docs

### Step 3: Deprecate simpleName in JS Library Generator
**Files to modify:**
- `/Users/jack/projects/nx/packages/js/src/generators/library/schema.json`
- `/Users/jack/projects/nx/packages/js/src/generators/library/library.ts`
- `/Users/jack/projects/nx/docs/generated/packages/js/generators/library.json`

**Changes:**
1. Add `x-deprecated` property to schema.json
2. Add runtime warning check with logger import
3. Update generated docs

**TODO:**
- [ ] Update schema.json with x-deprecated
- [ ] Add logger import and warning to library.ts
- [ ] Regenerate docs

### Step 4: Verify Changes
**TODO:**
- [ ] Run tests for affected packages
- [ ] Verify deprecation warnings appear correctly
- [ ] Check that generated docs are updated

### Step 5: Commit Changes
**TODO:**
- [x] Create commit with appropriate message following the pattern from the Angular deprecation

## Tracking Section (for implementation)
**CRITICAL: Keep track of progress in this section as implementation proceeds**

- Implementation started: 2025-06-20 13:45 ET
- Implementation completed: 2025-06-20 14:00 ET
- Issues encountered: None - all tests passed
- Completed steps:
  - ✓ Step 1: Deprecated simpleName in React Library Generator (schema.json, library.ts, generated docs)
  - ✓ Step 2: Deprecated simpleName in Nest Library Generator (schema.json, library.ts, generated docs)
  - ✓ Step 3: Deprecated simpleName in JS Library Generator (schema.json, library.ts, generated docs)
  - ✓ Step 4: Verified changes work correctly (ran tests, formatted code)
  - ✓ Step 5: Committed changes (commit: a98661d1a7)

## Expected Outcome
After completing this task:
1. All library generators (React, Nest, JS) will have deprecated `simpleName` options
2. Users will see deprecation warnings when using `simpleName` in any of these generators
3. Documentation will be updated to reflect the deprecation
4. The codebase will be consistent across all generators regarding the `simpleName` deprecation
5. Users will be guided to provide exact names instead of relying on the `simpleName` transformation

## Notes
- The deprecation message should be consistent: "The 'simpleName' option is deprecated and will be removed in Nx 22. Please provide the exact name you want to use for the library instead."
- The `x-deprecated` message in schema.json should be: "Provide the exact name instead. This option will be removed in Nx 22."
- Need to check if docs are automatically generated or if there's a command to regenerate them