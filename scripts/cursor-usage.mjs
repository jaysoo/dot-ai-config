#!/usr/bin/env node
/**
 * Cursor AI Usage Statistics
 *
 * Usage: node cursor-usage.mjs [options]
 *
 * Options:
 *   --json    Output raw JSON instead of formatted text
 *   --days N  Show only last N days (default: all)
 *   --help    Show this help message
 *
 * Note: Cursor does NOT store token usage locally - only server-side.
 * This script tracks AI code generation activity (code blocks, sources, commits).
 *
 * Installation:
 *   curl -o cursor-usage.mjs https://raw.githubusercontent.com/YOUR_REPO/scripts/cursor-usage.mjs
 *   chmod +x cursor-usage.mjs
 *   ./cursor-usage.mjs
 */

import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { execSync } from 'child_process';

const STATE_DB = join(homedir(), 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'state.vscdb');
const AI_TRACKING_DB = join(homedir(), '.cursor', 'ai-tracking', 'ai-code-tracking.db');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    json: false,
    days: null,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--json':
        options.json = true;
        break;
      case '--days':
        options.days = parseInt(args[++i], 10);
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

function formatNumber(n) {
  return n.toLocaleString();
}

function sqliteQuery(dbPath, query) {
  try {
    const result = execSync(`sqlite3 "${dbPath}" "${query}"`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large results
    });
    return result.trim();
  } catch (e) {
    return '';
  }
}

function getStateValue(key) {
  const result = sqliteQuery(STATE_DB, `SELECT value FROM ItemTable WHERE key = '${key}'`);
  if (!result) return null;
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
}

function getAllDailyStats() {
  const query = `SELECT key, value FROM ItemTable WHERE key LIKE 'aiCodeTracking.dailyStats%' ORDER BY key`;
  const result = sqliteQuery(STATE_DB, query);
  if (!result) return [];

  const stats = [];
  const lines = result.split('\n');
  for (const line of lines) {
    const pipeIndex = line.indexOf('|');
    if (pipeIndex === -1) continue;
    const value = line.slice(pipeIndex + 1);
    try {
      stats.push(JSON.parse(value));
    } catch {}
  }
  return stats.sort((a, b) => a.date.localeCompare(b.date));
}

function getAICodeHashes() {
  const result = getStateValue('aiCodeTrackingLines');
  return Array.isArray(result) ? result : [];
}

function getScoredCommits() {
  const result = getStateValue('aiCodeTrackingScoredCommits');
  return Array.isArray(result) ? result : [];
}

function getTrackingStartTime() {
  const result = getStateValue('aiCodeTrackingStartTime');
  return result?.timestamp ? new Date(result.timestamp) : null;
}

function collectStats() {
  const aiCodeHashes = getAICodeHashes();
  const dailyStats = getAllDailyStats();
  const scoredCommits = getScoredCommits();
  const trackingStart = getTrackingStartTime();

  // Count by source
  const sourceBreakdown = { tab: 0, composer: 0, unknown: 0 };
  for (const entry of aiCodeHashes) {
    const source = entry.metadata?.source || 'unknown';
    sourceBreakdown[source] = (sourceBreakdown[source] || 0) + 1;
  }

  // Aggregate daily stats
  let totalTabSuggested = 0;
  let totalTabAccepted = 0;
  let totalComposerSuggested = 0;
  let totalComposerAccepted = 0;

  for (const day of dailyStats) {
    totalTabSuggested += day.tabSuggestedLines || 0;
    totalTabAccepted += day.tabAcceptedLines || 0;
    totalComposerSuggested += day.composerSuggestedLines || 0;
    totalComposerAccepted += day.composerAcceptedLines || 0;
  }

  return {
    trackingStartDate: trackingStart?.toISOString() || null,
    lastUpdated: new Date().toISOString(),
    aiCodeBlocks: {
      total: aiCodeHashes.length,
      bySource: sourceBreakdown,
    },
    scoredCommits: scoredCommits.length,
    dailyStats,
    totals: {
      tabSuggestedLines: totalTabSuggested,
      tabAcceptedLines: totalTabAccepted,
      composerSuggestedLines: totalComposerSuggested,
      composerAcceptedLines: totalComposerAccepted,
      totalSuggestedLines: totalTabSuggested + totalComposerSuggested,
      totalAcceptedLines: totalTabAccepted + totalComposerAccepted,
    },
  };
}

function printUsage(stats, options) {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║               CURSOR AI USAGE STATISTICS                     ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Overview
  console.log('📊 OVERVIEW');
  console.log('─'.repeat(50));
  if (stats.trackingStartDate) {
    console.log(`  Tracking since:     ${new Date(stats.trackingStartDate).toLocaleDateString()}`);
  }
  console.log(`  AI code blocks:     ${formatNumber(stats.aiCodeBlocks.total)}`);
  console.log(`  Scored commits:     ${formatNumber(stats.scoredCommits)}`);
  console.log('');

  // Source breakdown
  console.log('🤖 AI CODE BY SOURCE');
  console.log('─'.repeat(50));
  const { bySource } = stats.aiCodeBlocks;
  const total = stats.aiCodeBlocks.total || 1;

  console.log(`  Tab (autocomplete): ${formatNumber(bySource.tab).padStart(10)} (${((bySource.tab / total) * 100).toFixed(1)}%)`);
  console.log(`  Composer (chat):    ${formatNumber(bySource.composer).padStart(10)} (${((bySource.composer / total) * 100).toFixed(1)}%)`);
  if (bySource.unknown > 0) {
    console.log(`  Unknown:            ${formatNumber(bySource.unknown).padStart(10)} (${((bySource.unknown / total) * 100).toFixed(1)}%)`);
  }
  console.log(`  ─────────────────────────`);
  console.log(`  TOTAL:              ${formatNumber(stats.aiCodeBlocks.total).padStart(10)}`);
  console.log('');

  // Lines summary
  if (stats.totals.totalSuggestedLines > 0 || stats.totals.totalAcceptedLines > 0) {
    console.log('📝 LINES OF CODE');
    console.log('─'.repeat(50));
    console.log('  Tab Autocomplete:');
    console.log(`    Suggested:        ${formatNumber(stats.totals.tabSuggestedLines).padStart(10)} lines`);
    console.log(`    Accepted:         ${formatNumber(stats.totals.tabAcceptedLines).padStart(10)} lines`);
    if (stats.totals.tabSuggestedLines > 0) {
      const tabRate = (stats.totals.tabAcceptedLines / stats.totals.tabSuggestedLines * 100).toFixed(1);
      console.log(`    Acceptance rate:  ${tabRate.padStart(10)}%`);
    }
    console.log('');
    console.log('  Composer/Chat:');
    console.log(`    Suggested:        ${formatNumber(stats.totals.composerSuggestedLines).padStart(10)} lines`);
    console.log(`    Accepted:         ${formatNumber(stats.totals.composerAcceptedLines).padStart(10)} lines`);
    if (stats.totals.composerSuggestedLines > 0) {
      const compRate = (stats.totals.composerAcceptedLines / stats.totals.composerSuggestedLines * 100).toFixed(1);
      console.log(`    Acceptance rate:  ${compRate.padStart(10)}%`);
    }
    console.log('');
    console.log('  Combined:');
    console.log(`    Total suggested:  ${formatNumber(stats.totals.totalSuggestedLines).padStart(10)} lines`);
    console.log(`    Total accepted:   ${formatNumber(stats.totals.totalAcceptedLines).padStart(10)} lines`);
    if (stats.totals.totalSuggestedLines > 0) {
      const totalRate = (stats.totals.totalAcceptedLines / stats.totals.totalSuggestedLines * 100).toFixed(1);
      console.log(`    Acceptance rate:  ${totalRate.padStart(10)}%`);
    }
    console.log('');
  }

  // Daily activity
  let dailyData = stats.dailyStats;
  if (options.days) {
    dailyData = dailyData.slice(-options.days);
  }

  if (dailyData.length > 0) {
    console.log(`📅 DAILY ACTIVITY${options.days ? ` (last ${options.days} days)` : ''}`);
    console.log('─'.repeat(60));
    console.log('  Date        Tab Sugg  Tab Acc  Comp Sugg  Comp Acc');
    console.log('  ' + '─'.repeat(56));

    for (const day of dailyData) {
      const tabS = (day.tabSuggestedLines || 0).toString().padStart(8);
      const tabA = (day.tabAcceptedLines || 0).toString().padStart(8);
      const compS = (day.composerSuggestedLines || 0).toString().padStart(10);
      const compA = (day.composerAcceptedLines || 0).toString().padStart(9);
      console.log(`  ${day.date}  ${tabS}  ${tabA}  ${compS}  ${compA}`);
    }
    console.log('');
  }

  // Note about limitations
  console.log('ℹ️  NOTE');
  console.log('─'.repeat(50));
  console.log('  Cursor does NOT store token usage locally.');
  console.log('  Token/cost data is only available server-side.');
  console.log('  This report shows AI code generation activity only.');
  console.log('');
}

function main() {
  const options = parseArgs();

  if (options.help) {
    console.log(`
Cursor AI Usage Statistics

Usage: node cursor-usage.mjs [options]

Options:
  --json    Output raw JSON instead of formatted text
  --days N  Show only last N days (default: all)
  --help    Show this help message

Data locations:
  State DB: ~/Library/Application Support/Cursor/User/globalStorage/state.vscdb
  AI Tracking: ~/.cursor/ai-tracking/ai-code-tracking.db

Note: Cursor does NOT store token/cost data locally - only server-side.
This script tracks AI code generation activity (code blocks, commits, lines).
`);
    process.exit(0);
  }

  if (!existsSync(STATE_DB)) {
    console.error(`Error: Cursor state database not found at ${STATE_DB}`);
    console.error('Make sure you have Cursor installed and have used it at least once.');
    process.exit(1);
  }

  const stats = collectStats();

  if (options.json) {
    console.log(JSON.stringify(stats, null, 2));
    process.exit(0);
  }

  printUsage(stats, options);
}

main();
