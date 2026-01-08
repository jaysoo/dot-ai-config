# Summary - 2026-01-08

## 2026 Engineering Metrics Framework

Designed a comprehensive metrics framework for 2026 based on the SPACE framework (Satisfaction, Performance, Activity, Communication, Efficiency). This builds on the YoY analysis work from January 7th that compared 2024 vs 2025 productivity data.

### Key Metrics Defined

1. **PR Throughput Trend** (Activity)
   - PR count per month per team
   - CLI started 2025 below 2024 but trended up, validating team restructuring
   - Target: Maintain or exceed Q4 2025 monthly averages

2. **AI Amplification Index** (Efficiency)
   - AI tokens consumed / PR merged
   - Measures whether AI usage translates to productivity gains
   - Target: Establish baseline Q1 2026, track ratio improvement

3. **Planning Accuracy** (Performance)
   - Formula: `|Actual planned work % - Target %| / Target %`
   - Example: 50% target, 40% actual = 20% miss
   - Target: ≤15% deviation from planned allocation

4. **Review Cycle Time** (Efficiency + Collaboration)
   - Median TTFR (Time to First Review)
   - Target: Maintain <4h median TTFR

5. **Code Health Ratio** (Performance)
   - Deletions / Additions ratio (monthly)
   - 2025 showed +135% deletions post-AI, indicating healthy refactoring
   - Target: Maintain deletion ratio >0.25

6. **Developer Satisfaction** (Satisfaction)
   - Quarterly pulse survey score (1-5 scale)
   - Target: ≥4.0 average, no team below 3.5

7. **Stakeholder Satisfaction** (Performance)
   - Quarterly survey from Sales, Marketing, CS, Product
   - Questions cover: value delivery, predictability, responsiveness, transparency, collaboration
   - Target: ≥4.0 average

### Survey Implementation Discussion

- **Developer Pulse Survey**: Simple Google Form with 5-7 questions, anonymous, quarterly
- **Stakeholder Survey**: 5 core questions for Sales/Marketing/CS/Product satisfaction with engineering
- Options discussed: Google Forms (free), Lattice/Culture Amp ($4-8/user/mo), Slack-native (Polly)

## Files Referenced

- `data/2025-baselines.json` - 2025 PR/review metrics by month
- `data/2024-baselines.json` - 2024 baseline data for YoY comparison
- `data/yoy-2024-2025.html` - Comprehensive YoY analysis page with charts

## Related Work

- Continues from 2026-01-07 work on Work Composition Metrics and YoY analysis
- Builds on AI adoption analysis showing Q2 2025 +164% LOC spike correlating with AI rollout
