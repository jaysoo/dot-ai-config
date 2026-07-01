# Nx Astro Docs Staleness Audit — 2026-07-01

Scanned all 503 `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx`, using 17 parallel agents split by directory, each cross-checking claims against `packages/` source where possible.

**Baseline (verified from repo, not training data):**
- Current Nx: **23.1.0-beta.4** (`packages/nx/package.json`)
- Node EOL as of today: **16, 18, 20 all EOL** (Node 20 "Iron" EOL April 2026, which has now passed) — current LTS lines are **22 and 24**
- Today's date: **2026-07-01**

## Correction to the 2026-06-29 audit

That report explicitly flagged itself as having used the wrong Nx baseline (thought current was 22.x). Today's baseline check confirms Nx 23 was **already current** back on 06-29 too. That invalidates a chunk of the previous "High" severity findings, which were really just "this page correctly describes Nx 23, but the auditor thought 23 hadn't shipped yet":

- **H-1** (compat tables labeling 23.x "(current)") — **false positive**, 23.x genuinely is current.
- **H-2** (`consumer-and-provider.mdoc` "documents unreleased v23") — **false positive**, the consumer/provider generators are real and current; confirmed by today's scan that `@nx/react:host`/`@nx/react:remote` really are deprecated in favor of them (see new finding below — the problem is a *different* page not using the new generators, not that this page is wrong).
- **H-3** (`migrating-from-nx-vite.mdoc` "treats Nx 23 as already released") — **false positive**.
- **H-4** (Angular Rspack `v23.0.0` workspace output) — **false positive**, that's just... the correct current version.
- **M-1** (v23/v24 deprecation framing across build tool guides) — **false positive** for the same reason.
- **NI-1, NI-2** — resolved: these were speculative "is this pre-release?" questions; answer is no, v23 is current.

Removing these 6 items from the open queue below. Everything else from 06-29 that didn't depend on the version-baseline mistake was re-spot-checked today (see "Persistent issues" section) and most are **still unfixed**.

**Linear MCP is unavailable for the 5th consecutive audit** (06-11, 06-12, 06-17, 06-24, 06-29, and now 07-01). Zero of the previously-queued issues have actually been filed in Linear. Every item below (new + carried-forward) is still sitting as a to-do for whoever next has working Linear access.

---

## New Findings (2026-07-01)

### N-1 — `guides/Nx Release/publish-rust-crates.mdoc` still broken (persists from 06-29 H-9/NI-4)
**File:** `guides/Nx Release/publish-rust-crates.mdoc`
**Category:** old-nx-version / mismatched-feature
**Issue:** Guide still says "This will be added in a minor release of Nx v21 and this recipe will be updated accordingly" — unfulfilled promise, now 2 majors stale. Also still instructs users to set `release.version.useLegacyVersioning: true`, which the guide's own text says was removed entirely in Nx 22. No indication `@monodon/rust` has shipped the `VersionActions` implementation that would obsolete this workaround.
**Action:** Verify with the Rust plugin owner whether `VersionActions` shipped; if yes, rewrite guide to drop legacy versioning entirely. If no, mark the guide as unsupported/archived rather than presenting a broken recipe as current.

### N-2 — `getting-started/installation.mdoc` shows a stale example version
**File:** `getting-started/installation.mdoc`
**Category:** old-nx-version
**Quote:** "You should see a version number like `22.5.0`."
**Issue:** Cosmetic but visible on the very first page a new user hits — current major is 23.x. Low effort, high-visibility fix.

### N-3 — `reference/Nx Cloud/launch-templates.mdoc` lists EOL Node images with no deprecation notice
**File:** `reference/Nx Cloud/launch-templates.mdoc`
**Category:** old-node-version
**Quote:** `ubuntu22.04-node20.11-v5` … `ubuntu22.04-node20.19-v3` (Node 20 images) listed alongside current `ubuntu22.04-node24.14-v1`.
**Issue:** Node 20 is EOL as of this audit. These images remain presented as ordinary, undeprecated choices. (Carried forward / confirms 06-29 H-11 — still not fixed after 2+ days, expected given no Linear issue was ever filed.)

### N-4 — `technologies/node/Guides/bundling-node-projects.mdoc` targets EOL Node in example
**File:** `technologies/node/Guides/bundling-node-projects.mdoc`
**Category:** old-node-version
**Quote:** `build: { target: 'node18', ... }`
**Issue:** Node 18 has been EOL since April 2025. New projects following this guide compile for a dead runtime. (Confirms 06-29 M-6 — still open.)

### N-5 — `technologies/react/Guides/module-federation-with-ssr.mdoc` uses deprecated generator
**File:** `technologies/react/Guides/module-federation-with-ssr.mdoc`
**Category:** mismatched-feature
**Quote:** `npx nx g @nx/react:host apps/store --ssr --remotes=product,checkout`
**Issue:** `@nx/react:host` is marked deprecated in favor of `@nx/react:consumer` ("Removed in Nx v24" per generator metadata). This is exactly the kind of page that should have been updated when `consumer-and-provider.mdoc` introduced the new generators — it wasn't. New finding, not in the 06-29 report.

### N-6 — `technologies/react/Guides/adding-assets-react.mdoc` uses future tense for a past removal
**File:** `technologies/react/Guides/adding-assets-react.mdoc`
**Category:** old-nx-version
**Quote:** "As of Nx 22, SVGR is removed for Webpack and Next.js, and deprecated for Rspack (will be removed in Nx 23)."
**Issue:** Current version is 23.1.0-beta.4, so if the plan was accurate the Rspack removal has already happened — the sentence should be in present/past tense, not future. Needs a maintainer to confirm the Rspack removal actually shipped in 23 before rewording.

### N-7 — `reference/Deprecated/v1-nx-plugin-api.mdoc` makes a promise that appears to be false
**File:** `reference/Deprecated/v1-nx-plugin-api.mdoc`
**Category:** mismatched-feature
**Quote:** "This API has been superseded by the v2 API and will be removed in Nx 20."
**Issue:** `packages/nx/src/project-graph/plugins/isolation/plugin-worker.ts` still checks for and supports the v1 functions (`processProjectGraph`, `registerProjectTargets`) as of Nx 23 — 3 majors past the stated removal version. Either the API was never actually removed and the doc is wrong, or it needs a corrected version number.

### N-8 — `troubleshooting/unknown-local-cache.mdoc` documents a workaround that no longer works
**File:** `troubleshooting/unknown-local-cache.mdoc`
**Category:** mismatched-feature
**Quote:** "you can prefix any Nx command with `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` to ignore the errors" (framed as a fix for the legacy file-system cache, deprecated in Nx 20).
**Issue:** `packages/nx/src/tasks-runner/cache.ts` (~lines 55-60) shows this env var is explicitly ignored/warned-against when using `DbCache`, which is the default cache backend in Nx 23. Most readers hitting this troubleshooting page today are on `DbCache` and will find the documented fix does nothing.

---

## Persistent Issues Re-Verified Today (carried forward from 2026-06-29, confirmed still unfixed)

Spot-checked against current `packages/` source on 2026-07-01:

| # | File | Issue | Verified |
|---|---|---|---|
| P-1 (was H-5) | `extending-nx/compose-executors.mdoc` | Uses `"builder": "@nx/cypress:cypress"` (should be `"executor"`) and `cypress.json` (Cypress v9 format; current is `cypress.config.ts`) | ✅ still present, line 29/31 |
| P-2 (was H-6) | `extending-nx/migration-generators.mdoc` | Example uses `--project=pluginName`, but `packages/plugin/src/generators/migration/schema.json` has `additionalProperties: false` and no `project` property — this flag would error | ✅ confirmed against live schema.json |
| P-3 (was H-7/H-8) | `features/CI Features/self-healing-ci.mdoc`, `guides/Nx Cloud/use-bun.mdoc` | `actions/checkout@v6` / `actions/setup-node@v6` — no v5 or v6 of these actions exists (latest stable is v4) | ✅ still present in both files |
| P-4 (was M-3) | `technologies/test-tools/storybook/Guides/{overview-react,overview-angular,storybook-interaction-tests}.mdoc` | Import `@storybook/testing-library` and `@storybook/jest`, both deprecated since Storybook 8 in favor of `@storybook/test` | ✅ still present in all 3 files |
| P-5 (was M-12) | `technologies/module-federation/concepts/manage-library-versions-with-module-federation.mdoc` | Imports `ModuleFederationConfig` from `@nx/webpack`; actual export lives in `@nx/module-federation` (`packages/module-federation/src/utils/module-federation-config.ts`) | ✅ confirmed via grep of actual exports |
| P-6 (was M-15) | `concepts/nx-daemon.mdoc` | Says to set `useDaemonProcess` "in the runners options in nx.json"; schema (`packages/nx/schemas/nx-schema.json`) shows it's a top-level `NxJsonConfiguration` property, not nested under a runner | ✅ confirmed against live schema |

Not re-verified this pass (carried forward as-is, flagged in prior report, presumed still open since no Linear issue exists to have prompted a fix): M-2 (GHA `@v3` across 5 files), M-4/M-5 (more Storybook staleness), M-8/M-9 (Angular executor docs), M-17 (CircleCI orb pins), M-20 (`create-preset.mdoc` flag confusion), L-1 through L-17 (mostly cosmetic "as of version X" framing). Full detail in [nx-astro-docs-staleness-2026-06-29.md](./nx-astro-docs-staleness-2026-06-29.md).

---

## Needs Input

Carried forward (still open questions, unaffected by the version-baseline correction) plus new ones from today:

- **NI-A (new)** — `extending-nx/performant-project-graph-plugins.mdoc` says "For Nx 22 and later [createNodes carries the batched signature]. For Nx 21 and earlier, the equivalent export is named `createNodesV2`." Does this still accurately describe Nx 23's canonical API, or has `createNodesV2` since become a pure alias? Needs a plugin-authoring maintainer to confirm.
- **NI-B (new)** — `enterprise/configure-conformance-rules-in-nx-cloud.mdoc` ("in the near future we will dynamically generate a UI...") and `enterprise/custom-workflows.mdoc` ("In a future release of Nx Cloud, custom workflow creation will be released.") — have either of these shipped? If so the docs are stale; if not, low priority.
- **NI-C (new)** — `extending-nx/createnodes-compatibility.mdoc` has an extensive section on supporting Nx 17-20 (all EOL). Legitimate as a compatibility reference for plugin authors, but has no EOL framing. Should it be marked "legacy / rarely needed" or is it intentionally kept as-is?
- **NI-D (new)** — `reference/Nx Cloud/config.mdoc` and `reference/nx-mcp.mdoc` still branch setup instructions on tabs like `Nx <= 19.6`, `Nx < 17`, `Nx < 21.4` (carries forward 06-29 M-16/NI-10). Should these legacy tabs be pruned now that those versions are further EOL, or are LTS users still relying on them?
- **NI-E (carried, was NI-7)** — `guides/Nx Console/console-nx-cloud.mdoc`: "coming soon to JetBrains" — has this shipped yet?
- **NI-F (carried, was NI-6)** — CircleCI `nrwl/nx` orb pinned to `1.7.0`/`1.5.1` in two guides — what's the actual current published version?
- **NI-G (new)** — `reference/releases.mdoc` has a release/support-date table; couldn't fully confirm the listed dates are accurate as of today without external network access to the Nx release history.

---

## Consolidated Linear Issue Queue (queued — MCP unavailable, 5 audits running)

For the **Docs** team, status **Triage**, label **"Good for AI agents"**, assignee: **Linear agent** if assignable, else unassigned.

| # | Title | Severity | Files | Status |
|---|---|---|---|---|
| 1 | Archive or fix `publish-rust-crates.mdoc`: broken guide, unfulfilled v21 promise, instructs enabling a removed feature | High | 1 | Open since 06-29 (N-1) |
| 2 | Fix `compose-executors.mdoc`: use `"executor"` not `"builder"`, `cypress.config.ts` not `cypress.json` | High | 1 | Open since 06-29 (P-1) |
| 3 | Fix `migration-generators.mdoc`: remove non-existent `--project` flag from example (schema has no such property) | High | 1 | Open since 06-29 (P-2) |
| 4 | Fix GitHub Actions versions: `@v6` doesn't exist for `actions/checkout`/`actions/setup-node` | High | 2 | Open since 06-29 (P-3) |
| 5 | Update `module-federation-with-ssr.mdoc`: replace deprecated `@nx/react:host` with `@nx/react:consumer` | High | 1 | **New** (N-5) |
| 6 | Add Node 20 EOL notices to Nx Cloud launch templates | Medium | 1 | Open since 06-29 (N-3) |
| 7 | Update `bundling-node-projects.mdoc`: change `target: 'node18'` to `node22`/`node24` | Medium | 1 | Open since 06-29 (N-4) |
| 8 | Replace deprecated `@storybook/testing-library`/`@storybook/jest` with `@storybook/test` | Medium | 3 | Open since 06-29 (P-4) |
| 9 | Fix `manage-library-versions-with-module-federation.mdoc`: import `ModuleFederationConfig` from `@nx/module-federation`, not `@nx/webpack` | Medium | 1 | Open since 06-29 (P-5) |
| 10 | Fix `nx-daemon.mdoc`: `useDaemonProcess` is top-level in `nx.json`, not nested in runner options | Medium | 1 | Open since 06-29 (P-6) |
| 11 | Fix `v1-nx-plugin-api.mdoc`: verify/correct "will be removed in Nx 20" claim — API still present in Nx 23 source | Medium | 1 | **New** (N-7) |
| 12 | Fix `unknown-local-cache.mdoc`: `NX_REJECT_UNKNOWN_LOCAL_CACHE=0` workaround doesn't apply to DbCache (Nx 23 default) | Medium | 1 | **New** (N-8) |
| 13 | Reword `adding-assets-react.mdoc` SVGR/Rspack removal note from future to present tense (verify Rspack removal shipped in v23) | Low | 1 | **New** (N-6) |
| 14 | Fix example version number in `getting-started/installation.mdoc` (shows 22.5.0) | Low | 1 | Open since 06-29 (L-16), N-2 |
| 15 | Update GitHub Actions `@v3` → `@v4` across 5+ CI guide files | Medium | 5+ | Open since 06-29 (M-2), not re-verified |
| 16 | Fix Storybook `angular-configuring-styles.mdoc` and `best-practices.mdoc`: removed webpack5 builder, dead 7-era URLs | Medium | 2 | Open since 06-29 (M-4/M-5), not re-verified |
| 17 | Fix Angular executor docs: `@angular/build:browser` isn't real; add deprecation note for `@angular-devkit/build-angular:browser` | Medium | 2 | Open since 06-29 (M-8/M-9), not re-verified |
| 18 | Fix CircleCI `nrwl/nx` orb version pins (verify current version first — see Needs Input) | Medium | 2 | Open since 06-29 (M-17/NI-6), not re-verified |
| 19 | Fix `create-preset.mdoc`: confusing `--pluginName` flag example | Low | 1 | Open since 06-29 (M-20), not re-verified |
| 20 | Clean up low-value "as of version X" framing across ~10 pages (Nx 15-19 anchors on evergreen feature pages) | Low | 10+ | Open since 06-29 (L-1..L-17 subset), not re-verified |

**~~Removed as false positives~~** (see correction section above): compat-table "(current)" mislabels, `consumer-and-provider.mdoc`/`migrating-from-nx-vite.mdoc` "unreleased v23" claims, Angular Rspack `v23.0.0` output claim, v23/v24 deprecation-framing complaint.

---

## Recommendation

Linear MCP has now failed for 5 consecutive scheduled audits with zero issues actually filed. If this routine is worth continuing, the Linear connection needs a human to fix (re-auth, re-install the MCP server, or confirm the "Linear" server config is pointed at a real deployment) — an agent cannot self-heal an MCP transport it has no tools for. Until then, this markdown queue is the only record of ~20 outstanding, mostly-still-unfixed documentation bugs.
