#!/usr/bin/env node
import http from 'http';

function fetchPage(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4322,
      path: path,
      method: 'GET'
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('Testing TypeScript packages tutorial page...\n');
  
  try {
    const html = await fetchPage('/getting-started/tutorials/typescript-packages');
    
    // Check if page loaded
    if (html.includes('TypeScript Packages Tutorial')) {
      console.log('✓ Page loaded successfully');
    }
    
    // Look for code blocks with file paths as comments
    const hasAnimalFile = html.includes('packages/animal/src/lib/animal.ts');
    const hasZooFile = html.includes('packages/zoo/src/lib/zoo.ts');
    const hasWorkflowFile = html.includes('.github/workflows/ci.yml');
    
    if (hasAnimalFile) {
      console.log('✓ Found animal.ts filename in code block');
    }
    if (hasZooFile) {
      console.log('✓ Found zoo.ts filename in code block');
    }
    if (hasWorkflowFile) {
      console.log('✓ Found ci.yml filename in code block');
    }
    
    // Check for line highlighting patterns
    if (html.includes('data-line') || html.includes('highlighted')) {
      console.log('✓ Line highlighting markers found');
    }
    
    // Extract a sample code block to verify format
    const codeBlockMatch = html.match(/<pre[^>]*>.*?<code[^>]*>([\s\S]*?)<\/code>/);
    if (codeBlockMatch) {
      const codeContent = codeBlockMatch[1].substring(0, 200);
      console.log('\nSample of rendered code block:');
      console.log(codeContent.replace(/<[^>]*>/g, '').substring(0, 100) + '...');
    }
    
  } catch (error) {
    console.error('Error fetching page:', error.message);
  }
}

main();