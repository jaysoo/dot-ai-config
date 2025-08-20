#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';

const astroDocsPath = join(process.cwd(), 'astro-docs');

function getAllMarkdownFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const entries = readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else {
        const ext = extname(entry);
        if (ext === '.md' || ext === '.mdx' || ext === '.mdoc') {
          files.push(fullPath);
        }
      }
    }
  }
  
  walkDir(dir);
  return files;
}

function findH1sOutsideCodeBlocks(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const h1Lines = [];
  let inCodeBlock = false;
  let inFrontmatter = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle frontmatter
    if (i === 0 && line === '---') {
      inFrontmatter = true;
      continue;
    }
    if (inFrontmatter && line === '---') {
      inFrontmatter = false;
      continue;
    }
    if (inFrontmatter) {
      continue;
    }
    
    // Check for code block boundaries
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    // Skip lines in code blocks
    if (inCodeBlock) {
      continue;
    }
    
    // Check for h1 (# followed by space at the start of line)
    if (/^#\s+/.test(line)) {
      h1Lines.push({
        lineNumber: i + 1,
        text: line,
        preview: lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 2)).join('\n')
      });
    }
  }
  
  return h1Lines;
}

function verifyAllFiles() {
  const markdownFiles = getAllMarkdownFiles(join(astroDocsPath, 'src/content/docs'));
  const filesWithH1 = [];
  let totalFiles = 0;
  
  for (const file of markdownFiles) {
    totalFiles++;
    const h1Lines = findH1sOutsideCodeBlocks(file);
    
    if (h1Lines.length > 0) {
      filesWithH1.push({
        path: relative(process.cwd(), file),
        h1Lines
      });
    }
  }
  
  return { filesWithH1, totalFiles };
}

const { filesWithH1, totalFiles } = verifyAllFiles();

console.log(`\n=== VERIFICATION RESULTS ===`);
console.log(`Total files scanned: ${totalFiles}`);
console.log(`Files with h1 outside code blocks: ${filesWithH1.length}\n`);

if (filesWithH1.length > 0) {
  console.log('❌ FOUND H1 HEADINGS OUTSIDE CODE BLOCKS:\n');
  for (const file of filesWithH1) {
    console.log(`📄 ${file.path}`);
    for (const h1 of file.h1Lines) {
      console.log(`   Line ${h1.lineNumber}: ${h1.text}`);
      console.log(`   Context:\n${h1.preview.split('\n').map(l => '     ' + l).join('\n')}\n`);
    }
  }
} else {
  console.log('✅ No h1 headings found outside of code blocks!');
}