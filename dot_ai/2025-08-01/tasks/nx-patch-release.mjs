#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PATCH_BRANCH = process.argv[2];
const WEBSITE_BRANCH_PATH = '../website-21';

if (!PATCH_BRANCH) {
  console.error('Usage: node nx-patch-release.mjs <patch-branch>');
  console.error('Example: node nx-patch-release.mjs 21.3.x');
  process.exit(1);
}

function runCommand(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', ...options }).trim();
  } catch (error) {
    if (options.allowFailure) {
      return null;
    }
    throw error;
  }
}

function log(message, type = 'info') {
  const prefix = {
    info: '📋',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  console.log(`${prefix[type]} ${message}`);
}

async function main() {
  const timestamp = new Date().toISOString();
  const failedCommits = [];
  const successfulCommits = [];

  // 1. Verify we're in the nx repo
  log('Verifying repository...');
  const remoteUrl = runCommand('git remote get-url origin');
  if (!remoteUrl.includes('nrwl/nx')) {
    log('This script must be run in the nx repository!', 'error');
    process.exit(1);
  }

  // 2. Check for uncommitted changes
  const gitStatus = runCommand('git status --porcelain');
  if (gitStatus) {
    log('There are uncommitted changes. Please commit or stash them first.', 'error');
    process.exit(1);
  }

  // 3. Verify current branch
  const currentBranch = runCommand('git branch --show-current');
  if (currentBranch !== PATCH_BRANCH) {
    log(`Not on ${PATCH_BRANCH} branch. Currently on: ${currentBranch}`, 'error');
    process.exit(1);
  }

  // 4. Fetch latest branches
  log('Fetching latest branches...');
  runCommand(`git fetch origin master`);
  runCommand(`git fetch origin ${PATCH_BRANCH}`);

  // 5. Reset to origin
  log(`Resetting ${PATCH_BRANCH} to origin...`);
  runCommand(`git reset --hard origin/${PATCH_BRANCH}`);

  // 6. Get last commit from patch branch
  log('Finding last synchronized commit...');
  const lastPatchCommit = runCommand('git log -1 --pretty=format:"%s"');
  fs.writeFileSync('/tmp/last-patch-commit.txt', lastPatchCommit);

  // 7. Find matching commit on master
  const lastMasterSha = runCommand(`git log origin/master --grep="${lastPatchCommit.replace(/"/g, '\\"')}" --pretty=format:"%H" -n 1`);
  if (!lastMasterSha) {
    log('Could not find matching commit on master branch!', 'error');
    process.exit(1);
  }
  fs.writeFileSync('/tmp/last-master-sha.txt', lastMasterSha);
  log(`Found matching commit: ${lastMasterSha.substring(0, 7)}`);

  // 8. Find commits to cherry-pick
  log('Finding commits to cherry-pick...');
  const commitsToPickRaw = runCommand(`git log ${lastMasterSha}..origin/master --pretty=format:"%H %s"`);
  const commitsToFilter = commitsToPickRaw.split('\n').filter(line => line);
  
  const commitsToCherry = commitsToFilter.filter(line => {
    const message = line.split(' ').slice(1).join(' ');
    return message.startsWith('fix(') || message.startsWith('docs(') || message.startsWith('feat(nx-dev)');
  });

  if (commitsToCherry.length === 0) {
    log('No commits to cherry-pick!', 'success');
  } else {
    log(`Found ${commitsToCherry.length} commits to cherry-pick`);
    
    // Reverse order to apply oldest first
    const orderedCommits = commitsToCherry.reverse();

    // 9. Cherry-pick commits
    for (const commitLine of orderedCommits) {
      const [sha, ...messageParts] = commitLine.split(' ');
      const message = messageParts.join(' ');
      
      log(`Cherry-picking: ${message}`);
      
      const result = runCommand(`git cherry-pick ${sha}`, { allowFailure: true });
      
      if (result === null) {
        log(`Failed to cherry-pick: ${message}`, 'error');
        failedCommits.push(commitLine);
        runCommand('git cherry-pick --abort', { allowFailure: true });
      } else {
        log(`Successfully cherry-picked: ${message}`, 'success');
        successfulCommits.push(commitLine);
      }
    }
  }

  // 10. Sanity check with website branch
  log('\nPerforming sanity check with website branch...');
  
  // Get docs commits from both branches
  const websiteDocsCommits = runCommand(`git -C ${WEBSITE_BRANCH_PATH} log --since="5 days ago" --pretty=format:"%s" | grep "^docs(" | sort`, { allowFailure: true });
  const patchDocsCommits = runCommand(`git log --since="5 days ago" --pretty=format:"%s" | grep "^docs(" | sort`);

  if (websiteDocsCommits) {
    fs.writeFileSync('/tmp/website-docs.txt', websiteDocsCommits);
    fs.writeFileSync('/tmp/patch-docs.txt', patchDocsCommits);
    
    // Find missing commits
    const missingInPatch = runCommand('comm -23 /tmp/website-docs.txt /tmp/patch-docs.txt', { allowFailure: true });
    
    if (missingInPatch && missingInPatch.trim()) {
      log('⚠️  Docs commits in website-21 but NOT in patch branch:', 'warning');
      console.log(missingInPatch);
    } else {
      log('All website docs commits are present in patch branch', 'success');
    }
  } else {
    log('Could not access website branch for sanity check', 'warning');
  }

  // 11. Generate report
  log('\n=== PATCH RELEASE SUMMARY ===\n');
  
  if (successfulCommits.length > 0) {
    log(`Successfully cherry-picked (${successfulCommits.length}):`, 'success');
    successfulCommits.forEach(commit => {
      const [sha, ...msg] = commit.split(' ');
      console.log(`  - ${sha.substring(0, 7)} ${msg.join(' ')}`);
    });
  }
  
  if (failedCommits.length > 0) {
    log(`\nFailed to cherry-pick (${failedCommits.length}):`, 'error');
    failedCommits.forEach(commit => {
      const [sha, ...msg] = commit.split(' ');
      console.log(`  - ${sha.substring(0, 7)} ${msg.join(' ')}`);
    });
    
    // Write failed commits to file
    const failedFile = `.ai/${new Date().toISOString().split('T')[0]}/tasks/failed-cherry-picks.txt`;
    fs.mkdirSync(path.dirname(failedFile), { recursive: true });
    fs.writeFileSync(failedFile, failedCommits.join('\n'));
    log(`\nFailed commits saved to: ${failedFile}`, 'info');
  }

  // Show current status
  log('\nCurrent branch status:');
  console.log(runCommand('git log --oneline -5'));
  
  log('\nPatch release process complete!', 'success');
  
  if (failedCommits.length > 0) {
    log('Please manually resolve the failed cherry-picks if needed.', 'warning');
  }
}

main().catch(error => {
  log(`Error: ${error.message}`, 'error');
  process.exit(1);
});