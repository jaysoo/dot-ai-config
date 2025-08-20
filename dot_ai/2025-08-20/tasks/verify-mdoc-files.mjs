#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const astroDocsPath = join(process.cwd(), 'astro-docs');

function getAllMdocFiles(dir) {
  const files = [];
  
  function walkDir(currentDir) {
    const entries = readdirSync(currentDir);
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.endsWith('.mdoc')) {
        files.push(fullPath);
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

function verifyAllMdocFiles() {
  const mdocFiles = getAllMdocFiles(join(astroDocsPath, 'src/content/docs'));
  const issues = {
    noFrontmatterTitle: [],
    hasH1Headings: [],
    totalFiles: mdocFiles.length
  };
  
  for (const file of mdocFiles) {
    const content = readFileSync(file, 'utf-8');
    const parsed = parseFrontmatter(content);
    const relativePath = relative(process.cwd(), file);
    
    // Check for frontmatter title
    if (!parsed.data.title) {
      issues.noFrontmatterTitle.push(relativePath);
    }
    
    // Check for h1 headings (excluding code blocks)
    const lines = parsed.content.split('\n');
    let inCodeBlock = false;
    
    for (const line of lines) {
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
        issues.hasH1Headings.push({
          path: relativePath,
          h1: line.replace(/^#\s+/, '').trim()
        });
        break; // Only report first h1
      }
    }
  }
  
  return issues;
}

// Run verification
console.log('Verifying all .mdoc files in astro-docs...\n');
const issues = verifyAllMdocFiles();

console.log(`Total files checked: ${issues.totalFiles}`);
console.log(`Files without frontmatter title: ${issues.noFrontmatterTitle.length}`);
console.log(`Files with h1 headings in content: ${issues.hasH1Headings.length}`);

if (issues.noFrontmatterTitle.length > 0) {
  console.log('\n❌ Files missing frontmatter title:');
  for (const file of issues.noFrontmatterTitle) {
    console.log(`  - ${file}`);
  }
}

if (issues.hasH1Headings.length > 0) {
  console.log('\n❌ Files with h1 headings in content:');
  for (const issue of issues.hasH1Headings) {
    console.log(`  - ${issue.path}`);
    console.log(`    h1: "${issue.h1}"`);
  }
}

if (issues.noFrontmatterTitle.length === 0 && issues.hasH1Headings.length === 0) {
  console.log('\n✅ All files are correctly formatted!');
  console.log('  - All files have frontmatter titles');
  console.log('  - No files have h1 headings in content');
} else {
  console.log('\n⚠️  Some issues found that need to be addressed.');
  process.exit(1);
}