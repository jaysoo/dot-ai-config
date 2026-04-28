# Supply Chain Security Audits

Monthly supply chain security reviews for Nx published packages.

## Scope

- npm audit results (full and production-only)
- Publishing workflow security (GitHub Actions)
- npm org access and collaborator controls
- Dependency provenance and attestations
- Typosquat detection for @nx, @nrwl, @nx-cloud scopes
- Comparison with previous month

## Reports

| Month | File | Status |
|-------|------|--------|
| 2026-04 | [2026-04.md](./2026-04.md) | Current — YELLOW. Ocean now uses trusted publishing (no static tokens, confirmed via live registry). Provenance gap downgraded to one-line config fix. New `@xmldom/xmldom` CVEs reach `@nx/maven` users. |
| 2026-03 | [2026-03.md](./2026-03.md) | Previous — YELLOW |
