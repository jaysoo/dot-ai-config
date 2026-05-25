# Runtime Tracking

Monthly tracking of JavaScript runtime ecosystem changes relevant to Nx CLI and Nx Cloud.

## Scope

- **Node.js**: Releases, LTS lifecycle, V8 bumps, ESM/CJS changes, `--strip-types`
- **TC39**: Stage changes for proposals affecting module systems, decorators, type annotations
- **Bun**: Releases, Node.js compat, workspace support
- **Deno**: Releases, Node/npm compat, workspace/monorepo support

## Reports

| Month | File | Key Events |
|-------|------|------------|
| 2026-05 | [2026-05.md](2026-05.md) | **Node 26.0.0 released** (LTS Oct 2026, breaking: `--experimental-transform-types` removed, `module.register()` deprecated, V8 14.6/Temporal default), Node 25 EOL June 1, Node 24.16.0 LTS (`randomUUIDv7`, QUIC), Bun 1.3.14 (HTTP/3, Bun.Image/Sharp-replacement, 7x faster installs), Deno 2.8 (TypeScript 6.0, workspace catalog, `deno why`), `engines` field still missing (5th flag) |
| 2026-04 | [2026-04.md](2026-04.md) | **Node 20 EOL in 2 DAYS**, v24.15.0 LTS ships `require(esm)` + module compile cache stable + `--max-heap-size` backport, `module.register()` deprecated (DEP0205), Deno 2.7.13 `node:http` rewrite, TC39 Import Text → Stage 3, `engines` field missing (4th flag) |
| 2026-03 | [2026-03.md](2026-03.md) | Node.js security release (9 CVEs), Bun 1.3.11, Deno 2.7 |
