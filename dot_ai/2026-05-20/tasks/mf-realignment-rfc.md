# RFC: Realigning Nx Module Federation around module-federation.io and Angular Native Federation

This is a request for feedback on changes Nx is making to its Module Federation tooling in **v23 (deprecation)** and **v24 (removal)**. The deprecation lands either way — this discussion exists so we can adjust the v24 removal plan based on what hits real customer workspaces.

If your workspace uses any of `@nx/react:host`, `@nx/react:remote`, `@nx/angular:host`, `@nx/angular:remote`, or imports from `@nx/module-federation`, please read on. Comments below tell us where the migration is going to hurt.

---

## TL;DR

- Nx is dropping its bespoke Module Federation wrappers and aligning with the upstream standards: `@module-federation/enhanced` + `@module-federation/vite` for React, `@angular-architects/native-federation` for Angular.
- New generators `@nx/react:producer` / `:consumer` (Rsbuild + Vite) and `@nx/angular:producer` / `:consumer` (Native Fed) ship in v23.
- Existing `:host` / `:remote` generators and the `@nx/module-federation/{rspack,webpack,angular}` config wrappers are **deprecated in v23, removed in v24**.
- `@nx/module-federation` the package keeps its name and narrows to a single responsibility: the static-remote dev orchestration (one process serves N producers locally). This is the only Nx-specific MF feature that survives.
- **No automated codemod.** Existing apps stay on the deprecated path through v23 with warnings; you hand-rewrite to the new shape before v24.

---

## Why

Three things are true now that weren't when Nx first shipped its MF tooling:

1. **The upstream toolchain matured.** `@module-federation/enhanced` is bundler-agnostic and ships a stable `mf-manifest.json` format. `@module-federation/vite` consumes the same format. `@angular-architects/native-federation` is the Angular team's recommended path (esbuild, dynamic-by-default).
2. **Nx-specific config indirection is now a source of confusion.** `module-federation.config.ts` + `withModuleFederation()` + workspace-library auto-sharing don't match any pattern users find in MF.io docs or in StackOverflow answers. Customers debug a different stack than what they see in their bundler config.
3. **`@nx/angular:host` still ships webpack-MF.** It's the only Nx-generated MF tree without cross-bundler manifest interop, and it's now lagging on what the Angular ecosystem treats as the recommended path.

We've been carrying this surface because removing it breaks people. The trade-off has flipped: the cost of maintaining the indirection now exceeds the cost of a clean break.

---

## What changes in v23

### New generators

```bash
# React (Rsbuild or Vite)
nx g @nx/react:producer my-producer --bundler=rsbuild
nx g @nx/react:consumer my-consumer --bundler=rsbuild

# Angular (Native Federation)
nx g @nx/angular:producer my-producer
nx g @nx/angular:consumer my-consumer
```

The scaffolded configs are the upstream-recommended shape — no Nx wrapper between you and the bundler plugin. Examples mirroring the new output live in [the mf-examples repo](#) (link will be added before the RFC publishes; covers six trees across rspack/rsbuild/vite/native-fed/Nx variants).

### Bundlers

- **React**: Rsbuild (default) and Vite. Raw Rspack is removed — Rsbuild wraps Rspack with a better config surface and the same `@module-federation/enhanced/rspack` plugin underneath. Webpack is removed.
- **Angular**: Native Federation only. Angular on Module Federation Enhanced is not supported by the new generators.

### Configuration shape

The new consumer config looks like upstream MF docs, because it *is* upstream MF docs. No `module-federation.config.ts` middle file, no `withModuleFederation()` wrapper.

**Rsbuild consumer (excerpt)**:

```ts
import { defineConfig } from '@rsbuild/core';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  tools: {
    rspack: {
      plugins: [
        new ModuleFederationPlugin({
          name: 'consumer',
          remotes: {
            producer1: 'producer1@http://localhost:4201/mf-manifest.json',
          },
          shared: ['react', 'react-dom'],
        }),
      ],
    },
  },
});
```

**Angular consumer (excerpt)**:

```ts
// main.ts
import { initFederation } from '@angular-architects/native-federation';

initFederation('federation.manifest.json')
  .catch((err) => console.error(err))
  .then(() => import('./bootstrap'))
  .catch((err) => console.error(err));
```

### Type safety for remotes

Producers ship `dts: true` by default. Type definitions land in the consumer's `@mf-types/` directory automatically — no tsconfig path mapping needed. This is the MF.io standard.

### Shared dependencies

Shared deps are declared explicitly in `shared: [...]`. **Workspace library auto-sharing is removed.** If your producer and consumer both import `@my-org/design-system`, that library bundles into both unless you list it in `shared:`.

---

## What is no longer supported

The explicit no-s. If your workspace relies on any of these, the migration is going to involve a decision.

### Bundlers

- Raw Rspack as a bundler choice (use Rsbuild)
- Webpack
- Webpack-MF for Angular

### Config and wrappers

- `module-federation.config.ts` middle file
- `withModuleFederation()` from `@nx/module-federation/rspack`, `/webpack`, `/angular`
- `withModuleFederationForSSR()`
- `NxModuleFederationConfigOverride` (no Nx-specific override surface; edit the bundler config directly)

### Shared dependency utilities

- `shareWorkspaceLibraries`
- `sharePackages`
- `applySharedFunction`, `applyAdditionalShared`
- `getNpmPackageSharedConfig`
- Auto-discovery of workspace TS libraries as shared deps (declare in `shared:` explicitly)

### Remote resolution utilities

- `mapRemotes`, `mapRemotesForSSR`
- Model exports: `ModuleFederationConfig`, `SharedLibraryConfig`, `SharedWorkspaceLibraryConfig`, `AdditionalSharedConfig`, `WorkspaceLibrary`, `SharedFunction`, `WorkspaceLibrarySecondaryEntryPoint`, `Remotes`, `ModuleFederationLibrary`

### Typing

- TS-path-based remote module typing (replaced by `@mf-types/` from `dts: true`)

### SSR

- Vite SSR with federation (not in the new Vite consumer)
- Angular SSR with federation (not in the new Angular consumer)
- Webpack-MF SSR via `withModuleFederationForSSR()` (removed alongside the deprecated generators)

### Generator surface

- `host` / `remote` as generator names (use `consumer` / `producer`)
- `--dynamic` flag (React stays static, Angular stays runtime-manifest — each upstream default)
- Generator option for nested federation (recipe page covers the manual edit)

### Interop

- Cross-bundler interop (Rsbuild ↔ Vite) is best-effort — both emit `mf-manifest.json`, but Nx does not run CI coverage for the cross. File upstream if you hit issues.
- Native Federation ↔ Module Federation Enhanced (Angular Native Fed consumers cannot consume Rsbuild/Vite producers — different manifest format).

---

## What stays

`@nx/module-federation` keeps its name and ships exactly one feature: **static-remote dev orchestration**. Build all producers once to `dist/`, serve them from a single express+proxy process on their respective ports, run only the consumer dev server in watch mode.

This is the only Nx-specific MF feature with no upstream equivalent. If you have a workspace with five or more producers, it matters — running five dev servers in parallel will eat your memory. The orchestration is invoked automatically by the new `@nx/react:consumer` and `@nx/angular:consumer` scaffolded `serve` targets.

**Note**: dynamic remotes (runtime API or runtime manifest) do not replace the orchestration. Dynamic remotes change where the URL is declared; they don't free a consumer from needing the producer to be running. If you're conflating these, the static-remote orchestration is what you actually want.

---

## Migration

### Path A: stay on v23 until you have time

v23 ships with deprecation warnings on all the removed APIs. Your existing `:host` / `:remote` apps keep working. You skip v24 if you're not ready.

### Path B: rewrite when you can

1. Run `nx g @nx/react:consumer` (or the Angular equivalent) in a sandbox to see the new shape.
2. Move your existing `module-federation.config.ts` contents into the bundler config inline. Drop `withModuleFederation()`.
3. List shared deps explicitly. Anything from your workspace that needs to be a runtime singleton (`React.Context`-using packages, design system roots) goes in `shared:`. Plain utility libs probably don't need to be shared.
4. Drop tsconfig path mappings for remote modules. Re-run dev with `dts: true` on producers — types regenerate into `@mf-types/`.
5. For Angular: switch to Native Federation. Different manifest format — you'll regenerate the consumer's `federation.manifest.json`.

A more detailed migration guide ships alongside v23.

### What won't migrate cleanly

- Custom shared-dep functions (`applySharedFunction`). The new pattern is plain `shared: [...]` arrays. If your function had non-trivial logic, you either inline the resolved set or accept the loss.
- Angular workspaces using Module Federation Enhanced via `@nx/angular:host` with `--bundler=rspack`. The Angular generator path collapses to Native Federation only. You either switch frameworks or stay on v23.
- Customer-specific override patterns via `NxModuleFederationConfigOverride`. The new configs have no Nx-specific override surface — you edit the bundler config directly.

---

## What we want feedback on

Comments below should help us decide:

1. **Sunset timeline**: is one major (v23 → v24) enough? Would v25 removal materially help your migration?
2. **Missing capabilities**: which of the no-longer-supported items in your workspace are blockers? In particular:
   - Vite SSR with federation
   - Angular SSR with federation
   - Angular on Module Federation Enhanced (cross-bundler with React producers)
   - Webpack as a bundler choice (transitional, not new development)
3. **Workspace-library auto-sharing**: how many shared deps does your workspace have that you'd need to enumerate manually? Any patterns Nx should preserve as an opt-in helper instead of removing outright?
4. **Codemod scope**: is a partial codemod worth shipping (config shape only, sharing left as a TODO comment) even though it can't migrate the semantic changes safely?
5. **Cross-bundler CI**: are you running Vite producers + Rsbuild consumers (or vice versa) today? Worth a CI-promised guarantee, or is best-effort enough?

If you're hitting something not on this list, comment with the workspace shape (number of producers/consumers, frameworks, bundler) and what specifically breaks.

---

## Timeline

- **Nx v23 (TBD)**: New generators ship. Old generators + APIs emit deprecation warnings. RFC opens for feedback.
- **RFC closes**: when v24 enters beta. We adjust the removal plan based on what you tell us.
- **Nx v24 (TBD)**: Old generators removed. `@nx/module-federation/{rspack,webpack,angular}` entry points removed. `@nx/module-federation` narrows to the orchestration helper.

---

Open for discussion. Specific workspace examples are more useful than abstract concerns.
