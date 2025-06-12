#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '../../..');

// Analyze React Application Generator
console.log('=== React Application Generator Analysis ===\n');

const reactGenPath = join(rootDir, 'packages/react/src/generators/application');
const reactSchemaPath = join(reactGenPath, 'schema.json');
const reactGeneratorPath = join(reactGenPath, 'application.ts');

if (existsSync(reactSchemaPath)) {
  console.log('React Generator Schema:');
  const schema = JSON.parse(readFileSync(reactSchemaPath, 'utf-8'));
  console.log('- Properties:', Object.keys(schema.properties || {}).join(', '));
  console.log('- Required:', schema.required?.join(', ') || 'none');
  
  // Check if bundler option exists
  if (schema.properties?.bundler) {
    console.log('- Bundler options:', schema.properties.bundler.enum?.join(', ') || 'not specified');
  }
}

// Analyze Vite Configuration Generator
console.log('\n=== Vite Configuration Generator Analysis ===\n');

const viteGenPath = join(rootDir, 'packages/vite/src/generators/configuration');
const viteSchemaPath = join(viteGenPath, 'schema.json');

if (existsSync(viteSchemaPath)) {
  console.log('Vite Configuration Schema:');
  const schema = JSON.parse(readFileSync(viteSchemaPath, 'utf-8'));
  console.log('- Properties:', Object.keys(schema.properties || {}).join(', '));
  
  // Look for any port-related configuration
  const portRelated = Object.entries(schema.properties || {})
    .filter(([key, value]) => key.toLowerCase().includes('port') || 
            (typeof value === 'object' && value.description?.toLowerCase().includes('port')))
    .map(([key]) => key);
  
  if (portRelated.length > 0) {
    console.log('- Port-related properties:', portRelated.join(', '));
  }
}

// Check for default port configuration in files
console.log('\n=== Default Port Usage ===\n');

const searchPatterns = [
  { path: 'packages/vite/src', pattern: '4200', label: 'Vite default port (4200)' },
  { path: 'packages/webpack/src', pattern: '4300', label: 'Webpack default port (4300)' },
  { path: 'packages/rspack/src', pattern: '4300', label: 'Rspack default port (4300)' }
];

console.log('Searching for hardcoded port values...');
// We'll output paths to check manually since we can't recursively search easily

searchPatterns.forEach(({ path, pattern, label }) => {
  console.log(`\nCheck ${label} in: ${join(rootDir, path)}`);
});

// Analyze Webpack Configuration Generator
console.log('\n=== Webpack Configuration Generator Analysis ===\n');

const webpackGenPath = join(rootDir, 'packages/webpack/src/generators/configuration');
const webpackSchemaPath = join(webpackGenPath, 'schema.json');

if (existsSync(webpackSchemaPath)) {
  console.log('Webpack Configuration Schema:');
  const schema = JSON.parse(readFileSync(webpackSchemaPath, 'utf-8'));
  console.log('- Properties:', Object.keys(schema.properties || {}).join(', '));
}

// Analyze Rspack Configuration Generator
console.log('\n=== Rspack Configuration Generator Analysis ===\n');

const rspackGenPath = join(rootDir, 'packages/rspack/src/generators/configuration');
const rspackSchemaPath = join(rspackGenPath, 'schema.json');

if (existsSync(rspackSchemaPath)) {
  console.log('Rspack Configuration Schema:');
  const schema = JSON.parse(readFileSync(rspackSchemaPath, 'utf-8'));
  console.log('- Properties:', Object.keys(schema.properties || {}).join(', '));
}

console.log('\n=== Next Steps ===');
console.log('1. Review the schema properties above');
console.log('2. Search for port configuration in generator implementation files');
console.log('3. Look for template files that might contain port configuration');
console.log('4. Check how the bundler option flows from React generator to configuration generators');