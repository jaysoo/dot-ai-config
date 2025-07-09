# Update ESLint Documentation to Show Flat Config by Default

## Task Overview
Update remaining ESLint documentation pages to show flat config format by default, following the pattern already established in other documentation files that were updated in commit `8531c0f583`.

## Context
- Current branch: `docs/enforce-module-boundaries`
- Recent commit: `8531c0f583 docs(misc): update docs showing module boundaries eslint rule to show flat config by default`
- Some ESLint docs have already been updated to show flat config first, but several key pages still only show legacy format

## Files to Update

### 1. `/docs/shared/packages/eslint/enforce-module-boundaries.md`
- **Current state**: Only shows legacy `.eslintrc.json` format
- **Target state**: Show flat config (`eslint.config.mjs`) as default tab, legacy as secondary tab
- **TODO**: 
  - [ ] Add tabbed structure
  - [ ] Create flat config examples
  - [ ] Move existing legacy examples to secondary tab

### 2. `/docs/shared/packages/eslint/dependency-checks.md`
- **Current state**: Only shows legacy `.eslintrc.json` format  
- **Target state**: Show flat config as default tab, legacy as secondary tab
- **TODO**:
  - [ ] Add tabbed structure
  - [ ] Create flat config examples
  - [ ] Move existing legacy examples to secondary tab

### 3. `/docs/shared/eslint.md`
- **Current state**: Only shows legacy JSON config for TypeScript configuration
- **Target state**: Show flat config as default for all examples
- **TODO**:
  - [ ] Update TypeScript configuration section
  - [ ] Add flat config examples
  - [ ] Keep legacy examples as alternative

### 4. `/docs/shared/packages/eslint/eslint-plugin.md` (if needed)
- **TODO**: 
  - [ ] Check if this file needs updates
  - [ ] Update if necessary to maintain consistency

## Implementation Steps

### Step 1: Update enforce-module-boundaries.md ✅
- **TODO**: 
  - [x] Add tabbed structure
  - [x] Create flat config examples
  - [x] Move existing legacy examples to secondary tab
- **Result**: Successfully updated with flat config as default tab

### Step 2: Update dependency-checks.md ✅
- **TODO**:
  - [x] Add tabbed structure to manual setup section
  - [x] Create flat config examples with jsonc-eslint-parser
  - [x] Update overriding defaults section with tabs
- **Result**: Successfully updated both sections with flat config as default

### Step 3: Update eslint.md ✅
- **TODO**:
  - [x] Update initial TypeScript configuration example
  - [x] Update example with @typescript-eslint/await-thenable rule
  - [x] Update example with parserOptions.project configuration
- **Result**: All three examples now show flat config as default

### Step 4: Verify Consistency ✅
- [x] All examples follow the same pattern as already-updated files
- [x] Consistent tab naming: "Flat Config" and "Legacy (.eslintrc.json)"
- [x] Same import structure maintained across all examples
- [x] Verified eslint-plugin.md doesn't need updates (no config examples)

## Implementation Complete ✅

All ESLint documentation pages have been successfully updated to show flat config as the default option while maintaining legacy configuration as a secondary tab. The updates are consistent with the pattern established in other documentation files.

## Pattern to Follow
Use the same tabbed structure as in `/docs/shared/features/enforce-module-boundaries.md`:

```markdown
{% tabs %}
{% tab label="Flat Config" %}
```javascript
// eslint.config.mjs content
```
{% /tab %}
{% tab label="Legacy (.eslintrc.json)" %}
```jsonc
// legacy config content
```
{% /tab %}
{% /tabs %}
```

## Expected Outcome
- All ESLint documentation pages consistently show flat config as the default/recommended approach
- Legacy config is still available but presented as a secondary option
- Documentation aligns with modern ESLint configuration practices
- Consistent user experience across all ESLint-related documentation

## Notes
- CRITICAL: Keep track of progress in this plan document as implementation proceeds
- Generated files under `/docs/generated/` should not be modified directly - they will be regenerated from source files
- Ensure all code examples are properly formatted and tested
- The flat config examples should import from `@nx/eslint-plugin` and use the predefined configs