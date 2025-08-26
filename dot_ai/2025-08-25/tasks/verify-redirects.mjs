#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the redirect rules file
const redirectsPath = '/Users/jack/projects/nx-worktrees/DOC-154/nx-dev/nx-dev/redirect-rules-docs-to-astro.js';
const fileContent = fs.readFileSync(redirectsPath, 'utf8');

// Extract the redirect object using regex to handle the large file
const objectMatch = fileContent.match(/const\s+docsToAstroRedirects\s*=\s*({[\s\S]*?});/);
if (!objectMatch) {
  console.error('Could not find docsToAstroRedirects object');
  process.exit(1);
}

// Parse the object string into actual JSON
const objectString = objectMatch[1];
const redirects = {};

// Extract key-value pairs using regex
const pairRegex = /"([^"]+)"\s*:\s*"([^"]+)"/g;
let match;
while ((match = pairRegex.exec(objectString)) !== null) {
  redirects[match[1]] = match[2];
}

console.log(`Found ${Object.keys(redirects).length} redirect rules`);

// Save to JSON for easier processing
const outputPath = path.join(__dirname, 'redirects.json');
fs.writeFileSync(outputPath, JSON.stringify(redirects, null, 2));
console.log(`Saved redirects to ${outputPath}`);

// Also create a CSV for easier analysis
const csvPath = path.join(__dirname, 'redirects.csv');
const csvContent = 'old_url,new_url\n' + 
  Object.entries(redirects).map(([old, newUrl]) => `"${old}","${newUrl}"`).join('\n');
fs.writeFileSync(csvPath, csvContent);
console.log(`Saved CSV to ${csvPath}`);

// Extract unique patterns
const patterns = {
  topLevel: new Set(),
  sections: new Set(),
  subsections: new Set()
};

Object.keys(redirects).forEach(url => {
  const parts = url.split('/').filter(Boolean);
  if (parts.length > 0) patterns.topLevel.add(parts[0]);
  if (parts.length > 1) patterns.sections.add(`${parts[0]}/${parts[1]}`);
  if (parts.length > 2) patterns.subsections.add(`${parts[0]}/${parts[1]}/${parts[2]}`);
});

console.log('\nTop-level sections:', Array.from(patterns.topLevel).sort());
console.log('\nTotal redirect pairs:', Object.keys(redirects).length);