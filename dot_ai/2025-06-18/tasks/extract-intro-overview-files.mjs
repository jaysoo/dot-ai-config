#!/usr/bin/env node

import { readFileSync } from 'fs';

const mapData = JSON.parse(readFileSync('docs/map.json', 'utf-8'));

function findIntroOverview(item, path = '', section = null) {
  const results = [];
  
  // Check if this item is introduction or overview
  if (item.id === 'introduction' || item.id === 'overview') {
    if (item.file) {
      results.push({
        section: section,
        path: path,
        id: item.id,
        file: `docs/${item.file}.md`,
        name: item.name
      });
    }
  }
  
  // Recursively check itemList
  if (item.itemList) {
    for (const child of item.itemList) {
      results.push(...findIntroOverview(child, `${path}/${child.id}`, section));
    }
  }
  
  return results;
}

// First, find the nx-documentation root
let nxDocs = null;
for (const content of mapData.content) {
  if (content.id === 'nx-documentation') {
    nxDocs = content;
    break;
  }
}

const allFiles = [];

if (nxDocs && nxDocs.itemList) {
  // Look for technologies and core-api within nx-documentation
  for (const item of nxDocs.itemList) {
    if (item.id === 'technologies') {
      allFiles.push(...findIntroOverview(item, 'technologies', 'technologies'));
    } else if (item.id === 'reference' && item.itemList) {
      // core-api is nested under reference
      for (const refItem of item.itemList) {
        if (refItem.id === 'core-api') {
          allFiles.push(...findIntroOverview(refItem, 'core-api', 'core-api'));
        }
      }
    }
  }
}

// Sort by section and path
allFiles.sort((a, b) => {
  if (a.section !== b.section) return a.section.localeCompare(b.section);
  return a.path.localeCompare(b.path);
});

// Print results
console.log('Found files with introduction/overview IDs:\n');
for (const file of allFiles) {
  console.log(`Section: ${file.section}`);
  console.log(`Path: ${file.path}`);
  console.log(`ID: ${file.id}`);
  console.log(`File: ${file.file}`);
  console.log(`Name: ${file.name || 'N/A'}`);
  console.log('---');
}

console.log(`\nTotal files found: ${allFiles.length}`);