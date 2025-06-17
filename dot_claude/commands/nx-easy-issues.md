# Nx: Easy Issues Analyzer (Enhanced AI Workflow)

This command helps identify GitHub issues in the `nrwl/nx` repo that are easy to close or fix with minimal human intervention. It is designed for use with an AI agent that can propose automated fixes, suggest closure comments, or prepare batch PRs.

The process includes data collection via GitHub CLI, issue analysis via Node.js, and intelligent scoring based on predefined heuristics.

---

## ⚙️ Setup Instructions

### 1. Set the Date Range

You may provide either an explicit date range (`YYYY-MM-DD..YYYY-MM-DD`) or a relative range (e.g. "past 6 months"). If not provided, default to the past year.

Use the following shell snippet to define the range dynamically:

```bash
# Default to past year
START_DATE=$(date -d "1 year ago" +%Y-%m-%d) # Linux
# START_DATE=$(date -v-1y +%Y-%m-%d)         # macOS
END_DATE=$(date +%Y-%m-%d)
```

---

### 2. Fetch Issues with GitHub CLI

Run this single `gh` command to retrieve all open issues in the date range:

```bash
gh issue list -R nrwl/nx -s open --search "created:${START_DATE}..${END_DATE}" -L 1000 \
  --json number,title,body,comments,createdAt,updatedAt,labels,reactionGroups,author > /tmp/nx-all-open-issues.json
```

> ✅ You can increase `-L` or add pagination if >1000 issues are expected.

---

### 3. Analyze Issues with Node.js

Use this command to execute the AI-ready analyzer:

```bash
node ./scripts/analyze-easy-issues.js /tmp/nx-all-open-issues.json
```

This will:

* Score issues based on helpfulness criteria
* Exclude complex or high-risk issues
* Classify issues by theme
* Output:
    * JSON results to `/tmp/easy-issues-analysis.json`
    * Markdown summaries to `.ai/YYYY-MM-DD/tasks/nx-easy-issues-[theme].md`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// --- Configuration ---
// This can be moved to a separate config.json file for true externalization
const config = {
  repo: 'nrwl/nx',
  outputDir: '/tmp', // Base directory for temporary files
  minScoreForEasy: 2,
  // Scoring weights
  scores: {
    hasReproduction: 3,
    documentationIssue: 2,
    hasWorkaround: 2,
    dependencyUpdate: 2,
    olderThanSixMonths: 1,
    lowEngagement: 1,
    configurationIssue: 1,
  },
  // Negative scoring/exclusion criteria
  negativeScores: {
    breakingChange: -10, // Effectively excludes
    complexDiscussion: -5,
    highEmotionalReaction: -5, // Needs sentiment analysis integration
    botCommentedNeedsRepro: -3,
  },
  // Keywords for detection
  keywords: {
    repro: ['repro', 'reproduction', 'repository', 'repo'],
    docs: ['doc', 'documentation', 'docs'],
    workaround: ['workaround'],
    dependency: ['update', 'upgrade', 'bump', 'dependency', 'dependencies'],
    config: ['config', 'configuration', 'setup', 'install'],
    breakingChange: ['breaking change', 'breaking changes', 'breaking-change'],
  }
};

// --- Helper Functions ---
function calculateDateRange(inputRange) {
  const now = new Date();
  let startDate = new Date();
  let endDate = now;

  if (inputRange) {
    // Attempt to parse explicit YYYY-MM-DD..YYYY-MM-DD
    const parts = inputRange.split('..');
    if (parts.length === 2) {
      startDate = new Date(parts[0]);
      endDate = new Date(parts[1]);
    } else {
      // Handle relative ranges (e.g., "past 6 months", "last 30 days")
      const lowerInput = inputRange.toLowerCase();
      if (lowerInput.includes('year')) {
        const years = parseInt(lowerInput.match(/\d+/)?.[0] || '1');
        startDate.setFullYear(now.getFullYear() - years);
      } else if (lowerInput.includes('month')) {
        const months = parseInt(lowerInput.match(/\d+/)?.[0] || '6');
        startDate.setMonth(now.getMonth() - months);
      } else if (lowerInput.includes('day')) {
        const days = parseInt(lowerInput.match(/\d+/)?.[0] || '30');
        startDate.setDate(now.getDate() - days);
      }
    }
  } else {
    // Default to past year
    startDate.setFullYear(now.getFullYear() - 1);
  }

  // Ensure valid dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.warn('Warning: Invalid date range provided. Defaulting to past year.');
    startDate = new Date();
    startDate.setFullYear(now.getFullYear() - 1);
    endDate = now;
  }

  return { start: startDate, end: endDate };
}


// Function to simulate NLP/Sentiment Analysis (placeholder)
function analyzeSentiment(text) {
  // In a real scenario, this would call an NLP API or use a local library.
  // For now, it's a simple keyword check.
  const negativeKeywords = ['frustrated', 'bug', 'broken', 'critical', 'failed', 'issue', 'not working'];
  const positiveKeywords = ['great', 'thanks', 'awesome', 'works'];

  let score = 0;
  negativeKeywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword)) {
      score--;
    }
  });
  positiveKeywords.forEach(keyword => {
    if (text.toLowerCase().includes(keyword)) {
      score++;
    }
  });

  if (score < -1) return 'negative';
  if (score > 0) return 'positive';
  return 'neutral';
}

// Function to check for bot activity (placeholder)
function hasBotCommented(comments) {
  // This is a simplistic check. A real bot check might involve specific bot usernames or comment patterns.
  return comments.some(comment => comment.author.login.includes('bot') && comment.body.includes('needs reproduction'));
}

// --- Main Script Logic ---
(async () => {
  const issueFile = process.argv[2] || path.join(config.outputDir, 'nx-all-open-issues.json');
  let allIssues = new Map();

  // Load all issues
  if (fs.existsSync(issueFile)) {
    const issues = JSON.parse(fs.readFileSync(issueFile, 'utf8'));
    issues.forEach(issue => {
      allIssues.set(issue.number, issue);
    });
  } else {
    console.error(`Error: Issue file not found at ${issueFile}. Please run 'gh issue list' first.`);
    process.exit(1);
  }

  const easyIssues = [];

  for (const [issueNumber, issue] of allIssues.entries()) {
    const criteria = {
      number: issue.number,
      title: issue.title,
      url: `https://github.com/${config.repo}/issues/${issue.number}`,
      created: new Date(issue.createdAt),
      updated: new Date(issue.updatedAt),
      labels: issue.labels.map(l => l.name),
      author: issue.author.login,
      reasons: [],
      score: 0,
      potentialActions: [] // New field to suggest AI actions
    };

    const bodyAndComments = issue.body + ' ' + issue.comments.map(c => c.body).join(' ');

    // --- Positive Scoring ---
    // Has reproduction
    const hasReproLink = bodyAndComments.match(/github\.com\/[\w-]+\/[\w-]+/i);
    const hasReproKeyword = config.keywords.repro.some(kw => bodyAndComments.toLowerCase().includes(kw));
    if (hasReproLink && hasReproKeyword) {
      criteria.reasons.push('Has reproduction repository');
      criteria.score += config.scores.hasReproduction;
      criteria.potentialActions.push('Review for automated fix of linked repro');
    }

    // Documentation issue
    const isDocIssue = config.keywords.docs.some(kw => issue.title.toLowerCase().includes(kw) || bodyAndComments.toLowerCase().includes(kw)) ||
                       criteria.labels.some(l => config.keywords.docs.some(kw => l.toLowerCase().includes(kw)));
    if (isDocIssue) {
      criteria.reasons.push('Documentation issue');
      criteria.score += config.scores.documentationIssue;
      criteria.potentialActions.push('Generate PR for docs fix');
    }

    // Has workaround
    if (config.keywords.workaround.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Has workaround posted');
      criteria.score += config.scores.hasWorkaround;
      criteria.potentialActions.push('Close with workaround comment');
    }

    // Dependency update
    if (config.keywords.dependency.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Dependency update related');
      criteria.score += config.scores.dependencyUpdate;
      criteria.potentialActions.push('Generate PR for dependency update');
    }

    // Staleness (older than 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    if (criteria.created < sixMonthsAgo) {
      criteria.reasons.push('Older than 6 months');
      criteria.score += config.scores.olderThanSixMonths;
      criteria.potentialActions.push('Close as stale');
    }

    // Low engagement
    const totalReactions = issue.reactionGroups ?
      issue.reactionGroups.reduce((sum, rg) => sum + rg.users.totalCount, 0) : 0;
    const commentCount = issue.comments.length;

    if (totalReactions < 5 && commentCount < 5) {
      criteria.reasons.push(`Low engagement (${totalReactions} reactions, ${commentCount} comments)`);
      criteria.score += config.scores.lowEngagement;
    }

    // Configuration/setup issue
    if (config.keywords.config.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Configuration/setup issue');
      criteria.score += config.scores.configurationIssue;
      criteria.potentialActions.push('Review for configuration fix');
    }

    // --- Negative Scoring/Exclusion Criteria ---
    // Breaking change
    if (config.keywords.breakingChange.some(kw => issue.title.toLowerCase().includes(kw) || criteria.labels.some(l => l.toLowerCase().includes(kw)))) {
      criteria.reasons.push('Contains "breaking change" keyword/label');
      criteria.score += config.negativeScores.breakingChange; // Penalize heavily
    }

    // Complex discussions (simple heuristic: many comments from different authors)
    const uniqueCommentAuthors = new Set(issue.comments.map(c => c.author.login));
    if (commentCount > 10 && uniqueCommentAuthors.size > 3) {
      criteria.reasons.push('Active/complex discussion detected');
      criteria.score += config.negativeScores.complexDiscussion;
    }

    // High emotional reactions (placeholder for sentiment analysis)
    const overallSentiment = analyzeSentiment(bodyAndComments + ' ' + issue.title);
    if (overallSentiment === 'negative') {
        criteria.reasons.push('Negative sentiment detected');
        criteria.score += config.negativeScores.highEmotionalReaction;
    }

    // Maintainer/Bot Activity (e.g., bot asked for repro)
    if (hasBotCommented(issue.comments)) {
      criteria.reasons.push('Bot has commented asking for reproduction');
      criteria.score += config.negativeScores.botCommentedNeedsRepro;
    }

    // --- Code Change Analysis (placeholder for future integration) ---
    // if (criteria.potentialActions.includes('Generate PR for docs fix') || criteria.potentialActions.includes('Generate PR for dependency update')) {
    //   // In a real scenario, after AI proposes a fix, you'd analyze the diff here.
    //   // For now, this is a conceptual placeholder.
    //   // If estimated lines of change > 100, might reduce score or remove 'easy' tag.
    //   // criteria.estimatedLinesChanged = analyzeProposedFix(issue);
    // }


    // Only include issues with score >= minScoreForEasy
    if (criteria.score >= config.minScoreForEasy) {
      easyIssues.push(criteria);
    }
  }

  // Sort by score descending
  easyIssues.sort((a, b) => b.score - a.score);

  // Group by primary theme (first reason listed)
  const themes = {
    documentation: [],
    stale: [],
    workaround: [],
    dependencies: [],
    configuration: [],
    reproduction: [],
    // Add new themes if needed
  };

  easyIssues.forEach(issue => {
    // Prioritize themes for grouping based on "reasons"
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
    // Add more specific theme groupings here if desired
  });

  console.log('Easy Issues Summary:');
  console.log('====================');
  console.log(`Total easy issues found: ${easyIssues.length}`);
  console.log('\nBy Theme:');
  Object.entries(themes).forEach(([theme, issues]) => {
    if (issues.length > 0) {
      console.log(`- ${theme}: ${issues.length} issues`);
    }
  });

  // Output detailed results
  const outputFilePath = path.join(config.outputDir, 'easy-issues-analysis.json');
  fs.writeFileSync(outputFilePath, JSON.stringify({
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
    console.log(`  Potential AI Actions: ${issue.potentialActions.length > 0 ? issue.potentialActions.join(', ') : 'None suggested'}`);
    console.log(`  URL: ${issue.url}`);
  });

  console.log(`\nDetailed analysis saved to: ${outputFilePath}`);

})().catch(error => {
  console.error('An error occurred:', error);
});
```

---

## 🧠 Scoring Criteria for “Easy” Issues

### ✅ Positive Scoring

| Criteria                       | Score | Notes                              |
| :----------------------------- | :---- | :--------------------------------- |
| Has reproduction (GitHub repo) | +3    | Detects repro links + keywords     |
| Documentation-related          | +2    | Labels or mentions `docs`          |
| Workaround posted              | +2    | “workaround” in comments/body      |
| Dependency update              | +2    | Mentions “update”, “upgrade”, etc. |
| Older than 6 months            | +1    | Based on `createdAt`               |
| Low engagement                 | +1    | <5 comments + <5 reactions         |
| Config/setup issue             | +1    | Mentions “config”, “install”, etc. |

---

### 🚫 Negative Scoring

| Criteria                             | Penalty | Notes                               |
| :----------------------------------- | :------ | :---------------------------------- |
| Marked or labeled as breaking        | -10     | Excludes automatically              |
| Complex discussion (>10 comments)    | -5      | >3 unique participants              |
| Negative sentiment (frustrated, etc) | -5      | Placeholder: simple sentiment check |
| Bot asked for reproduction           | -3      | Indicates issue is not actionable yet |

---

## 🎯 AI Action Suggestions

Based on analysis, AI can propose:

| Action Type                    | When Triggered                       |
| :----------------------------- | :----------------------------------- |
| `Close as stale`               | Old + low engagement                 |
| `Close with workaround`        | If workaround posted                 |
| `Generate PR: docs fix`        | For docs-related issues              |
| `Generate PR: dependency bump` | For versioning/dependency complaints |
| `Review for configuration fix` | When “setup/config/install” mentioned |
| `Skip - breaking change`       | Marked as too risky for automation   |

---

## 📂 Output Structure

Store markdown files under:

```
.ai/YYYY-MM-DD/tasks/nx-easy-issues-[theme].md
```

Where `[theme]` may be:

* `docs`
* `stale`
* `config`
* `dependencies`
* `reproduction`
* `workaround`

Example:

```
.ai/2025-06-17/tasks/nx-easy-issues-docs.md
```

---

## 🔁 Optional Closure Commands

Use AI to suggest these:

```bash
# Close with workaround
gh issue close -R nrwl/nx 12345 12346 \
  -c "Closing this issue as a workaround has been provided. Please try the latest version of Nx and reopen if needed."

# Close as stale
gh issue close -R nrwl/nx 11111 11112 \
  -c "Closing due to inactivity (6+ months). Please reopen if the issue persists."
```

---

## 🧩 Future Enhancements

* GitHub GraphQL to fetch `linkedPullRequests`
* Code diff estimation for proposed AI fixes
* NLP-based intent classification
* Sentiment detection using OpenAI or Claude

---
