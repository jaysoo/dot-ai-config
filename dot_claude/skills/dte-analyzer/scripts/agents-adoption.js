const days = 30;
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

const teamOrgs = db.cloudOrganizations.find({ plan: "TEAM" }, { _id: 1, enabled: 1 }).toArray();
const teamOrgIds = teamOrgs.map(d => d._id);
const enabledTeamOrgIds = teamOrgs.filter(d => d.enabled !== false).map(d => d._id);

const teamWs = db.workspaces.find({ orgId: { $in: teamOrgIds } }, { _id: 1, orgId: 1 }).toArray();
const teamWsIds = teamWs.map(d => d._id);
const wsToOrg = {};
teamWs.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); });

// CIPEs in window per workspace
const cipes = db.ciPipelineExecutions.aggregate([
  { $match: { workspaceId: { $in: teamWsIds }, createdAt: { $gte: since } } },
  { $project: { workspaceId: 1, runGroups: { $map: { input: "$runGroups", as: "rg", in: { agents: "$$rg.agents", agentInstances: "$$rg.agentInstances" } } } } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();

const orgActive = new Set();
const orgDte = new Set();
const orgAgents = new Set(); // launch-template
const orgManual = new Set();

for (const c of cipes) {
  const oid = wsToOrg[c.workspaceId.toString()];
  if (!oid) continue;
  orgActive.add(oid);
  for (const rg of (c.runGroups || [])) {
    if (!rg.agents || rg.agents.length === 0) continue;
    orgDte.add(oid);
    const insts = rg.agentInstances || {};
    let m = false, t = false;
    for (const k of Object.keys(insts)) {
      const lt = insts[k] && insts[k].launchTemplate;
      if (lt === null || lt === undefined) m = true; else t = true;
    }
    if (m) orgManual.add(oid);
    if (t) orgAgents.add(oid);
  }
}

const fmt = (n, d) => n + " / " + d + "  (" + ((n / d) * 100).toFixed(1) + "%)";

print("=== Nx Cloud Agents adoption for TEAM plan (last " + days + " days) ===");
print("");
print("TEAM orgs total:                  " + teamOrgs.length);
print("TEAM orgs enabled:                " + enabledTeamOrgIds.length);
print("TEAM orgs active (≥1 CIPE):       " + orgActive.size);
print("TEAM orgs using ANY DTE:          " + orgDte.size);
print("TEAM orgs using Cloud Agents:     " + orgAgents.size + "  (launch-template)");
print("TEAM orgs using Manual DTE:       " + orgManual.size);
print("");
print("Cloud Agents adoption rate:");
print("  of all TEAM orgs:              " + fmt(orgAgents.size, teamOrgs.length));
print("  of enabled TEAM orgs:          " + fmt(orgAgents.size, enabledTeamOrgIds.length));
print("  of active TEAM orgs:           " + fmt(orgAgents.size, orgActive.size));
print("  of DTE-using TEAM orgs:        " + fmt(orgAgents.size, orgDte.size));
