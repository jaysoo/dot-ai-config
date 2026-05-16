const days = 7;
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

// Workspaces + per-workspace docker task counts
const wsAgg = db.runs.aggregate([
  { $match: { createdAt: { $gte: since }, "tasks.target": { $regex: /docker/i } } },
  { $project: {
      workspaceId: 1,
      dockerTaskCount: {
        $size: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } }
      }
  } },
  { $group: { _id: "$workspaceId", dockerTasks: { $sum: "$dockerTaskCount" } } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();

const wsIds = wsAgg.map(d => d._id);
const wsToTasks = {};
wsAgg.forEach(d => { wsToTasks[d._id.toString()] = d.dockerTasks; });

// Map workspaces to orgs
const wsDocs = db.workspaces.find({ _id: { $in: wsIds } }, { _id: 1, orgId: 1, name: 1 }).toArray();
const wsToOrg = {};
const wsToName = {};
wsDocs.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); wsToName[d._id.toString()] = d.name; });

// Pull TEAM orgs
const orgIds = [...new Set(wsDocs.map(d => d.orgId.toString()))].map(s => ObjectId(s));
const orgDocs = db.cloudOrganizations.find({ _id: { $in: orgIds }, plan: "TEAM" }, { _id: 1, name: 1, enabled: 1 }).toArray();
const teamOrgIds = new Set(orgDocs.map(o => o._id.toString()));
const orgName = {};
orgDocs.forEach(o => { orgName[o._id.toString()] = (o.enabled === false ? "(disabled) " : "") + o.name; });

// Aggregate per-org docker task totals
const orgTotals = {};
const orgWsNames = {};
for (const w of wsDocs) {
  const oid = w.orgId.toString();
  if (!teamOrgIds.has(oid)) continue;
  orgTotals[oid] = (orgTotals[oid] || 0) + (wsToTasks[w._id.toString()] || 0);
  if (!orgWsNames[oid]) orgWsNames[oid] = [];
  orgWsNames[oid].push(w.name + " (" + (wsToTasks[w._id.toString()] || 0) + ")");
}

const sorted = Object.entries(orgTotals).sort((a, b) => b[1] - a[1]);

print("=== TEAM orgs with docker tasks (last " + days + " days) ===");
print("Total: " + sorted.length + " orgs");
print("");
print("org name                                              docker tasks  workspaces");
for (const [oid, total] of sorted) {
  const nm = (orgName[oid] || "?").substring(0, 50).padEnd(50);
  print(nm + "  " + String(total).padStart(8) + "    " + (orgWsNames[oid] || []).join(", "));
}
