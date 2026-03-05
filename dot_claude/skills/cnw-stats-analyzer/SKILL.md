---
name: cnw-stats-analyzer
description: Query and analyze create-nx-workspace (CNW) telemetry data from MongoDB. Supports prod and staging environments. Use for error analysis, funnel metrics, version comparisons, and usage trends. Triggers on "CNW stats", "workspace stats", "error rates", "telemetry", "commandStats", "CNW errors", "CNW analysis".
---

# CNW Stats Analyzer

Analyze create-nx-workspace telemetry from the `commandStats` MongoDB collection.

## Environments

### Production
- **URI**: `mongodb+srv://readOnlyUser:<password>@nrwl-api-prod.dhknt.mongodb.net/nrwl-api`
- **Password**: `gcloud secrets versions access latest --project="nxcloudoperations" --secret="production-mongodb-readonly-user-pass-na"`

### Staging
- **URI**: `mongodb+srv://readOnlyUser:<password>@nrwl.bdi7j.mongodb.net/nrwl-api`
- **Password**: `gcloud secrets versions access latest --project="nxcloudoperations" --secret="staging-mongodb-readonly-user-pass"`

### Connection

```bash
# Get password
PASS=$(gcloud secrets versions access latest --project="nxcloudoperations" --secret="<secret-name>")

# Connect (prod)
mongosh "mongodb+srv://readOnlyUser:${PASS}@nrwl-api-prod.dhknt.mongodb.net/nrwl-api"

# Connect (staging)
mongosh "mongodb+srv://readOnlyUser:${PASS}@nrwl.bdi7j.mongodb.net/nrwl-api"
```

For bulk exports use `mongoexport` (streams, no memory issues) instead of `mongosh` for large datasets.

## Collection: `commandStats`

### Document Schema

```json
{
  "_id": "ObjectId",
  "command": "create-nx-workspace",
  "isCI": true,
  "useCloud": false,
  "meta": "<string — CSV or JSON>",
  "createdAt": "ISODate"
}
```

### Meta Field Formats

The `meta` field has two formats depending on Nx version:

**Legacy CSV format** (pre-22.2.2, before Dec 2025):
- `"enable-ci"`, `"start"`, `"which-ci-provider,github,FailedToPushToVcs"`
- No structured error reporting — errors just result in missing completion events

**JSON format** (22.2.2+, Dec 2025 onward):
- Stringified JSON with `type` field indicating event lifecycle stage
- Includes `nxVersion`, `nodeVersion`, `flowVariant`, `errorCode`, etc.

### Event Lifecycle (`type` field in JSON meta)

| Type | When | Key Fields |
|------|------|------------|
| `start` | Beginning of CLI run | `nxVersion`, `nodeVersion`, `flowVariant`, `aiAgent` |
| `precreate` | After prompts, before creation | `template`, `preset`, `packageManager`, `ghAvailable` |
| `complete` | Workspace created successfully | `pushedToVcs`, `nxCloudArg`, `connectUrl`, `setupCIPrompt` |
| `error` | Workspace creation threw exception | `errorCode`, `errorMessage`, `errorFile` |
| `cancel` | User cancelled (Ctrl+C) | `flowVariant` |

### Error Codes (`errorCode` in error events)

| Code | Description |
|------|-------------|
| `WORKSPACE_CREATION_FAILED` | `npx nx new` failed (often npm stderr noise) |
| `UNKNOWN` | Uncategorized errors (missing PM, git issues) |
| `PRESET_FAILED` | Preset application failed |
| `SANDBOX_FAILED` | Dependency install in temp sandbox failed |
| `TEMPLATE_CLONE_FAILED` | Git clone of template repo failed |
| `CI_WORKFLOW_FAILED` | CI workflow generation failed |
| `DIRECTORY_EXISTS` | Target directory already exists |

### VCS Push Status (in `complete` events)

The `pushedToVcs` field in complete events tracks git push outcomes:
- `PushedToVcs` — successful push
- `FailedToPushToVcs` — push failed (NOT an error — workspace was created)
- `OptedOutOfPushingToVcs` — user declined
- `SkippedGit` — git was skipped

**Important**: `FailedToPushToVcs` is recorded as `type: "complete"`, not `type: "error"`.

## Common Queries

### Filter for valid Node versions (recommended baseline)
Exclude odd-numbered (dev) Node majors and versions before 20.19:
```python
def valid_node(nv):
    parts = nv.split('.')
    major, minor = int(parts[0]), int(parts[1])
    if major % 2 != 0: return False  # odd = dev releases
    if major < 20: return False
    if major == 20 and minor < 19: return False
    return True
```

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

### Export data for local analysis
```bash
# Export to JSON (use mongoexport for large datasets — streams without memory issues)
mongoexport --uri="$URI" --collection=commandStats --type=json \
  --fields=command,isCI,useCloud,meta,createdAt \
  --query='{"createdAt":{"$gte":{"$date":"2026-01-01T00:00:00.000Z"}}}' \
  --out="$HOME/Downloads/commandStats-export.json"
```

### Local Python analysis pattern
For exported JSON (one JSON doc per line):
```python
import json
from collections import Counter, defaultdict

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

### Filter by Nx version
```bash
mongosh "$URI" --quiet --eval '
db.commandStats.find({ meta: { $regex: "22.5.4" }, meta: { $regex: "\"type\":\"error\"" } })'
```

## Key Findings (as of March 2026)

### Overall error rate: ~6.8% of starts (Jan–Mar 2026, Node >=20.19 even)

| Error Code | Count | % of Starts | Top Cause |
|-----------|------:|------------:|-----------|
| WORKSPACE_CREATION_FAILED | 2,426 | 3.15% | npm stderr warnings treated as errors |
| UNKNOWN | 1,160 | 1.51% | Empty messages, git amend bug, missing PMs |
| PRESET_FAILED | 903 | 1.17% | `empty` preset failing (0.81%) |
| TEMPLATE_CLONE_FAILED | 307 | 0.40% | git not installed, network issues |
| CI_WORKFLOW_FAILED | 225 | 0.29% | `ci` property schema validation bug |
| SANDBOX_FAILED | 220 | 0.29% | Silent install failures |
| DIRECTORY_EXISTS | 14 | 0.02% | User error |

### Known actionable issues
1. npm deprecated warnings → false positive WORKSPACE_CREATION_FAILED (0.82%)
2. `empty` preset failing (0.81%) — fixed by Mar 2026
3. `npm must provide string spec` (0.59%) — npm bug
4. Empty UNKNOWN error messages (0.41%) — need better capture
5. `git: You have nothing to amend` (0.25%) — README amend bug, fixed by Mar 2026
6. CI schema `ci='skip,skip'` concatenation bug (0.16%)

### Root cause of false positive errors
`execAndWait()` in `child-process-utils.ts` uses Node `exec()`. Non-zero exit codes trigger error capture, with stderr as the message. npm deprecated warnings in stderr + non-zero exit = false error.

## Reference files (in `nx` repo)
- `packages/create-nx-workspace/bin/create-nx-workspace.ts` — main entry, `recordStat()` calls
- `packages/create-nx-workspace/src/create-workspace.ts` — workspace creation orchestrator
- `packages/create-nx-workspace/src/create-empty-workspace.ts` — throws `WORKSPACE_CREATION_FAILED`
- `packages/create-nx-workspace/src/utils/child-process-utils.ts` — `execAndWait()` error handling
- `packages/create-nx-workspace/src/utils/nx/ab-testing.ts` — `recordStat()`, flow variants
- `packages/create-nx-workspace/src/utils/error-utils.ts` — `CnwError` class, error codes
- `packages/create-nx-workspace/src/utils/git/git.ts` — VCS push logic, `FailedToPushToVcs`

## Analysis output location
Save analysis results to `.ai/yyyy-mm-dd/tasks/cnw-error-analysis.md`.
