#!/usr/bin/env node
/**
 * Script to measure current token usage of extract_todos function
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);

async function callMCPFunction(functionName, params) {
  const command = `echo '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "${functionName}", "arguments": ${JSON.stringify(params)}}, "id": 1}' | nc localhost 3333`;
  
  try {
    const { stdout } = await execAsync(command);
    return JSON.parse(stdout);
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    return null;
  }
}

async function measureTokens(text) {
  // Rough approximation: 1 token ≈ 4 characters
  // This is a simplified calculation - actual token count varies by model
  const charCount = text.length;
  const wordCount = text.split(/\s+/).length;
  const estimatedTokens = Math.ceil(charCount / 4);
  
  return {
    characters: charCount,
    words: wordCount,
    estimatedTokens: estimatedTokens
  };
}

async function main() {
  console.log('Measuring token usage for extract_todos function...\n');
  
  // Test different category filters
  const testCases = [
    { category: 'all', date_filter: null },
    { category: 'tasks', date_filter: null },
    { category: 'tasks', date_filter: '2025-06-09' },
    { category: 'all', date_filter: '2025-06-01..2025-06-09' }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n--- Test Case: category="${testCase.category}", date_filter="${testCase.date_filter || 'none'}" ---`);
    
    const result = await callMCPFunction('mcp__MyNotes__extract_todos', testCase);
    
    if (result && result.result) {
      const content = JSON.stringify(result.result, null, 2);
      const metrics = await measureTokens(content);
      
      console.log(`Response size:`);
      console.log(`  Characters: ${metrics.characters.toLocaleString()}`);
      console.log(`  Words: ${metrics.words.toLocaleString()}`);
      console.log(`  Estimated tokens: ${metrics.estimatedTokens.toLocaleString()}`);
      
      // Check if exceeds limit
      if (metrics.estimatedTokens > 25000) {
        console.log(`  ⚠️  EXCEEDS 25000 TOKEN LIMIT!`);
      }
      
      // Analyze content structure
      const todos = result.result;
      if (Array.isArray(todos)) {
        console.log(`\nContent analysis:`);
        console.log(`  Total files with TODOs: ${todos.length}`);
        
        let totalTodos = 0;
        let totalContentSize = 0;
        
        todos.forEach(file => {
          if (file.todos && Array.isArray(file.todos)) {
            totalTodos += file.todos.length;
            totalContentSize += JSON.stringify(file).length;
          }
        });
        
        console.log(`  Total TODO items: ${totalTodos}`);
        console.log(`  Average size per file: ${Math.round(totalContentSize / todos.length).toLocaleString()} chars`);
      }
      
      // Save sample output for analysis
      await fs.writeFile(
        `/Users/jack/projects/dot-ai-config/dot_ai/2025-06-09/tasks/todo-sample-${testCase.category}-${testCase.date_filter?.replace('..', '-to-') || 'all'}.json`,
        content
      );
    } else {
      console.log('Failed to get response from MCP server');
    }
  }
  
  console.log('\n\nAnalysis complete. Sample outputs saved to todo-sample-*.json files.');
}

main().catch(console.error);