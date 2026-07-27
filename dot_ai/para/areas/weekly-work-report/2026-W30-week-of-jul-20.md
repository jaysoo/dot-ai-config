# Weekly Work Report — Week of July 20–26, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-07-20 and 2026-07-26._

---

## TL;DR

Nx merged 47 PRs, concentrated in four people. **@leosvelperez (Leo)** merged 14 — a stacked "migrate execution engine" feature series, a run of migration-tooling hardening (validators, a new `author-migration` skill), a batch of small cross-plugin fixes, and the week's fastest-turnaround security patch: a critical (CVSS 9.2) `tar` decompression-DoS advisory fixed in ~2 hours. He also landed the week's biggest behavioral rewrite: a 5,322-line angular-rspack overhaul claiming 1.8–7.8x rebuild speedups. **@FrozenPandaz** merged 10, mostly core-runtime fixes plus foundational telemetry work (a `deriveRepoKey` utility with no caller yet) and one PR tuning the team's own AI PR-review pipeline after it approved something a human later requested changes on. **@jaysoo** merged 9, dominated by a 338-file docs-platform rework (flat Knowledge Base routes, Pagefind search, permanent redirects) plus a style-guide update. **@AgentEnder** merged 5, including a genuine curiosity: a community PR (#31857) that sat open for **378 days** before merging this week. Two GitHub-Copilot-authored PRs (194 and 146 days open) closed out the same way — a backlog-drain pattern, not new work.

Ocean merged 145 PRs — 29 of them routine automated version-plan-cleanup housekeeping, 116 human-authored. **@bcabanes** merged 21, all one sustained epic: rebuilding sidebar/navigation ownership (#12383, 192 files, the week's highest file-count PR) then moving pieces of UI into it, plus a long tail of polish. **@rarmatei** merged 17 across io-trace daemon perf work (killing an O(n²) fork-scan pathology that was 85% of a CPU core) and CI/build infra, plus a fix for a named enterprise customer (Anaplan) whose self-hosted GHE org selection was silently hitting public GitHub. **@StalkAltan** merged 16 — a DTE scheduling track, a large GitHub-API error-handling refactor, a Stripe billing change (credit-percentage plan modifiers, 25 days in review), and an analytics-dashboard track. **@MaxKless** merged 15, including ocean's half of the same critical `tar` CVE fixed same-week in nx, plus a notable widening of Polygraph's auto-approval allowlist to 9 more MCP tools. **@nartc** merged 10, nine of them a single coherent OAuth/credential-rotation security-hardening arc — the most architecturally significant security work of the week, explicitly designed to preserve anti-replay/theft-detection semantics through a new recovery-grant mechanism. **@lourw** (8) fixed a BYOC billing-gating bug and a background migration that could never terminate. **@barbados-clemens** shipped the single largest PR of the week in either repo: a 13,216-line, 27-day-in-review public Data API — a brand-new external access surface. **@vsavkin** reverted a prior CLI account-selection change back to its old behavior, paired with a companion revert in `nrwl/polygraph-mcp`.

---

## nrwl/nx

### @leosvelperez (Leo) — Migrate-engine feature, migration tooling hardening, critical tar CVE fix (14 merged)

**Migrate execution engine (stacked feature series):**

| PR | Title |
|----|-------|
| [#36404](https://github.com/nrwl/nx/pull/36404) | feat(core): extract the nx migrate execution engine into a separate module |
| [#36405](https://github.com/nrwl/nx/pull/36405) | feat(core): add nx migrate --run-migration to run a single migration |

**Migration tooling / validation hardening:**

| PR | Title |
|----|-------|
| [#36436](https://github.com/nrwl/nx/pull/36436) | chore(repo): harden first-party migration validators |
| [#36437](https://github.com/nrwl/nx/pull/36437) | fix(repo): fix migrations.json entry template in gradle bump skill |
| [#36413](https://github.com/nrwl/nx/pull/36413) | chore(repo): add author-migration skill |

**Migration docs fix pair:**

| PR | Title |
|----|-------|
| [#36377](https://github.com/nrwl/nx/pull/36377) | fix(misc): render migration docs from the documentation key |
| [#36378](https://github.com/nrwl/nx/pull/36378) | fix(react-native): include migration docs in the built package |

**Small cross-plugin fixes:**

| PR | Title |
|----|-------|
| [#36395](https://github.com/nrwl/nx/pull/36395) | fix(core): support multiple brace groups in workspace glob matching |
| [#36409](https://github.com/nrwl/nx/pull/36409) | fix(jest): add @swc/core when configuring jest with the swc compiler |
| [#36411](https://github.com/nrwl/nx/pull/36411) | fix(core): keep pnpm-workspace.yaml comments and read package.json as jsonc |
| [#36412](https://github.com/nrwl/nx/pull/36412) | fix(rollup): acknowledge @swc/core build scripts when configuring rollup |
| [#36406](https://github.com/nrwl/nx/pull/36406) | chore(repo): point e2e-docker at the local-registry-e2e target |

**Critical-severity dependency patch and largest behavioral rewrite:**

| PR | Title |
|----|-------|
| [#36422](https://github.com/nrwl/nx/pull/36422) | chore(repo): override tar to fix critical decompression DoS advisory |
| [#36268](https://github.com/nrwl/nx/pull/36268) | fix(angular-rspack): speed up builds and align behavior with the esbuild application builder |

**Work character:** #36268 is the week's biggest rewrite (5,322 additions, 297 deletions, 39 files, open 15.2 days) — incremental rebuilds, worker-pool reuse, shared SSR compilation, and tsconfig alignment with `@angular/build`, benchmarked at 1.8–7.8x rebuild speedups on an 8,000-component workspace. #36422 patches GHSA-23hp-3jrh-7fpw (CVSS 9.2, node-tar decompression DoS) in ~2 hours from open to merge — the same advisory MaxKless independently patched in ocean the same week (see Needs Your Attention). The migrate-engine series and validator/skill hardening read as investment in the migration authoring workflow itself, following on from last week's `author-migration` skill work.

---

### @FrozenPandaz — Core-runtime fixes, foundational telemetry, PR-review pipeline tuning (10 merged)

**Core runtime fixes:**

| PR | Title |
|----|-------|
| [#36394](https://github.com/nrwl/nx/pull/36394) | fix(core): render critical-path tasks as a nested list in the job summary |
| [#36419](https://github.com/nrwl/nx/pull/36419) | fix(core): handle CRLF line endings in pnpm multi-document lockfiles |
| [#36420](https://github.com/nrwl/nx/pull/36420) | chore(core): sample project graph perf span telemetry per session at 10% |
| [#36432](https://github.com/nrwl/nx/pull/36432) | fix(core): strip terminal query sequences when replaying task output |
| [#36444](https://github.com/nrwl/nx/pull/36444) | fix(core): keep nx migrate on the requested version when release-age gates interfere |

**New foundational work:**

| PR | Title |
|----|-------|
| [#36439](https://github.com/nrwl/nx/pull/36439) | feat(core): derive stable repo key from normalized remote and relative path |

**Repo/process chores:**

| PR | Title |
|----|-------|
| [#36398](https://github.com/nrwl/nx/pull/36398) | chore(repo): run review-pr inside a gVisor sandbox container |
| [#36421](https://github.com/nrwl/nx/pull/36421) | chore(repo): surface trimmed daemon logs in flaky watcher e2e suites |
| [#36433](https://github.com/nrwl/nx/pull/36433) | chore(repo): calibrate PR review pipeline from maintainer review feedback |

**Weekly self-migration:**

| PR | Title |
|----|-------|
| [#36418](https://github.com/nrwl/nx/pull/36418) | chore(repo): migrate to nx 23.2.0-beta.1 |

**Work character:** #36439 (249/-77, 8 files) adds a protocol-independent repo-identity utility with no caller yet — explicit groundwork for upcoming per-run repo telemetry, not a shipped feature. #36432 (376/-3, 3 files) fixes garbled TUI/job-summary output where replayed terminal query sequences (cursor/device-attribute probes) were echoed as garbage. #36433 is meta: FrozenPandaz tuning the team's own AI-driven PR-review pipeline after a case where it approved a security-hardening PR that a human maintainer then requested changes on.

---

### @jaysoo (Jay) — Docs-platform knowledge base rework, style guide (9 merged)

**Docs platform / knowledge base rework:**

| PR | Title |
|----|-------|
| [#36414](https://github.com/nrwl/nx/pull/36414) | docs(misc): rework knowledge base |
| [#36452](https://github.com/nrwl/nx/pull/36452) | fix(misc): use real last-modified date for KB articles |
| [#36461](https://github.com/nrwl/nx/pull/36461) | fix(misc): batch the git walk behind kb last-modified dates |
| [#36410](https://github.com/nrwl/nx/pull/36410) | fix(misc): redirect ahrefs-reported 404s with external backlinks |
| [#36451](https://github.com/nrwl/nx/pull/36451) | docs(misc): document bun dependency catalog support |

**Style / voice guide:**

| PR | Title |
|----|-------|
| [#36416](https://github.com/nrwl/nx/pull/36416) | chore(repo): update style guide to catch additional AI-voice |

**Test / CI chores:**

| PR | Title |
|----|-------|
| [#36363](https://github.com/nrwl/nx/pull/36363) | fix(misc): keep override parser when convert-to-flat-config uses FlatCompat |
| [#36408](https://github.com/nrwl/nx/pull/36408) | chore(testing): re-enable e2e tests skipped for lodash@4.18.0 bug |
| [#36428](https://github.com/nrwl/nx/pull/36428) | chore(testing): set isolatedModules for ts-jest in e2e |

**Work character:** #36414 (3,237/-1,574, **338 files**, open 2.9 days) is the largest file-count PR of the week — restructures the Knowledge Base into flat `/docs/kb/` routes with permanent redirects, centralized topics, curated featured articles, and Pagefind-ranked search context (fixes DOC-552). #36451 documents cogwirrel's community bun-catalog PR (see below) the same week it merged. Otherwise a continuation of the docs/SEO push from recent weeks.

---

### @AgentEnder (Craigory Coppola) — TUI/core engine fixes, a year-old bug closed out (5 merged)

| PR | Title |
|----|-------|
| [#36322](https://github.com/nrwl/nx/pull/36322) | fix(core): forward mouse and resize events to tasks running in the TUI's pty |
| [#36301](https://github.com/nrwl/nx/pull/36301) | fix(core): stop re-querying confirmed cache misses in task orchestrator |
| [#36257](https://github.com/nrwl/nx/pull/36257) | fix(core): merge default plugins through the source-map-aware merge path |
| [#36176](https://github.com/nrwl/nx/pull/36176) | fix(core): route packages/nx nx invocations through the runNxSync helper |
| [#31857](https://github.com/nrwl/nx/pull/31857) | fix(core): correct glob pattern expansion for ZeroOrOne groups |

**Work character:** #36322 (687/-58, 16 files, open 8 days) makes the TUI forward real mouse events and terminal resizes into child task ptys, fixing full-screen apps that never relayout inside it. #36301 (149/-4, 2 files, open 11 days) fixes an O(N²/P) cache-lookup pathology — ~88k redundant lookups reported for 1,500 tasks — by memoizing confirmed cache misses per run. #31857 stands out for tenure: opened **2025-07-08**, merged this week — **378 days** open, fixing a long-standing hasher glob bug (#26880), body notes it was generated with Claude Code.

---

### Automation and community contributions (5 merged)

| Contributor | PR | Title | Notes |
|---|---|---|---|
| Copilot | [#34041](https://github.com/nrwl/nx/pull/34041) | feat(nx-plugin): add vitest support for e2e tests | Open 194 days (fixes #16116); merged by AgentEnder |
| Copilot | [#34639](https://github.com/nrwl/nx/pull/34639) | fix(misc): prevent crash when opening browser in Podman+WSL container | Open 146 days (fixes #34502); merged by FrozenPandaz |
| polygraph-snapshot-app[bot] | [#35583](https://github.com/nrwl/nx/pull/35583) | feat(core): add internal task file check primitives; refactor show target --check | Open 76.7 days; assigned/merged by AgentEnder |
| polygraph-snapshot-app[bot] | [#35727](https://github.com/nrwl/nx/pull/35727) | fix(linting): use projectService for typed linting in flat configs | Open 67 days, **125 files**; assigned to leosvelperez, merged by FrozenPandaz |
| cogwirrel (external) | [#36434](https://github.com/nrwl/nx/pull/36434) | feat(core): add bun dependency-catalog support | Genuine external community PR (fork), open 1.6 days; merged by leosvelperez |

**Work character:** Two GitHub Copilot coding-agent PRs picked up issues maintainers had explicitly punted to "great first issue for a community member" months ago. The two polygraph-snapshot-app PRs are internal long-running AI-agent-driven feature branches (not community), authored via Nx's own Polygraph session tooling and merged on behalf of the maintainer who ran the session. cogwirrel's #36434 (1,599/-149, 18 files) is this week's one clear genuine external-community-PR merge — adds a `BunCatalogManager` fixing bun workspace `catalog:` references that previously crashed `@nx/vitest`/`@nx/react` generators.

---

### Other nx contributors (4 merged)

| Contributor | PR | Title |
|---|---|---|
| dbwodlf3 | [#35207](https://github.com/nrwl/nx/pull/35207) | fix(misc): preserve package alias keys in generated package.json |
| comp615 | [#35293](https://github.com/nrwl/nx/pull/35293) | fix(core): preserve FORCE_COLOR=0 intent for forked child tasks |
| lourd | [#36429](https://github.com/nrwl/nx/pull/36429) | fix(core): handle colons in target name when resolving inputs to generate graph |
| polygraph-app[bot] | [#36440](https://github.com/nrwl/nx/pull/36440) | chore(repo): migrate to nx 23.2.0-beta.2 |

---

## nrwl/ocean

_29 additional PRs this week were automated `github-actions[bot]` "clean up version plans from X release" housekeeping — routine changelog cleanup, omitted below as not narrative-worthy._

### @bcabanes (Benjamin) — Sidebar/navigation rebuild epic (21 merged)

**Foundational rebuild:**

| PR | Title |
|----|-------|
| [#12383](https://github.com/nrwl/ocean/pull/12383) | feat(nx-cloud): rebuild the sidebar & simplify handling |

**Feature moves into the rebuilt sidebar:**

| PR | Title |
|----|-------|
| [#12433](https://github.com/nrwl/ocean/pull/12433) | feat(nx-cloud): nest CIPE/run as entity blocks |
| [#12453](https://github.com/nrwl/ocean/pull/12453) | feat(nx-cloud): link org avatar to workspaces |
| [#12461](https://github.com/nrwl/ocean/pull/12461) | feat(nx-cloud): move run resource usage into sidebar |
| [#12497](https://github.com/nrwl/ocean/pull/12497) | feat(nx-cloud): move search shortcut to `/` |
| [#12477](https://github.com/nrwl/ocean/pull/12477) | feat(nx-cloud): move workspace selector into sidebar |

**Polish / bug-fix tail (15 PRs):** [#12454](https://github.com/nrwl/ocean/pull/12454), [#12455](https://github.com/nrwl/ocean/pull/12455), [#12456](https://github.com/nrwl/ocean/pull/12456), [#12462](https://github.com/nrwl/ocean/pull/12462), [#12464](https://github.com/nrwl/ocean/pull/12464), [#12465](https://github.com/nrwl/ocean/pull/12465), [#12466](https://github.com/nrwl/ocean/pull/12466), [#12476](https://github.com/nrwl/ocean/pull/12476), [#12378](https://github.com/nrwl/ocean/pull/12378), [#12518](https://github.com/nrwl/ocean/pull/12518), [#12519](https://github.com/nrwl/ocean/pull/12519), [#12520](https://github.com/nrwl/ocean/pull/12520), [#12525](https://github.com/nrwl/ocean/pull/12525), [#12524](https://github.com/nrwl/ocean/pull/12524), [#12546](https://github.com/nrwl/ocean/pull/12546)

**Work character:** #12383 (6,004/-5,828, **192 files**, open 3.5 days) is the highest file-count PR of the week in either repo — reframes navigation as route loaders publishing a typed `shellNavigation` contribution the shell consumes once, with destinations owning their own upgrade/renewal/empty/unavailable states instead of the sidebar scraping loader shapes. The PR body describes it as "mostly contract propagation," not a visual-only change. #12477 (2,171/-1,735, 93 files) consolidates org/workspace identity that had been split between the top rail and sidebar. One contributor, one continuous epic, all week — textbook large-feature-not-scattered-issues.

---

### @rarmatei (Rares) — io-trace daemon performance, CI/build infra, VCS/SCIM fixes (17 merged)

**io-trace performance track:**

| PR | Title |
|----|-------|
| [#12424](https://github.com/nrwl/ocean/pull/12424) | perf(io-trace): profiling and hardening |
| [#12457](https://github.com/nrwl/ocean/pull/12457) | perf(io-trace): profiling and hardening |
| [#12494](https://github.com/nrwl/ocean/pull/12494) | perf(io-trace): kill the O(n²) fork scan, add lazy fork fd-inheritance experiment |
| [#12516](https://github.com/nrwl/ocean/pull/12516) | perf(io-trace): profiling and hardening |
| [#12517](https://github.com/nrwl/ocean/pull/12517) | perf(io-trace): profiling and hardening |
| [#12535](https://github.com/nrwl/ocean/pull/12535) | perf(io-trace): profiling and hardening |
| [#12541](https://github.com/nrwl/ocean/pull/12541) | perf(io-trace): profiling and hardening |

**CI / build infra reliability:**

| PR | Title |
|----|-------|
| [#12426](https://github.com/nrwl/ocean/pull/12426) | fix(repo): single-tenant build isolation |
| [#12428](https://github.com/nrwl/ocean/pull/12428) | fix(repo): CI infra fix |
| [#12418](https://github.com/nrwl/ocean/pull/12418) | fix(repo): CI infra fix |
| [#12420](https://github.com/nrwl/ocean/pull/12420) | fix(storybook): telemetry fix |
| [#12421](https://github.com/nrwl/ocean/pull/12421) | fix(repo): e2e log placement |
| [#12416](https://github.com/nrwl/ocean/pull/12416) | chore(repo): tsconfig hygiene |
| [#12412](https://github.com/nrwl/ocean/pull/12412) | chore(repo): tsconfig hygiene |
| [#12417](https://github.com/nrwl/ocean/pull/12417) | chore(repo): tsconfig hygiene |

**VCS / auth and SCIM fixes:**

| PR | Title |
|----|-------|
| [#12409](https://github.com/nrwl/ocean/pull/12409) | fix(vcs): respect GITHUB_API_URL for all GitHub API clients |
| [#12513](https://github.com/nrwl/ocean/pull/12513) | fix(nx-cloud): renew expired SCIM e2e bearer tokens |

**Work character:** #12494 (527/-31, 3 files) fixes a fork-path dedup scan that was 85% of a CPU core and a leading OOMKill cause under fork storms — benchmark went from 6,700ns/5,360B/14 allocs to 404ns/75B/0 allocs. #12409 fixes ~20 server files that hardcoded `api.github.com` instead of respecting a configured GHE base URL, breaking org selection for a named self-hosted customer (Anaplan). #12513 is test-infrastructure-only (expired SCIM JWTs re-minted with a 10-year expiry) — not a production incident. A second consecutive week of the io-trace reliability track, alongside routine CI hygiene.

---

### @StalkAltan (Altan) — DTE scheduling, GitHub API refactor, billing, analytics (16 merged)

**DTE / task-scheduling track:**

| PR | Title |
|----|-------|
| [#11696](https://github.com/nrwl/ocean/pull/11696) | fix(nx-api): cancel unfinished live run tasks |
| [#11880](https://github.com/nrwl/ocean/pull/11880) | chore(dte): harden repair-parity fuzz test |
| [#12359](https://github.com/nrwl/ocean/pull/12359) | fix(dte): fail impossible assignment rules early |
| [#12347](https://github.com/nrwl/ocean/pull/12347) | feat(nx-api): reserve capacity for critical path tasks |
| [#12523](https://github.com/nrwl/ocean/pull/12523) | perf(dte): write heartbeats directly to Valkey |

**Larger refactor and billing:**

| PR | Title |
|----|-------|
| [#12402](https://github.com/nrwl/ocean/pull/12402) | refactor(nx-api): typed GitHub API errors |
| [#12129](https://github.com/nrwl/ocean/pull/12129) | feat(nx-cloud): add credit percentage plan modifiers |

**nx-cloud analytics dashboard track:**

| PR | Title |
|----|-------|
| [#12486](https://github.com/nrwl/ocean/pull/12486) | feat(nx-cloud): analytics dashboard |
| [#12521](https://github.com/nrwl/ocean/pull/12521) | feat(nx-cloud): analytics dashboard |
| [#12522](https://github.com/nrwl/ocean/pull/12522) | feat(nx-cloud): analytics dashboard |
| [#12542](https://github.com/nrwl/ocean/pull/12542) | feat(nx-cloud): analytics dashboard |
| [#12529](https://github.com/nrwl/ocean/pull/12529) | feat(nx-cloud): analytics dashboard |
| [#12547](https://github.com/nrwl/ocean/pull/12547) | feat(nx-cloud): analytics dashboard |

**Misc:** [#12369](https://github.com/nrwl/ocean/pull/12369), [#12403](https://github.com/nrwl/ocean/pull/12403), [#12447](https://github.com/nrwl/ocean/pull/12447)

**Work character:** #12347 (3,623/-81, 12 files, open 8.2 days) is a new Valkey-cached task-duration profiling system reserving worker capacity for the deterministic critical chain in distributed task execution. #12402 (2,706/-2,192, 15 files) replaces exception-based GitHub API error handling with typed Arrow `Raise` errors, touching the GitHub integration trust boundary broadly. #12129 is a direct Stripe billing change (see Needs Your Attention). #11696 and #11880 sat 46.1 and 39.3 days respectively before merging this week — old work finally clearing, not new.

---

### @MaxKless (Max) — Critical CVE fix, Polygraph access scoping, session UI, code-similarity feature (15 merged)

**Security:**

| PR | Title |
|----|-------|
| [#12438](https://github.com/nrwl/ocean/pull/12438) | fix(repo): update tar to 7.5.20 to resolve critical DoS advisory |

**Access-sensitive:**

| PR | Title |
|----|-------|
| [#12443](https://github.com/nrwl/ocean/pull/12443) | feat(polygraph): auto-approve full polygraph-mcp tool surface |
| [#12469](https://github.com/nrwl/ocean/pull/12469) | fix(polygraph): scope CLI session operations to the session's own account |

**Session UI track:**

| PR | Title |
|----|-------|
| [#12439](https://github.com/nrwl/ocean/pull/12439) | feat(polygraph): derive title from first PR + naming trend dashboard |
| [#12445](https://github.com/nrwl/ocean/pull/12445) | feat(polygraph): redesign session details overview |
| [#12451](https://github.com/nrwl/ocean/pull/12451) | feat(polygraph): render implicit sessions in web session graph |

**Code-similarity / relatedness feature track:**

| PR | Title |
|----|-------|
| [#12479](https://github.com/nrwl/ocean/pull/12479) | feat(polygraph): session relatedness playground |
| [#12482](https://github.com/nrwl/ocean/pull/12482) | feat(polygraph): session relatedness playground |
| [#12506](https://github.com/nrwl/ocean/pull/12506) | feat(polygraph): session relatedness playground |
| [#12507](https://github.com/nrwl/ocean/pull/12507) | feat(polygraph): session relatedness playground |
| [#12510](https://github.com/nrwl/ocean/pull/12510) | feat(polygraph): session relatedness playground |
| [#12480](https://github.com/nrwl/ocean/pull/12480) | feat(polygraph): code-change similarity and implicit sessions in session relatedness |

**Misc:** [#12414](https://github.com/nrwl/ocean/pull/12414), [#12436](https://github.com/nrwl/ocean/pull/12436), [#12484](https://github.com/nrwl/ocean/pull/12484)

**Work character:** #12438 patches GHSA-23hp-3jrh-7fpw same-day (~50 minutes open to merge) — the same critical `tar` advisory leosvelperez patched in nx this week (see Needs Your Attention). #12480 (1,448/-163, 18 files) makes code-change similarity a bounded re-ranking boost on top of intent-embedding similarity, tuned against production data showing code-only admission surfaced almost entirely mechanical noise. #12443 and #12469 are both access-sensitive — see Needs Your Attention for #12443.

---

### @nartc (Chau) — OAuth/credential-rotation security hardening arc (10 merged)

**OAuth / credential hardening (9 PRs, one coherent arc):**

| PR | Title |
|----|-------|
| [#12400](https://github.com/nrwl/ocean/pull/12400) | chore(polygraph): OAuth credential observability |
| [#12446](https://github.com/nrwl/ocean/pull/12446) | fix(polygraph): OAuth keychain failure debuggability |
| [#12460](https://github.com/nrwl/ocean/pull/12460) | fix(polygraph): preserve CLI OAuth login state through VCS-connection redirects |
| [#12488](https://github.com/nrwl/ocean/pull/12488) | fix(polygraph): backport #12460 to single-tenant/2607 |
| [#12449](https://github.com/nrwl/ocean/pull/12449) | fix(polygraph): atomic credential-file writes and refresh-lock mtime renewal |
| [#12467](https://github.com/nrwl/ocean/pull/12467) | fix(polygraph): pending-rotation marker to prevent OAuth token replay |
| [#12530](https://github.com/nrwl/ocean/pull/12530) | feat(nx-api): recovery-tagged OAuth rotations and recovery grant (server) |
| [#12531](https://github.com/nrwl/ocean/pull/12531) | feat(polygraph): recovery-tagged OAuth rotations and recovery grant (CLI) |
| [#12550](https://github.com/nrwl/ocean/pull/12550) | chore(polygraph): OAuth observability follow-up |

**Unrelated:**

| PR | Title |
|----|-------|
| [#12450](https://github.com/nrwl/ocean/pull/12450) | feat(polygraph): redesign organization overview |

**Work character:** This is the week's most concentrated security-hardening effort — see Needs Your Attention. #12449 makes credential-file writes atomic (fsync+rename) and keeps a live OAuth refresh lock from being reclaimed mid-refresh. #12467 adds a pending-rotation marker (sha256 fingerprint of the predecessor token) so an interrupted refresh can't accidentally replay a consumed token — replay triggers full token-family revocation server-side. #12530/#12531 (1,533/-33 and 1,259/-138 lines) add a proof-based recovery grant so a client that loses a rotation response can recover without re-login, with the PR body explicitly stating "recovery is worthless if it softens the security model even a little." #12460/#12488 preserve OAuth login state through VCS-connection redirects, described in the PR body as "the complete cross-route OAuth journey and its security boundary."

---

### @lourw (Lauren) — Billing/access gating fix, aggregator migration fix, CIPE config track (8 merged)

| PR | Title |
|----|-------|
| [#12425](https://github.com/nrwl/ocean/pull/12425) | fix(nx-api): use org creation date for BYOC gating |
| [#12302](https://github.com/nrwl/ocean/pull/12302) | fix(aggregator): fix never-terminating populateIsCacheableOnFlakinessMetrics migration |
| [#12381](https://github.com/nrwl/ocean/pull/12381) | feat(nx-cloud): config YAML section in CIPE configurations page |
| [#12432](https://github.com/nrwl/ocean/pull/12432) | fix(nx-cloud): retain ci-config overrides per environment |
| [#12458](https://github.com/nrwl/ocean/pull/12458) | fix(nx-cloud): point ci-config schema at cloud.nx.app |
| [#12463](https://github.com/nrwl/ocean/pull/12463), [#12489](https://github.com/nrwl/ocean/pull/12489), [#12501](https://github.com/nrwl/ocean/pull/12501) | misc fixes |

**Work character:** #12425 fixes gating logic that would incorrectly lock a legacy pre-cutoff organization out of BYOC (Bring Your Own Cloud) if they created a new workspace after the cutoff, unless on Enterprise — an entitlement-gating bug, not a new grant. #12302 (open 9.8 days) fixes a background migration that as originally written could never terminate and was re-running its full aggregation every ~10 minutes indefinitely.

---

### @Cammisuli (Jon) — Polygraph CLI multiplexer dev-experience fixes (6 merged)

| PR | Title |
|----|-------|
| [#12429](https://github.com/nrwl/ocean/pull/12429), [#12471](https://github.com/nrwl/ocean/pull/12471), [#12500](https://github.com/nrwl/ocean/pull/12500), [#12503](https://github.com/nrwl/ocean/pull/12503), [#12504](https://github.com/nrwl/ocean/pull/12504) | terminal-multiplexer / installer fixes |
| [#12502](https://github.com/nrwl/ocean/pull/12502) | fix(polygraph): resolve multiplexer agent-attach issues (NXA-2116/2118/2136/2087/2137) |

**Work character:** #12502 (388/-347, 13 files, 9 commits) fixes four distinct tmux/zellij/kitty pane-management bugs in one PR — a config-clobbering fallback, orphaned child panes on repeated Ctrl+C, wrong-window splits, and spurious pane respawns on resize.

---

### @nixallover (Nick) — Billing/entitlement UI, feature-flag plumbing (5 merged)

| PR | Title |
|----|-------|
| [#12473](https://github.com/nrwl/ocean/pull/12473), [#12474](https://github.com/nrwl/ocean/pull/12474) | feat(nx-cloud): plan-locked add-on UI treatment |
| [#12382](https://github.com/nrwl/ocean/pull/12382) | feat(nx-cloud): usage nav link during enterprise trial |
| [#12527](https://github.com/nrwl/ocean/pull/12527) | fix(nx-cloud): feature-flag anonymous-ID evaluation for logged-out visitors |
| [#12549](https://github.com/nrwl/ocean/pull/12549) | chore(nx-cloud): drive new layout from env var instead of org-scoped PostHog flag |

**Work character:** #12527 fixes flag evaluation for logged-out visitors to use a real anonymous ID; the PR body explicitly defers a related question — `new_access_control` still omits `entityId` at auth-hot-path call sites including `requireOrganizationAccess`, deliberately left for a separate PR since turning that into a per-user flag "would change access-control behavior."

---

### Other ocean contributors (18 merged)

| Contributor | PR | Title |
|---|---|---|
| @barbados-clemens | [#12082](https://github.com/nrwl/ocean/pull/12082) | feat(nx-api): workspace data api |
| @barbados-clemens | [#12431](https://github.com/nrwl/ocean/pull/12431) | fix(conformance): preserve rule setup errors |
| @barbados-clemens | [#12490](https://github.com/nrwl/ocean/pull/12490) | fix(nx-cloud): show "not cacheable" instead of "cache miss" in task details view |
| @vsavkin (Victor) | [#12397](https://github.com/nrwl/ocean/pull/12397) | revert(polygraph): make CLI account selection cwd-scoped by default |
| @vsavkin (Victor) | [#12434](https://github.com/nrwl/ocean/pull/12434) | fix(polygraph): load polygraph skill on session review like resume |
| @vsavkin (Victor) | [#12552](https://github.com/nrwl/ocean/pull/12552) | chore(repo): enable sandboxed agent runs for Gradle and nx-api tests |
| @JamesHenry | [#12441](https://github.com/nrwl/ocean/pull/12441) | feat(polygraph): add cloud agent integration |
| @JamesHenry | [#12363](https://github.com/nrwl/ocean/pull/12363) | chore(nx-cloud): self-healing dashboard fixes |
| @JamesHenry | [#12509](https://github.com/nrwl/ocean/pull/12509) | feat(polygraph): serve the cloud-agent MCP connector at /mcp |
| @FrozenPandaz | [#12430](https://github.com/nrwl/ocean/pull/12430) | chore(repo): migrate to nx 23.2.0-beta.1 |
| @FrozenPandaz | [#12491](https://github.com/nrwl/ocean/pull/12491) | chore(repo): migrate to nx 23.2.0-beta.2 |
| @mrl-jr | [#12279](https://github.com/nrwl/ocean/pull/12279) | feat(polygraph): session artifacts — upload, versioning, reader behind flag |
| @mrl-jr | [#12492](https://github.com/nrwl/ocean/pull/12492) | feat(polygraph): session artifact upload via CLI + MCP with upload hardening |
| @meeroslav (Miroslav) | [#12444](https://github.com/nrwl/ocean/pull/12444) | fix(owners): match CODEOWNERS pattern semantics when attributing ownership metadata |
| @meeroslav (Miroslav) | [#12440](https://github.com/nrwl/ocean/pull/12440) | fix(conformance): allow implicit dependencies on app projects in enforce-project-boundaries |
| @AI-JamesHenry | [#12493](https://github.com/nrwl/ocean/pull/12493) | fix(polygraph): restore cloud agent OAuth discovery |
| @AI-JamesHenry | [#12499](https://github.com/nrwl/ocean/pull/12499) | fix(polygraph): restore cloud agent logs and consent |
| @pmariglia | [#12277](https://github.com/nrwl/ocean/pull/12277) | feat(nx-cloud-workflow-controller): facade routes based on capabilities (INF-1452) |

**Work character:** @barbados-clemens's #12082 (13,216/-86, 87 files, 21 commits, open **27.3 days**) is the single largest PR of the week in either repo — a new read-only paginated public Data API (`/nx-cloud/data/{version}/{entity}`) exposing CIPEs/runs/tasks/workflows/metrics to third-party consumers, token-scoped and tenant-isolated (see Needs Your Attention). @vsavkin's #12397 is a true `git revert` of a squash-merged prior PR (which predates this week's window) restoring global-only CLI account selection, paired with a companion revert in the separate `nrwl/polygraph-mcp` repo. @pmariglia's #12277 (open 11 days) is a flagged feature (Facade Routes) in the workflow-controller.

---

## Needs Your Attention

### 1. Same critical `tar` CVE patched independently in both repos, same week
GHSA-23hp-3jrh-7fpw (node-tar decompression DoS, CVSS 9.2) was fixed in nx by **@leosvelperez** ([#36422](https://github.com/nrwl/nx/pull/36422), ~2 hours open) and in ocean by **@MaxKless** ([#12438](https://github.com/nrwl/ocean/pull/12438), ~50 minutes open) — the same cross-repo coordination pattern as last week's websocket-driver CVE. No action needed.

### 2. Nartc's 9-PR OAuth/credential-rotation hardening arc — recommend a dedicated security sign-off
Headlined by [#12530](https://github.com/nrwl/ocean/pull/12530)/[#12531](https://github.com/nrwl/ocean/pull/12531) ("recovery-tagged oauth rotations and recovery grant"), this is the most architecturally significant security change of the week: a new recovery-grant mechanism that lets a client recover from a lost rotation response without re-login, explicitly designed to preserve anti-replay/theft-detection semantics. Landed across 9 PRs in under a week — worth a dedicated review before it's load-bearing in production, given it touches session/credential trust directly.

### 3. Polygraph's auto-approval allowlist widened to 9 more MCP tools, including agent approve/deny
**@MaxKless**'s [#12443](https://github.com/nrwl/ocean/pull/12443) removes the human-in-the-loop confirmation step for 9 MCP tools that were previously prompting for approval — including `allow_agent` and `deny_agent`, i.e. the tools that themselves grant or revoke agent permissions. The PR frames this as correcting allowlist drift, but worth confirming it's an intentional widening rather than an oversight, since it changes which agent actions run without a human checking first.

### 4. Stripe billing change: credit-percentage plan modifiers
**@StalkAltan**'s [#12129](https://github.com/nrwl/ocean/pull/12129) adds percentage-based credit discounts across execution/compute/AI/sandboxing/cache categories, applying amount-off Stripe invoice discounts directly — a direct change to customer billing, 25 days in review before merging. Ocean's own guardrail requires staged Save/Confirm plus audit-log coverage for settings affecting billing; this research didn't verify the UI/save flow itself, so worth a quick confirmation that requirement was met.

### 5. New external Data API — largest PR of the week, 27 days in review
**@barbados-clemens**'s [#12082](https://github.com/nrwl/ocean/pull/12082) ships a new public, read-only, paginated Data API for third-party consumers (CIPEs/runs/tasks/workflows/metrics), token-scoped and tenant-isolated per the PR body. It's a brand-new external access surface at 13,216 lines — worth a security/access review before it's promoted to customers broadly, similar to past flags on new access surfaces.

### 6. Named enterprise customer (Anaplan) hit a GHE integration bug before the fix
**@rarmatei**'s [#12409](https://github.com/nrwl/ocean/pull/12409) fixes ~20 server files that hardcoded `api.github.com`, breaking self-hosted GHE org selection for a customer (named in the PR: Anaplan). The fix is in, but worth knowing this was customer-visible breakage — confirm Support/CS is aware in case it needs a proactive follow-up.

### 7. Old-PR backlog continues draining — same pattern as recent weeks
A 378-day-old nx community PR ([#31857](https://github.com/nrwl/nx/pull/31857)) and two GitHub-Copilot-authored PRs (194 and 146 days open) closed out this week, alongside two StalkAltan ocean PRs that sat 46 and 39 days ([#11696](https://github.com/nrwl/ocean/pull/11696), [#11880](https://github.com/nrwl/ocean/pull/11880)). No action needed — flagging as a continuing healthy pattern of the review backlog clearing, consistent with last week's community-PR sweep.

### 8. A prior CLI behavior change was reverted this week
**@vsavkin**'s [#12397](https://github.com/nrwl/ocean/pull/12397) reverts "make CLI account selection cwd-scoped by default" back to global-only selection, with a companion revert in the separate `nrwl/polygraph-mcp` repo. The original change predates this week's window, so it's not visible in this report — worth a quick check on whether this was a caught regression or a deliberate design reversal, since it affects default CLI behavior for all users.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-07-20 to 2026-07-26_
