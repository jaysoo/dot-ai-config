#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join, relative } from 'path';

/**
 * Analyzes feature changes in the repository since a given SHA
 */
class FeatureChangeAnalyzer {
  constructor(basePath = '.', featureDir = 'features') {
    this.basePath = basePath;
    this.featureDir = featureDir;
    this.featuresPath = join(basePath, featureDir);
  }

  /**
   * Get list of changed feature files since a given SHA
   */
  getChangedFiles(sinceRef) {
    try {
      const cmd = `git diff --name-status ${sinceRef}..HEAD -- ${this.featureDir}/`;
      const output = execSync(cmd, { cwd: this.basePath, encoding: 'utf8' });
      
      if (!output.trim()) {
        return [];
      }

      return output.trim().split('\n').map(line => {
        const [status, ...pathParts] = line.split('\t');
        const filePath = pathParts.join('\t'); // Handle filenames with tabs
        return { status, filePath };
      });
    } catch (error) {
      console.error('Error getting changed files:', error.message);
      return [];
    }
  }

  /**
   * Parse feature metadata from markdown content
   */
  parseFeatureMetadata(content) {
    const metadata = {
      status: 'unknown',
      developers: [],
      category: 'unknown',
      affectedPackages: [],
      title: '',
      overview: ''
    };

    // Extract title (first H1)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract status
    const statusMatch = content.match(/\*\*Status\*\*:\s*(\S+)/i);
    if (statusMatch) {
      metadata.status = statusMatch[1].toLowerCase();
    }

    // Extract developers
    const devMatch = content.match(/\*\*Developers?\*\*:\s*(.+)/i);
    if (devMatch) {
      metadata.developers = devMatch[1].split(',').map(d => d.trim());
    }

    // Extract category
    const categoryMatch = content.match(/\*\*Category\*\*:\s*(\S+)/i);
    if (categoryMatch) {
      metadata.category = categoryMatch[1];
    }

    // Extract overview (content between Overview header and next header)
    const overviewMatch = content.match(/##\s+Overview\s*\n+([^#]+)/i);
    if (overviewMatch) {
      metadata.overview = overviewMatch[1].trim();
    }

    // Extract affected packages from relevant files section
    const relevantFilesMatch = content.match(/##\s+Relevant Files[^\n]*\n+([\s\S]+?)(?=\n##|$)/i);
    if (relevantFilesMatch) {
      const packageMatches = relevantFilesMatch[1].matchAll(/packages\/([^\/\s]+)/g);
      metadata.affectedPackages = [...new Set([...packageMatches].map(m => m[1]))];
    }

    return metadata;
  }

  /**
   * Get detailed changes for a feature file
   */
  async getFeatureChanges(filePath, sinceRef) {
    const fullPath = join(this.basePath, filePath);
    const changes = {
      filePath,
      changeType: 'modified',
      metadata: {},
      contentChanges: [],
      diffStats: {}
    };

    // Check if file exists (might be deleted)
    if (!existsSync(fullPath)) {
      changes.changeType = 'deleted';
      // Try to get content from git history
      try {
        const oldContent = execSync(`git show ${sinceRef}:${filePath}`, { 
          cwd: this.basePath, 
          encoding: 'utf8' 
        });
        changes.metadata = this.parseFeatureMetadata(oldContent);
      } catch (e) {
        // File might be new
      }
      return changes;
    }

    // Get current content
    const currentContent = readFileSync(fullPath, 'utf8');
    changes.metadata = this.parseFeatureMetadata(currentContent);

    // Check if file is new
    try {
      execSync(`git cat-file -e ${sinceRef}:${filePath}`, { cwd: this.basePath });
    } catch (e) {
      changes.changeType = 'new';
      return changes;
    }

    // Get diff details
    try {
      const diffOutput = execSync(`git diff ${sinceRef}..HEAD -- ${filePath}`, {
        cwd: this.basePath,
        encoding: 'utf8'
      });

      // Parse diff for semantic changes
      changes.contentChanges = this.parseDiffForSemanticChanges(diffOutput);
      
      // Get diff stats
      const statOutput = execSync(`git diff --numstat ${sinceRef}..HEAD -- ${filePath}`, {
        cwd: this.basePath,
        encoding: 'utf8'
      });
      
      if (statOutput.trim()) {
        const [additions, deletions] = statOutput.trim().split('\t');
        changes.diffStats = { 
          additions: parseInt(additions), 
          deletions: parseInt(deletions) 
        };
      }
    } catch (e) {
      console.error('Error getting diff details:', e.message);
    }

    return changes;
  }

  /**
   * Parse diff output for semantic changes
   */
  parseDiffForSemanticChanges(diffOutput) {
    const changes = [];
    const lines = diffOutput.split('\n');
    let currentSection = null;

    for (const line of lines) {
      // Detect section headers in changes
      if (line.startsWith('+++') || line.startsWith('---')) continue;
      
      if (line.startsWith('+## ')) {
        const section = line.substring(4).trim();
        changes.push({ type: 'section_added', section });
        currentSection = section;
      } else if (line.startsWith('-## ')) {
        const section = line.substring(4).trim();
        changes.push({ type: 'section_removed', section });
      } else if (line.startsWith('+') && currentSection) {
        // Track significant additions
        if (line.includes('**Status**:')) {
          const status = line.match(/\*\*Status\*\*:\s*(\S+)/)?.[1];
          if (status) {
            changes.push({ type: 'status_change', newStatus: status });
          }
        } else if (line.includes('packages/')) {
          const packageMatch = line.match(/packages\/([^\/\s]+)/);
          if (packageMatch) {
            changes.push({ type: 'package_reference_added', package: packageMatch[1] });
          }
        }
      }
    }

    return changes;
  }

  /**
   * Analyze all feature changes since a given ref
   */
  async analyzeChanges(sinceRef) {
    const changedFiles = this.getChangedFiles(sinceRef);
    const analysis = {
      sinceRef,
      timestamp: new Date().toISOString(),
      summary: {
        totalChanges: changedFiles.length,
        newFeatures: 0,
        updatedFeatures: 0,
        deletedFeatures: 0
      },
      features: []
    };

    for (const { status, filePath } of changedFiles) {
      // Only process markdown files
      if (!filePath.endsWith('.md')) continue;

      const featureChanges = await this.getFeatureChanges(filePath, sinceRef);
      
      // Update summary
      switch (featureChanges.changeType) {
        case 'new':
          analysis.summary.newFeatures++;
          break;
        case 'deleted':
          analysis.summary.deletedFeatures++;
          break;
        default:
          analysis.summary.updatedFeatures++;
      }

      analysis.features.push(featureChanges);
    }

    return analysis;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node analyze-feature-changes.mjs <since-ref> [base-path]');
    console.error('Example: node analyze-feature-changes.mjs abc123 .');
    process.exit(1);
  }

  const [sinceRef, basePath = '.'] = args;
  const analyzer = new FeatureChangeAnalyzer(basePath);
  
  analyzer.analyzeChanges(sinceRef)
    .then(analysis => {
      console.log(JSON.stringify(analysis, null, 2));
    })
    .catch(error => {
      console.error('Error analyzing changes:', error);
      process.exit(1);
    });
}

export { FeatureChangeAnalyzer };