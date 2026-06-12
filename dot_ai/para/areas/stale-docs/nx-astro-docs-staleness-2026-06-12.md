# Nx Astro-Docs Staleness Audit — 2026-06-12

**Nx version at audit time:** ~23.x (packages/nx/package.json shows 0.0.1 in dev, but docs reference Nx 22-23 as current)
**Node.js EOL context:** Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25; Node 16 EOL 2023-09-11
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (498 files)
**Previous audit:** [nx-astro-docs-staleness-2026-06-11.md](./nx-astro-docs-staleness-2026-06-11.md) — most Node/Nx version issues already logged there.

This audit focuses on **items not in the previous scan**: code-vs-docs mismatches and near-future breakage.

---

## 1. Feature / Options Mismatch (Code vs Docs)

### `svgr` Option Documented for `NxReactWebpackPlugin` — Already Removed in Nx 22

`webpack-plugins.mdoc` lines 360–378 document an `svgr` option for `NxReactWebpackPlugin`:

```
Enables or disables React SVGR. Default is `true`.
**Deprecated:** Add SVGR support in your Webpack configuration without relying on Nx.
This option will be removed in Nx 22.
```

**The option was removed.** The actual source at `packages/react/plugins/nx-react-webpack-plugin/nx-react-webpack-plugin.ts` and `lib/apply-react-config.ts` contains no SVGR handling — `applyReactConfig` only adds hot reload. The docs still show the option, example usage (`svgr: false`), and say it "will be" removed when it already was.

Same issue repeated at lines 552–568 for the `withReact` plugin's `svgr` section.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` | 360–378 | `svgr` option documented for `NxReactWebpackPlugin` but option no longer exists in source |
| `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` | 545–568 | Same for `withReact` |

**Fix:** Update language from "will be removed in Nx 22" → "was removed in Nx 22". Remove the option documentation and `svgr: false` examples, or replace with a note pointing to manual SVGR configuration.

---

### `composePlugins` / `withNx` / `withReact` — "Will Be Removed in Nx v24"

`webpack-plugins.mdoc` line 387:
> The `composePlugins`, `withNx`, `withWeb`, and `withReact` helpers below are deprecated and **will be removed in Nx v24**. They produce a non-standard config function that only runs under the `@nx/webpack:webpack` executor. They still work in v23, but using them logs a deprecation warning.

These helpers do still exist in source (`packages/webpack/src/utils/config.ts` exports `composePlugins`; `packages/react/plugins/with-react.ts` exports `withReact`). The deprecation framing is accurate for now, but this page will need updating the moment Nx 24 ships. Flag for follow-up when Nx 24 is released.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` | 386–387, 395–412 | Deprecation notice is "will be removed in Nx v24" — accurate today, becomes stale on Nx 24.0 release |

---

## 2. Stale Version References (Not in Previous Audit)

### "Starting with Nx 15.7" YouTube Linkcard

| File | Line | Stale content |
|------|------|---------------|
| `technologies/node/Guides/node-server-fly-io.mdoc` | 25 | `{% linkcard description="Starting with Nx 15.7 we now have first-class support for building Node backend applications" href="https://youtu.be/K4f-fMuAoRY" %}` |

Node backend support in Nx has been standard for 8 major versions. The linkcard's copy reads like a 2022 launch announcement. Should either be removed or reworded to not reference Nx 15.7.

---

## Items Investigated and Cleared

These patterns were flagged by initial grep but are **not actually stale** after code verification:

| Pattern | Outcome |
|---------|---------|
| `--skip-nx-cache` in caching guide | Flag still exists and is not deprecated (`packages/nx/src/command-line/yargs-utils/shared-options.ts:127`). Valid. |
| `generatePackageJson: false` in `bundling-node-projects.mdoc` | This sets the option to `false` (don't generate package.json, because all deps are bundled). Different from the deprecated `true` approach (replaced by prune workflow in Nx 20+). Valid. |
| Angular version matrix text referencing "Nx v15.7.0" | Located in an `{% aside %}` explaining the historical origin of multi-Angular-version support. Acceptable historical context in a reference matrix page. |
| `@nrwl/workspace:library` in `nx-console-settings.mdoc` | **Already logged in the 2026-06-11 audit** — lines 225, 244. |

---

## Needs Input

1. **`webpack-plugins.mdoc` SVGR sections for `withReact`** — The `withReact` function itself is deprecated (removed in Nx 24), so should the svgr documentation be removed entirely, or rewritten to say "this applied to the now-deprecated `withReact` API"? Depends on whether anyone is still on the `withReact` path in Nx 22–23.

2. **Node 18 Vite build target in `bundling-node-projects.mdoc:113`** — The previous audit flagged this as "Node 18 esbuild" but it's actually in the **Vite** config tab (`target: 'node18'`). This is a Vite/Rollup transpilation target, not a runtime constraint. Still stale (Node 18 EOL), but the fix requires picking the right target (`node20`, `node22`). What's the minimum Node target Nx should recommend for new projects in 2026?

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| High | 1 | `svgr` option documented for `NxReactWebpackPlugin` but removed from source in Nx 22 |
| Medium | 1 | `withReact` svgr docs (deprecated API, also stale) |
| Low | 1 | "Starting with Nx 15.7" linkcard copy in fly.io guide |
| Monitor | 1 | `composePlugins`/`withNx`/`withReact` deprecation note needs updating when Nx 24 ships |
