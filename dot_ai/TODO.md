# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **Night-shift community fixes batch** (2026-04-09)

   - Summary: 11 worktrees created from session-2026-04-10 night-shift run. All patches applied and committed.
   - Session: `night-shift/sessions/session-2026-04-10.md`

2. **NXC-4210: Fix generateLockfile ignoring npm overrides** (2026-04-09)

   - Summary: Fixed `normalizePackageJson()` stripping overrides + `findTarget()` dropping edges for overridden versions. PR #35192.
   - Files: `.ai/2026-04-09/SUMMARY.md`

3. **Netlify edge function perf: streaming + CDN cache + timing** (2026-04-08)

   - Summary: Streamed Framer proxy via TransformStream, added Netlify-CDN-Cache-Control with stale-while-revalidate, added timing logs + Server-Timing headers across all edge functions.
   - PR: https://github.com/nrwl/nx/pull/35215

4. **Night-shift community fixes batch** (2026-04-08)

   - Summary: 22 worktrees created in ~/projects/nx-worktrees/issue-\* from automated night-shift run. 9 patches applied cleanly, 12 need manual apply, 1 already fixed upstream.
   - Files: `night-shift/sessions/session-2026-04-08.md`

5. **DOC-474: Update docs sidebar for tutorial engagement** (2026-04-07)

   - Summary: Removed "New" badge, expanded Tutorials, collapsed Concepts and Platform Features. PR #35194.
   - Files: `.ai/2026-04-07/SUMMARY.md`

6. **NXC-4182: React Router + Vite 8 compat fix** (2026-04-01 → 2026-04-03)

   - Summary: Re-enabled skipped typecheck e2e test. Added guards (throw on vite 8, vitest 4) + fix-up (remove @vitejs/plugin-react, downgrade vitest 4→3.x). Changed RR SSR prompt default to No.
   - PR: https://github.com/nrwl/nx/pull/35126

7. **Incident tracking & Security IR process** (2026-04-02)

   - Summary: Created incidents PARA area with March org-access-leakage write-up. Drafted Security IR Plan and IR Process update for Notion.
   - Files: `dot_ai/2026-04-02/SUMMARY.md`

8. **NXC-3711: Remove Tailwind CSS setup-tailwind generators** (2026-04-03, PR #35049)

   - Summary: Removed all setup-tailwind generators from 5 plugins. Deprecated @nx/\*/tailwind barrel exports.
   - Files: `memory/project_nxc3711_tailwind_removal.md`

9. **NXC-3345: Rollup rootDir fix for workspace libs** (2026-03-30, in progress)

   - Summary: Fix TS6059 when rollup-built libs import workspace libs. PR #35082.
   - Files: `packages/rollup/src/plugins/with-nx/with-nx.ts`

10. **DOC-465: Build-time image optimization for blog** (2026-04-01, PR nrwl/nx-blog#1)

- Summary: Sharp-based responsive WebP generation for 1064 blog images. Fixed broken media paths.
- Files: `.ai/2026-04-01/SUMMARY.md`

## TODO

- [ ] 🤖 Review night-shift fixes from 2026-04-10 session (11 applied, 29 fixed / 44 total)
  - Session report: `/Users/jack/projects/night-shift/sessions/session-2026-04-10.md`
  - Worktrees: `~/projects/nx-worktrees/issue-*` — review code, run tests, create PRs
    - [ ] #32567 — swc-node/ts-node warning on Node 22.18+ (conf: 82, ⚠️ concerns) `issue-32567` | reports: `/tmp/nightshift-work-M5QYzE/reports/`
    - [ ] #32864 — Rspack Angular i18n Windows paths (conf: 0→approved) `issue-32864` | reports: `/tmp/nightshift-work-xJap7t/reports/`
    - [ ] #33051 — Angular lib secondary entry point test-setup.ts (conf: 0→approved) `issue-33051` | reports: `/tmp/nightshift-work-sagVTL/reports/`
    - [ ] #33523 — npm support for copy-workspace-modules (conf: 82, ✅ approved) `issue-33523` | reports: `/tmp/nightshift-work-xzmX6E/reports/`
    - [ ] #34095 — @nx/next:build missing semver dep (conf: 82, ✅ approved) `issue-34095` | reports: `/tmp/nightshift-work-R1OwZd/reports/`
    - [ ] #34281 — @nx/s3-cache non-pinned AWS SDK (conf: 90, ✅ approved) — applied to ocean repo | reports: `/tmp/nightshift-work-drAGdC/reports/`
    - [ ] #34531 — isMigrationToMonorepoNeeded uses graph (conf: 82, ✅ approved) `issue-34531` | reports: `/tmp/nightshift-work-DVTAk2/reports/`
    - [ ] #34680 — storybook-configuration Windows paths (conf: 80, ✅ approved) `issue-34680` | reports: `/tmp/nightshift-work-viX2gJ/reports/`
    - [ ] #34593 — jest migration crashes on non-plugin workspaces (conf: 0, ⚠️ concerns) `issue-34593` | reports: `/tmp/nightshift-work-fF3JdH/reports/`
    - [ ] #34756 — docs: run-commands args interpolation (conf: 85, ✅ approved) `issue-34756` | reports: `/tmp/nightshift-work-AGV2hy/reports/`
    - [ ] #34987 — gradle plugin Windows paths (conf: 85, ✅ approved) `issue-34987` | reports: `/tmp/nightshift-work-hA39f2/reports/`
- [ ] nx-graph RCE: GHSA + CORS tightening follow-up (2026-04-02)
  - Steve settling on CVE 6.0 medium severity; needs a GHSA filed
  - Jason: CORS wildcard on nx console's PDV (Project Details View) needs major refactor or tightening
  - PDV reuses nx graph webview; runs on different origins per IDE (vscode-webview://, about:blank in IntelliJ)
  - Slack: #nx-graph-rce-investigation
- [ ] Update Notion Incident Management docs (2026-04-02)
  - Add scope statement + Severities Outline link to existing [IR Process page](https://www.notion.so/nxnrwl/Incident-Response-Process-Guidelines-21569f3c23878017a562cce81c2b1b62)
  - Create "Security Incident Response Plan" as sibling page under [Incident Management](https://www.notion.so/nxnrwl/Incident-Management-462453a4546340b8820c5d9d9ba74892)
  - Create postmortem entry for March 2026 org-access-leakage in [Postmortems DB](https://www.notion.so/nxnrwl/Incidents-20369f3c238780abbbbff21cd4950208)
  - Drafts: `dot_ai/2026-04-02/ir-process-update-draft.md`, `dot_ai/2026-04-02/security-ir-plan-draft.md`
- [ ] Review Notion "Nx Software Vendors" page for Alexis (by 2026-04-07)
  - Page: https://www.notion.so/nxnrwl/Nx-Software-Vendors-1e469f3c238780cfb7d9d223bf317e30
  - Ensure it's up to date with admin tools
  - Alexis requested via Slack DM (2026-04-02)
- [ ] NXC-3345: Investigate issue with Rollup + SWC for workspace libs (due 2026-04-03)
  - Active session: `/Users/jack/projects/nx-worktrees/NXC-3345`
- [ ] Test Turborepo incremental task caching (2026-04-07)
  - Turbo 2.9.4 ships `futureFlags.incrementalTasks` — persists `.tsbuildinfo` etc in remote cache, restores on cache miss so tools do incremental builds instead of full rebuilds
  - PR: https://github.com/vercel/turborepo/pull/12531
  - Test on a TS monorepo: enable flag, configure `incremental` outputs, measure cache-miss rebuild times vs without
  - Evaluate whether Nx should offer equivalent (separate cache partition for tool-level incremental state)
- [ ] Review PR #34890 (2026-03-23)

## Active Claude Sessions

<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

- `/Users/jack/projects/nx-worktrees/NXC-4182` — NXC-4182: React Router + Vite 8 compat (2026-04-01)
- `/Users/jack/projects/nx-worktrees/NXC-3345` — NXC-3345: Rollup + SWC rootDir fix for workspace libs (2026-03-25)

## Later
