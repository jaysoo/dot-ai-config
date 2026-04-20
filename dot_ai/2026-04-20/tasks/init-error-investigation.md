# Init Command: Top Error Investigation

**Created:** 2026-04-20
**Goal:** Reduce `nx init` error rate from 26.2% → ~6–7% by fixing the top error buckets. The bulk of these aren't real failures — they're instrumentation gaps hiding the real errors behind "Command failed: X" with no stderr captured.

## Context

- Data window: **April 1–20, 2026** (22.6.4+ era, since init only started emitting JSON telemetry on 2026-04-01)
- Population: `command: "init"`, `isCI: false`, non-AI-agent
- Starts: **4,061**
- Errors: **1,062 → 26.2% error rate**
- Error codes seen: only `UNKNOWN` (70%) and `PACKAGE_INSTALL_ERROR` (30%)

## Top Error Buckets (~24% of all starts)

Ranked by % of starts:

| # | Bucket | Count | % starts | Fix category |
|---|---|--:|--:|---|
| 1 | `UNKNOWN` : bare `./nx --version` fail, no stderr | 397 | **9.8%** | (a) telemetry + (b) graceful detection |
| 2 | `UNKNOWN` : empty errorMessage | 217 | 5.3% | telemetry |
| 3 | `PACKAGE_INSTALL_ERROR` : bare `npm install` fail, no stderr | 217 | 5.3% | telemetry |
| 4 | `UNKNOWN` : "Could not determine the existing Angular version" | 82 | 2.0% | real bug |
| 5 | `PACKAGE_INSTALL_ERROR` : bare `pnpm install` fail, no stderr | 47 | 1.2% | telemetry |
| 6 | `PACKAGE_INSTALL_ERROR` : bare `yarn` fail, no stderr | 23 | 0.6% | telemetry |
| | **Subtotal** | **983** | **~24%** | |

Long tail below these is <1% of starts each: EPERM on `C:\Windows\nx.json` (12), JSON parse errors on existing package.json (11), various legacy nx@17/19/21/22 init failures.

## Fixes (ranked by expected impact)

### Fix 1 — Capture stderr when child processes fail (biggest win)

**Covers buckets #1, #2, #3, #5, #6 → ~22% of starts.**

Right now when `execAndWait` / equivalent in the init flow throws, the error message is just `Command failed: <cmd>` with no stderr attached. The underlying Node `child_process.exec` failure carries stderr in `error.stderr` but we're not propagating it into the telemetry payload.

**What to do:**
1. Find the exec wrapper used by `init` for child-process calls (grep for usages in `packages/nx/src/command-line/init/`)
2. On failure, include `err.stderr` and `err.stdout` (trimmed) in the error thrown or recorded to telemetry
3. Make sure the same is true for the `PACKAGE_INSTALL_ERROR` path (the one that wraps `npm install` / `pnpm install` / `yarn`)

**Expected outcome:** The error *rate* likely doesn't drop, but every error becomes debuggable instead of a mystery bucket. That unlocks the next wave of fixes.

**Caveat — is this a real crash or a telemetry-only issue?** Before treating as "just telemetry," verify whether the user saw a useful error on their terminal vs. was just shown "Command failed." If the latter, this is a user-facing bug too — they got no actionable output and likely filed no issue because they had nothing to paste.

### Fix 2 — `./nx --version` detection must not be fatal

**Covers bucket #1 → 9.8% of starts on its own.**

Init calls `./nx --version` to detect if an existing Nx install is present. When there's no local `./nx` binary (the overwhelming common case — a fresh `init`), this throws and gets logged as an `UNKNOWN` error. This is a detection probe, not a fatal check.

**What to do:**
1. Find the `./nx --version` call site in `packages/nx/src/command-line/init/`
2. Wrap in a try/catch that treats any failure as "no existing Nx install" and continues
3. Log the failure only at debug level, not as an error event

**Expected outcome:** Error rate drops by ~9.8 percentage points (26.2% → ~16%).

### Fix 3 — "Could not determine the existing Angular version" should warn, not fail

**Covers bucket #4 → 2.0% of starts.**

When init runs on an existing Angular workspace and can't parse the Angular version (missing `@angular/core` in deps, non-standard layout, etc.), it throws instead of falling back.

**What to do:**
1. Locate the Angular detection in `packages/nx/src/command-line/init/implementation/angular/` (or similar)
2. On failure, log a warning and fall back to a sane default version (latest supported, or prompt the user)
3. Only throw if the workspace is *definitely* Angular but unparseable — otherwise continue

**Expected outcome:** Error rate drops another ~2 percentage points.

### Fix 4 (low priority) — Guard against running init from Windows system dirs

**Covers bucket: EPERM on `C:\Windows\nx.json` → 0.3% of starts (12 events).**

Users are running `npx nx init` from an elevated cmd where cwd defaults to `C:\Windows\System32` or `C:\Windows`. The EPERM crash is not informative.

**What to do:**
1. At init start, detect if `process.cwd()` matches a known system dir (`C:\Windows*`, `/System*`, `/`, etc.)
2. Exit early with: "Please run `nx init` from your project directory, not a system directory."

### Fix 5 (low priority) — Friendly error for corrupt package.json

**Covers bucket: JSON parse error on existing package.json → ~0.3% of starts (~17 events total across UNKNOWN and PACKAGE_INSTALL_ERROR).**

Init throws `ValueExpected`/`CommaExpected` from the JSON parser when the user's `package.json` is invalid. The sample cases include empty files and genuinely malformed JSON.

**What to do:**
1. Wrap the `package.json` read/parse
2. On parse failure: "Your `package.json` at `<path>` has invalid JSON: `<parse error>`. Fix it and re-run `nx init`."

## Execution Order

1. **Fix 1 first** (stderr capture) — this is telemetry, it ships independently, and once deployed the next 30 days of telemetry will tell us if there are other real errors hiding inside the currently-mystery buckets.
2. **Fix 2 + Fix 3 together** — both are `UNKNOWN`-bucket graceful-degradation fixes. Ship in the same PR.
3. **Wait one release cycle** and re-run the analysis. If Fix 1 reveals a new common pattern (e.g. ERESOLVE in the `npm install` bucket), plan follow-up based on real data.
4. **Fixes 4 & 5** as cleanup when someone's touching the init flow anyway — not worth a dedicated PR.

## Verification Plan

For each fix:
- Unit test the specific path (e.g. mock a child_process failure and assert that stderr is included in the thrown error)
- After shipping, check telemetry 7 and 14 days post-release to see whether:
  - The target bucket shrinks/disappears
  - New patterns emerge in the stderr we now capture
  - Overall init error rate drops as expected

## Related Data

- Raw query output: (ran via cnw-stats-analyzer skill, 2026-04-20)
- Skill source: `~/projects/dot-ai-config/dot_claude/skills/cnw-stats-analyzer/SKILL.md`
- Query used: `{ command: "init", createdAt: Apr 1–20, isCI: false, aiAgent:!true, type:"error" }`

## Open Questions

- Is the init stderr actually being suppressed at the user's terminal, or just lost on the telemetry trip? (Determines whether Fix 1 is UX-affecting or telemetry-only.)
- Does the `./nx --version` probe have a legitimate purpose where failure should block? If so, Fix 2 needs to preserve that path.
- For the Angular version detection, what *should* the fallback version be? Latest supported, or inferred from `@angular/cli` if present?
