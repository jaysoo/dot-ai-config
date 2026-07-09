# Nx Astro Docs Staleness Audit — 2026-07-09

Sixth scan. Scanned all `.mdoc` files under `astro-docs/src/content/docs/` in `nrwl/nx` (7-way parallel split by folder, each agent instructed to cross-check documented CLI/plugin options against actual `packages/*` source rather than assert from memory).

**Verified baseline (do not trust the previous scan's "22.x is current" framing — it was wrong):**
- `npm view nx version` → **23.0.1 is current stable** (`dist-tags.previous` = 22.7.6). The 06-29 scan assumed 22.x was current and 23.x was "unreleased" — that assumption is now confirmed **wrong**; v23 shipped stable. Findings below that hinge on "v23 mentioned as current" were re-verified against source (migrations, deprecation warnings) rather than against version number alone.
- Node.js: `latest` dist-tag is 26.5.0. Node 20 (Iron) LTS's own stated support window ended ~2026-04 (today is 2026-07-09) — Node 20 is EOL.
- Angular pin: `~22.0.0`, supported range `>=20.0.0 <23.0.0`. React peer range: `^18.0.0 || ^19.0.0`.
- **GitHub Actions versions could not be independently verified** — this session's GitHub access is scoped to `nrwl/nx` only, so `actions/checkout`/`actions/setup-node` release history on their own repos isn't queryable. nx's own workflows pin these actions by commit SHA, not a tag, so no version proxy was available either. Treat any "@vN doesn't exist" claim about GH Actions as **needs-input**, not confirmed — this is exactly the kind of claim the 06-29 postmortem flagged as a false-positive source.

**Linear MCP is still unavailable.** `ListConnectors` shows Linear as `installState: connected` / `enabledInChat: true`, but no `mcp__Linear__*` tools actually load in this session (`ToolSearch` finds nothing). This is the **sixth consecutive scan** where issue filing was blocked — see the README for the running tally. All issues below are queued for manual creation again.

---

## Summary

| Category | High | Medium | Needs Input |
|---|---|---|---|
| Old Nx version reference (future tense for already-past events) | 3 | 0 | 0 |
| CLI/plugin mismatch (schema drift, removed/renamed options, wrong command syntax) | 6 | 6 | 3 |
| Old package version / deprecated pattern taught as current | 2 | 2 | 1 |
| Version table / support-window accuracy | 0 | 1 | 2 |
| **Total** | **11** | **9** | **6** |

Plus one **non-staleness content bug** found opportunistically (broken JSON example) — included below since it's in a reference page this audit already had open.

---

## HIGH Severity

### H-1 — Module Federation guides teach deprecated host/remote generators as current, with no pointer to the replacement
**Files:**
- `technologies/module-federation/Guides/create-a-host.mdoc`
- `technologies/module-federation/Guides/create-a-remote.mdoc`
- `technologies/module-federation/Guides/federate-a-module.mdoc`
- `technologies/module-federation/concepts/faster-builds-with-module-federation.mdoc`
- `technologies/module-federation/concepts/micro-frontend-architecture.mdoc`

**Category:** mismatched-feature
**Issue:** `technologies/module-federation/consumer-and-provider.mdoc` correctly states that `@nx/react:host`, `@nx/react:remote`, `@nx/angular:host`, `@nx/angular:remote`, `@nx/angular:setup-mf`, `@nx/react:federate-module`, `@nx/angular:federate-module` are deprecated and slated for removal in v24 — confirmed in source (`packages/react/src/generators/host/host.ts` imports `warnReactHostGeneratorDeprecation`). The five files above are the primary hands-on guides for building Module Federation apps and present those exact deprecated generators as the only/current way to do it, with zero deprecation notice or link to the newer `@nx/react:consumer`/`:provider` model. `create-a-host.mdoc` even states `nx serve <host>` "will discover and serve remotes statically" — directly contradicted by `consumer-and-provider.mdoc`'s own description of the new model's behavior change. A reader who lands on any of these five pages first has no way to discover the replacement exists.

---

### H-2 — `vue/nuxt/introduction.mdoc` documents a `testTargetName` option that doesn't exist
**File:** `technologies/vue/nuxt/introduction.mdoc`
**Category:** mismatched-feature
**Issue:** Doc states default inferred task names are "build, test and serve" and lists `testTargetName` as a plugin option. `NuxtPluginOptions` (`packages/nuxt/src/plugins/plugin.ts`) has no `testTargetName` — only `buildTargetName`, `serveTargetName`, `serveStaticTargetName`, `buildStaticTargetName`, `buildDepsTargetName`, `watchDepsTargetName`. `@nx/nuxt` doesn't infer a test task at all; test/vitest inference moved to the separate `@nx/vitest` plugin. Looks like leftover text from before that split.

---

### H-3 — `react/Guides/adding-assets-react.mdoc` says SVGR removal from Nx 23 is still pending — it already happened
**File:** `technologies/react/Guides/adding-assets-react.mdoc`
**Category:** old-nx-version
**Issue:** "As of Nx 22, SVGR is removed for Webpack and Next.js, and deprecated for Rspack (will be removed in Nx 23)." Nx 23 is now the shipped stable release, and `packages/rspack/src/migrations/update-23-0-0/add-svgr-to-rspack-config.ts` confirms the migration that removes the built-in `svgr` option from Rspack configs already ran as part of v23. The doc should say it's removed, not pending.

---

### H-4 — `build-tools/webpack/Guides/webpack-plugins.mdoc` documents a fully-removed option as merely deprecated
**File:** `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`
**Category:** mismatched-feature
**Issue:** Documents `deleteOutputPath` as `Deprecated — use output.clean instead`, implying it still works. `NxAppWebpackPluginOptions` (`packages/webpack/src/plugins/nx-webpack-plugin/nx-app-webpack-plugin-options.ts`) no longer has this field at all, and `packages/webpack/src/migrations/update-22-0-0/remove-deprecated-options.ts` actively strips it from existing configs. Setting it today does nothing.

---

### H-5 — Storybook guides describe Storybook-8-only addon behavior as universal/current default
**Files:**
- `technologies/test-tools/storybook/Guides/configuring-storybook.mdoc`
- `technologies/test-tools/storybook/Guides/storybook-interaction-tests.mdoc`

**Category:** old-package-version
**Issue:** `configuring-storybook.mdoc` claims every generated project config includes `@storybook/addon-essentials` "which is the shared setting among projects." `packages/storybook/src/utils/versions.ts` pins the default installed Storybook to `^10.1.0`, and `ensure-dependencies.ts` only adds `@storybook/addon-essentials`/`@storybook/core-server` `if (installedStorybookMajorVersion === 8)` — for the current default (v9/v10) neither is added. There's even a migration (`update-21-2-0/remove-addon-dependencies.ts`) that strips `@storybook/addon-essentials` as "no longer needed in Storybook 9+."
`storybook-interaction-tests.mdoc` says enabling interaction tests sets up `@storybook/addon-interactions`, `@storybook/testing-library`, and `@storybook/jest` — none of these are added by the current `@nx/storybook:configuration --interactionTests=true` generator (verified against `util-functions.ts`); Storybook 9+ consolidated these into `@storybook/test`/`storybook/test`.

---

### H-6 — `reference/nx-json.mdoc`: task-options table places runner-scoped options at the wrong nesting level
**File:** `reference/nx-json.mdoc`
**Category:** mismatched-feature
**Issue:** Documents `captureStderr`, `skipNxCache`, `encryptionKey`, `selectivelyHashTsConfig` as settable at the **root** of `nx.json`. Source (`packages/nx/src/config/nx-json.ts:970-977`, `nx-schema.json:813-861`) only supports these nested under `tasksRunnerOptions.<runner>.options`. `selectivelyHashTsConfig` doesn't exist in the schema at all — that property name isn't in source anywhere. Anyone following this table verbatim gets a no-op config.

---

### H-7 — `reference/project-configuration.mdoc`: documents pre-v16 braced `dependsOn` syntax as current
**File:** `reference/project-configuration.mdoc`
**Category:** mismatched-feature
**Issue:** Shows `"projects": "{dependencies}"` (braced form) as a working example. Source (`workspace-json-project-json.ts`) only recognizes bare `'self'`/`'dependencies'` — the braced form was one-time-migrated away before v16. The doc's own example wouldn't work as written; the correct current form (`{ "dependencies": true, ... }`) is shown correctly elsewhere on the same page, so this is an internal inconsistency, not just an omission.

---

### H-8 — `features/CI Features/sandboxing.mdoc`: documents `--inputs`/`--outputs` as flags; they're subcommands
**File:** `features/CI Features/sandboxing.mdoc`
**Category:** mismatched-feature
**Issue:** Instructs `nx show target <project>:<target> --inputs --outputs` (including a "requires Nx 22.6+" aside) to inspect resolved inputs/outputs. `packages/nx/src/command-line/show/command-object.ts` defines `inputs`/`outputs` as **positional subcommands** (`showTargetInputsCommand`/`showTargetOutputsCommand`) — there is no `--inputs`/`--outputs` boolean flag anywhere in that file. The real syntax is `nx show target inputs <project>:<target>` / `nx show target outputs <project>:<target>`. The documented command would fail if run as written.

---

### H-9 through H-11 — `reference/Deprecated/*` use future tense for events that already happened
**Files:**
- `reference/Deprecated/legacy-cache.mdoc` — "In Nx 21, the legacy file system cache will be removed... can still be used in Nx 20"
- `reference/Deprecated/as-provided-vs-derived.mdoc` — "Nx will only use the new behavior in Nx version 20"; "will not be available in Nx 20"
- `reference/Deprecated/rescope.mdoc` — "As of version 20, the `@nrwl` scoped packages will no longer be published to npm"

**Category:** old-nx-version
**Issue:** These are legitimately about deprecated features (correctly out of scope for "presented as current"), but all three describe Nx 20/21 milestones in future tense even though current stable is v23 — three-plus majors past. Reads as if v20/21 haven't shipped yet. **Note: these three files were also flagged in the 2026-06-29 scan (H-13) and are apparently still unfixed** — worth checking whether that Linear issue was ever actually filed, given Linear access has been broken the whole time.

---

## MEDIUM Severity

### M-1 — `react-native/introduction.mdoc` omits two real, currently-shipping plugin options
**File:** `technologies/react/react-native/introduction.mdoc`
**Category:** mismatched-feature
**Issue:** Options table is missing `syncDepsTargetName` (runs `@nx/react-native:sync-deps`) and `upgradeTargetName` (runs `react-native upgrade`), both present in `ReactNativePluginOptions` (`packages/react-native/plugins/plugin.ts`). The "Upgrade React Native" section only documents the older `upgrade-native` generator / manual `rn-diff-purge` path, missing the now-built-in inferred `upgrade` target.

### M-2 — `react/next/introduction.mdoc` documents `serveStaticTargetName` without its deprecation
**File:** `technologies/react/next/introduction.mdoc`
**Category:** mismatched-feature
**Issue:** `serveStaticTargetName` is marked `@deprecated — Use startTargetName instead` in `packages/next/src/plugins/plugin.ts`, but the doc lists it as an ordinary current option, no deprecation note.

### M-3 — `build-tools/webpack/Guides/webpack-plugins.mdoc` missing several current options
**File:** `technologies/build-tools/webpack/Guides/webpack-plugins.mdoc`
**Category:** mismatched-feature
**Issue:** `NxAppWebpackPluginOptions` includes `commonChunk`, `mergeExternals`, `useTsconfigPaths`, `cache`, `publicPath`, `rebaseRootRelative` — none documented, even though comparably obscure options (`skipOverrides`, `watchDependencies`) are.

### M-4 — `build-tools/vite/introduction.mdoc` missing the `compiler` option
**File:** `technologies/build-tools/vite/introduction.mdoc`
**Category:** mismatched-feature
**Issue:** `VitePluginOptions.compiler?: 'tsc' | 'tsgo' | 'vue-tsc'` (selects the typecheck compiler, including the newer TypeScript-Go `tsgo`) isn't documented at all, even though `typecheckTargetName` — which it configures — is.

### M-5 — `guides/Tips-n-Tricks/standalone-to-monorepo.mdoc` shows legacy ESLint config as the default
**File:** `guides/Tips-n-Tricks/standalone-to-monorepo.mdoc`
**Category:** mismatched-feature
**Issue:** Lists `.eslintignore`, `.eslintrc.base.json`, `.eslintrc.json` as the expected config files after conversion. `packages/eslint/src/generators/init/init.ts` defaults to flat config (`eslint.config.js/mjs/cjs`) today — `.eslintignore` isn't even honored by ESLint 9's flat config. Sibling pages (`ban-external-imports.mdoc`, `tag-multiple-dimensions.mdoc`) correctly show both a flat-config tab and a "Legacy" tab; this guide presents only the legacy format.

### M-6 — `guides/ci-deployment.mdoc` describes an already-shipped feature as forthcoming
**File:** `guides/ci-deployment.mdoc`
**Category:** old-nx-version
**Issue:** "We are working on an `NxVitePlugin` plugin for Vite that will have parity with `NxWebpackPlugin`. Stay tuned." `packages/vite/src/executors/build/build.impl.ts` already supports `generatePackageJson` today — the described gap has closed.

### M-7 — `guides/Nx Cloud/bring-your-own-compute.mdoc` teaches legacy DTE pattern, out of step with its own sibling guide
**File:** `guides/Nx Cloud/bring-your-own-compute.mdoc`
**Category:** mismatched-feature
**Issue:** Still sets `NX_CLOUD_DISTRIBUTED_EXECUTION: true # this enables DTE` and uses older action/orb pins, while the clearly-modernized sibling `Nx Cloud/setup-ci.mdoc` uses the newer `start-ci-run --distribute-on="3 linux-medium-js"` syntax with no DTE env var. This guide wasn't updated when its sibling was.

### M-8 — `extending-nx/project-graph-plugins.mdoc` teaches the about-to-be-superseded `createNodesV2` export exclusively
**File:** `extending-nx/project-graph-plugins.mdoc`
**Category:** old-nx-version
**Issue:** The main plugin-authoring tutorial only shows `createNodesV2`. Per `extending-nx/performant-project-graph-plugins.mdoc` and `extending-nx/createnodes-compatibility.mdoc` (both in the same section), Nx now prefers plain `createNodes` (v2 signature), with `createNodesV2` becoming a deprecated fallback alias as of v23 — which has shipped. New plugin authors following this specific page will write against the soon-to-be-deprecated export with no indication a preferred alternative exists.

### M-9 — `reference/releases.mdoc`: Node 20 shown as supported LTS past its own stated support window
**File:** `reference/releases.mdoc`
**Category:** old-node-version
**Issue:** Table lists Node v20 (released 2024-10-06) as LTS. By the page's own stated policy ("18 months of support from release"), v20's support window ended around 2026-04 — three months before today (2026-07-09). Medium confidence: the *page's own math* says this row should be gone or marked EOL; whether Nx product support has a longer grace period than the table implies is unverified.

---

## Needs Input

### NI-1 — GitHub Actions version claims (multiple files) — could not verify externally
**Files:** `guides/Nx Release/publish-in-ci-cd.mdoc` (`actions/checkout@v3`, `actions/setup-node@v3`), `features/CI Features/split-e2e-tasks.mdoc` (`actions/setup-node@v3`), various others noted in the 06-29 report as `@v3` vs `@v4` vs `@v6`.
**Question:** This session's GitHub access is scoped to `nrwl/nx` only, so `actions/checkout`/`actions/setup-node`'s own release history isn't queryable, and nx's own workflows pin by commit SHA rather than tag — no in-repo proxy either. The **internal inconsistency** (same doc set uses `@v3` in some examples, newer majors in others, e.g. `self-healing-ci.mdoc` uses `@v6`) is a solid, low-risk finding regardless of which exact version is "right." But do not file an issue asserting a specific version is wrong without an external check first — this is the exact mistake flagged in the 06-29 postmortem.

### NI-2 — Module Federation guides (H-1): rewrite vs. leave as-is?
**Question:** Is leaving `create-a-host.mdoc`/`create-a-remote.mdoc` on the old generators intentional (e.g., Angular federation still fully depends on them until v24), or is this a genuine oversight where the doc team needs to add deprecation callouts/rewrite toward consumer/provider? This is a scope/roadmap call, not a factual dispute — the deprecation itself is source-confirmed.

### NI-3 — `reference/nx-json.mdoc`: is `preferDockerVersion: 'both'` new, and is `replaceExistingContents` a doc bug or a regression?
**File:** `reference/nx-json.mdoc`
**Question:** `releaseTag.preferDockerVersion` is typed `boolean | 'both'` in source but documented as plain `boolean` — recent addition docs haven't caught up to, or intentional omission? Separately, `release.changelog.workspaceChangelog.replaceExistingContents` is documented as an `nx.json` option but has no backing field in `NxReleaseChangelogConfiguration` — it's CLI-flag-only in source. Was it ever wired from `nx.json` (regression) or always CLI-only (doc simply wrong)?

### NI-4 — `dotnet` and `java/maven` docs: version floor vs. recommended version
**Files:** `technologies/dotnet/introduction.mdoc`, `technologies/java/maven/introduction.mdoc`
**Question:** dotnet docs state ".NET SDK 8.0 or newer" while `mise.toml` pins dotnet to "9" for this repo's own dev — should the docs nudge toward 9 as recommended, or is 8.0 genuinely still the correct floor for end users? Separately, source now has `maven3`/`maven4` batch-runner-adapter directories suggesting possible Maven 4 support in progress, but `maven/introduction.mdoc` only states ">= 3.6.0" — is Maven 4 support user-facing yet?

### NI-5 — Storybook doc URLs: do the Storybook-7-era `/docs/{framework}/...` links actually 404?
**Files:** multiple `test-tools/storybook/Guides/*.mdoc` (carried over from 06-29 scan, still apparently unfixed)
**Question:** Not independently re-verified live this pass (proxy/network constraints noted by the scanning agent). Worth an actual link check before filing.

### NI-6 — Are the six 2026-06-29-queued "still open" Deprecated-folder tense fixes (H-13 in that report, same 3 files as H-9–H-11 here) actually queued in Linear anywhere, or lost?
**Question:** Given Linear has been unreachable for at least 3 scans running (06-17, 06-24, 06-29, and now 07-09), it's worth confirming whether *any* of the ~44 cumulative queued issues across all 5 prior scans have ever actually been filed by a human, or whether this list has just been growing unchecked. See the tally in the README.

---

## Other bug found (not a staleness category, flagging anyway)

### B-1 — `reference/Owners/overview.mdoc`: broken JSON example
**File:** `reference/Owners/overview.mdoc`
**Issue:** A sentence of prose ("`projects: ["*"]` matches every project and expands to...") is pasted mid-line inside a `jsonc` code block, immediately after `"description": "The Finance team owns these projects,` — breaks the example as invalid JSON. Content-corruption bug, not a version/staleness issue, but it's in a reference page this audit touches and is a quick, unambiguous fix.

---

## Linear Issues to Create (queued — MCP still unavailable, 6th scan in a row)

Group into these issues for the **Docs** team, **triage**, labeled **"Good for AI agents"**:

| # | Title | Severity | Files |
|---|---|---|---|
| 1 | Add deprecation notices to Module Federation host/remote guides, point to consumer/provider model | High | 5 files |
| 2 | Remove nonexistent `testTargetName` from `@nx/nuxt` plugin option docs | High | 1 file |
| 3 | Fix adding-assets-react.mdoc: SVGR removal from Rspack in v23 already happened, not pending | High | 1 file |
| 4 | Remove fully-deleted `deleteOutputPath` webpack option from docs (not just "deprecated") | High | 1 file |
| 5 | Fix Storybook guides: addon-essentials/testing-library/jest no longer added by current (v9/v10) generator | High | 2 files |
| 6 | Fix nx-json.mdoc: task options (captureStderr, skipNxCache, encryptionKey) are nested under tasksRunnerOptions, not root; remove nonexistent selectivelyHashTsConfig | High | 1 file |
| 7 | Fix project-configuration.mdoc: remove broken pre-v16 braced `dependsOn` syntax example | High | 1 file |
| 8 | Fix sandboxing.mdoc: `nx show target` inputs/outputs are subcommands, not `--inputs`/`--outputs` flags | High | 1 file |
| 9 | Fix Deprecated/legacy-cache, as-provided-vs-derived, rescope: past tense for Nx 20/21 events (duplicate of unresolved 06-29 issue #10 — please confirm original was filed) | High | 3 files |
| 10 | Add missing react-native plugin options (syncDepsTargetName, upgradeTargetName) and upgrade-target docs | Medium | 1 file |
| 11 | Add deprecation note to next.js `serveStaticTargetName` option | Medium | 1 file |
| 12 | Add missing webpack plugin options (commonChunk, mergeExternals, useTsconfigPaths, cache, publicPath, rebaseRootRelative) | Medium | 1 file |
| 13 | Add missing vite plugin `compiler` option (tsc/tsgo/vue-tsc) | Medium | 1 file |
| 14 | Fix standalone-to-monorepo.mdoc: show flat ESLint config as default, not legacy .eslintrc | Medium | 1 file |
| 15 | Remove stale "NxVitePlugin parity coming soon" note from ci-deployment.mdoc (already shipped) | Medium | 1 file |
| 16 | Modernize bring-your-own-compute.mdoc to match setup-ci.mdoc (remove legacy DTE pattern) | Medium | 1 file |
| 17 | Update project-graph-plugins.mdoc to teach createNodes (v2 signature) alongside/instead of createNodesV2 | Medium | 1 file |
| 18 | Update or remove Node 20 LTS row in releases.mdoc (past its own stated support window) | Medium | 1 file |
| 19 | Fix broken JSON example in Owners/overview.mdoc | Low (bug, not staleness) | 1 file |

---

## Cumulative Linear Backlog Warning

This is the **sixth** scan (2026-06-11, 06-12, 06-17, 06-24, 06-29, 07-09) to queue Linear issues that could not actually be filed because the Linear MCP connector, while showing as "connected" in `ListConnectors`, has never exposed usable tools in any of these sessions. Across the five prior scans, roughly 44 issues were queued (8 + 18 + 26, with overlap/re-aggregation between some). Nobody has confirmed whether any have ever been manually filed. **Recommend a human check the Linear connector configuration directly** rather than relying on another scan to retry it — the automated retry has failed 6/6 times.
