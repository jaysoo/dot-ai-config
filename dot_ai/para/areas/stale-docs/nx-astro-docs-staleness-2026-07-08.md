# Nx Astro Docs Staleness Audit — 2026-07-08

Scanned `.mdoc`/`.mdx` files under `astro-docs/src/content/docs/` in `nrwl/nx` (503 files), focused on three smells: old Nx major version mentions, old Node/npm/framework version mentions, and CLI/plugin option drift vs `packages/*` source.

**Live-verified baseline (do not reuse without re-checking — see README rules):**
- `npm view nx dist-tags` → **latest: 23.0.1**, previous: 22.7.6, next: 23.1.0-rc.0. **Nx 23 has now shipped as GA.** This is the single biggest fact that changed since the 2026-06-29 audit.
- `npm view node dist-tags` → latest: 26.4.0. Node 20 is off the active LTS list.
- nx repo's own `.github/workflows/*.yml` (commit dated 2026-07-07) pin `actions/checkout@v5.0.0` and `actions/setup-node@v5.0.0` (by SHA, with version comment) — used as an in-repo proxy for "current" since `api.github.com` was unreachable from this session (403 via WebFetch, and `actions/checkout` is out of this session's GitHub MCP repo scope).

**Important correction to the 2026-06-29 audit:** that scan's H-1 through H-4 and M-1 flagged pages for describing Nx v23 as current/shipping ("premature v23 content") — calling them false positives. Nx 23 has since actually released. Those pages are **no longer stale** and should be considered resolved by the passage of time, not by any doc edit. Verified directly today:
- `technologies/module-federation/consumer-and-provider.mdoc` — "Nx v23 introduces..." — now accurate.
- `technologies/angular/Guides/angular-nx-version-matrix.mdoc` — `~22.0.0 → latest → >=23.1.0` row — now accurate (also resolves NI-1 from 06-29).
- (H-3/H-4/M-1 not re-opened individually today but follow the same logic — Nx 23 is real now.)

This is a good example of why the README's "verify from live source, don't trust cached assumptions" rule matters in both directions: an agent asserting "v23 doesn't exist yet" would now be the one creating a false positive.

---

## Summary

| Category | High | Medium | Needs Input |
|---|---|---|---|
| Old Nx version reference (persisting from prior audits, still unfixed) | 4 | 0 | 0 |
| Old Nx version reference (new) | 1 | 0 | 0 |
| CLI/schema drift (new) | 3 | 0 | 1 |
| GitHub Actions version drift (persisting, re-verified) | 1 | 2 | 0 |
| **Total** | **9** | **2** | **1** |

Node/npm/React/Angular/TypeScript version mentions: **no new issues found.** A dedicated pass across all 503 files for Node 14/16/18/20, React 16/17, Angular ≤16, TypeScript ≤5.3 found nothing presented as current guidance — the docs are actively kept in sync on this axis (see `technologies/node/introduction.mdoc`, `technologies/react/introduction.mdoc`, `technologies/typescript/introduction.mdoc` compatibility tables, all current).

---

## HIGH severity

### H-1 (new) — `reference/releases.mdoc` "Supported versions" table is out of date
**File:** `reference/releases.mdoc` (lines 34-38)
**Quote:**
```
|   v22   |   Current    |  2025-10-22  |
|   v21   |     LTS      |  2025-05-05  |
|   v20   |     LTS      |  2024-10-06  |
```
**Issue:** Nx 23.0.1 is now published (`npm view nx dist-tags` → latest 23.0.1). Per the page's own stated policy (majors every ~6 months, previous major → LTS for 12 months, 18 months total support), this table should now read v23 Current / v22 LTS / v21 LTS, and v20 (released 2024-10-06) has already exceeded its 18-month support window as of today — it should be dropped from the table entirely, not listed as LTS.
**Action:** Update the table to v23 Current, v22 + v21 LTS, drop v20.

### H-2 through H-4 (persisting, unfixed since 2026-06-29) — `reference/Deprecated/*` use future tense for events already years in the past
**Files:**
- `reference/Deprecated/as-provided-vs-derived.mdoc` — "Nx will only use the new behavior in Nx version 20" / "will be removed in Nx 20"
- `reference/Deprecated/v1-nx-plugin-api.mdoc` — "will be removed in Nx 20"
- `reference/Deprecated/legacy-cache.mdoc` — "In Nx 21, the legacy file system cache will be removed"

**Category:** old-nx-version
**Issue:** Re-verified today: `--projectNameAndRootFormat`/`--nameAndDirectoryFormat` are fully gone from `packages/*/src`, and `useLegacyCache` is confirmed dead code per `packages/nx/src/migrations/update-21-0-0/remove-legacy-cache.ts`. These pages still describe both as pending future removals. This is the same finding as 2026-06-29 H-13 / queued Linear issue #10 — still open 10 days later, so it's a genuine backlog item, not a one-off.

### H-5 (persisting, unfixed, re-verified) — `actions/checkout@v6` / `actions/setup-node@v6` don't exist
**Files:** `features/CI Features/self-healing-ci.mdoc`, `guides/Nx Cloud/use-bun.mdoc`
**Category:** mismatched-feature
**Issue:** Same as 2026-06-29 H-7/H-8, still unfixed. Re-verified today against the nx repo's own CI, which pins `@v5.0.0` — confirming `@v6` is not a real release for either action. Anyone copying this example gets an "action not found" failure.

---

## HIGH severity (new — CLI/schema drift)

### H-6 — `reference/nx-json.mdoc` "Task options" table documents dead root-level settings
**File:** `reference/nx-json.mdoc` (lines 194-201)
**Issue:** The table lists `captureStderr`, `skipNxCache`, and `encryptionKey` as settable at the root of `nx.json`. Verified against `packages/nx/src/tasks-runner/run-command.ts` `getRunnerOptions()` (lines 1275-1318): only `parallel`, `cacheDirectory`, `useDaemonProcess`, `nxCloudAccessToken`, `nxCloudId`, `nxCloudUrl`, and `nxCloudEncryptionKey` are read from the nx.json root. `captureStderr`/`skipNxCache`/`encryptionKey` only take effect inside the deprecated `tasksRunnerOptions.<runner>.options` bag (itself `@deprecated` per `nx-json.ts` — "Custom task runners will be replaced by a new API starting with Nx 21"). `skipNxCache` in particular is confirmed sourced only from a CLI flag or `NX_SKIP_NX_CACHE`/`NX_DISABLE_NX_CACHE` env vars, never nx.json. The root property for the encryption key was also renamed to `nxCloudEncryptionKey` back in Nx 17 (see `packages/nx/src/migrations/update-17-0-0/use-minimal-config-for-tasks-runner-options.ts`) — bare `encryptionKey` at the root does nothing today.
**Impact:** A user adding `"skipNxCache": true` at the nx.json root per this table gets silent no-op behavior.

### H-7 — `reference/nx-json.mdoc` `releaseTag.preferDockerVersion` type/default is wrong
**File:** `reference/nx-json.mdoc` (lines 587-593)
**Issue:** Documented as `boolean`, default `false`. Actual type in `packages/nx/src/config/nx-json.ts` (lines 594-602, 703-712) is `boolean | 'both'`, where `'both'` creates tags/changelog entries for both Docker and semver versions, and the real default is conditional ("true when docker configuration is present, false otherwise") — not a flat `false`.

### H-8 — `technologies/react/introduction.mdoc` "Choose a Bundler" list doesn't match either generator schema
**File:** `technologies/react/introduction.mdoc` (lines 79-86)
**Issue:** Presents a single bundler list (Vite, Webpack, Rspack, Rollup) as applying to both apps and libraries. Actual schemas:
- `packages/react/src/generators/application/schema.json` `bundler` enum: `vite`, `rsbuild`, `rspack`, `webpack` — **missing `rsbuild` from the doc**, doc wrongly includes `rollup` (not a valid app bundler).
- `packages/react/src/generators/library/schema.json` `bundler` enum: `none`, `vite`, `rollup` — doc wrongly includes `webpack`/`rspack` (not valid library bundlers).

---

## MEDIUM severity

### M-1 (persisting, unfixed, re-verified + now more severe) — GitHub Actions pins across CI guides are 2 majors behind
**Files (re-grepped today):**
- `@v3` (2 majors behind confirmed-current v5): `guides/Nx Release/publish-in-ci-cd.mdoc`, `guides/Nx Cloud/bring-your-own-compute.mdoc`, `guides/Adopting Nx/adding-to-monorepo.mdoc`, `guides/Adopting Nx/adding-to-existing-project.mdoc`, `features/CI Features/split-e2e-tasks.mdoc`
- `@v4` (1 major behind): `reference/Nx Cloud/assignment-rules.mdoc`, `guides/Nx Release/publish-in-ci-cd.mdoc` (mixed with @v3 in same file), `guides/Nx Cloud/setup-ci.mdoc`, `getting-started/setup-ci.mdoc`, `getting-started/Tutorials/gradle-tutorial.mdoc`, `features/CI Features/distribute-task-execution.mdoc`

**Category:** mismatched-feature
**Issue:** This is 2026-06-29's M-2, still open. Reassessed today against the nx repo's own workflow pins (`@v5.0.0`, dated 2026-07-07): the gap is a full 2 majors for `@v3` references, not the 1-major gap previously assumed. Several files mix `@v3` and `@v4` for the same action across examples in one page.

### M-2 — same-file inconsistency in `publish-in-ci-cd.mdoc`
**File:** `guides/Nx Release/publish-in-ci-cd.mdoc`
**Issue:** Contains three separate CI examples, one pinned to `@v3`, two to `@v4` — internally inconsistent even before accounting for the actual-current `@v5`.

---

## Needs Input

### NI-1 — `nx-json.mdoc` Task options table: is this legacy-path documentation intentionally scoped?
**File:** `reference/nx-json.mdoc`
**Question:** `captureStderr`/`skipNxCache`/`encryptionKey`/`selectivelyHashTsConfig` remain honored if a workspace still has an old-style `tasksRunnerOptions.default` block (`...nxJson.tasksRunnerOptions?.[runner]?.options` is spread first in `getRunnerOptions()`). Is the table intentionally documenting that legacy path, or should it be rewritten to make clear these are NOT root-of-nx.json settings for anyone on the modern config? As written it reads as unqualified root-level guidance. Filed as needs-input rather than a flat "wrong" since there's a legitimate legacy code path that does honor these keys — just not at the root.

---

## Resolved since 2026-06-29 (no doc action needed — release caught up to docs)

Re-verified directly today:
- 06-29 **H-1**: node/nest/typescript compatibility tables labeling "23.x (current)" — now factually correct.
- 06-29 **H-2** / **NI-2**: `consumer-and-provider.mdoc` v23 generator content — now accurate, v23 shipped.
- 06-29 **NI-1**: `angular-nx-version-matrix.mdoc` Angular ~22.0.0 → Nx >=23.1.0 row — now accurate, no longer "forward-looking."

Not individually re-checked today but presumed resolved by the same logic (recommend a quick visual confirm next audit, not a fresh investigation):
- 06-29 **H-3** (`migrating-from-nx-vite.mdoc`), **H-4** (Angular Rspack `v23.0.0` workspace creation output), **M-1** (v23/v24 deprecation callouts across build-tool guides).

## Not re-verified today (carry forward from 2026-06-29 as still-open backlog)

06-29's M-3 through M-21, L-1 through L-17, and NI-3 through NI-11 were not part of today's scan (today's agents covered a different, non-overlapping sample plus the Deprecated/releases/nx-json/react pages). Treat that list as still open until a future audit re-verifies it; don't assume it's stale, and don't assume it's fixed.

---

## Linear Issues to Create — MCP unavailable (blocked, same as every prior audit)

`ToolSearch` for `mcp__Linear__*` tools returned nothing, and the `Linear` connector shows `installState: "unknown"` despite `enabledInChat: true`. This matches the pattern noted on 2026-06-17 ("SSE transport removed") and every subsequent audit — Linear write access has now been unavailable across at least 5 consecutive scheduled runs (06-11 through 07-08). **This itself is worth escalating to whoever owns the Linear connector setup** — it's not a one-off blip.

Issues queued below for the **Docs** team, **Triage** state, label **"Good for AI agents"**, assignee: Linear agent if creatable, else unassigned:

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Update Supported Versions table in reference/releases.mdoc for Nx 23 GA (v23 Current, v22/v21 LTS, drop v20) | High | 1 file |
| 2 | Change future tense to past tense for Nx 20/21 milestones in reference/Deprecated/* (as-provided-vs-derived, v1-nx-plugin-api, legacy-cache) | High | 3 files |
| 3 | Fix GitHub Actions @v6 (doesn't exist) in self-healing-ci.mdoc and use-bun.mdoc | High | 2 files |
| 4 | Fix nx-json.mdoc Task options table: captureStderr/skipNxCache/encryptionKey aren't read from nx.json root (only from deprecated tasksRunnerOptions bag); encryptionKey should be nxCloudEncryptionKey | High | 1 file |
| 5 | Fix nx-json.mdoc releaseTag.preferDockerVersion: type is boolean \| 'both', default is conditional not flat false | High | 1 file |
| 6 | Fix react/introduction.mdoc bundler list: app vs library generators support different bundler sets (rsbuild missing, rollup/webpack/rspack misattributed) | High | 1 file |
| 7 | Update GitHub Actions @v3/@v4 pins to current (@v5) across CI guides (publish-in-ci-cd, bring-your-own-compute, adding-to-monorepo, adding-to-existing-project, split-e2e-tasks, assignment-rules, setup-ci x2, gradle-tutorial, distribute-task-execution) | Medium | 10 files |
| 8 | Clarify (needs-input) whether nx-json.mdoc Task options table intentionally documents the legacy tasksRunnerOptions path | Needs Input | 1 file |
| 9 | [Meta] Linear MCP connector has been unavailable for 5+ consecutive scheduled doc-staleness audits (since 2026-06-17) — investigate connector auth/config | — | n/a |

Carried-forward, still-unactioned items from the 2026-06-29 audit's own 26-item queue (not re-listed here in full — see that file) remain outstanding for the same reason: no Linear issue could be filed, and there's no evidence any were manually created.
