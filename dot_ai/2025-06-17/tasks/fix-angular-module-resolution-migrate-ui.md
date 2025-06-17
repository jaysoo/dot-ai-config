# Fix Angular Module Resolution in Migrate UI

## Executive Summary

**Final Solution: Simply use `process.chdir(workspacePath)` before running migrations.**

After trying 6 different approaches, the solution was surprisingly simple. Changing the working directory to the workspace before running migrations fixes both:
1. Module resolution issues (Cannot find module '@angular/core')
2. Angular migration path issues (Could not find any files to migrate)

The fix is just 5 lines of code that ensure migrations run in the correct directory context.

## Problem Statement
Angular migrations in Migrate UI cannot resolve modules like `@angular/core` even though they exist in the workspace. The issue appears to be that Node's module resolution is not properly configured to look in the workspace's `node_modules` directory when migrations are executed.

## Analysis
The issue occurs in the migration execution flow:
1. `runSingleMigration` in `libs/vscode/migrate/src/lib/commands/run-migration.ts` calls `importMigrateUIApi`
2. `importMigrateUIApi` uses `importNxPackagePath` which eventually calls `require()` 
3. When the migration code runs, it cannot resolve Angular modules from the workspace

## Proposed Solutions

After researching the problem and the provided approaches, the most promising solution is to use Node's `createRequire` functionality which is the modern, reliable way to handle custom module resolution paths.

### Primary Approach: Using createRequire
This approach leverages Node's built-in `createRequire` to create a require function that resolves from the workspace directory. This is more reliable than monkey-patching Node's internals.

## Implementation Plan

### Step 1: Update workspace-dependencies.ts with createRequire
- [ ] Modify `importWorkspaceDependency` function to use `createRequire` when available
- [ ] Create a fallback for older Node versions
- [ ] Ensure the require function resolves from the workspace path

### Step 2: Create module resolution helper for migrations
- [ ] Add a new function in `run-migration.ts` to set up proper module resolution
- [ ] Apply the resolution setup before running migrations
- [ ] Ensure it's isolated to the migration execution context

### Step 3: Test the fix
- [ ] Build the project
- [ ] Copy the built file to VS Code extension directory
- [ ] Test with an Angular migration that requires `@angular/core`

### Step 4: Handle edge cases
- [ ] Add error handling for module resolution failures
- [ ] Ensure the fix works with different package managers (npm, yarn, pnpm)
- [ ] Test with monorepo setups

## Implementation Details

### Option 1: Modify importWorkspaceDependency (Preferred)
Update the `importWorkspaceDependency` function in `workspace-dependencies.ts` to use `createRequire`:

```typescript
import { createRequire } from 'module';

export function importWorkspaceDependency<T>(
  importPath: string,
  workspacePath?: string,
  logger?: Logger,
): Promise<T> {
  if (platform() === 'win32') {
    importPath = importPath.replace(/\\/g, '/');
  }

  let imported;
  
  if (workspacePath && createRequire) {
    // Create a require function that resolves from the workspace
    const workspaceRequire = createRequire(join(workspacePath, 'package.json'));
    imported = workspaceRequire(importPath);
  } else {
    // Fallback to regular require
    imported = require(importPath);
  }

  logger?.log(`Using local Nx package at ${importPath}`);

  return imported;
}
```

### Option 2: Patch module resolution in runSingleMigration
Add module resolution setup directly in the migration execution:

```typescript
import { createRequire } from 'module';

function setupModuleResolution(workspacePath: string) {
  const Module = require('module');
  const originalResolveFilename = Module._resolveFilename;
  
  Module._resolveFilename = function(request: string, parent: any, isMain: boolean) {
    try {
      return originalResolveFilename.call(this, request, parent, isMain);
    } catch (e) {
      // Try to resolve from workspace
      const workspaceRequire = createRequire(join(workspacePath, 'package.json'));
      try {
        return workspaceRequire.resolve(request);
      } catch (e2) {
        throw e; // Throw original error
      }
    }
  };
  
  return () => {
    Module._resolveFilename = originalResolveFilename;
  };
}
```

## Reasoning for Approach Selection

1. **createRequire is the recommended approach**: It's the official Node.js API for creating custom require functions with specific resolution paths.

2. **Less invasive than monkey-patching**: Using `createRequire` avoids modifying Node's internals, which can be fragile and cause side effects.

3. **Better isolation**: The fix can be isolated to the specific context where it's needed (migration execution).

4. **Forward compatibility**: `createRequire` is the modern approach and will continue to be supported in future Node versions.

## Expected Outcome

After implementing this fix:
1. Angular migrations should be able to resolve modules like `@angular/core` from the workspace
2. The module resolution should work correctly for all workspace dependencies
3. The fix should not affect other parts of the VS Code extension
4. Migrations should run successfully without module resolution errors

## Verification Steps

1. Build the extension: `yarn nx run vscode:build`
2. Copy to VS Code: `cp dist/apps/vscode/main.js /Users/jack/.vscode/extensions/nrwl.angular-console-0.0.0/main.js`
3. Run an Angular migration that imports `@angular/core`
4. Verify no module resolution errors occur

## CRITICAL: Implementation Tracking
- [x] Research completed - Multiple approaches tried
- [x] Code changes implemented - NODE_PATH solution + safe chdir
- [x] Build completed - nx package vscode --skip-nx-cache
- [x] Copied to VS Code extension directory
- [x] Manual testing performed - Both issues resolved
- [x] Fix verified working - Module resolution and Angular migrations work

## Final Solution Summary

**Update: The NODE_PATH patch was removed because `process.chdir` alone fixes both issues!**

**Final Update: Implemented a cleaner child process approach for better isolation**

### Evolution of the Solution:

1. **Initial attempts**: Complex module patching (failed)
2. **Simple fix**: `process.chdir(workspacePath)` worked perfectly
3. **Final improvement**: Child process approach for clean isolation

### Final Implementation - Child Process Approach:
```typescript
async function runMigrationInChildProcess(
  workspacePath: string,
  migration: MigrationDetailsWithId,
  configuration: { createCommits: boolean }
): Promise<void> {
  // Pass data via environment variables to avoid escaping issues
  const migrationEnv = {
    ...process.env,
    NX_MIGRATION_WORKSPACE: workspacePath,
    NX_MIGRATION_DATA: JSON.stringify(migration),
    NX_MIGRATION_CONFIG: JSON.stringify(configuration),
    NODE_PATH: join(workspacePath, 'node_modules')
  };

  // Run migration in a Node child process
  const child = spawn(process.execPath, ['-e', migrationScript], {
    cwd: workspacePath,
    env: migrationEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true
  });
  
  // Handle success/failure...
}
```

### Benefits of Child Process Approach:
- **Clean isolation**: Main VS Code process is unaffected
- **Proper working directory**: Child process runs with workspace as cwd
- **No side effects**: No need to restore original cwd
- **Background execution**: Runs silently without terminal window
- **Better error handling**: Captures stderr for debugging

This approach provides the same fix but with better architectural separation.

## Implementation Summary

### Attempt 1: Module patching in runSingleMigration (Failed)
- Created `setupModuleResolutionForMigrations` function with createRequire
- Result: Did not work

### Attempt 2: Modify importWorkspaceDependency with createRequire (Failed)
- Updated `importWorkspaceDependency` to accept optional workspacePath parameter
- Use `createRequire` when workspacePath is provided to ensure proper module resolution
- Updated `importNxPackagePath` to pass workspacePath to importWorkspaceDependency
- Result: Still getting "Cannot find module '@angular/core'" error

### Attempt 3: Aggressive module resolution patching (Progress!)
- The error shows it's happening in nx's package-json.js when trying to require @angular/core
- Implemented `patchModuleResolution` that patches both:
  - `Module._nodeModulePaths` to add workspace node_modules to all module searches
  - `Module._resolveFilename` as a fallback for direct resolution
- Applied the patch BEFORE importing the migrate UI API
- Result: Module resolution worked! But got new error: "The 'path' argument must be of type string... Received null"

### Attempt 4: Enhanced module resolution with null handling (Failed)
- Added null checks and fallbacks for:
  - `Module._nodeModulePaths` when from is null
  - `Module._resolveLookupPaths` to handle null parent modules
  - `Module._resolveFilename` to create dummy parent when needed
- Result: Still getting "path argument must be of type string" error

### Attempt 5: Working directory change + createRequire monkey-patch (Failed)
- Error shows migration runs in `/private/tmp/migrate1/` which lacks node_modules
- Tried changing cwd and using createRequire
- Result: Still getting "path argument must be of type string" error

### Attempt 6: Simple NODE_PATH with Module._initPaths() (SUCCESS!)
- Reset code to origin master
- Simple approach:
  1. Set NODE_PATH to workspace node_modules
  2. Call Module._initPaths() to reinitialize with new NODE_PATH
  3. Run migration
  4. Restore NODE_PATH and reinitialize again
- This is the simplest approach focusing only on NODE_PATH
- **RESULT: This worked! Module resolution is now working correctly.**

## New Issue: Angular Control Flow Migration Path

The Angular control-flow-migration fails with:
```
Could not find any files to migrate under the path undefined. Cannot run the control flow migration.
```

This happens because:
- The migration runs in a different directory (likely temp dir)
- Angular doesn't know where to look for files
- `process.chdir` worked but was deemed unsafe

### Potential Solutions:
1. Pass workspace path as an environment variable that Angular might read
2. Fork a child process with correct cwd (safer than changing main process cwd)
3. Investigate if Angular migration accepts a path parameter

### Solution Implemented: Safe process.chdir with proper restoration
- Save original working directory before changing
- Change to workspace directory for the migration
- Use nested try-finally blocks to ensure restoration
- Add error handling for restoration failures
- This makes `process.chdir` safer by guaranteeing restoration

The implementation:
1. Save `originalCwd = process.cwd()`
2. Change to workspace with `process.chdir(workspacePath)`
3. Run migration
4. Always restore with `process.chdir(originalCwd)` in finally block
5. Handle errors during restoration

This ensures Angular migrations can find their files while maintaining safety.