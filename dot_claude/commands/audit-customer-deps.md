---
description: >
  Map customer dependencies across strategic features. Identifies concentration
  risk where key features depend on a small number of validation customers.
  Tracks engagement freshness and DPE capacity. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Customer Dependency Concentration Audit

Map which customers are tied to which strategic features, assess engagement
health, and identify concentration risks where losing a single customer
would eliminate the feedback loop for a critical initiative.

## Scope

$ARGUMENTS

If no arguments: audit all known strategic customers across all teams. If
arguments provided (e.g., "Maven customers only", "churned customers"):
scope accordingly.

## File Management

Area directory: `.ai/para/areas/customer-deps/`

1. Current month as `YYYY-MM` (for report naming).
2. If `.ai/para/areas/customer-deps/YYYY-MM.md` exists, read it and
   **update in place**. Preserve lines starting with `> NOTE:`.
3. If not, create new. Ensure README.md exists and links this report.

### README.md structure

```markdown
# Customer Dependency Analysis

Monthly mapping of customer dependencies on strategic features. Tracks
engagement health, DPE capacity, and concentration risk.

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line highlight}
```

## Data Collection

### Step 1: Identify Strategic Customers

Use Linear MCP to search for customer names across all teams. Known
strategic customers to always check (update this list as needed):

**Enterprise / Single Tenant:**
- RBC (Royal Bank of Canada)
- CIBC (Canadian Imperial Bank of Commerce)
- Entain
- Vattenfall
- Skyscanner
- PayFit
- Emeria
- Flutterint (Flutter Entertainment)
- Caesars (check if still active)
- Hilton
- Wix

**Key Accounts (Cloud SaaS):**
- Capital One
- Medianet
- MECCA
- Crexi
- Celonis

For each customer:
1. `list_issues` with query="{customer name}" across all teams
2. Note the total count, open count, and most recent activity date
3. Check for issues updated in the last 30 days

### Step 2: Map Feature Dependencies

For each strategic feature (pull from active projects):

1. Which customers are validation/beta users?
2. How many customers are actively using it?
3. If the feature is paused/deferred, who loses momentum?

Features to always map:
- Maven Support
- .NET/Dotnet Support
- Gradle
- Self-Healing CI
- Task Sandboxing / IO Tracing
- Polygraph / Conformance
- Docker Multi-Arch
- Task Distribution (DTE)
- Azure Infrastructure

### Step 3: DPE Capacity

From the customer issue data, identify which DPE is primary for each customer.
Build a DPE-to-customer mapping and check for:

- Any DPE covering 4+ customers
- Any DPE who is single point of contact with no backup
- Customers without an assigned DPE

### Step 4: Churn Detection

Look for signals of customer disengagement:

- No issue activity in 60+ days
- ST instance removal issues (INF team)
- Contract/license issues marked as canceled
- Customers mentioned only in historical issues

## Analysis Framework

### Concentration Risk Rating

| Risk Level | Criteria |
|------------|----------|
| **CRITICAL** | Feature depends on 1 customer for validation, and that customer shows disengagement signals |
| **HIGH** | Feature depends on 1-2 customers, all active |
| **MEDIUM** | Feature has 3+ validation customers |
| **LOW** | Feature doesn't depend on specific customer validation |

### Engagement Health

For each customer, classify:

| Status | Criteria |
|--------|----------|
| **Very Active** | 5+ open issues, activity within 7 days |
| **Active** | 1+ open issues, activity within 30 days |
| **Cooling** | Open issues but no activity in 30-60 days |
| **Cold** | No activity in 60+ days |
| **Churned** | ST instance removed, contract not renewed |

### DPE Load Assessment

| Load | Criteria |
|------|----------|
| **Overloaded** | 4+ active customers |
| **Full** | 3 active customers |
| **Available** | 1-2 active customers |
| **Underutilized** | 0-1 customers |

## Write the Report

```markdown
# Customer Dependency Analysis — {Month Year}

_Last updated: {datetime}_
_Customers analyzed: {N}_

## Executive Summary

{3-5 bullets: critical concentration risks, engagement changes, DPE concerns}

## Customer Matrix

| Customer | Feature Dependencies | Open Issues | Last Activity | Status | Primary DPE |
|----------|---------------------|-------------|---------------|--------|-------------|
| ... | ... | ... | ... | ... | ... |

## Feature Concentration Risk

| Feature | Validation Customers | Risk Level | Notes |
|---------|---------------------|------------|-------|
| Maven | {list} | {level} | ... |
| .NET | {list} | {level} | ... |
| ... | ... | ... | ... |

## Customer Deep Dives

### {Customer Name} — {Engagement Status}

**Feature dependencies:** {list}
**Open issues:** {N}
**Last activity:** {date}
**Primary DPE:** {name}

**Key findings:**
- {notable issues, risks, opportunities}

**Action items:**
- {specific follow-ups needed}

{Repeat for each customer with notable findings}

## DPE Capacity

| DPE | Customers | Load |
|-----|-----------|------|
| ... | ... | ... |

### Risks
- {DPE overload concerns}
- {Single points of failure}

## Churn & Disengagement

### Churned Customers
| Customer | When | Notes |
|----------|------|-------|
| ... | ... | ... |

### Cooling Customers (Watch List)
| Customer | Last Activity | Feature at Risk |
|----------|---------------|-----------------|
| ... | ... | ... |

## Recommendations

| # | Action | Owner | Priority | Why |
|---|--------|-------|----------|-----|
| ... | ... | ... | ... | ... |
```

Save to `.ai/para/areas/customer-deps/YYYY-MM.md` and update README.md.
