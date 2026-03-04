# nx-import Next.js Skill Development

**Linear**: [NXA-1075](https://linear.app/nxdev/issue/NXA-1075)
**Status**: In Progress — Phase 2 (Iterative Testing)
**Started**: 2026-03-04

## Goal

Build and validate a comprehensive skill reference (`NEXT.md`) for importing Next.js projects into Nx workspaces via `nx import`. Follow the same iterative loop used for VITE.md.

## Scenario Design

| # | Source Type | Complexity | Notes |
|---|-------------|------------|-------|
| 1 | Nx monorepo, Next.js App Router | Basic | App + shared lib, `@nx/next` plugin |
| 2 | Nx monorepo, Pages Router + App Router | Medium | Multiple apps, mixed routing |
| 3 | Non-Nx (create-next-app) | Medium | No nx.json, raw scripts, App Router |
| 4 | Non-Nx (create-next-app, Pages Router) | Medium | Older pattern, pages dir |
| 5 | Mixed sources (Next + Vite React) | Complex | Two imports, dep conflicts |
| 6 | Next.js with Tailwind + custom config | Medium | distDir, images, rewrites |

## Key @nx/next Differences from Vite

- Plugin detects `next.config.{ts,js,cjs,mjs}` (not vite.config)
- Inferred targets: `build` (next build), `dev` (next dev), `start` (next start), `serve-static`
- No separate typecheck target — Next.js uses `tsc` via `next build`
- `dependsOn: ['^build']` for build target
- Uses `@nx/js:typescript-sync` for TS solution setup
- Output in `.next/` directory (configurable via `distDir`)
- `withNx` wrapper in next.config.js for Nx-generated projects

## Iteration Log

### Round 1: Scenario 1 (Basic Nx Next.js + Shared Lib)
- 7 issues found, all documented in NEXT.md
- Key findings: tsconfig changes, root deps, jest setup, ESLint setup

### Round 2: Scenario 3 (Non-Nx create-next-app)
- 3 issues found, mostly cleanup (stale files, rewritten scripts)
- Key finding: self-contained configs need minimal changes

### Round 3: Scenario 5 (Mixed Next.js + Vite React)
- 7 issues found, cross-framework specific
- Key findings: ESLint 8/9 version conflict, Vite composite tsconfig needs, target name coexistence

### Remaining
- Scenario 2: Pages Router (lower priority — App Router is the default now)
- Scenario 4: Non-Nx Pages Router (lower priority)
- Scenario 6: Custom distDir / images / rewrites (nice-to-have)
