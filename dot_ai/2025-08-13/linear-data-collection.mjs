/**
 * Linear Issues Data Collection Script
 * Fetches closed/cancelled issues from all specified teams since 2025-06-14
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Team configurations
const TEAMS = [
  { name: "Nx Cloud", id: "35b6691d-7bd2-4838-8e63-dd08aedf1665" },
  { name: "RedPanda", id: "b326be94-8f36-4798-ae2d-f77149ea7beb" },
  { name: "Capybara", id: "eb9bfc18-1880-46e4-ac20-489be61648a3" },
  { name: "Docs", id: "6476c542-05d0-4c92-906e-a0333cc8fc2e" },
  { name: "Nx CLI", id: "2100b430-122d-4c3f-b3a0-ef1ac995951e" },
  { name: "Axolotl", id: "080bb47b-19cb-4ddf-bdb3-19085377faa6" },
  { name: "Infrastructure", id: "b837fc89-fe9c-4918-9006-30dfabb3688c" },
  { name: "Nx Dev Rel", id: "be07f846-b405-4bf5-8950-08c4a1c890e4" },
  { name: "Backend", id: "9c14707d-1401-4ead-932f-56edb6786891" },
  { name: "Nx Enterprise", id: "96d299be-e506-46d3-b022-7e5fabceaeef" },
  { name: "Customer Success", id: "c1b1078b-88c5-442d-b005-7a82d9e30f10" },
  { name: "Marketing", id: "58a8cf80-6295-46cc-b77f-8c4b40e4d110" },
  { name: "Nx Plugins", id: "08921ef5-498b-4e21-b1e4-dee68e817e3e" },
  { name: "Operations", id: "c3476f8e-9444-441c-94f4-bb6e04319d19" },
  { name: "OSS Outreach", id: "4a49d2b3-5bbd-4ccb-bda7-9b60d3dda2ee" }
];

const STATES = ["Done", "Canceled"];
const SINCE_DATE = "2025-06-14";

// Collected data structure
const collectedData = {
  metadata: {
    collection_date: new Date().toISOString(),
    since_date: SINCE_DATE,
    teams_count: TEAMS.length,
    states: STATES
  },
  teams: {},
  summary: {
    total_issues: 0,
    by_team: {},
    by_assignee: {},
    by_state: {
      Done: 0,
      Canceled: 0
    }
  }
};

/**
 * Extract key information from issue
 */
function extractIssueData(issue) {
  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    status: issue.status,
    assignee: issue.assignee || "Unassigned",
    assigneeId: issue.assigneeId || null,
    team: issue.team,
    teamId: issue.teamId,
    priority: issue.priority?.name || null,
    url: issue.url,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    project: issue.project || null,
    projectId: issue.projectId || null,
    labels: issue.labels || [],
    estimate: issue.estimate?.name || null
  };
}

/**
 * Update summary statistics
 */
function updateSummary(issue) {
  collectedData.summary.total_issues++;
  
  // By state
  collectedData.summary.by_state[issue.status]++;
  
  // By team
  if (!collectedData.summary.by_team[issue.team]) {
    collectedData.summary.by_team[issue.team] = { Done: 0, Canceled: 0, total: 0 };
  }
  collectedData.summary.by_team[issue.team][issue.status]++;
  collectedData.summary.by_team[issue.team].total++;
  
  // By assignee
  const assignee = issue.assignee || "Unassigned";
  if (!collectedData.summary.by_assignee[assignee]) {
    collectedData.summary.by_assignee[assignee] = { Done: 0, Canceled: 0, total: 0, teams: new Set() };
  }
  collectedData.summary.by_assignee[assignee][issue.status]++;
  collectedData.summary.by_assignee[assignee].total++;
  collectedData.summary.by_assignee[assignee].teams.add(issue.team);
}

/**
 * Process issues from API response
 */
function processIssues(issues, teamName) {
  if (!collectedData.teams[teamName]) {
    collectedData.teams[teamName] = {
      Done: [],
      Canceled: []
    };
  }
  
  issues.forEach(issue => {
    const processedIssue = extractIssueData(issue);
    collectedData.teams[teamName][issue.status].push(processedIssue);
    updateSummary(processedIssue);
  });
}

/**
 * Convert Sets to Arrays for JSON serialization
 */
function prepareFinalData() {
  // Convert Sets in assignee teams to arrays
  Object.keys(collectedData.summary.by_assignee).forEach(assignee => {
    collectedData.summary.by_assignee[assignee].teams = 
      Array.from(collectedData.summary.by_assignee[assignee].teams);
  });
  
  return collectedData;
}

// Initialize teams in collected data
TEAMS.forEach(team => {
  collectedData.teams[team.name] = {
    Done: [],
    Canceled: []
  };
});

console.log("Linear Data Collection Script initialized");
console.log(`Collecting issues since ${SINCE_DATE} from ${TEAMS.length} teams`);
console.log(`Target states: ${STATES.join(", ")}`);

// Export functions for manual data entry
export { 
  processIssues, 
  prepareFinalData, 
  collectedData, 
  TEAMS, 
  STATES 
};

/**
 * Save the final data to file
 */
export function saveData() {
  const finalData = prepareFinalData();
  const outputPath = join(__dirname, 'linear-issues-data.json');
  writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
  console.log(`Data saved to ${outputPath}`);
  console.log(`Total issues collected: ${finalData.summary.total_issues}`);
  return finalData;
}