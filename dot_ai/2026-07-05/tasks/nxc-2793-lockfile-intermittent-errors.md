# NXC-2793: Lockfile throws errors intermittently

Date: 2026-07-05
Branch: NXC-2793 (worktree /Users/jack/projects/nx-worktrees/NXC-2793)
Linear: https://linear.app/nxdev/issue/NXC-2793/lockfile-throws-errors-intermittently

## Problem

Intermittent graph computation failure:

```
Failed to process project graph.
The "nx/js/dependencies-and-lockfile" plugin threw an error while creating dependencies: Source project does not exist: npm:autoprefixer
```

- Happens after installs/generators modify package.json + lockfile while daemon running
- `nx reset` fixes it (daemon/cached state implicated)
- Reported repeatedly by Juri since 2025-06; never reproduced deterministically
- Leo hypothesis: graph cache hydration reusing stale state
- Goal: eliminate this class of error entirely ("100% never want to see this error again")

## Plan

1. Landscape scan (subagent): nrwl/nx issues/PRs 2025-2026, existing fixes, repro recipes
2. Code trace (subagent): where thrown, lockfile parse caching, daemon incremental recomputation, races between createNodes externalNodes and createDependencies
3. Build deterministic repro in small repo (./tmp/claude/repro-nxc-2793)
4. Fix root cause + hardening (graceful handling instead of hard failure)

## Findings

### Landscape (2026-07)

- Two failure classes share the error text:
  1. Deterministic parser bugs (npm alias, yarn berry, pnpm v9/v11) - fixed piecemeal (#29529, #34064, #35271)
  2. Intermittent cache/race class (this ticket) - root-caused by community in #27213 (2024, multi-process race on workspace-data lockfile cache), NEVER fixed; #30416 still open, reports through 2026-03 on 22.5.4
- Mitigations landed: #22526 (no cache write on error), #33448 (keyMap serialized with nodes; fixed 22.0.2-only regression from cache split #33256), #34503 (cache write failures warn-and-continue)
- Remaining gaps on master: non-atomic `safeWriteFileCache` (plain writeFileSync), unguarded JSON.parse in readCachedExternalNodes/readCachedDependencies, separate nodes/deps hash files with no cross-consistency check
- Key files: `packages/nx/src/plugins/js/index.ts` (cache read path), `packages/nx/src/utils/plugin-cache-utils.ts`

### Deterministic repro (tmp/claude/repro-2793, nx 23.0.1, npm)

1. State A: npm i autoprefixer -> nx run (caches written)
2. State B: npm rm autoprefixer -> nx run (caches written)
3. Copy state-A `parsed-lock-file.dependencies.json` over current, keep state-B hash files
4. `nx show projects` -> exact error "Source project does not exist: npm:autoprefixer", persists until nx reset

Cache files: `.nx/workspace-data/{parsed-lock-file.nodes.json, parsed-lock-file.dependencies.json, lockfile-nodes.hash, lockfile-dependencies.hash}`

### Code trace (verified against master)

- Throw site: `project-graph-builder.ts:527` validateCommonDependencyRules; reached from `builder.addDependency` (validates EVERY returned dep, incl cached) and from parsers' own validateDependency. Wrapped as ProcessDependenciesError (`build-project-graph.ts:371`).
- js plugin (`packages/nx/src/plugins/js/index.ts`): nodes cache (`parsed-lock-file.nodes.json` + `lockfile-nodes.hash`) and deps cache (`parsed-lock-file.dependencies.json` + `lockfile-dependencies.hash`) are 4 independent files, hash-keyed to lockfile content, NO cross-consistency check. createNodes reads lockfile (read 1), createDependencies reads again (read 2) - different points in time.
- Writes: `safeWriteFileCache` = plain writeFileSync (non-atomic); json + hash written as 2 separate writes with `existsSync` between. Kill/crash between writes, or 2 concurrent writers interleaving, leaves json from state A + hash from state B.
- Reads: `readCachedExternalNodes`/`readCachedDependencies` = unguarded JSON.parse (torn read -> "Unexpected end of JSON input", exact #27213 symptom).
- Concurrent writers are the NORM: daemon's isolated plugin worker + every NX_DAEMON=false invocation + parallel CI processes + agent (Claude Code) parallel nx commands all write the same 4 files.
- Daemon ALSO has stale-externalNodes freeze (`project-graph-incremental-recomputation.ts:381-396,508-510`): knownExternalNodes only refreshed when project-CONFIG hash changes; lockfile-only change discards fresh externalNodes. Mitigated (mostly) by 20ms lockfile-hash poll in server.ts:696-726 that RESTARTS daemon on lockfile change (LOCK_FILES_CHANGED) - so this window is transient, not persistent. resetInternalState does NOT clear knownExternalNodes/storedWorkspaceConfigHash.
- Persistence: poisoned deps cache has hash file matching CURRENT lockfile -> reused by every process incl restarted daemon -> permanent until nx reset wipes workspace-data.

### Verified experiments (tmp/claude/repro-2793, nx 23.0.1, npm)

- Crafted mixed state (deps.json from state A + hash/nodes from state B): exact error "Source project does not exist: npm:autoprefixer", 100% reproducible, persists until nx reset. CONFIRMED.
- Lockfile-only change with live daemon: no error - daemon self-restarts via 20ms LOCK_FILES_CHANGED poll (daemon.log confirms recompute). Stale-knownExternalNodes window is transient.
- Naive install/uninstall stress (10 iters, daemon on): no failures - package.json change bumps configHash, refreshes externalNodes.

### Fix plan (proposed)

1. Atomic self-describing caches: embed lockFileHash INSIDE each cache json, drop separate .hash files, tmp+rename writes, try/catch reads -> reprocess on anomaly
2. Cross-consistency: only reuse deps cache when its hash === hash of nodes currently in memory (cachedNodesHash)
3. Self-heal: pre-validate cached deps against ctx.externalNodes; any miss -> discard cache, reparse from lockfile
4. Daemon: refresh knownExternalNodes on every commit; clear in resetInternalState

## Implementation (2026-07-05)

Commits on branch NXC-2793:
- `dc5108f85c` fix(core): make lockfile graph caches atomic, consistent, and self-healing (layers 1-3)
  - hash embedded in cache json, single atomic write (tmp+rename in safeWriteFileCache + PluginCache.writeToDisk), .hash files removed
  - guarded reads -> reprocess on anomaly
  - deps cache reused only when hash === cachedNodesLockFileHash (in-memory nodes)
  - cached deps referencing missing nodes -> reparse + rewrite cache (self-heal)
  - TOCTOU (lockfile changed between createNodes/createDependencies) -> filter invalid edges, no cache write; any parse error -> warn + explicit deps only
  - specs: packages/nx/src/plugins/js/index.spec.ts (4 tests; poison + corrupt tests fail pre-fix), e2e in misc.test.ts
- `91e2e589d5` fix(core): refresh daemon external nodes on lockfile-only changes (layer 4)
  - knownExternalNodes refreshed every commit (not only on config-hash change); cleared in resetInternalState
  - spec: mock in-process lockfile plugin, lockfile-only change; fails pre-fix with DaemonProjectGraphError

Live verification (repro workspace, built files patched into node_modules/nx/dist):
- Stale-state deps cache (original 100% repro): succeeds
- Valid-hash ghost deps cache: succeeds + cache rewritten (ghost purged)
- Truncated caches: succeeds

Known env quirk: pre-existing daemon spec test "in-flight project add" fails locally on macOS (bare jest, watcher latency) - fails on clean master too, not related.

## Status

- [x] Linear issue + comments reviewed
- [x] Landscape scan
- [x] Code trace (verified)
- [x] Repro (deterministic via crafted mixed cache = the persistent on-disk poison state; natural triggers near-proven: kill/interleave between non-atomic cache writes)
- [x] Fix implemented (all 4 layers, 2 commits)
- [x] Validation: nx run-many test/build-base/lint -p nx green; affected-suite failures verified pre-existing on clean master (local env artifacts: generator snapshot specs + NX_BASE leak under nx affected); e2e-local blocked by NXC-3510 session's verdaccio on :4873 (CI covers)
- [x] Pushed + draft PR https://github.com/nrwl/nx/pull/36229
