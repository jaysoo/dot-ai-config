# SPACE Metrics UI Improvements (Lighthouse)

**Date:** 2026-02-12
**Origin:** Jason Jean feedback (2026-02-10)
**Target System:** Lighthouse (Elixir/Phoenix)
**Status:** Completed (2026-02-13)
**PR:** https://github.com/nrwl/lighthouse/pull/35

## Background

Jason reviewed the SPACE Metrics dashboard and provided feedback on clarity and usability improvements.

## Tasks

### 1. PR Throughput: Year-over-Year Comparison
**Problem:** Users see "red 42" without context for what's good/bad.

**Solution:**
- [ ] Remove colors from PR Throughput (no red/yellow/green for now)
- [ ] Add year-over-year comparison - show same quarter from previous year
  - Example: Q1 2026 shows 100 PRs, adjacent column shows Q1 2025 with 200 PRs
  - Use real numbers from database

**Files to modify:**
- `lib/lighthouse_web/live/engineering_tools_live/space_metrics_live.ex` (display logic)
- `lib/lighthouse/space_metrics.ex` (may need to fetch previous year data)

---

### 2. Classification Footer & Section References
**Problem:** Users don't understand what "Misc", "planned", "unplanned" mean for each team.

**Solution:**
- [ ] Add footer section to the page explaining classification rules for all teams
- [ ] Reference the footer from Planning Accuracy and Issue Resolution sections

**Classification Rules (for footer):**

| Team | Unplanned Definition |
|------|---------------------|
| **Orca, Kraken, Dolphin** | Tasks in "No Project" OR "Misc" project = unplanned |
| **Quokka** | Tasks labeled DPE or Support **in the Misc board** = unplanned (reactive work) |
| **Red Panda** | ANY task labeled DPE or Support = unplanned (regardless of project) |

**Files to modify:**
- `lib/lighthouse_web/live/engineering_tools_live/space_metrics_live.ex`

---

### 3. Issue Resolution Time Improvements

#### 3a. Extend Target to 14 Days for Dolphin Team
- [ ] Add team-specific target configuration
- [ ] Dolphin team: 14-day target
- [ ] Other teams: keep existing target (7 days?)

**Files to modify:**
- `lib/lighthouse/space_metrics/calculators/aggregations.ex` (targets)
- `lib/lighthouse_web/live/engineering_tools_live/space_metrics_live.ex` (display)

#### 3b. P75 Targets More Lenient Than P50
- [ ] Review current P50/P75 target logic
- [ ] Adjust P75 to be ~1.5x P50 as baseline

**Files to modify:**
- `lib/lighthouse/space_metrics/calculators/aggregations.ex`

#### 3c. Add Asterisk for Partial Q1 Data
- [ ] Add asterisk or "(in progress)" indicator for current quarter
- [ ] Consider different styling for incomplete periods

**Files to modify:**
- `lib/lighthouse_web/live/engineering_tools_live/space_metrics_live.ex`

---

## Verification

1. Run Lighthouse locally
2. Navigate to SPACE Metrics page
3. Verify each section shows improved context/descriptions
4. Check Dolphin team-specific 14-day target
5. Confirm Q1 shows in-progress indicator

## Related Files

- Main UI: `lib/lighthouse_web/live/engineering_tools_live/space_metrics_live.ex`
- Calculations: `lib/lighthouse/space_metrics/calculators/aggregations.ex`
- Linear metrics: `lib/lighthouse/space_metrics/calculators/linear_metrics.ex`
- Previous work: `.ai/2026-02-05/SUMMARY.md` (SPACE Metrics Port)
