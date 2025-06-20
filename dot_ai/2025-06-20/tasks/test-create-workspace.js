#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test matrix for create-nx-workspace
const testMatrix = [
  // Test with "." directory
  { dir: '.', preset: 'nest', appName: 'test-app' },
  { dir: '.', preset: 'apps', appName: 'test-app' },
  { dir: '.', preset: 'npm', appName: 'test-app' },
  { dir: '.', preset: 'next', appName: 'test-app' },
  { dir: '.', preset: 'react', appName: 'test-app' },
  
  // Test with custom directory
  { dir: 'custom-workspace', preset: 'nest', appName: 'test-app' },
  { dir: 'custom-workspace', preset: 'apps', appName: 'test-app' },
  
  // Test with different package managers
  { dir: 'test-npm', preset: 'nest', appName: 'test-app', packageManager: 'npm' },
  { dir: 'test-yarn', preset: 'nest', appName: 'test-app', packageManager: 'yarn' },
  { dir: 'test-pnpm', preset: 'nest', appName: 'test-app', packageManager: 'pnpm' },
];

// Create test directory
const testBaseDir = '/tmp/claude/repro-31572';
if (fs.existsSync(testBaseDir)) {
  fs.rmSync(testBaseDir, { recursive: true, force: true });
}
fs.mkdirSync(testBaseDir, { recursive: true });

console.log('Testing create-nx-workspace combinations...\n');

const results = [];

for (const test of testMatrix) {
  const testDir = path.join(testBaseDir, `test-${Date.now()}`);
  fs.mkdirSync(testDir);
  
  process.chdir(testDir);
  
  const command = `npx create-nx-workspace@latest ${test.dir} --preset ${test.preset} --appName ${test.appName} --no-nxCloud --skip-git --ci skip ${test.packageManager ? `--packageManager ${test.packageManager}` : ''}`;
  
  console.log(`Testing: ${command}`);
  console.log(`In directory: ${testDir}`);
  
  const startTime = Date.now();
  
  try {
    // Use timeout of 2 minutes
    execSync(command, { 
      stdio: 'inherit',
      timeout: 120000 
    });
    
    const duration = Date.now() - startTime;
    results.push({
      ...test,
      success: true,
      duration,
      message: 'Success'
    });
    
    console.log(`✅ Success in ${duration/1000}s\n`);
  } catch (error) {
    const duration = Date.now() - startTime;
    results.push({
      ...test,
      success: false,
      duration,
      message: error.message
    });
    
    console.log(`❌ Failed: ${error.message}\n`);
  }
  
  // Clean up for next test
  process.chdir(testBaseDir);
}

// Summary
console.log('\n=== SUMMARY ===\n');
console.log('Successful combinations:');
results.filter(r => r.success).forEach(r => {
  console.log(`✅ dir: "${r.dir}", preset: ${r.preset}, duration: ${r.duration/1000}s`);
});

console.log('\nFailed combinations:');
results.filter(r => !r.success).forEach(r => {
  console.log(`❌ dir: "${r.dir}", preset: ${r.preset}, error: ${r.message}`);
});

// Write detailed results
const reportPath = path.join(testBaseDir, 'test-results.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\nDetailed results saved to: ${reportPath}`);