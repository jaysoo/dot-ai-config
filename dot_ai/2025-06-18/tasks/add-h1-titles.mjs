#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';

const filesToUpdate = [
  { file: 'docs/shared/packages/conformance/conformance-plugin.md', title: '# @nx/conformance' },
  { file: 'docs/shared/packages/gcs-cache/gcs-cache-plugin.md', title: '# @nx/gcs-cache' },
  { file: 'docs/shared/packages/owners/owners-plugin.md', title: '# @nx/owners' },
  { file: 'docs/shared/packages/s3-cache/s3-cache-plugin.md', title: '# @nx/s3-cache' },
  { file: 'docs/shared/packages/shared-fs-cache/shared-fs-cache-plugin.md', title: '# @nx/shared-fs-cache' },
  { file: 'docs/shared/packages/angular/angular-plugin.md', title: '# @nx/angular' },
  { file: 'docs/shared/packages/esbuild/esbuild-plugin.md', title: '# @nx/esbuild' },
  { file: 'docs/shared/packages/rspack/rspack-plugin.md', title: '# @nx/rspack' },
  { file: 'docs/shared/packages/vite/vite-plugin.md', title: '# @nx/vite' },
  { file: 'docs/shared/packages/webpack/plugin-overview.md', title: '# @nx/webpack' },
  { file: 'docs/shared/packages/eslint/eslint.md', title: '# @nx/eslint' },
  { file: 'docs/shared/packages/gradle/gradle-plugin.md', title: '# @nx/gradle' },
  { file: 'docs/shared/packages/express/express-plugin.md', title: '# @nx/express' },
  { file: 'docs/shared/packages/node/node-plugin.md', title: '# @nx/node' },
  { file: 'docs/shared/packages/nest/nest-plugin.md', title: '# @nx/nest' },
  { file: 'docs/shared/packages/expo/expo-plugin.md', title: '# @nx/expo' },
  { file: 'docs/shared/packages/react/react-plugin.md', title: '# @nx/react' },
  { file: 'docs/shared/packages/next/plugin-overview.md', title: '# @nx/next' },
  { file: 'docs/shared/packages/react-native/react-native-plugin.md', title: '# @nx/react-native' },
  { file: 'docs/shared/packages/remix/remix-plugin.md', title: '# @nx/remix' },
  { file: 'docs/shared/packages/cypress/cypress-plugin.md', title: '# @nx/cypress' },
  { file: 'docs/shared/packages/detox/detox-plugin.md', title: '# @nx/detox' },
  { file: 'docs/shared/packages/jest/jest-plugin.md', title: '# @nx/jest' },
  { file: 'docs/shared/packages/playwright/playwright-plugin.md', title: '# @nx/playwright' },
  { file: 'docs/shared/packages/storybook/plugin-overview.md', title: '# @nx/storybook' },
  { file: 'docs/shared/packages/js/js-plugin.md', title: '# @nx/js' },
  { file: 'docs/shared/packages/vue/vue-plugin.md', title: '# @nx/vue' },
  { file: 'docs/shared/packages/nuxt/nuxt-plugin.md', title: '# @nx/nuxt' }
];

function addH1AfterFrontMatter(filePath, h1Title) {
  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let inFrontMatter = false;
  let frontMatterEnded = false;
  let insertIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for front matter start/end
    if (line.trim() === '---') {
      if (!inFrontMatter && i === 0) {
        inFrontMatter = true;
      } else if (inFrontMatter) {
        inFrontMatter = false;
        frontMatterEnded = true;
        insertIndex = i + 1;
        break;
      }
    }
  }
  
  // If no front matter, insert at beginning
  if (insertIndex === -1) {
    insertIndex = 0;
  }
  
  // Insert the H1 title
  const newLines = [...lines];
  
  // Ensure there's a blank line after front matter
  if (frontMatterEnded && newLines[insertIndex]?.trim() !== '') {
    newLines.splice(insertIndex, 0, '');
    insertIndex++;
  }
  
  // Add the H1
  newLines.splice(insertIndex, 0, h1Title);
  
  // Ensure blank line after H1
  if (newLines[insertIndex + 1]?.trim() !== '') {
    newLines.splice(insertIndex + 1, 0, '');
  }
  
  // Write back to file
  writeFileSync(filePath, newLines.join('\n'));
  return true;
}

console.log('Adding H1 titles to documentation files...\n');

let successCount = 0;
let errorCount = 0;

for (const fileInfo of filesToUpdate) {
  console.log(`Processing: ${fileInfo.file}`);
  if (addH1AfterFrontMatter(fileInfo.file, fileInfo.title)) {
    console.log(`✅ Added: ${fileInfo.title}`);
    successCount++;
  } else {
    errorCount++;
  }
}

console.log(`\n\nSummary:`);
console.log(`✅ Successfully updated: ${successCount} files`);
console.log(`❌ Errors: ${errorCount} files`);
console.log(`\nTotal processed: ${filesToUpdate.length} files`);