#!/usr/bin/env node

import fs from 'fs';

const data = JSON.parse(fs.readFileSync('/tmp/nx-issues-analysis-v2.json', 'utf8'));

console.log('# Top 10 AI-Suitable Nx Issues\n');

const topIssues = data.issues.slice(0, 10);

topIssues.forEach((issue, index) => {
  console.log(`## ${index + 1}. Issue #${issue.number}`);
  console.log(`- **Title**: ${issue.title}`);
  console.log(`- **URL**: ${issue.url}`);
  console.log(`- **Score**: ${issue.score}`);
  console.log(`- **Priority**: ${issue.priority}`);
  console.log(`- **AI Suitability**: ${issue.aiSuitability}`);
  console.log(`- **Categories**: ${issue.categories.join(', ')}`);
  
  if (issue.coreInvolvement.hasCommented) {
    console.log(`- **Core Contributors**: ${issue.coreInvolvement.contributors.join(', ')}`);
    if (issue.coreInvolvement.providedGuidance) {
      console.log(`  - ✅ Provided guidance`);
    }
  }
  
  if (issue.actionItems.length > 0) {
    console.log(`- **Action Items**:`);
    issue.actionItems.forEach(action => {
      console.log(`  - Type: ${action.type}`);
      if (action.steps) {
        action.steps.forEach(step => console.log(`    - ${step}`));
      }
      if (action.note) {
        console.log(`    - Note: ${action.note}`);
      }
    });
  }
  
  console.log('');
});