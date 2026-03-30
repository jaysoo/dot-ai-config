# Scan & Audit

**Priority: LOW (orchestrator)** — but **Supply Chain Security is HIGH (weekly)**

Weekly intelligence scans across the Nx platform. Covers dependency health,
supply chain security, API drift, community sentiment, competitor activity,
framework ecosystem, runtime changes, AI tool landscape, team capacity,
project health, and customer dependencies.

## How to Run

```
/scan-and-audit              # Full scan (all 12)
/scan-and-audit quick        # Web-research scans only (fast, ~5 min)
/scan-and-audit internal     # Internal management audits only (capacity, project-health, customer-deps)
/scan-and-audit briefing     # Director briefing: internal audits + competitors + digest
/scan-and-audit digest       # Monthly digest only
/scan-and-audit competitors frameworks  # Specific scans
```

## Supply Chain Security — WEEKLY CADENCE

**This is the one scan that MUST run every week.** Don't let it slip to monthly.

- Location: `scans/supply-chain-security/`
- Checks: npm audit, 2FA enforcement, OIDC/SLSA provenance, typosquat monitoring
- Scope: 39 publishable Nx CLI packages
- Action: Verify scan ran + review findings weekly via `/plan-week`

## Latest Reports

### Weekly
- [2026-W14](./weekly/2026-W14.md) -- Node.js 9 CVEs, Turbo experimentalCI, Vite 8 Rolldown, MCP v2 OAuth
- [2026-W13](./weekly/2026-W13.md)
- [2026-W12](./weekly/2026-W12.md)
- [2026-W10](./weekly/2026-W10.md)
- [2026-W09](./weekly/2026-W09.md)

### Monthly Digests
- [2026-02](./monthly-digests/2026-02-crossfunctional.md) — Task Sandboxing, Self-Healing CI GA, Polygraph AI, 454 issues across 6 teams

## Scan Sub-Areas (scans/)

All scan reports live in `scans/` sub-directories:

| Sub-Area | Cadence | Priority Within |
|----------|---------|----------------|
| [Supply Chain Security](./scans/supply-chain-security/) | **Weekly** | **HIGH** |
| [Dependency Health](./scans/dependency-health/) | Monthly | Medium |
| [API Surface Audit](./scans/api-surface-audit/) | Monthly | Medium |
| [AI Dev Landscape](./scans/ai-dev-landscape/) | Monthly | Low |
| [Framework Ecosystem](./scans/framework-ecosystem/) | Monthly | Low |
| [Runtime Tracking](./scans/runtime-tracking/) | Monthly | Low |

## Internal Audits (Linear MCP)

These remain as separate top-level areas since they're management responsibilities:
- [Team Capacity](../team-capacity/) — Capacity bottlenecks, sequencing risks, overdue items
- [Project Health](../project-health/) — Zombie projects, exit criteria, revenue coordination
- [Customer Dependencies](../customer-deps/) — Concentration risk, engagement health, DPE load

## Community & Competitor Intel

These remain as separate top-level areas since they're referenced independently:
- [Community Sentiment](../community-sentiment/)
- [Competitor Intel](../competitor-intel/)
