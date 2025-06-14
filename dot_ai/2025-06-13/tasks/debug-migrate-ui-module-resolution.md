# Debug Migrate UI Module Resolution Issue

**Date:** 2025-06-13  
**Type:** Bug Fix / Research  
**Priority:** High  
**Status:** In Progress  

## Problem Statement

The Migrate UI in Nx Console fails to resolve node_modules packages when running migrations, while the same migrations work correctly when executed via terminal using `nx migrate --run-migrations`. 

**Example Error:**
- Migration: `@nx/angular/src/migrations/update-21-0-0/do-something.js`
- Tries to load: `@angular/core`
- Result: Module not found error in UI, but works in terminal

## Hypothesis

The issue likely stems from differences in:
1. Working directory (cwd) when executing migrations
2. NODE_PATH environment variable
3. Module resolution context
4. Process environment inheritance

## Investigation Plan

### Step 1: Understand Current Migration Execution Flow
**Goal:** Map out how migrations are executed in both terminal and UI contexts

**TODO:**
- [ ] Examine `libs/vscode/migrate/src/lib/commands/run-migration.ts`
- [ ] Check how the migration process is spawned
- [ ] Identify working directory used
- [ ] Check environment variables passed
- [ ] Compare with Nx CLI's migrate implementation

**Expected findings:** Differences in process spawning, cwd, or environment setup

### Step 2: Trace Module Resolution Paths
**Goal:** Identify where module resolution differs between UI and terminal

**TODO:**
- [ ] Create debug script to log:
  - Current working directory
  - NODE_PATH
  - require.resolve.paths() output
  - process.env
- [ ] Run test migration in both contexts
- [ ] Compare output differences
- [ ] Check if migrations run in workspace root vs project root

**Debug Script:** `debug-module-paths.mjs`

### Step 3: Analyze Nx Migrate CLI Implementation
**Goal:** Understand how Nx CLI handles module resolution for migrations

**TODO:**
- [ ] Find Nx's migrate command implementation
- [ ] Check how it sets up the migration runner context
- [ ] Identify any special NODE_PATH or require path setup
- [ ] Look for module resolution helpers

**Key files to examine:**
- Nx migrate command implementation
- Migration runner setup
- Module loading utilities

### Step 4: Test Potential Fixes
**Goal:** Implement and test solutions

**TODO:**
- [ ] Test fix 1: Set explicit NODE_PATH
- [ ] Test fix 2: Change working directory
- [ ] Test fix 3: Use require.resolve with paths option
- [ ] Test fix 4: Inject module paths into child process

**Test migration:** Create minimal reproduction case

### Step 5: Implement Solution
**Goal:** Apply the fix that resolves the issue

**TODO:**
- [ ] Implement chosen solution
- [ ] Add error handling for edge cases
- [ ] Test with various migration scenarios
- [ ] Ensure backward compatibility

## Technical Details to Research

1. **Child Process Spawning:**
   - How does migrate UI spawn the migration process?
   - What options are passed to spawn/exec?
   - Is the environment properly inherited?

2. **Module Resolution Context:**
   - Where are migrations executed from?
   - What is the require context?
   - Are node_modules accessible from execution location?

3. **Path Construction:**
   - How are paths to migrations constructed?
   - Are they absolute or relative?
   - Is there path normalization?

## Alternative Approaches

1. **Approach A: Environment Variable Fix**
   - Set NODE_PATH to include workspace node_modules
   - Pros: Simple, non-invasive
   - Cons: May not work for all scenarios

2. **Approach B: Working Directory Fix**
   - Ensure migrations run from workspace root
   - Pros: Matches terminal behavior
   - Cons: May break relative path assumptions

3. **Approach C: Module Loader Injection**
   - Inject custom module resolution logic
   - Pros: Full control over resolution
   - Cons: Complex, potential side effects

4. **Approach D: Process Options Enhancement**
   - Pass additional options to child process
   - Pros: Clean separation
   - Cons: Requires understanding of all edge cases

## Success Criteria

- [ ] Migrations that import workspace dependencies work in UI
- [ ] No regression in existing migration functionality
- [ ] Clear error messages if resolution still fails
- [ ] Solution works across different workspace setups

## Expected Outcome

When complete, the Migrate UI should successfully run migrations that import packages from node_modules, matching the behavior of the terminal command. The fix should be minimal, maintainable, and not introduce new dependencies or complexity.

## Implementation Tracking

**CRITICAL: When implementing this task, keep track of all changes, findings, and test results in sections below:**

### Findings Log

#### Root Cause Identified (2025-06-13 17:20)

**Issue:** VS Code Migrate UI doesn't set NODE_PATH before running migrations, while Nx CLI does.

**Key Discovery:**
1. In `node_modules/nx/src/command-line/migrate/migrate.js`, the Nx CLI explicitly adds to NODE_PATH:
   ```javascript
   // Set NODE_PATH so that these modules can be used for module resolution
   addToNodePath(join(tmpDir, 'node_modules'));
   addToNodePath(join(workspaceRoot, 'node_modules'));
   ```

2. The `addToNodePath` function properly handles OS-specific path delimiters (`:` on Unix, `;` on Windows)

3. VS Code's migrate UI (`libs/vscode/migrate/`) has no NODE_PATH handling

**Migration Execution Flow:**
- Migrations are loaded via `require()` from their actual location in node_modules
- Example: `node_modules/@nx/angular/src/migrations/update-21-0-0/do-something.js`
- When this migration tries to `require('@angular/core')`, Node.js can't find it because:
  - The migration file is deep in `@nx/angular` directory
  - Node's default resolution doesn't look in workspace root's node_modules
  - NODE_PATH is not set to help with resolution

**Why it works in terminal:**
- Nx CLI sets NODE_PATH before running migrations
- This allows migrations to find packages in workspace's node_modules

### Code Changes

#### Proposed Fix Location
**File:** `libs/vscode/migrate/src/lib/commands/run-migration.ts`

**Change Required:** Add NODE_PATH configuration before calling migrate UI API

**Implementation:** See `proposed-fix-node-path.ts` for complete solution

### Test Results
<!-- Document test scenarios and outcomes -->

### Decision Log
<!-- Record why certain approaches were chosen or rejected -->