# Nx Platform Changelog — April 2026

> **Sources:** Nx CLI GitHub releases, Nx Cloud public changelog, `nrwl/cloud-infrastructure` commits, Linear (Nx CLI, Nx Cloud, Infrastructure, RedPanda, Quokka, Docs), Pylon support tickets.
> **Window:** 2026-04-01 through 2026-04-24.

## Releases Shipped

| Channel | Version | Date |
|---|---|---|
| CLI stable | [22.6.4](https://github.com/nrwl/nx/releases/tag/22.6.4) | 2026-04-01 |
| CLI stable | [22.6.5](https://github.com/nrwl/nx/releases/tag/22.6.5) | 2026-04-10 |
| CLI stable | [21.6.11](https://github.com/nrwl/nx/releases/tag/21.6.11) | 2026-04-17 |
| CLI pre-release | 22.7.0-beta.10 through 22.7.0-rc.1 | Apr 2 → Apr 23 |
| Cloud | 2604.01.1 | 2026-04-01 |
| Cloud | 2604.11.1 | 2026-04-11 |
| Cloud | 2604.17.1 | 2026-04-17 |
| Cloud | 2604.17.2 | 2026-04-17 |
| Cloud | 2604.23.1 | 2026-04-23 |
| Cloud | 2604.23.3 | 2026-04-23 |

---

## Task Sandboxing & Hermetic Builds

### CLI

**Sandbox detection and reporting (22.7 betas)**
- Sandbox exclusions, multi-line typeof import detection, global ensurePackage mock ([#35056](https://github.com/nrwl/nx/pull/35056)) — 22.6.4
- Add missing inputs and sandbox exclusions for native tasks ([#35212](https://github.com/nrwl/nx/pull/35212)) — 22.7.0-beta.12
- Exclude populate-local-registry-storage from sandbox I/O checks ([#35239](https://github.com/nrwl/nx/pull/35239)) — 22.7.0-beta.12
- Resolve sandbox violations in e2e-gradle tests ([#35349](https://github.com/nrwl/nx/pull/35349), [#35315](https://github.com/nrwl/nx/issues/35315)) — 22.7.0-beta.16

**Input/output precision (sandboxing prerequisites)**
- Narrow tsc build-base outputs to only tsc-produced file types ([#35041](https://github.com/nrwl/nx/pull/35041))
- Include `tsbuildinfo` in narrowed tsc build-base outputs ([#35086](https://github.com/nrwl/nx/pull/35086))
- Add prettier config inputs to astro-docs format target ([#35222](https://github.com/nrwl/nx/pull/35222))
- Add run-native-target script input to dotnet build-analyzer ([#35221](https://github.com/nrwl/nx/pull/35221))
- Preserve sibling dependency inputs in native hashing ([#35071](https://github.com/nrwl/nx/pull/35071))
- Linter: infer extended tsconfig files as task inputs ([#35190](https://github.com/nrwl/nx/pull/35190))
- Linter: add missing inputs to eslint executor target defaults ([#35236](https://github.com/nrwl/nx/pull/35236))
- Linter: remove custom eslint hasher (d64aeef5df)
- Testing: declare external tsconfig files as playwright e2e task inputs ([#35287](https://github.com/nrwl/nx/pull/35287))
- Testing: include config file path in plugin hash calculation ([#35346](https://github.com/nrwl/nx/pull/35346))
- Testing: dependent `.d.ts` inputs for ts-jest without isolatedModules ([#35231](https://github.com/nrwl/nx/pull/35231))
- Vitest: dependent task output files as inputs ([#35242](https://github.com/nrwl/nx/pull/35242))
- Vitest: ancestor tsconfig files inferred as test task inputs ([#35241](https://github.com/nrwl/nx/pull/35241))
- Overwrite inferred script target when nx prop defines executor or command ([#35227](https://github.com/nrwl/nx/pull/35227))
- JS: resolve project tsconfig for inferred tsc run-commands targets in dependency-checks ([#35291](https://github.com/nrwl/nx/pull/35291))
- JS: declare `.d.cts`/`.d.mts` as typecheck inputs and outputs ([#35357](https://github.com/nrwl/nx/pull/35357))
- Core: add JSON input type for selective JSON field hashing ([#35248](https://github.com/nrwl/nx/pull/35248))
- Core: recognize JSON inputs in TS task hasher fallback ([#35334](https://github.com/nrwl/nx/pull/35334))
- Core: ensure build tasks use `copyReadme` named input ([#35217](https://github.com/nrwl/nx/pull/35217))

**`nx show target` improvements**
- `nx show target` output improvements: add source map annotations ([#35225](https://github.com/nrwl/nx/pull/35225))

### Linear (Nx CLI / Quokka)

- [Task Sandboxing (Input/Output Tracing)](https://linear.app/nxdev/project/task-sandboxing-inputoutput-tracing-46fbeb490e00) project — Lead: Jason. Target 2026-04-24 (today).
- [NXC-3923](https://linear.app/nxdev/issue/NXC-3923) package.json plugin nodes fail to merge with command shorthand (Craigory) — 2026-04-09
- [NXC-4219](https://linear.app/nxdev/issue/NXC-4219) dotnet:build-analyzer misses run-native-target script input (Craigory) — 2026-04-09
- [NXC-4068](https://linear.app/nxdev/issue/NXC-4068) Inputs are duplicated for populate-local-registry-storage (Craigory) — 2026-04-09
- [NXC-4200](https://linear.app/nxdev/issue/NXC-4200) Handle custom hashers in `nx show target` output (Craigory) — 2026-04-09
- [NXC-4077](https://linear.app/nxdev/issue/NXC-4077) Hide implicit `default` configuration in `show` output (Craigory) — 2026-04-09
- [NXC-4196](https://linear.app/nxdev/issue/NXC-4196) Update eslint plugin to include chain of tsconfig files as inputs (Leosvel) — 2026-04-09
- [NXC-4192](https://linear.app/nxdev/issue/NXC-4192) Jest reports reads on `.d.ts` files in Nx dist during e2e (Leosvel) — 2026-04-09
- [NXC-4201](https://linear.app/nxdev/issue/NXC-4201) Investigate removing eslint custom hasher (Leosvel) — 2026-04-09
- [NXC-4222](https://linear.app/nxdev/issue/NXC-4222) Nx repo rspack example builds need dependent task outputs (Craigory) — 2026-04-09
- [NXC-4216](https://linear.app/nxdev/issue/NXC-4216) Angular test tasks miss `.template` file inputs (Craigory) — 2026-04-09
- [NXC-4214](https://linear.app/nxdev/issue/NXC-4214) Build tasks miss inputs for readme-fragments + `.prettierignore` (Craigory) — 2026-04-08
- [NXC-4202](https://linear.app/nxdev/issue/NXC-4202) Decide whether custom hashers should return `inputs` (Jason) — 2026-04-08
- [NXC-4193](https://linear.app/nxdev/issue/NXC-4193) Look at lint-native targets with violations (Jason) — 2026-04-08
- [NXC-4187](https://linear.app/nxdev/issue/NXC-4187) Turn off violated filter for clean sandbox reports (Louie) — 2026-04-07
- [NXC-4173](https://linear.app/nxdev/issue/NXC-4173) Investigate tsc targets on the nx repo (Leosvel) — 2026-04-03
- [NXC-4122](https://linear.app/nxdev/issue/NXC-4122) Investigate nx-examples e2e tasks sandbox violations (Craigory) — 2026-04-02
- [NXC-4186](https://linear.app/nxdev/issue/NXC-4186) Fix `nx-dev-e2e:lint` violations (Leosvel) — 2026-04-01
- [NXC-4184](https://linear.app/nxdev/issue/NXC-4184) Fix `lint-pnpm-lock` violations (Leosvel) — 2026-04-01
- [NXC-4183](https://linear.app/nxdev/issue/NXC-4183) Ignore build artifacts from ESLint tasks (Leosvel) — 2026-04-01

### Cloud (Sandbox UI)

**Nx Cloud UI improvements**
- [Q-352](https://linear.app/nxdev/issue/Q-352) Unexpected file filter does not show sandbox writes (Rares) — 2026-04-22
- [Q-336](https://linear.app/nxdev/issue/Q-336) Task reading its own outputs is flagged (Craigory) — 2026-04-21
- [Q-340](https://linear.app/nxdev/issue/Q-340) Allow filtering unexpected files by read or write (Louie) — 2026-04-09
- [Q-335](https://linear.app/nxdev/issue/Q-335) Handle tasks with custom hashers as opaque inputs (Louie) — 2026-04-09
- [Q-339](https://linear.app/nxdev/issue/Q-339) Filters persist when navigating between sandboxing reports (Louie) — 2026-04-08
- [Q-334](https://linear.app/nxdev/issue/Q-334) Layout shifting for previous executions (Louie) — 2026-04-07
- [Q-264](https://linear.app/nxdev/issue/Q-264) Clean up duplicated TaskIOService types (Craigory) — 2026-04-09 [Production Hardening milestone]

### Infrastructure

- `chore(enterprise, island): Deploy iotrace to island` (pmariglia) — 2026-04-20
- `chore(enterprise, clickup): temp remove io-trace for clickup` (Caleb Ukle) — 2026-04-21 (stability tuning rollback)
- `chore(repo): Fix enterprise large deployments io-tracing` (pmariglia) — 2026-04-10
- [INF-1332](https://linear.app/nxdev/issue/INF-1332) Request for Change to Environment For Island — enable Sandboxing feature (Patrick) — 2026-04-20
- [INF-1331](https://linear.app/nxdev/issue/INF-1331) Enable sandboxing on Island's GCP instance (linked from Legora Pylon #718)

### Docs

- [DOC-456](https://linear.app/nxdev/issue/DOC-456) Add docs page on how to configure `allowUnixSockets` setting (Caleb) — 2026-04-10. Project: CLI Agentic Experience (AX). Claude Code sandbox blocks Unix sockets by default; Nx uses dynamic socket paths (daemon, forked process, plugin isolation).

### Pylon (customer-escalated)

- **Legora** — [Pylon #718](https://app.usepylon.com/issues?issueNumber=718) "Sandboxing feature exploration request" (Omer Biran) — Feature request. Linked to [INF-1331](https://linear.app/nxdev/issue/INF-1331).
- **ClickUp** — [#754](https://app.usepylon.com/issues?issueNumber=754) "Sandbox Violations Count on Main" (2026-04-22). [#702](https://app.usepylon.com/issues?issueNumber=702) "DTE build and unit test failures in CI with sandbox violations" (2026-04-16).
- **Island** — Sandboxing enabled on GCP via INF-1332.

---

## Self-Healing CI & AI-Powered Development

### Cloud

- **2604.17.1** — Self-Healing CI: fix-ci git fetch timeout fix for large repos (>2-minute fetches no longer cause fix-ci to give up).
- **2604.01.1** — `CLAUDECODE=1` no longer exits early in onboarding.
- **Blog**: [Self-Healing CI Now Suggests What to Auto-Apply](https://nx.dev/blog/self-healing-ci-auto-apply-suggestions) — Juri, 2026-04-22.

### CLI

- `configure-ai-agents`: clean up legacy `.gemini/skills` ([#35117](https://github.com/nrwl/nx/pull/35117)) — 22.6.5
- Daemon: add logging and progress message types ([#35342](https://github.com/nrwl/nx/pull/35342)) — 22.7.0-beta.17

### Docs

- [DOC-451](https://linear.app/nxdev/issue/DOC-451) Document `nx-cloud onboard` command (Dillon) — 2026-04-02
- [DOC-412](https://linear.app/nxdev/issue/DOC-412) Document new `nx connect` flow for agentic onboarding (Caleb) — 2026-04-02
- [DOC-479](https://linear.app/nxdev/issue/DOC-479) Review low-effort agent-readiness improvements for nx.dev (Jack) — 2026-04-20
- [DOC-473](https://linear.app/nxdev/issue/DOC-473) Investigate "SEO" for agents — peec.ai etc. (Caleb) — 2026-04-10

### Pylon (customer-escalated)

- **SiriusXM** — [Pylon #655](https://app.usepylon.com/issues?issueNumber=655) "MCP server plans for enterprise integration" (Kyle Cannon). Feature request for enterprise MCP access to Cloud data so they can route test failures based on run info.
- **ClickUp** — [Pylon #523](https://app.usepylon.com/issues?issueNumber=523) "Self-Healing CI feature enablement" (Sofie Thorsen) — 2026-04-01.
- **SiriusXM** — [Pylon #738](https://app.usepylon.com/issues?issueNumber=738), [#602](https://app.usepylon.com/issues?issueNumber=602) Self-Healing status threads.
- **ClickUp** — [Pylon #622](https://app.usepylon.com/issues?issueNumber=622) Access token configuration for MCP review failures.

---

## Cloud Onboarding, Connect Workspace, CNW Funnel

### Cloud

- **2604.23.1** — Upgraded connect workspace flows for GitHub and GitLab. User authenticates once with VCS, picks an Nx Cloud org, system auto-detects Nx workspaces in their repos and opens a PR with the Nx Cloud config.
- **2604.11.1** — Demo mode for non-enterprise users on task and flaky-task analytics features.
- **2604.01.1** — Add remediation steps for onboarding CLI errors.

### CLI

- `core`: use CNW variant 1 cloud prompt in `nx init` ([#35155](https://github.com/nrwl/nx/pull/35155)) — 22.6.5 / 22.7.0-beta.12
- `core`: prompt for setup mode when running `nx init` in empty git directory ([#35226](https://github.com/nrwl/nx/pull/35226)) — 22.6.5 / 22.7.0-beta.12
- `misc`: lock in CNW cloud prompt A/B winner and add new variants ([#35154](https://github.com/nrwl/nx/pull/35154)) — 22.6.5 / 22.7.0-beta.10
- `misc`: update nx init telemetry meta from CSV to JSON format ([#35076](https://github.com/nrwl/nx/pull/35076)) — 22.6.4
- `misc`: handle non-interactive mode and add template shorthand names for CNW ([#35045](https://github.com/nrwl/nx/pull/35045)) — 22.6.4
- `core`: validate bundler option for Angular presets in create-nx-workspace ([#35074](https://github.com/nrwl/nx/pull/35074)) — 22.6.4
- `core`: handle `.` and absolute paths as workspace name in CNW ([#35083](https://github.com/nrwl/nx/pull/35083)) — 22.6.4
- `misc`: allow `create-nx-workspace . --no-interactive` in empty directory ([#35281](https://github.com/nrwl/nx/pull/35281)) — 22.7.0-beta.17

### Linear

- [NXC-4189](https://linear.app/nxdev/issue/NXC-4189) Add Cloud prompt to `nx init` using CNW variant 1 copy (Jack) — 2026-04-08. Project: [CNW/Init Funnel & Cloud Conversion Optimization](https://linear.app/nxdev/project/cnwinit-funnel-and-cloud-conversion-optimization-35cd59d7b1f6).
- [NXC-4190](https://linear.app/nxdev/issue/NXC-4190) CNW: Lock in variant 1 as new baseline, design two new A/B variants (Jack) — 2026-04-02. Variant 1 (12.2% yes) vs 7.5% baseline (+63% lift).
- **Completed projects**:
  - [Template-based onboarding](https://linear.app/nxdev/project/template-based-onboarding-d4beeddcc9da) (Nicole, Apr 21)
  - [Ocean DX improvements](https://linear.app/nxdev/project/ocean-dx-improvements-2fa569261d96) (Nicole, Apr 17)
  - [Evaluate product analytics tools](https://linear.app/nxdev/project/evaluate-product-analytics-tools-774829c5e4a5) (Nicole, Apr 17)
  - [Nx Cloud changelog](https://linear.app/nxdev/project/nx-cloud-changelog-310efcfcf67a) (Nicole, Apr 17)
- **Active**:
  - [One-page "connect workspace" flow](https://linear.app/nxdev/project/one-page-connect-workspace-flow-23149e6efc77) — Nicole. Apr 21: GitLab flow fully on, >2x claim rate vs. original.
  - [CNW/Init Funnel & Cloud Conversion Optimization](https://linear.app/nxdev/project/cnwinit-funnel-and-cloud-conversion-optimization-35cd59d7b1f6) — Jack. atRisk. Target 2026-06-30.

### Infrastructure

- Valkey VCS cache rolled out:
  - `chore(prod,na,eu): enable valkey vcs cache` (Altan) — 2026-04-20
  - `chore(staging): enable valkey vcs cache` (Altan) — 2026-04-19
  - `chore(dev): enable valkey vcs cache` (Altan) — 2026-04-19

---

## CIPE Waterfall & Cloud Platform UI

### Cloud (Linear)

- [CIPE Waterfall screen](https://linear.app/nxdev/project/cipe-waterfall-screen-5215deabf94d) — Lead: Ben Cabanes. atRisk, Target 2026-04-30. Labels: Growth, Revenue.
  - **Apr 22 update**: Active dev on `feat/nx-cloud/cipe-trace`. 8 tickets shipped: decoupled data pipeline, glanceable pipeline view, critical path + dependency edges, failure visibility UX, agent+task status sidebars, data correctness fixes (canceled tasks, timed-out agents, phantom `NOT_STARTED`, stuck `IN_PROGRESS`), devtools-style time navigation, time axis + minimap. 9 open including merge blocker + 3 detail-panel parity tickets.
- [Q-323](https://linear.app/nxdev/issue/Q-323) Store cancellation source on CIPE (Altan) — 2026-04-17
- [Q-325](https://linear.app/nxdev/issue/Q-325) Replay extraction may cause workflow pod memory spike (Altan) — 2026-04-17
- [Q-344](https://linear.app/nxdev/issue/Q-344) c1 can't load logs in FE after migration to helm v1 (Rares) — 2026-04-21
- [Q-347](https://linear.app/nxdev/issue/Q-347) fix cache upload handling on PRs marking agent as failed (Rares) — 2026-04-17
- [Q-346](https://linear.app/nxdev/issue/Q-346) harden security nx-cloud-workflows repo (Rares) — 2026-04-17

### Cloud (Changelog)

- **2604.17.2** — Allow disabling of CI pipeline execution comments in pull requests (workspace setting).
- **2604.17.1** — Agents: no-output-timeout (default 10m, configurable via `NX_NO_OUTPUT_TIMEOUT`, `no-output-timeout` in launch-template, or `--no-output-timeout` CLI flag). "30m", "1h", or "0" to disable.
- **2604.23.3** — Agent metrics auto-upload for manual DT mode: `npx nx-cloud upload-agent-metrics` in workflow step, auto-retrieves run group and metrics file from env.

### Linear (related)

- [Improve manual agent metrics upload DX in Nx Cloud](https://linear.app/nxdev/project/improve-manual-agent-metrics-upload-dx-in-nx-cloud-c00eebb8c1dc) — Rares. ocean#10510 PR submitted, review addressed.
- [Nx Cloud CIPE Configuration Rework](https://linear.app/nxdev/project/nx-cloud-cipe-configuration-rework) project issues:
  - [Q-303](https://linear.app/nxdev/issue/Q-303) Brainstorm and map out configuration options (Louie)
  - [Q-304](https://linear.app/nxdev/issue/Q-304) Catalogue current config flags, args, settings on Ocean (Louie)
  - [Q-305](https://linear.app/nxdev/issue/Q-305) Create sample configuration ideas (Louie)

---

## Security & Compliance

### CLI

- **CVE-2026-25639**: bump axios to 1.13.5 ([#35148](https://github.com/nrwl/nx/pull/35148)) — 22.6.5
- axios 1.15.0 across all packages for 22.7 ([#35237](https://github.com/nrwl/nx/pull/35237)) — 22.6.5 / 22.7.0-beta.12
- pin axios ([#35093](https://github.com/nrwl/nx/pull/35093)) — 22.6.4
- webpack: bump postcss-loader to ^8.2.1 to eliminate transitive `yaml@1.x` CVE ([#35028](https://github.com/nrwl/nx/pull/35028)) — 22.6.4
- repo: bump picomatch from 4.0.2 to 4.0.4 ([#35081](https://github.com/nrwl/nx/pull/35081)) — 22.6.4
- core: update and pin ejs to 5.0.1 ([#35157](https://github.com/nrwl/nx/pull/35157)) — 22.6.5
- core: replace LGPL-licensed `@ltd/j-toml` with BSD-3-Clause `smol-toml` ([#35188](https://github.com/nrwl/nx/pull/35188)) — 22.6.5 / 22.7.0-beta.11
- core: supply chain hardening via transitive dependency pinning ([#35159](https://github.com/nrwl/nx/pull/35159)) — 22.7.0-beta.11
- core: reduce published nx package size with files allowlist ([#35109](https://github.com/nrwl/nx/pull/35109)) — 22.7.0-beta.10
- repo: enforce no-disabled-tests via ESLint with per-project warning caps ([#35122](https://github.com/nrwl/nx/pull/35122)) — 22.7.0-beta.10

### Linear

- [NXC-4197](https://linear.app/nxdev/issue/NXC-4197) Supply chain hardening: expand transitive deps to pinned direct deps at publish time (Jack) — 2026-04-07. `scripts/expand-deps.ts` flattens all transitive deps of `nx` into explicit pinned direct deps.

### Pylon (customer-escalated)

- **ClickUp** — [Pylon #524](https://app.usepylon.com/issues?issueNumber=524) "NX breach: affected versions and organizational impact" (Lars Backman, 2026-04-01). Closed same-day. Historical breach follow-up.

---

## Performance & Reliability

### CLI

- Gradle: prevent Gradle and Maven daemon accumulation during project graph recalculation ([#35143](https://github.com/nrwl/nx/pull/35143)) — 22.6.5 / 22.7.0-beta.10
- Gradle: increase project graph timeout defaults ([#35058](https://github.com/nrwl/nx/pull/35058)) — 22.6.4
- Maven: prevent batch executor hang from premature worker exit ([#35001](https://github.com/nrwl/nx/pull/35001)) — 22.6.5 / 22.7.0-beta.11
- Core: prevent phantom connections and dead polling in plugin workers ([#34823](https://github.com/nrwl/nx/pull/34823)) — 22.6.5 / 22.7.0-beta.12
- Core: misc TUI perf fixes ([#35187](https://github.com/nrwl/nx/pull/35187)) — 22.6.5 / 22.7.0-beta.11
- Core: add page up/down to TUI shortcuts ([#34525](https://github.com/nrwl/nx/pull/34525)) — 22.7.0-beta.14
- Core: cap TUI parallel slots by total task count ([#35299](https://github.com/nrwl/nx/pull/35299)) — 22.7.0-beta.13
- Core: speed up `nx --version` by avoiding heavy imports ([#35326](https://github.com/nrwl/nx/pull/35326)) — 22.7.0-beta.16
- Core: resolve native binary crash on aarch64 linux with 16K/64K page kernels ([#35356](https://github.com/nrwl/nx/pull/35356)) — 22.7.0-beta.16
- Core: optimize warm cache performance for task execution ([#35172](https://github.com/nrwl/nx/pull/35172)) — 22.7.0-beta.13
- Core: replace exec() with spawn() to prevent maxBuffer crash on large command output ([#35256](https://github.com/nrwl/nx/pull/35256)) — 22.7.0-beta.13
- Core: inline daemon status check, drop subprocess workaround ([#35273](https://github.com/nrwl/nx/pull/35273)) — 22.7.0-beta.13
- Core: don't cache project graph errors on daemon ([#35088](https://github.com/nrwl/nx/pull/35088)) — 22.7.0-beta.13
- Core: don't hang when workspace contains a named pipe ([#35289](https://github.com/nrwl/nx/pull/35289)) — 22.7.0-beta.13
- Core: await queued processTask promises before cache.getBatch ([#35322](https://github.com/nrwl/nx/pull/35322)) — 22.7.0-beta.14
- Core: support pnpm multi-document lockfiles ([#35271](https://github.com/nrwl/nx/pull/35271)) — 22.7.0-beta.14
- Core: use v8 serialization in pseudo-IPC channel ([#35332](https://github.com/nrwl/nx/pull/35332)) — 22.7.0-beta.15
- Core: normalize spawned run-commands output ([#35358](https://github.com/nrwl/nx/pull/35358)) — 22.7.0-beta.16
- Core: kill discrete tasks and use tree-kill for batch cleanup on SIGINT ([#35175](https://github.com/nrwl/nx/pull/35175)) — 22.6.5 / 22.7.0-beta.11
- Core: display actual error message when plugin loading fails ([#35138](https://github.com/nrwl/nx/pull/35138)) — 22.6.5
- Core: no-interactive should disable prompts during migrate ([#35106](https://github.com/nrwl/nx/pull/35106)) — 22.6.4
- Core: allow controlling migrate fallback installation concurrency ([#35312](https://github.com/nrwl/nx/pull/35312)) — 22.7.0-beta.14
- Core: allow generate command to skip project graph creation ([#35170](https://github.com/nrwl/nx/pull/35170)) — 22.6.5 / 22.7.0-beta.11
- Core: create process report on fatal error in `.nx/workspace-data` ([#35193](https://github.com/nrwl/nx/pull/35193)) — 22.7.0-beta.17
- Core: improve native TypeScript type definitions ([#35251](https://github.com/nrwl/nx/pull/35251)) — 22.7.0-beta.17
- Core: don't spread plugin name into set constructor ([#35385](https://github.com/nrwl/nx/pull/35385)) — 22.7.0-rc.0
- Core: add `NX_BAIL` environment variable ([#34711](https://github.com/nrwl/nx/pull/34711)) — 22.7.0-beta.13
- Core: update nx-set-shas usage to v5 ([#34934](https://github.com/nrwl/nx/pull/34934)) — 22.7.0-beta.13
- Core: support cross-file variable references in `.env` files ([#34956](https://github.com/nrwl/nx/pull/34956)) — 22.6.5 / 22.7.0-beta.12
- Core: remove polygraph cloud passthrough ([#35153](https://github.com/nrwl/nx/pull/35153)) — 22.7.0-beta.11
- Core: use workspace root for package manager detection and normalize paths in plugins ([#35116](https://github.com/nrwl/nx/pull/35116)) — 22.6.5 / 22.7.0-beta.10
- Core: disable Yarn scripts for temp nx@latest installs ([#35210](https://github.com/nrwl/nx/pull/35210)) — 22.6.5
- Core: use fresh package manager cache for e2e tests ([#35211](https://github.com/nrwl/nx/pull/35211)) — 22.6.5
- Core: copy pnpm install configuration to generated package.json ([#35016](https://github.com/nrwl/nx/pull/35016)) — 22.6.5
- JS: include npm overrides in generated lockfile ([#35192](https://github.com/nrwl/nx/pull/35192)) — 22.6.5 / 22.7.0-beta.12
- JS: stop generating baseUrl in tsconfig, use `./` prefix for path mappings ([#34965](https://github.com/nrwl/nx/pull/34965)) — 22.7.0-beta.13
- JS: avoid full source scan in readTsConfigPaths ([#35300](https://github.com/nrwl/nx/pull/35300)) — 22.7.0-beta.13
- JS: suppress false swc-node/ts-node warning on Node 22.18+ ([#35247](https://github.com/nrwl/nx/pull/35247)) — 22.7.0-beta.13
- JS: resolve ENOWORKSPACES test error in setupVerdaccio ([#34755](https://github.com/nrwl/nx/pull/34755)) — 22.6.5 / 22.7.0-beta.10
- JS: resolve build output dir from globbed outputs in node executor ([#35288](https://github.com/nrwl/nx/pull/35288)) — 22.7.0-beta.16
- JS: avoid double-prefixing node executor output paths ([#35050](https://github.com/nrwl/nx/pull/35050)) — 22.7.0-rc.1
- JS: support `nx.sync.ignoredDependencies` in typescript-sync ([#35401](https://github.com/nrwl/nx/pull/35401)) — 22.7.0-rc.1
- JS: recognize tsgo in dependency-checks lint rule ([#35048](https://github.com/nrwl/nx/pull/35048)) — 22.6.4
- JS: use explicit `nx/bin/nx` path in start-local-registry ([#35127](https://github.com/nrwl/nx/pull/35127)) — 22.6.4
- Gradle: recognize Kotlin compile tasks in inferred input extensions ([#35335](https://github.com/nrwl/nx/pull/35335)) — 22.7.0-beta.16
- Gradle: infer input extensions on project graph generation ([#35160](https://github.com/nrwl/nx/pull/35160)) — 22.7.0-beta.11
- Gradle: hoist shared task computation out of per-class loop in atomized CI target generation ([#35199](https://github.com/nrwl/nx/pull/35199)) — 22.7.0-beta.11
- Maven: make install targets noop when `maven.install.skip=true` ([#35009](https://github.com/nrwl/nx/pull/35009)) — 22.7.0-beta.11

### Cloud

- `chore(nginx-proxy): lower nginx keepalive_timeout from 65s to 10s for npm readthrough` (pmariglia) — 2026-04-10

### Linear (regressions)

- [NXC-4205](https://linear.app/nxdev/issue/NXC-4205) Plugin workers fail to start in Nx 22.6.x (Craigory) — 2026-04-09. Regression after 22.5.x → 22.6.x. Labels: Bug, Support.
- [NXC-4177](https://linear.app/nxdev/issue/NXC-4177) `nx migrate --no-interactive` still prompts for cloud (Craigory) — 2026-04-01. Caused automated repo updates to hang.
- [NXC-4210](https://linear.app/nxdev/issue/NXC-4210) `@nx/next:build` generateLockfile ignores npm overrides (Jack) — 2026-04-09.

### Pylon (customer-escalated)

- **Mimecast** — [Pylon #758](https://app.usepylon.com/issues?issueNumber=758) "Cache hit rate drop to 4%" (David Jellesma, 2026-04-22). Priority: Medium. **Still open (waiting_on_you).**
- **SiriusXM** — [#776](https://app.usepylon.com/issues?issueNumber=776) "Task run time optimization", [#774](https://app.usepylon.com/issues?issueNumber=774) "NX token error leading to flakey runs", [#733](https://app.usepylon.com/issues?issueNumber=733) "Analytics correlation for CI slowdown", [#669](https://app.usepylon.com/issues?issueNumber=669) "Intermittent Red to Green in NX pipeline", [#708](https://app.usepylon.com/issues?issueNumber=708) "Linting completes but next task stalls in parallel run", [#656](https://app.usepylon.com/issues?issueNumber=656) "Dependency fetch failures due to ECONNRESET".
- **Legora** — [#762](https://app.usepylon.com/issues?issueNumber=762) "Investigation of general flakiness inconclusive", [#681](https://app.usepylon.com/issues?issueNumber=681) "CIPE Hanging: Idle Agent For 35 Minutes", [#678](https://app.usepylon.com/issues?issueNumber=678) "Caching issue with Nx dependency", [#663](https://app.usepylon.com/issues?issueNumber=663) "Graph calculations fail in worktree".
- **ADP** — [#736](https://app.usepylon.com/issues?issueNumber=736) "Cache misses investigation: differing ProjectConfiguration values".
- **ClickUp** — [#666](https://app.usepylon.com/issues?issueNumber=666) "Flaky local build issues with Nx and tsc caching", [#680](https://app.usepylon.com/issues?issueNumber=680) "Unit test failures and typecheck issues after merge", [#722](https://app.usepylon.com/issues?issueNumber=722) "NX cache mismatch in deployment backend".

---

## Ecosystem & Framework Support

### CLI

**Vite 8**
- Bump esbuild for new projects to a version compatible with vite 8 ([#35132](https://github.com/nrwl/nx/pull/35132)) — 22.6.5 / 22.7.0-beta.10
- Update vitest and plugin-react-swc versions for vite 8 compat ([#35062](https://github.com/nrwl/nx/pull/35062)) — 22.6.4
- Bump sass version for vue/nuxt presets for Vite 8 compat ([#35073](https://github.com/nrwl/nx/pull/35073)) — 22.6.4

**React / React Router**
- `react`: force Vite 7 when using React Router in framework mode ([#35101](https://github.com/nrwl/nx/pull/35101)) — 22.6.4
- `react`: support Vite 8 for React Router apps ([#35365](https://github.com/nrwl/nx/pull/35365)) — 22.7.0-rc.0
- `react-native`: use vite's `transformWithEsbuild` instead of direct esbuild import (5771eb3346) — 22.6.4

**Angular / angular-rspack**
- `angular`: preserve specific file paths in tsconfig when adding secondary entry point ([#35254](https://github.com/nrwl/nx/pull/35254)) — 22.7.0-beta.13
- `angular`: fall back to addUndefinedDefaults when addUndefinedObjectDefaults unavailable ([#35290](https://github.com/nrwl/nx/pull/35290)) — 22.7.0-beta.13
- `angular`: add storybook and playwright as implicit dependencies ([#35224](https://github.com/nrwl/nx/pull/35224)) — 22.6.5 / 22.7.0-beta.12
- `angular-rspack`: normalize Windows path separators for i18n ([#35252](https://github.com/nrwl/nx/pull/35252)) — 22.7.0-beta.13
- `angular-rspack`: add fileReplacements to resolve.alias ([#34197](https://github.com/nrwl/nx/pull/34197)) — 22.7.0-beta.13
- `angular-rspack`: fixes issues with angular-rspack hmr ([#35294](https://github.com/nrwl/nx/pull/35294)) — 22.7.0-beta.13

**Module Federation**
- `module-federation`: bump @module-federation/enhanced to ^2.3.3 ([#35314](https://github.com/nrwl/nx/pull/35314)) — 22.7.0-beta.16

**Next.js**
- `nextjs`: add semver to required packages in update-package-json ([#35384](https://github.com/nrwl/nx/pull/35384)) — 22.7.0-rc.0
- `nextjs`: align nx-dev build inputs and update plugin defaults ([#35238](https://github.com/nrwl/nx/pull/35238)) — 22.7.0-beta.13
- `node`: split package-manager exec command for VS Code launch.json ([#35295](https://github.com/nrwl/nx/pull/35295)) — 22.7.0-beta.13

### Linear

- [Gradle Plugin for Nx](https://linear.app/nxdev/project/gradle-plugin-for-nx) — active. [NXC-4194](https://linear.app/nxdev/issue/NXC-4194) Handle SIGINT for tasks, [NXC-4124](https://linear.app/nxdev/issue/NXC-4124) graph plugin regex→AST, [NXC-4147](https://linear.app/nxdev/issue/NXC-4147) 15+ gradle daemons.
- [Q-351](https://linear.app/nxdev/issue/Q-351) compileKotlin inferred inputs not set correctly (Louie) — 2026-04-17.
- [Q-331](https://linear.app/nxdev/issue/Q-331) DependentTasksOutput files set incorrectly (Louie) — 2026-04-07. `dependentTasksOutputFiles: **/*.bin` broke caching.

### Pylon

- **SiriusXM** — [#692](https://app.usepylon.com/issues?issueNumber=692) "Vite Version Compatibility with Nx Vitest".

---

## Major Version Deprecations (v23 Prep)

- [Major Version Deprecations](https://linear.app/nxdev/project/major-version-deprecations-7f2a269d3fd6) — Lead: Jason. onTrack. Target 2026-05-08. Priority: High.
- **Apr 20 update** (project update captured from Linear):
  - **13 warn-only executor deprecations**: cypress, expo, jest, next, playwright, react-native, rollup, rspack, storybook, vite, vitest, webpack, eslint
  - **3 full-package deprecations**: @nx/detox, @nx/remix, @nx/rsbuild
  - **4 design discussions open**: @nx/esbuild, @nx/js feature parity, MF orchestration, @nx/angular
  - **Kept as-is**: gradle, maven, web:file-server, docker, module-federation, vue, workspace
  - Progress: v22 = 100%, v23 = 27%
- [NXC-3847](https://linear.app/nxdev/issue/NXC-3847) Improve handling of workspace file data and file map in serialized project graph (Leosvel) — 2026-04-08

---

## Release Process

### CLI

- Release: apply preid to dependent patch bumps ([#35381](https://github.com/nrwl/nx/pull/35381)) — 22.7.0-rc.1
- Release: surface swallowed publish errors when stdout is not valid JSON ([#35283](https://github.com/nrwl/nx/pull/35283)) — 22.7.0-beta.13

### Nx repo

- `linter`: handle various flat config override structures ([#33548](https://github.com/nrwl/nx/pull/33548)) — 21.6.11
- `linter`: handle variable references in replaceOverride ([#34026](https://github.com/nrwl/nx/pull/34026)) — 21.6.11
- `repo`: pass env vars into docker builds in publish workflow ([#35060](https://github.com/nrwl/nx/pull/35060)) — 22.6.4
- `repo`: bump picomatch 4.0.2 → 4.0.4 ([#35081](https://github.com/nrwl/nx/pull/35081)) — 22.6.4
- `repo`: fixup lock-threads failing with resource inaccessible message ([#35005](https://github.com/nrwl/nx/pull/35005)) — 22.6.4
- `repo`: re-enable Cypress HMR e2e tests after upstream tapable fix ([#35105](https://github.com/nrwl/nx/pull/35105)) — 22.6.4
- `repo`: disable ts-jest diagnostics for workspace-plugin tests (b013f93dca) — 22.6.4
- `repo`: fix lockfile (b070e23445) — 22.6.4
- `repo`: clean Angular CLI restore target before cache copy ([#35121](https://github.com/nrwl/nx/pull/35121)) — 22.6.5 / 22.7.0-beta.10
- `repo`: update issue-notifier.yml ([#35178](https://github.com/nrwl/nx/pull/35178)) — 22.6.5 / 22.7.0-beta.11
- `repo`: correct build target outputs for docker and vue packages ([#35136](https://github.com/nrwl/nx/pull/35136)) — 22.7.0-beta.10
- `repo`: narrow copy-assets outputs to prevent overlap with build-base ([#35097](https://github.com/nrwl/nx/pull/35097)) — 22.7.0-beta.10
- `repo`: resolve FreeBSD build OOM and disk exhaustion ([#35309](https://github.com/nrwl/nx/pull/35309)) — 22.7.0-beta.13
- `repo`: switch agent apt mirror to azure to avoid canonical sync races ([#35324](https://github.com/nrwl/nx/pull/35324)) — 22.7.0-beta.14
- `repo`: add e2e test for nx build process verification ([#35119](https://github.com/nrwl/nx/pull/35119)) — 22.7.0-beta.11

---

## Nx Cloud — Other Product Changes

### CLI-side integrations

- `nx-dev`: add conditional blog/changelog proxy in edge function ([#35043](https://github.com/nrwl/nx/pull/35043)) — 22.6.4
- `misc`: stream Framer proxy responses and add edge function timing ([#35215](https://github.com/nrwl/nx/pull/35215)) — 22.6.5 / 22.7.0-beta.12
- `nx-dev`: add nx-blog sitemap to root sitemap index ([#35363](https://github.com/nrwl/nx/pull/35363)) — 22.7.0-beta.17
- `nx-dev`: restore sitemap generation ([#35351](https://github.com/nrwl/nx/pull/35351)) — 22.7.0-beta.16
- `nx-dev`: improve search ranking for reference pages ([#35243](https://github.com/nrwl/nx/pull/35243)) — 22.7.0-beta.13
- `nx-dev`: SEO improvements for nx.dev/docs ([#35244](https://github.com/nrwl/nx/pull/35244)) — 22.7.0-beta.13

---

## Infrastructure (nrwl/cloud-infrastructure, human-authored commits)

### Enterprise single-tenant / PoV

**Anaplan (PoV → AWS migration)**
- `chore(enterprise, anaplan): Remove legacy GCP grafana resources for anaplan` (pmariglia, 2026-04-23)
- `chore(enterprise, anaplan): Anaplan AWS cred rotator` (pmariglia, 2026-04-23)
- `chore(enterprise, anaplan): Add wf controller to AWS anaplan deployment` (pmariglia, 2026-04-23)
- `chore(spacelift): Anaplan AWS` (pmariglia, 2026-04-23)
- `chore(enterprise, anaplan): Fix bucket & add ecr endpoints` (pmariglia, 2026-04-22)
- `chore(enterprise, aws, anaplan): Add anaplan to aws agents enabled tenants` (pmariglia, 2026-04-22)
- `chore(enterprise, anaplan, aws): Initial Anaplan AWS YAML` (pmariglia, 2026-04-22)
- `chore(enterprise, anaplan): Anaplan AppProject` (pmariglia, 2026-04-22)
- `chore(enterprise, anaplan): Anaplan YAML` (pmariglia, 2026-04-22)
- `chore(anaplan, enterprise): Add agents tf for anaplan` (pmariglia, 2026-04-22)
- `chore(enterprise, anaplan): Add anaplan to aws management TF` (pmariglia, 2026-04-22)
- `chore(enterprise, anaplan): Create Anaplan AWS Deployment` (pmariglia, 2026-04-22)
- `chore(enterprise, aws): Add Anaplan AWS` (pmariglia, 2026-04-22)
- `chore(enterprise, gcp): Allow overriding MongoDB project; Rename anaplan project` (pmariglia, 2026-04-22)
- `chore(legora,anaplan): remove digest pins for workflow controller` (Rares Matei, 2026-04-10)

**CIBC (PoV)**
- `chore(enterprise,azure,cibc): remove defunct pools` (Steve Pentland, 2026-04-22)
- `chore(enterprise,azure,cibc): re-jig node pools` (Steve Pentland, 2026-04-22)
- `chore(enterprise, cibc): Update docker image argument` (pmariglia, 2026-04-21)
- `fix(enterprise,azure,cibc): bump FE health check` (Steve Pentland, 2026-04-05)
- [INF-1335](https://linear.app/nxdev/issue/INF-1335) Change request: node pools intel → amd, different arm (Steve) — 2026-04-22
- [INF-1319](https://linear.app/nxdev/issue/INF-1319) Update SAML config (Patrick) — 2026-04-07

**ClickUp**
- `chore(enterprise, clickup): temp remove io-trace for clickup` (Caleb Ukle, 2026-04-21) — stability tuning
- `chore(enterprise, clickup): c3d-16 for class=2` (pmariglia, 2026-04-10)
- `chore(enterprise, clickup): Add 2/8 resourceclasses for clickup` (pmariglia, 2026-04-09)
- `chore(enterprise, clickup): Add sizeclass 2 nodepool at c3d-standard-8` (pmariglia, 2026-04-09)
- [INF-1328](https://linear.app/nxdev/issue/INF-1328) 2c/8gb → 7/8/24 agents on 16-56c/64-224gb, test classes (Patrick) — 2026-04-10
- [INF-1326](https://linear.app/nxdev/issue/INF-1326) New 2c/8gb resource class (Patrick) — 2026-04-10

**Mimecast / Island / Cisco**
- [INF-1333](https://linear.app/nxdev/issue/INF-1333) Mimecast — missing `ANTHROPIC_API_KEY` (Patrick) — 2026-04-21
- [INF-1332](https://linear.app/nxdev/issue/INF-1332) Island — enable Sandboxing (Patrick) — 2026-04-20
- [INF-1330](https://linear.app/nxdev/issue/INF-1330) Cisco — SAML enabling (Steve) — 2026-04-16
- `chore(enterprise,gcp,cisco): add saml vars` (Steve Pentland, 2026-04-16)
- `chore(enterprise, island): Deploy iotrace to island` (pmariglia, 2026-04-20)
- `chore(mimecast): nx-api log level debug` (Altan Stalker, 2026-04-01)

**Mailchimp / ADP / Hilton**
- `chore(enterprise, mailchimp, adp, hilton): Fix max_nodes to match reality` (pmariglia, 2026-04-08)

### Core platform / multi-cluster

- `chore(operations,aws): ensure polygraph images can push to aws base registry` (Steve Pentland, 2026-04-23)
- `enable NX_CLOUD_TASK_METRICS_USE_APP_BUCKET on dev and staging` (Rares Matei, 2026-04-23)
- `chore(enterprise, all[aws], ecr-cache): wire custom_role_arn + create/tag perms on pull-through template` (pmariglia, 2026-04-22)
- `chore(aws, development): Add missing kustomization.yaml` (pmariglia, 2026-04-23)
- `feat: try to install gatewayapi crds in aws dev` (pmariglia, 2026-04-23)
- `chore(aws, development): GatewayAPI Resources for AWS Dev` (pmariglia, 2026-04-21)
- `chore(dev,workflows): rollback dev workflows west 1` (Altan Stalker, 2026-04-22)
- `chore(dev,workflows): turn off autosync` (Altan Stalker, 2026-04-22)
- `chore(dev,workflows): roll back workflows to 2604.22.2` (Altan Stalker, 2026-04-22)
- `chore(dev, staging): re-enable auto-sync` (Altan Stalker, 2026-04-22)
- `chore(dev): roll back to 2604.22.2, disable autosync` (Altan Stalker, 2026-04-22)
- `chore(dev): rollback to 2604.20.4, disable sync` (Altan Stalker, 2026-04-21)
- `chore(prod,na,eu): enable valkey vcs cache` (Altan Stalker, 2026-04-20)
- `chore(staging): enable valkey vcs cache` (Altan Stalker, 2026-04-19)
- `chore(dev): enable valkey vcs cache` (Altan Stalker, 2026-04-19)
- `chore(dev): remove duplicated NX_CLOUD_MODE with discrete values` (Altan Stalker, 2026-04-14)
- `feat(aztester): add managed valkey resources` (Szymon Wojciechowski, 2026-04-09)
- `feat(aws dev): script for sentinel setup` (Szymon Wojciechowski, 2026-04-09)
- `feature(aws dev): add aws valkey sentinel module` (Szymon Wojciechowski, 2026-04-07)
- `chore(repo): Fix enterprise large deployments io-tracing` (pmariglia, 2026-04-10)
- `chore(image-updater): Static ref to install that works` (pmariglia, 2026-04-10)
- `chore(nginx-proxy): lower nginx keepalive_timeout from 65s to 10s for npm readthrough` (pmariglia, 2026-04-10)
- `chore(operations): Explicit NAT IP for operations cluster` (pmariglia, 2026-04-08)
- `feat(enterprise, aws, gcp, azure): Operations IP Address allowed by default` (pmariglia, 2026-04-08)
- `fix(development): fix duplicate name` (Steve Pentland, 2026-04-08)
- `add NX_CLOUD_APP_URL for polygraph` (Jonathan Cammisuli, 2026-04-08)
- `chore(enterprise, azure): Update ubuntu image too` (pmariglia, 2026-04-21)
- `chore(enterprise, azure): Bump FE Pod limit to 1 core to match other envs` (pmariglia, 2026-04-07)
- `chore(argo,dev): add workflow-controller-west1.yaml to argo writeback for dev` (Altan Stalker, 2026-04-07)
- `chore(dev, wf-west): manually update image tag to 2604.06.6` (Altan Stalker, 2026-04-07)
- `chore(repo): update istio plan` (Steve Pentland, 2026-04-05)
- `chore(repo): add plan for istio work` (Steve Pentland, 2026-04-02)
- `chore(development,polygraph): deploy polygraph with new gh auth` (Steve Pentland, 2026-04-14)
- `chore(development,polygraph): prep secrets` (Steve Pentland, 2026-04-14)
- `chore(operations): add more references` (Steve Pentland, 2026-04-09)
- `chore(operations): remove users who are no longer present` (Steve Pentland, 2026-04-09)
- `chore(aws, management): Remove old accounts` (pmariglia, 2026-04-09)
- `fix(snapshot): nx api internal base url value for polygraph frontend` (Chau, 2026-04-02)
- `chore(snapshot): add polygraph githbu app id env vars to snapshot api side` (Chau, 2026-04-01)
- `chore(nxclouddevelopment): /polygraph/private to backend-not-found` (Szymon Wojciechowski, 2026-04-02)
- `chore(nxclouddevelopment): /polygraph should target nx-api` (Szymon Wojciechowski, 2026-04-02)
- `chore(enterprise, aws): Fix aws modules addons ordering` (pmariglia, 2026-04-22)
- `chore(azure): fix diffs on plans` (pmariglia, 2026-04-08)
- `chore(repo): ensure env is used in oidc sub` (Steve Pentland, 2026-04-08)
- `chore(repo): fix workflow file` (Steve Pentland, 2026-04-01)
- `chore(repo): build our valkey dump image` (Steve Pentland, 2026-04-01)
- `chore(repo): add spacelift to OIDC gap` (Szymon Wojciechowski, 2026-04-01)
- `chore(repo): fix name` (Szymon Wojciechowski, 2026-04-01)
- `chore(repo): add a research doc for eu cloud providers` (Szymon Wojciechowski, 2026-04-01)

### Infrastructure (Linear)

- [INF-1337](https://linear.app/nxdev/issue/INF-1337) Facade - fix streaming timeout bug (Steve) — 2026-04-23
- [INF-1336](https://linear.app/nxdev/issue/INF-1336) Fix push of polygraph image to AWS mirror base (Steve) — 2026-04-23
- [INF-1327](https://linear.app/nxdev/issue/INF-1327) Cronjob framework for background jobs to query mongo (Patrick) — 2026-04-20
- [INF-1324](https://linear.app/nxdev/issue/INF-1324) AWS valkey sentinel deployment (Szymon) — 2026-04-09
- [INF-1323](https://linear.app/nxdev/issue/INF-1323) Credit Usage Tool in Lighthouse (Patrick) — 2026-04-09
- [INF-1322](https://linear.app/nxdev/issue/INF-1322) Anaplan — move ST to AWS for Private Link to self-hosted GitHub (Patrick, High) — 2026-04-23
- [INF-1321](https://linear.app/nxdev/issue/INF-1321) MongoDB Connections prefer connecting to read-replicas (Patrick) — 2026-04-09
- [INF-1317](https://linear.app/nxdev/issue/INF-1317) Allow Operations Cluster IP(es) to Connect to MongoDB Clusters permanently (Patrick) — 2026-04-08
- [INF-1316](https://linear.app/nxdev/issue/INF-1316) Ensure Operations Cluster gets Static IP (Patrick) — 2026-04-08
- [INF-1315](https://linear.app/nxdev/issue/INF-1315) AWS valkey tf module (Szymon) — 2026-04-08
- [INF-1314](https://linear.app/nxdev/issue/INF-1314) Create initial plan docs [Istio] (Steve) — 2026-04-02
- [INF-1312](https://linear.app/nxdev/issue/INF-1312) Route `/polygraph` to Nx API like `/nx-cloud` (Szymon) — 2026-04-02
- [INF-1311](https://linear.app/nxdev/issue/INF-1311) Update polygraph-github-secrets PRIVATE_KEY (Steve) — 2026-04-02
- [INF-1310](https://linear.app/nxdev/issue/INF-1310) Create a doc for EU cloud providers research (Szymon) — 2026-04-01
- [INF-1308](https://linear.app/nxdev/issue/INF-1308) Research possible cloud providers (Szymon) — 2026-04-01
- [INF-1272](https://linear.app/nxdev/issue/INF-1272) Review facade runner for interface/module extraction opportunities (Steve) — 2026-04-01
- [INF-1234](https://linear.app/nxdev/issue/INF-1234) Setup terraform infra for azure redis (Szymon) — 2026-04-09
- [INF-1178](https://linear.app/nxdev/issue/INF-1178) Propagate trace context through facade-to-downstream RPCs (Steve) — 2026-04-01
- [INF-1177](https://linear.app/nxdev/issue/INF-1177) Add workflow mapping Valkey hit/miss metrics (Steve) — 2026-04-01
- [INF-1175](https://linear.app/nxdev/issue/INF-1175) Add per-downstream request latency Prometheus metrics (Steve) — 2026-04-01
- [INF-1147](https://linear.app/nxdev/issue/INF-1147) Facade Observability & Metrics (Steve) — 2026-04-01

---

## Docs

### Linear

**Blog migration (TanStack Start, master.nx.dev)**
- [DOC-481](https://linear.app/nxdev/issue/DOC-481) Blog search returns page not found (Jack, Urgent) — 2026-04-20
- [DOC-486](https://linear.app/nxdev/issue/DOC-486) Sitemap needs to include blog (Jack, High) — 2026-04-21
- [DOC-478](https://linear.app/nxdev/issue/DOC-478) Clean-up old blog (Jack, Medium) — 2026-04-17
- [DOC-469](https://linear.app/nxdev/issue/DOC-469) Testimonial Markdoc tag missing image and styled layout (Jack, High) — 2026-04-07
- [DOC-463](https://linear.app/nxdev/issue/DOC-463) Match Framer header and footer (Jack, High) — 2026-04-02
- [DOC-465](https://linear.app/nxdev/issue/DOC-465) Image auto optimization (Jack, High) — 2026-04-02
- [DOC-470](https://linear.app/nxdev/issue/DOC-470) CTA component doesn't match current styles (Jack) — 2026-04-02
- [DOC-461](https://linear.app/nxdev/issue/DOC-461) Blog articles should use slug from frontmatter, not filename (Philip) — 2026-04-01

**Docs site (Astro/Starlight)**
- [DOC-491](https://linear.app/nxdev/issue/DOC-491) Broken link from batch mode glossary entry (Jack) — 2026-04-24
- [DOC-488](https://linear.app/nxdev/issue/DOC-488) Document no-output-timeout launch template option (Caleb) — 2026-04-22
- [DOC-487](https://linear.app/nxdev/issue/DOC-487) Fix nx commands reference command list (Jack, Medium) — 2026-04-22
- [DOC-479](https://linear.app/nxdev/issue/DOC-479) Review low-effort agent-readiness improvements for nx.dev (Jack, Medium) — 2026-04-20
- [DOC-69](https://linear.app/nxdev/issue/DOC-69) Versioned docs: Next.js versioned deployments → static HTML snapshots via Netlify branch deploys at `{version}.nx.dev/docs` (Jack, High) — 2026-04-17
- [DOC-475](https://linear.app/nxdev/issue/DOC-475) Search is not surfacing reference pages for `nx.json` (Caleb) — 2026-04-10
- [DOC-477](https://linear.app/nxdev/issue/DOC-477) Review remote cache docs and Powerpack redirect (Jack) — 2026-04-10
- [DOC-476](https://linear.app/nxdev/issue/DOC-476) Bring back no-workspace CTA in CI tutorial (Jack, High) — 2026-04-10
- [DOC-474](https://linear.app/nxdev/issue/DOC-474) Update docs sidebar: expand Tutorials, collapse Concepts, remove "new" badge (Jack, Medium) — 2026-04-07
- [DOC-472](https://linear.app/nxdev/issue/DOC-472) Add CLI reference links from Nx Release guide (Caleb, Medium) — 2026-04-10
- [DOC-471](https://linear.app/nxdev/issue/DOC-471) Refresh GITHUB_TOKEN for docs (High) — 2026-04-02
- [DOC-468](https://linear.app/nxdev/issue/DOC-468) Star button no longer shows current star count (unassigned, High) — 2026-04-01
- [DOC-466](https://linear.app/nxdev/issue/DOC-466) Add a ToC to the tutorial series (Jack, Medium) — 2026-04-01

**Agentic experience / `nx connect`**
- [DOC-456](https://linear.app/nxdev/issue/DOC-456) Sandbox allowUnixSockets docs page (Caleb, Medium) — 2026-04-10
- [DOC-451](https://linear.app/nxdev/issue/DOC-451) Document `nx-cloud onboard` command (Dillon, High) — 2026-04-02
- [DOC-412](https://linear.app/nxdev/issue/DOC-412) Document new `nx connect` flow for agentic onboarding (Caleb, Medium) — 2026-04-02
- [DOC-473](https://linear.app/nxdev/issue/DOC-473) Investigate "SEO" for agents (Caleb) — 2026-04-10

### Blog

- [Self-Healing CI Now Suggests What to Auto-Apply](https://nx.dev/blog/self-healing-ci-auto-apply-suggestions) — Juri Strumpflohner, 2026-04-22
- [Deploying a PNPM Monorepo to Cloudflare Pages](https://nx.dev/blog/pnpm-monorepo-cloudflare-pages) — Juri Strumpflohner, 2026-04-20
- [Sharing Tailwind CSS Styles Across Apps in a Monorepo](https://nx.dev/blog/sharing-tailwind-styles-nx-monorepo) — Juri Strumpflohner, 2026-04-09

---

## Linear Project Status

### Completed in April 2026

| Project | Lead | Link |
|---|---|---|
| Nx Package Health | Colum | [View](https://linear.app/nxdev/project/nx-package-health-5b6cabe009a1) |
| Template-based onboarding | Nicole | [View](https://linear.app/nxdev/project/template-based-onboarding-d4beeddcc9da) |
| Ocean DX improvements | Nicole | [View](https://linear.app/nxdev/project/ocean-dx-improvements-2fa569261d96) |
| Evaluate product analytics tools | Nicole | [View](https://linear.app/nxdev/project/evaluate-product-analytics-tools-774829c5e4a5) |
| Nx Cloud changelog | Nicole | [View](https://linear.app/nxdev/project/nx-cloud-changelog-310efcfcf67a) |
| Europe-Provider Single Tenant Setup | Szymon | [View](https://linear.app/nxdev/project/europe-provider-single-tenant-setup-feeee946efe4) |
| Implement Multi-Cluster Agent Setups | Steve | [View](https://linear.app/nxdev/project/implement-multi-cluster-agent-setups-00f6853704b8) |

### Active (with April updates)

| Project | Lead | Status | Target | Link |
|---|---|---|---|---|
| Task Sandboxing (I/O Tracing) | Jason | In Progress | 2026-04-24 | [View](https://linear.app/nxdev/project/task-sandboxing-inputoutput-tracing-46fbeb490e00) |
| CNW/Init Funnel & Cloud Conversion | Jack | atRisk | 2026-06-30 | [View](https://linear.app/nxdev/project/cnwinit-funnel-and-cloud-conversion-optimization-35cd59d7b1f6) |
| Major Version Deprecations | Jason | onTrack | 2026-05-08 | [View](https://linear.app/nxdev/project/major-version-deprecations-7f2a269d3fd6) |
| CIPE Waterfall screen | Ben | atRisk | 2026-04-30 | [View](https://linear.app/nxdev/project/cipe-waterfall-screen-5215deabf94d) |
| Feature demos | Nicole | atRisk | 2026-05-01 | [View](https://linear.app/nxdev/project/feature-demos-1a6f6084c62d) |
| Feature activation guides | Nicole | offTrack | 2026-05-29 | [View](https://linear.app/nxdev/project/feature-activation-guides-1a0fe6ac8668) |
| `nx migrate` Revamp | Leosvel | onTrack | — | [View](https://linear.app/nxdev/project/nx-migrate-revamp-be6b1bc94c3d) |
| Nx Local Dist Migration | Jason | In Progress | 2026-05-08 | [View](https://linear.app/nxdev/project/nx-local-dist-migration-c7679576defa) |
| Extending Target Defaults | Craigory | In Progress | 2026-04-30 | [View](https://linear.app/nxdev/project/extending-target-defaults-functionality-33808ed414a6) |
| One-page "connect workspace" flow | Nicole | onTrack | — | [View](https://linear.app/nxdev/project/one-page-connect-workspace-flow-23149e6efc77) |
| Nx Cloud pricing page refresh Q1 2026 | Nicole | onTrack | — | [View](https://linear.app/nxdev/project/nx-cloud-pricing-page-refresh-q1-2026-adc245a9d0b0) |
| Improve manual agent metrics upload DX | Rares | onTrack | — | [View](https://linear.app/nxdev/project/improve-manual-agent-metrics-upload-dx-in-nx-cloud-c00eebb8c1dc) |
| Enterprise Analytics API Cleanup | Rares | onTrack | — | [View](https://linear.app/nxdev/project/enterprise-analytics-api-cleanup-73da7b8ab2e6) |
| Istio integration | Steve | onTrack | — | [View](https://linear.app/nxdev/project/istio-integration-8c4bf121cbc9) |
| Lighthouse MongoDB Tenant Connections | Patrick | In Progress | 2026-04-24 | [View](https://linear.app/nxdev/project/lighthouse-enable-tenant-mongodb-connections-49a0f29693f9) |
| AWS GatewayAPI Implementation | Patrick | In Progress | — | [View](https://linear.app/nxdev/project/aws-gatewayapi-implementation-4f43ae8a388f) |

### Issues Completed: ~260 across 5 teams

Nx CLI 79 · Nx Cloud + Quokka 41 · Infrastructure 27 · RedPanda 92 · Docs 21

---

## Caveats

- **Month in progress**: only Apr 1 – Apr 24 data. Late-April completions missing.
- **RedPanda team**: 92 April issues captured at summary level — Linear's list API truncates descriptions at ~500 chars, and response-size limits prevented full issue-by-issue transcription. Raw JSON preserved at `/tmp/linear-april-2026/redpanda-p{1,2}.json`.
- **Nx Cloud changelog**: version index page is a JS-rendered SPA; versions were discovered via URL probing (grid of `2604.DD.N`). If later versions use `.N` suffixes ≥5 or atypical DD padding, they may be missing. 6 versions found is consistent with monthly cadence.
- **Pylon**: not all enterprise customers were searched — queries targeted 22 customer accounts. Accounts named differently in Pylon may have been missed. 0-ticket customers (Anaplan, Rocket Mortgage, Dell, Walmart, Capital One, Shopify, American Express, Moderna, Cloudinary, Caseware) either have no April activity under that exact name or use a different account identifier.

_Generated on 2026-04-24._
