# Summary — 2026-04-01

## DOC-466: Add Tutorial Series ToC to Tutorial Pages

**PR**: https://github.com/nrwl/nx/pull/35120
**Status**: PR open, awaiting deploy preview rebuild

Added a "Tutorial Series" table of contents to all 8 tutorial pages in `astro-docs/`. The ToC uses a Starlight `{% aside %}` tag with a numbered list — no custom components needed.

### Key decisions
- **ToC placement**: After the intro paragraph(s), not at the very top. The intro hooks the reader first, then the ToC shows where they are in the series.
- **No custom component**: Initially built a `TutorialNav.astro` component with auto-detection of current page, but scrapped it in favor of a manual ordered list inside an existing `{% aside %}` tag. Simpler, no config changes.
- **Prerequisites as plain paragraphs**: Converted all prerequisite blocks from `{% aside %}` to regular paragraphs for a cleaner, less noisy layout.
- **Formatting fix**: Self-healing CI added a blank line after `{% aside %}` and indented `{% /aside %}`, breaking Markdoc parsing. Fixed by ensuring a blank line *before* `{% /aside %}` (not after the opening tag) so the formatter leaves it alone.

### Files changed
- 8 tutorial `.mdoc` files in `astro-docs/src/content/docs/getting-started/Tutorials/`

## Nx Build Cache Input/Output Misalignment Bug (CNW/CNP)

**Worktree**: `/Users/jack/projects/nx-worktrees/debug-cache`

Discovered that source file changes weren't invalidating the `build` cache for `create-nx-workspace` and `create-nx-plugin` when locally publishing.

- **Root cause**: Commit `6522c2344f` (Mar 25) added `"inputs": ["copyReadme"]` to the `build` target of 34 packages, overriding `targetDefaults` inputs (`["production", "^production"]`)
- **Why only CNW/CNP broke**: The stale cache only causes damage when `build`'s declared `outputs` overlap with `build-base`'s outputs. CNW and CNP list their bin `.js` file as a `build` output (because `replace-versions.js` modifies it). On cache hit, Nx restores the old `.js` over `build-base`'s fresh compile. The other 32 packages only output `README.md`, so `build-base`'s fresh JS survives
- **Fix**: Used `dependentTasksOutputFiles` as input (not the `.ts` source) since `build` reads the compiled `.js` from `build-base`, not the source directly. Also resolves sandbox violations
- **Files**: `packages/create-nx-workspace/project.json`, `packages/create-nx-plugin/project.json`
- **Notes**: `/tmp/notes.txt` has detailed writeup of the cache mechanics

## Created `nx-config-cache-check` Skill

New Claude Code skill that validates Nx project config changes for cache input/output misalignments. Auto-triggers when `project.json`, `package.json` targets, or `nx.json` targetDefaults/namedInputs are modified. Also updated `review-pr` command to invoke this skill when config files are in a PR diff.

- **Files**: `dot-ai-config/dot_claude/skills/nx-config-cache-check/SKILL.md`, `dot-ai-config/dot_claude/commands/review-pr.md`

## Updated Memory: NX_NO_CLOUD Local Publish

Originally thought `NX_NO_CLOUD=true` was needed for local publishing (from Mar 30 session). Tested without it and it worked — the issue was stale cache from the bug above, not cloud-specific.

## API Key Rotation (Supabase + OpenAI)

Rotated potentially leaked API keys for the nx.dev AI chat (Nx Assistant).

- **Supabase**: Migrated from legacy JWT-based keys to new publishable/secret key system. Updated `NX_NEXT_PUBLIC_SUPABASE_URL` and `NX_SUPABASE_SERVICE_ROLE_KEY` env vars in deployment.
- **OpenAI**: Rotated `NX_OPENAI_KEY` — after redeployment, AI chat showed "quota exceeded" error, likely the new key's org has a billing/credits issue (or old key was updated in deployment but not the new one).
- **Status**: Supabase keys updated; OpenAI key needs billing verification on platform.openai.com.
- **Security follow-up**: Discussed scanning shell history/rc files for leaked secrets (`grep -rE` patterns, trufflehog, gitleaks) and enforcing 1Password `op` usage across the team.

## DOC-463: Match Framer Header and Footer

**Worktree**: `/Users/jack/projects/nx-blog-worktrees/DOC-463`
**Status**: Complete, squashed to single commit, ready for PR

Pixel-matched the blog header and footer to the Framer site (nx.dev) so users don't see a jarring shift when navigating between them.

### Header
- Matched exact layout: `max-w-[1200px] px-16`, Inter font, `letter-spacing: -0.28px`, `gap-[22px]`, 5px separator containers with 1px centered lines
- Height: `h-[60px]` matching Framer exactly
- Button heights: `leading-[1.2]` for 32.8px matching Framer's inner line-height
- Dark mode: `text-white/70` nav, zinc-50 Try button, zinc-500 Contact border
- Added hover dropdown menus for Solutions (2-col grid with icons/descriptions) and Resources (4-col: Learn, Medias, Company, Subscribe)
- Dropdowns constrained to ~1000px centered, positioned relative to sticky header

### Footer
- Updated from 4 to 5 columns matching Framer: Quick Links, Solutions, Products, Resources, Company
- Icon-based theme switcher (sun/moon/monitor)
- Copyright bar with Privacy Policy and Terms links
- Removed opacity hover effect

### Root
- Added Inter font via Google Fonts with preconnect

### Verification approach
- Used Playwright to extract exact computed styles from Framer (colors, positions, font properties)
- Used ImageMagick difference compositing to verify pixel alignment
- Iterated through multiple rounds of comparison until nav items within 0-0.1px

## DOC-465: Build-Time Image Optimization for Blog

**PR**: https://github.com/nrwl/nx-blog/pull/1
**Worktree**: `/Users/jack/projects/nx-blog-worktrees/DOC-465`
**Status**: PR open, Netlify deploy preview green (5m15s build)

Added automatic responsive image optimization to the blog using sharp at build time.

### What was built
- **`scripts/optimize-images.mjs`**: Walks `public/blog/images/` (1064 source images), generates responsive WebP variants at 640w, 1280w, and original size. 8x parallelism with content-hash caching. ~60s locally, ~2-3min on Netlify.
- **`src/utils/image.ts`**: `pictureHtml()` for Markdoc HTML rendering + `getOptimizedImage()` for React components. Reads build-time manifest.
- **`src/components/Image.tsx`**: React `<Image>` component for cover images with `<picture>`/`srcset`/`sizes`.
- **Markdoc wiring**: `content.ts` intercepts `<img>` tags for `/blog/images/` and emits `<picture>` elements automatically.
- **Nx task pipeline**: Build split into discrete cacheable targets: `build → postbuild → vite-build → [prebuild, optimize-images]` (config in blog's `package.json` `"nx"` field, not global `nx.json`).

### Key decisions
- **WebP-only, no AVIF**: AVIF encoding is 5-10x slower than WebP. Dropping AVIF cut build time from 8+ min to ~5 min on Netlify. WebP has 97%+ browser support.
- **2 breakpoints (640w, 1280w)** instead of 3: Fewer variants = faster build, sufficient for blog content area (`max-w-3xl` = 768px).
- **sharp via optionalDependencies**: No postinstall scripts — sharp uses `@img/sharp-{platform}` optional deps for native binaries.
- **Manifest approach**: Prebuild script generates `src/lib/image-manifest.json` (583KB raw, 60KB gzipped) consumed by both server-side Markdoc rendering and client-side React hydration.

### Also fixed: Broken media paths across 15 blog posts
Discovered that mp4 videos and testimonial headshots referenced `/documentation/blog/media/...` and `/documentation/blog/images/...` paths that only existed on the old Next.js app (nx.dev). On the standalone blog, these all 404'd.
- Copied 12 mp4 files, 1 gif, and 6 headshot images from `~/projects/nx/nx-dev/nx-dev/public/documentation/` into `public/blog/media/` and `public/blog/images/`
- Updated all 15 blog posts: replaced `/documentation/blog/` → `/blog/`

### Filed follow-up
- **DOC-469**: Testimonial Markdoc tag missing image and styled layout — the `{% testimonial %}` tag renders as plain blockquote without the headshot image. Affects 6 customer story posts.

## Other
- Updated `CLAUDE.md` to use `Closes #ISSUE_NUMBER` instead of `Fixes #ISSUE_NUMBER` (not yet committed — local only).
