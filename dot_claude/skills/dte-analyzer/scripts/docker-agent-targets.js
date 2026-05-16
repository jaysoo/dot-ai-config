const days = 7;
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

// Pull TEAM orgs that ran docker tasks on agents (workspaceIds + names)
const teamOrgIds = db.cloudOrganizations.find({ plan: "TEAM" }, { _id: 1 }).toArray().map(d => d._id);
const teamWs = db.workspaces.find({ orgId: { $in: teamOrgIds } }, { _id: 1, orgId: 1, name: 1 }).toArray();
const teamWsIds = teamWs.map(d => d._id);
const wsToOrg = {}, wsName = {};
teamWs.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); wsName[d._id.toString()] = d.name; });

const orgNames = {};
db.cloudOrganizations.find({ _id: { $in: teamOrgIds } }, { _id: 1, name: 1 }).toArray()
  .forEach(o => { orgNames[o._id.toString()] = o.name; });

// Aggregate: per workspace x target counts, distributed runs only, for TEAM
const rows = db.runs.aggregate([
  { $match: {
      createdAt: { $gte: since },
      workspaceId: { $in: teamWsIds },
      "tasks.target": { $regex: /docker/i },
      distributedExecutionId: { $ne: null, $exists: true }
  } },
  { $project: {
      workspaceId: 1,
      tasks: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } }
  } },
  { $unwind: "$tasks" },
  { $group: { _id: { ws: "$workspaceId", target: "$tasks.target" }, n: { $sum: 1 } } },
  { $sort: { n: -1 } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();

// Group by org -> target -> count
const byOrg = {};
for (const r of rows) {
  const oid = wsToOrg[r._id.ws.toString()];
  if (!oid) continue;
  if (!byOrg[oid]) byOrg[oid] = {};
  const t = r._id.target;
  byOrg[oid][t] = (byOrg[oid][t] || 0) + r.n;
}

// Sort orgs by total tasks
const totals = Object.entries(byOrg).map(([oid, m]) => ({ oid, total: Object.values(m).reduce((a, b) => a + b, 0), m }));
totals.sort((a, b) => b.total - a.total);

print("=== TEAM org docker targets running ON cloud agents (last " + days + " days) ===");
print("");
for (const { oid, total, m } of totals) {
  const name = (orgNames[oid] || "?");
  print(name + " (total " + total + ")");
  const targets = Object.entries(m).sort((a, b) => b[1] - a[1]);
  for (const [tgt, n] of targets) {
    print("  " + tgt.padEnd(36) + " " + String(n).padStart(6));
  }
  print("");
}
