# NXC-4483 Release prep (Nx v23)

**Date:** 2026-05-21

## Shipped surfaces

### New (v23)

- `@nx/react:provider` generator (React; Vite default + Rsbuild + Rspack)
- `@nx/react:consumer` generator (React; Vite default + Rsbuild + Rspack)
- Generators live in `@nx/react` (framework-scoped, leaves room for `@nx/angular:provider` etc later); shared bits (federation-name validator, port defaults, version pins) live in `@nx/module-federation/src/generators/_utils/`.
- Removed the conflicting `consumer` / `producer` aliases that previously pointed at the deprecated `host` / `remote` generators.
- Dynamic federation via `public/mf-remotes.json` + `src/mf.ts` `lazyRemote()` helper
- Docs page: `astro-docs/src/content/docs/technologies/module-federation/consumer-and-provider.mdoc`

### Deprecated (v23) -> removed (v24)

| Surface | Package |
| ------- | ------- |
| `host`, `remote`, `federate-module` generators | `@nx/react`, `@nx/angular` |
| `setup-mf` generator | `@nx/angular` |
| `module-federation-dev-server`, `module-federation-ssr-dev-server`, `module-federation-static-server` executors | `@nx/react`, `@nx/rspack` |
| `module-federation-dev-server`, `module-federation-dev-ssr` executors | `@nx/angular` |
| All Angular Module Federation surfaces (use `@angular-architects/native-federation` instead) | `@nx/angular` |

Each deprecated surface logs a `logger.warn(...)` at invocation pointing at `https://nx.dev/docs/technologies/module-federation/consumer-and-provider`.

## Loud callouts for release notes

> **Behavior change:** `nx serve <host>` no longer auto-builds and serves all remotes when migrating to the new `@nx/module-federation:consumer` generator. Dynamic federation handles missing remotes via a graceful runtime error, so the host's orchestration responsibility is gone. Serve only the apps you want; missing remotes 404 lazily inside the consumer's `Suspense` boundary.

> **Angular Module Federation in Nx is no longer supported.** Use `@angular-architects/native-federation` for the supported Angular path. The Angular MF surfaces in `@nx/angular` are deprecated in v23 and will be removed in v24.

## Validation

- [x] `pnpm nx run-many -t build-base,lint -p react,angular,rspack` (deprecation wiring)
- [x] `pnpm nx run-many -t build-base,lint -p module-federation` (new generators)
- [x] `pnpm nx test module-federation --testPathPatterns='(provider|consumer|normalize)'` (22 tests, snapshots written)
- [x] `pnpm nx lint e2e-module-federation-v2` (new e2e project lints clean)
- [x] `pnpm nx run astro-docs:vale` (added `TanStack` + `TanStack Router` to Nx.Headings exception list)
- [x] `pnpm nx run astro-docs:validate-links`
- [x] `pnpm nx affected -t build-base,lint --exclude=e2e-*` (green; 88 projects, 57 dependent tasks)
- [x] `pnpm nx affected -t test --exclude=e2e-*` - all my added tests pass; pre-existing failures in `nx` and `react` packages are unchanged (verified by `git stash` + re-run; same `4 failed, 31 passed` baseline in `react` with or without my changes - unrelated to this PR)
- [x] **End-to-end smoke test (Vite stack)** - scaffolded provider + consumer to `/tmp/mf-smoke/workspace`, `pnpm install` per project, ran `pnpm dev` on both, navigated via Playwright MCP. Screenshots in `.playwright-mcp/`:
  - `mf-v2-vite-provider-standalone.png` - provider serves on `127.0.0.1:5101`, renders its exposed `App` component
  - `mf-v2-vite-consumer-with-remote.png` - consumer on `127.0.0.1:5100` fetches `/mf-remotes.json` at runtime, lazy-loads provider, renders both
  - `mf-v2-vite-consumer-missing-remote-graceful.png` - provider killed, consumer renders own UI + error alert: "Remote unavailable: Failed to fetch dynamically imported module: http://localhost:5101/remoteEntry.js" (validates the v23 hand-off claim that missing remotes 404 lazily without crashing the host)
- [ ] Run the Rsbuild + Rspack e2e test files against a real workspace in CI (Vite was the only bundler exercised end-to-end locally; the test files exist for the other two)

## Out of scope (separate follow-up tickets)

- v24 removal of deprecated surfaces
- v24.x re-add of `host` / `remote` as aliases that forward to `consumer` / `provider`
- Angular Native Federation docs (handed off to Manfred - see `nxc-4483-angular-native-federation-handoff-to-manfred.md`)
- SSR-first generators (deferred; v23 docs link out to module-federation.io for users who need it)
