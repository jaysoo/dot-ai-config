# Nx Platform Changelog — February 2026

> **Sources:** Nx CLI GitHub releases, Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear.

---

## Task Sandboxing & IO Tracing

### CLI

- Add initial impl of task IO service ([#34205](https://github.com/nrwl/nx/pull/34205)) — 22.5.0
- Handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.5.1
- Extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.5.1
- Add `--outputs` and `--check-output` flags to `nx show target` ([NXC-3764](https://linear.app/nrwl/issue/NXC-3764))
- Add `--inputs` and `--check-input` flags to `nx show target` ([NXC-3763](https://linear.app/nrwl/issue/NXC-3763))
- Enhance `nx show target` with inputs/outputs inspection ([NXC-3762](https://linear.app/nrwl/issue/NXC-3762))
- Expand hash inputs in TaskIOService for cloud consumption ([NXC-3761](https://linear.app/nrwl/issue/NXC-3761))
- NX CLI PID Listeners for IO tracing ([NXC-3728](https://linear.app/nrwl/issue/NXC-3728))
- Change sandbox setup to use DaemonClient.enabled isIsolatedPlugin ([NXC-3892](https://linear.app/nrwl/issue/NXC-3892))
- Filter non-cacheable and continuous tasks from sandbox violations ([NXC-3951](https://linear.app/nrwl/issue/NXC-3951))
- Have CLI command to report inputs/outputs ([NXC-3740](https://linear.app/nrwl/issue/NXC-3740))
- Upload raw task file to GCloud bucket ([NXC-3839](https://linear.app/nrwl/issue/NXC-3839))
- Output files relative to workspace dir ([NXC-3844](https://linear.app/nrwl/issue/NXC-3844))
- Fix run-commands multiple PID handling ([NXC-3907](https://linear.app/nrwl/issue/NXC-3907))
- Ignore certain files from analysis (node_modules, outside workspace) ([NXC-3826](https://linear.app/nrwl/issue/NXC-3826))
- Only listen for file events in workspace directory ([NXC-3837](https://linear.app/nrwl/issue/NXC-3837))
- Fix cloud runner missing outputs from multiple run-commands ([NXC-3897](https://linear.app/nrwl/issue/NXC-3897))
- Traced task missing filesWritten for tar.gz from run-commands ([NXC-3863](https://linear.app/nrwl/issue/NXC-3863))
- Not all file reads/writes captured ([NXC-3835](https://linear.app/nrwl/issue/NXC-3835))
- Daemon does not detect all tasks ([NXC-3841](https://linear.app/nrwl/issue/NXC-3841))
- Outputs empty on CI ([NXC-3834](https://linear.app/nrwl/issue/NXC-3834))
- Check multiple PID event emissions ([NXC-3827](https://linear.app/nrwl/issue/NXC-3827))
- Dogfood in Nx and Ocean ([NXC-3658](https://linear.app/nrwl/issue/NXC-3658), [NXC-3659](https://linear.app/nrwl/issue/NXC-3659))

### Cloud

- Add API endpoint to support persisting IO tracing reports from Nx Agents (2602.12.11)
- UI Anomaly Display ([Q-127](https://linear.app/nrwl/issue/Q-127))
- Task list view with warning indicators for trace issues ([Q-208](https://linear.app/nrwl/issue/Q-208))
- Create IO trace analysis section in task details ([Q-209](https://linear.app/nrwl/issue/Q-209))
- Show sandbox violation banner for WARNING mode ([Q-207](https://linear.app/nrwl/issue/Q-207))
- Strict mode toggle UI ([Q-187](https://linear.app/nrwl/issue/Q-187))
- Strict mode violations fail DTE ([Q-188](https://linear.app/nrwl/issue/Q-188))
- Anomaly report log API endpoint ([Q-193](https://linear.app/nrwl/issue/Q-193))
- nx-api anomaly endpoint ([Q-126](https://linear.app/nrwl/issue/Q-126))
- Virtualized file tree views ([Q-248](https://linear.app/nrwl/issue/Q-248))
- Download raw report button ([Q-215](https://linear.app/nrwl/issue/Q-215))
- Display process command in UI ([Q-257](https://linear.app/nrwl/issue/Q-257))
- Expose PID and command for file read/write ([Q-246](https://linear.app/nrwl/issue/Q-246))
- Add missed read/writes to Mongo stats ([Q-228](https://linear.app/nrwl/issue/Q-228))
- Avoid showing sandbox UI if no report present ([Q-229](https://linear.app/nrwl/issue/Q-229))
- Ensure sandbox reports evicted at same lifetime as runs ([Q-204](https://linear.app/nrwl/issue/Q-204))
- nx-cloud runner creates unique ID in marker file ([Q-186](https://linear.app/nrwl/issue/Q-186))
- Skip generating signal file for cache hits, non-cacheable, continuous tasks ([Q-241](https://linear.app/nrwl/issue/Q-241))
- Update Nx client to use `nx-io-trace-` filename prefix ([Q-151](https://linear.app/nrwl/issue/Q-151))
- Container PID → Host PID mapping ([Q-81](https://linear.app/nrwl/issue/Q-81))
- Signal file detection + basic task creation ([Q-80](https://linear.app/nrwl/issue/Q-80))
- Task tracker + IO buffer ([Q-82](https://linear.app/nrwl/issue/Q-82))
- Task completion + deduplication + JSON output ([Q-84](https://linear.app/nrwl/issue/Q-84))
- Filter out reads from outside workspace root ([Q-256](https://linear.app/nrwl/issue/Q-256))
- Investigate OOMKills on daemon pod ([Q-195](https://linear.app/nrwl/issue/Q-195))
- Daemon over-sending task completion reports ([Q-232](https://linear.app/nrwl/issue/Q-232))
- Internal server error 500 on daemon ([Q-235](https://linear.app/nrwl/issue/Q-235))
- Missing raw file when sandbox report exists ([Q-233](https://linear.app/nrwl/issue/Q-233))
- Activate tracing in Ocean ([Q-196](https://linear.app/nrwl/issue/Q-196))
- Activate signal file creation on nx repo ([Q-245](https://linear.app/nrwl/issue/Q-245))
- Enable sandboxing env vars on staging ([Q-244](https://linear.app/nrwl/issue/Q-244))
- Deploy IO trace daemon to snapshot via Kustomize ([Q-114](https://linear.app/nrwl/issue/Q-114))

### Infrastructure

- Enable io-trace-daemon on staging (INF-1215)
- Add io-tracing SA + IAM Member for workflows bucket to all environments ([INF-1207](https://linear.app/nrwl/issue/INF-1207))
- Create and attach new SA for io-trace-daemon ([INF-1188](https://linear.app/nrwl/issue/INF-1188))
- Add io-tracing infra to staging, prod, GCP/AWS single-tenants
- Create internal Helm chart for io-tracing
- Increase io-trace-daemon ringbuf size and memory
- Enable io tracing signal files on snapshot
- Add io-trace-daemon ECR repo for AWS

---

## Self-Healing CI

### Cloud

- In-app setup for BitBucket and Azure DevOps workspaces (2602.02.4)
- Self-healing CI recommendations for auto-apply (2602.03.2)
- Detailed failure reasons in Technical Details for admins (2602.12.5)
- Remove experimental badge from AI features (2602.18.3)
- Auto-apply fixes configuration notifications (2602.19.6)
- Self-healing CI setup during onboarding (2602.26.2)

### CLI

- Add passthrough for `nx-cloud apply-locally` command ([#34557](https://github.com/nrwl/nx/pull/34557)) — 22.5.3

### Linear (NXA)

- Add retry on latest commit for self-healing ([NXA-946](https://linear.app/nrwl/issue/NXA-946))
- Surface self-healing logs in CIPE UI ([NXA-892](https://linear.app/nrwl/issue/NXA-892))
- Adjust "too many unapplied fixes" logic ([NXA-1002](https://linear.app/nrwl/issue/NXA-1002))
- Fix self-healing "too many unapplied fixes" link loops ([NXA-945](https://linear.app/nrwl/issue/NXA-945))
- Passthrough for `nx-cloud apply-locally` to `nx` ([NXA-1001](https://linear.app/nrwl/issue/NXA-1001))
- Add BitBucket and Azure support to setup dialog ([NXA-776](https://linear.app/nrwl/issue/NXA-776))
- Add self-healing indicators to workspace/org dashboards ([NXA-870](https://linear.app/nrwl/issue/NXA-870))
- Expose auto-apply recommendations UI ([NXA-889](https://linear.app/nrwl/issue/NXA-889))
- Ensure GitLab experience is good ([NXA-854](https://linear.app/nrwl/issue/NXA-854))
- Add audit logging for config changes ([NXA-855](https://linear.app/nrwl/issue/NXA-855))
- Increase fix timeout to 90 minutes ([NXA-884](https://linear.app/nrwl/issue/NXA-884))
- Make custom hook logger available on all fixes ([NXA-883](https://linear.app/nrwl/issue/NXA-883))
- Refactor self-healing flow to handle code changes separately ([NXA-718](https://linear.app/nrwl/issue/NXA-718))
- Add previously accepted/rejected fixes as context ([NXA-518](https://linear.app/nrwl/issue/NXA-518))
- Non-code-change context applied locally ([NXA-702](https://linear.app/nrwl/issue/NXA-702))
- Associate launch template with remote task for agent fixes ([NXA-821](https://linear.app/nrwl/issue/NXA-821))
- Internal AI credits reporting ([NXA-868](https://linear.app/nrwl/issue/NXA-868))
- Track custom ANTHROPIC_API_KEY usage ([NXA-872](https://linear.app/nrwl/issue/NXA-872))
- Ensure obfuscated client bundle not written to agent logs ([NXA-873](https://linear.app/nrwl/issue/NXA-873))
- Combine warnings into single block on GH comment ([NXA-866](https://linear.app/nrwl/issue/NXA-866))
- Adjust BitBucket self-healing comment ([NXA-837](https://linear.app/nrwl/issue/NXA-837))
- Fix verification tasks showing as failing ([NXA-867](https://linear.app/nrwl/issue/NXA-867))
- Fix apply failure due to serialization error ([NXA-928](https://linear.app/nrwl/issue/NXA-928))
- Fix comment state after applying fix ([NXA-728](https://linear.app/nrwl/issue/NXA-728))
- Fix "applied automatically" comment not posted ([NXA-877](https://linear.app/nrwl/issue/NXA-877))
- Enhance git command failure messages ([NXA-933](https://linear.app/nrwl/issue/NXA-933))
- Improve MailChimp error logging, fix git diff failures ([NXA-882](https://linear.app/nrwl/issue/NXA-882))
- Fix Emeria apply issues ([NXA-819](https://linear.app/nrwl/issue/NXA-819))
- Self-serve adoption data ([NXA-941](https://linear.app/nrwl/issue/NXA-941))
- System OS-level notifications for CIPE fixes ([NXA-321](https://linear.app/nrwl/issue/NXA-321))
- Distribution of inspirationMetadata for dashboard ([NXA-754](https://linear.app/nrwl/issue/NXA-754))
- Use different models with evals (Ollama/OpenRouter) ([NXA-856](https://linear.app/nrwl/issue/NXA-856))
- Spike Ollama/OpenRouter with Claude Code ([NXA-822](https://linear.app/nrwl/issue/NXA-822))
- Ralph Mode — automated CIPE monitoring & fix application ([NXA-791](https://linear.app/nrwl/issue/NXA-791))
- Fix occasional `git merge-base` failures for BitBucket ([NXA-964](https://linear.app/nrwl/issue/NXA-964))

---

## AI-Powered Development / Agentic Experience (AX)

### CLI

- Improve configure-ai-agents to copy skills/subagents/plugins ([#34176](https://github.com/nrwl/nx/pull/34176)) — 22.5.0
- Improve AI agent rules for CLAUDE.md generation ([#34304](https://github.com/nrwl/nx/pull/34304)) — 22.5.0
- Add AI agent detection and NDJSON output for CNW ([#34320](https://github.com/nrwl/nx/pull/34320)) — 22.5.0
- Update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.5.1
- Update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.5.1
- Make sure MCP args aren't overridden in configure-ai-agents ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.5.1
- Tweak configure-ai-agents messaging ([#34307](https://github.com/nrwl/nx/pull/34307)) — 22.5.0
- Handle Ctrl+C gracefully in configure-ai-agents — 22.5.2
- Only pull configure-ai-agents from latest if local version is not latest ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.5.2
- Preserve existing source properties in Claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.5.3
- Add `--json` flag for AX to `nx list` ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.5.3
- Add command to download cloud client ([#34333](https://github.com/nrwl/nx/pull/34333)) — 22.5.0
- Add `llms-full.txt` and HTTP Link headers for LLM discovery ([#34232](https://github.com/nrwl/nx/pull/34232)) — 22.5.0

### Linear (NXC)

- Enhance `nx list <plugin>` with paths and JSON output ([NXC-3809](https://linear.app/nrwl/issue/NXC-3809))
- Improve CLI output for configure-ai-agents skills setup ([NXC-3791](https://linear.app/nrwl/issue/NXC-3791))
- Update PLUGIN.md for Gradle for test verification ([NXC-3843](https://linear.app/nrwl/issue/NXC-3843))
- Handle `--no-interactive` flag better in Nx CLI ([NXC-3774](https://linear.app/nrwl/issue/NXC-3774))
- Collect benchmark data for MCP blog post ([NXC-3792](https://linear.app/nrwl/issue/NXC-3792))
- Set up CNW benchmarks for AX ([NXC-3830](https://linear.app/nrwl/issue/NXC-3830))
- Project graph fails when plugin isolation off ([NXC-3971](https://linear.app/nrwl/issue/NXC-3971))

### Linear (NXA) — Agentic Experience

- Agent tries to commit/push after applying self-healing fix ([NXA-983](https://linear.app/nrwl/issue/NXA-983))
- Create doc showing what Claude does better and worse ([NXA-1035](https://linear.app/nrwl/issue/NXA-1035))
- Build mechanism to show configure-ai-agents is outdated ([NXA-943](https://linear.app/nrwl/issue/NXA-943))
- Auto-create agent config for executing agent ([NXA-1005](https://linear.app/nrwl/issue/NXA-1005))
- Write blog post for skills launch ([NXA-972](https://linear.app/nrwl/issue/NXA-972))
- Fix Nx Console for Cursor MCP tool handling ([NXA-1017](https://linear.app/nrwl/issue/NXA-1017))
- Add GIFs to nx-ai-agents-config ([NXA-981](https://linear.app/nrwl/issue/NXA-981))
- Migrate Claude plugin to repo root ([NXA-982](https://linear.app/nrwl/issue/NXA-982))
- Create launch content for agent configs/Claude plugin ([NXA-826](https://linear.app/nrwl/issue/NXA-826))
- Add hints to MCP tool structuredContent ([NXA-957](https://linear.app/nrwl/issue/NXA-957))
- Set up release flow for MCP server ([NXA-841](https://linear.app/nrwl/issue/NXA-841))
- Investigate Claude /sandbox mode hanging on Nx commands ([NXA-828](https://linear.app/nrwl/issue/NXA-828))
- Adjust ci-watcher subagent for intermediate states ([NXA-886](https://linear.app/nrwl/issue/NXA-886))
- Add clearer agent instructions for failed CIPE status ([NXA-932](https://linear.app/nrwl/issue/NXA-932))
- Make initial timeout reasonable ([NXA-906](https://linear.app/nrwl/issue/NXA-906))
- Fix agentic CLI misclassifying failure cause ([NXA-891](https://linear.app/nrwl/issue/NXA-891))
- Fix agent misusing gh CLI instead of CI monitor skill ([NXA-926](https://linear.app/nrwl/issue/NXA-926))
- Improve agent-controlled create-nx-workspace ([NXA-890](https://linear.app/nrwl/issue/NXA-890))
- Find good way to configure MCP flags in Claude plugin ([NXA-960](https://linear.app/nrwl/issue/NXA-960))
- Ensure flag overrides in MCP config not reverted ([NXA-967](https://linear.app/nrwl/issue/NXA-967))
- Implement agentic CNW platform setup ([NXA-920](https://linear.app/nrwl/issue/NXA-920))
- Re-check configure-ai-agents updating Cursor/OpenCode configs ([NXA-958](https://linear.app/nrwl/issue/NXA-958))
- Make sure `nx mcp` uses latest `nx-mcp` ([NXA-942](https://linear.app/nrwl/issue/NXA-942))
- Write up overview of onboarding gaps for agents ([NXA-907](https://linear.app/nrwl/issue/NXA-907))
- Write post covering outer CI loop ([NXA-857](https://linear.app/nrwl/issue/NXA-857))
- Ensure new setup with minimal respected in VS Code & Cursor ([NXA-887](https://linear.app/nrwl/issue/NXA-887))
- Document Claude plugin / agent configs ([NXA-825](https://linear.app/nrwl/issue/NXA-825))
- Post on Slack to get people to try plugin ([NXA-858](https://linear.app/nrwl/issue/NXA-858))
- Make MCP work if users paste links to runs/CIPEs ([NXA-328](https://linear.app/nrwl/issue/NXA-328))
- CI monitor commits unrelated local changes ([NXA-951](https://linear.app/nrwl/issue/NXA-951))

### Linear (NXA) — Polygraph

- Implement GitHub Actions integrations ([NXA-1014](https://linear.app/nrwl/issue/NXA-1014))
- Draw relevant part of graph in UI ([NXA-970](https://linear.app/nrwl/issue/NXA-970))
- Add session description support ([NXA-976](https://linear.app/nrwl/issue/NXA-976))
- Track session author ([NXA-977](https://linear.app/nrwl/issue/NXA-977))
- Support closing/completing sessions ([NXA-985](https://linear.app/nrwl/issue/NXA-985))
- Design doc for GitHub Status updates ([NXA-988](https://linear.app/nrwl/issue/NXA-988))
- Support repo selection ([NXA-1010](https://linear.app/nrwl/issue/NXA-1010))
- Replace token handling when cloning repos ([NXA-956](https://linear.app/nrwl/issue/NXA-956))
- MCP polygraph tools auto-install client bundle ([NXA-963](https://linear.app/nrwl/issue/NXA-963))
- Update GitHub PR comment ([NXA-987](https://linear.app/nrwl/issue/NXA-987))
- Create Nx Cloud Polygraph session UI ([NXA-850](https://linear.app/nrwl/issue/NXA-850))
- Handle breaking changes in PR graphs ([NXA-916](https://linear.app/nrwl/issue/NXA-916))
- Mark ready for review updates descriptions ([NXA-950](https://linear.app/nrwl/issue/NXA-950))
- Download client bundle implementation ([NXA-937](https://linear.app/nrwl/issue/NXA-937))
- Associate already opened PR to session ([NXA-955](https://linear.app/nrwl/issue/NXA-955))
- Move repos into nrwl org for Ocean connection ([NXA-966](https://linear.app/nrwl/issue/NXA-966))
- Implement multi-repo giga ralph ([NXA-939](https://linear.app/nrwl/issue/NXA-939))
- Set up dogfooding env for Ocean ([NXA-914](https://linear.app/nrwl/issue/NXA-914))
- Create graph of PRs for UI and GitHub comment ([NXA-915](https://linear.app/nrwl/issue/NXA-915))
- Create polygraph skills ([NXA-876](https://linear.app/nrwl/issue/NXA-876))
- Implement PR creation and coordination ([NXA-851](https://linear.app/nrwl/issue/NXA-851))
- Create repository discovery API endpoint ([NXA-843](https://linear.app/nrwl/issue/NXA-843))

---

## Performance & Reliability

### CLI

- Use jemalloc as the allocator ([NXC-3877](https://linear.app/nrwl/issue/NXC-3877))
- Cache compiled glob patterns in native module ([NXC-3960](https://linear.app/nrwl/issue/NXC-3960))
- Remove unused getTerminalOutput from BatchProcess ([NXC-3959](https://linear.app/nrwl/issue/NXC-3959), [#34604](https://github.com/nrwl/nx/pull/34604))
- Reduce/avoid graph recomputations ([NXC-3904](https://linear.app/nrwl/issue/NXC-3904))
- Deduplicate output strings ([NXC-3846](https://linear.app/nrwl/issue/NXC-3846))
- Skip stale recomputations, prevent lost file changes in daemon ([NXC-3908](https://linear.app/nrwl/issue/NXC-3908), [#34424](https://github.com/nrwl/nx/pull/34424))
- Fix/workaround `ignore-files` crate bug with prefix matching ([NXC-3903](https://linear.app/nrwl/issue/NXC-3903), [#34447](https://github.com/nrwl/nx/pull/34447))
- Do not start TUI logger unconditionally ([NXC-3893](https://linear.app/nrwl/issue/NXC-3893), [#34426](https://github.com/nrwl/nx/pull/34426))
- Investigate and fix high memory usage ([NXC-3708](https://linear.app/nrwl/issue/NXC-3708))
- Investigate and fix high CPU usage ([NXC-3717](https://linear.app/nrwl/issue/NXC-3717))
- Watcher consumes ton of CPU/memory on Linux — bump watchexec ([NXC-3832](https://linear.app/nrwl/issue/NXC-3832), [#34329](https://github.com/nrwl/nx/pull/34329))
- Use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.5.3
- Eagerly shutdown plugins that don't provide later hooks ([#34253](https://github.com/nrwl/nx/pull/34253)) — 22.5.0
- Implement shutting down plugin workers after graph creation ([NXC-3730](https://linear.app/nrwl/issue/NXC-3730))
- Reduce terminal output duplication and allocations ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.5.2
- Avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.5.2
- Prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.5.2
- Use picocolors instead of chalk in nx package ([#34305](https://github.com/nrwl/nx/pull/34305)) — 22.5.0
- Handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.5.3
- Use scoped cache key for unresolved npm imports ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.5.3

### Cloud

- Resolve daemon crash on particularly large runs (2602.10.2)

### Infrastructure

- Bump ClickUp nginx resource limits
- Add nginx as frontline cache for ClickUp
- Make C3D nodes generally available for ClickUp
- Tune JVM settings for prod
- Try HTTP/protobuf transport for OTEL javaagent

---

## Onboarding & Workspace Connection

### CLI

- Add variant 2 to CNW cloud prompts with promo message ([#34223](https://github.com/nrwl/nx/pull/34223)) — 22.5.0
- Add Nx Cloud connect URL to template README ([#34249](https://github.com/nrwl/nx/pull/34249)) — 22.5.0
- Add decorative banners for CNW completion ([#34270](https://github.com/nrwl/nx/pull/34270)) — 22.5.0
- Update CNW messaging ([#34364](https://github.com/nrwl/nx/pull/34364)) — 22.5.0
- Lock in CNW variant 2 with deferred connection ([#34416](https://github.com/nrwl/nx/pull/34416)) — 22.5.1
- Add nxVersion to meta in shortUrl for CNW ([#34401](https://github.com/nrwl/nx/pull/34401)) — 22.5.1
- Fix CNW git amend and README marker handling ([#34306](https://github.com/nrwl/nx/pull/34306)) — 22.5.0
- Add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580)) — 22.5.3
- Preserve nxCloud=skip in non-interactive CNW mode ([#34616](https://github.com/nrwl/nx/pull/34616)) — 22.5.3
- Prevent nxCloudId from being generated for new workspaces ([#34532](https://github.com/nrwl/nx/pull/34532)) — 22.5.2

### Cloud

- Fix CNW form "Update permissions" button visibility (2602.03.1)
- Fix connect workspace redirect destinations (2602.04.2)
- Streamline VCS integration forms (2602.17.4)
- Allow PNPM catalogs for workspace connection (2602.19.9)
- Workspace-repository access syncing setting (2602.27.5)
- Include link to create workspace for CNW arrivals (2602.27.7)

### Linear (CLOUD)

- Update /guide route for CNW users ([CLOUD-4305](https://linear.app/nrwl/issue/CLOUD-4305))
- Feb 23 experiment: welcome view ([CLOUD-4304](https://linear.app/nrwl/issue/CLOUD-4304))
- Fix installing GH app for non-cloud.nx.app envs ([CLOUD-4289](https://linear.app/nrwl/issue/CLOUD-4289))
- Replace browser-based CNW bottom sheet ([CLOUD-4221](https://linear.app/nrwl/issue/CLOUD-4221))
- Update CNW cloud prompt with explicit opt-out ([CLOUD-4242](https://linear.app/nrwl/issue/CLOUD-4242))
- /welcome experiment Feb 16th ([CLOUD-4288](https://linear.app/nrwl/issue/CLOUD-4288))
- Experiment Feb 13: revert to previous prompts ([CLOUD-4255](https://linear.app/nrwl/issue/CLOUD-4255))
- Remove extraneous title from orgs list empty state ([CLOUD-4225](https://linear.app/nrwl/issue/CLOUD-4225))
- Feb 6 experiment: refine cloud prompt ([CLOUD-4235](https://linear.app/nrwl/issue/CLOUD-4235))
- Investigate missing README short links for templates ([CLOUD-4194](https://linear.app/nrwl/issue/CLOUD-4194))
- Install GH app and OAuth in one step ([CLOUD-4224](https://linear.app/nrwl/issue/CLOUD-4224))

### Linear (NXC)

- Fix PRESET_FAILED: Failed to apply preset: empty ([NXC-3813](https://linear.app/nrwl/issue/NXC-3813))
- Address common CNW errors ([NXC-3811](https://linear.app/nrwl/issue/NXC-3811))
- Fix CNW amend errors ([NXC-3812](https://linear.app/nrwl/issue/NXC-3812))
- Fix CNW template leftover AI agent files ([NXC-3920](https://linear.app/nrwl/issue/NXC-3920))
- Add Nx version to short link metadata ([NXC-3879](https://linear.app/nrwl/issue/NXC-3879))
- Update templates to 22.5 ([NXC-3880](https://linear.app/nrwl/issue/NXC-3880))

---

## JVM Ecosystem (Gradle & Maven)

### CLI

- Display batch tasks in the TUI ([#33695](https://github.com/nrwl/nx/pull/33695)) — 22.5.0
- Add debug env var to Gradle batch executor ([#34259](https://github.com/nrwl/nx/pull/34259)) — 22.5.0
- Ensure batch output not overridden for atomized targets ([#34268](https://github.com/nrwl/nx/pull/34268)) — 22.4.5, 22.5.0
- Enforce single gradle task per executor invocation ([#34269](https://github.com/nrwl/nx/pull/34269)) — 22.4.5, 22.5.0
- Use Gradle project name when resolving dependent tasks ([#34331](https://github.com/nrwl/nx/pull/34331)) — 22.5.0
- Use tooling API compatible flags ([#34247](https://github.com/nrwl/nx/pull/34247)) — 22.5.0
- Ensure atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.5.3
- Use globs for dependent task output files ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.5.3
- Load Maven classes at runtime for version-agnostic batch execution ([#34180](https://github.com/nrwl/nx/pull/34180)) — 22.5.0
- Bump Maven plugin version to 0.0.13 ([#34318](https://github.com/nrwl/nx/pull/34318)) — 22.5.0
- Include pom.xml and ancestor pom files as inputs ([#34291](https://github.com/nrwl/nx/pull/34291)) — 22.4.5, 22.5.0
- Correctly map between Maven locators and Nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.5.1
- Use module-level variable for cache transfer in Maven ([#34386](https://github.com/nrwl/nx/pull/34386)) — 22.5.1
- Write output after each task in batch mode for correct caching ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.5.2
- Fix set pom file without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.5.3
- Update Maven & Gradle icons to Java Duke icon ([#34508](https://github.com/nrwl/nx/pull/34508)) — 22.5.3

### Linear

- Add opt-in for executors to declare batch mode ([NXC-3793](https://linear.app/nrwl/issue/NXC-3793))
- CLIENT ADP: CI blocking with multiple Gradle tasks ([NXC-3779](https://linear.app/nrwl/issue/NXC-3779))
- Update Gradle docs with batch mode ([NXC-3780](https://linear.app/nrwl/issue/NXC-3780))
- Ensure batch mode works on Ocean and Nx ([NXC-3781](https://linear.app/nrwl/issue/NXC-3781))
- Batch mode logs truncate with atomized tasks ([NXC-3798](https://linear.app/nrwl/issue/NXC-3798))
- Enable batch mode for Gradle in Ocean ([NXC-3957](https://linear.app/nrwl/issue/NXC-3957))
- Ocean UI graph generation slow then crashes with Java OOM ([NXC-3958](https://linear.app/nrwl/issue/NXC-3958))
- Gradle task running pnpm exec in project root ([NXC-3988](https://linear.app/nrwl/issue/NXC-3988))
- Dependent tasks generated with incorrect project names ([Q-170](https://linear.app/nrwl/issue/Q-170))
- Atomized test targets missing dependsOn ([Q-174](https://linear.app/nrwl/issue/Q-174))
- Set prefix for Gradle tasks ([Q-173](https://linear.app/nrwl/issue/Q-173))
- Ensure dependent task output files use correct path ([Q-247](https://linear.app/nrwl/issue/Q-247))
- Reach out to DPEs for Maven tester ([NXC-3378](https://linear.app/nrwl/issue/NXC-3378))

---

## Security

### CLI

- Prevent command injection in getNpmPackageVersion ([#34309](https://github.com/nrwl/nx/pull/34309)) — 22.4.5, 22.5.0
- Bump minimatch to 10.2.1 for CVE-2026-26996 ([#34509](https://github.com/nrwl/nx/pull/34509)) — 22.5.3
- Remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.5.1

### Infrastructure

- Rotate IAM access keys for patrick ([INF-1190](https://linear.app/nrwl/issue/INF-1190))
- Rotate IAM access keys for athena-access-user ([INF-1189](https://linear.app/nrwl/issue/INF-1189))
- Rotate IAM access keys for Steve ([INF-1192](https://linear.app/nrwl/issue/INF-1192))
- Remove direct upload from executor/log uploader ([INF-1140](https://linear.app/nrwl/issue/INF-1140))
- Lighthouse: move password copy to backend ([INF-1211](https://linear.app/nrwl/issue/INF-1211))
- Lighthouse: begin page/action auditing ([INF-1210](https://linear.app/nrwl/issue/INF-1210))
- Lighthouse: login audit log and extension framework ([INF-1204](https://linear.app/nrwl/issue/INF-1204))

### Linear (NXC)

- Command injection vulnerability in get-npm-package-version ([NXC-3816](https://linear.app/nrwl/issue/NXC-3816))
- Clarify security email should not be used for outdated packages ([NXC-3898](https://linear.app/nrwl/issue/NXC-3898))

---

## Continuous Task Assignment (DTE v2)

### Linear (Q)

- Continuous assignment implementation ([Q-197](https://linear.app/nrwl/issue/Q-197))
- Agent exits after all workers spun down ([Q-227](https://linear.app/nrwl/issue/Q-227))
- Flaky retry tasks should not update execution status ([Q-222](https://linear.app/nrwl/issue/Q-222))
- WaitingAgents not invalidated often enough ([Q-224](https://linear.app/nrwl/issue/Q-224))
- Worker orchestrator remembers retrieved hashes ([Q-225](https://linear.app/nrwl/issue/Q-225))
- complete-tasks/assign-tasks don't populate agent metadata ([Q-223](https://linear.app/nrwl/issue/Q-223))
- Shrinking worker pool may kill executing workers ([Q-220](https://linear.app/nrwl/issue/Q-220))
- Valkey writes non-cacheable completion on assignment ([Q-216](https://linear.app/nrwl/issue/Q-216))
- Workers stalling during shutdown cause loop ([Q-214](https://linear.app/nrwl/issue/Q-214))
- Main job fails downloading artifacts ([Q-213](https://linear.app/nrwl/issue/Q-213))
- Long polling not long with Valkey assignment ([Q-210](https://linear.app/nrwl/issue/Q-210))
- Metrics collection doesn't work properly ([Q-206](https://linear.app/nrwl/issue/Q-206))
- Analysis screen shows utilization at 0% ([Q-203](https://linear.app/nrwl/issue/Q-203))
- Non-cacheable tasks not guaranteed on requiring agent ([Q-205](https://linear.app/nrwl/issue/Q-205))
- Nx repo throws daemon error ([Q-202](https://linear.app/nrwl/issue/Q-202))
- DTE benchmark package improvements ([Q-191](https://linear.app/nrwl/issue/Q-191), [Q-190](https://linear.app/nrwl/issue/Q-190), [Q-189](https://linear.app/nrwl/issue/Q-189), [Q-182](https://linear.app/nrwl/issue/Q-182), [Q-154](https://linear.app/nrwl/issue/Q-154), [Q-153](https://linear.app/nrwl/issue/Q-153), [Q-144](https://linear.app/nrwl/issue/Q-144), [Q-140](https://linear.app/nrwl/issue/Q-140), [Q-139](https://linear.app/nrwl/issue/Q-139))

---

## Workspace Visibility

### Cloud

- Workspace-repository access syncing setting (2602.27.5)

### Linear (NXA)

- Updated design doc for repository access sync ([NXA-1019](https://linear.app/nrwl/issue/NXA-1019))
- Redesign public/private repository sync ([NXA-861](https://linear.app/nrwl/issue/NXA-861))
- Add new isPublic field to workspace data model ([NXA-893](https://linear.app/nrwl/issue/NXA-893))
- Handle public/private migration ([NXA-902](https://linear.app/nrwl/issue/NXA-902))
- Add feature flag for workspace visibility ([NXA-904](https://linear.app/nrwl/issue/NXA-904))
- Add visibility toggle to workspace settings ([NXA-901](https://linear.app/nrwl/issue/NXA-901))
- Remove visibility toggle from organization settings ([NXA-900](https://linear.app/nrwl/issue/NXA-900))
- Add OAuth integration for BitBucket ([NXA-898](https://linear.app/nrwl/issue/NXA-898))

---

## Framer Website Migration

### Linear (CLOUD)

- Migrate Homepage ([CLOUD-4089](https://linear.app/nrwl/issue/CLOUD-4089))
- Migrate Pricing Page ([CLOUD-4075](https://linear.app/nrwl/issue/CLOUD-4075))
- Implement pricing cards ([CLOUD-4286](https://linear.app/nrwl/issue/CLOUD-4286))
- Pricing page update ([CLOUD-4285](https://linear.app/nrwl/issue/CLOUD-4285))
- Migrate pricing page to Framer ([CLOUD-4287](https://linear.app/nrwl/issue/CLOUD-4287))
- Migrate Enterprise Page ([CLOUD-4086](https://linear.app/nrwl/issue/CLOUD-4086))
- Migrate Enterprise > Security Page ([CLOUD-4077](https://linear.app/nrwl/issue/CLOUD-4077))
- Migrate Enterprise > Trial Page ([CLOUD-4076](https://linear.app/nrwl/issue/CLOUD-4076))
- Migrate Nx Cloud Page ([CLOUD-4087](https://linear.app/nrwl/issue/CLOUD-4087))
- Migrate Customers Page ([CLOUD-4082](https://linear.app/nrwl/issue/CLOUD-4082))
- Migrate Partners Page ([CLOUD-4078](https://linear.app/nrwl/issue/CLOUD-4078))
- Migrate Community Page ([CLOUD-4085](https://linear.app/nrwl/issue/CLOUD-4085))
- Migrate Company Page ([CLOUD-4084](https://linear.app/nrwl/issue/CLOUD-4084))
- Migrate Contact Page and sub-pages ([CLOUD-4103](https://linear.app/nrwl/issue/CLOUD-4103), [CLOUD-4102](https://linear.app/nrwl/issue/CLOUD-4102), [CLOUD-4101](https://linear.app/nrwl/issue/CLOUD-4101), [CLOUD-4100](https://linear.app/nrwl/issue/CLOUD-4100), [CLOUD-4099](https://linear.app/nrwl/issue/CLOUD-4099))
- Migrate Solutions pages ([CLOUD-4124](https://linear.app/nrwl/issue/CLOUD-4124), [CLOUD-4122](https://linear.app/nrwl/issue/CLOUD-4122), [CLOUD-4121](https://linear.app/nrwl/issue/CLOUD-4121), [CLOUD-4123](https://linear.app/nrwl/issue/CLOUD-4123))
- Migrate Java Page ([CLOUD-4236](https://linear.app/nrwl/issue/CLOUD-4236))
- Migrate React Page ([CLOUD-4237](https://linear.app/nrwl/issue/CLOUD-4237))
- Migrate Webinar Page ([CLOUD-4079](https://linear.app/nrwl/issue/CLOUD-4079))
- Migrate Resources ([CLOUD-4083](https://linear.app/nrwl/issue/CLOUD-4083))
- Migrate Brands Page ([CLOUD-4081](https://linear.app/nrwl/issue/CLOUD-4081))
- Migrate Remote Cache Page ([CLOUD-4097](https://linear.app/nrwl/issue/CLOUD-4097))
- Migrate Blog Index ([CLOUD-4092](https://linear.app/nrwl/issue/CLOUD-4092))
- Migrate 404 Page ([CLOUD-4238](https://linear.app/nrwl/issue/CLOUD-4238))
- Migrate Careers Page ([CLOUD-4239](https://linear.app/nrwl/issue/CLOUD-4239))
- Migrate Security Page ([CLOUD-4098](https://linear.app/nrwl/issue/CLOUD-4098))
- Migrate header with mega menu ([CLOUD-4263](https://linear.app/nrwl/issue/CLOUD-4263))
- Set canonical URLs to nx.dev ([CLOUD-4148](https://linear.app/nrwl/issue/CLOUD-4148))
- Enable rewrites for all Framer pages on canary ([CLOUD-4269](https://linear.app/nrwl/issue/CLOUD-4269))
- Consolidate marketing scripts into GTM ([CLOUD-4252](https://linear.app/nrwl/issue/CLOUD-4252))
- Add custom tracking events ([CLOUD-4256](https://linear.app/nrwl/issue/CLOUD-4256))
- Add Framer event tracking bridge to GTM ([CLOUD-4202](https://linear.app/nrwl/issue/CLOUD-4202))
- Review SEO titles and descriptions ([CLOUD-4283](https://linear.app/nrwl/issue/CLOUD-4283))
- Update website copy and assets for new brand messaging ([CLOUD-4284](https://linear.app/nrwl/issue/CLOUD-4284))
- Address Victor & Heidi feedback ([CLOUD-4293](https://linear.app/nrwl/issue/CLOUD-4293))
- Review homepage and pricing page ([CLOUD-4292](https://linear.app/nrwl/issue/CLOUD-4292), [CLOUD-4291](https://linear.app/nrwl/issue/CLOUD-4291))
- Address Juri's feedback ([CLOUD-4272](https://linear.app/nrwl/issue/CLOUD-4272))
- Finalize highlight descriptions for plan tiers ([CLOUD-4185](https://linear.app/nrwl/issue/CLOUD-4185))
- Update prototype from sync feedback ([CLOUD-4184](https://linear.app/nrwl/issue/CLOUD-4184))

---

## TUI (Terminal UI) Improvements

### CLI

- Display batch tasks in the TUI ([#33695](https://github.com/nrwl/nx/pull/33695)) — 22.5.0
- Move TUI to parking lot rwlock to avoid hang ([#34187](https://github.com/nrwl/nx/pull/34187)) — 22.5.0
- Handle resizing better for inline_tui ([#34006](https://github.com/nrwl/nx/pull/34006)) — 22.5.0
- Preserve task selection when unrelated tasks finish ([#34328](https://github.com/nrwl/nx/pull/34328)) — 22.5.0
- Avoid crash when pane area out of bounds during resize ([#34343](https://github.com/nrwl/nx/pull/34343)) — 22.5.0
- Hitting [1] or [2] removes pinned panes if they match current task ([#34433](https://github.com/nrwl/nx/pull/34433)) — 22.5.1
- Scrollbar area fix ([NXC-3207](https://linear.app/nrwl/issue/NXC-3207))
- Scrollback messy for very long outputs ([NXC-3759](https://linear.app/nrwl/issue/NXC-3759))
- Inline TUI hangs when returning to full screen ([NXC-3760](https://linear.app/nrwl/issue/NXC-3760))
- TUI not used for some run-many build commands ([NXC-3550](https://linear.app/nrwl/issue/NXC-3550))
- Add proper Stopped status for continuous sibling tasks ([NXC-3553](https://linear.app/nrwl/issue/NXC-3553))
- Unpinning task by number key doesn't close pane ([NXC-3899](https://linear.app/nrwl/issue/NXC-3899))

---

## Cloud Stability & Fixes

### Cloud

- Fix task list sorting stability (2602.23.8)
- Display contributors with null names as "No attribution" (2602.20.1)
- Inline error instead of 404 for task detail retrieval errors (2602.18.13)
- Fix URL construction with trailing slash (2602.13.2)
- Enterprise contributor data renders regardless of license duration (2602.09.5)
- Fix search parameters persisting between analytics views (2602.09.7)
- Verification tasks tab shows "In progress" status (2602.04.3)
- Compare Tasks shows cache origin without comparison selection (2602.11.3)
- Access control settings require confirmation before saving (2602.11.1)

### Linear (CLOUD)

- Investigate contributor count discrepancy ([CLOUD-2614](https://linear.app/nrwl/issue/CLOUD-2614))
- Unable to remove duplicate members when VCS connected ([CLOUD-4043](https://linear.app/nrwl/issue/CLOUD-4043))
- 7-Eleven admin cannot access organization settings ([CLOUD-4173](https://linear.app/nrwl/issue/CLOUD-4173))
- No results when using task analytics filters ([CLOUD-4025](https://linear.app/nrwl/issue/CLOUD-4025))
- Storybook Calendar stories break visual diffs ([CLOUD-4296](https://linear.app/nrwl/issue/CLOUD-4296))
- Investigate view-logs requests causing frontend pod restarts ([CLOUD-4210](https://linear.app/nrwl/issue/CLOUD-4210))
- Investigate frequent frontend container restarts ([CLOUD-4222](https://linear.app/nrwl/issue/CLOUD-4222))
- Restore logs stream migration to workers ([CLOUD-4217](https://linear.app/nrwl/issue/CLOUD-4217))
- Nx login doesn't handle trailing slash ([CLOUD-4275](https://linear.app/nrwl/issue/CLOUD-4275))
- Theme switch to System crashes contact/sales page ([CLOUD-4276](https://linear.app/nrwl/issue/CLOUD-4276))
- Agent utilization view shows wrong hung tasks ([CLOUD-4259](https://linear.app/nrwl/issue/CLOUD-4259))
- Resource usage shows inconsistent peak memory ([CLOUD-4257](https://linear.app/nrwl/issue/CLOUD-4257))
- Compare Tasks doesn't show cache origin without compare selection ([CLOUD-3924](https://linear.app/nrwl/issue/CLOUD-3924))
- Require confirmation for sensitive settings ([CLOUD-4246](https://linear.app/nrwl/issue/CLOUD-4246))
- Enterprise contributors over period empty ([CLOUD-4200](https://linear.app/nrwl/issue/CLOUD-4200))
- "Connect VCS provider" CTA persists after connecting one ([CLOUD-4232](https://linear.app/nrwl/issue/CLOUD-4232))
- Update footer copyright year dynamically ([CLOUD-4230](https://linear.app/nrwl/issue/CLOUD-4230))
- Show DTE agent visualization on CIPE critical error ([CLOUD-4162](https://linear.app/nrwl/issue/CLOUD-4162))
- Flaky tasks links for colon-named tasks return 404 ([CLOUD-4216](https://linear.app/nrwl/issue/CLOUD-4216))
- Ocean Tasks analytics shows no data with sortBy ([CLOUD-4249](https://linear.app/nrwl/issue/CLOUD-4249))
- Clean up current changelog site ([CLOUD-3972](https://linear.app/nrwl/issue/CLOUD-3972))

### Linear (NXA)

- 403 when upgrading org to Team plan ([NXA-1041](https://linear.app/nrwl/issue/NXA-1041))
- Warning link self-referential in self-healing CI ([NXA-971](https://linear.app/nrwl/issue/NXA-971))
- Remove env var for partitioning by launch template ([NXA-965](https://linear.app/nrwl/issue/NXA-965))
- Hide "learn nx cloud" section for non-org users ([NXA-938](https://linear.app/nrwl/issue/NXA-938))
- Add NX_DISABLED_POWERPACK env var ([NXA-881](https://linear.app/nrwl/issue/NXA-881))
- Fix filter shows unverified fixes ([NXA-765](https://linear.app/nrwl/issue/NXA-765))
- Icon click redirects to CNW for empty workspace ([NXA-989](https://linear.app/nrwl/issue/NXA-989))
- Add sorting to Agent Resource Usage list ([NXA-998](https://linear.app/nrwl/issue/NXA-998))
- Sorting by duration resets when changing period ([NXA-990](https://linear.app/nrwl/issue/NXA-990))
- BitBucket PR comments malformatted ([NXA-931](https://linear.app/nrwl/issue/NXA-931))
- Add env-var for snapshot GitHub app slug ([NXA-1007](https://linear.app/nrwl/issue/NXA-1007))

---

## Infrastructure & Enterprise Operations

### Infrastructure

- New single-tenant: Wix (GCP, PoV) ([INF-1200](https://linear.app/nrwl/issue/INF-1200))
- New single-tenant: Legora (GCP, PoV) ([INF-1217](https://linear.app/nrwl/issue/INF-1217))
- Celonis S3 VPC endpoint setup for artifacts ([INF-1194](https://linear.app/nrwl/issue/INF-1194))
- Cloudinary SAML setup ([INF-1193](https://linear.app/nrwl/issue/INF-1193))
- Cloudinary and Wix GitHub app switch ([INF-1214](https://linear.app/nrwl/issue/INF-1214))
- Wix SAML enabled
- Enable async status updates for workflow controller on all environments ([INF-1124](https://linear.app/nrwl/issue/INF-1124), [INF-1125](https://linear.app/nrwl/issue/INF-1125))
- Remove async processing feature flag ([INF-1126](https://linear.app/nrwl/issue/INF-1126))
- Handle SIGTERM/SIGINT in queue processor ([INF-1133](https://linear.app/nrwl/issue/INF-1133))
- Workflow controller graceful rolling ([INF-752](https://linear.app/nrwl/issue/INF-752))
- Workflow controller explicitly sets command on agent main container ([INF-1137](https://linear.app/nrwl/issue/INF-1137))
- SubPath volumes enabled on all environments ([INF-1131](https://linear.app/nrwl/issue/INF-1131))
- Workflow controller resource classes support DiskSize ([INF-1129](https://linear.app/nrwl/issue/INF-1129))
- IAM Binding → IAM Member migration (prod, staging, single-tenants, GCS cache bucket) ([INF-1202](https://linear.app/nrwl/issue/INF-1202), [INF-1205](https://linear.app/nrwl/issue/INF-1205), [INF-1206](https://linear.app/nrwl/issue/INF-1206), [INF-1207](https://linear.app/nrwl/issue/INF-1207), [INF-1208](https://linear.app/nrwl/issue/INF-1208), [INF-1209](https://linear.app/nrwl/issue/INF-1209))
- Update and unify Terraform provider versions ([INF-1195](https://linear.app/nrwl/issue/INF-1195) through [INF-1201](https://linear.app/nrwl/issue/INF-1201))
- Update tofu version ([INF-1198](https://linear.app/nrwl/issue/INF-1198))
- Grafana billing alerts in Terraform ([INF-1220](https://linear.app/nrwl/issue/INF-1220))
- Grafana webhook tokens for enterprise environments
- Lighthouse: wire up Google Auth, remove IAP ([INF-1203](https://linear.app/nrwl/issue/INF-1203) through [INF-1212](https://linear.app/nrwl/issue/INF-1212))
- Lighthouse: service account/role rework ([INF-1119](https://linear.app/nrwl/issue/INF-1119))
- Lighthouse: performance improvement, cache deployed tenant version ([INF-1135](https://linear.app/nrwl/issue/INF-1135))
- Lighthouse: add Wix to lighthouse monitoring ([INF-1200 related])
- PostHog reverse proxies ([INF-1185](https://linear.app/nrwl/issue/INF-1185))
- Explore alternatives to bitnami Valkey chart ([INF-1134](https://linear.app/nrwl/issue/INF-1134))
- In-depth Podman/Buildah validation investigation ([INF-1139](https://linear.app/nrwl/issue/INF-1139))
- Migrate AL2 agent nodegroups to AL2023 ([INF-969](https://linear.app/nrwl/issue/INF-969))
- Celonis nx-api 3→6 replicas
- Bump workflow controller to 2 replicas for prod NA/EU

### Linear (Q) — nx-api

- Redisson + Netty upgrade direct memory investigation ([Q-212](https://linear.app/nrwl/issue/Q-212))
- Update opentelemetry-javaagent ([Q-200](https://linear.app/nrwl/issue/Q-200))
- Update MongoDB and Buf-Connect deps ([Q-199](https://linear.app/nrwl/issue/Q-199))
- nx-api memory leak investigation ([Q-171](https://linear.app/nrwl/issue/Q-171))
- Long-polling rework ([Q-165](https://linear.app/nrwl/issue/Q-165))
- Multiple API endpoint timeout improvements ([Q-181](https://linear.app/nrwl/issue/Q-181), [Q-180](https://linear.app/nrwl/issue/Q-180), [Q-168](https://linear.app/nrwl/issue/Q-168), [Q-167](https://linear.app/nrwl/issue/Q-167), [Q-166](https://linear.app/nrwl/issue/Q-166))
- Handle JSON.stringify limit for daemon calls ([Q-185](https://linear.app/nrwl/issue/Q-185))
- Snapshot aggregator restarting ([Q-176](https://linear.app/nrwl/issue/Q-176))
- CIBC custom encryption key not working with Azure ([Q-221](https://linear.app/nrwl/issue/Q-221))
- Inconsistent affectedProjectRatio values ([Q-158](https://linear.app/nrwl/issue/Q-158))
- Atomicfu update classloader issue ([Q-160](https://linear.app/nrwl/issue/Q-160))
- Investigate failing tests on main ([Q-159](https://linear.app/nrwl/issue/Q-159))
- Investigate Stripe error for Betterleap ([Q-161](https://linear.app/nrwl/issue/Q-161))
- `.complete` metrics marker file cleanup ([Q-169](https://linear.app/nrwl/issue/Q-169))
- All platforms report author from git executable ([Q-226](https://linear.app/nrwl/issue/Q-226))
- Do not error log on VCS credential refresh failure ([Q-230](https://linear.app/nrwl/issue/Q-230))
- Investigate large agent idleness gaps for Essent ([Q-104](https://linear.app/nrwl/issue/Q-104))

---

## Ecosystem & Framework Support

### CLI

- Add negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160)) — 22.5.1
- Add NX_PREFER_NODE_STRIP_TYPES for Node's native TypeScript stripping ([#34202](https://github.com/nrwl/nx/pull/34202)) — 22.5.0
- Bump SWC to latest versions ([#34215](https://github.com/nrwl/nx/pull/34215), [#34365](https://github.com/nrwl/nx/pull/34365)) — 22.5.0
- Use caret range for SWC dependencies in pnpm catalog ([#34487](https://github.com/nrwl/nx/pull/34487)) — 22.5.2
- Support ESLint v10 ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.5.3
- Allow wildcards paths in enforce-module-boundaries ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.5.3
- Use SASS indented syntax in Angular nx-welcome when style is sass ([#34510](https://github.com/nrwl/nx/pull/34510)) — 22.5.3
- Support Angular v21.2 ([NXC-3972](https://linear.app/nrwl/issue/NXC-3972))
- Handle sophisticated Vite plugins ([#34242](https://github.com/nrwl/nx/pull/34242)) — 22.5.0
- isPreview=true for Vite Preview server ([#34597](https://github.com/nrwl/nx/pull/34597)) — 22.5.3
- Skip unnecessary type-check in TS Solution Setup when skipTypeCheck is true ([#34493](https://github.com/nrwl/nx/pull/34493)) — 22.5.3
- Fix regression on process.env usage for webpack ([#34583](https://github.com/nrwl/nx/pull/34583)) — 22.5.3
- Ensure safe process.env fallback replacement for webpack ([#34464](https://github.com/nrwl/nx/pull/34464)) — 22.5.3
- Add docs link to generatePackageJson error message ([#34562](https://github.com/nrwl/nx/pull/34562)) — 22.5.3
- Exclude .json files from Angular Rspack JS/TS regex patterns ([#34195](https://github.com/nrwl/nx/pull/34195)) — 22.5.3
- Remove file-loader dependency, update svgr migration for React ([#34218](https://github.com/nrwl/nx/pull/34218)) — 22.5.0
- Ensure vitest config file is created ([#34216](https://github.com/nrwl/nx/pull/34216)) — 22.5.0
- Remove redundant vite.config.ts generation for vitest projects ([#34603](https://github.com/nrwl/nx/pull/34603)) — 22.5.3
- Preload vitest/node to prevent race condition on Node 24 ([#34261](https://github.com/nrwl/nx/pull/34261)) — 22.5.0
- Use surgical text replacement in Jest matcher alias migration ([#34350](https://github.com/nrwl/nx/pull/34350)) — 22.5.3
- Add cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.5.1
- Use per-invocation cache in TS plugin for NX_ISOLATE_PLUGINS=false ([#34566](https://github.com/nrwl/nx/pull/34566)) — 22.5.3
- Guard against undefined closest node in rehoistNodes ([#34347](https://github.com/nrwl/nx/pull/34347)) — 22.5.3
- Use --lockfile-only for Bun updateLockFile ([#34375](https://github.com/nrwl/nx/pull/34375)) — 22.5.0
- Allow null values in JSON schema validation ([#34167](https://github.com/nrwl/nx/pull/34167)) — 22.5.0
- Allow null values in schema of dockerVersion ([#34171](https://github.com/nrwl/nx/pull/34171)) — 22.5.3
- Add null-safe fallback for version in createGitTagValues ([#34598](https://github.com/nrwl/nx/pull/34598)) — 22.5.3
- Remove unnecessary number from release return type ([#34481](https://github.com/nrwl/nx/pull/34481)) — 22.5.2
- Reset daemon client after project graph creation in withNx (Next.js) ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.5.2
- Make watch command work with --all and --initialRun ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.5.3

---

## Core CLI Fixes

### CLI

- Handle multibyte UTF-8 characters in socket message consumption ([#34151](https://github.com/nrwl/nx/pull/34151)) — 22.4.5, 22.5.0
- Resolve daemon client reconnect queue deadlock ([#34284](https://github.com/nrwl/nx/pull/34284)) — 22.4.5, 22.5.0
- Show help for run-one using project short names ([#34303](https://github.com/nrwl/nx/pull/34303)) — 22.4.5, 22.5.0
- Fall back to node_modules when /tmp has noexec ([#34207](https://github.com/nrwl/nx/pull/34207)) — 22.5.0
- Cloud commands are noop when not connected (not errors) ([#34193](https://github.com/nrwl/nx/pull/34193)) — 22.5.0
- Consolidate GitHub URL messaging when gh push fails ([#34196](https://github.com/nrwl/nx/pull/34196)) — 22.5.0
- Hide already-installed packages from nx import suggestion list ([#34227](https://github.com/nrwl/nx/pull/34227)) — 22.5.0
- Improve plugin worker error messages and lifecycle timeouts ([#34251](https://github.com/nrwl/nx/pull/34251)) — 22.5.0
- Handle EPIPE errors gracefully in daemon socket writes ([#34311](https://github.com/nrwl/nx/pull/34311)) — 22.5.0
- Allow overriding daemon logging settings ([#34324](https://github.com/nrwl/nx/pull/34324)) — 22.5.0
- Disable ignore filters for outputs expansion ([#34316](https://github.com/nrwl/nx/pull/34316)) — 22.5.0
- Track all task outputs regardless of path depth ([#34321](https://github.com/nrwl/nx/pull/34321)) — 22.5.0, 21.3.12
- Only detect flaky tasks for cacheable tasks ([#33994](https://github.com/nrwl/nx/pull/33994)) — 22.5.0
- Add missing FileType import for Windows watcher build ([#34369](https://github.com/nrwl/nx/pull/34369)) — 22.5.0
- Use consistent batch id between scheduler and task runner ([#34392](https://github.com/nrwl/nx/pull/34392)) — 22.5.1
- Clean up stale socket files before listening ([#34236](https://github.com/nrwl/nx/pull/34236)) — 22.5.1
- Avoid dropping unrelated continuous deps in makeAcyclic ([#34389](https://github.com/nrwl/nx/pull/34389)) — 22.5.1
- Make runtime cache key deterministic ([#34390](https://github.com/nrwl/nx/pull/34390)) — 22.5.1
- Handle dangling symlinks during cache restore ([#34396](https://github.com/nrwl/nx/pull/34396)) — 22.5.1
- Use workspace root for path resolution when baseUrl not set ([#34453](https://github.com/nrwl/nx/pull/34453)) — 22.5.2
- Commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.5.2
- Retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.5.3
- Reject pending promises when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.5.3
- Use static_vcruntime to avoid msvcrt dependency on Windows ([#19781](https://github.com/nrwl/nx/pull/19781)) — 22.5.2

---

## Documentation

### Linear (DOC)

- Reformat sidebar into topics ([DOC-365](https://linear.app/nrwl/issue/DOC-365))
- Dedupe content across Getting Started pages ([DOC-406](https://linear.app/nrwl/issue/DOC-406))
- Improve AX for Getting Started / Intro Pages ([DOC-405](https://linear.app/nrwl/issue/DOC-405))
- Propose structure for Technology pages ([DOC-407](https://linear.app/nrwl/issue/DOC-407))
- Update breadcrumbs to match new sidebar ([DOC-400](https://linear.app/nrwl/issue/DOC-400))
- Condense and remove redirects ([DOC-403](https://linear.app/nrwl/issue/DOC-403))
- Track page views server-side ([DOC-395](https://linear.app/nrwl/issue/DOC-395))
- Investigate boosting CLI reference pages in search ([DOC-401](https://linear.app/nrwl/issue/DOC-401))
- Add redirect from /pricing ([DOC-426](https://linear.app/nrwl/issue/DOC-426))
- Fix blog redirect loop ([DOC-425](https://linear.app/nrwl/issue/DOC-425))
- Add Requirements section to tech docs ([DOC-423](https://linear.app/nrwl/issue/DOC-423))
- Investigate nx.dev outage ([DOC-415](https://linear.app/nrwl/issue/DOC-415))
- Fix `nx show projects` docs ([DOC-417](https://linear.app/nrwl/issue/DOC-417))
- Better handling of preview deployments ([DOC-384](https://linear.app/nrwl/issue/DOC-384))
- Document `checkAllBranchesWhen` type ([DOC-414](https://linear.app/nrwl/issue/DOC-414))
- Search overlay layout fix ([DOC-410](https://linear.app/nrwl/issue/DOC-410))
- Use DEPLOY_URL for PR previews ([DOC-413](https://linear.app/nrwl/issue/DOC-413))
- Make "plugin registry" searchable ([DOC-409](https://linear.app/nrwl/issue/DOC-409))
- Document GitHub app permissions ([DOC-187](https://linear.app/nrwl/issue/DOC-187))
- Command examples on reference page ([DOC-402](https://linear.app/nrwl/issue/DOC-402))
- Fix prod OG images linking to localhost ([DOC-399](https://linear.app/nrwl/issue/DOC-399))
- Fix Netlify build failure ([DOC-398](https://linear.app/nrwl/issue/DOC-398))
- Switch DNS to Netlify ([DOC-397](https://linear.app/nrwl/issue/DOC-397))
- Add screenshots to cache miss troubleshooting docs ([DOC-387](https://linear.app/nrwl/issue/DOC-387))
- Refresh GITHUB_TOKEN for docs ([DOC-396](https://linear.app/nrwl/issue/DOC-396))

### CLI (nx-dev)

- Reformat sidebar into topics ([#34265](https://github.com/nrwl/nx/pull/34265)) — 22.5.0
- Add llms-full.txt and HTTP Link headers ([#34232](https://github.com/nrwl/nx/pull/34232)) — 22.5.0
- Add server-side page view tracking ([#34283](https://github.com/nrwl/nx/pull/34283)) — 22.4.5, 22.5.0
- Make headers and table options linkable ([#34267](https://github.com/nrwl/nx/pull/34267)) — 22.4.5, 22.5.0
- Fix page view double-counting ([#34286](https://github.com/nrwl/nx/pull/34286)) — 22.4.5, 22.5.0
- Exclude large native deps from build bundle ([#34335](https://github.com/nrwl/nx/pull/34335)) — 22.5.0
- Fix OG images wrong URL ([#34346](https://github.com/nrwl/nx/pull/34346)) — 22.5.0
- Use right URL for Netlify context ([#34348](https://github.com/nrwl/nx/pull/34348)) — 22.5.0
- Include nx CLI examples on refs page ([#34367](https://github.com/nrwl/nx/pull/34367)) — 22.5.0
- Update broken /launch-nx links ([#34192](https://github.com/nrwl/nx/pull/34192)) — 22.5.0
- Update dead links ([#34238](https://github.com/nrwl/nx/pull/34238)) — 22.5.0
- Fix link check caching ([#34255](https://github.com/nrwl/nx/pull/34255)) — 22.5.0
- Improve plugin registry visibility ([#34395](https://github.com/nrwl/nx/pull/34395)) — 22.5.1
- Add missing nx-cloud intro in sidebar ([#34403](https://github.com/nrwl/nx/pull/34403)) — 22.5.1
- Clarify project linking for workspaces ([#34405](https://github.com/nrwl/nx/pull/34405)) — 22.5.1
- Use shared preview URL for Netlify deploy ([#34467](https://github.com/nrwl/nx/pull/34467)) — 22.5.2
- Widen search dialog ([#34504](https://github.com/nrwl/nx/pull/34504)) — 22.5.2
- Update breadcrumb links to match sidebar ([#34500](https://github.com/nrwl/nx/pull/34500)) — 22.5.2
- Correct interpolate sub command for CLI reference ([#34585](https://github.com/nrwl/nx/pull/34585)) — 22.5.3
- Move redirects from Next.js config to Netlify _redirects ([#34612](https://github.com/nrwl/nx/pull/34612)) — 22.5.3
- Rewrite Framer URLs to nx.dev in HTML responses ([#34445](https://github.com/nrwl/nx/pull/34445)) — 22.5.2

---

## Miscellaneous

### CLI

- Improve FreeBSD build reliability ([#34326](https://github.com/nrwl/nx/pull/34326)) — 22.5.0
- Align pnpm version in CI workflows with package.json ([#34370](https://github.com/nrwl/nx/pull/34370)) — 22.5.0
- Replace addnab/docker-run-action with direct docker run ([#34448](https://github.com/nrwl/nx/pull/34448)) — 22.5.1
- Remove chalk from e2e tests ([#34570](https://github.com/nrwl/nx/pull/34570)) — 22.5.3
- Fix e2e CI failures from Node 22.12 incompatibility ([#34501](https://github.com/nrwl/nx/pull/34501)) — 22.5.2
- Add timeout to runCommandUntil to prevent hanging tests ([#34148](https://github.com/nrwl/nx/pull/34148)) — 22.5.0

### Linear

- Account deletion request ([CLOUD-4062](https://linear.app/nrwl/issue/CLOUD-4062))
- Data modification requests ([CLOUD-4282](https://linear.app/nrwl/issue/CLOUD-4282), [CLOUD-4167](https://linear.app/nrwl/issue/CLOUD-4167))
- Investigate plugin worker timeout regression for Anaplan ([NXC-3786](https://linear.app/nrwl/issue/NXC-3786))
- Next.js Jest tests do not exit properly ([NXC-3505](https://linear.app/nrwl/issue/NXC-3505))
- Handle ^{projectRoot} inputs ([NXC-3249](https://linear.app/nrwl/issue/NXC-3249))
- CI Monitoring: chokidar peer dep conflict ([NXC-3768](https://linear.app/nrwl/issue/NXC-3768))
- Investigate Nx Console IntelliJ tasks flakes ([NXC-3777](https://linear.app/nrwl/issue/NXC-3777))
- Update Privacy Policy and Prompt ([NXC-3736](https://linear.app/nrwl/issue/NXC-3736))
- LLM-enhanced flakiness detection simulation ([Q-106](https://linear.app/nrwl/issue/Q-106), [Q-107](https://linear.app/nrwl/issue/Q-107))
- Enterprise audit log — RBC accepts functionality ([Q-131](https://linear.app/nrwl/issue/Q-131))
- Reverse trial billing — audit transactional emails ([Q-132](https://linear.app/nrwl/issue/Q-132))
- 2026.01 on-prem release changelog ([Q-178](https://linear.app/nrwl/issue/Q-178))
- Nx Cloud decrypt CLI command ([Q-177](https://linear.app/nrwl/issue/Q-177))

---

## Linear Project Status

### Active / In Progress

| Project | Lead | Link |
| ------- | ---- | ---- |
| Task Sandboxing (Input/Output Tracing) | Rares, Louie | [View](https://linear.app/nrwl/project/task-sandboxing-input-output-tracing) |
| CLI Agentic Experience (AX) | Max, Colum | [View](https://linear.app/nrwl/project/cli-agentic-experience-ax) |
| Self-Healing CI | James, Mark | [View](https://linear.app/nrwl/project/self-healing-ci) |
| Polygraph AI | Jon, Victor | [View](https://linear.app/nrwl/project/polygraph-ai) |
| 600 Workspaces Connected Every Week | Nicole, Dillon | [View](https://linear.app/nrwl/project/600-workspaces-connected-every-week) |
| Framer Migration | Ben | [View](https://linear.app/nrwl/project/framer-migration) |
| Continuous Assignment of Tasks | Altan | [View](https://linear.app/nrwl/project/continuous-assignment-of-tasks) |
| Gradle Plugin for Nx | Louie, Jason | [View](https://linear.app/nrwl/project/gradle-plugin-for-nx) |
| Maven Support | Jason | [View](https://linear.app/nrwl/project/maven-support) |
| Review Nx Resource Usage | Leosvel | [View](https://linear.app/nrwl/project/review-nx-resource-usage) |
| Workspace Visibility | Mark | [View](https://linear.app/nrwl/project/workspace-visibility) |
| Content and Structure Improvements | Jack, Caleb | [View](https://linear.app/nrwl/project/content-and-structure-improvements) |

### Issues Completed: ~460 across 6 teams

NXC: 84 · CLOUD: 85 · INF: 60 · NXA: 111 · Q: 89 · DOC: 25

_Generated on 2026-03-05._
