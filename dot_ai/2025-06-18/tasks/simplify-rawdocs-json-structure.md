# Task Plan: Simplify .rawdocs.json Structure

**Task Type**: Enhancement/Refactor  
**Created**: 2025-06-18  
**Status**: COMPLETED  
**Developer**: Assistant

## Summary

Successfully simplified the `.rawdocs.json` configuration structure by removing the `version` field and flattening the `patterns` object. The configuration now uses a simple top-level structure with `include` and `exclude` arrays directly. No backward compatibility was needed as the system is not yet in use.

## Overview

Simplify the `.rawdocs.json` configuration file structure by:
1. Removing the `version` property (no impact on behavior)
2. Flattening the `patterns` object to have direct `include` and `exclude` arrays
3. Updating all scripts that read/write this configuration

## Current State

### Current Structure
```json
{
  "version": "1.0.0",
  "patterns": {
    "include": ["apps/**/*", "libs/**/*", "packages/**/*"],
    "exclude": ["**/*.spec.*", "**/test/**/*", "**/__tests__/**/*", "**/*.test.*", "node_modules/**/*"]
  }
}
```

### Desired Structure
```json
{
  "include": ["apps/**/*", "libs/**/*", "packages/**/*"],
  "exclude": ["**/*.spec.*", "**/test/**/*", "**/__tests__/**/*", "**/*.test.*", "node_modules/**/*"]
}
```

## Implementation Steps

### Step 1: Update install-cross-repo.mjs
**TODO:**
- [ ] Remove version property from config generation (lines 76-82)
- [ ] Flatten patterns structure to direct include/exclude
- [ ] Update migration logic to handle both old and new formats (lines 186-211)
- [ ] Test with various scenarios

**Changes needed:**
- Lines 76-82: Update config structure when creating new `.rawdocs.json`
- Lines 186-211: Update migration logic to handle flattened structure
- Add backward compatibility check for existing pattern structure

### Step 2: Update analyze-changes.mjs
**TODO:**
- [ ] Update config reading logic to handle flattened structure (lines 55-98)
- [ ] Ensure backward compatibility with old structure
- [ ] Update pattern access from `config.patterns.include` to `config.include`

**Changes needed:**
- Lines 70-85: Update pattern access logic
- Add fallback for old structure (check if `patterns` exists)
- Simplify config validation

### Step 3: Update install.sh wrapper script
**TODO:**
- [ ] Verify no changes needed (bash script delegates to Node.js scripts)
- [ ] Test end-to-end installation flow

**Expected:** No changes needed as it delegates to `install-cross-repo.mjs`

### Step 4: Documentation Updates
**TODO:**
- [ ] Update any documentation that references the config structure
- [ ] Update example configurations
- [ ] Add migration note for existing users

**Files to check:**
- README.md
- CONTRIBUTING.md
- Any example config files

## Technical Details

### Backward Compatibility Strategy
```javascript
// In analyze-changes.mjs
const readConfig = () => {
  const config = JSON.parse(fs.readFileSync('.rawdocs.json', 'utf8'));
  
  // Handle both old and new structures
  const include = config.include || config.patterns?.include || [];
  const exclude = config.exclude || config.patterns?.exclude || [];
  
  return { include, exclude };
};
```

### Migration Logic Update
```javascript
// In install-cross-repo.mjs migration
if (existingConfig.patterns) {
  // Migrate from old structure
  newConfig = {
    include: existingConfig.patterns.include,
    exclude: existingConfig.patterns.exclude
  };
} else {
  // Already in new structure
  newConfig = existingConfig;
}
```

## Testing Approach

As requested, no automated testing will be implemented. Manual verification will be done by:
1. Installing in a fresh repository
2. Testing migration from old format
3. Running analyze-changes.mjs with both formats
4. Verifying pattern matching works correctly

## Expected Outcome

After implementation:
- `.rawdocs.json` will have a simpler, flatter structure
- All scripts will work with both old and new formats
- Installation process remains unchanged for users
- Configuration is more intuitive and easier to edit manually

## Notes

- The `version` field removal won't affect functionality as it's not used anywhere
- Flattening makes the config more readable and reduces nesting
- Backward compatibility ensures smooth transition for existing users

## CRITICAL: Implementation Tracking

**CRITICAL: Keep track of implementation progress in this section when executing the task**

### Implementation Progress
- [x] Step 1: Update install-cross-repo.mjs
  - Removed version property from config generation (line 77)
  - Updated migration logic to use flattened structure (line 251)
- [x] Step 2: Update analyze-changes.mjs  
  - Simplified to only support new flat structure
  - Direct destructuring of include/exclude from config
  - Added default include patterns if missing
- [x] Step 3: Verify install.sh (no changes expected)
  - Confirmed: install.sh delegates to Node.js scripts, no changes needed
- [x] Step 4: Update documentation
  - Updated README.md example to show new structure
  - CONTRIBUTING.md only has brief mention, no changes needed
- [x] Manual testing completed
- [x] All changes committed

### Notes During Implementation
- The version constant is still defined in install-cross-repo.mjs but no longer used in config
- Final implementation only supports new format (no backward compatibility needed)
- User made additional simplifications to analyze-changes.mjs to remove pattern nesting entirely
- Default include patterns added: `apps/**/*`, `lib/**/*`, `package/**/*`