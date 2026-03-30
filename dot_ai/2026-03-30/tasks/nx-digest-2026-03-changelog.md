# Nx Platform Technical Changelog -- March 2026

> Generated: 2026-03-30 | CLI: 22.5.4 - 22.6.3 (5 stable releases) | Cloud: 17 releases | Infrastructure: ~100 commits | Linear: 328 issues closed across 6 teams

---

## 1. Task Sandboxing & Hermetic Builds

50+ issues across NXC and Q teams. eBPF-based io-tracing moves from experiment to production-ready.

### CLI
- IO tracing integration and sandbox support across affected task runners
- Dependency filesets for hermetic input tracking (22.6.0)
- Runtime input cache fix (22.6.2)
- `d.ts` fileset fix for accurate type-level dependency tracking (22.6.3)

### Cloud
- Sandbox UI and reporting for traced tasks
- Task summary data fix for Self-Healing CI ([CLOUD](https://linear.app/nxdev/issue/CLOUD) issues in 2603.27.4)

### Infrastructure
- IO tracing deployments for customer tenants: ClickUp, Legora, GCP tenants
- Customer STs: Island, Wix sandboxing rollouts

---

## 2. AI-Powered Development

New `configure-ai-agents` command and agentic mode bring AI-native workflows into Nx.

### CLI
- `configure-ai-agents` command: generates AGENTS.md / .claude / Cursor / Codex / Gemini configs (22.6.0)
- Agentic mode in `nx init` and `nx import` -- AI tools can drive workspace setup non-interactively (22.6.0)
- CNW non-interactive mode improvements for agent-driven workspace creation (22.6.3)

### Cloud
- Self-Healing CI git hook support: `prepare-commit-msg` and `commit-msg` hooks (2603.12.1)
- Self-Healing CI error alert styling improvements (2603.10.5)
- Model provider notification banner (2603.10.5)

### Polygraph / Conformance
- 21 NXA issues completed: standalone Polygraph build-out
- Frontend auth and org management
- CLI publishing pipeline
- Polygraph gitignore support shipped in 22.5.4

### Infrastructure
- Polygraph dev deployment, secrets, DNS, ingress, MongoDB wiring
- Customer enablement: Mimecast (AI features), Cloudinary (self-healing)

---

## 3. Performance & Reliability

Memory, daemon, and TUI improvements for large-workspace stability.

### CLI
- **jemalloc memory allocator** with tuned decay -- reduces daemon memory footprint (22.6.0)
- macOS FSEvents fix -- resolves file watching failures on Apple Silicon (22.6.0)
- Daemon memory and stability fixes (22.6.0)
- TUI crash fixes (22.6.2)
- SQLite retry logic and DB corruption prevention (22.6.1)
- Deps cache optimization (22.5.4)
- Batch hashing for JVM projects (22.6.0)
- `preferBatch` option for task execution (22.6.0)
- Parallel limit fix (22.6.2)
- `windowsHide` on all spawned processes (22.6.1)
- Shell metacharacter quoting fix (22.6.1)
- Chalk v4 compatibility (22.6.3)
- Cache debug commands (22.6.0)

---

## 4. Security

CVE patches, pentest remediations, and supply-chain hardening.

### CLI
- CVE fixes: minimatch (22.5.4), copy-webpack-plugin, koa, serialize-javascript, nuxt
- Bun loop detection fix (22.5.4)

### Cloud
- 5 pentest remediation issues completed
- Clickjacking headers added

### Infrastructure
- **GitHub Action SHA pinning** across all repos (5 issues) -- Szymon
- Secrets management: split dev/staging/prod secrets (6 issues) -- Szymon
- Azure Redis auth for wf-controller and nx-api (4 issues) -- Szymon

---

## 5. Onboarding & Growth

CNW funnel recovery, telemetry GA, and streamlined Cloud onboarding.

### CLI
- CNW flow restore after regression (22.5.4)
- **Surface Level Telemetry** reaches GA: analytics and telemetry pipeline (22.6.0)
- A/B test cloud setup prompt (22.6.3)
- Analytics skip on handoff fix (22.6.1)
- Telemetry improvements (22.6.2)

### Cloud
- Plan selection (Hobby/Team) during onboarding (2603.11.1)
- Auto-open browser for Cloud setup (22.6.2)
- `nx-cloud onboard` CLI command (2603.27.3)
- Verify email UI refresh (2603.10.13)
- GitHub app install redirect fix (2603.10.1)
- GitHub app config warnings (2603.04.3)
- Changelog link in footer (2603.20.1)

---

## 6. JVM Ecosystem (Gradle & Maven)

### CLI
- Maven external dependencies now appear in project graph (22.6.0)
- Batch hashing fixes for JVM projects (22.6.0)
- Gradle atomizer fixes
- Batch runner improvements for Gradle

---

## 7. Infrastructure & Scale

Major multi-cluster work and networking modernization.

### Infrastructure
- **Multi-Cluster Agent Setups** (22 issues): facade controller, routing engine, downstream discovery, Helm chart, dev deployment -- Steve Pentland
- **K8S Gateway API** (7 issues): GCP Gateway API migration, TLS termination, cert-manager, external-dns -- Patrick Mariglia
- **PrivateLink Service** (4 issues): AWS documentation, cost estimation, GCP/Azure research -- Szymon
- **Valkey Rename** (3 issues): environment variable aliases -- Szymon
- **Grafana Billing Alerts** (3 issues): Spacelift integration, cost alerting -- Szymon
- Customer STs: Caseware (new AWS tenant), CIBC (SAML), Legora (SAML + GH app), Mimecast, Cloudinary

---

## 8. Self-Healing CI

### Cloud
- Git hook support: `prepare-commit-msg` and `commit-msg` (2603.12.1)
- Access expansion for allowed email domains (2603.07.1)
- Error alert styling fix (2603.10.5)
- Task summary data fix (2603.27.4)
- Credit management improvements
- Commit message compliance checks

---

## 9. Ecosystem & Framework Support

### CLI
- **Vite 8** support (22.6.0, patched in 22.6.2)
- **Angular 21.2** support (22.6.0)
- **ESLint v10** support with flat config fixes (22.6.0, 22.6.1)
- **Yarn Berry catalogs** support (22.6.0)
- **pnpm catalog** support (22.6.0)
- Module-federation ESM support (22.6.2)
- Playwright `cacheDir` option (22.6.0)
- Angular-rspack postcss fix (22.5.4)
- `NX_SKIP_FORMAT` env var (22.6.0)
- Negation patterns for plugins (22.6.0)
- `--stdin` flag for `nx affected` (22.6.0)

---

## 10. Nx Release

### CLI
- SSH URL support for `nx release` (22.5.4)
- OTP support for publishing
- Version bump fixes
- Changelog deduplication
- `nx migrate` error handling improvements (22.6.1)

---

## 11. Cloud UX & Observability

### Cloud
- CIPE duration percentile analytics: p95/p75/p50/p25/p5 (2603.04.2)
- CIPE branch filter width fix (2603.06.7)
- Log UI search state persistence fix (2603.07.2)
- YAML anchor/alias parsing fix for distribution config (2603.11.3)
- VCS org access via access policies with OAuth sync and cooldown refresh (2603.24.5)
- Artifact download for read-token users (2603.24.6)
- Prettier config boundary fix (2603.20.2)

---

## 12. Documentation & Developer Experience

### CLI / Docs
- 33 DOC issues completed
- Blog extraction to Astro (in progress)
- AI traffic tracking
- Telemetry documentation
- Sandboxing documentation
- Tutorial improvements

---

## Linear Project Status

### Completed Projects
| Project | Status |
|---------|--------|
| GH Action SHA Pinning | Done |
| Surface Level Telemetry | GA |
| Grafana Billing Alerts | Done |
| Review Nx Resource Usage | Done |
| MNP.ca PoV | Done |

### Active Projects
| Project | Theme |
|---------|-------|
| Multi-Cluster Agent Setups | Infrastructure |
| K8S Gateway API | Infrastructure |
| Polygraph Standalone | AI / Conformance |
| Task Sandboxing (IO Tracing) | Hermetic Builds |
| PrivateLink Service | Infrastructure |

### Issue Counts by Team (March 2026)

| Team | Issues Closed | Focus Areas |
|------|---------------|-------------|
| NXC (Nx CLI) | 97 | Sandboxing, AI agents, performance, ecosystem |
| NXA (Nx Apps / Polygraph) | 50 | Polygraph standalone, conformance |
| Q (Quality / Sandboxing) | 36 | IO tracing, hermetic builds |
| DOC (Documentation) | 33 | Blog migration, tutorials, telemetry docs |
| CLOUD | 32 | Onboarding, self-healing, observability |
| INF (Infrastructure) | ~80 | Multi-cluster, Gateway API, security |
| **Total** | **328** | |

---

## Data Gaps

- Pylon customer support data not available for this period
- No blog posts published in March 2026
- Individual Linear issue IDs not mapped to specific CLI/Cloud changes (bulk data only)

---

## CLI Release Timeline

| Version | Date | Highlights |
|---------|------|------------|
| 22.5.4 | Mar 4 | Polygraph gitignore, SSH URL support, CNW flow restore |
| 22.6.0 | Mar 18 | AI agents, jemalloc, telemetry, Vite 8, Angular 21.2, ESLint v10 |
| 22.6.1 | Mar 20 | Shell quoting, DB corruption prevention, ESLint flat config |
| 22.6.2 | Mar 26 | Auto-open browser, TUI fixes, module-federation ESM |
| 22.6.3 | Mar 27 | A/B test prompts, d.ts fileset fix, CNW non-interactive |
