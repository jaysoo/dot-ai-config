# Quark-A Sync Tracker

Tracking document for Quark-A team sync meetings.

**Mission:** Own the PLG funnel and experiments to hit Nrwl's self-serve revenue goal.

**Team:**
- Jack Hsu — Product Lead
- Cory — PLG / RevOps (funnel data, experiment tracking)
- Nicole Oliver — Measurement / engineering execution
- Alton — Data analysis (supporting)

**Targets (2026):**
- 550 new self-serve workspaces (currently on pace for ~300)
- $3.3M ARR
- Free-to-paid conversion benchmark: 5-8% (10%+ excellent); current overall acquisition-to-conversion is 2.2%, activation-to-conversion is 2.7%

**Funnel definitions (current):**
- **Acquisition** — org has claimed a workspace (first workspace claim date)
- **Activation** — org has 20 CIP runs (no "successful" requirement); 72% rate — likely too loose, revisit
- **Conversion** — activated org adds credit card
- **Signal:** 5+ projects in a workspace correlates with dramatically higher conversion across all stages

## Topics for Next Meeting

- Revisit activation definition (speed/savings metrics vs CIP count)
- Map engineering efforts to funnel stages (continue)
- Product: surface value of adding multiple projects to a workspace (5+ projects correlation)
- Cadence for all-hands updates (weekly vs bi-weekly)
- Realistic launch dates for activation experiments
- Baseline data before setting hypothesis %s (Altan's concern)

## Upcoming Sync

- (cleared — points rolled into 2026-05-05 meeting notes)

## Action Items

### From 2026-05-05 (Quark-A weekly sync)

- [ ] Nicole: update sheet with project status numbers instead of colors
- [ ] Team: update experiment data in sheet before next meeting
- [ ] Jack + Nicole: Get Started page optimization (button copy/styling, 5% traffic lift target)
- [ ] Altan: continue no-login demo dev; establish baseline metrics before setting targets
- [ ] All: provide realistic launch dates for activation experiments

### From 2026-04-23 (Jack/Cory sync)

- [x] Jack + Nicole: track experiments (what tried, effects, timing) — Google sheet w/ project links
- [x] Team: standardize experiment tracking location — Google sheet
- [ ] Jack + Nicole: map engineering efforts to funnel stages (partial — continue)
- [ ] Team: revisit activation definition (speed/savings vs CIP count)
- [ ] Product: surface value of adding multiple projects to a workspace

## Meeting Notes

### 2026-05-05 — Quark-A Weekly Sync

**Attendees:** Jack, Nicole Oliver, Cory, Altan Stalker, Jeff Cross, Heidi Grutter

[Granola transcript](https://notes.granola.ai/t/7b6deae7-5831-4be0-9a40-caecf57c5606-00demib2)

**Context:** PLG funnel work toward 10M+ ARR self-serve goal.

**Experiment tracking & reporting**

- All experiment data consolidated in Google sheet w/ project links
- Future format: team updates sheet beforehand, meeting time = review together (not individual readouts)
- Color coding → switching to actual numbers for clearer tracking

**Acquisition experiments**

- CNW init: peaked ~1200/day completion → deprioritized (gray)
- Nx init: hitting 300/day target, ~20% yes rate → next target 400
  - New agent-guided onboarding ready
  - Can create workspace w/o full local setup
  - Clearer GitHub app authorization instructions
- One-page manual onboarding: 2x improvement in workspace claims
  - Rolling to all CLI traffic today; full launch end of week
- Homepage: "Get Started" link significantly outperforms "Try Nx Cloud" button
  - Plan: 5% traffic lift via button copy/styling

**Homepage & onboarding strategy**

- Considering merging create-workspace flow w/ guide view
- Drop GitHub admin permissions requirement
- Prioritize existing-workspace integration > new-workspace creation (higher adoption potential)
- Get Started page critical due to traffic volume

**Activation experiments**

- Feature demos: 2 PRs open, working w/ Ben on framework details
- Demo data generator ready for quick feature rollout
- Feature activation guides: foundation PR open, detailed spec done; phased (first value → full feature set)
- DTE visualization contributes to acquisition/activation

**Bandwidth & prioritization**

- Multiple competing priorities; focus risk
- Time to Green analytics scheduled (Enterprise requirement)
- Cory: focus 2-3 biggest impact items vs marginal improvements
- Maintenance/bug fix load constraining capacity

**Hypothesis & measurement philosophy**

- Debate: specific % targets vs directional goals
- Altan: lack of historical data makes specific targets arbitrary
- Agreement: measure directional improvement while building baseline
- Focus on overall funnel health vs individual metric optimization

### 2026-04-23 — Jack/Cory PLG Funnel Data Sync

**Attendees:** Jack, Cory (Alton + Nicole referenced as collaborators)

[Granola transcript](https://notes.granola.ai/t/7f17b5f0-6242-4bfb-91eb-90278f09ad1f-00demib2)

**PLG Funnel Analysis Overview**

- Cory presenting data analysis work with Alton and Nicole
- Goal: align on high-level conversions through PLG funnel (how orgs onboard → use product → pay), then prioritize product efforts to improve specific conversions
- Moved from workspace-level to org-level tracking for cleaner customer metrics
- Industry benchmark: 5-8% free-to-paid conversion (10%+ is excellent)

**Current Funnel Performance**

- Acquisition: org has claimed workspace (first workspace claim date)
- Activation: 20 CIP runs (dropped "successful" requirement)
  - 72% activation rate — potentially too high to be a meaningful metric
  - Open question: what does activation mean? When users see value
- Conversion: activated orgs that add credit card
  - 2.7% activation-to-conversion rate
  - 2.2% overall acquisition-to-conversion rate
- 5+ projects correlation shows exceptional conversion rates across all stages
  - How do we get people to add more projects?

**Strategic Insights & Opportunities**

- Current trajectory: ~300 new self-serve customers vs 550 goal
- Highest leverage: improve activation-to-conversion rate
  - Large pool of activated orgs not converting to paid
  - Lifting conversion 1-2 points could hit the 550 goal without more top-funnel volume
- Question: are incoming users the right type? (marketing/messaging consideration)
- Focus on converting existing funnel vs acquiring more users

**Next Steps**

- Jack and Nicole to review tactical metrics and experiments for Tuesday core team sync
  - Map engineering efforts to funnel stages
  - Track what experiments tried, effects, timing
  - Where do we track experiments?
- Weekly/bi-weekly all-hands updates on team progress
- Standardize experiment tracking location (Linear vs spreadsheet)
- Revisit activation definition — consider speed/savings metrics vs CIP count
- Product focus: surface value of adding multiple projects to a workspace
