# Hand-off: `@nx/module-federation` v23 deprecation + new React consumer/provider generators

**Date:** 2026-05-21
**Source decisions:** sync with Jason. Manfred owns Angular Native Fed docs.
**Background spec:** `.ai/2026-05-19/specs/module-federation-examples.md` (sections 1-15)
**Evidence repo:** `~/projects/mf-examples` (`apps/{react-rspack,react-rsbuild,react-vite,angular-native-fed,nx-react,nx-angular,nx-react-vite}`)

---

## TL;DR for the implementing agent

In Nx v23:

- **Deprecate everything currently shipping in `@nx/module-federation`** — generators (`host`, `remote`), executors (`module-federation-dev-server`, `module-federation-ssr-dev-server`), and Angular MF support.
- **Ship new generators in `@nx/module-federation`**: `consumer` and `provider`. React-only. Targets one of Vite (default), Rsbuild, or Rspack (bundler chosen at generation time).
- **No built-in routing.** Generated code renders a federated component directly. Inline comments in `App.tsx` and the docs page point users at TanStack Router / React Router setup paths — applied manually or via AI.
- **No static-serve orchestration.** Dynamic federation handles missing remotes via a graceful runtime error; the dev story is "serve the apps you need, ignore the rest."
- **No automated migration codemod.** Migration is a docs guide + a paste-into-AI prompt. Users on the deprecated generators have setups too varied to codemod safely.

In Nx v24: remove everything marked deprecated above. No replacement for Angular MF in Nx (Manfred's docs cover Angular Native Federation as the standalone path). A v24.x follow-up minor re-adds `host` / `remote` as aliases forwarding to `consumer` / `provider`.

---

## What's being deprecated (v23) / removed (v24)

| Surface | Status in v23 | Removed in v24 | Notes |
|---|---|---|---|
| `@nx/module-federation:host` generator | Deprecated | ✅ | Replaced by `:consumer` |
| `@nx/module-federation:remote` generator | Deprecated | ✅ | Replaced by `:provider` |
| `@nx/module-federation:module-federation-dev-server` executor | Deprecated | ✅ | No replacement — dynamic federation removes the orchestration need |
| `@nx/module-federation:module-federation-ssr-dev-server` executor | Deprecated | ✅ | Same |
| Angular MF support in `@nx/module-federation` | Deprecated | ✅ | Angular Native Federation has its own ecosystem; Manfred owns the doc |
| React Router integration paths inside the generator | Deprecated | ✅ | Routing is out of scope for the new generators |
| Static-serve orchestration (build remotes once, proxy through host) | Deprecated | ✅ | Dynamic federation supersedes |

### Backwards-compat / migration

- Deprecation warnings emitted on every invocation of the old generators/executors in v23.
- **No automated migration codemod.** Existing setups vary too widely (custom executors, host orchestration, SSR variants) for a generator to land cleanly.
- Ship two artifacts instead:
  1. **A migration guide** in the v23 docs walking through the manual changes: dropping `module-federation.config.ts`, rewriting the bundler config, swapping static `remotes:` for `public/mf-remotes.json` + `registerRemotes` + `loadRemote`, and removing the executor-driven serve.
  2. **An AI prompt** (shipped in the docs) users can paste into Cursor / Claude Code / Copilot to perform the rewrite on their codebase. The prompt is the deliverable.
- Document the breakage that `nx serve host` no longer auto-builds/serves all remotes (this is the "may upset people" point — call it out explicitly in the migration guide).

---

## What ships new (v23)

### Generators

```
nx g @nx/module-federation:consumer <name> --bundler=<vite|rsbuild|rspack>
nx g @nx/module-federation:provider <name> --bundler=<vite|rsbuild|rspack>
```

- **React only.** No `--framework` flag; framework is implicit. Angular variants are out of scope.
- **Bundler is a hard pick at generation time.** No "I'll switch later" — the bundler config is too different. Default to `vite` (modern, fastest dev iteration, widest ecosystem).
- **Workspace setup is plain `vite` / `rsbuild` / `rspack` config.** No Nx-wrapped bundler. The TS-solution project references and `paths` mappings flow through unchanged (validated in `apps/nx-react-vite/`).

### What the generated code looks like

The skeleton must be small. A provider generates:

```
my-provider/
├── package.json          # name, scripts, MF + framework deps
├── vite.config.ts        # (or rsbuild/rspack equivalent) with federation plugin
├── index.html
├── src/
│   ├── index.ts          # `import('./bootstrap')` (required for shared init)
│   ├── bootstrap.tsx     # createRoot + render — for standalone dev only
│   └── App.tsx           # the federated component, default export
└── tsconfig.json
```

The plugin config exposes `./App` (or whatever the user named it). Default port is suggested via inline comment.

A consumer generates:

```
my-consumer/
├── package.json
├── vite.config.ts        # (or rsbuild/rspack) WITHOUT a `remotes:` block
├── index.html
├── public/mf-remotes.json    # empty {} placeholder + a comment showing the format
├── src/
│   ├── index.ts          # `import('./bootstrap')`
│   ├── bootstrap.tsx     # createRoot + render <App />
│   ├── App.tsx           # the consuming component
│   └── mf.ts             # fetch mf-remotes.json + registerRemotes + loadRemote helper
└── tsconfig.json
```

`App.tsx` should render a hardcoded `lazyRemote('my-provider', './App')` example with a comment explaining how to drop this into a route or compose differently.

### Routing strategy

**Generated code does NOT include a router.** It renders the federated component directly, e.g.:

```tsx
// src/App.tsx — generated
import { Suspense } from 'react';
import { lazyRemote } from './mf';

// === Generated example ===
// Replace this with your routing solution. The federated remote is rendered
// directly here as a proof of integration. See the comments below for how to
// wire it into TanStack Router or React Router.
const ProviderApp = lazyRemote('my-provider', './App');

// AI hint: to use this with TanStack Router, replace the `<ProviderApp />`
// below with a Route definition whose `component` returns the lazy remote.
// Example:
//   import { createRoute } from '@tanstack/react-router';
//   const providerRoute = createRoute({ path: '/provider',
//     component: () => <Suspense fallback="..."><ProviderApp /></Suspense> });
//
// AI hint: to use this with React Router v7 data routers, in your routes
// config: { path: '/provider', element:
//   <Suspense fallback="..."><ProviderApp /></Suspense> }

export function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ProviderApp />
    </Suspense>
  );
}
```

The "AI hint" comments are deliberate scaffolding. They give Cursor / Claude Code / Copilot enough context to add routing in a single follow-up turn. The docs page mirrors these snippets for humans.

### The docs page (`@nx/module-federation` page on nx.dev)

Must cover:
- The new `consumer` / `provider` mental model (one sentence each).
- The three bundler choices and a one-line note on why a team might pick each. Vite is the default.
- How dynamic federation works (`mf-remotes.json` + `registerRemotes` + `loadRemote`), with a copy-paste snippet.
- How to add TanStack Router. How to add React Router. ~10 lines each, including the imports.
- A "Migrating from `@nx/module-federation:host`/`remote`" section with the manual steps plus the AI-prompt block users can paste into Cursor / Claude Code / Copilot.
- A "What changed in v23" callout explaining the deprecations, especially the dropped static-serve orchestration.
- An "SSR" section that links out to [module-federation.io's SSR guide](https://module-federation.io/) — not first-classed by the generators, but documented as a thing users can wire up themselves.
- A pointer to `apps/nx-react-vite/` and the dynamic e2e examples in this evidence repo.

For Angular: docs page that points at `@angular-architects/native-federation` with a "this is the supported Angular MF path going forward" callout. Owned by Manfred.

---

## What does NOT ship

- **No Angular MF generators in `@nx/module-federation`.** Angular Native Federation is documented as the supported path; `@angular-architects/native-federation` is the upstream package. Existing Nx-Angular MF users get a deprecation warning and migration docs.
- **No webpack-flavored generators.** Confirmed cut.
- **No built-in router scaffolding.** Inline AI hints + docs only.
- **No static-serve executor.** Dynamic federation is the recommended pattern; if a user truly wants static-serve, they can use plain `vite preview` / `rsbuild preview` / `sirv-cli` via `nx:run-commands`. The repo's `apps/nx-react-vite/` shows the recipe.

---

## Risks to surface to users

1. **"`nx serve host` no longer auto-serves all remotes."** This is the loudest behavior change. Migration guide must make this explicit and explain why: dynamic federation lets you 404 unstarted remotes gracefully, so the orchestration overhead isn't needed. Reference `apps/react-rsbuild/e2e-dynamic/dynamic.spec.ts` and similar as proof.
2. **Angular MF users have to migrate.** They have a choice: switch to Angular Native Federation (Manfred's path) or stay on the v22 webpack-MF setup unsupported. Be direct about that.
3. **No SSR story in v23.** The deprecated `module-federation-ssr-dev-server` is gone. If there's SSR demand for the new generators, scope it as a v24+ follow-up.
4. **Rspack support landing in v23.** Earlier discussion had Rspack as "feedback via RFC" — this hand-off includes it as a first-class bundler choice. Confirm with Jason if that's intentional (see Open Questions).

---

## Generator implementation notes

### Cross-cutting (all 3 bundlers)

- Generated project name and federation `name:` must be JS-identifier-safe. The validator should reject hyphens (or transparently rewrite to underscores in the federation `name` while preserving the project name with hyphens; pick one and document).
- Always emit `index.ts → bootstrap.tsx` indirection (required by the federation runtime for shared dep init; not optional).
- Always set up the dynamic-manifest pattern in consumers (`mf-remotes.json` + `registerRemotes`); don't ship a static `remotes:` block in the bundler config.

### Vite specifics

- Use `@module-federation/vite`. Pin to a working version (`^1.15.5` was current in this repo's evidence).
- Default `server.host: '127.0.0.1'` is wrong for some macOS / Vite version combos (see `apps/react-vite` README — port 5000 collides with AirTunes on the IPv4 wildcard). Generator should default to a non-5000 port (5100, 4173, etc.) and document the gotcha.

### Rsbuild specifics

- Use `@module-federation/enhanced/rspack` via Rsbuild's `tools.rspack` hook (the official rsbuild MF pattern).
- Generator output should mirror `apps/react-rsbuild/host/rsbuild.config.ts` in this repo.

### Rspack specifics

- Use `@module-federation/enhanced/rspack` directly.
- Generator must wire `HtmlRspackPlugin({ excludeChunks: ['<federation-name>'] })` for the consumer's standalone HTML — without this, the `remoteEntry.js` chunk gets injected into the consumer's own index.html and breaks standalone runs (documented in this repo's `MF-COMPARISON.md`).
- No React Refresh by default; users can opt in. Avoids the `_pluginReactRefresh.default is not a constructor` jiti incompat we hit during evidence work.

### Migration generator

- Detect existing `module-federation.config.ts` files. Convert `remotes: ['name', ...]` to entries in a new `public/mf-remotes.json`.
- Replace `import('remote-name/Module')` calls with `lazyRemote('remote-name', './Module')` (or guide the user — codemod may be too brittle on heavily customized code).
- Drop the `customWebpackConfig` from project.json. Replace with a `serve` target that runs `vite` / `rsbuild` / `rspack` directly.
- Drop `dependsOn: ['host:serve']` on the remote's serve — let the consumer pull in the host on its own via the new generator's wiring.

---

## Evidence base in `~/projects/mf-examples`

| Decision | Proven by |
|---|---|
| New generators target Vite/Rsbuild/Rspack | `apps/react-vite/`, `apps/react-rsbuild/`, `apps/react-rspack/` all work end-to-end with `@module-federation/enhanced` or `@module-federation/vite` |
| TS-solution workspace works without escape hatch | `apps/nx-react-vite/` — no `NX_IGNORE_UNSUPPORTED_TS_SETUP=true` needed once the bundler isn't Nx-wrapped |
| Dynamic federation makes static-serve unnecessary | `apps/react-{rspack,rsbuild,vite}/e2e-dynamic/dynamic.spec.ts` — host + 1 remote alive renders cleanly, missing remotes show error boundary |
| Minimal Nx wiring is enough | `apps/nx-react-vite/` — `nx:run-commands` + `continuous` + `dependsOn` gives "serve a remote, host comes along" UX |
| Angular Native Fed is dynamic-by-default | `apps/angular-native-fed/e2e-dynamic/dynamic.spec.ts` — `federation.manifest.json` loaded at runtime; missing remotes 404 lazily |
| Legacy `@nx/react`/`@nx/angular` MF gotchas | `apps/nx-react/`, `apps/nx-angular/` document the rough edges: TS-refs conflict, typecheck d.ts polluting dist, hyphen-restricted project names, host-via-rspack-plugin static-serve bug |

---

## Confirmed decisions

1. **Rspack is a first-class bundler in v23.** Same generator surface as Vite and Rsbuild; the only difference is the bundler config file (which is the more verbose of the three). Use this repo's `apps/react-rspack/host/rspack.config.ts` as the template.
2. **Generator names are `consumer` and `provider`.** `host` and `remote` are removed in v24, then re-added as **aliases** that forward to `consumer` and `provider`. Aliasing happens AFTER removal — so v24 will briefly have only the new names, and `host` / `remote` aliases land in a follow-up minor.
3. **No automated migration generator in v23.** Users on the deprecated generators have substantially different setups (executors, host orchestration, etc.) — auto-migration is too brittle. Ship a **migration guide** in the v23 docs that walks through the changes manually, plus an **AI prompt** users can paste into Cursor / Claude Code / Copilot to do the rewrite. The prompt is the deliverable, not a codemod.
4. **Default bundler is Vite.** `nx g @nx/module-federation:consumer my-app` with no `--bundler` flag generates a Vite project.
5. **AI-hint comments are inline in `App.tsx`.** The generated file contains the routing-integration snippets as comments next to the federated component. No separate `routing-recipes.md`. Docs page mirrors the same snippets.
6. **No `--ssr` flag in v23.** SSR isn't first-classed in the new generators. The docs page includes a "doing this yourself" section that links to module-federation.io's SSR guidance for users who need it.

---

## Suggested implementation order for the agent

1. Land the deprecation warnings in v23 on the existing generators/executors. No behavior change yet.
2. Implement `consumer` and `provider` generators for **Vite first** (the default bundler, smallest config surface).
3. Replicate for **Rsbuild**, then **Rspack**. They share most of the federation plugin code; the bundler config files are the diff. Rspack config is the most verbose.
4. Write the docs page (the `@nx/module-federation` page on nx.dev), including the migration guide and the paste-into-AI prompt.
5. Cut the v23 release.
6. v24: remove the deprecated surfaces. No code changes to the new generators expected.
7. v24.x (follow-up minor, not blocking): re-add `host` and `remote` as aliases that forward to `consumer` and `provider` for muscle-memory compat.
