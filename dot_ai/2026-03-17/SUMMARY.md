# Summary — 2026-03-17

## DOC-446: Telemetry Documentation

Created the Nx CLI telemetry documentation page and supporting changes. PR #34884.

**What was done:**
- New page: `astro-docs/src/content/docs/reference/telemetry.mdoc` covering what's collected, sensitive data policy, opt-out/re-enable, and link to Nx Console telemetry
- Added sidebar entry under Reference
- Added `analytics` property to nx.json reference (expanded example + new Analytics section)
- Modeled after Turborepo/Next.js/Astro telemetry docs per issue request
- Removed "anonymous" wording per GDPR concerns (machine ID hashing could be argued as PII)
- Passed Vale linting and style guide review

**PR:** https://github.com/nrwl/nx/pull/34884
