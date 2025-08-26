#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const redirects = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirects.json', 'utf-8'));

const results = {
  working: [],          // Redirects correctly to expected new URL
  broken: [],           // Old URL returns 404 or error
  potentiallyFixed: []  // Redirects to a different URL than expected
};

const baseUrl = 'https://canary.nx.dev';

async function checkUrl(url) {
  try {
    const fullUrl = `${baseUrl}${url}`;
    const { stdout } = await execAsync(
      `curl -s -o /dev/null -w "%{http_code}|%{url_effective}" -L --max-redirs 10 "${fullUrl}"`, 
      { timeout: 15000 }
    );
    const [statusCode, finalUrl] = stdout.trim().split('|');
    return { 
      statusCode: parseInt(statusCode), 
      finalUrl: finalUrl || fullUrl
    };
  } catch (error) {
    console.error(`Error checking ${url}:`, error.message);
    return { statusCode: 0, finalUrl: '', error: error.message };
  }
}

function normalizeUrl(url) {
  // Remove trailing slash and normalize for comparison
  return url.replace(/\/$/, '').toLowerCase();
}

function findPotentialMatch(oldPath, actualPath) {
  // Extract key segments from paths
  const oldSegments = oldPath.split('/').filter(Boolean);
  const actualSegments = actualPath.split('/').filter(Boolean);
  
  // Check for common patterns in redirects
  const patterns = [
    { from: /^\/nx-api\/(.+)/, to: '/technologies/$1/api' },
    { from: /^\/recipes\/(.+?)\/(.+)/, to: '/technologies/$1/recipes/$2' },
    { from: /^\/ci\/intro\/(.+)/, to: '/ci/recipes/$1' },
  ];
  
  for (const pattern of patterns) {
    if (pattern.from.test(oldPath)) {
      const expected = oldPath.replace(pattern.from, pattern.to);
      if (normalizeUrl(actualPath) === normalizeUrl(expected)) {
        return { match: true, pattern: pattern.from.toString() };
      }
    }
  }
  
  // Check if segments overlap significantly
  const commonSegments = oldSegments.filter(seg => actualSegments.includes(seg));
  if (commonSegments.length >= 2) {
    return { match: 'partial', commonSegments };
  }
  
  return { match: false };
}

async function analyzeRedirects() {
  console.log(`\nAnalyzing ${redirects.length} redirect rules from canary.nx.dev...`);
  console.log('=' .repeat(60) + '\n');
  
  const startTime = Date.now();
  let processed = 0;
  const batchSize = 10;
  
  // Process in batches
  for (let i = 0; i < redirects.length; i += batchSize) {
    const batch = redirects.slice(i, Math.min(i + batchSize, redirects.length));
    
    const batchResults = await Promise.all(
      batch.map(async (redirect) => {
        const result = await checkUrl(redirect.from);
        return {
          ...redirect,
          oldUrlStatus: result.statusCode,
          actualFinalUrl: result.finalUrl,
          error: result.error
        };
      })
    );
    
    // Categorize results
    for (const item of batchResults) {
      processed++;
      const expectedNewUrl = `${baseUrl}${item.to}`;
      const actualPath = item.actualFinalUrl.replace(baseUrl, '');
      
      // Normalize URLs for comparison
      const normalizedExpected = normalizeUrl(expectedNewUrl);
      const normalizedActual = normalizeUrl(item.actualFinalUrl);
      
      if (item.oldUrlStatus === 0 || item.error) {
        // Error occurred
        results.broken.push({
          ...item,
          reason: 'Connection error',
          error: item.error
        });
        console.log(`❌ [${processed}/${redirects.length}] ${item.from} - Error`);
      } else if (item.oldUrlStatus === 404) {
        // Old URL doesn't exist (expected if redirect is in place)
        results.broken.push({
          ...item,
          reason: '404 - Page not found'
        });
        console.log(`❌ [${processed}/${redirects.length}] ${item.from} - 404`);
      } else if (normalizedExpected === normalizedActual) {
        // Redirect working correctly
        results.working.push(item);
        console.log(`✅ [${processed}/${redirects.length}] ${item.from} -> ${item.to}`);
      } else {
        // Redirects to different location
        const potentialMatch = findPotentialMatch(item.from, actualPath);
        results.potentiallyFixed.push({
          ...item,
          actualPath,
          potentialMatch
        });
        console.log(`⚠️  [${processed}/${redirects.length}] ${item.from} -> ${actualPath} (Expected: ${item.to})`);
      }
      
      // Progress indicator
      if (processed % 50 === 0) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`\n... Progress: ${processed}/${redirects.length} (${elapsed}s) ...\n`);
      }
    }
    
    // Rate limiting
    if (i + batchSize < redirects.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nCompleted in ${totalTime} seconds\n`);
  
  // Save results
  fs.writeFileSync(
    '/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/full-redirect-results.json',
    JSON.stringify(results, null, 2)
  );
  
  generateFinalReport();
}

function generateFinalReport() {
  let report = '# Redirect Analysis Report for canary.nx.dev\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `URL: ${baseUrl}\n`;
  report += `Total redirect rules analyzed: ${redirects.length}\n\n`;
  
  // Summary
  report += '## Summary\n\n';
  report += `| Category | Count | Percentage |\n`;
  report += `|----------|-------|------------|\n`;
  report += `| ✅ Working Redirects | ${results.working.length} | ${((results.working.length / redirects.length) * 100).toFixed(1)}% |\n`;
  report += `| ⚠️ Potentially Fixed | ${results.potentiallyFixed.length} | ${((results.potentiallyFixed.length / redirects.length) * 100).toFixed(1)}% |\n`;
  report += `| ❌ Broken Links | ${results.broken.length} | ${((results.broken.length / redirects.length) * 100).toFixed(1)}% |\n\n`;
  
  // Working redirects (sample)
  if (results.working.length > 0) {
    report += `## ✅ WORKING REDIRECTS (${results.working.length})\n\n`;
    report += 'Sample of working redirects:\n\n';
    results.working.slice(0, 10).forEach(r => {
      report += `- \`${r.from}\` → \`${r.to}\` ✓\n`;
    });
    if (results.working.length > 10) {
      report += `\n... and ${results.working.length - 10} more working redirects\n`;
    }
    report += '\n';
  }
  
  // Broken links
  if (results.broken.length > 0) {
    report += `## ❌ BROKEN LINKS (${results.broken.length})\n\n`;
    report += 'These URLs return 404 or errors:\n\n';
    
    const notFound = results.broken.filter(r => r.reason === '404 - Page not found');
    const errors = results.broken.filter(r => r.reason === 'Connection error');
    
    if (notFound.length > 0) {
      report += `### 404 Not Found (${notFound.length})\n\n`;
      notFound.slice(0, 20).forEach(r => {
        report += `- \`${r.from}\` → \`${r.to}\`\n`;
      });
      if (notFound.length > 20) {
        report += `\n... and ${notFound.length - 20} more 404 errors\n`;
      }
      report += '\n';
    }
    
    if (errors.length > 0) {
      report += `### Connection Errors (${errors.length})\n\n`;
      errors.slice(0, 10).forEach(r => {
        report += `- \`${r.from}\` → \`${r.to}\`\n`;
      });
      if (errors.length > 10) {
        report += `\n... and ${errors.length - 10} more connection errors\n`;
      }
      report += '\n';
    }
  }
  
  // Potentially fixed (redirecting to different location)
  if (results.potentiallyFixed.length > 0) {
    report += `## ⚠️ POTENTIALLY FIXED LINKS (${results.potentiallyFixed.length})\n\n`;
    report += 'These URLs redirect to a different location than specified in the redirect rules.\n';
    report += 'They may have been restructured in the new documentation:\n\n';
    
    // Group by redirect pattern
    const patternGroups = {};
    const noPattern = [];
    
    results.potentiallyFixed.forEach(r => {
      if (r.potentialMatch && r.potentialMatch.match === true) {
        const pattern = r.potentialMatch.pattern;
        if (!patternGroups[pattern]) {
          patternGroups[pattern] = [];
        }
        patternGroups[pattern].push(r);
      } else {
        noPattern.push(r);
      }
    });
    
    // Show pattern-based redirects
    Object.keys(patternGroups).forEach(pattern => {
      const items = patternGroups[pattern];
      report += `### Pattern: \`${pattern}\`\n\n`;
      items.slice(0, 5).forEach(r => {
        report += `- \`${r.from}\`\n`;
        report += `  - Redirect rule expects: \`${r.to}\`\n`;
        report += `  - Actually redirects to: \`${r.actualPath}\`\n`;
      });
      if (items.length > 5) {
        report += `\n... and ${items.length - 5} more with this pattern\n`;
      }
      report += '\n';
    });
    
    // Show non-pattern redirects
    if (noPattern.length > 0) {
      report += `### Other Redirects\n\n`;
      noPattern.slice(0, 20).forEach(r => {
        report += `- \`${r.from}\`\n`;
        report += `  - Redirect rule expects: \`${r.to}\`\n`;
        report += `  - Actually redirects to: \`${r.actualPath}\`\n`;
      });
      if (noPattern.length > 20) {
        report += `\n... and ${noPattern.length - 20} more redirects\n`;
      }
    }
  }
  
  // Recommendations
  report += '\n## Recommendations\n\n';
  report += '1. **Review Broken Links**: Update redirect rules for URLs that return 404\n';
  report += '2. **Verify Potentially Fixed Links**: Check if the actual redirect destinations are correct\n';
  report += '3. **Update Redirect Rules**: Align the redirect-rules-docs-to-astro.js file with actual redirects\n';
  report += '4. **Consider URL Structure**: Many redirects follow patterns (e.g., `/nx-api/*` → `/technologies/*/api`)\n';
  
  fs.writeFileSync(
    '/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirect-analysis-report.md',
    report
  );
  
  // Summary to console
  console.log('\n' + '='.repeat(60));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Working Redirects: ${results.working.length} (${((results.working.length / redirects.length) * 100).toFixed(1)}%)`);
  console.log(`⚠️  Potentially Fixed: ${results.potentiallyFixed.length} (${((results.potentiallyFixed.length / redirects.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Broken Links: ${results.broken.length} (${((results.broken.length / redirects.length) * 100).toFixed(1)}%)`);
  console.log('\nFull report saved to: redirect-analysis-report.md');
  console.log('Detailed results saved to: full-redirect-results.json');
}

// Run analysis
analyzeRedirects().catch(console.error);