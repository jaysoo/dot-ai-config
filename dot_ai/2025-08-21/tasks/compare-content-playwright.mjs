#!/usr/bin/env node

/**
 * Playwright-based content comparison test
 * Compares content between production nx.dev and local Astro docs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PRODUCTION_URL = 'https://nx.dev';
const LOCAL_NX_DEV = 'http://localhost:4200';
const LOCAL_ASTRO = 'http://localhost:9001';

// Sample URLs to test (high confidence ones that passed redirect test)
const urlsToTest = [
  '/getting-started/intro',
  '/features/run-tasks',
  '/concepts/mental-model',
  '/concepts/decisions/why-monorepos',
  '/recipes/installation/install-non-javascript',
  '/recipes/running-tasks/configure-inputs',
  '/recipes/adopting-nx/from-turborepo',
  '/recipes/nx-release/release-npm-packages'
];

const results = [];

console.log('🔍 Content Comparison Test using Playwright\n');
console.log('This test will compare content between:');
console.log(`  - Production: ${PRODUCTION_URL}`);
console.log(`  - Local Astro: ${LOCAL_ASTRO}/docs\n`);

// First, let's use Playwright to navigate to one of these pages
console.log('Starting browser...\n');

// Navigate to production site first
await mcp__playwright__browser_navigate({ url: PRODUCTION_URL });

for (const urlPath of urlsToTest) {
  console.log(`\n📄 Testing: ${urlPath}`);
  
  // Navigate to production page
  const prodUrl = `${PRODUCTION_URL}${urlPath}`;
  console.log(`  Production: ${prodUrl}`);
  
  await mcp__playwright__browser_navigate({ url: prodUrl });
  await mcp__playwright__browser_wait_for({ time: 2 }); // Wait for page to load
  
  // Get page snapshot from production
  const prodSnapshot = await mcp__playwright__browser_snapshot();
  
  // Navigate to Astro page (with /docs prefix)
  const astroPath = urlPath.startsWith('/') ? `/docs${urlPath}` : `/docs/${urlPath}`;
  const astroUrl = `${LOCAL_ASTRO}${astroPath}`;
  console.log(`  Astro: ${astroUrl}`);
  
  await mcp__playwright__browser_navigate({ url: astroUrl });
  await mcp__playwright__browser_wait_for({ time: 2 }); // Wait for page to load
  
  // Get page snapshot from Astro
  const astroSnapshot = await mcp__playwright__browser_snapshot();
  
  // Compare content
  const comparison = compareSnapshots(prodSnapshot, astroSnapshot);
  
  results.push({
    url: urlPath,
    prodUrl,
    astroUrl,
    ...comparison
  });
  
  // Print result
  if (comparison.contentMatch) {
    console.log(`  ✅ Content matches (${comparison.similarity}% similar)`);
  } else {
    console.log(`  ⚠️  Content differs (${comparison.similarity}% similar)`);
    if (comparison.differences.length > 0) {
      console.log(`     Differences: ${comparison.differences.join(', ')}`);
    }
  }
}

// Generate report
generateReport(results);

function compareSnapshots(prod, astro) {
  // Extract main content from snapshots
  // This is a simplified comparison - in reality we'd parse the accessibility tree
  const prodContent = extractMainContent(prod);
  const astroContent = extractMainContent(astro);
  
  // Calculate similarity
  const similarity = calculateSimilarity(prodContent, astroContent);
  
  // Identify differences
  const differences = [];
  
  if (prodContent.title !== astroContent.title) {
    differences.push('Title mismatch');
  }
  
  if (Math.abs(prodContent.headings.length - astroContent.headings.length) > 2) {
    differences.push(`Heading count difference: ${prodContent.headings.length} vs ${astroContent.headings.length}`);
  }
  
  if (Math.abs(prodContent.paragraphs - astroContent.paragraphs) > 5) {
    differences.push(`Paragraph count difference: ${prodContent.paragraphs} vs ${astroContent.paragraphs}`);
  }
  
  return {
    contentMatch: similarity > 80,
    similarity,
    differences,
    prodContent,
    astroContent
  };
}

function extractMainContent(snapshot) {
  // Parse snapshot to extract content metrics
  // This is simplified - actual implementation would parse the accessibility tree
  const content = typeof snapshot === 'string' ? snapshot : JSON.stringify(snapshot);
  
  return {
    title: extractTitle(content),
    headings: extractHeadings(content),
    paragraphs: countParagraphs(content),
    codeBlocks: countCodeBlocks(content)
  };
}

function extractTitle(content) {
  const match = content.match(/heading[^>]*level="1"[^>]*>([^<]+)/);
  return match ? match[1] : 'Unknown';
}

function extractHeadings(content) {
  const headings = [];
  const regex = /heading[^>]*level="(\d)"[^>]*>([^<]+)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    headings.push({ level: match[1], text: match[2] });
  }
  return headings;
}

function countParagraphs(content) {
  const matches = content.match(/paragraph/g);
  return matches ? matches.length : 0;
}

function countCodeBlocks(content) {
  const matches = content.match(/code/g);
  return matches ? matches.length : 0;
}

function calculateSimilarity(prod, astro) {
  // Simple similarity calculation based on content metrics
  let score = 100;
  
  if (prod.title !== astro.title) score -= 20;
  
  const headingDiff = Math.abs(prod.headings.length - astro.headings.length);
  score -= headingDiff * 5;
  
  const paragraphDiff = Math.abs(prod.paragraphs - astro.paragraphs);
  score -= paragraphDiff * 2;
  
  const codeDiff = Math.abs(prod.codeBlocks - astro.codeBlocks);
  score -= codeDiff * 3;
  
  return Math.max(0, Math.min(100, score));
}

function generateReport(results) {
  const timestamp = new Date().toISOString();
  
  let markdown = `# Content Comparison Report\n\n`;
  markdown += `**Generated**: ${timestamp}\n\n`;
  markdown += `**Production URL**: ${PRODUCTION_URL}\n`;
  markdown += `**Local Astro URL**: ${LOCAL_ASTRO}\n\n`;
  
  markdown += `## Summary\n\n`;
  
  const matching = results.filter(r => r.contentMatch).length;
  const total = results.length;
  
  markdown += `- ✅ Content matches: ${matching}/${total}\n`;
  markdown += `- ⚠️  Content differs: ${total - matching}/${total}\n\n`;
  
  markdown += `## Detailed Results\n\n`;
  
  for (const result of results) {
    markdown += `### ${result.url}\n\n`;
    markdown += `- Production: ${result.prodUrl}\n`;
    markdown += `- Astro: ${result.astroUrl}\n`;
    markdown += `- Similarity: ${result.similarity}%\n`;
    markdown += `- Status: ${result.contentMatch ? '✅ Match' : '⚠️ Differs'}\n`;
    
    if (result.differences.length > 0) {
      markdown += `- Differences:\n`;
      for (const diff of result.differences) {
        markdown += `  - ${diff}\n`;
      }
    }
    
    markdown += '\n';
  }
  
  const reportPath = path.join(__dirname, 'content-comparison-report.md');
  fs.writeFileSync(reportPath, markdown);
  console.log(`\n📄 Report saved to: ${reportPath}`);
}

// Note: This script needs to be run with Playwright MCP functions available
console.log('\n⚠️  Note: This script requires Playwright MCP functions to be available.');
console.log('The actual implementation would use the browser automation tools.');