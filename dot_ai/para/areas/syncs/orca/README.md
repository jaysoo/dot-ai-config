# Orca Sync Tracker

Tracking document for Orca team sync meetings.

## Topics for Next Meeting

-

## Upcoming Sync

-

## Action Items

- [ ] Jack: Research AI agent limitations and collect data on agentic onboarding
- [ ] Nicole: Review workspace analytics funnel view
- [ ] Deploy browser onboarding fix after Mark consultation

---

## Meeting Notes

### 2026-02-02

**Attendees:** Nicole, Ben, Philip, Dillon

#### Technical Updates & Bug Fixes

- **Netlify Edge Functions debugging issues**
  - Double counting requests (8x actual volume)
  - Sparse documentation, can't debug on preview
  - Only debuggable after production deployment
  - Fixed from 8x down to 2x, working on final resolution
- **Storybook integration completed**
  - UI primitives and chart libraries now accessible
  - Mock stories created for component testing
- **Workspace analytics funnel view created**
  - Nicole to review today
  - Demo mode becoming priority for Enterprise trials
- **CLI onboarding experiment results**
  - Removing prompt performed 66% worse than prompted version
  - New banner experiment running with ASCII art variants
  - GitHub flow missing ReadMe link restored (was getting 70-80 clicks/week)
- **Browser onboarding bug fixes**
  - Install app button wasn't showing to new users
  - Deploy tomorrow pending Mark consultation

#### Product & Marketing Initiatives

- **Pricing page redesign in progress**
  - Top section changing from table to three separate cards
  - Shows more detail for Teams and Enterprise plans
  - Responsive versions still needed
- **Automated feature videos prototype successful**
  - Using Remotion + Claude to create simplified app flow demonstrations
  - Copies Tailwind CSS/HTML, generates storyboard, produces smooth 5-second videos
  - Addresses need for marketing illustrations and demo assets
  - Potential applications: marketing pages, feature walkthroughs
- **Enterprise trial launch delayed**
  - Originally scheduled for early February
  - Madeline requesting more complete version with guide and summary
  - Nicole working on guide as starting point
- **Website tracking correction**
  - Markdown requests were 8x inflated (30k+ daily → ~4k daily)
  - Affects onboarding flow accuracy and AI agent documentation

#### AI Agent Onboarding Research

- **Victor's agentic onboarding initiative**
  - Focus on pure CLI usage (no NCP tools, console)
  - Testing if AI can handle NX init and full onboarding
  - Comparing Netlify vs TurboRepo capabilities
  - Jack to research and collect data on agent limitations
- **Potential LM-only content capability**
  - Could add AI-specific instructions to docs pages
  - Emphasize critical setup steps like remote cache via Cloud
  - Not implementing yet, needs content strategy clarity

[Granola transcript](https://notes.granola.ai/t/35fb513b-fdfd-421a-b1b2-22d9f1f218de-00demib2)

