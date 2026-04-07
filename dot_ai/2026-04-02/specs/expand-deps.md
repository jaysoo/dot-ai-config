# Spec: expand-deps — Supply Chain Hardening for `nx` Package

## Problem

When users run `pnpm install nx@latest`, the package manager resolves transitive dependencies at install time. An attacker who compromises a transitive dependency (e.g. publishes a malicious patch to a dep-of-a-dep) can inject code into any `nx@latest` install, even if `nx` itself is secure.

## Solution

At publish time, flatten the entire transitive dependency tree of `nx` into explicit, pinned direct dependencies in `packages/nx/package.json`. This eliminates all resolver freedom — every package version is predetermined by the Nx team based on what was tested in CI.

## Scope

- **Only the `nx` package** (other packages could adopt later)
- **Only required production dependencies** — skip optional and peer deps
- **All versions pinned exactly** — no ranges (`^`, `~`), no `catalog:` references

## Script Details

### Location

`scripts/expand-deps.ts`

### Arguments

- `--project <name>` — project name (e.g. `nx`), determines which `packages/<name>/package.json` to read/modify
- `--dry-run` — print what would change without modifying `package.json`

### Wiring

- `packages/nx/project.json` gets an `expand-deps` target that calls the script
- `scripts/nx-release.ts` calls `expand-deps` after `add-extra-dependencies` and before publish
- The existing snapshot/reset mechanism in `nx-release.ts` handles reverting `packages/nx/package.json` after publish

### Algorithm

1. Read `packages/nx/package.json` to get direct dependencies
2. Parse `pnpm-lock.yaml` (lockfileVersion 9.0 format, used by pnpm v10)
3. Find the resolved entry for `nx@<current-version>` in the lockfile's dependency resolution section
4. Walk the dependency tree recursively:
   - For each dependency, look up its resolved entry in the lockfile
   - Collect its `dependencies` (skip `optionalDependencies`, `peerDependencies`)
   - Recurse into each dependency's own dependencies
   - Deduplicate by package name
5. **Conflict detection**: If two paths resolve the same package name to different versions, **fail with an error** listing the conflicting package, the two versions, and the dependency paths that led to each
6. Resolve all `catalog:` references in direct deps to their exact pinned versions from the lockfile
7. Write the expanded dependencies back into `packages/nx/package.json`:
   - Direct deps: pinned to exact versions from lockfile (replacing any ranges or `catalog:` refs)
   - Transitive deps: added as new direct deps with exact pinned versions
8. In `--dry-run` mode: print a summary of what would be added/changed, then exit without writing

### Lockfile Format (pnpm-lock.yaml v9.0)

The lockfile has two relevant sections for each package:

**Top section** — package metadata (resolution hashes, engines, peer dep declarations):

```yaml
axios@1.12.0:
  resolution: {integrity: sha512-...}
```

**Bottom section** — resolved dependency trees:

```yaml
axios@1.12.0:
  dependencies:
    follow-redirects: 1.15.11(debug@4.4.1)
    form-data: 4.0.4
    proxy-from-env: 1.1.0
  transitivePeerDependencies:
    - debug
```

**Important**: Dependency versions may include peer dep qualifiers in parens (e.g. `1.15.11(debug@4.4.1)`) — the script must strip these to get the base version.

### Output Format (--dry-run)

```
expand-deps: nx

Direct deps (resolved from lockfile):
  axios: 1.13.5 (was "1.13.5" — unchanged)
  semver: 7.7.4 (was "catalog:" — resolved)
  ejs: 3.1.10 (was "^3.1.7" — pinned)

New transitive deps to add:
  follow-redirects: 1.15.11
  form-data: 4.0.4
  proxy-from-env: 1.1.0
  combined-stream: 1.0.8
  ...

Total: 36 direct -> 106 total deps (70 transitive added)
```

### Error Cases

- **Version conflict**: Two dependency paths resolve the same package to different versions

  ```
  ERROR: Version conflict for "debug"
    Path 1: nx -> axios -> follow-redirects -> debug@4.4.1
    Path 2: nx -> ora -> cli-cursor -> debug@4.3.4
  Resolve manually before publishing.
  ```

- **Missing lockfile entry**: A dependency referenced in package.json is not found in the lockfile
- **Lockfile not found or unparseable**

### Integration into nx-release.ts

The script is called in two places in `nx-release.ts` (mirroring the existing `add-extra-dependencies` pattern):

1. ~Line 125: In the "create GitHub release" flow (local, non-CI)
2. ~Line 162: In the CI publish flow

```typescript
execSync(`pnpm nx run nx:expand-deps`, {
  stdio: isVerboseLogging ? [0, 1, 2] : 'ignore',
  maxBuffer: LARGE_BUFFER,
  windowsHide: false,
});
```

### What This Does NOT Do

- Does not modify source `packages/nx/package.json` permanently — the existing snapshot/reset in `nx-release.ts` reverts it
- Does not handle optional or peer dependencies
- Does not run any network requests — purely reads local lockfile
- Does not auto-resolve version conflicts — fails and requires manual intervention
- Does not apply to any package other than `nx` (for now)

## Manual Verification Steps

1. Run `nx run nx:expand-deps -- --dry-run` and review output
2. Run `nx run nx:expand-deps` and inspect `packages/nx/package.json`
3. Verify: no `catalog:` references remain
4. Verify: no version ranges (`^`, `~`) remain
5. Verify: total dep count matches expected (~106)
6. Spot-check: pick a known transitive dep (e.g. `follow-redirects` from axios) and confirm it's present with the correct version
7. Run `git diff packages/nx/package.json` to review all changes
8. Optionally: create a tarball (`npm pack`) and test `pnpm install` in an empty project to verify the lockfile has no packages not listed as direct deps of nx
