#!/usr/bin/env node

/**
 * Comprehensive redirect test using Playwright
 * Tests all redirects and compares content with production
 * Auto-detects Astro port
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';

// Extract all redirects from the redirect rules file
function extractRedirects() {
  const fileContent = readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/nx-dev/nx-dev/redirect-rules-docs-to-astro.js', 'utf8');
  const redirects = {};
  
  // Match all redirect patterns
  const pattern = /'([^']+)': '([^']+)'/g;
  let match;
  
  while ((match = pattern.exec(fileContent)) !== null) {
    if (match[1].startsWith('/') && match[2].startsWith('/docs')) {
      redirects[match[1]] = match[2];
    }
  }
  
  return redirects;
}

async function detectAstroPort() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  for (const port of [9001, 9002, 9003]) {
    try {
      const response = await page.goto(`http://localhost:${port}/docs`, { timeout: 5000 });
      if (response.status() === 200) {
        await browser.close();
        return port;
      }
    } catch {
      // Try next port
    }
  }
  
  await browser.close();
  return null;
}

async function testRedirects(astroPort) {
  const redirects = extractRedirects();
  const totalRedirects = Object.keys(redirects).length;
  console.log(`Found ${totalRedirects} redirects to test\n`);
  console.log(`Using Astro server on port ${astroPort}\n`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  const results = {
    success: [],
    failed404: [],
    failedNoRedirect: [],
    contentMismatch: [],
    errors: []
  };
  
  let testCount = 0;
  
  // Test each redirect
  for (const [oldPath, expectedNewPath] of Object.entries(redirects)) {
    testCount++;
    process.stdout.write(`[${testCount}/${totalRedirects}] ${oldPath}`);
    
    try {
      const localPage = await context.newPage();
      
      // Test local redirect
      const localUrl = `http://localhost:4200${oldPath}`;
      const localResponse = await localPage.goto(localUrl, { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      
      const finalLocalUrl = localPage.url();
      const localStatus = localResponse.status();
      
      // Check if redirect happened correctly
      if (localStatus === 404) {
        results.failed404.push({
          path: oldPath,
          expected: expectedNewPath,
          status: localStatus
        });
        process.stdout.write(' ❌ 404\n');
        await localPage.close();
        continue;
      }
      
      // Check if URL was redirected to expected path
      // The redirect should go to Astro server (port 9002) with the path
      const expectedUrlPattern = `localhost:${astroPort}${expectedNewPath.replace('/docs', '')}`;
      if (!finalLocalUrl.includes(expectedUrlPattern)) {
        results.failedNoRedirect.push({
          path: oldPath,
          expected: expectedNewPath,
          actual: finalLocalUrl
        });
        process.stdout.write(' ❌ Wrong redirect\n');
        await localPage.close();
        continue;
      }
      
      // Success - redirect worked
      results.success.push({
        path: oldPath,
        redirectedTo: expectedNewPath,
        finalUrl: finalLocalUrl
      });
      process.stdout.write(' ✅\n');
      
      await localPage.close();
      
    } catch (error) {
      results.errors.push({
        path: oldPath,
        error: error.message
      });
      process.stdout.write(` ❌ Error: ${error.message.substring(0, 50)}\n`);
    }
  }
  
  await browser.close();
  
  // Generate report
  console.log('\n' + '='.repeat(80));
  console.log('REDIRECT TEST SUMMARY');
  console.log('='.repeat(80));
  
  console.log(`\n✅ Successful redirects: ${results.success.length}`);
  console.log(`❌ 404 errors: ${results.failed404.length}`);
  console.log(`❌ Wrong redirects: ${results.failedNoRedirect.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  
  const total = results.success.length + results.failed404.length + 
                results.failedNoRedirect.length + results.errors.length;
  const successRate = ((results.success.length / total) * 100).toFixed(1);
  console.log(`\nSuccess rate: ${successRate}%`);
  
  // Show details of failures
  if (results.failed404.length > 0) {
    console.log('\n❌ 404 ERRORS:');
    results.failed404.slice(0, 10).forEach(item => {
      console.log(`  ${item.path} → Expected: ${item.expected}`);
    });
    if (results.failed404.length > 10) {
      console.log(`  ... and ${results.failed404.length - 10} more`);
    }
  }
  
  if (results.failedNoRedirect.length > 0) {
    console.log('\n❌ WRONG REDIRECTS:');
    results.failedNoRedirect.slice(0, 10).forEach(item => {
      console.log(`  ${item.path}`);
      console.log(`    Expected: ${item.expected}`);
      console.log(`    Actual: ${item.actual}`);
    });
    if (results.failedNoRedirect.length > 10) {
      console.log(`  ... and ${results.failedNoRedirect.length - 10} more`);
    }
  }
  
  if (results.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    results.errors.slice(0, 10).forEach(item => {
      console.log(`  ${item.path}: ${item.error.substring(0, 100)}`);
    });
    if (results.errors.length > 10) {
      console.log(`  ... and ${results.errors.length - 10} more`);
    }
  }
  
  // Save detailed report
  const reportPath = '/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-21/tasks/redirect-test-report.json';
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  // Show sample of successful redirects
  if (results.success.length > 0) {
    console.log('\n✅ Sample of successful redirects:');
    results.success.slice(0, 5).forEach(item => {
      console.log(`  ${item.path} → ${item.redirectedTo}`);
    });
  }
  
  // Return exit code based on critical failures
  const criticalFailures = results.failed404.length + results.failedNoRedirect.length;
  if (criticalFailures > 0) {
    console.log(`\n⚠️  ${criticalFailures} redirects need attention`);
    return false;
  } else {
    console.log('\n✅ All redirects working correctly!');
    return true;
  }
}

// Check if servers are running
async function checkServers(astroPort) {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Check nx-dev server
    try {
      await page.goto('http://localhost:4200', { timeout: 5000 });
      console.log('✅ nx-dev server running on port 4200');
    } catch {
      console.log('❌ nx-dev server not running on port 4200');
      console.log(`Please run: NEXT_PUBLIC_ASTRO_URL=http://localhost:${astroPort} nx serve nx-dev`);
      await browser.close();
      return false;
    }
    
    await browser.close();
    return true;
  } catch (error) {
    console.error('Error checking servers:', error);
    return false;
  }
}

// Main execution
async function main() {
  console.log('Comprehensive Redirect Test');
  console.log('=' .repeat(80));
  
  // Detect Astro port
  console.log('Detecting Astro server port...');
  const astroPort = await detectAstroPort();
  
  if (!astroPort) {
    console.log('❌ Astro server not found on ports 9001-9003');
    console.log('Please start the Astro server first');
    process.exit(1);
  }
  
  console.log(`✅ Astro server found on port ${astroPort}`);
  
  const serversReady = await checkServers(astroPort);
  if (!serversReady) {
    console.log('\nPlease start the nx-dev server and try again.');
    process.exit(1);
  }
  
  console.log('\nStarting redirect tests...\n');
  const success = await testRedirects(astroPort);
  process.exit(success ? 0 : 1);
}

main().catch(console.error);