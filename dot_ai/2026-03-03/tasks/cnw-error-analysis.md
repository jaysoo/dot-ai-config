# CNW Error Analysis — Jan–Mar 2026

**Date**: 2026-03-03
**Data source**: MongoDB prod `nrwl-api.commandStats`
**Filter**: Jan–Mar 2026, Node >=20.19, even major versions only
**Starts**: 77,069 | **Errors**: 5,255 (6.8%)

## Monthly Overview

| Month | Starts | Errors | Err% | WS_FAILED | UNKNOWN | PRESET | SANDBOX | TMPL_CLONE | CI_WF | DIR_EXISTS |
|-------|-------:|-------:|-----:|----------:|--------:|-------:|--------:|-----------:|------:|-----------:|
| 2026-01 | 36,971 | 2,510 | 6.8% | 1,128 | 412 | 635 | 96 | 150 | 85 | 4 |
| 2026-02 | 36,880 | 2,584 | 7.0% | 1,195 | 714 | 265 | 119 | 146 | 137 | 8 |
| 2026-03 | 3,218 | 161 | 5.0% | 103 | 34 | 3 | 5 | 11 | 3 | 2 |
| **Total** | **77,069** | **5,255** | **6.8%** | **2,426** | **1,160** | **903** | **220** | **307** | **225** | **14** |

## Note on FailedToPushToVcs

`FailedToPushToVcs` is recorded as `type: "complete"`, NOT `type: "error"`. The workspace is created successfully — only the optional git push fails. It is excluded from this error analysis.

For reference, FailedToPushToVcs by month (as % of starts):

| Month | Starts | FailedToPushToVcs | % |
|-------|-------:|------------------:|--:|
| 2025-11 | 18,711 | 5,942 | 31.8% |
| 2025-12 | 36,174 | 5,353 | 14.8% |
| 2026-01 | 45,220 | 5,722 | 12.7% |
| 2026-02 | 43,763 | 8,854 | 20.2% |
| 2026-03 | 3,766 | 123 | 3.3% |

## Error Details

### WORKSPACE_CREATION_FAILED — 2,426 (3.15% of starts)

Root cause: `execAndWait()` in `create-empty-workspace.ts` catches any non-zero exit code from `npx nx new`, and `exec()` populates stderr as the error message. npm deprecated warnings in stderr cause false positive errors.

| Count | % Starts | Cause | Actionable? |
|------:|---------:|-------|:-----------:|
| 451 | 0.59% | `npm must provide string spec` | npm bug |
| 631 | 0.82% | npm deprecated warnings (keygrip, whatwg-encoding, inflight) | **Yes** — false positives |
| 82 | 0.11% | yarn generic exit code 1 | User env |
| 71 | 0.09% | pnpm `Cannot read properties of null` | pnpm bug |
| 40 | 0.05% | npm unknown env config "devdir" | User config |
| 22 | 0.03% | npm ERESOLVE dependency conflicts | Dep issue |

### UNKNOWN — 1,160 (1.51% of starts)

| Count | % Starts | Cause | Actionable? |
|------:|---------:|-------|:-----------:|
| 317 | 0.41% | Empty message (no details captured) | **Yes** — capture details |
| 192 | 0.25% | `fatal: You have nothing to amend` | **Yes** — our bug in README amend logic |
| 316 | 0.41% | Package manager not found (pnpm/yarn/bun) | User env |
| 32 | 0.04% | Invalid template (non-nrwl org) | User error |
| 13 | 0.02% | Windows EPERM spawn | User env |

### PRESET_FAILED — 903 (1.17% of starts)

| Count | % Starts | Cause | Actionable? |
|------:|---------:|-------|:-----------:|
| 625 | 0.81% | `empty` preset failing | **Yes** — first-party preset |
| 27 | 0.04% | `none` preset | **Yes** — first-party |
| 12 | 0.02% | `minimal` preset | **Yes** — first-party |
| 239 | 0.31% | Third-party presets (@analogjs, @contentful, @aws, etc.) | Not ours |

### TEMPLATE_CLONE_FAILED — 307 (0.40% of starts)

| Count | % Starts | Cause | Actionable? |
|------:|---------:|-------|:-----------:|
| 17 | 0.02% | git not installed | User env |
| 17 | 0.02% | Windows EBUSY file lock | User env |
| ~30 | 0.04% | SSL / network errors reaching GitHub | User env |
| 6 | 0.01% | Xcode license not accepted | User env |

### CI_WORKFLOW_FAILED — 225 (0.29% of starts)

| Count | % Starts | Cause | Actionable? |
|------:|---------:|-------|:-----------:|
| 125 | 0.16% | `Property 'ci' does not match schema` — concatenated values like `'skip,skip'` | **Yes** — our bug |
| 18 | 0.02% | Third-party plugin breaks project graph | Not ours |
| 12 | 0.02% | Nx plugin load failures | Investigate |
| 7 | 0.01% | Plugin worker timeout | Investigate |

### DIRECTORY_EXISTS — 14 (0.02% of starts)

Negligible.

## Top Actionable Items

| Priority | Issue | Impact | Fix |
|:--------:|-------|-------:|-----|
| 1 | npm deprecated warnings counted as errors | 0.82% | Filter stderr warnings from error detection in `execAndWait()` |
| 2 | `empty` preset failing | 0.81% | Investigate why the first-party `empty` preset fails |
| 3 | `npm must provide string spec` | 0.59% | Likely npm bug, but could improve error handling |
| 4 | Empty error messages (UNKNOWN) | 0.41% | Capture actual error details |
| 5 | `git: You have nothing to amend` | 0.25% | Fix README amend logic in `amendOrCommitReadme()` |
| 6 | CI schema validation (`ci` = `'skip,skip'`) | 0.16% | Fix how CI arg is passed to ci-workflow generator |

## Technical Notes

### How errors are recorded

`recordStat()` in `ab-testing.ts` posts to `/nx-cloud/stats` with `meta` as stringified JSON:
- `type: "start"` — beginning of CLI run
- `type: "precreate"` — after prompts, before workspace creation
- `type: "complete"` — workspace created (includes `pushedToVcs` field)
- `type: "error"` — workspace creation threw an exception
- `type: "cancel"` — user cancelled (Ctrl+C)

### Why stderr becomes errors

`execAndWait()` in `child-process-utils.ts` uses Node's `exec()`. When exit code is non-zero, it captures stderr as the error message. `create-empty-workspace.ts` wraps this in a `CnwError('WORKSPACE_CREATION_FAILED', ...)`. Some npm versions exit non-zero when encountering deprecated packages.

### Data files

- Full export: `~/Downloads/commandStats.json` (1.86M records, 415MB)
- Sep 2025+: `~/Downloads/commandStats-sep2025-to-now.json` (572K records, 187MB)
- Errors only: `~/Downloads/commandStats-errors-sep2025-to-now.json` (49K records, 53MB)

### MongoDB connection

```
URI: mongodb+srv://readOnlyUser:***@nrwl-api-prod.dhknt.mongodb.net/nrwl-api
Collection: commandStats
Env var: NX_CLOUD_MONGO_SERVER_ENDPOINT
```
