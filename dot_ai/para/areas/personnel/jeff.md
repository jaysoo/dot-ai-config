# Jeff

**Team:** Leadership
**Role:** Manages Jack (Nx Cloud / org leadership)
**Email:** jeff@nrwl.io

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

- **Current Focus:** Enterprise plan (with Joe), Polygraph messaging/positioning, SEO/docs, re-engaging in hands-on engineering
- **Goals:**
- **Strengths:**

## Kudos

<!-- Value-aligned recognition. Format: date | value | what they did -->
<!-- Values: Camaraderie, Truth over Comfort, Tackling Impossible Problems, Highly Aligned Efforts, Powerful & Easy Product -->

## Upcoming Sync

<!-- Ad-hoc pre-meeting items go here -->

## 1:1 Notes

### 2026-07-23 - Weekly catch up

Transcript: https://notes.granola.ai/t/d9df1624-40dd-4aa5-8fa5-f277695c568e-00demib2

**Churn analysis and retention**

- Churn pattern: most churners are 1-3 billing cycles old, not long-term users. Activation failure = primary driver.
  - Priority: build churn-risk signals + automated email alerts by early next week.
  - Secondary: speed up onboarding for slow-to-activate users.
- QA Wolf case study: $2,700 last invoice, remote cache only, 2-4 min pipelines. Likely moved to Turbo or similar, not straight to GitHub Actions. Signals remote-cache-only pricing too expensive for value delivered.
- Pricing lever on the table but needs strong conviction first.
  - Execution credits = single largest cloud revenue driver.
  - No VC cushion this time -> any pricing drop needs clear recovery data.
  - Hypothesis: cheaper caching keeps users in system longer, unlocks agents + higher-value plans.
  - Goal: build cost-per-minute comparison showing platform value vs alternatives.
- Jeff: same dynamic in enterprise - seat pricing blocks in-account expansion.
  - Capital One: many Nx users, only one team can afford enterprise.
  - ADP + Fidelity at risk as IT consolidation reviews underway.
  - Jeff wants to shift toward site licenses, away from traditional upsell pressure.

**CLI performance report + product tracking**

- Nx 23.1 CLI perf report launched: shows estimated time saved at end of task runs, links to docs. Outperformed newsletter engagement.
  - Adding CLI-to-site referral tracking as scorecard item.
  - Attribution to cloud onboarding harder, esp. with EU data restrictions.
- Data visibility push: Jeff wants PostHog funnels for all products. Particularly blind on Polygon drop-offs.
  - Jeff missed the funnel review call with [[james]] + [[mark]] this morning.
  - Feedback: requests too vague; wants to align on funnel-first approach.
- Nx Agent migration onboarding prompt underperforming. "Migrate to Nx Agent" framing too tedious - lead with value ("Save on Cost"). Some tracking broken, not caught early.
- Recommendation: automated daily dashboards (e.g. via Codex) for key metrics - alerts on threshold drops, security scans, CD downloads. Jeff asked for link to current dashboard.

**Security checks + Zach PIP**

- Monthly security attestation running; people aware + compliant.
  - [[jason]] caught a sandbox violation in a skill he built, fixed it.
  - Process ~1-20 min; Jack runs on daily schedule.
  - Jeff bookmarked the security check page; Jack to send checklist + form on Slack.
- Jeff asked [[joe]] to put Zach on a PIP.
  - MailChimp canceled renewal; never fully adopted platform.
  - ADP: expansion opportunities not pursued.
  - Capital One: Zach ran unprepared call with key IT decision-maker, no invite to Jeff or [[victor]], despite two weeks notice.
- Sandbox violations review: [[rares]] leaving for vacation around Aug 4. Jeff plans to be hands-on tomorrow to review. Value in having someone unfamiliar test the feature to surface confusion.

**Action items**

- Jack: finalize churn-risk signals + email alert setup with [[joe]] (eng work to track signals + trigger emails; target early next week).
- Jack: send Jeff security checklist + form link on Slack (Jeff wants to run monthly).
- Jack: send Jeff the metrics dashboard link (for CLI referrals + product health).
- Jeff: catch up on PostHog funnels meeting with [[james]] + [[mark]] (missed this morning; align company on funnel-based tracking).

### 2026-07-14 - Weekly catch up

Transcript: https://notes.granola.ai/t/ad07f6ee-ee0d-4798-aa64-88932cb158da-00demib2

**Team and org**

- [[cory]] leaving: gave notice yesterday, 2-3 weeks left. Going back to his old boss. Main gap = Sigma + Fivetran knowledge, no clear successor. Jeff to get more familiar; wants another engineer to co-own maintenance. Sales tooling stable; new integrations / Salesforce changes contracted out.
- [[altan]] to lead all of Cloud, with [[nicole]] reporting to him. Altan seen as more product-minded + data-driven. Nicole's IC day-to-day largely unchanged, less business/product ownership. Jeff to tell both Friday, alongside Altan's L6 promotion.
- Promotions: [[max]] + Altan obvious; [[leo]] (CLA team) also on list for L5. Jeff wants to do them now; Jack prefers waiting for perf cycle (due Jul 31) to avoid confusion. Nominations going out next week.

**Jeff's engineering re-engagement**

- Wants hands-on engineering (not just vibe coding) to experience the dev workflow firsthand and speak more credibly about products, esp. Polygraph.
- Three efforts:
  1. Add Oxlint format as option alongside Prettier; Biome also requested.
  2. Port module boundary rule to work with Oxlint.
  3. [[victor]] + [[juri]] have a labs prototype (Remix migration) needing a proper owner.
- Jack to send Cloud local setup instructions + create a Notion page summarizing all three. Snapshot env easiest (one command, no IP whitelisting); staging needs Mongo IP whitelist.

**SEO and docs**

- Search impressions healthy but clicks trending down - content may not match search intent.
- Quick wins made: monorepo pages updated to cover JS as well as TS (JS monorepo was a gap).
- Open question: identify queries Nx *should* rank for but doesn't appear on at all.
- Ahrefs account exists but unpaid; crawls fail once credits run out. Jeff to upgrade + pay, look into ranking issues.
- Joe has an LLM-performance tool worth exploring alongside search console data.
- Competitor pages launched to control narrative in search results.

**Polygraph messaging / enterprise**

- Docs don't surface key Polygraph workflows (PR review, post-merge forensics).
- Need a single sharp hook, like Blacksmith's "use GitHub Runners? Switch in one line".
- Untested angle: Polygraph reduces AI token usage via better context (fewer redundant lookups) - relevant to enterprise token-cost focus.
- Jeff + Joe working on enterprise plan today; security angle + multi-repo connectivity are the main enterprise draws.

**Action items**

- Jack: send Jeff Cloud local setup instructions (snapshot vs staging + Mongo IP whitelisting).
- Jack: create Notion page summarizing Jeff's three engineering efforts (Oxlint/Biome formatting, Remix migration, sandbox violations).
- Jack: check with [[ben]] on Remix -> React Router 7 migration status - is it still available for Jeff to pick up.
- Jack: send Jeff Neovim config + plugin list.
- Jeff: upgrade Ahrefs + investigate ranking gaps.
- Jeff: talk to Altan about Cloud leadership change before announcing Friday.

## Random Notes

<!-- Miscellaneous things to remember -->
