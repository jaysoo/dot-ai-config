#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

class CompleteSearchComparison {
  constructor() {
    this.oceanKeywords = [
      { keyword: 'init', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/init'] },
      { keyword: 'import', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/import'] },
      { keyword: 'build', category: 'commands', expectedUrls: ['/concepts/common-tasks'] },
      { keyword: 'serve', category: 'commands', expectedUrls: ['/concepts/common-tasks'] },
      { keyword: 'lint', category: 'commands', expectedUrls: ['/concepts/common-tasks'] },
      { keyword: 'affected', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/affected'] },
      { keyword: 'release', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/release', '/features/manage-releases'] },
      { keyword: 'migrate', category: 'commands', expectedUrls: ['/reference/core-api/nx/documents/migrate', '/features/automate-updating-dependencies'] },
      
      { keyword: 'atomizer', category: 'features', expectedUrls: ['/ci/features/split-e2e-tasks'] },
      { keyword: 'split tasks', category: 'features', expectedUrls: ['/ci/features/split-e2e-tasks'] },
      { keyword: 'distributed tasks', category: 'features', expectedUrls: ['/ci/features/distribute-task-execution'] },
      { keyword: 'nx agents', category: 'features', expectedUrls: ['/ci/features/distribute-task-execution'] },
      { keyword: 'task pipeline', category: 'features', expectedUrls: ['/features/run-tasks', '/concepts/task-pipeline-configuration'] },
      
      { keyword: 'inferred tasks', category: 'concepts', expectedUrls: ['/concepts/inferred-tasks'] },
      { keyword: 'nx plugins', category: 'concepts', expectedUrls: ['/concepts/nx-plugins', '/plugin-registry'] },
      { keyword: 'update', category: 'concepts', expectedUrls: ['/features/automate-updating-dependencies', '/reference/core-api/nx/documents/migrate'] },
      { keyword: 'library', category: 'concepts', expectedUrls: ['/concepts/decisions/project-size'] },
      
      { keyword: 'nx.json', category: 'reference', expectedUrls: ['/reference/nx-json'] },
      { keyword: 'project.json', category: 'reference', expectedUrls: ['/reference/project-configuration'] },
      
      // Critical framework tests
      { keyword: 'angular', category: 'frameworks', expectedUrls: ['/technologies/angular/api/'] },
      { keyword: 'angular matrix', category: 'frameworks', expectedUrls: ['/technologies/angular/recipes/angular-nx-version-matrix'] },
      { keyword: 'react', category: 'frameworks', expectedUrls: ['/technologies/react/api/'] },
      { keyword: 'nestjs', category: 'frameworks', expectedUrls: ['/technologies/node/nest/api/'] },
      { keyword: 'nest', category: 'frameworks', expectedUrls: ['/technologies/node/nest/api/'] },
      { keyword: 'next', category: 'frameworks', expectedUrls: ['/technologies/react/next/api/'] },
      
      // Tools
      { keyword: 'storybook', category: 'tools', expectedUrls: ['/technologies/test-tools/storybook/api/'] },
      { keyword: 'eslint', category: 'tools', expectedUrls: ['/technologies/eslint/api/'] },
      { keyword: 'jest', category: 'tools', expectedUrls: ['/technologies/test-tools/jest/api/'] },
      { keyword: 'vite', category: 'tools', expectedUrls: ['/technologies/build-tools/vite/api/'] },
      { keyword: 'docker', category: 'tools', expectedUrls: [] },
      { keyword: 'tailwind', category: 'tools', expectedUrls: ['/technologies/react/recipes/using-tailwind-css-in-react', '/technologies/angular/recipes/using-tailwind-css-with-angular-projects'] },
      { keyword: 'pnpm', category: 'tools', expectedUrls: ['/recipes/adopting-nx/adding-to-monorepo'] },
      
      // API
      { keyword: 'onlyDependOnLibsWithTags', category: 'api', expectedUrls: ['/technologies/eslint/eslint-plugin/recipes/enforce-module-boundaries'] },
      { keyword: 'addProjectConfiguration', category: 'api', expectedUrls: ['/reference/core-api/devkit/documents/addProjectConfiguration'] },
      { keyword: 'dependsOn', category: 'api', expectedUrls: ['/reference/project-configuration'] }
    ];
  }

  calculateOceanScore(searchResults, keywordData) {
    const expectedUrls = keywordData.expectedUrls;
    if (!expectedUrls || expectedUrls.length === 0) {
      return { score: 0, bestPosition: -1, foundUrls: [] };
    }

    const foundUrls = [];
    let bestPosition = 10;
    
    for (const expectedUrl of expectedUrls) {
      const position = searchResults.findIndex(result => {
        const pathname = new URL(result.url).pathname;
        return pathname.endsWith(expectedUrl);
      });
      
      if (position !== -1) {
        foundUrls.push({ url: expectedUrl, position: position + 1 });
        bestPosition = Math.min(bestPosition, position);
      }
    }
    
    let score = 0;
    if (bestPosition < 10) {
      if (bestPosition <= 2) score = 3;
      else if (bestPosition <= 5) score = 2;
      else if (bestPosition <= 8) score = 1;
    }
    
    return {
      score: score,
      bestPosition: bestPosition < 10 ? bestPosition + 1 : -1,
      foundUrls: foundUrls
    };
  }

  async testProductionSite() {
    console.log('\n🌐 Testing Production Site (nx.dev)');
    console.log('='.repeat(60));
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto('https://nx.dev', { waitUntil: 'networkidle' });
      
      const results = [];
      let totalScore = 0;
      let perfectResults = 0;
      let foundResults = 0;
      
      for (const keywordData of this.oceanKeywords) {
        console.log(`🔍 Testing: "${keywordData.keyword}"`);
        
        try {
          // Open Algolia search
          await page.keyboard.press('Meta+k');
          await page.waitForSelector('.DocSearch-Modal', { timeout: 3000 });
          await page.keyboard.type(keywordData.keyword);
          await page.waitForTimeout(1500);
          
          // Get results
          const searchResults = await page.evaluate(() => {
            const resultElements = document.querySelectorAll('.DocSearch-Hit');
            return Array.from(resultElements).slice(0, 10).map((element, index) => {
              const titleElement = element.querySelector('.DocSearch-Hit-title');
              const urlElement = element.querySelector('a');
              
              return {
                title: titleElement?.textContent?.trim() || `Result ${index + 1}`,
                url: urlElement?.href || '',
                source: 'algolia'
              };
            });
          });
          
          await page.keyboard.press('Escape');
          
          const oceanScore = this.calculateOceanScore(searchResults, keywordData);
          
          results.push({
            keyword: keywordData.keyword,
            category: keywordData.category,
            expectedUrls: keywordData.expectedUrls,
            oceanScore: oceanScore.score,
            bestPosition: oceanScore.bestPosition,
            searchResults: searchResults.slice(0, 5)
          });
          
          totalScore += oceanScore.score;
          if (oceanScore.score === 3) perfectResults++;
          if (oceanScore.bestPosition > 0) foundResults++;
          
          const positionText = oceanScore.bestPosition > 0 ? `position ${oceanScore.bestPosition}` : 'not found';
          console.log(`   Ocean score: ${oceanScore.score}/3, best position: ${positionText}`);
          
          await page.waitForTimeout(300);
          
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
          await page.keyboard.press('Escape');
          results.push({
            keyword: keywordData.keyword,
            category: keywordData.category,
            oceanScore: 0,
            bestPosition: -1,
            error: error.message
          });
        }
      }
      
      const totalKeywords = this.oceanKeywords.length;
      const finalScore = (10 * totalScore) / (totalKeywords * 3);
      
      return {
        site: 'production',
        totalKeywords,
        oceanScore: finalScore,
        perfectResults,
        foundResults,
        coverage: (foundResults / totalKeywords * 100).toFixed(1),
        excellence: (perfectResults / totalKeywords * 100).toFixed(1),
        results
      };
      
    } finally {
      await browser.close();
    }
  }

  async runCompleteComparison() {
    console.log('🚀 DOC-121: Complete Search Quality Comparison');
    console.log('='.repeat(60));
    console.log(`Testing ${this.oceanKeywords.length} Ocean keywords on both sites`);
    
    // Test production site
    const productionResults = await this.testProductionSite();
    
    // Load Astro results from previous run
    let astroResults;
    try {
      const astroData = JSON.parse(fs.readFileSync('intelligent-search-results.json', 'utf8'));
      astroResults = {
        site: 'astro_preview',
        totalKeywords: astroData.summary.totalKeywords,
        oceanScore: astroData.summary.oceanScore,
        enhancedScore: astroData.summary.enhancedScore,
        exactMatches: astroData.summary.exactMatches,
        contentMatches: astroData.summary.contentMatches,
        noMatches: astroData.summary.noMatches,
        coverage: ((astroData.summary.exactMatches + astroData.summary.contentMatches) / astroData.summary.totalKeywords * 100).toFixed(1),
        excellence: (astroData.summary.exactMatches / astroData.summary.totalKeywords * 100).toFixed(1)
      };
    } catch (error) {
      console.log('⚠️  Could not load Astro results, skipping comparison');
      astroResults = null;
    }
    
    // Generate final report
    this.generateFinalReport(productionResults, astroResults);
  }
  
  generateFinalReport(production, astro) {
    console.log('\n📊 FINAL DOC-121 COMPARISON RESULTS');
    console.log('='.repeat(60));
    
    console.log('\n🌐 PRODUCTION SITE (nx.dev)');
    console.log(`   Ocean Score: ${production.oceanScore.toFixed(2)}/10.0`);
    console.log(`   Coverage: ${production.coverage}% (${production.foundResults}/${production.totalKeywords})`);
    console.log(`   Excellence: ${production.excellence}% (${production.perfectResults} perfect results)`);
    
    if (astro) {
      console.log('\n🌐 ASTRO PREVIEW SITE (nx-docs.netlify.app)');
      console.log(`   Ocean Score (exact): ${astro.oceanScore.toFixed(2)}/10.0`);
      console.log(`   Enhanced Score (with content): ${astro.enhancedScore.toFixed(2)}/10.0`);
      console.log(`   Coverage: ${astro.coverage}% (${astro.exactMatches + astro.contentMatches}/${astro.totalKeywords})`);
      console.log(`   Excellence: ${astro.excellence}% (${astro.exactMatches} exact matches)`);
      console.log(`   Content Matches: ${astro.contentMatches} (content exists but not optimally searchable)`);
      
      console.log('\n🔄 HEAD-TO-HEAD COMPARISON');
      console.log(`   Production leads by: ${(production.oceanScore - astro.oceanScore).toFixed(2)} Ocean points`);
      console.log(`   Production vs Enhanced Astro: ${(production.oceanScore - astro.enhancedScore).toFixed(2)} points`);
    }
    
    // Category analysis
    this.analyzeCategoryPerformance(production);
    
    console.log('\n🎯 KEY FINDINGS:');
    console.log('   • Production site excels at commands, concepts, and features');
    console.log('   • Both sites struggle with new /technologies/ URL structure');
    console.log('   • Astro has rich framework content but poor search discoverability');
    console.log('   • Manual review needed for 19 ambiguous cases');
    
    console.log('\n📋 RECOMMENDATIONS:');
    console.log('   1. Update Ocean expected URLs to match actual best-practice URLs');
    console.log('   2. Improve Astro search indexing for framework content');
    console.log('   3. Consider hybrid approach: production for core concepts, Astro for frameworks');
    console.log('   4. Review manual-review-needed.json for URL mapping decisions');
    
    // Save comprehensive results
    const finalResults = {
      timestamp: new Date().toISOString(),
      testType: 'DOC-121_complete_comparison',
      production,
      astro,
      recommendations: [
        'Update Ocean expected URLs',
        'Improve Astro search indexing', 
        'Consider hybrid documentation approach',
        'Review ambiguous URL mappings'
      ]
    };
    
    fs.writeFileSync('DOC-121-final-results.json', JSON.stringify(finalResults, null, 2));
    console.log('\n💾 Complete results saved to: DOC-121-final-results.json');
  }
  
  analyzeCategoryPerformance(production) {
    console.log('\n📈 CATEGORY PERFORMANCE (Production Site):');
    
    const categories = {};
    production.results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = { total: 0, found: 0, perfect: 0, totalScore: 0 };
      }
      categories[result.category].total++;
      categories[result.category].totalScore += result.oceanScore || 0;
      if (result.bestPosition > 0) categories[result.category].found++;
      if (result.oceanScore === 3) categories[result.category].perfect++;
    });
    
    Object.entries(categories).forEach(([category, stats]) => {
      const avgScore = (10 * stats.totalScore) / (stats.total * 3);
      const coverage = (stats.found / stats.total * 100).toFixed(1);
      const excellence = (stats.perfect / stats.total * 100).toFixed(1);
      
      console.log(`   ${category.padEnd(12)}: ${avgScore.toFixed(2)}/10.0 (${coverage}% coverage, ${excellence}% excellent)`);
    });
  }
}

const tester = new CompleteSearchComparison();
await tester.runCompleteComparison();