#!/usr/bin/env node

import { execSync } from 'child_process';

// Get last 500 commits
const commits = execSync('git log --oneline -500 --pretty=format:"%ad|||%s" --date=short')
  .toString()
  .split('\n')
  .filter(Boolean)
  .map(line => {
    const [date, message] = line.split('|||');
    return { date, message };
  });

// Parse conventional commits
function parseCommit(message) {
  const regex = /^(feat|fix|chore|docs|style|refactor|perf|test|build|ci|revert)(?:\(([^)]+)\))?(?:!)?: (.+)/;
  const match = message.match(regex);
  
  if (match) {
    return {
      type: match[1],
      scope: match[2] || 'general',
      breaking: message.includes('!:'),
      description: match[3]
    };
  }
  return null;
}

// Get week ending date (Saturday)
function getWeekEnding(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (6 - day + 7) % 7 || 7; // Days until Saturday
  d.setDate(d.getDate() + diff);
  return d;
}

// Format date as YYMM.DD
function formatWeekDate(date) {
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}.${day}`;
}

// Group commits by week and scope
const commitsByWeek = {};
const scopesOfInterest = ['nx-cloud', 'aggregator', 'nx-api', 'nx-cloud-workflow-controller', 'executor', 'client-bundle', 'fix-ci', 'conformance', 'runner', 'graph'];

commits.forEach(({ date, message }) => {
  const parsed = parseCommit(message);
  if (!parsed || parsed.type === 'chore') return;
  
  // Check if this is a scope we're interested in
  const isRelevantScope = scopesOfInterest.some(scope => 
    parsed.scope && parsed.scope.includes(scope)
  );
  
  if (!isRelevantScope && parsed.scope !== 'general') return;
  
  const weekEnding = getWeekEnding(date);
  const weekKey = formatWeekDate(weekEnding);
  
  if (!commitsByWeek[weekKey]) {
    commitsByWeek[weekKey] = {
      date: weekEnding,
      scopes: {}
    };
  }
  
  const scope = parsed.scope || 'general';
  if (!commitsByWeek[weekKey].scopes[scope]) {
    commitsByWeek[weekKey].scopes[scope] = {
      features: [],
      fixes: []
    };
  }
  
  const entry = {
    message: parsed.description,
    fullMessage: message
  };
  
  if (parsed.type === 'feat') {
    commitsByWeek[weekKey].scopes[scope].features.push(entry);
  } else if (parsed.type === 'fix') {
    commitsByWeek[weekKey].scopes[scope].fixes.push(entry);
  }
});

// Generate changelog
console.log('# Changelog Sample\n');
console.log('Generated from last 500 commits, grouped by week (ending Saturday)\n');

const sortedWeeks = Object.keys(commitsByWeek).sort().reverse();

// Show sample for different scopes
const mainScopes = ['nx-cloud', 'aggregator', 'nx-api', 'nx-cloud-workflow-controller'];

mainScopes.forEach(mainScope => {
  console.log(`\n## ${mainScope} Changelog\n`);
  
  let hasContent = false;
  sortedWeeks.slice(0, 4).forEach(weekKey => { // Show last 4 weeks as sample
    const week = commitsByWeek[weekKey];
    const scopeData = week.scopes[mainScope];
    
    if (scopeData && (scopeData.features.length > 0 || scopeData.fixes.length > 0)) {
      hasContent = true;
      console.log(`### Week of ${weekKey}\n`);
      
      if (scopeData.features.length > 0) {
        console.log('#### Features');
        scopeData.features.forEach(feat => {
          console.log(`- ${feat.message}`);
        });
        console.log('');
      }
      
      if (scopeData.fixes.length > 0) {
        console.log('#### Fixes');
        scopeData.fixes.forEach(fix => {
          console.log(`- ${fix.message}`);
        });
        console.log('');
      }
    }
  });
  
  if (!hasContent) {
    console.log('*No changes in recent weeks*\n');
  }
});

// Summary statistics
console.log('\n## Statistics\n');
console.log('### Commit Distribution by Scope (last 4 weeks)\n');

const last4Weeks = sortedWeeks.slice(0, 4);
const scopeStats = {};

last4Weeks.forEach(weekKey => {
  const week = commitsByWeek[weekKey];
  Object.entries(week.scopes).forEach(([scope, data]) => {
    if (!scopeStats[scope]) {
      scopeStats[scope] = { features: 0, fixes: 0 };
    }
    scopeStats[scope].features += data.features.length;
    scopeStats[scope].fixes += data.fixes.length;
  });
});

const sortedScopes = Object.entries(scopeStats)
  .sort((a, b) => (b[1].features + b[1].fixes) - (a[1].features + a[1].fixes))
  .slice(0, 10);

sortedScopes.forEach(([scope, stats]) => {
  console.log(`- **${scope}**: ${stats.features} features, ${stats.fixes} fixes`);
});