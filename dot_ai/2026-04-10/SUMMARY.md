# Summary — 2026-04-10

## DOC-476: Bring back "no workspace" CTA in CI tutorial

Restored the cloud.nx.app workspace creation CTA to the self-healing CI tutorial (`self-healing-ci-tutorial.mdoc`). The CTA was removed in PR #34935 when tutorials switched from browser-based onboarding to CLI-based `create-nx-workspace`.

Changes:
- Added "Don't have a workspace yet?" section under "Connect to Nx Cloud" with a `call_to_action` linking to `cloud.nx.app/create-nx-workspace`
- Renamed the existing `nx connect` instructions to "Connect an existing workspace"
- Updated "Generate a CI workflow" section to tell users who already have a workflow (from cloud onboarding) to skip ahead
- Relaxed prerequisites — no longer assumes an existing workspace

## DOC-69: Versioned docs snapshot script

Built a comprehensive script (`scripts/create-versioned-docs.mts`) and Claude skill for creating versioned docs branches. PR #35264.

**What it does:**
- Fetches latest stable git tag for a major version (e.g., `22.6.4`)
- Builds astro-docs (v21+) or nx-dev with static export (v18-v20)
- Creates an orphan branch with pre-built static files at `nx-dev/nx-dev/.next/`
- Includes `netlify.toml` with `NETLIFY_NEXT_PLUGIN_SKIP=true` for pure static serving
- Resolves `GITHUB_TOKEN` from 1Password
- `--force` flag to overwrite existing branches
- Uses `mise exec` to auto-switch to Node 20 for legacy builds

**Tested and deployed:**
- v21 deployed: https://v21--nx-dev.netlify.app/docs/getting-started/intro
- v20 built locally (from tag 20.8.4)
- v19 built locally (from tag 19.8.15) — required Node 20, hoisted node_modules, tailwind config patching

**Key challenges solved:**
- Netlify UI settings shared across branches → root `netlify.toml` overrides per-branch
- `@netlify/plugin-nextjs` auto-installs → `NETLIFY_NEXT_PLUGIN_SKIP=true` env var
- pnpm strict isolation breaks v18-v20 deps → `node-linker=hoisted` in `.npmrc`
- Tailwind v3 stack overflow on hoisted `node_modules` → patch `content` config
- Node 24 incompatible with legacy builds → `mise use node@20` + `mise exec --` wrapping
- `.next/cache/` and stray `project.json` files → filtered during copy
- Branch naming uses `20` not `v20` to match existing version dropdowns

**Also created:**
- Claude skill at `.claude/skills/create-versioned-docs/SKILL.md`
- Blog post idea at `.ai/para/resources/blog-ideas/versioned-docs-with-orphan-branches.md`
- README section in `astro-docs/README.md`
