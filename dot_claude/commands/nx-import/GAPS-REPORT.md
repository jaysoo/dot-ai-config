# nx import Skill — Gaps Report

Generated 2026-03-04 after 4 rounds of validation across 8 scenarios.

## Validation Summary

| Round | Scenarios | All PASS? | Key Changes                                  |
| ----- | --------- | --------- | -------------------------------------------- |
| 1     | 8         | Yes       | Initial baseline — many gaps found           |
| 2     | 8         | Yes       | VITE.md and NEXT.md improvements             |
| 3     | 8         | Yes       | Added JEST.md, fixed jest.preset.js guidance |
| 4     | 8         | Yes       | Confirmed JEST.md coverage, minor gaps only  |

**Scenarios**: V1 (Nx Vite React), V2 (Nx Vite Vue), V3 (Non-Nx create-vite React), V4 (Non-Nx create-vite Vue), V5 (Mixed React+Vue), N1 (Nx Next.js+lib), N3 (Non-Nx create-next-app), N5 (Mixed Next.js+Vite)

---

## Outstanding Gaps (Not Yet in Skill Files)

### Critical — Would cause agent to get stuck

**1. ndjson `--plugins` two-step flow (Nx ≥22.6)**

- Surfaced in: V3, V4, N3, N5 (all whole-repo imports)
- `nx import --no-interactive` stops at `needs_input` stage for plugin selection. A second invocation with `--plugins=all` (or `--plugins=skip`) is required.
- SKILL.md says "After nx 22.6.0, nx import responds with .ndjson outputs" but doesn't spell out the two-step invocation pattern.
- **Recommended fix**: Add to Quick Start:
  ```
  For Nx ≥22.6, whole-repo imports require two steps:
  1. `nx import <source> <dest> --ref=main --source=. --no-interactive` (detects plugins, exits with `needs_input`)
  2. `nx import <source> <dest> --ref=main --source=. --no-interactive --plugins=all` (completes import)
  ```

**2. Next.js `composite: false` override when base has `composite: true`**

- Surfaced in: N5
- When dest `tsconfig.base.json` has `composite: true` (TS preset default), Next.js `next build` fails with `TS5083: Cannot read file tsconfig.base.json`. Next.js tsconfig needs explicit `composite: false`, `declaration: false`, `declarationMap: false`.
- NEXT.md says "noEmit: true — this is fine because Next.js uses next build" but doesn't mention the `composite` cascade from base.
- **Recommended fix**: Add to NEXT.md under "Next.js TypeScript Config Specifics":
  ```
  **Gotcha**: When the dest root `tsconfig.base.json` has `composite: true`, Next.js tsconfigs
  must explicitly override with `composite: false`, `declaration: false`, `declarationMap: false`.
  Without this, `next build` fails trying to process the composite project references.
  ```

**3. Import path depth mismatch**

- Surfaced in: V5, N5
- When source dir depth differs from dest (e.g., `shared-ui/` → `libs/shared-ui/`), ALL relative paths are wrong: tsconfig `extends`, jest `preset`, ESLint config imports.
- SKILL.md covers "Explicit Executor Path Fixups" but only for executor targets, not config file relative paths.
- **Recommended fix**: Add new section to SKILL.md:
  ```
  ### Import Path Depth Mismatch
  When source path depth differs from destination (e.g., `shared-ui/` imported to `libs/shared-ui/`),
  relative paths in ALL config files must be updated:
  - tsconfig `extends`: `"../tsconfig.base.json"` → `"../../tsconfig.base.json"`
  - jest `preset`: `'../jest.preset.js'` → `'../../jest.preset.js'`
  - ESLint imports: `'../eslint.config.mjs'` → `'../../eslint.config.mjs'`
  Watch for the `nx import` warning about source/dest directory mismatch.
  ```

### Medium — Agent can work around but wastes time

**4. `@vue/tsconfig` inherited `noEmit: true`**

- Surfaced in: V4 (both R3 and R4)
- `tsconfig.app.json` extends `@vue/tsconfig/tsconfig.dom.json` → `@vue/tsconfig/tsconfig.json` which sets `noEmit: true`. Simply removing `noEmit` from the project tsconfig doesn't work — must set `noEmit: false` explicitly.
- VITE.md says "fix both tsconfig.app.json and tsconfig.node.json" but doesn't mention the `@vue/tsconfig` extends chain.
- **Recommended fix**: Add to VITE.md "noEmit Fix: Vite-Specific Notes":
  ```
  - `@vue/tsconfig` extends chain: `tsconfig.dom.json` → `tsconfig.json` inherits `noEmit: true`.
    You cannot just remove the field — set `"noEmit": false` explicitly to override the inherited value.
  ```

**5. `allowImportingTsExtensions` incompatible with `composite`**

- Surfaced in: V4
- `@vue/tsconfig` sets `allowImportingTsExtensions: true`, which requires `noEmit` or `emitDeclarationOnly`. When switching to `composite: true`, this becomes invalid unless `emitDeclarationOnly` is also set.
- **Recommended fix**: Add to VITE.md "noEmit Fix: Vite-Specific Notes":
  ```
  - `allowImportingTsExtensions: true` (from `@vue/tsconfig`) is only valid with `noEmit` or
    `emitDeclarationOnly`. When adding `composite: true`, also set `emitDeclarationOnly: true`
    or explicitly set `allowImportingTsExtensions: false`.
  ```

**6. `package-lock.json` / `yarn.lock` not in stale files list**

- Surfaced in: N3
- SKILL.md "Redundant Root Files" lists `pnpm-lock.yaml` but not `package-lock.json` or `yarn.lock`. Non-pnpm sources produce these.
- **Recommended fix**: Expand the list:
  ```
  - `pnpm-lock.yaml` / `package-lock.json` / `yarn.lock` — stale lockfile from source; dest has its own
  ```

**7. babel-jest is default for `@nx/react:library` with Jest**

- Surfaced in: N5
- JEST.md "React with Babel" section exists but the fix order doesn't flag it. `@nx/react:library --unitTestRunner=jest` generates `jest.config.cts` using `babel-jest` (via `@nx/react/babel`), not `ts-jest`.
- **Recommended fix**: Update JEST.md fix order step 3:
  ```
  3. Install deps — check `jest.config.*` transform first:
     - If `babel-jest` (common for `@nx/react:library`): `pnpm add -wD babel-jest @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript`
     - If `ts-jest`: `pnpm add -wD ts-jest`
     - Always: `pnpm add -wD jest jest-environment-jsdom @types/jest`
  ```

### Minor — Cosmetic or edge cases

**8. `nx reset` needed after plugin changes**

- Surfaced in: V1
- After adding plugins to `nx.json`, Nx daemon caches stale project graph. New targets don't appear until `nx reset`.
- SKILL.md mentions `nx reset` in Plugin Detection section but could be more prominent.

**9. `@nx/js/typescript` removal not in non-Nx fix order**

- Surfaced in: V4, V5
- VITE.md says "Keep both plugins only if workspace has non-Vite pure TS libraries" but the Non-Nx Source fix order doesn't include this step.
- **Recommended fix**: Add to VITE.md Non-Nx Source fix order: "Remove `@nx/js/typescript` from nx.json if all projects use Vite."

**10. `nx sync` not mentioned as required post-fix step**

- Surfaced in: V3, N1, N5
- After modifying tsconfigs and nx.json plugins, `nx sync` must run to update TypeScript project references. Standard Nx workflow, but agents skip it.
- **Recommended fix**: Add to SKILL.md fix orders: "Run `nx sync --yes` after all tsconfig and plugin changes."

**11. ESLint version mismatch from `@nx/eslint:init`**

- Surfaced in: N3
- `@nx/eslint:init` adds `eslint ~8.57.0` to root devDeps, but `eslint-config-next` 16.x requires ESLint 9. Functionally OK (pnpm resolves correctly per project) but misleading.
- Already partially covered by SKILL.md "ESLint Version Pinning" section.

**12. Generator output must be committed before `nx import`**

- Surfaced in: N5
- `nx import` reads from git history, not working tree. If you run a generator in the source repo, you must `git add -A && git commit` before importing.
- **Recommended fix**: Add to SKILL.md Common Issues:
  ```
  ### Source Directory Not in Git History
  `nx import` reads from git history, not the working tree. If you ran a generator in the source
  repo, commit the changes first: `git add -A && git commit -m "add generated files"`.
  ```

**13. `vitest.workspace.ts` not mentioned**

- Surfaced in: V2
- Some Nx Vite workspaces have a root `vitest.workspace.ts`. Subdirectory import doesn't bring it.
- Low impact — Vitest works without it in most cases.

**14. `$schema` path in `project.json` for whole-repo imports**

- Surfaced in: N5
- `$schema` points to `node_modules/nx/schemas/project-schema.json` (root-relative) but after import into a subdirectory, should be `../../node_modules/nx/schemas/project-schema.json`.
- Cosmetic — doesn't affect builds.

---

## Resolved Gaps (Fixed in Earlier Rounds)

These gaps were found in rounds 1-2 and fixed in the skill files:

| Gap                                               | Found   | Fixed In | File              |
| ------------------------------------------------- | ------- | -------- | ----------------- |
| `jest.preset.js` not created by `nx add @nx/jest` | R2 (N5) | R3       | SKILL.md, JEST.md |
| Missing `@nx/react` typings section               | R1      | R2       | SKILL.md          |
| Frontend tsconfig base settings incomplete        | R1      | R2       | SKILL.md          |
| ESLint v9 pinning guidance                        | R1      | R2       | SKILL.md          |
| Vue ESLint installation order                     | R1      | R2       | VITE.md           |
| Mixed React+Vue jsx per-project                   | R1      | R2       | VITE.md           |
| JEST.md missing entirely                          | R2      | R3       | JEST.md (created) |
| Jest testing deps by framework                    | R2      | R3       | JEST.md           |
| tsconfig.spec.json guidance                       | R2      | R3       | JEST.md           |

---

## Prioritized Fix Plan

If updating the skill files, address in this order:

1. **#1 ndjson two-step** — blocks every whole-repo import on Nx ≥22.6
2. **#2 Next.js composite override** — blocks Next.js builds in mixed workspaces
3. **#3 Import path depth mismatch** — blocks multi-import scenarios with re-nesting
4. **#4 + #5 Vue tsconfig chain** — blocks Vue non-Nx imports
5. **#6 Lockfile list** — trivial fix, high frequency
6. **#7 babel-jest fix order** — clarification, prevents wasted debug time
7. **#10 nx sync step** — one-liner addition to fix orders
8. **#12 Commit before import** — one-liner addition
9. Rest are minor/cosmetic
