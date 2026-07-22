# Nx Astro Docs Staleness Audit — 2026-07-22

**Scope note:** targeted 3-smell audit (same scope as 2026-07-10): (1) old Nx major version mentions, (2) old Node/npm/framework version mentions, (3) documented CLI/generator/config options that no longer match source. Ran 4 parallel deep-dive agents this cycle focused on config surfaces that hadn't been checked line-by-line before: `nx.json` reference, `project-configuration.mdoc`, environment variables, and a 12-page sample of plugin generator/executor guides. Re-verified a sample of previously-flagged issues (still unfixed). It is **not** a full re-sweep of all 506 `.mdoc` files — treat the [2026-06-29 audit](./nx-astro-docs-staleness-2026-06-29.md)'s backlog as still the authoritative full list until another exhaustive pass runs.

Current Nx: **23.1.0** (verified live via `npm view nx version`; this repo's own `package.json` devDependency pin is `23.2.0-beta.1`). Node dist-tags verified live via `npm view node dist-tags`: latest LTS listed is `v20-lts: 20.11.1`, current `latest: 26.5.0` — confirms Node 20 is past its documented EOL (April 2026) and Node 18/16/14 etc. are long EOL, consistent with what `technologies/node/introduction.mdoc` already states (no drift found there this cycle, same as 07-10).

**Linear MCP still unavailable, 7th consecutive audit cycle** — see escalation note at the bottom. The symptom has changed this cycle (see below), which may point at the actual fix. All new issues below are queued for manual creation, merged into the running backlog from prior audits.

---

## Summary

| Category | Confirmed (new) | Re-verified (still open, prior finding) | Needs Input |
|---|---|---|---|
| Old Nx version reference | 0 new | 2 (v1-nx-plugin-api.mdoc future tense, access-tokens.mdoc "changing") | 0 |
| Old Node/npm/framework version | 0 new | 1 (bundling-node-projects.mdoc `node18` target) | 0 |
| Mismatched CLI/feature vs. source | 6 (**new**) | 0 | 4 |
| **Total** | **6** | **3** | **4** |

---

## Confirmed Findings (new this cycle)

### C-1 — `reference/nx-json.mdoc`: deprecated/nested-only task options presented as root-level `nx.json` properties
**File:** `astro-docs/src/content/docs/reference/nx-json.mdoc`, "Task options" section (~lines 194–201)
**Category:** mismatched-feature
**Issue:** The doc lists `captureStderr`, `skipNxCache`, `encryptionKey`, and `selectivelyHashTsConfig` alongside `parallel`/`cacheDirectory` as settable at the root of `nx.json`. Verified against `packages/nx/src/config/nx-json.ts`: only `parallel` and `cacheDirectory` are actual root-level `NxJsonConfiguration` properties (line 972, 977). The other four only exist nested under `tasksRunnerOptions.<name>.options` — and `tasksRunnerOptions` itself is `@deprecated` in the source ("Custom task runners will be replaced... starting with Nx 21"). A reader following this doc would put these four keys at the root of `nx.json` and they would silently do nothing.
**Severity:** High (silent no-op misconfiguration)

### C-2 — `reference/nx-json.mdoc`: `encryptionKey` — wrong property name, renamed in Nx 17
**File:** same file, same section
**Category:** mismatched-feature
**Issue:** Doc says root property is `encryptionKey`. Source (`nx-json.ts` line 967) shows the real property is `nxCloudEncryptionKey`. A migration (`update-17-0-0/use-minimal-config-for-tasks-runner-options.ts`) explicitly renamed `encryptionKey` → `nxCloudEncryptionKey` back at Nx 17 — this has been wrong for 6+ majors.
**Severity:** High

### C-3 — `reference/nx-json.mdoc`: Release tag `requireSemver` documented default contradicts source
**File:** same file, "Release tag → Configuration options" table (~line 590)
**Category:** mismatched-feature
**Issue:** Doc says default is `false`. Source (`packages/nx/src/command-line/release/config/config.ts` line 305): `defaultReleaseTagPatternRequireSemver = true`, used as the workspace/group default. It's only forced to `false` automatically for release groups with Docker projects (line 923). For the common (non-Docker) case, the actual default is the opposite of what's documented.
**Severity:** Medium

### C-4 — `reference/nx-json.mdoc`: `replaceExistingContents` documented as an `nx.json` config field, but it's CLI-only
**File:** same file, "Replace existing contents" section, badged "Nx 22+" (~lines 780–798)
**Category:** mismatched-feature
**Issue:** Doc presents `replaceExistingContents` as nestable under `release.changelog.workspaceChangelog` / `projectChangelogs` in `nx.json`. Source shows it is only a CLI flag (`--replace-existing-contents`) on the `nx release changelog` command (`command-object.ts` line 344, read via `args.replaceExistingContents` in `changelog.ts`). There is no such field in `NxReleaseChangelogConfiguration` in `nx-json.ts`. Setting it in `nx.json` as the doc instructs has no effect.
**Severity:** High

### C-5 — `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`: `externalDependencies` default is reversed
**File:** `astro-docs/src/content/docs/technologies/build-tools/webpack/Guides/webpack-plugins.mdoc` (~lines 108–113, "externalDependencies")
**Category:** mismatched-feature
**Issue:** Doc says default is `none`. Source: `packages/webpack/src/plugins/nx-webpack-plugin/nx-app-webpack-plugin-options.ts` (lines 90–97) JSDoc states default is `all`, confirmed at runtime in `apply-base-config.ts` line 48 (`options.externalDependencies ??= 'all'`). This is a behavior-reversing factual error — a reader would believe third-party packages are bundled by default when `NxAppWebpackPlugin` actually externalizes all of them by default.
**Severity:** High (affects real build output expectations for anyone using `NxAppWebpackPlugin` directly)

### C-6 — `reference/environment-variables.mdoc`: `NX_CLOUD_NUMBER_OF_RETRIES` local default is wrong
**File:** `astro-docs/src/content/docs/reference/environment-variables.mdoc` (~line 295)
**Category:** mismatched-feature
**Issue:** Doc says "Defaults to `10` on CI and `0` locally." Source (`packages/nx/src/nx-cloud/utilities/environment.ts` lines 20–24): `isCI() ? 10 : 1` — the local default is **1**, not 0.
**Severity:** Low

---

## Re-verified (still open, from prior audits)

- **v1-nx-plugin-api.mdoc future tense** (line 11: "will be removed in Nx 20") — still present, unfixed. = prior H-13 (06-29) / C-1 (07-10). Backlog item #10.
- **access-tokens.mdoc "authentication is changing" aside** (lines 276–277, still says "From Nx 19.7...") — still present, unfixed. = prior M-19 (06-29) / C-2 (07-10). Backlog item #24.
- **bundling-node-projects.mdoc `target: 'node18'`** (line 113, Vite build target example) — still present, unfixed. = backlog item #16.

---

## Needs Input

### NI-1 — `project-configuration.mdoc`: real options missing from the reference page (gaps, not errors)
Verified against `packages/nx/src/config/workspace-json-project-json.ts`:
- `TargetDependencyConfig.options` (`'ignore'|'forward'`, lines 201–204, consumed in `create-task-graph.ts:539`) — forwards *task options* to dependency targets, distinct from `params` (forwards *CLI args*). The `dependsOn` section only documents `params`. This is a real, actively-used option with no discovery path from this page.
- `ProjectConfiguration.generators` (project-level default generator options, e.g. `{ "@nx/react": { "library": { "style": "scss" } } }`, lines 74–91) — not mentioned; may be covered on a separate generators page, needs a docs-owner check.
- Project-level `release.version` overrides beyond `release.docker` (`versionActions`, `versionActionsOptions`, `manifestRootsToUpdate`, `currentVersionResolver`, etc., lines 111–125) — the doc's "Release" section only covers `release.docker`. Also `release.docker` can be the literal `true`, not just an object — undocumented.
These read as incompleteness rather than factual errors, so flagging for a docs-owner call on priority rather than filing as bugs.

### NI-2 — `reference/nx-json.mdoc`: undocumented real root properties
- `owners` — a real root-level `nx.json` property (defined in `packages/nx/schemas/nx-schema.json`, powers `@nx/owners`) with zero mention on this page.
- `tui.suppressHints` — present in `NxJsonConfiguration.tui` (`nx-json.ts` line 1033), absent from the "TUI" section.
Both are real gaps but additive (nothing existing is wrong), so lower priority than C-1–C-4.

### NI-3 — `reference/environment-variables.mdoc`: `NX_MULTI_MAJOR_MODE` undocumented
Real, user-facing env var controlling `direct`/`gradual` mode for `nx migrate --multi-major-mode` (`packages/nx/src/command-line/migrate/multi-major.ts:21-23`, also referenced in `config/nx-json.ts`, `migrate-config.ts`, `command-object.ts`). Not in the environment-variables table at all. Docs-owner call on whether it belongs there or on the migrate command reference instead.

### NI-4 — Linear connector symptom changed this cycle — see escalation note
Different failure mode than prior cycles (previously `enabledInChat: true` with zero tools exposed; this cycle `ListConnectors` reports `enabledInChat: false` outright). See "Linear MCP Status" section below — flagging as needs-input because this may be a one-click fix rather than a persistent bug, worth the docs/tooling owner checking directly rather than another audit cycle re-discovering the same block.

---

## Linear Issues to Create (queued — MCP unavailable, running backlog)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**. Items 1–27 carried forward unchanged from the [2026-07-10 audit](./nx-astro-docs-staleness-2026-07-10.md) (still unfixed — see "Re-verified" above for the 3 sampled this cycle). Items 28–33 are new this cycle.

| # | Title | Severity | Files |
|---|---|---|---|
| 1–27 | *(unchanged — see 2026-07-10 audit for full list)* | — | — |
| **28** | **Fix nx-json.mdoc "Task options": remove/relabel deprecated tasksRunnerOptions-nested-only fields (`captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig`) presented as root-level nx.json properties** | **High** | **1 file** |
| **29** | **Fix nx-json.mdoc: `encryptionKey` should be `nxCloudEncryptionKey` (renamed in Nx 17, wrong for 6+ majors)** | **High** | **1 file** |
| **30** | **Fix nx-json.mdoc: Release tag `requireSemver` documented default (`false`) contradicts actual source default (`true` except Docker release groups)** | **Medium** | **1 file** |
| **31** | **Fix nx-json.mdoc: `replaceExistingContents` documented as an nx.json config field; it's actually CLI-only (`--replace-existing-contents` on `nx release changelog`) and has no effect if set in nx.json** | **High** | **1 file** |
| **32** | **Fix webpack-plugins.mdoc: `externalDependencies` documented default is `none`, actual default is `all` (behavior-reversing error)** | **High** | **1 file** |
| **33** | **Fix environment-variables.mdoc: `NX_CLOUD_NUMBER_OF_RETRIES` local default documented as `0`, actual is `1`** | **Low** | **1 file** |

Running backlog total: **33 Linear issues** queued for manual creation.

---

## Linear MCP Status — Escalation

This is the **7th consecutive audit** (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-10, 07-22) where Linear issue creation could not be completed programmatically. **The symptom changed this cycle**: prior audits reported `ListConnectors` showing Linear as `enabledInChat: true` with zero Linear tools exposed via `ToolSearch` (an opaque connector/auth failure). This cycle, `ListConnectors` returned:

```json
{"name":"Linear","installState":"connected","isAuthless":false,"connected":true,"enabledInChat":false}
```

i.e. the connector **is** authenticated and connected at the org level, but explicitly **not toggled on for this chat session** (`enabledInChat: false`). This is a more actionable signal than prior cycles' symptom — it suggests the fix may simply be enabling Linear for chat sessions in claude.ai's connector settings (or for whatever surface runs this scheduled routine), rather than a deeper auth/transport problem. Worth checking directly rather than waiting for an 8th cycle to re-discover the same block.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
