# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **DOC-478: Clean up nx-dev to ai-chat/api/courses** (2026-04-17)
   - Summary: Stripped nx-dev down to 4 routes, deleted top-level docs/ (~333MB), removed unused libs, simplified feature-ai. ~148k lines deleted.
   - Files: `.ai/2026-04-17/SUMMARY.md`, PR #35315

2. **DOC-69: Versioned docs snapshot script** (2026-04-10)
   - Summary: Script + skill to create orphan branches with pre-built static docs for Netlify branch deploys. Supports v18-v22, auto Node switching via mise, tested v19-v21.
   - Files: `.ai/2026-04-10/SUMMARY.md`, `scripts/create-versioned-docs.mts`

3. **DOC-476: Bring back "no workspace" CTA in CI tutorial** (2026-04-10)
   - Summary: Restored cloud.nx.app CTA and skip-ahead flow for cloud onboarding users in self-healing CI tutorial.
   - Files: `.ai/2026-04-10/SUMMARY.md`

4. **Night-shift community fixes batch** (2026-04-09)

   - Summary: 11 worktrees created from session-2026-04-10 night-shift run. All patches applied and committed.
   - Session: `night-shift/sessions/session-2026-04-10.md`

5. **NXC-4210: Fix generateLockfile ignoring npm overrides** (2026-04-09)

   - Summary: Fixed `normalizePackageJson()` stripping overrides + `findTarget()` dropping edges for overridden versions. PR #35192.
   - Files: `.ai/2026-04-09/SUMMARY.md`

6. **Netlify edge function perf: streaming + CDN cache + timing** (2026-04-08)

   - Summary: Streamed Framer proxy via TransformStream, added Netlify-CDN-Cache-Control with stale-while-revalidate, added timing logs + Server-Timing headers across all edge functions.
   - PR: https://github.com/nrwl/nx/pull/35215

7. **Night-shift community fixes batch** (2026-04-08)

   - Summary: 22 worktrees created in ~/projects/nx-worktrees/issue-\* from automated night-shift run. 9 patches applied cleanly, 12 need manual apply, 1 already fixed upstream.
   - Files: `night-shift/sessions/session-2026-04-08.md`

8. **DOC-474: Update docs sidebar for tutorial engagement** (2026-04-07)

   - Summary: Removed "New" badge, expanded Tutorials, collapsed Concepts and Platform Features. PR #35194.
   - Files: `.ai/2026-04-07/SUMMARY.md`

9. **NXC-4182: React Router + Vite 8 compat fix** (2026-04-01 → 2026-04-03)

   - Summary: Re-enabled skipped typecheck e2e test. Added guards (throw on vite 8, vitest 4) + fix-up (remove @vitejs/plugin-react, downgrade vitest 4→3.x). Changed RR SSR prompt default to No.
   - PR: https://github.com/nrwl/nx/pull/35126

10. **Incident tracking & Security IR process** (2026-04-02)

    - Summary: Created incidents PARA area with March org-access-leakage write-up. Drafted Security IR Plan and IR Process update for Notion.
    - Files: `dot_ai/2026-04-02/SUMMARY.md`

## TODO

- [x] 🤖 Review night-shift fixes from 2026-04-10 session (11 applied, 29 fixed / 44 total)
  - Session report: `/Users/jack/projects/night-shift/sessions/session-2026-04-10.md`
  - Worktrees: `~/projects/nx-worktrees/issue-*` — review code, run tests, create PRs
    - [x] #32567 — swc-node/ts-node warning on Node 22.18+ (conf: 82, ⚠️ concerns) `issue-32567` | reports: `/tmp/nightshift-work-M5QYzE/reports/`
      - My notes: GOOD. Simple fix, it's unfortunate repro could not be done I wonder what the sandbox issue was and if we can fix it for future tasks.
    - [x] #32864 — Rspack Angular i18n Windows paths (conf: 0→approved) `issue-32864` | reports: `/tmp/nightshift-work-xJap7t/reports/`
      - My notes: GOOD. Also unfortunate that repro repo not provided, but given this is on Windows it's understandable. The problem is well understood and fix is simple. It'd be nice to look at whether posix is the right approach here or path.normalize is better alternative as a standard Node.js API -- in this case it looks like path.normalize has the same problem with windows paths but it would be good to try standards first and then document why they don't work before our custom logic.. It be great to also have commit message suggestion so when I apply the patch I know what to use.
    - [x] #33051 — Angular lib secondary entry point test-setup.ts (conf: 0→approved) `issue-33051` | reports: `/tmp/nightshift-work-sagVTL/reports/` 
      - My notes: NOT GOOD. I think the approach was not careful enough about its effects, and it's better to be narrow and correct. See notes below.

        ```
        Nightshift agent fix quality issue — lesson learned:

        The agent proposed a fix that was technically correct but conceptually wrong. The secondary entry point generator's updateTsConfigIncludedFiles
        was mutating existing tsconfig entries (stripping src/ from glob patterns to widen them). The agent's fix added a path.includes('*') guard to
        skip non-glob paths — this solved the immediate bug (src/test-setup.ts getting mangled) but preserved the flawed approach of rewriting entries
        the generator didn't create.

        The better fix: Instead of mutating existing include/exclude entries, append new entries scoped to the secondary entry point (e.g.,
        testing/src/**/*.ts). This is additive — it doesn't touch anything the user or other generators put there, so it can't break them.

        Takeaway for future agents:
        1. Don't just fix the symptom — question whether the existing approach is sound. If a function is rewriting config it didn't create, the fix
        shouldn't be "rewrite more carefully" — it should be "stop rewriting other generators' output."
        2. Before proposing a fix, understand the full lifecycle: who creates the config, who modifies it, and why. The agent didn't ask "why are we
        mutating these entries at all?" until challenged.
        3. Minimal diff ≠ best fix. Two lines changed looks clean but papers over a design issue. An additive approach is more lines but fundamentally
        safer.
        ```
    - [x] #33523 — npm support for copy-workspace-modules (conf: 82, ✅ approved) `issue-33523` | reports: `/tmp/nightshift-work-xzmX6E/reports/`
      - My notes: REJECTED. Although the fix looks reasonable I don't know what 'getWorkspacePackagesFromGraph' function is. Need more explanation. And worst of all, there are no tests to verify the fix. This is a critical issue since it breaks npm support for the prune-lockfile executor, so we need to be sure the fix is correct and doesn't cause regressions. The agent should have asked:
        1. What is getWorkspacePackagesFromGraph? Where does it come from? How does it work? Is it well-tested?
        2. How can we verify this fix? Are there existing tests that cover this scenario, or do we need to add new tests?
        3. Can we run these tests in our environment to confirm the fix works and doesn't break anything else?

        Without answers to these questions, it's risky to apply a fix that changes core logic without test coverage.
        I don't have time to try it out myself since I'm busy, it'd be good if all the pieces are there so I can quickly review, test the repro, etc.
        It's not good that the repro isn't a real workspace, but via code analysis. If it's just through looking at code then tests are required.
    - [x] #34095 — @nx/next:build missing semver dep (conf: 82, ✅ approved) `issue-34095` | reports: `/tmp/nightshift-work-R1OwZd/reports/`
      - My notes: REJECTED. The fix looks reasonable at first, but we should NOT be importing semver statically in the first place, it needs to be dynamic when needed. THe withNx function needs more deps at build time than at run time, which is why the phase guard check is there. The original change by Colum should have put the semver import exactly when needed instead of the top-level import. Needs rework.
    - [ ] #34281 — @nx/s3-cache non-pinned AWS SDK (conf: 90, ✅ approved) — applied to ocean repo | reports: `/tmp/nightshift-work-drAGdC/reports/`
      - This was deleted due to computer restart
    - [ ] #34531 — isMigrationToMonorepoNeeded uses graph (conf: 82, ✅ approved) `issue-34531` | reports: `/tmp/nightshift-work-DVTAk2/reports/`
      - This was deleted due to computer restart
    - [ ] #34680 — storybook-configuration Windows paths (conf: 80, ✅ approved) `issue-34680` | reports: `/tmp/nightshift-work-viX2gJ/reports/`
      - This was deleted due to computer restart
    - [ ] #34593 — jest migration crashes on non-plugin workspaces (conf: 0, ⚠️ concerns) `issue-34593` | reports: `/tmp/nightshift-work-fF3JdH/reports/`
      - This was deleted due to computer restart
    - [ ] #34756 — docs: run-commands args interpolation (conf: 85, ✅ approved) `issue-34756` | reports: `/tmp/nightshift-work-AGV2hy/reports/`
      - This was deleted due to computer restart
    - [ ] #34987 — gradle plugin Windows paths (conf: 85, ✅ approved) `issue-34987` | reports: `/tmp/nightshift-work-hA39f2/reports/`
      - This was deleted due to computer restart
- [ ] Update Day 2 Montreal on-site agenda with PLG talking points (2026-04-11)
  - From Joe 1:1 (2026-04-10): 80/20 rule, sticky notes funnel exercise, activation metric (20+ runs / 24hr target), weekly metric reviews
  - Key themes: every engineer maps their work to a funnel stage, micro→macro metric connection, backend/infra teams included in PLG scrutiny
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
- [ ] Review Ben's 3 Ocean PRs — structural/dev improvements (2026-04-10)
  - #10265 — fixes `op-secrets`, not injecting env vars for e2e dev (adds fallback when 1Password CLI unavailable)
  - #10264 — fixes ToS redirect flake in e2e tests (DB/env drift between fixtures and app server)
  - #10635 — renames 3 misnamed `feature-*` libs to `util-*` + adds `nx_tags` to 5 untagged libs (~300 files)

## Active Claude Sessions

<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

- `/Users/jack/projects/nx-worktrees/DOC-478` (branch: DOC-478) — DOC-478: nx-dev cleanup (2026-04-16)
- `/Users/jack/projects/nx-worktrees/NXC-3345` — NXC-3345: Rollup + SWC rootDir fix for workspace libs (2026-03-25)

## Later
