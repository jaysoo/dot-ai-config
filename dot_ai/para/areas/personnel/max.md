# Max

**Team:** Dolphin
**Role:** L4 Engineer
**Manager:** Jason
**Location:** Munich, Germany (CET - 6 hours ahead of Eastern)

## Personal

- **Partner:** Wife (injured ankle in bike accident 2026-03-19, front wheel caught in tram tracks)
- **Children:**
- **Pets:**
- **Hobbies:**
- **Upcoming Travel:** Georgia trip on hold pending wife's MRI results

## Preferences

- **Food:**
- **Drinks:**
- **Restaurants:**

## Professional

- **Current Focus:** Polygraph (orchestration owner), Agentic migrations, Console/Java maintenance
- **Goals:**
- **Strengths:**

## 1:1 Notes

### Upcoming

- Follow up on wife's ankle MRI results / Georgia travel plans
- Check on Polygraph progress toward April 7th launch
- Follow up on tutorial review issues reassigned to Jack
- Check on Dylan's CLI documentation status

### 2026-03-19

**Personal Updates & Travel**

- Jack back from Galapagos - got severely sunburned despite sunscreen
  - Day in Bogota, Colombia - tried local coffee (less acidic due to unique climate)
- Max's wife injured ankle in bike accident (front wheel caught in tram tracks)
  - Awaiting MRI results tomorrow
  - Georgia travel plans on hold

**Polygraph Product Development**

- April 7th launch target - aggressive but achievable
  - Foundation solid and functional
  - Full Red Panda team allocated
  - Cross-functional vertical owners: Sean (front-end), James (CLI), Max (orchestration)
  - Plans established through April 7th and beyond
- Outstanding business questions unresolved:
  - Pricing, marketing positioning (NX vs Cloud vs standalone)
  - Company integration approach
  - Resource allocation between OSS/Cloud vs Polygraph
  - Team structure implications for CI team members

**NX Platform Strategy & Maintenance**

- CI team shifting to core performance and intelligence
  - Targeting 80-90% time on strategic priorities
- Planned deprecations to reduce surface area:
  - Webpack, RSPack, Rollup plugin configs
  - Remix, Nuxt, potentially Vue integrations
  - Strategy: eject configs to user repos, maintain base configs only
- Automation initiatives (Jason leading):
  - GitHub issue quality enforcement with auto-closure
  - Claude-powered PR generation for community-labeled issues
  - Slack bots for nightly summaries and issue triage
- Tutorial restructuring:
  - Reverting to CNW experience due to decreased tool invocations
  - Extracting self-healing content into separate CI-focused tutorial
  - Agentic testing: Claude should complete tutorials zero-friction

**Next Steps**

- Jack to discuss OSS sync format changes with Jason today
- Max to reassign tutorial review issues to Jack
- Awaiting Dylan's documentation for CLI changes before production deployment
- Montreal team gathering in less than one month

---

Chat with meeting transcript: [https://notes.granola.ai/t/0f6e7712-c400-41f7-934c-30d8627d5972-00demib2](https://notes.granola.ai/t/0f6e7712-c400-41f7-934c-30d8627d5972-00demib2)

### 2026-03-05

**Team Impact from Recent Departures**

- Colm and Heidi departures create concern about workload distribution
  - Lost Colm who wasn't fitting well with current situation
  - Heidi/Madeline left for better opportunities - concerning if Nx isn't competitive
  - Team now has one less person to handle existing workload
- Max worried about status quo continuing without meaningful changes
  - Immediate meeting called day after Colm departure shows leadership taking it seriously
  - Need concrete changes beyond just deprecating obvious items

**Core Team Challenges & Solutions**

- Multiple surface areas per person creating stress
  - Public nature of open source makes issues more embarrassing than private SaaS complaints
  - Lack of clarity on project priorities - people juggling 3+ projects simultaneously
  - Need maximum 1-2 projects per person requiring actual movement/delivery
- GitHub issue management overwhelming
  - Gregory mentioned feeling embarrassed about grass speed/tool quality
  - 2023 issues still unaddressed while new similar issues get fixed in hours
  - Need higher quality bar for issues - auto-close those without repro/details
  - AI automation can help with issue classification and investigation
- Recognition and motivation gaps
  - Team less proud of tool they're building compared to earlier years
  - Kudos channel underutilized - need more recognition culture
  - Work on customer-facing features (like polygraph, self-healing CI) more motivating than maintenance

**Moving Forward**

- Focus on high-impact work with clear customer value
  - Q4 was actually positive despite pipeline concerns
  - Faster iterations with customer feedback loops
  - Align work with both short-term and long-term company goals
- Upcoming changes
  - Jack off next week but will stay minimally in loop
  - April team gathering anticipated to help with alignment
  - More aggressive about closing low-quality issues and AI-generated PRs
  - Better filtering of inputs before they reach team members

---

Chat with meeting transcript: [https://notes.granola.ai/t/ade156d8-db71-4d08-a867-d002b3294e1f-00demib2](https://notes.granola.ai/t/ade156d8-db71-4d08-a867-d002b3294e1f-00demib2)

### 2026-02-26

**Travel & Montreal Conference Planning**

- Booked flights for Montreal conference
  - Lands Sunday, leaves following Sunday
  - Planning Saturday-Sunday solo road trip/exploration around Montreal area
  - 8h 5min flight from Munich
- Jack suggested asking Ben for outdoor activity recommendations
  - Via Ferrata climbing option (weather dependent)
  - Quebec City area has better nature/mountains than Montreal proper

**Console Java & Work Allocation Updates**

- Maven dogfooding continues with ongoing issue discovery
  - Finding new problems through dogfooding, keeping as background work
- Gradle patch runner deprioritized
  - Missing logs functionality (DX improvement, not critical)
  - No customer requests; communicated to Jason - will reassign or backlog
- Team alignment: reduced team size driving focus on high-impact items (AX, onboarding)
  - Only working on customer-requested or completely broken items

**AX Migration Board & Implementation Strategy**

- Max created separate board with 3 milestones:
  1. MVP implementation
  2. Polish and cloud app integration
  3. Launch readiness
- Marketing strategy meeting scheduled tomorrow with Heidi, Jeff, Jo and execs
- Validation approach:
  - 80-90% confidence in current direction
  - Considering quick demo/prototype for early feedback
  - Max will discuss with Yuri about creating stylized demo videos
- Testing strategy:
  - Jason as primary contact (has existing update scripts)
  - Need test cases from older versions and customer scenarios
  - PayFit upgrade issues noted as concrete example of migration pain points

**Import Functionality & Documentation Gaps**

- Connect import waiting on Dylan and Louis reviews
  - Louis also working on sandboxing (higher priority); expected to merge soon
- Import tool analysis reveals documentation needs
  - Tool handles low-level git merging and plugin detection well
  - Major gaps in technology-specific guidance (ESLint configs, Turbo-to-NX mapping)
  - Agent skill development highlighting missing human documentation
- Documentation improvement plan:
  1. Max finishing benchmark and blog post outline
  2. Create issues for each technology (React, Angular, etc.)
  3. Assign team members to test import processes and document gaps
  4. Focus on "golden path" technologies first
- Current state: Import tool is "half-baked" without proper post-import guidance

---

Chat with meeting transcript: [https://notes.granola.ai/t/ee522984-7854-4492-9d83-2d377759d554-00demib2](https://notes.granola.ai/t/ee522984-7854-4492-9d83-2d377759d554-00demib2)

### 2026-02-19

- Backlog grooming - remove items without descriptions, add due dates to all TODOs
  - Currently 21 items, could grow to 40+; with Colum at 1-2 issues/week = 20+ week burn-down
  - Higher quality gate: spec out or remove
- Agent tutorials may move to docs team (overlap with NX Learn)

#### Migration Project Planning

- Overall approach approved - break into milestones and tasks
- Most work outside CLI scope; Colum has working local example proving minimal CLI changes needed
- Keep Leo in loop for debugging migrate issues and CLI improvements
  - Leo expected to deliver tasks/specs before March
- Core migration without framework updates most impactful but likely won't pursue
  - Framework updates where agentic approach helps most

#### Verification and Documentation

- Need verification steps beyond automated tasks
  - Angular: check component patterns updated correctly
  - React 19: verify deprecated features replaced
- Leverage existing markdown examples, expand with more detail
- Ship migration instructions as metadata for agents
- Generate summary blocks for humans post-migration

#### Timeline and Resources

- Start first week of March (post-cooldown)
- Max ~70% agentic migrations, remainder Console/Java maintenance
- Colum contributing 1 day/week but need faster feedback cycles
  - Consider Monday/Wednesday split vs weekly to avoid multi-week delays
- Java wrapping up next week except Gradle patch runner

#### CLI and Agent Integration

- Import command enhancement: separate plugin selection step
  - Don't default to all plugins; let agents ask users which ones
  - Provide educational links about plugin benefits through agent
- Future: invert control so agents get plans vs calling our tools
  - Start with prompts in NX dev for migration benchmarking
  - Experiment with Claude integration later

#### Project Management

- QA column currently ad-hoc waiting on Cursor/Claude feedback
  - Will use proper QA step going forward, review in syncs
- All TODO items need due dates

### 2026-02-12

- **AX: init flow for AI agents** - Should `init` ask users if they want an AI agent to handle the process? Could generate a markdown file with instructions for the AI to follow. More consistent than hints from CLI tools.

- Time zone expectations conversation (from Victor 1:1 2026-02-09)
  - Need 3-4 hours overlap with Eastern team (noon ET = 6pm CET)
  - Not about working Eastern hours, but ensuring collaboration windows
  - More reliable availability for urgent tasks

### Feedback (from Victor 1:1 2026-02-09)

- Consistently delivers behind schedule despite capability
- European work-life balance approach less suitable for startup pace
- Needs to be more reliable for urgent tasks and team dependencies
- Less available than James (who's also remote but more responsive)
- Impacts ability to assign critical responsibilities
- Weekly sync with Jack starting to improve oversight
