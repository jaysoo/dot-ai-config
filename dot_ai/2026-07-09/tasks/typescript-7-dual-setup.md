# TypeScript 7 Dual Setup Investigation

## Goal

Figure out whether this Nx workspace can run TypeScript 7 for selected projects while keeping other projects on the existing TypeScript version, and identify the blocker in Nx's inferred TypeScript targets if it cannot.

## Context

- GitHub discussion: `nrwl/nx#36274`
- TS side-by-side guidance: `https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0`
- Local workspace uses `@nx/js/typescript` inferred targets from `nx.json`.

## Plan

1. Inspect workspace package manager, Nx plugin setup, and inferred project targets.
2. Verify how `@nx/js/typescript` invokes `tsc` for build/typecheck.
3. Test npm alias/bin behavior for a side-by-side TypeScript install.
4. Determine whether per-project TS selection is possible through config alone.
5. Summarize a practical workaround and any Nx plugin change needed.

## Notes

- Started 2026-07-09 08:46 ET.
- `@nx/js/typescript` and `@nx/vite/plugin` both infer TypeScript targets with a configurable `compiler` option.
- Splitting both plugins with `include`/`exclude` allows selected projects to use `tsc` while the rest use `tsc6`.
- `typescript` should point to `npm:@typescript/typescript6`; the TS 7 package can be installed under the alias `@typescript/native`.
- The Vite plugin must also be split for Vite projects, otherwise their inferred `typecheck` target still uses plain `tsc`.
- TS 7 selected projects must remove `baseUrl`; TS 6 projects can continue with `ignoreDeprecations: "6.0"` during migration.

## Verification

- `npx tsc --version` => `Version 7.0.2`
- `npx tsc6 --version` => `Version 6.0.3`
- `npx nx run @org/colors:build` passed with `tsc`
- `npx nx run @org/colors:typecheck` passed with `tsc`
- `npx nx run @org/utils:build` passed with `tsc6`
- `npx nx run @org/strings:typecheck` passed with `tsc6`
- `npx nx run-many -t build,typecheck` passed for all 4 projects.
