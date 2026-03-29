# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **NXC-4169: Dependabot fixture noise reduction** (2026-03-28, committed, pending review)

   - Summary: Renamed 11 vulnerable packages to `@nx-testing/*` in 15 fixture lockfiles. Clears 44 of 83 Dependabot alerts (53%), including 25 of 44 high-severity (57%). All 166 lock-file tests pass.
   - Files: `.ai/2026-03-28/tasks/dependabot-fixture-noise-reduction.md`
   - Worktree: `/Users/jack/projects/nx-worktrees/NXC-4169`
   - Next: run `nx affected -t build,test,lint`, push, PR
   - Follow-up: NXC-4170 for 19 high-severity alerts in real deps (pnpm-lock.yaml, pom.xml)

2. **NXC-4168: Add JSON Meta Telemetry to nx init** (2026-03-28, implementation complete)

   - Summary: Switched `recordStat` from CSV to JSON meta matching CNW format. Added start/complete/error/cancel events to `nx init` with nodeVersion, os, aiAgent, isCI, errorCode tracking.
   - Files: `.ai/2026-03-28/tasks/nxc-4168-init-json-meta-telemetry.md`
   - Worktree: `/Users/jack/projects/nx-worktrees/NXC-4168`
   - Next: commit, prepush, push, PR

3. **NXC-4167: CNW Yarn 4 PnP Fix** (2026-03-28, pending review)

   - Summary: Changed yarn berry exec from `npx` to `yarn` in CNW; added `enableScripts: false` to workspace generator's `.yarnrc.yml`.
   - Files: `.ai/2026-03-28/tasks/cnw-yarn-pnp-fix.md`
   - Worktree: `/Users/jack/projects/nx-worktrees/NXC-4167`

4. **NXC-4165: CNW apps preset Cannot find module nx/bin/nx** (2026-03-28, in progress)

   - Summary: Skip `generatePreset` for apps preset since preset generator does nothing. Eliminates unnecessary require.resolve and child process fork.
   - Files: `.ai/2026-03-28/tasks/nxc-4165-cnw-apps-preset-fix.md`
   - Worktree: `/Users/jack/projects/nx-worktrees/NXC-4165`

5. **NXC-4166: CNW Angular Bundler Validation** (2026-03-28, in progress)

   - Summary: Added early validation in `determineAngularOptions` to reject invalid bundlers (e.g. `vite`) for Angular presets. Build/lint/tests pass, pending commit+PR.
   - Files: `.ai/2026-03-28/tasks/cnw-angular-bundler-validation.md`
   - Worktree: `/Users/jack/projects/nx-worktrees/NXC-4166`

6. **DOC-455: Blog/Changelog Reverse Proxy in Edge Function** (2026-03-27, completed)

   - Summary: Added conditional blog/changelog proxy to Netlify edge function. Toggled via `BLOG_URL` env var. Also fixed favicon 404s. PR #35043.
   - Files: `netlify/edge-functions/rewrite-framer-urls.ts`, PR: https://github.com/nrwl/nx/pull/35043

7. **NXC-4153: Fix CNW Non-Interactive Mode + Template Shorthands** (2026-03-27, completed)

   - Summary: Fixed 22.6.0 regression in non-interactive mode, added template shorthand names. PR #35045.
   - Files: `.ai/2026-03-27/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/35045

8. **NXC-4113: A/B Test Cloud Prompt Copy in CNW** (2026-03-27, completed)

   - Summary: Re-enabled cloud prompt with 3 A/B copy variants tied to flow variant. Emphasizes remote caching, CI speed, mentions GitHub/GitLab, free tier, 2-min setup. Dimmed "never" option.
   - Files: `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`, branch `NXC-4113`

9. **NXC-3711: Remove Tailwind Support** (2026-03-27, in progress)

   - Summary: Removed all tailwind generators, style options, barrel exports, version constants from packages/. Implementation complete, pending commit/push/PR.
   - Files: `.ai/2026-03-27/tasks/remove-tailwind-support.md`

10. **CNW Template Updates 22.6.2 + Vite 8 + Angular 21.2.5** (2026-03-27, completed)

    - Summary: Migrated all 4 templates to Nx 22.6.2, bumped Vite 8 and Angular 21.2.5. Updated cnw-update-templates skill with registry/audit/framework checks.
    - Files: `.ai/2026-03-27/SUMMARY.md`, `dot_claude/skills/cnw-update-templates/SKILL.md`

11. **NXC-4152: Fix Vite 8 cypress-component-configuration test failures** (2026-03-27)

    - Summary: Added `useVite7ForCypressCT` helper to Angular/React test files — downgrades vite to v7 in tree before cypress config generator.
    - Files: `packages/angular/src/generators/cypress-component-configuration/cypress-component-configuration.spec.ts`

12. **DOC-457: Webinar banner light mode support** (2026-03-26)

    - Summary: Made WebinarNotifier theme-aware — light bg in light mode, dark bg in dark mode. Close button now visible. PR #35029.
    - Files: `nx-dev/ui-common/src/lib/webinar-notifier.tsx`, PR: https://github.com/nrwl/nx/pull/35029

13. **Docs: Getting started tutorial links** (2026-03-26)

    - Summary: Added consistent next steps and tutorial links across all getting started pages. Replaced cards with bullet lists. PR #35024.
    - Files: `.ai/2026-03-26/SUMMARY.md`, PR: https://github.com/nrwl/nx/pull/35024

14. **NXC-3345: Rollup + SWC rootDir fix for workspace libs** (2026-03-25, in progress)

- Summary: Fixed TS6059 rootDir error when building libs that import workspace libs. Two commits, not yet pushed.
- Files: `packages/rollup/src/plugins/with-nx/with-nx.ts`, `packages/js/src/plugins/rollup/type-definitions.ts`

## TODO

- [ ] NXC-4169: Dependabot fixture noise reduction (2026-03-28)
  - Plan: `.ai/2026-03-28/tasks/dependabot-fixture-noise-reduction.md`
  - Committed, pending `nx affected` validation + push + PR
  - Follow-up: NXC-4170 (19 high-severity alerts in real deps)
- [ ] Create task for blog new repo/deploy (2026-03-24)
  - let philip and juri know
- [ ] CNW: Add "use `nx init` instead" hint for INVALID_WORKSPACE_NAME with `.` (2026-03-23)
  - 92% of INVALID_WORKSPACE_NAME errors are `.` or `./` — users trying to init in current dir
  - ~309 errors/week (Mar 18-23), became #1 error code
- [ ] Review PR #34890 (2026-03-23)
- [ ] Chase down Philip on missing blog posts and livestreams (2026-03-20)
  - Marketing support gaps flagged in Jason 1:1 (2026-03-19)
- [ ] remove colum from tools (2026-03-17)
- [ ] follow up on next.js cleanup pr (2026-03-06)
  - https://github.com/nrwl/nx/pull/34730
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
- `/Users/jack/projects/nx-worktrees/NXC-4168` — NXC-4168: Add JSON Meta Telemetry to nx init (2026-03-28)
- `/Users/jack/projects/nx-worktrees/NXC-4167` — NXC-4167: CNW Yarn 4 PnP Fix (2026-03-28)
- `/Users/jack/projects/nx-worktrees/NXC-4165` — NXC-4165: CNW apps preset fix (2026-03-28)
- `/Users/jack/projects/nx-worktrees/NXC-4166` — NXC-4166: CNW Angular Bundler Validation (2026-03-28)
- `/Users/jack/projects/nx-worktrees/NXC-4171` — NXC-4171: Bump sass version for vue/nuxt Vite 8 compat (2026-03-28)
- `/Users/jack/projects/nx-worktrees/NXC-3345` — NXC-3345: Rollup + SWC rootDir fix for workspace libs (2026-03-25)
- `/Users/jack/projects/nx-worktrees/NXC-4143` — NXC-4143: cycle reminder script + workflow (2026-03-25)
- `/Users/jack/projects/nx-worktrees/DOC-455` — DOC-455: Blog/changelog reverse proxy in edge function (2026-03-27)
- `/Users/jack/projects/nx-blog` — nx-blog development (2026-03-25)

## Later
