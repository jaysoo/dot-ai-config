# NXC-4179: Re-enable e2e tests after lodash fix

## Status

MERGED - PR #36408 (b0238f4920, 2026-07-21). Linear NXC-4179 closed. Follow-up: NXC-4690.

## Goal

Revert skip commit #35104 (18 e2e tests disabled 2026-03-31 for the lodash@4.18.0 `assignWith is not defined` bug hit via html-webpack-plugin -> `lodash/template`).

## What was done

1. Verified upstream fix: lodash@4.18.1 (2026-04-01) fixes it; reproduced both directions with `require('lodash/template')`. lodash/lodash#6167 closed.
2. `git revert` of #35104 across 10 e2e files. Conflict resolutions:
   - kept `reservePort` refactor from #35325
   - kept root-level-tailwind CT test deleted (removed intentionally in #35049)
3. storybook-angular serve test re-skipped for a NEW reason: `@storybook/angular@10.5.2` peers (`typescript ^4.9||^5` + build-angular pull) unresolvable on Angular 22 + TS 6 workspaces -> deterministic npm ERESOLVE in the generator install. Filed NXC-4690.
4. CI attempt 1 failure -> product bug found + fixed (`fix(testing)`): `addDefaultCTConfig` prepended the `nxComponentTestingPreset` import unconditionally, so re-running `cypress-component-configuration` duplicated the declaration. Masked for years because ts-node/CJS transpile tolerated duplicate imports; Cypress 15.14+ loads configs via esbuild which rejects them. Fix: tsquery guard (ImportSpecifier/BindingElement) + idempotency unit test.
5. CI attempt 2 failure -> e2e infra fix (`chore(testing)`): both buildable-lib CT tests died with EADDRINUSE 8080. webpack-dev-server `port: 'auto'` probes from fixed base 8080 (Server.js:529 honors `WEBPACK_DEV_SERVER_BASE_PORT`); parallel e2e-ci tasks on one agent (#35325) race it. Fix: per-jest-process base port in `e2e/utils/get-env-info.ts`.
6. CI attempt 3: fully green. PR marked ready 2026-07-20, merged 2026-07-21.

## Gotchas

- `tail -40` on a background e2e run ate the failure output - rerun unpiped.
- Nx Cloud self-healing pushed an empty `[Self-Healing CI Rerun]` commit onto the branch; `push_branch` pull-rebase folded it in. Harmless (empty diff) but verify before assuming corruption.
- `e2e-plugin nx-plugin-ts-solution` "Cannot find project" right after generate = unrelated daemon/graph flake (NXC-2793 family); passed on retry untouched.

## Local validation

react CT suite (incl. babel test), react storybook suite, angular CT app test - all via `nx run <proj>:e2e-local --testPathPatterns=...`.

Polygraph session `nimble-cheetah-04f2c982`, single repo nrwl/nx - https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/nimble-cheetah-04f2c982
