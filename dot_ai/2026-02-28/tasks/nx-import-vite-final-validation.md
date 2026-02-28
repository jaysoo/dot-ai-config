# nx-import VITE.md Final Validation Pass

**Date**: 2026-02-28
**VITE.md version**: ~560 lines, combined React/Vue/Mixed reference

## Summary

| #   | Scenario                           | Projects | typecheck | build | test | lint | Gaps    |
| --- | ---------------------------------- | -------- | --------- | ----- | ---- | ---- | ------- |
| 1   | Basic Nx React → TS                | 10       | Pass      | Pass  | Pass | Pass | 0       |
| 2   | Basic Nx Vue → TS                  | 6        | Pass      | Pass  | Pass | Pass | 0       |
| 3   | Non-Nx React (create-vite) → TS    | 1        | Pass      | Pass  | N/A  | Pass | 0       |
| 4   | Non-Nx Vue (create-vite) → TS      | 1        | Pass      | Pass  | N/A  | Pass | 0       |
| 5   | Mixed React+Vue (two sources) → TS | 12       | Pass      | Pass  | Pass | Pass | 0       |
| 6   | Overlapping names (two React) → TS | 12       | Pass      | Pass  | Pass | Pass | 1 minor |

**Result: All 6 scenarios pass all targets. 1 minor gap found (directory depth assumption).**

---

## Scenario 1: Basic Nx React → Nx TS Workspace

**Source**: `npx create-nx-workspace --preset=react-monorepo --appName=shop`
**Import strategy**: Subdirectory-at-a-time (`apps/shop`, `libs/*`)

### Projects (10)

```
@org/shop, @org/shop-e2e, @org/api, @org/shop-data,
@org/shop-feature-product-detail, @org/shop-feature-products,
@org/shop-shared-ui, @org/api-products, @org/models, @org/shared-test-utils
```

### Post-Import Config (after fixes)

**tsconfig.base.json** — key changes from TS preset defaults:

```json
{
  "compilerOptions": {
    "lib": ["es2022", "dom", "dom.iterable"], // was: ["es2022"]
    "module": "esnext", // was: "nodenext"
    "moduleResolution": "bundler", // was: "nodenext"
    "jsx": "react-jsx" // was: absent
  }
}
```

**nx.json plugins** — added `@nx/vite/plugin`, `@nx/eslint/plugin`, `@nx/vitest`, `@nx/playwright`:

```json
{
  "plugin": "@nx/vite/plugin",
  "options": {
    "buildTargetName": "build",
    "typecheckTargetName": "typecheck",
    "testTargetName": "test"
  }
}
```

**pnpm-workspace.yaml** — replaced individual paths with globs:

```yaml
packages:
  - "packages/*"
  - "apps/*"
  - "libs/api/products"
  - "libs/shared/*"
  - "libs/shop/*"
```

**Root eslint.config.mjs** — created from scratch (subdirectory import doesn't bring it):

```js
import nx from "@nx/eslint-plugin";
export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  { ignores: ["**/dist", "**/vite.config.*.timestamp*", "**/out-tsc"] },
  { files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"], rules: {} },
];
```

**Root package.json** — all deps added manually (nx import doesn't merge root deps):

- Production: `react`, `react-dom`, `react-router-dom`, `express`
- Dev: `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `vite`, `vitest`, `jsdom`, `@types/react`, `@types/react-dom`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-import`, `typescript-eslint`, `@nx/vite`, `@nx/vitest`, `@nx/eslint`, `@nx/react`, etc.

### Verification

```
nx run-many -t typecheck,build,test,lint
✅ All 10 projects pass all targets (40 tasks total)
```

### VITE.md Sections Applied

1. `.gitkeep` blocking — removed, committed
2. pnpm workspace globs — replaced individual paths with globs
3. Root dependencies not imported — added all React/Vite deps
4. Module resolution — `nodenext` → `bundler`/`esnext`
5. tsconfig lib array — added `dom`, `dom.iterable`
6. Plugin detection — manually added plugins (subdirectory import)
7. Root ESLint config missing — created from scratch
8. React TypeScript config — `jsx: "react-jsx"` in base
9. `typescript-eslint` explicit install — pnpm strict hoisting
10. Workspace dep import ordering — observed (pnpm install failed mid-import, succeeded after all imports)
11. `targetDefaults` merge — imported `@nx/esbuild:esbuild` and `@nx/js:tsc` defaults

### Gaps: None

---

## Scenario 2: Basic Nx Vue → Nx TS Workspace

**Source**: `npx create-nx-workspace --preset=vue-monorepo --appName=dashboard`
**Import strategy**: Subdirectory-at-a-time

### Projects (6)

```
dashboard, dashboard-e2e, @source/models, @source/ui, @source/is-even, @source/is-odd
```

### Post-Import Config (after fixes)

**tsconfig.base.json** — Vue-specific additions:

```json
{
  "compilerOptions": {
    "lib": ["es2022", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "resolveJsonModule": true
  }
}
```

**nx.json plugins**:

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

**Root eslint.config.mjs** — includes `.vue` in file patterns:

```js
import nx from "@nx/eslint-plugin";
export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: [
      "**/dist",
      "**/out-tsc",
      "**/vite.config.*.timestamp*",
      "**/*.vue.d.ts",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.vue"],
    rules: {},
  },
];
```

**Vue project eslint.config.mjs** — with vue-eslint-parser AFTER base config:

```js
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import baseConfig from "../../eslint.config.mjs";
export default [
  ...baseConfig,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: { parser: vueParser, parserOptions: { parser: tsParser } },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.vue"],
    rules: { "vue/multi-word-component-names": "off" },
  },
];
```

**Root package.json Vue deps**:

- Production: `vue`
- Dev: `@vitejs/plugin-vue`, `vue-tsc`, `@vue/test-utils`, `eslint-plugin-vue`, `vue-eslint-parser`, `@vue/eslint-config-typescript`, `@typescript-eslint/parser`, `eslint@^9`, `typescript-eslint`, `jsdom`

### Verification

```
nx run-many -t typecheck,build,test,lint
✅ All 6 projects pass all targets (20 tasks total)
```

### VITE.md Sections Applied

1-7 (same generic sections as S1) plus: 8. Vue TypeScript config — `jsx: "preserve"`, `jsxImportSource: "vue"`, `resolveJsonModule` 9. ESLint version pinning — v9 (critical for Vue) 10. ESLint plugin installation order — deps before `@nx/eslint` 11. Vue ESLint config pattern — vue-eslint-parser + TS sub-parser 12. CNW bug — replaced generated ESLint config with correct vue-eslint-parser pattern

### Gaps: None

---

## Scenario 3: Non-Nx React (create-vite) → Nx TS Workspace

**Source**: `pnpm create vite my-app --template react-ts` (plain, no Nx)
**Import strategy**: Subdirectory import into `apps/my-app`

### Projects (1)

```
my-app
```

### Post-Import Config (after fixes)

**apps/my-app/tsconfig.app.json** — noEmit→composite fix (BEFORE → AFTER):

```json
// BEFORE (create-vite default):
{ "compilerOptions": { "noEmit": true, "jsx": "react-jsx" } }

// AFTER:
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.app.tsbuildinfo",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "jsx": "react-jsx",
    "types": ["vite/client"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src"]
}
```

**apps/my-app/tsconfig.node.json** — same noEmit fix applied:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.node.tsbuildinfo",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "types": ["node"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true
  },
  "include": ["vite.config.ts"]
}
```

**ESLint**: create-vite's self-contained `eslint.config.js` left as-is (works alongside Nx ESLint plugin — no conversion needed).

**npm scripts removed**: create-vite generates `"dev"`, `"build"`, `"lint"`, `"preview"` scripts that Nx rewrites incorrectly. Removed all; Nx infers targets from vite.config.ts.

### Verification

```
nx run-many -t typecheck,build,lint
✅ All targets pass (no test target — create-vite doesn't include vitest)
```

### VITE.md Sections Applied

1-7 (generic) plus: 8. npm script rewriting — removed broken rewritten scripts 9. noEmit → composite — fixed BOTH tsconfig.app.json AND tsconfig.node.json 10. ESLint config handling — create-vite flat config left as-is (correct per VITE.md) 11. Plugin install failure — installed deps first, then `nx add`

### Gaps: None

---

## Scenario 4: Non-Nx Vue (create-vite) → Nx TS Workspace

**Source**: `pnpm create vite my-vue-app --template vue-ts` (plain, no Nx)
**Import strategy**: Subdirectory import into `apps/my-vue-app`

### Projects (1)

```
my-vue-app
```

### Post-Import Config (after fixes)

**apps/my-vue-app/tsconfig.app.json** — noEmit fix + outDir for vue-tsc:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.app.tsbuildinfo",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "noEmit": false,
    "rootDir": "src",
    "types": ["vite/client"],
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

**apps/my-vue-app/tsconfig.node.json** — same pattern:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.node.tsbuildinfo",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

**ESLint**: create-vite's self-contained flat config left as-is. Vue ESLint deps installed before `@nx/eslint` plugin (critical ordering).

**vue-shims**: create-vite includes `env.d.ts` with `/// <reference types="vite/client" />` — sufficient for `.vue` module resolution.

### Verification

```
nx run-many -t typecheck,build,lint
✅ All targets pass (no test target — create-vite vue-ts doesn't include vitest)
```

### VITE.md Sections Applied

All of S3 sections plus:

- Vue TypeScript config — `jsx: "preserve"`, `jsxImportSource: "vue"`
- ESLint plugin installation order — critical for Vue
- vue-tsc emit prevention — `outDir: "dist"` prevents .d.ts in src/
- vue-shims check — present via `env.d.ts`

### Gaps: None

---

## Scenario 5: Mixed React+Vue (Two Sources) → Nx TS Workspace

**Sources**: CNW react-monorepo (shop app) + CNW vue-monorepo (admin app)
**Import strategy**: Subdirectory-at-a-time from both sources

### Projects (12)

```
React: shop, shop-e2e, @react-source/is-even, @react-source/is-odd, @react-source/models, @react-source/ui
Vue:   admin, admin-e2e, @vue-source/is-even, @vue-source/is-odd, @vue-source/models, @vue-source/ui
```

### Post-Import Config (after fixes)

**tsconfig.base.json** — NO jsx setting (per-project only):

```json
{
  "compilerOptions": {
    "lib": ["es2022", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler"
    // NO jsx here — mutually exclusive between React and Vue
  }
}
```

**React project tsconfig** (apps/shop/tsconfig.app.json):

```json
{ "compilerOptions": { "jsx": "react-jsx" } }
```

**Vue project tsconfig** (apps/admin/tsconfig.app.json):

```json
{ "compilerOptions": { "jsx": "preserve", "jsxImportSource": "vue" } }
```

**nx.json** — `@nx/vite/plugin` auto-detects framework, `@nx/js/typescript` renamed:

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
    },
    {
      "plugin": "@nx/js/typescript",
      "options": {
        "typecheck": { "targetName": "tsc-typecheck" }
      }
    }
  ]
}
```

`@nx/vite/plugin` uses `vue-tsc` for Vue projects, `tsc` for React — auto-detected.

**Three-tier ESLint**:

- Root: base rules only (no framework-specific)
- React projects (`apps/shop/eslint.config.mjs`): `...nx.configs['flat/react']`
- Vue projects (`apps/admin/eslint.config.mjs`): `...vue.configs['flat/recommended']` + `vue-eslint-parser`

**Root package.json** — BOTH React and Vue deps:

- React: `react`, `react-dom`, `@vitejs/plugin-react`, `eslint-plugin-react`, `eslint-plugin-react-hooks`
- Vue: `vue`, `@vitejs/plugin-vue`, `vue-tsc`, `eslint-plugin-vue`, `vue-eslint-parser`
- Shared: `vite`, `vitest`, `eslint@^9`, `typescript-eslint`

### Verification

```
nx run-many -t typecheck,build,test,lint
✅ All 12 projects pass all targets (40 tasks total)
```

### VITE.md Sections Applied

All generic sections plus:

- Mixed: tsconfig jsx per-project only
- Mixed: @nx/vite/plugin auto-detects framework
- Mixed: ESLint three-tier config
- Mixed: @nx/js/typescript renamed to `tsc-typecheck`
- Vue ESLint parser ordering (AFTER base config — critical)

### Gaps: None

---

## Scenario 6: Overlapping Names (Two React Sources) → Nx TS Workspace

**Sources**: Two CNW react-monorepo workspaces both with `appName=portal`
**Import strategy**: Source A → `apps/`, Source B → `apps-beta/` (name collision workaround)

### Projects (12)

```
Source A: portal, portal-e2e, @source-a/is-even, @source-a/is-odd, @source-a/models, @source-a/ui
Source B: @source-b/beta-portal, @source-b/beta-portal-e2e, @source-b/beta-is-even, @source-b/beta-is-odd, @source-b/beta-models, @source-b/beta-ui
```

### Post-Import Config (after fixes)

**pnpm-workspace.yaml** — must cover BOTH directory trees:

```yaml
packages:
  - "packages/*"
  - "apps/*"
  - "apps-beta/*"
  - "libs/api/*"
  - "libs/shared/*"
  - "libs/shop/*"
  - "libs-beta/api/*"
  - "libs-beta/shared/*"
  - "libs-beta/shop/*"
```

(Raw post-import state had individual paths — needed glob conversion)

**nx.json plugins** — include/exclude patterns must cover alternate dirs:

```json
{
  "plugin": "@nx/eslint/plugin",
  "include": ["{apps,apps-beta,libs,libs-beta}/**"],
  "options": { "targetName": "lint" }
}
```

**Name collision fix** — Source B packages renamed with `beta-` prefix:

```json
// BEFORE: apps-beta/portal/package.json
{ "name": "@source-b/portal" }  // COLLIDES with apps/portal

// AFTER:
{ "name": "@source-b/beta-portal" }
```

All cross-references updated (dependencies, imports).

**tsconfig references paths** — fixed for alternate dirs:

```
// BEFORE (from source): ../../libs/shared/models/tsconfig.lib.json
// AFTER:                 ../../libs-beta/shared/models/tsconfig.lib.json
```

### Verification

```
nx run-many -t typecheck,build,test,lint
✅ All 12 projects pass all targets (40 tasks total)
```

### VITE.md Sections Applied

All generic sections plus:

- Project name collisions — renamed with `beta-` prefix
- Plugin include/exclude patterns — added `apps-beta/**`, `libs-beta/**`
- Multiple-source imports fix order — tsconfig references, pnpm globs, cross-refs
- Root package.json naming — Source B's root also renamed

### Gaps Found

1. **Minor (directory depth assumption)**: VITE.md assumes imported dirs are at the same depth as original (e.g., `apps-beta/portal` same depth as `apps/portal`). If importing to a different depth (e.g., `team-b/apps/portal`), all relative paths in ESLint configs (`../../eslint.config.mjs`) and tsconfig extends (`../../tsconfig.base.json`) would break. Could add a note about this edge case.

---

## Consolidated Findings

### VITE.md Accuracy: Excellent

- All 6 scenarios pass all targets
- Every issue encountered was documented in VITE.md
- No incorrect or misleading advice found
- Fix orders match the actual sequence needed

### Section Usage Across Scenarios

| Section                     | S1  | S2  | S3  | S4  | S5  | S6  |
| --------------------------- | --- | --- | --- | --- | --- | --- |
| .gitkeep blocking           | x   | x   | x   | x   | x   | x   |
| pnpm workspace globs        | x   | x   | x   | x   | x   | x   |
| Root deps not imported      | x   | x   | x   | x   | x   | x   |
| Module resolution (bundler) | x   | x   | x   | x   | x   | x   |
| tsconfig lib (dom)          | x   | x   | x   | x   | x   | x   |
| Plugin detection/config     | x   | x   | x   | x   | x   | x   |
| Root ESLint missing         | x   | x   | -   | -   | x   | x   |
| ESLint version pinning (v9) | -   | x   | -   | x   | x   | -   |
| typescript-eslint explicit  | x   | x   | -   | -   | x   | x   |
| noEmit → composite          | -   | -   | x   | x   | -   | -   |
| npm script rewriting        | -   | -   | x   | x   | -   | -   |
| Vue ESLint ordering         | -   | x   | -   | x   | x   | -   |
| Mixed jsx per-project       | -   | -   | -   | -   | x   | -   |
| Three-tier ESLint           | -   | -   | -   | -   | x   | -   |
| Name collisions             | -   | -   | -   | -   | -   | x   |
| Plugin include/exclude      | -   | -   | -   | -   | -   | x   |

### Only Gap Identified

Directory depth assumption in Scenario 6. Not critical — standard imports maintain depth. Only affects edge cases where `team-b/apps/portal` (depth 3) replaces `apps/portal` (depth 2).
