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

## Empirical proof it happens in real workflows (2026-07-09)

Colleague claim: "already fixed, cannot happen in real workflows." Disproved two ways on stock nx 23.0.1. Workspaces: `tmp/claude/natural-repro2` (clean; main vs feature branch differing by autoprefixer).

### Fix-history sweep (subagent, verified against origin/master blobs)

- Every fix 2025-09..2026-07 tuned daemon scheduling/reconnection or serialization error handling. None changed the structure.
- `98e510b47e` (#33256, 2025-10-27, shipped 22.1.0) is what SPLIT the cache into 4 independent files. That commit created the current design; the bug class predates it too, so there are two eras (likely why "we fixed that" keeps feeling true).
- Mitigations that hid it: 20ms LOCK_FILES_CHANGED restart poll (#32489), client reconnect (#33432), don't-cache-graph-errors (#35088). These made the DAEMON variant transient. The DISK variant was never addressed and is persistent.
- All 5 paths still open on master: 4 files + 2nd writeFileSync for hash; non-atomic writes; unguarded JSON.parse reads; no nodes<->deps consistency check; daemon knownExternalNodes only refreshed on config-hash change and never cleared in resetInternalState.

### Demo 1 - deterministic, no kill / no race / no cache editing

`demo1-write-failure.mjs`. Stock `writeDependenciesCache` does `safeWriteFileCache(json)` -> `existsSync(json)` -> `safeWriteFileCache(hash)`. When the json write fails AND its removal also fails, existsSync is still true, so the hash advances while the data stays old.
That errno pair is the DEFAULT on Windows when a second nx process holds the file open (#30416 has Windows reports). Reproduced on macOS with `chflags uchg` (backup/AV/MDM set this).

- Stock: the run under the lock SUCCEEDS (poison planted silently); every subsequent command then fails with `Source project does not exist: npm:autoprefixer`; survives `npm install`; only `nx reset` clears it.
- Patched: cache carries its own embedded hash, is ignored as stale, reparsed, self-heals. All runs pass.

### Demo 3b - purely ordinary operations (`demo3b-classify.mjs`)

10 parallel `nx show projects` + a loop doing `git checkout <branch> -- package.json package-lock.json`. No kills, no locks, no file surgery.

| build | nx runs | `Source project does not exist` |
|---|---|---|
| stock 23.0.1 | 734 | 2 runs (6 error lines) |
| patched (PR #36229) | 702 | 0 |

Mechanism: cross-process interleave of the two writes leaves deps json (feature, superset) paired with deps hash (main) -> cached edges validated against main nodes.

### Demo 2 - SIGKILL variant, quantified (`demo2-kill-window.mjs`)

Measured gap between the two writes = ~49us of a ~730ms run -> P(uniform-random kill lands in it) = 6.8e-5, i.e. ~1 poisoning per ~15k killed nx commands. Rare per developer; a certainty at CI/agent-fleet scale. Aimed SIGKILL loses the race to signal-delivery latency, so this variant is real but not force-reproducible.

### Realistic-workflow tests: COULD NOT REPRODUCE (2026-07-10)

Jack pushed back that a lockfile rewrite every ~100ms is not realistic (installs are seconds apart). Correct. Re-tested with real `npm install`/`npm uninstall` as the mutator:

| demo | setup | result |
|---|---|---|
| demo6-episode | install, THEN 3 nx commands, 120 episodes | 0/120 broken, 0/360 commands failed |
| demo7-overlap | install lands mid-run, staggered starts, 3 nx, daemon off, 80 episodes | 0/80, 0/240 |
| demo8-daemon | DEFAULT config (daemon on), install mid-run, 2 nx, 60 episodes | 0/60, 0/120 |
| demo5-realistic | 3 nx + real installs, 12 min | 19 transient poisoned-cache episodes on disk (5.6% per install) but 0 command failures |

Key insight: the poisoned pairing needs two nx processes writing caches for DIFFERENT lockfile generations concurrently, i.e. the lockfile must change WHILE nx is mid-run, and a reader must hit the bad pair before a later writer fixes it. At rest the last writer always leaves a consistent pair, so it self-heals. Reproduction required 10 concurrent nx processes + a lockfile change every ~100ms (demo3b: ~0.3% of runs, ~0.3% per lockfile change).

Also retracted: my claim that a concurrent reader on Windows makes writeFileSync fail with EPERM. Never verified libuv's share flags. Real EPERM-on-write on Windows comes from AV/indexer/backup handles - real but environmental. Demo 1 therefore proves the code has NO DEFENSE against a failed write (hash advances past its data), not that the condition is common.

### FORENSIC ROOT CAUSE (2026-07-10, demo11-forensics.mjs)

Caught 5 failures live under churn (10 parallel nx + git-checkout lockfile toggle) and snapshotted disk state within ms of each. ALL 5 IDENTICAL:
- deps json: HAS autoprefixer, parses fine, hash 8615.. (feature generation)
- nodes json: NO autoprefixer, parses fine, hash 4911.. (main generation)
- deps hash != nodes hash

So the real mechanism is NOT torn read and NOT hash-vs-body mismatch (my earlier diagrams). It is the #33256 SPLIT-CACHE generation skew: nodes cache and deps cache have independent hash gates. When the lockfile flips between createNodes' read and createDependencies' read, createNodes regenerates nodes->main while createDependencies finds the deps hash already == feature (written by an overlapping process's createDependencies) and reuses those feature edges -> autoprefixer edge validated against main nodes -> "Source project does not exist: npm:autoprefixer".

Necessary conditions: (1) lockfile changes while nx is mid-graph-build, AND (2) a concurrent process has populated the deps cache for the other generation. Single process alone cannot do it (keyMap pins sources to one generation - confirmed demo10, 0/15). Requires concurrency, which is why it's a parallel/CI/agent-fleet bug.

Patched build, same forensic harness, same duration: 806 runs, 0 hits. The single LockfileParseState (hash+nodes+keyMap together) + "deps cache only trusted when its hash == in-memory nodes hash" closes exactly this skew. Stock 5 hits / ~668 runs, patched 0 / 806.

Corrected artifact claim: the load-bearing mechanism is cross-CACHE generation skew, not the write-then-hash pairing race. Fig 1 in the artifact should be updated (or noted as one of several routes to the same skew).

### Where this leaves the frequency claim

- Single developer, one nx command at a time, daemon on: not reproducible. Jason is substantially right about that shape.
- Parallel nx processes sharing one workspace while the lockfile changes: reproducible (#27213's own repro is exactly `nx affected -t lint & nx affected -t test &` on a fresh CI checkout). Agents running several nx commands in one worktree are the same shape.
- Persistent (needs nx reset) variants require a write failure (demo1) or a SIGKILL inside a ~49us window (~1 per 15k killed commands).
- Juri's 2025-06 reports predate the 22.x cache split entirely, so those specific failures likely had different, since-fixed causes. Do NOT cite them as evidence for this PR.

PR value is therefore: removes a real but low-frequency hard-failure class in parallel/CI/agent workflows, removes the persistent variants, converts residual bad state to self-heal, at no measurable cost. It is NOT justified by "developers hit this constantly."

### Honest negatives (do not overclaim)

- Single-process TOCTOU (lockfile changes between createNodes and createDependencies) does NOT produce this error: npm-parser derives edge sources from the cached keyMap, so a mid-run change yields FEWER edges, not invalid ones.
- Both stock AND patched still fail on a torn `package-lock.json` read (`parsePackageLockFile`, "Unexpected end of JSON input") when git/npm rewrites the lockfile non-atomically while nx reads it. Stock 15, patched 21 occurrences. Separate pre-existing defect; this PR does not address it. Possible follow-up.

## Status

- [x] Linear issue + comments reviewed
- [x] Landscape scan
- [x] Code trace (verified)
- [x] Repro (deterministic via crafted mixed cache = the persistent on-disk poison state; natural triggers near-proven: kill/interleave between non-atomic cache writes)
- [x] Fix implemented (all 4 layers, 2 commits)
- [x] Validation: nx run-many test/build-base/lint -p nx green; affected-suite failures verified pre-existing on clean master (local env artifacts: generator snapshot specs + NX_BASE leak under nx affected); e2e-local blocked by NXC-3510 session's verdaccio on :4873 (CI covers)
- [x] Pushed + draft PR https://github.com/nrwl/nx/pull/36229
