#!/usr/bin/env node

/**
 * Debug script to analyze module resolution paths
 * Run this in different contexts to compare module resolution behavior
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== Module Resolution Debug Information ===\n');

// Basic environment info
console.log('1. Environment Info:');
console.log('   CWD:', process.cwd());
console.log('   Script Location:', __filename);
console.log('   NODE_PATH:', process.env.NODE_PATH || '(not set)');
console.log('   Node Version:', process.version);
console.log('');

// Module paths
console.log('2. Module Paths (module.paths):');
if (typeof module !== 'undefined' && module.paths) {
  module.paths.forEach((p, i) => console.log(`   [${i}] ${p}`));
} else {
  console.log('   module.paths not available in ESM');
}
console.log('');

// Try to resolve common packages
console.log('3. Package Resolution Tests:');
const testPackages = [
  '@angular/core',
  '@nx/workspace',
  'typescript',
  'react'
];

for (const pkg of testPackages) {
  try {
    const require = createRequire(import.meta.url);
    const resolved = require.resolve(pkg);
    console.log(`   ✓ ${pkg}: ${resolved}`);
  } catch (err) {
    console.log(`   ✗ ${pkg}: ${err.message}`);
  }
}
console.log('');

// Check node_modules locations
console.log('4. node_modules Directories Found:');
function findNodeModules(startPath, maxDepth = 5) {
  const results = [];
  let currentPath = path.resolve(startPath);
  let depth = 0;
  
  while (depth < maxDepth) {
    const nodeModulesPath = path.join(currentPath, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      results.push(nodeModulesPath);
    }
    
    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) break; // Reached root
    
    currentPath = parentPath;
    depth++;
  }
  
  return results;
}

const nodeModulesDirs = findNodeModules(process.cwd());
nodeModulesDirs.forEach((dir, i) => console.log(`   [${i}] ${dir}`));
console.log('');

// Process spawn simulation
console.log('5. Child Process Spawn Test:');
console.log('   If this script is spawned as a child process, these env vars are inherited:');
console.log('   - PATH:', process.env.PATH?.split(path.delimiter).slice(0, 3).join(path.delimiter) + '...');
console.log('   - NODE_ENV:', process.env.NODE_ENV || '(not set)');
console.log('');

// Migration-specific checks
console.log('6. Migration Context Simulation:');
const migrationExample = '@nx/angular/src/migrations/update-21-0-0/example.js';
console.log(`   Simulating migration: ${migrationExample}`);
console.log(`   Would execute from: ${process.cwd()}`);
console.log(`   Migration file would resolve dependencies from its own location`);

// Additional context
if (process.argv.includes('--verbose')) {
  console.log('\n7. Full Environment Variables:');
  Object.entries(process.env).forEach(([key, value]) => {
    if (key.includes('NODE') || key.includes('PATH') || key.includes('NX')) {
      console.log(`   ${key}: ${value}`);
    }
  });
}