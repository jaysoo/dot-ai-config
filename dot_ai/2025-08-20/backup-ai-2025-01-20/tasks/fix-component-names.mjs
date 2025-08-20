#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { relative } from 'path';

const ASTRO_DOCS_PATH = 'astro-docs';

// Mapping of incorrect names to correct names
const componentMappings = {
  'call-to-action': 'call_to_action',
  'project-details': 'project_details',
  'github-repository': 'github_repository',
  'install-nx-console': 'install_nx_console',
  'side-by-side': 'side_by_side', // This one needs to be added to the config
  'link-card': 'link_card',
  'course-video': 'course_video',
  'stackblitz-button': 'stackblitz_button',
  'video-link': 'video_link',
  'video-player': 'video_player',
  'index-page-cards': 'index_page_cards',
};

console.log('Finding all mdoc files with component tags...\n');

const mdocFiles = execSync(`find ${ASTRO_DOCS_PATH} -name "*.mdoc"`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${mdocFiles.length} mdoc files to check\n`);

const changes = [];
let totalReplacements = 0;

for (const filePath of mdocFiles) {
  const content = readFileSync(filePath, 'utf-8');
  let newContent = content;
  let fileChanges = 0;
  
  // Check for each incorrect component name
  for (const [incorrect, correct] of Object.entries(componentMappings)) {
    const openTagPattern = new RegExp(`{%\\s*${incorrect}`, 'g');
    const closeTagPattern = new RegExp(`{%\\s*/${incorrect}`, 'g');
    
    const openMatches = content.match(openTagPattern) || [];
    const closeMatches = content.match(closeTagPattern) || [];
    const matchCount = openMatches.length + closeMatches.length;
    
    if (matchCount > 0) {
      // Replace the incorrect names with correct ones
      newContent = newContent
        .replace(openTagPattern, `{% ${correct}`)
        .replace(closeTagPattern, `{% /${correct}`);
      
      fileChanges += matchCount;
      console.log(`  ${relative(process.cwd(), filePath)}: ${matchCount} instances of '${incorrect}'`);
    }
  }
  
  if (fileChanges > 0) {
    writeFileSync(filePath, newContent, 'utf-8');
    changes.push({
      file: relative(process.cwd(), filePath),
      count: fileChanges
    });
    totalReplacements += fileChanges;
  }
}

console.log('\n=== Summary ===');
console.log(`Fixed ${changes.length} files`);
console.log(`Total replacements: ${totalReplacements}`);

// Check for side-by-side usage
const sideBySidePattern = /{%\s*side_by_side/;
const sideBySideFiles = [];

for (const filePath of mdocFiles) {
  const content = readFileSync(filePath, 'utf-8');
  if (sideBySidePattern.test(content)) {
    sideBySideFiles.push(relative(process.cwd(), filePath));
  }
}

if (sideBySideFiles.length > 0) {
  console.log('\n⚠️  Warning: The following files use side_by_side which is not defined in markdoc.config.mjs:');
  sideBySideFiles.forEach(file => console.log(`  - ${file}`));
  console.log('\nYou need to either:');
  console.log('1. Add a side_by_side component definition to markdoc.config.mjs');
  console.log('2. Or remove/replace these tags with an alternative');
}

console.log('\n✅ Component name fixes complete!');