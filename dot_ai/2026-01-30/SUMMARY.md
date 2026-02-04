# Summary - 2026-01-30

## Completed Tasks

### Lighthouse SPACE Metrics UI Improvement

Improved the metric target legends on the SPACE Metrics page in the Lighthouse Phoenix app.

**Changes:**
- Replaced inline "(green)", "(yellow)", "(red)" text with colored square emojis (🟩 🟨 🟥)
- Added cleaner legend format with Metric and Target on separate lines
- Applied consistent styling across all 4 metrics sections

**PR:** https://github.com/nrwl/lighthouse/pull/29
**Branch:** add-metrics

---

### Leo 1:1 Notes (2026-01-26)

Updated Leo's personnel file with comprehensive 1:1 notes.

**Topics covered:**
- Swedbank onsite review (first-ever client onsite in Lithuania)
- Performance review and L5 career development challenges
- Project delivery improvements and planning process feedback
- AI automation initiatives (Angular upgrade workflow, Claude plugin for Nx)

**Files:** `.ai/para/areas/personnel/leo.md`

---

### DOC-392: Reduce nx-dev Next.js Build Memory Usage Below 8 GB

**Linear**: https://linear.app/nxdev/issue/DOC-392

Fixed the `nx-dev:deploy-build` command which was using 11+ GB memory, exceeding Netlify's 8 GB limit.

**Solution implemented:**
1. Added `experimental: { cpus: 1 }` in `next.config.js` to limit static generation workers
2. Upgraded Next.js from 14.2.28 to 14.2.35
3. Added `NODE_OPTIONS: "--max-old-space-size=4096"` to the deploy-build target
4. Created `netlify.toml` with `@netlify/plugin-nextjs` for proper SSR deployment on Netlify
5. Added `netlify` configurations to build targets in project.json for platform-specific outputs
6. Updated `next-sitemap.config.js` to detect `NETLIFY` env and use correct paths

**Files modified:**
- `nx-dev/nx-dev/next.config.js`
- `nx-dev/nx-dev/project.json`
- `nx-dev/nx-dev/netlify.toml` (new)
- `nx-dev/nx-dev/next-sitemap.config.js`
- `package.json`

**Plan**: `.ai/2026-01-30/tasks/doc-392-netlify-memory-optimization.md`

**Branch**: DOC-392

---

### DOC-380: Docs Layout Whitespace on Large Screens

**Linear**: https://linear.app/nxdev/issue/DOC-380

Addressed excessive whitespace on large screens (>1600px) in the Astro docs layout.

**Approach explored and final solution:**
1. Initially implemented a Vercel docs-style max-width centered layout (100rem/1600px)
   - Header, sidebar, main content, TOC, and footer constrained to max-width
   - Centered on very large screens
2. **Reverted** to simpler approach per user feedback: just push TOC to right edge without max-width constraint
   - Uses `justify-content: space-between` on content flex container
   - TOC stays at right edge on large screens, reducing visual whitespace

**Final solution (global.css):**
```css
@media (min-width: 100rem) {
  .lg\:sl-flex {
    justify-content: space-between;
  }
  .right-sidebar-container {
    flex-shrink: 0;
  }
}
```

**Files modified:**
- `astro-docs/src/styles/global.css` - Added TOC right-alignment styles
- `astro-docs/src/components/layout/PageFrame.astro` - Removed max-width layout (reverted)

**Branch**: DOC-380

---

## Key Learnings

- `experimental.cpus: 1` is effective for reducing Next.js build memory by limiting worker processes
- Webpack `parallelism: 1` actually *increased* memory usage (sequential processing held more in memory)
- Netlify requires `@netlify/plugin-nextjs` for proper Next.js SSR/middleware deployment
- Platform-specific build configurations allow same codebase to deploy to both Vercel and Netlify
- For large-screen layout fixes, simple CSS like `justify-content: space-between` can be more effective than complex max-width centered layouts
- When modifying Starlight layouts, prefer global.css over component-scoped styles for better specificity
