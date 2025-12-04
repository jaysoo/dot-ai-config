# NXC-3464 PR Review Fixes

**PR**: https://github.com/nrwl/nx/pull/33468
**Branch**: NXC-3464
**Date**: 2025-12-02

## Summary

This task addresses PR review comments from the CNW (Create Nx Workspace) templates feature PR. The fixes are primarily cleanup and refinements to the code.

---

## Task List

### 1. Add version back to error message
**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts` (line ~244)

**Current**:
```typescript
output.error({
  title: `Failed to create workspace!`,
  bodyLines: mapErrorToBodyLines(error),
});
```

**Fix**: Add version to error message for debugging
```typescript
const { version } = require('../package.json');
output.error({
  title: `Failed to create workspace (v${version})`,
  bodyLines: mapErrorToBodyLines(error),
});
```

---

### 2. Remove unreachable throw after process.exit
**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts` (line ~248-249)

**Current**:
```typescript
process.exit(1);
throw error;
```

**Fix**: Remove the unreachable `throw error` line

---

### 3. Fix meta recording to use correct prompt codes
**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts` (line ~291-294)

**Current**:
```typescript
meta: [
  messages.codeOfSelectedPromptMessage('setupCI'),
  messages.codeOfSelectedPromptMessage('setupNxCloud'),
  messages.codeOfSelectedPromptMessage('setupNxCloudV2'),
  // ...
],
```

**Fix**: Use fallback logic - if new flow (setupNxCloudV2) doesn't have a code, fall back to old flow (setupNxCloud)
```typescript
meta: [
  messages.codeOfSelectedPromptMessage('setupNxCloudV2') || messages.codeOfSelectedPromptMessage('setupCI'),
  messages.codeOfSelectedPromptMessage('setupNxCloudV2') || messages.codeOfSelectedPromptMessage('setupNxCloud'),
  // ...
],
```

---

### 4. Fix start meta prefix based on flow variant
**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts` (line ~342)

**Current**:
```typescript
meta: ['start'],
```

**Fix**: Use `start` or `start-v2` depending on which flow user hits
```typescript
meta: [getFlowVariant() === '1' ? 'start-v2' : 'start'],
```

Note: Need to call `shouldUseTemplateFlow()` or similar before this point to ensure flowVariant is set, or call `getFlowVariant()` which handles the initialization.

---

### 5. Remove unnecessary determinePackageManager and determineDefaultBase for template flow
**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts` (line ~351-353)

**Current**:
```typescript
const packageManager = await determinePackageManager(argv);
const defaultBase = await determineDefaultBase(argv);
```

**Fix**: Remove these calls for template flow since it always uses npm and 'main'
```typescript
// Template flow always uses npm and 'main' branch
```

Update the Object.assign to use hardcoded values:
```typescript
Object.assign(argv, {
  nxCloud,
  useGitHub: nxCloud !== 'skip',
  completionMessageKey,
  packageManager: 'npm',
  defaultBase: 'main',
  aiAgents,
});
```

---

### 6. Remove nxCloudPromptCode and completionMessageKey from template flow options
**File**: `packages/create-nx-workspace/bin/create-nx-workspace.ts` (line ~356-367)

**Status**: Already fixed in previous session. Verify `nxCloudPromptCode` is removed.

Note: `completionMessageKey` should stay as it's still used for the completion message display.

---

### 7. Rename 'skip' to 'custom' in determineTemplate
**File**: `packages/create-nx-workspace/src/internal-utils/prompts.ts` (line ~127-168)

**Current**:
```typescript
if (parsedArgs.preset) return 'skip';
if (!parsedArgs.interactive || isCI()) return 'skip';
// ...
choices: [
  // ...
  {
    name: 'skip',
    message: 'Custom            (more options for frameworks, test runners, etc.)',
  },
],
```

**Fix**: Rename 'skip' to 'custom'
```typescript
if (parsedArgs.preset) return 'custom';
if (!parsedArgs.interactive || isCI()) return 'custom';
// ...
choices: [
  // ...
  {
    name: 'custom',
    message: 'Custom            (more options for frameworks, test runners, etc.)',
  },
],
```

Also update check in `create-nx-workspace.ts`:
```typescript
if (template !== 'custom') {
```

---

### 8. Add comment about silent error in pushToGitHub
**File**: `packages/create-nx-workspace/src/utils/git/git.ts` (line ~175)

**Current**:
```typescript
const username = await getGitHubUsername(directory);
```

**Fix**: Add comment explaining this could cause an error even without user knowing we tried to push
```typescript
// Note: This call can throw an error even if user hasn't opted in to push yet,
// which could be confusing as they haven't been asked about GitHub push at this point
const username = await getGitHubUsername(directory);
```

---

### 9. Restore error code 127 handling for gh not installed
**File**: `packages/create-nx-workspace/src/utils/git/git.ts` (line ~252)

**Current**:
```typescript
const title = 'Could not push. Push repo to complete setup.';
```

**Fix**: Restore the conditional title based on error type
```typescript
// Error code 127 means gh wasn't installed
const title =
  e instanceof GitHubPushSkippedError || (e as any)?.code === 127
    ? 'Push your workspace to GitHub.'
    : 'Failed to push workspace to GitHub.';
```

---

### 10. Rename NX_CNW_PROMPT_VARIANT to NX_CNW_FLOW_VARIANT
**File**: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`

**Current**: All references to `NX_CNW_PROMPT_VARIANT`

**Fix**: Rename to `NX_CNW_FLOW_VARIANT` throughout the file:
- Line 38-39 comment
- Line 50 in `shouldUseTemplateFlow()`
- Line 61 in the cache write condition
- Line 78 in `getFlowVariant()`

---

### 11. Deduplicate logic between getFlowVariant and shouldUseTemplateFlow
**File**: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`

**Current**: Both functions have similar logic for determining flow variant

**Fix**: `shouldUseTemplateFlow` should call `getFlowVariant()` to get the variant string, then return boolean
```typescript
export function shouldUseTemplateFlow(): boolean {
  if (process.env.NX_GENERATE_DOCS_PROCESS === 'true') {
    flowVariantCache = '0';
    return false;
  }

  const variant = getFlowVariantInternal();
  return variant === '1';
}

function getFlowVariantInternal(): string {
  if (flowVariantCache) return flowVariantCache;

  const variant =
    process.env.NX_CNW_FLOW_VARIANT ??
    readCachedFlowVariant() ??
    (Math.random() < 0.5 ? '0' : '1');

  flowVariantCache = variant;

  // Only write to cache if we randomly assigned a variant and no cache exists yet
  if (!process.env.NX_CNW_FLOW_VARIANT && !existsSync(FLOW_VARIANT_CACHE_FILE)) {
    writeCachedFlowVariant(variant);
  }

  return variant;
}

export function getFlowVariant(): string {
  if (process.env.NX_GENERATE_DOCS_PROCESS === 'true') {
    return '0';
  }
  return flowVariantCache ?? getFlowVariantInternal();
}
```

---

### 12. Remove cleanupLockfiles function and calls
**File**: `packages/create-nx-workspace/src/utils/template/clone-template.ts`

**Fix**: Remove the `cleanupLockfiles` function entirely since template flow always uses npm

**File**: `packages/create-nx-workspace/src/create-workspace.ts`

**Fix**: Remove the import and call to `cleanupLockfiles`

---

### 13. Remove 'type: success' from messages.ts
**File**: `packages/create-nx-workspace/src/utils/nx/messages.ts`

**Current**:
```typescript
return {
  title: completionMessages[key].title,
  type: 'success',
  bodyLines: [getSetupMessage(url, pushedToVcs)],
};
```

**Fix**: Remove `type: 'success'` since it's always success and warn types were removed
```typescript
return {
  title: completionMessages[key].title,
  bodyLines: [getSetupMessage(url, pushedToVcs)],
};
```

Also update return type annotations to remove `type` field.

---

### 14. Remove cleanupLockfiles and getPackageManagerCommand from create-workspace.ts
**File**: `packages/create-nx-workspace/src/create-workspace.ts`

**Fix**:
- Remove import of `cleanupLockfiles`
- Remove import of `getPackageManagerCommand`
- Remove any calls to these functions

---

### 15. Verify createNxCloudOnboardingUrl doesn't pass variant or nxCloudPromptCode
**File**: `packages/create-nx-workspace/src/create-workspace.ts`

**Status**: Already fixed in previous session. Verify the function signature and call site are correct.

---

## Implementation Order

1. Tasks 10, 11 (ab-testing.ts refactoring) - core logic changes
2. Tasks 12, 14 (remove cleanupLockfiles) - cleanup
3. Tasks 1, 2, 3, 4, 5, 6 (create-nx-workspace.ts) - CLI fixes
4. Task 7 (prompts.ts) - rename skip to custom
5. Tasks 8, 9 (git.ts) - error handling
6. Task 13 (messages.ts) - type cleanup
7. Task 15 - verification

---

## Testing

After all changes:
```bash
nx run-many -t test,build,lint -p create-nx-workspace
nx affected -t build,test,lint
```

Manual testing:
```bash
# Test template flow (variant 1)
NX_CNW_FLOW_VARIANT=1 npx create-nx-workspace@local testworkspace --no-interactive

# Test preset flow (variant 0)
NX_CNW_FLOW_VARIANT=0 npx create-nx-workspace@local testworkspace --no-interactive
```
