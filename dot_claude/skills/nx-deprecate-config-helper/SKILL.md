---
name: nx-deprecate-config-helper
description: Warn-only deprecation of a first-party Nx bundler config helper (composePlugins/withNx/withWeb/withReact and friends) for removal in the next major. Use when asked to "deprecate <helper>", for a "config helpers deprecated" milestone NXC ticket, or any of the @nx/{vite,webpack,rspack,next,expo,rollup}/react config-composition helpers. Triggers on "deprecate config helper", "deprecate withNx/withWeb/withReact/composePlugins", "warn-only deprecate <helper>".
---

# Nx config-helper deprecation

Warn-only deprecation of a first-party Nx config-composition helper. The helper keeps working in
the current major (logs a deprecation warning); removal is the next major (v24 at time of writing).
The migration target is almost always the real plugin class (`NxApp*Plugin`/`NxReact*Plugin`) in a
standard bundler config under the inferred plugin, reached via `nx g @nx/<bundler>:convert-to-inferred`.

This is a recurring milestone pattern. Prior instances to copy from:

- NXC-4316 `@nx/vite` `nxViteTsPaths` + `nxCopyAssetsPlugin` (PR #35664, MERGED) — the canonical template
- NXC-4324 `@nx/webpack` + `@nx/rspack` + `@nx/react/webpack` compose helpers (PR #35867)
- NXC-4325 `@nx/next` withNx + composePlugins (PR #35861)
- NXC-4326 `@nx/expo` withNxMetro

## Scope decisions to confirm with Jack FIRST (AskUserQuestion)

These changed the shape of the work each time, so ask before building:

1. **Warn + docs only, or also change generators?** Default to warn + docs + JSDoc only. Touching
   what generators scaffold expands the diff and snapshot surface.
2. **One consolidated warn-once per package, or per-symbol?** Default to one consolidated
   warn-once-per-package message (helpers are used together; per-symbol spams).
3. **Out-of-scope siblings.** Confirm which related helpers stay untouched (e.g. Next/Rollup/Angular/
   module-federation are usually tracked separately, and the `NxApp*Plugin` classes are the
   recommended target, NOT deprecated).

## Steps

### 1. Locate helper defs + public entry points

Find each helper's definition file and the public entry it is re-exported from (`index.ts`
`export *`, package.json `exports` subpaths like `@nx/react/webpack`). Note the exact import path
users type.

### 2. Add the warn-once + suppression util

In each affected package's `src/utils/deprecation.ts` (create for packages that lack one), add:

```ts
export const <PKG>_COMPOSE_HELPERS_DEPRECATION_MESSAGE = '...removed in Nx v24... use NxApp*Plugin ... nx g @nx/<bundler>:convert-to-inferred ... https://nx.dev/docs/guides/tasks--caching/convert-to-inferred ...';

let warned = false;
let suppressDepth = 0;

// Nx-internal entry points compose these helpers themselves; they wrap their synchronous
// composition in this so the warning fires only for user-authored configs.
export function suppress<Pkg>ComposeHelperWarnings<T>(fn: () => T): T {
  suppressDepth++;
  try { return fn(); } finally { suppressDepth--; }
}

// Warn once per process (HMR reloads / repeated config eval don't repeat it).
export function warn<Pkg>ComposeHelpersDeprecation(): void {
  if (suppressDepth > 0 || warned) return;
  warned = true;
  logger.warn(<PKG>_COMPOSE_HELPERS_DEPRECATION_MESSAGE);
}
```

Match the existing per-package `deprecation.ts` style (each package keeps its own copy — do NOT try
to DRY this into `@nx/devkit/internal`; that's a heavy generator barrel and the wrong layer for a
runtime build-path helper. The codebase already duplicates `warnOnce` across the three
`module-federation-deprecation.ts` files — that's house style).

### 3. Add `@deprecated` JSDoc + warn call to each helper body

Put a short `@deprecated` tag (name the plugin class + `convert-to-inferred`) and call the warn fn as
the FIRST statement of each public helper. **Warn at construction** (the outer `withNx(...)` call),
not inside the returned config function — construction is synchronous and happens at config
module-load, which is what makes the suppression counter safe even when the helper returns an async
`combined`.

### 4. Find internal callers and suppress them (the step where the real work hides)

A naive warn false-positives for users who never wrote a compose config, because Nx composes these
helpers internally. Grep for construct sites across ALL packages:

```bash
grep -rn 'composePluginsSync\|composePlugins(\|withNx(\|withWeb(\|withReact(' packages --include='*.ts' | grep -v '.spec.ts'
```

Then **rule out the non-sites** (these matched in NXC-4324 but do NOT compose at runtime):

- JSDoc examples (e.g. the `withNx()` inside `use-legacy-nx-plugin.ts` doc comment)
- Generator templates (emit the helper as a string into generated configs)
- Migration codemods (`tsquery` parse/rewrite the helper name)
- require-but-never-call (e.g. `react/plugins/component-testing/index.ts` requires the helpers but
  never invokes them)

Wrap each GENUINE internal construct+run region (they are synchronous) in
`suppress<Pkg>ComposeHelperWarnings(() => ...)`. Nest multiple suppressors when a site composes
helpers from more than one package (e.g. storybook/next-CT compose `@nx/webpack` `withNx` +
`@nx/react` `withReact` → wrap in both). For NXC-4324 the real sites were:

- rspack executor `lib/config.ts` (`getRspackConfigs` builds a default config even for inferred users)
- `react/plugins/storybook/index.ts`
- `next/plugins/component-testing.ts`

**Asymmetry to expect**: an executor that only ever consumes a user-authored config (webpack checks
`isNxWebpackComposablePlugin`) does NOT need suppression — its warning legitimately comes from the
user's file. An executor that builds a default config internally (rspack) does.

Internal callers import the suppress fn via internal paths (`@nx/<pkg>/src/utils/deprecation`),
allowed by the package `exports` `./src/utils/*` entry.

### 5. Docs caution asides

Add `{% aside type="caution" title="..." %}` notices to the helper's own guide pages only. Lead with
the recommended alternative + `convert-to-inferred`, say it still works in v23 but logs a warning.
Scope tightly: do NOT touch sibling-framework examples on a shared page (e.g. skip the `@nx/next`
snippet on a react page). Skip pages that don't document the helper or already cover migrating away.
Then run the `nx-docs-style-check` skill (mandatory for any `astro-docs/**/*.mdoc` edit).

### 6. Tests (warn-only, no migration)

Add `deprecation.spec.ts` per package using `jest.isolateModules` so the warn-once flag + logger spy
resolve to the same fresh instances:

```ts
function setup() {
  let warn, mod;
  jest.isolateModules(() => {
    const { logger } = require('@nx/devkit');
    warn = jest.spyOn(logger, 'warn').mockImplementation(() => {});
    mod = require('./deprecation');
  });
  return { warn, mod };
}
// assert: warn-once (call twice -> 1 log), suppress(fn) logs nothing, warn restored after suppress.
```

No `migrations.json` entry — warn-only deprecations don't need a codemod (matches the vite precedent).

## Verify

- `npx jest --config packages/<pkg>/jest.config.cts --rootDir packages/<pkg> src/utils/deprecation.spec.ts`
  (running `nx` may be blocked by the `@nx/gradle` sandbox graph break — fall back to direct jest/tsc/vale).
- Manually: a user config using the helpers warns exactly once; a Storybook / internal-executor build
  using the plugin classes prints NO compose-helper warning (suppression works).
- `nx affected -t build,lint,test` once outside the sandbox before mark-ready.

## Commit

Per the Nx commitlint gotchas: all-lowercase subject (no API symbol names), and for the `!`
breaking-change subject write the message to a temp file + `git commit -F <file>` (heredoc injects a
stray backslash before `!`). Example: `feat(webpack)!: deprecate webpack/rspack config compose helpers`.
