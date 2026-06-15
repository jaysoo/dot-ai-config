# Weekly Work Report — Week of June 8–14, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-06-08 and 2026-06-14._

---

## TL;DR

The clearest theme across both repos is **Nx v23 is in active RC burn-down**. On the Nx side, **@FrozenPandaz** ran four RC bumps (rc.0 → rc.3) in five days, finished the dist-build migration, and patched a security advisory — all while carrying the highest PR count of anyone on either repo (20 merged). **@leosvelperez** shipped two major version supports in the same week — Angular v22 and TypeScript 6 — plus four more `nx migrate` analytics and package-manager fixes. **@jaysoo** drove docs (AI monorepos conference banner, agentic migrate docs, Polygraph cleanup) and shipped a `next.js` upgrade from the EOL v14. **@AgentEnder** cleaned house (CircleCI removal, GitLab CI fix, targetDefaults doc rewrite).

On the Ocean side, the story is **Altan's DTE valkey performance sprint** — 12 merged PRs attacking DTE assignment hot paths, continuous assignment reclaim, non-cacheable task handling, and Mongo mirroring, capped Friday with a flaky-regressions fix. That cadence reads more like incident response than planned sprint work, and it needs an explicit check-in. **@MaxKless** had a full Polygraph UI week (subagent rendering, session log improvements, multiplexer fixes, archive flow). **@bcabanes** landed a CIPE task drawer rework with four more related PRs still open. **@meeroslav** completed the `NX_CLOUD_PRINT_HASH_DETAILS` hash logging feature. **@lourw** advanced add-ons billing. **@vsavkin** upgraded local dev to MongoDB 8.2 + mongot vector search.

---

## nrwl/nx

### @FrozenPandaz — v23 RC march + infra + security (20 merged, 7 open)

The highest-output contributor across both repos this week. Work splits across five areas.

**v23 RC bumps:**

| PR | Title |
|----|-------|
| [#35928](https://github.com/nrwl/nx/pull/35928) _(bot)_ | chore(repo): migrate to nx 23.0.0-beta.25 |
| [#35952](https://github.com/nrwl/nx/pull/35952) | chore(repo): migrate to nx 23.0.0-rc.0 |
| [#35971](https://github.com/nrwl/nx/pull/35971) | chore(repo): migrate to nx 23.0.0-rc.1 |
| [#35982](https://github.com/nrwl/nx/pull/35982) | chore(repo): migrate to nx 23.0.0-rc.2 |
| [#35987](https://github.com/nrwl/nx/pull/35987) | chore(repo): migrate to nx 23.0.0-rc.3 |

**Dist-build / module-resolution migration (finishing last week's work):**

| PR | Title |
|----|-------|
| [#35900](https://github.com/nrwl/nx/pull/35900) | chore(repo)!: migrate remaining packages to local dist build |
| [#35915](https://github.com/nrwl/nx/pull/35915) | chore(repo): finish migrating builds off the workspace-root dist |
| [#35919](https://github.com/nrwl/nx/pull/35919) | chore(repo): migrate remaining 4 packages to nodenext module resolution |

**Multi-version compliance:**

| PR | Title |
|----|-------|
| [#35885](https://github.com/nrwl/nx/pull/35885) | feat(misc): multi-version support compliance for detox, expo, react-native, and remix |

**Gradle fixes:**

| PR | Title |
|----|-------|
| [#35972](https://github.com/nrwl/nx/pull/35972) | fix(gradle): make project graph configuration hash deterministic |
| [#35975](https://github.com/nrwl/nx/pull/35975) | fix(gradle): exclude incremental-compilation .bin files from task inputs |
| [#35973](https://github.com/nrwl/nx/pull/35973) | chore(gradle): bump gradle project graph plugin version to 0.1.22 |

**Security + core bug fixes:**

| PR | Title |
|----|-------|
| [#35974](https://github.com/nrwl/nx/pull/35974) | fix(core): override shell-quote to ^1.8.4 to patch GHSA-w7jw-789q-3m8p |
| [#35961](https://github.com/nrwl/nx/pull/35961) | fix(core): exclude NX_CLOUD_ env vars from daemon env reflection |
| [#35989](https://github.com/nrwl/nx/pull/35989) | fix(core): handle --help for commands that bypass workspace handling |
| [#35949](https://github.com/nrwl/nx/pull/35949) | fix(core): allow analytics requests through Claude Code sandbox network filter |
| [#35993](https://github.com/nrwl/nx/pull/35993) | fix(core): allow {projectRoot} after the start of an output when project is at the workspace root |
| [#35908](https://github.com/nrwl/nx/pull/35908) | fix(core): show agentic migration prompt descriptions only for the focused choice |
| [#35924](https://github.com/nrwl/nx/pull/35924) | chore(core): rename supportsOptionalUpdates to supportsOptionalMigrations |
| [#35941](https://github.com/nrwl/nx/pull/35941) | fix(misc): declare continuous on inferred executor targets |
| [#35914](https://github.com/nrwl/nx/pull/35914) | fix(repo): increase FreeBSD publish VM memory to prevent OOM |
| [#35968](https://github.com/nrwl/nx/pull/35968) | fix(repo): correct config path in update-repos scripts and use next migrate CLI |
| [#35925](https://github.com/nrwl/nx/pull/35925) | chore(release): stabilize custom-registries e2e by capping npm fetch-retry backoff |

**In progress (open PRs):** daemon keeps alive on request error, tsgo compiler workspace-wide, React+Vite+Vitest+Playwright example, cached failures replay, module-federation proxy port fix, remix e2e stability.

**Work character:** Classic Philip week anchored by the RC march — beta.25 through rc.3 all in five days is a faster cadence than usual. Alongside that: the security patch (shipped same day as CVE disclosure), Gradle hash determinism (which has a correctness impact on cache), and the dist-build migration wrap-up that was the big W23 story. High-confidence, reliable output.

---

### @leosvelperez — Angular v22 + TypeScript 6 + `nx migrate` (10 merged, 2 open)

Two major version supports in one week.

**Angular v22 (full support):**

| PR | Title |
|----|-------|
| [#35906](https://github.com/nrwl/nx/pull/35906) | feat(angular): add support for Angular v22.0.0 |
| [#35911](https://github.com/nrwl/nx/pull/35911) | feat(angular): support angular-eslint v22 |
| [#35933](https://github.com/nrwl/nx/pull/35933) | feat(angular): support ng-packagr v22 browserslist baseline in stylesheet processor |
| [#35935](https://github.com/nrwl/nx/pull/35935) | feat(angular-rspack): emit subresource integrity for lazy chunks on Angular v22 |
| [#35938](https://github.com/nrwl/nx/pull/35938) | feat(angular): support the renamed ssr.platform option for Angular v22 |
| [#35955](https://github.com/nrwl/nx/pull/35955) | feat(angular): add istanbul-lib-instrument for Angular v22 Karma coverage |

**TypeScript 6:**

| PR | Title |
|----|-------|
| [#35881](https://github.com/nrwl/nx/pull/35881) | feat(misc): support TypeScript 6 |

**`nx migrate` reliability + analytics:**

| PR | Title |
|----|-------|
| [#35905](https://github.com/nrwl/nx/pull/35905) | feat(core): extend `nx migrate --include` to any package that supports optional updates |
| [#35937](https://github.com/nrwl/nx/pull/35937) | feat(core): report analytics events for the nx migrate flow |
| [#35902](https://github.com/nrwl/nx/pull/35902) | fix(core): respect package manager minimum release age in nx migrate |
| [#35967](https://github.com/nrwl/nx/pull/35967) | fix(core): degrade cooldown-blocked dist-tags within their own channel |
| [#35940](https://github.com/nrwl/nx/pull/35940) | fix(vite): improve vitest 4 migration to better handle vitest workspace config |
| [#35959](https://github.com/nrwl/nx/pull/35959) | cleanup(core): stop migrate tests from hitting the registry in local TTY runs |

**In progress:** package manager registry/auth/TLS config in migrate, Angular v22 component and unit-test schema changes.

**Work character:** Two major-version support drops in one week is a lot of scope. Angular v22 alone touched six packages. TypeScript 6 is a cross-cutting change. Combining both in the same week with four migrate fixes is aggressive — confirm there are no open regressions in Angular or TS test suites before RC freeze.

---

### @jaysoo — Docs, nx-dev, analytics (7 merged, 5 open)

| PR | Title |
|----|-------|
| [#35917](https://github.com/nrwl/nx/pull/35917) | docs(nx-dev): document nx migrate agentic flow and modes |
| [#35981](https://github.com/nrwl/nx/pull/35981) | docs(nx-plugin): add guide on writing performant createNodes v2 plugins |
| [#35966](https://github.com/nrwl/nx/pull/35966) | docs(misc): add golden-path and structural style rules to docs guidance |
| [#35943](https://github.com/nrwl/nx/pull/35943) | docs(misc): align compat matrices with v23 ranges |
| [#35963](https://github.com/nrwl/nx/pull/35963) | docs(misc): add v23 to docs version switcher |
| [#35958](https://github.com/nrwl/nx/pull/35958) | docs(misc): remove polygraph mentions and redirect polygraph pages |
| [#35956](https://github.com/nrwl/nx/pull/35956) | feat(nx-dev): add docs top banner for ai monorepos conference |
| [#35923](https://github.com/nrwl/nx/pull/35923) | chore(nx-dev): upgrade next to 16 (from EOL 14) |
| [#35922](https://github.com/nrwl/nx/pull/35922) | feat(misc): prompt analytics earlier in init flow |

**In progress:** task sandboxing page rewrite (build integrity/cache safety angle), stale svgr option removals, Node Fly.io guide cleanup.

**Work character:** Docs-heavy week aligned to the v23 launch — agentic migrate docs, version switcher, compat matrices, Polygraph cleanup. The Next.js upgrade from EOL v14 → v16 is hygiene but overdue. The "Polygraph mentions removal" PR is part of the broader Polygraph-to-product renaming effort.

---

### @AgentEnder (Craigory) — Cleanup + docs (4 merged, 1 open)

| PR | Title |
|----|-------|
| [#35991](https://github.com/nrwl/nx/pull/35991) | docs(core): rewrite targetDefaults reference and guide for array shape and voice |
| [#34237](https://github.com/nrwl/nx/pull/34237) | fix(misc): fix gitlab ci workflow for new repos and merge requests |
| [#35907](https://github.com/nrwl/nx/pull/35907) | chore(repo): remove vestigial CircleCI config |
| [#35939](https://github.com/nrwl/nx/pull/35939) | chore(repo): disable diagnose-sandbox-report skill to encourage use of cloud prompt |

**In progress:** `--include`/`--exclude` glob filters for `nx watch` (#35945).

**Work character:** Maintenance and docs, plus a long-open GitLab CI fix (#34237 — check how long that was sitting). The `nx watch` glob filter feature in progress is a new user-facing capability.

---

### Community + bots (5 merged)

| Author | PR | Title |
|--------|----|-------|
| @jmclellan-crexi | [#35745](https://github.com/nrwl/nx/pull/35745) | fix(release): scope ambiguous-scope check to active release group's projects |
| @llwt | [#35903](https://github.com/nrwl/nx/pull/35903) | docs(nx-cloud): remove + variant resource classes from launch templates page |
| @polygraph-app[bot] | [#35929](https://github.com/nrwl/nx/pull/35929) | chore(repo): add nx-multi-repo-migrate skill |
| @polygraph-app[bot] | [#35930](https://github.com/nrwl/nx/pull/35930) | fix(misc): rename createNodesV2 value usages in v23 migration, not just imports |
| @polygraph-app[bot] | [#35944](https://github.com/nrwl/nx/pull/35944) | fix(webpack): add webpack tooling to devDependencies in the v23 migration |

---

## nrwl/ocean

### @StalkAltan (Altan) — DTE/valkey performance sprint (12 merged, 1 open)

The most concentrated workstream in Ocean this week — nearly every PR touches the same area: DTE task assignment, Mongo/valkey hot paths, and non-cacheable task correctness.

**Non-cacheable task reliability:**

| PR | Title |
|----|-------|
| [#11803](https://github.com/nrwl/ocean/pull/11803) | fix(nx-api): assign non-cacheable dependent tasks |
| [#11802](https://github.com/nrwl/ocean/pull/11802) | fix(nx-api): defer non-cacheable failure propagation |
| [#11858](https://github.com/nrwl/ocean/pull/11858) | fix(nx-api): re-dispatch lost non-cacheable prerequisites in valkey continuous assignment |

**Valkey continuous assignment performance:**

| PR | Title |
|----|-------|
| [#11834](https://github.com/nrwl/ocean/pull/11834) | fix(nx-api): optimize continuous assignment task reclaim |
| [#11835](https://github.com/nrwl/ocean/pull/11835) | perf(nx-api): optimize valkey task assignment for large task graphs |
| [#11838](https://github.com/nrwl/ocean/pull/11838) | perf(nx-api): optimize continuous assignment status polling |
| [#11844](https://github.com/nrwl/ocean/pull/11844) | fix(nx-api): optimize DTE Mongo hot paths |
| [#11843](https://github.com/nrwl/ocean/pull/11843) | fix(nx-api): reduce StoreRunV2 worker duration |
| [#11851](https://github.com/nrwl/ocean/pull/11851) | fix(nx-api): use targeted updates for the DTE assignment Mongo mirror |

**Task status + UI:**

| PR | Title |
|----|-------|
| [#11798](https://github.com/nrwl/ocean/pull/11798) | feat(nx-cloud): add extended task status filters |

**Flaky regression (Friday):**

| PR | Title |
|----|-------|
| [#11888](https://github.com/nrwl/ocean/pull/11888) | Dte valkey parallelism flaky regressions |

**In progress:** DTE repair parity fuzz test hardening (#11880).

**Work character:** Twelve PRs almost entirely on one subsystem in one week, finishing Friday with a "flaky regressions" PR, is the pattern of reactive incident work. Confirm whether this was a planned performance sprint or a response to production degradation. If the latter, a postmortem note is warranted.

---

### @MaxKless (Max) — Polygraph UI + multiplexer (12 merged, 2 open)

**Session logs:**

| PR | Title |
|----|-------|
| [#11827](https://github.com/nrwl/ocean/pull/11827) | feat(polygraph): native subagent rendering and JSON output styling in session logs |
| [#11823](https://github.com/nrwl/ocean/pull/11823) | fix(polygraph): fix log visibility & step upload race conditions |
| [#11814](https://github.com/nrwl/ocean/pull/11814) | fix(polygraph): collapse consecutive thinking blocks in session log feed |

**Session management:**

| PR | Title |
|----|-------|
| [#11820](https://github.com/nrwl/ocean/pull/11820) | feat(polygraph): accept session title as positional on session start |
| [#11826](https://github.com/nrwl/ocean/pull/11826) | fix(polygraph): carry session title across the inverted boot handoff |
| [#11815](https://github.com/nrwl/ocean/pull/11815) | fix(polygraph): size-aware CLI welcome animation with star-only variant |

**Multiplexer / step endpoints:**

| PR | Title |
|----|-------|
| [#11776](https://github.com/nrwl/ocean/pull/11776) | fix(polygraph): make multiplexer pane-open best-effort on delegate |
| [#11780](https://github.com/nrwl/ocean/pull/11780) | fix(polygraph): accept OSS repos in step endpoints and surface rejected step posts in the child sidecar |
| [#11781](https://github.com/nrwl/ocean/pull/11781) | fix(polygraph): count embedded newlines in selectOne redraw height |

**Bundle handlers + UX:**

| PR | Title |
|----|-------|
| [#11866](https://github.com/nrwl/ocean/pull/11866) | fix(polygraph): reject empty lists in mark-ready and add-repo bundle handlers |
| [#11868](https://github.com/nrwl/ocean/pull/11868) | fix(polygraph): remove 'Spawning agents…' state from session PRs empty state |
| [#11864](https://github.com/nrwl/ocean/pull/11864) | fix(polygraph): describe archive outcome instead of polling in archive dialog |
| [#11782](https://github.com/nrwl/ocean/pull/11782) | fix(polygraph): install opencode plugin via official CLI and replace stale entries |

**In progress:** `--url` normalization (#11867), Codex plugin via official codex plugin commands (#11784).

**Work character:** Broad Polygraph feature work spanning session logs, CLI UX, and multiplexer edge cases. The "native subagent rendering" in logs is the headline feature. Mix of new capability and correctness fixes — typical polish sprint before a public milestone.

---

### @meeroslav (Miroslav) — Hash detail logging + DTE fixes (8 merged, 1 open)

**`NX_CLOUD_PRINT_HASH_DETAILS` feature:**

| PR | Title |
|----|-------|
| [#11811](https://github.com/nrwl/ocean/pull/11811) | feat(nx-cloud): print V2 distributed task hash details |
| [#11816](https://github.com/nrwl/ocean/pull/11816) | feat: cherry pick hash detail logging for v2 |
| [#11863](https://github.com/nrwl/ocean/pull/11863) | feat(nx-cloud): print hashDetails in main runner when NX_CLOUD_PRINT_HASH_DETAILS is set |
| [#11886](https://github.com/nrwl/ocean/pull/11886) | feat(nx-cloud): print hashDetails in main runner when NX_CLOUD_PRINT_HASH_DETAILS is set (#11863) |

**Reliability:**

| PR | Title |
|----|-------|
| [#11795](https://github.com/nrwl/ocean/pull/11795) | fix(client-bundle): propagate Nx Cloud 400 error details to CI |
| [#11821](https://github.com/nrwl/ocean/pull/11821) | fix(nx-cloud): prevent false conformance failure emails |
| [#11760](https://github.com/nrwl/ocean/pull/11760) | fix(client-runner): align DTE post-run hook context with PostTasksExecutionContext |
| [#11810](https://github.com/nrwl/ocean/pull/11810) | chore: change nx-api to rebuild it |

**In progress:** hide AUTHOR column in session list when defaulting to @me.

**Work character:** The hash detail logging feature landed in V2 and got cherry-picked to stable — this is a diagnostic aid for customers debugging cache misses in DTE. The cherry-pick pattern (three separate PRs for the same feature across branches) is worth tidying if it becomes routine.

---

### @bcabanes (Benjamin) — CIPE timeline + app housekeeping (7 merged, 5 open)

**CIPE task drawer (major UI feature):**

| PR | Title |
|----|-------|
| [#11694](https://github.com/nrwl/ocean/pull/11694) | feat(nx-cloud): rework the CIPE timeline task drawer |

**Session + invite fixes:**

| PR | Title |
|----|-------|
| [#11527](https://github.com/nrwl/ocean/pull/11527) | refact(nx-cloud): coalesce per-request session lookups |
| [#11786](https://github.com/nrwl/ocean/pull/11786) | fix(nx-cloud): strip screen-clearing sequences from replayed task output |
| [#11788](https://github.com/nrwl/ocean/pull/11788) | fix(nx-cloud): stop admin VCS cookies leaking orgs into impersonated sessions |
| [#11700](https://github.com/nrwl/ocean/pull/11700) | fix(nx-cloud): make invite send & accept succeed on the first attempt |
| [#11789](https://github.com/nrwl/ocean/pull/11789) | fix(nx-cloud): count only executed failures in the failed-only badge |

**Dependency modernization:**

| PR | Title |
|----|-------|
| [#11707](https://github.com/nrwl/ocean/pull/11707) | refactor(nx-cloud): replace `react-copy-to-clipboard` with `navigator.clipboard` |
| [#11708](https://github.com/nrwl/ocean/pull/11708) | refactor(nx-cloud): replace `debug` with `util.debuglog` |
| [#11706](https://github.com/nrwl/ocean/pull/11706) | refactor(nx-cloud): replace `tmp` with native `fs` |
| [#11711](https://github.com/nrwl/ocean/pull/11711) | refactor(nx-cloud): replace `ansi-regex` with `util.stripVTControlCharacters` |

**In progress (5 open PRs — a large in-flight surface):** base-ui as private engine of ui-primitives, server deps behind a flag, CIPE execution timeline motion system, timeline filter axes value-chip registry, batch-aware execution timeline, remove admin analytics section.

**Work character:** Benjamin is running two tracks simultaneously — the dependency modernization (replacing npm packages with Node builtins) is systematic cleanup; the CIPE timeline is a sustained UI feature push. Five open PRs is the most in-flight of anyone in Ocean. Confirm the CIPE timeline PRs aren't blocking each other.

---

### @rarmatei (Rares) — CI infrastructure + io-trace observability (7 merged, 2 open)

**CI tooling:**

| PR | Title |
|----|-------|
| [#11719](https://github.com/nrwl/ocean/pull/11719) | ci: run main commits concurrently with per-commit publish tags |
| [#11721](https://github.com/nrwl/ocean/pull/11721) | ci: parallelize agent init steps and eagerly pull mongo image |
| [#11812](https://github.com/nrwl/ocean/pull/11812) | fix(ci): make package-step tasks reproducible and cacheable |
| [#11860](https://github.com/nrwl/ocean/pull/11860) | chore(ci): widen snapshot tag build number to 4 digits |
| [#11817](https://github.com/nrwl/ocean/pull/11817) | fix(tools): fail snapshot build when a day exceeds 99 commits |
| [#11869](https://github.com/nrwl/ocean/pull/11869) | fix(ci): poll for checks completion before publishing images |

**io-trace + sandbox:**

| PR | Title |
|----|-------|
| [#11818](https://github.com/nrwl/ocean/pull/11818) | perf(io-trace): task-lifecycle observability + gated stale-task reaper |
| [#11832](https://github.com/nrwl/ocean/pull/11832) | fix(nx-cloud): shorten process commands in sandbox process tree |
| [#11873](https://github.com/nrwl/ocean/pull/11873) | fix(workflow-controller): emit all chdir events behind track-all-chdir experiment |
| [#11752](https://github.com/nrwl/ocean/pull/11752) | fix(nx-cloud): offer context clearing between CI batches in sandbox AI prompt |

**Work character:** Rares owns CI infrastructure and io-trace. Concurrent main-commit publishing and parallelized agent init are real throughput improvements to the release pipeline. The snapshot tag build number expansion ("widen to 4 digits") and the "fail when a day exceeds 99 commits" fix together hint that the CI pipeline was hitting edge cases at current commit velocity — a leading indicator the team is shipping faster.

---

### @nartc (Chau) — Polygraph graph + GitHub admin (5 merged, 3 open)

| PR | Title |
|----|-------|
| [#11845](https://github.com/nrwl/ocean/pull/11845) | fix(polygraph): live repository graph updates |
| [#11825](https://github.com/nrwl/ocean/pull/11825) | fix(polygraph): various graph fixes |
| [#11804](https://github.com/nrwl/ocean/pull/11804) | fix(polygraph): support repository graph with strict csp |
| [#11793](https://github.com/nrwl/ocean/pull/11793) | fix(polygraph): handle redeploys gracefully |
| [#11837](https://github.com/nrwl/ocean/pull/11837) | fix(nx-cloud): bootstrap github org admin membership |
| [#11783](https://github.com/nrwl/ocean/pull/11783) | feat(polygraph): add resend email |

**In progress:** OAuth + PAT auth for CLI routes, disconnect repositories, e2e servedist readiness + continuous task (#11807).

**Work character:** Three PRs on the repository graph in one week suggests that feature is in active stabilization. The GitHub org admin bootstrap is a correctness fix for onboarding.

---

### @mrl-jr (Michael) — Polygraph navigation + session (6 merged)

| PR | Title |
|----|-------|
| [#11850](https://github.com/nrwl/ocean/pull/11850) | feat(polygraph): redesign breadcrumbs with chevron dividers |
| [#11799](https://github.com/nrwl/ocean/pull/11799) | feat(polygraph): move repository details to their own route |
| [#11819](https://github.com/nrwl/ocean/pull/11819) | fix(polygraph): support PAT orgs in BOM indexing token provider |
| [#11833](https://github.com/nrwl/ocean/pull/11833) | fix(polygraph): arm rescan for PAT-connected orgs on first connect |
| [#11792](https://github.com/nrwl/ocean/pull/11792) | fix(polygraph): keep sidebar in sync when archiving sessions |
| [#11699](https://github.com/nrwl/ocean/pull/11699) | fix(polygraph): misc session syncing issues |

**Work character:** Mostly Polygraph UI — the breadcrumb redesign and repository details route are both visual/navigation improvements. PAT org BOM indexing fixes are likely spillover from last week's indexing sprint.

---

### @Cammisuli (Colum) — Polygraph agent configuration + stability (5 merged, 1 open)

| PR | Title |
|----|-------|
| [#11797](https://github.com/nrwl/ocean/pull/11797) | fix(polygraph): recover zellij session resume when a dead session occupies the name |
| [#11828](https://github.com/nrwl/ocean/pull/11828) | fix(polygraph): stop mutating repo opencode.json on opencode sessions |
| [#11848](https://github.com/nrwl/ocean/pull/11848) | fix(polygraph): preserve multi-line startup prompt on Windows agent launches |
| [#11824](https://github.com/nrwl/ocean/pull/11824) | fix(polygraph): do not force a default model on claude child agents |
| [#11791](https://github.com/nrwl/ocean/pull/11791) | fix(polygraph): apply per-repo agent options to parent agent on multiplexer boot path |
| [#11676](https://github.com/nrwl/ocean/pull/11676) | fix(polygraph-cli): fail fast on opencode sidecar startup instead of 10s handshake timeout |

**Work character:** All agent-runtime correctness. The 10s → fast-fail opencode sidecar fix (#11676 has a low PR number, suggesting it was open a while). The "do not force default model" fix matters for child agents that should inherit configuration.

---

### @lourw (Lauren) — Add-ons billing + pagination (5 merged, 2 open)

| PR | Title |
|----|-------|
| [#11770](https://github.com/nrwl/ocean/pull/11770) | feat(aggregator): add billing line items for add-ons |
| [#11875](https://github.com/nrwl/ocean/pull/11875) | fix(aggregator): use universal billing price id in stripe client |
| [#11772](https://github.com/nrwl/ocean/pull/11772) | feat(aggregator,nx-api,nx-cloud): tear down ended plan add-ons at month end |
| [#11787](https://github.com/nrwl/ocean/pull/11787) | chore(nx-cloud,nx-api): remove legacy plan add-on request flow |
| [#11882](https://github.com/nrwl/ocean/pull/11882) | fix(nx-cloud): task execution history row keys use createdAt for uniqueness |
| [#11841](https://github.com/nrwl/ocean/pull/11841) | fix(nx-cloud): stabilize previous executions pagination |

**In progress:** admin add-on plan modifiers (#11883), run group config throughout API (#11859).

**Work character:** Sustained add-ons billing build-out — line items, month-end teardown, legacy flow removal. Billing code. Treat with extra review attention before enabling for production traffic.

---

### @nixallover (Nick) — Demo tour + analytics (3 merged, 1 open)

| PR | Title |
|----|-------|
| [#11853](https://github.com/nrwl/ocean/pull/11853) | feat(nx-cloud): demo-tour CTAs and guided-tour polish |
| [#11774](https://github.com/nrwl/ocean/pull/11774) | feat(nx-cloud): track demo entry, progression, and exit in PostHog |
| [#11877](https://github.com/nrwl/ocean/pull/11877) | chore(nx-cloud): gate non-enterprise task/flaky analytics behind a flag |
| [#11847](https://github.com/nrwl/ocean/pull/11847) | fix(nx-cloud): evict stale demo view when cookie is cleared in another tab |

**In progress:** Nx Cloud workspace tour CTA on setup-ci page (#11884 in dot-ai-config and #35995 in nx — cross-repo).

**Work character:** Demo tour is now instrumented with PostHog. The stale demo cookie fix is a correctness issue that would have left users stuck in demo mode.

---

### @pmariglia (Paul) — Workflow controller (2 merged)

| PR | Title |
|----|-------|
| [#11794](https://github.com/nrwl/ocean/pull/11794) | fix(workflow-controller): re-enter leader election after losing the lease |
| [#11852](https://github.com/nrwl/ocean/pull/11852) | chore(nx-cloud-workflow-controller): Allow configurable job parallelism |
| [#11872](https://github.com/nrwl/ocean/pull/11872) | chore(repo): Re-enable npm readthrough in CI |

**Work character:** The leader election fix is correctness-critical for the workflow controller — losing a lease without re-entering election would leave no leader. Small but important.

---

### @vsavkin (Victor) — Polygraph candidates + MongoDB 8.2 (2 merged)

| PR | Title |
|----|-------|
| [#11885](https://github.com/nrwl/ocean/pull/11885) | feat(polygraph): rework candidates endpoint with hard filters and ranking |
| [#11881](https://github.com/nrwl/ocean/pull/11881) | feat(local-dev): upgrade MongoDB to 8.2 with mongot vector search |

**Work character:** The candidates endpoint rework (hard filters + ranking) is backend product logic for Polygraph's agent candidate selection. The MongoDB 8.2 + mongot upgrade is local dev only this week — see the production question in Needs Attention below.

---

### @jaysoo — Ocean features (2 merged)

| PR | Title |
|----|-------|
| [#11878](https://github.com/nrwl/ocean/pull/11878) | feat(nx-cloud): add public sandbox status badge endpoint |
| [#11871](https://github.com/nrwl/ocean/pull/11871) | feat(nx-cloud): rotate cipe cta between sandboxing and resource usage |

---

### Other contributors

| Author | PR | Title |
|--------|----|-------|
| @juristr | [#11808](https://github.com/nrwl/ocean/pull/11808) | fix(polygraph): exclude OSS nodes from manual relationship dropdowns |
| @AgentEnder | [#11836](https://github.com/nrwl/ocean/pull/11836) | fix: add read exclusion for .NET assets cache |
| @AgentEnder | [#11768](https://github.com/nrwl/ocean/pull/11768) | fix: add one more exclusion for .NET tasks |
| @llwt | [#11785](https://github.com/nrwl/ocean/pull/11785) | fix(nx-api): escape command text in VCS comment summary table (CLOUD-4618) |
| @FrozenPandaz | [#11846](https://github.com/nrwl/ocean/pull/11846) | fix(distributed-agent): exit V4 worker cleanly on IPC EPIPE during teardown |
| @FrozenPandaz | [#11849](https://github.com/nrwl/ocean/pull/11849) | chore(repo): migrate to nx 23.0.0-rc.1 |
| @FrozenPandaz | [#11870](https://github.com/nrwl/ocean/pull/11870) | chore(repo): migrate to nx 23.0.0-rc.2 |
| @FrozenPandaz | [#11879](https://github.com/nrwl/ocean/pull/11879) | chore(repo): migrate to nx 23.0.0-rc.3 |

---

## Needs Your Attention

### 1. Altan's DTE sprint: planned or incident response?
**@StalkAltan** merged 12 PRs in one week almost entirely on DTE valkey/Mongo performance — reclaim optimization, Mongo hot paths, continuous assignment, non-cacheable correctness — ending Friday with a "flaky regressions" fix ([#11888](https://github.com/nrwl/ocean/pull/11888)). That title and cadence read like reactive incident work, not a planned sprint. **Ask Altan in your next 1:1**: was this in response to a production slowdown? If yes, a postmortem note (even brief) would help the team learn from it, and the "flaky regressions" fix at the end of a performance sprint should be verified as resolved in production.

### 2. PR merged with "DO NOT MERGE" label still attached
[#11378](https://github.com/nrwl/ocean/pull/11378) — "remove Flipt server config and local-dev plumbing" — was merged on June 12 with the `DO NOT MERGE` label still present on the PR. Presumably intentional (the label was probably left over), but worth confirming no merge safeguard was bypassed and that Flipt removal is fully signed off.

### 3. Rares's CI pipeline is approaching its own limits
**@rarmatei** had to widen the snapshot tag build number to 4 digits ([#11860](https://github.com/nrwl/ocean/pull/11860)) and add a guard for >99 commits per day ([#11817](https://github.com/nrwl/ocean/pull/11817)). These are edge-case guards you only need when you're close to the edge. If the team is shipping at near-100-commits-per-day velocity, check whether the release pipeline (snapshot frequency, tag naming, concurrent publish) is designed for that load.

### 4. v23 RC is moving fast — is there a GA date?
rc.0 through rc.3 landed in **five days** across both nx and ocean. That's an accelerated RC cadence. Is there a public or internal GA commitment driving this? If so, check whether the Angular v22 + TypeScript 6 test suites (both landed this week) have full CI coverage before RC freeze.

### 5. MongoDB 8.2 + mongot (vector search) in local dev — production plan?
**@vsavkin** upgraded local dev to MongoDB 8.2 with mongot vector search ([#11881](https://github.com/nrwl/ocean/pull/11881)). Vector search as a local-dev feature implies production intent. Is there a tracked project or RFC for bringing mongot to production? If not, the gap between local dev and production is worth mapping now before it becomes a surprise dependency.

### 6. @bcabanes has 5 open CIPE-timeline PRs — merge order matters
The CIPE timeline work has five open PRs at various stages (motion system, batch-aware, filter axes, base-ui adoption, server deps flag). These are likely sequentially dependent. Confirm there's a clear merge order and that none are blocked waiting on review. Five open PRs in one area is coordination risk.

### 7. shell-quote security patch — user communication?
**@FrozenPandaz** patched [GHSA-w7jw-789q-3m8p](https://github.com/advisories/GHSA-w7jw-789q-3m8p) in shell-quote ([#35974](https://github.com/nrwl/nx/pull/35974)). Confirm this will be noted in the v23 changelog or a security advisory so users on older Nx versions know to update.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-06-08 to 2026-06-14_
