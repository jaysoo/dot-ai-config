# Nx Astro Docs Staleness Scan — 2026-06-21

Scanned all 499 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx`.
Nx is currently at **23.0.0-rc.4**. Node 18 EOL: April 2025. Node 20 EOL: April 2026.

---

## Category 1 — Old Nx Version Mentions (more than 2 major versions back from Nx 23)

These are in **active (non-deprecated) docs** and either lock users into a false sense of "this is new" or provide legacy workarounds nobody needs anymore.

### 1.1 "Available since Nx 16.6.0" aside in tsc batch mode page
- **File:** `astro-docs/src/content/docs/technologies/typescript/Guides/enable-tsc-batch-mode.mdoc`
- **Lines:** 9–11
- **Issue:** The aside reads "Available since Nx 16.6.0 — The `@nx/js:tsc` batch implementation was introduced in Nx 16.6.0." This is 7 major versions ago. The aside is unnecessary noise.
- **Fix:** Remove the version-since aside entirely; the feature is universally available.

### 1.2 "As of Nx 16.8" in secondary entrypoints page
- **File:** `astro-docs/src/content/docs/technologies/typescript/Guides/define-secondary-entrypoints.mdoc`
- **Line:** 36
- **Issue:** "If you're using the `@nx/js:tsc` executor, as of Nx 16.8, you can specify the `additionalEntryPoints` and `generateExportsField` options." Historical context not useful for Nx 23 users; also see Category 3 below.
- **Fix:** Remove the "as of Nx 16.8" qualifier.

### 1.3 "Nx 17.3.0" workaround in Angular guide
- **File:** `astro-docs/src/content/docs/technologies/angular/Guides/nx-and-angular.mdoc`
- **Line:** 214
- **Issue:** "The command was introduced in **Nx 17.3.0**. If you're using an older version, you can instead run: [npm add / nx g ng-add]." Nobody using Nx 23 needs the fallback for Nx 16 and older.
- **Fix:** Remove the "If you're using an older version" block and the version note.

### 1.4 "Requires Nx 15.3" aside in folder dependencies guide
- **File:** `astro-docs/src/content/docs/guides/Tips-n-Tricks/identify-dependencies-between-folders.mdoc`
- **Lines:** 17–20
- **Issue:** Aside says "Requires Nx 15.3 — Nx 15.3 introduced nested projects…". 8 major versions ago.
- **Fix:** Remove the aside; nested projects are a given.

### 1.5 "As of Nx 15.0.11" in include-all-packagejson
- **File:** `astro-docs/src/content/docs/guides/Tips-n-Tricks/include-all-packagejson.mdoc`
- **Line:** 7
- **Issue:** Sentence begins "As of Nx 15.0.11, we only include any `package.json` file that is referenced in the `workspaces` property…" Historical qualifier 8 major versions old.
- **Fix:** Rewrite the sentence without the version qualifier: "Nx only includes `package.json` files that are referenced in the `workspaces` property…"

### 1.6 "In Nx 17 and higher" for the `cache` property
- **Files:**
  - `astro-docs/src/content/docs/reference/nx-json.mdoc` (line 340)
  - `astro-docs/src/content/docs/reference/project-configuration.mdoc` (line 212)
- **Issue:** Both say "In Nx 17 and higher, caching is configured by specifying `"cache": true`…". Implies this is a recent addition when it's been there for 6 major versions.
- **Fix:** Drop the version qualifier, or rewrite as "Caching is configured by specifying `"cache": true` in a target's configuration."

### 1.7 "If you're using a version lower than Nx 17.2.0"
- **File:** `astro-docs/src/content/docs/troubleshooting/troubleshoot-cache-misses.mdoc`
- **Line:** 12
- **Issue:** Bullet says "If you're using a version lower than Nx 17.2.0, check: [old instructions]". Nx 17 is 6 major versions ago; this is dead guidance for virtually all users.
- **Fix:** Remove the Nx < 17.2.0 conditional block.

### 1.8 "Starting with Nx 16.5" in create-install-package
- **File:** `astro-docs/src/content/docs/extending-nx/create-install-package.mdoc`
- **Line:** 24
- **Issue:** "Starting with Nx 16.5 you can now have such a `create-{x}` package generated for you." 7 major versions old qualifier.
- **Fix:** Remove the "Starting with Nx 16.5" qualifier.

### 1.9 "Added in Nx v18.1.1" for pass-args-to-commands
- **File:** `astro-docs/src/content/docs/guides/Tasks & Caching/pass-args-to-commands.mdoc`
- **Line:** 173
- **Issue:** "Support for providing command args as options was added in **Nx v18.1.1**." 5 major versions old.
- **Fix:** Remove the version note.

---

## Category 2 — Old Node.js / Package Versions

### 2.1 Tutorial prerequisites still require Node 20 (EOL)
- **Files:**
  - `astro-docs/src/content/docs/getting-started/Tutorials/angular-monorepo-tutorial.mdoc` (line 21)
  - `astro-docs/src/content/docs/getting-started/Tutorials/react-monorepo-tutorial.mdoc` (line 21)
  - `astro-docs/src/content/docs/getting-started/Tutorials/typescript-packages-tutorial.mdoc` (line 21)
- **Issue:** All three read "This tutorial requires [Node.js](https://nodejs.org) (v20.19 or later)". Node 20 reached EOL on April 30, 2026.
- **Fix:** Change to "v22.12.0 or later" (the minimum LTS supported by Nx 23).

### 2.2 CI examples use `node-version: 20` (EOL) and `node:20` Docker image
- **Files with `node-version: 20` or `image: node:20`:**
  - `astro-docs/src/content/docs/guides/Nx Cloud/setup-ci.mdoc` (lines 63, 143, 324)
  - `astro-docs/src/content/docs/guides/Nx Cloud/bring-your-own-compute.mdoc` (lines 56, 98, 297)
  - `astro-docs/src/content/docs/features/CI Features/split-e2e-tasks.mdoc` (line 464)
  - `astro-docs/src/content/docs/features/CI Features/distribute-task-execution.mdoc` (line 66)
  - `astro-docs/src/content/docs/reference/Nx Cloud/assignment-rules.mdoc` (lines 375, 403)
  - `astro-docs/src/content/docs/guides/Adopting Nx/adding-to-monorepo.mdoc` (line 390)
  - `astro-docs/src/content/docs/guides/Adopting Nx/adding-to-existing-project.mdoc` (line 372)
  - `astro-docs/src/content/docs/guides/Nx Release/publish-in-ci-cd.mdoc` (lines 157, 235, 391)
- **Issue:** All recommend Node 20 in GitHub Actions CI examples (`node-version: 20`) or Docker images (`image: node:20`). Node 20 is EOL.
- **Fix:** Change to `node-version: 22` / `image: node:22`.

### 2.3 `image: node:18` in bring-your-own-compute
- **File:** `astro-docs/src/content/docs/guides/Nx Cloud/bring-your-own-compute.mdoc` (line 354)
- **Issue:** Uses `image: node:18` — Node 18 has been EOL since April 2025, over a year ago.
- **Fix:** Change to `image: node:22`.

### 2.4 `target: 'node18'` in esbuild bundling guide
- **File:** `astro-docs/src/content/docs/technologies/node/Guides/bundling-node-projects.mdoc` (line 113)
- **Issue:** The example esbuild `defineConfig` uses `target: 'node18'`. Node 18 is EOL and Nx 23 requires Node 22+.
- **Fix:** Change to `target: 'node22'` (or `'node24'` if targeting latest LTS).

### 2.5 "tsconfig for node 16" in local plugin docs
- **Files:**
  - `astro-docs/src/content/docs/extending-nx/local-generators.mdoc` (line 116)
  - `astro-docs/src/content/docs/extending-nx/local-executors.mdoc` (line 145)
- **Issue:** Both have a caution aside that reads: "Nx uses the paths from `tsconfig.base.json` when running plugins locally, but uses the recommended tsconfig for node 16 for other compiler options. See https://github.com/tsconfig/bases/blob/main/bases/node16.json". Node 16 is 3+ years EOL; Nx 23 minimum is Node 22.
- **Fix:** Update to reference `node22.json` (or remove the aside if the compiler options no longer come from a separate base).

### 2.6 GitHub Actions `setup-node@v3` (outdated, v4 is current)
- **Files:**
  - `astro-docs/src/content/docs/features/CI Features/split-e2e-tasks.mdoc` (line 462)
  - `astro-docs/src/content/docs/guides/Adopting Nx/adding-to-monorepo.mdoc` (line 388)
  - `astro-docs/src/content/docs/guides/Adopting Nx/adding-to-existing-project.mdoc` (line 370)
  - `astro-docs/src/content/docs/guides/Nx Cloud/bring-your-own-compute.mdoc` (lines 54, 96)
  - `astro-docs/src/content/docs/guides/Nx Release/publish-in-ci-cd.mdoc` (line 389)
- **Issue:** Use `actions/setup-node@v3` instead of the current `@v4`.
- **Fix:** Bump to `actions/setup-node@v4`.

### 2.7 GitHub Actions `checkout@v3` (outdated, v4 is current)
- **File:** `astro-docs/src/content/docs/guides/Nx Release/publish-in-ci-cd.mdoc` (line 386)
- **Issue:** Uses `actions/checkout@v3`.
- **Fix:** Bump to `actions/checkout@v4`.

---

## Category 3 — Feature/Option Drift vs. Code

### 3.1 v1 plugin API "will be removed in Nx 20" — we're on Nx 23 and it still exists
- **File:** `astro-docs/src/content/docs/reference/Deprecated/v1-nx-plugin-api.mdoc` (line 11)
- **Issue:** "This API has been superceded by the v2 API and will be removed in Nx 20." We're on Nx 23 and `projectInference` still exists in the codebase (`packages/nx/src/utils/plugins/installed-plugins.ts`, `local-plugins.ts`, `output.ts`, `plugin-capabilities.ts`). The removal claim is inaccurate.
- **Fix:** Update to reflect current reality — either "was intended for removal in Nx 20 but is still present for backward compatibility" or actually confirm when removal is planned.

### 3.2 `generateExportsField` and `additionalEntryPoints` missing TS solution setup caveat
- **File:** `astro-docs/src/content/docs/technologies/typescript/Guides/define-secondary-entrypoints.mdoc`
- **Issue:** The page presents `generateExportsField: true` and `additionalEntryPoints` as the recommended way to define entry points. However, `packages/js/src/executors/swc/swc.impl.ts` (line 40–45) now emits a warning: "Setting 'generateExportsField: true' is not supported with the current TypeScript setup. Set 'exports' field in the 'package.json' file at the project root and unset the 'generateExportsField' option." The TS solution setup (default since Nx 20) renders these options deprecated, but the docs don't say so.
- **Fix:** Add a note that in TS solution setup workspaces (the default since Nx 20), you should set the `exports` field in `package.json` directly instead of using `generateExportsField`/`additionalEntryPoints`. Possibly add a tab or section split.

---

## Needs Input

1. **`local-generators.mdoc` / `local-executors.mdoc` — node 16 tsconfig**
   The caution aside links to `@tsconfig/bases/node16.json`. I could not find the Nx 23 source code that actually reads this base tsconfig for local plugin compilation. It's possible Nx now uses a higher node target (node22) internally, or the behaviour changed. Someone with knowledge of the Nx plugin loading internals should confirm whether `node16.json` is still correct, or whether the aside should reference a newer base (or be removed entirely if Nx just inherits the workspace tsconfig).

2. **`v1-nx-plugin-api.mdoc` — was `projectInference` actually removed?**
   The deprecated page says removal was Nx 20 but code still has it. Need a Nx core team member to clarify: is `projectInference` still intentionally supported, deprecated-but-not-removed, or was the Nx 20 removal target quietly pushed?

3. **`define-secondary-entrypoints.mdoc` — what's the canonical approach for non-TS-solution workspaces?**
   The `generateExportsField`/`additionalEntryPoints` path still works in non-TS-solution workspaces (using the tsc executor without project references). Should this page be split into two paths (old and new setup), or is the old path considered unsupported going forward?

4. **Angular version matrix — how far back to show?**
   The `angular-nx-version-matrix.mdoc` lists compatibility all the way to Angular 8 / Nx 8.x. Angular 8–13 are all EOL. Whether to trim historical rows is a docs policy decision.

---

## Linear Issues Queued

**Note:** No Linear MCP tool was available in this session. Issues below are ready to file manually in the Docs team backlog (Triage, label: "Good for AI agents", unassigned).

| # | Title | Files | Category |
|---|-------|-------|----------|
| L1 | Node 20/18 EOL: update `node-version` and Docker images in CI docs | setup-ci, bring-your-own-compute, split-e2e-tasks, distribute-task-execution, assignment-rules, adding-to-monorepo, adding-to-existing-project, publish-in-ci-cd | 2 |
| L2 | Tutorial prerequisites still require Node 20 (EOL) — bump to Node 22 | angular-monorepo-tutorial, react-monorepo-tutorial, typescript-packages-tutorial | 2 |
| L3 | Stale Nx 15–18 version-qualifier asides in active docs | enable-tsc-batch-mode, define-secondary-entrypoints, nx-and-angular, identify-dependencies-between-folders, include-all-packagejson, nx-json, project-configuration, troubleshoot-cache-misses, create-install-package, pass-args-to-commands | 1 |
| L4 | `target: 'node18'` in esbuild bundling example + "tsconfig for node 16" in local plugin docs | bundling-node-projects, local-generators, local-executors | 2 |
| L5 | v1 plugin API page says "removed in Nx 20" but `projectInference` still exists in Nx 23 | reference/Deprecated/v1-nx-plugin-api | 3 |
| L6 | `generateExportsField`/`additionalEntryPoints` docs missing TS solution setup caveat | define-secondary-entrypoints | 3 |
| L7 | GH Actions `setup-node@v3` / `checkout@v3` still used in CI examples | split-e2e-tasks, adding-to-monorepo, adding-to-existing-project, bring-your-own-compute, publish-in-ci-cd | 2 |
