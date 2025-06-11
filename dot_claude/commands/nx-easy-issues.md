# Nx: Easy Issues

This command helps find GitHub issues that are easy to resolve and close for the current repo.

The ideal candidates are stale issues that can be closed without code changes.

You can use the `gh` CLI command to find **open** issues. Note, do not care about closed issues (i.e. state is closed).

_I'll_ provide _YOU_ with a date range to check and you should convert it to `yyyy-mm-dd..yyyy-mm-dd` so `gh` can filter from it. If I do not provide a date range, then assume it is for the past year.

## Implementation Steps

### 1. Get Date Range
```bash
# Get date from one year ago
date -v-1y +%Y-%m-%d  # macOS
# or
date -d "1 year ago" +%Y-%m-%d  # Linux
```

### 2. Search for Issues by Category
Use multiple `gh` searches to find different types of easy issues:

```bash
# Issues with reproductions
gh issue list -R nrwl/nx -s open --search "created:2024-06-10..2025-06-10 repro OR reproduction in:body,comments" -L 100 --json number,title,body,comments,createdAt,updatedAt,labels,reactionGroups,author > /tmp/nx-issues-repro.json

# Stale issues with low engagement (6+ months old)
gh issue list -R nrwl/nx -s open --search "created:2024-06-10..2024-12-10 comments:<5" -L 100 --json number,title,body,comments,createdAt,updatedAt,labels,reactionGroups,author > /tmp/nx-issues-stale.json

# Documentation issues
gh issue list -R nrwl/nx -s open --search "created:2024-06-10..2025-06-10 documentation OR docs in:title,body" -L 50 --json number,title,body,comments,createdAt,updatedAt,labels,reactionGroups,author > /tmp/nx-issues-docs.json

# Issues with workarounds
gh issue list -R nrwl/nx -s open --search "created:2024-06-10..2025-06-10 workaround in:body,comments" -L 50 --json number,title,body,comments,createdAt,updatedAt,labels,reactionGroups,author > /tmp/nx-issues-workaround.json
```

**Note**: Use `reactionGroups` instead of `reactions` field to avoid errors.

### 3. Analyze Issues Script

Create and run this Node.js script to analyze the collected issues:

```javascript
#!/usr/bin/env node

const fs = require('fs');

// Load all issue files
const issueFiles = [
  '/tmp/nx-issues-repro.json',
  '/tmp/nx-issues-stale.json',
  '/tmp/nx-issues-docs.json',
  '/tmp/nx-issues-workaround.json'
];

const allIssues = new Map();

// Merge all issues into a single map to avoid duplicates
issueFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const issues = JSON.parse(fs.readFileSync(file, 'utf8'));
    issues.forEach(issue => {
      allIssues.set(issue.number, issue);
    });
  }
});

// Analyze issues for easiness criteria
const easyIssues = [];

allIssues.forEach(issue => {
  const criteria = {
    number: issue.number,
    title: issue.title,
    url: `https://github.com/nrwl/nx/issues/${issue.number}`,
    created: new Date(issue.createdAt),
    updated: new Date(issue.updatedAt),
    labels: issue.labels.map(l => l.name),
    author: issue.author.login,
    reasons: [],
    score: 0
  };

  // Check for reproduction
  const bodyAndComments = issue.body + ' ' + issue.comments.map(c => c.body).join(' ');
  if (bodyAndComments.match(/github\.com\/[\w-]+\/[\w-]+/i) && 
      (bodyAndComments.includes('repro') || bodyAndComments.includes('reproduction'))) {
    criteria.reasons.push('Has reproduction repository');
    criteria.score += 3;
  }

  // Check if it's documentation related
  if (issue.title.toLowerCase().includes('doc') || 
      issue.body.toLowerCase().includes('documentation') ||
      criteria.labels.some(l => l.toLowerCase().includes('doc'))) {
    criteria.reasons.push('Documentation issue');
    criteria.score += 2;
  }

  // Check for workaround
  if (bodyAndComments.toLowerCase().includes('workaround')) {
    criteria.reasons.push('Has workaround posted');
    criteria.score += 2;
  }

  // Check staleness (older than 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  if (criteria.created < sixMonthsAgo) {
    criteria.reasons.push('Older than 6 months');
    criteria.score += 1;
  }

  // Check engagement (low reactions and comments)
  const totalReactions = issue.reactionGroups ? 
    issue.reactionGroups.reduce((sum, rg) => sum + rg.users.totalCount, 0) : 0;
  const commentCount = issue.comments.length;
  
  if (totalReactions < 5 && commentCount < 5) {
    criteria.reasons.push(`Low engagement (${totalReactions} reactions, ${commentCount} comments)`);
    criteria.score += 1;
  }

  // Check for dependency update issues
  if (bodyAndComments.match(/update|upgrade|bump|dependency|dependencies/i)) {
    criteria.reasons.push('Dependency update related');
    criteria.score += 2;
  }

  // Check for configuration issues
  if (bodyAndComments.match(/config|configuration|setup|install/i)) {
    criteria.reasons.push('Configuration/setup issue');
    criteria.score += 1;
  }

  // Only include issues with score >= 2
  if (criteria.score >= 2) {
    easyIssues.push(criteria);
  }
});

// Sort by score descending
easyIssues.sort((a, b) => b.score - a.score);

// Group by theme
const themes = {
  documentation: [],
  stale: [],
  workaround: [],
  dependencies: [],
  configuration: [],
  reproduction: []
};

easyIssues.forEach(issue => {
  if (issue.reasons.some(r => r.includes('Documentation'))) {
    themes.documentation.push(issue);
  } else if (issue.reasons.some(r => r.includes('Older than 6 months'))) {
    themes.stale.push(issue);
  } else if (issue.reasons.some(r => r.includes('workaround'))) {
    themes.workaround.push(issue);
  } else if (issue.reasons.some(r => r.includes('Dependency'))) {
    themes.dependencies.push(issue);
  } else if (issue.reasons.some(r => r.includes('Configuration'))) {
    themes.configuration.push(issue);
  } else if (issue.reasons.some(r => r.includes('reproduction'))) {
    themes.reproduction.push(issue);
  }
});

console.log('Easy Issues Summary:');
console.log('==================');
console.log(`Total easy issues found: ${easyIssues.length}`);
console.log('\nBy Theme:');
Object.entries(themes).forEach(([theme, issues]) => {
  if (issues.length > 0) {
    console.log(`- ${theme}: ${issues.length} issues`);
  }
});

// Output detailed results
fs.writeFileSync('/tmp/easy-issues-analysis.json', JSON.stringify({
  summary: {
    total: easyIssues.length,
    byTheme: Object.entries(themes).reduce((acc, [theme, issues]) => {
      acc[theme] = issues.length;
      return acc;
    }, {})
  },
  issues: easyIssues,
  themes
}, null, 2));

console.log('\nTop 25 easiest issues:');
easyIssues.slice(0, 25).forEach(issue => {
  console.log(`\n#${issue.number}: ${issue.title}`);
  console.log(`  Score: ${issue.score}`);
  console.log(`  Reasons: ${issue.reasons.join(', ')}`);
  console.log(`  URL: ${issue.url}`);
});
```

## Criteria for "easiness" of issues

An issue is easy if it fits the following criteria:

### Scoring System
- **Has reproduction repository**: +3 points
- **Documentation issue**: +2 points
- **Has workaround posted**: +2 points
- **Dependency update related**: +2 points
- **Older than 6 months**: +1 point
- **Low engagement** (<5 reactions AND <5 comments): +1 point
- **Configuration/setup issue**: +1 point

Issues with score >= 2 are considered "easy".

### Resolution Readiness:
- There is a reproduction linked in the description or one of the comments (a repro must be a link to a public GitHub repo).
- Issues that only require updating dependencies
- Issues with consensus on the solution approach
- Issues that are duplicates of already-fixed problems
- Issues with workarounds already posted
- Issues resolved by recent commits but not yet closed

### Technical Complexity:
- Documentation-only fixes (typos, broken links, outdated examples)
- Issues with clear error messages or stack traces
- Configuration or setup issues with known solutions
- Issues affecting only examples or demo projects
- Single-line or small code changes (< 10 lines)
- Issues already diagnosed with root cause identified

### User Impact:
- Edge case issues affecting very few users
- Issues only occurring in outdated versions

### Staleness:
- The issue is older than 6 months old (this is less important, but generally older issues may be stale).
- There are not much engagements in terms of reactions or comments (less than 5 reactions and less than 5 comments). 
- There is an open pull-request attached to the issue.

## CRITICAL: Where to store files

Store a file `.ai/yyyy-mm-dd/tasks/nx-easy-issues-[theme].md` where `yyyy-mm-dd` is today's datestamp. You can use `dot_ai` if `.ai` is not a folder under current repo root. Replace `[theme]` with the general theme, like `react-issues`, `stale-issues`, or whatever you can come up with. If you cannot find a theme, just leave it off. ALSO, keep ALL files under the same tasks folder so we don't pollute the repo.

## Sample Bulk Closure Commands

```bash
# Close issues with workarounds
gh issue close -R nrwl/nx 29359 28726 29641 28832 28148 27368 \
  -c "Closing this issue as a workaround has been provided. Please try the latest version of Nx and reopen if the issue persists."

# Close stale issues  
gh issue close -R nrwl/nx 28183 27816 27887 \
  -c "Closing this issue due to inactivity (6+ months). Please feel free to reopen with updated information if this is still relevant in the latest version of Nx."
```

