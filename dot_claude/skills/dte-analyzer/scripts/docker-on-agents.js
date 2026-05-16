const days = 7;
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

// Tally docker tasks split by distributed (ran on cloud agent) vs not
print("=== Docker tasks: distributed vs not (last " + days + " days) ===");
const split = db.runs.aggregate([
  { $match: { createdAt: { $gte: since }, "tasks.target": { $regex: /docker/i } } },
  { $project: {
      isDistributed: { $cond: [{ $and: [{ $ne: ["$distributedExecutionId", null] }, { $ne: ["$distributedExecutionId", ""] }] }, "yes", "no"] },
      dockerCount: {
        $size: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } }
      },
      workspaceId: 1
  } },
  { $group: { _id: "$isDistributed", tasks: { $sum: "$dockerCount" }, runs: { $sum: 1 }, ws: { $addToSet: "$workspaceId" } } },
  { $project: { tasks: 1, runs: 1, workspaces: { $size: "$ws" } } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();
printjson(split);

// TEAM orgs that ran docker tasks ON agents (distributed)
print("");
print("=== TEAM orgs running docker tasks ON cloud agents (last " + days + " days) ===");
const teamOrgIds = db.cloudOrganizations.find({ plan: "TEAM" }, { _id: 1 }).toArray().map(d => d._id);
const teamWs = db.workspaces.find({ orgId: { $in: teamOrgIds } }, { _id: 1, orgId: 1, name: 1 }).toArray();
const teamWsIds = teamWs.map(d => d._id);
const wsToOrg = {}; const wsName = {};
teamWs.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); wsName[d._id.toString()] = d.name; });

const dist = db.runs.aggregate([
  { $match: {
      createdAt: { $gte: since },
      workspaceId: { $in: teamWsIds },
      "tasks.target": { $regex: /docker/i },
      distributedExecutionId: { $ne: null, $exists: true }
  } },
  { $project: {
      workspaceId: 1,
      dockerCount: {
        $size: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } }
      }
  } },
  { $group: { _id: "$workspaceId", tasks: { $sum: "$dockerCount" } } },
  { $sort: { tasks: -1 } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();

// Filter out empty-string distributedExecutionId by additional check on first row
print("Workspaces (TEAM) with docker tasks on agents: " + dist.length);

const orgTotals = {};
const orgWs = {};
for (const d of dist) {
  const oid = wsToOrg[d._id.toString()];
  if (!oid) continue;
  orgTotals[oid] = (orgTotals[oid] || 0) + d.tasks;
  if (!orgWs[oid]) orgWs[oid] = [];
  orgWs[oid].push((wsName[d._id.toString()] || "?") + " (" + d.tasks + ")");
}
const orgNames = {};
db.cloudOrganizations.find({ _id: { $in: Object.keys(orgTotals).map(s => ObjectId(s)) } }, { _id: 1, name: 1 }).toArray()
  .forEach(o => { orgNames[o._id.toString()] = o.name; });

const sorted = Object.entries(orgTotals).sort((a, b) => b[1] - a[1]);
print("Distinct TEAM orgs: " + sorted.length);
print("");
print("org                                       tasks   workspaces");
for (const [oid, t] of sorted) {
  print((orgNames[oid] || "?").substring(0, 40).padEnd(40) + "  " + String(t).padStart(6) + "  " + (orgWs[oid] || []).join(", "));
}
