/**
 * PoC: Modified cache-directory.ts with worktree support
 *
 * This file shows the proposed changes to support shared cache in worktrees.
 * The key changes are:
 * 1. Add worktree detection
 * 2. Resolve main repo's cache path for worktrees
 * 3. Add skip conditions (CI, NX_CACHE_DIRECTORY, old git)
 */

import { existsSync, statSync, readFileSync } from 'fs';
import { isAbsolute, join } from 'path';
import { execSync } from 'child_process';
import { NxJsonConfiguration } from '../config/nx-json';
import { readJsonFile } from './fileutils';
import { workspaceRoot } from './workspace-root';

// ============================================================
// NEW: Worktree detection and resolution functions
// ============================================================

/**
 * Check if .git is a file (worktree) or directory (main repo)
 */
function isGitWorktree(root: string): boolean {
  const gitPath = join(root, '.git');

  if (!existsSync(gitPath)) {
    return false;
  }

  try {
    return statSync(gitPath).isFile();
  } catch {
    return false;
  }
}

/**
 * Get git version to check for worktree support (requires 2.5+)
 */
function gitSupportsWorktrees(): boolean {
  try {
    const output = execSync('git --version', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    const match = output.match(/git version (\d+)\.(\d+)/);
    if (!match) {
      return false;
    }

    const major = parseInt(match[1], 10);
    const minor = parseInt(match[2], 10);
    return major > 2 || (major === 2 && minor >= 5);
  } catch {
    return false;
  }
}

/**
 * Get the main repository root from a worktree
 */
function getMainRepoRoot(worktreeRoot: string): string | null {
  try {
    const gitCommonDir = execSync('git rev-parse --git-common-dir', {
      cwd: worktreeRoot,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    // Make absolute if needed
    const absoluteGitDir = gitCommonDir.startsWith('/')
      ? gitCommonDir
      : join(worktreeRoot, gitCommonDir);

    // Strip /.git suffix to get main repo root
    return absoluteGitDir.replace(/[/\\]\.git\/?$/, '');
  } catch {
    return null;
  }
}

/**
 * Check skip conditions for worktree cache sharing
 */
function shouldSkipWorktreeCacheSharing(): {
  skip: boolean;
  reason?: string;
  warn?: boolean;
} {
  // Skip silently in CI (Cloud Agents can't access local worktree cache)
  if (process.env.CI) {
    return { skip: true, reason: 'CI environment' };
  }

  // Skip with warning if custom cache directory is set
  if (process.env.NX_CACHE_DIRECTORY) {
    return {
      skip: true,
      reason: 'NX_CACHE_DIRECTORY is set',
      warn: true,
    };
  }

  // Skip with warning if git is too old
  if (!gitSupportsWorktrees()) {
    return {
      skip: true,
      reason: 'Git version does not support worktrees (requires 2.5+)',
      warn: true,
    };
  }

  return { skip: false };
}

/**
 * Resolve cache directory, potentially using shared cache for worktrees
 */
function resolveWorktreeCachePath(
  root: string,
  defaultPath: string
): string | null {
  const skipCheck = shouldSkipWorktreeCacheSharing();
  if (skipCheck.skip) {
    if (skipCheck.warn) {
      console.warn(
        `Worktree cache sharing disabled: ${skipCheck.reason}. Worktrees will use independent caches.`
      );
    }
    return null;
  }

  if (!isGitWorktree(root)) {
    return null; // Not a worktree, use normal cache
  }

  const mainRepoRoot = getMainRepoRoot(root);
  if (!mainRepoRoot) {
    console.error(
      `Error: Failed to resolve main repository for worktree at ${root}`
    );
    return null;
  }

  // Check if main repo's .nx directory exists or can be created
  const mainNxDir = join(mainRepoRoot, '.nx');
  const sharedCachePath = join(mainRepoRoot, '.nx', 'cache');

  // Verify main repo still exists
  if (!existsSync(mainRepoRoot)) {
    throw new Error(
      `Cannot access shared cache at ${sharedCachePath}\n` +
        `The main repository may have been moved or deleted.\n` +
        `Worktree path: ${root}\n` +
        `Expected main repo: ${mainRepoRoot}`
    );
  }

  return sharedCachePath;
}

// ============================================================
// EXISTING: Original functions with modifications
// ============================================================

function readCacheDirectoryProperty(root: string): string | undefined {
  try {
    const nxJson = readJsonFile<NxJsonConfiguration>(join(root, 'nx.json'));
    return (
      nxJson.cacheDirectory ??
      nxJson.tasksRunnerOptions?.default.options.cacheDirectory
    );
  } catch {
    return undefined;
  }
}

function absolutePath(root: string, path: string): string {
  if (isAbsolute(path)) {
    return path;
  } else {
    return join(root, path);
  }
}

function cacheDirectory(root: string, cacheDirectory: string) {
  // EXISTING: Environment variable takes precedence
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

function pickCacheDirectory(
  root: string,
  nonNxCacheDirectory: string,
  nxCacheDirectory: string
) {
  if (
    existsSync(join(root, 'lerna.json')) &&
    !existsSync(join(root, 'nx.json'))
  ) {
    return join(root, 'node_modules', '.cache', nonNxCacheDirectory);
  }
  return join(root, '.nx', nxCacheDirectory);
}

function defaultCacheDirectory(root: string) {
  return pickCacheDirectory(root, 'nx', 'cache');
}

function defaultWorkspaceDataDirectory(root: string) {
  return pickCacheDirectory(root, 'nx-workspace-data', 'workspace-data');
}

/**
 * Path to the directory where Nx stores its cache and daemon-related files.
 */
export const cacheDir = cacheDirectory(
  workspaceRoot,
  readCacheDirectoryProperty(workspaceRoot)
);

export function cacheDirectoryForWorkspace(workspaceRoot: string) {
  return cacheDirectory(
    workspaceRoot,
    readCacheDirectoryProperty(workspaceRoot)
  );
}

export const workspaceDataDirectory =
  workspaceDataDirectoryForWorkspace(workspaceRoot);

export function workspaceDataDirectoryForWorkspace(workspaceRoot: string) {
  return absolutePath(
    workspaceRoot,
    process.env.NX_WORKSPACE_DATA_DIRECTORY ??
      process.env.NX_PROJECT_GRAPH_CACHE_DIRECTORY ??
      defaultWorkspaceDataDirectory(workspaceRoot)
  );
}

// ============================================================
// NEW: Export helper functions for testing
// ============================================================

export {
  isGitWorktree,
  gitSupportsWorktrees,
  getMainRepoRoot,
  shouldSkipWorktreeCacheSharing,
  resolveWorktreeCachePath,
};
