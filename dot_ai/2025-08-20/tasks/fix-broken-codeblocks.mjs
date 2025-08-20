#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const files = [
  'astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/gradle.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/react-monorepo.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/typescript-packages.md'
];

function fixBrokenCodeBlocks(filePath) {
  console.log(`Processing: ${filePath}`);
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const fixedLines = [];
  let inCodeBlock = false;
  let codeBlockStartIndex = -1;
  let fixCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';
    
    // Check if we're starting a code block
    if (!inCodeBlock && line.startsWith('```')) {
      inCodeBlock = true;
      codeBlockStartIndex = i;
      fixedLines.push(line);
    }
    // Check if we should be ending a code block
    else if (inCodeBlock && line === '```') {
      inCodeBlock = false;
      fixedLines.push(line);
    }
    // Check for broken code block end (empty line followed by regular text)
    else if (inCodeBlock && line === '' && nextLine && !nextLine.startsWith(' ') && !nextLine.startsWith('\t') && !nextLine.startsWith('//') && !nextLine.startsWith('#') && !nextLine.startsWith('*') && !nextLine.startsWith('export') && !nextLine.startsWith('import') && !nextLine.startsWith('{') && !nextLine.startsWith('}') && !nextLine.startsWith('const') && !nextLine.startsWith('let') && !nextLine.startsWith('var') && !nextLine.startsWith('function') && !nextLine.startsWith('class') && !nextLine.startsWith('interface') && !nextLine.startsWith('type') && !nextLine.startsWith('return') && !nextLine.match(/^[a-z]/)) {
      // This looks like the end of a code block
      fixedLines.push('```');
      fixedLines.push('');
      inCodeBlock = false;
      fixCount++;
      console.log(`  Fixed broken code block ending at line ${i+1}`);
    }
    else {
      fixedLines.push(line);
    }
  }
  
  // If we're still in a code block at the end, close it
  if (inCodeBlock) {
    fixedLines.push('```');
    fixCount++;
    console.log(`  Fixed unclosed code block at end of file`);
  }
  
  if (fixCount > 0) {
    writeFileSync(filePath, fixedLines.join('\n'), 'utf-8');
    console.log(`  ✅ Fixed ${fixCount} broken code blocks`);
    return fixCount;
  } else {
    console.log(`  ✓ No broken code blocks found`);
    return 0;
  }
}

// Main execution
console.log('Fixing broken code blocks...\n');

let totalFixed = 0;

for (const file of files) {
  totalFixed += fixBrokenCodeBlocks(file);
  console.log();
}

console.log('=' .repeat(50));
console.log(`Total broken code blocks fixed: ${totalFixed}`);