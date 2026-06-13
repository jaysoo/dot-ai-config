# Nx Astro-Docs Staleness Audit — 2026-06-13

**Nx version at audit time:** 23.x (highest migration: `update-23-0-0` across packages)
**Node.js EOL context:** Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25
**Cypress peer deps in Nx:** `>= 13 < 16`
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (499 files)
**Previous audits:** [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md), [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md)

This audit focuses on items **not previously documented**. Items already in prior audits are not duplicated here.

---

## Linear Issue Creation Status

**Blocked.** The Linear MCP SSE transport is fully disabled (removal date was 2026-04-08; we're past it). All `mcp__Linear__*` tool calls return `"Tool call rejected as a pre-removal deprecation signal."` Issues must be filed manually or after the MCP server is migrated to the new endpoint (`https://mcp.linear.app/mcp`).

Issues to file for the **Docs** team in triage, labeled "Good for AI agents":

---

## New Findings

### 1. Cypress v11 Migration Guide — Actively Misleading on Nx 23

**Priority: HIGH**

| File | Note |
|------|------|
| `technologies/test-tools/cypress/Guides/cypress-v11-migration.mdoc` | Entire page is stale — documents migrating from Cypress v8/v9 to v11. Current Nx peerDeps require Cypress `>= 13 < 16`. |

**Why it's stale:**
The guide instructs users to run:
```shell
nx g @nx/cypress:migrate-to-cypress-11
```

The generator source (`packages/cypress/src/generators/migrate-to-cypress-11/migration-to-cypress-11.ts`) asserts minimum Cypress 8 (`assertMinimumCypressVersion(8)`) and then sets `devDependencies['cypress'] = '^11.2.0'`. On Nx 23, the minimum supported Cypress is v13. Running this generator would **downgrade** an existing v13 project to v11, which is incompatible with the Nx Cypress peerDeps range.

No newer migration guides exist in the docs for v12 → v13 or later. The stale page creates a risk: users encountering Cypress problems may find this guide and run the generator on an already-supported v13/v14 workspace.

**Fix options:**
- Archive the page in `reference/Deprecated/` and add a note pointing to the Storybook-style upgrade docs (or the Cypress CLI `npx storybook@latest upgrade`).
- Or update the page to document the current upgrade path for v13/v14.

**Suggested Linear issue title:** `[Docs] Cypress v11 migration guide is incompatible with current Nx (Cypress v13+ required)`

---

### 2. Nx Cloud config.mdoc — "Nx < 17" and "Nx <= 19.6" Legacy Tabs

**Priority: MEDIUM**

| File | Lines | Stale content |
|------|-------|---------------|
| `reference/Nx Cloud/config.mdoc` | 54–76 | `{% tabitem label="Nx < 17" %}` — shows the old `tasksRunnerOptions` / `runner: "nx-cloud"` config. Nx 17 is 6 major versions behind. |
| `reference/Nx Cloud/config.mdoc` | 10–45 | `{% tabitem label="Nx <= 19.6" %}` — shows the legacy `nx-cloud` npm package approach. Nx 19.6 is 4 major versions behind. |
| `reference/Nx Cloud/config.mdoc` | 158 | `"You must be on version 16.0.4 or later of nx-cloud or @nrwl/nx-cloud for this value to be respected."` — references an ancient package version in an explanation of `neverConnectToCloud`. Nobody landing on this page today would be on `nx-cloud@16`. |

**Why it's stale:**
The "Nx < 17" tab in the access-token section shows:
```json
"tasksRunnerOptions": {
  "default": {
    "runner": "nx-cloud",
    "options": { "accessToken": "SOMETOKEN" }
  }
}
```
This is a 2022-era configuration that was replaced by `nxCloudAccessToken` in Nx 17. Anyone reading the docs in 2026 who is on Nx < 17 is on an unsupported version with security vulnerabilities; the tab provides false legitimacy to staying on very old Nx.

Similarly, the `neverConnectToCloud` section points to `nx-cloud@16.0.4` as a minimum, but the `@nrwl/nx-cloud` package has been replaced by native Nx Cloud support since Nx 19.7. The version anchor is meaningless context to any current user.

**Fix:** Remove the "Nx < 17" and "Nx <= 19.6" tab variants; keep only the current approach. Update or remove the `nx-cloud@16.0.4` minimum note (it applies only to the fully deprecated `@nrwl/nx-cloud` package).

**Suggested Linear issue title:** `[Docs] Nx Cloud config.mdoc has stale "Nx < 17" and "Nx <= 19.6" legacy tabs`

---

### 3. configure-vite.mdoc — Deprecation Notices Expire on Nx 24

**Priority: MEDIUM** *(promoted from "Monitor" in 2026-06-12 audit)*

| File | Lines | Stale content |
|------|-------|---------------|
| `technologies/build-tools/vite/Guides/configure-vite.mdoc` | 31–32 | `` `nxViteTsPaths()` is deprecated and **will be removed in Nx v24** `` |
| `technologies/build-tools/vite/Guides/configure-vite.mdoc` | 133–134 | `` `nxCopyAssetsPlugin` is deprecated and **will be removed in Nx v24** `` |

**Why it needs tracking:**
Both plugins still exist in source (confirmed: `packages/vite/plugins/nx-tsconfig-paths.plugin.ts` and `packages/vite/plugins/nx-copy-assets.plugin.ts`). Their source annotations say `@deprecated Will be removed in Nx v24`. These are technically accurate on Nx 23, but the docs will be wrong the moment Nx 24 ships and the plugins are removed. This should be updated to past tense ("was removed") immediately after Nx 24.0 release.

**Suggested Linear issue title:** `[Docs] Update nxViteTsPaths/nxCopyAssetsPlugin deprecation notice from "will be removed in Nx v24" to past tense when Nx 24 ships`

---

### 4. application-proxies.mdoc — "Prior to Nx version 18" Prose in a Live Guide

**Priority: LOW**

| File | Lines | Stale content |
|------|-------|---------------|
| `technologies/node/Guides/application-proxies.mdoc` | 96–104 | `"Using --frontendProject is meant for Nx prior to version 18."` and `"Prior to Nx version 18, projects use executors..."` |

**Why it's stale:**
The page is not in a Deprecated section, but it explains the old `--frontendProject` flag as background context. Nx 18 is 5 major versions behind. Anyone on Nx 18 is on an unsupported version. The "Prior to Nx 18" prose adds historical noise to a live guide without helping current users. Either the page should be updated to remove the historical caveats or moved to a Deprecated/migration context.

**Suggested Linear issue title:** `[Docs] application-proxies.mdoc contains "Prior to Nx 18" prose that should be removed or archived`

---

### 5. sync-generators.mdoc and flat-config.mdoc — "Since Nx 16/19" Historical Asides

**Priority: LOW** *(same pattern as 2026-06-11 findings for Nx 16/17 asides, but different files)*

| File | Line | Stale text |
|------|------|-----------|
| `concepts/sync-generators.mdoc` | 9 | `"In Nx 19.8, you can use sync generators..."` |
| `technologies/eslint/Guides/flat-config.mdoc` | 168 | `"Since version 16.8.0, Nx supports the usage of flat config..."` |

Both are "since version X" historical markers that add noise. Sync generators have been available for 4+ major versions; flat config support for 7+. Neither note helps a reader on Nx 23.

**Suggested Linear issue title:** `[Docs] Remove "Since Nx 16.8 / 19.8" historical version markers from sync-generators and flat-config guides`

---

## Items Investigated and Cleared

| Pattern | Outcome |
|---------|---------|
| `--template=nrwl/react-template` in tutorials/intro pages | NOT stale. `create-nx-workspace` now uses `--template` as the primary flag (see `packages/create-nx-workspace/bin/create-nx-workspace.ts:292`). `--preset` maps to `--template` internally. The `nrwl/<name>-template` GitHub repo format is the current documented form. |
| `nxViteTsPaths` / `nxCopyAssetsPlugin` files in source | Still present at `packages/vite/plugins/`. The source is decorated `@deprecated` but not deleted. Docs accurately say "will be removed in Nx v24" (accurate for Nx 23). |
| `@nrwl/workspace:library` in nx-console-settings (lines 225, 244) | Already documented in 2026-06-11 audit. Not duplicated here. |
| Angular 13/14 references in version matrix | Historical records in a compatibility matrix — appropriate to keep. |
| Cypress component testing "requires Cypress v10 and above" | Technically correct (v13 ≥ v10). Not stale. |
| Storybook webpack5 builder references | Storybook 8+ still supports webpack5 builder. Not stale. |

---

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| HIGH | 1 | Cypress v11 migration guide — actively misleading on Nx 23, generator would downgrade v13 users |
| MEDIUM | 2 | Nx Cloud config legacy tabs (Nx < 17, Nx <= 19.6); Vite deprecation notices expiring on Nx 24 |
| LOW | 2 | "Prior to Nx 18" prose in application-proxies; "Since Nx 16.8/19.8" markers in two guides |

---

## Needs Input

1. **Cypress v11 migration guide** — Should it be fully removed, archived to Deprecated, or updated with a new migration path for v13/v14? There is no Cypress v13/v14 migration guide in the docs at all; it's possible there never needs to be one since Nx handles Cypress upgrades automatically via `nx migrate`.

2. **Linear MCP transport** — The SSE transport used by this session's Linear MCP tools is past its removal date (2026-04-08). All `mcp__Linear__*` calls are rejected. The Linear issues listed in this audit could not be filed automatically. The MCP server needs migration to `https://mcp.linear.app/mcp` before agent-filed issues can resume.
