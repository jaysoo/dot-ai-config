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
- Run `CI=true npx nx run-many -t test build lint typescript` to verify migrations didn't break anything
- If any target fails, **stop and report the error** for that template — do not commit broken code

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
