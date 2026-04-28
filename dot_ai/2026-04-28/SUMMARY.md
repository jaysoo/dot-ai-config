# 2026-04-28 Summary

## NXC-3711: Remove Tailwind setup-tailwind generators — MERGED

PR [#35049](https://github.com/nrwl/nx/pull/35049) merged at 14:56 UTC (merge commit `933eb69826`).

### Final-day work

- **Rebased** branch on master twice (initial conflicts in cypress-component-tests-implicit-dep, graph/migrate/tailwind.config.js, packages/next/.eslintrc.json; second rebase added template-file deletion conflicts).
- **Addressed PR review** from leosvelperez (CHANGES_REQUESTED, Apr 10):
  1. Restored 8-line institutional `catch`-block comment in `packages/{angular,react,next,vue}/tailwind.ts` (explains why we don't throw — VSCode/WebStorm exec the config for autocomplete).
  2. Restored BYO-Tailwind auto-detect in `packages/next/src/generators/cypress-component-configuration/cypress-component-configuration.ts` — preserves `@tailwind base/components/utilities` injection into `styles.ct.css` for users with existing `tailwind.config.{js,cjs}`.
  3. Added 4 deprecation-warning specs (`packages/{angular,react,next,vue}/tailwind.spec.ts`) — assert `console.warn` fires once per process per `@nx/*/tailwind` import. Prevents silent removal of warning logic before Nx 24.
  4. Issue #4 (changelog migration note) already covered by `BREAKING CHANGE:` block in commit body.
- **Graph tailwind configs simplified**: replaced per-dep listings with `ui-*/src` + `shared/src` globs in `graph/{client,migrate,ui-code-block,ui-project-details,ui-render-config}/tailwind.config.js`. Tailwind's content scanner natively supports `*` — adding new graph libs no longer requires touching tailwind configs.
- **PR description rewritten** to caveman-lite style — dropped bolding, collapsed redundant per-package lists, removed "What's added" section.
- **Verified vite test failures unrelated** — same 3 suites / 7 tests / 2 snapshots fail on master HEAD, pre-existing drift in TS-solution-setup paths.

### Cumulative scope (as merged)

- 5 `setup-tailwind` generators removed (angular, react, next, vue, remix).
- `--style=tailwind` (React/Next), `--addTailwind` (Angular), `tailwind` choice from `create-nx-workspace` removed.
- `@nx/{angular,react,next,vue}/tailwind` barrel exports kept but warn at runtime; full removal slated for Nx 24.
- Runtime tailwind plumbing kept unchanged: `@nx/angular-rspack` detection, ng-packagr stylesheet support, Cypress CT injection in @nx/angular and @nx/next.

## Billing Architecture Review (research only · no code changes)

Walked the Nx Cloud (Ocean) Kotlin billing system to understand current tracking/charging model and identify gaps for itemized network/disk billing.

### Findings

- **Three independent usage streams** captured at runtime:
  - Compute: `MWorkflow.details.steps[].instances` (ms × resourceClass multiplier) — `libs/shared/utils/credit-usage-kotlin/ComputeCreditUsage.kt:55-185`
  - Execution: `MCiPipelineExecution` (count of cache-enabled CIPEs × 500) — `ExecutionCreditUsage.kt:19-61`
  - AI Fix: `MCipeFix` + `MAIFix` (USD cost × 1.2 margin → credits, billable only when `apiKeySource = NX_CLOUD`) — `AiCreditUsage.kt:66-302`

- **Monthly cycle**: `apps/aggregator/src/main/kotlin/operations/billing/`
  - `CreateBillingRecords.kt:59-262` → composes `MBillingRecord` (idempotent on `orgId+periodStart+periodEnd`)
  - `ProcessOrgsByPlan.kt` cron (1st UTC) creates records; Tue/Wed/Thu 5pm UTC pushes to Stripe via `HandleUnprocessedBillingRecords.kt`
  - Plan inclusions in `Plan.kt:10-90`; modifiers (temporal credit pools) at `Plan.kt:553-585`
  - Pricing constants: `Constants.kt:98-109`; resource-class multipliers: `ResourceClasses.kt:122-150`

- **Gap for itemized network/disk billing**: zero capture today. No `bytes`/`networkBytes`/`storageBytes` fields on any usage model. No time-series usage table — all aggregation monthly. Compute granularity is step-level, no per-task line items. Plan modifier system + Stripe handler are extensible — adding new credit types (`networkCredits`, `storageCredits`) on `MBillingRecord` would auto-emit Stripe line items.

### Deliverables

- High-level architecture writeup (in conversation)
- Self-contained HTML dashboard with Mermaid diagrams: `.ai/2026-04-28/tasks/billing-architecture-summary.html`
  - Sections: at-a-glance, 3-stream cards, pricing formulas, data model graph, code map, sequence diagram, 5-phase roadmap for adding network/disk

## NXC-4178: Remove deprecated stylesheet options from non-Angular generators — MERGED

PR [#35103](https://github.com/nrwl/nx/pull/35103) merged at 18:25 UTC (merge commit `d1e9a4349a`).

### Final-day work

- **Rebased on master after #35049 merged** — NXC-3711 (Tailwind removal) and NXC-4178 (less/styled-* removal) overlapped on 27 files; saved pre-rebase HEAD as temp branch, reset to master, cherry-picked our commit, resolved each conflict by keeping master's tailwind handling + our additional removals on top. PR shrank from 214 files / +3810 / -3503 → 93 files / +181 / -2745.
- **Addressed Plannotator review (round 1)**: tightened `assets.json` globs (`src/**/*.js` → specific loader path) in rspack/webpack, dropped Tailwind from less-loader deprecation message, switched `hasWarned` module-scope to `process.env.__NX_LESS_DEPRECATION_WARNED` for HMR robustness, added `less-loader` to rspack eslint `ignoredDependencies`.
- **Addressed Plannotator review (round 2)**: dropped stale `nx.dev/recipes/...` URL from deprecation message (will be covered by separate bundler-eject follow-up), reflagged commit `feat(misc)!:` with explicit `BREAKING CHANGE:` footer listing rejected `--style` flags + `cssInJsDependenciesBabel` removal from `@nx/react`.
- **Re-corrected stale snapshots**: an earlier `-u` regenerate against a broken local env had baked in pre-#34965 legacy snapshots. CI failure log made the divergence obvious — restored master's modern snapshots in `next/library.spec.ts` and `next/application.spec.ts`, only stripping tests that exercise removed `--style` values. Removed an over-eager template-comment promotion in `next.config.js__tmpl__`.
- **Dead version-constant cleanup** (Plannotator round 3 / Issue 1): dropped `lessLoader`/`emotionServerVersion`/`babelPluginStyledComponentsVersion` from `next/utils/versions.ts`; 12 dead constants from `react/utils/versions.ts`; `lessVersion` from `vue/utils/versions.ts` (public via `export *`); and 4 rsbuild plugin/swc-plugin constants. BREAKING CHANGE footer updated to mention public-API drops.

### Key learning (logged for future PRs)

- "Tests fail on master too" ≠ "tests are broken on master." Local environment was emitting legacy generator output for unknown reasons (stale build artifact, cache, or daemon state — never fully tracked down). When CI failure log diverged from local, **trust CI**, not local. Reviewer was right; I dismissed the snapshot regression for two iterations before the CI log forced the issue.

### Cumulative scope (as merged)

- `--style=less`, `--style=styled-components`, `--style=styled-jsx`, `--style=@emotion/styled` rejected at schema validation in React/Next/Nuxt/Vue/Web/Workspace generators.
- Existing `.less` imports keep compiling via new `deprecated-less-loader.js` wrappers in webpack/rspack that emit a one-time build-time warning.
- Public-API drops: `cssInJsDependenciesBabel` (`@nx/react`), `lessVersion` (`@nx/vue`).
- Internal version-constant cleanup across next/react/vue/rsbuild.
- Angular generators unchanged.

## Active Sessions

No changes — NXC-3711 and NXC-4178 were not in active sessions list.
