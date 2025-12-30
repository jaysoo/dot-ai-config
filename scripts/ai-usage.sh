#!/bin/bash
# AI Usage Report - Combined Claude Code, Cursor, and VSCode/Copilot
# Usage: ./ai-usage.sh > result.md

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "# AI Usage Report"
echo ""
echo "_Generated: $(date '+%Y-%m-%d %H:%M')_"
echo ""

# =============================================================================
# Claude Code
# =============================================================================
echo "## Claude Code"
echo ""

CLAUDE_STATS="$HOME/.claude/stats-cache.json"

if [[ ! -f "$CLAUDE_STATS" ]]; then
  echo "_Not installed or not used._"
  echo ""
else
  CLAUDE_JSON=$(cat "$CLAUDE_STATS" 2>/dev/null || echo "")

  if [[ -z "$CLAUDE_JSON" ]]; then
    echo "_Error reading stats file._"
    echo ""
  else
    # Check if there's actual usage
    TOTAL_MESSAGES=$(node -e "try { const d = $CLAUDE_JSON; console.log(d.totalMessages || 0); } catch(e) { console.log(0); }" 2>/dev/null || echo "0")

    if [[ "$TOTAL_MESSAGES" == "0" ]]; then
      echo "_Not used._"
      echo ""
    else
      node -e "
        try {
          const d = $CLAUDE_JSON;
          const models = {
            'claude-opus-4-5-20251101': 'Opus 4.5',
            'claude-sonnet-4-5-20250929': 'Sonnet 4.5',
            'claude-sonnet-4-20250514': 'Sonnet 4',
          };

          // Calculate totals
          let input=0, output=0, cacheRead=0, cacheWrite=0;
          for (const u of Object.values(d.modelUsage || {})) {
            input += u.inputTokens || 0;
            output += u.outputTokens || 0;
            cacheRead += u.cacheReadInputTokens || 0;
            cacheWrite += u.cacheCreationInputTokens || 0;
          }
          const total = input + output + cacheRead + cacheWrite;

          const fmt = n => n >= 1e9 ? (n/1e9).toFixed(2)+'B' : n >= 1e6 ? (n/1e6).toFixed(2)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : n.toString();
          const fmtDate = s => s ? new Date(s).toLocaleDateString() : 'unknown';

          console.log('| Metric | Value |');
          console.log('|--------|-------|');
          console.log('| First session | ' + fmtDate(d.firstSessionDate) + ' |');
          console.log('| Total sessions | ' + (d.totalSessions || 0).toLocaleString() + ' |');
          console.log('| Total messages | ' + (d.totalMessages || 0).toLocaleString() + ' |');
          console.log('| **Total tokens** | **' + fmt(total) + '** |');
          console.log('');

          console.log('### Token Breakdown');
          console.log('');
          console.log('| Type | Tokens |');
          console.log('|------|--------|');
          console.log('| Input | ' + fmt(input) + ' |');
          console.log('| Output | ' + fmt(output) + ' |');
          console.log('| Cache read | ' + fmt(cacheRead) + ' |');
          console.log('| Cache write | ' + fmt(cacheWrite) + ' |');
          console.log('');

          console.log('### By Model');
          console.log('');
          console.log('| Model | Input | Output | Cache Read | Cache Write |');
          console.log('|-------|-------|--------|------------|-------------|');
          for (const [model, usage] of Object.entries(d.modelUsage || {})) {
            const name = models[model] || model.replace('claude-', '').replace(/-\\d{8}\$/, '');
            console.log('| ' + name + ' | ' +
              fmt(usage.inputTokens || 0) + ' | ' +
              fmt(usage.outputTokens || 0) + ' | ' +
              fmt(usage.cacheReadInputTokens || 0) + ' | ' +
              fmt(usage.cacheCreationInputTokens || 0) + ' |');
          }
          console.log('');
        } catch(e) {
          console.log('_Error parsing stats: ' + e.message + '_');
          console.log('');
        }
      " 2>/dev/null || echo -e "_Error processing Claude Code data._\n"
    fi
  fi
fi

# =============================================================================
# Cursor
# =============================================================================
echo "## Cursor"
echo ""

CURSOR_STATE_DB="$HOME/Library/Application Support/Cursor/User/globalStorage/state.vscdb"

if [[ ! -f "$CURSOR_STATE_DB" ]]; then
  echo "_Not installed or not used._"
  echo ""
else
  # Try to read from SQLite
  CURSOR_DATA=$(sqlite3 "$CURSOR_STATE_DB" "SELECT key, value FROM ItemTable WHERE key LIKE 'aiCodeTracking%'" 2>/dev/null || echo "")

  if [[ -z "$CURSOR_DATA" ]]; then
    echo "_Not used or error reading database._"
    echo ""
  else
    node -e "
      try {
        const execSync = require('child_process').execSync;
        const db = '$CURSOR_STATE_DB';

        const query = (q) => {
          try {
            return execSync('sqlite3 \"' + db + '\" \"' + q + '\"', { encoding: 'utf8' }).trim();
          } catch { return ''; }
        };

        const getVal = (key) => {
          const r = query(\"SELECT value FROM ItemTable WHERE key = '\" + key + \"'\");
          try { return JSON.parse(r); } catch { return null; }
        };

        // Get tracking data
        const lines = getVal('aiCodeTrackingLines') || [];
        const startTime = getVal('aiCodeTrackingStartTime');
        const scoredCommits = getVal('aiCodeTrackingScoredCommits') || [];

        // Get daily stats
        const dailyResult = query(\"SELECT value FROM ItemTable WHERE key LIKE 'aiCodeTracking.dailyStats%'\");
        let totalTabSugg=0, totalTabAcc=0, totalCompSugg=0, totalCompAcc=0;
        if (dailyResult) {
          for (const line of dailyResult.split('\\n')) {
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
          console.log('_Not used._');
          console.log('');
          process.exit(0);
        }

        const fmtDate = ts => ts ? new Date(ts).toLocaleDateString() : 'unknown';
        const pct = n => total > 0 ? (n/total*100).toFixed(1) + '%' : '0%';

        console.log('| Metric | Value |');
        console.log('|--------|-------|');
        console.log('| Tracking since | ' + fmtDate(startTime?.timestamp) + ' |');
        console.log('| AI code blocks | ' + total.toLocaleString() + ' |');
        console.log('| Scored commits | ' + scoredCommits.length.toLocaleString() + ' |');
        console.log('');

        if (total > 0) {
          console.log('### By Source');
          console.log('');
          console.log('| Source | Count | % |');
          console.log('|--------|-------|---|');
          console.log('| Tab (autocomplete) | ' + tab.toLocaleString() + ' | ' + pct(tab) + ' |');
          console.log('| Composer (chat) | ' + composer.toLocaleString() + ' | ' + pct(composer) + ' |');
          console.log('');
        }

        const totalSugg = totalTabSugg + totalCompSugg;
        const totalAcc = totalTabAcc + totalCompAcc;
        if (totalSugg > 0 || totalAcc > 0) {
          console.log('### Lines of Code');
          console.log('');
          console.log('| Metric | Tab | Composer | Total |');
          console.log('|--------|-----|----------|-------|');
          console.log('| Suggested | ' + totalTabSugg.toLocaleString() + ' | ' + totalCompSugg.toLocaleString() + ' | ' + totalSugg.toLocaleString() + ' |');
          console.log('| Accepted | ' + totalTabAcc.toLocaleString() + ' | ' + totalCompAcc.toLocaleString() + ' | ' + totalAcc.toLocaleString() + ' |');
          console.log('');
        }
      } catch(e) {
        console.log('_Error parsing data: ' + e.message + '_');
        console.log('');
      }
    " 2>/dev/null || echo -e "_Error processing Cursor data._\n"
  fi
fi

# =============================================================================
# VSCode / Copilot
# =============================================================================
echo "## VSCode / GitHub Copilot"
echo ""

VSCODE_STATE_DB="$HOME/Library/Application Support/Code/User/globalStorage/state.vscdb"
VSCODE_EXTENSIONS="$HOME/.vscode/extensions"

if [[ ! -f "$VSCODE_STATE_DB" ]]; then
  echo "_Not installed._"
  echo ""
else
  # Check if Copilot is installed
  COPILOT_INSTALLED=$(ls -d "$VSCODE_EXTENSIONS"/github.copilot* 2>/dev/null | head -1 || echo "")

  if [[ -z "$COPILOT_INSTALLED" ]]; then
    echo "_Copilot extension not installed._"
    echo ""
  else
    node -e "
      try {
        const execSync = require('child_process').execSync;
        const db = '$VSCODE_STATE_DB';

        const query = (q) => {
          try {
            return execSync('sqlite3 \"' + db + '\" \"' + q + '\"', { encoding: 'utf8' }).trim();
          } catch { return ''; }
        };

        const getVal = (key) => {
          const r = query(\"SELECT value FROM ItemTable WHERE key = '\" + key + \"'\");
          try { return JSON.parse(r); } catch { return null; }
        };

        // Get copilot config
        const config = getVal('GitHub.copilot');
        const version = config?.installedVersion || 'unknown';

        // Get language model stats
        const statsResult = query(\"SELECT key, value FROM ItemTable WHERE key LIKE 'languageModelStats.%'\");
        let totalRequests = 0, totalTokens = 0;
        const models = [];

        if (statsResult) {
          for (const line of statsResult.split('\\n')) {
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
        const usages = getVal('github-jaysoo-usages') || getVal('github-usages') || [];
        const copilotUsage = usages.filter(e => e.extensionId?.includes('copilot'));
        const lastUsed = copilotUsage.length > 0
          ? new Date(Math.max(...copilotUsage.map(e => e.lastUsed || 0))).toLocaleDateString()
          : 'unknown';

        if (totalRequests === 0 && totalTokens === 0) {
          console.log('_Installed but not used (or no local data)._');
          console.log('');
          process.exit(0);
        }

        console.log('| Metric | Value |');
        console.log('|--------|-------|');
        console.log('| Installed | Yes |');
        console.log('| Version | ' + version + ' |');
        console.log('| Last used | ' + lastUsed + ' |');
        console.log('| Total requests | ' + totalRequests.toLocaleString() + ' |');
        console.log('| Total tokens | ' + totalTokens.toLocaleString() + ' |');
        console.log('');

        if (models.length > 0) {
          console.log('### By Model');
          console.log('');
          console.log('| Model | Requests | Tokens |');
          console.log('|-------|----------|--------|');
          for (const m of models) {
            console.log('| ' + m.model + ' | ' + m.requests + ' | ' + m.tokens.toLocaleString() + ' |');
          }
          console.log('');
        }
      } catch(e) {
        console.log('_Error parsing data: ' + e.message + '_');
        console.log('');
      }
    " 2>/dev/null || echo -e "_Error processing VSCode/Copilot data._\n"
  fi
fi

# =============================================================================
# Notes
# =============================================================================
echo "---"
echo ""
echo "**Notes:**"
echo "- Claude Code: Full token usage tracked locally"
echo "- Cursor: Code blocks and lines tracked; tokens are server-side only"
echo "- VSCode/Copilot: Minimal local tracking; most data is server-side only"
