# Nx Astro-Docs Staleness Audit — 2026-06-11

**Nx version at audit time:** 23.0.0-beta.25  
**Node.js EOL context:** Node 20 went EOL 2026-04-25; Node 18 went EOL 2025-04-30  
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (501 files)

---

## 1. Stale by Old Node / Package Version

### Node 20 (EOL since 2026-04-25) in Tutorial Requirements

All three flagship getting-started tutorials require `Node.js v20.19 or later`. Node 20 is now EOL; should be updated to Node 22 or Node 24.

| File | Stale line |
|------|-----------|
| `getting-started/Tutorials/react-monorepo-tutorial.mdoc:21` | `"This tutorial requires Node.js (v20.19 or later)"` |
| `getting-started/Tutorials/angular-monorepo-tutorial.mdoc:21` | `"This tutorial requires Node.js (v20.19 or later)"` |
| `getting-started/Tutorials/typescript-packages-tutorial.mdoc:21` | `"This tutorial requires Node.js (v20.19 or later)"` |

### Node 20 / Node 18 in CI Configuration Code Examples

These appear as copy-pasteable CI YAML snippets and Docker images — readers will use them verbatim.

| File | Stale snippet |
|------|--------------|
| `features/CI Features/split-e2e-tasks.mdoc:464` | `node-version: 20` |
| `features/CI Features/distribute-task-execution.mdoc:66` | `node-version: 20` |
| `reference/Nx Cloud/assignment-rules.mdoc:371,399` | `node-version: 20` (two occurrences) |
| `guides/Nx Release/publish-in-ci-cd.mdoc:157,235,391` | `node-version: 20` (three occurrences) |
| `guides/Adopting Nx/adding-to-monorepo.mdoc:390` | `node-version: 20` |
| `guides/Adopting Nx/adding-to-existing-project.mdoc:372` | `node-version: 20` |
| `guides/Nx Cloud/setup-ci.mdoc:63,143,324` | `node-version: 20` and `image: node:20` (three occurrences) |
| `guides/Nx Cloud/bring-your-own-compute.mdoc:56,98,297` | `node-version: 20` and `image: node:20` |
| `guides/Nx Cloud/bring-your-own-compute.mdoc:354` | `image: node:18` ← also Node 18 which is EOL since April 2025 |

### Node 16 tsconfig Reference in Plugin Authoring Docs

Both plugin developer guides say Nx "uses the recommended tsconfig for node 16 for other compiler options" and link to `https://github.com/tsconfig/bases/blob/main/bases/node16.json`. Node 16 went EOL September 2023; this should reference at minimum node20 or node22.

| File | Stale line |
|------|-----------|
| `extending-nx/local-generators.mdoc:116` | `"uses the recommended tsconfig for node 16 for other compiler options"` |
| `extending-nx/local-executors.mdoc:145` | Same text |

### Node 18 Esbuild Build Target

| File | Stale snippet |
|------|--------------|
| `technologies/node/Guides/bundling-node-projects.mdoc:113` | `target: 'node18'` in esbuild config example |

While `node18` here is an esbuild transpilation target (not a runtime requirement), it still signals to readers they should target an EOL version. Should be updated to `node22` or `node24`.

### Very Old Example Versions in CLI Docs

| File | Stale snippet |
|------|--------------|
| `guides/Tips-n-Tricks/advanced-update.mdoc:201` | `nx migrate --to="jest@22.0.0,cypress@3.4.0"` — jest 22 is from 2017; cypress 3.4.0 is from 2019. These are illustrative examples but look extremely dated. Current jest is 29.x/30.x, cypress is 13.x/14.x. |

---

## 2. Stale by Old Nx Version

### Minimum Version: Nx 19.6 (4 major versions behind)

| File | Stale text |
|------|-----------|
| `guides/Tasks & Caching/convert-to-inferred.mdoc:20` | `"At minimum, you should be on Nx version 19.6."` — we're on 23.0; this minimum should be raised to 22+ at least, or just removed. |

### "Requires Nx 15.3" aside (8 major versions behind)

| File | Stale text |
|------|-----------|
| `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc:17` | `{% aside type="note" title="Requires Nx 15.3" %}` — Nx 15 nested-projects support is baseline for all current workspaces; the aside adds noise. |

### "Available since Nx 16.6.0 / 16.5 / 16.8" historical notes

These are fine to keep if they're in a changelog, but they appear inline in regular guides, which adds clutter and no practical value to users on Nx 23.

| File | Stale text |
|------|-----------|
| `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc:9` | `{% aside type="tip" title="Available since Nx 16.6.0" %}` |
| `technologies/typescript/Guides/define-secondary-entrypoints.mdoc:36` | `"as of Nx 16.8, you can specify the additionalEntryPoints..."` |
| `extending-nx/create-install-package.mdoc:24` | `"Starting with Nx 16.5 you can now have such a create-{x} package"` |

### "In Nx 17 and higher" caching caveats (6 major versions behind)

These were originally written to distinguish old behavior from Nx 17's new approach. On Nx 23 the caveats are dead weight — every reader is already on 17+.

| File | Stale text |
|------|-----------|
| `reference/nx-json.mdoc:378` | `"In Nx 17 and higher, caching is configured by specifying "cache": true..."` |
| `reference/project-configuration.mdoc:212` | Same caveat |
| `extending-nx/project-graph-plugins.mdoc:368` | `"This functionality is available in Nx 17 or higher."` |

### `@nrwl/workspace` Package Reference

The `@nrwl` scope was deprecated in favour of `@nx` in Nx 16 and removed in Nx 18+. A doc still shows it as a valid example.

| File | Stale text |
|------|-----------|
| `reference/nx-console-settings.mdoc:225,244` | `"@nrwl/workspace:library"` — should be `@nx/workspace:library` |

---

## 3. Features / Options That May Not Match Codebase

### Angular Module Federation Deprecation Notice

| File | Note |
|------|------|
| `technologies/module-federation/consumer-and-provider.mdoc:136` | States: `"Angular Module Federation in Nx is no longer supported. Use @angular-architects/native-federation for the supported Angular path going forward."` — this is accurate, but the docs page itself still shows Module Federation code for Angular. Check whether this page should be redirected or removed entirely given the deprecation in v23 / removal planned for v24. |

---

## Needs Input

1. **Nx Cloud launch-templates.mdoc** — The file contains a full changelog of image version history (lines 97–109). Entries like `ubuntu22.04-node20.11-v5` through `ubuntu22.04-node20.19-v3` are historical records, not recommendations. Are these changelog entries intended to be preserved long-term, or should they be pruned to only show the current/default image?

2. **launch-template-examples.mdoc:209** — `"This step ... requires the minimum image version to be ubuntu22.04-node20.11-v9 or later."` — the step itself is fine since `ubuntu22.04-node24.14-v1` satisfies that minimum, but the written minimum is confusing. Should this be updated to reference a more recent baseline minimum?

3. **`extending-nx/local-generators.mdoc` + `local-executors.mdoc`** — The Node 16 tsconfig reference is technically about the TypeScript compiler target Nx uses internally (not what the user's project targets), so it may be accurate if the Nx codebase itself hasn't updated its tsconfig base. Verify against `packages/nx/tsconfig*.json` to confirm whether node 16 target is still actually in use internally.

4. **`guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc`** — The "Requires Nx 15.3" aside describes nested projects. Nested projects existed and were later deprecated/changed in behavior in newer Nx versions. Verify whether this guide still works as described in Nx 23 before just removing the aside — the whole page may need a refresh.

5. **`technologies/angular/Guides/nx-and-angular.mdoc:214`** — `"The command was introduced in Nx 17.3.0. If you're using an older version, you can instead run:"` — the fallback command pattern is historical dead weight. But worth confirming that the suggested fallback command has actually been removed before stripping the note.

---

## Summary by Priority

| Priority | Count | Description |
|----------|-------|-------------|
| High | 3 | Tutorial Node.js minimum version (readers set up new projects with EOL Node) |
| High | 9+ files | CI code examples with `node-version: 20` / `node:20` / `node:18` |
| Medium | 2 | Plugin dev guide Node 16 tsconfig reference |
| Medium | 1 | `convert-to-inferred.mdoc` requires Nx 19.6 minimum |
| Medium | 1 | `@nrwl/workspace:library` in nx-console-settings |
| Low | 3 | "Available since Nx 16.x" asides |
| Low | 3 | "In Nx 17 and higher" caveats |
| Low | 1 | `jest@22.0.0 / cypress@3.4.0` example versions |
| Low | 1 | "Requires Nx 15.3" aside |
