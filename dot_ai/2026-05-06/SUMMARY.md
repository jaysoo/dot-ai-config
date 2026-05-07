# Summary - 2026-05-06

## NXC-4159: Drop Node 20 support + bump @types/node

**Status:** PR'd, awaiting CI rerun (1st run had 2 flaky e2e failures)

**Branch:** `NXC-4159` (2 commits: `89fae8e8e9`, `8a49d3611a`)

### What shipped

1. **CI matrix:** dropped Node 20 from `e2e-matrix.yml` and `nightly/process-matrix.ts`; added Node 26.0.0 (just released) for early validation. Nightly matrix size: 152/256 jobs.
2. **`@types/node` bump:**
   - Repo catalog (`pnpm-workspace.yaml`): `^20.19.10` → `^24.11.0` (matches `mise.toml` runtime)
   - Generator constants in 9 files (cypress, react-native, js, web, angular, node, react, jest, angular BC): `'20.19.9'` → `'^22.0.0'` (new supported floor for user workspaces)
   - 1 vue lib snapshot updated to match
3. **Renamed `nodeTLS` → `lowestNodeLTS`** in `process-matrix.ts` (typo fix per Jack — was always meant to be "lowest LTS"). Kept single-LTS semantics for non-core plugin projects.
4. **Type fix from `@types/node` bump:** `@types/node@24.x` moved `detail` from base `PerformanceEntry` to `PerformanceMark`/`PerformanceMeasure` subclasses. Added `as PerformanceMeasure[]` cast in `packages/nx/src/utils/perf-logging.ts` (observer is configured for `'measure'` entries only).
5. **Docs:** removed Node 20 mention + TODO comment from `astro-docs/src/content/docs/technologies/eslint/Guides/custom-workspace-rules.mdoc`.

### CI triage

Initial PR run failed `main-linux` with 2 e2e failures:
- `e2e-maven src/maven-simple.test.ts`: npm `ECOMPROMISED / Lock compromised` when `nx init` installs from local verdaccio. Classic verdaccio race, unrelated.
- `e2e-nx src/cache-no-daemon.test.ts`: 2 of 11 tests timed out at default Jest 35s timeout (`should evict cache if larger than max cache size`, `should honor NX_MAX_CACHE_SIZE env var`). Surrounding tests in same file have explicit 120000ms timeouts; these don't. Slow CI runner exposed it.

Both flaky, no relation to my type-level changes. Pipeline rerun in progress.

### Process notes

- Sandbox blocks `.idea/` writes inside cwd and `~/.gradle/wrapper/*.lck`, so `pnpm install` and `nx test` (with @nx/gradle plugin) had to run via `! ` prefix in user shell.
- gh CLI blocked: 1Password desktop integration unreachable from sandbox; `/opt/homebrew/bin/gh` direct hits TLS cert error without `SSL_CERT_FILE=/etc/ssl/cert.pem`. PR opened from push URL output.

### Files

- Plan: this summary doubles as the task record (no separate plan file — flowed from `/review-pr` of local branch)
- Commits: `89fae8e8e9` (Node 20 drop + @types/node bump + perf-logging fix), `8a49d3611a` (Node 26 add)
- PR: https://github.com/nrwl/nx/pull/new/NXC-4159 (branch pushed via direct git, opened via URL)
