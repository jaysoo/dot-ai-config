# Codex CLI config compatibility audit

## Goal

Audit active dot-ai-config sources for Claude Code assumptions that prevent equivalent Codex CLI use, and make only focused, low-risk compatibility fixes.

## Plan

- [x] Verify repository state, source/destination boundaries, and prior automation memory.
- [x] Inventory active configuration, documentation, commands, skills, scripts, and sync references.
- [x] Update clear cross-tool compatibility gaps.
- [x] Run focused checks and document ambiguous product-specific gaps.
- [x] Archive the completed task and update automation memory.

## Findings

- README documents only Claude Code even though the repo now syncs Codex assets.
- `dot-claude-guard` protects only `~/.claude`, despite being installed for Codex too.
- Scan commands source their shared helper from `~/.claude`, unnecessarily coupling Codex use to a Claude destination.
- `dot_claude/settings.json` is copied to Codex unchanged; confirming schema compatibility requires current Codex product knowledge and is intentionally left unchanged.

## Deferred compatibility review

- `sync.sh` copies Claude's `settings.json` directly to `~/.codex/settings.json`. Confirm the supported Codex settings filename/schema before changing the source or sync target.
- `dot_claude/commands/create-command.md`, `reflect.md`, and `dump.md` encode Claude-specific command locations or session behavior. Decide whether Codex should receive separate variants or whether `sync.sh` should exclude them.
- `README.md` documents MyNotes installation only through `claude mcp add`. Add a Codex command only after confirming the current supported Codex MCP setup flow.

## Verification

- `git diff --check`
- `bash -n sync.sh dot_claude/skills/scan-and-audit/gh-helpers.sh`
- Verified every shared `gh-helpers.sh` source reference resolves through the source repo rather than `~/.claude`.
- Verified Codex instruction and guard source files exist.
