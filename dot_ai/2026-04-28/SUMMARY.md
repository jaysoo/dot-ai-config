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

## Active Sessions

No changes — NXC-3711 was not in active sessions list.
