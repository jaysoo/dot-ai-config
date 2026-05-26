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
| 2026-05 | [2026-05.md](./2026-05.md) | Current — YELLOW. W22: nx@next stray dist-tag fixed (now 23.0.0-beta.19). Provenance gap unchanged at 14 pkgs. xmldom floor in `@nx/maven` carryover month 3. nx-cloud publish 55d stale. |
| 2026-04 | [2026-04.md](./2026-04.md) | Previous — YELLOW. Ocean trusted publishing went live 2026-04-08. xmldom CVE batch landed for `@nx/maven`. |
| 2026-03 | [2026-03.md](./2026-03.md) | Older — YELLOW |
