# NXC-4571: CNW + nx init error fixes (last 7 days telemetry)

Branch: `NXC-4571` | Linear: NXC-4571 | Source data: `~/Downloads/{cnw,init}-errors.json`

## Investigation (done, workflow-verified)

CNW = 1270 errors / 11 codes; nx init = 524 / 2 codes. Telemetry plumbing:

- CNW: `bin/create-nx-workspace.ts:463` -> `errorCode = error instanceof CnwError ? error.code : 'UNKNOWN'`. Plain `Error` -> UNKNOWN.
- init: `init-v2.ts:108` -> `determineErrorCode(error)` (keyword match, else UNKNOWN).

## Scope (Jack picked: options 1 + 4)

Implement these; defer observability (WCF noise-strip, PRESET_FAILED exit code, init pnpm stdout) and TEMPLATE_CLONE_FAILED.

1. CNW telemetry codes - `MISSING_PRESET`, `INVALID_TEMPLATE` (+ wire 3rd-party preset -> existing `INVALID_PRESET`). ~51 of 115 UNKNOWN.
2. init Angular categorization - "Could not determine the existing Angular version" -> `UNSUPPORTED_PROJECT` (~11).
3. init dot-nx Windows bug - `execSync('./nx --version')` fails on cmd.exe; use `.\nx.bat` on win32 (~45 of 290). + `nx --version` -> `DOT_NX_SETUP_ERROR`.
4. pnpm NO_TTY - set `CI` in execAndWait child env (~13% of WORKSPACE_CREATION_FAILED/442).
5. DIRECTORY_EXISTS AI - emit collision-checked `suggestedName` in AI mode (485, 204 AI).

## Files

CNW: `utils/error-utils.ts`, `create-workspace.ts`, `utils/preset/get-third-party-preset.ts`, `utils/ai/ai-output.ts`, `utils/child-process-utils.ts`, `bin/create-nx-workspace.ts` (+ specs).
init: `command-line/init/utils/ai-output.ts`, `implementation/dot-nx/add-nx-scripts.ts` (+ specs, new init ai-output.spec.ts).

## Out of scope (documented in ticket)

Windows `spawnSync cmd.exe ENOENT` (~19% WCF, broken PATH), 36% pnpm-generic "Command failed" (nx swallows stderr - needs nx-core change), EACCES/ENOSPC/registry-lag, bad `--template` typos.

## Status: implemented, awaiting review (not committed)

Validation: create-nx-workspace build+lint+test (121) green; nx lint green; touched init specs (12) green. Full `nx test nx` blocked by Rust `test-native` in sandbox (init code type-trivial). 12 files changed (+226/-10).
