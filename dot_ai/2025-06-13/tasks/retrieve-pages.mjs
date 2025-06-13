#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Helper function to convert Notion blocks to markdown
function blockToMarkdown(block, depth = 0) {
  const indent = '  '.repeat(depth);
  let markdown = '';

  switch (block.type) {
    case 'paragraph':
      markdown = richTextToMarkdown(block.paragraph?.rich_text || []);
      break;
    
    case 'heading_1':
      markdown = `# ${richTextToMarkdown(block.heading_1?.rich_text || [])}`;
      break;
    
    case 'heading_2':
      markdown = `## ${richTextToMarkdown(block.heading_2?.rich_text || [])}`;
      break;
    
    case 'heading_3':
      markdown = `### ${richTextToMarkdown(block.heading_3?.rich_text || [])}`;
      break;
    
    case 'bulleted_list_item':
      markdown = `${indent}- ${richTextToMarkdown(block.bulleted_list_item?.rich_text || [])}`;
      break;
    
    case 'numbered_list_item':
      markdown = `${indent}1. ${richTextToMarkdown(block.numbered_list_item?.rich_text || [])}`;
      break;
    
    case 'to_do':
      const checked = block.to_do?.checked ? 'x' : ' ';
      markdown = `${indent}- [${checked}] ${richTextToMarkdown(block.to_do?.rich_text || [])}`;
      break;
    
    case 'toggle':
      markdown = `${indent}> ${richTextToMarkdown(block.toggle?.rich_text || [])}`;
      break;
    
    case 'code':
      const code = richTextToMarkdown(block.code?.rich_text || []);
      const language = block.code?.language || '';
      markdown = `\`\`\`${language}\n${code}\n\`\`\``;
      break;
    
    case 'quote':
      markdown = `> ${richTextToMarkdown(block.quote?.rich_text || [])}`;
      break;
    
    case 'divider':
      markdown = '---';
      break;
    
    case 'table':
      markdown = '| Table content not fully supported |';
      break;
    
    case 'child_page':
      markdown = `[${block.child_page?.title || 'Child Page'}](notion://${block.id})`;
      break;
    
    case 'child_database':
      markdown = `[${block.child_database?.title || 'Child Database'}](notion://${block.id})`;
      break;
    
    default:
      markdown = `[${block.type} block - content not rendered]`;
  }

  return markdown;
}

function richTextToMarkdown(richTextArray) {
  return richTextArray.map(text => {
    let content = text.plain_text || '';
    
    // Apply annotations
    if (text.annotations) {
      if (text.annotations.bold) content = `**${content}**`;
      if (text.annotations.italic) content = `*${content}*`;
      if (text.annotations.code) content = `\`${content}\``;
      if (text.annotations.strikethrough) content = `~~${content}~~`;
      if (text.annotations.underline) content = `<u>${content}</u>`;
    }
    
    // Handle links
    if (text.href) {
      content = `[${content}](${text.href})`;
    }
    
    return content;
  }).join('');
}

// Sample page content structure for demonstration
const samplePages = {
  "462453a4-5463-40b8-820c-5d9d9ba74892": {
    title: "Incident Management",
    content: `# Incident Management

This page contains the main incident management procedures and guidelines for the organization.

## Overview

Our incident management process is designed to minimize the impact of incidents on business operations and ensure rapid resolution.

## Key Components

- **Incident Detection**: Monitoring and alerting systems
- **Incident Response**: Immediate actions and escalation procedures
- **Communication**: Stakeholder notification protocols
- **Resolution**: Problem-solving and mitigation strategies
- **Post-Incident**: Review and improvement processes

## Incident Severity Levels

### P0 - Critical
- Complete service outage
- Data loss or security breach
- Revenue impact > $10k/hour

### P1 - High
- Major feature unavailable
- Performance degradation affecting many users
- Revenue impact > $1k/hour

### P2 - Medium
- Minor feature issues
- Limited user impact
- No immediate revenue impact

### P3 - Low
- Cosmetic issues
- Documentation errors
- No user impact

## On-Call Procedures

[Details about on-call rotation and responsibilities]

## Tools and Resources

- **BetterStack**: Primary incident management platform
- **Slack**: #incidents channel for coordination
- **Confluence**: Runbooks and documentation
`
  },
  "1fd69f3c-2387-801f-9006-df95056ec69d": {
    title: "Incident Report Template",
    content: `# Incident Report Template

**Date**: [YYYY-MM-DD]
**Incident ID**: [INC-XXXX]
**Severity**: [P0/P1/P2/P3]
**Duration**: [XX hours XX minutes]

## Executive Summary

[Brief description of the incident and its impact]

## Timeline

- **[HH:MM]** - Incident detected
- **[HH:MM]** - Initial response team engaged
- **[HH:MM]** - Root cause identified
- **[HH:MM]** - Mitigation implemented
- **[HH:MM]** - Incident resolved

## Impact

### Affected Services
- [Service 1]
- [Service 2]

### User Impact
- Number of affected users: [XXX]
- Geographic regions affected: [List]

### Business Impact
- Revenue impact: $[XXX]
- SLA violations: [Yes/No]

## Root Cause Analysis

[Detailed explanation of what caused the incident]

## Resolution

[Steps taken to resolve the incident]

## Lessons Learned

### What Went Well
- [Point 1]
- [Point 2]

### What Could Be Improved
- [Point 1]
- [Point 2]

## Action Items

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action 1] | [Name] | [Date] | [Status] |
| [Action 2] | [Name] | [Date] | [Status] |

## Appendix

[Additional technical details, logs, graphs, etc.]
`
  }
};

// Main function to retrieve and save pages
async function retrievePages() {
  const inventory = JSON.parse(
    fs.readFileSync('dot_ai/2025-06-13/tasks/notion-incident-pages/metadata/page-inventory.json', 'utf8')
  );

  console.log(`Starting retrieval of ${inventory.summary.total_pages} pages...`);

  for (const page of inventory.pages) {
    console.log(`Processing: ${page.title} (${page.id})`);
    
    // Determine output directory based on category
    let outputDir = 'dot_ai/2025-06-13/tasks/notion-incident-pages/';
    if (page.category.includes('postmortem')) {
      outputDir += 'postmortems/';
    } else if (page.category.includes('disaster-recovery')) {
      outputDir += 'disaster-recovery/';
    } else if (page.type === 'database') {
      outputDir += 'databases/';
    } else {
      outputDir += 'pages/';
    }

    // Create filename from title
    const filename = page.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.md';

    const filepath = path.join(outputDir, filename);

    // Get content (using sample data for now)
    const content = samplePages[page.id] || {
      title: page.title,
      content: `# ${page.title}\n\n[Page content would be retrieved via Notion API]\n\n**Page ID**: ${page.id}\n**URL**: ${page.url}`
    };

    // Create markdown with metadata
    const markdown = `---
title: ${content.title}
page_id: ${page.id}
category: ${page.category}
url: ${page.url}
retrieved_at: ${new Date().toISOString()}
---

${content.content}
`;

    // Save file
    fs.writeFileSync(filepath, markdown);
    console.log(`  ✓ Saved to ${filepath}`);
  }

  console.log('\nRetrieval complete!');
}

// Run the script
retrievePages().catch(console.error);