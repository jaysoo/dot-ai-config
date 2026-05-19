---
name: cnw-stats-analyzer
description: >
  Query and analyze create-nx-workspace (CNW) telemetry data from MongoDB.
  Supports prod and staging environments. Use for error analysis, funnel
  metrics, version comparisons, and usage trends. Triggers on "CNW stats",
  "workspace stats", "error rates", "telemetry", "commandStats", "CNW errors",
  "CNW analysis". Also triggers on "show CNW UI", "CNW dashboard", "CNW
  report", "show me visually" — generates a self-contained HTML dashboard
  from the bundled template.
---

# CNW Stats Analyzer

Analyze create-nx-workspace telemetry from the `commandStats` MongoDB collection.

## When user asks for "UI", "dashboard", "chart", "report", "show me visually"

Generate a self-contained HTML dashboard at `/tmp/cnw-dashboard.html` and open it. The template lives at `~/.claude/skills/cnw-stats-analyzer/dashboard-template.html` (and is also at `~/projects/dot-ai-config/dot_claude/skills/cnw-stats-analyzer/dashboard-template.html`).

**Workflow:**
1. **Read the template** with the Read tool to inspect the data arrays you need to update
2. **Run the standard queries** to get the latest monthly numbers (see "Standard dashboard queries" below)
3. **Update the data arrays** in a copy of the template — the template uses these arrays:
   - `months` (e.g. ["2025-04", ..., "2026-04"]) — extend whenever a new month begins
   - `days` — calendar days per month, partial for current month (so per-day rates stay correct)
   - CNW volume: `cnwHumanOnly`, `cnwHumanAI`, `cnwAll`, `cnwAI`, `cnwHumanOnly`, plus stack components `cnwCI`, `cnwContentful`
   - Init volume: `initHumanOnly` (just `initHuman`), `initAI`, `initAll`
   - Cloud opt-in: `cnwCloudHumanOnly`, `cnwCloudHumanAI`, `cnwCloudAll`; `initCloudHumanOnly`, `initCloudHumanAI`, `initCloudAll`
   - Error rates: `cnwErrHumanAI`, `cnwErrAll`, `initErrHuman`, `initErrAll` (creation-only — see Error Classification section)
   - Apr 2026 error breakdowns + WCF root causes (`marErrCnw`, `aprErrCnw`, `marErrInputCnw`, `aprErrInputCnw`, `wcfMar`, `wcfApr`) — replace with the most recent two months
4. **Save** the populated HTML to `/tmp/cnw-dashboard.html`
5. **Open** with `open /tmp/cnw-dashboard.html`

**The template includes:**
- 5 summary cards: CNW comp/day, Init inv/day, CNW Cloud opt-in %, Init Cloud opt-in %, Claimed/Comp %. Each shows All as headline + Human+AI and Human-only sub-lines.
- Milestone legend with color-coded vertical lines on every chart
- 8 chart cards (line + bar): CNW volume, Init volume, CNW cloud opt-in, Init cloud opt-in, Population stack, CNW error rate, Init error rate, plus two grid-spanning panels for top errors and WCF root causes

**Targets:** CNW 2,000/day, Init 300/day, Cloud 15%, Claimed/Comp 5%. Update `targets = { cnw, init, cloud, claimed }` in the template if the goals change.

**Don't reinvent the layout.** Always start from the template — it has the correct structure (Chart.js + chartjs-plugin-annotation CDN, dark-mode CSS, responsive grid). Just substitute data and milestone dates.

## Standard dashboard queries

Run these in order — the dashboard needs all of them. Save outputs to `/tmp/cnw-batchN-out.txt` files for cross-reference.

1. Per-month volume by population (CNW + init): see "AI vs Human vs Combined breakdown" later in this skill — the unified opt-in calculation also lives there.
2. Cloud opt-in: use the unified definition (CSV era → `useCloud` doc field; JSON era → `nxCloudArg` not in skip/never). NEVER parse the CSV-meta string to derive opt-in — see "CRITICAL — CSV completion meta is `[setupCIPrompt, setupCloudPrompt, nxCloudArg, vcsStatus]`" warning below.
3. Error rates: creation errors only (exclude `INVALID_*`, `DIRECTORY_EXISTS`) — see "Error Classification" section.
4. Top error codes Mar/Apr (or current month + previous): split creation vs input validation.
5. WORKSPACE_CREATION_FAILED categorization for Mar/Apr — strip npm noise lines first.

## Goals (Target: End of April 2026)

When the user asks about goals, targets, or whether metrics are on track, compare current data against these targets. The "current" baselines below were set in early March 2026.

| Metric | Baseline (when set) | Nov 2025 Baseline | Target | How to Measure |
|--------|---------------------|-------------------|--------|----------------|
| **CNW completions/day** | 1,368 | 1,018 (verified 2026-04-21) | **2,000** | All `complete` events, no filters (includes CI, AI, contentful) — apples-to-apples with baseline. Use `$or: [{meta: {$regex: "\"type\":\"complete\""}}, {meta: {$regex: "which-ci-provider"}}]` with NO exclusion filters. Target reduced from 3,000 → 2,000 on 2026-04-20. **Historical context:** Sep 2025 = 1,204/day, Oct = 1,086/day, Nov = 1,018/day. Rate has been ~1,000–1,200/day since at least Sep 2025 — April 2026 (1,098/day) is flat with this range, not a regression. (Previous 1,915 Nov figure in this table was incorrect — never matched raw data.) |
| **Init invocations/day** | 164 | 210 (human, verified 2026-04-21) | **300** | `command: "init"` in commandStats. Pre-22.6.4: each doc is one invocation (no type field). 22.6.4+: emits JSON meta with `type` field (start/complete/error), so count `start` events + legacy CSV docs depending on era. See "Init Command Stats" section. **Historical context:** Sep 2025 = 244/day, Oct = 226/day, Nov = 210/day (all human, pre-22.6.4 CSV-era so 1 doc = 1 invocation). (Previous 247 Nov figure in this table was incorrect.) |
| **Cloud "yes" rate** | ~3.7% (22.6.0) | ~50% (inflated by CI prompt) | **15%** | **Methodology B (chart default):** `nxCloudArg == "yes"` AND `setupCloudPrompt != ""` (prompt-driven only) as % of human completions (excl CI/AI/contentful). Excludes CLI-flag yes (mostly AI agents passing `--nxCloud=yes`) so the rate measures the human-facing prompt's success. Do NOT count CI providers (github, gitlab, etc.) — only explicit "yes". Pre-Dec 2025 (CSV era) is NOT comparable: doc-level `useCloud=true` rolls explicit yes + CI-provider picks into one bucket, so the chart sets pre-Dec to null. Human+AI / All lines use any-source strict yes (prompt OR CLI-flag) since AI agents legitimately use the CLI-flag path. |
| **Claimed/Completed CNW %** | ~1-2.5% | — | **5%** | Cannot be calculated from commandStats alone — requires Nx Cloud activation data. Flag as unmeasurable when reporting. |

**When reporting goal progress:**
1. Show monthly averages (Jan, Feb, Mar) and weekly trend for current month
2. Calculate linear extrapolation to end of April
3. Flag whether each metric is trending up, flat, or down
4. Note that the Nov baseline for cloud "yes" is NOT comparable due to the CI prompt experiment

## Default Output

> 🛑 **CRITICAL — Error rate must exclude input validation errors.**
> Any time you report a CNW or init "error rate", it MUST be `creation_errors / starts`, NOT `all_errors / starts`. Input validation codes (`INVALID_*`, `DIRECTORY_EXISTS`) represent invalid user input, not failures — including them inflates the rate by 2–3x and produces misleading regression signals (e.g. AI agent retry storms look like product bugs). See **Error Classification** section below for the full code list. This applies to summary cards, charts, headlines, monthly comparisons — every error-rate number you produce.

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
| `INVALID_BUNDLER` | User specified unrecognized bundler (newly observed Apr 2026) |

**Naming convention shortcut:** any error code prefixed with `INVALID_` is input validation, plus `DIRECTORY_EXISTS`. If you see a new `INVALID_*` code, treat it as input validation by default unless you have evidence it fires after precreate.

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
| `ERESOLVE` | ERESOLVE dependency conflict (drill into details — see note below) |
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

**IMPORTANT — ERESOLVE drill-down (discovered 2026-03-31):** When ERESOLVE errors appear in non-trivial volume (>5/day), don't just count them — extract the specific conflicting packages from the full error message. The `errorMessage` field contains the npm ERESOLVE output with "While resolving: X / Found: Y / peer Z required by W" details. Use a query that extracts the package name after "While resolving:" to group ERESOLVE by root cause. This is critical because a single upstream release (e.g. vite 8.0.3) can cause a wave of ERESOLVE errors across multiple presets, and the generic "ERESOLVE dependency conflict" category hides the common root cause.

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

### Headline "completions/day" metric — NO exclusions

**The 2,000 completions/day target is measured against ALL completions**, including CI, AI agents, and @contentful/nx. The Nov 2025 / Mar 2026 baselines (1,368 / 1,915) were computed this way, so apples-to-apples comparison requires keeping those populations in. When reporting the headline completions number, do NOT apply the funnel filters below.

```js
// Headline completions — NO exclusions beyond command + date
const headlineBase = [
  { command: "create-nx-workspace" },
  { createdAt: { $gte: startDate, $lte: endDate } }
];
```

### Funnel + cloud breakdown — split by population

The funnel and cloud opt-in analysis should separate two populations so CI noise doesn't distort conversion rates:

1. **Human + AI** (`isCI: false`, excl. @contentful) — the meaningful funnel. AI agents are kept in alongside humans because they represent real CNW usage; their error profile is noted in the AI breakdown.
2. **CI-only** (`isCI: true`) — reported separately. CI runs often fire `start` but never reach `precreate` (~18% conversion vs ~79% for humans), so mixing them into the funnel hides real conversion issues.

```js
// Human + AI funnel base (exclude only CI and contentful)
const funnelBase = [
  { command: "create-nx-workspace" },
  { createdAt: { $gte: startDate, $lte: endDate } },
  { isCI: false },
  { meta: { $not: { $regex: "contentful" } } }
];

// CI-only base (for separate breakdown)
const ciBase = [
  { command: "create-nx-workspace" },
  { createdAt: { $gte: startDate, $lte: endDate } },
  { isCI: true }
];
```

Within the human+AI funnel, also report an **AI-only sub-breakdown** (`meta: { $regex: "\"aiAgent\":true" }`) so the AI error profile (high `DIRECTORY_EXISTS`, `INVALID_WORKSPACE_NAME` from retries) is visible but doesn't hide the human numbers.

**CRITICAL (discovered Apr 2026):** Always include `{ command: "create-nx-workspace" }` in any base filter. Starting in 22.6.4, `init` and `migrate` commands also emit JSON meta with `nxVersion`, so filtering only on meta fields will pull in non-CNW events. Init events have no `flowVariant` (A/B variant is signaled via `setupCloudPrompt` code instead) and no `precreate` event, but they DO emit `nxCloudArg` from 22.6.4+ — so cloud opt-in for init can be computed the same way as CNW.

### Init Command Stats

When the user asks about `init` stats, funnel, or cloud adoption, use `{ command: "init" }` instead of `{ command: "create-nx-workspace" }`. The init command shares the same `commandStats` collection and JSON meta format (since 22.6.4).

**Key differences from CNW:**
- Init has no `flowVariant` field — the A/B variant is signaled directly via the `setupCloudPrompt` code (e.g. `cloud-ab-remote-cache-speed`, `cloud-ci-providers-speed`, `cloud-ci-providers-ai-self-healing`, `enable-ci`)
- Init has no `precreate` event — the funnel is just start → complete/error/cancel
- Init has no `template` or `preset` fields
- Pre-22.6.4: init only emits a single CSV doc per invocation with top-level `useCloud` boolean. No `nxCloudArg`, no JSON meta.
- 22.6.4+: init emits the full JSON funnel (start/complete/error) and includes `nxCloudArg` with the same value space as CNW (`skip`, `yes`, `never`, `github`, etc.)

**Init base filter:**
```js
const initBase = [
  { command: "init" },
  { createdAt: { $gte: startDate, $lte: endDate } },
  { isCI: false },
  { meta: { $not: { $regex: "\"aiAgent\":true" } } }
];
```

**Init cloud opt-in (unified across eras):** Use the same definition as CNW — opt-in = `nxCloudArg` not in `[skip, never, unknown]`. When the meta contains `nxCloudArg` (22.6.4+ JSON era), prefer it; otherwise fall back to the doc-level `useCloud` boolean (pre-22.6.4 CSV era). Always rename to "Cloud opt-in %", **not** "useCloud %", to keep terminology consistent with CNW. For JSON era, count complete events only (1 per invocation) — start/error events also carry `useCloud:false` and inflate the denominator.

### Date Range Handling

- Convert user-provided dates to UTC, accounting for EST/EDT offset (EDT = UTC-4, EST = UTC-5)
- "Last N days" includes today's partial day
- Always use `America/New_York` timezone in `$dateToString` for grouping by EST date
- When user says "EST", use ET (handles DST automatically with `America/New_York`)

## Connection

### 1. Whitelist your IP in MongoDB Atlas

MongoDB Atlas requires your current IP on the access list. Get the IP and trigger the whitelist workflow manually via the GitHub Actions UI:

```bash
# Get current IP (PROD or STAGING)
curl -4 -sS --fail --max-time 5 https://ifconfig.me
```

Then open `https://github.com/nrwl/cloud-infrastructure/actions/workflows/add-ip-to-atlas-access-list.yaml`, click "Run workflow", and fill in `clusterName=PROD` (or `STAGING`) plus the IP you just printed.

(The `gh` CLI was previously used to dispatch this workflow. It has been banned — see top-level CLAUDE.md. If you want to script it, use `curl -X POST` against the GitHub Actions dispatch API with an explicit token in env.)

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

**CRITICAL — CSV completion meta is `[setupCIPrompt, setupCloudPrompt, nxCloudArg, vcsStatus]`** (verified by reading `recordStat` source in commit `302905ea9e`). The second field is a **prompt VARIANT name**, not a user response:
- `which-ci-provider,enable-caching2,skip,SkippedGit` → user was shown the "enable-caching2" prompt variant and answered SKIP. useCloud=false.
- `which-ci-provider,enable-caching2,yes,SkippedGit` → user was shown that variant and answered YES. useCloud=true.
- `which-ci-provider,github,FailedToPushToVcs` → user picked github CI provider directly (only 3 fields, no second prompt). useCloud=true.
- `which-ci-provider,skip,skip,SkippedGit` → user skipped both prompts. useCloud=false.

Common prompt variant names that appear at index 2: `enable-caching2`, `cloud-v2-remote-cache-visit`, `cloud-v2-fast-ci-visit`, `cloud-v2-green-prs-visit`, `cloud-v2-full-platform-visit`. **Do NOT count these as opt-ins by their name** — check `useCloud` doc field or extract `nxCloudArg` (index 3 in the array, after the variant name).

**🛑 DO NOT count `enable-caching2` (or other variant names) as an opt-in response.** Verified Apr 2025: of 16,200 docs with `enable-caching2`, only 4,179 had useCloud=true (26%) — the other 74% saw the prompt and skipped. Earlier dashboard versions over-counted CSV-era cloud opt-in by ~30pp by misclassifying these.

**Use the doc-level `useCloud` boolean as the source of truth for CSV-era cloud opt-in:**

```js
// ✅ CORRECT - simple, accurate for CSV era
{ $cond: [{ $eq: ["$useCloud", true] }, 1, 0] }

// ❌ WRONG - the value at index after which-ci-provider is often a prompt VARIANT name, not a response
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

For finer-grained CSV analysis (e.g. which prompt variant performed best), extract BOTH the variant name (index after which-ci-provider) AND the response (index after that), and ALSO cross-tab with useCloud to validate.

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
| Tutorials switch to Cloud CTA | **July 10, 2025** | | Tutorials in `nx.dev` (later `astro-docs`) changed primary onboarding from CLI to `cloud.nx.app/create-nx-workspace`. Reverted on 2026-03-20 (see below). |
| CSV `start` events | **Nov 13, 2025** (ramped Nov 17-18) | **22.0.4** (released Nov 17) | Meta is bare `"start"` or version-prefixed `"22.1.1,start"`. Nov 13-16 was ~33 events (likely internal testing). Real adoption started Nov 17 (203/day) ramping to 1,500+/day by Nov 18. |
| Version prefix in CSV | ~Nov 2025 | 22.1.x | e.g. `"22.1.3,which-ci-provider,..."` |
| JSON meta format | **Dec 12, 2025** | **22.2.2** | Replaces CSV with stringified JSON containing `type` field. Dec is mixed ~64% JSON / 36% CSV. Jan 2026+ is fully JSON. |
| `aiAgent` field | Feb 2026 | | 0 AI events in Jan 2026 |
| `INVALID_WORKSPACE_NAME` error code | Mar 18, 2026 | | New categorization, not a regression |
| Leading "What CI provider?" prompt era | Pre-Dec 2025 → Feb 2026 | **≤22.5.2** | The CNW flow asked "What CI provider do you use?" (github, gitlab, azure, etc.) without a separate "Connect to Cloud?" prompt. **Picking any CI provider implicitly opted the user into Nx Cloud** — `setupCloudPrompt` is empty string `""` in these events, `nxCloudArg` is the CI provider name. Inflates the opt-in rate dramatically (76% github in 22.5.1, 67% in 22.5.2). NOT genuine Cloud adoption — users got `nxCloudId` but rarely activated accounts. Earlier skill versions claimed this was a "22.5.4 experiment Mar 4–28"; that was wrong — the leading prompt was the original behavior across all pre-22.5.3 versions. |
| Direct cloud prompt introduced | Late Feb 2026 | **22.5.3** | First version with "Connect to Nx Cloud? yes/skip/never" — the `never` response value appears here for the first time. github responses crash from 67% (22.5.2) to ~1% (22.5.3). This is the prompt redesign that exposed the "honest" cloud opt-in rate. Cloud opt-in (Human+AI) drops from ~50% to ~25%. |
| Tutorials swap Cloud onboarding for CNW | **2026-03-20** | docs (PR #34935) | nx.dev tutorials previously routed users into the Cloud onboarding flow; this change replaced the Cloud CTA with `npx create-nx-workspace` + `nx init` instructions in the CLI. Drives more CLI traffic from tutorial readers — those users now see the regular CLI cloud prompt (which they can skip/never). Partial walk-back on 2026-04-10 (PR #35257) added the Cloud CTA back in the CI tutorial specifically. Useful context when interpreting CNW/init volume changes from late Mar 2026 onward. |
| Init telemetry → JSON | **2026-03-30** | nx (PR #35076) | `nx init` migrated from CSV meta to JSON meta matching CNW format. After this, init events have `nxCloudArg` in meta. **However**, the prompt code wasn't updated yet — events from Mar 30 → Apr 7 emit JSON meta but with no `nxCloudArg` field (shows as "missing" in queries). Use `useCloud` fallback for this window. |
| Init prompt redesign + "Never" option | **2026-04-08** | nx (PR #35155) | Init switched from its own simple prompt (`code: "enable-ci"`, message *"Would you like to enable AI-powered Self-Healing CI and Remote Caching?"*, choices Yes/Skip only) to **CNW variant 1**: *"Enable remote caching to speed up builds with Nx Cloud?"* with **Yes / Skip / Never**. The "Never" choice is brand new — sets `neverConnectToCloud: true` in nx.json. **This is the dominant driver of the Apr 2026 init cloud rate drop** (Mar 28% → Apr 17% yes; +22% never absorbed from former skip-repeatedly users). NOTE: init was NEVER on the CI-provider+remote-cache dual prompt — that was CNW-only. Init had its own one-step prompt the entire time before this PR. |
| 22.6.3 cloud prompt A/B test | **Mar 27, 2026** | **22.6.3** (PR #35039) | A/B tests three cloud prompt copy variants using `flowVariant` (0, 1, 2). All have the same choices: Yes / Skip for now / No, don't ask again. **Variant details below.** Same experiment continues in 22.6.4. Baseline (22.6.0–2 pooled): 9.0% yes, 33.5% never. Results (7 days, ~2,900 CNW completions across 22.6.3+22.6.4): FV 1 (12.1% yes) and FV 2 (10.0% yes) outperform FV 0 (7.6% yes) and dramatically reduce "never" rate. |
| 22.6.4 release | **Apr 1, 2026** | **22.6.4** | Continues the same cloud prompt A/B test from 22.6.3. Introduces new `PACKAGE_INSTALL_ERROR` error code. **IMPORTANT**: 22.6.4 also makes `init` and `migrate` commands emit JSON meta with `nxVersion` to `commandStats` — queries MUST filter on `command: "create-nx-workspace"` to avoid pulling in init/migrate events (which have no flowVariant, no nxCloudArg, no precreate). See base filter note above. |
| 22.6.5 release (NXC-4190 A/B round 2) | **~Apr 7, 2026** | **22.6.5** | Locks in FV 1 copy from round 1 as new baseline (FV 0 = `connect-to-cloud`, "Enable remote caching to speed up builds with Nx Cloud?"). Tests two new variants: FV 1 = `cloud-ab-never-rebuild` and FV 2 = `cloud-ab-ci-providers-speed`. Old codes (`cloud-ab-remote-cache-speed`, `cloud-ab-fast-ci-setup`) no longer appear. **Schema change**: `flowVariant` is now a **quoted string** in meta (`"flowVariant":"1"`) instead of bare integer — regex extraction must allow optional quotes: `/"flowVariant":"?([0-9]+)"?/`. |

#### 22.6.3 Cloud Prompt A/B Variants (concluded)

| Variant | Code | Prompt | Footer |
|---------|------|--------|--------|
| **FV 0** (baseline) | `connect-to-cloud` | "Connect to Nx Cloud?" | "Automatically fix broken PRs, 70% faster CI: https://nx.dev/nx-cloud" |
| **FV 1** (remote cache) | `cloud-ab-remote-cache-speed` | "Enable remote caching to speed up builds with Nx Cloud?" | "Free for small teams. 2-minute setup with GitHub — cache locally and in CI: https://nx.dev/nx-cloud" |
| **FV 2** (fast CI) | `cloud-ab-fast-ci-setup` | "Speed up your CI with Nx Cloud?" | "70% faster CI on GitHub, GitLab, and more. Free tier, 2-minute setup: https://nx.dev/nx-cloud" |

**Final results (~2,900 completions across 22.6.3+22.6.4):**

| | Comp | yes % | skip % | never % |
|--|--:|--:|--:|--:|
| 22.6.0–2 baseline | 5,036 | 9.0% | 55.7% | 33.5% |
| FV 0 | 915 | 7.5% | — | 27.7% |
| FV 1 | 1,040 | **12.2%** | — | 18.8% |
| FV 2 | 974 | **10.0%** | — | 19.5% |

**Key findings:** FV 1 ("remote caching") is the clear winner — 63% relative lift in "yes" over FV 0, nearly halving the "never" rate. FV 0 (generic "Connect to Nx Cloud?") underperforms baseline — the "No, don't ask again" option with `chalk.dim()` styling makes refusal easier. The big win is the "never" collapse: FV 1/2 cut hard refusals nearly in half. **Test concluded — FV 1 locked in as new baseline in NXC-4190.**

#### 22.6.5 Cloud Prompt A/B Variants (shipped ~Apr 7, 2026 — in progress)

FV 1's copy from round 1 became the new baseline. Two new variants test "never rebuild" messaging and CI provider name-dropping:

| Variant | Code | Prompt | Footer |
|---------|------|--------|--------|
| **FV 0** (new baseline) | `connect-to-cloud` | "Enable remote caching to speed up builds with Nx Cloud?" | "Free for small teams. 2-minute setup with GitHub — cache locally and in CI: https://nx.dev/nx-cloud" |
| **FV 1** (never rebuild) | `cloud-ab-never-rebuild` | "Never rebuild the same code twice — enable Nx Cloud?" | "Free for small teams. Remote caching for local dev and CI. 2-minute setup: https://nx.dev/nx-cloud" |
| **FV 2** (CI providers) | `cloud-ab-ci-providers-speed` | "Speed up GitHub Actions, GitLab CI, and more with Nx Cloud?" | "Free remote caching and task distribution. 2-minute setup: https://nx.dev/nx-cloud" |

**Interim results (22.6.5 only, ~3,762 prompt-shown completions through Apr 21):**

| Variant | Prompt-shown comp | yes % | never % |
|---|--:|--:|--:|
| FV 0 (connect-to-cloud, new baseline) | 1,185 | 15.3% | 28.6% |
| FV 1 (cloud-ab-never-rebuild) | 1,291 | 13.6% | 28.5% |
| FV 2 (cloud-ab-ci-providers-speed) | 1,286 | **18.5%** | **21.2%** |

**Interim findings:** FV 2 ("Speed up GitHub Actions, GitLab CI...") leading — +21% relative lift in yes over baseline and lowest "never" rate. FV 1 ("never rebuild") underperforming the new baseline. Not yet conclusive; need more volume.

#### Init Cloud Prompt A/B (NXC-4363) — init-only, in progress

Added in commit `daa4ae6665` on branch NXC-4363 (target Nx version TBD — watch for which release ships this). **Init only**, NOT CNW. CNW remains locked on `cloud-ci-providers-speed` from 22.7.0 (PR #35390).

`packages/nx/src/utils/ab-testing.ts` `setupNxCloud` now has 2 entries. Init uses `Math.floor(Math.random() * length)` per invocation → 50/50 split. Variant identified by `setupCloudPrompt` code in telemetry (init has no `flowVariant` field).

| Code | Prompt | Footer |
|---|---|---|
| `cloud-ci-providers-speed` (control) | "Speed up GitHub Actions, GitLab CI, and more with Nx Cloud?" | "Free for small teams. Remote caching and task distribution. 2-minute setup: https://nx.dev/nx-cloud" |
| `cloud-ci-providers-ai-self-healing` (variant) | (same prompt) | "Free for small teams. AI-powered self-healing and remote caching. 2-minute setup: https://nx.dev/nx-cloud" |

**Hypothesis:** pre-Apr-8 init prompt led with "AI-powered Self-Healing CI and Remote Caching" and got ~28% yes (Yes/Skip only — not directly comparable). Test whether AI framing still resonates under Yes/Skip/Never. Watch never-rate too — current locked-in baseline is 22.4% never (CNW A/B); want to keep it under that.

**Decision criteria:** higher yes-rate wins, tie-break on lower never-rate. Run ~2 weeks for sample sizes comparable to round 1/round 2.

**To analyze:** filter `{ command: "init", "meta.setupCloudPrompt": { $in: ["cloud-ci-providers-speed", "cloud-ci-providers-ai-self-healing"] } }` and split yes/skip/never rates by the code value. **Update this section with the version once known.**

**IMPORTANT — filter to "prompt-shown" only when analyzing variants.** The same `flowVariant` field appears on completions where `setupCloudPrompt` is empty string `""` — those are CLI-arg users (e.g. `--nxCloud yes`) who never saw the prompt. Pool with `setupCloudPrompt != ""` to measure the A/B effect fairly. Empty-prompt rows have 33-41% yes rates because those users pre-selected cloud via CLI.

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
| ERESOLVE with `vite@8` and `@react-router/dev` | Count by preset and Nx version. Check if `@vitejs/plugin-rsc` peer dep conflict is present. | Discovered 2026-03-31: `@react-router/dev@7.13.x` has `peerOptional: @vitejs/plugin-rsc@~0.5.7`, which pulls in `@vitejs/plugin-rsc@0.5.21` — this conflicts with `vite@8.0.3`. Affects `react-monorepo` preset heavily (25+ errors in 5 days). Also affects `angular-template` (esbuild peer dep) and `vue-monorepo` (sass peer dep). Nx pins `viteVersion = '^8.0.0'` in `packages/vite/src/utils/versions.ts`. Fix requires either pinning vite 7 for affected presets or waiting for upstream react-router fix. |
| `Unable to resolve @nx/workspace:preset` with `tsconfig.base.json` | Count by preset, version. New in 22.6.3 (3 occurrences on 3/30, all angular-monorepo/npm). | May be a regression where tsconfig.base.json isn't generated before preset runs. Monitor if volume increases. |

## Common Pitfalls

### Error rate must exclude input validation errors

Counting *all* errors as the error rate is the single easiest way to produce misleading regression signals. AI agents and confused users repeatedly hit `DIRECTORY_EXISTS` and `INVALID_*` codes; these are not failures of the product.

```js
// ❌ Inflates rate 2-3x with input validation noise
const errRate = totalErrors / starts;

// ✅ Filter to creation errors only
const creationCodes = ["WORKSPACE_CREATION_FAILED", "UNKNOWN", "PRESET_FAILED",
                       "SANDBOX_FAILED", "TEMPLATE_CLONE_FAILED", "CI_WORKFLOW_FAILED",
                       "PACKAGE_INSTALL_ERROR"];
const errRate = creationErrors / starts;
```

**Real example (Apr 2026):** Raw error count was 5,777 → looked like a 24% error rate (catastrophic). After excluding 4,054 input validation errors (3,586 of which were `DIRECTORY_EXISTS` from AI agent retries), the true creation-error rate was 1,723/24,041 = **7.2%** — actually *down* from Dec's 10.3%. The "regression" was an artifact of including validation noise.

See **Error Classification: Input Validation vs Creation Errors** section above for the full code list.

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
