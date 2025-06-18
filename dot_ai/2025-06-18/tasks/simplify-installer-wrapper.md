# Task Plan: Simplify Installer Wrapper Script and Add Idempotency

**Task Type**: Enhancement to existing feature  
**Created**: 2025-06-18  
**Status**: Planning  

## Overview

This task involves two main improvements to the raw-docs installer:
1. Simplify the wrapper script to less than 10 lines (preferably 5) by removing error handling
2. Make the installer idempotent by checking for existing installations before overwriting

## Current State

### Current Wrapper Script (40 lines)
- Located in `tools/scripts/analyze-docs.mjs` after installation
- Has extensive error handling and validation
- Reads local config, validates paths, spawns child process

### Current Installer Behavior
- Always overwrites the wrapper script (line 154)
- Always updates package.json script (line 180)
- Only checks for existing config files, not the actual scripts

## Proposed Changes

### Change 1: Ultra-Simple Wrapper Script

Transform the 40-line wrapper into a minimal 5-line script:
```javascript
#!/usr/bin/env node
import { readFileSync } from 'fs';
import { spawn } from 'child_process';
const config = JSON.parse(readFileSync(new URL('../../.rawdocs.local.json', import.meta.url)));
spawn('node', [config.rawDocsPath + '/scripts/analyze-changes.mjs', ...process.argv.slice(2)], { stdio: 'inherit' }).on('error', () => console.log('Error: Run installation with:\ngh api repos/nrwl/raw-docs/contents/install.sh --jq \'.content\' | base64 -d | bash'));
```

**Rationale:**
- Assumes all files exist (as requested)
- On ANY error, shows the gh install command from README.md
- No try/catch blocks, no detailed error messages
- Uses one-liner approach with chained methods

### Change 2: Idempotent Installation

Add checks before writing files:
1. Check if wrapper script already exists before writing
2. Check if package.json already has the script before modifying

## Implementation Steps

### Step 1: Simplify Wrapper Script Content
**TODO:**
- [ ] Replace the current 40-line wrapper content with the 5-line version
- [ ] Include the exact gh command from README.md in the error message
- [ ] Remove all try-catch blocks and detailed error handling

**Changes needed:**
- Modify `createWrapperScript()` function (lines 107-162)
- Update wrapper content string (lines 112-151)

### Step 2: Add Wrapper Script Existence Check
**TODO:**
- [ ] Check if wrapper file exists before creating it
- [ ] Skip wrapper creation if it already exists
- [ ] Log appropriate message when skipping

**Changes needed:**
- Add existence check in `createWrapperScript()` before writing
- Add info message when skipping

### Step 3: Add Package.json Script Check
**TODO:**
- [ ] Check if 'analyze-docs' script already exists in package.json
- [ ] Skip modification if script exists
- [ ] Log appropriate message when skipping

**Changes needed:**
- Modify `updatePackageJson()` function (lines 164-188)
- Add check for existing script before assignment

### Step 4: Update Installation Flow Messages
**TODO:**
- [ ] Update success messages to reflect skipped steps
- [ ] Ensure installation still completes successfully when steps are skipped

**Changes needed:**
- Adjust messages in main `install()` function
- Handle conditional success messages

## Code Structure

### New Wrapper Script (5 lines max):
```javascript
#!/usr/bin/env node
import { readFileSync } from 'fs';
import { spawn } from 'child_process';
const config = JSON.parse(readFileSync(new URL('../../.rawdocs.local.json', import.meta.url)));
spawn('node', [config.rawDocsPath + '/scripts/analyze-changes.mjs', ...process.argv.slice(2)], { stdio: 'inherit' }).on('error', () => console.log('Error: Run installation with:\ngh api repos/nrwl/raw-docs/contents/install.sh --jq \'.content\' | base64 -d | bash'));
```

### Idempotency Checks:
```javascript
// In createWrapperScript
if (existsSync(wrapperPath)) {
  info('Wrapper script already exists, skipping creation');
  return;
}

// In updatePackageJson
if (pkg.scripts && pkg.scripts['analyze-docs']) {
  info('analyze-docs script already exists in package.json, skipping');
  return;
}
```

## Reasoning

1. **Ultra-simple wrapper**: The user wants minimal error handling. Any error should just show how to reinstall, which is a pragmatic approach for internal tooling.

2. **Idempotency**: Prevents accidental overwrites of customized scripts and makes the installer safer to run multiple times.

3. **Using import.meta.url**: Modern approach that works with ES modules and avoids __dirname issues.

## Alternative Approaches Considered

1. **Even shorter wrapper (3 lines)**: Could combine imports, but would sacrifice readability
2. **Inline error message**: Could make it even shorter but the gh command is long
3. **Shell script wrapper**: Could be shorter but less portable

## Expected Outcome

When the task is completed:
1. The wrapper script will be exactly 5 lines (including shebang)
2. Any error will show the gh install command
3. Running the installer multiple times won't overwrite existing files
4. Installation will be idempotent and report what it skipped
5. The wrapper will still function correctly for the happy path

## Testing Plan

1. Test fresh installation (no existing files)
2. Test re-running installation (should skip wrapper and package.json)
3. Test wrapper with missing config file (should show gh command)
4. Test wrapper with invalid path (should show gh command)
5. Verify the wrapper still works normally when everything is correct

## CRITICAL: Implementation Tracking

When implementing or executing on this task, keep track of progress in this section:

### Implementation Progress
- [x] Step 1: Simplify wrapper script content - Reduced to 5 lines total
- [x] Step 2: Add wrapper script existence check - Added check before creating  
- [x] Step 3: Add package.json script check - Added check before modifying
- [x] Step 4: Update installation flow messages - Removed redundant success message

### Notes During Implementation
- Had to condense the JavaScript code to one line to meet the 5-line requirement
- Added try-catch to handle both file reading errors and spawn errors
- The wrapper now shows the gh install command on ANY error as requested
- Kept the shebang and imports on separate lines for clarity

### Issues Encountered
- Initial version didn't catch file reading errors, only spawn errors
- Fixed by wrapping entire logic in try-catch block

### Commits Made
- Modified install-cross-repo.mjs to implement all requested changes