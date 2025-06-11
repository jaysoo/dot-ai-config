#!/usr/bin/env node

/**
 * Generates AI-consumable update plans from feature-doc correlations
 */
class UpdatePlanGenerator {
  constructor() {
    this.confidenceThresholds = {
      high: 0.7,
      medium: 0.4,
      low: 0.2
    };
  }

  /**
   * Generate update plan markdown
   */
  generateUpdatePlan(correlations, featureAnalysis, docIndex) {
    const plan = [];
    
    // Header
    plan.push('# Documentation Update Plan');
    plan.push('');
    plan.push('## Analysis Summary');
    plan.push(`- **Analysis Date**: ${new Date().toISOString().split('T')[0]}`);
    plan.push(`- **Changes Since**: ${correlations.sinceRef}`);
    plan.push(`- **Features Changed**: ${correlations.totalFeatures}`);
    plan.push(`- **Documents Analyzed**: ${correlations.totalDocs}`);
    
    // Calculate affected docs
    const affectedDocs = new Set();
    correlations.correlations.forEach(c => {
      c.relevantDocs.forEach(d => affectedDocs.add(d.path));
    });
    plan.push(`- **Documents Potentially Affected**: ${affectedDocs.size}`);
    plan.push('');

    // Change summary
    plan.push('## Change Summary');
    const changeSummary = this.summarizeChanges(featureAnalysis);
    plan.push(`- **New Features**: ${changeSummary.new.length}`);
    plan.push(`- **Updated Features**: ${changeSummary.updated.length}`);
    plan.push(`- **Removed Features**: ${changeSummary.deleted.length}`);
    plan.push('');

    // High confidence updates
    plan.push('## High Priority Updates (Confidence > 70%)');
    plan.push('');
    this.addPrioritySection(plan, correlations, 'high');

    // Medium confidence updates
    plan.push('## Medium Priority Updates (Confidence 40-70%)');
    plan.push('');
    this.addPrioritySection(plan, correlations, 'medium');

    // Feature changes detail
    plan.push('## Feature Changes Detail');
    plan.push('');
    
    for (const correlation of correlations.correlations) {
      this.addFeatureSection(plan, correlation, featureAnalysis);
    }

    // AI instructions
    plan.push('## Instructions for AI');
    plan.push('');
    plan.push('When processing this update plan:');
    plan.push('');
    plan.push('1. **For High Priority Updates**: These are very likely to need documentation changes. Review the feature changes and update the corresponding documentation to reflect:');
    plan.push('   - New functionality or features');
    plan.push('   - Changed APIs or configuration options');
    plan.push('   - Updated examples or best practices');
    plan.push('   - Removal of deprecated features');
    plan.push('');
    plan.push('2. **For Medium Priority Updates**: These may need updates. Check if:');
    plan.push('   - The documentation references the changed packages');
    plan.push('   - Examples need to be updated');
    plan.push('   - New options or parameters should be documented');
    plan.push('');
    plan.push('3. **For Each Update**:');
    plan.push('   - Maintain the existing documentation style and format');
    plan.push('   - Update code examples to use the latest APIs');
    plan.push('   - Add new sections if new features require explanation');
    plan.push('   - Mark deprecated features clearly');
    plan.push('   - Ensure all links and references are still valid');
    plan.push('');
    plan.push('4. **Review Checklist**:');
    plan.push('   - [ ] All new features are documented');
    plan.push('   - [ ] All breaking changes are highlighted');
    plan.push('   - [ ] Code examples compile and run correctly');
    plan.push('   - [ ] Cross-references between docs are updated');
    plan.push('   - [ ] Version-specific information is accurate');

    return plan.join('\n');
  }

  /**
   * Summarize changes by type
   */
  summarizeChanges(featureAnalysis) {
    const summary = {
      new: [],
      updated: [],
      deleted: []
    };

    featureAnalysis.features.forEach(feature => {
      const item = {
        path: feature.filePath,
        title: feature.metadata.title || 'Untitled'
      };

      switch (feature.changeType) {
        case 'new':
          summary.new.push(item);
          break;
        case 'deleted':
          summary.deleted.push(item);
          break;
        default:
          summary.updated.push(item);
      }
    });

    return summary;
  }

  /**
   * Add priority section to plan
   */
  addPrioritySection(plan, correlations, priority) {
    const threshold = this.confidenceThresholds[priority];
    const nextThreshold = priority === 'high' ? 1.0 : 
                         priority === 'medium' ? this.confidenceThresholds.high :
                         this.confidenceThresholds.medium;

    const items = [];

    correlations.correlations.forEach(correlation => {
      correlation.relevantDocs.forEach(doc => {
        if (doc.score >= threshold && doc.score < nextThreshold) {
          items.push({
            feature: correlation.feature,
            doc: doc
          });
        }
      });
    });

    if (items.length === 0) {
      plan.push('*No updates in this category*');
      plan.push('');
      return;
    }

    // Group by document
    const byDoc = {};
    items.forEach(item => {
      if (!byDoc[item.doc.path]) {
        byDoc[item.doc.path] = [];
      }
      byDoc[item.doc.path].push(item);
    });

    // Output grouped by document
    Object.entries(byDoc).forEach(([docPath, docItems]) => {
      plan.push(`### 📄 ${docPath}`);
      plan.push('');
      
      // Show all features affecting this doc
      docItems.forEach(item => {
        plan.push(`- **Feature**: ${item.feature.title || item.feature.path}`);
        plan.push(`  - Change Type: ${item.feature.changeType}`);
        plan.push(`  - Confidence: ${Math.round(item.doc.score * 100)}%`);
        plan.push(`  - Correlation: ${item.doc.correlationFactors.join('; ')}`);
      });
      plan.push('');
    });
  }

  /**
   * Add detailed feature section
   */
  addFeatureSection(plan, correlation, featureAnalysis) {
    const feature = featureAnalysis.features.find(f => 
      f.filePath === correlation.feature.path
    );
    
    if (!feature) return;

    plan.push(`### ${correlation.feature.title || correlation.feature.path}`);
    plan.push('');
    plan.push(`- **File**: ${correlation.feature.path}`);
    plan.push(`- **Change Type**: ${correlation.feature.changeType}`);
    plan.push(`- **Status**: ${correlation.feature.status}`);
    
    if (feature.metadata.affectedPackages?.length > 0) {
      plan.push(`- **Affected Packages**: ${feature.metadata.affectedPackages.join(', ')}`);
    }

    if (feature.metadata.overview) {
      plan.push('');
      plan.push('**Overview**:');
      plan.push(`> ${feature.metadata.overview.replace(/\n/g, '\n> ')}`);
    }

    if (feature.contentChanges && feature.contentChanges.length > 0) {
      plan.push('');
      plan.push('**Key Changes**:');
      feature.contentChanges.forEach(change => {
        switch (change.type) {
          case 'status_change':
            plan.push(`- Status changed to: ${change.newStatus}`);
            break;
          case 'section_added':
            plan.push(`- New section added: ${change.section}`);
            break;
          case 'section_removed':
            plan.push(`- Section removed: ${change.section}`);
            break;
          case 'package_reference_added':
            plan.push(`- New package reference: ${change.package}`);
            break;
        }
      });
    }

    if (correlation.relevantDocs.length > 0) {
      plan.push('');
      plan.push('**Potentially Affected Documentation**:');
      plan.push('');
      
      correlation.relevantDocs.slice(0, 5).forEach(doc => {
        const confidence = Math.round(doc.score * 100);
        const confidenceEmoji = confidence >= 70 ? '🔴' : confidence >= 40 ? '🟡' : '🟢';
        plan.push(`${confidenceEmoji} **${doc.path}** (${confidence}% confidence)`);
        plan.push(`   - ${doc.title}`);
        plan.push(`   - Correlation: ${doc.correlationFactors.join('; ')}`);
        plan.push('');
      });
    }

    plan.push('---');
    plan.push('');
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error('Usage: node generate-update-plan.mjs <correlations.json> <feature-analysis.json> <doc-index.json>');
    console.error('Example: node generate-update-plan.mjs corr.json features.json docs.json');
    process.exit(1);
  }

  const [correlationsFile, featuresFile, docsFile] = args;
  
  try {
    const { readFileSync } = await import('fs');
    const correlations = JSON.parse(readFileSync(correlationsFile, 'utf8'));
    const featureAnalysis = JSON.parse(readFileSync(featuresFile, 'utf8'));
    const docIndex = JSON.parse(readFileSync(docsFile, 'utf8'));
    
    const generator = new UpdatePlanGenerator();
    const plan = generator.generateUpdatePlan(correlations, featureAnalysis, docIndex);
    
    console.log(plan);
  } catch (error) {
    console.error('Error generating update plan:', error);
    process.exit(1);
  }
}

export { UpdatePlanGenerator };