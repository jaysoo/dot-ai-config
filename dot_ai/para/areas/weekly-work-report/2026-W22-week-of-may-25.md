# Weekly Work Report — Week of May 25–31, 2026

_Coverage: merged and opened PRs in `nrwl/nx` and `nrwl/ocean` between 2026-05-25 and 2026-05-31._

---

## TL;DR

A high-output week across both repos. Two large feature areas dominated Ocean: **@bcabanes** drove a complete user-impersonation system and a systematic lazy-loading / boot-performance pass (16 merged PRs); **@lourw** landed a coordinated add-ons/billing overhaul (9 merged PRs). **@StalkAltan** did deep backend reliability work around Valkey/Redis and graceful shutdown. On the Nx side, **@leosvelperez** is mid-sprint on agentic `nx migrate` (6 open PRs), while **@jaysoo** handled a flurry of CVE patches across both repos. Several new AI-tool integrations (Claude, Codex, OpenCode) shipped into Polygraph via **@Cammisuli**.

---

## nrwl/nx

### @leosvelperez — Agentic `nx migrate` sprint (6 open PRs, 1 merged)

Entirely focused on one large feature: making `nx migrate` agentic-aware.

| PR | Status | Title |
|----|--------|-------|
| [#35718](https://github.com/nrwl/nx/pull/35718) | merged | feat(core): add agentic mode to `nx migrate --run-migrations` |
| [#35835](https://github.com/nrwl/nx/pull/35835) | open | feat(core): feed migration docs to agents in `nx migrate` |
| [#35834](https://github.com/nrwl/nx/pull/35834) | open | fix(core): support local plugins using NodeNext `.js` import specifiers |
| [#35833](https://github.com/nrwl/nx/pull/35833) | open | fix(core): prevent TUI from auto-selecting a completed task when a batch finishes |
| [#35831](https://github.com/nrwl/nx/pull/35831) | open | feat(core): add a migrate configuration section to `nx.json` |
| [#35830](https://github.com/nrwl/nx/pull/35830) | open | fix(core): gate `nx migrate` first-party/third-party modes to Nx v23+ targets |

**Work character:** Deep, single-feature sprint. The merged PR is the core, and the open stack completes the experience (config, docs, TUI, version gating). Five PRs still open — likely landing as a block.

---

### @jaysoo — Security maintenance + module-federation + docs (6 merged)

| PR | Title |
|----|-------|
| [#35832](https://github.com/nrwl/nx/pull/35832) | chore: bump Storybook to 10.2.10 (CVE-2026-27148, CVE-2025-68429) |
| [#35825](https://github.com/nrwl/nx/pull/35825) | feat(module-federation): deprecate old generators; add consumer/provider generators |
| [#35821](https://github.com/nrwl/nx/pull/35821) | chore: update to 23.0.0-beta.20 |
| [#35813](https://github.com/nrwl/nx/pull/35813) | fix(core): update `tmp` to 0.2.6 (CVE-2026-44705) |
| [#35802](https://github.com/nrwl/nx/pull/35802) | docs(nx-dev): promote CI setup to top-level Getting Started |
| [#35790](https://github.com/nrwl/nx/pull/35790) | fix(core): update `brace-expansion` and `yaml` |

**Work character:** Mix of security hygiene (3 CVE patches coordinated across Nx and Ocean), one notable feature (module-federation generator overhaul), and one docs improvement. Also has an open [#35812](https://github.com/nrwl/nx/pull/35812) (shell-escape args security fix) still pending.

---

### @cw-alexcroteau — Project graph / dependency analysis (3 open PRs)

All three PRs form a cohesive body of work around dep inference accuracy and performance.

| PR | Title |
|----|-------|
| [#35798](https://github.com/nrwl/nx/pull/35798) | feat(js): add tree-shaking-based dependency narrowing to the JS project graph |
| [#35796](https://github.com/nrwl/nx/pull/35796) | fix(core): avoid tsconfig path false positives for sibling project roots |
| [#35793](https://github.com/nrwl/nx/pull/35793) | perf(core): avoid redundant rematch in `findMatchingConfigFiles` |

**Work character:** Medium-scope, focused feature contribution. The tree-shaking dep narrowing is the most substantive change; the other two are cleanups that likely arose during the same investigation.

---

### @cogwirrel — Small targeted fixes (1 merged, 1 open)

| PR | Title |
|----|-------|
| [#35564](https://github.com/nrwl/nx/pull/35564) | fix(core): allow nx build scripts in generated pnpm-workspace.yaml |
| [#35827](https://github.com/nrwl/nx/pull/35827) | feat(create-nx-workspace): add `--trustThirdPartyPreset` flag |

**Work character:** Two unrelated, self-contained issues. Low blast radius.

---

### @dan-winters — Angular rspack build performance (1 open PR)

| PR | Title |
|----|-------|
| [#35814](https://github.com/nrwl/nx/pull/35814) | feat(angular-rspack): add persistent tsbuild cache for incremental building |

**Work character:** Single, focused performance feature for the Angular rspack plugin.

---

### @vsavkin — Minimal Nx activity

Only [#35794](https://github.com/nrwl/nx/pull/35794) (merged): docs — added a Toronto note to the README. Primary attention is on Ocean (see below).

---

## nrwl/ocean

### @bcabanes — Impersonation feature + boot-path performance (16 merged, 4 open)

The highest-volume contributor this week. Two distinct workstreams:

**Impersonation system** (5 merged PRs — a full feature landing):

| PR | Title |
|----|-------|
| [#11031](https://github.com/nrwl/ocean/pull/11031) | fix(nx-cloud): re-enable user impersonation |
| [#11436](https://github.com/nrwl/ocean/pull/11436) | feat(nx-cloud): add impersonation banner to layout |
| [#11437](https://github.com/nrwl/ocean/pull/11437) | feat(nx-cloud): show impersonation-specific message on blocked actions |
| [#11438](https://github.com/nrwl/ocean/pull/11438) | feat(nx-cloud): audit-log impersonation scope rejections |
| [#11439](https://github.com/nrwl/ocean/pull/11439) | feat(nx-cloud): toast notification for impersonation-blocked actions |
| [#11433](https://github.com/nrwl/ocean/pull/11433) | refact(nx-cloud): gate actions on session scopes |
| [#11440](https://github.com/nrwl/ocean/pull/11440) | feat(nx-cloud): shared `guardImpersonation` helper |

**Boot-path lazy-loading / performance** (open PRs + 2 merged):

| PR | Title |
|----|-------|
| [#11441](https://github.com/nrwl/ocean/pull/11441) | refact: reduce SSR server bundle parse cost at startup |
| [#11542](https://github.com/nrwl/ocean/pull/11542) | refact: code-split recharts off the boot path |
| [#11541](https://github.com/nrwl/ocean/pull/11541) | refact: lazy-load react-syntax-highlighter off the boot path |
| [#11537](https://github.com/nrwl/ocean/pull/11537) | refact: code-split `@nx/graph` project graphs off boot |
| [#11536](https://github.com/nrwl/ocean/pull/11536) | refact: lazy-load DTE flow viz off the SSR boot path |
| [#11532](https://github.com/nrwl/ocean/pull/11532) | refact: lazy-load CIPE timeline off the SSR boot path |

**Other merged this week:** Timeline on CIPE screen, base-ui migration (beta.3 → 1.5.0), headlessui → base-ui, MACHINE_TERMINATED pill fix, frontend pod restart fix, timeline lane assignment fix.

**Work character:** Exceptional volume. The impersonation feature is a complete, multi-layered capability (infrastructure, UI, audit trail). The lazy-loading series is a systematic performance pass — likely driven by a measured boot-time target. Architectural/design-level output.

---

### @StalkAltan — Valkey backend reliability (13 merged, 1 open)

All work concentrated on backend infrastructure reliability.

**Valkey / Redis:**

| PR | Title |
|----|-------|
| [#11452](https://github.com/nrwl/ocean/pull/11452) | feat: refactor valkey into standalone lib |
| [#11455](https://github.com/nrwl/ocean/pull/11455) | fix: respect DTE task parallelism in valkey assignment |
| [#11470](https://github.com/nrwl/ocean/pull/11470) | fix: mention KVS env fallbacks in valkey errors |

**Graceful shutdown / drain:**

| PR | Title |
|----|-------|
| [#11488](https://github.com/nrwl/ocean/pull/11488) | fix: gracefully drain valkey queues on shutdown |
| [#11503](https://github.com/nrwl/ocean/pull/11503) | fix: stop distributed lock polling on shutdown |
| [#11525](https://github.com/nrwl/ocean/pull/11525) | fix: stop multi-blocking ingestion before drain |
| [#11520](https://github.com/nrwl/ocean/pull/11520) | fix: add filterable shutdown diagnostics |

**DTE / live runs:**

| PR | Title |
|----|-------|
| [#11487](https://github.com/nrwl/ocean/pull/11487) | fix: fail DTE runs with incomplete task graph |
| [#11516](https://github.com/nrwl/ocean/pull/11516) | fix: handle reclaimed agent timeouts |
| [#11533](https://github.com/nrwl/ocean/pull/11533) | fix: forward shutdown signals to JVM |
| [#11475](https://github.com/nrwl/ocean/pull/11475) | fix(aggregator): handle live runs in concurrency count |
| [#11469](https://github.com/nrwl/ocean/pull/11469) | chore: enable live runs in .env.local |
| [#11493](https://github.com/nrwl/ocean/pull/11493) | fix(nx-cloud): avoid reusing upload locations |

**Work character:** Deep reliability sprint. The Valkey standalone lib refactor is a meaningful infrastructure change; the dozen shutdown/drain fixes read as a coordinated hardening campaign, not a scatter of bug reports. High-risk area — any regression here affects DTE reliability.

---

### @lourw — Add-ons & billing overhaul (9 merged)

All work is coordinated around a single product area: the add-ons / billing system.

| PR | Title |
|----|-------|
| [#11429](https://github.com/nrwl/ocean/pull/11429) | feat(nx-cloud): add-on admin revamp |
| [#11434](https://github.com/nrwl/ocean/pull/11434) | feat(nx-cloud): gate sandboxing & resource utilization on add-ons |
| [#11451](https://github.com/nrwl/ocean/pull/11451) | feat(nx-cloud): revamp add-ons page + directly apply infra-provided add-ons |
| [#11519](https://github.com/nrwl/ocean/pull/11519) | feat(nx-cloud): refine add-ons page copy and layout |
| [#11521](https://github.com/nrwl/ocean/pull/11521) | feat(nx-api): set `allowPrivilegedAgentCapabilities` with dedicated compute add-on |
| [#11431](https://github.com/nrwl/ocean/pull/11431) | feat(nx-cloud): Mandrill templates for plan add-on lifecycle emails |
| [#11267](https://github.com/nrwl/ocean/pull/11267) | feat(nx-api): collect agent metrics upload records |
| [#11534](https://github.com/nrwl/ocean/pull/11534) | fix(aggregator): count distinct agents for caching add-ons |
| [#11450](https://github.com/nrwl/ocean/pull/11450) | fix(workflow-controller): record metrics uploads against in-cluster nx-api |

**Work character:** Sustained, large-scope feature delivery. The full stack is touched — admin UI, customer-facing page, infrastructure gating, email notifications, and billing metrics. This represents a complete slice of a billing capability landing in one week.

---

### @MaxKless — Polygraph CLI experience (7 merged, 1 open)

All work improving the Polygraph CLI user experience.

| PR | Title |
|----|-------|
| [#11491](https://github.com/nrwl/ocean/pull/11491) | feat(polygraph): store CLI tokens in keychain |
| [#11513](https://github.com/nrwl/ocean/pull/11513) | feat(polygraph): print login URL for manual CLI authentication |
| [#11510](https://github.com/nrwl/ocean/pull/11510) | feat(polygraph): render Claude task notifications |
| [#11511](https://github.com/nrwl/ocean/pull/11511) | feat(polygraph): add `session cd` command |
| [#11492](https://github.com/nrwl/ocean/pull/11492) | fix(polygraph): cap generated session IDs |
| [#11490](https://github.com/nrwl/ocean/pull/11490) | fix(polygraph): resolve repository refs exactly |
| [#11484](https://github.com/nrwl/ocean/pull/11484) | fix(polygraph): upload parent logs after each user submission |
| [#11476](https://github.com/nrwl/ocean/pull/11476) | fix(polygraph-cli): declare setupScripts config schema |

**Work character:** Steady, user-facing CLI polish across auth, session management, and AI tool integration. No single large feature — a cluster of UX improvements.

---

### @Cammisuli — AI coding-tool permission bridges (4 merged)

| PR | Title |
|----|-------|
| [#11424](https://github.com/nrwl/ocean/pull/11424) | feat(polygraph): Claude exec permission bridge |
| [#11458](https://github.com/nrwl/ocean/pull/11458) | feat(polygraph): Codex permission bridge |
| [#11471](https://github.com/nrwl/ocean/pull/11471) | feat(polygraph): OpenCode permission bridge |
| [#11467](https://github.com/nrwl/ocean/pull/11467) | fix(fix-ci): exclude `.nx/self-healing/` files from suggested fix diff |

**Work character:** Focused sprint wiring three AI coding tools (Claude, Codex, OpenCode) into Polygraph's permission model. This looks like a deliberate product push to support multiple AI editors simultaneously.

---

### @nartc — Polygraph + nx-api (6 merged, 2 open)

| PR | Title |
|----|-------|
| [#11524](https://github.com/nrwl/ocean/pull/11524) | feat(polygraph): add demo org removal |
| [#11539](https://github.com/nrwl/ocean/pull/11539) | fix(polygraph): wait for demo org after prepare |
| [#11509](https://github.com/nrwl/ocean/pull/11509) | fix(polygraph): reduce server bundle size |
| [#11477](https://github.com/nrwl/ocean/pull/11477) | fix(polygraph): prefix auth0 management vars with POLYGRAPH |
| [#11494](https://github.com/nrwl/ocean/pull/11494) | fix(nx-api): relax mark member sync stale on member_* GitHub webhooks |
| [#11507](https://github.com/nrwl/ocean/pull/11507) | feat(polygraph): add OAuth approval page |
| [#11506](https://github.com/nrwl/ocean/pull/11506) | feat(nx-api): add OAuth device and refresh token flow |

**Work character:** Mix of demo-system reliability (race conditions, org removal) and an OAuth device flow implementation in progress. The OAuth feature is mid-landing (two open PRs: API + UI).

---

### @vsavkin — Polygraph terminal multiplexer (3 merged, 1 open)

| PR | Title |
|----|-------|
| [#11535](https://github.com/nrwl/ocean/pull/11535) | feat(polygraph): add richer terminal multiplexer layouts |
| [#11529](https://github.com/nrwl/ocean/pull/11529) | fix(polygraph): fix reconstructed resume multiplexer state |
| [#11538](https://github.com/nrwl/ocean/pull/11538) | fix(polygraph): fix Ghostty multiplexer tab anchoring |
| [#11540](https://github.com/nrwl/ocean/pull/11540) | feat(polygraph-cli): add `session intro` welcome card command |

**Work character:** Focused on Polygraph terminal UX. The "richer layouts" feature is the substantive piece; the two fixes arose from it. Minimal Nx involvement this week.

---

### @rarmatei — Sandbox / io-trace reliability (4 merged)

| PR | Title |
|----|-------|
| [#11414](https://github.com/nrwl/ocean/pull/11414) | fix(io-trace): fix delayed sandbox-violation reports on CIPEs |
| [#11500](https://github.com/nrwl/ocean/pull/11500) | fix(nx-cloud): align sandbox violations summary with table |
| [#11517](https://github.com/nrwl/ocean/pull/11517) | fix(client-bundle): only write io-tracing reports for real DTE agents |
| [#11498](https://github.com/nrwl/ocean/pull/11498) | fix(nx-api,client-bundle): register late agents + strip auth from axios instance |

**Work character:** All fixes in the sandbox / io-tracing subsystem. Looks like a reliability sweep following the sandbox feature launch.

---

### @mrl-jr — Polygraph UI + OAuth PR creation (3 merged)

| PR | Title |
|----|-------|
| [#11466](https://github.com/nrwl/ocean/pull/11466) | feat(polygraph): use user OAuth token for PR creation |
| [#11508](https://github.com/nrwl/ocean/pull/11508) | fix(polygraph): fallback when failing to open PR on a repo as user |
| [#11291](https://github.com/nrwl/ocean/pull/11291) | feat(polygraph): UI updates to sessions list, sidebar, session details |

**Work character:** One substantial feature (OAuth-token PR creation), a followup fix, and a large UI overhaul PR that had been in flight.

---

### @juristr — Polygraph demo (2 merged)

| PR | Title |
|----|-------|
| [#11495](https://github.com/nrwl/ocean/pull/11495) | feat(polygraph): interactive demo tour overhaul |
| [#11522](https://github.com/nrwl/ocean/pull/11522) | fix(polygraph): show "Merged" label instead of "Approved" on merged PRs |

**Work character:** One significant feature (demo tour redesign) plus a quick label bug fix.

---

### @pmariglia — Workflow controller (2 merged)

| PR | Title |
|----|-------|
| [#11457](https://github.com/nrwl/ocean/pull/11457) | fix(workflow-controller): downstream 404s are not errors |
| [#11449](https://github.com/nrwl/ocean/pull/11449) | chore(workflow-controller): proxy UpdateVCSInfo in facade mode |

**Work character:** Two small, scoped workflow-controller fixes.

---

### @nixallover — nx-cloud UX (1 merged, 1 open)

| PR | Title |
|----|-------|
| [#11489](https://github.com/nrwl/ocean/pull/11489) | feat(nx-cloud): make run-details tasks deep-linkable via `taskId` query param |
| [#11531](https://github.com/nrwl/ocean/pull/11531) | feat(nx-cloud): general demo |

**Work character:** Deep-link feature merged; general demo feature still open.

---

### @joshvanallen — On-prem cleanup (1 merged)

| PR | Title |
|----|-------|
| [#11394](https://github.com/nrwl/ocean/pull/11394) | chore(virtual-appliances): update on-prem scripts to remove EOL tech |

---

### @meeroslav — fix-ci package manager detection (1 open)

| PR | Title |
|----|-------|
| [#11472](https://github.com/nrwl/ocean/pull/11472) | fix(self-healing): respect detected package manager when injecting fix-ci into CI configs |

---

### @jaysoo (Ocean) — Security patches + compat (3 merged)

| PR | Title |
|----|-------|
| [#11515](https://github.com/nrwl/ocean/pull/11515) | chore: bump undici to ≥6.23.0 (CVE-2026-22036) |
| [#11505](https://github.com/nrwl/ocean/pull/11505) | chore(client-bundle): vendor `isCacheableTask` for Nx 23 compat |
| [#11446](https://github.com/nrwl/ocean/pull/11446) | fix(nx-api): disable self-hosted cache registration endpoint |

---

## Needs Your Attention

### 1. Impersonation feature landed — was this planned?
**@bcabanes** merged a complete impersonation system (banner, blocked actions, audit-log, toasts, scope gating) in a single week, re-enabling the feature ([#11031](https://github.com/nrwl/ocean/pull/11031) was the "re-enable" PR, suggesting it was previously turned off). If this is a security-sensitive feature, it warrants a review of the access-control design before it reaches more customers.

### 2. Add-ons / billing system: large scope, fast pace
**@lourw**'s 9 PRs represent a near-complete billing system rebuild — new UI, infra gating, email templates, and metrics collection. If this is driving toward a billing cut-over, the timeline looks aggressive. Worth confirming the feature-flag strategy and rollback plan.

### 3. Valkey migration carries DTE risk
**@StalkAltan**'s refactor of Valkey into a standalone lib, combined with a comprehensive shutdown/drain rework, is a meaningful infrastructure change affecting DTE reliability. 13 PRs in one week in this area is a lot of change. Recommend confirming load-test coverage before this is fully promoted.

### 4. Three AI-tool permission bridges shipped simultaneously
**@Cammisuli** shipped Claude, Codex, and OpenCode permission bridges in the same week. This looks intentional — is this part of a broader "support all AI editors" product announcement? If so, docs and comms may need to be ready.

### 5. @leosvelperez agentic nx migrate: 5 PRs still open
The core feature merged, but 5 follow-on PRs are still open. This sprint may block a beta.20 / RC push if they're required for the full experience. Worth checking the target release milestone.

### 6. @vsavkin very light on Nx
Only one minor docs commit this week; all meaningful work was on Ocean/Polygraph. Normal?

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs from 2026-05-25 to 2026-05-31_
