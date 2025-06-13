#!/usr/bin/env node

/**
 * Test script for heap logging feature
 * This automates the testing workflow for verifying heap logging implementation
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const testVersion = process.argv[2] || '23.0.0-test.1';
const workspaceName = `heap-test-${Date.now()}`;
const tmpDir = '/tmp';
const workspaceDir = join(tmpDir, workspaceName);

console.log(`🧪 Testing Heap Logging Feature with version ${testVersion}`);

try {
  // Step 1: Publish test version
  console.log('\n📦 Publishing test version...');
  console.log('Run: pnpm nx-release ' + testVersion);
  console.log('(You need to run this manually in the nx repo first)');
  console.log('Press Enter when ready...');
  
  // Wait for user confirmation
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  // Step 2: Create test workspace
  console.log(`\n🏗️  Creating test workspace at ${workspaceDir}...`);
  process.chdir(tmpDir);
  
  execSync(
    `npx create-nx-workspace@${testVersion} ${workspaceName} --preset=ts --no-interactive`,
    { stdio: 'inherit' }
  );
  
  process.chdir(workspaceDir);
  
  // Step 3: Generate test library
  console.log('\n📚 Generating test library...');
  execSync('nx g @nx/js:lib libs/memory-test', { stdio: 'inherit' });
  
  // Step 4: Create memory-intensive script
  console.log('\n📝 Creating memory test script...');
  const scriptPath = join(workspaceDir, 'libs/memory-test/src/memory-hog.js');
  const scriptContent = `
// Memory-intensive task for testing heap logging
const arrays = [];
const size = 200; // MB
const duration = 3000; // ms

console.log('Starting memory-intensive task...');

// Allocate memory
for (let i = 0; i < size; i++) {
  arrays.push(new Array(1024 * 1024 / 8).fill(Math.random()));
  if (i % 50 === 0) console.log(\`Allocated \${i}MB...\`);
}

console.log(\`Allocated \${size}MB total, holding for \${duration}ms...\`);

// Keep alive and prevent GC
const interval = setInterval(() => {
  arrays.forEach(arr => arr[0] = Math.random());
}, 100);

setTimeout(() => {
  clearInterval(interval);
  console.log('Memory test complete!');
  process.exit(0);
}, duration);
`;
  
  writeFileSync(scriptPath, scriptContent);
  
  // Step 5: Update project.json to add memory-test target
  console.log('\n⚙️  Adding memory-test target...');
  const projectJsonPath = join(workspaceDir, 'libs/memory-test/project.json');
  const projectJson = JSON.parse(execSync(`cat ${projectJsonPath}`).toString());
  
  projectJson.targets['memory-test'] = {
    executor: '@nx/js:node',
    options: {
      buildFilePatterns: ['libs/memory-test/src/memory-hog.js']
    }
  };
  
  writeFileSync(projectJsonPath, JSON.stringify(projectJson, null, 2));
  
  // Step 6: Run the test
  console.log('\n🚀 Running memory test WITH heap logging...');
  console.log('Command: NX_LOG_HEAP_USAGE=true nx run memory-test:memory-test\n');
  
  try {
    execSync('NX_LOG_HEAP_USAGE=true nx run memory-test:memory-test', { 
      stdio: 'inherit',
      env: { ...process.env, NX_LOG_HEAP_USAGE: 'true' }
    });
  } catch (e) {
    console.error('Test execution failed:', e.message);
  }
  
  // Step 7: Run without heap logging for comparison
  console.log('\n🚀 Running memory test WITHOUT heap logging (for comparison)...');
  console.log('Command: nx run memory-test:memory-test\n');
  
  try {
    execSync('nx run memory-test:memory-test', { stdio: 'inherit' });
  } catch (e) {
    console.error('Test execution failed:', e.message);
  }
  
  console.log('\n✅ Test complete!');
  console.log('\n📊 Expected result:');
  console.log('  WITH heap logging: Should show "(peak: XXXmb)" in the output');
  console.log('  WITHOUT heap logging: Should NOT show peak memory');
  
  console.log(`\n🗑️  Test workspace created at: ${workspaceDir}`);
  console.log('You can delete it when done testing.');
  
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
}