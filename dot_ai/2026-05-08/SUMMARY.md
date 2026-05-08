# Summary — 2026-05-08

## Merged today
- **#35594** `chore(misc): migrate tailwind v3 to v4` (NXC-4430) — merged 19:50 UTC
- **#35611** `feat(bundling)!: remove SVGR option and provide withSvgr migration` (NXC-4156) — merged 19:36 UTC
- **#35623** `docs(node): add Node 26 to compat matrix` (NXC-4374) — merged 15:37 UTC
- **#35626** `fix(repo): drop node 26 from nightly matrix until playwright/yauzl fix` (NXC-4451) — merged 16:41 UTC

## NXC-4299: Native TS type stripping — review iteration (PR #35608, open)

Six fix-up commits today on the v23 native-strip enable PR, all responding to review feedback or CI fallout from yesterday's `feat(core): enable Node.js native TypeScript type stripping by default`:

- `bda1a9a7bd` — escalate `MODULE_NOT_FOUND` fallback to swc/ts-node when tsconfig-paths alone can't recover
- `1aa7168949` — route `.mts` through `loadTsFile`, surface `NX_NATIVE_TS_STRIP=false` opt-out hint on unrecoverable strip failures
- `bcc23cace7` — dashed anchor in env-var docs link, simpler TLA e2e assertion
- `094077ba99` — force-register an ESM TypeScript loader on the dynamic-import fallback path (covers `.ts` ESM imports under strip mode)
- `99ee9e8e2d` — gate `loadTsFile` on TS extensions, handle `ERR_REQUIRE_ASYNC_MODULE`
- `d665fa46fd` — `nx format:write` cleanup

Pattern: each iteration narrowed the fallback ladder (native strip -> `tsconfig-paths` -> swc/ts-node -> ESM loader register) so users hit a working path without flipping the env var manually.

## NXC-4154: Vite 7 -> 8 migrations — review iteration (PR #35614, draft)

Three migration entries land in `packages/vite/migrations.json`: `rename-rollup-options-to-rolldown-options` (tsquery codemod, top-level + nested `environments`, .ts/.mts/.mjs/.cts/.cjs configs), `create-ai-instructions-for-vite-8` (writes `tools/ai-migrations/MIGRATE_VITE_8.md`), and the `23.0.0` packageJsonUpdates entry that bumps `vite -> ^8.0.0` and `@vitejs/plugin-react -> ^6.0.0`.

Today's iterations:

- Reviewer feedback round 1: rename codemod was missing `requires: { vite: ">=8.0.0" }` gate — without it, `@remix-run/dev` users (skipped via `incompatibleWith`) keep Vite 7 but get rolldownOptions rewrite anyway, breaking their build silently. Added the gate. Same round flagged em dashes in user-facing AI doc (lands as `tools/ai-migrations/MIGRATE_VITE_8.md` in user repos) — replaced 4 instances with periods/sentence breaks. Memory `feedback_no_em_dash_or_arrow_in_comments.md` updated to call out committed markdown shipped to user workspaces as in-scope for the rule.
- Cypress claim accuracy: original AI doc said "Cypress CT does not support Vite 8 yet — pin to Vite 7." Verified upstream — Cypress 15.14.0 (released 2026-04-16) added Vite 8 support (refs cypress-io/cypress#33078). Doc rewritten to assume cypress is at latest; "Project-Level Vite 7 Pinning" section retitled to "Custom Babel Plugins" only. Also surfaced a stale guard in `packages/cypress/src/generators/component-configuration/component-configuration.ts:48-60` throwing on `vite >= 8` — out of scope for NXC-4154, filed as new Linear issue NXC-4448 (blocking).
- Migration version bumps: `23.0.0-beta.7 -> beta.9 -> beta.10` as Nx releases shipped through the day.
- Two clean rebases on master.

Three `feat(vite)` migration registrations now coexist with master's `ensure-vitest-package-migration-23` in `update-23-0-0/`. PR #35614 still draft pending NXC-4448.

**Files**: PR #35614, latest commit `07d5add639` (then bumped through the day)

## NXC-4448: Cypress 15.14 bump + remove stale Vite 8 guard — NEW (PR #35613, draft)

Filed as a blocker for NXC-4154 once the Cypress/Vite 8 fact-check exposed both a stale pin and a stale guard.

Changes in `packages/cypress/`:
- `src/utils/versions.ts`: `cypressVersion ^15.8.0 -> ^15.14.2`, `cypressViteDevServerVersion ^7.0.1 -> ^7.3.1`.
- `src/generators/component-configuration/component-configuration.ts`: removed the Vite 8 throw guard + unused `coerce`, `major` (semver) and `getDependencyVersionFromPackageJson` imports.
- `migrations.json`: 23.0.0 packageJsonUpdates entry. After reviewer feedback that gating both bumps on `cypress >=15.0.0 <15.14.0` would skip the dev-server bump for users who manually upgraded cypress, split into two entries — one keyed off cypress version (cypress bump), one keyed off `@cypress/vite-dev-server >=7.0.0 <7.3.1` (dev-server bump runs independently).
- New codemod `update-23-0-0/remove-experimental-prompt-command.ts` strips the flag Cypress 15.13.0 removed (PR cypress-io/cypress#33497 — soft warning rather than hard error, but worth cleaning). Reviewer caught that the original selector `PropertyAssignment > Identifier[name=...]` only matched bare-key form; quoted `'experimentalPromptCommand': true` was skipped. Rewrote to `PropertyAssignment:has(Identifier),PropertyAssignment:has(StringLiteral)` plus a `propAssign.name.text` filter (`:has()` can match outer ancestors, so the filter restricts to the property whose own name is the flag). 5 inline-snapshot tests pass.
- Codemod registered with `requires: { cypress: ">=15.13.0" }`.

E2e cleanup riding along with the bump (separate from migration logic, in same PR):
- 8 places across the repo were downgrading `vite` to `^7.0.0` before configuring Cypress CT, with comment "Cypress CT (@cypress/vite-dev-server) does not support Vite 8 yet."
- 5 in `e2e/angular/src/cypress-component-tests-{app,lib,implicit-dep,buildable,zone-projects}.test.ts` — all 5 had identical `beforeAll` downgrade+install, all gated under unrelated `it.skip` lodash@4.18.0 TODO. Removed the dead downgrade blocks; left the lodash skips alone.
- 2 in `e2e/cypress/src/cypress.test.ts` (next + angular CT-and-e2e tests, also gated on the lodash skip). Removed downgrade blocks.
- 1 in `e2e/cypress/src/cypress-legacy.test.ts` — this one is **active** (not skipped). Removed downgrade + the yarn-classic `resolutions` workaround it required (was needed because vitest's vite peer dep conflicted with the yarn linker when intersecting with a manually-pinned `^7.0.0`). Now runs against Vite 8 — the real recovery from the stale pin.
- Left `e2e/vite/src/vite.test.ts:332` alone — that one's a deliberate Vite 7 backwards-compat suite, not a workaround.
- Trimmed unused imports across all 7 modified files.

Master rebase round 1 (after reviewer feedback): clean.
Master rebase round 2 (after reviewer feedback round 2 + version bumps): conflict on `component-configuration.ts` because master renamed `warnCypressExecutorScaffolding -> warnCypressExecutorGenerating` while my branch removed the import altogether. Resolution: kept master's renamed import name, dropped the unused `coerce`/`major` semver imports master added back. Lint + build pass.

PR `description` style follows Jack's lean draft format (no test plan, no file list — Linear is source of truth).

**Linear**: NXC-4448 created with `blocks: [NXC-4154]` relation, project "Major Version Deprecations" / milestone v23 / High priority.
**Files**: PR #35613, latest commit `db37fa7ed9`

## NXC-4156: Remove SVGR support from @nx/rspack (v23) — MERGED (#35611)

Mirrored the v22 webpack SVGR removal for `@nx/rspack` in v23. Stripped the `svgr` option from `withReact` / `NxReactRspackPlugin` / `WithReactOptions`, deleted `SvgrOptions`, and consolidated the standalone `\.svg$` asset rule into the images rule in `apply-web-config`. Added migration `update-23-0-0-add-svgr-to-rspack-config` (versioned `23.0.0-beta.9` — one above current beta.8) that inlines a `withSvgr` helper into user configs and rewrites the `composePlugins` chain (or wraps `module.exports` for the `NxReactRspackPlugin` style). Codemod is structurally a clone of `add-svgr-to-webpack-config.ts` with rspack's two-rule `?url` pattern instead of webpack's `oneOf`, and includes the b59374a005 "preserve other properties" fix.

Follow-up commit dropped the stale `// svgr: false` hint from `convert-config-to-rspack-plugin.ts` and scrubbed 20 stale-comment blocks across 4 spec/snap files; collapsed 9 empty `withReact({})` / `new NxReactRspackPlugin({})` literals to no-args form (prettier was reformatting and breaking pre/post-conversion equality assertions).

PR #35611 opened against master. First CI run had 3 e2e failures, all confirmed unrelated:
- `import.test.ts` + `import-ai-agent.test.ts` — `git filter-branch fatal: Unable to read current working directory` (infra; cwd disappears mid-run)
- `misc-rspack-convert-to-rspack.test.ts` — broken on master, pending unmerged fix `128abe52b1` (Jason Jean) plus 5 related commits

Diff vs origin/master for the MF test is empty -> master is broken, not regressed by this PR. Rebased onto master + force-pushed (with `--force-with-lease=NXC-4156:678bf28095` to overwrite a Self-Healing CI rerun marker commit) to retrigger CI. **Merged at 19:36 UTC** as `9f18c6ae2f`.

**Files**: `dot_ai/2026-05-08/tasks/nxc-4156-rspack-svgr-removal.md`
**PR**: https://github.com/nrwl/nx/pull/35611

## NXC-4430: Tailwind v3 -> v4 — MERGED (#35594)

Follow-up touches on the Tailwind v3 -> v4 migration PR (#35594) opened 2026-05-06, **merged at 19:50 UTC** as `2445010810`.

1. **PR description**: rewrote to explicitly list the v4 utility renames (`shadow-sm -> shadow-xs`, `rounded -> rounded-sm`, etc.) and link to the Tailwind v4 upgrade guide sections (`#renamed-utilities`, `#default-border-color`) so reviewers don't have to infer scope from the diff.
2. **Screenshot triage + colocation**: moved 8 keepers from `/var/folders/.../T/nxc-4430-screenshots/` into `dot_ai/2026-05-05/tasks/nxc-4430-tailwind-v3-to-v4/`. Dropped 11 redundant intermediates (broken-serving astro variants, duplicated graph-client error states, pre-fix nx-dev variant). Renamed for clarity (e.g. `graph-client-master-dev-e2e.png` -> `graph-client-pre-existing-error-on-master.png`).
3. **Task plan**: wrote `dot_ai/2026-05-05/tasks/nxc-4430-tailwind-v3-to-v4.md` documenting scope, approach, gotchas, verification, and the 8 colocated screenshots. Backfill — the PR shipped 2026-05-06 without a plan file.

## NXC-4374 + NXC-4451: Node 26 — partial rollout

- **#35623 (NXC-4374)** added Node 26 to the compat matrix in docs.
- **#35626 (NXC-4451)** then dropped Node 26 from the nightly CI matrix because of an unresolved playwright/yauzl incompat — keep the docs claim, defer the actual matrix coverage until upstream lands a fix.

Net: docs say "supported", CI doesn't run it yet. Tracking ticket (TBD) needed once playwright/yauzl publish fix.

## Active sessions cleaned up
- NXC-4156 (SVGR rspack) — merged, removable from active sessions.
- NXC-4430 (Tailwind v4) — merged, removable.
- NXC-4374 (Node 26 docs) — merged.
- NXC-4451 (Node 26 nightly drop) — merged.
- NXC-4159 (Node 20 drop) — still pending per Recent Tasks; leave active.
- NXC-4299 (native TS strip) — still in review; leave active.
