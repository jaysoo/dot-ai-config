# TODO

## Recent Tasks (Last 10)

<!-- Ordered from most recent to least recent. Used for quick context rebuilding. -->

1. **Polygraph docs: move under `/docs` + Framer edge rewrite — PR #4 draft** (2026-05-12)
   - Summary: Multi-repo Polygraph session porting nrwl/nx's astro-docs `base: '/docs'` + `outDir: 'dist/docs'` setup and `netlify/edge-functions/rewrite-framer-urls.ts` to nrwl/polygraph-docs. trypolygraph.com now serves Starlight docs under `/docs/*` and proxies non-`/docs` HTML to `https://active-startup-540669.framer.app/<path>` (streaming-rewriting the framer origin back to `trypolygraph.com`). Iterated twice on trailing-slash behavior — `build.format: 'file'` baked `.html` into Starlight sidebar/canonical URLs, so reverted and adopted nx's exact pattern (`publish = "dist/docs"` + `/docs/* -> /:splat` rewrite). 3 commits, draft PR. Side: filed polygraph-docs pre-push commitlint hook bug in PR body.
   - Files: `dot_ai/2026-05-12/SUMMARY.md`, `dot_ai/2026-05-12/tasks/polygraph-docs-base-path-and-framer-rewrite.md`, PR https://github.com/nrwl/polygraph-docs/pull/4

2. **NXC-4448: Cypress 15.14 bump + remove stale Vite 8 guard — NEW PR #35613 draft** (2026-05-08)
   - Summary: Cypress 15.14.0 added Vite 8 support (cypress-io/cypress#33078, 2026-04-16); nx had stale `^15.8.0` pin + a `vite >= 8` throw guard in `component-configuration`. Bumped versions, removed guard, added split `packageJsonUpdates` entries (cypress + dev-server independently gated), wrote `remove-experimental-prompt-command` codemod for the flag Cypress 15.13.0 removed, dropped 8 Vite-7-downgrade workarounds in e2e tests (1 active test now exercises Vite 8). Filed as blocking issue for NXC-4154. Multiple review iterations: requires-gate for codemod, quoted-key fix on selector, split packageJsonUpdates entry. Two master rebases (one with rename conflict resolved).
   - Files: PR #35613, latest commit `db37fa7ed9`, `dot_ai/2026-05-08/SUMMARY.md`

3. **NXC-4154: Vite 7 -> 8 migrations — review iteration PR #35614 draft** (2026-05-08)
   - Summary: Three migrations (rollup->rolldown rename codemod with `vite >= 8` requires gate, AI instructions doc, `vite -> ^8 / @vitejs/plugin-react -> ^6` packageJsonUpdates). Iterations today: added missing `requires` gate (would have rewritten `@remix-run/dev` user configs silently), removed em dashes from committed AI markdown, factually corrected Cypress claim (15.14+ supports Vite 8) which surfaced the stale guard and triggered NXC-4448. Migration version bumped beta.7 -> beta.9 -> beta.10. Two master rebases.
   - Files: PR #35614, latest commit `07d5add639`, `dot_ai/2026-05-08/SUMMARY.md`

4. **NXC-4299: Native TS type stripping — review iteration** (2026-05-08)
   - Summary: Six fix-up commits on PR #35608 narrowing the fallback ladder (native strip -> tsconfig-paths -> swc/ts-node -> ESM loader register). Routes `.mts` through `loadTsFile`, surfaces `NX_NATIVE_TS_STRIP=false` opt-out hint on unrecoverable failures, force-registers ESM TS loader on dynamic-import path, gates `loadTsFile` on TS extensions to handle `ERR_REQUIRE_ASYNC_MODULE`.
   - Files: PR #35608, commits `bda1a9a7bd` -> `d665fa46fd`

5. **NXC-4156: Remove SVGR from @nx/rspack (v23) — MERGED #35611** (2026-05-08)
   - Summary: Mirror of v22 webpack SVGR removal for rspack. Stripped `svgr` from `withReact` / `NxReactRspackPlugin` / `WithReactOptions`, consolidated SVG into images asset rule, added `update-23-0-0-add-svgr-to-rspack-config` migration that inlines a `withSvgr` helper. Merged at 19:36 UTC after analyzing 3 unrelated e2e failures (2 git filter-branch infra, 1 master-broken MF test).
   - Files: `dot_ai/2026-05-08/SUMMARY.md`, `dot_ai/2026-05-08/tasks/nxc-4156-rspack-svgr-removal.md`, PR #35611, merge commit `9f18c6ae2f`

6. **NXC-4430: Tailwind v3 -> v4 — MERGED #35594** (2026-05-08)
   - Summary: PR #35594 polished (rewrote description with v4 utility renames + upgrade-guide links) and screenshot triage/colocation done; merged at 19:50 UTC. tailwindcss `3.4.4 -> 4.1.11` via `@tailwindcss/postcss`, 6 JS configs replaced with CSS-based `@import 'tailwindcss'`, codemod renamed v3 utilities across 28 source files.
   - Files: `.ai/2026-05-05/tasks/nxc-4430-tailwind-v3-to-v4.md`, `.ai/2026-05-06/SUMMARY.md`, PR #35594, merge commit `2445010810`

7. **NXC-4374 + NXC-4451: Node 26 partial rollout — both MERGED** (2026-05-08)
   - Summary: #35623 added Node 26 to docs compat matrix; #35626 then dropped Node 26 from nightly CI matrix because of unresolved playwright/yauzl incompat. Net: docs say supported, CI defers actual coverage until upstream fix.
   - Files: PR #35623 (merge `767d30eb28`), PR #35626 (merge `78daae3be1`)

8. **NXC-4159: Drop Node 20 support and bump @types/node** (2026-05-06)
   - Summary: Removed Node 20 from e2e + nightly matrices and ESLint docs (EOL Apr 2026). Bumped `@types/node` catalog to `^24.11.0` (matches mise.toml) and generator `typesNodeVersion` to `^22.0.0` across 9 plugins. Renamed `nodeTLS` -> `lowestNodeLTS` (typo fix). Added Node 26 to nightly matrix. Fixed `PerformanceMeasure` cast in `perf-logging.ts` exposed by `@types/node@24` tightening. Branch pushed; CI rerun in progress after 2 flaky e2e failures.
   - Files: `.ai/2026-05-06/SUMMARY.md`, commits `89fae8e8e9` + `8a49d3611a`

9. **DOC-498: Edge function rewrite-framer-urls 500s on bot probes with leading //** (2026-04-30)
   - Summary: WP vuln scanners send `GET //wp/wp-includes/wlwmanifest.xml`; `new URL(pathname, framerUrl)` parses `//wp/...` as protocol-relative, promoting `wp` to upstream host -> DNS error -> 500s. Fix collapses leading `/+` to `/` and short-circuits common probes (`wp-(includes|admin|content)`, `xmlrpc.php`, `wlwmanifest`, `.env`, `.git/`) with 404. Reproduced on prod with `curl --path-as-is`.
   - Files: `.ai/2026-04-30/tasks/doc-498-edge-function-bot-probe-fix.md`, PR #35527, commit `62a48ca6e7`

10. **Intro page conversion improvements (P0/P1 draft)** (2026-04-30)
   - Summary: Critical analysis of nx.dev/docs/getting-started/intro vs Turbo/Vercel/Bun. Drafted P0/P1 edits in worktree: tabbed install block above the fold (npm/pnpm/yarn/bun, both `nx init` and `create-nx-workspace`), demoted YouTube embed below "What Nx does", reframed Nx Cloud table row to outcome statements, added soft `npx nx connect` seed. Vale clean on edited lines.
   - Files: `.ai/2026-04-30/tasks/intro-page-conversion-improvements.md`, branch `docs/intro-conversion-improvements`

## TODO

- [ ] **Self-healing: Anthropic cost-by-customer breakdown for Joe — first thing AM** (2026-06-08)
  - From #dpes self-healing thread: before onboarding more customers, check contract value vs Anthropic billing (~34K USD/mo total, ClickUp top at 6.7K/mo) so we cover costs and don't lose money on usage
  - Action: pull what we paid to Anthropic broken down **by customer** and add to the credits-used sheet Joe shared ("log the credits used (ie paid for) by their customer")
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

- /Users/jack/projects/nx-worktrees/NXC-4431 (branch: NXC-4431) — Audit publish.yml against npm publisher supply-chain advisory, commit d4b5eb2708 ready, not pushed (2026-05-08)
- /Users/jack/projects/nx-worktrees/NXC-4326 (branch: NXC-4326) — Deprecate `@nx/expo` withNxMetro: Linear comment posted, runtime warn + JSDoc, generator template switched to stock `@expo/metro-config`, migration `update-23-0-0-remove-with-nx-metro` (beta.10) + md doc + 6 passing spec tests; uncommitted (2026-05-13)
- /Users/jack/projects/nx-worktrees/NXC-4316 (branch: NXC-4316) — Deprecate `nxViteTsPaths` + `nxCopyAssetsPlugin`: runtime warn-once + `@deprecated` JSDoc + configure-vite docs swap, draft PR #35664; TS-solution gate verified, fixture fix (pnpm-workspace.yaml) lands 4 prev-failing tests. Migration codemod intentionally deferred — open Q whether to file follow-up or leave for v24 removal (2026-05-13)
- /Users/jack/projects/nx (branch: feature/nxc-4318-remove-already-deprecated-webpack-plugins) — v23 polish PR #35659 follow-ups: 5 commits ahead of master (alias + multi-match + 3 polish + clean specifier removal). HEAD `64ba9780ed`. All 3 migration specs green locally with `NODE_OPTIONS=--experimental-vm-modules`; 4 unrelated webpack failures in `e2e-web-server-info-utils.spec.ts` (npx vs pnpm exec snapshot drift, pre-existing). Push pending. Test workspace at `/Users/jack/projects/v23-migration-tests/` with `SUMMARY.md` (15 findings catalog), `.ai/2026-05-11/tasks/v23-migration-followups.md` for next-session resumption (2026-05-13)
- /Users/jack/.polygraph/sessions/nxc-4399-69dacacd/session (branches: feature/nxc-4399-multi-versionp19-nxreact-..., feature/nxc-4395-multi-versionp15-nxnext-...) — Multi-version compliance for @nx/react (NXC-4399) + @nx/next (NXC-4395) via Polygraph session nxc-4399-69dacacd. Original PRs #35651/#35652 closed (worktree contamination swept in packages/vue files). Redoing both branches per merged precedent #35587 (angular) + #35642 (playwright): assertSupportedPackageVersion wrapper from @nx/devkit/internal + plugin-specific assert-supported-{react,next}-version.ts + per-generator entry-point calls + all-generators-enforce-floor.spec. Child agent currently executing redo (2026-05-13)
- /Users/jack/projects/nx-worktrees/NXC-4325 (branch: NXC-4325) — Deprecate `@nx/next` withNx + composePlugins: runtime warn-once in both helpers (production-runtime + graph-creation guarded), generator template emits plain NextConfig with transpilePackages hint, application.spec inline snapshot refreshed. 4 files uncommitted. Targeted next tests + affected lint/build green; full `nx test next` matches master baseline (9 failed pre-existing, unrelated TS-solution-setup). Migration codemod + docs rewrite deferred to follow-up PR. Awaiting commit + push (2026-05-13)

<!-- Directories with active or resumable Claude sessions. Use `cd <dir> && claude -r` to resume. -->
<!-- Managed by /end-session and /list-sessions commands. /summarize cleans up stale entries. -->

## Later
