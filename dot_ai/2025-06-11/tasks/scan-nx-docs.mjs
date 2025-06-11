#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, basename } from 'path';

/**
 * Scans and indexes documentation in the nx repository
 */
class NxDocumentationScanner {
  constructor(nxRepoPath) {
    this.nxRepoPath = nxRepoPath;
    this.docsPath = join(nxRepoPath, 'docs');
    this.docIndex = [];
  }

  /**
   * Recursively scan directory for markdown files
   */
  scanDirectory(dirPath, baseDir = this.docsPath) {
    const files = [];
    
    try {
      const entries = readdirSync(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip common non-doc directories
          if (['node_modules', '.git', 'dist', 'tmp'].includes(entry)) continue;
          files.push(...this.scanDirectory(fullPath, baseDir));
        } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
          files.push({
            path: fullPath,
            relativePath: relative(baseDir, fullPath)
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
    
    return files;
  }

  /**
   * Parse document metadata and content
   */
  parseDocument(filePath) {
    try {
      const content = readFileSync(filePath, 'utf8');
      const doc = {
        path: filePath,
        relativePath: relative(this.docsPath, filePath),
        title: '',
        sections: [],
        keywords: new Set(),
        packageReferences: new Set(),
        codeExamples: [],
        frontmatter: {}
      };

      // Parse frontmatter if exists
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);
      if (frontmatterMatch) {
        try {
          // Simple frontmatter parsing (key: value)
          frontmatterMatch[1].split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
              doc.frontmatter[key.trim()] = valueParts.join(':').trim();
            }
          });
        } catch (e) {
          console.error('Error parsing frontmatter:', e.message);
        }
      }

      // Extract title (first H1 or frontmatter title)
      doc.title = doc.frontmatter.title || '';
      const h1Match = content.match(/^#\s+(.+)$/m);
      if (h1Match && !doc.title) {
        doc.title = h1Match[1].trim();
      }

      // Extract sections (H2 headers)
      const h2Matches = content.matchAll(/^##\s+(.+)$/gm);
      for (const match of h2Matches) {
        doc.sections.push(match[1].trim());
      }

      // Extract package references
      const packageMatches = content.matchAll(/@nx\/([a-z0-9-]+)/g);
      for (const match of packageMatches) {
        doc.packageReferences.add(match[1]);
      }

      // Also look for packages/ references
      const packagePathMatches = content.matchAll(/packages\/([a-z0-9-]+)/g);
      for (const match of packagePathMatches) {
        doc.packageReferences.add(match[1]);
      }

      // Extract code blocks for language detection
      const codeBlockMatches = content.matchAll(/```(\w+)?\n([\s\S]+?)```/g);
      for (const match of codeBlockMatches) {
        if (match[1]) {
          doc.codeExamples.push({
            language: match[1],
            hasCode: true
          });
        }
      }

      // Extract keywords from content (simple approach)
      const words = content.toLowerCase()
        .replace(/```[\s\S]+?```/g, '') // Remove code blocks
        .replace(/[^a-z0-9\s-]/g, ' ')  // Keep alphanumeric and hyphens
        .split(/\s+/)
        .filter(word => word.length > 3); // Filter short words

      // Common Nx-related keywords to track
      const nxKeywords = [
        'workspace', 'monorepo', 'generator', 'executor', 'plugin',
        'target', 'build', 'serve', 'test', 'lint', 'e2e',
        'angular', 'react', 'vue', 'node', 'express', 'nest',
        'storybook', 'cypress', 'jest', 'eslint', 'prettier',
        'docker', 'kubernetes', 'ci', 'cd', 'github', 'jenkins',
        'cache', 'affected', 'dependency', 'graph', 'migration'
      ];

      words.forEach(word => {
        if (nxKeywords.includes(word)) {
          doc.keywords.add(word);
        }
      });

      // Convert sets to arrays for JSON serialization
      doc.keywords = Array.from(doc.keywords);
      doc.packageReferences = Array.from(doc.packageReferences);

      return doc;
    } catch (error) {
      console.error(`Error parsing document ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Build searchable index of all documentation
   */
  async buildIndex() {
    console.error('Scanning documentation files...');
    const docFiles = this.scanDirectory(this.docsPath);
    
    console.error(`Found ${docFiles.length} documentation files`);
    
    for (const { path, relativePath } of docFiles) {
      const doc = this.parseDocument(path);
      if (doc) {
        this.docIndex.push(doc);
      }
    }

    // Build additional indexes for faster lookup
    const index = {
      totalDocs: this.docIndex.length,
      timestamp: new Date().toISOString(),
      documents: this.docIndex,
      packageIndex: this.buildPackageIndex(),
      keywordIndex: this.buildKeywordIndex(),
      pathIndex: this.buildPathIndex()
    };

    return index;
  }

  /**
   * Build package-to-docs index
   */
  buildPackageIndex() {
    const packageIndex = {};
    
    for (const doc of this.docIndex) {
      for (const pkg of doc.packageReferences) {
        if (!packageIndex[pkg]) {
          packageIndex[pkg] = [];
        }
        packageIndex[pkg].push({
          path: doc.relativePath,
          title: doc.title
        });
      }
    }
    
    return packageIndex;
  }

  /**
   * Build keyword-to-docs index
   */
  buildKeywordIndex() {
    const keywordIndex = {};
    
    for (const doc of this.docIndex) {
      for (const keyword of doc.keywords) {
        if (!keywordIndex[keyword]) {
          keywordIndex[keyword] = [];
        }
        keywordIndex[keyword].push({
          path: doc.relativePath,
          title: doc.title
        });
      }
    }
    
    return keywordIndex;
  }

  /**
   * Build path pattern index for categorization
   */
  buildPathIndex() {
    const pathIndex = {
      byCategory: {},
      byDepth: {}
    };

    for (const doc of this.docIndex) {
      // Categorize by top-level directory
      const pathParts = doc.relativePath.split('/');
      const category = pathParts[0] || 'root';
      
      if (!pathIndex.byCategory[category]) {
        pathIndex.byCategory[category] = [];
      }
      pathIndex.byCategory[category].push({
        path: doc.relativePath,
        title: doc.title
      });

      // Categorize by depth
      const depth = pathParts.length - 1;
      if (!pathIndex.byDepth[depth]) {
        pathIndex.byDepth[depth] = [];
      }
      pathIndex.byDepth[depth].push({
        path: doc.relativePath,
        title: doc.title
      });
    }

    return pathIndex;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node scan-nx-docs.mjs <nx-repo-path>');
    console.error('Example: node scan-nx-docs.mjs ../nx');
    process.exit(1);
  }

  const [nxRepoPath] = args;
  const scanner = new NxDocumentationScanner(nxRepoPath);
  
  scanner.buildIndex()
    .then(index => {
      console.log(JSON.stringify(index, null, 2));
    })
    .catch(error => {
      console.error('Error building index:', error);
      process.exit(1);
    });
}

export { NxDocumentationScanner };