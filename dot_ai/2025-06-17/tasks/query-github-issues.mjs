#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

// Function to run gh command and parse JSON
function queryIssues(query) {
  try {
    const result = execSync(query, { encoding: 'utf-8' });
    return JSON.parse(result);
  } catch (error) {
    console.error(`Error running query: ${query}`);
    console.error(error.message);
    return [];
  }
}

// Query different categories of issues
console.log('Fetching GitHub issues...\n');

// 1. Documentation issues
console.log('1. Fetching documentation issues...');
const docsIssues = queryIssues(
  `gh issue list --repo nrwl/nx --label "scope: docs" --state open --limit 30 --json number,title,body,labels,comments,createdAt,updatedAt`
);

// 2. Good first issues
console.log('2. Fetching good first issues...');
const goodFirstIssues = queryIssues(
  `gh issue list --repo nrwl/nx --label "good first issue" --state open --limit 20 --json number,title,body,labels,comments,createdAt,updatedAt`
);

// 3. Type: bug with simple scope
console.log('3. Fetching bug issues...');
const bugIssues = queryIssues(
  `gh issue list --repo nrwl/nx --label "type: bug" --state open --limit 30 --json number,title,body,labels,comments,createdAt,updatedAt`
);

// 4. Type: feature (small ones)
console.log('4. Fetching feature issues...');
const featureIssues = queryIssues(
  `gh issue list --repo nrwl/nx --label "type: feature" --state open --limit 20 --json number,title,body,labels,comments,createdAt,updatedAt`
);

// Combine and deduplicate
const allIssues = [...docsIssues, ...goodFirstIssues, ...bugIssues, ...featureIssues];
const uniqueIssues = Array.from(new Map(allIssues.map(issue => [issue.number, issue])).values());

// Filter for potentially easy issues
const easyIssues = uniqueIssues.filter(issue => {
  const body = issue.body?.toLowerCase() || '';
  const title = issue.title?.toLowerCase() || '';
  
  // Look for indicators of simple issues
  const easyIndicators = [
    title.includes('typo'),
    title.includes('documentation'),
    title.includes('docs'),
    title.includes('link'),
    title.includes('rename'),
    title.includes('update'),
    body.includes('typo'),
    body.includes('broken link'),
    body.includes('minor'),
    body.includes('small'),
    issue.labels?.some(label => label.name === 'good first issue'),
    issue.labels?.some(label => label.name === 'scope: docs'),
  ];
  
  return easyIndicators.some(indicator => indicator);
});

// Sort by recency
easyIssues.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

// Output results
console.log(`\nFound ${easyIssues.length} potentially easy issues\n`);

// Save to file
const output = {
  totalFound: easyIssues.length,
  issues: easyIssues.map(issue => ({
    number: issue.number,
    title: issue.title,
    url: `https://github.com/nrwl/nx/issues/${issue.number}`,
    labels: issue.labels?.map(l => l.name) || [],
    hasComments: issue.comments?.length > 0,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    bodyPreview: issue.body?.substring(0, 200) + '...'
  }))
};

fs.writeFileSync('/Users/jack/projects/nx/.ai/2025-06-17/tasks/github-issues-raw.json', JSON.stringify(output, null, 2));

console.log('Results saved to github-issues-raw.json');
console.log('\nTop 10 issues:');
easyIssues.slice(0, 10).forEach(issue => {
  console.log(`#${issue.number}: ${issue.title}`);
  console.log(`  Labels: ${issue.labels?.map(l => l.name).join(', ')}`);
  console.log(`  URL: https://github.com/nrwl/nx/issues/${issue.number}\n`);
});