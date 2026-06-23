# Fix CNW Template Audit Findings

Started: 2026-06-23 13:07 ET

## Goal

Fix requested issues in `~/projects/cnw-templates`:

- `tanstack-ai-template`: fresh `create-nx-workspace --template nrwl/tanstack-ai-template` install should work.
- `angular-template`: production build should pass.
- `tanstack-start-template`: README should match actual TypeScript version.
- Templates still on TypeScript 5.9 can stay there as long as README/package versions are in sync.

## Plan

1. [x] Inspect current diffs and relevant package/README/build config.
2. [x] Patch TanStack AI dependency range and README version text.
3. [x] Patch TanStack Start README version text.
4. [x] Debug and patch Angular production build failure.
5. [x] Run focused verification for changed repos.

## Summary

- `tanstack-ai-template`: updated TanStack AI packages to the compatible 0.34 generation, refreshed `package-lock.json`, and corrected the README TypeScript row to 6.0.
- `tanstack-start-template`: corrected the README TypeScript row to 6.0.
- `angular-template`: changed the Angular SSR fallback route from `Prerender` to `Server` so production builds do not prerender dynamic storefront URLs and call the API during build.
- TypeScript README/package sweep: only TanStack AI and TanStack Start publish an explicit README TypeScript version; both now match `~6.0.3`. Repos still on `~5.9.2` have no explicit README TypeScript version row.

## Verification

- `tanstack-ai-template`: `npm install`; `npx nx sync`; `npx nx run-many -t build,typecheck`; clean-copy `npm ci`; clean-copy `npx nx run-many -t build,typecheck`; `npx nx run-many -t build,lint,typecheck --all`; README link check returned `[]`; `git diff --check`.
- `tanstack-start-template`: `npx nx run-many -t build,typecheck`; `npx nx run-many -t build,lint,typecheck --all`; README link check returned `[]`; `git diff --check`.
- `angular-template`: `npx nx run shop:build:production`; `npx nx run-many -t build,lint,typecheck --all`; `npx nx run-many -t vite:test --all -- --run`; README link check returned `[]`; `git diff --check`.

## Notes

- TanStack templates do not define a real `test` target.
- The TanStack `web:typecheck` target is pre-existing generated behavior that echoes a disabled-typecheck message because of project-reference `noEmit` settings.
- `npx -y create-nx-workspace@latest ... --template /Users/jack/projects/cnw-templates/tanstack-ai-template` still cannot be used for local verification because CNW rejects non-`nrwl` GitHub template names; the clean-copy `npm ci` plus Nx target run verifies the dependency resolution issue directly.
