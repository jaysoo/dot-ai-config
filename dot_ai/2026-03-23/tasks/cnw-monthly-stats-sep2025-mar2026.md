# CNW Monthly Stats: March 2025 – March 2026

Generated 2026-03-23. Excludes CI runs. AI vs non-AI split where available.

## Data Availability by Month

| Month    | Format                      | Funnel (start/pre/complete/error) | Cloud Adoption     | AI % of starts                         | Nx Versions (top)                                                              |
| -------- | --------------------------- | --------------------------------- | ------------------ | -------------------------------------- | ------------------------------------------------------------------------------ |
| Mar 2025 | Legacy CSV                  | No (completions only)             | Yes                | N/A (not tracked)                      | Not available (version not in CSV)                                             |
| Apr 2025 | Legacy CSV                  | No (completions only)             | Yes                | N/A (not tracked)                      | Not available (version not in CSV)                                             |
| May 2025 | Legacy CSV                  | No (completions only)             | Yes                | N/A (not tracked)                      | Not available (version not in CSV)                                             |
| Jun 2025 | Legacy CSV                  | No (completions only)             | Yes                | N/A (not tracked)                      | Not available (version not in CSV)                                             |
| Jul 2025 | Legacy CSV                  | No (completions only)             | Yes                | N/A (not tracked)                      | Not available (version not in CSV)                                             |
| Aug 2025 | Legacy CSV                  | No (completions only)             | Yes                | N/A (not tracked)                      | Not available (version not in CSV)                                             |
| Sep 2025 | Legacy CSV                  | No (completions only)             | Yes                | N/A (not tracked)                      | Not available (version not in CSV)                                             |
| Oct 2025 | Legacy CSV                  | No (completions only)             | Yes                | N/A (not tracked)                      | Not available (version not in CSV)                                             |
| Nov 2025 | Legacy CSV + version prefix | No (completions only)             | Yes                | N/A (not tracked)                      | 22.1.1, 22.1.3, 22.1.2 (partial — tracking added mid-month, ~17K of ~35K+)   |
| Dec 2025 | Mixed (CSV + JSON)          | Partial (~64% JSON has funnel)    | Yes (both formats) | N/A (`aiAgent` not yet shipped)        | 22.3.3, 22.2.3, 22.3.1, 22.2.7, 22.2.5 (JSON portion only)                   |
| Jan 2026 | JSON                        | Yes                               | Yes                | 0% (0 AI events)                       | 22.3.3, 22.4.1, 22.4.2, 22.4.0, 22.4.3, 22.4.4                              |
| Feb 2026 | JSON                        | Yes                               | Yes                | **6.9%** (2,366 / 34,055 starts)      | 22.5.1, 22.4.5, 22.5.2, 22.5.0, 22.4.4, 22.5.3                              |
| Mar 2026 | JSON                        | Yes                               | Yes                | **13.1%** (2,873 / 21,974 starts)     | 22.5.4, 22.5.3, 22.6.1, 22.6.0 (partial — through Mar 23)                    |

---

## Monthly Funnel (Non-AI, Non-CI)

| Month     | Starts  | Precreate | Completes | Errors  | Comp/Start | Err/Start |
| --------- | ------- | --------- | --------- | ------- | ---------- | --------- |
| Mar 2025  | —       | —         | 34,512    | —       | —          | —         |
| Apr 2025  | —       | —         | 36,192    | —       | —          | —         |
| May 2025  | —       | —         | 35,624    | —       | —          | —         |
| Jun 2025  | —       | —         | 31,752    | —       | —          | —         |
| Jul 2025  | —       | —         | 33,190    | —       | —          | —         |
| Aug 2025  | —       | —         | 28,675    | —       | —          | —         |
| Sep 2025  | —       | —         | 28,877    | —       | —          | —         |
| Oct 2025  | —       | —         | 26,640    | —       | —          | —         |
| Nov 2025  | —       | —         | 23,658    | —       | —          | —         |
| Dec 2025¹ | ~31,479 | ~11,768+  | ~23,423   | ~2,149+ | ~74.4%     | —         |
| Jan 2026  | 36,679  | 28,227    | 23,155    | 3,078   | 63.1%      | 8.4%      |
| Feb 2026  | 31,689  | 25,194    | 20,803    | 2,699   | 65.7%      | 8.5%      |
| Mar 2026² | 19,101  | 15,190    | 12,661    | 2,055   | 66.3%      | 10.8%     |

¹ Dec 2025 is a mixed-format month (~64% JSON, ~36% legacy CSV). JSON portion: 20,081 starts / 12,547 completes. CSV portion: 11,398 starts / 10,876 completes. Funnel ratios are approximate because CSV events don't track precreate/error.

² Mar 2026 is partial (through Mar 23).

**Observations:**

- Completion rate has been **stable at 63-66%** since Jan 2026.
- Error rate was steady at 8-9% in Jan-Feb, but **rose to 10.8% in March** due to INVALID_WORKSPACE_NAME errors appearing starting Mar 18. This is a **new error code we started reporting**, not a regression — these users were always failing, we just weren't categorizing them before. The majority (87%) pass `"."` as the workspace name, suggesting they're trying to initialize Nx in the current directory and should be directed to `nx init` instead.
- Completions peaked in **Apr 2025 (36K)** and gradually declined to **24K in Nov** — a mix of seasonality and the Thanksgiving holiday (Nov had very low volume in its final week).

---

## Monthly Cloud Adoption (Non-AI, Non-CI)

| Month     | Completes | Cloud Opt-in | Opt-in %  | Yes only | Yes %    | Skip   | Never | GitHub | GitLab | Azure | BB  | CircleCI |
| --------- | --------- | ------------ | --------- | -------- | -------- | ------ | ----- | ------ | ------ | ----- | --- | -------- |
| Mar 2025  | 34,512    | 15,585       | **45.2%** | 26       | 0.1%     | 2,585  | —     | 11,621 | 2,319  | 931   | 512 | 176      |
| Apr 2025  | 36,192    | 16,666       | **46.0%** | 67       | 0.2%     | 3,240  | —     | 12,249 | 2,605  | 989   | 586 | 170      |
| May 2025  | 35,624    | 15,942       | **44.8%** | 88       | 0.2%     | 3,749  | —     | 12,058 | 2,308  | 905   | 459 | 124      |
| Jun 2025  | 31,752    | 13,722       | **43.2%** | 63       | 0.2%     | 4,557  | —     | 10,732 | 1,725  | 649   | 444 | 109      |
| Jul 2025  | 33,190    | 14,119       | **42.5%** | 49       | 0.1%     | 5,226  | —     | 10,964 | 1,920  | 665   | 405 | 116      |
| Aug 2025  | 28,675    | 12,000       | **41.8%** | 23       | 0.1%     | 4,737  | —     | 9,346  | 1,757  | 518   | 274 | 82       |
| Sep 2025  | 28,877    | 11,981       | **41.5%** | 24       | 0.1%     | 4,804  | —     | 9,198  | 1,769  | 583   | 280 | 127      |
| Oct 2025  | 26,640    | 11,175       | **41.9%** | 28       | 0.1%     | 5,268  | —     | 8,431  | 1,712  | 652   | 272 | 80       |
| Nov 2025  | 23,658    | 9,594        | **40.6%** | 30       | 0.1%     | 5,065  | —     | 7,332  | 1,416  | 538   | 219 | 64       |
| Dec 2025³ | 23,423    | 7,871        | **33.6%** | 2,968    | 12.7%    | 11,235 | —     | 3,772  | 786    | 216   | 108 | 21       |
| Jan 2026  | 23,155    | 6,888        | **29.8%** | 5,862    | 25.3%    | 16,267 | —     | 971    | 48     | 5     | 2   | —        |
| Feb 2026  | 20,803    | 10,518       | **50.6%** | 2,362    | 11.4%    | 9,960  | 321   | 8,096  | 29     | 23    | 6   | 2        |
| Mar 2026² | 12,661    | 3,700        | **29.2%** | 1,088    | 8.6%     | 7,121  | 1,840 | 1,986  | 412    | 117   | 82  | 15       |

³ Dec 2025 combines JSON + CSV portions. The `enable-caching2` option (3,659 CSV events) is counted as non-opt-in (caching only, no CI).

**Key transitions:**

- **Mar 2025–Nov 2025 (stable ~41-46%):** "which-ci-provider" prompt with CI provider options (github/gitlab/azure/bb/circleci). High GitHub selection (~32% of completions). `enable-caching2` was 37-45% of completions (caching without CI). Slight downward trend from 46% (Apr) to 41% (Oct) as `skip` grew.
- **Dec 2025 (drop to 34%):** Transition month. New JSON telemetry format shipped (22.2.2+). New `yes` option appeared, absorbing some CI provider selections. `enable-caching2` being phased out.
- **Jan 2026 (drop to 30%):** CI provider prompts removed. `yes` became the primary opt-in (25% of completions). GitHub dropped from ~32% → 4.2%. `skip` ballooned to 70%.
- **Feb 2026 (spike to 51%):** 22.5.x versions brought back CI provider prompts. GitHub surged back to 39% of completions. Highest opt-in rate in the 7-month window.
- **Mar 2026 (drop to 29%):** 22.6.x transition (starting ~Mar 19) removed CI provider prompts again. `never` option surged (14.5% of completions). March is a blended month — early March (22.5.4) had ~42% opt-in, late March (22.6.x) dropped to ~10%.

### March 2026 Phase Breakdown

| Phase      | Dates     | Version       | Completes | Opt-in %   | Notes                                          |
| ---------- | --------- | ------------- | --------- | ---------- | ---------------------------------------------- |
| Pre-22.5.4 | Mar 1-4   | 22.5.3        | 2,578     | ~9-11%     | No CI provider prompt                          |
| 22.5.4     | Mar 5-17  | 22.5.4        | 7,355     | **42.7%**  | CI provider prompts restored                   |
| 22.6.x     | Mar 18-23 | 22.6.0/22.6.1 | 2,728     | **10-13%** | CI provider prompts gone again, `never` surged |

**22.5.4 successfully restored October/November-era cloud adoption rates (~42%).** The 22.6.x transition then dropped it back to ~10%.

---

## AI vs Non-AI Funnel (Non-CI)

AI agent tracking (`aiAgent: true`) was introduced in late Jan / early Feb 2026. No AI data exists for Sep 2025–Jan 2026.

### Funnel Comparison

| Month    | Segment | Starts    | Completes | Errors  | Comp/Start | Err/Start |
| -------- | ------- | --------- | --------- | ------- | ---------- | --------- |
| Feb 2026 | Non-AI  | 31,689    | 20,803    | 2,699   | 65.7%      | 8.5%      |
| Feb 2026 | **AI**  | **2,366** | **1,403** | **143** | **59.3%**  | **6.0%**  |
| Mar 2026 | Non-AI  | 19,101    | 12,661    | 2,055   | 66.3%      | 10.8%     |
| Mar 2026 | **AI**  | **2,873** | **1,609** | **640** | **56.0%**  | **22.3%** |

**Observations:**

- AI agents are **7-13% of all starts** (growing: 7% in Feb → 13% in Mar).
- AI completion rate is **lower** (56-59% vs 66%) — they drop off more between start and precreate.
- AI error rate **spiked in March** (6% → 22.3%) — likely the INVALID_WORKSPACE_NAME issue (AI agents passing `.` as name).

### Cloud Adoption Comparison

| Month    | Segment | Completes | Opt-in    | Opt-in %  | Top Choice   |
| -------- | ------- | --------- | --------- | --------- | ------------ |
| Feb 2026 | Non-AI  | 20,803    | 10,518    | **50.6%** | github (39%) |
| Feb 2026 | **AI**  | **1,403** | **1,162** | **82.8%** | github (59%) |
| Mar 2026 | Non-AI  | 12,661    | 3,700     | **29.2%** | github (16%) |
| Mar 2026 | **AI**  | **1,609** | **1,296** | **80.5%** | yes (80%)    |

**AI agents opt into cloud at 2-3x the rate of humans** (81-83% vs 29-51%). In Feb they heavily selected `github`; in Mar they shifted to `yes` — likely the AI agents are configured to pass `--nxCloud=yes` by default.

---

## Nx Version Distribution (Non-AI, Non-CI)

Versions shown are from `start` events. Sep-Oct 2025 did not include version in telemetry.

### Nov 2025

| Version | Starts |
| ------- | ------ |
| 22.1.1  | 8,043  |
| 22.1.3  | 5,229  |
| 22.1.2  | 3,818  |

_Only ~17K of ~35K+ events had version prefix. Version tracking was added mid-November._

### Dec 2025

| Version | Starts |
| ------- | ------ |
| 22.3.3  | 11,409 |
| 22.2.3  | 3,240  |
| 22.3.1  | 1,841  |
| 22.2.7  | 1,226  |
| 22.2.5  | 832    |

### Jan 2026

| Version | Starts         |
| ------- | -------------- |
| 22.3.3  | 24,096 (65.7%) |
| 22.4.1  | 4,576          |
| 22.4.2  | 3,880          |
| 22.4.0  | 1,422          |
| 22.4.3  | 1,331          |
| 22.4.4  | 1,119          |

### Feb 2026

| Version | Starts |
| ------- | ------ |
| 22.5.1  | 7,449  |
| 22.4.5  | 7,290  |
| 22.5.2  | 6,680  |
| 22.5.0  | 4,574  |
| 22.4.4  | 3,468  |
| 22.5.3  | 1,818  |

### Mar 2026 (through Mar 23)

| Version | Starts         |
| ------- | -------------- |
| 22.5.4  | 10,924 (57.2%) |
| 22.5.3  | 3,583          |
| 22.6.1  | 2,130          |
| 22.6.0  | 2,013          |

**Version adoption patterns:**

- Patch versions typically reach majority share within 1-2 weeks.
- 22.3.3 was unusually long-lived (dominated Dec + Jan).
- 22.5.4 dominated March but 22.6.x is ramping up quickly (22% of Mar starts already).

---

## `enable-caching2` Explained

In the Sep–Nov 2025 era, `enable-caching2` was the option for users who wanted Nx Cloud caching but **not** CI integration. It accounted for 37-42% of completions — the single largest bucket. These users wanted cloud caching but didn't want to set up CI workflows.

This option was replaced in the new JSON-format flows:

- Dec 2025: Transitioning out
- Jan 2026+: Replaced by `skip` (skip cloud entirely) and `yes` (enable cloud without CI)

The `skip` bucket grew from ~20% (Sep-Nov) to ~56-70% (Jan-Mar), absorbing most former `enable-caching2` users.
