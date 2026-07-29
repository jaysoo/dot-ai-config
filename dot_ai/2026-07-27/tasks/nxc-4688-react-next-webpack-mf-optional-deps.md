# NXC-4688: Make webpack/module-federation deps optional for @nx/react and @nx/next

- Linear: https://linear.app/nxdev/issue/NXC-4688/check-react-plugin-deps-for-webpackmodule-federation
- Draft PR: https://github.com/nrwl/nx/pull/36492 (commit `390ab88c28`)
- Polygraph session: https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/react-mf-cleanup-04580e9b
- Branch: NXC-4688
- Worktree: /Users/jack/projects/nx-worktrees/NXC-4688

## Outcome (2026-07-28)

Shipped as a draft PR. Deviations from the plan below:

- `webpack-merge` kept as a direct `@nx/next` dependency. Only `plugins/with-less.ts`
  uses it and its dependency tail is three tiny packages, so making a public plugin
  entry point lazy was not worth the churn.
- `@svgr/webpack` became an optional peer rather than a plain removal, because the Nx 22
  `add-svgr-to-webpack-config` / `add-svgr-to-next-config` migrations write
  `require.resolve('@svgr/webpack')` into user configs that resolve it transitively today.
  Both new migrations backfill it.
- `assertPackageIsInstalled` was initially copied into both `@nx/react` and `@nx/next`.
  Jack asked what was newly invented vs already on master, which surfaced the third copy.
  Now exported from `@nx/react/internal` and imported by `@nx/next`.
- Local `e2e-react` module federation e2e could not validate the change:
  `ensureTypescript()` returns undefined inside the e2e temp workspace, so generation
  fails before reaching changed code. Reproduced on stashed-master baselines for both
  `core-webpack-basic-host-remote-generation` and `independent-deployability.webpack`.
  CI has to cover the e2e path.

## Goal

Stop `@nx/react` / `@nx/next` from pulling the webpack + Module Federation toolchain into
workspaces that never use it. Follow the pattern Leo shipped for `@nx/angular` in #36310
(`cb376e5d83`, NXC-4613).

## Reference pattern (#36310)

1. Move packages from `dependencies` -> optional `peerDependencies` (+ keep as `devDependencies`
   for types in this repo).
2. Add an `assertPackageIsInstalled(pkg, requiredBy)` guard; rethrow non-`MODULE_NOT_FOUND`.
3. Executors: assert + `await import(...)` instead of top-level import.
4. Generators: `ensurePackage` / add to `package.json` on demand.
5. Migration backfills deps for existing workspaces by scanning targets, `targetDefaults`
   (object + array forms, target-name and executor keys), `nxJson.plugins`, and
   `module-federation.config.{ts,js}`.

## Audit

### @nx/react

| Dep | Real usage | Action |
| --- | --- | --- |
| `@nx/module-federation` | 3 MF executors, deprecated `@nx/react/module-federation` entry, `remote` generator `normalizeProjectName` | optional peer |
| `express` | only `module-federation-static-server` (already lazy `require`) | optional peer |
| `http-proxy-middleware` | only `module-federation-static-server` (already lazy `require`) | optional peer |
| `@svgr/webpack` | only `update-22-0-0/add-svgr-to-webpack-config.ts` | drop from deps |
| `@nx/rollup` | every call site already `ensurePackage` | drop from deps |

`@nx/webpack` / `@nx/rspack` are already not deps. Top-level `index.ts` -> `plugins/with-react`
only `import type`s from `@nx/webpack` and lazily `require`s `withWeb`, so the top-level import
stays safe.

### @nx/next

| Dep | Real usage | Action |
| --- | --- | --- |
| `@nx/webpack` | `plugins/component-testing.ts` value import, `plugins/with-nx.ts` type-only, CT generator already `ensurePackage` | optional peer |
| `webpack-merge` | only `plugins/with-less.ts` | optional peer |
| `@svgr/webpack` | only `update-22-0-0/add-svgr-to-next-config.ts` | drop from deps |
| `copy-webpack-plugin` | `src/utils/create-copy-plugin.ts` <- `src/utils/config.ts`, main next build path | keep |

No `@nx/module-federation` dep. Top-level `index.ts` -> `plugins/with-nx` is type-only, safe.

### @nx/react-native

`@nx/webpack` is a dep but every site is `ensurePackage` + `import type` -> drop from deps.

## Plan

1. `@nx/react` package.json: optional peers + drop `@svgr/webpack`, `@nx/rollup`.
2. `@nx/react` assert util + lazy imports in the 3 MF executors.
3. `@nx/react` `module-federation.ts` entry + `remote/lib/setup-tspath-for-remote.ts`.
4. `@nx/react` host/remote generators install `express` + `http-proxy-middleware` when the
   static-server executor is generated.
5. `@nx/react` migration `add-optional-module-federation-packages`.
6. `@nx/next` package.json + lazy `@nx/webpack` in `plugins/component-testing.ts`, lazy
   `webpack-merge` in `plugins/with-less.ts`.
7. `@nx/next` migration `add-optional-webpack-packages`.
8. `@nx/react-native` package.json.
9. `@svgr/webpack` migrations fall back to the bare specifier when unresolvable.
10. `pnpm install`, `nx sync`, run affected build/test/lint.

Migration version: latest tag is `23.2.0-beta.1` -> use `23.2.0-beta.2`.
