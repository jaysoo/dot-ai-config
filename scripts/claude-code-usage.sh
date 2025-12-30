#!/bin/bash
# Claude Code Usage Statistics
# Usage: ./claude-code-usage.sh [--json] [--days N] [--cost]
#
# Options:
#   --json    Output raw JSON instead of formatted text
#   --days N  Show only last N days (default: all)
#   --cost    Include estimated cost calculations
#   --help    Show this help message

set -e

STATS_FILE="${HOME}/.claude/stats-cache.json"
OUTPUT_JSON=false
DAYS_FILTER=""
SHOW_COST=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --json)
            OUTPUT_JSON=true
            shift
            ;;
        --days)
            DAYS_FILTER="$2"
            shift 2
            ;;
        --cost)
            SHOW_COST=true
            shift
            ;;
        --help|-h)
            head -10 "$0" | tail -8
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if stats file exists
if [[ ! -f "$STATS_FILE" ]]; then
    echo "Error: Claude Code stats file not found at $STATS_FILE"
    echo "Make sure you have Claude Code installed and have used it at least once."
    exit 1
fi

if $OUTPUT_JSON; then
    cat "$STATS_FILE"
    exit 0
fi

# Use the Node.js version if available in same directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [[ -f "$SCRIPT_DIR/claude-code-usage.mjs" ]]; then
    ARGS=""
    [[ -n "$DAYS_FILTER" ]] && ARGS="$ARGS --days $DAYS_FILTER"
    $SHOW_COST && ARGS="$ARGS --cost"
    exec node "$SCRIPT_DIR/claude-code-usage.mjs" $ARGS
fi

# Fallback: inline Node.js
node -e "
const fs = require('fs');
const os = require('os');
const path = require('path');

const STATS_FILE = path.join(os.homedir(), '.claude', 'stats-cache.json');
const stats = JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));

// Pricing per 1M tokens
// Source: https://www.anthropic.com/pricing
const PRICING = {
  'claude-opus-4-5-20251101': { input: 5, output: 25, cacheRead: 0.50, cacheWrite: 6.25, name: 'Opus 4.5' },
  'claude-sonnet-4-5-20250929': { input: 3, output: 15, cacheRead: 0.30, cacheWrite: 3.75, name: 'Sonnet 4.5' },
  'claude-sonnet-4-20250514': { input: 3, output: 15, cacheRead: 0.30, cacheWrite: 3.75, name: 'Sonnet 4' },
};

const daysFilter = '$DAYS_FILTER' ? parseInt('$DAYS_FILTER') : null;
const showCost = $SHOW_COST;

function formatTokens(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
}

// Calculate totals
let totalInput = 0, totalOutput = 0, totalCacheRead = 0, totalCacheWrite = 0;
for (const usage of Object.values(stats.modelUsage)) {
  totalInput += usage.inputTokens;
  totalOutput += usage.outputTokens;
  totalCacheRead += usage.cacheReadInputTokens;
  totalCacheWrite += usage.cacheCreationInputTokens;
}
const grandTotal = totalInput + totalOutput + totalCacheRead + totalCacheWrite;

console.log('');
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║              CLAUDE CODE USAGE STATISTICS                    ║');
console.log('╚══════════════════════════════════════════════════════════════╝');
console.log('');

console.log('📊 OVERVIEW');
console.log('─'.repeat(50));
console.log(\`  First session:    \${new Date(stats.firstSessionDate).toLocaleDateString()}\`);
console.log(\`  Last computed:    \${stats.lastComputedDate}\`);
console.log(\`  Total sessions:   \${stats.totalSessions.toLocaleString()}\`);
console.log(\`  Total messages:   \${stats.totalMessages.toLocaleString()}\`);
console.log('');
console.log('  Token Totals (all models):');
console.log(\`    Input:          \${formatTokens(totalInput).padStart(10)} (\${totalInput.toLocaleString()})\`);
console.log(\`    Output:         \${formatTokens(totalOutput).padStart(10)} (\${totalOutput.toLocaleString()})\`);
console.log(\`    Cache read:     \${formatTokens(totalCacheRead).padStart(10)} (\${totalCacheRead.toLocaleString()})\`);
console.log(\`    Cache write:    \${formatTokens(totalCacheWrite).padStart(10)} (\${totalCacheWrite.toLocaleString()})\`);
console.log('    ─────────────────────────');
console.log(\`    TOTAL:          \${formatTokens(grandTotal).padStart(10)} (\${grandTotal.toLocaleString()})\`);
console.log('');

console.log('🤖 MODEL USAGE');
console.log('─'.repeat(50));

let totalCost = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 };

for (const [model, usage] of Object.entries(stats.modelUsage)) {
  const p = PRICING[model];
  const name = p?.name || model.replace('claude-', '').replace(/-\\d{8}\$/, '');

  console.log(\`  \${name}:\`);
  console.log(\`    Input tokens:        \${usage.inputTokens.toLocaleString().padStart(15)}\`);
  console.log(\`    Output tokens:       \${usage.outputTokens.toLocaleString().padStart(15)}\`);
  console.log(\`    Cache read tokens:   \${usage.cacheReadInputTokens.toLocaleString().padStart(15)}\`);
  console.log(\`    Cache write tokens:  \${usage.cacheCreationInputTokens.toLocaleString().padStart(15)}\`);

  if (showCost && p) {
    const cost = {
      input: (usage.inputTokens / 1e6) * p.input,
      output: (usage.outputTokens / 1e6) * p.output,
      cacheRead: (usage.cacheReadInputTokens / 1e6) * p.cacheRead,
      cacheWrite: (usage.cacheCreationInputTokens / 1e6) * p.cacheWrite,
    };
    cost.total = cost.input + cost.output + cost.cacheRead + cost.cacheWrite;
    totalCost.input += cost.input;
    totalCost.output += cost.output;
    totalCost.cacheRead += cost.cacheRead;
    totalCost.cacheWrite += cost.cacheWrite;
    totalCost.total += cost.total;
    console.log('    ─────────────────────────────');
    console.log(\`    Estimated cost:      \$\${cost.total.toFixed(2).padStart(14)}\`);
  }
  console.log('');
}

if (showCost) {
  console.log('💰 COST BREAKDOWN');
  console.log('─'.repeat(50));
  console.log(\`  Input tokens:      \$\${totalCost.input.toFixed(2).padStart(10)}\`);
  console.log(\`  Output tokens:     \$\${totalCost.output.toFixed(2).padStart(10)}\`);
  console.log(\`  Cache read:        \$\${totalCost.cacheRead.toFixed(2).padStart(10)}\`);
  console.log(\`  Cache write:       \$\${totalCost.cacheWrite.toFixed(2).padStart(10)}\`);
  console.log('  ─────────────────────────');
  console.log(\`  TOTAL:             \$\${totalCost.total.toFixed(2).padStart(10)}\`);
  console.log('');
  const withoutCache = (totalCacheRead / 1e6) * 5;
  console.log(\`  💡 Without caching, input would cost: \$\${withoutCache.toFixed(2)}\`);
  console.log(\`     Cache savings: ~\$\${(withoutCache - totalCost.cacheRead).toFixed(2)}\`);
  console.log('');
  console.log('  Source: https://www.anthropic.com/pricing');
  console.log('  Note: Prices as of 2024-12-30. Claude Max subscribers pay flat rate.');
  console.log('');
}

let dailyData = stats.dailyActivity;
if (daysFilter && !isNaN(daysFilter)) dailyData = dailyData.slice(-daysFilter);

console.log(\`📅 DAILY ACTIVITY\${daysFilter ? ' (last ' + daysFilter + ' days)' : ''}\`);
console.log('─'.repeat(50));
console.log('  Date        Messages  Sessions  Tool Calls');
console.log('  ' + '─'.repeat(46));
for (const day of dailyData) {
  console.log(\`  \${day.date}  \${day.messageCount.toString().padStart(8)}  \${day.sessionCount.toString().padStart(8)}  \${day.toolCallCount.toString().padStart(11)}\`);
}
console.log('');

let tokenData = stats.dailyModelTokens || [];
if (daysFilter && !isNaN(daysFilter)) tokenData = tokenData.slice(-daysFilter);

if (tokenData.length > 0) {
  console.log(\`🔢 DAILY TOKENS BY MODEL\${daysFilter ? ' (last ' + daysFilter + ' days)' : ''}\`);
  console.log('─'.repeat(50));
  for (const day of tokenData) {
    console.log(\`  \${day.date}:\`);
    for (const [model, tokens] of Object.entries(day.tokensByModel)) {
      const p = PRICING[model];
      const name = p?.name || model.replace('claude-', '').replace(/-\\d{8}\$/, '');
      console.log(\`    \${name}: \${tokens.toLocaleString()} tokens\`);
    }
  }
  console.log('');
}

console.log('⏰ ACTIVITY BY HOUR (sessions started)');
console.log('─'.repeat(50));
const hours = Object.entries(stats.hourCounts || {}).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
const maxCount = Math.max(...hours.map(h => h[1]));
for (const [hour, count] of hours) {
  const bar = '█'.repeat(Math.round((count / maxCount) * 20));
  console.log(\`  \${hour.padStart(2, '0')}:00  \${bar} \${count}\`);
}
console.log('');

const totalDays = stats.dailyActivity.length;
console.log('📈 AVERAGES');
console.log('─'.repeat(50));
console.log(\`  Messages per day:     \${Math.round(stats.totalMessages / totalDays)}\`);
console.log(\`  Sessions per day:     \${(stats.totalSessions / totalDays).toFixed(1)}\`);
console.log(\`  Messages per session: \${Math.round(stats.totalMessages / stats.totalSessions)}\`);
console.log('');
"
