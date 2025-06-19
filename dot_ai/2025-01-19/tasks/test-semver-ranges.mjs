#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

const testDir = './semver-test';
const managers = ['npm', 'yarn', 'pnpm'];

// Semver patterns to test
const semverPatterns = {
  'Caret Ranges': [
    { pattern: '^1.2.3', description: 'Compatible with version' },
    { pattern: '^0.2.3', description: 'Pre-1.0 compatible' },
    { pattern: '^0.0.3', description: 'Pre-0.1 compatible' }
  ],
  'Tilde Ranges': [
    { pattern: '~1.2.3', description: 'Approximately equivalent' },
    { pattern: '~1.2', description: 'Same minor version' },
    { pattern: '~1', description: 'Same major version' }
  ],
  'Comparison Ranges': [
    { pattern: '>1.2.3', description: 'Greater than' },
    { pattern: '>=1.2.3', description: 'Greater than or equal' },
    { pattern: '<2.0.0', description: 'Less than' },
    { pattern: '<=1.2.3', description: 'Less than or equal' }
  ],
  'Hyphen Ranges': [
    { pattern: '1.2.3 - 2.3.4', description: 'Range between versions' }
  ],
  'X-Ranges': [
    { pattern: '1.2.x', description: 'Any patch version' },
    { pattern: '1.x', description: 'Any minor/patch version' },
    { pattern: '*', description: 'Any version' }
  ],
  'Compound Ranges': [
    { pattern: '>=1.2.3 <2.0.0', description: 'AND condition' },
    { pattern: '1.2.3 || >=2.0.0', description: 'OR condition' }
  ],
  'Pre-release Tags': [
    { pattern: '1.2.3-alpha', description: 'Specific pre-release' },
    { pattern: '^1.2.3-beta.1', description: 'Pre-release with caret' }
  ]
};

// Test package to use (lodash is widely available)
const testPackage = 'lodash';

async function testSemverSupport() {
  console.log('# Semver Range Support Investigation\n');
  console.log(`Testing with package: ${testPackage}\n`);

  const results = {};

  for (const manager of managers) {
    console.log(`\n## Testing ${manager.toUpperCase()}\n`);
    results[manager] = {};

    for (const [category, patterns] of Object.entries(semverPatterns)) {
      console.log(`\n### ${category}\n`);
      results[manager][category] = [];

      for (const { pattern, description } of patterns) {
        const result = await testPattern(manager, pattern, description);
        results[manager][category].push(result);
      }
    }
  }

  // Generate comparison report
  generateReport(results);
}

async function testPattern(manager, pattern, description) {
  const testSubDir = join(testDir, `${manager}-test`);
  
  try {
    // Clean up and create test directory
    if (existsSync(testSubDir)) {
      rmSync(testSubDir, { recursive: true });
    }
    mkdirSync(testSubDir, { recursive: true });

    // Create package.json with the pattern
    const packageJson = {
      name: `semver-test-${manager}`,
      version: '1.0.0',
      dependencies: {
        [testPackage]: pattern
      }
    };

    writeFileSync(
      join(testSubDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Try to install
    console.log(`Testing: "${pattern}" - ${description}`);
    
    let installCmd;
    switch (manager) {
      case 'npm':
        installCmd = 'npm install --no-save --no-audit --no-fund';
        break;
      case 'yarn':
        installCmd = 'yarn install --no-lockfile';
        break;
      case 'pnpm':
        installCmd = 'pnpm install --no-lockfile';
        break;
    }

    execSync(installCmd, { 
      cwd: testSubDir,
      stdio: 'pipe'
    });

    console.log(`✓ Success: ${pattern} is supported`);
    
    // Try to get resolved version
    let resolvedVersion = 'N/A';
    try {
      if (manager === 'npm') {
        const output = execSync('npm list --depth=0 --json', { cwd: testSubDir }).toString();
        const parsed = JSON.parse(output);
        resolvedVersion = parsed.dependencies?.[testPackage]?.version || 'N/A';
      }
    } catch (e) {
      // Ignore errors in version resolution
    }

    return {
      pattern,
      description,
      supported: true,
      resolvedVersion,
      error: null
    };

  } catch (error) {
    console.log(`✗ Failed: ${pattern} - ${error.message.split('\n')[0]}`);
    return {
      pattern,
      description,
      supported: false,
      resolvedVersion: null,
      error: error.message.split('\n')[0]
    };
  } finally {
    // Clean up
    if (existsSync(testSubDir)) {
      rmSync(testSubDir, { recursive: true });
    }
  }
}

function generateReport(results) {
  console.log('\n\n# Comparison Matrix\n');
  console.log('| Pattern | Description | npm | yarn | pnpm |');
  console.log('|---------|-------------|-----|------|------|');

  for (const [category, patterns] of Object.entries(semverPatterns)) {
    console.log(`| **${category}** | | | | |`);
    
    for (let i = 0; i < patterns.length; i++) {
      const { pattern, description } = patterns[i];
      const npmResult = results.npm[category][i];
      const yarnResult = results.yarn[category][i];
      const pnpmResult = results.pnpm[category][i];

      const npmStatus = npmResult.supported ? '✓' : '✗';
      const yarnStatus = yarnResult.supported ? '✓' : '✗';
      const pnpmStatus = pnpmResult.supported ? '✓' : '✗';

      console.log(`| \`${pattern}\` | ${description} | ${npmStatus} | ${yarnStatus} | ${pnpmStatus} |`);
    }
  }

  // Summary
  console.log('\n## Summary\n');
  const allSupported = managers.every(manager => {
    return Object.values(results[manager]).every(category =>
      category.every(result => result.supported)
    );
  });

  if (allSupported) {
    console.log('✓ All tested semver patterns are supported by npm, yarn, and pnpm!');
  } else {
    console.log('⚠️  Some semver patterns showed differences between package managers.');
    console.log('\n### Failures:\n');
    
    for (const manager of managers) {
      const failures = [];
      for (const [category, patterns] of Object.entries(results[manager])) {
        for (const result of patterns) {
          if (!result.supported) {
            failures.push(`- ${result.pattern}: ${result.error}`);
          }
        }
      }
      
      if (failures.length > 0) {
        console.log(`**${manager}:**`);
        failures.forEach(f => console.log(f));
        console.log();
      }
    }
  }
}

// Clean up any existing test directory
if (existsSync(testDir)) {
  rmSync(testDir, { recursive: true });
}

// Run the tests
testSemverSupport().catch(console.error).finally(() => {
  // Final cleanup
  if (existsSync(testDir)) {
    rmSync(testDir, { recursive: true });
  }
});