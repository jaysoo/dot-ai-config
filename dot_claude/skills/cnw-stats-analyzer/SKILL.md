---
name: cnw-stats-analyzer
description: >
  Query and analyze create-nx-workspace (CNW) telemetry data from MongoDB.
  Supports prod and staging environments. Use for error analysis, funnel
  metrics, version comparisons, and usage trends. Triggers on "CNW stats",
  "workspace stats", "error rates", "telemetry", "commandStats", "CNW errors",
  "CNW analysis".
---

# CNW Stats Analyzer

Analyze create-nx-workspace telemetry from the `commandStats` MongoDB collection.

## Default Output

**Always break down results per day** unless the user explicitly asks for totals only. All dates must be in **EST/EDT** using `timezone: "America/New_York"` in `$dateToString`.

The default report includes these sections (all per-day):

1. **Daily Completion Funnel** — starts, precreate, complete, error, cancel counts with conversion rates (precreate/starts, complete/starts, error/starts)
2. **Daily Cloud Adoption** — `nxCloudArg` from complete events (skip, never, yes, github, gitlab, azure, bitbucket) with cloud opt-in rate (yes + CI providers / completes)
3. **Daily Error Breakdown** — error codes by day as both counts and **rates (% of that day's starts)**
4. **INVALID_WORKSPACE_NAME Detail** — actual workspace names attempted, grouped by name and day, sorted by count
5. **WORKSPACE_CREATION_FAILED Detail** — categorize error messages by pattern (see categorization list below), grouped by pattern and day
6. **Package Manager Distribution** — from precreate events
7. **Preset/Template Distribution** — from precreate events (top 15)
8. **Nx Version Distribution** — from start events
9. **Flow Variant Distribution** — from start events
10. **VCS Push Status** — from complete events

### WORKSPACE_CREATION_FAILED Categorization

When reporting WORKSPACE_CREATION_FAILED errors, classify each `errorMessage` into these categories:

| Pattern to match in errorMessage | Category |
|----------------------------------|----------|
| `ERESOLVE` | ERESOLVE dependency conflict |
| `native-bindings` or `native binding` | Native bindings not found (Termux/Android) |
| `ENOENT` | ENOENT (file/command not found) |
| `ETARGET` | ETARGET (version not found) |
| `EACCES` | EACCES (permission denied) |
| `ETIMEDOUT`, `ECONNRESET`, `EAI_AGAIN`, `ENOTFOUND` | Network error |
| `startsWith` | pnpm null startsWith bug |
| `deprecated` | npm deprecation warning (false positive) |
| `CommaExpected` or `parse` | JSON parse error |
| `spawnSync` | spawnSync ENOENT |
| `EPERM` | EPERM (Windows permission) |
| `ERR_PNPM` | pnpm error |
| `Cannot find module` | Cannot find module |
| `ENOMEM` or `heap` | Out of memory |
| `must provide string spec` | npm must provide string spec |
| `does not match the schema` | Schema validation error |
| (none of the above) | Other: (first 120 chars of message) |

## Default Filters

**Always apply** these filters to all queries unless the user explicitly asks to include them:

1. **Exclude CI runs** — `{ isCI: false }` — CI runs (e.g. `@schenker/workspace@e2e`, automated pipelines) heavily skew funnels since they often fire `start` but never reach `precreate`. Only ~18% of CI starts convert to precreate vs ~79% for humans.
2. **Exclude AI agent runs** — `{ meta: { $not: { $regex: "\"aiAgent\":true" } } }` — AI agents have very different error profiles (high `DIRECTORY_EXISTS` and `INVALID_WORKSPACE_NAME` from retries and invalid names like `"."` or numeric prefixes). They also heavily favor pnpm, skewing package manager stats.
3. **Exclude @contentful/nx** — `{ meta: { $not: { $regex: "contentful" } } }` — High-volume automated preset that drowns out organic usage.

**Standard base filter for all queries:**
```js
const base = [
  { createdAt: { $gte: startDate, $lte: endDate } },
  { isCI: false },
  { meta: { $not: { $regex: "contentful" } } },
  { meta: { $not: { $regex: "\"aiAgent\":true" } } }
];
// Use with: { $and: [...base, { meta: { $regex: "\"type\":\"start\"" } }] }
```

If the user asks for AI or CI stats specifically, run those as a **separate breakdown** alongside the main (filtered) numbers.

### Date Range Handling

- Convert user-provided dates to UTC, accounting for EST/EDT offset (EDT = UTC-4, EST = UTC-5)
- "Last N days" includes today's partial day
- Always use `America/New_York` timezone in `$dateToString` for grouping by EST date
- When user says "EST", use ET (handles DST automatically with `America/New_York`)

## Connection

### 1. Whitelist your IP in MongoDB Atlas

MongoDB Atlas requires your current IP on the access list. Run this before connecting:

```bash
# Get current IP and add to Atlas access list (use PROD or STAGING)
ip="$(curl -4 -sS --fail --max-time 5 https://ifconfig.me)" \
  && printf '%s\n' "$ip" | awk -F. 'NF==4 && $1>=0 && $1<=255 && $2>=0 && $2<=255 && $3>=0 && $3<=255 && $4>=0 && $4<=255 {exit 0} {exit 1}' \
  && gh workflow run add-ip-to-atlas-access-list.yaml \
       -F "clusterName=PROD" \
       -F "ipAddress=${ip}" \
       -R nrwl/cloud-infrastructure
```

Replace `PROD` with `STAGING` if connecting to the staging cluster.

### 2. Authenticate with gcloud

Before you can read password from `gcloud` command you must login first via `gcloud auth login`.

Check with `gcloud auth list` to ensure that your `@nrwl.io` account is credentialed. Do this before proceeding.

### 3. Connect

```bash
# Prod
PASS=$(gcloud secrets versions access latest --project="nxcloudoperations" --secret="production-mongodb-readonly-user-pass-na")
mongosh "mongodb+srv://readOnlyUser:${PASS}@nrwl-api-prod.dhknt.mongodb.net/nrwl-api"

# Staging
PASS=$(gcloud secrets versions access latest --project="nxcloudoperations" --secret="staging-mongodb-readonly-user-pass")
mongosh "mongodb+srv://readOnlyUser:${PASS}@nrwl.bdi7j.mongodb.net/nrwl-api"
```

Save the URI to `/tmp/cnw-mongo-uri.txt` for reuse across queries:
```bash
PASS=$(gcloud secrets versions access latest --project="nxcloudoperations" --secret="production-mongodb-readonly-user-pass-na")
echo "mongodb+srv://readOnlyUser:${PASS}@nrwl-api-prod.dhknt.mongodb.net/nrwl-api" > /tmp/cnw-mongo-uri.txt
```

For large exports use `mongoexport` (streams without memory issues) instead of `mongosh`.

## Schema: `commandStats`

```json
{
  "_id": "ObjectId",
  "command": "create-nx-workspace",
  "isCI": true,
  "useCloud": false,
  "meta": "<string - CSV or JSON>",
  "createdAt": "ISODate"
}
```

### Meta Field Formats

**Legacy CSV** (pre-22.2.2): `"enable-ci"`, `"start"`, `"which-ci-provider,github,FailedToPushToVcs"`

Starting ~Nov 2025 (22.1.x), a version prefix was added: `"22.1.3,which-ci-provider,github,FailedToPushToVcs"` and `"22.1.3,start"`.

**CRITICAL**: When querying legacy CSV completions, always use `{ meta: { $regex: "which-ci-provider" } }` (contains), NOT `{ meta: { $regex: "^which-ci-provider," } }` (starts-with). The starts-with pattern misses version-prefixed rows, which undercounts Nov 2025 by ~6,000 events. To extract the cloud arg from version-prefixed rows, find the index of `"which-ci-provider"` in the comma-split array and take the next element:

```js
// ✅ CORRECT - handles both "which-ci-provider,github,..." and "22.1.3,which-ci-provider,github,..."
{ $function: {
  body: function(meta) {
    var parts = meta.split(",");
    var idx = parts.indexOf("which-ci-provider");
    return idx >= 0 && idx+1 < parts.length ? parts[idx+1] : "unknown";
  },
  args: ["$meta"],
  lang: "js"
}}
```

**JSON** (22.2.2+, Dec 2025 onward): Stringified JSON with `type` field.

### Event Lifecycle (`type` field)

| Type        | When                         | Key Fields                                                 |
| ----------- | ---------------------------- | ---------------------------------------------------------- |
| `start`     | Beginning of CLI run         | `nxVersion`, `nodeVersion`, `flowVariant`, `aiAgent` (boolean) |
| `precreate` | After prompts, before create | `template`, `preset`, `packageManager`, `ghAvailable`      |
| `complete`  | Workspace created            | `pushedToVcs`, `nxCloudArg`, `connectUrl`, `setupCIPrompt` |
| `error`     | Creation threw exception     | `errorCode`, `errorMessage`, `errorFile`                   |
| `cancel`    | User cancelled (Ctrl+C)      | `flowVariant`                                              |

### Telemetry Feature Timeline

Understanding when features were introduced is critical for cross-month comparisons:

| Feature | First Appeared | Notes |
| ------- | -------------- | ----- |
| Completion events only | Pre-Nov 2025 | 1 event per CNW invocation — completions **are** total usage |
| `start` events (funnel) | **Nov 13, 2025** | Multiple events per invocation from this point |
| Version prefix in CSV | ~Nov 2025 (22.1.x) | e.g. `"22.1.3,which-ci-provider,..."` |
| JSON meta format | Dec 2025 (22.2.2) | Replaces CSV; Dec is mixed ~64% JSON / 36% CSV |
| `aiAgent` field | Feb 2026 | 0 AI events in Jan 2026 |
| `INVALID_WORKSPACE_NAME` error code | Mar 18, 2026 | New categorization, not a regression |

**IMPORTANT for cross-month comparisons**: Before Nov 2025, completions = total invocations. After Nov 2025, you need `start` events for total invocations. Comparing Oct completions to Jan completions is **not** apples-to-apples — use Jan starts instead.

### Error Codes

| Code                        | Description                               |
| --------------------------- | ----------------------------------------- |
| `WORKSPACE_CREATION_FAILED` | `npx nx new` failed (often npm stderr)    |
| `UNKNOWN`                   | Uncategorized (missing PM, git issues)    |
| `PRESET_FAILED`             | Preset application failed                 |
| `SANDBOX_FAILED`            | Dependency install in temp sandbox failed |
| `TEMPLATE_CLONE_FAILED`     | Git clone of template repo failed         |
| `CI_WORKFLOW_FAILED`        | CI workflow generation failed             |
| `DIRECTORY_EXISTS`          | Target directory already exists           |
| `INVALID_WORKSPACE_NAME`    | Name doesn't match validation (most common: `"."`) |
| `INVALID_PACKAGE_MANAGER`   | Unsupported or missing package manager    |
| `INVALID_PRESET`            | Preset name not recognized                |

### VCS Push Status (`pushedToVcs` in `complete` events)

- `PushedToVcs` / `FailedToPushToVcs` / `OptedOutOfPushingToVcs` / `SkippedGit`

**Note**: `FailedToPushToVcs` is `type: "complete"`, not `type: "error"`.

## Query Strategy

Run queries in **two batches** to avoid timeout and keep output manageable:

**Batch 1** (single mongosh call): Daily funnel, error breakdown by code, package manager, preset/template, Nx version, flow variant, VCS push, CI setup prompt, Nx Cloud arg by day.

**Batch 2** (single mongosh call): INVALID_WORKSPACE_NAME detail (names by day), WORKSPACE_CREATION_FAILED categorized patterns by day, sample UNKNOWN errors.

Use `$function` with `lang: "js"` for parsing JSON meta fields in aggregation pipelines.

## Common Queries

### Count starts by month

```bash
mongosh "$URI" --quiet --eval '
db.commandStats.aggregate([
  { $match: { createdAt: { $gte: new Date("2026-01-01") }, meta: { $regex: "\"type\":\"start\"" } } },
  { $addFields: { yearMonth: { $dateToString: { format: "%Y-%m", date: "$createdAt" } } } },
  { $group: { _id: "$yearMonth", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])'
```

### Error breakdown by code

```bash
mongosh "$URI" --quiet --eval '
db.commandStats.aggregate([
  { $match: { createdAt: { $gte: new Date("2026-01-01") }, meta: { $regex: "\"type\":\"error\"" } } },
  { $addFields: { errorCode: { $arrayElemAt: [{ $regexFind: { input: "$meta", regex: /"errorCode":"([^"]+)"/ } }.captures, 0] } } },
  { $group: { _id: "$errorCode", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])'
```

### Filter by Nx version

```bash
mongosh "$URI" --quiet --eval '
db.commandStats.find({
  $and: [
    { meta: { $regex: "\"nxVersion\":\"22\\.5\\.4\"" } },
    { meta: { $regex: "\"type\":\"error\"" } }
  ]
})'
```

### Export for local analysis

```bash
mongoexport --uri="$URI" --collection=commandStats --type=json \
  --fields=command,isCI,useCloud,meta,createdAt \
  --query='{"createdAt":{"$gte":{"$date":"2026-01-01T00:00:00.000Z"}}}' \
  --out="$HOME/Downloads/commandStats-export.json"
```

### Local Python analysis

```python
import json
from collections import Counter, defaultdict

def valid_node(nv):
    """Exclude odd-numbered (dev) majors and versions before 20.19."""
    parts = nv.split('.')
    major, minor = int(parts[0]), int(parts[1])
    return major % 2 == 0 and (major > 20 or (major == 20 and minor >= 19))

starts = defaultdict(int)
errors = defaultdict(Counter)

with open('commandStats-export.json') as f:
    for line in f:
        doc = json.loads(line)
        meta = doc.get('meta', '') or ''
        dt = doc['createdAt']['$date'][:7]  # YYYY-MM
        if '"type":"start"' in meta:
            parsed = json.loads(meta)
            if valid_node(parsed.get('nodeVersion', '')):
                starts[dt] += 1
        if '"type":"error"' in meta:
            parsed = json.loads(meta)
            if valid_node(parsed.get('nodeVersion', '')):
                errors[dt][parsed.get('errorCode', 'UNKNOWN')] += 1
```

## Common Pitfalls

### MongoDB: Never use duplicate field names in match

MongoDB (and JS objects) silently drop duplicate keys. The second overwrites the first.

```js
// ❌ Only matches B — first `meta` key is silently dropped
{ meta: { $regex: "A" }, meta: { $regex: "B" } }

// ✅ Use $and for multiple conditions on the same field
{ $and: [{ meta: { $regex: "A" } }, { meta: { $regex: "B" } }] }
```

### Always anchor version regexes to the field name

Bare version strings match unintended versions (e.g. `22.6.0` matches inside `22.16.0` or `22.5.0`).

```js
// ❌ Matches 22.5.0, 22.16.0, 22.6.0-beta.0, etc.
{ meta: { $regex: "22\\.6\\.0" } }

// ✅ Anchored to the JSON field name
{ meta: { $regex: "\"nxVersion\":\"22\\.6\\.0\"" } }
```

### Projection exclusion/inclusion cannot be mixed

```js
// ❌ Fails — can't mix inclusion (meta:1) with exclusion (_id:0)
{ projection: { meta: 1, createdAt: 1, _id: 0 } }

// ✅ Just use inclusion fields and accept _id, or use aggregation $project
```
