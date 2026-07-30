# CLOUD-4891: Cookie-based env overrides for cloud e2e tests

- Linear: https://linear.app/nxdev/issue/CLOUD-4891
- Repo: `~/projects/ocean-worktrees/CLOUD-4891`, branch `CLOUD-4891` (off `origin/main`)
- Polygraph: `fresh-wombat-25345f30`
- Status: draft PR https://github.com/nrwl/ocean/pull/12652 (2026-07-30), awaiting CI
- Local e2e proof (2026-07-30): spec ran against dev server + shared mongo on 27017
  (skipped `start-deps`, port owned by cloud-4246 stack; e2e DB isolates data). Passes;
  consistent first-attempt flake = vite dev-server blank-page reload, retry green,
  CI serveDist prod build unaffected. Video/frames/trace: worktree `dist/cloud-4891-e2e-demo/`.

## Problem

Env-driven flags are static in `.env.serve.e2e` / `.env.serveDist`. One serve = one
permutation. The demo-tab regression (hidden for OSS/Enterprise when `DEMO_MODE=true`
and `task_analytics_demo` off) slipped because no test could express that combination.

## Mechanism

Per-request `e2e-env-override` cookie, base64 JSON, merged into
`context.serverEnvironment` in `createDataArgs`, gated on `E2E_TEST_MODE`.
One indirection point, zero read-site changes. Cookie lives in the Playwright
browser context, so teardown resets it and parallel workers do not bleed.

## Files (commit `19b0e2dae4`, 10 files)

| File | What |
| --- | --- |
| `libs/nx-cloud/util-environment/src/lib/e2e-env-override.ts` | Wire format. No `process.env` parsing, so the test process can import it without constructing `serverEnvironment`. |
| `.../util-environment/src/lib/environment.server.ts` | Extracted `sourceEnvironmentObject` out of the `superRefine` chain so field schemas are reachable via `.shape`. Added `resolveEnvironmentOverrides` + `resolveEnvOverridesFromCookieHeader`. |
| `.../util-environment/package.json` | New `./e2e-env-override` export. |
| `libs/nx-cloud/util-auth/src/lib/util.server.ts` | The merge, gated on `E2E_TEST_MODE`. |
| `libs/e2e/e2e-nx-cloud-utils/src/lib/fixtures/env-override.fixture.ts` | Playwright `envOverride.set/clear`. |
| `apps/nx-cloud-e2e-playwright/e2e/workspace/task-analytics-demo-rollout-env-override.spec.ts` | Proof spec. |
| `libs/e2e/e2e-nx-cloud-utils/tsconfig.lib.json` | `nx sync` (new dep on util-environment). |

## Gotchas found

- **`nx sync` was missing** from the original commit. `e2e-nx-cloud-utils` now depends
  on `util-environment`, so `tsconfig.lib.json` needed the project reference. Every
  `nx run-many` fails with "workspace is out of sync" until it is run.
- **Derived fields do not follow the merge.** `ServerEnvironment` is
  `SourceEnvironment.transform(...)`. The shallow merge overrides source fields only, so
  `SOCIAL_AUTH_ENABLED`, `SESSION_MAX_AGE`, `PRIVATE_ACCESS_SETTINGS`,
  `IS_*_INTEGRATION_ENABLED`, `ONE_PAGE_FLOW_FLAGS` keep their boot values. Documented on
  `resolveEnvironmentOverrides`. None of the five covered flags have derived dependents.
- Dropped the unit case asserting `NX_CLOUD_MODE: 'private-enterprise'` is accepted -
  the issue says leave `NX_CLOUD_MODE` on serve-config, so a passing test advertising it
  is a trap. Swapped to `NX_CLOUD_ENVIRONMENT`.
- The new spec gets an **inferred** `e2e-ci--e2e/workspace/task-analytics-demo-rollout-env-override.spec.ts`
  target against the default `serveDist`. `.env.serveDist` already has `DEMO_MODE=true`,
  `NX_CLOUD_TASK_ANALYTICS_DEMO_ENABLED=true`, `E2E_TEST_MODE=true`, so the spec's
  preconditions hold. No project.json entry needed.

## Verification

`testjs` (21 tests), `lint`, `typecheck` green for `nx-cloud-util-environment`,
`nx-cloud-util-auth`, `e2e-nx-cloud-utils` + 53 dependency tasks. `nx format:check` clean.

**The e2e spec has never executed.** The Polygraph sandbox denies port binding, and this
worktree has no Docker deps stack (per AGENTS.md that needs its own `.env` ports +
`docker compose -f docker-compose.deps.yaml up -d`). CI is the validation path.

## Follow-up (separate PR, per Jack)

Retire the `serveDistTaskAnalyticsRolloutDisabled` apparatus. It exists only to permute
`NX_CLOUD_TASK_ANALYTICS_DEMO_ENABLED=false`:

- `apps/nx-cloud/package.json:178` - the serve target (port 3020, own Mongo DB
  `nrwl-api-for-task-analytics-rollout-disabled-e2e`)
- `apps/nx-cloud-e2e-playwright/playwright.config.ts:10,16,55-56` - baseURL +
  webServerCommand branches
- `apps/nx-cloud-e2e-playwright/project.json:103` - the `e2e-ci--...task-analytics-entitlement-navigation.spec.ts`
  target override

Convert `task-analytics-entitlement-navigation.spec.ts` to `envOverride.set()` against the
default serve and all of the above deletes. Note PR #12542 just fixed that target's env
loading (Nx's `.env.<targetName>` lookup is exact-match), so it is freshly touched code.

## Related

- Ocean PR #12542 (merged) - `envFile` fix for `serveDistTaskAnalyticsRolloutDisabled`
- Session `nx-cloud-surveys-71ca80da` - motivating case: `NX_CLOUD_CANCELLATION_SURVEY_ID`
  gated a dialog, invisible locally until `env.override` edit + server restart. Two open
  draft branches also touch `environment.server.ts` (`posthogSchemaObject`) - rebase risk.
