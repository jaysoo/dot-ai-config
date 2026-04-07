# NXC-4178: Remove Stylesheet Options from Generators

**Status:** PR Open (awaiting CI)
**PR:** https://github.com/nrwl/nx/pull/35103
**Branch:** `NXC-4178` (worktree: `/Users/jack/projects/nx-worktrees/NXC-4178`)
**Target:** `next` branch (v23)
**Linear:** https://linear.app/nxdev/issue/NXC-4178

## Summary

Simplify the stylesheet format prompt in all non-Angular generators by removing rarely-used/declining style options from the interactive prompt. Single squashed commit on `next`.

## What was done

### Schema changes (17 schema.json files)
- **Removed from x-prompt** (interactive prompt): `less`, `styled-components`, `@emotion/styled`, `styled-jsx`, `tailwind`
- **Kept in enum** (still accepted via `--style` flag): `less`, `styled-components`, `@emotion/styled`, `styled-jsx`
- **Fully removed** (not in enum or prompt): `tailwind` in non-Angular generators
- **Prompt now shows**: CSS, SCSS, None
- **Angular generators**: Added `Tailwind CSS` to app/host/remote/federate-module prompts; removed `less` from prompt but kept in enum

### Deprecation warnings
- `packages/react/src/utils/assertion.ts` — `assertValidStyle()` now warns when deprecated styles are used: less, styled-components, @emotion/styled, styled-jsx. Warning says "deprecated, will be removed in Nx v24"
- `packages/webpack/src/utils/webpack/deprecated-less-loader.js` — Wraps less-loader with one-time build warning
- `packages/rspack/src/plugins/utils/loaders/deprecated-less-loader.js` — Same for rspack

### Test updates
- Removed test suites for styled-components, styled-jsx, tailwind in react/app, react/component, react/library, next/app, nuxt/app
- Removed tailwind e2e tests in `e2e/react/src/react.test.ts` and `e2e/next/src/next-styles.test.ts`
- Updated `it.each` tests to only cover @emotion/styled (rsbuild, babelrc)
- Cleaned stale snapshot entries in react/app, react/component, next/app, nuxt/app
- Added `less-loader` to rspack `.eslintrc.json` `ignoredDependencies`

### Review feedback addressed
- Angular tailwind label casing: `"tailwind"` → `"Tailwind CSS"` for consistency
- Migration URL: `/migrate-from-less` → `/migrate-from-unsupported-stylesheets` (future-proof)

## Remaining / Follow-up
- [ ] CI passing — last push had snapshot sandbox violations; fixed by updating snapshots in-place instead of deleting
- [ ] KB doc page: `recipes/tips-n-tricks/migrate-from-unsupported-stylesheets`
- [ ] Blog mention for Nx 23 release
- [ ] Nx migration: auto-update `nx.json` project defaults if `style: "less"` etc. configured
- [ ] Remove tailwind generator logic entirely (dead code after enum removal) — separate PR
