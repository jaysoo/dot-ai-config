# Caleb Handoff: Docs & Website Infrastructure

Jack and Ben are both out the week of March 9. This doc covers everything you might need if something goes wrong with nx.dev, the docs site, Netlify, Framer, or Vercel.

---

## Architecture Overview

nx.dev runs on **two Netlify sites** + a **Framer proxy**:

```
nx.dev (browser)
  |
  v
Netlify Edge Function (Framer proxy)
  |
  +-- Most pages --> Framer (marketing homepage, features, etc.)
  +-- /docs/* --> Next.js rewrite --> Astro docs site (separate Netlify site)
  +-- /blog, /courses, /pricing, /podcast, /changelog, etc. --> Next.js app
```

### Netlify Projects (names matter!)

| Netlify Site Name | What It Is                                        | Repo Path        | URL         |
| ----------------- | ------------------------------------------------- | ---------------- | ----------- |
| **nx-dev**        | Next.js app (blog, courses, pricing, routing hub) | `nx-dev/nx-dev/` | nx.dev      |
| **nx-docs**       | Astro/Starlight docs site                         | `astro-docs/`    | nx.dev/docs |

**IMPORTANT**: `nx-docs` = `astro-docs/` in the repo. `nx-dev` = `nx-dev/nx-dev/` in the repo. Don't mix these up.

---

## Framer Proxy (Recent Change - March 3)

The homepage (nx.dev) and most marketing pages are now served by **Framer** via a Netlify edge function. This was recently inverted (March 3) so that Framer is the **default** and only specific paths go to Next.js.

**Key file**: `netlify/edge-functions/rewrite-framer-urls.ts`

- Edge functions are at the **repo root** (`netlify/edge-functions/`), NOT inside `nx-dev/`. This is because Netlify's base directory is `.` (repo root) and edge functions are auto-discovered relative to that.
- The function proxies all requests to Framer, then does a string replace on the HTML to rewrite the Framer domain to `nx.dev`.
- Only HTML responses are processed (`accept: ['text/html']`) to save compute costs.

**Paths that bypass Framer** (served by Next.js instead):

- `/blog`, `/courses`, `/pricing`, `/podcast`, `/ai-chat`, `/changelog`, `/resources-library`, `/whitepaper-fast-ci`, `/500`

**Paths excluded from the edge function entirely** (served directly):

- `/docs/*`, `/api/*`, `/_next/*`, `/.netlify/*`, static assets (`/images/*`, `/fonts/*`, etc.)

**Environment variable** (set in Netlify UI for nx-dev site):

- `NEXT_PUBLIC_FRAMER_URL` - the Framer site URL (e.g. `https://ready-knowledge-238309.framer.app`)

### If Framer is down or pages look broken:

1. Check if Framer itself is down (visit the Framer URL directly)
2. Check the edge function logs in Netlify dashboard (nx-dev site > Edge Functions)
3. If you need to bypass Framer temporarily, you'd need to remove/unset `NEXT_PUBLIC_FRAMER_URL` env var in Netlify and redeploy - but this means the homepage would 404 since those Next.js pages were deleted

Note: Framer access is through `services@nrwl.io`. Check 1Password.

---

## Redirects (Recent Change - Feb 25)

All redirects were recently moved from Next.js config to **Netlify-native** files:

| File                       | Line Count   | Purpose                                     |
| -------------------------- | ------------ | ------------------------------------------- |
| `nx-dev/nx-dev/_redirects` | ~1,335 lines | Legacy URL -> new diataxis structure (301s) |
| `astro-docs/netlify.toml`  | ~50 lines    | Astro-specific redirects + build config     |

**Important**: `_redirects` is processed top-to-bottom, first match wins. Order matters!

If a URL is 404ing or redirecting wrong, check `_redirects` first. The old `redirect-rules.js` files were deleted.

---

## Deploy Previews

Both sites automatically create deploy previews for PRs:

- nx-dev: `https://deploy-preview-{PR#}--nx-dev.netlify.app`
- nx-docs: `https://deploy-preview-{PR#}--nx-docs.netlify.app`

They auto-link to each other via env var logic in `next.config.js`:

```js
process.env.NEXT_PUBLIC_ASTRO_URL = `https://deploy-preview-${process.env.REVIEW_ID}--nx-docs.netlify.app`;
```

---

## Banner System

Banners are fetched from Framer CMS at **build time** and baked into the site.

- A GitHub Actions workflow (`.github/workflows/banner-monitor.yml`) polls every 15 minutes
- If banner content changes, it triggers a Netlify deploy of BOTH sites
- Uses `NETLIFY_AUTH_TOKEN` GitHub secret and `BANNER_URL` env var
- Commands it runs: `netlify deploy --trigger --prod -s nx-docs` and `netlify deploy --trigger --prod -s nx-dev`

### If banner needs updating manually:

```bash
# Trigger a production deploy (requires netlify-cli and auth)
netlify deploy --trigger --prod -s nx-docs
netlify deploy --trigger --prod -s nx-dev
```

---

## Build Issues / Memory Limits

Netlify has an **8GB memory limit**. We've had to aggressively exclude native binaries to stay under it:

- `nx-dev/nx-dev/netlify.toml` excludes SWC, esbuild, @nx native binaries from function bundles
- `next.config.js` has matching `outputFileTracingExcludes`
- Astro config (`astro-docs/netlify.toml`) disables Gradle/Maven plugins (`NX_GRADLE_DISABLE=true`, `NX_MAVEN_DISABLE=true`) because Netlify only has Java 8

---

## Key Environment Variables (Netlify UI)

**nx-dev site:**

- `NEXT_PUBLIC_FRAMER_URL` - Framer domain for proxy
- `NEXT_PUBLIC_ASTRO_URL` - Points to nx-docs Netlify site (production value)
- `BANNER_URL` - Framer CMS banner endpoint

**nx-docs site:**

- `NX_DEV_URL` - Points back to nx-dev (for header/footer links)
- `NX_GRADLE_DISABLE` / `NX_MAVEN_DISABLE` - Must be `true`

---

## Sitemap

- Main sitemap: `nx.dev/sitemap.xml` (Next.js generated)
- Framer sitemap: `nx.dev/sitemap-1.xml` (proxied via separate edge function `framer-sitemap.ts`)
- Docs sitemap: `nx.dev/docs/sitemap-index.xml` (Astro generated)
- Config: `nx-dev/nx-dev/next-sitemap.config.js`

---

## Vercel

We are **NOT on Vercel** anymore. Everything is on Netlify. Vercel config files may still exist in the repo but are not active.

---

## Quick Troubleshooting

| Symptom                           | Likely Cause                         | Fix                                                                 |
| --------------------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| Homepage blank/broken             | Framer down or edge function error   | Check Netlify edge function logs, check Framer URL directly         |
| /docs pages 404                   | Astro build failed or rewrite broken | Check nx-docs Netlify deploy, check `NEXT_PUBLIC_ASTRO_URL` env var |
| Old URL not redirecting           | Missing from `_redirects`            | Add rule to `nx-dev/nx-dev/_redirects`                              |
| Build OOM on Netlify              | Memory limit exceeded                | Check if new native deps were added, add to exclusion lists         |
| Banner not updating               | Workflow not firing or cache stale   | Manually trigger deploy (see Banner section)                        |
| Deploy preview /docs broken       | Preview URL mismatch                 | Check `REVIEW_ID` env var logic in `next.config.js`                 |
| Static assets (images, fonts) 404 | Framer proxy intercepting them       | Check `excludedPath` in edge function config                        |

---

## Key Files Reference

| File                                            | Purpose                                 |
| ----------------------------------------------- | --------------------------------------- |
| `netlify/edge-functions/rewrite-framer-urls.ts` | Framer proxy + URL rewriting            |
| `netlify/edge-functions/framer-sitemap.ts`      | Framer sitemap proxy                    |
| `netlify/edge-functions/README.md`              | Why edge functions are at repo root     |
| `nx-dev/nx-dev/_redirects`                      | 1,335 redirect rules                    |
| `nx-dev/nx-dev/netlify.toml`                    | Next.js Netlify config                  |
| `nx-dev/nx-dev/next.config.js`                  | Rewrites to Astro, deploy preview logic |
| `astro-docs/netlify.toml`                       | Astro Netlify config + redirects        |
| `.github/workflows/banner-monitor.yml`          | Auto-deploy on banner changes           |
