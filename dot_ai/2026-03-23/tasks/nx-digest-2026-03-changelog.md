# Nx Platform Changelog — March 2026

> **Sources:** Nx CLI GitHub releases (22.5.4, 22.6.0, 22.6.1), Nx Cloud public changelog (13 versions), nrwl/cloud-infrastructure commits (141), Linear (289+ issues across 7 teams), Pylon support tickets (309).
>
> **Data gaps:** Month in progress (through March 24). Some cloud-infrastructure PRs may lack full context.

---

## Task Sandboxing & Hermetic Builds

### CLI

- Add dependency filesets with `^{projectRoot}` syntax ([#34310](https://github.com/nrwl/nx/pull/34310)) — 22.6.0
- Add commands for debugging cache inputs/outputs ([#34414](https://github.com/nrwl/nx/pull/34414)) — 22.6.0
- Handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.6.0
- Extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.6.0
- Add `.nx/polygraph` to gitignore in migration and caia ([#34659](https://github.com/nrwl/nx/pull/34659)) — 22.6.0/22.5.4
- Add safe plugin cache write utilities with LRU eviction ([#34503](https://github.com/nrwl/nx/pull/34503)) — 22.6.0
- Resolve input files for targets with defaultConfiguration ([#34638](https://github.com/nrwl/nx/pull/34638)) — 22.6.0
- Interpolate `{projectRoot}` and `{projectName}` in `{workspaceRoot}` input patterns in native hasher ([#34637](https://github.com/nrwl/nx/pull/34637)) — 22.6.0
- Stabilize project references in dependsOn and inputs when later plugins rename a project ([#34332](https://github.com/nrwl/nx/pull/34332)) — 22.6.0
- Show continuous property in `nx show target` ([#34867](https://github.com/nrwl/nx/pull/34867)) — 22.6.1
- Pass collectInputs flag through daemon IPC for task hashing ([#34915](https://github.com/nrwl/nx/pull/34915)) — 22.6.1
- Trim memory usage associated with io-tracing service ([#34866](https://github.com/nrwl/nx/pull/34866)) — 22.6.0
- Show JSON by default for agentic AI ([#34780](https://github.com/nrwl/nx/pull/34780)) — 22.6.0
- Batch-safe hashing for maven and gradle ([#34446](https://github.com/nrwl/nx/pull/34446)) — 22.6.0
- Batch hashing, topological cache walk, and TUI batch fixes ([#34798](https://github.com/nrwl/nx/pull/34798)) — 22.6.0
- Ensure batch tasks always have hash for DTE ([#34764](https://github.com/nrwl/nx/pull/34764)) — 22.6.0
- Surface clearer error when CNW hits SANDBOX_FAILED ([#34724](https://github.com/nrwl/nx/pull/34724)) — 22.6.0

### Cloud

- Add file list filters in sandbox analysis process view (2603.20.2)
- Move internal sandboxing route to /private ([Q-313](https://linear.app/nrwl/issue/Q-313))
- Add env var to enable sandboxing toggle for ST ([Q-312](https://linear.app/nrwl/issue/Q-312))
- Show compare panel for tasks without violations ([Q-295](https://linear.app/nrwl/issue/Q-295))
- Investigate memory usage for tree view ([Q-242](https://linear.app/nrwl/issue/Q-242))
- Use streaming for file tree and viewer components ([Q-249](https://linear.app/nrwl/issue/Q-249))
- List view filter supports glob patterns ([Q-260](https://linear.app/nrwl/issue/Q-260))
- Sandbox analysis views toggleable via URL ([Q-286](https://linear.app/nrwl/issue/Q-286))
- File tree: toggle violation types visibility ([Q-259](https://linear.app/nrwl/issue/Q-259))
- Show task ID in sandbox analysis view ([Q-277](https://linear.app/nrwl/issue/Q-277))
- Add timeline/conformance view for sandbox violations ([Q-279](https://linear.app/nrwl/issue/Q-279))
- Limit sandbox violations warning list + link to sorted view ([Q-269](https://linear.app/nrwl/issue/Q-269))
- Handle file deletions in sandboxing ([Q-237](https://linear.app/nrwl/issue/Q-237))
- Embed sandboxing exclusion list in io-trace-daemon ([Q-273](https://linear.app/nrwl/issue/Q-273))
- Default to file tree with unexpected filter enabled ([NXC-4067](https://linear.app/nrwl/issue/NXC-4067))
- Alphabetize and add filter for trace end node list ([CLOUD-4338](https://linear.app/nrwl/issue/CLOUD-4338))

### Infrastructure

- Rename io tracing directory to sandboxing-metadata (`0f11ee68`)
- Enable io-trace-daemon for Legora (`1d017287`, `ffdd2c23`)
- Make daemon config explicit in helm and fix ringbuf default (`fcd0b703`)
- Use internal nx-api endpoint on io-trace daemonset (`b6ba4432`)
- Reduce io-trace-daemon ringbuf size to 512MB (`b82562c7`, `f41cf10e`)
- Enable debug logging and trace nx:test on staging (`7750b78a`)
- Ensure non-large enterprise tenants update io-trace with action (`bf2fd940`)

### Linear

- Clear TaskIOService retained data after subscription ([NXC-3956](https://linear.app/nrwl/issue/NXC-3956))
- Fix process tree filtering with many subprocesses ([NXC-4066](https://linear.app/nrwl/issue/NXC-4066))
- TS tasks should depend on all referenced tsconfig files from deps ([NXC-4081](https://linear.app/nrwl/issue/NXC-4081))
- IO tracing inputs list differs from expected nx outputs ([NXC-4011](https://linear.app/nrwl/issue/NXC-4011))
- Input violation check disagrees with `nx show target` ([NXC-4054](https://linear.app/nrwl/issue/NXC-4054))
- Fix sandboxing inputs for `nx:build-base` ([NXC-4057](https://linear.app/nrwl/issue/NXC-4057))
- Include Gradle files in Gradle task inputs ([NXC-4029](https://linear.app/nrwl/issue/NXC-4029))
- Add *.tsbuildinfo dependent outputs to tsc tasks ([NXC-4041](https://linear.app/nrwl/issue/NXC-4041))
- Investigate inconsistent task violation reports ([Q-296](https://linear.app/nrwl/issue/Q-296))
- Reduce number of logs from daemon ([Q-234](https://linear.app/nrwl/issue/Q-234))
- Sandbox report taskId coerces special symbols to _ ([Q-250](https://linear.app/nrwl/issue/Q-250))
- Mismatch between files written count and file tree ([Q-283](https://linear.app/nrwl/issue/Q-283))
- Unexpected reads exceed total files read in report ([Q-281](https://linear.app/nrwl/issue/Q-281))
- Add run details filters for flaky and sandbox violations ([Q-265](https://linear.app/nrwl/issue/Q-265))
- Handle Batch Tasks for Sandboxing — prevent merged inputs from hiding violations ([NXC-4118](https://linear.app/nrwl/issue/NXC-4118))
- Task IO service missing inputs for sandbox reports ([NXC-4108](https://linear.app/nrwl/issue/NXC-4108))
- Remove target default for typecheck in ocean (sandboxing fix) ([NXC-3964](https://linear.app/nrwl/issue/NXC-3964))
- Investigate io-trace-daemon failures on newer kernels ([Q-314](https://linear.app/nrwl/issue/Q-314))
- Remove sandboxing feature flag on nx-api ([Q-317](https://linear.app/nrwl/issue/Q-317))
- Dev io-tracing daemonset uses new Gateway API address ([INF-1259](https://linear.app/nrwl/issue/INF-1259))

---

## AI-Powered Development

### CLI

- Add agentic mode to `nx init` ([#34418](https://github.com/nrwl/nx/pull/34418)) — 22.6.0
- Automatically set up AI agents in cnw/init when run from within an AI agent ([#34469](https://github.com/nrwl/nx/pull/34469)) — 22.6.0
- Implement configure-ai-agents outdated message after tasks ([#34463](https://github.com/nrwl/nx/pull/34463)) — 22.6.0
- Improve Codex support for configure-ai-agents ([#34488](https://github.com/nrwl/nx/pull/34488)) — 22.6.0
- Improve AX of configure-ai-agents with auto-detection ([#34496](https://github.com/nrwl/nx/pull/34496)) — 22.6.0
- Add AI agent mode to `nx import` ([#34498](https://github.com/nrwl/nx/pull/34498)) — 22.6.0
- Add Codex subagent support to configure-ai-agents ([#34553](https://github.com/nrwl/nx/pull/34553)) — 22.6.0
- Add `--json` flag for better AX to `nx list` ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.6.0
- Add polygraph command to initialize cross-repo sessions ([#34722](https://github.com/nrwl/nx/pull/34722)) — 22.6.0
- Update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.6.0
- Update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.6.0
- Share .agents skills dir across codex, cursor, gemini ([#34882](https://github.com/nrwl/nx/pull/34882)) — 22.6.1
- Add `.claude/worktrees` to gitignore ([#34693](https://github.com/nrwl/nx/pull/34693)) — 22.6.0
- Add `.claude/settings.local.json` to .gitignore ([#34870](https://github.com/nrwl/nx/pull/34870)) — 22.6.0
- Preserve existing source properties in claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.6.0
- Make sure MCP args aren't overridden when running configure-ai-agents ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.6.0
- Only pull configure-ai-agents from latest if local version is not latest ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.6.0
- Track server page views for AI traffic using Netlify-Agent-Category ([#34883](https://github.com/nrwl/nx/pull/34883)) — 22.6.0

### Cloud (Self-Healing CI)

- Self-Healing CI discovers and runs prepare-commit-msg and commit-msg git hooks (2603.12.1)
- Add self-healing's GitHub check run integration (2603.20.2)
- Refine self-healing suggestion conditions (2603.20.2)
- Refine self-healing proposal display logic (2603.20.2)
- Add AI fix progress tracking and redirect support (2603.20.2)
- Allow users with allowed email domains to accept/reject/revert suggestions (2603.07.1)
- Fixed styling of self-healing error alerts and model provider issues (2603.10.5)
- Prevented formatting hook from resolving prettier config outside workspace (2603.20.2)
- Don't allow fixes to be reverted/applied more than once (2603.20.2)
- Add revert to comment (2603.20.2)

### Linear (Polygraph AI)

- Polygraph command ([NXA-1121](https://linear.app/nrwl/issue/NXA-1121))
- Init new Polygraph Frontend app ([NXA-1163](https://linear.app/nrwl/issue/NXA-1163))
- Feature-theme for Polygraph ([NXA-1172](https://linear.app/nrwl/issue/NXA-1172))
- Polygraph frontend environment variable ([NXA-1176](https://linear.app/nrwl/issue/NXA-1176))
- Track initiating branch in .nx/polygraph ([NXA-1114](https://linear.app/nrwl/issue/NXA-1114))
- Create separate polygraph MCP ([NXA-1131](https://linear.app/nrwl/issue/NXA-1131))
- Create README for polygraph-mcp repo ([NXA-1143](https://linear.app/nrwl/issue/NXA-1143))
- Battle test cross-repo plan mode ([NXA-1024](https://linear.app/nrwl/issue/NXA-1024))
- Enable adding repos to a running polygraph session ([NXA-1107](https://linear.app/nrwl/issue/NXA-1107))
- Make branch names and session IDs unique ([NXA-1051](https://linear.app/nrwl/issue/NXA-1051))
- Explore uploading child logs to cloud ([NXA-1092](https://linear.app/nrwl/issue/NXA-1092))
- Make monitor CI work with GitHub Actions ([NXA-1090](https://linear.app/nrwl/issue/NXA-1090))
- Get GitHub Action logs ([NXA-1029](https://linear.app/nrwl/issue/NXA-1029))
- General login command ([NXA-1122](https://linear.app/nrwl/issue/NXA-1122))
- Test e2e experience for metadata-only workspaces ([NXA-1091](https://linear.app/nrwl/issue/NXA-1091))
- Explore sessions without initiator ([NXA-1095](https://linear.app/nrwl/issue/NXA-1095))
- Detailed plan on supporting two types of orgs in nx-api ([NXA-1170](https://linear.app/nrwl/issue/NXA-1170))
- Fix delegating tasks to child agents in completed sessions ([NXA-1168](https://linear.app/nrwl/issue/NXA-1168))
- Explore agent activity indicators for child agents ([NXA-1144](https://linear.app/nrwl/issue/NXA-1144))
- Move Mongo queries to PolygraphAgentSessionRepository ([NXA-1159](https://linear.app/nrwl/issue/NXA-1159))
- Reduce size of cloud_polygraph_candidates response by collapsing dependency graph ([NXA-1165](https://linear.app/nrwl/issue/NXA-1165))
- Implement long-term storage in buckets for child agent logs ([NXA-1134](https://linear.app/nrwl/issue/NXA-1134))
- Lift MongoUser up to libs/ocean ([NXA-1190](https://linear.app/nrwl/issue/NXA-1190))

### Linear (Self-Healing CI)

- Update Claude agent SDK to support Tasks ([NXA-834](https://linear.app/nrwl/issue/NXA-834))
- Self-serve adoption: docs and UI messaging cleanup ([NXA-1105](https://linear.app/nrwl/issue/NXA-1105))
- Add EXCLUDE_AI_CREDITS plan modifier to customers ([NXA-1154](https://linear.app/nrwl/issue/NXA-1154))
- Self-healing board shows generating fix after completion ([NXA-1156](https://linear.app/nrwl/issue/NXA-1156))
- UI messaging for modelProviderIssue in CIPE fixes ([NXA-1117](https://linear.app/nrwl/issue/NXA-1117))
- No permission to accept suggestion in Self Healing ([NXA-1098](https://linear.app/nrwl/issue/NXA-1098))
- Add onboarding option to open PR for self-healing ([NXA-782](https://linear.app/nrwl/issue/NXA-782))
- Augment self-healing status visibility for task items ([NXA-878](https://linear.app/nrwl/issue/NXA-878))
- Self-healing agent ignores commit-message guidance (Pylon #257)
- Self-healing task fix statistics view location (Pylon #348)
- Self-healing task time limit inquiry (Pylon #367)
- Self-healing CI questions (Pylon #300)
- Add `.nx/self-healing` to `.gitignore` ([NXA-1127](https://linear.app/nrwl/issue/NXA-1127))
- Agent cannot clone plugin repos for MCP setup ([NXA-1150](https://linear.app/nrwl/issue/NXA-1150))
- Account for BYOK and written-off credits on usage screen ([NXA-953](https://linear.app/nrwl/issue/NXA-953))
- GitHub Self Healing check shows failed when CI succeeds ([NXA-1118](https://linear.app/nrwl/issue/NXA-1118))
- Applying self-healing fix can fail after creating commit ([NXA-1155](https://linear.app/nrwl/issue/NXA-1155))
- Suggested commit messages not complying with workspace commit hooks ([NXA-1147](https://linear.app/nrwl/issue/NXA-1147))
- Fix brain co not getting to verification step ([NXA-1167](https://linear.app/nrwl/issue/NXA-1167))

### Infrastructure

- Add SA and IAM for Claude MCP (`25e5dcfa`)
- Ensure group has MCP use IAM (`92addf75`)
- Enable AI env vars for Mimecast (`af22e452`)

---

## Security

### CLI

- Bump minimatch to 10.2.1 to address CVE-2026-26996 ([#34509](https://github.com/nrwl/nx/pull/34509)) — 22.6.0
- Address security CVE cluster (copy-webpack-plugin, koa, minimatch) ([#34708](https://github.com/nrwl/nx/pull/34708)) — 22.6.0
- Properly quote shell metacharacters in CLI args passed to tasks ([#34491](https://github.com/nrwl/nx/pull/34491)) — 22.6.1
- Set windowsHide: true on all child process spawns ([#34894](https://github.com/nrwl/nx/pull/34894)) — 22.6.1
- Remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.6.0
- Add clickjacking protection headers to Netlify configs ([#34893](https://github.com/nrwl/nx/pull/34893)) — 22.6.0
- Bump nuxt to 3.21.1 to resolve critical audit vulnerability ([#34783](https://github.com/nrwl/nx/pull/34783)) — 22.6.0
- Bump fork-ts-checker-webpack-plugin to 9.1.0 ([#34826](https://github.com/nrwl/nx/pull/34826)) — 22.6.0

### Cloud

- Frontend CRITICAL CVE-2025-15467 ([CLOUD-4351](https://linear.app/nrwl/issue/CLOUD-4351))
- Pentest: Rollbar Client Token injection ([CLOUD-4316](https://linear.app/nrwl/issue/CLOUD-4316))
- Pentest: Unauthenticated access to achievements endpoint ([CLOUD-4311](https://linear.app/nrwl/issue/CLOUD-4311))
- Pentest: Email verification not enforced ([CLOUD-4310](https://linear.app/nrwl/issue/CLOUD-4310))
- Pentest: Sensitive data in session cookies ([CLOUD-4312](https://linear.app/nrwl/issue/CLOUD-4312))
- Security awareness training records for Vanta ([CLOUD-4345](https://linear.app/nrwl/issue/CLOUD-4345))

### Infrastructure

- Remove /nx-cloud/private from prod; route to 404 (`448aab74`, `e5fcd2a7`, `cb4a040e`)
- Admin push for tofu deny rules (`d79fbf30`)
- Pentest: CI API Error Messages Expose Internal Class Names ([Q-253](https://linear.app/nrwl/issue/Q-253))

---

## Performance & Reliability

### CLI

- Use jemalloc with tuned decay timers for native module ([#34444](https://github.com/nrwl/nx/pull/34444)) — 22.6.0
- Use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.6.0
- Prevent DB corruption from concurrent initialization ([#34861](https://github.com/nrwl/nx/pull/34861)) — 22.6.1
- Retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.6.0
- Skip stale recomputations and prevent lost file changes in daemon ([#34424](https://github.com/nrwl/nx/pull/34424)) — 22.6.0
- Reject pending promises directly when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.6.0
- Ensure workers shutdown after phase cancelled ([#34799](https://github.com/nrwl/nx/pull/34799)) — 22.6.0
- Prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.6.0
- Reduce terminal output duplication and allocations in task runner ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.6.0
- Avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.6.0
- Prevent TUI panic when Nx Console is connected ([#34718](https://github.com/nrwl/nx/pull/34718)) — 22.6.0
- Gate tui-logger init behind NX_TUI env var ([#34426](https://github.com/nrwl/nx/pull/34426)) — 22.6.0
- Skip writing deps cache if already up-to-date ([#34582](https://github.com/nrwl/nx/pull/34582)) — 22.6.0/22.5.4
- Use scoped cache key for unresolved npm imports in TargetProjectLocator ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.6.0
- Skip analytics and DB connection when global bin hands off to local ([#34914](https://github.com/nrwl/nx/pull/34914)) — 22.6.1
- Avoid redundant project graph requests in ngcli adapter ([#34907](https://github.com/nrwl/nx/pull/34907)) — 22.6.1
- Avoid overwhelming DB with connections during analytics init ([#34881](https://github.com/nrwl/nx/pull/34881)) — 22.6.0
- Migrate napi-rs v2 to v3 ([#34619](https://github.com/nrwl/nx/pull/34619)) — 22.6.0
- Use static_vcruntime to avoid msvcrt dependency ([#19781](https://github.com/nrwl/nx/pull/19781)) — 22.6.0
- Replace buggy ignore-files trie with correct path-component gitignore matching ([#34447](https://github.com/nrwl/nx/pull/34447)) — 22.6.0

### Linear

- Fix plugin workers hanging due to graph recomputation ([NXC-4049](https://linear.app/nrwl/issue/NXC-4049))
- Investigate worker connection timeout ([NXC-4093](https://linear.app/nrwl/issue/NXC-4093))
- Evaluate skipping Rust-to-JS input transfer without subscribers ([NXC-4082](https://linear.app/nrwl/issue/NXC-4082))
- Extreme slowness running run-many lint (graph/daemon) ([NXC-3970](https://linear.app/nrwl/issue/NXC-3970))
- Fix Database file exists but has no metadata table ([NXC-4089](https://linear.app/nrwl/issue/NXC-4089))
- WaitingAgents backed by valkey ([Q-282](https://linear.app/nrwl/issue/Q-282))

---

## Telemetry & Analytics

### CLI

- Add analytics ([#34144](https://github.com/nrwl/nx/pull/34144)) — 22.6.0
- Persist analytics session ID across CLI invocations ([#34763](https://github.com/nrwl/nx/pull/34763)) — 22.6.0
- Centralize perf tracking and report metrics to telemetry ([#34795](https://github.com/nrwl/nx/pull/34795)) — 22.6.0
- Prompt for analytics preference during workspace creation ([#34818](https://github.com/nrwl/nx/pull/34818)) — 22.6.0
- Add task and project count telemetry via performance lifecycle ([#34821](https://github.com/nrwl/nx/pull/34821)) — 22.6.0
- Skip analytics prompt for cloud commands ([#34789](https://github.com/nrwl/nx/pull/34789)) — 22.6.0

### Linear

- Polish the telemetry feature ([NXC-3693](https://linear.app/nrwl/issue/NXC-3693))
- Flush telemetry events on Process.exit / handleErrors ([NXC-3800](https://linear.app/nrwl/issue/NXC-3800))
- Remove sensitive data from args before sending ([NXC-3889](https://linear.app/nrwl/issue/NXC-3889))
- Capture Project Graph Creation time event ([NXC-3734](https://linear.app/nrwl/issue/NXC-3734))
- Capture Nx Command event to GA ([NXC-3733](https://linear.app/nrwl/issue/NXC-3733))
- Add configuration for opt-out of tracking ([NXC-3731](https://linear.app/nrwl/issue/NXC-3731))
- Add prompt during CNW + Nx invocation ([NXC-3732](https://linear.app/nrwl/issue/NXC-3732))
- Dogfood telemetry in ocean ([NXC-3695](https://linear.app/nrwl/issue/NXC-3695))
- Dogfood telemetry in nx ([NXC-3696](https://linear.app/nrwl/issue/NXC-3696))
- Documentation for telemetry ([DOC-446](https://linear.app/nrwl/issue/DOC-446))
- Track nx-dev server page views for AI traffic ([DOC-445](https://linear.app/nrwl/issue/DOC-445))

---

## Onboarding & Workspace Creation

### CLI

- Add nxVersion to meta in shortUrl for CNW ([#34401](https://github.com/nrwl/nx/pull/34401)) — 22.6.0
- Lock in CNW variant 2 with deferred connection ([#34416](https://github.com/nrwl/nx/pull/34416)) — 22.6.0
- Add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580)) — 22.6.0
- Bring back cloud prompts and templates in CNW ([#34887](https://github.com/nrwl/nx/pull/34887)) — 22.6.0
- Restore CNW user flow to match v22.1.3 ([#34671](https://github.com/nrwl/nx/pull/34671)) — 22.6.0/22.5.4
- Preserve nxCloud=skip in non-interactive CNW mode ([#34616](https://github.com/nrwl/nx/pull/34616)) — 22.6.0
- Gracefully handle missing package manager and invalid workspace for CNW ([#34902](https://github.com/nrwl/nx/pull/34902)) — 22.6.0
- Wrap CNW normalize args function in error handler ([#34905](https://github.com/nrwl/nx/pull/34905)) — 22.6.0
- Detect npm from package-lock.json before falling back to invoking PM ([#34877](https://github.com/nrwl/nx/pull/34877)) — 22.6.0

### Cloud

- New organizations can choose between Hobby and Team plans during onboarding (2603.11.1)
- Show descriptive warnings for GitHub app configuration in workspace creation (2603.04.3)
- GitHub app installation redirect fix (2603.10.1)
- Test Gitlab one-page onboarding flow on staging ([CLOUD-4196](https://linear.app/nrwl/issue/CLOUD-4196))
- Add Nx API endpoints for connect workspace CLI flow ([CLOUD-4253](https://linear.app/nrwl/issue/CLOUD-4253))
- Prompt to connect GH/GL account after account creation ([CLOUD-3879](https://linear.app/nrwl/issue/CLOUD-3879))
- Metadata-only auto opt-in after onboarding migration ([CLOUD-4343](https://linear.app/nrwl/issue/CLOUD-4343))

### Linear

- Reduce common errors in CLI onboarding ([NXC-4095](https://linear.app/nrwl/issue/NXC-4095))
- Bring back cloud prompts and templates ([NXC-4096](https://linear.app/nrwl/issue/NXC-4096))
- Improve `nx import` AX like cnw/init ([NXA-1006](https://linear.app/nrwl/issue/NXA-1006))
- Test & document import gaps for @nx/gradle ([NXA-1069](https://linear.app/nrwl/issue/NXA-1069))
- CNW/Init Funnel & Cloud Conversion Optimization project (DOC/NXC, target Apr 10)
- Restore CNW CTA getting started pages ([DOC-448](https://linear.app/nrwl/issue/DOC-448))

---

## JVM Ecosystem (Gradle & Maven)

### CLI

- Add properties and wrappers to Gradle inputs ([#34778](https://github.com/nrwl/nx/pull/34778)) — 22.6.0
- Report external Maven dependencies in project graph ([#34368](https://github.com/nrwl/nx/pull/34368)) — 22.6.0
- Add preferBatch executor option ([#34293](https://github.com/nrwl/nx/pull/34293)) — 22.6.0
- Ensure atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.6.0
- Use globs for dependent task output files (Gradle) ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.6.0
- Tee batch runner output to stderr for terminal display ([#34630](https://github.com/nrwl/nx/pull/34630)) — 22.6.0/22.5.4
- Use object format for dependsOn instead of shorthand strings ([#34715](https://github.com/nrwl/nx/pull/34715)) — 22.6.0
- Exclude non-JS gradle sub-projects from eslint plugin ([#34735](https://github.com/nrwl/nx/pull/34735)) — 22.6.0
- Ensure ci test target depends-on takes overrides into account ([#34777](https://github.com/nrwl/nx/pull/34777)) — 22.6.0
- Handle project names containing .json substring ([#34832](https://github.com/nrwl/nx/pull/34832)) — 22.6.0
- Always check disk cache for gradle project graph reports ([#34873](https://github.com/nrwl/nx/pull/34873)) — 22.6.0
- Remove annotations from atomizer ([#34871](https://github.com/nrwl/nx/pull/34871)) — 22.6.1
- Maven: use module-level variable for cache transfer ([#34386](https://github.com/nrwl/nx/pull/34386)) — 22.6.0
- Maven: correctly map between locators and nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.6.0
- Maven: write output after each task in batch mode ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.6.0
- Maven: fix set pom file without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.6.0
- Maven: synchronize batch runner invoke() ([#34600](https://github.com/nrwl/nx/pull/34600)) — 22.6.0/22.5.4
- Maven: use mutable lists for session projects ([#34834](https://github.com/nrwl/nx/pull/34834)) — 22.6.0

### Linear

- Add external dependencies (Maven) ([NXC-3849](https://linear.app/nrwl/issue/NXC-3849))
- testCompile does not have inputs for test sources (Maven) ([NXC-3954](https://linear.app/nrwl/issue/NXC-3954))
- Investigate maven caching bug in batch mode v4 e2e ([NXC-3888](https://linear.app/nrwl/issue/NXC-3888))
- Remove custom Nx project name overrides in nx repo ([NXC-3829](https://linear.app/nrwl/issue/NXC-3829))
- Gradle plugin generates atomized targets for questionable tests ([NXC-4085](https://linear.app/nrwl/issue/NXC-4085))
- Implicit dependencies using project.json name not detected ([NXC-4034](https://linear.app/nrwl/issue/NXC-4034))
- Atomized depends-on targets ignore target name override ([NXC-4056](https://linear.app/nrwl/issue/NXC-4056))
- Version catalogs invalidate gradle project graph cache ([Q-294](https://linear.app/nrwl/issue/Q-294))
- Fix exclude depends-on in batch mode — extra tasks running in Ocean Docker builds ([NXC-4070](https://linear.app/nrwl/issue/NXC-4070))
- Unblock Ocean with excludesDependsOn ([NXC-4071](https://linear.app/nrwl/issue/NXC-4071))
- Skip Gradle invocation in Ocean when unnecessary ([NXC-4055](https://linear.app/nrwl/issue/NXC-4055))

---

## Observability & Metrics

### Cloud

- Workspace analytics CI pipeline execution durations chart with percentile values (p95/p75/p50/p25/p5) (2603.04.2)
- Add P95 CIPE duration to analytics graph ([CLOUD-4323](https://linear.app/nrwl/issue/CLOUD-4323))
- Add metrics url handler (2603.20.2)
- Google IAM Authentication for Managed Valkey (2603.20.2)
- Add info about git mailmap to usage page (2603.20.2)

### Linear

- Migrate prometheus handlers to service account auth ([Q-268](https://linear.app/nrwl/issue/Q-268))
- dailyProductUsage: persist AI credits, connections, contributors ([Q-315](https://linear.app/nrwl/issue/Q-315))
- Record project graph size in latestProjectGraphs ([Q-310](https://linear.app/nrwl/issue/Q-310))
- Surface compute and AI credit counts to daily audit ([Q-292](https://linear.app/nrwl/issue/Q-292))
- Make PostHog available in gradle projects ([Q-291](https://linear.app/nrwl/issue/Q-291))
- Port Remix PostHog models to Kotlin shared lib ([Q-309](https://linear.app/nrwl/issue/Q-309))
- Track workspace claims + 6-week info gather job ([Q-308](https://linear.app/nrwl/issue/Q-308))
- Implement reverse proxy for PostHog ([CLOUD-4261](https://linear.app/nrwl/issue/CLOUD-4261))
- Determine which feature flags can be retired ([CLOUD-4278](https://linear.app/nrwl/issue/CLOUD-4278))
- Turn PostHog on in staging ([CLOUD-4265](https://linear.app/nrwl/issue/CLOUD-4265))
- Record TTG daily stats for workspaces that had CIPEs ([Q-311](https://linear.app/nrwl/issue/Q-311))
- Collect info about team vs. free plan usage ([Q-290](https://linear.app/nrwl/issue/Q-290))
- Assignment gaps in DTE due to WaitingAgents ([Q-319](https://linear.app/nrwl/issue/Q-319))

### Infrastructure

- Switch nxcloud metrics scraping to basic auth with public endpoint (`9cf1e023`)
- Change nxcloud public metrics scrape interval to hourly (`8328c163`)
- Run public metrics aggregation hourly (`71569602`)
- Add Grafana space to spacelift (`09b50dd0`, `f278903a`)
- Add alert for monthly cost (Grafana) (`30d33965`)
- Enable grafana resources by default for enterprise AWS (`3f2c3d13`)
- Add grafana space to gcp iam (`f9c75155`)
- Enable workspace visibility env vars on dev/staging/prod (`03c8369c`, `a1c6c914`, `f5c949f7`)
- Switch staging and prod NA to posthog reverse proxy (`e4567168`)
- Add common proxy for posthog (`55a7cd18`)
- Remove extra posthog proxies (`fad70f26`)

---

## Enterprise Infrastructure

### Multi-Cluster Agent Setups

- Implement GetWorkflowStatus fan-out ([INF-1162](https://linear.app/nrwl/issue/INF-1162))
- Implement CancelWorkflow ([INF-1161](https://linear.app/nrwl/issue/INF-1161))
- Implement workflow-to-downstream Valkey mapping ([INF-1167](https://linear.app/nrwl/issue/INF-1167))
- Workflow Routing Engine ([INF-1145](https://linear.app/nrwl/issue/INF-1145))
- Implement capability-based downstream filtering ([INF-1166](https://linear.app/nrwl/issue/INF-1166))
- Downstream Controller Discovery API ([INF-1142](https://linear.app/nrwl/issue/INF-1142))
- Create checkin goroutine for downstreams ([INF-1269](https://linear.app/nrwl/issue/INF-1269))
- Define config path for downstreams ([INF-1239](https://linear.app/nrwl/issue/INF-1239))
- Create client for facade ([INF-1154](https://linear.app/nrwl/issue/INF-1154))
- Add endpoints to controller on --downstream ([INF-1153](https://linear.app/nrwl/issue/INF-1153))
- Design models and API surface for controller ([INF-1152](https://linear.app/nrwl/issue/INF-1152))
- Controller Subsystem Audit for Facade Mode ([INF-1141](https://linear.app/nrwl/issue/INF-1141))
- Spike facade mode gating prototype ([INF-1151](https://linear.app/nrwl/issue/INF-1151))
- Document cross-dependencies for selective disabling ([INF-1150](https://linear.app/nrwl/issue/INF-1150))
- Audit main.go startup and map subsystems ([INF-1149](https://linear.app/nrwl/issue/INF-1149))
- Implement Facade Runner Core ([INF-1144](https://linear.app/nrwl/issue/INF-1144))
- Facade Configuration & Controller Bootstrap ([INF-1146](https://linear.app/nrwl/issue/INF-1146))
- Create Helm Chart for Facade ([INF-1179](https://linear.app/nrwl/issue/INF-1179))
- Logs Endpoints Facade -> Downstream ([INF-1279](https://linear.app/nrwl/issue/INF-1279))
- Tidy facade handler endpoints ([INF-1282](https://linear.app/nrwl/issue/INF-1282))
- Create internal chart for facade controller (`f18f3966`)

### K8S Gateway API

- LoadBalancer TLS Termination ([INF-1260](https://linear.app/nrwl/issue/INF-1260))
- Stamp-able way to enable Gateway API ([INF-1251](https://linear.app/nrwl/issue/INF-1251))
- Update Google Terraform for Gateway API ([INF-1250](https://linear.app/nrwl/issue/INF-1250))
- Create a K8s Gateway in Dev ([INF-1237](https://linear.app/nrwl/issue/INF-1237))
- Gateway API helm chart (`4ea56524`)
- Enable gatewayapi on wf clusters in staging/prod (`c277bdf9`)
- Gateway API Infrastructure for staging/production (`0a5b7a4e`)
- GatewayAPI resources deployed to GCP single tenants by flag (`8a9af832`, `34e3db90`, `aa67ca65`)
- GatewayAPI CHANNEL_STANDARD for all GCP clusters (`b2e43bd0`)
- Dev io-tracing daemonset uses new gatewayapi address ([INF-1259](https://linear.app/nrwl/issue/INF-1259))

### Valkey Env Var Aliases (New)

- Add valkey env var aliases to nx-api ([INF-1274](https://linear.app/nrwl/issue/INF-1274))
- Add valkey env var aliases to wf-controller ([INF-1275](https://linear.app/nrwl/issue/INF-1275))
- Use valkey env var aliases in dev ([INF-1278](https://linear.app/nrwl/issue/INF-1278))

### Secrets Management

- Cleanup duplicate values in secrets ([INF-1273](https://linear.app/nrwl/issue/INF-1273))
- Use new secrets in production ([INF-1267](https://linear.app/nrwl/issue/INF-1267))
- Split production secrets ([INF-1263](https://linear.app/nrwl/issue/INF-1263))
- Use new secrets in staging ([INF-1266](https://linear.app/nrwl/issue/INF-1266))
- Split staging secrets ([INF-1262](https://linear.app/nrwl/issue/INF-1262))
- Use new secrets in dev ([INF-1264](https://linear.app/nrwl/issue/INF-1264))
- Split development secrets ([INF-1261](https://linear.app/nrwl/issue/INF-1261))

### Azure Redis/Valkey

- Remove azure-specific env var in wf-controller ([INF-1247](https://linear.app/nrwl/issue/INF-1247))
- Move wf-controller env vars for Azure tenants ([INF-1241](https://linear.app/nrwl/issue/INF-1241))
- Add azure redis auth in nx-api ([INF-1235](https://linear.app/nrwl/issue/INF-1235))
- Add azure redis auth in workflow controller ([INF-1233](https://linear.app/nrwl/issue/INF-1233))

### Identity Portal / OpenTofu

- Automate IAM for new AWS accounts ([INF-1253](https://linear.app/nrwl/issue/INF-1253))
- Import existing SSO resources into tofu ([INF-1249](https://linear.app/nrwl/issue/INF-1249))

### Tenant Changes

- Caseware: Single-tenant AWS provisioning, SAML, GitHub vars, Lighthouse rotation, self-healing enabled
- CIBC: SCIM token and new access control enabled
- Legora: SAML env vars, io-trace-daemon enabled, missing env vars added
- Cloudinary: Self-healing CI enabled
- Mimecast: AI env vars enabled
- Anaplan: Missing env vars for agents added

---

## Ecosystem & Framework Support

### CLI

- Angular v21.2 support ([#34592](https://github.com/nrwl/nx/pull/34592)) — 22.6.0
- ESLint v10 support ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.6.0
- Yarn Berry catalog support ([#34552](https://github.com/nrwl/nx/pull/34552)) — 22.6.0
- NX_SKIP_FORMAT environment variable to skip Prettier formatting ([#34336](https://github.com/nrwl/nx/pull/34336)) — 22.6.0
- Negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160)) — 22.6.0
- --stdin to affected options ([#34435](https://github.com/nrwl/nx/pull/34435)) — 22.6.0
- Configurable typecheck config name ([#34675](https://github.com/nrwl/nx/pull/34675)) — 22.6.0
- deps-sync generator ([#34407](https://github.com/nrwl/nx/pull/34407)) — 22.6.0
- cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.6.0
- --otp to top-level nx release command ([#34473](https://github.com/nrwl/nx/pull/34473)) — 22.6.0
- Passthrough for nx-cloud apply-locally command ([#34557](https://github.com/nrwl/nx/pull/34557)) — 22.6.0
- Use caret range for swc dependencies in pnpm catalog ([#34487](https://github.com/nrwl/nx/pull/34487)) — 22.6.0

### Fixes

- Angular: SASS indented syntax in nx-welcome ([#34510](https://github.com/nrwl/nx/pull/34510)) — 22.6.0
- Angular: preserve skipLibCheck in tsconfig.json ([#34695](https://github.com/nrwl/nx/pull/34695)) — 22.6.0
- Angular-rspack: exclude .json from JS/TS regex ([#34195](https://github.com/nrwl/nx/pull/34195)) — 22.6.0
- Angular-rspack: relative path for postcss-cli-resources ([#34681](https://github.com/nrwl/nx/pull/34681)) — 22.6.0/22.5.4
- Bundling: skip type-check in TS Solution Setup when skipTypeCheck true ([#34493](https://github.com/nrwl/nx/pull/34493)) — 22.6.0
- Bundling: fix regression on process.env for webpack ([#34583](https://github.com/nrwl/nx/pull/34583)) — 22.6.0
- JS: per-invocation cache in TS plugin for NX_ISOLATE_PLUGINS=false ([#34566](https://github.com/nrwl/nx/pull/34566)) — 22.6.0
- JS: strip catalogs from pruned pnpm lockfile ([#34697](https://github.com/nrwl/nx/pull/34697)) — 22.6.0
- JS: normalize paths to posix in typescript plugin ([#34702](https://github.com/nrwl/nx/pull/34702)) — 22.6.0
- JS: derive tsbuildinfo filename from iterated tsconfig ([#34738](https://github.com/nrwl/nx/pull/34738)) — 22.6.0
- JS: include tsbuildinfo in dependentTasksOutputFiles ([#34733](https://github.com/nrwl/nx/pull/34733)) — 22.6.0
- JS: include transitive dep outputs in typecheck inputs ([#34773](https://github.com/nrwl/nx/pull/34773)) — 22.6.0
- JS: add external project reference config files as inputs ([#34770](https://github.com/nrwl/nx/pull/34770)) — 22.6.0
- JS: always infer dependentTasksOutputFiles for tsc build targets ([#34784](https://github.com/nrwl/nx/pull/34784)) — 22.6.0
- JS: support bun-only environments in release-publish ([#34835](https://github.com/nrwl/nx/pull/34835)) — 22.6.0
- JS: track tsconfig files from dependency reference chain as inputs ([#34848](https://github.com/nrwl/nx/pull/34848)) — 22.6.0
- Linter: detect require() calls in enforce-module-boundaries ([#34896](https://github.com/nrwl/nx/pull/34896)) — 22.6.1
- Linter: wildcards paths in enforce-module-boundaries rule ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.6.0
- Linter: add catalog: references when fixing missing dependencies ([#34734](https://github.com/nrwl/nx/pull/34734)) — 22.6.0
- Linter: use native nx.configs in convert-to-flat-config ([#34897](https://github.com/nrwl/nx/pull/34897)) — 22.6.1
- Linter: convert project-level eslint configs and log when skipped ([#34899](https://github.com/nrwl/nx/pull/34899)) — 22.6.1
- Linter: use root config to determine ESLint class in plugin ([#34900](https://github.com/nrwl/nx/pull/34900)) — 22.6.1
- Module Federation: use sslKey instead of sslCert for pathToKey ([#34824](https://github.com/nrwl/nx/pull/34824)) — 22.6.0
- Next.js: reset daemon client after project graph creation ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.6.0
- Vite: isPreview=true for Vite Preview server ([#34597](https://github.com/nrwl/nx/pull/34597)) — 22.6.0
- Vite: skip root-relative paths in nxViteTsPaths ([#34694](https://github.com/nrwl/nx/pull/34694)) — 22.6.0
- Vite: pin vitest v4 to ~4.0.x ([#34878](https://github.com/nrwl/nx/pull/34878)) — 22.6.0
- Vitest: respect reporters from target options ([#34663](https://github.com/nrwl/nx/pull/34663)) — 22.6.0/22.5.4
- Vitest: handle zoneless Angular apps ([#34700](https://github.com/nrwl/nx/pull/34700)) — 22.6.0
- ⚠️ Vitest: resolve reportsDirectory against workspace root ([#34720](https://github.com/nrwl/nx/pull/34720)) — 22.6.0 **BREAKING**
- Webpack: safe process.env fallback replacement ([#34464](https://github.com/nrwl/nx/pull/34464)) — 22.6.0
- Webpack: cap less version to <4.6.0 ([#34781](https://github.com/nrwl/nx/pull/34781)) — 22.6.0
- Testing: handle undefined options in playwright preset ([#34750](https://github.com/nrwl/nx/pull/34750)) — 22.6.1
- Testing: surgical text replacement in Jest matcher alias migration ([#34350](https://github.com/nrwl/nx/pull/34350)) — 22.6.0
- Testing: infer dependency tsconfig files as playwright plugin inputs ([#34803](https://github.com/nrwl/nx/pull/34803)) — 22.6.0
- Testing: infer task inputs from jest config file references ([#34740](https://github.com/nrwl/nx/pull/34740)) — 22.6.0

---

## Nx Release

### CLI

- Add --otp to top-level nx release command and detect EOTP errors ([#34473](https://github.com/nrwl/nx/pull/34473)) — 22.6.0
- Support canonical SSH URLs when extracting GitHub slug ([#31684](https://github.com/nrwl/nx/pull/31684)) — 22.6.0/22.5.4
- Null-safe fallback for version in createGitTagValues ([#34598](https://github.com/nrwl/nx/pull/34598)) — 22.6.0
- Skip indirect patch bump for commit types with semverBump "none" ([#34841](https://github.com/nrwl/nx/pull/34841)) — 22.6.0
- Include dependent projects in release commit message with --projects filter ([#34845](https://github.com/nrwl/nx/pull/34845)) — 22.6.0
- Deduplicate projects in changelog with filtered project list ([#34851](https://github.com/nrwl/nx/pull/34851)) — 22.6.0
- Remove unnecessary number from release return type ([#34481](https://github.com/nrwl/nx/pull/34481)) — 22.6.0
- Allow null values in schema of dockerVersion ([#34171](https://github.com/nrwl/nx/pull/34171)) — 22.6.0
- Skip npm dist-tag add when no new version was resolved ([#34843](https://github.com/nrwl/nx/pull/34843)) — 22.6.1

---

## Workspace Visibility & Access Control

### Cloud

- Enable anonymous external commands by default (2603.20.2)
- Allow GitHub members to create apps more easily (2603.20.2)
- Reverse trial permission changes (2603.20.2)

### Linear

- Add OAuth integration for Azure DevOps ([NXA-897](https://linear.app/nrwl/issue/NXA-897))
- Default workspace visibility to repo access ([NXA-995](https://linear.app/nrwl/issue/NXA-995))
- Test visibility settings in snapshot/staging ([NXA-1102](https://linear.app/nrwl/issue/NXA-1102))
- Disable org visibility in settings if env var set ([NXA-1133](https://linear.app/nrwl/issue/NXA-1133))
- Clean up remaining uses of org public/private setting ([NXA-1136](https://linear.app/nrwl/issue/NXA-1136))
- Enable NX_CLOUD_REPOSITORY_ACCESS_ENABLED env var (`0a24929d`, `03c8369c`, `a1c6c914`, `f5c949f7`)

---

## Docs & Developer Experience

### Linear

- Fix Next.js build failure for /ai-chat ([DOC-418](https://linear.app/nrwl/issue/DOC-418))
- Update docs to use latest image tag ([DOC-441](https://linear.app/nrwl/issue/DOC-441))
- Update outdated Angular migration doc ([DOC-419](https://linear.app/nrwl/issue/DOC-419))
- Investigate why internal link checker isn't running ([DOC-424](https://linear.app/nrwl/issue/DOC-424))
- Clarify "batch mode" in docs ([DOC-420](https://linear.app/nrwl/issue/DOC-420))
- Clarify supported Storybook versions ([DOC-422](https://linear.app/nrwl/issue/DOC-422))
- Document Docker Layer Caching ([DOC-344](https://linear.app/nrwl/issue/DOC-344))
- Writing style linting with Vale ([DOC-393](https://linear.app/nrwl/issue/DOC-393))
- Blog search missing Enterprise Task Analytics article ([DOC-430](https://linear.app/nrwl/issue/DOC-430))
- Clean up outdated version references < Nx 20 ([DOC-437](https://linear.app/nrwl/issue/DOC-437))
- Document sandboxing feature for Cloud UI ([DOC-429](https://linear.app/nrwl/issue/DOC-429))
- Additional AI discovery mechanisms (llms.txt) ([DOC-390](https://linear.app/nrwl/issue/DOC-390))
- Self-healing auto-apply video merged ([DOC-440](https://linear.app/nrwl/issue/DOC-440))
- Merge self-healing auto-apply video PR ([DOC-440](https://linear.app/nrwl/issue/DOC-440))

### CLI

- nx.dev: resolve changelog page 500 error ([#34920](https://github.com/nrwl/nx/pull/34920)) — 22.6.1
- nx-dev: improve plugin registry visibility ([#34395](https://github.com/nrwl/nx/pull/34395)) — 22.6.0
- nx-dev: widen search dialog ([#34504](https://github.com/nrwl/nx/pull/34504)) — 22.6.0
- nx-dev: update breadcrumb links to match sidebar ([#34500](https://github.com/nrwl/nx/pull/34500)) — 22.6.0
- nx-dev: correct interpolate sub command for CLI reference ([#34585](https://github.com/nrwl/nx/pull/34585)) — 22.6.0
- nx-dev: move redirects from Next.js config to Netlify _redirects ([#34612](https://github.com/nrwl/nx/pull/34612)) — 22.6.0
- nx-dev: adding missing legacy route redirects ([#34772](https://github.com/nrwl/nx/pull/34772)) — 22.6.0
- nx-dev: cross site link checks working as expected ([#34685](https://github.com/nrwl/nx/pull/34685)) — 22.6.0
- nx-dev: add YouTube channel callout to courses page ([#34669](https://github.com/nrwl/nx/pull/34669)) — 22.6.0

---

## Customer Success & Support

### Pylon Rollout (Completed)

- Configure SSO ([CS-133](https://linear.app/nrwl/issue/CS-133))
- Setup custom domain help.nx.app ([CS-132](https://linear.app/nrwl/issue/CS-132))
- Connect Pylon to Google Workspace ([CS-86](https://linear.app/nrwl/issue/CS-86))
- Setup DNS for custom email domain ([CS-92](https://linear.app/nrwl/issue/CS-92))
- Cut over from Salesforce to Pylon ([CS-154](https://linear.app/nrwl/issue/CS-154))
- Setup custom domain support.nx.app ([CS-129](https://linear.app/nrwl/issue/CS-129))

### Other

- Create internal blogpost: Nx vs Turbo ([CS-70](https://linear.app/nrwl/issue/CS-70))
- Calculate credit distribution for Flutter ([CS-71](https://linear.app/nrwl/issue/CS-71))
- Migrate contributors count to Lighthouse ([CS-67](https://linear.app/nrwl/issue/CS-67))

---

## Miscellaneous

### CLI

- Make watch command work with all and initialRun specified ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.6.0
- Commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.6.0
- Handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.6.0
- Support tuple validation when schema items is an array ([#34636](https://github.com/nrwl/nx/pull/34636)) — 22.6.0
- Allow nx cloud commands to run outside of a workspace ([#34728](https://github.com/nrwl/nx/pull/34728)) — 22.6.0
- Add missing @nx/angular-rspack packages to nx packageGroup ([#34743](https://github.com/nrwl/nx/pull/34743)) — 22.6.0
- Improve nx wrapper error message for malformed nx.json ([#34736](https://github.com/nrwl/nx/pull/34736)) — 22.6.0
- Misc graph changes with nx/graph 1.0.5 ([#34761](https://github.com/nrwl/nx/pull/34761)) — 22.6.0
- Fix TUI help text layout ([#34754](https://github.com/nrwl/nx/pull/34754)) — 22.6.0
- Preserve params and options when expanding wildcard dependsOn targets ([#34822](https://github.com/nrwl/nx/pull/34822)) — 22.6.0
- Add download-cloud-client to cloud command bypass list ([#34788](https://github.com/nrwl/nx/pull/34788)) — 22.6.0
- Add null guards for runningTasksService in WASM fallback ([#34825](https://github.com/nrwl/nx/pull/34825)) — 22.6.0
- Ensure postTasksExecution fires on SIGINT for continuous tasks ([#34876](https://github.com/nrwl/nx/pull/34876)) — 22.6.1
- Improve error handling in nx migrate registry fetching ([#34926](https://github.com/nrwl/nx/pull/34926)) — 22.6.1
- Remove CRA migration logic from nx init ([#34912](https://github.com/nrwl/nx/pull/34912)) — 22.6.1
- Lint plugin performance improvement (customer-escalated via Pylon) ([NXC-4010](https://linear.app/nrwl/issue/NXC-4010))
- Golden test failures across multiple e2e projects ([NXC-3990](https://linear.app/nrwl/issue/NXC-3990))
- Pin vite for nightly failure ([NXC-4090](https://linear.app/nrwl/issue/NXC-4090))

### Cloud

- Enhance feedback form with new UI & accessibility (2603.20.2)
- Pre launch flaky tasks adjustments (2603.20.2)
- Add configurations subview for assignment rules (2603.20.2)
- Allow TLS certs in nx-api (2603.20.2)
- Extract usage navigation from period card (2603.20.2)
- Improve contributors over period readability (2603.20.2)
- Add changelog link to app footer (2603.20.1)
- Xterm search state not reset when terminal reopened ([CLOUD-2754](https://linear.app/nrwl/issue/CLOUD-2754))
- Make the CIPE filter wider ([CLOUD-4347](https://linear.app/nrwl/issue/CLOUD-4347))
- CIPE list branch filter stretches for long branch names (2603.06.7)
- Nx Graph grouped mode expand shows empty folder ([CLOUD-4348](https://linear.app/nrwl/issue/CLOUD-4348))
- Nx graph grouped/flat toggle breaks All button ([CLOUD-4346](https://linear.app/nrwl/issue/CLOUD-4346))
- stop-agents-after ignored with hybrid changeset ([CLOUD-4297](https://linear.app/nrwl/issue/CLOUD-4297))
- YAML anchors fail in single-tenant distribute-on ([CLOUD-4349](https://linear.app/nrwl/issue/CLOUD-4349), 2603.11.3)
- Simplify e2e auth by avoiding Auth0 in CI ([CLOUD-4270](https://linear.app/nrwl/issue/CLOUD-4270))
- Nx Cloud download light client to tmp dir when outside nx workspace ([#34805](https://github.com/nrwl/nx/pull/34805)) — 22.6.0
- GDPR data deletion requests ([CLOUD-4307](https://linear.app/nrwl/issue/CLOUD-4307), [CLOUD-4333](https://linear.app/nrwl/issue/CLOUD-4333))
- Refresh verify email UI ([CLOUD-4353](https://linear.app/nrwl/issue/CLOUD-4353))
- Add provided logos to website footer in Framer ([CLOUD-4334](https://linear.app/nrwl/issue/CLOUD-4334))
- Rewrite Framer URLs to nx.dev in HTML responses ([#34445](https://github.com/nrwl/nx/pull/34445)) — 22.6.0
- Exclude .netlify paths from Framer proxy ([#34703](https://github.com/nrwl/nx/pull/34703)) — 22.6.0
- Remove nx-cloud paths from Framer excluded URL rewrites ([#34852](https://github.com/nrwl/nx/pull/34852)) — 22.6.0
- Prevent nxCloudId from being generated for new workspaces ([#34532](https://github.com/nrwl/nx/pull/34532)) — 22.6.0
- Update maven & gradle icons to java duke icon ([#34508](https://github.com/nrwl/nx/pull/34508)) — 22.6.0

### Infrastructure

- Enable internal service account provisioning on snapshot (`36b0b63d`)
- Remove redundant secret keys in staging/prod (`e7c06ce6`)
- Enable cert-manager & external-dns in staging (`3f46e5c5`)
- Add backendnotfound for flipt (`45fe0621`)
- Move flipt metrics/debug routes off public (`ab2b82b0`)
- Update nginx config for npm cache (`2f25980f`)
- Match TTL for hashes with artifact TTL (`0e11d8c4`)
- Add kube-system metrics/events for enterprise tenants (`c60b9a87`)
- Remove Madeline from lighthouse users (`3e860ae9`)
- DNS Admin for platform admins (`1e556b95`)
- Add Jack to prod db password readers (`3d20ed7c`)
- Update Claude settings to use correct schema (`8ed77e1b`)

---

## Linear Project Status

### Completed in March

| Project | Lead | Link |
| ------- | ---- | ---- |
| IO Trace Internal Helm Chart | Steve | [View](https://linear.app/nrwl/project/io-trace-internal-helm-chart) |
| Pylon Rollout & Evaluation | Steven | [View](https://linear.app/nrwl/project/pylon-rollout) |
| Bucket access binding -> memberships | Patrick | [View](https://linear.app/nrwl/project/bucket-access-binding) |
| Review Nx Resource Usage | Leosvel | [View](https://linear.app/nrwl/project/review-nx-resource-usage) |
| Bring identity portal into OpenTofu | Szymon | [View](https://linear.app/nrwl/project/identity-portal-opentofu) |
| Migrate DPE-tools to Lighthouse | Miroslav | [View](https://linear.app/nrwl/project/dpe-tools-lighthouse) |

### Active

| Project | Lead | Target | Link |
| ------- | ---- | ------ | ---- |
| CNW/Init Funnel & Cloud Conversion | Jack | 2026-04-10 | [View](https://linear.app/nrwl/project/cnw-init-funnel) |
| Implement Multi-Cluster Agent Setups | Steve | 2026-04-08 | [View](https://linear.app/nrwl/project/multi-cluster-agent-setups) |
| K8S Gateway API + L7 Load Balancing | Patrick | — | [View](https://linear.app/nrwl/project/k8s-gateway-api) |
| Task Sandboxing (Input/Output Tracing) | Rares | — | [View](https://linear.app/nrwl/project/task-sandboxing) |
| Polyr (Polygraph) | Victor | — | [View](https://linear.app/nrwl/project/polyr-polygraph) |
| CLI Agentic Experience (AX) | Max | — | [View](https://linear.app/nrwl/project/cli-agentic-experience) |
| Surface Level Telemetry | Colum | — | [View](https://linear.app/nrwl/project/surface-level-telemetry) |
| Workspace visibility | Mark | — | [View](https://linear.app/nrwl/project/workspace-visibility) |
| Ocean DX improvements | Nicole | — | [View](https://linear.app/nrwl/project/ocean-dx-improvements) |
| Feature demos | Nicole | 2026-03-31 | [View](https://linear.app/nrwl/project/feature-demos) |
| Allow new users to opt into Team plan | Benjamin | — | [View](https://linear.app/nrwl/project/team-plan-onboarding) |
| Quark-a task force | Cory | 2026-04-30 | [View](https://linear.app/nrwl/project/quark-a-task-force) |
| Enterprise Analytics API Cleanup | Rares | — | [View](https://linear.app/nrwl/project/enterprise-analytics-cleanup) |

### Issues Completed: 289+ across 7 teams

NXC 60+ · CLOUD 33 · INF 59+ · NXA 63+ · Q 39 · DOC 28 · CS 10

---

_Generated on 2026-03-24 (updated)._
