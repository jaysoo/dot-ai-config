#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '../../..');

// E2E test files to analyze
const e2eTestFiles = [
  'e2e/react/src/react-vite.test.ts',
  'e2e/react/src/react-webpack.test.ts',
  'e2e/react/src/react-rspack.test.ts'
];

console.log('=== E2E Test Structure Analysis ===\n');

for (const testFile of e2eTestFiles) {
  const fullPath = join(rootDir, testFile);
  
  if (existsSync(fullPath)) {
    console.log(`\n${testFile}:`);
    const content = readFileSync(fullPath, 'utf-8');
    
    // Find test descriptions
    const testMatches = content.match(/(?:describe|it)\(['"`](.*?)['"`]/g);
    if (testMatches) {
      console.log('Test cases found:');
      testMatches.slice(0, 5).forEach(match => {
        const testName = match.match(/['"`](.*?)['"`]/)[1];
        console.log(`  - ${testName}`);
      });
      if (testMatches.length > 5) {
        console.log(`  ... and ${testMatches.length - 5} more`);
      }
    }
    
    // Check if port is mentioned
    if (content.includes('port') || content.includes('4200') || content.includes('4300')) {
      console.log('  ✓ Contains port-related code');
    }
    
    // Check for generator calls
    const generatorCalls = content.match(/runNxCommandAsync\(['"`]generate.*?react:application/g);
    if (generatorCalls) {
      console.log(`  ✓ Contains ${generatorCalls.length} React application generator calls`);
    }
  } else {
    console.log(`\n${testFile}: NOT FOUND`);
  }
}

console.log('\n=== Next Steps ===');
console.log('1. Add port tests to react-vite.test.ts');
console.log('2. Add port tests to react-rspack.test.ts');
console.log('3. Add port tests to react-webpack.test.ts (or create if needed)');
console.log('4. Ensure tests verify both generator acceptance and actual port usage');