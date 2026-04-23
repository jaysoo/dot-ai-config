# Framework & Bundler Ecosystem Tracking

Monthly scan reports tracking releases, breaking changes, and Nx plugin impact for the major frameworks and bundlers in the Nx ecosystem.

## Tracked Projects

### Frameworks

- **Angular** (@angular/core) -- `@nx/angular`
- **React** (react) -- `@nx/react`
- **Next.js** (next) -- `@nx/next`
- **Vue** (vue) -- `@nx/vue`
- **Nuxt** (nuxt) -- `@nx/nuxt` (community)
- **React Router / Remix** (react-router, remix) -- `@nx/remix`

### Bundlers

- **Vite** (vite) -- `@nx/vite`
- **Webpack** (webpack) -- `@nx/webpack`
- **Rspack** (@rspack/core) -- `@nx/rspack`
- **Rolldown** (rolldown) -- consumed via Vite
- **esbuild** (esbuild) -- `@nx/esbuild`
- **SWC** (@swc/core) -- used by Next.js, Angular, `@nx/js`

### Cross-Cutting

- **TypeScript** (typescript) -- affects all Nx generators and tsconfig management

## Reports

| Month   | File         |
| ------- | ------------ |
| 2026-04 | `2026-04.md` |
| 2026-03 | `2026-03.md` |
| 2026-02 | `2026-02.md` |

## Process

Reports are generated via the "Framework & Bundler Ecosystem Tracking" scan. The scan:

1. Reads cached GitHub release data from `/tmp/scan-data-*/releases/`
2. Verifies current stable versions via npm
3. Filters releases to the lookback window (typically ~60 days)
4. Analyzes breaking changes, new features, deprecations, and Nx plugin impact
5. Writes/updates the monthly report with compatibility risks and recommended plugin work
