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
| 2026-05 | [2026-05.md](./2026-05.md) | Current — YELLOW. Provenance gap wider than thought: 14 Nrwl-published packages lack SLSA attestations (5 Ocean + 9 Powerpack `@nx/*`). xmldom floor in `@nx/maven` still stale (carried from April). |
| 2026-04 | [2026-04.md](./2026-04.md) | Previous — YELLOW. Ocean trusted publishing went live 2026-04-08. xmldom CVE batch landed for `@nx/maven`. |
| 2026-03 | [2026-03.md](./2026-03.md) | Older — YELLOW |
