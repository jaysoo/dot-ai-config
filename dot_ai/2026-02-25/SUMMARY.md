# 2026-02-25 Summary

## DOC-415: Move nx-dev redirects from Next.js to Netlify _redirects

**Issue**: https://linear.app/nxdev/issue/DOC-415/investigate-nxdev-outage-reported-for-10-minutes
**PR**: https://github.com/nrwl/nx/pull/34612
**Branch**: `DOC-415`
**Status**: PR open, preview deployment verified working

### Problem

All 1,200+ redirect rules were processed by the Next.js serverless function via `redirects()` in `next.config.js`. Every redirect request required a serverless cold start, contributing to a reported 10-minute outage.

### Solution

Moved all redirects to a plain Netlify `_redirects` file, which is processed at the CDN edge — faster and independent of the Next.js serverless function.

### Key Details

- Wrote a conversion script (`scripts/generate-netlify-redirects.mjs`) to transform the JS redirect rules to Netlify format
- Expanded Next.js regex group patterns (e.g. `/(l|latest)/...`) into individual rules since Netlify doesn't support regex
- Converted `:path*` wildcards to Netlify `*`/`:splat` syntax
- 1,231 redirect rules total across `redirect-rules.js` and `redirect-rules-docs-to-astro.js`
- Rewrites (Astro docs proxy) remain in `next.config.js` — they require server-side processing
- First attempt: `_redirects` in project root wasn't picked up (publish dir is `.next/`)
- Fix: Added `cp _redirects .next/_redirects` to the netlify deploy-build command in `project.json`

### Files Changed

- `nx-dev/nx-dev/_redirects` (new) — 1,231 Netlify redirect rules
- `nx-dev/nx-dev/next.config.js` — removed `redirects()` function and `require('./redirect-rules')`
- `nx-dev/nx-dev/project.json` — added copy step to netlify deploy-build
- `nx-dev/nx-dev/scripts/generate-netlify-redirects.mjs` (new) — one-time conversion script

### Follow-up

- Delete `redirect-rules.js`, `redirect-rules-docs-to-astro.js`, `redirect-rules.spec.js`, and `scripts/generate-netlify-redirects.mjs` once confirmed stable

---

## Fix #34399: Redundant vite.config.ts generation for vitest projects

**Issue**: https://github.com/nrwl/nx/issues/34399
**PR**: https://github.com/nrwl/nx/pull/34603
**Branch**: `issue-34399`
**Status**: PR open, CI green

### Problem

When generating an Nx plugin (or any JS library) with `tsc` compiler + `vitest` test runner, two conflicting config files were created:

- `vitest.config.mts` — correct, created by vitest `configurationGenerator` with `root: __dirname`
- `vite.config.ts` — redundant, created by a second `createOrEditViteConfig` call from `@nx/vite` with `root: import.meta.dirname`

The redundant `vite.config.ts` used ESM-only `import.meta.dirname`, causing TS1470 when the project targets CommonJS.

### Root Cause

Two different `createOrEditViteConfig` functions exist:
- `packages/vitest/src/utils/generator-utils.ts` — supports `vitestFileName` option, uses `root: __dirname`
- `packages/vite/src/utils/generator-utils.ts` — always uses `root: import.meta.dirname`

The js library generator (`packages/js/src/generators/library/library.ts`) was calling both: first the vitest config generator (which creates `vitest.config.mts`), then directly calling the vite version (which creates the redundant `vite.config.ts`).

### Fix

Removed the redundant `createOrEditViteConfig` call and `ensurePackage('@nx/vite')` from `packages/js/src/generators/library/library.ts`. The vitest `configurationGenerator` already handles all config creation.

### Files Changed

- `packages/js/src/generators/library/library.ts` — removed redundant vite config call
- `packages/js/src/generators/library/library.spec.ts` — updated tests to assert `vitest.config.mts` instead of `vite.config.ts`
- `packages/plugin/src/generators/plugin/plugin.spec.ts` — updated test to assert `vitest.config.mts` instead of `vite.config.ts`
