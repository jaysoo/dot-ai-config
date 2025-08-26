#!/usr/bin/env node

import https from 'https';
import { writeFileSync } from 'fs';
import { join } from 'path';

// Fetch the sitemap XML
async function fetchSitemap(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

// Parse XML to extract URLs
function extractUrls(xml) {
  const urls = [];
  const urlPattern = /<loc>(.*?)<\/loc>/g;
  let match;
  
  while ((match = urlPattern.exec(xml)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

// Generate redirect template
function generateRedirectTemplate(urls) {
  const redirects = {};
  
  urls.forEach(url => {
    // Extract path from full URL
    const path = url.replace('https://nx.dev', '');
    
    // Create redirect entry with /docs prefix as placeholder
    // Skip if it's already a /docs URL
    if (path && !path.startsWith('/docs/')) {
      redirects[path] = `/docs${path}`;
    }
  });
  
  return redirects;
}

// Main execution
async function main() {
  try {
    console.log('Fetching sitemap from https://nx.dev/sitemap-0.xml...');
    const xml = await fetchSitemap('https://nx.dev/sitemap-0.xml');
    
    console.log('Parsing XML to extract URLs...');
    const urls = extractUrls(xml);
    console.log(`Found ${urls.length} URLs`);
    
    // Write plain URL list
    const urlListPath = join(process.cwd(), 'nx-dev-urls.txt');
    writeFileSync(urlListPath, urls.join('\n'), 'utf8');
    console.log(`✓ Saved URL list to ${urlListPath}`);
    
    // Generate and write redirect template
    const redirects = generateRedirectTemplate(urls);
    const redirectsPath = join(process.cwd(), 'nx-dev-redirects.js');
    const redirectsContent = `// Auto-generated redirect template from nx.dev sitemap
// TODO: Review and update redirect targets as needed

const redirects = ${JSON.stringify(redirects, null, 2)};

module.exports = redirects;
`;
    
    writeFileSync(redirectsPath, redirectsContent, 'utf8');
    console.log(`✓ Saved redirect template to ${redirectsPath}`);
    console.log(`  Generated ${Object.keys(redirects).length} redirect entries`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();