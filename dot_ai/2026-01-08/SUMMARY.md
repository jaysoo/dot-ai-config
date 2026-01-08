# Summary - 2026-01-08

## Performance Reviews - January 2026

Compiled comprehensive performance review notes for 8 engineers using all available data sources:
- **Engineers reviewed**: Caleb Ukle, Steve Pentland, Altan Stalker, Rares Matei, Nicole Oliver, Mark Lindsey, Jonathan Cammisuli, Jason Jean
- **Data sources**: 1:1 notes, GitHub PRs (nx, ocean, cloud-infrastructure, nx-console), Linear issues, hackday recap (2025-12-08), personnel files

Key findings:
- **Top PR contributors**: Jason Jean (150), Altan Stalker (103), Caleb Ukle (75)
- **Hackday projects** (excellent initiative examples): Altan's Domain Assist, Jason's AI Chat + Executive Summary, Mark's Contributions Dashboard
- **Suggested ratings**: Jason & Altan rated "Strongly Exceeds/Always" for skills and initiative

**Output**: `dot_ai/2026-01-08/tasks/performance-reviews-jan-2026.md` - Full notes with suggested answers for all 6 review questions per engineer

---

## PARA TUI App Specification

Created detailed specification for a terminal user interface (TUI) application to manage personal knowledge using the PARA method.

**Technology Stack**: Go 1.21+, Bubbletea, Bubbles, Lipgloss, Glamour, Bleve

**Key Features**:
- Action-focused inbox with stale items detection
- Three-pane layout (sidebar, browser, preview)
- Full-text search with fuzzy matching
- Quick capture modal with Claude CLI integration for README generation
- Linear and Git integrations

**Output**: `dot_ai/2026-01-08/specs/para-tui-spec.md`

---

## 1:1 with Altan

Discussed Quoka team status and 2026 planning:
- **Tracing Project**: Key coordination between Rares, Craigory, Jason with June 15-20 deadline
- **SPACE Framework Metrics**: 5 core metrics (PR throughput, AI usage efficiency, work allocation, PR cycle time, P1 resolution)
- **Team Status**: Kickoffs completed for first projects, declaring bankruptcy on leftover Orca projects

**Output**: `dot_ai/2026-01-08/dictations/1-1-altan-jack.md`

---

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
