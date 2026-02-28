---
description: >
  Track releases and direction changes in frameworks that Nx provides
  plugins for. Covers Angular, React, Next.js, Remix/React Router,
  Nuxt, Vue, Vite, Rspack, Rolldown, esbuild, SWC, and related bundlers.
  Flags breaking changes, new APIs, and plugin compat risks. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# Framework & Bundler Ecosystem Tracking

Track the frameworks and build tools that Nx wraps via plugins. When
Angular ships a new builder API, or Vite changes its config format, or
Rspack reaches parity with webpack — our plugins need to react. This
command catches those signals early.

## Scope

$ARGUMENTS

Default: all tracked frameworks and bundlers. Can scope to "react only",
"bundlers only", "angular", etc.

## File Management

Area directory: `.ai/para/areas/framework-ecosystem/`

1. Current month as `YYYY-MM`.
2. If report exists, **update in place**. Preserve `> NOTE:` / `<!-- manual -->`.
3. If not, create new. Ensure README.md links it.

### README.md structure

```markdown
# Framework & Bundler Ecosystem

Monthly tracking of frameworks and bundlers that Nx provides plugins for.
Catches breaking changes, new APIs, and compatibility risks before they
reach users.

## Tracked Frameworks (→ Nx Plugin)

| Framework | Nx Plugin | Repo |
|-----------|-----------|------|
| Angular | @nx/angular | angular/angular |
| React | @nx/react | facebook/react |
| Next.js | @nx/next | vercel/next.js |
| Remix / React Router | @nx/remix | remix-run/remix |
| Nuxt | @nx/nuxt | nuxt/nuxt |
| Vue | @nx/vue | vuejs/core |

## Tracked Bundlers (→ Nx Plugin)

| Bundler | Nx Plugin | Repo |
|---------|-----------|------|
| Vite | @nx/vite | vitejs/vite |
| webpack | @nx/webpack | webpack/webpack |
| Rspack | @nx/rspack | web-infra-dev/rspack |
| Rolldown | (watching) | rolldown/rolldown |
| esbuild | @nx/esbuild | evanw/esbuild |
| SWC | used internally | swc-project/swc |

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line: key risk or opportunity}
```

## Sources for each framework/bundler

For each tracked project, check:

```bash
gh release list --repo <owner>/<repo> --limit 10 --json tagName,publishedAt
```

Then for releases within the target month, fetch release details:
```bash
gh release view <tag> --repo <owner>/<repo> --json body
```

Also check official blogs:

| Project | Blog/Changelog |
|---------|---------------|
| Angular | https://blog.angular.dev |
| React | https://react.dev/blog |
| Next.js | https://nextjs.org/blog |
| Remix | https://remix.run/blog |
| Nuxt | https://nuxt.com/blog |
| Vue | https://blog.vuejs.org |
| Vite | https://vite.dev/blog |
| Rspack | https://rspack.dev/blog |
| Rolldown | https://rolldown.rs/blog |

## CRITICAL: Verify release status against npm

**Do NOT rely on training data for release status.** Always verify the
current stable version on npm before writing the report:

```bash
# For every framework/bundler, check the actual latest version:
npm view next version          # NOT "RC" if already stable
npm view @angular/core version
npm view vite version
npm view @rspack/core version
npm view react version
npm view nuxt version
npm view vue version
npm view esbuild version
npm view @swc/core version
```

If you write "RC available" or "beta expected" without checking npm,
you WILL produce stale information. Check npm first, then supplement
with blog posts and GitHub releases for context.

## For each project, analyze:

### Breaking changes
- Config format changes
- CLI flag changes
- Plugin API changes (this is the big one — Nx plugins often use internal APIs)
- Node.js version requirement changes
- Peer dependency changes

### New features Nx should support
- New project types or modes (e.g., Angular signals, React Server Components)
- New build APIs or builder interfaces
- New CLI commands that should get Nx equivalents
- New config options that should flow through Nx generators

### Deprecations
- Features being removed that Nx plugins currently use
- APIs being replaced with new alternatives
- Patterns the framework discourages that Nx generators still produce

### Competitive signals
- Framework-native monorepo features (Nuxt layers, Next.js turbopack)
- Built-in features that reduce need for Nx (test runners, build caching)
- Partnerships or integrations with competitor tools

### Nx plugin impact assessment

For each significant change, assess:
- Which `@nx/*` plugin is affected?
- Is this a **breaking compat** (our plugin will fail with the new version)?
- Is this a **feature gap** (new capability we should support)?
- Is this a **deprecation risk** (we use something being removed)?
- **Priority**: Critical (breaks users) / High (gap users will notice) / Low (nice to have)

## Compare with last month

- Compat risks flagged last month: resolved or still open?
- Framework releases that we expected but didn't ship
- Nx plugin updates we shipped in response to framework changes

## Write the report

```markdown
# Framework & Bundler Ecosystem — {Month Year}

_Last updated: {datetime}_

## ⚡ Compat Risks Requiring Action
{Top items where a framework release could break an Nx plugin.
If none, say "No immediate risks."}

## Frameworks

### Angular
- **Releases this month**: {versions}
- **Key changes**: {summary}
- **@nx/angular impact**: {specific: "New builder API means we need to update X" or "No impact"}
- **Action needed**: {Yes/No — what specifically}

### React
{Same structure}

### Next.js
{Same structure}

### Remix / React Router
{Same structure}

### Nuxt
{Same structure}

### Vue
{Same structure}

## Bundlers

### Vite
- **Releases**: {versions}
- **Key changes**: {summary}
- **@nx/vite impact**: {specific}

### Rspack
{Same structure}

### Rolldown
- **Status**: {alpha/beta/stable, any milestone announcements}
- **Nx relevance**: {when should we consider a plugin?}

### esbuild
{Same structure}

### SWC
{Same structure}

## Cross-Cutting Themes
{Patterns visible across multiple frameworks:
e.g., "Angular and Next.js both moved toward RSC-style patterns this month"}

## Recommended Plugin Work
| Plugin | Priority | What | Why |
|--------|----------|------|-----|
```

Save to `.ai/para/areas/framework-ecosystem/YYYY-MM.md` and update README.md.
