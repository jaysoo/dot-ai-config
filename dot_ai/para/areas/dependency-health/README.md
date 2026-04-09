# Dependency Health Audits

Monthly audit of direct external dependencies across Nx CLI packages. Tracks unmaintained, deprecated, or at-risk dependencies.

## Reports

| Month | File | Summary |
|-------|------|---------|
| 2026-04 | [2026-04.md](./2026-04.md) | 164 deps: 23 critical (0), 14 warning (0), 7 watch (-1). tinyglobby graduated to Healthy |
| 2026-03 | [2026-03.md](./2026-03.md) | Initial audit: 169 core deps |

## Classification

- **Critical** (archived / >24mo since last publish / deprecated): Immediate action needed
- **Warning** (12-24mo since last publish): Plan migration or verify still maintained
- **Watch** (6-12mo since last publish): Monitor for staleness
- **Healthy** (<6mo since last publish): No action needed
