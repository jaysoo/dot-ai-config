# Nx Platform Changelog — February 2026

> **Sources:** Nx CLI GitHub releases (22.4.5–22.5.3, 21.3.12), Nx Cloud changelog (23 versions, 2602.02.4–2602.27.5), nrwl/cloud-infrastructure commits, Linear.

---

## Task Sandboxing & Hermetic Builds

### CLI
- add initial impl of task io service ([#34205](https://github.com/nrwl/nx/pull/34205)) — 22.5.0
- handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.5.1
- extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.5.1
- disable ignore filters for outputs expansion ([#34316](https://github.com/nrwl/nx/pull/34316)) — 22.5.0
- track all task outputs regardless of path depth ([#34321](https://github.com/nrwl/nx/pull/34321)) — 22.5.0, 21.3.12

### Cloud
- IO Tracing Reports API — new endpoint for persisting IO tracing reports from Nx Agents (2602.12.11)

### Infrastructure
- Deployed io-trace-daemon to development, staging, and production
- Created internal helm chart for io-tracing with namespace isolation
- Added IO tracing service accounts and permissions across GCP and AWS single-tenants
- Added ECR repository for io-trace-daemon images
- Increased ringbuf size and memory for io-trace-daemon
- Enabled sandboxing on staging

---

## Self-Healing CI

### Cloud
- Self-Healing CI for BitBucket and Azure DevOps — in-app setup (2602.02.4)
- Self-Healing CI Recommendations — org admins see inline auto-apply suggestions (2602.03.2)
- Self-Healing CI Onboarding — enable during repo connection, auto-creates PR for `nx fix-ci` (2602.26.2)
- Self-Healing CI Failure Details — detailed failure reasons in Technical Details (2602.12.5)
- Auto-apply Fixes Highlighting — highlights pending recommendations when applying via VCS comments or `apply-locally` (2602.19.6)
- Removed experimental badge from AI features in self-healing CI (2602.18.3)

---

## AI-Powered Development (Agentic Experience)

### CLI
- improve configure-ai-agents to copy nx skills/subagents/plugins ([#34176](https://github.com/nrwl/nx/pull/34176)) — 22.5.0
- improve AI agent rules for CLAUDE.md generation ([#34304](https://github.com/nrwl/nx/pull/34304)) — 22.5.0
- add AI agent detection and NDJSON output for CNW ([#34320](https://github.com/nrwl/nx/pull/34320)) — 22.5.0
- update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.5.1
- update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.5.1
- add --json flag for better AX to nx list ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.5.3
- add passthrough for nx-cloud apply-locally command ([#34557](https://github.com/nrwl/nx/pull/34557)) — 22.5.3
- preserve existing source properties in claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.5.3
- make sure that mcp args aren't overridden when running configure-ai-agents ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.5.1
- handle Ctrl+C gracefully in configure-ai-agents — 22.5.2
- only pull configure-ai-agents from latest if local version is not latest ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.5.2

---

## Onboarding & Workspace Creation

### CLI
- add variant 2 to CNW cloud prompts with promo message ([#34223](https://github.com/nrwl/nx/pull/34223)) — 22.5.0
- add Nx Cloud connect URL to template README ([#34249](https://github.com/nrwl/nx/pull/34249)) — 22.5.0
- add decorative banners for Nx Cloud CNW completion message ([#34270](https://github.com/nrwl/nx/pull/34270)) — 22.5.0
- update cnw messaging ([#34364](https://github.com/nrwl/nx/pull/34364)) — 22.5.0
- add nxVersion to meta in shortUrl for cnw ([#34401](https://github.com/nrwl/nx/pull/34401)) — 22.5.1
- lock in CNW variant 2 with deferred connection ([#34416](https://github.com/nrwl/nx/pull/34416)) — 22.5.1
- add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580)) — 22.5.3
- fix CNW git amend and README marker handling ([#34306](https://github.com/nrwl/nx/pull/34306)) — 22.5.0
- prevent nxCloudId from being generated for new workspaces ([#34532](https://github.com/nrwl/nx/pull/34532)) — 22.5.2
- preserve nxCloud=skip in non-interactive CNW mode ([#34616](https://github.com/nrwl/nx/pull/34616)) — 22.5.3

### Cloud
- Streamlined VCS Integration Forms — simpler setup (2602.17.4)
- Workspace-Repository Access Syncing — match access to VCS permissions (2602.27.5)
- PNPM Catalog Support — workspaces with PNPM catalogs can now connect (2602.19.9)
- CNW Form Permission Button fix — "Update permissions" shows when app not installed (2602.03.1)
- Back Links in Connect Workspace Flows — updated routing (2602.04.2)

### Infrastructure
- New tenant: Wix — full provisioning (TF, YAML, ArgoCD, Lighthouse, SAML)
- New tenant: Legora — GCP single tenant with Spacelift
- Repository access env var enabled on dev
- Bitbucket Cloud app secrets added to development

---

## Performance & Reliability

### CLI — Daemon & Core
- move tui to parking lot rwlock to avoid hang ([#34187](https://github.com/nrwl/nx/pull/34187)) — 22.5.0
- fall back to node_modules when tmp has noexec ([#34207](https://github.com/nrwl/nx/pull/34207)) — 22.5.0
- improve plugin worker error messages and lifecycle timeouts ([#34251](https://github.com/nrwl/nx/pull/34251)) — 22.5.0
- handle multibyte UTF-8 characters in socket message consumption ([#34151](https://github.com/nrwl/nx/pull/34151)) — 22.5.0
- resolve daemon client reconnect queue deadlock ([#34284](https://github.com/nrwl/nx/pull/34284)) — 22.5.0
- handle EPIPE errors gracefully in daemon socket writes ([#34311](https://github.com/nrwl/nx/pull/34311)) — 22.5.0
- reduce daemon inotify watch count by upgrading watchexec ([#34329](https://github.com/nrwl/nx/pull/34329)) — 22.5.0
- clean up stale socket files before listening ([#34236](https://github.com/nrwl/nx/pull/34236)) — 22.5.1
- make runtime cache key deterministic ([#34390](https://github.com/nrwl/nx/pull/34390)) — 22.5.1
- handle dangling symlinks during cache restore ([#34396](https://github.com/nrwl/nx/pull/34396)) — 22.5.1
- replace buggy ignore-files trie with correct path-component gitignore matching ([#34447](https://github.com/nrwl/nx/pull/34447)) — 22.5.2
- skip stale recomputations and prevent lost file changes in daemon ([#34424](https://github.com/nrwl/nx/pull/34424)) — 22.5.2
- reduce terminal output duplication and allocations in task runner ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.5.2
- use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.5.3
- retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.5.3
- reject pending promises directly when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.5.3
- use scoped cache key for unresolved npm imports in TargetProjectLocator ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.5.3
- eagerly shutdown plugins that don't provide later hooks ([#34253](https://github.com/nrwl/nx/pull/34253)) — 22.5.0
- use picocolors instead of chalk in the nx package ([#34305](https://github.com/nrwl/nx/pull/34305)) — 22.5.0
- use static_vcruntime to avoid msvcrt dependency ([#19781](https://github.com/nrwl/nx/pull/19781)) — 22.5.2

### CLI — TUI
- handle resizing a bit better for inline_tui ([#34006](https://github.com/nrwl/nx/pull/34006)) — 22.5.0
- preserve task selection when unrelated tasks finish ([#34328](https://github.com/nrwl/nx/pull/34328)) — 22.5.0
- avoid crash when pane area is out of bounds during resize ([#34343](https://github.com/nrwl/nx/pull/34343)) — 22.5.0
- hitting [1] or [2] should remove pinned panes if they match the current task ([#34433](https://github.com/nrwl/nx/pull/34433)) — 22.5.1
- prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.5.2
- gate tui-logger init behind `NX_TUI` env var ([#34426](https://github.com/nrwl/nx/pull/34426)) — 22.5.2
- avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.5.2
- display batch tasks in the TUI ([#33695](https://github.com/nrwl/nx/pull/33695)) — 22.5.0

### Cloud
- Daemon Crash with Large Runs — fixed (2602.10.2)
- Task List Sorting Stability — stable sort on equal values (2602.23.8)
- Search Parameters Persistence — fixed across analytics views (2602.09.7)
- Task Details Error Handling — inline error instead of 404 page (2602.18.13)
- Verification Tasks Tab — shows "In progress" during verification (2602.04.3)
- Compare Tasks "Originated from" Link — loads immediately (2602.11.3)
- URL Construction — handles trailing slash (2602.13.2)
- Contributor Display — null/empty names shown as "No attribution" (2602.20.1)
- Enterprise Contributor Data — renders regardless of license duration (2602.09.5)

### Infrastructure
- Workflow controller async processing enabled in production NA/EU and single-tenants (Flutter, Mimecast, ClickUp, Emeria, Island)
- Workflow controller bumped to 2 replicas in production
- Valkey metrics scraping enabled for workflow queue data
- Celonis nx-api replicas increased 3→6
- ClickUp aggregator memory tuned (3Gi/4Gi), nginx frontline cache, c3d nodes
- Emeria node pool size increased, disk bumped to 35Gi
- AL2 → AL2023 agent node group migration (Flutter, Emeria)
- AWS node group rework: 1 nodegroup per zone
- OTEL Java agent HTTP/protobuf transport tuning
- JVM settings tuning for production NA
- npm cache metrics for nginx
- PostHog reverse proxies for operations

---

## JVM Ecosystem (Gradle & Maven)

### CLI
- add debug env var to gradle batch executor ([#34259](https://github.com/nrwl/nx/pull/34259)) — 22.5.0
- load Maven classes at runtime for version-agnostic batch execution ([#34180](https://github.com/nrwl/nx/pull/34180)) — 22.5.0
- bump maven plugin version to 0.0.13 ([#34318](https://github.com/nrwl/nx/pull/34318)) — 22.5.0
- use tooling api compatible flags ([#34247](https://github.com/nrwl/nx/pull/34247)) — 22.5.0
- ensure that batch output is not overridden for atomized targets ([#34268](https://github.com/nrwl/nx/pull/34268)) — 22.5.0
- enforce that only one gradle task can be passed into gradle executor ([#34269](https://github.com/nrwl/nx/pull/34269)) — 22.5.0
- use gradle project name when resolving dependent tasks ([#34331](https://github.com/nrwl/nx/pull/34331)) — 22.5.0
- include pom.xml and ancestor pom files as inputs for all targets ([#34291](https://github.com/nrwl/nx/pull/34291)) — 22.5.0
- use a consistent batch id between scheduler and task runner ([#34392](https://github.com/nrwl/nx/pull/34392)) — 22.5.1
- correctly map between maven locators and nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.5.1
- use module-level variable for cache transfer between createNodes and createDependencies ([#34386](https://github.com/nrwl/nx/pull/34386)) — 22.5.1
- write output after each task in batch mode to ensure correct files are cached ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.5.2
- ensure that atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.5.3
- use globs for dependent task output files ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.5.3
- fix set the pom file without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.5.3
- update maven & gradle icons to java duke icon ([#34508](https://github.com/nrwl/nx/pull/34508)) — 22.5.3

---

## Security

### CLI
- prevent command injection in getNpmPackageVersion ([#34309](https://github.com/nrwl/nx/pull/34309)) — 22.5.0
- bump minimatch to 10.2.1 to address CVE-2026-26996 ([#34509](https://github.com/nrwl/nx/pull/34509)) — 22.5.3
- remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.5.1

### Cloud
- Access Control Confirmation — settings require confirmation (2602.11.1)
- `decrypt-artifact` Command — decrypt E2E-encrypted artifacts from Cloud UI (2602.12.6)

### Infrastructure
- IAM Binding → IAM Member migration across staging, production, and enterprise tenants
- Grafana billing alerts added to Terraform
- GitHub app slug updated on dev for new GitHub app
- Lighthouse Google Auth + IAP removal, secure database password migration
- Multiple Vanta IAM key rotation remediations
- Synthetic health checks added for enterprise tenants

---

## Ecosystem & Framework Support

### CLI
- add NX_PREFER_NODE_STRIP_TYPES for Node's built-in type stripping ([#34202](https://github.com/nrwl/nx/pull/34202)) — 22.5.0
- bump swc to latest versions ([#34215](https://github.com/nrwl/nx/pull/34215)) — 22.5.0
- update swc/cli to 0.8.0 ([#34365](https://github.com/nrwl/nx/pull/34365)) — 22.5.0
- add negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160)) — 22.5.1
- add cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.5.1
- use caret range for swc dependencies in pnpm catalog ([#34487](https://github.com/nrwl/nx/pull/34487)) — 22.5.2
- support eslint v10 ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.5.3
- allow for wildcards paths in enforce-module-boundaries rule ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.5.3
- use SASS indented syntax in nx-welcome component when style is sass ([#34510](https://github.com/nrwl/nx/pull/34510)) — 22.5.3
- exclude .json files from JS/TS regex patterns (angular-rspack) ([#34195](https://github.com/nrwl/nx/pull/34195)) — 22.5.3
- skip unnecessary type-check in TS Solution Setup when skipTypeCheck is true ([#34493](https://github.com/nrwl/nx/pull/34493)) — 22.5.3
- fix regression on process.env usage for webpack ([#34583](https://github.com/nrwl/nx/pull/34583)) — 22.5.3
- ensure safe `process.env` fallback replacement (webpack) ([#34464](https://github.com/nrwl/nx/pull/34464)) — 22.5.3
- use --lockfile-only for Bun updateLockFile ([#34375](https://github.com/nrwl/nx/pull/34375)) — 22.5.0
- preload vitest/node to prevent race condition on Node 24 ([#34261](https://github.com/nrwl/nx/pull/34261)) — 22.5.0
- handle sophisticated vite plugins ([#34242](https://github.com/nrwl/nx/pull/34242)) — 22.5.0
- ensure vitest config file is created ([#34216](https://github.com/nrwl/nx/pull/34216)) — 22.5.0
- remove redundant vite.config.ts generation for vitest projects ([#34603](https://github.com/nrwl/nx/pull/34603)) — 22.5.3
- isPreview=true for Vite Preview server ([#34597](https://github.com/nrwl/nx/pull/34597)) — 22.5.3
- use per-invocation cache in TS plugin to fix NX_ISOLATE_PLUGINS=false ([#34566](https://github.com/nrwl/nx/pull/34566)) — 22.5.3
- guard against undefined closest node in rehoistNodes ([#34347](https://github.com/nrwl/nx/pull/34347)) — 22.5.3
- remove file-loader dependency and update svgr migration ([#34218](https://github.com/nrwl/nx/pull/34218)) — 22.5.0
- use surgical text replacement in Jest matcher alias migration ([#34350](https://github.com/nrwl/nx/pull/34350)) — 22.5.3
- reset daemon client after project graph creation in withNx ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.5.2
- make watch command work with all and initialRun specified ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.5.3
- add docs link to generatePackageJson error message ([#34562](https://github.com/nrwl/nx/pull/34562)) — 22.5.3
- allow null values in JSON schema validation ([#34167](https://github.com/nrwl/nx/pull/34167)) — 22.5.0
- allow null values in schema of dockerVersion ([#34171](https://github.com/nrwl/nx/pull/34171)) — 22.5.3
- add null-safe fallback for version in createGitTagValues ([#34598](https://github.com/nrwl/nx/pull/34598)) — 22.5.3
- remove unnecessary number from release return type ([#34481](https://github.com/nrwl/nx/pull/34481)) — 22.5.2

---

## Documentation & Developer Portal

### CLI
- add llms-full.txt and HTTP Link headers for LLM discovery ([#34232](https://github.com/nrwl/nx/pull/34232)) — 22.5.0
- reformat sidebar into topics ([#34265](https://github.com/nrwl/nx/pull/34265)) — 22.5.0
- add server-side page view tracking for docs ([#34283](https://github.com/nrwl/nx/pull/34283)) — 22.5.0
- make headers and table options linkable ([#34267](https://github.com/nrwl/nx/pull/34267)) — 22.5.0
- include nx cli examples on refs page ([#34367](https://github.com/nrwl/nx/pull/34367)) — 22.5.0
- improve plugin registry visibility ([#34395](https://github.com/nrwl/nx/pull/34395)) — 22.5.1
- add missing nx-cloud intro in sidebar ([#34403](https://github.com/nrwl/nx/pull/34403)) — 22.5.1
- widen search dialog ([#34504](https://github.com/nrwl/nx/pull/34504)) — 22.5.2
- update breadcrumb links to match sidebar ([#34500](https://github.com/nrwl/nx/pull/34500)) — 22.5.2
- correct interpolate sub command for cli reference ([#34585](https://github.com/nrwl/nx/pull/34585)) — 22.5.3
- move redirects from Next.js config to Netlify _redirects ([#34612](https://github.com/nrwl/nx/pull/34612)) — 22.5.3
- exclude large native deps from build bundle ([#34335](https://github.com/nrwl/nx/pull/34335)) — 22.5.0
- fix og images wrong URL for embeds ([#34346](https://github.com/nrwl/nx/pull/34346)) — 22.5.0
- use right URL for the given netlify context ([#34348](https://github.com/nrwl/nx/pull/34348)) — 22.5.0
- use shared preview url for netlify deploy ([#34467](https://github.com/nrwl/nx/pull/34467)) — 22.5.2
- rewrite Framer URLs to nx.dev in HTML responses ([#34445](https://github.com/nrwl/nx/pull/34445)) — 22.5.2
- update broken /launch-nx links ([#34192](https://github.com/nrwl/nx/pull/34192)) — 22.5.0
- update dead links across nx-dev UI libraries ([#34238](https://github.com/nrwl/nx/pull/34238)) — 22.5.0
- fix internal link check caching ([#34255](https://github.com/nrwl/nx/pull/34255)) — 22.5.0
- fix double-counting and exclude assets from page tracking ([#34286](https://github.com/nrwl/nx/pull/34286)) — 22.5.0
- clarify project linking for workspaces ([#34405](https://github.com/nrwl/nx/pull/34405)) — 22.5.1

---

## Miscellaneous

### CLI
- cloud commands are noop when not connected rather than errors ([#34193](https://github.com/nrwl/nx/pull/34193)) — 22.5.0
- consolidate GitHub URL messaging when gh push fails ([#34196](https://github.com/nrwl/nx/pull/34196)) — 22.5.0
- hide already-installed nx packages from suggestion list during nx import ([#34227](https://github.com/nrwl/nx/pull/34227)) — 22.5.0
- nx should show help for run-one when using project short names ([#34303](https://github.com/nrwl/nx/pull/34303)) — 22.5.0
- allow overriding daemon logging settings ([#34324](https://github.com/nrwl/nx/pull/34324)) — 22.5.0
- only detect flaky tasks for cacheable tasks ([#33994](https://github.com/nrwl/nx/pull/33994)) — 22.5.0
- add missing FileType import for Windows watcher build ([#34369](https://github.com/nrwl/nx/pull/34369)) — 22.5.0
- avoid dropping unrelated continuous deps in `makeAcyclic` ([#34389](https://github.com/nrwl/nx/pull/34389)) — 22.5.1
- use workspace root for path resolution when baseUrl is not set ([#34453](https://github.com/nrwl/nx/pull/34453)) — 22.5.2
- commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.5.2
- handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.5.3
- remove unused getTerminalOutput from BatchProcess ([#34604](https://github.com/nrwl/nx/pull/34604)) — 22.5.3
- do not throw error if worker.stdout is not instanceof socket ([#34224](https://github.com/nrwl/nx/pull/34224)) — 22.5.0
- improve freebsd build reliability ([#34326](https://github.com/nrwl/nx/pull/34326)) — 22.5.0
- add timeout to runCommandUntil to prevent hanging tests ([#34148](https://github.com/nrwl/nx/pull/34148)) — 22.5.0
- use GITHUB_ACTIONS env var for CI detection in nx-release — 21.3.12

### Cloud
- add command to download cloud client ([#34333](https://github.com/nrwl/nx/pull/34333)) — 22.5.0 (CLI-side)

### Infrastructure — Terraform & Provider Updates
- Updated AWS, GCP, Azure, Grafana, and Atlas provider versions
- Updated OpenTofu version
- Unified provider versions across all environments
- Spacelift admin stack updates
- DPE read access for Azure tenant management group buckets

---

## Linear Project Status

### Completed in February
| Project | Lead |
|---------|------|
| IAM Bucket access binding → memberships | Patrick Mariglia |
| Lighthouse: Google Auth & IAP removal | Steve Pentland |
| AL2 → AL2023 agent nodegroup migration | Szymon Wojciechowski |
| Pylon Rollout & Evaluation | Steven Nance |

### Active
| Project | Lead | Target |
|---------|------|--------|
| CLI Agentic Experience (AX) | Max Kless | — |
| Task Sandboxing (IO Tracing) | Rares Matei | — |
| Nx Resource Usage Review | Leosvel Perez | done |
| Surface Level Telemetry | Colum Ferry | 2026-03-06 |
| Workspace Visibility | Mark Lindsey | — |
| Framer Migration | Benjamin Cabanes | — |
| 600 Workspaces Connected/Week | — | — |
| Continuous Assignment of Tasks | Altan Stalker | — |
| Polygraph AI | Jonathan Cammisuli | — |
| Grafana Billing Alerts | Szymon Wojciechowski | 2026-03-02 |
| IO Trace Internal Helm Chart | Steve Pentland | 2026-03-02 |
| GCP GKE Docker Image Pre-Loading | Patrick Mariglia | 2026-03-27 |
| Multi-Cluster Agent Setups | Steve Pentland | 2026-04-08 |

### Issues Completed: 514 across 6 teams
Nx Cloud 125 · RedPanda 112 · Quokka 98 · Nx CLI 94 · Infrastructure 63 · Docs 22

---

_Generated on 2026-02-27._
