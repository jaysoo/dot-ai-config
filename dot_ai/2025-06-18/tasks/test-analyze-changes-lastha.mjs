#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, colors.green);
}

function error(message) {
  log(`✗ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ ${message}`, colors.blue);
}

// Test scenarios
async function runTests() {
  console.log(`\n${colors.bright}Testing analyze-changes.mjs lastSha functionality${colors.reset}\n`);

  const scriptPath = join(process.cwd(), 'scripts', 'analyze-changes.mjs');
  
  if (!existsSync(scriptPath)) {
    error('analyze-changes.mjs not found. Run this from the raw-docs root directory.');
    process.exit(1);
  }

  // Test 1: Help text shows lastSha information
  console.log(`\n${colors.bright}Test 1: Help text includes lastSha information${colors.reset}`);
  try {
    const helpOutput = execSync(`node ${scriptPath} --help`, { encoding: 'utf8' });
    if (helpOutput.includes('lastSha from .rawdocs.local.json')) {
      success('Help text mentions lastSha functionality');
    } else {
      error('Help text does not mention lastSha');
    }
  } catch (e) {
    error(`Failed to run help: ${e.message}`);
  }

  // Test 2: Create a temporary test directory
  const testDir = join(tmpdir(), `raw-docs-test-${Date.now()}`);
  mkdirSync(testDir, { recursive: true });
  
  console.log(`\n${colors.bright}Test 2: Test with .rawdocs.local.json containing lastSha${colors.reset}`);
  try {
    // Create test config files
    const rawDocsConfig = {
      repository: "test-repo",
      patterns: {
        include: ["**/*.js"],
        exclude: ["node_modules/**"]
      }
    };
    
    const rawDocsLocalConfig = {
      rawDocsPath: process.cwd(),
      lastSha: "abc123def456"
    };
    
    writeFileSync(join(testDir, '.rawdocs.json'), JSON.stringify(rawDocsConfig, null, 2));
    writeFileSync(join(testDir, '.rawdocs.local.json'), JSON.stringify(rawDocsLocalConfig, null, 2));
    
    // Run the script from test directory (it should fail because it's not a git repo, but we can check the output)
    try {
      execSync(`cd ${testDir} && node ${scriptPath}`, { encoding: 'utf8' });
    } catch (e) {
      const output = e.stdout || e.message;
      if (output.includes('Using lastSha from .rawdocs.local.json: abc123def456')) {
        success('Script correctly reads lastSha from config');
      } else {
        error('Script did not use lastSha from config');
        console.log('Output:', output);
      }
    }
  } catch (e) {
    error(`Test 2 failed: ${e.message}`);
  }

  // Test 3: Test without lastSha in config
  console.log(`\n${colors.bright}Test 3: Test without lastSha (should default to HEAD~1)${colors.reset}`);
  try {
    // Update config without lastSha
    const rawDocsLocalConfig = {
      rawDocsPath: process.cwd()
    };
    
    writeFileSync(join(testDir, '.rawdocs.local.json'), JSON.stringify(rawDocsLocalConfig, null, 2));
    
    // Run the script again
    try {
      execSync(`cd ${testDir} && node ${scriptPath}`, { encoding: 'utf8' });
    } catch (e) {
      const output = e.stdout || e.message;
      if (!output.includes('Using lastSha from .rawdocs.local.json')) {
        success('Script correctly falls back to HEAD~1 when no lastSha');
      } else {
        error('Script incorrectly reported using lastSha');
      }
    }
  } catch (e) {
    error(`Test 3 failed: ${e.message}`);
  }

  // Test 4: Test command-line override
  console.log(`\n${colors.bright}Test 4: Test command-line override of lastSha${colors.reset}`);
  try {
    // Put lastSha back
    const rawDocsLocalConfig = {
      rawDocsPath: process.cwd(),
      lastSha: "abc123def456"
    };
    
    writeFileSync(join(testDir, '.rawdocs.local.json'), JSON.stringify(rawDocsLocalConfig, null, 2));
    
    // Run with explicit --since
    try {
      execSync(`cd ${testDir} && node ${scriptPath} --since HEAD~5`, { encoding: 'utf8' });
    } catch (e) {
      const output = e.stdout || e.message;
      if (output.includes('Using lastSha from .rawdocs.local.json: abc123def456')) {
        error('Command-line argument did not override lastSha');
      } else if (output.includes('Invalid base commit: HEAD~5')) {
        success('Command-line argument correctly overrides lastSha');
      }
    }
  } catch (e) {
    error(`Test 4 failed: ${e.message}`);
  }

  // Test 5: Test in actual git repository
  console.log(`\n${colors.bright}Test 5: Test in actual git repository (current directory)${colors.reset}`);
  try {
    // Check if we have a local config
    const localConfigPath = join(process.cwd(), '.rawdocs.local.json');
    let originalConfig = null;
    
    if (existsSync(localConfigPath)) {
      originalConfig = readFileSync(localConfigPath, 'utf8');
      info('Backing up existing .rawdocs.local.json');
    }
    
    // Create a test config
    const testConfig = {
      rawDocsPath: process.cwd(),
      lastSha: "HEAD~2"
    };
    
    writeFileSync(localConfigPath, JSON.stringify(testConfig, null, 2));
    
    // Run the analysis
    const output = execSync(`node ${scriptPath}`, { encoding: 'utf8' });
    
    if (output.includes('Using lastSha from .rawdocs.local.json: HEAD~2')) {
      success('Successfully used lastSha from config in real repository');
    }
    
    // Check if lastSha was updated
    const updatedConfig = JSON.parse(readFileSync(localConfigPath, 'utf8'));
    const currentHead = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    
    if (updatedConfig.lastSha === currentHead) {
      success('Successfully updated lastSha to current HEAD');
    } else {
      error('Failed to update lastSha to current HEAD');
    }
    
    // Restore original config if it existed
    if (originalConfig) {
      writeFileSync(localConfigPath, originalConfig);
      info('Restored original .rawdocs.local.json');
    } else {
      rmSync(localConfigPath);
      info('Removed test .rawdocs.local.json');
    }
    
  } catch (e) {
    error(`Test 5 failed: ${e.message}`);
  }

  // Cleanup
  console.log(`\n${colors.bright}Cleanup${colors.reset}`);
  try {
    rmSync(testDir, { recursive: true, force: true });
    success('Cleaned up test directory');
  } catch (e) {
    error(`Failed to clean up test directory: ${e.message}`);
  }

  console.log(`\n${colors.bright}Testing complete!${colors.reset}\n`);
}

// Run tests
runTests().catch(e => {
  error(`Test suite failed: ${e.message}`);
  process.exit(1);
});