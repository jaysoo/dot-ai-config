# Scenario 6: Two React Nx Sources with Overlapping Names -> Nx TS Workspace

**Date**: 2026-02-28
**Status**: PASS -- all 20 projects pass typecheck, build, test, lint

---

## Setup

### Step 1: Create Destination TS Workspace

```bash
cd /tmp/vite-test-s6
npx create-nx-workspace@latest dest --preset=ts --no-interactive --pm=pnpm
```

Created Nx v22.5.3 workspace with:
- `tsconfig.base.json`: `module: "nodenext"`, `moduleResolution: "nodenext"`, `lib: ["es2022"]`
- `pnpm-workspace.yaml`: `packages: ['packages/*']`
- `packages/.gitkeep` (blocks imports -- per VITE.md)

### Step 2: Create Source A (React Monorepo)

```bash
npx create-nx-workspace@latest source-a --preset=react-monorepo --appName=portal --no-interactive --pm=pnpm
```

**NOTE**: The `--appName=portal` flag was ignored by the template. Generated app name: `shop` (not `portal`).
This is a template bug but doesn't affect the test -- both sources still have identical names (`@org/shop`, `@org/api`, etc.), which is what we need for collision testing.

Generated structure (source-a and source-b are identical):
- `apps/shop` (`@org/shop`) -- React Vite app
- `apps/api` (`@org/api`) -- Express API with @nx/esbuild
- `apps/shop-e2e` (`@org/shop-e2e`) -- Playwright e2e
- `libs/api/products` (`@org/api-products`)
- `libs/shared/models` (`@org/models`)
- `libs/shared/test-utils` (`@org/shared-test-utils`)
- `libs/shop/data` (`@org/shop-data`)
- `libs/shop/feature-product-detail` (`@org/shop-feature-product-detail`)
- `libs/shop/feature-products` (`@org/shop-feature-products`)
- `libs/shop/shared-ui` (`@org/shop-shared-ui`)

Root package name: `@org/source` (both sources have this same name)

### Step 3: Create Source B (React Monorepo)

```bash
npx create-nx-workspace@latest source-b --preset=react-monorepo --appName=portal --no-interactive --pm=pnpm
```

Same identical structure as source-a. Both already committed by create-nx-workspace.

---

## Import Process

### Step 4: Prepare Dest

```bash
cd /tmp/vite-test-s6/dest
rm packages/.gitkeep
git add -A && git commit -m "remove .gitkeep"
```

Per VITE.md: `.gitkeep Blocking Subdirectory Import` section. Required because `nx import` refuses non-empty directories.

### Step 5: Import Source A (subdirectory-at-a-time)

Imported each directory separately:

```bash
npx nx import /tmp/vite-test-s6/source-a apps/shop --ref=main --source=apps/shop --no-interactive
npx nx import /tmp/vite-test-s6/source-a apps/api --ref=main --source=apps/api --no-interactive
npx nx import /tmp/vite-test-s6/source-a apps/shop-e2e --ref=main --source=apps/shop-e2e --no-interactive
npx nx import /tmp/vite-test-s6/source-a libs/api/products --ref=main --source=libs/api/products --no-interactive
npx nx import /tmp/vite-test-s6/source-a libs/shared/models --ref=main --source=libs/shared/models --no-interactive
npx nx import /tmp/vite-test-s6/source-a libs/shared/test-utils --ref=main --source=libs/shared/test-utils --no-interactive
npx nx import /tmp/vite-test-s6/source-a libs/shop/data --ref=main --source=libs/shop/data --no-interactive
npx nx import /tmp/vite-test-s6/source-a libs/shop/feature-product-detail --ref=main --source=libs/shop/feature-product-detail --no-interactive
npx nx import /tmp/vite-test-s6/source-a libs/shop/feature-products --ref=main --source=libs/shop/feature-products --no-interactive
npx nx import /tmp/vite-test-s6/source-a libs/shop/shared-ui --ref=main --source=libs/shop/shared-ui --no-interactive
```

Each import:
1. Created a merge commit
2. Added an individual path entry to `pnpm-workspace.yaml` (e.g., `apps/shop`, not `apps/*`)
3. Failed `pnpm install` because workspace deps (`@org/models`, etc.) weren't present yet

Per VITE.md: `Workspace Dep Import Ordering` -- this is expected. Import all projects first, install once at the end.

### Step 6: Import Source B into Alternate Directories

```bash
npx nx import /tmp/vite-test-s6/source-b apps-beta/shop --ref=main --source=apps/shop --no-interactive
npx nx import /tmp/vite-test-s6/source-b apps-beta/api --ref=main --source=apps/api --no-interactive
npx nx import /tmp/vite-test-s6/source-b apps-beta/shop-e2e --ref=main --source=apps/shop-e2e --no-interactive
npx nx import /tmp/vite-test-s6/source-b libs-beta/api/products --ref=main --source=libs/api/products --no-interactive
npx nx import /tmp/vite-test-s6/source-b libs-beta/shared/models --ref=main --source=libs/shared/models --no-interactive
npx nx import /tmp/vite-test-s6/source-b libs-beta/shared/test-utils --ref=main --source=libs/shared/test-utils --no-interactive
npx nx import /tmp/vite-test-s6/source-b libs-beta/shop/data --ref=main --source=libs/shop/data --no-interactive
npx nx import /tmp/vite-test-s6/source-b libs-beta/shop/feature-product-detail --ref=main --source=libs/shop/feature-product-detail --no-interactive
npx nx import /tmp/vite-test-s6/source-b libs-beta/shop/feature-products --ref=main --source=libs/shop/feature-products --no-interactive
npx nx import /tmp/vite-test-s6/source-b libs-beta/shop/shared-ui --ref=main --source=libs/shop/shared-ui --no-interactive
```

Result: `pnpm-workspace.yaml` now has 20 individual entries (no glob patterns).

---

## Fix Process (Following VITE.md)

### Fix 1: Rename Conflicting Project Names (VITE.md: "Project Name Collisions")

**APPLICABLE: YES -- Critical**

Every project in `apps-beta/` and `libs-beta/` had an identical `name` to its counterpart in `apps/` and `libs/`:

| Original Name | Renamed To |
|---|---|
| `@org/shop` | `@org/beta-shop` |
| `@org/api` | `@org/beta-api` |
| `@org/shop-e2e` | `@org/beta-shop-e2e` |
| `@org/models` | `@org/beta-models` |
| `@org/api-products` | `@org/beta-api-products` |
| `@org/shared-test-utils` | `@org/beta-shared-test-utils` |
| `@org/shop-data` | `@org/beta-shop-data` |
| `@org/shop-feature-product-detail` | `@org/beta-shop-feature-product-detail` |
| `@org/shop-feature-products` | `@org/beta-shop-feature-products` |
| `@org/shop-shared-ui` | `@org/beta-shop-shared-ui` |

Used Python script to:
1. Rename `name` in all `apps-beta/*/package.json` and `libs-beta/**/package.json`
2. Update `dependencies` and `devDependencies` references to renamed packages
3. Update all `import ... from '@org/...'` statements in `.ts`/`.tsx` files

**VITE.md accuracy**: Correct. The prefix pattern recommendation (`@org/teama-shop`, `@org/teamb-shop`) worked well. VITE.md also correctly notes "The root `package.json` of each imported repo also becomes a project -- rename those too" -- though in this case the root `package.json` kept its name `@org/source` since only subdirectories were imported.

**NOTE**: Initial attempt with `sed` in fish shell failed silently due to `!` character handling. Had to redo with Python. This is a shell-specific gotcha, not a VITE.md issue.

### Fix 2: Update Internal Import Statements

**APPLICABLE: YES -- Critical**

16 files in `apps-beta/` and `libs-beta/` contained `import ... from '@org/models'` etc. that needed to be changed to `from '@org/beta-models'`.

**VITE.md accuracy**: VITE.md mentions updating "all import statements in source code" under Project Name Collisions. Correct and necessary.

### Fix 3: Fix pnpm-workspace.yaml Globs (VITE.md: "pnpm Workspace Globs")

**APPLICABLE: YES -- Critical**

**BEFORE** (after import -- 20 individual entries):
```yaml
packages:
  - 'packages/*'
  - apps/shop
  - apps/api
  - apps/shop-e2e
  - libs/api/products
  - libs/shared/models
  - libs/shared/test-utils
  - libs/shop/data
  - libs/shop/feature-product-detail
  - libs/shop/feature-products
  - libs/shop/shared-ui
  - apps-beta/shop
  - apps-beta/api
  - apps-beta/shop-e2e
  - libs-beta/api/products
  - libs-beta/shared/models
  - libs-beta/shared/test-utils
  - libs-beta/shop/data
  - libs-beta/shop/feature-product-detail
  - libs-beta/shop/feature-products
  - libs-beta/shop/shared-ui
```

**AFTER** (with proper globs):
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'apps-beta/*'
  - 'libs/api/products'
  - 'libs/shared/*'
  - 'libs/shop/*'
  - 'libs-beta/api/products'
  - 'libs-beta/shared/*'
  - 'libs-beta/shop/*'
```

**VITE.md accuracy**: Correct. VITE.md says `nx import` adds individual paths not globs. The fix to use glob patterns is essential. Note: `libs/api/products` and `libs-beta/api/products` remain as specific entries since `libs/api/*` would also be valid but `api/` only has one package.

### Fix 4: Remove Stale node_modules (VITE.md: "Stale node_modules from Import")

**APPLICABLE: YES**

Found 16 stale `node_modules` directories inside imported dirs (symlinks pointing to source filesystem).

```bash
find apps apps-beta libs libs-beta -name node_modules -type d -prune -exec rm -rf {} +
```

**VITE.md accuracy**: Correct. This was needed.

### Fix 5: Module Resolution (VITE.md: "Module Resolution: bundler vs nodenext")

**APPLICABLE: YES -- Critical**

**BEFORE** (`tsconfig.base.json`):
```json
{
  "compilerOptions": {
    "lib": ["es2022"],
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

**AFTER**:
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["es2022", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```

Combined three VITE.md sections:
- `Module Resolution: bundler vs nodenext` -- changed nodenext -> bundler/esnext
- `tsconfig lib Array` -- added dom, dom.iterable
- `React TypeScript Configuration` -- added jsx: react-jsx (single-framework, so goes in base)

**VITE.md accuracy**: All three correct and necessary.

### Fix 6: Fix `lib` Array Override in Project tsconfigs (VITE.md: "tsconfig lib Array")

**APPLICABLE: YES**

Both `apps/shop/tsconfig.app.json` and `apps-beta/shop/tsconfig.app.json` had:
```json
"lib": ["dom"]
```

This REPLACES the base `["es2022", "dom", "dom.iterable"]`, losing `es2022`.

**AFTER**:
```json
"lib": ["es2022", "dom", "dom.iterable"]
```

**VITE.md accuracy**: The "Gotcha" about TypeScript not merging `lib` arrays is exactly correct and was necessary to catch.

### Fix 7: Fix Hardcoded tsconfig References (VITE.md: "Multiple-Source Imports")

**APPLICABLE: YES -- Critical**

Beta apps' tsconfig.app.json files had references to `../../libs/` instead of `../../libs-beta/`:

**BEFORE** (`apps-beta/shop/tsconfig.app.json`):
```json
"references": [
  { "path": "../../libs/shop/shared-ui/tsconfig.lib.json" },
  { "path": "../../libs/shop/feature-products/tsconfig.lib.json" },
  { "path": "../../libs/shop/feature-product-detail/tsconfig.lib.json" },
  { "path": "../../libs/shop/data/tsconfig.lib.json" },
  { "path": "../../libs/shared/models/tsconfig.lib.json" }
]
```

**AFTER**:
```json
"references": [
  { "path": "../../libs-beta/shop/shared-ui/tsconfig.lib.json" },
  { "path": "../../libs-beta/shop/feature-products/tsconfig.lib.json" },
  { "path": "../../libs-beta/shop/feature-product-detail/tsconfig.lib.json" },
  { "path": "../../libs-beta/shop/data/tsconfig.lib.json" },
  { "path": "../../libs-beta/shared/models/tsconfig.lib.json" }
]
```

Same fix for `apps-beta/api/tsconfig.app.json` (2 references).

Note: References within `libs-beta/` were correct because they use relative paths that stay within the `libs-beta/` subtree (e.g. `../../shared/models/` from `libs-beta/shop/data/` correctly resolves to `libs-beta/shared/models/`).

**VITE.md accuracy**: The "Fix hardcoded tsconfig references paths" advice under "Multiple-Source Imports" is correct. The phrasing could be more explicit about when intra-beta references are fine vs when they break.

**OBSERVATION**: After `nx sync`, Nx added BOTH `libs/` and `libs-beta/` references to the beta app tsconfigs. This appears harmless since both sets of packages exist and have valid tsconfig.lib.json files. However, it means the beta apps technically reference the non-beta libs too (via TS project references). This did not cause issues in practice.

### Fix 8: Fix Explicit Executor Paths (VITE.md: "Explicit Executor Path Fixups")

**APPLICABLE: YES**

`apps-beta/api/package.json` had explicit executor paths pointing to `apps/api/`:

**BEFORE**:
```json
"outputPath": "apps/api/dist",
"main": "apps/api/src/main.ts",
"tsConfig": "apps/api/tsconfig.app.json",
"assets": ["apps/api/src/assets"],
"outputs": ["{workspaceRoot}/apps/api/dist/..."]
```

**AFTER**:
```json
"outputPath": "apps-beta/api/dist",
"main": "apps-beta/api/src/main.ts",
"tsConfig": "apps-beta/api/tsconfig.app.json",
"assets": ["apps-beta/api/src/assets"],
"outputs": ["{workspaceRoot}/apps-beta/api/dist/..."]
```

Also fixed `buildTarget` references from `@org/api:build` to `@org/beta-api:build`.

**VITE.md accuracy**: Correct. The advice to "prefix these paths with the import destination directory" is accurate, but should also mention fixing `buildTarget` project name references (not just file paths).

### Fix 9: Add Missing Root Dependencies (VITE.md: "Root Dependencies and Config Not Imported")

**APPLICABLE: YES -- Critical**

The dest workspace only had `@nx/js`, `nx`, `typescript` and a few SWC deps. All React, Vite, testing, and ESLint deps had to be added.

**Key deps added**:
- Production: `react`, `react-dom`, `react-router-dom`, `express`
- Dev (Nx plugins): `@nx/vite`, `@nx/vitest`, `@nx/eslint`, `@nx/react`, `@nx/esbuild`, `@nx/node`, `@nx/playwright`, `@nx/web`, `@nx/workspace`, `@nx/eslint-plugin`, `@nx/devkit`
- Dev (React): `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/dom`
- Dev (Vite/Vitest): `vite`, `vitest`, `@vitest/coverage-v8`, `@vitest/ui`, `jsdom`
- Dev (ESLint): `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-config-prettier`, `typescript-eslint`, `@eslint/js`, `jsonc-eslint-parser`, `eslint-plugin-playwright`
- Dev (Build/Node): `esbuild`, `@babel/core`, `@babel/preset-react`, `@swc/cli`, `@types/node`, `@playwright/test`, `jiti`, `supertest`, `@types/supertest`, `@types/express`, `ts-node`

```bash
pnpm add -w react@19.0.0 react-dom@19.0.0 react-router-dom@6.30.3 express@^4.21.2
pnpm add -wD @nx/vite@22.5.1 @nx/vitest@22.5.1 @nx/eslint@22.5.1 @nx/react@22.5.1 ... (full list above)
```

**VITE.md accuracy**: Correct. The section correctly warns that deps are not imported and lists common deps by framework. The actual list needed was much larger than what VITE.md's "Common deps" section implies -- the react-monorepo template includes @nx/esbuild, @babel/*, @swc/cli, express, etc. that aren't mentioned in the React-specific section.

### Fix 10: Configure Plugins in nx.json (VITE.md: "Plugin Detection and Configuration")

**APPLICABLE: YES -- Critical**

**BEFORE** (dest nx.json -- only `@nx/js/typescript`):
```json
{
  "plugins": [
    { "plugin": "@nx/js/typescript", "options": { ... } }
  ]
}
```

**AFTER** (replicated from source, with beta-specific additions):
```json
{
  "plugins": [
    {
      "plugin": "@nx/js/typescript",
      "options": { "typecheck": { "targetName": "typecheck" }, "build": { ... } },
      "exclude": ["libs/shared/models/*", "libs-beta/shared/models/*"]
    },
    { "plugin": "@nx/eslint/plugin", "options": { "targetName": "lint" } },
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "typecheckTargetName": "typecheck",
        "testTargetName": "test",
        ...
      }
    },
    { "plugin": "@nx/playwright/plugin", "options": { "targetName": "e2e" } },
    {
      "plugin": "@nx/js/typescript",
      "include": ["libs/shared/models/*", "libs-beta/shared/models/*"],
      "options": { "typecheck": { "targetName": "typecheck" } }
    },
    { "plugin": "@nx/vitest", "options": { "testTargetName": "test" } }
  ],
  "targetDefaults": {
    "test": { "dependsOn": ["^build"] },
    "@nx/esbuild:esbuild": { "cache": true, "dependsOn": ["^build"], "inputs": ["production", "^production"] },
    "@nx/js:tsc": { "cache": true, "dependsOn": ["^build"], "inputs": ["production", "^production"] }
  }
}
```

Key changes:
- Added `@nx/vite/plugin` with `typecheckTargetName: "typecheck"` (per VITE.md)
- Added `@nx/eslint/plugin`, `@nx/playwright/plugin`, `@nx/vitest`
- Extended `exclude`/`include` for `@nx/js/typescript` to cover `libs-beta/`
- Added `targetDefaults` from source (critical for esbuild build ordering)

**VITE.md accuracy**: Correct. The advice about subdirectory imports not auto-detecting plugins is accurate. The note about `@nx/vite/plugin` defaulting `typecheckTargetName` to `"vite:typecheck"` instead of `"typecheck"` is important. The advice to include/exclude patterns for alternate directories is correct.

**VITE.md gap**: VITE.md doesn't mention that `targetDefaults` must also be merged from source `nx.json`. This is covered under "Root Dependencies and Config Not Imported" but only in passing. The `@nx/esbuild:esbuild` targetDefault with `dependsOn: ["^build"]` was critical for the API app builds.

### Fix 11: Create Root ESLint Config (VITE.md: "Root ESLint Config Missing After Subdirectory Import")

**APPLICABLE: YES**

Created `eslint.config.mjs` at workspace root, copied from source-a's root config.

**VITE.md accuracy**: Correct. The provided template worked without modification.

**Note**: VITE.md says to also install `typescript-eslint` explicitly. This was included in the deps install step and was indeed needed.

### Fix 12: nx sync and nx reset

```bash
npx nx reset
npx nx sync --yes
```

**VITE.md accuracy**: The "Verification Sequence" is correct.

**OBSERVATION**: `nx sync` added extra tsconfig references to the beta app tsconfigs, adding references to BOTH `libs/` and `libs-beta/` directories. This is because pnpm workspace resolution resolves `@org/beta-shop-data` to `libs-beta/shop/data/`, but `nx sync` seems to add references based on dependency graph analysis that considers transitive dependencies. The extra references to `libs/` are technically unnecessary but don't cause errors.

---

## VITE.md Section Applicability

| VITE.md Section | Applicable? | Notes |
|---|---|---|
| Import Strategy: Whole Repo vs Subdirectories | YES | Used subdirectory-at-a-time as recommended |
| pnpm Workspace Globs | YES | Critical fix |
| Root Dependencies and Config Not Imported | YES | Critical -- massive dep list |
| TypeScript Project References | YES | nx sync handled it |
| Module Resolution: bundler vs nodenext | YES | Critical -- must change base |
| tsconfig lib Array | YES | Critical -- dom/dom.iterable |
| Explicit Executor Path Fixups | YES | API app had explicit paths |
| Plugin Detection and Configuration | YES | Critical -- must replicate all plugins |
| Redundant Root Files | NO | Subdirectory import, N/A |
| Root ESLint Config Missing | YES | Had to create it |
| ESLint Version Pinning | NO | ESLint 9 was installed, no v10 conflict |
| Dependency Version Conflicts | NO | Both sources were identical versions |
| Module Boundaries After Import | NO | Not tested, no cross-source imports |
| Project Name Collisions | YES | Critical -- every name collided |
| Workspace Dep Import Ordering | YES | Expected pnpm install failures during import |
| .gitkeep Blocking Subdirectory Import | YES | Had to remove and commit |
| Non-Nx Source Issues | NO | Both sources are Nx workspaces |
| React-Specific Dependencies | YES | Used dep list guidance |
| React TypeScript Configuration | YES | jsx: react-jsx |
| React ESLint Config | NO | Used source's existing configs |
| Mixed React + Vue | NO | Both sources are React only |
| Fix Order: Nx Source | YES | Followed this order |
| Fix Order: Multiple-Source Imports | YES | Critical -- followed all steps |

---

## Issues NOT Covered by VITE.md (Gaps)

### Gap 1: `--appName` Flag Ignored by Template
The `react-monorepo` template ignores `--appName=portal` and always generates `shop`. This is a CNW template bug, not VITE.md's responsibility, but affects the scenario setup.

### Gap 2: `sed` in Fish Shell Fails Silently
The `!` character in shell patterns causes issues in fish shell. Not a VITE.md gap per se, but worth noting that string replacement is best done with a script (Python/Node) rather than shell one-liners.

### Gap 3: `targetDefaults` Merging Not Emphasized Enough
VITE.md mentions under "Root Dependencies and Config Not Imported" that `targetDefaults` need merging, but lists it as a minor note. In practice, the `@nx/esbuild:esbuild` targetDefault with `dependsOn: ["^build"]` was critical for the API apps to build correctly. This deserves its own sub-heading or stronger callout.

### Gap 4: `buildTarget` Project Name References in Executor Config
VITE.md's "Explicit Executor Path Fixups" section mentions fixing paths like `main`, `outputPath`, `tsConfig`, etc. But it doesn't mention fixing `buildTarget` references that include the project name (e.g., `"buildTarget": "@org/api:build"` must become `"buildTarget": "@org/beta-api:build"`). This is a separate class of fix from file path prefixing.

### Gap 5: `nx sync` Behavior with Multi-Source Imports
After renaming packages and fixing references, `nx sync` added references to BOTH `libs/` and `libs-beta/` in the beta app tsconfigs. This is because `nx sync` sees the full dependency graph. VITE.md doesn't describe this behavior or whether the extra references are intentional/safe. In this test, they were harmless.

### Gap 6: Plugin `include`/`exclude` for Multiple `@nx/js/typescript` Instances
The source nx.json had two instances of `@nx/js/typescript` -- one with `exclude: ["libs/shared/models/*"]` and one with `include: ["libs/shared/models/*"]`. When duplicating for beta, both needed updating. VITE.md mentions checking include/exclude patterns but doesn't explicitly cover the case of multiple plugin instances of the same plugin.

### Gap 7: Root `package.json` Name Collision
Both sources and dest all had `"name": "@org/source"` as the root package.json name. This wasn't a problem because root package.json doesn't create an Nx project, but in some pnpm setups it could cause issues. VITE.md's collision section focuses on project-level packages only.

---

## VITE.md Advice That Was Wrong or Unnecessary

### None Found

Every piece of VITE.md advice that was applicable to this scenario was correct. No advice was wrong or counterproductive. The document accurately describes:
- The subdirectory import strategy
- The pnpm workspace globs fix
- The module resolution change
- The tsconfig lib array gotcha
- The project name collision resolution
- The eslint config creation
- The plugin configuration requirements
- The executor path fixes

---

## Final Verification

```
$ npx nx run-many -t typecheck,build,test,lint

NX   Successfully ran targets typecheck, build, test, lint for 20 projects

Nx read the output from the cache instead of running the command for 60 out of 60 tasks.
```

All 20 projects (10 from source-a, 10 from source-b) pass all 4 targets.

**Project list**:
```
@org/shop                              (apps/shop)
@org/api                               (apps/api)
@org/shop-e2e                          (apps/shop-e2e)
@org/models                            (libs/shared/models)
@org/api-products                      (libs/api/products)
@org/shared-test-utils                 (libs/shared/test-utils)
@org/shop-data                         (libs/shop/data)
@org/shop-feature-product-detail       (libs/shop/feature-product-detail)
@org/shop-feature-products             (libs/shop/feature-products)
@org/shop-shared-ui                    (libs/shop/shared-ui)
@org/beta-shop                         (apps-beta/shop)
@org/beta-api                          (apps-beta/api)
@org/beta-shop-e2e                     (apps-beta/shop-e2e)
@org/beta-models                       (libs-beta/shared/models)
@org/beta-api-products                 (libs-beta/api/products)
@org/beta-shared-test-utils            (libs-beta/shared/test-utils)
@org/beta-shop-data                    (libs-beta/shop/data)
@org/beta-shop-feature-product-detail  (libs-beta/shop/feature-product-detail)
@org/beta-shop-feature-products        (libs-beta/shop/feature-products)
@org/beta-shop-shared-ui               (libs-beta/shop/shared-ui)
```

---

## Final Config Files

### tsconfig.base.json
```json
{
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "importHelpers": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "lib": ["es2022", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "skipLibCheck": true,
    "strict": true,
    "target": "es2022",
    "customConditions": ["@org/source"]
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'apps-beta/*'
  - 'libs/api/products'
  - 'libs/shared/*'
  - 'libs/shop/*'
  - 'libs-beta/api/products'
  - 'libs-beta/shared/*'
  - 'libs-beta/shop/*'
```

### eslint.config.mjs
```js
import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/test-output',
      '**/out-tsc'
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            { sourceTag: '*', onlyDependOnLibsWithTags: ['*'] },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
    rules: {},
  },
];
```

### nx.json (key sections)
```json
{
  "plugins": [
    {
      "plugin": "@nx/js/typescript",
      "exclude": ["libs/shared/models/*", "libs-beta/shared/models/*"],
      "options": { "typecheck": { "targetName": "typecheck" }, "build": { ... } }
    },
    { "plugin": "@nx/eslint/plugin", "options": { "targetName": "lint" } },
    {
      "plugin": "@nx/vite/plugin",
      "options": { "typecheckTargetName": "typecheck", "buildTargetName": "build", ... }
    },
    { "plugin": "@nx/playwright/plugin", "options": { "targetName": "e2e" } },
    {
      "plugin": "@nx/js/typescript",
      "include": ["libs/shared/models/*", "libs-beta/shared/models/*"],
      "options": { "typecheck": { "targetName": "typecheck" } }
    },
    { "plugin": "@nx/vitest", "options": { "testTargetName": "test" } }
  ],
  "targetDefaults": {
    "test": { "dependsOn": ["^build"] },
    "@nx/esbuild:esbuild": { "cache": true, "dependsOn": ["^build"] },
    "@nx/js:tsc": { "cache": true, "dependsOn": ["^build"] }
  }
}
```

---

## Summary

VITE.md comprehensively covers the multi-import scenario. The fix order from "Fix Order: Multiple-Source Imports" plus "Fix Order: Nx Source" provided a reliable sequence. The 7 gaps identified are relatively minor -- mostly about emphasizing certain fixes more strongly or covering edge cases. No advice was incorrect.

**Total fixes applied**: 12 (rename packages, update imports, fix globs, remove stale node_modules, fix module resolution, fix lib array, fix tsconfig references, fix executor paths, add deps, configure plugins, create eslint config, nx sync/reset).
**Total files modified**: ~40+ (package.json files, tsconfig files, source code imports, workspace configs).
