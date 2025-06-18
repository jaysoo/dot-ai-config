#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const scriptPath = join(__dirname, '../../../scripts/analyze-changes.mjs');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runTest(description, command, expectedPattern) {
  log(`\nTesting: ${description}`, colors.blue);
  log(`Command: ${command}`, colors.yellow);
  
  try {
    const output = execSync(command, { encoding: 'utf8' });
    
    if (expectedPattern && !output.includes(expectedPattern)) {
      log(`✗ Failed: Expected to find "${expectedPattern}" in output`, colors.red);
      return false;
    }
    
    log('✓ Passed', colors.green);
    console.log('Output preview:');
    console.log(output.split('\n').slice(0, 15).join('\n'));
    return true;
  } catch (e) {
    log(`✗ Failed with error: ${e.message}`, colors.red);
    return false;
  }
}

function getCurrentGitUser() {
  try {
    return execSync('git config user.name', { encoding: 'utf8' }).trim();
  } catch (e) {
    log('Could not get current git user', colors.red);
    return null;
  }
}

// Run tests
log('=== Author Filter Test Suite ===', colors.blue);

const currentUser = getCurrentGitUser();
if (!currentUser) {
  log('Cannot run tests without git user configured', colors.red);
  process.exit(1);
}

log(`Current git user: ${currentUser}`, colors.yellow);

// Test 1: Default behavior (current user only)
runTest(
  'Default behavior - should show only current user commits',
  `node ${scriptPath} --since HEAD~10`,
  `Commits from: ${currentUser}`
);

// Test 2: Specific author
runTest(
  'Specific author via --author flag',
  `node ${scriptPath} --since HEAD~10 --author "Test User"`,
  'Commits from: Test User'
);

// Test 3: Wildcard to show all
runTest(
  'Wildcard "*" shows all commits',
  `node ${scriptPath} --since HEAD~10 --author "*"`,
  'Commits from: all authors'
);

// Test 4: Help text includes new option
runTest(
  'Help text includes --author option',
  `node ${scriptPath} --help`,
  '--author <name>'
);

// Test 5: Author with special characters
runTest(
  'Author with special characters (apostrophe)',
  `node ${scriptPath} --since HEAD~10 --author "O'Reilly"`,
  "Commits from: O'Reilly"
);

log('\n=== Test Suite Complete ===', colors.blue);