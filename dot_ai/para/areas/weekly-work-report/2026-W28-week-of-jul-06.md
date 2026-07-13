# Weekly Work Report — Week of July 6–12, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-07-06 and 2026-07-12._

---

## TL;DR

Nx had its lightest week in the recent series — 35 PRs versus a 50-60/week baseline, with no weekend merges — but the volume that did land was concentrated and purposeful. **@FrozenPandaz** carried 34% of it (12/35) alone, four of those PRs a coordinated memory-bisection campaign against the Rust hash planner (each citing a measured RSS delta), plus the weekly self-migration to beta.7. **@leosvelperez (Leo)** shipped a **critical-severity** dependency patch (a decompress path-traversal advisory reached via `@swc/cli`) alongside independent hash-planner memory work of his own — the same subsystem FrozenPandaz was in, the same week. **@AgentEnder (Craigory)** fixed two TUI stability regressions and a real correctness bug where `...` spread tokens in `package.json` `nx.targets` were silently dropped during config merging. TS6/Angular22 migration work has visibly tapered from the 26-PR push two weeks ago to just 4 PRs this week.

Ocean landed two large, coherent feature arcs in parallel: **@MaxKless (Max)** shipped 13 PRs building out Polygraph session search, discovery, and lifecycle management end-to-end, while **@bcabanes (Benjamin)** landed the week's single largest change — a full replacement of the Nx Cloud top navbar with a new sidebar app shell (22,201 additions, 374 files) — plus six same-week follow-on fixes hardening it. **@rarmatei (Rares)** closed the loop on last week's reverted nx-api cache change, re-landing it this time with a bundle-canary safety net and a dedicated regression test. **@nartc (Chau)** added a new SAML authentication strategy to Polygraph — a genuine new identity/auth surface worth a security pass — alongside session-graph UI polish. Two pairs of contributors touched overlapping surfaces in the same 24-48 hours: the billing add-on rail (bcabanes/jaysoo) and Polygraph session-linking concepts (MaxKless/nartc) — both worth a quick coordination check.

---

## nrwl/nx

### @FrozenPandaz — Hash-planner memory hardening, weekly self-migration, TS6/sandbox fixes (12 merged)

The largest body of work this week, clustering around a deliberate memory-bisection campaign against the Rust hash planner, interleaved with the recurring self-migration chore and a handful of reactive fixes.

**Hash-planner memory bisection (RSS reduction series):**

| PR | Title |
|----|-------|
| [#36247](https://github.com/nrwl/nx/pull/36247) | fix(core): box JsonFileSet payload to keep HashInstruction small |
| [#36244](https://github.com/nrwl/nx/pull/36244) | fix(core): share workspace fileset hash results instead of deep-cloning per task |
| [#36248](https://github.com/nrwl/nx/pull/36248) | fix(core): replace per-input visited clones with undo-log scoping in hash planner |
| [#36249](https://github.com/nrwl/nx/pull/36249) | fix(core): intern hash instructions in a pool and plan with id lists |

**TypeScript 6 migration edge cases:**

| PR | Title |
|----|-------|
| [#36272](https://github.com/nrwl/nx/pull/36272) | fix(js): pin tsconfig root dir even when it matches the config directory |
| [#36285](https://github.com/nrwl/nx/pull/36285) | fix(js): pin rootDir on composite tsconfigs for ts6 (ts-jest strips composite) |

**Repo chores:**

| PR | Title |
|----|-------|
| [#36232](https://github.com/nrwl/nx/pull/36232) | chore(repo): migrate to nx 23.1.0-beta.7 |
| [#36262](https://github.com/nrwl/nx/pull/36262) | chore(repo): add opt-in deep pr review tooling for maintainers |

**Reactive core/js fixes:**

| PR | Title |
|----|-------|
| [#36259](https://github.com/nrwl/nx/pull/36259) | fix(core): add trailing space after performance report popup title |
| [#36273](https://github.com/nrwl/nx/pull/36273) | fix(core): detect Codex sandbox on Linux to disable daemon and plugin isolation |
| [#36281](https://github.com/nrwl/nx/pull/36281) | fix(core): skip projects-filtered targetDefaults when resolved without a project |
| [#36295](https://github.com/nrwl/nx/pull/36295) | fix(core): omit peer dependencies when installing packages to a temp dir |

**Work character:** Four of the twelve PRs are a single, well-documented memory-bisection campaign against the hash planner — each PR cites a specific measured RSS delta (e.g. +122 MiB, +218 MiB, +91 MiB) — which reads as coordinated performance-regression cleanup rather than scattered fixes. The rest is routine maintenance (weekly self-migration, PR-review tooling) plus a string of small, sharply-scoped bug fixes surfaced downstream of the TS6 and AI-sandbox work. High volume, but each individual diff is narrow and low-risk.

---

### @leosvelperez (Leo) — Migration hardening, a security patch, and independent memory work (6 merged)

| PR | Title |
|----|-------|
| [#36021](https://github.com/nrwl/nx/pull/36021) | fix(web): run executor/plugin/generator commands with the workspace package manager |
| [#36245](https://github.com/nrwl/nx/pull/36245) | fix(js): keep tsconfigs compiling and config files loading under TypeScript 6 |
| [#36294](https://github.com/nrwl/nx/pull/36294) | fix(js): bump @swc/cli to 0.8.1 to patch critical decompress advisory |
| [#36293](https://github.com/nrwl/nx/pull/36293) | feat(storybook): update Storybook to support Angular 22 |
| [#36291](https://github.com/nrwl/nx/pull/36291) | fix(core): include root package.json dependencies for '.'-rooted projects |
| [#36267](https://github.com/nrwl/nx/pull/36267) | fix(core): reduce task hashing memory usage on large workspaces |

**Work character:** More varied than a typical Leo week. TS6/Angular 22 migration hardening is still present (#36245, #36293), but shares space with a critical-severity security patch (#36294, triggered by the daily npm-audit CI catching a decompress path-traversal advisory) and a project-graph correctness fix (#36291 — dependency edges were silently dropped for `.`-rooted projects since Nx 22.3.0). #36267 targets task-hashing memory the same week FrozenPandaz ran four PRs against the same subsystem — independent, parallel work in one hot area of the codebase.

---

### @AgentEnder (Craigory Coppola) — TUI stability fixes and a config-merging correctness bug (4 merged)

| PR | Title |
|----|-------|
| [#36256](https://github.com/nrwl/nx/pull/36256) | fix(core): prevent TUI hint popup from permanently stealing focus |
| [#36261](https://github.com/nrwl/nx/pull/36261) | fix(core): size TUI bottom bar reservations to the actual help text |
| [#36283](https://github.com/nrwl/nx/pull/36283) | fix(core): defer unresolved spread tokens when merging intermediate target configurations |
| [#36287](https://github.com/nrwl/nx/pull/36287) | chore(repo): add dotnet restore postinstall |

**Work character:** Two back-to-back TUI fixes address real user-facing regressions — one where the terminal UI could wedge into an unresponsive focus state, one where hardcoded layout constants had drifted from actual help-text width. #36283 is a genuine correctness bug: a `'...'` spread token in `package.json` `nx.targets` was silently disappearing when merged with a script-derived target, which could have produced quietly-wrong target configuration before this landed.

---

### @jaysoo (Jack) — One core fix, three docs pieces (4 merged)

| PR | Title |
|----|-------|
| [#36230](https://github.com/nrwl/nx/pull/36230) | fix(js): wait for process tree exit when stopping node executor tasks |
| [#36276](https://github.com/nrwl/nx/pull/36276) | docs(misc): refresh angular docs pages and fix broken angular urls |
| [#36275](https://github.com/nrwl/nx/pull/36275) | docs(misc): add competitor comparison pages |
| [#36300](https://github.com/nrwl/nx/pull/36300) | docs(js): add TypeScript 7 guide |

**Work character:** A content-heavy week. #36230 is a legitimate core fix (watch-mode restarts could hit `EADDRINUSE` because the old process wasn't confirmed dead before the new one started). The rest is documentation: a high-traffic Angular docs refresh, a new set of competitor-comparison pages, and a TypeScript 7 compatibility guide.

---

### @polygraph-snapshot-app[bot] — Automated fixes from Polygraph sessions (2 merged)

| PR | Title |
|----|-------|
| [#35733](https://github.com/nrwl/nx/pull/35733) | fix(core): preserve comments in catalog YAML updates |
| [#36240](https://github.com/nrwl/nx/pull/36240) | docs(misc): remove stale nx-mcp tools from reference docs |

**Work character:** Bot-authored PRs from automated Polygraph sessions. Both are legitimate, scoped fixes — the team dogfooding the automation product against its own repo.

---

### Community and single-PR contributors (7 merged)

| Contributor | PR | Title |
|---|---|---|
| @JamesHenry (James) | [#36242](https://github.com/nrwl/nx/pull/36242) | feat(release): add option to force changelog generation for programmatic usage |
| @stevepentland | [#36246](https://github.com/nrwl/nx/pull/36246) | docs(misc): revise security vulnerability submission instructions |
| @rarmatei (Rares) | [#36265](https://github.com/nrwl/nx/pull/36265) | docs(nx-cloud): document Commit Statuses write permission |
| @meeroslav | [#36253](https://github.com/nrwl/nx/pull/36253) | docs(nx-dev): clarify projects vs files wildcard for CODEOWNERS catch-all |
| @forivall (community) | [#34292](https://github.com/nrwl/nx/pull/34292) | chore(core): fix typo on readTargetOptions jsdoc |
| @aidant (community) | [#35069](https://github.com/nrwl/nx/pull/35069) | fix(vitest): support passing mode through to vitest |
| @stefreak (community) | [#36282](https://github.com/nrwl/nx/pull/36282) | fix(misc): export @nx/esbuild/executors entry point |

**Work character:** Internal engineers (James, stevepentland, Rares, meeroslav) each had a light, docs-focused week. The three community contributors are genuine external fixes — small, self-contained, each closing a specific gap the maintainer team hadn't gotten to. Note: @forivall's typo fix (#34292) sat open for roughly 5 months before merging — worth a periodic sweep of the community PR backlog for other easy wins.

---

## nrwl/ocean

### @MaxKless (Max) — Polygraph session search, discovery & lifecycle (13 merged)

**Session search & discovery UX:**

| PR | Title |
|----|-------|
| [#12167](https://github.com/nrwl/ocean/pull/12167) | feat(polygraph): add session search command and interactive browser |
| [#12221](https://github.com/nrwl/ocean/pull/12221) | feat(tools): session naming + subagent log coverage in search playground |
| [#12234](https://github.com/nrwl/ocean/pull/12234) | feat(polygraph): add autogenerated titles for -- sessions |
| [#12235](https://github.com/nrwl/ocean/pull/12235) | feat(polygraph): fetch related sessions for prompt start |
| [#12247](https://github.com/nrwl/ocean/pull/12247) | feat(polygraph): add c-to-copy-session-id shortcut to the session search detail view |
| [#12248](https://github.com/nrwl/ocean/pull/12248) | feat(polygraph): add related sessions to `session show` (NXA-2074) |
| [#12250](https://github.com/nrwl/ocean/pull/12250) | feat(polygraph): show session titles in the search and resume browsers |

**Session lifecycle & data pipeline:**

| PR | Title |
|----|-------|
| [#12022](https://github.com/nrwl/ocean/pull/12022) | feat(polygraph): auto-close abandoned agent statuses — heartbeat + sweeper (NXA-1840) |
| [#12124](https://github.com/nrwl/ocean/pull/12124) | feat(polygraph): ingest code changes and open implicit sessions |
| [#12254](https://github.com/nrwl/ocean/pull/12254) | feat(polygraph): upload parent agent logs as immutable per-checkpoint segments |

**CLI & docs:**

| PR | Title |
|----|-------|
| [#12222](https://github.com/nrwl/ocean/pull/12222) | feat(polygraph): make CLI account selection cwd-scoped by default |
| [#12295](https://github.com/nrwl/ocean/pull/12295) | docs(readme): fix grammar in local S3 setup note |
| [#12296](https://github.com/nrwl/ocean/pull/12296) | docs(readme): fix Prerequisites heading spelling |

**Work character:** The week's heaviest single-contributor push, and it's entirely Polygraph session infrastructure — search/discovery UX, a "related sessions" linking concept, session lifecycle (heartbeat/sweeper for abandoned agents under NXA-1840, implicit session creation from ingested code changes), and immutable log-segment upload. A coherent one-person feature arc, not scattered. The "related sessions" work (#12235, #12248) sits in the same conceptual space as @nartc's "manual session references" (#12267) merged two days later — worth a quick sync to confirm they're not building overlapping linking models.

---

### @rarmatei (Rares) — io-trace daemon experiments & CI/build cache reliability (10 merged)

**io-trace daemon reliability & perf experiments:**

| PR | Title |
|----|-------|
| [#12217](https://github.com/nrwl/ocean/pull/12217) | feat(io-trace): opt-in stat-syscall tracking via per-PR experiment |
| [#12215](https://github.com/nrwl/ocean/pull/12215) | fix(io-trace): read execve argv at syscall enter, gated behind exec-enter-argv experiment |
| [#12271](https://github.com/nrwl/ocean/pull/12271) | fix(io-trace): exit the daemon when storage-client creation is wedged |
| [#12214](https://github.com/nrwl/ocean/pull/12214) | feat(fs-storm): synthetic fs event storm harness for io-trace daemon testing |
| [#12216](https://github.com/nrwl/ocean/pull/12216) | fix(workflow-controller): suppress non-signal close events behind perf experiment |

**CI / build cache reliability:**

| PR | Title |
|----|-------|
| [#12034](https://github.com/nrwl/ocean/pull/12034) | chore(snapshot): fix sandbox violations |
| [#12252](https://github.com/nrwl/ocean/pull/12252) | chore: re-enable nx-api cache and bump bundle canary to verify it |
| [#12268](https://github.com/nrwl/ocean/pull/12268) | test(ci): run nx package on PRs to verify polygraph-bundle cache busting |
| [#12256](https://github.com/nrwl/ocean/pull/12256) | fix(nx): stop napi-generated files and overlapping outputs from busting downstream caches |
| [#12249](https://github.com/nrwl/ocean/pull/12249) | feat(nx-api,nx-packages): print CIPE link when start-ci-run creates the run group |

**Work character:** Two parallel tracks: careful, flag-gated experimentation on the io-trace daemon (each change opt-in/behind a per-PR experiment, not a blind rollout) and a methodical repair of nx-api's build cache. #12252 is explicitly the re-land of last week's reverted cache change (#12150) — the second half of a revert-fix-reland cycle that started the prior week, and this time it ships with a bundle-canary verification step and a follow-up regression test (#12268). #12034's ~2.5-week-long branch (opened 06-22) suggests a genuinely fiddly sandbox-violation problem, not a quick chore.

---

### @bcabanes (Benjamin) — Sidebar app shell rollout (9 merged)

**Sidebar app shell (feature + follow-on fixes):**

| PR | Title |
|----|-------|
| [#11709](https://github.com/nrwl/ocean/pull/11709) | feat(nx-cloud): replace the top navbar with the sidebar app shell |
| [#12266](https://github.com/nrwl/ocean/pull/12266) | fix(nx-cloud): gate add-on rail rows on true page reachability |
| [#12274](https://github.com/nrwl/ocean/pull/12274) | fix(nx-cloud): mobile layout for the org workspaces page and sidebar drawer |
| [#12280](https://github.com/nrwl/ocean/pull/12280) | feat(nx-cloud): move org Conformance and Workflows submenus into the rail |
| [#12300](https://github.com/nrwl/ocean/pull/12300) | feat(nx-cloud): reorder run lenses in the app sidebar |
| [#12301](https://github.com/nrwl/ocean/pull/12301) | refactor(nx-cloud): center settings and guide content in a max-width column |
| [#12299](https://github.com/nrwl/ocean/pull/12299) | refactor(nx-cloud): remove "back to workspace list" buttons |

**Unrelated chores:**

| PR | Title |
|----|-------|
| [#12231](https://github.com/nrwl/ocean/pull/12231) | chore(repo): override @xhmikosr/decompress to clear the critical audit |
| [#11978](https://github.com/nrwl/ocean/pull/11978) | feat(nx-cloud,nx-api): serve workspace shields.io ready badges |

**Work character:** #11709 is the week's largest single change (22,201 additions, 374 files, ~1 month in flight, merged 07-09) — a full replacement of the Nx Cloud top navbar with a scope-aware sidebar shell, a new command palette, mobile drawer, and a design-system pass. The other six PRs are stabilization directly on that shell shipped the same week, so this reads as a large feature landing plus its immediate hardening pass rather than scope creep. #12266 ("gate add-on rail rows on true page reachability") touches the same add-on rail surface that @jaysoo's #12211 (billing add-on enable/request flow) shipped the day before — worth confirming both changes were coordinated, since they land on the same UI region within 24 hours.

---

### @nartc (Chau) — Polygraph session graph UI, SAML auth & CLI compatibility (8 merged)

**Session graph UI polish (nxa-2071):**

| PR | Title |
|----|-------|
| [#12237](https://github.com/nrwl/ocean/pull/12237) | fix(polygraph): reduce client browser error noise |
| [#12232](https://github.com/nrwl/ocean/pull/12232) | fix(polygraph): session graph detail panel hover and focus states (nxa-2071) |
| [#12245](https://github.com/nrwl/ocean/pull/12245) | refactor(polygraph): extract shared graph utilities into @polygraph/graph (nxa-2071) |

**Auth & CLI compatibility:**

| PR | Title |
|----|-------|
| [#12289](https://github.com/nrwl/ocean/pull/12289) | feat(polygraph): add SAML authentication |
| [#12285](https://github.com/nrwl/ocean/pull/12285) | feat(polygraph): enforce compatible cli shell version |
| [#12288](https://github.com/nrwl/ocean/pull/12288) | fix(polygraph): satisfy homebrew formula audit |

**Session/repo management:**

| PR | Title |
|----|-------|
| [#12267](https://github.com/nrwl/ocean/pull/12267) | feat(polygraph): add manual session references |
| [#12284](https://github.com/nrwl/ocean/pull/12284) | feat(polygraph): select all unconnected repositories across pages |

**Work character:** A coherent nxa-2071 graph-UI cleanup early in the week, then a shift into new-surface work. #12289 adds a full SAML authentication strategy to Polygraph — a genuine new identity/auth entry point that merits a security review, given it changes how users authenticate into a product handling cross-repo agent sessions. #12267's "manual session references" overlaps conceptually with @MaxKless's related-sessions work landing the same week (see MaxKless section).

---

### @lourw (Louie) — CI pipeline config + run-level metrics/DTE fixes (5 merged)

| PR | Title |
|----|-------|
| [#11099](https://github.com/nrwl/ocean/pull/11099) | chore(repo): use ci-config.yaml to configure pipelines |
| [#12230](https://github.com/nrwl/ocean/pull/12230) | fix(nx-cloud): align assignment-rules columns and link docs |
| [#12227](https://github.com/nrwl/ocean/pull/12227) | feat(nx-api,nx-cloud): run-level process metrics for the cloud-enabled runner |
| [#12265](https://github.com/nrwl/ocean/pull/12265) | fix(client-bundle,nx-api): ensure resource collection works with live runs |
| [#12298](https://github.com/nrwl/ocean/pull/12298) | chore(repo): remove start-nx-agents from checks |

**Work character:** Split between CI pipeline hygiene and cloud-runner telemetry (process metrics, live-run resource collection). No single dominant theme, but all low-risk infra/observability work.

---

### @JamesHenry (James) — Tooling changelog fix + Polygraph session-log/debrief reliability (5 merged)

| PR | Title |
|----|-------|
| [#12223](https://github.com/nrwl/ocean/pull/12223) | fix(tools): re-enable nx cloud changelog generation under nx 23 |
| [#12233](https://github.com/nrwl/ocean/pull/12233) | fix(polygraph): regression on starting repo-less sessions |
| [#12238](https://github.com/nrwl/ocean/pull/12238) | feat(polygraph): read child agent transcripts via session logs --repo/--all |
| [#12253](https://github.com/nrwl/ocean/pull/12253) | feat(polygraph): make session-debrief forks fast and honest in sandboxed environments |
| [#12225](https://github.com/nrwl/ocean/pull/12225) | chore(polygraph): fix main formatting _(merged as @AI-JamesHenry, his AI-assisted authoring identity)_ |

**Work character:** Mostly Polygraph session-tooling reliability (repo-less session regression, transcript reading, sandboxed debrief-fork correctness), plus one unrelated tools/changelog fix.

---

### @Cammisuli (Jon) — Polygraph agent/CLI harness reliability (5 merged)

| PR | Title |
|----|-------|
| [#12218](https://github.com/nrwl/ocean/pull/12218) | fix(polygraph): check agent prerequisites before offering plugin install |
| [#12261](https://github.com/nrwl/ocean/pull/12261) | fix(polygraph): pass --no-track to git worktree add during repo materialization |
| [#12270](https://github.com/nrwl/ocean/pull/12270) | fix(polygraph): cap zellij session name so the derived socket path stays within OS limits |
| [#12264](https://github.com/nrwl/ocean/pull/12264) | feat(polygraph): surface outdated agent plugins at launch and in doctor (nxa-2023) |
| [#12281](https://github.com/nrwl/ocean/pull/12281) | fix(polygraph): survive harness switch-backs on session resume |

**Work character:** Tight, coherent theme — every PR hardens the CLI/agent-harness layer against edge cases (worktree materialization, socket-path OS limits, harness switch-back resume, plugin staleness). Reads like a dedicated reliability sweep, not incidental bug fixing.

---

### @barbados-clemens — nx-cloud query/perf fixes (3 merged)

| PR | Title |
|----|-------|
| [#12272](https://github.com/nrwl/ocean/pull/12272) | fix(nx-cloud): always query DTE based on run executionId |
| [#12273](https://github.com/nrwl/ocean/pull/12273) | fix(nx-cloud): avoid sandboxReports collection scan on the run tasks sandbox violations filter |
| [#12304](https://github.com/nrwl/ocean/pull/12304) | fix(nx-cloud): fast cipe author/branch filter options, stop wiping typed filter text |

**Work character:** A focused, low-risk performance/correctness cluster on run and CIPE query paths. No overlap with other contributors' work.

---

### @nixallover (Nicole) — Docs + tasks-table fix (2 merged)

| PR | Title |
|----|-------|
| [#11884](https://github.com/nrwl/ocean/pull/11884) | docs(repo): add feature flagging skill and README reference |
| [#12275](https://github.com/nrwl/ocean/pull/12275) | chore(nx-cloud): stop tasks table headers remounting and closing the sort popover |

---

### @pmariglia — nx-cloud-workflow-controller capability plumbing (2 merged)

| PR | Title |
|----|-------|
| [#12229](https://github.com/nrwl/ocean/pull/12229) | feat(nx-cloud-workflow-controller): add typed capability vocabulary plumbing for new feature |
| [#12257](https://github.com/nrwl/ocean/pull/12257) | feat(nx-cloud-workflow-controller): Facade Stores Capabilities |

**Work character:** Two sequential steps of the same underlying capability-vocabulary/facade work — coherent, incremental foundation-laying, likely for a feature landing in a future week.

---

### Single-PR contributors (5 merged)

| Contributor | PR | Title |
|---|----|-------|
| @mrl-jr (Mark) | [#12185](https://github.com/nrwl/ocean/pull/12185) | feat(polygraph): add cmd+k command palette for sessions, repos, and accounts |
| @jaysoo (Jack) | [#12211](https://github.com/nrwl/ocean/pull/12211) | feat(nx-cloud): enable or request the sandboxing add-on from the sandbox dashboard |
| @FrozenPandaz | [#12220](https://github.com/nrwl/ocean/pull/12220) | chore(repo): migrate to nx 23.1.0-beta.7 |
| @StalkAltan (Altan) | [#12228](https://github.com/nrwl/ocean/pull/12228) | fix(client-bundle): keep DTE restore temp names under NAME_MAX |
| @stevepentland | [#12262](https://github.com/nrwl/ocean/pull/12262) | chore(nx-cloud-workflow-controller): make private compute routable in dedicated |

---

## Needs Your Attention

### 1. Two overlapping "session linking" concepts shipped in Polygraph the same week
**@MaxKless** built "related sessions" ([#12235](https://github.com/nrwl/ocean/pull/12235), [#12248](https://github.com/nrwl/ocean/pull/12248), NXA-2074) as part of his session search overhaul, while **@nartc** shipped "manual session references" ([#12267](https://github.com/nrwl/ocean/pull/12267)) two days later. Both are session-to-session linking concepts landing in the same window. **Confirm these are complementary (automatic vs. manual linking) rather than two people independently solving the same problem** before either gets extended further.

### 2. Same UI surface touched by two contributors within 24 hours, plus an unverified dependency in the new billing flow
**@bcabanes**'s [#12266](https://github.com/nrwl/ocean/pull/12266) ("gate add-on rail rows on true page reachability") and **@jaysoo**'s [#12211](https://github.com/nrwl/ocean/pull/12211) (sandboxing add-on enable/request flow) both touch the add-on rail on 07-08 and 07-09. Separately, #12211's PR description flags that its Mandrill email template must be published before release — **worth confirming that template is live**, or org admins silently stop getting notified when someone requests the add-on.

### 3. New SAML authentication surface in Polygraph — recommend a security review
**@nartc**'s [#12289](https://github.com/nrwl/ocean/pull/12289) adds a full SAML strategy (config, callback, persisted last-used auth method, inactive-SSO blocking) to Polygraph. This is a new identity/auth entry point into a product that handles cross-repo agent sessions — **worth a security pass if one hasn't already happened**, consistent with how the OAuth/PAT auth overhaul two weeks ago (2026-W26 report) was treated.

### 4. Critical-severity dependency vulnerability patched in Nx
**@leosvelperez**'s [#36294](https://github.com/nrwl/nx/pull/36294) bumps `@swc/cli` to patch a critical decompress path-traversal advisory (GHSA-mp2f-45pm-3cg9), caught by the daily npm-audit CI. **Confirm this shipped in a patch release promptly** — critical advisories on tooling used at build time warrant a fast turnaround.

### 5. Last week's cache revert is now resolved — closing the loop
The 2026-W27 report flagged **@rarmatei**'s nx-api cache re-enable ([#12148](https://github.com/nrwl/ocean/pull/12148)) being reverted ([#12150](https://github.com/nrwl/ocean/pull/12150)) the same day it merged. This week's [#12252](https://github.com/nrwl/ocean/pull/12252) re-lands it, this time with a bundle-canary check and a dedicated regression test ([#12268](https://github.com/nrwl/ocean/pull/12268)). This is a good example of the safer-reland pattern — no action needed, flagging for visibility that the loop is closed.

### 6. Largest PR of the week — watch for settling regressions
**@bcabanes**'s [#11709](https://github.com/nrwl/ocean/pull/11709) replaces the entire Nx Cloud top navbar with a sidebar app shell (22,201 additions, 374 files, ~1 month in flight). Six of his other seven PRs this week are direct follow-on fixes to it, so it landed with immediate hardening — but a change this large may still surface regressions gradually over the next 1-2 weeks. Worth keeping an eye on nav/shell-tagged bug reports.

### 7. One engineer carried a third of Nx's merged PRs, on a subsystem two people touched independently
**@FrozenPandaz** authored 12 of 35 (34%) of Nx's merged PRs this week, four of them a memory-bisection campaign against the Rust hash planner. **@leosvelperez** independently shipped a fifth hash-planner memory PR ([#36267](https://github.com/nrwl/nx/pull/36267)) the same week. Individually these look like healthy, well-documented perf work — **worth a quick check that the two efforts were coordinated** rather than two people fixing the same class of problem in parallel without comparing notes.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-07-06 to 2026-07-12_
