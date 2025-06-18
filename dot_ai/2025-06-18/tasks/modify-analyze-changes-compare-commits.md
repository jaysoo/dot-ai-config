# Task Plan: Modify analyze-changes.mjs to Compare Against Specific Commits

**Task Type**: Enhancement to existing feature  
**Created**: 2025-06-18  
**Status**: Planning  

## Overview

Modify the `analyze-changes.mjs` script to compare changes against a specific commit SHA instead of comparing to `origin/master` or `origin/main`. The script will accept a commit SHA as a command-line argument, defaulting to `HEAD~1` if not provided.

## Current Behavior

The script currently:
1. Detects the default branch (main or master) - lines 112-126
2. Uses `git log origin/${defaultBranch}..HEAD` to get commit history - lines 135-136
3. Uses `git diff --name-only origin/${defaultBranch}...HEAD` to find changed files - lines 179-180
4. Always compares against the remote default branch

## Proposed Changes

Transform the script to:
1. Accept a `--since` or `--base-commit` argument for specifying the base commit SHA
2. Default to `HEAD~1` if no argument is provided
3. Replace all comparisons against `origin/${defaultBranch}` with comparisons against the specified commit
4. Update help documentation to reflect the new behavior

## Implementation Steps

### Step 1: Add Command Line Argument Parsing
**TODO:**
- [ ] Add new CLI argument `--since` or `--base-commit` to accept commit SHA
- [ ] Set default value to `HEAD~1` if not provided
- [ ] Update the help text to document the new argument

**Changes needed:**
- Modify CLI argument parsing section (lines 382-403)
- Add new option handling for commit SHA

### Step 2: Modify Git Log Function
**TODO:**
- [ ] Update `getGitLog()` function to accept base commit parameter
- [ ] Replace `origin/${defaultBranch}..HEAD` with `${baseCommit}..HEAD`
- [ ] Update error handling for invalid commit references

**Changes needed:**
- Modify `getGitLog()` function (lines 133-150)
- Pass base commit as parameter instead of defaultBranch

### Step 3: Modify Changed Files Detection
**TODO:**
- [ ] Update `findChangedFiles()` function to accept base commit parameter
- [ ] Replace `origin/${defaultBranch}...HEAD` with `${baseCommit}...HEAD`
- [ ] Handle cases where the base commit doesn't exist

**Changes needed:**
- Modify `findChangedFiles()` function (lines 173-205)
- Update git diff command to use base commit

### Step 4: Update Main Analysis Flow
**TODO:**
- [ ] Pass base commit through the analysis pipeline
- [ ] Update function calls to use base commit instead of default branch
- [ ] Ensure all references to origin/branch comparisons are updated

**Changes needed:**
- Modify `analyze()` function (lines 321-379)
- Update function calls to pass base commit parameter

### Step 5: Update Report Generation
**TODO:**
- [ ] Update the generated report to show comparison base (commit SHA)
- [ ] Remove or update references to "default branch" in output
- [ ] Add information about which commit is being compared against

**Changes needed:**
- Modify `generateSummary()` function (lines 237-303)
- Update report header to show base commit information

### Step 6: Testing and Validation
**TODO:**
- [ ] Test with no arguments (should use HEAD~1)
- [ ] Test with specific commit SHA
- [ ] Test with invalid commit SHA (error handling)
- [ ] Test with tags and branch names
- [ ] Verify the script works in repositories without origin remotes

## Code Structure

```javascript
// New CLI argument structure
const args = process.argv.slice(2);
const options = {
  baseCommit: 'HEAD~1' // default value
};

// Updated function signatures
function getGitLog(baseCommit) { ... }
function findChangedFiles(config, baseCommit) { ... }
```

## Reasoning

1. **Default to HEAD~1**: This provides a sensible default that compares against the previous commit, which is often what developers want when checking their latest changes.

2. **Remove origin dependency**: By not relying on origin/main or origin/master, the script becomes more flexible and works in scenarios where:
   - The repository hasn't been pushed yet
   - Working offline
   - Comparing against arbitrary points in history

3. **Maintain backward compatibility**: The script will still function similarly but with more flexibility.

## Alternative Approaches Considered

1. **Keep both modes**: Could add a flag to switch between "origin mode" and "commit mode", but this adds complexity.
2. **Auto-detect mode**: Could check if origin exists and fall back to HEAD~1, but explicit behavior is clearer.
3. **Use reflog**: Could track the last analyzed commit in git reflog, but this is more complex and less portable.

## Expected Outcome

When the task is completed:
1. The script will accept a `--since <commit>` argument
2. Without arguments, it will compare against HEAD~1 by default
3. All git operations will use the specified commit instead of origin/main or origin/master
4. The generated report will clearly show what commit was used as the comparison base
5. Error messages will be clear when invalid commits are provided

## Usage Examples

```bash
# Compare against previous commit (default)
node scripts/analyze-changes.mjs

# Compare against specific commit
node scripts/analyze-changes.mjs --since abc123def

# Compare against 5 commits ago
node scripts/analyze-changes.mjs --since HEAD~5

# Compare against a tag
node scripts/analyze-changes.mjs --since v1.0.0

# With output file
node scripts/analyze-changes.mjs --since HEAD~3 --output analysis.md
```

## CRITICAL: Implementation Tracking

When implementing or executing on this task, keep track of progress in this section:

### Implementation Progress
- [x] Step 1: CLI argument parsing - Added --since and --base-commit options with HEAD~1 default
- [x] Step 2: Git log function update - Modified to accept baseCommit parameter
- [x] Step 3: Changed files detection update - Updated to use baseCommit instead of origin/branch
- [x] Step 4: Main analysis flow update - Added commit validation and updated all function calls
- [x] Step 5: Report generation update - Added "Comparing against:" field to show base commit
- [x] Step 6: Testing and validation - All test scenarios passed

### Notes During Implementation
- Removed the default branch detection logic as it's no longer needed
- Added validation to ensure the base commit exists before proceeding
- Updated error messages to be more helpful when invalid commits are provided
- Help text now includes clear examples of different usage patterns

### Issues Encountered
- None - implementation went smoothly

### Commits Made
- Modified analyze-changes.mjs to use commit-based comparison instead of origin/branch