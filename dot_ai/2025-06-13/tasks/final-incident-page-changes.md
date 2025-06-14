# Final Incident Page Changes

## 1. Incident Management (Main Page)

**Page URL:** https://www.notion.so/Incident-Management-462453a4546340b8820c5d9d9ba74892  
**Date Updated:** 2025-06-13

### Summary of Changes

The page has been completely rewritten, transitioning from BetterStack-focused documentation to Grafana IRM-based incident management. Key changes include:

1. **Tool Migration**: BetterStack → Grafana IRM as primary incident management tool
2. **Status Page URL**: Remains status.nx.app (not changed to status.nx.dev as planned)
3. **Structure**: Changed from step-by-step status update instructions to comprehensive incident response process
4. **Content**: Removed all BetterStack references and added Grafana IRM workflows
5. **IMPORTANT**: Content from "Incident Response Guidelines" page (https://www.notion.so/nxnrwl/Incident-Response-Guidelines-72a3a6e9c5bd40e7a1111be11a3e74a6) was merged into this page (Note: Guidelines page was not in original backup)

### Detailed Diff

#### Removed Content:
- All BetterStack-specific instructions for creating status reports
- Step-by-step screenshots and navigation for BetterStack
- Time zone conversion guidance
- Detailed status update templates
- References to BetterStack URLs and interfaces

#### Added Content:

**New Introduction:**
- Clear statement that all incidents are managed through Grafana IRM
- Table of contents for better navigation

**Key Tools Section:**
- Grafana IRM: https://nx.grafana.net/a/grafana-irm-app (with direct link)
- Slack: #grafana_irm channel
- Statuspage: https://manage.statuspage.io/pages/l18ysly7bgt1/incidents
- Notion: For postmortems only

**Alert Monitoring Section:**
- List of what Grafana monitors (503 errors, API downtime, etc.)
- Clear statement that alerts appear in #grafana_irm Slack channel

**On-Call Responsibilities Section:**
- Rotation Schedule details (weekly, ~2 months between rotations)
- On-Call Duties numbered list

**Incident Response Process:**
Organized into clear numbered sections:

1. **Alert Acknowledgment**
   - Check #grafana_irm channel
   - Acknowledge in message thread
   - Assess severity
   - Declare incident ASAP from Slack

2. **Incident Creation**
   - Warning not to create incidents on Statuspage
   - Grafana IRM as source of truth
   - Automatic vs Manual creation
   - Direct link to create incident

3. **Status Page Updates**
   - Note about automatic integration
   - Instructions for setting affected components
   - 30-45 minute update cadence (retained from original)

4. **Investigation & Resolution**
   - Common resolution: restart pods
   - Collaboration with Infra/App teams
   - Resolution process in both Grafana and Statuspage

### Key Differences:

1. **Tone**: More direct and operational vs. previous tutorial style
2. **Links**: Added direct operational links to tools
3. **Process**: Clearer workflow from alert → incident → resolution
4. **Integration**: Emphasizes Grafana-Statuspage integration
5. **Communication**: Strong focus on Slack channel for coordination

### Notable Retention:
- Status page URL remains status.nx.app (not changed to status.nx.dev)
- 30-45 minute update cadence recommendation
- Basic incident communication templates

### Missing from Planned Updates:
The following content from the planned update document was NOT included:
- Detailed bash commands for pod restarts
- Escalation matrix table
- Postmortem process details
- Quick links section
- Communication protocol details (internal/external/customer)
- Severity levels (P0-P3)
- On-call coverage hours specification
- Action items and metrics tracking

### Current vs. Planned Comparison:
The actual update is significantly shorter and more focused than the comprehensive rewrite planned in the grafana-irm-content-updates.md document. It covers the essential workflow but omits many operational details, reference materials, and process improvements suggested in the plan.

---

## 2. Incidents Page

**Page URL:** https://www.notion.so/Incidents-20369f3c238780abbbbff21cd4950208  
**Status:** NOT DELETED (still exists)
**Planned Action:** DELETE

The page still exists and was not deleted as planned in the update document.

---

## 3. Incident reports Page

**Page URL:** https://www.notion.so/Incident-reports-32b976699d5f4933811118bacfda1b00  
**Status:** NOT DELETED (still exists)
**Planned Action:** DELETE

The page still exists and was not deleted as planned in the update document.

---

## 4. Incident Report Template

**Page URL:** https://www.notion.so/Incident-Report-Template-1fd69f3c2387801f9006df95056ec69d  
**Status:** NOT DELETED (still exists)
**Planned Action:** DELETE

The page still exists and was not deleted as planned. It's part of a database with various properties including Tags, Team, Owner, etc.

---

## 5. Incident management process setup

**Page URL:** https://www.notion.so/Incident-management-process-setup-5a09175f9b574789a492cabbfac63cfd  
**Status:** ARCHIVED/TRASHED ✓
**Planned Action:** MERGE into main Incident Management page

The page has been successfully archived/trashed as planned. The content merger status is unknown since the page wasn't in the original backup.

---

## 6. Incidents Database (internal only)

**Database URL:** https://www.notion.so/326f8c5b6c1741cdb14ff2d680200e8a  
**Status:** RENAMED ✓
**Changes Made:**
- **Name changed**: "Incidents (internal only)" → "Postmortems (internal only)"
- **Schema**: Kept the same (not updated to the new schema suggested)
- **Properties remain**: Incident manager, Status, Instance, Investigators, Date, Name

The database was renamed but the schema was NOT updated to include the new fields suggested (Severity, Duration, Root Cause, Action Items, etc.).

---

## 7. Postmortems Main Page

**Page URL:** https://www.notion.so/Postmortems-8a92d254d42546b7916f12e34c4ec251  
**Status:** NOT UPDATED
**Planned Action:** UPDATE with new section about incident management process

The page content remains unchanged from the backup. The suggested section about Grafana IRM and incident management process was not added.

---

## 8. New Incident Pages

**Status:** PARTIALLY DELETED
- **21169f3c238780bf8af7ec8eb3dc687a**: ARCHIVED/TRASHED ✓
- **21169f3c238780329be7e4ec016883b6**: ARCHIVED/TRASHED ✓  
- **ac7dda43b89245689d2bd4bf4e297eab**: NOT DELETED (still active)

Two of the three "New Incident" pages were archived/trashed, but one remains active.

---

## Summary of Implementation Status

### ✅ Completed:
1. Main Incident Management page updated with Grafana IRM process
2. Incident Response Guidelines merged into main page
3. Process setup page archived/trashed
4. Database renamed from "Incidents" to "Postmortems"
5. Two of three "New Incident" pages archived/trashed

### ❌ Not Completed:
1. Incidents page not deleted
2. Incident reports page not deleted
3. Incident Report Template not deleted
4. Database schema not updated with new fields
5. Postmortems page not updated with new content
6. One "New Incident" page still active
7. Status page URL not changed (remains status.nx.app)
8. No new "On-Call Procedures" page created

### 📝 Partial Implementation:
- Main page updated but missing many planned details (escalation matrix, bash commands, severity levels, etc.)
- Database renamed but schema not modernized
- Some cleanup done but not comprehensive