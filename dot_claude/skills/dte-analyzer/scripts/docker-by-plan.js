const days = 7;
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

// Step 1: distinct workspaces running docker-ish tasks in window
const wsAgg = db.runs.aggregate([
  { $match: { createdAt: { $gte: since }, "tasks.target": { $regex: /docker/i } } },
  { $group: { _id: "$workspaceId" } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();
const dockerWsIds = wsAgg.map(d => d._id);
print("Workspaces with docker tasks (" + days + "d): " + dockerWsIds.length);

// Step 2: map to orgs + plan
const wsDocs = db.workspaces
  .find({ _id: { $in: dockerWsIds } }, { _id: 1, orgId: 1 })
  .toArray();
const orgIds = [...new Set(wsDocs.map(d => d.orgId.toString()))].map(s => ObjectId(s));
print("Distinct orgs with docker-using workspaces: " + orgIds.length);

const orgDocs = db.cloudOrganizations
  .find({ _id: { $in: orgIds } }, { _id: 1, plan: 1, enabled: 1 })
  .toArray();

const orgIdToPlan = {};
orgDocs.forEach(o => { orgIdToPlan[o._id.toString()] = (o.enabled === false ? "(disabled) " : "") + (o.plan || "UNKNOWN"); });

const orgsByPlan = {};
const wsByPlan = {};
for (const w of wsDocs) {
  const plan = orgIdToPlan[w.orgId.toString()] || "UNKNOWN";
  wsByPlan[plan] = (wsByPlan[plan] || 0) + 1;
}
for (const oid of orgIds.map(o => o.toString())) {
  const plan = orgIdToPlan[oid] || "UNKNOWN";
  orgsByPlan[plan] = (orgsByPlan[plan] || 0) + 1;
}

print("");
print("=== Docker task usage by plan (last " + days + " days) ===");
print("plan                    orgs    workspaces");
const allPlans = [...new Set([...Object.keys(orgsByPlan), ...Object.keys(wsByPlan)])].sort();
for (const p of allPlans) {
  print(p.padEnd(24) + String(orgsByPlan[p] || 0).padStart(4) + "    " + String(wsByPlan[p] || 0).padStart(4));
}
