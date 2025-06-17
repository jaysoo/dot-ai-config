#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

// Issue numbers that look like easy fixes based on initial scan
const targetIssues = [
  31575, // Docs: suggest terminating Nx daemon before testing lifecycle hooks
  31431, // Bun is supported, but missing from CI deployment documentation
  30649, // Meaning of "*" version in project package.json  
  30768, // Where to put @nx/plugin
  31111, // Undocumented environment variable on Nx Docs
  30831, // @nx/angular:webpack-browser has incorrect documentation
  30137, // Wrong hint about --dry-run in react-monorepo.md
  31574, // Need to clarify how gitignore would affect nx inputs
];

console.log('Fetching detailed information for potentially easy issues...\n');

const detailedIssues = [];

for (const issueNumber of targetIssues) {
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
  
  // Documentation fixes are usually simple
  if (issue.labels?.some(l => l.name === 'scope: docs' || l.name === 'type: docs')) {
    if (title.includes('typo') || body.includes('typo')) {
      estimatedLOC = 1;
      complexity = 'trivial';
      reasoning.push('Simple typo fix');
    } else if (title.includes('missing') || title.includes('add')) {
      estimatedLOC = 5;
      complexity = 'easy';
      reasoning.push('Adding missing documentation');
    } else if (title.includes('clarify') || title.includes('unclear')) {
      estimatedLOC = 10;
      complexity = 'easy';
      reasoning.push('Clarifying existing documentation');
    } else if (title.includes('incorrect') || title.includes('wrong')) {
      estimatedLOC = 5;
      complexity = 'easy';
      reasoning.push('Fixing incorrect documentation');
    } else {
      estimatedLOC = 20;
      complexity = 'moderate';
      reasoning.push('General documentation update');
    }
  }
  
  // Check for specific patterns
  if (body.includes('broken link')) {
    estimatedLOC = 1;
    complexity = 'trivial';
    reasoning.push('Broken link fix');
  }
  
  if (body.includes('environment variable') && title.includes('undocumented')) {
    estimatedLOC = 5;
    complexity = 'easy';
    reasoning.push('Documenting environment variable');
  }
  
  return {
    estimatedLOC,
    complexity,
    reasoning,
  };
}

// Sort by estimated LOC
detailedIssues.sort((a, b) => a.analysis.estimatedLOC - b.analysis.estimatedLOC);

// Save results
const output = {
  analyzed: detailedIssues.length,
  issues: detailedIssues.map(issue => ({
    number: issue.number,
    title: issue.title,
    url: issue.url,
    labels: issue.labels?.map(l => l.name) || [],
    analysis: issue.analysis,
    bodyPreview: issue.body?.substring(0, 300) + '...',
    comments: issue.comments?.length || 0,
  }))
};

fs.writeFileSync('/Users/jack/projects/nx/.ai/2025-06-17/tasks/analyzed-easy-issues.json', JSON.stringify(output, null, 2));

console.log('\nAnalysis complete. Top 5 easiest issues:\n');

detailedIssues.slice(0, 5).forEach((issue, index) => {
  console.log(`${index + 1}. Issue #${issue.number}: ${issue.title}`);
  console.log(`   Estimated LOC: ${issue.analysis.estimatedLOC}`);
  console.log(`   Complexity: ${issue.analysis.complexity}`);
  console.log(`   Reasoning: ${issue.analysis.reasoning.join(', ')}`);
  console.log(`   URL: ${issue.url}\n`);
});