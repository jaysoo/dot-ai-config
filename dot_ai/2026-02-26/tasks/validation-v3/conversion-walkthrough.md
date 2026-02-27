# TS Solution Migration Guide — Step-by-Step Validation (v3)

**Date:** 2026-02-26
**Workspace:** `/private/tmp/nx-test-workspace`
**Nx version:** 22.5.3
**Result:** ALL PASS (typecheck 7/7, test 7/7, lint 7/7, both app builds)

## Workspace structure

- 5 JS libs: `utils`, `models`, `helpers`, `validators`, `shared` (tsc bundler, vitest)
- 2 React apps: `app-webpack` (webpack+jest), `app-vite` (vite+vitest)
- Cross-project imports: `helpers→models`, `validators→models`, `shared→utils+models`, both apps→all 5 libs

---

## Step 1: Enable package manager workspaces

Add `workspaces` to root `package.json`, then run `npm install`.

**Before (root `package.json`):**
```json
{
  "name": "@nx-test-workspace/source",
  "private": true,
  "devDependencies": { ... }
  // No workspaces property
}
```

**After (root `package.json`):**
```json
{
  "name": "@nx-test-workspace/source",
  "workspaces": ["apps/*", "libs/*"],
  "private": true,
  "devDependencies": { ... }
}
```

**Key effect:** `npm install` creates symlinks in `node_modules/` for each project:
```
node_modules/@nx-test-workspace/models → ../../libs/models
node_modules/@nx-test-workspace/helpers → ../../libs/helpers
...
```

---

## Step 2: Update .gitignore

Add `test-output` pattern (vitest artifact). `out-tsc` and `dist` were already present.

**Before:**
```
dist
tmp
out-tsc
```

**After:**
```
dist
tmp
out-tsc
test-output
```

---

## Step 3: Update root TypeScript configuration

Remove `paths`, `rootDir`, `baseUrl`, `compileOnSave`, `declaration: false`, top-level `exclude`. Add `composite: true`.

**Before (`tsconfig.base.json`):**
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "declaration": false,
    "baseUrl": ".",
    "paths": {
      "@nx-test-workspace/utils": ["libs/utils/src/index.ts"],
      "@nx-test-workspace/models": ["libs/models/src/index.ts"],
      "@nx-test-workspace/helpers": ["libs/helpers/src/index.ts"],
      "@nx-test-workspace/validators": ["libs/validators/src/index.ts"],
      "@nx-test-workspace/shared": ["libs/shared/src/index.ts"]
    },
    ...
  },
  "exclude": ["node_modules", "tmp"]
}
```

**After (`tsconfig.base.json`):**
```json
{
  "compilerOptions": {
    "composite": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true
  }
}
```

**Key changes:**
- `paths` removed entirely (not `{}`)
- `rootDir`, `baseUrl` removed (not needed with workspace symlinks)
- `compileOnSave` removed (not a compilerOption)
- `declaration: false` removed (composite implies `true`)
- `composite: true` added
- Top-level `exclude` removed (only `compilerOptions` allowed)

**New file: root `tsconfig.json`:**
```json
{
  "extends": "./tsconfig.base.json",
  "files": [],
  "references": [
    { "path": "./libs/helpers" },
    { "path": "./libs/models" },
    { "path": "./libs/shared" },
    { "path": "./libs/utils" },
    { "path": "./libs/validators" },
    { "path": "./apps/app-vite" },
    { "path": "./apps/app-webpack" }
  ]
}
```

---

## Step 4: Register Nx TypeScript plugin

Add `@nx/js/typescript` as the first plugin in `nx.json`.

**Before (`nx.json` plugins):**
```json
[
  { "plugin": "@nx/eslint/plugin", ... },
  { "plugin": "@nx/vitest", ... },
  { "plugin": "@nx/webpack/plugin", ... },
  { "plugin": "@nx/jest/plugin", ... },
  { "plugin": "@nx/vite/plugin", ... }
]
```

**After (`nx.json` plugins, first entry):**
```json
{
  "plugin": "@nx/js/typescript",
  "options": {
    "typecheck": { "targetName": "typecheck" },
    "build": {
      "targetName": "build",
      "configName": "tsconfig.lib.json",
      "buildDepsName": "build-deps",
      "watchDepsName": "watch-deps"
    }
  }
}
```

---

## Step 5: Update build targets

Remove `@nx/js:tsc` build targets from non-buildable library `project.json` files.

**Before (`libs/models/project.json`):**
```json
{
  "name": "models",
  "targets": {
    "build": {
      "executor": "@nx/js:tsc",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/libs/models",
        "main": "libs/models/src/index.ts",
        "tsConfig": "libs/models/tsconfig.lib.json",
        "assets": ["libs/models/*.md"]
      }
    }
  },
  ...
}
```

**After (`libs/models/project.json`):**
```json
{
  "name": "models",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/models/src",
  "projectType": "library",
  "tags": []
}
```

**Why:** `@nx/js:tsc` fails with TS5090 (`Non-relative paths are not allowed when 'baseUrl' is not set`) after removing `baseUrl`. The `@nx/js/typescript` plugin infers a `typecheck` target instead.

Applied to all 5 libs: `utils`, `models`, `helpers`, `validators`, `shared`.

---

## Step 6: Create/update project package.json files

### Libraries (already had package.json — add `exports`):

**Before (`libs/models/package.json`):**
```json
{
  "name": "@nx-test-workspace/models",
  "version": "0.0.1",
  "private": true,
  "type": "commonjs",
  "main": "./src/index.js",
  "types": "./src/index.d.ts",
  "dependencies": { ... }
}
```

**After (`libs/models/package.json`):**
```json
{
  "name": "@nx-test-workspace/models",
  "version": "0.0.1",
  "private": true,
  "type": "commonjs",
  "main": "./src/index.js",
  "types": "./src/index.d.ts",
  "dependencies": { ... },
  "exports": {
    "./package.json": "./package.json",
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts",
      "default": "./src/index.ts"
    }
  }
}
```

### Applications (new package.json files):

**After (`apps/app-vite/package.json`):**
```json
{
  "name": "@nx-test-workspace/app-vite",
  "devDependencies": {
    "@nx-test-workspace/helpers": "*",
    "@nx-test-workspace/models": "*",
    "@nx-test-workspace/shared": "*",
    "@nx-test-workspace/utils": "*",
    "@nx-test-workspace/validators": "*"
  }
}
```

Then ran `npm install` to create symlinks for the new app packages.

---

## Step 7: Update project TypeScript configurations

### Per-project tsconfig.json — remove `compilerOptions`, keep structure:

**Before (`libs/models/tsconfig.json`):**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "importHelpers": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true
  },
  "files": [],
  "include": [],
  "references": [
    { "path": "./tsconfig.lib.json" },
    { "path": "./tsconfig.spec.json" }
  ]
}
```

**After (`libs/models/tsconfig.json`):**
```json
{
  "extends": "../../tsconfig.base.json",
  "files": [],
  "include": [],
  "references": [
    { "path": "./tsconfig.lib.json" },
    { "path": "./tsconfig.spec.json" }
  ]
}
```

### tsconfig.lib.json — extend base directly, merge compilerOptions:

**Before (`libs/models/tsconfig.lib.json`):**
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/out-tsc",
    "declaration": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": [ ... ]
}
```

**After (`libs/models/tsconfig.lib.json`):**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "importHelpers": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,
    "outDir": "./out-tsc/lib",
    "declaration": true,
    "types": ["node"]
  },
  "include": ["src/**/*.ts"],
  "exclude": [ ... ],
  "references": []
}
```

**Key changes:**
- `extends` changed from `./tsconfig.json` to `../../tsconfig.base.json`
- `compilerOptions` from project `tsconfig.json` merged in (strict, etc.)
- `module` and `moduleResolution` removed (inherit from base)
- `outDir` changed from `../../dist/out-tsc` to `./out-tsc/lib` (local to project)
- `references` added (populated by `nx sync`)

### tsconfig.spec.json — same pattern:

**Before:** `"extends": "./tsconfig.json"`, `"outDir": "../../dist/out-tsc"`
**After:** `"extends": "../../tsconfig.base.json"`, `"outDir": "./out-tsc/spec"`, added `"references": [{ "path": "./tsconfig.lib.json" }]`

### Library with cross-project deps (helpers→models):

After running `nx sync`, `libs/helpers/tsconfig.lib.json` gets:
```json
{
  "references": [
    { "path": "../models/tsconfig.lib.json" }
  ]
}
```

### Application tsconfigs — same restructuring:

**Before (`apps/app-webpack/tsconfig.json`):**
```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "allowJs": false,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "files": [],
  "include": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.spec.json" }
  ],
  "extends": "../../tsconfig.base.json"
}
```

**After (`apps/app-webpack/tsconfig.json`):**
```json
{
  "extends": "../../tsconfig.base.json",
  "files": [],
  "include": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.spec.json" }
  ]
}
```

(compilerOptions moved to `tsconfig.app.json` and `tsconfig.spec.json`)

---

## Step 8: Remove `nxViteTsPaths`

Remove the `nxViteTsPaths` import and plugin call from vite/vitest configs.

**Before (`apps/app-vite/vite.config.mts`):**
```ts
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
// ...
plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
```

**After (`apps/app-vite/vite.config.mts`):**
```ts
// nxViteTsPaths import removed
// ...
plugins: [react(), nxCopyAssetsPlugin(['*.md'])],
```

Applied to 6 files: all 5 lib `vitest.config.mts` + `apps/app-vite/vite.config.mts`.

---

## Step 9: Run `nx sync`

```
$ npx nx sync
NX  The workspace is out of sync
[@nx/js:typescript-sync]: Some TypeScript configuration files are missing project references...

$ npx nx sync --accept-updates
NX  The workspace is already up to date
```

This populates `references` in each project's `tsconfig.lib.json` and `tsconfig.json` based on the dependency graph.

---

## Step 10: Verify

```
$ npx nx reset
$ npx nx run-many -t typecheck,test,lint
NX  Successfully ran targets typecheck, test, lint for 7 projects

$ npx nx build app-webpack
webpack compiled successfully

$ npx nx build app-vite
✓ built in 429ms
```

### Results:
| Target    | Projects | Result |
|-----------|----------|--------|
| typecheck | 7/7      | PASS   |
| test      | 7/7      | PASS   |
| lint      | 7/7      | PASS   |
| build (app-webpack) | 1/1 | PASS |
| build (app-vite)    | 1/1 | PASS |
