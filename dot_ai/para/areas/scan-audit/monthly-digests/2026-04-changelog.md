# Nx Platform Changelog — April 2026

> **Sources:** Nx CLI GitHub releases (22.6.4, 22.6.5, 22.7.0, 21.6.11, 23.0.0-beta.0, 23.0.0-beta.1, plus 11 prereleases), Nx Cloud public changelog (22 versions, 2604.01.1 → 2604.28.1), nrwl/cloud-infrastructure (95 human commits), Linear (471 issues across NXC/CLOUD/INF/NXA/Q/DOC), Pylon (216 support tickets).

---

## Nx 22.7.0 Major Release (Apr 24)

### CLI

#### Features

- **core:** add .nx/self-healing to .gitignore ([#34855](https://github.com/nrwl/nx/pull/34855))
- **core:** decouple DB version from Nx version and share DB across worktrees ([#34942](https://github.com/nrwl/nx/pull/34942))
- **core:** auto-open browser for Cloud setup URL during create-nx-workspace ([#35014](https://github.com/nrwl/nx/pull/35014))
- **core:** allow generate command to skip project graph creation ([#35170](https://github.com/nrwl/nx/pull/35170))
- **core:** remove polygraph cloud passthrough ([#35153](https://github.com/nrwl/nx/pull/35153))
- **core:** use CNW variant 1 cloud prompt in nx init ([#35155](https://github.com/nrwl/nx/pull/35155))
- **core:** add source map annotations to nx show target ([#35225](https://github.com/nrwl/nx/pull/35225))
- **core:** prompt for setup mode when running nx init in empty git directory ([#35226](https://github.com/nrwl/nx/pull/35226))
- **core:** add json input type for selective JSON field hashing ([#35248](https://github.com/nrwl/nx/pull/35248))
- **core:** update nx-set-shas usage to v5 ([#34934](https://github.com/nrwl/nx/pull/34934))
- **core:** add NX_BAIL environment variable ([#34711](https://github.com/nrwl/nx/pull/34711))
- **core:** add page up/down to TUI shortcuts ([#34525](https://github.com/nrwl/nx/pull/34525))
- **core:** add logging and progress message types to daemon ([#35342](https://github.com/nrwl/nx/pull/35342))
- **dotnet:** add ci-workflow generator ([#33321](https://github.com/nrwl/nx/pull/33321))
- **js:** support `nx.sync.ignoredDependencies` in typescript-sync ([#35401](https://github.com/nrwl/nx/pull/35401))
- **misc:** A/B test cloud prompt copy in create-nx-workspace ([#35039](https://github.com/nrwl/nx/pull/35039))
- **misc:** update nx init telemetry meta from CSV to JSON format ([#35076](https://github.com/nrwl/nx/pull/35076))
- **misc:** lock in CNW cloud prompt A/B winner and add new variants ([#35154](https://github.com/nrwl/nx/pull/35154))
- **nx-dev:** add conditional blog/changelog proxy in edge function ([#35043](https://github.com/nrwl/nx/pull/35043))
- **nx-dev:** add nx-blog sitemap to root sitemap index ([#35363](https://github.com/nrwl/nx/pull/35363))
- **vite:** add compiler option to vite plugin for tsgo support ([#35429](https://github.com/nrwl/nx/pull/35429))

#### Fixes

(See full release body — 200+ fixes; highlights below)

- **core:** properly quote shell metacharacters in CLI args passed to tasks ([#34491](https://github.com/nrwl/nx/pull/34491))
- **core:** prevent DB corruption from concurrent initialization ([#34861](https://github.com/nrwl/nx/pull/34861))
- **core:** set `windowsHide: true` on all child process spawns ([#34894](https://github.com/nrwl/nx/pull/34894))
- **core:** prevent TUI crash when task output arrives after completion ([#34785](https://github.com/nrwl/nx/pull/34785))
- **core:** respect `--parallel` limit for discrete task concurrency ([#34721](https://github.com/nrwl/nx/pull/34721))
- **core:** use upsert to prevent FK constraint violations in task DB ([#34977](https://github.com/nrwl/nx/pull/34977))
- **core:** add timeouts to GitHub push flow to prevent CLI hangs ([#35011](https://github.com/nrwl/nx/pull/35011))
- **core:** prevent nx watch infinite loop from overly broad output globs ([#34995](https://github.com/nrwl/nx/pull/34995))
- **core:** bump axios to 1.13.5 to resolve CVE-2026-25639 ([#35148](https://github.com/nrwl/nx/pull/35148))
- **core:** update and pin ejs to 5.0.1 ([#35157](https://github.com/nrwl/nx/pull/35157))
- **core:** replace LGPL-licensed @ltd/j-toml with BSD-3-Clause smol-toml ([#35188](https://github.com/nrwl/nx/pull/35188))
- **core:** supply chain hardening via transitive dependency pinning ([#35159](https://github.com/nrwl/nx/pull/35159))
- **core:** kill discrete tasks and use tree-kill for batch cleanup on SIGINT ([#35175](https://github.com/nrwl/nx/pull/35175))
- **core:** support cross-file variable references in `.env` files ([#34956](https://github.com/nrwl/nx/pull/34956))
- **core:** disable Yarn scripts for temp `nx@latest` installs ([#35210](https://github.com/nrwl/nx/pull/35210))
- **core:** prevent phantom connections and dead polling in plugin workers ([#34823](https://github.com/nrwl/nx/pull/34823))
- **core:** replace exec() with spawn() to prevent maxBuffer crash on large command output ([#35256](https://github.com/nrwl/nx/pull/35256))
- **core:** support pnpm multi-document lockfiles ([#35271](https://github.com/nrwl/nx/pull/35271))
- **core:** resolve native binary crash on aarch64 linux with 16K/64K page kernels ([#35356](https://github.com/nrwl/nx/pull/35356))
- **angular:** preserve specific file paths in tsconfig when adding secondary entry point ([#35254](https://github.com/nrwl/nx/pull/35254))
- **angular-rspack:** normalize Windows path separators for i18n ([#35252](https://github.com/nrwl/nx/pull/35252))
- **angular-rspack:** add fileReplacements to resolve.alias ([#34197](https://github.com/nrwl/nx/pull/34197))
- **angular-rspack:** fix HMR issues ([#35294](https://github.com/nrwl/nx/pull/35294))
- **bundling:** bump esbuild for new projects to a version compatible with vite 8 ([#35132](https://github.com/nrwl/nx/pull/35132))
- **bundling:** declare tsconfig.json as input for esbuild targets ([#35432](https://github.com/nrwl/nx/pull/35432))
- **gradle:** prevent Gradle and Maven daemon accumulation during project graph recalculation ([#35143](https://github.com/nrwl/nx/pull/35143))
- **gradle:** ignore test enums when atomizing ([#34974](https://github.com/nrwl/nx/pull/34974))
- **gradle:** detect @Input provider-based dependencies ([#35090](https://github.com/nrwl/nx/pull/35090))
- **gradle:** recognize Kotlin compile tasks in inferred input extensions ([#35335](https://github.com/nrwl/nx/pull/35335))
- **js:** force Vite 7 when using React Router in framework mode ([#35101](https://github.com/nrwl/nx/pull/35101)) and **react:** support Vite 8 for React Router apps ([#35365](https://github.com/nrwl/nx/pull/35365))
- **js:** narrow tsc build-base outputs to only tsc-produced file types ([#35041](https://github.com/nrwl/nx/pull/35041))
- **js:** include npm overrides in generated lockfile ([#35192](https://github.com/nrwl/nx/pull/35192))
- **js:** stop generating baseUrl in tsconfig, use `./` prefix for path mappings ([#34965](https://github.com/nrwl/nx/pull/34965))
- **js:** add npm workspace support to prune-lockfile executor ([#35383](https://github.com/nrwl/nx/pull/35383))
- **linter:** convert project-level eslint configs and log when skipped ([#34899](https://github.com/nrwl/nx/pull/34899))
- **linter:** prepend framework configs before baseConfig in flat config generation ([#34898](https://github.com/nrwl/nx/pull/34898))
- **linter:** infer extended tsconfig files as task inputs ([#35190](https://github.com/nrwl/nx/pull/35190))
- **maven:** prevent batch executor hang from premature worker exit ([#35001](https://github.com/nrwl/nx/pull/35001))
- **maven:** make install targets noop when `maven.install.skip=true` ([#35009](https://github.com/nrwl/nx/pull/35009))
- **maven:** honor settings.xml in Maven 3 batch runner ([#35216](https://github.com/nrwl/nx/pull/35216))
- **module-federation:** enable ESM output for Angular rspack MF plugin ([#34839](https://github.com/nrwl/nx/pull/34839))
- **vite:** add support for Vite 8 ([#34850](https://github.com/nrwl/nx/pull/34850))
- **vitest:** add dependent task output files as inputs for vitest test targets ([#35242](https://github.com/nrwl/nx/pull/35242))
- **vitest:** infer ancestor tsconfig files as test task inputs ([#35241](https://github.com/nrwl/nx/pull/35241))
- **release:** surface swallowed publish errors when stdout is not valid JSON ([#35283](https://github.com/nrwl/nx/pull/35283))
- **release:** apply preid to dependent patch bumps ([#35381](https://github.com/nrwl/nx/pull/35381))
- **webpack:** bump postcss-loader to ^8.2.1 to eliminate transitive yaml@1.x CVE ([#35028](https://github.com/nrwl/nx/pull/35028))
- **misc:** bump axios to 1.15.0 for all packages ([#35237](https://github.com/nrwl/nx/pull/35237))

### Linear

- [NXC-3520](https://linear.app/nxdev/issue/NXC-3520) — Migrate the Nx repo to ESLint v10
- [NXC-3647](https://linear.app/nxdev/issue/NXC-3647) — Add support for Yarn Catalogs
- [NXC-3663](https://linear.app/nxdev/issue/NXC-3663) — Update ts-morph to v27
- [NXC-3478](https://linear.app/nxdev/issue/NXC-3478) — `nx migrate --run-migrations` fails with huge stacktrace if no migrations.json present
- [NXC-3923](https://linear.app/nxdev/issue/NXC-3923) — package.json plugin nodes fail to merge with command shorthand
- [NXC-3996](https://linear.app/nxdev/issue/NXC-3996) — `@nx/next` server executor: prevent full monorepo scan in `readTsConfigPaths` (Fivetran-reported)
- [NXC-4205](https://linear.app/nxdev/issue/NXC-4205) — Plugin workers fail to start in Nx 22.6.x
- [NXC-4309](https://linear.app/nxdev/issue/NXC-4309) — `run-many` crashes with Buffer-to-String conversion error
- [NXC-3748](https://linear.app/nxdev/issue/NXC-3748) — Implement spread operator (`...`) for Nx task config arrays

---

## Nx 22.6.5 (Apr 10) — Patch

Subset of 22.7.0 work backported. Highlights:

- **core:** bump axios to 1.13.5 (CVE-2026-25639) ([#35148](https://github.com/nrwl/nx/pull/35148))
- **core:** replace LGPL-licensed @ltd/j-toml with smol-toml ([#35188](https://github.com/nrwl/nx/pull/35188))
- **core:** prevent phantom connections in plugin workers ([#34823](https://github.com/nrwl/nx/pull/34823))
- **core:** support cross-file variable references in `.env` files ([#34956](https://github.com/nrwl/nx/pull/34956))
- **core:** kill discrete tasks and use tree-kill for batch cleanup on SIGINT ([#35175](https://github.com/nrwl/nx/pull/35175))
- **gradle:** prevent Gradle and Maven daemon accumulation during project graph recalculation ([#35143](https://github.com/nrwl/nx/pull/35143))
- **maven:** prevent batch executor hang from premature worker exit ([#35001](https://github.com/nrwl/nx/pull/35001))
- **misc:** lock in CNW cloud prompt A/B winner and add new variants ([#35154](https://github.com/nrwl/nx/pull/35154))

## Nx 22.6.4 (Apr 1) — Patch

- **misc:** update nx init telemetry meta from CSV to JSON ([#35076](https://github.com/nrwl/nx/pull/35076))
- **nx-dev:** add conditional blog/changelog proxy in edge function ([#35043](https://github.com/nrwl/nx/pull/35043))
- **react:** force Vite 7 when using React Router in framework mode ([#35101](https://github.com/nrwl/nx/pull/35101))
- **vite:** update vitest and plugin-react-swc versions for Vite 8 compat ([#35062](https://github.com/nrwl/nx/pull/35062))
- **webpack:** bump postcss-loader to ^8.2.1 (yaml@1.x CVE) ([#35028](https://github.com/nrwl/nx/pull/35028))

## Nx 21.6.11 (Apr 17) — LTS Patch

- **linter:** handle various flat config override structures ([#33548](https://github.com/nrwl/nx/pull/33548))
- **linter:** handle variable references in replaceOverride ([#34026](https://github.com/nrwl/nx/pull/34026))

## Nx 23.0.0-beta.0 (Apr 24)

- **core:** add support for `'...'` as a spread token when merging target config ([#34285](https://github.com/nrwl/nx/pull/34285))
- **core:** remove redundant `allWorkspaceFiles` from the project graph pipeline ([#34425](https://github.com/nrwl/nx/pull/34425))

## Nx 23.0.0-beta.1 (Apr 27)

- **core:** prevent spinner flicker when sync applying ([#35445](https://github.com/nrwl/nx/pull/35445))
- **core:** provide actionable feedback when running migrations and pre-install fails with npm peer dep errors ([#33961](https://github.com/nrwl/nx/pull/33961))
- **core:** consider virtual trees in `multiGlobWithWorkspaceContext` ([#35447](https://github.com/nrwl/nx/pull/35447))
- **core:** surface `./nx --version` stderr and force devDeps install ([#35469](https://github.com/nrwl/nx/pull/35469))
- **detox:** generate valid JSON in `.detoxrc` for non-expo apps
- **js:** include extended tsconfigs from project references in typecheck inputs ([#35457](https://github.com/nrwl/nx/pull/35457))
- **linter:** detect root lint target added in same generator run ([#35296](https://github.com/nrwl/nx/pull/35296))
- **testing:** convert executor-based jest.config.ts and preserve type-only imports ([#35286](https://github.com/nrwl/nx/pull/35286))

---

## Self-Healing CI

### Cloud (changelog)

- **2604.02.3** — Strip Git trailers from rerun commit messages (no more mis-attributing reruns to original committer)
- **2604.17.1** — Agents support `no-output-timeout` (default 10m, configurable via env / config / CLI flag); fix-ci can now continue even when SHAs are resolvable locally after git fetch >2min (large-repo fix)
- **2604.17.2** — New workspace setting to disable CI pipeline execution comments in PRs
- **2604.22.13** — `nx-cloud start-ci-run --distribute-on <file-path>` now reads file directly with `nx-cloud` runner instead of fetching from GitHub

### Linear

- [NXA-1009](https://linear.app/nxdev/issue/NXA-1009) — Make enterprise clients pay for self-healing
- [NXA-1106](https://linear.app/nxdev/issue/NXA-1106) — Ensure all existing enterprises have been informed of paying for self-healing from Q2 onwards
- [NXA-1103](https://linear.app/nxdev/issue/NXA-1103) — Self-serve adoption: create email campaign
- [NXA-717](https://linear.app/nxdev/issue/NXA-717) — Ensure classification only does classification, not fixes
- [NXA-764](https://linear.app/nxdev/issue/NXA-764) — Diff shows unintended Kotlin changes after verification update
- [NXA-1188](https://linear.app/nxdev/issue/NXA-1188) — Remote task summary outputs include unrelated formatting suggestions
- [NXA-1205](https://linear.app/nxdev/issue/NXA-1205) — Self-healing can revert unrelated PR changes
- [NXA-1350](https://linear.app/nxdev/issue/NXA-1350) — Authentication errors do not cause early exit and ultimately timeout with no user feedback
- [NXA-1161](https://linear.app/nxdev/issue/NXA-1161) — Continue flow is broken
- [NXA-1166](https://linear.app/nxdev/issue/NXA-1166) — Show loading spinner for slow self-healing overview filters
- [NXA-1307](https://linear.app/nxdev/issue/NXA-1307) — Add ability to disable GitHub comment per workspace
- [NXA-1309](https://linear.app/nxdev/issue/NXA-1309) — Add a timestamp tooltip for date ranges

### Pylon (Customer-escalated)

- **Pylon #784 (ClickUp)** — Self-Healing CI Fails to Fetch Commits After Update (High, on hold). Late-month regression; better debug logs now in error message; investigation ongoing.
- **Pylon #758 (Mimecast)** — Cache hit rate drop to 4% (Medium, waiting on us). Possibly related to recent caching changes.
- **Pylon #683 (fairsdotcom consumer)** — Billing dispute, $344 over Self-Healing CI being default-on after `nx connect` scaffolds `npx nx fix-ci` (Closed). Cites US/EU dark-pattern law.
- **Pylon #719 (Codistica)** — 300%+ cost increase complaint (Closed)
- **Pylon #602** — Self-healing comments missing during agent installation (on hold)
- **Pylon #636 (consumer)** — Disabling self-healing due to perceived low value
- **Pylon #602** — Missing self-healing comments during agent installation
- **Pylon #738** — Self-healing CI status update

---

## Polygraph Standalone (102 issues completed)

### Linear

**CLI / API**:

- [NXA-1137](https://linear.app/nxdev/issue/NXA-1137) — Polygraph "Polyr" standalone CLI
- [NXA-1145](https://linear.app/nxdev/issue/NXA-1145) — Publish polygraph claude plugin without `nx` naming
- [NXA-1304](https://linear.app/nxdev/issue/NXA-1304) — Make polygraph CLI work with Codex
- [NXA-1287](https://linear.app/nxdev/issue/NXA-1287) — Generalize agent launching to opencode & claude
- [NXA-1212](https://linear.app/nxdev/issue/NXA-1212) — Create `polygraph-cli repo show` command
- [NXA-1324](https://linear.app/nxdev/issue/NXA-1324) — Add `agent list` command
- [NXA-1281](https://linear.app/nxdev/issue/NXA-1281) — Implement `auth select` / multiple URL handling
- [NXA-1331](https://linear.app/nxdev/issue/NXA-1331) — `polygraph account select` expects org ID, not name
- [NXA-1305](https://linear.app/nxdev/issue/NXA-1305) — Build out delegation / PR creation in polygraph CLI
- [NXA-1213](https://linear.app/nxdev/issue/NXA-1213) — Align session ID generation
- [NXA-1207](https://linear.app/nxdev/issue/NXA-1207) — Add max length validation to session IDs
- [NXA-1257](https://linear.app/nxdev/issue/NXA-1257) — Postfix session IDs with a unique value
- [NXA-1175](https://linear.app/nxdev/issue/NXA-1175) — Implement correct resumability
- [NXA-1334](https://linear.app/nxdev/issue/NXA-1334) — Session resume does not work in Polygraph standalone
- [NXA-1282](https://linear.app/nxdev/issue/NXA-1282) — Make it resumable
- [NXA-1339](https://linear.app/nxdev/issue/NXA-1339) — Decouple child agent process lifetime from CLI lifetime
- [NXA-1226](https://linear.app/nxdev/issue/NXA-1226) — Migrate get-ci-logs endpoint to new API
- [NXA-1227](https://linear.app/nxdev/issue/NXA-1227) — Refactor polygraph handlers to be in polygraph bundle
- [NXA-1225](https://linear.app/nxdev/issue/NXA-1225) — Migrate polygraph bundle to use new API
- [NXA-1169](https://linear.app/nxdev/issue/NXA-1169) — Rework MCP to use new CLI, fix symmetric cases
- [NXA-1214](https://linear.app/nxdev/issue/NXA-1214) — Rewrite skills to work with new CLI & MCP
- [NXA-1320](https://linear.app/nxdev/issue/NXA-1320) — Integrate repo graph into session initialization
- [NXA-1321](https://linear.app/nxdev/issue/NXA-1321) — Integrate repo graph into CLI commands
- [NXA-1329](https://linear.app/nxdev/issue/NXA-1329) — Integrate repo graph visualisation into CLI
- [NXA-1330](https://linear.app/nxdev/issue/NXA-1330) — Move child logs from `.nx/` into polygraph session folder
- [NXA-1284](https://linear.app/nxdev/issue/NXA-1284) — Switch to installing Claude plugin globally on session start
- [NXA-1303](https://linear.app/nxdev/issue/NXA-1303) — Cannot add repository to an existing session
- [NXA-1373](https://linear.app/nxdev/issue/NXA-1373) — Allow filtering sessions by any involved repo
- [NXA-1379](https://linear.app/nxdev/issue/NXA-1379) — Polygraph cannot mark PRs ready for review
- [NXA-1245](https://linear.app/nxdev/issue/NXA-1245) — GitHub comment posting shows Nx Cloud descriptions
- [NXA-1249](https://linear.app/nxdev/issue/NXA-1249) — GitHub comment should only point to session URL
- [NXA-1347](https://linear.app/nxdev/issue/NXA-1347) — Associate PR is called with the wrong URL
- [NXA-1362](https://linear.app/nxdev/issue/NXA-1362) — Polygraph PR label should not start with `nx-cloud-`

**UI / Frontend**:

- [NXA-1314](https://linear.app/nxdev/issue/NXA-1314) — Layout updates / breadcrumbs
- [NXA-1239](https://linear.app/nxdev/issue/NXA-1239) — Improve error boundary styling on existing screens
- [NXA-1264](https://linear.app/nxdev/issue/NXA-1264) — Improve organization dropdown styling
- [NXA-1265](https://linear.app/nxdev/issue/NXA-1265) — Improve repositories list styling
- [NXA-1283](https://linear.app/nxdev/issue/NXA-1283) — Organizations row text length issue
- [NXA-1261](https://linear.app/nxdev/issue/NXA-1261) — Improve user profile UI
- [NXA-1356](https://linear.app/nxdev/issue/NXA-1356) — UI: agent-sessions screen rework
- [NXA-1355](https://linear.app/nxdev/issue/NXA-1355) — UI Refresh: User profile
- [NXA-1342](https://linear.app/nxdev/issue/NXA-1342) — Fix styling on app page for CLI login
- [NXA-1344](https://linear.app/nxdev/issue/NXA-1344) — Polish polygraph login UI
- [NXA-1183](https://linear.app/nxdev/issue/NXA-1183) — Migrate existing polygraph screens to shared libs
- [NXA-1186](https://linear.app/nxdev/issue/NXA-1186) — Support dark mode and decide on theming for new app
- [NXA-1376](https://linear.app/nxdev/issue/NXA-1376) — Auth callback error screen looks wonky
- [NXA-1351](https://linear.app/nxdev/issue/NXA-1351) — Truncated branch name on indexing workflow screen
- [NXA-1370](https://linear.app/nxdev/issue/NXA-1370) — Emphasize filtered initiating repo more strongly
- [NXA-1372](https://linear.app/nxdev/issue/NXA-1372) — Author filter dropdown should not use name as key
- [NXA-1349](https://linear.app/nxdev/issue/NXA-1349) — Display packages being published and consumed by nodes (graph)
- [NXA-1345](https://linear.app/nxdev/issue/NXA-1345) — Links between graph nodes are missing
- [NXA-1313](https://linear.app/nxdev/issue/NXA-1313) — Improve active sessions sidebar content
- [NXA-1240](https://linear.app/nxdev/issue/NXA-1240) — Sidebar gets scrolled off the screen
- [NXA-1263](https://linear.app/nxdev/issue/NXA-1263) — Sidebar sessions view is empty for new users
- [NXA-1256](https://linear.app/nxdev/issue/NXA-1256) — Sidebar icon does nothing on org select screen

**Auth / Onboarding**:

- [NXA-1286](https://linear.app/nxdev/issue/NXA-1286) — Add github oauth for polygraph `private-enterprise` mode
- [NXA-1365](https://linear.app/nxdev/issue/NXA-1365) — Block sign ups, but add bypass token
- [NXA-1258](https://linear.app/nxdev/issue/NXA-1258) — Handles access for personal repos
- [NXA-1259](https://linear.app/nxdev/issue/NXA-1259) — Ability to remove VCS connection
- [NXA-1260](https://linear.app/nxdev/issue/NXA-1260) — Organizations can connect another user's personal account
- [NXA-1234](https://linear.app/nxdev/issue/NXA-1234) — Investigate personal GitHub account connection flow
- [NXA-1233](https://linear.app/nxdev/issue/NXA-1233) — GitHub app uninstall leaves org connection UI inconsistent
- [NXA-1184](https://linear.app/nxdev/issue/NXA-1184) — Add onboarding of new organizations and repositories
- [NXA-1185](https://linear.app/nxdev/issue/NXA-1185) — Prompt user to connect VCS account if not added
- [NXA-1215](https://linear.app/nxdev/issue/NXA-1215) — Polish and harden onboarding UIs
- [NXA-1217](https://linear.app/nxdev/issue/NXA-1217) — Polish onboarding UI

**Misc / Bugs / Models**:

- [NXA-1193](https://linear.app/nxdev/issue/NXA-1193) — Rework Polygraph models with Step/StepBlob
- [NXA-1171](https://linear.app/nxdev/issue/NXA-1171) — Making shared libs from current nx-cloud remix
- [NXA-1228](https://linear.app/nxdev/issue/NXA-1228) — Separate polygraph credential storage from nx-cloud
- [NXA-1210](https://linear.app/nxdev/issue/NXA-1210) — MWorkflows data model split
- [NXA-1218](https://linear.app/nxdev/issue/NXA-1218) — Add `vcsAccount.source NX_CLOUD` check to nx-cloud code that queries for `vcsAccounts`
- [NXA-1248](https://linear.app/nxdev/issue/NXA-1248) — Agent logs are not uploaded in sessions
- [NXA-1250](https://linear.app/nxdev/issue/NXA-1250) — PR statuses do not update
- [NXA-1253](https://linear.app/nxdev/issue/NXA-1253) — PR CI status not showing up in created PRs
- [NXA-1242](https://linear.app/nxdev/issue/NXA-1242) — Completing session redirects to "Could not load organizations" screen
- [NXA-1291](https://linear.app/nxdev/issue/NXA-1291) — Session list still prompts for permissions
- [NXA-1292](https://linear.app/nxdev/issue/NXA-1292) — Subagent permissions are being denied in Polygraph Standalone
- [NXA-1297](https://linear.app/nxdev/issue/NXA-1297) — Resume Session shows incorrect resume command
- [NXA-1290](https://linear.app/nxdev/issue/NXA-1290) — CLI repository selector omits some repositories
- [NXA-1340](https://linear.app/nxdev/issue/NXA-1340) — Base route is throwing a 500 on snapshot
- [NXA-1219](https://linear.app/nxdev/issue/NXA-1219) — Add filtering to repo selection
- [NXA-1230](https://linear.app/nxdev/issue/NXA-1230) — Update polygraph-cli help text and default URL
- [NXA-992](https://linear.app/nxdev/issue/NXA-992) — Explore IDE Integrations for Polygraph
- [NXA-1262](https://linear.app/nxdev/issue/NXA-1262) — Investigate Cursor 3 extensibility for Polygraph sessions
- [NXA-1241](https://linear.app/nxdev/issue/NXA-1241) — Configure workflows / create repo graph

**Security**:

- [NXA-1220](https://linear.app/nxdev/issue/NXA-1220) — Vulnerability CRITICAL [10.0] - Polygraph Frontend
- [NXA-1221](https://linear.app/nxdev/issue/NXA-1221) — Vulnerability CRITICAL [9.8] - Polygraph Frontend
- [NXA-1222](https://linear.app/nxdev/issue/NXA-1222) — Vulnerability CRITICAL [9.8] - Polygraph Frontend
- [NXA-1223](https://linear.app/nxdev/issue/NXA-1223) — Vulnerability CRITICAL [9.8] - Polygraph Frontend

### Infrastructure

- [INF-1311](https://linear.app/nxdev/issue/INF-1311) — Update polygraph-github-secrets PRIVATE_KEY
- [INF-1312](https://linear.app/nxdev/issue/INF-1312) — Route `/polygraph` to Nx API like `/nx-cloud`
- [INF-1329](https://linear.app/nxdev/issue/INF-1329) — Add OAuth env vars for Snapshot Polygraph (different from existing GitHub App)
- [INF-1336](https://linear.app/nxdev/issue/INF-1336) — Fix push of polygraph image to AWS mirror base
- Cloud-infra commits: `add NX_CLOUD_APP_URL for polygraph` (Jonathan Cammisuli, 04-08), `deploy polygraph with new gh auth` (Steve, 04-14), `prep secrets` (Steve, 04-14), `nx api internal base url value for polygraph frontend` (Chau, 04-02), `add polygraph github app id env vars to snapshot api side` (Chau, 04-01), `ensure polygraph images can push to aws base registry` (Steve, 04-23), `/polygraph/private to backend-not-found` (Szymon, 04-02)

---

## Onboarding & CNW Funnel

### CLI

- [NXC-4262](https://linear.app/nxdev/issue/NXC-4262) — Set up more telemetry to fix bugs
- [NXC-4336](https://linear.app/nxdev/issue/NXC-4336) — Lock in A/B testing results and update init
- [NXC-4189](https://linear.app/nxdev/issue/NXC-4189) — Add Cloud prompt to `nx init` using CNW variant 1 copy
- [NXC-4190](https://linear.app/nxdev/issue/NXC-4190) — CNW: Lock in variant 1 as new baseline, design two new A/B variants
- [NXC-3983](https://linear.app/nxdev/issue/NXC-3983) — `nx init` in empty git dir should prompt for setup mode

### Cloud

- **2604.01.1** — Add remediation steps for onboarding CLI errors; fix `CLAUDECODE=1` causing premature termination
- **2604.10.8** — Fix GitHub logo not visible in dark mode on connect-workspace page
- **2604.23.1** — Upgraded GitHub + GitLab connect flows: auto-detect Nx workspace, auto-create PR with Nx Cloud config
- **2604.24.8** — Fix `nx-cloud onboard` failures against public GitHub (OAuth was hitting `api.github.com` instead of `github.com`)
- **2604.28.1** — On-prem and Single Tenant customers can connect repos via Nx Cloud GitHub App

### Cloud (Linear)

- [CLOUD-3954](https://linear.app/nxdev/issue/CLOUD-3954) — Build one-page manual flow
- [CLOUD-4115](https://linear.app/nxdev/issue/CLOUD-4115) — Cancel and go back doesn't return to one-page
- [CLOUD-4368](https://linear.app/nxdev/issue/CLOUD-4368) — When user chooses "maybe" for cloud in CNW, they still see "Finish setup" link
- [CLOUD-4367](https://linear.app/nxdev/issue/CLOUD-4367) — When user chooses "yes" for cloud, they must complete setup to continue
- [CLOUD-4369](https://linear.app/nxdev/issue/CLOUD-4369) — Re-enable CNW variant with cloud prompt yes/maybe/no
- [CLOUD-4410](https://linear.app/nxdev/issue/CLOUD-4410) — Show PR link after `nx connect` onboarding
- [CLOUD-4413](https://linear.app/nxdev/issue/CLOUD-4413) — Fix enterprise trial form for self-served trials
- [CLOUD-4399](https://linear.app/nxdev/issue/CLOUD-4399) — Setting `CLAUDECODE=1` breaks Nx Cloud onboarding flow
- [CLOUD-4402](https://linear.app/nxdev/issue/CLOUD-4402) — Missing guidance when GitHub app lacks permissions
- [CLOUD-4371](https://linear.app/nxdev/issue/CLOUD-4371) — New Auth0 signups can block verification resend
- [CLOUD-4415](https://linear.app/nxdev/issue/CLOUD-4415) — Get started view updates
- [CLOUD-4445](https://linear.app/nxdev/issue/CLOUD-4445) — Plan selection screen changes trigger unnecessary reviews
- [CLOUD-4440](https://linear.app/nxdev/issue/CLOUD-4440) — Replace get-started cover image
- [CLOUD-4466](https://linear.app/nxdev/issue/CLOUD-4466) — Cloud onboard command broken due to GitHub URL regression
- [CLOUD-4473](https://linear.app/nxdev/issue/CLOUD-4473) — Re-add GitHub API URL override in app flow
- [CLOUD-4396](https://linear.app/nxdev/issue/CLOUD-4396) — Verify Jarmo email to fix redirect loop

---

## Task Sandboxing & Hermetic Builds

### CLI

40+ violation fixes during the month — partial list below; see Linear:

- [NXC-4173](https://linear.app/nxdev/issue/NXC-4173) — Investigate tsc targets on the nx repo
- [NXC-4122](https://linear.app/nxdev/issue/NXC-4122) — Investigate nx-examples e2e tasks
- [NXC-4256](https://linear.app/nxdev/issue/NXC-4256) — Fix unit tests to read from mocked filesystem instead of workspace
- [NXC-4255](https://linear.app/nxdev/issue/NXC-4255) — `@nx/devkit` is missing dependencies or incorrectly using js and vite
- [NXC-4310](https://linear.app/nxdev/issue/NXC-4310) — Esbuild executor reads tsconfig.json unexpectedly
- [NXC-4233](https://linear.app/nxdev/issue/NXC-4233) — `storybook:test` reads from jest template files unexpectedly
- [NXC-4232](https://linear.app/nxdev/issue/NXC-4232) — Playwright is reading `tsconfig.json`
- [NXC-4242](https://linear.app/nxdev/issue/NXC-4242) — `rollup:test` writes unexpected files in workspace root
- [NXC-4241](https://linear.app/nxdev/issue/NXC-4241) — Inferred jest inputs miss `dependentTasksOutputs` glob
- [NXC-4068](https://linear.app/nxdev/issue/NXC-4068), [NXC-4200](https://linear.app/nxdev/issue/NXC-4200), [NXC-4202](https://linear.app/nxdev/issue/NXC-4202), [NXC-4077](https://linear.app/nxdev/issue/NXC-4077), [NXC-4187](https://linear.app/nxdev/issue/NXC-4187) — Custom hashers / `nx show target` cleanup
- [NXC-4226](https://linear.app/nxdev/issue/NXC-4226) — Double check eslint executor inputs after removing custom hasher
- [NXC-4196](https://linear.app/nxdev/issue/NXC-4196), [NXC-4201](https://linear.app/nxdev/issue/NXC-4201), [NXC-4192](https://linear.app/nxdev/issue/NXC-4192) — eslint plugin tsconfig chain inputs
- [NXC-4216](https://linear.app/nxdev/issue/NXC-4216) — Angular test tasks miss `.template` file inputs
- [NXC-4214](https://linear.app/nxdev/issue/NXC-4214), [NXC-4217](https://linear.app/nxdev/issue/NXC-4217), [NXC-4218](https://linear.app/nxdev/issue/NXC-4218) — Build tasks miss inputs for readme-fragments, prettierignore, vale-changed.mjs
- [NXC-4219](https://linear.app/nxdev/issue/NXC-4219) — `dotnet:build-analyzer` misses `run-native-target` script input
- [NXC-4222](https://linear.app/nxdev/issue/NXC-4222) — Nx repo rspack example builds need dependent task outputs
- [NXC-4231](https://linear.app/nxdev/issue/NXC-4231) — `angular-rspack:test` has unexpected reads
- [NXC-4229](https://linear.app/nxdev/issue/NXC-4229), [NXC-4230](https://linear.app/nxdev/issue/NXC-4230), [NXC-4235](https://linear.app/nxdev/issue/NXC-4235) — nx-dev:test, next:build outputs, populate-local-registry violations
- [NXC-4193](https://linear.app/nxdev/issue/NXC-4193) — Look at lint-native targets with violations
- [NXC-4259](https://linear.app/nxdev/issue/NXC-4259) — `create-embeddings` does not have .d.mts inputs and outputs
- [NXC-4260](https://linear.app/nxdev/issue/NXC-4260) — `astro-docs:format` reads `.editorconfig`
- [NXC-4319](https://linear.app/nxdev/issue/NXC-4319), [NXC-4320](https://linear.app/nxdev/issue/NXC-4320), [NXC-4323](https://linear.app/nxdev/issue/NXC-4323), [NXC-4349](https://linear.app/nxdev/issue/NXC-4349) — astro-docs sandbox cleanup batch
- [NXC-4345](https://linear.app/nxdev/issue/NXC-4345)…[NXC-4348](https://linear.app/nxdev/issue/NXC-4348) — graph-* typecheck violations
- [NXC-4261](https://linear.app/nxdev/issue/NXC-4261) — graph-client:typecheck reads .ts and .buildinfo
- [NXC-4340](https://linear.app/nxdev/issue/NXC-4340) — Update tsc sync generator to allow skipping deps
- [NXC-4215](https://linear.app/nxdev/issue/NXC-4215) — esbuild reads root tsconfig.json during angular-rspack-compiler:test
- [NXC-4228](https://linear.app/nxdev/issue/NXC-4228) — Validating links does not expect .html files in outputs of dependent tasks
- [NXC-4183](https://linear.app/nxdev/issue/NXC-4183), [NXC-4184](https://linear.app/nxdev/issue/NXC-4184), [NXC-4186](https://linear.app/nxdev/issue/NXC-4186) — Misc lint, pnpm-lock, nx-dev-e2e violation cleanup
- [NXC-4239](https://linear.app/nxdev/issue/NXC-4239) — Exclude populate-local-registry-storage from sandbox I/O checks
- [NXC-4062](https://linear.app/nxdev/issue/NXC-4062) — Create AI Skill to fix sandbox violations
- [NXC-3981](https://linear.app/nxdev/issue/NXC-3981) — Gradle tasks have unexpected reads in build outputs (e2e-gradle CI test)
- [NXC-3847](https://linear.app/nxdev/issue/NXC-3847) — Improve handling of workspace file data and file map in serialized project graph
- [Q-289](https://linear.app/nxdev/issue/Q-289) — Ignore reads from direct invocations of `nx.js`
- [Q-336](https://linear.app/nxdev/issue/Q-336) — Task reading its own outputs is flagged
- [Q-264](https://linear.app/nxdev/issue/Q-264) — Clean up duplicated TaskIOService types

### Cloud

- [CLOUD-4469](https://linear.app/nxdev/issue/CLOUD-4469) — Paths are matched as globs in sandboxing results
- [Q-339](https://linear.app/nxdev/issue/Q-339) — Filters persist when navigating between sandboxing reports
- [Q-340](https://linear.app/nxdev/issue/Q-340) — Allow filtering unexpected files by read or write
- [Q-352](https://linear.app/nxdev/issue/Q-352) — Unexpected file filter does not show sandbox writes
- [Q-335](https://linear.app/nxdev/issue/Q-335) — Handle tasks with custom hashers as opaque inputs
- [Q-334](https://linear.app/nxdev/issue/Q-334) — Layout shifting for previous executions

### Infrastructure

- [INF-1332](https://linear.app/nxdev/issue/INF-1332) — Enable Sandboxing feature for Island
- Commits: `Deploy iotrace to island` (pmariglia, 04-20), `temp remove io-trace for clickup` (Caleb, 04-21), `Fix enterprise large deployments io-tracing` (pmariglia, 04-10), `ensure io-tracing in dev west1 is auto updated` (Steve, 04-08)

---

## Security

### CLI / 22.7.0 release fixes

- **CVE-2026-25639 (axios)** — `core: bump axios to 1.13.5` ([#35148](https://github.com/nrwl/nx/pull/35148)); `misc: bump axios to 1.15.0 for all packages` ([#35237](https://github.com/nrwl/nx/pull/35237))
- **CVE-2026-25128 (fast-xml-parser)** — `@nx/s3-cache` switched AWS SDK pins from exact to caret ranges (changelog 2604.23.10)
- **minimatch ReDoS** — `@nx/owners` direct dep bumped 9.0.3 → 9.0.6 (2604.23.10); `@nx/devkit` bumped to 22.6.5 across cache/cloud/diagnostics/owners/conformance packages
- **yaml@1.x CVE** — `webpack: bump postcss-loader to ^8.2.1` ([#35028](https://github.com/nrwl/nx/pull/35028))
- **License**: replace LGPL-licensed `@ltd/j-toml` with BSD-3-Clause `smol-toml` ([#35188](https://github.com/nrwl/nx/pull/35188))
- **Critical npm alerts** in React/Angular templates — [NXC-4240](https://linear.app/nxdev/issue/NXC-4240), [NXC-4237](https://linear.app/nxdev/issue/NXC-4237)
- **Shell metacharacters** properly quoted in CLI args passed to tasks ([#34491](https://github.com/nrwl/nx/pull/34491))
- **Supply-chain hardening**: transitive deps flattened to pinned direct deps at publish time ([#35159](https://github.com/nrwl/nx/pull/35159), [NXC-4197](https://linear.app/nxdev/issue/NXC-4197))
- **`windowsHide: true`** on all child process spawns ([#34894](https://github.com/nrwl/nx/pull/34894))
- **pin axios** ([#35093](https://github.com/nrwl/nx/pull/35093)), **bump picomatch** ([#35081](https://github.com/nrwl/nx/pull/35081))

### Cloud / Polygraph

- 4 CRITICAL CVEs (3 × 9.8, 1 × 10.0) on Polygraph Frontend remediated ([NXA-1220](https://linear.app/nxdev/issue/NXA-1220), [NXA-1221](https://linear.app/nxdev/issue/NXA-1221), [NXA-1222](https://linear.app/nxdev/issue/NXA-1222), [NXA-1223](https://linear.app/nxdev/issue/NXA-1223))
- [CLOUD-4446](https://linear.app/nxdev/issue/CLOUD-4446) — Expand audit-log coverage and filters
- [CLOUD-4407](https://linear.app/nxdev/issue/CLOUD-4407) — Remove broken users from Caseware ST instance (DPE)
- [CLOUD-4366](https://linear.app/nxdev/issue/CLOUD-4366) — Workflow cache step silently swallows 403 errors

### Pylon (security tickets)

- **Pylon #700 (Skyscanner)** — Security risk: nx-cloud fetched via npx bypasses lockfile (closed)
- **Pylon #525, #524** — Customer reports of axios v1.14.1 supply-chain attack incident response
- **Pylon #586 (HiBob)** — Discontinued plan urgent matter (closed)
- **Pylon #668** — Critical Security Vulnerabilities Found (closed)

---

## AI / Agentic

- [NXC-4062](https://linear.app/nxdev/issue/NXC-4062) — Create an AI Skill to fix a sandbox violation
- [NXC-4111](https://linear.app/nxdev/issue/NXC-4111) — Revert PR 34917 changes and surface report errors
- `core: clean up legacy .gemini/skills during configure-ai-agents` ([#35117](https://github.com/nrwl/nx/pull/35117))
- `core: add source map annotations to nx show target` ([#35225](https://github.com/nrwl/nx/pull/35225))
- [DOC-479](https://linear.app/nxdev/issue/DOC-479) — Review low-effort agent-readiness improvements for nx.dev
- [DOC-473](https://linear.app/nxdev/issue/DOC-473) — Investigate "SEO" for agents
- [DOC-456](https://linear.app/nxdev/issue/DOC-456) — Sandbox `allowUnixSockets` docs page (Claude Code)
- Polygraph Standalone (multi-agent: Claude, Codex, OpenCode, Cursor) — see Polygraph section

---

## Performance & Reliability

### CLI

- `core: don't hang when workspace contains a named pipe` ([#35289](https://github.com/nrwl/nx/pull/35289))
- `core: optimize warm cache performance for task execution` ([#35172](https://github.com/nrwl/nx/pull/35172))
- `core: cap TUI parallel slots by total task count` ([#35299](https://github.com/nrwl/nx/pull/35299))
- `core: speed up nx --version by avoiding heavy imports` ([#35326](https://github.com/nrwl/nx/pull/35326))
- `core: use v8 serialization in pseudo-IPC channel` ([#35332](https://github.com/nrwl/nx/pull/35332))
- `core: resolve native binary crash on aarch64 linux with 16K/64K page kernels` ([#35356](https://github.com/nrwl/nx/pull/35356))
- `core: prevent batch executor error on prematurely completed tasks` ([#35015](https://github.com/nrwl/nx/pull/35015))
- `core: don't cache project graph errors on daemon` ([#35088](https://github.com/nrwl/nx/pull/35088))
- `core: prevent nx watch infinite loop from overly broad output globs` ([#34995](https://github.com/nrwl/nx/pull/34995))
- `core: replace exec() with spawn() to prevent maxBuffer crash` ([#35256](https://github.com/nrwl/nx/pull/35256))
- `core: misc tui perf fixes` ([#35187](https://github.com/nrwl/nx/pull/35187))
- `core: skip analytics and DB connection when global bin hands off to local` ([#34914](https://github.com/nrwl/nx/pull/34914))
- `gradle: hoist shared task computation out of per-class loop in atomized CI target generation` ([#35199](https://github.com/nrwl/nx/pull/35199))
- [NXC-4247](https://linear.app/nxdev/issue/NXC-4247) — Reduce extra waiting entries when parallel exceeds tasks
- [NXC-4162](https://linear.app/nxdev/issue/NXC-4162) — Cached errors are displayed poorly and not recalculated
- [NXC-3976](https://linear.app/nxdev/issue/NXC-3976) — `isMigrationToMonorepoNeeded` uses project graph instead of getProjects
- [Q-325](https://linear.app/nxdev/issue/Q-325) — Replay extraction may cause workflow pod memory spike
- [Q-347](https://linear.app/nxdev/issue/Q-347) — Cache upload handling fixes

### Cloud

- [CLOUD-4404](https://linear.app/nxdev/issue/CLOUD-4404) — Overview screen branch filtering is very slow
- [CLOUD-4411](https://linear.app/nxdev/issue/CLOUD-4411) — Add missing index on `ciPipelineExecutions`
- [CLOUD-4429](https://linear.app/nxdev/issue/CLOUD-4429) — Prod page hits 500 after sitting idle
- [CLOUD-4421](https://linear.app/nxdev/issue/CLOUD-4421) — Link to most recent CIPE also sends cancellation request
- [CLOUD-4397](https://linear.app/nxdev/issue/CLOUD-4397) — Weird flickering due to loading implementation
- [CLOUD-4467](https://linear.app/nxdev/issue/CLOUD-4467) — Task links fail for some Nx Cloud tenants
- [CLOUD-4432](https://linear.app/nxdev/issue/CLOUD-4432) — Nx Cloud cannot send PR when using "latest" as Nx version

---

## JVM Ecosystem (Gradle / Maven / Dotnet)

### CLI

- **dotnet: ci-workflow generator** ([#33321](https://github.com/nrwl/nx/pull/33321), [NXC-3356](https://linear.app/nxdev/issue/NXC-3356))
- **gradle:** ignore test enums when atomizing ([#34974](https://github.com/nrwl/nx/pull/34974))
- **gradle:** detect @Input provider-based dependencies ([#35090](https://github.com/nrwl/nx/pull/35090))
- **gradle:** prevent Gradle and Maven daemon accumulation ([#35143](https://github.com/nrwl/nx/pull/35143))
- **gradle:** infer input extensions on project graph generation ([#35160](https://github.com/nrwl/nx/pull/35160))
- **gradle:** recognize Kotlin compile tasks in inferred input extensions ([#35335](https://github.com/nrwl/nx/pull/35335))
- **gradle:** patch 0.1.19 to beta.11 ([#35202](https://github.com/nrwl/nx/pull/35202))
- **gradle:** resolve sandbox violations in e2e-gradle tests ([#35349](https://github.com/nrwl/nx/pull/35349))
- **gradle:** increase project graph timeout defaults ([#35058](https://github.com/nrwl/nx/pull/35058))
- **gradle:** use object notation for exclude tasks ([#35085](https://github.com/nrwl/nx/pull/35085))
- **maven:** prevent batch executor hang from premature worker exit ([#35001](https://github.com/nrwl/nx/pull/35001))
- **maven:** make install targets noop when `maven.install.skip=true` ([#35009](https://github.com/nrwl/nx/pull/35009))
- **maven:** honor `settings.xml` in Maven 3 batch runner ([#35216](https://github.com/nrwl/nx/pull/35216))
- **maven:** log analyzer startup under verbose instead of stdout ([#35361](https://github.com/nrwl/nx/pull/35361))
- [NXC-4253](https://linear.app/nxdev/issue/NXC-4253) — Log Maven analyzer output to stderr
- [NXC-4147](https://linear.app/nxdev/issue/NXC-4147) — Investigate 15+ gradle daemons getting spun up
- [NXC-4124](https://linear.app/nxdev/issue/NXC-4124) — Investigate why nx graph plugin uses regex instead of AST atomization logic
- [NXC-4194](https://linear.app/nxdev/issue/NXC-4194) — Handle SIGINT for tasks (Gradle)
- [NXC-4149](https://linear.app/nxdev/issue/NXC-4149) — Make "noop" targets for skipped phases (Maven)
- [NXC-4009](https://linear.app/nxdev/issue/NXC-4009) — Fix e2e-gradle golden test failure
- [Q-331](https://linear.app/nxdev/issue/Q-331) — `dependentTasksOutputFiles: **/*.bin` is incorrect, breaks Gradle caching
- [Q-333](https://linear.app/nxdev/issue/Q-333) — `:jar` and `:compileKotlin` not detecting changed inputs
- [Q-351](https://linear.app/nxdev/issue/Q-351) — `compileKotlin` inferred inputs not set correctly
- [Q-324](https://linear.app/nxdev/issue/Q-324) — Ensure `GRADLE_DISABLE` env var recomputes project graph

---

## Infrastructure

### Linear

- [INF-1334](https://linear.app/nxdev/issue/INF-1334) — Test out GatewayAPI in AWS Development
- [INF-1322](https://linear.app/nxdev/issue/INF-1322) — Anaplan ST instance migration GCP → AWS
- [INF-1319](https://linear.app/nxdev/issue/INF-1319) — CIBC SAML production cutover
- [INF-1335](https://linear.app/nxdev/issue/INF-1335) — CIBC Azure node pools (intel→amd, ARM)
- [INF-1330](https://linear.app/nxdev/issue/INF-1330) — Cisco SAML
- [INF-1333](https://linear.app/nxdev/issue/INF-1333) — Mimecast Anthropic API key
- [INF-1338](https://linear.app/nxdev/issue/INF-1338) — Caseware GH app env var swap
- [INF-1332](https://linear.app/nxdev/issue/INF-1332) — Island sandboxing enabled
- [INF-1326](https://linear.app/nxdev/issue/INF-1326), [INF-1328](https://linear.app/nxdev/issue/INF-1328) — ClickUp resource class additions (2c/8gb, 2c/8gb→16c/64gb tests)
- [INF-1336](https://linear.app/nxdev/issue/INF-1336) — Push polygraph image to AWS mirror base
- [INF-1316](https://linear.app/nxdev/issue/INF-1316) — Operations cluster static IP reservation
- [INF-1317](https://linear.app/nxdev/issue/INF-1317) — Operations IP allowed by default to MongoDB clusters across AWS/Azure/GCP
- [INF-1321](https://linear.app/nxdev/issue/INF-1321) — Mongo connections prefer read-replicas
- [INF-1323](https://linear.app/nxdev/issue/INF-1323) — Credit-usage tool in Lighthouse
- [INF-1327](https://linear.app/nxdev/issue/INF-1327) — Cronjob framework for background mongo-query jobs
- [INF-1311](https://linear.app/nxdev/issue/INF-1311), [INF-1312](https://linear.app/nxdev/issue/INF-1312), [INF-1329](https://linear.app/nxdev/issue/INF-1329) — Polygraph infra prep (secrets, routing, OAuth)
- [INF-1314](https://linear.app/nxdev/issue/INF-1314) — Istio integration: initial plan docs
- [INF-1315](https://linear.app/nxdev/issue/INF-1315) — AWS valkey TF module
- [INF-1324](https://linear.app/nxdev/issue/INF-1324) — AWS valkey sentinel deployment
- [INF-1234](https://linear.app/nxdev/issue/INF-1234) — Setup Terraform infra for Azure Redis
- [INF-1308](https://linear.app/nxdev/issue/INF-1308) — Research possible cloud providers (EU)
- [INF-1310](https://linear.app/nxdev/issue/INF-1310) — Create EU cloud providers research doc
- [INF-1337](https://linear.app/nxdev/issue/INF-1337) — Facade fix streaming timeout bug
- [INF-1147](https://linear.app/nxdev/issue/INF-1147) — Facade observability and metrics
- [INF-1175](https://linear.app/nxdev/issue/INF-1175) — Per-downstream request latency Prometheus metrics
- [INF-1177](https://linear.app/nxdev/issue/INF-1177) — Workflow-mapping Valkey hit/miss metrics
- [INF-1178](https://linear.app/nxdev/issue/INF-1178) — Propagate trace context through facade-to-downstream RPCs
- [INF-1272](https://linear.app/nxdev/issue/INF-1272) — Review facade runner for interface/module extraction opportunities
- [INF-661](https://linear.app/nxdev/issue/INF-661) — Vanta: Upload BC/DR test document

### Cloud-infrastructure commits (95 human-authored)

**GatewayAPI (AWS dev)**:

- `feat(gateway-api): Update gateway-api helm chart to support AWS` (pmariglia, 04-24)
- `feat(dev, aws): Actually use GatewayAPI in aws dev` (pmariglia, 04-24)
- `feat(dev, aws): Add tls secret / externalsecret for gatewayapi` (pmariglia, 04-24)
- `feat: try to install gatewayapi crds in aws dev` (pmariglia, 04-23)
- `chore(aws, development): Add HTTP listener to gateway as well` (pmariglia, 04-24)
- `chore(aws, development): GatewayAPI Resources for AWS Dev` (pmariglia, 04-21)
- `chore(aws, development): Add agents VPC to hosted zone`, `chore(aws, dev): Rename apps to avoid name collision`, `chore(aws, development): Add missing healthcheck`, `chore(aws, development): remove redundant crds`, `chore(aws, development): Add missing kustomization.yaml`, `chore(aws, development) Update Load Balancer Permissions`

**Anaplan AWS**:

- `chore(enterprise, anaplan): Initial Anaplan AWS YAML`, `Anaplan AppProject`, `Anaplan YAML`, `Add agents tf for anaplan`, `Anaplan AWS cred rotator`, `Add anaplan to aws management TF`, `Create Anaplan AWS Deployment` (pmariglia, 04-22)
- `chore(spacelift): Anaplan AWS` (pmariglia, 04-23)
- `chore(enterprise, anaplan): Fix bucket & add ecr endpoints`
- `chore(enterprise, aws, anaplan): Add anaplan to aws agents enabled tenants`
- `chore(enterprise, anaplan): Add wf controller to AWS anaplan deployment`
- `chore(enterprise, anaplan): Remove legacy GCP grafana resources for anaplan`

**Valkey / Redis**:

- `feat(aztester): add managed valkey resources` (Szymon, 04-09)
- `feature(aws dev): add aws valkey sentinel module` (Szymon, 04-07)
- `feat(aws dev): script for sentinel setup` (Szymon, 04-09)
- `chore(prod,na,eu): enable valkey vcs cache` (Altan, 04-20)
- `chore(staging): enable valkey vcs cache` (Altan, 04-19)
- `chore(dev): enable valkey vcs cache` (Altan, 04-19)
- `chore(repo): build our valkey dump image` (Steve, 04-01)

**ClickUp**:

- `chore(enterprise, clickup): Add 2/8 resourceclasses for clickup` (pmariglia, 04-09)
- `chore(enterprise, clickup): Add sizeclass 2 nodepool at c3d-standard-8` (pmariglia, 04-09)
- `chore(enterprise, clickup): c3d-16 for class=2` (pmariglia, 04-10)
- `chore(enterprise,clickup): temp remove io-trace for clickup` (Caleb, 04-21)

**CIBC**:

- `chore(enterprise,azure,cibc): re-jig node pools` (Steve, 04-22)
- `chore(enterprise,azure,cibc): remove defunct pools` (Steve, 04-22)
- `chore(enterprise, cibc): Update docker image argument` (pmariglia, 04-21)
- `fix(enterprise,azure,cibc): bump FE health check` (Steve, 04-05)

**Caseware**:

- `chore(enterprise,aws,caseware): use vars for customer-provided GH app` (Steve, 04-24)

**Cisco**:

- `chore(enterprise,gcp,cisco): add saml vars` (Steve, 04-16)

**Operations**:

- `feat(enterprise, aws, gcp, azure): Operations IP Address allowed by default` (pmariglia, 04-08)
- `chore(operations): Explicit NAT IP for operations cluster` (pmariglia, 04-08)
- `chore(operations,aws): ensure polygraph images can push to aws base registry` (Steve, 04-23)
- `chore(operations): add more references` (Steve, 04-09)
- `chore(operations): remove users who are no longer present` (Steve, 04-09)

**Mimecast**:

- `chore(mimecast): nx-api log level debug` (Altan, 04-01)

**Polygraph**:

- `add NX_CLOUD_APP_URL for polygraph` (Jonathan Cammisuli, 04-08)
- `chore(development,polygraph): deploy polygraph with new gh auth` (Steve, 04-14)
- `chore(development,polygraph): prep secrets` (Steve, 04-14)
- `fix(snapshot): nx api internal base url value for polygraph frontend` (Chau, 04-02)
- `chore(snapshot): add polygraph github app id env vars to snapshot api side` (Chau, 04-01)
- `chore(nxclouddevelopment): /polygraph should target nx-api` (Szymon, 04-02)
- `chore(nxclouddevelopment): /polygraph/private to backend-not-found` (Szymon, 04-02)

**Other**:

- `feat: turn on one-page manual flow in snapshot` (Nicole, 04-23)
- `enable NX_CLOUD_TASK_METRICS_USE_APP_BUCKET on dev and staging` (Rares, 04-23)
- `rename NX_CLOUD_TASK_METRICS_USE_APP_BUCKET to NX_CLOUD_ENABLE_CLI_RESOURCE_METRIC_UPLOADS` (rarmatei, 04-27)
- `chore(enterprise,emeria,island,legora): enable prometheus metrics` (rarmatei, 04-24)
- `chore(legora,anaplan): remove digest pins for workflow controller` (Rares, 04-10)
- `chore(nginx-proxy): lower nginx keepalive_timeout from 65s to 10s for npm readthrough` (pmariglia, 04-10)
- `chore(repo): add a research doc for eu cloud providers` (Szymon, 04-01)
- `chore(repo): add plan for istio work` (Steve, 04-02)
- `chore(repo): update istio plan` (Steve, 04-05)
- `chore(repo): add spacelift to OIDC gap` (Szymon, 04-01)
- `chore(repo): update az cli version` (Steve, 04-24)

---

## Cloud Changelog Versions (April 2026)

| Version | Highlights |
| ------- | ---------- |
| 2604.01.1 | Onboarding CLI error remediation; fix CLAUDECODE=1 termination |
| 2604.02.3 | Strip Git trailers from rerun commits |
| 2604.07.7 | Eagerly reject invalid agent images |
| 2604.07.8 | SCIM compatibility (external IDs / older identifiers) |
| 2604.07.12 | Workspace home styles for smaller screens |
| 2604.10.8 | Dark-mode GitHub logo on connect-workspace page |
| 2604.11.1 | Demo mode for non-enterprise users (analytics features) |
| 2604.13.3 | Task details link to specific Nx Agent logs |
| 2604.14.4 | `--assignment-rules` works alongside inline `--distribute-on` |
| 2604.14.7 | Workflow-cache 403 error handling improvements |
| 2604.17.1 | `no-output-timeout` on agents (10m default); fix-ci continues when SHAs locally resolvable |
| 2604.17.2 | Disable CIPE PR comments per workspace |
| 2604.17.8 | Workspace ID added to Enterprise Usage Contributors CSV |
| 2604.22.13 | `--distribute-on <file-path>` reads file directly |
| 2604.23.1 | Upgraded GitHub + GitLab connect flows (auto-detect, auto-PR) |
| 2604.23.3 | Automatic agent metrics upload for manual DT mode |
| 2604.23.10 | Security dependency updates (fast-xml-parser, minimatch ReDoS) |
| 2604.23.13 | Fix flaky-task analytics 404s on task-detail links |
| 2604.24.8 | Fix `nx-cloud onboard` for public GitHub (api.github.com → github.com) |
| 2604.27.4 | Kubernetes / Argo Workflows CI detection |
| 2604.28.1 | On-prem and ST customers can connect repos via Nx Cloud GitHub App |

---

## Linear Project Status

### Active in April 2026

| Project | Lead | Team | Link |
| ------- | ---- | ---- | ---- |
| Polygraph Standalone | James | RedPanda | [View](https://linear.app/nxdev/project/polygraph-standalone) |
| Self-Healing CI | James | RedPanda | [View](https://linear.app/nxdev/project/self-healing-ci) |
| Task Sandboxing (Input/Output Tracing) | Rares | Quokka / NxCLI | [View](https://linear.app/nxdev/project/task-sandboxing) |
| CNW/Init Funnel & Cloud Conversion Optimization | Jack | NxCLI | [View](https://linear.app/nxdev/project/cnw-init-funnel) |
| `nx migrate` Revamp | Leosvel | NxCLI | [View](https://linear.app/nxdev/project/nx-migrate-revamp) |
| Gradle Plugin for Nx | Louie | Quokka | [View](https://linear.app/nxdev/project/gradle-plugin) |
| Maven Support | Max | NxCLI | [View](https://linear.app/nxdev/project/maven-support) |
| .NET (Dotnet) Support | Craigory | NxCLI | [View](https://linear.app/nxdev/project/dotnet-support) |
| Implement Multi-Cluster Agent Setups | Steve | Infrastructure | [View](https://linear.app/nxdev/project/multi-cluster-agent-setups) |
| AWS GatewayAPI Implementation | Patrick | Infrastructure | [View](https://linear.app/nxdev/project/aws-gatewayapi) |
| Lighthouse - Enable Tenant MongoDB connections | Patrick | Infrastructure | [View](https://linear.app/nxdev/project/lighthouse-mongo) |
| Single Valkey/Redis for multiple agent clusters | Szymon | Infrastructure | [View](https://linear.app/nxdev/project/valkey-redis) |
| Azure Hosted Redis/Valkey | Szymon | Infrastructure | [View](https://linear.app/nxdev/project/azure-redis) |
| Europe-Provider Single Tenant Setup | Szymon | Infrastructure | [View](https://linear.app/nxdev/project/eu-single-tenant) |
| Istio integration | Steve | Infrastructure | [View](https://linear.app/nxdev/project/istio) |
| One-page "connect workspace" flow | Nicole | Cloud | [View](https://linear.app/nxdev/project/one-page-connect) |
| Feature demos | Dillon | Cloud | [View](https://linear.app/nxdev/project/feature-demos) |
| 600 workspaces connected every week | Nicole | Cloud | [View](https://linear.app/nxdev/project/600-workspaces) |
| Ocean DX improvements | Rares | Cloud / Quokka | [View](https://linear.app/nxdev/project/ocean-dx-improvements) |
| Quark-a task force | Nicole | Cloud | [View](https://linear.app/nxdev/project/quark-a) |
| March-April 2026 Misc | Altan / Rares | Quokka | [View](https://linear.app/nxdev/project/march-april-misc) |
| Enterprise Analytics API Cleanup | Rares | Quokka | [View](https://linear.app/nxdev/project/enterprise-analytics) |
| Nx Cloud CIPE Configuration Rework | Louie | Quokka | [View](https://linear.app/nxdev/project/cipe-config-rework) |
| Nx Package Health | Colum | NxCLI | [View](https://linear.app/nxdev/project/nx-package-health) |
| Major Version Deprecations | Leosvel | NxCLI | [View](https://linear.app/nxdev/project/major-version-deprecations) |
| Extending Target Defaults functionality | Craigory | NxCLI | [View](https://linear.app/nxdev/project/extending-target-defaults) |

### Issues Completed: 471 across 6 teams

NxCLI 91 · NxCloud 46 · Infrastructure 28 · RedPanda 120 · Quokka 22 · Docs 24 · (additional Quokka issues completed in March that updated in April: ~15 included in March digest)

---

## Pylon Support Tickets — Customer Mention Index

(Notable tickets from the 216 in April; full list in Pylon)

- **ClickUp**: #784 (Self-Healing fetch failures, High, on hold), #780, #786, #774, #710, #708, #745, #746, #740, #738, #733, #732, #715, #686, #679, #669, #658, #657, #656, #653, #649, #625, #610, #609, #602, #599, #587 (~25+ tickets across two ClickUp accounts)
- **Mimecast**: #758 (cache hit rate 4%), #754 (sandbox count), #549, #550
- **Island**: #790 (corrupted hash, new), #762, #761, #678, #663, #662 (contributor dedup), #681, #621, #635
- **Hudson-MX / Hobby**: #782, #744, #725, #675, #703 (multiple billing/PO)
- **Skyscanner**: #700 (npx supply chain — closed)
- **Anaplan**: Mentioned in #607 (sandboxing interest)
- **HiBob**: #586 (discontinued plan)
- **Cisco / Caseware / CIBC**: tracked via Infrastructure tickets, not Pylon
- **Codistica**: #719 (300%+ cost spike, closed)
- **fairsdotcom**: #683 (billing dispute, closed)
- **Bug reports / consumer**: #793 (Cypress XVFB), #792 (Cypress Cloud), #791 (Bluefish auth), #789 (Nx cloud stalled), #785 (workspace not authorized), #773 (Vite typecheck parity), #767, #623 (vite/vitest pnpm catalogs)

---

_Generated on 2026-04-28._
