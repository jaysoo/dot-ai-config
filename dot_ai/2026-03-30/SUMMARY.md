# 2026-03-30 Summary

## Completed

### NXC-4172: Handle "." and absolute paths as workspace name in CNW

- **Issue**: CNW rejected `.` and absolute paths (e.g. `/tmp/acme`) as workspace names, causing 1,300+ errors/month — the #1 input validation error for both AI agents and humans
- **Fix**: Added `resolveSpecialFolderName()` that detects `.`/`./` and absolute paths before validation:
  - `.`/`./` in non-empty dir: suggests `nx init`
  - `.`/`./` in empty dir: resolves to `basename(cwd)`, creates workspace in-place
  - Absolute paths: extracts basename as name, sets `workingDir` to parent
- **Architecture**: Added `workingDir` option to `CreateWorkspaceOptions`, threaded through `createWorkspace`, `createEmptyWorkspace`, `createPreset`, `cloneTemplate` — no `process.chdir()` mutation
- **Review feedback**: Fixed `existsSync` bug checking relative to cwd instead of resolved `workingDir`, fixed stale JSDoc
- **Files**: 8 files in `packages/create-nx-workspace/`
- **Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4172`
- **Status**: Committed (`6b460d8672`), ready for push/PR

### Merged today (from earlier work)

- **NXC-4168**: JSON Meta Telemetry for nx init — PR #35076 merged
- **NXC-4166**: CNW Angular Bundler Validation — PR #35074 merged
- **NXC-4171**: Sass version bump for vue/nuxt Vite 8 compat — PR #35073 merged
- **NXC-4172**: Handle "." and absolute paths in CNW — PR #35083 merged

### Cancelled

- **NXC-4165**: CNW apps preset fix — not worth addressing, monitoring CNW errors
- **NXC-4167**: CNW Yarn 4 PnP Fix — not worth addressing, monitoring CNW errors

### Filed: tsc --build incremental cache bug (#35079)

- Discovered while testing NXC-4172: `tsc --build` tsbuildinfo files in `dist/` can cause stale output when combined with Nx remote cache
- Filed https://github.com/nrwl/nx/issues/35079, assigned to self

### NXC-4169: Dependabot fixture noise reduction (PR #35072, updated)

- **Issue**: Dependabot scans `package.json` and `package-lock.json` files in lock-file test fixtures, raising 45 vulnerability alerts for packages only used as test data
- **Approach change**: Originally renamed packages to `@nx-testing/*` prefix. Switched to renaming fixture files from `*.json` to `*.json.fixture` — cleaner, future-proof, no lockfile content changes needed
- **Fix**: Renamed 35 fixture files (19 `package.json` + 16 `package-lock*.json`) to `.json.fixture`. Added `loadJsonFixture()` helper using `jest.requireActual('fs')` to bypass mocked fs in tests. Updated all 3 parser spec files.
- **Files**: 38 files changed in `packages/nx/src/plugins/js/lock-file/`
- **Tests**: All 76 tests pass (npm: 14, yarn: 29, pnpm: 33)
- **PR**: https://github.com/nrwl/nx/pull/35072 (updated description)
- **Impact**: Eliminates 45 of 83 open Dependabot alerts

### #35068: Bump picomatch 4.0.2 → 4.0.4 (security fix)

- **Issue**: `npm audit` flagged picomatch 4.0.2 with two high-severity CVEs (GHSA-3v7f-55p6-f55p method injection, GHSA-c2c7-rcm5-vvqj ReDoS) across @nx/angular, @nx/js, @nx/workspace, and 3 other packages
- **Fix**: Bumped picomatch from `4.0.2` to `4.0.4` in pnpm catalog (`pnpm-workspace.yaml`). Patch-only security fix, no API changes.
- **Files**: `pnpm-workspace.yaml`, `pnpm-lock.yaml`
- **PR**: https://github.com/nrwl/nx/pull/35081
- **Status**: PR created, CI running

### Cloud Bundle Local Testing Script & Skill

- **Context**: DOC-451 — documenting `nx-cloud onboard` command. Needed a way to test the onboard CLI locally against snapshot.nx.app.
- **Created**: `tools/scripts/nx-cloud-local.sh` — wrapper script to run locally-built client-bundle commands against snapshot, staging, or local environments. Defaults to snapshot when environment is omitted.
- **Created**: `cloud-bundle-tester` Claude Code skill at `dot-ai-config/dot_claude/skills/cloud-bundle-tester/SKILL.md`
- **Found bug**: Top-level `--help` side-effect in `convert-to-nx-cloud-id.ts` fires at import time when `onboarding-utils.ts` imports `updateNxJsonWithNxCloudId`. Running `onboard --help` shows the wrong help text (convert-to-nx-cloud-id's help instead of onboard's). Multiple other command files have the same pattern — `process.argv.includes('--help')` at module scope.

### CLOUD-4401: Ctrl+C during onboarding prints readline stacktrace

- **Issue**: Pressing Ctrl+C during any enquirer prompt in the `nx-cloud onboard` interactive wizard printed an `ERR_USE_AFTER_CLOSE` readline stacktrace instead of exiting cleanly
- **Root cause**: Enquirer throws `ERR_USE_AFTER_CLOSE` from an internal keypress event handler — a separate async call chain that can't be caught by `try/catch` around the `prompt()` call
- **Fix**: Added `process.on('uncaughtException')` and `process.on('unhandledRejection')` handlers at the start of `interactiveOnboarding()` using the existing `isPromptCancelledError` utility to detect and exit cleanly
- **Files**: `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/onboarding-interactive.ts`
- **PR**: https://github.com/nrwl/ocean/pull/10568 — merged
- **Tested**: Verified against snapshot.nx.app using `tools/scripts/nx-cloud-local.sh`

### CLOUD-4400: Suppress url.parse() deprecation warning during CLI commands

- **Issue**: Running any `nx-cloud` CLI command on Node 22+ prints a `url.parse()` deprecation warning (DEP0169) from `follow-redirects` (transitive dep of axios 1.13.6)
- **Root cause**: `follow-redirects` 1.15.11 (latest) uses `url.parse()` internally. No upstream fix available — axios, pnpm, playwright, serverless all have open issues about this with no clean fix
- **Fix**: Monkey-patch `process.emitWarning` at the client-bundle entry point to suppress only DEP0169, passing all other warnings through unchanged
- **Files**: `libs/nx-packages/client-bundle/src/index.ts`, `.nx/version-plans/2026-03-30-15-00-suppress-url-parse-warning.md`
- **PR**: https://github.com/nrwl/ocean/pull/10569 — CI green
- **Worktree**: `/Users/jack/projects/ocean-worktrees/CLOUD-4400`

### CLOUD-4029: Track Node 22 default agent image request

- **Issue**: Customer (David Jellesma) running Node 22 locally but agent images only had Node 20. Node 20 reaches EOL April 2026.
- **Fix**: Added two new agent base images based on latest v3 template:
  - `ubuntu22.04-node22.22-v1` (Node 22.22.2 LTS Jod)
  - `ubuntu22.04-node24.14-v1` (Node 24.14.1 LTS Krypton)
- **Also bumped**: Go 1.22 → 1.26 (vuln fix per Chau), pnpm 9 → 10 (per Caleb's review)
- **Closed**: Stale PR #9093 (from Nov 2025, based on outdated template)
- **PR**: https://github.com/nrwl/ocean/pull/10571 — merged
- **Follow-up**: Created CLOUD-4403 for cloud-infrastructure config map update (blocked by CLOUD-4029)
- **Worktree**: `/Users/jack/projects/ocean-worktrees/CLOUD-4029`

## Generated (earlier today, separate sessions)

- March 2026 Nx changelog digest: `.ai/2026-03-30/nx-digest-2026-03-changelog.md`
- March 2026 cross-functional digest: `.ai/2026-03-30/nx-digest-2026-03-crossfunctional.md`
