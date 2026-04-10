# Dependency Health Audits

Monthly audit of direct external dependencies across Nx CLI packages. Tracks unmaintained, deprecated, or at-risk dependencies.

## Reports

| Month | File | Summary |
|-------|------|---------|
| 2026-04 | [2026-04.md](./2026-04.md) | 146 deps: 21 critical (+14), 15 warning (-4), 7 watch (-6). @ltd/j-toml removed (replaced by smol-toml). 14 Warning->Critical from aging. 5 deps removed. |
| 2026-03 | [2026-03.md](./2026-03.md) | Initial audit: 169 core deps |

## Classification

- **Critical** (archived / >24mo since last publish / deprecated): Immediate action needed
- **Warning** (12-24mo since last publish): Plan migration or verify still maintained
- **Watch** (6-12mo since last publish): Monitor for staleness
- **Healthy** (<6mo since last publish): No action needed
