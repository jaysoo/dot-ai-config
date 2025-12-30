# Summary - 2025-12-30

## AI Usage Tracking Scripts

Created a suite of scripts to track AI tool usage across the team, addressing the need to identify engineers not using AI tools meaningfully.

### Scripts Created

| Script | Purpose | Location |
|--------|---------|----------|
| `ai-usage.mjs` | Combined report (Claude Code + Cursor + VSCode) | `scripts/ai-usage.mjs` |
| `claude-code-usage.mjs` | Standalone Claude Code stats with cost estimates | `scripts/claude-code-usage.mjs` |
| `cursor-usage.mjs` | Standalone Cursor stats (code blocks, lines) | `scripts/cursor-usage.mjs` |
| `vscode-copilot-usage.mjs` | Standalone VSCode/Copilot stats | `scripts/vscode-copilot-usage.mjs` |

### Key Features

- **Claude Code**: Full token tracking (input, output, cache read/write), cost estimates using Anthropic pricing, daily averages, cache savings calculation
- **Cursor**: Code blocks, lines suggested/accepted, sources (note: tokens unavailable locally - server-side only)
- **VSCode/Copilot**: Minimal local data (most stats server-side only)
- **Output formats**: Markdown, HTML with `--open` flag to view in browser
- **Error handling**: Graceful failure when tools not installed or no usage data

### Pricing Source

Anthropic pricing (as of 2024-12-30):
- Opus 4.5: $5/$25 per MTok (input/output)
- Sonnet: $3/$15 per MTok
- Cache read: $0.50/$0.30
- Cache write: $6.25/$3.75

### Sharing via GitHub Gist

Published to GitHub Gist for team sharing. Discovered `bun run URL` doesn't work directly for remote scripts, but piping works:

```bash
# This works:
curl -s https://gist.githubusercontent.com/jaysoo/04fe326fdab24650d08493e6e9a7f99a/raw/ai-usage.mjs | bun run - --open

# One-liner with temp file (supports all flags):
f=$(mktemp).mjs && curl -s "URL" -o $f && bun $f --open; rm $f
```

### Data Locations

- Claude Code: `~/.claude/stats-cache.json`
- Cursor: `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb`
- VSCode: `~/Library/Application Support/Code/User/globalStorage/state.vscdb`
