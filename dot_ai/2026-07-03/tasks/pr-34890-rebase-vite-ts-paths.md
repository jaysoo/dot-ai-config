# PR #34890: rebase + get green (vite ts paths custom targets)

**Date:** 2026-07-03
**Session:** Polygraph rebase-pr-34890-and-get-ci-passing-ccb7065a
**Worktree:** ~/projects/nx-worktrees/NXC-4360 (branch pr-fix-vite-plugin)
**PR:** https://github.com/nrwl/nx/pull/34890 (shairez fork, maintainer_can_modify=true)
**Linear review:** https://linear.app/nxdev/review/featvite-add-configurable-ts-paths-buildtest-targets-and-stabilize-db32708d7866

## Goal

Rebase stale (Mar 17) fork PR onto master, fix CI failures, verify change makes sense, merge.

## PR content (6 commits, 3 files)

1. `nx-tsconfig-paths.plugin.ts`: buildTarget/testTarget options; multi-path values loop in loadFileFromPaths; serve-coordination block moved inside tmp-tsconfig-creation branch (vitest browser double-build fix)
2. `nx-vite-build-coordination.plugin.ts`: exit code!==0 -> reject; undefined watcher data guard
3. `e2e/vite/src/vite.test.ts`: new test with test-ci/build-ci custom targets

## Findings so far

- Rebase onto 1082577c0e clean, no conflicts. Deprecation warning (#35664) + windowsHide:true (#34894) preserved.
- CI failure root cause: `test-ci` collides with @nx/vitest plugin ciTargetName atomizer (vitest init.ts:110) -> "should only be run with Nx Cloud" error. Nx Cloud bot proposed rename to custom-test/custom-build + tsconfig.base.json cleanup (SWC panic in later test).
- Deeper test bug Cloud missed: crystal setup -> project.json targets.test undefined -> `{...undefined}` = `{}` executor-less target.
- Coordination plugin bug: BatchFunctionRunner.process has NO catch -> watch rebuild failure = unhandled rejection (crash) + running stuck true. Killed in-flight build (kill(2)) -> exit code null -> spurious reject on routine debounce path.
- Plan: signal-kill -> resolve; error -> reject; catch+log in watch path; fix e2e test targets to real definitions.

## Status

- [x] Fetch + rebase (onto 1082577c0e, clean)
- [x] Root-cause CI failure (test-ci atomizer collision)
- [x] Workflow analysis (3/4 lanes done; e2e-patterns died on spend limit, done inline)
- [x] Implement fixes (coordination hardening decc1b59ed, e2e test eb8d8a89d7)
- [x] Local validation: vite test/build/lint green; e2e-vite targeted green; red/green check (fix reverted -> "Failed to resolve import" FAIL; restored -> PASS); affected failures = pre-existing npx/pnpm snapshot drift (verified identical on pristine master); prepush green
- [x] Push to shairez/nx:pr-fix-vite-plugin (force-with-lease on old head, eb8d8a89d7)
- [ ] CI green -> merge (watcher polling; main-linux ~75 min)

## Key learnings

- Original test's exact-alias import resolved via tsconfig-paths itself (iterates multi values) - did NOT exercise the plugin fix. Extensionless .tsx subpath import via star alias forces plugin's loadFileFromPaths loop (tsconfig-paths default extensions = .js/.json/.node only).
- Empty {} project.json targets deleted at graph normalization; command-style targets qualify as buildable.
- child.kill(2) -> child may trap SIGINT and exit nonzero code + null signal; benign-kill detection needs child.killed.
- pnpm install in this worktree pulled @nx/nx-* optionalDeps @ 24.0.0 from stale local-registry resolution - restored lockfile from origin/master before commit.
