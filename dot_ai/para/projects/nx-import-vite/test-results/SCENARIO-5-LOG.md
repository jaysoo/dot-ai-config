# Scenario 5: Mixed React + Vue from Two Sources -> Nx TS Workspace

## Summary

**Result: ALL PASS** -- 26/26 tasks across 9 projects (typecheck, build, test, lint)

**Workspace structure after import:**
- React app: `apps/shop` (from react-source)
- React libs: `libs/shop/*` (4 libs), `libs/shared/*` (2 libs), `libs/api/products` (from react-source)
- Vue app: `apps/admin` (from vue-source)
- Total projects: 9

---

## Step 1: Create Workspaces

### Dest (TS preset)
```bash
cd /tmp/vite-test-s5
npx create-nx-workspace@latest dest --preset=ts --no-interactive --pm=pnpm
```
Created v22.5.3 workspace with `@nx/js/typescript` plugin and `nodenext` module resolution.

### React Source (react-monorepo preset)
```bash
npx create-nx-workspace@latest react-source --preset=react-monorepo --appName=shop --no-interactive --pm=pnpm
```
Created v22.5.1 workspace with:
- `apps/shop` (React app with Vite)
- `apps/api` (Express API with esbuild)
- `apps/shop-e2e` (Playwright)
- `libs/shop/*` (4 React libs: data, feature-product-detail, feature-products, shared-ui)
- `libs/shared/*` (2 shared libs: models, test-utils)
- `libs/api/products` (Node.js lib)
- Plugins: `@nx/vite/plugin`, `@nx/eslint/plugin`, `@nx/js/typescript`, `@nx/react/router-plugin`, `@nx/vitest`, `@nx/playwright/plugin`

### Vue Source (vue-monorepo preset)
```bash
npx create-nx-workspace@latest vue-source --preset=vue-monorepo --appName=admin --no-interactive --pm=pnpm
```
Created v22.5.3 workspace with:
- `apps/admin` (Vue app with Vite)
- `apps/admin-e2e` (Playwright)
- Plugins: `@nx/vite/plugin`, `@nx/eslint/plugin`, `@nx/js/typescript`, `@nx/vitest`, `@nx/playwright/plugin`

---

## Step 2: Commit Sources

Both sources were already committed by `create-nx-workspace`. No action needed.

---

## Step 3: Remove .gitkeep

```bash
cd /tmp/vite-test-s5/dest
rm packages/.gitkeep
git add -A && git commit -m "remove .gitkeep"
```
**VITE.md section: ".gitkeep Blocking Subdirectory Import"** -- Confirmed needed. TS preset creates `packages/.gitkeep`.

---

## Step 4: Import Projects

### Import React app
```bash
npx nx import /tmp/vite-test-s5/react-source apps/shop --ref=main --source=apps/shop --no-interactive
```
- Files imported successfully, merge commit created
- `pnpm install` failed: `@org/models@workspace:*` not found (expected -- libs not imported yet)
- **VITE.md section: "Workspace Dep Import Ordering"** -- Confirmed. Must import all projects first.

### Import React libs
```bash
npx nx import /tmp/vite-test-s5/react-source libs/shop --ref=main --source=libs/shop --no-interactive
npx nx import /tmp/vite-test-s5/react-source libs/shared --ref=main --source=libs/shared --no-interactive
npx nx import /tmp/vite-test-s5/react-source libs/api --ref=main --source=libs/api --no-interactive
```
Each created a merge commit. Install continued to fail until all workspace deps were present.

### Import Vue app
```bash
npx nx import /tmp/vite-test-s5/vue-source apps/admin --ref=main --source=apps/admin --no-interactive
```
- **Issue encountered**: First attempt failed with `fatal: Unable to read current working directory: No such file or directory` due to stale `/tmp/nx-import/repo` from previous import. Fixed by removing the temp dir.
- **VITE.md gap**: Does not mention this stale temp dir issue. It can happen when running multiple imports back-to-back.

---

## Step 5: Fix pnpm-workspace.yaml

### BEFORE (after all imports):
```yaml
packages:
  - 'packages/*'
  - apps/shop
  - libs/shop
  - libs/shared
  - libs/api
  - apps/admin
```

### AFTER:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'libs/api/*'
  - 'libs/shared/*'
  - 'libs/shop/*'
```

**VITE.md section: "pnpm Workspace Globs (Critical)"** -- Confirmed needed. `nx import` added individual paths, not glob patterns. The React source had `libs/api/products` as a specific entry and `libs/shared/*`, `libs/shop/*` as globs. Needed to convert all to proper glob patterns matching the source's directory structure.

---

## Step 6: Fix Module Resolution in tsconfig.base.json

### BEFORE:
```json
{
  "compilerOptions": {
    "lib": ["es2022"],
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

### AFTER:
```json
{
  "compilerOptions": {
    "lib": ["es2022", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```

**VITE.md section: "Module Resolution: bundler vs nodenext (Critical)"** -- Confirmed critical. Both React and Vue sources used `bundler`/`esnext`. The TS preset defaults to `nodenext`/`nodenext`.

**VITE.md section: "tsconfig lib Array (Critical)"** -- Confirmed needed. Added `dom` and `dom.iterable` to base.

---

## Step 7: Fix per-project tsconfig lib array

The React shop app had `"lib": ["dom"]` in its `tsconfig.app.json`. Per VITE.md gotcha about TS not merging `lib` arrays, this would REPLACE the base `["es2022", "dom", "dom.iterable"]` with just `["dom"]`.

### BEFORE (apps/shop/tsconfig.app.json):
```json
"lib": ["dom"]
```

### AFTER:
```json
"lib": ["es2022", "dom", "dom.iterable"]
```

**VITE.md section: "tsconfig lib Array (Critical)"** -- The gotcha about replacement is documented and accurate. However, since we now have `dom` in the base, some projects that had `"lib": ["es2022", "dom"]` (feature-products, feature-product-detail) were fine without changes -- their overrides happened to include `es2022`.

---

## Step 8: Per-Project JSX Configuration (Already Correct)

No changes needed. Both sources already had per-project JSX settings:

- **React projects**: `"jsx": "react-jsx"` in each `tsconfig.app.json` / `tsconfig.lib.json`
- **Vue project**: `"jsx": "preserve"`, `"jsxImportSource": "vue"` in `tsconfig.app.json`
- **Root tsconfig.base.json**: No `jsx` setting (correct for mixed workspace)

**VITE.md section: "tsconfig jsx -- Per-Project Only"** -- Correct advice. Since both sources were Nx-generated monorepos, the per-project JSX was already in place.

---

## Step 9: Add Missing Root Dependencies

```bash
# Production deps
pnpm add -w react react-dom react-router-dom vue express

# Dev deps (combined React + Vue)
pnpm add -wD \
  @vitejs/plugin-react @vitejs/plugin-vue \
  @testing-library/react @testing-library/jest-dom @testing-library/dom \
  @vue/test-utils \
  @types/react @types/react-dom @types/node @types/express @types/supertest \
  vite vitest jsdom vue-tsc \
  @vitest/coverage-v8 @vitest/ui \
  @nx/react @nx/vite @nx/vitest @nx/eslint @nx/eslint-plugin @nx/web @nx/workspace \
  @nx/playwright @nx/node @nx/esbuild @nx/docker @nx/vue @nx/devkit \
  @babel/core @babel/preset-react @swc/cli \
  esbuild supertest ts-node jiti \
  eslint@^9 eslint-config-prettier \
  eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks@5.0.0 \
  eslint-plugin-vue vue-eslint-parser @vue/eslint-config-typescript @vue/eslint-config-prettier \
  @typescript-eslint/parser typescript-eslint \
  eslint-plugin-playwright jsonc-eslint-parser \
  @playwright/test prettier
```

**VITE.md section: "Root Dependencies and Config Not Imported (Critical)"** -- Confirmed critical. The dest TS preset had almost no framework deps.

**VITE.md section: "ESLint Version Pinning (Critical)"** -- Followed advice to pin `eslint@^9`. ESLint resolved to 9.39.3.

**Note on eslint-plugin-react-hooks versioning**: Initially installed latest (v7.0.1) which introduced a new `react-hooks/set-state-in-effect` error rule not present in the source's v5.0.0. Had to pin to `eslint-plugin-react-hooks@5.0.0` to match source behavior.

---

## Step 10: Configure nx.json

### BEFORE:
```json
{
  "plugins": [
    {
      "plugin": "@nx/js/typescript",
      "options": {
        "typecheck": { "targetName": "typecheck" },
        "build": { "targetName": "build", "configName": "tsconfig.lib.json" }
      }
    }
  ]
}
```

### AFTER:
```json
{
  "plugins": [
    { "plugin": "@nx/eslint/plugin", "options": { "targetName": "lint" } },
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "serveTargetName": "serve",
        "devTargetName": "dev",
        "previewTargetName": "preview",
        "serveStaticTargetName": "serve-static",
        "typecheckTargetName": "typecheck",
        "testTargetName": "test",
        "buildDepsTargetName": "build-deps",
        "watchDepsTargetName": "watch-deps"
      }
    },
    { "plugin": "@nx/vitest", "options": { "testTargetName": "test" } },
    { "plugin": "@nx/playwright/plugin", "options": { "targetName": "e2e", "ciTargetName": "e2e-ci" } },
    {
      "plugin": "@nx/js/typescript",
      "options": {
        "typecheck": { "targetName": "tsc-typecheck" },
        "build": { "targetName": "build", "configName": "tsconfig.lib.json" }
      }
    }
  ],
  "targetDefaults": {
    "test": { "dependsOn": ["^build"] },
    "@nx/esbuild:esbuild": { "cache": true, "dependsOn": ["^build"] },
    "@nx/js:tsc": { "cache": true, "dependsOn": ["^build"] }
  }
}
```

Key changes:
1. Added `@nx/vite/plugin` with `typecheckTargetName: "typecheck"`
2. Added `@nx/eslint/plugin`, `@nx/vitest`, `@nx/playwright/plugin`
3. Renamed `@nx/js/typescript` typecheck target to `"tsc-typecheck"` to avoid conflict with `@nx/vite/plugin`
4. Kept `@nx/js/typescript` because pure TS libs (`libs/shared/models`, `libs/api/products`) need it
5. Merged `targetDefaults` from React source (`test.dependsOn`, `@nx/esbuild:esbuild`, `@nx/js:tsc`)
6. Added `namedInputs.production` patterns from source

**VITE.md section: "Plugin Detection and Configuration"** -- Confirmed. Subdirectory import does NOT auto-detect/install plugins.

**VITE.md section: "Typecheck -- @nx/vite/plugin Auto-Detects Framework"** -- Confirmed. Vue project ran `vue-tsc --build --emitDeclarationOnly` automatically. React projects ran `tsc --build --emitDeclarationOnly`.

**VITE.md section: "Mixed React + Vue > Recommended nx.json"** -- The example was accurate for the mixed case.

---

## Step 11: Create Root ESLint Config

Created `eslint.config.mjs` at workspace root:

```js
import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/out-tsc',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
      '**/test-output',
      '**/*.vue.d.ts',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [{ sourceTag: '*', onlyDependOnLibsWithTags: ['*'] }],
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

**VITE.md section: "Root ESLint Config Missing After Subdirectory Import"** -- Confirmed needed. Both source project ESLint configs reference `../../eslint.config.mjs`.

**VITE.md section: "ESLint -- Three-Tier Config"** -- Followed correctly. Root has base only, no framework-specific rules.

---

## Step 12: Fix Vue ESLint Config (CNW Bug)

### BEFORE (apps/admin/eslint.config.mjs):
```js
import vue from 'eslint-plugin-vue';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: await import('@typescript-eslint/parser'),
      },
    },
  },
  // ...
];
```

### AFTER:
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
  // ...
];
```

**VITE.md section: "CNW bug"** -- Confirmed. The `vue-monorepo` preset generates an ESLint config that uses `await import('@typescript-eslint/parser')` without `vue-eslint-parser`. The VITE.md correctly identifies this.

**VITE.md section: "vue-eslint-parser must be an explicit dependency"** -- Confirmed. Installed explicitly.

---

## Step 13: vue-shims.d.ts

The file `apps/admin/src/vue-shims.d.ts` was already present after import:
```ts
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
```

**VITE.md section: "vue-shims.d.ts Type Declarations"** -- No action needed; it imported cleanly.

---

## Step 14: nx sync and nx reset

```bash
npx nx reset
npx nx sync --yes
```

Sync updated TypeScript project references. No issues.

---

## Step 15: Final Verification

```bash
npx nx reset
npx nx run-many -t typecheck,build,test,lint
```

### Result: ALL 26 TASKS PASSED

```
NX   Successfully ran targets typecheck, build, test, lint for 9 projects

Projects:
- @org/shop                      (typecheck, build, test, lint) -- React app
- @org/shop-data                 (typecheck, test, lint)        -- React lib
- @org/shop-shared-ui            (typecheck, test, lint)        -- React lib
- @org/shop-feature-products     (typecheck, test, lint)        -- React lib
- @org/shop-feature-product-detail (typecheck, test, lint)      -- React lib
- @org/models                    (lint)                         -- pure TS lib
- @org/shared-test-utils         (lint)                         -- pure TS lib
- @org/api-products              (typecheck, build, test, lint) -- Node.js lib
- @vue-source/admin              (typecheck, build, test, lint) -- Vue app
```

Key observations from output:
- Vue typecheck correctly used `vue-tsc --build --emitDeclarationOnly`
- React typecheck correctly used `tsc --build --emitDeclarationOnly`
- Vue build succeeded: `vite v7.3.1 building client environment for production...` (72.94 kB JS)
- React build succeeded: `vite v7.3.1 building client environment for production...` (232.49 kB JS)
- api-products build succeeded: `tsc --build tsconfig.lib.json` (pure TS, esbuild-style)
- All tests passed (75 total tests across 11 test files)
- All lint passed (warnings only, no errors)

---

## VITE.md Section Applicability

| VITE.md Section | Applicable? | Notes |
|---|---|---|
| Import Strategy: Subdirectory-at-a-time | YES | Used for all imports, worked well |
| pnpm Workspace Globs (Critical) | YES | Needed to replace individual paths with globs |
| Root Dependencies Not Imported (Critical) | YES | Critical -- dest TS preset had almost nothing |
| TypeScript Project References | YES | `nx sync` worked after deps installed |
| Module Resolution: bundler vs nodenext | YES | Critical fix needed |
| tsconfig lib Array | YES | Critical -- added dom/dom.iterable |
| tsconfig lib Array Gotcha (no merging) | YES | shop tsconfig.app.json had `"lib": ["dom"]` that would replace base |
| Plugin Detection and Configuration | YES | Had to manually add all plugins to nx.json |
| @nx/vite/plugin typecheckTargetName | YES | Changed from default "vite:typecheck" to "typecheck" |
| @nx/js/typescript rename for mixed | YES | Renamed to "tsc-typecheck" |
| Root ESLint Config Missing | YES | Had to create from scratch |
| ESLint Version Pinning | YES | Pinned to v9 |
| Dependency Version Conflicts | YES | eslint-plugin-react-hooks v7 vs v5 issue |
| tsconfig jsx -- Per-Project Only | YES | Already correct from source, no changes needed |
| Typecheck auto-detects framework | YES | vue-tsc for Vue, tsc for React -- confirmed |
| ESLint -- Three-Tier Config | YES | Root base, React flat/react, Vue flat/recommended |
| vue-shims.d.ts | YES (verified) | Present after import, no action needed |
| vue-eslint-parser explicit dep | YES | Installed explicitly |
| CNW ESLint bug | YES | Fixed await import pattern |
| Workspace Dep Import Ordering | YES | Install failed until all deps imported |
| .gitkeep Blocking Import | YES | Had to remove before first import |
| Explicit Executor Path Fixups | NO | All projects used inferred targets |
| Redundant Root Files | NO | Used subdirectory import, no redundant files |
| Non-Nx Source Issues | NO | Both sources were Nx monorepos |
| Project Name Collisions | NO | No conflicting names between sources |
| npm Script Rewriting | NO | Sources already had Nx-compatible scripts |
| noEmit -> composite | NO | Sources already had correct tsconfig settings |
| React Version Conflicts | NO | Both used React 19 |
| Vite 6 vs 7 conflicts | NO | Both used Vite 7 |

---

## VITE.md Gaps / Issues Found

### 1. Stale temp dir between sequential imports
When running multiple `nx import` commands back-to-back, the temp directory (`/tmp/nx-import/repo`) can become stale, causing `fatal: Unable to read current working directory`. VITE.md does not mention this. Fix: `rm -rf /tmp/nx-import` between imports if it fails.

### 2. ESLint plugin version drift not emphasized enough
VITE.md mentions "Dependency Version Conflicts" for Vite/React/Vitest versions but does not specifically warn about ESLint plugin version drift. Installing `eslint-plugin-react-hooks@latest` (v7.0.1) introduced a new `react-hooks/set-state-in-effect` error rule that didn't exist in the source's v5.0.0. The "General strategy" section says to "compare key deps" including "ESLint plugins like eslint-plugin-react, eslint-plugin-vue" but could be more explicit that even minor ESLint plugin version bumps can introduce new error-level rules.

**Recommendation**: Add a note under React ESLint Dependencies: "Pin `eslint-plugin-react-hooks` to the version from the source workspace. v7+ introduces new error-level rules (e.g. `react-hooks/set-state-in-effect`) that may break lint on valid source code."

### 3. targetDefaults merging not well covered
VITE.md mentions "targetDefaults from nx.json" as something to merge, but doesn't detail what the React monorepo preset generates. The `test.dependsOn: ["^build"]` and `@nx/esbuild:esbuild` defaults were important for correct build ordering. Users need to carefully compare source and dest `nx.json` `targetDefaults`.

### 4. namedInputs.production patterns
The React source had additional `namedInputs.production` exclusion patterns (eslint configs, spec files, test setup files, vitest configs) that the TS preset didn't have. These affect caching correctness. VITE.md doesn't mention needing to merge `namedInputs`.

### 5. Multi-level lib glob patterns in pnpm-workspace.yaml
The React source had `libs/api/products` as a specific entry (not `libs/api/*`) because there was only one lib under `libs/api/`. VITE.md says to "replace entries with proper glob patterns from source's config" but doesn't address that some source entries may be specific paths vs globs. Using `libs/api/*` works fine when there's only one project.

### 6. @vue/eslint-config-typescript and @vue/eslint-config-prettier installed but unused
VITE.md lists these under "Vue ESLint" deps but the recommended Vue ESLint config pattern doesn't use them. The CNW-generated config also doesn't import them. They were harmless to install but could confuse users wondering why they're needed.

---

## VITE.md Advice That Was Wrong or Unnecessary

### Nothing was wrong
All VITE.md advice that was applicable was correct. No advice led me astray or caused problems.

### Minor items that could be clarified
- The `@vue/eslint-config-typescript` and `@vue/eslint-config-prettier` packages listed under Vue ESLint deps are not referenced by the recommended Vue ESLint config pattern. They may be needed for other config patterns but it's unclear when.

---

## Config Files Summary (Final State)

### /tmp/vite-test-s5/dest/tsconfig.base.json
```json
{
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "importHelpers": true,
    "isolatedModules": true,
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

### /tmp/vite-test-s5/dest/pnpm-workspace.yaml
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'libs/api/*'
  - 'libs/shared/*'
  - 'libs/shop/*'
```

### /tmp/vite-test-s5/dest/nx.json
(See Step 10 above for full AFTER content)

### /tmp/vite-test-s5/dest/eslint.config.mjs
(See Step 11 above for full content)

### /tmp/vite-test-s5/dest/apps/admin/eslint.config.mjs
(See Step 12 above for full AFTER content)

### /tmp/vite-test-s5/dest/apps/shop/tsconfig.app.json (change: lib array)
```json
"lib": ["es2022", "dom", "dom.iterable"]
```

### Files NOT modified (imported as-is and worked):
- All React lib tsconfigs (already had `jsx: react-jsx`)
- `apps/admin/tsconfig.app.json` (already had `jsx: preserve`, `jsxImportSource: vue`)
- `apps/admin/src/vue-shims.d.ts` (imported cleanly)
- All React project `eslint.config.mjs` files (reference root config, use `flat/react`)
- `libs/shared/models/eslint.config.mjs` (just extends base)
- `libs/api/products/eslint.config.mjs` (extends base + has own rules)
