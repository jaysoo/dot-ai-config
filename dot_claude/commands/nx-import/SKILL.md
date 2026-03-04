---
name: nx-import
description: Import, merge, or combine repositories into an Nx workspace using nx import. USE WHEN the user asks to adopt Nx across repos, move projects into a monorepo, or bring code/history from another repository.
---

## Quick Start

- `nx import` brings code from a source repository or folder into the current workspace, preserving commit history.
- After nx `22.6.0`, `nx import` responds with .ndjson outputs and follow-up questions. For earlier versions, always run with `--no-interactive` and specify all flags directly.
- Run `nx import --help` for available options.
- Make sure the destination directory is empty before importing.
  EXAMPLE: target has `libs/utils` and `libs/models`; source has `libs/ui` and `libs/data-access` — you cannot import `libs/` into `libs/` directly. Import each source library individually.

Primary docs:
- https://nx.dev/docs/guides/adopting-nx/import-project
- https://nx.dev/docs/guides/adopting-nx/preserving-git-histories

Read the nx docs if you have the tools for it.

## Import Strategy

**Subdirectory-at-a-time** (`nx import <source> apps --source=apps`):
- **Recommended for monorepo sources** — files land at top level, no redundant config
- Caveats: multiple import commands (separate merge commits each); dest must not have conflicting directories; root configs (deps, plugins, targetDefaults) not imported
- **Directory conflicts**: Import into alternate-named dir (e.g. `imported-apps/`), then rename

**Whole repo** (`nx import <source> imported --source=.`):
- **Only for non-monorepo sources** (single-project repos)
- For monorepos, creates messy nested config (`imported/nx.json`, `imported/tsconfig.base.json`, etc.)
- If you must: keep imported `tsconfig.base.json` (projects extend it), prefix workspace globs and executor paths

### Directory Conventions

- **Always prefer the destination's existing conventions.** Source uses `libs/`but dest uses `packages/`? Import into `packages/` (`nx import <source> packages/foo --source=libs/foo`).
- If dest has no convention (empty workspace), ask the user.

## Common Issues

### pnpm Workspace Globs (Critical)

`nx import` adds the imported directory itself (e.g. `apps`) to `pnpm-workspace.yaml`, **NOT** glob patterns for packages within it. Cross-package imports will fail with `Cannot find module`.

**Fix**: Replace with proper globs from the source config (e.g. `apps/*`, `libs/shared/*`), then `pnpm install`.

### Root Dependencies and Config Not Imported (Critical)

`nx import` does **NOT** merge from the source's root:
- `dependencies`/`devDependencies` from `package.json`
- `targetDefaults` from `nx.json` (e.g. `"@nx/esbuild:esbuild": { "dependsOn": ["^build"] }` — critical for build ordering)
- Plugin configurations from `nx.json`

**Fix**: Diff source and dest `package.json` + `nx.json`. Add missing deps, merge relevant `targetDefaults`.

### TypeScript Project References

After import, run `nx sync --yes`. If it reports nothing but typecheck still fails, `nx reset` first, then `nx sync --yes` again.

### Explicit Executor Path Fixups

Inferred targets (via Nx plugins) resolve config relative to project root — no changes needed. Explicit executor targets (e.g. `@nx/esbuild:esbuild`) have workspace-root-relative paths (`main`, `outputPath`, `tsConfig`, `assets`, `sourceRoot`) that must be prefixed with the import destination directory.

### Plugin Detection

- **Whole-repo import**: `nx import` detects and offers to install plugins. Accept them.
- **Subdirectory import**: Plugins NOT auto-detected. Manually add with `npx nx add @nx/PLUGIN`. Check `include`/`exclude` patterns — defaults won't match alternate directories (e.g. `apps-beta/`).
- Run `npx nx reset` after any plugin config changes.

### Redundant Root Files (Whole-Repo Only)

All root config lands in the import directory. **Don't blindly delete** `tsconfig.base.json` — imported projects extend it via relative paths.

### Root ESLint Config Missing (Subdirectory Import)

Subdirectory import doesn't bring the source's root `eslint.config.mjs`, but project configs reference `../../eslint.config.mjs`. Create one, or copy from the source.

Also install `typescript-eslint` explicitly — pnpm's strict hoisting won't auto-resolve this transitive dep of `@nx/eslint-plugin`.

### ESLint Version Pinning (Critical)

**Pin ESLint to v9** (`eslint@^9.0.0`). ESLint 10 breaks `@nx/eslint` and many plugins with cryptic errors like `Cannot read properties of undefined (reading 'version')`.

### Dependency Version Conflicts

After import, compare key deps (`typescript`, `eslint`, framework-specific). If dest uses newer versions, upgrade imported packages to match (usually safe). If source is newer, may need to upgrade dest first. Use `pnpm.overrides` to enforce single-version policy if desired.

### Module Boundaries

Imported projects may lack `tags`. Add tags or update `@nx/enforce-module-boundaries` rules.

### Project Name Collisions (Multi-Import)

Same `name` in `package.json` across source and dest causes `MultipleProjectsWithSameNameError`. **Fix**: Rename conflicting names (e.g. `@org/api` → `@org/teama-api`), update all dep references and import statements, `pnpm install`. The root `package.json` of each imported repo also becomes a project — rename those too.

### Workspace Dep Import Ordering

`pnpm install` fails during `nx import` if a `"workspace:*"` dependency hasn't been imported yet. File operations still succeed. **Fix**: Import all projects first, then `pnpm install --no-frozen-lockfile`.

### `.gitkeep` Blocking Subdirectory Import

The TS preset creates `packages/.gitkeep`. Remove it and commit before importing.

## Non-Nx Source Issues

When the source is a plain pnpm/npm workspace without `nx.json`.

### npm Script Rewriting (Critical)

Nx rewrites `package.json` scripts during init, creating broken commands (e.g. `vitest run` → `nx test run`). **Fix**: Remove all rewritten scripts — Nx plugins infer targets from config files.

### `noEmit` → `composite` + `emitDeclarationOnly` (Critical)

Plain TS projects use `"noEmit": true`, incompatible with Nx project references.

**Symptoms**: "typecheck target is disabled because one or more project references set 'noEmit: true'" or TS6310.

**Fix** in **all** imported tsconfigs:
1. Remove `"noEmit": true`. If inherited via extends chain, set `"noEmit": false` explicitly.
2. Add `"composite": true`, `"emitDeclarationOnly": true`, `"declarationMap": true`
3. Add `"outDir": "dist"` and `"tsBuildInfoFile": "dist/tsconfig.tsbuildinfo"`
4. Add `"extends": "../../tsconfig.base.json"` if missing. Remove settings now inherited from base.

### Stale node_modules

`nx import` may bring pnpm symlinks pointing to the source filesystem. Fix: `find imported/ -name node_modules -type d -prune -exec rm -rf {} +`, then `pnpm install`.

### ESLint Config Handling

- **Legacy `.eslintrc.json` (ESLint 8)**: Delete all `.eslintrc.*`, remove v8 deps, create flat `eslint.config.mjs`.
- **Flat config (`eslint.config.js`)**: Self-contained configs can often be left as-is.
- **No ESLint**: Create both root and project-level configs from scratch.

### TypeScript `paths` Aliases

Nx uses `package.json` `"exports"` + pnpm workspace linking instead of tsconfig `"paths"`. If packages have proper `"exports"`, paths are redundant. Otherwise, update paths for the new directory structure.

## Technology-specific Guidance

Identify technologies in the source repo, then read and apply the matching reference file(s).

Available references:
- `references/GRADLE.md`
- `references/NEXT.md` — Next.js projects (App Router, Pages Router): root tsconfig, `withNx`, jest setup, ESLint, non-Nx create-next-app imports, mixed Next.js+Vite coexistence. Covers both Nx and non-Nx sources.
- `references/TURBOREPO.md`
- `references/VITE.md` — Vite projects (React, Vue, or both): module resolution, tsconfig, framework deps, ESLint configs, mixed-framework coexistence. Covers both Nx and non-Nx sources.
