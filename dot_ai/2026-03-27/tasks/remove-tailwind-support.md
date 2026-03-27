# NXC-3711: Remove Tailwind Support

**Issue**: https://linear.app/nxdev/issue/NXC-3711/remove-tailwind-support
**Milestone**: v23
**Branch**: `NXC-3711`

## Goal

Remove `setup-tailwind` generators and all tailwind-related code from `packages/*`. Tailwind setup is trivial and our docs already show how — removing it eliminates the perception that Nx is outdated (stuck on TW v3).

## Scope

Per the issue:

- No more mention of "tailwind" in any `packages/*` files (`.ts`, `.md`, `.json`)
- Root `package.json` and `pnpm-lock.yaml` should have no tailwind deps (move to apps that need them)
- `astro-docs` and other non-packages can retain tailwind usage
- Old migrations: call out for review on whether to keep or remove

## What NOT to touch

- `packages/nx/src/plugins/js/lock-file/__fixtures__/` — these are lock file parser test fixtures, not actual tailwind usage
- `packages/angular-rspack/` and `packages/angular-rspack-compiler/` — these are **runtime build tools** that detect user's tailwind config to integrate with PostCSS. This is NOT a generator/setup — it's build infrastructure that should remain
- `packages/angular/src/executors/utilities/ng-packagr/` — same as above, runtime ng-packagr build support
- `packages/eslint/` — test fixture with `tailwind.config.js` in `ignoredFiles` array, harmless
- `astro-docs/`, `nx-dev/`, `examples/` — non-packages, out of scope

## Inventory of Changes

### Step 1: Remove `setup-tailwind` generators (5 packages)

Each package has a `setup-tailwind` generator directory. Remove the entire directory and all references.

| Package       | Generator Dir                    | generators.json                   | Barrel Export             |
| ------------- | -------------------------------- | --------------------------------- | ------------------------- |
| `@nx/angular` | `src/generators/setup-tailwind/` | `generators.json:161-164`         | `generators.ts:23`        |
| `@nx/react`   | `src/generators/setup-tailwind/` | `generators.json:89-92`           | `index.ts:26`             |
| `@nx/next`    | `src/generators/setup-tailwind/` | `generators.json` (need to check) | N/A (imported internally) |
| `@nx/vue`     | `src/generators/setup-tailwind/` | `generators.json:32-35`           | `index.ts:11-12`          |
| `@nx/remix`   | `src/generators/setup-tailwind/` | `generators.json:69-71`           | `generators.ts:11`        |

Also remove:

- `packages/angular/docs/setup-tailwind-examples.md`

#### TODO

- [ ] Delete `setup-tailwind` directories in all 5 packages
- [ ] Remove entries from `generators.json` in all 5 packages
- [ ] Remove barrel exports from `generators.ts`/`index.ts`
- [ ] Remove `packages/angular/docs/setup-tailwind-examples.md`

### Step 2: Handle `tailwind.ts` barrel files (4 packages)

These export `createGlobPatternsForDependencies` used in users' `tailwind.config.js`.

**Decision**: Keep `@nx/next/tailwind` but replace with an error directing users to use `@source` (TW v4). Remove from angular, react, vue.

| Package       | File          | package.json export                        | Action |
| ------------- | ------------- | ------------------------------------------ | ------ |
| `@nx/angular` | `tailwind.ts` | `"./tailwind": "./tailwind.js"`            | Remove |
| `@nx/react`   | `tailwind.ts` | `"./tailwind": { import, require, types }` | Remove |
| `@nx/next`    | `tailwind.ts` | No export in package.json                  | Replace with error message |
| `@nx/vue`     | `tailwind.ts` | No export in package.json                  | Remove |

**@nx/next/tailwind replacement**: Throw error directing users to use `@source "../../libs/ui"` in their stylesheet. Link to https://nx.dev/docs/technologies/react/guides/using-tailwind-css-in-react#configuring-sources-for-monorepos

Also:
- `packages/next/src/utils/generate-globs.ts` — deprecated function referencing `@nx/next/tailwind`, remove

**AI Migration**: Add an AI migration for 23.0.0-beta.0 that prompts AI agent to remove uses of `@nx/next/tailwind` and instead add `@source ...` directives into the stylesheet containing `@import 'tailwindcss'`.

#### TODO

- [ ] Delete `tailwind.ts` from angular, react, vue
- [ ] Replace `@nx/next/tailwind.ts` with error message
- [ ] Remove `./tailwind` exports from angular and react `package.json`
- [ ] Delete `packages/next/src/utils/generate-globs.ts`
- [ ] Add AI migration for `@nx/next/tailwind` removal

### Step 3: Remove `--style=tailwind` from React/Next generators

The `tailwind` style option in schema.json triggers `setup-tailwind` in app generators. Also affects component/library/host/remote schemas.

**React schemas to update** (remove `tailwind` from style enum):

- `src/generators/application/schema.json`
- `src/generators/library/schema.json`
- `src/generators/component/schema.json`
- `src/generators/host/schema.json`
- `src/generators/remote/schema.json`

**React code to update:**

- `src/utils/assertion.ts` — remove `tailwind` from `VALID_STYLES`
- `typings/style.d.ts` — remove `tailwind` from `SupportedStyles`
- `src/generators/application/application.ts` — remove `style === 'tailwind'` branch calling `setupTailwindGenerator`
- `src/generators/application/lib/normalize-options.ts` — remove `tailwind` from regex
- `src/generators/application/lib/create-application-files.ts` — remove `tailwind` style handling (multiple locations)
- `src/generators/application/lib/add-project.ts` — remove `tailwind` ternaries (2 locations)
- `src/generators/component/files/__fileName__.__ext__` — remove `tailwind` references in template
- Delete `src/generators/application/files/style-tailwind/` directory

**Next schemas to update:**

- `src/generators/application/schema.json`
- `src/generators/library/schema.json`
- `src/generators/component/schema.json`

**Next code to update:**

- `src/generators/application/application.ts` — remove `style === 'tailwind'` branch
- `src/generators/application/lib/normalize-options.ts` (if exists)
- `src/generators/application/files/pages/__fileName__.tsx__tmpl__` — remove tailwind references
- `src/generators/application/files/app/page.tsx__tmpl__` — check for tailwind refs
- `src/generators/cypress-component-configuration/cypress-component-configuration.ts` — remove tailwind detection

#### TODO

- [ ] Remove `tailwind` from all schema.json style enums (react, next)
- [ ] Update `VALID_STYLES` and `SupportedStyles` type
- [ ] Remove tailwind branches from application generators
- [ ] Update template files
- [ ] Delete `style-tailwind` file directory
- [ ] Update/remove affected test files and snapshots

### Step 4: Remove `--addTailwind` from Angular generators

**Schemas to update** (remove `addTailwind` property):

- `src/generators/application/schema.json`
- `src/generators/application/schema.d.ts`
- `src/generators/library/schema.json`
- `src/generators/library/schema.d.ts`
- `src/generators/host/schema.json`
- `src/generators/host/schema.d.ts`
- `src/generators/remote/schema.json`
- `src/generators/remote/schema.d.ts`

**Code to update:**

- `src/generators/application/application.ts` — remove `addTailwind` branch
- `src/generators/library/library.ts` — remove `addTailwind` branch
- `src/generators/library/lib/validate-options.ts` — may reference addTailwind
- `src/generators/library/lib/normalized-schema.ts` — may have addTailwind in type
- `plugins/component-testing.ts` — remove `getTempStylesForTailwind` function and related code

**Tests to update:**

- `src/generators/application/application.spec.ts`
- `src/generators/library/library.spec.ts`

#### TODO

- [ ] Remove `addTailwind` from all Angular schemas
- [ ] Remove tailwind branches from application/library generators
- [ ] Remove `getTempStylesForTailwind` from component-testing plugin
- [ ] Update test files

### Step 5: Remove tailwind version constants (keep postcss/autoprefixer)

Remove only `tailwindVersion`/`tailwindcssVersion` constants. Keep `postcssVersion` and `autoprefixerVersion` — they're used by non-tailwind code (Angular buildable libs, etc.).

| Package       | File                                        | Remove                  | Keep                          |
| ------------- | ------------------------------------------- | ----------------------- | ----------------------------- |
| `@nx/react`   | `src/utils/versions.ts`                     | `tailwindcssVersion`    | `postcssVersion`, `autoprefixerVersion` |
| `@nx/angular` | `src/utils/versions.ts`                     | `tailwindVersion`       | `postcssVersion`, `autoprefixerVersion` |
| `@nx/angular` | `src/utils/backward-compatible-versions.ts` | `tailwindVersion` (x2)  | `postcssVersion`, `autoprefixerVersion` |
| `@nx/vue`     | `src/utils/versions.ts`                     | `tailwindcssVersion`    | `postcssVersion`, `autoprefixerVersion` |
| `@nx/remix`   | `src/utils/versions.ts`                     | `tailwindVersion`       | `postcssVersion`              |

#### TODO

- [ ] Remove tailwind version constants only
- [ ] Update `backward-compatible-versions.ts`

### Step 6: Remove tailwind from `create-nx-workspace`

- `packages/create-nx-workspace/bin/create-nx-workspace.ts:1235-1236` — remove `tailwind` from style choices prompt

#### TODO

- [ ] Remove `tailwind` style choice from CNW

### Step 7: Remove root package.json tailwind deps

Move any needed deps to the apps that use them (`nx-dev`, `astro-docs`).

Root `package.json` deps to remove:

- `prettier-plugin-tailwindcss` — keep if prettier config uses it
- `@tailwindcss/aspect-ratio`
- `@tailwindcss/forms`
- `@tailwindcss/typography`
- `tailwind-merge`
- `tailwindcss`

**Check**: `nx-dev/nx-dev/package.json` already has its own tailwind deps. The root deps may be duplicates or used by other apps.

#### TODO

- [ ] Determine which root deps are only used by packages vs apps
- [ ] Move app-specific deps to app package.json files
- [ ] Remove from root package.json
- [ ] Run `pnpm install` to update lockfile

### Step 8: Handle old migration

`packages/angular/migrations.json` has `remove-tailwind-config-from-ng-packagr-executors` (update-20-2-0).

**Decision**: Keep. Old migrations should stay for users upgrading from older versions. They're inert for users who don't have the config.

The migration code at `src/migrations/update-20-2-0/remove-tailwind-config-from-ng-packagr-executors.ts` should be kept.

### Step 9: Validation

Run:

```bash
# Verify no tailwind references remain in packages (excluding fixtures and angular-rspack runtime code)
grep -ri "tailwind" packages/ \
  --include="*.ts" --include="*.json" --include="*.md" \
  | grep -v "node_modules" \
  | grep -v "__fixtures__" \
  | grep -v "angular-rspack" \
  | grep -v "migrations" \
  | grep -v ".snap"

# Build affected
nx affected -t build,lint,test

# Run e2e for affected
nx affected -t e2e-local
```

#### TODO

- [ ] Run grep validation
- [ ] Run build/lint/test
- [ ] Run e2e tests

## Decisions (Resolved)

1. **angular-rspack runtime detection**: **Keep.** Build infrastructure, not a generator.
2. **postcss/autoprefixer constants**: **Keep.** Used by non-tailwind code (Angular buildable libs).
3. **`@nx/next/tailwind`**: **Keep module but replace with error.** Direct users to `@source` directives. Add AI migration for 23.0.0-beta.0.
4. **Angular CT `getTempStylesForTailwind`**: **Remove.** CT has few users. Users should configure their own `cypress/support/styles.ct.css`. In TW v4, users just need `@import 'tailwindcss'` in their support styles.
5. **Old migrations**: **Keep.** Will be removed naturally when we bump major version ranges.
6. **Orphaned utils**: **Remove.** All `lib/` files under `setup-tailwind/` directories are exclusively used by those generators — confirmed safe to delete with parent dirs.

## Expected Outcome

- Zero tailwind references in `packages/*` (except angular-rspack runtime, lock-file fixtures, and old migrations)
- `setup-tailwind` generators removed from all 5 plugin packages
- `--style=tailwind` removed from React/Next generators
- `--addTailwind` removed from Angular generators
- `tailwind.ts` barrel exports removed
- Root `package.json` has no tailwind deps (moved to app-level)
- All tests pass after snapshot updates
- Breaking change documented for v23

---

## Implementation Tracking

> CRITICAL: Keep track of implementation progress in this section. Update TODOs above as work progresses.

**Status**: Implementation complete. All steps done. Pending: commit, push, PR.

### Completed
- [x] Step 1: Removed setup-tailwind generators from all 5 packages
- [x] Step 2: Handled tailwind.ts barrels (deleted 3, replaced next with error, added AI migration)
- [x] Step 3: Removed --style=tailwind from React/Next generators
- [x] Step 4: Removed --addTailwind from Angular generators + CT plugin cleanup
- [x] Step 5: Removed tailwind version constants (kept postcss/autoprefixer)
- [x] Step 6: Removed tailwind from create-nx-workspace
- [x] Step 7: Removed root package.json tailwind deps (kept prettier-plugin-tailwindcss)
- [x] Step 8: Old migrations kept (angular/migrations.json)
- [x] Step 9: Validation - builds pass, lint passes, tests pass (pre-existing failures unrelated)
- [x] Cypress executor cleanup (getTempTailwindPath, ctTailwindPath)
- [x] Angular ng-packagr dead code (tailwindcss.ts) removed
- [x] next/index.ts export of deprecated generate-globs removed
- [x] Test files updated (removed tailwind test cases, regenerated snapshots)
