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

## Goals (Target: End of April 2026)

When the user asks about goals, targets, or whether metrics are on track, compare current data against these targets. The "current" baselines below were set in early March 2026.

| Metric | Baseline (when set) | Nov 2025 Baseline | Target | How to Measure |
|--------|---------------------|-------------------|--------|----------------|
| **CNW completions/day** | 1,368 | 1,915 | **3,000** | All `complete` events, no filters (includes CI, AI, contentful). Use `$or: [{meta: {$regex: "\"type\":\"complete\""}}, {meta: {$regex: "which-ci-provider"}}]` with NO exclusion filters. |
| **Init invocations/day** | 164 | 247 | **300** | `command: "init"` in commandStats. No type filter needed — each doc is one invocation. |
| **Cloud "yes" rate** | ~3.7% (22.6.0) | ~50% (inflated by CI prompt) | **15%** | `nxCloudArg: "yes"` as % of human completions (excl CI/AI/contentful). Do NOT count CI providers (github, gitlab, etc.) — only explicit "yes". Nov was inflated by the 22.5.4 CI provider prompt experiment (see Telemetry Feature Timeline). |
| **Claimed/Completed CNW %** | ~1-2.5% | — | **5%** | Cannot be calculated from commandStats alone — requires Nx Cloud activation data. Flag as unmeasurable when reporting. |

**When reporting goal progress:**
1. Show monthly averages (Jan, Feb, Mar) and weekly trend for current month
2. Calculate linear extrapolation to end of April
3. Flag whether each metric is trending up, flat, or down
4. Note that the Nov baseline for cloud "yes" is NOT comparable due to the CI prompt experiment

## Default Output

**Always break down results per day** unless the user explicitly asks for totals only. All dates must be in **EST/EDT** using `timezone: "America/New_York"` in `$dateToString`.

The default report includes these sections (all per-day):

1. **Daily Completion Funnel** — starts, precreate, complete, creation errors, input errors, cancel counts with conversion rates (precreate/starts, complete/starts, **creation error rate = creation errors/starts**)
2. **Daily Cloud Adoption** — `nxCloudArg` from complete events (skip, never, yes, github, gitlab, azure, bitbucket) with cloud opt-in rate (yes + CI providers / completes). **IMPORTANT**: 22.5.4 cloud opt-in (~42%) is artificially inflated by the CI provider prompt experiment — users were tricked into Cloud via "What CI provider do you use?" but never activated accounts. The 22.6.x rate (~9-12%) reflects genuine opt-in. When comparing versions, flag this context.
3. **Daily Error Breakdown** — error codes by day as both counts and **rates (% of that day's starts)**, grouped into input validation vs creation errors
4. **INVALID_WORKSPACE_NAME Detail** — actual workspace names attempted, grouped by name and day, sorted by count
5. **WORKSPACE_CREATION_FAILED Detail** — categorize error messages by pattern (see categorization list below), grouped by pattern and day
6. **Package Manager Distribution** — from precreate events
7. **Preset/Template Distribution** — from precreate events (top 15)
8. **Nx Version Distribution** — from start events
9. **Flow Variant Distribution** — from start events
10. **VCS Push Status** — from complete events

### Error Classification: Input Validation vs Creation Errors

Errors are split into two categories because they represent fundamentally different failure modes:

**Input validation errors** (pre-precreate) — These fire before workspace creation even begins. They represent invalid user input, not bugs or environment issues. **Do NOT include these in the error rate.**

| Error Code | Why it's input validation |
|------------|--------------------------|
| `INVALID_WORKSPACE_NAME` | User typed an invalid name (e.g. `"."`, numeric prefix) |
| `DIRECTORY_EXISTS` | User picked a name that already exists on disk |
| `INVALID_PACKAGE_MANAGER` | User specified unsupported package manager |
| `INVALID_PRESET` | User specified unrecognized preset name |

**Creation errors** (post-precreate) — These fire during actual workspace creation. They represent real failures worth investigating.

| Error Code | Category |
|------------|----------|
| `WORKSPACE_CREATION_FAILED` | npm/pnpm/yarn install or `nx new` failed |
| `UNKNOWN` | Catch-all (see UNKNOWN patterns section) |
| `PRESET_FAILED` | Preset application failed |
| `SANDBOX_FAILED` | Dependency install in temp sandbox failed |
| `TEMPLATE_CLONE_FAILED` | Git clone of template repo failed |
| `CI_WORKFLOW_FAILED` | CI workflow generation failed |

**In the Daily Completion Funnel**, always show:
- `input_err` — count of input validation errors (for context, not in rate)
- `create_err` — count of creation errors
- `err_rate` — **creation errors / starts** (this is the meaningful error rate)

### WORKSPACE_CREATION_FAILED Categorization

**IMPORTANT: Strip npm noise lines before categorizing.** The `errorMessage` field contains the full stderr from `npm install` / `nx new`. npm writes deprecation warnings and notices to stderr alongside real errors. If you categorize the raw message, you'll match `deprecated` or `npm notice` noise instead of the actual failure buried underneath.

**Step 1 — Strip noise lines** from `errorMessage` before pattern matching:

```js
// Strip lines that are npm noise, not real errors.
// KEEP: npm warn EBADENGINE, npm warn peerDependencies, npm error — these are real.
// STRIP: npm warn deprecated, npm warn cleanup, npm notice, "Failed to create a workspace:" prefix.
function stripNpmNoise(msg) {
  var lines = msg.split("\n");
  var filtered = lines.filter(function(l) {
    if (l.match(/^npm warn deprecated\s/)) return false;
    if (l.match(/^npm warn cleanup\s/)) return false;
    if (l.match(/^npm notice\s/)) return false;
    if (l.match(/^Failed to create a workspace:\s/)) return false;
    return true;
  });
  var result = filtered.join("\n").trim();
  return result.length > 0 ? result : msg;
}
```

**Step 2 — Categorize the stripped message** using these patterns:

| Pattern to match in **stripped** errorMessage | Category |
|-----------------------------------------------|----------|
| `ERESOLVE` | ERESOLVE dependency conflict |
| `native-bindings` or `native binding` | Native bindings not found (Termux/Android) |
| `ENOENT` | ENOENT (file/command not found) |
| `ETARGET` | ETARGET (version not found) |
| `EACCES` | EACCES (permission denied) |
| `ETIMEDOUT`, `ECONNRESET`, `EAI_AGAIN`, `ENOTFOUND`, `UNABLE_TO_GET_ISSUER_CERT` | Network/TLS error |
| `startsWith` | pnpm null startsWith bug |
| `CommaExpected` or `parse` | JSON parse error |
| `spawnSync` | spawnSync ENOENT |
| `EPERM` | EPERM (Windows permission) |
| `EISDIR` | EISDIR (symlink/directory conflict) |
| `ERR_PNPM` | pnpm error |
| `Cannot find module` | Cannot find module |
| `ENOMEM` or `heap` | Out of memory |
| `must provide string spec` | npm must provide string spec |
| `does not match the schema` | Schema validation error |
| `EBADENGINE` | EBADENGINE (Node version mismatch) |
| `E404` | E404 (package not found) |
| `E401` | E401 (auth/token error) |
| Stripped message is empty (only noise was present) | npm warnings only (no real error) |
| (none of the above) | Other: (first 120 chars of **stripped** message) |

**Why this matters (discovered Mar 2026):** ~79% of errors previously categorized as "npm deprecation warning (false positive)" actually had real errors (ERESOLVE, ECONNRESET, ETARGET, EPERM, TLS cert errors, etc.) hidden under the warnings. Only ~21% were truly warning-only (npm exited non-zero with only deprecation output — almost all `angular-monorepo` preset).

**Reference `$function` for use in mongosh queries:**

```js
// Full categorization function for use in $function
function categorize(meta) {
  var p = JSON.parse(meta);
  var msg = p.errorMessage || "";
  // Step 1: strip npm noise (keep EBADENGINE, peerDependencies, npm error)
  var lines = msg.split("\n");
  var filtered = lines.filter(function(l) {
    if (l.match(/^npm warn deprecated\s/)) return false;
    if (l.match(/^npm warn cleanup\s/)) return false;
    if (l.match(/^npm notice\s/)) return false;
    if (l.match(/^Failed to create a workspace:\s?/)) return false;
    return true;
  });
  var stripped = filtered.join("\n").trim();
  // Step 2: categorize on stripped (or original if empty)
  var m = stripped.length > 0 ? stripped : msg;
  if (stripped.length === 0) return "npm warnings only (no real error)";
  if (m.indexOf("ERESOLVE") >= 0) return "ERESOLVE dependency conflict";
  if (m.indexOf("native-bindings") >= 0 || m.indexOf("native binding") >= 0) return "Native bindings (Termux/Android)";
  if (m.indexOf("ENOENT") >= 0) return "ENOENT (file/command not found)";
  if (m.indexOf("ETARGET") >= 0) return "ETARGET (version not found)";
  if (m.indexOf("EACCES") >= 0) return "EACCES (permission denied)";
  if (m.indexOf("ETIMEDOUT") >= 0 || m.indexOf("ECONNRESET") >= 0 || m.indexOf("EAI_AGAIN") >= 0 || m.indexOf("ENOTFOUND") >= 0 || m.indexOf("UNABLE_TO_GET_ISSUER_CERT") >= 0) return "Network/TLS error";
  if (m.indexOf("startsWith") >= 0) return "pnpm null startsWith bug";
  if (m.indexOf("CommaExpected") >= 0 || m.indexOf("parse") >= 0) return "JSON parse error";
  if (m.indexOf("spawnSync") >= 0) return "spawnSync ENOENT";
  if (m.indexOf("EPERM") >= 0) return "EPERM (Windows permission)";
  if (m.indexOf("EISDIR") >= 0) return "EISDIR (symlink/directory conflict)";
  if (m.indexOf("ERR_PNPM") >= 0) return "pnpm error";
  if (m.indexOf("Cannot find module") >= 0) return "Cannot find module";
  if (m.indexOf("ENOMEM") >= 0 || m.indexOf("heap") >= 0) return "Out of memory";
  if (m.indexOf("must provide string spec") >= 0) return "npm must provide string spec";
  if (m.indexOf("does not match the schema") >= 0) return "Schema validation error";
  if (m.indexOf("EBADENGINE") >= 0) return "EBADENGINE (Node version mismatch)";
  if (m.indexOf("E404") >= 0) return "E404 (package not found)";
  if (m.indexOf("E401") >= 0) return "E401 (auth/token error)";
  return "Other: " + m.substring(0, 120);
}
```

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

| Feature | First Appeared | Version | Notes |
| ------- | -------------- | ------- | ----- |
| Completion events only | Pre-Nov 2025 | ≤22.0.2 | 1 event per CNW invocation — completions **are** total usage. Meta is CSV: `"which-ci-provider,github,FailedToPushToVcs"` |
| CSV `start` events | **Nov 13, 2025** (ramped Nov 17-18) | **22.0.4** (released Nov 17) | Meta is bare `"start"` or version-prefixed `"22.1.1,start"`. Nov 13-16 was ~33 events (likely internal testing). Real adoption started Nov 17 (203/day) ramping to 1,500+/day by Nov 18. |
| Version prefix in CSV | ~Nov 2025 | 22.1.x | e.g. `"22.1.3,which-ci-provider,..."` |
| JSON meta format | **Dec 12, 2025** | **22.2.2** | Replaces CSV with stringified JSON containing `type` field. Dec is mixed ~64% JSON / 36% CSV. Jan 2026+ is fully JSON. |
| `aiAgent` field | Feb 2026 | | 0 AI events in Jan 2026 |
| `INVALID_WORKSPACE_NAME` error code | Mar 18, 2026 | | New categorization, not a regression |
| 22.5.4 cloud prompt experiment | Mar 4–28, 2026 | **22.5.4** | Changed cloud prompt to ask "What CI provider do you use?" (github, gitlab, azure, etc.) instead of asking about Nx Cloud directly. If user selected a CI provider, they were auto-connected to Cloud. This was an experiment to replicate Nov 2025 prompt behavior that had higher cloud opt-in rates. **Results: inflated `nxCloudArg` opt-in to ~42% (vs ~9-12% in 22.6.x) but did NOT improve actual Cloud onboarding** — users got `nxCloudId` but never enabled their accounts. The high CI provider counts (github: 1,898, gitlab: 400) in 22.5.4 are NOT genuine Cloud adoption. Reverted in 22.6.0 to direct cloud prompt with skip/never/yes options. |

**Telemetry eras:**

| Era | Date Range | What exists | How to count usage |
| --- | ---------- | ----------- | ------------------ |
| **Completions only** | Pre-Oct 2025 and earlier | 1 doc per successful workspace creation. CSV meta. No starts, errors, or cancels. | Total docs = completions = usage |
| **CSV starts + completions** | Nov 17, 2025 – Dec 11, 2025 | `"start"` events added alongside existing CSV completions. No precreate/error/cancel yet. | Starts for invocations (but only from Nov 17+), completions for success count |
| **Mixed CSV + JSON** | Dec 12, 2025 – Dec 31, 2025 | 22.2.2+ emits JSON with full funnel (start/precreate/complete/error/cancel). Older versions still emit CSV. ~64% JSON / 36% CSV. | Use both formats; funnel only reliable for JSON portion |
| **Full JSON funnel** | Jan 2026+ | All events are JSON with `type` field. Full funnel available. | Starts for invocations, full funnel for conversion analysis |

**IMPORTANT for cross-month comparisons**: Before Nov 17, 2025, only completions exist — there are no starts, errors, or cancels. When comparing months across eras, **use completions as the common metric**. Do NOT compare Oct completions to Jan starts — compare Oct completions to Jan completions. Funnel metrics (start→precreate→complete, error rates as % of starts) are only available from Jan 2026+ (fully reliable) or the JSON portion of Dec 2025 (partial).

### Error Codes

See **Error Classification** section above for which codes are input validation vs creation errors.

| Code                        | Classification     | Description                               |
| --------------------------- | ------------------ | ----------------------------------------- |
| `WORKSPACE_CREATION_FAILED` | Creation error     | `npx nx new` failed (often npm stderr — see noise stripping note above) |
| `UNKNOWN`                   | Creation error     | Catch-all from `execAndWait` (see common patterns below) |
| `PRESET_FAILED`             | Creation error     | Preset application failed                 |
| `SANDBOX_FAILED`            | Creation error     | Dependency install in temp sandbox failed |
| `TEMPLATE_CLONE_FAILED`     | Creation error     | Git clone of template repo failed         |
| `CI_WORKFLOW_FAILED`        | Creation error     | CI workflow generation failed             |
| `DIRECTORY_EXISTS`          | Input validation   | Target directory already exists           |
| `INVALID_WORKSPACE_NAME`    | Input validation   | Name doesn't match validation (most common: `"."`) |
| `INVALID_PACKAGE_MANAGER`   | Input validation   | Unsupported or missing package manager    |
| `INVALID_PRESET`            | Input validation   | Preset name not recognized                |

**UNKNOWN error patterns (Mar 2026 data):** ~65% are "Preset is required when not using a template" (users calling CNW without `--preset` or `--template` in non-interactive mode). ~10% are "Invalid template. Only templates from 'nrwl' org supported." The rest are misc (missing pnpm, EACCES, network errors that `execAndWait` categorized as UNKNOWN instead of a specific code). Apply the same noise-stripping approach when analyzing UNKNOWN errorMessages.

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

## Watchlist

When running reports, flag these patterns if they appear in non-trivial volume:

| Pattern | What to look for | Context |
|---------|-----------------|---------|
| `nx/bin/nx` in "Cannot find module" errors | Count by preset, package manager, and Nx version | Fixed for `apps` preset in NXC-4165 (skipped unnecessary `generatePreset`). If it recurs for other presets, the root cause is `installPackagesTask` failing to install `nx` in the new workspace before `generate-preset.ts` tries to resolve it. Likely pnpm-specific. |

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
