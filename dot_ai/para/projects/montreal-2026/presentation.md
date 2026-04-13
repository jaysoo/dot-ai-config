# Montreal Day 2 Morning Session (Engineering)

Agenda:

- How we're doing (SPACE)
- What we shipped
- How we work
- AI demos
- Group discussion on one topic

Note: Many tie-ins with PLG

## SPACE Metrics — How We're Doing

We're healthy, but can do better in the __satisfaction__ dimension.

Throughput (Activity): 

  - 2,215 PRs in Q1 2026 vs 1,475 in Q1 2025
  - __50% YoY increase__

Planning Accuracy Q1 2026 (Performance)

| Team       | Actual | Planned |
|------------|--------|---------|
| Orca       | 60.2%  | 75%     |
| Kraken     | 50%    | 75%     |
| Red Panda  | 88.8%  | 80%     |
| Dolphin    | 70.3%  | 50%     |
| Quokka     | 93.2%  | 75%     |

Median PR Cycle Time Q1 2026 (Collaboration & Efficiency)

| Repo                 | Cycle Time |
|----------------------|------------|
| nx                   | 6.5h       |
| ocean                | 3.3h       |
| nx-console           | 2.1h       |
| cloud-infrastructure | 0.1h       |

MTTR for P0/P1 Issues Q1 2026 (Collaboration & Efficiency)

| Team      | MTTR    |
|-----------|---------|
| Orca      | 6.4d    |
| Kraken    | 0.1d    |
| Dolphin   | 5.1d    |
| Quokka    | 2.5d    |
| Red Panda | 285.1d* |

Satisfaction: 

  - Autonomy/growth 4.3/5
  - Sustainability 3.4/5
  - Recognition 3.5/5

---

### _S_PACE - What the Surveys Are Telling Us

Sustainability - work smart, not hard.

- "Clearer understanding of priorities"
- "More focused work, less urgent interruptions"
- "Priority shifts cause the feeling of over-promise and under-deliver" (stakeholder)

Visibility — people don't know what we're working on or why.

- "Understanding longer-term goals for the team"
- "A list of features with expected impact, reviewed on a cadence" (stakeholder)

Recognition — 3.5/5 avg but bimodal (5s and 1s).

- "Better people-management from leads would help me feel more seen"

Stakeholders want work tied to revenue.

- "Customer validation before development"
- "Non-urgent customer issues rarely get resolved"


**Takeaway:** We've built the engine. Throughput is up 50% YoY. But we're spreading that energy too thin, 
priorities are unclear, and it's hard to tie work into revenue. We need **sharper focus** not more hours.

Use AI do remove the tedium while we do deep work in the most impactful projects.

From yesterday: "Teams are working separately rather than together" ~Jeff

---

## What We Shipped 🚀

- TUI and continuous tasks — launch + many fixes/enhancements
- Self-Healing CI — ClickUp, Mailchimp, Cloudinary, Mimecast, and more
- Task Sandboxing — Legora, ClickUp, Island, Wix
- Cloud onboarding — streamlined VCS, one-page flow, template-based flow, `nx-cloud onboard`
- Agentic Experience (AX) — llms.txt, llms-full.txt, `.md` URLs, agent-friendly `init`/CNW
- NPM read-through cache, Docker Hub mirror, Docker layer cache
- Framer, Astro docs, new blog
- Analytics/telemetry — CLI telemetry, PostHog, Netlify server events
- Ecosystem — Node 24, Vite 8, Vitest 4, Prettier 3, ESLint 10, Storybook 10, Next.js 16, Cypress 15, .NET and Maven plugins
- Lighthouse
- And more!

Question #1: Which of these tie to a stage in PLG funnel?

  1. Acquisition
  2. Activation
  3. Adoption
  4. Conversion

Question #2: How do you know if/when a feature is successful?

We need an __engineering shift__ to align with PLG.

---

## How We Work

We've built the engine. 2026 points it at the right things.

- Each team focuses on **1–2 projects** at a time. Depth over breadth.
- Active projects updated at least once a week in Linear.
  - Jeff should be able to open a short list and find everything without asking on Slack.
- Proposals are projects in backlog. Planning every two months to accept a limited number of them.
- Projects that run over -> carry over or cancel (Shape Up). Trim scope aggressively.

### Shipping ≠ Success

- Features that launch without adoption are failures
- Stop thinking "we built it, now marketing sells it"

### Planned work needs three things

1. A funnel stage (Acquisition / Activation / Adoption / Conversion)
2. A success metric - Not "we shipped it" but "600 claimed workspaces a week for Cloud" or "1000 successful nx init a week"
3. A measurement plan - Do the signals exist today, or do we need to build them?

### Unplanned work happens, but should not slow us down

Unplanned work is tracked in Linear, not Slack. Each team budgets a % for unplanned. 

We need to know how much time spent on planned vs unplanned so we know if there's a problem. 
Without the data, we're flying blind.

Reminder: P0 = drop everything. P1 = 7 days (14 for CLI).

---

## PLG Funnel and Signals

Acquisition - workspace claimed in Cloud
- Increase "yes" to Cloud prompt, reduce CNW/init errors, one-page onboarding in 20s

Activation - 20+ successful CIPE runs
- Reduce time to first "aha" moment, feature demos

Adoption - would they notice if the product disappeared?
- Second team member invited, self-healing fixes applied, growing CIPE runs

Conversion - they pay
- Credit limit -> upgrade, enterprise features (self-healing, SCIM, private links, npm/docker read-through), growing billing, self-serve upgrades

Question: What are the signals for CLI, for Polygraph?

---

# AI Workflow Demos

Handling the tedious work so we can stay focused on 1–2 things.

Jon — Sandbox workflow on Mac
James — Mac Mini agents for maintenance tasks

---

# Group Discussion

Leads present 4–5 candidate topics (from pre-submitted questions + what we know needs discussion). Leads choose 2–3 for this session.

Small groups (40–45 min) — self-select by topic. Each group has a lead and scribe. Work toward:
1. What's the actual problem?
2. What are the options?
3. What does this group recommend?

Reconvene (15–20 min) — each group presents (4–5 min). Jeff/Victor respond:
- "Yes — here's who owns it and by when."
- "Not yet — we need [X] first, answer by [date]."
- "No — here's why."

All commitments: owner + date. Photographed. Sent out tomorrow.

---

# Afternoon

Jack + leads in sales/marketing session. Engineers can:

- Continue morning topics — go deeper on anything that needs more time
- Automation audit + hackathon — list tedious/repetitive tasks, cluster, form teams, build PoCs

Anything needing leadership input must be resolved in the morning.
