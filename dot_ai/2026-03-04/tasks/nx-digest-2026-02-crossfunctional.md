# Nx Platform Update — February 2026

> **Data gaps:** None. All four sources (CLI GitHub releases, Cloud changelog, cloud-infrastructure repo, Linear) were accessible. [Notion](https://www.notion.so/nxnrwl/) and [Pylon](https://app.usepylon.com/) used for customer engagement and support context.

## TL;DR

- **Nx joined the Linux Foundation and Agentic AI Foundation** — establishing Nx as a key player in open standards for AI-powered development tools.
- **nx.dev fully migrated to Framer** — the entire marketing site (homepage, pricing, enterprise, all landing pages) is now on Framer with a new mega menu, consolidated tracking, and improved SEO.
- **Task sandboxing shipped end-to-end** — from eBPF-based IO tracing in the daemon, to signal file creation, to a full Cloud UI with violation reports, strict mode, and downloadable raw reports. Now dogfooding on Nx and Ocean.
- **CLI performance dramatically improved** — jemalloc reduced memory fragmentation by 81% and RSS by 26%; glob pattern caching hit 95.6% cache hit rate; daemon file watcher memory/CPU issues resolved.
- **Pylon support platform fully deployed** — 42 issues completed to migrate from Salesforce, including SLA management, DPE routing, Slack/Teams/Gmail integration, and custom domains.
- **463 issues completed** across 7 teams in 28 days — Red Panda (111), Quokka (80), Nx CLI (80), Nx Cloud (67), Infrastructure (55), Customer Success (42), Docs (28).

## AI-Powered Development

The `configure-ai-agents` command matured significantly: it now auto-detects the AI agent environment, copies Nx skills/subagents/plugins, handles Codex support, and shows an outdated message after tasks if the configuration needs updating. A new `--stdin` flag for `nx affected` enables AI agents to pass file lists directly. `nx init` and CNW both auto-detect when running inside an AI agent and set up the AI toolchain automatically.

Polygraph AI shipped GitHub Actions integrations, cross-repo plan mode, and graph visualization with edge drawing. The `.nx/polygraph` directory is now auto-added to `.gitignore`.

Self-Healing CI expanded to BitBucket and Azure DevOps setup flows. Organization admins now see auto-apply fix recommendations inline. The "Experimental" badge was removed from AI features. Self-Healing CI can now be enabled during repository onboarding (checkbox enabled by default).

nx.dev published `llms.txt` and `llms-full.txt` for LLM discovery, plus `.md` URL variants for all docs pages.

**Blog posts:**
- [Nx 2026 Roadmap: Expanding Agent Autonomy, Improving Performance, Better Polyglot and More](https://nx.dev/blog/nx-2026-roadmap) (Feb 4)
- [Why Monorepos are King in the Age of AI](https://nx.dev/blog/why-monorepos-are-king-in-the-age-of-ai) (Feb 18 webinar)

## Task Sandboxing & Hermetic Builds

Task sandboxing went from early development to a fully functional feature this month. The system now tracks file reads, writes, deletions, and renames during task execution using eBPF-based IO tracing. Signal files coordinate between the Nx CLI and the tracing daemon to scope events per task.

The Cloud UI shows violation reports with warning banners, downloadable raw reports, process commands and PIDs for debugging, and a strict mode toggle that fails builds on violations. A virtualized file tree handles large reports efficiently.

Key hardening: node_modules and out-of-workspace files are excluded from analysis; non-cacheable and continuous tasks are filtered from violations; container PID-to-host PID mapping works correctly; race conditions between daemon and task completion are resolved.

The feature is now dogfooding on both the Nx repo and Ocean (Nx Cloud). Sandbox endpoints are enabled on staging.

**Docs:** A new [sandboxing documentation page](https://nx.dev/docs/features/ci-features/sandboxing) was published.

## nx.dev Migrated to Framer

The entire nx.dev marketing site migrated from Next.js to Framer. This includes: homepage, pricing page (with new comparison table and plan cards), enterprise page, security page, community page, company page, resources page, customers page, brands page, partners page, all contact pages, all solutions pages, Java and React landing pages, careers page, 404 page, and the blog index.

A new header with mega menu replaced the old navigation. Marketing scripts were consolidated into Google Tag Manager. Canonical URLs point to nx.dev. Victor and Nicole confirmed "everything is same or better."

SEO titles and descriptions were reviewed across all pages. The Framer rewrite handles URL routing so that `/blog`, `/courses`, and `/api` remain in the original app while everything else serves from Framer.

## Performance & Reliability

The "[Review Nx Resource Usage](https://linear.app/nxdev/project/review-nx-resource-usage)" project delivered dramatic wins:

- **jemalloc allocator**: -81% memory fragmentation, -26% RSS. Tuned decay timers prevent premature memory return to the OS.
- **Glob pattern caching**: 95.6% cache hit rate (9,758/10,202 calls cached), eliminating redundant glob compilations.
- **Daemon file watcher**: Upgraded watchexec to reduce inotify watch count. Switched macOS to recursive FSEvents instead of non-recursive kqueue, fixing the main culprit for high CPU/memory on Mac.
- **Plugin workers**: Now shut down eagerly after graph creation when they don't provide later hooks, freeing resources.
- **Output deduplication**: Terminal output duplication and allocations reduced in the task runner. Batch process terminal output accumulation removed when not needed.
- **Gitignore matching**: Replaced buggy `ignore-files` trie with correct path-component matching.

The Nx CLI also removed the `shellapi` Windows API feature to eliminate antivirus false positives, and replaced chalk with picocolors throughout the nx package.

## Onboarding & Workspace Connection

The "[600 Workspaces Connected Every Week](https://www.notion.so/2fe69f3c238780858153f7166ddbe886)" initiative ran multiple A/B experiments on the Cloud onboarding flow throughout February, testing different welcome views, cloud prompts, and explicit opt-out options. The browser-based CNW bottom sheet was replaced, and the one-page connect workspace flow for GitHub and GitLab was streamlined.

Users can now connect workspaces using PNPM catalogs through GitHub and GitLab. A link was added for users arriving from `create-nx-workspace` to easily create a new workspace.

CNW variant 2 with deferred Cloud connection was locked in as the default. NDJSON AI output and `--template` flags are now standard.

## Security

- **CVE-2026-26996**: Minimatch ReDoS vulnerability patched by bumping to 10.2.1 ([#34509](https://github.com/nrwl/nx/pull/34509)).
- **Command injection fix**: `getNpmPackageVersion` was vulnerable to command injection — now sanitized ([#34309](https://github.com/nrwl/nx/pull/34309)).
- **AV false positive fix**: Removed `shellapi` from the Windows API feature set to stop triggering antivirus alerts ([#34208](https://github.com/nrwl/nx/pull/34208)).
- **IAM remediation**: Access keys older than 90 days rotated for Vanta compliance across all environments.
- **IAM binding → member migration**: Completed without downtime across staging, production, and all single tenants. More secure and manageable permissions model.

## JVM Ecosystem

Gradle and Maven plugins received substantial investment:

- **Gradle batch mode** is now opt-in via `preferBatch` executor option. Batch tasks display in the TUI. Debug env var added. Atomized task targets now correctly include `dependsOn`. Output files use globs for dependent tasks.
- **Maven batch mode** uses runtime class loading for version-agnostic execution. Batch runner `invoke()` is now synchronized to prevent concurrent access issues. `pom.xml` and ancestor pom files are correctly included as inputs.
- Icons updated from framework-specific logos to the Java Duke icon across both plugins.
- Nx is dogfooding Gradle batch mode on Ocean.

## Enterprise Operations

- **New single tenants provisioned**: Wix (GCP) and [Legora](https://www.notion.so/26469f3c238780529e80cb076ebfe8d1) (GCP) — both fully deployed with Terraform, Spacelift, lighthouse, and monitoring.
- **Cloudinary**: SAML enabled, GitHub app variables configured, new secrets for env vars.
- **[Celonis](https://www.notion.so/cb4bb6535ae944deb403c2c43d278c85)**: S3 VPC endpoint support for single-tenant artifacts. API replicas bumped 3→6 to handle load.
- **[ClickUp](https://www.notion.so/ba36374fd6874fb787c40bc511682868)**: C3D (Compute-optimized) nodes made generally available.
- **Emeria**: Node pool size increased.
- **AL2 → AL2023 migration**: Completed for all AWS agent nodegroups ahead of EKS 1.33 deprecation.
- **Workflow Controller**: Multi-replica support completed — async processing enabled in production and all single tenants, feature flag removed. Signal handling (SIGTERM/SIGINT) now works correctly. Graceful rollouts fixed.

## Support Infrastructure

The customer support stack completed a massive migration from Salesforce to [Pylon](https://app.usepylon.com/) ([design doc](https://www.notion.so/27d69f3c2387803f81e2c281f57c3841)) (42 issues). The new system includes:

- Slack and Teams integration (connected to each enterprise customer channel)
- Gmail forwarding and cloud-support@nrwl.io integration
- Bi-directional sync with Linear for issue tracking
- SLA tiers defined for all plan levels (free, teams, enterprise standard, enterprise velocity)
- Automated routing: issues auto-assign when the account has a DPE, SLA breaches push to #sla-breach channel
- AI-powered filtering classifies billing issues as P1
- Custom domains: help.nx.app (knowledge base), support.nx.app (customer portal)
- Support rotation with working hours, round robin, and OOO handling

## Workspace Visibility

A new workspace visibility model shipped: workspaces can now sync access based on repository membership via the VCS provider. OAuth integration added for Bitbucket. Settings UI updated with repository access options. Feature enabled on dev environment.

## Documentation

The docs site got a major structural overhaul:

- **New sidebar structure**: Topics-based reorganization with PoC shipped and iterated.
- **DNS switched to Netlify** — a significant infrastructure change for nx.dev.
- **Search improvements**: Plugin registry pages boosted in search, CLI command reference pages given higher ranking, search dialog widened.
- **Getting Started pages improved** for AI agent experience.
- **OG images fixed** — were incorrectly pointing to localhost:3000.
- **Page view tracking** added server-side for accurate analytics.
- **Link auditing**: Internal links checked and fixed across the site.

**Blog posts:**
- [Nx Joins the Linux Foundation and the Agentic AI Foundation](https://nx.dev/blog/nx-joins-linux-foundation-and-aaif) (Feb 25)
- [How Broadcom stays efficient and nimble with monorepos](https://nx.dev/blog/broadcom-success-story) (Feb 10)

## Observability & Infrastructure

- **Lighthouse modernized**: Google Auth replaced IaP, RBAC implemented, login audit logging added, password management moved to backend.
- **Grafana billing alerts**: Alert conditions defined, wired to FE banners for cost spike notifications.
- **PostHog**: Two reverse proxies added for analytics data collection.
- **Terraform/Tofu**: All providers updated (AWS, GCP, Azure, Grafana, MongoDB Atlas). Tofu version bumped.
- **IO trace daemon**: Internal Helm chart created and deployed to snapshot and staging environments.

## Enterprise PoV Updates

- **[Anaplan](https://www.notion.so/1f569f3c238780509431d6d3bc7ac87c)**: Seeing value (2+ hrs/week dev time saved, 10-15% faster pipeline). Goal posts moving on cost justification.
- **[CIBC](https://www.notion.so/13f69f3c238780edb774c191ee86be3a)**: Blocked on encryption key issue with Azure (PoV blocker).
- **Cisco**: Security review in progress, waiting on MSA.
- **Rocket Mortgage**: At Risk — no recent customer updates.
- **[McGraw Hill](https://www.notion.so/28169f3c2387803289bbfca5b6d1cd6c)**: Building business case before proceeding.

## Breaking Changes / Action Required

None this month.

## By the Numbers

| Metric                         | Count                              |
| ------------------------------ | ---------------------------------- |
| CLI stable releases            | 4 (22.4.5, 22.5.0, 22.5.1, 22.5.3) |
| CLI backport releases          | 1 (21.3.12)                        |
| CLI pre-releases               | 8 (22.5.0-beta.3–5, 22.6.0-beta.0–7) |
| Cloud releases                 | 24                                 |
| Linear issues completed        | 463 across 7 teams                 |
| Enterprise customers onboarded | 2 (Wix, Legora)                    |
| Blog posts published           | 4                                  |
| Projects completed             | 12+                                |

## Questions? Contact

- AI / Agentic Experience / Polygraph: Max, Jonathan, Victor
- Task Sandboxing / IO Tracing: Rares, Louie, Craigory
- Performance / CLI Core: Leo, Jason, Craigory
- Framer Migration / Marketing Site: Ben, Heidi
- Onboarding & Cloud: Nicole, Dillon, Colum, Mark
- Self-Healing CI: James
- JVM (Gradle/Maven): Louie, Jason, Max
- Enterprise / Infrastructure: Patrick, Steve, Szymon
- Support / Pylon: Steven, Cory
- Docs: Jack, Caleb
- Security: Jason, Leo

_Generated on 2026-03-04. For the full technical changelog, see the companion changelog document._
