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
- Run `CI=true npx nx run-many -t test build lint typescript` to verify migrations didn't break anything
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
