#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Load test results
const testResults = JSON.parse(fs.readFileSync('./redirect-test-results.json', 'utf-8'));

// Extract failed URLs
const failedUrls = [
  ...testResults.highConfidence.failed,
  ...testResults.lowConfidence.failed
];

console.log(`Found ${failedUrls.length} failed URLs to analyze\n`);

// Group failed URLs by issue type
const wrongRedirects = [];
const notFoundPages = [];

for (const fail of failedUrls) {
  if (fail.reason.includes('404')) {
    notFoundPages.push(fail);
  } else if (fail.reason.includes('wrong location')) {
    wrongRedirects.push(fail);
  }
}

console.log('Failed URL Analysis:');
console.log(`- Wrong redirect target: ${wrongRedirects.length}`);
console.log(`- 404 Not Found: ${notFoundPages.length}`);
console.log('\n');

// Analyze wrong redirects - these are mostly troubleshooting and technology redirects
console.log('URLs with Wrong Redirect Targets:\n');

const troubleshootingUrls = wrongRedirects.filter(u => u.originalPath.includes('/troubleshooting/'));
const technologyUrls = wrongRedirects.filter(u => 
  u.reason.includes('/technologies/') || 
  u.reason.includes('/recipes/vite/configure-vite')
);

console.log(`Troubleshooting URLs (${troubleshootingUrls.length}):`);
for (const url of troubleshootingUrls) {
  const current = url.reason.match(/Redirects to wrong location: ([^\s]+)/)?.[1];
  const expected = url.expectedPath;
  console.log(`  ${url.originalPath}`);
  console.log(`    Current: ${current}`);
  console.log(`    Should be: ${expected}`);
}

console.log(`\nTechnology/Framework URLs (${technologyUrls.length}):`);
const techGroups = {};
for (const url of technologyUrls) {
  const match = url.originalPath.match(/\/recipes\/([^\/]+)\//);
  if (match) {
    const tech = match[1];
    if (!techGroups[tech]) techGroups[tech] = [];
    techGroups[tech].push(url);
  }
}

for (const [tech, urls] of Object.entries(techGroups)) {
  console.log(`  ${tech} (${urls.length} URLs)`);
}

// Now let's check what exists in astro-docs
console.log('\n\nChecking Astro docs structure...\n');

const astroDocsPath = '/Users/jack/projects/nx-worktrees/DOC-154/astro-docs/src/content/docs';

// Check guides directory
const guidesPath = path.join(astroDocsPath, 'guides');
if (fs.existsSync(guidesPath)) {
  const guides = fs.readdirSync(guidesPath);
  console.log('Available guide categories in Astro:');
  for (const guide of guides) {
    const stat = fs.statSync(path.join(guidesPath, guide));
    if (stat.isDirectory()) {
      const files = fs.readdirSync(path.join(guidesPath, guide));
      console.log(`  - ${guide}: ${files.length} files`);
    }
  }
}

// Check for docker, storybook, etc.
console.log('\n404 Pages Analysis:');
const notFoundGroups = {};
for (const url of notFoundPages) {
  const match = url.originalPath.match(/\/recipes\/([^\/]+)\//);
  if (match) {
    const category = match[1];
    if (!notFoundGroups[category]) notFoundGroups[category] = [];
    notFoundGroups[category].push(url);
  }
}

for (const [category, urls] of Object.entries(notFoundGroups)) {
  console.log(`\n${category} (${urls.length} missing pages):`);
  
  // Check if this category exists in guides
  const categoryPath = path.join(guidesPath, category);
  if (fs.existsSync(categoryPath)) {
    const files = fs.readdirSync(categoryPath);
    console.log(`  ✅ Category exists in Astro with ${files.length} files`);
    
    // Check specific files
    for (const url of urls.slice(0, 3)) { // Show first 3
      const fileName = url.originalPath.split('/').pop() + '.mdoc';
      const filePath = path.join(categoryPath, fileName);
      if (fs.existsSync(filePath)) {
        console.log(`    ✅ ${fileName} exists`);
      } else {
        console.log(`    ❌ ${fileName} missing`);
      }
    }
  } else {
    console.log(`  ❌ Category doesn't exist in Astro guides`);
  }
}

// Generate fix recommendations
console.log('\n\n=== RECOMMENDED FIXES ===\n');

console.log('1. Troubleshooting redirects - Update these to include /docs prefix:');
for (const url of troubleshootingUrls) {
  const current = url.reason.match(/Redirects to wrong location: ([^\s]+)/)?.[1];
  console.log(`   '${url.originalPath}': '/docs${current}',`);
}

console.log('\n2. Check if these technology URLs should map to /docs/guides instead:');
for (const [tech, urls] of Object.entries(techGroups)) {
  console.log(`\n   ${tech}:`);
  for (const url of urls.slice(0, 2)) {
    const fileName = url.originalPath.split('/').pop();
    console.log(`   - ${url.originalPath} → /docs/guides/${tech}/${fileName}?`);
  }
}