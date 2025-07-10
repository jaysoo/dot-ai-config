#!/usr/bin/env node

import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test the customRequire function by simulating the .nx/installation scenario
console.log('Testing custom-require functionality...\n');

// Create a test directory structure
const testDir = join(__dirname, 'test-nx-installation');
const nxInstallDir = join(testDir, '.nx', 'installation', 'node_modules', 'test-module');

// Clean up any existing test directory
if (existsSync(testDir)) {
  rmSync(testDir, { recursive: true, force: true });
}

// Create the directory structure
mkdirSync(nxInstallDir, { recursive: true });

// Create a simple test module
const testModuleContent = `
exports.testValue = 'Hello from .nx/installation/node_modules!';
exports.workspaceRoot = '/test/workspace/root';
`;

writeFileSync(join(nxInstallDir, 'index.js'), testModuleContent);
writeFileSync(join(nxInstallDir, 'package.json'), JSON.stringify({ name: 'test-module', version: '1.0.0' }));

// Change to the test directory to simulate the scenario
process.chdir(testDir);

console.log('Current directory:', process.cwd());
console.log('.nx/installation/node_modules exists:', existsSync('.nx/installation/node_modules'));

// Now test the customRequire function
try {
  // First, let's test that standard require would fail
  console.log('\nTesting standard require (should fail):');
  try {
    require('test-module');
    console.log('❌ Standard require unexpectedly succeeded');
  } catch (e) {
    console.log('✅ Standard require failed as expected:', e.code);
  }

  // Now test our custom require implementation
  console.log('\nTesting customRequire implementation:');
  
  // We'll inline the customRequire logic here for testing
  function testCustomRequire(moduleName) {
    try {
      return require(moduleName);
    } catch (e) {
      const nxInstallationPath = join(process.cwd(), '.nx', 'installation', 'node_modules');
      if (existsSync(nxInstallationPath)) {
        try {
          const resolvedPath = require.resolve(moduleName, { paths: [nxInstallationPath] });
          return require(resolvedPath);
        } catch (e2) {
          // Fall through to original error
        }
      }
      throw e;
    }
  }

  const result = testCustomRequire('test-module');
  console.log('✅ customRequire succeeded!');
  console.log('   Module exports:', result);
  console.log('   testValue:', result.testValue);
  console.log('   workspaceRoot:', result.workspaceRoot);

} catch (error) {
  console.error('❌ Test failed:', error);
} finally {
  // Clean up
  process.chdir(__dirname);
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true, force: true });
  }
  console.log('\nTest cleanup completed.');
}