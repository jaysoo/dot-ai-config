# Sync Claude permissions to Codex

## Goal

Translate the durable, low-risk allow rules in `dot_claude/settings.json` into Codex exec-policy rules, keep the policy version-controlled in this repository, and sync it to the active Codex configuration.

## Context

- Claude Code pre-approves common Nx, package-manager, Git, filesystem, formatting, test, and selected network commands.
- Codex stores command allow rules in Starlark policy files under `~/.codex/rules/`.
- Existing `~/.codex/rules/default.rules` contains accumulated session approvals but is not currently sourced from this repository.
- Claude MCP permissions do not map to exec-policy rules; Codex app/MCP approvals use per-tool `approval_mode` configuration.

## Step 1: Audit and map permissions

- [x] Read `CLAUDE.md`, `dot_claude/CLAUDE.md`, and Claude settings.
- [x] Verify current Codex configuration and official rule syntax.
- [x] Classify rules as safe to port, unsupported, redundant, or intentionally excluded.

## Step 2: Add the version-controlled Codex policy

- [x] Create a concise source policy containing the portable Claude allow-list.
- [x] Update `sync.sh` and repository documentation for the new source-to-destination mapping.
- [x] Preserve runtime-generated or unrelated Codex configuration.

## Step 3: Verify and activate

- [x] Validate the policy with `codex execpolicy check`.
- [x] Run `sync.sh` and confirm the active policy matches the source.
- [x] Review the final diff for unrelated changes.

## Tracking

Keep this checklist current while implementing and verifying the change.

## Expected outcome

Routine commands already allowed in Claude Code run in Codex without repeated approval prompts, while destructive commands, broad network access, pushes, and PR mutations remain gated.
