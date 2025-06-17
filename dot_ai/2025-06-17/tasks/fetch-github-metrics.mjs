#!/usr/bin/env node

import { execSync } from 'child_process';

// Configuration
const REPO = 'nrwl/nx';
const JUNE_START = '2025-06-01';
const JUNE_END = '2025-06-17'; // Week 3 ends around June 17
const REPO_START = '2017-09-01'; // Approximate repo creation date

// Helper function to execute gh CLI commands
function runGhCommand(command) {
  try {
    const result = execSync(command, { encoding: 'utf-8' });
    return result.trim();
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Helper function to count items with pagination
async function countWithPagination(searchQuery, itemType = 'issue') {
  let total = 0;
  let page = 1;
  const perPage = 100;
  
  while (true) {
    const command = `gh ${itemType} list ${searchQuery} --limit ${perPage} --json number`;
    const result = runGhCommand(command);
    
    if (!result) break;
    
    try {
      const items = JSON.parse(result);
      total += items.length;
      
      // If we got less than perPage items, we've reached the end
      if (items.length < perPage) break;
      
      // Otherwise, continue to next page
      page++;
      // GitHub CLI doesn't support direct pagination, so we'll use a workaround
      // For now, we'll assume the total is less than 1000 (10 pages)
      if (page > 10) {
        console.warn(`Warning: Reached pagination limit for query: ${searchQuery}`);
        break;
      }
    } catch (error) {
      console.error('Error parsing JSON:', error);
      break;
    }
  }
  
  return total;
}

async function fetchMetrics() {
  console.log('Fetching GitHub metrics for Nx repository...\n');
  console.log(`Repository: ${REPO}`);
  console.log(`Date range for closed issues and PRs: ${JUNE_START} to ${JUNE_END}\n`);

  // 1. Fetch open issues (all time)
  console.log('Fetching open issues...');
  const openIssuesCommand = `gh issue list --repo ${REPO} --state open --limit 1000 --json number | jq length`;
  const openIssuesResult = runGhCommand(openIssuesCommand);
  const openIssues = openIssuesResult ? parseInt(openIssuesResult) : 0;
  console.log(`Open issues: ${openIssues}`);

  // 2. Fetch closed issues (June only)
  console.log('\nFetching closed issues for June...');
  const closedIssuesCommand = `gh issue list --repo ${REPO} --state closed --search "closed:${JUNE_START}..${JUNE_END}" --limit 1000 --json number | jq length`;
  const closedIssuesResult = runGhCommand(closedIssuesCommand);
  const closedIssues = closedIssuesResult ? parseInt(closedIssuesResult) : 0;
  console.log(`Closed issues (June 1-17): ${closedIssues}`);

  // 3. Calculate issue close rate
  const issueCloseRate = closedIssues / (closedIssues + openIssues) * 100;
  console.log(`Issue close rate: ${issueCloseRate.toFixed(1)}%`);

  // 4. Fetch total PRs (June only)
  console.log('\nFetching PRs for June...');
  const totalPRsCommand = `gh pr list --repo ${REPO} --state all --search "created:${JUNE_START}..${JUNE_END}" --limit 1000 --json number | jq length`;
  const totalPRsResult = runGhCommand(totalPRsCommand);
  const totalPRs = totalPRsResult ? parseInt(totalPRsResult) : 0;
  console.log(`Total PRs (June 1-17): ${totalPRs}`);

  // Output results in scorecard format
  console.log('\n=== SCORECARD UPDATE ===');
  console.log('\nAdd these values to the June column:');
  console.log(`Open issues: Week 3: ${openIssues}`);
  console.log(`Closed issues: Week 3: ${closedIssues}`);
  console.log(`Issue close rate: Week 3: ${issueCloseRate.toFixed(1)}%`);
  console.log(`Total PRs: Week 3: ${totalPRs}`);

  // Also output as a markdown snippet
  console.log('\n=== MARKDOWN FORMAT ===');
  console.log(`| Open issues | 500 | ... | ... | ... | ... | ... | Week 1: 625<br>Week 3: ${openIssues} |`);
  console.log(`| Closed issues | - | ... | ... | ... | ... | ... | Week 1: 26<br>Week 3: ${closedIssues} |`);
  console.log(`| Issue close rate | 20% | ... | ... | ... | ... | ... | Week 1: 4.0%<br>Week 3: ${issueCloseRate.toFixed(1)}% |`);
  console.log(`| Total PRs | 50 | ... | ... | ... | ... | ... | Week 1: 108<br>Week 3: ${totalPRs} |`);
}

// Run the script
fetchMetrics().catch(console.error);