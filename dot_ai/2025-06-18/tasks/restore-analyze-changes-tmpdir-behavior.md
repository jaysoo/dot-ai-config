# Task Plan: Restore analyze-changes.mjs tmpdir and Claude Command Behavior

**Date**: 2025-06-18  
**Task Type**: Bug Fix / Feature Restoration  
**Priority**: High  
**Status**: Planning

## Overview

The `analyze-changes.mjs` script was recently refactored and lost its original behavior of:
1. Logging analysis context to a markdown file in the OS tmpdir
2. Outputting a `claude` command that references this context file

This functionality needs to be restored while maintaining the improvements from the recent refactoring.

## Current State Analysis

### Previous Behavior (HEAD~1)
- Used `.rawdocsrc` configuration file
- Created a comprehensive markdown context file in tmpdir
- Generated a `claude --add-dir=` command for AI analysis
- Included git log, git diff, and existing documentation in context
- Focused on AI-assisted documentation generation

### Current Behavior (HEAD)
- Uses `.rawdocs.json` and `.rawdocs.local.json` configuration
- Generates a summary report (can save to file with `--output`)
- Tracks lastSha for incremental analysis
- No tmpdir usage or claude command generation
- More focused on human-readable analysis

## Requirements

1. Restore the tmpdir markdown file generation
2. Restore the claude command output
3. Maintain the new configuration system (.rawdocs.json)
4. Keep the improved lastSha tracking and author filtering
5. Preserve backward compatibility with new features

## Implementation Plan

### Step 1: Add tmpdir Context Generation
- [ ] Import tmpdir from 'os' module
- [ ] Create `prepareContext()` function similar to previous version
- [ ] Generate comprehensive markdown context including:
  - Repository information
  - Git log (with author filtering)
  - Git diff for changed files
  - List of existing documentation
  - Template content
  - Clear AI instructions

### Step 2: Implement Git Diff Collection
- [ ] Add `getGitDiff()` function to collect diffs
- [ ] Support both specific files and all changes
- [ ] Handle large diffs with appropriate buffer size
- [ ] Integrate with existing changed files detection

### Step 3: Add Existing Documentation Scanner
- [ ] Implement `listExistingDocs()` function
- [ ] Scan features directories (both CLI and Cloud)
- [ ] Extract metadata (title, status, last modified)
- [ ] Handle missing directories gracefully

### Step 4: Generate Claude Command
- [ ] Write context to tmpdir with timestamp
- [ ] Output claude command with proper formatting
- [ ] Include raw docs path in --add-dir parameter
- [ ] Add next steps instructions

### Step 5: Integrate with Current Flow
- [ ] Add AI analysis as complementary to current summary
- [ ] Preserve all existing functionality
- [ ] Make AI context generation optional (flag?)
- [ ] Ensure backward compatibility

### Step 6: Update Help Documentation
- [ ] Add documentation for AI analysis features
- [ ] Update examples to show both modes
- [ ] Document prerequisites (Claude CLI)

## Technical Details

### Key Functions to Add/Modify

1. **prepareContext(config, gitInfo, gitLog, gitDiff, existingDocs, changedFiles)**
   - Generate comprehensive markdown for AI analysis
   - Include template and clear instructions

2. **getGitDiff(files, baseCommit)**  
   - Collect git diff output
   - Support file filtering

3. **listExistingDocs(rawDocsPath)**
   - Scan features directories
   - Extract documentation metadata

4. **analyzeChanges() modification**
   - Add AI context generation after current analysis
   - Write to tmpdir and output claude command

### Configuration Compatibility

- Keep using `.rawdocs.json` system
- Use `config.rawDocsPath` for documentation location
- Maintain lastSha tracking

## Testing Approach

1. Test with various git scenarios (new files, modifications, deletions)
2. Verify tmpdir file creation and content
3. Test claude command generation
4. Ensure existing functionality remains intact
5. Test with different author filters

## Expected Outcome

When complete, running `analyze-changes.mjs` will:
1. Perform current analysis (feature grouping, commit listing)
2. Generate comprehensive context file in tmpdir
3. Output a ready-to-use claude command
4. Provide clear next steps for documentation updates
5. Maintain all current features (lastSha, author filtering, output to file)

## CRITICAL: Implementation Tracking

When implementing this task, keep track of progress in this section:

### Implementation Progress
- [x] Step 1: Add tmpdir Context Generation
- [x] Step 2: Implement Git Diff Collection  
- [x] Step 3: Add Existing Documentation Scanner
- [x] Step 4: Generate Claude Command
- [x] Step 5: Integrate with Current Flow
- [x] Step 6: Update Help Documentation
- [x] Final testing and verification

### Notes During Implementation
- Added `import { tmpdir } from 'os'` for tmpdir functionality
- Added `statSync` import for fallback file modification detection
- Integrated AI analysis seamlessly after the current summary generation
- Maintained all existing functionality while adding AI capabilities
- Used the same author filtering for git log in AI context

### Issues Encountered
- None - implementation went smoothly following the plan

### Final Changes Made
1. **Imports**: Added `tmpdir` from 'os' and `statSync` from 'fs'
2. **New Functions**:
   - `prepareContext()` - Generates comprehensive markdown for AI analysis
   - `getGitDiff()` - Collects git diff with proper buffer handling
   - `listExistingDocs()` - Scans features directories for existing docs
3. **Main Flow Integration**: 
   - AI analysis runs after current summary generation
   - Writes context to tmpdir with timestamp
   - Outputs formatted claude command
   - Provides clear next steps
4. **Help Documentation**: Updated with AI analysis section explaining the feature