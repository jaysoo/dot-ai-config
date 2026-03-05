# Nx Platform Changelog — March 2026 (Partial: March 1–4)

> **Sources:** Nx CLI GitHub releases (nrwl/nx), Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear, [Notion](https://www.notion.so/nxnrwl/) (all-hands notes, design docs, account pages), [Pylon](https://app.usepylon.com/).

---

## AI-Powered Development

### CLI

- **feat(core): add Codex subagent support to configure-ai-agents** ([#34553](https://github.com/nrwl/nx/pull/34553)) — 22.6.0-beta.9
  - Reads `config.toml` from `nx-ai-agents-config` repo as source of truth for Codex config format
  - Deep-merges into user's `.codex/config.toml` using `@ltd/j-toml`
  - Adjusts MCP args dynamically for Nx version (`["nx", "mcp"]` for ≥22, `["nx-mcp"]` for <22)
  - Respects `multi_agent = false` if explicitly set by user
  - Copies `.codex/agents/` subagent TOML files alongside existing `.agents/skills/`
  - 7 unit tests + 4 e2e tests added
- **feat(core): add .nx/polygraph to gitignore in migration and caia** ([#34659](https://github.com/nrwl/nx/pull/34659)) — 22.6.0-beta.8
  - New `22-7-0-add-polygraph-to-git-ignore` migration
  - Shared `addEntryToGitIgnore` helper avoids duplicates or already-covered entries
  - Skips Lerna-only workspaces (with `lerna.json` but no `nx.json`)
- Polygraph AI tools merged into Nx repo for Claude support (Jon) — `nx login` required
- Polygraph AI: GitHub Actions integration, PR status tracking, repo summarization

### Cloud

- 2603.04.3: Show more descriptive warnings if user needs to adjust GitHub app configuration settings in workspace creation flow

### Docs

- "Copy Prompt" feature shipped on documentation pages

---

## Self-Healing CI

### Cloud

- Self-Healing CI moved out of "Experimental" — now first-class feature
- Auto-apply recommendations made more prominent in UI

### Infrastructure

- `chore(enterprise, cloudinary): enable self-healing CI` — Szymon, March 4

---

## Onboarding & Product-Led Growth

### CLI

- **fix(core): restore CNW user flow to match v22.1.3** ([#34671](https://github.com/nrwl/nx/pull/34671)) — 22.6.0-beta.9
  - Skips template prompt, goes straight to preset/stack flow
  - Restores "Would you like remote caching?" with v22.1.3 wording
  - Restores CI provider → caching fallback prompt chain for preset flow
  - Passes actual nxCloud to createEmptyWorkspace so cloud token is real
  - Restores v22.1.3 completion message
  - Removes github.com/new link from push message
  - Closes NXC-4020
- **fix(core): fall back to invoking PM in detection** ([#34691](https://github.com/nrwl/nx/pull/34691)) — 22.6.0-beta.9
  - Fixes `pnpm dlx nx@latest init` incorrectly using npm (NXC-3408)

### Cloud

- Welcome View on staging (`staging.nx.app/welcome`)
- CLI-based connect workspace flow

### Cross-Team

- **[Quark-A task force](https://www.notion.so/31969f3c23878093acfad49fd64be54c)** established March 3 — mandate to remove all friction in discover → create workspace → activate cloud journey
  - Core team: instrumentation/measurement lead, frictionless app onboarding lead, frictionless Nx Agents lead
  - Related: [Nx Cloud activation metrics](https://www.notion.so/31869f3c238780789f7ff89a93787840), [PLG Metrics Brainstorm](https://www.notion.so/31969f3c238780ee8a71c93890e35601)

### Website

- Framer website complete (minus blog migration) — Nx moving off Vercel

---

## Workspace Visibility & Access Control

### Cloud

- "Sync with repository access" launched — permissions auto-managed from repo access
- Bitbucket OAuth integration complete

### Infrastructure

- `chore(nx-cloud): enable workspace visibility env vars on staging` — Mark, March 4
- `chore(nx-cloud): enable NX_CLOUD_REPOSITORY_ACCESS_ENABLED env var on dev on the api side` — Mark, March 3

---

## Task Sandboxing & IO Tracing

### Infrastructure

- `chore(development): reduce io-trace-daemon ringbuf size to 512MB` — Rares, March 2
- `chore(staging): reduce io-trace-daemon ringbuf size to 512MB` — Rares, March 2

### Cross-Team

- Quokka team dogfooding sandboxing (e.g., staging pipeline: `staging.nx.app/cipes/69a5bded1aa89d3212fdf46a`)
- Dolphin team investigating sandboxing issues from plugins
- Continuous task assignment dogfooding in progress — need customer commitment for Prometheus metrics adoption

---

## Native Core & Performance

### CLI

- **feat(core): migrate napi-rs v2 to v3** ([#34619](https://github.com/nrwl/nx/pull/34619)) — 22.6.0-beta.9
  - `napi` 2.x → 3.8.3, `napi-derive` 2.x → 3.5.2, `napi-build` 1.x → 2.3.1
  - `@napi-rs/cli` → 3.5.1 (was 3.0.0-alpha.56)
  - Replaced raw-pointer `StoredExternal<T>` with napi-recommended `Arc<T>` pattern — **86 lines of unsafe code removed**
  - `ThreadsafeFunction`: accept directly as napi params instead of building from `Function<'_>`
  - `env.create_object()` → `Object::new(&env)`, `JsObject` → `PromiseRaw` for async returns
  - Fixed Watchexec watcher: deferred creation to `watch()` inside napi `spawn()` block (Tokio runtime TLS issue)
  - Fixed TUI: same Tokio runtime issue with `tokio::spawn(async {})` placeholder
  - Gated non-macOS watcher functions with `#[cfg(not(target_os = "macos"))]`
  - Added `rlib` to `crate-type` for cargo test compatibility
- **fix(core): skip writing deps cache if already up-to-date** ([#34582](https://github.com/nrwl/nx/pull/34582)) — 22.6.0-beta.9
- TUI improvements and memory footprint reduction (ongoing — Dolphin team)

---

## Project Graph & Plugin Stability

### CLI

- **fix(core): stabilizes project references in dependsOn and inputs when later plugins rename a project** ([#34332](https://github.com/nrwl/nx/pull/34332)) — 22.6.0-beta.9
  - New `ProjectNameInNodePropsManager` class tracks and updates references when project names change
  - Integrated into `mergeCreateNodesResults` — registers substitutors, marks roots dirty on name change, applies substitutions after merge
- **fix(core): resolve input files for targets with defaultConfiguration** ([#34638](https://github.com/nrwl/nx/pull/34638)) — 22.6.0-beta.9
- **fix(core): interpolate {projectRoot} and {projectName} in {workspaceRoot} input patterns in native hasher** ([#34637](https://github.com/nrwl/nx/pull/34637)) — 22.6.0-beta.9
  - Fixes [#34225](https://github.com/nrwl/nx/issues/34225), [#34595](https://github.com/nrwl/nx/issues/34595)

---

## Ecosystem & Framework Support

### CLI

- **fix(core): resolve false positive loop detection when running with Bun** ([#34640](https://github.com/nrwl/nx/pull/34640)) — 22.6.0-beta.9
  - Bun includes extra consecutive async frames causing `preventRecursionInGraphConstruction` false positive
  - Fix: skip check when running under Bun (`'Bun' in globalThis`)
  - Fixes [#33997](https://github.com/nrwl/nx/issues/33997)
- **fix(gradle): tee batch runner output to stderr for terminal display** ([#34630](https://github.com/nrwl/nx/pull/34630)) — 22.6.0-beta.8
  - New `TeeOutputStream.kt` writes to capture buffer + `System.err` simultaneously
  - Replaced `PseudoTerminal` (swallowed output with `quiet: true`) with `execSync` using `stdio: ['pipe', 'pipe', 'inherit']`
- **fix(vitest): respect reporters from target options in vitest executor** ([#34663](https://github.com/nrwl/nx/pull/34663)) — 22.6.0-beta.8
  - Fixes [#34495](https://github.com/nrwl/nx/issues/34495)
- **fix(angular-rspack): use relative path for postcss-cli-resources output** ([#34681](https://github.com/nrwl/nx/pull/34681)) — 22.6.0-beta.8
  - Fixes [#34092](https://github.com/nrwl/nx/issues/34092)
- **fix(misc): use pathToFileURL for cross-platform path handling in postcss-cli-resources** ([#34676](https://github.com/nrwl/nx/pull/34676)) — 22.6.0-beta.8
  - Fixes [#33052](https://github.com/nrwl/nx/issues/33052) — unblocked Paylocity upgrade
- **fix(core): update minimatch to 10.2.4** ([#34660](https://github.com/nrwl/nx/pull/34660)) — 22.6.0-beta.8
- **fix(core): update sourceRepository description of nx import** ([#34606](https://github.com/nrwl/nx/pull/34606)) — 22.6.0-beta.8
- ESLint v10 support landed (community contribution)

### Powerpack

- Powerpack 5.0.1 patch release (March 3) — release matrix fixes (ocean/pull/10200)

---

## Infrastructure & Reliability

### Regional Failover (Design Phase)

- [Technical design document](https://www.notion.so/31869f3c23878166adcdf2ba7404f82b) published March 3
- Architecture: deploy standby app in second region within same cloud provider + global load balancer
- Target: TTR from 60–90 minutes → low single-digit minutes
- Customer segment: banking, healthcare, government (contractual failover requirements)
- Cost: roughly doubles application cluster infrastructure
- Phases: infrastructure primitives → dual-region app → multi-region DB → agents mesh → production
- Dependency: [Multi-Cluster Workflow Execution](https://www.notion.so/30369f3c2387817fbf94f38a0ffed522)

### Monitoring & Observability

- `chore(spacelift): add grafana stack` — Szymon, March 3
- `chore(spacelift): add grafana space` — Szymon, March 3
- `chore(nxcloudoperations): add grafana space to gcp iam` — Szymon, March 4
- `chore(grafana): add alert for monthly cost` — Szymon, March 2
- `chore(enterprise, aws): Enable grafana resources by default` — Phil, March 3

### Analytics & Telemetry

- `switch staging and prod NA to posthog reverse proxy` — Nicole, March 3
- `chore(operations): add common proxy for posthog` — Steve, March 3
- `chore(staging): remove envfrom for posthog url target` — Steve, March 3
- `chore(operations): remove extra posthog proxies` — Steve, March 3

### IAM & Permissions

- `chore(development): Add IAM to allow dev/staging/prod to use images in operations` — Phil, March 3
- `chore(dev, staging, prod): Fix permissions for SAs` — Phil, March 4
- `chore(dev, staging, prod): Fix permissions for SAs again to be not in the module` — Phil, March 4
- `chore(operations): Add IAM to allow compute engine to build disk image` — Phil, March 3
- `chore(org): add Jack to prod db password readers` — Steve, March 2

### Enterprise Deployments

- `chore(enterprise, aws, caseware): Add caseware to lighthouse rotation` — Phil, March 2
- `chore(enterprise, aws, caseware): Add to aws account IDs` — Phil, March 2
- `chore(enterprise, caseware): Add caseware tf and fix module issue with upgrade` — Phil, March 2
- `chore(enterprise, aws, caseware): Add Caseware Single Tenant` — Phil, March 2
- `chore(enterprise, caseware): YAML hook-up` — Phil, March 2
- `chore(spacelift): Add Caseware` — Phil, March 2
- `chore(enterprise,aws,caseware): add GH vars for caseware` — Steve, March 3

---

## Cloud Changelog

| Version   | Date    | Changes                                                                                      |
| --------- | ------- | -------------------------------------------------------------------------------------------- |
| 2603.04.2 | March 4 | Workspace analytics CIPE duration chart now shows percentile values (p95, p75, p50, p25, p5) |
| 2603.04.3 | March 4 | More descriptive warnings for GitHub app configuration in new workspace creation flow        |

Additional cloud versions staged but not yet on public changelog:

- 2603.02.3 (Jon, March 2)
- 2603.02.5 (staging)
- 2603.03.3 (Rares, March 3)
- 2603.03.7 (Altan, March 3)
- 2603.04.7 (James, March 4 — on snapshot, being validated)

Note: 2603.04.3 staging was reverted back to 2603.03.7 (Nicole, March 4) due to missing PostHog reverse proxy config. A self-healing regression was identified (James) — fix merged but not yet released.

---

## Docs & Website

### CLI

- **fix(misc): boost CLI command reference search ranking** ([#34625](https://github.com/nrwl/nx/pull/34625)) — 22.6.0-beta.8
- **fix(misc): fix broken nx.dev redirects and remove legacy redirect-rules files** ([#34673](https://github.com/nrwl/nx/pull/34673)) — 22.6.0-beta.8

### Repo Maintenance

- **fix(repo): reset package.json files after local release** ([#34648](https://github.com/nrwl/nx/pull/34648)) — 22.6.0-beta.8
- **fix(repo): remove redundant inputs override for build-base target** ([#34649](https://github.com/nrwl/nx/pull/34649)) — 22.6.0-beta.8
- **fix(testing): remove stale ci.yml from extras.test snapshot** ([#34690](https://github.com/nrwl/nx/pull/34690)) — 22.6.0-beta.9

---

## Enterprise & Customer Operations

### Pylon Support Migration

- Cutover from Salesforce email support completed March 2
- All enterprise customers now route through Pylon
- 50+ tickets migrated (tagged "Sent from Salesforce")

### Active Support Themes (50+ tickets)

| Theme                          | Ticket Count | Notable                                                                                                                                                                                                                                                   |
| ------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Billing / contributor counting | 3            | [#174](https://app.usepylon.com/issues?issueNumber=174), [#130](https://app.usepylon.com/issues?issueNumber=130), [#124](https://app.usepylon.com/issues?issueNumber=124)                                                                                 |
| Agent / DTE issues             | 3            | [#169](https://app.usepylon.com/issues?issueNumber=169), [#168](https://app.usepylon.com/issues?issueNumber=168), [#122](https://app.usepylon.com/issues?issueNumber=122)                                                                                 |
| Authentication / OAuth         | 4            | [#172](https://app.usepylon.com/issues?issueNumber=172), [#129](https://app.usepylon.com/issues?issueNumber=129), [#123](https://app.usepylon.com/issues?issueNumber=123), [#127](https://app.usepylon.com/issues?issueNumber=127) — OAuth outage March 3 |
| Nx v22 upgrade paths           | 2            | [#159](https://app.usepylon.com/issues?issueNumber=159) (Expo blockers), [#147](https://app.usepylon.com/issues?issueNumber=147) (PostCSS Windows)                                                                                                        |
| GDPR deletion                  | 1            | [#138](https://app.usepylon.com/issues?issueNumber=138)                                                                                                                                                                                                   |
| Self-Healing on GitLab         | 1            | [#133](https://app.usepylon.com/issues?issueNumber=133) (closed)                                                                                                                                                                                          |

### Customer Engagements

- **[Legora](https://www.notion.so/26469f3c238780529e80cb076ebfe8d1)**: Weekly sync March 3 — Nx 22 upgrade PR review, Okta SAML config, migration branch on single tenant
- **[Fidelity](https://www.notion.so/4b72ec2586684cfcb4ff070dd2ddf774)**: Monthly sync March 3 — deploying latest Nx Cloud version (2026.01), base image compliance
- **[Entain](https://www.notion.so/1c2a440d9354443097762f8d347c9ea4)**: Monthly check-in March 4 (Jeff Cross, Jimmy, Miroslav attending)
- **Brain.co**: Check-in March 3
- **[McGraw Hill](https://www.notion.so/28169f3c2387803289bbfca5b6d1cd6c)**: Check-in March 2
- **Attentive**: Time to Green measurements March 3
- **[DNB](https://www.notion.so/31869f3c238780759bd8ca6d4923a02d)**: Churn review — only used remote caching and UI, never expanded to backend; interested in AI/self-healing/Polygraph
- **Paylocity**: Upgrade to latest CLI unblocked by PostCSS fix ([#34676](https://github.com/nrwl/nx/pull/34676))
- **[Essent](https://www.notion.so/25c69f3c238780d4b701c24b0c5d8bd1)**: Deal loss review — chose in-house DTE solution over Nx Cloud

---

## Notable In-Progress / Strategic

| Initiative                                                                           | Team           | Status                               | Notes                                               |
| ------------------------------------------------------------------------------------ | -------------- | ------------------------------------ | --------------------------------------------------- |
| [Quark-A](https://www.notion.so/31969f3c23878093acfad49fd64be54c) (PLG activation)   | Cross-team     | NEW — task force established March 3 | Remove all friction in discover → create → activate |
| [Regional Failover](https://www.notion.so/31869f3c23878166adcdf2ba7404f82b)          | Infrastructure | Design phase                         | Tech design doc published March 3                   |
| [Multi-Cluster Agent Setups](https://www.notion.so/30369f3c2387817fbf94f38a0ffed522) | Infrastructure | In progress                          | Prerequisite for Regional Failover                  |
| Polygraph AI (multi-repo)                                                            | Red Panda      | Active                               | GitHub Actions integration, dogfooding              |
| Continuous Task Assignment                                                           | Quokka         | Dogfooding                           | Need customer Prometheus adoption                   |
| Sandboxing                                                                           | Quokka/Dolphin | Dogfooding                           | Fixing plugin edge cases                            |
| Framer Website                                                                       | Orca           | Done (minus blog)                    | Moving off Vercel                                   |
| ESLint v10                                                                           | CLI/Community  | Landed                               | Community contribution                              |
| TUI improvements                                                                     | Dolphin        | Ongoing                              | Memory footprint reduction                          |
| Pricing & Packaging                                                                  | Sales          | Evaluation                           | Optimizing PLG and Enterprise                       |
| Self-Healing CI → Paid                                                               | CS             | Planning                             | Enterprise customers being notified                 |

---

## Personnel

- **Colum Ferry**: Last day March 16 — joining Supabase as CLI Engineer
- **Heidi**: Also departing (announced at all-hands)

---

## Competitive Intelligence

- Turborepo shipping OTEL support in next version
- Performance comparison review initiated (Craigory): "We should spend more time looking at both our perf and competitors"
- Framework inference for env variables (auto-detect `NEXT_PUBLIC_*`, `VITE_*`, etc.) identified as a Turbo feature Nx lacks

---

_Generated on 2026-03-04. This is a partial month (Week 1) — the digest will be updated at month end._
