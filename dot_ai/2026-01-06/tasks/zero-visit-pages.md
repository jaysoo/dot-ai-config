# Zero Visit Pages Analysis (90 Day Period)

These documentation pages from nx.dev/docs exist in the llms.txt sitemap but had **zero visits** in Google Analytics over the last 90 days.

**Analysis Date:** 2026-01-06
**Total Pages in llms.txt:** 649
**Pages with at Least 1 Visit:** 648
**Pages with Zero Visits:** 1

## Summary

Almost all legitimate documentation pages received at least some traffic over the 90-day period. Only 1 page from the official llms.txt sitemap had zero recorded visits.

## Pages with No Traffic

### /docs/reference/devkit/

- `/docs/reference/devkit/` (index/landing page)

## Notes

- The analytics CSV contained 934 unique paths, but many were:
  - Malformed URLs (typos, search queries appended to paths)
  - Old/redirected URL patterns
  - Non-existent paths users attempted to access

- The llms.txt represents the current canonical documentation structure (649 pages)

- The `/docs/reference/devkit/` page is the Devkit API reference index page. Users likely navigate directly to specific API pages (like `ProjectConfiguration`, `Tree`, etc.) rather than landing on the index first.

## Low Traffic Pages (For Reference)

While almost all pages had *some* traffic, the following legitimate pages had very low traffic (under 20 visits over 90 days):

- `/docs/reference/deprecated/affected-graph` - 15 visits
- `/docs/reference/deprecated/workspace-generators` - 15 visits
- `/docs/reference/deprecated/runtime-cache-inputs` - 14 visits
- `/docs/reference/deprecated/v1-nx-plugin-api` - 13 visits
- `/docs/technologies/java/migrations` - 12 visits
- `/docs/technologies/build-tools/docker/migrations` - 10 visits
- `/docs/technologies/build-tools/rollup/migrations` - 10 visits
- `/docs/technologies/test-tools/playwright/migrations` - 9 visits
- `/docs/reference/deprecated/workspace-executors` - 8 visits
- `/docs/technologies/dotnet/migrations` - 8 visits
- `/docs/technologies/build-tools/rsbuild/migrations` - 6 visits

These are primarily:
1. **Deprecated documentation pages** - naturally low interest
2. **Migration guides for niche plugins** - only relevant during version upgrades
