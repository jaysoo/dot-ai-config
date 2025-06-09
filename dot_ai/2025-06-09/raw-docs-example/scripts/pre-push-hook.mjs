#!/usr/bin/env node

/**
 * Pre-Push Hook for Raw Docs
 * 
 * This hook detects when developers are pushing changes that might include new features
 * or modifications to existing features. It provides friendly reminders to update raw
 * documentation and offers helpful guidance.
 * 
 * This is an advisory hook (non-blocking) designed to encourage good documentation practices
 * without disrupting developer workflow.
 * 
 * Usage:
 *   This script is typically installed as a git pre-push hook via install-hook.mjs
 *   It can also be run manually: node scripts/pre-push-hook.mjs
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
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

// Configuration for different repository types
const REPO_CONFIGS = {
  nx: {
    name: 'Nx',
    featurePatterns: [
      'packages/**/*.ts',
      'packages/**/*.js', 
      'packages/**/executors/**/*',
      'packages/**/generators/**/*',
      'packages/**/migrations/**/*',
      'graph/**/*.ts',
      'graph/**/*.tsx'
    ],
    excludePatterns: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/test/**/*',
      '**/tests/**/*',
      '**/__tests__/**/*'
    ],
    rawDocsRepo: 'https://github.com/nrwl/nx-raw-docs'
  },
  ocean: {
    name: 'Ocean',
    featurePatterns: [
      'apps/**/*.ts',
      'libs/**/*.ts',
      'packages/**/*.ts'
    ],
    excludePatterns: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/test/**/*'
    ],
    rawDocsRepo: 'https://github.com/nrwl/ocean-raw-docs'
  }
};

// Utility functions
function runCommand(command, silent = true) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    }).trim();
  } catch (error) {
    return '';
  }
}

function detectRepository() {
  // Check if we're in the Nx repository
  if (existsSync(join(process.cwd(), 'packages/nx')) || 
      existsSync(join(process.cwd(), 'packages/workspace'))) {
    return 'nx';
  }
  
  // Check if we're in Ocean repository (placeholder logic)
  if (existsSync(join(process.cwd(), 'apps/ocean-ui'))) {
    return 'ocean';
  }
  
  // Default to nx configuration
  return 'nx';
}

function getChangedFiles() {
  // Get files that are different between current branch and main/master
  const mainBranch = runCommand('git symbolic-ref refs/remotes/origin/HEAD') || 'origin/main';
  const baseBranch = mainBranch.replace('refs/remotes/', '');
  
  const command = `git diff --name-only ${baseBranch}...HEAD`;
  const result = runCommand(command);
  
  if (!result) return [];
  
  return result.split('\n').filter(file => file.trim());
}

function matchesPattern(filePath, patterns) {
  return patterns.some(pattern => {
    // Simple glob matching - convert pattern to regex
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.');
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  });
}

function analyzeChanges(config) {
  const changedFiles = getChangedFiles();
  
  if (changedFiles.length === 0) {
    return { hasFeatureChanges: false, featureFiles: [], allFiles: [] };
  }
  
  const featureFiles = changedFiles.filter(file => {
    // Must match feature patterns and not match exclude patterns
    const matchesFeature = matchesPattern(file, config.featurePatterns);
    const matchesExclude = matchesPattern(file, config.excludePatterns);
    
    return matchesFeature && !matchesExclude;
  });
  
  return {
    hasFeatureChanges: featureFiles.length > 0,
    featureFiles,
    allFiles: changedFiles
  };
}

function getCommitMessages() {
  const mainBranch = runCommand('git symbolic-ref refs/remotes/origin/HEAD') || 'origin/main';
  const baseBranch = mainBranch.replace('refs/remotes/', '');
  
  const command = `git log --oneline ${baseBranch}...HEAD`;
  const result = runCommand(command);
  
  if (!result) return [];
  
  return result.split('\n').map(line => line.trim()).filter(line => line);
}

function analyzeCommitMessages(messages) {
  const featureKeywords = ['feat', 'feature', 'add', 'new', 'implement'];
  const enhancementKeywords = ['enhance', 'improve', 'update', 'upgrade'];
  
  const hasNewFeatures = messages.some(msg => 
    featureKeywords.some(keyword => msg.toLowerCase().includes(keyword))
  );
  
  const hasEnhancements = messages.some(msg =>
    enhancementKeywords.some(keyword => msg.toLowerCase().includes(keyword))
  );
  
  return { hasNewFeatures, hasEnhancements };
}

function displayBanner(config) {
  console.log(`\n${colors.cyan}╭─────────────────────────────────────────────────────╮${colors.reset}`);
  console.log(`${colors.cyan}│${colors.reset} ${colors.bright}🚀 ${config.name} Raw Docs Reminder${colors.reset}                      ${colors.cyan}│${colors.reset}`);
  console.log(`${colors.cyan}╰─────────────────────────────────────────────────────╯${colors.reset}\n`);
}

function displayFeatureChanges(analysis, config) {
  console.log(`${colors.yellow}🔍 Detected changes in feature-related files:${colors.reset}\n`);
  
  analysis.featureFiles.slice(0, 10).forEach(file => {
    console.log(`   ${colors.blue}•${colors.reset} ${file}`);
  });
  
  if (analysis.featureFiles.length > 10) {
    console.log(`   ${colors.blue}•${colors.reset} ... and ${analysis.featureFiles.length - 10} more files`);
  }
  
  console.log('');
}

function displayCommitAnalysis(commitAnalysis) {
  if (commitAnalysis.hasNewFeatures) {
    console.log(`${colors.green}✨ Detected commits that might introduce new features${colors.reset}`);
  }
  
  if (commitAnalysis.hasEnhancements) {
    console.log(`${colors.blue}🔧 Detected commits that might enhance existing features${colors.reset}`);
  }
  
  if (commitAnalysis.hasNewFeatures || commitAnalysis.hasEnhancements) {
    console.log('');
  }
}

function displayRawDocsGuidance(config) {
  console.log(`${colors.bright}📝 Consider updating raw documentation:${colors.reset}\n`);
  
  console.log(`${colors.cyan}Repository:${colors.reset} ${config.rawDocsRepo}`);
  console.log(`${colors.cyan}Purpose:${colors.reset}    Track features for documentation team\n`);
  
  console.log(`${colors.bright}Quick actions:${colors.reset}`);
  console.log(`${colors.green}1.${colors.reset} Clone raw docs: ${colors.blue}git clone ${config.rawDocsRepo}${colors.reset}`);
  console.log(`${colors.green}2.${colors.reset} Copy template:   ${colors.blue}cp TEMPLATE.md features-cli/my-feature.md${colors.reset}`);
  console.log(`${colors.green}3.${colors.reset} Fill in details and create PR\n`);
  
  console.log(`${colors.bright}For existing features:${colors.reset}`);
  console.log(`${colors.green}•${colors.reset} Update status (draft → in-progress → shipped)`);
  console.log(`${colors.green}•${colors.reset} Add implementation details and examples`);
  console.log(`${colors.green}•${colors.reset} Link to relevant PRs and issues\n`);
}

function displaySkipInstructions() {
  console.log(`${colors.yellow}💡 To skip this check in the future:${colors.reset}`);
  console.log(`   Add ${colors.blue}--no-verify${colors.reset} to your push command`);
  console.log(`   ${colors.blue}git push --no-verify${colors.reset}\n`);
}

function displayFooter() {
  console.log(`${colors.cyan}╭─────────────────────────────────────────────────────╮${colors.reset}`);
  console.log(`${colors.cyan}│${colors.reset} This is an advisory reminder - your push continues  ${colors.cyan}│${colors.reset}`);
  console.log(`${colors.cyan}│${colors.reset} Raw docs help the docs team track feature progress ${colors.cyan}│${colors.reset}`);
  console.log(`${colors.cyan}╰─────────────────────────────────────────────────────╯${colors.reset}\n`);
}

function shouldShowReminder(analysis, commitAnalysis) {
  // Show reminder if there are feature file changes OR feature-related commits
  return analysis.hasFeatureChanges || 
         commitAnalysis.hasNewFeatures || 
         commitAnalysis.hasEnhancements;
}

// Main execution
function main() {
  // Detect repository type and get appropriate configuration
  const repoType = detectRepository();
  const config = REPO_CONFIGS[repoType];
  
  // Analyze changes
  const analysis = analyzeChanges(config);
  const commitMessages = getCommitMessages();
  const commitAnalysis = analyzeCommitMessages(commitMessages);
  
  // Only show reminder if we detect feature-related changes
  if (!shouldShowReminder(analysis, commitAnalysis)) {
    // Silent success - no feature changes detected
    process.exit(0);
  }
  
  // Display the advisory reminder
  displayBanner(config);
  
  if (analysis.hasFeatureChanges) {
    displayFeatureChanges(analysis, config);
  }
  
  displayCommitAnalysis(commitAnalysis);
  displayRawDocsGuidance(config);
  displaySkipInstructions();
  displayFooter();
  
  // Exit successfully (non-blocking)
  process.exit(0);
}

// Handle direct execution vs module import
if (process.argv[1] === __filename) {
  main();
}