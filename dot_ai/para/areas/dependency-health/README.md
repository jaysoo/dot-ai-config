# Dependency Health Audits

Monthly audit of third-party dependency health for the Nx monorepo (and Ocean when available).

## Purpose

Track staleness, deprecation, security issues, and version pinning gaps across all publishable Nx packages. Identify unmaintained dependencies before they become blockers.

## Schedule

Run on or near the 1st of each month. Reports are named `YYYY-MM.md`.

## Risk Classification

- **Critical**: >24 months since last publish, deprecated, or archived
- **Warning**: 12-24 months since last publish or repo inactive >12 months
- **Watch**: 6-12 months since last publish
- **Healthy**: Active, published within last 6 months

## Reports

| Month   | File         | Summary |
| ------- | ------------ | ------- |
| 2026-03 | `2026-03.md` | 24 critical, 13 warning, 12 watch, 117 healthy (166 total). Final scan 2026-03-23. |
| 2026-02 | `2026-02.md` | |
