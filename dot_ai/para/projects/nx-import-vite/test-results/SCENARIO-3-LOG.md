# Scenario 3: Non-Nx React (create-vite) into Nx TS Workspace

**Date**: 2026-02-28
**Nx Version**: 22.5.1
**Vite Version**: 7.3.1 (source), ^7.0.0 (dest root)
**TypeScript**: ~5.9.3 (source), ~5.9.2 (dest)
**Result**: ALL TARGETS PASS (typecheck, build, lint)

---

## Step 1: Create Destination Workspace

```bash
cd /tmp/vite-test-s3
npx create-nx-workspace@latest dest --preset=ts --no-interactive --pm=pnpm
```

Output (abbreviated):
```
Creating Nx workspace v22.5.3...
Successfully created the workspace: /private/tmp/vite-test-s3/dest
```

### Dest Initial State

**nx.json** (relevant plugins):
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

**tsconfig.base.json**:
```json
{
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "lib": ["es2022"],
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "target": "es2022"
  }
}
```

**package.json devDependencies**: `@nx/js`, `nx`, `typescript`, `prettier`, `@swc-*`, `tslib`

**pnpm-workspace.yaml**: `packages: ['packages/*']`

**packages/.gitkeep**: Present (empty file)

---

## Step 2: Create Non-Nx Source

```bash
mkdir -p /tmp/vite-test-s3/source && cd /tmp/vite-test-s3/source
pnpm init
pnpm create vite my-app --template react-ts
cd my-app && pnpm install && cd ..
git init && git add -A && git commit -m "init"
```

### Source Initial State

**my-app/package.json**:
```json
{
  "name": "my-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1"
  }
}
```

**my-app/tsconfig.json** (solution-style):
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**my-app/tsconfig.app.json** (BEFORE):
```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**my-app/tsconfig.node.json** (BEFORE):
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

**my-app/eslint.config.js** (self-contained flat config from create-vite):
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

**my-app/vite.config.ts**:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
})
```

---

## Step 3: Import Into Dest

### 3a: Remove .gitkeep

```bash
cd /tmp/vite-test-s3/dest
rm packages/.gitkeep
git add -A && git commit -m "remove .gitkeep"
```

**VITE.md section**: ".gitkeep Blocking Subdirectory Import" -- APPLICABLE and needed.

### 3b: Run nx import

```bash
npx nx import /tmp/vite-test-s3/source apps/my-app --ref=main --source=my-app --no-interactive
```

Output (key parts):
```
- Cloning /tmp/vite-test-s3/source into a temporary directory
- Filtering git history to only include files in my-app
- Merging files and git history from main from /tmp/vite-test-s3/source into apps/my-app

Recommended Plugins:
- @nx/eslint
- @nx/vite

Mismatched package managers: source is npm, dest is pnpm.

Project added in workspaces: Added "apps/my-app" to packages.

Generating @nx/eslint:init
Generating @nx/vite:init

commit: feat(repo): merge main from /tmp/vite-test-s3/source
```

### State After Import (BEFORE fixes)

**pnpm-workspace.yaml**: Added `apps/my-app` (literal path, not glob)
**package.json**: Added `@nx/eslint`, `@nx/vite`, `@nx/web`, `@vitest/ui`, `eslint@~8.57.0`, `vite@^7.0.0`, `vitest@^4.0.0`, `jiti`
**nx.json**: Added `@nx/eslint/plugin` (targetName: `eslint:lint`), `@nx/vite/plugin` (all target names prefixed with `vite:`)
**apps/my-app/package.json**: Scripts rewritten to `nx serve`, `tsc -b && nx vite:build`, `nx eslint:lint`, `nx vite:preview`
**apps/my-app/node_modules**: Present (stale symlinks from source)
**apps/my-app/pnpm-lock.yaml**: Present (stale from source)

### Observed Issues After Import

1. `typecheck` target shows: "The 'typecheck' target is disabled because one or more project references set 'noEmit: true'"
2. Plugin target names are all prefixed (`vite:build`, `vite:typecheck`, `eslint:lint`)
3. Both `@nx/js/typescript` and `@nx/vite/plugin` present causing duplicate typecheck targets
4. ESLint pinned to v8 at root but app needs v9 flat config
5. Rewritten npm scripts in app package.json
6. Stale node_modules and pnpm-lock.yaml in imported dir

---

## Step 4: Apply VITE.md Fixes

### Fix 1: Remove stale node_modules (VITE.md: "Stale node_modules from Import")

**APPLICABLE**: Yes. `apps/my-app/node_modules` existed with stale pnpm symlinks.

```bash
rm -rf /tmp/vite-test-s3/dest/apps/my-app/node_modules
rm -f /tmp/vite-test-s3/dest/apps/my-app/pnpm-lock.yaml
```

**Note**: VITE.md mentions removing `node_modules` but does NOT mention removing stale `pnpm-lock.yaml` files from the imported project. This is a **gap** -- the lock file is also dead weight in a monorepo.

### Fix 2: Fix pnpm-workspace.yaml globs (VITE.md: "pnpm Workspace Globs (Critical)")

**APPLICABLE**: Yes. `nx import` added the literal path `apps/my-app` instead of a glob.

BEFORE:
```yaml
packages:
  - 'packages/*'
  - apps/my-app
```

AFTER:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### Fix 3: Remove rewritten npm scripts (VITE.md: "npm Script Rewriting (Critical)")

**APPLICABLE**: Yes. All scripts were rewritten.

BEFORE:
```json
"scripts": {
  "dev": "nx serve",
  "build": "tsc -b && nx vite:build",
  "lint": "nx eslint:lint",
  "preview": "nx vite:preview"
}
```

AFTER:
```json
"scripts": {}
```

**VITE.md accuracy**: Exactly correct. The `"build": "tsc -b && vite build"` was rewritten to `"tsc -b && nx vite:build"` which matches the pattern described. Removing all scripts and letting Nx infer targets is the right fix.

### Fix 4: Fix noEmit -> composite + emitDeclarationOnly (VITE.md: "`noEmit` -> `composite` + `emitDeclarationOnly` (Critical)")

**APPLICABLE**: Yes. Both `tsconfig.app.json` and `tsconfig.node.json` had `"noEmit": true`.

**tsconfig.app.json** AFTER:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

**tsconfig.node.json** AFTER:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

Changes made in both files:
1. Added `"extends": "../../tsconfig.base.json"`
2. Removed `"noEmit": true`
3. Added `"composite": true`, `"emitDeclarationOnly": true`, `"declarationMap": true`
4. Changed `"tsBuildInfoFile"` from `./node_modules/.tmp/...` to `dist/...`
5. Added `"outDir": "dist"`
6. Removed `"skipLibCheck": true` (inherited from base)
7. Removed `"strict": true` (inherited from base)
8. Removed `"noFallthroughCasesInSwitch": true` (inherited from base)

**VITE.md accuracy**: Excellent. All four sub-steps (remove noEmit, add composite/emitDeclarationOnly/declarationMap, add outDir/tsBuildInfoFile, add extends) were needed exactly as documented. The note about `create-vite` using solution-style tsconfig with no `extends` was accurate.

### Fix 5: Fix module resolution in tsconfig.base.json (VITE.md: "Module Resolution: bundler vs nodenext (Critical)")

**APPLICABLE**: Yes. Dest defaulted to `nodenext`/`nodenext`.

BEFORE:
```json
{
  "lib": ["es2022"],
  "module": "nodenext",
  "moduleResolution": "nodenext"
}
```

AFTER:
```json
{
  "lib": ["es2022", "dom", "dom.iterable"],
  "module": "esnext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx"
}
```

**VITE.md accuracy**: Correct. Also added `dom`/`dom.iterable` to `lib` per "tsconfig lib Array (Critical)" section, and `jsx: react-jsx` per "React TypeScript Configuration" section. All three were needed.

### Fix 6: Configure @nx/vite/plugin typecheck target in nx.json (VITE.md: "Plugin Detection and Configuration")

**APPLICABLE**: Yes. `@nx/vite/plugin` defaulted all targets to `vite:` prefix. Also needed to remove `@nx/js/typescript` since all projects are Vite-based.

BEFORE:
```json
{
  "plugins": [
    { "plugin": "@nx/js/typescript", "options": { "typecheck": { "targetName": "typecheck" }, "build": { ... } } },
    { "plugin": "@nx/eslint/plugin", "options": { "targetName": "eslint:lint" } },
    { "plugin": "@nx/vite/plugin", "options": { "typecheckTargetName": "vite:typecheck", "buildTargetName": "vite:build", ... } }
  ]
}
```

AFTER:
```json
{
  "plugins": [
    { "plugin": "@nx/eslint/plugin", "options": { "targetName": "lint" } },
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "testTargetName": "test",
        "serveTargetName": "serve",
        "devTargetName": "dev",
        "previewTargetName": "preview",
        "serveStaticTargetName": "serve-static",
        "typecheckTargetName": "typecheck"
      }
    }
  ]
}
```

**VITE.md accuracy**: Correct. The guidance to remove `@nx/js/typescript` when all projects are Vite-based was applicable. The note about `typecheckTargetName` defaulting to `vite:typecheck` was accurate. Also added `eslint.config.js` to the `production` namedInput exclusions since the source uses `.js` not `.mjs`.

### Fix 7: Add missing root deps (VITE.md: "Root Dependencies and Config Not Imported (Critical)")

**APPLICABLE**: Yes.

```bash
pnpm add -w react react-dom
pnpm add -wD @types/react @types/react-dom @vitejs/plugin-react \
  @eslint/js globals eslint-plugin-react-hooks eslint-plugin-react-refresh \
  typescript-eslint @nx/eslint-plugin
```

**Note**: `nx import` did auto-install `vite`, `vitest`, `@vitest/ui` at root. But it did NOT install `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, or any ESLint plugins. These all had to be added manually.

**VITE.md accuracy**: Correct. The "Common deps by framework" guidance and the React Dependencies section listed exactly what was needed.

### Fix 8: ESLint version pinning (VITE.md: "ESLint Version Pinning (Critical)")

**APPLICABLE**: Yes. `nx import` installed `eslint@~8.57.0` at root.

```bash
pnpm add -wD eslint@^9.0.0
```

Resolved to `eslint@9.39.3`.

**VITE.md accuracy**: Correct. The `@nx/eslint:init` generator pins ESLint to v8, but the create-vite flat config requires ESLint 9.

### Fix 9: ESLint config handling (VITE.md: "ESLint Config Handling (Non-Nx Sources)")

**APPLICABLE**: Partially. The source has a self-contained ESLint 9 flat config (`eslint.config.js`). Per VITE.md: "Self-contained flat configs (e.g. from `create-vite`) can often be left as-is without conversion."

**Decision**: Left the `eslint.config.js` as-is. It does NOT reference a root config via `../../eslint.config.mjs`, so no root config was needed.

**VITE.md accuracy**: Correct. The guidance to leave self-contained flat configs from create-vite as-is worked perfectly.

### Fix 10: Run nx sync, nx reset

```bash
npx nx reset
npx nx sync --yes
```

Output:
```
NX   The workspace is already up to date
[@nx/js:typescript-sync]: All files are up to date.
```

**VITE.md accuracy**: The section recommends `nx sync --yes` then `nx reset` then `nx sync --yes` again. In this case, `nx reset` then `nx sync --yes` once was sufficient.

---

## Step 5: Final Verification

```bash
npx nx run-many -t typecheck,build,test,lint
```

Output:
```
NX   Running targets typecheck, build, lint for project my-app:

> nx run my-app:typecheck
> tsc --build --emitDeclarationOnly
(success)

> nx run my-app:lint
> eslint .
(success)

> nx run my-app:build
> vite build
vite v7.3.1 building client environment for production...
32 modules transformed.
dist/index.html                   0.45 kB | gzip:  0.29 kB
dist/assets/react-CHdo91hT.svg    4.13 kB | gzip:  2.05 kB
dist/assets/index-COcDBgFa.css    1.38 kB | gzip:  0.70 kB
dist/assets/index-DWyDJMmB.js   193.91 kB | gzip: 60.94 kB
built in 586ms
(success)

NX   Successfully ran targets typecheck, build, lint for project my-app
```

**Note**: `test` target was silently skipped because `create-vite` does not scaffold vitest. No `vitest.config.ts` or test files exist, so `@nx/vite/plugin` does not infer a test target.

---

## VITE.md Section Applicability

| Section | Applicable? | Notes |
|---------|-------------|-------|
| **Import Strategy** | Yes | Used whole-repo import since source is non-monorepo. VITE.md recommends this correctly. |
| **pnpm Workspace Globs (Critical)** | Yes | `nx import` added literal `apps/my-app` instead of glob `apps/*`. |
| **.gitkeep Blocking** | Yes | TS preset creates `packages/.gitkeep`. Had to remove and commit. |
| **Root Dependencies Not Imported (Critical)** | Yes | react, react-dom, @types/*, @vitejs/plugin-react, ESLint plugins all missing. |
| **Module Resolution (Critical)** | Yes | Had to change `nodenext` to `bundler` in tsconfig.base.json. |
| **tsconfig lib Array (Critical)** | Yes | Had to add `dom`, `dom.iterable`. |
| **Plugin Detection and Configuration** | Yes | Had to rename all target names, remove @nx/js/typescript. |
| **ESLint Version Pinning (Critical)** | Yes | @nx/eslint:init pinned ESLint 8, needed v9. |
| **npm Script Rewriting (Critical)** | Yes | All 4 scripts rewritten to broken `nx` commands. |
| **noEmit -> composite (Critical)** | Yes | Both tsconfig.app.json AND tsconfig.node.json needed fixing. |
| **Stale node_modules** | Yes | node_modules dir with stale symlinks present. |
| **ESLint Config Handling** | Yes | Self-contained flat config from create-vite left as-is. Worked. |
| **React TypeScript Configuration** | Yes | Added `jsx: react-jsx` to tsconfig.base.json. |
| **React Dependencies** | Yes | Listed deps were exactly what was needed. |
| **TypeScript Project References** | Yes | `nx sync` worked after fixes. |
| **Redundant Root Files** | N/A | Not applicable for non-whole-repo import. |
| **Root ESLint Config Missing** | N/A | Not needed because create-vite config is self-contained. |
| **Explicit Executor Path Fixups** | N/A | No explicit executors in source. |
| **Dependency Version Conflicts** | N/A | Source and dest vite/typescript versions were compatible. |
| **Vite resolve.alias / __dirname** | N/A | Source didn't use these. |
| **Missing TypeScript lib and types** | Partially | Source already had `lib` and `types` in project tsconfigs. |
| **@nx/vite Plugin Install Failure** | N/A | Plugin installed successfully during import. |
| **TypeScript paths Aliases** | N/A | Source didn't use path aliases. |
| **Module Boundaries** | N/A | Single project, no cross-project imports. |
| **Project Name Collisions** | N/A | Single import, no conflicts. |
| **Workspace Dep Import Ordering** | N/A | Single project, no workspace deps. |

---

## Gaps in VITE.md

### 1. Stale pnpm-lock.yaml not mentioned
The imported project directory contained a `pnpm-lock.yaml` file from the source. VITE.md mentions removing `node_modules` but not stale lock files. These are also dead weight in a monorepo with a root lock file.

**Recommendation**: Add to "Stale node_modules from Import" section: "Also remove any `pnpm-lock.yaml`, `package-lock.json`, or `yarn.lock` files within the imported directory."

### 2. @nx/eslint:init pins ESLint to v8 -- not explicitly called out
VITE.md has "ESLint Version Pinning (Critical)" about pinning to v9, but doesn't explicitly mention that the `@nx/eslint:init` generator (run during `nx import`) actively installs `eslint@~8.57.0`. The fix section says "Pin ESLint to v9" but a user might not realize they need to UPGRADE from the version that was just auto-installed.

**Recommendation**: Add to "ESLint Version Pinning": "Note: The `@nx/eslint:init` generator installs `eslint@~8.57.0` at root. You must upgrade this to v9."

### 3. `@nx/vite/plugin` default target name prefixes not fully documented
VITE.md correctly notes `typecheckTargetName` defaults to `vite:typecheck`, but during actual import, ALL target names get `vite:` prefixes (`vite:build`, `vite:dev`, `vite:preview`). Similarly, `@nx/eslint/plugin` defaults to `eslint:lint`. The fix section only mentions typecheck.

**Recommendation**: Add note that ALL plugin target names default to prefixed versions during `nx import` auto-configuration, and all should be simplified (e.g., `build`, `test`, `serve`, `lint`, `typecheck`).

### 4. `@nx/js/typescript` removal not in fix order
VITE.md's "Fix Order: Non-Nx Source" doesn't include removing `@nx/js/typescript` from nx.json. The guidance about it is in the "Plugin Detection and Configuration" section but not in the numbered fix order checklist.

**Recommendation**: Add step to fix order: "Remove `@nx/js/typescript` from nx.json plugins if all projects use Vite (or rename its typecheck target if non-Vite TS libs exist)."

### 5. `namedInputs.production` missing eslint.config.js pattern
The `@nx/eslint:init` adds `!{projectRoot}/eslint.config.mjs` to production namedInputs, but create-vite generates `eslint.config.js` (not `.mjs`). This means ESLint config changes could invalidate build cache.

**Recommendation**: Minor, but could note that `eslint.config.js` should be added to production exclusions in namedInputs if the source uses `.js` extension.

### 6. `create-vite` newer tsconfig features not mentioned
The latest `create-vite` (Feb 2026) generates tsconfigs with `"erasableSyntaxOnly": true` and `"noUncheckedSideEffectImports": true` -- these are newer TypeScript 5.9 features that may not be in the dest's `tsconfig.base.json`. They were preserved in the project-level tsconfigs without issue, but worth noting.

---

## VITE.md Advice That Was Wrong or Unnecessary

### 1. None was wrong
Every piece of applicable advice from VITE.md was correct and necessary. No advice led to errors or wasted effort.

### 2. Minor: Two-pass nx sync not needed
VITE.md says "Run `nx sync --yes` -> `nx reset` -> `nx sync --yes` (may need two passes)". In this scenario, a single `nx reset` + `nx sync --yes` was sufficient. The "(may need two passes)" qualifier is appropriate though.

---

## Final Config Files (Post-Fix)

### /tmp/vite-test-s3/dest/package.json
```json
{
  "name": "@org/source",
  "version": "0.0.0",
  "license": "MIT",
  "scripts": {},
  "private": true,
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.3",
    "@nx/eslint": "22.5.1",
    "@nx/eslint-plugin": "^22.5.3",
    "@nx/js": "22.5.1",
    "@nx/vite": "22.5.1",
    "@nx/web": "22.5.1",
    "@swc-node/register": "1.11.1",
    "@swc/core": "1.15.8",
    "@swc/helpers": "0.5.18",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.4",
    "@vitest/ui": "^4.0.0",
    "eslint": "~9.39.3",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.26",
    "globals": "^16.5.0",
    "jiti": "2.4.2",
    "nx": "22.5.1",
    "prettier": "^2.6.2",
    "tslib": "^2.3.0",
    "typescript": "~5.9.2",
    "typescript-eslint": "^8.56.1",
    "vite": "^7.0.0",
    "vitest": "^4.0.0"
  }
}
```

### /tmp/vite-test-s3/dest/nx.json
```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/eslint.config.mjs",
      "!{projectRoot}/eslint.config.js",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/src/test-setup.[jt]s"
    ],
    "sharedGlobals": []
  },
  "plugins": [
    {
      "plugin": "@nx/eslint/plugin",
      "options": { "targetName": "lint" }
    },
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "testTargetName": "test",
        "serveTargetName": "serve",
        "devTargetName": "dev",
        "previewTargetName": "preview",
        "serveStaticTargetName": "serve-static",
        "typecheckTargetName": "typecheck"
      }
    }
  ],
  "nxCloudId": "69a30c7acf4238cb410aea4d"
}
```

### /tmp/vite-test-s3/dest/tsconfig.base.json
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
    "jsx": "react-jsx",
    "customConditions": ["@org/source"]
  }
}
```

### /tmp/vite-test-s3/dest/pnpm-workspace.yaml
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

### /tmp/vite-test-s3/dest/apps/my-app/package.json
```json
{
  "name": "my-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {},
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1"
  }
}
```

### /tmp/vite-test-s3/dest/apps/my-app/tsconfig.app.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

### /tmp/vite-test-s3/dest/apps/my-app/tsconfig.node.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "tsBuildInfoFile": "dist/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "composite": true,
    "emitDeclarationOnly": true,
    "declarationMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

### /tmp/vite-test-s3/dest/apps/my-app/eslint.config.js (unchanged)
```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

---

## Summary

The VITE.md reference was **highly accurate** for this scenario. Every "Critical" section was applicable and the fixes worked exactly as described. The "Non-Nx Source Issues" section was heavily exercised and proved reliable. The 6 gaps identified are minor documentation improvements, not correctness issues.

**Total fixes applied**: 10
**Time to working state**: ~5 minutes of actual config editing after the import
**Most impactful fix**: The `noEmit -> composite` + `extends` change in both tsconfigs -- without this, typecheck is completely disabled
**Most surprising**: `@nx/eslint:init` installing ESLint 8 when the source needs ESLint 9
