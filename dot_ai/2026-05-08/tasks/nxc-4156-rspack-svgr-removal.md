# NXC-4156: Remove SVGR support from @nx/rspack (v23)

**Status**: PR open #35611, awaiting CI

**Linear**: https://linear.app/nxdev/issue/NXC-4156
**Branch**: NXC-4156
**Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4156`

## Goal
Mirror the v22 webpack SVGR removal (PR #32843, fix #35484) for `@nx/rspack` in v23. Remove the `svgr` option from `withReact` / `NxReactRspackPlugin` and ship a migration that inlines a `withSvgr` helper into user configs.

## Reference work (webpack, v22)
- `feat(webpack)!: remove SVGR option and provide withSvgr composable function (#32843)` — `2e9b5430bb`
- `fix(react): withSvgr migration preserves other properties (#35484)` — `b59374a005`
- Migration at `packages/react/src/migrations/update-22-0-0/add-svgr-to-webpack-config.ts`

## Changes

### Source removal
- `packages/rspack/src/utils/with-react.ts` — dropped `SvgrOptions` import + `svgr` field from `WithReactOptions`
- `packages/rspack/src/plugins/nx-react-rspack-plugin/nx-react-rspack-plugin.ts` — `Record<string, any>` opts (silently ignores `svgr`)
- `packages/rspack/src/plugins/utils/apply-react-config.ts` — dropped svgr branch + helper, kept hot-reload + node enable
- `packages/rspack/src/plugins/utils/models.ts` — deleted `SvgrOptions` interface
- `packages/rspack/src/plugins/utils/apply-web-config.ts` — merged separate `\.svg$` rule into images regex `/\.(avif|bmp|gif|ico|jpe?g|png|svg|webp)$/`

### Migration
- New `packages/rspack/src/migrations/update-23-0-0/add-svgr-to-rspack-config.{ts,spec.ts}`
- Codemod cloned from webpack one, retargeted to `@nx/rspack:rspack` executor + `rspackConfig` + `NxReactRspackPlugin`
- Inlines `withSvgr` helper using rspack's two-rule `?url` pattern instead of webpack's `oneOf`
- Includes the b59374a005 "preserve other properties" fix
- Spec covers withReact, NxReactRspackPlugin, ESM, multi-config — 16 tests / 13 inline snapshots
- `migrations.json` registered at `23.0.0-beta.9` (one above latest beta.8 — bumped on review feedback)

### Generator cleanup (follow-up commit)
- `convert-config-to-rspack-plugin.ts` — dropped 3-line `// svgr: false` hint from `else` branch (no withReact found)
- 20 stale-comment blocks scrubbed across 4 files: `convert-config-to-rspack-plugin.spec.ts`, `convert-webpack.spec.ts`, `convert-to-inferred.spec.ts`, `convert-to-inferred.spec.ts.snap`
- Collapsed 9 empty `withReact({})` / `new NxReactRspackPlugin({})` literals to no-args form

## Commits
- `524b4fbe28` feat(rspack)!: remove SVGR option and provide withSvgr migration
- `773fc3397e` chore(rspack): drop stale svgr hint from convert generator

(Hashes after rebase onto master 2026-05-08; original hashes were `4d912d9e14` / `f74e8d13f2`.)

## CI status
First CI run: 3 e2e failures, all unrelated:
- `import.test.ts` — `git filter-branch fatal: Unable to read current working directory` (infra)
- `import-ai-agent.test.ts` — same git filter-branch cwd issue
- `misc-rspack-convert-to-rspack.test.ts` — broken on master, pending fix in unmerged commit `128abe52b1` (Jason Jean)

Diff vs origin/master for the MF test is empty → my branch matches master, master is broken. PR doesn't touch convert-webpack output, MF templates, or the import flow.

Rebased onto master + force-pushed (2026-05-08) to retrigger CI.

## Validation
- `nx run-many -t test,build,lint -p rspack` — 84 tests pass, all targets green
- `nx affected -t build,test,lint --base=master` — clean, exit 0
- All convert-* specs pass after fixture/snapshot scrub

## Open items
- CI rerun verdict
- Linear issue says target `next` for PRs but no `next` remote branch exists; master is on v23-beta cadence so PR targets master (matches webpack v22 PR target pattern)
