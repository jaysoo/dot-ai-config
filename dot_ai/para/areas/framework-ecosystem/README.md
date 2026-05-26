# Framework & Bundler Ecosystem Tracking

Monthly reports tracking frameworks and bundlers that Nx wraps via plugins.

## Scope

**Frameworks:** Angular, React, Next.js, Remix/React Router, Nuxt, Vue
**Bundlers:** Vite, webpack, Rspack, Rolldown, esbuild, SWC

## Reports

| Month | Key Events |
|-------|-----------|
| [2026-05](./2026-05.md) | **Rolldown 1.0.0 stable** (May 7, API locked); Angular 22 at rc.1 (May 20, GA imminent); Next.js 16.2.6 security release (12 CVEs: DoS/SSRF/middleware bypass); webpack 5.107.0 experimental TS + HTML modules; Rspack 2.0.4 (CSS global modules, 3 patches post-GA); Next.js 16.3 canary.28 (rootParams default-on, graph-based CSS chunking) |
| [2026-04](./2026-04.md) | Rspack 2.0 GA (2026-04-22, 2.0.1 patch 04-28), Angular 22 next.9 (`@Service` decorator, `paramsInheritanceStrategy` flip, factory removal), esbuild 0.28 breaking, Vite 8.0.10 / Rolldown rc.17 churn, TS 6.0.3 |
| [2026-03](./2026-03.md) | Vite 8 + Rolldown ships, Angular 22 preview drops Node 20, Rspack 2 beta, Next.js 16.2 Adapters stable |

## How to Use

- Run monthly via `scan-frameworks` skill
- Each report includes: compat risks, per-tool analysis, cross-cutting themes, recommended plugin work
- P0 items should be triaged into Linear within the same week
