# Nx Platform Update — February 2026

> **Data gaps:** None — all four sources collected (CLI GitHub releases, Cloud public changelog, cloud-infrastructure repo, Linear).

## TL;DR

- **Task Sandboxing** shipped end-to-end: the CLI traces file I/O per task, Cloud detects anomalies, and the UI surfaces violations with a raw-report download — giving teams hermetic-build confidence without changing a line of CI config.
- **Self-Healing CI** exited experimental: it now auto-enables during repo onboarding, supports BitBucket/Azure DevOps, and surfaces auto-apply recommendations so teams can progressively trust it.
- **AI-Powered Development** expanded significantly with a new `configure-ai-agents` command, Nx MCP plugin improvements, Claude/Cursor/OpenCode integration, and NDJSON output for agentic workspace creation.
- **Continuous Task Assignment** (a major rewrite of distributed task scheduling via Valkey) entered testing, promising faster agent utilization and reduced idle time in CI pipelines.
- A **Framer migration** replaced the nx.dev marketing site (44 pages), and the docs site completed a sidebar restructure, DNS migration to Netlify, and search improvements.

---

## Task Sandboxing & Hermetic Builds

Nx can now trace every file read and write during task execution and flag anomalies — inputs your task uses but didn't declare, or outputs written to unexpected paths. This is the foundation for truly hermetic, reproducible builds.

**What customers can do now:**
- Enable sandboxing on any workspace to get a per-task I/O analysis in the Nx Cloud run view, including a downloadable raw report.
- Set the workspace to "warning" mode (banner alerts) or "strict" mode (fail the pipeline when violations are found).
- Use `nx show target --inputs --outputs` to inspect declared vs. actual I/O before committing configuration changes.

The feature was deployed to staging and production infrastructure and is actively dogfooded on the Nx and Ocean (Nx Cloud) codebases.

**Scope:** 53 Linear issues across CLI and Cloud teams, plus significant infrastructure work deploying the io-trace daemon to all environments (development, staging, production, and enterprise single-tenants on both GCP and AWS).

---

## Self-Healing CI

Self-Healing CI — which uses AI to diagnose and fix flaky or broken CI tasks — is no longer experimental. It received broad improvements this month:

- **Onboarding integration:** Self-Healing CI can now be enabled with a single checkbox during repository connection. If no CI workflow exists, one is auto-generated for GitHub Actions or GitLab CI.
- **BitBucket & Azure DevOps:** In-app setup is now available for these VCS providers (previously GitHub/GitLab only).
- **Auto-apply recommendations:** Admins see inline suggestions for which tasks/patterns are good candidates for automatic fix application.
- **Improved transparency:** Detailed failure reasons are shown in the Technical Details section when fixes fail. Self-healing logs are surfaced in the CIPE UI. Audit logging tracks config changes.
- **Apply locally:** `nx-cloud apply-locally` is now a passthrough command from `nx`, making it easier to test fixes on a developer machine.
- **Retry on latest commit:** Users can now retry self-healing on the latest commit instead of being stuck on the commit that triggered the failure.

**Scope:** 34 Linear issues (Red Panda team) + 6 Cloud changelog entries.

---

## AI-Powered Development (Agentic Experience)

Nx's AI/agent integration expanded across multiple fronts:

- **`nx configure-ai-agents`** now copies skills, subagents, and MCP plugin configuration for Claude Code, Cursor, and OpenCode — with sandbox detection so it works correctly inside agent-controlled environments.
- **Agentic workspace creation:** `create-nx-workspace` detects when it's being run by an AI agent (e.g. Claude Code) and outputs NDJSON for structured consumption. The cloud connection flow is deferred so agents can complete setup without interactive prompts.
- **MCP improvements:** `nx mcp` now uses the latest `nx-mcp` version, and flag overrides in MCP config are no longer reverted on changes.
- **PLUGIN.md files** updated across plugins to help agents verify correct tool usage.
- **`nx list --json`** added for better programmatic consumption by AI agents.
- **Polygraph AI** (internal, multi-repo coordination tool) progressed significantly with 27 issues completed — repository discovery, PR graph visualization, and GitHub Actions integration.

**Scope:** 35 Linear issues across CLI and Red Panda teams.

---

## Continuous Task Assignment (DTE Scheduling Rewrite)

A major rewrite of the distributed task execution scheduler is underway, replacing the current scheduling approach with Valkey-backed continuous assignment. This promises:

- **Faster task pickup:** Tasks are assigned to agents as they become available, rather than in batches.
- **Better utilization:** Reduced idle time between task completions and new assignments.
- **Improved resilience:** Agents that stall during shutdown are handled gracefully; shrinking worker pools no longer risk killing active tasks.

The feature completed 24 issues this month and is in active testing. It is not yet generally available.

---

## Workspace Onboarding & Connection

The "600 workspaces connected per week" initiative drove 12 issues focused on reducing friction in workspace connection:

- **One-page connect flow:** GitHub and GitLab onboarding consolidated into a single streamlined page.
- **PNPM catalogs support:** Workspaces using PNPM catalogs can now connect via GitHub and GitLab.
- **Workspace-Repository access syncing:** A new setting matches workspace access to VCS repository access — public repos become public workspaces, private repos restrict access to authorized VCS users.
- **Multiple CNW experiments** tested different prompt variants and welcome views to optimize conversion.

---

## Marketing Site Migration (Framer)

The nx.dev marketing site was migrated from Next.js to Framer (44 pages), including homepage, pricing, enterprise, solutions, blog, and all contact pages. Key details:

- SEO metadata reviewed across all pages.
- Pricing page refreshed with new plan tier cards and descriptions.
- Custom tracking events bridged to Google Tag Manager.
- Canonical URLs set to nx.dev.
- Header migrated to Framer for consistent navigation.

---

## JVM Ecosystem (Gradle & Maven)

Gradle and Maven support received substantial improvements:

- **Gradle batch mode** now displays correctly in the TUI, with debug env var support and proper atomized task handling.
- **Maven batch execution** loads classes at runtime for version-agnostic execution, with correct project name mapping and proper pom.xml input tracking.
- **Icon update:** Gradle and Maven icons replaced with the Java Duke icon across all UIs.

**Scope:** 18 Gradle issues + 4 Maven issues across CLI and Quokka teams.

---

## Performance & Reliability

- **Daemon resource usage** significantly reduced: upgraded watchexec to cut inotify watch count on Linux; switched to recursive FSEvents on macOS (fixing high CPU); jemalloc allocator adopted; stale recomputations skipped.
- **TUI improvements:** Fixed hangs during resize, reduced output duplication, fixed pinned pane toggle behavior.
- **Plugin workers** now shut down eagerly after graph creation, freeing resources during long-running task execution.
- **Nx Cloud client** fixed a crash with particularly large runs when the daemon was enabled.
- **Workflow Controller** now supports multi-replica deployments with async status processing, improving Cloud pipeline throughput across production and enterprise environments.

---

## Security

- **CVE-2026-26996:** Bumped `minimatch` to 10.2.1 to address a vulnerability ([#34509](https://github.com/nrwl/nx/pull/34509)).
- **Command injection fix:** Prevented command injection in `getNpmPackageVersion` ([#34309](https://github.com/nrwl/nx/pull/34309)).
- **E2E encryption CLI:** New `nx-cloud decrypt-artifact` command lets workspaces with client-side encryption keys decrypt artifacts downloaded from the Cloud UI.
- **Signed storage enforcement:** Removed the ability to use non-signed (direct) uploads from the executor/log uploader.
- **IAM key rotation:** Remediated aged IAM access keys flagged by Vanta compliance audits.
- **Self-healing obfuscation:** Ensured obfuscated client bundle contents are not written to agent logs.

---

## Documentation & Website

- **Sidebar restructured** into topic-based groupings (Getting Started, Platform Features, Knowledge Base, Technologies, References).
- **DNS switched to Netlify** for nx.dev — completing the hosting migration.
- **Search improvements:** Plugin registry, CLI command reference pages, and subcommand docs now surface correctly in search results. Search dialog widened.
- **Content updates:** GitHub app permissions documented, cache miss troubleshooting screenshots added, Getting Started pages deduplicated, Requirements sections added to technology docs.
- **LLM support:** `llms-full.txt` and HTTP Link headers added for LLM content discovery.
- **nx.dev outage** investigated and resolved (edge function timeout).

---

## Breaking Changes / Action Required

None this month.

---

## Coming Soon

- **Task Sandboxing** moving toward general availability — currently in dogfooding on Nx and Ocean.
- **Continuous Task Assignment** finishing testing, targeting GA in an upcoming release.
- **Polygraph AI** multi-repo coordination nearing external preview.
- **Workspace visibility** (public/private sync with VCS) rolling out incrementally.

---

## By the Numbers

| Metric | Count |
|--------|-------|
| CLI stable releases | 6 (22.4.5, 22.5.0, 22.5.1, 22.5.2, 22.5.3, 21.3.12 backport) |
| Cloud releases | 24 |
| Infrastructure commits | ~160 (human-authored) |
| Linear issues completed | 457 across 6 teams |

| Team | Issues Completed |
|------|-----------------|
| Nx CLI (NXC) | 85 |
| Nx Cloud (CLOUD) | 87 |
| Infrastructure (INF) | 60 |
| Red Panda (NXA) | 111 |
| Quokka (Q) | 89 |
| Docs (DOC) | 25 |

---

## Questions? Contact

- **Task Sandboxing / IO Tracing**: Rares Matei, Jonathan Cammisuli (CLI); Altan Stalker (Cloud/Quokka); Steve Pentland, Phil Mariglia (Infra)
- **Self-Healing CI / AI**: Max Kless, Colum Ferry (Red Panda)
- **Agentic Experience (AX)**: Max Kless (Red Panda); Jack Hsu, Jason Jean (CLI)
- **Continuous Task Assignment**: Altan Stalker (Quokka)
- **Onboarding & Cloud**: Louie Weng, Mark Lindsey (Cloud)
- **Framer Migration**: Colum Ferry (Cloud/Red Panda); Juri Strumpflohner
- **JVM Ecosystem (Gradle/Maven)**: Craigory Coppola, Miguel Sanchis (CLI); Altan Stalker (Quokka)
- **Infrastructure**: Steve Pentland, Phil Mariglia, Szymon Wojciechowski
- **Documentation**: Jack Hsu, Caleb Ukle (Docs)

_Generated on 2026-03-02. For the full technical changelog, see the companion document._
