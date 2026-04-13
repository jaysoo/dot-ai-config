# Blog Post Idea: Versioned Docs with Orphan Branches on Netlify

## Hook

How we serve v18–v22 of Nx docs from a single Netlify app using pre-built orphan branches — no rebuild, no SSR, no drift.

## Key Points

### The Problem

- Docs site evolves with each major version — old docs disappear when new version ships
- Users on older versions need reference docs that match their installed version
- Rebuilding old docs from source is fragile (deps change, tooling moves on)
- Can't change Netlify app settings per-branch (shared across all branches)

### The Solution: Pre-built Orphan Branches

- Script checks out the git tag for that major version (e.g., `22.6.4`)
- Builds the docs site locally
- Creates an **orphan branch** (no history) with ONLY the static output
- Includes a `netlify.toml` that overrides UI settings per-branch
- Push → Netlify branch deploy → `v22.nx.dev`

### Why Orphan Branches?

- No git history = tiny branch (just static files)
- Completely isolated from main branch — no merge conflicts ever
- Force-push to update without accumulating history
- Branch deploys are a built-in Netlify feature

### Netlify Tricks

- `netlify.toml` in repo **overrides** UI build settings per-branch
- `NETLIFY_NEXT_PLUGIN_SKIP=true` disables auto-installed Next.js plugin
- No-op build command (`echo`) since files are pre-built
- Server-side redirects replace client-side meta refresh

### Handling Multiple Eras

- v21+: Astro/Starlight build → static HTML
- v18-v20: Next.js with `output: 'export'` → static HTML + hoisted node_modules
- Same branch structure for both — Netlify doesn't care what generated the HTML
- Legacy path is clearly marked with TODO for removal

### Gotchas

- `.next/cache/` and stray `project.json` files must be excluded from static copy
- Old versions may need `node-linker=hoisted` in `.npmrc` for dep resolution
- `pnpm install --frozen-lockfile` fails on empty lockfiles — generate a real one
- `git clean -fd` needed before switching back from orphan branch

## Target Audience

Teams maintaining versioned documentation, especially with Netlify/Vercel branch deploys.

## Format

Tutorial-style with code snippets from the actual script. ~1500 words.
