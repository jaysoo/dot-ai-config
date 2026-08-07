# TODO

## In Progress

- [ ] DOC-569: Refresh "Extending Nx" pages, one feature page (2026-08-07)
  - Plan: `dot_ai/2026-08-07/tasks/doc-569-extending-nx-feature-page.md`
  - Goal: new `Platform features > Multi-language support` feature page (plugin anatomy: glob, createNodesV2 projects+tasks, createDependencies, testing); absorb + redirect `kb/project-graph-plugins`; link KB deep-dives. Target: AI/reader produces a usable plugin in under an hour.

- [ ] Nx keyword & prompt audit + expansion (Ahrefs) (2026-08-06)
  - Plan: `dot_ai/2026-08-06/tasks/nx-keyword-prompt-audit.md`
  - Goal: audit the 99 Rank Tracker keywords + 13 Brand Radar prompts, prune what is not earning its slot, expand both to cover untracked demand.
  - Done: all 5 phases. 40 of 99 keywords leave, 59 survive. Shipping set = `output/keywords-add-100.csv` (100 kw, 9% branded, each mapped to an Nx CLI/Cloud capability) + `output/prompts-add.csv` (30 prompts, 75 daily Brand Radar runs vs 13 today). 844-row evidence pool kept as the bench. Read `output/gaps.md`.
  - Two blockers to raise with Jeff: Rank Tracker positions for project `Nx` are wrong (desktop/mobile/Site Explorer disagree on head terms), and the Brand Radar global prompt corpus needs an addon this subscription lacks.
  - Open: confirm Brand Radar run cost before importing; two of the seven highest-value "gap" prompts were dropped by the MCP/repo-merge exclusions and could come back.

- [ ] DOC-571: Update migration from Turborepo (2026-08-05)
  - Plan: `dot_ai/2026-08-05/tasks/doc-571-update-migration-from-turbo.md`
  - Goal: rewrite `from-turborepo.mdoc` as 8 step-by-step steps + AI prompt card; cover the four things `nx init` does not convert (`<package>#<task>` fragments, per-package turbo.json, `persistent`, task-level `env`) with the `targetDefaults` array + `filter.projects` form; demote mapping tables to a closing note. Also moved to `/docs/kb/from-turborepo` + featured (Angular version matrix unfeatured), redirect added, sidebar entry dropped. Committed `641b43e7d0` on branch DOC-571, not pushed, no PR.

- [ ] DOC-542: Sync /docs/kb into the Pylon KB (2026-08-04)
  - Plan: `dot_ai/2026-08-04/tasks/doc-542-pylon-kb-sync.md`
  - Goal: mirror `/docs/kb` into the Pylon KB so "suggest KB answer" can link support-widget askers to articles. Crawl + training-data upload do NOT feed that feature (Caleb) - only real KB articles, and the API takes `body_html` only, so Caleb's Markdoc->HTML converter is required.
  - BLOCKED on: does `is_unlisted: true` exclude articles from suggested answers? All 173 existing articles are unlisted. Steven/Caleb to test (~5 min).

- [ ] NXC-4762: Replace minimatch with picomatch in core package (2026-08-04)
  - Plan: `dot_ai/2026-08-04/tasks/nxc-4762-minimatch-to-picomatch.md`
  - Goal: swap minimatch -> picomatch across nx/devkit/jest/playwright/react/rsbuild (brace-expansion CVE GHSA-rgw5-rvv9-x895); bump brace-expansion override to patched 5.0.9 for the dev tree. Key divergence handled: `{**/a,**/b}` combined globs miss root files in picomatch -> splitGlobPatterns.

- [ ] CLOUD-4927: Frontend/Polygraph vulnerabilities - HIGH (2026-07-30)
  - Plan: `dot_ai/2026-07-30/tasks/cloud-4927-frontend-polygraph-high-vulns.md`
  - Goal: clear the 20 high-severity trivy CVEs on nx-cloud-frontend / polygraph-frontend via pnpm overrides.
  - Status: draft PR https://github.com/nrwl/ocean/pull/12656, commit `ce67755bdc`, rebased onto `532113a400` (Nicole's OTel #12631, merged) and force-pushed. brace-expansion/js-yaml/undici/lodash-es/path-to-regexp/@grpc/grpc-js bumped + polygraph tar drift fixed. Typecheck + frozen-lockfile + override-sync all green post-rebase; conformance gate unverifiable locally (no Nx Cloud PAT).
  - Linear triaged (20 sub-issues): 8 In Review on this PR, 2 Duplicate of CLOUD-4985 (Nicole's OTel work under CLOUD-4936), 9 Canceled as already-patched, parent In Review.
  - CLOUD-5066 filed in the Remix V2 Migration project for the 4 RR7-blocked CVEs: CLOUD-4935 (turbo-stream, from 4927) + CLOUD-4981/4982/4983 (react-router, from 4936), all reparented under it. RR 7.18.0 is the binding floor; CVE-2026-53668 has no 6.x fix at all.
  - Post-rebase finding: main still resolves `@grpc/grpc-js` 1.14.3 even after the OTel bump, so the `^1.14.4` override is load-bearing for CLOUD-4945/4946.
  - Follow-ups: npm vendors brace-expansion 5.0.7 with no fixed npm release (CLOUD-4932 will still report on rescan; needs a later Dockerfile npm pin or a scoped rego ignorePolicy); `validate-pnpm-overrides.mjs` does not cover `apps/polygraph`, which is how its tar override drifted. RR7-blocked CVEs are now tracked on CLOUD-5066, not here.

- [ ] CLOUD-4891: Cookie-based env overrides for cloud e2e tests (2026-07-27)
  - Plan: `dot_ai/2026-07-27/tasks/cloud-4891-cookie-env-overrides.md`
  - Goal: per-request `e2e-env-override` cookie merged into `context.serverEnvironment` in `createDataArgs`, gated on `E2E_TEST_MODE`, so a Playwright test permutes env flags with no server restart.
  - Status: draft PR https://github.com/nrwl/ocean/pull/12652 awaiting CI. Spec verified locally vs dev server (passes; first-attempt vite-blank flake is dev-server-only, artifacts in worktree `dist/cloud-4891-e2e-demo/`). Follow-up to file: retire `serveDistTaskAnalyticsRolloutDisabled` via `envOverride.set()`.

- [ ] Churn signals validation + competitor cost model (2026-07-24)
  - Plan: `dot_ai/2026-07-24/tasks/churn-signals-and-cost-model.md`
  - Goal: prospectively backtest S1-S4 churn signals (Apr 1 snapshot -> May-Jul churn) for in-product alerts; build GHA/Blacksmith/Depot-comparable cost model ($/vCPU-min + GHA-equivalent-spend ratio). Spike signals falsified. Awaiting Query A/B exports from Jack.

- [ ] Gauge AI sentiment/misinformation action items for nx.dev/docs (2026-07-22)
  - Plan: `dot_ai/2026-07-22/tasks/gauge-ai-sentiment-nx-docs-action-items.md`
  - Goal: collect Gauge session notes, produce prioritized (high/med/low) action items each with effect-tracking method

- [ ] NXC-4612: Investigate nightly E2E matrix ("golden") failures (2026-07-28)
  - Plan: `dot_ai/2026-07-28/tasks/nxc-4612-golden-e2e-matrix-failures.md`
  - Goal: root-cause why E2E matrix has been red on master every day for 15+ runs. Triage done: 45/139 jobs, 302 distinct failures -> 5 root causes.
  - Fixed (unpushed, branch NXC-4612): `0c7462479f` e2e harness no longer appends `--verbose` under `NX_E2E_VERBOSE_LOGGING` (clears 114 snapshot failures). Scope kept to the test-only fix per Jack.
  - LIVE FIELD BUG found, FOLLOW-UP: typescript@7.0.2 went npm `latest` 2026-07-08; its entry exports no compiler API, npm hoists it via loose peers, so `create-nx-workspace --preset=react-monorepo --package-manager=npm` is broken on released nx (reproduced on 23.1.0). Candidate fix parked on local branch `nxc-4612-typescript-7-preset-pin` (`461e15b3e5`); scoping unsettled (only react proven broken, and existing workspaces may hit it too).
  - Open: @rspack/core npm ERESOLVE; e2e-nx misc (missing "It's time to update Nx" warning, http remote cache, move/remove project); infra (nx native SIGSEGV, maven-batch-runner).

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **GitHub issue + PR closure triage (nx)** (2026-08-07)
   - Summary: Screened all 332 open issues; 72 of the 184 older than 6 months met the closure criteria and were investigated one at a time against nx 23.1.1, plus the 11 low-activity issues with a linked PR. 37 to close / 12 unsure / 39 keep, each with a full trace + draft closing comment. The decisive step was a second adversarial pass — the first pass had the same agent both run and grade each repro, so the 17 uncorroborated "I ran it and it worked" closures went to independent agents told to refute them: **13 of 17 refuted** (8 reproduced outright on 23.1.1), dropping close 45 → 32. Repeat failure modes: `CLAUDECODE=1` disables the nx TUI so an agent-run TUI test proves nothing; stale cached graphs report success without `nx reset --skip-nx-cache`; wrong preset yields a layout where the bug is structurally impossible. Cleanest category came from searching the whole issue set, not the aging pool: the four self-hosted cache packages were deprecated on npm 2026-05-21 over CVE-2025-36852 and will never be patched (5 closes). PR half of the ask does not apply — no drive-by-PR backlog exists. Nothing posted to GitHub.
   - Files: `dot_ai/2026-08-07/tasks/github-issue-pr-closure-triage.md`, report https://claude.ai/code/artifact/f2348ede-848e-43f7-91ee-b5367366e531

2. **DOC-579: Getting-started cleanup — intro, Start a New Project, Add to Existing (nx) — MERGED #36595** (2026-08-06)
   - Summary: Merged as `130727796c`. De-emphasized Nx Cloud onboarding across the three getting-started entry points: "Start a New Project" is create-nx-workspace only (the "Option 2: Create via Nx Cloud" section and its screenshot are gone), and the template section points at the gallery instead of listing the four prompt starters. Both onboarding pages now share a shape — copyable agent prompt, one terminal block with the command plus its sample run, then matching Next steps and Keep learning (editor setup swapped for AI integrations + CI setup). Timings and both agent prompts were lifted off the live cloud.nx.app/get-started page before it goes away. A new `astro-docs/ec.config.mjs` Expressive Code plugin backs the terminal blocks: `{% meta="prompt=true" %}` strips `$ ` before shiki so the command highlights normally, mutes the prompt and output lines, and makes Copy hand over the commands alone.
   - Files: `dot_ai/2026-08-06/tasks/doc-579-getting-started-cleanup.md`, PR https://github.com/nrwl/nx/pull/36595, Polygraph `noble-osprey-dd3ebfa3`

3. **DOC-573: KB Monorepo CI best practices (nx) — MERGED #36593** (2026-08-06)
   - Summary: Merged as `7dd949e953`. New `/docs/kb/monorepo-ci-best-practices` (~3000 words) aimed at Buildkite's #1 SERP result, ordered by payoff rather than by feature. Path-based filtering and graph-based affected each get a full GitHub Actions workflow so the contrast lands on one page. Also documented `projectsAffectedByDependencyUpdates` in the `nx.json` reference. The agent audit prompt was live-tested twice against a throwaway 10-package pnpm monorepo: v1 asked for wall-clock and queue time that no repository can supply, so it was rebuilt around `Present`/`Absent`/`Needs CI access` with the run-history metrics handed back to the user. Caleb's five nits addressed, including an invalid GitHub Actions snippet. Same merge shipped three new STYLE_GUIDE anti-AI rules. Split-out fix #36588 (KB index threw on any uncommitted article) merged separately.
   - Files: `dot_ai/2026-08-05/tasks/doc-573-monorepo-ci-best-practices.md`, PRs https://github.com/nrwl/nx/pull/36593 + https://github.com/nrwl/nx/pull/36588, Polygraph `vivid-moose-c9937bd5`

4. **Credit usage report: billing records + org rollup + licensed allowance (lighthouse) — MERGED #83** (2026-08-06)
   - Summary: Merged as `00e7369`. Report now reads `billing.billingRecords` instead of `workspaceCreditUsage`, which Altan flagged as a daily month-to-date snapshot that can miss a month's tail - one row per org per billing month with the licensed allowance, remaining balance, and a real execution count. New table + collector on the daily portal refresh, scoped to a rolling 3 months (invoicing starts 2026-08-15). Fixed a portal bug double-counting boundary ISO weeks. Verified in ocean that execution credits DO count against the allowance (5 sites, 53.7% of prod NA docs) but kept them excluded by Jack's call so report and portal agree - pending Joe. Org is now the primary lookup, since a shared-instance customer like PayFit is an org on ProdNA, not a tenant.
   - Files: `dot_ai/2026-08-06/tasks/credit-usage-report-billing-records.md`, PR https://github.com/nrwl/lighthouse/pull/83, Polygraph `credit-usage-lighthouse-follow-up-405aebca`

5. **GitHub App organization permissions: docs accuracy + stale CLI hint (nx + ocean) — MERGED #36581** (2026-08-05)
   - Summary: Fixed the `Administration` entry claiming it covered listing org repositories for setup — verified in ocean that listing runs through `GET /orgs/{org}/repos` and `GET /user/installations/{id}/repositories` (both `Metadata: read`), while only `GET /orgs/{org}/installations` needs org `Administration`. STYLE_GUIDE structural pass on a vale-clean page found a semicolon, a claim duplicated across two sections, and a balanced-contrast closer. Separately killed a stale ocean CLI hint telling users to grant `"Administration: Read & Write"` after the app stopped requesting it (guaranteed dead end, then a ticket). PR merged mid-session before the last two intro rewordings, so a 2-line follow-up branch is unpushed.
   - Files: `dot_ai/2026-08-05/tasks/github-app-org-permissions-docs.md`, PR https://github.com/nrwl/nx/pull/36581

6. **NXC-4687: CNW --preset empty escape hatch + template download errors (nx) — MERGED #36508** (2026-08-05)
   - Summary: Merged as `4a63dc82af`. Fixed `invalidPresetToTemplateMap` coercing `--preset empty` into the github template download (now aliases to the `ts` preset, npm-only, wins over --template so agents appending the flag escape); download errors classify 404 = missing repo, everything else = blocked egress with --preset=empty hints across message/AI hints/pre-flight; strict slug regex closed the `nrwl/../evil` cross-org tarball hole. Survived two deep review rounds (all required findings fixed). Jack rejected v1 auto-fallback (presets != templates).
   - Files: `dot_ai/2026-07-29/tasks/nxc-4687-cnw-template-egress-fallback.md`, PR https://github.com/nrwl/nx/pull/36508, Polygraph `zesty-eagle-2a40a186`

7. **DOC-542: Pylon KB sync investigation (nx)** (2026-08-04)
   - Summary: Found Caleb's closed PR #36277 was a *move* (delete 143 docs pages, 301 to help.nx.app) plus a reverse Pylon->Pagefind search federation — superseded by DOC-552. But its API writes were never reverted: 182 articles are live in Pylon (173 unlisted, stale pre-DOC-552 copies). Also found Pylon has crawled nx.dev since Feb 2026, and `POST /training-data/upload-content` takes raw markdown — but per Caleb neither feeds "suggest KB answer", which only uses real KB articles. So the HTML converter is required after all. Drift measured: 157 slug matches / 27 to create / 16 orphans to delete.
   - Files: `dot_ai/2026-08-04/tasks/doc-542-pylon-kb-sync.md`

8. **CLOUD-4927: Frontend/Polygraph HIGH vulnerabilities (ocean) — draft PR #12656** (2026-07-30)
   - Summary: Triaged all 20 CVE sub-issues; shipped the fixable set as pnpm overrides mirrored across root + both apps (brace-expansion, js-yaml@4, undici, + new lodash-es / path-to-regexp / @grpc/grpc-js). Caught that the ticket's undici "fixed in 6.26.0" is wrong — the advisory says 6.27.0, so we'd have shipped still-vulnerable. Rebased onto Nicole's merged OTel #12631. Filed CLOUD-5066 in the Remix V2 Migration project for the 4 RR7-blocked CVEs.
   - Files: `dot_ai/2026-07-30/tasks/cloud-4927-frontend-polygraph-high-vulns.md`, Polygraph `sharp-puma-7f09fb0e`

9. **NXC-4688: Optional webpack/MF deps for @nx/react + @nx/next (nx) - MERGED #36492** (2026-07-30)
   - Summary: MF packages -> optional peers with lazy loading + backfill migrations (Leo's #36310 pattern); @svgr/webpack + @nx/rollup dropped; found + fixed field bug where @nx/module-federation's exact webpack pin duplicated against @nx/webpack's ^5.101.3 range, breaking all webpack MF builds once webpack 5.109 shipped. Squash `820a3a6aaa`.
   - Files: `dot_ai/2026-07-27/tasks/nxc-4688-react-next-webpack-mf-optional-deps.md`, Polygraph `react-mf-cleanup-04580e9b`

10. **ga-traffic refresh: nx.dev GA4+GSC data through 2026-07-29 (dot-ai-config)** (2026-07-30)
   - Summary: Refreshed ALL raw series in the ga-traffic pipeline (8 GA4 dailies, gsc-daily, monthly-segments Jun-final+Jul-partial, channels-by-month) via a new in-page GA4 internal-RPC replay method (XSRF header + secondary-dimension gotcha documented). Reran process.mjs (455 days, 14/14 integrity). Jul: GSC organic still falling ~-11%/mo (49.3K clicks thru Jul 29 vs Jun 59K); server_page_view flat ~5.1-5.4M/mo; AI crawlers shifted into /blog (now ~30% of server events).
   - Files: `dot_ai/2026-07-30/tasks/ga-traffic-refresh/` (scrapes + merge.mjs + README), pipeline at `dot_ai/2026-06-19/tasks/ga-traffic/`

## TODO

- [ ] **Q-520 follow-up: get Mandrill template `nx-cloud-plan-add-on-requested` into the ocean repo** (2026-07-27)
  - Context: PR #12211 merged; the add-on request flow sends this email to org admins, but the template only exists in Mandrill (published by hand). Nothing in-repo defines or version-controls it.
  - Goal: commit the template alongside the other ocean email templates so it is reviewable and reproducible, not Mandrill-only state.
  - Ref: `dot_ai/2026-07-02/tasks/q-520-sandbox-dashboard-add-on-toggle.md`

- [ ] **Joe 1:1 follow-ups** (2026-07-21)
  - Notes: `dot_ai/para/areas/personnel/joe.md` (2026-07-21 entry)
  - [ ] Sync with Elijah on enterprise billing mechanics — invoice flow, Lighthouse report format, backfill Security Scorecard usage to sense-check overage numbers (update by Thu 2026-07-23)
  - [ ] Pull self-serve usage + Stripe data to validate churn hypothesis (remote-cache-only -> churn); ping Joe with findings this week
  - [ ] Evaluate Gauge trial, share notes (by Fri 2026-07-24)
  - [ ] Write unbranded monorepo consolidation article (poly-repo -> monorepo via nx import; Nx mentioned naturally)
  - [ ] Review Joe's Claude-drafted comparison articles; get Victor/Jeff sign-off before publishing

- [ ] **Google organic traffic decline assessment** (2026-07-15 10:41)
  - Plan: `dot_ai/2026-07-15/tasks/google-search-traffic-decline-assessment.md`
  - Goal: explain the December 2025 organic-search break and prioritize recovery actions for nx.dev docs, marketing, and blog pages

- [ ] **Jeff 1:1 follow-ups** (2026-07-14)
  - Notes: `dot_ai/para/areas/personnel/jeff.md` (2026-07-14 entry)
  - [ ] Send Jeff Cloud local setup instructions (snapshot vs staging + Mongo IP whitelisting)
  - [ ] Create Notion page summarizing Jeff's three engineering efforts (Oxlint/Biome formatting, Remix migration, sandbox violations)
  - [ ] Check with Ben on Remix -> React Router 7 migration status - still available for Jeff to pick up?
  - [ ] Send Jeff Neovim config + plugin list

- [ ] **NXC-4649: Investigate CNW acquisition decrease + error trends** (2026-07-14)
  - Linear: https://linear.app/nxdev/issue/NXC-4649 (In Progress)
  - Goal: dig into why create-nx-workspace acquisition dropped; find error trends driving drop-off
  - Approach: `/cnw-stats-analyzer` (prod telemetry) - funnel over time, errors by type/version/command, correlate spikes with nx releases/template changes

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
  - Goal: verify-then-`require()` cloud bundle (sha256 + ed25519 sig), allowlist `commandName`, document daemon trust model. Server-side first (Nx Cloud), CLI side warn-only -> enforce
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

- /Users/jack/projects/nx-worktrees/NXC-4772 (branch: NXC-4772) — NXC-4772 Vite 8 `configLoader: 'native'` warnings: reproduced both in a fresh workspace, fixed `@nx/vitest` `__dirname` -> `import.meta.dirname`, root aggregator -> `vitest.config.mts`, nuxt `.ts` fallback gated on legacy eslintrc, plus a `23.2.0-beta.6` backfill migration. Awaiting `nx affected` + commit/push. Plan: `dot_ai/2026-08-07/tasks/nxc-4772-vite-native-config-loader-warning.md`, Polygraph `tidy-otter-932779b6` (2026-08-07)
- /Users/jack/projects/nx-worktrees/DOC-569 (branch: DOC-569) — DOC-569 Extending Nx feature page: draft PR https://github.com/nrwl/nx/pull/36601 awaiting Jack review + CI. Plan: `dot_ai/2026-08-07/tasks/doc-569-extending-nx-feature-page.md`, Polygraph `brisk-penguin-af6d8609` (2026-08-07)
- /Users/jack/projects/dot-ai-config (branch: main) — Nx keyword & prompt audit + expansion. Phase 0 audit complete against live Ahrefs (project 8558520, Brand Radar report `Nx`); Phases 1-3 running across 11 agents. Working dir `dot_ai/2026-08-06/tasks/nx-keyword-prompt-audit/`. Plan: `dot_ai/2026-08-06/tasks/nx-keyword-prompt-audit.md` (2026-08-06)
- /Users/jack/projects/nx (branch: docs/github-app-permissions-intro-wording) — GitHub App org permissions. Main change MERGED as nx #36581, but the PR merged before the last two intro rewordings, so a 2-line follow-up sits at `61c35a9305` off `origin/master`, unpushed, no PR. Paired ocean fix (stale `"Administration: Read & Write"` CLI hint + version plan) on `/Users/jack/projects/ocean` branch `fix/onboarding-permission-hint` `b4faebb334`, unpushed, no PR — ocean PRs target `main`. JACK: push both. Plan: `dot_ai/2026-08-05/tasks/github-app-org-permissions-docs.md` (2026-08-05)
- /Users/jack/projects/nx-worktrees/DOC-571 (branch: DOC-571) — DOC-571 Turborepo migration guide rewrite + move to `/docs/kb/from-turborepo`: committed `641b43e7d0`, prettier/vale/validate-links green, live-tested against a real create-turbo + nx init workspace. Awaiting go-ahead to push + open a draft PR. Plan: `dot_ai/2026-08-05/tasks/doc-571-update-migration-from-turbo.md`, Polygraph `shiny-finch-d0837b3c` (2026-08-05)
- /Users/jack/projects/nx-worktrees/DOC-542 (branch: DOC-542) — DOC-542 Pylon KB sync: investigation done, plan written, no code yet. Blocked on the `is_unlisted` vs suggested-answers question (Steven/Caleb). Caleb's tooling to port from `origin/docs/pylon-kb-migration` (PR #36277, closed). Plan: `dot_ai/2026-08-04/tasks/doc-542-pylon-kb-sync.md` (2026-08-04)
- /Users/jack/projects/nx-worktrees/NXC-4762 (branch: NXC-4762) — NXC-4762 minimatch -> picomatch swap: code done, tests green, awaiting nx:test full suite + commit/push. Plan: `dot_ai/2026-08-04/tasks/nxc-4762-minimatch-to-picomatch.md`, Polygraph `lucid-ocelot-5a65ca7d` (2026-08-04)
- /Users/jack/projects/ocean-worktrees/CLOUD-4927 (branch: CLOUD-4927) — CLOUD-4927 frontend/polygraph HIGH vulns: draft PR https://github.com/nrwl/ocean/pull/12656 awaiting CI, rebased onto Nicole's merged #12631. #12630 (uuid) still open and will conflict on the overrides block. Plan: `dot_ai/2026-07-30/tasks/cloud-4927-frontend-polygraph-high-vulns.md`, Polygraph `sharp-puma-7f09fb0e` (2026-07-30)
- /Users/jack/projects/nx-worktrees/NXC-4612 (branch: NXC-4612) — NXC-4612 nightly E2E matrix triage: draft PR https://github.com/nrwl/nx/pull/36506 (test-only harness fix). TypeScript 7 fix parked on `nxc-4612-typescript-7-preset-pin` for a follow-up ticket. Plan: `dot_ai/2026-07-28/tasks/nxc-4612-golden-e2e-matrix-failures.md`, Polygraph `tidy-condor-02183c70` (2026-07-28)
- /Users/jack/projects/ocean-worktrees/CLOUD-4891 (branch: CLOUD-4891) — CLOUD-4891 cookie-based env overrides for cloud e2e: draft PR https://github.com/nrwl/ocean/pull/12652 awaiting CI. Plan: `dot_ai/2026-07-27/tasks/cloud-4891-cookie-env-overrides.md`, Polygraph `fresh-wombat-25345f30` (2026-07-30)
- /Users/jack/projects/ocean (branch: main) — Churn signals validation + cost model: backtest queries drafted, awaiting Query A/B exports. Plan: `dot_ai/2026-07-24/tasks/churn-signals-and-cost-model.md` (2026-07-24)
- /Users/jack/projects/nx-worktrees/NXC-4701 (branch: NXC-4701) — NXC-4701 TUI connect flow: draft PR https://github.com/nrwl/nx/pull/36460 awaiting CI + Jack review. Superseded prototypes #36250 + #36255 both closed. Plan: `dot_ai/2026-07-24/tasks/nxc-4701-tui-connect-flow.md`, Polygraph `ready-jackal-5efe8ef1` (2026-07-24)
- /Users/jack/projects/nx-worktrees/DOC-555 (branch: DOC-555) — DOC-555 SEO batch: draft PR https://github.com/nrwl/nx/pull/36459 awaiting Jack review + CI. Plan: `dot_ai/2026-07-24/tasks/doc-555-seo-page-plan.md`, Polygraph `vivid-iguana-930ae870` (2026-07-24)
- /Users/jack/projects/dot-ai-config (branch: main) — Gauge AI sentiment/misinformation action items for nx.dev/docs: collecting raw notes, then prioritized list w/ tracking. Plan: `dot_ai/2026-07-22/tasks/gauge-ai-sentiment-nx-docs-action-items.md` (2026-07-22)
- /Users/jack/projects/nx-worktrees/NXC-2793 (branch: NXC-2793) — NXC-2793 intermittent lockfile "Source project does not exist: npm:x" graph errors: landscape scan, code trace, repro, fix. Plan: `dot_ai/2026-07-05/tasks/nxc-2793-lockfile-intermittent-errors.md`, Polygraph `nxc-2793-bc2a19f2` (2026-07-05)
- /Users/jack/projects/nx (branch: feature/nxc-3510-node-executor-port-release) — NXC-3510 fixed, draft PR #36230 awaiting CI. Plan: `dot_ai/2026-07-05/tasks/nxc-3510-node-executor-port-release.md`, Polygraph `nxc-3510-16626f3c` (2026-07-05)
- /Users/jack/projects/nx-worktrees/DOC-482 (branch: DOC-482) — DOC-482 remove Next.js from nx-dev DONE: draft PRs nx #36231 + nx-blog #52. JACK: push banner-monitor.yml patch (app token lacks workflows perm, change sits uncommitted in worktree), verify deploy preview, merge nx-blog first. Plan: `dot_ai/2026-07-05/tasks/doc-482-remove-nextjs.md`, Polygraph `doc-482-remove-nextjs-76fe0b0d` (2026-07-05)
- /Users/jack/projects/nx-worktrees/NXC-4360 (branch: pr-fix-vite-plugin) — PR #34890 rebase + CI green (vite ts paths custom targets, shairez fork). Plan: `dot_ai/2026-07-03/tasks/pr-34890-rebase-vite-ts-paths.md`, Polygraph `rebase-pr-34890-and-get-ci-passing-ccb7065a` (2026-07-03)
- /Users/jack/projects/remotion-projects (branch: main) — Task Sandboxing explainer video (bespoke vector recreation, branch feat-awesome, violations 12->5->0, clean end). Plan: `dot_ai/2026-06-12/tasks/sandboxing-remotion-video.md` (2026-06-12)
- /Users/jack/projects/nx-worktrees/NXC-4431 (branch: NXC-4431) — Audit publish.yml against npm publisher supply-chain advisory, commit d4b5eb2708 ready, not pushed (2026-05-08)
- /Users/jack/projects/nx-worktrees/NXC-4326 (branch: NXC-4326) — Deprecate `@nx/expo` withNxMetro: Linear comment posted, runtime warn + JSDoc, generator template switched to stock `@expo/metro-config`, migration `update-23-0-0-remove-with-nx-metro` (beta.10) + md doc + 6 passing spec tests; uncommitted (2026-05-13)
- /Users/jack/projects/nx-worktrees/NXC-4316 (branch: NXC-4316) — Deprecate `nxViteTsPaths` + `nxCopyAssetsPlugin`: runtime warn-once + `@deprecated` JSDoc + configure-vite docs swap, draft PR #35664; TS-solution gate verified, fixture fix (pnpm-workspace.yaml) lands 4 prev-failing tests. Migration codemod intentionally deferred — open Q whether to file follow-up or leave for v24 removal (2026-05-13)
- /Users/jack/projects/nx (branch: feature/nxc-4318-remove-already-deprecated-webpack-plugins) — v23 polish PR #35659 follow-ups: 5 commits ahead of master (alias + multi-match + 3 polish + clean specifier removal). HEAD `64ba9780ed`. All 3 migration specs green locally with `NODE_OPTIONS=--experimental-vm-modules`; 4 unrelated webpack failures in `e2e-web-server-info-utils.spec.ts` (npx vs pnpm exec snapshot drift, pre-existing). Push pending. Test workspace at `/Users/jack/projects/v23-migration-tests/` with `SUMMARY.md` (15 findings catalog), `.ai/2026-05-11/tasks/v23-migration-followups.md` for next-session resumption (2026-05-13)
<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

## Later
