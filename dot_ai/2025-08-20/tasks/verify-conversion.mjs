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

function checkForLegacyAttributes(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const issues = [];
  
  // Check for fileName attribute
  const fileNameRegex = /fileName=/g;
  let match;
  while ((match = fileNameRegex.exec(content)) !== null) {
    const lineNumber = content.substring(0, match.index).split('\n').length;
    issues.push({
      type: 'fileName',
      lineNumber,
      context: content.substring(match.index, match.index + 50).replace(/\n/g, ' ')
    });
  }
  
  // Check for highlightLines attribute
  const highlightRegex = /highlightLines=/g;
  while ((match = highlightRegex.exec(content)) !== null) {
    const lineNumber = content.substring(0, match.index).split('\n').length;
    issues.push({
      type: 'highlightLines',
      lineNumber,
      context: content.substring(match.index, match.index + 50).replace(/\n/g, ' ')
    });
  }
  
  return issues;
}

// Main execution
console.log('Verifying conversion - checking for remaining fileName or highlightLines attributes...\n');

const files = findAllMarkdownFiles(ASTRO_DOCS);
console.log(`Checking ${files.length} markdown files...\n`);

const filesWithIssues = {};
let totalIssues = 0;

for (const file of files) {
  const issues = checkForLegacyAttributes(file);
  if (issues.length > 0) {
    const relativePath = relative(process.cwd(), file);
    filesWithIssues[relativePath] = issues;
    totalIssues += issues.length;
  }
}

if (totalIssues === 0) {
  console.log('✅ SUCCESS: No remaining fileName or highlightLines attributes found!');
  console.log('\nAll code blocks have been successfully converted to Starlight format.');
} else {
  console.log('❌ ISSUES FOUND:\n');
  console.log(`Found ${totalIssues} remaining legacy attributes in ${Object.keys(filesWithIssues).length} files:\n`);
  
  for (const [file, issues] of Object.entries(filesWithIssues)) {
    console.log(`📄 ${file}`);
    for (const issue of issues) {
      console.log(`   Line ${issue.lineNumber}: ${issue.type} attribute found`);
      console.log(`   Context: ${issue.context}`);
    }
    console.log();
  }
  
  console.log('These attributes need manual review or conversion.');
}