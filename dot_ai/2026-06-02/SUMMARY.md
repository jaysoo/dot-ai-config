# Summary - 2026-06-02

## Resource Usage & Sandboxing add-on previews (Ocean, Q-484)

Branch `feat/resource-usage-sandboxing-previews` (local, not pushed). Polygraph session `feature-ctas-d440c292` (nrwl/ocean only).

Implemented from a Claude Design handoff bundle: preview-first UI for two paid features when an org isn't entitled.

- **Resource usage** (run Analysis page): top add-on callout + locked blurred "Agent resource usage" table + SAMPLE-DATA modal (memory OOM breach + CPU charts).
- **Sandboxing**: CIPE-page preview box; violations dashboard always shown under `enable_sandboxing_analytics` kill-switch, sample data + sidebar lock (no Enterprise badge) when not entitled.
- **Add-ons page**: deep-link highlight (`#resource-usage`/`#sandboxing`), FREE plans now reach the page with an Upgrade-to-Team nudge (was 404).
- **De-enterprise**: sidebar + workspace sandboxing badge.
- **GitHub PR comment (Kotlin)**: memory/CPU help line on failure/cancel (gated on `workspace != null` to keep selfie snapshots byte-identical); cache-hit sandbox line deferred.

### Key correction
Built the callouts/banner/highlight with gradients + a blur-backdrop modal from the design mock. Jack asked "did you follow DESIGN.md/PRODUCT.md?" — they broke gates #8 (tokens-only), #9 (no gradient text), #5 (no glassmorphism). Reworked to token-based calm treatments. Lesson: the design mock is not authoritative over committed DESIGN.md gates — run the §7 checklist before declaring done.

### Other fixes
- Modal was rendering at `max-w-7xl` with the whole body scrolling (header hidden). Fixed to 960px + fixed header/footer + scrollable chart body (`flex flex-col` + `min-h-0 flex-1 overflow-y-auto`).
- Verified light + dark via a standalone Vite + chrome-devtools-MCP screenshot harness (`.preview-shots/`, like `.oom-shot/`). Sandboxed Chromium can't launch directly (Mach-port denial); must drive the MCP browser.

### Linear
Created Q-484 in the Quokka team with the writeup + 5 screenshots attached (uploaded via `linear-server` MCP `prepare_attachment_upload` -> `curl` PUT to `storage.googleapis.com` -> `create_attachment_from_upload`). Added a comment on the local-testing env-flag gotcha.

### Tooling notes
- nx graph is broken in the sandbox (the `@nx/gradle` plugin needs gradlew). Typechecked with `tsc -b <project>/tsconfig.lib.json` directly.
- Vite HMR served stale modules on deep component edits; the reliable fix was restarting Vite on a fresh port.

## NXC-4316: Deprecate @nx/vite config helpers (PR #35664 - MERGED)

Resumed an existing PR (branch `NXC-4316`, worktree `/Users/jack/projects/nx-worktrees/NXC-4316`) that warn-deprecates `nxViteTsPaths` + `nxCopyAssetsPlugin`. Polygraph session `nxc-4316-2-02c01f81`. Jack had rebased/pushed and wanted CI monitored + a review. PR was already approved by FrozenPandaz. Merged 2026-06-02 21:35 UTC (squash `4d6eddf884`).

Review (thermo-nuclear + a Polygraph child reviewer, independently) found the rebase had dragged in a build-breaker. Fixed in commit `95ff94a15e`:
- `packages/vite/plugins/nx-copy-assets.plugin.ts`: stray duplicate `import { CopyAssetsHandler } from '@nx/js/src/utils/assets/copy-assets-handler'` alongside the existing `@nx/js/internal` import -> TS2300, failed `vite:build-base` in 1s. Deleted the dup line.
- `packages/vite/src/generators/configuration/configuration.spec.ts`: 2 new inline snapshots hand-written with `rollupOptions`, but the generator emits `rolldownOptions` (committed `.snap` already used rolldown) -> failed `vite:test`. Changed both to `rolldownOptions`.
- `packages/vite/src/utils/generator-utils.ts:404`: added `TODO(v24)` marker at the non-ts-solution emit gate (review nit - the only emit site lacked the marker that lived in deprecation.ts + spec).

### Gotchas hit
- **Local `nx test vite` snapshots are unreliable in this worktree.** `formatFiles` (prettier) silently fails under jest: `Could not format ... "A dynamic import callback was invoked without --experimental-vm-modules"`. Output comes back unformatted, so EVERY generator snapshot diverges (a blind `-u` churned 38 snapshots across 7 unrelated suites - reverted all). Fix: `NODE_OPTIONS='--experimental-vm-modules' npx nx test vite ...`; with that, the 2 target tests passed. Trust CI over local for generator-snapshot specs.
- **nx graph blocked by `@nx/gradle`/`@nx/dotnet`/`@monodon/rust` in sandbox** (can't write `~/.gradle` lock). Workaround used: strip those 3 from `nx.json` plugins via a tmp `.mjs`, run, then `git checkout HEAD -- nx.json`.
- **Polygraph `ciStatus` never populated** for this session (both runs). Fell back to GitHub API: `curl -H 'Accept: application/vnd.github+json' https://api.github.com/repos/nrwl/nx/commits/<sha>/status` and watched the `affected --targets=lint,test,build,e2e...` umbrella check. Final CI: all 8 checks green.
- Fish mangles `!` in inline `node -e`/heredocs; wrote `.mjs` via the editor instead.
