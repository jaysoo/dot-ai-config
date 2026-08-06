# Weekly Work Report — Week of July 27–August 2, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-07-27 and 2026-08-02._

---

## TL;DR

Nx merged 29 PRs, concentrated in three people plus a growing automation footprint. **@FrozenPandaz** merged 11 — a dependency/lockfile hardening pass (pnpm, npm peer-pruning, typescript-7 hoisting) and a third consecutive week of tuning the team's own AI PR-review pipeline (trim carry-forward, verify findings against the PR's Polygraph session, cut duplicated verification work). One fix (npm temp-install over-pruning real dependencies) was significant enough to get an immediate backport to the `22.7.x` release line the same day. **@jaysoo** merged 5, split between two dependency-CVE patches (axios/brace-expansion) and a module-federation packaging fix that follows the same optional-peer pattern applied to `@nx/angular` two weeks ago. **@leosvelperez** merged 4, headlined by a second installment of the migrate-execution-engine feature (`--run-migration`, part 2 of a 3-PR stack) and a critical `seroval`/`nuxt` deserialization CVE patched same-day. Six of the 29 nx PRs were bot/agent-authored: three `claude[bot]` PRs (a Claude-Code-driven ESM-resolution fix and two publish-pipeline Slack-notification tweaks) and three routine Polygraph-app migration/dependency PRs.

Ocean merged 114 PRs — 10 routine automated version-plan-cleanup, 104 human/agent-authored. **@MaxKless** merged 20, all one continuing arc: Polygraph's session-relatedness and implicit-sessions feature, now adding a code-change backfill for newly-connected repos, human+agent rating tools, an eval playground, and instrumentation for the whole ingestion pipeline. **@AI-JamesHenry** merged 12, mostly mechanical — five back-to-back Claude Agent SDK version bumps (0.2.71 → 0.2.75) plus PostHog funnel repair work and demo-walkthrough telemetry, alongside a same-week "stop shipping the Claude Agent SDK" PR (see Needs Your Attention). **@nixallover** merged 11, split between growth/onboarding features (onboarding survey, plan-cancellation survey) and three separate dependency-CVE fixes. **@lourw** and **@StalkAltan** each merged 9: lourw drove the entire "Resource Usage" paid add-on from workspace toggle through default-on rollout to Hobby/OSS availability to immediate-cancellation billing rework; StalkAltan's scheduling-constraints feature shipped mid-week and caused a production performance regression that StalkAltan then fixed two days later (see Needs Your Attention). **@bcabanes** merged 8 continuing nx-cloud run/CIPE navigation polish, **@barbados-clemens** merged 6 continuing last week's new Data API (query-param filtering, relation links, bounded summaries, swagger UI removed), and **@vsavkin** merged 3 including a large Polygraph architecture change enabling multiple agents per repository. Five more contributors (**@mrl-jr**, **@rarmatei**, **@nartc**, **@meeroslav**, **@jaysoo**, **@JamesHenry**, **@Cammisuli**) each merged 3–5 PRs continuing their respective tracks from recent weeks. It was an unusually heavy dependency-security week: 9 separate CVE/advisory-remediation PRs landed across both repos.

---

## nrwl/nx

### @FrozenPandaz — Dependency/lockfile hardening, PR-review pipeline tuning (11 merged)

**Dependency and lockfile fixes:**

| PR | Title |
|----|-------|
| [#36479](https://github.com/nrwl/nx/pull/36479) | fix(js): resolve the verdaccio bin through its package.json |
| [#36493](https://github.com/nrwl/nx/pull/36493) | fix(repo): serialize cypress installs and skip the binary when unused |
| [#36495](https://github.com/nrwl/nx/pull/36495) | fix(core): make tui cloud icon visible on light terminal themes |
| [#36496](https://github.com/nrwl/nx/pull/36496) | fix(devkit): resolve ensurePackage against the workspace |
| [#36497](https://github.com/nrwl/nx/pull/36497) | fix(core): pin typescript in preset dependencies so npm cannot hoist typescript 7 |
| [#36512](https://github.com/nrwl/nx/pull/36512) | fix(core): parse pnpm lockfiles that omit the packages block |
| [#36518](https://github.com/nrwl/nx/pull/36518) | fix(core): keep real dependencies when omitting peers from npm temp installs |
| [#36523](https://github.com/nrwl/nx/pull/36523) | fix(core): keep real dependencies when omitting peers from npm temp installs (22.7.x backport) |

**PR-review pipeline tuning (third consecutive week):**

| PR | Title |
|----|-------|
| [#36494](https://github.com/nrwl/nx/pull/36494) | chore(repo): trim review-pr carry-forward and pin review agent models |
| [#36525](https://github.com/nrwl/nx/pull/36525) | chore(repo): verify review-pr findings against the PR's polygraph session |
| [#36534](https://github.com/nrwl/nx/pull/36534) | chore(repo): cut duplicated verification work in the review-pr skill |

**Work character:** #36518 fixes a regression from the prior week's `--omit=peer` change: npm flags a package as a peer if *anything* in the tree peer-depends on it, so the flag was silently pruning genuine dependencies too (e.g. `@nx/detox` losing its hard dependency on `@nx/jest`) with no warning and exit code 0. Switched to `--legacy-peer-deps`, which ignores peer resolution without over-pruning; verified against a real npm install showing the missing packages return. Because the affected flag hadn't shipped in a release yet, FrozenPandaz backported the identical fix to `22.7.x` same-day (#36523) to close the window before the next patch release. #36494/#36525/#36534 continue calibrating the team's AI-driven PR-review pipeline (last week's tuning was prompted by a case where it approved something a human maintainer later requested changes on) — this week's changes trim what carries forward between review passes, cross-check findings against the PR's own Polygraph session transcript, and remove duplicated verification work between passes.

---

### @jaysoo (Jay) — Dependency CVE patches, module-federation packaging fix (5 merged)

| PR | Title |
|----|-------|
| [#36459](https://github.com/nrwl/nx/pull/36459) | docs(misc): capture seo keyword opportunities from ahrefs export |
| [#36462](https://github.com/nrwl/nx/pull/36462) | docs(misc): add polyrepo to monorepo migration guide |
| [#36492](https://github.com/nrwl/nx/pull/36492) | fix(react): make module federation packages optional peer dependencies |
| [#36505](https://github.com/nrwl/nx/pull/36505) | fix(docker): run release pipeline docker commands without a shell |
| [#36507](https://github.com/nrwl/nx/pull/36507) | fix(core): bump pinned axios and brace-expansion past vulnerable versions |

**Work character:** #36492 (825/-122, 29 files) removes `@nx/module-federation`, `express`, `http-proxy-middleware`, and `@svgr/webpack` as forced direct dependencies of `@nx/react` — workspaces on esbuild, Vite, or Rspack were installing all of it and never using it, and a version mismatch between `@nx/module-federation`'s pinned webpack and `@nx/webpack`'s floating range was breaking Module Federation builds outright. Same shape as the `@nx/angular` fix from two weeks ago; a 23.2.0 migration backfills the packages for workspaces that actually need them. #36507 is a same-day dependency-CVE patch (axios and brace-expansion, both flagged by July 2026 advisories) — no source changes, version bumps plus a pnpm override so transitive copies resolve patched too.

---

### @leosvelperez (Leo) — Migrate-engine feature (part 2), critical seroval CVE (4 merged)

| PR | Title |
|----|-------|
| [#36271](https://github.com/nrwl/nx/pull/36271) | fix(js): resolve package and extension-less tsconfig extends read from the tree |
| [#36407](https://github.com/nrwl/nx/pull/36407) | feat(core): add nx migrate --run-migration to run a single migration |
| [#36454](https://github.com/nrwl/nx/pull/36454) | chore(repo): stop eslint linting json files with no applicable rules |
| [#36522](https://github.com/nrwl/nx/pull/36522) | chore(repo): patch critical seroval advisory via nuxt bump and override |

**Work character:** #36407 (4,722/-389, 33 files, open 11.3 days) is "part 2 of 3" in the migrate-execution-engine stack that started with last week's engine extraction (#36404, merged). It adds `nx migrate --run-migration=` to run a single migration from `migrations.json` instead of the whole list — generator migrations run through the new engine with checkpoint-then-commit semantics, prompt-based migrations emit a tagged block for a driving AI agent, and hybrid migrations carry generator output into the prompt half. The PR body documents an extensive version-skew guard so an older nx silently falling into the plan phase (re-bumping package.json instead of running the migration) can't happen across the two-hop wrapper handoff. Part 3 (durable run state) stacks on top, not yet merged. #36522 patches GHSA-mv8w-475r-vwqw (critical seroval deserialization) same-day — two independent vulnerable paths (nuxt's vite-builder and a solid-js transitive dependency reached via the `ai` package) each needed a different fix shape (a devDependency pin for one, a pnpm override for the other) because neither could be resolved by a single version bump.

---

### @barbados-clemens and @lourw — Docs (3 merged)

| Contributor | PR | Title |
|---|---|---|
| @barbados-clemens | [#36399](https://github.com/nrwl/nx/pull/36399) | docs(misc): audit inferred plugin options and behavior across technology pages |
| @barbados-clemens | [#36513](https://github.com/nrwl/nx/pull/36513) | docs(misc): apply review feedback on inferred task wording |
| @lourw | [#36417](https://github.com/nrwl/nx/pull/36417) | docs(nx-cloud): document start-nx-agents and the .nx/ci-config.yaml file |

---

### Automation (6 merged)

| Contributor | PR | Title |
|---|---|---|
| claude[bot] | [#36476](https://github.com/nrwl/nx/pull/36476) | fix(rspack): lazy-load @rspack/core in create-compiler to avoid eager ESM resolution |
| claude[bot] | [#36502](https://github.com/nrwl/nx/pull/36502) | chore(repo): improve publish workflow slack notifications for reviewers and threaded status updates |
| claude[bot] | [#36528](https://github.com/nrwl/nx/pull/36528) | chore(repo): react to publish approval instead of a threaded Slack reply |
| polygraph-snapshot-app[bot] | [#36458](https://github.com/nrwl/nx/pull/36458) | fix(core): avoid bogus duplicate project name errors when generating nested apps |
| polygraph-app[bot] | [#36482](https://github.com/nrwl/nx/pull/36482) | fix(repo): drop stale e2e dependsOn overrides that omit the local registry |
| polygraph-app[bot] | [#36529](https://github.com/nrwl/nx/pull/36529) | chore(repo): migrate to nx 23.2.0-beta.4 |

**Work character:** The three `claude[bot]` PRs are Claude-Code-driven fixes and internal publish-pipeline tooling merged on behalf of a maintainer running the session, not community contributions. The two publish-workflow PRs (#36502, #36528) are iterative refinement of the same release-notification mechanism within one week.

---

## nrwl/ocean

_10 additional PRs this week were automated `github-actions[bot]` "clean up version plans from X release" housekeeping — routine changelog cleanup, omitted below as not narrative-worthy._

### @MaxKless (Max) — Session-relatedness/implicit-sessions feature arc (20 merged)

**Feature track:**

| PR | Title |
|----|-------|
| [#12437](https://github.com/nrwl/ocean/pull/12437) | feat(polygraph): backfill code changes for newly connected repos |
| [#12532](https://github.com/nrwl/ocean/pull/12532) | feat(polygraph): internal session-relatedness rating tools (human + agent) |
| [#12533](https://github.com/nrwl/ocean/pull/12533) | feat(polygraph): implicit sessions as first-class graph sources |
| [#12534](https://github.com/nrwl/ocean/pull/12534) | feat(polygraph): relatedness ratings-eval tab in the search playground |
| [#12566](https://github.com/nrwl/ocean/pull/12566) | feat(polygraph): rate implicit sessions in the relatedness eval |
| [#12588](https://github.com/nrwl/ocean/pull/12588) | feat(polygraph): implicit sessions as first-class graph sources (content-time relatedness) |
| [#12609](https://github.com/nrwl/ocean/pull/12609) | feat(playground): log-cleaning variants, separate log leg, and learned-weights ML |
| [#12637](https://github.com/nrwl/ocean/pull/12637) | feat(polygraph): gate implicit-session suppression on org maturity, behind a toggle |
| [#12650](https://github.com/nrwl/ocean/pull/12650) | feat(polygraph): manual deepen backfill for the session graph |
| [#12664](https://github.com/nrwl/ocean/pull/12664) | feat(polygraph): keep the session graph live while history imports |

**Instrumentation and fixes:**

| PR | Title |
|----|-------|
| [#12508](https://github.com/nrwl/ocean/pull/12508) | fix(polygraph): finalize sidecars when the parent exits |
| [#12555](https://github.com/nrwl/ocean/pull/12555) | feat(polygraph): instrument session relatedness cache and graph compute |
| [#12605](https://github.com/nrwl/ocean/pull/12605) | fix(polygraph): classify session codenames by dictionary, not title shape |
| [#12606](https://github.com/nrwl/ocean/pull/12606) | feat(polygraph): name background sessions from the task via Haiku |
| [#12610](https://github.com/nrwl/ocean/pull/12610) | feat(polygraph): instrument code-change ingestion, backfill, and embeddings |
| [#12613](https://github.com/nrwl/ocean/pull/12613) | fix(polygraph): reconcile vector search index definitions in the aggregator |
| [#12634](https://github.com/nrwl/ocean/pull/12634) | fix(polygraph): skip the relatedness bump for backfill batches that stored nothing |
| [#12639](https://github.com/nrwl/ocean/pull/12639) | fix(polygraph): make the related-sessions help tooltip render |
| [#12641](https://github.com/nrwl/ocean/pull/12641) | fix(polygraph): retry transient embedding provider failures |
| [#12666](https://github.com/nrwl/ocean/pull/12666) | fix(polygraph): one voice for a started import, and say what unconnected means |

**Work character:** #12437 (1,963/-37, 26 files) is the onboarding-facing half of this arc — when a repo connects to a Polygraph org, its last week of default-branch history (up to 50 commits) now backfills through the code-change pipeline immediately, rather than waiting for new pushes. It's also the *only* ingestion channel for PAT-connected orgs, which get no push webhooks. The PR documents a `writeVersion` compare-and-swap to converge concurrent writes when a backfill batch and a live webhook race on the same record. #12610 (687/-17, 7 files) is measurement-only instrumentation for that pipeline, explicitly built because every failure mode in it is currently silent (a rate limit returns normally, a failed upsert is swallowed, a failed backfill batch just gets reopened for a later sweep) — without counters, none of that discarded work was visible anywhere. This is the fourth consecutive week MaxKless has driven the session-relatedness/implicit-sessions feature; it's now maturing into eval tooling and instrumentation rather than new surface area.

---

### @AI-JamesHenry — Claude Agent SDK version bumps, PostHog funnel repair (12 merged)

**Claude Agent SDK version bumps (5 in one week):**

| PR | Title |
|----|-------|
| [#12640](https://github.com/nrwl/ocean/pull/12640) | chore: upgrade Claude Agent SDK to 0.2.71 |
| [#12642](https://github.com/nrwl/ocean/pull/12642) | chore: upgrade Claude Agent SDK to 0.2.72 |
| [#12646](https://github.com/nrwl/ocean/pull/12646) | chore: upgrade Claude Agent SDK to 0.2.73 |
| [#12665](https://github.com/nrwl/ocean/pull/12665) | chore: upgrade Claude Agent SDK to 0.2.74 |
| [#12671](https://github.com/nrwl/ocean/pull/12671) | chore: upgrade Claude Agent SDK to 0.2.75 |

**Feature/fix work:**

| PR | Title |
|----|-------|
| [#12556](https://github.com/nrwl/ocean/pull/12556) | fix(polygraph): repair PostHog funnel coverage |
| [#12567](https://github.com/nrwl/ocean/pull/12567) | fix(polygraph): backfill PostHog funnel events |
| [#12586](https://github.com/nrwl/ocean/pull/12586) | feat(polygraph): link Claude cloud sessions |
| [#12593](https://github.com/nrwl/ocean/pull/12593) | feat(polygraph): track granular demo walkthrough progress |
| [#12611](https://github.com/nrwl/ocean/pull/12611) | fix(polygraph): restore demo walkthrough telemetry |
| [#12635](https://github.com/nrwl/ocean/pull/12635) | feat(polygraph): add auto mode across agent harnesses |
| [#12638](https://github.com/nrwl/ocean/pull/12638) | fix(polygraph): stop shipping the Claude Agent SDK |

**Work character:** See Needs Your Attention for the juxtaposition of #12638 ("stop shipping the Claude Agent SDK") landing mid-week while version bumps of that same SDK continued for two more days afterward (0.2.73 → 0.2.75). The PostHog funnel pair (#12556 then #12567, one day apart) reads as repair-then-backfill: coverage was fixed forward, then historical events were backfilled to match. Five SDK version bumps in a single week is a notably high cadence for one dependency.

---

### @nixallover (Nick) — Onboarding/growth features, dependency CVE fixes (11 merged)

**Onboarding / growth:**

| PR | Title |
|----|-------|
| [#12244](https://github.com/nrwl/ocean/pull/12244) | feat(nx-cloud): make flaky task details deep linkable |
| [#12478](https://github.com/nrwl/ocean/pull/12478) | feat(nx-cloud): carry workspaceCreatedAt on all guide posthog events |
| [#12551](https://github.com/nrwl/ocean/pull/12551) | feat(nx-cloud): onboarding survey, customized guide recommendations |
| [#12553](https://github.com/nrwl/ocean/pull/12553) | feat(nx-cloud): add plan cancellation survey |
| [#12622](https://github.com/nrwl/ocean/pull/12622) | feat(nx-cloud): graduate one-page manual connect workspace flow |
| [#12676](https://github.com/nrwl/ocean/pull/12676) | chore(nx-cloud): remove marketing opt-in prompt |
| [#12677](https://github.com/nrwl/ocean/pull/12677) | chore(nx-cloud): remove feature_activation_guide flag |

**Dependency CVE fixes:**

| PR | Title |
|----|-------|
| [#12575](https://github.com/nrwl/ocean/pull/12575) | fix(repo): resolve medium-severity npm advisories from CLOUD-4936 |
| [#12629](https://github.com/nrwl/ocean/pull/12629) | fix(repo): update posthog packages to drop the legacy OpenTelemetry chain |
| [#12630](https://github.com/nrwl/ocean/pull/12630) | fix(repo): migrate uuid to 11.1.1 to resolve CVE-2026-41907 |
| [#12631](https://github.com/nrwl/ocean/pull/12631) | fix(repo): bump OpenTelemetry SDK family to resolve CVE-2026-54285 |

**Work character:** #12631 (554/-536, 4 files) is the more involved of the CVE fixes — 19 version bumps across an OpenTelemetry package family that can't be upgraded piecemeal (`sdk-node` pins `core` exactly, so bumping `core` alone would get dragged back). It closes two extra high-severity advisories for free in the same family (a Prometheus-exporter crash-on-malformed-request, a Jaeger-propagator DoS) beyond the one it targeted, and depends on #12629 removing a posthog-js dependency chain first to fully resolve. The PR body itself flags no runtime smoke test was done and recommends one before this reaches production (see Needs Your Attention). #12622 graduates a workspace-connect flow, continuing the onboarding-simplification thread from recent weeks.

---

### @lourw (Lauren) — Resource Usage add-on: full feature arc from toggle to billing rework (9 merged)

| PR | Title |
|----|-------|
| [#12472](https://github.com/nrwl/ocean/pull/12472) | feat(nx-cloud,nx-api): workspace toggles for resource usage report generation |
| [#12515](https://github.com/nrwl/ocean/pull/12515) | feat(nx-cloud): enable resource add-on by default behind a feature flag |
| [#12548](https://github.com/nrwl/ocean/pull/12548) | feat(nx-cloud,aggregator): make resource usage available on Hobby and OSS plans and accounted for in credit usage |
| [#12569](https://github.com/nrwl/ocean/pull/12569) | feat(nx-cloud): complete the resource usage guide step on a page visit |
| [#12570](https://github.com/nrwl/ocean/pull/12570) | fix(nx-cloud): show users link to workspace toggle if resource usage off for workspace |
| [#12596](https://github.com/nrwl/ocean/pull/12596) | feat(aggregator): disable non-DTE resource collection for team and oss add-on orgs |
| [#12617](https://github.com/nrwl/ocean/pull/12617) | feat(nx-cloud): allow users to cancel their resource usage add-on immediately |
| [#12648](https://github.com/nrwl/ocean/pull/12648) | feat(nx-cloud): let admins grant sandboxing without dedicated compute |
| [#12654](https://github.com/nrwl/ocean/pull/12654) | fix(nx-cloud): size the conformance table to its available space (references #12647) |

**Work character:** One contributor, one continuous feature launch, start to finish in a week: #12472 adds per-workspace collection toggles, #12515 turns the add-on on by default behind a flag, #12548 extends availability down to Hobby/OSS plans, and #12617 (576/-129, 21 files, 11 commits) reworks how it's billed so cancellation takes effect immediately instead of running to the end of the billing period — the PR body calls this "the riskiest part of the PR" and documents a real under-billing bug it fixes along the way (see Needs Your Attention). #12648 is a smaller, unrelated admin-entitlement fix letting Sandboxing be granted without requiring the Dedicated Compute Cluster add-on. #12654's title references #12647 (bcabanes, same day) — a duplicate landing of the same conformance-table sizing fix.

---

### @StalkAltan (Altan) — DTE task-scheduling: a feature and its self-inflicted regression (9 merged)

| PR | Title |
|----|-------|
| [#12334](https://github.com/nrwl/ocean/pull/12334) | feat(client-bundle): inject task inputs and outputs at runtime |
| [#12568](https://github.com/nrwl/ocean/pull/12568) | fix(nx-api): remediate high dependency vulnerabilities |
| [#12577](https://github.com/nrwl/ocean/pull/12577) | fix(runner): store batch IDs on v4 discrete tasks |
| [#12579](https://github.com/nrwl/ocean/pull/12579) | feat(nx-cloud): add scheduling constraints |
| [#12649](https://github.com/nrwl/ocean/pull/12649) | fix(nx-cloud): eliminate O(n^2) scheduling-constraint sweeps from agent polls |
| [#12657](https://github.com/nrwl/ocean/pull/12657) | fix(runner): associate continuous tasks with batch ids |
| [#12658](https://github.com/nrwl/ocean/pull/12658) | fix(nx-cloud): constrained tasks were unassignable through the initial claim window |
| [#12672](https://github.com/nrwl/ocean/pull/12672) | fix(nx-api): bound critical-path reservation holds to stop fleet starvation |
| [#12681](https://github.com/nrwl/ocean/pull/12681) | fix(nx-cloud): improve credit threshold contrast |

**Work character:** #12579 shipped the scheduling-constraints feature; #12649, merged the next day, fixes a severe production performance regression it caused (see Needs Your Attention) — every idle-agent poll was running an O(n²) pairwise conflict sweep, measured at ~650ms per sweep on the incident-shaped graph, collapsing an 11-agent run to one task assignment every 20–45 seconds. #12658 and #12672, both merged within the same 24 hours as #12649, are further follow-on fixes to the same scheduling-constraints machinery (an initial-claim-window assignability bug and a fleet-starvation guard on critical-path reservations) — the feature landed, broke production, and was actively stabilized across four PRs in under a week.

---

### @bcabanes (Benjamin) — nx-cloud run/CIPE navigation continuation (8 merged)

| PR | Title |
|----|-------|
| [#11840](https://github.com/nrwl/ocean/pull/11840) | fix(nx-cloud): batch-aware task identity end to end in timeline |
| [#12574](https://github.com/nrwl/ocean/pull/12574) | fix(nx-cloud): attribute task attempts from their source runs |
| [#12591](https://github.com/nrwl/ocean/pull/12591) | feat(nx-cloud): show the linked CIPE menu on run pages |
| [#12594](https://github.com/nrwl/ocean/pull/12594) | fix(nx-cloud): remove redundant CIPE navigation on run pages |
| [#12597](https://github.com/nrwl/ocean/pull/12597) | feat(nx-app): redirect get-started to Nx Cloud |
| [#12599](https://github.com/nrwl/ocean/pull/12599) | fix(nx-cloud): align workspace deletion action |
| [#12601](https://github.com/nrwl/ocean/pull/12601) | fix(nx-cloud): add spacing below workspace actions |
| [#12647](https://github.com/nrwl/ocean/pull/12647) | fix(nx-cloud): size the conformance table to its available space |

**Work character:** #11840 (4,941/-1,588, 88 files, open 48 days) is the largest PR of the week in either repo by open-duration — gives every task execution its own identity (run + task + source + batch id + occurrence + attempt) so retries, multiple agent assignments, and stale graph snapshots stop rendering mixed-up bars in the timeline, and fixes a production double-posted-run-document bug that was doubling every lane. #12591/#12594 are a pair from the same day surfacing (and de-duplicating) CIPE navigation on run pages. This continues the sidebar/navigation rebuild epic from the prior two weeks, now focused on run and CIPE detail pages rather than the top-level shell.

---

### @barbados-clemens — Data API maturation, container resource observability (6 merged)

| PR | Title |
|----|-------|
| [#12328](https://github.com/nrwl/ocean/pull/12328) | feat(nx-cloud): observe and chart docker container resource usage |
| [#12498](https://github.com/nrwl/ocean/pull/12498) | fix(nx-api): route data api assets to the right storage |
| [#12576](https://github.com/nrwl/ocean/pull/12576) | feat(nx-api): bounded child summaries for the data api |
| [#12578](https://github.com/nrwl/ocean/pull/12578) | chore(nx-api): remove data api swagger ui |
| [#12659](https://github.com/nrwl/ocean/pull/12659) | feat(nx-api): data api links and GET lists with query params |
| [#12662](https://github.com/nrwl/ocean/pull/12662) | fix(client-bundle): update io-snapshot validator to match expected changes |

**Work character:** #12328 (5,062/-406, 47 files) is a separate, sizeable feature: task metrics previously only walked a task's own process tree, so Docker containers (testcontainers, compose, `docker run`) never showed up in resource charts. It's Nx-Agents-only (gated on the k8s instance-name env var only the Nx Agents executor sets) and off by default behind a flag, with every failure path disabling quietly so it can't affect a run. #12659 (1,554/-1,314, 50 files) and #12576 continue maturing last week's newly-launched Data API — every endpoint becomes a GET (filters and paging move from POST bodies to query strings), unknown query params 400 instead of silently returning unfiltered data, and every response now carries a `links` map of relation hrefs. #12578 removes the Swagger UI from the same API in the same week — reads as pre-GA surface-area hardening, not a reduction in capability.

---

### @mrl-jr — Polygraph session artifacts and UI polish (5 merged)

| PR | Title |
|----|-------|
| [#12538](https://github.com/nrwl/ocean/pull/12538) | fix(nx-cloud): stop self-healing external apply/rerun reporting spurious failure |
| [#12545](https://github.com/nrwl/ocean/pull/12545) | fix(polygraph): add favicon.ico fallback for tab icon on direct loads |
| [#12572](https://github.com/nrwl/ocean/pull/12572) | feat(polygraph): refine session artifacts UI |
| [#12598](https://github.com/nrwl/ocean/pull/12598) | style(polygraph): align section-card styling across org & session overviews |
| [#12619](https://github.com/nrwl/ocean/pull/12619) | feat(polygraph): make artifacts pane header sticky |

**Work character:** Continues the session-artifacts feature (upload, versioning, reader) introduced two weeks ago, now in UI-polish mode.

---

### @rarmatei (Rares) — io-trace daemon performance, third consecutive week (4 merged)

| PR | Title |
|----|-------|
| [#12560](https://github.com/nrwl/ocean/pull/12560) | perf(io-trace): drop-reduction wave — resolver fast path, analyzer backpressure, dense fd tables, intern at retention |
| [#12589](https://github.com/nrwl/ocean/pull/12589) | perf(io-trace): drop-reduction wave — event-path CPU levers, async flush, sliding read deadline |
| [#12604](https://github.com/nrwl/ocean/pull/12604) | perf(io-trace): PSI probe + flush diagnostics, retire dead experiments |
| [#12608](https://github.com/nrwl/ocean/pull/12608) | perf(io-trace): intern fd-table paths under event-path-cpu, drop pooled spill maps |

**Work character:** #12560 (1,626/-681, 11 files) targets flush-boundary drop bursts traced to per-event CPU saturation on the daemon's single core — fd-keyed tables become dense slot arrays instead of maps (461→225ns, 6→0 allocs on churn benchmarks) and filename interning moves from every event to retention points only. All changes ship behind experiment flags except one ungated equivalence rewrite. Third straight week on this reliability track, now narrowing toward diagnostics and retiring dead experiments rather than new capacity.

---

### @vsavkin (Victor) — Multi-agent Polygraph architecture, adversarial review (3 merged)

| PR | Title |
|----|-------|
| [#12481](https://github.com/nrwl/ocean/pull/12481) | feat(polygraph): multiple agents per repo — sidecar registry move, roles, never-delete |
| [#12600](https://github.com/nrwl/ocean/pull/12600) | feat(polygraph): add polygraph session review --adversarial |
| [#12653](https://github.com/nrwl/ocean/pull/12653) | fix(polygraph): never present an indexed repository as partial |

**Work character:** #12481 (8,940/-2,854, 92 files) is the second-largest PR of the week in either repo — reworks Polygraph's sidecar architecture so a repository can run multiple agents concurrently under distinct roles (e.g. an implementer and a reviewer at once), moves the sidecar registry to a new per-role file layout, and replaces delete-on-exit with a never-delete history model where `exitedAt` is the dead-signal. The PR body documents a pre-merge adversarial review that hardened pid-guarded exit marking and recycled-port/pid protections. #12600 adds the `--adversarial` review mode this same review discipline is named after, wiring a second independent reviewer-role agent into `session review` across three different session-resume code paths.

---

### @nartc (Chau) — Agent log search, org overview polish (3 merged)

| PR | Title |
|----|-------|
| [#12602](https://github.com/nrwl/ocean/pull/12602) | feat(polygraph): add agent log search and stable scrolling |
| [#12603](https://github.com/nrwl/ocean/pull/12603) | feat(polygraph): align cli and browser login flow for new users |
| [#12627](https://github.com/nrwl/ocean/pull/12627) | fix(polygraph): org overview followup |

**Work character:** #12602 (2,824/-484, 19 files) adds pane-scoped literal search with keyboard navigation across every agent-log surface, and separately unifies all of them on one virtualized scroll implementation to fix a reported clipping/jitter bug at the bottom of long transcripts. After last week's large OAuth/credential-rotation security arc, nartc's work this week shifts entirely to UI.

---

### @meeroslav (Miroslav) — Billing re-enablement automation (3 merged)

| PR | Title |
|----|-------|
| [#12180](https://github.com/nrwl/ocean/pull/12180) | feat(nx-cloud): re-enable delinquent orgs after payment |
| [#12537](https://github.com/nrwl/ocean/pull/12537) | fix(nx-api): fail at boot with a readable error when AI token provider env is incomplete |
| [#12668](https://github.com/nrwl/ocean/pull/12668) | feat(nx-cloud): show contributor emails in organization usage |

**Work character:** #12180 (1,397/-16, 17 files, open 30 days) is a billing-automation feature — see Needs Your Attention.

---

### @jaysoo (Jay) — Container-image security remediation (3 merged)

| PR | Title |
|----|-------|
| [#12614](https://github.com/nrwl/ocean/pull/12614) | fix(polygraph,nx-cloud): resolve node-tar CVE alerts in runtime images |
| [#12615](https://github.com/nrwl/ocean/pull/12615) | fix(feature-ci-pipeline-executions): improve messaging on agents banner |
| [#12656](https://github.com/nrwl/ocean/pull/12656) | fix(repo): clear high-severity npm advisories in the frontend images |

**Work character:** #12614 patches CVE-2026-59873 (critical node-tar gzip bomb) surfacing in Trivy scans of the frontend and Polygraph runtime images via npm 10.x's bundled tar — pins npm 11.18.0 (the first release bundling a fixed tar) and separately bumps the workspace's own tar dependency, verified against a real image scan showing zero critical findings. This is a distinct fix from the tar advisory both nx and ocean patched at the dependency-declaration level two weeks ago (GHSA-23hp-3jrh-7fpw) — this one is about what ships inside the container base image itself.

---

### @JamesHenry — Cloud-agent session PR management (3 merged)

| PR | Title |
|----|-------|
| [#12540](https://github.com/nrwl/ocean/pull/12540) | feat(polygraph): PR management for cloud-agent (background) sessions |
| [#12571](https://github.com/nrwl/ocean/pull/12571) | feat(polygraph): move PostHog to the pha-prx.ops.trypolygraph.com proxy |
| [#12583](https://github.com/nrwl/ocean/pull/12583) | fix(polygraph): add logo to PR View session link, and include it in background-created PRs |

---

### @Cammisuli (Jon) — Polygraph CLI config and session tooling (3 merged)

| PR | Title |
|----|-------|
| [#12565](https://github.com/nrwl/ocean/pull/12565) | feat(polygraph): save and exit from the config overlay, and explain the worktree base handoff |
| [#12587](https://github.com/nrwl/ocean/pull/12587) | fix(polygraph): allow the polygraph.ini config dir in agent sandboxes |
| [#12623](https://github.com/nrwl/ocean/pull/12623) | feat(polygraph): attributed session intervals (NXA-2184) |

---

### Automation (2 merged)

| Contributor | PR | Title |
|---|---|---|
| claude[bot] | [#12585](https://github.com/nrwl/ocean/pull/12585) | fix(docker): reduce buildDeps parallelism to 1 to mitigate CI crash |
| polygraph-app[bot] | [#12655](https://github.com/nrwl/ocean/pull/12655) | chore(repo): migrate to nx 23.2.0-beta.4 |

---

## Needs Your Attention

### 1. A shipped feature caused a production performance regression the same week
**@StalkAltan**'s scheduling-constraints feature ([#12579](https://github.com/nrwl/ocean/pull/12579)) triggered a severe production incident described in the fix PR: from minute 14 of a real execution, every new task assignment went to a single agent (roughly one task per 20–45 seconds) while 11 other agents idled, because an O(n²) conflict sweep ran on every idle-agent poll at ~650ms per sweep. It was fixed the next day ([#12649](https://github.com/nrwl/ocean/pull/12649)), with two more follow-on scheduling fixes ([#12658](https://github.com/nrwl/ocean/pull/12658), [#12672](https://github.com/nrwl/ocean/pull/12672)) landing within the same 24 hours. The turnaround was fast, but this is worth knowing about if it affected customer executions before the fix landed — worth confirming whether any customer-facing incident communication is needed.

### 2. Resource Usage add-on billing rework — self-flagged as the riskiest change of the week
**@lourw**'s [#12617](https://github.com/nrwl/ocean/pull/12617) reworks how the Resource Usage add-on bills when cancelled mid-period. The PR body explicitly calls this out: "This is the riskiest part of the PR and deserves the closest review." It fixes a real under-billing bug (an org that toggled the add-on off and on again within one period had one window's usage silently dropped) but changes invoice math for a subset of existing customers as a side effect. Ocean's own guardrail for billing changes requires audit-log coverage, which the PR does add (`PLAN_ADD_ON_CANCELLED` events, previously missing entirely for cancellations) — worth a billing-owner review pass given the author's own risk flag, which the PR notes was still pending as of merge.

### 3. Automated Stripe-triggered account re-enablement now live
**@meeroslav**'s [#12180](https://github.com/nrwl/ocean/pull/12180) makes organization re-enablement after a delinquent payment fully automatic, driven off Stripe's `invoice.paid` webhook rather than manual/scheduled reconciliation. It includes a one-time seed migration that sweeps every currently-delinquent org on deploy. The design looks careful (idempotent, audited, retry-safe with a 7-day grace window before marking failed), but it's a new automated pathway that changes account access state without a human in the loop — worth confirming the Stripe dashboard configuration step called out in the PR (enabling the `invoice.paid` event only after rollout completes) was actually done before treating this as live.

### 4. Heavy dependency-security week across both repos — 9 separate CVE/advisory fixes
nx: axios/brace-expansion ([#36507](https://github.com/nrwl/nx/pull/36507)), critical seroval/nuxt ([#36522](https://github.com/nrwl/nx/pull/36522)). Ocean: node-tar in runtime images ([#12614](https://github.com/nrwl/ocean/pull/12614)), high-severity nx-api deps ([#12568](https://github.com/nrwl/ocean/pull/12568)), frontend-image advisories ([#12656](https://github.com/nrwl/ocean/pull/12656)), and a trio from nixallover (posthog/OTel chain, uuid CVE-2026-41907, OpenTelemetry SDK family CVE-2026-54285 — [#12629](https://github.com/nrwl/ocean/pull/12629)/[#12630](https://github.com/nrwl/ocean/pull/12630)/[#12631](https://github.com/nrwl/ocean/pull/12631)). No single fix looks risky in isolation, but the OpenTelemetry bump's own PR body flags "no runtime smoke test" and recommends one manual verification pass before production, since a telemetry regression there would fail silently (missing data, not a crash) — worth confirming that follow-up actually happened. Otherwise this reads as a productive vulnerability-backlog clearing, not a crisis.

### 5. "Stop shipping the Claude Agent SDK" landed the same week as five version bumps of it
**@AI-JamesHenry**'s [#12638](https://github.com/nrwl/ocean/pull/12638) ("fix(polygraph): stop shipping the Claude Agent SDK") merged mid-week, then two more SDK version bumps ([#12665](https://github.com/nrwl/ocean/pull/12665) to 0.2.74, [#12671](https://github.com/nrwl/ocean/pull/12671) to 0.2.75) landed in the two days after it. These are plausibly not contradictory — "stop shipping" likely means removing the SDK from one specific bundled artifact while a devDependency elsewhere keeps tracking upstream releases — but the sequencing reads oddly from the outside and is worth a quick sanity check that both are intentional.

### 6. Data API continues hardening pre-GA — Swagger UI removed the same week capability grew
**@barbados-clemens** both expanded the Data API (relation links, GET-only endpoints, bounded summaries) and removed its Swagger UI ([#12578](https://github.com/nrwl/ocean/pull/12578)) in the same week — likely intentional discoverability/attack-surface reduction ahead of wider release, following up on the "new external access surface" flagged when this API first shipped two weeks ago. No action needed, just tracking the same item to closure.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-07-27 to 2026-08-02_
