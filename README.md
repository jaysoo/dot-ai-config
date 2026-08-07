# dot-ai-config

Source of truth for Jack's Claude Code and Codex CLI config, MCP servers, slash commands, skills, shell/editor dotfiles, and the `.ai/` knowledge base used across work repos. A git `pre-push` hook runs `sync.sh` on every push, copying files out to their destinations under `$HOME` and `~/.config/`.

**Working in this repo?** Read [`AGENTS.md`](./AGENTS.md) when using Codex CLI or [`CLAUDE.md`](./CLAUDE.md) when using Claude Code. Both cover the architecture, the `.ai/` ↔ `dot_ai/` mapping, and conventions for adding notes to syncs and 1:1s.

## Setup

```bash
# In this repo — wire the pre-push sync hook
ln -s ../../hooks/pre-push .git/hooks/pre-push

# In each work repo that needs access to the knowledge base
ln -s $HOME/projects/dot-ai-config/dot_ai .ai
```

Run `./sync.sh` manually if you want to push config out without a git push.

## What's in Here

| Directory / File | Purpose |
|------------------|---------|
| [`AGENTS.md`](./AGENTS.md) | Codex CLI repo guide — architecture, sync model, workflows |
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code repo guide — architecture, sync model, workflows |
| `dot_claude/AGENTS.md` | User-scope Codex instructions (synced to `~/.codex/AGENTS.md`) |
| `dot_claude/CLAUDE.md` | User-scope Claude instructions (synced to `~/.claude/CLAUDE.md`) |
| `dot_claude/commands/` | Claude Code slash commands (synced to `~/.claude/commands/`) |
| `dot_claude/skills/` | Skills (synced to `~/.claude/skills/` and `~/.codex/skills/`) |
| `dot_claude/settings.json` | Claude Code settings (synced to `~/.claude/settings.json`) |
| `dot_codex/permissions.toml` | Codex permission profile and tool approval defaults (merged into `~/.codex/config.toml`) |
| `dot_codex/rules/` | Codex command allow rules (synced to `~/.codex/rules/`) |
| `dot_ai/` | Knowledge base — dictations, daily work, PARA (projects/areas/resources/archive). Symlinked as `.ai/` in work repos |
| `mcp-server/` | MyNotes MCP server — indexes `dot_ai/` for search/resume |
| `mcp-gemini/` | Gemini MCP integration |
| `fish/ nvim/ kitty/ gh-dash/ tmux.conf bashrc gitconfig mise.toml` | Dotfiles synced to their standard locations |
| `hooks/pre-push` | Runs `sync.sh` on push |
| `auth-proxy/` | Go wrapper built to `~/.local/bin/{gh,op}` — logs credential use for Raycast, blocks `gh auth token` |
| `sync.sh` | Copies sources → destinations |
| `scripts/` | Standalone usage/analytics scripts |
| `tools/` | PARA utilities, docs analytics |
| `USAGE.md` | Manual tracker of skill/command invocations — bump after using one |

## Slash Commands

Stored in `dot_claude/commands/*.md`. User-triggered via `/name`.

| Command | Purpose |
|---------|---------|
| `/dictate` | Format a dictation into `.ai/yyyy-mm-dd/dictations/`; auto-routes sync meetings and 1:1s to the right tracker |
| `/plan-task` | Create a structured task plan under `.ai/yyyy-mm-dd/tasks/` |
| `/summarize` | Generate a daily or topic summary |
| `/reflect` | Reflection prompt |
| `/brainstorm` | Creative brainstorming mode |
| `/review-pr` | Pull and review a GitHub PR locally |
| `/end-session` | Wrap up a session — update TODO, COMPLETED, daily summary |
| `/list-sessions` | List active Claude sessions tracked in `dot_ai/TODO.md` |
| `/prioritize-tasks`, `/migrate-tasks` | Task list maintenance |
| `/audit-*`, `/scan-*` | Landscape/audit commands (dependencies, supply chain, competitors, frameworks, AI landscape, community, runtimes) |
| `/nx-*` | Nx-specific workflows (patch release, monthly digest, scorecard, dev update, easy issues) |
| `/netlify-*` | Netlify deploy management |
| `/identify-closeable-issues`, `/check-pending-pto`, `/kudos`, `/linear-work-summary`, `/dump`, `/create-command` | Misc utilities |

Full list: `ls dot_claude/commands/`. Scaffold a new one with `/create-command`.

## Skills

Stored in `dot_claude/skills/<name>/`. Auto-invoked when a description matches the user's intent.

| Skill | Triggers on |
|-------|-------------|
| `dot-claude-guard` | Edits to `~/.claude/` or other synced destinations — redirects to this repo |
| `nx-workspace-expert` | Nx workspace questions |
| `nx-docs-writer`, `nx-docs-style-check`, `nx-docs-qa` | Nx docs authoring/QA |
| `nx-config-cache-check` | Nx config cache diagnostics |
| `cnw-stats-analyzer`, `cnw-update-templates` | Create Nx Workspace stats / templates |
| `scan-and-audit` | Kicks off an audit/scan workflow |
| `cloud-bundle-tester` | Nx Cloud bundle validation |
| `site-checker`, `netlify-deploy-status`, `netlify-redeploy` | Deploy / site status |
| `metrics-review`, `plan-week`, `reflect`, `brainstorm`, `summarize` | Weekly planning / retrospective |
| `1-on-1-prep` | Prep a 1:1 agenda from personnel file |
| `pylon-support` | Customer-support context |
| `visual-ui-tester`, `apply-nightshift`, `caveman`, `use-plannotator-for-review` | Specialized workflows |

Full list: `ls dot_claude/skills/`. Some skills overlap names with commands (`summarize`, `reflect`, `brainstorm`, `plan-week`) — the skill fires automatically on intent, the slash command is manual.

**After invoking any command or skill**, bump `USAGE.md` (update `Last Invoked`, increment `Count`).

## MCP Servers

### MyNotes (`mcp-server/`)

Indexes `dot_ai/` so you can search and resume prior work across dictations, tasks, specs, and daily summaries.

```bash
cd mcp-server
./setup/macos/install.sh
claude mcp add MyNotes -t sse http://127.0.0.1:8888/sse
```

Tools: `search_ai_content`, `get_task_context`, `find_specs`, `get_summaries`, `extract_todos`. Trigger phrases include "my notes", "my tasks", "what did I work on".

### Gemini (`mcp-gemini/`)

Synced into `~/.claude/mcp-gemini/`. Provides `ask_gemini` and `gemini_code_review` for second-opinion verification.

## Daily Workflow (quick reference)

1. Inside a work repo with `.ai` → `dot_ai/` symlinked, Claude Code loads `dot_claude/CLAUDE.md` from `~/.claude/`; Codex loads `dot_claude/AGENTS.md` from `~/.codex/AGENTS.md`.
2. Task plans go in `.ai/yyyy-mm-dd/tasks/`. Dictations go in `.ai/yyyy-mm-dd/dictations/`. Summaries go in `.ai/yyyy-mm-dd/SUMMARY.md`.
3. Ad-hoc notes for team syncs → `.ai/para/areas/syncs/<team>/README.md` under `## Upcoming Sync`. For 1:1s → `.ai/para/areas/personnel/<name>.md` under `## Upcoming Sync`. (See `AGENTS.md` or `CLAUDE.md` for the full rules.)
4. On completion, archive tasks into `.ai/para/archive/COMPLETED.md` and remove from `.ai/TODO.md`.

## Never-Edit List

These destinations are overwritten on every push — always edit the sources in this repo:
- `~/.claude/CLAUDE.md`, `~/.claude/commands/`, `~/.claude/skills/`, `~/.claude/settings.json`, `~/.claude/mcp-gemini/`
- `~/.codex/AGENTS.md`, `~/.codex/skills/`
- `~/.config/fish/`, `~/.config/nvim/`, `~/.config/kitty/`, `~/.config/mise/`, `~/.config/gh-dash/`
- `~/.tmux.conf`, `~/.bashrc`, `~/.gitconfig`, `~/.gitignore_global`

The `dot-claude-guard` skill will flag attempts to edit these directly.
