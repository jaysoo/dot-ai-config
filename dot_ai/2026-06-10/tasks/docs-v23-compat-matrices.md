# docs: v23 compat matrix alignment (astro-docs)

Polygraph session: docs-update-misc-updates-v23-837b8d30 (nrwl/nx only)
Worktree: /Users/jack/projects/nx-worktrees/docs-v23-prep (branch: docs-v23-prep)

## Goal

1. Align all technology "Supported Versions" tables in astro-docs with v23 `packages/*/package.json` peer dep ranges
2. Add v23 rows to every Nx-version compat matrix

## Source-of-truth audit (v23 = master @ 23.0.0-beta.25)

Mismatches found and fixed:

| Page | Was | Now | Source |
| --- | --- | --- | --- |
| eslint/introduction | ^8 \|\| ^9 | ^8 \|\| ^9 \|\| ^10 | peer `eslint: ^8.0.0 \|\| ^9.0.0 \|\| ^10.0.0` |
| test-tools/vitest/introduction | "@nx/vite" + vitest ^1-^4 | "@nx/vitest" + ^3 \|\| ^4 | @nx/vitest peer |
| test-tools/detox/introduction | ^20.9.0 | ^20.0.0 | peer + minSupportedDetoxVersion |
| vue/nuxt/introduction | ^3.10.0 \|\| ^4.0.0 | ^3.0.0 \|\| ^4.0.0 | peer >=3.0.0 <5.0.0, minSupported 3.0.0 |
| react/remix/introduction | ^2.17.3 | ^2.0.0 | peer ^2.0.0, minSupported 2.0.0 |
| node/express/introduction | ^4.0.0, ^5.0.0 | ^4.0.0 \|\| ^5.0.0 | style normalize (peer >=4 <6) |
| node/nest/introduction | ^10.0.0, ^11.0.0 | ^10.0.0 \|\| ^11.0.0 | style normalize |
| test-tools/storybook/introduction | stale HTML comment (peer >=7.0.0 claim) | removed | peer now >=8.0.0 <11.0.0 (#35770) |

Verified aligned (no change): vue, angular (catalog >=19 <22 unchanged in v23), angular-rspack (>=1.3.5 <1.7.0), angular-rspack-compiler, cypress (>=13 <16), playwright (^1.36.0), jest (^29 \|\| ^30), vite (^5-^8), rollup, esbuild, webpack, rspack/rsbuild (defaults 1.6.8 / 1.1.10 match versions.ts), react (equiv), react-native (equiv), expo (53-55 maps), module-federation (informational rows, no peer entries).

## v23 matrix rows added

- typescript/introduction: 23.x (current) >= 5.4.2 < 5.10.0 (no TS support change in v23)
- node/introduction: 23.x (current) = 26.x, 24.x, ^22.12.0 — Node 20 dropped in #35591
- node/nest/introduction: 23.x (current) ^11.0.0
- extending-nx/createnodes-compatibility: split 22.x+; added 23.x+ row (prefers `createNodes`, `createNodesV2` deprecated fallback per loaded-nx-plugin.ts + #35893)
- angular-nx-version-matrix: no change needed ("latest" ranges remain valid; Angular window unchanged)

## Validation

- prettier: done
- vale: 0 errors on all changed files
- validate-links: cannot run locally — gradle plugin (removed temporarily from nx.json, restored) then `MsbuildAnalyzer:build:dotnet:release` fail in sandbox. No href changes in diff; deferred to CI.

## Outcome

- Commit `9f5e662548` on docs-v23-prep, draft PR #35943: https://github.com/nrwl/nx/pull/35943
- Awaiting CI (incl. validate-links) before mark-ready
