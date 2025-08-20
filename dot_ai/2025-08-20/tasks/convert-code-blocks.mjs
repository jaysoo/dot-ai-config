#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { join, relative } from 'path';

// Files identified from analysis
const FILES_TO_CONVERT = [
  'astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/gradle.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/react-monorepo.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/typescript-packages.md'
];

function parseHighlightLines(highlightStr) {
  // Handle various formats: ["5-18"] or [1, "18-20"] or [2, 6, 7]
  const parts = highlightStr.split(',').map(p => p.trim());
  const result = [];
  
  for (const part of parts) {
    // Remove quotes if present
    const cleanPart = part.replace(/['"]/g, '');
    
    if (cleanPart.includes('-')) {
      // Range format: "5-18"
      result.push(cleanPart);
    } else {
      // Single number
      result.push(cleanPart);
    }
  }
  
  return result.join(',');
}

function convertCodeBlock(match, lang, attrs, codeContent) {
  // Parse attributes
  const fileName = attrs.match(/fileName="([^"]+)"/)?.[1];
  const highlightLinesMatch = attrs.match(/highlightLines=\[([^\]]+)\]/)?.[1];
  
  let newHeader = '```' + lang;
  let newCodeContent = codeContent;
  
  // Add highlight lines to header if present
  if (highlightLinesMatch) {
    const highlights = parseHighlightLines(highlightLinesMatch);
    newHeader += ` {${highlights}}`;
  }
  
  // Add filename as first line comment if present
  if (fileName) {
    // Determine comment style based on language
    let commentPrefix = '//';
    if (lang === 'yaml' || lang === 'yml') {
      commentPrefix = '#';
    } else if (lang === 'html' || lang === 'xml') {
      commentPrefix = '<!--';
    } else if (lang === 'css' || lang === 'scss' || lang === 'less') {
      commentPrefix = '/*';
    } else if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
      commentPrefix = '#';
    } else if (lang === 'json') {
      // JSON doesn't support comments, but Starlight might handle // anyway
      commentPrefix = '//';
    } else if (lang === 'diff') {
      // Diff files typically use # for comments but // might work with Starlight
      commentPrefix = '//';
    }
    
    // Add filename comment as first line
    const fileComment = commentPrefix === '<!--' ? `<!-- ${fileName} -->` :
                       commentPrefix === '/*' ? `/* ${fileName} */` :
                       `${commentPrefix} ${fileName}`;
    
    // Ensure there's no leading newline in code content
    const trimmedContent = codeContent.replace(/^\n/, '');
    newCodeContent = '\n' + fileComment + '\n' + trimmedContent;
  }
  
  return newHeader + newCodeContent;
}

function convertFile(filePath) {
  console.log(`\nProcessing: ${filePath}`);
  
  const content = readFileSync(filePath, 'utf-8');
  
  // Regex to match code blocks with attributes
  const codeBlockRegex = /```(\w+)\s*\{%\s*(.*?)\s*%\}([\s\S]*?)```/g;
  
  let convertedContent = content;
  let conversionCount = 0;
  
  convertedContent = convertedContent.replace(codeBlockRegex, (match, lang, attrs, codeContent) => {
    // Only process if it has fileName or highlightLines
    if (attrs.includes('fileName=') || attrs.includes('highlightLines=')) {
      conversionCount++;
      const result = convertCodeBlock(match, lang, attrs, codeContent);
      console.log(`  ✓ Converted code block #${conversionCount} (${lang})`);
      return result;
    }
    return match;
  });
  
  if (conversionCount > 0) {
    writeFileSync(filePath, convertedContent, 'utf-8');
    console.log(`  ✅ File updated with ${conversionCount} conversions`);
    return conversionCount;
  } else {
    console.log(`  ⏭️  No conversions needed`);
    return 0;
  }
}

// Main execution
console.log('Converting code blocks to Starlight format...');
console.log('=' .repeat(50));

let totalConversions = 0;
let filesModified = 0;

for (const file of FILES_TO_CONVERT) {
  const conversions = convertFile(file);
  if (conversions > 0) {
    totalConversions += conversions;
    filesModified++;
  }
}

console.log('\n' + '=' .repeat(50));
console.log('Conversion Summary:');
console.log(`  Files modified: ${filesModified}`);
console.log(`  Total code blocks converted: ${totalConversions}`);
console.log('\n✅ Conversion complete!');