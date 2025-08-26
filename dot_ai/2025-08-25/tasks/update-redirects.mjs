#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the reports
const contentMatchReport = JSON.parse(fs.readFileSync(path.join(__dirname, 'content-match-report.json'), 'utf8'));
const sitemapMatchReport = JSON.parse(fs.readFileSync(path.join(__dirname, 'sitemap-match-report.json'), 'utf8'));
const verificationReport = JSON.parse(fs.readFileSync(path.join(__dirname, 'url-verification-report.json'), 'utf8'));

// Create a map of all suggested fixes
const fixes = {};
const noMatches = new Set();

// Add content match suggestions
for (const match of contentMatchReport.partialMatches) {
  fixes[match.oldPath] = match.match.url;
}

// Add sitemap match suggestions
for (const match of sitemapMatchReport.matches) {
  if (!fixes[match.oldPath]) {
    fixes[match.oldPath] = match.sitemapMatch.url;
  }
}

// Track URLs with no matches
for (const noMatch of contentMatchReport.noMatches) {
  if (!fixes[noMatch.oldPath]) {
    noMatches.add(noMatch.oldPath);
  }
}

// Remove any from noMatches that were found in sitemap
for (const match of sitemapMatchReport.matches) {
  noMatches.delete(match.oldPath);
}

console.log(`Found ${Object.keys(fixes).length} fixable redirects`);
console.log(`Found ${noMatches.size} redirects with no matches`);

// Read the original file
const redirectsPath = '/Users/jack/projects/nx-worktrees/DOC-154/nx-dev/nx-dev/redirect-rules-docs-to-astro.js';
const originalContent = fs.readFileSync(redirectsPath, 'utf8');

// Backup the original file
const backupPath = path.join(__dirname, 'redirect-rules-docs-to-astro.js.backup');
fs.writeFileSync(backupPath, originalContent);
console.log(`Backed up original file to ${backupPath}`);

// Parse the file to extract the object
const objectMatch = originalContent.match(/const\s+docsToAstroRedirects\s*=\s*({[\s\S]*?});/);
if (!objectMatch) {
  console.error('Could not find docsToAstroRedirects object');
  process.exit(1);
}

// Split the content into parts
const beforeObject = originalContent.substring(0, objectMatch.index);
const afterObject = originalContent.substring(objectMatch.index + objectMatch[0].length);

// Build the new redirect object
let newRedirectsContent = 'const docsToAstroRedirects = {\n';

// Track which redirects we've processed
const processedPaths = new Set();

// Group redirects by top-level section for better organization
const redirectsBySection = {};
const brokenBySection = {};

// Process all redirect entries
const lines = objectMatch[1].split('\n');
for (const line of lines) {
  const match = line.match(/^\s*"([^"]+)"\s*:\s*"([^"]+)"/);
  if (match) {
    const oldPath = match[1];
    const currentNewPath = match[2];
    
    const section = oldPath.split('/')[1] || 'root';
    
    if (fixes[oldPath]) {
      // This redirect has a suggested fix
      if (!redirectsBySection[section]) redirectsBySection[section] = [];
      redirectsBySection[section].push({
        oldPath,
        currentNewPath,
        suggestedPath: fixes[oldPath],
        isFixed: true
      });
      processedPaths.add(oldPath);
    } else if (noMatches.has(oldPath)) {
      // This redirect has no match - will be commented out
      if (!brokenBySection[section]) brokenBySection[section] = [];
      brokenBySection[section].push({
        oldPath,
        currentNewPath,
        isBroken: true
      });
      processedPaths.add(oldPath);
    } else if (verificationReport.working.find(w => w.oldPath === oldPath)) {
      // This redirect is already working
      if (!redirectsBySection[section]) redirectsBySection[section] = [];
      redirectsBySection[section].push({
        oldPath,
        currentNewPath,
        isWorking: true
      });
      processedPaths.add(oldPath);
    }
  }
}

// Sort sections alphabetically
const sortedSections = Object.keys(redirectsBySection).sort();
const sortedBrokenSections = Object.keys(brokenBySection).sort();

// Write working and fixed redirects
for (const section of sortedSections) {
  const sectionRedirects = redirectsBySection[section];
  
  // Add section comment
  newRedirectsContent += `  // ========== ${section.toUpperCase()} ==========\n`;
  
  // Separate working from fixed
  const working = sectionRedirects.filter(r => r.isWorking);
  const fixed = sectionRedirects.filter(r => r.isFixed);
  
  if (working.length > 0) {
    newRedirectsContent += `  // Working redirects (${working.length})\n`;
    for (const redirect of working) {
      newRedirectsContent += `  "${redirect.oldPath}": "${redirect.currentNewPath}",\n`;
    }
  }
  
  if (fixed.length > 0) {
    if (working.length > 0) newRedirectsContent += '\n';
    newRedirectsContent += `  // Fixed redirects - content found at new location (${fixed.length})\n`;
    for (const redirect of fixed) {
      if (redirect.currentNewPath !== redirect.suggestedPath) {
        newRedirectsContent += `  // OLD: "${redirect.oldPath}": "${redirect.currentNewPath}",\n`;
        newRedirectsContent += `  "${redirect.oldPath}": "${redirect.suggestedPath}",\n`;
      } else {
        newRedirectsContent += `  "${redirect.oldPath}": "${redirect.suggestedPath}",\n`;
      }
    }
  }
  
  newRedirectsContent += '\n';
}

// Add broken redirects as comments at the end
if (sortedBrokenSections.length > 0) {
  newRedirectsContent += `  // ========================================\n`;
  newRedirectsContent += `  // BROKEN REDIRECTS - NO CONTENT FOUND\n`;
  newRedirectsContent += `  // These URLs have no matching content in the new docs\n`;
  newRedirectsContent += `  // and should be reviewed for removal or content migration\n`;
  newRedirectsContent += `  // ========================================\n\n`;
  
  for (const section of sortedBrokenSections) {
    const sectionRedirects = brokenBySection[section];
    newRedirectsContent += `  // ${section.toUpperCase()} - ${sectionRedirects.length} broken\n`;
    
    for (const redirect of sectionRedirects) {
      newRedirectsContent += `  // "${redirect.oldPath}": "${redirect.currentNewPath}", // NO MATCH FOUND\n`;
    }
    newRedirectsContent += '\n';
  }
}

// Remove trailing comma and close the object
newRedirectsContent = newRedirectsContent.replace(/,(\s*)$/, '$1');
newRedirectsContent += '};\n';

// Combine the parts
const newFileContent = beforeObject + newRedirectsContent + afterObject;

// Write the updated file
fs.writeFileSync(redirectsPath, newFileContent);
console.log(`Updated ${redirectsPath}`);

// Create a summary
const summaryPath = path.join(__dirname, 'redirect-update-summary.txt');
let summary = `REDIRECT RULES UPDATE SUMMARY
Generated: ${new Date().toISOString()}

Statistics:
- Total redirects processed: ${processedPaths.size}
- Working redirects kept: ${Object.values(redirectsBySection).flat().filter(r => r.isWorking).length}
- Redirects fixed: ${Object.values(redirectsBySection).flat().filter(r => r.isFixed).length}
- Broken redirects commented: ${Object.values(brokenBySection).flat().length}

Sections updated:
`;

for (const section of sortedSections) {
  const sectionRedirects = redirectsBySection[section];
  const working = sectionRedirects.filter(r => r.isWorking).length;
  const fixed = sectionRedirects.filter(r => r.isFixed).length;
  summary += `- ${section}: ${working} working, ${fixed} fixed\n`;
}

summary += `\nBroken sections (commented out):\n`;
for (const section of sortedBrokenSections) {
  summary += `- ${section}: ${brokenBySection[section].length} broken\n`;
}

fs.writeFileSync(summaryPath, summary);
console.log(`\nSummary saved to ${summaryPath}`);
console.log('\n' + summary);