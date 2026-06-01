# Framework & Bundler Ecosystem Tracking

Monthly reports tracking frameworks and bundlers that Nx wraps via plugins.

## Scope

**Frameworks:** Angular, React, Next.js, Remix/React Router, Nuxt, Vue
**Bundlers:** Vite, webpack, Rspack, Rolldown, esbuild, SWC

## Reports

| Month | Key Events |
|-------|-----------|
| [2026-06](./2026-06.md) | Angular CVE-2026-27739 (SSRF) + CVE-2026-22610 (XSS) security patches across all active lines; Angular 22 GA imminent (RC.2 May 28, GA week of June 1); Rspack 2.0.5 adds import.meta.glob (Vite parity) + CSS module parser controls; Next.js 16.3-canary.36 (GA window closing); Vue 3.6-beta.13 (Vapor Mode feature-complete); Vite 8.0.15+16 same-day patches (June 1); React Router 7.16.0; Remix 3-beta.3 |
| [2026-05](./2026-05.md) | **W22 refresh**: Angular 22 RC.0 + RC.1 (signal forms public, WebMCP APIs, Node 26); Rolldown 1.0 STABLE + 1.0.1 + 1.0.2; webpack 5.107 (experimental TS support, HTML entry, CSS scope hoisting); Rspack 2.0.2/3/4 weekly cadence; Next.js 16.3 canary.10→28 (19 in 21d); Vite 8.0.11→14; Nuxt + Vue beta cadence resumed. **W19**: Angular 22 next.10 (`injectAsync`, model/output migrations); Remix 3.0.0-beta.0 promotion; Rolldown rc.18 default `inlineConst.mode='smart'` |
| [2026-04](./2026-04.md) | Rspack 2.0 GA (2026-04-22, 2.0.1 patch 04-28), Angular 22 next.9 (`@Service` decorator, `paramsInheritanceStrategy` flip, factory removal), esbuild 0.28 breaking, Vite 8.0.10 / Rolldown rc.17 churn, TS 6.0.3 |
| [2026-03](./2026-03.md) | Vite 8 + Rolldown ships, Angular 22 preview drops Node 20, Rspack 2 beta, Next.js 16.2 Adapters stable |

## How to Use

- Run monthly via `scan-frameworks` skill
- Each report includes: compat risks, per-tool analysis, cross-cutting themes, recommended plugin work
- P0 items should be triaged into Linear within the same week
