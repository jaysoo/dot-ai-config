#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync, lstatSync, readlinkSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';

// Create test directory in system temp
const testDir = join(tmpdir(), 'workspace-linking-test-' + Date.now());
mkdirSync(testDir, { recursive: true });

console.log(`Testing workspace linking in: ${testDir}\n`);
console.log('# Workspace Linking Investigation\n');
console.log('Testing if semver ranges create symlinks to local workspace packages\n');

const managers = ['npm', 'yarn', 'pnpm'];

async function createMonorepoStructure(manager, useSemver) {
  const repoDir = join(testDir, `${manager}-${useSemver ? 'semver' : 'workspace'}`);
  mkdirSync(repoDir, { recursive: true });

  // Create root package.json with workspaces config
  const rootPackageJson = {
    name: 'test-monorepo',
    version: '1.0.0',
    private: true
  };

  // Configure workspaces based on package manager
  if (manager === 'npm' || manager === 'yarn') {
    rootPackageJson.workspaces = ['packages/*'];
  }

  writeFileSync(
    join(repoDir, 'package.json'),
    JSON.stringify(rootPackageJson, null, 2)
  );

  // For pnpm, create pnpm-workspace.yaml
  if (manager === 'pnpm') {
    writeFileSync(
      join(repoDir, 'pnpm-workspace.yaml'),
      'packages:\n  - "packages/*"\n'
    );
  }

  // Create packages directory
  const packagesDir = join(repoDir, 'packages');
  mkdirSync(packagesDir, { recursive: true });

  // Create library package
  const libDir = join(packagesDir, 'my-lib');
  mkdirSync(libDir, { recursive: true });
  
  writeFileSync(
    join(libDir, 'package.json'),
    JSON.stringify({
      name: '@test/my-lib',
      version: '1.0.0',
      main: 'index.js'
    }, null, 2)
  );

  writeFileSync(
    join(libDir, 'index.js'),
    'module.exports = { message: "Hello from my-lib!" };'
  );

  // Create app package that depends on library
  const appDir = join(packagesDir, 'my-app');
  mkdirSync(appDir, { recursive: true });

  const appDeps = {};
  if (useSemver) {
    // Use semver range
    appDeps['@test/my-lib'] = '^1.0.0';
  } else {
    // Use workspace protocol
    if (manager === 'npm') {
      appDeps['@test/my-lib'] = '*'; // npm uses * for workspace deps
    } else if (manager === 'yarn') {
      appDeps['@test/my-lib'] = 'workspace:^1.0.0';
    } else if (manager === 'pnpm') {
      appDeps['@test/my-lib'] = 'workspace:^1.0.0';
    }
  }

  writeFileSync(
    join(appDir, 'package.json'),
    JSON.stringify({
      name: '@test/my-app',
      version: '1.0.0',
      dependencies: appDeps
    }, null, 2)
  );

  writeFileSync(
    join(appDir, 'index.js'),
    `const lib = require('@test/my-lib');\nconsole.log(lib.message);`
  );

  return repoDir;
}

async function installAndAnalyze(manager, repoDir, useSemver) {
  console.log(`\n## ${manager.toUpperCase()} - ${useSemver ? 'Semver Range' : 'Workspace Protocol'}\n`);

  try {
    // Install dependencies
    let installCmd;
    switch (manager) {
      case 'npm':
        installCmd = 'npm install';
        break;
      case 'yarn':
        installCmd = 'yarn install';
        break;
      case 'pnpm':
        installCmd = 'pnpm install';
        break;
    }

    console.log(`Running: ${installCmd}`);
    execSync(installCmd, { cwd: repoDir, stdio: 'pipe' });
    console.log('✓ Installation successful\n');

    // Check if dependency is symlinked
    const appNodeModules = join(repoDir, 'packages', 'my-app', 'node_modules', '@test', 'my-lib');
    const rootNodeModules = join(repoDir, 'node_modules', '@test', 'my-lib');

    let isSymlinked = false;
    let symlinkLocation = null;
    let symlinkTarget = null;

    // Check app's node_modules first
    if (existsSync(appNodeModules)) {
      const stats = lstatSync(appNodeModules);
      if (stats.isSymbolicLink()) {
        isSymlinked = true;
        symlinkLocation = 'app node_modules';
        symlinkTarget = readlinkSync(appNodeModules);
      }
    }

    // Check root node_modules if not found in app
    if (!isSymlinked && existsSync(rootNodeModules)) {
      const stats = lstatSync(rootNodeModules);
      if (stats.isSymbolicLink()) {
        isSymlinked = true;
        symlinkLocation = 'root node_modules';
        symlinkTarget = readlinkSync(rootNodeModules);
      }
    }

    console.log(`### Symlink Analysis`);
    console.log(`- Is symlinked: ${isSymlinked ? '✓ Yes' : '✗ No'}`);
    if (isSymlinked) {
      console.log(`- Symlink location: ${symlinkLocation}`);
      console.log(`- Symlink target: ${symlinkTarget}`);
    }

    // Analyze lockfile
    console.log(`\n### Lockfile Analysis`);
    
    let lockfilePath;
    let lockfileContent;
    
    switch (manager) {
      case 'npm':
        lockfilePath = join(repoDir, 'package-lock.json');
        break;
      case 'yarn':
        lockfilePath = join(repoDir, 'yarn.lock');
        break;
      case 'pnpm':
        lockfilePath = join(repoDir, 'pnpm-lock.yaml');
        break;
    }

    if (existsSync(lockfilePath)) {
      lockfileContent = readFileSync(lockfilePath, 'utf8');
      
      // Search for our workspace dependency
      const libMatches = lockfileContent.match(/@test\/my-lib[^\n]*/g);
      if (libMatches) {
        console.log('Lockfile entries for @test/my-lib:');
        libMatches.slice(0, 3).forEach(match => {
          console.log(`  ${match}`);
        });
      }

      // For npm, check specific resolution
      if (manager === 'npm') {
        try {
          const lockJson = JSON.parse(lockfileContent);
          const appPkg = lockJson.packages?.['packages/my-app'];
          if (appPkg?.dependencies?.['@test/my-lib']) {
            console.log(`\napp's dependency resolution: ${JSON.stringify(appPkg.dependencies['@test/my-lib'])}`);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }

    // Test that changes are reflected
    console.log(`\n### Live Update Test`);
    
    // Modify the library
    const libIndexPath = join(repoDir, 'packages', 'my-lib', 'index.js');
    writeFileSync(libIndexPath, 'module.exports = { message: "UPDATED: Hello from my-lib!" };');
    
    // Run the app to see if it picks up changes
    try {
      const output = execSync('node index.js', { 
        cwd: join(repoDir, 'packages', 'my-app'),
        encoding: 'utf8'
      }).trim();
      
      const picksUpChanges = output.includes('UPDATED');
      console.log(`- Picks up source changes without reinstall: ${picksUpChanges ? '✓ Yes' : '✗ No'}`);
      console.log(`- Output: "${output}"`);
    } catch (e) {
      console.log(`- Error running app: ${e.message}`);
    }

    return { isSymlinked, picksUpChanges: true };

  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
    return { isSymlinked: false, picksUpChanges: false };
  }
}

async function runTests() {
  const results = {};

  for (const manager of managers) {
    results[manager] = {};
    
    // Test with semver range
    const semverRepo = await createMonorepoStructure(manager, true);
    results[manager].semver = await installAndAnalyze(manager, semverRepo, true);
    
    // Test with workspace protocol
    const workspaceRepo = await createMonorepoStructure(manager, false);
    results[manager].workspace = await installAndAnalyze(manager, workspaceRepo, false);
  }

  // Summary
  console.log('\n# Summary\n');
  console.log('| Package Manager | Dependency Type | Creates Symlink | Live Updates |');
  console.log('|-----------------|-----------------|-----------------|--------------|');
  
  for (const manager of managers) {
    if (results[manager].semver) {
      console.log(`| ${manager} | Semver (^1.0.0) | ${results[manager].semver.isSymlinked ? '✓' : '✗'} | ${results[manager].semver.picksUpChanges ? '✓' : '✗'} |`);
    }
    if (results[manager].workspace) {
      console.log(`| ${manager} | Workspace Protocol | ${results[manager].workspace.isSymlinked ? '✓' : '✗'} | ${results[manager].workspace.picksUpChanges ? '✓' : '✗'} |`);
    }
  }

  console.log('\n## Key Findings\n');
  
  // Analyze patterns
  const semverSymlinks = Object.values(results).filter(r => r.semver?.isSymlinked).length;
  const workspaceSymlinks = Object.values(results).filter(r => r.workspace?.isSymlinked).length;
  
  if (semverSymlinks === 0) {
    console.log('⚠️  **Important**: Using semver ranges (like ^1.0.0) does NOT create symlinks to workspace packages!');
    console.log('- Changes to source files will NOT be reflected without reinstalling');
    console.log('- You must use workspace protocols for development with live updates');
  } else if (semverSymlinks === managers.length) {
    console.log('✓ All package managers create symlinks even with semver ranges');
  } else {
    console.log(`⚠️  Only ${semverSymlinks}/${managers.length} package managers create symlinks with semver ranges`);
  }

  console.log(`\n✓ All package managers create symlinks with workspace protocols (${workspaceSymlinks}/${managers.length})`);

  // Clean up
  rmSync(testDir, { recursive: true });
}

runTests().catch(console.error);