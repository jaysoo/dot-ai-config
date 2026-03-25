# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **NXC-4112: Auto-open browser on Cloud "yes"** (2026-03-25, completed)
   - Summary: Added auto-open browser for Cloud setup URL during CNW. Skips in CI, fails gracefully. PR #35014.
   - Files: `.ai/2026-03-25/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/35014

2. **DOC-418: nx-dev Build In-Place and Target Cleanup** (2026-03-20)
   - Summary: Fixed nx-dev build, simplified project targets, added serve with docs watcher, root redirect to /blog. CI passing, PR #34730 in progress.
   - Files: `.ai/2026-03-20/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34730

3. **SPACE Metrics: Simplify Quokka Unplanned Classification** (2026-03-20)
   - Summary: Changed Quokka planned? logic — only misc project + DPE/Support label = unplanned. No-project issues excluded. PR #50.
   - Files: `.ai/2026-03-20/SUMMARY.md`, PR: https://github.com/nrwl/lighthouse/pull/50

4. **SPACE Metrics: Exclude draft time from TTM** (2026-03-18)
   - Summary: TTM now uses ReadyForReviewEvent timestamp instead of created_at for draft PRs. Added ready_at column, updated GraphQL query, calculator, tests. PR #48.
   - Files: `.ai/2026-03-18/SUMMARY.md`, PR: https://github.com/nrwl/lighthouse/pull/48

5. **March 2026 Cross-Functional Digest** (2026-03-18)
   - Summary: Monthly digest covering Nx 22.6.0, task sandboxing, AI dev, telemetry, 6 enterprise PoVs. Plus technical changelog.
   - Files: `.ai/2026-03-18/tasks/nx-digest-2026-03-crossfunctional.md`, `.ai/2026-03-18/tasks/nx-digest-2026-03-changelog.md`

6. **DOC-446: Telemetry Documentation** (2026-03-17, completed)
   - Summary: Created telemetry reference page, nx.json analytics property docs, sidebar entry. PR #34884.
   - Files: `.ai/2026-03-17/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34884

7. **DOC-393: Writing Style Linting — Vale + Claude Skill** (2026-03-06, completed)
   - Summary: Added Vale prose linter with 11 custom Nx rules, cacheable Nx target, mise.toml integration, and `nx-docs-style-check` Claude skill. CI green.
   - Files: `.ai/2026-03-06/specs/writing-style-linting.md`

8. **NXC-4030: Security CVE Cluster** (2026-03-05, completed)
   - Summary: Bumped copy-webpack-plugin, css-minimizer-webpack-plugin, MF packages, koa, Next.js to patched versions. Added noErrorOnMissing compat fix, migrations for 22.6.0-beta.10. PR #34708, CI green.
   - Files: `dot_ai/2026-03-05/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/34708

9. **NXC-4035: Surface clearer CNW SANDBOX_FAILED error** (2026-03-05, completed)
   - Summary: Removed `--silent` from PM install commands, increased maxBuffer, structured error with exit code/log file/hint, added AI agent telemetry, migrated to CnwError. PR #34724.
   - Files: `dot_ai/2026-03-04/tasks/nxc-4035-cnw-sandbox-error-surfacing.md`, PR: https://github.com/nrwl/nx/pull/34724

10. **NXA-1075: nx-import Skill Rounds 3-4 + JEST.md + Gaps Report** (2026-03-04)
    - Summary: Created JEST.md, ran rounds 3-4 validation (8 scenarios each, all PASS), generated gaps report (14 gaps), pushed to nx-ai-agents-config PR #74.
    - Files: `.ai/2026-03-04/SUMMARY.md`, `~/.claude/commands/nx-import/GAPS-REPORT.md`

## Pending
- [ ] follow-up: https://nrwl.slack.com/archives/C09DU17EUSD/p1774446678727519 (2026-03-25 10:05)
- [ ] Create task for blog new repo/deploy (2026-03-24 18:51)
  - let philip and juri know
- [ ] CNW: Add "use `nx init` instead" hint for INVALID_WORKSPACE_NAME with `.` (2026-03-23 14:00)
  - 92% of INVALID_WORKSPACE_NAME errors are `.` or `./` — users trying to init in current dir
  - Update validation error message to suggest `nx init` when name is `.`, `./`, `..`, or absolute path
  - Also covers full paths like `/tmp/...`, `/Users/...`
  - ~309 errors/week (Mar 18-23), became #1 error code
- [ ] Review PR #34890 (2026-03-23 08:45)
- [ ] Look at removing push to github since it errors sometimes (2026-03-22 12:11)
  - Evaluate whether the "auto-push repo" feature in Nx Cloud onboarding actually provides meaningful value to users. If most users don't expect or want their repos pushed automatically, we should remove or de-prioritize that flow and instead optimize the cloud onboarding experience around the assumption that repos are connected manually — simplifying setup steps and reducing confusion.
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

## Later
