# Nx Platform Update — February 2026

> **Data gaps:** None — all four sources (CLI releases, Cloud changelog, infrastructure repo, Linear) were collected.

## TL;DR

- **Task Sandboxing** is now end-to-end: the CLI captures file I/O, the Cloud persists and analyzes it, and the dashboard surfaces anomalies. Strict mode can fail CI runs on violations.
- **Self-Healing CI** expanded to BitBucket and Azure DevOps, with auto-apply recommendations now visible to all org admins and one-click enablement during onboarding.
- **Performance & reliability** — jemalloc allocator, macOS file watching rewrite, daemon stability fixes, and async workflow controllers across production.
- **AI-powered development** — `nx configure-ai-agents` sets up MCP plugins, skills, and subagents in one command. Polygraph AI (PR analysis) is in internal dogfooding.
- **Security** — CVE-2026-26996 patched, command injection fix, IAM model hardened across all environments.

---

## Task Sandboxing & Hermetic Builds

Nx now monitors file I/O during task execution across the entire stack. Teams can enforce hermetic builds — if a task reads or writes files it shouldn't, Nx flags the violation.

- **CLI** — Task IO service captures file access events and sandbox violation signals. `nx show target` gained `--inputs`/`--outputs`/`--check-input`/`--check-output` flags.
- **Cloud** — New API endpoint persists IO tracing reports from Nx Agents. Dashboard shows anomaly details with file tree views and a raw report download.
- **Infrastructure** — io-trace-daemon deployed to dev, staging, and production. Helm chart, namespace isolation, service accounts, and ECR repos all provisioned across GCP and AWS.

Strict mode is available now. In WARNING mode, violations appear as banners; in STRICT mode, they fail DTE runs.

---

## Self-Healing CI

Self-Healing CI matured significantly this month — broader platform support, easier adoption, and better visibility.

- **BitBucket and Azure DevOps support** — In-app setup now covers all four major VCS platforms.
- **One-click onboarding** — Self-Healing CI can be enabled when connecting a repository. The system auto-creates a PR to add `nx fix-ci` to your CI config (GitHub Actions and GitLab CI).
- **Auto-apply recommendations** — Org admins see inline suggestions for tasks and patterns suitable for automatic fix application, both in settings and during the fix workflow.
- **Failure diagnostics** — Detailed failure reasons now appear in the Technical Details section for system admins.
- **Fix timeout extended** — From 30 to 90 minutes for complex fixes.
- **"Experimental" badge removed** — AI features in Self-Healing CI are now GA.

---

## AI-Powered Development (Agentic Experience)

- **`nx configure-ai-agents`** — One-command setup copies Nx skills, subagents, and MCP plugins into your workspace for Claude, Cursor, and other AI coding tools. Handles sandbox detection for agentic environments.
- **Smarter workspace creation** — `create-nx-workspace` detects AI agent contexts, outputs NDJSON for machine consumption, and generates better CLAUDE.md rules.
- **`nx list --json`** — Machine-readable plugin listing for AI tool integrations.
- **Polygraph AI** (coming soon) — AI-powered PR analysis with GitHub Actions integration, graph visualization, and multi-repo support. Currently in internal dogfooding.

---

## Onboarding & Workspace Management

- **Streamlined VCS integration forms** — Simpler setup for connecting version control systems.
- **Workspace-Repository Access Syncing** — New setting matches workspace access to VCS repository permissions. Public repos become public workspaces; private repos restrict access.
- **PNPM catalog support** — Workspaces using PNPM catalogs can now connect through GitHub and GitLab integrations.
- **Explicit Cloud opt-out** — `create-nx-workspace` now has an explicit option to skip Nx Cloud, replacing the implicit behavior.
- **New enterprise tenants** — Wix and Legora fully provisioned with SAML, ArgoCD, and Lighthouse integration.

---

## Performance & Reliability

- **macOS file watching rewrite** — Switched from non-recursive kqueue to recursive FSEvents, fixing missed file change events.
- **jemalloc allocator** — Reduces memory usage and fragmentation for the Nx daemon.
- **Daemon stability** — Fixed reconnect queue deadlocks, stale socket cleanup, EPIPE errors, stale project graph after rapid file changes, and SQLite DatabaseBusy retries.
- **Gitignore matching rewrite** — Replaced buggy trie-based matching with correct path-component implementation.
- **Terminal output** — Eliminated duplicate lines and reduced allocations in the task runner.
- **Workflow controller multi-replica** — Async processing enabled in production (NA/EU) and across enterprise tenants. Controller bumped to 2 replicas.
- **Cloud daemon crash fix** — Resolved crashes when processing particularly large runs.
- **Celonis scale-up** — nx-api replicas increased 3→6.

---

## JVM Ecosystem (Gradle & Maven)

- **Gradle batch mode** — Batch tasks now display in the TUI with debug env var support. Fixed output handling for atomized targets and dependent task resolution.
- **Maven batch mode** — Runtime class loading for version-agnostic execution. Output written after each task to ensure correct caching.
- **Maven plugin 0.0.13** — Correct locator-to-project mapping, pom.xml included as inputs for all targets.

---

## Security

- **CVE-2026-26996** — minimatch bumped to 10.2.1.
- **Command injection fix** — Prevented injection in `getNpmPackageVersion`.
- **IAM model migration** — All environments (staging, production, enterprise tenants) migrated from IAM Binding to IAM Member model.
- **Access control confirmation** — Cloud settings changes now require confirmation to prevent accidental modifications.
- **Grafana billing alerts** — Added to Terraform for cost anomaly detection.
- **Artifact decryption** — New `npx nx-cloud decrypt-artifact` command for workspaces with E2E encryption.

---

## Ecosystem & Framework Support

- **ESLint v10** — Full support in `@nx/eslint`.
- **Angular v21.2** — Supported, including SASS indented syntax fix for nx-welcome.
- **Node.js strip-types** — `NX_PREFER_NODE_STRIP_TYPES` uses Node's built-in type stripping (Node 22.6+).
- **Bun lockfile** — Fixed `--lockfile-only` handling.
- **Webpack `process.env`** — Fixed regression affecting `process.env` usage.
- **Vitest** — Fixed race condition on Node 24, removed redundant vite.config.ts generation.
- **Wildcard paths in enforce-module-boundaries** — More flexible boundary rules.
- **Playwright executor `cacheDir`** — Control browser binary storage location.
- **SWC** — Bumped to latest versions including swc/cli 0.8.0.

---

## Breaking Changes / Action Required

None this month.

---

## Coming Soon

- **Polygraph AI** — AI-powered PR analysis, in internal dogfooding now.
- **Continuous Task Assignment** — New Valkey-based scheduling for distributed execution.
- **Workspace Visibility** — Public/private toggle at the workspace level.
- **Improved Worktrees Support** — Better git worktree handling (mid-March).
- **Docker Multi-Arch Nx Release** — Multi-architecture Docker images (April).
- **Feature Demos & Activation Guides** — Onboarding content for Cloud features.
- **Multi-Cluster Agent Setups** — Infrastructure support for distributed agent clusters (April).

---

## By the Numbers

| Metric                            | Count                                          |
| --------------------------------- | ---------------------------------------------- |
| CLI releases                      | 6 (22.4.5, 22.5.0–22.5.3, 21.3.12 backport)    |
| Cloud releases                    | 23                                             |
| Linear issues completed           | 514 across 6 teams                             |
| Infrastructure projects completed | 3 (IAM migration, Lighthouse auth, AL2→AL2023) |

## Questions? Contact

- **Task Sandboxing / IO Tracing**: Rares Matei, Altan Stalker
- **Self-Healing CI / AI**: Max Kless, Jonathan Cammisuli
- **Onboarding & Cloud**: Louie Weng, Mark Lindsey
- **CLI Core**: Jason Jean, Craigory Coppola, Leosvel Perez
- **Infrastructure**: Steve Pentland, Patrick Mariglia
- **Docs**: Jack Hsu

_Generated on 2026-02-27. For the full technical changelog, see `nx-digest-2026-02-changelog.md`._
