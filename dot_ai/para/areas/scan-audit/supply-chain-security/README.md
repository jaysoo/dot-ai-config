# Supply Chain Security Scans (weekly)

Weekly supply chain security audits of the Nx platform's npm publishing pipeline, package integrity, and dependency health. Run via `/audit-supply-chain` as part of the weekly scan-and-audit orchestrator.

See also: monthly reports at [../scans/supply-chain-security/](../scans/supply-chain-security/).

## Reports

| Month   | Status | File |
|---------|--------|------|
| 2026-04 | YELLOW | [2026-04.md](./2026-04.md) (weekly re-run 2026-04-20) |

## Scope

- **Nx CLI** (nrwl/nx) — publishable `@nx/*`, `nx`, `create-nx-workspace`, `create-nx-plugin`, legacy `@nrwl/*`
- **Nx Cloud** (ocean) — `nx-cloud` unscoped package; `polygraph-mcp` (Nx Cloud adjacent)
- npm registry metadata, maintainers, attestations
- GitHub Actions publish workflows
- Typosquat name monitoring
- GitHub Security Advisories (npm ecosystem)

## Cadence

Weekly (part of the scan-and-audit orchestrator). Lookback window: 60 days for workflow changes; 7-30 days for advisories.

## Contacts

- Security reports: `security@nrwl.io`
- Authorized `latest` publishers: jaysoo, JamesHenry, FrozenPandaz, vsavkin
