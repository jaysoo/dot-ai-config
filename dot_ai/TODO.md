# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **NXC-4182: React Router + Vite 8 compat fix** (2026-04-01 → 2026-04-03)
   - Summary: Re-enabled skipped typecheck e2e test. Added guards (throw on vite 8, vitest 4) + fix-up (remove @vitejs/plugin-react, downgrade vitest 4→3.x). Changed RR SSR prompt default to No. Extensive CI debugging — vitest 4.x bundles vite as regular dep, @vitest/coverage-v8 peers on vitest 4, addDependenciesToPackageJson won't downgrade.
   - PR: https://github.com/nrwl/nx/pull/35126
   - Worktree: `/Users/jack/projects/nx-worktrees/NXC-4182`
   - Status: PR open, CI still flaky (passes locally with `e2e-ci` target). Awaiting CI green.

2. **Incident tracking & Security IR process** (2026-04-02)
   - Summary: Created incidents PARA area with March org-access-leakage write-up. Researched SOC2 disclosure (not required for potential exposure). Drafted separate Security IR Plan and IR Process update for Notion. Notion API is read-only, manual paste needed.
   - Files: `dot_ai/2026-04-02/SUMMARY.md`, `dot_ai/2026-04-02/security-ir-plan-draft.md`, `dot_ai/2026-04-02/ir-process-update-draft.md`, `dot_ai/para/areas/incidents/2026-03-25-org-access-leakage.md`

2. **NXC-3711: Remove Tailwind CSS setup-tailwind generators** (2026-04-03, PR #35049)
   - Summary: Removed all setup-tailwind generators from 5 plugins. Deprecated @nx/*/tailwind barrel exports (warn + still functional, full removal in Nx 24). Replaced graph/ tailwind configs with explicit dependency paths. No AI migration in v23.
   - Files: `memory/project_nxc3711_tailwind_removal.md`

2. **NXC-3345: Rollup rootDir fix for workspace libs** (2026-03-30, in progress)
   - Summary: Fix TS6059 when rollup-built libs import workspace libs. Monkey-patches @rollup/plugin-typescript to suppress TS6059 and drop escaping declarations. Keeps rootDir=projectRoot (no path changes). PR #35082, e2e passes locally with NX_SKIP_NX_CACHE=true. CI caching issues caused false failures.
   - Files: `packages/rollup/src/plugins/with-nx/with-nx.ts`, PR: https://github.com/nrwl/nx/pull/35082

3. **DOC-465: Build-time image optimization for blog** (2026-04-01, PR nrwl/nx-blog#1)

   - Summary: Added sharp-based responsive WebP generation (640w, 1280w, original) for all 1064 blog images. Nx task pipeline with caching. Also fixed broken /documentation/ media paths across 15 posts. Filed DOC-469 for testimonial styling.
   - Files: `.ai/2026-04-01/SUMMARY.md`

3. **DOC-463: Match Framer header and footer** (2026-04-01)

   - Summary: Pixel-matched blog header/footer to nx.dev. Inter font, Playwright/ImageMagick verification, hover dropdown menus for Solutions/Resources, footer 5-col layout.
   - Files: `.ai/2026-04-01/SUMMARY.md`

4. **Nx Build Cache Input/Output Misalignment Fix** (2026-04-01)

   - Summary: Fixed stale cache bug in CNW/CNP — `copyReadme`-only inputs didn't invalidate on source changes. Used `dependentTasksOutputFiles` as correct input. Created `nx-config-cache-check` skill.
   - Files: `.ai/2026-04-01/SUMMARY.md`

5. **DOC-466: Add tutorial series ToC to tutorial pages** (2026-04-01, PR #35120)

   - Summary: Added "Tutorial Series" aside to all 8 tutorial pages. Prerequisites standardized as plain paragraphs.
   - Files: `.ai/2026-04-01/SUMMARY.md`

6. **CLOUD-4403: Add Node 22/24 agent image tags to config maps** (2026-03-31, PR #4702)

   - Summary: Added `ubuntu22.04-node22.22-v1` and `ubuntu22.04-node24.14-v1` to all 12 agent-configuration config maps. Node 20 remains default.
   - Files: `.ai/2026-03-31/SUMMARY.md`

7. **NXC-4176: React Router + Vite 8 peer dep conflict** (2026-03-31, PR #35101)

   - Summary: Force Vite 7 when React Router is used in framework mode. Passed `useViteV7` through vite configuration generator.
   - Files: `.ai/2026-03-31/SUMMARY.md`

8. **CLOUD-4029: Node 22/24 agent base images** (2026-03-30, merged PR #10571)

   - Summary: Added Node 22.22 and Node 24.14 agent images with Go 1.26 and pnpm 10. Closed stale PR #9093.
   - Files: `.ai/2026-03-30/SUMMARY.md`

9. **CLOUD-4401: Ctrl+C during onboarding prints readline stacktrace** (2026-03-30, merged PR #10568)

   - Summary: Added global uncaughtException/unhandledRejection handlers using `isPromptCancelledError` to exit cleanly on Ctrl+C.
   - Files: `.ai/2026-03-30/SUMMARY.md`

10. **CLOUD-4400: Suppress url.parse() deprecation warning** (2026-03-30, PR #10569)

   - Summary: Monkey-patched `process.emitWarning` in client-bundle entry to suppress DEP0169 from follow-redirects/axios.
   - Files: `.ai/2026-03-30/SUMMARY.md`

## TODO

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

- `/Users/jack/projects/nx-worktrees/NXC-4182` — NXC-4182: React Router + Vite 8 compat (2026-04-01)
- `/Users/jack/projects/nx-worktrees/NXC-4197` — NXC-4197: Supply chain hardening expand-deps (2026-04-02)
- `/Users/jack/projects/nx-worktrees/NXC-4169` — NXC-4169: Dependabot fixture noise reduction (2026-03-28)
- `/Users/jack/projects/nx-worktrees/NXC-3345` — NXC-3345: Rollup + SWC rootDir fix for workspace libs (2026-03-25)
- `/Users/jack/projects/nx-worktrees/NXC-4143` — NXC-4143: cycle reminder script + workflow (2026-03-25)

## Later
