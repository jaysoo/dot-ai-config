#!/usr/bin/env node

/**
 * Verification script to ensure all redirect fixes were applied
 * Generated: 2025-08-21
 */

import { readFileSync } from 'fs';

// Read the updated redirect rules file
const redirectRulesPath = '/Users/jack/projects/nx-worktrees/DOC-154/nx-dev/nx-dev/redirect-rules-docs-to-astro.js';
const fileContent = readFileSync(redirectRulesPath, 'utf8');

// Expected fixes from redirect-fixes-final.js
const expectedFixes = {
  // Troubleshooting
  '/recipes/troubleshooting/ts-solution-style': '/docs/troubleshooting',
  '/recipes/troubleshooting/clear-the-cache': '/docs/troubleshooting/troubleshoot-cache-misses',
  
  // Module Federation
  '/recipes/module-federation/create-a-host': '/docs/technologies/module-federation/Guides/create-a-host',
  
  // React
  '/recipes/react/react-dynamic-module-federation': '/docs/technologies/module-federation/Guides',
  '/recipes/react/using-tailwind-css-in-react': '/docs/technologies/react/Guides/using-tailwind-css-in-react',
  
  // Angular
  '/recipes/angular/angular-dynamic-module-federation': '/docs/technologies/angular/Guides/dynamic-module-federation-with-angular',
  '/recipes/angular/angular-setup-incremental-builds': '/docs/technologies/angular/Guides/setup-incremental-builds-angular',
  
  // Node
  '/recipes/node/node-server-fly-io': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  
  // Webpack
  '/recipes/webpack/webpack-config-setup': '/docs/technologies/build-tools/webpack/Guides/configure-webpack',
  
  // Vite
  '/recipes/vite/set-up-vite-manually': '/docs/technologies/build-tools/vite',
  
  // Storybook
  '/recipes/storybook/overview-react': '/docs/technologies/test-tools/storybook/Guides/overview-react',
  '/recipes/storybook/one-storybook-for-all': '/docs/technologies/test-tools/storybook/Guides/one-storybook-for-all',
  
  // Tips & Tricks
  '/recipes/tips-n-tricks/js-and-ts': '/docs/technologies/typescript/Guides/js-and-ts',
  '/recipes/tips-n-tricks/flat-config': '/docs/technologies/eslint/Guides/flat-config',
};

// Verify each expected fix
let allCorrect = true;
let correctCount = 0;
let incorrectCount = 0;

console.log('Verifying redirect fixes...\n');

for (const [oldPath, expectedNewPath] of Object.entries(expectedFixes)) {
  const pattern = new RegExp(`'${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}': '([^']+)'`);
  const match = fileContent.match(pattern);
  
  if (match) {
    const actualNewPath = match[1];
    if (actualNewPath === expectedNewPath) {
      console.log(`✅ ${oldPath}`);
      console.log(`   → ${actualNewPath}`);
      correctCount++;
    } else {
      console.log(`❌ ${oldPath}`);
      console.log(`   Expected: ${expectedNewPath}`);
      console.log(`   Found:    ${actualNewPath}`);
      allCorrect = false;
      incorrectCount++;
    }
  } else {
    console.log(`❌ ${oldPath} - NOT FOUND`);
    allCorrect = false;
    incorrectCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log(`Summary: ${correctCount} correct, ${incorrectCount} incorrect`);

if (allCorrect) {
  console.log('✅ All redirect fixes have been successfully applied!');
} else {
  console.log('❌ Some redirects are missing or incorrect.');
}

// Count total redirects in the file
const redirectCount = (fileContent.match(/'\/(recipes|getting-started|features|concepts)[^']*': '\/docs/g) || []).length;
console.log(`\nTotal redirects in file: ${redirectCount}`);