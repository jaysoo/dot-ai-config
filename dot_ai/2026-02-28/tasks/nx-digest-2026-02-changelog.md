# Nx Platform Changelog — February 2026

> **Sources:** Nx CLI GitHub releases (nrwl/nx), Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear (454 issues across 6 teams).

## Task Sandboxing & IO Tracing

### CLI
- Add initial impl of task io service ([#34205](https://github.com/nrwl/nx/pull/34205)) — 22.5.0
- Handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.5.1
- Extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.5.1
- Track all task outputs regardless of path depth ([#34321](https://github.com/nrwl/nx/pull/34321)) — 22.5.0, backported to 21.3.12
- Disable ignore filters for outputs expansion ([#34316](https://github.com/nrwl/nx/pull/34316)) — 22.5.0

### Cloud
- Add API endpoint to support persisting io tracing reports sent from Nx Agents (2602.12.11)
- Enable sandbox endpoints on snapshot (fa415a4b, 2026-02-12)

### Infrastructure
- Enable sandboxing on staging (ca1fc1f2, 2026-02-24)
- Enable io tracing signal files on snapshot (97e7084b, 2026-02-05)
- Deploy io-trace-daemon helm chart to development (1187c07b, 2026-02-24)
- Add io-tracer to staging (e4995b25, 2026-02-24)
- Add io-tracing infra to staging — SA, permissions, k8s (d9fa47ff, 2026-02-23)
- Add io-tracing SA + permissions to production (0f57bdd9, 2026-02-23)
- Add io tracing SA association for AWS single-tenants (1067cf17, 2026-02-24)
- Add io tracing SAs to GCP single-tenants (ee12326c, 2026-02-24)
- Create ECR repo for io-trace-daemon on AWS (35642447, 2026-02-09)
- Move tracer into its own namespace (fe496eb2, 2026-02-16)
- Increase io-trace-daemon ringbuf size and memory (cfd23f4d, 2026-02-11)
- Increase cpu limit for io trace daemon (1d45c80a, 2026-02-11)
- Add io-tracing namespace to monitoring (685e9816, 2026-02-24)

## Self-Healing CI

### Cloud
- Self-Healing CI setup for BitBucket and Azure DevOps (2602.02.4)
- Auto-apply recommendations for tasks in Self-Healing CI settings (2602.03.2)
- Detailed failure reasons in Technical Details for failed fixes (2602.12.5)
- Remove experimental badge from AI features in self-healing CI (2602.18.3)
- Highlight pending auto-apply recommendations during apply-locally (2602.19.6)
- Enable Self-Healing CI during repository onboarding, auto-create PR for CI config (2602.26.2)

### CLI
- Add passthrough for nx-cloud apply-locally command ([#34557](https://github.com/nrwl/nx/pull/34557)) — 22.5.3

## AI-Powered Development

### CLI
- Improve configure-ai-agents to copy nx skills/subagents/plugins ([#34176](https://github.com/nrwl/nx/pull/34176)) — 22.5.0
- Improve AI agent rules for CLAUDE.md generation ([#34304](https://github.com/nrwl/nx/pull/34304)) — 22.5.0
- Add AI agent detection and NDJSON output for CNW ([#34320](https://github.com/nrwl/nx/pull/34320)) — 22.5.0
- Update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.5.1
- Update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.5.1
- Add --json flag for better AX to nx list ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.5.3
- Preserve existing source properties in claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.5.3
- Make sure that mcp args aren't overridden when running configure-ai-agents ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.5.1
- Handle Ctrl+C gracefully in configure-ai-agents (9128fcb66f) — 22.5.2
- Only pull configure-ai-agents from latest if local version is not latest ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.5.2
- Tweak configure-ai-agents messaging ([#34307](https://github.com/nrwl/nx/pull/34307)) — 22.5.0

## Security

### CLI
- **CVE-2026-26996**: Bump minimatch to 10.2.1 ([#34509](https://github.com/nrwl/nx/pull/34509)) — 22.5.3
- Prevent command injection in getNpmPackageVersion ([#34309](https://github.com/nrwl/nx/pull/34309)) — 22.5.0
- Remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.5.1

### Cloud
- Access control settings now require confirmation before saving (2602.11.1)

### Infrastructure
- Lighthouse: Move to secure db password (5d26273a, 2026-02-19)
- Lighthouse: Remove IAP connections, wire up new Google secrets (77fcf5b3, c39965ec, 2026-02-18)
- Lighthouse: Add Google credentials for app access (f652b8ec, 2026-02-18)

## CNW & Onboarding

### CLI
- Add variant 2 to CNW cloud prompts with promo message ([#34223](https://github.com/nrwl/nx/pull/34223)) — 22.5.0
- Add Nx Cloud connect URL to template README ([#34249](https://github.com/nrwl/nx/pull/34249)) — 22.5.0
- Add decorative banners for Nx Cloud CNW completion message ([#34270](https://github.com/nrwl/nx/pull/34270)) — 22.5.0
- Update cnw messaging ([#34364](https://github.com/nrwl/nx/pull/34364)) — 22.5.0
- Lock in CNW variant 2 with deferred connection ([#34416](https://github.com/nrwl/nx/pull/34416)) — 22.5.1
- Add nxVersion to meta in shortUrl for cnw ([#34401](https://github.com/nrwl/nx/pull/34401)) — 22.5.1
- Add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580)) — 22.5.3
- Preserve nxCloud=skip in non-interactive CNW mode ([#34616](https://github.com/nrwl/nx/pull/34616)) — 22.5.3
- Prevent nxCloudId from being generated for new workspaces ([#34532](https://github.com/nrwl/nx/pull/34532)) — 22.5.2
- Fix CNW git amend and README marker handling ([#34306](https://github.com/nrwl/nx/pull/34306)) — 22.5.0
- Consolidate GitHub URL messaging when gh push fails ([#34196](https://github.com/nrwl/nx/pull/34196)) — 22.5.0
- Add command to download cloud client ([#34333](https://github.com/nrwl/nx/pull/34333)) — 22.5.0

### Cloud
- Update back links in connect workspace flows (2602.04.2)
- Fix create-nx-workspace form permissions button (2602.03.1)
- Streamline VCS integration forms (2602.17.4)
- Allow PNPM catalog workspaces through GitHub/GitLab (2602.19.9)
- Add link for users arriving from create-nx-workspace (2602.27.7)

## Workspace Access & Permissions

### Cloud
- Workspace-Repository Access Syncing — match workspace access to VCS repo permissions (2602.27.5)

### Infrastructure
- Enable NX_CLOUD_WORKSPACE_VISIBILITY_ENABLED env var on dev (8816589d, 2026-02-13)
- Enable NX_CLOUD_REPOSITORY_ACCESS_ENABLED env var on dev (fba05e1b, 2026-02-27)

## Nx Cloud Client & Artifact Encryption

### Cloud
- `decrypt-artifact` CLI command for E2E-encrypted artifact decryption (2602.12.6)
- Fix client crash for large runs with daemon enabled (2602.10.2)
- Runner properly constructs URLs when Cloud URL has trailing slash (2602.13.2)

## JVM Ecosystem (Gradle & Maven)

### CLI
- Add debug env var to gradle batch executor ([#34259](https://github.com/nrwl/nx/pull/34259)) — 22.5.0
- Load Maven classes at runtime for version-agnostic batch execution ([#34180](https://github.com/nrwl/nx/pull/34180)) — 22.5.0
- Bump maven plugin version to 0.0.13 ([#34318](https://github.com/nrwl/nx/pull/34318)) — 22.5.0
- Use tooling api compatible flags for gradle ([#34247](https://github.com/nrwl/nx/pull/34247)) — 22.5.0
- Ensure batch output not overridden for atomized targets ([#34268](https://github.com/nrwl/nx/pull/34268)) — 22.5.0
- Enforce single gradle task per executor invocation ([#34269](https://github.com/nrwl/nx/pull/34269)) — 22.5.0
- Use gradle project name when resolving dependent tasks ([#34331](https://github.com/nrwl/nx/pull/34331)) — 22.5.0
- Include pom.xml and ancestor pom files as inputs ([#34291](https://github.com/nrwl/nx/pull/34291)) — 22.5.0
- Use module-level variable for cache transfer in Maven ([#34386](https://github.com/nrwl/nx/pull/34386)) — 22.5.1
- Correctly map between maven locators and nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.5.1
- Write output after each task in batch mode for correct caching ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.5.2
- Ensure atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.5.3
- Use globs for dependent task output files ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.5.3
- Fix pom file path without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.5.3
- Update maven & gradle icons to java duke icon ([#34508](https://github.com/nrwl/nx/pull/34508)) — 22.5.3

## TUI & CLI Stability

### CLI
- Display batch tasks in the TUI ([#33695](https://github.com/nrwl/nx/pull/33695)) — 22.5.0
- Move tui to parking lot rwlock to avoid hang ([#34187](https://github.com/nrwl/nx/pull/34187)) — 22.5.0
- Handle resizing for inline_tui ([#34006](https://github.com/nrwl/nx/pull/34006)) — 22.5.0
- Avoid crash when pane area is out of bounds during resize ([#34343](https://github.com/nrwl/nx/pull/34343)) — 22.5.0
- Preserve task selection when unrelated tasks finish ([#34328](https://github.com/nrwl/nx/pull/34328)) — 22.5.0
- Hitting [1] or [2] should remove pinned panes if they match current task ([#34433](https://github.com/nrwl/nx/pull/34433)) — 22.5.1
- Prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.5.2
- Gate tui-logger init behind `NX_TUI` env var ([#34426](https://github.com/nrwl/nx/pull/34426)) — 22.5.2
- Avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.5.2
- Reduce terminal output duplication and allocations in task runner ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.5.2
- Handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.5.3
- Use picocolors instead of chalk in the nx package ([#34305](https://github.com/nrwl/nx/pull/34305)) — 22.5.0

## Daemon & Performance

### CLI
- Clean up daemon workspace data directory on nx reset ([#34174](https://github.com/nrwl/nx/pull/34174)) — 22.5.0
- Resolve daemon client reconnect queue deadlock ([#34284](https://github.com/nrwl/nx/pull/34284)) — 22.5.0
- Handle EPIPE errors gracefully in daemon socket writes ([#34311](https://github.com/nrwl/nx/pull/34311)) — 22.5.0
- Allow overriding daemon logging settings ([#34324](https://github.com/nrwl/nx/pull/34324)) — 22.5.0
- Reduce daemon inotify watch count by upgrading watchexec ([#34329](https://github.com/nrwl/nx/pull/34329)) — 22.5.0
- Handle multibyte UTF-8 characters in socket message consumption ([#34151](https://github.com/nrwl/nx/pull/34151)) — 22.5.0
- Clean up stale socket files before listening ([#34236](https://github.com/nrwl/nx/pull/34236)) — 22.5.1
- Skip stale recomputations and prevent lost file changes in daemon ([#34424](https://github.com/nrwl/nx/pull/34424)) — 22.5.2
- Replace buggy ignore-files trie with correct path-component gitignore matching ([#34447](https://github.com/nrwl/nx/pull/34447)) — 22.5.2
- Use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.5.3
- Retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.5.3
- Reject pending promises directly when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.5.3
- Eagerly shutdown plugins that don't provide later hooks ([#34253](https://github.com/nrwl/nx/pull/34253)) — 22.5.0
- Improve plugin worker error messages and lifecycle timeouts ([#34251](https://github.com/nrwl/nx/pull/34251)) — 22.5.0
- Fall back to node_modules when tmp has noexec ([#34207](https://github.com/nrwl/nx/pull/34207)) — 22.5.0
- Use static_vcruntime to avoid msvcrt dependency ([#19781](https://github.com/nrwl/nx/pull/19781)) — 22.5.2
- Use workspace root for path resolution when baseUrl is not set ([#34453](https://github.com/nrwl/nx/pull/34453)) — 22.5.2
- Use a consistent batch id between scheduler and task runner ([#34392](https://github.com/nrwl/nx/pull/34392)) — 22.5.1
- Make runtime cache key deterministic ([#34390](https://github.com/nrwl/nx/pull/34390)) — 22.5.1
- Handle dangling symlinks during cache restore ([#34396](https://github.com/nrwl/nx/pull/34396)) — 22.5.1
- Avoid dropping unrelated continuous deps in makeAcyclic ([#34389](https://github.com/nrwl/nx/pull/34389)) — 22.5.1
- Use scoped cache key for unresolved npm imports in TargetProjectLocator ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.5.3
- Commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.5.2
- Make watch command work with all and initialRun specified ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.5.3
- Reset daemon client after project graph creation in withNx ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.5.2

## Docs & nx.dev

### CLI
- Add llms-full.txt and HTTP Link headers for LLM discovery ([#34232](https://github.com/nrwl/nx/pull/34232)) — 22.5.0
- Add server-side page view tracking for docs ([#34283](https://github.com/nrwl/nx/pull/34283)) — 22.5.0
- Reformat sidebar into topics ([#34265](https://github.com/nrwl/nx/pull/34265)) — 22.5.0
- Improve plugin registry visibility ([#34395](https://github.com/nrwl/nx/pull/34395)) — 22.5.1
- Add missing nx-cloud intro in sidebar ([#34403](https://github.com/nrwl/nx/pull/34403)) — 22.5.1
- Clarify project linking for workspaces ([#34405](https://github.com/nrwl/nx/pull/34405)) — 22.5.1
- Include nx cli examples on refs page ([#34367](https://github.com/nrwl/nx/pull/34367)) — 22.5.0
- Widen search dialog ([#34504](https://github.com/nrwl/nx/pull/34504)) — 22.5.2
- Update breadcrumb links to match sidebar ([#34500](https://github.com/nrwl/nx/pull/34500)) — 22.5.2
- Correct interpolate sub command for cli reference ([#34585](https://github.com/nrwl/nx/pull/34585)) — 22.5.3
- Move redirects from Next.js config to Netlify _redirects ([#34612](https://github.com/nrwl/nx/pull/34612)) — 22.5.3
- Fix broken /launch-nx links ([#34192](https://github.com/nrwl/nx/pull/34192), [#34255](https://github.com/nrwl/nx/pull/34255)) — 22.5.0
- Update dead links across nx-dev UI libraries ([#34238](https://github.com/nrwl/nx/pull/34238)) — 22.5.0
- Make headers and table options linkable ([#34267](https://github.com/nrwl/nx/pull/34267)) — 22.5.0
- Fix double-counting and exclude assets from page tracking ([#34286](https://github.com/nrwl/nx/pull/34286)) — 22.5.0
- Exclude large native deps from build bundle ([#34335](https://github.com/nrwl/nx/pull/34335)) — 22.5.0
- Fix og images wrong URL for embeds ([#34346](https://github.com/nrwl/nx/pull/34346)) — 22.5.0
- Use right URL for netlify context ([#34348](https://github.com/nrwl/nx/pull/34348)) — 22.5.0
- Use shared preview url for netlify deploy ([#34467](https://github.com/nrwl/nx/pull/34467)) — 22.5.2
- Rewrite Framer URLs to nx.dev in HTML responses ([#34445](https://github.com/nrwl/nx/pull/34445)) — 22.5.2

## Ecosystem & Framework Support

### CLI
- **TypeScript**: Add NX_PREFER_NODE_STRIP_TYPES to use Node's strip types feature ([#34202](https://github.com/nrwl/nx/pull/34202)) — 22.5.0
- **SWC**: Bump swc to latest versions ([#34215](https://github.com/nrwl/nx/pull/34215)), update swc/cli to 0.8.0 ([#34365](https://github.com/nrwl/nx/pull/34365)) — 22.5.0
- **SWC**: Use caret range for swc dependencies in pnpm catalog ([#34487](https://github.com/nrwl/nx/pull/34487)) — 22.5.2
- **ESLint**: Support eslint v10 ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.5.3
- **ESLint**: Allow wildcards paths in enforce-module-boundaries rule ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.5.3
- **Angular**: Use SASS indented syntax in nx-welcome when style is sass ([#34510](https://github.com/nrwl/nx/pull/34510)) — 22.5.3
- **Angular/Rspack**: Exclude .json files from JS/TS regex patterns ([#34195](https://github.com/nrwl/nx/pull/34195)) — 22.5.3
- **React**: Remove file-loader dependency and update svgr migration ([#34218](https://github.com/nrwl/nx/pull/34218)) — 22.5.0
- **Vite**: Handle sophisticated vite plugins ([#34242](https://github.com/nrwl/nx/pull/34242)) — 22.5.0
- **Vite**: isPreview=true for Vite Preview server ([#34597](https://github.com/nrwl/nx/pull/34597)) — 22.5.3
- **Vitest**: Preload vitest/node to prevent race condition on Node 24 ([#34261](https://github.com/nrwl/nx/pull/34261)) — 22.5.0
- **Vitest**: Ensure vitest config file is created ([#34216](https://github.com/nrwl/nx/pull/34216)) — 22.5.0
- **Vitest**: Remove redundant vite.config.ts generation for vitest projects ([#34603](https://github.com/nrwl/nx/pull/34603)) — 22.5.3
- **Webpack**: Fix regression on process.env usage ([#34583](https://github.com/nrwl/nx/pull/34583)) — 22.5.3
- **Webpack**: Ensure safe process.env fallback replacement ([#34464](https://github.com/nrwl/nx/pull/34464)) — 22.5.3
- **Bundling**: Skip unnecessary type-check in TS Solution Setup when skipTypeCheck is true ([#34493](https://github.com/nrwl/nx/pull/34493)) — 22.5.3
- **Bundling**: Add docs link to generatePackageJson error message ([#34562](https://github.com/nrwl/nx/pull/34562)) — 22.5.3
- **Next.js**: Reset daemon client after project graph creation in withNx ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.5.2
- **Playwright**: Add cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.5.1
- **Jest**: Use surgical text replacement in Jest matcher alias migration ([#34350](https://github.com/nrwl/nx/pull/34350)) — 22.5.3
- **Plugins**: Add negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160)) — 22.5.1
- **Plugins**: Use per-invocation cache in TS plugin to fix NX_ISOLATE_PLUGINS=false ([#34566](https://github.com/nrwl/nx/pull/34566)) — 22.5.3
- **JS**: Guard against undefined closest node in rehoistNodes ([#34347](https://github.com/nrwl/nx/pull/34347)) — 22.5.3
- **Release**: Remove unnecessary number from release return type ([#34481](https://github.com/nrwl/nx/pull/34481)) — 22.5.2
- **Release**: Add null-safe fallback for version in createGitTagValues ([#34598](https://github.com/nrwl/nx/pull/34598)) — 22.5.3
- **Release**: Allow null values in schema of dockerVersion ([#34171](https://github.com/nrwl/nx/pull/34171)) — 22.5.3
- **Devkit**: Allow null values in JSON schema validation ([#34167](https://github.com/nrwl/nx/pull/34167)) — 22.5.0
- **Bun**: Use --lockfile-only for Bun updateLockFile ([#34375](https://github.com/nrwl/nx/pull/34375)) — 22.5.0
- **FreeBSD**: Improve freebsd build reliability with better error handling and disk cleanup ([#34326](https://github.com/nrwl/nx/pull/34326)) — 22.5.0

## Nx Cloud UI Fixes

### Cloud
- Fixed search parameters persisting between task and flaky task analytics (2602.09.7)
- Enterprise contributor data rendered regardless of license duration (2602.09.5)
- Verification tasks tab shows "In progress" status while running (2602.04.3)
- Compare Tasks page shows "Originated from" link immediately for remote cache hits (2602.11.3)
- Display contributors with null names as "No attribution" (2602.20.1)
- Fix task list sorting stability when items share same sort value (2602.23.8)
- Show inline error instead of run 404 on task detail errors (2602.18.13)

## Infrastructure

### Enterprise Tenant Deployments
- **Wix**: Full deployment — Terraform, YAML, Lighthouse, SAML enabled (674137ce → b1c1c43c, 2026-02-18–23)
- **Legora**: Full GCP single tenant deployment with Terraform, Spacelift, and MongoDB user (96f4801e → 878c6b8f, 2026-02-25)
- **Celonis**: Bump nx-api 3→6 replicas (724c3ced, 2026-02-12)
- **Island**: Bump nx-api 3→6 replicas (b4c1b1c3, 2026-02-03)

### Controller & Workflow
- Enable async status updates for controllers: Flutter, Mimecast, Clickup, Emeria, Island (26802a1c → 376077b4, 2026-02-11)
- Bump wf controller to 2 replicas for production na/eu (6d70b2f4, 2026-02-05)
- Enable async status updates in production na/eu (a41bc05b, 2026-02-05)

### Caching & NPM Infrastructure
- Deploy nginx-backed npm read-through cache to enterprise GCP (a5659653, 2026-02-12)
- Test deployment on development with npm caching metrics (8684f6b9 → 1fc8b44f, 2026-02-12)
- ClickUp: Add nginx as frontline cache, bump resources (4b6eb4a2 → 449ee2ab, 2026-02-11)

### Monitoring & Operations
- Add Grafana billing alerts (970f0df9, 2026-02-27)
- Add synthetic checks for tenants (0858195b, 2026-02-26)
- Enable Valkey Metrics scraping for workflow queue data in prod/enterprise (10ccbda3, 2026-02-05)
- Add PostHog reverse proxies (4f8fe0cb, 2026-02-12)
- Lighthouse: Auto-update setup, secure credentials migration, IAP removal (a20054b5 → 846bc0cb, 2026-02-18–19)

### Provider & Tooling Updates
- Update OpenTofu version (e53cf3cf, 2026-02-23)
- Update GCP, Azure, AWS, MongoDB, Grafana provider versions across all tenants
- Upgrade Spacelift provider and admin stack
- AL2023 worker node migration for Flutter/Emeria (bde77c3a, 2026-02-06)
- Multi-zone nodegroup split for AWS agents (d257ac8a, 2026-02-17)

### Bitbucket & GitHub Apps
- Add Bitbucket Cloud app secrets to development (5f9d1f59, 2026-02-25)
- Modify GitHub app slug on dev for new GitHub app (d0e0114b, 2026-02-18)
- Add new secret for GitHub app for enterprise tenants (cf627422, 2026-02-24)

## CI & Build Fixes

### CLI
- Align pnpm version in CI workflows with package.json ([#34370](https://github.com/nrwl/nx/pull/34370)) — 22.5.0
- Use sudo for global npm install in publish workflow ([#34409](https://github.com/nrwl/nx/pull/34409)), reverted ([#34451](https://github.com/nrwl/nx/pull/34451)) — 22.5.1
- Replace addnab/docker-run-action with direct docker run ([#34448](https://github.com/nrwl/nx/pull/34448)) — 22.5.1
- Fix e2e CI failures from Node 22.12 incompatibility ([#34501](https://github.com/nrwl/nx/pull/34501)) — 22.5.2
- Remove chalk from e2e tests ([#34570](https://github.com/nrwl/nx/pull/34570)) — 22.5.3
- Add missing FileType import for Windows watcher build ([#34369](https://github.com/nrwl/nx/pull/34369)) — 22.5.0
- Add timeout to runCommandUntil to prevent hanging tests ([#34148](https://github.com/nrwl/nx/pull/34148)) — 22.5.0
- Use GITHUB_ACTIONS env var for CI detection in nx-release (21.3.12 backport)
- Cloud commands are noop when not connected rather than errors ([#34193](https://github.com/nrwl/nx/pull/34193)) — 22.5.0
- Nx should show help for run-one when using project short names ([#34303](https://github.com/nrwl/nx/pull/34303)) — 22.5.0

## Polygraph AI (RedPanda)

- GitHub Actions integrations for CI pipeline analysis
- Graph UI drawing for dependency visualization
- Session descriptions, authors, and closing flows
- PR creation and coordination automation
- Repository discovery API for multi-repo support
- MCP tools auto-install client bundle
- GitHub PR comments integration
- UI session views and edge drawing

## Performance & Resource Optimization (CLI)

- jemalloc allocator: -81% memory fragmentation, -26% RSS (NXC)
- Glob pattern caching: 95.6% cache hit rate (NXC)
- Daemon stale graph recomputation fixes (NXC)
- TUI logger optimization (NXC)
- Surface level telemetry (NXC)

## Framer Migration (Cloud)

~30 issues. All marketing pages migrated from Framer to nx.dev:
- Homepage, pricing, enterprise, solutions, contact, community, company
- Brands, webinar, careers, resources, blog index, 404, Java, React pages
- SEO handling and tracking bridge (GTM)
- Header migration and brand messaging updates
- Lead: Benjamin Cabanes; SEO review: Heidi Grutter

## Continuous Task Assignment (Quokka)

- DTE benchmark tooling (exporter, plugin, fixture scripts)
- Worker pool management and long-polling rework
- Non-cacheable task agent assignment
- Metrics collection and analysis visualization
- Agent exit after worker shutdown
- Flaky retry status and stalled worker handling
- Valkey-based assignment

## LLM-Enhanced Flakiness Detection (Quokka)

- Simulation with LLM evaluation framework
- Benchmark results for flaky test detection accuracy

## Linear Project Status

### Completed in February
| Project | Team | Lead |
|---------|------|------|
| Framer Migration | CLOUD | Benjamin Cabanes |
| Lighthouse: Google Auth & Remove IaP | INF | Steve Pentland |
| Bucket access binding → memberships | INF | Patrick Mariglia |
| Remove ability to use non-signed storage | INF | Szymon Wojciechowski |
| Pylon Rollout & Evaluation | CS | Steven Nance |
| In-depth Podman/Buildah validation | INF | Patrick Mariglia |
| Update and unify terraform provider versions | INF | Szymon Wojciechowski |
| Improve workspace analytics UX | CLOUD | Dillon |

### Active
| Project | Team | Lead | Notes |
|---------|------|------|-------|
| Polygraph AI | NXA | Jonathan Cammisuli, Victor Savkin | Cross-repo plan mode |
| Task Sandboxing | NXC/Q | Rares Matei, Craigory Coppola | Inputs vs expected outputs |
| CLI Agentic Experience (AX) | NXA | Max Kless, Colum Ferry | Agentic nx connect |
| Self-Healing CI (BYOK) | NXA | James Henry | Enterprise AI credits |
| Workspace Visibility | NXA | Mark Lindsey, Chau Tran | Azure DevOps OAuth |
| .NET Support | NXC | Craigory Coppola | New ecosystem |
| Maven Support | NXC | Jason Jean | External deps, test sources |
| Surface Level Telemetry | NXC | Jason Jean | Rust rewrite |
| Continuous Assignment | Q | Altan Stalker | DTE benchmarking |

### Issues Completed: 454 across 6 teams
NXC 84 · CLOUD 85 · NXA 111 · Q 89 · INF 60 · DOC 25

_Generated on 2026-02-28._
