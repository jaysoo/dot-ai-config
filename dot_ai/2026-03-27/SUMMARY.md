# Daily Summary — 2026-03-27

## Completed

### NXC-4113: A/B Test Cloud Prompt Copy in CNW

- **Issue**: https://linear.app/nxdev/issue/NXC-4113
- **Goal**: Increase "yes" rate and reduce "never" rate on the Nx Cloud prompt during `create-nx-workspace`
- **Changes**:
  - Re-enabled cloud prompt (was disabled since CLOUD-4255)
  - Added 3 A/B test copy variants tied to `NX_CNW_FLOW_VARIANT` (existing infra):
    - Variant 0 (baseline): "Connect to Nx Cloud?"
    - Variant 1 (remote caching): "Enable remote caching to speed up builds with Nx Cloud?"
    - Variant 2 (CI-first): "Speed up your CI with Nx Cloud?"
  - New variants emphasize concrete benefits (remote caching, CI speed), mention CI providers (GitHub, GitLab), and note free tier + 2-minute setup
  - Made "No, don't ask again" dimmed via `chalk.dim()` to reduce "never" selections
  - Removed unused `shouldShowCloudPrompt()` function
  - Prompt variant selection now uses `getFlowVariant()` instead of independent random — same env var (`NX_CNW_FLOW_VARIANT`) controls both flow and prompt copy
- **Files changed**:
  - `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`
  - `packages/create-nx-workspace/src/utils/nx/ab-testing.spec.ts`
- **Branch**: `NXC-4113` (pushed, PR not yet created)
- **Next**: Create PR, then do similar for `nx init`

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

### DOC-455: Blog/Changelog Reverse Proxy in Edge Function

- **Issue**: https://linear.app/nxdev/issue/DOC-455
- **PR**: https://github.com/nrwl/nx/pull/35043
- **Goal**: Enable proxying `/blog/*` and `/changelog/*` to standalone blog site (`nrwl-blog.netlify.app`) via env var toggle
- **Approach**: Modified existing Netlify edge function (`netlify/edge-functions/rewrite-framer-urls.ts`) instead of Next.js rewrites — cleaner since the edge function is already the routing decision point
- **Changes**:
  - Added `BLOG_URL` env var support (reads via `Netlify.env.get`)
  - Conditionally removes `/blog` and `/changelog` from `nextjsPaths` when `BLOG_URL` is set
  - Removed `/blog/*` and `/changelog` from static `excludedPath` so edge function can intercept
  - Added blog proxy branch with URL rewriting (`blogUrl` → `https://nx.dev`) and security headers
  - When `BLOG_URL` is unset, blog/changelog paths fall through to Next.js via `context.next()` (no behavior change)
  - Also fixed `/favicon.ico` and `/favicon.svg` 404s — added redirects to `/favicon/` subdirectory
- **Netlify config**: `BLOG_URL` set for Deploy Previews and Branch deploys only (prod left empty for safe rollout)
- **Files changed**:
  - `netlify/edge-functions/rewrite-framer-urls.ts`
  - `nx-dev/nx-dev/_redirects`

### CNW Skill Improvements (`cnw-update-templates`)

- Updated `dot_claude/skills/cnw-update-templates/SKILL.md` with 3 new guardrails:
  1. **Registry check**: Pre-flight check for localhost/local registry in `~/.npmrc`; post-install validation of `package-lock.json`
  2. **npm audit**: Run `npm audit --audit-level=critical` after install, stop on criticals
  3. **Framework version check**: After `nx migrate`, compare Angular/React/Vite versions against latest stable and report if behind by minor/major

### NXC-4153: Fix CNW Non-Interactive Mode + Template Shorthands

- **Issue**: https://linear.app/nxdev/issue/NXC-4153
- **PR**: https://github.com/nrwl/nx/pull/35045
- **Problem**: 22.6.0 regression — `determineTemplate()` returned `'custom'` in non-interactive contexts (IDE terminals, scripts, SSH without `-t`), requiring `--preset`. Without it, threw "Preset is required". ~145 occurrences Mar 18-27, ~15 users/day.
- **Fix 1**: Changed non-interactive/CI fallback from `'custom'` to `'nrwl/empty-template'` (template flow). Removed dead ternary branch that could never execute.
- **Fix 2**: Added `resolveTemplateShorthand()` — maps `angular`, `react`, `typescript`, `empty` to full `nrwl/*-template` paths. Updated `--help` examples to show shorthands.
- **Tests**: 10 new tests (6 for shorthand resolution, 4 for `determineTemplate` behavior in non-interactive/CI mode)
- **Files changed**:
  - `packages/create-nx-workspace/src/internal-utils/prompts.ts`
  - `packages/create-nx-workspace/src/internal-utils/prompts.spec.ts` (new)
  - `packages/create-nx-workspace/src/create-workspace.ts`
  - `packages/create-nx-workspace/src/create-workspace.spec.ts`
  - `packages/create-nx-workspace/bin/create-nx-workspace.ts`
