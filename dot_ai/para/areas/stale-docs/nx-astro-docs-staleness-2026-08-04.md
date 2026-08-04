# Nx Astro Docs Staleness Audit — 2026-08-04

**Scope note:** targeted 3-agent audit (same shape as 2026-07-10), scoped to the three staleness smells requested this cycle: (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator options or config that no longer match source. Not a full re-sweep of all 478 `.mdoc` files — treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog as the base full list, layered with everything found since.

Current Nx: **23.1.1** latest published, **23.2.0-beta.4** next/dev (verified live via `npm view nx dist-tags`, per this file's own verification rules). Node dist-tags confirm `v20-lts: 20.11.1` still exists as a tag but Node 20 fell out of Maintenance LTS in **April 2026** — per the Node.js release schedule it is EOL as of today. Node 22 is in Maintenance LTS (until ~2027), Node 24 is Active LTS, Node 26 is on Current track and enters LTS October 2026. `technologies/node/introduction.mdoc`'s compatibility matrix already reflects all of this correctly — checked again this cycle, still fine, not flagged.

**Linear MCP unavailable again** (**7th consecutive audit cycle** — see escalation note at the bottom, now much more specific than prior cycles). All issues below are queued for manual creation, merged into the running backlog from prior audits.

---

## Summary

| Category | Confirmed (new) | Confirmed (re-verified, still open) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 1 (releases.mdoc) | 2 (v1-nx-plugin-api.mdoc, access-tokens.mdoc) | 2 |
| Old Node/npm/framework version | 0 new | 1 (launch-template-examples.mdoc Node 21) | 1 |
| Mismatched CLI/feature vs. source | 3 (ci-deployment.mdoc, storybook uiFramework, nx-json.mdoc) | 0 | 0 |
| **Total** | **4** | **3** | **3** |

---

## Confirmed Findings — New This Cycle

### C-1 — `reference/releases.mdoc`: Supported-versions table is missing Nx 23 entirely
**File:** `astro-docs/src/content/docs/reference/releases.mdoc` (lines 34–38)
**Category:** old-nx-version
**Issue:** The "Supported versions" table lists only v22 (Current, 2025-10-22), v21 (LTS, 2025-05-05), v20 (LTS, 2024-10-06). No v23 row. Nx's own stated policy on the same page is: new majors ship ~April and October, the previous major becomes LTS, and LTS support lasts 18 months. Nx 23 shipped and is already at 23.1.1 (with 23.2.0-beta.4 in dev), so this table is a full major-version behind — it tells a current Nx 23 user that v22 is still "Current" and that v20 (released 2024-10-06, whose 18-month LTS window ended ~April 2026) is still under LTS support. This is the docs team's own canonical reference page for support status, so the drift is high-impact.
**Excerpt:** `| v22 | Current | 2025-10-22 |` / `| v20 | LTS | 2024-10-06 |`
**Suggested fix:** Add a v23 (Current) row, move v22 to LTS, and drop v20 (past its 18-month window) — or explicitly state its support ended.

---

### C-2 — `guides/ci-deployment.mdoc`: stale "in progress" framing for Vite plugin parity
**File:** `astro-docs/src/content/docs/guides/ci-deployment.mdoc` (lines ~200–204)
**Category:** old-nx-version / feature-drift
**Issue:** "We are working on an `NxVitePlugin` plugin for Vite that will have parity with the `NxWebpackPlugin`. Stay tuned for updates." `@nx/vite` is a long-mature, first-party plugin (docs elsewhere confirm support up through Vite `^8.0.0`, with Vitest split into its own plugin as of Nx 22). Telling a reader evaluating production-readiness that Vite parity is still forthcoming is misleading.
**Excerpt:** `We are working on an NxVitePlugin plugin for Vite... Stay tuned for updates.`
**Suggested fix:** Remove or rewrite the aside to reflect current `@nx/vite` capabilities instead of describing them as in-progress.

---

### C-3 — `technologies/test-tools/storybook/introduction.mdoc`: documents an invalid `uiFramework` enum value
**File:** `astro-docs/src/content/docs/technologies/test-tools/storybook/introduction.mdoc` (line 138)
**Category:** mismatched-feature
**Issue:** Lists `@storybook/vue-vite` as a valid value for the `@nx/storybook:configuration` generator's `uiFramework` option. `packages/storybook/src/generators/configuration/schema.json` (lines 53–63) defines exactly 9 valid enum values, and `@storybook/vue-vite` is not one of them — only `@storybook/vue3-vite` is valid. `@storybook/vue-vite` does not appear anywhere in any `@nx/storybook` schema file. A user following the doc could pass a value the generator will reject outright.
**Excerpt:** `@storybook/vue-vite` (listed alongside `@storybook/vue3-vite`)
**Suggested fix:** Remove `@storybook/vue-vite` from the documented list; only `@storybook/vue3-vite` is valid.

---

### C-4 — `reference/nx-json.mdoc`: self-contradictory "Nx 22 Changes" aside about release-tag config
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc` (lines 12–16, contradicted by lines ~582 and ~693 in the same file)
**Category:** mismatched-feature / old-nx-version
**Issue:** Near the top, an "Nx 22 Changes" aside states release tag configuration "now uses a nested `releaseTag` object... Old properties work until Nx 23." Further down, the same document says the legacy flat properties (`releaseTagPattern`, etc.) "were removed in Nx 23" — which matches source: `packages/nx/src/migrations/update-23-0-0/consolidate-release-tag-config.ts` and `packages/nx/src/command-line/release/config/config.ts`, which now hard-errors (`LEGACY_RELEASE_TAG_PATTERN_PROPERTIES_DETECTED`) if the legacy keys are present. The repo is in the v23 dev cycle today. The top-of-page aside contradicts both the rest of the same page and actual current behavior.
**Excerpt:** `Old properties work until Nx 23` (contradicted later in the same doc: `were removed in Nx 23`)
**Suggested fix:** Update the top aside to say the legacy properties were removed in Nx 23 (not "work until"), consistent with the rest of the page.

---

## Confirmed Findings — Re-verified, Still Open From Prior Cycles

### C-5 — `reference/Deprecated/v1-nx-plugin-api.mdoc` still uses future tense for Nx 20 (= prior H-13 / 07-10 C-1)
**File:** line 11. "...will be removed in Nx 20." Current is 23.x; already happened. Unfixed across 3+ cycles now.

### C-6 — `kb/access-tokens.mdoc` still frames a completed transition as "changing" (= prior M-19 / 07-10 C-2)
**File:** lines 278–279. Aside "Nx Cloud authentication is changing" describes a Nx 19.7 change (4 majors behind current). Unfixed across 3+ cycles now.

### C-7 (needs-input carried to confirmed) — `reference/Nx Cloud/launch-template-examples.mdoc` still uses Node 21 as the "custom node version" example (= prior NI-5)
**File:** lines ~195–260 ("Custom node version" section: `node-21` template name, `node=21`, `node_version: '21'`). Node 21 was never LTS, EOL since mid-2024. The base image in the same examples correctly uses `ubuntu22.04-node24.14-v1` — only the illustrative override value is the odd one. Still unfixed; re-verified this cycle. Bumping to "confirmed" this cycle since it's now been open 1+ month with no maintainer response — worth a Linear issue rather than staying in needs-input limbo.

---

## Needs Input

### NI-1 — `kb/terminal-ui.mdoc`: Windows Terminal UI notice may be outdated (re-verified, = prior item 8 from 06-29)
**File:** line 16. "The initial Nx 21 release disables the Terminal UI on Windows. We are currently working on Windows support, so stay tuned." Nx 21 was 2 majors ago; plausible Windows TUI support shipped since, which would make "stay tuned" actively wrong. Could not verify from docs alone whether Windows TUI support landed — needs a maintainer/changelog check, not a docs-only judgment call.

### NI-2 — `getting-started/installation.mdoc`: hardcoded example version is one major behind
**File:** line 56. "You should see a version number like `22.5.0`." Latest published is 23.1.1 — the very first command a brand-new user runs shows an example one major stale. Doesn't meet the "2+ majors behind" bar used elsewhere in this audit, so flagging as low-severity/needs-input rather than a hard violation, but this specific line rots every ~6 months by design (hardcoded real version number in a quickstart). Worth a policy call: replace with a version-agnostic placeholder (e.g. `23.x.x`) instead of a pinned real number.

### NI-3 — Scattered "as of Nx X.Y" attribution footnotes in current (non-deprecated) reference pages (unchanged from prior audits' NI-2/NI-3)
Same set as before: `reference/project-configuration.mdoc` ("Nx 19.5.0+"), `guides/Tasks & Caching/self-hosted-caching.mdoc` ("Nx 20.8+"), `extending-nx/task-running-lifecycle.mdoc` ("since Nx 20.4+"), `technologies/typescript/introduction.mdoc` ("as of Nx 20"), `guides/Tips-n-Tricks/include-all-packagejson.mdoc` ("Nx 15.0.11"), `reference/glossary.mdoc` ("Nx 15.3"). All factually accurate, not phrased as "new/latest," but numerous. Still an open policy question for the docs team: prune version footnotes once a feature has been default for 3+ majors, or keep for historical clarity? No action taken this cycle — repeating for visibility since it's been open since 06-29.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**. Items 1–27 carried forward unchanged from prior audits (still unfixed as far as this cycle sampled — see C-5/C-6/C-7 above for the ones re-verified this pass). Items 28–31 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1–26 | *(unchanged — see [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md) and [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) audits for full text)* | — | — |
| 27 | Fix react/introduction.mdoc: `--bundler` option list conflates application vs. library enums, missing `rsbuild`, wrongly includes `rollup` for applications | Medium | 1 file |
| **28** | **Fix reference/releases.mdoc: add missing Nx 23 row to supported-versions table; v20 has passed its 18-month LTS window and should no longer be listed as LTS** | **High** | **1 file** |
| **29** | **Fix guides/ci-deployment.mdoc: remove stale "we are working on NxVitePlugin, stay tuned" note — `@nx/vite` is mature and already documented as supporting Vite up to `^8.0.0`** | **Medium** | **1 file** |
| **30** | **Fix technologies/test-tools/storybook/introduction.mdoc: remove `@storybook/vue-vite` from documented `uiFramework` values — not a valid enum value in `@nx/storybook:configuration` schema, only `@storybook/vue3-vite` is** | **Medium** | **1 file** |
| **31** | **Fix reference/nx-json.mdoc: resolve self-contradictory "Nx 22 Changes" aside — top of page says legacy release-tag properties "work until Nx 23", rest of same page + source say they were removed in Nx 23 and now hard-error** | **High** | **1 file** |
| **32** | **Fix reference/Nx Cloud/launch-template-examples.mdoc: replace Node 21 in the "custom node version" example (`node-21`, `node=21`, `node_version: '21'`) — Node 21 was never LTS and has been EOL since mid-2024; use a current LTS number instead** | **Low** | **1 file** |

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 08-04) where Linear issue creation could not be completed programmatically. This cycle's diagnosis is the clearest yet: `ListConnectors` reports the Linear connector as `installState: "connected"` (authenticated, working at the org level) but **`enabledInChat: false`** for this session — i.e. the connector is fully set up, it's just toggled off for chat/session access. `ToolSearch` correctly returns zero Linear tools as a direct consequence (no Linear tools are loaded into the session when a connector is `enabledInChat: false`), which matches what 07-10 observed by a different route.

This is a scheduled/automated run with no live user present to flip that toggle mid-session — it cannot be self-resolved by retrying the scan. **Action needed from a human:** enable the Linear connector for whatever chat/session context this scheduled task runs under (claude.ai connector settings → Linear → enable for this session/project), or reconfigure the scheduled task to run in a context where Linear is already enabled. Until that happens, every future cycle will hit the same wall and the backlog (now 32 items) will keep growing without any issues actually landing in Linear.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
