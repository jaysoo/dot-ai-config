# Summary - 2026-01-27

## Completed

### DOC-389: Content Negotiation for LLM-Friendly Docs Access

**Linear**: https://linear.app/nxdev/issue/DOC-389

Enhanced the Netlify edge function to support HTTP content negotiation. When a client explicitly requests markdown via `Accept: text/markdown` header, the edge function rewrites to serve the `.md` version directly (no redirect).

**Changes:**
- Modified `astro-docs/netlify/edge-functions/add-link-headers.ts`:
  - Added content negotiation: explicit `Accept: text/markdown` serves `.md` content
  - Uses Netlify rewrite (URL object return) instead of redirect for single-request response
  - Updated return type to `Promise<Response | URL>`

**Behavior:**
- `curl -H "Accept: text/markdown" https://nx.dev/docs/getting-started/intro` → serves markdown content directly
- Browser requests → HTML with Link headers (unchanged)

**Design decisions:**
- Explicit opt-in (`text/markdown`) rather than implicit (`!text/html`) - more intentional
- Rewrite instead of redirect - works with all HTTP clients, single request

**Commit:** `56aacac256` - feat(nx-dev): content negotiation for LLM-friendly docs access

---

### DOC-236: Support Markdown, llms.txt, and llms-full.txt

**Linear**: https://linear.app/nxdev/issue/DOC-236

Implemented LLM-friendly resource discovery for Nx documentation following the llmstxt.org specification.

**Changes:**
- Created `/docs/llms-full.txt` endpoint - concatenates all documentation (~2.87MB, 503 pages) for LLM consumption
- Created `add-link-headers.ts` Netlify edge function - adds HTTP Link headers to docs pages advertising:
  - `.md` alternate version of current page
  - `/docs/llms.txt` (documentation index)
  - `/docs/llms-full.txt` (full concatenated docs)
- Edge function only processes requests with `Accept: text/html` header to minimize costs
- Added nx-dev rewrite for `/llms-full.txt` to proxy to astro-docs
- Fixed trailing slash normalization in nx-dev rewrites to prevent double slashes

**Files:**
- `astro-docs/src/pages/llms-full.txt.ts` (NEW)
- `astro-docs/netlify/edge-functions/add-link-headers.ts` (NEW)
- `astro-docs/netlify.toml` (MODIFIED)
- `nx-dev/nx-dev/next.config.js` (MODIFIED)

**Commit:** `6fb48d340d` - feat(nx-dev): add llms-full.txt and HTTP Link headers for LLM discovery

### Bug Fixes

**Fixed Netlify Edge Function Immutable Response Issue**

Graphite Agent identified that Netlify Edge Function responses are immutable - `response.headers.set()` doesn't work. Fixed both edge functions to create new Response objects with modified headers:
- `astro-docs/netlify/edge-functions/add-link-headers.ts`
- `astro-docs/netlify/edge-functions/track-asset-requests.ts`

**Key Learning:** Netlify Edge Function responses from `context.next()` are immutable. Must create a new Response object with cloned headers instead of mutating `response.headers`.

**Status:** ✅ Included in commit `6fb48d340d`
