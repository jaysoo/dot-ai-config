#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';

const testDir = '/Users/jack/projects/test-1';

console.log('Testing Raw Docs Installation\n');

// Function to run command and capture output
function run(cmd, cwd = testDir) {
  try {
    const output = execSync(cmd, { cwd, encoding: 'utf8' });
    return { success: true, output };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

// Clean up any existing installation
console.log('1. Cleaning up existing installation...');
const filesToClean = [
  '.rawdocs',
  '.rawdocs.json', 
  '.rawdocs.local.json',
  'tools/scripts/analyze-docs.mjs',
  '.git/hooks/pre-push'
];

for (const file of filesToClean) {
  const filePath = join(testDir, file);
  if (existsSync(filePath)) {
    try {
      rmSync(filePath, { force: true });
      console.log(`   Removed: ${file}`);
    } catch (e) {
      console.log(`   Failed to remove: ${file}`);
    }
  }
}

// Reset package.json if needed
const pkgPath = join(testDir, 'package.json');
if (existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    if (pkg.scripts && pkg.scripts['analyze-docs']) {
      delete pkg.scripts['analyze-docs'];
      execSync(`cd ${testDir} && git checkout package.json`, { stdio: 'ignore' });
      console.log('   Reset package.json');
    }
  } catch (e) {
    // Ignore
  }
}

console.log('\n2. Running installation...');
const installResult = run('node ../raw-docs/scripts/install-cross-repo.mjs');
if (!installResult.success) {
  console.error('Installation failed:', installResult.output);
  process.exit(1);
}

console.log('\n3. Verifying installation...');

// Check created files
const expectedFiles = [
  { path: '.rawdocs.json', type: 'config' },
  { path: '.rawdocs.local.json', type: 'local config' },
  { path: 'tools/scripts/analyze-docs.mjs', type: 'wrapper script' }
];

let allFilesCreated = true;
for (const { path, type } of expectedFiles) {
  const filePath = join(testDir, path);
  if (existsSync(filePath)) {
    console.log(`   ✓ ${type} created: ${path}`);
    
    // Show file contents for configs
    if (path.endsWith('.json')) {
      const content = readFileSync(filePath, 'utf8');
      console.log(`     Contents: ${content.split('\n')[0].substring(0, 50)}...`);
    }
  } else {
    console.log(`   ✗ ${type} missing: ${path}`);
    allFilesCreated = false;
  }
}

// Check package.json script
if (existsSync(pkgPath)) {
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  if (pkg.scripts && pkg.scripts['analyze-docs']) {
    console.log('   ✓ npm script added: analyze-docs');
  } else {
    console.log('   ✗ npm script missing: analyze-docs');
    allFilesCreated = false;
  }
}

// Check .gitignore
const gitignorePath = join(testDir, '.gitignore');
if (existsSync(gitignorePath)) {
  const gitignore = readFileSync(gitignorePath, 'utf8');
  if (gitignore.includes('.rawdocs.local.json')) {
    console.log('   ✓ .gitignore updated');
  } else {
    console.log('   ✗ .gitignore not updated');
  }
}

if (!allFilesCreated) {
  console.error('\nSome files were not created properly.');
  process.exit(1);
}

console.log('\n4. Testing analyze-docs command...');
const analyzeResult = run('npm run analyze-docs');
if (analyzeResult.success) {
  console.log('   ✓ analyze-docs command works');
  console.log('   Output preview:', analyzeResult.output.split('\n')[0]);
} else {
  console.log('   ✗ analyze-docs command failed:', analyzeResult.output);
}

console.log('\n5. Testing uninstall...');
const uninstallResult = run('node ../raw-docs/scripts/install-cross-repo.mjs --uninstall');
if (uninstallResult.success) {
  console.log('   ✓ Uninstall completed');
  
  // Verify files were removed
  for (const { path, type } of expectedFiles) {
    const filePath = join(testDir, path);
    if (!existsSync(filePath)) {
      console.log(`   ✓ ${type} removed: ${path}`);
    } else {
      console.log(`   ✗ ${type} still exists: ${path}`);
    }
  }
} else {
  console.log('   ✗ Uninstall failed:', uninstallResult.output);
}

console.log('\n✅ All tests completed!');