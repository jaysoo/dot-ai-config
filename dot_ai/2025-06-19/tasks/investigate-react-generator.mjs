#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../../..');

async function findFiles(dir, pattern, exclude = []) {
  const results = [];
  
  async function walk(currentDir) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        const relativePath = fullPath.replace(rootDir + '/', '');
        
        // Skip excluded directories
        if (exclude.some(ex => relativePath.includes(ex))) continue;
        
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && pattern.test(entry.name)) {
          results.push(relativePath);
        }
      }
    } catch (err) {
      // Ignore permission errors
    }
  }
  
  await walk(dir);
  return results;
}

async function searchInFile(filePath, searchTerms) {
  try {
    const content = await readFile(join(rootDir, filePath), 'utf-8');
    const matches = [];
    
    for (const term of searchTerms) {
      if (content.includes(term)) {
        // Find line numbers
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.includes(term)) {
            matches.push({
              term,
              line: index + 1,
              content: line.trim()
            });
          }
        });
      }
    }
    
    return matches.length > 0 ? { file: filePath, matches } : null;
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log('🔍 Investigating React Generator Tailwind Issue\n');
  
  // Step 1: Find React generator files
  console.log('📁 Finding React generator files...');
  const generatorFiles = await findFiles(
    join(rootDir, 'packages'),
    /\.(ts|js)$/,
    ['node_modules', 'dist', '.git']
  );
  
  const reactGeneratorFiles = generatorFiles.filter(f => 
    f.includes('react') && (f.includes('generator') || f.includes('application'))
  );
  
  console.log(`Found ${reactGeneratorFiles.length} React generator related files\n`);
  
  // Step 2: Search for Tailwind and styles references
  console.log('🔎 Searching for Tailwind and styles references...');
  const searchTerms = [
    'styles.tailwind',
    'styles.css',
    'tailwind',
    'style:',
    '"styles"',
    "'styles'"
  ];
  
  const results = [];
  for (const file of reactGeneratorFiles) {
    const result = await searchInFile(file, searchTerms);
    if (result) {
      results.push(result);
    }
  }
  
  // Step 3: Display findings
  console.log('\n📊 Findings:\n');
  for (const result of results) {
    console.log(`📄 ${result.file}`);
    for (const match of result.matches) {
      console.log(`   Line ${match.line}: ${match.term}`);
      console.log(`   > ${match.content}`);
    }
    console.log('');
  }
  
  // Step 4: Look specifically for project.json generation
  console.log('🔍 Searching for project.json generation...');
  const projectJsonTerms = [
    'project.json',
    'projectConfiguration',
    'styles:',
    'build:'
  ];
  
  const projectJsonResults = [];
  for (const file of reactGeneratorFiles) {
    const result = await searchInFile(file, projectJsonTerms);
    if (result) {
      projectJsonResults.push(result);
    }
  }
  
  console.log('\n📊 Project.json related findings:\n');
  for (const result of projectJsonResults) {
    console.log(`📄 ${result.file}`);
    for (const match of result.matches) {
      console.log(`   Line ${match.line}: ${match.term}`);
    }
    console.log('');
  }
  
  // Summary
  console.log('\n📋 Summary:');
  console.log(`- Found ${results.length} files with style/tailwind references`);
  console.log(`- Found ${projectJsonResults.length} files with project.json references`);
  console.log('\nNext steps: Examine these files to understand the bug');
}

main().catch(console.error);