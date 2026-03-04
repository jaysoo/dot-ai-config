# Nx Platform Changelog — March 2026 (Partial: March 1–4)

> **Sources:** Nx CLI GitHub releases (nrwl/nx), Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear (all teams).

---

## AI-Powered Development

### CLI
- Add Codex subagent support to `configure-ai-agents` ([#34553](https://github.com/nrwl/nx/pull/34553)) — 22.6.0-beta.9
- Add `.nx/polygraph` to gitignore in migration and `configure-ai-agents` ([#34659](https://github.com/nrwl/nx/pull/34659)) — 22.6.0-beta.8
- Improve AX of `configure-ai-agents` itself (NXA-1015)
- Nx Console: make `configure-ai-agents` clickable and improve outdated check (NXA-1033)
- Keep 'experimental' ref in claude plugin after `configure-ai-agents` (NXA-1022)
- Implement agentic `nx init` (NXA-921) — Milestone: Agentic onboarding is seamless
- Plan out robust future for `/sandbox` & nx (NXA-997)
- Create implementation plan for running migrations in custom workflow (NXA-959)
- Enable Codex subagents once supported (NXA-1023)

### Cloud — Polygraph AI
- Repo summarization (NXA-1011)
- Use workspace skill for summarization (NXA-1012)
- Sync PR statuses (NXA-1020)
- Close open PRs when completing session (NXA-1026)
- Workspace graph fix for `@`-prefixed projects (NXA-973)
- Ensure `getSession` uses workspaceId (NXA-1038)
- Add Nx and Nx examples to Polygraph (NXA-1013)
- Require `nx login` for agent setup (NXA-909)

### Cloud — Self-Healing CI
- Remove "Experimental" label from AI setting (NXA-1016)
- Make auto-apply more prominent in terminal/VCS/UI (NXA-969)

### Infrastructure
- Enable self-healing CI for Cloudinary enterprise instance

### Docs
- Add robots.txt enhancements, llms.txt, llms-full.txt, .md URL variants (DOC-390)

---

## Task Sandboxing & Hermetic Builds

### CLI
- Remove folder reads — they cannot be inputs (NXC-3967) — Milestone: Daemon uploads stable

### Cloud
- Handle file deletions and renames in eBPF-based file tracing (Q-237) — Milestone: Daemon uploads stable
- Limit sandbox violations warning to 5 tasks, link to sorted run view (Q-269)
- Remove violations tab view (Q-266) — Milestone: UI Anomaly Reporting
- Fix taskId encoding — special symbols coerced to `_` (Q-250)

### Infrastructure
- Reduce io-trace-daemon ringbuf size to 512MB on dev/staging

---

## Workspace Access & Onboarding

### CLI
- Restore CNW user flow to match v22.1.3 ([#34671](https://github.com/nrwl/nx/pull/34671)) — 22.6.0-beta.9

### Cloud
- After account creation, immediately prompt GH/GL account connection (CLOUD-3879)
- Fix: `stop-agents-after` ignored with hybrid changeset when SW affected (CLOUD-4297) — Labels: Support, DPE
- Nrwl admins can't edit workspace settings (NXA-1030)
- Implement `getUserIdsWithAccessPoliciesForWorkspace` (NXA-894)
- Add background job for syncing repository memberships (NXA-896)
- Ensure polygraph auth handles repository-access workspace auth (NXA-1034)
- Add "sync with repository access" as workspace visibility option (NXA-994)
- Add user to workspace access policies when authenticating (NXA-895)
- UI fix: "existing password is wrong" when changing password (NXA-1050) — Labels: Support

### Infrastructure
- Enable `NX_CLOUD_REPOSITORY_ACCESS_ENABLED` env var on dev API side

---

## Enterprise & Single Tenant

### Infrastructure
- New single-tenant instance: Caseware on AWS (INF-1224)
  - Terraform and Spacelift setup
  - Add to AWS account IDs
  - Add to lighthouse rotation
  - GitHub app variables configured
  - YAML hook-up completed
- Cloudinary: enable self-healing CI (INF-1232)
- Create failover/multi-region/costs documentation (INF-1223) — Labels: Enterprise, Azure

### CLI
- Vattenfall confirmed using @nx/dotnet in CI (NXC-2753)
- Entain confirmed using @nx/dotnet in CI (NXC-2913)

---

## Observability & Analytics

### Cloud
- P95 CIPE duration added to analytics graph with full percentile breakdown (CLOUD-4323)

### Infrastructure
- Grafana billing alert conditions defined (INF-1219)
- Grafana alert for monthly cost created (INF-1225)
- Add Grafana space to Spacelift (INF-1228)
- Add Grafana stack (spacelift)
- PostHog: switch staging/prod NA to reverse proxy
- Add common proxy for PostHog
- Remove extra PostHog proxy endpoints (INF-1230)
- Verify staging PostHog env vars (INF-1229)

---

## Security

### Infrastructure
- Remediate IAM user access keys older than 90 days (Vanta compliance) (INF-1191) — Labels: AWS, Security
- Fix SA permissions across dev/staging/prod
- Add IAM for dev/staging/prod to use images in operations
- Add Grafana space to GCP IAM

---

## Performance & Core

### CLI
- Migrate napi-rs v2 to v3 ([#34619](https://github.com/nrwl/nx/pull/34619)) — 22.6.0-beta.9
- Rewrite telemetry in Rust (NXC-3891) — Milestone: Nx Rust exposes Telemetry bindings
- Reduce misc allocations: structuredClone, precomputed hash externals, optimized sorts (NXC-3905) — Milestone: Improve CLI/Daemon performance
- Skip writing deps cache if already up-to-date ([#34582](https://github.com/nrwl/nx/pull/34582)) — 22.6.0-beta.9
- Resolve input files for targets with defaultConfiguration ([#34638](https://github.com/nrwl/nx/pull/34638)) — 22.6.0-beta.9
- Interpolate `{projectRoot}` and `{projectName}` in `{workspaceRoot}` input patterns in native hasher ([#34637](https://github.com/nrwl/nx/pull/34637)) — 22.6.0-beta.9
- Stabilize project references in `dependsOn` and `inputs` when later plugins rename a project ([#34332](https://github.com/nrwl/nx/pull/34332)) — 22.6.0-beta.9
- Fall back to invoking PM in detection ([#34691](https://github.com/nrwl/nx/pull/34691)) — 22.6.0-beta.9
- Fix `pnpm dlx nx@latest init` using NPM instead of PNPM (NXC-3408)
- Update minimatch to 10.2.4 ([#34660](https://github.com/nrwl/nx/pull/34660)) — 22.6.0-beta.8

### Infrastructure
- Audit main.go startup sequence and map all initialized subsystems (INF-1149) — Project: Multi-Cluster Agent Setups

---

## Ecosystem & Framework Support

### CLI
- **Angular Rspack**: Use relative path for postcss-cli-resources output ([#34681](https://github.com/nrwl/nx/pull/34681)) — 22.6.0-beta.8
- **Angular Rspack**: Use pathToFileURL for cross-platform path handling in postcss-cli-resources ([#34676](https://github.com/nrwl/nx/pull/34676)) — 22.6.0-beta.8
- **Vitest**: Respect reporters from target options in vitest executor ([#34663](https://github.com/nrwl/nx/pull/34663)) — 22.6.0-beta.8
- **Gradle**: Tee batch runner output to stderr for terminal display ([#34630](https://github.com/nrwl/nx/pull/34630)) — 22.6.0-beta.8
- **Bun**: Resolve false positive loop detection when running with Bun ([#34640](https://github.com/nrwl/nx/pull/34640)) — 22.6.0-beta.9

---

## Docs & Developer Experience

### CLI / Docs
- Boost CLI command reference search ranking ([#34625](https://github.com/nrwl/nx/pull/34625)) — 22.6.0-beta.8
- Fix broken nx.dev redirects and remove legacy redirect-rules files ([#34673](https://github.com/nrwl/nx/pull/34673)) — 22.6.0-beta.8
- Update `sourceRepository` description of `nx import` ([#34606](https://github.com/nrwl/nx/pull/34606)) — 22.6.0-beta.8
- Document sandboxing feature for linking from Cloud UI (DOC-429)
- Fix `/docs` redirect 404 after cleanup changes (DOC-435)
- Clean-up for pages in Framer instead of Next.js (DOC-431)
- Review all CLI and Cloud links (DOC-428)
- Add Cmd+K redirect from nx.dev to /docs (DOC-432)

### Cloud
- Show more descriptive warnings for GitHub app configuration in workspace creation flow — 2603.04.3

---

## Support Infrastructure

### Customer Success
- Configure SSO for Pylon (CS-133)
- Setup help.nx.app custom domain for knowledge base (CS-132)
- Connect Pylon to Google Workspace (CS-86)
- Setup DNS for cloud-support@nrwl.io (CS-92)
- Cut over from Salesforce to Pylon (CS-154)
- Setup support.nx.app custom domain for customer portal (CS-129)

---

## Repo Maintenance

### CLI
- Reset package.json files after local release ([#34648](https://github.com/nrwl/nx/pull/34648)) — 22.6.0-beta.8
- Remove redundant inputs override for build-base target ([#34649](https://github.com/nrwl/nx/pull/34649)) — 22.6.0-beta.8
- Remove stale ci.yml from extras.test snapshot ([#34690](https://github.com/nrwl/nx/pull/34690)) — 22.6.0-beta.9

### Infrastructure
- Add Jack to prod DB password readers

---

## Linear Project Status

### Completed in March

| Project | Team | Lead |
|---------|------|------|
| Grafana Billing Alerts | INF | Szymon Wojciechowski |
| IO Trace Internal Helm Chart | INF | — |
| Jan-Feb 2026 Misc | Q | — |

### Active

| Project | Team | Lead | Target |
|---------|------|------|--------|
| CLI Agentic Experience (AX) | NXA | Max Kless | Ongoing |
| Polygraph AI | NXA | Jonathan Cammisuli | Ongoing |
| Workspace Visibility | NXA | Mark Lindsey | Ongoing |
| Task Sandboxing | NXC, Q | Rares Matei | Ongoing |
| Improve AI Discovery | DOC | Jack Hsu | Ongoing |
| Multi-Cluster Agent Setups | INF | Steve Pentland | Ongoing |
| Azure Hosted Redis/Valkey | INF | — | In progress |
| Nx Local Dist Migration | NXC | — | Mar 13 |
| Allow New Users to Opt Into Team Plan | CLOUD | — | Mar 6 |
| .NET (Dotnet) Support | NXC | Miroslav Jonas | Ongoing |
| Pylon Rollout & Evaluation | CS | Steven Nance | Ongoing |
| Review Nx Resource Usage | NXC | Leosvel Perez Espinosa | Ongoing |
| Surface Level Telemetry | NXC | Jason Jean | Ongoing |

### Issues Completed: 66 across 7 teams

NXA 26 · INF 13 · NXC 8 · DOC 6 · CS 6 · Q 4 · CLOUD 3

---

_Generated on 2026-03-04._
