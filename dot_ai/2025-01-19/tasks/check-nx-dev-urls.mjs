#!/usr/bin/env node

import https from 'https';

const urls = [
  '/nx-api/nx/documents/init',
  '/nx-api/nx/documents/import',
  '/concepts/common-tasks',
  '/nx-api/nx/documents/affected',
  '/nx-api/nx/documents/release',
  '/features/manage-releases',
  '/nx-api/nx/documents/migrate',
  '/features/automate-updating-dependencies',
  '/ci/features/split-e2e-tasks',
  '/ci/features/distribute-task-execution',
  '/features/run-tasks',
  '/concepts/task-pipeline-configuration',
  '/concepts/inferred-tasks',
  '/concepts/nx-plugins',
  '/plugin-registry',
  '/concepts/decisions/project-size',
  '/reference/nx-json',
  '/reference/project-configuration',
  '/nx-api/angular',
  '/nx-api/angular/documents/angular-nx-version-matrix',
  '/nx-api/react',
  '/nx-api/nest',
  '/nx-api/next',
  '/nx-api/storybook',
  '/nx-api/eslint',
  '/nx-api/jest',
  '/nx-api/vite',
  '/recipes/react/using-tailwind-css-in-react',
  'recipes/angular/using-tailwind-css-with-angular-projects', // Note: missing leading slash
  '/recipes/adopting-nx/adding-to-monorepo',
  '/nx-api/eslint-plugin/documents/enforce-module-boundaries',
  '/nx-api/devkit/documents/addProjectConfiguration'
];

function checkUrl(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'nx.dev',
      path: path,
      method: 'HEAD',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let finalUrl = path;
      
      if (res.headers.location) {
        // Handle relative redirects
        if (res.headers.location.startsWith('/')) {
          finalUrl = res.headers.location;
        } else if (res.headers.location.startsWith('http')) {
          finalUrl = new URL(res.headers.location).pathname;
        }
      }
      
      resolve({
        originalUrl: path,
        statusCode: res.statusCode,
        redirectTo: res.headers.location || null,
        finalUrl: finalUrl
      });
    });

    req.on('error', (err) => {
      resolve({
        originalUrl: path,
        statusCode: 'ERROR',
        error: err.message,
        finalUrl: path
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        originalUrl: path,
        statusCode: 'TIMEOUT',
        error: 'Request timeout',
        finalUrl: path
      });
    });

    req.end();
  });
}

async function main() {
  console.log('Checking all URLs from testSuite...\n');
  
  const results = [];
  
  for (const url of urls) {
    const result = await checkUrl(url);
    results.push(result);
    
    // Log as we go
    if (result.statusCode === 308 || result.statusCode === 301 || result.statusCode === 302) {
      console.log(`REDIRECT: ${url}`);
      console.log(`  Status: ${result.statusCode}`);
      console.log(`  New URL: ${result.redirectTo}`);
    } else if (result.statusCode === 404) {
      console.log(`404 NOT FOUND: ${url}`);
    } else if (result.statusCode === 200) {
      console.log(`OK: ${url}`);
    } else {
      console.log(`OTHER: ${url} (${result.statusCode})`);
    }
    console.log('');
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n=== SUMMARY ===\n');
  
  const redirected = results.filter(r => [301, 302, 308].includes(r.statusCode));
  const notFound = results.filter(r => r.statusCode === 404);
  const ok = results.filter(r => r.statusCode === 200);
  const errors = results.filter(r => r.statusCode === 'ERROR' || r.statusCode === 'TIMEOUT');
  
  if (redirected.length > 0) {
    console.log('URLs that need updating (redirects):');
    redirected.forEach(r => {
      console.log(`  '${r.originalUrl}' → '${r.redirectTo}'`);
    });
    console.log('');
  }
  
  if (notFound.length > 0) {
    console.log('BAD LINKS (404s):');
    notFound.forEach(r => {
      console.log(`  ${r.originalUrl}`);
    });
    console.log('');
  }
  
  if (errors.length > 0) {
    console.log('Errors checking these URLs:');
    errors.forEach(r => {
      console.log(`  ${r.originalUrl}: ${r.error}`);
    });
    console.log('');
  }
  
  console.log(`Total: ${results.length} URLs checked`);
  console.log(`  OK: ${ok.length}`);
  console.log(`  Redirects: ${redirected.length}`);
  console.log(`  404s: ${notFound.length}`);
  console.log(`  Errors: ${errors.length}`);
}

main().catch(console.error);