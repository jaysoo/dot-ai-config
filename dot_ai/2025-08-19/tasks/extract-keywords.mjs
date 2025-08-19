#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = '/Users/jack/projects/nx-worktrees/DOC-121';

class KeywordExtractor {
  constructor() {
    this.keywords = new Map();
    this.fileKeywords = new Map();
    this.missingKeywords = [];
  }

  async extractKeywords() {
    console.log('🔍 Extracting keywords from documentation files...\n');
    
    const docPatterns = [
      'docs/**/*.md',
      'nx-dev/**/*.md'
    ];

    for (const pattern of docPatterns) {
      const files = await glob(pattern, { cwd: projectRoot });
      console.log(`Found ${files.length} files matching ${pattern}`);
      
      for (const file of files) {
        await this.processFile(path.join(projectRoot, file));
      }
    }

    this.analyzeResults();
  }

  async processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: markdown } = matter(content);
      
      const relativePath = path.relative(projectRoot, filePath);
      
      if (data.keywords && Array.isArray(data.keywords)) {
        this.fileKeywords.set(relativePath, data.keywords);
        
        data.keywords.forEach(keyword => {
          if (!this.keywords.has(keyword)) {
            this.keywords.set(keyword, []);
          }
          this.keywords.get(keyword).push(relativePath);
        });
      } else if (this.shouldHaveKeywords(relativePath, data, markdown)) {
        this.missingKeywords.push({
          file: relativePath,
          title: data.title || 'No title',
          description: data.description || 'No description'
        });
      }
    } catch (error) {
      // Silently skip files that can't be processed
    }
  }

  shouldHaveKeywords(filePath, frontmatter, content) {
    // Important documentation that should have keywords
    const importantPaths = [
      '/packages/',
      '/concepts/',
      '/getting-started/',
      '/guides/',
      '/recipes/',
      '/reference/'
    ];
    
    // Check if it's an important document
    const isImportant = importantPaths.some(path => filePath.includes(path));
    
    // Check if it has substantial content
    const hasSubstantialContent = content.length > 500;
    
    // Check if it has a title (indicating it's a real doc)
    const hasTitle = !!frontmatter.title;
    
    return isImportant && hasSubstantialContent && hasTitle;
  }

  analyzeResults() {
    console.log('\n📊 Keyword Analysis Results\n');
    console.log('='.repeat(50));
    
    // Sort keywords by frequency
    const sortedKeywords = Array.from(this.keywords.entries())
      .sort((a, b) => b[1].length - a[1].length);
    
    console.log('\n🏷️  Top Keywords by Frequency:\n');
    sortedKeywords.slice(0, 20).forEach(([keyword, files]) => {
      console.log(`  ${keyword.padEnd(20)} - ${files.length} files`);
    });
    
    console.log('\n📈 Keyword Statistics:\n');
    console.log(`  Total unique keywords: ${this.keywords.size}`);
    console.log(`  Total files with keywords: ${this.fileKeywords.size}`);
    console.log(`  Files missing keywords: ${this.missingKeywords.length}`);
    
    if (this.missingKeywords.length > 0) {
      console.log('\n⚠️  Important Files Missing Keywords:\n');
      this.missingKeywords.slice(0, 10).forEach(({ file, title }) => {
        console.log(`  - ${file}`);
        console.log(`    Title: ${title}`);
      });
      
      if (this.missingKeywords.length > 10) {
        console.log(`  ... and ${this.missingKeywords.length - 10} more files`);
      }
    }
    
    // Analyze keyword categories
    this.analyzeKeywordCategories(sortedKeywords);
    
    // Save results to file
    this.saveResults();
  }

  analyzeKeywordCategories(sortedKeywords) {
    const categories = {
      frameworks: ['angular', 'react', 'vue', 'next', 'nest', 'express', 'node'],
      tools: ['webpack', 'vite', 'esbuild', 'rollup', 'jest', 'cypress', 'playwright', 'storybook'],
      concepts: ['monorepo', 'workspace', 'library', 'application', 'generator', 'executor', 'plugin'],
      features: ['build', 'test', 'lint', 'serve', 'deploy', 'cache', 'graph', 'affected'],
      getting_started: ['tutorial', 'quickstart', 'setup', 'installation', 'configuration']
    };
    
    console.log('\n🗂️  Keyword Categories:\n');
    
    Object.entries(categories).forEach(([category, categoryKeywords]) => {
      const found = categoryKeywords.filter(k => this.keywords.has(k));
      const missing = categoryKeywords.filter(k => !this.keywords.has(k));
      
      console.log(`  ${category.toUpperCase()}:`);
      if (found.length > 0) {
        console.log(`    ✅ Found: ${found.join(', ')}`);
      }
      if (missing.length > 0) {
        console.log(`    ❌ Missing: ${missing.join(', ')}`);
      }
    });
  }

  saveResults() {
    const results = {
      timestamp: new Date().toISOString(),
      statistics: {
        totalKeywords: this.keywords.size,
        filesWithKeywords: this.fileKeywords.size,
        filesMissingKeywords: this.missingKeywords.length
      },
      keywords: Object.fromEntries(
        Array.from(this.keywords.entries())
          .sort((a, b) => b[1].length - a[1].length)
      ),
      fileKeywords: Object.fromEntries(this.fileKeywords),
      missingKeywords: this.missingKeywords
    };
    
    const outputPath = path.join(__dirname, 'keyword-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Full results saved to: .ai/2025-08-19/tasks/keyword-analysis.json`);
  }
}

// Run the extractor
const extractor = new KeywordExtractor();
await extractor.extractKeywords();
