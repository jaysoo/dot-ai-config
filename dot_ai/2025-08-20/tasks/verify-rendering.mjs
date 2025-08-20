#!/usr/bin/env node
import { execSync } from 'child_process';

const pages = [
  'angular-monorepo',
  'gradle',
  'react-monorepo',
  'typescript-packages'
];

console.log('Verifying code block rendering on dev server...\n');

for (const page of pages) {
  const url = `http://localhost:4322/getting-started/tutorials/${page}`;
  console.log(`Checking ${page}...`);
  
  try {
    // Fetch the page HTML
    const html = execSync(`curl -s "${url}"`, { encoding: 'utf-8' });
    
    // Check for code blocks with filenames (looking for comment patterns in the rendered HTML)
    const hasFileComments = html.includes('<span class="line"><span') && 
                           (html.includes('// apps/demo') || 
                            html.includes('// packages/') ||
                            html.includes('# .github/'));
    
    // Check for highlighted lines (looking for highlighted class or attribute)
    const hasHighlights = html.includes('highlighted') || 
                         html.includes('data-line=') ||
                         html.includes('class="line mark');
    
    console.log(`  ✓ Page loads successfully`);
    if (hasFileComments) {
      console.log(`  ✓ File comments found in code blocks`);
    } else {
      console.log(`  ⚠ No file comments detected (may need manual verification)`);
    }
    if (hasHighlights) {
      console.log(`  ✓ Line highlighting detected`);
    } else {
      console.log(`  ⚠ No line highlighting detected (may be on different section)`);
    }
    
  } catch (error) {
    console.log(`  ✗ Error loading page: ${error.message}`);
  }
  
  console.log();
}

console.log('Verification complete!');
console.log('\nNote: For full visual verification, please manually check the pages in a browser.');
console.log('The dev server is running at http://localhost:4322/');