# NXC-4167: CNW Yarn 4 PnP Cannot Resolve nx During Preset Generation

## Status: Implementation complete, pending review

## Problem
CNW's `getPackageManagerCommand` used `npx` as the exec command for yarn berry, while the nx package itself uses `yarn`. `npx` doesn't understand yarn PnP module resolution, so when a workspace uses PnP, `npx nx g preset:preset` fails because `npx` can't resolve `nx`.

Three callsites affected:
- `create-empty-workspace.ts` — `npx nx new ...` in sandbox
- `create-preset.ts` — `npx nx g preset:preset ...` in workspace (third-party presets)
- `setup-ci.ts` — `npx nx g @nx/workspace:ci-workflow ...` in workspace

## Changes

### Fix 1: `packages/create-nx-workspace/src/utils/package-manager.ts`
- Changed `exec: useBerry ? 'npx' : 'yarn'` → `exec: 'yarn'`
- Removed outdated comment about yarn classic version detection workaround
- After `yarn set version` runs (preInstall), yarn classic delegates to berry via `yarnPath`, so `npx` workaround is no longer needed
- Aligns with `packages/nx/src/utils/package-manager.ts` which already uses `exec: 'yarn'`

### Fix 2: `packages/workspace/src/generators/new/generate-workspace-files.ts`
- Added `enableScripts: false` to `createYarnrcYml`, matching identical setting in:
  - `packages/create-nx-workspace/src/utils/package-manager.ts` (line 114)
  - `packages/nx/src/utils/package-json.ts` (line 669)

## Validation
- `nx run-many -t test,build,lint -p create-nx-workspace,workspace` — all pass
