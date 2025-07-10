# Refactor Nx Cloud Error Handling in Remote Cache Plugins

## Task Overview
Address Cammisuli's PR comment to move duplicated error handling logic from individual cache plugin generators into the shared `autoRegisterNxKey` function.

## Context
- PR #7801: Improve error message when adding remote cache plugins while connected to Nx Cloud
- Current implementation duplicates the same error handling logic across 4 files:
  - `libs/nx-packages/azure-cache/src/generators/init/generator.ts`
  - `libs/nx-packages/gcs-cache/src/generators/init/generator.ts`
  - `libs/nx-packages/s3-cache/src/generators/init/generator.ts`
  - `libs/nx-packages/shared-fs-cache/src/generators/init/generator.ts`
- The logic should be moved to `libs/nx-packages/nx-key/src/auto-register.ts:84` in the `autoRegisterNxKey` function

## Current Duplicated Code
Each generator has this identical error handling:
```typescript
try {
  await autoRegisterNxKey(workspaceRoot);
} catch (err: unknown) {
  if (
    err &&
    typeof err === 'object' &&
    'code' in err &&
    err.code === 'GenericFailure'
  ) {
    if (readNxJson(tree)?.nxCloudId) {
      throw new Error(
        `Workspace already connected to Nx Cloud remote cache. To complete setup: run "nx connect". To switch to self-hosted cache: remove "nxCloudId" from nx.json (reduced security).`,
      );
    }
  }
  throw err;
}
```

## Implementation Plan

### Phase 1: Modify autoRegisterNxKey function
1. [x] Update `autoRegisterNxKey` to accept an optional parameter for checking nxCloudId
2. [x] Move the error handling logic into the function
3. [x] Ensure the function can access the necessary context (Tree/nxJson)

### Phase 2: Update cache plugin generators
1. [x] Remove duplicated error handling from azure-cache generator
2. [x] Remove duplicated error handling from gcs-cache generator
3. [x] Remove duplicated error handling from s3-cache generator
4. [x] Remove duplicated error handling from shared-fs-cache generator
5. [x] Update each generator to use the enhanced autoRegisterNxKey

### Phase 3: Testing & Verification
1. [ ] Test that the error message appears correctly when nxCloudId is present
2. [ ] Test that normal flow works when nxCloudId is not present
3. [ ] Run existing tests to ensure no regression

## Technical Considerations
- The `autoRegisterNxKey` function currently doesn't have access to the Tree object
- We need to decide whether to:
  a. Pass the Tree object to autoRegisterNxKey
  b. Pass just the nxCloudId value
  c. Pass a callback function for checking nxCloudId
  d. Use a different approach to read nx.json within autoRegisterNxKey

## Proposed Solution
After reviewing the code, the best approach is to:
1. Modify `autoRegisterNxKey` to accept an options object with an optional `nxCloudId` field
2. Have the function check for nxCloudId and throw the appropriate error
3. Update all generators to pass the nxCloudId when calling autoRegisterNxKey

## Expected Outcome
- Single source of truth for the Nx Cloud connection error handling
- Cleaner, more maintainable code
- Easier to update the error message in the future if needed

## CRITICAL: Track implementation progress
As we implement this task, we must update the TODO sections in each step to track where we are in the implementation.