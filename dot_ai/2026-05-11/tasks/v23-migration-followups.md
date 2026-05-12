# v23 Migration Verification — Follow-up Task File

## Context

Tested all 15 v23 migrations end-to-end (master @ `24.0.0-local.260511-1`). Test workspace + per-test RESULT.md: `/Users/jack/projects/v23-migration-tests/`. Consolidated findings: `SUMMARY.md` in that dir (25 findings, F1–F25).

Initial fix branch on the nx repo: `fix/v23-vitest-migration-import-and-ai-doc-corrections` — 2 commits, ~250 lines, covers F1 + F2 + missing-docs only.

Angular tests deferred — see `ANGULAR_DEFERRED.md` in the test workspace.

---

## Already addressed (in the open PR / branch)

Branch: `fix/v23-vitest-migration-import-and-ai-doc-corrections` (pushed to `origin/nrwl/nx`, PR to be opened manually at https://github.com/nrwl/nx/compare/master...fix/v23-vitest-migration-import-and-ai-doc-corrections)

| Finding | Severity | What shipped |
|---|---|---|
| **F1 BLOCKER** | HIGH | `packages/vite/src/migrations/update-23-0-0/ensure-vitest-package-migration.ts:14` deep import → `@nx/devkit/internal`. Migration `version` bumped 23.0.0-beta.0 → 23.0.0-beta.10 |
| **F2 AI doc** | HIGH (2 of 3 sub-claims) | `packages/vite/src/migrations/update-23-0-0/files/ai-instructions-for-vite-8.md` — §4 (`.d.mts` → conditional exports) + Common Issues (`rollupOptions silently ignored` → aliased+deprecated). §3 reverted to original (Angular framing was correct; verified via `npx create-vite` showing `@oxc-project/runtime` not needed for non-Angular Vite 8) |
| **Missing .md docs** | LOW | Added per-migration .md for: `cypress/remove-experimental-prompt-command`, `rspack/add-svgr-to-rspack-config`, `vite/rename-rollup-options-to-rolldown-options` |

Commits:
- `1720cbe2a4` fix(bundling): repair v23 vitest migration deep-import + correct AI doc
- `31e4cf6051` docs(misc): add missing migration descriptions for v23 codemods

Pre-push validation: vite tests have pre-existing failures on master (`configuration.spec.ts`, `generator-utils.spec.ts`, 4 failed); confirmed unrelated to this branch.

---

## Still to ship (NOT in any branch yet)

### One-line / tiny fixes — bundle into a follow-up "v23 polish" PR

| # | Finding | File | Change |
|---|---|---|---|
| 1 | **F6** devkit allowlist drift | `packages/devkit/src/migrations/update-23-0-0/update-deep-imports.ts` `DEVKIT_INTERNAL_SYMBOLS` | Add `emitPluginWorkerLog`, `throwForUnsupportedVersion` |
| 2 | **F15** playwright x-deprecated | `packages/playwright/src/executors/playwright/schema.json` | Add `"x-deprecated": "<canonical message>"` matching the pattern from PR #35576 |
| 3 | **F18** jest snapshot link gate | `packages/jest/migrations.json` `update-snapshot-guide-link.requires` | `jest >=30.0.0` → `jest >=30.1.0` |
| 4 | **F11** rollup orphan dep | `packages/rollup/src/migrations/update-23-0-0/remove-use-legacy-typescript-plugin.ts` | After stripping the option, also strip `rollup-plugin-typescript2` from `package.json` `devDependencies` |
| 5 | **F16** rolldown rename string-literal selector gap | `packages/vite/src/migrations/update-23-0-0/rename-rollup-options-to-rolldown-options.ts:6` | `'PropertyAssignment > Identifier[name=rollupOptions]'` → `'PropertyAssignment > :matches(Identifier[name=rollupOptions], StringLiteral[value=rollupOptions])'`. Update test fixture too |
| 6 | **F25** Nx-internal generator-utils still emit `rollupOptions` | `packages/vite/src/utils/generator-utils.ts:380, 707`; `packages/react/src/generators/library/library.ts`, `add-vite.ts` (`rollupOptionsExternal`) | Update to emit `rolldownOptions` for new v23 projects |

Estimated effort: 1 PR, ~30 lines total.

### Medium-effort fixes

| # | Finding | What to do |
|---|---|---|
| 7 | **F8** RR < 7.14 + Vite 8 PJU | Add `@nx/react` v23 PJU bumping the RR family (10 packages) to `^7.14.2` gated on `requires: { "@react-router/dev": "<7.14.0" }`. (Already drafted in the conversation; user OK'd PJU-only, dropped the incompatibleWith backstop). Pattern matches the existing `22.7.0` PJU in `packages/react/migrations.json` |
| 8 | **F4** Rolldown plugin compat — extend AI doc | Append two new sections (7: plugin audit table; 8: rolldownOptions schema gotchas) to `ai-instructions-for-vite-8.md`. Drop-in markdown ready in `/Users/jack/projects/v23-migration-tests/15-rolldown-plugin-compat/RESULT.md` |
| 9 | **F5** rspack withSvgr crashes inferred-plugin graph eval | Two changes in `packages/rspack/src/migrations/update-23-0-0/add-svgr-to-rspack-config.ts`: (a) guard `withSvgr` for empty `config` so it doesn't deref `config.module.rules`; (b) extend migration to walk inferred-plugin paths, not just `forEachExecutorOptions('@nx/rspack:rspack', ...)` |
| 10 | **F13** New rollup AI migration doc | Create `packages/rollup/src/migrations/update-23-0-0/files/ai-instructions-for-rollup-legacy.md` covering: outDir/output.dir strict check failure mode (test 07 captured the verbatim error + workarounds) and `buildLibsFromSource` default flip. Add a `create-ai-instructions-for-rollup` migration to write it into `tools/ai-migrations/MIGRATE_ROLLUP_LEGACY.md` |
| 11 | **F9** jest 30.3 pin too broad | Split `23.0.0-pin-jest-30-3-for-rn-compat` into two PJU entries (keys must be unique): `23.0.0-pin-jest-30-3-rn` gated on `react-native`, `23.0.0-pin-jest-30-3-expo` gated on `expo`. Non-RN/Expo workspaces get jest 30.4+ |

### New migrations / larger work

| # | Finding | What to do |
|---|---|---|
| 12 | **F3, F14, F19, F20, F21** Cypress 15.x uncovered breaking changes | Five distinct codemods/PJUs needed. See `/Users/jack/projects/v23-migration-tests/05-cypress-15-changelog-audit/RESULT.md` for the full list with severity |
| 13 | **F7** Node 20 enforcement | Add `engines.node: ">=22.12.0"` to `packages/nx/package.json`; soft warn-and-continue check at top of `nx migrate` planning (`packages/nx/src/command-line/migrate/migrate.ts`); extend `nx report` to flag `Node: <ver> (unsupported)` |
| 14 | **F12** Rollup buildLibsFromSource silent default flip | Either revert to `false` default OR add migration that detects existing libs with own `build` targets and explicitly sets `buildLibsFromSource: false` to preserve old behavior |
| 15 | **F22** AI doc coverage gaps | Add §s for vitest ^4 requirement, vite-tsconfig-paths 8.0.0 warning, Storybook compat (10.3+), vite-plugin-dts v4 vs v5, plugin-react-swc min version (^4.3.0) |

### Pre-existing generator-side issues (separate concern, can be split out)

| # | Finding | What to do |
|---|---|---|
| 16 | **F23** CNW@22.x silently ignores `--bundler=rspack` | Investigate `create-nx-workspace`'s preset → repo mapping. The CNW @22.6.x and @22.7.x bundle-ignoring is documented in test 01-v7 and 02-v7 RESULT.md files |
| 17 | **F24** webpack/rspack convert-to-inferred two-step | Docs note that the user has to run `convert-config-to-<pkg>-plugin` first |

### Findings already documented in the deferred Angular doc

See `/Users/jack/projects/v23-migration-tests/ANGULAR_DEFERRED.md` for the 2 angular migrations + 3 angular generator removals. Test plans already in there.

---

## Quick-start for the next session

```bash
cd /Users/jack/projects/nx
git checkout fix/v23-vitest-migration-import-and-ai-doc-corrections
# OR start a new branch off master:
# git checkout -b fix/v23-polish-followups master

# Read the consolidated findings:
cat /Users/jack/projects/v23-migration-tests/SUMMARY.md

# Per-finding deep-dive:
ls /Users/jack/projects/v23-migration-tests/*/RESULT.md

# Local registry still has the v23 build:
curl -s http://localhost:4873/nx/24.0.0-local.260511-1 | head -3
```

For each fix:
1. Read the relevant RESULT.md for repro and rationale
2. Apply patch
3. Run `pnpm nx test <pkg> --testPathPatterns=<migration>` to validate the spec still passes
4. (Optional) re-run the corresponding e2e test in `/Users/jack/projects/v23-migration-tests/<test-dir>/workspace/`

---

## Verdaccio + local build

- Registry: http://localhost:4873
- Local nx version: `24.0.0-local.260511-1` (tagged as v24 because nx-release jumps a major to avoid conflicts; functionally represents what will be v23)
- 41 stashes accumulated; oldest `stash@{0}` is NXC-3345 from a prior session — left untouched

## Other pre-existing issues surfaced (out of scope but worth knowing)

- v22.x `react-monorepo` preset clones `nrwl/react-template` HEAD at scaffold time; CNW package version is irrelevant for the resulting vite/vitest/plugin-react versions. Confirmed in tests 01-v7, 02-v7, 12-v7
- pre-existing vite test failures on master: `configuration.spec.ts`, `generator-utils.spec.ts` (4 failed) — unrelated to v23 migrations
