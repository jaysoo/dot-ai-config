#!/usr/bin/env node

// Script to check what npm packages are available in Ubuntu

import { execSync } from 'child_process';

console.log('Checking available npm-related packages in Ubuntu...');

const packages = [
  'npm',
  'nodejs-npm', 
  'node-npm',
  'nodejs'
];

for (const pkg of packages) {
  try {
    const result = execSync(`apt-cache search "^${pkg}$"`, { encoding: 'utf8' });
    if (result.trim()) {
      console.log(`✅ ${pkg}: ${result.trim()}`);
    } else {
      console.log(`❌ ${pkg}: Not found`);
    }
  } catch (error) {
    console.log(`❌ ${pkg}: Error checking - ${error.message}`);
  }
}

// Also check what provides npm
try {
  const npmProviders = execSync('apt-cache search npm | head -10', { encoding: 'utf8' });
  console.log('\nPackages mentioning npm:');
  console.log(npmProviders);
} catch (error) {
  console.log('Error searching for npm providers:', error.message);
}