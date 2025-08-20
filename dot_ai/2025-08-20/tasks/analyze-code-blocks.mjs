#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ASTRO_DOCS = 'astro-docs/src/content/docs';

function findAllMarkdownFiles(dir) {
  const files = [];
  
  function traverse(currentPath) {
    const items = readdirSync(currentPath);
    for (const item of items) {
      const fullPath = join(currentPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdoc')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function analyzeCodeBlocks(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const codeBlockRegex = /```(\w+)\s*\{%\s*(.*?)\s*%\}/g;
  const matches = [];
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const lang = match[1];
    const attrs = match[2];
    
    const fileName = attrs.match(/fileName="([^"]+)"/)?.[1];
    const highlightLines = attrs.match(/highlightLines=\[([^\]]+)\]/)?.[1];
    
    if (fileName || highlightLines) {
      const lineNumber = content.substring(0, match.index).split('\n').length;
      matches.push({
        lineNumber,
        lang,
        fileName,
        highlightLines,
        originalMatch: match[0]
      });
    }
  }
  
  return matches;
}

// Main execution
console.log('Analyzing code blocks in astro-docs...\n');

const files = findAllMarkdownFiles(ASTRO_DOCS);
console.log(`Found ${files.length} markdown files\n`);

const results = {};
let totalFileNameCount = 0;
let totalHighlightCount = 0;

for (const file of files) {
  const matches = analyzeCodeBlocks(file);
  if (matches.length > 0) {
    const relativePath = relative(process.cwd(), file);
    results[relativePath] = matches;
    
    for (const match of matches) {
      if (match.fileName) totalFileNameCount++;
      if (match.highlightLines) totalHighlightCount++;
    }
  }
}

console.log('=== Files with fileName or highlightLines attributes ===\n');

for (const [file, matches] of Object.entries(results)) {
  console.log(`📄 ${file}`);
  console.log(`   Found ${matches.length} code blocks with attributes:\n`);
  
  for (const match of matches) {
    console.log(`   Line ${match.lineNumber}: ${match.lang} block`);
    if (match.fileName) {
      console.log(`     - fileName: "${match.fileName}"`);
    }
    if (match.highlightLines) {
      console.log(`     - highlightLines: [${match.highlightLines}]`);
    }
    console.log();
  }
}

console.log('=== Summary ===');
console.log(`Total files with attributes: ${Object.keys(results).length}`);
console.log(`Total fileName attributes: ${totalFileNameCount}`);
console.log(`Total highlightLines attributes: ${totalHighlightCount}`);
console.log(`Total attributes to convert: ${totalFileNameCount + totalHighlightCount}`);