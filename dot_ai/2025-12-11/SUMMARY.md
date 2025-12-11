# Summary - 2025-12-11

## Completed

### DOC-360: Static Build-Time Banner Configuration
Implemented static build-time banner system for nx-dev and astro-docs sites.

**Key Changes:**
- Created prebuild script (`scripts/documentation/prebuild-banner.mjs`) that fetches banner JSON from `NEXT_PUBLIC_BANNER_URL` or uses committed config
- Added committed `banner-config.json` files for both sites (single source of truth)
- Updated `WebinarNotifier` component with required props and `id`-based localStorage key (`banner-${id}-dismissed`)
- Combined Astro middlewares into single `banner.middleware.ts` handling both Starlight top banner and floating WebinarNotifier
- Used Astro content collections with `file()` loader for banner config
- Added `activeUntil` field (ISO timestamp) for automatic banner expiration

**Architecture:**
- nx-dev: Prebuild script + static JSON import at build time (keeps pages static)
- astro-docs: Middleware with content collection, cached fetch pattern

**Files Modified/Created:**
- `scripts/documentation/prebuild-banner.mjs` (new)
- `nx-dev/nx-dev/lib/banner-config.json` (new, committed)
- `astro-docs/src/banner-config.json` (new, committed, array format)
- `nx-dev/ui-common/src/lib/webinar-notifier.tsx` (simplified props, added `activeUntil`)
- `astro-docs/src/plugins/banner.middleware.ts` (combined floating + top banner)
- `astro-docs/src/content.config.ts` (added `banner` collection)
- Both layouts (`_app.tsx`, `layout.tsx`, `PageFrame.astro`) updated
- Deleted: `DynamicBanner.tsx`, `banner/` folder, `floating-banner.middleware.ts`, `notifications.json`

**Commits:**
- `e385084a08` - feat(misc): static build-time banner configuration for nx-dev and astro-docs

## Dictations

### Team Notes: Leo & Andrew
- Leo: COI team, based in Barcelona, Spain
- Andrew: Neighbors with Leo in Barcelona
- January 2026: Leo and Andrew visiting Swissbank(?) with Miro and Luzia(?)

### Eng Wrapped 2025 Presentation
Built interactive React presentation showcasing Nx Engineering team's 2025 accomplishments.

**Key Features Implemented:**
- 23-slide presentation with smooth scroll-snap navigation
- Scroll interruption system - scrolling during animation cancels current and speeds to next section
- Whimsical animations (wiggle, popIn, slideInUp) with staggered delays
- Teams page with 5 accomplishments per team and animated cards that pause on hover
- Real images/logos instead of emojis (cloud providers, Grafana dashboard, Maven/.NET)

**Slides Include:**
- Hero/intro with welcome message
- Contributor stats (commits per team member)
- "Big Features" section: Self-Healing CI, Helm Chart v1.0, Full Observability, Azure Single Tenant
- "Any Cloud • Any Scale • Always On" infrastructure slide
- New Ecosystems (Gradle, Maven, .NET)
- Projects showcase (80+ projects, custom cloud options)
- Teams page (CLI, Web, SDK, Cloud, Docs, DevRel)
- Thanks/closing slides

**Technical Details:**
- React with useState, useEffect, useRef hooks
- Tailwind CSS for styling
- Vite dev server at localhost:5173
- requestAnimationFrame/cancelAnimationFrame for smooth scroll animations
- CSS keyframe animations with staggered delays

**Content Verification:**
- Verified Helm Chart content against Linear project (Kustomize → Helm migration, ArgoCD AppSets)
- Replaced fake helm install command with visual feature cards after checking actual repo

**Files:**
- `/Users/jack/projects/eng-wrapped/src/EngWrapped.jsx` - Main 23-slide presentation
- `/Users/jack/projects/eng-wrapped/public/` - Image assets (grafana-dashboard.png, cloud logos, etc.)

## Notes
- Banner JSON uses `id` field for localStorage dismissal tracking (changing ID resets dismissals)
- `activeUntil` field allows automatic expiration without code changes
- Astro `file()` loader requires array format; nx-dev uses single object (different formats for same data)
