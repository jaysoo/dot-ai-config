# Nx Astro Docs Staleness Audit — 2026-07-24

**Scope note:** targeted 3-smell pass (same scope as 2026-07-10), run via three parallel scan agents covering disjoint sections of `astro-docs/src/content/docs/**/*.mdoc` (480 files total): (1) `getting-started/`, `technologies/`, `guides/`, `concepts/`; (2) `features/`, `platform-features/`, `enterprise/`, `how-nx-works/`, `extending-nx/`, `kb/`; (3) `reference/` (excluding `Deprecated/`, which is intentionally historical) plus a hand-written-option-table vs. `packages/*/schema.json` drift check. This is **not** a full re-sweep against the 2026-06-29 exhaustive audit's backlog — treat that backlog (26 items) plus the 07-10 addition (item 27) as still authoritative for everything not re-touched here.

**Baselines used (verified live from this repo, not training data):**
- Nx: `package.json` devDependency `nx` = **23.2.0-beta.2** → current major **23**. "More than 2 majors back" = Nx ≤ 20.
- Node: Node 18 and Node 20 are both EOL (Node 20 LTS ended April 2026, per Node release schedule). Current supported = Node 22/24.
- React: `packages/react/package.json` peerDependencies `react: ">=18.0.0 <20.0.0"` → React 16/17 are stale examples.
- Angular: `pnpm-workspace.yaml` catalog `angular-supported-versions` = `>= 20.0.0 < 23.0.0` → Angular ≤19 stale.
- Next.js: `packages/next/package.json` peerDependencies `next: ">=14.0.0 <17.0.0"` → Next ≤13 stale.

---

## Summary

| Category | Confirmed (new) | Confirmed (re-verified, still open) | Needs Input |
|---|---|---|---|
| Old Nx version reference presented as current | 2 | 0 | 0 |
| Old Node/npm/framework version presented as current | 0 | 1 (= prior item #16) | 0 |
| Mismatched CLI/feature vs. source (`packages/*/schema.json`) | 5 | 0 | 2 |
| **Total** | **7** | **1** | **2** |

---

## Confirmed Findings (new this cycle)

### N-1 — `reference/releases.mdoc`: "Supported versions" table is one major stale
**File:** `astro-docs/src/content/docs/reference/releases.mdoc` (lines 30–38)
**Category:** old-nx-version
**Issue:** The table still lists `v22` as `Current` and has no row for `v23` at all:
```
| Version | Support Type | Release Date |
| :-----: | :----------: | :----------: |
|   v22   |   Current    |  2025-10-22  |
|   v21   |     LTS      |  2025-05-05  |
|   v20   |     LTS      |  2024-10-06  |
```
Per the page's own stated support policy (12 months LTS after the next major ships, 18 months total), v20 (released 2024-10-06) should already have rolled off support by July 2026 — it's shown as still-LTS. This is the clearest "old version presented as current" finding this cycle.
**Suggested fix:** add a `v23 — Current` row, move `v22` to LTS, and drop `v20` per the page's own policy (or confirm the policy table is meant to be manually maintained and wire up automation).

### N-2 — `reference/nx-json.mdoc`: self-contradictory removal version for legacy `releaseTag*` properties
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc`
**Category:** old-nx-version / internal-consistency
**Issue:**
- Line 13: "Release tag configuration now uses a nested `releaseTag` object... **Old properties work until Nx 23.**"
- Line 582: "The legacy flat properties (`releaseTagPattern`, ...) **were removed in Nx 23**."
Current version is 23, so line 13 reads as "still functional on the version you're running," directly contradicting line 582's "already removed." One of the two needs to change — most likely line 13 should say "until Nx 22" / "removed in Nx 23."
**Suggested fix:** align line 13 with line 582.

### N-3 — `technologies/react/next/introduction.mdoc`: undocumented deprecation + missing options
**File:** `astro-docs/src/content/docs/technologies/react/next/introduction.mdoc` (plugin-options table, ~line 170–175)
**Category:** mismatched-feature (docs vs. `packages/next/src/plugins/plugin.ts`)
**Issue:** Two drifts on the same page:
1. `serveStaticTargetName` is documented as a normal, current option ("Name of the static export serve task") with no deprecation note, but source (`plugin.ts` line 33–36) marks it `@deprecated Use startTargetName instead.`
2. `buildDepsTargetName` / `watchDepsTargetName` options exist in source (`plugin.ts` line 37–38) but are entirely absent from the doc's option table/examples. (Same omission also found on the Storybook, Webpack, and Expo introduction pages — see N-7.)
**Suggested fix:** add a deprecation note to `serveStaticTargetName` pointing at `startTargetName`; add the two missing options to the table.

### N-4 — `technologies/test-tools/storybook/introduction.mdoc`: invalid enum value + option-name typo
**File:** `astro-docs/src/content/docs/technologies/test-tools/storybook/introduction.mdoc`
**Category:** mismatched-feature (docs vs. `packages/storybook/src/generators/configuration/schema.json`, `packages/storybook/src/plugins/plugin.ts`)
**Issue:** Two drifts on the same page:
1. Line ~116–127: the `uiFramework` enum list includes `@storybook/vue-vite`. The actual generator schema's enum only contains `@storybook/vue3-vite` — a reader picking the documented value would fail generator validation.
2. Line ~76: prose refers to `builtStorybookTargetName` (typo). The real option — shown correctly two lines earlier in the same page's JSON code block, and in `plugin.ts` — is `buildStorybookTargetName`. Anyone searching the schema for `builtStorybookTargetName` will not find it.
Also missing `buildDepsTargetName`/`watchDepsTargetName` (see N-7).
**Suggested fix:** remove `@storybook/vue-vite` from the enum list (or replace with `@storybook/vue3-vite` if that's what was meant); fix the typo to `buildStorybookTargetName`.

### N-5 — `technologies/react/react-native/introduction.mdoc`: two undocumented inferred-target options
**File:** `astro-docs/src/content/docs/technologies/react/react-native/introduction.mdoc` (plugin-options table, ~line 87–100)
**Category:** mismatched-feature (docs vs. `packages/react-native/plugins/plugin.ts` lines 26–36)
**Issue:** `syncDepsTargetName` (default `sync-deps`) and `upgradeTargetName` (default `upgrade`) both produce real inferred targets but appear nowhere in the doc's option list or target-name prose.
**Suggested fix:** add both options to the table.

### N-6 — `reference/Nx Cloud` and technologies pages: (superseded — see N-3/N-4)

### N-7 — Recurring omission: `buildDepsTargetName`/`watchDepsTargetName` missing across 4 plugin-introduction pages
**Files:**
- `technologies/build-tools/webpack/introduction.mdoc` (schema: `packages/webpack/src/plugins/plugin.ts` lines 38–39)
- `technologies/react/next/introduction.mdoc` (schema: `packages/next/src/plugins/plugin.ts` lines 37–38) — also tracked under N-3
- `technologies/test-tools/storybook/introduction.mdoc` (schema: `packages/storybook/src/plugins/plugin.ts` lines 34–35) — also tracked under N-4
- `technologies/react/expo/introduction.mdoc` (schema: `packages/expo/plugins/plugin.ts` lines 37–38)

**Category:** mismatched-feature
**Issue:** The parallel `technologies/build-tools/vite/introduction.mdoc` and `technologies/build-tools/rspack/introduction.mdoc` pages *do* document these two options — the omission on these four pages looks like an inconsistency, not an intentional simplification.
**Judgment call:** these are lower-visibility, opt-in options (task-graph dependency ordering only), so severity is Low; flagging for docs-team discretion rather than asserting it's high priority.

---

## Confirmed Findings (re-verified, still open from prior audits)

### R-1 — `kb/bundling-node-projects.mdoc`: Vite bundling example targets EOL Node 18 (= prior backlog item #16)
**File:** `astro-docs/src/content/docs/kb/bundling-node-projects.mdoc` (line 115, "Vite" tab)
**Category:** old-node-version
**Issue:** `build: { target: 'node18' }` is presented as the current recommended Vite `build.target` for bundling a Node.js app for deployment. Node 18 is EOL. Independently re-found this cycle by a fresh scan agent with no knowledge of the prior audit — corroborates it's still unfixed.
**Suggested fix:** bump to `node22` or `node24`.

---

## Needs Input

### NI-1 — `kb/browser-support.mdoc`: "ships a `.browserslistrc` by default" claim may be stale
**File:** `astro-docs/src/content/docs/kb/browser-support.mdoc` (lines 9–23)
**Why uncertain:** doesn't cleanly match the three defined staleness categories (Nx/Node/framework version), so not counted as confirmed. But checked current `@nx/react`, `@nx/web`, `@nx/js`, `@nx/angular` generators and found none that scaffold a `.browserslistrc` file by default anymore — only webpack/rspack plugins that *read* one if present, and an Angular migrator that *moves* an existing one. If no generator creates this file by default anymore, the page's core claim is out of date. Needs a docs-team call on whether this still holds or needs a broader rewrite.

### NI-2 — `kb/cypress-v11-migration.mdoc`: migration guide for a very old Cypress version
**File:** `astro-docs/src/content/docs/kb/cypress-v11-migration.mdoc`
**Why uncertain:** Cypress is now far past v11, and the page reads like current guidance (no "as of Nx X.Y" qualifier). But it documents a specific migration generator (`nx g @nx/cypress:migrate-to-cypress-11`) that may still exist and be relevant for workspaces stuck on old Cypress versions — a legitimate narrow-purpose migration doc, not necessarily "stale." Needs a human call on whether the generator/doc should be archived or is still in active use.

---

## Linear Issues to Create (queued — MCP unavailable this cycle too)

**Linear connector status this cycle:** `ListConnectors` shows the Linear connector installed (`directoryUuid: fa50c30c-...`) but **`enabledInChat: false`** — a *third* distinct symptom across consecutive audits (06-17: "SSE transport removed"; 07-10: `enabledInChat: true` but zero tools exposed via `ToolSearch`; 07-24 today: connector explicitly reports disabled for this chat). This is the **7th consecutive audit cycle** (06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-24) where Linear issue creation could not be completed programmatically, with a different failure mode almost every time — strong signal this needs a human to check the connector's auth/chat-enablement state directly in claude.ai settings rather than continuing to retry per-audit.

Items 1–27 are carried forward unchanged from the [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) and [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) audits (still unfixed; item 16 re-verified independently this cycle — see R-1 above). Items 28–32 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1–15, 17–27 | *(unchanged — see [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md) for full text)* | — | — |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` Vite target (**re-verified 2026-07-24, still open**) | Medium | 1 file |
| **28** | **Fix reference/releases.mdoc: "Supported versions" table one major stale (v22 shown as Current, v23 missing, v20 should have rolled off LTS)** | **High** | **1 file** |
| **29** | **Fix reference/nx-json.mdoc: contradictory statement on when legacy `releaseTag*` flat properties were removed (line 13 vs. line 582)** | **Medium** | **1 file** |
| **30** | **Fix technologies/react/next/introduction.mdoc: `serveStaticTargetName` deprecation undocumented; `buildDepsTargetName`/`watchDepsTargetName` missing** | **Medium** | **1 file** |
| **31** | **Fix technologies/test-tools/storybook/introduction.mdoc: invalid `uiFramework` enum value `@storybook/vue-vite`, typo `builtStorybookTargetName` → `buildStorybookTargetName`, missing `buildDepsTargetName`/`watchDepsTargetName`** | **Medium** | **1 file** |
| **32** | **Fix technologies/react/react-native/introduction.mdoc: undocumented `syncDepsTargetName`/`upgradeTargetName` options** | **Medium** | **1 file** |
| **33** | **Document missing `buildDepsTargetName`/`watchDepsTargetName` on technologies/build-tools/webpack/introduction.mdoc and technologies/react/expo/introduction.mdoc (same pattern as #30/#31)** | **Low** | **2 files** |

All new issues (28–33) should be filed for the **Docs** team, in **Triage**, labeled **"Good for AI agents"**, assigned to the **Linear agent** if available (unassigned otherwise) — per standing instructions, once Linear access is restored.

## Recurring Checks to Run

(unchanged — see [README.md](./README.md))
