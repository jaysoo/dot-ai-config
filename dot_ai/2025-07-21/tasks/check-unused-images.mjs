#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const images = [
  'Circle PR passed.png',
  'Message Logged.png',
  'cipe-agents-in-progress.png',
  'circle-ci-remote-cache.png',
  'circle-create-pr.avif',
  'circle-dte-multiple-agents.png',
  'circle-new-run.avif',
  'circle-orb-security.png',
  'circle-pr.avif',
  'circle-setup-project.avif',
  'circle-single-build-success.jpg',
  'connect-repository.png',
  'connect-vcs-account.png',
  'gh-ci-remote-cache.png',
  'gh-dte-multiple-agents.png',
  'gh-message.png',
  'gh-pr-passed.png',
  'gh-single-build-success.png',
  'github-cloud-pr.avif',
  'github-pr-distribution.avif',
  'github-pr-workflow.avif',
  'nx-cloud-distribution.avif',
  'nx-cloud-empty-workspace.png',
  'nx-cloud-report-comment.png',
  'nx-cloud-run-details.png',
  'nx-cloud-setup-pr.png',
  'nx-cloud-setup.avif'
];

const unusedImages = [];
const usedImages = [];

console.log('Checking image references in markdown files...\n');

for (const image of images) {
  try {
    // Escape special characters in filename for grep
    const escapedImage = image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Search for the image in all markdown files
    const result = execSync(
      `grep -r "${escapedImage}" --include="*.md" . 2>/dev/null || true`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );
    
    if (result.trim()) {
      console.log(`✓ ${image} - USED`);
      usedImages.push(image);
      console.log(`  Found in:`);
      const lines = result.trim().split('\n').slice(0, 3);
      lines.forEach(line => {
        const [file] = line.split(':');
        console.log(`  - ${file}`);
      });
      if (result.trim().split('\n').length > 3) {
        console.log(`  ... and ${result.trim().split('\n').length - 3} more files`);
      }
    } else {
      console.log(`✗ ${image} - NOT FOUND`);
      unusedImages.push(image);
    }
  } catch (error) {
    console.log(`✗ ${image} - NOT FOUND`);
    unusedImages.push(image);
  }
  console.log('');
}

console.log('\n=== SUMMARY ===');
console.log(`Total images checked: ${images.length}`);
console.log(`Used images: ${usedImages.length}`);
console.log(`Unused images: ${unusedImages.length}`);

if (unusedImages.length > 0) {
  console.log('\n=== UNUSED IMAGES TO REMOVE ===');
  unusedImages.forEach(img => console.log(`- ${img}`));
  
  console.log('\n=== REMOVAL COMMANDS ===');
  unusedImages.forEach(img => {
    console.log(`rm "docs/nx-cloud/tutorial/${img}"`);
  });
}