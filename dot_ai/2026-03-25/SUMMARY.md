# Daily Summary — 2026-03-25

## Completed

### NXC-4112: Auto-open browser on Cloud "yes"
- **PR**: https://github.com/nrwl/nx/pull/35014
- **What**: When users select "yes" to Nx Cloud during `create-nx-workspace`, the setup URL now auto-opens in their default browser instead of just printing it in the terminal.
- **Changes** (3 files):
  - `packages/create-nx-workspace/package.json` — Added `open` dependency
  - `packages/create-nx-workspace/src/utils/nx/nx-cloud.ts` — New `openCloudSetupUrl()` function with CI detection and graceful failure
  - `packages/create-nx-workspace/src/create-workspace.ts` — Calls `openCloudSetupUrl()` after banner display when cloud is connected
- **Guards**: Skips in CI environments, fails silently if no display/browser available, only fires when user actually connected (not "Maybe later")

### Vite 8 Support (community PR #34850)
- **PR**: https://github.com/nrwl/nx/pull/34850
- **What**: Helped community PR through to add Vite 8 support across the Nx ecosystem. Major effort spanning 2 days with multiple CI iterations.
- **Key changes**:
  - Updated peer deps to `^8.0.0` in `@nx/vite` and `@nx/vitest`
  - Bumped `@vitejs/plugin-react` to `^6.0.0` (Vite 8 compat, uses Oxc instead of Babel)
  - Handled `rolldownOptions` alongside `rollupOptions` (Vite 8 renamed Rollup → Rolldown)
  - Fixed build executor environments API — was clobbering env-specific `rolldownOptions` config
  - Fixed `typeof import('vite')` across 6 packages (Vite 8 ESM-only `.d.mts` types break under `moduleResolution: "node"`)
  - Added `@oxc-project/runtime` dep to Angular vitest generator (rolldown injects helpers without declaring the dep)
  - Added error in Cypress CT generator when Vite 8 detected (Cypress CT doesn't support Vite 8 yet)
  - Init generators now preserve existing vite version instead of bumping (Leo's feedback)
  - Used `semver.coerce()` + `major()` for version detection (not fragile string matching)
  - `ensure-dependencies` picks correct `@vitejs/plugin-react` version based on installed vite
  - Updated docs, added Vite 7/8 e2e tests, downgraded Cypress CT e2e tests to Vite 7
- **Packages touched**: `@nx/vite`, `@nx/vitest`, `@nx/cypress`, `@nx/react`, `@nx/angular`, `@nx/remix`, `astro-docs`
- **46 files changed** across source, tests, and e2e

### NXC-4141: Reduce Push to GitHub Errors
- **PR**: https://github.com/nrwl/nx/pull/35011
- **Issue**: [NXC-4141](https://linear.app/nxdev/issue/NXC-4141) / Fixes [#34482](https://github.com/nrwl/nx/issues/34482)
- **What**: The "push to GitHub" prompt in CNW had a 96.3% failure rate (16,426/17,058 YTD). Root cause: `gh repo create --push` via `spawnAndWait()` with no timeout hangs indefinitely for users with 1Password SSH agent, credential managers, passphrase-locked SSH keys, or corporate SSO.
- **Key changes**:
  - Tiered timeouts: 1s pre-flight, 10s repo listing, 30s push
  - Switched push from `spawnAndWait` (stdio:inherit) to `execAndWait` — fixes git output bleeding after CNW exits
  - All `gh` commands use `silenceErrors: true` — no more stray `error.log` (#34482)
  - `GitHubPushError` class with `reason` field for telemetry; only actual push failures show `github.com/new` hint
  - CNW always succeeds — push failures are warnings, never fatal

### CLOUD-4390: ClickUp Exit Code 2 Investigation
- **Issue**: [CLOUD-4390](https://linear.app/nxdev/issue/CLOUD-4390) / [ocean#10513](https://github.com/nrwl/ocean/pull/10513)
- **What**: ClickUp reported DTE runs showing `status: 2` in Cloud UI after upgrading Nx 22.3.3 → 22.6.1. Investigated deeply across Nx CLI and Ocean codebases.
- **Root cause**: Latent Cloud bug in `MarkTasksAsCompleted.kt` — `maxOf(task.code)` leaks raw exit codes through DTE status computation. `tsc --noEmit` exits with code 2 (not 1) for type errors. When tasks arrive in partial batches, `maxOf` picks up the raw 2 instead of normalizing to 1. Surfaced by ClickUp enabling continuous assignments for Nx agents, which changed batching timing.
- **Fix**: Caleb patched Cloud UI — `getNamedStatus()` now treats `code != 0 && code != 130` as `'FAILED'`. Preserves raw exit codes for debugging.
- **Also found**: Separate SIGTERM exit code regression in Nx 22.6.x (1 → 130). Not yet filed.
- **Analysis doc**: `/tmp/nx-exit-code-2-analysis.md`

### DOC-452: Topic-Based Tutorial Series
- **PR**: https://github.com/nrwl/nx/pull/34998
- **What**: Replaced 3 monolithic framework-specific tutorials (React, Angular, TypeScript) with 7 focused, technology-agnostic topic tutorials + rewrote the CI tutorial. Each teaches one concept in ~5 minutes.
- **Tutorial sequence**: Crafting Your Workspace → Managing Dependencies → Configuring Tasks → Running Tasks → Caching Tasks → Understanding Your Workspace → Reduce Boilerplate → Setting Up CI
- **Key design decisions**:
  - Progressive disclosure: plugins not mentioned until tutorial 7, `nx affected` deferred to CI tutorial (part 8)
  - AI agent friendly: `llm_copy_prompt` on every page with scoping constraints
  - Workspace-agnostic: works with CNW, `nx init`, or any existing repo
  - Package.json + project.json tabs everywhere (package.json first)
  - TypeScript solution-style project references documented (recommended by TS team)
  - Buildable vs non-buildable libs with `customConditions` for IDE resolution
  - SVG diagrams for task ordering and cache hash flow
  - Screenshots for project graph edges and task graph
  - Non-JS callouts throughout (Python/uv, Gradle, `implicitDependencies`)
  - "Nx CLI" vs "Nx" distinction (CLI = task orchestrator, Nx = full platform)
- **QA**: 3 rounds of automated testing across 4 workspace types (CNW, existing, with-Nx, Python). All must-fix and high-priority issues resolved.
- **Files**: 28 changed, ~2000 lines added. 7 new tutorial pages, 4 SVG/PNG assets, sidebar/netlify config, 5 concept page cross-links, 11 technology page link updates.

## Specs

### nx-blog: Standalone Blog & Changelog Site
- **Spec**: `dot_ai/2026-03-25/specs/nx-blog.md`
- **What**: Brainstormed and specced a new `nx-blog` repo to extract blog (193 posts) and changelog (43 files) from the `nx` monorepo into a standalone Astro + Markdoc site. Served via Netlify reverse proxy at `nx.dev/blog/*` and `nx.dev/changelog`.
- **Key decisions**:
  - Astro + `@astrojs/markdoc` with `.mdoc` files (1:1 migration)
  - pnpm monorepo (`apps/blog/`) with Nx, mise, Node 24
  - Strict Zod content collections (blog, changelog, authors)
  - 13 Markdoc tags to port, React islands initially → Astro later
  - Pagefind for search, tag filtering, pinned posts
  - Legacy images in `public/`, new images in `src/assets/` (optimized)
  - Header/footer duplicated from nx.dev
  - No code reviews required — devrel has full autonomy
  - Hard cutover with 1-week bake period before cleanup from nx repo
