# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **DOC-452: Topic-Based Tutorial Series** (2026-03-25, in progress)
   - Summary: Replaced monolithic tutorials with 7+1 focused topic pages. Progressive disclosure, AI-agent friendly, workspace-agnostic. PR #34998.
   - Files: `.ai/2026-03-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34998

2. **NXC-4141: Reduce Push to GitHub Errors** (2026-03-25, completed)
   - Summary: Added tiered timeouts (1s/10s/30s) to CNW GitHub push flow, switched to execAndWait, eliminated error.log, added GitHubPushError telemetry. PR #35011.
   - Files: `.ai/2026-03-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/35011

3. **Vite 8 Support (community PR #34850)** (2026-03-25, in progress)
   - Summary: Full Vite 8 support across Nx ecosystem — rolldown, plugin-react v6, type fixes, env API fix, Cypress CT error guard, version preservation in generators. 46 files, 6 packages.
   - Files: `.ai/2026-03-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34850

4. **CLOUD-4390: ClickUp Exit Code 2 Investigation** (2026-03-25, completed)
   - Summary: Investigated DTE status:2 bug. Root cause: latent `maxOf(task.code)` in Cloud + tsc exit code 2 + continuous assignments batching. UI fix in ocean#10513.
   - Files: `.ai/2026-03-25/SUMMARY.md`, `/tmp/nx-exit-code-2-analysis.md`

5. **NXC-4112: Auto-open browser on Cloud "yes"** (2026-03-25, completed)
   - Summary: Added auto-open browser for Cloud setup URL during CNW. Skips in CI, fails gracefully. PR #35014.
   - Files: `.ai/2026-03-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/35014

6. **DOC-418: nx-dev Build In-Place and Target Cleanup** (2026-03-20)
   - Summary: Fixed nx-dev build, simplified project targets, added serve with docs watcher, root redirect to /blog. CI passing, PR #34730 in progress.
   - Files: `.ai/2026-03-20/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34730

7. **SPACE Metrics: Simplify Quokka Unplanned Classification** (2026-03-20)
   - Summary: Changed Quokka planned? logic — only misc project + DPE/Support label = unplanned. No-project issues excluded. PR #50.
   - Files: `.ai/2026-03-20/SUMMARY.md`, PR: https://github.com/nrwl/lighthouse/pull/50

8. **SPACE Metrics: Exclude draft time from TTM** (2026-03-18)
   - Summary: TTM now uses ReadyForReviewEvent timestamp instead of created_at for draft PRs. Added ready_at column, updated GraphQL query, calculator, tests. PR #48.
   - Files: `.ai/2026-03-18/SUMMARY.md`, PR: https://github.com/nrwl/lighthouse/pull/48

9. **March 2026 Cross-Functional Digest** (2026-03-18)
   - Summary: Monthly digest covering Nx 22.6.0, task sandboxing, AI dev, telemetry, 6 enterprise PoVs. Plus technical changelog.
   - Files: `.ai/2026-03-18/tasks/nx-digest-2026-03-crossfunctional.md`, `.ai/2026-03-18/tasks/nx-digest-2026-03-changelog.md`

10. **DOC-446: Telemetry Documentation** (2026-03-17, completed)
   - Summary: Created telemetry reference page, nx.json analytics property docs, sidebar entry. PR #34884.
   - Files: `.ai/2026-03-17/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34884

## Pending
- [x] ~~follow-up: CLOUD-4390 ClickUp exit code 2 investigation~~ (2026-03-25 10:05, completed)
  - Root cause: latent `maxOf(task.code)` bug in Cloud + tsc exit code 2 + continuous assignments batching
  - Fix: ocean#10513, UI maps non-zero/non-130 → FAILED
- [ ] Create task for blog new repo/deploy (2026-03-24 18:51)
  - let philip and juri know
- [ ] CNW: Add "use `nx init` instead" hint for INVALID_WORKSPACE_NAME with `.` (2026-03-23 14:00)
  - 92% of INVALID_WORKSPACE_NAME errors are `.` or `./` — users trying to init in current dir
  - Update validation error message to suggest `nx init` when name is `.`, `./`, `..`, or absolute path
  - Also covers full paths like `/tmp/...`, `/Users/...`
  - ~309 errors/week (Mar 18-23), became #1 error code
- [ ] Review PR #34890 (2026-03-23 08:45)
- [x] ~~Look at removing push to github since it errors sometimes~~ (2026-03-22 12:11, completed via NXC-4141)
  - Added timeouts and graceful error handling instead of removing. PR #35011.
- [ ] Chase down Philip on missing blog posts and livestreams (2026-03-20 09:00)
  - Marketing support gaps flagged in Jason 1:1 (2026-03-19)
  - No blog posts or livestreams being produced

- [ ] remove colum from tools (2026-03-17 09:59)
- [ ] follow up on next.js cleanup pr (2026-03-06 15:50)
  - https://github.com/nrwl/nx/pull/34730

- [x] ~~Review Vite import results and make it repeatable~~ (2026-03-04, completed)
  - Created TESTING-PLAYBOOK.md, validated all 8 scenarios across 4 rounds, generated GAPS-REPORT.md
  - Pushed VITE.md, NEXT.md, JEST.md to nx-ai-agents-config PR #74
- [ ] Issue:https://github.com/nrwl/nx/issues/32750 (2026-02-26 14:53)
  - WASI problem it seems
  - 6 scenarios tested, all passing. Review config snippets and findings.
- [ ] Follow-up: GitHub app flow should not involve infra (2026-02-24 14:26)
  - Present it to DPEs and Red Panda (Mark). It is prone to human errors and is annoyign to set up when we run out of callback URLs.

- [ ] NXC-3641: Centralized Template Updater (2025-12-29 11:30)

- [x] ~~NXA-1075: Import test and document import gaps~~ (2026-03-04, completed)
  - 4 rounds × 8 scenarios, all PASS. GAPS-REPORT.md generated. PR #74 updated.

- [ ] Slack #nx heads-up on cooldown week (2026-02-13 11:21)
  - https://nrwl.slack.com/archives/C6WJMCAB1/p1770987986210599

- [ ] Follow-up on Paylocity issue (2026-02-04 12:28)
  - https://linear.app/nxdev/issue/NXC-3388/typeerror-0-configurationgetprojectname-is-not-a-function-when-running
  - They verified the fix so we just need to port it back to the plugin
  - JVA said that he will open a PR

## Active Claude Sessions

<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

- `/Users/jack/projects/nx-worktrees/NXC-4143` — NXC-4143: cycle reminder script + workflow (2026-03-25)

## Later
