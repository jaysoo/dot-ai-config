# Onboarding & Activation

**Priority: HIGH** | Cadence: Weekly (Quark-a team) | Owner: Jack Hsu (Product Lead)

Tracks the self-serve onboarding and activation motion across the Nx platform (CLI → Nx Cloud).

## Purpose

Drive the self-serve funnel from first touch (`nx init`, CNW, `nx import`) to activated Nx Cloud workspace. This area owns the product decisions, measurement, and cross-team coordination needed to hit the company self-serve targets.

## Targets

- **550 new workspaces** (self-serve)
- **$3.3M new ARR** (self-serve)

Tactical target (per `2026-04-20` cloud-adoption top-of-funnel spec): **600 claimed Nx Cloud workspaces / week** within 30 days.

## Roles (Quark-a team)

| Person | Role |
|--------|------|
| **Jack Hsu** | Product Lead — owns outcomes, sets measurable goals, drives platform work (CLI → Cloud), coordinates across teams |
| **Cory Henderson** | PLG & Operations — owns PLG metrics/stage conversion, runs Quark-a meetings, keeps team aligned/accountable |
| **Nicole** | Measurement partner — onboarding & feature activation metrics |

**tldr:** Jack owns *what* we're trying to achieve and *how* we get there. Cory owns *how we measure it*, track it, and keep the team aligned.

Source: Joe Johnson Slack alignment, 2026-04-21.

## Scope

- **Entry points:** `nx init` (existing repos), `create-nx-workspace` (greenfield), `nx import` (migration from competitor)
- **Platform surface:** CLI → Nx Cloud handoff, first-workspace claim, activation signals
- **Personas (priority order):** B (existing repos with CI/build pain) > C (competitor switchers) > D (AI-assisted devs) > A (greenfield)

## Key Metrics

| Metric | What to Watch |
|--------|---------------|
| Claimed workspaces / week | Primary activation signal, 600/week target |
| `nx init` completions / day | Top-of-funnel for primary persona (B) |
| CNW completions / day | Greenfield volume (~1,500/day baseline) |
| Claim rate (init vs CNW) | Where activation concentrates |
| Cloud opt-in rate from CNW | Currently ~12%, target 20% |
| Stage conversion (Cory owns detail) | Step-by-step funnel health |

## Related Areas / Specs

- `areas/cnw-stats/` — CNW telemetry, funnel regressions, version adoption
- `2026-04-20/specs/cloud-adoption-top-of-funnel.md` — 30-day top-of-funnel plan (4 scenarios, 6 workstreams)
- `areas/syncs/` — Quark-a sync notes (add `syncs/quark-a/` when recurring)

## Cadence

- **Twice-weekly pulse:** Monday (full) + Thursday (refresh) — automated via `/plan-week` and `/plan-week refresh`. Saved to `pulse/{YYYY-MM-DD}.md`. See "Onboarding & Activation pulse" in the plan-week skill for the exact metric table.
- **Weekly:** Quark-a sync (Cory runs, Jack partners)
- **Weekly:** Nicole sync on measurement — what we're tracking, current metrics, what to present
- **Daily:** Monitor CNW/init telemetry during active workstream launches (via `/cnw-stats-analyzer`)

## Pulses

Pulse reports live in `pulse/`. Each file captures the metrics table, a verdict (on track / at risk / off track), deltas vs the prior pulse, and decisions needed this week.

## Working Log

| Date | Note |
|------|------|
| 2026-04-21 | Area created. Roles aligned with Joe/Cory in Slack. Top-of-funnel spec already in flight. |
