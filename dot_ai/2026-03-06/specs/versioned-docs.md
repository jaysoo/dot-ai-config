# Versioned Docs Spec

**Linear Issue**: [DOC-69](https://linear.app/nxdev/issue/DOC-69/what-to-do-about-versioned-docs)
**Due**: 2026-03-18
**Goal**: Replace existing Next.js versioned doc deployments with static HTML snapshots served via Netlify branch deploys at `{version}.nx.dev/docs`.

---

## Overview

When a new Nx major version ships, the current docs are "frozen" as a static snapshot and deployed to a versioned subdomain (e.g., `22.nx.dev/docs`). The latest docs always live at `nx.dev/docs`. Only `/docs` paths are versioned -- blog, marketing, and other pages are never versioned.

## Scope

- **In scope**: Freezing docs per major version, crawling legacy Next.js docs (19-21), Netlify branch deploy config, banner injection, freeze automation script
- **Out of scope**: Feature annotation badges ("Added in v20.4"), blog/marketing versioning, minor version snapshots

## Architecture

### Subdomain Scheme

| Subdomain | Source | Content |
|-----------|--------|---------|
| `nx.dev/docs` | master branch, Astro build | Latest docs (always current) |
| `22.nx.dev/docs` | `docs/v22` branch | Frozen Astro static build |
| `21.nx.dev/docs` | `docs/v21` branch | Crawled from legacy Next.js site |
| `20.nx.dev/docs` | `docs/v20` branch | Crawled from legacy Next.js site |
| `19.nx.dev/docs` | `docs/v19` branch | Crawled from legacy Next.js site |

### Hosting

- **Netlify** with branch deploys on the `nx-dev` site
- Branch `docs/v22` maps to custom subdomain `22.nx.dev`
- Versioned sites are fully self-contained static HTML+CSS+JS -- no reverse proxy or rewrites needed

### URL Routing (per versioned subdomain)

| Path | Behavior |
|------|----------|
| `/docs/*` | Serve static docs content |
| `/*` (everything else) | Redirect to `https://nx.dev/` |

Handled via a `_redirects` file in the static output:

```
/docs/*  /docs/:splat  200
/*       https://nx.dev/  301
```

### Old Docs Banner

A sticky banner injected at the top of every HTML page via post-build script:

- **Position**: `position: sticky; top: 0;` -- always visible, not dismissable
- **Content**: `You're viewing docs for Nx {VERSION}. View the latest docs ->` where the link deep-links to the same path on `nx.dev` (e.g., `22.nx.dev/docs/getting-started` links to `nx.dev/docs/getting-started`)
- **Injection method**: Post-build HTML injection script that inserts the banner `<div>` into every `.html` file. Same script used for both crawled legacy docs and new Astro snapshots.

Banner HTML (injected after `<body>`):

```html
<div style="position:sticky;top:0;z-index:9999;background:#1e293b;color:#e2e8f0;text-align:center;padding:8px 16px;font-family:system-ui,sans-serif;font-size:14px;">
  You're viewing docs for Nx {VERSION}.
  <a href="https://nx.dev{CURRENT_PATH}" style="color:#38bdf8;text-decoration:underline;margin-left:4px;">View the latest docs &rarr;</a>
</div>
```

The `{CURRENT_PATH}` is derived from the file's path relative to the output root.

---

## Phases

### Phase 1: Legacy Migration (Now -- Due March 18)

Crawl and freeze the existing Next.js versioned doc sites (19, 20, 21) and deploy as static branch deploys.

#### Steps

1. **Crawl each legacy site** using `wget --mirror`:
   ```bash
   wget --mirror --convert-links --adjust-extension --page-requisites \
     --no-parent --directory-prefix=./output \
     https://19.nx.dev/docs
   ```
   Repeat for 20, 21.

2. **Clean up crawled output**:
   - Restructure so `/docs/` is the root serving path
   - Remove any non-`/docs` pages that were crawled

3. **Inject the old docs banner** into every `.html` file

4. **Add `_redirects` file** for non-`/docs` paths

5. **Create branches and commit**:
   ```bash
   git checkout --orphan docs/v19
   # Copy crawled + processed static files
   git add -A && git commit -m "docs: static snapshot of Nx 19 docs"
   git push origin docs/v19
   ```
   Repeat for v20, v21.

6. **Configure Netlify subdomain mapping** (manual or via CLI):
   - `docs/v19` branch -> `19.nx.dev`
   - `docs/v20` branch -> `20.nx.dev`
   - `docs/v21` branch -> `21.nx.dev`

7. **Verify** all versioned subdomains serve docs correctly and non-docs paths redirect

8. **Delete old Next.js deployments** once verified

### Phase 2: Freeze Script for Future Majors (Ready by April -- Nx 23 release)

Automate the process of freezing the current Astro docs when a new major ships.

#### Freeze Script (`scripts/freeze-docs.sh`)

**Input**: Version number (e.g., `22`)

**Script performs**:

1. Cut branch `docs/v{VERSION}` from current master
2. Run `nx build astro-docs` to produce static output
3. Add `_redirects` file to the build output
4. Run banner injection script on all `.html` files in the output
5. Commit the static output to the branch (orphan branch with only static files)
6. Push the branch to origin
7. Print next steps for Netlify UI configuration:
   ```
   NEXT STEPS:
   1. Go to Netlify site settings for nx-dev
   2. Add branch deploy for: docs/v22
   3. Add custom domain: 22.nx.dev
   4. Verify at https://22.nx.dev/docs
   ```

#### Banner Injection Script (`scripts/inject-docs-banner.js`)

**Input**: Version number, directory of HTML files

**Behavior**:
- Finds all `.html` files in the directory
- For each file, computes the serving path from the file's relative path
- Injects the sticky banner HTML after the opening `<body>` tag
- The banner deep-links to `https://nx.dev/{relative-path}`

---

## Decisions & Trade-offs

| Decision | Rationale |
|----------|-----------|
| Subdomain per major only | Minors don't warrant separate doc sites; annotation badges (separate effort) handle minor-level feature discovery |
| `wget --mirror` for legacy crawl | Old Next.js sites are SSG, simple crawl is sufficient. Playwright fallback if specific pages are broken |
| Post-build banner injection | Unified approach for both crawled legacy HTML and Astro builds. No need to modify Astro source |
| Orphan branches | Keep versioned doc branches clean -- no repo history, just static files |
| `_redirects` for routing | Simple, Netlify-native, no server config needed |
| Same Netlify site (`nx-dev`) | Branch deploys are already configured there; versioned sites don't need rewrites so no conflict |

## Open Questions

- **Banner styling**: The inline styles above are a starting point. May want to match Nx brand colors more closely.
- **Netlify branch deploy limits**: Verify there's no limit on branch deploys or custom subdomains on the current Netlify plan.
- **Crawl completeness**: May need a verification step after crawling to ensure all docs pages were captured (e.g., compare against a sitemap if available).
