# Nrwl Repo Security Audits

Periodic CVE/GHSA audits of npm dependencies across nrwl/nx, nrwl/ocean, nrwl/nx-labs, nrwl/nx-console, and the latest published `nx` + first-party `@nx/*` packages. Threshold: HIGH (CVSS ≥ 7.0) and CRITICAL only. Known, patched, publicly postmortemed incidents (S1ngularity Aug 2025, Nx Console 18.95.0 May 2026) are permanently excluded.

## Reports

| Date | File | Status |
|------|------|--------|
| 2026-07-07 | [cve-audit-2026-07-07.md](./cve-audit-2026-07-07.md) | 4 items now 27 days stale (nx: vite, rollup; nx-labs: storybook; published `@nx/vite` peerDep) — escalate. 14 new findings across ocean, nx-labs, nx-console, nx (mostly transitive/devDependency; ocean's axios GHSA and express-bundled path-to-regexp are the most actionable production-runtime items). vitest and undici's prior CVEs resolved in-place but undici has a new one. |
| 2026-06-10 | [cve-audit-2026-06-10.md](./cve-audit-2026-06-10.md) | 1 new finding (rollup), 5 carry-overs from 06-09, 1 published-package finding (`@nx/vite` peerDep). |
| 2026-06-09 | [cve-audit-2026-06-09.md](./cve-audit-2026-06-09.md) | — |
| 2026-06-01 | [cve-audit-2026-06-01.md](./cve-audit-2026-06-01.md) | — |
| 2026-05-29 | [security-audit-2026-05-29.md](./security-audit-2026-05-29.md) | — |
| 2026-05-28 | [2026-05-28-dependency-cve-audit.md](./2026-05-28-dependency-cve-audit.md) | — |

## Related areas

- [dependency-health](../dependency-health/) — staleness/maintenance risk (unmaintained, deprecated, archived deps), not CVE-specific.
- [supply-chain-security](../supply-chain-security/) — publishing pipeline, npm org access, provenance, typosquat monitoring.
