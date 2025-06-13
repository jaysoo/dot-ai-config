# Grafana IRM Content Updates

**Date:** 2025-06-13  
**Purpose:** Migrate incident response documentation from BetterStack to Grafana IRM  
**Status Page URL Change:** status.nx.app → status.nx.dev

## Executive Summary

This document provides comprehensive content updates for migrating the incident response documentation from BetterStack to Grafana IRM. The new process centralizes incident management in Grafana IRM, uses Slack for communication, and maintains postmortems (only) in Notion.

### Key Changes
1. **Tool Migration**: BetterStack → Grafana IRM for all incident management
2. **Clear Separation**: Grafana IRM for incidents, Notion for postmortems only
3. **Status Page**: status.nx.app → status.nx.dev (Atlassian Status Page)
4. **On-Call Process**: Weekly rotation with 2-month cycles
5. **Communication**: Slack channel `grafana_irm` + Zoom/Slack Huddles

---

## New Incident Response Process Documentation

### Overview

The incident response process is designed to detect, respond to, and resolve service disruptions quickly while maintaining clear communication with stakeholders.

### Process Flow

```
Alert Detection → Acknowledgment → Incident Creation → Investigation → Resolution → Postmortem
     ↓                ↓                    ↓                 ↓              ↓              ↓
  Grafana         Slack Channel      Grafana IRM      Team Collab    Pod Restart    Notion DB
  Alerts          grafana_irm                         Slack/Zoom     or Code Fix    (Later)
```

### Detailed Process

#### 1. Alert Detection and Monitoring
- **Grafana Alerts** monitor for:
  - 503 errors
  - Service errors
  - API downtime
  - Nx Cloud app unreachable
- Alerts appear in Slack channel: **`grafana_irm`**
- On-call engineer monitors during working hours

#### 2. On-Call Rotation
- **Teams**: Infrastructure + Application team members
- **Schedule**: Weekly rotation (one person per week)
- **Cycle**: Each person returns to on-call after ~2 months
- **Coverage**: Working hours monitoring
- **Handoff**: Weekly on Mondays

#### 3. Incident Management
- **All incidents created in Grafana IRM** (no other tools)
- Automatic incident creation for critical alerts
- Manual incident creation for other issues
- **No incident tracking in Notion** (postmortems only)

#### 4. Communication Protocols

**Internal Communication:**
- Primary: Slack channel `grafana_irm`
- Incident war room: Zoom or Slack Huddles
- Updates every 30 minutes during active incidents

**External Communication:**
- **Status Page**: status.nx.dev (Atlassian Status Page)
- Automatic updates via Grafana IRM integration
- Serves public cloud, single tenant, and enterprise customers

**Customer Communication:**
- DPE team communicates with affected customers
- Account Manager (Maria) fills communication gaps
- Cloud support email monitoring by DPE team + Maria
- No direct email to public cloud customers

#### 5. Resolution Process
1. **First Response**: Restart pods/servers
2. **Monitor**: Check traffic and health metrics
3. **Escalate**: Code changes if restart doesn't work
4. **Verify**: Ensure issue is resolved
5. **Update**: Close incident in Grafana IRM

#### 6. Postmortem Process
- **Location**: Single Notion database (no incident reports)
- **Timing**: After incident resolution
- **Content**: Root cause, timeline, action items
- **External Docs**: DPE/Maria/Joe manage customer-facing documents separately

---

## Page-by-Page Updates

### 1. Incident Management (Main Page)
**Action:** UPDATE  
**URL:** https://www.notion.so/Incident-Management-462453a4546340b8820c5d9d9ba74892

**Current Content:**
```markdown
# Incident Management

## Updating the status page

If there is either a confirmed or suspected incident, update the [status page](https://status.nx.app/) as soon as possible.

> 💬 All service status changes should be done via reports...

1. Create a new status report on BetterStack: https://uptime.betterstack.com/team/86648/status-pages/153609/reports
   - ![Navigate to the status pages > status.nx.app page, then click "create status report"](image-placeholder)
[...]
```

**New Content:**
```markdown
# Incident Management

## Overview

All incidents are managed through **Grafana IRM**. This page provides the complete incident response process for the Nx Cloud platform.

**Key Tools:**
- **Grafana IRM**: Incident creation and management
- **Slack**: Communication (`grafana_irm` channel)
- **Status Page**: status.nx.dev (customer updates)
- **Notion**: Postmortems only (no incident tracking)

## Alert Monitoring

Grafana monitors our infrastructure and automatically alerts on:
- 503 errors and service failures
- API downtime or unreachability
- Nx Cloud app availability issues
- Performance degradations

All alerts appear in the **`grafana_irm`** Slack channel.

## On-Call Responsibilities

### Rotation Schedule
- **Duration**: One week per person
- **Team**: Infrastructure + Application team members
- **Cycle**: ~2 months between rotations
- **Coverage**: Working hours monitoring

### On-Call Duties
1. Monitor `grafana_irm` Slack channel
2. Acknowledge alerts promptly
3. Create incidents in Grafana IRM
4. Coordinate response efforts
5. Update status page via Grafana integration

## Incident Response Process

### 1. Alert Acknowledgment
When an alert fires:
1. Check `grafana_irm` Slack channel
2. Acknowledge the alert to stop escalation
3. Assess severity and impact

### 2. Incident Creation
- **Tool**: Grafana IRM only
- **Automatic**: Critical alerts create incidents automatically
- **Manual**: Create for non-automated issues
- Navigate to Grafana IRM → Create Incident
- Link to triggering alert(s)

### 3. Status Page Updates
The Atlassian Status Page (status.nx.dev) updates automatically via Grafana IRM integration:
1. Incident creation triggers status update
2. Set affected components
3. Write customer-facing description
4. Updates sync automatically

### 4. Investigation & Resolution

**Initial Response (Most Common):**
```bash
# Restart affected pods
kubectl rollout restart deployment/[deployment-name]

# Monitor health
kubectl get pods -w
kubectl logs -f [pod-name]
```

**If restart doesn't resolve:**
1. Investigate logs in Grafana
2. Check recent deployments
3. Review application metrics
4. Escalate to code changes if needed

### 5. Communication

**Internal:**
- Use `grafana_irm` Slack channel
- Start Zoom or Slack Huddle for complex issues
- Post updates every 30 minutes

**External:**
- Status page auto-updates from Grafana IRM
- DPE team handles customer communications
- Account Manager assists with enterprise customers

### 6. Incident Closure
1. Verify issue is resolved
2. Update incident status in Grafana IRM
3. Status page updates automatically
4. Schedule postmortem if needed

## Postmortem Process

**Important**: Postmortems are the ONLY incident documentation in Notion.

After incident resolution:
1. Create entry in Notion Postmortem database
2. Include: Timeline, root cause, action items
3. No incident reports or tracking in Notion
4. External communications handled separately by DPE/Maria/Joe

## Quick Links

- **Grafana IRM**: [internal link]
- **Status Page**: https://status.nx.dev
- **Postmortem Database**: [Notion link]
- **On-Call Schedule**: [Grafana IRM link]

## Escalation Matrix

| Severity | Response Time | Escalation |
|----------|--------------|------------|
| Critical | Immediate | On-call → Team Lead → CTO |
| High | 15 minutes | On-call → Team Lead |
| Medium | 1 hour | On-call → Team |
| Low | Next business day | On-call |
```

---

### 2. Incidents Page
**Action:** DELETE  
**URL:** https://www.notion.so/Incidents-20369f3c238780abbbbff21cd4950208  
**Reason:** Incidents are managed in Grafana IRM only. No incident tracking in Notion.

---

### 3. Incident Reports Page
**Action:** DELETE  
**URL:** https://www.notion.so/Incident-reports-32b976699d5f4933811118bacfda1b00  
**Reason:** No incident reports in Notion. Only postmortems are documented in Notion.

---

### 4. Incident Report Template
**Action:** DELETE  
**URL:** https://www.notion.so/Incident-Report-Template-1fd69f3c2387801f9006df95056ec69d  
**Reason:** Incident reports are not created. Use Grafana IRM for incidents and Notion for postmortems only.

**Note:** If a template is needed for external communications, DPE/Maria/Joe will manage this separately outside of the incident response process.

---

### 5. Incident Management Process Setup
**Action:** MERGE into main Incident Management page  
**URL:** https://www.notion.so/Incident-management-process-setup-5a09175f9b574789a492cabbfac63cfd  
**Reason:** Setup instructions should be part of the main documentation.

---

### 6. Incidents Database (internal only)
**Action:** CONVERT to Postmortems-only tracking  
**URL:** https://www.notion.so/326f8c5b6c1741cdb14ff2d680200e8a

**Current Schema:**
- Name (Title)
- Date (Date)
- Status (Suspected/Active/Resolved)
- Instance (Rich text)
- Incident manager (People)
- Investigators (People)

**New Schema (Postmortems Database):**
```
- Incident Title (Title)
- Incident Date (Date)
- Postmortem Date (Date)
- Severity (P0/P1/P2/P3)
- Duration (Number - minutes)
- Services Affected (Multi-select)
- Root Cause (Rich text)
- Action Items (Relation to Tasks)
- Author (People)
- Grafana IRM Link (URL)
- Status Page Link (URL)
```

**Migration Note:** Archive existing incident entries or link them to corresponding postmortems.

---

### 7. Postmortems Main Page
**Action:** UPDATE  
**URL:** https://www.notion.so/Postmortems-8a92d254d42546b7916f12e34c4ec251

**Add Section:**
```markdown
## Important: Incident Management Process

**Incidents are managed in Grafana IRM, not Notion.**

This database contains postmortems only. For active incidents:
- View in Grafana IRM
- Communicate in `grafana_irm` Slack channel
- Customer updates via status.nx.dev

## When to Create a Postmortem

Create a postmortem for:
- All P0 (Critical) incidents
- P1 incidents with customer impact
- Any incident with learning opportunities
- Recurring issues

## Postmortem Timeline

- Within 24 hours: Create draft entry
- Within 48 hours: Complete timeline and root cause
- Within 1 week: Finalize action items
- Within 2 weeks: Action items assigned and tracked
```

---

### 8. All Individual Postmortem Pages
**Action:** UPDATE naming convention only  
**Change:** Standardize all to "Postmortem" (not "PostMortem")  
**Date Format:** Use YYYY-MM-DD consistently

**Examples:**
- "PostMortem: Artemis queue backups" → "Postmortem: 2025-04-02 Artemis queue backups"
- "Postmortem - Mar 4th, 2024: Unintentional Release..." → "Postmortem: 2024-03-04 Unintentional Release..."

---

### 9. New Incident Page(s)
**Action:** DELETE ALL  
**URLs:** 
- https://www.notion.so/New-Incident-21169f3c238780bf8af7ec8eb3dc687a
- https://www.notion.so/New-Incident-21169f3c238780329be7e4ec016883b6  
- https://www.notion.so/New-Incident-ac7dda43b89245689d2bd4bf4e297eab

**Reason:** Incidents are created in Grafana IRM only. Remove all template pages.

---

### 10. Disaster Recovery Pages
**Action:** UPDATE tool references

**Disaster recovery exercise plan:**
```markdown
[Update any references to BetterStack or incident management]

## Incident Response During DR

During disaster recovery scenarios:
1. Create P0 incident in Grafana IRM
2. Activate emergency response in `grafana_irm` channel
3. Update status.nx.dev with DR notice
4. Follow DR runbooks while tracking in Grafana IRM
```

---

## New Pages to Create

### 1. On-Call Procedures
**Location:** Under Incident Management

```markdown
# On-Call Procedures

## Overview

The on-call rotation ensures 24/7 coverage for incident response with weekly rotations among Infrastructure and Application team members.

## Rotation Schedule

### Current Rotation
- **Current On-Call**: [Name] (Week of MM/DD)
- **Next On-Call**: [Name] (Week of MM/DD)
- **Schedule**: [Link to Grafana IRM schedule]

### Rotation Rules
- **Duration**: Monday 9 AM to Monday 9 AM
- **Frequency**: Each person every ~2 months
- **Teams**: Infrastructure + Application teams
- **Coverage**: Working hours primary, after-hours best effort

## Handoff Process

### Every Monday at 9 AM

**Outgoing On-Call:**
1. Review past week's incidents
2. Update any ongoing issues
3. Brief incoming on-call
4. Update Grafana IRM schedule

**Incoming On-Call:**
1. Verify Grafana IRM access
2. Check Slack notifications
3. Review recent incidents
4. Confirm phone/pager setup

### Handoff Checklist
- [ ] Grafana IRM access confirmed
- [ ] Slack notifications enabled
- [ ] Phone alerts configured
- [ ] Recent incidents reviewed
- [ ] Ongoing issues briefed
- [ ] Schedule updated

## On-Call Responsibilities

### Primary Duties
1. Monitor `grafana_irm` Slack channel
2. Acknowledge alerts within 5 minutes
3. Create/manage incidents in Grafana IRM
4. Coordinate response team
5. Update status page
6. Lead postmortem process

### Response Times
- **P0 (Critical)**: Immediate
- **P1 (High)**: 15 minutes
- **P2 (Medium)**: 1 hour
- **P3 (Low)**: Next business day

## Tools Setup

### Grafana IRM
1. Ensure you're in the on-call rotation
2. Mobile app installed and logged in
3. Push notifications enabled

### Slack
1. Join `grafana_irm` channel
2. Enable mobile notifications
3. Set notification schedule if needed

### Status Page
1. Verify Atlassian Status Page access
2. Bookmark status.nx.dev admin panel
3. Test update permissions

## Escalation Procedures

### When to Escalate
- Cannot resolve within 30 minutes
- Customer data at risk
- Multiple services affected
- Need additional expertise

### Escalation Path
1. **First**: Team technical lead
2. **Second**: Engineering manager
3. **Third**: CTO/VP Engineering

### Contact List
[Maintain in Grafana IRM or secure location]

## Common Scenarios

### Pod/Service Restart
```bash
# Check pod status
kubectl get pods -n production

# Restart deployment
kubectl rollout restart deployment/[name] -n production

# Watch rollout
kubectl rollout status deployment/[name] -n production
```

### Database Issues
1. Check connection pool metrics
2. Review slow query logs
3. Escalate to DBA on-call

### API Degradation
1. Check rate limits
2. Review recent deployments
3. Scale up if needed

## After-Hours Support

### Guidelines
- Critical issues only (P0/P1)
- Customer impact must be significant
- Use judgment for wake-up calls
- Document decision in incident

### Compensation
- Follow company on-call policy
- Track after-hours responses
- Submit for approval monthly
```

---

## Implementation Checklist

### Phase 1: Immediate Changes (Day 1)
- [ ] Update main Incident Management page with new content
- [ ] Delete Incidents page
- [ ] Delete Incident reports page  
- [ ] Delete Incident Report Template
- [ ] Delete all "New Incident" pages
- [ ] Update status.nx.app → status.nx.dev references

### Phase 2: Database Updates (Day 2)
- [ ] Convert Incidents database to Postmortems-only
- [ ] Update database schema
- [ ] Archive or migrate existing incident entries
- [ ] Update database views and filters

### Phase 3: Process Documentation (Day 3)
- [ ] Create On-Call Procedures page
- [ ] Update Postmortems main page
- [ ] Merge setup content into main page
- [ ] Standardize postmortem naming

### Phase 4: Validation (Day 4)
- [ ] Remove all BetterStack references
- [ ] Verify Grafana IRM links work
- [ ] Test status page integration
- [ ] Team review and feedback

---

## Quick Reference Guide

### 🚨 Incident Response Quick Guide

**Alert Fired?**
1. Check `grafana_irm` Slack channel
2. Acknowledge in Grafana
3. Create incident if needed

**Tools:**
- **Incidents**: Grafana IRM only
- **Communication**: Slack `grafana_irm`
- **Status Page**: status.nx.dev
- **Postmortems**: Notion database

**First Response:**
```bash
kubectl rollout restart deployment/[name]
```

**Escalation:**
On-call → Team Lead → Engineering Manager → CTO

**Key Links:**
- Grafana IRM: [link]
- Status Page: https://status.nx.dev
- On-Call Schedule: [link]
- Postmortem DB: [link]

---

## Notes for Implementation Team

1. **Critical**: Ensure all team members understand that incidents are managed in Grafana IRM only
2. **Training**: Schedule team training on Grafana IRM if needed
3. **Access**: Verify all on-call engineers have Grafana IRM access
4. **Integration**: Test Grafana IRM → Status Page integration before go-live
5. **Cleanup**: Archive old BetterStack data appropriately

## Success Metrics

- Zero BetterStack references remain
- All incidents created in Grafana IRM
- Status page updates working automatically
- Clear separation: Grafana (incidents) vs Notion (postmortems)
- On-call schedule documented and rotating properly