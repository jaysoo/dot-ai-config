# Montreal Day 2 Morning Session (Engineering)

Agenda:

- How we're doing (5 mins)
- What we shipped (5 mins)
- How we work (10 mins)
- AI demos (30 mins)
- Questionnaire responses, discussion with leadership
- Group discussion on one topic (60 mins)

Note: Many tie-ins with PLG

## SPACE Metrics — How We're Doing

We're healthy, but can do better in the **satisfaction** dimension.

Throughput (Activity):

- 2,215 PRs in Q1 2026 vs 1,475 in Q1 2025
- **50% YoY increase**

Planning Accuracy Q1 2026 (Performance)

| Team      | Actual | Planned |
| --------- | ------ | ------- |
| Orca      | 60.2%  | 75%     |
| Kraken    | 50%    | 75%     |
| Red Panda | 88.8%  | 80%     |
| Dolphin   | 70.3%  | 50%     |
| Quokka    | 93.2%  | 75%     |

Median PR Cycle Time Q1 2026 (Collaboration & Efficiency)

| Repo                 | Cycle Time |
| -------------------- | ---------- |
| nx                   | 6.5h       |
| ocean                | 3.3h       |
| nx-console           | 2.1h       |
| cloud-infrastructure | 0.1h       |

MTTR for P0/P1 Issues Q1 2026 (Collaboration & Efficiency)

| Team      | MTTR     |
| --------- | -------- |
| Orca      | 6.4d     |
| Kraken    | 0.1d     |
| Dolphin   | 5.1d     |
| Quokka    | 2.5d     |
| Red Panda | 285.1d\* |

Satisfaction:

- Autonomy/growth 4.3/5
- Sustainability 3.4/5
- Recognition 3.5/5

### \_S_PACE - What the Surveys Are Telling Us

Sustainability - work smart, not hard.

- "Clearer understanding of priorities"
- "More focused work, less urgent interruptions"
- "Priority shifts cause the feeling of over-promise and under-deliver"

Visibility — people don't know what we're working on or why.

- "Understanding longer-term goals for the team"
- "A list of features with expected impact, reviewed on a cadence"

Recognition — 3.5/5 avg but bimodal (5s and 1s).

- "Better people-management from leads would help me feel more seen"

Stakeholders want work tied to revenue.

- "Customer validation before development"
- "Non-urgent customer issues rarely get resolved"

**Takeaway:**

- We've built the engine. Throughput is up 50% YoY.
- **But** we're spreading that energy too thin, priorities are unclear, and it's hard to tie work into revenue.
- We need **sharper focus** not more hours.
- From yesterday: "Teams are working separately rather than together" ~Jeff

## What We Shipped 🚀

- TUI and continuous tasks — launch + many fixes/enhancements
- Self-Healing CI — ClickUp, Mailchimp, Cloudinary, Mimecast, and more
- Task Sandboxing — Legora, ClickUp, Island, Wix
- Cloud onboarding — streamlined VCS, one-page flow, template-based flow, `nx-cloud onboard`
- Agentic Experience (AX) — llms.txt, llms-full.txt, `.md` URLs, agent-friendly `init`/CNW
- NPM read-through cache, Docker Hub mirror, Docker layer cache
- Framer, Astro docs, new blog
- Analytics/telemetry — CLI telemetry, PostHog, Netlify server events
- Ecosystem — Node 24, Vite 8, Vitest 4, Prettier 3, ESLint 10, Storybook 10, Next.js 16,
  Cypress 15, .NET and Maven plugins
- Lighthouse
- And more!

## What We Shipped 🚀 (Cont)

- TUI and continuous tasks — launch + many fixes/enhancements
- Self-Healing CI — ClickUp, Mailchimp, Cloudinary, Mimecast, and more
- Task Sandboxing — Legora, ClickUp, Island, Wix
- Cloud onboarding — streamlined VCS, one-page flow, template-based flow, `nx-cloud onboard`
- Agentic Experience (AX) — llms.txt, llms-full.txt, `.md` URLs, agent-friendly `init`/CNW
- NPM read-through cache, Docker Hub mirror, Docker layer cache
- Framer, Astro docs, new blog
- Analytics/telemetry — CLI telemetry, PostHog, Netlify server events
- Ecosystem — Node 24, Vite 8, Vitest 4, Prettier 3, ESLint 10, Storybook 10, Next.js 16,
  Cypress 15, .NET and Maven plugins
- Lighthouse
- And more!

Question #1: Which of these tie to a stage in PLG funnel?

1. Acquisition
2. Activation
3. Adoption
4. Conversion

Question #2: How do you know if/when a feature is successful?

We need an **engineering shift** to align with PLG.

## How We Work

We've built the engine. 2026 points it at the right things.

- Each team focuses on **1–2 projects** at a time. Depth over breadth.
- Active projects updated at least once a week in Linear.
  - Jeff should be able to open a short list and find everything without asking on Slack.
- Proposals are projects in backlog. Planning every two months to accept a limited number of them.
- Projects that run over -> carry over or cancel (Shape Up). Trim scope aggressively.

### Shipping != Success

- Features that launch without adoption are **failures**.
- **Stop** thinking "we built it, now marketing sells it".

### Planned Work Needs Three Things

1. A funnel stage (Acquisition / Activation / Adoption / Conversion).
2. A success metric - Not "we shipped it" but "600 claimed workspaces a week for Cloud"
   or "100 nx init with Cloud each week".
3. A measurement plan - Do the signals exist, or do we need to build them?.

Project have micro metrics that tie into the macro business goals.
We'll review them during all-hands meetings.

### Engineering Shfit: The Modern Engineer

You don't just ship code, you ship sensors (aka machines + gauges).
A great feature without signal means we're flyning blind.

Instead of "what can we build" it is "what behavior are we trying to drive"?

- Not when the feature is merged, or when it is deployed/published but...
- When the user **does the thing** we wanted them to.

**No signl, no launch**

Values & Standards: https://www.notion.so/nxnrwl/Nx-Manifesto-31c69f3c238780728852d7f1b8a3e54d
  - Give kudos to colleagues who did something worthy of note.

### Projects -> PLG Funnel Stage

These are the entry signals for Cloud (Quork-A):

Acquisition - workspace claimed in Cloud

- Increase "yes" to Cloud prompt, reduce CNW/init errors, one-page onboarding in 20s

Activation - 20+ successful CIPE runs

- Reduce time to first "aha" moment, feature demos

Adoption - would they notice if the product disappeared?

- Second team member invited, self-healing fixes applied, growing CIPE runs

Conversion - they pay

- Credit limit -> upgrade, growing billing, self-serve upgrades, enterprise features
  e.g. self-healing, SCIM, private links, npm/docker read-through

Question: What are the signals for CLI, for Polygraph?

### Unplanned Work Happens, But Should Not Slow Us Down (Too Much)

- Unplanned work is tracked in Linear, not Slack. Each team budgets a % for unplanned.
- Need to know how much time spent on planned vs unplanned so we know if there's a problem.
  Without data, we're flying blind.
- Reminder: P0 = drop everything. P1 = 7 days (14 for CLI).

What about capacity? "We have too much to do!"

## AI Workflow Demos

Leverage tools and workflows to handle the tedious work
so we can stay focused on 1–2 important things.

- Jon — Sandbox workflow on Mac
- James — Pi agents for maintenance tasks
- Juri - Agent factory


## Questionnaire Responses

Strategic clarity / prioritization (4 mentions):

- "Some decisions feel like they were made too hastily because we often lack wider context"
- "How do we decide that something is important to build? Why was self-healing CI, sandboxing, and now polygraph chosen?"
- "What signals do you use to prioritize what to work on"
- "Some folks have struggled with the strategic shifts in direction... do you foresee us getting to a place where 
  we can plan a year or more out?"

PLG direction — is this durable, and what does it mean for us? (4 mentions):

- "How can I be sure the recent shift to PLG is for good and we won't reactively shift back to enterprise focus in 6 months?"
- "Will the target audience shift from large enterprise clients to smaller business customers? What shifts to pricing?"
- "How PLG translates into our roadmap and what we prioritize as features"
- "There are 0 users of nx cloud that don't also use Nx. If we convert at a higher rate but kill net new Nx adoption, 
  we've traded long-term for short-term."

Community and PLG:

- "How do we manage community wants vs PLG? vite+ and the ox stack — building them out won't equal ARR but community 
  wants it. Losing the perception of 'if you use nx, you're doing things the modern way' is a risk."*

Split focus / competing priorities (4 mentions):

- "Getting pulled in a lot of different directions / competing priorities"
- "Split focus — linear issues vs support queue vs gh issues vs effort work... operating in high-priority-only stance 
  that feels unsustainable"
- "Cooldown was supposed to be for burning through GH issues but we can't use it that way"
- "Split in focus between different areas of responsibility and a lack of AI automations for maintenance"

Shipping quality vs. velocity (2 mentions):

- "Shipping half-baked solutions and testing features on enterprise workspaces"
- "More efforts to improve existing features rather than always building new ones... improve stability in Nx, make graph
  calculation faster, reduce the need to run nx reset"

Infrastructure / dev experience pain:

- "CI being slow and unreliable is hurting the CLI team's work"
- "Security incidents (supply chain attacks) have become a consistent disruption"

Process gaps — what does "done" mean?:

- "Streamlining the processes where teams integrate with each other. What should be part of shipping a feature? 
  Documentation, blog drafts, release excerpts..."
- "Lack of change log / feature discovery / usage tracking for nx cloud features"
- "As a DPE there's a lot of work to onboard customers and no great way to distill that understanding into functionality"

Product org / team structure:

- "How will we organize the split between polygraph and nx/cloud within the product org long term? Team cohesion and 
  potential tension when priorities conflict"

ICs and marketing:

- "What's the most effective marketing ICs could be doing? Social media, blogs, webinars?"

## Group Discussion

Based on questionnaire responses, or topics raised in the morning session, we'll pick 1-2 topics for people to 
discuss in small groups.

Small groups (40–45 min) - self-select by topic. Each group has a lead and scribe.

Suggestions:

- PLG Pricing — What Has to Change in the Product (Joe / Heidi / Jeff / Steve)
  - "What does self-serve conversion actually require in the product, and how do we grow paid Cloud usage without 
  slowing net-new Nx adoption?"
- Focus and Unplanned Work  (Jack / Victor/ Jason/ Altan / Nicole)
  - "Cooldown is being consumed by high-priority work. How do we structure time so planned, unplanned, and 
    maintenance work each have a real place?""
- Polygraph and Nx as Two Product Lines (Joe / Heidi / Jeff)
  - "How do we organize teams and prioritize across Polygraph and Nx/Cloud so both can grow without conflicting roadmaps?"

Work toward:

1. What's the actual problem?
2. What are the options?
3. What does this group recommend?

Reconvene (15 min) - each group presents (5 min). Jeff/Victor/leads respond:

- "Yes, here's who owns it and by when."
- "Not yet, we need [X] first, answer by [date]."
- "No, here's why."
