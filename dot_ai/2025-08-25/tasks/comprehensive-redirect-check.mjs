#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const redirects = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirects.json', 'utf-8'));

const results = {
  working: [],      // Redirects correctly to new URL
  broken: [],       // Old URL returns 404 
  notRedirecting: [] // Old URL exists but doesn't redirect
};

const baseUrl = 'https://canary.nx.dev';

async function checkUrl(url) {
  try {
    const fullUrl = `${baseUrl}${url}`;
    const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code} %{url_effective}" -L "${fullUrl}"`, { timeout: 10000 });
    const [statusCode, finalUrl] = stdout.trim().split(' ');
    return { statusCode: parseInt(statusCode), finalUrl };
  } catch (error) {
    return { statusCode: 0, finalUrl: '', error: error.message };
  }
}

async function checkRedirects() {
  console.log(`Checking ${redirects.length} redirects on ${baseUrl}...`);
  console.log('===================================\n');
  
  let processed = 0;
  const batchSize = 5; // Smaller batch size to be careful with server
  
  for (let i = 0; i < redirects.length; i += batchSize) {
    const batch = redirects.slice(i, Math.min(i + batchSize, redirects.length));
    
    const batchResults = await Promise.all(
      batch.map(async (redirect) => {
        const oldResult = await checkUrl(redirect.from);
        const expectedNewUrl = `${baseUrl}${redirect.to}`;
        
        // Also check if the new URL exists independently
        const newResult = await checkUrl(redirect.to);
        
        return {
          ...redirect,
          oldUrlStatus: oldResult.statusCode,
          oldUrlFinal: oldResult.finalUrl,
          newUrlStatus: newResult.statusCode,
          newUrlFinal: newResult.finalUrl,
          expectedNewUrl,
          redirectWorking: oldResult.finalUrl === expectedNewUrl || 
                          oldResult.finalUrl === expectedNewUrl + '/' ||
                          oldResult.finalUrl === expectedNewUrl.replace(/\/$/, '')
        };
      })
    );
    
    for (const result of batchResults) {
      processed++;
      const progress = `[${processed}/${redirects.length}]`;
      
      if (result.oldUrlStatus === 404) {
        // Old URL doesn't exist anymore - that's expected if redirects are in place
        if (result.newUrlStatus === 200) {
          results.working.push(result);
          console.log(`✅ ${progress} ${result.from} (404) -> ${result.to} (200) - Redirect likely working`);
        } else {
          results.broken.push(result);
          console.log(`❌ ${progress} ${result.from} (404) -> ${result.to} (${result.newUrlStatus}) - Both broken`);
        }
      } else if (result.oldUrlStatus === 200) {
        if (result.redirectWorking) {
          results.working.push(result);
          console.log(`✅ ${progress} ${result.from} -> ${result.to} - Redirect working`);
        } else {
          // Old URL still exists but doesn't redirect
          const actualPath = result.oldUrlFinal.replace(baseUrl, '');
          if (actualPath === result.from) {
            results.notRedirecting.push(result);
            console.log(`⚠️  ${progress} ${result.from} - No redirect (stays at old URL, new URL status: ${result.newUrlStatus})`);
          } else {
            results.notRedirecting.push({
              ...result,
              actualRedirectPath: actualPath
            });
            console.log(`⚠️  ${progress} ${result.from} -> ${actualPath} (Expected: ${result.to})`);
          }
        }
      } else {
        results.broken.push(result);
        console.log(`❌ ${progress} ${result.from} - Error (Status: ${result.oldUrlStatus})`);
      }
    }
    
    // Small delay between batches
    if (i + batchSize < redirects.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Save detailed results
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/comprehensive-results.json', 
    JSON.stringify({ results, timestamp: new Date().toISOString() }, null, 2));
  
  // Generate report
  generateComprehensiveReport();
}

function generateComprehensiveReport() {
  let report = '# Comprehensive Redirect Verification Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `URL Checked: ${baseUrl}\n\n`;
  
  report += `## Summary\n\n`;
  report += `- Total redirect rules: ${redirects.length}\n`;
  report += `- ✅ Working redirects: ${results.working.length}\n`;
  report += `- ⚠️  Not redirecting (old URL still accessible): ${results.notRedirecting.length}\n`;
  report += `- ❌ Broken (errors/404 on both): ${results.broken.length}\n\n`;
  
  // Working redirects
  if (results.working.length > 0) {
    report += `## ✅ WORKING REDIRECTS (${results.working.length})\n\n`;
    report += 'These redirects are functioning correctly:\n\n';
    results.working.forEach(r => {
      report += `- \`${r.from}\` → \`${r.to}\`\n`;
    });
  }
  
  // Not redirecting 
  if (results.notRedirecting.length > 0) {
    report += `\n## ⚠️  NOT REDIRECTING (${results.notRedirecting.length})\n\n`;
    report += 'These old URLs are still accessible but DO NOT redirect to the new location:\n\n';
    
    // Group by whether new URL exists
    const withNewUrl = results.notRedirecting.filter(r => r.newUrlStatus === 200);
    const withoutNewUrl = results.notRedirecting.filter(r => r.newUrlStatus !== 200);
    
    if (withNewUrl.length > 0) {
      report += `### Both old and new URLs exist (${withNewUrl.length})\n\n`;
      withNewUrl.forEach(r => {
        if (r.actualRedirectPath && r.actualRedirectPath !== r.from) {
          report += `- \`${r.from}\` redirects to \`${r.actualRedirectPath}\` (Expected: \`${r.to}\`)\n`;
        } else {
          report += `- \`${r.from}\` (no redirect, new URL \`${r.to}\` also exists)\n`;
        }
      });
    }
    
    if (withoutNewUrl.length > 0) {
      report += `\n### Old URL exists, new URL doesn't (${withoutNewUrl.length})\n\n`;
      withoutNewUrl.forEach(r => {
        report += `- \`${r.from}\` exists (new \`${r.to}\` returns ${r.newUrlStatus})\n`;
      });
    }
  }
  
  // Broken redirects
  if (results.broken.length > 0) {
    report += `\n## ❌ BROKEN LINKS (${results.broken.length})\n\n`;
    report += 'These have errors or 404s:\n\n';
    results.broken.forEach(r => {
      report += `- \`${r.from}\` (${r.oldUrlStatus}) → \`${r.to}\` (${r.newUrlStatus})\n`;
    });
  }
  
  // Actionable summary
  report += '\n## Actionable Items\n\n';
  
  if (results.notRedirecting.length > 0) {
    report += `### Redirects Need to be Implemented (${results.notRedirecting.length})\n\n`;
    report += 'The following redirects are defined in the redirect rules but are NOT actually redirecting on the server:\n\n';
    report += '```javascript\n';
    results.notRedirecting.slice(0, 10).forEach(r => {
      report += `"${r.from}": "${r.to}",\n`;
    });
    if (results.notRedirecting.length > 10) {
      report += `// ... and ${results.notRedirecting.length - 10} more\n`;
    }
    report += '```\n\n';
  }
  
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/comprehensive-report.md', report);
  console.log('\n===================================');
  console.log('SUMMARY');
  console.log('===================================');
  console.log(`✅ Working redirects: ${results.working.length}`);
  console.log(`⚠️  Not redirecting: ${results.notRedirecting.length}`);
  console.log(`❌ Broken: ${results.broken.length}`);
  console.log(`\nDetailed report saved to comprehensive-report.md`);
}

// Run the check
checkRedirects().catch(console.error);