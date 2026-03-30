# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **#35068: Bump picomatch 4.0.2 → 4.0.4** (2026-03-30, PR #35081)

   - Summary: Security fix — bumped picomatch in pnpm catalog to resolve two high-severity CVEs across 6 @nx/* packages.
   - Files: `.ai/2026-03-30/SUMMARY.md`

2. **NXC-4172: Handle "." and absolute paths in CNW** (2026-03-30, merged PR #35083)

   - Summary: Added `resolveSpecialFolderName()` to handle `.`/`./` and absolute paths. Threaded `workingDir` through `CreateWorkspaceOptions`.
   - Files: `.ai/2026-03-30/SUMMARY.md`

3. **NXC-4168: Add JSON Meta Telemetry to nx init** (2026-03-30, merged PR #35076)

   - Summary: Switched `recordStat` from CSV to JSON meta matching CNW format. Added start/complete/error/cancel events.
   - Files: `.ai/2026-03-28/tasks/nxc-4168-init-json-meta-telemetry.md`

4. **NXC-4166: CNW Angular Bundler Validation** (2026-03-30, merged PR #35074)

   - Summary: Added early validation in `determineAngularOptions` to reject invalid bundlers for Angular presets.
   - Files: `.ai/2026-03-28/tasks/cnw-angular-bundler-validation.md`

5. **NXC-4171: Bump sass for vue/nuxt Vite 8 compat** (2026-03-30, merged PR #35073)

   - Summary: Bumped sass version for vue/nuxt presets for Vite 8 compatibility.

6. **NXC-4169: Dependabot fixture noise reduction** (2026-03-30, PR #35072 updated)

   - Summary: Renamed 35 fixture files to `.json.fixture`, added `loadJsonFixture()` helper. Eliminates 45 of 83 Dependabot alerts.
   - Files: `.ai/2026-03-30/SUMMARY.md`
   - Follow-up: NXC-4170 for 19 high-severity alerts in real deps

7. **DOC-455: Blog/Changelog Reverse Proxy in Edge Function** (2026-03-27, completed)

   - Summary: Added conditional blog/changelog proxy to Netlify edge function. Toggled via `BLOG_URL` env var. PR #35043.

8. **NXC-4153: Fix CNW Non-Interactive Mode + Template Shorthands** (2026-03-27, merged PR #35045)

   - Summary: Fixed 22.6.0 regression in non-interactive mode, added template shorthand names.

9. **NXC-4113: A/B Test Cloud Prompt Copy in CNW** (2026-03-27, completed)

   - Summary: Re-enabled cloud prompt with 3 A/B copy variants tied to flow variant.

10. **CNW Template Updates 22.6.2 + Vite 8 + Angular 21.2.5** (2026-03-27, completed)

    - Summary: Migrated all 4 templates to Nx 22.6.2, bumped Vite 8 and Angular 21.2.5.

## TODO

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
