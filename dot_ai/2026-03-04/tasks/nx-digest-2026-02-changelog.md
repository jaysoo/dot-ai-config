# Nx Platform Changelog — February 2026

> **Sources:** Nx CLI GitHub releases (nrwl/nx), Nx Cloud public changelog, nrwl/cloud-infrastructure commits, Linear (all teams).

---

## AI-Powered Development

### CLI

- Improve `configure-ai-agents` to copy Nx skills/subagents/plugins ([#34176](https://github.com/nrwl/nx/pull/34176)) — 22.5.0
- Improve AI agent rules for CLAUDE.md generation ([#34304](https://github.com/nrwl/nx/pull/34304)) — 22.5.0
- Add AI agent detection and NDJSON output for CNW ([#34320](https://github.com/nrwl/nx/pull/34320)) — 22.5.0
- Add Nx Cloud connect URL to template README ([#34249](https://github.com/nrwl/nx/pull/34249)) — 22.5.0
- Add decorative banners for Nx Cloud CNW completion message ([#34270](https://github.com/nrwl/nx/pull/34270)) — 22.5.0
- Update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.5.1
- Handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.5.1
- Extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.5.1
- Update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.5.1
- Lock in CNW variant 2 with deferred connection ([#34416](https://github.com/nrwl/nx/pull/34416)) — 22.5.1
- Add agentic mode to `nx init` ([#34418](https://github.com/nrwl/nx/pull/34418)) — 22.6.0-beta.0
- Automatically set up AI agents in CNW/init when run from within an AI agent ([#34469](https://github.com/nrwl/nx/pull/34469)) — 22.6.0-beta.0
- Implement `configure-ai-agents` outdated message after tasks ([#34463](https://github.com/nrwl/nx/pull/34463)) — 22.6.0-beta.0
- Improve Codex support for configure-ai-agents ([#34488](https://github.com/nrwl/nx/pull/34488)) — 22.6.0-beta.0
- Improve AX of `configure-ai-agents` with auto-detection ([#34496](https://github.com/nrwl/nx/pull/34496)) — 22.6.0-beta.3
- Add AI agent mode to `nx import` ([#34498](https://github.com/nrwl/nx/pull/34498)) — 22.6.0-beta.3
- Add `--json` flag for better AX to `nx list` ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.5.3
- Add passthrough for `nx-cloud apply-locally` command ([#34557](https://github.com/nrwl/nx/pull/34557)) — 22.5.3
- Add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580)) — 22.5.3
- Fix: make sure MCP args aren't overridden in `configure-ai-agents` ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.5.1
- Fix: handle Ctrl+C gracefully in `configure-ai-agents` — 22.5.2
- Fix: only pull `configure-ai-agents` from latest if local version is not latest ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.5.2
- Fix: preserve existing source properties in claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.5.3
- Fix: tweak `configure-ai-agents` messaging ([#34307](https://github.com/nrwl/nx/pull/34307)) — 22.5.0
- Fix CNW git amend and README marker handling ([#34306](https://github.com/nrwl/nx/pull/34306)) — 22.5.0
- Fix: preserve nxCloud=skip in non-interactive CNW mode ([#34616](https://github.com/nrwl/nx/pull/34616)) — 22.5.3
- Fix: prevent nxCloudId from being generated for new workspaces ([#34532](https://github.com/nrwl/nx/pull/34532)) — 22.5.2

### CLI — Linear

- Enhance `nx list <plugin>` with paths and JSON output ([NXC-3809](https://linear.app/nrwl/issue/NXC-3809))
- Collect benchmark data for MCP blog post ([NXC-3792](https://linear.app/nrwl/issue/NXC-3792))
- Set up CNW benchmarks for AX ([NXC-3830](https://linear.app/nrwl/issue/NXC-3830))
- Improve CLI output for `configure-ai-agents` setup ([NXC-3791](https://linear.app/nrwl/issue/NXC-3791))
- Ship CI monitor skill & agent ([NXA-955](https://linear.app/nrwl/issue/NXA-955))
- Create nx-workspace and related OSS skills ([NXA-954](https://linear.app/nrwl/issue/NXA-954))
- Configure-ai-agents one-liner setup ([NXA-918](https://linear.app/nrwl/issue/NXA-918))
- Benchmark generator vs MCP-based approach for e2e AX ([NXA-952](https://linear.app/nrwl/issue/NXA-952))

### Cloud — Self-Healing CI

- Self-Healing CI setup for BitBucket and Azure DevOps — 2602.02.4
- Auto-apply fix recommendations shown inline in settings and during fix flow — 2602.03.2
- Detailed failure reasons in Technical Details for system admins — 2602.12.5
- Remove experimental badge from AI features — 2602.18.3
- Auto-apply recommendations highlighted in VCS comments and `apply-locally` CLI — 2602.19.6
- Self-Healing CI opt-in during repository onboarding (checkbox, enabled by default) — 2602.26.2
- Self-healing PR auto-merge ([NXA-981](https://linear.app/nrwl/issue/NXA-981))
- Track self-healing fix acceptance rate ([NXA-956](https://linear.app/nrwl/issue/NXA-956))
- Agent commits/pushes unrelated local changes after applying fix ([NXA-983](https://linear.app/nrwl/issue/NXA-983)) — fixed
- CI monitor commits unrelated local changes (git add -A) ([NXA-951](https://linear.app/nrwl/issue/NXA-951)) — fixed

### Cloud — Polygraph AI

- Implement GitHub Actions integrations ([NXA-1014](https://linear.app/nrwl/issue/NXA-1014))
- Graph visualization with edge drawing ([NXA-970](https://linear.app/nrwl/issue/NXA-970))
- Cross-repo plan mode being battle-tested ([NXA-1024](https://linear.app/nrwl/issue/NXA-1024))
- Remove deprecated MCP tools ([NXA-926](https://linear.app/nrwl/issue/NXA-926))

### Docs

- Add `llms-full.txt` and HTTP Link headers for LLM discovery ([#34232](https://github.com/nrwl/nx/pull/34232)) — 22.5.0
- Add server-side page view tracking for docs ([#34283](https://github.com/nrwl/nx/pull/34283)) — 22.5.0
- Additional Discovery Mechanisms ([DOC-390](https://linear.app/nrwl/issue/DOC-390))

---

## Task Sandboxing & Hermetic Builds

### CLI

- Add initial impl of task IO service ([#34205](https://github.com/nrwl/nx/pull/34205)) — 22.5.0
- Add command to download cloud client ([#34333](https://github.com/nrwl/nx/pull/34333)) — 22.5.0
- Track all task outputs regardless of path depth ([#34321](https://github.com/nrwl/nx/pull/34321)) — 22.5.0
- Disable ignore filters for outputs expansion ([#34316](https://github.com/nrwl/nx/pull/34316)) — 22.5.0
- CLI command to report inputs/outputs for task verification ([NXC-3740](https://linear.app/nrwl/issue/NXC-3740))
- Add `--inputs`/`--check-input`/`--outputs`/`--check-output` flags to `nx show target` ([NXC-3762](https://linear.app/nrwl/issue/NXC-3762), [NXC-3763](https://linear.app/nrwl/issue/NXC-3763), [NXC-3764](https://linear.app/nrwl/issue/NXC-3764))
- Expand hash inputs in TaskIOService for cloud consumption ([NXC-3761](https://linear.app/nrwl/issue/NXC-3761))
- NX CLI PID Listeners for IO tracing ([NXC-3728](https://linear.app/nrwl/issue/NXC-3728))
- Filter non-cacheable and continuous tasks from sandbox violations ([NXC-3951](https://linear.app/nrwl/issue/NXC-3951))
- Ignore node_modules and out-of-workspace files from analysis ([NXC-3826](https://linear.app/nrwl/issue/NXC-3826))
- Fix: cloud runner missing outputs from multi-command run-commands ([NXC-3897](https://linear.app/nrwl/issue/NXC-3897))
- Fix: run-commands handle multiple PIDs ([NXC-3907](https://linear.app/nrwl/issue/NXC-3907))
- Fix: outputs empty on CI ([NXC-3834](https://linear.app/nrwl/issue/NXC-3834))
- Fix: not all file reads and writes captured ([NXC-3835](https://linear.app/nrwl/issue/NXC-3835))
- Fix: daemon does not detect all tasks ([NXC-3841](https://linear.app/nrwl/issue/NXC-3841))
- Fix: output files should be relative to workspace dir ([NXC-3844](https://linear.app/nrwl/issue/NXC-3844))
- Fix: traced task missing filesWritten for tar.gz from run-commands ([NXC-3863](https://linear.app/nrwl/issue/NXC-3863))
- Fix: only listen for file events in the workspace directory ([NXC-3837](https://linear.app/nrwl/issue/NXC-3837))
- Upload raw task file to gcloud bucket ([NXC-3839](https://linear.app/nrwl/issue/NXC-3839))
- Dogfood sandboxing in Nx ([NXC-3658](https://linear.app/nrwl/issue/NXC-3658)) and Ocean ([NXC-3659](https://linear.app/nrwl/issue/NXC-3659))

### Cloud

- UI Anomaly Display with violation banners ([Q-127](https://linear.app/nrwl/issue/Q-127))
- nx-api Anomaly Endpoint ([Q-126](https://linear.app/nrwl/issue/Q-126))
- Task list warning indicators for trace issues ([Q-208](https://linear.app/nrwl/issue/Q-208))
- IO trace analysis section in task details view ([Q-209](https://linear.app/nrwl/issue/Q-209))
- Download raw report button ([Q-215](https://linear.app/nrwl/issue/Q-215))
- Strict mode toggle UI ([Q-187](https://linear.app/nrwl/issue/Q-187))
- Strict mode violations should fail DTE ([Q-188](https://linear.app/nrwl/issue/Q-188))
- Anomaly report log API endpoint ([Q-193](https://linear.app/nrwl/issue/Q-193))
- Show sandbox violation banner for WARNING mode ([Q-207](https://linear.app/nrwl/issue/Q-207))
- Use virtualized views for file tree ([Q-248](https://linear.app/nrwl/issue/Q-248))
- Display process command ([Q-257](https://linear.app/nrwl/issue/Q-257))
- Expose PID and command for file read/write ([Q-246](https://linear.app/nrwl/issue/Q-246))
- Add missed read/writes to Mongo stats ([Q-228](https://linear.app/nrwl/issue/Q-228))
- Ensure sandbox reports get evicted from DB ([Q-204](https://linear.app/nrwl/issue/Q-204))
- nx-cloud runner unique id in marker file ([Q-186](https://linear.app/nrwl/issue/Q-186))
- Avoid showing sandbox UI if no report present ([Q-229](https://linear.app/nrwl/issue/Q-229))
- Filter out reads from outside workspace root ([Q-256](https://linear.app/nrwl/issue/Q-256))
- Activate signal file creation on Nx repo ([Q-245](https://linear.app/nrwl/issue/Q-245))
- Skip generating signal file for cache hits, non-cacheable, continuous tasks ([Q-241](https://linear.app/nrwl/issue/Q-241))
- Activate tracing in Ocean ([Q-196](https://linear.app/nrwl/issue/Q-196))
- Enable sandboxing env vars on staging ([Q-244](https://linear.app/nrwl/issue/Q-244))
- API endpoint for persisting IO tracing reports from Nx Agents — 2602.12.11
- Container PID to Host PID Mapping ([Q-81](https://linear.app/nrwl/issue/Q-81))
- Task Tracker + IO Buffer ([Q-82](https://linear.app/nrwl/issue/Q-82))
- Task Completion + Deduplication + JSON Output ([Q-84](https://linear.app/nrwl/issue/Q-84))
- Signal File Detection + Basic Task Creation ([Q-80](https://linear.app/nrwl/issue/Q-80))
- Deploy IO Trace Daemon to Snapshot via Kustomize ([Q-114](https://linear.app/nrwl/issue/Q-114))
- Update Nx client to use nx-io-trace- filename prefix ([Q-151](https://linear.app/nrwl/issue/Q-151))
- Fix: OOM kills on daemon pod ([Q-195](https://linear.app/nrwl/issue/Q-195))
- Fix: daemon over-sending task completion reports ([Q-232](https://linear.app/nrwl/issue/Q-232))
- Fix: internal server error 500 on daemon ([Q-235](https://linear.app/nrwl/issue/Q-235))
- Fix: missing raw file when sandbox report exists ([Q-233](https://linear.app/nrwl/issue/Q-233))

### Infrastructure

- Create SA for io-trace-daemon to upload to workflows bucket
- Add io-tracing SAs to GCP and AWS single-tenants
- Enable io-trace-daemon on staging
- Deploy io-tracer to staging with Helm chart
- Create new internal Helm chart for io-tracing
- Enable sandboxing on staging and snapshot
- Move tracer into its own namespace

---

## Framer Migration

### Cloud

- Migrate Homepage ([CLOUD-4089](https://linear.app/nrwl/issue/CLOUD-4089))
- Migrate Nx Cloud page ([CLOUD-4087](https://linear.app/nrwl/issue/CLOUD-4087))
- Migrate Enterprise page ([CLOUD-4086](https://linear.app/nrwl/issue/CLOUD-4086))
- Migrate Pricing page with cards and comparison table ([CLOUD-4075](https://linear.app/nrwl/issue/CLOUD-4075), [CLOUD-4287](https://linear.app/nrwl/issue/CLOUD-4287))
- Migrate Community page ([CLOUD-4085](https://linear.app/nrwl/issue/CLOUD-4085))
- Migrate Company page ([CLOUD-4084](https://linear.app/nrwl/issue/CLOUD-4084))
- Migrate Resources page ([CLOUD-4083](https://linear.app/nrwl/issue/CLOUD-4083))
- Migrate Customers page ([CLOUD-4082](https://linear.app/nrwl/issue/CLOUD-4082))
- Migrate Brands page ([CLOUD-4081](https://linear.app/nrwl/issue/CLOUD-4081))
- Migrate Partners page ([CLOUD-4078](https://linear.app/nrwl/issue/CLOUD-4078))
- Migrate Security page ([CLOUD-4098](https://linear.app/nrwl/issue/CLOUD-4098))
- Migrate Remote Cache page ([CLOUD-4097](https://linear.app/nrwl/issue/CLOUD-4097))
- Migrate all Contact pages ([CLOUD-4103](https://linear.app/nrwl/issue/CLOUD-4103), [CLOUD-4102](https://linear.app/nrwl/issue/CLOUD-4102), [CLOUD-4101](https://linear.app/nrwl/issue/CLOUD-4101), [CLOUD-4100](https://linear.app/nrwl/issue/CLOUD-4100), [CLOUD-4099](https://linear.app/nrwl/issue/CLOUD-4099))
- Migrate all Solutions pages ([CLOUD-4124](https://linear.app/nrwl/issue/CLOUD-4124), [CLOUD-4123](https://linear.app/nrwl/issue/CLOUD-4123), [CLOUD-4122](https://linear.app/nrwl/issue/CLOUD-4122), [CLOUD-4121](https://linear.app/nrwl/issue/CLOUD-4121))
- Migrate Java and React pages ([CLOUD-4236](https://linear.app/nrwl/issue/CLOUD-4236), [CLOUD-4237](https://linear.app/nrwl/issue/CLOUD-4237))
- Migrate 404, Careers pages ([CLOUD-4238](https://linear.app/nrwl/issue/CLOUD-4238), [CLOUD-4239](https://linear.app/nrwl/issue/CLOUD-4239))
- Migrate new header with mega menu ([CLOUD-4263](https://linear.app/nrwl/issue/CLOUD-4263))
- Consolidate marketing scripts into GTM ([CLOUD-4252](https://linear.app/nrwl/issue/CLOUD-4252))
- Add Framer event tracking bridge to GTM ([CLOUD-4202](https://linear.app/nrwl/issue/CLOUD-4202))
- Add custom tracking events ([CLOUD-4256](https://linear.app/nrwl/issue/CLOUD-4256))
- Set canonical URL in Framer to point to nx.dev ([CLOUD-4148](https://linear.app/nrwl/issue/CLOUD-4148))
- Enable rewrites for all Framer pages on canary ([CLOUD-4269](https://linear.app/nrwl/issue/CLOUD-4269))
- Review SEO titles and descriptions for all pages ([CLOUD-4283](https://linear.app/nrwl/issue/CLOUD-4283))
- Address Victor & Heidi feedback ([CLOUD-4293](https://linear.app/nrwl/issue/CLOUD-4293))
- Update website copy for new brand messaging ([CLOUD-4284](https://linear.app/nrwl/issue/CLOUD-4284))

### CLI

- Rewrite Framer URLs to nx.dev in HTML responses ([#34445](https://github.com/nrwl/nx/pull/34445)) — 22.5.2

---

## Performance & Core

### CLI

- Use jemalloc with tuned decay timers for native module ([#34444](https://github.com/nrwl/nx/pull/34444)) — 22.6.0-beta.7
- Cache compiled glob patterns in native module — 95.6% cache hit rate ([NXC-3960](https://linear.app/nrwl/issue/NXC-3960))
- Reduce/avoid graph recomputations ([NXC-3904](https://linear.app/nrwl/issue/NXC-3904))
- Eagerly shutdown plugins that don't provide later hooks ([#34253](https://github.com/nrwl/nx/pull/34253)) — 22.5.0
- Reduce daemon inotify watch count by upgrading watchexec ([#34329](https://github.com/nrwl/nx/pull/34329)) — 22.5.0
- Use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.5.3
- Use picocolors instead of chalk in the nx package ([#34305](https://github.com/nrwl/nx/pull/34305)) — 22.5.0
- Use static_vcruntime to avoid msvcrt dependency ([#19781](https://github.com/nrwl/nx/pull/19781)) — 22.5.2
- Add commands for debugging cache inputs/outputs ([#34414](https://github.com/nrwl/nx/pull/34414)) — 22.6.0-beta.2
- Add `--stdin` to affected options ([#34435](https://github.com/nrwl/nx/pull/34435)) — 22.6.0-beta.0
- Support dependency filesets with `^{projectRoot}` syntax ([#34310](https://github.com/nrwl/nx/pull/34310)) — 22.6.0-beta.0
- Add `--otp` to top-level `nx release` command and detect EOTP errors ([#34473](https://github.com/nrwl/nx/pull/34473)) — 22.6.0-beta.0
- Add negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160)) — 22.5.1
- Add yarn berry catalog support ([#34552](https://github.com/nrwl/nx/pull/34552)) — 22.6.0-beta.3
- NX_SKIP_FORMAT env var to skip Prettier formatting ([#34336](https://github.com/nrwl/nx/pull/34336)) — 22.6.0-beta.0
- Fix: move TUI to parking lot rwlock to avoid hang ([#34187](https://github.com/nrwl/nx/pull/34187)) — 22.5.0
- Fix: resolve daemon client reconnect queue deadlock ([#34284](https://github.com/nrwl/nx/pull/34284)) — 22.5.0
- Fix: handle multibyte UTF-8 characters in socket message consumption ([#34151](https://github.com/nrwl/nx/pull/34151)) — 22.5.0
- Fix: skip stale recomputations and prevent lost file changes in daemon ([#34424](https://github.com/nrwl/nx/pull/34424)) — 22.5.2
- Fix: reduce terminal output duplication and allocations in task runner ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.5.2
- Fix: prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.5.2
- Fix: replace buggy ignore-files trie with correct path-component gitignore matching ([#34447](https://github.com/nrwl/nx/pull/34447)) — 22.5.2
- Fix: avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.5.2
- Fix: gate tui-logger init behind `NX_TUI` env var ([#34426](https://github.com/nrwl/nx/pull/34426)) — 22.5.2
- Fix: handle EPIPE errors gracefully in daemon socket writes ([#34311](https://github.com/nrwl/nx/pull/34311)) — 22.5.0
- Fix: preserve task selection when unrelated tasks finish ([#34328](https://github.com/nrwl/nx/pull/34328)) — 22.5.0
- Fix: handle resizing better for inline TUI ([#34006](https://github.com/nrwl/nx/pull/34006)) — 22.5.0
- Fix: avoid crash when pane area is out of bounds during resize ([#34343](https://github.com/nrwl/nx/pull/34343)) — 22.5.0
- Fix: use consistent batch id between scheduler and task runner ([#34392](https://github.com/nrwl/nx/pull/34392)) — 22.5.1
- Fix: make runtime cache key deterministic ([#34390](https://github.com/nrwl/nx/pull/34390)) — 22.5.1
- Fix: handle dangling symlinks during cache restore ([#34396](https://github.com/nrwl/nx/pull/34396)) — 22.5.1
- Fix: retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.5.3
- Fix: reject pending promises directly when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.5.3
- Fix: use scoped cache key for unresolved npm imports in TargetProjectLocator ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.5.3
- Fix: handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.5.3
- Fix: commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.5.2
- Fix: make watch command work with all and initialRun specified ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.5.3
- Fix: show correct status for stopped continuous tasks ([#34226](https://github.com/nrwl/nx/pull/34226)) — 22.6.0-beta.4
- Fix: hitting [1] or [2] should remove pinned panes if they match ([#34433](https://github.com/nrwl/nx/pull/34433)) — 22.5.1
- Fix: clean up daemon workspace data directory on `nx reset --only=daemon` ([#34174](https://github.com/nrwl/nx/pull/34174)) — 22.5.0
- Fix: clean up stale socket files before listening ([#34236](https://github.com/nrwl/nx/pull/34236)) — 22.5.1
- Fix: fall back to node_modules when tmp has noexec ([#34207](https://github.com/nrwl/nx/pull/34207)) — 22.5.0
- Fix: cloud commands are noop when not connected rather than errors ([#34193](https://github.com/nrwl/nx/pull/34193)) — 22.5.0
- Fix: hide already-installed nx packages from suggestion list during `nx import` ([#34227](https://github.com/nrwl/nx/pull/34227)) — 22.5.0
- Fix: improve plugin worker error messages and lifecycle timeouts ([#34251](https://github.com/nrwl/nx/pull/34251)) — 22.5.0
- Fix: do not throw error if worker.stdout is not instanceof socket ([#34224](https://github.com/nrwl/nx/pull/34224)) — 22.5.0
- Fix: `nx show` help for run-one with project short names ([#34303](https://github.com/nrwl/nx/pull/34303)) — 22.5.0
- Fix: allow overriding daemon logging settings ([#34324](https://github.com/nrwl/nx/pull/34324)) — 22.5.0
- Fix: avoid dropping unrelated continuous deps in `makeAcyclic` ([#34389](https://github.com/nrwl/nx/pull/34389)) — 22.5.1
- Fix: only detect flaky tasks for cacheable tasks ([#33994](https://github.com/nrwl/nx/pull/33994)) — 22.5.0
- Fix: use workspace root for path resolution when baseUrl is not set ([#34453](https://github.com/nrwl/nx/pull/34453)) — 22.5.2
- Fix: consolidate GitHub URL messaging when gh push fails ([#34196](https://github.com/nrwl/nx/pull/34196)) — 22.5.0
- Fix: add missing FileType import for Windows watcher build ([#34369](https://github.com/nrwl/nx/pull/34369)) — 22.5.0
- Fix: use --lockfile-only for Bun updateLockFile ([#34375](https://github.com/nrwl/nx/pull/34375)) — 22.5.0

### Cloud

- Resolve crash when daemon enabled with particularly large runs — 2602.10.2
- Task list sorting stability fix (equal duration/start time) — 2602.23.8
- Fix search parameters persisting between task and flaky task analytics — 2602.09.7

### Infrastructure

- Workflow Controller multi-replica support: async processing enabled in prod and all single tenants, feature flag removed
- Workflow Controller graceful rollouts fixed ([INF-752](https://linear.app/nrwl/issue/INF-752))
- Workflow Controller explicit `Command` on agents container ([INF-1137](https://linear.app/nrwl/issue/INF-1137))
- Workflow Controller signal handling (SIGTERM/SIGINT) ([INF-1133](https://linear.app/nrwl/issue/INF-1133))
- Workflow Controller disk size per resourceclass, subpath volumes ([INF-1129](https://linear.app/nrwl/issue/INF-1129), [INF-1130](https://linear.app/nrwl/issue/INF-1130), [INF-1131](https://linear.app/nrwl/issue/INF-1131))

---

## Onboarding & Workspace Connection

### Cloud

- /guide route updates for CNW users ([CLOUD-4305](https://linear.app/nrwl/issue/CLOUD-4305))
- Welcome view experiment Feb 23 ([CLOUD-4304](https://linear.app/nrwl/issue/CLOUD-4304))
- Experiment Feb 16 ([CLOUD-4288](https://linear.app/nrwl/issue/CLOUD-4288))
- Experiment Feb 13 — revert to previous prompts ([CLOUD-4255](https://linear.app/nrwl/issue/CLOUD-4255))
- Experiment Feb 6 — refine cloud prompt from CNW ([CLOUD-4235](https://linear.app/nrwl/issue/CLOUD-4235))
- Update CNW cloud prompt with explicit opt-out ([CLOUD-4242](https://linear.app/nrwl/issue/CLOUD-4242))
- Replace browser-based CNW bottom sheet ([CLOUD-4221](https://linear.app/nrwl/issue/CLOUD-4221))
- One-page GitHub/GitLab flow UI updates ([CLOUD-4119](https://linear.app/nrwl/issue/CLOUD-4119))
- Simplify VCS integration forms — 2602.17.4
- Allow workspace connection with PNPM catalogs through GH/GL — 2602.19.9
- Link to create workspace for CNW users — 2602.27.7
- Fix: `nx login` doesn't handle trailing slash ([CLOUD-4275](https://linear.app/nrwl/issue/CLOUD-4275))
- Fix: onboarding fails with pnpm catalogs ([CLOUD-4031](https://linear.app/nrwl/issue/CLOUD-4031))
- Fix: CNW form "Update permissions" button missing ([CLOUD-4089](https://linear.app/nrwl/issue/CLOUD-4089)) — 2602.03.1
- Fix: GH app button fix in browser-based onboarding ([CLOUD-4224](https://linear.app/nrwl/issue/CLOUD-4224))

---

## Security

### CLI

- **CVE-2026-26996**: Bump minimatch to 10.2.1 to address ReDoS vulnerability ([#34509](https://github.com/nrwl/nx/pull/34509)) — 22.5.3
- Prevent command injection in getNpmPackageVersion ([#34309](https://github.com/nrwl/nx/pull/34309)) — 22.5.0
- Remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.5.1
- Security email should not be used for outdated package reports ([NXC-3898](https://linear.app/nrwl/issue/NXC-3898))

### Cloud

- Access control settings require confirmation before saving — 2602.11.1

### Infrastructure

- IAM binding → member migration across staging, prod, and all single tenants ([INF-1202](https://linear.app/nrwl/issue/INF-1202), [INF-1205](https://linear.app/nrwl/issue/INF-1205), [INF-1206](https://linear.app/nrwl/issue/INF-1206), [INF-1208](https://linear.app/nrwl/issue/INF-1208))
- IAM access key rotation (Vanta compliance) ([INF-1190](https://linear.app/nrwl/issue/INF-1190), [INF-1189](https://linear.app/nrwl/issue/INF-1189), [INF-1192](https://linear.app/nrwl/issue/INF-1192))

---

## JVM Ecosystem

### CLI

- Display batch tasks in the TUI ([#33695](https://github.com/nrwl/nx/pull/33695)) — 22.5.0
- Add debug env var to Gradle batch executor ([#34259](https://github.com/nrwl/nx/pull/34259)) — 22.5.0
- Add `preferBatch` executor option ([#34293](https://github.com/nrwl/nx/pull/34293)) — 22.6.0-beta.3
- Load Maven classes at runtime for version-agnostic batch execution ([#34180](https://github.com/nrwl/nx/pull/34180)) — 22.5.0
- Bump maven plugin version to 0.0.13 ([#34318](https://github.com/nrwl/nx/pull/34318)) — 22.5.0
- Fix: use tooling API compatible flags for Gradle ([#34247](https://github.com/nrwl/nx/pull/34247)) — 22.5.0
- Fix: ensure batch output not overridden for atomized targets ([#34268](https://github.com/nrwl/nx/pull/34268)) — 22.5.0
- Fix: enforce single gradle task per executor invocation ([#34269](https://github.com/nrwl/nx/pull/34269)) — 22.5.0
- Fix: use gradle project name when resolving dependent tasks ([#34331](https://github.com/nrwl/nx/pull/34331)) — 22.5.0
- Fix: include pom.xml and ancestor pom files as inputs ([#34291](https://github.com/nrwl/nx/pull/34291)) — 22.5.0
- Fix: Maven write output after each task in batch mode ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.5.2
- Fix: correctly map between Maven locators and Nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.5.1
- Fix: Maven cache transfer between createNodes and createDependencies ([#34386](https://github.com/nrwl/nx/pull/34386)) — 22.5.1
- Fix: Maven set pom file without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.5.3
- Fix: ensure atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.5.3
- Fix: use globs for dependent task output files ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.5.3
- Fix: synchronize Maven batch runner invoke() ([#34600](https://github.com/nrwl/nx/pull/34600)) — 22.6.0-beta.7
- Update Maven & Gradle icons to Java Duke icon ([#34508](https://github.com/nrwl/nx/pull/34508)) — 22.5.3
- Support canonical SSH URLs in `nx release` ([#31684](https://github.com/nrwl/nx/pull/31684)) — 22.6.0-beta.7

### Linear

- Enable batch mode for Gradle in Ocean ([NXC-3957](https://linear.app/nrwl/issue/NXC-3957))
- CLIENT ADP: CI blocking when multiple Gradle tasks run on same agent ([NXC-3779](https://linear.app/nrwl/issue/NXC-3779))
- Ocean UI graph generation slow, crashes with Java OOM ([NXC-3958](https://linear.app/nrwl/issue/NXC-3958))
- Update Gradle docs with batch mode ([NXC-3780](https://linear.app/nrwl/issue/NXC-3780))

---

## Ecosystem & Framework Support

### CLI

- Add NX_PREFER_NODE_STRIP_TYPES to use Node's strip types feature ([#34202](https://github.com/nrwl/nx/pull/34202)) — 22.5.0
- Bump swc to latest versions ([#34215](https://github.com/nrwl/nx/pull/34215)) — 22.5.0
- Update swc/cli to 0.8.0 ([#34365](https://github.com/nrwl/nx/pull/34365)) — 22.5.0
- Use caret range for swc dependencies in pnpm catalog ([#34487](https://github.com/nrwl/nx/pull/34487)) — 22.5.2
- Support Angular v21.2 ([#34592](https://github.com/nrwl/nx/pull/34592)) — 22.6.0-beta.6
- Support ESLint v10 ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.5.3
- Allow wildcard paths in enforce-module-boundaries ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.5.3
- Add cacheDir option to Playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.5.1
- Fix: allow null values in JSON schema validation ([#34167](https://github.com/nrwl/nx/pull/34167)) — 22.5.0
- Fix: handle sophisticated Vite plugins ([#34242](https://github.com/nrwl/nx/pull/34242)) — 22.5.0
- Fix: ensure Vitest config file is created ([#34216](https://github.com/nrwl/nx/pull/34216)) — 22.5.0
- Fix: reset daemon client after project graph creation in withNx ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.5.2
- Fix: skip unnecessary type-check in TS Solution Setup when skipTypeCheck is true ([#34493](https://github.com/nrwl/nx/pull/34493)) — 22.5.3
- Fix: regression on process.env usage for webpack ([#34583](https://github.com/nrwl/nx/pull/34583)) — 22.5.3
- Fix: ensure safe process.env fallback replacement for webpack ([#34464](https://github.com/nrwl/nx/pull/34464)) — 22.5.3
- Fix: remove file-loader dependency and update svgr migration ([#34218](https://github.com/nrwl/nx/pull/34218)) — 22.5.0
- Fix: preload vitest/node to prevent race condition on Node 24 ([#34261](https://github.com/nrwl/nx/pull/34261)) — 22.5.0
- Fix: use per-invocation cache in TS plugin for NX_ISOLATE_PLUGINS=false ([#34566](https://github.com/nrwl/nx/pull/34566)) — 22.5.3
- Fix: guard against undefined closest node in rehoistNodes ([#34347](https://github.com/nrwl/nx/pull/34347)) — 22.5.3
- Fix: remove redundant vite.config.ts generation for vitest projects ([#34603](https://github.com/nrwl/nx/pull/34603)) — 22.5.3
- Fix: use SASS indented syntax in Angular nx-welcome component ([#34510](https://github.com/nrwl/nx/pull/34510)) — 22.5.3
- Fix: add docs link to generatePackageJson error message ([#34562](https://github.com/nrwl/nx/pull/34562)) — 22.5.3
- Fix: surgical text replacement in Jest matcher alias migration ([#34350](https://github.com/nrwl/nx/pull/34350)) — 22.5.3
- Fix: isPreview=true for Vite Preview server ([#34597](https://github.com/nrwl/nx/pull/34597)) — 22.5.3
- Fix: `nx release` null-safe fallback for version in createGitTagValues ([#34598](https://github.com/nrwl/nx/pull/34598)) — 22.5.3
- Fix: `nx release` allow null values in schema of dockerVersion ([#34171](https://github.com/nrwl/nx/pull/34171)) — 22.5.3
- Fix: `nx release` remove unnecessary number from return type ([#34481](https://github.com/nrwl/nx/pull/34481)) — 22.5.2
- Backport: track all task outputs regardless of path depth ([#34321](https://github.com/nrwl/nx/pull/34321)) — 21.3.12

---

## Cloud UI & UX Fixes

### Cloud

- Enterprise contributor data renders regardless of license duration — 2602.09.5
- Compare Tasks shows "Originated from" link without requiring comparison — 2602.11.3
- Display contributors with null names as "No attribution" — 2602.20.1
- Nx Cloud runner properly constructs URLs with trailing slash — 2602.13.2
- Inline error instead of run 404 on task detail errors — 2602.18.13
- Fix: duplicate members when VCS connected ([CLOUD-4043](https://linear.app/nrwl/issue/CLOUD-4043))
- Fix: task analytics filters not working ([CLOUD-4025](https://linear.app/nrwl/issue/CLOUD-4025))
- Fix: 7-Eleven admin cannot access organization settings ([CLOUD-4173](https://linear.app/nrwl/issue/CLOUD-4173))
- Fix: theme switch crashes contact/sales page ([CLOUD-4276](https://linear.app/nrwl/issue/CLOUD-4276))
- Fix: Talk to Sales form stuck with ad blockers ([CLOUD-4273](https://linear.app/nrwl/issue/CLOUD-4273))
- Fix: task analytics shows no data with sortBy ([CLOUD-4249](https://linear.app/nrwl/issue/CLOUD-4249))
- Fix: resource usage page inconsistent peak memory ([CLOUD-4257](https://linear.app/nrwl/issue/CLOUD-4257))
- Fix: agent utilization shows wrong hung tasks ([CLOUD-4259](https://linear.app/nrwl/issue/CLOUD-4259))
- Fix: show distributed agent visualization on CIPE critical error ([CLOUD-4162](https://linear.app/nrwl/issue/CLOUD-4162))
- Fix: flaky tasks links for colon-named tasks return 404 ([CLOUD-4216](https://linear.app/nrwl/issue/CLOUD-4216))
- Fix: frequent frontend container restarts ([CLOUD-4222](https://linear.app/nrwl/issue/CLOUD-4222))
- Fix: view-logs requests causing pod restarts ([CLOUD-4210](https://linear.app/nrwl/issue/CLOUD-4210))
- Fix: restore logs stream migration to workers ([CLOUD-4217](https://linear.app/nrwl/issue/CLOUD-4217))
- Fix: contributors over period empty on enterprise usage screen ([CLOUD-4200](https://linear.app/nrwl/issue/CLOUD-4200))
- Fix: exclude null user commits from contributor count ([CLOUD-3568](https://linear.app/nrwl/issue/CLOUD-3568))

### Cloud — Nx Cloud CLI

- `decrypt-artifact` command for workspaces using client-side E2E encryption — 2602.12.6
- `nx-cloud decrypt` CLI command ([Q-177](https://linear.app/nrwl/issue/Q-177))

---

## Continuous Assignment of Tasks (DTE)

### Cloud

- Continuous assignment implementation ([Q-197](https://linear.app/nrwl/issue/Q-197))
- DTE scheduler refactor with branched implementation ([Q-189](https://linear.app/nrwl/issue/Q-189))
- DTE exporter support pulling ALL DTEs from run group ([Q-190](https://linear.app/nrwl/issue/Q-190))
- Benchmark tooling for seeding/executing multiple DTEs ([Q-191](https://linear.app/nrwl/issue/Q-191))
- Long-polling rework ([Q-165](https://linear.app/nrwl/issue/Q-165))
- Longer timeout support for /runs/end, /tasks, /status v2 ([Q-166](https://linear.app/nrwl/issue/Q-166), [Q-167](https://linear.app/nrwl/issue/Q-167), [Q-168](https://linear.app/nrwl/issue/Q-168))
- /executions v2 endpoints longer timeout support ([Q-180](https://linear.app/nrwl/issue/Q-180), [Q-181](https://linear.app/nrwl/issue/Q-181))
- Fix: non-cacheable tasks not guaranteed to run on requiring agent ([Q-205](https://linear.app/nrwl/issue/Q-205))
- Fix: analysis screen utilization always shows 0% ([Q-203](https://linear.app/nrwl/issue/Q-203))
- Fix: Redisson + Netty upgrade greatly increased direct memory use ([Q-212](https://linear.app/nrwl/issue/Q-212))
- Fix: nx-api memory leak ([Q-171](https://linear.app/nrwl/issue/Q-171))
- Fix: inconsistent affectedProjectRatio values ([Q-158](https://linear.app/nrwl/issue/Q-158))

---

## Docs & Developer Experience

### CLI / Docs

- Reformat sidebar into topics ([#34265](https://github.com/nrwl/nx/pull/34265)) — 22.5.0
- Fix broken /launch-nx links ([#34192](https://github.com/nrwl/nx/pull/34192)) — 22.5.0
- Update dead links across nx-dev UI libraries ([#34238](https://github.com/nrwl/nx/pull/34238)) — 22.5.0
- Fix internal link check caching ([#34255](https://github.com/nrwl/nx/pull/34255)) — 22.5.0
- Make headers and table options linkable ([#34267](https://github.com/nrwl/nx/pull/34267)) — 22.5.0
- Fix double-counting and exclude assets from page tracking ([#34286](https://github.com/nrwl/nx/pull/34286)) — 22.5.0
- Exclude large native deps from build bundle ([#34335](https://github.com/nrwl/nx/pull/34335)) — 22.5.0
- Fix OG images wrong URL for embeds ([#34346](https://github.com/nrwl/nx/pull/34346)) — 22.5.0
- Use right URL for the given Netlify context ([#34348](https://github.com/nrwl/nx/pull/34348)) — 22.5.0
- Include nx CLI examples on refs page ([#34367](https://github.com/nrwl/nx/pull/34367)) — 22.5.0
- Improve plugin registry visibility ([#34395](https://github.com/nrwl/nx/pull/34395)) — 22.5.1
- Add missing nx-cloud intro in sidebar ([#34403](https://github.com/nrwl/nx/pull/34403)) — 22.5.1
- Clarify project linking for workspaces ([#34405](https://github.com/nrwl/nx/pull/34405)) — 22.5.1
- Use shared preview URL for Netlify deploy ([#34467](https://github.com/nrwl/nx/pull/34467)) — 22.5.2
- Widen search dialog ([#34504](https://github.com/nrwl/nx/pull/34504)) — 22.5.2
- Update breadcrumb links to match sidebar ([#34500](https://github.com/nrwl/nx/pull/34500)) — 22.5.2
- Correct interpolate sub command for CLI reference ([#34585](https://github.com/nrwl/nx/pull/34585)) — 22.5.3
- Move redirects from Next.js config to Netlify _redirects ([#34612](https://github.com/nrwl/nx/pull/34612)) — 22.5.3

### Linear

- PoC for new sidebar structure ([DOC-365](https://linear.app/nrwl/issue/DOC-365))
- Improve AX for Getting Started / Intro pages ([DOC-405](https://linear.app/nrwl/issue/DOC-405))
- Dedupe content across all Getting Started pages ([DOC-406](https://linear.app/nrwl/issue/DOC-406))
- Propose structure and content for Technology pages ([DOC-407](https://linear.app/nrwl/issue/DOC-407))
- Update docs breadcrumbs to match new sidebar hierarchy ([DOC-400](https://linear.app/nrwl/issue/DOC-400))
- Condense and remove redirects ([DOC-403](https://linear.app/nrwl/issue/DOC-403))
- Switch DNS to Netlify for nx.dev ([DOC-397](https://linear.app/nrwl/issue/DOC-397))
- Investigate nx.dev outage reported for ~10 minutes ([DOC-415](https://linear.app/nrwl/issue/DOC-415))
- Blog not resolving due to too many redirects ([DOC-425](https://linear.app/nrwl/issue/DOC-425))
- Add redirect from /pricing to Nx Cloud plans section ([DOC-426](https://linear.app/nrwl/issue/DOC-426))
- Investigate boosting CLI command reference pages in search ([DOC-401](https://linear.app/nrwl/issue/DOC-401))
- Make "plugin registry" search show the plugin registry page ([DOC-409](https://linear.app/nrwl/issue/DOC-409))
- Search overlay layout changes with browser zoom ([DOC-410](https://linear.app/nrwl/issue/DOC-410))
- Document `checkAllBranchesWhen` type and behavior ([DOC-414](https://linear.app/nrwl/issue/DOC-414))
- Fix incorrect usage for `nx show projects` docs ([DOC-417](https://linear.app/nrwl/issue/DOC-417))
- Command examples missing on Nx commands reference page ([DOC-402](https://linear.app/nrwl/issue/DOC-402))
- Add Requirements section to relevant tech docs pages ([DOC-423](https://linear.app/nrwl/issue/DOC-423))
- Add screenshots to cache miss troubleshooting docs ([DOC-387](https://linear.app/nrwl/issue/DOC-387))
- Add anchor link UI for executor option sections ([DOC-383](https://linear.app/nrwl/issue/DOC-383))
- Better handling of preview deployments from community ([DOC-384](https://linear.app/nrwl/issue/DOC-384))
- Track page views on server-side ([DOC-395](https://linear.app/nrwl/issue/DOC-395))
- Document GitHub app permissions ([DOC-187](https://linear.app/nrwl/issue/DOC-187))
- Refresh GITHUB_TOKEN for docs ([DOC-396](https://linear.app/nrwl/issue/DOC-396))

---

## Enterprise & Single Tenant

### Infrastructure

- New single tenant: Wix (GCP) ([INF-1200](https://linear.app/nrwl/issue/INF-1200))
- New single tenant: Legora (GCP) ([INF-1217](https://linear.app/nrwl/issue/INF-1217))
- Cloudinary: SAML enabled, GitHub app vars configured ([INF-1213](https://linear.app/nrwl/issue/INF-1213), [INF-1214](https://linear.app/nrwl/issue/INF-1214))
- Celonis: S3 VPC endpoint support for ST artifacts ([INF-1194](https://linear.app/nrwl/issue/INF-1194))
- ClickUp: C3D nodes made generally available ([INF-1186](https://linear.app/nrwl/issue/INF-1186))
- Emeria: Node pool size increased
- Migrate AL2 agent nodegroups to AL2023 for tenants ([INF-969](https://linear.app/nrwl/issue/INF-969))
- Fix non-nx agent image story (forcing ENTRYPOINT)
- Remove direct upload from executor/log uploader ([INF-1140](https://linear.app/nrwl/issue/INF-1140))
- Podman/Buildah investigation ([INF-1139](https://linear.app/nrwl/issue/INF-1139))
- Explore alternatives to bitnami Valkey chart ([INF-1134](https://linear.app/nrwl/issue/INF-1134))
- Synthetic checks for tenants

### Cloud

- CIBC Custom Encryption Key Not Working with Azure — PoV blocker ([Q-221](https://linear.app/nrwl/issue/Q-221))
- 2026.01 on-prem release changelog ([Q-178](https://linear.app/nrwl/issue/Q-178))
- Itemize/audit transactional emails for enterprise trial expiry ([Q-132](https://linear.app/nrwl/issue/Q-132))
- RBC accepts audit log functionality ([Q-131](https://linear.app/nrwl/issue/Q-131))

---

## Support Infrastructure

### Customer Success

- Connect Pylon to Slack workspace ([CS-72](https://linear.app/nrwl/issue/CS-72))
- Connect Pylon to Teams workspace ([CS-75](https://linear.app/nrwl/issue/CS-75))
- Import customers from Salesforce, map DPE, import email mapping ([CS-78](https://linear.app/nrwl/issue/CS-78), [CS-79](https://linear.app/nrwl/issue/CS-79), [CS-81](https://linear.app/nrwl/issue/CS-81))
- Set up bi-directional sync with Linear ([CS-82](https://linear.app/nrwl/issue/CS-82), [CS-84](https://linear.app/nrwl/issue/CS-84), [CS-85](https://linear.app/nrwl/issue/CS-85))
- Gmail forwarding and cloud-support@nrwl.io setup ([CS-87](https://linear.app/nrwl/issue/CS-87), [CS-88](https://linear.app/nrwl/issue/CS-88))
- Create SLAs for all tiers ([CS-98](https://linear.app/nrwl/issue/CS-98), [CS-99](https://linear.app/nrwl/issue/CS-99), [CS-100](https://linear.app/nrwl/issue/CS-100), [CS-101](https://linear.app/nrwl/issue/CS-101), [CS-102](https://linear.app/nrwl/issue/CS-102))
- Assign SLAs to enterprise customers ([CS-104](https://linear.app/nrwl/issue/CS-104))
- Set up automations/escalations around SLA breaches ([CS-105](https://linear.app/nrwl/issue/CS-105))
- SLA breach notification to #support ([CS-107](https://linear.app/nrwl/issue/CS-107))
- Setup triggers, custom views, rotation, OOO handling ([CS-119](https://linear.app/nrwl/issue/CS-119), [CS-121](https://linear.app/nrwl/issue/CS-121), [CS-143](https://linear.app/nrwl/issue/CS-143), [CS-144](https://linear.app/nrwl/issue/CS-144))
- Support teams created ([CS-145](https://linear.app/nrwl/issue/CS-145))
- AI filter for billing issues as P1 ([CS-146](https://linear.app/nrwl/issue/CS-146))
- Map support hours & holidays ([CS-148](https://linear.app/nrwl/issue/CS-148))
- Define support hours & assignments for enterprise customers ([CS-149](https://linear.app/nrwl/issue/CS-149))
- Push unassigned tickets to #support ([CS-150](https://linear.app/nrwl/issue/CS-150))
- On SLA breach, push ticket into #sla-breach ([CS-151](https://linear.app/nrwl/issue/CS-151))
- Create views: "Attention Needed" and per-DPE views ([CS-152](https://linear.app/nrwl/issue/CS-152), [CS-153](https://linear.app/nrwl/issue/CS-153))
- Alert for enterprise customer without support level ([CS-155](https://linear.app/nrwl/issue/CS-155))
- Handle Fidelity custom override ([CS-156](https://linear.app/nrwl/issue/CS-156))
- Set initial issue priority using AI ([CS-164](https://linear.app/nrwl/issue/CS-164))
- Pylon <-> Linear Customer Requests integration ([CS-139](https://linear.app/nrwl/issue/CS-139))
- Connect Pylon to Nx GitHub Repo ([CS-128](https://linear.app/nrwl/issue/CS-128))

---

## Observability & Infrastructure

### Infrastructure

- Lighthouse: Google Auth replaced IaP with RBAC ([INF-1212](https://linear.app/nrwl/issue/INF-1212), [INF-1204](https://linear.app/nrwl/issue/INF-1204), [INF-1203](https://linear.app/nrwl/issue/INF-1203))
- Lighthouse: Password copy moved to backend ([INF-1211](https://linear.app/nrwl/issue/INF-1211))
- Lighthouse: Login audit log and user filter ([INF-1210](https://linear.app/nrwl/issue/INF-1210), [INF-1222](https://linear.app/nrwl/issue/INF-1222))
- Lighthouse: Service Account/Role rework ([INF-1119](https://linear.app/nrwl/issue/INF-1119))
- Lighthouse: Cached deployed tenant version ([INF-1135](https://linear.app/nrwl/issue/INF-1135))
- Grafana billing alerts to Terraform ([INF-1220](https://linear.app/nrwl/issue/INF-1220))
- Wire up FE banners to Grafana alerting ([INF-1127](https://linear.app/nrwl/issue/INF-1127), [INF-1128](https://linear.app/nrwl/issue/INF-1128))
- PostHog: two reverse proxies for analytics
- npm cache metrics for nginx
- Terraform/Tofu updates: all providers (AWS, GCP, Azure, Grafana, Atlas) ([INF-1195](https://linear.app/nrwl/issue/INF-1195), [INF-1196](https://linear.app/nrwl/issue/INF-1196), [INF-1197](https://linear.app/nrwl/issue/INF-1197), [INF-1198](https://linear.app/nrwl/issue/INF-1198), [INF-1199](https://linear.app/nrwl/issue/INF-1199), [INF-1201](https://linear.app/nrwl/issue/INF-1201))
- Bitbucket Cloud app secrets for development
- AWS: one nodegroup per zone instead of multi-subnet

---

## Workspace Visibility

### Cloud

- Repository access syncing for workspaces — 2602.27.5
- OAuth integration for Bitbucket ([NXA-898](https://linear.app/nrwl/issue/NXA-898))
- Default workspace visibility settings ([NXA-994](https://linear.app/nrwl/issue/NXA-994))
- Repository access settings UI ([NXA-996](https://linear.app/nrwl/issue/NXA-996))

### Infrastructure

- Enable `NX_CLOUD_WORKSPACE_VISIBILITY_ENABLED` env var on dev

---

## Repo Maintenance

### CLI

- Align pnpm version in CI workflows with package.json ([#34370](https://github.com/nrwl/nx/pull/34370)) — 22.5.0
- Replace addnab/docker-run-action with direct docker run ([#34448](https://github.com/nrwl/nx/pull/34448)) — 22.5.1
- Improve FreeBSD build reliability ([#34326](https://github.com/nrwl/nx/pull/34326)) — 22.5.0
- Add timeout to runCommandUntil to prevent hanging tests ([#34148](https://github.com/nrwl/nx/pull/34148)) — 22.5.0
- Use GITHUB_ACTIONS env var for CI detection in nx-release — 21.3.12

---

## Linear Project Status

### Completed in February

| Project | Team | Lead |
|---------|------|------|
| Workflow Controller Multi-Replica Support | INF | Patrick |
| Lighthouse: Google Auth & Remove IaP | INF | Steve |
| Lighthouse - Azure & ServiceAccounts & Perf | INF | Steve |
| Fix the non-nx agent image story | INF | Patrick |
| WF Controller Support Nodes and Disk Changes | INF | Patrick |
| Bucket access binding → memberships | INF | Patrick |
| Migrate AL2 agent nodegroups to AL2023 | INF | Szymon |
| Pylon Rollout & Evaluation | CS | Steven |
| Reverse Trial Billing | Q | Altan |
| LLM-enhanced flakiness detection | Q | Louie |
| Grafana Billing Alerts | INF | Szymon |
| IO Trace Internal Helm Chart | INF | Steve |

### Active

| Project | Team | Lead | Status |
|---------|------|------|--------|
| Task Sandboxing (Input/Output Tracing) | NXC, Q | Rares | On Track — dogfooding on Nx and Ocean |
| CLI Agentic Experience (AX) | NXA, NXC | Max | On Track — CI monitor shipped, benchmarks established |
| Polygraph AI | NXA | Jonathan | On Track — GH Actions, cross-repo plan mode |
| Framer Migration | CLOUD | Ben | On Track — nx.dev LIVE on Framer as of Feb 27 |
| Review Nx Resource Usage | NXC | Leo | On Track — jemalloc -81% fragmentation |
| Continuous Assignment of Tasks | Q | Altan | Active — scheduler refactor, benchmark tooling |
| Self-Healing CI - Customer Success | NXA | James | Active — 8 enterprise rollouts in progress |
| Workspace Visibility | NXA | Mark | Active — repository access shipping |
| Content and Structure Improvements | DOC | Caleb, Jack | Active — sidebar PoC shipped |
| Improve AI Discovery | DOC | Jack | Active — llms.txt, .md variants |
| .NET (Dotnet) Support | NXC | Miroslav | Active |
| Multi-Cluster Agent Setups | INF | Steve | Discovery phase |

### Issues Completed: ~463 across 7 teams

NXA 111 · Q 80 · NXC 80 · CLOUD 67 · INF 55 · CS 42 · DOC 28

---

_Generated on 2026-03-04._
