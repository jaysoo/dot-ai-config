# 2026-03-20 Summary

## SPACE Metrics: Simplify Quokka Unplanned Classification

Changed Quokka's `planned?` logic so only issues in a "misc" project with DPE/Support labels count as unplanned P0/P1. Issues with no project are now treated as planned. Previously Q-104 (28d) and Q-192 (64d) were inflating Quokka's resolution metrics (median 28d, P75 63.7d) despite having no project assignment. Discussing with Altan whether they should be added to misc.

- PR: https://github.com/nrwl/lighthouse/pull/50
- File: `lib/lighthouse/space_metrics/calculators/linear_metrics.ex`

## Template AI Agent Config Updates

Ran `nx configure-ai-agents` in all 4 CNW template repos (`angular-template`, `react-template`, `empty-template`, `typescript-template`) to update AI agent configs (Claude Code, Copilot, Cursor, Gemini, OpenCode). Amended initial commits in each. Verified by creating fresh workspaces with CNW and confirming `nx run-many -t test` shows no "AI configs out of date" warning.

Note: Both `apps` and `ts` presets map to `nrwl/empty-template`. There is no separate `typescript-template` preset in CNW.

## CNW Stats Analyzer Skill Update

Added default filters to exclude CI runs, AI agents, and `@contentful/nx` from all queries. Updated `aiAgent` field documentation to note it's a boolean (not a string). Source: `~/projects/dot-ai-config/dot_claude/skills/cnw-stats-analyzer/SKILL.md`.

## CNW Telemetry Analysis (22.6.0)

Queried MongoDB `commandStats` collection for create-nx-workspace 22.6.0 telemetry.

### Nx Cloud Prompt Responses (non-AI, human-only)

| Response | Count | % |
|----------|------:|---:|
| skip | 1,186 | 74.3% |
| never | 293 | 18.4% |
| yes | 87 | 5.5% |
| github/gitlab/etc | 29 | 1.8% |
| **Total** | **1,595** | |

AI agent completions for comparison: 122 total (89% yes, 11% skip).

### Error Rate (non-AI, excluding validation errors)

Excluding INVALID_WORKSPACE_NAME (117) and DIRECTORY_EXISTS (78):

| Error Code | Count | % of 2,097 starts |
|------------|------:|-------------------:|
| WORKSPACE_CREATION_FAILED | 50 | 2.4% |
| UNKNOWN | 31 | 1.5% |
| INVALID_PACKAGE_MANAGER | 10 | 0.5% |
| TEMPLATE_CLONE_FAILED | 10 | 0.5% |
| PRESET_FAILED | 6 | 0.3% |
| SANDBOX_FAILED | 5 | 0.2% |
| **Total** | **112** | **5.3%** |

### WORKSPACE_CREATION_FAILED Breakdown

Nothing systemic. Clusters:
- **EPERM mkdir** (~5) — permission issues (writing to `C:\Windows\`, `.vscode` dirs)
- **pnpm stalls** (~5) — install hangs/timeouts, some on Node 24 (dev release)
- **npm errors** (~5) — ERESOLVE peer dep conflicts, deprecated warnings
- **Custom preset tarball** (~4) — one user repeatedly hitting corrupted tarball
- **Unsupported Node** (~2) — odd-major Node versions (23.x, 24.x)
