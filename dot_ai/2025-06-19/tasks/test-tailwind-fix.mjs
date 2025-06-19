#!/usr/bin/env node

import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readProjectConfiguration } from '@nx/devkit';
import { applicationGenerator } from '../../../../packages/react/src/generators/application/application.js';

async function testTailwindFix() {
  console.log('🧪 Testing Tailwind styles filename fix...\n');
  
  const bundlers = ['webpack', 'rspack'];
  const results = [];
  
  for (const bundler of bundlers) {
    console.log(`📦 Testing with ${bundler} bundler...`);
    
    const tree = createTreeWithEmptyWorkspace();
    
    await applicationGenerator(tree, {
      directory: `test-app-${bundler}`,
      style: 'tailwind',
      bundler,
      linter: 'eslint',
      unitTestRunner: 'none',
      e2eTestRunner: 'none',
      addPlugin: false,
      useProjectJson: true,
    });
    
    const projectConfig = readProjectConfiguration(tree, `test-app-${bundler}`);
    const buildTarget = projectConfig.targets?.build;
    const styles = buildTarget?.options?.styles || [];
    
    const hasTailwindRef = styles.some(s => s.includes('styles.tailwind'));
    const hasCssRef = styles.some(s => s.includes('styles.css'));
    
    results.push({
      bundler,
      hasTailwindRef,
      hasCssRef,
      styles,
      success: !hasTailwindRef && hasCssRef
    });
    
    console.log(`  ✓ Styles array: ${JSON.stringify(styles)}`);
    console.log(`  ✓ Has styles.tailwind reference: ${hasTailwindRef}`);
    console.log(`  ✓ Has styles.css reference: ${hasCssRef}`);
    console.log(`  ${!hasTailwindRef && hasCssRef ? '✅' : '❌'} Test ${!hasTailwindRef && hasCssRef ? 'PASSED' : 'FAILED'}\n`);
  }
  
  console.log('\n📊 Summary:');
  console.log('────────────');
  
  const allPassed = results.every(r => r.success);
  
  results.forEach(r => {
    console.log(`${r.bundler}: ${r.success ? '✅ PASSED' : '❌ FAILED'}`);
  });
  
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '❌ Some tests failed!'}`);
  
  process.exit(allPassed ? 0 : 1);
}

testTailwindFix().catch(err => {
  console.error('Error running tests:', err);
  process.exit(1);
});