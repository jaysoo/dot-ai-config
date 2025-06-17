#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

// Additional issue numbers to analyze (excluding the first 5 already done)
const additionalIssues = [
  30137, // Wrong hint about --dry-run in react-monorepo.md
  31574, // Need to clarify how gitignore would affect nx inputs
  30810, // How to tell if End to End Encryption is enabled correctly?
  31037, // Next.js documentation needs to be revisited
  30914, // How to use targetDefaults specifically for an inferred task executor
  31398, // Not clear how to enable "ciMode" for self-hosted remote cache
  30058, // Supplemental addition for troubleshooting global installs of nx
  30008, // Update documentation for Tailwind v4
];

console.log('Fetching detailed information for 5 more easy issues...\n');

const detailedIssues = [];

for (const issueNumber of additionalIssues) {
  console.log(`Fetching issue #${issueNumber}...`);
  try {
    const result = execSync(
      `gh issue view ${issueNumber} --repo nrwl/nx --json number,title,body,comments,labels,state,createdAt,updatedAt`,
      { encoding: 'utf-8' }
    );
    const issue = JSON.parse(result);
    
    // Add URL
    issue.url = `https://github.com/nrwl/nx/issues/${issueNumber}`;
    
    // Analyze complexity
    const analysis = analyzeComplexity(issue);
    issue.analysis = analysis;
    
    detailedIssues.push(issue);
  } catch (error) {
    console.error(`Error fetching issue #${issueNumber}: ${error.message}`);
  }
}

function analyzeComplexity(issue) {
  const body = issue.body?.toLowerCase() || '';
  const title = issue.title?.toLowerCase() || '';
  
  let estimatedLOC = 0;
  let complexity = 'unknown';
  let reasoning = [];
  
  // Check specific patterns
  if (title.includes('wrong hint') || title.includes('incorrect')) {
    estimatedLOC = 5;
    complexity = 'trivial';
    reasoning.push('Simple correction of incorrect information');
  } else if (title.includes('how to') && issue.labels?.some(l => l.name === 'scope: docs')) {
    estimatedLOC = 15;
    complexity = 'easy';
    reasoning.push('Adding how-to documentation');
  } else if (title.includes('clarify') || title.includes('not clear')) {
    estimatedLOC = 10;
    complexity = 'easy';
    reasoning.push('Clarifying existing documentation');
  } else if (title.includes('supplemental') || title.includes('addition')) {
    estimatedLOC = 20;
    complexity = 'easy';
    reasoning.push('Adding supplemental documentation');
  } else if (title.includes('update') && title.includes('documentation')) {
    estimatedLOC = 25;
    complexity = 'easy';
    reasoning.push('Updating documentation for new version');
  } else if (title.includes('needs to be revisited')) {
    estimatedLOC = 50;
    complexity = 'moderate';
    reasoning.push('Documentation section needs rework');
  }
  
  // Check body for specific mentions
  if (body.includes('typo')) {
    estimatedLOC = 1;
    complexity = 'trivial';
    reasoning.push('Typo fix');
  }
  
  if (body.includes('add a note') || body.includes('add documentation')) {
    estimatedLOC = Math.min(estimatedLOC || 15, 15);
    complexity = 'easy';
    reasoning.push('Adding a note or small section');
  }
  
  if (body.includes('example') && (body.includes('missing') || body.includes('add'))) {
    estimatedLOC = Math.min(estimatedLOC || 20, 20);
    complexity = 'easy';
    reasoning.push('Adding example code');
  }
  
  return {
    estimatedLOC: estimatedLOC || 30,
    complexity: complexity || 'moderate',
    reasoning: reasoning.length > 0 ? reasoning : ['General documentation update'],
  };
}

// Sort by estimated LOC
detailedIssues.sort((a, b) => a.analysis.estimatedLOC - b.analysis.estimatedLOC);

// Filter to get top 5 easiest
const top5Issues = detailedIssues.filter(issue => issue.analysis.estimatedLOC < 100).slice(0, 5);

// Save results
const output = {
  analyzed: detailedIssues.length,
  selectedCount: top5Issues.length,
  issues: top5Issues.map(issue => ({
    number: issue.number,
    title: issue.title,
    url: issue.url,
    labels: issue.labels?.map(l => l.name) || [],
    analysis: issue.analysis,
    bodyPreview: issue.body?.substring(0, 300) + '...',
    comments: issue.comments?.length || 0,
  }))
};

fs.writeFileSync('/Users/jack/projects/nx/.ai/2025-06-17/tasks/5-more-easy-issues.json', JSON.stringify(output, null, 2));

console.log('\nAnalysis complete. 5 more easy issues:\n');

top5Issues.forEach((issue, index) => {
  console.log(`${index + 1}. Issue #${issue.number}: ${issue.title}`);
  console.log(`   Estimated LOC: ${issue.analysis.estimatedLOC}`);
  console.log(`   Complexity: ${issue.analysis.complexity}`);
  console.log(`   Reasoning: ${issue.analysis.reasoning.join(', ')}`);
  console.log(`   URL: ${issue.url}\n`);
});