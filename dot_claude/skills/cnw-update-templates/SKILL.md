---
name: cnw-update-templates
description: >
  Update all CNW (Create Nx Workspace) template repos to a target Nx version
  using nx migrate. Handles angular-template, react-template, typescript-template,
  and empty-template. Runs migrations, commits changes, but does NOT push without
  user confirmation. Use when "update templates", "cnw templates", "template update",
  "migrate templates", or specifying a version like "update templates to 22.7.0".
---

# CNW Template Updater

> **⚠️ Partially superseded (2026-06-23).** The paths below are the OLD flat
> `~/projects/<template>` — the repos now live at **`~/projects/cnw-templates/<template>`**
> and there are **15**, not 4. For the broad daily dependency audit (nx + @nx/\* +
> third-party, with per-repo PRs and the known upgrade holds) use the
> **`cnw-templates-dep-audit`** skill. Use this one only for a quick nx-migrate of the
> base templates — and fix the paths first.

Update all 4 CNW template repos to a target Nx version.

## Templates

| Template              | Location                         |
| --------------------- | -------------------------------- |
| `angular-template`    | `~/projects/angular-template`    |
| `react-template`      | `~/projects/react-template`      |
| `typescript-template` | `~/projects/typescript-template` |
| `empty-template`      | `~/projects/empty-template`      |

## Arguments

- First argument: target Nx version (e.g., `22.7.0`)
- If no version provided, fetch latest stable: `npm view nx@latest version`

## Process

### 1. Pre-flight Checks

For each template repo, verify:

- Directory exists at `~/projects/<template>`
- Working tree is clean (`git status --porcelain` is empty)
- Current Nx version from `package.json`

If any repo has uncommitted changes, **stop and report** — do not proceed.

**Registry check:** Before running any `npm install`, verify there are no localhost/local registry URLs:

```bash
# Check ~/.npmrc for local registries
grep -i 'registry.*localhost\|registry.*127\.0\.0\|registry.*0\.0\.0\.0' ~/.npmrc 2>/dev/null
```

If a local registry is detected, **stop and report** — local registry URLs will leak into `package-lock.json` and get committed.

### 2. Run Migrations (all 4 templates sequentially)

For each template, run these commands. **All commands MUST use `CI=true` prefix** to skip interactive prompts:

```bash
cd ~/projects/<template>
CI=true npx nx migrate <target-version>
CI=true npm install
# Only if migrations.json was created:
if [ -f migrations.json ]; then
  CI=true npx nx migrate --run-migrations
  rm migrations.json
fi
```

### 3. Verify Changes

After migration, for each template:

- Run `git diff --stat` to show what changed
- Run `grep '"nx"' package.json` to confirm target version
- **Lockfile registry check:** Verify no localhost URLs leaked into `package-lock.json`:
  ```bash
  grep -i 'localhost\|127\.0\.0\|0\.0\.0\.0' package-lock.json | head -5
  ```
  If found, **stop and report** — do not commit. User must fix `~/.npmrc` and re-run `npm install`.
- Run `CI=true npx nx run-many -t build test lint typecheck` to verify migrations didn't break anything
  - **The target is `typecheck`, NOT `typescript`.** There is no `typescript` target — passing it makes `run-many` silently skip typechecking and still exit 0. Typecheck is where TS-version tsconfig failures live (baseUrl `TS5090`, node10 `TS5107`, `esModuleInterop` `TS5107`, narrowing `TS18048`, e2e missing node types `TS2591/2304`) — skipping it hides the entire class.
  - Some templates use non-standard target names: **angular's unit target is `vite:test`, not `test`.** Add `vite:test` to the target list (repos without it just skip it).
  - **Assert coverage — exit 0 is not proof anything ran.** `run-many` returning 0 when a target exists on zero projects prints `No tasks were run` (e.g. `empty-template`) or `Successfully ran targets X for N projects` omitting the ones that didn't match. Parse the summary line and confirm each intended target actually ran on ≥1 project. A silently-skipped `typecheck` reads identical to a passing one.
- If any target fails, **stop and report the error** for that template — do not commit broken code

### 3a. Security Audit

Run `CI=true npm audit --audit-level=critical` for each template. Check the exit code:

- Exit 0 = no critical vulnerabilities, proceed.
- Exit 1 = critical vulnerabilities found.

**If any template has critical vulnerabilities, you MUST pause before committing and present a clear warning block like this:**

```
⚠️  CRITICAL VULNERABILITIES DETECTED

| Template           | Critical Packages                              |
|--------------------|------------------------------------------------|
| angular-template   | axios (SSRF via @module-federation)             |
| react-template     | axios (SSRF via @module-federation)             |

These are [pre-existing / newly introduced by this update]. Shall I proceed with committing, or do you want to address these first?
```

Key points:

- List the actual vulnerable package names and which transitive dependency pulls them in
- Note whether the vulns are **pre-existing** (already in origin/main) or **newly introduced** by this migration — run `git stash && npm audit --audit-level=critical; git stash pop` against the pre-migration state if needed, or compare with `origin/main`
- **Do NOT silently commit past critical audit failures** — always get explicit user confirmation first
- Non-critical vulnerabilities (moderate, high) should be noted in the final summary table but do not block committing

### 3b. Check Framework Package Versions

After nx migrate, check if framework-specific packages have updates that nx migrate missed. `nx migrate` only updates `nx` and `@nx/*` packages — framework packages (Angular, React, Vite, etc.) may need separate updates.

For each template, check key framework packages:

```bash
# angular-template: check Angular packages
npm view @angular/core version  # latest stable
grep '"@angular/core"' package.json  # current

# react-template: check React packages
npm view react version
grep '"react"' package.json

# all templates with vite: check Vite
npm view vite version
grep '"vite"' package.json
```

If any framework package is behind by a **minor or major** version, **report it** in the summary with the current and latest versions. Do not auto-update — these may require their own migration steps (e.g., `ng update`, peer dep changes). Let the user decide.

Also check two things `nx migrate` never touches:

- **TypeScript major** — `npm view typescript version` vs the template's declared version. A TS major bump (e.g. 5.x -> 6.x) deprecates/removes compiler options; report it so the migration's tsconfig changes get scrutinized (see 3d).
- **`@types/node` EOL** — flag any template whose `@types/node` major is EOL (Node 20 went EOL; templates should track a supported LTS, e.g. `^24`). `nx migrate` will happily leave an EOL pin in place.

### 3c. Clean-install / declared-version verification (CRITICAL — catches the failures 3 misses)

**Step 3 verifies the repo in place against its EXISTING `node_modules`.** The migrate step runs `npm install` on a pre-existing tree, so a stale lockfile is never reconciled — `package.json` can declare TS 6 / Angular 22 while the committed lockfile still resolves TS 5.9 / Angular 21. On the old resolution none of the new-major deprecations fire, so **in-place verification passes while a freshly-scaffolded workspace fails.** (2026-07-15: `angular`/`react` verified green in place but `create-nx-workspace`d workspaces failed typecheck on baseUrl, node10, and missing e2e node types.)

For each template, after committing the migrate, run at least one of:

- **Lockfile-sync gate (fast):** `CI=true npm ci` (or `npm install --frozen-lockfile`). This **fails loudly** when `package.json` and the lockfile disagree — exactly the drift that hides failures. If `npm ci` errors with `EUSAGE ... not in sync` or peer `ERESOLVE`, the template's lockfile is stale/broken; report it (do NOT paper over with `--legacy-peer-deps` and commit the regenerated lockfile without the user deciding the target versions).
- **Fresh-scaffold smoke test (thorough, recommended):** scaffold a throwaway workspace from the template and run the full verify against it, so declared versions resolve clean:
  ```bash
  # from a tmp dir, using the template's own preset
  CI=true npx create-nx-workspace@<target> tmp-verify --preset=<template-preset> --no-nxCloud
  cd tmp-verify && CI=true npx nx run-many -t build test lint typecheck vite:test
  ```
  This is how a user actually consumes the template, and it is the ONLY check that reliably surfaces new-major tsconfig failures. If it fails but in-place passed, the lockfile is the culprit.

### 3d. Post-migrate deprecation scan

`nx migrate`'s tsconfig migration often "fixes" a new-major deprecation by **suppressing** it (adding `"ignoreDeprecations": "6.0"`) rather than resolving the underlying option. Grep the post-migrate tree (exclude `node_modules`) for options the migration introduced or left deprecated:

```bash
grep -rlE '"ignoreDeprecations"|"baseUrl"|"moduleResolution": *"node"|"esModuleInterop": *false' \
  . --include='tsconfig*.json' --exclude-dir=node_modules
```

Report any hits — each is a latent new-major failure that `ignoreDeprecations` is masking. The proper fixes (not `ignoreDeprecations`): drop `baseUrl` and relativize `paths` to `./…`; `moduleResolution: "node"` -> `"bundler"`/`"nodenext"`; drop `esModuleInterop: false` (accept the new default); add `"types": ["node"]` to e2e/playwright tsconfigs that use `process`/`__filename`. `ignoreDeprecations` is a last resort only when the option genuinely can't be changed.

### 4. Commit Changes

For each template that has changes:

```bash
cd ~/projects/<template>
git add -A
git commit --amend
```

IMPORTANT: There must be only one commit in these repos.

Keep a note of what's changed from origin/main. If you did not capture them in the diff prevously, now is your chance to diff with origin/main. I need a summary as seen in the next secion. Keep details notes of all the files and changes in case I ask questions.

### 5. Summary Report

Print a summary table:

```
| Template              | Previous | Updated | Files Changed | Status    |
|-----------------------|----------|---------|---------------|-----------|
| angular-template      | 22.6.1   | 22.7.0  | 2             | committed |
| react-template        | 22.6.1   | 22.7.0  | 2             | committed |
| typescript-template   | 22.6.1   | 22.7.0  | 2             | committed |
| empty-template        | 22.6.1   | 22.7.0  | 2             | committed |
```

Be prepared to be asked questions about changes. What migrations they might come from, why, etc.

### 6. Do NOT Push

After committing, remind the user:

- Changes are committed locally but NOT pushed
- User should verify before pushing
- Each template repo has a `post-merge-squash.yml` workflow that squashes to a single "Initial commit" after merge

## Important Notes

- **Always use `CI=true`** to prevent interactive prompts from nx migrate
- **Never push without explicit user confirmation**
- Patch releases typically only change `package.json` + lockfile (no code migrations)
- Minor/major releases may generate `migrations.json` with code changes — review carefully
- If `nx migrate` fails for a template, report the error and continue with remaining templates
- The `react-template` previously had a pre-existing unrelated change — always check for clean working tree first
- **localhost registry leak (2026-03-27):** `~/.npmrc` with a local registry causes localhost URLs in `package-lock.json`. Always check before and after install.
- **Framework packages lag behind (2026-03-27):** `nx migrate` only handles `nx`/`@nx/*` packages. Angular, React, Vite, etc. versions may fall behind if their update migrations were in a version range the template already passed through. Always check and report.
- **Verification blind spots (2026-07-15, nx 23.1.0):** three gaps let every TS-6 failure through and only surfaced when Jack scaffolded fresh workspaces by hand:
  1. Step 3 ran a non-existent `typescript` target instead of `typecheck` -> typecheck never ran, exit 0. Fixed in Step 3 (also assert non-zero task coverage; `vite:test` for angular).
  2. In-place verify used the repos' stale `node_modules` (TS 5.9 pinned) so TS-6 deprecations never fired, even though `package.json` declared TS 6. Added 3c (clean-install / fresh-scaffold).
  3. The migration masked deprecations with `ignoreDeprecations: "6.0"` instead of fixing them. Added 3d (deprecation scan + proper fixes).
  - The proper fixes applied this round: drop `baseUrl` + relativize `paths`; `moduleResolution: node` -> `bundler`; drop `esModuleInterop: false`; add `types: ["node"]` to e2e tsconfigs; bump EOL `@types/node` 20 -> `^24`; and a real code fix (closure narrowing, `TS18048`) in `angular-template` `products.service.ts`.
  - Also: `angular`/`react` committed lockfiles were un-`ci`-able (package.json declared newer than lockfile resolved). Getting them onto TS 6 / Angular 22 required `npm install --legacy-peer-deps` (regenerates the lockfile) — a version-target decision the user must make, not a silent step.
