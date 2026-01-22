# Docs Sync Tracker

Tracking document for Documentation team sync meetings.

## Topics for Next Meeting

- Friday alignment meeting before Tuesday final review
- Review Caleb's advanced section and technology splits
- Final structure decision (target: January 30th)
- Linking to specific options within pages (Column's concern)

## Action Items

- [ ] Caleb: Finish advanced section and technology splits (Wednesday afternoon)
- [ ] Jack: Review branch after Caleb pushes updates
- [ ] Jack: Deploy custom header by Friday
- [ ] Ben: Complete docs URL tracking for GA (today/tomorrow)
- [ ] Team: Schedule Friday alignment meeting

---

## Meeting Notes

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

