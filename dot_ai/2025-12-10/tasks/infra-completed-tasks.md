# Infrastructure Team - Completed Issues (2025)

**Report Generated:** 2025-12-10 11:14 ET

**Query Parameters:**
- Team: Infrastructure
- State: Done/Completed
- Date Range: 2025-01-01 onwards
- Limit: 250 issues

---

## Summary

**Note:** This report requires Linear API access via MCP tools. The structure below shows the expected format.

### Total Completed Issues by Assignee

| Assignee | Count | Top Issues |
|----------|-------|------------|
| TBD | TBD | TBD |

---

## Detailed Results by Assignee

### [Assignee Name 1]

**Total Completed:** [X] issues

**Top 5-10 Most Significant Issues:**

1. **[ISSUE-ID]** - [Issue Title]
   - Completed: [YYYY-MM-DD]
   - Significance: [Brief note on why this is significant]

2. **[ISSUE-ID]** - [Issue Title]
   - Completed: [YYYY-MM-DD]
   - Significance: [Brief note]

[Continue for top issues...]

**Full List:**
- [ISSUE-ID] - [Title] (Completed: YYYY-MM-DD)
- [Continue...]

---

### [Assignee Name 2]

[Repeat structure...]

---

## Query Requirements

To populate this report, use:

```
mcp__Linear__list_issues with parameters:
- team: "Infrastructure"
- state: "Done"
- createdAt: "2025-01-01"
- limit: 250
```

For each issue, capture:
- Issue ID (e.g., INFRA-123)
- Title
- Assignee name
- Completion date (completedAt or updatedAt)
- Labels/priority (if available)

---

## Notes

- Issues are grouped by assignee
- "Significant" issues identified by:
  - Keywords indicating major features (migration, release, deployment, refactor)
  - Infrastructure/architecture changes
  - Security or performance improvements
  - Cross-team dependencies
