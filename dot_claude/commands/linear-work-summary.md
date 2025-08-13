# Linear Work Summary

Generate a comprehensive work summary from Linear for a specified time period, listing all completed/cancelled issues by team and individual.

## CRITICAL: Common Mistakes to Avoid

**❌ DO NOT use `updatedAt` parameter** - This returns issues updated in the timeframe, NOT completed
**❌ DO NOT rely on a single API call** - Linear has token limits, you MUST fetch data in batches
**❌ DO NOT assume the first results are complete** - Always verify with known issues
**✅ DO use `createdAt` parameter** - This filters issues created after a date
**✅ DO fetch by team** - Each team should be queried separately to avoid token limits
**✅ DO verify results** - Check that known completed issues appear in your data

## Step-by-Step Instructions

### 1. Initial Setup
```bash
# Get current date for reference
date '+%Y-%m-%d'
```

### 2. Calculate Date Range
For a 60-day lookback from today:
- If today is 2025-08-13, use `createdAt: "2025-06-14"`
- Format: YYYY-MM-DD

### 3. Fetch Teams and Users
```javascript
// First, get all teams
mcp__Linear__list_teams({ limit: 250 })

// Then get all users  
mcp__Linear__list_users()
```

### 4. Fetch Issues by Team (CRITICAL APPROACH)

**IMPORTANT**: You MUST fetch issues team by team with proper pagination to avoid token limits.

```javascript
// For EACH team, fetch completed issues
// Example for Docs team:
mcp__Linear__list_issues({
  team: "Docs",
  state: "Done", 
  createdAt: "2025-06-14", // 60 days ago
  limit: 100 // Keep under token limit
})

// Also check for Canceled state
mcp__Linear__list_issues({
  team: "Docs",
  state: "Canceled",
  createdAt: "2025-06-14",
  limit: 50
})
```

### 5. Key Teams to Check (in order of activity)

1. **Docs** - Usually has most issues during platform migrations
2. **Nx CLI** - Core product development
3. **Nx Cloud** - Cloud platform features
4. **RedPanda** - Advanced features team
5. **Capybara** - Content and messaging
6. **Infrastructure** - System improvements
7. **Backend** - API and services
8. **Nx Dev Rel** - Developer relations
9. **Nx Enterprise** - Enterprise features
10. **Customer Success** - Customer-facing improvements

### 6. Verify Known Issues

**CRITICAL VERIFICATION STEP**: Always check these specific issues exist in your data:
- Search for issues by ID if user provides examples
- Use `mcp__Linear__get_issue({ id: "DOC-66" })` to verify individual issues
- If known issues are missing, your date filtering is wrong

### 7. Data Organization Structure

Organize the collected data as:

```javascript
{
  "teams": {
    "Docs": {
      "completed": [...],
      "canceled": [...]
    },
    "Nx CLI": {
      "completed": [...],
      "canceled": [...]
    }
  },
  "byUser": {
    "Jack Hsu": {
      "issues": [...],
      "teams": ["Docs", "Nx CLI"],
      "count": 11
    }
  }
}
```

### 8. Create Output Files

Create two markdown files in `.ai/YYYY-MM-DD/` directory:

#### File 1: `linear-work-detailed-complete.md`
Should include:
- Complete list of ALL teams and users
- Every issue with ID, title, assignee, dates
- Group by team first, then by individual
- Include priority, project, and labels
- Show both completed and canceled separately

#### File 2: `linear-work-summary-complete.md`
Should include:
- Executive summary with total counts
- Top contributors by volume
- Major initiatives and projects
- Key achievements by category
- Timeline analysis
- Recommendations

## Example Usage

When user asks: "I want a summary of everyone's work in Linear for the past 60 days"

1. Calculate date 60 days ago
2. Fetch all teams and users first
3. For each team, fetch Done and Canceled issues separately
4. If you hit token limits, reduce the `limit` parameter
5. Compile all data into comprehensive structure
6. Create both detailed and summary markdown files
7. VERIFY known issues are included before finalizing

## Token Limit Handling

If you get error: "MCP tool response exceeds maximum allowed tokens"
- Reduce `limit` parameter to 25 or even 10
- Fetch in smaller date ranges if needed
- Use pagination with `after` parameter for large result sets

## Success Criteria

✅ Report includes 40+ issues minimum for active 60-day period
✅ All major teams are represented
✅ Known completed issues appear in the data
✅ Both completed and canceled issues are captured
✅ Individual contributions are accurately attributed
✅ Summary provides actionable insights

## Common Issues and Solutions

**Problem**: Only seeing 10-12 issues total
**Solution**: You're using wrong date filter or only fetching one team

**Problem**: Missing known completed issues
**Solution**: Use `createdAt` not `updatedAt`, check date range

**Problem**: Token limit errors
**Solution**: Reduce batch size, fetch teams separately

**Problem**: Missing team data
**Solution**: Some teams may have no activity, that's normal

## Final Checklist

- [ ] Used correct date parameter (createdAt for past X days)
- [ ] Fetched all active teams separately
- [ ] Included both Done and Canceled states
- [ ] Verified known issues appear in results
- [ ] Created detailed markdown with all issues
- [ ] Created summary markdown with insights
- [ ] Organized by both team and individual
- [ ] Included completion velocity metrics