# Summary - December 12, 2025

## Completed

### Fix: GitHub Issue #33776 - NestJS serve fails with "Cannot find module 'nx'"

**Issue:** https://github.com/nrwl/nx/issues/33776

After generating a new Nx workspace with `@nx/nest` preset using version 22.2.0, running `nx serve` fails with `Error: Cannot find module 'nx'`.

**Root Cause Analysis:**
1. The `@nx/js` node executor at `packages/js/src/executors/node/node.impl.ts:299` uses `require.resolve('nx')` to fork the nx CLI
2. This fails because:
   - `nx` is only a `devDependency` of `@nx/js`, not a regular dependency
   - pnpm's strict isolation prevents resolving undeclared dependencies
   - The `nx` package doesn't have a `main` field in v22.2.0 (regression)

**Historical Investigation:**
- Discovered the `main` field was never in source code - it was added during build
- Before ts-solution (pre-21.4.0): `@nx/js:tsc` executor added `main` via `updatePackageJson()`
- After ts-solution: `legacy-post-build` executor should add `main: "./bin/nx.js"` but inconsistently works in CI releases
- Version history shows intermittent failures: 21.5.0 (broken), 22.0.0-22.1.3 (working), 22.2.0+ (broken)

**Fix Implemented:**
Changed `node.impl.ts:299` from:
```typescript
require.resolve('nx')
```
to:
```typescript
require.resolve('nx/bin/nx.js', { paths: [context.root] })
```

This resolves the nx binary explicitly from the workspace root where it's always installed, regardless of:
- Package manager hoisting behavior (pnpm/npm/yarn)
- Whether the `main` field exists in the nx package.json

**Commit:** `dc749de18f` on branch `issue-33776`

**Status:** Fix committed locally, verified working against repro at `/tmp/nest1`. Ready for PR.

**Note:** There may be a separate CI/release pipeline issue causing `legacy-post-build` to inconsistently add the `main` field to the published `nx` package. This should be investigated separately.

---

### Eng Wrapped 2025 - Presentation Enhancements

Continued work on the Spotify Wrapped-style presentation for Nx Engineering team's 2025 accomplishments.

**Task Plan:** `.ai/2025-12-10/tasks/eng-team-thank-you-recap.md`
**Location:** `/Users/jack/projects/eng-wrapped/`

**UI Improvements:**
- Fixed button overlap on first section by adding conditional gap (`gap-20` when scaled 2x)
- Fixed RedPanda Team Formed section - photos were squished beside large center image
  - Added `flex-shrink-0` to prevent compression
  - Added `object-cover` to maintain photo aspect ratios
  - Reduced center image from `w-80` to `w-72` for better balance

**Team Attribution Updates:**
- Agent Resource Usage: Added both Orca and Nx CLI team dots
- Continuous Tasks: Added both Nx CLI and Orca team dots

**Content Updates:**
- Updated Continuous Tasks section based on TTG docs research:
  - New tagline: "Chain tasks that depend on long-running processes"
  - New code example showing full chain: `e2e → frontend → backend`
  - Updated bullet points: "Chains of dependencies", "Waits for ready signal", "Cleans up on completion"
  - Shows broader concept of continuous task dependencies, not just e2e + dev server use case

**Reference:** Fetched TTG optimization features from `https://nx.dev/docs/guides/nx-cloud/optimize-your-ttg`

**Feature Section Animations:**
- Added animations to AI Code Generation (section 11): terminal slides in, command types out, checkmarks pop sequentially
- Added animations to Agent Resource Usage (section 12): side-by-side images slide in from left/right with pulsing glow effects
- Added animations to Flaky Task Analytics (section 13): rows slide in, warning icons pulse, percentages pop

**Content Fixes:**
- Renamed "PostHog A/B Testing" to "PostHog Real-Time Monitoring" in Orca Highlights
- Added second screenshot (`usage.png`) to Agent Resource Usage section, displayed side-by-side

**Deployment & Publishing:**
- Set up GitHub Pages deployment via GitHub Actions workflow
- Repository: https://github.com/jaysoo/eng-wrapped
- Live URL: https://jaysoo.github.io/eng-wrapped/
- Fixed workflow issues: removed npm cache, switched to `npx vite build`

**Image Optimization:**
- Added `vite-plugin-image-optimizer` for automatic compression during build
- Installed `sharp` and `svgo` dependencies for PNG/JPG/SVG optimization
- Resized oversized images to web-appropriate dimensions:
  - `orca.png`: 2816x1536 → 1000x546 (794KB source → 186KB optimized)
  - `redpanda.png`: 2816x1536 → 1000x546 (826KB source → 255KB optimized)
  - `grafana-dashboard.png`: 5344x3054 → 1600x914 (558KB source → 125KB optimized)
- Total image savings: ~73% (all images now under 300KB after optimization)
