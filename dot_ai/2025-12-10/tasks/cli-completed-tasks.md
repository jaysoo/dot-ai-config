# Nx CLI Team - Completed Issues (2025)

**Collection Date:** 2025-12-10 11:14 ET
**Team:** Nx CLI (NXC- prefix)
**Status:** Done/Completed
**Time Period:** January 1, 2025 - December 10, 2025

---

## Status

⚠️ **Linear MCP Tool Not Available**

The Linear MCP tools (mcp__Linear__list_teams, mcp__Linear__list_issues) are not available in this environment.

To complete this task, you have the following options:

1. **Run this request in an environment with Linear MCP enabled**
   - The Claude desktop app or web interface may have Linear MCP configured
   - Check your MCP configuration at `~/.claude/mcp.json`

2. **Use Linear CLI directly**
   ```bash
   # Install Linear CLI if needed
   npm install -g @linear/cli

   # Authenticate
   linear auth

   # Query completed issues
   linear issue list \
     --team "Nx CLI" \
     --state "Done" \
     --filter "createdAt >= 2025-01-01" \
     --limit 250
   ```

3. **Use Linear Web API**
   - Go to https://linear.app/nx/team/NXC
   - Apply filters: Status = Done, Created date >= 2025-01-01
   - Export to CSV

4. **Use GraphQL API directly**
   ```bash
   # Get API key from: https://linear.app/settings/api
   curl -X POST https://api.linear.app/graphql \
     -H "Authorization: YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"query":"query { issues(filter: { team: { key: { eq: \"NXC\" }}, state: { name: { eq: \"Done\" }}, createdAt: { gte: \"2025-01-01\" }}) { nodes { identifier title assignee { name } completedAt }}}"}'
   ```

---

## Expected Output Format

Once data is collected, the results should be organized as:

### Summary by Assignee
- **[Name]**: X completed issues
- **[Name]**: Y completed issues
- ...

### Detailed Issues by Assignee

#### [Assignee Name] (Total: X issues)

Top 5-10 Most Significant Issues:
1. **NXC-XXXX**: [Issue Title]
   - Completed: YYYY-MM-DD
   - Significance: [Why this is important]

2. **NXC-XXXX**: [Issue Title]
   - Completed: YYYY-MM-DD
   - Significance: [Why this is important]

[Continue for each assignee...]

---

## Notes

- Issues are from the "Nx CLI" team (NXC- prefix)
- Only includes issues marked as "Done" or completed
- Date range: 2025-01-01 to present (2025-12-10)
- Top issues should be selected based on impact, complexity, or significance
