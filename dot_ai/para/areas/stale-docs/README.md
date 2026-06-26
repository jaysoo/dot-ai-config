# Stale Docs

Ongoing tracking of documentation staleness across repos (primarily `nrwl/nx`).

Docs can go stale in three ways:
1. **Old version numbers** — minimum Nx, Node, or package versions that are now EOL or far behind current
2. **Old code examples** — CI YAML snippets, Docker images, install commands referencing outdated versions
3. **Feature drift** — options or flags documented that no longer exist (or exist differently) in the codebase

## Audits

| Date | Repo | File | Notes |
|------|------|------|-------|
| 2026-06-26 | nrwl/nx | [nx-astro-docs-staleness-2026-06-26.md](./nx-astro-docs-staleness-2026-06-26.md) | Fifth scan (503 files). 6 new issues: stale `22.5.0` version in installation.mdoc, `@nx/jest@12` override example, `target: 'node18'` in Vite config (EOL), wrong `pnpm-workspaces.yml` filename, Angular 13 refs in migration guide, `nx@22.2.0` in releases.mdoc. Linear MCP still unavailable — 24 total issues queued (M11–M13, L9–L11 new). |
| 2026-06-24 | nrwl/nx | [nx-astro-docs-staleness-2026-06-24.md](./nx-astro-docs-staleness-2026-06-24.md) | Fourth scan; 2 new issues (dead Nx < 17.2 cache troubleshooting step, stale "Nx 20+" label in explore-graph); all prior open issues re-aggregated into one table. Linear MCP still unavailable — 18 total issues queued for manual creation. |
| 2026-06-17 | nrwl/nx | [nx-astro-docs-staleness-2026-06-17.md](./nx-astro-docs-staleness-2026-06-17.md) | Third scan; deprecated cacheableOperations/tasksRunnerOptions in active feature pages, dead Nx ≤ 19.6 conditionals in cloud docs, stale TS 4.7 ref, "prior to Nx 18" blocks. Linear MCP broken (SSE transport removed) — 8 issues queued for manual creation. |
| 2026-06-12 | nrwl/nx | [nx-astro-docs-staleness-2026-06-12.md](./nx-astro-docs-staleness-2026-06-12.md) | Follow-up scan; svgr option documented but removed from source in Nx 22, stale Nx 15.7 linkcard, composePlugins/withReact removal in Nx 24 to monitor |
| 2026-06-11 | nrwl/nx | [nx-astro-docs-staleness-2026-06-11.md](./nx-astro-docs-staleness-2026-06-11.md) | Full scan of 501 mdoc files; Node 20 EOL, Nx 15–19 version refs, @nrwl/ package names |

## Recurring Checks to Run

- After each Nx major release: grep for `Nx {prev_major}` caveats in non-deprecated docs
- Annually (April/October): grep `node-version:`, `node:XX`, `Node.js.*vXX` against Node.js release schedule EOL dates
- When a package is deprecated: grep for `@nrwl/` scope if any `@nx/` migration happened
