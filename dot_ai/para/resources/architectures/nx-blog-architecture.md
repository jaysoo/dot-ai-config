# nx-blog Architecture

> Nx blog and changelog site built with TanStack Start + Markdoc.

## Directory Overview

```
blog/
├── public/                    # Static assets (images, favicons)
├── scripts/                   # Build-time scripts (feeds, banner prebuild)
├── src/
│   ├── components/           # React components
│   │   ├── Header.tsx        # Main site header (matches Framer nx.dev)
│   │   ├── Footer.tsx        # Main site footer (matches Framer nx.dev)
│   │   └── AnnouncementBanner.tsx  # Floating CTA banner
│   ├── content/
│   │   ├── blog/             # Blog posts (.mdoc files)
│   │   └── changelog/        # Changelog entries (.mdoc files)
│   ├── lib/                  # Shared utilities, banner config
│   ├── routes/               # TanStack Router file-based routes
│   │   └── __root.tsx        # Root layout (html/body, fonts, theme)
│   └── styles/
│       └── app.css           # Tailwind v4 + custom variants
├── vite.config.ts            # Vite + TanStack Start config
└── package.json
```

## Key Design Decisions

### Header/Footer Match Framer (DOC-463, 2026-04-01)

The header and footer are designed to pixel-match the Framer site at nx.dev so users don't experience a jarring shift when navigating between them.

**Header layout** (measured from Framer via Playwright):
- `max-w-[1200px] px-16` → 1072px content area centered
- `justify-between` with 2 groups: left (logo + nav) and right (buttons)
- Nav uses `gap-[22px]` with 5px-wide separator containers (1px visible line inside)
- Inter font, `letter-spacing: -0.28px` on nav items
- `h-[60px]` explicit height
- Button line-height: `leading-[1.2]` for 32.8px height matching Framer

**Dark mode colors** (extracted via Playwright computed styles):
- Nav text: `dark:text-white/70` (Framer uses `rgb(161,161,170)` ≈ zinc-400, but white/70 matches visual brightness better)
- Separators: `dark:bg-zinc-700` on 1px line inside 5px container
- Try Nx Cloud button: `dark:bg-zinc-50 dark:text-zinc-900` (solid white, not outlined)

**Hover dropdown menus**:
- Solutions: 2-column grid with icons, titles, descriptions
- Resources: 4-column layout (Learn, Medias, Company, Subscribe)
- Positioned with `absolute inset-x-0 top-full` relative to sticky header
- Constrained to `max-w-[1000px]` centered
- CSS-only hover via Tailwind `group/group-hover`

### Tech Stack
- **Framework**: TanStack Start (React SSR/SSG via Vite)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite` plugin
- **Typography**: `@tailwindcss/typography` for markdown content
- **Font**: Inter (Google Fonts, loaded in `__root.tsx`)
- **Dark mode**: `data-theme` attribute, custom `@custom-variant dark`
- **Content**: Markdoc (.mdoc files) with gray-matter frontmatter
- **Search**: Pagefind (post-build indexing)

### Gotchas
- **Dev server port**: Vite assigns dynamically — check terminal output, don't assume 4321
- **Framer comparison**: Framer uses its own rendering engine; CSS borders/shadows won't match 100%. Use Playwright + ImageMagick for pixel diffing
- **Tailwind v4 dark mode**: Uses `@custom-variant dark` with `data-theme` attribute, NOT `prefers-color-scheme`
- **Logo SVG**: Uses a wider viewBox (`0 0 40 26`) at `h-[30px] w-[46px]` — NOT the square `0 0 24 24` viewBox from the original codebase
- **Separator trick**: 5px-wide container with 1px centered line — needed for correct flex gap spacing to match Framer positions

## Personal Work History

### DOC-463: Match Framer Header and Footer (2026-04-01)
- **Branch**: `DOC-463`
- **Commit**: `1239509` (squashed)
- **Files**: `Header.tsx`, `Footer.tsx`, `__root.tsx`
- Pixel-matched header to Framer using Playwright measurements and ImageMagick diffs
- Added hover dropdown menus for Solutions and Resources
- Updated footer to 5-column layout with copyright bar
- Added Inter font loading
