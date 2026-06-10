# Nx astro-docs Staleness Audit

**Date:** 2026-06-10  
**Scope:** All 498 `.mdoc` files under `astro-docs/src/content/docs/`  
**Current Nx version:** 22 (released 2025-10-22); v21 and v20 are LTS  
**Current Node.js LTS:** Node 22 (Node 20 went EOL April 2026)

Paths are relative to `astro-docs/src/content/docs/`.

---

## Smell 1: Old Nx Version References (>2 major versions behind v22)

Anything referencing Nx 19 or earlier as current/recent guidance is stale. These should either have the version qualifier removed, or be reworded as historical context.

### `technologies/typescript/Guides/define-secondary-entrypoints.mdoc`
- **Line 36:** `"as of Nx 16.8, you can specify the additionalEntryPoints and generateExportsField options"`
- Nx 16.8 is 6 major versions old. The "as of" qualifier makes it sound recent. Remove the version qualifier and just describe the feature.

### `technologies/typescript/Guides/enable-tsc-batch-mode.mdoc`
- **Line 9:** `{% aside type="tip" title="Available since Nx 16.6.0" %}`
- Nx 16.6 is 6 major versions old. The aside adds noise without value. Remove or drop the version qualifier.

### `extending-nx/create-install-package.mdoc`
- **Line 24:** `"Starting with Nx 16.5 you can now have such a create-{x} package generated for you."`
- Nx 16.5 is 6 major versions old. Rephrase without the version anchor.

### `technologies/angular/Guides/nx-and-angular.mdoc`
- **Line 214:** `"The command was introduced in Nx 17.3.0. If you're using an older version, you can instead run:"`
- Nx 17.3 is 5 major versions old. Anyone on "an older version" is unsupported. Remove the fallback entirely.

### `guides/Tips-n-Tricks/advanced-update.mdoc`
- **Line 46:** Example migrating from `Nx 17.1.0` to `Nx 18.2.4`
- The example is 4–5 major versions stale. Update the example to use recent version numbers (e.g., v20 → v22).

### `troubleshooting/troubleshoot-cache-misses.mdoc`
- **Line 12:** `"If you're using a version lower than Nx 17.2.0, check:"`
- Nx 17.2 is 5 major versions old. All users on Nx 17 are unsupported. Remove the conditional or replace with a current version threshold.

### `reference/nx-cloud-cli.mdoc`
- **Line 544:** `{% tabitem label="Nx >= 18" %}`
- Nx 18 is 4 major versions old. The tab implies there is still a meaningful Nx < 18 audience. Review whether the old-version tab is still needed.

### `technologies/module-federation/concepts/module-federation-and-nx.mdoc`
- **Line 10:** `"As of Nx 19.5, our Module Federation support is provided by the @module-federation/enhanced package."`
- Nx 19.5 is 3 major versions old. Remove the "As of Nx 19.5" qualifier and just state the current fact.

### `concepts/sync-generators.mdoc`
- **Line 9:** `"In Nx 19.8, you can use sync generators to ensure that your repository is maintained in a correct state."`
- Nx 19.8 is 3 major versions old. Drop the version qualifier — sync generators are a standard Nx feature now.

### `reference/project-configuration.mdoc`
- **Line 233:** `"In Nx 19.5.0+, tasks can be configured to support parallelism or not."`
- Same as above — drop the "In Nx 19.5.0+" qualifier.
- **Line 588:** `"Sync generators are available in Nx 19.8+."`
- Same pattern.

### `guides/Adopting Nx/preserving-git-histories.mdoc`
- **Line 11:** `"In Nx 19.8 we introduced nx import which helps you import projects into your Nx workspace"`
- Drop the "In Nx 19.8 we introduced" phrasing. Just say "nx import helps you import projects...".

### `guides/Nx Cloud/access-tokens.mdoc`
- **Line 299:** `"From Nx 19.7 new workspaces are connected to Nx Cloud with a property called nxCloudId instead..."`
- 3 major versions old. Drop the version qualifier; this is now the default behavior.

### `guides/Nx Cloud/personal-access-tokens.mdoc`
- **Line 11:** `"From Nx 19.7 repositories are connected to Nx Cloud via a property in nx.json called nxCloudId."`
- Same as above.

### `reference/Deprecated/as-provided-vs-derived.mdoc`
- **Line 54:** `"as-provided will be the only option in Nx 20"`
- Nx 20 has been released and is now LTS. The deadline has passed. Reword: "Since Nx 20, `as-provided` is the only option."

### `reference/Deprecated/global-implicit-dependencies.mdoc`
- **Line 10:** `"This field will be removed in v17."`
- Nx 17 shipped years ago. Change "will be removed" → "was removed".

### `reference/Deprecated/v1-nx-plugin-api.mdoc`
- **Line 11:** `"will be removed in Nx 20. If targeting Nx version 16.7 or higher, please use the v2 API instead."`
- Nx 20 has shipped. Clarify whether v1 API was actually removed or is still present. Update tense.

---

## Smell 2: Old Node.js Versions

Node 20 reached End-of-Life in April 2026. Today is June 2026. Docs recommending or using Node 20 are actively pointing users to an unsupported runtime. The Nx repo's own CI already runs Node 24.

### Tutorial prerequisites (Node 20 minimum requirement)

All three tutorials list `Node.js (v20.19 or later)` as the requirement. Node 20 is EOL. These should be updated to Node 22 (LTS) or Node 24 (Current).

- `getting-started/Tutorials/angular-monorepo-tutorial.mdoc` — line 21
- `getting-started/Tutorials/react-monorepo-tutorial.mdoc` — line 21
- `getting-started/Tutorials/typescript-packages-tutorial.mdoc` — line 21

### CI workflow examples using `node-version: 20`

These docs show GitHub Actions snippets with `node-version: 20`. New users copying these snippets will get Node 20 — EOL. Should be bumped to 22 or 24.

- `features/CI Features/split-e2e-tasks.mdoc` — line 464
- `features/CI Features/distribute-task-execution.mdoc` — line 66
- `guides/Nx Release/publish-in-ci-cd.mdoc` — lines 157, 235, 391 (3 occurrences)
- `guides/Adopting Nx/adding-to-monorepo.mdoc` — line 390
- `guides/Adopting Nx/adding-to-existing-project.mdoc` — line 372
- `guides/Nx Cloud/setup-ci.mdoc` — line 63
- `guides/Nx Cloud/bring-your-own-compute.mdoc` — lines 56, 98

### Node 18 as build target in bundling guide

- `technologies/node/Guides/bundling-node-projects.mdoc` — line 113: `target: 'node18'`
- Node 18 went EOL April 2025. The esbuild/webpack target should be updated to at least `node20` or ideally `node22`.

---

## Smell 3: Feature/Option References Needing Verification

These items were flagged but need a human or deeper code audit to confirm whether they represent actual mismatches between docs and the current codebase.

### `extending-nx/createnodes-compatibility.mdoc`
- **Line 26:** Compatibility table has a column for `Nx 17-19.1`.
- Nx 17–19 are all unsupported (v20 is the oldest LTS). The table may be useful for historical reference but might confuse readers into thinking these are supported upgrade paths. Consider whether to retain or trim columns for EOL versions.

### `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`
- **Lines 248, 366, 386–387, 428:** Multiple deprecated options flagged as "will be removed in Nx 24". Needs verification that these options still exist in the current `@nx/webpack` package schemas. If they were silently removed earlier (or if Nx 23+ is already out by publication time), these are wrong.

### Deprecated `composePlugins` / `withNx` helpers (multiple files)
The following files document `composePlugins`, `withNx`, `withWeb` as deprecated with removal in "Nx v24". This is valid from an Nx 22 standpoint, but confirm the actual removal timeline hasn't shifted:
- `technologies/react/Guides/adding-assets-react.mdoc`
- `technologies/react/next/Guides/next-config-setup.mdoc`
- `technologies/build-tools/webpack/Guides/webpack-config-setup.mdoc`
- `technologies/build-tools/vite/Guides/configure-vite.mdoc`

### `technologies/module-federation/consumer-and-provider.mdoc`
- **Line 126:** `"The following surfaces are deprecated in v23 and will be removed in v24:"`
- The `@nx/react:host` / `@nx/react:remote` generators are listed here. If v23 has released by the time this is read, verify that the generators were actually deprecated (not already removed) and that the docs still match actual CLI output.

---

## Needs Input

1. **Should Deprecated/ pages be updated at all?** Pages under `reference/Deprecated/` are meant to document removed features. However, phrases like "will be removed in v17" (when v17 is 5 major versions old) read as bugs to anyone who finds these pages. Recommend at minimum fixing the tense to "was removed in v17".

2. **What Node version should become the new minimum?** Node 20 is EOL. Node 22 is the current LTS (until October 2027). Node 24 is Current. Tutorials should pick one — either "Node 22 or later" (stable, wide support) or "Node 22+ / 24+" (forward-looking). The Nx CI already uses Node 24 as the default.

3. **`extending-nx/createnodes-compatibility.mdoc` — keep or trim historical columns?** The table is genuinely useful for plugin authors who need to support users on older Nx. But Nx 17–19 are unsupported. Clarifying whether this table is a migration guide (trim old columns) or a compatibility reference (keep them) would help.

4. **Is the Nx 19.x "module federation via @module-federation/enhanced" claim still accurate?** (`technologies/module-federation/concepts/module-federation-and-nx.mdoc:10`) The package may have been updated or replaced since Nx 19.5. Verify.
