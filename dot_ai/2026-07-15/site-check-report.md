# nx.dev search penalty-oriented site check

Checked: 2026-07-15 ET  
Index: `https://nx.dev/sitemap.xml`

## Summary

- Checked the HTTP status of all 1,042 sitemap URLs: 1,040 returned 200 and 2 returned 404.
- Audited 60 representative live pages: 20 docs, 20 blog, and 20 marketing pages.
- Checked 360 unique sampled internal destinations: one confirmed 404 and several redirect hops.
- No sampled page had `noindex`, a broken canonical pattern, mixed content, or a broad missing-metadata problem.
- No obvious hacked/spam pages appeared in targeted public index searches.
- Public checks do not establish a Google manual or algorithmic penalty. Search Console Manual Actions and Security Issues are decisive for explicit penalties.

## Highest-priority findings

### 1. Verify Netlify bot challenges do not affect Googlebot

After a modest crawl burst, Netlify returned sitewide 403 JavaScript verification pages. A browser-like request later received 200. A spoofed Googlebot user-agent also received 403, but this does not show that verified Googlebot is blocked because Google crawler verification also uses source IP and DNS.

Actions:

- In Search Console, inspect Crawl Stats response codes and host status around December 2025.
- Run live URL inspection and inspect Google's rendered HTML for `/`, `/docs/getting-started/intro`, `/blog`, `/nx-cloud`, and representative losing URLs.
- Review Netlify security logs for verified Googlebot requests and any 403, 429, or 5xx increase.
- Ensure verified search crawlers bypass JavaScript challenges using IP/DNS verification, not user-agent matching alone.

### 2. Clean the sitemaps

Remove these 404 entries:

- `https://nx.dev/api/banners`
- `https://nx.dev/404`

Remove redirecting source URLs and list only final canonical 200 URLs:

- `https://nx.dev/docs`
- `https://nx.dev/docs/getting-started/nx-cloud`
- `https://nx.dev/docs/getting-started/tutorials/angular-monorepo-tutorial`
- `https://nx.dev/docs/getting-started/tutorials/react-monorepo-tutorial`
- `https://nx.dev/docs/getting-started/tutorials/typescript-packages-tutorial`

The 778 docs URLs all receive the same deployment-time `lastmod`. Emit `lastmod` only for meaningful page changes or omit it.

### 3. Fix confirmed content and rendering defects

- Raw Markdoc is visible on `https://nx.dev/docs/technologies/angular/generators`.
- `https://nx.dev/java` contains React-specific copy and a “Vew Example Project” typo.
- The homepage renders `0.0 million+`, `0%`, and `0M+` statistics after JavaScript settles. Server-render the actual values.
- `https://nx.dev/blog/nx-live-intro-to-nx` uses a YouTube `/live/` iframe that Chrome refuses to frame. Use an `/embed/` or `youtube-nocookie.com` URL.
- `https://nx.dev/labs` is a live internal-link target returning 404.

### 4. Resolve canonical and intent conflicts

- `/demo` returns 200 but canonicalizes to `/contact/sales`, while both are in the sitemap. Redirect `/demo` and remove it from the sitemap, or make it distinct and self-canonical.
- `/solutions/leadership` and `/solutions/management` have the same title. The four role-solution pages share substantial sections. Compare their GSC queries; consolidate pages that own the same intent or give each distinct evidence, examples, FAQs, and internal links.
- Compare old and new Tailwind, React/Vite, and pnpm tutorials by query. Consolidate only where they compete for the same intent; otherwise label supported versions clearly.

### 5. Improve weak page cohorts

- Three indexable media pages have only 60–76 crawlable article words. Add transcripts, summaries, takeaways, speakers, chapters, and referenced resources, or consolidate them into a useful media hub.
- Audit the generated Devkit/API corpus for pages containing only signatures, generic descriptions, and no examples. Generated documentation is not inherently spam; the risk is a large cohort of low-value standalone pages.
- Add machine-readable publication signals to the blog template: `BlogPosting` JSON-LD, `datePublished`, `dateModified`, author, and `<time datetime>`.
- Shorten unusually long blog titles/descriptions and the multiline Angular-generators description to improve snippet clarity and CTR.

## Lower-priority hygiene

- Update sampled internal links that redirect to their final canonical destinations.
- Fix stale deep-link fragments in docs after redirected URLs.
- Use one meaningful H1 per marketing page; several pages render hero fragments and statistics as additional H1s.
- Add missing alt text to meaningful screenshots and sampled YouTube thumbnails.
- Substantiate prominent performance and adoption claims with dated methodology or customer evidence.

## What passed

- All 60 sampled pages initially returned 200.
- Sampled pages were indexable and had titles, descriptions, canonicals, and social metadata.
- Sampled docs had valid JSON-LD; sampled blog posts lacked article structured data but had visible authors and dates.
- All sampled social images returned 200, and all 20 blog social images were at least 1,200 pixels wide.
- No sampled mixed content or invalid structured data was found.

## Interpretation

The defects above can waste crawling, weaken page quality, create query cannibalization, or reduce CTR. None by itself explains a 46% sitewide decline. If Search Console Manual Actions and Security Issues both show green checks, treat the December loss as an algorithmic, crawl-access, indexing, demand, or SERP problem—not a penalty requiring reconsideration.
