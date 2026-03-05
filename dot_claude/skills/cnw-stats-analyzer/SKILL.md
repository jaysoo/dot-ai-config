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

## Connection

Before you can read password from `gcloud` command you must login first via `gcloud auth login`.

Check with `gcloud auth list` to ensure that your `@nrwl.io` account is credentialed. Do this before proceeding.

```bash
# Prod
PASS=$(gcloud secrets versions access latest --project="nxcloudoperations" --secret="production-mongodb-readonly-user-pass-na")
mongosh "mongodb+srv://readOnlyUser:${PASS}@nrwl-api-prod.dhknt.mongodb.net/nrwl-api"

# Staging
PASS=$(gcloud secrets versions access latest --project="nxcloudoperations" --secret="staging-mongodb-readonly-user-pass")
mongosh "mongodb+srv://readOnlyUser:${PASS}@nrwl.bdi7j.mongodb.net/nrwl-api"
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

**JSON** (22.2.2+, Dec 2025 onward): Stringified JSON with `type` field.

### Event Lifecycle (`type` field)

| Type        | When                         | Key Fields                                                 |
| ----------- | ---------------------------- | ---------------------------------------------------------- |
| `start`     | Beginning of CLI run         | `nxVersion`, `nodeVersion`, `flowVariant`, `aiAgent`       |
| `precreate` | After prompts, before create | `template`, `preset`, `packageManager`, `ghAvailable`      |
| `complete`  | Workspace created            | `pushedToVcs`, `nxCloudArg`, `connectUrl`, `setupCIPrompt` |
| `error`     | Creation threw exception     | `errorCode`, `errorMessage`, `errorFile`                   |
| `cancel`    | User cancelled (Ctrl+C)      | `flowVariant`                                              |

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

### VCS Push Status (`pushedToVcs` in `complete` events)

- `PushedToVcs` / `FailedToPushToVcs` / `OptedOutOfPushingToVcs` / `SkippedGit`

**Note**: `FailedToPushToVcs` is `type: "complete"`, not `type: "error"`.

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
db.commandStats.find({ meta: { $regex: "22.5.4" }, meta: { $regex: "\"type\":\"error\"" } })'
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

## Reference Files (nx repo)

- `packages/create-nx-workspace/bin/create-nx-workspace.ts` — entry, `recordStat()` calls
- `packages/create-nx-workspace/src/create-workspace.ts` — creation orchestrator
- `packages/create-nx-workspace/src/create-empty-workspace.ts` — `WORKSPACE_CREATION_FAILED`
- `packages/create-nx-workspace/src/utils/child-process-utils.ts` — `execAndWait()` error handling
- `packages/create-nx-workspace/src/utils/nx/ab-testing.ts` — `recordStat()`, flow variants
- `packages/create-nx-workspace/src/utils/error-utils.ts` — `CnwError` class, error codes
- `packages/create-nx-workspace/src/utils/git/git.ts` — VCS push logic

