# Nx Astro Docs Staleness Audit — 2026-06-30

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx`.

**Baseline (verified live):**
- Current Nx: **23.0.1** (confirmed via `npm view nx version`)
- Node 20 EOL: **April 30, 2026** (EOL)
- Node 22 Active LTS: **through April 2027**
- Node 24 Current LTS: **active**

Linear MCP unavailable — issues documented for manual creation.

---

## Correction to 2026-06-29 Scan

The 2026-06-29 scan used **Nx 22.x as the current baseline**, which was wrong. Nx 23.0.1 shipped between that scan and today. This invalidates 5 HIGH findings and 1 MEDIUM finding from that report:

| Old ID | Finding | Verdict |
|--------|---------|---------|
| H-1 | Compatibility tables label `23.x (current)` as wrong | **FALSE POSITIVE** — 23.x IS current |
| H-2 | `consumer-and-provider.mdoc` presents Nx v23 as unreleased | **FALSE POSITIVE** — v23 is released |
| H-3 | `migrating-from-nx-vite.mdoc` treats Nx 23 as future | **FALSE POSITIVE** — Nx 23 is released |
| H-4 | Angular Rspack shows `v23.0.0` workspace creation | **FALSE POSITIVE** — correct output |
| M-1 | v23/v24 deprecation framing confusing for users on v22 | **RESOLVED** — v23 is current; "deprecated in v23, removed in v24" framing is now accurate |
| NI-2 | Is `consumer-and-provider.mdoc` intentional pre-release? | **RESOLVED** — v23 is released, content is current |

**Net correction: Remove 5 HIGH + 1 MEDIUM issues from the 2026-06-29 queue before filing.**

The remaining findings from 2026-06-29 (H-5 through H-13, M-2 through M-21, L-1 through L-17, NI-1, NI-3 through NI-8) are still valid.

---

## New Findings (2026-06-30)

### NF-1 — Angular 22 compat row requires Nx ≥23.1.0 — only 23.0.1 is out
**File:** `technologies/angular/Guides/angular-nx-version-matrix.mdoc`
**Category:** mismatched-feature
**Severity:** HIGH

The Angular–Nx compatibility matrix row for Angular 22.x shows:
```
| ~22.0.0 | latest | >=23.1.0 <=latest |
```

Current Nx is `23.0.1`. Angular 22 therefore has **no documented supported Nx version** yet — Nx 23.1.0 hasn't shipped. Users installing Angular 22 today are in an undocumented gap.

**Action needed:** Either update the row to `>=23.0.0` (if Angular 22 actually works on 23.0.x) or add a note explaining 23.1.0 is required and not yet released.

**Relates to NI-1 from 2026-06-29** — this was listed as "needs input" but with 23.0.1 confirmed we can now call it a real issue.

---

### NF-2 — `launch-template-examples.mdoc` custom node example uses Node 21 (EOL unsupported)
**File:** `reference/Nx Cloud/launch-template-examples.mdoc`
**Category:** old-node-version  
**Severity:** MEDIUM

Already captured as H-12 in 2026-06-29, but flagging explicitly since Node 21 is an **odd-release** (was never LTS) and the install command `nvm install 21.7.3` demonstrates selecting a non-LTS, non-EOL-tracked release as a tutorial value. The example should use Node 22.x or 24.x.

---

### NF-3 — `bundling-node-projects.mdoc` Vite example targets EOL Node 18
**File:** `technologies/node/Guides/bundling-node-projects.mdoc:113`
**Category:** old-node-version
**Severity:** MEDIUM

Already captured as M-6 in 2026-06-29. Calling out explicitly with the exact line:
```ts
target: 'node18',
```
Node 18 EOL was April 2024. Should be `node22` or `node24`.

---

### NF-4 — `reference/Deprecated/v1-nx-plugin-api.mdoc` uses future tense for past removal
**File:** `reference/Deprecated/v1-nx-plugin-api.mdoc:11`
**Category:** old-nx-version
**Severity:** MEDIUM

Already captured as H-13 (batch) in 2026-06-29. The callout reads:
> "This API has been superceded by the v2 API and **will be removed in Nx 20**."

We're on Nx 23. It was removed in Nx 20, three major versions ago. Should read "**was removed in Nx 20**."

---

### NF-5 — `reference/Deprecated/legacy-cache.mdoc` uses future tense for past removal
**File:** `reference/Deprecated/legacy-cache.mdoc:10`
**Category:** old-nx-version
**Severity:** MEDIUM

Already captured as H-13 (batch). Page opens:
> "In Nx 21, the legacy file system cache **will be removed** in favor of a new database cache."

We're on Nx 23. The removal happened in Nx 21, two major versions ago. Should read "**was removed**."

---

### NF-6 — `reference/Deprecated/as-provided-vs-derived.mdoc` uses future tense throughout for Nx 20 changes
**File:** `reference/Deprecated/as-provided-vs-derived.mdoc`
**Category:** old-nx-version
**Severity:** MEDIUM

Already captured as H-13 (batch). Multiple passages use future tense:
- Line 10: "Nx will only use the new behavior in Nx version 20"
- Line 29: "Nx will prompt you when running most generators until Nx 20"
- Line 54: "will be the only option in Nx 20"
- Line 93: "In Nx 20, Nx will take the generator options as provided"

These events all happened three major versions ago. The whole page needs to be rewritten in past tense or restructured as a historical note.

---

## Offending Pages Summary

### Confirmed Stale (actionable — all NEW or carrying forward from 2026-06-29 with false positives removed)

| ID | File | Issue | Category | Severity |
|----|------|-------|----------|----------|
| NF-1 | `technologies/angular/Guides/angular-nx-version-matrix.mdoc` | Angular 22 row requires Nx ≥23.1.0 but 23.0.1 is current | mismatched-feature | HIGH |
| H-5 | `extending-nx/compose-executors.mdoc` | Uses `"builder"` key and `cypress.json` (Cypress v9) | mismatched-feature | HIGH |
| H-6 | `extending-nx/migration-generators.mdoc` | Documents `--project` flag that doesn't exist | mismatched-feature | HIGH |
| H-7 | `features/CI Features/self-healing-ci.mdoc` | `actions/checkout@v6`, `actions/setup-node@v6` (don't exist) | mismatched-feature | HIGH |
| H-8 | `guides/Nx Cloud/use-bun.mdoc` | `actions/checkout@v6` (doesn't exist) | mismatched-feature | HIGH |
| H-9 | `guides/Nx Release/publish-rust-crates.mdoc` | Broken guide referencing removed `useLegacyVersioning` | mismatched-feature | HIGH |
| H-10 | `guides/Tasks & Caching/terminal-ui.mdoc` | "We are currently working on Windows support" — shipped | mismatched-feature | HIGH |
| H-11 | `reference/Nx Cloud/launch-templates.mdoc` | Node 20 images listed without EOL marker | old-node-version | HIGH |
| H-12 / NF-2 | `reference/Nx Cloud/launch-template-examples.mdoc` | Node 21 example (`nvm install 21.7.3`) | old-node-version | HIGH |
| H-13 / NF-4,5,6 | `reference/Deprecated/v1-nx-plugin-api.mdoc`, `legacy-cache.mdoc`, `as-provided-vs-derived.mdoc` | Future tense for Nx 20/21 changes already shipped | old-nx-version | HIGH |
| M-2 | `features/CI Features/split-e2e-tasks.mdoc` + 4 others | `actions/setup-node@v3` / `checkout@v3` outdated | mismatched-feature | MEDIUM |
| M-3 | `technologies/test-tools/storybook/Guides/` (3 files) | `@storybook/testing-library` + `@storybook/jest` (deprecated in Sb8) | old-package-version | MEDIUM |
| M-4 | `technologies/test-tools/storybook/Guides/angular-configuring-styles.mdoc` | Storybook 8-removed `@storybook/builder-webpack5` | old-package-version | MEDIUM |
| M-5 | `technologies/test-tools/storybook/Guides/best-practices.mdoc` | Dead Storybook 7 URLs + "Why Storybook in 2022?" | old-package-version | MEDIUM |
| M-6 / NF-3 | `technologies/node/Guides/bundling-node-projects.mdoc` | `target: 'node18'` in Vite example (Node 18 EOL) | old-node-version | MEDIUM |
| M-7 | `technologies/node/introduction.mdoc` | Nx 22 row shows `^20.19.0` without EOL note | old-node-version | MEDIUM |
| M-8 | `technologies/angular/Guides/setup-incremental-builds-angular.mdoc` | `@angular/build:browser` doesn't exist as executor | mismatched-feature | MEDIUM |
| M-9 | `technologies/angular/Guides/use-environment-variables-in-angular.mdoc` | `@angular-devkit/build-angular:browser` removed in Angular 20 | old-package-version | MEDIUM |
| M-10 | `technologies/angular/Migration/angular.mdoc` | Angular 13/14 described as realistic migration start | old-package-version | MEDIUM |
| M-11 | `technologies/angular/angular-rspack/Guides/` (2 files) | "minimum Nx 20.6.1" phrasing on current-feature pages | old-nx-version | MEDIUM |
| M-12 | `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc` | Imports `ModuleFederationConfig` from `@nx/webpack` (wrong — use `@nx/module-federation`) | mismatched-feature | MEDIUM |
| M-13 | `technologies/module-federation/concepts/module-federation-and-nx.mdoc` | "As of Nx 19.5" framing 4 major versions later | old-nx-version | MEDIUM |
| M-14 | `technologies/react/Guides/react-compiler.mdoc` | React Compiler called "experimental" — it's stable in React 19 | old-package-version | MEDIUM |
| M-15 | `concepts/nx-daemon.mdoc` | `useDaemonProcess` documented in wrong nx.json location | mismatched-feature | MEDIUM |
| M-16 | `reference/Nx Cloud/config.mdoc` | Tab labels `"Nx >= 17"` / `"Nx <= 19.6"` 5-6 major versions old | old-nx-version | MEDIUM |
| M-17 | `guides/Nx Cloud/setup-ci.mdoc` + 1 | CircleCI orb `nrwl/nx@1.7.0` pinned | mismatched-feature | MEDIUM |
| M-18 | `concepts/inferred-tasks.mdoc` | Opens with "In Nx version 18" framing | old-nx-version | MEDIUM |
| M-19 | `guides/Nx Cloud/access-tokens.mdoc` + 1 | Authentication "is changing" — changed in Nx 19.7 | old-nx-version | MEDIUM |
| M-20 | `extending-nx/create-preset.mdoc` | `--pluginName` usage confusing vs positional arg | mismatched-feature | MEDIUM |
| M-21 | `technologies/eslint/Guides/flat-config.mdoc` | "Since version 16.8.0" attribution 6 versions ago | old-nx-version | MEDIUM |

---

## Needs Input

| ID | File | Question |
|----|------|----------|
| NI-1 | `angular-nx-version-matrix.mdoc` | Does Angular 22 actually work on Nx 23.0.x, or does it truly require 23.1.0? If it works now, update the row to ≥23.0.0. |
| NI-3 | `terminal-ui.mdoc` | Is Windows TUI fully shipped for all Windows terminals, or only specific ones? |
| NI-4 | `publish-rust-crates.mdoc` | Has `@monodon/rust` shipped a `VersionActions` implementation? Guide uses removed `useLegacyVersioning`. |
| NI-5 | `gradle-tutorial.mdoc` | Gradle 8.5 docs link — should the tutorial be re-run with current Gradle? |
| NI-6 | `setup-ci.mdoc` + 1 | What is the current `nrwl/nx` CircleCI orb version? 1.7.0 looks stale. |
| NI-7 | `console-nx-cloud.mdoc` | "Coming soon to JetBrains" — has CI pipeline view shipped in JetBrains Nx Console? |
| NI-8 | `node/introduction.mdoc` | Nx 22.x row includes `^20.19.0` — is Node 20 still supported on 22.x despite EOL? |

---

## Linear Issues Status

Linear MCP server was unavailable during this run (same as 2026-06-29).

**Before filing the 26-issue queue from 2026-06-29:** remove H-1, H-2, H-3, H-4, M-1, and NI-2 — those were false positives caused by the wrong Nx baseline. Net queue is **21 issues from 2026-06-29** + **1 new issue (NF-1)** = **22 issues to file**.

All issues should be filed to the Docs team, triage state, labeled "Good for AI agents."
