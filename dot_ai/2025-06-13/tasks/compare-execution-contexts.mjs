#!/usr/bin/env node

/**
 * Script to compare execution contexts between terminal and VS Code Migrate UI
 * This will help identify differences in how migrations are executed
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

const results = {
  terminal: {},
  vscode: {}
};

// Simulate terminal execution
async function simulateTerminalExecution() {
  console.log('=== Simulating Terminal Execution ===\n');
  
  const env = { ...process.env };
  const cwd = process.cwd();
  
  console.log('Terminal Context:');
  console.log('- CWD:', cwd);
  console.log('- NODE_PATH:', env.NODE_PATH || '(not set)');
  
  // Run the debug script as nx would
  const debugProcess = spawn('node', [
    path.join(__dirname, 'debug-module-paths.mjs')
  ], {
    cwd,
    env,
    stdio: 'pipe'
  });
  
  let output = '';
  debugProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  return new Promise((resolve) => {
    debugProcess.on('close', () => {
      results.terminal = {
        cwd,
        nodePath: env.NODE_PATH,
        output
      };
      resolve();
    });
  });
}

// Simulate VS Code execution (mimicking run-migration.ts behavior)
async function simulateVSCodeExecution() {
  console.log('\n=== Simulating VS Code Migrate UI Execution ===\n');
  
  // Check how VS Code might spawn the process differently
  const possibleCwds = [
    process.cwd(), // Current directory
    path.join(process.cwd(), '..'), // Parent directory
    '/tmp', // Temp directory
  ];
  
  for (const testCwd of possibleCwds) {
    try {
      await fs.access(testCwd);
      console.log(`Testing with CWD: ${testCwd}`);
      
      const env = { ...process.env };
      // VS Code might not pass NODE_PATH
      delete env.NODE_PATH;
      
      const debugProcess = spawn('node', [
        path.join(__dirname, 'debug-module-paths.mjs')
      ], {
        cwd: testCwd,
        env,
        stdio: 'pipe'
      });
      
      let output = '';
      debugProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      await new Promise((resolve) => {
        debugProcess.on('close', () => {
          results.vscode[testCwd] = {
            cwd: testCwd,
            nodePath: env.NODE_PATH,
            output
          };
          resolve();
        });
      });
    } catch (err) {
      console.log(`  Skipping ${testCwd}: ${err.message}`);
    }
  }
}

// Compare results
function compareResults() {
  console.log('\n=== Comparison Results ===\n');
  
  console.log('Key Differences:');
  console.log('1. Working Directory:');
  console.log('   Terminal:', results.terminal.cwd);
  Object.keys(results.vscode).forEach(key => {
    console.log(`   VS Code (${key}):`, results.vscode[key].cwd);
  });
  
  console.log('\n2. NODE_PATH:');
  console.log('   Terminal:', results.terminal.nodePath || '(not set)');
  Object.keys(results.vscode).forEach(key => {
    console.log(`   VS Code (${key}):`, results.vscode[key].nodePath || '(not set)');
  });
  
  // Extract module resolution differences
  console.log('\n3. Module Resolution Success/Failure:');
  const extractModuleResults = (output) => {
    const lines = output.split('\n');
    const moduleResults = {};
    lines.forEach(line => {
      if (line.includes('✓') || line.includes('✗')) {
        const match = line.match(/([✓✗])\s+(@?[\w\/-]+):/);
        if (match) {
          moduleResults[match[2]] = match[1] === '✓';
        }
      }
    });
    return moduleResults;
  };
  
  const terminalModules = extractModuleResults(results.terminal.output);
  console.log('\nTerminal results:', terminalModules);
  
  Object.keys(results.vscode).forEach(key => {
    const vscodeModules = extractModuleResults(results.vscode[key].output);
    console.log(`\nVS Code (${key}) results:`, vscodeModules);
    
    // Find differences
    const differences = [];
    Object.keys(terminalModules).forEach(module => {
      if (terminalModules[module] !== vscodeModules[module]) {
        differences.push(`${module}: terminal=${terminalModules[module]}, vscode=${vscodeModules[module]}`);
      }
    });
    
    if (differences.length > 0) {
      console.log('  Differences found:', differences);
    }
  });
}

// Main execution
async function main() {
  try {
    await simulateTerminalExecution();
    await simulateVSCodeExecution();
    compareResults();
    
    // Save results for further analysis
    await fs.writeFile(
      path.join(__dirname, 'execution-context-comparison.json'),
      JSON.stringify(results, null, 2)
    );
    
    console.log('\n✓ Results saved to execution-context-comparison.json');
  } catch (err) {
    console.error('Error during comparison:', err);
  }
}

main();