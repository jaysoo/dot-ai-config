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
      
      // Handle sidebar.label
      if (key === 'sidebar') {
        // Check for label in the frontmatter
        const sidebarLines = [];
        let i = lines.indexOf(line);
        while (++i < lines.length && lines[i].startsWith('  ')) {
          sidebarLines.push(lines[i]);
        }
        const labelLine = sidebarLines.find(l => l.trim().startsWith('label:'));
        if (labelLine) {
          let labelValue = labelLine.split(':')[1].trim();
          if ((labelValue.startsWith('"') && labelValue.endsWith('"')) || 
              (labelValue.startsWith("'") && labelValue.endsWith("'"))) {
            labelValue = labelValue.slice(1, -1);
          }
          data.sidebarLabel = labelValue;
        }
      } else {
        data[key] = value;
      }
    }
  }
  
  return { data, content: bodyContent };
}

function findRealH1Headings() {
  const mdocFiles = getAllMdocFiles(join(astroDocsPath, 'src/content/docs'));
  const filesWithH1 = [];
  
  for (const file of mdocFiles) {
    const content = readFileSync(file, 'utf-8');
    const parsed = parseFrontmatter(content);
    
    // Find h1 headings, but exclude code blocks
    const lines = parsed.content.split('\n');
    let inCodeBlock = false;
    const h1Lines = [];
    
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
        h1Lines.push(line.replace(/^#\s+/, '').trim());
      }
    }
    
    if (h1Lines.length > 0) {
      const relativePath = relative(process.cwd(), file);
      filesWithH1.push({
        path: relativePath,
        frontmatterTitle: parsed.data.title || '',
        sidebarLabel: parsed.data.sidebarLabel || '',
        h1Headings: h1Lines
      });
    }
  }
  
  return filesWithH1;
}

const results = findRealH1Headings();

console.log(`Found ${results.length} files with actual h1 headings:\n`);

for (const file of results) {
  console.log(`File: ${file.path}`);
  console.log(`  Frontmatter title: "${file.frontmatterTitle}"`);
  if (file.sidebarLabel) {
    console.log(`  Sidebar label: "${file.sidebarLabel}"`);
  }
  console.log(`  H1 heading(s): ${file.h1Headings.map(h => `"${h}"`).join(', ')}`);
  console.log();
}

console.log(`\nSummary: ${results.length} files need to be updated`);