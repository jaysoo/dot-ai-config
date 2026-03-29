# 2026-03-28 Summary

## NXC-4169: Dependabot Fixture Noise Reduction
- **Branch**: `NXC-4169`
- **Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4169`
- **Linear**: NXC-4169
- **Status**: Committed, pending validation + push + PR

### What was done
- Analyzed all 83 open Dependabot alerts via `gh api repos/nrwl/nx/dependabot/alerts`
- Found 44/83 (53%) come from test fixture lockfiles at `packages/nx/src/plugins/js/lock-file/__fixtures__/`, including 25/44 high-severity (57%)
- Wrote `tmp/rename-fixture-packages.mjs` to rename 11 vulnerable packages to `@nx-testing/*` scoped names in fixture lockfiles and package.json files
- Updated `npm-parser.spec.ts` inline snapshot assertions for `minimatch` → `@nx-testing/minimatch`
- All 166 lock-file tests pass (npm, yarn, pnpm, bun parsers + pruning)

### Packages renamed
multer, minimatch, brace-expansion, node-forge, express, path-to-regexp, serialize-javascript, @apollo/server, body-parser, postcss, tough-cookie

### Packages intentionally NOT renamed (edge cases)
- `semver` — deeply embedded in bin entries, many nested versions, marginal alert value
- `qs` — same complexity/value tradeoff

### Key bugs fixed in the rename script
1. `extractPackageName()` failed on top-level paths (`node_modules/express` didn't split because split delimiter `/node_modules/` requires a leading `/`)
2. `replaceInPath()` regex didn't match the first `node_modules/` at position 0
3. `delete obj[key]; obj[newKey] = value` moved renamed keys to end of JS object, breaking pruning test fixtures that compare serialized JSON strings
4. Only last package in path was renamed — missed parent packages in nested paths like `node_modules/express/node_modules/array-flatten`
5. `peerDependenciesMeta` field wasn't processed
6. File glob `package-lock.json` missed `package-lock-v1.json` and `package-lock-v2.pruned.json`

### Also created
- **NXC-4170**: Follow-up Linear issue for 19 high-severity alerts in real deps (pnpm-lock.yaml, pom.xml). Each package row links to individual Dependabot alert pages.
- Updated `.github/dependabot.yml` already existed with `exclude-paths` but only suppresses PRs, not security alerts

### Files modified
- 11 `package-lock.json` fixtures (various npm v1/v2/v3 formats)
- 4 `package.json` fixtures
- `npm-parser.spec.ts` (minimatch assertion updates)
