# API Surface Audit

Monthly audit detecting drift between Nx's public API surface and its documentation.

## What This Covers
- Barrel exports (`index.ts`) vs documented API reference pages
- Generator/executor schemas vs `packages.json` documentation registry
- `@nx/devkit` public API: JSDoc coverage, deprecated APIs, internal leaks
- Ocean/Nx Cloud publishable packages (when available)

## Reports
| Month | File | Severity |
|-------|------|----------|
| 2026-03 | [2026-03.md](2026-03.md) | HIGH -- 13 undocumented packages, 50 undocumented generators, systemic rename drift |

## Key Systemic Issues (2026-03)
1. **Generator renames** not reflected in docs (`*-project` -> `configuration` across 8+ packages)
2. **`convert-to-inferred` generators** exist in 12+ packages, none documented
3. **Angular executor modernization** (webpack -> application/esbuild) not in docs
4. **7 entire packages** with generators/executors have zero documentation
5. **`linter` -> `eslint` rename** not updated in docs

## Methodology
- Compare `packages/*/generators.json` and `packages/*/executors.json` schemas against `docs/packages.json`
- Scan `packages/nx/src/devkit-exports.ts` and `packages/devkit/public-api.ts` for JSDoc gaps
- Check `devkit-internals.ts` consumer spread for internal API leaks
- Review git log for recent API surface changes
