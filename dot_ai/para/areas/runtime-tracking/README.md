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
| 2026-06 | [2026-06.md](2026-06.md) | **11 CVEs HIGH/MEDIUM (Jun 18 security batch)**, Node 26.4.0 `node:vfs`, Node 24.18.0 Buffer 64KiB, **Deno 2.9.0 workspace node_modules + lockfile migration (major competitive shift)**, **TC39 Temporal Stage 4 confirmed**, Node 25 EOL, Node 20 60d post-EOL, `engines` null (8th flag), Bun 47d no release |
| 2026-05 | [2026-05.md](2026-05.md) | **Node 26 GA** (Temporal default, V8 14.6, Undici 8, `module.register()` runtime-deprecated), **Node 25 EOL 2026-06-01 (7 days)**, **Node 20 25 days post-EOL**, Deno 2.8.0 (`catalog:` protocol, hoisted node_modules, import defer unstable, `deno pack`/`ci`/`bump-version`), Bun 1.3.14 (low signal), Bun lockfile #16252 dead (6mo no activity), Bun 1.3.13 test orchestration carryover, `engines` field missing (6th flag) |
| 2026-04 | [2026-04.md](2026-04.md) | **Node 20 EOL in 2 DAYS**, v24.15.0 LTS ships `require(esm)` + module compile cache stable + `--max-heap-size` backport, `module.register()` deprecated (DEP0205), Deno 2.7.13 `node:http` rewrite, TC39 Import Text → Stage 3, `engines` field missing (4th flag) |
| 2026-03 | [2026-03.md](2026-03.md) | Node.js security release (9 CVEs), Bun 1.3.11, Deno 2.7 |
