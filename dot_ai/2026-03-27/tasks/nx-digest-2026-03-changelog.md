# Nx Platform Changelog — March 2026

> **Sources:** Nx CLI GitHub releases, Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear (NXC, CLOUD, INF, NXA, Q, DOC teams), Pylon (unavailable).

---

## Task Sandboxing & Hermetic Builds

### CLI

- handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.6.0
- extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.6.0
- surface clearer error when CNW hits SANDBOX_FAILED ([#34724](https://github.com/nrwl/nx/pull/34724)) — 22.6.0
- batch-safe hashing for maven and gradle ([#34446](https://github.com/nrwl/nx/pull/34446)) — 22.6.0
- ensure batch tasks always have hash for DTE ([#34764](https://github.com/nrwl/nx/pull/34764)) — 22.6.0
- batch hashing, topological cache walk, and TUI batch fixes ([#34798](https://github.com/nrwl/nx/pull/34798)) — 22.6.0
- trim memory usage associated with io-tracing service ([#34866](https://github.com/nrwl/nx/pull/34866)) — 22.6.0
- add .nx/polygraph to gitignore in migration and caia ([#34659](https://github.com/nrwl/nx/pull/34659)) — 22.6.0, 22.5.4
- runtime inputs shouldn't be cached at task_hasher layer ([#34971](https://github.com/nrwl/nx/pull/34971)) — 22.6.2
- interpolate {projectRoot} and {projectName} in {workspaceRoot} input patterns in native hasher ([#34637](https://github.com/nrwl/nx/pull/34637)) — 22.6.0
- support dependency filesets with ^{projectRoot} syntax ([#34310](https://github.com/nrwl/nx/pull/34310)) — 22.6.0
- add commands for debugging cache inputs / outputs ([#34414](https://github.com/nrwl/nx/pull/34414)) — 22.6.0
- pass collectInputs flag through daemon IPC for task hashing ([#34915](https://github.com/nrwl/nx/pull/34915)) — 22.6.1
- add .tsbuildinfo dependent outputs to tsc tasks ([#34733](https://github.com/nrwl/nx/pull/34733)) — 22.6.0
- include transitive dep outputs in typecheck inputs ([#34773](https://github.com/nrwl/nx/pull/34773)) — 22.6.0
- add external project reference config files as inputs for tsc tasks ([#34770](https://github.com/nrwl/nx/pull/34770)) — 22.6.0
- track tsconfig files from dependency reference chain as inputs ([#34848](https://github.com/nrwl/nx/pull/34848)) — 22.6.0
- include tsbuildinfo in dependentTasksOutputFiles for tsc tasks ([#34733](https://github.com/nrwl/nx/pull/34733)) — 22.6.0
- always infer dependentTasksOutputFiles for tsc build targets ([#34784](https://github.com/nrwl/nx/pull/34784)) — 22.6.0
- add input on .d.ts files within dependency projects ([#34968](https://github.com/nrwl/nx/pull/34968)) — 22.6.2
- infer task inputs from jest config file references ([#34740](https://github.com/nrwl/nx/pull/34740)) — 22.6.0
- infer dependency tsconfig files as playwright plugin inputs ([#34803](https://github.com/nrwl/nx/pull/34803)) — 22.6.0

### Cloud

- Add file list filters in sandbox analysis process view ([CLOUD-4344](https://linear.app/nxdev/issue/CLOUD-4344))

### Quokka (Cloud Backend)

- Sandbox violation badge shows when mode is Off ([Q-322](https://linear.app/nxdev/issue/Q-322))
- Ignore reads from direct invocations of nx.js ([Q-289](https://linear.app/nxdev/issue/Q-289))
- Investigate io-trace-daemon failures on newer kernels ([Q-314](https://linear.app/nxdev/issue/Q-314))
- Remove sandboxing feature flag on nx-api ([Q-317](https://linear.app/nxdev/issue/Q-317))
- Investigate inconsistent task violation reports ([Q-296](https://linear.app/nxdev/issue/Q-296))
- Reduce number of logs from daemon ([Q-234](https://linear.app/nxdev/issue/Q-234))
- Move internal sandboxing route to /private ([Q-313](https://linear.app/nxdev/issue/Q-313))
- Add env var to enable sandboxing toggle for ST ([Q-312](https://linear.app/nxdev/issue/Q-312))
- Show compare panel for tasks without violations ([Q-295](https://linear.app/nxdev/issue/Q-295))
- Investigate memory usage for tree view ([Q-242](https://linear.app/nxdev/issue/Q-242))
- Use streaming to read and render file tree ([Q-249](https://linear.app/nxdev/issue/Q-249))
- List view filter supports glob patterns ([Q-260](https://linear.app/nxdev/issue/Q-260))
- Add run details filters for flaky and sandbox violations ([Q-265](https://linear.app/nxdev/issue/Q-265))
- Add timeline/conformance view for sandbox violations ([Q-279](https://linear.app/nxdev/issue/Q-279))
- Mismatch between files written count and file tree ([Q-283](https://linear.app/nxdev/issue/Q-283))
- Unexpected reads exceed total files read in sandbox report ([Q-281](https://linear.app/nxdev/issue/Q-281))
- Embed sandboxing exclusion list in Nx io-trace-daemon ([Q-273](https://linear.app/nxdev/issue/Q-273))
- Limit sandbox violations warning list and link to sorted run view ([Q-269](https://linear.app/nxdev/issue/Q-269))
- UI filtering not applied on initial load in Remix ([Q-272](https://linear.app/nxdev/issue/Q-272))
- File tree view: toggle violation types visibility ([Q-259](https://linear.app/nxdev/issue/Q-259))
- Show task ID in sandbox analysis view ([Q-277](https://linear.app/nxdev/issue/Q-277))
- Ensure views in sandbox analysis can be toggled via URL ([Q-286](https://linear.app/nxdev/issue/Q-286))
- Handle file deletions/renames in io-trace ([Q-237](https://linear.app/nxdev/issue/Q-237))
- Remove violations tab view ([Q-266](https://linear.app/nxdev/issue/Q-266))
- Sandbox report taskId coerces special symbols to `_` ([Q-250](https://linear.app/nxdev/issue/Q-250))

### Linear (CLI Team)

- Ignore writes under **/node_modules/** by default ([NXC-4121](https://linear.app/nxdev/issue/NXC-4121))
- Handle Batch Tasks for Sandboxing ([NXC-4118](https://linear.app/nxdev/issue/NXC-4118))
- Task IO service missing inputs for sandbox reports ([NXC-4108](https://linear.app/nxdev/issue/NXC-4108))
- Add *.tsbuildinfo dependent outputs to tsc tasks ([NXC-4041](https://linear.app/nxdev/issue/NXC-4041))
- Remove target default for typecheck in ocean ([NXC-3964](https://linear.app/nxdev/issue/NXC-3964))
- Use JSON by default for AI agent show target command ([NXC-3974](https://linear.app/nxdev/issue/NXC-3974))
- Exclude e2e.log ([NXC-4064](https://linear.app/nxdev/issue/NXC-4064))
- Default to file tree with unexpected filter enabled ([NXC-4067](https://linear.app/nxdev/issue/NXC-4067))
- Input violation check disagrees with nx show target ([NXC-4054](https://linear.app/nxdev/issue/NXC-4054))
- Fix sandboxing inputs for nx:build-base ([NXC-4057](https://linear.app/nxdev/issue/NXC-4057))
- Include Gradle files in Gradle task inputs ([NXC-4029](https://linear.app/nxdev/issue/NXC-4029))
- Investigate d.ts outputs from dependency projects ([NXC-3965](https://linear.app/nxdev/issue/NXC-3965))

### Infrastructure

- Deploy io-trace to ClickUp ([INF-1294](https://linear.app/nxdev/issue/INF-1294))
- IO-Tracing for all GCP enterprise tenants (commit 98dfd767)
- Default to traceTasks: '' for enterprise IO tracing (commit f29cc33b)
- Rename io tracing directory to sandboxing-metadata (commit 0f11ee68)
- Fix io-trace daemon ringbuf default (commit fcd0b703)
- Enable debug logging and trace nx:test on staging (commit 7750b78a)
- Enable sandboxing on Legora frontend (commit b70351fd)
- Enable org access on snapshot/staging (commit 3ac923ec)

### Docs

- Document sandboxing feature for linking from Cloud UI ([DOC-429](https://linear.app/nxdev/issue/DOC-429))

---

## AI-Powered Development & Agentic Experience

### CLI

- handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.6.0
- add agentic mode to nx init ([#34418](https://github.com/nrwl/nx/pull/34418)) — 22.6.0
- automatically set up ai agents in cnw/init when run from within an ai agent ([#34469](https://github.com/nrwl/nx/pull/34469)) — 22.6.0
- implement configure-ai-agents outdated message after tasks ([#34463](https://github.com/nrwl/nx/pull/34463)) — 22.6.0
- improve codex support for configure-ai-agents ([#34488](https://github.com/nrwl/nx/pull/34488)) — 22.6.0
- improve AX of configure-ai-agents with auto-detection ([#34496](https://github.com/nrwl/nx/pull/34496)) — 22.6.0
- add AI agent mode to nx import ([#34498](https://github.com/nrwl/nx/pull/34498)) — 22.6.0
- add Codex subagent support to configure-ai-agents ([#34553](https://github.com/nrwl/nx/pull/34553)) — 22.6.0
- add polygraph command to initialize cross-repo sessions ([#34722](https://github.com/nrwl/nx/pull/34722)) — 22.6.0
- add --json flag for better AX to nx list ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.6.0
- show json by default for agentic ai ([#34780](https://github.com/nrwl/nx/pull/34780)) — 22.6.0
- update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.6.0
- update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.6.0
- make sure mcp args aren't overridden in configure-ai-agents ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.6.0
- preserve existing source properties in claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.6.0
- only pull configure-ai-agents from latest if local version is not latest ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.6.0
- handle Ctrl+C gracefully in configure-ai-agents — 22.6.0
- add .claude/worktrees to gitignore ([#34693](https://github.com/nrwl/nx/pull/34693)) — 22.6.0
- add .claude/settings.local.json to .gitignore ([#34870](https://github.com/nrwl/nx/pull/34870)) — 22.6.0
- share .agents skills dir across codex, cursor, gemini ([#34882](https://github.com/nrwl/nx/pull/34882)) — 22.6.0
- add passthrough for nx-cloud apply-locally command ([#34557](https://github.com/nrwl/nx/pull/34557)) — 22.6.0
- track server page views for AI traffic using Netlify-Agent-Category ([#34883](https://github.com/nrwl/nx/pull/34883)) — 22.6.0

### Cloud

- `nx-cloud onboard` CLI command (2603.27.3)

### RedPanda (Polygraph)

- Implement and publish MVP version of the CLI ([NXA-1174](https://linear.app/nxdev/issue/NXA-1174))
- Setup publishing pipe for polygraph-cli ([NXA-1200](https://linear.app/nxdev/issue/NXA-1200))
- Membership management for orgs ([NXA-1197](https://linear.app/nxdev/issue/NXA-1197))
- Membership management (everything except org) ([NXA-1195](https://linear.app/nxdev/issue/NXA-1195))
- Session endpoints ([NXA-1196](https://linear.app/nxdev/issue/NXA-1196))
- Repo and org referencer data management (backend) ([NXA-1194](https://linear.app/nxdev/issue/NXA-1194))
- Frontend authentication (public mode) ([NXA-1164](https://linear.app/nxdev/issue/NXA-1164))
- Add authentication strategies ([NXA-1187](https://linear.app/nxdev/issue/NXA-1187))
- Frontend error handling pipeline ([NXA-1178](https://linear.app/nxdev/issue/NXA-1178))
- New data models for polygraph UI ([NXA-1179](https://linear.app/nxdev/issue/NXA-1179))
- Add base layout to new UI — sidebar navigation ([NXA-1182](https://linear.app/nxdev/issue/NXA-1182))
- Move shared UI elements to a new shared lib ([NXA-1192](https://linear.app/nxdev/issue/NXA-1192))
- Move access control models and services up ([NXA-1208](https://linear.app/nxdev/issue/NXA-1208))
- Redo VCS organization access to match repository-workspace access ([NXA-1130](https://linear.app/nxdev/issue/NXA-1130))
- Add `source` to MongoUser vcsAccounts ([NXA-1191](https://linear.app/nxdev/issue/NXA-1191))
- Check on Nx API side ([NXA-1146](https://linear.app/nxdev/issue/NXA-1146))
- Update PR sync and close PRs to support other providers ([NXA-1099](https://linear.app/nxdev/issue/NXA-1099))
- Add support for opencode ([NXA-1097](https://linear.app/nxdev/issue/NXA-1097))
- Fix delegating tasks to child agents in completed sessions ([NXA-1168](https://linear.app/nxdev/issue/NXA-1168))
- Explore agent activity indicators for child agents ([NXA-1144](https://linear.app/nxdev/issue/NXA-1144))
- Benchmark for nx import ([NXA-984](https://linear.app/nxdev/issue/NXA-984))

### Infrastructure

- Add SA and IAM for Claude MCP (commit 25e5dcfa)
- Ensure group has MCP use IAM (commit 92addf75)
- Infra defs for new agents cluster (commit c998ed71)

### Linear (Cloud Team)

- Create Nx Cloud runner flow for claiming a workspace ([CLOUD-4254](https://linear.app/nxdev/issue/CLOUD-4254))
- Add Nx API endpoints for connect workspace CLI flow ([CLOUD-4253](https://linear.app/nxdev/issue/CLOUD-4253))

### Docs

- Track nx-dev server page views for AI traffic ([DOC-445](https://linear.app/nxdev/issue/DOC-445))
- Additional discovery mechanisms (llms.txt, robots.txt) ([DOC-390](https://linear.app/nxdev/issue/DOC-390))

---

## Self-Healing CI

### Cloud

- Self-Healing discovers and runs git hooks on proposed commit messages (2603.12.1)
- Allow users with allowed email domains to accept/reject/revert suggestions (2603.07.1)
- Fix styling of self-healing CI error alerts and model provider banner (2603.10.5)
- Fix invalid characters in task summary data affecting CIPE loading (2603.27.4)
- Prevent formatting hook from resolving prettier config outside workspace (2603.20.2)

### Infrastructure

- Enable self-healing CI for Cloudinary (commit c2feb083)

### Docs

- Merge self-healing auto-apply video PR ([DOC-440](https://linear.app/nxdev/issue/DOC-440))

---

## Security

### CLI

- bump minimatch to 10.2.1 to address CVE-2026-26996 ([#34509](https://github.com/nrwl/nx/pull/34509)) — 22.6.0
- address security CVE cluster (copy-webpack-plugin, koa, minimatch) ([#34708](https://github.com/nrwl/nx/pull/34708)) — 22.6.0
- add clickjacking protection headers to Netlify configs ([#34893](https://github.com/nrwl/nx/pull/34893)) — 22.6.0
- properly quote shell metacharacters in CLI args passed to tasks ([#34491](https://github.com/nrwl/nx/pull/34491)) — 22.6.1
- remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.6.0
- bump nuxt to 3.21.1 to resolve critical audit vulnerability ([#34783](https://github.com/nrwl/nx/pull/34783)) — 22.6.0

### Cloud (Linear)

- Vulnerability Report — Arbitrary URL as Org ([CLOUD-4356](https://linear.app/nxdev/issue/CLOUD-4356))
- Pentest: Rollbar Client Token Allows Error Report Injection ([CLOUD-4316](https://linear.app/nxdev/issue/CLOUD-4316))
- Pentest: Email Verification Not Enforced ([CLOUD-4310](https://linear.app/nxdev/issue/CLOUD-4310))
- Pentest: Unauthenticated Access to Workspace Achievements Endpoint ([CLOUD-4311](https://linear.app/nxdev/issue/CLOUD-4311))
- Frontend CRITICAL CVE-2025-15467 ([CLOUD-4351](https://linear.app/nxdev/issue/CLOUD-4351))

### Quokka

- Pentest: CI API Error Messages Expose Internal Class Names ([Q-253](https://linear.app/nxdev/issue/Q-253))

### Infrastructure

- Use SHAs in lighthouse GH workflows ([INF-1301](https://linear.app/nxdev/issue/INF-1301))
- Use SHAs in nx GH workflows ([INF-1300](https://linear.app/nxdev/issue/INF-1300))
- Use SHAs in nx-cloud-helm GH workflows ([INF-1298](https://linear.app/nxdev/issue/INF-1298))
- Use SHAs in nx-console GH workflows ([INF-1299](https://linear.app/nxdev/issue/INF-1299))
- Use SHAs in cloud-infrastructure GH workflows ([INF-1296](https://linear.app/nxdev/issue/INF-1296))
- Use SHAs for all remaining GH actions (commit cd5ac2c1)
- Move flipt metrics/debug routes off public (commit ab2b82b0)
- Remove /nx-cloud/private from prod (commit 448aab74)
- Update ingress to route /nx-cloud/private to BNF (commit cb4a040e)
- Admin push for tofu deny rules (commit d79fbf30)

### Docs

- Add frame protection headers to nx.dev Netlify configs ([DOC-449](https://linear.app/nxdev/issue/DOC-449))

---

## Telemetry & Analytics

### CLI

- add analytics ([#34144](https://github.com/nrwl/nx/pull/34144)) — 22.6.0
- persist analytics session ID across CLI invocations ([#34763](https://github.com/nrwl/nx/pull/34763)) — 22.6.0
- centralize perf tracking and report metrics to telemetry ([#34795](https://github.com/nrwl/nx/pull/34795)) — 22.6.0
- prompt for analytics preference during workspace creation ([#34818](https://github.com/nrwl/nx/pull/34818)) — 22.6.0
- add task and project count telemetry via performance lifecycle ([#34821](https://github.com/nrwl/nx/pull/34821)) — 22.6.0
- include command name on all telemetry events ([#34949](https://github.com/nrwl/nx/pull/34949)) — 22.6.2
- skip analytics prompt for cloud commands ([#34789](https://github.com/nrwl/nx/pull/34789)) — 22.6.0
- avoid overwhelming DB with connections during analytics init ([#34881](https://github.com/nrwl/nx/pull/34881)) — 22.6.0

### Cloud

- Workspace analytics CI pipeline execution durations chart with percentiles (2603.04.2)

### Linear (CLI)

- Flush events on Process.exit / handleErrors ([NXC-3800](https://linear.app/nxdev/issue/NXC-3800))
- Remove sensitive data from args before sending ([NXC-3889](https://linear.app/nxdev/issue/NXC-3889))
- Capture Project Graph Creation time and send event to GA ([NXC-3734](https://linear.app/nxdev/issue/NXC-3734))
- Capture Nx Command and send event to GA ([NXC-3733](https://linear.app/nxdev/issue/NXC-3733))
- Add configuration for opt-out of tracking ([NXC-3731](https://linear.app/nxdev/issue/NXC-3731))
- Add prompt during CNW + Nx invocation ([NXC-3732](https://linear.app/nxdev/issue/NXC-3732))
- Dogfood in ocean ([NXC-3695](https://linear.app/nxdev/issue/NXC-3695))
- Dogfood in nx ([NXC-3696](https://linear.app/nxdev/issue/NXC-3696))

### Quokka

- Record TTG daily stats for workspaces that had CIPEs ([Q-311](https://linear.app/nxdev/issue/Q-311))
- analytics.dailyProductUsage should persist ai credits, concurrent connections, contributors ([Q-315](https://linear.app/nxdev/issue/Q-315))
- Record project graph size when persisting into latestProjectGraphs ([Q-310](https://linear.app/nxdev/issue/Q-310))
- Collect info about team vs. free plan usage ([Q-290](https://linear.app/nxdev/issue/Q-290))
- Surface compute and AI credit counts to daily org + workspace audit ([Q-292](https://linear.app/nxdev/issue/Q-292))
- Make PostHog available in gradle projects ([Q-291](https://linear.app/nxdev/issue/Q-291))
- Port Remix PostHog models + functions to Kotlin shared lib ([Q-309](https://linear.app/nxdev/issue/Q-309))
- Track workspace claims and set up 6-week info gathering job ([Q-308](https://linear.app/nxdev/issue/Q-308))

### Infrastructure

- PostHog reverse proxy deployed (commits e4567168, fad70f26, 6fcfb06a, 55a7cd18)
- Grafana stack and space added to Spacelift (commits f278903a, 09b50dd0, f9c75155)
- Grafana resources enabled by default for enterprise AWS (commit 3f2c3d13)
- Monthly cost alert for Grafana (commit 30d33965)
- Public metrics scrape interval changed to hourly (commits 8328c163, 71569602)
- Metrics scraping switched to basic auth with public endpoint (commit 9cf1e023)

### Docs

- Documentation for telemetry ([DOC-446](https://linear.app/nxdev/issue/DOC-446))

---

## Onboarding & Cloud Conversion

### CLI

- add nxVersion to meta in shortUrl for cnw ([#34401](https://github.com/nrwl/nx/pull/34401)) — 22.6.0
- lock in CNW variant 2 with deferred connection ([#34416](https://github.com/nrwl/nx/pull/34416)) — 22.6.0
- add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580)) — 22.6.0
- bring back cloud prompts and templates in CNW ([#34887](https://github.com/nrwl/nx/pull/34887)) — 22.6.0
- restore CNW user flow to match v22.1.3 ([#34671](https://github.com/nrwl/nx/pull/34671)) — 22.6.0, 22.5.4
- auto-open browser for Cloud setup URL during create-nx-workspace ([#35014](https://github.com/nrwl/nx/pull/35014)) — 22.6.2
- preserve nxCloud=skip in non-interactive CNW mode ([#34616](https://github.com/nrwl/nx/pull/34616)) — 22.6.0
- add timeouts to GitHub push flow to prevent CLI hangs ([#35011](https://github.com/nrwl/nx/pull/35011)) — 22.6.2
- gracefully handle missing package manager and invalid workspace for CNW ([#34902](https://github.com/nrwl/nx/pull/34902)) — 22.6.0
- wrap CNW normalize args function in error handler ([#34905](https://github.com/nrwl/nx/pull/34905)) — 22.6.0

### Cloud

- Plan selection step in onboarding (2603.11.1)
- Show descriptive warnings for GitHub app configuration (2603.04.3)
- VCS organization access via access policies (2603.24.5)
- Added changelog link to app footer (2603.20.1)
- Refreshed verify email UI (2603.10.13)
- Fixed redirect after GitHub app install (2603.10.1)

### Linear (CLI)

- A/B test Cloud prompt copy ([NXC-4113](https://linear.app/nxdev/issue/NXC-4113))
- Reduce "push to github" errors ([NXC-4141](https://linear.app/nxdev/issue/NXC-4141))
- Auto-open browser on Cloud 'yes' ([NXC-4112](https://linear.app/nxdev/issue/NXC-4112))

### Linear (Cloud)

- Test Gitlab one-page onboarding flow on staging ([CLOUD-4196](https://linear.app/nxdev/issue/CLOUD-4196))
- Nx Cloud changelog setup ([CLOUD-4377](https://linear.app/nxdev/issue/CLOUD-4377))

### Quokka

- Enterprise usage page credit limit blocks ClickUp re-up ([Q-192](https://linear.app/nxdev/issue/Q-192))

### Docs

- Restore CNW CTA getting started pages ([DOC-448](https://linear.app/nxdev/issue/DOC-448))
- Review intro pages to improve init and CNW invocations ([DOC-447](https://linear.app/nxdev/issue/DOC-447))

### Infrastructure

- Enable workspace visibility env vars on dev, staging, prod (commits 0a24929d, a1c6c914, f5c949f7, 88c5878b, 03c8369c)

---

## Performance & Reliability

### CLI

- use jemalloc with tuned decay timers for native module ([#34444](https://github.com/nrwl/nx/pull/34444)) — 22.6.0
- use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.6.0
- retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.6.0
- prevent DB corruption from concurrent initialization ([#34861](https://github.com/nrwl/nx/pull/34861)) — 22.6.1
- use upsert to prevent FK constraint violations in task DB ([#34977](https://github.com/nrwl/nx/pull/34977)) — 22.6.2
- prevent TUI crash when task output arrives after completion ([#34785](https://github.com/nrwl/nx/pull/34785)) — 22.6.2
- prevent TUI panic when Nx Console is connected ([#34718](https://github.com/nrwl/nx/pull/34718)) — 22.6.0
- avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.6.0
- fix TUI help text layout ([#34754](https://github.com/nrwl/nx/pull/34754)) — 22.6.0
- use scroll-offset-based scrollbar positioning in TUI ([#34689](https://github.com/nrwl/nx/pull/34689)) — 22.6.2
- respect --parallel limit for discrete task concurrency ([#34721](https://github.com/nrwl/nx/pull/34721)) — 22.6.2
- skip stale recomputations and prevent lost file changes in daemon ([#34424](https://github.com/nrwl/nx/pull/34424)) — 22.6.0
- reduce terminal output duplication and allocations in task runner ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.6.0
- clean up stale socket files before listening ([#34236](https://github.com/nrwl/nx/pull/34236)) — 22.6.0
- skip workspace context setup when global bin hands off to local ([#34953](https://github.com/nrwl/nx/pull/34953)) — 22.6.2
- skip analytics and DB connection when global bin hands off to local ([#34914](https://github.com/nrwl/nx/pull/34914)) — 22.6.1
- avoid redundant project graph requests in ngcli adapter ([#34907](https://github.com/nrwl/nx/pull/34907)) — 22.6.1
- replace buggy ignore-files trie with correct path-component gitignore matching ([#34447](https://github.com/nrwl/nx/pull/34447)) — 22.6.0
- reject pending promises directly when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.6.0
- ensure workers shutdown after phase cancelled ([#34799](https://github.com/nrwl/nx/pull/34799)) — 22.6.0
- ensure postTasksExecution fires on SIGINT for continuous tasks ([#34876](https://github.com/nrwl/nx/pull/34876)) — 22.6.1
- use static_vcruntime to avoid msvcrt dependency ([#19781](https://github.com/nrwl/nx/pull/19781)) — 22.6.0
- migrate napi-rs v2 to v3 ([#34619](https://github.com/nrwl/nx/pull/34619)) — 22.6.0
- add safe plugin cache write utilities with LRU eviction ([#34503](https://github.com/nrwl/nx/pull/34503)) — 22.6.0
- skip writing deps cache if already up-to-date ([#34582](https://github.com/nrwl/nx/pull/34582)) — 22.6.0, 22.5.4
- use scoped cache key for unresolved npm imports in TargetProjectLocator ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.6.0
- handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.6.0
- prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.6.0
- commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.6.0

### Cloud

- Fixed YAML anchors/aliases parsing in distribution config files (2603.11.3)
- CIPE list branch filter stretches for long branch names (2603.06.7)
- Log UI search state reset when moving between logs (2603.07.2)
- Allow artifact download when run used read token (2603.24.6)

### Quokka

- WaitingAgents backed by Valkey ([Q-282](https://linear.app/nxdev/issue/Q-282))
- Assignment gaps in DTE due to WaitingAgents ([Q-319](https://linear.app/nxdev/issue/Q-319))
- protectedVERB variants should use raisingVERB behind the scenes ([Q-285](https://linear.app/nxdev/issue/Q-285))
- Investigate possible race condition in reconciling continuous tasks ([Q-284](https://linear.app/nxdev/issue/Q-284))
- Conformance notifications do not send on ST ([Q-274](https://linear.app/nxdev/issue/Q-274))
- Migrate prometheus handlers to use service account auth ([Q-268](https://linear.app/nxdev/issue/Q-268))

### Linear (Cloud)

- Allow passing working directory to start-ci-run command ([CLOUD-2540](https://linear.app/nxdev/issue/CLOUD-2540))
- Map status code 2 to failed in CIPE run list ([CLOUD-4390](https://linear.app/nxdev/issue/CLOUD-4390))
- Simplify e2e auth by avoiding Auth0 in CI ([CLOUD-4270](https://linear.app/nxdev/issue/CLOUD-4270))
- Nx Graph grouped mode expand shows empty folder view ([CLOUD-4348](https://linear.app/nxdev/issue/CLOUD-4348))
- Agent utilization view shows wrong/missing hung tasks ([CLOUD-4259](https://linear.app/nxdev/issue/CLOUD-4259))

---

## Infrastructure & Platform Operations

### Gateway API Migration

- Gateway API helm chart added (commit 4ea56524)
- Gateway API infrastructure prep for GCP enterprise (commit f144a73b)
- GatewayAPI CRDs enabled for single-tenants by flag (commit 8a9af832)
- GatewayAPI CHANNEL_STANDARD for all GCP clusters (commit b2e43bd0)
- Gateway API in dev, staging, prod (commits a078ec82, 0a5b7a4e, c277bdf9, b0e843f2)
- External-DNS for dev polygraph DNS (commit 373afa4b)
- Remove cert-manager from dev/staging (commit 22990741)
- Cleanup dev/staging gateway resources (commit 40f143c6)
- Correct Gateway config (commit 661659ef)
- Future plans for Gateway API documented (commit d1e9b57e)
- Related Linear: AWS & Azure Gateway API investigation ([INF-1252](https://linear.app/nxdev/issue/INF-1252)), Prep Infra to use Gateway API ([INF-1270](https://linear.app/nxdev/issue/INF-1270))

### Multi-Cluster Agents / Facade

- Initial facade deployment (commit ba058e0a)
- Facade Infrastructure & Helm Deployment ([INF-1148](https://linear.app/nxdev/issue/INF-1148))
- Gateway routes to facade (commit d5d9af92)
- Point frontend and API at facade (commit 50945007)
- Fix internal domain, IAM, service name (commits 6786b2fc, 9bef0b54, 3e21ba5d)
- Make second downstream for dev ([INF-1295](https://linear.app/nxdev/issue/INF-1295))
- Turn on downstream mode for dev wf controller (commit 8493eafd)
- Infra defs for new agents cluster (commit c998ed71)

### PrivateLink

- AWS PrivateLink docs/pricing research ([INF-1288](https://linear.app/nxdev/issue/INF-1288))
- Estimate PrivateLink costs for ST environments ([INF-1290](https://linear.app/nxdev/issue/INF-1290))
- Research similar services in GCP/Azure ([INF-1291](https://linear.app/nxdev/issue/INF-1291))
- Create doc for PrivateLink setup ([INF-1289](https://linear.app/nxdev/issue/INF-1289))
- PrivateLink architecture image added (commit 34aa8002)

### Polygraph Infrastructure

- Polygraph managed zone (commit 7edfc2e0)
- Polygraph secrets (commits dd423abe, c7c18eea, 004dbcb7, 0ccc38d3, 4dee47b2, ec0c1086, d7f7bac0)
- Polygraph deployment, ingress, cert, service (commit 6bf5c27f)
- Image updater for polygraph (commit af7ce8c5)

### Enterprise Customer Configs

- Caseware: SCIM token, access control, SAML secrets, GitHub vars, Lighthouse rotation (commits 7e7ae606, afb7430c, 575f80b5, e82ad47d, da7aab80, c6fbdcbf)
- CIBC: SAML env vars (commit e158bf25)
- Legora: SAML env vars, missing API/env vars, sandboxing, AppSet (commits d2e375e4, 8bf21263, f62fc54e, f47e1472, b70351fd)
- SCIM provisioning for Legora (commit 3d5150d0)
- Mimecast: AI env vars (commit af22e452)
- Anaplan: missing agent env vars (commit 34b69fdd)
- ClickUp: IO tracing deployed (commit 9105d886)
- Cloudinary: Self-healing CI enabled (commit c2feb083)
- GitLab flow enabled on US managed (commit 0004550e)

### Secrets & IAM

- Split app secrets in dev, staging, prod (commits 4abe5624, bc522624, 1825e0dc)
- KVS env vars migration across environments (commits 310a4f0f, 403ff300, 7329d307)
- Remove redundant secret keys (commit e7c06ce6)
- Shared secrets and internal-tls workspace (commit babf52e0)
- Jack added to prod db password readers (commit 3d20ed7c)
- IAM user permissions for AWS accounts automated (commit d0976489)

### Observability

- Grafana stack added to Spacelift (commit f278903a)
- Grafana space added to GCP IAM (commit f9c75155)
- Monthly cost alert for Grafana (commit 30d33965)
- PostHog reverse proxy for staging and prod NA (commits e4567168, 55a7cd18)
- Internal service account provisioning on snapshot (commit 36b0b63d)
- Public metrics scraping switched to basic auth + hourly intervals (commits 9cf1e023, 8328c163)

### Other

- Tofu plan daily cronjob (commit 993fc47c)
- Azure redis redux for aztester (commit 5386e9e9)
- Rollback only remix on prod-na (commit 312ad980)
- npm cache nginx config update (commit 2f25980f)
- Hash TTL for artifacts matched on snapshot (commit 0e11d8c4)

---

## JVM Ecosystem (Gradle & Maven)

### CLI

- add preferBatch executor option ([#34293](https://github.com/nrwl/nx/pull/34293)) — 22.6.0
- add properties and wrappers to inputs ([#34778](https://github.com/nrwl/nx/pull/34778)) — 22.6.0
- ensure atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.6.0
- use globs for dependent task output files ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.6.0
- tee batch runner output to stderr for terminal display ([#34630](https://github.com/nrwl/nx/pull/34630)) — 22.6.0, 22.5.4
- use object format for dependsOn instead of shorthand strings ([#34715](https://github.com/nrwl/nx/pull/34715)) — 22.6.0
- exclude non-JS gradle sub-projects from eslint plugin ([#34735](https://github.com/nrwl/nx/pull/34735)) — 22.6.0
- ci test target depends on take overrides into account ([#34777](https://github.com/nrwl/nx/pull/34777)) — 22.6.0
- handle project names containing .json substring ([#34832](https://github.com/nrwl/nx/pull/34832)) — 22.6.0
- always check disk cache for gradle project graph reports ([#34873](https://github.com/nrwl/nx/pull/34873)) — 22.6.0
- ignore test enums when atomizing ([#34974](https://github.com/nrwl/nx/pull/34974)) — 22.6.2
- remove annotations from atomizer ([#34871](https://github.com/nrwl/nx/pull/34871)) — 22.6.1
- report external Maven dependencies in project graph ([#34368](https://github.com/nrwl/nx/pull/34368)) — 22.6.0
- correctly map between maven locators and nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.6.0
- write output after each task in batch mode for correct caching ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.6.0
- fix pom file without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.6.0
- synchronize batch runner invoke() to prevent concurrent access ([#34600](https://github.com/nrwl/nx/pull/34600)) — 22.6.0, 22.5.4
- use mutable lists for Maven session projects ([#34834](https://github.com/nrwl/nx/pull/34834)) — 22.6.0

### Linear (CLI)

- Add timeout for Gradle plugin invoking Gradle ([NXC-4140](https://linear.app/nxdev/issue/NXC-4140))
- Gradle: atomizer includes test files with no tests ([NXC-4050](https://linear.app/nxdev/issue/NXC-4050))
- Ensure regex parsing ignores enums ([NXC-4133](https://linear.app/nxdev/issue/NXC-4133))
- Unblock Ocean with excludesDependsOn ([NXC-4071](https://linear.app/nxdev/issue/NXC-4071))
- Fix exclude depends on in batch mode ([NXC-4070](https://linear.app/nxdev/issue/NXC-4070))
- Skip Gradle invocation in Ocean when unnecessary ([NXC-4055](https://linear.app/nxdev/issue/NXC-4055))
- Implicit dependencies using project.json name not detected ([NXC-4034](https://linear.app/nxdev/issue/NXC-4034))
- Atomized depends-on targets ignore target name override ([NXC-4056](https://linear.app/nxdev/issue/NXC-4056))
- Remove custom Nx project name overrides in nx repo ([NXC-3829](https://linear.app/nxdev/issue/NXC-3829))
- Reconcile Gradle plugin inferred dependsOn with renamed projects ([NXC-3828](https://linear.app/nxdev/issue/NXC-3828))
- Logs not showing up in agents ([NXC-3989](https://linear.app/nxdev/issue/NXC-3989))
- testCompile inputs for test sources ([NXC-3954](https://linear.app/nxdev/issue/NXC-3954))
- Maven caching bug in batch mode v4 e2e test ([NXC-3888](https://linear.app/nxdev/issue/NXC-3888))

### Quokka

- Ensure version catalog changes invalidate gradle project graph cache ([Q-294](https://linear.app/nxdev/issue/Q-294))

### Docs

- Clarify what "batch mode" means in docs ([DOC-420](https://linear.app/nxdev/issue/DOC-420))

---

## Framework & Ecosystem Support

### CLI

- add support for Angular v21.2 ([#34592](https://github.com/nrwl/nx/pull/34592)) — 22.6.0
- support eslint v10 ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.6.0
- add support for Vite 8 ([#34850](https://github.com/nrwl/nx/pull/34850)) — 22.6.2
- pin vitest v4 to ~4.0.x to fix Yarn Classic resolution ([#34878](https://github.com/nrwl/nx/pull/34878)) — 22.6.0
- add yarn berry catalog support ([#34552](https://github.com/nrwl/nx/pull/34552)) — 22.6.0
- resolve false positive loop detection when running with Bun ([#34640](https://github.com/nrwl/nx/pull/34640)) — 22.6.0, 22.5.4
- support bun-only environments in release-publish executor ([#34835](https://github.com/nrwl/nx/pull/34835)) — 22.6.0
- enable ESM output for Angular rspack MF plugin ([#34839](https://github.com/nrwl/nx/pull/34839)) — 22.6.2
- add negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160)) — 22.6.0
- allow wildcards paths in enforce-module-boundaries rule ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.6.0
- detect require() calls in enforce-module-boundaries ([#34896](https://github.com/nrwl/nx/pull/34896)) — 22.6.1
- add catalog: references when fixing missing dependencies ([#34734](https://github.com/nrwl/nx/pull/34734)) — 22.6.0
- support configurable typecheck config name ([#34675](https://github.com/nrwl/nx/pull/34675)) — 22.6.0
- add deps-sync generator ([#34407](https://github.com/nrwl/nx/pull/34407)) — 22.6.0
- add --otp to top-level nx release command and detect EOTP errors ([#34473](https://github.com/nrwl/nx/pull/34473)) — 22.6.0
- add --stdin to affected options ([#34435](https://github.com/nrwl/nx/pull/34435)) — 22.6.0
- add cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.6.0
- use caret range for swc dependencies in pnpm catalog ([#34487](https://github.com/nrwl/nx/pull/34487)) — 22.6.0
- strip catalogs from pruned pnpm lockfile ([#34697](https://github.com/nrwl/nx/pull/34697)) — 22.6.0
- add NX_SKIP_FORMAT environment variable ([#34336](https://github.com/nrwl/nx/pull/34336)) — 22.6.0
- prevent double install in generators for TS solution workspaces ([#34891](https://github.com/nrwl/nx/pull/34891)) — 22.6.2
- add startTime and endTime to TaskResult interface ([#34996](https://github.com/nrwl/nx/pull/34996)) — 22.6.2
- add --json flag for better AX to nx list ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.6.0
- make watch command work with all and initialRun specified ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.6.0
- handle owners and conformance project refs on move/remove ([#34815](https://github.com/nrwl/nx/pull/34815)) — 22.6.2

### Linear

- Unit tests fail when bumping to Vite 8 beta.5 ([NXC-4152](https://linear.app/nxdev/issue/NXC-4152))
- Add Vite 8 ([NXC-4094](https://linear.app/nxdev/issue/NXC-4094))
- Pin vite for nightly failure root cause ([NXC-4090](https://linear.app/nxdev/issue/NXC-4090))
- Vitest plugin isn't added to plugins array ([NXC-4138](https://linear.app/nxdev/issue/NXC-4138))
- Lint plugin performance improvement suggestion ([NXC-4010](https://linear.app/nxdev/issue/NXC-4010))
- ESLint deps rule should add catalog: for missing deps ([NXC-4040](https://linear.app/nxdev/issue/NXC-4040))
- Share Cache between worktrees ([NXC-4137](https://linear.app/nxdev/issue/NXC-4137))

---

## Docs & Developer Experience

### Docs (Linear)

- Create smaller, more focused tutorials ([DOC-452](https://linear.app/nxdev/issue/DOC-452))
- Quality check on search results ([DOC-408](https://linear.app/nxdev/issue/DOC-408))
- Writing style "linting" ([DOC-393](https://linear.app/nxdev/issue/DOC-393))
- Blog search missing Enterprise Task Analytics article ([DOC-430](https://linear.app/nxdev/issue/DOC-430))
- Blog shell block rendering missing bar at top ([DOC-458](https://linear.app/nxdev/issue/DOC-458))
- Make Astro webinar banner close button visible ([DOC-457](https://linear.app/nxdev/issue/DOC-457))
- Document skipped Netlify checks showing as red ([DOC-454](https://linear.app/nxdev/issue/DOC-454))
- Update outdated Angular multiple-workspace migration doc ([DOC-419](https://linear.app/nxdev/issue/DOC-419))
- Clarify supported Storybook versions in Nx docs ([DOC-422](https://linear.app/nxdev/issue/DOC-422))
- Document Docker Layer Caching ([DOC-344](https://linear.app/nxdev/issue/DOC-344))
- Clean up outdated version references in docs (< Nx 20) ([DOC-437](https://linear.app/nxdev/issue/DOC-437))
- Update docs to use the latest image tag ([DOC-441](https://linear.app/nxdev/issue/DOC-441))
- Next.js build fails: Cannot find package 'ai' for /ai-chat ([DOC-418](https://linear.app/nxdev/issue/DOC-418))
- nx.dev/changelog returns internal server error ([DOC-450](https://linear.app/nxdev/issue/DOC-450))
- nx.dev pages 404 on hard reload ([DOC-444](https://linear.app/nxdev/issue/DOC-444))
- Fix redirect for /concepts/decisions/dependency-management ([DOC-439](https://linear.app/nxdev/issue/DOC-439))
- Fix broken OSS cloud pricing redirect ([DOC-442](https://linear.app/nxdev/issue/DOC-442))
- /docs redirect returns 404 after cleanup changes ([DOC-435](https://linear.app/nxdev/issue/DOC-435))
- Docs images broken after rewrite changes ([DOC-436](https://linear.app/nxdev/issue/DOC-436))
- Investigate why internal link checker isn't running in PRs ([DOC-424](https://linear.app/nxdev/issue/DOC-424))
- Clean-up for pages in Framer instead of Next.js ([DOC-431](https://linear.app/nxdev/issue/DOC-431))
- Review all CLI and Cloud links ([DOC-428](https://linear.app/nxdev/issue/DOC-428))
- Add Cmd+K redirect from nx.dev to /docs ([DOC-432](https://linear.app/nxdev/issue/DOC-432))

### CLI (nx-dev)

- improve plugin registry visibility ([#34395](https://github.com/nrwl/nx/pull/34395)) — 22.6.0
- add missing nx-cloud intro in sidebar ([#34403](https://github.com/nrwl/nx/pull/34403)) — 22.6.0
- clarify project linking for workspaces ([#34405](https://github.com/nrwl/nx/pull/34405)) — 22.6.0
- use shared preview url for netlify deploy ([#34467](https://github.com/nrwl/nx/pull/34467)) — 22.6.0
- widen search dialog ([#34504](https://github.com/nrwl/nx/pull/34504)) — 22.6.0
- update breadcrumb links to match sidebar ([#34500](https://github.com/nrwl/nx/pull/34500)) — 22.6.0
- correct interpolate sub command for cli reference ([#34585](https://github.com/nrwl/nx/pull/34585)) — 22.6.0
- move redirects from Next.js config to Netlify _redirects ([#34612](https://github.com/nrwl/nx/pull/34612)) — 22.6.0
- adding missing legacy route redirects ([#34772](https://github.com/nrwl/nx/pull/34772)) — 22.6.0
- remove nx-cloud paths from Framer excluded URL rewrites ([#34852](https://github.com/nrwl/nx/pull/34852)) — 22.6.0
- cross site link checks working as expected ([#34685](https://github.com/nrwl/nx/pull/34685)) — 22.6.0
- resolve changelog page 500 error ([#34920](https://github.com/nrwl/nx/pull/34920)) — 22.6.1
- build nx-dev in-place to fix ai package resolution ([#34730](https://github.com/nrwl/nx/pull/34730)) — 22.6.2
- improve docs search ranking and metrics ([#34992](https://github.com/nrwl/nx/pull/34992)) — 22.6.2
- add YouTube channel callout to courses page ([#34669](https://github.com/nrwl/nx/pull/34669)) — 22.6.0
- boost CLI command reference search ranking ([#34625](https://github.com/nrwl/nx/pull/34625)) — 22.6.0, 22.5.4
- fix broken nx.dev redirects and remove legacy redirect-rules files ([#34673](https://github.com/nrwl/nx/pull/34673)) — 22.6.0, 22.5.4
- rewrite Framer URLs to nx.dev in HTML responses ([#34445](https://github.com/nrwl/nx/pull/34445)) — 22.6.0
- exclude .netlify paths from Framer proxy edge function ([#34703](https://github.com/nrwl/nx/pull/34703)) — 22.6.0

---

## Linear Project Status

### Active

| Project | Lead | Teams | Link |
| ------- | ---- | ----- | ---- |
| Task Sandboxing (Input/Output Tracing) | Rares | NXC, Q | [View](https://linear.app/nxdev/project/task-sandboxing-input-output-tracing-076118aa) |
| CLI Agentic Experience (AX) | Max | NXA, CLOUD | [View](https://linear.app/nxdev/project/cli-agentic-experience-ax) |
| Polygraph Standalone | James | NXA | [View](https://linear.app/nxdev/project/polygraph-standalone-6be56f3a) |
| CNW/Init Funnel & Cloud Conversion Optimization | Jack | NXC, DOC | [View](https://linear.app/nxdev/project/cnw-init-funnel-cloud-conversion-optimization-6eba5b6b) |
| Gradle Plugin for Nx | Louie | NXC, Q | [View](https://linear.app/nxdev/project/gradle-plugin-for-nx-736af1e2) |
| Surface Level Telemetry | Colum | NXC | [View](https://linear.app/nxdev/project/surface-level-telemetry-47cb8ed2) |
| Onboarding Enablement | Altan | Q | [View](https://linear.app/nxdev/project/onboarding-enablement-5e166a83) |
| K8S Gateway API + L7 Load Balancing | Patrick | INF | [View](https://linear.app/nxdev/project/k8s-gateway-api-l7-load-balancing) |
| Implement Multi-Cluster Agent Setups | Steve | INF | [View](https://linear.app/nxdev/project/implement-multi-cluster-agent-setups) |
| PrivateLink Service (from our side) | Szymon | INF | [View](https://linear.app/nxdev/project/privatelink-service-from-our-side-7e3aacd9) |
| Sec - Ensure all GH action usage pins to SHA | Szymon | INF | [View](https://linear.app/nxdev/project/sec-ensure-all-gh-action-usage-at-least-pins-to-sha-5bfd52ef) |
| Enterprise Analytics API Cleanup | Altan | Q | [View](https://linear.app/nxdev/project/enterprise-analytics-api-cleanup-5df9eda5) |
| Evaluate product analytics tools | Nicole | CLOUD | [View](https://linear.app/nxdev/project/evaluate-product-analytics-tools) |
| Feature demos | Nicole | CLOUD | [View](https://linear.app/nxdev/project/feature-demos) |
| One-page "connect workspace" flow | Nicole | CLOUD | [View](https://linear.app/nxdev/project/one-page-connect-workspace-flow) |
| Nx Cloud changelog | Nicole | CLOUD | [View](https://linear.app/nxdev/project/nx-cloud-changelog) |
| Content and Structure Improvements | Jack | DOC | [View](https://linear.app/nxdev/project/content-and-structure-improvements-ff4626da) |
| Major Version Deprecations | Jack | NXC | [View](https://linear.app/nxdev/project/major-version-deprecations) |
| Improve AI discovery of markdown content | Jack | DOC | [View](https://linear.app/nxdev/project/improve-ai-discovery-of-markdown-content-d7468dfa) |
| Continuous assignment of tasks | Altan | Q | [View](https://linear.app/nxdev/project/continuous-assignment-of-tasks-9cef9488) |
| Nx-api Iterative Improvements | Altan | Q | [View](https://linear.app/nxdev/project/nx-api-iterative-improvements-4b8ea3c1) |
| Improve Worktrees Support | Jason | NXC | [View](https://linear.app/nxdev/project/improve-worktrees-support) |
| Nx Local Dist Migration | Jason | NXC | [View](https://linear.app/nxdev/project/nx-local-dist-migration) |
| Nx Graph | Chau | CLOUD | [View](https://linear.app/nxdev/project/nx-graph) |

### Issues Completed: ~250+ across 6 teams

NXC ~100 · CLOUD ~41 · INF ~88 · NXA ~50 · Q ~38 · DOC ~33

_Generated on 2026-03-27._
