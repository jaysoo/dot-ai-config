# Nx Astro-Docs Staleness Audit — 2026-06-17

**Nx version at audit time:** ~22-23.x (packages/nx/package.json shows 0.0.1 in dev tree; docs reference Nx 22+ as current)
**Node.js EOL context:** Node 16 EOL 2023-09-11; Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (~499 files)
**Previous audits:**
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option removed from source, Nx 15.7 linkcard
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Node 20/18/16 CI configs, Nx 15-17 version notes, @nrwl scope

This audit focuses on **three staleness smells**: (1) old Nx version mentions, (2) old Node/package versions, (3) features/options that don't match current CLI or code. Items already logged in prior audits are excluded unless there's new context.

---

## 1. Deprecated Config Patterns Shown as Current (High Priority)

### `features/cache-task-results.mdoc` — "Nx < 17" tab with `cacheableOperations`

The main Cache Task Results feature page uses `{% tabs syncKey="nx-version" %}` to show two config approaches:

- **"Nx >= 17"** tab: correct modern approach using `targetDefaults.build.cache: true`
- **"Nx < 17"** tab: deprecated approach using `tasksRunnerOptions.default.options.cacheableOperations`

`cacheableOperations` was deprecated in Nx 17; `tasksRunnerOptions` was fully deprecated in Nx 20. Current Nx is 22+. The "Nx < 17" tab is dead content serving no active users and makes the page harder to read.

| File | Lines | Issue |
|------|-------|-------|
| `features/cache-task-results.mdoc` | 20–59 | "Nx < 17" tab showing `tasksRunnerOptions` / `cacheableOperations` |

**Fix:** Remove the "Nx < 17" tab entirely. The `{% tabs %}` block wrapping the two examples can be collapsed to the `targetDefaults` approach.

---

### `guides/Nx Cloud/access-tokens.mdoc` — "Nx <= 19.6" tab with `tasksRunnerOptions`

Line 284 and 299 show a two-tab layout: "Nx >= 19.7" (uses `nxCloudId`) vs "Nx <= 19.6" (uses `tasksRunnerOptions`). The <= 19.6 tab is dead since minimum supported Nx is 22+.

| File | Lines | Issue |
|------|-------|-------|
| `guides/Nx Cloud/access-tokens.mdoc` | 280–310 | "Nx <= 19.6" tab showing deprecated `tasksRunnerOptions` approach |

**Fix:** Remove "Nx <= 19.6" tab. Keep only the `nxCloudId` approach.

---

### `guides/Nx Cloud/personal-access-tokens.mdoc` — "Nx <= 19.6" tab

Same two-tab pattern: lines 18–42 show "Nx >= 19.7" and "Nx <= 19.6" approaches. The <= 19.6 tab shows `tasksRunnerOptions` and requires installing the `nx-cloud` npm package separately.

| File | Lines | Issue |
|------|-------|-------|
| `guides/Nx Cloud/personal-access-tokens.mdoc` | 18–42 | "Nx <= 19.6" tab with `tasksRunnerOptions` and separate nx-cloud install |

**Fix:** Remove "Nx <= 19.6" tab.

---

### `reference/Nx Cloud/config.mdoc` — `tasksRunnerOptions` in config reference + nx-cloud@16.0.4 requirement

Lines 24, 66, and 121 show `tasksRunnerOptions` in what appears to be a current config reference page (not a deprecated page). Line 158 also says: `"You must be on version 16.0.4 or later of nx-cloud or @nrwl/nx-cloud for this value to be respected."` — `@nrwl/nx-cloud` was deprecated in Nx 18; nobody should need this constraint.

| File | Lines | Issue |
|------|-------|-------|
| `reference/Nx Cloud/config.mdoc` | 24, 66, 121 | `tasksRunnerOptions` shown as config pattern |
| `reference/Nx Cloud/config.mdoc` | 158 | `16.0.4` version requirement for `nx-cloud` / `@nrwl/nx-cloud` |

**Fix:** Audit whether `tasksRunnerOptions` examples here are in deprecated-context sections or active examples. If the latter, replace with `nxCloudId`-based examples.

---

### `reference/nx-cloud-cli.mdoc` — Dead Nx <= 19.6 conditional guidance

Line 106: `"If you are connecting to Nx Cloud with a workspace that is version 19.6 or lower, this command will also install the latest version of the Nx Cloud npm package... Only Nx versions 19.7 and higher natively support the nxCloudId property..."`

Current minimum supported Nx is 22+. This conditional block is dead code in docs.

| File | Line | Issue |
|------|------|-------|
| `reference/nx-cloud-cli.mdoc` | 106 | Conditional guidance for Nx <= 19.6 users who need `nx-cloud` npm package |

**Fix:** Remove the Nx <= 19.6 conditional. All users have `nxCloudId` support natively.

---

## 2. Dead "Prior to Nx X" Conditionals in Active Guides (Medium Priority)

### `technologies/node/Guides/application-proxies.mdoc` — "Prior to Nx version 18"

Lines 96–105: `"Using --frontendProject is meant for Nx prior to version 18. Prior to Nx version 18, projects use executors to run tasks."` This is followed by three generator examples with `--frontendProject`. Since Nx 18 was released in early 2024 and current is 22+, this entire conditional block is dead weight.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/node/Guides/application-proxies.mdoc` | 96–106 | "Prior to Nx version 18" + `--frontendProject` examples |

**Fix:** Remove the entire "prior to version 18" block.

---

### `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc` — "Nx version lower than 18"

Line 41: `"If you're on an Nx version lower than 18 or have opted out of using inferred tasks, the storybook, build-storybook, and test-storybook targets will be explicitly defined in the libs/storybook-host/project.json file."` Dead conditional.

| File | Line | Issue |
|------|------|-------|
| `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc` | 41 | "Nx version lower than 18" fallback note |

**Fix:** Remove the conditional note or simplify to just the inferred-tasks path.

---

## 3. Stale "Introduced in Nx X" Intro Notes in Concept Pages (Low Priority)

These are "when we shipped it" announcements baked into concept docs. Fine for a changelog; clutter in stable reference pages.

### `concepts/nx-daemon.mdoc` — "version 13" intro

Line 9: `"In version 13 we introduced the opt-in Nx Daemon which Nx can leverage to dramatically speed up project graph computation..."`

Nx 13 was released in 2021. The Nx Daemon is now enabled by default; the "opt-in" framing is also stale.

| File | Line | Issue |
|------|------|-------|
| `concepts/nx-daemon.mdoc` | 9 | "In version 13 we introduced the opt-in Nx Daemon" |

---

### `concepts/sync-generators.mdoc` — "In Nx 19.8"

Line 9: `"In Nx 19.8, you can use sync generators to ensure that your repository is maintained in a correct state."`

Sync generators are now a stable, documented feature. The "In Nx 19.8" intro should be dropped.

| File | Line | Issue |
|------|------|-------|
| `concepts/sync-generators.mdoc` | 9 | "In Nx 19.8, you can use sync generators" |

---

### `reference/project-configuration.mdoc` — "Sync generators are available in Nx 19.8+"

Line 588: `"Sync generators are available in Nx 19.8+"` — same issue, different page.

| File | Line | Issue |
|------|------|-------|
| `reference/project-configuration.mdoc` | 588 | "Sync generators are available in Nx 19.8+" |

---

### `guides/Adopting Nx/preserving-git-histories.mdoc` — "In Nx 19.8 we introduced `nx import`"

Line 11: `"In Nx 19.8 we introduced nx import which helps you import projects into your Nx workspace..."` — historical launch note.

| File | Line | Issue |
|------|------|-------|
| `guides/Adopting Nx/preserving-git-histories.mdoc` | 11 | "In Nx 19.8 we introduced nx import" |

---

## 4. Stale Package Version Reference (Medium Priority)

### `technologies/typescript/Guides/compile-multiple-formats.mdoc` — TypeScript 4.7 reference

Lines 94 and 97 reference `TypeScript 4.7+` as the threshold for `exports` field type resolution support, and link to the TypeScript 4.7 release notes. Current TypeScript is 5.x; TS 4.7 was released in 2022. The `4.7+` framing should be updated to just say "TypeScript 5.x+" or remove the version qualifier since it's universally supported now.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/typescript/Guides/compile-multiple-formats.mdoc` | 94, 97 | `TypeScript 4.7+` threshold and link to TS 4.7 release notes |

---

## 5. Stale Terminal Output (Low Priority)

### `technologies/angular/angular-rspack/Guides/getting-started.mdoc` — v20.8.0 workspace creation output

Lines 37 and 57 show a terminal example: `NX   Creating your v20.8.0 workspace.` This is two major versions behind current.

| File | Lines | Issue |
|------|-------|-------|
| `technologies/angular/angular-rspack/Guides/getting-started.mdoc` | 37, 57 | Terminal output shows `v20.8.0` workspace creation |

---

## Items Investigated and Cleared (Not Stale)

| Pattern | Outcome |
|---------|---------|
| `--skip-nx-cache` in caching guides | Already cleared in 2026-06-12 audit — flag is valid and not deprecated |
| `reference/Deprecated/` files referencing Nx 13-20 | Intentional historical context for deprecated features — appropriate |
| `reference/Nx Cloud/release-notes.mdoc` Nx 17-18 refs | Release notes are historical records — appropriate |
| `extending-nx/createnodes-compatibility.mdoc` Nx 17-20 table | Plugin compatibility matrix — legitimate for plugin authors supporting old Nx |
| Angular version matrix (angular-nx-version-matrix.mdoc) Nx 15-19 rows | Reference table intentionally includes old pairings for users on old Angular |
| `guides/Tasks & Caching/self-hosted-caching.mdoc` "Nx 20.8" | Within 2 major versions; recent enough to not qualify as stale |
| `module-federation-and-nx.mdoc` "As of Nx 19.5" | Within 2 major versions; borderline |
| React 18 peer dep in react/introduction.mdoc | Current (react 18-19 range is correct) |

---

## Needs Input

1. **`reference/Nx Cloud/config.mdoc`** `tasksRunnerOptions` examples — Are lines 24/66/121 in deprecated-context sections or are they displayed as active config patterns? Need a human to check whether the surrounding context already frames them as "old approach."

2. **`extending-nx/createnodes-compatibility.mdoc`** — The Nx 17-20 rows of the compatibility table are 2-4 major versions behind. Should this table be pruned to only show Nx 21+, or is it valuable to keep for plugin authors who still need to support older Nx workspaces? Decision needed from Docs team.

3. **`technologies/node/Guides/application-proxies.mdoc`** `--frontendProject` — Confirm `--frontendProject` is fully removed from all `@nx/node`, `@nx/nest`, `@nx/express` generators before removing the docs section.

---

## Linear Issue Status

**⚠️ Linear MCP unavailable:** All Linear tool calls during this session failed with:
> `Tool call rejected as a pre-removal deprecation signal. DEPRECATED TRANSPORT — REMOVAL DATE 2026-04-08 (past).`

The Linear MCP server in this environment is configured with the old SSE transport (removed 2026-04-08). Issues listed below need to be created manually or after updating the MCP config to use `https://mcp.linear.app/mcp`.

### Issues to Create (Docs Team / Triage / Label: "Good for AI agents")

| # | Title | Priority | Files |
|---|-------|----------|-------|
| 1 | Remove deprecated "Nx < 17" version tab from cache-task-results docs | High | `features/cache-task-results.mdoc` |
| 2 | Remove "Nx <= 19.6" version tabs from Nx Cloud authentication docs | High | `guides/Nx Cloud/access-tokens.mdoc`, `personal-access-tokens.mdoc` |
| 3 | Remove dead Nx <= 19.6 conditional from nx-cloud-cli reference | Medium | `reference/nx-cloud-cli.mdoc` |
| 4 | Remove "prior to Nx 18" proxy configuration block from Node guide | Medium | `technologies/node/Guides/application-proxies.mdoc` |
| 5 | Remove "Nx < 18" storybook fallback note from one-storybook-for-all guide | Low | `technologies/test-tools/storybook/Guides/one-storybook-for-all.mdoc` |
| 6 | Update TypeScript version references in compile-multiple-formats guide | Medium | `technologies/typescript/Guides/compile-multiple-formats.mdoc` |
| 7 | Clean up stale "Introduced in Nx X" intro notes across concept docs | Low | `concepts/nx-daemon.mdoc`, `concepts/sync-generators.mdoc`, `reference/project-configuration.mdoc`, `guides/Adopting Nx/preserving-git-histories.mdoc` |
| 8 | Update terminal output version in angular-rspack getting-started guide | Low | `technologies/angular/angular-rspack/Guides/getting-started.mdoc` |

---

## Summary by Priority

| Priority | Count | Description |
|----------|-------|-------------|
| High | 3 | Deprecated config patterns (`cacheableOperations`, `tasksRunnerOptions`) shown in active feature/guide pages |
| Medium | 3 | Dead "Nx <= 19.6" / "prior to Nx 18" conditionals in reference and guide pages |
| Medium | 1 | TypeScript 4.7 reference (current is TS 5.x) |
| Low | 4 | Stale "Introduced in Nx X" intro notes in concept docs |
| Low | 1 | Old terminal output version in Angular rspack guide |
