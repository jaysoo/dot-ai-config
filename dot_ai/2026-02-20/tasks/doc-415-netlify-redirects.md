# DOC-415: Move Next.js rewrites to Netlify CDN-level redirects

## Context

nx.dev experienced a ~10-minute outage because the `@netlify/plugin-nextjs` adapter converts Next.js `rewrites()` into internal fetches to `*.netliedge.com`. When a Netlify CDN node was unreachable, these proxied `/docs/*` requests failed, taking down the docs portion of the site.

The fix: move the `/docs` proxy rewrites from `next.config.js` to `netlify.toml` `[[redirects]]` with `status = 200`, which operates at the CDN layer and bypasses the Next.js adapter entirely.

**Key constraint:** `netlify.toml` does not support env var interpolation in redirect rules, so the production URL (`https://nx-docs.netlify.app`) must be hardcoded. Deploy previews of nx-dev will proxy to production nx-docs (acceptable trade-off).

## Changes

### 1. Add CDN-level proxy rules to `nx-dev/nx-dev/netlify.toml`

Add `[[redirects]]` entries **after** the existing `[functions]` section:

```toml
# CDN-level proxies to astro-docs (status 200 = transparent rewrite/proxy).
# Runs at CDN layer, bypassing the Next.js adapter's internal *.netliedge.com
# fetch that caused the DOC-415 outage.
#
# NOTE: URL is hardcoded because netlify.toml does not support env var
# interpolation. Deploy previews proxy to production nx-docs.

[[redirects]]
  from = "/docs"
  to = "https://nx-docs.netlify.app/docs"
  status = 200

[[redirects]]
  from = "/docs/*"
  to = "https://nx-docs.netlify.app/docs/:splat"
  status = 200

[[redirects]]
  from = "/.netlify/*"
  to = "https://nx-docs.netlify.app/.netlify/:splat"
  status = 200

[[redirects]]
  from = "/llms.txt"
  to = "https://nx-docs.netlify.app/docs/llms.txt"
  status = 200

[[redirects]]
  from = "/llms-full.txt"
  to = "https://nx-docs.netlify.app/docs/llms-full.txt"
  status = 200
```

### 2. Simplify `nx-dev/nx-dev/next.config.js`

**Remove** the production env var resolution block (lines 5-29). Replace with a dev-only default:

```javascript
// Local dev only — production uses netlify.toml CDN-level redirects (see DOC-415)
if (
  !process.env.NEXT_PUBLIC_ASTRO_URL &&
  !global.NX_GRAPH_CREATION &&
  process.env.NODE_ENV !== 'production'
) {
  process.env.NEXT_PUBLIC_ASTRO_URL = 'https://master--nx-docs.netlify.app';
}
```

**Replace** the current `rewrites()` (lines 73-115) with a dev-only version:

```javascript
async rewrites() {
  // Production rewrites are handled by netlify.toml CDN redirects (DOC-415).
  // Dev-only rewrites let local `nx serve nx-dev` proxy to astro-docs.
  if (process.env.NODE_ENV === 'production') return [];

  const astroDocsUrl = process.env.NEXT_PUBLIC_ASTRO_URL?.replace(/\/$/, '');
  if (!astroDocsUrl) return [];

  return [
    { source: '/docs', destination: `${astroDocsUrl}/docs` },
    { source: '/docs/:path*', destination: `${astroDocsUrl}/docs/:path*` },
    { source: '/llms.txt', destination: `${astroDocsUrl}/docs/llms.txt` },
    { source: '/llms-full.txt', destination: `${astroDocsUrl}/docs/llms-full.txt` },
    { source: '/@fs/:path*', destination: `${astroDocsUrl}/@fs/:path*` },
  ];
},
```

Note: `/.netlify/:path*` is omitted from dev rewrites (edge functions aren't relevant locally).

### 3. Clean up `nx-dev/nx-dev/project.json`

Remove `{ "env": "NEXT_PUBLIC_ASTRO_URL" }` from the `build` target inputs (line 21). The production build no longer depends on this env var.

### 4. Clean up `.nx/workflows/agents.yaml`

Remove `NEXT_PUBLIC_ASTRO_URL: 'https://master--nx-docs.netlify.app'` from `common-env-vars` (line 9). CI runs production builds which skip the dev-only rewrites.

## NOT changing

- **`redirect-rules.js`** (~1200 redirect rules): These are 301 permanent redirects, not 200 rewrites. They return a `Location` header to the client and don't involve internal CDN fetches, so they're unaffected by the outage issue.
- **`netlify/edge-functions/rewrite-framer-urls.ts`**: Framer proxy is a separate edge function, unrelated to this change. It already excludes `/docs/*`.

## Files to modify

| File | Change |
|------|--------|
| `nx-dev/nx-dev/netlify.toml` | Add 5 `[[redirects]]` entries |
| `nx-dev/nx-dev/next.config.js` | Replace env resolution + rewrites with dev-only versions |
| `nx-dev/nx-dev/project.json` | Remove `NEXT_PUBLIC_ASTRO_URL` build input |
| `.nx/workflows/agents.yaml` | Remove `NEXT_PUBLIC_ASTRO_URL` from common-env-vars |

## Verification

After pushing the PR, test on the deploy preview:

```bash
PREVIEW=https://deploy-preview-XXXX--nx-dev.netlify.app

# Docs proxy works
curl -sI "$PREVIEW/docs/getting-started/intro" | head -5
curl -sI "$PREVIEW/docs" | head -5

# LLMs.txt works
curl -sI "$PREVIEW/llms.txt" | head -5
curl -sI "$PREVIEW/llms-full.txt" | head -5

# Marketing pages unaffected
curl -sI "$PREVIEW/" | head -5
curl -sI "$PREVIEW/blog" | head -5

# Existing redirects still work (should 301)
curl -sI "$PREVIEW/getting-started/nx-setup" | head -5
```
