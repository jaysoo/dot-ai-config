# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **DOC-474: Update docs sidebar for tutorial engagement** (2026-04-07)
   - Summary: Removed "New" badge, expanded Tutorials, collapsed Concepts and Platform Features. PR #35194.
   - Files: `.ai/2026-04-07/SUMMARY.md`

2. **NXC-4182: React Router + Vite 8 compat fix** (2026-04-01 → 2026-04-03)
   - Summary: Re-enabled skipped typecheck e2e test. Added guards (throw on vite 8, vitest 4) + fix-up (remove @vitejs/plugin-react, downgrade vitest 4→3.x). Changed RR SSR prompt default to No.
   - PR: https://github.com/nrwl/nx/pull/35126

3. **Incident tracking & Security IR process** (2026-04-02)
   - Summary: Created incidents PARA area with March org-access-leakage write-up. Drafted Security IR Plan and IR Process update for Notion.
   - Files: `dot_ai/2026-04-02/SUMMARY.md`

4. **NXC-3711: Remove Tailwind CSS setup-tailwind generators** (2026-04-03, PR #35049)
   - Summary: Removed all setup-tailwind generators from 5 plugins. Deprecated @nx/*/tailwind barrel exports.
   - Files: `memory/project_nxc3711_tailwind_removal.md`

5. **NXC-3345: Rollup rootDir fix for workspace libs** (2026-03-30, in progress)
   - Summary: Fix TS6059 when rollup-built libs import workspace libs. PR #35082.
   - Files: `packages/rollup/src/plugins/with-nx/with-nx.ts`

6. **DOC-465: Build-time image optimization for blog** (2026-04-01, PR nrwl/nx-blog#1)
   - Summary: Sharp-based responsive WebP generation for 1064 blog images. Fixed broken media paths.
   - Files: `.ai/2026-04-01/SUMMARY.md`

7. **DOC-463: Match Framer header and footer** (2026-04-01)
   - Summary: Pixel-matched blog header/footer to nx.dev. Inter font, hover dropdown menus, footer 5-col layout.
   - Files: `.ai/2026-04-01/SUMMARY.md`

8. **Nx Build Cache Input/Output Misalignment Fix** (2026-04-01)
   - Summary: Fixed stale cache bug in CNW/CNP. Created `nx-config-cache-check` skill.
   - Files: `.ai/2026-04-01/SUMMARY.md`

9. **DOC-466: Add tutorial series ToC to tutorial pages** (2026-04-01, PR #35120)
   - Summary: Added "Tutorial Series" aside to all 8 tutorial pages.
   - Files: `.ai/2026-04-01/SUMMARY.md`

10. **CLOUD-4403: Add Node 22/24 agent image tags to config maps** (2026-03-31, PR #4702)
    - Summary: Added node22/24 tags to all 12 agent-configuration config maps.
    - Files: `.ai/2026-03-31/SUMMARY.md`

## TODO

- [ ] Prep for Montreal Off-site Day 2 — "State of the Union" morning session (2026-04-07, ~1-2 hrs)
  - Plan: `dot_ai/2026-04-07/tasks/state-of-the-union-prep.md`
  - Sections prefilled from digest/scan data: hero numbers, wins, shipped features, competitive landscape, team health
  - **Remaining prep work:**
    - [ ] Pull SPACE metrics from Lighthouse dashboard (live data)
    - [ ] Pick 3-5 top wins to spotlight with 1-sentence talking points
    - [ ] Decide "2025→2026 progression" stories (eng-wrapped → now)
    - [ ] Compile into slides or talking points
- [ ] NXC-4197: Supply chain hardening — pin transitive deps as direct deps (2026-04-02)
  - Linear: https://linear.app/nxdev/issue/NXC-4197
  - PR: https://github.com/nrwl/nx/pull/35159
  - Worktree: `/Users/jack/projects/nx-worktrees/NXC-4197`
  - Status: PR open, CI e2e release tests need to pass
  - `scripts/expand-deps.ts` flattens 110 deps (34 direct + 76 transitive) to pinned versions
  - Inlined `@yarnpkg/parsers`, removed `front-matter`, replaced `jest-diff` with `@jest/diff-sequences`
  - Diff output formatting fixed to match jest-diff exactly (leading newline, empty line handling)
  - Local publish + version-plans-only-touched e2e pass; release.test.ts fails on git author (pre-existing)
  - Spec: `.ai/2026-04-02/specs/expand-deps.md`
  - Slack: #tmp-latest-supply-chain-vuln
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
- [ ] Review Ben's demo mode walkthrough with Nicole (2026-04-02)
  - Ben built unified approach: flaky tasks, task analytics, CIPEs, plus a generator
  - Loom: https://www.loom.com/share/71546ba5212b46002802cab15e2ae819
  - Key decisions: typed constants (not data seeder), `disabledReason` prop, URL param over cookie, ts-morph + Claude API generator (~10 min per feature demo)
  - Kept gate UI with `?demo=true`, a few things left (PostHog events, ESLint rule)
  - Ben wants to walk through it when Jack is back
  - Slack DM: ben, Dillon, Nicole
- [ ] 22.6.x e2e fixes — cherry-pick to unblock patch release (2026-04-01)
  - [x] `require.resolve('nx')` → `require.resolve('nx/bin/nx')` in start-local-registry.ts (PR to master, then cherry-pick)
  - [ ] Cherry-pick `6962a3d7a1` (skip react-router typecheck test) to 22.6.x
  - [ ] Fix workspace-plugin:test — `@nx/devkit/internal-testing-utils` not resolving after d95503aff5 removed tsconfig refs
- [ ] NXC-3947: Update all CLI/Cloud links to new URL structure (due 2026-03-31)
- [ ] NXC-4170: Address 19 high-severity Dependabot alerts in real dependencies (due 2026-04-01)
- [ ] NXC-3345: Investigate issue with Rollup + SWC for workspace libs (due 2026-04-03)
  - Active session: `/Users/jack/projects/nx-worktrees/NXC-3345`
- [ ] NXC-3510: Node executor may not release ports on shutdown (due 2026-04-03)
- [ ] NXC-2793: Lockfile throws errors intermittently (due 2026-04-03)
- [ ] DOC-69: What to do about versioned docs? (due 2026-04-03)
- [ ] NXC-4210: @nx/next:build generateLockfile ignores npm overrides (2026-04-07)
  - GitHub: https://github.com/nrwl/nx/issues/34529 (10 👍, 0 comments, 46d overdue)
  - Linear: https://linear.app/nxdev/issue/NXC-4210
  - Needs at minimum an acknowledgment comment on the GitHub issue
- [ ] Triage #35061: Nx 22.6.3 stack overflow on Node 25 + Windows (2026-03-30)
  - Forward-compat blocker for next Node LTS. Raise in CLI sync for assignment.
- [ ] Create task for blog new repo/deploy (2026-03-24)
  - let philip and juri know
- [ ] Test Turborepo incremental task caching (2026-04-07)
  - Turbo 2.9.4 ships `futureFlags.incrementalTasks` — persists `.tsbuildinfo` etc in remote cache, restores on cache miss so tools do incremental builds instead of full rebuilds
  - PR: https://github.com/vercel/turborepo/pull/12531
  - Test on a TS monorepo: enable flag, configure `incremental` outputs, measure cache-miss rebuild times vs without
  - Evaluate whether Nx should offer equivalent (separate cache partition for tool-level incremental state)
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

- `/Users/jack/projects/nx-worktrees/NXC-4182` — NXC-4182: React Router + Vite 8 compat (2026-04-01)
- `/Users/jack/projects/nx-worktrees/NXC-4197` — NXC-4197: Supply chain hardening expand-deps (2026-04-02)
- `/Users/jack/projects/nx-worktrees/NXC-3345` — NXC-3345: Rollup + SWC rootDir fix for workspace libs (2026-03-25)
- `/Users/jack/projects/nx-worktrees/NXC-4143` — NXC-4143: cycle reminder script + workflow (2026-03-25)

## Later
