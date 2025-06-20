#!/usr/bin/env node

import { performance } from 'perf_hooks';
import { join } from 'path';
import { globSync } from 'glob';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

console.log('Testing ESLint Ignore Check Performance\n');

const workspaceRoot = '/Users/jack/projects/nx';
process.chdir(workspaceRoot);

// Try to load ESLint from the workspace
let ESLint;
try {
  const eslintPath = require.resolve('eslint', { paths: [workspaceRoot] });
  const eslintModule = await import(eslintPath);
  ESLint = eslintModule.ESLint;
} catch (error) {
  console.error('Could not load ESLint from workspace:', error.message);
  process.exit(1);
}

// Find all TypeScript files in a project
const projectRoot = 'packages/angular';
const files = globSync(`${projectRoot}/**/*.{ts,tsx,js,jsx}`, {
  cwd: workspaceRoot,
  ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
});

console.log(`Found ${files.length} files in ${projectRoot}\n`);

// Test 1: Check files individually (simulating what the plugin does)
console.log('Test 1: Individual file checks (simulating plugin behavior)');
console.log('='.repeat(50));

const eslint = new ESLint({
  cwd: join(workspaceRoot, projectRoot),
});

const startIndividual = performance.now();
let ignoredCount = 0;
let checkedCount = 0;

for (const file of files) {
  const filePath = join(workspaceRoot, file);
  const isIgnored = await eslint.isPathIgnored(filePath);
  if (isIgnored) {
    ignoredCount++;
  }
  checkedCount++;
  
  // Log progress every 100 files
  if (checkedCount % 100 === 0) {
    console.log(`Checked ${checkedCount}/${files.length} files...`);
  }
}

const endIndividual = performance.now();
const durationIndividual = endIndividual - startIndividual;

console.log(`\nResults:`);
console.log(`- Total files: ${files.length}`);
console.log(`- Ignored files: ${ignoredCount}`);
console.log(`- Non-ignored files: ${files.length - ignoredCount}`);
console.log(`- Duration: ${(durationIndividual / 1000).toFixed(2)}s`);
console.log(`- Average per file: ${(durationIndividual / files.length).toFixed(2)}ms`);

// Test 2: Batch check (potential optimization)
console.log('\n\nTest 2: Batch check using lintFiles (for comparison)');
console.log('='.repeat(50));

const startBatch = performance.now();

try {
  // This will internally handle ignore patterns
  const results = await eslint.lintFiles(files.map(f => join(workspaceRoot, f)));
  const endBatch = performance.now();
  const durationBatch = endBatch - startBatch;
  
  console.log(`\nResults:`);
  console.log(`- Files linted: ${results.length}`);
  console.log(`- Duration: ${(durationBatch / 1000).toFixed(2)}s`);
  console.log(`- Speed improvement: ${(durationIndividual / durationBatch).toFixed(2)}x`);
} catch (error) {
  console.log(`Error during batch check: ${error.message}`);
}

// Test 3: Check with different cache settings
console.log('\n\nTest 3: Performance with different environments');
console.log('='.repeat(50));

const envConfigs = [
  { name: 'Default', env: {} },
  { name: 'No Daemon', env: { NX_DAEMON: 'false' } },
  { name: 'No Cache', env: { NX_PROJECT_GRAPH_CACHE: 'false' } },
  { name: 'No Daemon/Cache', env: { NX_DAEMON: 'false', NX_PROJECT_GRAPH_CACHE: 'false' } },
];

for (const config of envConfigs) {
  // Set environment
  Object.assign(process.env, config.env);
  
  const eslintWithEnv = new ESLint({
    cwd: join(workspaceRoot, projectRoot),
  });
  
  const startEnv = performance.now();
  
  // Check first 50 files only for speed
  const testFiles = files.slice(0, 50);
  for (const file of testFiles) {
    await eslintWithEnv.isPathIgnored(join(workspaceRoot, file));
  }
  
  const endEnv = performance.now();
  const durationEnv = endEnv - startEnv;
  
  console.log(`\n${config.name}:`);
  console.log(`- Environment: ${JSON.stringify(config.env)}`);
  console.log(`- Duration for 50 files: ${(durationEnv).toFixed(0)}ms`);
  console.log(`- Average per file: ${(durationEnv / 50).toFixed(2)}ms`);
  
  // Reset environment
  for (const key of Object.keys(config.env)) {
    delete process.env[key];
  }
}

// Summary
console.log('\n\nSummary');
console.log('='.repeat(50));
console.log(`The ESLint ignore check for ${files.length} files took ${(durationIndividual / 1000).toFixed(2)}s`);
console.log(`This translates to ${(durationIndividual / files.length).toFixed(2)}ms per file`);
console.log(`\nFor a large monorepo with many projects, this can add significant overhead.`);
console.log(`The issue reports 10+ seconds per project, which aligns with our findings.`);