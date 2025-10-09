#!/usr/bin/env node

/**
 * Analyze Linear tasks for Nx CLI and Nx Cloud teams
 * Categorizes by:
 * - Time period (last 2 weeks vs 4 weeks)
 * - Issue type (bug vs other)
 * - Project status (no project, Misc/Miscellaneous, other)
 */

const LINEAR_API = 'https://api.linear.app/graphql';
const API_KEY = process.env.LINEAR_API_KEY;

if (!API_KEY) {
  console.error('Error: LINEAR_API_KEY environment variable not set');
  process.exit(1);
}

// Calculate dates
const now = new Date();
const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

async function queryLinear(query, variables = {}) {
  const response = await fetch(LINEAR_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Linear API error: ${response.statusText}`);
  }

  return response.json();
}

async function getTeams() {
  const query = `
    query {
      teams {
        nodes {
          id
          name
          key
        }
      }
    }
  `;

  const result = await queryLinear(query);
  return result.data.teams.nodes;
}

async function getIssuesForTeam(teamId, updatedAfter) {
  const query = `
    query($teamId: String!, $updatedAfter: DateTime!) {
      issues(
        filter: {
          team: { id: { eq: $teamId } }
          updatedAt: { gte: $updatedAfter }
        }
        first: 250
      ) {
        nodes {
          id
          title
          identifier
          updatedAt
          completedAt
          labels {
            nodes {
              name
            }
          }
          project {
            name
          }
          state {
            name
            type
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  let allIssues = [];
  let hasNextPage = true;
  let cursor = null;

  while (hasNextPage) {
    const result = await queryLinear(query, {
      teamId,
      updatedAfter: updatedAfter.toISOString(),
    });

    allIssues = allIssues.concat(result.data.issues.nodes);
    hasNextPage = result.data.issues.pageInfo.hasNextPage;
    cursor = result.data.issues.pageInfo.endCursor;

    if (hasNextPage) {
      // Add cursor to query for pagination
      break; // For now, just get first page
    }
  }

  return allIssues;
}

function analyzeIssues(issues, twoWeeksAgo, fourWeeksAgo) {
  const stats = {
    last2Weeks: { total: 0, bugs: 0, noProject: 0, misc: 0 },
    last4Weeks: { total: 0, bugs: 0, noProject: 0, misc: 0 },
  };

  issues.forEach(issue => {
    const updatedAt = new Date(issue.updatedAt);
    const isBug = issue.labels.nodes.some(label =>
      label.name.toLowerCase().includes('bug')
    );
    const projectName = issue.project?.name || null;
    const isMisc = projectName &&
      (projectName.toLowerCase().includes('misc') ||
       projectName.toLowerCase().includes('miscellaneous'));
    const noProject = !projectName;

    // Count for 4 weeks (includes 2 weeks)
    if (updatedAt >= fourWeeksAgo) {
      stats.last4Weeks.total++;
      if (isBug) stats.last4Weeks.bugs++;
      if (noProject) stats.last4Weeks.noProject++;
      if (isMisc) stats.last4Weeks.misc++;
    }

    // Count for 2 weeks
    if (updatedAt >= twoWeeksAgo) {
      stats.last2Weeks.total++;
      if (isBug) stats.last2Weeks.bugs++;
      if (noProject) stats.last2Weeks.noProject++;
      if (isMisc) stats.last2Weeks.misc++;
    }
  });

  return stats;
}

async function main() {
  console.log('Fetching teams...\n');
  const teams = await getTeams();

  const nxCli = teams.find(t => t.name === 'Nx CLI' || t.key === 'NXC');
  const nxCloud = teams.find(t => t.name === 'Nx Cloud' || t.key === 'CLOUD');

  if (!nxCli || !nxCloud) {
    console.error('Could not find Nx CLI or Nx Cloud teams');
    console.log('Available teams:', teams.map(t => `${t.name} (${t.key})`).join(', '));
    process.exit(1);
  }

  console.log(`Found teams:`);
  console.log(`  - ${nxCli.name} (${nxCli.key})`);
  console.log(`  - ${nxCloud.name} (${nxCloud.key})\n`);

  // Fetch issues for both teams
  console.log('Fetching Nx CLI issues...');
  const cliIssues = await getIssuesForTeam(nxCli.id, fourWeeksAgo);

  console.log('Fetching Nx Cloud issues...');
  const cloudIssues = await getIssuesForTeam(nxCloud.id, fourWeeksAgo);

  console.log('\n' + '='.repeat(60));
  console.log('RESULTS');
  console.log('='.repeat(60) + '\n');

  // Analyze Nx CLI
  const cliStats = analyzeIssues(cliIssues, twoWeeksAgo, fourWeeksAgo);
  console.log('Nx CLI Team:');
  console.log('  Last 2 weeks:');
  console.log(`    Total issues: ${cliStats.last2Weeks.total}`);
  console.log(`    Bugs: ${cliStats.last2Weeks.bugs}`);
  console.log(`    No project: ${cliStats.last2Weeks.noProject}`);
  console.log(`    Misc/Miscellaneous: ${cliStats.last2Weeks.misc}`);
  console.log('  Last 4 weeks:');
  console.log(`    Total issues: ${cliStats.last4Weeks.total}`);
  console.log(`    Bugs: ${cliStats.last4Weeks.bugs}`);
  console.log(`    No project: ${cliStats.last4Weeks.noProject}`);
  console.log(`    Misc/Miscellaneous: ${cliStats.last4Weeks.misc}\n`);

  // Analyze Nx Cloud
  const cloudStats = analyzeIssues(cloudIssues, twoWeeksAgo, fourWeeksAgo);
  console.log('Nx Cloud Team:');
  console.log('  Last 2 weeks:');
  console.log(`    Total issues: ${cloudStats.last2Weeks.total}`);
  console.log(`    Bugs: ${cloudStats.last2Weeks.bugs}`);
  console.log(`    No project: ${cloudStats.last2Weeks.noProject}`);
  console.log(`    Misc/Miscellaneous: ${cloudStats.last2Weeks.misc}`);
  console.log('  Last 4 weeks:');
  console.log(`    Total issues: ${cloudStats.last4Weeks.total}`);
  console.log(`    Bugs: ${cloudStats.last4Weeks.bugs}`);
  console.log(`    No project: ${cloudStats.last4Weeks.noProject}`);
  console.log(`    Misc/Miscellaneous: ${cloudStats.last4Weeks.misc}\n`);
}

main().catch(console.error);
