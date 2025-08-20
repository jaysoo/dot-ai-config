#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join, relative } from 'path';

const ASTRO_DOCS_PATH = 'astro-docs';

// Find all files with escaped template blocks
console.log('Finding all files with escaped template blocks...\n');

const grepCommand = `grep -r '\\\\{%' ${ASTRO_DOCS_PATH} --include="*.md" --include="*.mdx" --include="*.mdoc" -l`;
const filesWithEscapedBlocks = execSync(grepCommand, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${filesWithEscapedBlocks.length} files with escaped template blocks:\n`);

const changes = [];

for (const filePath of filesWithEscapedBlocks) {
  const relativePath = relative(process.cwd(), filePath);
  const content = readFileSync(filePath, 'utf-8');
  
  // Count escaped blocks in this file
  const escapedMatches = content.match(/\\{%/g) || [];
  const escapedClosingMatches = content.match(/\\%}/g) || [];
  const totalEscaped = escapedMatches.length + escapedClosingMatches.length;
  
  if (totalEscaped > 0) {
    console.log(`${relativePath}: ${totalEscaped} escaped sequences`);
    
    // Find specific lines with escaped blocks for logging
    const lines = content.split('\n');
    const escapedLines = [];
    lines.forEach((line, index) => {
      if (line.includes('\\{%') || line.includes('\\%}')) {
        escapedLines.push({
          lineNum: index + 1,
          content: line.trim().substring(0, 100) + (line.trim().length > 100 ? '...' : '')
        });
      }
    });
    
    // Store the change details
    changes.push({
      file: relativePath,
      count: totalEscaped,
      lines: escapedLines
    });
    
    // Fix the content by removing backslashes before {% and %}
    const fixedContent = content
      .replace(/\\{%/g, '{%')
      .replace(/\\%}/g, '%}');
    
    // Write the fixed content back
    writeFileSync(filePath, fixedContent, 'utf-8');
  }
}

console.log('\n=== Summary ===');
console.log(`Fixed ${changes.length} files`);
console.log(`Total escaped sequences removed: ${changes.reduce((sum, c) => sum + c.count, 0)}`);

// Log detailed changes
console.log('\n=== Detailed Changes ===');
for (const change of changes) {
  console.log(`\n${change.file}:`);
  for (const line of change.lines.slice(0, 3)) {
    console.log(`  Line ${line.lineNum}: ${line.content}`);
  }
  if (change.lines.length > 3) {
    console.log(`  ... and ${change.lines.length - 3} more lines`);
  }
}

console.log('\n✅ All escaped template blocks have been unescaped!');
console.log('Next steps:');
console.log('1. Run the astro docs server to verify changes');
console.log('2. Use Playwright to check that pages render correctly');