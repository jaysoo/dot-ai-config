---
title: Incidents (internal only)
page_id: 326f8c5b-6c17-41cd-b14f-f2d680200e8a
category: database
url: https://www.notion.so/326f8c5b6c1741cdb14ff2d680200e8a
retrieved_at: 2025-06-13T18:35:00Z
---

# Incidents (internal only) Database

This is the main incidents tracking database with the following properties:

## Database Schema

- **Name** (Title): The incident title/description
- **Date** (Date): When the incident occurred
- **Status** (Status): Current incident status
  - Suspected (To-do)
  - Active (In progress)
  - Resolved (Complete)
- **Instance** (Rich text): Affected instances/services
- **Incident manager** (People): Person managing the incident
- **Investigators** (People): Team members investigating

## Recent Incidents (Sample)

1. **IAM policy documents not applied [Single Tenant, AWS, all]** (2025-05-07)
   - Status: Resolved
   - Instance: All AWS Tenants, Mimecast/Flutter Symptomatic
   - Manager: Steve Pentland
   - Investigators: Steve Pentland, Caleb Ukle

2. **Early termination on Emeria's agents** (2025-04-25 to 2025-05-02)
   - Status: Resolved
   - Instance: Emeria ST
   - Investigators: Steven Nance, Altan Stalker, Louie Weng

3. **[Single Tenant] Emeria 502 issue** (2024-11-06)
   - Status: Resolved
   - Manager: Steve Pentland
   - Investigators: Patrick Mariglia, Altan Stalker, Rares Matei

4. **Scripting attack** (2024-07-04)
   - Status: Resolved
   - Investigators: Caleb Ukle, Steve Pentland, Nicole Oliver

## Issues Found

- Multiple "New Incident" entries that appear to be templates
- No severity field or SLA tracking
- No direct link to postmortems
- Missing fields for business impact or affected users