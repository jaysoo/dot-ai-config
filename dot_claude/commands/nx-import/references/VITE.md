## Vite (React & Vue)

This reference covers importing Vite-based projects (React, Vue, or both) into an Nx workspace. Generic Vite guidance comes first, followed by framework-specific sections.

---

### Import Strategy: Whole Repo vs Subdirectories

**Subdirectory-at-a-time** (`nx import <source> apps --source=apps`, then `nx import <source> libs --source=libs`):
- **Recommended for monorepo sources** (both Nx and non-Nx) — files land at top level (`apps/`, `libs/`, `packages/`)
- No root file duplication, no redundant config
- Project references between apps and libs preserved exactly (same relative paths)
- Still need to fix workspace globs and add missing root deps
- **Caveat**: Must update dest `tsconfig.base.json` if module resolution differs (e.g. `nodenext` → `bundler` for Vite projects)
- **Caveat**: Requires multiple import commands (one per top-level dir), each creating a separate merge commit
- **Caveat**: Only works if dest doesn't already have conflicting directories — `nx import` will refuse with "Destination directory is not empty"
- **Workaround for directory conflicts**: Import into an alternate-named directory (e.g. `imported-apps/`) and then rename projects to avoid collisions
- **Match dest conventions**: If source uses `libs/` but dest uses `packages/`, import into `packages/` (e.g. `nx import <source> packages/foo --source=libs/foo`). Always prefer the dest's existing directory structure.

**Whole repo** (`nx import <source> imported --source=.`):
- **Only recommended for non-monorepo sources** (single-project repos, simple setups)
- For monorepo sources, this creates a nested monorepo under `imported/` which is messy — you end up with `imported/nx.json`, `imported/tsconfig.base.json`, `imported/package.json`, etc.
- If you must use whole-repo for a monorepo source: imported `tsconfig.base.json` must be kept (projects extend it), workspace globs need `imported/` prefix, executor paths need `imported/` prefix
- Prefer subdirectory-at-a-time for monorepo sources instead

### pnpm Workspace Globs (Critical)

- `nx import` adds only the imported directory itself (e.g. `imported`) to `pnpm-workspace.yaml`, **NOT** the individual packages within it. With subdirectory-at-a-time import, it adds individual paths (e.g. `apps/portal`) rather than glob patterns (`apps/*`).
- Cross-package imports (`@org/models`, `@org/shared-ui`, etc.) will fail with `Cannot find module` errors during typecheck and build.
- **Fix**: Replace entries in `pnpm-workspace.yaml` with proper glob patterns from the source's config, prefixed appropriately.
- Example: source has `apps/*`, `libs/shared/*`, `libs/shop/*` → dest needs glob patterns covering the same directories
- After updating globs, run `pnpm install` to re-link packages.

### Root Dependencies and Config Not Imported (Critical)

`nx import` does **NOT** merge from the source's root:
- `dependencies` or `devDependencies` from `package.json`
- `targetDefaults` from `nx.json` (executor-specific settings like `"@nx/esbuild:esbuild": { "dependsOn": ["^build"] }` are critical for build ordering)
- Plugin configurations from `nx.json`

**Approach**: Compare source and dest root `package.json` AND `nx.json`. Add any missing deps and merge relevant `targetDefaults`.

**Common deps by framework** — see the React-Specific and Vue-Specific sections below for full dep lists.

**Shared Vite deps (both frameworks):**
- `vite`, `vitest`, `jsdom`, `@types/node` (dev)
- `typescript` (dev, ensure versions align)

### TypeScript Project References

- After import, run `nx sync` to update TypeScript project references.
- The `@nx/js:typescript-sync` generator will wire up cross-project references in `tsconfig.json` files.
- If `nx sync` fails or reports nothing to sync but typecheck still fails, run `nx reset` first to clear stale cache, then `nx sync --yes` again.

### Module Resolution: `bundler` vs `nodenext` (Critical)

- Vite projects require `"moduleResolution": "bundler"` and `"module": "esnext"` in `tsconfig.base.json`.
- Empty Nx TS workspaces default to `"moduleResolution": "nodenext"` and `"module": "nodenext"`.
- **Whole repo import**: Imported projects extend their own nested `tsconfig.base.json`, so they keep `bundler` resolution. Usually fine.
- **Subdirectory import**: Imported projects now extend the dest's root `tsconfig.base.json`. **You must update the dest root** to use `bundler`/`esnext`.
- If the dest workspace also has non-Vite projects that need `nodenext`, you'll need per-project overrides.

### tsconfig `lib` Array (Critical)

The TS preset generates `"lib": ["es2022"]` only. Vite projects need DOM types.

**Fix**: Add `"dom"` and `"dom.iterable"` to the `lib` array in `tsconfig.base.json`.

**Gotcha**: TypeScript does NOT merge `lib` arrays — a project-level `"lib": ["dom"]` completely **replaces** the base `"lib": ["es2022", "dom", "dom.iterable"]`. Always include `es2022` in any project-level `lib` override.

### Explicit Executor Path Fixups

- Projects using **inferred targets** (via `@nx/vite`, `@nx/vitest`, `@nx/eslint` plugins) generally work without path changes — they resolve config relative to project root.
- Projects using **explicit executor targets** (e.g. `@nx/esbuild:esbuild`) have workspace-root-relative paths that must be updated.
- Common paths to fix: `main`, `outputPath`, `tsConfig`, `assets`, `sourceRoot`
- **Fix**: Prefix these paths with the import destination directory.

### Plugin Detection and Configuration

- **Whole-repo import**: `nx import` detects and offers to install relevant plugins (`@nx/eslint`, `@nx/vite`, `@nx/vitest`, `@nx/playwright`). Accept these.
- **Subdirectory import**: Plugins are NOT automatically detected or installed. You must manually add them to `nx.json` after import: `npx nx add @nx/vite`, `npx nx add @nx/vitest`, `npx nx add @nx/eslint`. After adding plugins, check their `include`/`exclude` patterns in `nx.json` — defaults like `"{apps,libs}/**"` won't match alternate import directories (e.g. `apps-beta/`, `libs-beta/`). Add patterns for the imported directories.
- **`@nx/vite/plugin` defaults `typecheckTargetName` to `"vite:typecheck"`** — not `"typecheck"`. Fix in `nx.json`:
  - Set `@nx/vite/plugin` → `"typecheckTargetName": "typecheck"`
  - Rename or remove `@nx/js/typescript` typecheck target to avoid conflicts
  - **Exception**: Keep `@nx/js/typescript` if you have non-Vite pure TS libraries (e.g. using `@nx/esbuild`). It coexists with `@nx/vite/plugin` — Vite plugin takes precedence for projects with vite configs, while `@nx/js/typescript` handles pure TS libraries. In this case, rename its typecheck target: `"typecheck": { "targetName": "tsc-typecheck" }`.
- After any plugin config changes in `nx.json`, run `npx nx reset` to clear the daemon cache.

### Redundant Root Files (Whole-Repo Import Only)

When importing an entire source repo, all root-level config files land in the import directory (`imported/nx.json`, `imported/package.json`, `imported/tsconfig.base.json`, etc.). These are largely dead weight.

**Do not blindly delete** — the imported `tsconfig.base.json` is still used by imported projects via relative `extends` paths. This is another reason to prefer subdirectory-at-a-time import.

### Root ESLint Config Missing After Subdirectory Import

Subdirectory import does NOT bring over the source's root `eslint.config.mjs`. But imported project configs reference it via `../../eslint.config.mjs`.

**Fix:** Create a root `eslint.config.mjs`. Standard Nx pattern:
```js
import nx from '@nx/eslint-plugin';
export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  { ignores: ['**/dist', '**/out-tsc', '**/vite.config.*.timestamp*', '**/*.vue.d.ts'] },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {},
  },
];
```

**Note:** `typescript-eslint` is a transitive dependency of `@nx/eslint-plugin` that pnpm's strict hoisting won't auto-resolve. Install it explicitly: `pnpm add -wD typescript-eslint`.

### ESLint Version Pinning (Critical)

**Pin ESLint to v9** (`eslint@^9.0.0`), not latest. ESLint 10 changes the plugin API in ways that `@nx/eslint`, `eslint-plugin-vue`, and `@vue/eslint-config-typescript` may not support. Causes the cryptic `Cannot read properties of undefined (reading 'version')` error.

### Dependency Version Conflicts

When the source and destination have different versions of core libraries:

**Vite 6 (source) + Vite 7 (dest):**
- Typecheck fails: `Plugin<any>` types are incompatible
- Build/serve still works because Vite resolves the correct local version at runtime
- **Fix**: Upgrade `vite` in imported projects to match workspace version

**Vitest 3 (source) + Vitest 4 (dest):**
- Usually works at runtime; type conflicts may surface in shared test utilities
- **Fix**: Align vitest versions across workspace

**General strategy:**
1. After import, compare key deps: `vite`, `vitest`, `typescript`, `eslint`, framework-specific deps (including ESLint plugins like `eslint-plugin-react`, `eslint-plugin-vue`)
2. If dest uses newer versions, upgrade imported packages to match (usually safe)
3. If source uses newer versions, discuss with user — may need to upgrade dest first
4. Use `pnpm.overrides` in root `package.json` to enforce single-version policy if desired

### Module Boundaries After Import

- `@nx/enforce-module-boundaries` may flag imports between imported and existing projects
- Imported projects may lack `tags` in `package.json` or `project.json`
- **Fix**: Add appropriate tags, or update module boundary rules to accommodate new projects

### Project Name Collisions (Critical for multi-import)

When source and destination have projects with the same `name` field in `package.json`:
```
The following projects are defined in multiple locations:
- @org/api: apps/api, imported-apps/api
```

**Fix:**
1. Rename **every** conflicting `name` in imported `package.json` files (e.g. `@org/api` → `@org/teama-api`)
2. Update all `dependencies`/`devDependencies` references to new names
3. Update all import statements in source code
4. Run `pnpm install` to re-link

**For multiple sequential imports:** Prefix with team/source name: `@org/teama-shop`, `@org/teamb-shop`. The root `package.json` of each imported repo also becomes a project — rename those too.

### Workspace Dep Import Ordering

When importing projects with `"workspace:*"` dependencies, `pnpm install` will fail during `nx import` if the dependency project hasn't been imported yet. The file operations still succeed — Nx says "The import was successful, but the install failed."

**Fix:** Import all projects first, then run `pnpm install --no-frozen-lockfile` once at the end.

### `.gitkeep` Blocking Subdirectory Import

`nx import` refuses to import into a non-empty directory. The TS preset creates `packages/.gitkeep`.

**Fix:** Remove the `.gitkeep`, commit the removal (nx import requires clean working tree), then import.

---

## Non-Nx Source Issues

These apply when the source is a plain pnpm/npm workspace without `nx.json`.

### npm Script Rewriting (Critical)

Nx plugins rewrite `package.json` scripts during init, often creating broken scripts:
- `vitest run` → `nx test run` — Nx treats `run` as a project name
- `tsc && vite build` → `tsc && nx build` — The `tsc` part fails with project references
- `vite preview` → `nx preview` — Usually works

**Fix**: Remove all rewritten scripts from imported `package.json` files. Nx plugins (`@nx/vite`, `@nx/vitest`) will infer targets automatically from `vite.config.ts` and `vitest.config.ts`.

### `noEmit` → `composite` + `emitDeclarationOnly` (Critical)

Plain TypeScript projects use `"noEmit": true`, incompatible with Nx's TypeScript project references.

**Symptoms**:
- "The 'typecheck' target is disabled because one or more project references set 'noEmit: true'"
- "Referenced project may not disable emit" (TS6310)

**Fix**: In **all** imported tsconfigs (both `tsconfig.app.json` AND `tsconfig.node.json` if present — `create-vite` generates both with `noEmit`):
1. Remove `"noEmit": true`
2. Add `"composite": true`, `"emitDeclarationOnly": true`, `"declarationMap": true`
3. Add `"outDir": "dist"` and `"tsBuildInfoFile": "dist/tsconfig.tsbuildinfo"` to prevent emitted files landing in `src/`
4. Add `"extends": "../../tsconfig.base.json"` if the project tsconfig doesn't already extend the base (non-Nx sources often have standalone tsconfigs with no `extends`). Remove duplicated settings that are now inherited from the base.

Note: `create-vite` uses solution-style tsconfig (`"files": [], "references": [...]`) which doesn't extend `tsconfig.base.json`. Nx's `typescript-sync` handles project references, but base tsconfig settings (like `moduleResolution`, `lib`) won't apply to these projects unless you add `extends`.

This is safe — Vite/Vitest ignore TypeScript emit settings.

### Vite `resolve.alias` and `__dirname` Issues

**`__dirname` is undefined:**
- CJS-only global; doesn't exist in ESM context
- **Fix**: Replace with `import.meta.url` pattern:
  ```ts
  import { fileURLToPath, URL } from 'node:url';
  fileURLToPath(new URL('./src', import.meta.url))
  ```

**`@/` path alias breaks for TypeScript:**
- Vite `resolve.alias` works at runtime, but TS needs matching `"paths"` in `tsconfig.json`
- After import, `baseUrl` may point to the wrong directory
- **Fix**: Set `"baseUrl": "."` in the project-level `tsconfig.json`

**Root PostCSS/Tailwind config paths:**
- Verify `css.postcss` and Tailwind `content` globs still resolve correctly after import

### ESLint Config Handling (Non-Nx Sources)

Three scenarios depending on what the source has:

**Source has legacy `.eslintrc.json` (ESLint 8):**
```
TypeError: Cannot read properties of undefined (reading 'allowShortCircuit')
```
Fix: Delete all `.eslintrc.*` files, remove ESLint 8 deps, create `eslint.config.mjs` files matching dest's pattern, remove stale `node_modules`.

**Source has ESLint 9 flat config (`eslint.config.js` or `.mjs`):**
Self-contained flat configs (e.g. from `create-vite`) can often be left as-is without conversion. They work alongside the Nx ESLint plugin. Only convert if they reference a root config that doesn't exist in the dest.

**Source has no ESLint at all:**
You need to create both root AND project-level `eslint.config.mjs` files from scratch. See "Root ESLint Config Missing" above for the root pattern, and the React/Vue ESLint config sections for project-level patterns.

### Stale node_modules from Import

`nx import` may bring in pnpm's `node_modules` symlinks pointing to the source filesystem:
- **Fix**: After import, remove all `node_modules` in the imported tree:
  ```bash
  find imported/ -name node_modules -type d -prune -exec rm -rf {} +
  pnpm install
  ```

### Missing TypeScript `lib` and `types`

Non-Nx source tsconfigs often lack `lib` and `types` needed for Vite/Node:
- `Cannot find type definition file for 'node'`
- `Property 'env' does not exist on type 'ImportMeta'`

**Fix**: Add to tsconfig:
```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "DOM.Iterable", "ESNext.Disposable"],
    "types": ["node", "vite/client"]
  }
}
```

### @nx/vite Plugin Install Failure

Plugin init tries to load `vite.config.ts` before deps are available:
```
Cannot find module '@vitejs/plugin-react'
```

**Fix**: Install deps first, then add plugin:
```bash
pnpm add -wD vite @vitejs/plugin-react  # or @vitejs/plugin-vue
pnpm exec nx add @nx/vite
```

### TypeScript `paths` Aliases

Plain workspaces use tsconfig `"paths"` for cross-package imports. After import:
- Nx uses `package.json` `"exports"` + pnpm workspace linking instead
- If packages have proper `"exports"`, the `paths` are redundant and can be removed
- Otherwise, update paths to reflect the new directory structure

---

## React-Specific

### React Dependencies

**Production:** `react`, `react-dom`

**Dev:** `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`

**ESLint (Nx-generated sources):** `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks`

**ESLint (`create-vite` sources):** `eslint-plugin-react-refresh`, `eslint-plugin-react-hooks` (v7+) — different from Nx template deps. Self-contained flat configs from `create-vite` can be left as-is.

**Nx plugins:** `@nx/react` (generators), `@nx/vite` (build/serve), `@nx/vitest` (test), `@nx/eslint` (lint)

### React TypeScript Configuration

React projects use `"jsx": "react-jsx"` in their tsconfig. For single-framework workspaces, this can go in `tsconfig.base.json`. For mixed workspaces (React + Vue), it must be per-project — see "Mixed React + Vue" section.

### React ESLint Config

```js
import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';
export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  { files: ['**/*.ts', '**/*.tsx'], rules: {} },
];
```

### React Version Conflicts

**React 18 (source) + React 19 (dest):**
- pnpm may hoist `react-dom@19` and pair it with `react@18`
- Runtime crash: `TypeError: Cannot read properties of undefined (reading 'S')` in `react-dom-client.development.js`
- **Fix**: Align React versions. Use `pnpm.overrides` to force a single version.

### `@testing-library/jest-dom` with Vitest

If source used Jest but dest uses Vitest, the test setup may import `@testing-library/jest-dom` which augments Jest matchers:
- **Fix**: Change import to `@testing-library/jest-dom/vitest` in test-setup.ts
- Add `@testing-library/jest-dom/vitest` to tsconfig types

---

## Vue-Specific

### Vue Dependencies

**Production:** `vue` (plus `vue-router`, `pinia` if used by source)

**Dev:** `@vitejs/plugin-vue`, `vue-tsc`, `@vue/test-utils`, `jsdom`

**ESLint:** `eslint-plugin-vue`, `vue-eslint-parser`, `@vue/eslint-config-typescript`, `@vue/eslint-config-prettier`

**Nx plugins:** `@nx/vue` (generators), `@nx/vite` (build/serve), `@nx/vitest` (test), `@nx/eslint` (lint — install AFTER deps, see below)

### Vue TypeScript Configuration

Vue projects need:
```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "resolveJsonModule": true
  }
}
```

For single-framework workspaces, these can go in `tsconfig.base.json`. For mixed workspaces, they must be per-project.

### `vue-shims.d.ts` Type Declarations

Vue SFC (`.vue`) files need a type declaration so TypeScript understands their shape:
```ts
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
```

- This file exists in each Vue project's `src/` directory and imports cleanly during `nx import`
- If missing after import, create it manually
- Must be included in the project's tsconfig `include` pattern

### `vue-tsc` vs `tsc` for Type Checking

Both `@nx/js/typescript` and `@nx/vite/plugin` **auto-detect** `vue-tsc` when it's installed and the project has `.vue` files — they use `vue-tsc --build --emitDeclarationOnly` instead of `tsc`. No manual configuration needed once `vue-tsc` is installed.

However, the `@nx/vite/plugin` typecheck target name defaults to `"vite:typecheck"` not `"typecheck"`. If both plugins exist, `@nx/js/typescript`'s `tsc`-based `typecheck` wins. See "Plugin Detection and Configuration" above.

Source scripts like `"typecheck": "vue-tsc --noEmit"` and `"build": "vue-tsc && vite build"` should be removed — let Nx infer targets.

### `vue-tsc` Emitting `.d.ts` into `src/` (Non-Nx Sources)

When importing non-Nx Vue projects with `"noEmit": true` and no `outDir`, the dest's `composite: true` + `emitDeclarationOnly: true` overrides `noEmit`. Without `outDir`, `vue-tsc --build` emits `.vue.d.ts` alongside source files.

**Fix:**
1. Add `"outDir": "dist"` and `"tsBuildInfoFile": "dist/tsconfig.tsbuildinfo"` to each Vue project's tsconfig
2. Add `"rootDir": "src"` if applicable
3. Add `**/*.vue.d.ts` to ESLint ignores
4. Delete stale `.d.ts` files from `src/`

### ESLint Plugin Installation Order (Critical)

`@nx/eslint` plugin initialization **will crash** if Vue ESLint dependencies aren't installed first. The plugin loads all `eslint.config.mjs` files, and Vue configs dynamically import `eslint-plugin-vue` and `@typescript-eslint/parser`.

**Error:**
```
Cannot read properties of undefined (reading 'version')
```

**Correct order:**
1. Install all ESLint deps first: `pnpm add -wD eslint@^9 eslint-plugin-vue vue-eslint-parser @vue/eslint-config-typescript @typescript-eslint/parser @nx/eslint-plugin typescript-eslint`
2. Create root `eslint.config.mjs` if it doesn't exist
3. Then `npx nx add @nx/eslint`

If `nx add @nx/eslint` still fails, install directly and manually add to `nx.json` plugins array.

### Vue ESLint Config Pattern

```js
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
];
```

**Important:** The `vue-eslint-parser` override must come **AFTER** the base config. `@nx/eslint-plugin`'s `flat/typescript` sets the typescript-eslint parser globally without a `files` filter, which breaks `.vue` parsing. The Vue parser override in a later config entry fixes this.

**`vue-eslint-parser` must be an explicit dependency** in pnpm monorepos — even though `eslint-plugin-vue` depends on it, pnpm's strict resolution prevents direct import.

**CNW bug:** The `vue-monorepo` preset generates an ESLint config that uses `await import('@typescript-eslint/parser')` without `vue-eslint-parser`, which fails to parse TypeScript in `.vue` files. Use the pattern above instead.

---

## Mixed React + Vue in Same Workspace

When importing both React and Vue projects into the same workspace, several settings become per-project instead of global.

### tsconfig `jsx` — Per-Project Only

- React: `"jsx": "react-jsx"` in project tsconfig
- Vue: `"jsx": "preserve"` + `"jsxImportSource": "vue"` in project tsconfig
- Root `tsconfig.base.json`: **NO** `jsx` setting — these are mutually exclusive

### Typecheck — `@nx/vite/plugin` Auto-Detects Framework

`@nx/vite/plugin` uses `vue-tsc` for Vue projects and `tsc` for React projects automatically (detects `.vue` files or `@vitejs/plugin-vue` in vite config).

**Recommended nx.json** — use `@nx/vite/plugin` for Vite projects, rename `@nx/js/typescript` to avoid conflicts:
```json
{
  "plugins": [
    { "plugin": "@nx/eslint/plugin", "options": { "targetName": "lint" } },
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "typecheckTargetName": "typecheck",
        "testTargetName": "test"
      }
    }
  ]
}
```

If all projects use Vite, remove `@nx/js/typescript` entirely. If you have non-Vite pure TS libraries (e.g. `@nx/esbuild` libs), keep `@nx/js/typescript` but rename its typecheck target to `"tsc-typecheck"` to avoid conflicts with `@nx/vite/plugin`.

Run `npx nx reset` after plugin config changes.

### ESLint — Three-Tier Config

1. **Root**: Base rules only (`@nx/eslint-plugin` flat configs, `@nx/enforce-module-boundaries`, ignores). No framework-specific rules.
2. **React projects**: Extend root + `nx.configs['flat/react']`
3. **Vue projects**: Extend root + `vue.configs['flat/recommended']` + `vue-eslint-parser`

**Required packages:**
- Shared: `eslint@^9`, `@nx/eslint-plugin`, `typescript-eslint`, `@typescript-eslint/parser`
- React: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks`
- Vue: `eslint-plugin-vue`, `vue-eslint-parser`

**No `@nx/react` / `@nx/vue` plugin conflicts:** These are for generators only. Target inference comes from `@nx/vite/plugin`.

---

## Verification & Fix Orders

### Verification Sequence

```bash
nx sync --yes            # Fix TypeScript project references
nx reset                 # Clear stale caches
nx run-many -t typecheck,build,test,lint   # Full verification
```

### Fix Order: Nx Source

1. Fix `pnpm-workspace.yaml` globs → `pnpm install`
2. Run `nx sync --yes` (may need `nx reset` first)
3. Add missing root dependencies (`pnpm add -wD ...`)
4. Fix explicit executor paths in `package.json` / `project.json`
5. Merge `targetDefaults` from source `nx.json` (e.g. `@nx/esbuild:esbuild` `dependsOn: ["^build"]`)
7. Fix module resolution in `tsconfig.base.json` (`nodenext` → `bundler`)
8. Add `dom`, `dom.iterable` to tsconfig `lib` array
9. Configure `@nx/vite/plugin` typecheck target name in `nx.json`
10. **React**: Add `jsx: "react-jsx"` to root or per-project tsconfig
11. **Vue**: Add `jsx: "preserve"`, `jsxImportSource: "vue"` to root or per-project tsconfig
12. **Vue**: Verify `vue-shims.d.ts` exists in each project's `src/`
13. **Vue ESLint**: Install all deps before `@nx/eslint` plugin (pin ESLint to v9)
14. **Vue ESLint**: Create root `eslint.config.mjs` if using subdirectory import
15. **Mixed**: Set `jsx` per-project; rename `@nx/js/typescript` typecheck target (or remove if no pure TS libs)
16. Run full verification

### Fix Order: Non-Nx Source (additional steps)

1. Remove stale `node_modules` from imported tree
2. Fix `pnpm-workspace.yaml` globs → `pnpm install`
3. Remove rewritten npm scripts (let Nx infer targets)
4. Fix `noEmit: true` → `composite: true` + `emitDeclarationOnly: true` + `outDir: "dist"`
5. Add missing `lib` and `types` to tsconfig
6. Fix Vite `resolve.alias`: `__dirname` → `import.meta.url`, `baseUrl` in project tsconfigs
7. Convert legacy `.eslintrc.json` to flat `eslint.config.mjs`
8. Remove old ESLint 8 / `@typescript-eslint/*` v7 deps
9. Move project-level `devDependencies` to workspace root
10. Run `nx sync --yes` → `nx reset` → `nx sync --yes` (may need two passes)
11. Add missing root dependencies
12. If `@nx/vite` failed during import, install manually
13. **Vue**: Add `outDir` to prevent `.d.ts` emission into `src/`, add `**/*.vue.d.ts` to ESLint ignores
14. Run full verification

### Fix Order: Multiple-Source Imports

1. Rename all conflicting project names before running `nx show projects`
2. Update cross-package dependency references (both `package.json` and source code imports)
3. Fix hardcoded tsconfig `references` paths — when importing into alternate directories (e.g. `apps-beta/`, `libs-beta/`), imported projects have relative paths like `../../libs/shared/models/tsconfig.lib.json` that now point to the wrong directory. Update to `../../libs-beta/...` etc.
4. For multi-level lib structures (e.g. `libs/api/*`, `libs/shared/*`), add all necessary glob patterns to `pnpm-workspace.yaml`
5. Each import creates a separate merge commit — don't squash these
6. Consider renaming with a team/source prefix pattern for clarity

### Quick Reference: React vs Vue

| Aspect | React | Vue |
|--------|-------|-----|
| Vite plugin | `@vitejs/plugin-react` | `@vitejs/plugin-vue` |
| Type checker | `tsc` | `vue-tsc` (auto-detected by Nx) |
| SFC support | N/A | `vue-shims.d.ts` needed |
| tsconfig jsx | `"react-jsx"` | `"preserve"` + `"jsxImportSource": "vue"` |
| ESLint parser | Standard TS | `vue-eslint-parser` + TS sub-parser |
| ESLint setup | Straightforward | Must install deps before `@nx/eslint` plugin |
| Test utils | `@testing-library/react` | `@vue/test-utils` |
