# Nx Cloud Team - Completed Issues (2025)

**Generated:** 2025-12-10 11:14 ET

## Overview

This document tracks all completed issues from the Nx Cloud team in Linear for 2025.

## Data Collection Requirements

To populate this report, fetch issues with these parameters:
- **Team:** Nx Cloud (CLOUD- prefix)
- **State:** Done/Completed
- **Created Date:** >= 2025-01-01
- **Limit:** 250 (use pagination if needed)

## Instructions to Collect Data

Since the Linear MCP tools are not available in this session, you can collect this data using one of these methods:

### Option 1: Linear CLI
```bash
# Install Linear CLI if needed
npm install -g @linear/cli

# List completed issues
linear issue list \
  --team "Nx Cloud" \
  --state "Done" \
  --created-after "2025-01-01" \
  --limit 250
```

### Option 2: Linear GraphQL API
```graphql
query {
  issues(
    filter: {
      team: { name: { eq: "Nx Cloud" } }
      state: { name: { eq: "Done" } }
      createdAt: { gte: "2025-01-01" }
    }
    first: 250
  ) {
    nodes {
      identifier
      title
      assignee {
        name
      }
      completedAt
      createdAt
      url
    }
  }
}
```

### Option 3: Request Linear MCP Access
If you have Linear MCP configured, run:
```bash
# List teams first
mcp__Linear__list_teams

# Then fetch issues
mcp__Linear__list_issues \
  --team "Nx Cloud" \
  --state "Done" \
  --createdAt "2025-01-01" \
  --limit 250
```

## Report Format

Once data is collected, organize it as follows:

### Summary by Assignee

| Assignee | Total Completed | Top Issues |
|----------|----------------|------------|
| [Name] | [Count] | [List] |

### Detailed Issues by Assignee

#### [Assignee Name] ([Total Count] issues)

1. **[CLOUD-XXX]**: [Issue Title]
   - Completed: [Date]
   - URL: [Linear URL]

2. **[CLOUD-XXX]**: [Issue Title]
   - Completed: [Date]
   - URL: [Linear URL]

[Continue for top 5-10 most significant issues per person]

---

## Next Steps

1. Fetch the completed issues data using one of the methods above
2. Process the data to group by assignee
3. Sort issues by completion date or significance
4. Update this document with the results
5. Include summary statistics at the top

## Notes

- Issues may have been created before 2025 but completed in 2025
- Filter by `completedAt >= 2025-01-01` if available, otherwise use `createdAt`
- Consider both `Done` and `Completed` states depending on team workflow
- Use pagination if more than 250 issues exist
