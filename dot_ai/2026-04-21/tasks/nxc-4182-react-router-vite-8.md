# NXC-4182: Revert React Router Vite 7 workaround (now supports Vite 8)

## Context

`@react-router/dev` 7.14.2 expanded its Vite peer dep to include Vite 8
(`^5.1.0 || ^6.0.0 || ^7.0.0 || ^8.0.0`). The workarounds added across
three prior commits are no longer needed:

1. **#35101 (`2cfc2898a7`)** — React app generator forced `useViteV7: true` when `--use-react-router` was passed; added `useViteV7?: boolean` to `ViteConfigurationGeneratorSchema` (never wired into `configuration.ts` body).
2. **#35110 (`6962a3d7a1`)** — skipped the react-router typecheck e2e test because pnpm resolved both vite 7 and vite 8 (peer dep on vite 7 + vitest 4 bundling vite 8).
3. Follow-up commits on `NXC-4182` branch (`8c4992fc3f`, `5b613a5ee9`) — added generator guards throwing on Vite 8 / Vitest 4, deleted `@vitejs/plugin-react` + downgraded `vitest` to `^3.2.0`, un-skipped e2e test but ran `updateJson` + `pnpm install` to force Vite 7 in the test workspace.

## Net change (PR #35365)

Squashed into single commit `4ff192abc7`:

- `reactRouterVersion` ^7.12.0 → ^7.14.2
- New 22.7.0 migration (version tag `22.7.0-beta.16`) pinning all `@react-router/*` packages to `7.14.2`
- Removed `useViteV7: true` force-flag in `add-vite.ts`
- Removed `useViteV7?: boolean` from `packages/vite/src/generators/configuration/schema.d.ts` (dead field)
- Removed "should use Vite 7" unit test
- Removed the pre-generate downgrade/install block in `e2e/react/src/react-router-ts-solution.test.ts`

Diff: 6 files, +43/-20.

## Verifications

- `npm view @react-router/dev@7.14.2 peerDependencies` → vite peer includes `^8.0.0`
- `application.spec.ts` react-router block: no new failures vs master (same 2 snapshot failures pre-existing on master)
- `vite:configuration.spec.ts`: no new failures vs master
- `nx affected -t build-base,lint,test` fails for unrelated reasons (rollup native module load error affects `react:test`, `vite:test`, `detox:test`, `remix:test`, etc. — same failures on master with my changes reverted)

## Workflow notes

- PR #35101 was Jack's; PR #35110 was Jason's skip.
- Branch had 3 commits; user requested squash + force-push-with-lease after PR review flagged the iteration churn.
- Squashed with `git reset --soft HEAD~3 && git commit` per CLAUDE.md convention.

## Links

- Linear: NXC-4182 (https://linear.app/nxdev/issue/NXC-4182/revert-and-fix-react-router-typecheck-e2e-skip)
- PR: https://github.com/nrwl/nx/pull/35365
- Prior PRs reverted: #35101, #35110
- Commit: `4ff192abc7`
