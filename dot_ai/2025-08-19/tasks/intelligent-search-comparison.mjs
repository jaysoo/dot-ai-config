#!/usr/bin/env node

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class IntelligentSearchComparison {
  constructor() {
    this.oceanKeywords = this.loadOceanKeywords();
    this.astroContentMap = null;
    this.unsureUrls = [];
    this.results = {
      timestamp: new Date().toISOString(),
      sites: {},
      contentMatches: {},
      unsureUrls: []
    };
  }

  loadOceanKeywords() {
    // Exact Ocean keywords with updated URLs
    return [
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
      
      // Frameworks with exact Ocean URLs
      { keyword: 'angular', category: 'frameworks', expectedUrls: ['/technologies/angular/api/'] },
      { keyword: 'angular matrix', category: 'frameworks', expectedUrls: ['/technologies/angular/recipes/angular-nx-version-matrix'] },
      { keyword: 'react', category: 'frameworks', expectedUrls: ['/technologies/react/api/'] },
      { keyword: 'nestjs', category: 'frameworks', expectedUrls: ['/technologies/node/nest/api/'] },
      { keyword: 'nest', category: 'frameworks', expectedUrls: ['/technologies/node/nest/api/'] },
      { keyword: 'next', category: 'frameworks', expectedUrls: ['/technologies/react/next/api/'] },
      
      // Tools with exact Ocean URLs
      { keyword: 'storybook', category: 'tools', expectedUrls: ['/technologies/test-tools/storybook/api/'] },
      { keyword: 'eslint', category: 'tools', expectedUrls: ['/technologies/eslint/api/'] },
      { keyword: 'jest', category: 'tools', expectedUrls: ['/technologies/test-tools/jest/api/'] },
      { keyword: 'vite', category: 'tools', expectedUrls: ['/technologies/build-tools/vite/api/'] },
      { keyword: 'docker', category: 'tools', expectedUrls: [] },
      { keyword: 'tailwind', category: 'tools', expectedUrls: ['/technologies/react/recipes/using-tailwind-css-in-react', '/technologies/angular/recipes/using-tailwind-css-with-angular-projects'] },
      { keyword: 'pnpm', category: 'tools', expectedUrls: ['/recipes/adopting-nx/adding-to-monorepo'] },
      
      { keyword: 'onlyDependOnLibsWithTags', category: 'api', expectedUrls: ['/technologies/eslint/eslint-plugin/recipes/enforce-module-boundaries'] },
      { keyword: 'addProjectConfiguration', category: 'api', expectedUrls: ['/reference/core-api/devkit/documents/addProjectConfiguration'] },
      { keyword: 'dependsOn', category: 'api', expectedUrls: ['/reference/project-configuration'] }
    ];
  }

  async buildAstroContentMap() {
    console.log('📚 Building Astro content map from mdoc files...');
    
    // Look for Astro project (try multiple locations)
    const possiblePaths = [
      '/Users/jack/projects/nx-worktrees/DOC-121/apps/nx-docs',
      '/Users/jack/projects/nx-worktrees/DOC-121/docs',
      '/Users/jack/projects/nx-worktrees/DOC-121',
      '/Users/jack/projects/nx-docs', // fallback
    ];
    
    let astroPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        // Look for mdoc files
        const mdocFiles = await glob('**/*.mdoc', { cwd: testPath });
        if (mdocFiles.length > 0) {
          astroPath = testPath;
          console.log(`   Found ${mdocFiles.length} .mdoc files in ${testPath}`);
          break;
        }
      }
    }
    
    if (!astroPath) {
      console.log('   ⚠️  No Astro mdoc files found, using URL-only matching');
      return {};
    }
    
    // Build content map
    const contentMap = {};
    const mdocFiles = await glob('**/*.mdoc', { cwd: astroPath });
    
    console.log(`   Processing ${mdocFiles.length} mdoc files...`);
    
    for (const file of mdocFiles.slice(0, 100)) { // Limit to first 100 for speed
      try {
        const fullPath = path.join(astroPath, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Extract URL from file path
        let url = file
          .replace(/\.mdoc$/, '')
          .replace(/\/index$/, '') // Remove index
          .split('/').join('/');
        
        if (!url.startsWith('/')) url = '/' + url;
        
        // Store content summary
        contentMap[url] = {
          file: file,
          title: this.extractTitle(content),
          content: content.substring(0, 500), // First 500 chars
          keywords: this.extractKeywords(content)
        };
        
      } catch (error) {
        console.log(`   ⚠️  Error reading ${file}: ${error.message}`);
      }
    }
    
    console.log(`   Built content map with ${Object.keys(contentMap).length} entries`);
    this.astroContentMap = contentMap;
    return contentMap;
  }
  
  extractTitle(content) {
    // Look for title in frontmatter or first heading
    const titleMatch = content.match(/title:\s*["']([^"']+)["']/i) || 
                      content.match(/^#\s+(.+)/m);
    return titleMatch ? titleMatch[1].trim() : 'Untitled';
  }
  
  extractKeywords(content) {
    // Extract keywords from content
    const keywords = new Set();
    const text = content.toLowerCase();
    
    // Common framework/tool terms
    const terms = ['angular', 'react', 'nest', 'next', 'eslint', 'jest', 'vite', 
                   'docker', 'storybook', 'tailwind', 'nx', 'build', 'serve', 
                   'lint', 'affected', 'migrate', 'plugin', 'generator'];
    
    terms.forEach(term => {
      if (text.includes(term)) {
        keywords.add(term);
      }
    });
    
    return Array.from(keywords);
  }

  async findContentMatches(keyword, searchResults, expectedUrls) {
    if (!this.astroContentMap) return { matches: [], confidence: 'unknown' };
    
    const matches = [];
    
    // First, try exact URL matches
    for (const expectedUrl of expectedUrls) {
      if (this.astroContentMap[expectedUrl]) {
        matches.push({
          url: expectedUrl,
          type: 'exact_url_match',
          confidence: 'high',
          title: this.astroContentMap[expectedUrl].title
        });
      }
    }
    
    if (matches.length > 0) {
      return { matches, confidence: 'high' };
    }
    
    // Search for keyword in content
    const keywordLower = keyword.toLowerCase();
    const contentMatches = [];
    
    Object.entries(this.astroContentMap).forEach(([url, data]) => {
      let score = 0;
      
      // Check if keyword appears in title
      if (data.title.toLowerCase().includes(keywordLower)) {
        score += 10;
      }
      
      // Check if keyword appears in keywords
      if (data.keywords.includes(keywordLower)) {
        score += 8;
      }
      
      // Check if keyword appears in content
      if (data.content.toLowerCase().includes(keywordLower)) {
        score += 3;
      }
      
      // Check for related terms
      if (keywordLower === 'angular' && (url.includes('/angular') || data.content.includes('@angular'))) {
        score += 5;
      }
      if (keywordLower === 'react' && (url.includes('/react') || data.content.includes('react'))) {
        score += 5;
      }
      // Add more specific matching rules...
      
      if (score > 5) {
        contentMatches.push({
          url,
          score,
          title: data.title,
          type: 'content_match'
        });
      }
    });
    
    // Sort by score and take top matches
    contentMatches.sort((a, b) => b.score - a.score);
    const topMatches = contentMatches.slice(0, 3);
    
    if (topMatches.length > 0) {
      return {
        matches: topMatches,
        confidence: topMatches[0].score > 10 ? 'high' : topMatches[0].score > 7 ? 'medium' : 'low'
      };
    }
    
    return { matches: [], confidence: 'none' };
  }

  async testAstroSearchWithContent(page, keywordData) {
    try {
      // Get search results from Astro site
      await page.click('button:has-text("Search")');
      await page.waitForSelector('dialog[open] input', { timeout: 3000 });
      await page.fill('dialog[open] input', keywordData.keyword);
      await page.waitForTimeout(2000);
      
      const searchResults = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('dialog[open] a[href]'));
        return links.slice(0, 10).map((link, index) => ({
          position: index + 1,
          title: link.textContent?.trim(),
          url: link.href,
          pathname: new URL(link.href).pathname
        }));
      });
      
      await page.keyboard.press('Escape');
      
      // Calculate Ocean score (exact URL matches)
      const oceanScore = this.calculateOceanScore(searchResults, keywordData);
      
      // Find content matches using mdoc analysis
      const contentMatches = await this.findContentMatches(
        keywordData.keyword, 
        searchResults, 
        keywordData.expectedUrls
      );
      
      // Determine final score considering both exact matches and content matches
      let finalScore = oceanScore.score;
      let explanation = 'exact_match';
      
      if (oceanScore.score === 0 && contentMatches.matches.length > 0) {
        // No exact URL match, but we found content matches
        const bestMatch = contentMatches.matches[0];
        const position = searchResults.findIndex(r => r.pathname === bestMatch.url);
        
        if (position !== -1) {
          // Found in search results
          if (position <= 2) finalScore = 3;
          else if (position <= 5) finalScore = 2;
          else if (position <= 8) finalScore = 1;
          explanation = `content_match_${contentMatches.confidence}`;
        } else if (contentMatches.confidence === 'high') {
          // High confidence content match but not in search results
          finalScore = 1; // Give some credit
          explanation = 'content_exists_not_searchable';
        }
      }
      
      // Track unsure cases for manual review
      if (oceanScore.score === 0 && (contentMatches.confidence === 'low' || contentMatches.matches.length === 0)) {
        this.unsureUrls.push({
          keyword: keywordData.keyword,
          expectedUrls: keywordData.expectedUrls,
          searchResults: searchResults.slice(0, 5),
          contentMatches: contentMatches,
          reason: 'no_clear_match_found'
        });
      }
      
      return {
        keyword: keywordData.keyword,
        category: keywordData.category,
        expectedUrls: keywordData.expectedUrls,
        searchResults: searchResults,
        oceanScore: oceanScore.score,
        enhancedScore: finalScore,
        contentMatches: contentMatches,
        explanation: explanation,
        bestPosition: oceanScore.bestPosition > 0 ? oceanScore.bestPosition : 
                     (contentMatches.matches.length > 0 ? 'content_match' : -1)
      };
      
    } catch (error) {
      await page.keyboard.press('Escape');
      throw error;
    }
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
        return result.pathname.endsWith(expectedUrl);
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

  async runIntelligentComparison() {
    console.log('🚀 Starting Intelligent Search Quality Comparison');
    console.log('='.repeat(60));
    
    // Build Astro content map
    await this.buildAstroContentMap();
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      console.log(`\n🌐 Testing Astro Preview Site with Content Analysis`);
      console.log('='.repeat(60));
      
      await page.goto('https://nx-docs.netlify.app', { waitUntil: 'networkidle' });
      
      const results = [];
      let totalOceanScore = 0;
      let totalEnhancedScore = 0;
      let exactMatches = 0;
      let contentMatches = 0;
      let noMatches = 0;
      
      for (const keywordData of this.oceanKeywords) {
        console.log(`\n🔍 Testing: "${keywordData.keyword}"`);
        
        try {
          const result = await this.testAstroSearchWithContent(page, keywordData);
          results.push(result);
          
          totalOceanScore += result.oceanScore;
          totalEnhancedScore += result.enhancedScore;
          
          if (result.oceanScore > 0) {
            exactMatches++;
            console.log(`   ✅ Exact match: ${result.oceanScore}/3 (position ${result.bestPosition})`);
          } else if (result.enhancedScore > 0) {
            contentMatches++;
            console.log(`   🔍 Content match: ${result.enhancedScore}/3 (${result.explanation})`);
          } else {
            noMatches++;
            console.log(`   ❌ No match found`);
          }
          
          await page.waitForTimeout(300); // Brief pause
          
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}`);
          noMatches++;
        }
      }
      
      // Calculate final scores
      const totalKeywords = this.oceanKeywords.length;
      const oceanFinalScore = (10 * totalOceanScore) / (totalKeywords * 3);
      const enhancedFinalScore = (10 * totalEnhancedScore) / (totalKeywords * 3);
      
      console.log('\n📊 Intelligent Comparison Results');
      console.log('='.repeat(60));
      console.log(`Keywords Tested: ${totalKeywords}`);
      console.log(`🎯 Ocean Score (exact matches): ${oceanFinalScore.toFixed(2)}/10.0`);
      console.log(`🧠 Enhanced Score (with content analysis): ${enhancedFinalScore.toFixed(2)}/10.0`);
      console.log(`📈 Improvement from content analysis: +${(enhancedFinalScore - oceanFinalScore).toFixed(2)}`);
      console.log(`✅ Exact URL matches: ${exactMatches}/${totalKeywords} (${(exactMatches/totalKeywords*100).toFixed(1)}%)`);
      console.log(`🔍 Content matches: ${contentMatches}/${totalKeywords} (${(contentMatches/totalKeywords*100).toFixed(1)}%)`);
      console.log(`❌ No matches: ${noMatches}/${totalKeywords} (${(noMatches/totalKeywords*100).toFixed(1)}%)`);
      
      if (this.unsureUrls.length > 0) {
        console.log(`\n⚠️  ${this.unsureUrls.length} URLs need manual review - check results file`);
      }
      
      // Save detailed results
      this.results = {
        timestamp: new Date().toISOString(),
        summary: {
          totalKeywords,
          oceanScore: oceanFinalScore,
          enhancedScore: enhancedFinalScore,
          exactMatches,
          contentMatches,
          noMatches,
          improvement: enhancedFinalScore - oceanFinalScore
        },
        keywordResults: results,
        unsureUrls: this.unsureUrls
      };
      
      this.saveResults();
      
    } finally {
      await browser.close();
    }
  }
  
  saveResults() {
    const outputPath = path.join(__dirname, 'intelligent-search-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Detailed results saved to: intelligent-search-results.json`);
    
    // Also save unsure URLs for manual review
    if (this.unsureUrls.length > 0) {
      const unsurePath = path.join(__dirname, 'manual-review-needed.json');
      fs.writeFileSync(unsurePath, JSON.stringify(this.unsureUrls, null, 2));
      console.log(`📋 Manual review list saved to: manual-review-needed.json`);
    }
  }
}

// Run the intelligent comparison
const tester = new IntelligentSearchComparison();
await tester.runIntelligentComparison();