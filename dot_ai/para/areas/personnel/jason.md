# Jason

**Team:** Dolphin
**Role:** L6 Engineer
**Manager:** Jack
**Location:** Toronto, Ontario, Canada

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

- **Current Focus:** Revenue-generating features (CPU tracking, I/O tracing), FE reviews, tracing coordination with Altan
- **Goals:** Focus on features that generate enterprise revenue
- **Strengths:** Strategic thinking, willing to prioritize ruthlessly

## 1:1 Notes

### Upcoming Topics

- **Follow-up from 2026-03-06 1:1:**
  - V23 deprecation list finalization — Jason + Victor to create removal list, send to DPEs for customer impact
  - Collect deprecation feedback this month, finalize during onsite for May V23 release
  - Pylon rollout progress — check DPE adoption (1 PR/week requirement, knowledge base)
  - Gregory's triage process — how is automated vs human triage balance working?

- **Craigory morale & retention signal (from 2026-03-05 1:1)**
  - Said he's "less proud of the tool now vs. 2 years ago" — check if this is temporary frustration or deeper disengagement
  - Advocated strongly for one project per person max — likely felt stretched thin
  - Frustrated by maintaining plugins the team doesn't use daily (expertise dilution)
  - Protect his focus on sandboxing target defaults — don't let scope creep in

- **Leo Burnout/Morale Risk (from 2026-03-05 1:1):**
  - Stressed by competing priorities, burnout concerns from maintenance burden
  - Constantly moving deadlines in syncs is demoralizing the team
  - Wants planning to start from team proposals — echoes Jason's own Effy feedback about decision communication
  - CLI team needs autonomy for smaller customer-requested improvements (e.g., target defaults)
  - Shield team from low-quality DPE requests — require repros/logs before engineering involvement

- **Leo's L5 career progression** — criteria feel outdated for current team size, needs clearer path

- **AI leverage: test harnesses & issue quality**
  - Better test harnesses needed so AI agents can be used more effectively (ties into Victor's HDD concept)
  - Better Linear and GitHub issues — clear repro steps, expected behavior, etc. so issues can be thrown to AI

- **Recognition culture:** Start giving more anticipatory kudos during projects, not just after completion

#### Effy Reviews

Strengths:

- Good orchestrator for the CLI team
- Quick to understand new projects
- Proactive in finding issues and making sure that they are resolved
- Runs meetings efficiently and keeps team on track
- Eager to help and jump on calls

Most valuable contribution:

- Leading CLI team
- Maven, Kotlin graph analyzer -- using AI to dig through Maven code to figure out integration points

Improvements:

- Decisions for cycle work is not clearly communicated, and no feedback on proposals
- More clearly communicate rationale behind decisions

Action items:

- Team-wide planning sessions, review previous proposals with the team

#### Concerns about communication style

**Sales Pipeline Discussion - Concern from Sales Team:**

Jeff: sometimes come off as "I know better, therefore I am going to challenge this decision/process etc."

Jason's questioning during Madeline's sales update caused concern/confusion among Sales folks. Key exchange:

- **Jason:** "There seems to be a lot of opportunities.. but are we going to act on all 50 of them? In particular there's 37 opportunities coming from uptiering people.. are they all active?"
- **Madeline:** Clarified that every open opportunity is actively being worked with next steps, dates, descriptions, and notes. Process includes accountability during 1:1s, sales team meetings, forecasting. Opportunities not being worked are moved to closed lost.
- **Jason follow-up:** "Yeah, they all seem like differing levels of revenue but it's not clear how much effort we're putting forth to each of them.. like 899k / 37 the average is probably 30k? But the partner referrals is 600k in 4 opportunities so an average of 150k? Shouldn't more effort be put forth for those deals?"
- **Madeline:** "This is 100% taken into consideration. Please put time on my calendar so I can build more trust into the process of pipeline management"

**Takeaway:** The questioning came across as skepticism about whether Sales is prioritizing correctly. This reinforces the earlier topic about perception - his analytical approach can land as challenging the team's competence.

### 2026-03-06

**V23 Release Planning & Node 20 Deprecation:**
- V23 discussion to continue during onsite
- Node 20 support ends April 11th — version matrix won't include Node 20 after V23
- Thomas confirmed band changes approved for March 31st paycheck (EU)
- Max bumped to L4 (double promotion discussed with Thomas)

**Deprecation Strategy for V23:**
- Need clarity on what to remove before announcing deprecations
- Obvious candidates: Nuxt, Detox (minimal user impact expected)
- Larger questions: Rollup, Webpack configs (not core competency, minimal testing), Module Federation (Colum departure = knowledge gap)
- Proposed approach:
  1. Jason + Victor create removal list for team review
  2. Send to DPEs for customer impact assessment
  3. Collect feedback this month
  4. Finalize during onsite for May V23 release
- Migration strategy: eject configs so users aren't blocked
- Consider telemetry data to track actual plugin usage vs NPM download stats

**Support & Maintenance Improvements:**
- Pylon implementation: tracks Slack threads + support emails in unified system, blocks engineering from direct support
- DPEs get 1 PR/week requirement + knowledge base creation, AI-powered article generation
- GitHub issue quality: raise submission bar (repro links, logs, screenshots), AI-assisted triage, community assignment for non-priority items, Gregory handles human triage vs automated closure

**Team Morale & Management Feedback:**
- Recognition gaps: team focuses on problems, skips celebrating wins; contributions feel unnoticed; need anticipatory kudos during projects
- 1:1 structure: too project-focused, not enough individual development; consider banning project talk, start with career/personal topics
- Deadline pressure: high priority = urgent in current system; consider dropping due dates, use 2-week assumption; most high-priority items resolved timely

**Post-Departure Team Dynamics:**
- Colum's departure due to stress/maintenance burden
- Team wants hiring commitment signal (not just maintenance reduction)
- CLI team lacks autonomy — too many external requests
- Need more social interaction beyond work topics
- Trust rebuilding through transparency
- Systemic issues: too many features without clear priority, lack of focus vs headcount problem, need product direction clarity

**Action Items:**
- [ ] Jason + Victor: Create V23 removal/deprecation list
- [ ] Jason: Send deprecation list to DPEs for customer impact assessment
- [ ] Jack: Follow up on recognition culture improvements
- [ ] Jack: Restructure 1:1 format — career/personal first, project updates at end

[Granola notes](https://notes.granola.ai/t/8b5d2a24-1756-43d7-9dca-3a32ac447d68-00demib2)

### 2026-01-07

**Maven Plugin Paywall Discussion:**

- Strong internal pushback: Colum against it, James raised issues at all hands, general team opposed
- Victor wants to proceed despite feedback - no clear path to revenue generation identified
- Jason's perspective: feels like "extreme measure" due to resource constraints, concerned about underlying company health implications, not motivated by growth but by survival/funding needs

**Strategic Concerns & Alternative Approach:**

- Current approach lacks clarity on: where to draw paid vs free line, how Maven gating generates enterprise revenue, differentiation from AI-powered features (V+)
- Jason's proposed focus shift: prioritize existing revenue features (CPU tracking, I/O tracing), gate new Maven features that integrate with Cloud, develop pipeline of paid features instead of retroactive gating

**Team Capacity & Priorities:**

- Jason committed to focusing on revenue-generating features, willing to let maintenance slide (e.g., delay Prettier V3 support)
- Week priorities: catching up on FE reviews, tracing coordination with Altan, UI work with Nicole can wait

**Upcoming Deliverables:**

- Jason attending Zach's CLI/Nx 22.3 livestream instead of Jack - focus on shipped features, not roadmap; can mention beta features like full screen
- Platform roadmap: Victor writing comprehensive platform roadmap, team roadmap publication delayed until Victor's complete

**Action Items:**

- Jack: Discuss Maven decision with Victor this week - push for clarity on revenue path or abandon gating
- Jason: Focus on revenue-generating features
- Jason: Coordinate with Altan on tracing work
- Colum: Reviewing outdated plugins for deprecation decisions

[Granola notes](https://notes.granola.ai/t/15e7bfff-de5f-45b3-bf1b-cde9ef41c999-00demib2)

## Random Notes
