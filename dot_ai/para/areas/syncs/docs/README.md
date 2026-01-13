# Docs Sync Tracker

Tracking document for Documentation team sync meetings.

## Topics for Next Meeting

- Review Caleb's updated POC (after Victor feedback incorporated)
- Final structure decision (target: January 30th)
- Netlify serverless function investigation results
- What do we want to do about reviewing previews?

## Action Items

- [ ] Jack: Talk to Victor about Netlify analytics and unknown serverless functions
- [ ] Jack: Send Google Analytics insights notes to Caleb via Slack
- [ ] Jack: Follow up with Nicole on changelog platform integration timeline
- [ ] Jack: Discuss with Joe about DPE discoverability - explore Salesforce automation with Cory for customer bug fix notifications
- [ ] Caleb: Continue POC development incorporating Victor's feedback
- [ ] Caleb: Deliver updated POC version for second review round
- [ ] Team: Decide on final structure by January 30th

---

## Meeting Notes

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

