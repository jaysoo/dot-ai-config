# Scenario 1: Nx React Monorepo -> Nx TS Workspace Import

**Date:** 2026-02-28
**Nx Version:** 22.5.1 (source) / 22.5.1 (dest, via create-nx-workspace@latest)
**Goal:** Validate VITE.md reference by importing a React monorepo into an empty TS workspace using subdirectory-at-a-time strategy.

---

## Setup

### Source Workspace (React Monorepo)

```bash
cd /tmp/vite-test-s1
npx create-nx-workspace@latest source --preset=react-monorepo --appName=portal --no-interactive --pm=pnpm
```

**Note:** The `--appName=portal` flag was ignored by the react-monorepo template. It generated a `shop` app instead, along with `api`, `shop-e2e`, and several libs.

**Source projects (10):**
- `apps/shop` - React Vite app (main shop frontend)
- `apps/api` - Express API (esbuild)
- `apps/shop-e2e` - Playwright e2e tests
- `libs/api/products` - Products service lib
- `libs/shared/models` - Shared TypeScript models
- `libs/shared/test-utils` - Shared test utilities
- `libs/shop/data` - React hooks for data fetching
- `libs/shop/feature-product-detail` - Product detail feature
- `libs/shop/feature-products` - Product list feature
- `libs/shop/shared-ui` - Shared UI components

**Source tsconfig.base.json (key values):**
```json
{
  "compilerOptions": {
    "lib": ["es2022"],
    "module": "esnext",
    "moduleResolution": "bundler"
  }
}
```

**Source pnpm-workspace.yaml:**
```yaml
packages:
  - 'apps/*'
  - 'libs/api/products'
  - 'libs/shared/*'
  - 'libs/shop/*'
```

**Source nx.json plugins:**
```json
[
  { "plugin": "@nx/js/typescript", "exclude": ["libs/shared/models/*"], ... },
  { "plugin": "@nx/react/router-plugin", ... },
  { "plugin": "@nx/eslint/plugin", "options": { "targetName": "lint" } },
  {
    "plugin": "@nx/vite/plugin",
    "options": {
      "buildTargetName": "build",
      "typecheckTargetName": "typecheck",
      ...
    }
  },
  { "plugin": "@nx/playwright/plugin", ... },
  { "plugin": "@nx/js/typescript", "include": ["libs/shared/models/*"], ... },
  { "plugin": "@nx/vitest", "options": { "testTargetName": "test" } }
]
```

**Source targetDefaults:**
```json
{
  "test": { "dependsOn": ["^build"] },
  "@nx/esbuild:esbuild": { "cache": true, "dependsOn": ["^build"], "inputs": ["production", "^production"] },
  "@nx/js:tsc": { "cache": true, "dependsOn": ["^build"], "inputs": ["production", "^production"] }
}
```

### Dest Workspace (TS Preset)

```bash
npx create-nx-workspace@latest dest --preset=ts --no-interactive --pm=pnpm
```

**Dest tsconfig.base.json BEFORE import:**
```json
{
  "compilerOptions": {
    "lib": ["es2022"],
    "module": "nodenext",
    "moduleResolution": "nodenext"
  }
}
```

**Dest pnpm-workspace.yaml BEFORE import:**
```yaml
packages:
  - 'packages/*'
```

**Dest nx.json plugins BEFORE import:**
```json
[
  {
    "plugin": "@nx/js/typescript",
    "options": {
      "typecheck": { "targetName": "typecheck" },
      "build": { "targetName": "build", "configName": "tsconfig.lib.json" }
    }
  }
]
```

**Dest package.json devDependencies BEFORE import:**
```json
{
  "@nx/js": "22.5.1",
  "@swc-node/register": "1.11.1",
  "@swc/core": "1.15.8",
  "@swc/helpers": "0.5.18",
  "nx": "22.5.1",
  "prettier": "^2.6.2",
  "tslib": "^2.3.0",
  "typescript": "~5.9.2"
}
```

---

## Import Steps

### Step 0: Remove .gitkeep

**VITE.md section: ".gitkeep Blocking Subdirectory Import"** -- APPLICABLE

```bash
cd /tmp/vite-test-s1/dest
rm packages/.gitkeep
git add -A && git commit -m "remove .gitkeep from packages"
```

**Verdict:** VITE.md correctly identified this issue.

### Step 1: Import apps

```bash
npx nx import /tmp/vite-test-s1/source apps --ref=main --source=apps --no-interactive
```

Output:
- Added `apps` (not `apps/*`) to pnpm-workspace.yaml
- Warning: "dependencies and devDependencies are not imported from the source repository"
- Created merge commit with 31 files

### Step 2: Import libs

```bash
npx nx import /tmp/vite-test-s1/source libs --ref=main --source=libs --no-interactive
```

Output:
- Added `libs` (not glob patterns) to pnpm-workspace.yaml
- Same dep warning
- Created merge commit with 88 files

**pnpm-workspace.yaml after both imports:**
```yaml
packages:
  - 'packages/*'
  - apps
  - libs
```

---

## Fix Steps (Following VITE.md Fix Order)

### Fix 1: pnpm-workspace.yaml globs

**VITE.md section: "pnpm Workspace Globs (Critical)"** -- APPLICABLE, CORRECT

VITE.md states: `nx import` adds only the imported directory itself, NOT the individual packages within it. With subdirectory-at-a-time import, it adds individual paths rather than glob patterns.

**Actual behavior:** Added bare directory names `apps` and `libs` (not even `apps/portal` as VITE.md suggested for subdirectory import). This is slightly different.

**BEFORE:**
```yaml
packages:
  - 'packages/*'
  - apps
  - libs
```

**AFTER:**
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'libs/api/products'
  - 'libs/shared/*'
  - 'libs/shop/*'
```

Then ran `pnpm install --no-frozen-lockfile`.

**Verdict:** VITE.md was correct about the problem and fix. Minor inaccuracy: said subdirectory import adds individual paths like `apps/portal`, but it actually added bare directory names.

### Fix 2: nx sync + nx reset

**VITE.md section: "TypeScript Project References"** -- APPLICABLE

```bash
npx nx sync --yes  # "workspace is out of sync"
npx nx reset       # Clear stale cache
npx nx sync --yes  # "already up to date"
```

**Verdict:** VITE.md correctly noted that `nx reset` may be needed before `nx sync` works properly.

### Fix 3: Add missing root dependencies

**VITE.md section: "Root Dependencies and Config Not Imported (Critical)"** -- APPLICABLE, CORRECT

The dest only had 8 devDependencies. Needed to add ~50 packages from the source.

**Production deps added:**
```bash
pnpm add -w react react-dom react-router-dom express
```

**Dev deps added (abbreviated, see package.json above for full list):**
```bash
pnpm add -wD @nx/vite @nx/vitest @nx/eslint @nx/eslint-plugin @nx/react \
  @nx/node @nx/esbuild @nx/web @nx/playwright @nx/docker @nx/devkit @nx/workspace \
  @vitejs/plugin-react vite vitest @vitest/coverage-v8 @vitest/ui jsdom \
  @types/node @types/react @types/react-dom \
  @testing-library/react @testing-library/jest-dom @testing-library/dom \
  "eslint@^9.0.0" eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react \
  "eslint-plugin-react-hooks@5.0.0" eslint-plugin-playwright eslint-config-prettier \
  @eslint/js typescript-eslint jsonc-eslint-parser \
  @babel/core @babel/preset-react esbuild ts-node jiti \
  @playwright/test @types/express @types/supertest supertest tslib
```

**Verdict:** VITE.md correctly identified this as critical. The "Common deps by framework" list is helpful but does not cover all deps. Best practice is to diff source and dest package.json.

### Fix 4: Module resolution (nodenext -> bundler) + lib + jsx

**VITE.md sections applied in one edit:**
- "Module Resolution: `bundler` vs `nodenext` (Critical)" -- APPLICABLE, CORRECT
- "tsconfig `lib` Array (Critical)" -- APPLICABLE, CORRECT
- "React TypeScript Configuration" (`jsx: react-jsx`) -- APPLICABLE, CORRECT

**BEFORE (dest tsconfig.base.json):**
```json
{
  "lib": ["es2022"],
  "module": "nodenext",
  "moduleResolution": "nodenext"
}
```

**AFTER:**
```json
{
  "lib": ["es2022", "dom", "dom.iterable"],
  "module": "esnext",
  "moduleResolution": "bundler",
  "jsx": "react-jsx"
}
```

**Verdict:** All three sections were applicable and correct. The combined fix worked exactly as documented.

### Fix 5: Configure nx.json plugins

**VITE.md section: "Plugin Detection and Configuration"** -- APPLICABLE, CRITICAL

Replaced the entire nx.json with the source's configuration (plugins, targetDefaults, namedInputs, generators).

Key changes:
- Added `@nx/vite/plugin` with `"typecheckTargetName": "typecheck"` (VITE.md correctly notes the default is `"vite:typecheck"`)
- Added `@nx/eslint/plugin`, `@nx/vitest`, `@nx/playwright/plugin`, `@nx/react/router-plugin`
- Added `targetDefaults` for `@nx/esbuild:esbuild` with `dependsOn: ["^build"]` (critical for API build ordering)
- Added `namedInputs.production` exclusions for cache behavior
- Added `generators` defaults for `@nx/react`

**Verdict:** VITE.md correctly identified that subdirectory import does NOT auto-detect plugins. However, VITE.md focuses on individual plugin fixes rather than recommending "copy the source's full nx.json config." The latter is more practical.

### Fix 6: Create root eslint.config.mjs

**VITE.md section: "Root ESLint Config Missing After Subdirectory Import"** -- APPLICABLE, CORRECT

Created `eslint.config.mjs` copied from source (includes module boundaries rules).

**Verdict:** VITE.md's template was close but the actual source config had more content. Best to copy from source.

### Fix 7: Create vitest.workspace.ts

**VITE.md section: NOT COVERED** -- GAP

Created `vitest.workspace.ts` from source:
```ts
export default [
  '**/vite.config.{mjs,js,ts,mts}',
  '**/vitest.config.{mjs,js,ts,mts}',
];
```

**Verdict:** VITE.md does NOT mention this file. Tests still passed without it (the @nx/vitest plugin handles test discovery), but it's part of the source workspace config that gets lost.

### Fix 8: ESLint Version Pinning (v9)

**VITE.md section: "ESLint Version Pinning (Critical)"** -- APPLICABLE, CRITICAL

When `pnpm add -wD eslint` was run, pnpm resolved ESLint 10.0.2 (latest). This caused:

```
TypeError: Error while loading rule 'react/no-direct-mutation-state':
  contextOrFilename.getFilename is not a function
```

**Fix:**
```bash
pnpm add -wD "eslint@^9.0.0"  # Resolved to 9.39.3
```

**Verdict:** VITE.md was 100% correct. The error message differed slightly from VITE.md's description (`getFilename is not a function` vs `Cannot read properties of undefined (reading 'version')`), but the root cause and fix matched exactly.

### Fix 9: eslint-plugin-react-hooks version pinning

**VITE.md section: NOT SPECIFICALLY COVERED** -- GAP

After pinning ESLint to v9, `@org/shop-feature-products:lint` had a NEW error not present in the source:

```
react-hooks/set-state-in-effect: Avoid calling setState() directly within an effect
```

Root cause: `pnpm add -wD eslint-plugin-react-hooks` resolved to v7.0.1 (latest) which has this new rule. Source used v5.0.0.

**Fix:**
```bash
pnpm add -wD "eslint-plugin-react-hooks@5.0.0"
```

**Verdict:** VITE.md's "Dependency Version Conflicts" section covers Vite/Vitest/React but not ESLint plugin version skew. This is a gap.

### Fix 10: @nx/devkit type declarations

**VITE.md section: "Root Dependencies and Config Not Imported"** -- PARTIALLY COVERED

The `shop-e2e` project's `playwright.config.ts` imports `workspaceRoot` from `@nx/devkit`:

```
TS2307: Cannot find module '@nx/devkit' or its corresponding type declarations.
```

**Fix:**
```bash
pnpm add -wD @nx/devkit @nx/workspace
```

**Verdict:** Covered conceptually by "Root Dependencies Not Imported" but `@nx/devkit` is not listed in any common deps list.

---

## Final Result

```bash
npx nx reset
npx nx run-many -t typecheck,build,test,lint
```

```
NX   Successfully ran targets typecheck, build, test, lint for 10 projects
```

**All 10 projects, all 4 targets pass.** Only pre-existing warnings remain:
- `@typescript-eslint/no-explicit-any` warnings in test files
- `@typescript-eslint/no-unused-vars` in api/main.ts
- `@typescript-eslint/no-non-null-assertion` in products.service.ts
- `jsx-a11y/accessible-emoji` in error-message.tsx
- Various `playwright/*` warnings in e2e tests

---

## Final Config File States

### tsconfig.base.json (AFTER all fixes)

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
    "jsx": "react-jsx",
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

### pnpm-workspace.yaml (AFTER all fixes)

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'libs/api/products'
  - 'libs/shared/*'
  - 'libs/shop/*'
```

### nx.json (AFTER all fixes)

Full source nx.json was copied, including:
- 7 plugins (js/typescript x2, react/router-plugin, eslint/plugin, vite/plugin, playwright/plugin, vitest)
- 3 targetDefaults (test, @nx/esbuild:esbuild, @nx/js:tsc)
- namedInputs with production exclusions
- generators defaults for @nx/react

### package.json (AFTER all fixes)

- 50+ devDependencies (all from source + @nx/devkit, @nx/workspace)
- 4 dependencies (react, react-dom, react-router-dom, express)
- eslint pinned to ^9.39.3 (NOT latest which is v10)
- eslint-plugin-react-hooks pinned to 5.0.0 (NOT latest which is v7)

### New files created

1. `eslint.config.mjs` - Root ESLint config (from source)
2. `vitest.workspace.ts` - Vitest workspace config (from source)

---

## VITE.md Section-by-Section Assessment

### Sections That Were Needed and Correct

| Section | Needed? | Correct? | Notes |
|---------|---------|----------|-------|
| Import Strategy: Subdirectory | Yes | Yes | Worked exactly as described |
| pnpm Workspace Globs | Yes | Yes | Minor: said "individual paths", actually added bare dir names |
| Root Dependencies Not Imported | Yes | Yes | Critical, but dep lists incomplete |
| TypeScript Project References | Yes | Yes | nx reset before nx sync was needed as documented |
| Module Resolution (bundler vs nodenext) | Yes | Yes | Exact match to documented problem and fix |
| tsconfig lib Array | Yes | Yes | Adding dom, dom.iterable was required |
| Plugin Detection/Configuration | Yes | Yes | Subdirectory import does NOT auto-detect plugins |
| Root ESLint Config Missing | Yes | Yes | Template was close, better to copy from source |
| ESLint Version Pinning | Yes | Yes | ESLint 10 broke exactly as warned |
| .gitkeep Blocking | Yes | Yes | Exactly as described |
| React TypeScript Configuration (jsx) | Yes | Yes | react-jsx needed in tsconfig.base.json |
| React Dependencies list | Yes | Partially | Missing some deps (e.g., @nx/devkit) |

### Sections That Were NOT Needed (Not Applicable)

| Section | Why N/A |
|---------|---------|
| Whole repo import sections | Used subdirectory import |
| Explicit Executor Path Fixups | Executor paths were already correct (apps/api/...) |
| Redundant Root Files | Not a whole-repo import |
| Non-Nx Source Issues | Source was an Nx workspace |
| Vue-Specific | React only |
| Mixed React + Vue | Single framework |
| Dependency Version Conflicts (Vite/Vitest) | Same versions in source and dest |
| React Version Conflicts (18 vs 19) | Both used React 19 |
| Project Name Collisions | No name conflicts |
| Workspace Dep Import Ordering | pnpm install succeeded |
| Module Boundaries After Import | No boundary violations |
| @testing-library/jest-dom with Vitest | Using vitest correctly already |

### Gaps in VITE.md (Issues NOT Covered)

1. **vitest.workspace.ts not mentioned.** Root workspace config file that gets lost during subdirectory import. Tests still pass via @nx/vitest plugin, but the file should be mentioned alongside eslint.config.mjs.

2. **ESLint plugin version skew.** `pnpm add` resolves latest versions. eslint-plugin-react-hooks jumped from v5 to v7 which added breaking rules. VITE.md should note: "When adding deps, pin versions to match the source's package.json."

3. **@nx/devkit as implicit dependency.** Playwright config imports from @nx/devkit but it's not listed in any common deps list in VITE.md.

4. **targetDefaults not imported (needs more detail).** VITE.md mentions this in "Root Dependencies" but doesn't emphasize that `@nx/esbuild:esbuild` and `test` targetDefaults are critical for build ordering.

5. **namedInputs.production not imported.** Affects caching behavior. Not mentioned.

6. **@nx/react/router-plugin not mentioned.** The react-monorepo template generates this plugin config.

7. **generators config in nx.json not mentioned.** Not critical for runtime, but part of source config.

### VITE.md Advice That Was Wrong or Misleading

1. **Minor: Subdirectory import pnpm-workspace behavior.** Said "adds individual paths (e.g. `apps/portal`)", but actually added bare directory names (`apps`, `libs`). This depends on the `--source` flag value.

2. **Minor: ESLint 10 error message.** VITE.md says `Cannot read properties of undefined (reading 'version')`. Actual error was `contextOrFilename.getFilename is not a function`. Both are ESLint 10 incompatibilities, just different manifestations.

3. **Nothing was truly wrong.** All major guidance was accurate and actionable. No advice led to a wrong fix or wasted effort.

---

## Commands Run (Complete Sequence)

```bash
# Setup
cd /tmp/vite-test-s1
npx create-nx-workspace@latest dest --preset=ts --no-interactive --pm=pnpm
npx create-nx-workspace@latest source --preset=react-monorepo --appName=portal --no-interactive --pm=pnpm

# Pre-import
cd /tmp/vite-test-s1/dest
rm packages/.gitkeep && git add -A && git commit -m "remove .gitkeep from packages"

# Import
npx nx import /tmp/vite-test-s1/source apps --ref=main --source=apps --no-interactive
npx nx import /tmp/vite-test-s1/source libs --ref=main --source=libs --no-interactive

# Fix 1: pnpm-workspace.yaml (edited manually)
pnpm install --no-frozen-lockfile

# Fix 2: TypeScript project references
npx nx sync --yes
npx nx reset
npx nx sync --yes

# Fix 3: Dependencies
pnpm add -wD @nx/vite @nx/vitest @nx/eslint @nx/eslint-plugin @nx/react @nx/node \
  @nx/esbuild @nx/web @nx/playwright @nx/docker @nx/devkit @nx/workspace \
  @vitejs/plugin-react vite vitest @vitest/coverage-v8 @vitest/ui jsdom \
  @types/node @types/react @types/react-dom \
  @testing-library/react @testing-library/jest-dom @testing-library/dom \
  "eslint@^9.0.0" eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react \
  "eslint-plugin-react-hooks@5.0.0" eslint-plugin-playwright eslint-config-prettier \
  @eslint/js typescript-eslint jsonc-eslint-parser \
  @babel/core @babel/preset-react esbuild ts-node jiti \
  @playwright/test @types/express @types/supertest supertest tslib
pnpm add -w react react-dom react-router-dom express

# Fix 4: tsconfig.base.json (edited manually: nodenext->bundler, added dom, jsx)
# Fix 5: nx.json (replaced entirely with source config)
# Fix 6: Created eslint.config.mjs (from source)
# Fix 7: Created vitest.workspace.ts (from source)

# Final verification
npx nx reset
npx nx run-many -t typecheck,build,test,lint
# Result: Successfully ran targets typecheck, build, test, lint for 10 projects
```

## Conclusion

VITE.md is **highly accurate and actionable** for this scenario. Every critical section that applied was correct, and following the fix order produced a fully working workspace. The main gaps are:

1. Missing mention of `vitest.workspace.ts` and other root config files
2. ESLint plugin version pinning advice (not just ESLint itself)
3. More comprehensive dep lists (or explicit advice to diff package.json files)
4. More detail on nx.json config that needs copying (not just plugins, but also targetDefaults, namedInputs, generators)

The document's biggest strength is the **fix order** which is correct and efficient. The biggest weakness is the **dependency management** section, which lists common deps but misses several needed in practice. The pragmatic approach is to diff `package.json` and `nx.json` between source and dest, rather than relying on the dep lists.
