# Dependency Health Audits

Monthly audit of direct external dependencies across Nx CLI packages. Tracks unmaintained, deprecated, or at-risk dependencies.

## Reports

| Month | File | Summary |
|-------|------|---------|
| 2026-04 | [2026-04.md](./2026-04.md) | 173 deps: 21 critical (+14 vs Mar), 15 warning (-4), 15 watch (+2), 122 healthy. Scan 2026-04-24 (latest): no bucket transitions since 2026-04-22 intra-month run. All 21 critical items unchanged since 2026-04-16. Rspack 2.0 (GA 2026-04-22) + Rsbuild 2.0.1 live. `@ltd/j-toml` and `front-matter` removed since March. Ocean not audited this cycle (clone access denied). |
| 2026-03 | [2026-03.md](./2026-03.md) | Initial audit: 169 core deps |

## Classification

- **Critical** (archived / >24mo since last publish / deprecated): Immediate action needed
- **Warning** (12-24mo since last publish): Plan migration or verify still maintained
- **Watch** (6-12mo since last publish): Monitor for staleness
- **Healthy** (<6mo since last publish): No action needed
