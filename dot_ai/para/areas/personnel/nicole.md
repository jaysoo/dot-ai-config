# Nicole

**Team:**
**Role:**
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

### Upcoming Topics

- Reporting structure and 1:1s
- **Slack App for Nx:** Explore @nx Slack bot integration - accept fixes via Slack, get notified when PRs are green after a fix
- GTM for pricing, etc.
- Priorities for enterprise, teams, hobby

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
