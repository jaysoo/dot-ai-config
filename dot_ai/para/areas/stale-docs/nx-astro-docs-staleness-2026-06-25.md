# Nx Astro-Docs Staleness Audit — 2026-06-25

**Nx version at audit time:** 22 current / 23 RC (packages/nx/package.json = 0.0.1 dev; `reference/releases.mdoc` lists v22 as Current)
**Node.js EOL context:** Node 16 EOL 2023-09-11; Node 18 EOL 2025-04-30; Node 20 EOL 2026-04-25 (confirmed past as of today)
**Scanned:** all `.mdoc` files under `astro-docs/src/content/docs/` (503 files)
**Previous audits:**
- [2026-06-17](./nx-astro-docs-staleness-2026-06-17.md) — deprecated `cacheableOperations`/`tasksRunnerOptions` tabs, dead Nx ≤19.6 conditionals, TS 4.7 ref, "prior to Nx 18" blocks
- [2026-06-12](./nx-astro-docs-staleness-2026-06-12.md) — svgr option removed from source, Nx 15.7 linkcard
- [2026-06-11](./nx-astro-docs-staleness-2026-06-11.md) — Node 20/18/16 CI configs, Nx 15–17 version notes, @nrwl scope

Items already logged in prior audits are excluded unless new context exists.

---

## 1. CircleCI Nx Orb Versions (High Priority)

### `guides/Nx Cloud/setup-ci.mdoc` — `nrwl/nx@1.7.0`

Line 94: CircleCI config uses `nx: nrwl/nx@1.7.0`. The nrwl/nx CircleCI Orb is at v2+ and v1 is years old.

| File | Line | Issue |
|------|------|-------|
| `guides/Nx Cloud/setup-ci.mdoc` | 94 | `nrwl/nx@1.7.0` CircleCI orb (ancient v1) |

**Fix:** Update to `nrwl/nx@2` (or latest). Check https://circleci.com/developer/orbs/orb/nrwl/nx for current version.

---

### `guides/Nx Cloud/bring-your-own-compute.mdoc` — `nrwl/nx@1.5.1`

Line 136: Same issue.

| File | Line | Issue |
|------|------|-------|
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 136 | `nrwl/nx@1.5.1` CircleCI orb (ancient v1) |

**Fix:** Same as above.

---

## 2. EOL Node in Docker images — still present (High Priority)

These were noted in the June 11 audit as patterns to fix but specific files have not been updated.

| File | Line | Smell |
|------|------|-------|
| `guides/Nx Cloud/setup-ci.mdoc` | 143, 324 | `image: node:20` (EOL April 2026) |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 297 | `image: node:20` (EOL) |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 354 | `image: node:18` (EOL April 2025) |

**Fix:** Replace `node:20` → `node:22` (LTS); `node:18` → `node:22`.

---

## 3. EOL Node in GitHub Actions `node-version:` pins (High Priority)

Node 20 went EOL April 25 2026. All of these pins are now pointing at an EOL runtime.

| File | Lines | Smell |
|------|-------|-------|
| `guides/Nx Cloud/setup-ci.mdoc` | 63 | `node-version: 20` |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 56, 98 | `node-version: 20` |
| `features/CI Features/split-e2e-tasks.mdoc` | 464 | `node-version: 20` |
| `features/CI Features/distribute-task-execution.mdoc` | 66 | `node-version: 20` |
| `reference/Nx Cloud/assignment-rules.mdoc` | 375, 403 | `node-version: 20` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 157, 235, 391 | `node-version: 20` |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | 390 | `node-version: 20` |
| `guides/Adopting Nx/adding-to-existing-project.mdoc` | 372 | `node-version: 20` |

**Fix:** Update all to `node-version: 22` (current LTS).

---

## 4. Old GitHub Actions action versions (Medium Priority)

`actions/setup-node@v3` and `actions/checkout@v3` are old — v4 has been stable for years.

| File | Line | Smell |
|------|------|-------|
| `features/CI Features/split-e2e-tasks.mdoc` | 462 | `actions/setup-node@v3` |
| `guides/Nx Release/publish-in-ci-cd.mdoc` | 386, 389 | `actions/checkout@v3`, `actions/setup-node@v3` |
| `guides/Adopting Nx/adding-to-monorepo.mdoc` | 388 | `actions/setup-node@v3` |
| `guides/Adopting Nx/adding-to-existing-project.mdoc` | 370 | `actions/setup-node@v3` |
| `guides/Nx Cloud/bring-your-own-compute.mdoc` | 54, 96 | `actions/setup-node@v3` |

**Fix:** Update all to `@v4`.

---

## 5. `run-tasks-in-parallel.mdoc` shows `tasksRunnerOptions` as current config (Medium Priority)

Lines 37–44 in `guides/Tasks & Caching/run-tasks-in-parallel.mdoc` show:

```json
"tasksRunnerOptions": {
  "default": {
    "runner": "nx/tasks-runners/default",
    "options": { "parallel": 5 }
  }
}
```

`tasksRunnerOptions` is deprecated (removed from recommended config in Nx 20). The modern way to set parallelism is via `--parallel` flag or `nx.json` → `parallel`. This is distinct from the cloud/auth `tasksRunnerOptions` cases flagged in the June 17 audit — this is a non-cloud guide presented as current.

| File | Lines | Issue |
|------|-------|-------|
| `guides/Tasks & Caching/run-tasks-in-parallel.mdoc` | 37–44 | `tasksRunnerOptions` as current config example for parallelism |

**Fix:** Replace the JSON snippet with the modern `--parallel N` flag usage or the `parallel` key in `nx.json` if that is the current approach.

---

## 6. "tsconfig for node 16" claim in plugin authoring docs (Medium Priority)

Both `extending-nx/local-generators.mdoc` (line 116) and `extending-nx/local-executors.mdoc` (line 145) contain this aside:

> "Nx uses the paths from `tsconfig.base.json` when running plugins locally, but uses the recommended tsconfig for **node 16** for other compiler options. See https://github.com/tsconfig/bases/blob/main/bases/node16.json"

Node 16 went EOL in September 2023. Nx itself dropped Node 16 support in Nx 19. This claim may no longer reflect what Nx does (a search of the Nx source found no reference to node16.json in plugin loader code). At minimum, the linked tsconfig should be updated to node20 or node22.

| File | Line | Issue |
|------|------|-------|
| `extending-nx/local-generators.mdoc` | 116 | "tsconfig for node 16" |
| `extending-nx/local-executors.mdoc` | 145 | "tsconfig for node 16" |

**Fix (pending verification):** If Nx still uses the tsconfig/bases pattern, update the link to `node22.json`. If not, remove the aside or rewrite to describe what tsconfig is actually used.

---

## 7. Yarn PnP guide shows Yarn 3.x as "stable" (Medium Priority)

`guides/Tips-n-Tricks/yarn-pnp.mdoc` line 38 shows:

```json
"packageManager": "yarn@3.6.1"
```

This is presented as the output of `yarn set version stable`. Yarn 4 became stable in October 2023; `yarn set version stable` today installs Yarn 4.x. The doc's entire migration flow (switching from v1 → "Berry" → PnP) uses Yarn 3 framing. The PnP feature itself still exists in Yarn 4, but version-specific commands, `.yarnrc.yml` format, and cache behavior differ.

| File | Line | Issue |
|------|------|-------|
| `guides/Tips-n-Tricks/yarn-pnp.mdoc` | 38, throughout | `yarn@3.6.1` shown as "stable"; Yarn 4 has been stable since Oct 2023 |

**Fix:** Update the guide for Yarn 4. At minimum note that `yarn set version stable` now installs Yarn 4 and that Yarn 3 examples may differ.

---

## 8. Stale "Available since Nx 16/17" intro notes (Low Priority)

These are "when we shipped it" callouts on stable-feature pages. They serve no functional purpose for users on Nx 22 and add version clutter.

| File | Line | Stale Text |
|------|------|-----------|
| `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc` | 9 | `{% aside type="tip" title="Available since Nx 16.6.0" %}` |
| `technologies/typescript/Guides/define-secondary-entrypoints.mdoc` | 36 | `"as of Nx 16.8, you can specify the additionalEntryPoints..."` |
| `extending-nx/create-install-package.mdoc` | 24 | `"Starting with Nx 16.5 you can now have such a create-{x} package..."` |
| `technologies/angular/Guides/nx-and-angular.mdoc` | 214 | `"The command was introduced in Nx 17.3.0. If you're using an older version..."` |
| `troubleshooting/troubleshoot-cache-misses.mdoc` | 12 | `"If you're using a version lower than Nx 17.2.0, check:"` |
| `extending-nx/project-graph-plugins.mdoc` | 372 | `"This functionality is available in Nx 17 or higher."` |
| `reference/nx-json.mdoc` | 340 | `"In Nx 17 and higher, caching is configured by specifying "cache": true"` |
| `reference/project-configuration.mdoc` | 212 | Same "In Nx 17 and higher" sentence |
| `reference/glossary.mdoc` | 154, 231 | `"This was made possible in Nx 15.3"` (nested projects, root-level projects) |
| `guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc` | 17–19 | `{% aside type="note" title="Requires Nx 15.3" %}` |
| `guides/Tips-n-Tricks/include-all-packagejson.mdoc` | 7 | `"As of Nx 15.0.11, we only include..."` |

**Fix:** Drop the version qualifiers. State the behavior as fact. E.g. "As of Nx 16.8…" → "You can specify…"; "In Nx 17 and higher, caching…" → "Caching is configured by specifying `cache: true`…"

---

## Items Investigated and Cleared (Not Stale)

| Pattern | Outcome |
|---------|---------|
| `module-federation-and-nx.mdoc` "As of Nx 19.5" | Within 2 major versions of 22; borderline but not flagged |
| `extending-nx/createnodes-compatibility.mdoc` Nx 17–20 table | Reviewed in June 17 audit — intentional for plugin authors |
| Angular version matrix rows back to Angular 8/Nx 8 | Reviewed in June 11 audit — intentional reference table |
| `reference/Deprecated/` files with Nx 13–17 refs | Historical deprecated-feature context — appropriate |
| `reference/Nx Cloud/release-notes.mdoc` Nx 17–18 refs | Release notes — appropriate historical record |
| `react: { version: '18.2.0' }` in module-federation example | React 18 is still a valid, current version |
| `jest@22.0.0,cypress@3.4.0` in `advanced-update.mdoc` | Used as a `--to` migration example; the old versions are the point of the example |
| `reference/Nx Cloud/launch-templates.mdoc` `ubuntu22.04-node20.*` entries | Changelog of past template versions — informational history |
| `cimg/node:lts-browsers` CircleCI images | Uses `lts` tag — dynamically resolves, not pinned to EOL |
| `tasksRunnerOptions` in `reference/Nx Cloud/config.mdoc` | Reviewed in June 17 audit — flagged as needs-input |
| `webpack: ^5.0.0` support matrix | Current — webpack 5 is still the active major |

---

## Needs Input

1. **`extending-nx/local-generators.mdoc` / `local-executors.mdoc`** — "tsconfig for node 16": Does Nx still use `@tsconfig/bases/node16.json` internally for plugin compilation, or has this moved to node20/22? Code search of `packages/nx/src/` found no reference to `node16.json`, but the tsconfig may be bundled rather than referenced dynamically. Needs verification from the Nx core team before updating.

2. **`guides/Tasks & Caching/run-tasks-in-parallel.mdoc`** — Is `tasksRunnerOptions.default.options.parallel` still the correct way to set a default parallelism, or should this be a top-level `parallel` key in `nx.json`? The `nx.json` schema (`NxJsonSchema.parallel`) exists, but the reference doc page (`reference/nx-json.mdoc`) doesn't clearly document `parallel` as a top-level field. Need docs team to confirm the canonical modern approach.

3. **June 17 Linear issues** — 8 issues were queued for manual creation in the June 17 audit (Linear MCP was broken). Were they filed? If not, they should be created before or alongside this batch.

---

## Linear Issue Status

**⚠️ Linear MCP still unavailable:** Same broken SSE transport as June 17. Issues below need to be created manually at linear.app → Docs team → Triage, with label "Good for AI agents".

### Issues to Create (Docs Team / Triage / Label: "Good for AI agents")

| # | Title | Priority | Files |
|---|-------|----------|-------|
| 1 | Update CircleCI nrwl/nx orb from v1 to current in CI guide pages | High | `guides/Nx Cloud/setup-ci.mdoc`, `bring-your-own-compute.mdoc` |
| 2 | Replace EOL `node:18` and `node:20` Docker images with `node:22` in CI docs | High | `guides/Nx Cloud/setup-ci.mdoc`, `bring-your-own-compute.mdoc` |
| 3 | Update `node-version: 20` to `node-version: 22` in all GitHub Actions examples | High | `split-e2e-tasks.mdoc`, `distribute-task-execution.mdoc`, `assignment-rules.mdoc`, `publish-in-ci-cd.mdoc`, `adding-to-monorepo.mdoc`, `adding-to-existing-project.mdoc`, `setup-ci.mdoc`, `bring-your-own-compute.mdoc` |
| 4 | Upgrade `actions/setup-node@v3` and `actions/checkout@v3` to `@v4` | Medium | `split-e2e-tasks.mdoc`, `publish-in-ci-cd.mdoc`, `adding-to-monorepo.mdoc`, `adding-to-existing-project.mdoc`, `bring-your-own-compute.mdoc` |
| 5 | Replace deprecated `tasksRunnerOptions` example in run-tasks-in-parallel guide | Medium | `guides/Tasks & Caching/run-tasks-in-parallel.mdoc` |
| 6 | Update or remove "tsconfig for node 16" aside in local plugin authoring docs | Medium | `extending-nx/local-generators.mdoc`, `local-executors.mdoc` |
| 7 | Update Yarn PnP guide for Yarn 4 (currently shows `yarn@3.6.1` as "stable") | Medium | `guides/Tips-n-Tricks/yarn-pnp.mdoc` |
| 8 | Remove stale "Available since Nx 15/16/17" callouts from 11 active doc pages | Low | See section 8 above for full file list |

---

## Summary by Priority

| Priority | Count | Description |
|----------|-------|-------------|
| High | 3 | EOL Node (20/18) in Docker and GH Actions; ancient CircleCI orb v1 |
| Medium | 4 | Old action versions (@v3); deprecated `tasksRunnerOptions` in parallel guide; Node 16 tsconfig claim; Yarn 3 as "stable" |
| Low | 1 | 11 pages with stale "introduced in Nx 15/16/17" callouts |
