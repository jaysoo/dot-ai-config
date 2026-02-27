# Nx Platform Update — February 2026

> **Data gaps:** None — all four sources (CLI GitHub releases, Cloud changelog, cloud-infrastructure repo, Linear) were available.

## TL;DR

- **Task Sandboxing & IO Tracing** is live on snapshot and staging (production infrastructure is provisioned but the feature is not yet enabled) — Nx can now trace every file read/write during task execution, detect undeclared inputs/outputs, and surface anomalies in the Cloud UI with strict-mode enforcement.
- **Self-Healing CI** expanded broadly: now available for BitBucket and Azure DevOps, AI features lost their experimental badge, auto-apply recommendations help teams adopt fixes automatically, and it can be enabled during onboarding with one checkbox.
- **AI-Powered Development** expanded significantly: improved `configure-ai-agents`, agentic workspace creation, `nx list --json` for tool discovery, `apply-locally` passthrough, and the new **Polygraph AI** product entered active development.
- **Performance overhaul** delivered dramatic daemon improvements: jemalloc allocator (-81% memory fragmentation, -26% RSS), cached glob patterns (95.6% hit rate), and macOS FSEvents watcher replacing kqueue.
- **Security fixes** shipped: CVE-2026-26996 (minimatch), a command injection vulnerability, IAM access key rotation, and access control confirmation safeguards.

---

## Task Sandboxing & Hermetic Builds

Nx now includes an IO tracing system that monitors every file a task reads and writes during execution. This enables detection of undeclared dependencies and outputs — a major step toward truly hermetic, reproducible builds.

**What customers can do now:**
- Enable sandboxing in workspace settings to get file-level visibility into what each task actually touches vs. what's declared in configuration.
- View anomaly reports directly in the Cloud UI task details — with warning indicators, downloadable raw reports, and process-level attribution (which subprocess wrote which file).
- Choose between "warning" and "strict" enforcement modes. Strict mode fails CI when undeclared file access is detected.
- Use `nx show target --inputs --outputs` to inspect and verify task configurations locally.

The feature is currently enabled on snapshot and staging environments, with the Nx repo and Ocean as dogfooding targets. Production infrastructure (service accounts, helm charts, IAM permissions) has been provisioned across production and enterprise single-tenant environments, but the feature is not yet enabled there.

**Leads:** Rares Matei, Craigory Coppola (CLI), Louie Weng (Cloud UI), Steve Pentland (Infrastructure)

---

## Self-Healing CI

Self-Healing CI received broad platform expansion this month. The AI features within self-healing lost their "experimental" badge.

**What's new:**
- **BitBucket and Azure DevOps support** — in-app setup is now available for all major VCS providers, not just GitHub and GitLab.
- **Auto-apply recommendations** — organization admins now see AI-generated suggestions for which tasks and patterns are good candidates for fully automated fix application.
- **One-click onboarding** — when connecting a new repository, Self-Healing CI can be enabled with a single checkbox. It automatically generates the CI workflow configuration.
- **Apply-locally improvements** — when applying fixes via VCS comments or the CLI, Nx Cloud now highlights pending auto-apply configuration recommendations.
- **Better failure visibility** — detailed failure reasons now appear in the Technical Details section when fixes fail.

Customer rollouts continued for Emeria, CREXi, MailChimp, Moderna, PayFit, Island, and ClickUp.

**Leads:** James Henry, Mark Lindsey, Chau Tran (RedPanda)

---

## AI-Powered Development (Agentic Experience)

The AI/agentic developer experience saw the most cross-cutting investment this month, spanning CLI tooling, Cloud integration, and a new product.

**configure-ai-agents & MCP:**
- Improved skill/subagent/plugin copying during setup.
- Better CLAUDE.md generation with updated agent rules.
- Auto-detection of AI agents with NDJSON output for non-interactive use.
- Version-aware updates — only pulls latest when local version differs.
- Graceful Ctrl+C handling and better messaging.
- Claude plugin migrated to repo root for easier discovery.

**New CLI capabilities for agents:**
- `nx list --json` provides structured output for tool/plugin discovery.
- `nx-cloud apply-locally` passthrough enables agents to apply Cloud-suggested fixes.
- Agent sandbox detection utility for agentic environments.

**Polygraph AI** (new product entering development):
- AI-driven code review and change management sessions integrated with GitHub Actions.
- Multi-repo support with session tracking, author attribution, and PR association.
- Cloud UI for managing Polygraph sessions.

**Workspace onboarding for agents:**
- Agentic `create-nx-workspace` can now set up the entire platform automatically.
- Agentic `nx import` improvements in QA.
- Agentic `nx init` and `nx connect` flows in progress.

**Leads:** Max Kless, Colum Ferry (CLI AX), Jonathan Cammisuli, Victor Savkin (Polygraph), Jack Hsu (agentic onboarding)

---

## Performance & Reliability

Major daemon and runtime performance improvements shipped, primarily driven by systematic investigation of high CPU and memory usage reported by large enterprise customers.

**Key improvements:**
- **jemalloc allocator** — switched the native allocator, reducing memory fragmentation by 81% and RSS by 26%.
- **Glob pattern caching** — compiled glob patterns are now cached in the native module with a 95.6% hit rate.
- **macOS file watcher** — replaced non-recursive kqueue with recursive FSEvents, dramatically reducing inotify watch count.
- **Gitignore matching** — rewrote the buggy `ignore-files` trie with correct path-component matching.
- **Daemon stability** — fixed stale graph recomputations, reconnect queue deadlocks, and SQLite "DatabaseBusy" retries.
- **TUI improvements** — eliminated output duplication, fixed resize crashes, and gated TUI logger behind env var.
- **Plugin lifecycle** — plugins that don't provide later hooks are now eagerly shut down to free resources.

The workflow controller also shipped multi-replica support with async status processing, now enabled across all production and enterprise environments.

**Leads:** Leosvel Perez Espinosa (CLI performance), Craigory Coppola (daemon/TUI), Patrick Mariglia (WF controller)

---

## Security

- **CVE-2026-26996** — Bumped minimatch to 10.2.1 to address a reported vulnerability.
- **Command injection** — Fixed a command injection vulnerability in `getNpmPackageVersion` (backported to 22.4.5).
- **IAM access key rotation** — All infrastructure access keys older than 90 days were rotated.
- **IAM binding migration** — Migrated from IAM Bindings to IAM Members across all GCP environments for more granular access control.

**Leads:** Jason Jean (CLI security), Patrick Mariglia (IAM), Jack Hsu (Cloud access controls)

---

## JVM Ecosystem (Gradle & Maven)

Gradle and Maven support received significant investment, with batch mode being the headline feature.

**Gradle:**
- Batch mode is now production-ready — multiple Gradle tasks execute in a single JVM process, avoiding repeated startup overhead.
- Gradle batch executor supports debug mode via environment variable.
- Fixed critical issues: atomized target output handling, dependent task resolution, and project name mapping.
- Icon updated from Gradle logo to Java Duke for consistency.

**Maven:**
- Version-agnostic batch execution via runtime class loading.
- `pom.xml` and ancestor POM files are now automatically included as task inputs.
- Fixed Maven locator-to-project-name mapping.

**Leads:** Louie Weng (Gradle), Jason Jean (Maven), Max Kless (Maven)

---

## Onboarding & Workspace Connection

The team continued its push toward 600 workspaces connected per week with multiple experiments and UX improvements.

**Changes:**
- CNW messaging refined with decorative banners and deferred cloud connection flow.
- Explicit cloud opt-out option added to `create-nx-workspace`.
- One-page VCS integration forms streamlined for all providers.
- Repository-based access syncing — workspace access can now match VCS repository permissions automatically.
- PNPM catalog support added for onboarding.
- Multiple A/B experiments ran on the welcome/guide views through February.

**Leads:** Nicole Oliver, Colum Ferry, Jack Hsu, Dillon (Cloud onboarding)

---

## Framer Migration (Website)

The entire nx.dev marketing site was migrated to Framer this month — a complete overhaul covering homepage, pricing, enterprise, resources, webinars, solutions, company, community, careers, and all supporting pages.

**What changed:**
- All marketing pages now render from Framer, with docs remaining on Astro/Starlight.
- New header design migrated to Framer.
- Tracking consolidated into Google Tag Manager with a Framer-to-GTM event bridge.
- SEO titles and descriptions reviewed across all pages.
- DNS switched to Netlify for nx.dev.

**Leads:** Benjamin Cabanes, Jack Hsu, Heidi Grutter (copy/SEO review)

---

## Documentation

- **New sidebar structure** — docs sidebar reorganized into topic-based groupings.
- **LLM discovery** — added `llms-full.txt` and HTTP Link headers for AI tool integration.
- **Content deduplication** — getting started pages consolidated to reduce redundancy.
- **Search improvements** — widened search dialog, plugin registry visibility, CLI command examples boosted.
- **Netlify migration** — redirects moved from Next.js config to Netlify `_redirects` for better performance.

**Leads:** Jack Hsu, Caleb Ukle

---

## Infrastructure Operations

- **Lighthouse** — internal operations dashboard migrated from IAP to Google Auth with audit logging, forced logout, and dedicated service accounts.
- **Terraform modernization** — unified provider versions across all environments (AWS, GCP, Azure, Grafana, Atlas). Updated OpenTofu version.
- **Single-tenant provisioning** — Wix (PoV) and Legora (>100 team, PoV) environments stood up. Cloudinary received SAML setup and GitHub app changes.
- **AWS node groups** — AL2 worker nodes migrated to AL2023 for Flutter and Emeria.
- **NPM cache proxy** — nginx-backed read-through cache deployed to enterprise GCP tenants.
- **Grafana billing alerts** — new Terraform-managed alerting for billing thresholds.
- **Spacelift** — provider upgraded, admin stack reworked with proper role attachments.

**Leads:** Steve Pentland, Patrick Mariglia, Szymon Wojciechowski

---

## Breaking Changes / Action Required

None this month.

---

## New & Changed Commands

### Nx CLI
| Command | What changed | Version |
|---------|-------------|---------|
| `nx show target --inputs --outputs` | New flags to inspect declared inputs/outputs for a target | 22.5.x |
| `nx show target --check-input --check-output` | New flags to verify a specific file against declared config | 22.5.x |
| `nx list --json` | New `--json` flag for structured output (useful for AI agents/tooling) | 22.5.3 |
| `nx cloud apply-locally` | New passthrough — run Cloud-suggested fixes locally via `nx` | 22.5.3 |
| `nx configure-ai-agents` | Multiple improvements: copies skills/subagents/plugins, version-aware updates, graceful Ctrl+C, auto-creates config for executing agent | 22.5.0–22.5.2 |
| `nx watch --all --initialRun` | Fixed — these flags now work together correctly | 22.5.3 |

### Nx Cloud CLI
| Command | What changed | Version |
|---------|-------------|---------|
| `nx-cloud decrypt-artifact` | New command — decrypt downloaded artifacts for workspaces using client-side E2E encryption keys | 2602.12.6 |

---

## Coming Soon

- **IO Tracing inputs reconciliation** — ongoing work to align traced inputs with expected Nx outputs.
- **Agentic `nx init`, `nx connect`, `nx import`** — streamlined agentic onboarding flows in QA.
- **Continuous task assignment** — Valkey-based task assignment for Nx Agents, reducing idle time.
- **Polygraph AI** — GitHub Actions integration and multi-repo support entering beta.
- **Worktree improvements** — planned for March.
- **Extending target defaults** — new configuration options planned for April.
- **Docker multi-arch Nx release** — planned for April.
- **Enterprise self-healing billing** — monetization of self-healing for enterprise clients.

---

## By the Numbers

| Metric | Count |
|--------|-------|
| CLI releases | 6 (22.4.5, 22.5.0, 22.5.1, 22.5.2, 22.5.3, 21.3.12) |
| Cloud releases | 24 |
| Infrastructure commits | ~150 (human-authored) |
| Linear issues completed | ~480 across 6 teams |
| | NXC: 94 · CLOUD: 100+ · INF: 62 · NXA: 100 · Q: 99 · DOC: 27 |

## Questions? Contact

- **Task Sandboxing / IO Tracing**: Rares Matei, Craigory Coppola, Louie Weng
- **Self-Healing CI**: James Henry, Mark Lindsey, Chau Tran
- **AI / Agentic Experience / Polygraph**: Max Kless, Jonathan Cammisuli, Victor Savkin
- **Performance & Daemon**: Leosvel Perez Espinosa, Craigory Coppola
- **JVM (Gradle/Maven)**: Louie Weng, Jason Jean
- **Onboarding & Cloud**: Nicole Oliver, Colum Ferry, Jack Hsu
- **Framer / Website**: Benjamin Cabanes
- **Documentation**: Jack Hsu, Caleb Ukle
- **Infrastructure**: Steve Pentland, Patrick Mariglia, Szymon Wojciechowski
- **Security**: Jason Jean (CLI), Patrick Mariglia (IAM)

_Generated on 2026-02-27. For the full technical changelog, see Document 2._
