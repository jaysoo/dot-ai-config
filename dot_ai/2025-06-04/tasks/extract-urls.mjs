#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import { parseString } from 'xml2js';

const SITEMAP_URL = 'https://canary.nx.dev/sitemap-0.xml';
const OUTPUT_FILE = '.ai/2025-06-04/canary-nx-urls.json';
const OUTPUT_TEXT_FILE = '.ai/2025-06-04/canary-nx-urls.txt';

async function fetchSitemap() {
  return new Promise((resolve, reject) => {
    https.get(SITEMAP_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve(data);
      });
      
      res.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function parseXmlSitemap(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      try {
        const urlset = result.urlset;
        const urls = urlset.url.map(item => {
          const url = item.loc[0];
          const lastmod = item.lastmod ? item.lastmod[0] : null;
          const changefreq = item.changefreq ? item.changefreq[0] : null;
          const priority = item.priority ? item.priority[0] : null;
          
          return {
            url,
            lastmod,
            changefreq,
            priority
          };
        });
        
        resolve(urls);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function categorizeUrls(urls) {
  const categories = {
    root: [],
    concepts: [],
    recipes: [],
    reference: [],
    packages: [],
    blog: [],
    changelog: [],
    guides: [],
    tutorials: [],
    features: [],
    nx_cloud: [],
    other: []
  };
  
  urls.forEach(item => {
    const url = item.url;
    const path = url.replace('https://canary.nx.dev', '');
    
    if (path === '' || path === '/') {
      categories.root.push(item);
    } else if (path.includes('/concepts/')) {
      categories.concepts.push(item);
    } else if (path.includes('/recipes/')) {
      categories.recipes.push(item);
    } else if (path.includes('/reference/') || path.includes('/cli/') || path.includes('/devkit/')) {
      categories.reference.push(item);
    } else if (path.includes('/packages/')) {
      categories.packages.push(item);
    } else if (path.includes('/blog/')) {
      categories.blog.push(item);
    } else if (path.includes('/changelog/')) {
      categories.changelog.push(item);
    } else if (path.includes('/guides/')) {
      categories.guides.push(item);
    } else if (path.includes('/tutorial/')) {
      categories.tutorials.push(item);
    } else if (path.includes('/features/')) {
      categories.features.push(item);
    } else if (path.includes('/nx-cloud/')) {
      categories.nx_cloud.push(item);
    } else {
      categories.other.push(item);
    }
  });
  
  return categories;
}

async function main() {
  try {
    console.log('Fetching sitemap from:', SITEMAP_URL);
    const xmlData = await fetchSitemap();
    
    console.log('Parsing sitemap XML...');
    const urls = await parseXmlSitemap(xmlData);
    
    console.log(`Found ${urls.length} URLs`);
    
    // Categorize URLs
    const categorized = categorizeUrls(urls);
    
    // Create output data
    const output = {
      metadata: {
        extractedAt: new Date().toISOString(),
        totalUrls: urls.length,
        source: SITEMAP_URL
      },
      categorized,
      allUrls: urls
    };
    
    // Save JSON output
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    
    // Create text output with just URLs
    const textOutput = urls.map(item => item.url).join('\n');
    fs.writeFileSync(OUTPUT_TEXT_FILE, textOutput);
    
    // Print summary
    console.log('\n=== SUMMARY ===');
    console.log(`Total URLs: ${urls.length}`);
    console.log('\nBy Category:');
    Object.entries(categorized).forEach(([category, items]) => {
      console.log(`  ${category}: ${items.length}`);
    });
    
    console.log('\n=== SAMPLE URLS ===');
    urls.slice(0, 10).forEach(item => {
      console.log(`${item.url}`);
    });
    
    console.log(`\nFull results saved to:`);
    console.log(`- JSON: ${OUTPUT_FILE}`);
    console.log(`- Text: ${OUTPUT_TEXT_FILE}`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();