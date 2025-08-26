#!/usr/bin/env node

/**
 * Simple redirect test using fetch
 * Tests all redirects without external dependencies
 */

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

async function testRedirect(oldPath, expectedNewPath, astroPort) {
  const url = `http://localhost:4200${oldPath}`;
  
  try {
    // Test with redirect following disabled to see what happens
    const response = await fetch(url, { 
      redirect: 'manual',
      signal: AbortSignal.timeout(5000)
    });
    
    // Check if it's a redirect
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      
      // Check if redirect goes to expected Astro path
      const expectedPattern = expectedNewPath.replace('/docs', '');
      if (location && (location.includes(expectedPattern) || location === expectedPattern)) {
        return { success: true, status: response.status, location };
      } else {
        return { success: false, error: 'wrong_redirect', actual: location };
      }
    } else if (response.status === 404) {
      return { success: false, error: '404' };
    } else {
      // Not a redirect - might be serving content directly
      return { success: false, error: 'no_redirect', status: response.status };
    }
  } catch (error) {
    return { success: false, error: 'fetch_error', message: error.message };
  }
}

async function testAllRedirects() {
  const redirects = extractRedirects();
  const totalRedirects = Object.keys(redirects).length;
  console.log(`Found ${totalRedirects} redirects to test\n`);
  
  // Detect Astro port
  let astroPort = null;
  for (const port of [9001, 9002, 9003]) {
    try {
      const response = await fetch(`http://localhost:${port}/docs`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) {
        astroPort = port;
        break;
      }
    } catch {
      // Try next port
    }
  }
  
  if (!astroPort) {
    console.error('❌ Astro server not found on ports 9001-9003');
    process.exit(1);
  }
  
  console.log(`Using Astro server on port ${astroPort}\n`);
  
  const results = {
    success: [],
    failed404: [],
    wrongRedirect: [],
    noRedirect: [],
    errors: []
  };
  
  let testCount = 0;
  
  // Test each redirect
  for (const [oldPath, expectedNewPath] of Object.entries(redirects)) {
    testCount++;
    process.stdout.write(`[${testCount}/${totalRedirects}] ${oldPath.padEnd(60)}`);
    
    const result = await testRedirect(oldPath, expectedNewPath, astroPort);
    
    if (result.success) {
      results.success.push({ path: oldPath, location: result.location });
      process.stdout.write(' ✅\n');
    } else if (result.error === '404') {
      results.failed404.push({ path: oldPath, expected: expectedNewPath });
      process.stdout.write(' ❌ 404\n');
    } else if (result.error === 'wrong_redirect') {
      results.wrongRedirect.push({ 
        path: oldPath, 
        expected: expectedNewPath, 
        actual: result.actual 
      });
      process.stdout.write(' ❌ Wrong\n');
    } else if (result.error === 'no_redirect') {
      results.noRedirect.push({ 
        path: oldPath, 
        expected: expectedNewPath,
        status: result.status 
      });
      process.stdout.write(' ❌ No redirect\n');
    } else {
      results.errors.push({ 
        path: oldPath, 
        error: result.message || result.error 
      });
      process.stdout.write(' ❌ Error\n');
    }
  }
  
  // Generate report
  console.log('\n' + '='.repeat(80));
  console.log('REDIRECT TEST SUMMARY');
  console.log('='.repeat(80));
  
  console.log(`\n✅ Successful redirects: ${results.success.length}`);
  console.log(`❌ 404 errors: ${results.failed404.length}`);
  console.log(`❌ Wrong redirects: ${results.wrongRedirect.length}`);
  console.log(`❌ No redirect: ${results.noRedirect.length}`);
  console.log(`❌ Errors: ${results.errors.length}`);
  
  const total = totalRedirects;
  const successRate = ((results.success.length / total) * 100).toFixed(1);
  console.log(`\nSuccess rate: ${successRate}%`);
  
  // Show details of failures
  if (results.failed404.length > 0) {
    console.log('\n❌ 404 ERRORS (first 10):');
    results.failed404.slice(0, 10).forEach(item => {
      console.log(`  ${item.path}`);
    });
    if (results.failed404.length > 10) {
      console.log(`  ... and ${results.failed404.length - 10} more`);
    }
  }
  
  if (results.wrongRedirect.length > 0) {
    console.log('\n❌ WRONG REDIRECTS (first 10):');
    results.wrongRedirect.slice(0, 10).forEach(item => {
      console.log(`  ${item.path}`);
      console.log(`    Expected: ${item.expected}`);
      console.log(`    Actual:   ${item.actual || 'null'}`);
    });
    if (results.wrongRedirect.length > 10) {
      console.log(`  ... and ${results.wrongRedirect.length - 10} more`);
    }
  }
  
  if (results.noRedirect.length > 0) {
    console.log('\n❌ NO REDIRECT (first 10):');
    results.noRedirect.slice(0, 10).forEach(item => {
      console.log(`  ${item.path} (status: ${item.status})`);
    });
    if (results.noRedirect.length > 10) {
      console.log(`  ... and ${results.noRedirect.length - 10} more`);
    }
  }
  
  // Save detailed report
  const reportPath = '/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-21/tasks/redirect-test-results.json';
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  // Show sample of successful redirects
  if (results.success.length > 0) {
    console.log('\n✅ Sample of successful redirects:');
    results.success.slice(0, 5).forEach(item => {
      console.log(`  ${item.path} → ${item.location}`);
    });
  }
  
  const failures = results.failed404.length + results.wrongRedirect.length + results.noRedirect.length;
  if (failures === 0) {
    console.log('\n🎉 All redirects working perfectly!');
  } else {
    console.log(`\n⚠️  ${failures} redirects need attention`);
  }
  
  return failures === 0;
}

// Main execution
async function main() {
  console.log('Simple Redirect Test');
  console.log('=' .repeat(80));
  
  // Check nx-dev server
  try {
    const response = await fetch('http://localhost:4200', { 
      signal: AbortSignal.timeout(5000),
      headers: { 'Accept': 'text/html' }
    });
    console.log('✅ nx-dev server running on port 4200');
  } catch (error) {
    console.error('❌ nx-dev server not running on port 4200');
    console.log('Error:', error.message);
    console.log('Please run: NEXT_PUBLIC_ASTRO_URL=http://localhost:9002 nx serve nx-dev');
    process.exit(1);
  }
  
  const success = await testAllRedirects();
  process.exit(success ? 0 : 1);
}

main().catch(console.error);