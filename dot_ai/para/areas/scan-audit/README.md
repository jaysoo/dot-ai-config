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
- [2026-W22](./weekly/2026-W22.md) -- Console v18.95.0 supply-chain compromise (6-8k installs), CNW angular SSRF NEW HIGH, 5th worm wave (AntV/TanStack 600+ pkgs), Mythos vuln-chaining at 10k flaws, Anthropic CI auto-fix shipped (Self-Healing competitor), Node 25 EOL 7d, Angular 22 RC + Rolldown 1.0 stable, Turbo VS Code ext + 3 sec advisories, nx-cloud 55d publish stale, internal audits all auth-blocked
- [2026-W19](./weekly/2026-W19.md) -- Sandbox 0 working validators (NEW concentration), Pricing SHIPPED, Turbo idle resolved (3 stables 3wk), Moon AI skill found, Mythos pipeline visible (271+40 CVEs), 4th worm wave (SAP), aws-sdk v2 deprecated, status hygiene crisis
- [2026-W18](./weekly/2026-W18.md) -- Ocean trusted publishing live, Node 20 EOL in 2d, 22.7 GA regressions (#35444), 4 zombies (17th flag), Apr 30 cliff, Mythos hype check
- [2026-W17](./weekly/2026-W17.md)
- [2026-W15](./weekly/2026-W15.md) -- CNW 2 HIGH, Angular 22 P0, Node 20 EOL 21d, LGPL blocker, 11 zombies, Gradle 9.5.0-RC2
- [2026-W14](./weekly/2026-W14.md) -- Node.js 9 CVEs, Turbo experimentalCI, Vite 8 Rolldown, MCP v2 OAuth
- [2026-W13](./weekly/2026-W13.md)
- [2026-W12](./weekly/2026-W12.md)
- [2026-W10](./weekly/2026-W10.md)
- [2026-W09](./weekly/2026-W09.md)

### Monthly Digests
- [2026-05 cross-functional](./monthly-digests/2026-05-crossfunctional.md) | [technical changelog](./monthly-digests/2026-05-changelog.md) — Nx 22.7.2/22.7.3 + 15 betas (beta.5-19), Nx Cloud 15 releases unified .nx/ci.yaml, **Console v18.95.0 compromise** (May 18, VSCode only, 6-8k installs, postmortem May 21), Polygraph June 23 launch locked, dedicated compute infra
- [2026-04 cross-functional](./monthly-digests/2026-04-crossfunctional.md) | [technical changelog](./monthly-digests/2026-04-changelog.md) — Nx 22.7.0, Polygraph Standalone, Self-Healing customer friction, fairsdotcom dispute
- [2026-02](./monthly-digests/2026-02-crossfunctional.md) — Task Sandboxing, Self-Healing CI GA, Polygraph AI, 454 issues across 6 teams

## Scan Sub-Areas (scans/)

All scan reports live in `scans/` sub-directories:

| Sub-Area | Cadence | Priority Within |
|----------|---------|----------------|
| [CNW Templates](./scans/cnw-templates/) | **Weekly** | **CRITICAL** |
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
