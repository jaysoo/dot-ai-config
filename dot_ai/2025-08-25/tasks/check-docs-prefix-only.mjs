#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load the original redirects
const redirects = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirects.json', 'utf-8'));

console.log(`Total redirect rules: ${redirects.length}`);
console.log('Checking which TARGET URLs (that start with /docs) actually exist...\n');

const results = {
  correctDocsUrls: [],     // Target is /docs/* and exists
  incorrectNonDocs: [],    // Target is NOT /docs/* (wrong for astro migration)
  brokenDocsUrls: []       // Target is /docs/* but doesn't exist
};

// Check if URL exists
async function checkUrl(url) {
  try {
    const fullUrl = `https://canary.nx.dev${url}`;
    const { stdout } = await execAsync(
      `curl -s -o /dev/null -w "%{http_code}" "${fullUrl}"`,
      { timeout: 5000 }
    );
    return parseInt(stdout.trim()) === 200;
  } catch (error) {
    return false;
  }
}

async function analyzeRedirects() {
  let processed = 0;
  const batchSize = 20;
  
  for (let i = 0; i < redirects.length; i += batchSize) {
    const batch = redirects.slice(i, Math.min(i + batchSize, redirects.length));
    
    const batchResults = await Promise.all(
      batch.map(async (redirect) => {
        // Check if target starts with /docs
        const isDocsUrl = redirect.to.startsWith('/docs/');
        
        if (!isDocsUrl) {
          // This redirect doesn't point to /docs, so it's not for Astro docs
          return {
            ...redirect,
            category: 'non-docs'
          };
        }
        
        // Check if the /docs/* URL exists
        const exists = await checkUrl(redirect.to);
        
        return {
          ...redirect,
          category: exists ? 'docs-exists' : 'docs-broken'
        };
      })
    );
    
    // Categorize results
    batchResults.forEach(result => {
      processed++;
      
      if (result.category === 'docs-exists') {
        results.correctDocsUrls.push(result);
        console.log(`✅ [${processed}/${redirects.length}] ${result.from} → ${result.to} (docs URL exists)`);
      } else if (result.category === 'non-docs') {
        results.incorrectNonDocs.push(result);
        console.log(`⚠️  [${processed}/${redirects.length}] ${result.from} → ${result.to} (NOT a /docs URL)`);
      } else {
        results.brokenDocsUrls.push(result);
        console.log(`❌ [${processed}/${redirects.length}] ${result.from} → ${result.to} (docs URL broken)`);
      }
    });
    
    if (processed % 50 === 0) {
      console.log(`\n... Progress: ${processed}/${redirects.length} ...\n`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  generateReport();
}

function generateReport() {
  let report = '# Astro Docs Migration - Redirect Analysis (Docs Prefix Only)\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Total redirect rules: ${redirects.length}\n\n`;
  
  report += '## CRITICAL FINDING\n\n';
  report += '**For Astro docs migration, only URLs that redirect to `/docs/*` are relevant.**\n\n';
  
  report += '## Summary\n\n';
  report += `| Category | Count | Percentage | Description |\n`;
  report += `|----------|-------|------------|-------------|\n`;
  report += `| ✅ **Valid /docs/* URLs** | ${results.correctDocsUrls.length} | ${(results.correctDocsUrls.length/redirects.length*100).toFixed(1)}% | Target is /docs/* and exists |\n`;
  report += `| ❌ **Broken /docs/* URLs** | ${results.brokenDocsUrls.length} | ${(results.brokenDocsUrls.length/redirects.length*100).toFixed(1)}% | Target is /docs/* but doesn't exist |\n`;
  report += `| ⚠️ **Non-docs URLs** | ${results.incorrectNonDocs.length} | ${(results.incorrectNonDocs.length/redirects.length*100).toFixed(1)}% | Target is NOT /docs/* (incorrect for Astro) |\n\n`;
  
  // Valid docs URLs
  if (results.correctDocsUrls.length > 0) {
    report += `## ✅ VALID /docs/* REDIRECTS (${results.correctDocsUrls.length})\n\n`;
    report += 'These redirects correctly point to existing `/docs/*` URLs:\n\n';
    
    // Group by section
    const sections = {};
    results.correctDocsUrls.forEach(item => {
      const section = item.to.split('/')[2] || 'root';
      if (!sections[section]) sections[section] = [];
      sections[section].push(item);
    });
    
    Object.keys(sections).sort().forEach(section => {
      const items = sections[section];
      report += `### /docs/${section}/* (${items.length} working)\n`;
      items.slice(0, 5).forEach(item => {
        report += `- \`${item.from}\` → \`${item.to}\` ✓\n`;
      });
      if (items.length > 5) {
        report += `... and ${items.length - 5} more\n`;
      }
      report += '\n';
    });
  }
  
  // Incorrect non-docs URLs
  if (results.incorrectNonDocs.length > 0) {
    report += `## ⚠️ INCORRECT: NON-/docs/* URLs (${results.incorrectNonDocs.length})\n\n`;
    report += 'These redirects DO NOT point to `/docs/*` and need to be fixed:\n\n';
    
    // Show patterns
    const patterns = {};
    results.incorrectNonDocs.forEach(item => {
      const pattern = item.to.split('/')[1] || 'root';
      if (!patterns[pattern]) patterns[pattern] = 0;
      patterns[pattern]++;
    });
    
    report += '### Pattern breakdown:\n';
    Object.keys(patterns).sort((a, b) => patterns[b] - patterns[a]).forEach(pattern => {
      report += `- \`/${pattern}/*\`: ${patterns[pattern]} URLs\n`;
    });
    report += '\n';
    
    report += '### Sample incorrect mappings:\n';
    results.incorrectNonDocs.slice(0, 20).forEach(item => {
      report += `- \`${item.from}\` → \`${item.to}\` (should be → \`/docs/...\`)\n`;
    });
    if (results.incorrectNonDocs.length > 20) {
      report += `... and ${results.incorrectNonDocs.length - 20} more\n`;
    }
  }
  
  // Broken docs URLs
  if (results.brokenDocsUrls.length > 0) {
    report += `\n## ❌ BROKEN /docs/* URLs (${results.brokenDocsUrls.length})\n\n`;
    report += 'These correctly target `/docs/*` but the pages don\'t exist:\n\n';
    
    const brokenSections = {};
    results.brokenDocsUrls.forEach(item => {
      const section = item.to.split('/')[2] || 'root';
      if (!brokenSections[section]) brokenSections[section] = [];
      brokenSections[section].push(item);
    });
    
    Object.keys(brokenSections).sort().forEach(section => {
      const items = brokenSections[section];
      report += `### /docs/${section}/* (${items.length} broken)\n`;
      items.slice(0, 10).forEach(item => {
        report += `- \`${item.from}\` → \`${item.to}\` (404)\n`;
      });
      if (items.length > 10) {
        report += `... and ${items.length - 10} more\n`;
      }
      report += '\n';
    });
  }
  
  // Key insight
  report += '## KEY INSIGHT\n\n';
  report += `Only **${results.correctDocsUrls.length} out of ${redirects.length} (${(results.correctDocsUrls.length/redirects.length*100).toFixed(1)}%)** redirect rules are correctly configured for the Astro docs migration.\n\n`;
  report += `The remaining ${results.incorrectNonDocs.length + results.brokenDocsUrls.length} rules either:\n`;
  report += `- Point to non-/docs/* URLs (${results.incorrectNonDocs.length} rules)\n`;
  report += `- Point to /docs/* URLs that don't exist (${results.brokenDocsUrls.length} rules)\n\n`;
  
  report += '## RECOMMENDATION\n\n';
  report += '1. Fix the ' + results.incorrectNonDocs.length + ' redirects that don\'t point to `/docs/*`\n';
  report += '2. Create the missing content for ' + results.brokenDocsUrls.length + ' broken `/docs/*` URLs\n';
  report += '3. Or update these redirects to point to existing `/docs/*` pages\n';
  
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/DOCS-PREFIX-ONLY-REPORT.md', report);
  
  // Save JSON
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/docs-prefix-analysis.json',
    JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('DOCS PREFIX ANALYSIS COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Valid /docs/* URLs: ${results.correctDocsUrls.length} (${(results.correctDocsUrls.length/redirects.length*100).toFixed(1)}%)`);
  console.log(`❌ Broken /docs/* URLs: ${results.brokenDocsUrls.length} (${(results.brokenDocsUrls.length/redirects.length*100).toFixed(1)}%)`);
  console.log(`⚠️  Non-/docs/* URLs: ${results.incorrectNonDocs.length} (${(results.incorrectNonDocs.length/redirects.length*100).toFixed(1)}%)`);
  console.log('\nReport saved to: DOCS-PREFIX-ONLY-REPORT.md');
}

// Run analysis
analyzeRedirects().catch(console.error);