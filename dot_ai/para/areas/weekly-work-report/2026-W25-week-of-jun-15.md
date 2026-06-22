# Weekly Work Report — Week of June 15–21, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-06-15 and 2026-06-21._

---

## TL;DR

The week's dominant story is **Polygraph CLI shipping fast toward maturity**. Across Ocean, @MaxKless (22 PRs), @nartc (12), @mrl-jr (7), and @Cammisuli (7) collectively merged 48 Polygraph-tagged PRs covering auth (OAuth + PAT CLI routes), session management, Codex plugin setup, first-run onboarding, responsive UI, and multiplexer reliability. That's nearly half of Ocean's 113 merged PRs aimed at one product surface. @bcabanes meanwhile closed out the CIPE timeline overhaul with 15 PRs — the base-ui refactor of ui-primitives that had 5 open PRs last week all landed. @lourw drove 19 PRs on agent early termination (with two revert/reapply cycles — see Needs Attention). @rarmatei continued the strict-sandboxing polish sprint.

On the Nx side, the week is smaller (47 PRs vs Ocean's 113) but still purposeful. @leosvelperez completed Angular v22 support with five more component PRs (jest-preset-angular, vitest/Analog, SSR engines, schema changes, esbuild path fixes) and dropped ESLint v8 in a breaking change. @FrozenPandaz enabled the tsgo compiler workspace-wide and shipped rspack @2 multi-version compliance. @jaysoo ran a docs cleanup sweep — nine PRs removing stale version-era content — plus added Next 14→15 and React 18→19 upgrade paths.

---

## nrwl/nx

### @FrozenPandaz — tsgo, rspack @2, core fixes (13 merged)

Two headline infrastructure changes this week.

**Headline features:**

| PR | Title |
|----|-------|
| [#35926](https://github.com/nrwl/nx/pull/35926) | feat(repo): enable the tsgo compiler workspace-wide |
| [#35682](https://github.com/nrwl/nx/pull/35682) | feat(rspack): support @rspack/core@2 and @rsbuild/core@2 (multi-version compliance) |

**Core / migrate fixes:**

| PR | Title |
|----|-------|
| [#36064](https://github.com/nrwl/nx/pull/36064) | fix(core): format AI-edited files after agentic migrations |
| [#36051](https://github.com/nrwl/nx/pull/36051) | fix(core): do not crash nx migrate on non-semver dependency specifiers |
| [#36045](https://github.com/nrwl/nx/pull/36045) | fix(core): do not write minimumReleaseAgeExclude during nx migrate |
| [#35997](https://github.com/nrwl/nx/pull/35997) | fix(core): read and replay cached failures when NX_CACHE_FAILURES is enabled |
| [#36052](https://github.com/nrwl/nx/pull/36052) | fix(release): stop breaking change changelog entry from swallowing trailing PR body |
| [#35996](https://github.com/nrwl/nx/pull/35996) | fix(module-federation): bound static remote proxy port check to avoid nx serve hang |

**Repo/CI:**

| PR | Title |
|----|-------|
| [#36046](https://github.com/nrwl/nx/pull/36046) | chore(repo): update ai agent configuration via nx configure-ai-agents |
| [#36034](https://github.com/nrwl/nx/pull/36034) | chore(repo): cap gradle workers on CI agents to avoid oversubscription |
| [#36007](https://github.com/nrwl/nx/pull/36007) | chore(repo): migrate to nx 23.0.0-rc.4 |
| [#36054](https://github.com/nrwl/nx/pull/36054) | fix(nx-dev): run next-sitemap directly instead of via pnpm |
| [#35998](https://github.com/nrwl/nx/pull/35998) | fix(testing): give remix integrated e2e tests headroom for npm install |

**Work character:** Two infrastructure-level changes to lead the week. Enabling tsgo workspace-wide is a meaningful shift in the compiler story — it's been gated for a while. Rspack @2 compliance unlocks users of the newest major. The core/migrate fixes continue last week's pattern of shoring up the agentic-migration flow.

---

### @leosvelperez (Leo) — Angular v22 finalization + ESLint v8 drop (12 merged)

Continuing last week's Angular v22 foundation with the remaining integration PRs.

**Angular v22 finalization:**

| PR | Title |
|----|-------|
| [#35851](https://github.com/nrwl/nx/pull/35851) | feat(angular): support angular v22 |
| [#35960](https://github.com/nrwl/nx/pull/35960) | feat(angular): support Angular v22 component and unit-test schema changes |
| [#36001](https://github.com/nrwl/nx/pull/36001) | feat(angular): support jest-preset-angular 16.2.0 for Angular v22 |
| [#36003](https://github.com/nrwl/nx/pull/36003) | feat(vitest): support Angular v22 in the Analog test setup |
| [#36000](https://github.com/nrwl/nx/pull/36000) | feat(angular): add trustProxyHeaders to SSR engines for Angular v22 |
| [#36018](https://github.com/nrwl/nx/pull/36018) | fix(angular-rspack): surface compilation failures as build errors and release resources on teardown |
| [#36017](https://github.com/nrwl/nx/pull/36017) | fix(angular): resolve esbuild option paths relative to the workspace root |

**Breaking change:**

| PR | Title |
|----|-------|
| [#36006](https://github.com/nrwl/nx/pull/36006) | feat(linter)!: drop eslint v8 support |

**Testing / JS fixes:**

| PR | Title |
|----|-------|
| [#36041](https://github.com/nrwl/nx/pull/36041) | fix(vitest): apply mode-based config consistently in the test executor |
| [#36011](https://github.com/nrwl/nx/pull/36011) | fix(js): correct inferred tsbuildinfo output path when rootDir is set |
| [#36009](https://github.com/nrwl/nx/pull/36009) | cleanup(testing): drop sub-default timeout overrides on release e2e setup hooks |
| [#36004](https://github.com/nrwl/nx/pull/36004) | cleanup(testing): add explicit timeout to cache eviction e2e tests |

**Work character:** This is the Angular v22 close-out sprint — seven PRs touching angular, angular-rspack, jest-preset-angular, and vitest/Analog in one week, which is thorough coverage. Dropping ESLint v8 is a deliberate breaking change, presumably aligned with the v23 release window. Confirm it's documented in the changelog.

---

### @jaysoo — Docs cleanup sweep + upgrade paths (15 merged)

A batch of stale content removal alongside a few new additions.

**New docs / features:**

| PR | Title |
|----|-------|
| [#36065](https://github.com/nrwl/nx/pull/36065) | fix(react): skip react 19 update for workspaces using remix v2 |
| [#36031](https://github.com/nrwl/nx/pull/36031) | feat(misc): add next 14 to 15 and react 18 to 19 upgrade paths |
| [#36028](https://github.com/nrwl/nx/pull/36028) | feat(nx-cloud): add utm tracking to clickable cloud prompt links |
| [#36015](https://github.com/nrwl/nx/pull/36015) | docs(misc): document continuous assignment for agents |
| [#36012](https://github.com/nrwl/nx/pull/36012) | docs(misc): add sandbox badge to nx READMEs |

**Stale version-era content removal (9 PRs):**

| PR | Title |
|----|-------|
| [#36027](https://github.com/nrwl/nx/pull/36027) | docs(misc): update TypeScript version references in compile-multiple-formats guide |
| [#35985](https://github.com/nrwl/nx/pull/35985) | docs(misc): remove stale svgr option from deprecated withReact docs |
| [#35984](https://github.com/nrwl/nx/pull/35984) | docs(webpack): remove stale svgr option from NxReactWebpackPlugin |
| [#35986](https://github.com/nrwl/nx/pull/35986) | docs(misc): reword Node Fly.io guide linkcard to drop Nx 15.7 reference |
| [#36023](https://github.com/nrwl/nx/pull/36023) | docs(misc): remove dead legacy version tabs from Nx Cloud auth docs |
| [#36025](https://github.com/nrwl/nx/pull/36025) | docs(misc): remove deprecated Nx < 17 tab from cache-task-results |
| [#36026](https://github.com/nrwl/nx/pull/36026) | docs(misc): remove stale "prior to Nx 18" framing from Node proxy guide |
| [#36024](https://github.com/nrwl/nx/pull/36024) | docs(misc): drop stale version-intro framing from concept docs |
| [#36013](https://github.com/nrwl/nx/pull/36013) | fix(misc): bump happy-dom, tmp, and form-data to patched versions |

**Work character:** Docs hygiene sprint — nine PRs removing pre-v17/v18 version tabs and stale option references. This kind of cleanup is easy to defer but degrades trust in the docs. The Next 14→15 and React 18→19 upgrade path additions are practical user value. The remix-v2 react-19 fix addresses a real compat edge case.

---

### Community + others in nrwl/nx (6 merged)

| Author | PR | Title |
|--------|----|-------|
| @AgentEnder | [#36005](https://github.com/nrwl/nx/pull/36005) | feat(core): revert array-shape targetDefaults support pending redesign and reapplication |
| @cw-alexcroteau | [#35796](https://github.com/nrwl/nx/pull/35796) | fix(core): avoid tsconfig path false positives for sibling project roots |
| @mjohnstone14 | [#36057](https://github.com/nrwl/nx/pull/36057) | fix(bundling): restore preprocessor extensions in postcss normalizeOp |
| @nixallover | [#35995](https://github.com/nrwl/nx/pull/35995) | docs(nx-dev): add Nx Cloud workspace tour CTA to setup-ci page |
| @barbados-clemens | [#36029](https://github.com/nrwl/nx/pull/36029) | docs(nx-cloud): clarify default node version resolution of install-node step |
| @llwt | [#36019](https://github.com/nrwl/nx/pull/36019) | docs(misc): document Nx Cloud CIPE settings snapshotting in CI |
| @StalkAltan | [#35988](https://github.com/nrwl/nx/pull/35988) | chore(repo): enable continuous assignment |

Note: @AgentEnder's revert of array-shape targetDefaults (#36005) is a deliberate rollback "pending redesign." This feature was in the nx repo and got pulled — confirm @AgentEnder has a redesign in progress or a tracking issue, so it doesn't go dark.

---

## nrwl/ocean

### @MaxKless (Max) — Polygraph CLI: session, auth, multiplexer (22 merged)

The highest single-contributor output across both repos this week.

**Session management:**

| PR | Title |
|----|-------|
| [#11892](https://github.com/nrwl/ocean/pull/11892) | feat(polygraph): responsive session-list table, active-only default, archived rename |
| [#11922](https://github.com/nrwl/ocean/pull/11922) | feat(polygraph): richer session descriptions (callouts, tables, link chips) |
| [#11938](https://github.com/nrwl/ocean/pull/11938) | fix(polygraph): replace full-document session save() with targeted writes |
| [#11966](https://github.com/nrwl/ocean/pull/11966) | fix(polygraph): stop duplicated title when resuming a session (NXA-1833) |
| [#11904](https://github.com/nrwl/ocean/pull/11904) | fix(polygraph): resume claude from the parent agent's original cwd |
| [#11915](https://github.com/nrwl/ocean/pull/11915) | feat(polygraph): show polygraph resume command on agent exit, resolve agent ids |
| [#11910](https://github.com/nrwl/ocean/pull/11910) | feat(polygraph): copy-on-hover icon next to session ID in sessions list |
| [#11890](https://github.com/nrwl/ocean/pull/11890) | fix(polygraph): warn before archiving CLI sessions with open PRs |
| [#11891](https://github.com/nrwl/ocean/pull/11891) | fix(polygraph): fail loudly when repo materialization aborts session start |

**Multiplexer / logging:**

| PR | Title |
|----|-------|
| [#12008](https://github.com/nrwl/ocean/pull/12008) | refactor(polygraph): read child-agent status from the status record, not steps (NXA-1840) |
| [#11994](https://github.com/nrwl/ocean/pull/11994) | fix(polygraph): hide child-log attach block inside usable multiplexer terminals |
| [#11889](https://github.com/nrwl/ocean/pull/11889) | feat(polygraph): deterministic parent-log capture via agent-capture mappings |
| [#11906](https://github.com/nrwl/ocean/pull/11906) | fix(polygraph): return all repos from session candidates endpoint |

**Auth + CLI options:**

| PR | Title |
|----|-------|
| [#11921](https://github.com/nrwl/ocean/pull/11921) | feat(polygraph): add auth diagnostics logging to CLI |
| [#11933](https://github.com/nrwl/ocean/pull/11933) | feat(polygraph): add org-level log sharing controls to account settings |
| [#11968](https://github.com/nrwl/ocean/pull/11968) | refactor(polygraph): drop redundant CLI option alias/negation/camelCase fields |
| [#11967](https://github.com/nrwl/ocean/pull/11967) | feat(polygraph): rename --initiator to --primary and add --primary-checkout |
| [#11874](https://github.com/nrwl/ocean/pull/11874) | feat(polygraph): add --description to git push-branch and require it on PR-flow commands |
| [#11894](https://github.com/nrwl/ocean/pull/11894) | fix(polygraph): normalize CLI --url and rename link-reference reference flag to --reference-url |
| [#11935](https://github.com/nrwl/ocean/pull/11935) | fix(polygraph): generalize responsive table layout to CLI session pickers |
| [#11932](https://github.com/nrwl/ocean/pull/11932) | fix(polygraph): make setup script placeholder follow the mode toggle |
| [#11784](https://github.com/nrwl/ocean/pull/11784) | feat(polygraph): install the Codex plugin via official codex plugin commands |

**Work character:** 22 PRs in one week across Polygraph is exceptional. Several PRs rename or restructure CLI surface (`--initiator` → `--primary`, `--reference-url`, alias cleanup) — these are API-level changes and users need clear changelogs. The "targeted writes" replace for session save() and "deterministic parent-log capture" are both correctness/reliability improvements in the session persistence layer. This looks like a feature push toward a milestone (possibly Polygraph public beta), given the breadth and pace.

---

### @lourw (Lauren) — Agent early termination sprint (19 merged)

Heavy focus on one subsystem: getting DTE agents to shut down cleanly and promptly.

**Early termination (with two revert/reapply cycles):**

| PR | Title |
|----|-------|
| [#11923](https://github.com/nrwl/ocean/pull/11923) | fix(nx-api): early terminate valkey-indexed agents with no work |
| [#11925](https://github.com/nrwl/ocean/pull/11925) | fix(nx-api): early terminate valkey agents with unclaimable work |
| [#11929](https://github.com/nrwl/ocean/pull/11929) | fix(nx-api): ensure that early termination shuts down agents early |
| [#11946](https://github.com/nrwl/ocean/pull/11946) | fix(nx-api): wake agents when early termination is ready |
| [#11961](https://github.com/nrwl/ocean/pull/11961) | _Revert "fix(nx-api): wake agents when early termination is ready"_ |
| [#11982](https://github.com/nrwl/ocean/pull/11982) | fix(nx-api): wake waiting agents after early termination |
| [#11988](https://github.com/nrwl/ocean/pull/11988) | fix(nx-api): terminate agents whose only remaining work is continuous tasks |
| [#11999](https://github.com/nrwl/ocean/pull/11999) | fix(nx-api): prefer same-template early termination wakeups |
| [#12007](https://github.com/nrwl/ocean/pull/12007) | chore(nx-api): add early termination log createdAt index |
| [#12013](https://github.com/nrwl/ocean/pull/12013) | _Revert "fix(nx-api): prefer same-template early termination wakeups"_ |

**Add-ons billing + aggregator:**

| PR | Title |
|----|-------|
| [#11883](https://github.com/nrwl/ocean/pull/11883) | feat(cloud,aggregator): add admin add-on plan modifiers |
| [#11895](https://github.com/nrwl/ocean/pull/11895) | chore(nx-cloud): refactor plan modifier helpers |
| [#11899](https://github.com/nrwl/ocean/pull/11899) | fix(nx-cloud): avoid provisioning dedicated cluster when only resource usage add-on requested |
| [#11920](https://github.com/nrwl/ocean/pull/11920) | chore(aggregator): discount add-on billing invoice line items and update descriptions |
| [#11955](https://github.com/nrwl/ocean/pull/11955) | fix(billing): show add-on plan modifiers as invoice discounts |

**Client bundle + repo:**

| PR | Title |
|----|-------|
| [#11953](https://github.com/nrwl/ocean/pull/11953) | fix(client-bundle): propagate Nx Cloud 400 error details to CI |
| [#11954](https://github.com/nrwl/ocean/pull/11954) | fix(client-bundle): include hours in run duration |
| [#11957](https://github.com/nrwl/ocean/pull/11957) | fix(repo): update OpenTelemetry Java agent to address vulnerabilities |
| [#11964](https://github.com/nrwl/ocean/pull/11964) | fix(client-bundle): derive agent run windows from tasks |

**Work character:** The early termination work is clearly iterative and unstable — two reverts within the same week ("wake agents" and "same-template wakeups" were each merged and reverted). The code is likely touching a hard concurrency edge with valkey agent state. Confidence in the final state (after both reverts) is not high. **See Needs Attention.**

---

### @bcabanes (Benjamin) — CIPE timeline + base-ui refactor (15 merged)

Last week's 5 open CIPE PRs all landed this week.

**CIPE timeline UI (in-flight work from W24 now merged):**

| PR | Title |
|----|-------|
| [#11857](https://github.com/nrwl/ocean/pull/11857) | feat(nx-cloud): add motion system to the CIPE execution timeline |
| [#11945](https://github.com/nrwl/ocean/pull/11945) | feat(nx-cloud): default the timeline view to All tasks |
| [#11912](https://github.com/nrwl/ocean/pull/11912) | fix(nx-cloud): base agent-drawer resources on the advertised resource class |
| [#11914](https://github.com/nrwl/ocean/pull/11914) | fix(nx-cloud): derive agent online/offline flags from Agent Nx Tasks step |
| [#11917](https://github.com/nrwl/ocean/pull/11917) | fix(nx-cloud): bound agent lead-in band to its first workflow step |
| [#11897](https://github.com/nrwl/ocean/pull/11897) | fix(nx-cloud): correct timeline mark label & explain its dashed lines |
| [#11943](https://github.com/nrwl/ocean/pull/11943) | fix(nx-cloud): make agent drawer resources & utilization bars readable |
| [#11980](https://github.com/nrwl/ocean/pull/11980) | fix(nx-cloud): even banner spacing above the timeline filter bar |
| [#11949](https://github.com/nrwl/ocean/pull/11949) | fix(nx-cloud): key non-cacheable filter off isCacheable, not cache status |

**base-ui refactor (major architectural work):**

| PR | Title |
|----|-------|
| [#11854](https://github.com/nrwl/ocean/pull/11854) | refactor(nx-cloud): adopt base-ui as the private engine of ui-primitives |

**Performance + cleanup:**

| PR | Title |
|----|-------|
| [#11855](https://github.com/nrwl/ocean/pull/11855) | perf(nx-cloud): bundle server deps & trim eager imports |
| [#11842](https://github.com/nrwl/ocean/pull/11842) | chore(nx-cloud): remove the admin analytics section |
| [#11911](https://github.com/nrwl/ocean/pull/11911) | ci(nx-cloud): remove bundle-size conformance rule to build once per CIPE |
| [#11896](https://github.com/nrwl/ocean/pull/11896) | style(nx-cloud): drop em dashes from cipe timeline copy |
| [#11983](https://github.com/nrwl/ocean/pull/11983) | chore(repo): allow @nx/gradle to run inside the agent sandbox |

**Work character:** The base-ui adoption as the private engine for ui-primitives (#11854) is the architectural change that had been in-progress; it's significant because it shifts the entire design system's runtime foundation. CIPE timeline had ~9 PRs this week — agent drawer data accuracy (resource classes, online/offline flags, lead-in bands) and motion. This is dense UI work that's hard to test without end-to-end QA.

---

### @rarmatei (Rares) — Strict sandboxing + io-trace + CI (13 merged)

Continuing the strict-sandboxing feature and io-trace observability.

**Strict sandboxing:**

| PR | Title |
|----|-------|
| [#11951](https://github.com/nrwl/ocean/pull/11951) | fix(nx-api): make strict-mode sandbox failures clear and consistent |
| [#11950](https://github.com/nrwl/ocean/pull/11950) | fix(nx-cloud): clarify Nx Cloud branch in sandbox fix prompt and CLI |
| [#11974](https://github.com/nrwl/ocean/pull/11974) | fix(nx-cloud): shorten strict sandboxing termination PR comment |
| [#11970](https://github.com/nrwl/ocean/pull/11970) | feat(nx-cloud-workflow-controller): force-enable sandbox report generation via env override |
| [#11913](https://github.com/nrwl/ocean/pull/11913) | fix(nx-cloud-workflow-controller): always track all chdir events |

**io-trace performance:**

| PR | Title |
|----|-------|
| [#11981](https://github.com/nrwl/ocean/pull/11981) | perf(io-trace): hoist per-file pattern+"/" alloc in report analyzer |
| [#11973](https://github.com/nrwl/ocean/pull/11973) | perf(io-trace): log RSS and peak RSS in periodic stats |

**CI / release pipeline:**

| PR | Title |
|----|-------|
| [#12009](https://github.com/nrwl/ocean/pull/12009) | ci: disable Nx Cloud live runs for the snapshot build and push |
| [#12006](https://github.com/nrwl/ocean/pull/12006) | chore(client-bundle): vendor isCacheableTask for nx 23 compat |
| [#12010](https://github.com/nrwl/ocean/pull/12010) | fix(gradle): commit canonical 9.3.0 wrapper jar to stop CI cache busting |
| [#11865](https://github.com/nrwl/ocean/pull/11865) | feat: add metrics service-account bootstrap script |
| [#11862](https://github.com/nrwl/ocean/pull/11862) | Cherry pick 2606.02.1 sandbox fixes x4q7 |
| [#11975](https://github.com/nrwl/ocean/pull/11975) | Cherry pick single tenant 2606.14.0003 |

**Work character:** Rares is running two parallel tracks. The sandbox work is UX-level polish — making failure messages clearer and more actionable. The io-trace allocations perf fix and RSS logging are observability improvements in the hot path of the sandbox report analyzer. The "disable live runs for snapshot build" is notable — likely a cost/latency trade-off during the snapshot pipeline.

---

### @nartc (Chau) — Polygraph: auth + sharing + repo management (12 merged)

**Major feature — OAuth + PAT for CLI:**

| PR | Title |
|----|-------|
| [#11735](https://github.com/nrwl/ocean/pull/11735) | feat(polygraph): support oauth and pat auth for cli routes |

**Repository management:**

| PR | Title |
|----|-------|
| [#11805](https://github.com/nrwl/ocean/pull/11805) | feat(polygraph): allow disconnecting repositories |
| [#11987](https://github.com/nrwl/ocean/pull/11987) | fix(polygraph): fit repository graph card preview |

**Session sharing:**

| PR | Title |
|----|-------|
| [#11990](https://github.com/nrwl/ocean/pull/11990) | fix(polygraph): refine session share modal |
| [#11924](https://github.com/nrwl/ocean/pull/11924) | fix(polygraph): open share modal before public link |
| [#11977](https://github.com/nrwl/ocean/pull/11977) | fix(polygraph): sync resume tour with detected prs |

**Auth reliability:**

| PR | Title |
|----|-------|
| [#11985](https://github.com/nrwl/ocean/pull/11985) | fix(polygraph): reduce oauth keychain prompts |
| [#12014](https://github.com/nrwl/ocean/pull/12014) | fix(polygraph): increase stream timeout for long deferred response |
| [#11958](https://github.com/nrwl/ocean/pull/11958) | test(polygraph): cover url env auth override |

**Misc:**

| PR | Title |
|----|-------|
| [#11942](https://github.com/nrwl/ocean/pull/11942) | fix(polygraph): change support email to trypolygraph.com |
| [#11931](https://github.com/nrwl/ocean/pull/11931) | feat(polygraph): add privacy policy page |
| [#11963](https://github.com/nrwl/ocean/pull/11963) | chore(repo): add shared settings guidance to AGENTS.md |

**Work character:** The OAuth + PAT CLI route support (#11735) is a significant auth capability — it's been open since (has a low PR number relative to the week's 12K range), suggesting it landed after extended development. The privacy policy page and support email change are polish that signals Polygraph is approaching public readiness.

---

### @mrl-jr (Mathieu) — Polygraph: repo connection UX (7 merged)

| PR | Title |
|----|-------|
| [#11936](https://github.com/nrwl/ocean/pull/11936) | feat(polygraph): refresh PRs button & skip archived repos on auto-connect |
| [#11947](https://github.com/nrwl/ocean/pull/11947) | fix(polygraph): connect button loading state & retry repo listing once |
| [#11989](https://github.com/nrwl/ocean/pull/11989) | fix(polygraph): handle transient errors on connect repositories |
| [#11939](https://github.com/nrwl/ocean/pull/11939) | fix(polygraph): split PR-not-found flag from linkFailed and surface it accurately |
| [#11937](https://github.com/nrwl/ocean/pull/11937) | fix(polygraph): responsive session details screen on mobile |
| [#11907](https://github.com/nrwl/ocean/pull/11907) | fix(polygraph): gate prod PostHog on polygraph app URL |
| [#11908](https://github.com/nrwl/ocean/pull/11908) | fix(polygraph): keep sidebar relative time from drifting into the future |

**Work character:** Focused on the repository connection flow — loading state, retry behavior, transient error handling, and archived-repo skipping on auto-connect. Four PRs in one area over one week is active stabilization work, not maintenance.

---

### @Cammisuli (Jon) — Polygraph: first-run setup + Codex sandbox (7 merged)

| PR | Title |
|----|-------|
| [#11918](https://github.com/nrwl/ocean/pull/11918) | feat(polygraph): run agent/config setup on first CLI run |
| [#11829](https://github.com/nrwl/ocean/pull/11829) | fix(polygraph): only show session resume hint when current multiplexer differs from configured default |
| [#11956](https://github.com/nrwl/ocean/pull/11956) | fix(polygraph): add git dirs as writable roots for Codex sandbox |
| [#12012](https://github.com/nrwl/ocean/pull/12012) | fix(polygraph): read polygraph launch templates from main |
| [#11960](https://github.com/nrwl/ocean/pull/11960) | docs(polygraph): replace `polygraph config strategies` with `polygraph config` |
| [#11941](https://github.com/nrwl/ocean/pull/11941) | chore: print Atlas allow-list instructions automatically in serve-snapshot pre-flight |
| [#11916](https://github.com/nrwl/ocean/pull/11916) | chore: connect serve-snapshot to MongoDB Atlas instead of kube tunnel |

**Work character:** The first-run setup (#11918) is a significant onboarding improvement — runs agent/config setup automatically on the first CLI invocation. The Codex sandbox fix (git dirs as writable roots) and the Atlas migration for serve-snapshot are infrastructure-level, not feature work.

---

### @vsavkin (Victor) — Polygraph repo description indexing (4 merged)

| PR | Title |
|----|-------|
| [#11902](https://github.com/nrwl/ocean/pull/11902) | feat(nx-api): always index Polygraph repository descriptions |
| [#11901](https://github.com/nrwl/ocean/pull/11901) | feat(nx-api): gate Polygraph description indexing on deployment mode |
| [#11919](https://github.com/nrwl/ocean/pull/11919) | fix(polygraph): avoid repository description index race |
| [#11926](https://github.com/nrwl/ocean/pull/11926) | fix: omit polygraph candidate descriptions |

**Work character:** Introduced description indexing (always-on), then immediately gated it on deployment mode, then fixed an index race. This sequence suggests the feature shipped too broadly and needed a fast narrowing gate. The race fix compounds that reading.

---

### @meeroslav (Miroslav) — Self-healing + DTE (2 merged)

| PR | Title |
|----|-------|
| [#11940](https://github.com/nrwl/ocean/pull/11940) | feat(self-healing): support custom format command for fixes |
| [#12001](https://github.com/nrwl/ocean/pull/12001) | fix(nx-api): refresh continuous-assignment DTE status snapshot on each completion |

**Work character:** The custom format command for self-healing is a user-facing extension point — lets teams plug in their own formatter. Small but useful. The DTE snapshot refresh ensures status is accurate after each task completes, not just at the end.

---

### @nixallover (Nick) — Analytics + VCS (2 merged in Ocean)

| PR | Title |
|----|-------|
| [#11965](https://github.com/nrwl/ocean/pull/11965) | fix(nx-cloud): exclude non-cacheable tasks from flaky task analytics |
| [#11928](https://github.com/nrwl/ocean/pull/11928) | fix(nx-cloud): keep PAT-authenticated VCS integrations editable |

---

### @jaysoo — Sandboxing CTAs + storybook (3 merged in Ocean)

| PR | Title |
|----|-------|
| [#11962](https://github.com/nrwl/ocean/pull/11962) | feat(feature-add-on-previews): expand sandboxing add-on upsell ctas across key pages |
| [#11900](https://github.com/nrwl/ocean/pull/11900) | fix(nx-cloud): show fixed "Nx" label on sandbox badge instead of org name |
| [#11927](https://github.com/nrwl/ocean/pull/11927) | chore(misc): narrow storybook primitive imports |

---

### Other contributors

| Author | PR | Title |
|--------|----|-------|
| @AI-JamesHenry | [#12020](https://github.com/nrwl/ocean/pull/12020) | fix(polygraph): polish onboarding dialog dark mode |
| @AI-JamesHenry | [#12000](https://github.com/nrwl/ocean/pull/12000) | feat(polygraph): collect onboarding profile data for PostHog, remove Resend |
| @AgentEnder | [#11992](https://github.com/nrwl/ocean/pull/11992) | fix(powerpack): build release native packages on Node 22 in containers |
| @barbados-clemens | [#11976](https://github.com/nrwl/ocean/pull/11976) | chore(powerpack): bump peer nx version for nx 23 |
| @FrozenPandaz | [#11903](https://github.com/nrwl/ocean/pull/11903) | chore(repo): migrate to nx 23.0.0-rc.4 |

---

## Needs Your Attention

### 1. @lourw's early termination has two revert/reapply cycles — is it stable?
Within the same week, Lauren merged "wake agents when early termination is ready" ([#11946](https://github.com/nrwl/ocean/pull/11946)) then reverted it ([#11961](https://github.com/nrwl/ocean/pull/11961)); then merged "prefer same-template early termination wakeups" ([#11999](https://github.com/nrwl/ocean/pull/11999)) and reverted that too ([#12013](https://github.com/nrwl/ocean/pull/12013)). Two reverts in five days on the same subsystem — agent wakeup after early termination — means the behavior in production is uncertain. Ask Lauren at your next 1:1 what state the feature is actually in, whether there are production symptoms, and what the next step is.

### 2. @vsavkin's repo description indexing went from "always" to "gated" to "fix race" in three PRs
Victor introduced always-on description indexing ([#11902](https://github.com/nrwl/ocean/pull/11902)), then immediately gated it behind deployment mode ([#11901](https://github.com/nrwl/ocean/pull/11901)), then fixed an index race ([#11919](https://github.com/nrwl/ocean/pull/11919)). The fast follow-up narrowing suggests the initial rollout was too broad. Worth confirming the feature is now stable and intentionally scoped.

### 3. @MaxKless at 22 PRs — is review coverage keeping up?
22 merged PRs in one week is the highest individual output across both repos. Several of these rename or restructure CLI surface (`--initiator` → `--primary`, flag naming, alias removal). If review throughput isn't keeping up with that velocity, CLI API regressions could slip through. Check whether these PRs had adequate review, especially the ones touching CLI option names.

### 4. ESLint v8 drop is a breaking change — is it in the v23 changelog?
@leosvelperez's [#36006](https://github.com/nrwl/nx/pull/36006) drops ESLint v8 support with `!` in the commit type. Confirm this breaking change has a migration note in the v23 changelog and that affected users know what to do.

### 5. tsgo compiler workspace-wide — any CI regressions?
@FrozenPandaz enabled tsgo across the entire Nx repo ([#35926](https://github.com/nrwl/nx/pull/35926)). This is a meaningful shift that could surface type-checking edge cases. Check whether CI has been clean since merge, and whether any flaky tests emerged that might be tsgo-related.

### 6. @AgentEnder reverted array-shape targetDefaults — is there a redesign tracked?
The revert ([#36005](https://github.com/nrwl/nx/pull/36005)) says "pending redesign and reapplication." If this feature is needed for v23 it needs a timeline; if it's deferred post-v23, it needs a tracking issue so it doesn't go dark.

### 7. @AI-JamesHenry is an AI-agent contributor
Two Polygraph onboarding PRs this week came from `AI-JamesHenry` — one feat (PostHog data collection, Resend removal) and one fix (dark mode polish). This appears to be an AI agent contributing code directly. Worth noting if you haven't seen this before; confirm the review/merge process for AI-authored PRs is the same as for humans.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-06-15 to 2026-06-21_
