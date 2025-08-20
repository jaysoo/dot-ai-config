#!/usr/bin/env node
import { readFileSync } from 'fs';

const files = [
  'astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/gradle.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/react-monorepo.md',
  'astro-docs/src/content/docs/getting-started/Tutorials/typescript-packages.md'
];

function verifyCodeBlocks(filePath) {
  const fileName = filePath.split('/').pop();
  console.log(`Checking ${fileName}:`);
  
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  let inCodeBlock = false;
  let codeBlockStart = -1;
  let codeBlockLang = '';
  let issues = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (!inCodeBlock && line.startsWith('```')) {
      inCodeBlock = true;
      codeBlockStart = i + 1; // Line numbers are 1-based
      codeBlockLang = line.substring(3).split(' ')[0];
    } else if (inCodeBlock && line === '```') {
      inCodeBlock = false;
      codeBlockLang = '';
    }
  }
  
  if (inCodeBlock) {
    issues.push(`  ❌ Unclosed code block starting at line ${codeBlockStart} (${codeBlockLang})`);
  }
  
  // Check for specific patterns that indicate issues
  const codeBlockOpens = (content.match(/^```[a-z]/gm) || []).length;
  const codeBlockCloses = (content.match(/^```$/gm) || []).length;
  
  console.log(`  Code block opens: ${codeBlockOpens}`);
  console.log(`  Code block closes: ${codeBlockCloses}`);
  
  if (codeBlockOpens !== codeBlockCloses) {
    issues.push(`  ⚠️  Mismatch: ${codeBlockOpens} opens vs ${codeBlockCloses} closes`);
  }
  
  if (issues.length > 0) {
    issues.forEach(issue => console.log(issue));
    return false;
  } else {
    console.log('  ✅ All code blocks properly closed');
    return true;
  }
}

console.log('Verifying code block integrity...\n');

let allGood = true;
for (const file of files) {
  if (!verifyCodeBlocks(file)) {
    allGood = false;
  }
  console.log();
}

if (allGood) {
  console.log('✅ All files have properly closed code blocks!');
} else {
  console.log('❌ Some files have unclosed code blocks. Please review.');
}