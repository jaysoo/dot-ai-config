# Marketing Sync Tracker

Tracking document for Marketing team sync meetings (includes Framer website work).

## Upcoming Sync

*(Cleared after 2026-02-03 sync)*

---

## Meeting Notes

### 2026-02-03

**Attendees:** Benjamin Cabanes, Caitlin Cashin, Heidi Grutter, Juri Strumpflohner, Philip Fulcher, Caleb Ukle, Nicole Oliver

#### Homepage & Cloud Page Launch

- Next.js version ready to deploy with language updates
  - Ben's PR contains additive content changes
  - Can launch this week as foundation
- Framer version nearly complete
  - Ben needs to add GA tracking and fix links
  - Video placement decision deferred to Framer iteration
  - Target: Friday launch for Framer homepage
- Themes accidentally deployed during NX patch release
  - Marketing pages auto-deploy with NX releases
  - Issue resolved, themes now live

#### Framer Development & Tooling

- Component system and plugin ready for landing pages
  - Copy/paste between projects works for quick builds
  - Plugin maintains component updates, manual copy doesn't
  - A/B testing functionality available with paid workspace
- Upcoming ad campaign landing page
  - Can build in Framer immediately, doesn't require full site migration
  - Need path rewrite setup for nx.dev domain deployment
  - 30-minute training session planned for Caitlin/Heidi
- Blog migration deferred, courses to remain static
  - Case studies moving to Framer
  - Resources page contains only external links

#### Product & Pricing Updates

- IO tracing feature top engineering priority
  - Name debate: "sandboxing" vs "IO tracing"
  - Marketing meeting with Alton/Madeline/Victor tomorrow
  - Technical difference: allows access but flags issues vs true sandboxing
- Pricing strategy discussion ongoing
  - Jeff and Madeline owning pricing decisions
  - Go-to-market team meeting today
  - Cards implementation approved for pricing page
- Free feature monetization review needed
  - Multiple features currently given away free
  - Victor wants to avoid losses on compute/disk usage
  - Enterprise compute charging conversation separate

#### Action Items

- **Jack:** Set up path rewrites for campaign landing page deployment
- **Ben:** Complete GA tracking and links for Framer homepage by Friday
- **Caitlin:** Schedule 30-minute Framer training with Ben
- **Marketing team:** Finalize pricing content and IO tracing naming decision

**Transcript:** [Granola Notes](https://notes.granola.ai/t/88dab14c-dba5-493e-8326-fe9b713a3ab9-00demib2)

---

### 2026-01-27

**Attendees:** Benjamin Cabanes, Caitlin Cashin, Heidi Grutter, Juri Strumpflohner, Philip Fulcher, Nicole Oliver

#### Framer Migration Analytics & Metrics

- Google Analytics baseline established for 30 days (~44k pageviews, normally 55k)
- Tracking scroll depth and page views for key pages:
  1. Landing page
  2. Nx Cloud
  3. AI page
  4. Enterprise
  5. Contact Sales
- Scroll depth very low on homepage (<10% reach bottom)
  - Will filter out users who don't scroll at all to focus on engaged users
  - Metric helps inform content placement and CTA positioning
  - Not using as success metric for Framer migration
- Two distinct user flows identified:
  - Marketing page users: bounce between Cloud, pricing, company, contact pages
  - Documentation users: go straight to docs, don't convert on marketing pages
- Plan to track both GA and Framer analytics for comparison

#### Framer Page Development Progress

- Ben showed draft pages: homepage, enterprise, Nx Cloud, partners
- Homepage updates:
  - Feature category links at top as scroll anchors
  - YouTube video stays (needs year update 2025→2026)
  - Marketing team working on new product demo video replacement
  - Added customer/OSS project logos in community section
- Four pages target: homepage, enterprise, contact sales, cloud (minus AI)
  - AI content moving to homepage and cloud page instead of separate page
  - React/Java/Angular tech pages need decision on Framer vs docs placement
- Production ready target: end of next week
- Heidi more available starting tomorrow after board meeting prep wraps

#### Product & Marketing Alignment

- Java/.NET strategy proceeding without gating marketing efforts
- Upcoming engineering features needing launch plans:
  - Sandboxing (IO tracing) - Alton scheduling discussion next week
  - Time to Green visualization refresh (February)
  - Workspace analytics reorganization
  - Cross-repo dependency detection
- Current messaging outdated (still emphasizing caching vs platform features)
- Plan: Get Framer migration baseline, then test messaging overhaul
- Need to surface value messaging throughout Cloud UI to help users understand benefits

#### Pricing & Go-to-Market Strategy

- No clear owner identified for pricing strategy
- Discussion needed between Jeff, Madeline, Nicole on:
  - Feature tier differentiation
  - Hobby → Teams → Enterprise funnel optimization
  - Balance between enterprise focus vs hobby/team plan features
- Teams billing flow enhancement requested for February
  - Direct credit card entry when clicking Teams plan
  - Ben and Nicole to discuss implementation approach
- Nicole to raise pricing ownership and strategy in go-to-market meeting

**Transcript:** [Granola Notes](https://notes.granola.ai/t/c1b848a9-021b-48b4-89f4-861191247e02-00demib2)

---

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
