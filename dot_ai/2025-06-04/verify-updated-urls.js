#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const BASE_URL = 'https://canary.nx.dev';
const INPUT_FILE = path.join(__dirname, 'updated-docs.json');
const OUTPUT_FILE = path.join(__dirname, 'url-verification-report.md');

// Read the updated-docs.json file
const updatedDocs = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));

// Extract all unique new URLs with their file paths
const urlsToCheck = new Map();

for (const [filePath, updates] of Object.entries(updatedDocs)) {
  for (const [oldUrl, newUrl] of updates) {
    if (!urlsToCheck.has(newUrl)) {
      urlsToCheck.set(newUrl, []);
    }
    urlsToCheck.get(newUrl).push(filePath);
  }
}

console.log(`Starting URL verification against ${BASE_URL}...`);
console.log(`Found ${urlsToCheck.size} unique URLs to check.\n`);

// Function to check a single URL
function checkUrl(url) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URL}${url}`;
    
    https.get(fullUrl, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NxDocsVerifier/1.0)'
      },
      timeout: 10000
    }, (res) => {
      // Check if it's a redirect
      if (res.statusCode >= 300 && res.statusCode < 400) {
        resolve({
          url,
          status: res.statusCode,
          type: 'redirect',
          location: res.headers.location
        });
      } else if (res.statusCode === 200) {
        resolve({
          url,
          status: res.statusCode,
          type: 'valid'
        });
      } else {
        resolve({
          url,
          status: res.statusCode,
          type: res.statusCode === 404 ? 'not-found' : 'error'
        });
      }
      
      // Consume response data to free up memory
      res.resume();
    }).on('error', (err) => {
      resolve({
        url,
        status: 0,
        type: 'error',
        error: err.message
      });
    });
  });
}

// Process URLs in batches to avoid overwhelming the server
async function processUrlsBatch(urls, batchSize = 10) {
  const results = [];
  
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(([url]) => checkUrl(url)));
    
    // Log progress
    batchResults.forEach(result => {
      const icon = result.type === 'valid' ? '✓' : 
                   result.type === 'redirect' ? '→' : '✗';
      console.log(`${icon} ${result.type === 'valid' ? 'Valid' : 
                   result.type === 'redirect' ? `Redirect (${result.status})` : 
                   result.type === 'not-found' ? 'Not Found' : 
                   `Error (${result.status})`}: ${result.url}`);
    });
    
    results.push(...batchResults);
    
    // Small delay between batches
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

// Main function
async function main() {
  const urlsArray = Array.from(urlsToCheck.entries());
  const results = await processUrlsBatch(urlsArray);
  
  // Categorize results
  const validUrls = [];
  const redirectUrls = [];
  const notFoundUrls = [];
  const errorUrls = [];
  
  results.forEach((result, index) => {
    const filePaths = urlsArray[index][1];
    
    switch (result.type) {
      case 'valid':
        validUrls.push(result.url);
        break;
      case 'redirect':
        redirectUrls.push({ ...result, files: filePaths });
        break;
      case 'not-found':
        notFoundUrls.push({ ...result, files: filePaths });
        break;
      case 'error':
        errorUrls.push({ ...result, files: filePaths });
        break;
    }
  });
  
  // Generate report
  let report = `# URL Verification Report

Generated on: ${new Date().toLocaleString()}
Base URL: ${BASE_URL}

## Summary

- Total URLs checked: ${results.length}
- Valid (HTTP 200): ${validUrls.length}
- Redirects (HTTP 30x): ${redirectUrls.length}
- Not Found (HTTP 404): ${notFoundUrls.length}
- Errors: ${errorUrls.length}

## Valid URLs (HTTP 200)

`;

  if (validUrls.length > 0) {
    validUrls.forEach(url => {
      report += `- \`${url}\`\n`;
    });
  } else {
    report += '*No valid URLs found*\n';
  }

  report += '\n## Invalid URLs (Redirects or 404)\n\n### Redirects (HTTP 30x)\n\n';

  if (redirectUrls.length > 0) {
    redirectUrls.forEach(item => {
      item.files.forEach(file => {
        report += `- \`${item.url}\` - \`${file}\``;
        if (item.location) {
          report += ` → ${item.location}`;
        }
        report += '\n';
      });
    });
  } else {
    report += '*No redirects found*\n';
  }

  report += '\n### Not Found (HTTP 404)\n\n';

  if (notFoundUrls.length > 0) {
    notFoundUrls.forEach(item => {
      item.files.forEach(file => {
        report += `- \`${item.url}\` - \`${file}\`\n`;
      });
    });
  } else {
    report += '*No 404 errors found*\n';
  }

  if (errorUrls.length > 0) {
    report += '\n### Other Errors\n\n';
    errorUrls.forEach(item => {
      item.files.forEach(file => {
        report += `- \`${item.url}\` - \`${file}\` (${item.error || `Status: ${item.status}`})\n`;
      });
    });
  }

  // Write report
  fs.writeFileSync(OUTPUT_FILE, report, 'utf8');
  
  console.log('\n✅ Verification complete!');
  console.log(`Report saved to: ${OUTPUT_FILE}`);
  console.log('\nSummary:');
  console.log(`- Total URLs checked: ${results.length}`);
  console.log(`- Valid (HTTP 200): ${validUrls.length}`);
  console.log(`- Redirects (HTTP 30x): ${redirectUrls.length}`);
  console.log(`- Not Found (HTTP 404): ${notFoundUrls.length}`);
  console.log(`- Errors: ${errorUrls.length}`);
}

// Run the script
main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});