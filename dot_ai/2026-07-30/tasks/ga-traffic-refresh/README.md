# ga-traffic refresh 2026-07-30 (data through 2026-07-29)

Refreshed the nx.dev GA traffic pipeline (`dot_ai/2026-06-19/tasks/ga-traffic/`)
with Jun 19 - Jul 29 2026 data for ALL series (not just the all/home/docs/server
subset of earlier refreshes).

## What was updated

- All 8 GA4 daily raw files (all/home/docs/blog/marketing/nxdev-by-category/server/server-by-category) -> 2026-07-29
- `gsc-daily.json` -> 2026-07-29 (Jun 26-27 overlap matched stored values exactly)
- `monthly-segments.json`: Jun 2026 finalized (83,414 views; was 51,667 partial), Jul 2026 added (76,458 thru Jul 29, partial). Source array updated in `../2026-06-19/tasks/ga-monthly-traffic.mjs`, regenerated via `raw/_gen-monthly.mjs`
- `channels-by-month.json`: 2026-06 finalized + 2026-07 added for all 6 sections
- `gsc-docs-others-daily.json`: intentionally NOT refreshed (AI-data contamination, held at 2026-06-24 per pipeline README)
- top-pages*.json: not refreshed (static reference)
- Reran `process.mjs`: 455 daily rows, 19 monthly rows, 14/14 integrity checks pass

## Scrape method (new, much faster than UI-walking)

GA4 Explore's internal report RPC replayed in-page via Chrome MCP `javascript_tool`:

1. Open any saved exploration (used "Server Page Requests"), wrap `XMLHttpRequest`
   to capture the report request: URL, JSON body, and headers - the
   `X-GAFE4-XSRF-TOKEN` header is REQUIRED (fetch without it = errorCode 3/400).
2. Replay with mutated body: `requests[0].{dimensions,dimensionFilters,metrics,dateRanges,rowAxis}`.
   Internal names: `date`, `page_path`, `hostname`, `event_name`, `month`,
   `session_default_channel_grouping`, metric `screen_page_views` (= Views),
   `event_count`, `active_users`. The "Bot" custom dimension =
   `custom_dimensions_group2_slot_05` (values ''/'false'/'true') - discovered by
   double-clicking it in the UI and capturing the request.
3. GOTCHA: any dimension used in `dimensionFilters` MUST also appear in
   `dimensions` (as `isSecondary: true`) or the API 500s (errorCode 13).
4. Filter shapes: exact = `evaluation: 1`, regex = `evaluation: 5`, negation =
   `complement: true`. Marketing regex from `segment-definitions.json`.
5. Ship results out of the page by POSTing to a localhost receiver
   (`recv.mjs`) - works on analytics.google.com; BLOCKED by CSP on
   search.google.com (GSC data pulled via DOM table read + chunked returns instead).
6. GSC: Performance > Search results, `authuser=1` (jack@nrwl.io), custom range,
   DAYS tab, read `table tr` cells. GSC lags ~1 day but Jul 29 was present.

Files here: `ga4-scrape-2026-07-30.json` (raw RPC results), `gsc-scrape-2026-07-30.json`,
`merge.mjs` (idempotent merge into the pipeline raw files), `recv.mjs` (localhost receiver).

## Findings (Jul 2026)

- GSC organic clicks: Apr 72,581 -> May 66,383 -> Jun 59,022 -> Jul 49,259 thru
  Jul 29 (~52.7K full-month pace). Organic decline CONTINUES ~-11%/mo post-banner;
  no recovery signal yet in the consent-immune forward tracker.
- Client Views (consent-suppressed): Jun 83,414 -> Jul ~76.5K (thru 29) - roughly flat at the post-banner floor.
- server_page_view: Jun 5.39M, Jul 5.06M thru 29 (~5.4M pace) - AI-crawler demand flat/high.
- Server-side blog: 0.8M (Apr) -> 1.49M (May) -> 1.67M (Jun) -> ~1.57M pace Jul; now ~30% of
  server events (docs steady ~2.4M/mo). AI crawlers shifted hard into /blog in May-Jun.
- Overlap re-verification: only 2 days restated (Jun 21/22 home, -1/-3 views) - GA data stable.
