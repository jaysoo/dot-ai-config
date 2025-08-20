#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { relative, join, dirname } from 'path';

const ASTRO_DOCS_PATH = 'astro-docs';

// Mapping of jsonFile references to actual file paths
const jsonFileMappings = {
  '/src/assets/concepts/myreactapp.json': 'astro-docs/src/assets/concepts/caching/myreactapp.json',
  'shared/concepts/myreactapp.json': 'astro-docs/src/assets/concepts/caching/myreactapp.json',
  'shared/mental-model/three-projects.json': 'astro-docs/src/assets/concepts/mental-model/three-projects.json',
  'shared/mental-model/single-task.json': 'astro-docs/src/assets/concepts/mental-model/single-task.json',
  'shared/mental-model/disconnected-tasks.json': 'astro-docs/src/assets/concepts/mental-model/disconnected-tasks.json',
  'shared/mental-model/connected-tasks.json': 'astro-docs/src/assets/concepts/mental-model/connected-tasks.json',
  'shared/mental-model/large-tasks.json': 'astro-docs/src/assets/concepts/mental-model/large-tasks.json',
};

console.log('Finding all mdoc files with jsonFile references...\n');

const mdocFiles = execSync(`find ${ASTRO_DOCS_PATH} -name "*.mdoc"`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

const changes = [];
let totalInlined = 0;

for (const filePath of mdocFiles) {
  const content = readFileSync(filePath, 'utf-8');
  let newContent = content;
  let fileChanges = 0;
  
  // Pattern to match graph and project_details components with jsonFile attribute
  const componentPattern = /(\{%\s*(graph|project_details)[^%]*?jsonFile="([^"]+)"[^%]*?%\})/g;
  
  const matches = [...content.matchAll(componentPattern)];
  
  if (matches.length > 0) {
    console.log(`${relative(process.cwd(), filePath)}: Found ${matches.length} components with jsonFile`);
    
    for (const match of matches) {
      const fullMatch = match[0];
      const componentName = match[2];
      const jsonFilePath = match[3];
      
      // Find the actual JSON file path
      const actualJsonPath = jsonFileMappings[jsonFilePath];
      
      if (actualJsonPath) {
        try {
          // Read the JSON content
          const jsonContent = readFileSync(actualJsonPath, 'utf-8');
          const jsonData = JSON.parse(jsonContent);
          
          // Remove the jsonFile attribute and close the tag
          const newTag = fullMatch.replace(/\s*jsonFile="[^"]+"/g, '');
          
          // Find the closing tag for this component
          const closeTagPattern = new RegExp(`\\{%\\s*/${componentName}\\s*%\\}`);
          const closeTagMatch = newContent.match(closeTagPattern);
          
          if (closeTagMatch) {
            // Find the position of the opening and closing tags
            const openTagEnd = newContent.indexOf(fullMatch) + fullMatch.length;
            const closeTagStart = newContent.indexOf(closeTagMatch[0]);
            
            // Build the replacement with inlined JSON
            const replacement = `${newTag}\n\n${JSON.stringify(jsonData, null, 2)}\n\n{% /${componentName} %}`;
            
            // Replace the entire component block
            const beforeOpen = newContent.substring(0, newContent.indexOf(fullMatch));
            const afterClose = newContent.substring(closeTagStart + closeTagMatch[0].length);
            
            newContent = beforeOpen + replacement + afterClose;
            
            fileChanges++;
            console.log(`  ✓ Inlined ${jsonFilePath} for ${componentName}`);
          }
        } catch (error) {
          console.log(`  ✗ Failed to inline ${jsonFilePath}: ${error.message}`);
        }
      } else {
        console.log(`  ⚠ No mapping found for ${jsonFilePath}`);
      }
    }
    
    if (fileChanges > 0) {
      writeFileSync(filePath, newContent, 'utf-8');
      changes.push({
        file: relative(process.cwd(), filePath),
        count: fileChanges
      });
      totalInlined += fileChanges;
    }
  }
}

console.log('\n=== Summary ===');
console.log(`Modified ${changes.length} files`);
console.log(`Total JSON files inlined: ${totalInlined}`);

if (changes.length > 0) {
  console.log('\n=== Files Modified ===');
  for (const change of changes) {
    console.log(`  ${change.file}: ${change.count} component(s)`);
  }
}

console.log('\n✅ JSON inlining complete!');