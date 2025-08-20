#!/usr/bin/env node

import { chromium } from 'playwright';

class QuickAstroTester {
  constructor() {
    // Test key framework keywords that we know failed on production
    this.testKeywords = [
      { keyword: 'angular', expectedUrls: ['/technologies/angular/api/'] },
      { keyword: 'react', expectedUrls: ['/technologies/react/api/'] },
      { keyword: 'nest', expectedUrls: ['/technologies/node/nest/api/'] },
      { keyword: 'next', expectedUrls: ['/technologies/react/next/api/'] },
      { keyword: 'eslint', expectedUrls: ['/technologies/eslint/api/'] },
      { keyword: 'jest', expectedUrls: ['/technologies/test-tools/jest/api/'] }
    ];
  }

  async testAstroSite() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    console.log('🚀 Quick Astro Site Testing');
    console.log('Testing key framework keywords on nx-docs.netlify.app');
    
    let foundCount = 0;
    let perfectCount = 0;

    try {
      await page.goto('https://nx-docs.netlify.app', { waitUntil: 'networkidle' });

      for (const keywordData of this.testKeywords) {
        try {
          console.log(`\n🔍 Testing: "${keywordData.keyword}"`);
          
          // Click search button
          await page.click('button:has-text("Search")');
          
          // Wait for dialog
          await page.waitForSelector('dialog[open] input', { timeout: 3000 });
          
          // Type search term
          await page.fill('dialog[open] input', keywordData.keyword);
          
          // Wait for results
          await page.waitForTimeout(2000);
          
          // Get results
          const results = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('dialog[open] a[href]'));
            return links.slice(0, 10).map(link => ({
              title: link.textContent?.trim(),
              url: link.href
            }));
          });
          
          console.log(`   Found ${results.length} results`);
          
          // Check for expected URLs
          const expectedUrl = keywordData.expectedUrls[0];
          const position = results.findIndex(result => {
            const pathname = new URL(result.url).pathname;
            return pathname.includes(expectedUrl) || pathname.endsWith(expectedUrl);
          });
          
          if (position !== -1) {
            foundCount++;
            if (position <= 2) { // Top 3
              perfectCount++;
              console.log(`   ✅ Found in position ${position + 1} - PERFECT`);
            } else {
              console.log(`   ✅ Found in position ${position + 1}`);
            }
          } else {
            console.log(`   ❌ Expected URL not found in top 10`);
          }
          
          // Close dialog
          await page.keyboard.press('Escape');
          
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
          await page.keyboard.press('Escape');
        }
      }
      
      console.log('\n📊 Quick Results:');
      console.log(`   Found: ${foundCount}/${this.testKeywords.length} (${(foundCount/this.testKeywords.length*100).toFixed(1)}%)`);
      console.log(`   Perfect: ${perfectCount}/${this.testKeywords.length} (${(perfectCount/this.testKeywords.length*100).toFixed(1)}%)`);
      
      // Calculate Ocean-style score for these keywords
      let totalScore = 0;
      this.testKeywords.forEach((_, index) => {
        if (index < foundCount) {
          if (index < perfectCount) {
            totalScore += 3; // Perfect score
          } else {
            totalScore += 2; // Found but not perfect, assume position 4-6
          }
        }
      });
      
      const oceanScore = (10 * totalScore) / (this.testKeywords.length * 3);
      console.log(`   Estimated Ocean Score: ${oceanScore.toFixed(2)}/10.0`);
      
    } finally {
      await browser.close();
    }
  }
}

const tester = new QuickAstroTester();
await tester.testAstroSite();