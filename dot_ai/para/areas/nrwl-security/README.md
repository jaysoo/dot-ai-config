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
| 2026-07-22 | [cve-audit-2026-07-22.md](./cve-audit-2026-07-22.md) | Deeper pass using actual audit tooling (`pnpm audit`/`bun audit`/bulk advisory API) instead of a curated package list — surfaced a CRITICAL `vm2` sandbox-escape/RCE cluster in nx-labs (via `release-it@15.2.0`) plus matching `form-data`/`handlebars`/`shell-quote`/`tar`/`websocket-driver` criticals in nx-labs and nx-console. 4 new HIGH Next.js CVEs in nx (July 21 security release, fixed 16.2.11). `tar-fs` needs a further bump (2.1.4) across nx/ocean/nx-console. Resolved since 07-13: ocean `tar`→7.5.20 and MCP SDK→1.26.0; nx-console MCP SDK/minimatch (#3178); nx-labs Storybook (was 33+ days stale). Rollup/Vite/xmldom/http-proxy-middleware/loader-utils/piscina/ws/picomatch/babel-plugin in nx now 42 days stale, unfixed across 5 audits. |
| 2026-07-13 | [cve-audit-2026-07-13.md](./cve-audit-2026-07-13.md) | Delta audit (nx-labs/nx-console unchanged since 07-10). 2 findings resolved (`@xhmikosr/decompress` in nx, `@xmldom/xmldom` in ocean). nx `rollup`/`vite` and nx-labs `storybook` now **33 days stale** — escalated, no known blocker |
| 2026-07-10 | [cve-audit-2026-07-10.md](./cve-audit-2026-07-10.md) | CVE-2025-36852 (CREEP, CRITICAL, unpatchable-by-design in `@nx/*-cache` packages); nx `rollup`/`vite` and nx-labs `storybook` now 30 days stale; new ocean findings incl. `tar` inside the CLI client bundle |
| 2026-06-10 | [cve-audit-2026-06-10.md](./cve-audit-2026-06-10.md) | New rollup CVE-2026-27606; carried forward vitest/next.js/undici/storybook |
| 2026-06-09 | [cve-audit-2026-06-09.md](./cve-audit-2026-06-09.md) | vitest (CRITICAL), next.js, undici, storybook |
| 2026-06-01 | [cve-audit-2026-06-01.md](./cve-audit-2026-06-01.md) | — |
| 2026-05-29 | [security-audit-2026-05-29.md](./security-audit-2026-05-29.md) | — |
| 2026-05-28 | [2026-05-28-dependency-cve-audit.md](./2026-05-28-dependency-cve-audit.md) | Initial dependency CVE audit |

## Method

`pnpm audit` / `bun audit` / `yarn npm audit` (per repo's package manager) against the actual lockfile, findings verified against the GitHub Advisory Database / NVD / vendor advisories, traced to real source usage to exclude dev-tool/build-tool/e2e-fixture-only noise, and cross-checked against any existing override/resolution pins before being counted as a live finding.
