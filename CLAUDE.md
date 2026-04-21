# dot-ai-config — Repo Guide for Agents

This repo is the **source of truth** for Jack Hsu's AI/dev configuration. A `pre-push` hook runs `sync.sh`, which copies files out to `$HOME` and `~/.config/`. Pushing = syncing. Never edit the destination copies — always edit here.

For Jack's personal preferences, workflow conventions, and tech-specific guidance (Nx, Astro, Ocean, etc.), see `dot_claude/CLAUDE.md` — that file is synced to `~/.claude/CLAUDE.md` and loaded at user scope by Claude Code.

## Repo Layout

| Path | Syncs to | Purpose |
|------|----------|---------|
| `dot_claude/CLAUDE.md` | `~/.claude/CLAUDE.md` | User-scope Claude instructions (preferences, workflow) |
| `dot_claude/settings.json` | `~/.claude/settings.json` | Claude Code settings |
| `dot_claude/commands/` | `~/.claude/commands/` | Slash commands |
| `dot_claude/skills/` | `~/.claude/skills/` | Skills |
| `mcp-gemini/` | `~/.claude/mcp-gemini/` | Gemini MCP integration |
| `dot_ai/` | symlinked as `.ai/` in every work repo | Dictations, daily notes, tasks, PARA knowledge base |
| `fish/` | `~/.config/fish/` | Fish shell config (excludes `fish_variables`, `nxcloud.fish`) |
| `nvim/` | `~/.config/nvim/` | Neovim config |
| `kitty/` | `~/.config/kitty/` | Kitty terminal |
| `mise.toml` | `~/.config/mise/config.toml` | mise runtime manager |
| `gh-dash/config.yml` | `~/.config/gh-dash/config.yml` | gh-dash TUI |
| `tmux.conf` | `~/.tmux.conf` | tmux |
| `bashrc` | `~/.bashrc` | bash |
| `gitconfig` | `~/.gitconfig` | git |
| `gitignore_global` | `~/.gitignore_global` | git global ignore |
| `hooks/pre-push` | linked into `.git/hooks/pre-push` | Triggers `sync.sh` on push |
| `mcp-server/` | (not synced) | MyNotes MCP server source |
| `scripts/`, `tools/` | (not synced) | Standalone utilities |
| `USAGE.md` | (not synced) | Manual tracker of skill/command invocations |

### `.ai/` vs `dot_ai/` — critical mapping

`dot_claude/CLAUDE.md` consistently uses `.ai/...` paths. That's the symlink present in every *work* repo (`nx`, `ocean`, `console`, etc.). **Inside this repo (`dot-ai-config`) there is no `.ai` symlink at the root** — the same content lives at `dot_ai/`.

When acting inside this repo, translate `.ai/<anything>` → `dot_ai/<anything>`. Examples:
- `.ai/para/areas/syncs/infra/README.md` → `dot_ai/para/areas/syncs/infra/README.md`
- `.ai/para/areas/personnel/altan.md` → `dot_ai/para/areas/personnel/altan.md`
- `.ai/TODO.md` → `dot_ai/TODO.md`

## Sync Model

1. Edit any source file in this repo.
2. `git commit`, `git push`.
3. The `pre-push` hook runs `sync.sh`, which `cp`s files to their destinations.
4. If the push is rejected, the sync still happened locally — the hook runs before the remote call.

To set up on a new machine:
```bash
# Inside this repo
ln -s ../../hooks/pre-push .git/hooks/pre-push

# Inside each work repo (nx, ocean, console, etc.)
ln -s $HOME/projects/dot-ai-config/dot_ai .ai
```

Run `./sync.sh` manually if you want to sync without pushing.

**Never edit these destinations directly** — they'll be overwritten on the next push:
- `~/.claude/` (CLAUDE.md, commands/, skills/, settings.json, mcp-gemini/)
- `~/.config/fish|nvim|kitty|mise|gh-dash/`
- `~/.tmux.conf`, `~/.bashrc`, `~/.gitconfig`, `~/.gitignore_global`

If in doubt about whether a file is synced, check `sync.sh`.

## Commands & Skills

Slash commands live in `dot_claude/commands/*.md`; skills live in `dot_claude/skills/<name>/`. Both sync to `~/.claude/`.

- **Commands** — user-triggered via `/command-name`. Examples: `dictate`, `plan-task`, `summarize`, `reflect`, `brainstorm`, `review-pr`, `end-session`, `list-sessions`.
- **Skills** — auto-invoked when their description matches. Examples: `dot-claude-guard` (blocks direct edits to synced destinations), `scan-and-audit`, `nx-workspace-expert`, `visual-ui-tester`.

**After invoking any skill or command, bump `USAGE.md`** — find the row, update `Last Invoked` to today's date, increment `Count`. Add a new row if it's the first use.

Authoring a new command: `/create-command` scaffolds one. Put it in `dot_claude/commands/`, not `~/.claude/commands/`.

## PARA Knowledge Base (`dot_ai/para/`)

```
dot_ai/para/
├── projects/     # Has a deadline (Ship feature, Complete migration)
├── areas/        # Ongoing responsibility (personnel/, syncs/, metrics-review/)
├── resources/    # Reference (architectures/, scripts/, tips/)
└── archive/      # Inactive / completed
```

Every folder has a `README.md`. No orphaned files.

Daily work lives at `dot_ai/yyyy-mm-dd/` with `SUMMARY.md`, `tasks/`, `dictations/`. `dot_ai/TODO.md` tracks in-progress/pending; `dot_ai/para/archive/COMPLETED.md` archives by month.

## Adding Notes to Syncs and 1:1s

**Team syncs** — `dot_ai/para/areas/syncs/<team>/README.md`. Teams: `dpe`, `cli`, `orca`, `backend`, `infra`, `docs`, `marketing`, `planning`, `all-hands`.

**1:1s** — `dot_ai/para/areas/personnel/<name>.md` (lowercase, hyphenated).

Both documents share the same section order: `Topics for Next Meeting` → `Upcoming Sync` → `Action Items` → `Meeting Notes`.

### When the user says "add this note to the infra sync" (or similar)

This is **not** a meeting recording — it's an item to bring up next time.

1. Open `dot_ai/para/areas/syncs/<team>/README.md`.
2. Add the note to the **`## Upcoming Sync`** section. This is the default for all ad-hoc additions.
3. If the note is a follow-up on an existing bullet in `Upcoming Sync`, nest it under that bullet rather than adding a new top-level item.
4. Do **not** touch `## Topics for Next Meeting` — that's a curated agenda the user owns.
5. Do **not** promote it to `## Action Items` unless the user explicitly frames it as an action item ("action item for Altan to…").
6. Do **not** create a new dated `## Meeting Notes` entry — those are for meetings that actually happened, added via `/dictate` after the meeting.

### When the user says "add this to my 1:1 with Altan"

1. Open `dot_ai/para/areas/personnel/altan.md`.
2. Add the note under **`## Upcoming Sync`**. If that section doesn't exist, create it directly above `## 1:1 Notes`.
3. `## 1:1 Notes` (dated entries) is reserved for notes captured *after* the meeting via `/dictate`. Don't write there for pre-meeting prep.

### When a meeting just happened

Use the `/dictate` command — it handles the full workflow (creates the dictation file, moves `Upcoming Sync` into today's dated `Meeting Notes` entry, clears `Upcoming Sync`, updates `Action Items`). See `dot_claude/commands/dictate.md`.

## Guardrails

- `dot-claude-guard` skill blocks direct edits to `~/.claude/` and other synced destinations — if it trips, re-route the edit to the source in this repo.
- `NEVER` commit secrets (`.env`, tokens, API keys). `fish/fish_variables` and `fish/nxcloud.fish` are intentionally excluded from the sync for this reason.
- Always use feature branches. Never push directly to `main`/`master`.
- Every commit must come from Jack — no co-author trailers, no "Claude Code" attribution in the commit body.
