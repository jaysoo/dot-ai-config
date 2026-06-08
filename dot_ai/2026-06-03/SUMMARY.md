# Summary - 2026-06-03

## PR #11598 review: restrict manual DTE to Enterprise (review only)

Thermo-nuclear code-quality review of `nrwl/ocean` PR #11598 (branch `restrict-manual-dte`,
author Louie Weng), driven from Polygraph session `restrict-manual-dte-419e3eec`. No code
written by me - findings only.

### What the PR does
Adds a guard in the `create-run-group` handler so new (post-cutoff) non-enterprise workspaces
cannot run manual DTE. New helper `isManualDteAllowed(workspaceCreatedAt)` +
`MANUAL_DTE_ENTERPRISE_CUTOFF = 2026-06-05` in `CloudOrganization.kt`, and `isManual()` on
`DistributeOnInput`.

### Blocker surfaced
The guard `if (!isNxAgents && !isManualDteAllowed) -> 403 Forbidden` over-blocks two paths that
must keep working:

1. **`--no-distribution`** (inline CIPE run, no agents, GHA-style) is 403'd. It sends the same
   wire payload as manual DTE (`distributeOn: undefined`), so the server cannot distinguish them.
   The mode is decided purely client-side via the DTE marker file. Fix needs the CLI to send an
   explicit no-distribution signal.
2. **First run on a new unconnected workspace requesting `--distribute-on "<template>"`** (incl
   `.yaml`) is 403'd, because `isUnconnected` forces `isNxAgents=false` -> misclassified as manual
   DTE. The guard also runs before the `distributionRequested && isUnconnected` 202 claim flow, so
   it preempts onboarding. Fix: remove `!isUnconnected` from `isNxAgents` (safe - the claim branch
   intercepts that case before `isNxAgents` is used downstream).

Confirmed with Jack: blocking bare `start-ci-run` / `--distribute-on manual` (true manual DTE) is
intended. `--no-distribution` and Nx Agents (any template) must keep working.

Secondary: the 403 returns a raw string body but the CLI reads `e.response.data.message` (object),
so users would see a bare `Request failed with status code 403` with no explanation.

### Durable knowledge captured
Added "CI Run Group Creation / Distribution Mode Classification" to the ocean architecture file
(three distribution modes, wire payloads, and the manual-vs-no-distribution indistinguishability
gotcha).

## NXC-4324: deprecate webpack/rspack compose helpers (draft PR #35867)

Single-repo `nrwl/nx` work via Polygraph session `nxc-4324-2bacd010`. Part of the v23 config-helper
deprecation milestone (sibling to NXC-4316 vite, NXC-4325 next, NXC-4326 expo). Plan-first ->
approved -> implemented -> draft PR.

### What it does
Deprecates the compose helpers (`composePlugins`, `withNx`, `withWeb`, `withReact` + the
`@nx/react/webpack` `withReact` re-export) for removal in Nx v24. Warn-only for v23: `@deprecated`
JSDoc + a warn-once-per-package runtime message pointing at the real plugin classes
(`NxAppWebpackPlugin`/`NxAppRspackPlugin`/`NxReactWebpackPlugin`/`NxReactRspackPlugin`) and
`nx g @nx/<bundler>:convert-to-inferred`. No codemod, no generator changes (Jack's call). Mirrors
the NXC-4316 vite precedent (PR #35664).

### Key design problem solved
Nx composes these helpers internally, so a naive warn would false-positive for users who never wrote
a compose config. Traced every internal caller; the real runtime sites narrowed to 3 (the
`use-legacy-nx-plugin` hits were JSDoc examples; React CT requires-but-never-calls them). Used a
synchronous process-level suppression counter (`suppress...ComposeHelperWarnings(fn)`) and wrapped
the 3 genuine internal composers: rspack executor, storybook preset, next.js CT preset. Warn fires
at construction (sync), so the counter is safe despite `composePlugins` returning an async combined.

### Files
3 deprecation utils (`packages/{webpack,rspack}/src/utils/deprecation.ts` + new react one), warn +
JSDoc on each helper body, 3 suppression wraps, 3 docs asides (webpack config-setup, webpack-plugins,
adding-assets-react), 3 `deprecation.spec.ts` (all green). vale clean. `nx`/e2e blocked locally by
the `@nx/gradle` sandbox graph break.

### Review outcome
Thermo-nuclear review approved with one DRY ask (collapse 3x warn/suppress into a factory).
Recommended NOT taking it: the only shared home is `@nx/devkit/internal`, a heavy generator barrel
inappropriate for the runtime build path; and the codebase already duplicates the same per-package
`warnOnce` pattern in 3 `module-federation-deprecation.ts` files (house style). Awaiting Jack's call
on that + the affected suite before marking PR ready.

### Follow-up (separate)
rspack React config generator scaffolds compose-helper configs unconditionally even with the inferred
plugin present - make it honor `hasPlugin` so new modern workspaces stop emitting soon-to-warn configs.

## Notes / housekeeping
- `.ai` in this repo is a real directory (not the symlink my global setup expects). It holds the
  dated folders + architecture file. Did NOT run the global "fix" (which is `rm -rf .ai`).
- NXC-4324 plan lives at `~/.claude/plans/breezy-wobbling-haven.md` (plan-mode default), not in a
  `.ai/.../tasks/` file - task wasn't logged at start.
