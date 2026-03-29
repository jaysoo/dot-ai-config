# NXC-4168: Add JSON Meta Telemetry to `nx init` (Match CNW Format)

**Status**: Implementation complete, pending commit + PR
**Linear**: https://linear.app/nxdev/issue/NXC-4168
**Worktree**: `/Users/jack/projects/nx-worktrees/NXC-4168`
**Branch**: `NXC-4168`

## Problem

`nx init` uses legacy CSV meta format for telemetry (e.g. `"22.6.3,enable-ci"`). No structured data, no AI detection, no error tracking. CNW already sends JSON meta with full funnel events.

## Solution

Switched `recordStat` in `packages/nx/src/utils/ab-testing.ts` from CSV to JSON meta format, matching CNW. Added 4 telemetry events to `nx init`:

### Changed Files

1. **`packages/nx/src/utils/ab-testing.ts`**
   - Added `RecordStatMeta` types: `RecordStatMetaStart`, `RecordStatMetaComplete`, `RecordStatMetaError`, `RecordStatMetaCancel`
   - Changed `recordStat` to accept `meta?: RecordStatMeta` (object) instead of `meta?: string`
   - Serializes meta as JSON: `{"nxVersion":"22.7.0","type":"start",...}`
   - Falls back to just nxVersion string when no meta provided (backward compat for connect command)

2. **`packages/nx/src/command-line/init/command-object.ts`**
   - **start event**: `nodeVersion`, `os`, `aiAgent`, `isCI`
   - **cancel event** (SIGINT): `aiAgent`
   - **error event** (catch): `errorCode`, `errorMessage` (truncated 250 chars), `aiAgent`

3. **`packages/nx/src/command-line/init/init-v2.ts`**
   - **complete event**: `nodeVersion`, `os`, `aiAgent`, `isCI`, `nxCloudArg`, `pluginsInstalled`

4. **`packages/nx/src/command-line/nx-cloud/connect/connect-to-nx-cloud.ts`**
   - Updated 2 existing `recordStat` callers to pass meta as `{ type: 'complete', setupCloudPrompt: '...' }` object

### Validation

- `nx run nx:build-base` — PASS
- `nx run nx:lint` — PASS
- `nx test nx -- --testPathPatterns='init-v2'` — PASS
- `nx affected -t build-base,test,lint` — build/lint all pass; test failures are pre-existing (snapshot/env mismatches in unrelated files)

## Next Steps

- [ ] Commit changes (scope: `feat(misc)`)
- [ ] Push branch
- [ ] Open PR with "Fixes NXC-4168"
- [ ] Run `nx prepush` before pushing
