# Nx Template Audit

Started: 2026-06-23 11:28 ET

## Goal

Audit the template repos linked from https://nx.dev/docs/templates:

- Confirm each documented `create-nx-workspace` command runs without errors.
- Confirm only Angular and NestJS templates use `project.json`; all others use Nx target config in `package.json`.
- Check `README.md` links for 404s.
- Confirm Nx is `23.0.0` and TypeScript is `6.x`, calling out templates that legitimately require TypeScript 5.
- Run `test`, `build`, `lint`, and `typecheck` where available.

## Plan

1. Discover all template repos from the docs page.
2. Clone/template-check repos in scratch directories.
3. Delegate independent repo validation to subagents.
4. Summarize failures and repos needing follow-up.

## Notes

- Keep checks read-only unless the user asks for fixes.

## Results

Checked 12 templates from https://nx.dev/docs/templates.

### Cross-cutting

- `create-nx-workspace` commands: 11 passed with `npx -y create-nx-workspace@latest <name> --template <template> --no-interactive`; `tanstack-ai-template` failed fresh install.
- Nx versions: all cloned repos and generated workspaces checked are pinned to `nx@23.0.0`. `create-nx-workspace@latest` itself currently prints `v23.0.1`, but generated template package.json files still use `nx@23.0.0`.
- Config layout: passes. Only Angular and NestJS have `project.json`; all other templates use package-based config/inferred targets.
- README links: no 404s found. LinkedIn returns HTTP 999 to HEAD checks, and `cloud.nx.app` returned one 429 during repeated Astro checks; neither is a README 404.
- TypeScript 5 exception: Angular has a real peer constraint (`@angular/build` / `@angular-devkit/build-angular` require `typescript >=5.9 <6.0`).

### Repos needing attention

- `nrwl/tanstack-ai-template`: CNW install fails because fresh npm resolution picks `@tanstack/ai-anthropic@0.15.7`, which peers on `@tanstack/ai@^0.34.0`, while the template requests `@tanstack/ai@^0.33.0`. Also README says TS 5.9 while repo uses TS 6, lint is `echo 'lint ok'`, and web typecheck is disabled.
- `nrwl/angular-template`: `shop:build:production` exits 1. Verbose output shows Zone.js indirect `require` debug diagnostics, then Nx reports `Failed tasks: shop:build:production`; no compiler error is emitted. TS 5.9 is expected here due Angular peer constraints. `test` target is absent.
- `nrwl/react-template`: targets pass, but TypeScript is still `~5.9.2` with no clear TS 5 blocker found.
- `nrwl/typescript-template`: targets pass, but TypeScript is still `~5.9.2` with no clear TS 5 blocker found.
- `nrwl/nextjs-template`: CNW and targets pass, but TypeScript is still `~5.9.2`; `next@16.1.7` does not declare a TS `<6` peer constraint.
- `nrwl/nestjs-template`: CNW and available targets pass, but TypeScript is still `~5.9.2` and `typecheck` target is absent.
- `nrwl/express-api-template`: all targets pass, but TypeScript is still `~5.9.2` with no clear TS 5 blocker found.
- `nrwl/tanstack-start-template`: CNW and available targets pass, but README says TS 5.9 while repo uses TS 6, lint is `echo 'lint ok'`, web typecheck is disabled, and `test` is absent.
- `nrwl/react-mfe-template`: CNW, test, and build pass; `lint` and `typecheck` targets are absent.
- `nrwl/astro-starlight-template`: CNW, build, and typecheck pass; `test` and `lint` targets are absent.

### Clean / no action from this audit

- `nrwl/empty-template`: CNW works, no `project.json`, Nx 23.0.0, TS 6.0.3, no README 404s. No project targets exist yet.
- `nrwl/remotion-template`: CNW works, no `project.json`, Nx 23.0.0, TS 6.0.3 in app package, README links clean, `typecheck` passes. `test`, `build`, and `lint` targets are absent.
