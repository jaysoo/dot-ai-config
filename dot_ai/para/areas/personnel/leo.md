# Leo

**Team:** Dolphin
**Role:** L4 Engineer
**Manager:** Jason
**Location:** Barcelona, Spain

## Personal

- **Partner:**
- **Children:**
- **Pets:**
- **Hobbies:**

## Preferences

- **Food:**
- **Drinks:**
- **Restaurants:**

## Professional

- **Current Focus:** Angular upgrade automation, AI skills tooling, maintenance reduction strategy
- **Goals:**
  - Strong interest in AI efforts for career development
  - Wants to participate in enterprise AI migration system
- **Strengths:**
  - Candid about team concerns and morale
  - Proactive on automation (Angular upgrade skill, plugin version updates)


## Upcoming 1:1

- Follow up on maintenance reduction progress (webpack/rspack/rollup deprecation)
- CLI team autonomy for smaller improvements - target defaults status
- AI skills progress (Angular upgrade skill)
- Burnout/morale check-in

## 1:1 Notes

### 2026-03-05

**Team Departures Impact**
- Three key people leaving simultaneously: Colin, Madeline, and one other
  - Colin was major CLI contributor, creates significant capacity gap
  - Madeline's departure less concerning due to move toward PLG strategy
  - Financial impact appears manageable based on Q4 pipeline improvements
- Engineering capacity already strained before departures
  - Team was struggling with competing priorities and maintenance burden
  - Moving deadlines frequently in syncs, demotivating for team

**Capacity and Maintenance Strategy**
- Need to protect time from DPEs more
  - DPEs should handle more issue resolution with proper vetting
  - Issues need repro or logs before engineering involvement
  - Pylon implementation helping organize support workflows
- Aggressive maintenance reduction required:
  1. Remove webpack, rspack, rollup configuration support
  2. Deprecate underused plugins (Nuxt, Detox, potentially rollup)
  3. Focus on core competencies vs bundling tools
  4. Close low-quality GitHub issues more aggressively
- CLI team autonomy needed for smaller improvements
  - Target defaults project example - customer-requested, relatively small effort
  - Balance between revenue-focused work and reputation maintenance

**Process Improvements and Automation**
- Claude/AI skills development for routine tasks
  - Leo creating Angular upgrade skill, testing on major version
  - Jack has CNW stats skill for team use
  - Opportunity to automate plugin version updates
- Issue quality enforcement
  - Require reproductions or detailed logs
  - Bot/automated closure of incomplete issues
  - Learn from other OSS projects with stricter requirements

**Release Quality Concerns**
- TUI launch example of premature default rollout
  - Took year of fixes after buggy initial release
  - Hurt first impressions, users disabled and may not retry
  - Negative impact on team pride and external perception
- Future releases should be experimental/opt-in until polished
  - New workspaces could default to new features
  - Existing workspaces require explicit opt-in

**Team Morale and Support**
- Leo enjoys work and team but stressed by competing priorities
- Burnout concerns from too many maintenance tasks
- Recent months better due to interesting projects (memory tracking, Rust, TUI)
- Need balance between revenue focus and addressing customer frustrations
- Planning process should start from team proposals, not top-down mandates

[Transcript](https://notes.granola.ai/t/e3d342c9-e289-424a-9a83-107e475315dc-00demib2)

### 2026-01-26

**Weather & Travel**
- Returned from first-ever client onsite in Lithuania (minus 20°C)

**Swedbank Onsite Review**
- First client onsite with Miro in Lithuania went well overall
- Technical work completed:
  - Assignment rules blocked by client's MongoDB access issues
  - Performance issues found in graph, need new version releases
  - Angular build performance review - client already using ES build
  - Isolated modules disabled due to type issues client needs to resolve
- Cache hit ratio problems traced to Renovate merging multiple PRs daily
  - Bank security requires separate dependency PRs
  - Suggested timing PR merges to reduce cache invalidation impact
- Annual onsite format: client presents priorities, team reviews and improves

**Performance Review & Career Development**
- 360 review feedback useful, similar to previous rounds
- L5 assessment challenges:
  - Some criteria outdated for current team size (supervising others, large efforts)
  - Need clearer management visibility on career progression gaps
- Project delivery improvements needed:
  - Better tracking from completion to customer value realization
  - Many features finished but not properly followed up or polished
  - Quick wins approach: get customer feedback within 1-2 weeks vs waiting months
- Planning process feedback:
  - Top-down planning necessary for company alignment
  - Need separate backlog review meetings to surface forgotten projects
  - Angular minor releases sometimes disrupt planned work (3 days unplanned this cycle)
  - Suggests creating projects for minor releases vs miscellaneous tasks

**AI Automation Initiatives**
- Experimenting with AI skills for Angular upgrade workflow during cooldown week
  - Automating release notes review and commit analysis
  - Building reusable tools for team beyond just Leo and Colin
- Custom Claude plugin for NX repo discussed - no technical blocker, just needs someone to start
- Future AI migration system concept:
  - Enterprise offering for automatic PR-based upgrades
  - Multi-team effort planned for this year
  - Expressed strong interest in participating in AI efforts for career development

[Transcript](https://notes.granola.ai/t/92f55312-9e0b-40ba-bce5-de9d5767628f-00demib2)

## Random Notes

- (2025-12-11) Neighbors with Andrew in Barcelona
- (2026-01-26) Completed first-ever client onsite at Swedbank in Lithuania with Miro
