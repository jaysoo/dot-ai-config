#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// List of files and what to do with them
const filesToFix = [
  {
    path: 'astro-docs/src/content/docs/features/maintain-typescript-monorepos.mdoc',
    action: 'remove-h1', // h1 matches frontmatter
  },
  {
    path: 'astro-docs/src/content/docs/features/run-tasks.mdoc',
    action: 'update-frontmatter', // h1 "Tasks" should be the title
    newTitle: 'Tasks',
    originalFrontmatterTitle: 'Run Tasks' // preserve as sidebar label
  },
  {
    path: 'astro-docs/src/content/docs/guides/Enforce Module Boundaries/tag-multiple-dimensions.mdoc',
    action: 'remove-h1', // h1 matches frontmatter
  },
  {
    path: 'astro-docs/src/content/docs/guides/Nx Release/configure-custom-registries.mdoc',
    action: 'remove-h1', // h1 matches frontmatter
  },
  {
    path: 'astro-docs/src/content/docs/guides/Nx Release/customize-conventional-commit-types.mdoc',
    action: 'remove-h1', // h1 matches frontmatter
  },
  {
    path: 'astro-docs/src/content/docs/references/Remote Cache Plugins/azure-cache/overview.mdoc',
    action: 'remove-wrong-h1', // h1 "Cache Modes" is wrong, should be removed
  },
  {
    path: 'astro-docs/src/content/docs/references/Remote Cache Plugins/gcs-cache/overview.mdoc',
    action: 'remove-wrong-h1', // h1 "Cache Modes" is wrong, should be removed
  },
  {
    path: 'astro-docs/src/content/docs/references/Remote Cache Plugins/s3-cache/overview.mdoc',
    action: 'remove-wrong-h1', // h1 "Cache Modes" is wrong, should be removed
  },
  {
    path: 'astro-docs/src/content/docs/troubleshooting/resolve-circular-dependencies.mdoc',
    action: 'remove-h1', // h1 matches frontmatter
  },
  {
    path: 'astro-docs/src/content/docs/troubleshooting/troubleshoot-cache-misses.mdoc',
    action: 'remove-h1', // h1 matches frontmatter
  },
];

function processFile(fileInfo) {
  const fullPath = join(process.cwd(), fileInfo.path);
  const content = readFileSync(fullPath, 'utf-8');
  
  // Parse frontmatter
  const frontmatterEnd = content.indexOf('\n---\n', 4);
  const frontmatter = content.slice(0, frontmatterEnd + 5);
  let body = content.slice(frontmatterEnd + 5);
  
  if (fileInfo.action === 'remove-h1' || fileInfo.action === 'remove-wrong-h1') {
    // Remove the h1 from the body
    const lines = body.split('\n');
    const newLines = [];
    let removedH1 = false;
    
    for (const line of lines) {
      if (!removedH1 && line.match(/^#\s+/)) {
        removedH1 = true;
        // Skip this line and the next line if it's empty
        const nextIndex = lines.indexOf(line) + 1;
        if (nextIndex < lines.length && lines[nextIndex].trim() === '') {
          lines.splice(nextIndex, 1); // Remove the empty line after h1
        }
        continue;
      }
      newLines.push(line);
    }
    
    body = newLines.join('\n');
    writeFileSync(fullPath, frontmatter + body);
    console.log(`✓ Removed h1 from ${fileInfo.path}`);
    
  } else if (fileInfo.action === 'update-frontmatter') {
    // Update frontmatter title and add sidebar label
    let updatedFrontmatter = frontmatter;
    
    // Update title
    updatedFrontmatter = updatedFrontmatter.replace(
      /title:\s*['"].*?['"]/,
      `title: '${fileInfo.newTitle}'`
    );
    
    // Add sidebar label if not present
    if (!updatedFrontmatter.includes('sidebar:')) {
      // Add sidebar section before the closing ---
      updatedFrontmatter = updatedFrontmatter.replace(
        /\n---\n$/,
        `\nsidebar:\n  label: '${fileInfo.originalFrontmatterTitle}'\n---\n`
      );
    } else if (!updatedFrontmatter.includes('label:')) {
      // Add label to existing sidebar section
      updatedFrontmatter = updatedFrontmatter.replace(
        /sidebar:\s*\n/,
        `sidebar:\n  label: '${fileInfo.originalFrontmatterTitle}'\n`
      );
    }
    
    // Remove h1 from body
    const lines = body.split('\n');
    const newLines = [];
    let removedH1 = false;
    
    for (const line of lines) {
      if (!removedH1 && line.match(/^#\s+/)) {
        removedH1 = true;
        // Skip this line and the next line if it's empty
        const nextIndex = lines.indexOf(line) + 1;
        if (nextIndex < lines.length && lines[nextIndex].trim() === '') {
          lines.splice(nextIndex, 1);
        }
        continue;
      }
      newLines.push(line);
    }
    
    body = newLines.join('\n');
    writeFileSync(fullPath, updatedFrontmatter + body);
    console.log(`✓ Updated frontmatter and removed h1 from ${fileInfo.path}`);
  }
}

// Process all files
console.log('Processing files to remove duplicate titles...\n');
for (const fileInfo of filesToFix) {
  processFile(fileInfo);
}

console.log('\n✅ All files processed successfully!');