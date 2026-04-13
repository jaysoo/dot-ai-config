# Montreal Day 2 Morning Session (Engineering)

---

# SPACE Metrics — How We're Doing

---

## Throughput

2,215 PRs in Q1 2026 vs 1,475 in Q1 2025

**50% YoY increase**

---

## Planning Accuracy Q1 2026

| Team       | Actual | Planned |
|------------|--------|---------|
| Orca       | 60.2%  | 75%     |
| Kraken     | 50%    | 75%     |
| Red Panda  | 88.8%  | 80%     |
| Dolphin    | 70.3%  | 50%     |
| Quokka     | 93.2%  | 75%     |

---

## Median PR Cycle Time Q1 2026

| Repo                 | Cycle Time |
|----------------------|------------|
| nx                   | 6.5h       |
| ocean                | 3.3h       |
| nx-console           | 2.1h       |
| cloud-infrastructure | 0.1h       |

---

## MTTR for P0/P1 Issues Q1 2026

| Team      | MTTR    |
|-----------|---------|
| Orca      | 6.4d    |
| Kraken    | 0.1d    |
| Dolphin   | 5.1d    |
| Quokka    | 2.5d    |
| Red Panda | 285.1d* |

---

## Satisfaction

- Autonomy and learning/growth: **4.3/5** avg
- Sustainability: **3.4/5**
- Recognition: **3.5/5**
- Common theme: priorities need to be clearer

---

## Survey Theme 1: Sustainability

It's about focus, not hours.

> "Clearer understanding of priorities"

> "The chance for more focused work, with less urgent interruptions"

> "No back-channel work assignment, no 'high priority' declaration without technical insight"

Stakeholders see the same thing:

> "Eng typically has priority shifts that cause the feeling of over-promise and under-deliver."

---

## Survey Theme 2: Visibility

People don't always know what we're working on or why.

Engineers:
> "Understanding longer-term goals for the team"

> "More predictable priorities in terms of our release plan and/or roadmap"

Stakeholders (3.6/5 avg on "I understand what eng is working on"):
> "We should have a list of requested features with notes on expected impact, and some cadence where this list is reviewed and prioritized."

---

## Survey Theme 3: Recognition

3.5/5 average — but bimodal. Several 5s, also scores of 1 and 2.

> "Better people-management skills for team leads / proper managers would help me feel more seen and appreciated."

Not a company-wide problem — some people feel very recognized, others feel invisible.

---

## Survey Theme 4: Tie Work to Revenue

> "As a company we need to do a better job of tying our product roadmap to additional revenue."

> "Customer validation before development of a feature and goals set for each feature before release."

> "It feels extremely difficult to get customer issues solved. If an issue isn't urgent or blocking, the chance of it getting resolved while the problem is still relevant to the customer is very low."

---

## The Through-Line

We've built the engine. Throughput is up 50%.

But we're spreading that energy too thin, priorities are unclear, and stakeholders can't always see the connection between what we build and what drives the business.

**The rest of today: not working harder — focusing sharper, and using AI to handle the rest.**

---

# What We Shipped

---

## What We Shipped (1/3)

- **TUI and continuous tasks** — launch + many fixes/enhancements
- **Self-Healing CI** — ClickUp, Mailchimp, Cloudinary, Mimecast, and more
- **Task Sandboxing** — Legora, ClickUp, Island, Wix
- **Cloud onboarding improvements** — streamlined VCS connection, one-page flow, template-based flow, `nx-cloud onboard`

---

## What We Shipped (2/3)

- **Agentic Experience (AX)** — llms.txt, llms-full.txt, `.md` URLs + auto-markdown response for AI agents, agent-friendly `init` and CNW with no-interactivity and NDJSON format
- **NPM read-through cache, Docker Hub mirror, Docker layer cache**
- **Framer, Astro docs, new blog**
- **More analytics/telemetry** — CLI telemetry, PostHog, Netlify server events

---

## What We Shipped (3/3)

- **Ecosystem** — Node 24, Vite 8, Vitest 4, Prettier 3, ESLint 10, Storybook 10, Next.js 16, Cypress 15, new .NET and Maven plugins
- **Lighthouse**
- And more!

---

# How We Work — Refocusing for 2026

---

## 2025 → 2026

2025 was about building the engine.
2026 is about pointing it at the right things.

- Productivity is up — 50% more PRs YoY, better tooling, faster cycles
- Now: each team focuses on **1–2 projects at a time**
- Depth over breadth — no more spreading thin across 5 initiatives

---

## Project Visibility

- Every active project updated at least once a week in Linear
- Not a ceremony — just a short status
- Jeff should be able to open a short list of active projects and find all the details he needs
- If he can't, we've failed at visibility
- **The fix for the "transparency gap" — not more meetings, just better project hygiene**

---

## Proposals and Planning

- Proposals are projects in backlog
- Planning meetings every two months to accept projects
- If projects/milestones run over planned time → carry over or cancel (Shape Up)
- Trim scope aggressively so projects/milestones have an end date

---

## Shipping ≠ Success

Features that launch without adoption are failures.

Stop thinking "we built it, now marketing sells it."

---

## Planned Work Should Have Three Things

1. **A funnel stage**
   Which of Acquisition / Activation / Adoption / Conversion does this serve?

2. **A success metric**
   Not "we shipped it" but "conversion increased X%"

3. **A measurement plan**
   Do the signals exist today, or do we need to build them?

---

## Unplanned Work

- Must be tracked in Linear, not just Slack threads
- Each team's budget accounts for a % of unplanned work — reviewed periodically
- P0: resolved ASAP (drop everything and fix now)
- P1: resolved in 7 days (14 days for CLI)

---

# PLG Funnel and Signals

---

## Acquisition

Workspace is claimed in Cloud

- Increase "yes" to Cloud prompt, reduce error rate during CNW/init
- Reduce drop-off during Cloud onboarding
- One-page onboarding in 20 seconds

---

## Activation

20+ successful CIPE runs

- Reduce time to first "aha" moment
- Feature demos — "here's what your CI would look like"

---

## Adoption

Would they notice if the product disappeared?

- Second team member invited to workspace
- Self-healing fixes applied, not just generated
- Growing number of CIPE runs

---

## Conversion

They pay.

- Hit credit limit → upgrade plan
- Enterprise feature adoption (self-healing, SCIM, private links, npm/docker read-through)
- Growing billing as usage grows
- Self-serve upgrades

---

# AI Workflow Demos

Handling the tedious work so we can stay focused.

---

## Demo 1: Sandbox Workflow on Mac

Jon

---

## Demo 2: Mac Mini Agents for Maintenance

James

---

# Group Discussion

---

## How This Works

1. Leads present 4–5 candidate topics
   (from pre-submitted questions + what we know needs discussion)

2. Leads choose 2–3 for this session

3. Self-select into groups by topic

4. Each group has a lead and a scribe

---

## Each Group Works Toward

1. What's the actual problem? (Be specific.)
2. What are the options?
3. What does this group recommend?

---

## Reconvene

Each group presents their recommendation (4–5 min each)

Jeff/Victor respond:
- "Yes — here's who owns it and by when."
- "Not yet — we need [X] first, answer by [date]."
- "No — here's why."

All commitments: **owner + date**. Photographed. Sent out tomorrow.

---

# Afternoon

---

## Afternoon (Jack + leads in sales/marketing session)

Engineers can:

- **Continue morning discussion topics** — go deeper on anything that needs more time
- **Automation audit + hackathon** — list tedious/repetitive tasks, cluster them, form teams, build PoCs

Anything needing leadership input must be resolved in the morning.
