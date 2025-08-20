#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SiteSearchTester {
  constructor() {
    this.keywords = this.loadKeywords();
    this.results = {
      timestamp: new Date().toISOString(),
      sites: {},
      comparison: {}
    };
    this.browser = null;
  }

  loadKeywords() {
    // Exact keywords from Ocean script ~/projects/ocean/tools/scripts/scorecards/nx-dev-search-score.ts
    return [
      // Nx Commands
      { keyword: 'init', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/init'] },
      { keyword: 'import', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/import'] },
      { keyword: 'build', category: 'commands', expectedUrls: ['/concepts/common-tasks'] },
      { keyword: 'serve', category: 'commands', expectedUrls: ['/concepts/common-tasks'] },
      { keyword: 'lint', category: 'commands', expectedUrls: ['/concepts/common-tasks'] },
      { keyword: 'affected', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/affected'] },
      { keyword: 'release', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/release', '/features/manage-releases'] },
      { keyword: 'migrate', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/migrate', '/features/automate-updating-dependencies'] },
      
      // Features
      { keyword: 'atomizer', category: 'features', expectedUrls: ['/ci/features/split-e2e-tasks'] },
      { keyword: 'split tasks', category: 'features', expectedUrls: ['/ci/features/split-e2e-tasks'] },
      { keyword: 'distributed tasks', category: 'features', expectedUrls: ['/ci/features/distribute-task-execution'] },
      { keyword: 'nx agents', category: 'features', expectedUrls: ['/ci/features/distribute-task-execution'] },
      { keyword: 'task pipeline', category: 'features', expectedUrls: ['/features/run-tasks', '/concepts/task-pipeline-configuration'] },
      
      // Concepts
      { keyword: 'inferred tasks', category: 'concepts', expectedUrls: ['/concepts/inferred-tasks'] },
      { keyword: 'nx plugins', category: 'concepts', expectedUrls: ['/concepts/nx-plugins', '/plugin-registry'] },
      { keyword: 'update', category: 'concepts', expectedUrls: ['/features/automate-updating-dependencies', '/reference/core-api/nx/documents/migrate'] },
      { keyword: 'library', category: 'concepts', expectedUrls: ['/concepts/decisions/project-size'] },
      
      // Reference
      { keyword: 'nx.json', category: 'reference', expectedUrls: ['/reference/nx-json'] },
      { keyword: 'project.json', category: 'reference', expectedUrls: ['/reference/project-configuration'] },
      
      // Frameworks - EXACT Ocean URLs
      { keyword: 'angular', category: 'frameworks', expectedUrls: ['/technologies/angular/api/'] },
      { keyword: 'angular matrix', category: 'frameworks', expectedUrls: ['/technologies/angular/recipes/angular-nx-version-matrix'] },
      { keyword: 'react', category: 'frameworks', expectedUrls: ['/technologies/react/api/'] },
      { keyword: 'nestjs', category: 'frameworks', expectedUrls: ['/technologies/node/nest/api/'] },
      { keyword: 'nest', category: 'frameworks', expectedUrls: ['/technologies/node/nest/api/'] },
      { keyword: 'next', category: 'frameworks', expectedUrls: ['/technologies/react/next/api/'] },
      
      // Tools - EXACT Ocean URLs
      { keyword: 'storybook', category: 'tools', expectedUrls: ['/technologies/test-tools/storybook/api/'] },
      { keyword: 'eslint', category: 'tools', expectedUrls: ['/technologies/eslint/api/'] },
      { keyword: 'jest', category: 'tools', expectedUrls: ['/technologies/test-tools/jest/api/'] },
      { keyword: 'vite', category: 'tools', expectedUrls: ['/technologies/build-tools/vite/api/'] },
      { keyword: 'docker', category: 'tools', expectedUrls: [] }, // Empty array in Ocean script
      { keyword: 'tailwind', category: 'tools', expectedUrls: ['/technologies/react/recipes/using-tailwind-css-in-react', '/technologies/angular/recipes/using-tailwind-css-with-angular-projects'] },
      { keyword: 'pnpm', category: 'tools', expectedUrls: ['/recipes/adopting-nx/adding-to-monorepo'] },
      
      // Code snippets - EXACT Ocean URLs
      { keyword: 'onlyDependOnLibsWithTags', category: 'api', expectedUrls: ['/technologies/eslint/eslint-plugin/recipes/enforce-module-boundaries'] },
      { keyword: 'addProjectConfiguration', category: 'api', expectedUrls: ['/reference/core-api/devkit/documents/addProjectConfiguration'] },
      { keyword: 'dependsOn', category: 'api', expectedUrls: ['/reference/project-configuration'] }
    ];
  }

  async testSite(siteConfig) {
    console.log(`\n🌐 Testing ${siteConfig.name} (${siteConfig.url})`);
    console.log('='.repeat(60));

    const context = await this.browser.newContext();
    const page = await context.newPage();

    const siteResults = {
      url: siteConfig.url,
      searchMethod: siteConfig.searchMethod,
      totalKeywords: this.keywords.length,
      testedKeywords: 0,
      keywordResults: {},
      summary: {
        coverageRate: 0,
        excellenceRate: 0,
        avgRelevance: 0,
        totalRelevantResults: 0,
        zeroResultsCount: 0
      },
      categoryBreakdown: {}
    };

    let totalOceanScore = 0;
    let perfectResults = 0;
    let foundResults = 0;

    for (const keywordData of this.keywords) {
      try {
        console.log(`\n🔍 Testing: "${keywordData.keyword}"`);
        
        const result = await this.testKeyword(page, siteConfig, keywordData);
        siteResults.keywordResults[keywordData.keyword] = result;
        siteResults.testedKeywords++;

        // Update Ocean-style statistics
        totalOceanScore += result.oceanScore;
        if (result.oceanScore === 3) {
          perfectResults++; // Found in top 3 positions
        }
        if (result.bestPosition > 0) {
          foundResults++; // Found somewhere in top 10
        }

        const positionText = result.bestPosition > 0 ? `position ${result.bestPosition}` : 'not found';
        console.log(`   Ocean score: ${result.oceanScore}/3, best position: ${positionText}`);

        // Brief pause to avoid overwhelming the site
        await page.waitForTimeout(500);

      } catch (error) {
        console.error(`   ❌ Error testing "${keywordData.keyword}": ${error.message}`);
        siteResults.keywordResults[keywordData.keyword] = {
          error: error.message,
          resultCount: 0,
          oceanScore: 0,
          bestPosition: -1,
          foundExpectedUrls: []
        };
      }
    }

    // Calculate Ocean-style statistics
    const oceanFinalScore = (10 * totalOceanScore) / (siteResults.testedKeywords * 3);
    siteResults.summary.oceanScore = parseFloat(oceanFinalScore.toFixed(2));
    siteResults.summary.perfectResults = perfectResults;
    siteResults.summary.foundResults = foundResults;
    siteResults.summary.coverageRate = (foundResults / siteResults.testedKeywords * 100).toFixed(1);
    siteResults.summary.excellenceRate = (perfectResults / siteResults.testedKeywords * 100).toFixed(1);

    // Category breakdown
    siteResults.categoryBreakdown = this.calculateCategoryBreakdown(siteResults.keywordResults);

    await context.close();
    return siteResults;
  }

  async testKeyword(page, siteConfig, keywordData) {
    try {
      // Navigate to site if not already there
      if (page.url() !== siteConfig.url) {
        await page.goto(siteConfig.url, { waitUntil: 'networkidle' });
      }

      // Execute search based on site type
      let searchResults = [];
      if (siteConfig.searchMethod === 'algolia') {
        searchResults = await this.testAlgoliaSearch(page, keywordData.keyword);
      } else if (siteConfig.searchMethod === 'astro') {
        searchResults = await this.testAstroSearch(page, keywordData.keyword);
      }

      // Score using Ocean's ranking-based system
      const oceanScore = this.calculateOceanScore(searchResults, keywordData);

      return {
        keyword: keywordData.keyword,
        category: keywordData.category,
        expectedUrls: keywordData.expectedUrls,
        resultCount: searchResults.length,
        results: searchResults.slice(0, 10), // Top 10 results like Ocean
        oceanScore: oceanScore.score,
        bestPosition: oceanScore.bestPosition,
        foundExpectedUrls: oceanScore.foundUrls,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      throw new Error(`Failed to test keyword "${keywordData.keyword}": ${error.message}`);
    }
  }

  async testAlgoliaSearch(page, keyword) {
    try {
      // Open search with Cmd+K
      await page.keyboard.press('Meta+k');
      
      // Wait for search modal to appear
      await page.waitForSelector('[data-testid="search-modal"], .DocSearch-Modal', { timeout: 5000 });
      
      // Type the search term
      await page.keyboard.type(keyword);
      
      // Wait for results to load
      await page.waitForTimeout(1500);
      
      // Get search results
      const results = await page.evaluate(() => {
        const resultElements = document.querySelectorAll('.DocSearch-Hit, [data-testid="search-result"]');
        return Array.from(resultElements).slice(0, 10).map((element, index) => {
          const titleElement = element.querySelector('.DocSearch-Hit-title, h3, [data-testid="result-title"]');
          const urlElement = element.querySelector('a');
          const snippetElement = element.querySelector('.DocSearch-Hit-content, .DocSearch-Hit-path, p, [data-testid="result-snippet"]');
          
          return {
            title: titleElement?.textContent?.trim() || `Result ${index + 1}`,
            url: urlElement?.href || '',
            snippet: snippetElement?.textContent?.trim() || '',
            source: 'algolia'
          };
        });
      });
      
      // Close search modal
      await page.keyboard.press('Escape');
      
      return results;
      
    } catch (error) {
      // Close search modal if it's open
      await page.keyboard.press('Escape');
      throw error;
    }
  }

  async testAstroSearch(page, keyword) {
    try {
      // Click the search button to open search dialog
      await page.click('button:has-text("Search"), [aria-label*="Search"], .search-button');
      
      // Wait for search dialog to appear
      await page.waitForSelector('[data-open-modal], .search-modal, dialog[open]', { timeout: 5000 });
      
      // Find the search input within the dialog
      const searchInput = await page.locator('dialog[open] input, .search-modal input, [data-open-modal] input').first();
      
      // Type the search term
      await searchInput.fill(keyword);
      
      // Wait for results to load
      await page.waitForTimeout(1500);
      
      // Get search results from the dialog
      const results = await page.evaluate(() => {
        const resultElements = document.querySelectorAll('dialog[open] a[href], .search-modal a[href], [data-open-modal] a[href]');
        return Array.from(resultElements).slice(0, 10).map((element, index) => {
          const titleElement = element.querySelector('*') || element;
          
          return {
            title: element.textContent?.trim() || `Result ${index + 1}`,
            url: element.href || '',
            snippet: '', // Astro search doesn't provide snippets in the same way
            source: 'astro'
          };
        });
      });
      
      // Close search dialog by pressing Escape
      await page.keyboard.press('Escape');
      
      return results;
      
    } catch (error) {
      // Try to close any open dialogs
      await page.keyboard.press('Escape');
      throw new Error(`Astro search failed: ${error.message}`);
    }
  }

  calculateOceanScore(searchResults, keywordData) {
    // Ocean scoring: find position of expected URLs in search results
    const expectedUrls = keywordData.expectedUrls;
    if (!expectedUrls || expectedUrls.length === 0) {
      return { score: 0, bestPosition: -1, foundUrls: [] };
    }

    const foundUrls = [];
    let bestPosition = 10; // Start with worst position
    
    for (const expectedUrl of expectedUrls) {
      // Find this expected URL in the search results
      const position = searchResults.findIndex(result => {
        const pathname = new URL(result.url).pathname;
        return pathname.endsWith(expectedUrl);
      });
      
      if (position !== -1) {
        foundUrls.push({ url: expectedUrl, position: position + 1 }); // 1-indexed
        bestPosition = Math.min(bestPosition, position);
      }
    }
    
    // Calculate score based on best position found
    let score = 0;
    if (bestPosition < 10) {
      if (bestPosition <= 2) { // Positions 1-3
        score = 3;
      } else if (bestPosition <= 5) { // Positions 4-6
        score = 2;
      } else if (bestPosition <= 8) { // Positions 7-9
        score = 1;
      }
    }
    
    return {
      score: score,
      bestPosition: bestPosition < 10 ? bestPosition + 1 : -1, // 1-indexed or -1 if not found
      foundUrls: foundUrls
    };
  }

  calculateCategoryBreakdown(keywordResults) {
    const categories = {};
    
    Object.values(keywordResults).forEach(result => {
      if (!result.category) return;
      
      if (!categories[result.category]) {
        categories[result.category] = {
          found: 0,
          perfect: 0,
          totalOceanScore: 0,
          count: 0
        };
      }
      
      const cat = categories[result.category];
      cat.count++;
      cat.totalOceanScore += result.oceanScore || 0;
      
      if (result.bestPosition > 0) {
        cat.found++;
      }
      
      if (result.oceanScore === 3) {
        cat.perfect++;
      }
    });
    
    // Calculate Ocean-style percentages and scores
    Object.keys(categories).forEach(cat => {
      const data = categories[cat];
      data.coverage = ((data.found / data.count) * 100).toFixed(1) + '%';
      data.excellence = ((data.perfect / data.count) * 100).toFixed(1) + '%';
      data.oceanScore = ((10 * data.totalOceanScore) / (data.count * 3)).toFixed(2);
    });
    
    return categories;
  }

  async runComparison(sites) {
    console.log('🚀 Starting Site Search Comparison');
    console.log('='.repeat(60));
    console.log(`Testing ${this.keywords.length} keywords across ${sites.length} sites\n`);

    this.browser = await chromium.launch({ headless: true }); // Use headless for faster testing

    try {
      // Test each site
      for (const site of sites) {
        const siteResults = await this.testSite(site);
        this.results.sites[site.name] = siteResults;
      }

      // Generate comparison if multiple sites
      if (sites.length > 1) {
        this.results.comparison = this.generateComparison();
      }

      this.saveResults();
      this.printSummary();

    } finally {
      await this.browser.close();
    }
  }

  generateComparison() {
    const siteNames = Object.keys(this.results.sites);
    if (siteNames.length < 2) return {};

    const [site1Name, site2Name] = siteNames;
    const site1 = this.results.sites[site1Name];
    const site2 = this.results.sites[site2Name];

    return {
      oceanScoreImprovement: (site2.summary.oceanScore - site1.summary.oceanScore).toFixed(2),
      coverageImprovement: (parseFloat(site2.summary.coverageRate) - parseFloat(site1.summary.coverageRate)).toFixed(1) + '%',
      excellenceImprovement: (parseFloat(site2.summary.excellenceRate) - parseFloat(site1.summary.excellenceRate)).toFixed(1) + '%',
      winningCategories: this.findWinningCategories(site1, site2),
      regressionCategories: this.findRegressionCategories(site1, site2)
    };
  }

  findWinningCategories(site1, site2) {
    const winning = [];
    Object.keys(site1.categoryBreakdown).forEach(category => {
      const score1 = parseFloat(site1.categoryBreakdown[category]?.oceanScore || 0);
      const score2 = parseFloat(site2.categoryBreakdown[category]?.oceanScore || 0);
      if (score2 > score1) {
        winning.push(category);
      }
    });
    return winning;
  }

  findRegressionCategories(site1, site2) {
    const regressions = [];
    Object.keys(site1.categoryBreakdown).forEach(category => {
      const score1 = parseFloat(site1.categoryBreakdown[category]?.oceanScore || 0);
      const score2 = parseFloat(site2.categoryBreakdown[category]?.oceanScore || 0);
      if (score2 < score1 && score1 > 2.0) {
        regressions.push(category);
      }
    });
    return regressions;
  }

  printSummary() {
    console.log('\n📊 Ocean-Style Search Quality Results');
    console.log('='.repeat(60));

    Object.entries(this.results.sites).forEach(([siteName, siteData]) => {
      console.log(`\n🌐 ${siteName.toUpperCase()}`);
      console.log(`   URL: ${siteData.url}`);
      console.log(`   Keywords Tested: ${siteData.testedKeywords}`);
      console.log(`   🎯 Ocean Score: ${siteData.summary.oceanScore}/10.0`);
      console.log(`   📊 Found Rate: ${siteData.summary.coverageRate}% (${siteData.summary.foundResults}/${siteData.testedKeywords})`);
      console.log(`   ⭐ Perfect Rate: ${siteData.summary.excellenceRate}% (${siteData.summary.perfectResults} in top-3)`);
      
      console.log('\n   📈 Category Breakdown:');
      Object.entries(siteData.categoryBreakdown).forEach(([category, data]) => {
        console.log(`      ${category.padEnd(12)}: ${data.oceanScore}/10.0 (${data.coverage} found, ${data.excellence} perfect)`);
      });
    });

    if (this.results.comparison && Object.keys(this.results.comparison).length > 0) {
      console.log('\n🔄 Site Comparison:');
      console.log(`   Ocean Score Improvement: ${this.results.comparison.oceanScoreImprovement}`);
      console.log(`   Coverage Improvement: ${this.results.comparison.coverageImprovement}`);
      console.log(`   Excellence Improvement: ${this.results.comparison.excellenceImprovement}`);
      
      if (this.results.comparison.winningCategories.length > 0) {
        console.log(`   Improved Categories: ${this.results.comparison.winningCategories.join(', ')}`);
      }
      if (this.results.comparison.regressionCategories.length > 0) {
        console.log(`   Regression Categories: ${this.results.comparison.regressionCategories.join(', ')}`);
      }
    }
  }

  saveResults() {
    const outputPath = path.join(__dirname, 'site-search-comparison.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Detailed results saved to: .ai/2025-08-19/tasks/site-search-comparison.json`);
  }
}

// Main execution
async function main() {
  // Configuration for sites to test
  const sites = [
    {
      name: 'production',
      url: 'https://nx.dev',
      searchMethod: 'algolia'
    },
    {
      name: 'astro_preview',
      url: 'https://nx-docs.netlify.app',
      searchMethod: 'astro'
    }
  ];

  const tester = new SiteSearchTester();
  await tester.runComparison(sites);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}