#!/usr/bin/env node
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Test a sample of redirects
const sampleRedirects = [
  { from: "/getting-started/intro", to: "/docs/getting-started/intro" },
  { from: "/features/run-tasks", to: "/docs/features/run-tasks" },
  { from: "/recipes/node/node-server-fly-io", to: "/docs/recipes/node/node-server-fly-io" },
  { from: "/ci/intro/ci-with-nx", to: "/docs/ci/intro/ci-with-nx" },
  { from: "/nx-api/angular", to: "/docs/nx-api/angular" }
];

const baseUrl = 'https://canary.nx.dev';

async function checkUrl(url) {
  try {
    const fullUrl = `${baseUrl}${url}`;
    const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code} %{url_effective}" -L "${fullUrl}"`, { timeout: 10000 });
    const parts = stdout.trim().split(' ');
    return { 
      statusCode: parseInt(parts[0]), 
      finalUrl: parts[1] || fullUrl 
    };
  } catch (error) {
    return { statusCode: 0, finalUrl: '', error: error.message };
  }
}

async function testSample() {
  console.log('Testing sample redirects...\n');
  console.log('Format: OLD_URL -> EXPECTED_NEW_URL');
  console.log('=====================================\n');
  
  for (const redirect of sampleRedirects) {
    console.log(`\nChecking: ${redirect.from} -> ${redirect.to}`);
    
    // Check old URL
    const oldResult = await checkUrl(redirect.from);
    console.log(`  Old URL (${baseUrl}${redirect.from}):`);
    console.log(`    Status: ${oldResult.statusCode}`);
    console.log(`    Final URL: ${oldResult.finalUrl}`);
    
    // Check new URL directly
    const newResult = await checkUrl(redirect.to);
    console.log(`  New URL (${baseUrl}${redirect.to}):`);
    console.log(`    Status: ${newResult.statusCode}`);
    
    // Determine redirect status
    const expectedNewUrl = `${baseUrl}${redirect.to}`;
    const isRedirecting = oldResult.finalUrl === expectedNewUrl || 
                          oldResult.finalUrl === expectedNewUrl + '/' ||
                          oldResult.finalUrl === expectedNewUrl.replace(/\/$/, '');
    
    if (oldResult.statusCode === 404) {
      console.log(`  ✅ Result: Old URL returns 404 (likely means redirect is working)`);
    } else if (isRedirecting) {
      console.log(`  ✅ Result: Redirect working correctly`);
    } else if (oldResult.statusCode === 200 && oldResult.finalUrl.includes(redirect.from)) {
      console.log(`  ⚠️  Result: Old URL still accessible, NO REDIRECT in place`);
    } else {
      console.log(`  ⚠️  Result: Redirects to unexpected location: ${oldResult.finalUrl.replace(baseUrl, '')}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

testSample().catch(console.error);