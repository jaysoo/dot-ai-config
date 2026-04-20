# Community & Customer Sentiment

**Priority: LOW** | Cadence: Monthly (escalate on viral negative thread or complaint pattern)

Monthly scan of Nx platform community health, covering GitHub Issues, Discussions, npm downloads, Stack Overflow, and customer signals (Pylon).

## Reports

| Month   | File         | Notes                                                |
| ------- | ------------ | ---------------------------------------------------- |
| 2026-02 | `2026-02.md` | First run. 60-day lookback from 2025-12-29.          |
| 2026-03 | `2026-03.md` | 60-day lookback from 2026-01-29. Updated 2026-03-30 (7th scan). Windows emerged as major theme. Node 25 compat, picomatch CVE. |
| 2026-04 | `2026-04.md` | 60-day lookback from 2026-02-19. Updated 2026-04-20 (refresh #2). Downloads ~10.22M/week (record). Closure rate 65.8% (98/149). **#35156 LGPL RESOLVED Apr 16** (14d, enterprise blocker closed). **#35270 pnpm 11 Bun merged Apr 17**. #35311 Axios CVE OPEN but maintainer-answered Apr 16 (workaround + ^2.3.3 bump pledged). New Windows regression cluster: #35339 WAL crash, #35345 ARM64 Asahi, #35344 Docker. Top unresponded shifted to #34542 (nx release workspace-file bumps, 57d, 3 upvotes). Pylon auth flow started but requires user browser. |

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
