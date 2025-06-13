# Update Incident Response Documentation for Grafana IRM

**Task Type:** Documentation Update / Process Migration  
**Date:** 2025-06-13  
**Estimated Duration:** 4-6 hours  
**Priority:** Critical

## Context

Based on the incident response audit and the new process description, we need to update all incident response documentation to:
1. Replace BetterStack references with Grafana IRM
2. Document the new incident response process
3. Clarify the separation between Grafana (incidents) and Notion (postmortems only)
4. Update status page references from status.nx.app to status.nx.dev
5. Document the on-call rotation process

## Referenced Documents
- Audit: `dot_ai/2025-06-13/tasks/incident_response_pages.md`
- Backed up pages: `dot_ai/2025-06-13/tasks/notion-incident-pages/`
- Cleanup plan: `dot_ai/2025-06-13/tasks/incident-response-cleanup-plan.md`

## Plan Overview

This task will create a comprehensive document with suggested content updates for each Notion page, focusing on migrating from BetterStack to Grafana IRM and implementing the new incident response process.

## Milestone 1: Create Content Update Document

### Step 1: Create Master Update Document (1 hour)
**Goal:** Create a single document with all suggested content changes

**Tasks:**
- [ ] Create `grafana-irm-content-updates.md` with sections for each page
- [ ] Include before/after content for each change
- [ ] Provide complete replacement text where needed
- [ ] Mark pages for deletion vs update

**Output File:** `dot_ai/2025-06-13/tasks/grafana-irm-content-updates.md`

**Structure:**
```markdown
# Grafana IRM Content Updates

## Overview
[Summary of changes]

## New Process Documentation
[Complete new process description]

## Page-by-Page Updates

### 1. Incident Management (Main Page)
**Action:** UPDATE
**Current Content:** [excerpt]
**New Content:** [complete replacement]

### 2. Incidents Page
**Action:** DELETE
**Reason:** Incidents managed in Grafana only

[... continue for all pages]
```

**Reasoning:** Single document makes it easy to review and implement all changes

### Step 2: Document New Process Flow (1 hour)
**Goal:** Create clear documentation of the new incident response process

**Key Sections to Document:**
- [ ] Alert Detection and Monitoring
  - Grafana alerts for 503s, errors, downtime
  - Slack channel: `grafana_irm`
  - Alert acknowledgment process
  
- [ ] On-Call Rotation
  - Weekly rotation schedule
  - Team composition (Infra + App teams)
  - 2-month cycle between rotations
  - Working hours coverage
  
- [ ] Incident Creation and Management
  - All incidents through Grafana IRM only
  - Automatic vs manual incident creation
  - No incident tracking in Notion
  
- [ ] Communication Protocols
  - Internal: Slack + Zoom/Slack Huddles
  - External: Atlassian Status Page (status.nx.dev)
  - Customer communication via DPE team
  - Account manager coordination
  
- [ ] Resolution Process
  - First response: pod restarts
  - Escalation to code changes
  - Monitoring post-fix
  
- [ ] Postmortem Process
  - Single Notion database for postmortems
  - No incident reports in Notion
  - External customer communications managed by DPE/Maria/Joe

**Reasoning:** Clear process documentation prevents confusion during incidents

### Step 3: Create Replacement Content (1.5 hours)
**Goal:** Write complete replacement content for key pages

**Priority Pages:**
1. **Incident Management (Main)**
   - [ ] Remove all BetterStack references
   - [ ] Add Grafana IRM workflows
   - [ ] Update status page URL
   - [ ] Add on-call procedures
   
2. **New Incident Response Overview**
   - [ ] Complete process flow diagram
   - [ ] Tool ecosystem (Grafana, Slack, Zoom, Notion)
   - [ ] Roles and responsibilities
   
3. **On-Call Procedures**
   - [ ] Rotation schedule
   - [ ] Handoff process
   - [ ] Alert monitoring guidelines
   - [ ] Escalation criteria

**Reasoning:** These pages form the core of incident response documentation

### Step 4: Identify Deletions and Merges (30 minutes)
**Goal:** List pages to remove or consolidate

**Pages to Delete:**
- [ ] Incidents page (redundant, use Grafana)
- [ ] Incident reports page (no incident tracking in Notion)
- [ ] New Incident templates (incidents in Grafana only)
- [ ] Incident management process setup (merge into main)

**Pages to Update:**
- [ ] All postmortem pages (standardize naming)
- [ ] Disaster recovery pages (update tool references)

**Databases to Modify:**
- [ ] Incidents database → Convert to postmortems-only
- [ ] Remove incident tracking fields
- [ ] Add postmortem-specific fields

**Reasoning:** Simplify structure to match new process

## Milestone 2: Create Implementation Guide

### Step 5: Write Migration Checklist (30 minutes)
**Goal:** Step-by-step guide for implementing changes

**Checklist Sections:**
- [ ] Pre-migration tasks
- [ ] Page update sequence
- [ ] Validation steps
- [ ] Rollback procedures

**Output:** Include in main document

**Reasoning:** Ensures smooth transition without breaking existing processes

### Step 6: Create Quick Reference Guide (30 minutes)
**Goal:** One-page summary of new process

**Contents:**
- [ ] Process flowchart
- [ ] Key contacts and channels
- [ ] Tool quick links
- [ ] Common scenarios

**Reasoning:** Quick reference during incidents

## Alternative Approaches Considered

1. **Gradual Migration:** Update pages one by one over time
   - Pro: Less disruptive
   - Con: Confusion during transition period
   - Decision: Full cutover is clearer

2. **Keep Some Notion Incident Tracking:** Maintain lightweight incident log
   - Pro: Historical continuity
   - Con: Violates "single source of truth" principle
   - Decision: Clean separation - Grafana for incidents, Notion for postmortems

3. **Automate Documentation Updates:** Use scripts to update content
   - Pro: Faster execution
   - Con: Risk of breaking formatting
   - Decision: Manual updates for quality control

## Expected Outcomes

Upon completion:
1. **One comprehensive document** with all content updates
2. **Clear replacement text** for each page needing updates
3. **Deletion list** with justifications
4. **New process documentation** ready to copy/paste
5. **Implementation guide** for smooth transition
6. **Quick reference guide** for incident responders

## Success Criteria
- All BetterStack references identified and replaced
- Grafana IRM process clearly documented
- No ambiguity about tool usage
- Clean separation of concerns (Grafana vs Notion)
- On-call procedures documented
- Implementation can be done in single session

## Script/Artifact Creation

### Helper Script: `analyze-betterstack-refs.mjs`
```javascript
// Script to find all BetterStack references in backed up content
// Output: List of files and line numbers with BetterStack mentions
```

### Template: `incident-response-overview-template.md`
```markdown
// New incident response overview page template
// Ready to copy into Notion
```

## CRITICAL: Implementation Tracking

When executing this plan, keep track of progress IN THIS DOCUMENT:

### Milestone 1 Progress
- [x] Step 1: Create Master Update Document
  - [x] Document created
  - [x] All pages sectioned
- [x] Step 2: Document New Process Flow
  - [x] Alert detection documented
  - [x] On-call rotation documented
  - [x] Communication protocols documented
- [x] Step 3: Create Replacement Content
  - [x] Incident Management page rewritten
  - [x] New overview created
  - [x] On-call procedures written
- [x] Step 4: Identify Deletions and Merges
  - [x] Deletion list finalized
  - [x] Merge targets identified

### Milestone 2 Progress
- [x] Step 5: Write Migration Checklist
  - [x] Checklist created (in main document)
  - [x] Sequence defined
- [x] Step 6: Create Quick Reference Guide
  - [x] Flowchart created
  - [x] Contacts listed

### Issues Encountered
- Found 3 "New Incident" template pages instead of 1
- Status page URL needs updating from status.nx.app to status.nx.dev
- Discovered clear separation needed: Grafana for incidents, Notion for postmortems only

### Files Generated
1. Main document:
   - `grafana-irm-content-updates.md` (comprehensive update guide)
   
2. Helper files:
   - `analyze-betterstack-refs.mjs` (found 20 BetterStack references)
   - `incident-response-overview-template.md` (new overview page)
   - `quick-reference-guide.md` (one-page quick reference)

### Key Decisions Made
- Complete removal of incident tracking from Notion (only postmortems remain)
- Incidents database to be converted to postmortems-only database
- All "New Incident" templates to be deleted (use Grafana IRM)
- Status page integration is automatic via Grafana IRM (no manual updates)
