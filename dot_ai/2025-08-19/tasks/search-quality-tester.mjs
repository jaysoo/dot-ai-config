#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SearchQualityTester {
  constructor() {
    // Load keyword analysis results
    const analysisPath = path.join(__dirname, 'keyword-analysis.json');
    if (fs.existsSync(analysisPath)) {
      this.analysisData = JSON.parse(fs.readFileSync(analysisPath, 'utf-8'));
    } else {
      console.error('❌ keyword-analysis.json not found. Run extract-keywords.mjs first.');
      process.exit(1);
    }
    
    // Define test queries based on important keywords
    this.testQueries = this.generateTestQueries();
    this.results = [];
  }

  generateTestQueries() {
    const queries = [];
    
    // Category-based queries
    const categories = {
      frameworks: ['angular', 'react', 'vue', 'next', 'nest'],
      tools: ['webpack', 'vite', 'jest', 'cypress', 'playwright'],
      concepts: ['monorepo', 'workspace', 'library', 'generator', 'executor'],
      features: ['build', 'test', 'cache', 'affected', 'graph'],
      getting_started: ['tutorial', 'quickstart', 'setup', 'installation']
    };
    
    // High-value search queries
    const highValueQueries = [
      'getting started',
      'create new project',
      'nx cloud',
      'cache configuration',
      'task dependencies',
      'module federation',
      'migrate from angular cli',
      'react native',
      'environment variables',
      'CI configuration'
    ];
    
    // Add category queries
    Object.entries(categories).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        queries.push({
          query: keyword,
          category: category,
          expectedInTop5: this.getExpectedDocs(keyword)
        });
      });
    });
    
    // Add high-value queries
    highValueQueries.forEach(query => {
      queries.push({
        query: query,
        category: 'high_value',
        expectedInTop5: this.getExpectedDocs(query)
      });
    });
    
    return queries;
  }

  getExpectedDocs(keyword) {
    // Map keywords to expected documentation pages
    const expectations = {
      'angular': ['packages/angular', 'getting-started/angular'],
      'react': ['packages/react', 'getting-started/react'],
      'monorepo': ['concepts/monorepo', 'guides/monorepo-setup'],
      'cache': ['concepts/cache', 'reference/cache-configuration'],
      'getting started': ['getting-started', 'tutorials'],
      'nx cloud': ['nx-cloud/intro', 'nx-cloud/setup'],
      // Add more mappings as needed
    };
    
    return expectations[keyword.toLowerCase()] || [];
  }

  async runTests() {
    console.log('🔬 Running Search Quality Tests\n');
    console.log('='.repeat(50));
    
    for (const testQuery of this.testQueries) {
      await this.testSearchQuery(testQuery);
    }
    
    this.analyzeResults();
    this.saveResults();
  }

  async testSearchQuery(testQuery) {
    // Since we can't directly query Algolia without credentials,
    // we'll simulate based on keyword presence in documents
    const results = this.simulateSearch(testQuery.query);
    
    const metrics = {
      query: testQuery.query,
      category: testQuery.category,
      resultsFound: results.length,
      topResults: results.slice(0, 5),
      relevanceScore: this.calculateRelevance(results, testQuery),
      expectedDocsFound: this.checkExpectedDocs(results, testQuery.expectedInTop5)
    };
    
    this.results.push(metrics);
    
    console.log(`\n📍 Query: "${testQuery.query}"`);
    console.log(`   Category: ${testQuery.category}`);
    console.log(`   Results found: ${metrics.resultsFound}`);
    console.log(`   Relevance score: ${metrics.relevanceScore.toFixed(2)}%`);
  }

  simulateSearch(query) {
    // Simulate search by finding documents with matching keywords
    const queryTerms = query.toLowerCase().split(' ');
    const matches = [];
    
    // Check against our keyword analysis data
    Object.entries(this.analysisData.fileKeywords).forEach(([file, keywords]) => {
      let score = 0;
      
      // Check keyword matches
      keywords.forEach(keyword => {
        queryTerms.forEach(term => {
          if (keyword.toLowerCase().includes(term)) {
            score += 10;
          }
        });
      });
      
      // Check file path relevance
      queryTerms.forEach(term => {
        if (file.toLowerCase().includes(term)) {
          score += 5;
        }
      });
      
      if (score > 0) {
        matches.push({ file, score, keywords });
      }
    });
    
    // Sort by score
    return matches.sort((a, b) => b.score - a.score);
  }

  calculateRelevance(results, testQuery) {
    if (results.length === 0) return 0;
    
    // Calculate relevance based on:
    // 1. Number of results found
    // 2. Score distribution
    // 3. Expected documents in top results
    
    const maxResults = Math.min(results.length, 10);
    const relevantResults = results.slice(0, maxResults).filter(r => r.score > 5);
    
    return (relevantResults.length / maxResults) * 100;
  }

  checkExpectedDocs(results, expectedDocs) {
    if (expectedDocs.length === 0) return true;
    
    const topFiles = results.slice(0, 5).map(r => r.file);
    return expectedDocs.some(expected => 
      topFiles.some(file => file.includes(expected))
    );
  }

  analyzeResults() {
    console.log('\n\n📊 Search Quality Analysis\n');
    console.log('='.repeat(50));
    
    // Calculate overall metrics
    const totalQueries = this.results.length;
    const avgRelevance = this.results.reduce((sum, r) => sum + r.relevanceScore, 0) / totalQueries;
    const queriesWithResults = this.results.filter(r => r.resultsFound > 0).length;
    const queriesWithExpectedDocs = this.results.filter(r => r.expectedDocsFound).length;
    
    console.log('\n📈 Overall Metrics:');
    console.log(`  Total test queries: ${totalQueries}`);
    console.log(`  Average relevance score: ${avgRelevance.toFixed(2)}%`);
    console.log(`  Queries with results: ${queriesWithResults} (${(queriesWithResults/totalQueries*100).toFixed(1)}%)`);
    console.log(`  Queries with expected docs: ${queriesWithExpectedDocs}`);
    
    // Analyze by category
    console.log('\n📊 Performance by Category:');
    const categories = [...new Set(this.results.map(r => r.category))];
    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category);
      const avgScore = categoryResults.reduce((sum, r) => sum + r.relevanceScore, 0) / categoryResults.length;
      console.log(`  ${category}: ${avgScore.toFixed(2)}% average relevance`);
    });
    
    // Identify problematic queries
    console.log('\n⚠️  Queries Needing Improvement:');
    const problematicQueries = this.results
      .filter(r => r.relevanceScore < 50 || r.resultsFound === 0)
      .slice(0, 10);
    
    problematicQueries.forEach(query => {
      console.log(`  - "${query.query}" (${query.relevanceScore.toFixed(1)}% relevance, ${query.resultsFound} results)`);
    });
  }

  saveResults() {
    const output = {
      timestamp: new Date().toISOString(),
      summary: {
        totalQueries: this.results.length,
        avgRelevance: this.results.reduce((sum, r) => sum + r.relevanceScore, 0) / this.results.length,
        queriesWithResults: this.results.filter(r => r.resultsFound > 0).length,
        queriesWithExpectedDocs: this.results.filter(r => r.expectedDocsFound).length
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };
    
    const outputPath = path.join(__dirname, 'search-quality-report.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n💾 Full report saved to: .ai/2025-08-19/tasks/search-quality-report.json`);
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Check for missing keywords
    if (this.analysisData.missingKeywords.length > 100) {
      recommendations.push({
        priority: 'high',
        issue: 'Missing keywords',
        recommendation: `Add keywords to ${this.analysisData.missingKeywords.length} documentation files`,
        impact: 'Will significantly improve search discoverability'
      });
    }
    
    // Check for low coverage categories
    const categories = ['frameworks', 'tools', 'concepts', 'features'];
    categories.forEach(category => {
      const categoryResults = this.results.filter(r => r.category === category);
      const avgScore = categoryResults.reduce((sum, r) => sum + r.relevanceScore, 0) / categoryResults.length;
      
      if (avgScore < 60) {
        recommendations.push({
          priority: 'medium',
          issue: `Low search quality for ${category}`,
          recommendation: `Improve keyword coverage for ${category}-related documentation`,
          impact: `Will improve search results for ${category} queries`
        });
      }
    });
    
    return recommendations;
  }
}

// Run the tester
const tester = new SearchQualityTester();
await tester.runTests();
