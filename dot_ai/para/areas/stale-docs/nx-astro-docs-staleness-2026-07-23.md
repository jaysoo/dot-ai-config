# Nx Astro Docs Staleness Audit — 2026-07-23

**Scope note:** targeted 3-agent audit scoped to exactly the three staleness smells for this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator/plugin options that no longer match source. Not a full re-sweep of all 506 `.mdoc` files — treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog as still the authoritative full list for anything not re-touched here.

**Live version verification (per this file's own anti-false-positive rules — no training-data guesses):**
- `npm view nx dist-tags` → `latest: 23.1.0` (published 2026-07-13, 10 days before this audit), `previous: 22.7.7`, `next: 23.2.0-beta.2`. **Nx v23 is now the current stable major** — this is new since the 2026-07-10 audit, which still had v23 in beta.
- Repo's own root `package.json` devDependency: `"nx": "23.2.0-beta.2"` (in-progress next release).
- `npm view node dist-tags` → `latest: 26.5.0`. Node 20 EOL'd April 2026 (per Node release schedule); Node 22 is Maintenance LTS, Node 24 Active LTS.
- These are the authoritative numbers used to judge every finding below.

**Linear MCP unavailable again (7th consecutive cycle).** All issues below are queued for manual creation, merged into the running backlog. See escalation note at the bottom — the failure mode changed again this cycle (see below), which may be a useful clue.

---

## Summary

| Category | Confirmed (new) | Needs Input (new) |
|---|---|---|
| Old Nx version reference | 1 (**high** — canonical releases/support page is now outdated) | 0 new |
| Old Node/npm/framework version | 0 new | 1 new |
| Mismatched CLI/feature vs. source | 4 new | 2 new |
| **Total** | **5** | **3** |

Nothing here duplicates an already-tracked backlog item; where a finding touches a file that's already in the backlog for a *different* reason (e.g. `overview-angular.mdoc`), that's called out explicitly.

---

## Confirmed Findings

### C-28 — `reference/releases.mdoc`: "Supported versions" table is now out of date (**new, high severity**)
**File:** `astro-docs/src/content/docs/reference/releases.mdoc`
**Category:** old-nx-version
**Issue:** The table states:

| Version | Support Type | Release Date |
|:---:|:---:|:---:|
| v22 | Current | 2025-10-22 |
| v21 | LTS | 2025-05-05 |
| v20 | LTS | 2024-10-06 |

But live npm data shows **Nx 23.1.0 shipped 2026-07-13** — v23 is now Current, v22 should have moved to LTS, and v21 should still be LTS. Worse, the page's own stated policy ("Each major version has 18 total months of support from when it is first released to when it falls out of LTS") means **v20 (released 2024-10-06/07) should have fallen out of support around April 2026** — it's still listed as supported LTS three months past that date. This is the canonical version-support-policy page linked from multiple other docs; readers relying on it will think v22 is current and that v20 is still supported.
**Excerpt:** `| v22 | Current | 2025-10-22 |` / `| v20 | LTS | 2024-10-06 |`
**Note:** the 2026-07-10 audit's agents were explicitly told to treat this page as an intentionally-excluded "release schedule reference" (same treatment as a changelog) and skip it — that instruction was wrong. This page is hand-maintained prose, not auto-generated, and needs the same staleness scrutiny as any other page. Recommend removing that blanket exclusion from future audit prompts and instead re-verifying this table's numbers against live npm data every cycle.

### C-29 — `technologies/eslint/eslint-plugin/Guides/enforce-module-boundaries.mdoc`: missing `buildTargets` option (**new**)
**File:** `astro-docs/src/content/docs/technologies/eslint/eslint-plugin/Guides/enforce-module-boundaries.mdoc` (options table, lines ~74–83)
**Category:** mismatched-feature
**Issue:** The rule's options table documents 8 options but omits `buildTargets` (`Array<string>`, default `['build']`). Confirmed present in `packages/eslint-plugin/src/rules/enforce-module-boundaries.ts`: declared in the `Options` type (line 58), in the rule's JSON schema (line 119), in `defaultOptions` (line 204), and actively used to gate the `enforceBuildableLibDependency` check (lines 629–630). No way to discover from docs that you can point this check at build targets other than `build`.

### C-30 — `technologies/build-tools/vite/introduction.mdoc`: missing `compiler` plugin option (**new**)
**File:** `astro-docs/src/content/docs/technologies/build-tools/vite/introduction.mdoc` (Plugin options section, lines ~118–154)
**Category:** mismatched-feature
**Issue:** `VitePluginOptions` in `packages/vite/src/plugins/plugin.ts` (lines 32–51) has a `compiler?: 'tsc' | 'tsgo' | 'vue-tsc'` option controlling which type-checker backs the inferred `typecheck` target (auto-detects `vue-tsc` for Vue projects, else `tsc`; can be forced to `tsgo`). The doc's options table has no mention of this despite a whole sentence about how the `typecheck` target is created.

### C-31 — `technologies/build-tools/vite/introduction.mdoc`: `serveTargetName` deprecation note is incomplete (**new**)
**File:** same page, line ~143
**Category:** mismatched-feature
**Issue:** The doc calls `serveTargetName` "deprecated" but the actual JSDoc in `packages/vite/src/plugins/plugin.ts` (line 35) says `@deprecated Use devTargetName instead. This option will be removed in Nx 22.` Nx is now on stable **23.1.0** — the stated removal version has already passed and the option is still present in source (so either the source's own removal comment is stale, or the removal slipped). Either way the doc doesn't surface the removal timeline at all, so readers have no signal this is actively going away.

### C-32 — `technologies/typescript/introduction.mdoc`: missing several `@nx/js/typescript` plugin options (**new**)
**File:** `astro-docs/src/content/docs/technologies/typescript/introduction.mdoc` (Plugin options table, lines ~352–386)
**Category:** mismatched-feature
**Issue:** `TscPluginOptions` in `packages/js/src/plugins/typescript/plugin.ts` (lines 47–65) declares roughly 9 top-level/sub options; the doc's table (lines ~378–384) covers only `typecheck.targetName`, `build.targetName`, `build.configName`, `build.buildDepsName`, `build.watchDepsName`. Missing: top-level **`compiler`** (`'tsc' | 'tsgo'`), **`verboseOutput`** (`boolean`), **`typecheck.configName`** (`string`), and **`build.skipBuildCheck`** (`boolean`). This is a high-traffic page — the inferred-tasks plugin used by nearly every TS project — so there's currently no documented way to learn about the `tsgo` compiler switch or verbose diagnostics.

### C-33 — `technologies/test-tools/storybook/Guides/overview-angular.mdoc`: sample `project.json` uses legacy Storybook 6-era executors (**new — distinct issue on an already-tracked file**)
**File:** `astro-docs/src/content/docs/technologies/test-tools/storybook/Guides/overview-angular.mdoc` (lines ~162–181)
**Category:** mismatched-feature
**Issue:** The doc's "your `storybook`/`build-storybook` targets will look like this" sample shows `"executor": "@storybook/angular:start-storybook"` and `"executor": "@storybook/angular:build-storybook"`. Current `@nx/storybook` (`packages/storybook/executors.json`) only ships executors named `storybook` (serve) and `build`; the package's own `migrate-8`/`migrate-9` generators exist specifically to convert workspaces *away* from `start-storybook`/`build-storybook`. No sibling framework guide (React/Vue) shows this pattern — only the Angular guide is stale. Note: this file is already in the backlog for two *other* reasons (deprecated `@storybook/testing-library`/`@storybook/jest` imports — item 13; stale doc URL — item 25) — this is a third, independent problem on the same page. Worth fixing all three in one pass.

---

## Needs Input

### NI-9 — `guides/Tips-n-Tricks/yarn-pnp.mdoc`: `packageManager` example may already be behind current Yarn (**new**)
**File:** `astro-docs/src/content/docs/guides/Tips-n-Tricks/yarn-pnp.mdoc` (line ~38)
**Issue:** Shown as the literal output of `yarn set version stable`: `"packageManager": "yarn@3.6.1"`. Today `stable` resolves to Yarn 4.x, so a reader following the steps gets a different value than the example shows. It's illustrating structure rather than mandating 3.6.1, so this reads as a stale example rather than a wrong recommendation — flagging for a docs-team call rather than asserting a hard fix.

### NI-10 — `reference/Nx Cloud/launch-template-examples.mdoc`: Node 21 example (re-confirmed, = prior NI-5/H-12, still open)
Same as previously flagged (2026-06-24, 2026-07-10): `node=21` / `node_version: '21'` in the "Custom node version" section. Node 21 was never LTS and has been EOL since mid-2024. Still unfixed. Not counted as a new finding — carried forward for visibility only.

### NI-11 — Linear connector symptom changed again this cycle
See escalation note below — documenting as "needs input" from a human because the failure signature keeps shifting and is worth investigating directly rather than continuing to route around it per-audit.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**. Items 1–27 carried forward unchanged from the [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) and [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) audits (still unfixed). Items 28–32 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1–27 | *(unchanged — see 2026-07-10 audit for full list)* | — | — |
| **28** | **Update `reference/releases.mdoc` supported-versions table: v23 is current (shipped 2026-07-13), v22 is now LTS, v20 has fallen out of the stated 18-month support window** | **High** | 1 file |
| **29** | **Add missing `buildTargets` option to `enforce-module-boundaries.mdoc` options table** | Medium | 1 file |
| **30** | **Add missing `compiler` option to vite `introduction.mdoc` plugin options, and complete the `serveTargetName` deprecation note with its removal timeline** | Medium | 1 file |
| **31** | **Add missing `compiler`, `verboseOutput`, `typecheck.configName`, `build.skipBuildCheck` options to typescript `introduction.mdoc` plugin options table** | Medium | 1 file |
| **32** | **Fix `overview-angular.mdoc` sample `project.json`: replace legacy `@storybook/angular:start-storybook`/`build-storybook` executors with current `storybook`/`build` executor names** | Medium | 1 file |

**Running backlog total: 32 Linear issues queued, 0 created (Linear MCP has never been available across any of the 7 audit cycles to date).**

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-23) where Linear issue creation could not be completed programmatically, and **the symptom keeps changing**:
- 2026-06-17: "SSE transport removed"
- 2026-07-10: `ListConnectors` reported `enabledInChat: true` but `ToolSearch` returned zero Linear tools for any query
- 2026-07-23 (this cycle): `ListConnectors` now reports the Linear connector as `connected: true` but **`enabledInChat: false`** — a different state than last cycle (it flipped from claiming "enabled in chat" to explicitly "not enabled in chat"). `ToolSearch` still returns zero Linear tools.

Given the failure mode itself is unstable across cycles (not just "still broken" but "broken in a new way each time"), this looks less like a one-time misconfiguration and more like something worth a human checking directly in claude.ai's connector settings for this project/session — specifically confirming whether Linear is toggled on for this project's chats, independent of its org-level connection status.

## Recurring Checks to Run

(unchanged from prior audits — see this folder's `README.md` for the checklist)
