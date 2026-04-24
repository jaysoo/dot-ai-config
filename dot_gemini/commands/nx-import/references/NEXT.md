## Next.js

Next.js-specific guidance for `nx import`. For generic import issues (pnpm globs, root deps, project references, name collisions, ESLint, frontend tsconfig base settings, `@nx/react` typings, Jest preset, target name prefixing, non-Nx source handling), see `SKILL.md`.

---

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

### Root Dependencies for Next.js

Beyond the generic root deps issue (see SKILL.md), Next.js projects typically need:

**Core**: `react`, `react-dom`, `@types/react`, `@types/react-dom`, `@types/node`, `@nx/react` (see SKILL.md for `@nx/react` typings)
**Nx plugins**: `@nx/next` (auto-installed by import), `@nx/eslint`, `@nx/jest`
**Testing**: see SKILL.md "Jest Preset Missing" section
**ESLint**: `@next/eslint-plugin-next` (in addition to generic ESLint deps from SKILL.md)

### Next.js Auto-Installing Dependencies via Wrong Package Manager

Next.js detects missing `@types/react` during `next build` and tries to install it using `yarn add` regardless of the actual package manager. In a pnpm workspace, this fails with a "nearest package directory isn't part of the project" error.

**Root cause**: `@types/react` is missing from root devDependencies.
**Fix**: Install deps at the root before building: `pnpm add -wD @types/react @types/react-dom`

### Next.js TypeScript Config Specifics

Next.js app tsconfigs have unique patterns compared to Vite:

- **`noEmit: true`** with `emitDeclarationOnly: false` — Next.js handles emit, TS just checks types. This conflicts with `composite: true` from the TS solution setup.
- **`"types": ["jest", "node"]`** — includes test types in the main tsconfig (no separate `tsconfig.app.json`)
- **`"plugins": [{ "name": "next" }]`** — for IDE integration
- **`include`** references `.next/types/**/*.ts` for Next.js auto-generated types
- **`"jsx": "preserve"`** — Next.js uses its own JSX transform, not React's

**Gotcha**: The Next.js tsconfig sets `"noEmit": true` which disables `composite` mode. This is fine because Next.js projects use `next build` for building, not `tsc`. The `@nx/js/typescript` plugin's `typecheck` target is not needed for Next.js apps.

### `next.config.js` Lint Warning

Imported Next.js configs may have `// eslint-disable-next-line @typescript-eslint/no-var-requires` but the project ESLint config enables different rule sets. This produces `Unused eslint-disable directive` warnings. Harmless — remove the comment or ignore.

---

## Non-Nx Source (create-next-app)

### Whole-Repo Import Recommended

For single-project `create-next-app` repos, use whole-repo import into a subdirectory:

```bash
nx import /path/to/source apps/web --ref=main --source=. --no-interactive
```

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

1. Generic fixes from SKILL.md (pnpm globs, root deps, `.gitkeep` removal, frontend tsconfig base settings, `@nx/react` typings)
2. Install Next.js-specific deps: `pnpm add -wD @next/eslint-plugin-next`
3. ESLint setup (see SKILL.md: "Root ESLint Config Missing")
4. Jest setup (see SKILL.md: "Jest Preset Missing")
5. `nx reset && nx sync --yes && nx run-many -t typecheck,build,test,lint`

## Fix Order — Non-Nx Source (create-next-app)

1. Generic fixes from SKILL.md (pnpm globs, stale files cleanup, script rewriting, target name prefixing)
2. (Optional) If app needs to export types for other workspace projects: fix `noEmit` → `composite` (see SKILL.md)
3. `nx reset && nx run-many -t next:build,eslint:lint` (or unprefixed names if renamed)
