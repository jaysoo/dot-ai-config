# Summary - 2026-05-06

## NXC-4159: Drop Node 20 support + bump @types/node

**Status:** PR'd, awaiting CI rerun (1st run had 2 flaky e2e failures)

**Branch:** `NXC-4159` (2 commits: `89fae8e8e9`, `8a49d3611a`)

### What shipped

1. **CI matrix:** dropped Node 20 from `e2e-matrix.yml` and `nightly/process-matrix.ts`; added Node 26.0.0 (just released) for early validation. Nightly matrix size: 152/256 jobs.
2. **`@types/node` bump:**
   - Repo catalog (`pnpm-workspace.yaml`): `^20.19.10` → `^24.11.0` (matches `mise.toml` runtime)
   - Generator constants in 9 files (cypress, react-native, js, web, angular, node, react, jest, angular BC): `'20.19.9'` → `'^22.0.0'` (new supported floor for user workspaces)
   - 1 vue lib snapshot updated to match
3. **Renamed `nodeTLS` → `lowestNodeLTS`** in `process-matrix.ts` (typo fix per Jack — was always meant to be "lowest LTS"). Kept single-LTS semantics for non-core plugin projects.
4. **Type fix from `@types/node` bump:** `@types/node@24.x` moved `detail` from base `PerformanceEntry` to `PerformanceMark`/`PerformanceMeasure` subclasses. Added `as PerformanceMeasure[]` cast in `packages/nx/src/utils/perf-logging.ts` (observer is configured for `'measure'` entries only).
5. **Docs:** removed Node 20 mention + TODO comment from `astro-docs/src/content/docs/technologies/eslint/Guides/custom-workspace-rules.mdoc`.

### CI triage

Initial PR run failed `main-linux` with 2 e2e failures:
- `e2e-maven src/maven-simple.test.ts`: npm `ECOMPROMISED / Lock compromised` when `nx init` installs from local verdaccio. Classic verdaccio race, unrelated.
- `e2e-nx src/cache-no-daemon.test.ts`: 2 of 11 tests timed out at default Jest 35s timeout (`should evict cache if larger than max cache size`, `should honor NX_MAX_CACHE_SIZE env var`). Surrounding tests in same file have explicit 120000ms timeouts; these don't. Slow CI runner exposed it.

Both flaky, no relation to my type-level changes. Pipeline rerun in progress.

### Process notes

- Sandbox blocks `.idea/` writes inside cwd and `~/.gradle/wrapper/*.lck`, so `pnpm install` and `nx test` (with @nx/gradle plugin) had to run via `! ` prefix in user shell.
- gh CLI blocked: 1Password desktop integration unreachable from sandbox; `/opt/homebrew/bin/gh` direct hits TLS cert error without `SSL_CERT_FILE=/etc/ssl/cert.pem`. PR opened from push URL output.

### Files

- Plan: this summary doubles as the task record (no separate plan file — flowed from `/review-pr` of local branch)
- Commits: `89fae8e8e9` (Node 20 drop + @types/node bump + perf-logging fix), `8a49d3611a` (Node 26 add)
- PR: https://github.com/nrwl/nx/pull/new/NXC-4159 (branch pushed via direct git, opened via URL)

## NXC-4430: Migrate Tailwind v3 to v4 (graph + nx-dev)

**Status:** PR #35594 opened. Single commit `91e822c036`, 50 files +337/-648.

**Branch:** `NXC-4430` worktree (started 2026-05-05).

### What shipped

1. **Deps** (root + nx-dev/nx-dev pkg, all pinned exact): `tailwindcss 3.4.4 -> 4.1.11`, added `@tailwindcss/postcss 4.1.11`, dropped `@tailwindcss/aspect-ratio` (built into v4), forms `0.5.10`, typography `0.5.16`.
2. **Configs**: 6 JS `tailwind.config.js` deleted. Replaced with CSS-based `@import 'tailwindcss'`, `@plugin '@tailwindcss/typography'` (and forms with `strategy: class`), `@source` paths, `@custom-variant dark (&:where(.dark, .dark *))`. 6 `postcss.config.js` swapped `tailwindcss` -> `@tailwindcss/postcss`.
3. **v4 utility renames** (per https://tailwindcss.com/docs/upgrade-guide#renamed-utilities) applied via codemod across 28 source files: `shadow-sm -> shadow-xs`, `shadow -> shadow-sm`, `rounded-sm -> rounded-xs`, `rounded -> rounded-sm`, `blur-sm -> blur-xs`, `blur -> blur-sm`, plus drop-shadow + backdrop-blur counterparts. 50 renames total. Codemod scoped to JSX `className=`/`class=` attrs and `clsx|cn|twMerge|cva|classnames(...)` args (scoping fixed after attempt 1 corrupted TS prop names + CSS `blur(...)` template literals).
4. **v3-compat border shim** in main CSS files (`@layer base { *, ::before, ... { border-color: var(--color-gray-200, currentColor); } }`) per https://tailwindcss.com/docs/upgrade-guide#default-border-color, since existing markup often relied on v3's gray-200 default.
5. **Custom typography overrides** (`prose code::before/after` content stripping) moved out of `theme.extend.typography.DEFAULT.css` (no v4 equivalent) into plain `:where(...)` CSS in main stylesheets.

### Gotchas

- **`@source` extglob is unsupported in tw v4.** First attempt used `'../../feature-ai/src/**/!(*.stories|*.spec).{js,ts,jsx,tsx}'` (carried over from v3 content arrays); pattern matched zero files, so feature-ai utilities (`grid`, `w-12`, `dark:bg-zinc-800`, etc.) never made it into the bundle. /ai-chat shipped unstyled until I switched to plain dir paths + `@source not '**/*.{spec,test,stories}.*'` (the idiom astro-docs already used).
- **pnpm `file:` deps cache stale source.** nx-dev/ui-* and graph/ui-* are `file:` deps; pnpm copies them into `.pnpm/...`. After codemod modified TS props that broke the build, `pnpm install --force` was needed to refresh the cached copy.
- **Cytoscape "Cannot read properties of undefined (reading 'split')"** on graph-client release-static fixtures is pre-existing on master (verified by stashing changes, reinstalling v3 deps, repro). Not a migration regression.
- **Codemod attempt 1 was unsafe.** Used `\b` word boundaries which matched TS prop names (`rounded?:` -> `rounded-sm?:`) and JS `blur(...)` calls inside template strings. Tightened to: `(className|class)=` (no spaces, JSX-only) plus `(clsx|cn|twMerge|cva|classnames)(...)` arg strings, with proper boundary chars `[\s:"'\`!]`.

### Verification

Builds: graph-client, nx-dev, astro-docs, all 4 graph storybooks. Visual diff against prod nx.dev/ai-chat — pixel-match. Screenshots colocated.

### Files

- Plan: `.ai/2026-05-05/tasks/nxc-4430-tailwind-v3-to-v4.md`
- Screenshots: `.ai/2026-05-05/tasks/nxc-4430-tailwind-v3-to-v4/` (8 keepers: prod baseline, broken-source-glob state, fixed state, astro-docs, 2 storybooks, real graph data, master pre-existing-error)
- PR: https://github.com/nrwl/nx/pull/35594
- Commit: `91e822c036`
