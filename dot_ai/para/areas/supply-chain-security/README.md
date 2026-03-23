# Supply Chain Security Reviews

Monthly security reviews of the Nx platform's npm publishing pipeline, package integrity, and dependency health.

## Purpose

Verify that Nx published packages maintain a secure supply chain:

- Publishing workflows use OIDC (no long-lived tokens), SHA-pinned actions, and environment protection
- Packages have SLSA provenance attestations
- npm org access is limited to authorized maintainers
- No typosquat packages target the Nx ecosystem
- Known CVEs in dependencies are tracked and addressed

## Reports

| Month   | Status                       | File                     |
| ------- | ---------------------------- | ------------------------ |
| 2026-03 | Clear (with recommendations) | [2026-03.md](2026-03.md) (updated 2026-03-23) |
| 2026-02 | Clear (with recommendations) | [2026-02.md](2026-02.md) |

## Scope

### Audited

- **Nx CLI** (`nrwl/nx`) -- 39 publishable packages under `nx`, `@nx/*`, `create-nx-workspace`, `create-nx-plugin`
- npm registry metadata, maintainers, attestations
- GitHub Actions publish workflows
- Typosquat name monitoring

### Not Audited (requires separate access)

- **Nx Cloud** (`nrwl/nx-cloud` / ocean) -- private repo
- npm org admin membership and 2FA status
- GitHub environment protection rule configuration

## Cadence

Monthly, with a 60-day lookback window for workflow changes.

## Key Contacts

- Security reports: `security@nrwl.io`
- Authorized `latest` publishers: jaysoo, JamesHenry, FrozenPandaz, vsavkin
