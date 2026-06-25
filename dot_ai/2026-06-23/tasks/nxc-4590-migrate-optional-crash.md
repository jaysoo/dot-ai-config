# NXC-4590: nx migrate crash with --include=optional

**Status:** MERGED (PR #36087, 2026-06-23)
**Branch:** NXC-4590 | **Polygraph session:** `migrate-error-c1c6a147` (repos: nrwl/nx, nrwl/ocean)
**Surfaced by:** Jack migrating the ocean repo to latest Nx (`NX_MIGRATE_CLI_VERSION=23.1.0-beta.1 nx migrate` -> select `optional`).

## Symptom

```
NX   The migrate command failed.
Cannot read properties of undefined (reading 'version')
    at generateMigrationsJsonAndUpdatePackageJson (.../migrate.js:1420:160)
```

## Root cause

`packages/nx/src/command-line/migrate/migrate.ts`, in `generateMigrationsJsonAndUpdatePackageJson`,
the 4th arg to `writePromptMigrationFiles` read `packageUpdates[walkedTargetPackage].version`
**unguarded**.

Under `--include=optional`:
- `Migrator.applyIncludeFilter()` deletes every required-closure member from `packageUpdates`.
- `resolveRequiredPackages()` always seeds the set with the target package itself.
- So `packageUpdates[walkedTargetPackage]` (e.g. `nx`) is deterministically `undefined` there.

Not ocean-specific - crashes for any workspace reaching that line with `--include=optional`.
Unit tests missed it because they drive the `Migrator` class directly and stop at its return value,
never exercising the orchestration seam.

## Fix

Hoisted the already-safe `packageUpdates[walkedTargetPackage]?.version ?? opts.targetVersion`
(which lived 18 lines below, used only by completion analytics) above the call and reused it.
The version only names the AI-migrations output dir; the `opts.targetVersion` fallback is correct
under optional. Net +8/-4.

## Verification

- Exported the function; added a regression test on the orchestration seam (temp workspace +
  stub fetcher where the target sits in its own required closure). Fails against pre-fix code with
  the exact reported `TypeError`; passes with the fix (optional update applied, required packages
  untouched).
- `nx:build-base`, `nx:lint`, full `migrate.spec.ts` (210/210) green.
- Adversarial scan of the whole optional flow (updatePackageJson, installation, split-config,
  downgrade filter, run-migrations, analytics, next-steps messages): no sibling unguarded accesses.

## Notes / follow-up

- Did NOT verify against the actual ocean migration (ocean was added to the session but the fix is
  pure nx core; offered as optional next step). The deterministic root cause + regression test make
  a live ocean repro unnecessary for correctness.
