# Nx Platform Update — April 2026

> **Reporting window:** 2026-04-01 through 2026-04-24 (month in progress).
> **Data gaps:** RedPanda team's 92 April issues captured at summary level only (issue-by-issue detail truncated by Linear's list API).

## TL;DR

- **Task Sandboxing (I/O Tracing) hits its target date today** — hermetic-build detection is shipping in 22.7 with an Nx Cloud UI that surfaces unexpected reads/writes per task. Island enabled on production; Legora actively evaluating; ClickUp running it in PoV.
- **Self-Healing CI now suggests what to auto-apply** (Juri's Apr 22 blog post) — agent makes the fix, customer approves in one click. ClickUp (Sofie) enabled the feature in April; SiriusXM actively using it.
- **One-page "Connect Workspace" flow** shipped for GitHub + GitLab — Nicole's team sees **2x claim rate** on the new flow vs. the original. The CNW A/B test also picked a winner: variant 1 ("Enable remote caching to speed up builds with Nx Cloud?") beat baseline **12.2% → 7.5% yes rate, a +63% lift**, and `nx init` now uses the same prompt.
- **Anaplan enterprise migration to AWS is active** — new single-tenant deployment built out in Terraform, ArgoCD, and Spacelift so Anaplan can use Private Link to their self-hosted GitHub. Large PoV milestone.
- **Security:** CVE-2026-25639 patched in axios (22.6.5, 22.6.4-era). Supply chain hardened by pinning every transitive dep of the `nx` package at publish time — no resolver freedom for end users. LGPL-licensed `@ltd/j-toml` replaced with BSD-3 `smol-toml` for compliance.
- **22.7.0 hits release candidate** (rc.1 on Apr 23) — ~11 betas of new feature work queued up for GA.

## Task Sandboxing & Hermetic Builds

Task Sandboxing (also called I/O Tracing) is Nx's biggest cross-functional initiative this month. It detects every file a task reads and writes, compares it to the task's declared inputs/outputs, and surfaces violations in the Nx Cloud UI. The net effect: cache correctness becomes verifiable rather than assumed, and the same machinery that catches mis-declared inputs sets Nx up for hermetic remote execution in future quarters.

**April delivered the first customer-visible cut.** Island runs it on production GCP, Legora is in evaluation, ClickUp exercised it heavily enough to trigger temporary rollback for stability tuning, and a long list of repo-internal sandbox violations were fixed so the Nx repo itself runs clean.

**CLI:**

- Task-level I/O detection and violation reporting landing across 22.7 betas — handles custom hashers as opaque inputs, supports allowUnixSockets for Claude Code environments, resolves multi-line typeof import detection, and ignores build artifacts in ESLint tasks.
- ~19 sandbox-violation fixes to the Nx repo itself (jest `.d.ts` reads, angular test `.template` inputs, readme-fragments, `.prettierignore`, dotnet `run-native-target` script, ESLint tsconfig chain, and more).
- `nx show target` got clearer output — deduped inputs, custom-hasher support, implicit `default` config hidden.

**Cloud:**

- Sandbox report UI polished: filter by read vs. write independently, URL filters no longer persist incorrectly across navigation, layout-shift fixes, "unexpected file filter" now actually populates the file tree.
- Tasks reading their own outputs no longer false-flag.

**Infrastructure:**

- Island (PoV) enabled sandboxing on their GCP single-tenant ([INF-1332](https://linear.app/nxdev/issue/INF-1332)); io-trace image pushed and verified.
- ClickUp's io-trace temporarily removed mid-month for tuning, large enterprise deployments got an io-tracing fix.

**Docs:**

- `allowUnixSockets` configuration page published — needed because Claude Code's default sandbox blocks Unix sockets and Nx's daemon/plugin isolation uses dynamic socket paths ([DOC-456](https://linear.app/nxdev/issue/DOC-456)).

**Customer signal:**

- **Legora** ([Pylon #718](https://app.usepylon.com/issues?issueNumber=718)) — "we'd like to explore this Sandboxing feature." Linked to [INF-1331](https://linear.app/nxdev/issue/INF-1331) for enablement on their instance. Feature Request priority Low but high strategic interest.
- **ClickUp** — actively running sandboxing in their DTE pipeline; April saw tickets on sandbox violations in CI builds/unit tests ([Pylon #702](https://app.usepylon.com/issues?issueNumber=702), [#754](https://app.usepylon.com/issues?issueNumber=754)). Hard usage, real feedback.
- **Island** — enabled on main GCP instance via infra change request.

**Docs & blog:**

- Docs: [Sandboxing feature page](https://nx.dev/docs/features/ci-features/sandboxing) (referenced by Legora).
- Docs: `allowUnixSockets` setting page.

**Who to contact:** Jason (project lead), Craigory, Leosvel, Louie, Rares.

## Self-Healing CI & AI-Powered Development

The platform's agentic story continued to expand in April on two fronts: the **Self-Healing CI** feature — which offers to auto-apply fixes when CI fails — got smarter about _what_ it offers, and the **CLI's agentic experience** picked up documentation, onboarding flows, and sandbox integration.

**Cloud:**

- [**Self-Healing CI Now Suggests What to Auto-Apply**](https://nx.dev/blog/self-healing-ci-auto-apply-suggestions) (Apr 22 blog post, Juri). The agent now presents selectable fixes the user can approve before applying.
- Large-repo `fix-ci` fix: when `git fetch` took >2 minutes, `fix-ci` would give up even though the SHAs were locally resolvable. Shipped in 2604.17.1.

**CLI:**

- `configure-ai-agents` now cleans up legacy `.gemini/skills` during runs (PR #35117) — bitrot prevention.
- `CLAUDECODE=1` no longer exits early in onboarding (Cloud 2604.01.1).
- `nx connect` flow for agentic onboarding documented ([DOC-412](https://linear.app/nxdev/issue/DOC-412)) — callout on nx.dev with copyable prompt + docs page.
- `nx-cloud onboard` documented for manual and agentic paths ([DOC-451](https://linear.app/nxdev/issue/DOC-451)).
- Agent-readiness SEO improvements from [isitagentready.com/nx.dev](https://isitagentready.com/nx.dev) feedback ([DOC-479](https://linear.app/nxdev/issue/DOC-479)).

**Customer signal:**

- **ClickUp** (Sofie Thorsen) — Self-Healing CI feature enablement ticket ([Pylon #523](https://app.usepylon.com/issues?issueNumber=523), Apr 1) — customer proactively opted into the feature.
- **SiriusXM** (Kyle Cannon) — asked for MCP server for enterprise integration: "we would love to tie it into our internal tooling reports" ([Pylon #655](https://app.usepylon.com/issues?issueNumber=655)). Feature request, Low priority but strategic.
- **SiriusXM** — Self-healing CI status updates are an ongoing thread ([Pylon #738](https://app.usepylon.com/issues?issueNumber=738), [#602](https://app.usepylon.com/issues?issueNumber=602)).

**Who to contact:** Juri, Max, Caleb (docs), Victor (strategy).

## Cloud Onboarding, Connect Workspace, and CNW Funnel

Three related streams of work all aimed at shortening time-to-first-value in Nx Cloud. April was mostly about cashing in experiment wins and shipping the flows that make onboarding one click instead of many.

**Cloud:**

- **Upgraded GitHub + GitLab "connect workspace" flow** (2604.23.1) — user authenticates once with their VCS, picks an Nx Cloud org, and the system auto-detects Nx workspaces across their repos and opens a PR with the config.
- **One-page Connect Workspace flow** completed for GitLab — [Nicole reports **>2x the claim rate** of the original flow](https://linear.app/nxdev/project/one-page-connect-workspace-flow-23149e6efc77).
- **Demo mode** for task and flaky-task analytics shipped for non-enterprise users (2604.11.1) — lets prospects see the UI without production data.
- **Onboarding remediation steps** added for CLI errors (2604.01.1).

**CLI:**

- **CNW A/B winner locked in** (PR #35154): variant 1 "Enable remote caching to speed up builds with Nx Cloud?" converted at **12.2% vs. 7.5% baseline — +63% relative lift**. `nx init` now uses the same prompt (PR #35155). Two new variants teed up for the next round.
- `nx init` prompts for setup mode when run in an empty git directory (PR #35226) — no more blank-slate confusion.
- Template shorthand names in CNW (22.6.4).
- Bundler validation for Angular presets in CNW (22.6.4).
- Handle `.` and absolute paths as workspace name in CNW (22.6.4).

**Infrastructure:**

- Valkey VCS cache rolled out to dev, staging, and production (NA + EU) — speeds up repository-graph lookups on the onboarding path.

**Docs:**

- [Nx Cloud pricing page refresh](https://linear.app/nxdev/project/nx-cloud-pricing-page-refresh-q1-2026-adc245a9d0b0) content finalized (Nicole), migrating to nx.dev Framer project now.
- [**Template-based onboarding**](https://linear.app/nxdev/project/template-based-onboarding-d4beeddcc9da) and [**Ocean DX improvements**](https://linear.app/nxdev/project/ocean-dx-improvements-2fa569261d96) projects both **completed** in April.

**Metrics (CNW/Init funnel — Apr 17 update, atRisk):**

- CNW starts: ~1.4K/day. Completions: ~1.5–2K/day (vs 2K target).
- Init completions: 300/day, +200% from March's 150/day — already past target.
- Init error rate: 27% (needs work).
- CNW 22.6.4 error rate: 5.9% (down from 8.5%).

**Who to contact:** Nicole, Jack, Caleb.

## Enterprise Single-Tenant Expansion (Multi-Cloud, Multi-Region)

April was a big month for the infrastructure side of the business — two projects completed, several customer migrations executed, and a new cloud-provider footprint stood up.

**Infrastructure:**

- [**Implement Multi-Cluster Agent Setups**](https://linear.app/nxdev/project/implement-multi-cluster-agent-setups-00f6853704b8) **completed 2026-04-02** (Steve). Facade observability + metrics + alerting shipped — end-to-end OpenTelemetry from API → facade → downstream → agent, workflow-mapping Valkey metrics, per-downstream latency Prometheus metrics.
- [**Europe-Provider Single Tenant Setup**](https://linear.app/nxdev/project/europe-provider-single-tenant-setup-feeee946efe4) **completed 2026-04-02** (Szymon). EU cloud-provider research + initial ST setup done.
- **Anaplan → AWS migration** (new PoV, [INF-1322](https://linear.app/nxdev/issue/INF-1322)): the Anaplan single-tenant is being moved from GCP to AWS so they can use Private Link to their self-hosted GitHub. 17+ infra commits land this in April across Terraform, ArgoCD app project, Spacelift, ECR pull-through cache, cred rotator, workflow controller, and MongoDB project rename.
- **CIBC** (PoV): node pools re-jigged (intel → amd), docker image update, SAML config update, FE health check bump.
- **Cisco** (PoV): SAML variables added.
- **ClickUp**: resource class expansion — 2c/8gb → 7/8/24 agents on 16–56c/64–224GB hosts + new test classes.
- **Mimecast** (enterprise): missing `ANTHROPIC_API_KEY` fixed.
- **Island** (PoV): sandboxing enabled on GCP instance.

**Cloud:**

- Snapshot / staging enabled `NX_CLOUD_TASK_METRICS_USE_APP_BUCKET` (paves the way for tenant-isolated metrics buckets).

**Active this month (in-flight):**

- [**Istio integration**](https://linear.app/nxdev/project/istio-integration-8c4bf121cbc9) — initial plan docs started Apr 2. mTLS, traffic control, observability hardening.
- [**Lighthouse MongoDB Tenant Connections**](https://linear.app/nxdev/project/lighthouse-enable-tenant-mongodb-connections-49a0f29693f9) — target 2026-04-24 (today). Credit-usage tool brought into Lighthouse, cronjob framework for mongo-queried billing summaries, read-replica preference.
- [**AWS GatewayAPI Implementation**](https://linear.app/nxdev/project/aws-gatewayapi-implementation-4f43ae8a388f) — started Apr 21. L7 load balancing follow-up.
- Single Valkey/Redis for multiple agent clusters (AWS sentinel module, tf).

**Who to contact:** Steve (multi-cluster + Istio), Szymon (EU + Valkey + Anaplan AWS), Patrick (Anaplan, CIBC, ClickUp, Mimecast, Island, Lighthouse), Altan (dev environments + Valkey rollout).

## Security & Compliance

Explicit theme because customers ask about this every quarter. April resolved one active CVE, pinned down the supply chain, and cleared an LGPL licensing risk.

**CLI:**

- **CVE-2026-25639 (axios)** patched in 22.6.5. Axios bumped to 1.13.5 in PR #35148, then again to 1.15.0 across all packages in PR #35237 for the 22.7 line. Customers on 22.6.x or earlier on 1.x axios should update.
- **`postcss-loader` bumped** to ^8.2.1 to eliminate transitive `yaml@1.x` CVE (22.6.4, PR #35028).
- **picomatch** bumped 4.0.2 → 4.0.4 (PR #35081).
- **ejs** pinned to 5.0.1 (PR #35157).
- **Supply chain hardening** ([NXC-4197](https://linear.app/nxdev/issue/NXC-4197), PR #35159): introduced `scripts/expand-deps.ts` which flattens every transitive dependency of the `nx` package into explicit pinned direct deps at publish time. End users get zero resolver freedom — defense-in-depth against the kind of transitive-compromise attacks the ecosystem has seen.
- **LGPL → BSD-3 swap**: `@ltd/j-toml` (LGPL) replaced with `smol-toml` (BSD-3) in PR #35188. Eliminates an LGPL surface for customers with strict compliance requirements.
- **Published package size reduced** via files allowlist in PR #35109.

**Customer signal:**

- **ClickUp** (Lars Backman) — followed up on the historical Nx breach asking "what versions of NX were affected and was NX as an organisation affected by the breach?" ([Pylon #524](https://app.usepylon.com/issues?issueNumber=524), Apr 1). Answered and closed same-day. Recurring conversation — worth having a canned response ready for new PoV onboardings.

**Who to contact:** Jason (releases), Jack (supply chain), Steve (IAM / security infra).

## Performance & Reliability

Routine but customer-visible work — daemon stability, JVM ecosystem stability, and a lot of input/hashing precision that makes caches correct.

**CLI:**

- **Gradle + Maven daemon accumulation fixed** (PR #35143) — on graph recalculation, daemons were piling up without being shut down. Jason reproduced in Victor's workspace.
- **Maven batch executor hang** from premature worker exit fixed (PR #35001).
- **Plugin worker phantom connections** fixed (PR #34823) — dead polling in plugin workers.
- **TUI perf fixes** (PR #35187) including page up/down shortcuts (PR #34525), parallel-slot capping by task count (PR #35299).
- **`nx --version` speed-up** by avoiding heavy imports (PR #35326).
- **aarch64 Linux crash on 16K/64K-page kernels** fixed (PR #35356) — affected Apple Silicon / specific ARM server kernels.
- **Warm-cache optimization** for task execution (PR #35172) — closes a long-standing issue.
- **`exec()` → `spawn()`** in run-commands to prevent maxBuffer crash on large output (PR #35256).
- **pnpm multi-document lockfiles** supported (PR #35271).
- **Daemon status check inlined** (PR #35273) — drops a subprocess workaround.
- Plugin loading errors now surface actual messages instead of swallowing them (PR #35138).

**Cloud:**

- `nginx` keepalive_timeout for npm pull-through cache reduced from 65s to 10s.

**Customer signal:**

- **Mimecast** (David Jellesma) — **cache hit rate dropped to 4%** ([Pylon #758](https://app.usepylon.com/issues?issueNumber=758), Apr 22). High-touch ticket, still open (waiting on us). **Priority for Sales / CS to track.**
- **SiriusXM** — multiple tickets on CI slowdown, task optimization, and intermittent red-to-green flakes ([Pylon #776](https://app.usepylon.com/issues?issueNumber=776), [#774](https://app.usepylon.com/issues?issueNumber=774), [#733](https://app.usepylon.com/issues?issueNumber=733), [#669](https://app.usepylon.com/issues?issueNumber=669)).
- **Legora** — general flakiness investigation inconclusive ([Pylon #762](https://app.usepylon.com/issues?issueNumber=762)), graph calculations fail in worktree ([Pylon #663](https://app.usepylon.com/issues?issueNumber=663)).
- **ADP** — cache misses investigation with differing ProjectConfiguration values ([Pylon #736](https://app.usepylon.com/issues?issueNumber=736)).

**Who to contact:** Jason, Craigory, Leosvel.

## CIPE Waterfall: Cloud's Big UI Redesign

The "CIPE Waterfall" project is a ground-up redesign replacing the current runs + agents + DTE views with a single unified pipeline visualization. It's one of the highest-visibility Cloud changes of the year.

**Cloud:**

- [CIPE Waterfall screen](https://linear.app/nxdev/project/cipe-waterfall-screen-5215deabf94d) project **target 2026-04-30, currently atRisk** (Ben Cabanes lead). Per Apr 22 update: 8 tickets shipped on `feat/nx-cloud/cipe-trace`:
  - Data pipeline decoupled from the old Runs view
  - Glanceable pipeline view (the core waterfall)
  - Critical path + dependency edges visualization
  - Failure visibility UX
  - Agent + task status sidebars
  - Data-correctness fixes (canceled tasks, timed-out agents, phantom `NOT_STARTED`, stuck `IN_PROGRESS`)
  - Developer-tools-style time navigation (scrub the timeline)
  - Time axis + minimap polish
- 9 open: test coverage, empty state, feature parity with Runs + Agents on three detail panels (agent / task / command), filter shortcuts, run comparison. Merge blocker + 3 high-priority parity tickets = ~a week of work.
- Also shipped this month: cancellation source stored on CIPE ([Q-323](https://linear.app/nxdev/issue/Q-323)), replay-extraction memory spike fixed ([Q-325](https://linear.app/nxdev/issue/Q-325)), cache upload handling fixed on PRs ([Q-347](https://linear.app/nxdev/issue/Q-347)).

**Who to contact:** Ben, Jason.

## Ecosystem & Framework Support

**CLI:**

- **Vite 8 compatibility**: esbuild bumped for new projects (PR #35132), sass bumped for Vue/Nuxt presets (PR #35073), vitest + plugin-react-swc versions updated (PR #35062).
- **React Router**: Vite 7 forced when using React Router in framework mode (PR #35101), Vite 8 support for React Router apps (PR #35365).
- **Angular**:
  - angular-rspack HMR issues fixed (PR #35294)
  - angular-rspack Windows path separator normalization for i18n (PR #35252)
  - angular-rspack fileReplacements → resolve.alias (PR #34197)
  - Storybook and Playwright added as implicit dependencies (PR #35224)
  - Tsconfig path preservation when adding secondary entry points (PR #35254)
- **Module Federation**: `@module-federation/enhanced` bumped to ^2.3.3 (PR #35314).
- **Gradle**:
  - Kotlin compile task inferred input extensions (PR #35335)
  - Project graph timeout defaults increased (PR #35058)
  - Atomized CI target generation: shared task computation hoisted out of per-class loop (PR #35199)
- **Next.js**: semver added to required packages in update-package-json (PR #35384).
- **TypeScript**: .d.cts/.d.mts declared as typecheck inputs/outputs (PR #35357); tsgo recognized in dependency-checks (PR #35048); swc-node/ts-node warning on Node 22.18+ suppressed (PR #35247); baseUrl generation stopped in new tsconfigs (PR #34965).

**Who to contact:** Leosvel (angular-rspack), Colum (package health), Jason, Craigory.

## Major Version Deprecations (v23 Prep)

April was the deprecation-planning month for v23.

**CLI:**

- [Major Version Deprecations](https://linear.app/nxdev/project/major-version-deprecations-7f2a269d3fd6) project (Jason, onTrack, target 2026-05-08) completed its executor & plugin deprecation sweep on Apr 20:
  - **13 warn-only executor deprecations** planned: cypress, expo, jest, next, playwright, react-native, rollup, rspack, storybook, vite, vitest, webpack, eslint.
  - **3 full-package deprecations**: `@nx/detox`, `@nx/remix`, `@nx/rsbuild`.
  - **4 design discussions open**: `@nx/esbuild`, `@nx/js` feature parity, MF orchestration, `@nx/angular`.
  - **Kept as-is**: gradle, maven, web:file-server, docker, module-federation, vue, workspace.
- Progress: v22 = 100%, v23 = 27%.

**Who to contact:** Jason.

## Docs & Blog

**Blog posts published in April:**

- [Self-Healing CI Now Suggests What to Auto-Apply](https://nx.dev/blog/self-healing-ci-auto-apply-suggestions) — Juri, Apr 22.
- [Deploying a PNPM Monorepo to Cloudflare Pages](https://nx.dev/blog/pnpm-monorepo-cloudflare-pages) — Juri, Apr 20.
- [Sharing Tailwind CSS Styles Across Apps in a Monorepo](https://nx.dev/blog/sharing-tailwind-styles-nx-monorepo) — Juri, Apr 9.

**Docs:**

- Blog migration to TanStack Start on master.nx.dev substantially complete — header/footer match Framer, image optimization research done, sitemap rewritten to `<BLOG_URL>/blog/sitemap.xml`, testimonial Markdoc tag rendering fixed, CTA styles aligned. Old blog cleanup shipped (`BLOG_URL` now required on Netlify).
- Docs agent-readiness improvements ([DOC-479](https://linear.app/nxdev/issue/DOC-479)), SEO for agents investigation ([DOC-473](https://linear.app/nxdev/issue/DOC-473)).
- `no-output-timeout` launch-template option documented ([DOC-488](https://linear.app/nxdev/issue/DOC-488)).
- Tutorial engagement improvements — sidebar reorganized, ToC added, CTA updated, remote cache / Powerpack redirects reviewed.
- Versioned docs decision: Next.js versioned deployments replaced with static HTML snapshots via Netlify branch deploys at `{version}.nx.dev/docs` ([DOC-69](https://linear.app/nxdev/issue/DOC-69)).

**Who to contact:** Jack (docs), Caleb (docs, agentic), Philip (blog).

## Coming Soon

- **22.7.0 GA** — rc.1 landed Apr 23; GA imminent.
- **CIPE Waterfall** targeted Apr 30 (atRisk).
- **`nx migrate` revamp** ([Loom demo](https://www.loom.com/share/e344050bf5224fc6b1add68c81bfee4a)) — starts in earnest after Task Sandboxing wraps.
- **Extending Target Defaults** — Craigory, started Apr 21, target Apr 30.
- **Nx Local Dist Migration** — migrating every Nx package from `dist/packages/X` → `packages/X/dist` with `nodenext` module resolution. Target 2026-05-08.
- **v23 deprecation rollout** continues.

## Breaking Changes / Action Required

**None shipped in stable releases this month.** 22.6.x → 22.7.x will introduce the deprecation warnings described above but all are opt-out via `nx release` patterns; no forced breaks.

CIs running on 22.6.x are recommended to patch to **22.6.5** (or newer) for the axios CVE fix.

## By the Numbers

| Metric                                 | Count                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------- |
| CLI stable releases                    | 3 (22.6.4, 22.6.5, 21.6.11)                                            |
| CLI pre-releases (22.7.x beta/rc)      | 10                                                                     |
| Cloud releases                         | 6                                                                      |
| Human-authored infra commits           | ~85                                                                    |
| Linear issues completed                | ~260 across 5 teams (CLI 79, Cloud 41, Infra 27, RedPanda 92, Docs 21) |
| Linear projects completed              | 7                                                                      |
| Pylon support tickets (enterprise/PoV) | ~85 across 10 customer accounts                                        |
| Blog posts published                   | 3                                                                      |

## Questions? Contact

- **Task Sandboxing / I/O Tracing**: Jason, Craigory, Leosvel, Louie, Rares
- **Self-Healing CI / AI / Agentic**: Juri, Max, Caleb, Victor
- **Onboarding, Connect Workspace, CNW funnel**: Nicole, Jack
- **CIPE Waterfall**: Ben, Jason
- **CLI Core / Performance**: Jason, Craigory, Leosvel
- **Security / Supply Chain**: Jason, Jack
- **Infrastructure / Enterprise deployments**: Steve, Szymon, Patrick, Altan
- **Docs / Blog**: Jack, Caleb, Philip
- **Customer Support (Pylon)**: Steven, Caleb

_Generated on 2026-04-24. For the full technical changelog across CLI, Cloud, Infrastructure, and Linear, see `nx-digest-2026-04-changelog.md`._
