# Dependency Health Audits

Monthly audit of direct external dependencies across Nx CLI packages. Tracks unmaintained, deprecated, or at-risk dependencies.

## Reports

| Month | File | Summary |
|-------|------|---------|
| 2026-05 | [2026-05.md](./2026-05.md) | 176 deps (nx + ocean via npm view, ocean clone failed): 38 critical, 19 warning, 15 watch, 104 healthy. **First explicit npm-deprecation flag this period**: `aws-sdk` v2 (used by `@nx-cloud/runners`). Methodology change: switched to `time[<latest-tag>]` from `time.modified`, surfacing 7 previously-misclassified packages including `signale`, `simple-archiver`, `@yarnpkg/lockfile`, `kill-port`, `node-machine-id` (already Critical, but date corrected from 2023 to 2019). `@nx-cloud/runners` is the highest-concentration risk (4 Critical deps + deprecated AWS SDK v2). |
| 2026-04 | [2026-04.md](./2026-04.md) | 194 deps (nx + ocean): 25 critical, 16 warning, 16 watch, 137 healthy. Scan 2026-04-28: ocean now in scope (+23 ocean-only deps). 6 new findings, all ocean: 4 criticals (`cytoscape-avsdf/dagre/fcose`, `node-machine-id`), 1 warning (`axios-retry`), 1 watch (`cmdk`). All 21 prior nx criticals timestamps unchanged since 2026-04-16. `@nx/graph` is largest ocean-side cluster (4 of 5 ocean criticals). |
| 2026-03 | [2026-03.md](./2026-03.md) | Initial audit: 169 core deps |

## Classification

- **Critical** (archived / >24mo since last publish / deprecated): Immediate action needed
- **Warning** (12-24mo since last publish): Plan migration or verify still maintained
- **Watch** (6-12mo since last publish): Monitor for staleness
- **Healthy** (<6mo since last publish): No action needed
