#!/usr/bin/env node

/**
 * Change Detection Prototype
 * 
 * This script demonstrates how to detect code changes that should trigger
 * documentation updates in the Raw Docs system
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Types of changes that should trigger documentation updates
 */
const DOCUMENTATION_TRIGGERS = {
  API_CHANGES: {
    patterns: [
      /export\s+(interface|type|class|function)/,
      /\@param\s+/,
      /\@returns?\s+/,
      /\@deprecated/,
      /\@example/
    ],
    severity: 'high',
    docTypes: ['api', 'reference']
  },
  
  FEATURE_ADDITIONS: {
    patterns: [
      /feat(\([^)]+\))?:/,
      /new\s+(feature|command|option)/i,
      /add\s+(support|feature)/i
    ],
    severity: 'medium',
    docTypes: ['guide', 'tutorial', 'changelog']
  },
  
  BREAKING_CHANGES: {
    patterns: [
      /BREAKING\s+CHANGE/i,
      /breaking:/i,
      /\!\s*:/
    ],
    severity: 'critical',
    docTypes: ['migration', 'changelog', 'breaking-changes']
  },
  
  CONFIGURATION_CHANGES: {
    patterns: [
      /schema\.json$/,
      /\.config\.(js|ts|json)$/,
      /nx\.json$/,
      /project\.json$/
    ],
    severity: 'medium',
    docTypes: ['configuration', 'reference']
  },
  
  CLI_CHANGES: {
    patterns: [
      /command.*\.ts$/,
      /generator.*\.ts$/,
      /executor.*\.ts$/,
      /schema\.d\.ts$/
    ],
    severity: 'high',
    docTypes: ['cli', 'api', 'reference']
  }
};

/**
 * File paths that are especially important for documentation
 */
const HIGH_IMPACT_PATHS = [
  'packages/*/src/generators/',
  'packages/*/src/executors/',
  'packages/*/src/migrations/',
  'packages/*/README.md',
  'docs/shared/',
  'nx.json',
  'packages/*/collection.json',
  'packages/*/executors.json',
  'packages/*/generators.json'
];

/**
 * Analyze a single commit for documentation impact
 */
function analyzeCommit(commitHash) {
  try {
    // Get commit details
    const commitInfo = execSync(`git show --name-only --pretty=format:"%H|%s|%b" ${commitHash}`, 
      { encoding: 'utf8' }
    ).split('\n');
    
    const [headerLine, ...fileLines] = commitInfo;
    const [hash, subject, body] = headerLine.split('|');
    const changedFiles = fileLines.filter(line => line.trim());
    
    const analysis = {
      hash,
      subject,
      body: body || '',
      changedFiles,
      documentationImpact: analyzeChangesForDocumentation(subject, body, changedFiles),
      priority: 'low',
      suggestedActions: []
    };
    
    // Determine overall priority
    const priorities = analysis.documentationImpact.map(impact => impact.severity);
    if (priorities.includes('critical')) analysis.priority = 'critical';
    else if (priorities.includes('high')) analysis.priority = 'high';
    else if (priorities.includes('medium')) analysis.priority = 'medium';
    
    // Generate suggested actions
    analysis.suggestedActions = generateSuggestedActions(analysis);
    
    return analysis;
    
  } catch (error) {
    console.error(`Error analyzing commit ${commitHash}:`, error.message);
    return null;
  }
}

/**
 * Analyze changes to determine documentation impact
 */
function analyzeChangesForDocumentation(subject, body, changedFiles) {
  const impacts = [];
  const fullMessage = `${subject} ${body}`.toLowerCase();
  
  // Check commit message patterns
  for (const [triggerType, config] of Object.entries(DOCUMENTATION_TRIGGERS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(fullMessage) || pattern.test(subject)) {
        impacts.push({
          type: triggerType,
          severity: config.severity,
          reason: `Commit message matches ${triggerType} pattern`,
          affectedDocTypes: config.docTypes,
          triggerPattern: pattern.toString()
        });
        break; // Only add once per trigger type
      }
    }
  }
  
  // Check file path patterns
  for (const file of changedFiles) {
    // Check if file is in high-impact paths
    const isHighImpact = HIGH_IMPACT_PATHS.some(pattern => {
      const regex = new RegExp(pattern.replace(/\*/g, '[^/]+'));
      return regex.test(file);
    });
    
    if (isHighImpact) {
      impacts.push({
        type: 'HIGH_IMPACT_FILE',
        severity: 'high',
        reason: `Modified high-impact file: ${file}`,
        affectedDocTypes: ['api', 'reference', 'guide'],
        file
      });
    }
    
    // Check specific file type patterns
    for (const [triggerType, config] of Object.entries(DOCUMENTATION_TRIGGERS)) {
      for (const pattern of config.patterns) {
        if (typeof pattern === 'object' && pattern.test && pattern.test(file)) {
          impacts.push({
            type: triggerType,
            severity: config.severity,
            reason: `File matches ${triggerType} pattern: ${file}`,
            affectedDocTypes: config.docTypes,
            file
          });
        }
      }
    }
  }
  
  return impacts;
}

/**
 * Generate suggested actions based on analysis
 */
function generateSuggestedActions(analysis) {
  const actions = [];
  
  // Group impacts by type
  const impactTypes = [...new Set(analysis.documentationImpact.map(i => i.type))];
  
  for (const impactType of impactTypes) {
    const impacts = analysis.documentationImpact.filter(i => i.type === impactType);
    const docTypes = [...new Set(impacts.flatMap(i => i.affectedDocTypes))];
    
    switch (impactType) {
      case 'API_CHANGES':
        actions.push({
          type: 'update_api_docs',
          description: 'Update API documentation for changed interfaces/functions',
          targetDocs: docTypes,
          priority: 'high',
          automated: true
        });
        break;
        
      case 'FEATURE_ADDITIONS':
        actions.push({
          type: 'create_feature_guide',
          description: 'Create or update feature guide for new functionality',
          targetDocs: docTypes,
          priority: 'medium',
          automated: false
        });
        break;
        
      case 'BREAKING_CHANGES':
        actions.push({
          type: 'update_migration_guide',
          description: 'Update migration guide for breaking changes',
          targetDocs: docTypes,
          priority: 'critical',
          automated: false
        });
        break;
        
      case 'CLI_CHANGES':
        actions.push({
          type: 'update_cli_docs',
          description: 'Update CLI command documentation',
          targetDocs: docTypes,
          priority: 'high',
          automated: true
        });
        break;
        
      default:
        actions.push({
          type: 'review_docs',
          description: `Review documentation for ${impactType.toLowerCase().replace('_', ' ')}`,
          targetDocs: docTypes,
          priority: 'medium',
          automated: false
        });
    }
  }
  
  return actions;
}

/**
 * Analyze recent commits for documentation impact
 */
function analyzeRecentCommits(days = 7) {
  try {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const commits = execSync(`git log --since="${since}" --oneline --pretty=format:"%H"`, 
      { encoding: 'utf8' }
    ).split('\n').filter(Boolean);
    
    console.log(`🔍 Analyzing ${commits.length} commits from the last ${days} days...\n`);
    
    const analyses = commits.map(commitHash => analyzeCommit(commitHash)).filter(Boolean);
    
    // Sort by priority
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    analyses.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    
    return analyses;
    
  } catch (error) {
    console.error('Error analyzing recent commits:', error.message);
    return [];
  }
}

/**
 * Generate a documentation impact report
 */
function generateImpactReport(analyses) {
  console.log('📊 Documentation Impact Report');
  console.log('=' .repeat(60));
  
  const summary = {
    total: analyses.length,
    critical: analyses.filter(a => a.priority === 'critical').length,
    high: analyses.filter(a => a.priority === 'high').length,
    medium: analyses.filter(a => a.priority === 'medium').length,
    low: analyses.filter(a => a.priority === 'low').length
  };
  
  console.log(`\n📈 Summary:`);
  console.log(`   Total commits analyzed: ${summary.total}`);
  console.log(`   🔴 Critical priority: ${summary.critical}`);
  console.log(`   🟠 High priority: ${summary.high}`);
  console.log(`   🟡 Medium priority: ${summary.medium}`);
  console.log(`   🟢 Low priority: ${summary.low}`);
  
  console.log('\n🎯 High Priority Items:\n');
  
  const highPriorityCommits = analyses.filter(a => ['critical', 'high'].includes(a.priority));
  
  highPriorityCommits.forEach((analysis, index) => {
    const priorityEmoji = analysis.priority === 'critical' ? '🔴' : '🟠';
    console.log(`${priorityEmoji} ${index + 1}. ${analysis.subject}`);
    console.log(`   Commit: ${analysis.hash.substring(0, 8)}`);
    console.log(`   Impact: ${analysis.documentationImpact.map(i => i.type).join(', ')}`);
    console.log(`   Actions: ${analysis.suggestedActions.length} suggested`);
    
    if (analysis.suggestedActions.length > 0) {
      analysis.suggestedActions.forEach(action => {
        console.log(`     • ${action.description}`);
      });
    }
    console.log('');
  });
  
  return summary;
}

/**
 * Generate AI prompts for content generation
 */
function generateAIPrompts(analyses) {
  console.log('🤖 AI Content Generation Prompts\n');
  console.log('=' .repeat(60));
  
  const highImpactCommits = analyses.filter(a => ['critical', 'high'].includes(a.priority));
  
  highImpactCommits.forEach((analysis, index) => {
    console.log(`\n🧠 Prompt ${index + 1}: ${analysis.subject}`);
    console.log('-' .repeat(50));
    
    const prompt = generateContentPrompt(analysis);
    console.log(prompt);
  });
}

/**
 * Generate a content generation prompt for AI
 */
function generateContentPrompt(analysis) {
  const impactTypes = analysis.documentationImpact.map(i => i.type).join(', ');
  const changedFiles = analysis.changedFiles.slice(0, 5).join(', ');
  
  return `You are a technical documentation expert. Analyze this commit and generate appropriate documentation updates:

**Commit Details:**
- Hash: ${analysis.hash.substring(0, 8)}
- Subject: ${analysis.subject}
- Changed Files: ${changedFiles}${analysis.changedFiles.length > 5 ? ` (and ${analysis.changedFiles.length - 5} more)` : ''}
- Impact Types: ${impactTypes}

**Task:**
Based on the commit details above, generate documentation content for the following:

${analysis.suggestedActions.map(action => `- ${action.description} (${action.targetDocs.join(', ')})`).join('\n')}

**Requirements:**
- Focus on user-facing changes and benefits
- Include code examples where relevant
- Maintain consistency with existing documentation style
- Highlight any breaking changes or migration steps
- Use clear, concise language suitable for developers

**Output Format:**
Provide the documentation content in Markdown format, organized by section type.`;
}

/**
 * Save analysis results to JSON file
 */
function saveAnalysisResults(analyses, summary) {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `change-analysis-${timestamp}.json`;
  
  const results = {
    timestamp: new Date().toISOString(),
    summary,
    analyses: analyses.map(a => ({
      ...a,
      // Truncate body for cleaner JSON
      body: a.body?.substring(0, 200) + (a.body?.length > 200 ? '...' : '')
    }))
  };
  
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n💾 Analysis results saved to: ${filename}`);
  
  return filename;
}

/**
 * Main execution function
 */
function main() {
  const args = process.argv.slice(2);
  const days = args[0] ? parseInt(args[0]) : 7;
  
  console.log('🚀 Change Detection Prototype for Raw Docs System');
  console.log(`📅 Analyzing commits from the last ${days} days\n`);
  
  // Analyze recent commits
  const analyses = analyzeRecentCommits(days);
  
  if (analyses.length === 0) {
    console.log('No commits found in the specified time period.');
    return;
  }
  
  // Generate impact report
  const summary = generateImpactReport(analyses);
  
  // Generate AI prompts for high-priority items
  generateAIPrompts(analyses);
  
  // Save results
  saveAnalysisResults(analyses, summary);
  
  console.log('\n✅ Analysis complete!');
  console.log('\n🎯 Next Steps:');
  console.log('   1. Review high-priority commits manually');
  console.log('   2. Use AI prompts to generate initial documentation');
  console.log('   3. Set up automated triggers for future commits');
  console.log('   4. Configure webhook for real-time analysis');
}

// Helper function to test with a specific commit
function testSingleCommit(commitHash) {
  console.log(`🧪 Testing single commit: ${commitHash}\n`);
  const analysis = analyzeCommit(commitHash);
  
  if (analysis) {
    console.log('Analysis Result:');
    console.log(JSON.stringify(analysis, null, 2));
    
    console.log('\nAI Prompt:');
    console.log(generateContentPrompt(analysis));
  }
}

// Export functions for testing
export {
  analyzeCommit,
  analyzeChangesForDocumentation,
  generateSuggestedActions,
  analyzeRecentCommits,
  generateImpactReport,
  generateAIPrompts,
  testSingleCommit
};

// Run main function if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}