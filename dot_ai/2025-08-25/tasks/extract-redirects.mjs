#!/usr/bin/env node
import fs from 'fs';

const content = fs.readFileSync('/Users/jack/projects/nx-worktrees/DOC-154/nx-dev/nx-dev/redirect-rules-docs-to-astro.js', 'utf-8');

// Extract all redirect rules (from: to)
const redirectRegex = /"([^"]+)":\s*"([^"]+)"/g;
const redirects = [];
let match;

while ((match = redirectRegex.exec(content)) !== null) {
  if (!match[1].includes('docsToAstroRedirects')) { // Skip variable names
    redirects.push({
      from: match[1],
      to: match[2]
    });
  }
}

// Output all redirects
console.log(`Total redirects found: ${redirects.length}\n`);
console.log('All redirect rules:');
console.log('===================');
redirects.forEach(r => {
  console.log(`${r.from} -> ${r.to}`);
});

// Save to JSON for further processing
fs.writeFileSync('/Users/jack/projects/nx-worktrees/DOC-154/.ai/2025-08-25/tasks/redirects.json', JSON.stringify(redirects, null, 2));
console.log('\nRedirects saved to redirects.json');