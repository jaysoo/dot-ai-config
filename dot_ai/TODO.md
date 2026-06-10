# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **Capture analytics opt-in answer in `nx init` + CNW telemetry (recordStat) — PR #35922 MERGED** (2026-06-10)
   - Summary: recordStat already sent the Nx Cloud prompt result; added the analytics opt-in answer as `analyticsPrompt: 'yes' | 'no' | 'unset'` in the `complete` stat for both create-nx-workspace and `nx init`. CNW: `determineAnalytics` boolean -> tri-state threaded into meta. `nx init`: now asks the prompt right after the Cloud prompt (previously deferred to first command), persists to nx.json, records the answer; consolidated into `ensureAnalyticsPreferenceSet(root?, interactive?)` with no new eager startup-path module loads. Triage review F1-guard + F4 (CNW determineAnalytics tests) applied locally; declined F2/F3 (pre-existing/hypothetical). Merged before final fixes were pushed. Single-repo Polygraph session.
   - Files: `dot_ai/2026-06-10/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35922, Polygraph session `capture-analytics-opt-in-22331534`

2. **Disable Add-ons settings page for OSS orgs (Nx Cloud / ocean) — PR #11730 ready** (2026-06-09)
   - Summary: OSS orgs got a fully functional Add-ons page (loader only locked `plan === 'FREE'`/Hobby). Extended lock to OSS so they see the visible-but-locked page + upgrade prompt, same as Hobby. One-line loader fix in `feature-organization-add-ons` (`|| organization.plan === 'OSS'`) routing OSS into the existing `planLocked` branch + mirrored OSS spec. 28/28 pass, no nav/component changes. Coordinated via Polygraph (work delegated to ocean child agents).
   - Files: `dot_ai/2026-06-09/SUMMARY.md`, PR https://github.com/nrwl/ocean/pull/11730, Polygraph session `disable-oss-addons-1b747745`

3. **Q-491: Scope CIPE sandbox banner to current CIPE + remove total (Nx Cloud / ocean) — draft PR #11733** (2026-06-08)
   - Summary: CIPE sandbox banner counted violations over a rolling 7-day branch window (same query as the dashboard), so "X of Y tasks" disagreed with what ran in the viewed CIPE (Jason flagged in Slack). Added `getSandboxViolationTaskCountForRunGroup` (distinct violating taskIds scoped to the current run group), swapped the run-group-details loader off the dashboard query, dropped `sandboxTotalTaskCount` end-to-end, reworded to "N task(s) in this run has/have sandbox violations." tsc clean on 3 projects; 6/6 + 18/18 specs. No version plan (unreleased sandbox feat plans cover it). Pushed + draft PR via Polygraph.
   - Files: `dot_ai/2026-06-08/SUMMARY.md`, PR https://github.com/nrwl/ocean/pull/11733, Polygraph session `fix-sandbox-3cce39e3`

4. **DOC-513: Mark Manual DTE as Enterprise-only docs — MERGED PR #35864** (2026-06-04)
   - Summary: Reframed docs per Joe's model (Nx Agents = task-distribution system on all plans; bring your own compute = Enterprise-gated). Term + route rename "Manual DTE" -> "Bring your own compute" with 301 redirect + repointed nx-dev/_redirects. Kept --distribute-on=manual flag. PR #35864 merged.
   - Files: `dot_ai/2026-06-04/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35864

5. **NXC-4395: @nx/next multi-version compliance — PR #35870 (CI green, ready to merge)** (2026-06-04)
   - Summary: Redid @nx/next compliance (P15, milestone NXC-4072) in fresh Polygraph session `multi-4395-ae050ce9`; original #35652 closed (branch polluted). Kept Next v14 per user (overrides findings #1/#2): window v14+v15+v16, floor 14.0.0, `assert-supported-next-version.ts` + floor assert in all 8 generators + `all-generators-enforce-floor.spec.ts`. `keepExistingVersions` on all 6 install sites (init/app/library/add-linting + styles.ts + add-swc). Base `20.7.1-beta.0` migration gated `^15.0.0`. CVE audit (GH Advisory DB) bumped fresh-install pins to lowest high/critical-free patch: next14 14.2.35 / next15 15.5.18 / next16 16.1.6 (no CVE-free 14.x exists - documented trade-off). 2 review rounds + self-healing CI: fixed keepExistingVersions plumbing, restored an inferred-plugin test a cherry-pick artifact deleted, caught 2 missed sweep sites. 18 files, single commit, mergeable clean.
   - Files: `dot_ai/2026-06-04/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35870, Polygraph session `multi-4395-ae050ce9`

6. **DOC-509: targetDefaults spread token across task tutorials - PR #35871 ready** (2026-06-04)
   - Summary: Documented the `"..."` spread token (Nx 23.0.0) across three getting-started tutorials. `configuring-tasks` (new "Extending target defaults for a project" section, `dependsOn: ["...", "generate-api-types"]`), `caching` (per-project `inputs: ["...", ...]` example), `reducing-configuration-boilerplate` (inline spread example in cascade section). package.json/project.json tabs synced via `syncKey`. Review feedback: `"..."` reworded to expand any inherited config (targetDefaults OR inferred plugin task), replaced a back-reference link with a real example. Single-repo Polygraph session `docs-spread-6df4621c`; marked ready by Jack, not merged.
   - Files: `dot_ai/2026-06-04/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35871, Polygraph session `docs-spread-6df4621c`

7. **NXC-4399: @nx/react multi-version support compliance — draft PR #35872, CI green** (2026-06-04)
   - Summary: Redid @nx/react compliance (P19) in fresh Polygraph session `multi-version-jack-398d33f1` per the @nx/vue precedent (#35845). Three review rounds: fixed react-router-dom version-source divergence, reverted @react-router/dev/serve peers (broke @nx/remix e2e via react-server-dom-webpack@19 ERESOLVE), bumped redux to RTK ^2.5.0/react-redux ^9.2.0 for React 19. CI green on self-healing rerun `dab1a2243d`; draft pending mark-ready.
   - Files: `dot_ai/2026-06-04/SUMMARY.md`, PR https://github.com/nrwl/nx/pull/35872, Polygraph session `multi-version-jack-398d33f1`

8. **NXC-4324: deprecate webpack/rspack compose helpers — draft PR #35867** (2026-06-03)
   - Summary: Warn-only v23 deprecation (removal v24) of `composePlugins`/`withNx`/`withWeb`/`withReact` across `@nx/webpack`, `@nx/rspack`, `@nx/react/webpack`. `@deprecated` JSDoc + warn-once-per-package runtime message -> NxApp*Plugin classes + `convert-to-inferred`. No codemod/generator changes. Key design: synchronous process-level suppression counter wrapping the 3 real internal composers (rspack executor, storybook preset, next CT preset) so non-compose users never see false-positive warnings. 3 deprecation utils + 3 specs (green) + 3 docs asides. Review approved w/ one DRY ask (factory) recommended against. Awaiting affected suite (gradle sandbox blocks `nx` locally) before mark-ready.
   - Files: `dot_ai/2026-06-03/SUMMARY.md`, plan `~/.claude/plans/breezy-wobbling-haven.md`, PR https://github.com/nrwl/nx/pull/35867, Polygraph session `nxc-4324-2bacd010`

9. **Polygraph docs: move under `/docs` + Framer edge rewrite — PR #4 draft** (2026-05-12)
   - Summary: Multi-repo Polygraph session porting nrwl/nx's astro-docs `base: '/docs'` + `outDir: 'dist/docs'` setup and `netlify/edge-functions/rewrite-framer-urls.ts` to nrwl/polygraph-docs. trypolygraph.com now serves Starlight docs under `/docs/*` and proxies non-`/docs` HTML to `https://active-startup-540669.framer.app/<path>` (streaming-rewriting the framer origin back to `trypolygraph.com`). Iterated twice on trailing-slash behavior — `build.format: 'file'` baked `.html` into Starlight sidebar/canonical URLs, so reverted and adopted nx's exact pattern (`publish = "dist/docs"` + `/docs/* -> /:splat` rewrite). 3 commits, draft PR. Side: filed polygraph-docs pre-push commitlint hook bug in PR body.
   - Files: `dot_ai/2026-05-12/SUMMARY.md`, `dot_ai/2026-05-12/tasks/polygraph-docs-base-path-and-framer-rewrite.md`, PR https://github.com/nrwl/polygraph-docs/pull/4

10. **NXC-4448: Cypress 15.14 bump + remove stale Vite 8 guard — NEW PR #35613 draft** (2026-05-08)
   - Summary: Cypress 15.14.0 added Vite 8 support (cypress-io/cypress#33078, 2026-04-16); nx had stale `^15.8.0` pin + a `vite >= 8` throw guard in `component-configuration`. Bumped versions, removed guard, added split `packageJsonUpdates` entries (cypress + dev-server independently gated), wrote `remove-experimental-prompt-command` codemod for the flag Cypress 15.13.0 removed, dropped 8 Vite-7-downgrade workarounds in e2e tests (1 active test now exercises Vite 8). Filed as blocking issue for NXC-4154. Multiple review iterations: requires-gate for codemod, quoted-key fix on selector, split packageJsonUpdates entry. Two master rebases (one with rename conflict resolved).
   - Files: PR #35613, latest commit `db37fa7ed9`, `dot_ai/2026-05-08/SUMMARY.md`

## TODO

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

- /Users/jack/projects/nx-worktrees/docs-v23-prep (branch: docs-v23-prep) — v23 compat-matrix alignment across astro-docs (11 pages: peer dep range fixes + 23.x rows in TS/Node/Nest/createNodes matrices); commit 9f5e662548, draft PR #35943 (https://github.com/nrwl/nx/pull/35943), vale clean, validate-links deferred to CI (dotnet/gradle block local build). Awaiting CI before mark-ready. Polygraph session docs-update-misc-updates-v23-837b8d30. Plan: `dot_ai/2026-06-10/tasks/docs-v23-compat-matrices.md` (2026-06-10)
- /Users/jack/projects/nx-worktrees/NXC-4453 (branch: feature/nxc-4453-update-docs-to-account-for-agentic-flow) — NXC-4453 nx migrate agentic docs: draft PR #35917, commit 0f4b8eebc2, awaiting CI (build + validate-links) + review before mark-ready; PR body still says `--mode` in one phrase (2026-06-10)
- /Users/jack/projects/nx-worktrees/NXC-4431 (branch: NXC-4431) — Audit publish.yml against npm publisher supply-chain advisory, commit d4b5eb2708 ready, not pushed (2026-05-08)
- /Users/jack/projects/nx-worktrees/NXC-4326 (branch: NXC-4326) — Deprecate `@nx/expo` withNxMetro: Linear comment posted, runtime warn + JSDoc, generator template switched to stock `@expo/metro-config`, migration `update-23-0-0-remove-with-nx-metro` (beta.10) + md doc + 6 passing spec tests; uncommitted (2026-05-13)
- /Users/jack/projects/nx-worktrees/NXC-4316 (branch: NXC-4316) — Deprecate `nxViteTsPaths` + `nxCopyAssetsPlugin`: runtime warn-once + `@deprecated` JSDoc + configure-vite docs swap, draft PR #35664; TS-solution gate verified, fixture fix (pnpm-workspace.yaml) lands 4 prev-failing tests. Migration codemod intentionally deferred — open Q whether to file follow-up or leave for v24 removal (2026-05-13)
- /Users/jack/projects/nx (branch: feature/nxc-4318-remove-already-deprecated-webpack-plugins) — v23 polish PR #35659 follow-ups: 5 commits ahead of master (alias + multi-match + 3 polish + clean specifier removal). HEAD `64ba9780ed`. All 3 migration specs green locally with `NODE_OPTIONS=--experimental-vm-modules`; 4 unrelated webpack failures in `e2e-web-server-info-utils.spec.ts` (npx vs pnpm exec snapshot drift, pre-existing). Push pending. Test workspace at `/Users/jack/projects/v23-migration-tests/` with `SUMMARY.md` (15 findings catalog), `.ai/2026-05-11/tasks/v23-migration-followups.md` for next-session resumption (2026-05-13)- /Users/jack/projects/nx-worktrees/NXC-4324 (branch: NXC-4324) — Deprecate webpack/rspack compose helpers (composePlugins/withNx/withWeb/withReact): warn-once-per-package + `@deprecated` JSDoc + suppression counter wrapping 3 internal composers (rspack executor, storybook, next CT) + 3 docs asides + 3 specs (green). Commit `3790a78ba4`, pushed, draft PR #35867 (https://github.com/nrwl/nx/pull/35867). Polygraph session `nxc-4324-2bacd010`. Open: review's DRY-factory ask (recommended against) + run affected suite (gradle blocks `nx` in sandbox) before mark-ready. Follow-up: rspack React generator emits compose configs unconditionally even w/ inferred plugin (2026-06-03)
<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

## Later
