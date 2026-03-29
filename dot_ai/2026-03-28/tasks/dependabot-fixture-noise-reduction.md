# Dependabot Fixture Noise Reduction

**Status**: In Progress
**Started**: 2026-03-28 11:39
**Linear**: NXC-4169
**Goal**: Rename real package names in test fixture lockfiles to fake scoped names (`@nx-testing/*`) so Dependabot stops flagging them as real vulnerabilities. Currently 583 open alerts, most from fixtures.

## Problem

Dependabot scans all `package-lock.json` files in the repo, including test fixtures at:
`packages/nx/src/plugins/js/lock-file/__fixtures__/`

These fixtures contain real package names (multer, minimatch, express, lodash, axios) which trigger CVE alerts even though they're never installed or used at runtime.

## Approach

Rename real package names → `@nx-testing/<name>` (e.g., `multer` → `@nx-testing/multer`) in fixture lockfiles. This preserves the lockfile structure for parser testing while making Dependabot ignore them.

### Scope

**12 fixture lockfiles** (all npm format):

| Fixture | Format | Vulnerable Packages |
|---------|--------|-------------------|
| auxiliary-packages/package-lock.json | npm v1 | minimatch, axios |
| duplicate-package/package-lock.json | npm v3 | minimatch, axios |
| mixed-keys/package-lock.json | npm v3 | (none detected) |
| nextjs/package-lock.json | npm v2 | minimatch, express, lodash, axios |
| npm-hoisting/package-lock.json | npm v3 | multer, minimatch, express, lodash, axios |
| optional/package-lock.json | npm v2 | (none detected) |
| pruning/package-lock.json | npm v2 | minimatch, axios |
| workspaces/package-lock.json | npm v2 | (none detected) |
| nextjs/app/package-lock.json | npm v2 | minimatch, express, lodash, axios |
| npm-hoisting/app/package-lock.json | npm v3 | multer, express, lodash |
| pruning/devkit-yargs/package-lock.json | npm v2 | minimatch, axios |
| pruning/typescript/package-lock.json | npm v2 | (none detected) |

**Packages to rename** (sorted by alert frequency):
- `minimatch` → `@nx-testing/minimatch` (7 fixtures)
- `axios` → `@nx-testing/axios` (6 fixtures)
- `express` → `@nx-testing/express` (4 fixtures)
- `lodash` → `@nx-testing/lodash` (4 fixtures)
- `multer` → `@nx-testing/multer` (2 fixtures)

**Test files to update**:
- `npm-parser.spec.ts`
- `yarn-parser.spec.ts`
- `pnpm-parser.spec.ts`
- `bun-parser.spec.ts`

### Steps

1. **Audit**: Read each fixture + test file to understand what's asserted on package names
2. **Rename in fixtures**: Replace real package names with `@nx-testing/*` scoped names in all 12 lockfiles
3. **Update test assertions**: Update spec files to match new package names
4. **Run tests**: `nx test nx -- --testPathPattern=lock-file`
5. **Verify**: Confirm no real vulnerable package names remain in fixtures
6. **Consider**: Also check if corresponding `package.json` fixtures need updating

### Risks

- Parser tests might assert on exact package names or resolved URLs — need to verify
- npm lockfile v1/v2/v3 have different structures — scoped packages use different key formats (e.g., `node_modules/@nx-testing/multer` vs `@nx-testing/multer`)
- Resolved URLs reference real npm registry — these should probably be replaced with fake URLs too

### Out of Scope

- Root `pnpm-lock.yaml` alerts (playwright, tar-fs, minimatch) — those are real deps
- Any fixture that isn't a lockfile
