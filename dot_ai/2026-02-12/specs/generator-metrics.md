# CLI Analytics for Enterprise Customers

**Status:** Proposal
**Target:** March/April 2026
**Customers:** Fidelity, Block/Square

## Problem Statement

Enterprise customers want visibility into how their developers use the Nx CLI across their organization. They need to answer questions like:

- "How often are developers running our custom generators?"
- "Which Nx commands are most used in our workspace?"
- "Are our custom tooling investments being adopted over time?"

Currently, the post-task hooks only fire for task executions, leaving a gap for non-task commands like generators, `nx reset`, `nx graph`, `nx migrate`, etc.

## Motivation

- **ROI justification**: Enterprises invest significant effort building custom generators. They need data to justify continued investment or deprecation decisions.
- **Adoption tracking**: Understanding whether developers are actually using provided tooling vs. manual approaches.
- **Customer request**: Fidelity has specifically asked for generator execution details. Block/Square has also expressed interest.

## Target Audience

**Enterprise Nx Cloud customers** who:

- Build custom workspace generators
- Want to measure developer tooling adoption
- Need data to justify tooling investments

This is an **enterprise-tier feature**. Non-enterprise workspaces will not have data collected or stored.

## Proposed Solution

### Overview

Extend the Nx CLI to send command usage events to Nx Cloud, mirroring the data collected for internal GA analytics (PR #34144). Enterprise customers can view usage analytics in a Cloud dashboard.

### Scope: Match GA Analytics 1:1

The internal GA analytics PR tracks:

- **All CLI commands** - `nx generate`, `nx reset`, `nx graph`, `nx migrate`, `nx add`, etc.
- **Command arguments** - with sensitive values redacted (project names, file paths, credentials → `<redacted>`)
- **Generator invocations** - which generator was run
- **Context** - Nx version, Node version, package manager

Cloud analytics will capture the same data, enabling enterprise customers to:

- Filter by command type (generators, migrations, etc.)
- See usage trends over time
- Drill into specific commands or generators

### Key Design Decisions

| Decision          | Choice                           | Rationale                                                              |
| ----------------- | -------------------------------- | ---------------------------------------------------------------------- |
| Consent model     | Cloud connection implies consent | Enterprises explicitly set up Cloud; no additional opt-in needed       |
| Data collection   | Enterprise-only                  | Non-enterprise data is discarded at Cloud endpoint; cleaner data story |
| Scope             | All CLI commands (match GA)      | Full visibility, not limited to generators                             |
| Ingestion pattern | Fire-and-forget                  | Non-blocking, failures silently ignored                                |
| Time granularity  | Weekly aggregates                | Sufficient for trend analysis, manageable storage                      |
| Data retention    | 1 year                           | Enough history for annual ROI reviews                                  |

### Dashboard Views

1. **Command usage counts**: Which commands/generators are used and how often
2. **Adoption trends over time**: Weekly usage patterns, growth/decline

Filtering by command type, time range, and other dimensions.

## Implementation Phases

### Phase 1: CLI Instrumentation

- Extend GA analytics code path to also send to Cloud endpoint
- Reuse existing event data and privacy/redaction logic
- Send only when Cloud-connected

### Phase 2: Cloud Backend

- New ingestion endpoint accepting CLI events
- Tier check: accept only from enterprise workspaces
- Storage and aggregation

### Phase 3: Cloud Dashboard

- UI showing command/generator usage
- Time-series trends
- Filtering capabilities

## Success Metrics

### Milestones

1. **Dogfood**: Nx and Ocean repos generating analytics data, visible in Cloud
2. **Customer pilot**: Fidelity onboarded and actively using the dashboard
3. **Qualitative validation**: Survey feedback from Fidelity confirming value
4. **Long-term adoption**: Dashboard page views and query activity

### Quantitative Metrics

- Number of enterprise workspaces with analytics data flowing
- Percentage of enterprise customers viewing the dashboard

### Qualitative Metrics

- Customer satisfaction survey results
- Feature mentioned in renewal/expansion conversations

## Open Questions

- Dashboard placement within Cloud UI (new section vs. existing analytics area)
- Alerting/notifications (e.g., "generator usage dropped 50% this week") - future enhancement?

## References

- Slack thread: https://nrwl.slack.com/archives/C6WJMCAB1/p1770674582319699
- GA Analytics PR: https://github.com/nrwl/nx/pull/34144
