const days = 30;
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

const teamOrgIds = db.cloudOrganizations.find({ plan: "TEAM" }, { _id: 1 }).toArray().map(d => d._id);
print("TEAM orgs total: " + teamOrgIds.length);

const teamWsDocs = db.workspaces.find({ orgId: { $in: teamOrgIds } }, { _id: 1, orgId: 1 }).toArray();
const teamWsIds = teamWsDocs.map(d => d._id);
const wsToOrg = {};
teamWsDocs.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); });
print("TEAM workspaces total: " + teamWsIds.length);

const cipes = db.ciPipelineExecutions.aggregate([
  { $match: { workspaceId: { $in: teamWsIds }, createdAt: { $gte: since } } },
  { $project: { workspaceId: 1, runGroups: { $map: { input: "$runGroups", as: "rg", in: { agents: "$$rg.agents", agentInstances: "$$rg.agentInstances" } } } } }
], { allowDiskUse: true }).toArray();
print("CIPEs (last " + days + " days, TEAM): " + cipes.length);

const wsWithDte = new Set();
const wsWithManual = new Set();
const wsWithTemplate = new Set();

for (const c of cipes) {
  const wsId = c.workspaceId.toString();
  for (const rg of (c.runGroups || [])) {
    const agents = rg.agents || [];
    if (agents.length === 0) continue;
    wsWithDte.add(wsId);
    const insts = rg.agentInstances || {};
    let anyManual = false, anyTpl = false;
    for (const k of Object.keys(insts)) {
      const lt = insts[k] && insts[k].launchTemplate;
      if (lt === null || lt === undefined) anyManual = true; else anyTpl = true;
    }
    if (anyManual) wsWithManual.add(wsId);
    if (anyTpl) wsWithTemplate.add(wsId);
  }
}

const orgWithDte = new Set(), orgWithManual = new Set(), orgWithTpl = new Set();
wsWithDte.forEach(w => orgWithDte.add(wsToOrg[w]));
wsWithManual.forEach(w => orgWithManual.add(wsToOrg[w]));
wsWithTemplate.forEach(w => orgWithTpl.add(wsToOrg[w]));

const onlyManual = [...orgWithManual].filter(o => !orgWithTpl.has(o));
const mixed = [...orgWithManual].filter(o => orgWithTpl.has(o));

print("");
print("=== Last " + days + " days ===");
print("TEAM orgs with any DTE: " + orgWithDte.size);
print("TEAM orgs with manual DTE: " + orgWithManual.size);
print("TEAM orgs with launch-template DTE: " + orgWithTpl.size);
print("TEAM orgs exclusively manual: " + onlyManual.length);
print("TEAM orgs mixed (both manual + template): " + mixed.length);
print("");
print("TEAM workspaces with any DTE: " + wsWithDte.size);
print("TEAM workspaces with manual DTE: " + wsWithManual.size);
print("TEAM workspaces with launch-template DTE: " + wsWithTemplate.size);
