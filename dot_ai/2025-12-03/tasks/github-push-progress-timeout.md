# GitHub Push Progress Indicator and Timeout

## Goal
Add visual feedback when pushing to GitHub and implement a 10-second timeout to prevent hanging if the gh CLI doesn't respond.

## Current Behavior
- `pushToGitHub` in `packages/create-nx-workspace/src/utils/git/git.ts` calls `gh repo create` without visual feedback
- User sees no progress indication during repo creation
- If `gh` hangs, the process waits indefinitely

## Proposed Changes

### 1. Add ora spinner for progress feedback

**File**: `packages/create-nx-workspace/src/utils/git/git.ts`

```typescript
import ora from 'ora';

// In pushToGitHub function, before the gh repo create call:
const spinner = ora('Creating GitHub repository...').start();
try {
  await spawnAndWait(
    `gh repo create ${repoName} --private --source=. --remote=origin --push`,
    directory
  );
  spinner.succeed('Repository created and pushed to GitHub');
} catch (e) {
  spinner.fail('Failed to push to GitHub');
  throw e;
}
```

### 2. Add 10-second timeout wrapper

**Option A**: Wrap the spawn call with Promise.race

```typescript
const GITHUB_PUSH_TIMEOUT_MS = 10_000; // 10 seconds

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

// Usage:
await withTimeout(
  spawnAndWait(`gh repo create ...`, directory),
  GITHUB_PUSH_TIMEOUT_MS,
  'GitHub push timed out after 10 seconds'
);
```

**Option B**: Use AbortController (if spawnAndWait supports it)

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), GITHUB_PUSH_TIMEOUT_MS);

try {
  await spawnAndWait(`gh repo create ...`, directory, { signal: controller.signal });
} finally {
  clearTimeout(timeoutId);
}
```

### 3. Handle timeout gracefully

When timeout occurs:
- Stop the spinner with a warning message
- Don't throw an error that stops workspace creation
- Show user-friendly message: "Push timed out. You can push manually later with: git push -u origin main"

### 4. Update error handling

```typescript
} catch (e) {
  spinner.stop();

  const isTimeout = e instanceof Error && e.message.includes('timed out');
  const errorMessage = e instanceof Error ? e.message : String(e);

  if (isTimeout) {
    output.note({
      title: 'GitHub push timed out',
      bodyLines: [
        'The push is taking longer than expected.',
        'You can push manually later with:',
        '  git push -u origin main',
      ],
    });
    return { pushedToVcs: VcsPushStatus.FailedToPushToVcs };
  }

  // ... existing error handling
}
```

## Files to Modify

1. `packages/create-nx-workspace/src/utils/git/git.ts`
   - Add ora import (already used elsewhere in codebase)
   - Add timeout helper function
   - Wrap gh repo create call with spinner and timeout

## Testing

1. Test normal flow - should show spinner and succeed
2. Test with slow network - should timeout after 10 seconds
3. Test with gh not installed - should handle error gracefully
4. Test with auth failure - should show appropriate error message

## Dependencies

- `ora` - already used in the codebase for spinners

## Notes

- 10 seconds may be too short for large repos or slow connections
- Consider making timeout configurable via environment variable: `NX_GITHUB_PUSH_TIMEOUT`
- The timeout should only apply to the initial repo creation, not the entire push operation
