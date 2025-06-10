#!/usr/bin/env node

/**
 * Developer Check Script
 * 
 * This script analyzes git history and CODEOWNERS to keep developer information
 * current in raw documentation files. It updates the 'Developers' field based on
 * recent contributions and ownership patterns.
 * 
 * Usage:
 *   node scripts/check-developers.mjs [options]
 * 
 * Options:
 *   --help, -h     Show help information
 *   --dry-run, -d  Show what would be updated without making changes
 *   --file, -f     Check specific file instead of all feature docs
 *   --days, -n     Number of days to look back for git history (default: 90)
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

const CONFIG = {
  daysBack: 90,
  minCommits: 2,
  excludePatterns: ['.gitkeep', 'TEMPLATE.md', 'README.md', 'ARCHIVED.md', 'CONTRIBUTING.md'],
  featureDirs: ['features-cli', 'features-cloud']
};

// CLI handling
function showHelp() {
  console.log(`
Developer Check Script

Analyzes git history and CODEOWNERS to update developer information in feature documentation.

Usage:
  node scripts/check-developers.mjs [options]

Options:
  --help, -h       Show this help message
  --dry-run, -d    Show what would be updated without making changes
  --file, -f FILE  Check specific file instead of all feature docs
  --days, -n DAYS  Number of days to look back for git history (default: 90)

Examples:
  node scripts/check-developers.mjs
  node scripts/check-developers.mjs --dry-run
  node scripts/check-developers.mjs --file features-cli/project-crystal.md
  node scripts/check-developers.mjs --days 180
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    help: false,
    dryRun: false,
    file: null,
    days: CONFIG.daysBack
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
    } else if (arg === '--file' || arg === '-f') {
      options.file = args[++i];
    } else if (arg === '--days' || arg === '-n') {
      options.days = parseInt(args[++i]) || CONFIG.daysBack;
    } else {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    }
  }

  return options;
}

// Utility functions
function runCommand(command, silent = true) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      cwd: ROOT_DIR,
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

function findFeatureFiles(specificFile = null) {
  if (specificFile) {
    return [specificFile];
  }

  const files = [];
  
  for (const dir of CONFIG.featureDirs) {
    const dirPath = join(ROOT_DIR, dir);
    try {
      const entries = readdirSync(dirPath);
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        if (statSync(fullPath).isFile() && 
            entry.endsWith('.md') && 
            !CONFIG.excludePatterns.includes(entry)) {
          files.push(join(dir, entry));
        }
      }
    } catch (error) {
      console.warn(`Could not read directory ${dir}: ${error.message}`);
    }
  }
  
  return files;
}

function parseMarkdownMetadata(content) {
  const lines = content.split('\n');
  let inMetadata = false;
  let developersLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '## Metadata') {
      inMetadata = true;
      continue;
    }
    
    if (inMetadata && line.startsWith('##')) {
      break;
    }
    
    if (inMetadata && line.startsWith('**Developers**:')) {
      developersLine = i;
      break;
    }
  }
  
  return { lines, developersLine };
}

// Core analysis functions
function getGitContributors(filePath, days) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  const since = sinceDate.toISOString().split('T')[0];
  
  const command = `git log --since="${since}" --format="%ae" --follow -- "${filePath}"`;
  const result = runCommand(command);
  
  if (!result) return [];
  
  const emails = result.split('\n').filter(email => email.trim());
  const emailCounts = {};
  
  emails.forEach(email => {
    emailCounts[email] = (emailCounts[email] || 0) + 1;
  });
  
  // Convert emails to GitHub usernames (simplified - would need mapping in real implementation)
  const contributors = Object.entries(emailCounts)
    .filter(([email, count]) => count >= CONFIG.minCommits)
    .map(([email]) => emailToUsername(email))
    .filter(username => username);
    
  return [...new Set(contributors)]; // Remove duplicates
}

function emailToUsername(email) {
  // This is a simplified mapping - in real implementation, you'd want a proper
  // email-to-GitHub-username mapping system
  const knownMappings = {
    'victor@nrwl.io': 'vsavkin',
    'jack@nrwl.io': 'jaysoo', 
    'marine@nrwl.io': 'AgentMarine',
    'chau@nrwl.io': 'FrozenPandaz'
  };
  
  if (knownMappings[email]) {
    return knownMappings[email];
  }
  
  // Try to extract username from email
  const username = email.split('@')[0];
  if (username && username.length > 2) {
    return username;
  }
  
  return null;
}

function getCodeownersInfo(filePath) {
  const codeownersPath = join(ROOT_DIR, '../../CODEOWNERS'); // Assuming CODEOWNERS is in repo root
  
  try {
    const content = readFileSync(codeownersPath, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.trim().startsWith('#') || !line.trim()) continue;
      
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2) continue;
      
      const pattern = parts[0];
      const owners = parts.slice(1);
      
      // Simple pattern matching - would need more sophisticated matching in real implementation
      if (filePath.includes(pattern.replace('*', '')) || pattern === '*') {
        return owners.map(owner => owner.replace('@', ''));
      }
    }
  } catch (error) {
    console.warn(`Could not read CODEOWNERS: ${error.message}`);
  }
  
  return [];
}

function updateDeveloperField(lines, developersLine, newDevelopers) {
  if (developersLine === -1) {
    console.warn('Could not find Developers field in metadata');
    return lines;
  }
  
  const developersList = newDevelopers.map(dev => `@${dev}`).join(', ');
  lines[developersLine] = `**Developers**: ${developersList}`;
  
  return lines;
}

// Main execution
function checkFile(filePath, options) {
  console.log(`Checking ${filePath}...`);
  
  const fullPath = join(ROOT_DIR, filePath);
  
  try {
    const content = readFileSync(fullPath, 'utf8');
    const { lines, developersLine } = parseMarkdownMetadata(content);
    
    if (developersLine === -1) {
      console.log(`  ⚠️  No Developers field found in metadata`);
      return;
    }
    
    // Get current developers
    const currentLine = lines[developersLine];
    const currentDevelopers = currentLine
      .replace('**Developers**:', '')
      .split(',')
      .map(dev => dev.trim().replace('@', ''))
      .filter(dev => dev);
    
    // Analyze git history and CODEOWNERS
    const gitContributors = getGitContributors(filePath, options.days);
    const codeowners = getCodeownersInfo(filePath);
    
    // Combine and deduplicate
    const allDevelopers = [...new Set([...gitContributors, ...codeowners])];
    
    console.log(`  Current: ${currentDevelopers.join(', ') || 'none'}`);
    console.log(`  Git contributors (${options.days} days): ${gitContributors.join(', ') || 'none'}`);
    console.log(`  CODEOWNERS: ${codeowners.join(', ') || 'none'}`);
    console.log(`  Suggested: ${allDevelopers.join(', ') || 'none'}`);
    
    // Check if update is needed
    const needsUpdate = !arraysEqual(currentDevelopers.sort(), allDevelopers.sort());
    
    if (!needsUpdate) {
      console.log(`  ✅ No update needed`);
      return;
    }
    
    if (options.dryRun) {
      console.log(`  🔍 Would update developers to: ${allDevelopers.join(', ')}`);
      return;
    }
    
    // Update the file
    const updatedLines = updateDeveloperField(lines, developersLine, allDevelopers);
    const updatedContent = updatedLines.join('\n');
    
    writeFileSync(fullPath, updatedContent, 'utf8');
    console.log(`  ✅ Updated developers to: ${allDevelopers.join(', ')}`);
    
  } catch (error) {
    console.error(`  ❌ Error processing ${filePath}: ${error.message}`);
  }
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

function main() {
  const options = parseArgs();
  
  if (options.help) {
    showHelp();
    return;
  }
  
  console.log('🔍 Checking developer information in feature documentation...\n');
  
  if (options.dryRun) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  const files = findFeatureFiles(options.file);
  
  if (files.length === 0) {
    console.log('No feature files found to check.');
    return;
  }
  
  for (const file of files) {
    checkFile(file, options);
    console.log('');
  }
  
  console.log('✅ Developer check completed.');
}

// Run the script
main();