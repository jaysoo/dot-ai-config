// Try several filter combinations to see which one lands on ~91

function countAgents(planFilter, days, enabledOnly, minCipes) {
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  const orgFilter = enabledOnly ? { plan: planFilter, enabled: { $ne: false } } : { plan: planFilter };
  const orgIds = db.cloudOrganizations.find(orgFilter, { _id: 1 }).toArray().map(d => d._id);
  const ws = db.workspaces.find({ orgId: { $in: orgIds } }, { _id: 1, orgId: 1 }).toArray();
  const wsToOrg = {};
  ws.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); });
  const wsIds = ws.map(d => d._id);

  const cipes = db.ciPipelineExecutions.aggregate([
    { $match: { workspaceId: { $in: wsIds }, createdAt: { $gte: since } } },
    { $project: { workspaceId: 1, runGroups: { $map: { input: "$runGroups", as: "rg", in: { agentInstances: "$$rg.agentInstances", agents: "$$rg.agents" } } } } }
  ], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();

  const orgAgentCipes = {};
  for (const c of cipes) {
    const oid = wsToOrg[c.workspaceId.toString()];
    if (!oid) continue;
    for (const rg of (c.runGroups || [])) {
      if (!rg.agents || rg.agents.length === 0) continue;
      const insts = rg.agentInstances || {};
      let hasTpl = false;
      for (const k of Object.keys(insts)) {
        const lt = insts[k] && insts[k].launchTemplate;
        if (lt !== null && lt !== undefined) { hasTpl = true; break; }
      }
      if (hasTpl) {
        orgAgentCipes[oid] = (orgAgentCipes[oid] || 0) + 1;
        break;
      }
    }
  }
  const orgs = Object.entries(orgAgentCipes).filter(([_, n]) => n >= minCipes).map(([oid]) => oid);
  return orgs.length;
}

const cfgs = [
  { plan: "TEAM", days: 30, enabled: true, minCipes: 1 },
  { plan: "TEAM", days: 30, enabled: true, minCipes: 5 },
  { plan: "TEAM", days: 30, enabled: true, minCipes: 10 },
  { plan: "TEAM", days: 14, enabled: true, minCipes: 1 },
  { plan: "TEAM", days: 7, enabled: true, minCipes: 1 },
];

print("plan        days  enabled  minCipes   orgs");
for (const c of cfgs) {
  const n = countAgents(c.plan, c.days, c.enabled, c.minCipes);
  print(c.plan.padEnd(10) + " " + String(c.days).padStart(4) + "  " + String(c.enabled).padEnd(7) + "  " + String(c.minCipes).padStart(6) + "    " + n);
}

// Also try paid tiers combined
function countMultiPlan(plans, days, enabledOnly, minCipes) {
  const since = new Date(Date.now() - days * 24 * 3600 * 1000);
  const orgFilter = enabledOnly ? { plan: { $in: plans }, enabled: { $ne: false } } : { plan: { $in: plans } };
  const orgs = db.cloudOrganizations.find(orgFilter, { _id: 1, plan: 1 }).toArray();
  const orgIds = orgs.map(d => d._id);
  const orgPlan = {}; orgs.forEach(o => { orgPlan[o._id.toString()] = o.plan; });
  const ws = db.workspaces.find({ orgId: { $in: orgIds } }, { _id: 1, orgId: 1 }).toArray();
  const wsToOrg = {}; ws.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); });
  const wsIds = ws.map(d => d._id);

  const cipes = db.ciPipelineExecutions.aggregate([
    { $match: { workspaceId: { $in: wsIds }, createdAt: { $gte: since } } },
    { $project: { workspaceId: 1, runGroups: { $map: { input: "$runGroups", as: "rg", in: { agentInstances: "$$rg.agentInstances", agents: "$$rg.agents" } } } } }
  ], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();

  const orgAgentCipes = {};
  for (const c of cipes) {
    const oid = wsToOrg[c.workspaceId.toString()];
    if (!oid) continue;
    for (const rg of (c.runGroups || [])) {
      if (!rg.agents || rg.agents.length === 0) continue;
      const insts = rg.agentInstances || {};
      let hasTpl = false;
      for (const k of Object.keys(insts)) {
        const lt = insts[k] && insts[k].launchTemplate;
        if (lt !== null && lt !== undefined) { hasTpl = true; break; }
      }
      if (hasTpl) {
        orgAgentCipes[oid] = (orgAgentCipes[oid] || 0) + 1;
        break;
      }
    }
  }
  const counted = Object.entries(orgAgentCipes).filter(([_, n]) => n >= minCipes).map(([oid]) => oid);
  const byPlan = {};
  for (const oid of counted) {
    const p = orgPlan[oid] || "?";
    byPlan[p] = (byPlan[p] || 0) + 1;
  }
  return { total: counted.length, byPlan };
}

print("");
print("=== Paid-tier (TEAM+PRO+ENTERPRISE) breakdowns ===");
const paidCfgs = [
  { plans: ["TEAM", "PRO", "ENTERPRISE"], days: 30, enabled: true, minCipes: 1 },
  { plans: ["TEAM", "ENTERPRISE"], days: 30, enabled: true, minCipes: 1 },
  { plans: ["TEAM", "PRO", "ENTERPRISE"], days: 7, enabled: true, minCipes: 1 },
  { plans: ["TEAM", "ENTERPRISE"], days: 7, enabled: true, minCipes: 1 },
];
for (const c of paidCfgs) {
  const r = countMultiPlan(c.plans, c.days, c.enabled, c.minCipes);
  print(c.plans.join("+") + "  " + c.days + "d  total=" + r.total + "  " + JSON.stringify(r.byPlan));
}
