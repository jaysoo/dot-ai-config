---
name: site-checker
description: Check website pages from an index URL for broken links, missing images, SEO issues, and console errors. Crawls <a href> links from the index page (shallow, no recursion) and validates each. Supports localhost, preview deploys, staging, and production. Optional compare mode diffs DOM against a reference URL.
triggers:
  - "check site"
  - "check pages"
  - "check blog"
  - "check docs"
  - "site check"
  - "page check"
  - "broken links"
  - "broken images"
  - "validate pages"
  - "site health"
  - "check 404"
  - "pages ok"
  - "all pages working"
---

# Site Checker

Validate all pages reachable from an index URL. Checks HTTP status, broken media, SEO tags, accessibility basics, and console errors.

## Arguments

The user provides:
- **Index URL** (required): e.g., `http://localhost:4321/blog`, `https://nx.dev/docs`, `https://deploy-preview-123--nx-dev.netlify.app/blog`
- **Limit** (optional): max pages to check, default 50
- **Compare URL** (optional): base URL of a reference site to diff DOM against (e.g., `https://nx.dev` when checking a preview deploy)
- **Path filter** (optional): only follow links matching this prefix. Defaults to the path of the index URL.

## Process

### Phase 1: Extract Links from Index Page

1. Navigate to the index URL using Playwright MCP:
   ```
   mcp__playwright__browser_navigate({ url: INDEX_URL })
   mcp__playwright__browser_snapshot()
   ```

2. Extract all `<a href>` links from the page using `browser_evaluate`:
   ```javascript
   mcp__playwright__browser_evaluate({
     expression: `JSON.stringify(
       [...document.querySelectorAll('a[href]')]
         .map(a => new URL(a.href, document.baseURI).href)
         .filter((v, i, arr) => arr.indexOf(v) === i)
     )`
   })
   ```

3. Filter links:
   - **Same origin only** — must match the index URL's origin (no external links)
   - **Path prefix** — must start with the base path (e.g., `/blog/`) unless user specified a different filter
   - **Deduplicate** — remove query params and fragments for uniqueness
   - **Exclude anchors** — skip `#`-only links
   - **Apply limit** — cap at the user's limit (default 50)

4. Report: "Found N links matching `<prefix>` on `<index URL>`. Checking M pages (limit: L)."

### Phase 2: Check Each Page

Spawn **parallel subagents** (up to 5 at a time) to check pages concurrently. Each agent checks one page using Playwright MCP.

For each page URL, perform ALL of the following checks:

#### Check 1: HTTP Status
- Navigate to the URL with `mcp__playwright__browser_navigate`
- Record final status. A page is OK if it loads without a network error.
- If the page shows a 404/error page, flag it.
- Record any redirect chains (the page navigated away from the expected URL).

#### Check 2: Broken Media
Use `browser_evaluate` to check all media elements:
```javascript
mcp__playwright__browser_evaluate({
  expression: `JSON.stringify({
    images: [...document.querySelectorAll('img')].map(img => ({
      src: img.src,
      alt: img.alt,
      broken: !img.complete || img.naturalWidth === 0
    })),
    videos: [...document.querySelectorAll('video source, video[src]')].map(v => ({
      src: v.src || v.getAttribute('src')
    })),
    pictures: [...document.querySelectorAll('picture source')].map(s => ({
      srcset: s.srcset
    }))
  })`
})
```
- Flag any image where `broken === true`
- Flag images with empty or missing `src`
- Flag images missing `alt` attribute (accessibility)

#### Check 3: SEO Tags
Use `browser_evaluate`:
```javascript
mcp__playwright__browser_evaluate({
  expression: `JSON.stringify({
    title: document.title,
    metaDesc: document.querySelector('meta[name="description"]')?.content || null,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content || null,
    ogDesc: document.querySelector('meta[property="og:description"]')?.content || null,
    ogImage: document.querySelector('meta[property="og:image"]')?.content || null,
    ogUrl: document.querySelector('meta[property="og:url"]')?.content || null,
    canonical: document.querySelector('link[rel="canonical"]')?.href || null,
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.content || null,
    h1Count: document.querySelectorAll('h1').length,
    h1Text: document.querySelector('h1')?.textContent?.trim() || null,
    robots: document.querySelector('meta[name="robots"]')?.content || null
  })`
})
```

Flag if:
- Missing `<title>` or it's empty
- Missing `meta[name="description"]`
- Missing `og:title`, `og:description`, or `og:image`
- `og:image` URL returns 404 (verify with a fetch)
- Missing `canonical` link
- `h1` count is not exactly 1
- `og:url` doesn't match the current page URL

#### Check 4: Console Errors
Check for JavaScript errors after page load:
```
mcp__playwright__browser_console_messages()
```
- Flag any messages with level `error`
- Ignore common benign errors (e.g., favicon.ico 404, third-party analytics)

#### Check 5: Internal Link Health
Use `browser_evaluate` to extract all internal links on the page:
```javascript
mcp__playwright__browser_evaluate({
  expression: `JSON.stringify(
    [...document.querySelectorAll('a[href]')]
      .map(a => new URL(a.href, document.baseURI))
      .filter(u => u.origin === location.origin)
      .map(u => u.pathname)
      .filter((v, i, arr) => arr.indexOf(v) === i)
  )`
})
```
- Do NOT follow these (that would be recursion) — just log them for awareness
- If any link visually appears broken (e.g., empty href, `javascript:void`), flag it

#### Check 6: Mixed Content
On HTTPS pages, flag any resources loaded over HTTP:
```javascript
mcp__playwright__browser_evaluate({
  expression: `JSON.stringify(
    [...document.querySelectorAll('[src], [href], [srcset]')]
      .map(el => el.src || el.href || el.srcset)
      .filter(url => typeof url === 'string' && url.startsWith('http://'))
  )`
})
```

#### Check 7: Structured Data
```javascript
mcp__playwright__browser_evaluate({
  expression: `JSON.stringify(
    [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map(s => { try { JSON.parse(s.textContent); return { valid: true }; } catch(e) { return { valid: false, error: e.message, content: s.textContent.slice(0, 200) }; }})
  )`
})
```
- Flag invalid JSON-LD

### Phase 3: Compare Mode (Optional)

Only run if the user provides a compare URL (e.g., "compare against prod").

For each page that was checked:
1. Derive the equivalent URL on the reference site (same path, different origin)
2. Navigate to both pages
3. Extract the main content area DOM structure:
   ```javascript
   mcp__playwright__browser_evaluate({
     expression: `document.querySelector('main, article, [role="main"], .content')?.innerHTML || document.body.innerHTML`
   })
   ```
4. Compare:
   - **Tag structure**: Are the same HTML elements present? Flag missing/extra elements.
   - **Broken Markdoc**: Look for raw `{% %}` text visible in the page content (indicates unprocessed Markdoc tags)
   - **Content presence**: Major text blocks should exist in both versions
   - **Image count**: Same number of images in content area

Report differences as:
- **CRITICAL**: Raw Markdoc tags visible, entire sections missing, content significantly shorter
- **WARNING**: Minor structural differences, different class names (expected with redesigns)
- **INFO**: Cosmetic differences, additional wrapper elements

### Phase 4: Report

Generate a markdown report with two outputs:
1. **Inline in conversation** — summary table + failures only
2. **File at `.ai/<today's date>/site-check-report.md`** — full details

#### Report Format

```markdown
# Site Check Report

**Index:** <URL>
**Date:** <date>
**Pages checked:** N / M found
**Compare:** <reference URL or "none">

## Summary

| Status | Count |
|--------|-------|
| OK     | N     |
| Warnings | N   |
| Errors | N     |

## Errors

### <page URL>
- **[STATUS]** Page returned 404
- **[IMAGE]** Broken image: `<src>`
- **[SEO]** Missing og:title
- ...

## Warnings

### <page URL>
- **[SEO]** Missing meta description
- **[A11Y]** Image missing alt: `<src>`
- **[CONSOLE]** JS error: `<message>`
- ...

## Compare Differences (if applicable)

### <path>
- **[CRITICAL]** Raw Markdoc tag visible: `{% tabs %}`
- **[WARNING]** Section "Getting Started" has 3 fewer paragraphs
- ...
```

#### Severity Classification

| Severity | Criteria |
|----------|----------|
| **ERROR** | 404/5xx status, broken images in content, missing og:image that 404s |
| **WARNING** | Missing SEO tags, missing alt text, console errors, redirect chains |
| **INFO** | Minor issues, cosmetic compare differences |

## Important Notes

- **Never follow external links** — only same-origin URLs
- **Shallow crawl only** — only visit pages linked from the index, don't recurse
- **Respect limits** — default 50 pages, user can override
- **Parallel execution** — use up to 5 subagents for page checks to speed things up
- **Don't cache** — each check should be a fresh page load
- **Report promptly** — show inline summary as soon as checks complete, then write the file
- When running on localhost, the user must have the dev server running. If navigation fails, remind them to start it.
- Netlify preview URLs look like `https://deploy-preview-NNN--SITE.netlify.app/`
- For `og:image` validation, use WebFetch to check the image URL returns 200
