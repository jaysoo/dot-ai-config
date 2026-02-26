# Max

**Team:** CLI
**Role:** Engineer
**Location:** Munich, Germany (CET - 6 hours ahead of Eastern)

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

- **Current Focus:** Agentic migrations (~70%), Console/Java maintenance (~30%)
- **Goals:**
- **Strengths:**

## 1:1 Notes

### Upcoming

- Backlog grooming - remove items without descriptions, add due dates to all TODOs
  - Currently 21 items, could grow to 40+; with Colum at 1-2 issues/week = 20+ week burn-down
  - Higher quality gate: spec out or remove
- Agent tutorials may move to docs team (overlap with NX Learn)

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

