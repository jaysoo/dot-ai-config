#!/usr/bin/env node

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { execSync } from 'child_process';
import { FeatureChangeAnalyzer } from './analyze-feature-changes.mjs';
import { NxDocumentationScanner } from './scan-nx-docs.mjs';
import { FeatureDocCorrelator } from './correlate-features-docs.mjs';
import { UpdatePlanGenerator } from './generate-update-plan.mjs';

/**
 * Main CLI tool for correlating feature changes with documentation updates
 */
class DocsCorrelationTool {
  constructor(options) {
    this.options = {
      since: options.since,
      nxPath: resolve(options.nxPath || '../nx'),
      rawDocsPath: options.rawDocsPath || '.',
      output: options.output || `update-plan-${Date.now()}.md`,
      verbose: options.verbose || false,
      saveIntermediateFiles: options.saveIntermediateFiles || false
    };

    this.tempDir = join(this.options.rawDocsPath, '.ai', 'temp');
  }

  log(message, level = 'info') {
    if (level === 'error') {
      console.error(`❌ ${message}`);
    } else if (level === 'success') {
      console.error(`✅ ${message}`);
    } else if (level === 'verbose' && this.options.verbose) {
      console.error(`📝 ${message}`);
    } else if (level === 'info') {
      console.error(`ℹ️  ${message}`);
    }
  }

  /**
   * Validate inputs and environment
   */
  async validate() {
    // Check if git repo
    try {
      execSync('git rev-parse --git-dir', { cwd: this.options.rawDocsPath });
    } catch (e) {
      throw new Error('Not a git repository. Please run from within the raw-docs repository.');
    }

    // Validate SHA
    try {
      execSync(`git cat-file -e ${this.options.since}`, { cwd: this.options.rawDocsPath });
    } catch (e) {
      throw new Error(`Invalid git reference: ${this.options.since}`);
    }

    // Check nx repo exists
    if (!existsSync(this.options.nxPath)) {
      throw new Error(`Nx repository not found at: ${this.options.nxPath}`);
    }

    const nxDocsPath = join(this.options.nxPath, 'docs');
    if (!existsSync(nxDocsPath)) {
      throw new Error(`Nx docs directory not found at: ${nxDocsPath}`);
    }

    this.log('Validation passed', 'success');
  }

  /**
   * Run the complete correlation workflow
   */
  async run() {
    try {
      await this.validate();

      // Create temp directory for intermediate files
      if (this.options.saveIntermediateFiles) {
        mkdirSync(this.tempDir, { recursive: true });
      }

      // Step 1: Analyze feature changes
      this.log('Analyzing feature changes...');
      const featureAnalysis = await this.analyzeFeatures();
      
      if (featureAnalysis.features.length === 0) {
        this.log('No feature changes found since the specified commit.', 'info');
        return;
      }

      this.log(`Found ${featureAnalysis.features.length} feature changes`, 'success');

      // Step 2: Scan nx documentation
      this.log('Scanning Nx documentation...');
      const docIndex = await this.scanDocs();
      this.log(`Indexed ${docIndex.documents.length} documentation files`, 'success');

      // Step 3: Correlate features with docs
      this.log('Correlating features with documentation...');
      const correlations = await this.correlateFeaturesDocs(featureAnalysis, docIndex);
      
      const affectedDocCount = this.countAffectedDocs(correlations);
      this.log(`Found ${affectedDocCount} potentially affected documents`, 'success');

      // Step 4: Generate update plan
      this.log('Generating update plan...');
      const updatePlan = await this.generatePlan(correlations, featureAnalysis, docIndex);
      
      // Write output
      const outputPath = resolve(this.options.output);
      writeFileSync(outputPath, updatePlan);
      this.log(`Update plan written to: ${outputPath}`, 'success');

      // Summary
      this.printSummary(featureAnalysis, correlations);

    } catch (error) {
      this.log(error.message, 'error');
      process.exit(1);
    }
  }

  /**
   * Analyze feature changes
   */
  async analyzeFeatures() {
    const analyzer = new FeatureChangeAnalyzer(this.options.rawDocsPath);
    const analysis = await analyzer.analyzeChanges(this.options.since);

    if (this.options.saveIntermediateFiles) {
      const path = join(this.tempDir, 'feature-analysis.json');
      writeFileSync(path, JSON.stringify(analysis, null, 2));
      this.log(`Feature analysis saved to: ${path}`, 'verbose');
    }

    return analysis;
  }

  /**
   * Scan documentation
   */
  async scanDocs() {
    const scanner = new NxDocumentationScanner(this.options.nxPath);
    const index = await scanner.buildIndex();

    if (this.options.saveIntermediateFiles) {
      const path = join(this.tempDir, 'doc-index.json');
      writeFileSync(path, JSON.stringify(index, null, 2));
      this.log(`Documentation index saved to: ${path}`, 'verbose');
    }

    return index;
  }

  /**
   * Correlate features with docs
   */
  async correlateFeaturesDocs(featureAnalysis, docIndex) {
    const correlator = new FeatureDocCorrelator();
    const correlations = correlator.correlateFeatures(featureAnalysis, docIndex);

    if (this.options.saveIntermediateFiles) {
      const path = join(this.tempDir, 'correlations.json');
      writeFileSync(path, JSON.stringify(correlations, null, 2));
      this.log(`Correlations saved to: ${path}`, 'verbose');
    }

    return correlations;
  }

  /**
   * Generate update plan
   */
  async generatePlan(correlations, featureAnalysis, docIndex) {
    const generator = new UpdatePlanGenerator();
    return generator.generateUpdatePlan(correlations, featureAnalysis, docIndex);
  }

  /**
   * Count affected documents
   */
  countAffectedDocs(correlations) {
    const docs = new Set();
    correlations.correlations.forEach(c => {
      c.relevantDocs.forEach(d => docs.add(d.path));
    });
    return docs.size;
  }

  /**
   * Print summary
   */
  printSummary(featureAnalysis, correlations) {
    console.error('\n📊 Summary:');
    console.error('─'.repeat(50));
    console.error(`Features analyzed: ${featureAnalysis.features.length}`);
    console.error(`  - New: ${featureAnalysis.summary.newFeatures}`);
    console.error(`  - Updated: ${featureAnalysis.summary.updatedFeatures}`);
    console.error(`  - Deleted: ${featureAnalysis.summary.deletedFeatures}`);
    
    const highPriority = this.countByPriority(correlations, 0.7);
    const mediumPriority = this.countByPriority(correlations, 0.4) - highPriority;
    
    console.error(`\nDocumentation updates needed:`);
    console.error(`  - High priority: ${highPriority} docs`);
    console.error(`  - Medium priority: ${mediumPriority} docs`);
    console.error('─'.repeat(50));
  }

  /**
   * Count documents by priority threshold
   */
  countByPriority(correlations, threshold) {
    const docs = new Set();
    correlations.correlations.forEach(c => {
      c.relevantDocs.forEach(d => {
        if (d.score >= threshold) {
          docs.add(d.path);
        }
      });
    });
    return docs.size;
  }
}

/**
 * Parse CLI arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    since: null,
    nxPath: '../nx',
    output: null,
    verbose: false,
    saveIntermediateFiles: false,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--since':
      case '-s':
        options.since = args[++i];
        break;
      case '--nx-path':
      case '-n':
        options.nxPath = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--save-intermediate':
        options.saveIntermediateFiles = true;
        break;
      default:
        if (!arg.startsWith('-') && !options.since) {
          options.since = arg;
        }
    }
  }

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Documentation Correlation Tool

Analyzes feature changes and correlates them with documentation that needs updates.

Usage:
  node docs-correlation-tool.mjs [options] <since-ref>

Arguments:
  since-ref         Git reference (SHA, tag, or branch) to compare against

Options:
  -h, --help                Show this help message
  -n, --nx-path <path>      Path to nx repository (default: ../nx)
  -o, --output <file>       Output file for update plan (default: update-plan-[timestamp].md)
  -v, --verbose             Show detailed progress information
  --save-intermediate       Save intermediate JSON files for debugging

Examples:
  # Analyze changes since a specific commit
  node docs-correlation-tool.mjs abc123def

  # Analyze changes with custom nx path
  node docs-correlation-tool.mjs --nx-path ~/projects/nx main

  # Save output to specific file with verbose logging
  node docs-correlation-tool.mjs -v -o updates.md HEAD~10

  # Save all intermediate files for debugging
  node docs-correlation-tool.mjs --save-intermediate abc123
`);
}

// Main entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArgs();
  
  if (options.help || !options.since) {
    showHelp();
    process.exit(options.help ? 0 : 1);
  }

  const tool = new DocsCorrelationTool(options);
  tool.run();
}