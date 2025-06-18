# Task: Refactor Install Script - Remove Git Hooks and Add Analyze Wrapper

**Date**: 2025-06-18  
**Type**: Enhancement/Refactor  
**Status**: Planning

## Overview

Refactor the install script to:
1. Remove all git hooks installation logic
2. Split `.rawdocs` configuration into two files (committed and local)
3. Create a wrapper script for `analyze-changes.mjs` that reads from local config
4. Add the wrapper to package.json scripts

## Current State Analysis

### TODO
- [ ] Analyze current install script structure
- [ ] Understand current .rawdocs configuration
- [ ] Check analyze-changes.mjs usage

## Implementation Steps

### Step 1: Split Configuration Files
**Goal**: Separate machine-specific config from repository config

#### Changes:
- Create `.rawdocs.json` (committed) - contains `includes` and `excludes` patterns
- Create `.rawdocs.local.json` (not committed) - contains `rawDocsPath` 
- Update `.gitignore` to exclude `.rawdocs.local.json`

#### TODO:
- [ ] Analyze current .rawdocs structure
- [ ] Design new configuration schema
- [ ] Plan migration from old to new format

### Step 2: Remove Git Hooks Logic
**Goal**: Clean up install script by removing all pre-push hook functionality

#### Changes:
- Remove hook installation code
- Remove hook verification code
- Remove hook uninstall code
- Remove hook-related CLI options
- Clean up related helper functions

#### TODO:
- [ ] Identify all hook-related code sections
- [ ] Ensure no breaking dependencies
- [ ] Update help text and documentation

### Step 3: Update Install Script to Create Wrapper and Update Package.json
**Goal**: Modify install script to create all necessary files and configurations

#### Changes During Installation:
1. **Create configuration files**:
   - Create `.rawdocs.json` with includes/excludes patterns
   - Create `.rawdocs.local.json` with rawDocsPath
   - Update `.gitignore` to exclude local config

2. **Create wrapper script** (`tools/scripts/analyze-docs.mjs` in target repo):
   - Read `.rawdocs.local.json` to get `rawDocsPath`
   - Execute `node <rawDocsPath>/scripts/analyze-changes.mjs`
   - Pass through all CLI arguments
   - Handle errors gracefully

3. **Update target repo's package.json**:
   - Add `"analyze-docs": "node tools/scripts/analyze-docs.mjs"` to scripts
   - Preserve existing formatting
   - Make it ready to commit

#### TODO:
- [ ] Implement configuration file creation
- [ ] Implement wrapper script generation
- [ ] Implement package.json update logic
- [ ] Handle existing configurations
- [ ] Test various installation scenarios

## Technical Considerations

### Configuration Schema

**.rawdocs.json** (committed in target repo):
```json
{
  "version": "1.0",
  "includes": ["packages/**/*.ts", "apps/**/*.ts"],
  "excludes": ["**/*.spec.ts", "**/test/**"]
}
```

**.rawdocs.local.json** (not committed in target repo):
```json
{
  "rawDocsPath": "/absolute/path/to/raw-docs"
}
```

### Wrapper Script Template
The install script will generate this wrapper:
```javascript
#!/usr/bin/env node
import { readFileSync } from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read local config
const configPath = join(__dirname, '../../.rawdocs.local.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Run analyze-changes.mjs from raw-docs installation
const analyzePath = join(config.rawDocsPath, 'scripts/analyze-changes.mjs');
const child = spawn('node', [analyzePath, ...process.argv.slice(2)], {
  stdio: 'inherit'
});

child.on('exit', (code) => process.exit(code));
```

### Error Handling
- Missing configuration files
- Invalid JSON
- Missing rawDocsPath
- Script execution failures

### Backwards Compatibility
- Check for existing .rawdocs file
- Migrate settings if found
- Preserve user customizations

## Testing Strategy

1. Test configuration splitting
2. Test git hooks removal
3. Test wrapper script generation
4. Test package.json updates
5. Test complete installation flow
6. Test error scenarios

### Integration Testing with test-1 Repository
- Use the `../test-1` repository for testing
- Run `../raw-docs/install.sh` from the test-1 directory
- Verify that `npm run analyze-docs` in test-1 correctly:
  - Reads the local config
  - Executes the analyze-changes.mjs script
  - Produces expected output
- After testing, reset git state in test-1 to test again:
  - `git reset --hard` to remove file changes
  - `git clean -fd` to remove untracked files
  - This allows repeated testing without unexpected files/changes

## Expected Outcome

After completion:
- No git hooks installed or managed
- Clean separation of config (committed vs local)
- Simple wrapper script for running analysis in target repo
- Easy npm script access via `npm run analyze-docs` in target repo
- Simplified install process
- Better cross-machine portability
- Target repository has committed changes ready (wrapper script + package.json update)

## Risks and Mitigation

1. **Breaking existing installations**
   - Mitigation: Check for existing configs and migrate

2. **Path resolution issues**
   - Mitigation: Use absolute paths, handle cross-platform

3. **Missing analyze-changes.mjs**
   - Mitigation: Clear error messages with setup instructions

## CRITICAL: Implementation Tracking

**IMPORTANT**: When implementing this task, keep track of progress in this section:

### Implementation Progress
- [x] Step 1: Configuration splitting logic
- [x] Step 2: Git hooks removal
- [x] Step 3: Install script updates (configs, wrapper, package.json)
- [x] Testing completed
- [x] Documentation updated

### Git Commits
Track logical commits as implementation progresses:
1. [x] Remove git hooks logic from install script
2. [x] Add configuration splitting and wrapper generation logic
3. [ ] Update tests and documentation

### Notes
Implementation completed:
- Removed all git hooks logic from install-cross-repo.mjs
- Split configuration into .rawdocs.json (committed) and .rawdocs.local.json (not committed)
- Created wrapper script generation that reads local config
- Updated analyze-changes.mjs to work with new config format
- Updated check-docs.mjs to work with new config format
- Added uninstall functionality that removes all artifacts
- Migration logic handles old .rawdocs files

Changes made:
- scripts/install-cross-repo.mjs - Complete rewrite removing hooks, adding wrapper
- scripts/analyze-changes.mjs - Updated to read split config files
- scripts/check-docs.mjs - Updated to read split config files
- Old versions backed up with -old suffix