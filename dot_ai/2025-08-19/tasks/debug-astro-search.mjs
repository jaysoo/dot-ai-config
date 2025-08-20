#!/usr/bin/env node

import { chromium } from 'playwright';

async function debugAstroSearch() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('🔍 Debugging Astro Search Results');
  
  try {
    await page.goto('https://nx-docs.netlify.app', { waitUntil: 'networkidle' });

    // Test "angular" search
    console.log('\n🔍 Testing: "angular"');
    
    // Click search button
    await page.click('button:has-text("Search")');
    
    // Wait for dialog
    await page.waitForSelector('dialog[open] input', { timeout: 3000 });
    
    // Type search term
    await page.fill('dialog[open] input', 'angular');
    
    // Wait for results
    await page.waitForTimeout(2000);
    
    // Get detailed results
    const results = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('dialog[open] a[href]'));
      return links.slice(0, 10).map((link, index) => ({
        position: index + 1,
        title: link.textContent?.trim(),
        url: link.href,
        pathname: new URL(link.href).pathname
      }));
    });
    
    console.log('Top 10 results:');
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.title}`);
      console.log(`      URL: ${result.pathname}`);
    });
    
    // Check if any contain 'technologies/angular'
    const angularTechResults = results.filter(result => 
      result.pathname.includes('/technologies/angular')
    );
    
    console.log(`\nFound ${angularTechResults.length} results with '/technologies/angular':`);
    angularTechResults.forEach(result => {
      console.log(`   ${result.position}. ${result.pathname}`);
    });
    
    // Close dialog
    await page.keyboard.press('Escape');
    
  } finally {
    await browser.close();
  }
}

await debugAstroSearch();