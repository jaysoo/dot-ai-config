#!/usr/bin/env node

import { chromium } from 'playwright';

async function extractAllGuides(page, baseUrl) {
  await page.goto(`${baseUrl}/getting-started/intro`, { waitUntil: 'networkidle' });
  
  // Wait for sidebar to load
  await page.waitForTimeout(2000);

  const allTechGuides = {};

  // Click on Technologies to expand it
  try {
    // For production
    const techSection = await page.$('[data-testid="section-h5:technologies"], [data-testid="section-h4:technologies"]');
    if (techSection) {
      await techSection.click();
      await page.waitForTimeout(500);
    }
  } catch (e) {
    // For local - try different selector
    const techSection = await page.$('summary:has-text("Technologies")');
    if (techSection) {
      await techSection.click();
      await page.waitForTimeout(500);
    }
  }

  // Define all technologies and their nested structure
  const technologies = [
    { name: 'TypeScript', nested: [] },
    { name: 'Angular', nested: ['Angular Rspack', 'Angular Rsbuild'] },
    { name: 'React', nested: ['Next', 'Remix', 'React Native', 'Expo'] },
    { name: 'Vue', nested: ['Nuxt'] },
    { name: 'Node.js', nested: ['Express', 'Nest'] },
    { name: 'Java', nested: [] },
    { name: 'Module Federation', nested: [] },
    { name: 'ESLint', nested: ['ESLint Plugin'] },
    { name: 'Build Tools', nested: ['Webpack', 'Vite', 'Rollup', 'ESBuild', 'Rspack', 'Rsbuild'] },
    { name: 'Test Tools', nested: ['Cypress', 'Jest', 'Playwright', 'Storybook', 'Detox'] }
  ];

  for (const tech of technologies) {
    console.log(`Checking ${tech.name}...`);
    
    // Click on the main technology
    try {
      // Try production selector first
      let techElement = await page.$(`[data-testid*="section-h5:"]:has-text("${tech.name}")`);
      if (!techElement) {
        // Try local selector
        techElement = await page.$(`summary:has-text("${tech.name}")`);
      }
      
      if (techElement) {
        await techElement.click();
        await page.waitForTimeout(300);
        
        // Look for Guides section
        const guidesData = await extractGuidesForTech(page, tech.name);
        if (guidesData.length > 0) {
          allTechGuides[tech.name] = guidesData;
        }
        
        // Check nested technologies
        for (const nested of tech.nested) {
          console.log(`  Checking nested: ${nested}...`);
          
          // Click on nested technology
          let nestedElement = await page.$(`[data-testid*="section-h5:"]:has-text("${nested}")`);
          if (!nestedElement) {
            nestedElement = await page.$(`summary:has-text("${nested}")`);
          }
          
          if (nestedElement) {
            await nestedElement.click();
            await page.waitForTimeout(300);
            
            const nestedGuidesData = await extractGuidesForTech(page, nested);
            if (nestedGuidesData.length > 0) {
              allTechGuides[`${tech.name} > ${nested}`] = nestedGuidesData;
            }
            
            // Collapse nested
            await nestedElement.click();
            await page.waitForTimeout(200);
          }
        }
        
        // Collapse main tech
        await techElement.click();
        await page.waitForTimeout(200);
      }
    } catch (error) {
      console.log(`  Error processing ${tech.name}: ${error.message}`);
    }
  }

  return allTechGuides;
}

async function extractGuidesForTech(page, techName) {
  const guides = [];
  
  try {
    // Check for Guides section - production style
    const guidesSection = await page.$('[data-testid="section-h5:guides"]:visible, [data-testid="section-h5:recipes"]:visible');
    
    if (guidesSection) {
      // Click to expand guides
      await guidesSection.click();
      await page.waitForTimeout(300);
      
      // Extract guide items
      const guideLinks = await page.$$eval('[data-testid="section-h5:guides"] ~ ul a:visible, [data-testid="section-h5:recipes"] ~ ul a:visible', 
        links => links.map(link => ({
          text: link.textContent?.trim(),
          href: link.getAttribute('href')
        }))
      );
      
      guides.push(...guideLinks);
      
      // Collapse guides
      await guidesSection.click();
      await page.waitForTimeout(200);
    }
  } catch (e) {
    // For local, check if there are any guides-like links
    try {
      const guideLinks = await page.$$eval(`a[href*="/technologies/"][href*="/guides/"]:visible, a[href*="/technologies/"][href*="/recipes/"]:visible`, 
        links => links.map(link => ({
          text: link.textContent?.trim(),
          href: link.getAttribute('href')
        }))
      );
      
      if (guideLinks.length > 0) {
        guides.push(...guideLinks);
      }
    } catch (e2) {
      // No guides found
    }
  }
  
  return guides;
}

async function main() {
  const browser = await chromium.launch({ headless: false }); // Set to false to see what's happening
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('=== EXTRACTING FROM PRODUCTION (nx.dev) ===\n');
    const productionGuides = await extractAllGuides(page, 'https://nx.dev');
    
    console.log('\n=== EXTRACTING FROM LOCAL (localhost:4321) ===\n');
    const localGuides = await extractAllGuides(page, 'http://localhost:4321');
    
    // Generate comparison report
    console.log('\n\n=== DETAILED COMPARISON REPORT ===\n');
    
    const allTechs = new Set([...Object.keys(productionGuides), ...Object.keys(localGuides)]);
    
    const report = {
      onlyInProduction: {},
      onlyInLocal: {},
      inBoth: {},
      differences: {}
    };
    
    for (const tech of allTechs) {
      const prodGuides = productionGuides[tech] || [];
      const localGuides = localGuides[tech] || [];
      
      if (prodGuides.length > 0 && localGuides.length === 0) {
        report.onlyInProduction[tech] = prodGuides;
      } else if (prodGuides.length === 0 && localGuides.length > 0) {
        report.onlyInLocal[tech] = localGuides;
      } else if (prodGuides.length > 0 && localGuides.length > 0) {
        const prodTexts = prodGuides.map(g => g.text);
        const localTexts = localGuides.map(g => g.text);
        
        const missing = prodTexts.filter(t => !localTexts.includes(t));
        const extra = localTexts.filter(t => !prodTexts.includes(t));
        
        if (missing.length === 0 && extra.length === 0) {
          report.inBoth[tech] = prodGuides.length;
        } else {
          report.differences[tech] = {
            production: prodGuides,
            local: localGuides,
            missingInLocal: missing,
            extraInLocal: extra
          };
        }
      }
    }
    
    // Output JSON for processing
    console.log('\n=== JSON OUTPUT ===\n');
    console.log(JSON.stringify({
      production: productionGuides,
      local: localGuides,
      report
    }, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);