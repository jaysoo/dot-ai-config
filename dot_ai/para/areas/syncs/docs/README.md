# Docs Sync Tracker

Tracking document for Documentation team sync meetings.

## Topics for Next Meeting

- Review Caleb's initial sidebar structure
- Technology hub page template design
- Canary deployment planning
- API docs placement in References section

## Upcoming Sync

(Notes accumulated between meetings go here)

## Action Items

- [ ] Caleb: Create basic sidebar structure by end of week (content lift first)
- [ ] Caleb: Create follow-up tasks for hub page templates and content editing
- [ ] Jack: Collaborate on structure once initial version complete
- [x] Team: Align on IA principles (progressive disclosure, type-based navigation)

---

## Meeting Notes

### 2026-01-28 - Caleb Ukle, Philip Fulcher

**Documentation Restructure Principles:**
- Progressive disclosure framework - prioritize immediate needs vs future information
- Type-based navigation following Vercel/Shopify model
  - Guides vs reference materials clearly separated
  - Universal features (CI, orchestration) vs technology-specific content
- Five core principles finalized:
  1. Progressive disclosure for getting started content
  2. Core concepts section (intentionally dry theory - Project Graph, tasks)
  3. Universal vs specific categorization
  4. Technology hub approach with overview pages
  5. Knowledge base for specific recipes/solutions

**Proposed Site Structure:**
- Getting Started section remains unchanged
- How Nx Works/Core Concepts for foundational theory
- Features/Capabilities section for universal tools
  - CI orchestration, release management, affected commands
  - Technology-agnostic functionality everyone uses
- Technology Hub with comprehensive overview pages
  - Single hub page per technology (React, Angular, etc.)
  - Maximum 5 sub-pages for critical topics
  - Community plugins integrated into main technology index
- Knowledge Base replaces current scattered recipe/troubleshooting content
  - Low-friction dumping ground for specific solutions
  - Proper tagging system for discoverability

**Analytics Insights:**
- Code generation remains top traffic driver despite AI assumptions
- Current feature pages buried - CI/remote cache getting minimal views
- "Maintaining TypeScript monorepos" (page 10) shows high engagement
- Most feature traffic has low entrance rates - users arrive via other docs pages
- Pages under 5,000 views over 90 days likely not worth prominent placement

**Next Steps:**
- Caleb to create basic sidebar structure by end of week
  - Content lift first, cleanup iterations follow
  - Create separate tasks for follow-up work (hub page templates, content editing)
- Technology pages need standardized structure across all frameworks
- Move API docs back into References section
- Plan Canary deployment once structure makes logical sense
- Jack available for collaboration once initial structure complete

[Granola notes](https://notes.granola.ai/t/6413f843-1471-411c-a267-5e5de56a8f68-00demib2)

### 2026-01-21 - Caleb Ukle, Philip Fulcher

**Documentation Platform Updates:**
- Analytics tracking for AI-focused content in progress
  - Ben assigned to track docs URLs not hitting GA
  - Specifically LLMs.txt and .md files for AI consumption
  - Caleb confirmed improved AI comprehension when using .md URLs
- Custom header deployment targeted for Friday
- Astro Starlight styling investigation
  - Medium priority, due January 30th
  - Similar to existing custom styling approach

**Sidebar Restructuring Progress:**
- Caleb posted second Loom video Friday with iteration updates
- Key changes planned:
  - Move DevKit into "Extend Nx" section (no standalone top-level)
  - Technology pages as card links instead of dropdown menus
  - Click Angular → see generators, executors, migrators as cards
  - API references linked at bottom of overview pages
- Rationale: Reduces sidebar clutter, focuses on problem-solving workflow
- Column raised issue about linking to specific options within pages
- Friday sync scheduled to review progress before Tuesday meeting

[Granola notes](https://notes.granola.ai/t/b45d3b87-86b5-445b-8b0c-c3d1445804b7-00demib2)

### 2026-01-08 - Caleb Ukle, Philip Fulcher

**Current Issues Review:**
- Issues backlog status review completed
- LM TXT and markdown AI agent parsing deferred until after docs reorg
- Diversell POC in progress - needs testing on Netlify preview deployment
- Top layer caching waiting on ClickUp test results this week
- Version docs parked until January 30th (must complete before April)

**Netlify Analytics Discovery:**
- 11k serverless function requests in December (source unknown)
- Real-time user monitoring available but requires Victor approval ($9/month)
- Need Victor to investigate unknown function usage

**Google Analytics Insights:**
- Getting Started section: Most engaging content with lowest bounce rate, most views after Technologies section - should be primary focus for reorg
- Feature pages: Comparable traffic to Technologies but drastically lower than Getting Started; higher engagement due to NX CLI integration and video content; location issue - many are guides rather than true features (e.g., TypeScript monorepo)
- High bounce rate patterns: All deprecated pages show high bounce rates; Enhanced AI page unfocused with too much information; consider removing unused pages entirely

**Docs Reorg Next Steps:**
- Track important pages before/after reorg: Module Federation overview, TypeScript/Angular/React/Node Express overviews, all Getting Started and Feature pages, CLI and environment variables references (users report difficulty finding these)
- POC updates: URLs remain unchanged for now to enable easy GA comparison; target January 30th for review completion; structure focuses on learning timescales (5 minutes, 1 week, 1 month+)
- Implementation approach: Sidebar mapping changes only initially; URL restructuring after structure agreement; focus on flawless first 5-10 minute user experience

[Granola notes](https://notes.granola.ai/t/82ef7eda-e29b-415c-884c-7647c690e909-00demib2)

