# Dependency Health Audits

Monthly audit of direct external dependencies across Nx CLI packages. Tracks unmaintained, deprecated, or at-risk dependencies.

## Reports

| Month | File | Summary |
|-------|------|---------|
| 2026-04 | [2026-04.md](./2026-04.md) | 194 deps (nx + ocean): 25 critical, 16 warning, 16 watch, 137 healthy. Scan 2026-04-28: ocean now in scope (+23 ocean-only deps). 6 new findings, all ocean: 4 criticals (`cytoscape-avsdf/dagre/fcose`, `node-machine-id`), 1 warning (`axios-retry`), 1 watch (`cmdk`). All 21 prior nx criticals timestamps unchanged since 2026-04-16. `@nx/graph` is largest ocean-side cluster (4 of 5 ocean criticals). |
| 2026-03 | [2026-03.md](./2026-03.md) | Initial audit: 169 core deps |

## Classification

- **Critical** (archived / >24mo since last publish / deprecated): Immediate action needed
- **Warning** (12-24mo since last publish): Plan migration or verify still maintained
- **Watch** (6-12mo since last publish): Monitor for staleness
- **Healthy** (<6mo since last publish): No action needed
