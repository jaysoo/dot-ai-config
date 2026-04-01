---
name: NX_NO_CLOUD for local publishing
description: Must set NX_NO_CLOUD=true when running pnpm nx-release --local to avoid cloud-related cache issues
type: feedback
---

Set `NX_NO_CLOUD=true` when locally publishing Nx packages via `pnpm nx-release ... --local`.

**Why:** Without it, the local publish hits cloud/cache issues that break the process. Discovered 2026-03-30 while testing NXC-4172 (CNW absolute paths).

**How to apply:** Always prefix local publish commands:
```bash
NX_NO_CLOUD=true pnpm nx-release 24.0.0-local.YYMMDD-NN --local
```
