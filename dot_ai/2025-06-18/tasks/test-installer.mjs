#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const testDir = join(tmpdir(), 'raw-docs-test-' + Date.now());

console.log('Creating test directory:', testDir);
mkdirSync(testDir, { recursive: true });

// Initialize git repo
execSync('git init', { cwd: testDir });
execSync('git config user.email "test@example.com"', { cwd: testDir });
execSync('git config user.name "Test User"', { cwd: testDir });

// Create package.json
const pkg = {
  name: 'test-repo',
  version: '1.0.0',
  scripts: {}
};
writeFileSync(join(testDir, 'package.json'), JSON.stringify(pkg, null, 2));

// Run installer
console.log('\n=== First Installation ===');
execSync(`node ${process.cwd()}/scripts/install-cross-repo.mjs`, { 
  cwd: testDir, 
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'test' }
});

// Check files exist
console.log('\n=== Checking files after first install ===');
console.log('Wrapper exists:', existsSync(join(testDir, 'tools/scripts/analyze-docs.mjs')));
console.log('Config exists:', existsSync(join(testDir, '.rawdocs.json')));
console.log('Local config exists:', existsSync(join(testDir, '.rawdocs.local.json')));

// Check package.json has script
const pkgAfter = JSON.parse(readFileSync(join(testDir, 'package.json'), 'utf8'));
console.log('Package.json has analyze-docs script:', !!pkgAfter.scripts['analyze-docs']);

// Run installer again
console.log('\n=== Second Installation (should skip) ===');
execSync(`node ${process.cwd()}/scripts/install-cross-repo.mjs`, { 
  cwd: testDir, 
  stdio: 'inherit'
});

// Test the wrapper script error handling
console.log('\n=== Testing wrapper error handling ===');
try {
  // Remove the local config to trigger error
  rmSync(join(testDir, '.rawdocs.local.json'));
  execSync('node tools/scripts/analyze-docs.mjs', { cwd: testDir, stdio: 'inherit' });
} catch (e) {
  console.log('Expected error occurred');
}

// Cleanup
console.log('\n=== Cleaning up ===');
rmSync(testDir, { recursive: true, force: true });
console.log('Test complete!');