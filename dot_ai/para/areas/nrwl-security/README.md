# nrwl Security — Vulnerability Tracking

Ongoing security monitoring for the four core Nrwl repositories and the public `nx` package ecosystem.

## Scope

| Repository | Type | Tracked |
|---|---|---|
| `nrwl/nx` | Monorepo — build tooling | npm packages + CI/CD |
| `nrwl/ocean` | Monorepo — cloud backend | dependency CVEs |
| `nrwl/nx-labs` | Monorepo — experimental plugins | dependency CVEs |
| `nrwl/nx-console` | VS Code / JetBrains extension | extension supply chain + npm |
| Public `nx` ecosystem packages | npm registry | published package security |

## Files

- [`report-2026-05-28.md`](./report-2026-05-28.md) — Initial audit (May 28, 2026)

## Severity Definitions

| Level | CVSS Range | Response SLA |
|---|---|---|
| CRITICAL | 9.0–10.0 | Immediate (same day) |
| HIGH | 7.0–8.9 | Within 72 hours |
| MEDIUM | 4.0–6.9 | Within 2 weeks |
| LOW | 0.1–3.9 | Next sprint |
