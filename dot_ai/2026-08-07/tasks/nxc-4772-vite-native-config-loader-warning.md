# NXC-4772 - Vite `configLoader: 'native'` warnings from Nx-generated vitest configs

- Linear: https://linear.app/nxdev/issue/NXC-4772/is-this-a-new-warning
- Polygraph session: https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/tidy-otter-932779b6
- Worktree: `/Users/jack/projects/nx-worktrees/NXC-4772` (branch `NXC-4772`)

## Question asked

Jason hit two warnings during `Creating project graph nodes with @nx/vitest`. Is it new?

```
(!) Your Vite config uses features that are unsupported by `configLoader: 'native'`, ...
  - ESM syntax in a file loaded as CommonJS (vitest.config.ts:1:1).
  - `__dirname` (packages/utils/vitest.config.mts:4:9). Use `import.meta.dirname` instead
```

## Answer

Yes - new in Vite 8. Vite 8 added the `configLoader: 'native'` pre-check. Both warnings come from
config files Nx itself generates, so every workspace on Vite 8 with `@nx/vitest` sees them.

## Repro

Fresh workspace, published nx 23.1.1, npm, vite 8.2.1:

```
npx create-nx-workspace@23.1.1 repro --preset=ts --nxCloud=skip --no-interactive --packageManager=npm
cd repro
npx nx g @nx/js:lib packages/utils --unitTestRunner=vitest --no-interactive
npx nx reset && NX_DAEMON=false npx nx show projects
```

Note: the daemon swallows the warning. `NX_DAEMON=false` (or a cold graph) is required to see it.

Warning 1 needed a root `vitest.config.ts` aggregator, which master's generator writes (23.1.1 still
wrote `vitest.workspace.ts`). Dropping the aggregator in by hand reproduced it exactly.

Both warnings disappear after the fixes below; `nx test` still passes.

## Root causes

1. `packages/vitest/src/utils/generator-utils.ts` emits `root: __dirname` and
   `path.join(__dirname, 'tsconfig.lib.json')`. `@nx/vite` was already fixed for this in #33518
   (NXC-3446); `@nx/vitest` was forked before that and kept `__dirname`.
2. `packages/vitest/src/generators/configuration/configuration.ts` writes the root aggregator as
   `vitest.config.ts`. ESM source in a `.ts` file, in a workspace whose root package.json has no
   `"type": "module"`, is loaded as CommonJS.
3. `packages/nuxt/src/generators/application/lib/add-vitest.ts` forced `useEsmExtension: false`
   for all nuxt apps, so the config landed in `.ts` carrying `import.meta.dirname` - the one
   generated combination that is an outright syntax error under a native loader.

## Changes

- `@nx/vitest` generator: `__dirname` -> `import.meta.dirname` (3 sites).
- Root aggregator: `vitest.config.ts` -> `vitest.config.mts`. `findRootConfig` already probed
  `.mts`, so re-running the generator stays idempotent.
- nuxt: gate the `.ts` fallback on `options.linter !== 'eslint' || useFlatConfig(tree)`. Verified
  `@nuxt/eslint-config@1.17.0` flat config does match `**/*.mts`
  (`package/dist/chunks/typescript.mjs:40`); only the legacy `~0.5.6` eslintrc path does not.
- New migration `@nx/vitest` `update-23-2-0-use-import-meta-dirname` (version `23.2.0-beta.6`):
  rewrites `__dirname` in `vite.config.{mts,mjs}` / `vitest.config.{mts,mjs}`. Skips `.ts`/`.js`
  (can still be CJS, where `import.meta` is a syntax error) and skips configs that declare their
  own `__dirname` via the `fileURLToPath(import.meta.url)` idiom.

## Deliberately not done

- No migration renames an existing root `vitest.config.ts` to `.mts`. Scripts and CI can reference
  the path, and Vite's own warning already tells users what to do. New workspaces get `.mts`.
- The released `@nx/vite` `update-23-0-0` migrations (`generate-local-vitest-configs`,
  `inline-vitest-workspace`) still emit `.ts` configs. Left alone - changing an already-shipped
  migration's output is worse than the warning it avoids.
- `vitest.workspace.ts` (the vitest 3 branch) is still `.ts`. Vitest 3 pairs with Vite <= 7, which
  has no such warning.
