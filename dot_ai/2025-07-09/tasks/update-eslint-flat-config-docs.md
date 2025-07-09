# Update ESLint Documentation for Flat Config Format

## Task Overview
Update Nx documentation to show ESLint flat config format (eslint.config.mjs) alongside legacy format (.eslintrc.json) using tabs, with flat config as the default.

## Goals
- Provide modern ESLint flat config examples as the default
- Maintain backwards compatibility by keeping legacy examples
- Use consistent tabbed format across all documentation

## Implementation Plan

### Phase 1: Analysis (COMPLETED)
- [x] Identify all documentation pages that need updating
- [x] Understand the flat config format and import patterns
- [x] Review existing examples in the codebase

### Phase 2: Documentation Updates

#### Step 1: Update Main Enforce Module Boundaries Documentation
- [x] File: `/docs/shared/features/enforce-module-boundaries.md`
- [x] Add tabs for configuration examples
- [x] Convert setup instructions to show flat config first
- [x] Update all ESLint configuration examples

#### Step 2: Update Recipe - Tag Multiple Dimensions
- [x] File: `/docs/shared/recipes/tag-multiple-dimensions.md`
- [x] Convert ESLint configuration example to tabbed format
- [x] Ensure consistency with main documentation

#### Step 3: Update Recipe - Ban External Imports
- [x] File: `/docs/shared/recipes/ban-external-imports.md`
- [x] Convert all ESLint examples to tabbed format
- [x] Update both `bannedExternalImports` and `allowedExternalImports` examples
- [x] Fixed typo: "pacages" -> "packages"

#### Step 4: Update Concepts - Project Dependency Rules
- [x] File: `/docs/shared/concepts/decisions/project-dependency-rules.md`
- [x] Convert the enforce module boundaries example to tabs

#### Step 5: Check Circular Dependencies Recipe
- [x] File: `/docs/shared/recipes/resolve-circular-dependencies.md`
- [x] Check if ESLint configuration is present
- [x] No ESLint configuration examples found - no updates needed

### Phase 3: Validation
- [x] Ensure all examples are syntactically correct
- [x] Verify consistency across all updated pages
- [x] All flat config examples use consistent format and imports

## Technical Details

### Flat Config Import Pattern
```javascript
import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          // options
        }
      ]
    }
  }
];
```

### Tab Structure
```markdown
{% tabs %}
{% tab label="Flat Config" %}
// flat config example
{% /tab %}
{% tab label="Legacy (.eslintrc.json)" %}
// legacy config example
{% /tab %}
{% /tabs %}
```

## Notes
- CRITICAL: Keep track of progress in this plan doc
- Use consistent naming: "Flat Config" and "Legacy (.eslintrc.json)"
- Flat config should always be the first/default tab
- Preserve all existing configuration logic when converting

## Current Status
✅ COMPLETED - All documentation pages have been successfully updated with flat config examples.