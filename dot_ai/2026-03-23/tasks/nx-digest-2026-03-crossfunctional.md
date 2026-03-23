# Nx Platform Update — March 2026

> **Data gaps:** Month is still in progress (data through March 23). Cloud infrastructure commits are included but may miss some context without PR descriptions.

## TL;DR

- **Task Sandboxing is production-ready** — eBPF-based I/O tracing now tracks every file read/write during builds, catches undeclared dependencies, and surfaces violations in a revamped Cloud UI. Over 40 issues shipped across CLI, Cloud, and Infrastructure to make builds hermetic.
- **AI-Powered Development expanded significantly** — `configure-ai-agents` now auto-detects Claude Code, Codex, Cursor, and Gemini; Polygraph (cross-repo AI planning) entered active development; Self-Healing CI learned to respect git hooks and gained GitHub Check Run integration.
- **Nx 22.6.0 shipped** with jemalloc memory optimization, Yarn Berry catalog support, CLI telemetry, `--stdin` for affected, Angular v21.2 support, ESLint v10 support, and dozens of core fixes.
- **Security patches addressed 4 CVEs** including minimatch, copy-webpack-plugin, koa, and a critical frontend vulnerability (CVE-2025-15467), plus pentest remediations across Cloud.
- **Enterprise infrastructure scaled** with Multi-Cluster Agent Setups (40% complete), Kubernetes Gateway API migration (68% complete), Caseware single-tenant onboarding, and a complete secrets management overhaul.

---

## Task Sandboxing & Hermetic Builds

Nx can now verify that every task only reads and writes the files it declares. The eBPF-based I/O tracing daemon monitors file system operations at the kernel level, and the Cloud UI provides a full analysis view showing expected vs. actual file access.

**What's new this month:**

- Sandbox violation counts are trending down as teams fix undeclared dependencies
- The Cloud UI was completely revamped: streaming file tree, glob-pattern filtering, timeline/conformance views, and violation-type toggles
- TypeScript tasks now automatically track all referenced tsconfig files and tsbuildinfo outputs from dependencies — eliminating a major class of false positives
- Gradle and Maven tasks include properties, wrappers, and version catalogs as inputs
- The daemon embeds a default exclusion list and handles file deletions correctly
- Enterprise single-tenant customers can now toggle sandboxing via an environment variable
- Internal sandboxing routes moved to `/private` endpoints for security

**Who to contact:** Rares, Louie, Craigory

**Docs:** Task sandboxing documentation published at nx.dev

---

## AI-Powered Development

### Agentic Experience (CLI)

The `configure-ai-agents` command now auto-detects which AI tools are present (Claude Code, Codex, Cursor, Gemini) and configures them automatically. Running `nx init` or `create-nx-workspace` from within an AI agent session triggers agent setup by default. A shared `.agents` skills directory works across all supported tools.

Key improvements:

- AI agents get JSON output by default from `nx show target` for better machine parsing
- `nx import` gained an AI agent mode for smoother repo consolidation
- Skills submitted to Anthropic and Cursor registries
- `.claude/worktrees` and `.claude/settings.local.json` auto-added to `.gitignore`

### Polygraph (New Product)

Polygraph is a new cross-repo AI planning tool entering active development. It enables AI agents to work across multiple repositories with shared context. The frontend app was bootstrapped, a separate MCP server was created, and GitHub Actions integration was added. Victor is leading this initiative.

### Self-Healing CI

Self-Healing CI now discovers and runs `prepare-commit-msg` and `commit-msg` git hooks on AI-proposed commits — ensuring fixes comply with team conventions. Other improvements:

- GitHub Check Run integration for better PR visibility
- AI fix progress tracking with redirect support
- Users with allowed email domains can accept, reject, and revert suggestions
- Fixed formatting hook resolving prettier config from outside the workspace (reducing large diffs)
- Self-serve adoption docs and UI messaging cleaned up

**Who to contact:** Max (Agentic/Polygraph), James (Self-Healing CI), Juri

---

## Security

- **CVE-2026-26996** (minimatch): Patched in Nx 22.6.0 via bump to v10.2.1 ([#34509](https://github.com/nrwl/nx/pull/34509))
- **CVE cluster** (copy-webpack-plugin, koa, minimatch): Additional security patches in [#34708](https://github.com/nrwl/nx/pull/34708)
- **CVE-2025-15467**: Critical frontend vulnerability fixed in Cloud (CLOUD-4351)
- **Pentest remediations**: Rollbar client token injection fixed, unauthenticated achievements endpoint secured, email verification enforced, sensitive data removed from session cookies
- **Clickjacking protection**: `X-Frame-Options` and CSP headers added to Netlify configs for nx.dev and nx-dev
- **serialize-javascript CVE**: Webpack plugin versions updated ([NXC-4115](https://linear.app/nrwl/issue/NXC-4115))
- **Nuxt**: Bumped to 3.21.1 to resolve critical audit vulnerability
- **Windows**: `windowsHide: true` set on all child process spawns to reduce AV false positives; removed `shellapi` from winapi features
- **Shell injection**: CLI args now properly quote shell metacharacters ([#34491](https://github.com/nrwl/nx/pull/34491))

**Who to contact:** Nicole (Cloud pentest), Jack (CLI CVEs)

---

## Performance & Reliability

- **jemalloc** with tuned decay timers replaces the default allocator for native modules — reduces memory fragmentation in long-running daemon processes ([#34444](https://github.com/nrwl/nx/pull/34444))
- **macOS file watching** switched from non-recursive kqueue to recursive FSEvents, fixing missed file change events that caused stale project graphs ([#34523](https://github.com/nrwl/nx/pull/34523))
- **SQLite** concurrent initialization no longer corrupts the database; transactions retry on `DatabaseBusy` ([#34861](https://github.com/nrwl/nx/pull/34861), [#34533](https://github.com/nrwl/nx/pull/34533))
- **Daemon** skips stale recomputations and prevents lost file changes ([#34424](https://github.com/nrwl/nx/pull/34424))
- **Plugin workers** shut down cleanly after cancelled phases; pending promises reject immediately on unexpected exits
- **TUI** no longer panics when Nx Console is connected; help text layout fixed; PTY resize doesn't block event loop
- **IO tracing memory** trimmed after task completion ([#34866](https://github.com/nrwl/nx/pull/34866))
- **napi-rs** migrated from v2 to v3

**Who to contact:** Craigory (daemon/TUI), Leosvel (plugin workers)

---

## Onboarding & Workspace Creation

The `create-nx-workspace` flow was refined significantly:

- Cloud prompts and templates restored after regression ([#34887](https://github.com/nrwl/nx/pull/34887))
- Explicit `--nxCloud=skip` opt-out for teams not ready for Cloud
- Deferred Cloud connection (Variant 2) locked in — workspace connects after initial setup
- Better error messages for sandbox failures and malformed nx.json
- Package manager detection falls back to invoking the PM directly, with npm detected from package-lock.json
- New Cloud onboarding: organizations can now choose between Hobby and Team plans directly during setup, with usage-aware messaging and Stripe checkout integration

**Blog post:** [How SiriusXM Stays Competitive by Iterating and Getting to Market Fast](https://nx.dev/blog/siriusxm-success-story) (March 6)

**Who to contact:** Jack (CLI/docs), Benjamin (Cloud onboarding)

---

## Telemetry & Analytics

Nx 22.6.0 introduces opt-in CLI telemetry to help the team understand how Nx is used and where to focus improvements:

- Users are prompted during workspace creation and first `nx` invocation
- Captures command usage, project graph creation time, task and project counts
- Sensitive data (tokens, paths) stripped before sending
- Session IDs persist across invocations for usage correlation
- Performance metrics centralized and reported alongside telemetry
- Cloud commands skip the analytics prompt
- Dogfooded in both the nx and ocean repos before shipping

**Docs:** Telemetry documentation published at nx.dev

**Who to contact:** Colum (implementation), Jack (docs)

---

## JVM Ecosystem (Gradle & Maven)

- **Gradle**: Properties and wrapper files included as task inputs; atomized task targets now get proper `dependsOn`; batch runner output tees to stderr for terminal display; projects with `.json` in name handled correctly; version catalogs invalidate project graph cache
- **Maven**: External dependencies now reported in the project graph; batch runner `invoke()` synchronized to prevent concurrent access; mutable lists for session projects fixed; `testCompile` inputs include test sources
- **Batch hashing**: Topological cache walk and batch-safe hashing for both Gradle and Maven ([#34446](https://github.com/nrwl/nx/pull/34446))

Customer context: Enterprise customers using Gradle DTE reported mismatched outputs in sonar-scan tasks — the batch mode fixes directly address this.

**Who to contact:** Jason (Maven), Louie (Gradle)

---

## Observability & Metrics

- **Prometheus endpoint** work advancing for enterprise single-tenant customers — metrics auth migrating to service account-based scraping with public endpoints
- **PostHog** reverse proxy deployed in production (NA); feature flags audit completed; product analytics now available in staging and production
- **Workspace analytics** CIPE duration chart now shows p95/p75/p50/p25/p5 percentiles
- **Grafana** stack and billing alerts set up across infrastructure; spaces added to Spacelift
- **Contributor mapping** via GitHub API for normalized author counts in enterprise reports
- **Daily product usage** tracking AI credits, connections, and contributor counts

Customer context: Multiple enterprise customers (Mimecast, Cisco, FICO) are evaluating Prometheus metrics export. Telemetry sink options for Prometheus and Datadog are being scoped.

**Who to contact:** Rares (metrics API), Nicole (PostHog)

---

## Enterprise Infrastructure

### New Customer: Caseware

Caseware single-tenant onboarding completed across AWS — Terraform provisioned, SAML secrets configured, GitHub variables added, Lighthouse rotation enabled, and self-healing CI turned on.

### Multi-Cluster Agent Setups (40% complete)

The workflow controller is being extended to support facade mode, where one app cluster can route workflows to multiple downstream agent clusters. Base framework, routing engine, capability-based filtering, and workflow status fan-out are implemented. Log streaming is next.

### Kubernetes Gateway API (68% complete)

Migrating from traditional Ingress to the modern Gateway API across dev, staging, and production. TLS termination with shared CA for `*.internal.nxcloud` domains. Terraform abstraction for GCP created.

### Secrets Management Overhaul

The monolithic `nx-cloud-secrets` has been broken into distinct secrets across all environments — 8 issues completed splitting and migrating dev, staging, and production secrets.

### Other Enterprise Updates

- SAML/SCIM enabled for CIBC and Legora
- Azure managed Redis/Valkey auth implemented for Azure-hosted tenants
- Identity portal resources imported into OpenTofu for automated IAM
- Self-healing CI enabled for Cloudinary and Mimecast
- IO tracing daemon deployed to Legora (GCP tenant)

**Who to contact:** Steve (multi-cluster, enterprise), Patrick (Gateway API), Szymon (secrets, Azure)

---

## Ecosystem & Framework Support

- **Angular v21.2** support added
- **ESLint v10** support with proper flat config migration
- **Yarn Berry** catalog support (`catalog:` references)
- **Vitest v4** pinned to ~4.0.x for Yarn Classic compatibility
- **pnpm** catalogs stripped correctly from pruned lockfiles
- **Bun** false positive loop detection fixed; release-publish supports bun-only environments
- **Module Federation** SSL key/cert path fix
- **Next.js** daemon client reset after project graph creation
- **Vite** preview server flag and root-relative path resolution fixed
- **Azure DevOps** OAuth integration added for workspace visibility

---

## Nx Release Improvements

- `--otp` flag added to top-level `nx release` command with EOTP error detection
- Canonical SSH URLs supported for GitHub slug extraction
- Null-safe version fallback in `createGitTagValues`
- Skip indirect patch bumps for commit types with `semverBump: "none"`
- Dependent projects included in release commit message when using `--projects` filter
- Changelog deduplication for filtered project lists

---

## Customer Support Activity

287 Pylon tickets across the month. Key themes from enterprise customers:

- **Task Sandboxing** — Customers requesting sandboxing rollout planning, evaluating sandbox analysis views
- **Self-Healing CI** — Multiple customers asking about fix statistics, time limits, commit-message guidance compliance, and AWS Bedrock BYOK support
- **Observability** — Strong demand for Prometheus/Datadog metrics export, OLTP endpoints, CPU/memory reports, and pipeline execution time by changeset
- **CI Reliability** — Hanging jobs, agent restarts, stalled workers, and cache miss issues reported by several enterprise customers
- **Onboarding** — Customers evaluating Nx upgrades, migration paths (Lerna to Nx), and TypeScript Project References adoption

Notable customer activity: SiriusXM, Mimecast, FICO, Caseware, Cisco, CIBC, MNP.ca, Rocket Mortgage, Anaplan, Cloudinary, McGraw Hill

---

## Breaking Changes / Action Required

- **Vitest `reportsDirectory`** now resolves against workspace root instead of project root ([#34720](https://github.com/nrwl/nx/pull/34720)). Projects with custom `reportsDirectory` paths may need updates.

---

## Coming Soon

- **Polygraph** — Cross-repo AI planning tool entering beta. Frontend app bootstrapped, MCP server created, GitHub Actions integration added.
- **Multi-Cluster Agent Setups** — Target completion early April. Log streaming and end-to-end testing remaining.
- **Angular v22 support** — In backlog for upcoming cycle.
- **Nx TUI + Mouse Capture** — Enhanced terminal UI interactions planned.
- **CLI Analytics for Enterprise** — Enterprise-specific analytics capabilities being scoped.
- **In-Progress Agent Waterfall Visualization** — Visual timeline of DTE agent work, targeted for April.
- **Task Timeout Feature** — Customer-requested feature to prevent hanging builds (in design).

---

## By the Numbers

| Metric                  | Count                                                          |
| ----------------------- | -------------------------------------------------------------- |
| CLI releases            | 3 (22.5.4, 22.6.0, 22.6.1)                                     |
| Cloud releases          | 13                                                             |
| Infrastructure commits  | 124                                                            |
| Linear issues completed | 252+ across 7 teams                                            |
| Pylon support tickets   | 287 across 50+ customers                                       |
| Enterprise PoVs active  | 6 (Anaplan, CIBC, MNP.ca, Rocket Mortgage, Cisco, McGraw Hill) |

---

## Questions? Contact

- **Task Sandboxing / IO Tracing**: Rares, Louie, Craigory
- **AI-Powered Development / Polygraph**: Max, Victor, James
- **Self-Healing CI**: James, Mark
- **Security / Pentest**: Nicole, Jack
- **Onboarding & Cloud**: Jack, Benjamin, Nicole
- **CLI Core / Performance**: Craigory, Leosvel, Colum
- **JVM (Gradle/Maven)**: Jason, Louie
- **Enterprise Infrastructure**: Steve, Patrick, Szymon
- **Observability / Metrics**: Rares, Nicole, Altan
- **Customer Success / PoVs**: Austin, Miroslav, Steven

_Generated on 2026-03-23. For the full technical changelog, see Document 2._
