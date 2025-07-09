#!/usr/bin/env node

import { execSync, spawn } from 'child_process';
import { writeFileSync, readFileSync, existsSync, mkdirSync, chmodSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';

const WORKSPACE_DIR = join(process.cwd(), '.ai/2025-01-27/tasks/reproduce-lockfile/test-workspace');

console.log('=== Triggering Nx Lockfile Error ===\n');

// Method 1: Create conflicting lock state
function createConflictingLockState() {
  console.log('Method 1: Creating conflicting lock state');
  
  const workspaceDataDir = join(WORKSPACE_DIR, '.nx/workspace-data');
  const lockfileHashPath = join(workspaceDataDir, 'lockfile.hash');
  const parsedLockPath = join(workspaceDataDir, 'parsed-lock-file.json');
  const pnpmLockPath = join(WORKSPACE_DIR, 'pnpm-lock.yaml');
  
  // Read current state
  const currentHash = readFileSync(lockfileHashPath, 'utf-8').trim();
  const currentParsedLock = readFileSync(parsedLockPath, 'utf-8');
  
  console.log('  Current hash:', currentHash.substring(0, 16) + '...');
  
  // Modify pnpm-lock.yaml significantly
  console.log('  Adding fake dependency to pnpm-lock.yaml...');
  const lockContent = readFileSync(pnpmLockPath, 'utf-8');
  const modifiedLock = lockContent.replace(
    'dependencies:',
    `dependencies:
  fake-package: "1.0.0"`
  );
  writeFileSync(pnpmLockPath, modifiedLock);
  
  // Keep old hash but with new lockfile
  console.log('  Keeping old hash with new lockfile content...');
  
  // Try to run Nx command
  console.log('  Running nx command (should detect mismatch)...');
  try {
    const output = execSync('npx nx run lib-a:build --verbose', { 
      cwd: WORKSPACE_DIR,
      encoding: 'utf-8',
      env: { ...process.env, NX_VERBOSE_LOGGING: 'true' }
    });
    console.log('  Output:', output.substring(0, 200));
  } catch (error) {
    console.log('  ✓ Error occurred:', error.message.split('\n')[0]);
  }
  
  // Restore
  writeFileSync(pnpmLockPath, lockContent);
  console.log();
}

// Method 2: Corrupt internal state files
function corruptInternalState() {
  console.log('Method 2: Corrupting internal state files');
  
  const workspaceDataDir = join(WORKSPACE_DIR, '.nx/workspace-data');
  const parsedLockPath = join(workspaceDataDir, 'parsed-lock-file.json');
  const projectGraphPath = join(workspaceDataDir, 'project-graph.json');
  
  // Backup
  execSync(`cp "${parsedLockPath}" "${parsedLockPath}.backup"`);
  execSync(`cp "${projectGraphPath}" "${projectGraphPath}.backup"`);
  
  // Corrupt parsed lock file with invalid structure
  console.log('  Writing invalid parsed-lock-file.json...');
  const invalidParsedLock = {
    dependencies: {
      'nx': {
        version: 'INVALID_VERSION',
        dependencies: null // Should be an object
      }
    },
    externalNodes: 'INVALID' // Should be an object
  };
  writeFileSync(parsedLockPath, JSON.stringify(invalidParsedLock));
  
  // Also corrupt project graph
  console.log('  Writing invalid project-graph.json...');
  writeFileSync(projectGraphPath, '{"invalid": true, "nodes": null}');
  
  // Try to run Nx
  console.log('  Running nx graph...');
  try {
    execSync('npx nx graph --file=corrupted-state.json', { 
      cwd: WORKSPACE_DIR,
      stdio: 'pipe'
    });
    console.log('  ✗ Command succeeded unexpectedly');
  } catch (error) {
    console.log('  ✓ Error occurred:', error.message.split('\n')[0]);
  }
  
  // Restore
  execSync(`mv "${parsedLockPath}.backup" "${parsedLockPath}"`);
  execSync(`mv "${projectGraphPath}.backup" "${projectGraphPath}"`);
  console.log();
}

// Method 3: Simulate file system issues
function simulateFileSystemIssues() {
  console.log('Method 3: Simulating file system issues');
  
  const workspaceDataDir = join(WORKSPACE_DIR, '.nx/workspace-data');
  const lockfileHashPath = join(workspaceDataDir, 'lockfile.hash');
  
  // Make lockfile.hash unreadable
  console.log('  Making lockfile.hash unreadable...');
  chmodSync(lockfileHashPath, 0o000);
  
  console.log('  Running nx command...');
  try {
    execSync('npx nx run lib-a:build', { 
      cwd: WORKSPACE_DIR,
      stdio: 'pipe'
    });
    console.log('  ✗ Command succeeded unexpectedly');
  } catch (error) {
    console.log('  ✓ Error occurred:', error.stderr?.toString().includes('EACCES') ? 'Permission denied' : error.message.split('\n')[0]);
  }
  
  // Restore permissions
  chmodSync(lockfileHashPath, 0o644);
  console.log();
}

// Method 4: Multiple concurrent modifications
async function concurrentModifications() {
  console.log('Method 4: Concurrent modifications to lock files');
  
  const processes = [];
  
  // Start multiple processes that modify package.json
  console.log('  Starting 3 concurrent processes that modify dependencies...');
  
  for (let i = 0; i < 3; i++) {
    const script = `
      const fs = require('fs');
      const path = require('path');
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      pkg.devDependencies['test-dep-${i}'] = '1.0.${i}';
      fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
      require('child_process').execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });
    `;
    
    const proc = spawn('node', ['-e', script], {
      cwd: WORKSPACE_DIR,
      stdio: 'pipe'
    });
    
    processes.push(proc);
  }
  
  // Wait a bit then run Nx command
  setTimeout(() => {
    console.log('  Running nx command during concurrent modifications...');
    try {
      execSync('npx nx run-many -t build', { 
        cwd: WORKSPACE_DIR,
        stdio: 'pipe'
      });
      console.log('  Command completed');
    } catch (error) {
      console.log('  ✓ Error occurred:', error.message.split('\n')[0]);
    }
  }, 1000);
  
  // Wait for all processes
  await Promise.all(processes.map(p => new Promise(resolve => p.on('exit', resolve))));
  
  // Clean up package.json
  const pkg = JSON.parse(readFileSync(join(WORKSPACE_DIR, 'package.json'), 'utf-8'));
  for (let i = 0; i < 3; i++) {
    delete pkg.devDependencies[`test-dep-${i}`];
  }
  writeFileSync(join(WORKSPACE_DIR, 'package.json'), JSON.stringify(pkg, null, 2));
  
  console.log();
}

// Method 5: Force daemon to hold locks
async function daemonLockContention() {
  console.log('Method 5: Daemon lock contention');
  
  // Start daemon explicitly
  console.log('  Starting daemon...');
  try {
    execSync('npx nx daemon --start', { cwd: WORKSPACE_DIR });
  } catch (e) {
    // Ignore
  }
  
  // Create a custom lock file that daemon might use
  const customLockPath = join(WORKSPACE_DIR, '.nx/workspace-data/custom.lock');
  writeFileSync(customLockPath, 'LOCKED');
  
  // Run multiple graph commands simultaneously
  console.log('  Running multiple graph commands...');
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      new Promise((resolve) => {
        const proc = spawn('npx', ['nx', 'graph', `--file=graph-${i}.json`], {
          cwd: WORKSPACE_DIR,
          stdio: 'pipe'
        });
        
        let output = '';
        proc.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        proc.on('exit', (code) => {
          if (code !== 0 || output.includes('lock')) {
            console.log(`  Process ${i}: ${code === 0 ? 'completed' : 'failed'}`);
          }
          resolve();
        });
        
        // Kill after 5 seconds
        setTimeout(() => proc.kill(), 5000);
      })
    );
  }
  
  await Promise.all(promises);
  console.log();
}

// Run all methods
async function runAllMethods() {
  createConflictingLockState();
  corruptInternalState();
  simulateFileSystemIssues();
  await concurrentModifications();
  await daemonLockContention();
  
  console.log('=== Summary ===');
  console.log('The most reliable ways to trigger lockfile errors:');
  console.log('1. Corrupt the parsed-lock-file.json');
  console.log('2. Create permission issues on .nx/workspace-data files');
  console.log('3. Modify package manager lockfile while Nx is running');
  console.log('4. Have concurrent processes modifying dependencies');
  console.log();
  console.log('nx reset fixes these by:');
  console.log('- Clearing all cached lock data (.nx/workspace-data)');
  console.log('- Stopping the daemon (prevents lock contention)');
  console.log('- Forcing fresh parsing of lockfiles on next run');
}

runAllMethods().catch(console.error);