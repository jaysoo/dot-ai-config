# NXC-4165: CNW Cannot find module 'nx/bin/nx' in temp sandbox with apps preset

## Problem

When running `create-nx-workspace --preset=apps`, the `newGenerator` calls `generatePreset()` which:
1. Resolves `nx/bin/nx` from the new workspace via `require.resolve('nx/bin/nx', { paths: ... })`
2. Forks a child process to run `nx g @nx/workspace:preset --preset=apps`
3. The preset generator for `apps` just does `return;` — literally nothing

If the package install in the new workspace has any issues (pnpm strict resolution, network, etc.), step 1 fails with "Cannot find module 'nx/bin/nx'" — for a generator that does nothing.

Related: GitHub #34810 (CNW fails with pnpm) shows the same code path failing.

## Fix

Skip `generatePreset` for `Preset.Apps` in `new.ts`, same as already done for `Preset.NPM`. This eliminates the unnecessary `require.resolve` and child process fork.

## Files Changed

- `packages/workspace/src/generators/new/new.ts` — Added `Preset.Apps` to skip condition
- `packages/workspace/src/generators/new/new.spec.ts` — Updated assertions, added explicit tests

## Status

- [x] Code change
- [x] Tests updated and passing
- [x] build/test/lint passing
- [ ] Committed
- [ ] PR created

## Notes

- `addPresetDependencies` still adds `@nx/js` for apps preset — useful default dep
- There was an unmerged attempt (`a22c6a0920`) to make apps preset call `@nx/js` initGenerator, but it never landed on master
- The preset generator at `preset.ts:22-23` has been `return;` for apps since at least 2025
