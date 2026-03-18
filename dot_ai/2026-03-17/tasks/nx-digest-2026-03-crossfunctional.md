# Nx Platform Update — March 2026

> **Data gaps:** Blog posts — no March 2026 blog posts found on nx.dev (most recent is February 25). Infrastructure data covers through March 17 (partial month). Cloud changelog covers 11 releases through March 12.

## TL;DR

- **Task Sandboxing is production-ready**: eBPF-based I/O tracing now detects undeclared inputs/outputs in CI, with a full analysis UI, docs at nx.dev, and violation counts trending down. 40+ issues closed across CLI, Cloud, and Infrastructure.
- **Polygraph AI launches cross-repo sessions**: AI agents can now orchestrate work across multiple repositories with branch tracking, MCP tooling, and GitHub Actions integration.
- **Self-Healing CI gets smarter**: Now respects git hooks on AI-generated commits, shows model provider health status, and allows domain-based user permissions for accepting fixes.
- **Surface-level telemetry ships**: Anonymous usage analytics (opt-in with prompt) help the team understand how Nx is used, with a Rust-native implementation for minimal overhead.
- **Six enterprise PoVs active**: CIBC kicked off, MNP.ca seeing 50% CI reduction, Anaplan wrapping up, Caseware fully provisioned on AWS.

---

## Task Sandboxing & Hermetic Builds

Nx's eBPF-based task sandboxing — which traces every file read/write during CI task execution — made major strides toward production stability this month.

**What customers can do now:**

- See exactly which files each task reads and writes, with an interactive analysis UI in Nx Cloud showing file trees, violation timelines, and glob-pattern filters
- Get warnings when tasks access undeclared inputs or write to unexpected locations
- View sandboxing docs at [nx.dev/docs/features/ci-features/sandboxing](https://nx.dev/docs/features/ci-features/sandboxing)

**Behind the scenes:** The eBPF daemon's memory issues were resolved, an embedded exclusion list skips known false-positive paths, and the team systematically fixed 25+ sandboxing violations in the Nx repo itself — proving the feature catches real misconfigured task inputs. TypeScript build tasks now automatically track all transitive tsconfig files as inputs, Gradle properties/wrappers are included in inputs, and ESLint dependency detection was improved.

**Cloud UI improvements** (by Louie): Streaming file tree rendering for large trace data, compare panels for tasks without violations, URL-controlled view toggling, glob-pattern filters, and violation type toggles.

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
- **Model provider health**: When the AI provider (Anthropic) experienced issues during fix generation, the UI now shows a clear banner explaining the context
- **Permissions expansion**: Users with allowed email domains can now accept, reject, and revert AI suggestions without needing explicit role assignment
- **Onboarding**: New option during workspace setup to open a PR enabling self-healing in the repo
- **SDK update**: Claude agent SDK updated to support Tasks for better orchestration

**Customers enabled**: Cloudinary, MailChimp (plan modifier), Moderna (plan modifier), Mimecast (AI features enabled)

### Agentic Experience (AX)

- `nx init`, `nx import`, and `create-nx-workspace` all received AX refactors for improved agent compatibility
- Codex subagent support added to `configure-ai-agents`
- `nx show target` now outputs JSON by default for AI agents
- `.claude/settings.local.json` and `.claude/worktrees` added to `.gitignore` templates
- Import skill now has tech-specific guidance for Gradle, Vite, and Next.js

- **Contacts**: Max, Victor, James, Chau

---

## Telemetry & Analytics

**Surface-level telemetry** is shipping with the 22.6 release. This provides anonymous, opt-in usage analytics to help the Nx team understand command usage patterns and project graph performance:

- Users are prompted during workspace creation and first CLI invocation
- Sensitive data is stripped from args before sending
- Implemented in Rust for minimal performance impact
- GA events capture commands, project graph creation time, and task/project counts
- Cloud commands skip the analytics prompt to avoid blocking CI flows

**Cloud analytics** also improved: the CI pipeline execution durations chart now shows percentile values (p5, p25, p50, p75, p95), giving teams clearer visibility into CI performance distribution.

- **Contacts**: Jason, Colum

---

## Security

- **CVE cluster patched** ([#34708](https://github.com/nrwl/nx/pull/34708)): Updated `copy-webpack-plugin`, `koa`, and `minimatch` to address known vulnerabilities
- **Critical frontend CVE** (CVE-2025-15467) remediated in Nx Cloud (CLOUD-4351)
- **Nuxt vulnerability**: Bumped nuxt to 3.21.1 to resolve critical audit finding
- **Pentest findings addressed** (3 issues):
  - Unauthenticated access to workspace achievements endpoint — now gated
  - Email verification enforcement added
  - Refresh token exposure in session cookies — fixed
- **Vanta remediation**: Security training records updated, IAM access keys rotated
- **Infrastructure**: OpenTofu now manages IAM permissions for new AWS accounts automatically; Grafana billing alerts prevent cost spikes from ingestion anomalies

- **Contacts**: Szymon, Nicole, Chau, Altan

---

## Onboarding & Growth

**Team plan selection in onboarding**: New organizations now see a Hobby/Team toggle during onboarding with real usage data from their workspace. Users arriving from nx.dev/pricing with "Start with Team" get the Team plan preselected. Stripe checkout integration, PostHog instrumentation, and reduced-motion support are all included.

**Workspace visibility**: New workspaces now default to repository-level access (not org-wide). Azure DevOps OAuth integration added. Organization-level visibility controls cleaned up and can be disabled per-environment.

**Create Nx Workspace fixes**: The CNW user flow was restored to match v22.1.3 behavior after a regression, and a clearer error message surfaces when sandbox creation fails.

- **Contacts**: Benjamin, Mark, Nicole

---

## JVM Ecosystem (Gradle & Maven)

Significant progress for Java/Kotlin teams using Nx:

- **Gradle**: Properties and wrapper files now included as task inputs (fixes cache correctness), batch runner output now displays in terminal, project name handling improved for names containing `.json`, ESLint plugin excludes non-JS Gradle sub-projects, version catalog changes invalidate the project graph cache
- **Maven**: External Maven dependencies now appear in the project graph, batch runner invoke is synchronized to prevent concurrent access, mutable lists fix for session projects
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

### New Customer: Caseware

Fully provisioned as a new single-tenant instance on AWS — Terraform, Spacelift, GitHub app, SAML, and lighthouse rotation all configured.

### Infrastructure Modernization

- **K8S Gateway API**: Terraform abstraction for GCP complete, Helm chart for application cluster runners nearly done. Will replace legacy Ingress resources as the modern Kubernetes standard. AWS/Azure next.
- **Multi-cluster agent setups**: Foundation implementation progressing (16%). Controller facade mode audit complete, client/endpoints built. Enables running agents across separate Kubernetes clusters.
- **Secrets management**: Development secrets split into smaller, more granular units for improved security posture.
- **Identity portal in OpenTofu**: Existing IAM resources fully imported; new AWS accounts get automatic access provisioning.

- **Contacts**: Austin, Steve, Patrick, Szymon

---

## Performance & Reliability

- **Nx resource usage review completed**: Memory and CPU profiling done, plugin worker shutdown fixed, misc allocations reduced. Future optimizations will be incremental.
- **NAPI-RS v2 → v3 migration**: Core native bindings upgraded to latest NAPI-RS
- **Plugin cache**: Safe write utilities with LRU eviction prevent JSON stringify errors from corrupting cache
- **Deps cache optimization**: Skip writing if already up-to-date
- **TUI fixes**: Fixed panic when Nx Console is connected, help text layout corrected, TUI logger gated behind env var
- **Bun compatibility**: Resolved false positive loop detection when running with Bun; release-publish executor now supports Bun-only environments

---

## Docs & Developer Experience

- Sandboxing docs published ([nx.dev/docs/features/ci-features/sandboxing](https://nx.dev/docs/features/ci-features/sandboxing))
- Self-healing auto-apply video merged
- Docker layer caching documentation added
- Legacy redirect cleanup and broken link fixes across nx.dev
- Outdated version references (< Nx 20) cleaned up
- Storybook version support clarified
- Writing style "linting" guidelines established
- YouTube channel callout added to courses page

- **Contacts**: Jack, Caleb

---

## Breaking Changes / Action Required

- **Vitest `reportsDirectory`** ([#34720](https://github.com/nrwl/nx/pull/34720)): Now resolved against the workspace root instead of the project root. Update vitest configs if you've customized `reportsDirectory` with relative paths.

---

## Coming Soon

- **22.6.0 stable release**: RC published March 16, stable expected shortly
- **Polygraph AI general availability**: Cross-repo agent sessions being battle-tested
- **Multi-cluster agents**: Foundation being built for running agents across Kubernetes clusters
- **Agentic migrations**: Local `nx migrate` will get an improved agentic loop (Leosvel leading)
- **Agent sandboxing**: Socket path alignment and docs updates for running AI agents in sandboxed environments
- **K8S Gateway API**: AWS and Azure support following GCP completion
- **Feature demos in Cloud**: In-app demos of analytics, run details for prospects (target: March 31)

---

## By the Numbers

| Metric                    | Count                              |
| ------------------------- | ---------------------------------- |
| CLI releases              | 1 stable (22.5.4) + 7 betas + 1 RC |
| Cloud releases            | 11                                 |
| Linear issues completed   | ~195 across 6 teams                |
| Enterprise PoVs active    | 6                                  |
| New ST instances          | 1 (Caseware)                       |
| Security issues addressed | 6+ (3 CVEs, 3 pentest findings)    |

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

_Generated on 2026-03-17. For the full technical changelog, see Document 2._
