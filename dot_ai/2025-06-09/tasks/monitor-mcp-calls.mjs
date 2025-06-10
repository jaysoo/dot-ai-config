#!/usr/bin/env node

import { readFile, writeFile, appendFile } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOG_FILE = join(__dirname, 'mcp-usage-log.json');
const METRICS_FILE = join(__dirname, 'mcp-metrics.json');

/**
 * Log an MCP function call for monitoring
 */
async function logMCPCall(callData) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ...callData
  };

  // Append to log file
  let logs = [];
  if (existsSync(LOG_FILE)) {
    const content = await readFile(LOG_FILE, 'utf8');
    logs = JSON.parse(content);
  }
  
  logs.push(logEntry);
  await writeFile(LOG_FILE, JSON.stringify(logs, null, 2));
  
  // Update metrics
  await updateMetrics(logEntry);
}

/**
 * Update aggregated metrics
 */
async function updateMetrics(logEntry) {
  let metrics = {
    totalCalls: 0,
    functionCalls: {},
    successRate: 0,
    avgResponseTime: 0,
    categoryCounts: {},
    hourlyDistribution: Array(24).fill(0),
    lastUpdated: new Date().toISOString()
  };

  if (existsSync(METRICS_FILE)) {
    const content = await readFile(METRICS_FILE, 'utf8');
    metrics = JSON.parse(content);
  }

  // Update counts
  metrics.totalCalls++;
  
  const func = logEntry.function || 'unknown';
  metrics.functionCalls[func] = (metrics.functionCalls[func] || 0) + 1;
  
  if (logEntry.category) {
    metrics.categoryCounts[logEntry.category] = (metrics.categoryCounts[logEntry.category] || 0) + 1;
  }

  // Update hourly distribution
  const hour = new Date(logEntry.timestamp).getHours();
  metrics.hourlyDistribution[hour]++;

  // Update success rate
  if (logEntry.success !== undefined) {
    const logs = JSON.parse(await readFile(LOG_FILE, 'utf8'));
    const successfulCalls = logs.filter(l => l.success === true).length;
    metrics.successRate = (successfulCalls / logs.length) * 100;
  }

  metrics.lastUpdated = new Date().toISOString();
  
  await writeFile(METRICS_FILE, JSON.stringify(metrics, null, 2));
}

/**
 * Generate usage report
 */
async function generateReport() {
  if (!existsSync(METRICS_FILE)) {
    console.log('No metrics data available. Start using MCP functions to generate data.');
    return;
  }

  const metrics = JSON.parse(await readFile(METRICS_FILE, 'utf8'));
  
  console.log('\n📊 MCP Server Usage Report\n' + '='.repeat(50));
  
  console.log(`\n📈 Overall Statistics:`);
  console.log(`   Total Calls: ${metrics.totalCalls}`);
  console.log(`   Success Rate: ${metrics.successRate.toFixed(1)}%`);
  console.log(`   Last Updated: ${new Date(metrics.lastUpdated).toLocaleString()}`);
  
  console.log(`\n🔧 Function Usage:`);
  const sortedFunctions = Object.entries(metrics.functionCalls)
    .sort(([,a], [,b]) => b - a);
  for (const [func, count] of sortedFunctions) {
    const percentage = ((count / metrics.totalCalls) * 100).toFixed(1);
    console.log(`   ${func}: ${count} calls (${percentage}%)`);
  }
  
  console.log(`\n📁 Category Distribution:`);
  for (const [category, count] of Object.entries(metrics.categoryCounts)) {
    const percentage = ((count / metrics.totalCalls) * 100).toFixed(1);
    console.log(`   ${category}: ${count} calls (${percentage}%)`);
  }
  
  console.log(`\n⏰ Peak Usage Hours:`);
  const peakHours = metrics.hourlyDistribution
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  for (const { hour, count } of peakHours) {
    if (count > 0) {
      console.log(`   ${hour}:00 - ${count} calls`);
    }
  }
  
  // Recommendations
  console.log(`\n💡 Recommendations:`);
  
  if (metrics.totalCalls < 50) {
    console.log('   - Usage is low. Consider adding more MCP triggers to CLAUDE.md');
  }
  
  const searchUsage = (metrics.functionCalls.search_ai_content || 0) / metrics.totalCalls;
  if (searchUsage < 0.5) {
    console.log('   - search_ai_content is underutilized. Add more search triggers');
  }
  
  if (!metrics.functionCalls.get_task_context) {
    console.log('   - Task continuation feature unused. Promote "continue working on" queries');
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
}

/**
 * Analyze missed opportunities
 */
async function analyzeMissedOpportunities(queryLog) {
  const missed = [];
  
  for (const query of queryLog) {
    // Check if query should have used MCP but didn't
    if (query.text.toLowerCase().includes('my') && 
        !query.usedMCP &&
        (query.text.includes('notes') || 
         query.text.includes('tasks') || 
         query.text.includes('work'))) {
      missed.push({
        query: query.text,
        timestamp: query.timestamp,
        suggestedFunction: 'search_ai_content'
      });
    }
  }
  
  if (missed.length > 0) {
    console.log('\n⚠️  Missed MCP Opportunities:\n');
    for (const m of missed.slice(0, 5)) {
      console.log(`Query: "${m.query}"`);
      console.log(`Should have used: ${m.suggestedFunction}\n`);
    }
  }
  
  return missed;
}

/**
 * Monitor real-time usage (mock implementation)
 */
async function monitorRealTime() {
  console.log('🔍 Monitoring MCP usage... (Press Ctrl+C to stop)\n');
  
  // In a real implementation, this would connect to the MCP server
  // and monitor actual calls. For now, we'll simulate some calls.
  
  const sampleCalls = [
    { function: 'search_ai_content', category: 'notes', success: true, query: 'authentication' },
    { function: 'get_task_context', success: true, task: 'API redesign' },
    { function: 'find_specs', success: true, spec: 'database schema' },
    { function: 'search_ai_content', category: 'tasks', success: true, query: 'yesterday' },
    { function: 'extract_todos', success: true }
  ];
  
  for (const call of sampleCalls) {
    await logMCPCall(call);
    console.log(`[${new Date().toISOString()}] ${call.function} called`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'report':
    await generateReport();
    break;
  
  case 'monitor':
    await monitorRealTime();
    break;
  
  case 'analyze':
    // In a real implementation, this would read from actual query logs
    console.log('Analysis feature requires integration with AI tool logs.');
    break;
  
  default:
    console.log(`
MCP Usage Monitor

Usage:
  node monitor-mcp-calls.mjs report   - Generate usage report
  node monitor-mcp-calls.mjs monitor  - Monitor real-time usage
  node monitor-mcp-calls.mjs analyze  - Analyze missed opportunities

This tool helps track MCP server usage and identify optimization opportunities.
    `);
}

// Export for use in other scripts
export { logMCPCall, generateReport, analyzeMissedOpportunities };