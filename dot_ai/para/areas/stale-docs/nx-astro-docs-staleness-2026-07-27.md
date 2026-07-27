# Nx Astro Docs Staleness Audit — 2026-07-27

**Scope:** Full re-sweep of all 480 `.mdoc`/`.mdx` files under `astro-docs/src/content/docs/` in `nrwl/nx`, via 6 parallel section agents (kb a-l, kb m-z, technologies + technologies-tools, reference excl. Deprecated/, guides + features, getting-started/concepts/enterprise/platform-features/misc), each instructed to cross-check documented CLI flags/generator options/config properties directly against `packages/**` source rather than trusting memory.

Current Nx: **23.x** (verified via `packages/nx/migrations.json`, top entries `23-0-0-add-migrate-runs-to-git-ignore` / `23-0-0-consolidate-release-tag-config`). Node current LTS: **24.x** (Active); Node 22.x maintenance; **Node 18 and Node 20 are both EOL** as of today (Node 20 EOL'd April 2026). React current: **19.x**.

**Linear MCP still unavailable — 7th consecutive audit cycle.** This cycle's symptom is more specific than prior ones: `ListConnectors` reports Linear as `"connected": true` but **`"enabledInChat": false`** — the connector is authenticated at the org level but toggled off for this session/chat specifically. Per the tool's own guidance this needs to be re-enabled in this chat's connector settings; it is not a broken integration, just an off switch. All issues below are queued for manual creation (or for a session with Linear enabled) into the running backlog from prior audits — see escalation note at the bottom.

---

## Note on prior-cycle reconciliation

This audit independently re-derived findings without reading the prior backlog first (to avoid anchoring bias), then cross-referenced afterward. Results:

- **Independently re-confirmed as still open** (strong signal — found again from scratch): `compose-executors.mdoc` (builder key), `publish-rust-crates.mdoc`, `terminal-ui.mdoc`, Storybook `@storybook/testing-library`/`@storybook/jest` cluster (now found in **more** files than previously tracked), `angular-configuring-styles.mdoc`, `bundling-node-projects.mdoc` (node18), `manage-library-versions-with-module-federation.mdoc`, `nx-daemon.mdoc` (`useDaemonProcess`), `module-federation-and-nx.mdoc`.
- **Not re-flagged this cycle** (may be fixed, or simply out of this cycle's sampling — do not assume fixed without checking): compatibility-table "current" labels on node/nest/typescript introductions (prior #1), `consumer-and-provider.mdoc` v23-as-unreleased framing (prior #2 — now moot since v23 **is** current), `access-tokens.mdoc` "authentication is changing" (prior #24 — this file was read this cycle and came back clean, good sign it may be fixed), `react-compiler.mdoc` "experimental" framing (prior #21 — also read clean this cycle).
- **Time overtook the finding**: several prior "presents Nx 23 as current when 22 is current" issues (H-1, H-2, H-3, H-4, M-11) are resolved by the calendar, not a doc fix — Nx 23 is now genuinely current. Don't carry these forward as-is.

---

## Confirmed Findings — New or Independently Re-confirmed

### Nx version framing (smell 1)

**F-1 — `reference/releases.mdoc` version-support table stale**
Lines 34–38 show v22 as "Current" and v20 as "LTS", omitting v23 entirely. Per the page's own 18-month-support/new-major-every-~6-months policy, v20 (released 2024-10-06) should have fallen out of support around April 2026. High confidence.

**F-2 — `reference/nx-json.mdoc` contradictory Nx 22/23 change notes**
Lead aside (lines 12–16) says old properties "work until Nx 23"; a later aside (line 581) says legacy `releaseTag*` properties "were removed in Nx 23." Now that Nx 23 is current, the lead callout is stale and should be collapsed into the later one. Medium confidence.

**F-3 — `kb/adding-assets-react.mdoc:50` — SVGR for Rspack already removed, not "will be removed"**
"As of Nx 22, SVGR is removed for Webpack and Next.js, and deprecated for Rspack (will be removed in Nx 23)." Verified via `packages/rspack/src/migrations/update-23-0-0/add-svgr-to-rspack-config.{ts,md}` — this has already shipped in the current v23. The subsequent manual webpack-style SVGR config (lines 53–116) also no longer matches Rspack's actual `withSvgr` composable migration path. High confidence.

**F-4 — `kb/publish-rust-crates.mdoc:13-19` — self-contradictory, still broken (re-confirmed, = prior H-9/NI-4)**
Admits legacy versioning was removed in Nx v22, yet instructs readers this recipe "currently requires" it, with an unfulfilled promise about a "minor release of Nx v21." We're now 2 majors past v21. High confidence, still unfixed since 06-29.

**F-5 — `kb/create-a-host.mdoc` and `kb/create-a-remote.mdoc` — deprecated generators presented as current with zero caveat**
Sibling doc `kb/consumer-and-provider.mdoc` (checked clean this cycle, correctly reflects v23 reality) states `@nx/react:host`, `@nx/react:remote`, `@nx/angular:host`, `@nx/angular:remote` are deprecated in v23, removed in v24. `create-a-host.mdoc`/`create-a-remote.mdoc` present exactly these generators as the current, unqualified way to scaffold Module Federation, with no deprecation notice or pointer to `consumer`/`provider`. Additionally `packages/react/src/generators/remote/schema.json`'s `bundler` option now defaults to `"rspack"`, not webpack, so `create-a-remote.mdoc`'s webpack-dev-server serve instructions no longer match default behavior. High confidence (deprecation) / medium (webpack-dev-server default).

**F-6 — `kb/module-federation-and-nx.mdoc` — host/remote deprecation not mentioned (evolves prior M-13/NI's "As of Nx 19.5" framing)**
Frames `host`/`remote` as current terminology throughout, inconsistent with sibling `micro-frontend-architecture.mdoc` which correctly documents `consumer`/`provider`. Medium-high confidence.

### CLI / generator / config mismatches vs. source (smell 3)

**F-7 — `guides/Adopting Nx/from-turborepo.mdoc:151` and `features/CI Features/sandboxing.mdoc:169-181` — `nx show target --inputs --outputs` flags don't exist**
Verified against `packages/nx/src/command-line/show/command-object.ts` — no such boolean flags. Inputs/outputs are separate subcommands: `nx show target inputs <project>:<target>` / `nx show target outputs <project>:<target>`. `sandboxing.mdoc` additionally invents a version gate ("require Nx 22.6 or later") for a flag syntax that never existed. High confidence.

**F-8 — `guides/ci-deployment.mdoc:200-204` — claims Vite `generatePackageJson` parity is still "coming soon"; it already shipped**
`packages/vite/src/executors/build/schema.json` already defines `generatePackageJson`, implemented in `build.impl.ts`. High confidence.

**F-9 — `technologies/react/next/introduction.mdoc:22` — Next.js peer-dependency floor wrong**
Doc states `>=15.0.0 <17.0.0`; `packages/next/package.json` and `packages/next/src/utils/versions.ts` (`minSupportedNextVersion = '14.0.0'`) both say `>=14.0.0`. High confidence.

**F-10 — `technologies/angular/introduction.mdoc:130` — references non-existent `@nx/angular:service` generator**
No `service` generator exists in `packages/angular/generators.json` or `src/generators/`. The command would fail. High confidence.

**F-11 — `technologies/test-tools/detox/introduction.mdoc:63` — copy-paste error, describes ESLint detection instead of Detox config detection**
`packages/detox/src/plugins/plugin.ts` scans for `detox.config`/`.detoxrc` files; the prose mislabels this as "ESLint configuration file" detection (file list itself is correct). High confidence.

**F-12 — `technologies/angular/angular-rspack/introduction.mdoc:12` — package scope reversed**
Says "The `@angular-rspack/nx` plugin…" — actual package per `packages/angular-rspack/package.json` is `@nx/angular-rspack`. High confidence.

**F-13 — `kb/compose-executors.mdoc:~28-39` — legacy `"builder"` key (re-confirmed, = prior H-5)**
`project.json` example uses `"builder": "@nx/cypress:cypress"`; current schema (`packages/nx/schemas/project-schema.json`) uses `executor`. Still unfixed since 06-29.

**F-14 — `kb/browser-support.mdoc:13-23` — claims generators ship `.browserslistrc` by default; no longer true**
No current application generator (React/Angular/Web/Node/Webpack) has a `.browserslistrc` template. Medium confidence (exhaustive but not 100% certain grep).

**F-15 — `kb/bundling-node-projects.mdoc:115` — EOL `target: 'node18'` in Vite bundling example (re-confirmed, = prior M-6)**
Node 18 has been EOL since April 2025. Rest of corpus uses `node24`. Still unfixed since 06-29.

**F-16 — `kb/create-config.mdoc:130-173` — `AngularRspackPluginOptions`/`DevServerOptions` interfaces significantly outdated**
Real interface (`packages/angular-rspack/src/lib/models/angular-rspack-plugin-options.ts`) has ~20 additional current properties not documented (`appShell`, `baseHref`, `budgets`, `deployUrl`, `prerender`, `serviceWorker`, etc.); doc's `ssl`/`sslKey`/`sslCert` fields don't exist in the current `DevServerOptions` at all, while real fields (`allowedHosts`, `hmr`, `open`) are missing from the doc. High confidence.

**F-17 — `kb/keep-nx-versions-in-sync.mdoc:13` — `nx migrate --from=X --to=Y` syntax doesn't match required form**
`packages/nx/src/command-line/migrate/command-object.ts`/`migrate.ts` require `package@version` form; a bare version throws. High confidence.

**F-18 — `kb/local-generators.mdoc:62-98` — generator scaffold example doesn't match current `@nx/plugin` template**
Actual scaffold (`packages/plugin/src/generators/generator/files/generator/__fileName__.ts.template`) uses `addProjectConfiguration` + `generateFiles` + `formatFiles`, no `installPackagesTask`, no `@nx/js` dependency; generated `schema.json.template` has no `cli` field, contradicting the doc's claim. High confidence.

**F-19 — `kb/release-docker-images.mdoc:~39-60` — example Dockerfile doesn't match current `@nx/node:setup-docker` template**
Shown Dockerfile includes `addgroup`/`adduser`/`chown` steps, `app/`-prefixed COPY, `--prefix` flag, `CMD ["node", "app"]` — actual template (`packages/node/src/generators/setup-docker/files/Dockerfile__tmpl__`) has none of these and ends `CMD ["node", "main.js"]`. High confidence.

**F-20 — `kb/migrate-from-nx-dotnet-core.mdoc:~182-192` — `watch` option example uses wrong config shape**
`TargetConfiguration` has no top-level `args` key; needs `"options": { "args": [...] }`. Medium-high confidence.

**F-21 — `kb/project-graph-plugins.mdoc` — teaches deprecated `createNodesV2` as the primary API**
`packages/nx/src/project-graph/plugins/public-api.ts:146` marks `createNodesV2` `@deprecated — prefer createNodes for new plugins`. Sibling doc `performant-project-graph-plugins.mdoc` gets this right; this page doesn't. Medium confidence.

**F-22 — `kb/terminal-ui.mdoc:15-17` — stale Windows-disabled caveat (re-confirmed, = prior H-10/NI-3)**
`packages/nx/src/tasks-runner/is-tui-enabled.ts` has no Windows-specific disable logic. Still unfixed since 06-29 — this is the **third** cycle flagging it.

**F-23 — `kb/manage-library-versions-with-module-federation.mdoc:78,80,117,119` — wrong import package (re-confirmed, = prior M-12)**
`import { ModuleFederationConfig } from '@nx/webpack'` — not exported there; lives in `@nx/module-federation`. Still unfixed since 06-29.

**F-24 — Storybook `@storybook/addon-essentials`/`addon-interactions`/`testing-library`/`jest` cluster — larger than previously tracked (re-confirmed + expanded, = prior M-3/M-4)**
Now found across **10 files**, up from the 3 tracked previously: `kb/one-storybook-for-all.mdoc`, `kb/one-storybook-per-scope.mdoc`, `kb/one-storybook-with-composition.mdoc` (×2), `kb/storybook-composition-setup.mdoc`, `kb/storybook-interaction-tests.mdoc`, `kb/overview-react.mdoc`, `kb/overview-angular.mdoc`, `kb/angular-configuring-styles.mdoc`, `kb/angular-storybook-compodoc.mdoc`, plus a cosmetic typo in `technologies/test-tools/storybook/introduction.mdoc:76` (`builtStorybookTargetName` → should be `buildStorybookTargetName`). Current Storybook 9+ templates use `storybook/test` instead; `packages/storybook/src/migrations/update-21-2-0/remove-addon-dependencies.ts` actively removes these packages as obsolete. High confidence throughout.

**F-25 — `concepts/inferred-tasks.mdoc:350` — misleading claim that a one-time Nx 18 migration runs on every upgrade**
"If you have an existing Nx Workspace and upgrade to the latest Nx version, a migration will automatically set `useInferencePlugins` to `false`…" — `packages/nx/migrations.json` shows this migration is registered only at `18.0.0-beta.2` with `x-repair-skip: true`; it doesn't run again upgrading from, say, 22→23. High confidence.

**F-26 — `concepts/nx-daemon.mdoc:40` — `useDaemonProcess` documented under wrong config location (re-confirmed, = prior M-15)**
"set `useDaemonProcess: false` in the runners options" — it's a flat top-level `nx.json` property per `packages/nx/schemas/nx-schema.json`, not under `tasksRunnerOptions.options`. Still unfixed since 06-29.

**F-27 — `reference/nx-json.mdoc:592` — `preferDockerVersion` type/default wrong**
Doc says `boolean` / default `false`; `packages/nx/src/config/nx-json.ts:601-604,711-714` shows type `boolean | 'both'` with a conditional default (true when Docker config present). High confidence.

**F-28 — `reference/Conformance/overview.mdoc:71-96` — example config missing current schema fields**
Local example omits `outputPath` and per-rule `status`/`explanation`, present in `packages/nx/schemas/nx-schema.json`'s conformance schema (and correctly documented elsewhere, in `nx-json.mdoc`). Medium confidence — localized simplification gap, not a corpus-wide issue.

### Other defects (not one of the 3 requested smells, but worth a maintainer look)

**F-29 — `reference/Owners/overview.mdoc:367` — malformed JSONC code block**
Explanatory prose spliced directly into a code sample, breaking it. Visibly malformed in source.

**F-30 — `guides/Adopting Nx/adding-to-monorepo.mdoc:10-13` — backwards claim about Lerna/Nx relationship**
"Lerna v6 is powering Nx underneath" — the well-established fact is the reverse (Nx powers/maintains Lerna). Reads as a garbled leftover from an old rewrite.

**F-31 — `features/CI Features/self-healing-ci.mdoc:59` — `actions/checkout@v6`, one version behind the rest of the corpus**
Every other CI example across `guides/`/`features/` (8 occurrences) now uses `@v7`. Low-medium confidence/severity — not broken, just inconsistent.

---

## Needs Input

- `kb/dependency-management.mdoc` — catalog-support version floors ("Nx 22+ pnpm / 22.6+ Yarn / 23.2+ Bun") check out at the major-version level but exact minors unverified against a changelog.
- `kb/cypress-component-testing.mdoc` — text says "migrate to Cypress v10" while linking to a guide about migrating to v11; internal inconsistency, not clearly a staleness issue (v10+ floor still holds).
- `kb/angular-nx-version-matrix.mdoc` — table tops out at Angular ~22.0.0 → Nx >=23.1.0; plausible given Angular's release cadence but needs a human with current Angular release info to confirm no newer major is missing.
- `reference/Nx Cloud/nx-cloud-cli.mdoc`, `reference/Nx Cloud/nx-mcp.mdoc`, `reference/nx-console-settings.mdoc`, `Conformance/*`, `Owners/*` — these wrap closed-source binaries/extensions (`nx-cloud`, `nx-mcp`, Nx Console, Powerpack plugins) with no source in this repo; flag tables/settings can't be cross-checked here. Carried forward from prior audits (NI-6, NI-7, NI-10, NI-11 in 06-29).
- `reference/Nx Cloud/credits-pricing.mdoc` — business pricing data, needs a human/product check.
- `getting-started/Tutorials/gradle-tutorial.mdoc` — CI pins `java-version: '21'`; JDK 21 is still active LTS (JDK 25 is newer), not flagged as stale but worth a glance.
- `kb/local-executors.mdoc` — executor example uses the older manual `(options, context: ExecutorContext)` signature instead of `PromiseExecutor<Schema>`; functionally correct, stylistically stale.
- `kb/yarn-pnp.mdoc`, `kb/root-level-scripts.mdoc`, `kb/manage-library-versions-with-module-federation.mdoc` (line 140) — illustrative terminal/config output pins old tool versions (Yarn 3.6.1/Classic, React 18.2.0); illustrative rather than a recommendation, low priority.

---

## Linear Issues — Updated Running Backlog

Merged against the backlog carried since 06-29/07-10. **Bold** = new this cycle. Re-confirmed items note the cycle count.

| # | Title | Severity | Files | Status |
|---|---|---|---|---|
| 4 | Fix compose-executors.mdoc: use "executor" not "builder" | High | 1 | Open — re-confirmed 3rd cycle |
| 7 | Fix/archive publish-rust-crates.mdoc: broken, self-contradictory legacy-versioning guide | High | 1 | Open — re-confirmed 3rd cycle |
| 8 | Update terminal-ui.mdoc: remove stale Windows TUI caveat | High | 1 | Open — re-confirmed 3rd cycle |
| 13 | Replace deprecated @storybook/testing-library and @storybook/jest with storybook/test | Medium→High | **10** (up from 3) | Open — re-confirmed + scope expanded |
| 14 | Fix Storybook angular-configuring-styles.mdoc: remove webpack5 builder / React-only options | Medium | 1 | Open — re-confirmed |
| 16 | Update bundling-node-projects.mdoc: EOL node18 target | Medium | 1 | Open — re-confirmed |
| 19 | Fix manage-library-versions-with-module-federation.mdoc: import from @nx/module-federation | Medium | 1 | Open — re-confirmed |
| 20 | Update module-federation-and-nx.mdoc: host/remote now deprecated, not just "As of Nx 19.5" framing | Medium | 1 | Open — re-confirmed, scope updated |
| 22 | Fix nx-daemon.mdoc: useDaemonProcess is top-level, not under runners options | Medium | 1 | Open — re-confirmed |
| 1 | Fix Nx-version-as-current labels on node/nest/typescript compatibility tables | High | 3 | **Possibly fixed** — not re-flagged this cycle, verify before closing |
| 2 | Gate/update v23+ framing in consumer-and-provider.mdoc / migrating-from-nx-vite.mdoc | High | 2 | **Resolved by calendar** — v23 is now current; re-verify wording is present-tense |
| 21 | Fix react-compiler.mdoc "experimental" framing | Medium | 1 | **Possibly fixed** — read clean this cycle, verify before closing |
| 24 | Fix access-tokens.mdoc "authentication is changing" stale aside | Medium | 1 | **Possibly fixed** — read clean this cycle, verify before closing |
| **32** | **Fix reference/releases.mdoc: version-support table shows v22 as Current, omits v23, mislabels v20 as still-LTS** | **High** | **1** | **New** |
| **33** | **Fix reference/nx-json.mdoc: contradictory Nx 22/23 change asides + wrong preferDockerVersion type/default** | **High** | **1** | **New** |
| **34** | **Fix kb/adding-assets-react.mdoc: SVGR-for-Rspack already removed in v23, doc says "will be removed"** | **High** | **1** | **New** |
| **35** | **Fix kb/create-a-host.mdoc + create-a-remote.mdoc: present deprecated (removed-in-v24) host/remote generators as current, no caveat** | **High** | **2** | **New** |
| **36** | **Fix guides/from-turborepo.mdoc + features/sandboxing.mdoc: `nx show target --inputs --outputs` flags don't exist** | **High** | **2** | **New** |
| **37** | **Fix guides/ci-deployment.mdoc: Vite generatePackageJson already shipped, doc says "coming soon"** | **High** | **1** | **New** |
| **38** | **Fix technologies/react/next/introduction.mdoc: peer dep floor should be >=14.0.0 not >=15.0.0** | **Medium** | **1** | **New** |
| **39** | **Fix technologies/angular/introduction.mdoc: remove non-existent @nx/angular:service generator example** | **Medium** | **1** | **New** |
| **40** | **Fix technologies/test-tools/detox/introduction.mdoc: copy-paste error describes ESLint detection instead of Detox** | **Medium** | **1** | **New** |
| **41** | **Fix technologies/angular/angular-rspack/introduction.mdoc: package scope reversed (@angular-rspack/nx → @nx/angular-rspack)** | **Low** | **1** | **New** |
| **42** | **Fix kb/browser-support.mdoc: generators no longer ship .browserslistrc by default** | **Medium** | **1** | **New** |
| **43** | **Fix kb/create-config.mdoc: AngularRspackPluginOptions/DevServerOptions interfaces significantly outdated (~20 missing properties)** | **High** | **1** | **New** |
| **44** | **Fix kb/keep-nx-versions-in-sync.mdoc: `nx migrate --from/--to` example missing required package@version form** | **High** | **1** | **New** |
| **45** | **Fix kb/local-generators.mdoc: generator scaffold example doesn't match current @nx/plugin template** | **High** | **1** | **New** |
| **46** | **Fix kb/release-docker-images.mdoc: example Dockerfile doesn't match current setup-docker template** | **Medium** | **1** | **New** |
| **47** | **Fix kb/migrate-from-nx-dotnet-core.mdoc: watch.args example has wrong config shape (needs options wrapper)** | **Medium** | **1** | **New** |
| **48** | **Fix kb/project-graph-plugins.mdoc: teaches deprecated createNodesV2 as primary API instead of createNodes** | **Medium** | **1** | **New** |
| **49** | **Fix concepts/inferred-tasks.mdoc: implies one-time Nx 18 migration runs on every upgrade** | **Medium** | **1** | **New** |
| **50** | **Fix reference/Conformance/overview.mdoc: example config missing outputPath/status/explanation fields** | **Low** | **1** | **New** |
| **51** | **Fix reference/Owners/overview.mdoc: malformed JSONC code block (prose spliced into example)** | **Low** | **1** | **New** |
| **52** | **Fix guides/adding-to-monorepo.mdoc: backwards claim "Lerna v6 is powering Nx underneath"** | **Low** | **1** | **New** |
| **53** | **Bump features/self-healing-ci.mdoc actions/checkout@v6 to @v7 for consistency** | **Low** | **1** | **New** |

Items 3, 5, 6, 9, 10, 11, 12, 15, 17, 18, 23, 25, 26, 27, 28, 29, 30, 31 from prior cycles were **not in scope of this cycle's sampling** (agents didn't happen to re-read those specific files/sections in enough depth to confirm either way) — carry forward as still-open per the 06-29/07-10 audits until specifically re-verified; do not assume fixed.

**All 40 open/new items above should be filed as Linear issues for the Docs team, status Triage, label "Good for AI agents", assigned to a Linear agent if one exists in the workspace (otherwise unassigned).**

---

## Linear MCP Status — Escalation (7th consecutive cycle)

This is the **7th audit in a row** (2026-06-11 → 2026-07-27) where Linear issue creation could not be completed programmatically. Unlike the vaguer "SSE transport removed" / "zero tools despite enabledInChat: true" symptoms of prior cycles, this cycle's `ListConnectors` call returned an unambiguous signal:

```json
{"name":"Linear","installState":"connected","connected":true,"enabledInChat":false}
```

The connector **is authenticated at the org level** — this is not an auth/OAuth problem. It is specifically **toggled off for this chat/session's connector settings**. This is a one-click fix (enable Linear in this session's connector list) rather than a re-authentication or infra issue, and is worth doing directly rather than continuing to retry per-audit — seven cycles of the same blocker is long enough that manual issue creation from this backlog is overdue regardless.

## Recurring Checks to Run

(unchanged from prior audits — see top of this file's README for the checklist)
