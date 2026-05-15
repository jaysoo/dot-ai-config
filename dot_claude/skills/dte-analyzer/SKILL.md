---
name: dte-analyzer
description: >
  Query and analyze Nx Cloud Distributed Task Execution (DTE) usage from the
  MongoDB nrwl-api database. Distinguishes Manual DTE (self-managed agents,
  no launchTemplate) from launch-template DTE (Nx Cloud-managed agents).
  Breaks down by plan tier (TEAM, PRO, ENTERPRISE, FREE, etc.) and time
  window. Triggers on "DTE stats", "manual DTE", "Team customers DTE",
  "distributed execution analysis", "agents stats", "launch template usage",
  "DTE adoption", "DTE breakdown by plan".
---

# DTE Analyzer

Analyze Distributed Task Execution (DTE) usage across customers in the `nrwl-api` MongoDB. Reuses connection setup from `cnw-stats-analyzer` skill.

## Key concepts

**Manual DTE** = customer launches agents themselves (their own CI infra, no Nx Cloud launch template). In schema: `MAgentInstance.launchTemplate == null` (also `agentDisplayName == null` per the schema comment, but `launchTemplate` is the reliable signal).

**Launch-template DTE** = Nx Cloud spawns agents from a customer-defined launch template. `MAgentInstance.launchTemplate` is a non-null string.

**Mixed** = a workspace/org used both styles across different CIPEs (or different run groups in one CIPE).

## Schema

| Collection | Key fields | Source |
|---|---|---|
| `cloudOrganizations` | `plan` (`MPlan` enum: `LEGACY`, `FREE`, `PRO`, `OSS`, `ENTERPRISE`, `TEAM`), `_id`, `name`, `enabled` | `libs/shared/db-schema-kotlin/src/main/kotlin/CloudOrganization.kt` |
| `workspaces` | `_id`, `orgId` (FK -> cloudOrganizations._id) | `libs/shared/db-schema-kotlin/src/main/kotlin/Workspace.kt` |
| `ciPipelineExecutions` | `workspaceId`, `createdAt`, `runGroups[].agents[]`, `runGroups[].agentInstances{}` | `libs/shared/db-schema-kotlin/src/main/kotlin/CiPipelineExecution.kt` |

`runGroups[].agentInstances` is a `MutableMap<String, MAgentInstance>` keyed by agent name. Each `MAgentInstance` has `launchTemplate: String? = null`. Comment in schema: "Agent run from manual DTE will not have this value".

`runGroups[].agents` is a `MutableList<String>` of agent names. If empty, the run group did no DTE (caching-only or single-agent). Classify only when `agents.length > 0`.

Some CIPEs have non-empty `agents` but empty `agentInstances` (legacy or aborted runs). Count them as "DTE happened" but cannot classify manual vs template — surface as a caveat.

## Connection

Same as `cnw-stats-analyzer`:

1. **Whitelist IP** in Atlas:
   ```bash
   ip=$(curl -4 -sS --max-time 5 https://ifconfig.me)
   gh workflow run add-ip-to-atlas-access-list.yaml \
     -F clusterName=PROD -F ipAddress="$ip" \
     -R nrwl/cloud-infrastructure
   ```

2. **Authenticate gcloud** (`gcloud auth list` to verify `@nrwl.io` account credentialed).

3. **Build URI**. The SRV URI (`mongodb+srv://...nrwl-api-prod.dhknt.mongodb.net/...`) frequently times out in mongosh on macOS. Use the multi-host direct URI with the correct replica set name:

   ```bash
   PASS=$(gcloud secrets versions access latest --project=nxcloudoperations --secret=production-mongodb-readonly-user-pass-na)
   URI="mongodb://readOnlyUser:${PASS}@nrwl-api-prod-shard-00-00.dhknt.mongodb.net:27017,nrwl-api-prod-shard-00-01.dhknt.mongodb.net:27017,nrwl-api-prod-shard-00-02.dhknt.mongodb.net:27017/nrwl-api?ssl=true&authSource=admin&replicaSet=nrwl-api-prod-shard-0&readPreference=secondaryPreferred"
   echo "$URI" > /tmp/dte-mongo-uri.txt
   ```

   **Replica set name is `nrwl-api-prod-shard-0`** (NOT `atlas-yzwbed-shard-0` — that's wrong). If you guess wrong, mongosh hangs on server selection. Verify with `db.hello().setName` from a `directConnection=true` URI to one shard if the cluster is rebuilt.

   For staging, swap the hosts to `nrwl.bdi7j.mongodb.net` and use the `staging-mongodb-readonly-user-pass` secret. Replica set name on staging is different — query `db.hello().setName` first.

## Default report

Always run for a stated window (default 30 days). Always break down by plan tier — `TEAM` is the common ask, but PRO and ENTERPRISE are usually relevant too. Report both orgs and workspaces because a single org may have many workspaces.

| Metric | Notes |
|---|---|
| Plan total (orgs / workspaces) | All-time, regardless of DTE usage. Filter `enabled: true` if reporting "active customers." |
| Ran any DTE | CIPE in window with `agents.length > 0` in any run group |
| Ran Manual DTE | At least one `agentInstances[*].launchTemplate` is null/undefined |
| Ran launch-template DTE | At least one `agentInstances[*].launchTemplate` is a non-null string |
| Exclusively manual | Manual yes, template no |
| Mixed | Both |
| Unclassified (caveat) | Had agents but empty agentInstances |

## Reference query (TEAM, last 30 days)

Save as `/tmp/dte-by-plan.js` and run with `mongosh "$URI" --quiet /tmp/dte-by-plan.js`. Adjust `targetPlan` and `days` as needed. Don't try to inline-eval — bash escapes `!` and other JS operators incorrectly.

```js
const days = 30;
const targetPlan = "TEAM"; // or "PRO", "ENTERPRISE", "FREE", etc.
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

const orgIds = db.cloudOrganizations
  .find({ plan: targetPlan }, { _id: 1 })
  .toArray()
  .map(d => d._id);
print(targetPlan + " orgs total: " + orgIds.length);

const wsDocs = db.workspaces
  .find({ orgId: { $in: orgIds } }, { _id: 1, orgId: 1 })
  .toArray();
const wsIds = wsDocs.map(d => d._id);
const wsToOrg = {};
wsDocs.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); });
print(targetPlan + " workspaces total: " + wsIds.length);

const cipes = db.ciPipelineExecutions.aggregate([
  { $match: { workspaceId: { $in: wsIds }, createdAt: { $gte: since } } },
  { $project: { workspaceId: 1, runGroups: { $map: { input: "$runGroups", as: "rg", in: { agents: "$$rg.agents", agentInstances: "$$rg.agentInstances" } } } } }
], { allowDiskUse: true }).toArray();
print("CIPEs (last " + days + " days): " + cipes.length);

const wsAnyDte = new Set();
const wsManual = new Set();
const wsTpl = new Set();

for (const c of cipes) {
  const w = c.workspaceId.toString();
  for (const rg of (c.runGroups || [])) {
    if (!rg.agents || rg.agents.length === 0) continue;
    wsAnyDte.add(w);
    const insts = rg.agentInstances || {};
    let m = false, t = false;
    for (const k of Object.keys(insts)) {
      const lt = insts[k] && insts[k].launchTemplate;
      if (lt === null || lt === undefined) m = true; else t = true;
    }
    if (m) wsManual.add(w);
    if (t) wsTpl.add(w);
  }
}

const orgAny = new Set(), orgManual = new Set(), orgTpl = new Set();
wsAnyDte.forEach(w => orgAny.add(wsToOrg[w]));
wsManual.forEach(w => orgManual.add(wsToOrg[w]));
wsTpl.forEach(w => orgTpl.add(wsToOrg[w]));

const onlyManual = [...orgManual].filter(o => !orgTpl.has(o));
const mixed = [...orgManual].filter(o => orgTpl.has(o));

print("");
print("=== " + targetPlan + ", last " + days + " days ===");
print("Orgs with any DTE: " + orgAny.size);
print("Orgs with Manual DTE: " + orgManual.size);
print("  exclusively manual: " + onlyManual.length);
print("  mixed (manual + template): " + mixed.length);
print("Orgs with launch-template DTE: " + orgTpl.size);
print("");
print("Workspaces with any DTE: " + wsAnyDte.size);
print("Workspaces with Manual DTE: " + wsManual.size);
print("Workspaces with launch-template DTE: " + wsTpl.size);
```

## All-plans breakdown

To produce a single table covering every plan tier:

```js
const days = 30;
const since = new Date(Date.now() - days * 24 * 3600 * 1000);
const plans = ["FREE", "TEAM", "PRO", "ENTERPRISE", "OSS", "LEGACY"];

for (const plan of plans) {
  // ...repeat the per-plan block, emit one row...
}
```

For very large windows (e.g. all-time), narrow workspace match with `enabled: true` on `cloudOrganizations`, and consider an aggregation pipeline that does the org lookup inside Mongo via `$lookup` instead of pulling workspace lists client-side.

## Common pitfalls

- **Don't use `mongosh --eval` for multiline JS with `!`, `&&`, `||`.** Bash escapes these; mongosh emits a unicode-escape syntax error. Write to a `.js` file and pass as the script arg.
- **SRV URI hangs on macOS.** mongosh's node driver's DNS sometimes can't resolve `_mongodb._tcp.<cluster>.mongodb.net` even when `dig` succeeds. Use the multi-host direct URI with the right replica set name.
- **Replica set name is NOT predictable from the cluster name.** `nrwl-api-prod.dhknt.mongodb.net` -> `nrwl-api-prod-shard-0`. Always verify with `db.hello().setName` via `directConnection=true`.
- **`agentInstances` map can be empty even when `agents` array is non-empty.** Treat as "DTE happened, manual/template unknown." Surface the count as a caveat — don't silently drop them.
- **`launchTemplate` is `null` for manual but can also be `null` if telemetry was dropped.** In practice the schema treats null as the manual signal; trust it but note the small risk if numbers seem high.
- **`MAgentInstance.agentDisplayName == null` is documented as also-null-for-manual** but empirical data (May 2026) shows manual agents with `agentDisplayName: "5"` etc. — the schema comment on that field is stale. **Use `launchTemplate` only.**
- **Plan != billing.** TEAM in `cloudOrganizations.plan` is the assigned tier. A TEAM org may be in trial, may have a Stripe issue, may be disabled. Filter `enabled: true` if you want active paying customers; otherwise note the caveat.
- **DTE != "Distribution On" YAML.** `MRunGroupConfig.dte.distributeOn` (newer field, `RunGroupConfig.kt`) can be a literal `"manual"` string, but historically agent-level `launchTemplate == null` is the reliable indicator across all CIPE versions.

## Variants the user may ask for

- **"Top N Team customers by Manual DTE volume"** -> aggregate CIPE/agent counts per org, not just presence. Group by orgId, sum agent count or CIPE count.
- **"When did each org adopt Manual DTE?"** -> min(createdAt) over CIPEs with manual agents per org.
- **"Churn: orgs that stopped using Manual DTE"** -> compare two windows (e.g. days 31-60 vs days 1-30).
- **"Cross-plan DTE comparison"** -> run the all-plans loop; report % of each plan's orgs that ran DTE.
- **"Manual DTE agent counts"** -> sum `agents.length` per run group across CIPEs.
