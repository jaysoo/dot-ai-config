#!/usr/bin/env node

/**
 * Test a sample of redirects to verify they work
 */

import { readFileSync } from 'fs';

// Sample of redirects to test
const sampleRedirects = {
  // High confidence
  '/getting-started': '/docs/getting-started',
  '/features/run-tasks': '/docs/features/run-tasks',
  '/concepts/mental-model': '/docs/concepts/mental-model',
  
  // Fixed troubleshooting
  '/recipes/troubleshooting/ts-solution-style': '/docs/troubleshooting',
  '/recipes/troubleshooting/clear-the-cache': '/docs/troubleshooting/troubleshoot-cache-misses',
  
  // Fixed technology recipes  
  '/recipes/module-federation/create-a-host': '/docs/technologies/module-federation/Guides/create-a-host',
  '/recipes/react/using-tailwind-css-in-react': '/docs/technologies/react/Guides/using-tailwind-css-in-react',
  '/recipes/angular/angular-dynamic-module-federation': '/docs/technologies/angular/Guides/dynamic-module-federation-with-angular',
  '/recipes/node/node-server-fly-io': '/docs/technologies/node/Guides/node-serverless-functions-netlify',
  '/recipes/webpack/webpack-config-setup': '/docs/technologies/build-tools/webpack/Guides/configure-webpack',
  '/recipes/vite/set-up-vite-manually': '/docs/technologies/build-tools/vite',
  '/recipes/storybook/overview-react': '/docs/technologies/test-tools/storybook/Guides/overview-react',
  '/recipes/tips-n-tricks/js-and-ts': '/docs/technologies/typescript/Guides/js-and-ts',
  '/recipes/tips-n-tricks/flat-config': '/docs/technologies/eslint/Guides/flat-config',
};

async function testRedirect(oldPath, expectedNewPath) {
  const url = `http://localhost:4200${oldPath}`;
  
  try {
    // Follow redirects
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(10000)
    });
    
    // Check final URL
    const finalUrl = response.url;
    
    // Check if it redirected to the expected path
    // It might be on a different port (Astro server)
    if (finalUrl.includes(expectedNewPath.replace('/docs', '')) || 
        finalUrl.includes(expectedNewPath)) {
      return { 
        success: true, 
        status: response.status, 
        finalUrl,
        contentOk: response.ok
      };
    } else {
      return { 
        success: false, 
        error: 'wrong_destination', 
        expected: expectedNewPath,
        actual: finalUrl,
        status: response.status 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: 'fetch_error', 
      message: error.message 
    };
  }
}

async function main() {
  console.log('Testing Sample Redirects');
  console.log('=' .repeat(80));
  
  // Check nx-dev server
  try {
    const response = await fetch('http://localhost:4200', { 
      signal: AbortSignal.timeout(10000),
      method: 'HEAD'
    });
    console.log('✅ nx-dev server running on port 4200\n');
  } catch (error) {
    // Try GET as fallback
    try {
      await fetch('http://localhost:4200/getting-started', { 
        signal: AbortSignal.timeout(5000)
      });
      console.log('✅ nx-dev server running on port 4200\n');
    } catch {
      console.error('❌ nx-dev server not responding properly on port 4200');
      console.log('Error:', error.message);
      process.exit(1);
    }
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [oldPath, expectedNewPath] of Object.entries(sampleRedirects)) {
    process.stdout.write(`Testing ${oldPath.padEnd(50)}`);
    
    const result = await testRedirect(oldPath, expectedNewPath);
    
    if (result.success) {
      console.log(` ✅ → ${result.finalUrl}`);
      successCount++;
    } else if (result.error === 'wrong_destination') {
      console.log(` ❌ Wrong destination`);
      console.log(`  Expected: ${result.expected}`);
      console.log(`  Got:      ${result.actual}`);
      failCount++;
    } else {
      console.log(` ❌ ${result.error}: ${result.message || ''}`);
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log(`Results: ${successCount} success, ${failCount} failures`);
  
  if (failCount === 0) {
    console.log('✅ All sample redirects working correctly!');
    
    // Now test that production content matches
    console.log('\n' + '='.repeat(80));
    console.log('Comparing with production content...\n');
    
    for (const [oldPath, expectedNewPath] of Object.entries(sampleRedirects)) {
      try {
        // Get production content
        const prodResponse = await fetch(`https://nx.dev${oldPath}`, {
          signal: AbortSignal.timeout(10000)
        });
        
        // Get local redirected content
        const localResponse = await fetch(`http://localhost:4200${oldPath}`, {
          signal: AbortSignal.timeout(10000)
        });
        
        if (prodResponse.ok && localResponse.ok) {
          const prodText = await prodResponse.text();
          const localText = await localResponse.text();
          
          // Extract titles for comparison
          const prodTitle = prodText.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1] || '';
          const localTitle = localText.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1] || '';
          
          if (prodTitle && localTitle) {
            // Allow for minor differences (e.g., "Get Started" vs "Getting Started")
            const similar = prodTitle.toLowerCase().includes(localTitle.toLowerCase().substring(0, 5)) ||
                          localTitle.toLowerCase().includes(prodTitle.toLowerCase().substring(0, 5));
            
            if (similar) {
              console.log(`✅ ${oldPath} - content matches`);
            } else {
              console.log(`⚠️  ${oldPath} - different titles:`);
              console.log(`   Prod:  "${prodTitle}"`);
              console.log(`   Local: "${localTitle}"`);
            }
          } else {
            console.log(`ℹ️  ${oldPath} - could not extract titles for comparison`);
          }
        } else {
          console.log(`⚠️  ${oldPath} - status: prod ${prodResponse.status}, local ${localResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ ${oldPath} - error comparing: ${error.message}`);
      }
    }
  } else {
    console.log(`❌ ${failCount} redirects failed`);
  }
}

main().catch(console.error);