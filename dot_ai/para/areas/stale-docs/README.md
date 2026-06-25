# Stale Docs

Ongoing tracking of documentation staleness across repos (primarily `nrwl/nx`).

Docs can go stale in three ways:
1. **Old version numbers** — minimum Nx, Node, or package versions that are now EOL or far behind current
2. **Old code examples** — CI YAML snippets, Docker images, install commands referencing outdated versions
3. **Feature drift** — options or flags documented that no longer exist (or exist differently) in the codebase

## Audits

| Date | Repo | File | Notes |
|------|------|------|-------|
| 2026-06-25 | nrwl/nx | [nx-astro-docs-staleness-2026-06-25.md](./nx-astro-docs-staleness-2026-06-25.md) | Fourth scan (503 files); CircleCI nrwl/nx orb v1 refs, EOL Node 18/20 in Docker + GH Actions, deprecated `tasksRunnerOptions` in parallel guide, "tsconfig for node 16" claim, Yarn 3 as "stable". Linear MCP still broken — 8 new issues queued for manual creation. |
| 2026-06-17 | nrwl/nx | [nx-astro-docs-staleness-2026-06-17.md](./nx-astro-docs-staleness-2026-06-17.md) | Third scan; deprecated cacheableOperations/tasksRunnerOptions in active feature pages, dead Nx ≤ 19.6 conditionals in cloud docs, stale TS 4.7 ref, "prior to Nx 18" blocks. Linear MCP broken (SSE transport removed) — 8 issues queued for manual creation. |
| 2026-06-12 | nrwl/nx | [nx-astro-docs-staleness-2026-06-12.md](./nx-astro-docs-staleness-2026-06-12.md) | Follow-up scan; svgr option documented but removed from source in Nx 22, stale Nx 15.7 linkcard, composePlugins/withReact removal in Nx 24 to monitor |
| 2026-06-11 | nrwl/nx | [nx-astro-docs-staleness-2026-06-11.md](./nx-astro-docs-staleness-2026-06-11.md) | Full scan of 501 mdoc files; Node 20 EOL, Nx 15–19 version refs, @nrwl/ package names |

## Recurring Checks to Run

- After each Nx major release: grep for `Nx {prev_major}` caveats in non-deprecated docs
- Annually (April/October): grep `node-version:`, `node:XX`, `Node.js.*vXX` against Node.js release schedule EOL dates
- When a package is deprecated: grep for `@nrwl/` scope if any `@nx/` migration happened
