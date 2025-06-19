# Add --new-feature Flag to analyze-changes Script

**Task Type**: Enhancement to existing feature  
**Date**: 2025-06-18  
**Status**: Planned

## Overview

Add a `--new-feature` flag to the `scripts/analyze-changes.mjs` script that will modify the generated AI context to include CRITICAL instructions for considering new feature documentation based on the TEMPLATE.md when analyzing commits and diffs.

## Requirements

1. Add support for `--new-feature` flag with both space and equals delimiters:
   - `--new-feature` (boolean flag)
   - `--new-feature=true` (explicit value)
   
2. When the flag is present, modify the generated AI context markdown to include:
   - CRITICAL instructions emphasizing the need to consider creating new feature documentation
   - Direct reference to the TEMPLATE.md structure
   - Stronger guidance for when to create new documentation vs updating existing

## Implementation Plan

### Step 1: Add CLI Flag Parsing
- [ ] Add parsing for `--new-feature` flag in the CLI argument parsing section (around line 540-554)
- [ ] Support both `--new-feature` and `--new-feature=value` formats
- [ ] Add the flag to the options object passed to the analyze function

### Step 2: Update Help Documentation  
- [ ] Add `--new-feature` documentation to the help text (around line 476-519)
- [ ] Include explanation of when to use this flag
- [ ] Add example usage

### Step 3: Modify Context Generation
- [ ] Update the `prepareContext` function (around line 308-388) to accept the new-feature flag
- [ ] When flag is present, add CRITICAL instructions section before the Task section
- [ ] Emphasize creating new documentation using TEMPLATE.md for significant new functionality

### Step 4: Enhanced AI Instructions
- [ ] Create a conditional section that gets added when `--new-feature` flag is present
- [ ] Include specific criteria for when to create new documentation:
  - New CLI commands or generators
  - New cloud features or endpoints  
  - Major functionality additions
  - Features that span multiple files/packages
- [ ] Reference the template structure and metadata requirements

### Step 5: Testing
- [ ] Test with `--new-feature` flag alone
- [ ] Test with `--new-feature=true` format
- [ ] Test that normal operation (without flag) remains unchanged
- [ ] Verify the generated context includes the CRITICAL instructions

## Technical Details

### CLI Flag Parsing
```javascript
// Around line 542, add:
} else if (args[i] === '--new-feature') {
  options.newFeature = true;
} else if (args[i].startsWith('--new-feature=')) {
  const value = args[i].split('--new-feature=')[1];
  options.newFeature = value === 'true' || value === '1' || value === '';
}
```

### Context Generation Modification
```javascript
// In prepareContext function, before the "## Task" section, add:
if (options.newFeature) {
  context += `

## CRITICAL: New Feature Documentation Consideration

**IMPORTANT**: This analysis is being run with the --new-feature flag, which means you should pay special attention to whether the changes warrant creating NEW feature documentation.

### When to Create New Documentation
Create a NEW feature document when:
- A new CLI command, generator, or executor is being added
- A new Nx Cloud feature, page, or API endpoint is introduced
- Significant new functionality that spans multiple files/packages
- Features that users will interact with directly
- Major architectural changes or new capabilities

### New Feature Documentation Requirements
When creating new documentation:
1. Use the TEMPLATE.md structure provided above
2. Set status to "in-progress" for active development
3. Include all relevant metadata (developers, category, etc.)
4. Focus on the "why" - problem statement and solution approach
5. Document configuration options and examples
6. List all relevant files and directories accurately

### Decision Criteria
Ask yourself:
- Is this a distinct feature that users need to understand?
- Does it introduce new concepts or workflows?
- Would it benefit from dedicated documentation separate from existing features?
- Is it significant enough to track as its own feature?

If YES to any of these, create a NEW feature document rather than updating existing ones.
`;
}
```

## Expected Outcome

When the task is completed:
1. The `analyze-changes.mjs` script will accept a `--new-feature` flag
2. When the flag is used, the generated AI context will include CRITICAL instructions emphasizing new feature documentation creation
3. The help text will document the new flag and its purpose
4. The script will maintain backward compatibility when the flag is not used
5. AI tools analyzing the context will have clearer guidance on when to create new documentation vs updating existing

## Reasoning

This enhancement addresses the need to sometimes explicitly guide AI tools to consider creating new feature documentation rather than defaulting to updating existing docs. By adding a flag, users can signal when they believe their changes represent new functionality that deserves its own documentation.

## Alternatives Considered

1. **Always include new feature instructions**: This could be too aggressive and lead to over-documentation
2. **Separate script for new features**: Would duplicate much of the existing functionality
3. **Automatic detection**: Too complex and prone to false positives/negatives

The flag approach gives users control while keeping the implementation simple.

## CRITICAL: Implementation Tracking

When implementing or executing on this task:
- CRITICAL: Keep track of implementation progress in this section
- Mark each step's TODO items as completed when done
- Note any deviations from the plan
- Document any issues encountered
- Update with the actual implementation details