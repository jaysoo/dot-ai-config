// Per TEAM org: did they enable Cloud Agents within 7 days of their first CIPE?
// Cohort: TEAM orgs whose firstCIPE was between 90 and 7 days ago (had a full 7-day window to activate).

const cohortStart = new Date(Date.now() - 90 * 24 * 3600 * 1000);
const cohortEnd   = new Date(Date.now() -  7 * 24 * 3600 * 1000);

// TEAM workspaces
const teamOrgIds = db.cloudOrganizations.find({ plan: "TEAM", enabled: { $ne: false } }, { _id: 1 }).toArray().map(d => d._id);
const teamWs = db.workspaces.find({ orgId: { $in: teamOrgIds } }, { _id: 1, orgId: 1, name: 1 }).toArray();
const wsToOrg = {}, wsName = {};
teamWs.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); wsName[d._id.toString()] = d.name; });
const wsIds = teamWs.map(d => d._id);

// First-ever CIPE per workspace
print("Scanning first CIPE per workspace...");
const firstCipe = db.ciPipelineExecutions.aggregate([
  { $match: { workspaceId: { $in: wsIds } } },
  { $group: { _id: "$workspaceId", firstAt: { $min: "$createdAt" } } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();
const wsFirstCipe = {};
firstCipe.forEach(d => { wsFirstCipe[d._id.toString()] = d.firstAt; });

// First CIPE with cloud agents per workspace
print("Scanning first Cloud Agents CIPE per workspace...");
const firstAgent = db.ciPipelineExecutions.aggregate([
  { $match: { workspaceId: { $in: wsIds } } },
  { $project: {
      workspaceId: 1, createdAt: 1,
      hasTpl: {
        $anyElementTrue: { $map: { input: "$runGroups", as: "rg", in: {
          $anyElementTrue: { $map: {
            input: { $objectToArray: { $ifNull: ["$$rg.agentInstances", {}] } },
            as: "kv",
            in: { $eq: [{ $type: "$$kv.v.launchTemplate" }, "string"] }
          } }
        } } }
      }
  } },
  { $match: { hasTpl: true } },
  { $group: { _id: "$workspaceId", firstAt: { $min: "$createdAt" } } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();
const wsFirstAgent = {};
firstAgent.forEach(d => { wsFirstAgent[d._id.toString()] = d.firstAt; });

// Roll up to org level
const orgFirstCipe = {}, orgFirstAgent = {};
for (const w of teamWs) {
  const oid = w.orgId.toString(), wid = w._id.toString();
  if (wsFirstCipe[wid]) {
    if (!orgFirstCipe[oid] || wsFirstCipe[wid] < orgFirstCipe[oid]) orgFirstCipe[oid] = wsFirstCipe[wid];
  }
  if (wsFirstAgent[wid]) {
    if (!orgFirstAgent[oid] || wsFirstAgent[wid] < orgFirstAgent[oid]) orgFirstAgent[oid] = wsFirstAgent[wid];
  }
}

// Cohort: orgs whose first CIPE is in [cohortStart, cohortEnd]
const cohort = Object.entries(orgFirstCipe).filter(([_, t]) => t >= cohortStart && t <= cohortEnd);
print("");
print("Cohort: TEAM orgs whose first CIPE was 7-90 days ago: " + cohort.length);

const buckets = { "within7d": 0, "8-30d": 0, "31-90d": 0, "ever_after_90d": 0, "never": 0 };
const within7dOrgs = [];

for (const [oid, firstAt] of cohort) {
  const firstAg = orgFirstAgent[oid];
  if (!firstAg) { buckets.never++; continue; }
  const days = (firstAg - firstAt) / (24 * 3600 * 1000);
  if (days <= 7) { buckets.within7d++; within7dOrgs.push(oid); }
  else if (days <= 30) buckets["8-30d"]++;
  else if (days <= 90) buckets["31-90d"]++;
  else buckets.ever_after_90d++;
}

const total = cohort.length;
print("");
print("=== Time-to-enable-Cloud-Agents (TEAM cohort, first CIPE 7-90 days ago) ===");
print("within 7 days of first CIPE:   " + buckets.within7d + "  (" + (100 * buckets.within7d / total).toFixed(1) + "%)");
print("8-30 days after first CIPE:    " + buckets["8-30d"] + "  (" + (100 * buckets["8-30d"] / total).toFixed(1) + "%)");
print("31-90 days after first CIPE:   " + buckets["31-90d"] + "  (" + (100 * buckets["31-90d"] / total).toFixed(1) + "%)");
print("90+ days after first CIPE:     " + buckets.ever_after_90d + "  (" + (100 * buckets.ever_after_90d / total).toFixed(1) + "%)");
print("never (so far):                " + buckets.never + "  (" + (100 * buckets.never / total).toFixed(1) + "%)");
print("");
print("Names of orgs that activated within 7 days:");
const orgNames = {};
db.cloudOrganizations.find({ _id: { $in: within7dOrgs.map(s => ObjectId(s)) } }, { name: 1 }).toArray()
  .forEach(o => { orgNames[o._id.toString()] = o.name; });
for (const oid of within7dOrgs) {
  print("  " + (orgNames[oid] || "?"));
}
