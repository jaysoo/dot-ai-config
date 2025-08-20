#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';

const files = [
  'astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/gradle.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/react-monorepo.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/typescript-packages.md'
];

function adjustHighlightNumbers(highlightStr) {
  // Parse the highlight string and adjust each number by +1
  return highlightStr.replace(/(\d+)/g, (match, num) => {
    return String(parseInt(num) + 1);
  });
}

function fixHighlightOffsets(filePath) {
  console.log(`Processing: ${filePath}`);
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let modified = false;
  
  for (let i = 0; i < lines.length - 1; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];
    
    // Check if current line has highlights and next line is a filename comment
    const highlightMatch = currentLine.match(/^```(\w+)\s+\{([^}]+)\}$/);
    if (highlightMatch && nextLine && (nextLine.startsWith('// ') || nextLine.startsWith('# '))) {
      const lang = highlightMatch[1];
      const oldHighlights = highlightMatch[2];
      const newHighlights = adjustHighlightNumbers(oldHighlights);
      
      console.log(`  Line ${i+1}: Adjusting highlights from {${oldHighlights}} to {${newHighlights}}`);
      lines[i] = `\`\`\`${lang} {${newHighlights}}`;
      modified = true;
    }
  }
  
  if (modified) {
    writeFileSync(filePath, lines.join('\n'), 'utf-8');
    console.log(`  ✅ File updated with adjusted highlight offsets`);
    return true;
  } else {
    console.log(`  ⏭️  No adjustments needed`);
    return false;
  }
}

// Main execution
console.log('Fixing highlight line offsets to account for filename comments...\n');

let totalFixed = 0;

for (const file of files) {
  if (fixHighlightOffsets(file)) {
    totalFixed++;
  }
  console.log();
}

console.log('=' .repeat(50));
console.log(`Fixed ${totalFixed} files with adjusted highlight offsets`);