#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = path.join(__dirname, 'notion-incident-pages');

function searchForBetterStack(dir) {
  const results = [];
  
  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes('betterstack') || 
              line.includes('uptime.betterstack.com') ||
              line.includes('status.nx.app')) {
            results.push({
              file: path.relative(backupDir, filePath),
              line: index + 1,
              content: line.trim()
            });
          }
        });
      }
    }
  }
  
  walkDir(dir);
  return results;
}

console.log('Searching for BetterStack references...\n');
const references = searchForBetterStack(backupDir);

console.log(`Found ${references.length} references:\n`);
references.forEach(ref => {
  console.log(`File: ${ref.file}`);
  console.log(`Line ${ref.line}: ${ref.content}`);
  console.log('---');
});

// Also search for status.nx.app references
console.log('\nSearching for status.nx.app references...');
const statusRefs = references.filter(ref => ref.content.includes('status.nx.app'));
console.log(`Found ${statusRefs.length} status.nx.app references that need updating to status.nx.dev`);