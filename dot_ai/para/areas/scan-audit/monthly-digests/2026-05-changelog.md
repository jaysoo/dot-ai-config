# Nx Platform Changelog — May 2026

> **Sources:** Nx CLI GitHub releases (`nrwl/nx`), Nx Cloud public changelog (`changelog.nx.app`), `nrwl/cloud-infrastructure` commits, Notion-Linear search, blog (`nx.dev/blog`). **Linear MCP and Pylon MCP were unauthenticated** in this run — per-issue and per-customer-ticket detail is reduced versus April.

> **Window:** 2026-05-01 through 2026-05-25.

---

## Nx 23.0.0 Beta Line

### CLI — Breaking Changes

- **drop Node 20 support; bump @types/node** ([PR #35591](https://github.com/nrwl/nx/pull/35591)) — 23.0.0-beta.9
- **vite: remove vitest support in favor of @nx/vitest** ([PR #35517](https://github.com/nrwl/nx/pull/35517)) — 23.0.0-beta.9
- **testing: deprecate @nx/cypress:cypress executor** ([PR #35531](https://github.com/nrwl/nx/pull/35531)) — 23.0.0-beta.6
- **detox: deprecate @nx/detox build and test executors** ([PR #35529](https://github.com/nrwl/nx/pull/35529)) — 23.0.0-beta.6
- **misc: deprecate executors with inferred-plugin replacements** ([PR #35576](https://github.com/nrwl/nx/pull/35576)) — 23.0.0-beta.9
- **angular: remove deprecated ngrx generator** ([PR #35567](https://github.com/nrwl/nx/pull/35567)) — 23.0.0-beta.9. Use `@nx/angular:ngrx-root-store` + `@nx/angular:ngrx-feature-store` instead.
- **core: drop legacy 'self'/'dependencies' magic strings in dependsOn** ([PR #35648](https://github.com/nrwl/nx/pull/35648)) — 23.0.0-beta.10. Followed by warn-instead-of-drop softening in [PR #35687](https://github.com/nrwl/nx/pull/35687) (beta.13).
- **bundling: drop legacy typescript plugin and align rollup buildLibsFromSource default** ([PR #35516](https://github.com/nrwl/nx/pull/35516)) — 23.0.0-beta.8
- **misc: remove deprecated js option from component generators** ([PR #35616](https://github.com/nrwl/nx/pull/35616), [#29111](https://github.com/nrwl/nx/issues/29111)) — 23.0.0-beta.10
- **bundling: remove SVGR option and provide withSvgr migration** ([PR #35611](https://github.com/nrwl/nx/pull/35611)) — 23.0.0-beta.10
- **release: drop deprecated releaseTag* flat properties and update v23 defaults** ([PR #35694](https://github.com/nrwl/nx/pull/35694)) — 23.0.0-beta.13
- **core: remove deprecated initTasksRunner API** ([PR #35708](https://github.com/nrwl/nx/pull/35708)) — 23.0.0-beta.14. Internal: NXC-4307.
- **testing: migrate @nx/jest to local dist build** ([PR #35713](https://github.com/nrwl/nx/pull/35713)) — 23.0.0-beta.16
- **linter: migrate @nx/eslint and @nx/eslint-plugin to local dist build** ([PR #35720](https://github.com/nrwl/nx/pull/35720)) — 23.0.0-beta.17
- **misc: drop deprecated webpack plugin re-exports + v23 polish** ([PR #35659](https://github.com/nrwl/nx/pull/35659)) — 23.0.0-beta.18, .19

### CLI — Features

- **core: add shell tab-completion (bash, zsh, fish, powershell)** ([PR #34951](https://github.com/nrwl/nx/pull/34951)) — 23.0.0-beta.18
- **core: enable native Node.js TypeScript stripping by default** ([PR #35608](https://github.com/nrwl/nx/pull/35608)) — 23.0.0-beta.16
- **core: enable node's native v8 compile cache support** ([PR #35415](https://github.com/nrwl/nx/pull/35415), [#20454](https://github.com/nrwl/nx/issues/20454)) — 23.0.0-beta.9
- **core: add --mode and --multi-major-mode flags to nx migrate** ([PR #35497](https://github.com/nrwl/nx/pull/35497)) — 23.0.0-beta.10
- **core: support prompt field in migration entries** ([PR #35638](https://github.com/nrwl/nx/pull/35638)) — 23.0.0-beta.12
- **misc: convert prompt generator migrations to use prompt field** ([PR #35688](https://github.com/nrwl/nx/pull/35688)) — 23.0.0-beta.17
- **linter: allow prompt-only entries in migration nx-plugin-checks** ([PR #35700](https://github.com/nrwl/nx/pull/35700)) — 23.0.0-beta.13
- **core: support filtered array-shape targetDefaults with projects and source** ([PR #35340](https://github.com/nrwl/nx/pull/35340)) — 23.0.0-beta.13
- **core: rename nx watch --includeDependentProjects to --includeDependencies** ([PR #35699](https://github.com/nrwl/nx/pull/35699)) — 23.0.0-beta.13
- **core: allow `nx mcp` to run outside of an Nx workspace** ([PR #35655](https://github.com/nrwl/nx/pull/35655)) — 23.0.0-beta.10
- **devkit: migrate @nx/devkit/src/... deep imports** ([PR #35541](https://github.com/nrwl/nx/pull/35541), [#34946](https://github.com/nrwl/nx/issues/34946)) — 23.0.0-beta.6
- **gradle: stream batch task results to nx as they finish** ([PR #35487](https://github.com/nrwl/nx/pull/35487)) — 23.0.0-beta.5
- **testing: bump cypress to 15.14 + remove stale Vite 8 guard** ([PR #35613](https://github.com/nrwl/nx/pull/35613)) — 23.0.0-beta.10
- **bundling: add Vite 7 -> 8 migrations** ([PR #35614](https://github.com/nrwl/nx/pull/35614)) — 23.0.0-beta.10
- **testing: add migration for Jest 30 snapshot guide link** ([PR #35629](https://github.com/nrwl/nx/pull/35629)) — 23.0.0-beta.10
- **js: support pnpm 11.2.2** ([PR #35772](https://github.com/nrwl/nx/pull/35772)) — 23.0.0-beta.19
- **nx-dev: track docs analytics for code copy, LLM prompt, YouTube** ([PR #35526](https://github.com/nrwl/nx/pull/35526)) — 23.0.0-beta.5

### CLI — Fixes (selected)

- **core: use native graceful process tree shutdown** ([PR #33655](https://github.com/nrwl/nx/pull/33655), [#32438](https://github.com/nrwl/nx/issues/32438)) — beta.13
- **core: warn instead of silently dropping legacy 'self'/'dependencies' dependsOn values** ([PR #35687](https://github.com/nrwl/nx/pull/35687)) — beta.13
- **core: drain in-flight notify events in daemon force_flush_pending** ([PR #35646](https://github.com/nrwl/nx/pull/35646)) — beta.10
- **core: freshness-gate daemon recompute + per-OS force-flush grace** ([PR #35650](https://github.com/nrwl/nx/pull/35650)) — beta.11
- **core: error with helpful error instead of looping nx invocations** ([PR #34820](https://github.com/nrwl/nx/pull/34820)) — beta.9
- **core: support skipped batch tasks end-to-end and fix TUI double logs** ([PR #35617](https://github.com/nrwl/nx/pull/35617)) — beta.10
- **core: keep TUI task selection on the in-progress section** ([PR #35640](https://github.com/nrwl/nx/pull/35640)) — beta.10
- **core: correct TUI sidebar viewport height off-by-one** ([PR #34682](https://github.com/nrwl/nx/pull/34682)) — beta.10
- **core: improve nx migrate multi-major flag handling and feedback** ([PR #35673](https://github.com/nrwl/nx/pull/35673)) — beta.12
- **core: do not drop target defaults in 23.0.0 array migration** ([PR #35711](https://github.com/nrwl/nx/pull/35711)) — beta.14
- **core: restore nx/src/index entrypoint for Nx Cloud client compatibility** ([PR #35712](https://github.com/nrwl/nx/pull/35712)) — beta.15 (regression fix for initTasksRunner removal)
- **core: detect vscode copilot ai agent** ([PR #35757](https://github.com/nrwl/nx/pull/35757)) — beta.18
- **core: resolve local plugin subpath imports from source** ([PR #35631](https://github.com/nrwl/nx/pull/35631)) — beta.17
- **core: allow local plugin subpath imports without custom conditions** ([PR #35751](https://github.com/nrwl/nx/pull/35751)) — beta.18
- **core: treat undefined task parallelism as parallel when scheduling** ([PR #35736](https://github.com/nrwl/nx/pull/35736)) — beta.17
- **core: handle object form of bin field in getPrettierPath** ([PR #35680](https://github.com/nrwl/nx/pull/35680)) — beta.17
- **core: warn before installing unknown npm packages as preset** ([PR #35644](https://github.com/nrwl/nx/pull/35644)) — beta.10
- **core: preserve input order in createNodes plugin results** ([PR #35595](https://github.com/nrwl/nx/pull/35595)) — beta.13
- **core: always set task.cache as an explicit boolean** ([PR #35778](https://github.com/nrwl/nx/pull/35778)) — beta.19
- **devkit: exclude dist from jest module path scan** ([PR #35615](https://github.com/nrwl/nx/pull/35615)) — beta.9
- **angular-rspack: keep root-scoped assets out of per-locale i18n emit** ([PR #35621](https://github.com/nrwl/nx/pull/35621)) — beta.9
- **angular-rspack: exclude eslint config from tailwind v4 source scan** ([PR #35663](https://github.com/nrwl/nx/pull/35663)) — beta.10
- **angular: multi-version support compliance** ([PR #35587](https://github.com/nrwl/nx/pull/35587)) — beta.10
- **angular: only add @oxc-project/runtime on the vitest-analog path** ([PR #35734](https://github.com/nrwl/nx/pull/35734)) — beta.18
- **gradle: add transitive:true to all tasks** ([PR #35677](https://github.com/nrwl/nx/pull/35677)) — beta.11
- **gradle: pin generated e2e project toolchain to installed JDK** ([PR #35703](https://github.com/nrwl/nx/pull/35703)) — beta.13
- **gradle: support Windows file paths** ([PR #35184](https://github.com/nrwl/nx/pull/35184), [#34987](https://github.com/nrwl/nx/issues/34987)) — beta.10
- **gradle: exclude project-graph from jest module path scan** ([PR #35609](https://github.com/nrwl/nx/pull/35609)) — beta.9
- **maven: widen runCLI timeout for --no-batch maven.test.ts cases** ([PR #35589](https://github.com/nrwl/nx/pull/35589)) — beta.9
- **maven: serialize Maven 4 build state recording** ([PR #35555](https://github.com/nrwl/nx/pull/35555)) — beta.6
- **js: include transitive workspace deps in pruned pnpm lockfile** ([PR #35532](https://github.com/nrwl/nx/pull/35532), [#35347](https://github.com/nrwl/nx/issues/35347), [#34655](https://github.com/nrwl/nx/issues/34655)) — beta.6
- **js: build to local dist and use nodenext** ([PR #35538](https://github.com/nrwl/nx/pull/35538)) — beta.13
- **js: fall back to npm publish when bun publish fails with auth error** ([PR #35756](https://github.com/nrwl/nx/pull/35756)) — beta.18
- **js: always register transpiler for registerTsProject so subsequent require(file) will work** ([PR #35735](https://github.com/nrwl/nx/pull/35735)) — beta.17
- **js: multi-version support compliance** ([PR #35725](https://github.com/nrwl/nx/pull/35725)) — beta.18
- **js: add backwards-compatible ./src/internal export shim for conformance@4/5** ([PR #35710](https://github.com/nrwl/nx/pull/35710)) — beta.14
- **linter: improve convert-to-flat-config output fidelity** ([PR #35330](https://github.com/nrwl/nx/pull/35330)) — beta.10
- **linter: only rewrite workspace-package peer deps to workspace:*** ([PR #35423](https://github.com/nrwl/nx/pull/35423)) — beta.12
- **linter: prevent ENOENT crash in getRelativeImportPath for unresolvable paths** ([PR #35007](https://github.com/nrwl/nx/pull/35007)) — beta.9
- **testing: correct yargs-parser import in getJestProjectsAsync** ([PR #35672](https://github.com/nrwl/nx/pull/35672)) — beta.12
- **testing: pin jest to ~30.3.0 to avoid jest-runtime 30.4 RN incompat** ([PR #35618](https://github.com/nrwl/nx/pull/35618)) — beta.9
- **testing: handle absolute cypress screenshotsFolder/videosFolder paths** ([PR #35624](https://github.com/nrwl/nx/pull/35624)) — beta.9
- **testing: exclude dist and out-tsc from default jest module path scan** ([PR #35619](https://github.com/nrwl/nx/pull/35619)) — beta.10
- **testing: correct paths and reserve ports across flaky React MF e2e tests** ([PR #35633](https://github.com/nrwl/nx/pull/35633)) — beta.10
- **testing: multi-version support compliance for @nx/playwright** ([PR #35642](https://github.com/nrwl/nx/pull/35642)) — beta.10
- **testing: multi-version support compliance for @nx/cypress** ([PR #35670](https://github.com/nrwl/nx/pull/35670)) — beta.12
- **testing: publish @nx/vitest, @nx/cypress, @nx/playwright, @nx/vite from local dist** ([PR #35743](https://github.com/nrwl/nx/pull/35743)) — beta.19
- **dotnet: correct output paths for Web SDK and centralized dist setups** ([PR #35398](https://github.com/nrwl/nx/pull/35398)) — beta.8
- **dotnet: include Directory.*.* files in inputs** ([PR #35738](https://github.com/nrwl/nx/pull/35738)) — beta.18
- **rspack: multi-version support compliance for @nx/rspack and @nx/rsbuild** ([PR #35676](https://github.com/nrwl/nx/pull/35676)) — beta.13
- **rsbuild: infer build outputs from distPath.root directly** ([PR #35707](https://github.com/nrwl/nx/pull/35707)) — beta.17
- **rsbuild: lazy-require @rsbuild/core in plugin** so spec mocks work after `jest.resetModules` ([PR #35707](https://github.com/nrwl/nx/issues/35707))
- **bundling: multi-version support compliance for @nx/esbuild** ([PR #35768](https://github.com/nrwl/nx/pull/35768)) — beta.19
- **misc: stop inferring `projects: 'self'` in `dependsOn` entries** ([PR #35686](https://github.com/nrwl/nx/pull/35686)) — beta.12
- **misc: skip `$` escaping in file paths on windows** ([PR #35692](https://github.com/nrwl/nx/pull/35692)) — beta.17
- **misc: vite migration import fix and ai doc corrections** ([PR #35647](https://github.com/nrwl/nx/pull/35647)) — beta.10
- **misc: adopt PluginCache across createNodes plugins to prevent flaky cache parse errors** ([PR #35544](https://github.com/nrwl/nx/pull/35544)) — beta.6
- **devkit: drop build-base outputs override** ([PR #35542](https://github.com/nrwl/nx/pull/35542)) — beta.6
- **devkit: only rewrite deep-import paths in real import sites** ([PR #35566](https://github.com/nrwl/nx/pull/35566)) — beta.7
- **release: restore packages/devkit/package.json after release** ([PR #35598](https://github.com/nrwl/nx/pull/35598)) — beta.9
- **nx-plugin: plugin lint checks should use dependentTasksOutputFiles** ([PR #35755](https://github.com/nrwl/nx/pull/35755)) — beta.19
- **repo: resolve graph-client build-client sandbox violations** ([PR #35522](https://github.com/nrwl/nx/pull/35522)) — beta.8
- **repo: drop node 26 from nightly matrix until playwright/yauzl fix** ([PR #35626](https://github.com/nrwl/nx/pull/35626)) — beta.9
- **repo: run dotnet restore before publish** ([PR #35771](https://github.com/nrwl/nx/pull/35771)) — beta.18, .19
- **repo: run dotnet restore before macos e2e job** ([PR #35774](https://github.com/nrwl/nx/pull/35774)) — beta.19

---

## Nx 22.7 Patch Releases

### CLI 22.7.2 (2026-05-14)

Features: gradle batch-task streaming ([PR #35487](https://github.com/nrwl/nx/pull/35487)); docs analytics for code-copy/LLM-prompt/YouTube ([PR #35526](https://github.com/nrwl/nx/pull/35526)); Jest 30 snapshot guide migration ([PR #35629](https://github.com/nrwl/nx/pull/35629)).

Selected fixes:
- **angular: disable vitest watch by default** ([PR #35493](https://github.com/nrwl/nx/pull/35493))
- **angular-rspack: keep root-scoped assets out of per-locale i18n emit** ([PR #35621](https://github.com/nrwl/nx/pull/35621))
- **bundling: include tsconfig solution input for rollup** ([PR #35476](https://github.com/nrwl/nx/pull/35476))
- **bundling: include tsconfig solution input for webpack** ([PR #35477](https://github.com/nrwl/nx/pull/35477))
- **core: bump axios to 1.16.0 for all packages** ([PR #35568](https://github.com/nrwl/nx/pull/35568)) — multi-CVE security
- **core: add provenance check in nx console status path** ([PR #35485](https://github.com/nrwl/nx/pull/35485))
- **core: remove access control header from graph app** ([PR #35494](https://github.com/nrwl/nx/pull/35494))
- **core: ensure verbose logs go to stderr; daemon logs decorated** ([PR #34358](https://github.com/nrwl/nx/pull/34358))
- **core: show flaky-task count in run summary** ([PR #35491](https://github.com/nrwl/nx/pull/35491))
- **core: unique telemetry user_id; expose workspace_id dimension** ([PR #35553](https://github.com/nrwl/nx/pull/35553))
- **core: update minimatch to 10.2.5** ([PR #35569](https://github.com/nrwl/nx/pull/35569))
- **core: restore use-legacy-versioning shim for @nx/js@21 ensurePackage path** ([PR #35574](https://github.com/nrwl/nx/pull/35574))
- **core: use gethostuuid(3) instead of ioreg on macOS** ([PR #35599](https://github.com/nrwl/nx/pull/35599))
- **core: enable node's native v8 compile cache support** ([PR #35415](https://github.com/nrwl/nx/pull/35415))
- **core: support skipped batch tasks end-to-end and fix TUI double logs** ([PR #35617](https://github.com/nrwl/nx/pull/35617))
- **core: keep TUI task selection on the in-progress section** ([PR #35640](https://github.com/nrwl/nx/pull/35640))
- **core: allow `nx mcp` to run outside of an Nx workspace** ([PR #35655](https://github.com/nrwl/nx/pull/35655))
- **devkit: exclude dist from jest module path scan** ([PR #35615](https://github.com/nrwl/nx/pull/35615))
- **devkit: expand @nx/devkit/internal re-exports for cherry-picked v23 deep-import migration** ([#35541](https://github.com/nrwl/nx/issues/35541))
- **dotnet: correct output paths for Web SDK and centralized dist setups** ([PR #35398](https://github.com/nrwl/nx/pull/35398))
- **gradle: exclude batch-runner from jest haste-map crawl** ([PR #35501](https://github.com/nrwl/nx/pull/35501))
- **gradle: support Windows file paths** ([PR #35184](https://github.com/nrwl/nx/pull/35184))
- **js: strip glob from inferred outputs before resolving as path** ([PR #35463](https://github.com/nrwl/nx/pull/35463))
- **js: reference vitest.config in eslint dep-checks for vitest libs** ([PR #35460](https://github.com/nrwl/nx/pull/35460))
- **js: include transitive workspace deps in pruned pnpm lockfile** ([PR #35532](https://github.com/nrwl/nx/pull/35532))
- **linter: prevent ENOENT crash in getRelativeImportPath for unresolvable paths** ([PR #35007](https://github.com/nrwl/nx/pull/35007))
- **maven: skip attached artifacts that fail to materialize in batch record** ([PR #35473](https://github.com/nrwl/nx/pull/35473))
- **maven: serialize Maven 4 build state recording** ([PR #35555](https://github.com/nrwl/nx/pull/35555))
- **nx-dev: document nested CLI subcommands beyond two levels** ([PR #35519](https://github.com/nrwl/nx/pull/35519))
- **nx-dev: short-circuit bot probes in framer rewrite edge function** ([PR #35527](https://github.com/nrwl/nx/pull/35527))
- **react: withSvgr migration preserves other properties** ([PR #35484](https://github.com/nrwl/nx/pull/35484))
- **testing: pin jest to ~30.3.0 to avoid jest-runtime 30.4 RN incompat** ([PR #35618](https://github.com/nrwl/nx/pull/35618))
- **testing: handle absolute cypress screenshotsFolder/videosFolder paths** ([PR #35624](https://github.com/nrwl/nx/pull/35624))
- **testing: exclude dist and out-tsc from default jest module path scan** ([PR #35619](https://github.com/nrwl/nx/pull/35619))
- **repo: revert deep-import rewrites that targeted v23-only @nx/devkit/internal entry** (ac8187963d) — 22.7.x rollback
- **repo: clear NX_INVOCATION_ROOT_PID in run-native-target to avoid recursion false-positive** (443dee0b22)
- **repo: expand "..." spread token in graph typecheck inputs** ([#35458](https://github.com/nrwl/nx/issues/35458))

### CLI 22.7.3 (2026-05-22)

Feature: **js: support pnpm 11.2.2** ([PR #35772](https://github.com/nrwl/nx/pull/35772)).

Fixes:
- **angular: only add @oxc-project/runtime on the vitest-analog path** ([PR #35734](https://github.com/nrwl/nx/pull/35734))
- **angular-rspack: exclude eslint config from tailwind v4 source scan** ([PR #35663](https://github.com/nrwl/nx/pull/35663))
- **core: warn before installing unknown npm packages as preset** ([PR #35644](https://github.com/nrwl/nx/pull/35644))
- **core: preserve input order in createNodes plugin results** ([PR #35595](https://github.com/nrwl/nx/pull/35595))
- **core: resolve local plugin subpath imports from source** ([PR #35631](https://github.com/nrwl/nx/pull/35631))
- **core: treat undefined task parallelism as parallel when scheduling** ([PR #35736](https://github.com/nrwl/nx/pull/35736))
- **core: handle object form of bin field in getPrettierPath** ([PR #35680](https://github.com/nrwl/nx/pull/35680))
- **core: detect vscode copilot ai agent** ([PR #35757](https://github.com/nrwl/nx/pull/35757))
- **core: allow local plugin subpath imports without custom conditions** ([PR #35751](https://github.com/nrwl/nx/pull/35751))
- **dotnet: include Directory.*.* files in inputs** ([PR #35738](https://github.com/nrwl/nx/pull/35738))
- **gradle: add transitive:true to all tasks** ([PR #35677](https://github.com/nrwl/nx/pull/35677))
- **gradle: pin generated e2e project toolchain to installed JDK** ([PR #35703](https://github.com/nrwl/nx/pull/35703))
- **js: fall back to npm publish when bun publish fails with auth error** ([PR #35756](https://github.com/nrwl/nx/pull/35756))
- **linter: improve convert-to-flat-config output fidelity** ([PR #35330](https://github.com/nrwl/nx/pull/35330))
- **linter: only rewrite workspace-package peer deps to workspace:*** ([PR #35423](https://github.com/nrwl/nx/pull/35423))
- **misc: stop inferring `projects: 'self'` in `dependsOn` entries** ([PR #35686](https://github.com/nrwl/nx/pull/35686))
- **misc: skip `$` escaping in file paths on windows** ([PR #35692](https://github.com/nrwl/nx/pull/35692))
- **rsbuild: infer build outputs from distPath.root directly** ([PR #35707](https://github.com/nrwl/nx/pull/35707))
- **testing: correct yargs-parser import in getJestProjectsAsync** ([PR #35672](https://github.com/nrwl/nx/pull/35672))
- **repo: run dotnet restore before publish** ([PR #35771](https://github.com/nrwl/nx/pull/35771))
- **repo: run dotnet restore before macos e2e job** ([PR #35774](https://github.com/nrwl/nx/pull/35774))

---

## Nx Cloud Releases (15)

| Version | Date | Highlights |
| ------- | ---- | ---------- |
| 2605.01.1 | May 1 | Fix: assignment-rules ordered by specificity, not definition order |
| 2605.04.6 | May 4 | Feat: unified CI config (`.nx/ci.yaml`) with `overrides` per run group; backward compatible with CLI flags |
| 2605.04.8 | May 4 | Fix: assignment rules in distribution config file now attach to run groups correctly |
| 2605.04.9 | May 4 | Fix: restore `.tar.gz` extension on artifact downloads from task details view (S3 instances) |
| 2605.05.9 | May 5 | Fix: hard-fail fix-ci when no AI token provider configured; always show enable-AI in org settings |
| 2605.05.11 | May 11 | Feat: CIPE configurations page redesign — Lifecycle/DTE/Agents/AI sections, config-origin visibility |
| 2605.07.1 | May 7 | Security: axios -> 1.16.0 (prototype pollution, CRLF/header/null-byte injection, SSRF, NO_PROXY bypass, XSRF leakage, DoS) |
| 2605.13.4 | May 13 | Feat: Self-Healing AI agent rewritten to avoid conflicts with existing CLI/agent installs; custom yarn registry support; fix: Self-Healing filters with leading `@` |
| 2605.13.16 | May 13 | Fix: stale GitHub token UX — users can refresh GitHub connection when connecting workspace |
| 2605.14.13 | May 14 | Feat: `nx-cloud validate sandbox-violations` CLI |
| 2605.14.14 | May 14 | Feat: CIPE sandbox-violation warning redesigned — collapsible disclosure, AI fix flow + manual `nx-cloud` workflow side-by-side |
| 2605.14.15 | May 14 | Feat: refreshed get-started page with paths for existing projects |
| 2605.19.8 | May 19 | Fix: agents could fail starting multiple continuous tasks in DTE |
| 2605.21.5 | May 21 | Feat: in-app "Create new Nx Workspace" flow retired; users directed to CLI + connect |
| 2605.21.8 | May 21 | Fix: enterprise usage screen date parsing (Safari CSV download, Firefox display) |

---

## Infrastructure (`nrwl/cloud-infrastructure`)

**185 human-authored commits** in the May 1-25 window (excluding `argocd-image-updater` and `Image Updater Action` automation). Grouped by theme:

### Partitioned / Dedicated Compute (~50 commits)

- **`gcp-partitioned-agents-cluster` Terraform module** created (Patrick, May 6)
- **`workflow-controller-downstream` Helm chart** created (Patrick, May 11)
- **Dedicated-compute YAML appset** + Deploy-Once YAML (Patrick, May 8)
- **Multi-subnet nodepools** in cluster (Patrick, May 8)
- **2 nodepools with ocean ORGID** enabled (Patrick, May 7)
- **Controller chart values** (Patrick, May 13); controller chart with downstream image updater (Patrick, May 15)
- **Single file per tenant** in dedicated compute (Patrick, May 14)
- **Cache:80 cache addr** + Cache registry + BuildKit TOML for registry build cache (Patrick, May 13-19)
- **`enforce=privileged`** default for dind pods (Patrick, May 13)
- **Allow communication within own namespace** (Patrick, May 13)
- **Remove name prefixes** in dedicated-compute (Patrick, May 13)
- **Pod template on controller for downstream configmap hash** (Patrick, May 22)
- **Nx-cloud-workflows daemonset** on tenant nodes (Patrick, May 22)
- **CloudArmor policies** for partitioned agent cluster (Patrick, May 22)
- **Up max nodes** for partitioned dev cluster (Patrick, May 21)
- **Ocean Snapshot Org -> Dedicated Compute** (Patrick, May 21)
- **Add ocean dev org to partitioned-tenants** (Patrick, May 21)
- **Production NA partitioned agent cluster** initial form (Steve, May 21)
- **ClusterSecretStore** for partitioned dev workflows (Patrick, May 11)
- **Enable GatewayAPI** on cluster (Patrick, May 11)
- **Workflow service address** + image references + downstream path + valkey configs (Patrick, May 15)
- **Topology spread** rules (Steve, May 12); **subchart names not too long** (Steve, May 12); **fixup appset so subcharts don't render if disabled** (Steve, May 12); **BALANCED locationpolicy** by default (Patrick, May 12)
- **Network policies**: deny cross namespace, enable by default (Steve, May 12); **net pol with monitoring ingress to tenant NS** (Steve, May 12)
- **Charts use the same single variables.yaml file** (Patrick, May 12, refactor)

### Production NA Workflows Regional Isolation (May 20)

- **Gateway + HTTPRoute for shared-tenant wf controller** in prod (Patrick, [feat])
- **External DNS Deployment for workflows-na** in prod (Patrick, [feat])
- **Facade HTTPRoute** in production (Patrick, [feat])
- **Facade deployment** prepped for dedicated cluster (Steve)
- **NA Workflows regional isolation** general infra (Patrick)
- **Workflow controller resource classes** aligned with staging in prod NA + EU (Altan, May 14)
- **Facade NA prod added to release script** (Patrick, May 21)

### Polygraph (~24 commits)

- **Polygraph deployment** in production (Steve, May 11)
- **New secrets for prod polygraph**, **IAM for public zone + new external-dns deployment**, **fix SA indentation**, **fix IAM bindings**, **fix references in dns** (Steve, May 11-12)
- **GitHub webhook secret + tie into ES** in dev/prod (Steve, Patrick, Mark, May 13)
- **GitHub app slug** + **GitHub app env vars** to api container in NA (Chau, May 13-16)
- **Polygraph app URL as global env** (Chau, May 15)
- **`POLYGRAPH_SIGNUP_ALLOW_TOKEN`** added (James, May 15) then moved to polygraph-only deployment (James, May 18)
- **Polygraph nx cloud mode + environment adjusted** (Chau, May 13)
- **Polygraph demo values** added to dev + prod (Steve, May 19) with subsequent yaml-quoting + missing-vars fixes
- **Enable polygraph demo** in snapshot (Chau, May 19) and production NA (Chau, May 20)
- **Restore github auth secret** (Steve, May 12, dev)

### Enterprise Customer Changes

- **RBC** (AWS):
  - SAML cert/entrypoint wired up (Steve, May 22)
  - `SAML_SCIM_JWT_SECRET` + `SAML_SESSION_MAX_AGE` set (Patrick, May 12)
- **CIBC** (Azure):
  - Sandboxing enabled (Patrick, May 5)
  - Iotrace daemonset added (Patrick, May 4); iotrace disabled (Patrick, May 4) — toggled during stabilization
  - Option 2 access control enabled (Rares, May 8)
- **Emeria**:
  - Enabled overall (Patrick, May 20)
  - Iotrace enabled (Patrick, May 20)
- **Skyscanner**:
  - Anthropic Token added (Patrick, May 14) — for Self-Healing CI
- **Island** (GCP enterprise):
  - nx-api replicas bumped to 10 (Altan, May 1)
  - Image bump reverted (Altan, May 24)
- **Azure enterprise (all)**:
  - FE pod limits bumped to match AWS/GCP (Patrick, May 4)
  - Iotrace permissions + repo imagepull + podLabels enabled (Patrick, May 4)
  - OTEL env for nx-api added (Patrick, May 21)
- **Azure enterprise tester**: iotrace enabled with new code (Patrick, Apr 30, May 4)
- **Azure (all)**: Ubuntu using quay mirrors (Patrick, May 7); OS SKU passed in for clusters (Patrick, May 5)

### Security

- **Mongo enterprise key rotation** — keys updated for AWS/GCP across multiple mongo scenarios (Steve, May 18 — 3 commits `security(mongo,enterprise,all)`)

### Sandboxing / IO-Tracing

- **iotrace** enabled / disabled / re-enabled across customers (CIBC, Emeria, Azure tester) — see Enterprise section
- **Sandboxing analytics dashboard** enabled in dev/staging (Rares, May 13)
- **ebpf-only classification for io-trace-daemon** — enable / disable / re-enable cycle in dev+staging (Rares, May 19-21, multiple revert+restore commits)
- **Fix iotracing repository name** in AWS enterprise (Patrick, May 20)

### Valkey

- **AWS Valkey** values for nx-cloud-frontend (Altan, May 23)
- **Valkey in Dedicated Workflows** (Patrick, May 11)
- **Valkey configs for dev controller** fixed (Patrick, May 15)
- **prod-na Valkey memory** doubled short-term (Altan, May 11) then reverted (Altan, May 11)
- **Bitnamicharts mirror to GCR** for dev (Patrick, May 12)

### Observability / Telemetry

- **OTEL env for nx-api** (enterprise Azure, all) (Patrick, May 21)
- **nx-api startup probes** in production NA + EU (Altan, May 22)
- **Linear token / team ID** added to nx-api in dev/staging/prod-na (Steve, Louie, May 21)
- **CLI metric uploads** enabled in production NA + EU (Rares, May 1) then `NX_CLOUD_CLI_METRIC_UPLOADS_ENABLED` toggle removed in dev/staging (Rares, May 13) and prod NA + EU (Rares, May 15) — full GA
- **Observability fix** for dedicated clusters (Patrick, May 19)
- **NX_CLOUD_ADD_ONS_ENABLED** on frontend (Louie, May 21)

### Operations / ArgoCD

- **ArgoCD dep repos in yaml**, **fixed secret for helm repo**, **add missing docker mirror config** (Steve, May 13-15)
- **Workflow controller cluster-wide rbac** ensured (Steve, May 5)
- **Production release script**: fixed (Patrick, May 21); facade NA prod added (Patrick, May 21)
- **`agent uploader image`** (Patrick, May 19)
- **Workflow controller can access cache bucket** in prod (Patrick, May 2); staging WF controller access to main cache bucket (Patrick, May 1)
- **Workflow controller metrics uploads** pointed at prod-na/prod-eu buckets (Rares, May 8)

### Other

- **Auto-update**: nx-cloud auto-sync enable/disable/rollback dance in dev (Altan, Rares, May 19)
- **2605.18.5 rollback**, then re-enable to 2605.19.3 (Rares, May 19)
- **Bump Production to 2605.14.16 reverted** (Altan, May 18)
- **NA Workflows isolation** general (Patrick, May 20)

---

## Linear Project Status

> Not collected this run — Linear MCP unauthenticated. **Recommend running this section manually** for a complete picture: open Linear's project list filtered to "Completed in May 2026" and "Updated in May 2026" across NXC, CLOUD, INF, NXA, Q, DOC teams.

### Active projects flagged via Notion-Linear search

- **Polygraph launch (June 23, 2026, Tier 1)** — Product messaging, microsite, GTM plan all signed off May 5-11
- **Polygraph standalone CLI + polygraph-mcp** — separately published repos
- **Partitioned/Dedicated Compute** — major infrastructure restructure in progress
- **Production NA Workflows regional isolation** — Gateway + HTTPRoute deployed May 20
- **Self-Healing CI enterprise monetization** — Q2 paid rollout (from April)
- **Sandboxing 10% self-serve KR** — from May 11 all-hands
- **Nx 23.0.0 GA** — 15 betas shipped in May
- **MF Realignment RFC** + **Angular Native Federation handoff** — internal coordination tasks observed in `dot_ai` May 20-21

### Notable: Square Enterprise Proof of Value (May 1) — DTE/Atomizer/Self-Healing showcase

### Notable: Hetzner CS check-in (May 12) — Self-Healing CI documentation request

### Notable: Discovery Call Polygraph & Monorepo Solutions (May 22) — Matheus

---

## Pylon Support Tickets

> Not collected this run — Pylon MCP unauthenticated. **Recommend running this section manually** for a complete picture, especially for ClickUp/Mimecast/Island/Codistica accounts that were active in April.

Signal pulled from infra commits + Notion: Skyscanner Self-Healing CI activated (Anthropic token added May 14); Emeria fully onboarded with iotrace (May 20); CIBC sandboxing enabled (May 5); Hetzner CS check-in surfaced Self-Healing CI doc gap.

---

## Blog Posts

- **[Postmortem: Nx Console v18.95.0 supply-chain compromise](https://nx.dev/blog/nx-console-v18-95-0-postmortem)** — Jack Hsu, 2026-05-21
  - VSCode-only compromise; CLI/Cloud unaffected; estimated impact revised from 28 to 6k-8k users; credible signal GitHub itself hit through one install; approval gates added to future Console releases
- **[Shift Left Isn't Working: Because We're Shifting the Wrong Thing](https://nx.dev/blog/shift-left-isnt-working)** — Josh VanAllen, 2026-05-07
  - Argues for encoding security/compliance/standards as inputs before development begins, especially in AI-agent-accelerated codegen workflows

---

## By the Numbers

| Metric | Count |
| ------ | ----- |
| CLI stable releases | 2 (22.7.2, 22.7.3) |
| CLI prereleases | 15 (23.0.0-beta.5 through beta.19) |
| Cloud changelog releases | 15 (2605.01.1 through 2605.21.8) |
| Infrastructure commits | 185 human-authored (`nrwl/cloud-infrastructure`) |
| Blog posts published | 2 |
| Linear issues completed | not collected (MCP unauthenticated) |
| Pylon support tickets | not collected (MCP unauthenticated) |

_Generated on 2026-05-25._
