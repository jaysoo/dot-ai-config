# Nx Platform Update — March 2026

## TL;DR

- **Nx 22.6.0 released** (March 18): Major release with jemalloc memory optimization, Angular v21.2 support, ESLint v10 support, agentic sandboxing, and 40+ new features. 22.7.0 betas already shipping with DB corruption prevention and shell metacharacter quoting fixes.
- **Task Sandboxing is production-ready**: eBPF-based I/O tracing detects undeclared inputs/outputs in CI, with a full analysis UI, docs, and violation counts trending down. 40+ issues closed across CLI, Cloud, and Infrastructure. Now rolling out to enterprise single-tenant customers (Legora first on GCP).
- **AI-Powered Development goes deeper**: Polygraph AI cross-repo sessions, agentic sandboxing for AI agents, auto-configured AI agents during `nx init`/`create-nx-workspace`, shared skills directory across Claude Code/Codex/Cursor/Gemini. Self-Healing CI now respects git hooks and prevents formatting hooks from resolving prettier config outside the workspace.
- **Surface-level telemetry ships**: Anonymous, opt-in usage analytics with Rust-native implementation. Prompted during workspace creation. DB corruption guard and analytics skip for handoff scenarios added post-release.
- **Six enterprise PoVs active**: CIBC kicked off, MNP.ca seeing 50% CI reduction, Anaplan wrapping up with business case, Caseware fully provisioned on AWS with SCIM token and new access control.

---

## Nx 22.6.0 — Major Release (March 18)

The headline release of the month. 22.6.0 is a major milestone with 40+ features and 90+ fixes spanning the entire Nx ecosystem. Key highlights for customers:

- **jemalloc memory optimization**: Native module now uses jemalloc with tuned decay timers, significantly reducing memory usage for large workspaces
- **Angular v21.2 support**: Full compatibility with the latest Angular release
- **ESLint v10 support**: Nx linting works with the newest ESLint major version
- **Wildcard paths in enforce-module-boundaries**: More flexible boundary rules
- **`--stdin` for `nx affected`**: Pipe changed files directly, useful for custom CI integrations
- **Dependency filesets with `^{projectRoot}` syntax**: More precise input definitions
- **`NX_SKIP_FORMAT` env var**: Skip Prettier formatting in generators for faster AI agent workflows
- **Yarn Berry catalog support**: Full support for Yarn's new dependency catalog feature
- **`--otp` for `nx release`**: One-time password support for npm publishing, with EOTP error detection
- **`preferBatch` executor option**: Opt into batched execution per target
- **Cache debugging commands**: New commands to inspect cache inputs/outputs

**Post-release (22.7.0 betas, March 19):** DB corruption prevention from concurrent initialization, shell metacharacter quoting fix (long-standing issue), ESLint `require()` detection in module boundaries, and CRA migration logic removal from `nx init`.

---

## Task Sandboxing & Hermetic Builds

Nx's eBPF-based task sandboxing — which traces every file read/write during CI task execution — made major strides toward production stability this month.

**What customers can do now:**

- See exactly which files each task reads and writes, with an interactive analysis UI in Nx Cloud showing file trees, violation timelines, and glob-pattern filters
- Get warnings when tasks access undeclared inputs or write to unexpected locations
- View sandboxing docs at [nx.dev/docs/features/ci-features/sandboxing](https://nx.dev/docs/features/ci-features/sandboxing)

**Behind the scenes:** The eBPF daemon's memory issues were resolved (including a targeted memory trim in rc.1), an embedded exclusion list skips known false-positive paths, and the team systematically fixed 25+ sandboxing violations in the Nx repo itself — proving the feature catches real misconfigured task inputs. TypeScript build tasks now automatically track all transitive tsconfig files as inputs, Gradle properties/wrappers are included in inputs, and ESLint dependency detection was improved.

**Cloud UI improvements** (by Louie): Streaming file tree rendering for large trace data, compare panels for tasks without violations, URL-controlled view toggling, glob-pattern filters, and violation type toggles.

**Enterprise rollout**: Infrastructure is now wiring up io-trace for GCP enterprise single-tenant customers (Legora first), with a reusable AppSet pattern for non-large tenants.

- **Docs**: [Sandboxing](https://nx.dev/docs/features/ci-features/sandboxing)
- **Contacts**: Rares, Jason, Craigory, Louie

---

## AI-Powered Development

### Polygraph AI — Cross-Repo Agent Sessions

A new `nx polygraph` command launches cross-repository sessions that let AI coding agents (Claude Code, Codex) work across multiple repos simultaneously. Key capabilities:

- Initialize sessions that span repos, with branch tracking per repository
- Dedicated `polygraph-mcp` server for agent tool access
- Repo summarization for quick context loading
- GitHub Actions log retrieval for CI-aware debugging
- Login flow via `nx login` for authenticated agent sessions

This represents a significant step toward Nx becoming the orchestration layer for agentic development workflows.

### Self-Healing CI

Self-Healing CI — which uses AI to automatically propose fixes for failing CI pipelines — received important reliability and usability improvements:

- **Git hooks support**: AI-generated commit messages now pass through registered `prepare-commit-msg` and `commit-msg` hooks before saving, respecting team conventions
- **Prettier config isolation** (March 20): Formatting hooks no longer resolve prettier config from outside the workspace, eliminating cases where fix suggestion diffs were unnecessarily large
- **Model provider health**: When the AI provider (Anthropic) experienced issues during fix generation, the UI now shows a clear banner explaining the context
- **Permissions expansion**: Users with allowed email domains can now accept, reject, and revert AI suggestions without needing explicit role assignment
- **Onboarding**: New option during workspace setup to open a PR enabling self-healing in the repo
- **SDK update**: Claude agent SDK updated to support Tasks for better orchestration

**Customers enabled**: Cloudinary, MailChimp (plan modifier), Moderna (plan modifier), Mimecast (AI features enabled)

### Agentic Experience (AX)

The 22.6.0 release is packed with AX improvements — making Nx the most AI-agent-friendly build system:

- **Agentic sandboxing**: Nx now handles sandboxed environments (Docker, Firejail) that AI agents run in, with reusable sandbox detection utility
- **Auto-configure AI agents**: Running `nx init` or `create-nx-workspace` from within an AI agent automatically sets up agent configuration
- **`configure-ai-agents` improvements**: Auto-detection of installed agents, improved Codex support, outdated message after tasks, shared `.agents` skills directory across Claude Code/Codex/Cursor/Gemini
- **AI agent mode for `nx import`**: Streamlined import flow when run by AI agents
- **`--json` for `nx list`**: Better machine-readable output for agents
- **`NX_SKIP_FORMAT`**: Env var to skip Prettier formatting in generators, reducing friction for AI workflows
- **AI traffic tracking**: nx.dev now tracks server page views categorized by AI agent traffic via Netlify-Agent-Category
- **`.nx/self-healing` and `.claude/settings.local.json`** added to `.gitignore` templates
- Import skill now has tech-specific guidance for Gradle, Vite, and Next.js

- **Contacts**: Max, Victor, James, Chau

---

## Telemetry & Analytics

**Surface-level telemetry** shipped with the 22.6.0 release. This provides anonymous, opt-in usage analytics to help the Nx team understand command usage patterns and project graph performance:

- Users are prompted during workspace creation and first CLI invocation
- Sensitive data is stripped from args before sending
- Implemented in Rust for minimal performance impact
- GA events capture commands, project graph creation time, and task/project counts
- Cloud commands skip the analytics prompt to avoid blocking CI flows
- **Post-release fix**: Analytics and DB connection skipped when global Nx binary hands off to local installation (22.7.0-beta.0)
- **Post-release fix**: DB corruption prevention from concurrent initialization (22.7.0-beta.1)

**Cloud analytics** also improved: the CI pipeline execution durations chart now shows percentile values (p5, p25, p50, p75, p95), giving teams clearer visibility into CI performance distribution.

- **Contacts**: Jason, Colum

---

## Security

- **CVE-2026-26996 (minimatch)**: Bumped to 10.2.1, then 10.2.4 ([#34509](https://github.com/nrwl/nx/pull/34509), [#34660](https://github.com/nrwl/nx/pull/34660))
- **CVE cluster patched** ([#34708](https://github.com/nrwl/nx/pull/34708)): Updated `copy-webpack-plugin`, `koa`, and `minimatch`
- **Critical frontend CVE** (CVE-2025-15467) remediated in Nx Cloud (CLOUD-4351)
- **Nuxt vulnerability**: Bumped nuxt to 3.21.1 to resolve critical audit finding
- **Clickjacking protection**: Added security headers to Netlify configs for nx.dev ([#34893](https://github.com/nrwl/nx/pull/34893))
- **Shell metacharacter quoting**: CLI now properly quotes shell metacharacters in args passed to tasks, fixing a longstanding injection risk ([#34491](https://github.com/nrwl/nx/pull/34491))
- **Windows AV false positives**: Removed `shellapi` from winapi featureset to minimize antivirus false positives on the Nx binary
- **Pentest findings addressed** (3 issues):
  - Unauthenticated access to workspace achievements endpoint — now gated
  - Email verification enforcement added
  - Refresh token exposure in session cookies — fixed
- **Vanta remediation**: Security training records updated, IAM access keys rotated
- **Infrastructure**: OpenTofu now manages IAM permissions for new AWS accounts automatically; Grafana billing alerts prevent cost spikes from ingestion anomalies; SCIM token and new access control added for Caseware (enterprise)

- **Contacts**: Szymon, Nicole, Chau, Altan

---

## Onboarding & Growth

**Team plan selection in onboarding**: New organizations now see a Hobby/Team toggle during onboarding with real usage data from their workspace. Users arriving from nx.dev/pricing with "Start with Team" get the Team plan preselected. Stripe checkout integration, PostHog instrumentation, and reduced-motion support are all included.

**Workspace visibility**: New workspaces now default to repository-level access (not org-wide). Azure DevOps OAuth integration added. Organization-level visibility controls cleaned up and can be disabled per-environment.

**Create Nx Workspace improvements**: The CNW user flow was restored after a regression, cloud prompts and templates brought back, clearer error messages for sandbox failures and missing package managers, and explicit cloud opt-out option added.

**Nx Cloud UI**: Changelog link added to the app footer (changelog.nx.app), improved Nx Cloud console redirect flow.

- **Contacts**: Benjamin, Mark, Nicole

---

## JVM Ecosystem (Gradle & Maven)

Significant progress for Java/Kotlin teams using Nx:

- **Gradle**: Properties and wrapper files now included as task inputs (fixes cache correctness), batch runner output now displays in terminal, project name handling improved for names containing `.json`, ESLint plugin excludes non-JS Gradle sub-projects, version catalog changes invalidate the project graph cache, always check disk cache for project graph reports
- **Maven**: External Maven dependencies now appear in the project graph, batch runner invoke is synchronized to prevent concurrent access, mutable lists fix for session projects, correct mapping between Maven locators and Nx project names
- **Hashing**: Batch-safe hashing for both Maven and Gradle ensures correct cache behavior in distributed execution

- **Contacts**: Jason, Craigory, Louie

---

## Enterprise Deployments & Infrastructure

### Enterprise PoVs

| Customer            | Status                    | Highlights                                                                                      |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------------------------- |
| **Anaplan**         | Wrapping up               | ~9.5 min avg pipeline, 2+ hrs/week saved. Business case being drafted vs. $300K annual compute. |
| **CIBC**            | Active (kicked off Mar 1) | Encryption resolved, connected to Nx Cloud. Container registry configured. Azure SAML set up.   |
| **MNP.ca**          | Active                    | Remote caching live — CI time cut in half. PR comments working. DTE next.                       |
| **Rocket Mortgage** | At risk                   | MSA legal questions in progress. InfoSec approval pending. Pushed to April 30.                  |
| **Cisco**           | At risk                   | Security questionnaire done. MSA stuck in global procurement.                                   |
| **McGraw Hill**     | Pushed to ~May            | Customer completing Angular 20 upgrade first. Success criteria: 20% P95 CI improvement.         |

### Customer Success: SiriusXM

Published March 6: [How SiriusXM Stays Competitive by Iterating and Getting to Market Fast](https://nx.dev/blog/siriusxm-success-story). SiriusXM runs 1,400+ projects in their monorepo, saving 61+ days of compute per month with Nx.

### New Customer: Caseware

Fully provisioned as a new single-tenant instance on AWS — Terraform, Spacelift, GitHub app, SAML, lighthouse rotation, SCIM token, and new access control all configured.

**Active support (9 Pylon tickets in March — most active PoV customer):**
- **Cache corruption** (High priority, Mar 19): Developer needs to forcibly remove a corrupted remote cache entry — no self-service option exists today
- **Project graph slowdown on Windows** (Mar 13): ~100-126s loading project graph/plugins, compounded by stale serve processes
- **Codeowners gap** (Mar 9, on hold): `@nx/workspace:remove` doesn't clean up nx.json owners; requesting sub-project file ownership override ([nrwl/nx#34815](https://github.com/nrwl/nx/issues/34815))
- **SCIM/SAML migration** (Mar 9): Customer-side IT ticket in progress, linked to [INF-1242](https://linear.app/nxdev/issue/INF-1242)
- **IP allow-list for runners** (Mar 4): Verifying runner IPs don't need explicit allow-listing
- **Cloud access** (Mar 20): New admin credentials requested

**Rocket Mortgage** also had 1 Pylon ticket — `nx login` 400 error when not pre-authenticated in browser (closed, linked to [CLOUD-3732](https://linear.app/nxdev/issue/CLOUD-3732)).

### Infrastructure Modernization

- **K8S Gateway API**: Terraform abstraction for GCP complete, Helm chart with cert-manager, TLS, and health check policies. Now deployed to workflows cluster in dev, staging, and prod. External DNS integration added. AWS/Azure next.
- **Multi-cluster agent setups**: Foundation implementation progressing (16%). Controller facade mode audit complete, client/endpoints built, config path defined for downstream checks. Enables running agents across separate Kubernetes clusters.
- **Secrets management**: Development, staging, and production secrets split into smaller, more granular units. New secrets deployed across all environments including EU and NA regions.
- **Identity portal in OpenTofu**: Existing IAM resources fully imported; new AWS accounts get automatic access provisioning.
- **IO tracing for enterprise ST**: New AppSet pattern enables io-trace daemon deployment to GCP enterprise single-tenant customers.
- **Claude MCP for nx-data**: Service account and IAM configured for Claude MCP access to analytics data.
- **Flipt feature flags**: Debug/profiling endpoints moved off public routes, metrics secured.

- **Contacts**: Austin, Steve, Patrick, Szymon

---

## Performance & Reliability

- **jemalloc with tuned decay timers**: Significant memory optimization for the native module ([#34444](https://github.com/nrwl/nx/pull/34444))
- **Nx resource usage review completed**: Memory and CPU profiling done, plugin worker shutdown fixed, misc allocations reduced
- **IO tracing memory trim**: Targeted reduction in memory usage associated with io-tracing service
- **NAPI-RS v2 → v3 migration**: Core native bindings upgraded to latest NAPI-RS
- **Recursive FSEvents on macOS**: Replaced non-recursive kqueue with recursive FSEvents for more reliable file watching
- **Plugin cache**: Safe write utilities with LRU eviction prevent JSON stringify errors from corrupting cache
- **SQLite retry**: Entire transactions retried on DatabaseBusy errors
- **DB corruption prevention**: Concurrent initialization now guarded (22.7.0-beta.1)
- **Gitignore matching**: Replaced buggy ignore-files trie with correct path-component matching
- **Daemon improvements**: Skip stale recomputations, prevent lost file changes, clean up stale socket files
- **TUI fixes**: Fixed panic when Nx Console is connected, help text layout corrected, TUI logger gated behind env var, PTY resize no longer blocks event loop
- **Bun compatibility**: Resolved false positive loop detection; release-publish executor supports Bun-only environments
- **Workers shutdown**: Ensured workers shut down after phase cancelled
- **Angular ngcli adapter**: Avoid redundant project graph requests (22.7.0-beta.0)

---

## Docs & Developer Experience

- Sandboxing docs published ([nx.dev/docs/features/ci-features/sandboxing](https://nx.dev/docs/features/ci-features/sandboxing))
- Self-healing auto-apply video merged
- Docker layer caching documentation added
- Telemetry documentation added
- Legacy redirect cleanup and broken link fixes across nx.dev
- Outdated version references (< Nx 20) cleaned up
- Storybook version support clarified
- Writing style "linting" guidelines established
- YouTube channel callout added to courses page
- Clickjacking protection headers added
- Cross-site link checks now working
- Changelog page 500 error resolved (22.7.0-beta.0)
- Batch mode clarified in docs

- **Contacts**: Jack, Caleb

---

## Breaking Changes / Action Required

- **Vitest `reportsDirectory`** ([#34720](https://github.com/nrwl/nx/pull/34720)): Now resolved against the workspace root instead of the project root. Update vitest configs if you've customized `reportsDirectory` with relative paths.

---

## Coming Soon

- **Polygraph AI general availability**: Cross-repo agent sessions being battle-tested. Product naming being finalized (Polygraph vs Polar).
- **Self-Healing CI billing**: Starting April 1, enterprise customers will be charged for self-healing CI credits. Plan modifiers already applied to MailChimp, Moderna, Cloudinary.
- **Multi-cluster agents**: Foundation being built for running agents across Kubernetes clusters
- **Agentic migrations**: Local `nx migrate` will get an improved agentic loop (Leosvel leading)
- **Agent sandboxing**: Socket path alignment and docs updates for running AI agents in sandboxed environments
- **K8S Gateway API**: AWS and Azure support following GCP completion
- **Feature demos in Cloud**: In-app demos of analytics, run details for prospects (target: March 31)
- **IO tracing enterprise rollout**: Expanding to more GCP single-tenant customers
- **Quark-A Task Force**: New cross-functional team (Quokka + Orca) focused on improving workspace activation and conversion — targeting 2x baseline conversion rate for "serious workspaces" (5+ projects)

---

## By the Numbers

| Metric                    | Count                                                      |
| ------------------------- | ---------------------------------------------------------- |
| CLI releases              | 2 stable (22.5.4, 22.6.0) + 7 betas + 3 RCs + 2 next-betas |
| Cloud releases            | 13                                                         |
| Linear issues completed   | ~230+ across 6 teams                                       |
| Enterprise PoVs active    | 6                                                          |
| New ST instances          | 1 (Caseware)                                               |
| Security issues addressed | 8+ (4 CVEs, 3 pentest findings, 1 shell injection)         |

---

## Questions? Contact

- **Task Sandboxing / IO Tracing**: Rares, Jason, Craigory, Louie
- **AI / Polygraph / Self-Healing CI**: Max, Victor, James, Chau
- **Telemetry & Analytics**: Jason, Colum, Nicole
- **Security**: Szymon, Nicole, Chau
- **Onboarding & Growth**: Benjamin, Mark
- **JVM Ecosystem**: Jason, Craigory, Louie
- **Enterprise / DPE**: Austin, Steve, Patrick, Szymon
- **Docs**: Jack, Caleb

_Generated on 2026-03-20. For the full technical changelog, see Document 2._
