# DOC-395: Track Page Views on Server-Side

**Linear Issue:** https://linear.app/nxdev/issue/DOC-395/track-page-views-on-server-side-as-well
**Date:** 2026-02-02
**Status:** Planning

## Goal

Track server-side page views for HTML pages to compare with markdown/LLM traffic, using `server_page_view` event to differentiate from client-side `page_view`.

## Approach

Use **two separate edge functions** for compute efficiency:

1. **`track-asset-requests.ts`** (existing) - handles `.md` and `.txt` files
   - Path-filtered: only runs on `*.txt` and `*.md`
   - Change event name: `page_view` → `server_page_view`
   - Add `content_type` param

2. **`track-page-requests.ts`** (NEW) - handles HTML pages
   - Runs on `/docs/*`
   - Filters by Accept header to skip asset requests
   - Sends `server_page_view` with `content_type: 'text/html'`

## Files to Modify

- [ ] `astro-docs/netlify/edge-functions/track-asset-requests.ts` - update event name
- [ ] `astro-docs/netlify/edge-functions/track-page-requests.ts` - create new
- [ ] `astro-docs/netlify.toml` - add new edge function declaration

## Implementation Details

See full plan: `~/.claude/plans/jazzy-wandering-hamming.md`

### Key Logic: Accept Header Filtering

```typescript
function shouldTrack(request: Request, pathname: string): boolean {
  // Skip files handled by track-asset-requests
  if (pathname.endsWith('.md') || pathname.endsWith('.txt')) return false;

  // Skip asset paths
  if (pathname.includes('/assets/') || pathname.includes('/og/') || pathname.includes('/_')) {
    return false;
  }

  const accept = request.headers.get('accept') || '';

  // Track HTML requests only
  return !accept || accept.includes('text/html') || accept.includes('*/*');
}
```

## Verification

```bash
cd astro-docs && netlify dev

# HTML page - track-page-requests
curl -v http://localhost:8888/docs/getting-started/intro

# Markdown - track-asset-requests
curl -v http://localhost:8888/docs/getting-started/intro.md

# Image request - should NOT track
curl -v -H 'Accept: image/*' http://localhost:8888/docs/getting-started/intro
```

Check GA4 DebugView for `server_page_view` events.
