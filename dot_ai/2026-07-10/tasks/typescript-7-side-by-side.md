# TypeScript 7 side-by-side in the nx repo

Branch: `ts7`. Goal: install released TypeScript 7 and make `typecheck` use it.

Refs:

- https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0
- https://github.com/nrwl/nx/discussions/36274
- https://github.com/jaysoo/nx-ts7#dependency-checks-report-tslib-as-unused

## Starting state

Already on master (not branch work):

- root devDep `@typescript/native-preview@7.0.0-dev.20260608.1` (tsgo binary)
- both `@nx/js/typescript` registrations in nx.json set `"compiler": "tsgo"`

## Constraint

TS7 ships no JS API. `@nx/js/typescript` imports the compiler API to parse tsconfigs
(`packages/js/src/plugins/typescript/plugin.ts`, `resolveTypescriptPath`). So the
`typescript` module must stay 6.x, and TS7 has to arrive under a different package name.

Upstream layout:

- `typescript@7` -> bin `tsc`, no API
- `@typescript/typescript6` -> bin `tsc6`, `typescript.d.ts` is `import ts = require("@typescript/old"); export = ts;`

## Changes

- `package.json`: drop `@typescript/native-preview`; add `"@typescript/native": "npm:typescript@^7.0.2"`;
  `typescript` -> `npm:@typescript/typescript6@^6.0.2`
- `nx.json`: remove both `"compiler": "tsgo"` lines (plugin default is `tsc`, now TS7)
- `nx.json`: new `@nx/js/typescript` registration pinning `packages/eslint` and
  `packages/angular-rspack-compiler` to `"compiler": "tsc6"`, and excluding them from the TS7 one
- alias `typescript` -> shim in `packages/dotnet`, `packages/maven`, `nx-dev/nx-dev`,
  `tools/documentation/create-embeddings`, `packages/expo`
- `packages/workspace/src/utilities/ts-config.ts`: annotate `readTsConfig(): ParsedCommandLine`

## Why the per-project aliasing

`tsc` is resolved off PATH, and nx's run-commands prepends the project's own
`node_modules/.bin`. Any project that pulls `typescript` directly (dep, devDep, or an
auto-installed peer, as with `expo@56`) gets a real TS6 `tsc` that silently shadows the
workspace TS7 one. Verified: `packages/dotnet` typechecked at 6.0.3 while
`graph/ui-code-block` typechecked at 7.0.2, with no warning.

Aliasing those projects to the shim leaves them a `tsc6` bin only, so bare `tsc` reaches
the root TS7.

`packages/eslint` and `packages/angular-rspack-compiler` publish `typescript` as a runtime
`dependency`, so aliasing them would change published metadata. They stay on TS6 via an
explicit `compiler: "tsc6"` registration instead - declared rather than implicit.

pnpm `overrides` cannot express this: an alias value keeps the original resolved version
(`typescript@npm:@typescript/typescript6@6.0.3`, which does not exist) and errors.

Stale `node_modules/.bin/tsc` symlinks are not pruned by pnpm and shadow PATH. 24 leftovers
had to be deleted by hand; a fresh clone/CI is unaffected.

## Verification

- `tsbuildinfo` `version` field records the emitting compiler. `graph/ui-code-block` -> `7.0.2`.
- Sweep every project in the graph for a local `.bin/tsc` and print its version.

## @nx/js fixes (both bugs from the nx-ts7 README, reproduced here)

- `TscPluginOptions.compiler` widened to `'tsc' | 'tsc6' | 'tsgo'`. It already worked at
  runtime (the value is interpolated straight into the command) but was not in the union.
- `dependency-checks` missed `tsc6`: `/\b(tsc|tsgo)\b/` cannot match `tsc6` because `c` and `6`
  are both word chars, so `importHelpers` went undetected and `tslib` was reported unused.
  Now `/\b(tsc6?|tsgo)\b/`; still rejects `tscx`. Spec rows added.
- The eslint rule runs from the installed `@nx/eslint-plugin`, not from source, so the two
  `tsc6` projects also need `runtimeHelpers: ['tslib']` until a release carries the fix.

`@nx/vite`'s compiler union (`packages/vite/src/plugins/plugin.ts:48`) is still
`'tsc' | 'tsgo' | 'vue-tsc'`. Left alone - no project in this repo routes vite typecheck
through tsc6.

## Results

- `nx run-many -t typecheck` green for 51 projects on TS7.
- `e2e-angular` / `e2e-storybook` fail, but fail identically on untouched master compiled
  with TS6 (12x TS2339 on `TargetDefaultValue`). Pre-existing, not TS7. Not fixed here.
- tsbuildinfo audit: 78 projects emitted by 7.0.2, and only the tsc6-pinned ones by 6.0.3.
