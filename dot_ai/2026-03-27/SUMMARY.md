# Daily Summary — 2026-03-27

## Completed

### NXC-4152: Fix unit tests failing with Vite 8 on @nx/cypress beta.5

- **Issue**: https://linear.app/nxdev/issue/NXC-4152
- **Problem**: `@nx/cypress@22.7.0-beta.5` added a Vite 8 guard in its `componentConfigurationGenerator` — it reads `vite` from the tree's `package.json` and throws if major >= 8. Since our vite generators install `vite: '^8.0.0'`, all Angular and React cypress-component-configuration tests failed (12 Angular, 8 React).
- **Fix**: Added `useVite7ForCypressCT(tree)` helper to both test files that downgrades vite to `^7.0.0` in the tree before calling the cypress config generator. Called after app generators (which add vite 8) but before the cypress config generator. Cannot be in `beforeEach` because app generators run after and re-add vite 8.
- **TODO(jack)**: Remove when Cypress adds Vite 8 support (https://github.com/cypress-io/cypress/issues/33078)
- **Files changed**:
  - `packages/angular/src/generators/cypress-component-configuration/cypress-component-configuration.spec.ts`
  - `packages/react/src/generators/cypress-component-configuration/cypress-component-configuration.spec.ts`
- **Result**: All 17 Angular + 9 React tests pass

### NXC-3711: Remove Tailwind Support (in progress)

- Task plan created at `.ai/2026-03-27/tasks/remove-tailwind-support.md`
- All 9 steps completed: removed `setup-tailwind` generators (5 packages), `--style=tailwind` (React/Next), `--addTailwind` (Angular), tailwind barrel exports, version constants, CNW style choice, root deps
- Added AI migration for `@nx/next/tailwind` → `@source` directive
- Kept: angular-rspack runtime detection, postcss/autoprefixer constants, old migrations
- Status: implementation complete, pending commit/push/PR

### CNW Template Updates (22.6.1 → 22.6.2)

- Migrated all 4 CNW templates (angular, react, typescript, empty) from Nx 22.6.1 → 22.6.2
- Patch release — no code migrations, only `package.json` + `package-lock.json` changes
- All templates verified (test, build, lint passing), committed locally (not pushed)
- **Post-migration manual fixes required:**
  - Vite 8 bump: typescript-template succeeded; angular/react had peer dep conflicts needing manual resolution
  - Angular 21.1.1 → 21.2.5: `nx migrate` didn't bump Angular — the 21.2 migrations were gated at an older Nx version the templates had already passed through
  - localhost registry URLs leaked into `package-lock.json` from `~/.npmrc` — had to be cleaned manually

### CNW Skill Improvements (`cnw-update-templates`)

- Updated `dot_claude/skills/cnw-update-templates/SKILL.md` with 3 new guardrails:
  1. **Registry check**: Pre-flight check for localhost/local registry in `~/.npmrc`; post-install validation of `package-lock.json`
  2. **npm audit**: Run `npm audit --audit-level=critical` after install, stop on criticals
  3. **Framework version check**: After `nx migrate`, compare Angular/React/Vite versions against latest stable and report if behind by minor/major
