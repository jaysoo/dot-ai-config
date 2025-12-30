#!/usr/bin/env node
/**
 * AI Usage Report - Combined Claude Code, Cursor, and VSCode/Copilot
 * Usage: ./ai-usage.mjs > result.md
 *        ./ai-usage.mjs --html | open -f -a Safari
 *        ./ai-usage.mjs --open   # Opens in default browser
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, unlinkSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';
import { execSync } from 'child_process';

const HTML_FLAG = process.argv.includes('--html');
const OPEN_FLAG = process.argv.includes('--open');

const HOME = homedir();

// Paths
const CLAUDE_STATS = join(HOME, '.claude', 'stats-cache.json');
const CURSOR_STATE_DB = join(HOME, 'Library', 'Application Support', 'Cursor', 'User', 'globalStorage', 'state.vscdb');
const VSCODE_STATE_DB = join(HOME, 'Library', 'Application Support', 'Code', 'User', 'globalStorage', 'state.vscdb');
const VSCODE_EXTENSIONS = join(HOME, '.vscode', 'extensions');

// Pricing per 1M tokens (source: anthropic.com/pricing, 2024-12-30)
const PRICING = {
  'claude-opus-4-5-20251101': { input: 5, output: 25, cacheRead: 0.50, cacheWrite: 6.25, name: 'Opus 4.5' },
  'claude-sonnet-4-5-20250929': { input: 3, output: 15, cacheRead: 0.30, cacheWrite: 3.75, name: 'Sonnet 4.5' },
  'claude-sonnet-4-20250514': { input: 3, output: 15, cacheRead: 0.30, cacheWrite: 3.75, name: 'Sonnet 4' },
};

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

function fmtDate(s) {
  return s ? new Date(s).toLocaleDateString() : 'unknown';
}

function sqliteQuery(dbPath, query) {
  try {
    return execSync(`sqlite3 "${dbPath}" "${query}"`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }).trim();
  } catch {
    return '';
  }
}

function getStateValue(dbPath, key) {
  const result = sqliteQuery(dbPath, `SELECT value FROM ItemTable WHERE key = '${key}'`);
  if (!result) return null;
  try {
    return JSON.parse(result);
  } catch {
    return null;
  }
}

// =============================================================================
// Claude Code
// =============================================================================
function renderClaudeCode() {
  console.log('## Claude Code\n');

  if (!existsSync(CLAUDE_STATS)) {
    console.log('_Not installed or not used._\n');
    return;
  }

  let data;
  try {
    data = JSON.parse(readFileSync(CLAUDE_STATS, 'utf8'));
  } catch {
    console.log('_Error reading stats file._\n');
    return;
  }

  if (!data.totalMessages) {
    console.log('_Not used._\n');
    return;
  }

  // Calculate totals
  let input = 0, output = 0, cacheRead = 0, cacheWrite = 0, totalCost = 0;
  for (const [model, u] of Object.entries(data.modelUsage || {})) {
    input += u.inputTokens || 0;
    output += u.outputTokens || 0;
    cacheRead += u.cacheReadInputTokens || 0;
    cacheWrite += u.cacheCreationInputTokens || 0;

    const p = PRICING[model];
    if (p) {
      totalCost += ((u.inputTokens || 0) / 1e6) * p.input;
      totalCost += ((u.outputTokens || 0) / 1e6) * p.output;
      totalCost += ((u.cacheReadInputTokens || 0) / 1e6) * p.cacheRead;
      totalCost += ((u.cacheCreationInputTokens || 0) / 1e6) * p.cacheWrite;
    }
  }
  const total = input + output + cacheRead + cacheWrite;

  // Daily averages
  const firstDate = new Date(data.firstSessionDate);
  const lastDate = new Date(data.lastComputedDate || Date.now());
  const calendarDays = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;
  const workingDays = Math.round(calendarDays * 5 / 7);
  const activeDays = (data.dailyActivity || []).length;

  console.log('| Metric | Value |');
  console.log('|--------|-------|');
  console.log(`| First session | ${fmtDate(data.firstSessionDate)} |`);
  console.log(`| Total sessions | ${(data.totalSessions || 0).toLocaleString()} |`);
  console.log(`| Total messages | ${(data.totalMessages || 0).toLocaleString()} |`);
  console.log(`| **Total tokens** | **${fmt(total)}** |`);
  console.log(`| **Est. cost** | **$${totalCost.toFixed(2)}** |`);
  console.log('');

  console.log('### Daily Averages\n');
  console.log('| Metric | Value |');
  console.log('|--------|-------|');
  console.log(`| Calendar days | ${calendarDays} |`);
  console.log(`| Est. working days | ${workingDays} |`);
  console.log(`| Active days | ${activeDays} |`);
  console.log(`| Tokens/working day | ${fmt(Math.round(total / workingDays))} |`);
  console.log(`| Messages/day | ${Math.round((data.totalMessages || 0) / activeDays)} |`);
  console.log(`| Cost/working day | $${(totalCost / workingDays).toFixed(2)} |`);
  console.log('');

  console.log('### Token Breakdown\n');
  console.log('| Type | Tokens |');
  console.log('|------|--------|');
  console.log(`| Input | ${fmt(input)} |`);
  console.log(`| Output | ${fmt(output)} |`);
  console.log(`| Cache read | ${fmt(cacheRead)} |`);
  console.log(`| Cache write | ${fmt(cacheWrite)} |`);
  console.log('');

  console.log('### By Model\n');
  console.log('| Model | Input | Output | Cache Read | Cache Write | Est. Cost |');
  console.log('|-------|-------|--------|------------|-------------|-----------|');
  for (const [model, usage] of Object.entries(data.modelUsage || {})) {
    const p = PRICING[model] || { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, name: model };
    const name = p.name || model.replace('claude-', '').replace(/-\d{8}$/, '');
    const cost = ((usage.inputTokens || 0) / 1e6) * p.input +
                 ((usage.outputTokens || 0) / 1e6) * p.output +
                 ((usage.cacheReadInputTokens || 0) / 1e6) * p.cacheRead +
                 ((usage.cacheCreationInputTokens || 0) / 1e6) * p.cacheWrite;
    console.log(`| ${name} | ${fmt(usage.inputTokens || 0)} | ${fmt(usage.outputTokens || 0)} | ${fmt(usage.cacheReadInputTokens || 0)} | ${fmt(usage.cacheCreationInputTokens || 0)} | $${cost.toFixed(2)} |`);
  }
  console.log('');

  // Cache savings
  const withoutCache = (cacheRead / 1e6) * 5;
  const actualCacheReadCost = (cacheRead / 1e6) * 0.50;
  const savings = withoutCache - actualCacheReadCost;
  console.log(`> **Cache savings:** ~$${savings.toFixed(2)} (cache read at $0.50/MTok vs $5/MTok input)\n`);
}

// =============================================================================
// Cursor
// =============================================================================
function renderCursor() {
  console.log('## Cursor\n');

  if (!existsSync(CURSOR_STATE_DB)) {
    console.log('_Not installed or not used._\n');
    return;
  }

  const testQuery = sqliteQuery(CURSOR_STATE_DB, "SELECT key FROM ItemTable WHERE key LIKE 'aiCodeTracking%' LIMIT 1");
  if (!testQuery) {
    console.log('_Not used or error reading database._\n');
    return;
  }

  // Get tracking data
  const lines = getStateValue(CURSOR_STATE_DB, 'aiCodeTrackingLines') || [];
  const startTime = getStateValue(CURSOR_STATE_DB, 'aiCodeTrackingStartTime');
  const scoredCommits = getStateValue(CURSOR_STATE_DB, 'aiCodeTrackingScoredCommits') || [];

  // Get daily stats
  const dailyResult = sqliteQuery(CURSOR_STATE_DB, "SELECT value FROM ItemTable WHERE key LIKE 'aiCodeTracking.dailyStats%'");
  let totalTabSugg = 0, totalTabAcc = 0, totalCompSugg = 0, totalCompAcc = 0;
  if (dailyResult) {
    for (const line of dailyResult.split('\n')) {
      try {
        const day = JSON.parse(line);
        totalTabSugg += day.tabSuggestedLines || 0;
        totalTabAcc += day.tabAcceptedLines || 0;
        totalCompSugg += day.composerSuggestedLines || 0;
        totalCompAcc += day.composerAcceptedLines || 0;
      } catch {}
    }
  }

  // Count by source
  let tab = 0, composer = 0;
  for (const e of lines) {
    const src = e.metadata?.source;
    if (src === 'tab') tab++;
    else if (src === 'composer') composer++;
  }
  const total = lines.length;

  if (total === 0 && scoredCommits.length === 0 && totalTabSugg === 0 && totalCompSugg === 0) {
    console.log('_Not used._\n');
    return;
  }

  const pct = n => total > 0 ? (n / total * 100).toFixed(1) + '%' : '0%';

  console.log('| Metric | Value |');
  console.log('|--------|-------|');
  console.log(`| Tracking since | ${fmtDate(startTime?.timestamp)} |`);
  console.log(`| AI code blocks | ${total.toLocaleString()} |`);
  console.log(`| Scored commits | ${scoredCommits.length.toLocaleString()} |`);
  console.log('');

  if (total > 0) {
    console.log('### By Source\n');
    console.log('| Source | Count | % |');
    console.log('|--------|-------|---|');
    console.log(`| Tab (autocomplete) | ${tab.toLocaleString()} | ${pct(tab)} |`);
    console.log(`| Composer (chat) | ${composer.toLocaleString()} | ${pct(composer)} |`);
    console.log('');
  }

  const totalSugg = totalTabSugg + totalCompSugg;
  const totalAcc = totalTabAcc + totalCompAcc;
  if (totalSugg > 0 || totalAcc > 0) {
    console.log('### Lines of Code\n');
    console.log('| Metric | Tab | Composer | Total |');
    console.log('|--------|-----|----------|-------|');
    console.log(`| Suggested | ${totalTabSugg.toLocaleString()} | ${totalCompSugg.toLocaleString()} | ${totalSugg.toLocaleString()} |`);
    console.log(`| Accepted | ${totalTabAcc.toLocaleString()} | ${totalCompAcc.toLocaleString()} | ${totalAcc.toLocaleString()} |`);
    console.log('');
  }
}

// =============================================================================
// VSCode / Copilot
// =============================================================================
function renderVSCode() {
  console.log('## VSCode / GitHub Copilot\n');

  if (!existsSync(VSCODE_STATE_DB)) {
    console.log('_Not installed._\n');
    return;
  }

  // Check if Copilot is installed
  let copilotInstalled = false;
  try {
    const extensions = readdirSync(VSCODE_EXTENSIONS);
    copilotInstalled = extensions.some(e => e.startsWith('github.copilot'));
  } catch {}

  if (!copilotInstalled) {
    console.log('_Copilot extension not installed._\n');
    return;
  }

  // Get copilot config
  const config = getStateValue(VSCODE_STATE_DB, 'GitHub.copilot');
  const version = config?.installedVersion || 'unknown';

  // Get language model stats
  const statsResult = sqliteQuery(VSCODE_STATE_DB, "SELECT key, value FROM ItemTable WHERE key LIKE 'languageModelStats.%'");
  let totalRequests = 0, totalTokens = 0;
  const models = [];

  if (statsResult) {
    for (const line of statsResult.split('\n')) {
      const idx = line.indexOf('|');
      if (idx === -1) continue;
      const model = line.slice(0, idx).replace('languageModelStats.', '');
      try {
        const stat = JSON.parse(line.slice(idx + 1));
        let reqs = stat.requestCount || 0;
        let toks = stat.tokenCount || 0;
        for (const ext of (stat.extensions || [])) {
          reqs += ext.requestCount || 0;
          toks += ext.tokenCount || 0;
          for (const p of (ext.participants || [])) {
            reqs += p.requestCount || 0;
            toks += p.tokenCount || 0;
          }
        }
        if (reqs > 0 || toks > 0) {
          models.push({ model, requests: reqs, tokens: toks });
          totalRequests += reqs;
          totalTokens += toks;
        }
      } catch {}
    }
  }

  // Get last used
  const usages = getStateValue(VSCODE_STATE_DB, 'github-jaysoo-usages') || [];
  const copilotUsage = usages.filter(e => e.extensionId?.includes('copilot'));
  const lastUsed = copilotUsage.length > 0
    ? new Date(Math.max(...copilotUsage.map(e => e.lastUsed || 0))).toLocaleDateString()
    : 'unknown';

  if (totalRequests === 0 && totalTokens === 0) {
    console.log('_Installed but not used (or no local data)._\n');
    return;
  }

  console.log('| Metric | Value |');
  console.log('|--------|-------|');
  console.log(`| Installed | Yes |`);
  console.log(`| Version | ${version} |`);
  console.log(`| Last used | ${lastUsed} |`);
  console.log(`| Total requests | ${totalRequests.toLocaleString()} |`);
  console.log(`| Total tokens | ${totalTokens.toLocaleString()} |`);
  console.log('');

  if (models.length > 0) {
    console.log('### By Model\n');
    console.log('| Model | Requests | Tokens |');
    console.log('|-------|----------|--------|');
    for (const m of models) {
      console.log(`| ${m.model} | ${m.requests} | ${m.tokens.toLocaleString()} |`);
    }
    console.log('');
  }
}

// =============================================================================
// Output handling
// =============================================================================
let output = [];
const originalLog = console.log;
console.log = (...args) => output.push(args.join(' '));

// =============================================================================
// Main
// =============================================================================
console.log('# AI Usage Report\n');
console.log(`_Generated: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}_\n`);

renderClaudeCode();
renderCursor();
renderVSCode();

console.log('---\n');
console.log('**Notes:**');
console.log('- Claude Code: Full token usage tracked locally; cost estimated using [Anthropic pricing](https://anthropic.com/pricing)');
console.log('- Cursor: Code blocks and lines tracked locally; tokens/cost are server-side only (cannot estimate)');
console.log('- VSCode/Copilot: Minimal local tracking; tokens/cost are server-side only (cannot estimate)');

// Restore console.log
console.log = originalLog;

const markdown = output.join('\n');

if (HTML_FLAG || OPEN_FLAG) {
  // Convert markdown to HTML using marked (via npx if needed)
  const html = markdownToHtml(markdown);

  if (OPEN_FLAG) {
    const tmpFile = join(tmpdir(), 'ai-usage-report.html');
    writeFileSync(tmpFile, html);
    execSync(`open "${tmpFile}"`);
  } else {
    console.log(html);
  }
} else {
  console.log(markdown);
}

function markdownToHtml(md) {
  // Try to use marked via npx for proper markdown parsing
  let body;
  try {
    body = execSync('npx -y marked', { input: md, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  } catch {
    // Fallback: basic conversion
    body = md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^---$/gm, '<hr>')
      .replace(/\n/g, '<br>');
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AI Usage Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; color: #333; line-height: 1.5; }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 10px; }
    h2 { margin-top: 30px; color: #2c3e50; }
    h3 { color: #34495e; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    tr:nth-child(even) { background: #fafafa; }
    blockquote { background: #e8f4e8; border-left: 4px solid #4caf50; margin: 15px 0; padding: 10px 15px; }
    em { color: #666; }
    strong { color: #2c3e50; }
    a { color: #3498db; }
    hr { border: none; border-top: 1px solid #eee; margin: 30px 0; }
  </style>
</head>
<body>
${body}
</body>
</html>`;
}
