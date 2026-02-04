# NXC-3806: Nx Worktree Cache Sharing PoC

## Overview

This PoC demonstrates the feasibility of sharing Nx cache between git worktrees.

## Files Created

1. **`worktree-cache-poc.mjs`** - Standalone detection script
2. **`cache-directory-with-worktree.ts`** - Modified cache-directory.ts with worktree support

## Test Results

### Worktree Detection (PASSED)

```
Repository Path: /Users/jack/projects/nx-worktrees/NXC-3806
Is Worktree: true
Main Repo Root: /Users/jack/projects/nx
Shared Cache: /Users/jack/projects/nx/.nx/cache
```

### Main Repo Detection (PASSED)

```
Repository Path: /Users/jack/projects/nx
Is Worktree: false
Local Cache: /Users/jack/projects/nx/.nx/cache
```

## Key Implementation Points

### 1. Worktree Detection

```javascript
function isGitWorktree(root) {
  const gitPath = join(root, '.git');
  return existsSync(gitPath) && statSync(gitPath).isFile();
}
```

### 2. Main Repo Resolution

```javascript
function getMainRepoRoot(worktreeRoot) {
  const gitCommonDir = execSync('git rev-parse --git-common-dir', { cwd: worktreeRoot }).trim();
  return gitCommonDir.replace(/[/\\]\.git\/?$/, '');
}
```

### 3. Skip Conditions

| Condition | Behavior |
|-----------|----------|
| `CI` env var set | Skip silently |
| `NX_CACHE_DIRECTORY` set | Warn and skip |
| Git < 2.5 | Warn and skip |

## Integration Point

The change should be made in `packages/nx/src/utils/cache-directory.ts`:

```typescript
function cacheDirectory(root: string, cacheDirectory: string) {
  const cacheDirFromEnv = process.env.NX_CACHE_DIRECTORY;
  if (cacheDirFromEnv) {
    cacheDirectory = cacheDirFromEnv;
  }

  if (cacheDirectory) {
    return absolutePath(root, cacheDirectory);
  }

  // NEW: Check for worktree and resolve shared cache
  const defaultPath = defaultCacheDirectory(root);
  const worktreeCachePath = resolveWorktreeCachePath(root, defaultPath);

  if (worktreeCachePath) {
    return worktreeCachePath;
  }

  return defaultPath;
}
```

## Next Steps

1. Implement atomic writes (`.tmp` pattern) in cache writing logic
2. Add stale `.tmp` cleanup on startup and via daemon
3. Add error handling for inaccessible main repo cache
4. Write unit and integration tests
5. Update documentation

## Verification Commands

```bash
# Run the PoC on any directory
node worktree-cache-poc.mjs /path/to/repo

# Expected output for worktrees:
# RECOMMENDATION: USE_SHARED (worktree detected, shared cache accessible)

# Expected output for main repos:
# RECOMMENDATION: USE_LOCAL (main repository)
```
