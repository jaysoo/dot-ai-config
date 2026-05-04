# Nicole

**Team:** Orca
**Role:** L5 Engineer
**Manager:** Jack
**Location:** San Diego, CA, USA

## Personal

- **Partner:** Husband (name?)
- **Children:** Daughter (name?)
- **Pets:**
- **Hobbies:**

## Preferences

- **Food:**
- **Drinks:**
- **Restaurants:**

## Professional

- **Current Focus:**
- **Goals:**
- **Strengths:**

## 1:1 Notes

### 2026-04-24 - 1:1 Nicole & Jack

**Team Updates & Collaboration**
- Nicole working effectively with Ben as smaller team
  - Independent work with regular syncs
  - Efficient working relationship established
- Jack feeling under the weather but managing workload
- Dashboard cleanup progress for all-hands presentation next week
  - PostHog integration improvements
  - Fixed manual flow data issues
  - Web traffic tracking still relies heavily on Google Analytics

**Init Performance & Analysis**
- Current init numbers: ~220 daily with ~25% success rate
- Significant drop from October (previously 20-30 workspaces/day)
  - Likely caused by metadata structure changes (JSON vs comma-separated)
  - Stats calculation may need updates
- Recent improvements from reverting docs changes
- Acquired workspace count trending upward despite lower init volume
  - More serious users converting
  - Needs deeper analysis to understand correlation

**Experiments and Changes**
- Init error fixes in progress for better debugging
- Confirmation screen for PR links restored to production
- Manual onboarding flow ready for launch (pending Ben's review)
- Upcoming benchmarks comparing Nx vs Turbo vs Vite
  - Turbo showing faster performance in some cases
  - Vite significantly slower than Nx and Turbo

**Pricing & Dedicated Cloud Initiative**
- Target launch: June 1st (infrastructure guaranteed by Steve)
- Initial approach: manual provisioning with 72-hour setup
- Pricing structure: $200-300/month base for dedicated compute
  - Unlocks sandboxing, Docker layer caching, other premium features
  - Additional features available as add-ons
- UI/UX considerations needed for feature discovery and upgrade flow
- Cross-team project spanning all departments
- Jack owning end-to-end delivery with team input on respective portions

**Team Focus & Strategy**
- Activation rate improvement priority (2.5% to 4.5% would meet targets)
- Need team alignment on experiment priorities before May
- Faster iteration cycles needed - less waiting, quicker testing
- Documentation in Linear for experiment tracking
- PostHog integration for measurable experiments

[Transcript](https://notes.granola.ai/t/19975476-d49e-4a94-b70e-ce84afd8ee08-00demib2)

**Carry-over from prep topics:**

- Reporting structure and 1:1s
- **Slack App for Nx:** Explore @nx Slack bot integration — accept fixes via Slack, get notified when PRs are green after a fix
- GTM for pricing, etc.
- Priorities for enterprise, teams, hobby

### 2026-04-22 - Review Onboarding/Activation Metrics

**Team Dynamics & Communication**
- Nicole feeling insecure about growth numbers and recent feedback
  - Alton's presentation at Orca meeting felt aggressive/frustrating
  - Good ideas but delivery made her feel bad about 6 months of onboarding work
  - Concerns about role clarity and being excluded from pricing discussions
- Jack to address delivery style with Alton separately
  - Focus on exploring global vs local optimization approach
  - Acknowledge team stress during difficult company period

**Onboarding Metrics & Performance**
- CNW completion rates improved significantly
  - Stable 20% conversion rate (up from 7%)
  - 1000 CNW + 300 init completions daily = 260 front-end sources
- VCS flow performance breakdown:
  - GitHub: ~70% of traffic
  - GitLab one-page flow: 2x higher conversion than previous
  - Manual flow conversion needs improvement (currently <50%)
- Guided onboarding without GitHub admin permission should boost continuation rates
- PostHog implementation planned for docs analytics and session replay

**Current Optimization Focus**
- Manual onboarding flow improvements
  - One-page onboarding in PR review, launching soon
  - Making VCS setup step more friendly/skippable
  - Target: >50% completion rate for committed users
- Tracking methodology updates needed
  - Base metrics on first interaction vs page navigation
  - Better correlation between CNW/init and claim rates
  - Fix database connection issues affecting dashboard

**Action Items**
- Jack: Implement PostHog for docs (May/June timeline)
- Jack: One-on-one with Alton about communication style
- Jack: Follow up with Jeff on DTE onboarding commitments
- Nicole: Update tracking spreadsheet to focus on current priorities
- Nicole: Launch one-page manual onboarding flow
- Team: Present combined CNW + onboarding metrics at Orca updates

[Transcript](https://notes.granola.ai/t/06c4ec28-744f-4729-a952-227b9ec93d1b-00demib2)

### 2026-02-26

**Capital One Visit Debrief**
- Visit didn't achieve intended executive-level conversations
  - Miscommunication with Capital One organizers
  - Presented to developers instead of executives with executive-focused content
- Key findings on AI adoption
  - Minimal AI usage due to banking compliance concerns
  - Hesitation around AI replacing developers
  - Self-healing CI will be challenging to implement
- Technical constraints discovered
  - Cannot use Nx affected due to compliance requirements
  - Sonar and auditing tools require checking everything on PR merge
  - Remote cache offered as alternative solution
  - Similar issues seen at T-Mobile previously

**Non-AI Feature Strategy**
- Need pitch not focused on AI after seeing "glazed over" reactions
- Identified sellable enterprise features
  - Nymeria confirmed can consume metrics
  - Need to test with 1-2 customers and implement additional requested metrics
- GitHub app setup improvements needed
  - Current multi-app system with 10 max callback URLs causes errors
  - Steve suggests dynamic app generation for single tenant instances
  - Research needed with Victor and Mark

**Communication & Process Improvements**
- Pylon integration setup for DPS team
  - Kanban board for tracking customer issues across channels
  - Linear integration for engineering requests
  - Reduces dropped follow-ups on support emails
- Unified changelog initiative
  - Andrew unaware of existing cloud and CLI changelogs
  - Philip's POC: platform-focused updates instead of version-based
  - Monthly blog posts covering whole platform
  - Manual coordination with Nicole and Jason for big features
- Team departures impact
  - Heidi and Madeline both leaving
  - Shift toward product-led growth strategy
  - Focus on bottom-up adoption vs top-down executive approach

**Onboarding Performance & Experiments**
- Current metrics: ~0.40 workspaces per day
- Recent GitHub flow changes showing modest improvement
- Fixed attribution bug for Create NX workspace tracking
- Major drop-offs identified
  - 30% drop at login screen
  - Additional drop-offs after login
- Upcoming changes this week
  1. Dylan's welcome screen updates
  2. Manual onboarding flow improvements
  3. One-page onboarding experiment next week
- Server stability concerns
  - Streaming issues causing unresponsive connect buttons
  - Chu working on agent pool for log streaming to unblock main thread
  - May need loading indicators as interim solution

**Action Items**
- Jack: Check with Jason on CNW errors, move monitoring off Jason's machine to Lighthouse
- Jack: Raise CLI metrics project with Jason, capture in project plan
- Jack: Research GitHub app dynamic generation with Victor and Mark
- Jack: Sync with Philip on unified changelog process
- Nicole: Complete manual onboarding changes by end of week
- Nicole: Meeting with Jeff today about team changes and strategy

[Transcript](https://notes.granola.ai/t/7f67d126-7283-4dff-a148-03e26bb150ba-00demib2)

### 2026-02-12

**Quarter Performance & Growth Focus**
- Numbers currently poor, causing frustration despite breakthrough optimism
- 600 target by month-end unrealistic, but process improvements (one-page onboarding) showing results
- Mindset shift from planned work completion to goal-driven approach
- Metrics resistance spurring creativity and deeper analysis
- 500 mark minimum to avoid appearance of failure

**Team Structure & Responsibilities**
- PostHog usage: $100-150/month, adding staging environment for better testing
  - Reverse proxy setup with infra team to capture more traffic
  - Remove Flipt integration due to production testing limitations
- Orca team capacity issues with Dylan and Nicole handling maintenance requests
  - Security issues, DevX problems (1Password, CI issues) creating bottlenecks
  - Current focus on growth means deferring non-critical maintenance
- Team allocation changes coming mid-March/April when Ben returns
  - Orca becomes front-end focused like Red Panda
  - Internal tooling/DevX responsibilities distributed across teams
  - Raj monitoring CI runs and repo health
- Agent experience ownership clarified: Max owns with blurry definition of scope

**Onboarding Experiment Strategy**
- Second variant performing better, ready to lock in
- New approach: Remove "selling" Cloud, present as normal next step
  - Theory: Avoid forcing decision-making, make continuation feel natural
  - Risk: May annoy developers who don't need Cloud features
  - Focus on CNW numbers specifically, not enterprise concerns
- Plugin created to fix NX Cloud DX issues (subprocess solution)
  - Alton updating Kotlin projects
  - GitHub environment variables cleanup needed
  - Snapshot configuration coming after cleanup
- Agent work allocation: Maximum 1 day/week for Nicole and Dylan unless CLI-related

[Transcript](https://notes.granola.ai/t/b01ae96f-2ecc-423c-be8a-bfc6cf1d474e-00demib2)

### 2026-02-03 - NX Cloud Onboarding Strategy for Agent Integrations

**CNW Agent Integration Timeline**
- Next two weeks: CNW experience implementation
- End of month: Extend and NX Connect features
  - Both in same bucket for development
  - NX Connect trickier (existing repos) but starting with workspace setup only

**GitHub CLI Detection & Setup Flow**
- Need to detect if user has GitHub CLI installed
- Two user groups to handle differently:
  1. Never connected (said no/opted out)
  2. Connected but didn't finish setup
- Focus optimization on second group using agents
- First group handling strategy still unclear

**Cloud Onboarding Strategy Decision**
- Key question: Should CNW prompt for Cloud opt-in/out or auto-connect?
- Different messaging needed based on approach:
  - With prompting: Surface platform benefits, provide connection guidance
  - Without prompting: Agent explains speed benefits, handles connection
- Can customize output based on invoking agent (environment variable detection)

**Agent Experience Scope**
- Initially building for Claude specifically, but should be generic across agents
- Focus on Claude Code first, ensure good experience before broadening
- Core focus areas:
  1. Messaging optimization for agent understanding
  2. Helping users complete workspace setup
  3. API endpoint integration for connection status checks

**Implementation Gaps & Next Steps**
- Need to identify missing Cloud-side endpoints
- Dylan/Lou/Ulta to build missing pieces
- Document CNW flow gaps through testing
- JSON structured output experiment running for CI agent optimization
- Max and Colum available for agent implementation help
- Onboarding numbers low last week but expected to recover with recent changes
- Target: 600 mark within one month

[Meeting transcript](https://notes.granola.ai/t/3ba55663-5159-4d28-9f92-0359004166bb-00demib2)

### 2026-01-09

**Team Performance & Productivity Metrics**
- Built personal journaling tool with Vim integration and Claude editing
  - Transitioning from other apps to custom solution
  - Still needs search functionality implementation
- 2026 productivity framework based on SPACE

**Topics Discussed**
- **PR Review Goals 2026:** TTM/TTFR under 24 hours (ideally under 12 hours), encourage AI-assisted PR reviews for prioritization and summaries
- **Permissions:** https://www.notion.so/nxnrwl/Nx-Cloud-Github-App-Permissions-2cc69f3c238780229008c36a71324a08
  - Get feedback from Mark, etc. and then Caleb can put it in docs
- **Cookiebot:** https://linear.app/nxdev/issue/DOC-179/re-enable-cookiebot
  - Circle back in two weeks
- **Metrics for 2026:** https://docs.google.com/document/d/1AYjxss9Eba0QWuGsx7TZmqsF9FDeurZABi8kjTRQ2Mc/edit?tab=t.0

## Random Notes
