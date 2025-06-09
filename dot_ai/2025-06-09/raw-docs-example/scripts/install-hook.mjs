#!/usr/bin/env node

/**
 * Install Hook Script
 * 
 * This script installs the raw docs pre-push hook into a git repository.
 * It handles different repository types and provides verification and testing capabilities.
 * 
 * Usage:
 *   node scripts/install-hook.mjs [options]
 * 
 * Options:
 *   --help, -h      Show help information
 *   --verify, -v    Verify installation without installing
 *   --test, -t      Test the hook without installing
 *   --uninstall, -u Remove the hook
 *   --force, -f     Force installation even if hook exists
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, unlinkSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// Utility functions
function runCommand(command, silent = true) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      cwd: process.cwd(),
      stdio: silent ? 'pipe' : 'inherit'
    }).trim();
  } catch (error) {
    if (!silent) {
      console.error(`Command failed: ${command}`);
      console.error(error.message);
    }
    return '';
  }
}

function findGitRoot() {
  let currentDir = process.cwd();
  
  while (currentDir !== '/') {
    if (existsSync(join(currentDir, '.git'))) {
      return currentDir;
    }
    currentDir = dirname(currentDir);
  }
  
  return null;
}

function getHookPath(gitRoot) {
  return join(gitRoot, '.git', 'hooks', 'pre-push');
}

function getHookScriptPath() {
  // Resolve relative to current working directory
  return resolve(join(ROOT_DIR, 'scripts', 'pre-push-hook.mjs'));
}

// CLI handling
function showHelp() {
  console.log(`
Install Hook Script

Installs the raw docs pre-push hook into a git repository.

Usage:
  node scripts/install-hook.mjs [options]

Options:
  --help, -h        Show this help message
  --verify, -v      Verify installation status without installing
  --test, -t        Test the hook functionality without installing
  --uninstall, -u   Remove the installed hook
  --force, -f       Force installation even if hook already exists

Examples:
  node scripts/install-hook.mjs           # Install the hook
  node scripts/install-hook.mjs --verify  # Check if hook is installed
  node scripts/install-hook.mjs --test    # Test hook functionality
  node scripts/install-hook.mjs --force   # Reinstall hook
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    verify: false,
    test: false,
    uninstall: false,
    force: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--verify' || arg === '-v') {
      options.verify = true;
    } else if (arg === '--test' || arg === '-t') {
      options.test = true;
    } else if (arg === '--uninstall' || arg === '-u') {
      options.uninstall = true;
    } else if (arg === '--force' || arg === '-f') {
      options.force = true;
    } else {
      console.error(`${colors.red}Unknown option: ${arg}${colors.reset}`);
      process.exit(1);
    }
  }

  return options;
}

// Installation functions
function verifyGitRepository() {
  const gitRoot = findGitRoot();
  
  if (!gitRoot) {
    console.error(`${colors.red}❌ Error: Not in a git repository${colors.reset}`);
    console.log(`   Initialize git first: ${colors.blue}git init${colors.reset}`);
    return null;
  }
  
  console.log(`${colors.green}✅ Git repository found${colors.reset}: ${gitRoot}`);
  return gitRoot;
}

function verifyHookScript() {
  const hookScriptPath = getHookScriptPath();
  
  if (!existsSync(hookScriptPath)) {
    console.error(`${colors.red}❌ Error: Hook script not found${colors.reset}`);
    console.log(`   Expected: ${hookScriptPath}`);
    return null;
  }
  
  console.log(`${colors.green}✅ Hook script found${colors.reset}: ${hookScriptPath}`);
  return hookScriptPath;
}

function checkExistingHook(hookPath) {
  if (!existsSync(hookPath)) {
    return { exists: false };
  }
  
  try {
    const content = readFileSync(hookPath, 'utf8');
    const isRawDocsHook = content.includes('Raw Docs Reminder') || 
                         content.includes('pre-push-hook.mjs');
    
    return {
      exists: true,
      isRawDocsHook,
      content
    };
  } catch (error) {
    return {
      exists: true,
      isRawDocsHook: false,
      content: '',
      error: error.message
    };
  }
}

function createHookScript(hookPath, hookScriptPath) {
  const hookContent = `#!/bin/sh
# Raw Docs Pre-Push Hook
# Installed by install-hook.mjs

# Change to the repository root directory
cd "$(git rev-parse --show-toplevel)" || exit 1

# Run the raw docs hook script
node "${hookScriptPath}"

# Exit code from the hook script (should be 0 for advisory hooks)
exit 0
`;

  try {
    writeFileSync(hookPath, hookContent, { mode: 0o755 });
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Error writing hook file: ${error.message}${colors.reset}`);
    return false;
  }
}

function testHook(hookScriptPath) {
  console.log(`${colors.cyan}🧪 Testing hook functionality...${colors.reset}\n`);
  
  try {
    // Run the hook script directly
    runCommand(`node "${hookScriptPath}"`, false);
    console.log(`\n${colors.green}✅ Hook test completed${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`\n${colors.red}❌ Hook test failed: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main operations
function installHook(options) {
  console.log(`${colors.bright}🔧 Installing Raw Docs Pre-Push Hook${colors.reset}\n`);
  
  // Verify environment
  const gitRoot = verifyGitRepository();
  if (!gitRoot) return false;
  
  const hookScriptPath = verifyHookScript();
  if (!hookScriptPath) return false;
  
  const hookPath = getHookPath(gitRoot);
  const existing = checkExistingHook(hookPath);
  
  // Handle existing hooks
  if (existing.exists && !options.force) {
    if (existing.isRawDocsHook) {
      console.log(`${colors.yellow}⚠️  Raw docs hook is already installed${colors.reset}`);
      console.log(`   Use ${colors.blue}--force${colors.reset} to reinstall`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠️  A different pre-push hook already exists${colors.reset}`);
      console.log(`   Existing hook content preview:`);
      console.log(`   ${colors.cyan}${existing.content.split('\n')[0]}${colors.reset}`);
      console.log(`   Use ${colors.blue}--force${colors.reset} to overwrite`);
      return false;
    }
  }
  
  // Install the hook
  console.log(`${colors.blue}📝 Creating hook script...${colors.reset}`);
  
  if (!createHookScript(hookPath, hookScriptPath)) {
    return false;
  }
  
  console.log(`${colors.green}✅ Hook installed successfully${colors.reset}`);
  console.log(`   Location: ${hookPath}`);
  console.log(`   Script: ${hookScriptPath}\n`);
  
  // Test the installation
  console.log(`${colors.blue}🧪 Testing installation...${colors.reset}`);
  if (testHook(hookScriptPath)) {
    console.log(`\n${colors.green}🎉 Installation complete!${colors.reset}`);
    console.log(`   The hook will now run on ${colors.blue}git push${colors.reset}`);
    console.log(`   To bypass: ${colors.blue}git push --no-verify${colors.reset}`);
    return true;
  } else {
    console.log(`\n${colors.yellow}⚠️  Installation completed but test failed${colors.reset}`);
    console.log(`   The hook may still work during actual pushes`);
    return true;
  }
}

function verifyInstallation() {
  console.log(`${colors.bright}🔍 Verifying Raw Docs Hook Installation${colors.reset}\n`);
  
  const gitRoot = verifyGitRepository();
  if (!gitRoot) return false;
  
  const hookPath = getHookPath(gitRoot);
  const existing = checkExistingHook(hookPath);
  
  if (!existing.exists) {
    console.log(`${colors.red}❌ No pre-push hook installed${colors.reset}`);
    console.log(`   Run without ${colors.blue}--verify${colors.reset} to install`);
    return false;
  }
  
  if (existing.isRawDocsHook) {
    console.log(`${colors.green}✅ Raw docs hook is properly installed${colors.reset}`);
    
    // Verify the hook script exists
    const hookScriptPath = getHookScriptPath();
    if (existsSync(hookScriptPath)) {
      console.log(`${colors.green}✅ Hook script is accessible${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠️  Hook script not found at expected location${colors.reset}`);
      console.log(`   Expected: ${hookScriptPath}`);
    }
    
    return true;
  } else {
    console.log(`${colors.yellow}⚠️  A different pre-push hook is installed${colors.reset}`);
    console.log(`   Not the raw docs hook`);
    return false;
  }
}

function uninstallHook() {
  console.log(`${colors.bright}🗑️  Uninstalling Raw Docs Pre-Push Hook${colors.reset}\n`);
  
  const gitRoot = verifyGitRepository();
  if (!gitRoot) return false;
  
  const hookPath = getHookPath(gitRoot);
  const existing = checkExistingHook(hookPath);
  
  if (!existing.exists) {
    console.log(`${colors.yellow}⚠️  No pre-push hook found${colors.reset}`);
    return true;
  }
  
  if (!existing.isRawDocsHook) {
    console.log(`${colors.yellow}⚠️  Pre-push hook exists but is not a raw docs hook${colors.reset}`);
    console.log(`   Will not remove non-raw-docs hooks`);
    return false;
  }
  
  try {
    unlinkSync(hookPath);
    console.log(`${colors.green}✅ Raw docs hook removed successfully${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Error removing hook: ${error.message}${colors.reset}`);
    return false;
  }
}

function testHookFunctionality() {
  console.log(`${colors.bright}🧪 Testing Raw Docs Hook Functionality${colors.reset}\n`);
  
  const hookScriptPath = verifyHookScript();
  if (!hookScriptPath) return false;
  
  return testHook(hookScriptPath);
}

// Main execution
function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  let success = false;
  
  if (options.verify) {
    success = verifyInstallation();
  } else if (options.test) {
    success = testHookFunctionality();
  } else if (options.uninstall) {
    success = uninstallHook();
  } else {
    success = installHook(options);
  }
  
  process.exit(success ? 0 : 1);
}

// Run the script
main();