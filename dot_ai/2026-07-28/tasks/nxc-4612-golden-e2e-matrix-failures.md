# NXC-4612: Investigate current golden (nightly E2E matrix) test failures

- Linear: https://linear.app/nxdev/issue/NXC-4612
- Polygraph session: tidy-condor-02183c70
- Worktree: `/Users/jack/projects/nx-worktrees/NXC-4612` (branch NXC-4612, HEAD 26fd7d9bd2)
- Date: 2026-07-28

## Scope

Ticket links run https://github.com/nrwl/nx/actions/runs/28998339429 (2026-07-09, "E2E matrix", schedule, master)
and job 86054280519 (`Linux/npm/22.13.0 e2e-js`). That run is 3 weeks stale, so this investigation covers
both it and the latest nightly (run 30333168869, 2026-07-28).

Nightly "E2E matrix" has been red on master **every single day** for at least the last 15 scheduled runs
(2026-07-14 .. 2026-07-28, all `conclusion: failure`).

## Headline numbers

| Run | Date | Jobs | Failed | Passed |
|---|---|---|---|---|
| 28998339429 (ticket) | 2026-07-09 | 139 | 89 | 49 |
| 30333168869 (latest) | 2026-07-28 | 139 | 45 | 93 |

Latest run, failures by package manager: npm 28/62 (45%), yarn 10/33 (30%), pnpm 7/33 (21%).

Latest run, 302 distinct failing tests bucketed by first error line:

| Count | Bucket | Projects |
|---|---|---|
| 114 | snapshot mismatch | e2e-release:113, e2e-nx:1 |
| 86 | generator command failed | e2e-react:56, e2e-vite:11, e2e-angular:7, e2e-nuxt:5, e2e-web:5, e2e-rspack:2 |
| 53 | create-nx-workspace failed | e2e-workspace-create:26, e2e-release:21, e2e-storybook:4, e2e-eslint:2 |
| 9 | plain assertion mismatch | e2e-nx:6 + 3 |
| 9 | npm install / ERESOLVE | e2e-plugin:6, e2e-workspace-create:3 |
| 5 each | nested e2e run, task run, unclassified | e2e-plugin, e2e-expo, e2e-rspack |
| 4 each | timeout, other command, migrate, ENOENT | e2e-nx mostly |

## The 2026-07-09 run is NOT representative any more

Its dominant cause was pnpm 11 rollout, since fixed on master:

- `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: unrs-resolver@1.12.2` made every
  `pnpm add -Dw @nx/...` in `packageInstall` exit non-zero -> "Failed to set up project for e2e tests"
  across nearly every project.
- `[ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION]` rejected the just-published local-registry `@nx/*@24.0.0`.
- `[ERR_PNPM_META_FETCH_FAIL] GET http://localhost:7190/... ECONNREFUSED` (local registry) in e2e-release.

`e2e/utils/global-setup.ts:62-81` now sets `pnpm_config_minimum_release_age=0`,
`pnpm_config_strict_dep_builds=false`, `pnpm_config_verify_deps_before_run=false`,
`pnpm_config_frozen_lockfile=false`. That is why failures halved (89 -> 45).

## Current root causes (latest nightly)

### 1. Verbose-only output vs snapshots recorded non-verbose - 114 failures, all of e2e-release + e2e-nx `show target`

`.github/workflows/e2e-matrix.yml:336,362` sets `NX_E2E_VERBOSE_LOGGING: 'true'`. `isVerboseE2ERun()`
(`e2e/utils/get-env-info.ts:64`) then makes `runCLI` append ` --verbose` to **every** command
(`e2e/utils/command-utils.ts:363,456`). Verbose-gated log lines then appear in output that golden
snapshots never captured:

- `packages/js/src/release/utils/update-lock-file.ts:58` -> `Skipped lock file update because {pm} workspaces are not enabled.`
- `packages/nx/src/command-line/release/utils/git.ts:377-381` -> `Staging files in git with the following command: git add ...`
- `nx show target` prints per-value provenance `(from apps/<APP>/webpack.config.js by @nx/webpack/plugin)`

Sample e2e-release diff (independent-projects.test.ts:126):

```
- Snapshot  - 2
+ Received  + 6
- NX   Staging changed files with git
+ Skipped lock file update because {package-manager} workspaces are not enabled.
+ NX   Staging changed files with git
+ Staging files in git with the following command:
+ git add {project-name}/package.json
```

`.github/workflows/ci.yml` does NOT set `NX_E2E_VERBOSE_LOGGING`, so PR CI never sees this. These
snapshots can never pass in the nightly matrix as configured. This is the single cheapest fix and it
clears ~38% of distinct failures.

Options: (a) stop appending `--verbose` to `runCLI` when `NX_E2E_VERBOSE_LOGGING` is set (keep the env
var for the harness's own logging only, which is what `isVerbose()` vs `isVerboseE2ERun()` already
distinguishes); (b) normalize verbose-only lines out in the release snapshot serializer; (c) drop
`NX_E2E_VERBOSE_LOGGING` from the matrix. (a) or (c) is preferred - the snapshots are testing
user-facing non-verbose output.

### 2. TypeScript 7 hoisted into generated workspaces - ROOT-CAUSED + REPRODUCED (live field bug)

**Confirmed on released nx, no local registry involved:**

```
npx create-nx-workspace@23.1.0 reactproj --preset=react-monorepo --package-manager=npm ...
-> NX  Failed to create workspace
-> NX  Cannot read properties of undefined (reading 'Latest')
```

Mechanism:

- `typescript@7.0.2` became npm `latest` on **2026-07-08** - matches the day nightly npm jobs
  started failing this way.
- TS 7's package `exports` maps `"."` to `./lib/version.cjs`. `require('typescript')` returns
  `{ version, versionMajorMinor }` - **no compiler API at all**.
- The react preset's initial `package.json`
  (`packages/workspace/src/generators/new/generate-preset.ts` `getPresetDependencies`) pins
  `@nx/react`, `@nx/vite`, `@nx/workspace`, `nx` - **no `typescript`**. npm auto-installs the loose
  `typescript` peers of transitive deps (`@phenomnomnominal/tsquery` `>3.0.0`,
  `@rollup/plugin-typescript` `>=3.7.0`, `cosmiconfig`) and hoists **7.0.2** to the workspace root.
- Every nx code path that reads the TS AST then breaks: `ensureTypescript()` -> `tsModule.ScriptTarget`
  (`@nx/react .../add-routing.ts:36`), and tsquery's own
  `Object.keys(ts.SyntaxKind)` -> `Cannot convert undefined or null to object`.

Verified blast radius: `--preset=react-monorepo` fails; `--preset=ts` and `--preset=angular-monorepo`
succeed, because those preset dep sets already pin `typescript` (angular/nest/web-components do).
pnpm is unaffected - its non-hoisted layout never puts a stray TS 7 where `@nx/*` resolve.

Fix applied on this branch:
1. `generate-preset.ts` pins `typescript` for all built-in presets (third-party presets untouched).
2. `ensureTypescript()` throws an actionable error when the resolved TS exposes no compiler API,
   instead of `Cannot read properties of undefined (reading 'Latest')`.

### 2b. Original notes before root-causing (kept for context)

Two shapes of the same family:

- `TypeError: Cannot read properties of undefined (reading 'Latest')`
  at `@nx/react/dist/src/generators/application/lib/add-routing.js:22` ->
  `tsModule.ScriptTarget.Latest`, where `tsModule = ensureTypescript()`
  (`packages/react/src/generators/application/lib/add-routing.ts:36`).
- `TypeError: Cannot convert undefined or null to object` at
  `@phenomnomnominal/tsquery/dist/src/syntax-kind.js:8` -> `Object.keys(typescript_1.SyntaxKind)`.

Same cause: the `typescript` module handed to the generator has no runtime enums. Verified NOT a
TypeScript 6 packaging problem: `typescript@6.0.3` is still CJS (`main: ./lib/typescript.js`, no
`exports`, no `type: module`) and `require('typescript')` exposes `ScriptTarget`/`SyntaxKind` normally.
Suspicion is `ensurePackage` (`packages/devkit/src/utils/package-json.ts`) - the tmp-install +
`addToNodePath` + `Module._initPaths()` path, or its `ERR_REQUIRE_ESM -> return null` branch - under
npm's hoisted layout. **Needs a local repro; not yet root-caused.**

Impact: this is what breaks `create-nx-workspace --preset=react-* --package-manager=npm`
(`NX Failed to create workspace ... Cannot read properties of undefined (reading 'Latest')`), so it
accounts for most of bucket "create-nx-workspace failed" AND most of bucket "generator command failed".
Highest product-facing severity of everything here.

Note: repro attempt with `create-nx-workspace@23.2.0-canary.20260728-26fd7d9` (same commit as HEAD)
succeeded cleanly, because the canary takes the **template download** path
(`Mapping legacy preset 'react-monorepo' to template 'nrwl/react-template'`) while the e2e run took the
older `generate-preset` path. Repro therefore needs the local-registry build, not the canary.

### 3. npm ERESOLVE on @rspack/core - e2e-react/e2e-plugin/e2e-workspace-create, npm jobs

```
npm error Found: @rspack/core@1.7.12
npm error   dev @rspack/core@"2.0.4" from the root project
npm error   peerOptional @rspack/core@"^1.0.0 || ^2.0.0" from @nx/rspack@24.0.0
npm error Conflicting peer dependency: @rspack/core@2.0.4 (peer from @rspack/cli@2.0.4)
```

A generator writes `@rspack/core@2.0.4` + `@rspack/cli@2.0.4` into a workspace whose tree already has
`@rspack/core@1.7.12`; npm's strict peer resolution refuses. pnpm/yarn tolerate it, so PR CI is green.

### 4. e2e-nx deterministic failures (all 7 e2e-nx jobs)

- `Nx Commands > show > show target > human-readable output > should render target info` - cause #1.
- `global installation > inside nx directory > should warn if local Nx has higher major version` -
  `stderr` is empty, expected `It's time to update Nx` (`packages/nx/bin/nx.ts:335`). Real behavior
  change or output stream change; not yet root-caused.
- `cache > http remote cache > should PUT and GET cache from remote cache` (+ the no-daemon variant) -
  `expectProjectMatchTaskCacheStatus` (`e2e/nx/src/cache.test.ts:813`) parses `> nx run <proj>` lines
  for `local cache` / `remote cache` markers and gets `[]`. Either the remote cache hit stopped
  happening or the terse-output format changed.
- `Workspace Tests > move project|remove project` - `ENOENT ... <proj>/project.json` (5/7 jobs).

### 5. Infra-level, not test-level

- `Linux/pnpm/22.22.3 e2e-lerna-smoke-tests`: `[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command was killed
  with SIGSEGV` - nx native crash, no test output at all.
- `Linux/pnpm/24.15.0 e2e-release`: `Error: Command failed: nx run maven-batch-runner:package`,
  exit 130 - Maven build failed before e2e started.
- Verdaccio `ConflictError: this package is already present` noise while populating the local registry.

## Why none of this blocks PRs

PR CI (`.github/workflows/ci.yml`) runs `e2e-ci` on Linux with pnpm and macOS with `SELECTED_PM: npm`,
and never sets `NX_E2E_VERBOSE_LOGGING`. The nightly matrix is the only coverage for
(a) verbose-mode output and (b) the npm/yarn x node-version grid. Both dimensions have systemic
breakage that PR CI structurally cannot see.

## Status

- Cause #1 - FIXED, commit `0c7462479f`. `runCLI`/`runCLIAsync` gate `--verbose` on `isVerbose()`
  instead of `isVerboseE2ERun()`. Verified: `e2e-release` `independent-projects.test.ts` 10/10 green
  locally with `NX_E2E_VERBOSE_LOGGING=true`.
- Cause #2 - FIXED, commit `461e15b3e5`. Built-in presets pin `typescript`; `ensureTypescript`
  throws an actionable error when the resolved TS has no compiler API. Verified:
  `e2e-workspace-create` react suite 7/7 with `SELECTED_PM=npm`, `new` generator unit tests 100/100.
  NOT yet pushed - needs a decision on whether this ships as its own ticket + patch release, since
  it breaks released nx for npm/yarn users, not just the nightly.
- `nx run-many -t test,lint -p workspace,js` green on the branch.
- Causes #3, #4, #5 - open.

Trap hit while verifying: running the workspace unit tests with `NX_NO_CLOUD=true` fails 45
`ci-workflow` snapshots, because that generator's output depends on ambient Nx Cloud connection
state. Reproduces identically on clean master - not a regression, but the spec is not hermetic.

## Remaining order of work

1. Cause #3 (@rspack/core ERESOLVE) - align rspack version pins across generators.
2. Cause #4 items - individually small, each needs its own repro. Note
   `global installation > should warn if local Nx has higher major version` is deterministic in all
   7 e2e-nx jobs and `output.warn` does write to stderr, so the warning genuinely is not emitted.
3. Cause #5 - separate infra tickets (SIGSEGV, maven-batch-runner).

## Artifacts

Scratchpad (this session only):
`/private/tmp/claude-501/-Users-jack-projects-nx-worktrees-NXC-4612/.../scratchpad/`
- `logs/`, `logs-latest/` - raw GH Actions job logs
- `classify.mjs`, `aggregate.mjs`, `buckets.mjs`, `nxerrors.mjs` - the analysis scripts
- `agg-latest.txt` - 302 distinct failing tests with job counts
