# Community & Customer Sentiment

Monthly scan of Nx platform community health, covering GitHub Issues, Discussions, npm downloads, Stack Overflow, and customer signals (Pylon).

## Reports

| Month   | File         | Notes                                                |
| ------- | ------------ | ---------------------------------------------------- |
| 2026-02 | `2026-02.md` | First run. 60-day lookback from 2025-12-29.          |
| 2026-03 | `2026-03.md` | 60-day lookback from 2026-01-22. Updated 2026-03-23 (5th scan). |

## Sources

- **GitHub Issues**: nrwl/nx (public), nrwl/nx-cloud (no public issues)
- **GitHub Discussions**: nrwl/nx
- **npm Downloads**: npmjs.org download API
- **Pylon**: Customer support data (Slack, email, MS Teams channels)
- **Stack Overflow**: nrwl-nx tag (blocked recent scans)

## Methodology

- Lookback window: 60 days from scan date
- Issues are verified as OPEN before being reported as active pain points
- Reactions (+1) used as signal strength proxy
- Themes extracted via keyword frequency analysis of issue titles and labels
- Download trends compared WoW and against historical baseline
- Pylon tickets categorized by theme with sentiment shift tracking

## How to Run

Invoke the Community & Customer Sentiment Analysis scan via Claude Code. The scan:

1. Reads cached GitHub Issues and Discussions data from `$SCAN_DATA_DIR`
2. Fetches npm download data via public API
3. Queries Pylon MCP for customer support tickets
4. Verifies issue state before including in report
5. Compares against previous scan for delta analysis
6. Writes report to `YYYY-MM.md` in this directory
