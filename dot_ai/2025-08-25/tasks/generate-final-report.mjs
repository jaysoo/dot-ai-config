#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all reports
const reports = {
  verification: JSON.parse(fs.readFileSync(path.join(__dirname, 'url-verification-report.json'), 'utf8')),
  contentMatch: JSON.parse(fs.readFileSync(path.join(__dirname, 'content-match-report.json'), 'utf8')),
  sitemapMatch: JSON.parse(fs.readFileSync(path.join(__dirname, 'sitemap-match-report.json'), 'utf8'))
};

// Generate comprehensive report
function generateFinalReport() {
  const timestamp = new Date().toISOString();
  
  let report = `# COMPREHENSIVE REDIRECT VERIFICATION REPORT
Generated: ${timestamp}
Source: nx-dev/nx-dev/redirect-rules-docs-to-astro.js
Target: https://canary.nx.dev

================================================================================

## EXECUTIVE SUMMARY

Total redirect rules analyzed: 1078
- ✅ Working redirects (200 OK): 123 (11.4%)
- ❌ Broken redirects: 955 (88.6%)
- 🔄 Redirected URLs: 0 (0%)

================================================================================

## WORKING REDIRECTS (123 URLs)

These redirects are functioning correctly with new URLs returning 200 OK:

`;

  // Add working redirects
  const workingBySection = {};
  for (const working of reports.verification.working) {
    const section = working.oldPath.split('/')[1] || 'root';
    if (!workingBySection[section]) workingBySection[section] = [];
    workingBySection[section].push(working);
  }

  for (const [section, urls] of Object.entries(workingBySection).sort()) {
    report += `\n### ${section.toUpperCase()} Section (${urls.length} working)\n\n`;
    for (const url of urls.slice(0, 10)) { // Show first 10 per section
      report += `✅ ${url.oldPath} -> ${url.newPath}\n`;
    }
    if (urls.length > 10) {
      report += `... and ${urls.length - 10} more\n`;
    }
  }

  report += `\n================================================================================

## BROKEN REDIRECTS ANALYSIS (955 URLs)

### Phase 2: Content File Matching

Searched astro-docs/src/content for matching content files:
- 📁 Total content files found: 354
- ✅ Exact path matches: ${reports.contentMatch.summary.exactMatches}
- 🔄 Partial/relocated matches: ${reports.contentMatch.summary.partialMatches}
- ❌ No content matches: ${reports.contentMatch.summary.noMatches}

`;

  // Add some examples of partial matches
  if (reports.contentMatch.partialMatches.length > 0) {
    report += `#### Sample Partial Matches (content exists at different path):\n\n`;
    for (const match of reports.contentMatch.partialMatches.slice(0, 10)) {
      report += `Original: ${match.oldPath}\n`;
      report += `Expected: ${match.newPath}\n`;
      report += `Found at: ${match.match.url}\n`;
      report += `File: ${match.match.file}\n\n`;
    }
  }

  report += `\n### Phase 3: Sitemap Matching

Checked https://canary.nx.dev/docs/sitemap-0.xml for remaining ${reports.sitemapMatch.summary.totalAnalyzed} URLs:
- 🌐 Total URLs in sitemap: ${reports.sitemapMatch.summary.sitemapTotalUrls}
- ✅ Found in sitemap: ${reports.sitemapMatch.summary.foundInSitemap}
- ❌ Not found in sitemap: ${reports.sitemapMatch.summary.notInSitemap}

`;

  // Add sitemap matches
  if (reports.sitemapMatch.matches.length > 0) {
    report += `#### Sample Sitemap Matches:\n\n`;
    for (const match of reports.sitemapMatch.matches.slice(0, 10)) {
      report += `${match.oldPath} -> ${match.sitemapMatch.url} (${match.sitemapMatch.type} match)\n`;
    }
  }

  report += `\n================================================================================

## BROKEN LINKS LIST

The following categories of broken redirects were identified:

### 1. Content Exists but URL Structure Changed (${reports.contentMatch.summary.partialMatches} URLs)
These can be fixed by updating the redirect target to the new location.

### 2. Content Not Found Anywhere (${reports.sitemapMatch.summary.notInSitemap} URLs)
These may require content migration or should be removed from redirects.

### 3. Requires Manual Review (${reports.contentMatch.summary.exactMatches} URLs)
Content appears to exist at the expected path but URL returns 404.

`;

  // List all broken URLs grouped by category
  report += `\n### DETAILED BROKEN LINKS LIST\n\n`;

  // Group broken URLs by their resolution status
  const categorized = {
    fixable: [], // Has content or sitemap match
    needsContent: [], // No match found anywhere
    investigate: [] // Exact match but still 404
  };

  for (const broken of reports.verification.broken) {
    const contentMatch = reports.contentMatch.partialMatches.find(m => m.oldPath === broken.oldPath);
    const sitemapMatch = reports.sitemapMatch.matches.find(m => m.oldPath === broken.oldPath);
    const exactMatch = reports.contentMatch.exactMatches.find(m => m.oldPath === broken.oldPath);
    
    if (exactMatch) {
      categorized.investigate.push({
        ...broken,
        reason: 'Content exists at path but URL returns 404'
      });
    } else if (contentMatch || sitemapMatch) {
      categorized.fixable.push({
        ...broken,
        suggestedFix: contentMatch?.match.url || sitemapMatch?.sitemapMatch.url
      });
    } else {
      categorized.needsContent.push(broken);
    }
  }

  report += `#### FIXABLE (${categorized.fixable.length} URLs) - Update redirect target\n\n`;
  for (const item of categorized.fixable.slice(0, 50)) {
    report += `"${item.oldPath}": "${item.suggestedFix}",\n`;
  }
  if (categorized.fixable.length > 50) {
    report += `\n... and ${categorized.fixable.length - 50} more fixable redirects\n`;
  }

  report += `\n#### NEEDS CONTENT MIGRATION (${categorized.needsContent.length} URLs)\n\n`;
  const bySection = {};
  for (const item of categorized.needsContent) {
    const section = item.oldPath.split('/').slice(0, 3).join('/');
    if (!bySection[section]) bySection[section] = [];
    bySection[section].push(item);
  }
  
  for (const [section, items] of Object.entries(bySection).slice(0, 20)) {
    report += `\n${section} (${items.length} URLs):\n`;
    for (const item of items.slice(0, 5)) {
      report += `  ${item.oldPath} -> ${item.newPath}\n`;
    }
    if (items.length > 5) {
      report += `  ... and ${items.length - 5} more\n`;
    }
  }

  report += `\n#### REQUIRES INVESTIGATION (${categorized.investigate.length} URLs)\n`;
  report += `These have content files but URLs return 404:\n\n`;
  for (const item of categorized.investigate.slice(0, 20)) {
    report += `${item.oldPath} -> ${item.newPath}\n`;
  }

  report += `\n================================================================================

## RECOMMENDATIONS

1. **Immediate Actions:**
   - Apply the ${categorized.fixable.length} fixable redirects by updating targets
   - Investigate the ${categorized.investigate.length} URLs that have content but return 404

2. **Content Migration:**
   - Review ${categorized.needsContent.length} URLs that need content migration
   - Priority sections: ${Object.keys(bySection).slice(0, 5).join(', ')}

3. **Validation:**
   - After fixes, re-run verification to ensure all redirects work
   - Consider adding automated tests for critical redirects

================================================================================

## FILES GENERATED

1. url-verification-report.json - Detailed URL verification results
2. content-match-report.json - Content file matching analysis
3. sitemap-match-report.json - Sitemap matching results
4. working-redirects.txt - List of working redirects
5. broken-urls.txt - List of broken URLs
6. suggested-redirect-fixes.txt - Suggested fixes from content matching
7. sitemap-suggested-fixes.txt - Suggested fixes from sitemap matching
8. FINAL-REPORT.md - This comprehensive report

================================================================================
`;

  // Save the final report
  const reportPath = path.join(__dirname, 'FINAL-REPORT.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\n✅ Final comprehensive report saved to: ${reportPath}`);

  // Also create a JSON summary for programmatic use
  const jsonSummary = {
    timestamp,
    summary: {
      total: 1078,
      working: reports.verification.working.length,
      broken: reports.verification.broken.length,
      fixable: categorized.fixable.length,
      needsContent: categorized.needsContent.length,
      needsInvestigation: categorized.investigate.length
    },
    fixableRedirects: categorized.fixable.map(item => ({
      old: item.oldPath,
      current: item.newPath,
      suggested: item.suggestedFix
    }))
  };

  const jsonPath = path.join(__dirname, 'redirect-fixes.json');
  fs.writeFileSync(jsonPath, JSON.stringify(jsonSummary, null, 2));
  console.log(`✅ JSON fixes file saved to: ${jsonPath}`);

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('FINAL SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total Redirects: 1078`);
  console.log(`✅ Working: ${reports.verification.working.length} (${(reports.verification.working.length/1078*100).toFixed(1)}%)`);
  console.log(`❌ Broken: ${reports.verification.broken.length} (${(reports.verification.broken.length/1078*100).toFixed(1)}%)`);
  console.log(`\nOf the broken URLs:`);
  console.log(`  🔧 Fixable: ${categorized.fixable.length} (have alternative paths)`);
  console.log(`  📝 Need Content: ${categorized.needsContent.length} (content not found)`);
  console.log(`  🔍 Need Investigation: ${categorized.investigate.length} (content exists but 404)`);
  console.log('='.repeat(80));
}

// Run the report generation
generateFinalReport();