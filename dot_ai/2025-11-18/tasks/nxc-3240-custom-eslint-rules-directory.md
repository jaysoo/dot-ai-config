# Task: NXC-3240 - Add Support for Custom ESLint Rules Directory

**Linear Issue**: https://linear.app/nxdev/issue/NXC-3240
**GitHub Discussion**: https://github.com/nrwl/nx/discussions/32668
**Branch**: `feat/issue-32668`
**Due Date**: 2025-11-21

## Summary

Expose a utility function `loadWorkspaceRules()` that allows users to load ESLint rules from custom directories (not just the hardcoded `tools/eslint-rules`). This is requested by Fidelity.

## What's Done (Working)

### Implementation (packages/eslint-plugin/src/resolve-workspace-rules.ts)

1. **New async function `loadWorkspaceRules(directory, tsConfigPath?)`**
   - Takes a directory path (relative to workspace root or absolute)
   - Optionally takes a tsconfig path for TypeScript compilation
   - Returns `Promise<ESLintRules>` (rules without prefix)
   - Includes validation for directory existence and workspace boundaries

2. **Helper function `findTsConfig()`**
   - Auto-discovers tsconfig.json by crawling up from directory to workspace root
   - Validates tsconfig is within workspace boundaries

3. **Refactored `workspaceRules` export**
   - Now uses `loadWorkspaceRules()` internally
   - Uses top-level await: `export const workspaceRules = await (async () => {...})()`
   - Maintains backward compatibility with `workspace-rulename` and `workspace/rulename` prefixes

4. **Good documentation**
   - JSDoc with examples showing usage patterns

### Why CJS Works

The implementation uses `loadConfigFile(resolvedDirectory)` which internally falls through to:
```typescript
// In config-utils.ts, loadModuleByExtension()
default:
  return await load(path);  // Tries CJS first

// load() function:
return await loadCommonJS(path);  // Uses require()
```

**CJS Success Path**:
- `require('/path/to/eslint-rules')` → Node resolves directory to `index.js`/`index.ts`
- Works because Node's `require()` automatically resolves directories to index files

## What's NOT Working (The Bug)

### ESM Fails

When the rules directory is an ESM module (or when CJS fails with `ERR_REQUIRE_ESM`), it falls back to:

```typescript
async function loadESM(path: string): Promise<any> {
  const pathAsFileUrl = pathToFileURL(path).pathname;
  return await dynamicImport(`${pathAsFileUrl}?t=${Date.now()}`);
}
```

**ESM Failure Path**:
- `import('/path/to/eslint-rules')` → Fails!
- Dynamic `import()` does NOT resolve directories to index files like `require()` does
- ESM requires explicit file paths with extensions

### Root Cause

The problem is in `resolve-workspace-rules.ts:129`:
```typescript
const moduleExports = await loadConfigFile(resolvedDirectory);  // Directory path, not file!
```

`loadConfigFile()` is designed for **file paths** with extensions, not directories:
- `extname('/path/to/eslint-rules')` returns `''` (empty string)
- Falls to default case which tries CJS then ESM
- CJS works because `require()` handles directories
- ESM fails because `import()` requires explicit file paths

## The Fix Required

Need to resolve the directory to an actual entry point file before calling `loadConfigFile()`.

### Option 1: Resolve Index File in loadWorkspaceRules

Add logic to find the entry file:

```typescript
function resolveDirectoryEntryFile(directory: string): string {
  // Check for index files in priority order
  const indexFiles = [
    'index.ts',
    'index.mts',
    'index.cts',
    'index.js',
    'index.mjs',
    'index.cjs',
  ];

  for (const indexFile of indexFiles) {
    const candidatePath = join(directory, indexFile);
    if (existsSync(candidatePath)) {
      return candidatePath;
    }
  }

  // Check package.json main/module fields
  const pkgJsonPath = join(directory, 'package.json');
  if (existsSync(pkgJsonPath)) {
    const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf-8'));
    const entryPoint = pkg.module || pkg.main;
    if (entryPoint) {
      return join(directory, entryPoint);
    }
  }

  throw new Error(`No entry point found in directory: ${directory}`);
}
```

### Option 2: Enhance loadConfigFile to Handle Directories

Add directory resolution in `config-utils.ts` itself. This would be more general-purpose.

## Next Steps

### 1. Choose Implementation Approach
- **Option 1** (local fix) is simpler and scoped to this feature
- **Option 2** (enhance loadConfigFile) is more general but higher risk

**Recommendation**: Start with Option 1 in `resolve-workspace-rules.ts`

### 2. Implement Directory Resolution
- Add `resolveDirectoryEntryFile()` function
- Call it before `loadConfigFile()`:
  ```typescript
  const entryFile = resolveDirectoryEntryFile(resolvedDirectory);
  const moduleExports = await loadConfigFile(entryFile);
  ```

### 3. Handle TypeScript Registration Properly
- Current code registers TS project before loading
- Need to ensure the found entry file extension (.ts/.mts/.cts) works with the registration

### 4. Add Tests
- No tests exist for `loadWorkspaceRules()`
- Need tests for:
  - CJS directory with index.js
  - ESM directory with index.mjs
  - TypeScript directory with index.ts
  - Directory with package.json main field
  - Error cases (no entry point found)

### 5. Export the Function
- Verify `loadWorkspaceRules` is exported from the package's public API
- Add to index.ts exports if not already

### 6. Test with Reproduction
- Create test workspace with custom ESLint rules directory
- Test with both CJS and ESM configurations
- Test with TypeScript rules

### 7. Update Documentation
- Add to Nx docs showing usage pattern
- Example for eslint.config.js:
  ```javascript
  import { loadWorkspaceRules } from '@nx/eslint-plugin';

  const myRules = await loadWorkspaceRules('libs/my-eslint-plugin/rules');

  export default [
    {
      plugins: { myOrg: { rules: myRules } },
      rules: { 'myOrg/my-rule': 'error' }
    }
  ];
  ```

## Questions to Resolve

1. **Should we support package.json resolution?** Or just index files?
2. **What about nested exports in package.json?** (exports field)
3. **Is top-level await acceptable?** The current `workspaceRules` uses it - this limits where it can be imported from.

## Related Files

- `packages/eslint-plugin/src/resolve-workspace-rules.ts` - Main implementation
- `packages/devkit/src/utils/config-utils.ts` - Config loading utility
- `packages/eslint-plugin/src/constants.ts` - WORKSPACE_PLUGIN_DIR constant
- `tools/eslint-rules/index.ts` - Example of existing structure

## Status

- [x] Initial implementation done
- [x] CJS working
- [ ] ESM not working - needs directory-to-file resolution
- [ ] No tests written
- [ ] Not exported from public API (needs verification)
- [ ] No documentation
