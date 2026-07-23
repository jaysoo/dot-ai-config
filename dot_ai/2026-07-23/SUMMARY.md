# 2026-07-23 Summary

## Team churn analysis - Joe's follow-ups + skill (main, no commits)

- Answered Joe's questions in the report ("Follow-up Q&A" section): spike buckets vs churn (Team-only population 883: spikes alone are weak predictors, 1.1-1.3x lift over 4.6% baseline), cache-only churners (28/47, $9.7k/55% of churned MRR - but cache-only != low value), genuine low-ROI MRR ($4.9k/28%, concentrated in 4 orgs; verdict: product-led fixes only).
- Team churn rate denominator settled: 1,044 active Team orgs -> ~1.4-1.5%/mo.
- Added definitions appendix to report (remote-cache-only, segment thresholds, spike buckets, population construction) so others can validate categorization.
- Corrected mid-analysis: "Pro/Powerpack contamination" caveat overstated (55 of 938 customers); PRO is legacy/grandfathered, Powerpack licenses drop out of the >=2-invoice filter.
- Created `churn-analyzer` skill (`dot-ai-config/dot_claude/skills/churn-analyzer/`) capturing the workflow, segment definitions, and gotchas.
