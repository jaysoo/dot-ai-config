#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Known Nx core contributors (update this list regularly)
const CORE_CONTRIBUTORS = [
  'leosvelperez',
  'jaysoo',
  'vsavkin',
  'FrozenPandaz',
  'meeroslav',
  'juristr',
  'mandarini',
  'ndcunningham',
  'xiongemi',
  'Coly010',
  'AgentEnder',
  'barbados-clemens',
  'MaxKless',
  'isaacplmann',
  'nartc',
  'rarmatei'
];

const config = {
  repo: 'nrwl/nx',
  outputDir: '/tmp',
  // Categories with priority
  categories: {
    performance: { priority: 'HIGH', aiSuitability: 'MEDIUM' },
    coreMentioned: { priority: 'HIGH', aiSuitability: 'HIGH' },
    simpleDocs: { priority: 'MEDIUM', aiSuitability: 'HIGH' },
    configFix: { priority: 'MEDIUM', aiSuitability: 'HIGH' },
    deprecation: { priority: 'MEDIUM', aiSuitability: 'HIGH' },
    createWorkspace: { priority: 'HIGH', aiSuitability: 'MEDIUM' },
    tutorialUpdate: { priority: 'LOW', aiSuitability: 'HIGH' },
    complexDocs: { priority: 'MEDIUM', aiSuitability: 'LOW' },
    investigation: { priority: 'MEDIUM', aiSuitability: 'MEDIUM' },
    typeError: { priority: 'HIGH', aiSuitability: 'HIGH' },
    migrationIssue: { priority: 'HIGH', aiSuitability: 'MEDIUM' },
    cliError: { priority: 'HIGH', aiSuitability: 'MEDIUM' }
  },
  
  // Scoring weights - emphasize AI suitability
  scores: {
    coreContributorMentioned: 10,
    clearActionItem: 8,
    hasReproduction: 5,
    simpleDocFix: 7,
    tutorialUpdate: 6,
    deprecationTask: 7,
    performanceIssue: 3, // Lower because harder for AI
    investigationNeeded: 4,
    userProvidedFix: 6,
    typeError: 8,
    migrationIssue: 5,
    
    // Negative scores
    architecturalChange: -10,
    upstreamDependency: -8,
    complexDiscussion: -5,
    unclearRequirements: -6,
    needsDesignDecision: -8
  }
};

function analyzeCoreContributorInvolvement(issue) {
  const involvement = {
    hasCommented: false,
    promisedPR: false,
    providedGuidance: false,
    lastCommentDate: null,
    contributors: []
  };
  
  if (!issue.comments || !Array.isArray(issue.comments)) {
    return involvement;
  }
  
  issue.comments.forEach(comment => {
    if (comment.author && CORE_CONTRIBUTORS.includes(comment.author.login)) {
      involvement.hasCommented = true;
      involvement.contributors.push(comment.author.login);
      
      const commentDate = new Date(comment.createdAt);
      if (!involvement.lastCommentDate || commentDate > involvement.lastCommentDate) {
        involvement.lastCommentDate = commentDate;
      }
      
      // Check for PR promises
      if (comment.body.match(/I'll send a PR|PR coming|will submit.*PR/i)) {
        involvement.promisedPR = true;
      }
      
      // Check for clear guidance
      if (comment.body.match(/should|needs to|the fix is|implement/i)) {
        involvement.providedGuidance = true;
      }
    }
  });
  
  return involvement;
}

function categorizeIssue(issue, bodyAndComments) {
  const categories = [];
  
  // Performance/Graph issues
  if (bodyAndComments.match(/graph.*slow|fresh graph|performance|takes.*long|daemon/i)) {
    categories.push('performance');
  }
  
  // Create workspace issues
  if (issue.title.match(/create.*workspace|nx workspace.*latest/i)) {
    categories.push('createWorkspace');
  }
  
  // Tutorial updates
  if (bodyAndComments.match(/tutorial.*update|tutorial.*outdated/i)) {
    categories.push('tutorialUpdate');
  }
  
  // Simple doc fixes
  const docPatterns = [
    /wrong.*sentence/i,
    /typo/i,
    /incorrect.*path/i,
    /should be.*instead/i,
    /mentions.*wrong/i,
    /documentation.*incorrect/i,
    /docs.*error/i
  ];
  if (docPatterns.some(p => bodyAndComments.match(p))) {
    categories.push('simpleDocs');
  }
  
  // Deprecation tasks
  if (bodyAndComments.match(/deprecate|remove.*option|legacy/i)) {
    categories.push('deprecation');
  }
  
  // Type errors
  if (bodyAndComments.match(/type.*error|typescript.*error|cannot find.*type/i)) {
    categories.push('typeError');
  }
  
  // Migration issues
  if (bodyAndComments.match(/migration|migrate|upgrade.*nx/i)) {
    categories.push('migrationIssue');
  }
  
  // CLI errors
  if (bodyAndComments.match(/command.*fail|cli.*error|nx.*command/i)) {
    categories.push('cliError');
  }
  
  return categories;
}

function generateActionItems(issue, criteria) {
  const actions = [];
  
  // Performance issues
  if (criteria.categories.includes('performance')) {
    actions.push({
      type: 'investigate',
      steps: [
        `Add console.log timing to packages/${issue.title.match(/nx\/(\w+)/)?.[1] || 'core'}/src/plugins/plugin.ts`,
        'Run with NX_DAEMON=false NX_PROJECT_GRAPH_CACHE=false',
        'Delete .nx/workspace-data before testing',
        'Identify bottleneck from timing logs'
      ]
    });
  }
  
  // Create workspace issues
  if (criteria.categories.includes('createWorkspace')) {
    actions.push({
      type: 'reproduce',
      steps: [
        'Test with different combinations:',
        '- Directory: . vs custom-name',
        '- Presets: apps, npm, nest, next, etc.',
        '- Package managers: npm, yarn, pnpm',
        'Create minimal reproduction matrix'
      ]
    });
  }
  
  // Type errors
  if (criteria.categories.includes('typeError')) {
    actions.push({
      type: 'fix',
      steps: [
        'Run nx run-many -t typecheck to reproduce',
        'Fix missing type imports or declarations',
        'Ensure tsconfig paths are correct',
        'Run nx prepush to validate'
      ]
    });
  }
  
  // Core contributor guidance
  if (criteria.coreInvolvement.providedGuidance) {
    actions.push({
      type: 'implement',
      contributor: criteria.coreInvolvement.contributors[0],
      note: 'Follow core contributor guidance in comments'
    });
  }
  
  return actions;
}

// Main analysis function
async function analyzeIssues() {
  const issueFile = process.argv[2] || path.join(config.outputDir, 'nx-all-open-issues.json');
  const issues = JSON.parse(fs.readFileSync(issueFile, 'utf8'));
  
  const analyzedIssues = [];
  const documentationRequests = [];
  const statistics = {
    totalAnalyzed: 0,
    byCategory: {},
    byLabel: {},
    byAge: {
      recent: 0, // < 30 days
      medium: 0, // 30-90 days
      old: 0     // > 90 days
    }
  };
  
  for (const issue of issues) {
    const comments = issue.comments || [];
    const bodyAndComments = issue.body + ' ' + comments.map(c => c.body || '').join(' ');
    const coreInvolvement = analyzeCoreContributorInvolvement(issue);
    const categories = categorizeIssue(issue, bodyAndComments);
    
    const criteria = {
      number: issue.number,
      title: issue.title,
      url: `https://github.com/${config.repo}/issues/${issue.number}`,
      created: new Date(issue.createdAt),
      updated: new Date(issue.updatedAt),
      labels: issue.labels ? issue.labels.map(l => l.name) : [],
      author: issue.author ? issue.author.login : 'unknown',
      categories,
      coreInvolvement,
      score: 0,
      aiSuitability: 'UNKNOWN',
      priority: 'UNKNOWN',
      actionItems: []
    };
    
    // Calculate age
    const ageInDays = (Date.now() - criteria.created) / (1000 * 60 * 60 * 24);
    if (ageInDays < 30) statistics.byAge.recent++;
    else if (ageInDays < 90) statistics.byAge.medium++;
    else statistics.byAge.old++;
    
    // Count labels
    criteria.labels.forEach(label => {
      statistics.byLabel[label] = (statistics.byLabel[label] || 0) + 1;
    });
    
    // Calculate score based on new criteria
    if (coreInvolvement.hasCommented) {
      criteria.score += config.scores.coreContributorMentioned;
      if (coreInvolvement.providedGuidance) {
        criteria.score += config.scores.clearActionItem;
      }
    }
    
    // Add category-based scoring
    if (categories.includes('simpleDocs')) {
      criteria.score += config.scores.simpleDocFix;
    }
    if (categories.includes('tutorialUpdate')) {
      criteria.score += config.scores.tutorialUpdate;
    }
    if (categories.includes('performance')) {
      criteria.score += config.scores.performanceIssue;
    }
    if (categories.includes('typeError')) {
      criteria.score += config.scores.typeError;
    }
    if (categories.includes('migrationIssue')) {
      criteria.score += config.scores.migrationIssue;
    }
    
    // Check for negative factors
    if (bodyAndComments.match(/architecture|design.*decision|RFC/i)) {
      criteria.score += config.scores.architecturalChange;
    }
    if (bodyAndComments.match(/upstream|third.?party|external.*dependency/i)) {
      criteria.score += config.scores.upstreamDependency;
    }
    
    // Determine AI suitability and priority
    if (categories.length > 0) {
      // Get highest priority category
      const priorities = categories.map(cat => config.categories[cat]?.priority || 'UNKNOWN');
      const suitabilities = categories.map(cat => config.categories[cat]?.aiSuitability || 'UNKNOWN');
      
      criteria.priority = priorities.includes('HIGH') ? 'HIGH' : 
                          priorities.includes('MEDIUM') ? 'MEDIUM' : 'LOW';
      criteria.aiSuitability = suitabilities.includes('HIGH') ? 'HIGH' :
                              suitabilities.includes('MEDIUM') ? 'MEDIUM' : 'LOW';
    }
    
    // Generate specific action items
    criteria.actionItems = generateActionItems(issue, criteria);
    
    // Count categories
    categories.forEach(cat => {
      statistics.byCategory[cat] = (statistics.byCategory[cat] || 0) + 1;
    });
    
    // Separate unclear documentation requests
    if (bodyAndComments.match(/document.*unclear|not sure.*document/i) && 
        !categories.includes('simpleDocs')) {
      documentationRequests.push({
        number: issue.number,
        title: issue.title,
        url: criteria.url,
        summary: issue.body ? issue.body.substring(0, 200) + '...' : ''
      });
    }
    
    // Only include if score > 0 and AI suitable
    if (criteria.score > 0 && criteria.aiSuitability !== 'LOW') {
      analyzedIssues.push(criteria);
    }
    
    statistics.totalAnalyzed++;
  }
  
  // Sort by AI suitability then score
  analyzedIssues.sort((a, b) => {
    const suitabilityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1, UNKNOWN: 0 };
    const suitDiff = suitabilityOrder[a.aiSuitability] - suitabilityOrder[b.aiSuitability];
    return suitDiff !== 0 ? -suitDiff : b.score - a.score;
  });
  
  // Write documentation requests file
  if (documentationRequests.length > 0) {
    const docReqContent = `# Documentation Requests (Unclear Requirements)\n\n` +
      `Generated: ${new Date().toISOString().split('T')[0]}\n\n` +
      documentationRequests.map(req => 
        `## Issue #${req.number}: ${req.title}\n` +
        `- URL: ${req.url}\n` +
        `- Summary: ${req.summary}\n\n`
      ).join('');
    
    fs.writeFileSync('.ai/DOCUMENTATION_REQUESTS.md', docReqContent);
  }
  
  // Generate enhanced output
  return {
    summary: {
      total: analyzedIssues.length,
      totalAnalyzed: statistics.totalAnalyzed,
      byPriority: {
        HIGH: analyzedIssues.filter(i => i.priority === 'HIGH').length,
        MEDIUM: analyzedIssues.filter(i => i.priority === 'MEDIUM').length,
        LOW: analyzedIssues.filter(i => i.priority === 'LOW').length
      },
      bySuitability: {
        HIGH: analyzedIssues.filter(i => i.aiSuitability === 'HIGH').length,
        MEDIUM: analyzedIssues.filter(i => i.aiSuitability === 'MEDIUM').length
      },
      withCoreComments: analyzedIssues.filter(i => i.coreInvolvement.hasCommented).length,
      documentationRequests: documentationRequests.length,
      byCategory: statistics.byCategory,
      byAge: statistics.byAge,
      topLabels: Object.entries(statistics.byLabel)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([label, count]) => ({ label, count }))
    },
    issues: analyzedIssues
  };
}

// Run analysis
analyzeIssues().then(result => {
  console.log('Analysis complete!');
  console.log(`Total issues analyzed: ${result.summary.totalAnalyzed}`);
  console.log(`Found ${result.summary.total} actionable issues`);
  console.log(`High priority: ${result.summary.byPriority.HIGH}`);
  console.log(`AI suitable: ${result.summary.bySuitability.HIGH}`);
  console.log(`Core team involved: ${result.summary.withCoreComments}`);
  console.log('\nTop categories:');
  Object.entries(result.summary.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([cat, count]) => console.log(`  ${cat}: ${count}`));
  
  fs.writeFileSync('/tmp/nx-issues-analysis-v2.json', JSON.stringify(result, null, 2));
  
  // Write categorized markdown files
  const timestamp = new Date().toISOString().split('T')[0];
  
  // High priority AI-suitable issues
  const highPriorityIssues = result.issues
    .filter(i => i.priority === 'HIGH' && i.aiSuitability === 'HIGH')
    .slice(0, 20);
    
  if (highPriorityIssues.length > 0) {
    const content = `# High Priority AI-Suitable Issues\n\n` +
      `Generated: ${timestamp}\n\n` +
      highPriorityIssues.map(issue => 
        `## Issue #${issue.number}: ${issue.title}\n` +
        `- URL: ${issue.url}\n` +
        `- Score: ${issue.score}\n` +
        `- Categories: ${issue.categories.join(', ')}\n` +
        `- Core involvement: ${issue.coreInvolvement.hasCommented ? 'Yes' : 'No'}\n` +
        `- Action items:\n${issue.actionItems.map(a => `  - ${a.type}: ${a.note || a.steps?.[0] || ''}`).join('\n')}\n\n`
      ).join('');
      
    fs.writeFileSync('.ai/2025-06-27/tasks/nx-high-priority-issues.md', content);
  }
  
  // Type error issues
  const typeErrorIssues = result.issues
    .filter(i => i.categories.includes('typeError'))
    .slice(0, 10);
    
  if (typeErrorIssues.length > 0) {
    const content = `# Type Error Issues\n\n` +
      `Generated: ${timestamp}\n\n` +
      typeErrorIssues.map(issue => 
        `## Issue #${issue.number}: ${issue.title}\n` +
        `- URL: ${issue.url}\n` +
        `- Score: ${issue.score}\n\n`
      ).join('');
      
    fs.writeFileSync('.ai/2025-06-27/tasks/nx-type-error-issues.md', content);
  }
  
  // Documentation issues
  const docIssues = result.issues
    .filter(i => i.categories.includes('simpleDocs') || i.categories.includes('tutorialUpdate'))
    .slice(0, 15);
    
  if (docIssues.length > 0) {
    const content = `# Documentation Issues\n\n` +
      `Generated: ${timestamp}\n\n` +
      docIssues.map(issue => 
        `## Issue #${issue.number}: ${issue.title}\n` +
        `- URL: ${issue.url}\n` +
        `- Type: ${issue.categories.includes('simpleDocs') ? 'Simple fix' : 'Tutorial update'}\n` +
        `- Score: ${issue.score}\n\n`
      ).join('');
      
    fs.writeFileSync('.ai/2025-06-27/tasks/nx-documentation-issues.md', content);
  }
});