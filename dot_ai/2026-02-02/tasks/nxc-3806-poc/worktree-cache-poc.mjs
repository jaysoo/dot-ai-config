#!/usr/bin/env node
/**
 * PoC: Nx Worktree Cache Sharing
 *
 * This script demonstrates how to detect git worktrees and resolve
 * the shared cache path from the main repository.
 *
 * Usage:
 *   node worktree-cache-poc.mjs [path]
 *
 * If path is not provided, uses current directory.
 */

import { execSync } from 'child_process';
import { statSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

// Skip conditions
const SKIP_CONDITIONS = {
  CI: !!process.env.CI,
  NX_CACHE_DIRECTORY: !!process.env.NX_CACHE_DIRECTORY,
};

/**
 * Check if .git is a file (worktree) or directory (main repo)
 */
function isWorktree(repoPath) {
  const gitPath = join(repoPath, '.git');

  if (!existsSync(gitPath)) {
    return { isWorktree: false, error: 'Not a git repository' };
  }

  try {
    const stat = statSync(gitPath);
    return { isWorktree: stat.isFile(), error: null };
  } catch (e) {
    return { isWorktree: false, error: e.message };
  }
}

/**
 * Parse the .git file to extract gitdir path
 */
function parseGitFile(repoPath) {
  const gitPath = join(repoPath, '.git');
  const content = readFileSync(gitPath, 'utf-8').trim();

  // Format: gitdir: /path/to/main/.git/worktrees/{name}
  const match = content.match(/^gitdir:\s*(.+)$/);
  if (!match) {
    throw new Error(`Invalid .git file format: ${content}`);
  }

  return match[1];
}

/**
 * Get the main repository's .git directory using git command
 */
function getGitCommonDir(repoPath) {
  try {
    const result = execSync('git rev-parse --git-common-dir', {
      cwd: repoPath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    // Result might be relative, make it absolute
    if (result.startsWith('/')) {
      return result;
    }
    return join(repoPath, result);
  } catch (e) {
    throw new Error(`Failed to get git common dir: ${e.message}`);
  }
}

/**
 * Get git version to check for worktree support (requires 2.5+)
 */
function getGitVersion() {
  try {
    const output = execSync('git --version', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    // Format: git version 2.39.2
    const match = output.match(/git version (\d+)\.(\d+)/);
    if (!match) {
      return null;
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      full: output,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Check if git version supports worktrees (2.5+)
 */
function gitSupportsWorktrees() {
  const version = getGitVersion();
  if (!version) return false;

  return version.major > 2 || (version.major === 2 && version.minor >= 5);
}

/**
 * Resolve the shared cache path for a worktree
 */
function resolveSharedCachePath(repoPath) {
  const gitCommonDir = getGitCommonDir(repoPath);

  // git-common-dir returns the .git directory of the main repo
  // Strip /.git suffix to get the main repo root
  const mainRepoRoot = gitCommonDir.replace(/[/\\]\.git\/?$/, '');

  // Return the cache path
  return join(mainRepoRoot, '.nx', 'cache');
}

/**
 * Main analysis function
 */
function analyzeRepository(repoPath) {
  const result = {
    path: repoPath,
    skipConditions: SKIP_CONDITIONS,
    gitVersion: getGitVersion(),
    gitSupportsWorktrees: gitSupportsWorktrees(),
    isWorktree: null,
    worktreeInfo: null,
    sharedCachePath: null,
    localCachePath: join(repoPath, '.nx', 'cache'),
    recommendation: null,
    errors: [],
  };

  // Check skip conditions
  if (SKIP_CONDITIONS.CI) {
    result.recommendation = 'SKIP (CI environment detected)';
    return result;
  }

  if (SKIP_CONDITIONS.NX_CACHE_DIRECTORY) {
    result.recommendation = 'SKIP (NX_CACHE_DIRECTORY is set)';
    return result;
  }

  if (!result.gitSupportsWorktrees) {
    result.errors.push(`Git version ${result.gitVersion?.full || 'unknown'} does not support worktrees (requires 2.5+)`);
    result.recommendation = 'SKIP (old git version)';
    return result;
  }

  // Check if worktree
  const worktreeCheck = isWorktree(repoPath);
  result.isWorktree = worktreeCheck.isWorktree;

  if (worktreeCheck.error) {
    result.errors.push(worktreeCheck.error);
    result.recommendation = 'USE_LOCAL (not a git repository)';
    return result;
  }

  if (!result.isWorktree) {
    result.recommendation = 'USE_LOCAL (main repository)';
    return result;
  }

  // It's a worktree - resolve shared cache path
  try {
    const gitFile = parseGitFile(repoPath);
    const gitCommonDir = getGitCommonDir(repoPath);

    result.worktreeInfo = {
      gitFile: gitFile,
      gitCommonDir: gitCommonDir,
      mainRepoRoot: gitCommonDir.replace(/[/\\]\.git\/?$/, ''),
    };

    result.sharedCachePath = resolveSharedCachePath(repoPath);

    // Check if shared cache is accessible
    const sharedCacheDir = dirname(result.sharedCachePath);
    if (existsSync(sharedCacheDir)) {
      result.recommendation = 'USE_SHARED (worktree detected, shared cache accessible)';
    } else {
      result.recommendation = 'USE_SHARED (worktree detected, shared cache dir will be created)';
    }
  } catch (e) {
    result.errors.push(e.message);
    result.recommendation = 'USE_LOCAL (failed to resolve shared cache)';
  }

  return result;
}

/**
 * Format the result as a report
 */
function formatReport(result) {
  const lines = [];

  lines.push('='.repeat(60));
  lines.push('Nx Worktree Cache Sharing - PoC Analysis');
  lines.push('='.repeat(60));
  lines.push('');

  lines.push(`Repository Path: ${result.path}`);
  lines.push(`Git Version: ${result.gitVersion?.full || 'unknown'}`);
  lines.push(`Git Supports Worktrees: ${result.gitSupportsWorktrees}`);
  lines.push('');

  lines.push('Skip Conditions:');
  lines.push(`  CI env var: ${result.skipConditions.CI}`);
  lines.push(`  NX_CACHE_DIRECTORY: ${result.skipConditions.NX_CACHE_DIRECTORY}`);
  lines.push('');

  lines.push(`Is Worktree: ${result.isWorktree}`);
  lines.push('');

  if (result.worktreeInfo) {
    lines.push('Worktree Info:');
    lines.push(`  .git file content: ${result.worktreeInfo.gitFile}`);
    lines.push(`  Git Common Dir: ${result.worktreeInfo.gitCommonDir}`);
    lines.push(`  Main Repo Root: ${result.worktreeInfo.mainRepoRoot}`);
    lines.push('');
  }

  lines.push('Cache Paths:');
  lines.push(`  Local Cache: ${result.localCachePath}`);
  if (result.sharedCachePath) {
    lines.push(`  Shared Cache: ${result.sharedCachePath}`);
  }
  lines.push('');

  if (result.errors.length > 0) {
    lines.push('Errors:');
    for (const error of result.errors) {
      lines.push(`  - ${error}`);
    }
    lines.push('');
  }

  lines.push('-'.repeat(60));
  lines.push(`RECOMMENDATION: ${result.recommendation}`);
  lines.push('-'.repeat(60));

  return lines.join('\n');
}

// Main execution
const targetPath = process.argv[2] || process.cwd();
const absolutePath = targetPath.startsWith('/') ? targetPath : join(process.cwd(), targetPath);

console.log(formatReport(analyzeRepository(absolutePath)));
