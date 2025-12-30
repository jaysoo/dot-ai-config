#!/usr/bin/env node
/**
 * Claude Code Usage Statistics
 *
 * Usage: node claude-code-usage.mjs [options]
 *
 * Options:
 *   --json    Output raw JSON instead of formatted text
 *   --days N  Show only last N days (default: all)
 *   --cost    Include estimated cost calculations
 *   --help    Show this help message
 *
 * Installation:
 *   curl -o claude-code-usage.mjs https://raw.githubusercontent.com/YOUR_REPO/scripts/claude-code-usage.mjs
 *   chmod +x claude-code-usage.mjs
 *   ./claude-code-usage.mjs --cost
 */

import { readFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const STATS_FILE = join(homedir(), '.claude', 'stats-cache.json');

// Pricing per 1M tokens
// Source: https://www.anthropic.com/pricing (redirects to https://claude.com/pricing)
// Last updated: 2024-12-30
const PRICING = {
  'claude-opus-4-5-20251101': {
    input: 5,
    output: 25,
    cacheRead: 0.50,
    cacheWrite: 6.25,
    name: 'Opus 4.5',
  },
  'claude-sonnet-4-5-20250929': {
    input: 3,        // ≤200K tokens
    output: 15,      // ≤200K tokens
    cacheRead: 0.30, // ≤200K tokens
    cacheWrite: 3.75,
    name: 'Sonnet 4.5',
  },
  'claude-sonnet-4-20250514': {
    input: 3,
    output: 15,
    cacheRead: 0.30,
    cacheWrite: 3.75,
    name: 'Sonnet 4',
  },
  'claude-3-5-sonnet-20241022': {
    input: 3,
    output: 15,
    cacheRead: 0.30,
    cacheWrite: 3.75,
    name: 'Sonnet 3.5',
  },
};

const PRICING_SOURCE = 'https://www.anthropic.com/pricing';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    json: false,
    days: null,
    cost: false,
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
      case '--cost':
        options.cost = true;
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

function formatTokens(n) {
  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(2)}B`;
  } else if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(2)}M`;
  } else if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1)}K`;
  }
  return n.toString();
}

function shortModelName(model) {
  return model.replace('claude-', '').replace(/-\d{8}$/, '');
}

function calculateCost(usage, model) {
  const p = PRICING[model];
  if (!p) return null;

  return {
    input: (usage.inputTokens / 1_000_000) * p.input,
    output: (usage.outputTokens / 1_000_000) * p.output,
    cacheRead: (usage.cacheReadInputTokens / 1_000_000) * p.cacheRead,
    cacheWrite: (usage.cacheCreationInputTokens / 1_000_000) * p.cacheWrite,
    get total() {
      return this.input + this.output + this.cacheRead + this.cacheWrite;
    }
  };
}

function printUsage(stats, options) {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║              CLAUDE CODE USAGE STATISTICS                    ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Calculate totals across all models
  let totalInput = 0;
  let totalOutput = 0;
  let totalCacheRead = 0;
  let totalCacheWrite = 0;

  for (const usage of Object.values(stats.modelUsage)) {
    totalInput += usage.inputTokens;
    totalOutput += usage.outputTokens;
    totalCacheRead += usage.cacheReadInputTokens;
    totalCacheWrite += usage.cacheCreationInputTokens;
  }

  const grandTotal = totalInput + totalOutput + totalCacheRead + totalCacheWrite;

  // Overview
  console.log('📊 OVERVIEW');
  console.log('─'.repeat(50));
  console.log(`  First session:    ${new Date(stats.firstSessionDate).toLocaleDateString()}`);
  console.log(`  Last computed:    ${stats.lastComputedDate}`);
  console.log(`  Total sessions:   ${formatNumber(stats.totalSessions)}`);
  console.log(`  Total messages:   ${formatNumber(stats.totalMessages)}`);
  console.log('');
  console.log('  Token Totals (all models):');
  console.log(`    Input:          ${formatTokens(totalInput).padStart(10)} (${formatNumber(totalInput)})`);
  console.log(`    Output:         ${formatTokens(totalOutput).padStart(10)} (${formatNumber(totalOutput)})`);
  console.log(`    Cache read:     ${formatTokens(totalCacheRead).padStart(10)} (${formatNumber(totalCacheRead)})`);
  console.log(`    Cache write:    ${formatTokens(totalCacheWrite).padStart(10)} (${formatNumber(totalCacheWrite)})`);
  console.log(`    ─────────────────────────`);
  console.log(`    TOTAL:          ${formatTokens(grandTotal).padStart(10)} (${formatNumber(grandTotal)})`);
  console.log('');

  // Model usage
  console.log('🤖 MODEL USAGE');
  console.log('─'.repeat(50));

  let totalCost = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 };

  for (const [model, usage] of Object.entries(stats.modelUsage)) {
    const pricing = PRICING[model];
    const displayName = pricing?.name || shortModelName(model);

    console.log(`  ${displayName}:`);
    console.log(`    Input tokens:        ${formatNumber(usage.inputTokens).padStart(15)}`);
    console.log(`    Output tokens:       ${formatNumber(usage.outputTokens).padStart(15)}`);
    console.log(`    Cache read tokens:   ${formatNumber(usage.cacheReadInputTokens).padStart(15)}`);
    console.log(`    Cache write tokens:  ${formatNumber(usage.cacheCreationInputTokens).padStart(15)}`);

    if (options.cost && pricing) {
      const cost = calculateCost(usage, model);
      totalCost.input += cost.input;
      totalCost.output += cost.output;
      totalCost.cacheRead += cost.cacheRead;
      totalCost.cacheWrite += cost.cacheWrite;
      totalCost.total += cost.total;
      console.log(`    ─────────────────────────────`);
      console.log(`    Estimated cost:      $${cost.total.toFixed(2).padStart(14)}`);
    }
    console.log('');
  }

  // Cost breakdown
  if (options.cost) {
    console.log('💰 COST BREAKDOWN');
    console.log('─'.repeat(50));
    console.log(`  Input tokens:      $${totalCost.input.toFixed(2).padStart(10)}`);
    console.log(`  Output tokens:     $${totalCost.output.toFixed(2).padStart(10)}`);
    console.log(`  Cache read:        $${totalCost.cacheRead.toFixed(2).padStart(10)}`);
    console.log(`  Cache write:       $${totalCost.cacheWrite.toFixed(2).padStart(10)}`);
    console.log(`  ─────────────────────────`);
    console.log(`  TOTAL:             $${totalCost.total.toFixed(2).padStart(10)}`);
    console.log('');
    console.log(`  💡 Without caching, input would cost: $${((totalCacheRead / 1_000_000) * 5).toFixed(2)}`);
    console.log(`     Cache savings: ~$${(((totalCacheRead / 1_000_000) * 5) - totalCost.cacheRead).toFixed(2)}`);
    console.log('');
    console.log(`  Source: ${PRICING_SOURCE}`);
    console.log('  Note: Prices as of 2024-12-30. Claude Max subscribers pay flat rate.');
    console.log('');
  }

  // Daily activity
  let dailyData = stats.dailyActivity;
  if (options.days) {
    dailyData = dailyData.slice(-options.days);
  }

  console.log(`📅 DAILY ACTIVITY${options.days ? ` (last ${options.days} days)` : ''}`);
  console.log('─'.repeat(50));
  console.log('  Date        Messages  Sessions  Tool Calls');
  console.log('  ' + '─'.repeat(46));

  for (const day of dailyData) {
    const msgs = day.messageCount.toString().padStart(8);
    const sess = day.sessionCount.toString().padStart(8);
    const tools = day.toolCallCount.toString().padStart(11);
    console.log(`  ${day.date}  ${msgs}  ${sess}  ${tools}`);
  }
  console.log('');

  // Daily tokens by model
  let tokenData = stats.dailyModelTokens || [];
  if (options.days) {
    tokenData = tokenData.slice(-options.days);
  }

  if (tokenData.length > 0) {
    console.log(`🔢 DAILY TOKENS BY MODEL${options.days ? ` (last ${options.days} days)` : ''}`);
    console.log('─'.repeat(50));

    for (const day of tokenData) {
      console.log(`  ${day.date}:`);
      for (const [model, tokens] of Object.entries(day.tokensByModel)) {
        const pricing = PRICING[model];
        const displayName = pricing?.name || shortModelName(model);
        console.log(`    ${displayName}: ${formatNumber(tokens)} tokens`);
      }
    }
    console.log('');
  }

  // Activity by hour
  console.log('⏰ ACTIVITY BY HOUR (sessions started)');
  console.log('─'.repeat(50));
  const hours = Object.entries(stats.hourCounts || {})
    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

  const maxCount = Math.max(...hours.map(h => h[1]));
  for (const [hour, count] of hours) {
    const bar = '█'.repeat(Math.round((count / maxCount) * 20));
    const h = hour.padStart(2, '0');
    console.log(`  ${h}:00  ${bar} ${count}`);
  }
  console.log('');

  // Averages
  const totalDays = stats.dailyActivity.length;
  const avgMessagesPerDay = Math.round(stats.totalMessages / totalDays);
  const avgSessionsPerDay = (stats.totalSessions / totalDays).toFixed(1);

  // Calculate working days (actual days with activity)
  const activeDays = stats.dailyActivity.length;

  // Calculate calendar span for context
  const firstDate = new Date(stats.firstSessionDate);
  const lastDate = new Date(stats.lastComputedDate);
  const calendarDays = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  const estimatedWorkingDays = Math.round(calendarDays * 5 / 7);

  console.log('📈 AVERAGES');
  console.log('─'.repeat(50));
  console.log(`  Messages per day:     ${avgMessagesPerDay}`);
  console.log(`  Sessions per day:     ${avgSessionsPerDay}`);
  console.log(`  Messages per session: ${Math.round(stats.totalMessages / stats.totalSessions)}`);
  console.log('');

  // Tokens per working day
  console.log('📆 TOKENS PER WORKING DAY');
  console.log('─'.repeat(50));
  console.log(`  Calendar span:        ${calendarDays} days (${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()})`);
  console.log(`  Est. working days:    ${estimatedWorkingDays} days (~5/7 of calendar)`);
  console.log(`  Active days:          ${activeDays} days (days with usage)`);
  console.log('');

  const tokensPerWorkingDay = grandTotal / estimatedWorkingDays;
  const tokensPerActiveDay = grandTotal / activeDays;

  console.log('  Per estimated working day:');
  console.log(`    Total tokens:       ${formatTokens(tokensPerWorkingDay).padStart(10)} /day`);
  console.log(`    Input:              ${formatTokens(totalInput / estimatedWorkingDays).padStart(10)} /day`);
  console.log(`    Output:             ${formatTokens(totalOutput / estimatedWorkingDays).padStart(10)} /day`);
  console.log(`    Cache read:         ${formatTokens(totalCacheRead / estimatedWorkingDays).padStart(10)} /day`);
  console.log(`    Cache write:        ${formatTokens(totalCacheWrite / estimatedWorkingDays).padStart(10)} /day`);

  if (options.cost && totalCost.total > 0) {
    const costPerWorkingDay = totalCost.total / estimatedWorkingDays;
    console.log(`    Est. cost:          $${costPerWorkingDay.toFixed(2).padStart(9)} /day`);
  }
  console.log('');

  console.log('  Per active day (days with usage):');
  console.log(`    Total tokens:       ${formatTokens(tokensPerActiveDay).padStart(10)} /day`);

  if (options.cost && totalCost.total > 0) {
    const costPerActiveDay = totalCost.total / activeDays;
    console.log(`    Est. cost:          $${costPerActiveDay.toFixed(2).padStart(9)} /day`);
  }
  console.log('');
}

function main() {
  const options = parseArgs();

  if (options.help) {
    console.log(`
Claude Code Usage Statistics

Usage: node claude-code-usage.mjs [options]

Options:
  --json    Output raw JSON instead of formatted text
  --days N  Show only last N days (default: all)
  --cost    Include estimated cost calculations
  --help    Show this help message

Data location: ~/.claude/stats-cache.json
Pricing source: ${PRICING_SOURCE}
`);
    process.exit(0);
  }

  if (!existsSync(STATS_FILE)) {
    console.error(`Error: Claude Code stats file not found at ${STATS_FILE}`);
    console.error('Make sure you have Claude Code installed and have used it at least once.');
    process.exit(1);
  }

  const stats = JSON.parse(readFileSync(STATS_FILE, 'utf8'));

  if (options.json) {
    console.log(JSON.stringify(stats, null, 2));
    process.exit(0);
  }

  printUsage(stats, options);
}

main();
