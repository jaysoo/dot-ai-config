# Nrwl Repo Security Audits

Ad-hoc/periodic HIGH+CRITICAL CVE audits across nrwl/nx, nrwl/ocean, nrwl/nx-labs, nrwl/nx-console, and the latest published `nx`/`@nx/*` packages on npm. Distinct from [`supply-chain-security/`](../supply-chain-security/README.md) (monthly npm-publish-pipeline/provenance review) and [`dependency-health/`](../dependency-health/README.md) (staleness/maintenance risk, not CVEs) — this area is specifically about known, exploitable vulnerabilities with a version range and a fix.

## Scope

- Direct + notable transitive dependencies in each repo's lockfile, cross-referenced against resolved versions (not just declared ranges) and any existing `overrides`/`resolutions`/catalog pins
- HIGH (CVSS ≥ 7.0) and CRITICAL only
- Latest published `nx`/`@nx/*` packages for CVEs in the first-party code itself (not just dependencies)
- Explicitly excludes already-disclosed-and-patched incidents (S1ngularity Aug 2025, Nx Console 18.95.0 malicious-package incident May 2026)

## Reports

| Date | File | Notable findings |
|------|------|-------------------|
| 2026-07-11 | [cve-audit-2026-07-11.md](./cve-audit-2026-07-11.md) | New GHSA-vp3h-ghgh-jr7g (zip-slip, HIGH) published 2026-07-10 in `@nx/*-cache` packages, compounding CREEP; new `@remix-run/dev`/`@remix-run/node` CVEs in nx; rollup/vite (nx) and storybook (nx-labs) now 31 days stale; minimatch fix corrected to `^9.0.7` |
| 2026-07-10 | [cve-audit-2026-07-10.md](./cve-audit-2026-07-10.md) | CVE-2025-36852 (CREEP, CRITICAL, unpatchable-by-design in `@nx/*-cache` packages); nx `rollup`/`vite` and nx-labs `storybook` now 30 days stale; new ocean findings incl. `tar` inside the CLI client bundle |
| 2026-06-10 | [cve-audit-2026-06-10.md](./cve-audit-2026-06-10.md) | New rollup CVE-2026-27606; carried forward vitest/next.js/undici/storybook |
| 2026-06-09 | [cve-audit-2026-06-09.md](./cve-audit-2026-06-09.md) | vitest (CRITICAL), next.js, undici, storybook |
| 2026-06-01 | [cve-audit-2026-06-01.md](./cve-audit-2026-06-01.md) | — |
| 2026-05-29 | [security-audit-2026-05-29.md](./security-audit-2026-05-29.md) | — |
| 2026-05-28 | [2026-05-28-dependency-cve-audit.md](./2026-05-28-dependency-cve-audit.md) | Initial dependency CVE audit |

## Method

`pnpm audit` / `bun audit` / `yarn npm audit` (per repo's package manager) against the actual lockfile, findings verified against the GitHub Advisory Database / NVD / vendor advisories, traced to real source usage to exclude dev-tool/build-tool/e2e-fixture-only noise, and cross-checked against any existing override/resolution pins before being counted as a live finding. The 2026-07-11 audit is a lighter-weight exception: root `package.json` review via parallel agents rather than a full lockfile+source trace, with prior-audit findings carried forward where not independently re-verified (see that report's scope caveat).
