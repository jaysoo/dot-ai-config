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

// First, let's check if map.json exists
const mapJsonPath = '/Users/jack/projects/nx-worktrees/DOC-154/docs/map.json';
let urlMap = {};
try {
  if (fs.existsSync(mapJsonPath)) {
    const mapContent = fs.readFileSync(mapJsonPath, 'utf-8');
    urlMap = JSON.parse(mapContent);
    console.log('Loaded docs/map.json for URL mapping');
  }
} catch (err) {
  console.log('Could not load map.json:', err.message);
}

// Function to get first paragraph/sentence from a URL
async function getContentSnippet(url) {
  try {
    const fullUrl = `https://canary.nx.dev${url}`;
    // Get the HTML content
    const { stdout } = await execAsync(
      `curl -s "${fullUrl}" | grep -A 5 '<main\\|<article\\|<h1\\|<p' | head -20`,
      { timeout: 10000 }
    );
    
    // Extract text content (very basic extraction)
    const text = stdout
      .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
      .replace(/\s+/g, ' ')       // Normalize whitespace
      .trim()
      .substring(0, 200);         // Get first 200 chars
    
    return text;
  } catch (error) {
    return null;
  }
}

// Function to search for content in astro-docs
async function findContentInAstroDocs(searchText, originalUrl) {
  if (!searchText || searchText.length < 20) return [];
  
  const results = [];
  
  // Clean up search text for grep
  const searchPattern = searchText
    .substring(0, 50)
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')  // Escape regex chars
    .replace(/\s+/g, '.*');  // Allow flexible whitespace
  
  try {
    // Search in astro-docs directory
    const { stdout } = await execAsync(
      `find /Users/jack/projects/nx-worktrees/DOC-154/astro-docs -name "*.md" -o -name "*.mdx" -o -name "*.mdoc" | xargs grep -l "${searchPattern}" 2>/dev/null | head -10`,
      { timeout: 10000, maxBuffer: 1024 * 1024 * 10 }
    );
    
    const files = stdout.trim().split('\n').filter(Boolean);
    
    for (const file of files) {
      // Convert file path to URL
      const relativePath = file.replace('/Users/jack/projects/nx-worktrees/DOC-154/astro-docs/src/content/docs/', '');
      const urlPath = '/docs/' + relativePath
        .replace(/\.(md|mdx|mdoc)$/, '')
        .replace(/\/index$/, '');
      
      results.push({
        file,
        suggestedUrl: urlPath,
        confidence: 'content-match'
      });
    }
  } catch (error) {
    // Ignore errors, just return empty results
  }
  
  return results;
}

// Function to check if a URL exists
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

// Main analysis function
async function analyzeContent() {
  const results = {
    foundMatches: [],
    possibleMatches: [],
    noMatches: []
  };
  
  console.log('\nAnalyzing content for URLs with no alternatives...\n');
  
  let processed = 0;
  const batchSize = 5;
  
  // First, let's just try to find patterns in the URL mapping
  for (let i = 0; i < Math.min(noAlternatives.length, 100); i += batchSize) {  // Limit to first 100 for testing
    const batch = noAlternatives.slice(i, Math.min(i + batchSize, Math.min(noAlternatives.length, 100)));
    
    for (const item of batch) {
      processed++;
      console.log(`[${processed}/${Math.min(noAlternatives.length, 100)}] Analyzing ${item.from}...`);
      
      // Strategy 1: Check map.json if available
      let foundMatch = false;
      if (urlMap && Object.keys(urlMap).length > 0) {
        // Look for the old URL in map
        const mapEntry = urlMap[item.from];
        if (mapEntry) {
          const exists = await checkUrl(mapEntry);
          if (exists) {
            results.foundMatches.push({
              ...item,
              newUrl: mapEntry,
              method: 'map.json'
            });
            console.log(`  ✅ Found in map.json: ${mapEntry}`);
            foundMatch = true;
          }
        }
      }
      
      // Strategy 2: Get content from old URL and search in astro-docs
      if (!foundMatch) {
        const oldUrlContent = await getContentSnippet(item.from);
        if (oldUrlContent && oldUrlContent.length > 30) {
          console.log(`  Searching for content: "${oldUrlContent.substring(0, 50)}..."`);
          
          const matches = await findContentInAstroDocs(oldUrlContent, item.from);
          if (matches.length > 0) {
            // Check if the suggested URL exists
            for (const match of matches) {
              const exists = await checkUrl(match.suggestedUrl);
              if (exists) {
                results.foundMatches.push({
                  ...item,
                  newUrl: match.suggestedUrl,
                  method: 'content-search',
                  file: match.file
                });
                console.log(`  ✅ Found content match: ${match.suggestedUrl}`);
                foundMatch = true;
                break;
              }
            }
            
            if (!foundMatch) {
              results.possibleMatches.push({
                ...item,
                suggestions: matches
              });
              console.log(`  ⚠️  Possible matches found but URLs don't exist`);
            }
          }
        }
      }
      
      // Strategy 3: Try common URL transformations
      if (!foundMatch) {
        const transformations = [
          // Try without /docs prefix
          item.to.replace('/docs/', '/'),
          // Try with /guides instead of /recipes
          item.to.replace('/recipes/', '/guides/'),
          // Try under /troubleshooting
          item.to.replace('/recipes/', '/troubleshooting/'),
          // Try removing middle segments
          item.to.replace(/\/recipes\/[^\/]+\//, '/guides/'),
        ];
        
        for (const transformed of transformations) {
          if (transformed !== item.to) {
            const exists = await checkUrl(transformed);
            if (exists) {
              results.foundMatches.push({
                ...item,
                newUrl: transformed,
                method: 'url-transformation'
              });
              console.log(`  ✅ Found via transformation: ${transformed}`);
              foundMatch = true;
              break;
            }
          }
        }
      }
      
      if (!foundMatch) {
        results.noMatches.push(item);
        console.log(`  ❌ No match found`);
      }
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Generate report
  generateContentMatchReport(results);
}

function generateContentMatchReport(results) {
  let report = '# Content Matching Report for Broken URLs\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  report += '## Summary\n\n';
  report += `- ✅ **Found matches**: ${results.foundMatches.length}\n`;
  report += `- ⚠️ **Possible matches**: ${results.possibleMatches.length}\n`;
  report += `- ❌ **No matches**: ${results.noMatches.length}\n`;
  report += `- **Total analyzed**: ${results.foundMatches.length + results.possibleMatches.length + results.noMatches.length}\n\n`;
  
  // Found matches
  if (results.foundMatches.length > 0) {
    report += '## ✅ FOUND MATCHES\n\n';
    report += 'These URLs have been successfully matched to new locations:\n\n';
    report += '```javascript\n';
    report += '// Add these to your redirect rules:\n';
    results.foundMatches.forEach(item => {
      report += `"${item.from}": "${item.newUrl}",  // Found via: ${item.method}\n`;
    });
    report += '```\n\n';
  }
  
  // Possible matches
  if (results.possibleMatches.length > 0) {
    report += '## ⚠️ POSSIBLE MATCHES\n\n';
    report += 'Content was found but the URLs need verification:\n\n';
    results.possibleMatches.forEach(item => {
      report += `- \`${item.from}\` → \`${item.to}\`\n`;
      report += '  Suggestions:\n';
      item.suggestions.forEach(sugg => {
        report += `  - \`${sugg.suggestedUrl}\` (${sugg.file.split('/').pop()})\n`;
      });
    });
    report += '\n';
  }
  
  // No matches
  if (results.noMatches.length > 0) {
    report += '## ❌ NO MATCHES FOUND\n\n';
    report += 'These URLs could not be matched to any content:\n\n';
    
    // Group by section
    const sections = {};
    results.noMatches.forEach(item => {
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
  
  fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/CONTENT-MATCH-REPORT.md', report);
  
  console.log('\n' + '='.repeat(60));
  console.log('CONTENT MATCHING COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Found matches: ${results.foundMatches.length}`);
  console.log(`⚠️ Possible matches: ${results.possibleMatches.length}`);
  console.log(`❌ No matches: ${results.noMatches.length}`);
  console.log('\nReport saved to: CONTENT-MATCH-REPORT.md');
}

// Run the analysis
analyzeContent().catch(console.error);