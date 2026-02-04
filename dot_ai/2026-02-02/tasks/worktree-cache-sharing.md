# Nx Worktree Cache Sharing Specification

## Overview

Enable Nx cache sharing between git worktrees of the same repository. Worktrees will use the main repository's `.nx/cache` instead of maintaining separate caches, reducing disk usage and improving cache hit rates for AI workflows with multiple agents.

## Background

### Git Worktree Behavior (Verified)

- Worktrees have a `.git` **file** (not directory) containing `gitdir: /path/to/main/.git/worktrees/{name}`
- The main repo has the actual `.git` **directory**
- Deleting the main repo breaks all worktrees: `fatal: not a git repository: /path/to/main/.git/worktrees/{name}`
- All worktrees share the same `.git/worktrees/` structure in the main repo

### Problem

Currently, each worktree maintains its own `.nx/cache`, leading to:

- Duplicated cache entries across worktrees
- Missed cache hits when identical work is done in different worktrees
- Increased disk usage
- Friction in AI workflows where multiple agents work in isolated worktrees

## Design

### Core Concept

Worktrees do not have their own `.nx/cache`. Instead, they use the main repository's `.nx/cache` directly—similar to how git worktrees share the main `.git` directory.

### Directory Structure

**Main repo:**

```
/projects/nx/
├── .git/                    ← actual git directory
├── .nx/
│   ├── cache/              ← shared cache (all worktrees use this)
│   │   ├── {hash}/         ← cache entry files
│   │   └── d/              ← cache database (SQLite)
│   └── workspace-data/     ← main repo's daemon state
│       ├── d/              ← task details database
│       └── ...
```

**Worktree:**

```
/projects/nx-worktrees/feature-branch/
├── .git                     ← file pointing to main repo
├── .nx/
│   └── workspace-data/     ← worktree's own daemon state (NOT shared)
│       ├── d/              ← task details database
│       └── ...
├── (NO .nx/cache/)         ← uses main repo's cache
```

**Key insight**: `workspace-data` MUST remain per-workspace because:
1. The daemon tracks output hashes in memory (`recordedHashes` map)
2. Sharing daemon state causes incorrect "outputs already exist" detection
3. Each worktree runs its own daemon process

### Worktree Detection

Check if `.git` is a file (worktree) or directory (main repo):

```javascript
const isWorktree = fs.statSync(".git").isFile();
```

### Cache Path Resolution

When in a worktree:

1. Run `git rev-parse --git-common-dir` → returns `/path/to/main/.git`
2. Strip `/.git` suffix → `/path/to/main`
3. Append `/.nx/cache` → `/path/to/main/.nx/cache`

```javascript
function getSharedCachePath() {
  const gitCommonDir = execSync("git rev-parse --git-common-dir")
    .toString()
    .trim();
  const mainRepoRoot = gitCommonDir.replace(/\/.git$/, "");
  return path.join(mainRepoRoot, ".nx", "cache");
}
```

### Atomic Writes (Universal)

To handle concurrent access from multiple worktrees/agents, implement atomic writes for ALL cache operations (not just worktrees):

1. Write cache entry to `{hash}.tmp`
2. When complete, atomically rename to `{hash}`
3. Readers only look for `{hash}` (ignore `.tmp` files)

```javascript
async function writeCache(hash, data) {
  const tmpPath = `${cachePath}/${hash}.tmp`;
  const finalPath = `${cachePath}/${hash}`;

  await fs.writeFile(tmpPath, data);
  await fs.rename(tmpPath, finalPath); // atomic on same filesystem
}
```

**Benefits:** This also solves concurrent access issues for multiple agents on the same repo, regardless of worktrees.

### Stale `.tmp` Cleanup

Orphaned `.tmp` files can occur if a process crashes mid-write.

**Cleanup triggers:**

1. **On Nx startup** - Delete `.tmp` files older than 1 hour
2. **Via Nx daemon** - Periodic cleanup task

```javascript
function cleanupStaleTmpFiles(cacheDir, maxAgeMs = 60 * 60 * 1000) {
  const tmpFiles = glob.sync(`${cacheDir}/*.tmp`);
  const now = Date.now();

  for (const file of tmpFiles) {
    const stat = fs.statSync(file);
    if (now - stat.mtimeMs > maxAgeMs) {
      fs.unlinkSync(file);
    }
  }
}
```

### Skip Conditions

| Condition                   | Behavior                                                       |
| --------------------------- | -------------------------------------------------------------- |
| `CI` env var is set         | Skip silently (Cloud Agents can't access local worktree cache) |
| `NX_CACHE_DIRECTORY` is set | Warn and skip (custom cache dir, likely CI)                    |
| Git version < 2.5           | Warn and skip (no worktree support)                            |

**Warning messages:**

- `NX_CACHE_DIRECTORY`: "Worktree cache sharing disabled: NX_CACHE_DIRECTORY is set. Worktrees will use independent caches."
- Old git: "Worktree cache sharing disabled: Git version X.X does not support worktrees (requires 2.5+)."

### Error Handling

If main repo's `.nx/cache` is inaccessible (moved, deleted, permissions), fail with clear error:

```
Error: Cannot access shared cache at /path/to/main/.nx/cache
The main repository may have been moved or deleted.
Worktree path: /path/to/worktree
Expected main repo: /path/to/main
```

Do not fallback to local cache—fail fast like git does.

### Cache Size

Use existing `maxCacheSize` setting. No new configuration needed.

### Remote Cache

No changes required. Remote cache (Nx Cloud) continues to work as before—it just reads/writes from the resolved cache path.

```
local cache (main repo's .nx/cache) → remote cache (Nx Cloud)
```

## Configuration

**None required.** This feature works automatically with zero configuration:

- Automatically detects worktrees
- Automatically resolves main repo's cache
- Automatically handles concurrent access

**No opt-out mechanism.** If isolated cache is needed, simply don't use worktrees.

## Testing Plan

### Unit Tests

1. **Worktree detection**

   - Correctly identifies `.git` file vs directory
   - Returns correct boolean for worktree vs main repo

2. **Cache path resolution**

   - Correctly parses `git rev-parse --git-common-dir` output
   - Correctly strips `/.git` and appends `/.nx/cache`
   - Handles paths with spaces, special characters

3. **Skip condition detection**
   - Detects `CI` env var
   - Detects `NX_CACHE_DIRECTORY` env var
   - Detects old git versions

### Integration Tests

4. **Atomic writes**

   - `.tmp` file created during write
   - Renamed to final path on completion
   - Partial writes don't corrupt cache

5. **Concurrent access**

   - Multiple processes writing same hash simultaneously
   - Multiple processes reading while another writes
   - No corrupted reads

6. **Cleanup**
   - Stale `.tmp` files cleaned on startup
   - Daemon cleans `.tmp` files periodically
   - Recent `.tmp` files preserved

### E2E Tests

7. **Full worktree workflow**

   - Create worktree
   - Run build in worktree
   - Verify cache written to main repo's `.nx/cache`
   - Run same build in another worktree
   - Verify cache hit

8. **Error scenarios**
   - Main repo deleted → clear error message
   - Main repo's cache not writable → clear error message

## Implementation Notes

### Files Modified

| File | Changes |
|------|---------|
| `packages/nx/src/utils/cache-directory.ts` | Worktree detection, cache path resolution |
| `packages/nx/src/tasks-runner/cache.ts` | DB connection moved to cache directory |
| `packages/nx/src/utils/cache-directory.spec.ts` | Unit tests (11 tests) |

### Key Functions Added

- `isGitWorktree(root)` - Check if `.git` is a file (worktree) or directory (main repo)
- `getMainRepoRoot(worktreeRoot)` - Get main repo path via `git rev-parse --git-common-dir`
- `shouldSkipWorktreeCacheSharing()` - Skip conditions (CI, env var, old git)
- `resolveWorktreeMainRoot(root)` - Combined logic for resolving shared cache path

### Git Commands Used

```bash
# Check if in worktree (alternative to file check)
git rev-parse --git-dir        # returns .git or path to worktree's git dir
git rev-parse --git-common-dir # returns main repo's .git path

# Get git version
git --version
```

### Considerations

- Windows compatibility: `fs.rename()` is atomic on Windows when source and dest are on same filesystem
- Network drives: If main repo is on network storage, atomic rename may not be supported—document this limitation
- Daemon socket: Each worktree should have its own daemon (already handled by `.nx/daemon/` being separate)

## Implementation Findings

### Discovery 1: Cache Uses SQLite Database

The original spec assumed file-based cache. In reality:

- **Cache files**: Stored in `cacheDir` (e.g., `.nx/cache/{hash}/...`)
- **Cache database**: SQLite tracking cache entries with `cache_outputs` table
- **Database location**: Originally in `workspaceDataDirectory` (separate from cache files)

**Impact**: Sharing only the cache files directory wasn't enough—cache "misses" occurred because the database wasn't shared.

### Discovery 2: Two Separate Directories

| Directory | Purpose | Default Location |
|-----------|---------|------------------|
| `cacheDir` | Cache files | `.nx/cache` |
| `workspaceDataDirectory` | Daemon state, task details, **cache DB** | `.nx/workspace-data` |

The cache DB was in `workspace-data`, not `cache`. This caused cache misses even when files were shared.

### Discovery 3: Daemon Output Hash Tracking

The Nx daemon tracks output hashes in memory via `recordedHashes` map in `outputs-tracking.ts`:

```typescript
// packages/nx/src/daemon/server/outputs-tracking.ts
const recordedHashes = new Map<string, string>();

export function outputsHashesMatch(taskId, hash) {
  return recordedHashes.get(taskId) === hash;
}
```

**Problem**: If daemon state is shared, one worktree's daemon incorrectly reports that outputs exist in another worktree.

### What Didn't Work

#### Attempt 1: Share Only Cache Directory ❌

**Change**: Modified `cacheDirectory()` to return main repo's cache for worktrees.

**Result**: Cache files were written to shared location, but cache "misses" occurred because database wasn't shared.

**Root cause**: `DbCache.get()` queries the SQLite database, not the filesystem. Each workspace had its own database.

#### Attempt 2: Share workspace-data Directory ❌

**Change**: Modified `workspaceDataDirectoryForWorkspace()` to also use main repo for worktrees.

**Result**: Cache hits occurred, but outputs weren't being copied back to the worktree.

**Root cause**: Shared daemon's `recordedHashes` map incorrectly reported outputs existed when they didn't in the worktree. The `shouldCopyOutputsFromCache()` function returned `false`, skipping output restoration.

**Symptoms**:
- Status showed `local-cache-kept-existing` instead of `local-cache`
- Outputs were stale (from previous build, not cache)

#### Attempt 3: Move Cache DB to Cache Directory ❌ (partially)

**Change**: Modified `DbCache` to use `getDbConnection({ directory: cacheDir })`.

**Result**: FK constraint error on cache write.

**Root cause**: `cache_outputs` table has a foreign key to `task_details` table, but `task_details` remained in the workspace-data database (different DB file).

```
FOREIGN KEY constraint failed
INSERT OR REPLACE INTO cache_outputs (hash, code, size) VALUES (...)
```

### Final Solution ✅

**Changes**:
1. Cache directory (`cacheDir`) → Main repo's `.nx/cache` for worktrees
2. Workspace-data directory → Local per-workspace (daemon state isolated)
3. Cache DB → Moved to cache directory (shared)
4. `linkTaskDetails=false` → Disable FK constraint to task_details

**Architecture**:
```
Main Repo (.nx/)
├── cache/           ← SHARED between worktrees
│   ├── {hash}/      ← Cache files
│   └── d/           ← Cache database
└── workspace-data/  ← Main repo's daemon state

Worktree (.nx/)
└── workspace-data/  ← Worktree's daemon state (NOT shared)
```

**Why this works**:
- Cache files and database are co-located and shared
- Each worktree has its own daemon with independent output tracking
- Disabling `linkTaskDetails` allows cache_outputs table to exist in isolation

## Summary

| Aspect                    | Decision                               |
| ------------------------- | -------------------------------------- |
| Cache files location      | Main repo's `.nx/cache`                |
| Cache database location   | Main repo's `.nx/cache/d/`             |
| Workspace-data location   | Local per-worktree (NOT shared)        |
| Worktree detection        | Check if `.git` is file                |
| Path resolution           | `git rev-parse --git-common-dir`       |
| Concurrent access         | Atomic writes with `.tmp` pattern      |
| Cleanup                   | On startup + daemon (1 hour threshold) |
| Skip: CI                  | Silent                                 |
| Skip: NX_CACHE_DIRECTORY  | Silent                                 |
| Skip: Old git             | Warn (if NX_VERBOSE_LOGGING)           |
| Error: Inaccessible cache | Fail with clear message                |
| Configuration             | None (zero-config)                     |
| Opt-out                   | None                                   |

## Implementation Status

| Task | Status |
|------|--------|
| Worktree detection (`isGitWorktree`) | ✅ Complete |
| Main repo resolution (`getMainRepoRoot`) | ✅ Complete |
| Cache directory resolution | ✅ Complete |
| Workspace-data kept local | ✅ Complete |
| Cache DB moved to cache dir | ✅ Complete |
| FK constraint fix | ✅ Complete |
| Unit tests | ✅ Complete (11 tests) |
| E2E testing | 🔄 In Progress |
| Atomic writes | ⏳ Future (handled by native Rust code) |
| Stale .tmp cleanup | ⏳ Future |
