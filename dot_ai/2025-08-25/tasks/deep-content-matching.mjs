#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Load the broken URLs that need alternatives
const alternatives = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/alternatives.json', 'utf-8'));
const noAlternatives = alternatives.noAlternative;

console.log(`Found ${noAlternatives.length} URLs with no alternatives to analyze...`);

// Parse map.json to build URL mappings
function parseMapJson() {
  const mapJsonPath = '/Users/jack/projects/nx-worktrees/DOC-154/docs/map.json';
  const urlMappings = {};
  
  try {
    const mapContent = JSON.parse(fs.readFileSync(mapJsonPath, 'utf-8'));
    
    function processItems(items, parentPath = '') {
      items.forEach(item => {
        if (item.file) {
          // Build the URL path from the file reference
          const urlPath = parentPath + (item.id ? `/${item.id}` : '');
          urlMappings[urlPath] = item.file;
        }
        if (item.itemList) {
          const newPath = parentPath + (item.id ? `/${item.id}` : '');
          processItems(item.itemList, newPath);
        }
      });
    }
    
    if (mapContent.content) {
      processItems(mapContent.content);
    }
    
    console.log(`Parsed map.json - found ${Object.keys(urlMappings).length} URL mappings`);
  } catch (err) {
    console.log('Could not parse map.json:', err.message);
  }
  
  return urlMappings;
}

// Get content from old URL on canary site
async function getPageContent(url) {
  try {
    const fullUrl = `https://canary.nx.dev${url}`;
    
    // Use a more sophisticated extraction
    const { stdout } = await execAsync(
      `curl -s "${fullUrl}" | sed -n '/<main/,/<\\/main>/p' | sed 's/<[^>]*>/ /g' | tr -s ' ' | head -c 500`,
      { timeout: 10000, maxBuffer: 1024 * 1024 }
    );
    
    const content = stdout.trim();
    return content.length > 50 ? content : null;
  } catch (error) {
    return null;
  }
}

// Search for content in astro-docs files
async function searchInAstroDocs(searchText) {
  if (!searchText || searchText.length < 30) return [];
  
  // Extract meaningful keywords from the search text
  const keywords = searchText
    .substring(0, 100)
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4)
    .slice(0, 5)
    .join('.*');
  
  const results = [];
  
  try {
    // Search in all markdown files
    const { stdout } = await execAsync(
      `find /Users/jack/projects/nx-worktrees/DOC-154/astro-docs/src/content/docs -type f \\( -name "*.md" -o -name "*.mdx" -o -name "*.mdoc" \\) -exec grep -l -i "${keywords}" {} \\; 2>/dev/null | head -10`,
      { timeout: 15000, maxBuffer: 1024 * 1024 * 10 }
    );
    
    const files = stdout.trim().split('\n').filter(Boolean);
    
    for (const file of files) {
      // Convert file path to URL
      const relativePath = file
        .replace('/Users/jack/projects/nx-worktrees/DOC-154/astro-docs/src/content/docs/', '')
        .replace(/\.(md|mdx|mdoc)$/, '')
        .replace(/\/index$/, '');
      
      const suggestedUrl = `/docs/${relativePath}`;
      
      results.push({
        file: path.basename(file),
        fullPath: file,
        suggestedUrl
      });
    }
  } catch (error) {
    // Ignore errors
  }
  
  return results;
}

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

// Main analysis
async function performDeepAnalysis() {
  const urlMappings = parseMapJson();
  
  const results = {
    foundMatches: [],
    possibleMatches: [],
    noContentFound: [],
    contentFoundNoMatch: []
  };
  
  console.log('\nPerforming deep content analysis...\n');
  
  // Limit to a sample for testing
  const samplSize = Math.min(100, noAlternatives.length);
  
  for (let i = 0; i < samplSize; i++) {
    const item = noAlternatives[i];
    console.log(`[${i + 1}/${samplSize}] Analyzing: ${item.from}`);
    
    let found = false;
    
    // Strategy 1: Direct URL transformations based on known patterns
    const urlTransformations = [
      // Remove /docs prefix
      { pattern: /^\/docs\/(.+)$/, replacement: '/$1' },
      // Recipe transformations
      { pattern: /^\/docs\/recipes\/([^\/]+)\/(.+)$/, replacement: '/docs/guides/$2' },
      { pattern: /^\/docs\/recipes\/([^\/]+)\/(.+)$/, replacement: '/docs/troubleshooting/$2' },
      // CI transformations
      { pattern: /^\/docs\/ci\/(.+)$/, replacement: '/ci/$1' },
      // nx-api transformations
      { pattern: /^\/docs\/nx-api\/([^\/]+)(.*)$/, replacement: '/docs/technologies/$1/api$2' },
      { pattern: /^\/docs\/nx-api\/([^\/]+)$/, replacement: '/technologies/$1/api' }
    ];
    
    for (const transform of urlTransformations) {
      if (transform.pattern.test(item.to)) {
        const newUrl = item.to.replace(transform.pattern, transform.replacement);
        if (await checkUrl(newUrl)) {
          results.foundMatches.push({
            ...item,
            newUrl,
            method: 'url-pattern'
          });
          console.log(`  ✅ Found via pattern: ${newUrl}`);
          found = true;
          break;
        }
      }
    }
    
    // Strategy 2: Get content from old URL and search for it
    if (!found) {
      const content = await getPageContent(item.from);
      
      if (content) {
        console.log(`  Content snippet: "${content.substring(0, 60)}..."`);
        
        const matches = await searchInAstroDocs(content);
        
        if (matches.length > 0) {
          // Check which matches actually exist
          for (const match of matches) {
            if (await checkUrl(match.suggestedUrl)) {
              results.foundMatches.push({
                ...item,
                newUrl: match.suggestedUrl,
                method: 'content-search',
                file: match.file
              });
              console.log(`  ✅ Found via content: ${match.suggestedUrl}`);
              found = true;
              break;
            }
          }
          
          if (!found) {
            results.possibleMatches.push({
              ...item,
              suggestions: matches,
              contentSnippet: content.substring(0, 100)
            });
            console.log(`  ⚠️ Found ${matches.length} possible matches`);
          }
        } else {
          results.contentFoundNoMatch.push({
            ...item,
            contentSnippet: content.substring(0, 100)
          });
          console.log(`  ❌ Content found but no matches in astro-docs`);
        }
      } else {
        results.noContentFound.push(item);
        console.log(`  ❌ Could not retrieve content from old URL`);
      }
    }
    
    // Small delay to avoid overwhelming the server
    if ((i + 1) % 10 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  generateDeepAnalysisReport(results, samplSize);
}

function generateDeepAnalysisReport(results, totalAnalyzed) {
  let report = '# Deep Content Matching Analysis\n\n';
  report += `Generated: ${new Date().toISOString()}\n`;
  report += `Analyzed: ${totalAnalyzed} URLs from the "no alternatives" list\n\n`;
  
  report += '## Summary\n\n';
  report += `| Category | Count | Description |\n`;
  report += `|----------|-------|-------------|\n`;
  report += `| ✅ Found matches | ${results.foundMatches.length} | Successfully matched to new URLs |\n`;
  report += `| ⚠️ Possible matches | ${results.possibleMatches.length} | Content found, needs verification |\n`;
  report += `| 🔍 Content but no match | ${results.contentFoundNoMatch.length} | Old content exists but not in astro-docs |\n`;
  report += `| ❌ No content found | ${results.noContentFound.length} | Could not retrieve old content |\n\n`;
  
  // Found matches - ready to use
  if (results.foundMatches.length > 0) {
    report += '## ✅ FOUND MATCHES - Ready to Use\n\n';
    report += 'Add these to your redirect rules:\n\n';
    report += '```javascript\n';
    results.foundMatches.forEach(item => {
      report += `"${item.from}": "${item.newUrl}",  // ${item.method}\n`;
    });
    report += '```\n\n';
  }
  
  // Possible matches - need verification
  if (results.possibleMatches.length > 0) {
    report += '## ⚠️ POSSIBLE MATCHES - Need Verification\n\n';
    results.possibleMatches.forEach(item => {
      report += `### ${item.from}\n`;
      report += `- Expected: \`${item.to}\`\n`;
      report += `- Content: "${item.contentSnippet}..."\n`;
      report += `- Suggestions:\n`;
      item.suggestions.forEach(sugg => {
        report += `  - \`${sugg.suggestedUrl}\` (${sugg.file})\n`;
      });
      report += '\n';
    });
  }
  
  // Content found but no match
  if (results.contentFoundNoMatch.length > 0) {
    report += '## 🔍 CONTENT EXISTS BUT NOT IN ASTRO-DOCS\n\n';
    report += 'These pages have content on the old site but no matching content in astro-docs:\n\n';
    results.contentFoundNoMatch.slice(0, 20).forEach(item => {
      report += `- \`${item.from}\` → \`${item.to}\`\n`;
      report += `  Content: "${item.contentSnippet}..."\n`;
    });
    if (results.contentFoundNoMatch.length > 20) {
      report += `\n... and ${results.contentFoundNoMatch.length - 20} more\n`;
    }
  }
  
  // No content found
  if (results.noContentFound.length > 0) {
    report += '\n## ❌ NO CONTENT RETRIEVED\n\n';
    report += 'Could not get content from these old URLs (might be truly broken):\n\n';
    const sample = results.noContentFound.slice(0, 20);
    sample.forEach(item => {
      report += `- \`${item.from}\` → \`${item.to}\`\n`;
    });
    if (results.noContentFound.length > 20) {
      report += `... and ${results.noContentFound.length - 20} more\n`;
    }
  }
  
  // Extrapolation
  if (totalAnalyzed < noAlternatives.length) {
    const successRate = (results.foundMatches.length / totalAnalyzed * 100).toFixed(1);
    const estimatedTotal = Math.round(noAlternatives.length * results.foundMatches.length / totalAnalyzed);
    
    report += '\n## Extrapolation\n\n';
    report += `Based on analyzing ${totalAnalyzed} out of ${noAlternatives.length} URLs:\n`;
    report += `- Success rate: ${successRate}%\n`;
    report += `- Estimated total fixable: ~${estimatedTotal} URLs\n`;
  }
  
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/DEEP-CONTENT-ANALYSIS.md', report);
  
  // Also save as JSON for further processing
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/deep-content-matches.json',
    JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('DEEP CONTENT ANALYSIS COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Found matches: ${results.foundMatches.length}`);
  console.log(`⚠️ Possible matches: ${results.possibleMatches.length}`);
  console.log(`🔍 Content but no match: ${results.contentFoundNoMatch.length}`);
  console.log(`❌ No content found: ${results.noContentFound.length}`);
  console.log('\nReports saved:');
  console.log('- DEEP-CONTENT-ANALYSIS.md');
  console.log('- deep-content-matches.json');
}

// Run the analysis
performDeepAnalysis().catch(console.error);