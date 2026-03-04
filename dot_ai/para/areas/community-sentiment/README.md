# Community & Customer Sentiment

Monthly scan of Nx platform community health, covering GitHub Issues, Discussions, npm downloads, and customer signals.

## Reports

| Month   | File         | Notes                                                |
| ------- | ------------ | ---------------------------------------------------- |
| 2026-02 | `2026-02.md` | First run. 60-day lookback from 2025-12-29.          |
| 2026-03 | `2026-03.md` | 60-day lookback from 2026-01-03. Updated 2026-03-04 (2nd scan). |

## Sources

- **GitHub Issues**: nrwl/nx (public), nrwl/nx-cloud (private -- no access)
- **GitHub Discussions**: nrwl/nx
- **npm Downloads**: npmjs.org download API
- **Pylon**: Not configured -- customer support data excluded

## Methodology

- Lookback window: 60 days from scan date
- Issues are verified as OPEN before being reported as active pain points
- Reactions (+1) used as signal strength proxy
- Themes extracted via keyword frequency analysis of issue titles
- Download trends compared YoY and WoW

## How to Run

Invoke the Community & Customer Sentiment Analysis scan via Claude Code. The scan:

1. Queries GitHub Issues and Discussions via `gh` CLI
2. Fetches npm download data via public API
3. Verifies issue state before including in report
4. Writes report to `YYYY-MM.md` in this directory
