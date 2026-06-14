# Nx Astro-Docs Staleness Audit — 2026-06-14

**Nx version at audit time:** 23.x dev branch (packages/nx/package.json shows 0.0.1)
**Node.js EOL context:** Node 20 EOL 2026-04-25; Node 18 EOL 2025-04-30
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/`
**Previous audits:** [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) | [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md)

This audit focuses on **items not covered by previous scans**: stale "will be removed" future-tense notices for past Nx versions, a broken Rust crate recipe, and a doc inconsistency for an env var slated for Nx 24.

---

## 1. Broken Recipe (High Priority)

### `publish-rust-crates.mdoc` — Recipe requires `useLegacyVersioning` which was removed in Nx 22

| File | Lines | Issue |
|------|-------|-------|
| `guides/Nx Release/publish-rust-crates.mdoc` | 12–16, 52 | Recipe requires `useLegacyVersioning: true`, removed in Nx 22 |

The guide's caution aside says:

> "In Nx v22, the legacy versioning implementation has been removed entirely … Importantly, **this recipe currently requires the use of legacy versioning**, because the `@monodon/rust` plugin does not yet provide the necessary `VersionActions` implementation … This will be added in a minor release of Nx v21 and **this recipe will be updated accordingly**."

Neither happened. `useLegacyVersioning` was removed in Nx 22. The recipe still shows `"useLegacyVersioning": true` in the `nx.json` example and this no longer works on any supported Nx version. Users following this guide today will hit a runtime error.

**Fix:** Either update the recipe to use the new `VersionActions` API (requires upstream `@monodon/rust` support), or clearly gate the page as "unsupported until @monodon/rust adds VersionActions" and add a link to the upstream issue.

---

## 2. Stale Future-Tense Language in Deprecated Pages (Medium Priority)

### `v1-nx-plugin-api.mdoc` — "will be removed in Nx 20" (we're on Nx 23)

| File | Line | Stale text |
|------|------|-----------|
| `reference/Deprecated/v1-nx-plugin-api.mdoc` | 11 | `"will be removed in Nx 20. If targeting Nx version 16.7 or higher, please use the v2 API instead."` |

This page is already `sidebar: hidden: true` and labeled deprecated, but the language reads as if Nx 20 hasn't happened yet. Should say "was removed in Nx 20."

### `as-provided-vs-derived.mdoc` — "will be removed in Nx 20" flags already gone

| File | Lines | Stale text |
|------|-------|-----------|
| `reference/Deprecated/as-provided-vs-derived.mdoc` | 93, 110 | `"will be removed in Nx 20"` / `"will not be available in Nx 20"` |

The flags `--project`, `--flat`, `--pascalCaseFiles`, `--pascalCaseDirectory`, `--fileName` are described with future tense as if Nx 20 is upcoming. Should be past tense: "were removed in Nx 20."

**Fix for both:** Update future-tense language to past tense. Low-risk edit since both pages are in the Deprecated section.

---

## 3. Documentation Inconsistency (Low Priority)

### `NX_MIGRATE_SKIP_REGISTRY_FETCH` — "removed in Nx 24" vs "will be removed in Nx 24"

| File | Line | Text |
|------|------|------|
| `reference/environment-variables.mdoc` | 60 | `**Deprecated, will be removed in Nx 24**` |
| `reference/nx-json.mdoc` | 993 | `the deprecated NX_MIGRATE_SKIP_REGISTRY_FETCH (removed in Nx 24)` |

These two pages disagree on tense. The code (`packages/nx/src/command-line/migrate/resolve-package-version.ts:80`) still emits a runtime warning saying "will be removed in Nx 24" and the variable is still supported. The `environment-variables.mdoc` is correct; `nx-json.mdoc` jumped the gun with past tense.

**Fix:** Update `nx-json.mdoc:993` to say "will be removed in Nx 24" to match both the code warning and `environment-variables.mdoc`.

---

## Monitor (Will Become Stale When Nx 24 Ships)

These are currently accurate but need updating on the Nx 24.0 release day.

| File | Lines | What needs updating |
|------|-------|---------------------|
| `technologies/build-tools/vite/Guides/configure-vite.mdoc` | 32, 134 | `nxViteTsPaths()` and `nxCopyAssetsPlugin` — "will be removed in Nx v24." Plugins still exist in `packages/vite/plugins/`. |
| `technologies/module-federation/consumer-and-provider.mdoc` | 126–134 | `@nx/react:host`, `@nx/react:remote`, `@nx/angular:*` generators — "deprecated in v23 and will be removed in v24." |
| `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` | 387 | `composePlugins`, `withNx`, `withWeb`, `withReact` — "will be removed in Nx v24." (Already in Jun 12 audit; repeating here as it's in the same cohort.) |
| `technologies/build-tools/webpack/Guides/webpack-config-setup.mdoc` | 94 | Same helpers. |
| `reference/environment-variables.mdoc` | 60 | `NX_MIGRATE_SKIP_REGISTRY_FETCH` — "will be removed in Nx 24." |

---

## Linear Issues

Attempted to open Linear issues for the Docs team for items 1–3. **Failed**: the Linear MCP server's SSE transport was deprecated and is rejecting all calls (`DEPRECATED TRANSPORT — REMOVAL DATE 2026-04-08`). Issues need to be created manually or after the Linear MCP server config is updated to the new endpoint (`https://mcp.linear.app/mcp`).

Issues to open (Docs team, Triage state, label "Good for AI agents"):

1. **[HIGH] `publish-rust-crates.mdoc` recipe is broken — `useLegacyVersioning` removed in Nx 22** — Guide instructs users to set `useLegacyVersioning: true` in `nx.json` but that option was removed in Nx 22. The page promises a fix "in a minor release of Nx v21" that never landed. Recipe needs update to use `VersionActions` API or explicit "currently unsupported" callout.

2. **[MEDIUM] `v1-nx-plugin-api.mdoc` and `as-provided-vs-derived.mdoc` use future tense for Nx 20 removals** — Both deprecated pages say "will be removed in Nx 20" or "will not be available in Nx 20" when Nx 20 has long since shipped. Simple past-tense fix.

3. **[LOW] `nx-json.mdoc` incorrectly says `NX_MIGRATE_SKIP_REGISTRY_FETCH` was "removed in Nx 24"** — Environment variable is still supported; `environment-variables.mdoc` correctly says "will be removed". Inconsistency fix.

---

## Needs Input

1. **`publish-rust-crates.mdoc`** — Has the `@monodon/rust` package been updated to support `VersionActions`? If so, the recipe should be rewritten to drop `useLegacyVersioning`. If not, should the page be hidden/archived until external support lands?

2. **`as-provided-vs-derived.mdoc`** — The `--nameAndDirectoryFormat` flag is mentioned as the CLI flag to choose between as-provided and derived. Is this flag still present in Nx 23? If it was also removed (since derived mode was dropped entirely), the page needs a larger rewrite, not just a tense fix.

---

## Summary

| Priority | File | Issue |
|----------|------|-------|
| High | `guides/Nx Release/publish-rust-crates.mdoc` | Recipe uses removed `useLegacyVersioning`; broken on Nx 22+ |
| Medium | `reference/Deprecated/v1-nx-plugin-api.mdoc` | "will be removed in Nx 20" — stale future tense |
| Medium | `reference/Deprecated/as-provided-vs-derived.mdoc` | "will be removed in Nx 20" — stale future tense |
| Low | `reference/nx-json.mdoc` | Says env var "removed in Nx 24" when it's still supported |
| Monitor | `configure-vite.mdoc`, `consumer-and-provider.mdoc`, webpack guides | Accurate now but stale on Nx 24.0 release |
