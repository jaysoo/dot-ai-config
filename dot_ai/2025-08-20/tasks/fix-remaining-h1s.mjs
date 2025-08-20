#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const filesToFix = [
  {
    path: 'astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.md',
    currentFrontmatterTitle: 'Angular Monorepo Tutorial',
    h1Title: 'Building and Testing Angular Apps in Nx',
    sidebarLabel: 'Angular Monorepo' // preserve existing
  },
  {
    path: 'astro-docs/src/content/docs/getting-started/Tutorials/react-monorepo.md',
    currentFrontmatterTitle: 'React Monorepo Tutorial',
    h1Title: 'Building and Testing React Apps in Nx',
    sidebarLabel: 'React Monorepo' // likely has this
  },
  {
    path: 'astro-docs/src/content/docs/getting-started/Tutorials/typescript-packages.md',
    currentFrontmatterTitle: 'TypeScript Monorepo Tutorial',
    h1Title: 'Building and Testing TypeScript Packages in Nx',
    sidebarLabel: 'TypeScript Packages' // likely has this
  }
];

function processFile(fileInfo) {
  const fullPath = join(process.cwd(), fileInfo.path);
  const content = readFileSync(fullPath, 'utf-8');
  
  // Parse frontmatter
  const frontmatterEnd = content.indexOf('\n---\n', 4);
  const frontmatter = content.slice(0, frontmatterEnd + 5);
  let body = content.slice(frontmatterEnd + 5);
  
  // Update frontmatter title to use the h1 title
  let updatedFrontmatter = frontmatter.replace(
    /title:\s*['"].*?['"]/,
    `title: '${fileInfo.h1Title}'`
  );
  
  // Check if sidebar label exists, if not add it with the original title
  if (!updatedFrontmatter.includes('sidebar:')) {
    updatedFrontmatter = updatedFrontmatter.replace(
      /\n---\n$/,
      `\nsidebar:\n  label: '${fileInfo.sidebarLabel}'\n---\n`
    );
  }
  
  // Remove the h1 from body
  const lines = body.split('\n');
  const newLines = [];
  let removedH1 = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (!removedH1 && line.match(/^#\s+/)) {
      removedH1 = true;
      // Skip this line and the next line if it's empty
      if (i + 1 < lines.length && lines[i + 1].trim() === '') {
        i++; // Skip the empty line too
      }
      continue;
    }
    newLines.push(line);
  }
  
  body = newLines.join('\n');
  
  writeFileSync(fullPath, updatedFrontmatter + body);
  console.log(`✓ Fixed ${fileInfo.path}`);
  console.log(`  - Updated title to: "${fileInfo.h1Title}"`);
  console.log(`  - Preserved sidebar label: "${fileInfo.sidebarLabel}"`);
  console.log(`  - Removed h1 from content\n`);
}

console.log('Fixing remaining markdown files with h1 headings...\n');

for (const fileInfo of filesToFix) {
  processFile(fileInfo);
}

console.log('✅ All files fixed!');