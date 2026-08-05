# Nx Astro Docs Staleness Audit — 2026-08-05

**Scope:** targeted 3-smell audit (same scope as 2026-07-10): (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator options that no longer match source. Three parallel agents swept all 478 `.mdoc` files under `astro-docs/src/content/docs/` for smells 1 and 2, and spot-checked ~15 plugin/config areas for smell 3. Re-verified the still-open items from 2026-07-10 that this cycle's grep patterns happened to touch, and closed the gap on smell-1 coverage that previously used the wrong version baseline (see below). **Not** a full line-by-line re-sweep of every file for smell 3 — treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md) backlog as still the authoritative full list until another exhaustive pass runs.

**Verified live (not from training data), per this file's own anti-false-positive rules:**
- Nx current stable: **23.1.1** (`npm view nx dist-tags` → `latest: 23.1.1`, `next: 23.2.0-beta.4`, `previous: 22.7.8`). Docs' own self-reported "23.x (current)" labels (`technologies/node/nest/introduction.mdoc`, `technologies/build-tools/rspack/introduction.mdoc`) are correct.
- **Correction to this cycle's own agents:** the Nx-version-scan agent initially concluded "Nx 22 is released, 23 is in beta" from reading the docs' self-labels — this is the exact same wrong-baseline mistake the 2026-06-29 audit made and flagged as a lesson learned. Caught and corrected via live `npm view` before finalizing this report. **"More than 2 majors behind" threshold for this cycle is Nx 20 and older**, not 19.
- Node.js EOL schedule (fetched live from `nodejs.org`/Release repo): v18 EOL'd **2025-04-30**, v20 EOL'd **2026-04-30** — since today is 2026-08-05, **Node 20 is now fully past EOL**, not just "approaching" as prior cycles noted. v22 EOL 2027-04-30, v24 EOL 2028-04-30. Current latest is v26.
- Yarn Berry current: **4.18.0** (`npm view @yarnpkg/cli version`). Note: `npm view yarn dist-tags` is misleading here — its `latest` tag (`1.22.22`) points at Yarn Classic, a separate distribution lineage from Berry; don't use it to judge Berry currency in future cycles.

**Linear MCP unavailable again — 7th consecutive audit cycle.** Symptom this time: `ListConnectors` reports Linear as `connected: true` at the org level but **`enabledInChat: false`** for this session (different from 07-10's symptom, where it showed `enabledInChat: true` but exposed zero tools via `ToolSearch`). Either way, no Linear tool has been callable in any of the last 7 cycles. All issues below are queued for manual creation, merged into the running backlog. See escalation note at the bottom.

---

## Summary

| Category | Confirmed (new) | Confirmed (re-verified, still open) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 0 | 1 (v1-nx-plugin-api.mdoc, = prior C-1/H-13) | 0 new |
| Old Node/npm/framework version | 1 (yarn-pnp.mdoc) | 2 (bundling-node-projects.mdoc = prior item 16; launch-template-examples.mdoc node-21 = prior NI-5/H-12) | 1 |
| Mismatched CLI/feature vs. source | 2 (Storybook `uiFramework`; `--buildable` deprecation gap) | 1 (react/introduction.mdoc `--bundler` = prior C-3/item 27) | 2 |
| **Total** | **3 new** | **4 re-verified still-open** | **3** |

`access-tokens.mdoc` ("authentication is changing", prior C-2/item 24) was also re-verified still open — file moved from `guides/Nx Cloud/access-tokens.mdoc` to `kb/access-tokens.mdoc` since 07-10, content unchanged. Update the file path in the tracking issue.

---

## Confirmed Findings — New This Cycle

### N-1 — `kb/yarn-pnp.mdoc`: stale Yarn Berry version in example output
**File:** `astro-docs/src/content/docs/kb/yarn-pnp.mdoc` (line 40)
**Category:** old-node-npm-framework-version
**Issue:** In the "Switching to Yarn v2+ (aka Berry)" section, the doc shows running `yarn set version stable` (line 31) and then shows the resulting `package.json` with `"packageManager": "yarn@3.6.1"`. Yarn Berry has been on major version 4 since October 2023 and is at **4.18.0** as of this audit (verified via `npm view @yarnpkg/cli version`) — running that command today resolves to a 4.x release, not `3.6.1`. A reader diffing their own output against this example would see a mismatch and might think something's wrong.
**Suggested fix:** update the example output to a current 4.x pin, or genericize it (e.g. `yarn@4.x.x`).

### N-2 — `technologies/test-tools/storybook/introduction.mdoc`: documents a `uiFramework` value not in the generator's schema
**File:** `astro-docs/src/content/docs/technologies/test-tools/storybook/introduction.mdoc` (line 138)
**Code checked:** `packages/storybook/src/generators/configuration/schema.json` — `uiFramework` enum (~line 61)
**Category:** mismatched-feature
**Issue:** The doc's "you must choose one of the following Storybook frameworks" list includes `@storybook/vue-vite` alongside `@storybook/vue3-vite`. The schema's `uiFramework` enum only contains `@storybook/vue3-vite` — passing `--uiFramework=@storybook/vue-vite` to `nx g @nx/storybook:configuration` would fail schema validation today.
**Needs input flag:** the string `@storybook/vue-vite` still exists in `packages/storybook/src/utils/models.ts`'s type union and in a unit test that calls the generator function directly (bypassing schema validation) — worth confirming with a Storybook plugin owner whether the *doc* is wrong (drop the value) or the *schema* is wrong (an omission that should be added back), before filing as a pure docs fix.

### N-3 — `kb/buildable-and-publishable-libraries.mdoc`: `--buildable` documented as current for React without noting it's deprecated
**File:** `astro-docs/src/content/docs/kb/buildable-and-publishable-libraries.mdoc` (intro paragraph)
**Code checked:** `packages/react/src/generators/library/schema.json` — `buildable` property carries `"x-deprecated": "Use the bundler option for greater control (none, vite, rollup)."` (also true for `packages/next`, `packages/js`, `packages/remix` library schemas)
**Category:** mismatched-feature (deprecated-but-undocumented)
**Issue:** The doc states "The `--buildable` and `--publishable` options are available on the Nx library generators for the following plugins: Angular, React, NestJs, Node" with no deprecation note. For React (and Next/JS/Remix), `--buildable` is marked deprecated in favor of `--bundler`. Angular and Node/Nest's `buildable` are *not* deprecated, so the doc's blanket framing conflates a still-current option with a deprecated one, specifically misleading React users. (`technologies/react/introduction.mdoc` correctly steers readers to `--bundler` instead — the two pages now disagree with each other.)

---

## Confirmed Findings — Re-verified, Still Open

- **v1-nx-plugin-api.mdoc future tense** (`reference/Deprecated/v1-nx-plugin-api.mdoc:11`, "will be removed in Nx 20") — unchanged since 06-29 (H-13) / 07-10 (C-1). Now even more clearly wrong given confirmed current is Nx 23.1.1.
- **access-tokens.mdoc "authentication is changing"** — unchanged since 06-29 (M-19) / 07-10 (C-2). **File path changed**: now `kb/access-tokens.mdoc` (was `guides/Nx Cloud/access-tokens.mdoc`).
- **react/introduction.mdoc `--bundler` conflates app vs. library enums** — unchanged since 07-10 (C-3/item 27).
- **bundling-node-projects.mdoc `target: 'node18'`** — unchanged since 06-29 (item 16). Now unambiguously stale: Node 18 has been EOL for over a year, and as of this audit Node 20 has also passed EOL.
- **launch-template-examples.mdoc Node 21 example** — unchanged since 07-10 (NI-5/H-12). Node 21 was never LTS and has been EOL since mid-2024.

---

## Needs Input

### NI-1 (new) — `kb/launch-template-examples.mdoc` line 294: `"packageManager": "yarn@4.1.1"`
Not stale in the sense of "wrong major" (Yarn 4.x is still current), but `4.1.1` is a fairly old patch within that line given Berry is at 4.18.0. Low priority; flagging only because it's adjacent to the confirmed N-1 finding above and a docs owner might want to refresh both examples together.

### NI-2 (new) — `kb/buildable-and-publishable-libraries.mdoc` plugin-list completeness
The "available on ... Angular, React, NestJs, Node" list omits other plugins whose library generators also support `buildable`/`publishable` (`@nx/js`, `@nx/next`, `@nx/vue`, `@nx/web`, `@nx/remix`). Not verified as wrong per se (the doc doesn't claim to be exhaustive), but worth a maintainer call on whether to broaden the list — especially since some of those (`js`, `next`, `remix`) have `buildable` deprecated too, same as N-3.

### NI-3 (carried, re-flagged) — Storybook `uiFramework` schema-vs-doc direction (see N-2)
Whether to fix the doc or the schema needs a Storybook plugin owner's call — see N-2 above.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**, assignee **Linear agent if available, else unassigned**. Items 1–27 carried forward unchanged from prior audits (still unfixed; items 1, 9, 10, 16, 24, 27 re-verified again this cycle — see "Re-verified, Still Open" above). Items 28–30 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Fix compatibility tables: Nx version labeled as (current) incorrectly in node/nest/typescript introductions | High | 3 files |
| 2 | Remove/gate version-ahead content in consumer-and-provider.mdoc and migrating-from-nx-vite.mdoc | High | 2 files |
| 3 | Fix Angular Rspack getting-started: workspace-creation version in sample output | High | 1 file |
| 4 | Fix compose-executors.mdoc: use "executor" not "builder", use cypress.config.ts not cypress.json | High | 1 file |
| 5 | Fix migration-generators.mdoc: remove non-existent --project flag from example | High | 1 file |
| 6 | Fix GitHub Actions versions: nonexistent action majors (self-healing-ci, use-bun) | High | 2 files |
| 7 | Archive or fix publish-rust-crates.mdoc: guide is broken (useLegacyVersioning removed, unfulfilled version promise) | High | 1 file |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI "currently working on" notice | High | 1 file |
| 9 | Add Node 20 EOL notices to Nx Cloud launch templates and examples (re-verified: Node 20 now fully past EOL as of this cycle) | High | 2 files |
| 10 | Update reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones (still open — re-verified this cycle) | High | 3 files |
| 11 | Update version-ahead deprecation callouts across build tools and framework guides | Medium | 5 files |
| 12 | Update GitHub Actions versions to current majors across CI guides | Medium | 5+ files |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with @storybook/test | Medium | 3 files |
| 14 | Fix Storybook angular-configuring-styles: remove webpack5 builder and React-specific options | Medium | 1 file |
| 15 | Fix Storybook best-practices: update stale Storybook URLs and old blog link | Medium | 1 file |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` esbuild/Rollup target (still open — re-verified this cycle) | Medium | 1 file |
| 17 | Fix setup-incremental-builds-angular.mdoc: @angular/build:browser is not a real executor | Medium | 1 file |
| 18 | Fix use-environment-variables-in-angular.mdoc: add deprecation note for @angular-devkit/build-angular:browser | Medium | 1 file |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation not @nx/webpack | Medium | 1 file |
| 20 | Update module-federation-and-nx.mdoc: remove "As of Nx 19.5" framing | Medium | 1 file |
| 21 | Fix react-compiler.mdoc: React Compiler is no longer experimental in React 19 | Medium | 1 file |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level in nx.json, not in runners options | Medium | 1 file |
| 23 | Fix Nx Cloud config.mdoc: update stale version-tab labels | Medium | 1 file |
| 24 | Fix access-tokens.mdoc: remove "authentication is changing" stale aside (still open — re-verified this cycle; **file moved to kb/access-tokens.mdoc**) | Medium | 1 file |
| 25 | Fix Storybook guide URLs: update old framework-prefixed doc paths | Low | 6 files |
| 26 | Clean up low-value version qualifiers: old "since version X" notes in current docs | Low | 8+ files |
| 27 | Fix react/introduction.mdoc: `--bundler` option list conflates application vs. library enums, missing `rsbuild`, wrongly includes `rollup` for applications (still open — re-verified this cycle) | Medium | 1 file |
| **28** | **Fix yarn-pnp.mdoc: stale `yarn@3.6.1` example output for `yarn set version stable` (Yarn Berry now 4.18.x)** | **Low** | **1 file** |
| **29** | **Fix storybook/introduction.mdoc: `@storybook/vue-vite` not a valid `uiFramework` schema value — confirm with plugin owner whether to drop from docs or add back to schema** | **Medium** | **1 file** |
| **30** | **Fix buildable-and-publishable-libraries.mdoc: add deprecation note for React's (and Next/JS/Remix's) `--buildable` option in favor of `--bundler`** | **Medium** | **1 file** |

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 08-05) where Linear issue creation could not be completed programmatically, with a different symptom nearly every time:
- 06-17: "SSE transport removed"
- 07-10: `ListConnectors` showed `enabledInChat: true`, but `ToolSearch` returned zero Linear tools
- 08-05 (this cycle): `ListConnectors` shows `connected: true` at org level but **`enabledInChat: false`** for the session; `ToolSearch` again returns zero Linear tools regardless

The org-level connection is consistently healthy (`connected: true` every cycle checked) — the failure is specifically in getting Linear's tools exposed to an individual chat session. Given 7 straight failures with shifting symptoms, this reads as a persistent per-session enablement/auth problem rather than a transient outage. **Recommend investigating directly in claude.ai connector settings** (toggle Linear "on" for scheduled/automated sessions specifically, not just org-level) rather than continuing to retry per-audit — the retry has now cost 7 audit cycles with zero tickets actually landing in Linear, only ever-growing markdown backlogs.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)

**New for future cycles:** don't use `npm view yarn dist-tags` to judge Yarn Berry currency — its `latest` tag points at Yarn Classic (1.x), a separate lineage. Use `npm view @yarnpkg/cli version` instead. And always derive the "N majors behind" threshold for Nx from a live `npm view nx dist-tags` call, not from what a docs page's own self-labels claim (see baseline-correction note at top of this file, and the same lesson from 06-29).
