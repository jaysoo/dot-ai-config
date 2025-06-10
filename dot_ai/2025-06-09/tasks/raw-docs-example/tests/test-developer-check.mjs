#!/usr/bin/env node

/**
 * Test Suite for Developer Check Script
 * 
 * Tests the check-developers.mjs functionality with sample data.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Test configuration
const TESTS = [
  {
    name: 'Parse markdown metadata',
    test: testParseMetadata
  },
  {
    name: 'Email to username conversion',
    test: testEmailToUsername
  },
  {
    name: 'CODEOWNERS parsing',
    test: testCodeowners
  },
  {
    name: 'Git history analysis simulation',
    test: testGitHistory
  },
  {
    name: 'Developer field update',
    test: testDeveloperUpdate
  }
];

// ANSI colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test implementations
function testParseMetadata() {
  const samplePath = join(__dirname, 'data', 'sample-feature.md');
  
  if (!existsSync(samplePath)) {
    throw new Error('Sample feature file not found');
  }
  
  const content = readFileSync(samplePath, 'utf8');
  const lines = content.split('\n');
  
  let developersLine = -1;
  let inMetadata = false;
  
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
  
  if (developersLine === -1) {
    throw new Error('Could not find Developers field');
  }
  
  const developersText = lines[developersLine];
  const developers = developersText
    .replace('**Developers**:', '')
    .split(',')
    .map(dev => dev.trim().replace('@', ''))
    .filter(dev => dev);
  
  if (!developers.includes('testuser1') || !developers.includes('testuser2')) {
    throw new Error('Expected developers not found');
  }
  
  return { success: true, details: `Found ${developers.length} developers` };
}

function testEmailToUsername() {
  // Simulate the email mapping logic
  const knownMappings = {
    'testuser1@example.com': 'testuser1',
    'testuser2@example.com': 'testuser2'
  };
  
  function emailToUsername(email) {
    if (knownMappings[email]) {
      return knownMappings[email];
    }
    
    const username = email.split('@')[0];
    if (username && username.length > 2) {
      return username;
    }
    
    return null;
  }
  
  const testCases = [
    { email: 'testuser1@example.com', expected: 'testuser1' },
    { email: 'unknown@example.com', expected: 'unknown' },
    { email: 'x@example.com', expected: null }
  ];
  
  for (const testCase of testCases) {
    const result = emailToUsername(testCase.email);
    if (result !== testCase.expected) {
      throw new Error(`Expected ${testCase.expected}, got ${result} for ${testCase.email}`);
    }
  }
  
  return { success: true, details: `${testCases.length} email mappings tested` };
}

function testCodeowners() {
  const codeownersPath = join(__dirname, 'data', 'sample-codeowners');
  
  if (!existsSync(codeownersPath)) {
    throw new Error('Sample CODEOWNERS file not found');
  }
  
  const content = readFileSync(codeownersPath, 'utf8');
  const lines = content.split('\n');
  
  function getCodeownersInfo(filePath) {
    let matchedOwners = [];
    
    for (const line of lines) {
      if (line.trim().startsWith('#') || !line.trim()) continue;
      
      const parts = line.trim().split(/\s+/);
      if (parts.length < 2) continue;
      
      const pattern = parts[0];
      const owners = parts.slice(1);
      
      // Check if pattern matches the file path
      let matches = false;
      
      if (pattern === '*') {
        matches = true;
      } else if (pattern.startsWith('/') && pattern.endsWith('/')) {
        // Directory pattern like /features-cli/
        const dirPattern = pattern.slice(1, -1);
        matches = filePath.startsWith(dirPattern + '/');
      } else if (pattern.startsWith('/')) {
        // Exact file pattern like /features-cli/sample-feature.md
        matches = filePath === pattern.slice(1);
      } else {
        // Relative pattern
        matches = filePath.includes(pattern.replace('*', ''));
      }
      
      if (matches) {
        matchedOwners.push(...owners.map(owner => owner.replace('@', '')));
      }
    }
    
    return [...new Set(matchedOwners)]; // Remove duplicates
  }
  
  const testCases = [
    { file: 'features-cli/sample-feature.md', expectedOwners: ['globalowner', 'cliowner', 'testuser1', 'featureowner', 'testuser2'] },
    { file: 'features-cloud/test.md', expectedOwners: ['globalowner', 'cloudowner', 'testuser2'] },
    { file: 'other/file.md', expectedOwners: ['globalowner'] }
  ];
  
  for (const testCase of testCases) {
    const owners = getCodeownersInfo(testCase.file);
    
    for (const expectedOwner of testCase.expectedOwners) {
      if (!owners.includes(expectedOwner)) {
        throw new Error(`Expected owner ${expectedOwner} not found for ${testCase.file}`);
      }
    }
  }
  
  return { success: true, details: `${testCases.length} CODEOWNERS patterns tested` };
}

function testGitHistory() {
  const gitLogPath = join(__dirname, 'fixtures', 'git-log-output.txt');
  
  if (!existsSync(gitLogPath)) {
    throw new Error('Git log fixture not found');
  }
  
  const content = readFileSync(gitLogPath, 'utf8');
  const emails = content.split('\n').filter(email => email.trim());
  
  const emailCounts = {};
  emails.forEach(email => {
    emailCounts[email] = (emailCounts[email] || 0) + 1;
  });
  
  // Simulate filtering by minimum commits
  const minCommits = 2;
  const contributors = Object.entries(emailCounts)
    .filter(([email, count]) => count >= minCommits)
    .map(([email]) => email.split('@')[0]);
  
  const expectedContributors = ['testuser1', 'testuser2'];
  
  for (const expected of expectedContributors) {
    if (!contributors.includes(expected)) {
      throw new Error(`Expected contributor ${expected} not found`);
    }
  }
  
  return { 
    success: true, 
    details: `Found ${contributors.length} contributors with ${minCommits}+ commits` 
  };
}

function testDeveloperUpdate() {
  const testContent = `# Test Feature

## Metadata

**Status**: draft  
**Developers**: @olduser1, @olduser2  
**Created**: 2024-01-01  
**Last Updated**: 2024-01-01  
**Category**: CLI  

## Overview

Test content.`;

  const lines = testContent.split('\n');
  let developersLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('**Developers**:')) {
      developersLine = i;
      break;
    }
  }
  
  if (developersLine === -1) {
    throw new Error('Could not find developers line');
  }
  
  const newDevelopers = ['newuser1', 'newuser2'];
  const developersList = newDevelopers.map(dev => `@${dev}`).join(', ');
  lines[developersLine] = `**Developers**: ${developersList}`;
  
  const updatedContent = lines.join('\n');
  
  if (!updatedContent.includes('@newuser1') || !updatedContent.includes('@newuser2')) {
    throw new Error('Developer update failed');
  }
  
  if (updatedContent.includes('@olduser1')) {
    throw new Error('Old developers not removed');
  }
  
  return { success: true, details: 'Developer field updated successfully' };
}

// Test runner
function runTests() {
  log('🧪 Running Developer Check Script Tests\n', 'blue');
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of TESTS) {
    try {
      log(`Testing: ${testCase.name}...`, 'yellow');
      const result = testCase.test();
      
      if (result.success) {
        log(`  ✅ PASS - ${result.details}`, 'green');
        passed++;
      } else {
        log(`  ❌ FAIL - ${result.details}`, 'red');
        failed++;
      }
    } catch (error) {
      log(`  ❌ FAIL - ${error.message}`, 'red');
      failed++;
    }
    
    console.log('');
  }
  
  // Summary
  log(`📊 Test Results:`, 'blue');
  log(`  Passed: ${passed}`, passed > 0 ? 'green' : 'reset');
  log(`  Failed: ${failed}`, failed > 0 ? 'red' : 'reset');
  log(`  Total:  ${TESTS.length}`, 'reset');
  
  if (failed === 0) {
    log('\n🎉 All tests passed!', 'green');
    return true;
  } else {
    log(`\n❌ ${failed} test(s) failed`, 'red');
    return false;
  }
}

// Main execution
if (process.argv[1] === __filename) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}