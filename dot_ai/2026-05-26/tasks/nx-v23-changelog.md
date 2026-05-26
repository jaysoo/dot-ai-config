# Nx v23 beta: Champion's changelog

> Status as of `23.0.0-beta.18` (built off `22.7.0-rc.2`). Updated whenever a new beta drops.

Audience: Nx Champions and partners who help test pre-releases, advise clients on Nx, and surface regressions before GA. Two priority sections: [Breaking changes](#breaking-changes) for what will bite client workspaces, and [Migrations](#migrations) for what automation runs against them.

## Try it and give us feedback

```bash
# Fresh workspace on the beta
npx create-nx-workspace@next

# Existing workspace
nx migrate 23.0.0-beta.18
nx migrate --run-migrations
```

Where to file findings:

- Bugs and regressions: file at https://github.com/nrwl/nx/issues with the `v23` label.
- Migration ran but produced bad output: comment on the migration's PR, or open an issue prefixed `migration:`.
- Champion-specific feedback (consulting impact, breaking-change pain, missing migrations): post in the Champions Discord channel or DM the team. Champion feedback weighs heavily before the flip to RC.

## Reserved: `nx migrate` improvements

> _This section will be filled in when Leo's PR lands. Placeholder so Champions know the shape._

v23 ships major changes to how `nx migrate` itself works. Expect:

- Agentic migrations. Migrations that need judgement (beyond AST rewrites) hand off to an AI agent with workspace context, instead of asking the user to read a markdown file.
- Separate core and plugin migration paths. `nx migrate --mode=first-party|third-party|all` stages Nx-core upgrades independently from plugin (Angular, React, Vite, etc.) upgrades.
- Multi-major mode. `nx migrate --multi-major-mode=direct|gradual` controls whether you cross multiple Nx majors in one step or one at a time, with the right migrations sequenced.
- Downgrade safeguards. `nx migrate` refuses to step to an older version unless explicitly forced.

Champion ask once this lands: test on a real client workspace and report whether the `--mode` split lets you safely upgrade Nx-core without forcing a plugin bump at the same time. That is the headline use case.

## Highlights

Everything below ships as default unless tagged otherwise. Tags appear only on items that aren't fully stable: **beta** ships as default but iterates, **alpha** is opt-in with a moving contract, **experimental** is flagged and may break.

### Core (`nx`)

- Native Node.js TypeScript stripping is the default for `.ts` configs and plugin loads on Node 22.6+. `@swc-node/register` and `@swc/core` are no longer installed by `@nx/js:init`. Opt out with `NX_PREFER_NODE_STRIP_TYPES=false`. Smaller install, no swc JIT warmup on the hot path.
- Shell tab-completion for bash, zsh, fish, and powershell. `nx completion <shell>` prints the script.
- `targetDefaults` accepts a filtered array shape. Each entry can match on `target`, `executor`, `plugin`, and `projects`. Legacy record form is auto-migrated. The new `...` spread token merges defaults across entries.
- `nx migrate` gains `--mode` and `--multi-major-mode` flags (see reserved section above for full context).
- `nx migrate` entries can declare a `prompt` field for human-driven steps. Five plugins ship prompt-only migrations already: `@nx/expo`, `@nx/next`, `@nx/nuxt`, `@nx/vitest`, `@nx/storybook`.
- `nx watch --includeDependentProjects` is renamed to `--includeDependencies`. The old flag warns and continues to work through v23.
- Native graceful process-tree shutdown replaces `tree-kill`. Continuous tasks (`nx serve` plus dependents) shut down leaf-first. Configurable via `NX_PROCESS_KILL_GRACE_PERIOD` (default 5000ms).
- `axios` 1.16.0, `minimatch` 10.2.5, Rust toolchain 1.95.0, `ratatui` 0.30 (TUI), `@phenomnomnominal/tsquery` ~6.2.0.
- **beta**. Native filesystem watcher rewrite and daemon hardening. Reach for `NX_DAEMON=false` if you see flake, and file an issue.

### Build tools

- Vite 8 is the default in fresh workspaces. Rollup-to-Rolldown rename handled by [`rename-rollup-options-to-rolldown-options`](https://canary.nx.dev/docs/technologies/build-tools/vite/migrations#rename-rollup-options-to-rolldown-options). The AI-instructions migration writes a `MIGRATE_VITE_8.md` for the bits automation can't handle.
- All vitest support is removed from `@nx/vite`. Use `@nx/vitest`. The migration installs it and rewrites executor refs.
- Rollup `useLegacyTypescriptPlugin` is removed and `rollup-plugin-typescript2` is gone. `withNx({ buildLibsFromSource })` defaults flip to `true`.
- Rspack `withReact({ svgr })` is removed. A new `withSvgr` composable plus auto-migration replace it.
- `@rspack/core` and `@rsbuild/core` are peer deps now (were regular deps). Workspaces relying on transitive installs must declare them explicitly.
- Tailwind v3 to v4 across repo and templates. All `setup-tailwind` generators, the `--style=tailwind` flag, and the `--addTailwind` flag are removed. Set Tailwind up manually or via AI. No automated codemod.

### Frameworks

- `@nx/angular/module-federation` entry point is removed. Use `@nx/module-federation/angular`. The migration handles imports and adds the new dep.
- `@nx/angular:move` generator is removed. Use `@nx/workspace:move`. No migration. Update CI and scripts manually.
- `@nx/angular:ngrx` generator is removed. It splits into `ngrx-root-store` and `ngrx-feature-store`. The migration splits the `nx.json` defaults.
- Angular generator floor `>= 19` is enforced. Workspaces below 19 must upgrade Angular first.
- Angular migrations older than `update-20-*` are removed from `migrations.json`. Workspaces on Angular `< 18` need to step through Angular's own upgrade path before adopting Nx 23.
- React and Vue style options reduce to `css`, `scss`, or `none`. `less`, `tailwind`, `styled-jsx`, `styled-components`, and `@emotion/styled` are removed. LESS still compiles with a deprecation warning.
- The `--js` flag is removed from `:component` generators. Encode the extension in the `path` argument.
- Many executors are deprecated with v24 removal scheduled: `@nx/jest:jest`, `@nx/cypress:cypress`, `@nx/playwright:playwright`, `@nx/detox:{build,test}`, React, React Native, and Expo build, serve, run, and so on, `@nx/webpack:{webpack,dev-server}`, `@nx/storybook:storybook`, `@nx/remix:{build,serve}`, `@nx/next:{build,serve}`. Inferred plugins replace them. Run `convert-to-inferred` per plugin.

### Testing tools

- Jest 30.3 is the default (pinned `~30.3.0` to avoid a React Native incompat in 30.4). The snapshot-guide URL migrates to `jestjs.io/docs/snapshot-testing`.
- Cypress 15.14.2 is the default. The `experimentalPromptCommand` flag is removed (Cypress dropped it in 15.13). Floor `>= 13`.
- Playwright floor `>= 1.36`, with scaffolds landing on `1.37+`. Blob-reporter auto-injection is gated by version.

### Package surface

`@nx/devkit`, `@nx/js`, `@nx/workspace`, `@nx/jest`, `@nx/eslint`, and `@nx/cypress` now build to local `dist/` with `nodenext` and ship a stricter `exports` map. Three layers keep existing imports working:

- Public symbols continue to import from `<pkg>`.
- Each package adds a `<pkg>/internal` entry for the non-public surface that consumers actually relied on.
- Specific deep paths with known external consumers keep explicit entries. For example `@nx/js/src/release/version-actions` for `nx.json` release configs and `@nx/js/src/internal` for conformance@4/5.
- A per-package migration rewrites known deep-import patterns in `.ts`, `.tsx`, `.cts`, and `.mts` files to the public or `/internal` entry.

Coverage is best-effort. Cases we may have missed: non-TS callers (JS scripts, JSON snippets), third-party plugins consuming source through a path we didn't carve a shim for, or imports the codemod's selectors don't match. **Please file an issue with a reproduction if your plugin or workspace hits a `Package subpath ... is not defined by "exports"` error after running the v23 migrations.**

### Releases (`nx release`)

- Legacy flat `releaseTag*` properties are removed. Use the nested `releaseTag` object. The migration consolidates them.
- `version.adjustSemverBumpsForZeroMajorVersion` default flips to `true` for 0.x projects. Breaking changes bump minor, features bump patch. Set to `false` to restore old behavior.
- `releaseTag.strictPreid` default flips to `true` for fixed and independent groups (was `false` for independent).

### Documentation site and Nx Cloud

- New canary docs at `https://canary.nx.dev`. Production site flips at GA.
- Remote cache, sandbox violations, and the agentic `nx import` flow have new dedicated docs.

## Code examples for the two headline behavioral changes

Most v23 behavior changes are mechanical: rename this, install that. These two are conceptual shifts. Concrete snippets help when explaining the change to clients.

### `targetDefaults` shape and spread token

Before (record shape, v22):

```json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"]
    },
    "test": {
      "inputs": ["default", "^production"]
    },
    "e2e-ci--*": {
      "dependsOn": ["^build"]
    },
    "@nx/vite:build": {
      "cache": true
    }
  }
}
```

After (array shape, v23, auto-migrated by `23-0-0-convert-target-defaults-to-array`):

```json
{
  "targetDefaults": [
    { "target": "build", "cache": true, "dependsOn": ["^build"] },
    { "target": "test", "inputs": ["default", "^production"] },
    { "target": "e2e-ci--*", "dependsOn": ["^build"] },
    { "executor": "@nx/vite:build", "cache": true }
  ]
}
```

Why the new shape: an entry can match on `target`, `executor`, `plugin`, and `projects`. Combinations the record key couldn't express. `projects` scopes a default to a subset of the workspace. `plugin` restricts to targets originated by a specific plugin (matched against the source map of the target's `executor` or `command`, not the last writer).

```json
{
  "targetDefaults": [
    { "target": "build", "projects": ["tag:scope:client"], "cache": true },
    { "target": "build", "projects": ["tag:scope:server"], "cache": false },
    { "target": "test", "plugin": "@nx/vite", "inputs": ["default"] }
  ]
}
```

Specificity ladder when multiple entries match: more selectors win over fewer, exact target beats glob, ties go to the later array index.

The `...` spread token solves the other limitation: defaults previously replaced inferred values instead of extending them. Use `...` as an array element to splice base values in at that position, or as an object key set to `true` to merge with the base object:

```json
{
  "targetDefaults": [
    {
      "target": "build",
      "inputs": ["...", "{workspaceRoot}/babel.config.json"],
      "options": {
        "...": true,
        "assetsDir": "static/assets"
      }
    }
  ]
}
```

If the inferred `build` target has `inputs: ["default", "^production"]`, the merged result is `["default", "^production", "{workspaceRoot}/babel.config.json"]` (the `...` is replaced by the base values at its array position). For `options`: keys defined after `"..."` override base values, keys defined before `"..."` lose to the base, and unspecified base keys are preserved. The spread is positional and works one layer deep inside `options` and `configurations`. Deeper nesting is treated as opaque. Disambiguation rules and forward-compat notes live in the [`nx.json` reference](https://canary.nx.dev/docs/reference/nx-json).

### Node.js native TypeScript stripping by default

In v22, loading any `.ts` config (`nx.config.ts`, plugin `createNodes`, custom executors written in TS) registered `@swc-node/register` plus `tsconfig-paths` up front, even on Node 22.6+ that ships a native TS stripper. Fresh workspaces installed `@swc-node/register`, `@swc/core`, and `@swc/helpers` purely to register the transpiler.

In v23 the native Node.js TS stripper handles the `.ts` load by default. `swc-node` and `ts-node` register lazily only if the native path fails. The fallback is limited to a small set of matchable errors (`MODULE_NOT_FOUND`, `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`, ESM-as-CJS syntax errors, `__dirname` in ESM, ESM-with-TLA), and capped at 3 attempts. `@nx/js:init` no longer installs the swc deps.

What this means in practice:

| Concern                                                       | v22                               | v23                                                      |
| ------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------- |
| `node_modules` size                                           | swc binary plus helpers installed | Skip unless fallback fires                               |
| First plugin load                                             | swc warmup                        | Native, no warmup                                        |
| TS features beyond stripping (decorators, enums, namespaces)  | Worked via swc                    | Native strip rejects, fallback registers swc on demand   |
| Workspaces on Node `< 22.6`                                   | swc up front                      | Fallback registers swc up front (same as v22 net effect) |

Opt out if your `.ts` plugin or config uses syntax native strip can't handle, or you want predictable warmup cost:

```bash
NX_PREFER_NODE_STRIP_TYPES=false nx <command>
```

Or set it in CI or `.envrc` so the swc path is always taken. The error message that triggers the fallback also includes this opt-out hint inline.

Champion test ask: run a workspace with TS plugins on a real client, both default and opt-out, and report whether the native path covers their TS surface. Decorators in `createNodes` is the most likely gotcha.

## Migrations

Two groups: core (every Nx user, regardless of stack) and plugin and tech-dependent (only if the relevant plugin is installed).

`nx migrate` runs the right ones for you. Migrations gated by `requires` only fire if the relevant dep is installed at the gated version range. So, for example, the Vite 8 migration only runs if you are already on Vite 7.

### Core migrations (apply to everyone)

| Migration                                                     | Beta    | What it does                                                                                                                | Docs                                                                                                        |
| ------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `23-0-0-convert-target-defaults-to-array`                     | beta.13 | Converts `nx.json` `targetDefaults` from record shape to filtered-array shape.                                              | [docs](https://canary.nx.dev/docs/reference/nx/migrations#23-0-0-convert-target-defaults-to-array)          |
| `23-0-0-consolidate-release-tag-config`                       | beta.16 | Consolidates legacy flat `releaseTag*` props into the nested `releaseTag` object.                                           | [docs](https://canary.nx.dev/docs/reference/nx/migrations#23-0-0-consolidate-release-tag-config)            |
| `23-0-0-move-typescript-compilation-import` (`@nx/workspace`) | beta.10 | Rewrites `@nx/workspace/src/utilities/typescript/compilation` to `@nx/js/internal`.                                         | [docs](https://canary.nx.dev/docs/reference/workspace/migrations#23-0-0-move-typescript-compilation-import) |
| `update-devkit-deep-imports` (`@nx/devkit`)                   | beta.6  | Rewrites `@nx/devkit/src/...` deep imports to `@nx/devkit` (public) or `@nx/devkit/internal` (rest).                        | [docs](https://canary.nx.dev/docs/reference/devkit/migrations#update-devkit-deep-imports)                   |

### Plugin and tech-dependent migrations

Only runs if the relevant plugin is installed, and the `requires` gate (if any) is satisfied.

#### `@nx/js` ([all migrations](https://canary.nx.dev/docs/technologies/typescript/migrations))

| Migration                                                                                                                                          | Beta    | What it does                                                                                                                                                  | Gated on                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [`23-0-0-rewrite-internal-subpath-imports`](https://canary.nx.dev/docs/technologies/typescript/migrations#23-0-0-rewrite-internal-subpath-imports) | beta.14 | Rewrites `@nx/js/src/*` to `@nx/js` (public) or `@nx/js/internal` (rest). Preserves `@nx/js/src/release/version-actions` for `nx.json` release configs.       | N/A                       |
| `23.0.0-swc-cli` (packageJsonUpdates)                                                                                                              | beta.17 | Bumps `@swc/cli` to `~0.8.0`.                                                                                                                                  | `@swc/cli >=0.7.0 <0.8.0` |

#### `@nx/angular` ([all migrations](https://canary.nx.dev/docs/technologies/angular/migrations))

| Migration                                                                                                                                                             | Beta   | What it does                                                                                                                  | Gated on |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- | -------- |
| [`update-23-0-0-update-with-module-federation-import`](https://canary.nx.dev/docs/technologies/angular/migrations#update-23-0-0-update-with-module-federation-import) | beta.0 | Rewrites `@nx/angular/module-federation` to `@nx/module-federation/angular`. Adds `@nx/module-federation` to `package.json`.  | N/A      |
| [`update-23-0-0-migrate-ngrx-generator-defaults`](https://canary.nx.dev/docs/technologies/angular/migrations#update-23-0-0-migrate-ngrx-generator-defaults)           | beta.7 | Splits `@nx/angular:ngrx` defaults in `nx.json` across `ngrx-root-store` and `ngrx-feature-store`.                            | N/A      |

#### `@nx/react` ([all migrations](https://canary.nx.dev/docs/technologies/react/migrations))

| Migration                                                                                                                                                             | Beta    | What it does                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------- |
| [`update-23-0-0-remove-nx-react-webpack-plugin-import`](https://canary.nx.dev/docs/technologies/react/migrations#update-23-0-0-remove-nx-react-webpack-plugin-import) | beta.10 | Rewrites `NxReactWebpackPlugin` import from `@nx/react` to `@nx/react/webpack-plugin`.    |

#### `@nx/vite` ([all migrations](https://canary.nx.dev/docs/technologies/build-tools/vite/migrations))

| Migration                                                                                                                                                    | Beta    | What it does                                                                                                                | Gated on       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------- | -------------- |
| [`ensure-vitest-package-migration-23`](https://canary.nx.dev/docs/technologies/build-tools/vite/migrations#ensure-vitest-package-migration-23)               | beta.10 | Safety net. Swaps `@nx/vite:test` to `@nx/vitest:test`, installs `@nx/vitest`, and registers its plugin.                    | N/A            |
| [`rename-rollup-options-to-rolldown-options`](https://canary.nx.dev/docs/technologies/build-tools/vite/migrations#rename-rollup-options-to-rolldown-options) | beta.10 | Renames `rollupOptions` to `rolldownOptions` in `vite.config.*` (top-level and inside `environments`).                      | `vite >=8.0.0` |
| [`create-ai-instructions-for-vite-8`](https://canary.nx.dev/docs/technologies/build-tools/vite/migrations#create-ai-instructions-for-vite-8)                 | beta.10 | Writes `tools/ai-migrations/MIGRATE_VITE_8.md` for workspace-specific Vite 8 manual steps.                                  | `vite >=8.0.0` |
| `23.0.0` (packageJsonUpdates)                                                                                                                                | beta.10 | Bumps `vite ^8.0.0`, `@vitejs/plugin-react ^6.0.0`. Marks `@remix-run/dev` as `incompatibleWith` (Remix won't auto-bump).   | N/A            |

#### `@nx/rollup` ([all migrations](https://canary.nx.dev/docs/technologies/build-tools/rollup/migrations))

| Migration                                                                                                                                                                      | Beta   | What it does                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------- |
| [`update-23-0-0-remove-use-legacy-typescript-plugin`](https://canary.nx.dev/docs/technologies/build-tools/rollup/migrations#update-23-0-0-remove-use-legacy-typescript-plugin) | beta.4 | Removes deprecated `useLegacyTypescriptPlugin` from `@nx/rollup:rollup` options. |

#### `@nx/rspack` ([all migrations](https://canary.nx.dev/docs/technologies/build-tools/rspack/migrations))

| Migration                                                                                                                                                  | Beta   | What it does                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| [`update-23-0-0-add-svgr-to-rspack-config`](https://canary.nx.dev/docs/technologies/build-tools/rspack/migrations#update-23-0-0-add-svgr-to-rspack-config) | beta.9 | Migrates `svgr: true` in `withReact({ svgr })` or `NxReactRspackPlugin` to a `withSvgr()` composable. |

#### `@nx/webpack` ([all migrations](https://canary.nx.dev/docs/technologies/build-tools/webpack/migrations))

| Migration                                                                                                                                                                                             | Beta    | What it does                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------- |
| [`update-23-0-0-remove-nx-tsconfig-paths-webpack-plugin-import`](https://canary.nx.dev/docs/technologies/build-tools/webpack/migrations#update-23-0-0-remove-nx-tsconfig-paths-webpack-plugin-import) | beta.10 | Rewrites `NxTsconfigPathsWebpackPlugin` from `@nx/webpack` to `@nx/webpack/tsconfig-paths-plugin`. |

#### `@nx/cypress` ([all migrations](https://canary.nx.dev/docs/technologies/test-tools/cypress/migrations))

| Migration                                                                                                                                        | Beta    | What it does                                                                              | Gated on                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ----------------------------------------------------------------------------------------- | ----------------------------------------- |
| [`remove-experimental-prompt-command`](https://canary.nx.dev/docs/technologies/test-tools/cypress/migrations#remove-experimental-prompt-command) | beta.10 | Strips the removed `experimentalPromptCommand` flag from `cypress.config.{ts,js,mjs,cjs}`. | `cypress >=15.13.0`                       |
| [`rewrite-internal-subpath-imports`](https://canary.nx.dev/docs/technologies/test-tools/cypress/migrations#rewrite-internal-subpath-imports)     | beta.19 | Rewrites `@nx/cypress/src/*` to public `@nx/cypress` or `@nx/cypress/internal`.            | N/A                                       |
| `23.0.0` (packageJsonUpdates)                                                                                                                    | beta.10 | Bumps `cypress` to `^15.14.2`.                                                              | `cypress >=15.0.0 <15.14.0`               |
| `23.0.0-vite-dev-server` (packageJsonUpdates)                                                                                                    | beta.10 | Bumps `@cypress/vite-dev-server` to `^7.3.1`.                                              | `@cypress/vite-dev-server >=7.0.0 <7.3.1` |

#### `@nx/jest` ([all migrations](https://canary.nx.dev/docs/technologies/test-tools/jest/migrations))

| Migration                                                                                                                                           | Beta    | What it does                                                                                              | Gated on        |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- | --------------- |
| [`update-snapshot-guide-link`](https://canary.nx.dev/docs/technologies/test-tools/jest/migrations#update-snapshot-guide-link)                       | beta.10 | Rewrites `.snap` files' guide link to `https://jestjs.io/docs/snapshot-testing` (Jest 30 requirement).    | `jest >=30.0.0` |
| [`rewrite-jest-internal-subpath-imports`](https://canary.nx.dev/docs/technologies/test-tools/jest/migrations#rewrite-jest-internal-subpath-imports) | beta.16 | Rewrites `@nx/jest/src/*` to public `@nx/jest` or `@nx/jest/internal`.                                    | N/A             |
| [`rewrite-jest-project-generator`](https://canary.nx.dev/docs/technologies/test-tools/jest/migrations#rewrite-jest-project-generator)               | beta.16 | Replaces the removed `jestProjectGenerator` export with `configurationGenerator`.                         | N/A             |
| `23.0.0-pin-jest-30-3-for-rn-compat` (packageJsonUpdates)                                                                                           | beta.9  | Pins `jest ~30.3.0`, `babel-jest ~30.3.0`, `@types/jest ~30.0.0` for React Native compat.                 | `jest >=30.0.0` |

#### `@nx/eslint` ([all migrations](https://canary.nx.dev/docs/technologies/eslint/migrations))

| Migration                                                                                                                                      | Beta    | What it does                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [`rewrite-eslint-internal-subpath-imports`](https://canary.nx.dev/docs/technologies/eslint/migrations#rewrite-eslint-internal-subpath-imports) | beta.17 | Rewrites `@nx/eslint/src/*` to public `@nx/eslint` or `@nx/eslint/internal`. Covers `require`, dynamic `import`, and `jest.mock`.       |

#### `@nx/gradle` ([all migrations](https://canary.nx.dev/docs/technologies/java/gradle/migrations))

| Migration                                                                                                                     | Beta    | What it does                                                           |
| ----------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------- |
| [`change-plugin-version-0-1-21`](https://canary.nx.dev/docs/technologies/java/gradle/migrations#change-plugin-version-0-1-21) | beta.11 | Bumps `dev.nx.gradle.project-graph` plugin to `0.1.21` in build files. |

#### Plugins with no v23 migrations

No automated changes needed for: `@nx/detox`, `@nx/docker`, `@nx/dotnet`, `@nx/esbuild`, `@nx/eslint-plugin`, `@nx/expo`, `@nx/express`, `@nx/maven`, `@nx/module-federation`, `@nx/nest`, `@nx/next`, `@nx/node`, `@nx/nuxt`, `@nx/playwright`, `@nx/plugin`, `@nx/react-native`, `@nx/remix`, `@nx/rsbuild`, `@nx/storybook`, `@nx/vitest`, `@nx/vue`, `@nx/web`.

Several of these do have v23 breaking changes without automated migrations. See the next section.

## Breaking changes

### Version requirements

| Requirement                            | v22.7              | v23                                  |
| -------------------------------------- | ------------------ | ------------------------------------ |
| Node.js                                | 20 LTS+            | 22 LTS+ (Node 20 EOL Apr 2026)       |
| TypeScript (`@nx/js`)                  | `>= 5.0`           | `>= 5.4`                             |
| Angular (`@nx/angular`)                | `>= 18`            | `>= 19`                              |
| Cypress (`@nx/cypress`)                | `>= 13`            | `>= 13`                              |
| Playwright (`@nx/playwright`)          | floor not enforced | `>= 1.36`                            |
| Jest (`@nx/jest`)                      | `>= 29`            | `>= 30` (pinned `~30.3.0`)           |
| Vite (`@nx/vite`)                      | `>= 5`             | `>= 8` (Vite 8 itself drops Node 18) |
| `@swc/cli` (optional peer of `@nx/js`) | unset              | `>= 0.6.0 < 0.9.0`                   |

### Removals with available automation

| Removed                                                                                                                                                                       | Replacement                                                      | Codemod                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `@nx/angular/module-federation` entry point                                                                                                                                   | `@nx/module-federation/angular`                                  | `@nx/angular: update-23-0-0-update-with-module-federation-import`                    |
| `@nx/angular:ngrx` generator                                                                                                                                                  | `@nx/angular:ngrx-root-store` plus `@nx/angular:ngrx-feature-store` | `@nx/angular: update-23-0-0-migrate-ngrx-generator-defaults` (`nx.json` defaults only) |
| `@nx/jest` `jestProjectGenerator` export                                                                                                                                      | `configurationGenerator`                                         | `@nx/jest: rewrite-jest-project-generator`                                           |
| `@nx/vite:test`, `@nx/vite:vitest` gen, vitest target inference in `@nx/vite/plugin`                                                                                          | `@nx/vitest:test` plus `@nx/vitest/plugin`                       | `@nx/vite: ensure-vitest-package-migration-23`                                       |
| `useLegacyTypescriptPlugin` option on `@nx/rollup:rollup`                                                                                                                     | `@rollup/plugin-typescript` only                                 | `@nx/rollup: update-23-0-0-remove-use-legacy-typescript-plugin`                      |
| `svgr` option on `withReact` or `NxReactRspackPlugin`                                                                                                                         | `withSvgr()` composable                                          | `@nx/rspack: update-23-0-0-add-svgr-to-rspack-config`                                |
| `rollupOptions` in Vite configs                                                                                                                                               | `rolldownOptions` (Vite 8 / Rolldown)                            | `@nx/vite: rename-rollup-options-to-rolldown-options`                                |
| `experimentalPromptCommand` in `cypress.config.*`                                                                                                                             | None. Cypress removed the flag in 15.13.                         | `@nx/cypress: remove-experimental-prompt-command`                                    |
| `.snap` file legacy `goo.gl/fbAQLP` guide link                                                                                                                                | `https://jestjs.io/docs/snapshot-testing`                        | `@nx/jest: update-snapshot-guide-link`                                               |
| `releaseTagPattern`, `releaseTagPatternRequireSemver`, `releaseTagPatternStrictPreid`, `releaseTagPatternPreferDockerVersion`, `releaseTagPatternCheckAllBranchesWhen` (flat) | Nested `releaseTag` object                                       | `nx: 23-0-0-consolidate-release-tag-config`                                          |
| Legacy `targetDefaults` record shape in `nx.json`                                                                                                                             | Filtered-array shape                                             | `nx: 23-0-0-convert-target-defaults-to-array`                                        |
| `<pkg>/src/*` deep imports for `@nx/devkit`, `@nx/js`, `@nx/workspace`, `@nx/jest`, `@nx/eslint`, `@nx/cypress`                                                               | `<pkg>` (public) or `<pkg>/internal`                             | Per-package `rewrite-internal-subpath-imports` migrations                            |

### Removals that require manual fix

| Removed                                                                                                              | What to do                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nx/angular:move` generator                                                                                         | Use `@nx/workspace:move` (or `mv` alias). Update any CI, scripts, or docs invoking the old path.                                                          |
| `--js` flag on React, React Native, and Expo `:component` generators                                                 | Pass the extension via `path` arg, for example `nx g component mylib/src/lib/foo.jsx`.                                                                    |
| `--style=tailwind` (React, Vue), `--addTailwind` (Angular), `--style=tailwind` (create-nx-workspace), all `setup-tailwind` generators | Set up Tailwind by hand (or via AI). `@nx/{angular,react,next,vue}/tailwind` barrel imports still work but warn. Remove before v24.                       |
| `less`, `styled-jsx`, `styled-components`, `@emotion/styled` style choices in React and Vue gens                     | Pick `css`, `scss`, or `none`. Configure the other style stack manually. LESS still compiles with a deprecation warning.                                  |
| `initTasksRunner` API from `nx`                                                                                      | Switch to `runDiscreteTasks` or `runContinuousTasks`.                                                                                                     |
| Nx `Access-Control-Allow-Origin: *` on the graph HTTP server                                                         | Cross-origin scrapers are CORS-blocked. Run scraping tools same-origin.                                                                                   |
| `stripSourceCode`, `TypeScriptImportLocator` (non-native scanners)                                                   | Native Rust scanner is the only path. No external callers known.                                                                                          |
| Angular `migrations.json` entries older than `update-20-*`                                                           | Workspaces on Angular `< 18` must use Angular's own upgrade path before adopting Nx 23.                                                                   |
| `@nx/gradle/plugin-v1` entry                                                                                         | Use the default `@nx/gradle` entry. Deprecation warning emits at load. Removed in v24.                                                                    |

### Behavior changes

| Change                                                            | Detail                                                                                                                                                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native Node TS stripping default                                  | `.ts` configs and plugins load via the Node 22 native stripper. `@swc-node/register` and `@swc/core` aren't installed by default. Opt out: `NX_PREFER_NODE_STRIP_TYPES=false`.       |
| `nx watch --includeDependentProjects`                             | Renamed to `--includeDependencies`. Old flag works but is hidden and deprecated. Removed in v24.                                                                                    |
| `dependsOn` magic strings (`projects: 'self'` or `'dependencies'`) | Warns instead of dropping silently. Removed in v24. Run the existing v16 `update-depends-on-to-tokens` migration if you haven't.                                                    |
| Continuous-task shutdown                                          | Leaf-first signal via native process-tree walk. Configurable via `NX_PROCESS_KILL_GRACE_PERIOD` (default 5000ms). May change shutdown timing in dev scripts.                        |
| `Rollup` plugin in `@nx/rollup`                                   | `withNx({ buildLibsFromSource })` default flipped from `false` to `true` to match the executor.                                                                                     |
| `@rspack/core`, `@rsbuild/core`                                   | Moved from regular dep to peer dep. Declare explicitly or rely on auto-install.                                                                                                     |
| `incompatibleWith: '@remix-run/dev'` on Vite 8 bump               | Remix workspaces will not auto-bump to Vite 8. Remix's dev tooling isn't compatible yet.                                                                                            |
| `version.adjustSemverBumpsForZeroMajorVersion` default            | Now `true`. For 0.x projects, breaking bumps minor and features bump patch. Set to `false` for old behavior.                                                                        |
| `releaseTag.strictPreid` default                                  | Now `true` for both fixed and independent groups (was `false` for independent).                                                                                                     |
| Broken `dependsOn` entries                                        | Silently dropped during normalization instead of erroring downstream. Diagnose with `nx show project --json`.                                                                       |
| `globals` (peer of `@nx/eslint-plugin`)                           | Bumped `^15.9.0` to `^17.0.0`.                                                                                                                                                       |
| `ignore` (dep of `@nx/eslint`)                                    | Bumped `^5.0.4` to `^7.0.5`.                                                                                                                                                         |

### Deprecations slated for removal in v24

| Deprecated                                                                                                                                | Move to                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `@nx/jest:jest` executor                                                                                                                  | `@nx/jest/plugin` inferred plugin (`nx g @nx/jest:convert-to-inferred`) |
| `@nx/cypress:cypress` executor                                                                                                            | `@nx/cypress/plugin` inferred plugin                                    |
| `@nx/playwright:playwright` executor                                                                                                      | `@nx/playwright/plugin` inferred plugin                                 |
| `@nx/detox:build`, `@nx/detox:test` executors                                                                                             | `@nx/detox/plugin` inferred plugin                                      |
| `@nx/webpack:webpack`, `@nx/webpack:dev-server`                                                                                           | `@nx/webpack/plugin` inferred plugin                                    |
| `@nx/storybook:storybook` executor                                                                                                        | `@nx/storybook/plugin` inferred plugin                                  |
| `@nx/remix:build`, `@nx/remix:serve`                                                                                                      | `@nx/remix/plugin` (or migrate to React Router 7)                       |
| `@nx/next:build`, `@nx/next:serve`                                                                                                        | `@nx/next/plugin` inferred plugin                                       |
| React, React Native, and Expo executors (build, export, install, prebuild, run, serve, start, submit, run-android, run-ios, pod-install, bundle, upgrade) | Per-framework inferred plugins                                          |
| `@nx/eslint:lint` executor                                                                                                                | `@nx/eslint/plugin`                                                     |
| `@nx/gradle/plugin-v1` entry                                                                                                              | Default `@nx/gradle` entry                                              |
| `dependsOn` `'self'` or `'dependencies'` magic strings                                                                                    | `^build`, `{projects: 'self', target}`, named tokens                    |
| `nx watch --includeDependentProjects`                                                                                                     | `--includeDependencies`                                                 |
| `@nx/*/tailwind` barrel imports                                                                                                           | Direct import path. Remove before v24.                                  |

## Champion-specific test asks

The v23-only changes most likely to bite a client workspace, and where Champion feedback would actively change what ships at GA:

1. `nx migrate --mode` separation (`first-party`, `third-party`, `all`). Does staging Nx-core upgrades independently from plugin upgrades work on a real client workspace? See the reserved section above.
2. Deep-import codemods. Run the migrations on a workspace with a homegrown plugin or Nx Cloud client that reaches into `@nx/devkit/src/...`. Does the rewrite catch all usages? File issues for the non-TS callers that get missed.
3. Vite 8 plus Remix `incompatibleWith`. Does the package-json update behave sensibly on a Remix workspace? Does the user get a clear "you're stuck on Vite 7 until Remix catches up" message?
4. Native Node TS stripping default. Set `NX_PREFER_NODE_STRIP_TYPES=false` and `true` on the same workspace. Do all `.ts` configs and plugin loads behave identically?
5. Tailwind v3 to v4 migration story. There's no codemod. How long does it take you, on a real workspace, to redo the Tailwind setup? Tell us what a codemod would need to handle.
6. `adjustSemverBumpsForZeroMajorVersion` flip for any 0.x projects you maintain. Confirm the new semver behavior matches your release expectations.
7. Process tree shutdown under `nx serve` plus dependents. Anything still leaks? File with `NX_PROCESS_KILL_GRACE_PERIOD` values you tried.

## Notable features (non-breaking, additive)

These are the ones to flag to clients as "Nx 23 also gave us this":

- Shell tab-completion (`nx completion <shell>`).
- `nx watch --includeDependencies` (renamed).
- Spread `...` token in `targetDefaults`.
- Filtered-array `targetDefaults` with `target`, `executor`, `plugin`, and `projects` selectors.
- `prompt` field in migration entries. Plugins can ship human-in-the-loop migrations now.
- Streaming Gradle batch task results to Nx as they finish.
- Fallback to `npm publish` when `bun publish` fails with auth error (`@nx/js`).
- Pruned pnpm lockfile now includes transitive workspace deps.
- `tsconfig` solution-style inputs included for Webpack and Rollup.
- Daemon force-flush hardening and freshness-gate recompute (fewer stale daemon results).
- Native macOS hostUUID via `gethostuuid(3)` (no more `ioreg` shell-out).

## Notable fixes shipped on the v23 line

Mostly stuff that landed alongside the breaking changes. Call out if a client reported the symptom.

- Local-dist plus nodenext rollout shipped with compat shims for `@nx/devkit/src/release/version-actions`, conformance@4/5, `hydrateFileMap`, `WorkspaceFileMap.allWorkspaceFiles` (for Nx Cloud worker compat), `use-legacy-versioning` (for `@nx/js@21` callers), and an `@nx/cypress/internal` ENOENT fix.
- TUI hardening: stdin race on enter, viewport off-by-one, double logs on skipped batch tasks, in-progress task selection persistence.
- Daemon: macOS same-second in-place updates classified correctly, cache-poisoned in-process Nx loads no longer kill the daemon, per-OS force-flush grace.
- Native watcher rewrite (opt-out: `NX_DAEMON=false`).
- `nx mcp` runs outside an Nx workspace (single-workspace MCP usage).
- `nx migrate` surfaces actionable peer-dep errors instead of failing silently.
- `nx graph` strips the cross-origin header (security).
- `axios` 1.16.0 (CVE patch), `minimatch` 10.2.5.

## Plugin authoring impact

If you maintain a custom Nx plugin or consult on workspaces that do, these v23 changes are the highest-impact for your plugin's surface:

- `@nx/devkit`, `@nx/js`, `@nx/workspace`, `@nx/jest`, `@nx/eslint`, and `@nx/cypress` build to local `dist/` with `nodenext` and ship a stricter `exports` map. Public symbols and named `<pkg>/internal` paths are preserved, a handful of high-traffic deep paths keep explicit shim entries, and a codemod rewrites known patterns. If your plugin imports a deep path that isn't covered and the codemod doesn't pick it up, please file with a reproduction.
- `devkit` peer of `nx` is bumped to `>= 22 <= 24 || ^23.0.0-0`. Plugins pinning to `^22` need a peer-range update.
- `prompt`-only migrations are supported now. If your plugin has an "edit your config like this" step that you've been emitting in markdown, fold it into a `prompt` migration entry.
- `@nx/eslint-plugin` `nx-plugin-checks` allows prompt-only migration entries now (was complaining).
- Schema deprecations (`x-deprecated`) are the canonical signal for v24 removal. Set this when announcing replacements on your own generators and executors.

## What is not in v23

So you don't promise it:

- No major Nx Cloud-side changes in this release line. Sandbox-violation reporting, remote cache improvements, and pricing-page updates are infra and docs commits, not new product features.
- No Module Federation algorithm changes. Webpack 5.107.1 compat re-enabled some MF e2e suites, but no semantic differences.
- No Docker plugin changes (`@nx/docker` is still relatively new and has no breaking changes in v23).

## Format and cadence

- Cadence: this doc updates per beta drop (currently `beta.18`). Final form moves to a public blog post plus GA changelog at v23.0.0.
- Source of truth for migrations: the per-plugin `migrations.json` files in the `nx` repo. Canary docs render from those.
- Source of truth for breaking changes: this doc. Final form moves to `astro-docs/src/content/docs/guides/release/v23-migration.mdoc` (path TBD) at GA.

---

_Last updated against `23.0.0-beta.18`. Compiled from 232 commits between `22.7.0-rc.2` (merge base) and `beta.18`._
