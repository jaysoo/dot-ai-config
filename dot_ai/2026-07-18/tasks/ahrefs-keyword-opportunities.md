# Ahrefs keyword opportunity analysis (nx.dev US organic)

Source: `~/Downloads/nx.dev-organic-keywords-domain-us--actual_2026-07-18_12-58-42.csv` (251 keywords, US, pulled 2026-07-18)

Linear: DOC-555 (https://linear.app/nxdev/issue/DOC-555)

**Caveat:** position data mostly June-early July - predates DOC-549 merge (#36307, 2026-07-15) which already shipped what-is-a-monorepo, monorepo-vs-polyrepo rename, npm/yarn/bun workspaces pages, MFE/rspack/self-hosted-cache refreshes. Re-pull Ahrefs mid-August to measure movement before new work on those pages.

Goal: find low-hanging missed keyword opportunities relevant to Nx CLI + Nx Cloud. Both branded and unbranded. Unbranded = funnel entry - do not lose these users to Turborepo.

## Noise (exclude - other "NX" entities)

- Siemens NX CAD: `nx license cost` (100v -> /pricing), `nx mac`, `x nx` (900v), `nx failed to find file using current search options`
- Lexus NX: `nx video`
- Roblox: `what executors are online` (200v -> web executors reference)
- Numeric/bible junk: `19.8/4`, `x+8=19.8`, `19.8/9`, `21.6/9`, `21.6/4`

These inflate impressions but are unwinnable/worthless. No action.

## Tier 1 - striking distance (pos 5-15, real volume, page already ranks)

| Keyword | Vol | KD | Pos | Current URL |
|---|---|---|---|---|
| monorepo | 6400 | 48 | 15 | nx.dev/ (homepage) |
| esbuild | 2700 | 25 | 15 | build-tools/esbuild/introduction |
| lerna | 1800 | 54 | 10 | blog/lerna-is-dead-long-live-lerna |
| angular cli | 1700 | 69 | 10 | angular/guides/nx-and-angular |
| pnpm workspaces | 300 | 30 | 10 | blog (setup-a-monorepo-with-pnpm...) |
| rspack | 200 | 44 | 5 | build-tools/rspack/introduction |
| monorepo structure | 150 | 3 | 9 | concepts/decisions/folder-structure |
| monorepo vs | 100 | 3 | 11 | concepts/decisions/overview |
| next js micro frontend | 100 | 3 | 10 | MFE concept page |
| what is micro frontend | 90 | 5 | 11 | MFE concept page |
| module federation react | 70 | 22 | 9 | module-federation-and-nx |
| npmrc registry (+ npm multiple registries, npmrc multiple registry) | 120 agg | 0-34 | 6-11 | nx-release/configure-custom-registries |
| remote cache | 20 | 25 | 9 | nx.dev/remote-cache |

Key insight: `monorepo` (6400v) ranks pos 15 with only the marketing homepage. No dedicated "What is a monorepo?" evergreen page on nx.dev. Same page also catches `monorepo js`, `javascript monorepo`, `node monorepo`, `monorepo build tools` at pos 4-8. One strong concept/landing page lifts all.

## Tier 2 - micro frontend cluster consolidation

~30 keyword variants (react/angular/nextjs x mfe/micro frontend/micro-frontends + head terms) ALL rank via one page: `module-federation/concepts/micro-frontend-architecture`, pos 4-11. Aggregate ~1,700+/mo.

Action: framework-specific landing guides ("Micro frontends with React", "Micro frontends with Angular", "Micro frontends with Next.js") to take top-3 on framework-qualified queries; keep concept page for head terms.

## Tier 3 - competitive/defensive + gaps (not ranking today)

Ranking well already (defend): `turbo monorepo` pos 4 (nx-vs-turborepo), `lerna vs nx` pos 4, `monorepo vs polyrepo` pos 5, `cypress component testing` pos 5.

Gaps (no ranking URL in export - new content or expansion needed):
- `monorepo tools` / best monorepo tools comparison
- `yarn workspaces`, `npm workspaces` (mirror the pnpm-workspaces blog pattern that already ranks pos 10)
- `react monorepo`, `vite monorepo`, `nestjs monorepo` (typescript/angular/gradle monorepo variants already rank via blogs)
- `turborepo alternative(s)`
- Nx Cloud funnel: `build cache`, `ci caching`, `speed up ci`, `distributed task execution`, `flaky tests ci`, `monorepo ci`
- `monorepo tutorial`

## Cross-cutting

- Most head terms show AI Overview SERP feature -> GEO heading/structure work (Caleb's GEO project) applies directly to these pages.
- Blog posts ranking for evergreen queries (pnpm workspaces, typescript monorepo, angular state management, semantic release monorepo) age out; consider promoting winners to docs guides with redirects.

## Recommended execution order

1. "What is a monorepo?" evergreen page + internal links (biggest single prize: 6400v at pos 15).
2. MFE framework-specific guides (React, Angular, Next.js).
3. yarn/npm workspaces guides + monorepo tools comparison.
4. Nx Cloud cluster: remote cache concept + ci caching/speed-up-ci content.
5. GEO pass on all Tier-1 pages.
