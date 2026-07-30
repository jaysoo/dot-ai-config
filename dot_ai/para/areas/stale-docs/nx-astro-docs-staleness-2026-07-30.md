# Nx Astro Docs Staleness Audit — 2026-07-30

**Scope note:** targeted 3-smell scan requested this cycle — (1) old Nx major version mentions, (2) old Node/npm/package version mentions, (3) documented CLI/generator/plugin options that no longer match `packages/` source. Ran as 4 parallel Explore agents covering all `astro-docs/src/content/docs/` subfolders, followed by 2 source-verification agents that grepped actual generator schemas / command source for every suspicious CLI claim surfaced. Not a full line-by-line re-sweep of all ~478 files with manual review of every line — treat [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) as the full-coverage baseline and this + the 07-10 cycle as incremental passes on top of it.

Current Nx: **23.2.0-beta.2** (verified live from root `package.json` "nx" devDependency). CI Node baseline: **24** (verified from `.github/workflows/*.yml` `node-version` / `NODE_VERSION` entries — Node 18 long EOL, Node 20 aging). These were used as the live baseline per this file's own verification rules — no training-data version assumptions were used for the confirmed findings below.

**Linear MCP still unavailable — 7th consecutive audit cycle**, with a new symptom this time (see escalation note at bottom). All issues below are queued for manual creation, merged into the running backlog from prior audits.

---

## Summary

| Category | Confirmed (new) | Re-verified (already tracked) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 1 | 1 (v1-nx-plugin-api, = C-1) | 1 (Angular version example) |
| Old Node/npm/framework version | 2 | 2 (bundling-node-projects Node18 = #16; launch-template-examples Node21 = NI-5) | — |
| Mismatched CLI/feature vs. source | 2 | 1 (as-provided-vs-derived flags, promoted from NI-4 to confirmed) | 2 (self-hosted-cache-packages, nx-cloud-cli onboard tree) |
| **Total** | **5 new** | **4 re-verified** | **3** |

Also cleared 5 items this cycle that prior scans/this cycle's own agents flagged as *suspicious* but source-verification showed are actually **accurate** — listed under "False Alarms Cleared" so future scans don't re-flag them.

---

## Confirmed Findings (New)

### C-1 (new) — `reference/releases.mdoc` version-support table is one major stale
**File:** `astro-docs/src/content/docs/reference/releases.mdoc` (lines 36–38)
**Category:** old-nx-version
**Issue:** Table marks `v22` as `Current` (release date 2025-10-22) with v21/v20 as LTS. Current dev version is 23.2.0-beta.2 — v23 should now be `Current` and the LTS rows should have shifted down one. This is the canonical reference page users check for exactly this fact, so it's high-value to fix.
**Excerpt:** `|   v22   |   Current    |  2025-10-22  |`
**Severity:** High

---

### C-2 (new) — `guides/ci-deployment.mdoc` falsely claims Vite support is "coming soon"
**File:** `astro-docs/src/content/docs/guides/ci-deployment.mdoc` (line 201–203)
**Category:** mismatched-feature
**Issue:** Under a "What about Vite?" heading: "We are working on an `NxVitePlugin` plugin for Vite that will have parity with the `NxWebpackPlugin`. Stay tuned for updates." `@nx/vite` has existed and shipped in this monorepo for years (`packages/vite` is a full, mature plugin) — this reads as leftover copy from a pre-Vite-plugin era Nx version that nobody updated. Presented as current guidance, and flatly wrong today.
**Excerpt:** `We are working on an NxVitePlugin plugin for Vite... Stay tuned for updates.`
**Severity:** High

---

### C-3 (new) — `guides/Nx Release/publish-in-ci-cd.mdoc` pins an old Docker Action major
**File:** `astro-docs/src/content/docs/guides/Nx Release/publish-in-ci-cd.mdoc` (lines 341, 400)
**Category:** old-node-npm-framework
**Issue:** Two example workflows pin `docker/login-action@v2`, while every other action pin in the same file is current (`actions/checkout@v7`, `actions/setup-node@v6` with `node-version: 24`). `docker/login-action` has been at major v3 since ~Nov 2023 — this looks like one overlooked example rather than an intentional pin. May overlap with the broader backlog item #12 ("Update GitHub Actions versions to current majors across CI guides") but is specific/concrete enough to call out by file.
**Excerpt:** `uses: docker/login-action@v2`
**Severity:** Medium

---

### C-4 (new) — `kb/cypress-v11-migration.mdoc` is an obsolete migration guide
**File:** `astro-docs/src/content/docs/kb/cypress-v11-migration.mdoc` (entire file)
**Category:** old-node-npm-framework
**Issue:** Entire KB article walks users through migrating to Cypress v11 via `nx g @nx/cypress:migrate-to-cypress-11`. Verified the generator still exists (`packages/cypress/src/generators/migrate-to-cypress-11/`), but `packages/cypress/package.json` now declares `"peerDependencies": {"cypress": ">= 13 < 16"}` — three-plus majors past v11. The page gives no indication it only matters for very old (pre-v10/v11) projects and reads as generally-relevant KB content. Recommend moving to an archival/deprecated section or adding a "this only applies if you're still on Cypress ≤11" banner, not deleting (generator still works for anyone in that state).
**Severity:** Medium

---

### C-5 (new) — `kb/browser-support.mdoc` example output is from ~2020
**File:** `astro-docs/src/content/docs/kb/browser-support.mdoc` (lines 35–53)
**Category:** old-node-npm-framework
**Issue:** Example `npx browserslist` output shown to readers lists `chrome 83`, `firefox 78`, `ie 11`, `ios_saf 12.0-13.5`, `safari 12-13.1` — all ~2020-era browser versions. A real run today would show Chrome/Firefox/Edge in the 130-140+ range and no IE 11 (retired 2022). Cosmetic but makes the whole page look unmaintained.
**Excerpt:** `chrome 83` / `ie 11` / `firefox 78`
**Severity:** Low

---

## Re-verified Findings (already tracked in prior audits, confirmed still open)

### R-1 — `reference/Deprecated/v1-nx-plugin-api.mdoc` still future-tense about Nx 20 (= prior H-13 / C-1 from 06-29 and 07-10)
Re-verified **with source evidence** this cycle: `ProjectGraphProcessor` is still live in `packages/nx/src/config/project-graph.ts` (lines 183–186, tagged `@deprecated ... will be removed in Nx 20`) and still checked in `packages/nx/src/utils/plugins/plugin-capabilities.ts:93`. Current dev version is 23.2.0-beta.2 — the "removed in Nx 20" promise did not hold; the API is deprecated-but-present three majors later. This is now the **3rd consecutive cycle** flagging this exact issue unfixed.

### R-2 — `reference/Deprecated/as-provided-vs-derived.mdoc` flags: fact confirmed, tense still stale (promotes prior NI-4 from Needs-Input to Confirmed)
Prior cycles listed this as a needs-input tense question. This cycle **verified against source**: the deprecated flags (`--project`, `--flat`, `--pascalCaseFiles`, `--pascalCaseDirectory`, `--fileName`, `--projectNameAndRootFormat`, `--nameAndDirectoryFormat`) are **completely absent** from `packages/js/src/generators/library/schema.json`, `packages/react/src/generators/library/schema.json`, and a repo-wide `schema.json` grep — zero matches anywhere. So the underlying fact (flags are gone) is correct; only the doc's forward-looking wording ("will be removed in Nx 20", line 93; "will only use the new behavior in Nx version 20", line 10) is stale — it should read past tense. Recommend bundling with R-1 under existing backlog item #10.

Also newly noticed in the same Deprecated tense family (supporting evidence for #10, not new standalone issues): `reference/Deprecated/legacy-cache.mdoc` (lines 3, 10, 15, 21 — "In Nx 21, the legacy file system cache **will be removed**...", "can still be used in Nx 20...") has the identical stale-future-tense problem and should be included when #10 is worked.

### R-3 — `kb/bundling-node-projects.mdoc` Node 18 esbuild/Vite target (= prior backlog #16)
Re-confirmed: line 115 `vite.config.ts` example still has `build: { target: 'node18' }`. Node 18 is EOL. Unchanged since 06-29.

### R-4 — `reference/Nx Cloud/launch-template-examples.mdoc` Node 21 example (= prior H-12 / NI-5)
Re-confirmed: lines ~249, 269, 273, section literally titled "node-21", installs Node 21.7.3 via nvm. Node 21 was never LTS, long EOL. Unchanged since first flagged; 4th cycle in a row.

---

## Needs Input

### NI-1 (new) — `reference/Deprecated/self-hosted-cache-packages.mdoc`: package directories entirely absent from this monorepo
The doc claims `@nx/s3-cache`, `@nx/gcs-cache`, `@nx/azure-cache`, `@nx/shared-fs-cache` are deprecated-in-place (due to a CVE) and will stay on npm indefinitely. Verified: none of the four package directories exist anywhere under `packages/` in this checkout, not even as a deprecated stub. Can't confirm from a repo checkout whether they're still published to npm as claimed — needs someone with npm registry access (or knowledge of whether these moved to a separate repo) to confirm the doc's claim is still accurate.

### NI-2 (new) — `reference/nx-cloud-cli.mdoc`: large `onboard` subcommand tree unverifiable from this repo
Documents `nx-cloud onboard connect-workspace`, `onboard connect github`, `onboard orgs list/create`, `onboard repos list`, `onboard templates list`, `onboard vcs status`, `onboard workspace create` and flags (`--repo`, `--template`, `--detect-repo`, `--write-config`, etc.). Grepped `packages/nx/src/nx-cloud/` and `packages/nx/src/command-line/nx-cloud/` — only found an unrelated `onboarding.ts` helper that builds a web URL. The `nx-cloud` CLI binary itself is closed-source and not in this repo (same limitation as existing backlog NI-7/NI-6/NI-8 for other nx-cloud-CLI-documented flags) — needs Cloud team or a checkout of that private repo to verify currency.

### NI-3 (new) — `guides/Tips-n-Tricks/advanced-update.mdoc`: Angular v21/v22 illustrative example not verified
Line 68 uses "keep Angular on v21.x.x and not update it to v22.x.x" as an illustrative example. Angular ships a major roughly every 6 months so v21/v22 existing by mid-2026 is plausible, but this wasn't checked against Angular's actual current version (out of scope for this Nx-repo-only pass — no Angular source here to check against). Flagging so a docs owner with npm/Angular-release-notes access can confirm the example isn't already superseded.

---

## False Alarms Cleared This Cycle (verified accurate — do not re-flag)

Initial breadth-first scanning agents flagged these as *suspicious*; a follow-up source-verification pass confirmed they are correct as documented:

- **`technologies/module-federation/introduction.mdoc`** — `@nx/react:consumer` / `@nx/react:provider` generators with a `--consumer` flag are accurate and current. In fact it's the **reverse** of what was suspected: `host`/`remote` are the ones marked deprecated in `packages/react/generators.json` (`"x-deprecated": "Use @nx/react:consumer instead... Removed in Nx v24."`).
- **`technologies/test-tools/jest/introduction.mdoc`** — `--supportTsx` flag on `@nx/jest:configuration` exists exactly as documented (`packages/jest/src/generators/configuration/schema.json`).
- **`technologies/typescript/introduction.mdoc`** and others — `nx show projects --with-target=typecheck` kebab-case flag is correct; matches the CLI's own built-in help example in `packages/nx/src/command-line/show/command-object.ts`.
- **`reference/environment-variables.mdoc` / `reference/nx-json.mdoc`** — `NX_MIGRATE_SKIP_REGISTRY_FETCH` "deprecated, will be removed in Nx 24" is accurate; the source (`packages/nx/src/command-line/migrate/resolve-package-version.ts`) uses the identical phrase, so it's intentional forward-versioned language, not stale.
- **`reference/nx-json.mdoc`** migrate options `multiMajorMode`, `agentic`, `validate`, `useRegistryResolution`, and agent ids `claude-code`/`codex`/`opencode` — all verified present and fully implemented in `packages/nx/src/command-line/migrate/agentic/`.
- **`reference/project-configuration.mdoc`** `continuous: true` target option — verified as a real, deeply-wired `TargetConfiguration` property (task-runner, native TUI, etc.), not vaporware.
- **`concepts/nx-daemon.mdoc`** `nx affected:test` colon-syntax — still functionally works (`packages/nx/src/command-line/affected/command-object.ts` defines it with a working handler, just `describe: false` to hide from `--help`). Not broken, though it promotes a legacy/undocumented form instead of the canonical `nx affected -t test` — a style nit, not a staleness bug.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**. Items 1–27 carried forward unchanged from prior audits (see [2026-06-29](./nx-astro-docs-staleness-2026-06-29.md) and [2026-07-10](./nx-astro-docs-staleness-2026-07-10.md); #10 and #16 re-verified again this cycle, see R-1/R-3 above). Items 28–32 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1–27 | *(unchanged — see 07-10 audit for full list)* | — | — |
| 10 | Update reference/Deprecated files: change future tense to past tense for Nx 20/21 milestones (3rd cycle re-verified; now includes confirmed evidence that as-provided-vs-derived.mdoc's flags are actually gone, and legacy-cache.mdoc has the same tense problem — add it to scope) | High | 4 files (v1-nx-plugin-api, as-provided-vs-derived, legacy-cache, + 1 more from prior cycles) |
| 16 | Update bundling-node-projects.mdoc: bump EOL `target: 'node18'` (re-verified, still open) | Medium | 1 file |
| **28** | **Fix reference/releases.mdoc: version-support table lists v22 as Current, should be v23** | **High** | **1 file** |
| **29** | **Fix ci-deployment.mdoc: remove stale "we're working on Vite support" note — @nx/vite has shipped for years** | **High** | **1 file** |
| **30** | **Bump docker/login-action@v2 → @v3 in Nx Release/publish-in-ci-cd.mdoc examples** | **Medium** | **1 file** |
| **31** | **Add "legacy/pre-v11 only" framing or archive kb/cypress-v11-migration.mdoc — @nx/cypress now supports Cypress 13-15** | **Medium** | **1 file** |
| **32** | **Refresh kb/browser-support.mdoc example browserslist output — currently shows ~2020-era browser versions incl. IE11** | **Low** | **1 file** |

**Needs-input items (NI-1, NI-2, NI-3 above) are not queued as fix-it Linear issues** — they need a docs/cloud-team decision or external verification before they're actionable, per this file's own "when in doubt, needs-input" rule.

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-30) where Linear issue creation could not be completed programmatically — and the symptom has now changed shape a third time:
- 06-17: "SSE transport removed"
- 07-10: `ListConnectors` reported `enabledInChat: true` but `ToolSearch` returned zero Linear tools for any query
- **07-30 (this cycle): `ListConnectors` now explicitly reports `enabledInChat: false`** (`connected: true`, `installState: "connected"` at the org level, but toggled off for this chat session). `ToolSearch` confirms zero Linear tools are exposed. This session runs as an unattended scheduled task with no live user available to flip that per-chat toggle.

Given the connector is authenticated and installed but simply not enabled for automated/scheduled sessions, this looks like a **per-session/per-chat enablement setting that scheduled runs can't self-service** rather than an auth failure — worth Jack manually enabling Linear for this scheduled task's chat context (or its underlying automation profile) rather than continuing to retry per-audit. All 32 backlog items above remain queued for manual creation in Linear until that's resolved.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
