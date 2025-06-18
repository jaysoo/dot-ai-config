#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Configuration ---
const config = {
  repo: 'nrwl/nx',
  outputDir: '/tmp',
  minScoreForEasy: 4,
  // Scoring weights
  scores: {
    hasReproduction: 3,
    hasVerifiedWorkaround: 5,
    documentationIssue: 3,
    hasWorkaround: 2,
    simpleConfigFix: 3,
    dependencyUpdate: 1,
    olderThanSixMonths: 1,
    lowEngagement: 1,
    configurationIssue: 1,
    userProvidedFix: 4,
  },
  // Negative scoring/exclusion criteria
  negativeScores: {
    breakingChange: -10,
    complexDiscussion: -5,
    highEmotionalReaction: -5,
    botCommentedNeedsRepro: -3,
    architecturalChange: -8,
    upstreamDependency: -6,
    nativeModuleRequired: -8,
    packageManagerIssue: -6,
    migrationIssue: -4,
    moduleSystemMismatch: -5,
    multipleFailedAttempts: -4,
  },
  // Keywords for detection
  keywords: {
    repro: ['repro', 'reproduction', 'repository', 'repo'],
    docs: ['doc', 'documentation', 'docs', 'readme', 'guide', 'tutorial'],
    workaround: ['workaround', 'works if', 'fixed by', 'solution is'],
    verifiedWorkaround: ['this works', 'confirmed working', 'tested and works', '✓', '✅', 'works for me'],
    dependency: ['update', 'upgrade', 'bump', 'dependency', 'dependencies'],
    config: ['config', 'configuration', 'setup', 'install'],
    breakingChange: ['breaking change', 'breaking changes', 'breaking-change'],
    architectural: ['requires', 'architectural', 'refactor', 'redesign', 'major change'],
    upstream: ['upstream', 'third-party', 'external dependency', '@module-federation', 'webpack issue'],
    nativeModule: ['native', 'wasm', 'node-gyp', 'binding', 'compile', 'platform-specific'],
    packageManager: ['npm error', 'yarn error', 'pnpm error', 'ENOTEMPTY', 'ENOENT', 'node_modules'],
    migration: ['migration', 'migrate', 'upgrade from', 'breaking in', 'after update'],
    moduleSystem: ['ESM', 'CommonJS', 'require', 'import', 'module.exports', 'export default'],
    userFix: ['here\'s the fix', 'i fixed it', 'pr:', 'pull request:', 'patch:', 'diff:'],
  }
};

// --- Helper Functions ---
function analyzeSentiment(text) {
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

function hasBotCommented(comments) {
  return comments.some(comment => 
    comment.author.login.includes('bot') && 
    comment.body.includes('needs reproduction')
  );
}

// --- Main Script Logic ---
const main = async () => {
  const issueFile = process.argv[2] || path.join(config.outputDir, 'nx-all-open-issues.json');
  const allIssues = new Map();

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
      potentialActions: []
    };

    const bodyAndComments = (issue.body || '') + ' ' + issue.comments.map(c => c.body || '').join(' ');

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
    const isDocIssue = config.keywords.docs.some(kw => 
      issue.title.toLowerCase().includes(kw) || 
      bodyAndComments.toLowerCase().includes(kw)
    ) || criteria.labels.some(l => 
      config.keywords.docs.some(kw => l.toLowerCase().includes(kw))
    );
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

    // Has verified workaround
    if (config.keywords.verifiedWorkaround.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Has VERIFIED workaround');
      criteria.score += config.scores.hasVerifiedWorkaround;
      criteria.potentialActions.push('Implement verified workaround as fix');
    }

    // User provided fix
    if (config.keywords.userFix.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('User provided code fix');
      criteria.score += config.scores.userProvidedFix;
      criteria.potentialActions.push('Review and implement user-provided fix');
    }

    // Simple config fix
    const configPatterns = [
      /dependsOn.*:\s*\[.*\]/i,
      /"scripts".*:.*{/i,
      /"targets".*:.*{/i,
      /project\.json/i,
      /nx\.json/i
    ];
    if (configPatterns.some(pattern => bodyAndComments.match(pattern)) && 
        config.keywords.config.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Simple configuration fix');
      criteria.score += config.scores.simpleConfigFix;
      criteria.potentialActions.push('Apply configuration fix');
    }

    // Dependency update
    if (config.keywords.dependency.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Dependency update related');
      criteria.score += config.scores.dependencyUpdate;
      criteria.potentialActions.push('Generate PR for dependency update');
    }

    // Staleness
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    if (criteria.created < sixMonthsAgo) {
      criteria.reasons.push('Older than 6 months');
      criteria.score += config.scores.olderThanSixMonths;
      criteria.potentialActions.push('Close as stale');
    }

    // Low engagement
    const totalReactions = issue.reactionGroups ?
      issue.reactionGroups.reduce((sum, rg) => sum + (rg.users?.totalCount || 0), 0) : 0;
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

    // --- Negative Scoring ---
    // Breaking change
    if (config.keywords.breakingChange.some(kw => 
      issue.title.toLowerCase().includes(kw) || 
      criteria.labels.some(l => l.toLowerCase().includes(kw))
    )) {
      criteria.reasons.push('Contains "breaking change" keyword/label');
      criteria.score += config.negativeScores.breakingChange;
    }

    // Complex discussions
    const uniqueCommentAuthors = new Set(issue.comments.map(c => c.author.login));
    if (commentCount > 10 && uniqueCommentAuthors.size > 3) {
      criteria.reasons.push('Active/complex discussion detected');
      criteria.score += config.negativeScores.complexDiscussion;
    }

    // High emotional reactions
    const overallSentiment = analyzeSentiment(bodyAndComments + ' ' + issue.title);
    if (overallSentiment === 'negative') {
        criteria.reasons.push('Negative sentiment detected');
        criteria.score += config.negativeScores.highEmotionalReaction;
    }

    // Bot activity
    if (hasBotCommented(issue.comments)) {
      criteria.reasons.push('Bot has commented asking for reproduction');
      criteria.score += config.negativeScores.botCommentedNeedsRepro;
    }

    // Architectural change
    if (config.keywords.architectural.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Requires architectural changes');
      criteria.score += config.negativeScores.architecturalChange;
    }

    // Upstream dependency
    if (config.keywords.upstream.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Issue in upstream dependency');
      criteria.score += config.negativeScores.upstreamDependency;
    }

    // Native module
    if (config.keywords.nativeModule.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Requires native module compilation');
      criteria.score += config.negativeScores.nativeModuleRequired;
    }

    // Package manager issue
    if (config.keywords.packageManager.some(kw => bodyAndComments.toLowerCase().includes(kw))) {
      criteria.reasons.push('Package manager specific issue');
      criteria.score += config.negativeScores.packageManagerIssue;
    }

    // Migration issue
    if (config.keywords.migration.some(kw => bodyAndComments.toLowerCase().includes(kw)) &&
        !criteria.reasons.includes('Simple configuration fix')) {
      criteria.reasons.push('Complex migration issue');
      criteria.score += config.negativeScores.migrationIssue;
    }

    // Module system mismatch
    if (config.keywords.moduleSystem.some(kw => bodyAndComments.toLowerCase().includes(kw)) &&
        (bodyAndComments.toLowerCase().includes('error') || bodyAndComments.toLowerCase().includes('cannot'))) {
      criteria.reasons.push('Module system mismatch (ESM/CommonJS)');
      criteria.score += config.negativeScores.moduleSystemMismatch;
    }

    // Multiple failed attempts
    const failedAttemptPatterns = [
      /tried.*didn't work/i,
      /attempted.*failed/i,
      /pr.*closed/i,
      /multiple attempts/i
    ];
    if (failedAttemptPatterns.filter(pattern => bodyAndComments.match(pattern)).length >= 2) {
      criteria.reasons.push('Multiple failed fix attempts');
      criteria.score += config.negativeScores.multipleFailedAttempts;
    }

    // Only include issues with score >= minScoreForEasy
    if (criteria.score >= config.minScoreForEasy) {
      easyIssues.push(criteria);
    }
  }

  // Sort by score descending
  easyIssues.sort((a, b) => b.score - a.score);

  // Group by primary theme
  const themes = {
    documentation: [],
    stale: [],
    workaround: [],
    dependencies: [],
    configuration: [],
    reproduction: [],
    userFix: []
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
    } else if (issue.reasons.some(r => r.includes('Configuration')) || issue.reasons.some(r => r.includes('configuration'))) {
      themes.configuration.push(issue);
    } else if (issue.reasons.some(r => r.includes('reproduction'))) {
      themes.reproduction.push(issue);
    } else if (issue.reasons.some(r => r.includes('User provided code fix'))) {
      themes.userFix.push(issue);
    }
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

  // Generate themed markdown reports
  const todayDir = path.join(path.dirname(__dirname), '.');
  
  for (const [theme, issues] of Object.entries(themes)) {
    if (issues.length > 0) {
      const mdPath = path.join(todayDir, `nx-easy-issues-${theme}.md`);
      const mdContent = generateThemeReport(theme, issues);
      fs.writeFileSync(mdPath, mdContent);
      console.log(`\nTheme report saved to: ${mdPath}`);
    }
  }
};

function generateThemeReport(theme, issues) {
  const now = new Date().toISOString();
  let content = `# Nx Easy Issues - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme

Generated: ${now}
Total issues in this theme: ${issues.length}

## Summary

This report contains GitHub issues that are suitable for automated fixes or closure based on the "${theme}" theme.

## Issues

`;

  issues.forEach((issue, index) => {
    content += `### ${index + 1}. Issue #${issue.number}: ${issue.title}

- **URL**: ${issue.url}
- **Score**: ${issue.score}
- **Created**: ${issue.created.toISOString().split('T')[0]}
- **Author**: ${issue.author}
- **Labels**: ${issue.labels.join(', ') || 'None'}
- **Reasons**: ${issue.reasons.join(', ')}
- **Suggested Actions**: ${issue.potentialActions.join(', ') || 'None'}

`;
  });

  // Add batch action suggestions
  content += `\n## Batch Action Suggestions\n\n`;
  
  if (theme === 'stale') {
    content += `### Close stale issues in batch:

\`\`\`bash
gh issue close -R nrwl/nx ${issues.map(i => i.number).join(' ')} \\
  -c "Closing due to inactivity (6+ months). Please reopen if the issue persists with the latest version of Nx."
\`\`\`
`;
  } else if (theme === 'workaround') {
    content += `### Close issues with workarounds:

\`\`\`bash
gh issue close -R nrwl/nx ${issues.map(i => i.number).join(' ')} \\
  -c "Closing this issue as a workaround has been provided. Please try the latest version of Nx and reopen if needed."
\`\`\`
`;
  } else if (theme === 'documentation') {
    content += `### Documentation issues for batch PR:

These issues can potentially be fixed in a single documentation PR:
${issues.map(i => `- #${i.number}: ${i.title}`).join('\n')}
`;
  } else if (theme === 'userFix') {
    content += `### Issues with user-provided fixes:

These issues have fixes provided by users that should be reviewed and implemented:
${issues.map(i => `- #${i.number}: ${i.title} - ${i.url}`).join('\n')}
`;
  }

  return content;
}

// Run the script
main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
