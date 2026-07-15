# Google organic traffic decline assessment

Started: 2026-07-15 10:41 ET

## Goal

Determine whether Google's late-2025/2026 search updates plausibly explain the ~46% organic traffic decline from October 2025, identify the evidence needed to distinguish an algorithmic loss from indexing, demand, SERP, or site issues, and produce prioritized recovery actions for nx.dev docs, marketing, and blog pages.

## Context

- Organic traffic is down about 46% compared with October 2025.
- December 2025 appears to be the main inflection in clicks, impressions, CTR, and average position.
- No known internal change coincided with the decline.
- Relevant surfaces: `/docs`, marketing pages, and blog pages on `nx.dev`.
- Existing DOC-549 work refreshed 11 high-opportunity pages from GSC data; this assessment focuses on the sitewide cause and recovery strategy.

## Plan

- [x] Verify the official Google update timeline and scope.
- [x] Test whether the dates can explain a December 2025 inflection.
- [x] Define a GSC comparison that decomposes clicks into demand, rank, and CTR losses.
- [x] Segment findings by docs, marketing, blog, query intent, device, country, and search appearance.
- [x] Prioritize technical, content, internal-linking, snippet, and consolidation actions.
- [x] Specify validation windows and success measures.

## Guardrails

- Treat update-date correlation as a hypothesis, not proof.
- Do not make broad site changes before identifying losing page/query cohorts.
- Measure Search and Discover separately.
- Prefer official Google documentation for update scope and recovery guidance.

## Findings

### Attribution

- The December 2025 core update ran December 11-29. It is a plausible cause only if the Web Search break starts after December 11 and settles during or shortly after that window.
- The February 2026 update applies to Discover, launched February 5, and cannot cause a December Web Search break. Analyze the Search Console Discover report separately.
- Google did not report a December 2025 spam update. The spam/core/helpful-content documentation pages were batch-updated December 10; that document date is not a ranking event.
- Ahrefs Google-update markers are annotations, not causal attributions. Ahrefs organic traffic is an estimate based on sampled rankings, estimated search volume, and CTR curves. GSC clicks are the source of truth for nx.dev.
- Later core updates ran March 27-April 8 and May 21-June 2, so the time series should be treated as multiple phases if traffic changed again.

### Current technical spot check

- `robots.txt` returns 200 and allows crawling.
- The root sitemap index links to marketing/blog and docs sitemaps.
- Sampled docs and blog pages return self-canonicals and meta descriptions.
- These checks lower the likelihood of a current sitewide crawl block but do not replace Search Console indexing, crawl stats, manual-action, security, and URL-inspection checks.

### Diagnostic comparison

Use Web Search and compare equal 28-day windows:

- Pre-update baseline: 2025-11-13 through 2025-12-10.
- Post-update stable window: 2026-01-06 through 2026-02-02.
- Exclude the December 11-29 rollout and holiday week from the primary causal comparison.
- Also compare current 28 days with October 2025 for total magnitude and inspect separate step changes around the March and May 2026 core updates.

Export daily totals and comparison tables for Pages, Queries, Countries, Devices, and Search Appearance. Repeat with path cohorts for `/docs/`, `/blog/`, and the remaining marketing pages. Export Discover separately.

Interpretation:

- Position and impressions down: ranking/relevance or indexing loss.
- Position stable, impressions down: demand, seasonality, or query-mix change.
- Impressions and position stable, CTR down: SERP presentation, title/snippet, or zero-click/AI-feature pressure.
- Indexed pages/crawl errors change: technical issue.
- A small number of pages explain most lost clicks: page/intent problem, not sitewide quality.

### Prioritized actions

1. Rule out manual actions, security issues, indexing loss, canonical drift, crawl/server failures, and redirect errors.
2. Build a loss-concentration table by page/query cohort. Work from clicks lost, then split the cause into rank, demand, and CTR.
3. For docs, select one primary page per intent, consolidate near-duplicates, refresh stale version-specific instructions, add first-hand runnable examples, and strengthen hub-to-task internal links.
4. For marketing pages, replace generic feature copy with evidence: customer outcomes, benchmarks with methodology, product screenshots/workflows, and clear intent ownership.
5. For blog, separate evergreen search pages from timely Discover candidates; add clear authorship, update or consolidate outdated tutorials, and verify large representative images plus `max-image-preview:large`.
6. Avoid blanket rewrites or deletion. Google recommends meaningful, durable improvements and calls deletion a last resort.

### Recovery expectation

- Technical/indexing issues: usually the most directly recoverable once fixed and recrawled.
- Core-update ranking losses: materially recoverable when affected pages become more useful than competing results, but there is no guaranteed percentage or rollback; effects may take days to several months and sometimes another core update.
- CTR/zero-click or demand loss: only partly recoverable through stronger snippets, differentiated assets, and adjacent demand capture.
- Spam-system loss: recovery requires policy compliance and may take months; removed link-spam benefit cannot be restored.
- Discover loss: volatile and only relevant to the Discover report, primarily blog/editorial content.

Research phase complete. Exact attribution and a page-level backlog require the GSC exports above.

## Penalty-oriented live audit — 2026-07-15

- Checked all 1,042 sitemap URLs: 1,040 returned 200; `/api/banners` and `/404` returned 404.
- Sampled 20 docs, 20 blog, and 20 marketing pages. No broad `noindex`, canonical, metadata, HTTPS, image, or structured-data failure was found.
- Public index checks found no obvious hacked/spam pages. An explicit penalty can only be confirmed in Search Console Manual Actions or Security Issues.
- Netlify served 403 JavaScript verification challenges after a modest crawl burst. This does not prove verified Googlebot is blocked, but GSC Crawl Stats, live rendered URL inspection, and Netlify crawler logs are the top technical checks.
- Confirmed defects include raw Markdoc on Angular generators, React copy on `/java`, zero-valued homepage statistics, a broken blog video embed, a `/labs` 404, two 404 sitemap entries, five redirecting sitemap URLs, deployment-time `lastmod` values, and `/demo` canonicalizing to `/contact/sales` while both appear in the sitemap.
- Quality hypotheses to validate in GSC include overlapping role-solution pages, competing old/new tutorials, three 60–76-word media pages, and generated API pages with generic descriptions and no examples.
- Detailed report: `.ai/2026-07-15/site-check-report.md`.
