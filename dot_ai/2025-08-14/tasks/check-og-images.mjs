#!/usr/bin/env node

import { promises as fs } from 'fs';
import * as cheerio from 'cheerio';

const SITEMAP_URL = 'https://nx.dev/sitemap-0.xml';
const SITE_BASE = 'https://nx.dev';

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function fetchSitemap() {
  console.log('Fetching sitemap...');
  const response = await fetchWithRetry(SITEMAP_URL);
  const text = await response.text();
  
  // Parse XML to extract URLs
  const urls = [];
  const matches = text.matchAll(/<loc>(.*?)<\/loc>/g);
  for (const match of matches) {
    urls.push(match[1]);
  }
  
  console.log(`Found ${urls.length} URLs in sitemap`);
  return urls;
}

async function getOgImage(pageUrl) {
  try {
    const response = await fetchWithRetry(pageUrl);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Find og:image meta tag
    const ogImage = $('meta[property="og:image"]').attr('content');
    return ogImage;
  } catch (error) {
    console.error(`Error fetching page ${pageUrl}:`, error.message);
    return null;
  }
}

async function checkImageExists(imageUrl) {
  try {
    const response = await fetchWithRetry(imageUrl, 1);
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

async function analyzeSitemap() {
  const results = {
    totalPages: 0,
    pagesWithOgImage: 0,
    brokenImages: [],
    workingImages: [],
    noOgImage: [],
    errors: []
  };
  
  try {
    // Sample a subset of URLs first
    const urls = await fetchSitemap();
    const samplesToCheck = urls.slice(0, 20); // Check first 20 URLs as a sample
    
    results.totalPages = samplesToCheck.length;
    
    console.log(`\nChecking ${samplesToCheck.length} pages...`);
    
    for (const url of samplesToCheck) {
      console.log(`Checking: ${url}`);
      
      const ogImage = await getOgImage(url);
      
      if (ogImage) {
        results.pagesWithOgImage++;
        
        const fullImageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_BASE}${ogImage}`;
        const exists = await checkImageExists(fullImageUrl);
        
        if (exists) {
          results.workingImages.push({ page: url, image: fullImageUrl });
          console.log(`  ✓ OG image works`);
        } else {
          results.brokenImages.push({ page: url, image: fullImageUrl });
          console.log(`  ✗ OG image 404: ${fullImageUrl}`);
        }
      } else {
        results.noOgImage.push(url);
        console.log(`  - No OG image found`);
      }
      
      // Small delay to be nice to the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
  } catch (error) {
    console.error('Error during analysis:', error);
    results.errors.push(error.message);
  }
  
  return results;
}

async function main() {
  console.log('Starting Open Graph image analysis...\n');
  
  const results = await analyzeSitemap();
  
  // Save results
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `.ai/2025-08-14/tasks/og-image-analysis-${timestamp}.json`;
  
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));
  
  // Print summary
  console.log('\n=== Analysis Summary ===');
  console.log(`Total pages checked: ${results.totalPages}`);
  console.log(`Pages with OG image: ${results.pagesWithOgImage}`);
  console.log(`Working images: ${results.workingImages.length}`);
  console.log(`Broken images (404): ${results.brokenImages.length}`);
  console.log(`Pages without OG image: ${results.noOgImage.length}`);
  
  if (results.brokenImages.length > 0) {
    console.log('\n=== Broken Images ===');
    for (const item of results.brokenImages) {
      console.log(`Page: ${item.page}`);
      console.log(`Image: ${item.image}\n`);
    }
  }
  
  console.log(`\nFull report saved to: ${reportPath}`);
}

main().catch(console.error);