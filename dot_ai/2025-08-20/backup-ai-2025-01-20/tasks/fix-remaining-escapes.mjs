#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { relative } from 'path';

const ASTRO_DOCS_PATH = 'astro-docs';

console.log('Finding files with remaining escaped closing braces...\n');

// Find all mdoc files
const mdocFiles = execSync(`find ${ASTRO_DOCS_PATH} -name "*.mdoc"`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

const changes = [];
let totalFixed = 0;

for (const filePath of mdocFiles) {
  const content = readFileSync(filePath, 'utf-8');
  
  // Check if file contains escaped closing braces
  if (content.includes('%\\}')) {
    // Replace all instances of %\} with %}
    const newContent = content.replace(/%\\}/g, '%}');
    
    // Count how many replacements were made
    const replacementCount = (content.match(/%\\}/g) || []).length;
    
    writeFileSync(filePath, newContent, 'utf-8');
    
    changes.push({
      file: relative(process.cwd(), filePath),
      count: replacementCount
    });
    totalFixed += replacementCount;
    
    console.log(`✓ Fixed ${replacementCount} escaped closing brace(s) in ${relative(process.cwd(), filePath)}`);
  }
}

console.log('\n=== Summary ===');
console.log(`Modified ${changes.length} files`);
console.log(`Total escaped closing braces fixed: ${totalFixed}`);

if (changes.length > 0) {
  console.log('\n=== Files Modified ===');
  for (const change of changes) {
    console.log(`  ${change.file}: ${change.count} fix(es)`);
  }
}

console.log('\n✅ All remaining escaped closing braces fixed!');