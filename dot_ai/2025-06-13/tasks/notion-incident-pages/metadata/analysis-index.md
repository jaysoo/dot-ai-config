# Notion Incident Pages - Analysis Index

**Generated:** 2025-06-13T18:48:00Z

## Quick Reference by Action

### 🗑️ DELETE (5 pages)

| Page | Reason | Priority |
|------|--------|----------|
| Incidents page | Redundant with "Incident reports" | High |
| New Incident (x3) | Template duplicates | Medium |
| Incident management process setup | Content belongs in main page | Low |

### 🔄 UPDATE (14 pages)

| Page | Changes Needed | BetterStack? | Priority |
|------|----------------|--------------|----------|
| Incident Management | Remove BetterStack, add Grafana IRM | ✅ Yes | Critical |
| Incident Report Template | Migrate from Google Docs to Notion | ❌ No | High |
| Incidents database | Add severity, SLA fields | ❌ No | High |
| Prior Postmortems database | Link to incidents | ❌ No | Medium |
| All postmortem pages | Standardize naming | ❌ No | Low |

### 🔀 MERGE (3 groups)

1. **Incident Tracking**: Incidents + Incident reports → Single page
2. **Postmortems**: Link database entries to incidents
3. **Disaster Recovery**: Consolidate 3 pages into comprehensive guide

## BetterStack References

### Critical Updates Required
1. **Incident Management page**
   - Current: Links to BetterStack status page management
   - Change to: Grafana IRM incident creation and status updates
   - URL to remove: https://uptime.betterstack.com/team/86648/status-pages/153609/reports

### Search Keywords for Cleanup
- "BetterStack"
- "uptime.betterstack.com"
- "status.nx.app" (verify if managed by BetterStack)
- "status report" (context-dependent)

## Proposed New Structure

```
📁 Incident Response (Nx Cloud > AREAS)
├── 📄 Incident Response Overview
│   └── Grafana IRM Integration Guide
├── 📊 Active Incidents
├── 📊 Postmortems
│   └── Links to incidents
├── 📁 Processes
│   ├── 📄 Alert Management (Grafana)
│   ├── 📄 On-Call Procedures (Grafana)
│   ├── 📄 Escalation Matrix
│   └── 📄 Communication Templates
├── 📁 Disaster Recovery
│   └── 📄 Unified DR Guide
└── 📁 Resources
    ├── 📄 Runbooks
    └── 📄 Templates (Native Notion)
```

## Migration Priority

### Phase 1: Critical (Week 1)
- Remove all BetterStack references
- Create Grafana IRM documentation
- Delete redundant pages

### Phase 2: Important (Week 2)
- Migrate Google Docs template to Notion
- Update database schemas
- Standardize naming

### Phase 3: Nice-to-have (Week 3)
- Link incidents to postmortems
- Consolidate disaster recovery
- Create runbook library

## Metrics

- **Total Pages**: 22
- **BetterStack References**: 1+ pages
- **External Dependencies**: 1 (Google Docs)
- **Naming Inconsistencies**: 5+ instances
- **Missing Features**: Severity, SLA, impact tracking