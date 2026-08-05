# DOC-571: Update migration from Turborepo

- Linear: https://linear.app/nxdev/issue/DOC-571/update-migration-from-turbo
- Worktree: `/Users/jack/projects/nx-worktrees/DOC-571` (branch `DOC-571`)
- Polygraph session: shiny-finch-d0837b3c
- Page: `astro-docs/src/content/docs/guides/Adopting Nx/from-turborepo.mdoc`

## Ask

Make the page step-by-step (inverse of turborepo.dev/docs/guides/migrating-from-nx), add an
AI prompt at the top, cover the new `targetDefaults` array + `filter` form for turbo
package-specific task fragments, and demote command equivalents to a closing
"additional considerations" note.

## Live verification (scratch workspace)

`npx create-turbo@latest` + `npx nx@latest init` in the scratchpad.

Findings that corrected the old page:

- `nx init` output for `dev` is `{ "cache": false }`, NOT `{ "continuous": true }`.
  `createNxJsonFromTurboJson` (packages/nx/src/command-line/init/implementation/utils.ts)
  has no `persistent` handling. The old page documented output that never existed.
- `#`-prefixed package-specific tasks are explicitly skipped (`if (taskName.includes('#')) continue`).
- Per-package `turbo.json` (`extends: ["//"]`) is never read - only the root file.
- Task-level `env` is dropped. `globalEnv` / `globalDependencies` DO convert to `sharedGlobals`.

Verified working in the scratch workspace:

- `targetDefaults.build` array form with `{ "filter": { "projects": ["web"] } }` -> `nx show project web`
  shows the outputs; `nx show project docs` shows `outputs: undefined`. Correct scoping.
- `"continuous": true` on `dev` resolves on the project.
- `{ "env": "API_URL" }` in `inputs`: same value = cache hit, changed value = cache miss.

## Move to the Knowledge Base (Jack, same session)

`guides/Adopting Nx/from-turborepo.mdoc` -> `kb/from-turborepo.mdoc`.
New URL `/docs/kb/from-turborepo`; basename kept so only the directory segment changed.

- `featured: true` + `topics: ['Installation and updates']` added.
- `featured: true` removed from `kb/angular-nx-version-matrix.mdoc` ("Nx and Angular Versions")
  to keep the featured grid at 6.
- Sidebar entry removed from `sidebar.mts` (Maintenance group). KB pages are not in the sidebar.
- netlify.toml redirect added above the `/docs/*` catch-all.
- Inbound links repointed: `kb/nx-vs-turborepo.mdoc` (x2), `guides/Adopting Nx/adding-to-monorepo.mdoc`,
  `reference/Deprecated/integrated-vs-package-based.mdoc`, and 3 legacy entries in
  `nx-dev/nx-dev/_redirects` (avoids a redirect chain).

## New page structure

llm_copy_prompt -> intro -> 8 numbered steps (init, read nx.json, package-specific config,
continuous, env inputs, verify, CI, remove turbo) -> "Additional considerations"
(inferred tasks, config mapping tables, command equivalents).

## Not done / out of scope

- `packages/nx/src/command-line/init/init-v2.ts:291` still prints the legacy
  `https://nx.dev/recipes/adopting-nx/from-turborepo` learn-more link. It is one of ~8 legacy
  `nx.dev/recipes/*` URLs across `init`; fixing one in a docs PR is inconsistent scope.
