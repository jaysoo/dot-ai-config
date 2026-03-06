# Daily Summary — 2026-03-05

## NXC-4030: Security CVE Cluster

**PR**: https://github.com/nrwl/nx/pull/34708
**Linear**: https://linear.app/nxdev/issue/NXC-4030
**Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4030`

Addressed multiple security vulnerabilities across Nx packages. CI green after several iterations.

**Dependency bumps:**
- `copy-webpack-plugin` `^10.2.4` → `^14.0.0` (fixes `serialize-javascript` CVE)
- `css-minimizer-webpack-plugin` `^5.0.0` → `^8.0.0` (same `serialize-javascript` CVE)
- `@module-federation/enhanced`, `runtime`, `sdk` → `^2.1.0` (removes koa via dts-plugin 2.1.0)
- `koa` → `^3.1.2` in `@nx/node` versions.ts (CVE-2026-27959 Host Header Injection)
- `next` `~16.0.1` → `~16.1.6` (GHSA-9g9p-9gw9-jx7f, GHSA-5f7q-jpqc-wp7h)
- `eslint-config-next` `^16.0.1` → `^16.1.6`

**Breaking change fixes:**
- Added `noErrorOnMissing: true` to all 3 copy-webpack-plugin usage sites (v14 errors on missing glob patterns by default):
  - `packages/webpack/src/utils/create-copy-plugin.ts`
  - `packages/webpack/src/plugins/nx-webpack-plugin/lib/apply-base-config.ts`
  - `packages/next/src/utils/create-copy-plugin.ts`
- Fixed `runtime-library-control.plugin.ts` for MF 2.x compatibility (resolver return type changed)

**Migrations added (22.6.0-beta.10):**
- `@nx/module-federation`: MF packages to `^2.1.0`
- `@nx/react`: `@module-federation/enhanced` to `^2.1.0`
- `@nx/angular`: `@module-federation/enhanced` to `^2.1.0`
- `@nx/node`: `koa` to `^3.1.2`
- `@nx/next`: `next` to `~16.1.6`, `eslint-config-next` to `^16.1.6`

**Versions.ts updated:**
- `packages/react/src/utils/versions.ts` — `moduleFederationEnhancedVersion`
- `packages/angular/src/utils/versions.ts` — `moduleFederationEnhancedVersion`
- `packages/node/src/utils/versions.ts` — `koaVersion`
- `packages/next/src/utils/versions.ts` — `next16Version`, `eslintConfigNext16Version`

**Skipped:** esbuild `<=0.24.2` (moderate, dev server only, requires breaking `0.19→0.25+` jump)

**Testing:** Created fresh workspace at `/tmp/acme1` with all affected plugins (`@nx/next`, `@nx/webpack`, `@nx/rspack`, `@nx/module-federation`, `@nx/react`, `@nx/node` + koa). Post-change `npm audit` only shows skipped esbuild.

**CI iterations:** ~6 force-pushes to resolve lockfile mismatch, copy-webpack-plugin `noErrorOnMissing` (missed `apply-base-config.ts` code path), and Next.js test expectation update.

## NXC-4035: Surface Clearer Error When CNW Hits SANDBOX_FAILED

**PR**: https://github.com/nrwl/nx/pull/34724
**Linear**: https://linear.app/nxdev/issue/NXC-4035
**Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4035`

Investigated and fixed why CNW shows "Failed to install dependencies:" with no error details when `npm install` fails. Root cause: Nicole had `~/.npm` permission issues (exit code 243), but `--silent` flag suppressed all error output.

**Changes** (4 files):
1. Removed `--silent` from all PM install commands — `exec()` captures output in memory (never shown to terminal), so `--silent` only suppressed error info
2. Increased `maxBuffer` from 1MB to 10MB to prevent process kill on verbose PM output
3. Added fallback error message when stderr/stdout are both empty
4. Structured sandbox error: exit code, log file path, actionable hint
5. Added `recordStat` for AI agent `needs_input` flow (was missing telemetry)
6. Migrated from deprecated `CreateNxWorkspaceError` to `CnwError` in `execAndWait`

## Task Notes

- `dot_ai/2026-03-04/tasks/nxc-4035-cnw-sandbox-error-surfacing.md` — full investigation notes
- `dot_ai/2026-03-04/tasks/nxc-4030-security-cve-cluster.md` — original CVE task plan
