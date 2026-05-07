# NXC-4430: Convert Tailwind v3 to v4

- Linear: https://linear.app/nxdev/issue/NXC-4430
- PR: https://github.com/nrwl/nx/pull/35594
- Branch: `NXC-4430`
- Commit: `91e822c036`
- Started 2026-05-05, PR opened 2026-05-06.

## Scope

- graph apps + libs (graph/client, graph/migrate, graph/ui-*)
- nx-dev (compile-only per Linear; /ai-chat the only live page)
- astro-docs already on v4, no migration work needed there

## Approach

1. Bumped tailwindcss `3.4.4 -> 4.1.11` (root + nx-dev/nx-dev). Pinned exact (no caret), per repo convention.
2. Added `@tailwindcss/postcss` 4.1.11. Dropped `@tailwindcss/aspect-ratio` (built into v4).
3. Replaced 6 JS `tailwind.config.js` with CSS-based config: `@import 'tailwindcss'`, `@plugin '@tailwindcss/typography'` (and forms), `@source` paths, `@custom-variant dark (&:where(.dark, .dark *))`.
4. Codemod over JSX/TS class strings + clsx/cn/twMerge calls renamed v3 utilities to v4 spellings (per https://tailwindcss.com/docs/upgrade-guide#renamed-utilities):
   - `shadow-sm -> shadow-xs`, `shadow -> shadow-sm`
   - `drop-shadow-sm -> drop-shadow-xs`, `drop-shadow -> drop-shadow-sm`
   - `rounded-sm -> rounded-xs`, `rounded -> rounded-sm`
   - `blur-sm -> blur-xs`, `blur -> blur-sm`
   - `backdrop-blur-sm -> backdrop-blur-xs`, `backdrop-blur -> backdrop-blur-sm`
5. Added v3-compat `@layer base` border-color shim (gray-200 fallback) per https://tailwindcss.com/docs/upgrade-guide#default-border-color.
6. Custom typography `prose code::before/after` overrides moved into plain CSS (since v3 `theme.extend.typography.DEFAULT.css` no longer applies).

## Gotchas

- `@source 'src/**/!(*.stories|*.spec).{js,ts,jsx,tsx}'` extglob is NOT supported by tw v4. Patterns matched zero files, so utilities like `grid`, `w-12`, `dark:bg-zinc-800` never made it into the bundle. /ai-chat shipped unstyled until I switched to plain dir paths + `@source not '**/*.{spec,test,stories}.*'` (the idiom astro-docs already used). See `ai-chat-local-broken-source-glob.png` vs `ai-chat-local-fixed.png`.
- pnpm `file:` deps for nx-dev/ui-* cache copies of source. `pnpm install --force` needed after touching those packages so the cached copy doesn't keep stale class-rename state.
- Codemod attempt 1 used `\b` word boundaries and corrupted TS prop names (`rounded?:` -> `rounded-sm?:`) and CSS `blur(...)` calls inside template strings. Fixed by scoping to JSX `className=` / `class=` attributes and `clsx|cn|twMerge|cva|classnames(...)` call args only, with no spaces around `=` (excludes JS default-value params).
- Cytoscape "Cannot read properties of undefined (reading 'split')" on graph-client release-static fixtures is pre-existing on master, not caused by the migration. See `graph-client-pre-existing-error-on-master.png`.

## Verification

Builds: `nx run-many -t build,build-client -p graph-client,nx-dev,astro-docs` green. Storybook builds for graph-migrate, graph-ui-code-block, graph-ui-project-details, graph-ui-render-config green.

Visual checks (screenshots colocated in `nxc-4430-tailwind-v3-to-v4/`):

- `ai-chat-prod.png` - prod nx.dev/ai-chat baseline
- `ai-chat-local-broken-source-glob.png` - first attempt with extglob `@source`, no utilities generated for feature-ai
- `ai-chat-local-fixed.png` - after switching to plain dir `@source`, pixel-matches prod
- `astro-docs-extending-nx.png` - astro-docs renders correctly under v4
- `storybook-ui-project-details-ownerslist.png` - OwnersList docs page (badges, layout)
- `storybook-ui-project-details-projectdetails.png` - ProjectDetails Primary story (jest project, full Targets list with Cacheable badges)
- `graph-client-real-projects.png` - `pnpm nx graph` real workspace data, cytoscape rendering, sidebar, controls
- `graph-client-pre-existing-error-on-master.png` - cytoscape split error reproduced on master with v3 deps

## Files changed (commit `91e822c036`)

50 files, +337 / -648.

- 6 `tailwind.config.js` deleted
- 6 `postcss.config.js` swapped to `@tailwindcss/postcss`
- 6 main CSS files rewritten with v4 directives + compat border shim + (where applicable) `@plugin`/`@custom-variant`
- 28 JSX/TS source files touched by utility-rename codemod
- root `package.json` + `nx-dev/nx-dev/package.json` bumped + pinned, `pnpm-lock.yaml` regenerated
