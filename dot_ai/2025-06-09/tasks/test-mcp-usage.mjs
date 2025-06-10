#!/usr/bin/env node

import { analyzeQuery } from './test-keyword-mapping.mjs';

/**
 * Test cases from usage-examples.md to verify our keyword mapping works correctly
 */
const usageExamples = [
  // Search Examples
  {
    query: "Show me my notes about authentication",
    expectedFunction: "search_ai_content",
    expectedParams: { category: "notes" }
  },
  {
    query: "Find all my dictations from last week",
    expectedFunction: "search_ai_content",
    expectedParams: { category: "dictations" }
  },
  {
    query: "What tasks did I work on yesterday?",
    expectedFunction: "search_ai_content",
    expectedParams: { category: "tasks" }
  },
  {
    query: "Did I mention anything about API design in my notes?",
    expectedFunction: "search_ai_content",
    expectedParams: {}
  },
  
  // Specification Lookup
  {
    query: "What specs do I have for the raw docs system?",
    expectedFunction: "find_specs",
    expectedParams: {}
  },
  {
    query: "Show me all my specification documents",
    expectedFunction: "search_ai_content",
    expectedParams: {}
  },
  
  // Task Context
  {
    query: "Continue working on the MCP server enhancement",
    expectedFunction: "get_task_context",
    expectedParams: {}
  },
  {
    query: "Where did I leave off with the API redesign?",
    expectedFunction: "get_task_context",
    expectedParams: {}
  },
  
  // Summaries
  {
    query: "Give me today's summary",
    expectedFunction: "get_summaries",
    expectedParams: {}
  },
  {
    query: "What's the latest project summary?",
    expectedFunction: "get_summaries",
    expectedParams: {}
  },
  
  // TODOs
  {
    query: "What are my pending todos?",
    expectedFunction: "extract_todos",
    expectedParams: {}
  },
  {
    query: "Show me todos from my task files",
    expectedFunction: "extract_todos",
    expectedParams: {}
  },
  
  // Should NOT use MCP
  {
    query: "How do I use React hooks?",
    expectedFunction: null,
    expectedParams: {}
  },
  {
    query: "What's the Python syntax for list comprehension?",
    expectedFunction: null,
    expectedParams: {}
  }
];

console.log('MCP Usage Examples Test\n' + '='.repeat(50) + '\n');

let passed = 0;
let failed = 0;

for (const example of usageExamples) {
  const analysis = analyzeQuery(example.query);
  const success = analysis.recommendedFunction === example.expectedFunction;
  
  console.log(`Query: "${example.query}"`);
  console.log(`Expected: ${example.expectedFunction || 'None (use other tools)'}`);
  console.log(`Got: ${analysis.recommendedFunction || 'None (use other tools)'}`);
  console.log(`Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
  console.log(`Status: ${success ? '✅ PASS' : '❌ FAIL'}`);
  
  if (analysis.matchedKeywords.length > 0) {
    console.log(`Matched: ${analysis.matchedKeywords.join(', ')}`);
  }
  
  if (Object.keys(analysis.parameters).length > 0) {
    console.log(`Parameters: ${JSON.stringify(analysis.parameters)}`);
  }
  
  if (success) passed++;
  else failed++;
  
  console.log('-'.repeat(50) + '\n');
}

console.log(`\nTest Summary: ${passed} passed, ${failed} failed (${((passed / usageExamples.length) * 100).toFixed(1)}% success rate)`);

// Additional confidence threshold test
console.log('\nConfidence Threshold Analysis:');
const confidenceThresholds = [0.3, 0.5, 0.7];
for (const threshold of confidenceThresholds) {
  let correctWithThreshold = 0;
  for (const example of usageExamples) {
    const analysis = analyzeQuery(example.query);
    const shouldUseMcp = example.expectedFunction !== null;
    const wouldUseMcp = analysis.confidence >= threshold && analysis.recommendedFunction !== null;
    if (shouldUseMcp === wouldUseMcp) correctWithThreshold++;
  }
  console.log(`Threshold ${threshold}: ${((correctWithThreshold / usageExamples.length) * 100).toFixed(1)}% accuracy`);
}