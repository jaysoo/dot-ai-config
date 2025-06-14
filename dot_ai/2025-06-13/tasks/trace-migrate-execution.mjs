#!/usr/bin/env node

/**
 * Script to trace how VS Code executes migrations
 * This simulates the key parts of the migration execution path
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { createRequire } from 'module';

console.log('=== Tracing Migrate Execution Path ===\n');

const workspacePath = process.cwd();
console.log('1. Workspace Path:', workspacePath);

// Simulate reading a migration from migrations.json
const migrationsJsonPath = join(workspacePath, 'migrations.json');
let migrations = [];
try {
  const migrationsJson = JSON.parse(readFileSync(migrationsJsonPath, 'utf-8'));
  migrations = migrationsJson.migrations || [];
  console.log('2. Found migrations.json with', migrations.length, 'migrations');
} catch (e) {
  console.log('2. No migrations.json found');
}

// Test resolving a package migration config
const testPackages = ['@nx/angular', '@nx/react', '@nx/workspace'];
console.log('\n3. Testing package resolution:');

for (const pkg of testPackages) {
  try {
    // Try to resolve the package.json
    const require = createRequire(workspacePath + '/');
    const packageJsonPath = require.resolve(`${pkg}/package.json`);
    console.log(`   ✓ ${pkg} package.json:`, packageJsonPath);
    
    // Try to read migration config
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    if (packageJson.migrations || packageJson['ng-update']?.migrations) {
      const migrationsPath = packageJson.migrations || packageJson['ng-update']?.migrations;
      console.log(`     - Has migrations config:`, migrationsPath);
      
      // Try to resolve the migrations file
      try {
        const fullMigrationsPath = require.resolve(migrationsPath, {
          paths: [dirname(packageJsonPath)]
        });
        console.log(`     - Migrations file resolved:`, fullMigrationsPath);
      } catch (e) {
        console.log(`     - Failed to resolve migrations file:`, e.message);
      }
    }
  } catch (e) {
    console.log(`   ✗ ${pkg}:`, e.message);
  }
}

// Test the critical require.resolve pattern used in migrations
console.log('\n4. Testing migration require pattern:');
console.log('   When a migration tries to require a package:');

// Simulate what happens in a migration file
const simulateMigrationRequire = (migrationPath, packageToRequire) => {
  try {
    const require = createRequire(migrationPath);
    const resolved = require.resolve(packageToRequire);
    console.log(`   ✓ From ${migrationPath}:`);
    console.log(`     Can resolve ${packageToRequire} -> ${resolved}`);
  } catch (e) {
    console.log(`   ✗ From ${migrationPath}:`);
    console.log(`     Cannot resolve ${packageToRequire}: ${e.message}`);
  }
};

// Test from different locations
const testLocations = [
  workspacePath + '/dummy-migration.js',
  '/tmp/dummy-migration.js',
  join(workspacePath, 'node_modules/@nx/angular/src/migrations/dummy.js')
];

for (const location of testLocations) {
  simulateMigrationRequire(location, '@angular/core');
}

// Check NODE_PATH influence
console.log('\n5. NODE_PATH test:');
console.log('   Current NODE_PATH:', process.env.NODE_PATH || '(not set)');
console.log('   Setting NODE_PATH to:', join(workspacePath, 'node_modules'));

process.env.NODE_PATH = join(workspacePath, 'node_modules');
// Note: NODE_PATH only works when node is restarted
console.log('   (NODE_PATH changes require process restart to take effect)');

// Investigate VS Code process spawn
console.log('\n6. Process spawn investigation:');
console.log('   VS Code likely spawns migrate process with:');
console.log('   - cwd:', workspacePath);
console.log('   - env: inherited from VS Code process');
console.log('   - No explicit NODE_PATH set');

console.log('\n7. Recommendations:');
console.log('   The issue is likely that:');
console.log('   - Migrations are loaded using require() from their actual location');
console.log('   - When loaded from node_modules/@nx/angular/..., they can\'t find @angular/core');
console.log('   - NODE_PATH is not set in the VS Code process');
console.log('\n   Potential fixes:');
console.log('   1. Set NODE_PATH when spawning migration process');
console.log('   2. Use require.resolve with paths option in migrations');
console.log('   3. Change working directory to workspace root before require()');