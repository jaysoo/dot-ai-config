#!/usr/bin/env node

import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load keyword mappings
const keywordMapping = JSON.parse(
  await readFile(join(__dirname, 'keyword-mapping.json'), 'utf8')
);

/**
 * Analyze a query and determine which MCP function to use
 * @param {string} query - The user's query
 * @returns {Object} - Analysis result with function recommendation
 */
function analyzeQuery(query) {
  const lowerQuery = query.toLowerCase();
  const result = {
    query: query,
    matchedKeywords: [],
    recommendedFunction: null,
    confidence: 0,
    parameters: {}
  };

  // Apply priority rules first to boost confidence
  const priorityRules = keywordMapping.priority_rules;
  let hasPriorityIndicator = false;
  
  // Check positive indicators
  for (const indicator of priorityRules.use_mcp_when.personal_pronouns) {
    if (lowerQuery.includes(indicator)) {
      hasPriorityIndicator = true;
      break;
    }
  }

  // Check each MCP function's triggers
  for (const [functionName, triggers] of Object.entries(keywordMapping.keyword_mappings)) {
    let matchScore = 0;
    const functionMatches = [];

    // Check primary triggers
    if (triggers.primary_triggers) {
      for (const trigger of triggers.primary_triggers) {
        if (lowerQuery.includes(trigger)) {
          matchScore += 3; // Primary triggers worth more
          functionMatches.push(trigger);
        }
      }
    }

    // Check action phrases
    if (triggers.action_phrases) {
      for (const phrase of triggers.action_phrases) {
        if (lowerQuery.includes(phrase)) {
          matchScore += 2;
          functionMatches.push(phrase);
        }
      }
    }

    // Check temporal queries
    if (triggers.temporal_queries) {
      for (const temporal of triggers.temporal_queries) {
        if (lowerQuery.includes(temporal)) {
          matchScore += 2;
          functionMatches.push(temporal);
        }
      }
    }

    // Check memory queries
    if (triggers.memory_queries) {
      for (const memory of triggers.memory_queries) {
        if (lowerQuery.includes(memory)) {
          matchScore += 2;
          functionMatches.push(memory);
        }
      }
    }

    // Check content types for search_ai_content
    if (functionName === 'search_ai_content' && triggers.content_types) {
      for (const [category, terms] of Object.entries(triggers.content_types)) {
        for (const term of terms) {
          if (lowerQuery.includes(term)) {
            matchScore += 2;
            functionMatches.push(term);
          }
        }
      }
    }

    // Boost score if we have priority indicators
    if (hasPriorityIndicator && matchScore > 0) {
      matchScore *= 1.5;
    }

    // Calculate confidence (normalize to 0-1)
    const confidence = Math.min(matchScore / 10, 1.0);
    
    if (confidence > result.confidence) {
      result.confidence = confidence;
      result.recommendedFunction = functionName;
      result.matchedKeywords = functionMatches;
    }
  }

  // Extract parameters based on the query
  if (result.recommendedFunction === 'search_ai_content') {
    // Extract category
    for (const [category, terms] of Object.entries(keywordMapping.keyword_mappings.search_ai_content.content_types)) {
      for (const term of terms) {
        if (lowerQuery.includes(term)) {
          result.parameters.category = category;
          break;
        }
      }
    }

    // Extract date references
    const datePatterns = [
      /today/i,
      /yesterday/i,
      /last week/i,
      /this week/i,
      /(\d{4}-\d{2}-\d{2})/
    ];
    
    for (const pattern of datePatterns) {
      const match = query.match(pattern);
      if (match) {
        result.parameters.dateReference = match[0];
      }
    }
  }

  // Check negative indicators last
  for (const indicator of priorityRules.skip_mcp_when.external_indicators) {
    if (lowerQuery.includes(indicator) && !lowerQuery.includes('my')) {
      result.confidence = 0;
      result.recommendedFunction = null;
    }
  }

  return result;
}

// Test cases
const testQueries = [
  // High confidence MCP queries
  "What specs do I have for the project?",
  "Show me my notes from last week",
  "Find my dictation about API design",
  "What tasks did I work on yesterday?",
  "Get my todos for today",
  
  // Medium confidence queries
  "Search for documentation about authentication",
  "Find information about the database schema",
  "What work was done on the feature?",
  
  // Low/No MCP queries
  "How do I install React?",
  "What is the syntax for async functions?",
  "Show me the Python documentation",
  
  // Context continuation queries
  "Continue working on the MCP server enhancement",
  "Resume the authentication task",
  "Pick up where I left off with the API design",
  
  // Summary queries
  "Give me a daily summary",
  "What happened yesterday?",
  "Summary of this week's work"
];

console.log('MCP Keyword Mapping Test Results\n' + '='.repeat(50) + '\n');

for (const query of testQueries) {
  const analysis = analyzeQuery(query);
  console.log(`Query: "${query}"`);
  console.log(`Recommended Function: ${analysis.recommendedFunction || 'None (use other tools)'}`);
  console.log(`Confidence: ${(analysis.confidence * 100).toFixed(1)}%`);
  if (analysis.matchedKeywords.length > 0) {
    console.log(`Matched Keywords: ${analysis.matchedKeywords.join(', ')}`);
  }
  if (Object.keys(analysis.parameters).length > 0) {
    console.log(`Extracted Parameters: ${JSON.stringify(analysis.parameters)}`);
  }
  console.log('-'.repeat(50) + '\n');
}

// Export for use in other scripts
export { analyzeQuery, keywordMapping };