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

## Saved scripts

All canonical queries live in `scripts/` under this skill directory. Run with `mongosh "$URI" --quiet <script>.js`. Edit the constants at the top (`days`, `targetPlan`, etc.) to retarget. **Use the analytics-tagged URI** below to keep load off the primary.

| Script | Answers |
|---|---|
| `scripts/dte-by-plan.js` | TEAM/PRO/ENTERPRISE: count of orgs and workspaces running any DTE, Manual DTE, launch-template (Cloud Agents). |
| `scripts/agents-adoption.js` | Cloud Agents adoption rate for a plan, with multiple denominators (all/enabled/active/DTE-using). Matches internal KR. |
| `scripts/agents-various-filters.js` | Sweep filter combinations (window, enabled, min CIPEs) to find which definition matches an external number. |
| `scripts/agents-activation-time.js` | Time from a new TEAM org's first CIPE to their first Cloud Agents CIPE. Bucketed: ≤7d, 8-30d, 31-90d, 90+, never. |
| `scripts/docker-by-plan.js` | Workspaces/orgs running tasks with `target` matching `/docker/i`, broken down by plan tier. |
| `scripts/docker-targets.js` | Top docker-matching target names + sample `params` field (mostly empty — the executor command is not in the run record). |
| `scripts/docker-team-orgs.js` | TEAM org names running docker tasks, ranked by task volume. |
| `scripts/docker-on-agents.js` | Split docker tasks into "ran on cloud agent" (distributedExecutionId != null) vs not, with TEAM-only breakdown. |
| `scripts/docker-agent-targets.js` | For TEAM orgs running docker on agents, the actual target names per org (signal for outreach: real build vs lint vs login). |

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
   # Use the analytics-tagged URI for any heavy aggregation — keeps load off the primary
   # and the regular secondaries. Empty fallback tag means "any secondary" if no analytics
   # node is currently available.
   URI="mongodb://readOnlyUser:${PASS}@nrwl-api-prod-shard-00-00.dhknt.mongodb.net:27017,nrwl-api-prod-shard-00-01.dhknt.mongodb.net:27017,nrwl-api-prod-shard-00-02.dhknt.mongodb.net:27017/nrwl-api?ssl=true&authSource=admin&replicaSet=nrwl-api-prod-shard-0&readPreference=secondary&readPreferenceTags=nodeType:ANALYTICS&readPreferenceTags="
   echo "$URI" > /tmp/dte-mongo-uri.txt
   ```

   **Always include `maxTimeMS` in aggregations** (e.g. `maxTimeMS: 600000` for 10-minute cap) so a runaway query gets killed server-side instead of camping on a secondary.

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

## Agents adoption rate (KR tracking)

Internal KR "customers running on Nx Agents" uses the same `launchTemplate != null` signal on a **7-day window**, restricted to **enabled** orgs. Verified May 2026: KR shows 91, 7d-trailing TEAM+enabled landed at 93 — within 2 (the small gap is likely trial/billing-status filtering or last-completed-week vs trailing-7d).

Report multiple denominators when asked about adoption rate:

| Denominator | Meaning |
|---|---|
| All plan-X orgs | Includes dormant/trial — broad PR number |
| Enabled plan-X orgs | Strips disabled/Stripe-issue orgs |
| Active plan-X orgs (≥1 CIPE in window) | "Of customers actually using cloud, %?" — most honest |
| DTE-using plan-X orgs | "Of customers doing DTE, did they pick Cloud Agents?" — feature-level adoption |

The active denominator is what to default to in any report.

```js
// /tmp/agents-adoption.js — answers "what's the current Cloud Agents adoption?"
const days = 7;
const targetPlan = "TEAM";
const since = new Date(Date.now() - days * 24 * 3600 * 1000);

const orgs = db.cloudOrganizations.find({ plan: targetPlan }, { _id: 1, enabled: 1 }).toArray();
const enabledIds = orgs.filter(d => d.enabled !== false).map(d => d._id);

const ws = db.workspaces.find({ orgId: { $in: orgs.map(d => d._id) } }, { _id: 1, orgId: 1 }).toArray();
const wsToOrg = {};
ws.forEach(d => { wsToOrg[d._id.toString()] = d.orgId.toString(); });
const wsIds = ws.map(d => d._id);

const cipes = db.ciPipelineExecutions.aggregate([
  { $match: { workspaceId: { $in: wsIds }, createdAt: { $gte: since } } },
  { $project: { workspaceId: 1, runGroups: { $map: { input: "$runGroups", as: "rg", in: { agents: "$$rg.agents", agentInstances: "$$rg.agentInstances" } } } } }
], { allowDiskUse: true, maxTimeMS: 600000 }).toArray();

const enabledSet = new Set(enabledIds.map(o => o.toString()));
const active = new Set(), dte = new Set(), agents = new Set(), manual = new Set();
for (const c of cipes) {
  const oid = wsToOrg[c.workspaceId.toString()];
  if (!oid || !enabledSet.has(oid)) continue;
  active.add(oid);
  for (const rg of (c.runGroups || [])) {
    if (!rg.agents || rg.agents.length === 0) continue;
    dte.add(oid);
    const insts = rg.agentInstances || {};
    for (const k of Object.keys(insts)) {
      const lt = insts[k] && insts[k].launchTemplate;
      if (lt === null || lt === undefined) manual.add(oid);
      else agents.add(oid);
    }
  }
}

const fmt = (n, d) => n + " / " + d + "  (" + ((n / d) * 100).toFixed(1) + "%)";
print(targetPlan + " " + days + "d adoption:");
print("  enabled orgs:                  " + enabledIds.length);
print("  active (>= 1 CIPE):            " + active.size);
print("  using ANY DTE:                 " + dte.size);
print("  using Cloud Agents:            " + agents.size);
print("  using Manual DTE:              " + manual.size);
print("");
print("Cloud Agents adoption rate:");
print("  of enabled orgs:               " + fmt(agents.size, enabledIds.length));
print("  of active orgs:                " + fmt(agents.size, active.size));
print("  of DTE-using orgs:             " + fmt(agents.size, dte.size));
```

## Running on desktop (MongoDB Compass)

Compass is the official Mongo desktop client — free, native macOS, runs aggregations interactively with stage-by-stage previews. Best place to iterate on queries that don't need JS-loop post-processing.

### One-time setup

1. **Install Compass**: <https://www.mongodb.com/products/tools/compass>.
2. **Whitelist your IP** (every time it changes, e.g. coffee shop wifi):
   ```bash
   ip=$(curl -4 -sS --max-time 5 https://ifconfig.me)
   gh workflow run add-ip-to-atlas-access-list.yaml \
     -F clusterName=PROD -F ipAddress="$ip" \
     -R nrwl/cloud-infrastructure
   ```
   Wait ~30s for Atlas propagation.
3. **Get the password** from gcloud (after `gcloud auth login`):
   ```bash
   gcloud secrets versions access latest --project=nxcloudoperations \
     --secret=production-mongodb-readonly-user-pass-na
   ```
4. **Build the connection URI**. Use the direct (non-SRV) multi-host form because SRV lookups are flaky on macOS:
   ```
   mongodb://readOnlyUser:<PASS>@nrwl-api-prod-shard-00-00.dhknt.mongodb.net:27017,nrwl-api-prod-shard-00-01.dhknt.mongodb.net:27017,nrwl-api-prod-shard-00-02.dhknt.mongodb.net:27017/nrwl-api?ssl=true&authSource=admin&replicaSet=nrwl-api-prod-shard-0&readPreference=secondary&readPreferenceTags=nodeType%3AANALYTICS&readPreferenceTags=
   ```
   Replace `<PASS>`. The `readPreferenceTags=nodeType:ANALYTICS` plus empty-tag fallback routes heavy reads to dedicated analytics nodes, keeping load off the primary and the regular secondaries. URL-encoded as `%3A` because Compass parses these strictly.
5. In Compass click **New Connection**, paste the URI, hit Connect. Save it to a favorite so you don't paste the password each time.

### Running a pipeline

1. In the left sidebar pick the **`nrwl-api`** database, then the collection you're querying (usually `ciPipelineExecutions`, sometimes `runs` or `cloudOrganizations`).
2. Click the **Aggregations** tab.
3. Click **Create New Pipeline** and either paste the whole pipeline as **Text View** (recommended) or build it stage-by-stage.
4. Compass shows the result of each stage live as you edit. Set a small `Sample size` initially (~10) so previews are fast — bump it up only when ready to run the whole pipeline.
5. **Always include `$match` on `createdAt` as the first stage** when touching `ciPipelineExecutions` or `runs`. Without a date filter the pipeline scans the entire collection.

### Cookbook: paste-ready pipelines

Each one below targets a single collection. The `ISODate` literal anchors the window — change it (subtract days from today). Compass also supports `{ $dateSubtract: ... }` if you prefer relative.

**Pipeline 1 — TEAM orgs using Cloud Agents (collection: `ciPipelineExecutions`)**

```js
[
  { $match: { createdAt: { $gte: ISODate("2026-05-08T00:00:00.000Z") } } },
  { $unwind: "$runGroups" },
  { $match: { "runGroups.agents.0": { $exists: true } } },
  { $addFields: { instArr: { $objectToArray: { $ifNull: ["$runGroups.agentInstances", {}] } } } },
  { $match: { "instArr.v.launchTemplate": { $type: "string" } } },
  { $group: { _id: "$workspaceId" } },
  { $lookup: { from: "workspaces", localField: "_id", foreignField: "_id", as: "ws" } },
  { $unwind: "$ws" },
  { $lookup: { from: "cloudOrganizations", localField: "ws.orgId", foreignField: "_id", as: "org" } },
  { $unwind: "$org" },
  { $match: { "org.plan": "TEAM", "org.enabled": { $ne: false } } },
  { $group: { _id: "$org._id", orgName: { $first: "$org.name" } } },
  { $count: "teamOrgsUsingCloudAgents" }
]
```

To list names instead of count: replace the final `$count` with `{ $project: { _id: 0, orgName: 1 } }, { $sort: { orgName: 1 } }`.

For Manual DTE instead, swap the `instArr.v.launchTemplate` match to:

```js
{ $match: {
    "instArr.v": { $not: { $size: 0 } },
    "instArr.v.launchTemplate": { $not: { $type: "string" } }
} }
```

**Pipeline 2 — TEAM orgs running docker tasks (collection: `runs`)**

```js
[
  { $match: { createdAt: { $gte: ISODate("2026-05-08T00:00:00.000Z") }, "tasks.target": { $regex: /docker/i } } },
  { $project: {
      workspaceId: 1,
      dockerTaskCount: { $size: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } } }
  } },
  { $group: { _id: "$workspaceId", dockerTasks: { $sum: "$dockerTaskCount" } } },
  { $lookup: { from: "workspaces", localField: "_id", foreignField: "_id", as: "ws" } },
  { $unwind: "$ws" },
  { $lookup: { from: "cloudOrganizations", localField: "ws.orgId", foreignField: "_id", as: "org" } },
  { $unwind: "$org" },
  { $match: { "org.plan": "TEAM" } },
  { $group: {
      _id: "$org._id",
      orgName: { $first: "$org.name" },
      dockerTasks: { $sum: "$dockerTasks" },
      workspaces: { $push: { name: "$ws.name", tasks: "$dockerTasks" } }
  } },
  { $sort: { dockerTasks: -1 } }
]
```

**Pipeline 3 — Top docker target names (collection: `runs`)**

```js
[
  { $match: { createdAt: { $gte: ISODate("2026-05-08T00:00:00.000Z") }, "tasks.target": { $regex: /docker/i } } },
  { $project: { tasks: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } } } },
  { $unwind: "$tasks" },
  { $group: { _id: "$tasks.target", taskCount: { $sum: 1 } } },
  { $sort: { taskCount: -1 } },
  { $limit: 30 }
]
```

**Pipeline 4 — Docker tasks split by "ran on cloud agent" vs not (collection: `runs`)**

```js
[
  { $match: { createdAt: { $gte: ISODate("2026-05-08T00:00:00.000Z") }, "tasks.target": { $regex: /docker/i } } },
  { $project: {
      onAgent: { $cond: [{ $and: [{ $ne: ["$distributedExecutionId", null] }, { $ne: ["$distributedExecutionId", ""] }] }, "yes", "no"] },
      dockerCount: { $size: { $filter: { input: "$tasks", as: "t", cond: { $regexMatch: { input: "$$t.target", regex: /docker/i } } } } },
      workspaceId: 1
  } },
  { $group: { _id: "$onAgent", tasks: { $sum: "$dockerCount" }, runs: { $sum: 1 }, workspaces: { $addToSet: "$workspaceId" } } },
  { $project: { tasks: 1, runs: 1, workspaceCount: { $size: "$workspaces" } } }
]
```

**Pipeline 5 — Plan-tier breakdown of DTE adoption (collection: `ciPipelineExecutions`)**

```js
[
  { $match: { createdAt: { $gte: ISODate("2026-04-15T00:00:00.000Z") } } },
  { $unwind: "$runGroups" },
  { $match: { "runGroups.agents.0": { $exists: true } } },
  { $addFields: { instArr: { $objectToArray: { $ifNull: ["$runGroups.agentInstances", {}] } } } },
  { $addFields: {
      hasTpl: { $anyElementTrue: { $map: { input: "$instArr", as: "kv", in: { $eq: [{ $type: "$$kv.v.launchTemplate" }, "string"] } } } },
      hasManual: { $anyElementTrue: { $map: { input: "$instArr", as: "kv", in: { $ne: [{ $type: "$$kv.v.launchTemplate" }, "string"] } } } }
  } },
  { $group: { _id: "$workspaceId", hasTpl: { $max: { $cond: ["$hasTpl", 1, 0] } }, hasManual: { $max: { $cond: ["$hasManual", 1, 0] } } } },
  { $lookup: { from: "workspaces", localField: "_id", foreignField: "_id", as: "ws" } },
  { $unwind: "$ws" },
  { $lookup: { from: "cloudOrganizations", localField: "ws.orgId", foreignField: "_id", as: "org" } },
  { $unwind: "$org" },
  { $group: {
      _id: { plan: "$org.plan", orgId: "$org._id" },
      tplOrg: { $max: "$hasTpl" },
      manualOrg: { $max: "$hasManual" }
  } },
  { $group: {
      _id: "$_id.plan",
      orgsAnyDte: { $sum: 1 },
      orgsCloudAgents: { $sum: "$tplOrg" },
      orgsManualDte: { $sum: "$manualOrg" }
  } },
  { $sort: { orgsAnyDte: -1 } }
]
```

### Tips for Compass

- **Use the analytics URI** (the `nodeType:ANALYTICS` one) for everything heavy. Compass also has a "Read preferences" section in the connection advanced settings if you skip the tag in the URI.
- **Set the operation timeout** in the aggregation options panel (gear icon next to Run). Default is no timeout — for safety set to 600000 ms (10 min). Mirrors `maxTimeMS` from mongosh.
- **Enable "Allow Disk Use"** in the same options panel for any aggregation with `$group` or `$sort` on large data. The default 100MB in-memory limit will trip otherwise.
- **Export results** with the **Export** button (top right of result panel) — pick JSON or CSV. Useful for handing org lists to CS.
- **Save aggregations** with the **Save** button. They're stored per-connection in Compass. Easier than re-pasting.
- If a stage takes too long, click the small loading spinner to cancel. The query is killed server-side via `killCursors`.

### When to use mongosh + scripts instead

The Compass aggregation builder is great for pure pipelines but doesn't support JS-side post-processing. Two cases where the `scripts/*.js` files in this skill folder are better:

- **Cross-collection aggregations that need iteration**, e.g. `agents-activation-time.js` joins per-workspace `min(createdAt)` results across two separate aggregations and computes diffs in JS.
- **Sweeps over parameter combinations**, e.g. `agents-various-filters.js` runs the same query under 5+ filter combos. Easier in JS than rebuilding pipelines.

Run those with mongosh:

```bash
URI=$(cat /tmp/dte-mongo-uri.txt)   # or the analytics-tagged URI
mongosh "$URI" --quiet ~/projects/dot-ai-config/dot_claude/skills/dte-analyzer/scripts/<name>.js
```

## Variants the user may ask for

- **"Top N Team customers by Manual DTE volume"** -> aggregate CIPE/agent counts per org, not just presence. Group by orgId, sum agent count or CIPE count.
- **"When did each org adopt Manual DTE?"** -> min(createdAt) over CIPEs with manual agents per org.
- **"Churn: orgs that stopped using Manual DTE"** -> compare two windows (e.g. days 31-60 vs days 1-30).
- **"Cross-plan DTE comparison"** -> run the all-plans loop; report % of each plan's orgs that ran DTE.
- **"Manual DTE agent counts"** -> sum `agents.length` per run group across CIPEs.
- **"Current Cloud Agents adoption rate"** -> use the 7-day TEAM+enabled query above; matches the internal KR within ~2 orgs.
