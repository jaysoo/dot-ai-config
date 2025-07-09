#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync, rmSync, unlinkSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const WORKSPACE_DIR = join(process.cwd(), '.ai/2025-01-27/tasks/reproduce-lockfile/test-workspace');

console.log('=== Reproducing Actual Nx Lock Errors ===\n');

// Helper to spawn process
function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    cwd: WORKSPACE_DIR,
    stdio: 'pipe',
    ...options
  });
}

// Test 1: Project Graph Lock Contention
async function testProjectGraphLock() {
  console.log('Test 1: Project Graph Lock Contention');
  console.log('  Creating project-graph.lock file to simulate lock...');
  
  const lockPath = join(WORKSPACE_DIR, '.nx/workspace-data/project-graph.lock');
  
  // Ensure directory exists
  mkdirSync(join(WORKSPACE_DIR, '.nx/workspace-data'), { recursive: true });
  
  // Create a lock file (simulating another process holding it)
  writeFileSync(lockPath, 'LOCKED');
  
  // Try to run Nx command that needs project graph
  console.log('  Running nx graph (should wait for lock)...');
  const proc = spawnCommand('npx', ['nx', 'graph', '--file=lock-test.json']);
  
  let output = '';
  proc.stdout.on('data', (data) => {
    output += data.toString();
    if (output.includes('Waiting for graph construction')) {
      console.log('  ✓ Got expected message: "Waiting for graph construction in another process to complete"');
      proc.kill();
    }
  });
  
  // Clean up after 3 seconds
  setTimeout(() => {
    if (existsSync(lockPath)) {
      unlinkSync(lockPath);
    }
    proc.kill();
  }, 3000);
  
  await new Promise(resolve => proc.on('exit', resolve));
  console.log();
}

// Test 2: Corrupted Parsed Lock File
async function testCorruptedParsedLockFile() {
  console.log('Test 2: Corrupted parsed-lock-file.json');
  
  const parsedLockPath = join(WORKSPACE_DIR, '.nx/workspace-data/parsed-lock-file.json');
  
  // Backup original
  if (existsSync(parsedLockPath)) {
    execSync(`cp "${parsedLockPath}" "${parsedLockPath}.backup"`);
  }
  
  // Write corrupted JSON
  console.log('  Writing corrupted JSON to parsed-lock-file.json...');
  writeFileSync(parsedLockPath, '{ "corrupted": true, "invalid": }');
  
  // Try to run command
  console.log('  Running nx command...');
  try {
    execSync('npx nx run lib-a:build', { 
      cwd: WORKSPACE_DIR, 
      stdio: 'pipe' 
    });
    console.log('  ✗ Command succeeded (expected error)');
  } catch (error) {
    console.log('  ✓ Command failed as expected');
    if (error.stderr) {
      console.log('  Error output:', error.stderr.toString().split('\n')[0]);
    }
  }
  
  // Restore
  if (existsSync(`${parsedLockPath}.backup`)) {
    execSync(`mv "${parsedLockPath}.backup" "${parsedLockPath}"`);
  }
  console.log();
}

// Test 3: Lock Files Changed During Operation
async function testLockFilesChanged() {
  console.log('Test 3: Lock Files Changed During Operation');
  
  const lockfilePath = join(WORKSPACE_DIR, 'pnpm-lock.yaml');
  const hashPath = join(WORKSPACE_DIR, '.nx/workspace-data/lockfile.hash');
  
  // Get current hash
  const currentHash = existsSync(hashPath) ? readFileSync(hashPath, 'utf-8').trim() : '';
  console.log('  Current lockfile hash:', currentHash.substring(0, 16) + '...');
  
  // Modify lockfile
  console.log('  Modifying pnpm-lock.yaml...');
  const lockfileContent = readFileSync(lockfilePath, 'utf-8');
  writeFileSync(lockfilePath, lockfileContent + '\n# Modified at ' + new Date().toISOString());
  
  // Calculate new hash
  const newContent = readFileSync(lockfilePath, 'utf-8');
  const newHash = createHash('sha256').update(newContent).digest('hex');
  console.log('  New lockfile hash:', newHash.substring(0, 16) + '...');
  
  // Run command
  console.log('  Running nx command (should detect change)...');
  try {
    const output = execSync('npx nx run-many -t build', { 
      cwd: WORKSPACE_DIR, 
      encoding: 'utf-8'
    });
    console.log('  Command output:', output.includes('lock') ? 'Detected lock file change' : 'No lock message');
  } catch (error) {
    console.log('  Command failed:', error.message.split('\n')[0]);
  }
  
  // Restore original
  writeFileSync(lockfilePath, lockfileContent);
  console.log();
}

// Test 4: Daemon Lock Issues
async function testDaemonLockIssues() {
  console.log('Test 4: Daemon Lock Issues');
  
  // Stop daemon first
  console.log('  Stopping daemon...');
  try {
    execSync('npx nx daemon --stop', { cwd: WORKSPACE_DIR });
  } catch (e) {
    // Ignore errors
  }
  
  // Create fake daemon process file
  const daemonPidPath = join(WORKSPACE_DIR, '.nx/workspace-data/d/server-process.json');
  mkdirSync(join(WORKSPACE_DIR, '.nx/workspace-data/d'), { recursive: true });
  
  console.log('  Creating stale daemon process file...');
  writeFileSync(daemonPidPath, JSON.stringify({ processId: 99999 }));
  
  // Try to start daemon
  console.log('  Starting daemon (should handle stale lock)...');
  try {
    const output = execSync('npx nx daemon --start', { 
      cwd: WORKSPACE_DIR, 
      encoding: 'utf-8' 
    });
    console.log('  Daemon started:', output.includes('started') ? 'success' : 'failed');
  } catch (error) {
    console.log('  Daemon start failed:', error.message.split('\n')[0]);
  }
  
  console.log();
}

// Test 5: Permission Issues
async function testPermissionIssues() {
  console.log('Test 5: Permission Issues on Lock Files');
  
  const workspaceDataDir = join(WORKSPACE_DIR, '.nx/workspace-data');
  
  console.log('  Making workspace-data directory read-only...');
  try {
    execSync(`chmod 555 "${workspaceDataDir}"`, { cwd: WORKSPACE_DIR });
    
    // Try to run command that would write to workspace-data
    console.log('  Running nx reset (should fail due to permissions)...');
    try {
      execSync('npx nx reset', { cwd: WORKSPACE_DIR, stdio: 'pipe' });
      console.log('  ✗ Command succeeded (expected error)');
    } catch (error) {
      console.log('  ✓ Command failed as expected');
      const errorMsg = error.stderr ? error.stderr.toString() : error.message;
      if (errorMsg.includes('EACCES') || errorMsg.includes('permission')) {
        console.log('  Got permission error');
      }
    }
  } finally {
    // Restore permissions
    execSync(`chmod 755 "${workspaceDataDir}"`, { cwd: WORKSPACE_DIR });
  }
  
  console.log();
}

// Run all tests
async function runTests() {
  await testProjectGraphLock();
  await testCorruptedParsedLockFile();
  await testLockFilesChanged();
  await testDaemonLockIssues();
  await testPermissionIssues();
  
  console.log('=== Testing nx reset as universal fix ===');
  console.log('Running nx reset...');
  execSync('npx nx reset', { cwd: WORKSPACE_DIR, stdio: 'inherit' });
  
  console.log('\nTesting commands after reset:');
  try {
    execSync('npx nx graph --file=after-reset.json', { cwd: WORKSPACE_DIR });
    console.log('✓ nx graph works after reset');
  } catch (e) {
    console.log('✗ nx graph still fails after reset');
  }
  
  try {
    execSync('npx nx run lib-a:build', { cwd: WORKSPACE_DIR });
    console.log('✓ nx build works after reset');
  } catch (e) {
    console.log('✗ nx build still fails after reset');
  }
}

runTests().catch(console.error);