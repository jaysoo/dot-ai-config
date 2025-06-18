#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';

const files = [
  // Core API - Overview files
  { file: 'docs/shared/packages/azure-cache/azure-cache-plugin.md', expectedTitle: '# @nx/azure-cache' },
  { file: 'docs/shared/packages/conformance/conformance-plugin.md', expectedTitle: '# @nx/conformance' },
  { file: 'docs/shared/packages/gcs-cache/gcs-cache-plugin.md', expectedTitle: '# @nx/gcs-cache' },
  { file: 'docs/shared/packages/owners/owners-plugin.md', expectedTitle: '# @nx/owners' },
  { file: 'docs/shared/packages/s3-cache/s3-cache-plugin.md', expectedTitle: '# @nx/s3-cache' },
  { file: 'docs/shared/packages/shared-fs-cache/shared-fs-cache-plugin.md', expectedTitle: '# @nx/shared-fs-cache' },
  
  // Technologies - Introduction files
  { file: 'docs/shared/guides/angular-rspack/introduction.md', expectedTitle: '# Angular Rspack' },
  { file: 'docs/shared/packages/angular/angular-plugin.md', expectedTitle: '# @nx/angular' },
  { file: 'docs/shared/packages/esbuild/esbuild-plugin.md', expectedTitle: '# @nx/esbuild' },
  { file: 'docs/shared/packages/rspack/rspack-plugin.md', expectedTitle: '# @nx/rspack' },
  { file: 'docs/shared/packages/vite/vite-plugin.md', expectedTitle: '# @nx/vite' },
  { file: 'docs/shared/packages/webpack/plugin-overview.md', expectedTitle: '# @nx/webpack' },
  { file: 'docs/shared/packages/eslint/eslint.md', expectedTitle: '# @nx/eslint' },
  { file: 'docs/shared/packages/gradle/gradle-plugin.md', expectedTitle: '# @nx/gradle' },
  { file: 'docs/shared/packages/module-federation/nx-module-federation-plugin.md', expectedTitle: '# @nx/module-federation' },
  { file: 'docs/shared/packages/express/express-plugin.md', expectedTitle: '# @nx/express' },
  { file: 'docs/shared/packages/node/node-plugin.md', expectedTitle: '# @nx/node' },
  { file: 'docs/shared/packages/nest/nest-plugin.md', expectedTitle: '# @nx/nest' },
  { file: 'docs/shared/packages/expo/expo-plugin.md', expectedTitle: '# @nx/expo' },
  { file: 'docs/shared/packages/react/react-plugin.md', expectedTitle: '# @nx/react' },
  { file: 'docs/shared/packages/next/plugin-overview.md', expectedTitle: '# @nx/next' },
  { file: 'docs/shared/packages/react-native/react-native-plugin.md', expectedTitle: '# @nx/react-native' },
  { file: 'docs/shared/packages/remix/remix-plugin.md', expectedTitle: '# @nx/remix' },
  { file: 'docs/shared/packages/cypress/cypress-plugin.md', expectedTitle: '# @nx/cypress' },
  { file: 'docs/shared/packages/detox/detox-plugin.md', expectedTitle: '# @nx/detox' },
  { file: 'docs/shared/packages/jest/jest-plugin.md', expectedTitle: '# @nx/jest' },
  { file: 'docs/shared/packages/playwright/playwright-plugin.md', expectedTitle: '# @nx/playwright' },
  { file: 'docs/shared/packages/storybook/plugin-overview.md', expectedTitle: '# @nx/storybook' },
  { file: 'docs/shared/packages/js/js-plugin.md', expectedTitle: '# @nx/js' },
  { file: 'docs/shared/packages/vue/vue-plugin.md', expectedTitle: '# @nx/vue' },
  { file: 'docs/shared/packages/nuxt/nuxt-plugin.md', expectedTitle: '# @nx/nuxt' }
];

function checkH1AfterFrontMatter(filePath) {
  if (!existsSync(filePath)) {
    return { exists: false };
  }
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let inFrontMatter = false;
  let frontMatterEnded = false;
  let firstContentLine = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for front matter start/end
    if (line.trim() === '---') {
      if (!inFrontMatter && i === 0) {
        inFrontMatter = true;
      } else if (inFrontMatter) {
        inFrontMatter = false;
        frontMatterEnded = true;
        continue;
      }
    }
    
    // After front matter, look for first non-empty line
    if (frontMatterEnded && line.trim() !== '') {
      firstContentLine = line;
      break;
    }
    
    // If no front matter, check first non-empty line
    if (i === 0 && line.trim() !== '---' && line.trim() !== '') {
      firstContentLine = line;
      break;
    }
  }
  
  const hasH1 = firstContentLine && firstContentLine.trim().startsWith('# ');
  
  return {
    exists: true,
    hasH1: hasH1,
    firstContentLine: firstContentLine
  };
}

const filesToUpdate = [];

console.log('Checking files for H1 titles...\n');

for (const fileInfo of files) {
  const result = checkH1AfterFrontMatter(fileInfo.file);
  
  if (!result.exists) {
    console.log(`❌ File not found: ${fileInfo.file}`);
  } else if (!result.hasH1) {
    console.log(`⚠️  Missing H1: ${fileInfo.file}`);
    console.log(`   First line: ${result.firstContentLine?.trim() || '(empty)'}`);
    console.log(`   Expected: ${fileInfo.expectedTitle}`);
    filesToUpdate.push(fileInfo);
  } else {
    console.log(`✅ Has H1: ${fileInfo.file}`);
    console.log(`   Title: ${result.firstContentLine.trim()}`);
  }
}

console.log(`\n\nFiles needing H1 titles: ${filesToUpdate.length}`);

// Export the list for the update script
if (filesToUpdate.length > 0) {
  console.log('\nFiles to update:');
  filesToUpdate.forEach(f => console.log(`- ${f.file}`));
}