# NXC-4166: CNW Angular Monorepo Preset Rejects Invalid Bundler

## Issue
https://linear.app/nxdev/issue/NXC-4166

## Problem
`create-nx-workspace --preset=angular-monorepo --bundler=vite` silently accepts `vite` as a bundler, but Angular only supports `esbuild`, `rspack`, and `webpack`. The invalid value passes through to the preset generator which fails with a less helpful error.

## Fix
Added early validation in `determineAngularOptions` (create-nx-workspace.ts:1443). When `--bundler` is passed via CLI args, it now checks against valid Angular bundlers before accepting. Invalid values get a clear error message and exit.

## Files Changed
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` — Added `validAngularBundlers` check before `bundler = parsedArgs.bundler` assignment

## Status
- [x] Implementation complete
- [x] Build passes
- [x] Lint passes
- [x] Tests pass (77/77)
- [ ] Commit
- [ ] Push + PR

## Worktree
`/Users/jack/projects/nx-worktrees/NXC-4166`
