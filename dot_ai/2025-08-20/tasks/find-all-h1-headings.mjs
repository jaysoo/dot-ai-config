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

function parseFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { data: {}, content };
  }
  
  const endIndex = content.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return { data: {}, content };
  }
  
  const frontmatterStr = content.slice(4, endIndex);
  const bodyContent = content.slice(endIndex + 5);
  
  const data = {};
  const lines = frontmatterStr.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Handle quoted strings
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      data[key] = value;
    }
  }
  
  return { data, content: bodyContent };
}

function findAllH1Headings() {
  const markdownFiles = getAllMarkdownFiles(join(astroDocsPath, 'src/content/docs'));
  const filesWithH1 = [];
  let totalFiles = 0;
  
  for (const file of markdownFiles) {
    totalFiles++;
    const content = readFileSync(file, 'utf-8');
    const parsed = parseFrontmatter(content);
    
    // Find h1 headings, but exclude code blocks
    const lines = parsed.content.split('\n');
    let inCodeBlock = false;
    const h1Lines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
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
          text: line.replace(/^#\s+/, '').trim(),
          lineNumber: i + 1
        });
      }
    }
    
    if (h1Lines.length > 0) {
      const relativePath = relative(process.cwd(), file);
      const ext = extname(file);
      filesWithH1.push({
        path: relativePath,
        extension: ext,
        frontmatterTitle: parsed.data.title || '',
        h1Headings: h1Lines
      });
    }
  }
  
  return { filesWithH1, totalFiles };
}

const { filesWithH1, totalFiles } = findAllH1Headings();

console.log(`\n=== SCAN RESULTS ===`);
console.log(`Total markdown files scanned: ${totalFiles}`);
console.log(`Files with h1 headings: ${filesWithH1.length}\n`);

// Group by extension
const byExtension = {
  '.md': [],
  '.mdx': [],
  '.mdoc': []
};

for (const file of filesWithH1) {
  byExtension[file.extension].push(file);
}

// Report by extension
for (const [ext, files] of Object.entries(byExtension)) {
  if (files.length > 0) {
    console.log(`\n=== ${ext.toUpperCase()} FILES (${files.length}) ===\n`);
    for (const file of files) {
      console.log(`📄 ${file.path}`);
      console.log(`   Frontmatter title: "${file.frontmatterTitle}"`);
      for (const h1 of file.h1Headings) {
        console.log(`   ❌ H1 at line ${h1.lineNumber}: "${h1.text}"`);
      }
      console.log();
    }
  }
}

if (filesWithH1.length === 0) {
  console.log('✅ No files with h1 headings found!');
} else {
  console.log(`\n⚠️  Found ${filesWithH1.length} files that need to be fixed.`);
}