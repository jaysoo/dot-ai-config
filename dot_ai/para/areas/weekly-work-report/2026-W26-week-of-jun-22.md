# Weekly Work Report — Week of June 22–28, 2026

_Coverage: merged PRs in `nrwl/nx` and `nrwl/ocean` between 2026-06-22 and 2026-06-28._

---

## TL;DR

The week's clearest story across both repos is **a coordinated security sprint in Ocean's Polygraph auth layer**. **@nartc** merged 17 PRs — the most of anyone in either repo — almost entirely removing or hardening OAuth flows: legacy PAT login gone, GitHub OAuth secrets moved out of URLs, repo permission claims enforced, CSP tightened. **@MaxKless** ran parallel on the same theme: redacting secrets on all CLI log-upload paths, gating session log reads against org/repo access. **@mrl-jr** addressed several security findings and shipped bulk repository management (connect and disconnect with select-all pagination). The quantity and velocity of auth-surface changes in a single week is worth a close verification pass.

On Nx, **@FrozenPandaz** had the highest output (14 merged) with a spread across core reliability and self-hosted cache security (path traversal / zip-slip prevention, TLS verification warning), HashPlanner performance work, Gradle fixes, and e2e stabilization. **@jaysoo** covered a broad sweep of small maintenance and migration work: Angular version bump, ESLint v8 rule migration, ts-jest fix, docs refresh, and nx migrate edge cases. Neither Nx contributor had a single defining feature — it was a burn-down / polish week in the lead-up to 23.1.

In Ocean, **@bcabanes** continued the CIPE timeline build-out (makespan verdict strip, compute billing in agent drawer, hide-on-live-runs) — that surface is now clearly his sustained project. **@rarmatei** shipped a concentrated io-trace performance pass (O(1) analyzer matchers, CPU throttling, cgroup cpu.stat reads). **@nixallover** shipped the largest new feature of the week: **Nx Cloud Rewind** (#12084), shareable workspace stats. The demo experience saw coordinated contributions from four contributors (video walkthrough, welcome dialog, prompt-to-connect-real-account) — check whether those are landing on a shared timeline.

---

## nrwl/nx

### @FrozenPandaz — Core reliability, cache security, Gradle, e2e (14 merged)

Work spans four areas this week with no single large feature — classic burn-down sprint.

**Self-hosted remote cache security:**

| PR | Title |
|----|-------|
| [#36132](https://github.com/nrwl/nx/pull/36132) | fix(core): warn when the self-hosted remote cache disables TLS verification (NXC-4593) |
| [#36116](https://github.com/nrwl/nx/pull/36116) | fix(core): prevent path traversal / zip-slip in self-hosted remote cache |

**HashPlanner / caching performance:**

| PR | Title |
|----|-------|
| [#36118](https://github.com/nrwl/nx/pull/36118) | cleanup(core): persist file-set hash caches on the TaskHasher instance |
| [#36117](https://github.com/nrwl/nx/pull/36117) | cleanup(core): memoize external-deps map in HashPlanner |
| [#36077](https://github.com/nrwl/nx/pull/36077) | feat(core): show a performance report at the end of every run |

**Core correctness:**

| PR | Title |
|----|-------|
| [#36115](https://github.com/nrwl/nx/pull/36115) | fix(core): deregister pseudo-terminal exit handlers when tasks finish |
| [#36086](https://github.com/nrwl/nx/pull/36086) | fix(core): make nx migrate honor preapproved packages and emit a valid temp workspace |
| [#36081](https://github.com/nrwl/nx/pull/36081) | fix(core): prefer module.registerHooks to avoid DEP0205 deprecation warning |

**Gradle:**

| PR | Title |
|----|-------|
| [#36103](https://github.com/nrwl/nx/pull/36103) | fix(gradle): correct change-plugin-version-0-1-23 migration to nx 23.1.0-beta.4 |
| [#36100](https://github.com/nrwl/nx/pull/36100) | chore(gradle): bump gradle project graph plugin version to 0.1.23 |
| [#36099](https://github.com/nrwl/nx/pull/36099) | fix(gradle): track copy/sync and AGP merge task outputs in dependent task inputs |

**E2E stabilization:**

| PR | Title |
|----|-------|
| [#36093](https://github.com/nrwl/nx/pull/36093) | fix(vite): widen vite ts-solution e2e build timeouts for cold multi-lib build |
| [#36092](https://github.com/nrwl/nx/pull/36092) | fix(release): widen release e2e timeouts to absorb pre-version dlx install |
| [#36091](https://github.com/nrwl/nx/pull/36091) | fix(maven): de-flake maven e2e by dropping -X debug forks and widening timeout |
| [#36090](https://github.com/nrwl/nx/pull/36090) | fix(react): reserve ports in rspack e2e test to avoid default port collisions |

**Work character:** The self-hosted cache fixes are meaningful — zip-slip is a real vulnerability class and the TLS verification warning is a correctness/trust issue. Four e2e stability fixes in one week is a signal: either the test suite is genuinely flaky or the underlying code has race conditions worth investigating. The performance report at end of run (#36077) is the only user-visible feature.

---

### @jaysoo — Maintenance sweep, migrations, docs (12 merged)

No single feature — a breadth of small reliability and migration work.

**Framework / dependency:**

| PR | Title |
|----|-------|
| [#36130](https://github.com/nrwl/nx/pull/36130) | fix(angular): bump prescribed angular version to 22.0.4 |
| [#36120](https://github.com/nrwl/nx/pull/36120) | fix(misc): bump axios to 1.16.1 |
| [#36131](https://github.com/nrwl/nx/pull/36131) | fix(core): respect explicit --nxCloud=skip for AI agents in create-nx-workspace |

**Migrations:**

| PR | Title |
|----|-------|
| [#36123](https://github.com/nrwl/nx/pull/36123) | feat(linter): add migration to drop typescript-eslint v8-removed rules from flat configs |
| [#36106](https://github.com/nrwl/nx/pull/36106) | feat(testing): add migration to verify typecheck after the 23.1 migration |
| [#36089](https://github.com/nrwl/nx/pull/36089) | fix(testing): keep ts-jest resolving exports-only libs on typescript < 6 |
| [#36087](https://github.com/nrwl/nx/pull/36087) | fix(core): prevent nx migrate crash when include=optional filters out the target package |

**Docs:**

| PR | Title |
|----|-------|
| [#36114](https://github.com/nrwl/nx/pull/36114) | docs(misc): refresh stale version references in astro-docs |
| [#36105](https://github.com/nrwl/nx/pull/36105) | docs(misc): retitle technology pages for SEO and rework the Module Federation overview |
| [#36088](https://github.com/nrwl/nx/pull/36088) | docs(misc): retitle crafting-your-workspace to target nx workspace intent |
| [#36062](https://github.com/nrwl/nx/pull/36062) | docs(misc): add template pages |
| [#36085](https://github.com/nrwl/nx/pull/36085) | fix(nx-dev): remove empty SaaS and Mobile template filters |

**Work character:** Classic jaysoo maintenance week — many small PRs across docs, migrations, and dependency hygiene. The typescript-eslint v8 migration is the most impactful: flat config users on v8 will hit removed rules without it. The `--nxCloud=skip` fix for AI agents is a correctness issue that would have generated noise for automated CI runs.

---

### @barbados-clemens — Docs, Product Hunt banner (3 merged)

| PR | Title |
|----|-------|
| [#36112](https://github.com/nrwl/nx/pull/36112) | feat(nx-dev): show product hunt launch banner in docs |
| [#36129](https://github.com/nrwl/nx/pull/36129) | Revert "feat(nx-dev): show product hunt launch banner in docs" |
| [#36111](https://github.com/nrwl/nx/pull/36111) | docs(js): add TS 6 to plugin version matrix |

**Work character:** The Product Hunt banner was added and then reverted in the same week — presumably a timing issue with the launch date. Confirm the revert is intentional and the banner is queued for the correct date.

---

### @leosvelperez — TUI fix (1 merged)

| PR | Title |
|----|-------|
| [#35833](https://github.com/nrwl/nx/pull/35833) | fix(core): prevent the TUI from auto-selecting a completed task when a batch finishes |

**Work character:** Single correctness fix for the TUI — the long PR number relative to the merge date suggests this was open for a while before landing.

---

### @AgentEnder — Daemon optimization (1 merged)

| PR | Title |
|----|-------|
| [#36082](https://github.com/nrwl/nx/pull/36082) | fix(core): skip daemon project-graph recompute on no-op file rewrites |

---

### @itsjithinv — Community: Expo SDK 56 (1 merged)

| PR | Title |
|----|-------|
| [#35904](https://github.com/nrwl/nx/pull/35904) | feat(expo): support Expo SDK 56 |

---

### @jdgarvey — Community: chalk import fix (1 merged)

| PR | Title |
|----|-------|
| [#35523](https://github.com/nrwl/nx/pull/35523) | fix(misc): use default import for chalk in @nx/workspace output.ts |

---

## nrwl/ocean

### @nartc (Chau) — Polygraph auth security overhaul (17 merged)

The most concentrated individual workstream of the week — nearly every PR touches Polygraph's authentication and security surface.

**Auth hardening (security-critical):**

| PR | Title |
|----|-------|
| [#12046](https://github.com/nrwl/ocean/pull/12046) | fix(polygraph): move github oauth secrets out of urls |
| [#12049](https://github.com/nrwl/ocean/pull/12049) | fix(polygraph): enforce repository permission claims |
| [#12048](https://github.com/nrwl/ocean/pull/12048) | fix(polygraph): bind onboarding provider identity |
| [#12044](https://github.com/nrwl/ocean/pull/12044) | fix(polygraph): remove legacy PAT login flow |
| [#12127](https://github.com/nrwl/ocean/pull/12127) | fix(polygraph): harden cli oauth approval |

**Login / session:**

| PR | Title |
|----|-------|
| [#12043](https://github.com/nrwl/ocean/pull/12043) | feat(polygraph): update login screen |
| [#12051](https://github.com/nrwl/ocean/pull/12051) | fix(polygraph): allow wasm-unsafe-eval csp on login routes |
| [#12052](https://github.com/nrwl/ocean/pull/12052) | fix(polygraph): iframe `embed/login` in `/login` instead |
| [#12027](https://github.com/nrwl/ocean/pull/12027) | fix(polygraph): remove clear-site-data from logout |
| [#12023](https://github.com/nrwl/ocean/pull/12023) | fix(polygraph): reflect resolved state in OAuth login header copy |
| [#12063](https://github.com/nrwl/ocean/pull/12063) | chore(polygraph): keep auth callback errors as-is for `handleError` |

**Demo + reliability:**

| PR | Title |
|----|-------|
| [#12026](https://github.com/nrwl/ocean/pull/12026) | feat(polygraph): open signups by removing allowSignup token gate |
| [#12072](https://github.com/nrwl/ocean/pull/12072) | fix(polygraph): repair demo provisioning retries |
| [#12033](https://github.com/nrwl/ocean/pull/12033) | fix(polygraph): handle duplicate manual relationships |
| [#12069](https://github.com/nrwl/ocean/pull/12069) | fix(polygraph): use primary mongo read for single user read |
| [#12111](https://github.com/nrwl/ocean/pull/12111) | fix(polygraph): remove standalone graph badge |

**UX / state:**

| PR | Title |
|----|-------|
| [#12133](https://github.com/nrwl/ocean/pull/12133) | fix(polygraph): stop polling when offline |
| [#12128](https://github.com/nrwl/ocean/pull/12128) | fix(polygraph): show graph activity while oss indexes |
| [#12066](https://github.com/nrwl/ocean/pull/12066) | fix(polygraph): fade in rive animation for less flickering |

**Work character:** Seventeen PRs in one week on a single auth/security surface is the pattern of a security audit response. The PRs follow a logical sequence — remove PAT login first, tighten OAuth secrets, enforce permission claims, CSP, then stabilize. If this was driven by a security audit or pentest findings, confirm the full finding list is closed. If proactive, note that this level of auth surface change warrants extra QA.

---

### @bcabanes (Benjamin) — CIPE timeline + nx-cloud app (11 merged)

**CIPE makespan + compute billing:**

| PR | Title |
|----|-------|
| [#11997](https://github.com/nrwl/ocean/pull/11997) | feat(nx-cloud): turn the CIPE critical path into a makespan verdict strip |
| [#12091](https://github.com/nrwl/ocean/pull/12091) | fix(nx-cloud): hide critical path on live CIPEs |
| [#11952](https://github.com/nrwl/ocean/pull/11952) | feat(nx-cloud): surface compute billing in the CIPE agent drawer |
| [#12092](https://github.com/nrwl/ocean/pull/12092) | fix(nx-cloud): label CIPE agent markers by task phase, not online state |
| [#12087](https://github.com/nrwl/ocean/pull/12087) | fix(nx-cloud): restore gutters on no-terminal task drawer states |

**Task drawer / task display:**

| PR | Title |
|----|-------|
| [#12016](https://github.com/nrwl/ocean/pull/12016) | feat(nx-cloud): move CIPE task-drawer Compare to a header action |
| [#12017](https://github.com/nrwl/ocean/pull/12017) | fix(nx-cloud): hide scheduled-implicitly tasks during in-progress runs |
| [#11984](https://github.com/nrwl/ocean/pull/11984) | fix(nx-cloud): sync drawer header name with chart sidebar |

**Accessibility + DX:**

| PR | Title |
|----|-------|
| [#11991](https://github.com/nrwl/ocean/pull/11991) | fix(nx-cloud): make copy-to-clipboard feedback accessible |
| [#11993](https://github.com/nrwl/ocean/pull/11993) | chore(repo): run isolated nx-cloud dev servers per worktree |
| [#12096](https://github.com/nrwl/ocean/pull/12096) | fix(nx-cloud): make runs/end hashDetails size cap configurable and printable |

**Work character:** Benjamin is in a sustained CIPE timeline push — makespan verdict strip, compute billing surface, task phase labels. These are all coherent additions to the same product screen. The per-worktree dev server isolation (#11993) is developer experience housekeeping that will reduce future port-collision friction.

---

### @MaxKless (Max) — Polygraph security + rename + UX (9 merged)

**Security (ran in parallel with nartc's auth work):**

| PR | Title |
|----|-------|
| [#12039](https://github.com/nrwl/ocean/pull/12039) | fix(polygraph): redact secrets on all CLI log-upload paths (NXA-1916) |
| [#12057](https://github.com/nrwl/ocean/pull/12057) | fix(polygraph): redact secrets on the activity-indicator sink (NXA-1907) |
| [#12055](https://github.com/nrwl/ocean/pull/12055) | fix(polygraph): gate session log reads against org/repo access (NXA-1888, NXA-1889) |

**Rename + UX:**

| PR | Title |
|----|-------|
| [#12059](https://github.com/nrwl/ocean/pull/12059) | feat(nx-cloud): rename "Polygraph" custom workflow to "Workspace analysis" |
| [#12018](https://github.com/nrwl/ocean/pull/12018) | chore(nx-cloud): remove old Polygraph feature name from copy and docs |
| [#12025](https://github.com/nrwl/ocean/pull/12025) | feat(polygraph): offer prepopulated URL list in bare-CLI welcome flow |
| [#12054](https://github.com/nrwl/ocean/pull/12054) | fix(polygraph): shift demo tour button left of the Pylon bubble |
| [#12065](https://github.com/nrwl/ocean/pull/12065) | fix(polygraph): register agent plugin when resuming a reconstructed session |

**Refactor:**

| PR | Title |
|----|-------|
| [#12019](https://github.com/nrwl/ocean/pull/12019) | refactor(polygraph): migrate icons from heroicons to lucide-react |

**Work character:** The three NXA-tagged security PRs are clearly tracked findings — secrets redacted on log paths, session logs access-gated. The rename from "Polygraph" to "Workspace analysis" is significant product copy — check whether this is consistent across the nrwl/nx docs (the nx-side docs cleanup from nartc/jaysoo this week doesn't mention this rename explicitly).

---

### @JamesHenry + @AI-JamesHenry — Polygraph terminal, TUI, session (7 merged)

| PR | Title |
|----|-------|
| [#12099](https://github.com/nrwl/ocean/pull/12099) | feat(polygraph): detect terminal theme and fix Windows TUI teardown crash |
| [#12058](https://github.com/nrwl/ocean/pull/12058) | feat(polygraph): session relayout coordinator + nova mux experience |
| [#12121](https://github.com/nrwl/ocean/pull/12121) | fix(polygraph): use tmux panes for materialization |
| [#12119](https://github.com/nrwl/ocean/pull/12119) | fix(polygraph): prefer active tmux and zellij sessions |
| [#12120](https://github.com/nrwl/ocean/pull/12120) | fix(polygraph): detect Codex Desktop for parent logs |
| [#12041](https://github.com/nrwl/ocean/pull/12041) | fix(polygraph): validate stored reference URLs |
| [#12077](https://github.com/nrwl/ocean/pull/12077) | fix(polygraph): include org members in session author filter |

**Work character:** Terminal and multiplexer stabilization — Windows TUI crash fix, tmux pane materialization, prefer-active-session logic. The "session relayout coordinator + nova mux experience" is the headline feature, restructuring how sessions present in the mux. The AI-JamesHenry suffix PRs reflect AI-assisted authoring — same contributor, different workflow.

---

### @rarmatei (Rares) — io-trace performance + workflow-controller (8 merged)

**io-trace performance:**

| PR | Title |
|----|-------|
| [#12029](https://github.com/nrwl/ocean/pull/12029) | perf(io-trace): O(1) literal directory matching in report analyzer |
| [#12028](https://github.com/nrwl/ocean/pull/12028) | perf(io-trace): log cgroup cpu.stat throttling in periodic stats |
| [#12076](https://github.com/nrwl/ocean/pull/12076) | feat(io-trace): cherry pick analyzer.go perf improvements + add CPU throttling logic |
| [#12074](https://github.com/nrwl/ocean/pull/12074) | chore(io-trace): make O(1) analyzer matchers the only path |
| [#12106](https://github.com/nrwl/ocean/pull/12106) | perf(io-trace): read leaf cgroup cpu.stat instead of node root |
| [#12064](https://github.com/nrwl/ocean/pull/12064) | fix(io-trace): stop a transient exclusion-config miss from poisoning a CI execution |

**Workflow-controller + nx-api build:**

| PR | Title |
|----|-------|
| [#12107](https://github.com/nrwl/ocean/pull/12107) | fix(workflow-controller): O(1) container PID delete in io-trace-daemon |
| [#12075](https://github.com/nrwl/ocean/pull/12075) | fix(nx-api): fail the build when nx-api ships a stale CLI bundle |
| [#12024](https://github.com/nrwl/ocean/pull/12024) | perf(gradle): disable unused distribution archive tasks for JVM apps |

**Work character:** Rares is in a focused io-trace algorithmic pass — three separate O(1) improvements (directory matching, container PID delete, cgroup cpu.stat reads), CPU throttling observability, and the poisoning fix. These are correctness and performance improvements to production trace analysis. The "cherry pick" pattern suggests these changes were originally on a feature branch and are now being stabilized.

---

### @mrl-jr (Michael) — Polygraph repository management + security (7 merged)

**Bulk repository operations:**

| PR | Title |
|----|-------|
| [#12102](https://github.com/nrwl/ocean/pull/12102) | feat(polygraph): bulk-connect from the same floating toolbar |
| [#12080](https://github.com/nrwl/ocean/pull/12080) | feat(polygraph): bulk-disconnect repositories with select-all across pages |
| [#12086](https://github.com/nrwl/ocean/pull/12086) | fix(polygraph): clear bulk-disconnect toolbar + modal on successful redirect |
| [#12031](https://github.com/nrwl/ocean/pull/12031) | feat(polygraph): paginate + search PAT connect-repos flow |

**Demo + navigation:**

| PR | Title |
|----|-------|
| [#12105](https://github.com/nrwl/ocean/pull/12105) | feat(polygraph): prompt demo orgs to connect their own repositories |
| [#12068](https://github.com/nrwl/ocean/pull/12068) | fix(polygraph): redirect /orgs to org dashboard instead of latest session |

**Security:**

| PR | Title |
|----|-------|
| [#12047](https://github.com/nrwl/ocean/pull/12047) | fix(polygraph): address several security findings |

**Work character:** Bulk repository operations are a new UX capability — connect/disconnect with select-all and pagination. These enable onboarding and housekeeping at scale. The security findings PR is untagged; check whether it maps to tracked NXA tickets or is independent from nartc/MaxKless's tracked work.

---

### @lourw (Lauren) — Billing, run group config, add-ons (7 merged)

**Billing:**

| PR | Title |
|----|-------|
| [#12113](https://github.com/nrwl/ocean/pull/12113) | feat(aggregator): bill dedicated compute cluster as a minimum spend |
| [#12083](https://github.com/nrwl/ocean/pull/12083) | feat(nx-api,nx-cloud): remove flat rates from usage add-ons |
| [#12118](https://github.com/nrwl/ocean/pull/12118) | fix(add-ons): remove misleading free-report allowance for resource usage |

**Run group config:**

| PR | Title |
|----|-------|
| [#12042](https://github.com/nrwl/ocean/pull/12042) | fix(nx-api): wire run group config into pipeline behavior |
| [#12112](https://github.com/nrwl/ocean/pull/12112) | fix(nx-api): invert heartbeat when converting run group config to/from legacy |
| [#12126](https://github.com/nrwl/ocean/pull/12126) | fix(nx-api): preserve RunGroupConfigSourceKind ordinals for old Kryo messages |

**Work character:** The billing changes (minimum spend for dedicated compute, flat rate removal) are live revenue-impacting changes. The Kryo ordinal preservation fix is a data-compatibility correctness issue — if ordinals are wrong, old-format messages from agents still on the previous protocol will silently misroute. Deserves explicit regression testing against legacy clients.

---

### @Cammisuli (Colum) — Polygraph sandbox + demo (3 merged)

| PR | Title |
|----|-------|
| [#12094](https://github.com/nrwl/ocean/pull/12094) | feat(polygraph): guide demo users to connect a real account after the demo |
| [#12061](https://github.com/nrwl/ocean/pull/12061) | fix(polygraph): fail closed on Claude trust when the sandbox can't engage |
| [#12062](https://github.com/nrwl/ocean/pull/12062) | fix(polygraph): contain pack-and-copy temp/tarball writes and session paths |

**Work character:** The sandbox fixes are security-adjacent — failing closed on Claude trust and containing temp writes are defensive correctness. The demo-to-real-account guidance is part of the coordinated demo-funnel work this week.

---

### @vsavkin (Victor) — Polygraph vector indexing + embeddings (2 merged)

| PR | Title |
|----|-------|
| [#11996](https://github.com/nrwl/ocean/pull/11996) | feat(polygraph): vector-index sessions for session-to-session association |
| [#12088](https://github.com/nrwl/ocean/pull/12088) | fix: set default Voyage endpoint to MongoDB embeddings |

**Work character:** Vector indexing of sessions for cross-session association is new AI infrastructure — sessions can now be linked by semantic similarity. The Voyage endpoint fix is a follow-up correctness patch.

---

### @nixallover (Nick) — Nx Cloud Rewind + demo welcome (2 merged)

| PR | Title |
|----|-------|
| [#12084](https://github.com/nrwl/ocean/pull/12084) | feat(nx-cloud): Nx Cloud Rewind (shareable workspace stats) |
| [#12085](https://github.com/nrwl/ocean/pull/12085) | feat(nx-cloud): add welcome dialog to demo |

**Work character:** Rewind is the largest new product feature this week — shareable workspace stats are a meaningful addition to the analytics surface. No tracking label on this PR. Confirm whether there is a launch plan / marketing coordination for this feature.

---

### @juristr (Juri) — Demo tour video (1 merged)

| PR | Title |
|----|-------|
| [#12071](https://github.com/nrwl/ocean/pull/12071) | feat(polygraph): embed walkthrough video in demo tour welcome step |

---

### @stevepentland — Workflow-controller CVE cleanup (2 merged)

| PR | Title |
|----|-------|
| [#12114](https://github.com/nrwl/ocean/pull/12114) | chore(nx-cloud-workflow-controller): update dependencies to clear cves |
| [#12104](https://github.com/nrwl/ocean/pull/12104) | chore(nx-cloud-workflow-controller): update go version to clear out cves |

**Work character:** Routine CVE hygiene — confirm the cleared CVEs were low/medium severity. High-severity CVEs in the workflow controller would warrant a separate note.

---

### @StalkAltan (Altan) — nx-api access + performance (2 merged)

| PR | Title |
|----|-------|
| [#12040](https://github.com/nrwl/ocean/pull/12040) | fix(nx-api): enforce repo access for Polygraph PR creation |
| [#12032](https://github.com/nrwl/ocean/pull/12032) | fix(nx-api): minimize upsert agent hot path write |

**Work character:** The repo access enforcement for Polygraph PR creation is security-adjacent — aligns with the broader auth hardening sprint. The upsert hot path write minimization is a targeted performance fix.

---

### @llwt — PostHog + Pylon support widget (2 merged)

| PR | Title |
|----|-------|
| [#12035](https://github.com/nrwl/ocean/pull/12035) | fix: enable hosted PostHog envs |
| [#11971](https://github.com/nrwl/ocean/pull/11971) | feat(nx-cloud): integrate Pylon in-app chat support widget (CS-109) |

**Work character:** Pylon is a new in-app support channel. Confirm whether this is gated or live for all users — if live, the support team should be notified.

---

### @jaysoo — Ocean: nx version bump + features (3 merged)

| PR | Title |
|----|-------|
| [#12116](https://github.com/nrwl/ocean/pull/12116) | chore(repo): migrate to nx 23.1.0-beta.4 |
| [#12036](https://github.com/nrwl/ocean/pull/12036) | feat(nx-cloud): add sandbox cta to the compare tasks page |
| [#12090](https://github.com/nrwl/ocean/pull/12090) | fix(ui-self-healing-ci): narrow storybook primitive imports |

---

## Needs Your Attention

### 1. Security sprint in Polygraph: what drove it?
**@nartc** (17 PRs), **@MaxKless** (3 NXA-tagged security PRs), **@mrl-jr** (untagged security findings), and **@StalkAltan** (repo access enforcement) all landed auth/security work in the same week. The MaxKless PRs reference specific NXA ticket numbers (NXA-1916, NXA-1907, NXA-1888, NXA-1889). **Ask: was this a scheduled security audit, a pentest engagement, or a reactive response to discovered issues?** If reactive, confirm the full finding list is closed. If a pentest report is outstanding, check whether any medium/high findings remain open.

### 2. "Workspace analysis" rename: is it consistent across repos?
**@MaxKless** renamed the custom workflow from "Polygraph" to "Workspace analysis" in Ocean (#12059, #12018). The nrwl/nx docs changes this week (jaysoo #36114, #36105) do not appear to reflect this new name. If users are pointed to docs that still say "Polygraph" for the workflow type, they'll be confused. **Audit the nx-side docs to confirm the rename propagated.**

### 3. Nx Cloud Rewind launch plan
**@nixallover** shipped "Nx Cloud Rewind" (#12084) — shareable workspace stats — with no feature flag or launch label visible. **Confirm: is this live for all users? Is there a coordinated marketing/docs moment for this, or did it ship quietly?** Shareable stats pages are externally visible URLs; if they went live without announcement, users may be surprised (positively or negatively).

### 4. Demo experience: four contributors, one coordinated launch?
This week's demo-related PRs came from **@nixallover** (welcome dialog, Rewind), **@mrl-jr** (prompt to connect real account), **@Cammisuli** (guide to real account after demo), **@juristr** (walkthrough video), and **@nartc** (demo provisioning retries, open signups). **Confirm there is a single owner for the demo funnel UX and that these contributions are landing in the intended order and sequence.** Four contributors touching the same first-run experience without tight coordination can produce an inconsistent flow.

### 5. Product Hunt banner: what's the correct timing?
**@barbados-clemens** added the Product Hunt launch banner (#36112) and then reverted it (#36129) in the same week. **Confirm the revert was intentional and the correct launch date is locked.** If the banner went live on the wrong date, some users may have seen it prematurely.

### 6. FrozenPandaz zip-slip fix in self-hosted cache: changelog / advisory?
[#36116](https://github.com/nrwl/nx/pull/36116) prevents path traversal / zip-slip in the self-hosted remote cache. **Confirm this will be noted in the v23.1 changelog or a security advisory** so users running self-hosted cache on older Nx versions are informed to upgrade. Path traversal is a class of vulnerability that users with self-hosted deployments need to act on.

### 7. Kryo ordinal preservation in run group config
**@lourw's** [#12126](https://github.com/nrwl/ocean/pull/12126) preserves `RunGroupConfigSourceKind` ordinals for old Kryo messages — a data compatibility fix. **Confirm explicit regression testing was done against agents still on the previous message format.** Kryo serialization bugs can be silent in testing and explosive in production when old-format agents connect.

### 8. Multiple e2e timeouts widened in Nx (four PRs)
**@FrozenPandaz** widened e2e timeouts for vite, release, maven, and rspack in one week. Four separate timeout widening PRs in the same week suggests the e2e suite is slower than the current budgets assumed. **Is this transient (cold build or resource contention in CI) or a signal that actual task durations are growing?** If the latter, it's worth investigating whether the test suite itself is getting slower as the number of packages scales.

---

_Generated by Claude Code · nrwl/nx + nrwl/ocean · PRs merged 2026-06-22 to 2026-06-28_
