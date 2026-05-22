# Hand-off: Angular Native Federation docs (NXC-4483)

**Date:** 2026-05-21
**Owner:** Manfred
**Trigger:** NXC-4483 ships in Nx v23. Angular MF in @nx/angular is being deprecated and removed in v24.

## What I shipped in this PR

The `@nx/module-federation` v2 generators (`consumer`, `provider`) are React-only. Every Angular Module Federation surface in `@nx/angular` and the Angular MF executors emit deprecation warnings pointing users at `@angular-architects/native-federation`. The warning text reads:

> Angular Module Federation in Nx is no longer supported. Use `@angular-architects/native-federation` (https://www.npmjs.com/package/@angular-architects/native-federation) for the supported Angular path. See https://nx.dev/docs/technologies/module-federation for the v23 migration guide.

That migration URL currently points at the new `consumer-and-provider.mdoc` page, which is React-only and does **not** cover the Angular path.

## What I need from you

A docs page (or section under the existing `astro-docs/src/content/docs/technologies/module-federation/` tree) that:

1. Calls out that Angular Module Federation in Nx is no longer supported as of v23, removed in v24.
2. Points users at `@angular-architects/native-federation` as the supported path going forward.
3. Walks through migrating an `@nx/angular:host` / `:remote` setup to a `nx:run-commands`-driven Native Federation app.
4. Mirrors the React doc's structure where it makes sense (dynamic manifest, no host orchestration), so users moving between stacks recognize the pattern.

## Reference material

- Evidence repo: `~/projects/mf-examples`
  - `apps/angular-native-fed/` — working Native Federation setup, dynamic manifest, `federation.manifest.json` loaded at runtime
  - `apps/angular-native-fed/e2e-dynamic/dynamic.spec.ts` — proves missing remotes 404 lazily without breaking the host
  - `apps/nx-angular/` — documents the rough edges of the OLD Nx-Angular MF setup (TS-refs conflicts, typecheck d.ts pollution, hyphen restrictions, static-serve bug) so you can speak to the deltas
- React migration doc shipped here: `astro-docs/src/content/docs/technologies/module-federation/consumer-and-provider.mdoc` — pattern + AI prompt block to mirror for Angular if helpful

## Timing

Ideally the Angular doc lands before or in the same Nx v23 release cut as this PR, so the deprecation warning's URL leads users somewhere useful for both stacks. If timing slips, the React doc is still a reasonable landing page since it explains the broader v23 deprecation - Angular users will just have to follow the external link to `@angular-architects/native-federation` until your guide ships.

## Open questions

- Same page as the React doc with an "Angular" section, or separate page under the same MF section? Either works for the URL the deprecation warnings point at.
- Do you want a sidebar restructure of `astro-docs/src/content/docs/technologies/module-federation/` to reflect the React vs Angular split now that the unified `host`/`remote` story is gone?
