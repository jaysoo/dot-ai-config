#!/usr/bin/env node

import { chromium } from 'playwright';

async function extractSidebarData(page, baseUrl) {
  await page.goto(`${baseUrl}/getting-started/intro`, { waitUntil: 'networkidle' });
  
  // Wait for sidebar to load
  await page.waitForSelector('[data-testid="section-h4:technologies"], [data-testid="section-h5:technologies"]', { timeout: 10000 }).catch(() => {
    console.log('No technologies section found');
  });

  const technologies = {};

  // Click on Technologies to expand it
  const techSection = await page.$('[data-testid="section-h5:technologies"], [data-testid="section-h4:technologies"]');
  if (techSection) {
    await techSection.click();
    await page.waitForTimeout(500);
  }

  // Get all technology items
  const techItems = await page.$$('[data-testid^="section-h5:"]:not([data-testid="section-h5:technologies"])');
  
  for (const techItem of techItems) {
    const techName = await techItem.textContent();
    if (!techName) continue;
    
    // Click to expand this technology
    await techItem.click();
    await page.waitForTimeout(200);
    
    // Look for Guides section within this technology
    const guidesSelector = `[data-testid="section-h5:guides"]`;
    const guidesElement = await techItem.evaluateHandle((el) => {
      // Find the parent li, then look for Guides within its ul
      const parentLi = el.closest('li');
      if (!parentLi) return null;
      const guidesEl = parentLi.querySelector('[data-testid="section-h5:guides"]');
      return guidesEl;
    });
    
    if (guidesElement && await guidesElement.evaluate(el => el !== null)) {
      // Click to expand Guides
      await guidesElement.click();
      await page.waitForTimeout(200);
      
      // Get all guide items
      const guideItems = await guidesElement.evaluateHandle((guidesEl) => {
        const parentLi = guidesEl.closest('li');
        if (!parentLi) return [];
        const links = Array.from(parentLi.querySelectorAll('a'));
        return links.map(link => ({
          text: link.textContent?.trim(),
          href: link.getAttribute('href')
        }));
      });
      
      const guides = await guideItems.jsonValue();
      if (guides.length > 0) {
        technologies[techName] = { guides };
      }
    }
    
    // Collapse the technology section for cleaner iteration
    await techItem.click();
    await page.waitForTimeout(200);
  }

  return technologies;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('Extracting from production (nx.dev)...');
    const productionData = await extractSidebarData(page, 'https://nx.dev');
    
    console.log('\nExtracted Production Data:');
    console.log(JSON.stringify(productionData, null, 2));
    
    console.log('\n\nExtracting from local (localhost:4321)...');
    const localData = await extractSidebarData(page, 'http://localhost:4321');
    
    console.log('\nExtracted Local Data:');
    console.log(JSON.stringify(localData, null, 2));
    
    // Compare the data
    console.log('\n\n=== COMPARISON ===\n');
    
    const allTechs = new Set([...Object.keys(productionData), ...Object.keys(localData)]);
    
    for (const tech of allTechs) {
      const prodGuides = productionData[tech]?.guides || [];
      const localGuides = localData[tech]?.guides || [];
      
      if (prodGuides.length === 0 && localGuides.length === 0) {
        continue;
      }
      
      console.log(`\n${tech}:`);
      
      if (prodGuides.length > 0 && localGuides.length === 0) {
        console.log('  ❌ Missing Guides section in local');
        console.log('  Production guides:', prodGuides.map(g => g.text).join(', '));
      } else if (prodGuides.length === 0 && localGuides.length > 0) {
        console.log('  ⚠️  Has Guides in local but not in production');
        console.log('  Local guides:', localGuides.map(g => g.text).join(', '));
      } else {
        const prodGuideTexts = prodGuides.map(g => g.text);
        const localGuideTexts = localGuides.map(g => g.text);
        
        const missing = prodGuideTexts.filter(g => !localGuideTexts.includes(g));
        const extra = localGuideTexts.filter(g => !prodGuideTexts.includes(g));
        
        if (missing.length === 0 && extra.length === 0) {
          console.log('  ✅ Guides match');
        } else {
          if (missing.length > 0) {
            console.log('  ❌ Missing guides:', missing.join(', '));
          }
          if (extra.length > 0) {
            console.log('  ⚠️  Extra guides:', extra.join(', '));
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);