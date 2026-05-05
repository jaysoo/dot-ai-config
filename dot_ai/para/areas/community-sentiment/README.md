# Community & Customer Sentiment

**Priority: LOW** | Cadence: Monthly (escalate on viral negative thread or complaint pattern)

Monthly scan of Nx platform community health, covering GitHub Issues, Discussions, npm downloads, Stack Overflow, and customer signals (Pylon).

## Reports

| Month   | File         | Notes                                                |
| ------- | ------------ | ---------------------------------------------------- |
| 2026-02 | `2026-02.md` | First run. 60-day lookback from 2025-12-29.          |
| 2026-03 | `2026-03.md` | 60-day lookback from 2026-01-29. Updated 2026-03-30 (7th scan). Windows emerged as major theme. Node 25 compat, picomatch CVE. |
| 2026-04 | `2026-04.md` | 60-day lookback. Latest refresh 2026-04-28. Downloads ~9.6M/week durable baseline. Closure rate 64.8% (94/145). **22.7.0 GA week regression cluster**: #35444 (auto-update without asking, 13 +1, NEW), #35455 (s3-cache 5.0.3 panic, 9 +1), #35424 (@nx/key panic), #35461 (Windows broken). #35411 $schema RC regression CLOSED Apr 24. Lockfile correctness still hot (9 issues). Self-healing CI customer trust drift in Pylon (#683, #784, #636). TS 6.0 prep now public-top-voted (5 upvotes). Pylon ~205 tickets Apr 1-28, ~7-8/day cadence. |
| 2026-05 | `2026-05.md` | 60-day lookback (Mar 5 - May 4). **22.7 launch cluster cleared in 4 days** (#35444, #35455, #35461, #35452 all CLOSED; only #35424 remains). 22.7.1 patch shipped. NEW JSONC tsconfig regression #35537 (PR #35539 in flight). Downloads dipped to ~8.6M/week W6-W9 (vs ~9.6M W2-W5, -10%) -- 76M total in 60d. Closure rate 63.1% (89/141), flat. **TS 6.0 prep now solo top-voted at 7 upvotes** (+2 cycle). NEW oxlint/oxfmt discussion at 4 upvotes. **NEW Pylon billing reactivation incident**: 6 urgent tickets May 1-4 (#831/836/837/838/839/843). 22.6→22.7 migration friction surfacing in Pylon (#804, #821, #797). MCP/AI dual-track: better surface AND opt-out. Self-healing CI trust drift now 3-scan running (#683, #784, #812, #810, #636). Pylon 225 tickets Apr 4 - May 4. |

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
