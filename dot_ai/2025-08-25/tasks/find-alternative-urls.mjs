#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const results = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/target-url-results.json', 'utf-8'));

// Get all broken URLs
const brokenUrls = results.broken;
console.log(`Found ${brokenUrls.length} broken target URLs to analyze...`);

// Known patterns for URL restructuring
const urlPatterns = [
  // Recipes moved to technology-specific sections
  { 
    pattern: /^\/docs\/recipes\/(.+?)\/(.+)$/,
    alternatives: [
      (match) => `/docs/technologies/${match[1]}/recipes/${match[2]}`,
      (match) => `/docs/guides/${match[2]}`,
      (match) => `/docs/troubleshooting/${match[2]}`
    ]
  },
  // CI content might be at root level
  {
    pattern: /^\/docs\/ci\/(.+)$/,
    alternatives: [
      (match) => `/ci/${match[1]}`,
      (match) => `/docs/features/ci-${match[1]}`,
      (match) => `/docs/guides/ci-${match[1]}`
    ]
  },
  // Extending-nx might be under guides
  {
    pattern: /^\/docs\/extending-nx\/(.+)$/,
    alternatives: [
      (match) => `/extending-nx/${match[1]}`,
      (match) => `/docs/guides/extending-nx/${match[1]}`,
      (match) => `/docs/guides/${match[1]}`
    ]
  },
  // nx-api redirected to technologies
  {
    pattern: /^\/docs\/nx-api\/(.+)$/,
    alternatives: [
      (match) => `/docs/technologies/${match[1]}/api`,
      (match) => `/technologies/${match[1]}/api`,
      (match) => `/docs/reference/${match[1]}`
    ]
  }
];

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

async function findAlternatives() {
  const categorized = {
    fixable: [],        // Found working alternative
    needsInvestigation: [], // Has potential patterns but none work
    noAlternative: []   // No pattern matches
  };
  
  console.log('\nSearching for alternative URLs...\n');
  
  let processed = 0;
  const batchSize = 5;
  
  // Process broken URLs
  for (let i = 0; i < brokenUrls.length; i += batchSize) {
    const batch = brokenUrls.slice(i, Math.min(i + batchSize, brokenUrls.length));
    
    for (const item of batch) {
      processed++;
      let foundAlternative = false;
      const potentialAlternatives = [];
      
      // Check each pattern
      for (const patternDef of urlPatterns) {
        const match = item.to.match(patternDef.pattern);
        if (match) {
          for (const altFunc of patternDef.alternatives) {
            const altUrl = altFunc(match);
            potentialAlternatives.push(altUrl);
            
            // Check if alternative exists
            const exists = await checkUrl(altUrl);
            if (exists) {
              categorized.fixable.push({
                ...item,
                workingAlternative: altUrl
              });
              console.log(`✅ [${processed}/${brokenUrls.length}] Found alternative for ${item.to} -> ${altUrl}`);
              foundAlternative = true;
              break;
            }
          }
          if (foundAlternative) break;
        }
      }
      
      if (!foundAlternative) {
        if (potentialAlternatives.length > 0) {
          categorized.needsInvestigation.push({
            ...item,
            triedAlternatives: potentialAlternatives
          });
          console.log(`⚠️  [${processed}/${brokenUrls.length}] No working alternative for ${item.to} (tried ${potentialAlternatives.length} options)`);
        } else {
          categorized.noAlternative.push(item);
          console.log(`❌ [${processed}/${brokenUrls.length}] No pattern matches for ${item.to}`);
        }
      }
      
      if (processed % 50 === 0) {
        console.log(`... Progress: ${processed}/${brokenUrls.length} ...`);
      }
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Generate report
  generateAlternativesReport(categorized);
}

function generateAlternativesReport(categorized) {
  let report = '# Alternative URLs Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  report += '## Summary\n\n';
  report += `- ✅ **Fixable with alternatives**: ${categorized.fixable.length}\n`;
  report += `- ⚠️ **Needs investigation**: ${categorized.needsInvestigation.length}\n`;
  report += `- ❌ **No alternatives found**: ${categorized.noAlternative.length}\n`;
  report += `- **Total broken URLs**: ${brokenUrls.length}\n\n`;
  
  // Fixable URLs
  if (categorized.fixable.length > 0) {
    report += `## ✅ FIXABLE - Alternative URLs Found (${categorized.fixable.length})\n\n`;
    report += 'Update these redirect rules to point to the working alternatives:\n\n';
    report += '```javascript\n';
    categorized.fixable.forEach(item => {
      report += `"${item.from}": "${item.workingAlternative}",  // was: ${item.to}\n`;
    });
    report += '```\n\n';
  }
  
  // URLs needing investigation
  if (categorized.needsInvestigation.length > 0) {
    report += `## ⚠️ NEEDS INVESTIGATION (${categorized.needsInvestigation.length})\n\n`;
    report += 'These URLs have patterns but no working alternatives were found:\n\n';
    
    const sample = categorized.needsInvestigation.slice(0, 20);
    sample.forEach(item => {
      report += `- \`${item.from}\` → \`${item.to}\`\n`;
      report += `  Tried: ${item.triedAlternatives.map(a => `\`${a}\``).join(', ')}\n`;
    });
    if (categorized.needsInvestigation.length > 20) {
      report += `\n... and ${categorized.needsInvestigation.length - 20} more\n`;
    }
  }
  
  // No alternatives
  if (categorized.noAlternative.length > 0) {
    report += `\n## ❌ NO ALTERNATIVES FOUND (${categorized.noAlternative.length})\n\n`;
    report += 'These URLs don\'t match any known patterns:\n\n';
    
    // Group by section
    const sections = {};
    categorized.noAlternative.forEach(item => {
      const section = item.to.split('/')[2] || 'root';
      if (!sections[section]) sections[section] = [];
      sections[section].push(item);
    });
    
    Object.keys(sections).sort().forEach(section => {
      const items = sections[section];
      report += `### ${section} (${items.length})\n\n`;
      items.slice(0, 10).forEach(item => {
        report += `- \`${item.from}\` → \`${item.to}\`\n`;
      });
      if (items.length > 10) {
        report += `... and ${items.length - 10} more\n`;
      }
      report += '\n';
    });
  }
  
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/ALTERNATIVES-REPORT.md', report);
  
  // Save JSON data
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/alternatives.json', 
    JSON.stringify(categorized, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('ANALYSIS COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Fixable with alternatives: ${categorized.fixable.length}`);
  console.log(`⚠️  Needs investigation: ${categorized.needsInvestigation.length}`);
  console.log(`❌ No alternatives found: ${categorized.noAlternative.length}`);
  console.log('\nReports generated:');
  console.log('- ALTERNATIVES-REPORT.md');
  console.log('- alternatives.json');
}

// Run analysis
findAlternatives().catch(console.error);