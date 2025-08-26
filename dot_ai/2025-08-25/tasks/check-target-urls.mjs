#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const redirects = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirects.json', 'utf-8'));

const results = {
  working: [],      // Target URL exists (200)
  broken: [],       // Target URL doesn't exist (404)
  other: []        // Other status codes
};

const baseUrl = 'https://canary.nx.dev';

async function checkUrl(url) {
  try {
    const fullUrl = `${baseUrl}${url}`;
    const { stdout } = await execAsync(
      `curl -s -o /dev/null -w "%{http_code}" "${fullUrl}"`, 
      { timeout: 10000 }
    );
    return parseInt(stdout.trim());
  } catch (error) {
    console.error(`Error checking ${url}:`, error.message);
    return 0;
  }
}

async function checkTargetUrls() {
  console.log(`\nChecking if TARGET URLs exist on ${baseUrl}...`);
  console.log('=' .repeat(60) + '\n');
  console.log('Format: old_url -> new_url [STATUS]\n');
  
  const startTime = Date.now();
  let processed = 0;
  const batchSize = 10;
  
  for (let i = 0; i < redirects.length; i += batchSize) {
    const batch = redirects.slice(i, Math.min(i + batchSize, redirects.length));
    
    const batchResults = await Promise.all(
      batch.map(async (redirect) => {
        const status = await checkUrl(redirect.to);
        return {
          ...redirect,
          targetStatus: status
        };
      })
    );
    
    for (const item of batchResults) {
      processed++;
      const progress = `[${processed}/${redirects.length}]`;
      
      if (item.targetStatus === 200) {
        results.working.push(item);
        console.log(`✅ ${progress} ${item.from} -> ${item.to} (EXISTS)`);
      } else if (item.targetStatus === 404) {
        results.broken.push(item);
        console.log(`❌ ${progress} ${item.from} -> ${item.to} (404 NOT FOUND)`);
      } else if (item.targetStatus === 0) {
        results.other.push(item);
        console.log(`⚠️  ${progress} ${item.from} -> ${item.to} (ERROR)`);
      } else {
        results.other.push(item);
        console.log(`⚠️  ${progress} ${item.from} -> ${item.to} (Status: ${item.targetStatus})`);
      }
      
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
    '/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/target-url-results.json',
    JSON.stringify(results, null, 2)
  );
  
  generateTargetUrlReport();
}

function generateTargetUrlReport() {
  let report = '# Target URL Validation Report for canary.nx.dev\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Checked: ${baseUrl}\n`;
  report += `Total redirect mappings: ${redirects.length}\n\n`;
  
  // Summary
  report += '## SUMMARY\n\n';
  report += `| Status | Count | Percentage | Description |\n`;
  report += `|--------|-------|------------|-------------|\n`;
  report += `| ✅ **WORKING** | ${results.working.length} | ${((results.working.length / redirects.length) * 100).toFixed(1)}% | Target URL exists (200 OK) |\n`;
  report += `| ❌ **BROKEN** | ${results.broken.length} | ${((results.broken.length / redirects.length) * 100).toFixed(1)}% | Target URL not found (404) |\n`;
  report += `| ⚠️ **OTHER** | ${results.other.length} | ${((results.other.length / redirects.length) * 100).toFixed(1)}% | Other status or errors |\n\n`;
  
  // Working URLs (summary)
  if (results.working.length > 0) {
    report += `## ✅ WORKING TARGET URLS (${results.working.length})\n\n`;
    report += 'These redirect mappings have valid target URLs that exist:\n\n';
    
    // Group by section
    const sections = {};
    results.working.forEach(item => {
      const section = item.to.split('/')[2] || 'root';  // /docs/SECTION/...
      if (!sections[section]) sections[section] = [];
      sections[section].push(item);
    });
    
    Object.keys(sections).sort().forEach(section => {
      const items = sections[section];
      report += `### /docs/${section}/* (${items.length} working)\n\n`;
      items.slice(0, 5).forEach(item => {
        report += `- \`${item.from}\` → \`${item.to}\` ✓\n`;
      });
      if (items.length > 5) {
        report += `... and ${items.length - 5} more\n`;
      }
      report += '\n';
    });
  }
  
  // Broken URLs
  if (results.broken.length > 0) {
    report += `## ❌ BROKEN TARGET URLS (${results.broken.length})\n\n`;
    report += 'These redirect mappings point to URLs that DO NOT EXIST (404):\n\n';
    
    // Group by section for broken URLs too
    const brokenSections = {};
    results.broken.forEach(item => {
      const section = item.to.split('/')[2] || 'root';
      if (!brokenSections[section]) brokenSections[section] = [];
      brokenSections[section].push(item);
    });
    
    Object.keys(brokenSections).sort().forEach(section => {
      const items = brokenSections[section];
      report += `### /docs/${section}/* (${items.length} broken)\n\n`;
      items.forEach(item => {
        report += `- \`${item.from}\` → \`${item.to}\` (404)\n`;
      });
      report += '\n';
    });
  }
  
  // Other status codes
  if (results.other.length > 0) {
    report += `## ⚠️ OTHER STATUS (${results.other.length})\n\n`;
    results.other.forEach(item => {
      report += `- \`${item.from}\` → \`${item.to}\` (Status: ${item.targetStatus})\n`;
    });
    report += '\n';
  }
  
  // Recommendations
  report += '## RECOMMENDATIONS\n\n';
  
  if (results.broken.length > 0) {
    report += `### Fix Broken Mappings (${results.broken.length} total)\n\n`;
    report += 'These redirect rules point to non-existent pages. Either:\n';
    report += '1. The target pages need to be created in the new docs\n';
    report += '2. The redirect mappings need to be updated to point to existing pages\n';
    report += '3. Find alternative pages that cover the same content\n\n';
    
    // Show a sample of broken URLs for investigation
    report += 'Sample broken mappings to investigate:\n\n';
    results.broken.slice(0, 10).forEach(item => {
      report += `- \`${item.from}\` → \`${item.to}\` (doesn't exist)\n`;
    });
    if (results.broken.length > 10) {
      report += `\n... and ${results.broken.length - 10} more broken mappings\n`;
    }
  }
  
  fs.writeFileSync(
    '/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/TARGET-URL-REPORT.md',
    report
  );
  
  // Create CSV for easier review
  let csv = 'Old URL,Target URL,Status\n';
  results.working.forEach(item => {
    csv += `"${item.from}","${item.to}","✅ Exists"\n`;
  });
  results.broken.forEach(item => {
    csv += `"${item.from}","${item.to}","❌ 404"\n`;
  });
  results.other.forEach(item => {
    csv += `"${item.from}","${item.to}","⚠️ Status ${item.targetStatus}"\n`;
  });
  
  fs.writeFileSync(
    '/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/target-url-validation.csv',
    csv
  );
  
  console.log('\n' + '='.repeat(60));
  console.log('TARGET URL VALIDATION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Working (target exists): ${results.working.length} (${((results.working.length / redirects.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Broken (target 404): ${results.broken.length} (${((results.broken.length / redirects.length) * 100).toFixed(1)}%)`);
  console.log(`⚠️  Other: ${results.other.length} (${((results.other.length / redirects.length) * 100).toFixed(1)}%)`);
  console.log('\nReports generated:');
  console.log('- TARGET-URL-REPORT.md (detailed analysis)');
  console.log('- target-url-validation.csv (spreadsheet format)');
  console.log('- target-url-results.json (raw data)');
}

// Run the check
checkTargetUrls().catch(console.error);