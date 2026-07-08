# NXC-3510: Node executor may not release ports on shutdown

Linear: https://linear.app/nxdev/issue/NXC-3510/node-executor-may-not-release-ports-on-shutdown
Polygraph session: nxc-3510-16626f3c
Branch: feature/nxc-3510-node-executor-port-release (823383cc0c + e09908c007 + f05ee768ee)
PR: https://github.com/nrwl/nx/pull/36230 (draft)

## Review follow-ups (2026-07-05 PM)

External review + thermo-nuclear subagent found:
1. killProcessTreeGraceful resolved right after SIGKILL dispatch (grace-expiry + direct-SIGKILL
   paths) - rebind race remained (19/20 EADDRINUSE w/ grace=1). Fixed in Rust: bounded 1s
   wait_for_pids_to_exit poll. Harness now 0/20 (graceful + sigkill modes).
2. Existing native spec ENCODED the old weak contract (500ms sleep before isAlive assert) -
   sleep removed, + new port-rebind regression test. 7/7 green.
3. Windows: graceful signal is no-op via sysinfo -> 5s stall per watch restart (old taskkill /F
   instant). node executor passes grace 0 on win32.
4. stop() callers re-implemented half of stop() (killed=true/disconnect/removeAllListeners) -
   deleted. + childProcess?.pid guard + e2e stripVTControlCharacters.
Deferred (noted): zombies count as present in bounded wait; e2e listeners not detached (finally kills).
Local `nx affected -t test` failures (command-line-utils base=SHA etc) reproduce on MASTER -
pre-existing env issue, CI authoritative (commit 1 CI fully green).

## Round 3 (2026-07-06, second review pass)

- REGRESSION FOUND in my own round-2 refresh-first loop: sysinfo refresh(Some) right after
  SIGKILL can FAIL to read the dying process -> drops it from table -> wait resolves while
  port still bound (7/10 harness failures; kill_with returned Some(true), process ALIVE at
  resolve - proven with eprintln instrumentation).
- Measured (probe-timing.mjs, 15/15): after SIGKILL, port frees ~1.1ms, kill(pid,0) fails
  ~2.3ms -> kernel probe strictly conservative. Fix: pid_exists via nix::sys::signal::kill
  (None sig, EPERM=alive) on unix; sysinfo presence on windows. 0/40 harness.
- Zombie filter attempt REVERTED (was not the culprit; kernel probe waits for reap, bounded).
- grace_ms==0 routes to force-kill fast path (no 100ms poll tax on Windows).
- processQueue drains tasks queued during stop-wait (coalescing-debounce piggyback gap).
- Specs: zero-grace fast-path test, isAliveNonZombie assert. warn! on bounded give-up.
- Commits: 6e919efb19 fix(core), 59e5f1e45c fix(js), pushed. Empty nx-cloud bot commit
  ("Self-Healing CI Rerun") landed mid-stream on branch - kept.
- Explainer artifact: https://claude.ai/code/artifact/e646bec0-be20-4319-b386-61064e2e1e14
  (+ PDF at ~/Downloads/nxc-3510-explainer.pdf, 11pp)

## PR split (2026-07-07)

Per Jack: js swap fixes most issues alone; rust change reviewable/revertable separately.
- PR A #36230 (force-pushed rewrite): 3 fix(js) commits on fresh master - killTree->native swap
  + kill-tree.ts delete, win32 grace 0, queue drain, e2e test. No dependency on B.
- PR B #36254 (new, feature/nxc-3510-graceful-kill-exit-wait): 2 fix(core) + cleanup(core) -
  post-SIGKILL exit wait, kernel kill(pid,0) probe, zero-grace fast path, native specs.
- Content parity vs combined branch verified file-by-file (0-line diffs on owned paths).
- Backup of combined history: local branch `nxc-3510-combined-backup`.
- Surgery done in worktree /Users/jack/projects/nx-worktrees/nxc-3510-split (main checkout
  was on another session's branch e2e-optimize).

## Problem

`@nx/js:node` executor: SIGTERM to nx CLI can leave grandchild server (e.g. Nest) orphaned + port bound (EADDRINUSE on restart).

Prior Claude analysis (gist jaysoo/e6fdc131ae253b7d9f1a2e5ffd3f3232, unverified):
- Race in `killTree` (packages/js/src/executors/node/lib/kill-tree.ts): builds process tree via async `pgrep -P` scan; intermediate procs die before scan completes -> grandchildren reparent to PID 1 -> never killed.
- Evidence: SIGTERM to nx -> server survives (PPID -> 1, port bound). SIGTERM directly to Nest -> clean exit.
- Recommended: process groups (fork detached:true, kill(-pid)).

## Plan

1. [x] Pull Linear issue + gist
2. [x] Landscape mapped (Explore agent)
3. [x] Verify repro
4. [x] Design fix
5. [x] Implement (+ e2e regression test, validated both directions)
6. [x] PR via polygraph -> draft #36230; awaiting CI + mark ready

## Landscape findings (2026-07-05)

- nx core migrated to Rust `killProcessTreeGraceful` (#33655 / 2885b784af, 2026-05-14, ships in >=23.0.0):
  snapshot tree via sysinfo, signal leaves->parents, poll, SIGKILL survivors after 5s grace
  (NX_PROCESS_KILL_GRACE_PERIOD). Orchestrator kills full PID trees on SIGINT/SIGTERM/SIGHUP.
- `@nx/js:node` executor still used vendored JS killTree (pgrep/ps scan + per-pid kill):
  - resolves on signal DISPATCH, not process exit
  - async scan races with dying intermediates (orphaned grandchildren on nx <=22)
- run-commands uses native killer since #33655; js:node was the only killTree consumer.

## Repro verification (nest app, slow-SIGTERM handler)

- nx 21.6.9 SIGTERM to CLI: FAIL — server orphaned (PPID->1), port 3000 stuck. Issue's original bug.
- nx 23.0.1 SIGTERM/SIGINT to CLI: PASS — #33655 fixed CLI-level kill.
- nx 23.0.1 watch restart w/ slow shutdown (3s SIGTERM handler): FAIL — EADDRINUSE,
  exact trace from issue's ClickUp screenshot. killTree returns before old process exits;
  new server boots while port still held.
- Fixed executor (killProcessTreeGraceful): watch restart PASS (waits 3s), CLI signals PASS.
- Gotcha: repro workspace nested under nx repo tmp/ gets watch events swallowed
  (outer .gitignore `tmp` -> ancestor ignore rules); moved to ~/tmp/repro-nxc-3510.

## Fix

- node.impl.ts: killTree -> `killProcessTreeGraceful` from 'nx/src/native' (await waits for exit).
- Deleted packages/js/src/executors/node/lib/kill-tree.ts (last consumer).
- e2e: node-server.test.ts "should wait for the previous process to exit on watch restart"
  (http server + 8s SIGTERM delay, rebuild, assert no EADDRINUSE + second Listening).

## E2E negative-control saga (verify test fails w/o fix)

Local e2e kept passing with "unfixed" source due to LAYERED cache poisoning (same version
24.0.0 across builds):
1. nx cache replayed e2e-local task outputs (env vars not in hash) -> use --skipNxCache
2. pnpm store metadata cache served fixed-tarball integrity (purge: `pnpm cache delete '@nx/*'`)
3. long-lived manual verdaccio on 4873 intercepted e2e installs (e2e's own registry silently
   failed to bind: "Failed to start verdaccio"); killed it
4. app-level proof: instrumented server showed 5s-SIGKILL death signature = graceful kill = fix present
Resolution: in-test DEGRADE control - patch installed node.impl.js back to legacy killTree
(bypasses all install caches) -> test FAILED with EADDRINUSE as expected. Removed after validation.
Lesson: for e2e negative controls in this repo, degrade node_modules in-test instead of
fighting install caches; local-registry version is constant so tarballs cache-poison.
