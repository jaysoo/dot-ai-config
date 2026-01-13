# Framer Sync Tracker

Tracking document for Framer team sync meetings.

## Topics for Next Meeting

- Events calendar page structure (Caitlin + Philip collaboration)
- Google Analytics migration - selective custom events
- Blog migration planning

## Action Items

### Jack
- Merge color matching PR today/tomorrow

### Philip
- Set up Netlify/Vercel access (Ben added to NX docs project with developer role)

### Caitlin
- Email Anna about merch store package options
- Collaborate with Philip on events calendar structure

### Ben
- Continue page development
- Investigate canonical URL setup for staging domains

### Target
- Enable first Framer pages end of January

---

## Meeting Notes

### 2026-01-13

**Attendees:** Benjamin Cabanes, Caitlin Cashin, Heidi Grutter, Juri Strumpflohner, Philip Fulcher

**Banner System Update:**
- Framework banner system fully operational
- Single banner support only - change date to extend/disable
- UTC timezone - convert to Eastern (currently UTC-5)
- Process: Update CMS → Publish → Redeploy master branch on Netlify/Vercel
- Preview available in Framer workspace before publishing
- Philip needs access to Netlify and Vercel (Ben added to NX docs project with developer role, Vercel via service account)

**Framer Migration Progress:**
- Ben completed mobile/tablet responsiveness for multiple pages:
  - Company, community, contact, security, Robot Cache pages
  - Solutions pages: engineering, management, platform, leadership
  - Resource page converted to CMS with filtering functionality
- New animations in development:
  - Dark mode transitions
  - Multiple PR workflow visualization for CI productivity
- Merch store now live (password-protected)
  - Fourth Wall integration via Upmerch
  - Free ordering for champions/sales team
  - Considering promo codes vs password protection
- Color matching PR ready to merge
  - Enables incremental page enablement on production
  - Low risk deployment to unblock framework rollout

**Upcoming Changes & Decisions:**
- No webinar scheduled for January
- Events calendar page discussion:
  - Combine with webinars page showing conferences/sponsorships
  - Similar to Gradle/DevOps Days format
- Google Analytics migration strategy:
  - Selective porting of custom events only
  - Framer provides native A/B testing capabilities
  - Focus on actionable metrics vs historical data
- SEO considerations for staging domains:
  - Canonical URLs needed to prevent duplicate indexing
  - Robots.txt requirements for Google indexing

**Transcript:** [Granola Notes](https://notes.granola.ai/t/b77f6d98-b4ca-4fe5-8537-2e2da7bec5b5-00demib2)

---

### 2025-12-16

**Decisions:**
1. Which page for canary this week? → **/community**
2. Banner JSON → let's do this week on canary
3. Pricing and Cloud pages
   - TBD (deadline Friday for exec team for outline of pages to review next week)
   - Sync first week in January
4. Blog?
   - GitHub sync should work for local author with AI assistance
   - Q: custom components? We can probably migrate them in one form or another
     - Embeds like videos and tweets
     - Code blocks, especially with highlighting and diffs
     - Could have a plugin between authored and rendered content
   - We should be putting more CTAs at the end of blogs, we can do this in Framer for sure
