# Nx Platform Changelog — February 2026

> **Sources:** Nx CLI GitHub releases (22.4.5, 22.5.0–22.5.3, 21.3.12), Nx Cloud changelog (24 versions, 2602.02.4–2602.27.7), nrwl/cloud-infrastructure commits, Linear (NXC, CLOUD, INF, NXA, Q, DOC teams).

---

## Task Sandboxing & Hermetic Builds

### CLI
- Add initial impl of task IO service ([#34205](https://github.com/nrwl/nx/pull/34205)) — 22.5.0
- Handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.5.1
- Extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.5.1
- Add `--inputs`, `--check-input`, `--outputs`, `--check-output` flags to `nx show target` (NXC-3762, NXC-3763, NXC-3764) — 22.5.x
- CLI PID listeners for io trace daemon (NXC-3728)
- Expand hash inputs in TaskIOService for cloud consumption (NXC-3761)
- Fix run-commands to handle multiple PIDs for tracing (NXC-3907)
- Filter non-cacheable and continuous tasks from sandbox violations (NXC-3951)
- Only listen for file events in workspace directory (NXC-3837)
- Ignore certain files from anomaly analysis (NXC-3826)
- Upload raw task file to cloud bucket (NXC-3839)
- Output files relative to workspace dir (NXC-3844)

### Cloud
- Add API endpoint to support persisting IO tracing reports from Nx Agents (2602.12.11)
- Anomaly report log API endpoint for frontend (Q-193)
- Create IO trace analysis section in task details view (Q-209)
- Task list view: show warning indicator for sandbox violations (Q-208)
- UI Anomaly Display with virtualized file tree views (Q-127, Q-248)
- Download raw report button (Q-215)
- Show sandbox violation banner for WARNING mode (Q-207)
- Strict mode toggle UI + strict violations fail DTE (Q-187, Q-188)
- Avoid showing sandbox UI if there is no report (Q-229)
- Display process command in anomaly report (Q-257)
- Expose PID and command for file read/write events (Q-246)
- Filter out reads from outside workspace root (Q-256)
- nx-cloud runner creates unique ID in marker file (Q-186)
- Skip signal file generation for cache hits/non-cacheable/continuous tasks (Q-241)
- Ensure sandbox reports get evicted at same lifetime as runs (Q-204)
- Fix daemon over-sending task completion reports (Q-232)
- Fix 500 internal server error on daemon (Q-235)
- Fix missing raw file when sandbox report exists (Q-233)
- Fix oomKills on daemon pod (Q-195)
- Add missed reads and writes to mongo stats (Q-228)

### Infrastructure
- Create new internal helm chart for io-tracing (1187c07b)
- Deploy io-tracer to staging (e4995b25)
- Add io-tracing SA + permissions to production (0f57bdd9)
- Add io-tracing infra to staging (d9fa47ff)
- Add io-tracing to monitoring namespace on staging (685e9816)
- Add io-tracing SA associations for AWS single-tenants (1067cf17)
- Add io-tracing SAs to GCP single-tenants (ee12326c)
- Add io-trace-daemon ECR repo (35642447)
- Enable sandboxing on staging (ca1fc1f2)
- Enable sandbox endpoints on snapshot (fa415a4b)
- Increase io-trace-daemon ringbuf size and memory (cfd23f4d)
- Increase CPU limit for io trace daemon (1d45c80a)
- Make io-trace-daemon burstable (c075a3cd)
- Enable io tracing signal files on snapshot (97e7084b)
- Add `--nx-cloud-api` arg to io-trace-daemon DaemonSet (b41afe4a)

---

## Self-Healing CI

### Cloud
- Self-Healing CI can be enabled during repository onboarding with one checkbox (2602.26.2)
- Auto-apply recommendations shown inline in settings and during fix application (2602.03.2)
- Highlight pending auto-apply recommendations when using `apply-locally` or VCS comments (2602.19.6)
- Detailed failure reasons in Technical Details section (2602.12.5)
- Remove experimental badge from AI features (2602.18.3)
- Self-Healing CI setup now available for BitBucket and Azure DevOps (2602.02.4)
- Add self-healing indicators to workspace and org dashboards (NXA-870)
- Expose auto-apply recommendations UI to everyone (NXA-889)
- Surface self-healing logs in CIPE self-healing UI (NXA-892)
- Ralph Mode — automated CIPE monitoring & fix application (NXA-791)
- Adjust "too many unapplied fixes" logic (NXA-1002)
- Add retry mechanism for self-healing on latest commit (NXA-946)
- Self-serve adoption data dashboard (NXA-941)
- Fix self-healing fix apply serialization error (NXA-928)
- Fix verification tasks briefly showing as failing until complete (NXA-867)
- Fix auto-applied PR review comment not posted (NXA-877)
- Adjust bitbucket self-healing comment formatting (NXA-837)
- Improve error logging for MailChimp execution failures (NXA-882)
- Enhance git command failure messages for DTE (NXA-933)
- Ensure GitLab experience is good (NXA-854)
- Fix occasional `git merge-base` failures for bitbucket (NXA-964)

### CLI
- Add passthrough for `nx-cloud apply-locally` command ([#34557](https://github.com/nrwl/nx/pull/34557)) — 22.5.3

---

## AI-Powered Development (Agentic Experience)

### CLI
- Improve configure-ai-agents to copy nx skills/subagents/plugins ([#34176](https://github.com/nrwl/nx/pull/34176)) — 22.5.0
- Improve AI agent rules for CLAUDE.md generation ([#34304](https://github.com/nrwl/nx/pull/34304)) — 22.5.0
- Add AI agent detection and NDJSON output for CNW ([#34320](https://github.com/nrwl/nx/pull/34320)) — 22.5.0
- Update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.5.1
- Update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.5.1
- Make sure MCP args aren't overridden in configure-ai-agents ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.5.1
- Handle Ctrl+C gracefully in configure-ai-agents (9128fcb66f) — 22.5.2
- Only pull configure-ai-agents from latest if local version differs ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.5.2
- Add --json flag for better AX to `nx list` ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.5.3
- Preserve existing source properties in claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.5.3
- Enhance `nx list <plugin>` with paths and JSON output (NXC-3809)
- Handle `--no-interactive` flag better in Nx CLI (NXC-3774)
- Set up CNW benchmarks for CLI agentic experience (NXC-3830)

### Cloud (Polygraph AI)
- Implement GitHub Actions integrations (NXA-1014)
- Draw relevant part of graph updated in UI (NXA-970)
- Add support for polygraph session description (NXA-976)
- Track author who creates sessions (NXA-977)
- Support closing/completing sessions (NXA-985)
- Handle required user input (NXA-910)
- Design doc for GitHub Status updates (NXA-988)
- Support repo selection (NXA-1010)
- Handle breaking changes in PR graphs requiring releases (NXA-916)
- Associate already-opened PR to polygraph session (NXA-955)
- Implement multi-repo support (NXA-939)
- Implementation to download client bundle (NXA-937)
- Create Nx Cloud Polygraph session UI (NXA-850)
- Replace token handling when cloning repos (NXA-956)
- MCP polygraph tools auto-install client bundle (NXA-963)

### Cloud (Other AX)
- Automatically create agent config for executing agent (NXA-1005)
- Build mechanism to show configure-ai-agents is outdated (NXA-943)
- Add passthrough for `nx-cloud apply-locally` to `nx` (NXA-1001)
- Migrate claude plugin to repo root (NXA-982)
- Add hints to MCP tool structuredContent (NXA-957)
- Make MCP work with pasted run/CIPE links (NXA-328)
- Fix nx console for cursor MCP tool handling (NXA-1017)
- Investigate Claude /sandbox mode hanging (NXA-828)
- Adjust ci-watcher subagent for intermediate CI states (NXA-886)
- Add clearer agent instructions for failed CIPE status (NXA-932)
- Improve agent-controlled create-nx-workspace (NXA-890)
- Implement agentic CNW that sets up the platform (NXA-920)
- Re-check configure-ai-agents for cursor/opencode configs (NXA-958)
- Set up release flow for agent tools (NXA-841)
- Ensure new setup with minimal is respected in VSCode & Cursor (NXA-887)
- Blog post for skills launch (NXA-972)
- Write post covering outer CI loop (NXA-857)
- Document Claude plugin / agent configs (NXA-825)
- Create launch content for agent configs (NXA-826)
- Collect benchmark data for MCP blog post (NXC-3792)

---

## Performance & Reliability

### CLI
- Use `jemalloc` as allocator: -81% fragmentation, -26% RSS (NXC-3877) — ([#related](https://github.com/nrwl/nx/pull/related))
- Cache compiled glob patterns in native module: 95.6% cache hit rate (NXC-3960)
- Use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.5.3
- Replace buggy ignore-files trie with correct path-component gitignore matching ([#34447](https://github.com/nrwl/nx/pull/34447)) — 22.5.2
- Skip stale recomputations and prevent lost file changes in daemon ([#34424](https://github.com/nrwl/nx/pull/34424)) — 22.5.2
- Resolve daemon client reconnect queue deadlock ([#34284](https://github.com/nrwl/nx/pull/34284)) — 22.5.0
- Reduce terminal output duplication and allocations in task runner ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.5.2
- Prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.5.2
- Gate tui-logger init behind `NX_TUI` env var ([#34426](https://github.com/nrwl/nx/pull/34426)) — 22.5.2
- Avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.5.2
- Move TUI to parking lot rwlock to avoid hang ([#34187](https://github.com/nrwl/nx/pull/34187)) — 22.5.0
- Handle resizing better for inline_tui ([#34006](https://github.com/nrwl/nx/pull/34006)) — 22.5.0
- Avoid crash when pane area is out of bounds during resize ([#34343](https://github.com/nrwl/nx/pull/34343)) — 22.5.0
- Preserve task selection when unrelated tasks finish ([#34328](https://github.com/nrwl/nx/pull/34328)) — 22.5.0
- Eagerly shutdown plugins that don't provide later hooks ([#34253](https://github.com/nrwl/nx/pull/34253)) — 22.5.0
- Improve plugin worker error messages and lifecycle timeouts ([#34251](https://github.com/nrwl/nx/pull/34251)) — 22.5.0
- Reduce daemon inotify watch count by upgrading watchexec ([#34329](https://github.com/nrwl/nx/pull/34329)) — 22.5.0
- Retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.5.3
- Reject pending promises directly when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.5.3
- Use scoped cache key for unresolved npm imports in TargetProjectLocator ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.5.3
- Handle EPIPE errors gracefully in daemon socket writes ([#34311](https://github.com/nrwl/nx/pull/34311)) — 22.5.0
- Handle multibyte UTF-8 characters in socket message consumption ([#34151](https://github.com/nrwl/nx/pull/34151)) — 22.5.0
- Use picocolors instead of chalk in nx package ([#34305](https://github.com/nrwl/nx/pull/34305)) — 22.5.0
- Handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.5.3
- Use static_vcruntime to avoid msvcrt dependency ([#19781](https://github.com/nrwl/nx/pull/19781)) — 22.5.2
- Commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.5.2
- Clean up stale socket files before listening ([#34236](https://github.com/nrwl/nx/pull/34236)) — 22.5.1
- Make runtime cache key deterministic ([#34390](https://github.com/nrwl/nx/pull/34390)) — 22.5.1
- Handle dangling symlinks during cache restore ([#34396](https://github.com/nrwl/nx/pull/34396)) — 22.5.1
- Do not throw error if worker.stdout is not instanceof socket ([#34224](https://github.com/nrwl/nx/pull/34224)) — 22.5.0
- Remove unused getTerminalOutput from BatchProcess ([#34604](https://github.com/nrwl/nx/pull/34604)) — 22.5.3

### Cloud (nx-api)
- Long-polling rework for task assignment (Q-165)
- Extended timeouts for /executions/create-run-group, /v2/status, /v2/tasks, /runs/end, /v2/start (Q-166, Q-167, Q-168, Q-180, Q-181)
- Fix Redisson + Netty upgrade direct memory increase (Q-212)
- Handle JSON.stringify limit for processInBackground daemon calls (Q-185)
- Fix nx-api memory leak (Q-171)
- Fix inconsistent affectedProjectRatio values (Q-158)
- Resolves large run crashes when daemon enabled (2602.10.2)
- Properly construct URLs when Cloud URL has trailing slash (2602.13.2)
- Fix task list sorting stability (2602.23.8)

### Cloud (Continuous Task Assignment)
- Continuous assignment of tasks via Valkey (Q-197)
- Break up DTE scheduler into branched implementation (Q-189)
- DTE benchmark package supports seeding and executing multiple DTEs (Q-191)
- Fix: agent exits after all workers spun down (Q-227)
- Fix: shrinking worker pool may kill worker executing tasks (Q-220)
- Fix: workers stalling during shutdown cause loop (Q-214)
- Fix: non-cacheable tasks not guaranteed on requiring agent (Q-205)
- Fix: WaitingAgents not invalidated often enough (Q-224)
- Fix: long polling is not long with valkey assignment (Q-210)
- Fix: main job fails downloading artifacts (Q-213)
- Fix: Valkey writes non-cacheable completion on assignment (Q-216)
- Fix: metrics collection and analysis visualization (Q-206, Q-203)
- Fix: complete-tasks and assign-tasks don't populate agent metadata (Q-223)
- Fix: flaky retry tasks should not update execution status (Q-222)
- Worker orchestrator remembers retrieved hashes (Q-225)

### Infrastructure
- Workflow Controller multi-replica: enable async status updates in production, enterprise, single-tenants (a41bc05b, INF-1124, INF-1125, INF-1126)
- Bump WF controller to 2 replicas for prod na/eu (6d70b2f4)
- Handle SIGTERM/SIGINT signals in WF controller (INF-1133)
- Remove async processing feature flag (INF-1126)
- Enable Valkey metrics scraping for workflow queue data (10ccbda3)
- Bump Celonis nx-api 3→6 replicas (724c3ced)
- Bump Island nx-api 3→6 replicas (b4c1b1c3)
- Move api/frontend replica settings to common (64a95fd0)
- Use subPath volumes in production/enterprise (36a61fcc)
- Fix frontend container restarts investigation (CLOUD-4222)

---

## Security

### CLI
- Prevent command injection in getNpmPackageVersion ([#34309](https://github.com/nrwl/nx/pull/34309)) — 22.5.0, backported to 22.4.5
- Bump minimatch to 10.2.1 to address CVE-2026-26996 ([#34509](https://github.com/nrwl/nx/pull/34509)) — 22.5.3
- Remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.5.1

### Cloud
- Access control settings require confirmation before saving (2602.11.1)
- `nx-cloud decrypt-artifact` CLI command for E2E encryption (2602.12.6)
- Custom encryption key fix for Azure — blocking PoV for CIBC (Q-221)

### Infrastructure
- Remediate IAM access keys >90 days: Patrick (INF-1190), Athena (INF-1189), Steve (INF-1192)
- IAM Binding → IAM Member migration across all GCP environments (INF-1202 through INF-1209)
- Move Lighthouse to secure DB password (5d26273a)
- Wire up Google secrets for Lighthouse (c39965ec)

---

## JVM Ecosystem (Gradle & Maven)

### CLI (Gradle)
- Display batch tasks in the TUI ([#33695](https://github.com/nrwl/nx/pull/33695)) — 22.5.0
- Add debug env var to gradle batch executor ([#34259](https://github.com/nrwl/nx/pull/34259)) — 22.5.0
- Use tooling API compatible flags ([#34247](https://github.com/nrwl/nx/pull/34247)) — 22.5.0
- Ensure batch output not overridden for atomized targets ([#34268](https://github.com/nrwl/nx/pull/34268)) — 22.5.0
- Enforce only one gradle task per executor invocation ([#34269](https://github.com/nrwl/nx/pull/34269)) — 22.5.0
- Use gradle project name when resolving dependent tasks ([#34331](https://github.com/nrwl/nx/pull/34331)) — 22.5.0
- Ensure atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.5.3
- Use globs for dependent task output files ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.5.3
- Add opt-in for executors to declare batch mode (NXC-3793)
- Enable batch mode for Gradle in Ocean (NXC-3957)
- Fix Ocean UI graph OOM with Java (NXC-3958)
- Fix task running pnpm exec in project root vs workspace root (NXC-3988)

### CLI (Maven)
- Load Maven classes at runtime for version-agnostic batch execution ([#34180](https://github.com/nrwl/nx/pull/34180)) — 22.5.0
- Bump maven plugin version to 0.0.13 ([#34318](https://github.com/nrwl/nx/pull/34318)) — 22.5.0
- Include pom.xml and ancestor pom files as inputs ([#34291](https://github.com/nrwl/nx/pull/34291)) — 22.5.0
- Use module-level variable for cache transfer ([#34386](https://github.com/nrwl/nx/pull/34386)) — 22.5.1
- Correctly map between maven locators and nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.5.1
- Fix set pom file without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.5.3
- Write output after each task in batch mode for correct caching ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.5.2
- Update maven & gradle icons to Java Duke icon ([#34508](https://github.com/nrwl/nx/pull/34508)) — 22.5.3

### Cloud (Gradle)
- Set prefix for Gradle tasks (Q-173)
- Fix atomized test targets missing dependsOn (Q-174)
- Fix dependent tasks generated with incorrect project names (Q-170)
- Ensure dependent task output files use correct path (Q-247)

---

## Onboarding & Workspace Connection

### CLI
- Add variant 2 to CNW cloud prompts with promo message ([#34223](https://github.com/nrwl/nx/pull/34223)) — 22.5.0
- Add Nx Cloud connect URL to template README ([#34249](https://github.com/nrwl/nx/pull/34249)) — 22.5.0
- Add decorative banners for CNW completion message ([#34270](https://github.com/nrwl/nx/pull/34270)) — 22.5.0
- Update CNW messaging ([#34364](https://github.com/nrwl/nx/pull/34364)) — 22.5.0
- Lock in CNW variant 2 with deferred connection ([#34416](https://github.com/nrwl/nx/pull/34416)) — 22.5.1
- Add nxVersion to meta in shortUrl for CNW ([#34401](https://github.com/nrwl/nx/pull/34401)) — 22.5.1
- Add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580)) — 22.5.3
- Preserve nxCloud=skip in non-interactive CNW mode ([#34616](https://github.com/nrwl/nx/pull/34616)) — 22.5.3
- Fix CNW git amend and README marker handling ([#34306](https://github.com/nrwl/nx/pull/34306)) — 22.5.0
- Prevent nxCloudId from being generated for new workspaces ([#34532](https://github.com/nrwl/nx/pull/34532)) — 22.5.2
- Consolidate GitHub URL messaging when gh push fails ([#34196](https://github.com/nrwl/nx/pull/34196)) — 22.5.0
- Cloud commands are noop when not connected rather than errors ([#34193](https://github.com/nrwl/nx/pull/34193)) — 22.5.0
- Hide already-installed packages from suggestion list during nx import ([#34227](https://github.com/nrwl/nx/pull/34227)) — 22.5.0
- Fix CNW template leftover AI agent files (NXC-3920)
- Address common CNW errors (NXC-3811, NXC-3813)

### Cloud
- Workspace-repository access syncing (2602.27.5) — access now matches VCS repo permissions
- Landing page link to create workspace from CNW (2602.27.7)
- Streamline VCS integration forms (2602.17.4)
- Allow PNPM catalog workspace connection (2602.19.9)
- Fix create-nx-workspace form permissions button (2602.03.1)
- Fix installing GH app in onboarding for non-cloud.nx.app envs (CLOUD-4289)
- Replace browser-based CNW bottom sheet (CLOUD-4221)
- Update /guide route for CNW users (CLOUD-4305)
- Multiple A/B experiments: Feb 6 (CLOUD-4235), Feb 13 revert (CLOUD-4255), Feb 16 (CLOUD-4288), Feb 23 (CLOUD-4304)
- Add OAuth integration for BitBucket (NXA-898)
- Add new isPublic field and visibility toggle (NXA-893, NXA-901, NXA-902, NXA-904)
- One-page onboarding flow: simplify VCS forms (CLOUD-4279), test GitLab (CLOUD-4195), GH app button (CLOUD-4224)

---

## Framer Migration (Website)

### Cloud
- Migrate Homepage (CLOUD-4089)
- Migrate Pricing Page with pricing cards (CLOUD-4075, CLOUD-4285, CLOUD-4286, CLOUD-4287)
- Migrate Enterprise Page (CLOUD-4086)
- Migrate Nx Cloud Page (CLOUD-4087)
- Migrate Resources (CLOUD-4083)
- Migrate Webinar Page (CLOUD-4079)
- Migrate new header to Framer (CLOUD-4263)
- Consolidate marketing scripts into GTM (CLOUD-4252)
- Add Framer event tracking bridge to GTM (CLOUD-4202)
- Add custom tracking events (CLOUD-4256)
- Set canonical URL in Framer to nx.dev (CLOUD-4148)
- Enable rewrites for all Framer pages on canary (CLOUD-4269)
- Review SEO titles and descriptions (CLOUD-4283)
- Review homepage, pricing page (CLOUD-4292, CLOUD-4291)
- Update website copy for new brand messaging (CLOUD-4284)
- Address feedback rounds (CLOUD-4272, CLOUD-4293)
- Fix theme switch crash on contact/sales page (CLOUD-4276)
- Fix Talk to Sales form stuck with ad blockers (CLOUD-4273)
- Rewrite Framer URLs to nx.dev in HTML responses ([#34445](https://github.com/nrwl/nx/pull/34445)) — 22.5.2

---

## Documentation

### CLI (nx-dev)
- Add llms-full.txt and HTTP Link headers for LLM discovery ([#34232](https://github.com/nrwl/nx/pull/34232)) — 22.5.0
- Reformat sidebar into topics ([#34265](https://github.com/nrwl/nx/pull/34265)) — 22.5.0
- Add server-side page view tracking ([#34283](https://github.com/nrwl/nx/pull/34283)) — 22.5.0
- Widen search dialog ([#34504](https://github.com/nrwl/nx/pull/34504)) — 22.5.2
- Update breadcrumb links to match sidebar ([#34500](https://github.com/nrwl/nx/pull/34500)) — 22.5.2
- Include nx CLI examples on refs page ([#34367](https://github.com/nrwl/nx/pull/34367)) — 22.5.0
- Improve plugin registry visibility ([#34395](https://github.com/nrwl/nx/pull/34395)) — 22.5.1
- Add missing nx-cloud intro in sidebar ([#34403](https://github.com/nrwl/nx/pull/34403)) — 22.5.1
- Clarify project linking for workspaces ([#34405](https://github.com/nrwl/nx/pull/34405)) — 22.5.1
- Make headers and table options linkable ([#34267](https://github.com/nrwl/nx/pull/34267)) — 22.5.0
- Use shared preview URL for Netlify deploy ([#34467](https://github.com/nrwl/nx/pull/34467)) — 22.5.2
- Correct interpolate sub command for CLI reference ([#34585](https://github.com/nrwl/nx/pull/34585)) — 22.5.3
- Move redirects from Next.js config to Netlify _redirects ([#34612](https://github.com/nrwl/nx/pull/34612)) — 22.5.3
- Exclude large native deps from build bundle ([#34335](https://github.com/nrwl/nx/pull/34335)) — 22.5.0
- Fix og images wrong URL for embeds ([#34346](https://github.com/nrwl/nx/pull/34346)) — 22.5.0
- Fix double-counting and exclude assets from page tracking ([#34286](https://github.com/nrwl/nx/pull/34286)) — 22.5.0
- Fix internal link check caching ([#34255](https://github.com/nrwl/nx/pull/34255)) — 22.5.0
- Update broken /launch-nx links ([#34192](https://github.com/nrwl/nx/pull/34192)) — 22.5.0
- Update dead links across nx-dev UI libraries ([#34238](https://github.com/nrwl/nx/pull/34238)) — 22.5.0

### Docs Team (Linear)
- Dedupe content across all getting started pages (DOC-406)
- Propose structure and content for technology pages (DOC-407)
- PoC for new sidebar structure (DOC-365)
- Improve AX for getting started / intro pages (DOC-405)
- Condense and remove redirects (DOC-403)
- Update docs breadcrumbs to match sidebar hierarchy (DOC-400)
- Add requirements section to relevant tech docs pages (DOC-423)
- Fix incorrect usage for `nx show projects` docs (DOC-417)
- Document `checkAllBranchesWhen` type and behavior (DOC-414)
- Add screenshots to cache miss troubleshooting docs (DOC-387)
- Document GitHub app permissions (DOC-187)
- Command examples on CLI reference page (DOC-402)
- Search overlay layout fixes (DOC-410)
- Plugin registry search (DOC-409)
- Anchor link UI for executor options (DOC-383)
- Add redirect from /pricing to Nx Cloud plans section (DOC-426)
- Fix blog too-many-redirects error (DOC-425)
- Investigate nx.dev outage (DOC-415)
- Switch DNS to Netlify (DOC-397)
- Better handling of preview deployments from community (DOC-384)
- Fix Netlify build upload failures (DOC-398)
- Fix prod OG images linking to localhost (DOC-399)
- Use DEPLOY_URL for PR preview builds (DOC-413)
- Refresh GITHUB_TOKEN for docs (DOC-396)
- Server-side page view tracking (DOC-395)
- Boost CLI command reference pages in search (DOC-401)

---

## Framework & Ecosystem Support

### CLI
- **Angular:** Support Angular v21.2 (NXC-3972); use SASS indented syntax in nx-welcome component ([#34510](https://github.com/nrwl/nx/pull/34510)) — 22.5.3
- **React:** Remove file-loader dependency and update svgr migration ([#34218](https://github.com/nrwl/nx/pull/34218)) — 22.5.0
- **Next.js:** Reset daemon client after project graph creation in withNx ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.5.2
- **Vite:** Handle sophisticated vite plugins ([#34242](https://github.com/nrwl/nx/pull/34242)) — 22.5.0; isPreview=true for Vite Preview server ([#34597](https://github.com/nrwl/nx/pull/34597)) — 22.5.3
- **Vitest:** Preload vitest/node to prevent race condition on Node 24 ([#34261](https://github.com/nrwl/nx/pull/34261)) — 22.5.0; ensure vitest config file is created ([#34216](https://github.com/nrwl/nx/pull/34216)) — 22.5.0; remove redundant vite.config.ts generation ([#34603](https://github.com/nrwl/nx/pull/34603)) — 22.5.3
- **ESLint:** Support eslint v10 ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.5.3; allow wildcards in enforce-module-boundaries ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.5.3
- **Webpack:** Ensure safe `process.env` fallback replacement ([#34464](https://github.com/nrwl/nx/pull/34464)) — 22.5.3; fix regression on process.env usage ([#34583](https://github.com/nrwl/nx/pull/34583)) — 22.5.3
- **Rspack (Angular):** Exclude .json files from JS/TS regex patterns ([#34195](https://github.com/nrwl/nx/pull/34195)) — 22.5.3
- **Bundling:** Skip unnecessary type-check in TS Solution Setup when skipTypeCheck is true ([#34493](https://github.com/nrwl/nx/pull/34493)) — 22.5.3; add docs link to generatePackageJson error message ([#34562](https://github.com/nrwl/nx/pull/34562)) — 22.5.3
- **Playwright:** Add cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.5.1
- **Jest:** Surgical text replacement in Jest matcher alias migration ([#34350](https://github.com/nrwl/nx/pull/34350)) — 22.5.3
- **JS/SWC:** Bump swc to latest versions ([#34215](https://github.com/nrwl/nx/pull/34215), [#34365](https://github.com/nrwl/nx/pull/34365)) — 22.5.0; NX_PREFER_NODE_STRIP_TYPES for Node's native TS strip types ([#34202](https://github.com/nrwl/nx/pull/34202)) — 22.5.0; use caret range for swc deps in pnpm catalog ([#34487](https://github.com/nrwl/nx/pull/34487)) — 22.5.2; guard against undefined closest node in rehoistNodes ([#34347](https://github.com/nrwl/nx/pull/34347)) — 22.5.3; use per-invocation cache in TS plugin for NX_ISOLATE_PLUGINS=false ([#34566](https://github.com/nrwl/nx/pull/34566)) — 22.5.3
- **Bun:** Use --lockfile-only for Bun updateLockFile ([#34375](https://github.com/nrwl/nx/pull/34375)) — 22.5.0
- **Release:** Remove unnecessary number from release return type ([#34481](https://github.com/nrwl/nx/pull/34481)) — 22.5.2; allow null values in dockerVersion schema ([#34171](https://github.com/nrwl/nx/pull/34171)) — 22.5.3; null-safe fallback for version in createGitTagValues ([#34598](https://github.com/nrwl/nx/pull/34598)) — 22.5.3
- **Devkit:** Allow null values in JSON schema validation ([#34167](https://github.com/nrwl/nx/pull/34167)) — 22.5.0
- **Misc:** Add negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160)) — 22.5.1; fall back to node_modules when tmp has noexec ([#34207](https://github.com/nrwl/nx/pull/34207)) — 22.5.0; avoid dropping unrelated continuous deps in makeAcyclic ([#34389](https://github.com/nrwl/nx/pull/34389)) — 22.5.1; disable ignore filters for outputs expansion ([#34316](https://github.com/nrwl/nx/pull/34316)) — 22.5.0; track all task outputs regardless of path depth ([#34321](https://github.com/nrwl/nx/pull/34321)) — 22.5.0; use workspace root for path resolution when baseUrl is not set ([#34453](https://github.com/nrwl/nx/pull/34453)) — 22.5.2; only detect flaky tasks for cacheable tasks ([#33994](https://github.com/nrwl/nx/pull/33994)) — 22.5.0; use a consistent batch id between scheduler and task runner ([#34392](https://github.com/nrwl/nx/pull/34392)) — 22.5.1; make watch command work with --all and --initialRun ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.5.3; add proper Stopped status for continuous sibling task failures (NXC-3553); add timeout to runCommandUntil for tests ([#34148](https://github.com/nrwl/nx/pull/34148)) — 22.5.0
- **Backport (21.3.12):** Track all task outputs regardless of path depth ([#34321](https://github.com/nrwl/nx/pull/34321)); use GITHUB_ACTIONS env var for CI detection in nx-release

### Cloud
- Display contributors with null names as "No attribution" (2602.20.1)
- Fix search parameter persistence between task/flaky analytics (2602.09.7)
- Enterprise contributor data rendered regardless of license duration (2602.09.5)
- Verification tasks show "In progress" status while running (2602.04.3)
- Update back links in connect workspace flows (2602.04.2)
- Inline error for task detail retrieval failures instead of run 404 (2602.18.13)
- Compare Tasks shows "Originated from" link without requiring comparison task (2602.11.3)
- Fix unable to remove duplicate members when VCS connected (CLOUD-4043)
- Fix no results in task analytics with filters (CLOUD-4025)
- Fix 7-Eleven admin organization settings access (CLOUD-4173)
- Fix contributor count discrepancy (CLOUD-2614)
- Fix view-logs requests causing frontend pod restarts (CLOUD-4210)
- Restore logs stream migration to workers (CLOUD-4217)
- Fix agent utilization showing wrong/missing hung tasks (CLOUD-4259)
- Fix resource usage page inconsistent peak memory (CLOUD-4257)
- Show distributed agent visualization on CIPE critical error (CLOUD-4162)
- Fix Storybook Calendar stories changing daily (CLOUD-4296)
- Update footer copyright year dynamically (CLOUD-4230)
- Clean up current changelog site (CLOUD-3972)
- Add NX_DISABLED_POWERPACK env var (NXA-881)
- Add sorting to Agent Resource Usage list (NXA-998)
- Fix sorting by duration resetting on period change (NXA-990)
- Fix 403 when upgrading org to Team plan (NXA-1041)
- All platforms report author from git executable (Q-226)
- Do not error log on VCS credential refresh failure (Q-230)
- Update OpenTelemetry javaagent (Q-200)
- Update MongoDB and Buf-Connect deps (Q-199)

---

## Infrastructure Operations

- **Lighthouse:** Wire up Google Auth and remove IAP (INF-1203, INF-1204); audit logging (INF-1210, INF-1222); force logout (INF-1212); move password copy to backend (INF-1211); dedicated service accounts (1b524e01); performance cache for deployed tenant versions (INF-1135); Azure support (INF-1122); AWS support (INF-1121)
- **Terraform:** Update OpenTofu version (INF-1198); update AWS provider and modules (INF-1195); update GCP provider and modules (INF-1196); update Azure providers (INF-1197); update Grafana & Atlas providers (INF-1199); update dev/staging/prod/ops provider versions (INF-1201)
- **Single Tenants:** Wix PoV provisioning (INF-1200, 674137ce, 1dcafa09, 337abbc8); Legora >100 team PoV (INF-1217, 96f4801e, 878c6b8f); Cloudinary SAML setup (INF-1193); Cloudinary GitHub app change (INF-1213, INF-1214); Celonis S3 VPC endpoint (INF-1194)
- **AWS Migration:** AL2→AL2023 worker nodes for Flutter/Emeria (bde77c3a, dad11543); per-zone nodegroups for agents (d257ac8a)
- **NPM Cache:** nginx-backed read-through cache deployed to ClickUp and other enterprise GCP tenants (4b6eb4a2, a5659653, 1fc8b44f, 8684f6b9)
- **Spacelift:** Upgrade provider (cc248e19); admin stack rework (2cea67e5, 35541a37, a5f1a469, 43d75524)
- **Grafana:** Billing alerts in Terraform (INF-1220, 970f0df9); webhook token configuration for Azure tenants (c2a5c089, 13ab31f4)
- **Monitoring:** PostHog reverse proxies (4f8fe0cb); NPM cache metrics for nginx (924f56e8); otel javaagent transport tuning (415b75b2); JVM settings tuning (1f15fbbb)
- **Misc:** Enable SAML for Wix (b1c1b1c3); DPEs can read Azure tenant customer management group buckets (2d07ca13); add Island to large tenants (f892e876); billing export new tenants (66471953); enable workspace visibility env var on dev (8816589d); modify GitHub app slug on dev (d0e0114b); enable repository access env var on dev (fba05e1b); Bitbucket cloud app secrets (5f9d1f59)

---

## Linear Project Status

### Completed in February
| Project | Team | Lead |
|---------|------|------|
| Lighthouse: Wire up Google Auth & Remove IAP | INF | Steve Pentland |
| Bucket access binding → memberships | INF | Patrick Mariglia |
| Update and unify terraform provider versions | INF | Szymon Wojciechowski |
| Workflow Controller Multi-Replica Support | INF | Patrick Mariglia |
| Migrate AL2 nodegroups to AL2023 | INF | Szymon Wojciechowski |
| Framer Migration | CLOUD | Benjamin Cabanes |

### Active
| Project | Teams | Lead | Target |
|---------|-------|------|--------|
| CLI Agentic Experience (AX) | NXA, NXC, CLOUD | Max Kless | — |
| Task Sandboxing (IO Tracing) | NXC, Q, INF | Rares Matei | — |
| Polygraph AI | NXA | Jonathan Cammisuli | — |
| Self-Healing CI | NXA | James Henry | — |
| Workspace Visibility | NXA | Mark Lindsey | — |
| 600 Workspaces Connected Weekly | CLOUD | Nicole Oliver | — |
| Gradle Plugin for Nx | NXC, Q | Louie Weng | — |
| Maven Support | NXC | Jason Jean | — |
| Continuous Task Assignment | Q | Altan Stalker | — |
| Review Nx Resource Usage | NXC | Leosvel Perez Espinosa | — |
| Surface Level Telemetry | NXC | Colum Ferry | 2026-03-06 |
| Content/Structure Improvements | DOC | Jack Hsu | — |
| Grafana Billing Alerts | INF | Szymon Wojciechowski | 2026-03-02 |
| IO Trace Internal Helm Chart | INF | Steve Pentland | 2026-03-02 |
| GCP GKE Docker Image Pre-Loading | INF | Patrick Mariglia | 2026-03-27 |
| Multi-Cluster Agent Setups | INF | Steve Pentland | 2026-04-08 |

### Planned
| Project | Teams | Lead | Target |
|---------|-------|------|--------|
| Improve Worktrees Support | NXC | Jason Jean | 2026-03-13 |
| Extending Target Defaults | NXC | Craigory Coppola | 2026-04-10 |
| Docker Multi-Arch Nx Release | NXC | Colum Ferry | 2026-04-10 |
| Feature Demos | CLOUD | Nicole Oliver | 2026-03-31 |
| Feature Activation Guides | CLOUD | Nicole Oliver | 2026-04-24 |
| In-Progress Agent Waterfall Visualization | CLOUD | Benjamin Cabanes | 2026-04-30 |

### Issues Completed: ~480 across 6 teams
NXC 94 · CLOUD 100+ · INF 62 · NXA 100 · Q 99 · DOC 27

_Generated on 2026-02-27._
