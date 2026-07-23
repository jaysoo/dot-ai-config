# Summary for 2026-07-20

## NXC-4179: Re-enable e2e tests skipped for lodash@4.18.0 bug (nx) - PR #36408

Reverted skip commit #35104 (17 tests re-enabled; 1 kept skipped) after verifying lodash@4.18.1 fixes the `assignWith is not defined` bug in `lodash/template`. Two additional bugs unmasked and fixed in the same PR:

- `fix(testing)`: `addDefaultCTConfig` duplicated the `nxComponentTestingPreset` import on cypress CT generator re-run; Cypress 15.14+ esbuild config loading rejects duplicate bindings (ts-node previously tolerated them).
- `chore(testing)`: webpack-dev-server `port: 'auto'` fixed-base-8080 race between parallel e2e-ci tasks -> per-process `WEBPACK_DEV_SERVER_BASE_PORT` in e2e utils.

storybook-angular serve test stays skipped: `@storybook/angular@10.5.2` peers unresolvable on Angular 22 + TS 6 (npm ERESOLVE); filed **NXC-4690** as follow-up. CI green same day, marked ready; merged 2026-07-21 (`b0238f4920`).

Details: `dot_ai/2026-07-20/tasks/nxc-4179-re-enable-e2e-lodash.md`
Polygraph session `nimble-cheetah-04f2c982`, single repo nrwl/nx - https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/nimble-cheetah-04f2c982

## DOC-552 follow-ups (astro-docs, separate session)

Task files from a concurrent session (see each file for status):

- `doc-552-localize-kb-validator.md` - keep KB validator session-local (complete locally, amend not force-pushed at time of writing)
- `doc-552-netlify-last-modified-build.md`
- `doc-552-restore-search-facets.md` / `restore-search-filter-default.md` - Pagefind auto-collapse regression from hidden `section` filter group
- `doc-552-style-guide-pass.md`
- `validate-knowledge-base.mjs`
