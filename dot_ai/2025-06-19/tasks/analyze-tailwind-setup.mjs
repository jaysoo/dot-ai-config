#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

console.log('=== Analyzing Tailwind Setup in Nx React Generators ===\n');

// Analyze Tailwind templates
const tailwindTemplateDir = '/Users/jack/projects/nx/packages/react/src/generators/application/files/style-tailwind';
console.log('## Tailwind Template Files:');
try {
  const files = readdirSync(tailwindTemplateDir, { recursive: true });
  files.forEach(file => {
    const fullPath = join(tailwindTemplateDir, file);
    if (statSync(fullPath).isFile()) {
      console.log(`- ${file}`);
    }
  });
} catch (e) {
  console.log('Error reading Tailwind templates:', e.message);
}

// Check Tailwind configuration in bundlers
console.log('\n## Bundler Configurations:');
const bundlerFiles = [
  '/Users/jack/projects/nx/packages/react/src/generators/application/lib/add-vite.ts',
  '/Users/jack/projects/nx/packages/react/src/generators/application/lib/add-webpack.ts',
  '/Users/jack/projects/nx/packages/react/src/generators/application/lib/add-rspack.ts',
  '/Users/jack/projects/nx/packages/react/src/generators/application/lib/add-rsbuild.ts'
];

bundlerFiles.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    const hasTailwind = content.includes('tailwind') || content.includes('Tailwind');
    console.log(`- ${basename(file)}: ${hasTailwind ? 'Contains Tailwind logic' : 'No Tailwind references'}`);
    
    if (hasTailwind) {
      // Extract Tailwind-related snippets
      const lines = content.split('\n');
      const tailwindLines = lines.filter(line => 
        line.toLowerCase().includes('tailwind') || 
        line.includes('postcss') ||
        line.includes('autoprefixer')
      );
      console.log(`  Key references:`);
      tailwindLines.slice(0, 5).forEach(line => {
        console.log(`    ${line.trim()}`);
      });
    }
  } catch (e) {
    console.log(`- ${basename(file)}: Error reading file`);
  }
});

// Check PostCSS configuration
console.log('\n## PostCSS Setup:');
const postcssFiles = [
  '/Users/jack/projects/nx/packages/react/src/generators/application/lib/add-postcss-config.ts',
  '/Users/jack/projects/nx/packages/react/src/generators/application/files/style-tailwind/postcss.config.js'
];

postcssFiles.forEach(file => {
  try {
    const content = readFileSync(file, 'utf8');
    console.log(`\n### ${basename(file)}:`);
    console.log(content.substring(0, 500) + '...');
  } catch (e) {
    console.log(`- ${basename(file)}: Not found or error reading`);
  }
});

// Check for Tailwind-specific utilities
console.log('\n## Tailwind Dependencies:');
try {
  const versionsFile = readFileSync('/Users/jack/projects/nx/packages/react/src/utils/versions.ts', 'utf8');
  const tailwindVersions = versionsFile.split('\n').filter(line => 
    line.includes('tailwind') || 
    line.includes('postcss') || 
    line.includes('autoprefixer')
  );
  tailwindVersions.forEach(line => console.log(line.trim()));
} catch (e) {
  console.log('Error reading versions file');
}

console.log('\n## Component Generator Tailwind Support:');
const componentGenFile = '/Users/jack/projects/nx/packages/react/src/generators/component/component.ts';
try {
  const content = readFileSync(componentGenFile, 'utf8');
  const hasTailwind = content.includes('tailwind');
  console.log(`Component generator: ${hasTailwind ? 'Has Tailwind support' : 'No explicit Tailwind support'}`);
} catch (e) {
  console.log('Error reading component generator');
}