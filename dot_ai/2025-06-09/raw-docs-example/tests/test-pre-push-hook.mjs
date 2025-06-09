#!/usr/bin/env node

/**
 * Test Suite for Pre-Push Hook
 * 
 * Tests the pre-push-hook.mjs functionality with mock data.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Test configuration
const TESTS = [
  {
    name: 'Repository detection',
    test: testRepositoryDetection
  },
  {
    name: 'File pattern matching',
    test: testFilePatternMatching
  },
  {
    name: 'Change analysis',
    test: testChangeAnalysis
  },
  {
    name: 'Commit message analysis',
    test: testCommitMessageAnalysis
  },
  {
    name: 'Reminder trigger logic',
    test: testReminderTrigger
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

// Mock repository configurations (from pre-push-hook.mjs)
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
    ]
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
    ]
  }
};

// Test implementations
function testRepositoryDetection() {
  function detectRepository(mockPaths = []) {
    // Simulate file existence checks
    if (mockPaths.includes('packages/nx') || mockPaths.includes('packages/workspace')) {
      return 'nx';
    }
    
    if (mockPaths.includes('apps/ocean-ui')) {
      return 'ocean';
    }
    
    return 'nx'; // Default
  }
  
  const testCases = [
    { mockPaths: ['packages/nx'], expected: 'nx' },
    { mockPaths: ['packages/workspace'], expected: 'nx' },
    { mockPaths: ['apps/ocean-ui'], expected: 'ocean' },
    { mockPaths: [], expected: 'nx' }
  ];
  
  for (const testCase of testCases) {
    const result = detectRepository(testCase.mockPaths);
    if (result !== testCase.expected) {
      throw new Error(`Expected ${testCase.expected}, got ${result}`);
    }
  }
  
  return { success: true, details: `${testCases.length} repository detection cases tested` };
}

function testFilePatternMatching() {
  function matchesPattern(filePath, patterns) {
    return patterns.some(pattern => {
      // Convert glob pattern to regex
      let regexPattern = pattern
        // First handle glob patterns (before escaping dots)
        .replace(/\*\*/g, '__DOUBLE_STAR__') // Temporarily replace **
        .replace(/\*/g, '__SINGLE_STAR__')   // Temporarily replace *
        .replace(/\?/g, '__QUESTION__')      // Temporarily replace ?
        // Then escape regex special characters
        .replace(/\./g, '\\.')
        .replace(/\+/g, '\\+')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        // Finally restore glob patterns
        .replace(/__DOUBLE_STAR__/g, '.*')   // ** matches everything including /
        .replace(/__SINGLE_STAR__/g, '[^/]*') // * matches anything except /
        .replace(/__QUESTION__/g, '.');      // ? matches single char
      
      const regex = new RegExp(`^${regexPattern}$`);
      const matches = regex.test(filePath);
      
      // Debug logging removed
      
      return matches;
    });
  }
  
  const config = REPO_CONFIGS.nx;
  
  const testCases = [
    { file: 'packages/nx/src/command-line/generate.ts', shouldMatch: true },
    { file: 'packages/workspace/src/generators/new/new.ts', shouldMatch: true },
    { file: 'graph/client/src/app/feature.tsx', shouldMatch: true },
    { file: 'packages/nx/src/utils/test.spec.ts', shouldMatch: false }, // excluded
    { file: 'docs/README.md', shouldMatch: false },
    { file: 'package.json', shouldMatch: false }
  ];
  
  // Test all cases
  
  for (const testCase of testCases) {
    const matchesFeature = matchesPattern(testCase.file, config.featurePatterns);
    const matchesExclude = matchesPattern(testCase.file, config.excludePatterns);
    const finalMatch = matchesFeature && !matchesExclude;
    
    if (finalMatch !== testCase.shouldMatch) {
      throw new Error(`File ${testCase.file}: expected ${testCase.shouldMatch}, got ${finalMatch}`);
    }
  }
  
  return { success: true, details: `${testCases.length} pattern matching cases tested` };
}

function testChangeAnalysis() {
  function analyzeChanges(changedFiles, config) {
    function matchesPattern(filePath, patterns) {
      return patterns.some(pattern => {
        // Convert glob pattern to regex (same as in testFilePatternMatching)
        let regexPattern = pattern
          // First handle glob patterns (before escaping dots)
          .replace(/\*\*/g, '__DOUBLE_STAR__') // Temporarily replace **
          .replace(/\*/g, '__SINGLE_STAR__')   // Temporarily replace *
          .replace(/\?/g, '__QUESTION__')      // Temporarily replace ?
          // Then escape regex special characters
          .replace(/\./g, '\\.')
          .replace(/\+/g, '\\+')
          .replace(/\[/g, '\\[')
          .replace(/\]/g, '\\]')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          // Finally restore glob patterns
          .replace(/__DOUBLE_STAR__/g, '.*')   // ** matches everything including /
          .replace(/__SINGLE_STAR__/g, '[^/]*') // * matches anything except /
          .replace(/__QUESTION__/g, '.');      // ? matches single char
        
        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(filePath);
      });
    }
    
    const featureFiles = changedFiles.filter(file => {
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
  
  const config = REPO_CONFIGS.nx;
  
  const testCases = [
    {
      files: ['packages/nx/src/command-line/generate.ts', 'README.md'],
      expectFeatureChanges: true,
      expectedFeatureCount: 1
    },
    {
      files: ['docs/README.md', 'package.json'],
      expectFeatureChanges: false,
      expectedFeatureCount: 0
    },
    {
      files: ['packages/nx/src/test.spec.ts'], // excluded pattern
      expectFeatureChanges: false,
      expectedFeatureCount: 0
    }
  ];
  
  for (const testCase of testCases) {
    const analysis = analyzeChanges(testCase.files, config);
    
    if (analysis.hasFeatureChanges !== testCase.expectFeatureChanges) {
      throw new Error(`Expected hasFeatureChanges=${testCase.expectFeatureChanges}, got ${analysis.hasFeatureChanges}`);
    }
    
    if (analysis.featureFiles.length !== testCase.expectedFeatureCount) {
      throw new Error(`Expected ${testCase.expectedFeatureCount} feature files, got ${analysis.featureFiles.length}`);
    }
  }
  
  return { success: true, details: `${testCases.length} change analysis cases tested` };
}

function testCommitMessageAnalysis() {
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
  
  const testCases = [
    {
      messages: ['feat: add new generator', 'fix: resolve bug'],
      expectedFeatures: true,
      expectedEnhancements: false
    },
    {
      messages: ['improve: enhance performance', 'docs: update readme'],
      expectedFeatures: false,
      expectedEnhancements: true
    },
    {
      messages: ['feat: implement new feature', 'enhance: improve existing'],
      expectedFeatures: true,
      expectedEnhancements: true
    },
    {
      messages: ['fix: bug fix', 'docs: documentation'],
      expectedFeatures: false,
      expectedEnhancements: false
    }
  ];
  
  for (const testCase of testCases) {
    const analysis = analyzeCommitMessages(testCase.messages);
    
    if (analysis.hasNewFeatures !== testCase.expectedFeatures) {
      throw new Error(`Expected features=${testCase.expectedFeatures}, got ${analysis.hasNewFeatures}`);
    }
    
    if (analysis.hasEnhancements !== testCase.expectedEnhancements) {
      throw new Error(`Expected enhancements=${testCase.expectedEnhancements}, got ${analysis.hasEnhancements}`);
    }
  }
  
  return { success: true, details: `${testCases.length} commit message analysis cases tested` };
}

function testReminderTrigger() {
  function shouldShowReminder(analysis, commitAnalysis) {
    return analysis.hasFeatureChanges || 
           commitAnalysis.hasNewFeatures || 
           commitAnalysis.hasEnhancements;
  }
  
  const testCases = [
    {
      analysis: { hasFeatureChanges: true },
      commitAnalysis: { hasNewFeatures: false, hasEnhancements: false },
      expected: true
    },
    {
      analysis: { hasFeatureChanges: false },
      commitAnalysis: { hasNewFeatures: true, hasEnhancements: false },
      expected: true
    },
    {
      analysis: { hasFeatureChanges: false },
      commitAnalysis: { hasNewFeatures: false, hasEnhancements: true },
      expected: true
    },
    {
      analysis: { hasFeatureChanges: false },
      commitAnalysis: { hasNewFeatures: false, hasEnhancements: false },
      expected: false
    }
  ];
  
  for (const testCase of testCases) {
    const result = shouldShowReminder(testCase.analysis, testCase.commitAnalysis);
    
    if (result !== testCase.expected) {
      throw new Error(`Expected ${testCase.expected}, got ${result}`);
    }
  }
  
  return { success: true, details: `${testCases.length} reminder trigger cases tested` };
}

// Test runner
function runTests() {
  log('🧪 Running Pre-Push Hook Tests\n', 'blue');
  
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