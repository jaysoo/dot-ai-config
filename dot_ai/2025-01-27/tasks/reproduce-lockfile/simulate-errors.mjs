#!/usr/bin/env node

import { execSync, exec } from 'child_process';
import { writeFileSync, readFileSync, chmodSync, existsSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
const WORKSPACE_DIR = join(process.cwd(), '.ai/2025-01-27/tasks/reproduce-lockfile/test-workspace');

console.log('=== Simulating Lockfile Error Scenarios ===\n');

// Helper to run command and capture error
async function runNxCommand(command, expectError = false) {
  try {
    const result = await execAsync(command, { cwd: WORKSPACE_DIR });
    if (expectError) {
      console.log('  ✗ Command succeeded (expected error)');
      return { success: true, output: result.stdout, error: null };
    }
    console.log('  ✓ Command succeeded');
    return { success: true, output: result.stdout, error: null };
  } catch (error) {
    if (!expectError) {
      console.log('  ✗ Command failed with error:', error.message.split('\n')[0]);
    } else {
      console.log('  ✓ Command failed as expected');
    }
    return { success: false, output: error.stdout, error: error.stderr || error.message };
  }
}

// Backup original files
function backupFiles() {
  const files = [
    '.nx/workspace-data/lockfile.hash',
    '.nx/workspace-data/parsed-lock-file.json',
    '.nx/workspace-data/d/server-process.json'
  ];
  
  files.forEach(file => {
    const fullPath = join(WORKSPACE_DIR, file);
    if (existsSync(fullPath)) {
      const backupPath = fullPath + '.backup';
      execSync(`cp "${fullPath}" "${backupPath}"`);
    }
  });
}

// Restore files
function restoreFiles() {
  const files = [
    '.nx/workspace-data/lockfile.hash',
    '.nx/workspace-data/parsed-lock-file.json',
    '.nx/workspace-data/d/server-process.json'
  ];
  
  files.forEach(file => {
    const fullPath = join(WORKSPACE_DIR, file);
    const backupPath = fullPath + '.backup';
    if (existsSync(backupPath)) {
      execSync(`cp "${backupPath}" "${fullPath}"`);
      rmSync(backupPath);
    }
  });
}

// Test scenarios
async function testScenarios() {
  console.log(`Working in: ${WORKSPACE_DIR}\n`);
  
  // Backup original state
  backupFiles();
  
  // Scenario 1: Corrupt lockfile.hash
  console.log('Scenario 1: Corrupted lockfile.hash');
  console.log('  Corrupting lockfile.hash...');
  writeFileSync(join(WORKSPACE_DIR, '.nx/workspace-data/lockfile.hash'), 'CORRUPTED_HASH_VALUE');
  await runNxCommand('npx nx graph --file=corrupt-hash-test.json', true);
  restoreFiles();
  console.log();
  
  // Scenario 2: Corrupt parsed-lock-file.json
  console.log('Scenario 2: Corrupted parsed-lock-file.json');
  console.log('  Corrupting parsed-lock-file.json...');
  writeFileSync(join(WORKSPACE_DIR, '.nx/workspace-data/parsed-lock-file.json'), '{ "corrupted": "invalid json structure"');
  await runNxCommand('npx nx graph --file=corrupt-parsed-test.json', true);
  restoreFiles();
  console.log();
  
  // Scenario 3: Permission issues
  console.log('Scenario 3: Permission issues on lockfile.hash');
  console.log('  Changing permissions to read-only...');
  chmodSync(join(WORKSPACE_DIR, '.nx/workspace-data/lockfile.hash'), 0o444);
  // Try to run a command that would update the lockfile
  console.log('  Installing a new package to trigger lockfile update...');
  await runNxCommand('pnpm add lodash', true);
  await runNxCommand('npx nx graph --file=permission-test.json', true);
  chmodSync(join(WORKSPACE_DIR, '.nx/workspace-data/lockfile.hash'), 0o644);
  restoreFiles();
  console.log();
  
  // Scenario 4: Stale daemon process
  console.log('Scenario 4: Stale daemon process file');
  console.log('  Creating fake daemon process entry...');
  const fakeProcessJson = { processId: 99999 }; // Non-existent process
  writeFileSync(
    join(WORKSPACE_DIR, '.nx/workspace-data/d/server-process.json'), 
    JSON.stringify(fakeProcessJson)
  );
  await runNxCommand('npx nx daemon --status', true);
  await runNxCommand('npx nx graph --file=stale-daemon-test.json', true);
  restoreFiles();
  console.log();
  
  // Scenario 5: Concurrent processes
  console.log('Scenario 5: Concurrent Nx processes');
  console.log('  Starting multiple Nx commands simultaneously...');
  const promises = [];
  for (let i = 0; i < 5; i++) {
    promises.push(runNxCommand(`npx nx graph --file=concurrent-test-${i}.json`, true));
  }
  await Promise.all(promises);
  console.log();
  
  // Scenario 6: Lockfile mismatch
  console.log('Scenario 6: Package manager lockfile changed');
  console.log('  Modifying pnpm-lock.yaml while keeping old hash...');
  const lockfilePath = join(WORKSPACE_DIR, 'pnpm-lock.yaml');
  const originalLockfile = readFileSync(lockfilePath, 'utf-8');
  writeFileSync(lockfilePath, originalLockfile + '\n# Modified lockfile');
  await runNxCommand('npx nx graph --file=lockfile-mismatch-test.json', true);
  writeFileSync(lockfilePath, originalLockfile);
  restoreFiles();
  console.log();
  
  // Test nx reset
  console.log('Testing nx reset as a fix:');
  console.log('  Running nx reset...');
  await runNxCommand('npx nx reset');
  console.log('  Testing command after reset...');
  await runNxCommand('npx nx graph --file=after-reset-test.json');
  console.log();
  
  // Check what was cleared
  console.log('Checking what nx reset cleared:');
  const checkPath = (path) => {
    const fullPath = join(WORKSPACE_DIR, path);
    const exists = existsSync(fullPath);
    console.log(`  ${path}: ${exists ? 'still exists' : 'was cleared'}`);
  };
  
  checkPath('.nx/cache');
  checkPath('.nx/workspace-data');
  checkPath('.nx/workspace-data/lockfile.hash');
  checkPath('.nx/workspace-data/parsed-lock-file.json');
  checkPath('.nx/workspace-data/d/server-process.json');
}

// Run all scenarios
testScenarios().catch(console.error);