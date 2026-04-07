# API Surface Audit

Monthly audit detecting drift between Nx's public API surface and its documentation.

## What This Covers
- Barrel exports (`index.ts`) vs documented API reference pages
- Generator/executor schemas vs `packages.json` documentation registry
- `@nx/devkit` public API: JSDoc coverage, deprecated APIs, internal leaks
- Ocean/Nx Cloud publishable packages (when available)

## Reports
| Month | File | Severity | Findings |
|-------|------|----------|----------|
| 2026-04 | [2026-04.md](2026-04.md) | HIGH | 14H/48M/25L -- 12 undocumented packages, 40 undocumented generators, v22/v23 deprecation wave |
| 2026-03 | [2026-03.md](2026-03.md) | HIGH | 13H/50M/18L -- 13 undocumented packages, 50 undocumented generators, systemic rename drift |

## Key Systemic Issues (2026-04)
1. **Generator renames** not reflected in docs (`*-project` -> `configuration` across 8+ packages)
2. **`convert-to-inferred` generators** exist in 12+ packages, none documented
3. **Angular executor modernization** (webpack -> application/esbuild) not in docs
4. **12 entire packages** with generators/executors have zero documentation
5. **`linter` -> `eslint` rename** not updated in docs
6. **7 deprecated APIs past removal deadline** (v19/v20) still in codebase
7. **New deprecation waves**: 9 items targeting v22, 15 items targeting v23

## Methodology
- Compare `packages/*/generators.json` and `packages/*/executors.json` schemas against `docs/packages.json`
- Scan `packages/nx/src/devkit-exports.ts` and `packages/devkit/public-api.ts` for JSDoc gaps
- Check `devkit-internals.ts` consumer spread for internal API leaks
- Review git log for recent API surface changes
