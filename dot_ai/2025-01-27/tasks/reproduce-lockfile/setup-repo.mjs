#!/usr/bin/env node

import { execSync } from 'child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const REPO_DIR = join(process.cwd(), '.ai/2025-01-27/tasks/reproduce-lockfile/test-workspace');

console.log('=== Setting up minimal Nx workspace for lockfile error reproduction ===\n');

// Clean up if exists
if (existsSync(REPO_DIR)) {
  console.log('Cleaning up existing test workspace...');
  rmSync(REPO_DIR, { recursive: true, force: true });
}

// Create directory
mkdirSync(REPO_DIR, { recursive: true });

console.log(`Creating workspace in: ${REPO_DIR}\n`);

try {
  // Create a minimal Nx workspace
  console.log('1. Creating minimal Nx workspace...');
  process.chdir(REPO_DIR);
  
  // Initialize package.json
  const packageJson = {
    name: 'lockfile-test',
    version: '1.0.0',
    private: true,
    devDependencies: {
      'nx': 'latest',
      '@nx/js': 'latest'
    },
    workspaces: ['packages/*']
  };
  
  writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  
  // Create nx.json
  const nxJson = {
    "$schema": "./node_modules/nx/schemas/nx-schema.json",
    "npmScope": "lockfile-test",
    "tasksRunnerOptions": {
      "default": {
        "runner": "nx/tasks-runners/default",
        "options": {
          "cacheableOperations": ["build", "test"]
        }
      }
    },
    "targetDefaults": {
      "build": {
        "dependsOn": ["^build"]
      }
    }
  };
  
  writeFileSync('nx.json', JSON.stringify(nxJson, null, 2));
  
  // Create a simple library
  console.log('2. Creating test library...');
  mkdirSync('packages/lib-a', { recursive: true });
  
  const libPackageJson = {
    name: '@lockfile-test/lib-a',
    version: '1.0.0',
    type: 'module',
    main: 'index.js'
  };
  
  writeFileSync('packages/lib-a/package.json', JSON.stringify(libPackageJson, null, 2));
  writeFileSync('packages/lib-a/index.js', `export function hello() { return 'Hello from lib-a'; }\n`);
  
  const libProjectJson = {
    name: 'lib-a',
    "$schema": "../../node_modules/nx/schemas/project-schema.json",
    "sourceRoot": "packages/lib-a",
    "projectType": "library",
    "targets": {
      "build": {
        "executor": "@nx/js:tsc",
        "outputs": ["{options.outputPath}"],
        "options": {
          "outputPath": "dist/packages/lib-a",
          "main": "packages/lib-a/index.js"
        }
      }
    }
  };
  
  writeFileSync('packages/lib-a/project.json', JSON.stringify(libProjectJson, null, 2));
  
  // Install dependencies
  console.log('3. Installing dependencies (this may take a moment)...');
  execSync('pnpm install', { stdio: 'inherit' });
  
  // Initialize Nx
  console.log('4. Initializing Nx...');
  execSync('npx nx init', { stdio: 'inherit' });
  
  // Run a simple command to ensure everything works
  console.log('5. Testing basic Nx command...');
  execSync('npx nx graph --file=test-graph.json', { stdio: 'inherit' });
  
  console.log('\n✓ Minimal workspace created successfully!');
  console.log(`  Location: ${REPO_DIR}`);
  
  // Check what files were created in .nx
  console.log('\n6. Checking .nx directory contents:');
  if (existsSync('.nx')) {
    execSync('ls -la .nx/', { stdio: 'inherit' });
    if (existsSync('.nx/workspace-data')) {
      console.log('\n  workspace-data contents:');
      execSync('ls -la .nx/workspace-data/', { stdio: 'inherit' });
    }
  }
  
} catch (error) {
  console.error('Error setting up workspace:', error.message);
  process.exit(1);
}

console.log('\n=== Setup complete ===');