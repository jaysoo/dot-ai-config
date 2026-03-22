# CNW Template Update: 22.6.0 → 22.6.1

**Date:** 2026-03-22
**Status:** Completed (manual run — to be automated)

## What Was Done

Updated all 4 CNW (Create Nx Workspace) templates from Nx 22.6.0 to 22.6.1 using `nx migrate`.

### Templates Updated

| Template              | Location                         | Nx Packages Updated                                                                                                                                                                                  |
| --------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `angular-template`    | `~/projects/angular-template`    | 14 (`nx`, `@nx/angular`, `@nx/devkit`, `@nx/docker`, `@nx/esbuild`, `@nx/eslint`, `@nx/eslint-plugin`, `@nx/js`, `@nx/node`, `@nx/playwright`, `@nx/vite`, `@nx/vitest`, `@nx/web`, `@nx/workspace`) |
| `react-template`      | `~/projects/react-template`      | 13 (same minus `@nx/angular`, plus `@nx/react`)                                                                                                                                                      |
| `typescript-template` | `~/projects/typescript-template` | 7 (`nx`, `@nx/eslint`, `@nx/eslint-plugin`, `@nx/js`, `@nx/vite`, `@nx/vitest`, `@nx/web`)                                                                                                           |
| `empty-template`      | `~/projects/empty-template`      | 2 (`nx`, `@nx/js`)                                                                                                                                                                                   |

### Process Per Template

```bash
cd ~/projects/<template-name>
npx nx migrate 22.6.1
npm install
# If migrations.json exists:
npx nx migrate --run-migrations
rm migrations.json
```

### Results

- All 4 templates: version bumps only in `package.json` and `package-lock.json`
- No code migrations were generated (patch release)
- Changes are unstaged/uncommitted (need commit + push + post-merge squash)

## Existing Automation

There's already an `nx-template-updater` repo at `~/projects/nx-template-updater/` that partially automates this:

- **Config:** `config/templates.json` — currently only lists `nrwl/empty-template`
- **Script:** `scripts/update-template.sh` — clones, migrates, creates PR
- **Workflow:** `.github/workflows/check-and-update.yml` — nightly at 5:00 UTC, checks npm for latest Nx version
- **Post-merge:** Each template repo has `post-merge-squash.yml` that squashes to single "Initial commit"

### Gaps in Existing Automation

1. Only `empty-template` is configured — need to add `react-template`, `angular-template`, `typescript-template`
2. Runs nightly but only checks latest stable — no way to target a specific version
3. No manual trigger for "update all templates to version X"

## Requirements for Skill/Command

A `/cnw-update-templates` skill or command should:

1. **Accept a target version** (e.g., `22.6.1`) or default to latest stable from npm
2. **Run migrations on all 4 templates** in parallel
3. **For each template:**
   - `cd ~/projects/<template>`
   - `npx nx migrate <version>`
   - `npm install`
   - `npx nx migrate --run-migrations` (if migrations.json exists)
   - `rm migrations.json` (if exists)
4. **Commit changes** per template (or offer to)
5. **Optionally push** and create PRs
6. **Report summary** of what changed across all templates

### Considerations

- Templates are GitHub repos under `nrwl/` org — pushing requires auth
- Post-merge squash workflow handles commit history cleanup
- Patch releases typically have no code migrations; minor/major may have them
- The `react-template` had a pre-existing `nx.json` change (`"analytics": false`) unrelated to migration — skill should flag uncommitted changes before starting
- IMPORTANT: Run with CI=true, we should skip interactivity
- IMPORTANT: Do not commit telemetry field in nx.json, this must remain empty.
- IMPORTANT: Do not push the repo, I must manually check and push
