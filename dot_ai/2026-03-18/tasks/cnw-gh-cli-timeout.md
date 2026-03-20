# CNW: Add timeout to isGhCliAvailable + move after precreate

## Problem

`isGhCliAvailable()` in `packages/create-nx-workspace/src/utils/git/git.ts:50` uses `execSync('gh --version', { stdio: 'ignore' })` with **no timeout**. If `gh` hangs (credential helper, broken state), the entire CNW process blocks indefinitely before the `precreate` telemetry event fires.

This contributes to the start→precreate drop-off gap (25% silent drops for non-AI on 22.6.0).

## Fix

1. **Add timeout** to `execSync`: `execSync('gh --version', { stdio: 'ignore', timeout: 3000 })`
2. **Move the check after precreate** — we only need `ghAvailable` for the VCS push step, not for prompting. Moving it after precreate means the telemetry gap closes and the check runs while workspace creation is happening.

## Context

- Found during CNW telemetry analysis on 2026-03-18
- 22.6.0 data: 615 non-AI starts, 444 reach precreate (72.2%), 151 silent drops
- Non-AI users are 77% preset flow, 23% template flow
- The `gh` check only runs in the template flow, so it explains some but not all drops
- Preset flow drops are more likely prompt fatigue (longer prompt chain)

## Files

- `packages/create-nx-workspace/src/utils/git/git.ts:50` — `isGhCliAvailable()`
- `packages/create-nx-workspace/bin/create-nx-workspace.ts:645` — where it's called in the flow
