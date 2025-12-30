#!/usr/bin/env node
/**
 * VSCode / GitHub Copilot Usage Statistics
 *
 * Usage: node vscode-copilot-usage.mjs [options]
 *
 * Options:
 *   --json    Output raw JSON instead of formatted text
 *   --help    Show this help message
 *
 * Note: VSCode/Copilot stores very limited usage data locally.
 * Most usage data is only available server-side via GitHub.
 */

import { existsSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { execSync } from 'child_process';

const STATE_DB = join(homedir(), 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'state.vscdb');
const EXTENSIONS_DIR = join(homedir(), '.vscode', 'extensions');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    json: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--json':
        options.json = true;
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
      maxBuffer: 10 * 1024 * 1024,
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

function getAllLanguageModelStats() {
  const query = `SELECT key, value FROM ItemTable WHERE key LIKE 'languageModelStats.%'`;
  const result = sqliteQuery(STATE_DB, query);
  if (!result) return [];

  const stats = [];
  const lines = result.split('\n');
  for (const line of lines) {
    const pipeIndex = line.indexOf('|');
    if (pipeIndex === -1) continue;
    const key = line.slice(0, pipeIndex);
    const model = key.replace('languageModelStats.', '');
    const value = line.slice(pipeIndex + 1);
    try {
      stats.push({ model, ...JSON.parse(value) });
    } catch {}
  }
  return stats;
}

function getCopilotExtensions() {
  if (!existsSync(EXTENSIONS_DIR)) return [];

  try {
    const extensions = readdirSync(EXTENSIONS_DIR);
    return extensions.filter(e =>
      e.startsWith('github.copilot') ||
      e.includes('copilot')
    );
  } catch {
    return [];
  }
}

function getExtensionUsages() {
  // Try different possible key patterns
  const patterns = [
    'github-jaysoo-usages',
    'github.copilot-usages',
    '__GitHub.copilot-chat-usages',
  ];

  for (const pattern of patterns) {
    const result = sqliteQuery(STATE_DB, `SELECT value FROM ItemTable WHERE key LIKE '%${pattern}%'`);
    if (result) {
      try {
        return JSON.parse(result);
      } catch {}
    }
  }

  // Fallback: get any github usages
  const result = sqliteQuery(STATE_DB, `SELECT key, value FROM ItemTable WHERE key LIKE '%usages%' AND key LIKE '%github%'`);
  if (result) {
    const lines = result.split('\n');
    for (const line of lines) {
      const pipeIndex = line.indexOf('|');
      if (pipeIndex === -1) continue;
      try {
        return JSON.parse(line.slice(pipeIndex + 1));
      } catch {}
    }
  }

  return [];
}

function getCopilotConfig() {
  return getStateValue('GitHub.copilot');
}

function collectStats() {
  const languageModelStats = getAllLanguageModelStats();
  const copilotExtensions = getCopilotExtensions();
  const extensionUsages = getExtensionUsages();
  const copilotConfig = getCopilotConfig();

  // Aggregate token stats
  let totalRequests = 0;
  let totalTokens = 0;
  const modelBreakdown = [];

  for (const stat of languageModelStats) {
    let modelRequests = stat.requestCount || 0;
    let modelTokens = stat.tokenCount || 0;

    // Also count participant stats
    if (stat.extensions) {
      for (const ext of stat.extensions) {
        modelRequests += ext.requestCount || 0;
        modelTokens += ext.tokenCount || 0;
        if (ext.participants) {
          for (const p of ext.participants) {
            modelRequests += p.requestCount || 0;
            modelTokens += p.tokenCount || 0;
          }
        }
      }
    }

    if (modelRequests > 0 || modelTokens > 0) {
      modelBreakdown.push({
        model: stat.model,
        requests: modelRequests,
        tokens: modelTokens,
      });
      totalRequests += modelRequests;
      totalTokens += modelTokens;
    }
  }

  // Get copilot extension info
  const copilotUsage = extensionUsages.filter(e =>
    e.extensionId?.includes('copilot')
  );

  return {
    installed: copilotExtensions.length > 0,
    extensions: copilotExtensions,
    installedVersion: copilotConfig?.installedVersion || null,
    languageModelStats: {
      totalRequests,
      totalTokens,
      byModel: modelBreakdown,
    },
    extensionUsages: copilotUsage,
    lastUsed: copilotUsage.length > 0
      ? new Date(Math.max(...copilotUsage.map(e => e.lastUsed || 0))).toISOString()
      : null,
  };
}

function printUsage(stats) {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║           VSCODE / GITHUB COPILOT USAGE STATISTICS           ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  // Installation status
  console.log('📦 INSTALLATION');
  console.log('─'.repeat(50));
  console.log(`  Copilot installed:  ${stats.installed ? 'Yes' : 'No'}`);
  if (stats.installedVersion) {
    console.log(`  Version:            ${stats.installedVersion}`);
  }
  if (stats.extensions.length > 0) {
    console.log('  Extensions:');
    for (const ext of stats.extensions) {
      console.log(`    - ${ext}`);
    }
  }
  console.log('');

  // Language model stats
  if (stats.languageModelStats.totalTokens > 0 || stats.languageModelStats.totalRequests > 0) {
    console.log('🤖 LANGUAGE MODEL USAGE');
    console.log('─'.repeat(50));

    for (const model of stats.languageModelStats.byModel) {
      console.log(`  ${model.model}:`);
      console.log(`    Requests:         ${formatNumber(model.requests).padStart(10)}`);
      console.log(`    Tokens:           ${formatNumber(model.tokens).padStart(10)}`);
    }

    console.log('  ─────────────────────────');
    console.log(`  TOTAL:`);
    console.log(`    Requests:         ${formatNumber(stats.languageModelStats.totalRequests).padStart(10)}`);
    console.log(`    Tokens:           ${formatNumber(stats.languageModelStats.totalTokens).padStart(10)}`);
    console.log('');
  }

  // Extension usage
  if (stats.extensionUsages.length > 0) {
    console.log('📊 EXTENSION ACTIVITY');
    console.log('─'.repeat(50));
    for (const ext of stats.extensionUsages) {
      const lastUsed = ext.lastUsed ? new Date(ext.lastUsed).toLocaleDateString() : 'unknown';
      console.log(`  ${ext.extensionName || ext.extensionId}:`);
      console.log(`    Last used:        ${lastUsed}`);
    }
    console.log('');
  }

  // Summary
  console.log('📈 SUMMARY');
  console.log('─'.repeat(50));
  if (stats.lastUsed) {
    console.log(`  Last Copilot use:   ${new Date(stats.lastUsed).toLocaleDateString()}`);
  }
  console.log(`  Total requests:     ${formatNumber(stats.languageModelStats.totalRequests)}`);
  console.log(`  Total tokens:       ${formatNumber(stats.languageModelStats.totalTokens)}`);
  console.log('');

  // Note about limitations
  console.log('ℹ️  NOTE');
  console.log('─'.repeat(50));
  console.log('  VSCode/Copilot stores very limited usage data locally.');
  console.log('  Most usage stats are only available server-side via GitHub.');
  console.log('  This report shows only what is tracked locally.');
  console.log('');
}

function main() {
  const options = parseArgs();

  if (options.help) {
    console.log(`
VSCode / GitHub Copilot Usage Statistics

Usage: node vscode-copilot-usage.mjs [options]

Options:
  --json    Output raw JSON instead of formatted text
  --help    Show this help message

Data locations:
  State DB: ~/Library/Application Support/Code/User/globalStorage/state.vscdb
  Extensions: ~/.vscode/extensions/

Note: VSCode/Copilot stores very limited usage data locally.
Most usage stats are only available server-side via GitHub.
`);
    process.exit(0);
  }

  if (!existsSync(STATE_DB)) {
    console.error(`Error: VSCode state database not found at ${STATE_DB}`);
    console.error('Make sure you have VSCode installed and have used it at least once.');
    process.exit(1);
  }

  const stats = collectStats();

  if (options.json) {
    console.log(JSON.stringify(stats, null, 2));
    process.exit(0);
  }

  printUsage(stats);
}

main();
