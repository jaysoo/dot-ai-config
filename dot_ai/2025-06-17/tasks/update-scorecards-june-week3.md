# Update Scorecards for June Week 3

## Task Overview
Update the GitHub metrics in the scorecards file for June Week 3 using the GitHub CLI to gather:
- Open issues (to date)
- Closed issues (for June 2025)
- Issue close rate
- Total PRs

Reference: `.ai/2025-06-17/scorecards.md`

## Implementation Plan

### Step 1: Create GitHub Metrics Script
- [x] Create a Node.js script to fetch GitHub metrics using the GitHub CLI
- [x] Script should calculate metrics according to the formulas provided
- [x] Output results in a format ready to paste into the scorecards

**Reasoning**: Using a script ensures consistent calculations and makes it easy to re-run for future updates.

### Step 2: Fetch Open Issues
- [x] Use gh CLI to count all open issues from repo creation to today
- [x] Formula: `gh issue list --state open --limit 1000 --json number | jq length`
- [x] May need pagination if > 1000 issues

**Reasoning**: Open issues are counted from the beginning of the repository to capture the total backlog.

### Step 3: Fetch Closed Issues for June
- [x] Use gh CLI to count issues closed from June 1-17, 2025
- [x] Formula: `gh issue list --state closed --search "closed:2025-06-01..2025-06-17" --limit 1000 --json number | jq length`

**Reasoning**: Closed issues are counted only for the current month to track monthly velocity.

### Step 4: Calculate Issue Close Rate
- [x] Formula: `closed_issues / (closed_issues + open_issues) * 100`
- [x] Round to 1 decimal place

**Reasoning**: This shows the percentage of issues being resolved vs accumulating.

### Step 5: Fetch Total PRs for June
- [x] Use gh CLI to count PRs created in June 2025
- [x] Formula: `gh pr list --state all --search "created:2025-06-01..2025-06-17" --limit 1000 --json number | jq length`

**Reasoning**: Total PRs shows development activity for the month.

### Step 6: Update Scorecards File
- [x] Add "Week 3:" entries to the June column
- [x] Format consistent with existing Week 1 entries

**Reasoning**: Maintains consistency with the existing format.

## Script Implementation Details

The script (`fetch-github-metrics.mjs`) will:
1. Use the GitHub CLI to fetch data
2. Handle pagination if needed
3. Calculate all metrics
4. Output results in markdown table format
5. Include date ranges used for transparency

## Expected Outcome

After completion:
- The scorecards file will have updated June Week 3 metrics
- A reusable script will exist for future weekly updates
- Metrics will be accurately calculated based on the specified formulas

## CRITICAL: Tracking Implementation Progress

When executing this task, update the TODO checkboxes above as each step is completed. This ensures we track progress and don't miss any steps.