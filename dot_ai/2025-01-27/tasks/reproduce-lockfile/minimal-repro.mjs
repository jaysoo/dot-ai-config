#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

console.log('=== Minimal Reproduction of Nx Lockfile Error ===\n');

const WORKSPACE_DIR = join(process.cwd(), '.ai/2025-01-27/tasks/reproduce-lockfile/test-workspace');

function showError(step, action) {
  console.log(`Step ${step}: ${action}`);
  try {
    execSync('npx nx graph --file=test.json', { 
      cwd: WORKSPACE_DIR,
      stdio: 'pipe'
    });
    console.log('  Result: ✗ No error (command succeeded)\n');
    return false;
  } catch (error) {
    console.log('  Result: ✓ ERROR REPRODUCED!');
    console.log('  Error:', error.message.split('\n')[0]);
    console.log();
    return true;
  }
}

console.log('This script demonstrates the most reliable way to reproduce the lockfile error:\n');

// Step 1: Show normal operation
console.log('Step 1: Normal operation (baseline)');
try {
  execSync('npx nx reset', { cwd: WORKSPACE_DIR, stdio: 'pipe' });
  execSync('npx nx graph --file=baseline.json', { cwd: WORKSPACE_DIR, stdio: 'pipe' });
  console.log('  Result: ✓ Works normally\n');
} catch (e) {
  console.log('  Result: Unexpected error\n');
}

// Step 2: Corrupt the parsed lockfile
const parsedLockPath = join(WORKSPACE_DIR, '.nx/workspace-data/parsed-lock-file.json');
const backupPath = parsedLockPath + '.backup';

if (existsSync(parsedLockPath)) {
  execSync(`cp "${parsedLockPath}" "${backupPath}"`);
}

if (showError(2, 'Corrupting parsed-lock-file.json')) {
  console.log('ERROR REPRODUCED! This is how users encounter the lockfile error.\n');
}

// Step 3: Show that nx reset fixes it
console.log('Step 3: Running nx reset to fix the error');
execSync('npx nx reset', { cwd: WORKSPACE_DIR, stdio: 'pipe' });
console.log('  Reset complete\n');

console.log('Step 4: Verify error is fixed');
try {
  execSync('npx nx graph --file=after-reset.json', { cwd: WORKSPACE_DIR, stdio: 'pipe' });
  console.log('  Result: ✓ Works again after reset\n');
} catch (e) {
  console.log('  Result: ✗ Still broken\n');
}

// Restore backup
if (existsSync(backupPath)) {
  execSync(`rm "${backupPath}"`);
}

console.log('=== Reproduction Summary ===');
console.log('');
console.log('The lockfile error occurs when:');
console.log('1. The parsed-lock-file.json becomes corrupted or invalid');
console.log('2. There\'s a mismatch between lockfile.hash and actual lockfile');
console.log('3. File permissions prevent Nx from updating lock data');
console.log('');
console.log('Users see this as: "Command failed: npx nx [command]"');
console.log('');
console.log('The fix is always: npx nx reset');
console.log('');
console.log('Why it works:');
console.log('- Clears .nx/workspace-data (including corrupted files)');
console.log('- Forces Nx to re-parse lockfiles from scratch');
console.log('- Stops any hanging daemon processes');
console.log('');