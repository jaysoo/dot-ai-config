# Scenario 4: Non-Nx Vue (create-vite) -> Nx TS Workspace

**Date**: 2026-02-28
**Result**: PASS -- typecheck, build, lint all succeed

---

## 1. Setup

### 1a. Create dest workspace

```bash
cd /tmp/vite-test-s4
npx create-nx-workspace@latest dest --preset=ts --no-interactive --pm=pnpm
```

Output: Successfully created workspace with Nx 22.5.3.

Dest workspace initial state:
- `tsconfig.base.json`: `module: "nodenext"`, `moduleResolution: "nodenext"`, `lib: ["es2022"]`
- `nx.json`: `@nx/js/typescript` plugin with `typecheck` target
- `pnpm-workspace.yaml`: `packages: ['packages/*']`
- `packages/.gitkeep` exists

### 1b. Create non-Nx source

```bash
mkdir -p /tmp/vite-test-s4/source && cd /tmp/vite-test-s4/source
pnpm init
pnpm create vite my-vue-app --template vue-ts
cd my-vue-app && pnpm install && cd ..
git init && git add -A && git commit -m "init"
```

Source `my-vue-app/package.json`:
```json
{
  "name": "my-vue-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.5.25"
  },
  "devDependencies": {
    "@types/node": "^24.10.1",
    "@vitejs/plugin-vue": "^6.0.2",
    "@vue/tsconfig": "^0.8.1",
    "typescript": "~5.9.3",
    "vite": "^7.3.1",
    "vue-tsc": "^3.1.5"
  }
}
```

Source `tsconfig.app.json` extends `@vue/tsconfig/tsconfig.dom.json` which inherits `noEmit: true` from `@vue/tsconfig/tsconfig.json`.

Source `tsconfig.node.json` has explicit `"noEmit": true`.

Source `tsconfig.json` is solution-style (`"files": [], "references": [...]`) with no `extends`.

---

## 2. Import

### 2a. Remove .gitkeep

```bash
cd /tmp/vite-test-s4/dest
rm packages/.gitkeep && git add -A && git commit -m "remove .gitkeep"
```

**VITE.md section**: ".gitkeep Blocking Subdirectory Import" -- APPLICABLE and NEEDED.

### 2b. Run nx import

```bash
npx nx import /tmp/vite-test-s4/source apps/my-vue-app --ref=main --source=my-vue-app --no-interactive
```

Output (key parts):
- Cloned source, filtered history, merged into `apps/my-vue-app`
- **Detected plugin**: `@nx/vite` -- installed automatically
- **Warning**: "Mismatched package managers" (source npm, dest pnpm)
- **Warning**: "imported project is missing the packages field" -- added `apps/my-vue-app` to `pnpm-workspace.yaml`
- **Warning**: "dependencies and devDependencies are not imported from source"
- **Warning**: "Check configuration files" -- relative paths may need updating
- `@nx/vite:init` generator ran, updated `nx.json`, `package.json`, `.gitignore`

Post-import state:
- `nx.json` got `@nx/vite/plugin` with `typecheckTargetName: "vite:typecheck"` (not `"typecheck"`)
- Scripts rewritten: `"dev": "nx serve"`, `"build": "vue-tsc -b && nx vite:build"`, `"preview": "nx vite:preview"`
- `pnpm-workspace.yaml`: Added `apps/my-vue-app` (literal path, not glob)
- Stale `node_modules` and `pnpm-lock.yaml` imported from source

---

## 3. Fixes Applied (Following VITE.md Fix Order: Non-Nx Source)

### Fix 1: Remove stale node_modules

```bash
rm -rf apps/my-vue-app/node_modules
rm -f apps/my-vue-app/pnpm-lock.yaml
```

**VITE.md section**: "Stale node_modules from Import" -- APPLICABLE and NEEDED.

### Fix 2: Fix pnpm-workspace.yaml globs

BEFORE:
```yaml
packages:
  - 'packages/*'
  - apps/my-vue-app
```

AFTER:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

Then `pnpm install --no-frozen-lockfile`.

**VITE.md section**: "pnpm Workspace Globs (Critical)" -- APPLICABLE and NEEDED. The import added the literal path `apps/my-vue-app` instead of a glob pattern, exactly as documented.

### Fix 3: Remove rewritten npm scripts

BEFORE:
```json
"scripts": {
  "dev": "nx serve",
  "build": "vue-tsc -b && nx vite:build",
  "preview": "nx vite:preview"
}
```

AFTER:
```json
"scripts": {}
```

**VITE.md section**: "npm Script Rewriting (Critical)" -- APPLICABLE and NEEDED. The `build` script was rewritten to `vue-tsc -b && nx vite:build` which is broken. Removing all scripts lets Nx infer targets from `vite.config.ts`.

### Fix 4: Fix noEmit -> composite + emitDeclarationOnly

#### tsconfig.app.json

BEFORE:
```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "types": ["vite/client"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

Note: `@vue/tsconfig/tsconfig.dom.json` -> `@vue/tsconfig/tsconfig.json` sets `"noEmit": true`, so this inherited noEmit.

AFTER:
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
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "target": "ESNext",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

Key changes:
- Changed `extends` from `@vue/tsconfig/tsconfig.dom.json` to `../../tsconfig.base.json`
- Added `composite: true`, `emitDeclarationOnly: true`, `declarationMap: true`
- Explicit `noEmit: false` to override any inherited value
- Added `outDir: "dist"` + `tsBuildInfoFile: "dist/..."` to prevent .d.ts in src/
- Added `rootDir: "src"`
- Inlined the settings that were previously inherited from `@vue/tsconfig` (module, moduleResolution, jsx, etc.)

#### tsconfig.node.json

BEFORE:
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

AFTER:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.node.tsbuildinfo",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

Key changes:
- Added `extends: "../../tsconfig.base.json"`
- Removed `noEmit: true`
- Added `composite: true`, `emitDeclarationOnly: true`, `declarationMap: true`
- Added `outDir: "dist"` + `tsBuildInfoFile: "dist/..."`

**VITE.md section**: "noEmit -> composite + emitDeclarationOnly (Critical)" -- APPLICABLE and NEEDED.

**IMPORTANT FINDING**: VITE.md says the tsconfig.app.json "often" has `noEmit: true`, but with `create-vite` vue-ts template (as of 2026), the `noEmit` is INHERITED from `@vue/tsconfig/tsconfig.json` via extends chain, not explicit. This is a subtle but important distinction -- you have to trace the extends chain to find it. VITE.md does mention this in the note about `create-vite` using solution-style tsconfig, but could be clearer about the `@vue/tsconfig` inheritance path.

### Fix 5: Fix module resolution in tsconfig.base.json

BEFORE:
```json
{
  "compilerOptions": {
    "lib": ["es2022"],
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

AFTER:
```json
{
  "compilerOptions": {
    "lib": ["es2022", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "vue"
  }
}
```

**VITE.md sections**: "Module Resolution: bundler vs nodenext (Critical)" + "tsconfig lib Array (Critical)" + "Vue TypeScript Configuration" -- ALL APPLICABLE and NEEDED.

### Fix 6: Add missing root deps

```bash
pnpm add -w vue
pnpm add -wD @vitejs/plugin-vue vue-tsc @vue/tsconfig
```

**VITE.md section**: "Root Dependencies and Config Not Imported (Critical)" + "Vue Dependencies" -- APPLICABLE and NEEDED.

### Fix 7: Create vue-shims.d.ts

Created `apps/my-vue-app/src/vue-shims.d.ts`:
```ts
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
```

**VITE.md section**: "vue-shims.d.ts Type Declarations" -- CREATED but may not be strictly needed since `vue-tsc` handles .vue files natively. The file is harmless either way.

### Fix 8: Configure @nx/vite/plugin typecheck target

BEFORE (nx.json plugins):
```json
[
  {
    "plugin": "@nx/js/typescript",
    "options": { "typecheck": { "targetName": "typecheck" }, "build": { "..." } }
  },
  {
    "plugin": "@nx/vite/plugin",
    "options": { "typecheckTargetName": "vite:typecheck", "..." }
  }
]
```

AFTER:
```json
[
  {
    "plugin": "@nx/vite/plugin",
    "options": {
      "buildTargetName": "build",
      "testTargetName": "test",
      "serveTargetName": "serve",
      "typecheckTargetName": "typecheck"
    }
  }
]
```

Key changes:
- Removed `@nx/js/typescript` (no pure TS libs in workspace)
- Changed `typecheckTargetName` from `"vite:typecheck"` to `"typecheck"`
- Simplified other target names (removed `vite:` prefixes)

**VITE.md section**: "Plugin Detection and Configuration" -- APPLICABLE and NEEDED. Default `vite:typecheck` target name is indeed non-standard.

### Fix 9: Install Vue ESLint deps BEFORE @nx/eslint

```bash
pnpm add -wD eslint@^9 eslint-plugin-vue vue-eslint-parser @vue/eslint-config-typescript \
  @typescript-eslint/parser @nx/eslint-plugin typescript-eslint
```

Then created root `eslint.config.mjs`:
```js
import nx from '@nx/eslint-plugin';
export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  { ignores: ['**/dist', '**/out-tsc', '**/vite.config.*.timestamp*', '**/*.vue.d.ts'] },
  { files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'], rules: {} },
];
```

Then created project `apps/my-vue-app/eslint.config.mjs`:
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
    languageOptions: { parser: vueParser, parserOptions: { parser: tsParser } },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
    rules: { 'vue/multi-word-component-names': 'off' },
  },
];
```

Then `npx nx add @nx/eslint` (added plugin to nx.json).

**VITE.md sections**: "ESLint Plugin Installation Order (Critical)" + "Root ESLint Config Missing After Subdirectory Import" + "Vue ESLint Config Pattern" + "ESLint Version Pinning (Critical)" -- ALL APPLICABLE and NEEDED.

### Fix 10: nx sync + nx reset

```bash
npx nx reset
npx nx sync --yes
pnpm install --no-frozen-lockfile
```

**VITE.md section**: "TypeScript Project References" -- APPLICABLE.

---

## 4. Final Verification

```bash
npx nx run-many -t typecheck,build,test,lint
```

Output:
```
> nx run my-vue-app:build
  vite v7.3.1 building client environment for production...
  18 modules transformed.
  dist/index.html                  0.46 kB | gzip:  0.29 kB
  dist/assets/index-UdvnZh6r.css  1.26 kB | gzip:  0.64 kB
  dist/assets/index-CLTD6E-G.js  62.20 kB | gzip: 24.90 kB
  built in 366ms

> nx run my-vue-app:typecheck
  vue-tsc --build --emitDeclarationOnly

> nx run my-vue-app:lint
  eslint .
  19 problems (0 errors, 19 warnings)

NX   Successfully ran targets typecheck, build, lint for project my-vue-app
```

- **typecheck**: PASS (vue-tsc auto-detected, ran `vue-tsc --build --emitDeclarationOnly`)
- **build**: PASS (Vite build succeeded)
- **test**: SKIPPED (no vitest config in create-vite vue-ts template)
- **lint**: PASS (0 errors, 19 warnings from vue/recommended formatting rules)

Available targets: build, serve, dev, preview, serve-static, typecheck, build-deps, watch-deps, lint

---

## 5. VITE.md Section Applicability Assessment

### Sections That Were Needed/Applicable

| Section | Applicable? | Notes |
|---------|------------|-------|
| Import Strategy | Yes | Used whole-repo import for non-monorepo source, as recommended |
| pnpm Workspace Globs | Yes | Import added literal path, needed glob |
| Root Dependencies Not Imported | Yes | Had to add vue, @vitejs/plugin-vue, vue-tsc, @vue/tsconfig |
| Module Resolution (bundler vs nodenext) | Yes | Changed both in tsconfig.base.json and ensured project tsconfigs override |
| tsconfig lib Array | Yes | Added dom, dom.iterable to base |
| Plugin Detection and Configuration | Yes | Had to rename typecheckTargetName and remove @nx/js/typescript |
| .gitkeep Blocking Import | Yes | Had to remove before import |
| npm Script Rewriting | Yes | Scripts were rewritten to broken nx commands |
| noEmit -> composite | Yes | Both tsconfig.app.json (via @vue/tsconfig inheritance) and tsconfig.node.json |
| ESLint Plugin Installation Order | Yes | Installed deps before @nx/eslint |
| ESLint Version Pinning | Yes | Pinned to ^9 |
| Root ESLint Config Missing | Yes | Had to create from scratch |
| Vue ESLint Config Pattern | Yes | Used exact pattern from VITE.md |
| Vue TypeScript Configuration | Yes | Added jsx: preserve, jsxImportSource: vue |
| vue-shims.d.ts | Partially | Created it but may not be strictly needed with vue-tsc |
| vue-tsc vs tsc | Yes | vue-tsc was auto-detected correctly |
| vue-tsc emitting .d.ts into src/ | Yes | Added outDir: dist to prevent this |
| Stale node_modules | Yes | Had to remove imported node_modules |

### Sections That Were NOT Applicable

| Section | Why Not |
|---------|---------|
| Explicit Executor Path Fixups | No explicit executor targets (all inferred) |
| Redundant Root Files | Not a whole-monorepo import, single project dir |
| Dependency Version Conflicts | Source and dest Vite versions were compatible (both v7) |
| Module Boundaries | Single project, no cross-project imports |
| Project Name Collisions | Single project import |
| Workspace Dep Import Ordering | No workspace:* deps |
| Vite resolve.alias / __dirname | create-vite template doesn't use these |
| TypeScript paths Aliases | No path aliases in source |
| @nx/vite Plugin Install Failure | @nx/vite installed successfully during import |
| ESLint Config Handling (legacy .eslintrc) | Source had no ESLint at all |

---

## 6. Gaps in VITE.md (Issues NOT Covered)

### Gap 1: @vue/tsconfig inheritance of noEmit

VITE.md says to look for `"noEmit": true` in tsconfig.app.json and tsconfig.node.json. But with `create-vite` vue-ts (2026 version), `tsconfig.app.json` gets `noEmit` via `extends: "@vue/tsconfig/tsconfig.dom.json"` -> `@vue/tsconfig/tsconfig.json` which sets `"noEmit": true`. You have to trace the extends chain to find it.

The doc mentions "create-vite uses solution-style tsconfig" but doesn't explicitly say **"@vue/tsconfig sets noEmit:true in its base, so tsconfig.app.json inherits it even though it's not visible"**.

**Recommendation**: Add a note like: "For Vue projects, `@vue/tsconfig/tsconfig.json` sets `noEmit: true`. When replacing the `extends` with `../../tsconfig.base.json`, you must explicitly add `noEmit: false` to override, since the workspace base has `composite: true` which conflicts."

### Gap 2: Need to inline @vue/tsconfig settings

When changing `extends` from `@vue/tsconfig/tsconfig.dom.json` to `../../tsconfig.base.json`, you lose ALL the settings from `@vue/tsconfig` (module, moduleResolution, jsx, jsxImportSource, verbatimModuleSyntax, target, lib, etc.). VITE.md mentions some of these (jsx, jsxImportSource, moduleResolution) but doesn't provide a complete "here's what @vue/tsconfig gave you that you now need to replicate" list.

**Recommendation**: Add a note listing all significant settings from `@vue/tsconfig` that need to be preserved when switching extends.

### Gap 3: tsBuildInfoFile location change

The original tsconfigs use `"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.*.tsbuildinfo"`. When switching to `composite: true` with `outDir: "dist"`, the tsBuildInfoFile should move to `dist/` too. VITE.md mentions adding `tsBuildInfoFile` but the example path `"dist/tsconfig.tsbuildinfo"` doesn't account for projects with BOTH tsconfig.app.json and tsconfig.node.json needing DIFFERENT tsbuildinfo file names (e.g. `dist/tsconfig.app.tsbuildinfo` vs `dist/tsconfig.node.tsbuildinfo`).

### Gap 4: No test target with create-vite vue-ts

VITE.md doesn't mention that `create-vite` with `vue-ts` template does NOT include vitest. The `test` target in `nx run-many -t typecheck,build,test,lint` will simply be skipped. This is not a problem but could confuse users who expect all four targets to run.

### Gap 5: create-vite vue-ts no longer uses @vue/tsconfig extends in tsconfig.node.json

The `tsconfig.node.json` from `create-vite` is standalone (no extends). Only `tsconfig.app.json` extends `@vue/tsconfig`. VITE.md could note this distinction -- the two tsconfigs need different treatment.

---

## 7. VITE.md Advice That Was Wrong or Unnecessary

### Minor Issue: "Add extends to tsconfigs if missing"

VITE.md says: `"Add 'extends': '../../tsconfig.base.json' if the project tsconfig doesn't already extend the base"`. This is correct, but the base `tsconfig.json` (solution-style with `"files": [], "references": [...]`) should NOT extend the workspace base -- only the sub-tsconfigs (tsconfig.app.json, tsconfig.node.json) should. VITE.md doesn't explicitly warn against adding extends to the solution-style root tsconfig.json, which could cause issues.

### Minor Issue: "noEmit: false" not mentioned

VITE.md says to "Remove noEmit: true" and "Add composite: true". But when the noEmit comes from an extends chain (@vue/tsconfig), you can't just "remove" it -- you need to explicitly set `"noEmit": false`. This is not wrong per se, but incomplete for the @vue/tsconfig case.

### Everything else was accurate

The fix order, the ESLint installation order, the plugin configuration, the pnpm workspace globs fix, the script removal -- all were correct and necessary.

---

## 8. Final File State

### Root package.json (key devDependencies)
```json
{
  "dependencies": { "vue": "^3.5.29" },
  "devDependencies": {
    "@nx/eslint": "22.5.1",
    "@nx/eslint-plugin": "^22.5.3",
    "@nx/js": "22.5.1",
    "@nx/vite": "22.5.1",
    "@typescript-eslint/parser": "^8.56.1",
    "@vitejs/plugin-vue": "^6.0.4",
    "@vue/eslint-config-typescript": "^14.7.0",
    "@vue/tsconfig": "^0.8.1",
    "eslint": "^9.39.3",
    "eslint-plugin-vue": "^10.8.0",
    "typescript": "~5.9.2",
    "typescript-eslint": "^8.56.1",
    "vite": "^7.0.0",
    "vue-eslint-parser": "^10.4.0",
    "vue-tsc": "^3.2.5"
  }
}
```

### nx.json (plugins)
```json
{
  "plugins": [
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "testTargetName": "test",
        "serveTargetName": "serve",
        "typecheckTargetName": "typecheck"
      }
    },
    {
      "plugin": "@nx/eslint/plugin",
      "options": { "targetName": "lint" }
    }
  ]
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### tsconfig.base.json
```json
{
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "lib": ["es2022", "dom", "dom.iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "strict": true,
    "skipLibCheck": true,
    "target": "es2022"
  }
}
```

### apps/my-vue-app/tsconfig.app.json
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
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "target": "ESNext"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

### apps/my-vue-app/tsconfig.node.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.node.tsbuildinfo",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force"
  },
  "include": ["vite.config.ts"]
}
```
