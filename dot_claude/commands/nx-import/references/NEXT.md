## Next.js

Next.js-specific guidance for `nx import`. For generic import issues (pnpm globs, root deps, project references, name collisions, ESLint pinning, non-Nx source handling), see `SKILL.md`.

---

### Root tsconfig Settings That Next.js Projects Need (Critical)

Next.js projects depend on specific `tsconfig.base.json` settings that differ from the TS preset defaults. After import, verify these in the dest root tsconfig:

- **`moduleResolution`**: Must be `"bundler"` (not `"nodenext"`)
- **`module`**: Must be `"esnext"` (not `"nodenext"`)
- **`lib`**: Must include `"dom"` and `"dom.iterable"` (frontend projects need these)
- **`jsx`**: Must be `"react-jsx"` for single-framework workspaces, or set per-project for mixed

**Gotcha**: TypeScript does NOT merge `lib` arrays — a project-level override **replaces** the base array entirely. Always include all needed entries in any project-level `lib`.

### `@nx/next/plugin` Inferred Targets

`@nx/next/plugin` detects `next.config.{ts,js,cjs,mjs}` and creates these targets:
- `build` → `next build` (with `dependsOn: ['^build']`)
- `dev` → `next dev`
- `start` → `next start` (depends on `build`)
- `serve-static` → same as `start`
- `build-deps` / `watch-deps` — for TS solution setup

**No separate typecheck target** — Next.js runs TypeScript checking as part of `next build`. The `@nx/js/typescript` plugin provides a standalone `typecheck` target for non-Next libraries in the workspace.

**Build target conflict**: Both `@nx/next/plugin` and `@nx/js/typescript` define a `build` target. `@nx/next/plugin` wins for Next.js projects (it detects `next.config.*`), while `@nx/js/typescript` handles libraries with `tsconfig.lib.json`. No rename needed — they coexist.

### `withNx` in `next.config.js`

Nx-generated Next.js projects use `composePlugins(withNx)` from `@nx/next`. This wrapper is optional for `next build` via the inferred plugin (which just runs `next build`), but it provides Nx-specific configuration. Keep it if present.

### Root Dependencies Not Imported (Critical)

`nx import` does NOT bring root devDependencies. For Next.js projects, you'll typically need to add:

**Core**: `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@types/node`
**Nx plugins**: `@nx/next` (auto-installed by import), `@nx/react` (for CSS module/image typings in libs), `@nx/eslint`, `@nx/jest`
**Testing**: `jest`, `@types/jest`, `jest-environment-jsdom`, `ts-jest`, `@testing-library/react`, `@testing-library/jest-dom`, `identity-obj-proxy`
**ESLint**: `eslint@^9`, `@nx/eslint-plugin`, `@next/eslint-plugin-next`, `typescript-eslint`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks`

### `@nx/react` Typings for Libraries (Critical)

React libraries generated with `@nx/react:library` reference `@nx/react/typings/cssmodule.d.ts` and `@nx/react/typings/image.d.ts` in their tsconfig `types`. These fail with `Cannot find type definition file` unless `@nx/react` is installed in the dest workspace.

**Fix**: `pnpm add -wD @nx/react`

### Next.js Auto-Installing Dependencies via Wrong Package Manager

Next.js detects missing `@types/react` during `next build` and tries to install it using `yarn add` regardless of the actual package manager. In a pnpm workspace, this fails with a "nearest package directory isn't part of the project" error.

**Root cause**: `@types/react` is missing from root devDependencies.
**Fix**: Install deps at the root before building: `pnpm add -wD @types/react @types/react-dom`

### Jest Configuration (Nx Source)

The Next.js preset creates jest configs referencing `../../jest.preset.js`, which lives at the source root and is **not imported** by subdirectory import.

**Fix**:
1. Install `@nx/jest`: `npx nx add @nx/jest`
2. Create `jest.preset.js` at dest root:
   ```js
   const nxPreset = require('@nx/jest/preset').default;
   module.exports = { ...nxPreset };
   ```
3. Install test runner deps: `pnpm add -wD jest jest-environment-jsdom ts-jest @types/jest`

### Next.js TypeScript Config Specifics

Next.js app tsconfigs have unique patterns compared to Vite:

- **`noEmit: true`** with `emitDeclarationOnly: false` — Next.js handles emit, TS just checks types. This conflicts with `composite: true` from the TS solution setup.
- **`"types": ["jest", "node"]`** — includes test types in the main tsconfig (no separate `tsconfig.app.json`)
- **`"plugins": [{ "name": "next" }]`** — for IDE integration
- **`include`** references `.next/types/**/*.ts` for Next.js auto-generated types
- **`"jsx": "preserve"`** — Next.js uses its own JSX transform, not React's

**Gotcha**: The Next.js tsconfig sets `"noEmit": true` which disables `composite` mode. This is fine because Next.js projects use `next build` for building, not `tsc`. The `@nx/js/typescript` plugin's `typecheck` target is not needed for Next.js apps.

### ESLint Setup (Subdirectory Import)

Subdirectory import brings project-level eslint configs but NOT the root config they extend.

**Fix order**:
1. Install ESLint deps (see "Root Dependencies" above)
2. Create root `eslint.config.mjs` with `@nx/eslint-plugin` base rules
3. Run `npx nx add @nx/eslint` to register the plugin in `nx.json`

Next.js project configs use `@next/eslint-plugin-next` — ensure it's installed at root.

### `next.config.js` Lint Warning

Imported Next.js configs may have `// eslint-disable-next-line @typescript-eslint/no-var-requires` but the project ESLint config enables different rule sets. This produces `Unused eslint-disable directive` warnings. Harmless — remove the comment or ignore.

### `namedInputs` and `targetDefaults`

The Next.js preset defines `namedInputs.production` with test file exclusions and `targetDefaults` for test ordering. These are NOT imported by subdirectory import.

**Fix**: Diff source and dest `nx.json`. Add missing `production` exclusion patterns and `targetDefaults` (e.g. `"test": { "dependsOn": ["^build"] }`).

---

## Non-Nx Source (create-next-app)

### Whole-Repo Import Recommended

For single-project `create-next-app` repos, use whole-repo import into a subdirectory:
```bash
nx import /path/to/source apps/web --ref=main --source=. --no-interactive
```

### Target Name Prefixing

When importing a project with existing npm scripts (`build`, `dev`, `start`, `lint`), `@nx/next/plugin` and `@nx/eslint/plugin` auto-prefix target names to avoid conflicts: `next:build`, `next:dev`, `next:start`, `eslint:lint`.

**Fix**: Remove the rewritten npm scripts from the imported `package.json` (Nx rewrites `"build": "next build"` → `"build": "nx next:build"`). Or rename plugin targets in `nx.json` to use unprefixed names if you prefer.

### Stale Root Files from Source

Whole-repo import brings ALL source root files into the dest subdirectory. Clean up:
- `pnpm-lock.yaml` — stale; dest has its own lockfile
- `pnpm-workspace.yaml` — source workspace config; delete
- `node_modules/` — stale symlinks; delete
- `.gitignore` — redundant with dest root `.gitignore`
- `README.md` — optional; keep or remove

### ESLint: Self-Contained `eslint-config-next`

`create-next-app` generates a flat ESLint config using `eslint-config-next` (which bundles its own plugins). This is **self-contained** — no root `eslint.config.mjs` needed, no `@nx/eslint-plugin` dependency. The `@nx/eslint/plugin` detects it and creates a lint target.

### TypeScript: No Changes Needed

Non-Nx Next.js projects have self-contained tsconfigs with `noEmit: true`, their own `lib`, `module`, `moduleResolution`, and `jsx` settings. Since `next build` handles type checking internally, no tsconfig modifications are needed. The project does NOT need to extend `tsconfig.base.json`.

**Gotcha**: The `@nx/js/typescript` plugin won't create a `typecheck` target because there's no `tsconfig.lib.json`. This is fine — use `next:build` for type checking.

### `noEmit: true` and TS Solution Setup

Non-Nx Next.js projects use `noEmit: true`, which conflicts with Nx's TS solution setup (`composite: true`). If the dest workspace uses project references and you want the Next.js app to participate:
1. Remove `noEmit: true`, add `composite: true`, `emitDeclarationOnly: true`
2. Add `extends: "../../tsconfig.base.json"`
3. Add `outDir` and `tsBuildInfoFile`

**However**, this is optional for standalone Next.js apps that don't export types consumed by other workspace projects.

### Tailwind / PostCSS

`create-next-app` with Tailwind generates `postcss.config.mjs`. This works as-is after import — no path changes needed since PostCSS resolves relative to the project root.

---

## Mixed Next.js + Vite Coexistence

When both Next.js and Vite projects exist in the same workspace.

### Plugin Coexistence

Both `@nx/next/plugin` and `@nx/vite/plugin` can coexist in `nx.json`. They detect different config files (`next.config.*` vs `vite.config.*`) so there are no conflicts. The `@nx/js/typescript` plugin handles libraries.

### ESLint Version Conflicts (Critical)

`@nx/eslint` may peer-depend on ESLint 8, but flat configs and modern plugins need ESLint 9. If lint fails with `Cannot read properties of undefined (reading 'allow')`, the wrong ESLint version is being resolved.

**Fix**: Add `pnpm.overrides` in root `package.json`:
```json
{ "pnpm": { "overrides": { "eslint": "^9.0.0" } } }
```

### Vite Standalone Project tsconfig Fixes

Vite standalone projects (imported as whole-repo) have self-contained tsconfigs without `composite: true`. The `@nx/js/typescript` plugin's typecheck target runs `tsc --build --emitDeclarationOnly` which requires `composite`.

**Fix**:
1. Add `extends: "../../tsconfig.base.json"` to the root project tsconfig
2. Add `composite: true`, `declaration: true`, `declarationMap: true`, `tsBuildInfoFile` to `tsconfig.app.json` and `tsconfig.spec.json`
3. Set `moduleResolution: "bundler"` (replace `"node"`)
4. Add source files to `tsconfig.spec.json` `include` — specs import app code, and `composite` mode requires all files to be listed

### Typecheck Target Names

- `@nx/vite/plugin` defaults `typecheckTargetName` to `"vite:typecheck"`
- `@nx/js/typescript` uses `"typecheck"`
- Next.js projects have NO standalone typecheck target — Next.js runs type checking during `next build`

No naming conflicts between frameworks.

---

## Fix Order — Nx Source (Subdirectory Import)

1. Generic fixes from SKILL.md (pnpm globs `apps/*`/`libs/*`, root deps, `.gitkeep` removal)
2. Install core deps: `pnpm add -wD react react-dom @types/react @types/react-dom @types/node @nx/react`
3. Update root `tsconfig.base.json`: `module: "esnext"`, `moduleResolution: "bundler"`, `lib: ["es2022", "dom", "dom.iterable"]`, `jsx: "react-jsx"`
4. Install ESLint deps, create root `eslint.config.mjs`, run `npx nx add @nx/eslint`
5. Install Jest deps, create `jest.preset.js`, run `npx nx add @nx/jest`
6. `nx reset && nx sync --yes && nx run-many -t typecheck,build,test,lint`

## Fix Order — Non-Nx Source (create-next-app)

1. Generic fixes from SKILL.md (pnpm globs, stale node_modules/lockfile)
2. Delete stale source root files: `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.gitignore`, `node_modules/`
3. Remove Nx-rewritten npm scripts from imported `package.json`
4. (Optional) Rename prefixed targets in `nx.json` plugin config if desired
5. (Optional) If app needs to export types for other workspace projects: fix `noEmit` → `composite` (see SKILL.md)
6. `nx reset && nx run-many -t next:build,eslint:lint` (or unprefixed names if renamed)

---

## Iteration Log

### Scenario 1: Basic Nx Next.js App Router + Shared Lib → TS preset (PASS)
- Source: CNW next preset (Next.js 16, App Router) + `@nx/react:library` shared-ui
- Dest: CNW ts preset (Nx 23)
- Import: subdirectory-at-a-time (apps, libs separately)
- Errors found & fixed:
  1. pnpm-workspace.yaml: `apps`/`libs` → `apps/*`/`libs/*`
  2. Root tsconfig: `nodenext` → `bundler`, add `dom`/`dom.iterable` to `lib`, add `jsx: react-jsx`
  3. Missing `@nx/react` (for CSS module/image type defs in lib)
  4. Missing `@types/react`, `@types/react-dom`, `@types/node`
  5. Next.js trying `yarn add @types/react` — fixed by installing at root
  6. Missing `@nx/eslint`, root `eslint.config.mjs`, ESLint plugins
  7. Missing `@nx/jest`, `jest.preset.js`, `jest-environment-jsdom`, `ts-jest`
- All targets green: typecheck, build, test, lint

### Scenario 3: Non-Nx create-next-app (App Router + Tailwind) → TS preset (PASS)
- Source: `create-next-app@latest` (Next.js 16.1.6, App Router, Tailwind v4, flat ESLint config)
- Dest: CNW ts preset (Nx 23)
- Import: whole-repo into `apps/web`
- Errors found & fixed:
  1. pnpm-workspace.yaml: `apps/web` → `apps/*`
  2. Stale files: `node_modules/`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.gitignore` — deleted
  3. Nx-rewritten npm scripts (`"build": "nx next:build"`, etc.) — removed
- No tsconfig changes needed — self-contained config with `noEmit: true`
- ESLint self-contained via `eslint-config-next` — no root config needed
- No test setup (create-next-app doesn't include tests)
- All targets green: next:build, eslint:lint

### Scenario 5: Mixed Next.js (Nx) + Vite React (standalone) → TS preset (PASS)
- Source A: CNW next preset (Next.js 16, App Router) — subdirectory import of `apps/`
- Source B: CNW react-standalone preset (Vite 7, React 19) — whole-repo import into `apps/vite-app`
- Dest: CNW ts preset (Nx 23)
- Errors found & fixed:
  1. All Scenario 1 fixes for the Next.js app
  2. Stale files from Vite source: `node_modules/`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.gitignore`, `nx.json`
  3. Removed rewritten scripts from Vite app's `package.json`
  4. ESLint 8 vs 9 conflict — `@nx/eslint` peer on ESLint 8 resolved wrong version. Fixed with `pnpm.overrides`
  5. Vite tsconfigs missing `composite: true`, `declaration: true` — needed for `tsc --build --emitDeclarationOnly`
  6. Vite `tsconfig.spec.json` `include` missing source files — specs import app code
  7. Vite tsconfig `moduleResolution: "node"` → `"bundler"`, added `extends: "../../tsconfig.base.json"`
- All targets green: typecheck, build, test, lint for both projects
