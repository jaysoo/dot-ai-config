#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const redirects = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirects.json', 'utf-8'));

const results = {
  working: [],
  broken: [],
  potentiallyFixed: []
};

const baseUrl = 'https://canary.nx.dev';

async function checkUrl(url) {
  try {
    const fullUrl = `${baseUrl}${url}`;
    const { stdout, stderr } = await execAsync(`curl -s -o /dev/null -w "%{http_code} %{url_effective}" -L "${fullUrl}"`, { timeout: 10000 });
    const [statusCode, finalUrl] = stdout.trim().split(' ');
    return { statusCode: parseInt(statusCode), finalUrl };
  } catch (error) {
    return { statusCode: 0, finalUrl: '', error: error.message };
  }
}

async function checkRedirects() {
  console.log(`Checking ${redirects.length} redirects...`);
  console.log('===================================\n');
  
  let processed = 0;
  const batchSize = 10;
  
  for (let i = 0; i < redirects.length; i += batchSize) {
    const batch = redirects.slice(i, Math.min(i + batchSize, redirects.length));
    
    const batchResults = await Promise.all(
      batch.map(async (redirect) => {
        const oldResult = await checkUrl(redirect.from);
        const expectedNewUrl = `${baseUrl}${redirect.to}`;
        
        return {
          ...redirect,
          oldUrlStatus: oldResult.statusCode,
          oldUrlFinal: oldResult.finalUrl,
          expectedNewUrl,
          redirectWorking: oldResult.finalUrl === expectedNewUrl || 
                          oldResult.finalUrl === expectedNewUrl + '/' ||
                          oldResult.finalUrl === expectedNewUrl.replace(/\/$/, '')
        };
      })
    );
    
    for (const result of batchResults) {
      processed++;
      
      if (result.redirectWorking && result.oldUrlStatus === 200) {
        results.working.push(result);
        console.log(`✅ [${processed}/${redirects.length}] ${result.from} -> ${result.to} (Working)`);
      } else if (result.oldUrlStatus === 404 || result.oldUrlStatus === 0) {
        results.broken.push(result);
        console.log(`❌ [${processed}/${redirects.length}] ${result.from} -> ${result.to} (404/Error)`);
      } else if (result.oldUrlStatus === 200 && !result.redirectWorking) {
        // Check if it redirects to a different but potentially valid page
        results.potentiallyFixed.push({
          ...result,
          actualFinalUrl: result.oldUrlFinal
        });
        console.log(`⚠️  [${processed}/${redirects.length}] ${result.from} -> Expected: ${result.to}, Actual: ${result.oldUrlFinal.replace(baseUrl, '')} (Different target)`);
      } else {
        results.broken.push(result);
        console.log(`❌ [${processed}/${redirects.length}] ${result.from} -> ${result.to} (Status: ${result.oldUrlStatus})`);
      }
    }
    
    // Small delay between batches to avoid overwhelming the server
    if (i + batchSize < redirects.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Save results
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirect-check-results.json', JSON.stringify(results, null, 2));
  
  // Print summary
  console.log('\n===================================');
  console.log('SUMMARY');
  console.log('===================================');
  console.log(`✅ Working redirects: ${results.working.length}`);
  console.log(`❌ Broken redirects: ${results.broken.length}`);
  console.log(`⚠️  Potentially fixed (different target): ${results.potentiallyFixed.length}`);
  console.log(`Total checked: ${redirects.length}`);
  
  // Generate report
  generateReport();
}

function generateReport() {
  let report = '# Redirect Verification Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- Total redirects: ${redirects.length}\n`;
  report += `- ✅ Working: ${results.working.length}\n`;
  report += `- ❌ Broken: ${results.broken.length}\n`;
  report += `- ⚠️  Potentially Fixed: ${results.potentiallyFixed.length}\n\n`;
  
  // Working redirects
  report += `## ✅ WORKING LINKS (${results.working.length})\n\n`;
  report += 'These redirects are functioning correctly:\n\n';
  results.working.forEach(r => {
    report += `- \`${r.from}\` → \`${r.to}\`\n`;
  });
  
  // Broken redirects
  report += `\n## ❌ BROKEN LINKS (${results.broken.length})\n\n`;
  report += 'These redirects are NOT working (404 or error):\n\n';
  results.broken.forEach(r => {
    report += `- \`${r.from}\` → \`${r.to}\` (Status: ${r.oldUrlStatus})\n`;
  });
  
  // Potentially fixed redirects
  report += `\n## ⚠️  POTENTIALLY FIXED LINKS (${results.potentiallyFixed.length})\n\n`;
  report += 'These URLs redirect to a different location than expected:\n\n';
  results.potentiallyFixed.forEach(r => {
    const actualPath = r.actualFinalUrl.replace(baseUrl, '');
    report += `- \`${r.from}\`\n`;
    report += `  - Expected: \`${r.to}\`\n`;
    report += `  - Actual: \`${actualPath}\`\n`;
  });
  
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirect-verification-report.md', report);
  console.log('\nDetailed report saved to redirect-verification-report.md');
}

// Run the check
checkRedirects().catch(console.error);