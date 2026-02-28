# Nx Platform Update — February 2026

> **Data gaps:** None

## TL;DR

- **Task Sandboxing & IO Tracing** is rolling out to production and enterprise tenants — hermetic task execution with full I/O audit trails, a major differentiator for enterprise CI reliability.
- **Self-Healing CI** removed the "experimental" badge and now auto-enables during onboarding. New auto-apply recommendations surface in settings, and fixes show detailed failure reasons.
- **AI-Powered Development** expanded significantly: improved `configure-ai-agents`, NDJSON output for agentic CNW, `--json` flag for machine-readable `nx list`, and updated PLUGIN.md files for agent discovery.
- **Security**: CVE-2026-26996 (minimatch ReDoS) patched in 22.5.3; command injection vulnerability fixed in `getNpmPackageVersion`.
- **New enterprise tenants** onboarded: Wix and Legora, plus Workspace-Repository Access Syncing shipped for granular permissions.
- **Polygraph AI** is taking shape — GitHub Actions integration, multi-repo support, graph UI drawing, and PR creation/coordination (RedPanda team).
- **Framer Migration** completed — all marketing pages moved off Framer to the Nx platform (nx.dev).

## Task Sandboxing & IO Tracing

Nx now supports hermetic task execution through IO tracing — tasks run in a sandboxed environment where all file system reads and writes are tracked. This gives teams a complete audit trail of what each task touched, enabling more precise caching and catching tasks that access files outside their declared inputs/outputs.

The infrastructure team deployed the IO trace daemon across development, staging, and production environments throughout February, including enterprise tenants on both GCP and AWS. The CLI added the foundational `task io service` and sandbox detection utilities.

**What this means for customers:** More reliable caching and the ability to verify that tasks are truly hermetic. Enterprise customers get this automatically as part of their managed deployments.

## Self-Healing CI

Self-Healing CI graduated from experimental to generally available this month. Key improvements:

- **Onboarding integration**: When connecting a repository, Self-Healing CI is now enabled by default. It auto-creates a PR to add the `nx fix-ci` step to your CI configuration — or generates the entire workflow file for GitHub Actions/GitLab CI.
- **Auto-apply recommendations**: Organization admins see inline suggestions for which tasks are good candidates for automatic fix application.
- **Failure transparency**: When fixes fail, detailed failure reasons now appear in the Technical Details section (system admins only).
- **Bitbucket & Azure DevOps**: In-app setup support extended to these platforms.
- **Apply-locally improvements**: The `apply-locally` CLI command now highlights pending auto-apply recommendations.

## Polygraph AI

A new product initiative taking shape: Polygraph AI brings AI-powered analysis to your development workflow. Key capabilities built this month include GitHub Actions integration, repository discovery API, multi-repo support, graph UI drawing for visualizing dependencies, and automated PR creation and coordination. Session management with descriptions, authors, and closing flows were added. MCP tools auto-install with a client bundle.

**What this means:** Polygraph AI represents Nx's next-generation AI analysis layer, connecting CI data with intelligent recommendations across repositories.

## AI-Powered Development

The platform continued expanding its AI integration story:

- **Agent-aware workspace creation**: `create-nx-workspace` now detects AI agents, outputs NDJSON for structured consumption, and generates improved CLAUDE.md rules.
- **`configure-ai-agents`** improved: copies Nx skills/subagents/plugins, fixes MCP arg handling, and handles Ctrl+C gracefully.
- **Machine-readable outputs**: `nx list` gained a `--json` flag for better AI tool integration (labeled "AX" — agent experience).
- **Plugin discovery**: PLUGIN.md files across all packages updated to help AI agents verify plugin capabilities.
- **Nx Cloud CLI**: New `apply-locally` passthrough command for cloud-driven AI fixes.

## Security

- **CVE-2026-26996** (minimatch ReDoS): Bumped `minimatch` to 10.2.1 in Nx 22.5.3. All users on 22.5.2 or earlier should upgrade.
- **Command injection fix**: Patched `getNpmPackageVersion` to prevent command injection (22.5.0).
- **Infrastructure**: Lighthouse database credentials moved to secure secret management. IAP connections reworked for tighter access control.

## Onboarding & Workspace Connection

- CNW (Create Nx Workspace) messaging overhauled with decorative banners, deferred cloud connection, and explicit cloud opt-out for non-interactive mode.
- Cloud changelog links improved across connect-workspace flows.
- PNPM catalog workspaces can now connect through GitHub and GitLab.
- New landing page link for users arriving from `create-nx-workspace`.

## JVM Ecosystem (Gradle & Maven)

Continued investment in JVM build tool support:

- Gradle batch executor now supports debug env var and tooling-compatible API flags.
- Maven loads classes at runtime for version-agnostic batch execution; pom.xml and ancestor files properly included as inputs.
- Multiple fixes for batch output, task resolution, and project name mapping.

## Workspace-Repository Access Syncing

New feature enabling workspace access to match VCS repository permissions:

- Public repos become public workspaces; private repos restrict access to users with repo access on the VCS provider.
- Configurable in workspace settings.

## Nx Cloud Client & Artifact Encryption

- New `decrypt-artifact` CLI command lets workspaces using client-side E2E encryption decrypt artifacts downloaded from the Nx Cloud UI.
- Client crash fix for particularly large runs with daemon enabled.

## Performance & Resource Optimization

Significant work on reducing Nx's resource footprint:

- **jemalloc allocator**: 81% reduction in memory fragmentation and 26% reduction in RSS.
- **Glob pattern caching**: 95.6% cache hit rate for repeated project graph computations.
- **Daemon improvements**: Stale graph recomputation prevention, inotify watch reduction (upgraded watchexec), macOS file watching moved to recursive FSEvents instead of kqueue.
- **TUI optimization**: Logger initialization gated behind env var, terminal output deduplication, parking lot rwlock prevents hangs.

## Framer Migration

The marketing website migration from Framer to nx.dev completed this month (~30 issues). All pages — homepage, pricing, enterprise, solutions, contact, community, company, brands, webinar, careers, resources, blog index — are now served from the Nx platform. Includes SEO handling, GTM tracking bridge, and header migration.

## TUI & Developer Experience

The terminal UI received significant stability improvements:

- Parking lot rwlock prevents hangs; PTY resize handled gracefully.
- Task selection preserved when unrelated tasks finish; batch tasks visible in TUI.
- Terminal output deduplication reduces noise.
- Daemon improvements: stale socket cleanup, inotify watch reduction, SQLite transaction retry on busy.

## Breaking Changes / Action Required

- **Upgrade to 22.5.3+** to patch CVE-2026-26996 (minimatch).
- **`nxCloudId` no longer auto-generated** for new workspaces (22.5.2) — use explicit opt-in.
- **ESLint v10 support** added (22.5.3) — linter plugin now compatible with both v9 and v10.

## Coming Soon

- **Polygraph AI** continuing into cross-repo plan mode and Nx examples.
- **IO tracing** expanding to all enterprise tenants (AWS and GCP); inputs-vs-expected-outputs comparison.
- **Self-Healing CI** BYOK/written-off credits for enterprise AI credits launch.
- **.NET Support** actively in development.
- **Workspace visibility** expanding to Azure DevOps OAuth.
- **Surface Level Telemetry** being rewritten in Rust for performance.
- 22.6.0 beta series active with further sandboxing and TUI improvements.

## By the Numbers

| Metric | Count |
|--------|-------|
| CLI releases (stable) | 4 (22.5.0, 22.5.1, 22.5.2, 22.5.3) |
| CLI backport | 1 (21.3.12) |
| CLI beta releases | 10 (22.5.0-beta.3 through 22.6.0-beta.7) |
| Cloud releases | 24 (11 features, 13 fixes) |
| Infrastructure commits | ~130 (meaningful, filtered) |
| Linear issues completed | 454 across 6 teams |

| Team | Issues Completed |
|------|-----------------|
| NXC (CLI) | 84 |
| CLOUD | 85 |
| NXA (RedPanda) | 111 |
| Q (Quokka) | 89 |
| INF (Infrastructure) | 60 |
| DOC (Docs) | 25 |

### Projects Completed
- Framer Migration (CLOUD) — Benjamin Cabanes
- Lighthouse: Google Auth & Remove IaP (INF) — Steve Pentland
- Bucket access binding → memberships (INF) — Patrick Mariglia
- Remove ability to use non-signed storage (INF) — Szymon Wojciechowski
- Pylon Rollout & Evaluation (CS) — Steven Nance
- In-depth Podman/Buildah validation (INF) — Patrick Mariglia
- Update and unify terraform provider versions (INF) — Szymon Wojciechowski
- Improve workspace analytics UX (CLOUD) — Dillon

## Questions? Contact

- **Task Sandboxing / IO Tracing**: Rares Matei, Steve Pentland, Louie Weng
- **Polygraph AI**: Jonathan Cammisuli, Victor Savkin
- **Self-Healing CI**: James Henry, Mark Lindsey, Chau Tran
- **CLI / AX**: Max Kless, Colum Ferry, Jack Hsu
- **Onboarding & Cloud**: Nicole Oliver, Dillon
- **JVM (Gradle/Maven)**: Louie Weng, Jason Jean, Max Kless
- **Infrastructure**: Steve Pentland, Patrick Mariglia, Szymon Wojciechowski
- **Docs**: Jack Hsu, Caleb Ukle

_Generated on 2026-02-28. For the full technical changelog, see Document 2._
