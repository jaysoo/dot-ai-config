#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { relative } from 'path';

const ASTRO_DOCS_PATH = 'astro-docs';

console.log('Finding all mdoc files with graph or project_details components...\n');

const mdocFiles = execSync(`find ${ASTRO_DOCS_PATH} -name "*.mdoc"`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${mdocFiles.length} mdoc files to check\n`);

const changes = [];
let totalFixed = 0;

for (const filePath of mdocFiles) {
  const content = readFileSync(filePath, 'utf-8');
  let newContent = content;
  let fileChanges = 0;
  
  // Pattern to match graph and project_details components with JSON code blocks
  // This will match {% graph ... %} or {% project_details ... %} followed by ```json...``` and then {% /graph %} or {% /project_details %}
  const componentPattern = /(\{%\s*(graph|project_details)[^%]*%\})\s*\n\s*```json\s*\n([\s\S]*?)\n\s*```\s*\n\s*(\{%\s*\/\2\s*%\})/g;
  
  const matches = [...content.matchAll(componentPattern)];
  
  if (matches.length > 0) {
    console.log(`${relative(process.cwd(), filePath)}: Found ${matches.length} components with JSON code blocks`);
    
    // Replace each match
    newContent = content.replace(componentPattern, (match, openTag, componentName, jsonContent, closeTag) => {
      fileChanges++;
      // Return the component with JSON content directly (no code block wrapper)
      return `${openTag}\n\n${jsonContent}\n\n${closeTag}`;
    });
    
    // Write the fixed content
    writeFileSync(filePath, newContent, 'utf-8');
    
    changes.push({
      file: relative(process.cwd(), filePath),
      count: fileChanges
    });
    totalFixed += fileChanges;
  }
}

console.log('\n=== Summary ===');
console.log(`Fixed ${changes.length} files`);
console.log(`Total JSON code blocks removed: ${totalFixed}`);

if (changes.length > 0) {
  console.log('\n=== Files Fixed ===');
  for (const change of changes) {
    console.log(`  ${change.file}: ${change.count} component(s)`);
  }
}

console.log('\n✅ JSON code block removal complete!');