#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Paths to analyze
const docsPath = join(process.cwd(), 'docs');
const introPagePath = join(docsPath, 'shared', 'getting-started', 'intro.md');

console.log('=== Nx Intro Page Analysis ===\n');

// Check if intro page exists
if (!existsSync(introPagePath)) {
  console.error(`Intro page not found at: ${introPagePath}`);
  process.exit(1);
}

// Read intro page content
const content = readFileSync(introPagePath, 'utf-8');

// Analyze content metrics
const metrics = {
  totalLines: content.split('\n').length,
  wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
  codeBlocks: (content.match(/```/g) || []).length / 2,
  links: (content.match(/\[.*?\]\(.*?\)/g) || []).length,
  headings: (content.match(/^#+\s/gm) || []).length,
  images: (content.match(/!\[.*?\]\(.*?\)/g) || []).length,
  videos: (content.match(/youtube|video|iframe/gi) || []).length,
};

console.log('Content Metrics:');
console.log(`- Total lines: ${metrics.totalLines}`);
console.log(`- Word count: ${metrics.wordCount}`);
console.log(`- Code blocks: ${metrics.codeBlocks}`);
console.log(`- Links: ${metrics.links}`);
console.log(`- Headings: ${metrics.headings}`);
console.log(`- Images: ${metrics.images}`);
console.log(`- Videos/embeds: ${metrics.videos}`);

// Extract main sections
console.log('\nMain Sections:');
const headings = content.match(/^##\s(.+)$/gm) || [];
headings.forEach((heading, index) => {
  console.log(`${index + 1}. ${heading.replace('## ', '')}`);
});

// Find "getting started" commands
console.log('\nGetting Started Commands Found:');
const commands = content.match(/```(?:bash|shell|sh)?\n([\s\S]*?)```/g) || [];
commands.forEach((cmd, index) => {
  const command = cmd.replace(/```(?:bash|shell|sh)?\n/, '').replace(/```/, '').trim();
  if (command.includes('nx') || command.includes('npx') || command.includes('npm')) {
    console.log(`${index + 1}. ${command.split('\n')[0]}`);
  }
});

// Analyze complexity indicators
console.log('\nComplexity Indicators:');
const complexityIndicators = {
  optionCount: (content.match(/\bor\b|\balternatively\b|\beither\b/gi) || []).length,
  conditionals: (content.match(/\bif\b|\bwhen\b|\bdepending\b/gi) || []).length,
  prerequisites: (content.match(/\bbefore\b|\bfirst\b|\bprerequisite\b/gi) || []).length,
  advancedTerms: (content.match(/\bmonorepo\b|\borchestration\b|\bgraph\b|\bworkspace\b/gi) || []).length,
};

console.log(`- Decision points (or/alternatively): ${complexityIndicators.optionCount}`);
console.log(`- Conditional statements: ${complexityIndicators.conditionals}`);
console.log(`- Prerequisites mentioned: ${complexityIndicators.prerequisites}`);
console.log(`- Advanced terminology: ${complexityIndicators.advancedTerms}`);

// Time to value analysis
console.log('\nTime to First Value:');
const firstCommandIndex = content.search(/```(?:bash|shell|sh)?\n.*?nx/);
const firstCommandLine = content.substring(0, firstCommandIndex).split('\n').length;
console.log(`- First nx command appears at line: ${firstCommandLine}`);
console.log(`- Words before first command: ${content.substring(0, firstCommandIndex).split(/\s+/).length}`);

// Recommendations
console.log('\n=== Recommendations ===');
if (metrics.wordCount > 500) {
  console.log('⚠️  Page is too wordy (>500 words). Consider reducing to <300 for intro.');
}
if (firstCommandLine > 20) {
  console.log('⚠️  First command appears too late. Move it above the fold (< line 20).');
}
if (complexityIndicators.optionCount > 5) {
  console.log('⚠️  Too many options presented. Reduce decision points.');
}
if (metrics.links > 20) {
  console.log('⚠️  Too many links. Focus on primary path, defer others.');
}

console.log('\n✅ Goal: Get users to "nx init" within 60 seconds of landing.');