# 2025 - 1H

## CLI (OSS)

*Updated: 2025-06-17*

| **Metric** | **Goal** | **Jan** | **Feb** | **Mar** | **Apr** | **May** | **Jun** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Open issues | 500 | 589
617 | 570 | 590 | 578 | 616 | Week 1: 625<br>Week 3: 637 |
| Closed issues | - | 8
34 | 148 | 79 | 104 | 103 | Week 1: 26<br>Week 3: 81 |
| Issue close rate | 20% | 1.3% | 20.6% | 11.8% | 15.4% | 14.3% | Week 1: 4.0%<br>Week 3: 11.3% |
| Total PRs | 50 | 99 | 85 | 96 | 82 | 102 | Week 1: 108<br>Week 3: 121 |
| Total monthly downloads  | - | 17.7M | 20.8M | 22.6M | 22.5M | 22.8M |  |
| YoY growth (compare by monthly downloads) | 40% | -1.11% | 16.2% | 20.8% | 17.8% | - |  |

### Calculations

- **Open issues:** open issues to date
    - e.g. [https://github.com/nrwl/nx/issues?q=is%3Aissue state%3Aopen created%3A2017-09-01..2024-11-09](https://github.com/nrwl/nx/issues?q=is%3Aissue%20state%3Aopen%20created%3A2017-09-01..2024-11-09)
- **Closed issues:** issues closed during the current month (i.e. 1st of the month until today)
- **issue close rate:** closed_issues / (closed_issues + open_issues)
- **Total monthly downloads:** As tracked by npm-stats.com
    - [https://docs.google.com/spreadsheets/d/1PEjKxVdFVoz8z0CinY65H-e7IfHMEYx0Dg_hUvC4ysE/edit?gid=1586611954#gid=1586611954](https://docs.google.com/spreadsheets/d/1PEjKxVdFVoz8z0CinY65H-e7IfHMEYx0Dg_hUvC4ysE/edit?gid=1586611954#gid=1586611954)
- **YoY growth**
    - **Monthly downloads:** (downloads_this_month - downloads_same_month_last_year) / downloads_same_month_last_year

---

- **Created Nx Workspaces**
    - We can actually get how many people create an Nx Workspace via the Mongo DB. We send an event there when people finish the `create-nx-workspace` flow.

## CLI (PowerPack)

*Updated: 2025-03-04*

| **Metric** | **Goal** | **Jan** | **Feb** | **Mar** | **Apr** | **May** | **Jun** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Active licenses (Powerpack) | 500 | 175 | 352 | 383 | - |  |  |
| Active licenses growth (Powerpack) | 80 | 10 | 182 | 26 | - |  |  |
| Active seats (Powerpack) |  | 24,714 | 28,459 |  29,813 | - |  |  |
| Active seats growth (Powerpack) |  | -20 | 3745 | 1,354 | - |  |  |

### Calculations

- Powerpack active license
    - `Nx Powerpack licenses` as seen in Cloud admin
- Powerpack active license growth
    - Diff month over month of Powerpack active license

## Console

*Updated: 2025-04-08*

| **Metric** | **Goal** | **Jan** | **Feb** | **Mar** | **Apr** | **May** | **Jun** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| % of sessions that encounter an error | 5% | 1.97%
 | 2.24% | 3.24% | 2.97% | 3.08% | 4.32% |
| Total active sessions | 250K of end of H1 2025 | 213K | 231K | 240K | 238K | 241K | 247K |
| MoM growth | 10K | 6K | 18K | 9K | -2K | 3K | 6K |
| % of sessions that use core feature | 50% by end of H1 2025 | 14.58% | 16.03% | 17.62% | 20.61% | 20.36% | 18.81% |
| Increase in % of sessions that use core feature | 6% | -0.28% | 1.45% | 1.59% | 2.99% | -0.25% | -1.55% |
| % of sessions that use refresh | 3% by end of H1 2025 | 4.82% | 5.56% | 5.55% | 5.3% | 4.77% | 4.64% |
| Increase in % of sessions that use refresh | -0.5% | -0.25 | 0.74% | -0.01% | -0.25% | -0.53% |  |

### Calculations

- **% of sessions that encounter error:**  As provided by GA for last 28 days (e.g. for October it is 4th to 31st)
    - Step 2 here (last 28 days): [https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/analysis/p313991430/edit/OShegFWTQNGA_c4Nl2cjvw](https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/analysis/p313991430/edit/OShegFWTQNGA_c4Nl2cjvw)
- **Active users:** As provided by GA for last 28 days (e.g. for October it is 4th to 31st)
    - Step 1 here (last 28 days): [https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/analysis/p313991430/edit/OShegFWTQNGA_c4Nl2cjvw](https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/analysis/p313991430/edit/OShegFWTQNGA_c4Nl2cjvw)
- **MoM growth:** current_month - previous_month
- **% of sessions that use core feature:**
    - Step 2 here (last 28 days): [https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/analysis/p313991430/edit/qKNS32xyRzSYFgoKx4ggyw](https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/analysis/p313991430/edit/qKNS32xyRzSYFgoKx4ggyw)
- **Increase in % of sessions that use core feature:** current_month - previous_month
- **% of sessions that use refresh:**
    - Step 2 here (last 28 days): [https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/analysis/p313991430/edit/wOgT14dpTaKNFVC1CU6KUQ](https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/analysis/p313991430/edit/wOgT14dpTaKNFVC1CU6KUQ)

## Nx.dev

*Updated: 2025-01-03*

| **Metric** | **Goal** | **Jan** | **Feb** | **Mar** | **Apr** | **May** | **Jun** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Search quality | 10.00 | 9.43 | 8.76 | 9.14 | 9.33 | 9.33 |  |
| YoY growth of unique traffic docs for last 12 months | 25% | -11.5% | -6.2% | -3.5% | -4.9% | -11.5% |  |

### Calculations

- **Search quality:** Weighted score based on [Search Test Suite](https://www.notion.so/Search-Test-Suite-13869f3c23878067b31af8aaa7ffef85?pvs=21)
    - Do one of the expected URLs appear above the fold (i.e. first three results)?
        - That term gets a score of 3 for results 1-3, 2 for results 4-6, 1 for results 7-9 and 0 if they don’t appear in the top 9 results.
        - If we don’t have any expected urls for a search term, it automatically gets a score of 0
    - Total up scores and normalize to a score out of 10
        - e.g. If there are 17 terms, then there is a possible score of 51. If the total is 44/51 then the normalized score is 8.63
- **YoY Growth:**
    - GA report YTD snapshot compared to same period last year
        - e.g. [https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/p309633468/reports/dashboard?params=_u..nav%3Dmaui%26_r.0..activeTab%3D0%26_u.date00%3D20240101%26_u.date01%3D20241216%26_u.comparisonOption%3DlastYear&r=reporting-hub](https://analytics.google.com/analytics/web/?utm_source=marketingplatform.google.com&utm_medium=et&utm_campaign=marketingplatform.google.com%2Fabout%2Fanalytics%2F#/p309633468/reports/dashboard?params=_u..nav%3Dmaui%26_r.0..activeTab%3D0%26_u.date00%3D20240101%26_u.date01%3D20241216%26_u.comparisonOption%3DlastYear&r=reporting-hub)