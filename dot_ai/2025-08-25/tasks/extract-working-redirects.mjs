#!/usr/bin/env node
import fs from 'fs';

// Load the analysis results
const docsAnalysis = JSON.parse(fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/docs-prefix-analysis.json', 'utf-8'));

// Extract only the working redirects
const workingRedirects = {};
docsAnalysis.correctDocsUrls.forEach(item => {
  workingRedirects[item.from] = item.to;
});

// Sort the keys
const sortedKeys = Object.keys(workingRedirects).sort();

// Generate the updated redirect rules file
let jsContent = `// TODO: Review and update redirect targets as needed
// NOTE: Only including the 123 working redirects (out of original 1078)
// The remaining 955 redirects point to /docs/* URLs that don't exist yet
const docsToAstroRedirects = {\n`;

sortedKeys.forEach((key, index) => {
  jsContent += `  "${key}": "${workingRedirects[key]}"`;
  if (index < sortedKeys.length - 1) {
    jsContent += ',';
  }
  jsContent += '\n';
});

jsContent += `};

module.exports = docsToAstroRedirects;
`;

// Save the file
const outputPath = '/Users/jack/projects/nx-worktrees/DOC-154/nx-dev/nx-dev/redirect-rules-docs-to-astro-working-only.js';
fs.writeFileSync(outputPath, jsContent);

console.log(`Created ${outputPath} with ${sortedKeys.length} working redirects`);

// Also show what's in the file
console.log('\nFirst 20 redirects in the file:');
sortedKeys.slice(0, 20).forEach(key => {
  console.log(`  "${key}": "${workingRedirects[key]}"`);
});

console.log(`\n... and ${Math.max(0, sortedKeys.length - 20)} more`);