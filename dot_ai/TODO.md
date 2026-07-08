# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **DOC-544: Refresh Angular blog posts and docs pages (nx + nx-blog) — committed, NOT pushed** (2026-07-07)
   - Summary: Pageview-driven Angular content audit (inventory posted as Linear comment). nx `DOC-544` commit 8529748d7b: /angular/plugins/* 404 redirect (65k reqs/30d), API pages link to plugin intros, Nx Cloud-forward intro + CLI comparison table, nx-and-angular/migration/MF guide refreshes, fixed dead URL in init-local.ts. nx-blog `doc-544-angular-refresh` commit 3664e2c: 4 posts refreshed (architecting, testing/vitest-angular, state mgmt retitled 2026, 2022 tailwind banner). Deferred: new signals/NgRx content.
   - Files: `dot_ai/2026-07-07/tasks/doc-544-angular-content-refresh.md`, Polygraph `doc-554-angular-content-6732d8a8`

2. **NXC-4606: Enable remote cache from TUI perf report (nx) — draft PRs #36255 (new) + #36250 (kept for later)** (2026-07-07)
   - Summary: Revised approach in #36255: perf-report popup gets inline "[ Enable remote cache ]" button + "Enable remote cache: <shift>+c" footer hint when unconnected; shift+c/click runs headless nx connect and prints the short URL centered at the popup bottom; hidden when connected. Original footer-status + ConnectPopup approach stays draft on #36250. Both live-verified against staging; nx-tui onboarding source accepted by staging.
   - Files: `dot_ai/2026-07-06/tasks/nxc-4606-tui-not-connected-status.md`, PRs https://github.com/nrwl/nx/pull/36255 + https://github.com/nrwl/nx/pull/36250, Polygraph `nxc-4606-e6f49ee0`

3. **NXC-2793: Lockfile throws errors intermittently (nx)** (2026-07-05)
   - Summary: Intermittent "Source project does not exist: npm:x" from nx/js/dependencies-and-lockfile plugin; daemon-state related, nx reset clears. Landscape scan + code trace + repro hunt.
   - Files: `dot_ai/2026-07-05/tasks/nxc-2793-lockfile-intermittent-errors.md`

4. **NXC-3510: Node executor may not release ports on shutdown (nx)** (2026-07-05)
   - Summary: Verified 21.x orphan bug (fixed by #33655 in 23) + still-live watch-restart EADDRINUSE (killTree resolves on dispatch not exit). Fix: native killProcessTreeGraceful, vendored kill-tree deleted, e2e validated both directions. Draft PR #36230.
   - Files: `dot_ai/2026-07-05/tasks/nxc-3510-node-executor-port-release.md`

5. **PR #34890: rebase + green (nx, vite ts paths custom targets)** (2026-07-03)
   - Summary: Community PR (shairez) stale since March. Rebased clean onto master; root-caused CI failure (test-ci collides with @nx/vitest atomizer ciTargetName); fixing coordination-plugin unhandled rejection (BatchFunctionRunner no catch, kill(2) -> code null spurious reject) + e2e test target defs.
   - Files: `dot_ai/2026-07-03/tasks/pr-34890-rebase-vite-ts-paths.md`

6. **Q-520: Sandbox dashboard toggle for add-on requests (ocean) — implemented, NOT pushed** (2026-07-02)
   - Summary: Toggle on sandbox violations dashboard, 5 local commits on branch `Q-520` (`8c32c5fe0b`..`5d531dac77`). Admin: confirm dialog -> existing provision flow (always enables cluster too, $99/mo disclosed; cancel/resume mirror add-ons form). Member: request -> nx-api `request-feature` -> atomic one-doc-per-org+feature claim (unique index, 48h window) + Mandrill email to all org admins. Verified: gradle compile + Kotlin repo test 4/4 (real Mongo), unit 38/41/43, Playwright e2e green locally x2, 9 UI screenshots. Pending: Jack uploads Mandrill template `nx-cloud-plan-add-on-requested`, then push + draft PR (base main).
   - Files: `dot_ai/2026-07-02/SUMMARY.md`, `dot_ai/2026-07-02/tasks/q-520-sandbox-dashboard-add-on-toggle.md`, `tasks/q-520-mandrill-template-draft.md`, `tasks/q520-shots/`, Polygraph session `q-520-add-on-toggle-ee2a2bed`

7. **DOC-537: SEO docs overhaul (nx.dev)** (2026-06-25)
   - Summary: GSC-driven SEO pass. #36088 MERGED (nx/pnpm workspace foundation). #36105 DRAFT: 33 tech intros -> "Nx with <Tech>" + "Nx scales your <Tech> monorepo" descriptions + listing-page links, standardized "Set up CI" -> /docs/getting-started/setup-ci on every overview, Angular = angular monorepo landing, Module Federation overview rewrite (research + judge panel, consumer/provider generators), Next.js/Express/NestJS use CNW templates.
   - Files: `dot_ai/2026-06-25/SUMMARY.md`, `dot_ai/2026-06-23/tasks/seo-gsc-query-analysis.md`, PRs #36088 (merged) / #36105 (draft), Polygraph `seo-research-80058b7a`

8. **NXC-4590: nx migrate crash with --include=optional (nx) — PR #36087 MERGED** (2026-06-23)
   - Summary: `nx migrate --include=optional` crashed with "Cannot read properties of undefined (reading 'version')" in `generateMigrationsJsonAndUpdatePackageJson` (surfaced migrating ocean to latest Nx). The 4th arg to `writePromptMigrationFiles` read `packageUpdates[walkedTargetPackage].version` unguarded; under optional the Migrator's `applyIncludeFilter()` deletes every required-closure member (the target is always in its own required set) from `packageUpdates`, so that entry is deterministically undefined. Not ocean-specific. Fix hoisted the already-safe `?.version ?? opts.targetVersion` (used by analytics 18 lines below) above the call (+8/-4). Exported the fn + regression test on the orchestration seam (existing Migrator-level tests stop before the crash); fails pre-fix with the exact TypeError. build-base/lint/migrate.spec.ts (210/210) green.
   - Files: `dot_ai/2026-06-23/tasks/nxc-4590-migrate-optional-crash.md`, PR https://github.com/nrwl/nx/pull/36087, Polygraph session `migrate-error-c1c6a147`

9. **CLOUD-4642: UTM tracking on clickable Cloud prompt links (nx) — draft PR #36028** (2026-06-18)
   - Summary: Made the https://nx.dev/nx-cloud link in CLI cloud-setup prompt footers a clickable OSC 8 hyperlink; visible text stays the clean URL, click target carries utm_source=nx-cli + per-command utm_medium (create-nx-workspace, nx-init, nx-migrate, nx-connect). New generic terminal-link.ts (terminalLink + supportsHyperlinks + parseVersion) vendored in both packages/nx and create-nx-workspace (no new dep). CNW embeds a baked NX_CLOUD_HYPERLINK const in footers; nx core appends nxCloudHyperlink(medium) at render (init/migrate share a footer, different mediums). Reworked from a string-replace approach to const/helper after self-review (drift-proof). Still DRAFT.
   - Files: `dot_ai/2026-06-16/tasks/cloud-4642-utm-osc8-cloud-prompt.md`, PR https://github.com/nrwl/nx/pull/36028, Polygraph session `cli-utm-99e98561`

10. **Q-503: Improve CIPE upsell CTAs across key pages (ocean) — PR #11962 MERGED** (2026-06-18)
   - Summary: Gated sandboxing/resource-usage add-on upsell CTAs across surfaces (hidden once entitled): bigger CIPE rotating banner (per-CTA sample graphic, "Remind me later" 1-day snooze, x dismiss) moved above Managed agents; "Protect cache integrity with sandboxing" sub-label link on the overview Cache hit rate + /runs Cache hits tiles; non-clickable Sandboxing badge on the workspaces list; sandbox preview "FIX WITH AI" SUI; all preview modals wrapped in PosthogCaptureOnViewed. Replaced the Analysis-tab resource-usage banner with a locked sample of the real agent table (5 linux-medium-js agents, first row -> sample charts modal, rest blurred behind a "See per-agent resource charts" prompt) under Agent utilization; sample data matches the modal's OOM story; "Sample" badges; filter:blur (not banned backdrop-filter). Self-healing CI scoped a polluted agent-cell e2e query. Opened against master by mistake (harness hint) -> retargeted main. No version plan (upsell). Authored adversarial pre-PR review Workflows.
   - Files: `dot_ai/2026-06-18/SUMMARY.md`, `dot_ai/para/resources/architectures/ocean-architecture.md` (2026-06-17), PR https://github.com/nrwl/ocean/pull/11962, Polygraph session `cloud-ctas-update-8c3cbeb1`

## TODO

- [ ] **nx daemon shared-socket PoC** (2026-07-07)
  - Repo: https://github.com/nrwl/nx-daemon-shared-socket-poc-20260704

- [ ] **CNW: support `npx create-nx-workspace .` into the current directory** (2026-06-27)
  - Goal: make CNW work with a `.` (or current-dir) target so a repo that's empty — or functionally empty (only a `README`, all dirs effectively empty) — can be scaffolded in place instead of into a new subfolder
  - Why: github.com/new + Copilot operate inside the existing empty repo; CNW today insists on creating a new directory, so that flow is unsupported
  - Acceptance: `npx create-nx-workspace .` in an empty/README-only repo scaffolds into the cwd; non-empty dirs still error with a clear message
  - Open Qs: what counts as "functionally empty" (allow `.git`, `README*`, `LICENSE`, dotfiles?); merge vs refuse semantics on conflicts

- [ ] **Self-healing: Anthropic cost-by-customer breakdown for Joe — first thing AM** (2026-06-08)
  - From #dpes self-healing thread: before onboarding more customers, check contract value vs Anthropic billing (~34K USD/mo total, ClickUp top at 6.7K/mo) so we cover costs and don't lose money on usage
  - Action: pull what we paid to Anthropic broken down **by customer** and add to the credits-used sheet Joe shared ("log the credits used (ie paid for) by their customer")
  - Sheet: https://docs.google.com/spreadsheets/d/1Z_IvNvgPdz2umu1_Zc4H87_VD1IlFXYpY7vYphJgKUI/edit?gid=0#gid=0
  - Miro wants an example (e.g. Island): input vs output tokens spent to understand the discrepancy
  - Jack + Joe doing the evaluation; everyone but Mailchimp should be paying for credits

- [ ] **Polygraph docs: use-case coverage plan** (2026-05-27)
  - Notes: `dot_ai/2026-05-26/tasks/polygraph-workflows-doc-candidates.md` (section "Use-case coverage plan")
  - Concepts: repos already in graph, synthetic monorepo / break cross-repo boundaries, resumability + memory
  - Use cases: (1) web-dev one-change-across-repos, (2) published artifact / design system, (3) informational read-only (backend->frontend, copy-from-other-repo, OSS-breakage), (4) platform/security cross-repo package update, (5) hand-off + cycle continuity
  - OSS gets separate pages: triage-with-repro + ecosystem/compat

- [ ] Follow up on GitHub support ticket (2026-05-25)
  - https://support.github.com/ticket/personal/0/4416029
- [ ] **Nx Cloud client bundle integrity — signed manifest + harden update path** (2026-05-25)
  - Plan: `.ai/2026-05-25/tasks/nx-cloud-client-bundle-integrity.md`
  - Triggered by Socket.dev alerts on `nx@22.7.3` (false-positive surface tag, real underlying signal)
  - Goal: verify-then-`require()` cloud bundle (sha256 + ed25519 sig), allowlist `commandName`, document daemon trust model. Server-side first (Orca), CLI side warn-only -> enforce
- [ ] **Move PayFit to dedicated compute — this week / next week** (2026-05-25)
  - From Joe 1:1 upcoming sync
  - Open question: do they pay $149 + usage as standalone add-on, or is it bundled into their existing enterprise contract? Enterprise on single tenant per 2026-04-28 notes — clarify with Joe before moving
- [ ] **PR #35682: rspack/rsbuild v2 multi-version compliance — pick up from Jason (PTO), get merged** (2026-05-22)
  - PR: https://github.com/nrwl/nx/pull/35682 (draft, branch `feature/nxc-4460-rspack-rsbuild-v2-support`, author FrozenPandaz)
  - Scope: `@nx/rspack` + `@nx/rsbuild` + `@nx/angular-rspack` + `@nx/module-federation`; catalog `@rspack/core@2.0.4` / `@rsbuild/core@2.0.7`; v1 stays in support window; new `packageJsonUpdates` migrations for workspaces on v1
  - Goal: review, rebase if needed, address remaining CR, flip out of draft, merge
- [ ] Followup w/ Juri + Victor — oxfmt + oxlint (2026-05-22)
- [ ] Ask Alexis: bump Wagepoint TOIL policy 6 -> 7 days (Szymon gone) (2026-05-22)
- [ ] Check Chromatic account for Alexis (2026-06-04)
  - Alexis asked (Slack DM): is the Chromatic subscription yearly, and are there other users on the account?
  - Told her it should be the org-wide one we use; said I'd confirm tomorrow
  - Verify in Chromatic billing/members and report back
- [ ] **Weekly plan 2026-05-25 — Must Do block** (`dot_ai/para/areas/weekly-plans/2026-05-25.md`)
  - `/cnw-stats-analyzer` Mon AM — 9 wk stale, third week at top
  - `/scan-and-audit` W21 — 3 wk overdue
  - `/metrics-review npm` — 9+ wk overdue
  - O&A Thu refresh pulse 2026-05-28 (`/plan-week refresh`)
  - Land/close 5 review-iterating PRs: #35614, #35613, #35608, #35664, polygraph#4
  - NXC-3345 decide (48d overdue)
  - Commit+push NXC-4326, NXC-4325 worktrees
- [ ] Review CNW init enhancements spec — NXC-4311 + DOC-492 + NXC-4367 (2026-05-13)
  - Plan: `dot_ai/2026-05-12/specs/cnw-init-enhancements.md`
  - Goal: Read patched spec, hand to Codex/Gemini for second-pass review if desired, then green-light implementation
- [ ] NXC-4401: E2E agentic Cloud onboarding (2026-04-29)
  - Plan: `.ai/2026-04-29/tasks/doc-490-agentic-cloud-onboarding.md`
  - Goal: route `nx connect`, `nx init`, and CNW through `nx-cloud onboard connect-workspace --json` in agent mode so Cloud setup stays in the terminal
- [ ] NXC-4355 Investigation (2026-04-24 10:00)
  - Plan: `.ai/2026-04-24/tasks/nxc-4355-investigation.md`
- [ ] Benchmarks repo
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
- [ ] Publish remote cache packages to address CVEs and close GH issue (2026-04-23)
- [ ] Review PR #34890 (2026-03-23)
- [ ] Review Ben's 3 Ocean PRs — structural/dev improvements (2026-04-10)
  - #10265 — fixes `op-secrets`, not injecting env vars for e2e dev (adds fallback when 1Password CLI unavailable)
  - #10264 — fixes ToS redirect flake in e2e tests (DB/env drift between fixtures and app server)
  - #10635 — renames 3 misnamed `feature-*` libs to `util-*` + adds `nx_tags` to 5 untagged libs (~300 files)

## Active Claude Sessions

- /Users/jack/projects/nx-worktrees/DOC-544 (branch: DOC-544) + /Users/jack/projects/nx-blog (branch: doc-544-angular-refresh) — DOC-544 Angular content refresh: nx commit 8529748d7b + nx-blog commit 3664e2c, both committed NOT pushed. Inventory + plan on Linear DOC-544 comment. Plan: `dot_ai/2026-07-07/tasks/doc-544-angular-content-refresh.md`, Polygraph `doc-554-angular-content-6732d8a8` (2026-07-07)
- /Users/jack/projects/nx-worktrees/NXC-4606 (branch: NXC-4606-report-connect) — NXC-4606 revised: perf-report "Enable remote cache" button/hint + centered short URL, draft PR #36255 (old approach kept on #36250 / branch NXC-4606). Review + CI pending. Plan: `dot_ai/2026-07-06/tasks/nxc-4606-tui-not-connected-status.md`, Polygraph `nxc-4606-e6f49ee0` (2026-07-07)
- /Users/jack/projects/nx-worktrees/NXC-2793 (branch: NXC-2793) — NXC-2793 intermittent lockfile "Source project does not exist: npm:x" graph errors: landscape scan, code trace, repro, fix. Plan: `dot_ai/2026-07-05/tasks/nxc-2793-lockfile-intermittent-errors.md`, Polygraph `nxc-2793-bc2a19f2` (2026-07-05)
- /Users/jack/projects/nx (branch: feature/nxc-3510-node-executor-port-release) — NXC-3510 fixed, draft PR #36230 awaiting CI. Plan: `dot_ai/2026-07-05/tasks/nxc-3510-node-executor-port-release.md`, Polygraph `nxc-3510-16626f3c` (2026-07-05)
- /Users/jack/projects/nx-worktrees/DOC-482 (branch: DOC-482) — DOC-482 remove Next.js from nx-dev DONE: draft PRs nx #36231 + nx-blog #52. JACK: push banner-monitor.yml patch (app token lacks workflows perm, change sits uncommitted in worktree), verify deploy preview, merge nx-blog first. Plan: `dot_ai/2026-07-05/tasks/doc-482-remove-nextjs.md`, Polygraph `doc-482-remove-nextjs-76fe0b0d` (2026-07-05)
- /Users/jack/projects/nx-worktrees/NXC-4360 (branch: pr-fix-vite-plugin) — PR #34890 rebase + CI green (vite ts paths custom targets, shairez fork). Plan: `dot_ai/2026-07-03/tasks/pr-34890-rebase-vite-ts-paths.md`, Polygraph `rebase-pr-34890-and-get-ci-passing-ccb7065a` (2026-07-03)
- /Users/jack/projects/nx-worktrees/Q-520 + /Users/jack/projects/ocean-worktrees/Q-520 (branch: Q-520) — Q-520 sandbox add-on toggle IMPLEMENTED: 5 local commits, all verification green; awaiting Mandrill template upload by Jack, then push + draft PR to main (2026-07-02)
- /Users/jack/projects/remotion-projects (branch: main) — Task Sandboxing explainer video (bespoke vector recreation, branch feat-awesome, violations 12->5->0, clean end). Plan: `dot_ai/2026-06-12/tasks/sandboxing-remotion-video.md` (2026-06-12)
- /Users/jack/projects/nx-worktrees/NXC-4431 (branch: NXC-4431) — Audit publish.yml against npm publisher supply-chain advisory, commit d4b5eb2708 ready, not pushed (2026-05-08)
- /Users/jack/projects/nx-worktrees/NXC-4326 (branch: NXC-4326) — Deprecate `@nx/expo` withNxMetro: Linear comment posted, runtime warn + JSDoc, generator template switched to stock `@expo/metro-config`, migration `update-23-0-0-remove-with-nx-metro` (beta.10) + md doc + 6 passing spec tests; uncommitted (2026-05-13)
- /Users/jack/projects/nx-worktrees/NXC-4316 (branch: NXC-4316) — Deprecate `nxViteTsPaths` + `nxCopyAssetsPlugin`: runtime warn-once + `@deprecated` JSDoc + configure-vite docs swap, draft PR #35664; TS-solution gate verified, fixture fix (pnpm-workspace.yaml) lands 4 prev-failing tests. Migration codemod intentionally deferred — open Q whether to file follow-up or leave for v24 removal (2026-05-13)
- /Users/jack/projects/nx (branch: feature/nxc-4318-remove-already-deprecated-webpack-plugins) — v23 polish PR #35659 follow-ups: 5 commits ahead of master (alias + multi-match + 3 polish + clean specifier removal). HEAD `64ba9780ed`. All 3 migration specs green locally with `NODE_OPTIONS=--experimental-vm-modules`; 4 unrelated webpack failures in `e2e-web-server-info-utils.spec.ts` (npx vs pnpm exec snapshot drift, pre-existing). Push pending. Test workspace at `/Users/jack/projects/v23-migration-tests/` with `SUMMARY.md` (15 findings catalog), `.ai/2026-05-11/tasks/v23-migration-followups.md` for next-session resumption (2026-05-13)- /Users/jack/projects/nx-worktrees/NXC-4324 (branch: NXC-4324) — Deprecate webpack/rspack compose helpers (composePlugins/withNx/withWeb/withReact): warn-once-per-package + `@deprecated` JSDoc + suppression counter wrapping 3 internal composers (rspack executor, storybook, next CT) + 3 docs asides + 3 specs (green). Commit `3790a78ba4`, pushed, draft PR #35867 (https://github.com/nrwl/nx/pull/35867). Polygraph session `nxc-4324-2bacd010`. Open: review's DRY-factory ask (recommended against) + run affected suite (gradle blocks `nx` in sandbox) before mark-ready. Follow-up: rspack React generator emits compose configs unconditionally even w/ inferred plugin (2026-06-03)
<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

## Later
