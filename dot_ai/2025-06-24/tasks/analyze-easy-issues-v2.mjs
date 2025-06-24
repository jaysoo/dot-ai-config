#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

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
    investigation: { priority: 'MEDIUM', aiSuitability: 'MEDIUM' }
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
  
  issue.comments.forEach(comment => {
    if (CORE_CONTRIBUTORS.includes(comment.author.login)) {
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
    /mentions.*wrong/i
  ];
  if (docPatterns.some(p => bodyAndComments.match(p))) {
    categories.push('simpleDocs');
  }
  
  // Deprecation tasks
  if (bodyAndComments.match(/deprecate|remove.*option|legacy/i)) {
    categories.push('deprecation');
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
  
  for (const issue of issues) {
    const bodyAndComments = issue.body + ' ' + issue.comments.map(c => c.body).join(' ');
    const coreInvolvement = analyzeCoreContributorInvolvement(issue);
    const categories = categorizeIssue(issue, bodyAndComments);
    
    const criteria = {
      number: issue.number,
      title: issue.title,
      url: `https://github.com/${config.repo}/issues/${issue.number}`,
      created: new Date(issue.createdAt),
      updated: new Date(issue.updatedAt),
      labels: issue.labels.map(l => l.name),
      author: issue.author.login,
      categories,
      coreInvolvement,
      score: 0,
      aiSuitability: 'UNKNOWN',
      priority: 'UNKNOWN',
      actionItems: []
    };
    
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
    
    // Separate unclear documentation requests
    if (bodyAndComments.match(/document.*unclear|not sure.*document/i) && 
        !categories.includes('simpleDocs')) {
      documentationRequests.push({
        number: issue.number,
        title: issue.title,
        url: criteria.url,
        summary: issue.body.substring(0, 200) + '...'
      });
    }
    
    // Only include if score > 0 and AI suitable
    if (criteria.score > 0 && criteria.aiSuitability !== 'LOW') {
      analyzedIssues.push(criteria);
    }
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
      documentationRequests: documentationRequests.length
    },
    issues: analyzedIssues
  };
}

// Run analysis
analyzeIssues().then(result => {
  console.log('Analysis complete!');
  console.log(`Found ${result.summary.total} actionable issues`);
  console.log(`High priority: ${result.summary.byPriority.HIGH}`);
  console.log(`AI suitable: ${result.summary.bySuitability.HIGH}`);
  console.log(`Core team involved: ${result.summary.withCoreComments}`);
  
  fs.writeFileSync('/tmp/nx-issues-analysis-v2.json', JSON.stringify(result, null, 2));
});