# Task Plan: Add Author Filtering to analyze-changes.mjs

**Created**: 2025-06-18  
**Type**: Enhancement to existing feature  
**Estimated Effort**: Small (1-2 hours)

## Overview

This task enhances the `analyze-changes.mjs` script to filter commits by author, showing only commits from the current git user by default, with the ability to override via a `--author` CLI flag.

## Requirements

1. By default, show commits only from the current git user (obtained from `git config user.name`)
2. Add `--author` CLI flag to override the default behavior
3. Support wildcard "*" for `--author` to show all commits regardless of author
4. Maintain backward compatibility with existing functionality

## Implementation Plan

### Step 1: Add CLI flag parsing for --author
**Reasoning**: Need to accept the new CLI argument before we can use it in the logic

**Changes**:
- Add `--author` flag parsing in the CLI handling section (around lines 386-395)
- Add help documentation for the new flag (around line 345)
- Store the author parameter in the options object

**TODO**:
- [ ] Add `--author` to the help text
- [ ] Parse `--author` flag in the CLI arguments loop
- [ ] Add author property to options object

### Step 2: Modify getGitLog function to accept author parameter
**Reasoning**: The git log command needs to be modified to filter by author when specified

**Changes**:
- Update `getGitLog` function signature to accept an author parameter
- Modify the git command to include `--author` flag when not wildcard
- Handle the wildcard "*" case by not adding any author filter

**TODO**:
- [ ] Add author parameter to getGitLog function
- [ ] Build git command with conditional author filter
- [ ] Test with different author values

### Step 3: Update analyze function to pass author information
**Reasoning**: The analyze function needs to determine the current user and pass author info to getGitLog

**Changes**:
- Get current git user name if no author specified
- Pass author information to getGitLog
- Update the summary to show which author's commits are being analyzed

**TODO**:
- [ ] Get current user from gitInfo.name when no --author specified
- [ ] Pass author to getGitLog function call
- [ ] Add author info to the generated summary header

### Step 4: Add tests and validation
**Reasoning**: Ensure the new functionality works correctly and handles edge cases

**Test Cases**:
- Default behavior (current user only)
- Specific author via --author flag
- Wildcard "*" shows all commits
- Invalid author shows no commits

**TODO**:
- [ ] Create test script in the same directory
- [ ] Test all scenarios
- [ ] Document any edge cases found

## Code Changes Breakdown

### 1. CLI Help Text Addition (line ~345)
```javascript
Options:
  --since, --base-commit <commit>  Base commit to compare against
                                   Default: lastSha from .rawdocs.local.json (if present) or HEAD~1
  --author <name>                  Filter commits by author (default: current git user)
                                   Use "*" to show all commits regardless of author
  --output, -o <file>              Save analysis to a file instead of printing
  --help, -h                       Show this help message
```

### 2. CLI Parsing Addition (line ~395)
```javascript
} else if (args[i] === '--author') {
    options.author = args[++i];
}
```

### 3. getGitLog Function Modification (line ~137)
```javascript
function getGitLog(baseCommit, author = null) {
  try {
    let gitCommand = `git --no-pager log ${baseCommit}..HEAD`;
    
    // Add author filter unless it's wildcard
    if (author && author !== '*') {
      // Escape author name for shell
      const escapedAuthor = author.replace(/'/g, "'\\''");
      gitCommand += ` --author='${escapedAuthor}'`;
    }
    
    return execSync(gitCommand, { 
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024 
    }).trim();
  } catch (e) {
    // If the base commit is invalid, provide a helpful error
    warning(`Could not get git log from ${baseCommit}: ${e.message}`);
    return '';
  }
}
```

### 4. Analyze Function Updates (line ~307)
```javascript
// Determine author for filtering
const author = options.author || gitInfo.name;
const authorDisplay = options.author === '*' ? 'all authors' : author;

// Get git log with author filter
const gitLog = getGitLog(options.baseCommit, author);
```

### 5. Summary Header Update (line ~212)
```javascript
Developer: ${gitInfo.name} <${gitInfo.email}>
Branch: ${gitInfo.currentBranch}
Commits from: ${authorDisplay}
Comparing against: ${baseCommit}
```

## Alternative Approaches Considered

1. **Using git config user.email instead of user.name**: Decided against this as names are more human-readable and what developers typically recognize.

2. **Making --author accept multiple values**: Could be useful but adds complexity. Can be added in a future enhancement if needed.

3. **Case sensitivity**: Git's --author flag is case-sensitive by default. We'll maintain this behavior for consistency.

## Expected Outcome

When the task is completed:

1. Running `analyze-changes.mjs` without arguments will show only commits from the current git user
2. Running `analyze-changes.mjs --author "John Doe"` will show only commits from John Doe
3. Running `analyze-changes.mjs --author "*"` will show all commits (current behavior)
4. The help text will clearly document the new flag
5. The summary report will indicate which author's commits are being analyzed

## Testing Script

A test script will be created to validate all scenarios:
- `.ai/2025-06-18/tasks/test-author-filter.mjs`

## Risks and Mitigations

1. **Risk**: Author names with special characters might break the git command
   - **Mitigation**: Properly escape the author parameter

2. **Risk**: Some commits might not have author information
   - **Mitigation**: Git handles this gracefully, no additional handling needed

3. **Risk**: Performance impact of filtering large commit histories
   - **Mitigation**: Git's --author filter is efficient, no performance concerns

## CRITICAL: Implementation Tracking

**IMPORTANT**: When implementing this task, keep track of progress in this section by updating the TODOs above and noting any deviations from the plan.

### Implementation Notes:
- All 4 steps completed successfully
- Help text updated with new --author option
- CLI parsing added for --author flag
- getGitLog function modified to accept and use author parameter
- analyze function updated to determine author and pass to getGitLog
- generateSummary function updated to display "Commits from:" field

### Testing Results:
- ✅ Default behavior: Shows only current user's commits (Jack Hsu)
- ✅ Wildcard "*": Shows all commits regardless of author
- ✅ Specific author: Filters to show only that author's commits
- ✅ Non-existent author: Shows no commits in the log section
- ✅ Help text: Properly documents the new --author flag

### Deviations from Plan:
- None - implementation followed the plan exactly