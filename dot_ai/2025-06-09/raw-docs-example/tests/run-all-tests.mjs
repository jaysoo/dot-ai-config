#!/usr/bin/env node

/**
 * Main Test Runner for Raw Docs System
 * 
 * Orchestrates all test suites and provides comprehensive reporting.
 */

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test configuration
const TEST_SUITES = [
  {
    name: 'Developer Check Script Tests',
    script: 'test-developer-check.mjs',
    description: 'Tests git history analysis, CODEOWNERS parsing, and developer field updates'
  },
  {
    name: 'Pre-Push Hook Tests',
    script: 'test-pre-push-hook.mjs',
    description: 'Tests repository detection, file pattern matching, and hook logic'
  }
];

function runCommand(command, silent = true) {
  try {
    const result = execSync(command, { 
      encoding: 'utf8',
      cwd: __dirname,
      stdio: silent ? 'pipe' : 'inherit'
    });
    return { success: true, output: result };
  } catch (error) {
    return { 
      success: false, 
      output: error.stdout || '', 
      error: error.stderr || error.message 
    };
  }
}

function displayBanner() {
  log(`\n${colors.cyan}╭─────────────────────────────────────────────────────╮${colors.reset}`);
  log(`${colors.cyan}│${colors.reset} ${colors.bright}🧪 Raw Docs System Test Suite${colors.reset}                  ${colors.cyan}│${colors.reset}`);
  log(`${colors.cyan}╰─────────────────────────────────────────────────────╯${colors.reset}\n`);
}

function displayTestSuiteHeader(suite) {
  log(`${colors.bright}${suite.name}${colors.reset}`, 'blue');
  log(`${colors.cyan}Description:${colors.reset} ${suite.description}`);
  log(`${colors.cyan}Script:${colors.reset} ${suite.script}\n`);
}

function runTestSuite(suite) {
  displayTestSuiteHeader(suite);
  
  const scriptPath = join(__dirname, suite.script);
  const result = runCommand(`node "${scriptPath}"`);
  
  if (result.success) {
    log(`✅ ${suite.name} - PASSED\n`, 'green');
    return { success: true, output: result.output };
  } else {
    log(`❌ ${suite.name} - FAILED\n`, 'red');
    if (result.error) {
      log(`Error output:`, 'red');
      log(result.error, 'red');
    }
    return { success: false, output: result.output, error: result.error };
  }
}

function displaySummary(results) {
  const passed = results.filter(r => r.success).length;
  const failed = results.length - passed;
  
  log(`${colors.cyan}╭─────────────────────────────────────────────────────╮${colors.reset}`);
  log(`${colors.cyan}│${colors.reset} ${colors.bright}📊 Test Summary${colors.reset}                               ${colors.cyan}│${colors.reset}`);
  log(`${colors.cyan}╰─────────────────────────────────────────────────────╯${colors.reset}\n`);
  
  log(`Total Test Suites: ${results.length}`);
  log(`Passed: ${passed}`, passed > 0 ? 'green' : 'reset');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'reset');
  
  if (failed === 0) {
    log(`\n🎉 All test suites passed!`, 'green');
    log(`The Raw Docs system is working correctly.`, 'green');
  } else {
    log(`\n❌ ${failed} test suite(s) failed`, 'red');
    log(`Please review the failed tests above.`, 'red');
  }
  
  return failed === 0;
}

function displayUsageInfo() {
  log(`\n${colors.bright}Next Steps:${colors.reset}`);
  log(`${colors.cyan}1.${colors.reset} Test the scripts manually:`);
  log(`   ${colors.blue}node scripts/check-developers.mjs --help${colors.reset}`);
  log(`   ${colors.blue}node scripts/install-hook.mjs --help${colors.reset}`);
  log('');
  log(`${colors.cyan}2.${colors.reset} Install the pre-push hook:`);
  log(`   ${colors.blue}node scripts/install-hook.mjs${colors.reset}`);
  log('');
  log(`${colors.cyan}3.${colors.reset} Test with real documentation:`);
  log(`   ${colors.blue}node scripts/check-developers.mjs --dry-run${colors.reset}`);
  log('');
  log(`${colors.cyan}4.${colors.reset} Create a new feature documentation:`);
  log(`   ${colors.blue}cp TEMPLATE.md features-cli/my-feature.md${colors.reset}`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    verbose: false,
    suite: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--verbose' || arg === '-v') {
      options.verbose = true;
    } else if (arg === '--suite' || arg === '-s') {
      options.suite = args[++i];
    } else {
      log(`Unknown option: ${arg}`, 'red');
      process.exit(1);
    }
  }

  return options;
}

function showHelp() {
  log(`
Raw Docs Test Runner

Runs all test suites for the Raw Docs system.

Usage:
  node tests/run-all-tests.mjs [options]

Options:
  --help, -h       Show this help message
  --verbose, -v    Show detailed output from test suites
  --suite, -s      Run specific test suite by script name

Examples:
  node tests/run-all-tests.mjs                    # Run all tests
  node tests/run-all-tests.mjs --verbose          # Run with detailed output
  node tests/run-all-tests.mjs --suite test-developer-check.mjs

Available Test Suites:
${TEST_SUITES.map(suite => `  - ${suite.script}: ${suite.description}`).join('\n')}
`);
}

// Main execution
function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  displayBanner();
  
  let suitesToRun = TEST_SUITES;
  
  if (options.suite) {
    suitesToRun = TEST_SUITES.filter(suite => suite.script === options.suite);
    if (suitesToRun.length === 0) {
      log(`❌ Test suite '${options.suite}' not found`, 'red');
      log(`Available suites: ${TEST_SUITES.map(s => s.script).join(', ')}`);
      process.exit(1);
    }
  }
  
  const results = [];
  
  for (const suite of suitesToRun) {
    const result = runTestSuite(suite);
    results.push(result);
    
    if (options.verbose && result.output) {
      log('Test output:', 'cyan');
      log(result.output);
      log('');
    }
  }
  
  const success = displaySummary(results);
  
  if (success && !options.suite) {
    displayUsageInfo();
  }
  
  process.exit(success ? 0 : 1);
}

// Run the test runner
main();