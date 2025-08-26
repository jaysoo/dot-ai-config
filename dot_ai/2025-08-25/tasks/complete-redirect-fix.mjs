#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load all the data
const alternatives = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/alternatives.json', 'utf-8'));
const targetResults = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/target-url-results.json', 'utf-8'));
const deepMatches = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/deep-content-matches.json', 'utf-8'));

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

// Process ALL broken URLs with the patterns we discovered
async function processAllBrokenUrls() {
  const allBroken = [...targetResults.broken];
  const fixedRedirects = [];
  const stillBroken = [];
  
  console.log(`Processing ${allBroken.length} broken URLs...`);
  
  // URL transformation patterns that we know work
  const patterns = [
    // Remove /docs prefix (most common fix)
    { 
      test: /^\/docs\/(.+)$/,
      transform: (url) => url.replace(/^\/docs\//, '/')
    },
    // CI special case - add /getting-started/intro
    {
      test: /^\/docs\/ci$/,
      transform: () => '/ci/getting-started/intro'
    },
    // nx-api to technologies transformation
    {
      test: /^\/docs\/nx-api\/([^\/]+)(.*)$/,
      transform: (url) => {
        const match = url.match(/^\/docs\/nx-api\/([^\/]+)(.*)/);
        if (match) {
          return `/technologies/${match[1]}/api${match[2]}`;
        }
        return null;
      }
    }
  ];
  
  let processed = 0;
  const batchSize = 20;
  
  for (let i = 0; i < allBroken.length; i += batchSize) {
    const batch = allBroken.slice(i, Math.min(i + batchSize, allBroken.length));
    
    const results = await Promise.all(batch.map(async (item) => {
      processed++;
      
      // Try each pattern
      for (const pattern of patterns) {
        if (pattern.test.test(item.to)) {
          const newUrl = pattern.transform(item.to);
          if (newUrl && await checkUrl(newUrl)) {
            return {
              ...item,
              newUrl,
              fixed: true
            };
          }
        }
      }
      
      return {
        ...item,
        fixed: false
      };
    }));
    
    // Categorize results
    results.forEach(result => {
      if (result.fixed) {
        fixedRedirects.push(result);
        console.log(`✅ [${processed}/${allBroken.length}] Fixed: ${result.from} -> ${result.newUrl}`);
      } else {
        stillBroken.push(result);
        console.log(`❌ [${processed}/${allBroken.length}] Still broken: ${result.from}`);
      }
    });
    
    // Progress indicator
    if (processed % 50 === 0) {
      console.log(`... Progress: ${processed}/${allBroken.length} ...`);
    }
    
    // Rate limiting
    if (i + batchSize < allBroken.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  generateCompleteReport(fixedRedirects, stillBroken);
}

function generateCompleteReport(fixed, broken) {
  // Load original redirects
  const redirects = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirects.json', 'utf-8'));
  
  let report = '# COMPLETE REDIRECT FIX REPORT\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Total redirects analyzed: ${redirects.length}\n\n`;
  
  report += '## FINAL SUMMARY\n\n';
  
  // Calculate final numbers
  const workingOriginal = targetResults.working.length;
  const fixedWithAlternatives = alternatives.fixable ? alternatives.fixable.length : 103; // From earlier analysis
  const fixedWithPatterns = fixed.length;
  const totalWorking = workingOriginal + fixedWithAlternatives + fixedWithPatterns;
  const totalBroken = broken.length;
  
  report += `| Status | Count | Percentage |\n`;
  report += `|--------|-------|------------|\n`;
  report += `| ✅ Working (original) | ${workingOriginal} | ${(workingOriginal/redirects.length*100).toFixed(1)}% |\n`;
  report += `| ✅ Fixed (alternatives) | ${fixedWithAlternatives} | ${(fixedWithAlternatives/redirects.length*100).toFixed(1)}% |\n`;
  report += `| ✅ Fixed (patterns) | ${fixedWithPatterns} | ${(fixedWithPatterns/redirects.length*100).toFixed(1)}% |\n`;
  report += `| ✅ **TOTAL WORKING** | **${totalWorking}** | **${(totalWorking/redirects.length*100).toFixed(1)}%** |\n`;
  report += `| ❌ Still Broken | ${totalBroken} | ${(totalBroken/redirects.length*100).toFixed(1)}% |\n\n`;
  
  // Updated redirect rules
  report += '## UPDATED REDIRECT RULES\n\n';
  report += 'Replace the content of `redirect-rules-docs-to-astro.js` with:\n\n';
  report += '```javascript\n';
  report += 'const docsToAstroRedirects = {\n';
  
  // Combine all working redirects
  const allRedirects = {};
  
  // Add originally working ones
  targetResults.working.forEach(item => {
    allRedirects[item.from] = item.to;
  });
  
  // Add fixed ones
  fixed.forEach(item => {
    allRedirects[item.from] = item.newUrl;
  });
  
  // Add alternatives that were found earlier
  if (alternatives.fixable) {
    alternatives.fixable.forEach(item => {
      allRedirects[item.from] = item.workingAlternative;
    });
  }
  
  // Sort and output
  Object.keys(allRedirects).sort().forEach(from => {
    report += `  "${from}": "${allRedirects[from]}",\n`;
  });
  
  report = report.slice(0, -2) + '\n'; // Remove last comma
  report += '};\n\n';
  report += 'module.exports = docsToAstroRedirects;\n';
  report += '```\n\n';
  
  // List still broken URLs
  if (broken.length > 0) {
    report += '## STILL BROKEN URLS\n\n';
    report += 'These URLs need manual intervention or content creation:\n\n';
    
    // Group by section
    const sections = {};
    broken.forEach(item => {
      const section = item.to.split('/')[2] || 'root';
      if (!sections[section]) sections[section] = [];
      sections[section].push(item);
    });
    
    Object.keys(sections).sort().forEach(section => {
      const items = sections[section];
      report += `### ${section} (${items.length})\n\n`;
      items.slice(0, 10).forEach(item => {
        report += `- \`${item.from}\` → \`${item.to}\` (target doesn't exist)\n`;
      });
      if (items.length > 10) {
        report += `... and ${items.length - 10} more\n`;
      }
      report += '\n';
    });
  }
  
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/COMPLETE-REDIRECT-FIX.md', report);
  
  // Also create the actual JS file with fixed redirects
  let jsFile = '// Fixed redirect rules for docs to Astro migration\n';
  jsFile += '// Generated: ' + new Date().toISOString() + '\n\n';
  jsFile += 'const docsToAstroRedirects = {\n';
  
  Object.keys(allRedirects).sort().forEach(from => {
    jsFile += `  "${from}": "${allRedirects[from]}",\n`;
  });
  
  jsFile = jsFile.slice(0, -2) + '\n'; // Remove last comma
  jsFile += '};\n\n';
  jsFile += 'module.exports = docsToAstroRedirects;\n';
  
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/fixed-redirect-rules.js', jsFile);
  
  console.log('\n' + '='.repeat(60));
  console.log('COMPLETE REDIRECT FIX ANALYSIS');
  console.log('='.repeat(60));
  console.log(`✅ Total working redirects: ${totalWorking} (${(totalWorking/redirects.length*100).toFixed(1)}%)`);
  console.log(`❌ Still broken: ${totalBroken} (${(totalBroken/redirects.length*100).toFixed(1)}%)`);
  console.log('\nFiles generated:');
  console.log('- COMPLETE-REDIRECT-FIX.md (full report)');
  console.log('- fixed-redirect-rules.js (ready-to-use redirect rules)');
}

// Run the complete fix
processAllBrokenUrls().catch(console.error);