# Scan & Audit

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

## Latest Reports

### Weekly
- [2026-W09](./weekly/2026-W09.md)

### Monthly Digests
- [2026-02](./monthly-digests/2026-02-crossfunctional.md) — Task Sandboxing, Self-Healing CI GA, Polygraph AI, 454 issues across 6 teams

## External Scans (GitHub, npm, web)
- [Dependency Health](../dependency-health/)
- [Supply Chain Security](../supply-chain-security/)
- [API Surface Audit](../api-surface-audit/)
- [Community Sentiment](../community-sentiment/)
- [Competitor Intel](../competitor-intel/)
- [Framework Ecosystem](../framework-ecosystem/)
- [Runtime Tracking](../runtime-tracking/)
- [AI Dev Landscape](../ai-dev-landscape/)

## Internal Audits (Linear MCP)
- [Team Capacity](../team-capacity/) — Capacity bottlenecks, sequencing risks, overdue items
- [Project Health](../project-health/) — Zombie projects, exit criteria, revenue coordination
- [Customer Dependencies](../customer-deps/) — Concentration risk, engagement health, DPE load
