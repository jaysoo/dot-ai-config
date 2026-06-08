# Weekly Work Report — Week of June 1–7, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-06-01 and 2026-06-07._

---

## TL;DR

A heavily focused week: both repos are clearly in a **Nx v23 / Polygraph pre-release push**. On the Nx side, **@leosvelperez** completed the agentic `nx migrate` sprint (7 PRs landed), **@AgentEnder** shipped the long-awaited CreateNodes rename and `@nx/dotnet` graduation, and **@FrozenPandaz** closed out the local-dist-build migration (M2–M5 in one massive PR). A coordinated deprecation wave (withNx, webpack/rspack helpers, vite helpers, SCAM generators, ESLint v8) swept across multiple owners — this is deliberate API-surface cleanup ahead of RC. On the Ocean side, **@vsavkin** drove a comprehensive BOM indexing redesign for Polygraph (8+ PRs), **@MaxKless** shipped a full redesign of the agent log view plus a session management overhaul, **@nartc** completed the OAuth device-login + credential storage flow, and **@Cammisuli** systematically fixed Windows support across the Polygraph CLI. **@StalkAltan** continued hardening DTE v2 reliability (6 backend fixes). **@lourw** and **@bcabanes** advanced the add-ons system on both API and UI sides.

---

## nrwl/nx

### @leosvelperez — Agentic `nx migrate` sprint, complete (12 merged)

Closed out the in-flight agentic migrate feature that was 5 open PRs last week, plus additional scope.

**`nx migrate` overhaul:**

| PR | Title |
|----|-------|
| [#35888](https://github.com/nrwl/nx/pull/35888) | feat(core): add JSON schema for migrations.json files |
| [#35889](https://github.com/nrwl/nx/pull/35889) | fix(core): pre-authorize agentic handoff writes and consult user before failing a step |
| [#35884](https://github.com/nrwl/nx/pull/35884) | fix(core): respect `--no-interactive` across all nx migrate prompts |
| [#35874](https://github.com/nrwl/nx/pull/35874) | fix(core): disallow `nx migrate --interactive` for Nx v23+ targets |
| [#35831](https://github.com/nrwl/nx/pull/35831) | feat(core): add a migrate configuration section to `nx.json` |
| [#35830](https://github.com/nrwl/nx/pull/35830) | fix(core): gate `nx migrate` first-party/third-party modes to Nx v23+ targets |
| [#35835](https://github.com/nrwl/nx/pull/35835) | feat(core): feed migration docs to agents in `nx migrate` |
| [#35822](https://github.com/nrwl/nx/pull/35822) _(bot)_ | feat(core): support prompt-only and hybrid migrations in Nx Console UI |

**Additional:**

| PR | Title |
|----|-------|
| [#35876](https://github.com/nrwl/nx/pull/35876) | fix(js): align tsconfig include/exclude inputs inference with TypeScript behavior |
| [#35834](https://github.com/nrwl/nx/pull/35834) | fix(core): support local plugins using NodeNext `.js` import specifiers |
| [#35671](https://github.com/nrwl/nx/pull/35671) | fix(vite): enforce multi-version support windows for `@nx/vite` and `@nx/vitest` |
| [#35622](https://github.com/nrwl/nx/pull/35622) | fix(core): read pod cgroup limits instead of node limits in resource metrics |
| [#35588](https://github.com/nrwl/nx/pull/35588) | feat(testing)!: remove deprecated `skipSetupFile` and `setupFile` jest options |
| [#35844](https://github.com/nrwl/nx/pull/35844) | feat(angular): drop support for Angular v19 |
| [#35887](https://github.com/nrwl/nx/pull/35887) | feat(angular): deprecate SCAM generators |

**Work character:** The `nx migrate` sprint is now fully landed — from JSON schema, through config, interactive gating, agentic authorization, and docs feeding. This is the highest-impact Nx v23 feature this week. The Angular v19 drop and SCAM deprecation are separate but also substantial. Leo had the heaviest Nx output this week by PR count.

---

### @AgentEnder (Craigory Coppola) — CreateNodes rename + dotnet graduation (8 merged)

| PR | Title |
|----|-------|
| [#35386](https://github.com/nrwl/nx/pull/35386) | feat(core)!: rename CreateNodes V2 types to canonical OG names |
| [#35893](https://github.com/nrwl/nx/pull/35893) | feat(core): add migrations for createNodesV2 → createNodes rename |
| [#35895](https://github.com/nrwl/nx/pull/35895) | fix(dotnet)!: graduate `@nx/dotnet` — drop experimental banner and `/plugin` export |
| [#35892](https://github.com/nrwl/nx/pull/35892) | fix(core): respect `NX_PREFER_TS_NODE` over native type stripping |
| [#35883](https://github.com/nrwl/nx/pull/35883) | feat(devkit)!: deprecate the `standalone` parameter of `addProjectConfiguration` |
| [#35858](https://github.com/nrwl/nx/pull/35858) | fix(dotnet): declare `obj` output for publish/pack and track vitest dep spec tsconfig input |
| [#35758](https://github.com/nrwl/nx/pull/35758) | fix(testing): enforce jest 29-30 multi-version compliance for `@nx/jest` |
| [#35845](https://github.com/nrwl/nx/pull/35845) | fix(vue): multi-version support compliance for `@nx/vue` and `@nx/nuxt` |

**Work character:** Two large items: the CreateNodes V2 → canonical rename (#35386 had been open a long time; it's a breaking public API change) plus `@nx/dotnet` graduation from experimental. Both carry `!` breaking flags. The remaining PRs are compliance sweep work and followups. High-impact week.

---

### @FrozenPandaz — Repo infrastructure + daemon + DTE (15 merged)

The largest PR-count contributor on Nx this week, spread across infrastructure, bug fixes, and beta bumps.

**Local dist-build migration (the big one):**

| PR | Title |
|----|-------|
| [#35785](https://github.com/nrwl/nx/pull/35785) | fix(repo)!: migrate remaining first-party plugins to local dist build (M2–M5) |

**Daemon / task execution:**

| PR | Title |
|----|-------|
| [#35705](https://github.com/nrwl/nx/pull/35705) | fix(core): keep daemon alive when a recompute's plugin load fails |
| [#35859](https://github.com/nrwl/nx/pull/35859) | fix(core): forward full task graph to batch executors under DTE |
| [#35866](https://github.com/nrwl/nx/pull/35866) | fix(core): use workspace package manager when fetching migrations via install |

**Bug fixes:**

| PR | Title |
|----|-------|
| [#35860](https://github.com/nrwl/nx/pull/35860) | fix(misc): multi-version compliance for rollup, webpack, and module-federation |
| [#35886](https://github.com/nrwl/nx/pull/35886) | fix(misc): publish migration prompt files and report the real migrate fetch error |
| [#35869](https://github.com/nrwl/nx/pull/35869) | fix(angular-rspack): dispose stylesheet bundler so one-shot builds exit |
| [#35899](https://github.com/nrwl/nx/pull/35899) | fix(remix): correct migration implementation path for flat-build packages |
| [#35897](https://github.com/nrwl/nx/pull/35897) | fix(repo): use `import type` for type-only `@nx/devkit` imports in copy-assets |
| [#35880](https://github.com/nrwl/nx/pull/35880) | fix(repo): set workspace-plugin type to module to silence Node strip-types warning |
| [#35896](https://github.com/nrwl/nx/pull/35896) | fix(react-native): fix TS2742 build error and retarget rollup/webpack migrations |

**Housekeeping:**

| PR | Title |
|----|-------|
| [#35847](https://github.com/nrwl/nx/pull/35847) | chore(repo): bump default Node.js version to 26.3.0 |
| [#35894](https://github.com/nrwl/nx/pull/35894) | chore(repo): bump workspace-plugin version and fix FreeBSD release |
| [#35898](https://github.com/nrwl/nx/pull/35898) | chore(repo): update nx to 23.0.0-beta.24 |
| [#35303](https://github.com/nrwl/nx/pull/35303) | chore(testing): speed up and stabilize the e2e suite |

**Work character:** Classic Philip week — the single large item (M2–M5 local dist migration) is the strategic work; the rest is a reliable stream of fixes and housekeeping. The Node.js 26.3.0 bump is worth noting — changes the default shipped with Nx.

---

### @jaysoo — Deprecations + docs (8 merged)

| PR | Title |
|----|-------|
| [#35867](https://github.com/nrwl/nx/pull/35867) | feat(webpack)!: deprecate webpack/rspack config compose helpers |
| [#35664](https://github.com/nrwl/nx/pull/35664) | feat(vite)!: deprecate `nxViteTsPaths` and `nxCopyAssetsPlugin` helpers |
| [#35861](https://github.com/nrwl/nx/pull/35861) | feat(nextjs)!: deprecate `withNx` function |
| [#35870](https://github.com/nrwl/nx/pull/35870) | fix(nextjs): multi-version support compliance (NXC-4395) |
| [#35872](https://github.com/nrwl/nx/pull/35872) | fix(react): multi-version support compliance (NXC-4399) |
| [#35871](https://github.com/nrwl/nx/pull/35871) | docs(nx-dev): show spread token for extending target defaults |
| [#35864](https://github.com/nrwl/nx/pull/35864) | docs(nx-cloud): mark Manual DTE as an Enterprise-only feature |
| [#35857](https://github.com/nrwl/nx/pull/35857) | docs(nx-cloud): add platform pages for Nx Cloud add-ons |

**Work character:** Three deprecation `!` PRs in a week signals this is a coordinated effort — webpack/rspack helpers, vite helpers, and withNx all deprecated together. Paired with the SCAM and ESLint v8 deprecations from leosvelperez/bot, this is a meaningful API cleanup push before v23 RC. Also light on docs for Nx Cloud's add-ons and Enterprise positioning.

---

### @meeroslav — Docs + release fix (3 merged)

| PR | Title |
|----|-------|
| [#35741](https://github.com/nrwl/nx/pull/35741) | docs(nx-dev): determinism requirement for inferred plugins |
| [#35842](https://github.com/nrwl/nx/pull/35842) | docs(core): fix show target examples |
| [#35841](https://github.com/nrwl/nx/pull/35841) | fix(release): require docker config for docker versioning |

**Work character:** Two docs fixes and one targeted release executor fix. Light week on Nx — primary output is in Ocean (see below).

---

### @juristr — Docs (2 merged)

| PR | Title |
|----|-------|
| [#35878](https://github.com/nrwl/nx/pull/35878) | docs(module-federation): add Vite Module Federation example page |
| [#35890](https://github.com/nrwl/nx/pull/35890) | docs(misc): relink automate-updating-dependencies in sidebar |

**Work character:** Docs contributions only on Nx this week; most of Juri's output is in Ocean/Polygraph.

---

### @cogwirrel — Core UX (1 merged)

| PR | Title |
|----|-------|
| [#35827](https://github.com/nrwl/nx/pull/35827) | feat(core): add `--trustThirdPartyPreset` flag to skip confirmation prompt |

**Work character:** Single focused feature for preset trust flow. Clean.

---

### @polygraph-snapshot-app[bot] — Compliance + ESLint v8 deprecation (3 merged)

| PR | Title |
|----|-------|
| [#35799](https://github.com/nrwl/nx/pull/35799) | fix(angular): bump zoneJsVersion to ~0.16.0 to align with Angular v21 |
| [#35807](https://github.com/nrwl/nx/pull/35807) | fix(misc): multi-version compliance for `@nx/express`, `@nx/node`, and `@nx/nest` |
| [#35819](https://github.com/nrwl/nx/pull/35819) | feat(linter): deprecate ESLint v8 support |

---

### Community contributions (4 merged)

| Author | PR | Title |
|--------|----|-------|
| @aqeelat | [#35539](https://github.com/nrwl/nx/pull/35539) | fix(js): use TypeScript `readConfigFile` instead of `JSON.parse` in `resolvePathsBaseUrl` |
| @olagokemills | [#35782](https://github.com/nrwl/nx/pull/35782) | fix(js): handle already-published version errors in `release-publish` executor |
| @zanlucathiago | [#35323](https://github.com/nrwl/nx/pull/35323) | fix(release): scope fallback to project history for new packages |
| @thdk | [#35405](https://github.com/nrwl/nx/pull/35405) | fix(release): skip expensive changelog operations when changelogs are disabled |
| @llwt | [#35141](https://github.com/nrwl/nx/pull/35141) | fix(js): support auto mode for non-pnpm lock files in affected detection |
| @cw-alexcroteau | [#35793](https://github.com/nrwl/nx/pull/35793) | perf(core): avoid redundant rematch in `findMatchingConfigFiles` |

---

## nrwl/ocean

### @vsavkin — Polygraph BOM indexing overhaul (13 merged)

Victor's entire week was on one large feature area: making Polygraph's repository BOM (Bill of Materials) indexing production-ready.

**BOM indexing foundation:**

| PR | Title |
|----|-------|
| [#11632](https://github.com/nrwl/ocean/pull/11632) | feat(polygraph): index private repo BOM from root package.json and lock files |
| [#11639](https://github.com/nrwl/ocean/pull/11639) | fix(polygraph): unify repository indexing status and fix the BOM rescan-wedge |
| [#11640](https://github.com/nrwl/ocean/pull/11640) | fix(nx-api): reduce GitHub rate-limit failures during polygraph BOM rescans |
| [#11641](https://github.com/nrwl/ocean/pull/11641) | feat(polygraph): gate detailed indexing on org-wide BOM baseline and reassure during long rescans |
| [#11664](https://github.com/nrwl/ocean/pull/11664) | fix(polygraph): drain full org on re-index by cutting BOM staleness at rescan start |
| [#11622](https://github.com/nrwl/ocean/pull/11622) | feat(polygraph): make detailed-indexing scan limit a per-org setting |
| [#11610](https://github.com/nrwl/ocean/pull/11610) | feat(nx-cloud): tiered polygraph repository indexing |
| [#11633](https://github.com/nrwl/ocean/pull/11633) | fix(polygraph): commit onboarding writes before arming indexing rescan |
| [#11656](https://github.com/nrwl/ocean/pull/11656) | perf(nx-api): run OSS/repository BOM indexing in a detached coroutine |

**Supporting reliability:**

| PR | Title |
|----|-------|
| [#11677](https://github.com/nrwl/ocean/pull/11677) | fix(nx-api): treat GitHub 429 on OSS BOM scans as a soft retry, not an error |
| [#11594](https://github.com/nrwl/ocean/pull/11594) | fix(polygraph): fail PR lookup when org GitHub credentials are missing |
| [#11645](https://github.com/nrwl/ocean/pull/11645) | fix(polygraph): set merged pipeline secrets as env vars on indexing workflow |
| [#11671](https://github.com/nrwl/ocean/pull/11671) | fix(polygraph): count a repo as indexing-failed only when it has no index |
| [#11659](https://github.com/nrwl/ocean/pull/11659) | feat(nx-api): skip custom workflow scheduler in local development |
| [#11660](https://github.com/nrwl/ocean/pull/11660) | fix(polygraph): soften repository graph freshness banner copy |

**Work character:** This is a large, planned feature sprint — private-repo BOM scanning, tiered indexing, org-wide baselines, per-org limits, and a coroutine perf fix all landed together. Victor shipped nothing outside this area. The breadth (backend rate-limit handling, status unification, rescan logic, onboarding ordering) suggests this was a multi-week effort wrapping up.

---

### @MaxKless — Polygraph agent log view redesign + session management (17 merged)

The most PRs of anyone in Ocean this week. Two workstreams:

**Agent log view redesign:**

| PR | Title |
|----|-------|
| [#11661](https://github.com/nrwl/ocean/pull/11661) | feat(polygraph): redesign agent Log view stream feed |
| [#11685](https://github.com/nrwl/ocean/pull/11685) | feat(polygraph): log visibility controls |
| [#11665](https://github.com/nrwl/ocean/pull/11665) | feat(polygraph): surface reasoning duration & token metadata on thinking log entries |
| [#11654](https://github.com/nrwl/ocean/pull/11654) | fix(polygraph): pair parallel tool calls with their results in agent session logs |
| [#11662](https://github.com/nrwl/ocean/pull/11662) | fix(polygraph): render skill loads as one collapsible entry across all harnesses |
| [#11578](https://github.com/nrwl/ocean/pull/11578) | feat(polygraph): capture OpenCode parent logs |
| [#11647](https://github.com/nrwl/ocean/pull/11647) | fix(polygraph): redact secrets before log upload |

**Session management:**

| PR | Title |
|----|-------|
| [#11648](https://github.com/nrwl/ocean/pull/11648) | feat(polygraph): rename session `cd` command to `session dir`, `--path` to `--print` |
| [#11670](https://github.com/nrwl/ocean/pull/11670) | feat(polygraph): trust session launch folder by default (NXA-1511) |
| [#11683](https://github.com/nrwl/ocean/pull/11683) | feat(polygraph): validate session start names on create |
| [#11655](https://github.com/nrwl/ocean/pull/11655) | fix(polygraph): let enter resume the highlighted row while filtering |

**Other:**

| PR | Title |
|----|-------|
| [#11669](https://github.com/nrwl/ocean/pull/11669) | fix(polygraph-cli): update claude plugin instead of purging its cache |
| [#11687](https://github.com/nrwl/ocean/pull/11687) | chore(polygraph-cli): distribute the CLI via Homebrew |
| [#11612](https://github.com/nrwl/ocean/pull/11612) | chore: migrate polygraph plugin references to the `@polygraph` scope |
| [#11611](https://github.com/nrwl/ocean/pull/11611) | test(polygraph): cover claude partial project dir lookup |

**Work character:** The log-view redesign is the anchor feature — this is the primary surface users see during agent sessions. The visibility controls, metadata surfacing, and parallel-tool-call pairing are all part of making the experience more debuggable. Homebrew distribution is a notable milestone for the CLI.

---

### @nartc (Chau) — Polygraph OAuth + core reliability (12 merged)

**OAuth feature (complete):**

| PR | Title |
|----|-------|
| [#11658](https://github.com/nrwl/ocean/pull/11658) | feat(polygraph): add oauth device login to CLI |
| [#11605](https://github.com/nrwl/ocean/pull/11605) | feat(polygraph): add oauth credential storage |

**Repository graph + multi-tenancy:**

| PR | Title |
|----|-------|
| [#11642](https://github.com/nrwl/ocean/pull/11642) | feat(polygraph): tier standalone repository graph nodes |
| [#11631](https://github.com/nrwl/ocean/pull/11631) | fix(polygraph): paginate github installation lookups |
| [#11630](https://github.com/nrwl/ocean/pull/11630) | fix(nx-api,polygraph): scope custom workflow env var uniqueness |

**Security:**

| PR | Title |
|----|-------|
| [#11690](https://github.com/nrwl/ocean/pull/11690) | fix(polygraph): do not return full user |
| [#11689](https://github.com/nrwl/ocean/pull/11689) | fix(nx-cloud): do not return user VCS account token and email |

**Stability:**

| PR | Title |
|----|-------|
| [#11638](https://github.com/nrwl/ocean/pull/11638) | fix(polygraph): sync demo tour with polled session data |
| [#11615](https://github.com/nrwl/ocean/pull/11615) | fix(polygraph): stabilize sessions list relative time |
| [#11590](https://github.com/nrwl/ocean/pull/11590) | fix(polygraph): encode session URLs |
| [#11603](https://github.com/nrwl/ocean/pull/11603) | fix(polygraph): require installation before onboarding |
| [#11604](https://github.com/nrwl/ocean/pull/11604) | fix(polygraph): add catchall route |

**Work character:** OAuth device login + credential storage is a complete feature landing. The two security fixes (user data leakage) are notable — look like they were caught in code review or testing rather than a production incident, but worth confirming. The stability fixes feel like pre-release polish.

---

### @StalkAltan (Altan) — DTE v2 reliability (8 merged)

All work on DTE v2 backend reliability.

| PR | Title |
|----|-------|
| [#11710](https://github.com/nrwl/ocean/pull/11710) | fix(nx-api): persist DTE project graph sha on CIPE |
| [#11695](https://github.com/nrwl/ocean/pull/11695) | feat(nx-api): add DTE rollout metrics |
| [#11682](https://github.com/nrwl/ocean/pull/11682) | fix(nx-api): exclude previous agents from reclaim reassignment |
| [#11675](https://github.com/nrwl/ocean/pull/11675) | fix(nx-api): split valkey assignment telemetry span |
| [#11681](https://github.com/nrwl/ocean/pull/11681) | fix(nx-api): avoid stale pool claim release |
| [#11666](https://github.com/nrwl/ocean/pull/11666) | fix(nx-api): fail DTE v2 on terminal task failures |
| [#11591](https://github.com/nrwl/ocean/pull/11591) | test(nx-api): cover eligible waiting-agent wakes |

**Work character:** Altan is in a steady reliability hardening cadence on DTE v2. Several of these fixes (stale pool claim, reclaim reassignment, terminal failures) look like correctness bugs surfacing during rollout, not regressions. The rollout metrics PR suggests DTE v2 is in a controlled rollout phase.

---

### @bcabanes (Benjamin) — nx-cloud UI features + deps (10 merged)

**New features:**

| PR | Title |
|----|-------|
| [#11596](https://github.com/nrwl/ocean/pull/11596) | feat(nx-cloud): add cache hit rate sparkline to task analytics |
| [#11563](https://github.com/nrwl/ocean/pull/11563) | feat(nx-cloud): surface the full task hash with one-click copy |
| [#11618](https://github.com/nrwl/ocean/pull/11618) | feat(nx-cloud): gate the CIPE timeline link, not the route |
| [#11531](https://github.com/nrwl/ocean/pull/11531) | feat(nx-cloud): intro demo |

**Fixes:**

| PR | Title |
|----|-------|
| [#11625](https://github.com/nrwl/ocean/pull/11625) | fix(nx-cloud): keep the critical path connected through cached tasks |
| [#11629](https://github.com/nrwl/ocean/pull/11629) | fix(nx-cloud): correct timeline in-progress status color and wording |
| [#11621](https://github.com/nrwl/ocean/pull/11621) | fix(nx-cloud): use yellow for in-progress timeline status |
| [#11562](https://github.com/nrwl/ocean/pull/11562) | fix(nx-cloud): standardize and stop truncating agent names in the timeline |

**Tooling/deps:**

| PR | Title |
|----|-------|
| [#11597](https://github.com/nrwl/ocean/pull/11597) | fix(deps): patch react-router and @remix-run for June 2026 advisories |
| [#11634](https://github.com/nrwl/ocean/pull/11634) | chore(nx-cloud): prune unused and misclassified dependencies |
| [#11652](https://github.com/nrwl/ocean/pull/11652) | chore(nx-cloud): raise initial JS shell size-limit budget to 600 kB |
| [#11565](https://github.com/nrwl/ocean/pull/11565) | tools(nx-cloud): add bundle-size budget conformance rule |

**Work character:** A steady mix of new nx-cloud product features (cache sparkline, task hash copy) and UI polish/fixes on the CIPE timeline. The security dep patches for react-router/remix were timely. The bundle-size conformance tooling is proactive — suggests the JS shell was approaching its limit.

---

### @Cammisuli (Colum) — Polygraph Windows support sweep (5 merged)

| PR | Title |
|----|-------|
| [#11703](https://github.com/nrwl/ocean/pull/11703) | fix(polygraph): Windows fixes for agent plugin install, .cmd shims, and codex sandbox |
| [#11668](https://github.com/nrwl/ocean/pull/11668) | fix(polygraph): Windows support for the CLI and launched agent sessions |
| [#11635](https://github.com/nrwl/ocean/pull/11635) | fix(polygraph): load CLI bundle on Windows by resolving ripgrep platform lazily |
| [#11702](https://github.com/nrwl/ocean/pull/11702) | fix(polygraph): use new scoped polygraph packages in agent configs |
| [#11637](https://github.com/nrwl/ocean/pull/11637) | chore: bind polygraph dev server to 0.0.0.0 for LAN access |

**Work character:** A deliberate, systematic Windows compatibility push — three PRs hitting different failure modes (.cmd shims, ripgrep bundling, session launch, codex sandbox). This looks like a planned platform-support milestone for Polygraph GA, not reactive bug-fixing.

---

### @rarmatei (Rares) — Sandbox analytics + add-on CTAs (6 merged)

| PR | Title |
|----|-------|
| [#11697](https://github.com/nrwl/ocean/pull/11697) | fix(analytics): server-driven branch typeahead on sandbox violations |
| [#11649](https://github.com/nrwl/ocean/pull/11649) | feat(nx-cloud): add-on previews & CTAs for sandboxing and resource usage |
| [#11688](https://github.com/nrwl/ocean/pull/11688) | fix(nx-cloud): restore add-on row anchor IDs in the grouped add-ons layout |
| [#11619](https://github.com/nrwl/ocean/pull/11619) | fix(nx-cloud): restore sandbox violations AI banner on CIPE page |
| [#11608](https://github.com/nrwl/ocean/pull/11608) | fix(io-trace): kill phantom sandbox write violations from stale fork-inherited fds |
| [#11644](https://github.com/nrwl/ocean/pull/11644) | fix(local-dev): self-heal snapshot port-forward on drop |

**Work character:** Mix of analytics reliability (branch typeahead), add-ons CTAs, and io-trace correctness. The phantom sandbox violation fix is notable — stale file descriptors from forked processes producing false violation reports is a correctness bug that would confuse customers.

---

### @lourw (Lauren) — Add-ons system (4 merged)

| PR | Title |
|----|-------|
| [#11679](https://github.com/nrwl/ocean/pull/11679) | feat(nx-cloud): automated add-ons v2 + admin management |
| [#11624](https://github.com/nrwl/ocean/pull/11624) | feat(nx-api): add plan add-on provision endpoint forwarding to provision-tenant webhook |
| [#11598](https://github.com/nrwl/ocean/pull/11598) | feat(nx-api): restrict manual DTE to Enterprise for new workspaces |
| [#11595](https://github.com/nrwl/ocean/pull/11595) | fix(nx-api): resolve invalidated sandbox hashes in DTE status |

**Work character:** Continuing the add-ons/billing system build from last week. Automated add-ons v2 is the centrepiece; the restriction of manual DTE to Enterprise is a significant go-to-market decision encoded in code.

---

### @juristr (Juri) — Polygraph UX (5 merged)

| PR | Title |
|----|-------|
| [#11651](https://github.com/nrwl/ocean/pull/11651) | feat(polygraph): render session description as markdown with clickable links |
| [#11607](https://github.com/nrwl/ocean/pull/11607) | refactor(polygraph): extract demo tour flow |
| [#11614](https://github.com/nrwl/ocean/pull/11614) | feat(polygraph): default 'View all sessions' to current user |
| [#11672](https://github.com/nrwl/ocean/pull/11672) | fix(polygraph): add spacing between spinner and label on connect button |

**Work character:** Light, targeted UX improvements to Polygraph's session UI. Demo tour refactor is likely prep for upcoming demo work.

---

### @nixallover — nx-cloud UX (3 merged)

| PR | Title |
|----|-------|
| [#11531](https://github.com/nrwl/ocean/pull/11531) | feat(nx-cloud): intro demo |
| [#11600](https://github.com/nrwl/ocean/pull/11600) | feat(nx-cloud): add a GitHub PAT option to the connect-workspace flow |
| [#11636](https://github.com/nrwl/ocean/pull/11636) | feat(nx-cloud): make agent resource usage rows link to reports |
| [#11601](https://github.com/nrwl/ocean/pull/11601) | fix(nx-cloud): encrypt the GitLab PAT so it never rides in the URL |

**Work character:** The GitLab PAT encryption fix is a security fix that should have been there from the start — confirm it was never exposed in production logs. GitHub PAT option in connect flow extends connectivity options. Intro demo aligns with bcabanes's demo work.

---

### @meeroslav (Miroslav) — Hash detail logging (3 merged)

| PR | Title |
|----|-------|
| [#11579](https://github.com/nrwl/ocean/pull/11579) | feat(nx-cloud): print non-V4 distributed task hash details |
| [#11572](https://github.com/nrwl/ocean/pull/11572) | feat(nx-cloud): log task hash details during distribution |
| [#11606](https://github.com/nrwl/ocean/pull/11606) | feat: cherry pick hash detail logging to 2026.04 |

**Work character:** Focused on hash detail logging for task distribution — looks like a debugging/observability improvement for diagnosing cache misses in DTE.

---

### @JamesHenry (James) — Polygraph polish (2 merged)

| PR | Title |
|----|-------|
| [#11653](https://github.com/nrwl/ocean/pull/11653) | fix(polygraph): use real Linear mark for linked-reference icon |
| [#11650](https://github.com/nrwl/ocean/pull/11650) | fix(polygraph): skip wordmark when stdout is not a TTY |

**Work character:** Two small polish fixes. James is likely doing broader code review / untracked work beyond these.

---

### @mrl-jr — Polygraph PostHog tracking (2 merged)

| PR | Title |
|----|-------|
| [#11602](https://github.com/nrwl/ocean/pull/11602) | feat(polygraph): set up basic tracking for polygraph app in PostHog |
| [#11617](https://github.com/nrwl/ocean/pull/11617) | fix(polygraph): pre-release UI tweaks |

**Work character:** Analytics instrumentation landed. First PostHog integration for the Polygraph app.

---

## Needs Your Attention

### 1. CreateNodes V2 → canonical names: breaking change landed — is the migration story ready?
**@AgentEnder** merged [#35386](https://github.com/nrwl/nx/pull/35386) — the rename of all CreateNodes V2 types to their canonical original names. This is one of the most-impactful public API changes in Nx v23 for third-party plugin authors. Migrations landed in [#35893](https://github.com/nrwl/nx/pull/35893). Check that the migration guide, changelog entry, and third-party plugin outreach are ready before this is in an RC.

### 2. Coordinated deprecation wave — communications plan?
Five separate `!` deprecation PRs landed this week across `withNx` (Next.js), webpack/rspack compose helpers, vite helpers, SCAM generators (Angular), and ESLint v8. This is a significant API surface cleanup. If these aren't announced together in a blog post or migration guide before RC, users will encounter them as a pile of warnings with no narrative. Is the comms / docs work scheduled?

### 3. DTE v2 is in a controlled rollout — when is it GA?
**@StalkAltan** merged "add DTE rollout metrics" [#11695](https://github.com/nrwl/ocean/pull/11695) — instrumentation that's typically added to monitor a phased rollout, not a launched feature. The steady stream of correctness fixes (stale pool claims, reclaim reassignment, terminal failures) suggests DTE v2 is encountering real-world edge cases. What's the GA timeline, and is there a rollback gate?

### 4. GitLab PAT rode in URLs — was it logged in production?
**@nixallover** fixed [#11601](https://github.com/nrwl/ocean/pull/11601): encrypting the GitLab PAT "so it never rides in the URL." If this was exploitable since the feature shipped, the token may be in server access logs or browser history for affected customers. Worth a quick review of when the connect-workspace flow was released and whether any tokens need rotating.

### 5. Manual DTE restricted to Enterprise for new workspaces — is this communicated?
**@lourw** merged [#11598](https://github.com/nrwl/ocean/pull/11598). Existing free/pro users who rely on manual DTE won't be affected (new workspaces only), but this is a go-to-market gate that affects onboarding. Is this in the docs and pricing page?

### 6. PostHog tracking shipped in Polygraph — privacy disclosure?
**@mrl-jr** landed [#11602](https://github.com/nrwl/ocean/pull/11602): PostHog tracking for the Polygraph app. This is the first analytics instrumentation there. Confirm it's covered by the existing privacy policy and consent flow (especially given that Polygraph handles code and repo data).

### 7. Node.js default bumped to 26.3.0
**@FrozenPandaz** bumped [#35847](https://github.com/nrwl/nx/pull/35847). Node 26 is current but relatively new. Confirm this is intentional and that the release pipeline / Docker images are updated accordingly.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-06-01 to 2026-06-07_
