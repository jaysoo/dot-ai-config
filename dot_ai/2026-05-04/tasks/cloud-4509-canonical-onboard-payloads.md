# CLOUD-4509: Canonical onboard payloads

**Worktree:** `/Users/jack/projects/ocean-worktrees/CLOUD-4509`
**Branch:** `CLOUD-4509`
**Linear:** https://linear.app/nxdev/issue/CLOUD-4509
**Pairs with:** NXC-4401 (nx side wrapper that this collapses)
**Out of scope:** NDJSON line shape — already in #11091

## Goal

Make the bin emit canonical payloads so `packages/nx/src/command-line/nx-cloud/connect/agentic-onboard.ts` can collapse to ~5 LOC + a delete.

## Asks (from CLOUD-4509)

1. `actionRequired: { type, ... }` always typed object. Convert error-string special cases:
   - Multi-org no `--org` → `{type: "multi_org_pick", organizations: [{id,name,role}, ...]}`
   - 409 already-exists → `{type: "workspace_already_exists", nxCloudId?}`
   - Stale/invalid PAT → `{type: "login_required"}`
2. Pre-checks moved into bin:
   - Read nx.json. If `nxCloudId` already present → `actionRequired: {type: "already_connected", nxCloudId}`
   - Read PAT. If missing → `actionRequired: {type: "login_required"}`
3. Canonical success payload — single shape:
   - `{success: true, workspace: {nxCloudId, overviewUrl, ...}, configWritten, verifyCommand: "npx nx-cloud onboard status", nextSteps: {description, steps[]}}`
   - Drop top-level `nxCloudId` alias
4. Field naming: `verificationUri` always, drop `url` alias
5. `success: false` with no `actionRequired` → terminal failure with `errorCode` + `error`

## Files (estimate)

- `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/onboarding-connect-workspace.ts` — main
- `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/onboarding-types.ts` — typed actions
- `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/onboarding-utils.ts` — shared helpers
- New tests

## Plan

1. Read bin code thoroughly
2. Define typed actionRequired shapes in onboarding-types.ts
3. Add pre-checks (nx.json + PAT) at top of `connectWorkspaceCommand`
4. Convert error-string emits → typed actionRequired
5. Add verifyCommand + nextSteps to success payload
6. Drop `url` alias inside actionRequired (use verificationUri only)
7. Add errorCode to all `success: false` no-action error paths
8. Tests
9. Verify locally against NXC-4401 wrapper (proves the wrapper can collapse)
10. PR

## Validation

- New unit tests for each typed actionRequired shape
- Manual: build client-bundle, point local nx-cloud to it, run `npx nx-cloud onboard connect-workspace --json` against staging in fresh + already-connected workspaces
