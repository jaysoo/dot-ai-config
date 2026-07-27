# Gauge: Current Usefulness, What to Assess, and Alternatives

**Date:** 2026-07-24
**Context:** One week into trial. Full raw notes + action items: `dot_ai/2026-07-22/tasks/gauge-ai-sentiment-nx-docs-action-items.md`. Jack's stance: useful, month-to-month only, cap $100/mo.

## What Gauge is actually useful for (evidenced this week)

- **Per-URL AI citation attribution.** Showed which nx.dev pages AI answers pull from, per model. Found the new `/comparisons/` cluster went 0 -> 8-12% citation in one period, and caught a duplicate nx-vs-turborepo URL splitting authority (12.4% vs 9.8%). Nothing else we have does this.
- **Weak-spot detection on a fixed prompt set.** Surfaced concrete gaps: cost-framed prompts — pricing/budget/ROI questions like "Cheapest monorepo CI/CD platforms for startups" (33.3%), "cost per build" queries, and ROI-justification prompts (41.7%) — sit at 33-48% visibility because answers pull from competitor pricing pages and forums (Nx has no citable cost content). "Google build system alternatives" framing at 14.8%, "platforms" vs "tools" wording splitting 40.7% vs 74.1%. These are directly actionable content targets.
- **Concern invalidation.** Confirmed the Aug 2025 s1ngularity malware incident appears in 1 of ~2,164 tracked answers (citation-only, no narrative). Saved us from doing unnecessary reputation work.
- **Before/after evals (Action Center).** Define expected metric + pass criteria per shipped change, auto-evaluate. This is the positive/neutral/negative tracking we need for the docs action items — IF we set the eval window to 2-3+ weeks (its default ~3-day eval scored noise).
- **Sentiment theme extraction.** Identified the four real negative themes (complexity for small teams, weaker non-JS plugin support, Cloud pricing/licensing, scale limits) — qualitative but useful for prioritization.

## Known limits (methodology, researched 2026-07-24)

- Visibility/sentiment data is **synthetic**: Gauge's own daily prompts against chat UIs, not real users. Logged-out, no-memory sampling; LLM answers are stochastic. Absolute percentages are not facts.
- "Real user prompt" data is **extension-harvested panel data** bought from brokers (desktop/Chrome skew, no mobile, ethically wobbly supply chain). Ignore prompt-volume numbers entirely.
- Coverage = whatever prompt set is configured. Selection bias in, insights out. Small subset of the actual query universe.
- Verdict: trust **relative trends on a fixed prompt set** and **citation intelligence**; treat everything else as modeled estimates for prioritization only.

## What to assess (during month-to-month)

Monthly renewal test (any two = renew):

1. An Action Center eval produced a decision-grade before/after readout on a shipped change that Ahrefs couldn't give us.
2. Citation data surfaced a new actionable finding we acted on (misinformation source, duplicate URL, competitor page climbing).
3. An in-flight item's eval window is still open.

Cancel on: two idle months, noise-only metrics with nothing shipped, price >$100/mo. Full rubric + per-item pass criteria in the main task doc. The real test is the next 6-8 weeks: H1 (URL dedupe), H2 (CI/CD guide), H3 (comparison pages), H4 (cost framing) all ship with pre-registered criteria — if Gauge cleanly measures those, it earns the subscription.

## Alternatives if we drop Gauge

**Ahrefs (already paying).** Covers classic SEO fully: keyword positions, traffic, backlinks, content gaps. Check whether our plan includes **Brand Radar** — it tracks brand mentions/visibility in AI Overviews and AI assistants, which overlaps Gauge's visibility layer at no extra cost. What Ahrefs does NOT give: per-answer citation drill-down across chat models, sentiment themes, before/after evals on a fixed prompt set. (Verify current Brand Radar scope — feature set moves fast.)

**Other GEO tools** (rough pricing, verify before quoting): Profound (enterprise, well above our cap), Peec AI (~EUR 90+/mo), Otterly.ai (~$30+/mo, lighter). Same methodology caveats apply to all — they run the same synthetic-prompt + panel-data playbook. Otterly is the one to look at if we want a cheaper citation tracker.

**DIY prompt battery (free, ~2-3 hrs/mo).** Fixed set of ~20-30 prompts (reuse Gauge's set — we have it in the notes), run monthly against ChatGPT/Claude/Perplexity/Gemini logged-out, log mentions + citations + sentiment to a sheet. Reproduces Gauge's core "relative trend on fixed prompt set" value at monthly instead of daily cadence. Loses: per-model breadth, automation, Action Center evals, answer archive. Scriptable later if worth it.

**Free signals we should use regardless of Gauge:**

- AI referral traffic (chatgpt.com, perplexity.ai referrers) in whatever analytics nx.dev has — the actual outcome metric.
- AI crawler activity (GPTBot, ClaudeBot, PerplexityBot) in Netlify/CDN logs — confirms our pages are being ingested.
- Manual spot-checks of high-stakes prompts after each content ship.

## Bottom line

**Pricing check (2026-07-24): Gauge is $599/mo — 6x over the $100/mo cap. Recommendation: do not subscribe.**

Gauge's unique value = citation attribution + fixed-prompt trend tracking + pre-registered before/after evals — real, but not $7.2k/yr real for our volume of changes. Plan:

1. **Before trial ends:** record the tracked prompt set + all baselines (done — in the task doc) and pull the generated drafts worth reworking (CI/CD guide).
2. **Fallback stack:** Ahrefs (+ Brand Radar if our plan includes it) for SEO + AI-mention overlap; DIY monthly prompt battery (reusing Gauge's prompt set) for citation/sentiment trends; AI referral traffic + crawler logs for outcomes. H1-H4 before/after tracking moves to the DIY battery at monthly cadence, logged in the task doc.
3. **Optional:** trial Otterly.ai (~$30/mo, verify pricing) if the DIY battery proves too tedious.
4. **Revisit** if Gauge ships a cheaper tier or the GEO category commoditizes (it will — quarterly category re-scan).
