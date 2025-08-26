#!/usr/bin/env node

/**
 * Test script to verify redirects from nx-dev to Astro docs
 * Tests both high-confidence and low-confidence redirect mappings
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const NX_DEV_URL = 'http://localhost:4200';
const ASTRO_URL = 'http://localhost:9001';

// Load redirect rules - we'll read and evaluate the CommonJS module
const redirectRulesPath = '/Users/jack/projects/nx-worktrees/DOC-154/nx-dev/nx-dev/redirect-rules-docs-to-astro.js';
const redirectRulesContent = fs.readFileSync(redirectRulesPath, 'utf-8');

// Extract the redirects object from the file
const redirectsMatch = redirectRulesContent.match(/const docsToAstroRedirects = \{([\s\S]*?)\};/);
if (!redirectsMatch) {
  throw new Error('Could not parse redirect rules from file');
}

// Parse the redirect rules - we need to evaluate it carefully
const redirectRules = {};
const lines = redirectsMatch[1].split('\n');
for (const line of lines) {
  // Match lines like: '/getting-started': '/docs/getting-started',
  const match = line.match(/^\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/);
  if (match) {
    redirectRules[match[1]] = match[2];
  }
}

// Categories for reporting
const results = {
  highConfidence: {
    passed: [],
    failed: [],
    contentMismatch: [],
    notFound: []
  },
  lowConfidence: {
    passed: [],
    failed: [],
    contentMismatch: [],
    notFound: []
  }
};

// High confidence URLs (from the task summary)
const highConfidenceUrls = [
  '/getting-started',
  '/getting-started/intro',
  '/getting-started/installation',
  '/getting-started/start-new-project',
  '/getting-started/editor-setup',
  '/getting-started/tutorials',
  '/features',
  '/features/run-tasks',
  '/features/cache-task-results',
  '/features/explore-graph',
  '/features/generate-code',
  '/features/automate-updating-dependencies',
  '/features/enforce-module-boundaries',
  '/features/manage-releases',
  '/features/ci-features',
  '/concepts',
  '/concepts/mental-model',
  '/concepts/how-caching-works',
  '/concepts/task-pipeline-configuration',
  '/concepts/nx-plugins',
  '/concepts/inferred-tasks',
  '/concepts/types-of-configuration',
  '/concepts/executors-and-configurations',
  '/concepts/common-tasks',
  '/concepts/sync-generators',
  '/concepts/typescript-project-linking',
  '/concepts/buildable-and-publishable-libraries',
  '/concepts/daemon',
  '/concepts/decisions',
  '/concepts/decisions/overview',
  '/concepts/decisions/why-monorepos',
  '/concepts/decisions/dependency-management',
  '/concepts/decisions/code-ownership',
  '/concepts/decisions/project-size',
  '/concepts/decisions/project-dependency-rules',
  '/concepts/decisions/folder-structure'
];

// Test a single URL redirect
async function testRedirect(originalPath, expectedPath, isHighConfidence = true) {
  const testUrl = `${NX_DEV_URL}${originalPath}`;
  const expectedUrl = `${ASTRO_URL}${expectedPath}`;
  
  try {
    // Test the redirect from nx-dev
    const response = await fetch(testUrl, { 
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    const result = {
      originalPath,
      expectedPath,
      testUrl,
      expectedUrl,
      status: response.status,
      location: response.headers.get('location'),
      passed: false,
      reason: ''
    };
    
    // Check if it's a redirect
    if (response.status === 301 || response.status === 302 || response.status === 307 || response.status === 308) {
      const location = response.headers.get('location');
      
      // The redirect might be relative (just the path) or absolute URL
      // We need to check if it matches the expected path
      if (location) {
        // If location is relative, it should match expectedPath exactly
        // If location is absolute, it should be the full Astro URL
        const isCorrectRedirect = location === expectedPath || location === expectedUrl;
        
        if (isCorrectRedirect) {
          // Verify the Astro page exists
          const astroUrlToCheck = location.startsWith('http') ? location : expectedUrl;
          const astroResponse = await fetch(astroUrlToCheck);
          if (astroResponse.ok) {
            result.passed = true;
            result.reason = 'Redirect works and destination exists';
          } else {
            result.passed = false;
            result.reason = `Destination returns ${astroResponse.status}`;
          }
        } else {
          result.passed = false;
          result.reason = `Redirects to wrong location: ${location} (expected ${expectedPath} or ${expectedUrl})`;
        }
      } else {
        result.passed = false;
        result.reason = 'No location header in redirect response';
      }
    } else if (response.status === 200) {
      // Check if the page has client-side redirect via meta refresh or JavaScript
      const text = await response.text();
      if (text.includes(`window.location.href = "${expectedUrl}"`) || 
          text.includes(`<meta http-equiv="refresh" content="0; url=${expectedUrl}"`)) {
        // Verify the Astro page exists
        const astroResponse = await fetch(expectedUrl);
        if (astroResponse.ok) {
          result.passed = true;
          result.reason = 'Client-side redirect works and destination exists';
        } else {
          result.passed = false;
          result.reason = `Destination returns ${astroResponse.status}`;
        }
      } else {
        result.passed = false;
        result.reason = 'No redirect detected (returns 200)';
      }
    } else {
      result.passed = false;
      result.reason = `Unexpected status: ${response.status}`;
    }
    
    return result;
  } catch (error) {
    return {
      originalPath,
      expectedPath,
      testUrl,
      expectedUrl,
      passed: false,
      reason: `Error: ${error.message}`
    };
  }
}

// Main test runner
async function runTests() {
  console.log('🧪 Testing URL Redirects from nx-dev to Astro docs\n');
  console.log(`nx-dev URL: ${NX_DEV_URL}`);
  console.log(`Astro URL: ${ASTRO_URL}\n`);
  
  // Test high confidence URLs
  console.log('📊 Testing High Confidence URLs (35 total)...\n');
  for (const url of highConfidenceUrls) {
    const expectedPath = redirectRules[url];
    if (expectedPath) {
      const result = await testRedirect(url, expectedPath, true);
      
      if (result.passed) {
        results.highConfidence.passed.push(result);
        console.log(`✅ ${url} → ${expectedPath}`);
      } else {
        results.highConfidence.failed.push(result);
        console.log(`❌ ${url} → ${expectedPath}`);
        console.log(`   Reason: ${result.reason}`);
      }
    }
  }
  
  // Test low confidence URLs (all others in the redirect rules)
  console.log('\n📊 Testing Low Confidence URLs...\n');
  const lowConfidenceUrls = Object.keys(redirectRules).filter(url => !highConfidenceUrls.includes(url));
  
  for (const url of lowConfidenceUrls) {
    const expectedPath = redirectRules[url];
    const result = await testRedirect(url, expectedPath, false);
    
    if (result.passed) {
      results.lowConfidence.passed.push(result);
      console.log(`✅ ${url} → ${expectedPath}`);
    } else {
      results.lowConfidence.failed.push(result);
      console.log(`❌ ${url} → ${expectedPath}`);
      console.log(`   Reason: ${result.reason}`);
    }
  }
  
  // Generate summary report
  console.log('\n' + '='.repeat(80));
  console.log('📋 TEST SUMMARY\n');
  
  console.log('High Confidence URLs:');
  console.log(`  ✅ Passed: ${results.highConfidence.passed.length}/${highConfidenceUrls.length}`);
  console.log(`  ❌ Failed: ${results.highConfidence.failed.length}/${highConfidenceUrls.length}`);
  
  console.log('\nLow Confidence URLs:');
  console.log(`  ✅ Passed: ${results.lowConfidence.passed.length}/${lowConfidenceUrls.length}`);
  console.log(`  ❌ Failed: ${results.lowConfidence.failed.length}/${lowConfidenceUrls.length}`);
  
  // Save detailed results to JSON
  const reportPath = path.join(__dirname, 'redirect-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed results saved to: ${reportPath}`);
  
  // Generate markdown report
  generateMarkdownReport(results);
}

// Generate markdown report
function generateMarkdownReport(results) {
  const timestamp = new Date().toISOString();
  let markdown = `# Redirect Test Results\n\n`;
  markdown += `**Tested on**: ${timestamp}\n\n`;
  markdown += `**nx-dev URL**: ${NX_DEV_URL}\n`;
  markdown += `**Astro URL**: ${ASTRO_URL}\n\n`;
  
  markdown += `## Summary\n\n`;
  markdown += `### High Confidence URLs\n`;
  markdown += `- ✅ Passed: ${results.highConfidence.passed.length}/${highConfidenceUrls.length}\n`;
  markdown += `- ❌ Failed: ${results.highConfidence.failed.length}/${highConfidenceUrls.length}\n\n`;
  
  markdown += `### Low Confidence URLs\n`;
  const lowConfidenceTotal = results.lowConfidence.passed.length + results.lowConfidence.failed.length;
  markdown += `- ✅ Passed: ${results.lowConfidence.passed.length}/${lowConfidenceTotal}\n`;
  markdown += `- ❌ Failed: ${results.lowConfidence.failed.length}/${lowConfidenceTotal}\n\n`;
  
  // List failed high confidence URLs
  if (results.highConfidence.failed.length > 0) {
    markdown += `## Failed High Confidence URLs\n\n`;
    markdown += `| Original Path | Expected Path | Reason |\n`;
    markdown += `|---------------|---------------|--------|\n`;
    for (const fail of results.highConfidence.failed) {
      markdown += `| ${fail.originalPath} | ${fail.expectedPath} | ${fail.reason} |\n`;
    }
    markdown += '\n';
  }
  
  // List failed low confidence URLs
  if (results.lowConfidence.failed.length > 0) {
    markdown += `## Failed Low Confidence URLs\n\n`;
    markdown += `| Original Path | Expected Path | Reason |\n`;
    markdown += `|---------------|---------------|--------|\n`;
    for (const fail of results.lowConfidence.failed) {
      markdown += `| ${fail.originalPath} | ${fail.expectedPath} | ${fail.reason} |\n`;
    }
    markdown += '\n';
  }
  
  // List successful redirects
  markdown += `## Successful Redirects\n\n`;
  markdown += `### High Confidence (${results.highConfidence.passed.length})\n\n`;
  if (results.highConfidence.passed.length > 0) {
    for (const pass of results.highConfidence.passed) {
      markdown += `- ✅ ${pass.originalPath} → ${pass.expectedPath}\n`;
    }
  }
  
  markdown += `\n### Low Confidence (${results.lowConfidence.passed.length})\n\n`;
  if (results.lowConfidence.passed.length > 0) {
    for (const pass of results.lowConfidence.passed) {
      markdown += `- ✅ ${pass.originalPath} → ${pass.expectedPath}\n`;
    }
  }
  
  const reportPath = path.join(__dirname, 'redirect-test-report.md');
  fs.writeFileSync(reportPath, markdown);
  console.log(`📄 Markdown report saved to: ${reportPath}`);
}

// Run the tests
runTests().catch(console.error);