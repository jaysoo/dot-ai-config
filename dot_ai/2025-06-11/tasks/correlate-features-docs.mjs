#!/usr/bin/env node

/**
 * Correlates feature changes with relevant documentation
 */
class FeatureDocCorrelator {
  constructor() {
    this.correlationStrategies = [
      this.correlateByPackage.bind(this),
      this.correlateByKeywords.bind(this),
      this.correlateByPath.bind(this),
      this.correlateByContent.bind(this)
    ];
  }

  /**
   * Calculate correlation score between a feature and a document
   */
  calculateCorrelation(feature, doc, docIndex) {
    const scores = [];
    
    // Apply each correlation strategy
    for (const strategy of this.correlationStrategies) {
      const score = strategy(feature, doc, docIndex);
      if (score > 0) {
        scores.push(score);
      }
    }

    // Combine scores (weighted average)
    if (scores.length === 0) return 0;
    
    const weights = [0.4, 0.3, 0.2, 0.1]; // Package > Keywords > Path > Content
    let totalScore = 0;
    let totalWeight = 0;
    
    scores.forEach((score, index) => {
      const weight = weights[index] || 0.1;
      totalScore += score * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  /**
   * Strategy 1: Correlate by package references
   */
  correlateByPackage(feature, doc, docIndex) {
    if (!feature.metadata.affectedPackages || feature.metadata.affectedPackages.length === 0) {
      return 0;
    }

    const featurePackages = new Set(feature.metadata.affectedPackages);
    const docPackages = new Set(doc.packageReferences || []);
    
    // Calculate Jaccard similarity
    const intersection = [...featurePackages].filter(pkg => docPackages.has(pkg));
    const union = new Set([...featurePackages, ...docPackages]);
    
    if (union.size === 0) return 0;
    
    const similarity = intersection.length / union.size;
    
    // Boost score if exact package match
    const hasExactMatch = intersection.length > 0;
    return hasExactMatch ? Math.min(similarity + 0.3, 1.0) : similarity;
  }

  /**
   * Strategy 2: Correlate by keywords
   */
  correlateByKeywords(feature, doc, docIndex) {
    // Extract keywords from feature
    const featureKeywords = this.extractKeywords(feature);
    const docKeywords = new Set(doc.keywords || []);
    
    if (featureKeywords.size === 0 || docKeywords.size === 0) {
      return 0;
    }

    // Calculate overlap
    const intersection = [...featureKeywords].filter(kw => docKeywords.has(kw));
    const maxPossible = Math.min(featureKeywords.size, docKeywords.size);
    
    return maxPossible > 0 ? intersection.length / maxPossible : 0;
  }

  /**
   * Strategy 3: Correlate by file path patterns
   */
  correlateByPath(feature, doc, docIndex) {
    const featureName = this.extractFeatureName(feature.filePath);
    const docPath = doc.relativePath.toLowerCase();
    
    // Check for direct name matches
    if (docPath.includes(featureName)) {
      return 0.8;
    }

    // Check for category matches
    const featureCategory = feature.metadata.category?.toLowerCase();
    if (featureCategory && docPath.includes(featureCategory)) {
      return 0.4;
    }

    // Check for related path segments
    const featureSegments = featureName.split('-');
    const matchingSegments = featureSegments.filter(seg => 
      seg.length > 3 && docPath.includes(seg)
    );
    
    return matchingSegments.length / featureSegments.length * 0.5;
  }

  /**
   * Strategy 4: Correlate by content similarity
   */
  correlateByContent(feature, doc, docIndex) {
    // Look for feature title/name mentions in doc
    const featureTitle = feature.metadata.title?.toLowerCase() || '';
    const docTitle = doc.title?.toLowerCase() || '';
    const docSections = (doc.sections || []).map(s => s.toLowerCase());
    
    let score = 0;

    // Title similarity
    if (featureTitle && docTitle) {
      if (docTitle.includes(featureTitle) || featureTitle.includes(docTitle)) {
        score += 0.5;
      }
    }

    // Check if feature is mentioned in sections
    const featureName = this.extractFeatureName(feature.filePath);
    const mentionedInSections = docSections.some(section => 
      section.includes(featureName) || section.includes(featureTitle)
    );
    
    if (mentionedInSections) {
      score += 0.3;
    }

    // Check for status changes that might need doc updates
    if (feature.contentChanges) {
      const hasStatusChange = feature.contentChanges.some(change => 
        change.type === 'status_change' && change.newStatus === 'shipped'
      );
      if (hasStatusChange) {
        score += 0.2; // Shipped features likely need doc updates
      }
    }

    return Math.min(score, 1.0);
  }

  /**
   * Extract keywords from feature data
   */
  extractKeywords(feature) {
    const keywords = new Set();
    
    // From title
    if (feature.metadata.title) {
      const titleWords = feature.metadata.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3);
      titleWords.forEach(w => keywords.add(w));
    }

    // From overview
    if (feature.metadata.overview) {
      const overviewWords = feature.metadata.overview.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 4);
      
      // Common Nx keywords to look for
      const nxKeywords = ['generator', 'executor', 'plugin', 'workspace', 'migration'];
      overviewWords.forEach(w => {
        if (nxKeywords.includes(w)) {
          keywords.add(w);
        }
      });
    }

    // From affected packages
    (feature.metadata.affectedPackages || []).forEach(pkg => {
      keywords.add(pkg);
    });

    return keywords;
  }

  /**
   * Extract feature name from file path
   */
  extractFeatureName(filePath) {
    // Handle nested feature structure
    const parts = filePath.split('/');
    const featurePart = parts.find(p => p !== 'features' && !p.endsWith('.md'));
    return (featurePart || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  }

  /**
   * Correlate all features with all docs
   */
  correlateFeatures(featureAnalysis, docIndex) {
    const correlations = {
      timestamp: new Date().toISOString(),
      sinceRef: featureAnalysis.sinceRef,
      totalFeatures: featureAnalysis.features.length,
      totalDocs: docIndex.documents.length,
      correlations: []
    };

    for (const feature of featureAnalysis.features) {
      const featureCorrelations = {
        feature: {
          path: feature.filePath,
          title: feature.metadata.title,
          changeType: feature.changeType,
          status: feature.metadata.status
        },
        relevantDocs: []
      };

      // Calculate correlation with each doc
      for (const doc of docIndex.documents) {
        const score = this.calculateCorrelation(feature, doc, docIndex);
        
        if (score > 0.1) { // Threshold for relevance
          featureCorrelations.relevantDocs.push({
            path: doc.relativePath,
            title: doc.title,
            score: parseFloat(score.toFixed(3)),
            correlationFactors: this.getCorrelationFactors(feature, doc)
          });
        }
      }

      // Sort by score
      featureCorrelations.relevantDocs.sort((a, b) => b.score - a.score);
      
      // Keep top 10 most relevant
      featureCorrelations.relevantDocs = featureCorrelations.relevantDocs.slice(0, 10);
      
      correlations.correlations.push(featureCorrelations);
    }

    return correlations;
  }

  /**
   * Get human-readable correlation factors
   */
  getCorrelationFactors(feature, doc) {
    const factors = [];
    
    // Check package matches
    const featurePackages = new Set(feature.metadata.affectedPackages || []);
    const docPackages = new Set(doc.packageReferences || []);
    const packageMatches = [...featurePackages].filter(pkg => docPackages.has(pkg));
    
    if (packageMatches.length > 0) {
      factors.push(`Package match: ${packageMatches.join(', ')}`);
    }

    // Check path correlation
    const featureName = this.extractFeatureName(feature.filePath);
    if (doc.relativePath.toLowerCase().includes(featureName)) {
      factors.push(`Path contains feature name: ${featureName}`);
    }

    // Check keyword matches
    const featureKeywords = this.extractKeywords(feature);
    const keywordMatches = [...featureKeywords].filter(kw => 
      (doc.keywords || []).includes(kw)
    );
    
    if (keywordMatches.length > 0) {
      factors.push(`Keyword match: ${keywordMatches.slice(0, 3).join(', ')}`);
    }

    // Check for status changes
    if (feature.changeType === 'new') {
      factors.push('New feature - may need new documentation');
    } else if (feature.contentChanges?.some(c => c.type === 'status_change')) {
      factors.push('Feature status changed');
    }

    return factors;
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Usage: node correlate-features-docs.mjs <feature-analysis.json> <doc-index.json>');
    console.error('Example: node correlate-features-docs.mjs features.json docs.json');
    process.exit(1);
  }

  const [featureFile, docFile] = args;
  
  try {
    const { readFileSync } = await import('fs');
    const featureAnalysis = JSON.parse(readFileSync(featureFile, 'utf8'));
    const docIndex = JSON.parse(readFileSync(docFile, 'utf8'));
    
    const correlator = new FeatureDocCorrelator();
    const correlations = correlator.correlateFeatures(featureAnalysis, docIndex);
    
    console.log(JSON.stringify(correlations, null, 2));
  } catch (error) {
    console.error('Error correlating features and docs:', error);
    process.exit(1);
  }
}

export { FeatureDocCorrelator };