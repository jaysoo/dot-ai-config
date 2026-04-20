# Dependency Health Audits

Monthly audit of direct external dependencies across Nx CLI packages. Tracks unmaintained, deprecated, or at-risk dependencies.

## Reports

| Month | File | Summary |
|-------|------|---------|
| 2026-04 | [2026-04.md](./2026-04.md) | 173 deps: 21 critical (+14 vs Mar), 15 warning (-4), 13 watch (0). Third scan (2026-04-20): `dotenv-expand` republished 2026-04-17 (Watch → Healthy). All 21 critical items unchanged since 2026-04-16. enquirer + tcp-port-used still top priorities. |
| 2026-03 | [2026-03.md](./2026-03.md) | Initial audit: 169 core deps |

## Classification

- **Critical** (archived / >24mo since last publish / deprecated): Immediate action needed
- **Warning** (12-24mo since last publish): Plan migration or verify still maintained
- **Watch** (6-12mo since last publish): Monitor for staleness
- **Healthy** (<6mo since last publish): No action needed
