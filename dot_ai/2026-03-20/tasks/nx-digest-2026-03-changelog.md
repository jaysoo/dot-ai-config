# Nx Platform Changelog — March 2026

> **Sources:** Nx CLI GitHub releases (nrwl/nx), Nx Cloud public changelog (changelog.nx.app), nrwl/cloud-infrastructure commits, Linear (NXC-, CLOUD-, INF-, NXA-, Q-, DOC-).
>
> **Data gaps:** Month still in progress (through March 20).

## Nx 22.6.0 Stable Release (March 18)

Major release with 40+ features and 90+ fixes. Full release notes: [22.6.0](https://github.com/nrwl/nx/releases/tag/22.6.0). Key items not covered under specific themes below:

### New Features (CLI)

- **feat(angular):** Add support for Angular v21.2 ([#34592](https://github.com/nrwl/nx/pull/34592))
- **feat(core):** Add `--stdin` to affected options ([#34435](https://github.com/nrwl/nx/pull/34435))
- **feat(core):** Support dependency filesets with `^{projectRoot}` syntax ([#34310](https://github.com/nrwl/nx/pull/34310))
- **feat(core):** Add negation pattern support for plugin include/exclude ([#34160](https://github.com/nrwl/nx/pull/34160))
- **feat(core):** Add `preferBatch` executor option ([#34293](https://github.com/nrwl/nx/pull/34293))
- **feat(core):** Add `--otp` to top-level `nx release` command and detect EOTP errors ([#34473](https://github.com/nrwl/nx/pull/34473))
- **feat(core):** Add commands for debugging cache inputs / outputs ([#34414](https://github.com/nrwl/nx/pull/34414))
- **feat(core):** Add yarn berry catalog support ([#34552](https://github.com/nrwl/nx/pull/34552))
- **feat(core):** Add passthrough for nx-cloud apply-locally command ([#34557](https://github.com/nrwl/nx/pull/34557))
- **feat(core):** Add explicit cloud opt-out to CNW ([#34580](https://github.com/nrwl/nx/pull/34580))
- **feat(core):** Use `static_vcruntime` to avoid msvcrt dependency on Windows ([#19781](https://github.com/nrwl/nx/pull/19781))
- **feat(core):** Bring back cloud prompts and templates in CNW ([#34887](https://github.com/nrwl/nx/pull/34887)) — 22.6.0-rc.2
- **feat(devkit):** Add `NX_SKIP_FORMAT` environment variable to skip Prettier formatting ([#34336](https://github.com/nrwl/nx/pull/34336))
- **feat(js):** Add deps-sync generator ([#34407](https://github.com/nrwl/nx/pull/34407)) — 22.6.0-rc.1
- **feat(testing):** Add cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413))
- **feat(misc):** Track server page views for AI traffic using Netlify-Agent-Category ([#34883](https://github.com/nrwl/nx/pull/34883)) — 22.6.0-rc.1

### New Fixes (rc.1 / rc.2 / 22.6.0 only — not in previous betas)

- **fix(core):** Show continuous property in `nx show target` ([#34867](https://github.com/nrwl/nx/pull/34867)) — rc.1
- **fix(core):** Detect npm from package-lock.json before falling back to invoking PM ([#34877](https://github.com/nrwl/nx/pull/34877)) — rc.1
- **fix(core):** Trim memory usage associated with io-tracing service ([#34866](https://github.com/nrwl/nx/pull/34866)) — rc.1
- **fix(core):** Ensure workers shutdown after phase cancelled ([#34799](https://github.com/nrwl/nx/pull/34799)) — rc.1
- **fix(core):** Avoid overwhelming DB with connections during analytics init ([#34881](https://github.com/nrwl/nx/pull/34881)) — rc.1
- **fix(core):** Gracefully handle missing package manager and invalid workspace for CNW ([#34902](https://github.com/nrwl/nx/pull/34902)) — 22.6.0
- **fix(core):** Share `.agents` skills dir across codex, cursor, gemini ([#34882](https://github.com/nrwl/nx/pull/34882)) — 22.6.0
- **fix(core):** Wrap CNW normalize args function in error handler ([#34905](https://github.com/nrwl/nx/pull/34905)) — 22.6.0
- **fix(gradle):** Always check disk cache for gradle project graph reports ([#34873](https://github.com/nrwl/nx/pull/34873)) — rc.1
- **fix(vite):** Pin vitest v4 to ~4.0.x to fix Yarn Classic resolution failure ([#34878](https://github.com/nrwl/nx/pull/34878)) — rc.1
- **fix(nx-dev):** Cross site link checks working as expected ([#34685](https://github.com/nrwl/nx/pull/34685)) — rc.2
- **fix(nx-dev):** Add clickjacking protection headers to Netlify configs ([#34893](https://github.com/nrwl/nx/pull/34893)) — 22.6.0

---

## 22.7.0 Betas (March 19)

### 22.7.0-beta.0

- **feat(core):** Add .nx/self-healing to .gitignore ([#34855](https://github.com/nrwl/nx/pull/34855))
- **fix(core):** Skip analytics and DB connection when global bin hands off to local ([#34914](https://github.com/nrwl/nx/pull/34914))
- **fix(core):** Properly quote shell metacharacters in CLI args passed to tasks ([#34491](https://github.com/nrwl/nx/pull/34491))
- **fix(core):** Avoid redundant project graph requests in ngcli adapter ([#34907](https://github.com/nrwl/nx/pull/34907))
- **fix(core):** Ensure postTasksExecution fires on SIGINT for continuous tasks ([#34876](https://github.com/nrwl/nx/pull/34876))
- **fix(core):** Improve error handling in nx migrate registry fetching ([#34926](https://github.com/nrwl/nx/pull/34926))
- **fix(core):** Remove CRA migration logic from nx init ([#34912](https://github.com/nrwl/nx/pull/34912))
- **fix(core):** Pass collectInputs flag through daemon IPC for task hashing ([#34915](https://github.com/nrwl/nx/pull/34915))
- **fix(js):** Normalize cwd path separator in typescript plugin targets ([#34911](https://github.com/nrwl/nx/pull/34911))
- **fix(js):** Preserve tsconfig fields in typescript plugin cache ([#34908](https://github.com/nrwl/nx/pull/34908))
- **fix(linter):** Detect require() calls in enforce-module-boundaries rule ([#34896](https://github.com/nrwl/nx/pull/34896))
- **fix(linter):** Use native nx.configs in convert-to-flat-config for Nx plugins ([#34897](https://github.com/nrwl/nx/pull/34897))
- **fix(linter):** Convert project-level eslint configs and log when skipped ([#34899](https://github.com/nrwl/nx/pull/34899))
- **fix(linter):** Use root config to determine ESLint class in plugin ([#34900](https://github.com/nrwl/nx/pull/34900))
- **fix(nx-dev):** Resolve changelog page 500 error ([#34920](https://github.com/nrwl/nx/pull/34920))
- **fix(testing):** Handle undefined options in playwright preset ([#34750](https://github.com/nrwl/nx/pull/34750))

### 22.7.0-beta.1

- **fix(core):** Prevent DB corruption from concurrent initialization ([#34861](https://github.com/nrwl/nx/pull/34861))

---

## Task Sandboxing & Hermetic Builds

### CLI

- Clear `TaskIOService` retained data after subscription and don't accumulate it ([NXC-3956](https://linear.app/nxdev/issue/NXC-3956)) — Craigory
- Evaluate skipping Rust-to-JS input transfer without subscribers ([NXC-4082](https://linear.app/nxdev/issue/NXC-4082)) — Craigory
- Show whether a target is continuous in `nx show target` ([NXC-4084](https://linear.app/nxdev/issue/NXC-4084))
- Fix process tree filtering with many subprocesses ([NXC-4066](https://linear.app/nxdev/issue/NXC-4066)) — Louie
- TS tasks should depend on all referenced tsconfig files from deps ([NXC-4081](https://linear.app/nxdev/issue/NXC-4081)) — Leosvel
- Track tsconfig files from dependency reference chain as inputs ([#34848](https://github.com/nrwl/nx/pull/34848)) — 22.6.0-beta.14
- Include transitive dep outputs in typecheck inputs ([#34773](https://github.com/nrwl/nx/pull/34773)) — 22.6.0-beta.12
- Always infer dependentTasksOutputFiles for tsc build targets ([#34784](https://github.com/nrwl/nx/pull/34784)) — 22.6.0-beta.12
- Add external project reference config files as inputs for tsc tasks ([#34770](https://github.com/nrwl/nx/pull/34770)) — 22.6.0-beta.12
- Include tsbuildinfo in dependentTasksOutputFiles for tsc tasks ([#34733](https://github.com/nrwl/nx/pull/34733)) — 22.6.0-beta.11
- Add *.tsbuildinfo dependent outputs to tsc tasks ([NXC-4041](https://linear.app/nxdev/issue/NXC-4041)) — Leosvel
- Derive tsbuildinfo filename from iterated tsconfig, not outer config ([#34738](https://github.com/nrwl/nx/pull/34738)) — 22.6.0-beta.11
- Infer dependency tsconfig files as playwright plugin inputs ([#34803](https://github.com/nrwl/nx/pull/34803)) — 22.6.0-beta.14
- Infer task inputs from jest config file references ([#34740](https://github.com/nrwl/nx/pull/34740)) — 22.6.0-beta.14
- Input violation check disagrees with `nx show target` ([NXC-4054](https://linear.app/nxdev/issue/NXC-4054)) — Rares
- Fix sandboxing inputs for `nx:build-base` ([NXC-4057](https://linear.app/nxdev/issue/NXC-4057)) — Leosvel
- Nx repo test targets missing input for scripts/patched-jest-resolver.js ([NXC-4005](https://linear.app/nxdev/issue/NXC-4005)) — Leosvel
- E2E tests show unexpected reads on tsconfig.spec.json files ([NXC-4051](https://linear.app/nxdev/issue/NXC-4051)) — Leosvel
- IO tracing inputs list differs from expected nx outputs ([NXC-4011](https://linear.app/nxdev/issue/NXC-4011)) — Craigory
- Exclude e2e.log from tracing ([NXC-4064](https://linear.app/nxdev/issue/NXC-4064)) — Leosvel
- Sandbox tracing should exclude .nx/cache reads/writes from results ([NXC-4003](https://linear.app/nxdev/issue/NXC-4003))
- Remove folder reads because they cannot be inputs ([NXC-3967](https://linear.app/nxdev/issue/NXC-3967)) — Rares
- Find a solution for .nx/workspace-data/project-graph.json showing up for lint tasks ([NXC-3966](https://linear.app/nxdev/issue/NXC-3966)) — Craigory
- Determine why eslint reads package.json ([NXC-3968](https://linear.app/nxdev/issue/NXC-3968)) — Craigory
- nx-cloud.db* files are unexpectedly read during e2e lint runs ([NXC-3999](https://linear.app/nxdev/issue/NXC-3999))
- [machineId].db* files are unexpectedly read during sandboxed task runs ([NXC-4000](https://linear.app/nxdev/issue/NXC-4000))
- graph-ui-code-block:typecheck reads undeclared build outputs from graph/ui-common ([NXC-4004](https://linear.app/nxdev/issue/NXC-4004)) — Leosvel
- Investigate d.ts outputs from dependency projects ([NXC-3965](https://linear.app/nxdev/issue/NXC-3965)) — Leosvel
- `feature-organization-conformance-rule-seed:build` race condition ([NXC-4037](https://linear.app/nxdev/issue/NXC-4037)) — Rares
- Daemon still has memory issues ([NXC-4039](https://linear.app/nxdev/issue/NXC-4039)) — Rares
- Enable signal file writing automatically on agents ([NXC-3973](https://linear.app/nxdev/issue/NXC-3973)) — Rares
- Ensure that run-executor is not used for run-commands processes in agents ([NXC-4033](https://linear.app/nxdev/issue/NXC-4033)) — Jason
- Use JSON by default for AI agent `show target` command ([NXC-3974](https://linear.app/nxdev/issue/NXC-3974), [#34780](https://github.com/nrwl/nx/pull/34780)) — Craigory
- Batch hashing, topological cache walk, and TUI batch fixes ([#34798](https://github.com/nrwl/nx/pull/34798)) — 22.6.0-beta.13
- Ensure batch tasks always have hash for DTE ([#34764](https://github.com/nrwl/nx/pull/34764)) — 22.6.0-beta.12
- Pass collectInputs flag through daemon IPC for task hashing ([#34915](https://github.com/nrwl/nx/pull/34915)) — 22.7.0-beta.0

### Cloud

- Add file list filters in sandbox analysis process view ([CLOUD-4344](https://linear.app/nxdev/issue/CLOUD-4344)) — Louie
- Alphabetize and add filter for trace end node list ([CLOUD-4338](https://linear.app/nxdev/issue/CLOUD-4338)) — Chau
- Show compare panel for tasks without violations ([Q-295](https://linear.app/nxdev/issue/Q-295)) — Louie
- Investigate memory usage for tree view ([Q-242](https://linear.app/nxdev/issue/Q-242)) — Louie
- Use streaming to read and render file tree and file viewer components ([Q-249](https://linear.app/nxdev/issue/Q-249)) — Louie
- List view filter should support glob patterns ([Q-260](https://linear.app/nxdev/issue/Q-260)) — Louie
- Ensure that views in the sandbox analysis can be toggled via URL ([Q-286](https://linear.app/nxdev/issue/Q-286)) — Louie
- File tree view: toggle violation types visibility ([Q-259](https://linear.app/nxdev/issue/Q-259)) — Louie
- Show task ID in sandbox analysis view ([Q-277](https://linear.app/nxdev/issue/Q-277)) — Louie
- Add timeline/conformance view for sandbox violations ([Q-279](https://linear.app/nxdev/issue/Q-279)) — Louie
- Mismatch between files written count and file tree ([Q-283](https://linear.app/nxdev/issue/Q-283)) — Louie
- Unexpected reads exceed total files read in sandbox report ([Q-281](https://linear.app/nxdev/issue/Q-281)) — Rares
- Embed sandboxing exclusion list in Nx io-trace-daemon ([Q-273](https://linear.app/nxdev/issue/Q-273)) — Rares
- Limit sandbox violations warning list and link to sorted run view ([Q-269](https://linear.app/nxdev/issue/Q-269)) — Louie
- UI filtering not applied on initial load in Remix ([Q-272](https://linear.app/nxdev/issue/Q-272)) — Louie
- Add run details filters for flaky and sandbox violations ([Q-265](https://linear.app/nxdev/issue/Q-265))
- Handle file deletions ([Q-237](https://linear.app/nxdev/issue/Q-237)) — Rares
- Remove violations tab view ([Q-266](https://linear.app/nxdev/issue/Q-266)) — Louie
- Sandbox report taskId coerces special symbols to `_` ([Q-250](https://linear.app/nxdev/issue/Q-250)) — Rares
- Default to file tree with unexpected filter enabled ([NXC-4067](https://linear.app/nxdev/issue/NXC-4067)) — Louie

### Infrastructure

- Enable debug logging and trace nx:test on staging (`7750b78a`) — Rares
- Rename io tracing directory to sandboxing-metadata (`0f11ee68`) — Rares
- Reduce io-trace-daemon ringbuf size to 512MB on dev and staging (`b82562c7`, `f41cf10e`) — Rares
- Make daemon config explicit in helm and fix ringbuf default (`fcd0b703`) — Rares
- Match TTL for hashes with artifact TTL (`0e11d8c4`) — Louie
- Use internal nx-api route for daemon on staging (`3e4f3d05`) — Rares (Mar 20)

### Docs

- Document sandboxing feature for linking from Cloud UI ([DOC-429](https://linear.app/nxdev/issue/DOC-429)) — Jack

---

## AI-Powered Development

### Polygraph AI

#### CLI

- Add polygraph command to initialize cross-repo sessions ([#34722](https://github.com/nrwl/nx/pull/34722)) — 22.6.0-beta.10

#### Red Panda (NXA-)

- Track initiating branch in .nx/polygraph ([NXA-1114](https://linear.app/nxdev/issue/NXA-1114)) — Max
- Rename the `cloud_polygraph_delegate` skill to `polygraph_delegate` ([NXA-1158](https://linear.app/nxdev/issue/NXA-1158)) — Max
- Explore sessions without initiator ([NXA-1095](https://linear.app/nxdev/issue/NXA-1095))
- Create README for polygraph-mcp repo ([NXA-1143](https://linear.app/nxdev/issue/NXA-1143)) — Max
- Add branch protection to polygraph repos ([NXA-1152](https://linear.app/nxdev/issue/NXA-1152)) — Max
- Make monitor CI work with GitHub Actions ([NXA-1090](https://linear.app/nxdev/issue/NXA-1090)) — Jonathan
- Get GitHub Action logs ([NXA-1029](https://linear.app/nxdev/issue/NXA-1029)) — Jonathan
- Make branch names and session ids unique ([NXA-1051](https://linear.app/nxdev/issue/NXA-1051)) — Max
- Explore uploading child logs to cloud ([NXA-1092](https://linear.app/nxdev/issue/NXA-1092)) — Max
- Update polygraph skills with new polygraph mcp naming ([NXA-1142](https://linear.app/nxdev/issue/NXA-1142)) — Max
- Create separate polygraph mcp ([NXA-1131](https://linear.app/nxdev/issue/NXA-1131)) — Max
- Polygraph command ([NXA-1121](https://linear.app/nxdev/issue/NXA-1121)) — Victor
- Battle test cross-repo plan mode ([NXA-1024](https://linear.app/nxdev/issue/NXA-1024)) — Victor
- Enable adding repos to a running polygraph session ([NXA-1107](https://linear.app/nxdev/issue/NXA-1107)) — Max
- Pushing branch after initial push fails with `push_branch` tool ([NXA-1123](https://linear.app/nxdev/issue/NXA-1123))
- Figure out why deps from nx-example to nx aren't inferred correctly ([NXA-1100](https://linear.app/nxdev/issue/NXA-1100)) — Victor
- Implement edge drawing in the app ([NXA-917](https://linear.app/nxdev/issue/NXA-917)) — Victor
- Explore using ACP ([NXA-1096](https://linear.app/nxdev/issue/NXA-1096)) — Victor
- Test e2e experience for metadata-only workspaces ([NXA-1091](https://linear.app/nxdev/issue/NXA-1091)) — Victor
- General login command ([NXA-1122](https://linear.app/nxdev/issue/NXA-1122)) — Victor
- Workspace graph not connecting when project starts with `@` ([NXA-973](https://linear.app/nxdev/issue/NXA-973))
- Require "nx login" to be used ([NXA-909](https://linear.app/nxdev/issue/NXA-909)) — Jonathan
- Add Nx and Nx examples to polygraph ([NXA-1013](https://linear.app/nxdev/issue/NXA-1013)) — Jonathan
- Repo summarization ([NXA-1011](https://linear.app/nxdev/issue/NXA-1011)) — Victor
- Use workspace skill for summarization ([NXA-1012](https://linear.app/nxdev/issue/NXA-1012)) — Victor
- Sync PR statuses ([NXA-1020](https://linear.app/nxdev/issue/NXA-1020)) — Jonathan

### Self-Healing CI

#### Cloud Changelog

- Self-Healing CI discovers registered `prepare-commit-msg` and `commit-msg` git hooks and runs them on AI agent's proposed commit message (2603.12.1)
- Fixed styling of self-healing CI error alerts and model provider issues banner (2603.10.5)
- Allow users with allowed email domains to accept, reject, and revert suggestions (2603.07.1)
- Prevented formatting hook from resolving prettier config from outside workspace, fixing large fix suggestion diffs (2603.20.2)

#### Red Panda (NXA-)

- Add `EXCLUDE_AI_CREDITS` plan modifier to MailChimp (ST), Moderna (Prod), Cloudinary (ST) ([NXA-1154](https://linear.app/nxdev/issue/NXA-1154)) — Altan
- Self-healing board shows generating fix after completion ([NXA-1156](https://linear.app/nxdev/issue/NXA-1156)) — Mark
- Self-serve adoption: Docs and UI messaging cleanup ([NXA-1105](https://linear.app/nxdev/issue/NXA-1105)) — James
- Update Claude agent SDK to support Tasks ([NXA-834](https://linear.app/nxdev/issue/NXA-834)) — James
- Blocked on zod 4 migration — unblocked ([NXA-1021](https://linear.app/nxdev/issue/NXA-1021)) — James
- Add option during onboarding to open PR to enable self-healing in repo ([NXA-782](https://linear.app/nxdev/issue/NXA-782)) — Chau
- No permission to accept suggestion in Self Healing CI ([NXA-1098](https://linear.app/nxdev/issue/NXA-1098)) — Chau
- Add UI messaging for `modelProviderIssueStatus` field ([NXA-1117](https://linear.app/nxdev/issue/NXA-1117)) — Mark
- Augment self-healing status visibility for task items ([NXA-878](https://linear.app/nxdev/issue/NXA-878)) — Mark
- Track state against fixes created during Anthropic issues ([NXA-936](https://linear.app/nxdev/issue/NXA-936)) — James

### Agentic Experience (AX)

#### CLI

- Handle agentic sandboxing ([#34402](https://github.com/nrwl/nx/pull/34402)) — 22.6.0
- Extract sandbox detection into reusable utility ([#34408](https://github.com/nrwl/nx/pull/34408)) — 22.6.0
- Add agentic mode to nx init ([#34418](https://github.com/nrwl/nx/pull/34418)) — 22.6.0
- Automatically set up AI agents in cnw/init when run from within an AI agent ([#34469](https://github.com/nrwl/nx/pull/34469)) — 22.6.0
- Implement configure-ai-agents outdated message after tasks ([#34463](https://github.com/nrwl/nx/pull/34463)) — 22.6.0
- Improve codex support for configure-ai-agents ([#34488](https://github.com/nrwl/nx/pull/34488)) — 22.6.0
- Improve AX of configure-ai-agents with auto-detection ([#34496](https://github.com/nrwl/nx/pull/34496)) — 22.6.0
- Add AI agent mode to nx import ([#34498](https://github.com/nrwl/nx/pull/34498)) — 22.6.0
- Add --json flag for better AX to nx list ([#34551](https://github.com/nrwl/nx/pull/34551)) — 22.6.0
- Add Codex subagent support to configure-ai-agents ([#34553](https://github.com/nrwl/nx/pull/34553)) — 22.6.0-beta.9
- Show json by default for agentic AI ([#34780](https://github.com/nrwl/nx/pull/34780)) — 22.6.0-beta.12
- Update formatting of agent rules documentation ([#33356](https://github.com/nrwl/nx/pull/33356)) — 22.6.0
- Update PLUGIN.md files to help agents verification ([#34379](https://github.com/nrwl/nx/pull/34379)) — 22.6.0
- Share .agents skills dir across codex, cursor, gemini ([#34882](https://github.com/nrwl/nx/pull/34882)) — 22.6.0
- Add .claude/settings.local.json to .gitignore ([#34870](https://github.com/nrwl/nx/pull/34870)) — 22.6.0-rc.0
- Add .claude/worktrees to gitignore ([#34693](https://github.com/nrwl/nx/pull/34693)) — 22.6.0-beta.10
- Add .nx/self-healing to .gitignore ([#34855](https://github.com/nrwl/nx/pull/34855)) — 22.7.0-beta.0
- Preserve existing source properties in claude plugin config ([#34499](https://github.com/nrwl/nx/pull/34499)) — 22.6.0
- Make sure that mcp args aren't overridden when running configure-ai-agents ([#34381](https://github.com/nrwl/nx/pull/34381)) — 22.6.0
- Only pull configure-ai-agents from latest if local version is not latest ([#34484](https://github.com/nrwl/nx/pull/34484)) — 22.6.0
- Handle Ctrl+C gracefully in configure-ai-agents ([dd3b79ebf4](https://github.com/nrwl/nx/commit/dd3b79ebf4)) — 22.6.0

#### Red Panda (NXA-)

- [Import] test & document import gaps for @nx/gradle ([NXA-1069](https://linear.app/nxdev/issue/NXA-1069)) — Max
- Improve `nx import` AX just like cnw/init ([NXA-1006](https://linear.app/nxdev/issue/NXA-1006)) — Max
- Monitor CI skill: bail when deps/tools unavailable ([NXA-952](https://linear.app/nxdev/issue/NXA-952)) — Chau
- Explore reducing CI watcher subagent background polling tasks ([NXA-1004](https://linear.app/nxdev/issue/NXA-1004)) — Chau
- Plan out robust future for /sandbox & nx ([NXA-997](https://linear.app/nxdev/issue/NXA-997)) — Colum
- Enable codex subagents once they support them ([NXA-1023](https://linear.app/nxdev/issue/NXA-1023)) — Max
- [Import] test & document import gaps for @nx/vite ([NXA-1075](https://linear.app/nxdev/issue/NXA-1075)) — Jack
- [Import] test & document import gaps for @nx/next ([NXA-1061](https://linear.app/nxdev/issue/NXA-1061)) — Jack
- Claude Code worktrees need to be Nx/Git ignored ([NXA-1116](https://linear.app/nxdev/issue/NXA-1116)) — Juri

### Docs

- Merge self-healing auto-apply video PR after video goes live ([DOC-440](https://linear.app/nxdev/issue/DOC-440)) — Juri

---

## Telemetry & Analytics

### CLI

- Add analytics ([#34144](https://github.com/nrwl/nx/pull/34144)) — 22.6.0-beta.11
- Persist analytics session ID across CLI invocations ([#34763](https://github.com/nrwl/nx/pull/34763)) — 22.6.0-beta.12
- Centralize perf tracking and report metrics to telemetry ([#34795](https://github.com/nrwl/nx/pull/34795)) — 22.6.0-beta.13
- Prompt for analytics preference during workspace creation ([#34818](https://github.com/nrwl/nx/pull/34818)) — 22.6.0-beta.14
- Add task and project count telemetry via performance lifecycle ([#34821](https://github.com/nrwl/nx/pull/34821)) — 22.6.0-beta.14
- Skip analytics prompt for cloud commands ([#34789](https://github.com/nrwl/nx/pull/34789)) — 22.6.0-beta.14
- Skip analytics and DB connection when global bin hands off to local ([#34914](https://github.com/nrwl/nx/pull/34914)) — 22.7.0-beta.0
- Prevent DB corruption from concurrent initialization ([#34861](https://github.com/nrwl/nx/pull/34861)) — 22.7.0-beta.1

### Linear (NXC-)

- Dogfood in ocean ([NXC-3695](https://linear.app/nxdev/issue/NXC-3695)) — Jason
- Dogfood in nx ([NXC-3696](https://linear.app/nxdev/issue/NXC-3696)) — Jason
- Flush events on Process.exit / handleErrors ([NXC-3800](https://linear.app/nxdev/issue/NXC-3800)) — Colum
- Remove sensitive data from args before sending ([NXC-3889](https://linear.app/nxdev/issue/NXC-3889)) — Colum
- Capture Project Graph Creation time and send event to GA ([NXC-3734](https://linear.app/nxdev/issue/NXC-3734)) — Colum
- Capture Nx Command and send event to GA ([NXC-3733](https://linear.app/nxdev/issue/NXC-3733)) — Colum
- Add configuration for opt-out of tracking ([NXC-3731](https://linear.app/nxdev/issue/NXC-3731)) — Colum
- Add prompt during CNW + Nx invocation ([NXC-3732](https://linear.app/nxdev/issue/NXC-3732)) — Colum
- Track args as page location querystring ([NXC-3890](https://linear.app/nxdev/issue/NXC-3890)) — Colum
- Remove Major Version Number Properties ([NXC-3801](https://linear.app/nxdev/issue/NXC-3801)) — Colum
- Change custom metric to time such that we only need one for different use cases ([NXC-3802](https://linear.app/nxdev/issue/NXC-3802)) — Colum
- Track page view and other events separately ([NXC-3803](https://linear.app/nxdev/issue/NXC-3803)) — Colum
- Handle json file clobbering ([NXC-3910](https://linear.app/nxdev/issue/NXC-3910)) — Colum
- Rewrite in Rust ([NXC-3891](https://linear.app/nxdev/issue/NXC-3891)) — Jason

### Cloud

- CI pipeline execution durations chart now displays percentile values: p95, p75, p50, p25, p5 (2603.04.2)
- Add P95 CIPE duration to analytics graph ([CLOUD-4323](https://linear.app/nxdev/issue/CLOUD-4323)) — Nicole

---

## Security

### CLI

- Address security CVE cluster (copy-webpack-plugin, koa, minimatch) ([#34708](https://github.com/nrwl/nx/pull/34708), [NXC-4030](https://linear.app/nxdev/issue/NXC-4030)) — 22.6.0-beta.10 / 22.5.4
- Bump nuxt to 3.21.1 to resolve critical audit vulnerability ([#34783](https://github.com/nrwl/nx/pull/34783)) — 22.6.0-beta.13
- Bump fork-ts-checker-webpack-plugin to 9.1.0 ([#34826](https://github.com/nrwl/nx/pull/34826)) — 22.6.0-beta.14
- Cap less version to <4.6.0 to avoid ESM incompatibility ([#34781](https://github.com/nrwl/nx/pull/34781)) — 22.6.0-beta.12
- Properly quote shell metacharacters in CLI args passed to tasks ([#34491](https://github.com/nrwl/nx/pull/34491)) — 22.7.0-beta.0

### Cloud

- Frontend CRITICAL CVE-2025-15467 ([CLOUD-4351](https://linear.app/nxdev/issue/CLOUD-4351)) — Altan
- Pentest: Unauthenticated access to workspace achievements endpoint ([CLOUD-4311](https://linear.app/nxdev/issue/CLOUD-4311)) — Nicole
- Pentest: Email verification not enforced ([CLOUD-4310](https://linear.app/nxdev/issue/CLOUD-4310)) — Dillon
- Pentest: Sensitive data in session cookies (refresh token exposure) ([CLOUD-4312](https://linear.app/nxdev/issue/CLOUD-4312)) — Chau

### Infrastructure

- Remediate IAM access keys for Rares (Vanta) ([INF-1191](https://linear.app/nxdev/issue/INF-1191)) — Rares
- Remediate security training records (Vanta) ([CLOUD-4345](https://linear.app/nxdev/issue/CLOUD-4345)) — Mark
- Automate IAM permission assignment for users in new AWS accounts ([INF-1253](https://linear.app/nxdev/issue/INF-1253)) — Szymon
- Admin push for tofu deny rules (`d79fbf30`) — Steve
- Route nx-cloud/private to backend-not-found on prod (`448aab74`) — Patrick
- Route nx-cloud/private to backend-not-found on ST (`e5fcd2a7`) — Steve
- SCIM token and new access control for Caseware (`7e7ae606`) — Steve (Mar 19)
- Move flipt metrics/debug routes off public (`ab2b82b0`) — Steve (Mar 19)
- Remove redundant secret keys from staging/prod (`e7c06ce6`) — Szymon (Mar 20)

---

## Onboarding & Growth

### Cloud Changelog

- Added plan selection step in onboarding (2603.11.1)
- Show more descriptive warnings if user needs to adjust GitHub app config (2603.04.3)
- Refreshed verify email UI (2603.10.13)
- Fixed issue that mistakenly redirected users to Nx Cloud home after installing GitHub app (2603.10.1)
- Added link to Nx Cloud changelog (changelog.nx.app) in app footer (2603.20.1)

### Cloud (Linear)

- Simplify e2e auth by avoiding Auth0 in CI ([CLOUD-4270](https://linear.app/nxdev/issue/CLOUD-4270)) — Chau
- Add metadata-only auto opt-in after one-page onboarding migration ([CLOUD-4343](https://linear.app/nxdev/issue/CLOUD-4343))
- After a user creates their account, immediately prompt them to connect their GH/GL account ([CLOUD-3879](https://linear.app/nxdev/issue/CLOUD-3879))

### Workspace Visibility (NXA-)

- Add OAuth integration for Azure DevOps ([NXA-897](https://linear.app/nxdev/issue/NXA-897)) — Chau
- Default workspace visibility to repository access for new workspaces ([NXA-995](https://linear.app/nxdev/issue/NXA-995)) — Mark
- Test visibility settings in snapshot/staging ([NXA-1102](https://linear.app/nxdev/issue/NXA-1102)) — Mark
- Disable org visibility in settings action if env var is set ([NXA-1133](https://linear.app/nxdev/issue/NXA-1133)) — Mark
- Clean up remaining uses of organization public/private setting ([NXA-1136](https://linear.app/nxdev/issue/NXA-1136)) — Mark

### Infrastructure

- Enable workspace visibility env vars on dev, staging, prod (`a1c6c914`, `03c8369c`, `f5c949f7`) — Mark

### CLI

- Restore CNW user flow to match v22.1.3 ([#34671](https://github.com/nrwl/nx/pull/34671), [NXC-4020](https://linear.app/nxdev/issue/NXC-4020)) — 22.5.4
- Surface clearer error when CNW hits SANDBOX_FAILED ([#34724](https://github.com/nrwl/nx/pull/34724), [NXC-4035](https://linear.app/nxdev/issue/NXC-4035)) — 22.6.0-beta.10

---

## JVM Ecosystem (Gradle & Maven)

### CLI — Gradle

- Tee batch runner output to stderr for terminal display ([#34630](https://github.com/nrwl/nx/pull/34630)) — 22.5.4
- Use object format for dependsOn instead of shorthand strings ([#34715](https://github.com/nrwl/nx/pull/34715)) — 22.6.0-beta.11
- Exclude non-JS gradle sub-projects from eslint plugin ([#34735](https://github.com/nrwl/nx/pull/34735)) — 22.6.0-beta.11
- Add properties and wrappers to inputs ([#34778](https://github.com/nrwl/nx/pull/34778)) — 22.6.0-beta.12
- Ensure that ci test target depends on take overrides into account ([#34777](https://github.com/nrwl/nx/pull/34777)) — 22.6.0-beta.12
- Handle project names containing .json substring ([#34832](https://github.com/nrwl/nx/pull/34832)) — 22.6.0-beta.14
- Batch-safe hashing for maven and gradle ([#34446](https://github.com/nrwl/nx/pull/34446)) — 22.6.0-beta.11
- Ensure that atomized task targets have dependsOn ([#34611](https://github.com/nrwl/nx/pull/34611)) — 22.6.0
- Use globs for dependent task output files ([#34590](https://github.com/nrwl/nx/pull/34590)) — 22.6.0
- Always check disk cache for gradle project graph reports ([#34873](https://github.com/nrwl/nx/pull/34873)) — rc.1

### Linear — Gradle

- Implicit dependencies using project.json name not detected ([NXC-4034](https://linear.app/nxdev/issue/NXC-4034)) — Craigory
- Atomized depends-on targets ignore target name override ([NXC-4056](https://linear.app/nxdev/issue/NXC-4056)) — Louie
- Remove custom Nx project name overrides in nx repo ([NXC-3829](https://linear.app/nxdev/issue/NXC-3829)) — Max
- Reconcile Gradle plugin inferred dependsOn with renamed projects ([NXC-3828](https://linear.app/nxdev/issue/NXC-3828)) — Craigory
- Logs are not showing up in agents ([NXC-3989](https://linear.app/nxdev/issue/NXC-3989)) — Louie
- Ensure that changes to version catalogs invalidate gradle project graph cache ([Q-294](https://linear.app/nxdev/issue/Q-294)) — Louie
- :gradle-project-graph:lint reads undeclared inputs ([NXC-4001](https://linear.app/nxdev/issue/NXC-4001)) — Leosvel

### CLI — Maven

- Synchronize batch runner invoke() to prevent concurrent access ([#34600](https://github.com/nrwl/nx/pull/34600)) — 22.5.4
- Report external Maven dependencies in project graph ([#34368](https://github.com/nrwl/nx/pull/34368)) — 22.6.0-beta.12
- Use mutable lists for Maven session projects ([#34834](https://github.com/nrwl/nx/pull/34834)) — 22.6.0-beta.14
- Use module-level variable for cache transfer between createNodes and createDependencies ([#34386](https://github.com/nrwl/nx/pull/34386)) — 22.6.0
- Correctly map between maven locators and nx project names ([#34366](https://github.com/nrwl/nx/pull/34366)) — 22.6.0
- Write output after each task in batch mode to ensure correct files are cached ([#34400](https://github.com/nrwl/nx/pull/34400)) — 22.6.0
- Fix set the pom file without changing base directory ([#34182](https://github.com/nrwl/nx/pull/34182)) — 22.6.0

### Linear — Maven

- Add external dependencies ([NXC-3849](https://linear.app/nxdev/issue/NXC-3849)) — Jason
- testCompile does not have inputs for test sources ([NXC-3954](https://linear.app/nxdev/issue/NXC-3954)) — Jason
- Investigate maven caching bug in batch mode v4 e2e test ([NXC-3888](https://linear.app/nxdev/issue/NXC-3888)) — Jason

---

## Enterprise & Infrastructure

### Multi-Cluster Agent Setups

- Create client for facade ([INF-1154](https://linear.app/nxdev/issue/INF-1154)) — Steve
- Add endpoints to controller startup when --downstream param is set ([INF-1153](https://linear.app/nxdev/issue/INF-1153)) — Steve
- Design models and api surface for controller ([INF-1152](https://linear.app/nxdev/issue/INF-1152)) — Steve
- Controller subsystem audit for facade mode ([INF-1141](https://linear.app/nxdev/issue/INF-1141)) — Steve
- Spike facade mode gating prototype ([INF-1151](https://linear.app/nxdev/issue/INF-1151)) — Steve
- Document cross-dependencies and risks for selective disabling ([INF-1150](https://linear.app/nxdev/issue/INF-1150)) — Steve
- Audit main.go startup sequence and map all initialized subsystems ([INF-1149](https://linear.app/nxdev/issue/INF-1149)) — Steve
- Define config path for downstreams that facade needs for checks ([INF-1239](https://linear.app/nxdev/issue/INF-1239)) — Steve (Mar 18)

### K8S Gateway API

- Stamp-able way to enable Gateway API ([INF-1251](https://linear.app/nxdev/issue/INF-1251)) — Patrick
- Update Google Terraform to support Gateway API ([INF-1250](https://linear.app/nxdev/issue/INF-1250)) — Patrick
- Create a K8s Gateway in dev ([INF-1237](https://linear.app/nxdev/issue/INF-1237)) — Patrick
- Create module for gatewayapi (`9cb3d8c8`) — Patrick
- Enable gatewayapi for staging/prod app clusters (`b0e843f2`) — Patrick
- Enable Gateway API in dev (`e1bc6f0d`) — Patrick
- Refactor gatewayapi to use externaldns (`0d05d2af`) — Patrick
- Use private DNS for gateway API (`0d0b399f`) — Patrick
- Add proxy subnet for internal ALB (`8725845d`) — Patrick
- Add gateway-api helm chart (`4ea56524`) — Patrick
- Update tf module to allow any number of record sets (`937d5af1`) — Patrick
- GatewayAPI support for cert-manager (`6f74bb1a`) — Patrick (Mar 18)
- Swap Application Gateway to HTTPS (`f59aeed2`) — Patrick (Mar 18)
- Update dev wf cluster to use gateway api (`a66ccf11`) — Patrick (Mar 17)
- Add HealthCheckPolicy to GatewayAPI chart (`4c830a14`) — Patrick (Mar 17)
- PushSecret/ESO managed secret handling (`bcdc1ae9`, `a5cd79e9`, `29a8dc16`) — Patrick (Mar 18)
- Gateway API in staging with cert-manager and external-dns (`3f46e5c5`, `8977cc0c`) — Patrick (Mar 19)
- Enable gatewayapi on wf clusters in staging/prod (`c277bdf9`) — Patrick (Mar 19)
- Gateway API in dev with correct config (`661659ef`) — Patrick (Mar 18)
- Gateway API Infrastructure for staging/prod (`0a5b7a4e`) — Patrick (Mar 19)
- Allow projects via AppProject for staging (`8977cc0c`) — Patrick (Mar 19)
- Gateway API in dev environment (`5130f8ca`, `31ba21c5`) — Patrick (Mar 19)

### Azure Redis/Valkey Auth

- Remove azure specific env var in wf-controller ([INF-1247](https://linear.app/nxdev/issue/INF-1247)) — Szymon
- Move out wf-controller env vars from AppSet to tenant value files in Azure ([INF-1241](https://linear.app/nxdev/issue/INF-1241)) — Szymon
- Add azure redis auth in nx-api ([INF-1235](https://linear.app/nxdev/issue/INF-1235)) — Szymon
- Add azure redis auth in workflow controller ([INF-1233](https://linear.app/nxdev/issue/INF-1233)) — Szymon
- Use azure managed redis for aztester ([infrastructure commits]) — Szymon
- Move valkey config out of app sets (`84ae5b74`) — Szymon

### Identity & IAM

- Import existing SSO resources into tofu code ([INF-1249](https://linear.app/nxdev/issue/INF-1249)) — Szymon
- Automate IAM permission assignment for users in new AWS accounts ([INF-1253](https://linear.app/nxdev/issue/INF-1253)) — Szymon
- Remove identity portal imports (`af287223`) — Szymon
- Import existing identity portal resources (`c5275085`) — Szymon

### Secrets Management

- Split development secrets ([INF-1261](https://linear.app/nxdev/issue/INF-1261)) — Szymon
- Use new secrets in dev ([INF-1264](https://linear.app/nxdev/issue/INF-1264)) — Szymon
- Add mongo connection string secret (`367a3f2e`) — Szymon
- Split app secrets dev (`4abe5624`) — Szymon
- Split staging app secrets (`bc522624`) — Szymon (Mar 18)
- Rename mandrill secret file for staging (`38557d8b`) — Szymon (Mar 18)
- Use new secrets in staging (`498a8cfb`) — Szymon (Mar 18)
- Split prod secrets (`1825e0dc`) — Szymon (Mar 19)
- Use new secrets in prod NA (`e293570a`) — Szymon (Mar 19)
- Use new secrets in prod EU (`21295b8f`) — Szymon (Mar 19)
- Remove redundant secret keys from staging/prod (`e7c06ce6`) — Szymon (Mar 20)

### Grafana Billing Alerts

- Add Grafana space to spacelift ([INF-1228](https://linear.app/nxdev/issue/INF-1228)) — Szymon
- Grafana alert for monthly cost ([INF-1225](https://linear.app/nxdev/issue/INF-1225)) — Szymon
- Figure out grafana billing alert conditions ([INF-1219](https://linear.app/nxdev/issue/INF-1219)) — Szymon
- Add grafana stack to spacelift (`f278903a`) — Szymon
- Add grafana space (`09b50dd0`) — Szymon
- Enable grafana resources by default for enterprise AWS (`3f2c3d13`) — Patrick
- Change nxcloud public metrics scrape interval to hourly (`8328c163`) — Rares
- Run public metrics aggregation hourly (`71569602`) — Rares

### Enterprise Single-Tenant Changes

- New Single Tenant Instance: Caseware (AWS) ([INF-1224](https://linear.app/nxdev/issue/INF-1224)) — Patrick
- Request for Change: Caseware SAML ([INF-1242](https://linear.app/nxdev/issue/INF-1242)) — Steve
- Infrastructure Change: Caseware GH app ([INF-1231](https://linear.app/nxdev/issue/INF-1231)) — Steve
- SCIM token and new access control for Caseware (`7e7ae606`) — Steve (Mar 19)
- Request for Change: Legora SAML ([INF-1258](https://linear.app/nxdev/issue/INF-1258)) — Szymon
- Request for Change: Legora workflow runner ([INF-1240](https://linear.app/nxdev/issue/INF-1240)) — Szymon
- Request for Change: Legora GH redirect URL ([INF-1238](https://linear.app/nxdev/issue/INF-1238)) — Steve
- Request for Change: Mimecast AI features ([INF-1236](https://linear.app/nxdev/issue/INF-1236)) — Szymon
- Request for Change: Cloudinary self-healing ([INF-1232](https://linear.app/nxdev/issue/INF-1232)) — Szymon
- Enable io-trace-daemon for Legora ([INF-1268](https://linear.app/nxdev/issue/INF-1268)) — Steve (Mar 18)
- Infrastructure Change: CIBC SAML setup (Azure) ([INF-1248](https://linear.app/nxdev/issue/INF-1248)) — Steve
- Infrastructure Change: Docker image registry for ST (Azure) ([INF-1018](https://linear.app/nxdev/issue/INF-1018)) — Patrick
- Infrastructure Change: changelog.nx.app subdomain ([INF-1227](https://linear.app/nxdev/issue/INF-1227)) — Steve
- Infrastructure Change: MT route nx-cloud/private to backend-not-found ([INF-1255](https://linear.app/nxdev/issue/INF-1255)) — Patrick
- Infrastructure Change: ST route nx-cloud/private to backend-not-found ([INF-1254](https://linear.app/nxdev/issue/INF-1254)) — Steve
- Infrastructure Change: staging posthog env vars ([INF-1229](https://linear.app/nxdev/issue/INF-1229)) — Steve
- Remove extra Posthog proxy endpoints ([INF-1230](https://linear.app/nxdev/issue/INF-1230)) — Steve
- Infrastructure Change: Jack to db prod readers ([INF-1226](https://linear.app/nxdev/issue/INF-1226)) — Steve
- Create doc outlining failover/multi-region/costs ([INF-1223](https://linear.app/nxdev/issue/INF-1223)) — Steve
- Add SAML env vars for enterprise/legora (`d2e375e4`) — Szymon
- Add missing env vars for agents/anaplan (`34b69fdd`) — Szymon
- Add GH vars for caseware (`575f80b5`) — Steve
- Add SAML secrets for caseware (`afb7430c`) — Steve
- Add caseware to lighthouse rotation (`e82ad47d`) — Patrick
- Add missing API env vars for legora (`8bf21263`) — Szymon
- Add missing env vars for legora (`f62fc54e`) — Szymon
- Update nginx config for npm cache (`2f25980f`) — Steve
- Wire up new io-tracing appset for GCP tenants (`1d017287`) — Steve (Mar 18)
- Add new foundation for io-trace in gcp tenants/legora (`ffdd2c23`) — Steve (Mar 18)
- Ensure non-large enterprise tenants update io-trace with action (`bf2fd940`) — Steve (Mar 18)
- Add missing project to appset for legora (`f47e1472`) — Steve (Mar 18)
- Add SA and IAM for Claude MCP on nx-data (`25e5dcfa`) — Steve (Mar 17)
- Ensure group has MCP use IAM on nx-data (`92addf75`) — Steve (Mar 17)
- Remove IAM, not needed, add oauth for nx-data (`ba428211`) — Steve (Mar 17)
- Flipt: add backendnotfound config (`45fe0621`) — Steve (Mar 19)
- Flipt: turn off debug/profiling (`86266941`) — Steve (Mar 19)
- Flipt: move metrics/debug routes off public (`ab2b82b0`) — Steve (Mar 19)
- Add client_id and client_secret fields to nxcloud-metrics secret (`c9343aa1`) — Rares (Mar 19)
- Fix access_token remoteRef in nxcloud-metrics secret (`0de108c4`) — Rares (Mar 19)

### Cloud (CLOUD-)

- stop-agents-after ignored with hybrid changeset when SW affected ([CLOUD-4297](https://linear.app/nxdev/issue/CLOUD-4297)) — Miroslav
- YAML anchors fail when distribute-on and launch-templates are in same file (single-tenant) ([CLOUD-4349](https://linear.app/nxdev/issue/CLOUD-4349)) — Steven
- WaitingAgents should be backed by valkey ([Q-282](https://linear.app/nxdev/issue/Q-282)) — Altan
- Investigate possible race condition in reconciling continuous tasks ([Q-284](https://linear.app/nxdev/issue/Q-284)) — Altan
- Enterprise usage page credit limit blocks Clickup re-up ([Q-192](https://linear.app/nxdev/issue/Q-192)) — Altan
- Conformance notifications do not send on ST ([Q-274](https://linear.app/nxdev/issue/Q-274)) — Altan

### Cloud Changelog (YAML fix)

- Fixed issue where YAML anchors and aliases in distribution config files would cause a parsing error (2603.11.3)

### PostHog Migration

- Switch staging and prod NA to posthog reverse proxy (`e4567168`) — Nicole
- Add common proxy for posthog (`55a7cd18`) — Steve
- Remove staging envfrom for posthog url target (`6fcfb06a`) — Steve
- Remove extra posthog proxies (`fad70f26`) — Steve
- Add grafana space to GCP IAM for nxcloudoperations (`f9c75155`) — Szymon

---

## Performance & Reliability

### CLI

- Use jemalloc with tuned decay timers for native module ([#34444](https://github.com/nrwl/nx/pull/34444)) — 22.6.0
- Trim memory usage associated with io-tracing service ([#34866](https://github.com/nrwl/nx/pull/34866)) — 22.6.0-rc.1
- Use recursive FSEvents on macOS instead of non-recursive kqueue ([#34523](https://github.com/nrwl/nx/pull/34523)) — 22.6.0
- Replace buggy ignore-files trie with correct path-component gitignore matching ([#34447](https://github.com/nrwl/nx/pull/34447)) — 22.6.0
- Retry entire SQLite transaction on DatabaseBusy ([#34533](https://github.com/nrwl/nx/pull/34533)) — 22.6.0
- Prevent DB corruption from concurrent initialization ([#34861](https://github.com/nrwl/nx/pull/34861)) — 22.7.0-beta.1
- Skip stale recomputations and prevent lost file changes in daemon ([#34424](https://github.com/nrwl/nx/pull/34424)) — 22.6.0
- Clean up stale socket files before listening ([#34236](https://github.com/nrwl/nx/pull/34236)) — 22.6.0
- Reduce terminal output duplication and allocations in task runner ([#34427](https://github.com/nrwl/nx/pull/34427)) — 22.6.0
- Reject pending promises directly when plugin worker exits unexpectedly ([#34588](https://github.com/nrwl/nx/pull/34588)) — 22.6.0
- Avoid blocking event loop during TUI PTY resize ([#34385](https://github.com/nrwl/nx/pull/34385)) — 22.6.0
- Ensure workers shutdown after phase cancelled ([#34799](https://github.com/nrwl/nx/pull/34799)) — 22.6.0-rc.1
- Avoid overwhelming DB with connections during analytics init ([#34881](https://github.com/nrwl/nx/pull/34881)) — 22.6.0-rc.1
- Skip analytics and DB connection when global bin hands off to local ([#34914](https://github.com/nrwl/nx/pull/34914)) — 22.7.0-beta.0
- Avoid redundant project graph requests in ngcli adapter ([#34907](https://github.com/nrwl/nx/pull/34907)) — 22.7.0-beta.0
- Make runtime cache key deterministic ([#34390](https://github.com/nrwl/nx/pull/34390)) — 22.6.0
- Handle dangling symlinks during cache restore ([#34396](https://github.com/nrwl/nx/pull/34396)) — 22.6.0
- Use scoped cache key for unresolved npm imports in TargetProjectLocator ([#34605](https://github.com/nrwl/nx/pull/34605)) — 22.6.0
- Handle FORCE_COLOR=0 with picocolors ([#34520](https://github.com/nrwl/nx/pull/34520)) — 22.6.0
- Use a consistent batch id between scheduler and task runner ([#34392](https://github.com/nrwl/nx/pull/34392)) — 22.6.0
- Avoid dropping unrelated continuous deps in `makeAcyclic` ([#34389](https://github.com/nrwl/nx/pull/34389)) — 22.6.0
- Show the correct status for stopped continuous tasks ([#34226](https://github.com/nrwl/nx/pull/34226)) — 22.6.0
- Remove unused getTerminalOutput from BatchProcess ([#34604](https://github.com/nrwl/nx/pull/34604)) — 22.6.0
- Prevent staggered and duplicate lines in dynamic output ([#34462](https://github.com/nrwl/nx/pull/34462)) — 22.6.0
- Commands shouldn't hang when passing --help ([#34506](https://github.com/nrwl/nx/pull/34506)) — 22.6.0
- Make watch command work with all and initialRun specified ([#32282](https://github.com/nrwl/nx/pull/32282)) — 22.6.0
- Hitting [1] or [2] should remove pinned panes if they match the current task ([#34433](https://github.com/nrwl/nx/pull/34433)) — 22.6.0
- Remove shellapi from winapi featureset to minimize AV false positives ([#34208](https://github.com/nrwl/nx/pull/34208)) — 22.6.0
- Migrate napi-rs v2 to v3 ([#34619](https://github.com/nrwl/nx/pull/34619)) — 22.6.0-beta.9
- Add safe plugin cache write utilities with LRU eviction ([#34503](https://github.com/nrwl/nx/pull/34503)) — 22.6.0-beta.10
- Skip writing deps cache if already up-to-date ([#34582](https://github.com/nrwl/nx/pull/34582)) — 22.5.4
- Handle JSON stringify errors in plugin cache saves ([NXC-3833](https://linear.app/nxdev/issue/NXC-3833)) — Craigory
- Extreme slowness running run-many lint (graph/daemon) ([NXC-3970](https://linear.app/nxdev/issue/NXC-3970)) — Craigory
- Reduce misc allocations ([NXC-3905](https://linear.app/nxdev/issue/NXC-3905)) — Leosvel
- Resolve false positive loop detection when running with Bun ([#34640](https://github.com/nrwl/nx/pull/34640)) — 22.5.4
- Prevent TUI panic when Nx Console is connected ([#34718](https://github.com/nrwl/nx/pull/34718)) — 22.6.0-beta.10
- Fix TUI help text layout ([#34754](https://github.com/nrwl/nx/pull/34754)) — 22.6.0-beta.14
- Gate tui-logger init behind NX_TUI env var ([#34426](https://github.com/nrwl/nx/pull/34426)) — 22.6.0-beta.13
- Ensure postTasksExecution fires on SIGINT for continuous tasks ([#34623](https://github.com/nrwl/nx/pull/34623)) — 22.6.0-rc.0
- Add null guards for runningTasksService in WASM fallback ([#34825](https://github.com/nrwl/nx/pull/34825)) — 22.6.0-beta.14
- Stabilizes project references in dependsOn and inputs when later plugins rename a project ([#34332](https://github.com/nrwl/nx/pull/34332)) — 22.6.0-beta.9
- Resolve input files for targets with defaultConfiguration ([#34638](https://github.com/nrwl/nx/pull/34638)) — 22.6.0-beta.9
- Interpolate {projectRoot} and {projectName} in {workspaceRoot} input patterns in native hasher ([#34637](https://github.com/nrwl/nx/pull/34637)) — 22.6.0-beta.9
- Preserve params and options when expanding wildcard dependsOn targets ([#34822](https://github.com/nrwl/nx/pull/34822)) — 22.6.0-beta.14
- Support tuple validation when schema `items` is an array (JSON Schema draft 07) ([#34636](https://github.com/nrwl/nx/pull/34636)) — 22.6.0-beta.10
- Enable output prefixing for direct nx:run-commands path ([#34670](https://github.com/nrwl/nx/pull/34670)) — 22.6.0-beta.10
- Improve nx wrapper error message for malformed nx.json ([#34736](https://github.com/nrwl/nx/pull/34736)) — 22.6.0-beta.12
- Support canonical SSH URLs when extracting GitHub user/repo slug during `nx release` ([#31684](https://github.com/nrwl/nx/pull/31684)) — 22.5.4
- Fall back to invoking PM in detection ([#34691](https://github.com/nrwl/nx/pull/34691)) — 22.5.4
- Download light client to tmp dir when outside nx workspace ([#34805](https://github.com/nrwl/nx/pull/34805)) — 22.6.0-rc.0
- Allow nx cloud commands to run outside of a workspace ([#34728](https://github.com/nrwl/nx/pull/34728)) — 22.6.0-beta.10
- Add download-cloud-client to cloud command bypass list ([#34788](https://github.com/nrwl/nx/pull/34788)) — 22.6.0-beta.14
- Allow download-cloud-client to work outside nx workspaces ([#34746](https://github.com/nrwl/nx/pull/34746)) — 22.6.0-beta.11
- Add missing @nx/angular-rspack packages to nx packageGroup ([#34743](https://github.com/nrwl/nx/pull/34743)) — 22.6.0-beta.11
- Improve error handling in nx migrate registry fetching ([#34926](https://github.com/nrwl/nx/pull/34926)) — 22.7.0-beta.0
- Remove CRA migration logic from nx init ([#34912](https://github.com/nrwl/nx/pull/34912)) — 22.7.0-beta.0

---

## Framework & Plugin Fixes

### Angular

- **feat:** Add support for Angular v21.2 ([#34592](https://github.com/nrwl/nx/pull/34592)) — 22.6.0
- Use SASS indented syntax in nx-welcome component when style is sass ([#34510](https://github.com/nrwl/nx/pull/34510)) — 22.6.0
- Preserve skipLibCheck in tsconfig.json for standalone projects ([#34695](https://github.com/nrwl/nx/pull/34695)) — 22.6.0-beta.10
- Use relative path for postcss-cli-resources output ([#34681](https://github.com/nrwl/nx/pull/34681)) — 22.5.4
- Use pathToFileURL for cross-platform path handling in postcss-cli-resources ([#34676](https://github.com/nrwl/nx/pull/34676)) — 22.5.4
- Exclude .json files from JS/TS regex patterns in angular-rspack ([#34195](https://github.com/nrwl/nx/pull/34195)) — 22.6.0
- Handle zoneless Angular apps in vitest configuration generator ([#34700](https://github.com/nrwl/nx/pull/34700)) — 22.6.0-beta.10

### ESLint

- **feat:** Support eslint v10 ([#34534](https://github.com/nrwl/nx/pull/34534)) — 22.6.0
- **feat:** Allow for wildcards paths in enforce-module-boundaries rule ([#34066](https://github.com/nrwl/nx/pull/34066)) — 22.6.0
- Add catalog: references when fixing missing dependencies ([#34734](https://github.com/nrwl/nx/pull/34734)) — 22.6.0-beta.11
- Detect require() calls in enforce-module-boundaries rule ([#34896](https://github.com/nrwl/nx/pull/34896)) — 22.7.0-beta.0
- Use native nx.configs in convert-to-flat-config for Nx plugins ([#34897](https://github.com/nrwl/nx/pull/34897)) — 22.7.0-beta.0
- Convert project-level eslint configs and log when skipped ([#34899](https://github.com/nrwl/nx/pull/34899)) — 22.7.0-beta.0
- Use root config to determine ESLint class in plugin ([#34900](https://github.com/nrwl/nx/pull/34900)) — 22.7.0-beta.0

### Vitest / Vite

- ⚠️ Resolve reportsDirectory against workspace root (BREAKING) ([#34720](https://github.com/nrwl/nx/pull/34720)) — 22.6.0-beta.11
- Respect reporters from target options in vitest executor ([#34663](https://github.com/nrwl/nx/pull/34663)) — 22.5.4
- Pin vitest v4 to ~4.0.x to fix Yarn Classic resolution failure ([#34878](https://github.com/nrwl/nx/pull/34878)) — 22.6.0-rc.1
- Skip root-relative paths in nxViteTsPaths resolveId ([#34694](https://github.com/nrwl/nx/pull/34694)) — 22.6.0-beta.10
- isPreview=true for Vite Preview server ([#34597](https://github.com/nrwl/nx/pull/34597)) — 22.6.0

### Webpack / Bundling

- Cap less version to <4.6.0 to avoid ESM incompatibility ([#34781](https://github.com/nrwl/nx/pull/34781)) — 22.6.0-beta.12
- Bump fork-ts-checker-webpack-plugin to 9.1.0 ([#34826](https://github.com/nrwl/nx/pull/34826)) — 22.6.0-beta.14
- Ensure safe `process.env` fallback replacement ([#34464](https://github.com/nrwl/nx/pull/34464)) — 22.6.0
- Fix regression on process.env usage for webpack ([#34583](https://github.com/nrwl/nx/pull/34583)) — 22.6.0
- Skip unnecessary type-check in TS Solution Setup when skipTypeCheck is true ([#34493](https://github.com/nrwl/nx/pull/34493)) — 22.6.0
- Add docs link to generatePackageJson error message ([#34562](https://github.com/nrwl/nx/pull/34562)) — 22.6.0

### Module Federation

- Use sslKey instead of sslCert for pathToKey ([#34824](https://github.com/nrwl/nx/pull/34824)) — 22.6.0-beta.14

### Next.js

- Reset daemon client after project graph creation in withNx ([#34518](https://github.com/nrwl/nx/pull/34518)) — 22.6.0

### Nuxt

- Bump nuxt to 3.21.1 to resolve critical audit vulnerability ([#34783](https://github.com/nrwl/nx/pull/34783)) — 22.6.0-beta.13
- Fix E2E test environment and lint issues ([#34808](https://github.com/nrwl/nx/pull/34808)) — 22.6.0-beta.13

### JS/TS

- **feat:** Add deps-sync generator ([#34407](https://github.com/nrwl/nx/pull/34407)) — 22.6.0-rc.1
- Support configurable typecheck config name ([#34675](https://github.com/nrwl/nx/pull/34675)) — 22.6.0-beta.10
- Strip catalogs from pruned pnpm lockfile ([#34697](https://github.com/nrwl/nx/pull/34697)) — 22.6.0-beta.10
- Normalize paths to posix format in typescript plugin ([#34702](https://github.com/nrwl/nx/pull/34702)) — 22.6.0-beta.10
- Support bun-only environments in release-publish executor ([#34835](https://github.com/nrwl/nx/pull/34835)) — 22.6.0-beta.14
- Skip npm dist-tag add when no new version was resolved ([#34843](https://github.com/nrwl/nx/pull/34843)) — 22.6.0-beta.14
- Use per-invocation cache in TS plugin to fix NX_ISOLATE_PLUGINS=false ([#34566](https://github.com/nrwl/nx/pull/34566)) — 22.6.0
- Guard against undefined closest node in rehoistNodes ([#34347](https://github.com/nrwl/nx/pull/34347)) — 22.6.0
- Remove redundant vite.config.ts generation for vitest projects ([#34603](https://github.com/nrwl/nx/pull/34603)) — 22.6.0
- Normalize cwd path separator in typescript plugin targets ([#34911](https://github.com/nrwl/nx/pull/34911)) — 22.7.0-beta.0
- Preserve tsconfig fields in typescript plugin cache ([#34908](https://github.com/nrwl/nx/pull/34908)) — 22.7.0-beta.0

### Nx Release

- **feat:** Add `--otp` to top-level nx release command and detect EOTP errors ([#34473](https://github.com/nrwl/nx/pull/34473)) — 22.6.0
- Skip indirect patch bump for commit types with semverBump "none" ([#34841](https://github.com/nrwl/nx/pull/34841)) — 22.6.0-beta.14
- Include dependent projects in release commit message when using --projects filter ([#34845](https://github.com/nrwl/nx/pull/34845)) — 22.6.0-beta.14
- Deduplicate projects in changelog when using filtered project list ([#34851](https://github.com/nrwl/nx/pull/34851)) — 22.6.0-beta.14
- Remove unnecessary number from release return type ([#34481](https://github.com/nrwl/nx/pull/34481)) — 22.6.0
- Allow null values in schema of dockerVersion ([#34171](https://github.com/nrwl/nx/pull/34171)) — 22.6.0
- Add null-safe fallback for version in createGitTagValues ([#34598](https://github.com/nrwl/nx/pull/34598)) — 22.6.0

### Testing

- **feat:** Add cacheDir option to playwright executor ([#34413](https://github.com/nrwl/nx/pull/34413)) — 22.6.0
- Use surgical text replacement in Jest matcher alias migration ([#34350](https://github.com/nrwl/nx/pull/34350)) — 22.6.0
- Handle undefined options in playwright preset ([#34750](https://github.com/nrwl/nx/pull/34750)) — 22.7.0-beta.0

---

## Docs & nx.dev

- Document Docker Layer Caching ([DOC-344](https://linear.app/nxdev/issue/DOC-344)) — Caleb
- Update docs to use the latest image tag ([DOC-441](https://linear.app/nxdev/issue/DOC-441)) — Caleb
- Clarify supported Storybook versions in Nx docs ([DOC-422](https://linear.app/nxdev/issue/DOC-422))
- nx.dev pages 404 on hard reload ([DOC-444](https://linear.app/nxdev/issue/DOC-444)) — Benjamin
- Fix redirect for /concepts/decisions/dependency-management ([DOC-439](https://linear.app/nxdev/issue/DOC-439)) — Caleb
- Fix broken OSS cloud pricing redirect ([DOC-442](https://linear.app/nxdev/issue/DOC-442)) — Caleb
- Writing style "linting" guidelines ([DOC-393](https://linear.app/nxdev/issue/DOC-393)) — Jack
- Blog search missing Enterprise Task Analytics article ([DOC-430](https://linear.app/nxdev/issue/DOC-430)) — Jack
- Clean up outdated version references in docs (< Nx 20) ([DOC-437](https://linear.app/nxdev/issue/DOC-437)) — Jack
- Docs images broken after rewrite changes ([DOC-436](https://linear.app/nxdev/issue/DOC-436)) — Jack
- `/docs` redirect returns 404 after cleanup changes ([DOC-435](https://linear.app/nxdev/issue/DOC-435)) — Jack
- Additional discovery mechanisms ([DOC-390](https://linear.app/nxdev/issue/DOC-390)) — Jack
- Clean-up for pages in Framer instead of Next.js ([DOC-431](https://linear.app/nxdev/issue/DOC-431)) — Jack
- Review all CLI and Cloud links ([DOC-428](https://linear.app/nxdev/issue/DOC-428)) — Jack
- Add Cmd+K redirect from nx.dev to /docs ([DOC-432](https://linear.app/nxdev/issue/DOC-432)) — Benjamin
- Adding missing legacy route redirects ([#34772](https://github.com/nrwl/nx/pull/34772)) — 22.6.0-beta.13
- Add YouTube channel callout to courses page ([#34669](https://github.com/nrwl/nx/pull/34669)) — 22.6.0-beta.10
- Boost CLI command reference search ranking ([#34625](https://github.com/nrwl/nx/pull/34625)) — 22.5.4
- Fix broken nx.dev redirects and remove legacy redirect-rules files ([#34673](https://github.com/nrwl/nx/pull/34673)) — 22.5.4
- Exclude .netlify paths from Framer proxy edge function ([#34703](https://github.com/nrwl/nx/pull/34703)) — 22.6.0-beta.10
- Remove nx-cloud paths from Framer excluded URL rewrites ([#34852](https://github.com/nrwl/nx/pull/34852)) — 22.6.0-beta.14
- Add frame protection headers to nx.dev Netlify configs ([DOC-449](https://linear.app/nxdev/issue/DOC-449)) — Caleb (Mar 18)
- Investigate why internal link checker isn't running in PRs ([DOC-424](https://linear.app/nxdev/issue/DOC-424)) — Caleb (Mar 17)
- Clarify what "batch mode" means in docs ([DOC-420](https://linear.app/nxdev/issue/DOC-420)) — Caleb (Mar 17)
- Documentation for telemetry ([DOC-446](https://linear.app/nxdev/issue/DOC-446)) — Jack (Mar 17)
- Track nx-dev server page views for AI traffic ([DOC-445](https://linear.app/nxdev/issue/DOC-445)) — Jack (Mar 17)
- Resolve changelog page 500 error ([#34920](https://github.com/nrwl/nx/pull/34920)) — 22.7.0-beta.0

### Cloud UI Misc

- Nx Graph grouped mode expand shows empty folder view ([CLOUD-4348](https://linear.app/nxdev/issue/CLOUD-4348)) — Chau
- Nx graph: grouped/flat toggle breaks All button ([CLOUD-4346](https://linear.app/nxdev/issue/CLOUD-4346)) — Chau
- Xterm search state not reset when terminal closed and reopened ([CLOUD-2754](https://linear.app/nxdev/issue/CLOUD-2754)) — Nicole
- Make the CIPE filter wider ([CLOUD-4347](https://linear.app/nxdev/issue/CLOUD-4347)) — Nicole
- Add provided logos to website footer in Framer ([CLOUD-4334](https://linear.app/nxdev/issue/CLOUD-4334)) — Benjamin
- Log UI search state reset fix (Cloud 2603.07.2)
- CIPE list branch filter stretches for long branch names (Cloud 2603.06.7)
- Added link to Nx Cloud changelog in app footer (Cloud 2603.20.1)
- Add a way to switch between conformance reports on CIPE conformance page ([NXA-1148](https://linear.app/nxdev/issue/NXA-1148)) — Mark
- Conformance step intermittently shows "Step not found" ([NXA-1153](https://linear.app/nxdev/issue/NXA-1153)) — Mark
- Staging invite acceptance shows error page ([NXA-1120](https://linear.app/nxdev/issue/NXA-1120)) — Mark
- Create Dependency does not update graph for some repos ([NXA-1141](https://linear.app/nxdev/issue/NXA-1141)) — Chau
- Update prod Github App to include Action permission ([NXA-1138](https://linear.app/nxdev/issue/NXA-1138)) — Mark
- Fix condensed looking UI ([NXA-885](https://linear.app/nxdev/issue/NXA-885)) — Mark
- Icon click redirects to create-nx-workspace for empty workspace ([NXA-989](https://linear.app/nxdev/issue/NXA-989)) — Mark
- Fix settings access when VCS and Cloud roles conflict ([NXA-1055](https://linear.app/nxdev/issue/NXA-1055)) — Mark
- Investigate org created with 0 admins in membership list ([NXA-1054](https://linear.app/nxdev/issue/NXA-1054)) — Mark
- Nrwl admins can't edit workspace settings ([NXA-1030](https://linear.app/nxdev/issue/NXA-1030)) — Mark

---

## .NET (Dotnet)

- Vattenfall is using @nx/dotnet — tracked ([NXC-2753](https://linear.app/nxdev/issue/NXC-2753)) — Miroslav
- Entain is using @nx/dotnet — tracked ([NXC-2913](https://linear.app/nxdev/issue/NXC-2913)) — Miroslav

---

## Linear Project Status

### Completed in March

| Project | Lead | Link |
|---------|------|------|
| Review Nx Resource Usage | Leosvel | [View](https://linear.app/nxdev/project/review-nx-resource-usage-980349c91003) |
| Grafana Billing Alerts | Szymon | [View](https://linear.app/nxdev/project/grafana-billing-alerts-6ee61ad4508e) |
| Bring identity portal into OpenTofu | Szymon | [View](https://linear.app/nxdev/project/bring-identity-portal-into-opentofu-79467ad67a5f) |

### Active

| Project | Lead | Target | Link |
|---------|------|--------|------|
| Task Sandboxing (Input/Output Tracing) | Rares | — | [View](https://linear.app/nxdev/project/task-sandboxing-inputoutput-tracing-46fbeb490e00) |
| Surface Level Telemetry | Jason | 2026-03-18 | [View](https://linear.app/nxdev/project/surface-level-telemetry-38b92f1a9e79) |
| CLI Agentic Experience (AX) | Max | — | [View](https://linear.app/nxdev/project/cli-agentic-experience-ax-94c1a77d10a7) |
| Polygraph AI | Jonathan | — | [View](https://linear.app/nxdev/project/polygraph-ai-c5e3b1dd7bdb) |
| Implement Multi-Cluster Agent Setups | Steve | 2026-04-08 | [View](https://linear.app/nxdev/project/implement-multi-cluster-agent-setups-00f6853704b8) |
| K8S Gateway API + L7 Load Balancing | Patrick | 2026-03-20 | [View](https://linear.app/nxdev/project/k8s-gateway-api-l7-load-balancing-a819b1a46505) |
| Allow new users to immediately opt into Team plan | Benjamin | 2026-03-06 | [View](https://linear.app/nxdev/project/allow-new-users-to-immediately-opt-into-team-plan-035aa1b88e22) |
| Feature Demos | Nicole | 2026-03-31 | [View](https://linear.app/nxdev/project/feature-demos-bb1c8f1a4fc5) |
| Improve Nx Import for all plugins | — | — | [View](https://linear.app/nxdev/project/improve-nx-import-for-all-plugins-8dee51cf2d12) |
| Gradle Plugin for Nx | — | — | [View](https://linear.app/nxdev/project/gradle-plugin-for-nx-af2b0bf7e7c8) |
| Maven Support | Jason | — | [View](https://linear.app/nxdev/project/maven-support-1a2b3c4d5e6f) |
| GCP GKE Docker Image Pre-Loading | — | — | [View](https://linear.app/nxdev/project/gcp-gke-docker-image-pre-loading-c9dbd507ace9) |

### Enterprise PoVs

| Customer | Lead | Status | Target | Link |
|----------|------|--------|--------|------|
| Anaplan | Austin | On Track | — | [View](https://linear.app/nxdev/project/nx-enterprise-pov-for-anaplan-4a15195a9fc9) |
| CIBC | Austin | On Track | — | [View](https://linear.app/nxdev/project/nx-enterprise-pov-for-cibc-bf0a5b0cae65) |
| MNP.ca | Austin | On Track | Mar 10 | [View](https://linear.app/nxdev/project/nx-enterprise-pov-for-mnpca-7a6f85051456) |
| Rocket Mortgage | Austin | At Risk | Apr 30 | [View](https://linear.app/nxdev/project/nx-enterprise-pov-for-rocket-mortgage-fed32a603fcc) |
| Cisco | Austin | At Risk | Apr 30 | [View](https://linear.app/nxdev/project/nx-enterprise-pov-for-cisco-543915f3c64f) |
| McGraw Hill | Austin | On Track | Mar 26 | [View](https://linear.app/nxdev/project/nx-enterprise-pov-for-mcgraw-hill-8d0f5fffd6c2) |

### Issues Completed: ~230+ across 6 teams

NXC ~65 · CLOUD ~17 · INF ~37 · NXA ~57 · Q ~30 · DOC ~22

### Late Additions (Mar 17-20)

#### NXC

- Fix tsconfig parsing cache invalidation issue ([NXC-4106](https://linear.app/nxdev/issue/NXC-4106)) — Leosvel (Mar 18)
- Normalize `cwd` path in `nx show target` output ([NXC-4105](https://linear.app/nxdev/issue/NXC-4105)) — Leosvel (Mar 18)
- Reduce common errors in CLI onboarding ([NXC-4095](https://linear.app/nxdev/issue/NXC-4095)) — Jack (Mar 18)
- Automatically set cache: false for continuous tasks ([NXC-2944](https://linear.app/nxdev/issue/NXC-2944)) — Craigory (Mar 18)
- Bring back cloud prompts and templates ([NXC-4096](https://linear.app/nxdev/issue/NXC-4096)) — Jack (Mar 17)
- Fix plugin workers hanging due to graph recomputation ([NXC-4049](https://linear.app/nxdev/issue/NXC-4049)) — Craigory (Mar 17)
- Investigate worker connection timeout ([NXC-4093](https://linear.app/nxdev/issue/NXC-4093)) — Craigory (Mar 17)

#### INF

- Enable io-trace-daemon for Legora ([INF-1268](https://linear.app/nxdev/issue/INF-1268)) — Steve (Mar 18)
- Use new secrets in staging ([INF-1266](https://linear.app/nxdev/issue/INF-1266)) — Szymon (Mar 18)
- Define config path for downstreams that facade needs for checks ([INF-1239](https://linear.app/nxdev/issue/INF-1239)) — Steve (Mar 18)
- Split staging secrets ([INF-1262](https://linear.app/nxdev/issue/INF-1262)) — Szymon (Mar 18)
- Look into Claude BigQuery connector ([INF-1257](https://linear.app/nxdev/issue/INF-1257)) — Steve (Mar 17)

#### DOC

- Add frame protection headers to nx.dev Netlify configs ([DOC-449](https://linear.app/nxdev/issue/DOC-449)) — Caleb (Mar 18)
- Investigate why internal link checker isn't running in PRs ([DOC-424](https://linear.app/nxdev/issue/DOC-424)) — Caleb (Mar 17)
- Clarify what "batch mode" means in docs ([DOC-420](https://linear.app/nxdev/issue/DOC-420)) — Caleb (Mar 17)
- Documentation for telemetry ([DOC-446](https://linear.app/nxdev/issue/DOC-446)) — Jack (Mar 17)
- Track nx-dev server page views for AI traffic ([DOC-445](https://linear.app/nxdev/issue/DOC-445)) — Jack (Mar 17)

#### Q (Quokka)

- Port Remix PostHog models + functions to Kotlin shared lib ([Q-309](https://linear.app/nxdev/issue/Q-309)) — Altan (Mar 18)
- Track workspace claims and set up job for first 6 weeks ([Q-308](https://linear.app/nxdev/issue/Q-308)) — Altan (Mar 18)
- Investigate inconsistent task violation reports ([Q-296](https://linear.app/nxdev/issue/Q-296)) — Rares (Mar 17)
- Reduce number of logs from daemon ([Q-234](https://linear.app/nxdev/issue/Q-234)) — Rares (Mar 17)
- Make PostHog available in gradle projects ([Q-291](https://linear.app/nxdev/issue/Q-291)) — Altan (Mar 17)
- Surface compute and AI credit counts to daily org + workspace audit ([Q-292](https://linear.app/nxdev/issue/Q-292)) — Altan (Mar 17)

### CLI Releases

| Tag | Date | Type |
|-----|------|------|
| 22.5.4 | Mar 4 | Stable (backport) |
| 22.6.0-beta.8 through beta.14 | Mar 3–16 | Pre-release |
| 22.6.0-rc.0 | Mar 16 | Release candidate |
| 22.6.0-rc.1 | Mar 17 | Release candidate |
| 22.6.0-rc.2 | Mar 17 | Release candidate |
| **22.6.0** | **Mar 18** | **Stable** |
| 22.7.0-beta.0 | Mar 19 | Pre-release |
| 22.7.0-beta.1 | Mar 19 | Pre-release |

### Cloud Releases

| Version | Date | Type |
|---------|------|------|
| 2603.04.2 | Mar 4 | Feature |
| 2603.04.3 | Mar 4 | Feature |
| 2603.06.7 | Mar 6 | Fix |
| 2603.07.1 | Mar 7 | Fix |
| 2603.07.2 | Mar 7 | Fix |
| 2603.10.1 | Mar 10 | Fix |
| 2603.10.5 | Mar 10 | Fix |
| 2603.10.13 | Mar 10 | Feature |
| 2603.11.1 | Mar 11 | Feature |
| 2603.11.3 | Mar 11 | Fix |
| 2603.12.1 | Mar 12 | Feature |
| 2603.20.1 | Mar 20 | Feature |
| 2603.20.2 | Mar 20 | Fix |

---

_Generated on 2026-03-20. Updated from 2026-03-18 version with 22.7.0 betas, Cloud 2603.20.x, infrastructure commits through March 20, and late Linear additions._
