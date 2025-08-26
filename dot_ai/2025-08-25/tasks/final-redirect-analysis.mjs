#!/usr/bin/env node
import fs from 'fs';

const results = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/full-redirect-results.json', 'utf-8'));

// Categorize results more specifically
const categories = {
  working: [],
  broken404: [],
  noRedirect: [],        // Old URL exists, doesn't redirect at all
  wrongRedirect: [],     // Redirects but to wrong place
  partialRedirect: []    // Redirects to parent or related page
};

// Re-categorize the results
results.working.forEach(item => categories.working.push(item));
results.broken.forEach(item => categories.broken404.push(item));

results.potentiallyFixed.forEach(item => {
  const expectedPath = item.to;
  const actualPath = item.actualPath;
  
  // Check if it's not redirecting at all (staying at old URL)
  if (actualPath === item.from) {
    categories.noRedirect.push(item);
  }
  // Check if it's redirecting to a parent page
  else if (expectedPath.startsWith(actualPath) || actualPath.includes('/intro')) {
    categories.partialRedirect.push(item);
  }
  // Otherwise it's redirecting to wrong place
  else {
    categories.wrongRedirect.push(item);
  }
});

// Generate comprehensive report
let report = '# COMPREHENSIVE REDIRECT ANALYSIS FOR canary.nx.dev\n\n';
report += `Generated: ${new Date().toISOString()}\n`;
report += `Total redirect rules analyzed: 1078\n\n`;

report += '## EXECUTIVE SUMMARY\n\n';
report += `| Status | Count | Percentage | Description |\n`;
report += `|--------|-------|------------|-------------|\n`;
report += `| ✅ **WORKING** | ${categories.working.length} | ${(categories.working.length/1078*100).toFixed(1)}% | Redirects correctly to expected URL |\n`;
report += `| ❌ **BROKEN (404)** | ${categories.broken404.length} | ${(categories.broken404.length/1078*100).toFixed(1)}% | Old URL returns 404 error |\n`;
report += `| 🔴 **NO REDIRECT** | ${categories.noRedirect.length} | ${(categories.noRedirect.length/1078*100).toFixed(1)}% | Old URL exists but doesn't redirect |\n`;
report += `| 🟡 **PARTIAL REDIRECT** | ${categories.partialRedirect.length} | ${(categories.partialRedirect.length/1078*100).toFixed(1)}% | Redirects to parent/intro page |\n`;
report += `| 🟠 **WRONG REDIRECT** | ${categories.wrongRedirect.length} | ${(categories.wrongRedirect.length/1078*100).toFixed(1)}% | Redirects to unexpected location |\n\n`;

// Key findings
report += '## KEY FINDINGS\n\n';
report += '1. **Almost no redirects are working as specified** - Only 1 out of 1078 redirects work correctly\n';
report += '2. **Most old URLs still exist** - ' + categories.noRedirect.length + ' URLs are accessible at their old locations without any redirect\n';
report += '3. **Many URLs redirect to parent pages** - ' + categories.partialRedirect.length + ' URLs redirect to intro or parent pages instead of specific pages\n';
report += '4. **Major restructuring evident** - URLs like `/nx-api/*` now redirect to `/technologies/*/api`\n\n';

// Working redirects
if (categories.working.length > 0) {
  report += '## ✅ WORKING REDIRECTS\n\n';
  categories.working.forEach(item => {
    report += `- \`${item.from}\` → \`${item.to}\` ✓\n`;
  });
  report += '\n';
}

// Broken URLs
if (categories.broken404.length > 0) {
  report += '## ❌ BROKEN LINKS (404)\n\n';
  report += 'These URLs return 404 errors:\n\n';
  categories.broken404.forEach(item => {
    report += `- \`${item.from}\` → \`${item.to}\`\n`;
  });
  report += '\n';
}

// No redirects (most problematic)
report += `## 🔴 NO REDIRECT IN PLACE (${categories.noRedirect.length})\n\n`;
report += 'These old URLs are still accessible but DO NOT redirect. This is the most critical issue:\n\n';

// Group by section
const noRedirectSections = {};
categories.noRedirect.forEach(item => {
  const section = item.from.split('/')[1] || 'root';
  if (!noRedirectSections[section]) {
    noRedirectSections[section] = [];
  }
  noRedirectSections[section].push(item);
});

Object.keys(noRedirectSections).sort().forEach(section => {
  const items = noRedirectSections[section];
  report += `### /${section}/* (${items.length} URLs)\n\n`;
  items.slice(0, 10).forEach(item => {
    report += `- \`${item.from}\` should redirect to \`${item.to}\`\n`;
  });
  if (items.length > 10) {
    report += `... and ${items.length - 10} more\n`;
  }
  report += '\n';
});

// Partial redirects
report += `## 🟡 PARTIAL REDIRECTS (${categories.partialRedirect.length})\n\n`;
report += 'These URLs redirect to parent or intro pages instead of the specific page:\n\n';

const partialSamples = categories.partialRedirect.slice(0, 20);
partialSamples.forEach(item => {
  report += `- \`${item.from}\`\n`;
  report += `  - Expected: \`${item.to}\`\n`;
  report += `  - Actual: \`${item.actualPath}\`\n`;
});
if (categories.partialRedirect.length > 20) {
  report += `\n... and ${categories.partialRedirect.length - 20} more partial redirects\n`;
}

// Wrong redirects
report += `\n## 🟠 WRONG REDIRECTS (${categories.wrongRedirect.length})\n\n`;
report += 'These URLs redirect to completely different locations:\n\n';

// Identify patterns
const patterns = {
  'nx-api-to-technologies': [],
  'recipes-to-technologies': [],
  'ci-restructured': [],
  'other': []
};

categories.wrongRedirect.forEach(item => {
  if (item.from.startsWith('/nx-api/') && item.actualPath.includes('/technologies/')) {
    patterns['nx-api-to-technologies'].push(item);
  } else if (item.from.startsWith('/recipes/') && item.actualPath.includes('/technologies/')) {
    patterns['recipes-to-technologies'].push(item);
  } else if (item.from.startsWith('/ci/')) {
    patterns['ci-restructured'].push(item);
  } else {
    patterns['other'].push(item);
  }
});

if (patterns['nx-api-to-technologies'].length > 0) {
  report += `### Pattern: /nx-api/* → /technologies/*/api (${patterns['nx-api-to-technologies'].length} URLs)\n\n`;
  patterns['nx-api-to-technologies'].slice(0, 5).forEach(item => {
    report += `- \`${item.from}\` → \`${item.actualPath}\` (Expected: \`${item.to}\`)\n`;
  });
  report += '\n';
}

if (patterns['recipes-to-technologies'].length > 0) {
  report += `### Pattern: /recipes/* → /technologies/*/recipes/* (${patterns['recipes-to-technologies'].length} URLs)\n\n`;
  patterns['recipes-to-technologies'].slice(0, 5).forEach(item => {
    report += `- \`${item.from}\` → \`${item.actualPath}\` (Expected: \`${item.to}\`)\n`;
  });
  report += '\n';
}

// Action items
report += '## ACTION ITEMS\n\n';
report += '### CRITICAL - Fix No-Redirect URLs\n\n';
report += `${categories.noRedirect.length} URLs need redirects implemented. Priority sections:\n\n`;

const prioritySections = Object.keys(noRedirectSections)
  .sort((a, b) => noRedirectSections[b].length - noRedirectSections[a].length)
  .slice(0, 5);

prioritySections.forEach(section => {
  report += `- **/${section}/*** - ${noRedirectSections[section].length} URLs need redirects\n`;
});

report += '\n### HIGH PRIORITY - Review Partial Redirects\n\n';
report += `${categories.partialRedirect.length} URLs redirect to parent/intro pages. Verify if this is intentional.\n\n`;

report += '### MEDIUM PRIORITY - Fix Wrong Redirects\n\n';
report += `${categories.wrongRedirect.length} URLs redirect to unexpected locations. Major patterns:\n`;
report += `- /nx-api/* URLs now go to /technologies/*/api\n`;
report += `- /recipes/TECH/* URLs now go to /technologies/TECH/recipes/*\n\n`;

report += '## RECOMMENDATIONS\n\n';
report += '1. **Implement missing redirects** - The redirect rules exist but are not active on the server\n';
report += '2. **Review URL restructuring** - Many URLs follow new patterns (technologies-based organization)\n';
report += '3. **Update redirect rules** - Align the redirect-rules-docs-to-astro.js with actual site structure\n';
report += '4. **Consider catch-all patterns** - Use pattern-based redirects for common transformations\n';

// Save report
fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/FINAL-REDIRECT-REPORT.md', report);

// Also create a CSV for easier review
let csv = 'Old URL,Expected New URL,Actual Behavior,Status,Category\n';
categories.working.forEach(item => {
  csv += `"${item.from}","${item.to}","${item.to}","Working","✅ Working"\n`;
});
categories.broken404.forEach(item => {
  csv += `"${item.from}","${item.to}","404 Error","Broken","❌ 404"\n`;
});
categories.noRedirect.forEach(item => {
  csv += `"${item.from}","${item.to}","Stays at ${item.from}","No Redirect","🔴 No Redirect"\n`;
});
categories.partialRedirect.forEach(item => {
  csv += `"${item.from}","${item.to}","${item.actualPath}","Partial","🟡 Partial"\n`;
});
categories.wrongRedirect.forEach(item => {
  csv += `"${item.from}","${item.to}","${item.actualPath}","Wrong","🟠 Wrong"\n`;
});

fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirect-analysis.csv', csv);

console.log('=' .repeat(70));
console.log('FINAL REDIRECT ANALYSIS COMPLETE');
console.log('=' .repeat(70));
console.log(`\n✅ Working: ${categories.working.length}`);
console.log(`❌ Broken (404): ${categories.broken404.length}`);
console.log(`🔴 No Redirect: ${categories.noRedirect.length}`);
console.log(`🟡 Partial Redirect: ${categories.partialRedirect.length}`);
console.log(`🟠 Wrong Redirect: ${categories.wrongRedirect.length}`);
console.log(`\nTotal: 1078\n`);
console.log('Reports generated:');
console.log('- FINAL-REDIRECT-REPORT.md (comprehensive analysis)');
console.log('- redirect-analysis.csv (spreadsheet format)');
console.log('- full-redirect-results.json (raw data)');