# Revert CNW Prompt Flow to Match v22.1.3 (Preserving Agentic + Template Internals)

**Status:** In Progress
**Date:** 2026-03-02

## Goal

Make the human-visible CNW prompt flow identical to v22.1.3 while preserving:
- NDJSON AI output (agentic experience)
- `--template` flag (works via CLI, just not surfaced in prompts)
- Telemetry, error handling, AI agent detection

## Target Human Flow (v22.1.3)

1. "Where would you like to create your workspace?"
2. "Which stack do you want to use?" (None/React/Vue/Angular/Node)
3. Stack-specific questions (formatter, framework, etc.)
4. "Which CI provider would you like to use?"
   - Footer: "Self-healing CI, remote caching, and task distribution are provided by Nx Cloud: https://nx.dev/nx-cloud"
   - Options: GitHub Actions, Gitlab, Azure DevOps, BitBucket Pipelines, Circle CI, Do it later
   - If "Do it later" → fallback to:
5. "Would you like remote caching to make your build faster?"
   - Footer: "Read more about remote caching at https://nx.dev/ci/features/remote-cache"
   - Hint: "(can be disabled any time)"
   - Options: Yes, No - I would not like remote caching

## Files to Modify

### 1. `packages/create-nx-workspace/src/internal-utils/prompts.ts`

**`determineTemplate()` (lines 102-152):**
- Remove the interactive "Which starter do you want to use?" enquirer prompt
- If `--template` explicitly provided → return it
- If `--preset` explicitly provided → return `'custom'`
- Otherwise → return `'custom'` (no prompt, go straight to preset/stack flow)

### 2. `packages/create-nx-workspace/src/utils/nx/ab-testing.ts`

**`setupNxCloud` message (lines 197-211):**
- Current: `"Try the full Nx platform?"` / `Yes` / `Skip` / footer: "Automatically fix broken PRs, 70% faster CI"
- Restore to v22.1.3:
  - code: `'enable-caching2'`
  - message: `"Would you like remote caching to make your build faster?"`
  - choices: `Yes` / `No - I would not like remote caching`
  - footer: `"Read more about remote caching at https://nx.dev/ci/features/remote-cache"`
  - hint: `"(can be disabled any time)"`

`setupCI` message is already correct (matches v22.1.3).

### 3. `packages/create-nx-workspace/bin/create-nx-workspace.ts`

**Preset flow cloud handling (lines 705-745):**
Replace complex `cliNxCloudArgProvided` branching with v22.1.3 simple flow:

```typescript
const nxCloud = argv.skipGit === true ? 'skip' : await determineNxCloud(argv);
const useGitHub =
  nxCloud === 'skip' || nxCloud === 'never'
    ? undefined
    : nxCloud === 'github' || (await determineIfGitHubWillBeUsed(argv));
const completionMessageKey = nxCloud === 'skip' || nxCloud === 'never'
  ? undefined
  : messages.completionMessageOfSelectedPrompt(
      nxCloud === 'yes' ? 'setupNxCloud' : 'setupCI'
    );
```

Keep template flow branch (lines 622-682) intact for explicit `--template` usage.

### 4. `packages/create-nx-workspace/src/create-workspace.ts`

**CI setup (lines 191-194):**
- Change: `nxCloud === 'yes' ? 'github' : nxCloud` → only call `setupCI` when nxCloud is a specific CI provider
- `if (nxCloud !== 'skip' && nxCloud !== 'never' && nxCloud !== 'yes' && !isTemplate)`

## What NOT to Change

- `utils/ai/ai-output.ts` — keep entirely
- AI agent detection, NDJSON output — keep
- `--template` CLI flag in yargs — keep
- Template flow when `--template` explicitly passed — keep
- `determineNxCloudV2()` function and `setupNxCloudV2` message — keep (used by template flow)
- `shouldShowCloudPrompt()`, banner variant logic — keep
- `skipCloudConnect`, `neverConnectToCloud`, `setNeverConnectToCloud()` — keep
- Telemetry/stat recording — keep
- Error handling (CnwError) — keep
- AI mode preset mapping — keep
- `determineAiAgents()` with auto-detection — keep

## Verification

1. `nx run-many -t build -p create-nx-workspace`
2. `nx run-many -t test -p create-nx-workspace`
3. Manual interactive test — verify prompt flow matches screenshots
4. `--template=nrwl/empty-template` still works
5. `CLAUDE_CODE=1 --template=nrwl/empty-template` still outputs NDJSON
6. `nx affected -t test,build,lint`
