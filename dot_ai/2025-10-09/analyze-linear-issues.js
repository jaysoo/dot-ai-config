#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load issue data
const cliIssues = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'nx-cli-issues-1.json'), 'utf-8')
);
const cloudIssues = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'nx-cloud-issues-1.json'), 'utf-8')
);

// Date thresholds
const twoWeeksAgo = new Date('2025-09-25T00:00:00Z');
const fourWeeksAgo = new Date('2025-09-11T00:00:00Z');

function categorizeIssue(issue) {
  const updatedAt = new Date(issue.updatedAt);

  // Check if it's a bug
  const isBug =
    issue.labels?.some(label => label.toLowerCase().includes('bug')) ||
    issue.title?.toLowerCase().includes('bug') ||
    false;

  // Check project status
  const project = issue.project;
  const hasNoProject = !project || project === null;
  const isMisc = project && (
    project.toLowerCase().includes('misc') ||
    project.toLowerCase().includes('miscellaneous')
  );

  // Determine time period
  const inLast2Weeks = updatedAt >= twoWeeksAgo;
  const inLast4Weeks = updatedAt >= fourWeeksAgo;

  return {
    identifier: issue.identifier,
    title: issue.title,
    updatedAt: issue.updatedAt,
    isBug,
    hasNoProject,
    isMisc,
    project,
    inLast2Weeks,
    inLast4Weeks
  };
}

function analyzeTeam(teamName, issues) {
  const categorized = issues.map(categorizeIssue);

  const last2Weeks = categorized.filter(i => i.inLast2Weeks);
  const last4Weeks = categorized.filter(i => i.inLast4Weeks);

  const stats = {
    teamName,
    last2Weeks: {
      total: last2Weeks.length,
      bugs: last2Weeks.filter(i => i.isBug).length,
      noProject: last2Weeks.filter(i => i.hasNoProject).length,
      misc: last2Weeks.filter(i => i.isMisc).length,
    },
    last4Weeks: {
      total: last4Weeks.length,
      bugs: last4Weeks.filter(i => i.isBug).length,
      noProject: last4Weeks.filter(i => i.hasNoProject).length,
      misc: last4Weeks.filter(i => i.isMisc).length,
    },
    details: {
      last2WeeksBugs: last2Weeks.filter(i => i.isBug),
      last2WeeksNoProject: last2Weeks.filter(i => i.hasNoProject),
      last2WeeksMisc: last2Weeks.filter(i => i.isMisc),
      last4WeeksBugs: last4Weeks.filter(i => i.isBug),
      last4WeeksNoProject: last4Weeks.filter(i => i.hasNoProject),
      last4WeeksMisc: last4Weeks.filter(i => i.isMisc),
    }
  };

  return stats;
}

function printReport(stats) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`${stats.teamName} Team`);
  console.log('='.repeat(70));

  console.log('\nLast 2 Weeks (updated on or after 2025-09-25):');
  console.log(`  Total issues:              ${stats.last2Weeks.total}`);
  console.log(`  Bugs:                      ${stats.last2Weeks.bugs} (${((stats.last2Weeks.bugs / stats.last2Weeks.total) * 100).toFixed(1)}%)`);
  console.log(`  No project:                ${stats.last2Weeks.noProject} (${((stats.last2Weeks.noProject / stats.last2Weeks.total) * 100).toFixed(1)}%)`);
  console.log(`  Misc/Miscellaneous:        ${stats.last2Weeks.misc} (${((stats.last2Weeks.misc / stats.last2Weeks.total) * 100).toFixed(1)}%)`);

  console.log('\nLast 4 Weeks (updated on or after 2025-09-11):');
  console.log(`  Total issues:              ${stats.last4Weeks.total}`);
  console.log(`  Bugs:                      ${stats.last4Weeks.bugs} (${((stats.last4Weeks.bugs / stats.last4Weeks.total) * 100).toFixed(1)}%)`);
  console.log(`  No project:                ${stats.last4Weeks.noProject} (${((stats.last4Weeks.noProject / stats.last4Weeks.total) * 100).toFixed(1)}%)`);
  console.log(`  Misc/Miscellaneous:        ${stats.last4Weeks.misc} (${((stats.last4Weeks.misc / stats.last4Weeks.total) * 100).toFixed(1)}%)`);
}

function printDetails(stats) {
  console.log(`\n\n${'='.repeat(70)}`);
  console.log('DETAILED BREAKDOWN');
  console.log('='.repeat(70));

  console.log(`\n${stats.teamName} - Last 2 Weeks - Bugs (${stats.details.last2WeeksBugs.length}):`);
  stats.details.last2WeeksBugs.forEach(i => {
    console.log(`  ${i.identifier}: ${i.title}`);
  });

  console.log(`\n${stats.teamName} - Last 2 Weeks - No Project (${stats.details.last2WeeksNoProject.length}):`);
  stats.details.last2WeeksNoProject.forEach(i => {
    console.log(`  ${i.identifier}: ${i.title}`);
  });

  console.log(`\n${stats.teamName} - Last 2 Weeks - Misc/Miscellaneous (${stats.details.last2WeeksMisc.length}):`);
  stats.details.last2WeeksMisc.forEach(i => {
    console.log(`  ${i.identifier}: ${i.title} (${i.project})`);
  });
}

// Analyze both teams
const cliStats = analyzeTeam('Nx CLI', cliIssues);
const cloudStats = analyzeTeam('Nx Cloud', cloudIssues);

// Print reports
printReport(cliStats);
printReport(cloudStats);

// Print combined summary
console.log(`\n\n${'='.repeat(70)}`);
console.log('COMBINED SUMMARY');
console.log('='.repeat(70));

console.log('\nLast 2 Weeks:');
console.log(`  Total issues:              ${cliStats.last2Weeks.total + cloudStats.last2Weeks.total}`);
console.log(`  Total bugs:                ${cliStats.last2Weeks.bugs + cloudStats.last2Weeks.bugs}`);
console.log(`  Total no project:          ${cliStats.last2Weeks.noProject + cloudStats.last2Weeks.noProject}`);
console.log(`  Total misc:                ${cliStats.last2Weeks.misc + cloudStats.last2Weeks.misc}`);

console.log('\nLast 4 Weeks:');
console.log(`  Total issues:              ${cliStats.last4Weeks.total + cloudStats.last4Weeks.total}`);
console.log(`  Total bugs:                ${cliStats.last4Weeks.bugs + cloudStats.last4Weeks.bugs}`);
console.log(`  Total no project:          ${cliStats.last4Weeks.noProject + cloudStats.last4Weeks.noProject}`);
console.log(`  Total misc:                ${cliStats.last4Weeks.misc + cloudStats.last4Weeks.misc}`);

// Optionally print detailed breakdowns
if (process.argv.includes('--details')) {
  printDetails(cliStats);
  printDetails(cloudStats);
}

console.log('\n');
console.log('Note: Run with --details flag to see individual issue breakdowns\n');
