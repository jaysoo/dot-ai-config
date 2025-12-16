# NXC-3624: Simplify Custom/Preset Flow Cloud Prompt

**Branch**: `NXC-3624`
**Date**: 2025-12-16

## Summary

Simplify the "custom" (preset) flow's Nx Cloud prompts to use the same `setupNxCloudV2` prompt as the template flow, instead of the old `setupCI` (which-ci-provider) + `setupNxCloud` (enable-caching2) prompts.

## Current Behavior

### Template Flow (variant 1)
- Uses `determineNxCloudV2()` which shows `setupNxCloudV2` prompt:
  - "Try the full Nx platform?" → Yes / Skip
- Returns `'yes'` or `'skip'`
- If Yes: `useGitHub = true`, no CI generation (because `nxCloud !== 'yes'` is false)

### Preset/Custom Flow (variant 0)
- Uses `determineNxCloud()` which shows:
  1. `setupCI` prompt: "Which CI provider would you like to use?" → github/gitlab/azure/etc/skip
  2. Fallback to `setupNxCloud` prompt: "Would you like remote caching to make your build faster?" → yes/skip
- If `nxCloud` is a CI provider (github, gitlab, etc.), CI workflow is generated

## Desired Behavior

### When `--nxCloud <provider>` CLI arg is provided:
- **Keep current behavior**: Use the provided value, generate CI workflow for that provider

### When NO `--nxCloud` CLI arg is provided (interactive):
- **New behavior**: Use `setupNxCloudV2` prompt ("Try the full Nx platform?")
- If Yes → `nxCloud = 'yes'`, `useGitHub = true`, **no CI generation**
- If Skip → `nxCloud = 'skip'`

This makes the preset flow behave like the template flow when no CLI arg is provided.

## Implementation Plan

### 1. Modify `create-nx-workspace.ts` middleware (preset flow section)

**Location**: Lines 468-504

**Current code**:
```typescript
} else {
  // Preset flow - existing behavior
  ...
  packageManager = await determinePackageManager(argv);
  const aiAgents = await determineAiAgents(argv);
  const defaultBase = await determineDefaultBase(argv);
  const nxCloud =
    argv.skipGit === true ? 'skip' : await determineNxCloud(argv);
  const useGitHub =
    nxCloud === 'skip'
      ? undefined
      : nxCloud === 'github' || (await determineIfGitHubWillBeUsed(argv));
  Object.assign(argv, {
    nxCloud,
    useGitHub,
    packageManager,
    defaultBase,
    aiAgents,
  });
  ...
}
```

**New code**:
```typescript
} else {
  // Preset flow - existing behavior
  ...
  packageManager = await determinePackageManager(argv);
  const aiAgents = await determineAiAgents(argv);
  const defaultBase = await determineDefaultBase(argv);

  let nxCloud: string;
  let useGitHub: boolean | undefined;
  let completionMessageKey: string | undefined;

  // Check if CLI arg was provided (use rawArgs to check original input)
  const cliArgProvided = rawArgs.nxCloud !== undefined;

  if (argv.skipGit === true) {
    nxCloud = 'skip';
    useGitHub = undefined;
  } else if (cliArgProvided) {
    // CLI arg provided: use existing flow (CI provider selection if needed)
    nxCloud = await determineNxCloud(argv);
    useGitHub =
      nxCloud === 'skip'
        ? undefined
        : nxCloud === 'github' || (await determineIfGitHubWillBeUsed(argv));
  } else {
    // No CLI arg: use simplified prompt (same as template flow)
    nxCloud = await determineNxCloudV2(argv);
    useGitHub = nxCloud !== 'skip';
    completionMessageKey =
      nxCloud === 'skip'
        ? undefined
        : messages.completionMessageOfSelectedPrompt('setupNxCloudV2');
  }

  Object.assign(argv, {
    nxCloud,
    useGitHub,
    completionMessageKey,
    packageManager,
    defaultBase,
    aiAgents,
  });
  ...
}
```

### 2. Modify `create-workspace.ts` GitHub push condition

**Location**: Lines 163-174

**Current code**:
```typescript
if (
  commit &&
  !skipGitHubPush &&
  (nxCloud === 'github' || (isTemplate && nxCloud === 'yes'))
) {
  pushedToVcs = await pushToGitHub(directory, {...});
}
```

**New code**:
```typescript
if (
  commit &&
  !skipGitHubPush &&
  (nxCloud === 'github' || nxCloud === 'yes')
) {
  pushedToVcs = await pushToGitHub(directory, {...});
}
```

This removes the `isTemplate` check so preset flow with `nxCloud === 'yes'` also pushes to GitHub.

### 3. Verify CI generation condition (no change needed)

**Location**: Lines 149-152

```typescript
// Only generate CI for preset flow (not template)
if (nxCloud !== 'skip' && !isTemplate && nxCloud !== 'yes') {
  await setupCI(directory, nxCloud, packageManager);
}
```

This already handles `nxCloud === 'yes'` correctly:
- `nxCloud === 'yes'` → `nxCloud !== 'yes'` is false → no CI generation
- `nxCloud === 'github'` → `nxCloud !== 'yes'` is true → CI is generated

## Files to Modify

1. `packages/create-nx-workspace/bin/create-nx-workspace.ts`
   - Modify preset flow section to check `rawArgs.nxCloud`
   - Use `determineNxCloudV2` when no CLI arg provided
   - Add `completionMessageKey` to track which prompt variant was shown

2. `packages/create-nx-workspace/src/create-workspace.ts`
   - Update GitHub push condition to include preset flow with `nxCloud === 'yes'`

## Test Scenarios

### 1. Preset flow with CLI arg (current behavior preserved)
```bash
npx create-nx-workspace myapp --preset react-standalone --nxCloud github
# Should: Show preset prompts, generate GitHub CI workflow, enable cloud
```

### 2. Preset flow without CLI arg (new behavior)
```bash
npx create-nx-workspace myapp --preset react-standalone
# Should: Show preset prompts, then "Try the full Nx platform?" → Yes/Skip
# If Yes: Enable cloud, push to GitHub, NO CI workflow generation
```

### 3. Custom flow (interactive, no --preset)
```bash
npx create-nx-workspace myapp
# Choose: "Custom" from template prompt
# Should: Show stack/preset prompts, then "Try the full Nx platform?" → Yes/Skip
```

### 4. Template flow (unchanged)
```bash
npx create-nx-workspace myapp
# Choose: "React" from template prompt
# Should: Same as before - "Try the full Nx platform?" → Yes/Skip
```

## Tracking

The stat recording already captures:
- `setupCloudPrompt`: Which prompt was shown
- `nxCloudArg`: Final value
- `nxCloudArgRaw`: Original CLI arg (empty if not provided)

This should be sufficient to analyze the change.
