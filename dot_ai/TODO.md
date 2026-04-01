# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **CLOUD-4403: Add Node 22/24 agent image tags to config maps** (2026-03-31, PR #4702)

   - Summary: Added `ubuntu22.04-node22.22-v1` and `ubuntu22.04-node24.14-v1` to all 12 agent-configuration config maps. Node 20 remains default.
   - Files: `.ai/2026-03-31/SUMMARY.md`

2. **NXC-4176: React Router + Vite 8 peer dep conflict** (2026-03-31, PR #35101)

   - Summary: Force Vite 7 when React Router is used in framework mode. Passed `useViteV7` through vite configuration generator.
   - Files: `.ai/2026-03-31/SUMMARY.md`

3. **CLOUD-4029: Node 22/24 agent base images** (2026-03-30, merged PR #10571)

   - Summary: Added Node 22.22 and Node 24.14 agent images with Go 1.26 and pnpm 10. Closed stale PR #9093. Created follow-up CLOUD-4403 for cloud-infrastructure.
   - Files: `.ai/2026-03-30/SUMMARY.md`

4. **CLOUD-4401: Ctrl+C during onboarding prints readline stacktrace** (2026-03-30, merged PR #10568)

   - Summary: Added global uncaughtException/unhandledRejection handlers using `isPromptCancelledError` to exit cleanly on Ctrl+C during enquirer prompts.
   - Files: `.ai/2026-03-30/SUMMARY.md`

5. **CLOUD-4400: Suppress url.parse() deprecation warning** (2026-03-30, PR #10569)

   - Summary: Monkey-patched `process.emitWarning` in client-bundle entry to suppress DEP0169 from follow-redirects/axios. CI green.
   - Files: `.ai/2026-03-30/SUMMARY.md`

6. **DOC-451: Cloud bundle local testing script & skill** (2026-03-30)

   - Summary: Created `tools/scripts/nx-cloud-local.sh` and `cloud-bundle-tester` skill for testing nx-cloud CLI commands against snapshot/staging/local. Found `--help` bug in client-bundle.
   - Files: `.ai/2026-03-30/SUMMARY.md`

7. **#35068: Bump picomatch 4.0.2 → 4.0.4** (2026-03-30, PR #35081)

   - Summary: Security fix — bumped picomatch in pnpm catalog to resolve two high-severity CVEs across 6 @nx/* packages.
   - Files: `.ai/2026-03-30/SUMMARY.md`

8. **NXC-4172: Handle "." and absolute paths in CNW** (2026-03-30, merged PR #35083)

   - Summary: Added `resolveSpecialFolderName()` to handle `.`/`./` and absolute paths. Threaded `workingDir` through `CreateWorkspaceOptions`.
   - Files: `.ai/2026-03-30/SUMMARY.md`

9. **NXC-4168: Add JSON Meta Telemetry to nx init** (2026-03-30, merged PR #35076)

   - Summary: Switched `recordStat` from CSV to JSON meta matching CNW format. Added start/complete/error/cancel events.
   - Files: `.ai/2026-03-28/tasks/nxc-4168-init-json-meta-telemetry.md`

10. **NXC-4166: CNW Angular Bundler Validation** (2026-03-30, merged PR #35074)

    - Summary: Added early validation in `determineAngularOptions` to reject invalid bundlers for Angular presets.
    - Files: `.ai/2026-03-28/tasks/cnw-angular-bundler-validation.md`

## TODO

- [ ] NXC-3947: Update all CLI/Cloud links to new URL structure (due 2026-03-31)
- [ ] NXC-4170: Address 19 high-severity Dependabot alerts in real dependencies (due 2026-04-01)
- [ ] NXC-3345: Investigate issue with Rollup + SWC for workspace libs (due 2026-04-03)
  - Active session: `/Users/jack/projects/nx-worktrees/NXC-3345`
- [ ] NXC-3510: Node executor may not release ports on shutdown (due 2026-04-03)
- [ ] NXC-2793: Lockfile throws errors intermittently (due 2026-04-03)
- [ ] DOC-69: What to do about versioned docs? (due 2026-04-03)
- [ ] Triage #35061: Nx 22.6.3 stack overflow on Node 25 + Windows (2026-03-30)
  - Forward-compat blocker for next Node LTS. Raise in CLI sync for assignment.
- [ ] NXC-4169: Dependabot fixture noise reduction (2026-03-28)
  - PR: https://github.com/nrwl/nx/pull/35072
  - Follow-up: NXC-4170 (19 high-severity alerts in real deps)
- [ ] Create task for blog new repo/deploy (2026-03-24)
  - let philip and juri know
- [ ] Review PR #34890 (2026-03-23)
- [ ] Chase down Philip on missing blog posts and livestreams (2026-03-20)
  - Marketing support gaps flagged in Jason 1:1 (2026-03-19)
- [ ] remove colum from tools (2026-03-17)
- [ ] Issue:https://github.com/nrwl/nx/issues/32750 (2026-02-26)
  - WASI problem, 6 scenarios tested, all passing
- [ ] Follow-up: GitHub app flow should not involve infra (2026-02-24)
  - Present it to DPEs and Red Panda (Mark)
- [ ] NXC-3641: Centralized Template Updater (2025-12-29)
- [ ] Slack #nx heads-up on cooldown week (2026-02-13)
  - https://nrwl.slack.com/archives/C6WJMCAB1/p1770987986210599
- [ ] Follow-up on Paylocity issue (2026-02-04)
  - JVA said he will open a PR to port fix back to plugin

## Active Claude Sessions

<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

- `/Users/jack/projects/nx-worktrees/NXC-4169` — NXC-4169: Dependabot fixture noise reduction (2026-03-28)
- `/Users/jack/projects/nx-worktrees/NXC-3345` — NXC-3345: Rollup + SWC rootDir fix for workspace libs (2026-03-25)
- `/Users/jack/projects/nx-worktrees/NXC-4143` — NXC-4143: cycle reminder script + workflow (2026-03-25)

## Later
