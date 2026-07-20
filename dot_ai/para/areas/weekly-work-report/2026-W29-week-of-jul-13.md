# Weekly Work Report — Week of July 13–19, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-07-13 and 2026-07-19._

---

## TL;DR

Nx roughly doubled its usual pace — 70 PRs versus the 35 merged the prior week — but the jump is explained almost entirely by two people. **@leosvelperez (Leo)** merged 22 PRs: 21 small, single-purpose fixes each sourced from its own Polygraph agent session (lockfile perf, TS/webpack/vitest edge cases, migration wiring), landed in two tight batches (5 PRs in under a minute on 07-14, 9 PRs in ~20 minutes on 07-15 evening) that read as a reviewed backlog being drained rather than new work being written live — plus he personally executed a **12-PR community-PR backlog sweep on 07-17/07-18**, closing PRs that had sat open 3-5+ months. That sweep directly answers last week's report flag about stale community PRs. **@FrozenPandaz** shipped 18 PRs, the largest a full-width TUI status bar + vim-style pane search (3,787 additions, 127 files, in flight since 07-08), alongside the recurring weekly self-migration (three bumps: rc.2, rc.3, 23.2.0-beta.0) and pnpm 11 compatibility fixes. Two critical-severity dependency patches landed same-day in **both** repos this week — a websocket-driver CVE (CVSS 9.2) fixed in nx by Leo and in ocean by @nixallover within hours of each other — plus a privately-reported shell-injection fix in `nx import` from **@jaysoo**.

Ocean stayed near its usual ~70-PR pace with more contributors spread more evenly. **@rarmatei (Rares)** continued last week's io-trace daemon reliability track (10 PRs) alongside CI/cache hygiene. **@lourw (Lauren)** kept extending the sidebar app shell **@bcabanes** shipped last week — moving Configurations into the rail, adding a resource-usage page, cleaning up the now-fully-rolled-out `automated_add_ons` flag. **@nixallover (Nick)** landed the week's largest single PR — a 9,174-line Workspace Guide onboarding surface that had been in flight since **May 6** (68 days) — safely, since it merges dark behind a PostHog flag defaulting off. **@nartc (Chau)** shipped a large (7,121-line) behavior-preserving React cleanup refactor across 13 audit-generated fixes, plus a new **system-administrator access surface** for the Polygraph web app that, like last week's SAML work, is a fresh elevated-access entry point worth a security look. **@joshvanallen** landed bring-your-own-key AI provider support for Self-Healing CI (Anthropic/Bedrock/Azure, AES-encrypted at rest) after three weeks in review. **@StalkAltan (Altan)** enabled automatic Stripe tax on invoices — a customer-billing behavior change worth confirming was communicated.

---

## nrwl/nx

### @leosvelperez (Leo) — Backlog drain: 21 Polygraph-sourced fixes plus a 12-PR community sweep (22 merged)

**Batch-merged fixes, each its own Polygraph session (21 PRs, merged 07-14 to 07-16 in two clusters):**

| PR | Title |
|----|-------|
| [#36216](https://github.com/nrwl/nx/pull/36216) | fix(core): speed up npm lockfile parsing |
| [#36223](https://github.com/nrwl/nx/pull/36223) | fix(core): speed up lockfile parsing and catalog resolution |
| [#36218](https://github.com/nrwl/nx/pull/36218) | fix(js): support private methods and static blocks in babel preset |
| [#36241](https://github.com/nrwl/nx/pull/36241) | fix(js): parse pnpm/npm publish JSON containing braces in file paths |
| [#36237](https://github.com/nrwl/nx/pull/36237) | fix(vitest): honor watch config and keep --ui open in the test executor |
| [#36316](https://github.com/nrwl/nx/pull/36316) | fix(vitest): generate root vitest.config.ts instead of deprecated vitest.workspace |
| [#36238](https://github.com/nrwl/nx/pull/36238) | fix(webpack): disable extractComments on the swc terser minimizer |
| [#36313](https://github.com/nrwl/nx/pull/36313) | fix(webpack): bundle non-buildable library subpaths with fallback-array exports |
| [#36352](https://github.com/nrwl/nx/pull/36352) | fix(bundling): support TypeScript esbuildConfig files in the esbuild executor |
| [#36310](https://github.com/nrwl/nx/pull/36310) | fix(angular): make webpack-related packages optional peer dependencies |
| [#36350](https://github.com/nrwl/nx/pull/36350) | cleanup(devkit): remove catalog utils copy and reuse nx implementation |
| [#36280](https://github.com/nrwl/nx/pull/36280) | fix(core): close daemon log descriptors after spawn to avoid Node 26 crash |
| [#36356](https://github.com/nrwl/nx/pull/36356) | fix(core): correct the 22.6.0 gitignore and analytics migration wiring |
| [#36354](https://github.com/nrwl/nx/pull/36354) | fix(core): support npm 12 and pnpm in the package provenance check |
| [#36335](https://github.com/nrwl/nx/pull/36335) | fix(core): honor pnpm minimumReleaseAge config on pnpm 11 |
| [#36296](https://github.com/nrwl/nx/pull/36296) | fix(core): resolve source-loaded plugin transitive workspace imports |
| [#36374](https://github.com/nrwl/nx/pull/36374) | fix(core): include continuous and default-config dependencies in show target |
| [#36314](https://github.com/nrwl/nx/pull/36314) | feat(core): confirm before creating migration commits on the default branch |
| [#36353](https://github.com/nrwl/nx/pull/36353) | fix(misc): resolve CSS url() assets on Windows in postcss-cli-resources |
| [#36351](https://github.com/nrwl/nx/pull/36351) | chore(repo): harden nx-docs-style-check to apply the style guide per rule |
| [#36234](https://github.com/nrwl/nx/pull/36234) | docs(misc): note that package managers can override .env variables |

**Critical-severity dependency patch:**

| PR | Title |
|----|-------|
| [#36375](https://github.com/nrwl/nx/pull/36375) | chore(repo): override websocket-driver to ^0.7.5 to patch GHSA-xv26-6w52-cph6 (CVE-2026-54466, CVSS 9.2) |

**Community PR backlog sweep — merged as maintainer, not authored (12 PRs, all 07-17/07-18):**

| PR | Author | Title | Open since |
|----|--------|-------|------------|
| [#34376](https://github.com/nrwl/nx/pull/34376) | @43081j | cleanup(core): use picocolors in eslint-plugin | 2026-02-09 |
| [#34880](https://github.com/nrwl/nx/pull/34880) | @Roozenboom | fix(storybook): update configuration generator nx.json | 2026-03-17 |
| [#34927](https://github.com/nrwl/nx/pull/34927) | @prafful1234 | fix(webpack): propagate watch option from executor to webpack config | 2026-03-19 |
| [#34960](https://github.com/nrwl/nx/pull/34960) | @theescodes | fix(module-federation): strip version suffix from npm dependency names for bun compatibility | 2026-03-23 |
| [#35562](https://github.com/nrwl/nx/pull/35562) | @djohnson-aperture | fix(core): run selected projects with --exclude-task-dependencies | 2026-05-04 |
| [#35916](https://github.com/nrwl/nx/pull/35916) | @quyentonndbs | cleanup(testing): fix test assertions | 2026-06-09 |
| [#35932](https://github.com/nrwl/nx/pull/35932) | @Tusharkhadde | fix(release): align VersionDataEntry dependency types with VersionActions | 2026-06-10 |
| [#36071](https://github.com/nrwl/nx/pull/36071) | @kerolloz | docs(release): update NODE_AUTH_TOKEN variable name in CI/CD guide | 2026-06-21 |
| [#36080](https://github.com/nrwl/nx/pull/36080) | @duckot13 | fix(vite): prevent watch false leaking into dev server config | 2026-06-22 |
| [#36187](https://github.com/nrwl/nx/pull/36187) | @tsushanth | docs(misc): update broken doc links in deprecation warnings | 2026-07-01 |
| [#36279](https://github.com/nrwl/nx/pull/36279) | @ilanwei1 | fix(module-federation): do not cache static remote assets in the dev-server plugin | 2026-07-09 |
| [#36337](https://github.com/nrwl/nx/pull/36337) | @Squixx | fix(core): use --config.frozen-lockfile=false for pnpm add during migrate | 2026-07-14 |

**Work character:** Two distinct activities, both high-leverage. The 21 batch-merged fixes are each a genuinely scoped, single-purpose diff (1-15 files, most under 60 lines) — the batching is a merge-timing artifact (a queue of already-reviewed PRs cleared in two sittings), not scattered same-day authorship; each has its own Polygraph session link and a distinct reviewer (mostly FrozenPandaz or MaxKless). Separately, on 07-17/07-18 Leo merged **12 external community PRs**, several open 3-5+ months, directly acting on last week's report note that the community backlog needed a sweep. Net effect: Leo touched more of the nx surface area this week — core, js, vitest, webpack, bundling, angular, devkit — than any single-feature contributor, but almost none of it required new design work.

---

### @FrozenPandaz — TUI status bar feature, weekly migrations, pnpm 11 support (18 merged)

**Feature — full-width TUI status bar (largest PR of the week in nx):**

| PR | Title |
|----|-------|
| [#36263](https://github.com/nrwl/nx/pull/36263) | feat(core): add a full-width TUI status bar and vim-style pane search |

**Weekly self-migration cadence:**

| PR | Title |
|----|-------|
| [#36269](https://github.com/nrwl/nx/pull/36269) | chore(repo): migrate to nx 23.1.0-rc.2 |
| [#36321](https://github.com/nrwl/nx/pull/36321) | chore(repo): migrate to nx 23.1.0-rc.3 |
| [#36387](https://github.com/nrwl/nx/pull/36387) | chore(repo): migrate to nx 23.2.0-beta.0 |

**pnpm 11 / package-manager fixes:**

| PR | Title |
|----|-------|
| [#36302](https://github.com/nrwl/nx/pull/36302) | fix(core): unbreak pnpm 11 installs by acknowledging build-script deps from generators |
| [#35994](https://github.com/nrwl/nx/pull/35994) | fix(core): make unit tests pass locally regardless of invoking package manager |

**PR-review / CI tooling:**

| PR | Title |
|----|-------|
| [#36342](https://github.com/nrwl/nx/pull/36342) | chore(repo): add performance-analyzer agent to review-pr skill |
| [#36382](https://github.com/nrwl/nx/pull/36382) | chore(repo): sandbox the reproduce-verifier's repro + PR build |
| [#36392](https://github.com/nrwl/nx/pull/36392) | chore(repo): fix review-sandbox build context and smoke test |
| [#36369](https://github.com/nrwl/nx/pull/36369) | chore(testing): make node/express app generator specs package-manager-agnostic |
| [#36368](https://github.com/nrwl/nx/pull/36368) | chore(repo): parallelize macos e2e suites and drop dead homebrew cache |

**Reactive fixes and one example app:**

| PR | Title |
|----|-------|
| [#36344](https://github.com/nrwl/nx/pull/36344) | fix(core): show performance report recommendations only when actionable |
| [#36326](https://github.com/nrwl/nx/pull/36326) | fix(release): only extract body issue references linked via closing keywords |
| [#36359](https://github.com/nrwl/nx/pull/36359) | fix(core): resolve name refs copied into pattern-matched target arrays |
| [#36391](https://github.com/nrwl/nx/pull/36391) | fix(core): collect trickling watcher bursts fully on daemon force-flush |
| [#34944](https://github.com/nrwl/nx/pull/34944) | fix(core): respect --aiAgents none to skip AI agent file generation |
| [#35921](https://github.com/nrwl/nx/pull/35921) | feat(react): add react + vite + vitest + playwright example |

**Work character:** #36263 is the week's biggest nx PR (3,787 additions, 1,976 deletions, 127 files, 48 commits, in flight since 07-08) — a real feature: a consolidated full-width TUI status bar replacing cramped per-column hints, plus vim-style `/` search inside terminal panes, plus a first pass at consolidating duplicated TUI state. Everything else is routine: the third migration bump of the month, pnpm 11 compatibility (Nx's package-manager surface keeps needing follow-up as pnpm 11 rolls out), and CI/review-tooling maintenance. Low individual risk, high aggregate volume.

---

### @AgentEnder (Craigory Coppola) — TUI stability and shell-safety fixes (4 merged)

| PR | Title |
|----|-------|
| [#36318](https://github.com/nrwl/nx/pull/36318) | fix(core): stop ratatui cursor queries from racing the TUI event stream |
| [#36341](https://github.com/nrwl/nx/pull/36341) | fix(core): report tasks running in another Nx process in the inline TUI |
| [#36379](https://github.com/nrwl/nx/pull/36379) | fix(core): stop passing git revisions through a shell in affected commands |
| [#36365](https://github.com/nrwl/nx/pull/36365) | chore(misc): remove disabled diagnose-sandbox-report claude skill |

**Work character:** A second consecutive week of real TUI stability fixes (last week: focus-stealing popup and bottom-bar sizing; this week: a cursor-query race and a mislabeled "already running" state) — the TUI is under active hardening across two contributors this week (also FrozenPandaz's #36263). #36379 hardens `affected` command construction against shell interpretation of git revisions — same defensive-coding class as jaysoo's shell-injection fix below, landed independently the same week.

---

### @jaysoo (Jay) — Privately-reported security fix, docs, tooling (4 merged)

| PR | Title |
|----|-------|
| [#36348](https://github.com/nrwl/nx/pull/36348) | fix(core): prevent shell injection in nx import |
| [#36320](https://github.com/nrwl/nx/pull/36320) | docs(misc): add redirect for moved nx-vs-turborepo page |
| [#36307](https://github.com/nrwl/nx/pull/36307) | docs(misc): refresh high-impact seo pages and add nx vs lerna comparison |
| [#36367](https://github.com/nrwl/nx/pull/36367) | chore(repo): add update-cnw-templates skill |
| [#36364](https://github.com/nrwl/nx/pull/36364) | fix(misc): bump ci-workflow generator to node 24 and current action majors |

**Work character:** #36348 fixes a shell-injection vector in `nx import` (remote branch names were interpolated directly into shell commands); the PR body notes the report came in through a private security channel, not public disclosure. The rest continues last week's SEO/docs push plus a new maintainer skill for the CNW template-repo bump workflow.

---

### Other nx contributors (7 merged)

| Contributor | PR | Title |
|---|---|---|
| @meeroslav (Miroslav) | [#36333](https://github.com/nrwl/nx/pull/36333) | fix(repo): bump decompress to safe version |
| @meeroslav (Miroslav) | [#36332](https://github.com/nrwl/nx/pull/36332) | chore(repo): fix npm audit job setup |
| @juristr (Juri) | [#36328](https://github.com/nrwl/nx/pull/36328) | docs(core): use @nx/vitest plugin in target defaults example |
| @comp615 | [#36360](https://github.com/nrwl/nx/pull/36360) | fix(core): support pnpm 11 patched dependency hashes |
| @ATKasem | [#36324](https://github.com/nrwl/nx/pull/36324) | fix(misc): suppress outdated disclaimer for unsupported AI agents with AGENTS.md |
| @lourw (Lauren) | [#36381](https://github.com/nrwl/nx/pull/36381) | docs(nx-cloud): document resource usage for runs without Nx Agents |
| @barbados-clemens | [#36396](https://github.com/nrwl/nx/pull/36396) | docs(misc): consolidate environment variable guidance |

**Work character:** Light, mostly-docs weeks for internal engineers outside the top four. @meeroslav's decompress bump is the same advisory-response pattern as last week's `@swc/cli` patch (a transitive `decompress` path-traversal advisory recurring across the dependency graph).

---

## nrwl/ocean

### @rarmatei (Rares) — io-trace daemon reliability, continued (14 merged)

**io-trace daemon experiments (continuing last week's track):**

| PR | Title |
|----|-------|
| [#12292](https://github.com/nrwl/ocean/pull/12292) | fix(io-trace): relativize sandbox report paths against the task's own Nx workspace root |
| [#12311](https://github.com/nrwl/ocean/pull/12311) | fix(io-trace): reject stale fd resolutions by inode when non-signal closes are suppressed |
| [#12317](https://github.com/nrwl/ocean/pull/12317) | feat(io-trace): emit stale_tasks_over_30m stat with tunable stuck threshold |
| [#12320](https://github.com/nrwl/ocean/pull/12320) | fix(io-trace): partial-decode the signal file and drop retained path lists |
| [#12316](https://github.com/nrwl/ocean/pull/12316) | perf(io-trace): make buffer entries pointer-free with int64 milli timestamps |

**Build cache / CI reliability:**

| PR | Title |
|----|-------|
| [#12348](https://github.com/nrwl/ocean/pull/12348) | fix(nx-packages): move e2e scaffold workspaces out of the repo into os.tmpdir() |
| [#12349](https://github.com/nrwl/ocean/pull/12349) | fix(dte): keep TTLs on runtime-recreated Valkey index keys and sweep accumulated orphans |
| [#12366](https://github.com/nrwl/ocean/pull/12366) | chore(repo): declare spec/storybook tsconfigs as build inputs |
| [#12365](https://github.com/nrwl/ocean/pull/12365) | fix(polygraph): stop polygraph-cli:build writing into other projects' out-tsc |
| [#12389](https://github.com/nrwl/ocean/pull/12389) | fix(polygraph): noop the inferred polygraph-cli build target |
| [#12364](https://github.com/nrwl/ocean/pull/12364) | fix(workflow-controller): cover nested cmd projects and go.work inputs on go targets |
| [#12367](https://github.com/nrwl/ocean/pull/12367) | fix(misc): residual sandboxing cleanups |
| [#12310](https://github.com/nrwl/ocean/pull/12310) | fix(storybook): replace build-time project graph with generated chromatic refs |
| [#12333](https://github.com/nrwl/ocean/pull/12333) | fix(ui-design): declare tailwind sources explicitly, scoped per entry point |

**Work character:** Direct continuation of the io-trace daemon hardening flagged as a track in last week's report — five more PRs against fd tracking, stat emission, and buffer memory layout. The second half is cache-correctness whack-a-mole (e2e scaffolds bleeding into the repo's own cache, Valkey index keys leaking TTLs, polygraph-cli's build target polluting other projects' output). No single dominant deliverable, but a coherent "keep the cache honest" theme.

---

### @lourw (Lauren) — Extending the sidebar app shell, flag cleanup (10 merged)

| PR | Title |
|----|-------|
| [#12357](https://github.com/nrwl/ocean/pull/12357) | feat(nx-cloud): move configurations sub-nav into the app shell rail |
| [#12372](https://github.com/nrwl/ocean/pull/12372) | feat(nx-cloud): create dedicated page for resource usage |
| [#12303](https://github.com/nrwl/ocean/pull/12303) | chore(nx-cloud): remove the automated_add_ons feature flag |
| [#12375](https://github.com/nrwl/ocean/pull/12375) | chore(nx-cloud): remove NX_CLOUD_AUTOMATED_ADD_ONS_ENABLED flag |
| [#12352](https://github.com/nrwl/ocean/pull/12352) | fix(nx-cloud): defer legacy insights rejection to avoid app restarts |
| [#12339](https://github.com/nrwl/ocean/pull/12339) | fix(client-bundle): report run metrics upload errors instead of [object Object] |
| [#12391](https://github.com/nrwl/ocean/pull/12391) | feat(nx-api): serve the ci-config yaml schema as a static file |
| [#12379](https://github.com/nrwl/ocean/pull/12379) | feat(client-bundle): make start-nx-agents available to all workspaces |
| [#12354](https://github.com/nrwl/ocean/pull/12354) | chore(repo): pin go toolchain to 1.25.5 |
| [#12356](https://github.com/nrwl/ocean/pull/12356) | Revert "chore(repo): pin go toolchain to 1.25.5" |

**Work character:** #12357 and #12372 are direct follow-ons to last week's sidebar-shell launch (bcabanes) — Configurations moves out of its own in-content sub-sidebar into the shell's rail, matching the pattern Settings and Analytics already use, and a standalone resource-usage page ships. #12303/#12375 retire the `automated_add_ons` flag now that it's fully rolled out (same feature @jaysoo's #12211 and @bcabanes's #12266 touched last week). #12354/#12356 is a same-day pin-then-revert of the Go toolchain version — a quick, self-caught mistake, not a incident. #12379 removes the env-var gate that previously restricted `start-nx-agents` to this repo's own CI, making it available to all workspaces by default — worth confirming that's an intentional broad rollout rather than a side effect of a build fix.

---

### @nartc (Chau) — Large React refactor, new admin-access surface, session-linking follow-up (8 merged)

| PR | Title |
|----|-------|
| [#12325](https://github.com/nrwl/ocean/pull/12325) | refactor(polygraph): react improvement plans — bugs, a11y, perf, structural splits |
| [#12374](https://github.com/nrwl/ocean/pull/12374) | feat(polygraph): add web system administrator access |
| [#12276](https://github.com/nrwl/ocean/pull/12276) | fix(polygraph): adjust manual linked references dedupe |
| [#12314](https://github.com/nrwl/ocean/pull/12314) | fix(nx-cloud): gate vcs membership refresh on connected account |
| [#12396](https://github.com/nrwl/ocean/pull/12396) | fix(polygraph): polish session links and sidebar layout |
| [#12286](https://github.com/nrwl/ocean/pull/12286) | fix(polygraph): preserve ansi formatting in agent logs |
| [#12353](https://github.com/nrwl/ocean/pull/12353) | chore(polygraph): debug log healthz/readyz responses |
| [#12406](https://github.com/nrwl/ocean/pull/12406) | fix(polygraph): copy install-script-routes in dockerfile |

**Work character:** #12325 implements all 13 plans from an "improve-react" audit workflow in one PR (7,121 additions, 6,754 deletions, 53 files) — bug fixes, accessibility (keyboard-operable panes, focus traps, aria labeling), virtualized log rendering for performance, and splitting several 1,000+-line route/component files down to single-responsibility modules. The PR body explicitly documents one proposed change (a mirror-effect rewrite) that was reviewed and **declined** as unnecessary — a good sign of real review rather than blind acceptance of the audit's suggestions. Separately, #12374 grants system administrators web-app access to investigate and manage Polygraph accounts without extending CLI authorization — a new elevated-access entry point, in the same spirit as the SAML work flagged for security review last week. #12276 is Chau tightening the directionality of his own "manual linked references" feature from last week.

---

### @nixallover (Nick) — Workspace Guide launch (largest PR of the week in ocean) plus pre-launch fixes (8 merged)

| PR | Title |
|----|-------|
| [#11158](https://github.com/nrwl/ocean/pull/11158) | feat(nx-cloud): workspace setup guide |
| [#12343](https://github.com/nrwl/ocean/pull/12343) | feat(nx-cloud): workspace guide pre-launch fixes |
| [#12331](https://github.com/nrwl/ocean/pull/12331) | feat(nx-cloud): add markdown/html output toggle to workspace badges |
| [#12377](https://github.com/nrwl/ocean/pull/12377) | feat(nx-cloud): gate the badges settings nav entry behind a feature flag |
| [#12329](https://github.com/nrwl/ocean/pull/12329) | fix(nx-cloud): collapse CIPE critical workflow error cause behind More details |
| [#12360](https://github.com/nrwl/ocean/pull/12360) | chore(repo): pin websocket-driver override to 0.7.5 |
| [#12361](https://github.com/nrwl/ocean/pull/12361) | fix(nx-cloud): load legacy organization insights for viewers without explicit membership |
| [#12401](https://github.com/nrwl/ocean/pull/12401) | fix(nx-cloud): name the actual VCS provider in organization settings banners |

**Work character:** #11158 is the week's largest ocean PR by far — 9,174 additions, 446 deletions, 99 files — a full "Workspace Guide" onboarding surface (achievement-backed milestones, a feature-card registry, credit rewards for completing setup steps). It was opened **May 6** and merged **July 13**, a 68-day branch life, but ships gated behind the `feature_activation_guide` PostHog flag defaulting to off, so it's a safe dark-merge rather than a live risk. #12360 is nx's websocket-driver CVE patch (GHSA-xv26-6w52-cph6) landing in ocean the same day as nx's #36375 — good cross-repo coordination on a critical advisory.

---

### @StalkAltan (Altan) — Analytics, io-trace, and a Stripe billing change (5 merged)

| PR | Title |
|----|-------|
| [#12330](https://github.com/nrwl/ocean/pull/12330) | feat(analytics): add mergeable task duration histograms |
| [#12340](https://github.com/nrwl/ocean/pull/12340) | fix(io-trace): avoid verifier-invalid pointer arithmetic |
| [#12368](https://github.com/nrwl/ocean/pull/12368) | fix(aggregator): enable automatic tax on Stripe invoices |
| [#12376](https://github.com/nrwl/ocean/pull/12376) | feat(nx-cloud): enable task analytics for OSS orgs |
| [#12395](https://github.com/nrwl/ocean/pull/12395) | fix(nx-cloud): keep startup probes responsive during Remix load |

**Work character:** #12368 turns on Stripe Automatic Tax for Pro/Team invoices going forward — a direct change to what customers are billed, covered by regression tests on the generated Stripe request parameters but worth confirming Finance/Support were looped in before it went live, given ocean's own guardrail on shared-resource billing changes.

---

### @MaxKless (Max), @FrozenPandaz, @vsavkin (Victor), @Cammisuli (Jon) — Polygraph CLI/session tooling (4 each, 16 merged)

| Contributor | PR | Title |
|---|----|-------|
| @MaxKless | [#12309](https://github.com/nrwl/ocean/pull/12309) | feat(polygraph): agent-log census and code-change ingestion screens in the session-search playground |
| @MaxKless | [#12293](https://github.com/nrwl/ocean/pull/12293) | feat(polygraph): session search --sha resolves commits to explicit sessions |
| @MaxKless | [#12308](https://github.com/nrwl/ocean/pull/12308) | fix(polygraph): wrap long unbroken tokens in log view messages |
| @MaxKless | [#12312](https://github.com/nrwl/ocean/pull/12312) | feat(polygraph): move `session ci-logs` command to `git ci-logs` |
| @FrozenPandaz | [#12255](https://github.com/nrwl/ocean/pull/12255) | chore(repo): migrate to nx 23.1.0-rc.2 |
| @FrozenPandaz | [#12322](https://github.com/nrwl/ocean/pull/12322) | chore(repo): migrate to nx 23.1.0-rc.3 |
| @FrozenPandaz | [#12384](https://github.com/nrwl/ocean/pull/12384) | chore(repo): migrate to nx 23.2.0-beta.0 |
| @FrozenPandaz | [#12208](https://github.com/nrwl/ocean/pull/12208) | fix(repo): remove config-time disk and env probes from gradle configuration |
| @vsavkin | [#12346](https://github.com/nrwl/ocean/pull/12346) | feat(polygraph): add session review command mirroring resume |
| @vsavkin | [#12388](https://github.com/nrwl/ocean/pull/12388) | feat(polygraph): add git fetch subcommand for on-demand history |
| @vsavkin | [#12387](https://github.com/nrwl/ocean/pull/12387) | fix(polygraph): cap session search query length |
| @vsavkin | [#12393](https://github.com/nrwl/ocean/pull/12393) | feat(polygraph-cli): add --wait-for-transition-ms long-poll to agent show |
| @Cammisuli | [#12341](https://github.com/nrwl/ocean/pull/12341) | refactor(polygraph-cli): introduce internal TUI toolkit |
| @Cammisuli | [#12385](https://github.com/nrwl/ocean/pull/12385) | feat(polygraph): curl install script for macOS/Linux |
| @Cammisuli | [#12390](https://github.com/nrwl/ocean/pull/12390) | feat(polygraph): irm install script for Windows |
| @Cammisuli | [#12386](https://github.com/nrwl/ocean/pull/12386) | feat(polygraph-cli): config TUI General section, contextual Enter, flat repo rows, default agent everywhere |

**Work character:** Max tapered sharply from 13 PRs last week to 4, all small continuations of his session-search feature (sha lookup, debugging playground screens, a command rename) rather than new arcs — consistent with a feature wrapping up rather than someone disengaging. @vsavkin (Nx co-founder) shipped four Polygraph CLI features directly. Cammisuli's #12341 (4,786 additions, 94 files) extracts a dependency-free internal TUI toolkit used across the CLI's full-screen, inline, and progress rendering paths, paired with new one-line install scripts for macOS/Linux/Windows — CLI distribution and its terminal-UI foundation shipped together.

---

### Other ocean contributors (7 merged)

| Contributor | PR | Title |
|---|----|-------|
| @joshvanallen | [#12095](https://github.com/nrwl/ocean/pull/12095) | feat(nx-cloud): BYOK AI providers for Self-Healing CI |
| @joshvanallen | [#12392](https://github.com/nrwl/ocean/pull/12392) | feat(nx-cloud): backport BYOK AI providers for Self-Healing CI to single-tenant/2607 |
| @jaysoo (Jay) | [#12305](https://github.com/nrwl/ocean/pull/12305) | fix(sandbox-violations): tighten LLM fix-prompt guidance on exclusions and hidden imports |
| @jaysoo (Jay) | [#12319](https://github.com/nrwl/ocean/pull/12319) | chore(client-bundle): bump @modelcontextprotocol/sdk for security advisories |
| @meeroslav (Miroslav) | [#12236](https://github.com/nrwl/ocean/pull/12236) | fix(owners): dedupe owners when multiple patterns match a project |
| @meeroslav (Miroslav) | [#11893](https://github.com/nrwl/ocean/pull/11893) | fix(nx-api): defer self-healing flaky rerun until CIPE completes |
| @bcabanes (Benjamin) | [#12324](https://github.com/nrwl/ocean/pull/12324) | fix(nx-cloud): gate the new layout and organization dashboard |

**Work character:** #12095 (Josh Van Allen) is a significant new capability: bring-your-own-key AI providers (Anthropic, AWS Bedrock, Azure AI Foundry) for Self-Healing CI, with credentials AES-encrypted at rest using the same envelope as VCS-token storage, and a sealed-result resolver that explicitly refuses to resurrect a revoked entitlement from lingering config. Three weeks from open (06-25) to merge (07-15). @bcabanes shipped only one PR this week — a follow-on gate fix for the sidebar shell he launched last week — a sharp taper consistent with a large feature settling.

---

## Needs Your Attention

### 1. New elevated-access surface in Polygraph — recommend a security review
**@nartc**'s [#12374](https://github.com/nrwl/ocean/pull/12374) grants system administrators web-app access to investigate and manage any Polygraph account and its private session endpoints, without going through CLI authorization. This is the same "new identity/access surface" class flagged for the SAML work two weeks ago — worth confirming it got the same review, especially since it deliberately bypasses the CLI auth path admins normally use.

### 2. BYOK AI provider credentials are a new sensitive-data surface
**@joshvanallen**'s [#12095](https://github.com/nrwl/ocean/pull/12095) lets organizations store their own Anthropic/Bedrock/Azure credentials for Self-Healing CI, AES-encrypted at rest. The design looks careful (sealed resolver, entitlement-gated writes, tests for the revoked-entitlement case), but this is Nx Cloud's first time holding customer AI-provider secrets — worth a dedicated security pass on the encryption envelope and access logging before it's promoted beyond early customers.

### 3. Stripe automatic tax enabled on customer invoices
**@StalkAltan**'s [#12368](https://github.com/nrwl/ocean/pull/12368) turns on Stripe Automatic Tax for Pro/Team invoices. This directly changes customer billing amounts. **Confirm Finance/Support had visibility before this shipped** — billing behavior changes are exactly the kind of shared-resource setting the team's own guardrails call out for extra care.

### 4. Two critical-severity CVEs closed the same week, one via a private report
A websocket-driver advisory (GHSA-xv26-6w52-cph6, CVSS 9.2) was patched in both nx ([#36375](https://github.com/nrwl/nx/pull/36375)) and ocean ([#12360](https://github.com/nrwl/ocean/pull/12360)) within hours of each other — good coordination, no action needed. Separately, **@jaysoo**'s [#36348](https://github.com/nrwl/nx/pull/36348) fixes a shell-injection vulnerability in `nx import` reported through a private channel rather than public disclosure — worth confirming the reporter was credited/compensated per your responsible-disclosure process and that a patch release went out promptly.

### 5. Community PR backlog sweep happened — closing last week's loop
Last week's report flagged a 5-month-old community typo fix and suggested a periodic backlog sweep. This week **@leosvelperez** merged **12 external community PRs** in a two-day window (07-17/07-18), several open since March. No action needed — flagging that the suggestion was acted on, and that this could become a recurring cadence rather than a one-off.

### 6. A 68-day-old, 9,174-line PR just merged — watch it after the flag flips
**@nixallover**'s [#11158](https://github.com/nrwl/ocean/pull/11158) (Workspace Guide onboarding) was open since May 6. It's currently safe — gated behind a PostHog flag defaulting to off — but when that flag starts rolling out, a change this size and this age (relative to `main`) is worth a closer look for drift/regressions before a wide rollout.

### 7. `start-nx-agents` is now available to all workspaces by default
**@rarmatei/@lourw**'s [#12379](https://github.com/nrwl/ocean/pull/12379) removes the env-var gate that previously restricted this command to the repo's own CI usage, making it available everywhere. Worth a quick confirmation this was an intentional product decision and not just a side effect of fixing the internal build.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-07-13 to 2026-07-19_
