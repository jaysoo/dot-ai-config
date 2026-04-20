# Site Check Report

**Index:** https://master.nx.dev/blog
**Date:** 2026-04-16
**Pages found:** 195 (blog posts + 2 feeds)
**Pages checked:** 50 (default limit)
**Compare:** none

## Summary

| Status | Count |
|--------|-------|
| OK     | 50    |
| Warnings | 0   |
| Errors | 0     |

All 50 sampled blog pages are healthy. No 404s, no broken images, no SEO issues, no raw Markdoc tags, no mixed content, no invalid JSON-LD.

## Index Page (/blog)

- Title, meta description, Open Graph tags, canonical, Twitter card all present
- Single `<h1>` ("All Blogs")
- `robots: noindex, nofollow` — correct for staging
- `canonical: https://nx.dev/blog` — correct (rel-canonical points to production)
- Console errors: 2, both third-party tracking (`reo.dev`, `aplo-evnt.com`) — ignored per policy

## Pages Checked (50)

All pages passed every check. Representative sample:

- nx-2026-roadmap, ai-agents-and-continuity, wrapping-up-2025
- nx-22-3-release, nx-22-1-release, nx-22-release, nx-21-2-release
- s1ngularity-postmortem, creep-vulnerability-build-cache-security
- broadcom-success-story, siriusxm-success-story, ukg-success-story, payfit-success-story, caseware-success-story
- autonomous-ai-workflows-with-nx, making-nx-agent-ready, why-we-deleted-most-of-our-mcp-tools
- integrate-biome-in-20-minutes, git-worktrees-ai-agents, seamless-deploys-with-docker
- (full list: 50 of the 195 `/blog/*` links found on the index)

## False Positives Flagged During Testing

These were investigated and ruled out — documented to save re-investigation later:

1. **"Broken" article images** flagged by Playwright's `naturalWidth === 0` check.
   Verified via `curl -I`: all 9 sampled image URLs return 200. Images are lazy-loaded and below the fold when Playwright runs its eval — they haven't entered the viewport yet. Not a site bug.

2. **Page data appearing to "drift" to neighbor posts** during `browser_evaluate`.
   Two of five agents saw this intermittently. The server-rendered HTML at each URL is correct. Likely a Playwright MCP artifact around Astro's view-transitions / client-side prefetching. Not reproducible with `waitUntil: 'load'`.

3. **Console errors from third-party scripts** (reo.dev, aplo-evnt.com, HubSpot pixel, YouTube iframe Permissions-Policy warnings).
   Ignored per skill policy (third-party tracking/analytics).

## Notes

- All canonical tags point to `https://nx.dev/...` (not `master.nx.dev/...`) — intentional, preview site should not claim canonical over prod.
- `noindex, nofollow` is set site-wide on master.nx.dev — correct.
- No compare-against-prod diff was requested.

## Verdict

`master.nx.dev/blog` is healthy. No actionable issues found in the 50-page sample.
