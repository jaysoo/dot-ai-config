# Spec: nx-blog — Standalone Blog & Changelog Site

**Date:** 2026-03-25
**Status:** Ready for implementation
**Owner:** DevRel team

## Overview

Extract the Nx blog (`docs/blog/`) and changelog (`docs/changelog/`) from the `nx` monorepo into a standalone Astro site (`nx-blog`). The site is served behind a Netlify reverse proxy so it appears as part of `nx.dev`. This decouples content publishing from the Nx CI/CD pipeline and removes the need for code reviews, enabling devrel to publish faster.

## Goals

- **Zero-indirection DX**: `astro dev` just works — no copy scripts, no watchers, no preprocessing
- **AI-friendly authoring (AX)**: Fast HMR feedback loop so AI agents can write `.mdoc`, verify, and iterate autonomously
- **Minimal complexity**: Ship the simplest thing that works. DevRel adds what they need later.
- **1:1 content migration**: Existing `.md` files rename to `.mdoc`, same Markdoc syntax, minimal content changes

## Architecture

### Repo Structure

```
nx-blog/
├── .mise.toml                    # Node 24
├── nx.json                       # Nx for task running (test, lint, etc.)
├── package.json                  # pnpm workspace root
├── pnpm-workspace.yaml
├── CLAUDE.md                     # Minimal — how to create posts, run dev, available tags
├── apps/
│   └── blog/
│       ├── package.json
│       ├── astro.config.mjs
│       ├── netlify.toml          # Build config for this site
│       ├── src/
│       │   ├── content/
│       │   │   ├── config.ts     # Content collection schemas (strict Zod validation)
│       │   │   ├── blog/         # .mdoc files (migrated from docs/blog/)
│       │   │   ├── changelog/    # .mdoc files (migrated from docs/changelog/)
│       │   │   └── authors/      # Individual author .json files
│       │   ├── assets/
│       │   │   └── blog/images/  # NEW images go here (Astro-optimized)
│       │   ├── components/
│       │   │   ├── layout/       # Header, Footer, BaseLayout
│       │   │   ├── blog/         # BlogCard, BlogList, TagFilter, EpisodePlayer, etc.
│       │   │   └── markdoc/      # Markdoc tag renderers (Astro + React islands)
│       │   ├── markdoc/
│       │   │   └── tags.ts       # Markdoc tag definitions
│       │   ├── layouts/
│       │   │   ├── BaseLayout.astro
│       │   │   ├── BlogPost.astro
│       │   │   └── Changelog.astro
│       │   └── pages/
│       │       ├── blog/
│       │       │   ├── index.astro       # Blog listing with tag filter + Pagefind search
│       │       │   └── [...slug].astro   # Blog post detail
│       │       ├── changelog.astro       # Changelog page
│       │       └── blog/
│       │           ├── rss.xml.ts        # RSS feed
│       │           └── atom.xml.ts       # Atom feed
│       └── public/
│           └── blog/images/              # Legacy images (static, unoptimized)
```

### Tech Stack

| Layer           | Choice                                   | Rationale                                               |
| --------------- | ---------------------------------------- | ------------------------------------------------------- |
| Framework       | Astro                                    | Static site, HMR, Markdoc integration, simple           |
| Content         | Markdoc (`.mdoc`) via `@astrojs/markdoc` | 1:1 migration from existing content                     |
| Styling         | Tailwind CSS                             | Matches current nx.dev look                             |
| Search          | Pagefind                                 | Static index, no third-party dependency                 |
| Package manager | pnpm                                     | Consistent with Nx ecosystem                            |
| Task runner     | Nx                                       | For tests, Vale linting (future)                        |
| Node            | 24 (via mise)                            | `.mise.toml` at repo root                               |
| Hosting         | Netlify                                  | Auto-deploy on push to `main`                           |
| Components      | Astro-first, React islands where needed  | Copy React components initially, convert to Astro later |

### Content Collections (Strict Schema)

```typescript
// src/content/config.ts
import { defineCollection, z, reference } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    authors: z.array(z.string()), // References to authors collection
    description: z.string(),
    date: z.coerce.date().optional(), // Falls back to filename date
    cover_image: z.string().nullable().optional(),
    tags: z.array(z.string()).default([]),
    published: z.boolean().default(true),
    pinned: z.boolean().optional(),
    draft: z.boolean().optional(),

    // Media embeds
    youtubeUrl: z.string().url().optional(),
    podcastYoutubeId: z.string().optional(),
    podcastSpotifyId: z.string().optional(),
    podcastAppleUrl: z.string().url().optional(),
    podcastAmazonUrl: z.string().url().optional(),
    podcastIHeartUrl: z.string().url().optional(),

    // Special content
    registrationUrl: z.string().url().optional(),
    metrics: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .optional(),
    hideCoverImage: z.boolean().optional(),
    reposts: z.array(z.string()).optional(),
  }),
});

const changelog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    version: z.string(),
    date: z.coerce.date(),
    patches: z.array(z.string()).default([]),
  }),
});

const authors = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    image: z.string(),
    twitter: z.string().optional(),
    github: z.string().optional(),
  }),
});

export const collections = { blog, changelog, authors };
```

### Markdoc Tags to Implement

These 13 components are the only custom tags used in blog/changelog content:

| Tag                  | Type           | Files Using | Component                                        |
| -------------------- | -------------- | ----------- | ------------------------------------------------ |
| `youtube`            | Self-closing   | 78          | `<iframe>` embed                                 |
| `callout`            | Block wrapper  | 52          | Styled alert box (type: note/tip/caution/danger) |
| `toc`                | Self-closing   | 45          | Auto-generated table of contents                 |
| `cards` + `card`     | Wrapper + item | 42          | Grid layout with linked cards                    |
| `call-to-action`     | Self-closing   | 38          | CTA button/block                                 |
| `video-player`       | Self-closing   | 9           | Video embed                                      |
| `tweet`              | Self-closing   | 8           | Twitter embed `<iframe>`                         |
| `testimonial`        | Self-closing   | 7           | Quote block with attribution                     |
| `command`            | Self-closing   | 7           | CLI command display                              |
| `github-repository`  | Self-closing   | 5           | GitHub repo card                                 |
| `tabs` + `tab`       | Wrapper + item | 4           | Tabbed content (React island)                    |
| `install-nx-console` | Self-closing   | 1           | NxConsole install prompt                         |
| `link-card`          | Self-closing   | 1           | Card with link                                   |

**Strategy:** Copy existing React components as islands initially. Convert to pure Astro components as a follow-up cleanup.

### Image Handling

| Scenario                   | Location                  | Optimization                                                |
| -------------------------- | ------------------------- | ----------------------------------------------------------- |
| Legacy images (migration)  | `public/blog/images/`     | None — served as static files                               |
| New images (going forward) | `src/assets/blog/images/` | Astro `<Image>` component — resized, converted, lazy-loaded |

Image paths in migrated `.mdoc` files reference `/blog/images/...` and are served from `public/`. New posts should use relative imports from `src/assets/` for optimization.

### Blog Listing Features

- **Tag filtering**: Category pills (Customer Stories, Webinars, AI, Releases, Tutorials, Livestreams) — client-side filter
- **Pinned posts**: Appear at the top of the list
- **Sort order**: Pinned first, then newest date
- **Search**: Pagefind — static index built at build time
- **Pagination**: Standard page-based

### Feeds

- **RSS**: `/blog/rss.xml` — use `@astrojs/rss`
- **Atom**: `/blog/atom.xml` — custom endpoint

### Layout Chrome

Header and footer are duplicated from `nx.dev` as Astro components. These rarely change, so drift is acceptable. A shared component library is a future optimization.

## Netlify Configuration

### nx-blog repo (`apps/blog/netlify.toml`)

```toml
[build]
  command = "pnpm --filter blog build"
  publish = "apps/blog/dist"

[build.environment]
  NODE_VERSION = "24"
```

- Push to `main` = production deploy
- Branch pushes / PRs = deploy previews (no approval required)

### nx-dev repo (reverse proxy — separate PR)

Add rewrite rules to the existing `nx.dev` Netlify config:

```toml
[[redirects]]
  from = "/blog/*"
  to = "https://nx-blog.netlify.app/blog/:splat"
  status = 200

[[redirects]]
  from = "/changelog"
  to = "https://nx-blog.netlify.app/changelog"
  status = 200

[[redirects]]
  from = "/changelog/*"
  to = "https://nx-blog.netlify.app/changelog/:splat"
  status = 200
```

These are 200-level rewrites (reverse proxy), not redirects — the user's URL stays as `nx.dev/blog/...`.

## Content Migration Plan

### Step 1: File Migration Script

```bash
# Blog posts: rename .md → .mdoc
for f in docs/blog/*.md; do
  cp "$f" "apps/blog/src/content/blog/$(basename "${f%.md}.mdoc")"
done

# Changelog: rename .md → .mdoc
for f in docs/changelog/*.md; do
  cp "$f" "apps/blog/src/content/changelog/$(basename "${f%.md}.mdoc")"
done

# Images: copy to public/
cp -r docs/blog/images/ apps/blog/public/blog/images/
cp -r docs/blog/media/ apps/blog/public/blog/media/

# Authors: split authors.json into individual files
# (script to iterate authors.json and write individual .json files)
```

### Step 2: Frontmatter Adjustments

- Verify all 193 posts pass strict schema validation during `astro dev`
- Fix any posts with missing required fields
- Image paths: verify `/blog/images/...` resolves from `public/`

### Step 3: Changelog Frontmatter

Changelog files currently have no frontmatter. Add frontmatter with `title`, `version`, `date`, and `patches` to each file. This can be scripted from the existing `ChangelogApi` logic that derives version info from filenames.

## Cutover Plan

| Step | Action                                                            | Verification                                   |
| ---- | ----------------------------------------------------------------- | ---------------------------------------------- |
| 1    | Create `nx-blog` repo, build Astro site with all migrated content | Site builds, all posts render correctly        |
| 2    | Deploy to Netlify                                                 | Verify at `nx-blog.netlify.app`                |
| 3    | Add reverse proxy rules in nx-dev repo                            | Use nx-dev **preview deploy** to verify        |
| 4    | Verify `/blog/*` and `/changelog` work through `nx.dev` preview   | All posts, images, feeds, search work          |
| 5    | Merge proxy rules to nx-dev `main`                                | Production cutover                             |
| 6    | Update nx-dev README to reference nx-blog repo                    | Document the split                             |
| 7    | (~1 week bake period) Delete blog/changelog from nx repo          | Cleanup PR after confirming no rollback needed |

## CLAUDE.md (Minimal)

```markdown
# nx-blog

Nx blog and changelog site built with Astro + Markdoc.

## Dev

pnpm install
pnpm --filter blog dev

## New Blog Post

1. Create `apps/blog/src/content/blog/YYYY-MM-DD-slug.mdoc`
2. Add frontmatter (title, authors, description, tags)
3. New images go in `apps/blog/src/assets/blog/images/` (optimized)
4. Dev server has HMR — save and check browser

## Available Markdoc Tags

youtube, callout, toc, cards/card, call-to-action, video-player,
tweet, testimonial, command, github-repository, tabs/tab,
install-nx-console, link-card
```

## Out of Scope

- Nx workspace tooling in this repo beyond basic task running
- Prettier / ESLint (devrel adds if wanted)
- Vale editorial linting (devrel adds if wanted)
- Shared header/footer component library
- Converting React islands to pure Astro (follow-up)
- Astro image optimization for legacy images (follow-up)
- The nx-dev proxy configuration (separate PR in nx-dev repo)

## Implementation Risks

1. **Markdoc + Astro integration differences**: `@astrojs/markdoc` has its own tag/node registration API that differs from the custom Markdoc pipeline in nx-dev. Tag definitions will need adaptation, not just copy-paste. The `toc` tag in particular needs to hook into Astro's heading extraction.

2. **Code fence attributes**: `fileName` and `highlightLines` are Markdoc fence node attributes, not tags. They require custom fence node handling in the Markdoc config — easy to overlook during the tag audit.

3. **Slug derivation from filename**: The current system strips `YYYY-MM-DD-` prefix from filenames to derive slugs. Astro content collections generate slugs differently. Either configure slug generation explicitly in `[...slug].astro` or ensure all posts have a `slug` frontmatter field.

4. **Reverse proxy + static assets**: CSS, JS, and fonts from the Astro build need to be served correctly through the Netlify proxy. Astro's built assets land in `/_astro/` by default — the proxy must handle these paths, or the Astro `base` config must scope all assets under `/blog/`. Test this early.

5. **193 posts x strict schema**: Some posts may have inconsistent or missing frontmatter fields. Budget time for a migration script that audits and fixes frontmatter across all posts before the schema enforces it.

## Open Questions

None — all decisions resolved during brainstorm.
