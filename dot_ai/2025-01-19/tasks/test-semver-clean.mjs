#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

// Create test directory in system temp to avoid project conflicts
const testDir = join(tmpdir(), 'semver-test-' + Date.now());
mkdirSync(testDir, { recursive: true });

console.log(`Testing in: ${testDir}\n`);

const managers = ['npm', 'yarn', 'pnpm'];

// Semver patterns to test - using a package that has many versions
const testPackage = 'semver'; // The semver package itself has many versions

const semverPatterns = {
  'Caret Ranges': [
    { pattern: '^7.5.0', description: 'Compatible with version' },
    { pattern: '^0.5.0', description: 'Pre-1.0 compatible' },
    { pattern: '^0.0.4', description: 'Pre-0.1 compatible' }
  ],
  'Tilde Ranges': [
    { pattern: '~7.5.0', description: 'Approximately equivalent' },
    { pattern: '~7.5', description: 'Same minor version' },
    { pattern: '~7', description: 'Same major version' }
  ],
  'Comparison Ranges': [
    { pattern: '>7.0.0', description: 'Greater than' },
    { pattern: '>=7.0.0', description: 'Greater than or equal' },
    { pattern: '<8.0.0', description: 'Less than' },
    { pattern: '<=7.5.0', description: 'Less than or equal' }
  ],
  'Hyphen Ranges': [
    { pattern: '7.0.0 - 7.5.0', description: 'Range between versions' }
  ],
  'X-Ranges': [
    { pattern: '7.5.x', description: 'Any patch version' },
    { pattern: '7.x', description: 'Any minor/patch version' },
    { pattern: '*', description: 'Any version' }
  ],
  'Compound Ranges': [
    { pattern: '>=7.0.0 <8.0.0', description: 'AND condition' },
    { pattern: '6.0.0 || >=7.0.0', description: 'OR condition' }
  ],
  'Pre-release Tags': [
    { pattern: '7.5.1-0', description: 'Specific pre-release' },
    { pattern: '^7.5.0-0', description: 'Pre-release with caret' }
  ]
};

async function testSemverSupport() {
  console.log('# Semver Range Support Investigation\n');
  console.log(`Testing with package: ${testPackage}\n`);

  const results = {};

  for (const manager of managers) {
    console.log(`\n## Testing ${manager.toUpperCase()}\n`);
    results[manager] = {};

    // Check if manager is available
    try {
      execSync(`which ${manager}`, { stdio: 'pipe' });
      console.log(`✓ ${manager} is available\n`);
    } catch (e) {
      console.log(`✗ ${manager} is not available - skipping\n`);
      continue;
    }

    for (const [category, patterns] of Object.entries(semverPatterns)) {
      console.log(`### ${category}\n`);
      results[manager][category] = [];

      for (const { pattern, description } of patterns) {
        const result = await testPattern(manager, pattern, description);
        results[manager][category].push(result);
      }
    }
  }

  // Generate detailed report
  generateDetailedReport(results);
  
  // Clean up
  rmSync(testDir, { recursive: true });
}

async function testPattern(manager, pattern, description) {
  const testSubDir = join(testDir, `${manager}-${Date.now()}`);
  
  try {
    mkdirSync(testSubDir, { recursive: true });

    // Create minimal package.json
    const packageJson = {
      name: `test-${manager}`,
      version: '1.0.0',
      dependencies: {
        [testPackage]: pattern
      }
    };

    writeFileSync(
      join(testSubDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    console.log(`Testing: "${pattern}" - ${description}`);
    
    let installCmd;
    let listCmd;
    switch (manager) {
      case 'npm':
        installCmd = 'npm install --silent';
        listCmd = 'npm list --depth=0';
        break;
      case 'yarn':
        // First init yarn in the directory
        execSync('yarn init -y', { cwd: testSubDir, stdio: 'pipe' });
        // Update package.json with our dependency
        writeFileSync(
          join(testSubDir, 'package.json'),
          JSON.stringify(packageJson, null, 2)
        );
        installCmd = 'yarn add ' + testPackage + '@"' + pattern + '"';
        listCmd = 'yarn list --depth=0';
        break;
      case 'pnpm':
        installCmd = 'pnpm install';
        listCmd = 'pnpm list --depth=0';
        break;
    }

    const installOutput = execSync(installCmd, { 
      cwd: testSubDir,
      stdio: 'pipe',
      encoding: 'utf8'
    });

    // Get resolved version
    let resolvedVersion = 'N/A';
    try {
      const listOutput = execSync(listCmd, { 
        cwd: testSubDir, 
        stdio: 'pipe',
        encoding: 'utf8'
      });
      
      // Parse version from output
      const versionMatch = listOutput.match(new RegExp(`${testPackage}@([\\d\\.\\-\\w]+)`));
      if (versionMatch) {
        resolvedVersion = versionMatch[1];
      }
    } catch (e) {
      // Ignore list errors
    }

    console.log(`✓ Success: Resolved to ${resolvedVersion}`);
    
    return {
      pattern,
      description,
      supported: true,
      resolvedVersion,
      error: null
    };

  } catch (error) {
    const errorMsg = error.message.split('\n')[0];
    console.log(`✗ Failed: ${errorMsg}`);
    return {
      pattern,
      description,
      supported: false,
      resolvedVersion: null,
      error: errorMsg
    };
  } finally {
    if (existsSync(testSubDir)) {
      rmSync(testSubDir, { recursive: true });
    }
  }
}

function generateDetailedReport(results) {
  console.log('\n\n# Detailed Report\n');

  // First, let's document what semver is
  console.log('## Background\n');
  console.log('Semantic Versioning (semver) is a versioning scheme that uses a three-part version number: MAJOR.MINOR.PATCH\n');
  console.log('Package managers use various range specifiers to define acceptable versions:\n');
  console.log('- `^` (caret): Compatible versions (same major version)');
  console.log('- `~` (tilde): Approximately equivalent versions (same minor version)');
  console.log('- `>`, `>=`, `<`, `<=`: Comparison operators');
  console.log('- `||`: OR operator for multiple ranges');
  console.log('- `x` or `*`: Wildcards\n');

  console.log('## Test Results\n');
  console.log('| Pattern | Description | npm | yarn | pnpm |');
  console.log('|---------|-------------|-----|------|------|');

  for (const [category, patterns] of Object.entries(semverPatterns)) {
    console.log(`| **${category}** | | | | |`);
    
    for (let i = 0; i < patterns.length; i++) {
      const { pattern, description } = patterns[i];
      
      let npmStatus = '-';
      let yarnStatus = '-';
      let pnpmStatus = '-';
      
      if (results.npm && results.npm[category]) {
        const npmResult = results.npm[category][i];
        npmStatus = npmResult.supported 
          ? `✓ (${npmResult.resolvedVersion})` 
          : '✗';
      }
      
      if (results.yarn && results.yarn[category]) {
        const yarnResult = results.yarn[category][i];
        yarnStatus = yarnResult.supported 
          ? `✓ (${yarnResult.resolvedVersion})` 
          : '✗';
      }
      
      if (results.pnpm && results.pnpm[category]) {
        const pnpmResult = results.pnpm[category][i];
        pnpmStatus = pnpmResult.supported 
          ? `✓ (${pnpmResult.resolvedVersion})` 
          : '✗';
      }

      console.log(`| \`${pattern}\` | ${description} | ${npmStatus} | ${yarnStatus} | ${pnpmStatus} |`);
    }
  }

  // Analysis
  console.log('\n## Analysis\n');
  
  const managersWithResults = Object.keys(results).filter(m => Object.keys(results[m]).length > 0);
  
  if (managersWithResults.length === 0) {
    console.log('⚠️  No package managers were available for testing.');
    return;
  }

  // Check if all support the same patterns
  const allPatterns = [];
  for (const [category, patterns] of Object.entries(semverPatterns)) {
    for (const pattern of patterns) {
      allPatterns.push({ category, ...pattern });
    }
  }

  const supportMatrix = {};
  for (const patternInfo of allPatterns) {
    supportMatrix[patternInfo.pattern] = {};
    for (const manager of managersWithResults) {
      const categoryResults = results[manager][patternInfo.category];
      if (categoryResults) {
        const result = categoryResults.find(r => r.pattern === patternInfo.pattern);
        supportMatrix[patternInfo.pattern][manager] = result ? result.supported : false;
      }
    }
  }

  // Find patterns supported by all
  const universallySupported = [];
  const partiallySupported = [];
  const unsupported = [];

  for (const [pattern, support] of Object.entries(supportMatrix)) {
    const supportCount = Object.values(support).filter(s => s).length;
    const totalManagers = Object.keys(support).length;
    
    if (supportCount === totalManagers && totalManagers > 0) {
      universallySupported.push(pattern);
    } else if (supportCount > 0) {
      partiallySupported.push(pattern);
    } else {
      unsupported.push(pattern);
    }
  }

  console.log(`### Universally Supported Patterns (${universallySupported.length})\n`);
  if (universallySupported.length > 0) {
    universallySupported.forEach(p => console.log(`- \`${p}\``));
  } else {
    console.log('None');
  }

  console.log(`\n### Partially Supported Patterns (${partiallySupported.length})\n`);
  if (partiallySupported.length > 0) {
    partiallySupported.forEach(p => {
      const supported = Object.entries(supportMatrix[p])
        .filter(([m, s]) => s)
        .map(([m]) => m)
        .join(', ');
      console.log(`- \`${p}\` (supported by: ${supported})`);
    });
  } else {
    console.log('None');
  }

  console.log(`\n### Unsupported Patterns (${unsupported.length})\n`);
  if (unsupported.length > 0) {
    unsupported.forEach(p => console.log(`- \`${p}\``));
  } else {
    console.log('None');
  }

  console.log('\n## Conclusion\n');
  if (universallySupported.length === allPatterns.length) {
    console.log('✓ All tested semver patterns are universally supported across npm, yarn, and pnpm!');
  } else {
    console.log('⚠️  Not all semver patterns are universally supported.');
    console.log(`- ${universallySupported.length}/${allPatterns.length} patterns work across all package managers`);
    console.log(`- ${partiallySupported.length} patterns have partial support`);
    console.log(`- ${unsupported.length} patterns are not supported by any manager`);
  }
}

// Run the tests
testSemverSupport().catch(console.error);