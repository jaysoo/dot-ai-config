# Stale Docs Audits

Periodic audits of documentation in active repos for content that has drifted out of sync with the codebase, uses outdated version references, or recommends EOL dependencies.

## Audits

| Date | Repo | Scope | File |
|------|------|-------|------|
| 2026-06-10 | nrwl/nx | All 498 `.mdoc` files in `astro-docs/src/content/docs/` | [nx-astro-docs-audit-2026-06-10.md](./nx-astro-docs-audit-2026-06-10.md) |

## What We Look For

1. **Old version anchors** — "As of Nx 16.x…" or "Starting with Nx 17…" qualifiers that are more than 2 major versions behind current
2. **EOL runtime references** — Node.js or package versions that are end-of-life (e.g. Node 20 went EOL April 2026)
3. **Code/schema drift** — CLI flags, generator options, or executor options in docs that no longer match `packages/` schemas
