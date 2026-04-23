# NXC-4262: Instrument `nx init` errors for root-cause discovery

**Linear:** https://linear.app/nxdev/issue/NXC-4262/common-init-issues
**Branch:** `NXC-4262`
**Plan:** `.ai/2026-04-20/tasks/init-error-investigation.md`

## Scope

Telemetry-only. The investigation showed `nx init` has a 26.2% error rate
but ~24% of that is concentrated in opaque buckets (`UNKNOWN` / empty
errorMessage / bare `Command failed: <cmd>`). We can't prioritize the real
fixes without first knowing what the errors actually are. This PR adds the
instrumentation; targeted behavioral fixes come in follow-ups driven by
what the enriched telemetry reveals.

Explicitly **not** in this PR: any `try/catch` that swallows a failure, any
fallback path that changes whether init succeeds, any UX change to the
terminal output during normal operation.

## Changes

### 1. Capture child-process stderr on failure (`implementation/utils.ts`)

New helper `runCapturingStderr` that runs a shell command with
`stdio: ['ignore', 'inherit', 'pipe']` and, on non-zero exit, throws an
`Error` with:
- `stderr` (full captured)
- `stdout`
- `exitCode`
- `code` — structured token extracted from stderr matching
  `/\b(E[A-Z0-9_]{2,}|ERR_[A-Z0-9_]+)\b/` (E404, ERESOLVE, EACCES,
  EINTEGRITY, ERR_PNPM_*, …)

The message embeds the stderr tail so `error.message` carries the real
failure cause instead of bare `Command failed: <cmd>`.

Applied at:
- `runInstall` (all preset paths: monorepo/npm/turborepo/nest/angular)
- `legacy-angular-versions.ts` → install + `ng g <pkg>:ng-add` migration
- `configure-plugins.ts` → dot-nx `runNxSync('--version')` wrapper invocation

### 2. Telemetry payload enrichment (`command-object.ts`)

On error events, emit the same environment context we already emit on
`start`/`complete`, plus the structured error code:

```diff
  meta: {
    type: 'error',
    errorCode,
+   errorName,          // e.g. "E404", "ERESOLVE", "ENOENT", "Error"
    errorMessage,       // now always non-empty; includes stderr tail
    aiAgent,
+   isCI,
+   nodeVersion,
+   os,
+   packageManager,
  }
```

### 3. Robust `errorMessage` extraction (`command-object.ts`)

Replaces `error instanceof Error ? error.message : String(error)` with a
`toErrorString()` helper. The old logic produced `""` when a bare
`new Error()` was thrown (one of the reported telemetry buckets had 217
events with empty `errorMessage`). New fallback order:

1. `error.message` if truthy
2. `error.name` if set and not the default `"Error"`
3. JSON of own properties (excluding `stack` — PII + bulk)
4. Literal `"Error"` for a bare `new Error()`
5. `String(error)` / `"[object Object]"` / `"Unknown error"` for
   primitives, plain objects, and null/undefined respectively

### 4. Tests

- `utils.spec.ts` — `runCapturingStderr` success + failure + E-code
  extraction (4 parametrized cases: E404, ERESOLVE, EINTEGRITY,
  ERR_PNPM_PEER_DEP_ISSUES)
- `command-object.spec.ts` (new) — `toErrorString` across error.message
  present/empty, custom names, primitives, null/undefined, plain objects,
  and unserializable (circular) objects

## Verified payload shape

Captured from a real `npm install` failure via module-load intercept:

```json
{
  "type": "error",
  "errorCode": "PACKAGE_INSTALL_ERROR",
  "errorName": "E404",
  "errorMessage": "Failed to install dependencies (exit code 1): npm install\nnpm error code E404\nnpm error 404 Not Found ...",
  "aiAgent": false,
  "isCI": false,
  "nodeVersion": "24.11.0",
  "os": "darwin",
  "packageManager": "npm",
  "nxVersion": "22.7.0"
}
```

## Verification

- `pnpm nx run-many -t build,lint -p nx` — green
- `pnpm nx test nx -- --testPathPatterns='command-line/init'` — 37/37

## Expected telemetry impact

One week post-release, re-run `cnw-stats-analyzer`:
- `errorName` distribution across the ~287 monthly `PACKAGE_INSTALL_ERROR`
  events will tell us the real failure mix (ERESOLVE vs EACCES vs
  EINTEGRITY vs 401 vs 404 vs ENOTFOUND vs …).
- The 217-event "empty errorMessage" bucket should disappear entirely.
- `os` / `nodeVersion` / `packageManager` slices will show whether any
  failure mode is concentrated on a specific platform.

That distribution is the input to the follow-up PRs that actually *fix*
things (Fix 2–5 from the investigation plan, whichever turn out to be
material once we have real data).

## Not in this PR (deferred)

Originally scoped on this branch but removed:
- Fix 2: make `./nx --version` warm-up non-fatal
- Fix 3: Angular version detection warn-and-fallthrough
- Fix 4: Windows system-directory guard
- Fix 5: Friendly invalid-`package.json` message

Each should be revisited once telemetry confirms the bucket is real and
quantifies the impact.
