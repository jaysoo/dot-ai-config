# Nx Platform Update — May 2026

> **Data gaps:** Linear MCP and Pylon MCP were not authenticated in this run, so Linear issue counts, Linear project status, and per-customer Pylon ticket details are estimated/derived from secondary sources (Notion-Linear search, infra commits, Slack threads, blog posts). Numbers in "By the Numbers" carry less precision than April's. Recommend re-authenticating both MCPs before next monthly run.

## TL;DR

- **Nx Console v18.95.0 supply-chain compromise** — A malicious Nx Console build was published to the VSCode marketplace on May 18 after an attacker compromised a contributor's GitHub credentials via the upstream `tanstack` supply-chain attack. Scope: VSCode extension only (CLI / official plugins / Nx Cloud unaffected). Removed within 11-37 minutes; initial Microsoft estimate of 28 affected users later revised up to 6k-8k, with credible signal that GitHub itself was hit through it. Public postmortem published May 21. New approval gates added to all future Nx Console releases.
- **Nx 23.0.0 beta line in heavy iteration** — 15 betas shipped in May (5 through 19) on the way to GA. The release is a big breaking-change cleanup: drops Node 20, removes vitest from `@nx/vite` in favor of standalone `@nx/vitest`, removes the cypress and detox executors, drops `self`/`dependencies` magic strings in `dependsOn`, removes the legacy `initTasksRunner` API, drops SVGR/webpack plugin re-exports. New tab-completion (bash/zsh/fish/powershell), native Node.js TypeScript stripping by default, and `nx migrate --mode/--multi-major-mode` flags also landed.
- **Nx 22.7.2 and 22.7.3 patch releases** — Stable line stayed maintained alongside the beta work. Highlights: native v8 compile cache enabled, Maven 4 build state serialization, Gradle Windows path support, pnpm 11.2.2 support, axios bumped to 1.16.0 across all packages for a multi-CVE roll-up.
- **Nx Cloud unified CI config + sandbox-violation AI fix flow** — Single `.nx/ci.yaml` now controls all run-group settings (lifecycle, DTE, agents, AI) with `overrides` per run group. CIPE sandbox-violation warning was redesigned into a collapsible disclosure with an AI-assisted fix flow side-by-side with the manual `nx-cloud validate sandbox-violations` workflow.
- **Polygraph went from internal demo to launch-ready** — Demo enabled in snapshot + production NA, GitHub webhook + GitHub App env vars wired up in production, sign-up still gated behind `POLYGRAPH_SIGNUP_ALLOW_TOKEN`, early-access microsite live. Official launch scheduled for June 23 with full GTM plan in place. In-app "Create new Nx Workspace" flow was retired to push users to CLI + connect.
- **Infrastructure shifted to partitioned/dedicated compute** — New `gcp-partitioned-agents-cluster` Terraform module, `workflow-controller-downstream` Helm chart, multi-subnet nodepools, dedicated-compute YAML appset, BuildKit registry build cache, network policy default-deny across namespaces, topology-spread rules to prevent single-zone clustering. Production NA Workflows now regionally isolated with Gateway + HTTPRoute + ExternalDNS. RBC SAML/SCIM wired up; Emeria, CIBC, Skyscanner, Island all got customer-specific changes.

## Nx 23.0.0 Beta Line

15 betas shipped in May (5 -> 19). Major theme: aggressive cleanup of long-deprecated APIs, executor consolidation around inferred plugins, and a v8 compile-cache + TypeScript-stripping performance pass. GA still ahead.

**CLI breaking changes (all in 23.0.0-beta.X):**
- Drop Node 20 support (beta.9)
- Remove `vitest` executor support from `@nx/vite` — moved to standalone `@nx/vitest` (beta.9)
- Deprecate `@nx/cypress:cypress` and `@nx/detox` build/test executors (beta.6)
- Remove deprecated `ngrx` Angular generator (beta.9)
- Drop legacy `self`/`dependencies` magic strings in `dependsOn` (beta.10)
- Drop legacy typescript bundling plugin, align rollup `buildLibsFromSource` (beta.8)
- Remove deprecated `initTasksRunner` API (beta.14)
- Drop deprecated webpack plugin re-exports (beta.18, .19)
- Drop `releaseTag*` flat properties (beta.13)
- Remove SVGR option (provide `withSvgr` migration) (beta.10)
- Remove deprecated `js` option from component generators (beta.10)
- Move `@nx/jest`, `@nx/eslint`, `@nx/vitest`, `@nx/cypress`, `@nx/playwright`, `@nx/vite` to local-dist build (beta.16, .17, .19)

**CLI features:**
- **Shell tab-completion** for bash, zsh, fish, powershell (beta.18, [PR #34951](https://github.com/nrwl/nx/pull/34951))
- **Native Node.js TypeScript stripping** enabled by default (beta.16, [PR #35608](https://github.com/nrwl/nx/pull/35608))
- **Native v8 compile cache** support (beta.9, [PR #35415](https://github.com/nrwl/nx/pull/35415))
- **`nx migrate --mode` and `--multi-major-mode`** flags for multi-major migrations (beta.10)
- **Prompt field in migration entries** with prompt-only migration support (beta.12, .13, .17)
- **`prompt` generator migrations** converted to use prompt field (beta.17)
- **Filtered array-shape `targetDefaults`** with projects + source filtering (beta.13)
- **`nx watch --includeDependentProjects` renamed to `--includeDependencies`** (beta.13)
- **`nx mcp` runs outside an Nx workspace** (beta.10)
- **Gradle batch task streaming** — results stream to nx as they finish (beta.5)
- **Cypress 15.14 bump + stale Vite 8 guard removed** (beta.10)
- **Vite 7 -> 8 migration** (beta.10)
- **`detect-vscode-copilot-ai-agent`** added to agent detection (beta.18)
- **pnpm 11.2.2 support** (beta.19)

**Who to contact:** Jason, Craigory, Leosvel, Max

---

## Nx 22.7 Stable Maintenance

Two patch releases on the 22.7 line (22.7.2 May 14, 22.7.3 May 22) kept stable users supported while 23 betas churned.

**CLI:**
- **22.7.2 (May 14)** — Native v8 compile cache, Maven 4 build state serialization, Gradle Windows path support, axios -> 1.16.0 (multi-CVE roll-up), minimatch -> 10.2.5, telemetry workspace_id dimension, allow `nx mcp` outside a workspace, support skipped batch tasks end-to-end (fixed TUI double-logs), unique telemetry user_id ([release notes](https://github.com/nrwl/nx/releases/tag/22.7.2))
- **22.7.3 (May 22)** — pnpm 11.2.2 support, stop inferring `projects: 'self'` in `dependsOn`, warn before installing unknown npm packages as preset, fall back to npm publish when bun publish fails with auth error, vscode copilot agent detection, preserve input order in `createNodes` plugin results, multi-version compliance fixes for `@nx/rspack`/`@nx/rsbuild`, gradle e2e pinned to installed JDK ([release notes](https://github.com/nrwl/nx/releases/tag/22.7.3))

**Who to contact:** Jason, Craigory, Leosvel

---

## Nx Cloud — Unified CI Config + Sandbox AI Fix Flow

Two big Cloud features shipped in May. Both center on consolidating customer-facing surfaces: one for run-group configuration, one for sandbox-violation remediation.

**Cloud:**
- **Unified CI config file (`.nx/ci.yaml`)** — Single file controls lifecycle flags, AI behavior, DTE, agents, and environment variables. Supports `overrides` per run group (e.g. `e2e-run-group`, `release-run-group`). Backward compatible with previous CLI flags. (2605.04.6)
- **CIPE configurations page redesigned** — Run-group settings now reflect the new config file. Settings page reorganized into Lifecycle / DTE / Nx Agents / AI sections with sidebar navigation. Configuration-value origins now visible (config file, override, CLI flag, default). (2605.05.11)
- **Sandbox-violation CIPE warning redesigned** — Collapsible disclosure with a violation counter, an AI-assisted fix button, expandable section with a copy-able prompt for coding agents, and a parallel manual workflow using `nx-cloud` commands. (2605.14.14)
- **`nx-cloud validate sandbox-violations` CLI** — New command that verifies a prior run's sandbox-violation report would still be considered violations against current workspace config. (2605.14.13)
- **Self-Healing AI agent resolution rewritten** — In CI environments, the AI agent that powers Self-Healing CI no longer conflicts with or reuses existing installations of the model's CLI or agent harness. (2605.13.4)
- **Self-Healing fixes** — Hard-fail `fix-ci` step when no AI token provider is configured; always show "enable AI" setting in org settings (2605.05.9); frontend validation no longer blocks Self-Healing filters with leading `@` (2605.13.4)
- **In-app "Create new Nx Workspace" flow retired** — Users now directed to `npx create-nx-workspace@latest` + connect via Get Started. (2605.21.5)
- **Get-started page refreshed** with paths for incorporating Nx or Nx Cloud into existing projects (2605.14.15)
- **Custom registry support enhanced** for yarn (2605.13.4)
- **GitHub stale-token UX** — When connecting a workspace with a stale GitHub token, users can now refresh their GitHub account connection instead of hitting an opaque error. (2605.13.16)
- **Assignment-rules ordering bug** — Less-specific rules were overriding more-specific ones due to definition-order matching; fixed to use specificity. (2605.01.1)
- **Assignment-rules attachment** — Rules defined in distribution config file now attach to run groups correctly. (2605.04.8)
- **S3 artifact downloads** — Restored `.tar.gz` extension on artifacts downloaded from task details view on S3-backed instances. (2605.04.9)
- **Agent multi-continuous-task startup** — Resolved an issue where Nx Cloud agents could fail when starting multiple continuous tasks during distributed execution. (2605.19.8)
- **axios -> 1.16.0** for the multi-CVE roll-up (prototype pollution, CRLF/header/null-byte injection, SSRF, NO_PROXY bypass, XSRF token leakage, DoS) (2605.07.1)
- **Enterprise usage screen** — Date parsing fixed so CSV downloads work in Safari and dates display correctly in Firefox (2605.21.8)

**Who to contact:** James, Jonathan, Max, Mark, Nicole

---

## Security

A heavy security month dominated by the Nx Console v18.95.0 incident plus broad supply-chain patching across CLI and Cloud.

### Nx Console v18.95.0 supply-chain compromise (May 18)

- **What happened**: A malicious version of the `nx-console` VSCode extension (v18.95.0) was published after an attacker compromised a contributor's GitHub credentials via the upstream `tanstack` supply-chain attack (same vector that hit hundreds of npm packages).
- **Scope**: VSCode extension only. **Nx CLI, official `@nx/*` plugins, and Nx Cloud were NOT affected.** Older Nx Console versions (e.g. 18.94.0) are safe; 18.100.0 is the fixed forward version.
- **Detection**: A maintainer recognized an unexpected publisher-notification email within minutes. Removal followed in 11-37 minutes.
- **Impact (revised)**: Microsoft's initial estimate was 28 users; later signals suggest 6k-8k installs actually pulled the bad build. Credible signal that GitHub itself was hit through one of those installs (private source incident).
- **Response**: Public postmortem published May 21 ([blog](https://nx.dev/blog/nx-console-v18-95-0-postmortem)). Credential rotation guidance issued. Process improvements added: approval gates required for future Nx Console releases.

### Other CLI security work

- **axios -> 1.16.0 across all packages** ([PR #35568](https://github.com/nrwl/nx/pull/35568)) — multi-CVE roll-up (prototype pollution, CRLF/header/null-byte injection, SSRF, NO_PROXY bypass, XSRF token leakage, DoS). Shipped in 22.7.2 + 23.0.0-beta.8 + Cloud 2605.07.1.
- **minimatch -> 10.2.5** ([PR #35569](https://github.com/nrwl/nx/pull/35569)) — closes ReDoS path.
- **`nx console` provenance check** ([PR #35485](https://github.com/nrwl/nx/pull/35485)) — verifies status path provenance, hardens against future Console compromise scenarios.
- **`access-control` header removed from graph app** ([PR #35494](https://github.com/nrwl/nx/pull/35494)) — removed misconfigured permissive header.
- **MongoDB enterprise key rotation** — keys rotated across AWS + GCP enterprise tenants (multiple `security(mongo,enterprise,all)` commits May 18).

### Cloud security

- **axios -> 1.16.0** (Cloud 2605.07.1) — same multi-CVE remediation.

**Who to contact:** Jack, Jason, Jeff, Nicole, Szymon

---

## AI-Powered Development & Agentic Experience

Continued investment across CLI agent detection, MCP, Polygraph, and Self-Healing CI.

**CLI:**
- **vscode copilot AI agent detection** added (22.7.3 + 23.0.0-beta.18)
- **`nx mcp` runs outside workspace** (22.7.2 + 23.0.0-beta.10) — better agent UX when no workspace is loaded
- **Prompt-only migration entries** — migrations can now ship a `prompt` field that drives interactive remediation via an AI agent (23.0.0-beta.12, .13, .17)
- **AI doc corrections** for vite migration ([PR #35647](https://github.com/nrwl/nx/pull/35647))

**Cloud:**
- **Self-Healing AI agent isolation in CI** (2605.13.4) — no longer conflicts with existing CLI/agent harness installs
- **Sandbox-violation AI fix flow** (2605.14.14) — copy-able prompt for coding agents

**Polygraph:**
- Demo enabled in snapshot + production NA (May 19, 20)
- GitHub webhook + GitHub App env vars wired up across dev + prod (May 11-18)
- Sign-up gated behind `POLYGRAPH_SIGNUP_ALLOW_TOKEN` env var (May 15, 18)
- Multi-agent support continues from April (Claude, Codex, OpenCode, Cursor)

**Docs analytics:**
- New tracking for code-copy, LLM-prompt-copy, and YouTube interactions on nx.dev docs ([PR #35526](https://github.com/nrwl/nx/pull/35526)) — feeds the agent-readiness signal stream

**Blog posts:**
- [Shift Left Isn't Working: Because We're Shifting the Wrong Thing](https://nx.dev/blog/shift-left-isnt-working) — Josh VanAllen, May 7. Argues for encoding security/compliance/standards as inputs BEFORE development begins, especially as AI agents generate code faster than humans can review.

**Who to contact:** James, Max, Jack, Jonathan, Juri, Josh

---

## Polygraph — Launch Imminent

Polygraph moved from internal alpha to public-launch posture in May. Production deployment, GitHub App, demo data, microsite, and GTM plan all came together. Official launch scheduled for **June 23, 2026** (Tier 1).

**Infrastructure (29 polygraph-related commits in May):**
- Production polygraph deployment added (May 11, Steve)
- Polygraph image targeting in repo
- GitHub webhook + GitHub App env vars in api container + polygraph deployment (May 13-18, Chau, Mark, James)
- `POLYGRAPH_SIGNUP_ALLOW_TOKEN` deployed across dev + prod, then moved into polygraph-only deployment (May 15-18)
- Polygraph demo values + demo enable in snapshot + production NA (May 19-20, Chau, Steve)
- Polygraph app URL set as global env (May 15)
- Polygraph GitHub app slug updated for NA (May 16)

**GTM / Product:**
- **Polygraph - Product Messaging Doc** finalized May 11 (one-sentence positioning: "Polygraph lets engineering teams make coordinated changes across multiple repositories")
- **Early Access Microsite** live (full product content, not a "coming soon" placeholder; lightweight email signup, not gated beta)
- **GTM Launch Plan** complete with newsletter engagement, voting day, launch-day comms

**Coming Soon:**
- Polygraph public launch June 23, 2026
- Standalone polygraph CLI and polygraph-mcp continue maturing (separately published)

**Who to contact:** James, Max, Chau, Jonathan, Mark, Steve, Victor

---

## Infrastructure & Scale

The infrastructure focus in May was the **partitioned/dedicated compute architecture** — a major restructure to give Nx Cloud's workflow controllers their own isolated agent clusters per tenant, with regional isolation in production NA.

**Partitioned / Dedicated Compute architecture (50+ commits):**
- **New Terraform module**: `gcp-partitioned-agents-cluster` (Patrick, May 6) — full module for spinning up dedicated agent clusters
- **New Helm chart**: `workflow-controller-downstream` (Patrick, May 11) — chart for downstream workflow controllers
- **Dedicated-compute YAML appset** (Patrick, May 8) — Deploy-Once YAML for partitioned cluster
- **Multi-subnet nodepools** in the cluster (Patrick, May 8)
- **Nx-cloud-workflows daemonset** on tenant nodes (Patrick, May 22)
- **Controller chart values** + chart structure (Patrick, May 13)
- **BuildKit registry build cache** with TOML configuration (Patrick, May 13, 19)
- **Single file per tenant** in dedicated compute (Patrick, May 14)
- **Cache registry** + cache:80 cache addr in dedicated (Patrick, May 14, 19)
- **Network policies**: cross-namespace deny by default, in-namespace communication allowed, `enforce=privileged` for dind pods (Steve + Patrick, May 12-13)
- **Topology spread** rules to prevent single-zone clustering (Steve, May 12)
- **Production NA partitioned agent cluster** initial form (Steve, May 21)
- **CloudArmor policies** for partitioned agent cluster (Patrick, May 22)

**Production NA Workflows regional isolation (May 20):**
- Gateway + HTTPRoute for shared-tenant wf controller (Patrick)
- External DNS deployment for workflows-na (Patrick)
- Facade HTTPRoute (Patrick)
- Facade deployment prepped for dedicated cluster (Steve)
- Workflow controller resource classes aligned with staging (Altan)

**Valkey/Cache:**
- Valkey values for nx-cloud-frontend (Altan, May 23)
- Valkey in dedicated workflows (Patrick, May 11)
- Valkey configs fixed for dev controller (Patrick, May 15)
- prod-na Valkey memory temporarily doubled, then reverted (Altan, May 11)

**Observability:**
- OTEL env for nx-api added across enterprise Azure (Patrick, May 21)
- nx-api startup probes added in production NA + EU (Altan, May 22)
- Linear token / team ID added to nx-api in dev/staging/prod-na (Steve, Louie, May 21)

**Enterprise customer changes:**
- **RBC**: SAML cert/entrypoint wired up (AWS), SAML_SCIM_JWT_SECRET and SAML_SESSION_MAX_AGE set (Steve, Patrick, May 12, 22)
- **Emeria**: enabled overall + iotrace enabled (Patrick, May 20)
- **Skyscanner**: Anthropic Token added (Patrick, May 14) — enables their Self-Healing CI usage
- **CIBC**: Sandboxing enabled, iotrace daemonset added then iotrace disabled (Patrick, May 4-5), Option 2 access control enabled (Rares, May 8)
- **Island**: nx-api replicas bumped to 10 (Altan, May 1); image-bump revert (Altan, May 24)
- **Azure enterprise (all)**: FE pod limits bumped to match AWS/GCP, iotrace permissions / repo imagepull / podLabels enabled (Patrick, May 4)

**Mongo enterprise key rotation:**
- Keys updated across AWS + GCP enterprise tenants for multiple mongo scenarios (Steve, May 18)

**Ocean Snapshot Org -> Dedicated Compute** (Patrick, May 21) — the snapshot org for internal dogfooding moved onto the new dedicated-compute architecture.

**Who to contact:** Steve, Patrick, Altan, Louie, Rares, Chau

---

## Sandboxing & IO-Tracing

Sandboxing moved further into the "fix Nx repo's own violations" phase from April, plus the customer-facing Cloud surfaces got their AI-assisted remediation flow.

**CLI:**
- Resolved graph-client build-client sandbox violations (23.0.0-beta.8)
- Multi-version compliance fixes for various plugins (sandbox-related correctness): `@nx/cypress` (beta.12), `@nx/playwright` (beta.10), `@nx/rspack`/`@nx/rsbuild` (beta.13), `@nx/jest` (beta.16), `@nx/eslint` + `@nx/eslint-plugin` (beta.17), `@nx/esbuild` (beta.19)
- Stop inferring `projects: 'self'` in `dependsOn` entries (22.7.3 + 23.0.0-beta.12)
- Bundling: include tsconfig solution input for rollup/webpack (22.7.2)
- Reference vitest.config in eslint dep-checks for vitest libs ([PR #35460](https://github.com/nrwl/nx/pull/35460))
- Strip glob from inferred outputs before resolving as path ([PR #35463](https://github.com/nrwl/nx/pull/35463))
- Cypress: handle absolute screenshotsFolder/videosFolder paths ([PR #35624](https://github.com/nrwl/nx/pull/35624))
- Exclude dist + out-tsc from default jest module path scan ([PR #35619](https://github.com/nrwl/nx/pull/35619))
- Plugin lint checks should use `dependentTasksOutputFiles` ([PR #35755](https://github.com/nrwl/nx/pull/35755))

**Cloud:**
- **Sandbox-violation CIPE warning redesign** with AI-assisted fix flow (2605.14.14) — see Cloud section
- **`nx-cloud validate sandbox-violations` CLI** for verifying historical reports against current config (2605.14.13)
- **Sandboxing analytics dashboard** enabled in dev/staging (Rares, May 13)
- **ebpf-only classification** for io-trace-daemon enabled, reverted, re-enabled in dev/staging through May 19-21

**Infrastructure:**
- **iotrace enabled on Emeria** (Patrick, May 20)
- **iotrace enabled on Azure enterprise tester** (Patrick, Apr 30 + May 4)
- **CIBC iotrace daemonset added** (Patrick, May 4) then **disabled** (Patrick, May 4) — quick toggle during stabilization

**Who to contact:** Rares, Louie, Craigory, Leosvel

---

## Documentation & Developer Experience

**Docs (Jack, Caleb):**
- **Documentation analytics shipped** — code-copy, LLM-prompt-copy, YouTube interaction tracking on nx.dev docs ([PR #35526](https://github.com/nrwl/nx/pull/35526), 22.7.2)
- **Nested CLI subcommand documentation** beyond two levels supported ([PR #35519](https://github.com/nrwl/nx/pull/35519), 22.7.2)
- **Bot probes short-circuited** in framer rewrite edge function ([PR #35527](https://github.com/nrwl/nx/pull/35527), 22.7.2)
- **`Nx Console v18.95.0 postmortem`** blog post published May 21 ([link](https://nx.dev/blog/nx-console-v18-95-0-postmortem))

**Blog posts published in May 2026:**
- [Postmortem: Nx Console v18.95.0 supply-chain compromise](https://nx.dev/blog/nx-console-v18-95-0-postmortem) — Jack Hsu, May 21
- [Shift Left Isn't Working: Because We're Shifting the Wrong Thing](https://nx.dev/blog/shift-left-isnt-working) — Josh VanAllen, May 7

**Who to contact:** Jack, Caleb, Juri, Josh

---

## Breaking Changes / Action Required

**Nx 23.0.0 betas (cumulative through beta.19):**
- **Drop Node 20 support** — Node 22+ required (beta.9)
- **`@nx/vite` no longer exports vitest** — move to `@nx/vitest` standalone package (beta.9)
- **`@nx/cypress:cypress` executor deprecated** (beta.6)
- **`@nx/detox` build and test executors deprecated** (beta.6)
- **Deprecated executors with inferred-plugin replacements** flagged (beta.9)
- **`@nx/angular:ngrx` generator removed** — use `@nx/angular:ngrx-root-store` + `@nx/angular:ngrx-feature-store` (beta.9)
- **Legacy `self`/`dependencies` magic strings in `dependsOn` dropped** (beta.10) — first turned into warning (beta.13), then dropped
- **Legacy typescript bundling plugin removed; rollup `buildLibsFromSource` default aligned** (beta.8)
- **`initTasksRunner` API removed** from the `nx` package — use `runDiscreteTasks` / `runContinuousTasks` (beta.14, internal NXC-4307)
- **Deprecated webpack plugin re-exports removed** (beta.18, .19)
- **`releaseTag*` flat properties removed** (beta.13)
- **SVGR option removed** — `withSvgr` migration provided (beta.10)
- **`js` option in component generators removed** (beta.10)
- **`@nx/jest`, `@nx/eslint`, `@nx/eslint-plugin`, `@nx/vitest`, `@nx/cypress`, `@nx/playwright`, `@nx/vite` now build from local dist** (beta.16, .17, .19) — affects consumers of these packages' internal entrypoints

**Nx 22.7 (stable):**
- **22.7.x deep-import-from-`nx` rewrites reverted** ([PR ac8187963d]) — v23-only `@nx/devkit/internal` entry temporarily off-limits for 22.x. Customers on 22.7 should not adopt `@nx/devkit/internal` deep imports yet.
- **`nx-cloud` in-app "Create new Nx Workspace" flow retired** — direct customers to `npx create-nx-workspace@latest` + connect via Get Started.

**Nx Console:**
- **Audit your installs** — anyone on `nx-console@18.95.0` should immediately upgrade to `18.100.0+`. Rotate any credentials that were in the editor environment during the install window (May 18).

---

## Coming Soon

- **Nx 23.0.0 GA** — 15 betas in, breaking-change pass nearly complete. Watch beta.20+ for RC candidates.
- **Polygraph public launch June 23, 2026** — early-access microsite live, GTM plan signed off, infrastructure + GitHub App + demo data all in production.
- **Partitioned agent cluster GA in production NA** — initial form deployed May 21; rollout continues.
- **Self-Healing CI enterprise tier monetization** — continues from April (Q2 paid rollout).
- **Polygraph standalone CLI and polygraph-mcp** — independently published, multi-agent support continues maturing.

---

## By the Numbers

> Counts marked (est) are derived from secondary sources because Linear MCP was unavailable.

| Metric | Count |
| ----------------------- | -------------------------------------------------------- |
| CLI stable releases | 2 (22.7.2, 22.7.3) |
| CLI prereleases | 15 (23.0.0-beta.5 through beta.19) |
| Cloud changelog releases | 15 (versions 2605.01.1 through 2605.21.8) |
| Infrastructure commits | 185 human-authored (`nrwl/cloud-infrastructure`, May 1-25) |
| Blog posts published | 2 (Nx Console postmortem, Shift Left article) |
| Linear issues completed | not collected this run (MCP unauthenticated) |
| Pylon support tickets | not collected this run (MCP unauthenticated) |

---

## Questions? Contact

- **Nx 23.0.0 beta line / CLI Core**: Jason, Craigory, Leosvel, Max
- **Nx 22.7 stable maintenance**: Jason, Craigory, Leosvel
- **Nx Console security incident / postmortem**: Jack, Jason, Jeff
- **Nx Cloud / unified CI config / sandbox AI fix flow**: James, Jonathan, Max, Mark, Nicole
- **Self-Healing CI / AI / Agentic**: James, Jonathan, Max, Mark
- **Polygraph launch (June 23)**: James, Max, Chau, Jonathan, Mark, Steve, Victor
- **Sandboxing / IO-Tracing**: Rares, Louie, Craigory, Leosvel
- **Infrastructure / partitioned compute / Valkey / Gateway**: Steve, Patrick, Altan
- **Enterprise customers (RBC, CIBC, Emeria, Skyscanner, Island)**: Steve, Patrick, Altan, Rares
- **Documentation / nx.dev**: Jack, Caleb, Juri, Josh

_Generated on 2026-05-25. For the full technical changelog, see `2026-05-changelog.md`._
