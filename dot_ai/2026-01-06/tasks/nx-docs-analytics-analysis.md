# Nx.dev Documentation Analytics Analysis

**Date Range:** Nov 1, 2025 - Jan 5, 2026 (66 days)
**Total Views:** 672,713
**Total Active Users:** 113,053
**Overall Bounce Rate:** 45.1%

---

## Executive Summary

This analysis examines Google Analytics data for nx.dev/docs pages to identify:
1. **High-performing pages** (high traffic, low bounce rate)
2. **Dead pages** (low/no traffic, high bounce rate)
3. **Section performance** comparison
4. **Recommendations** for optimizing first-time user experience

### Key Findings

- **Getting Started pages dominate traffic** - The top 3 pages are all getting-started content
- **Angular is the most popular technology** - More traffic than React, Node combined
- **High bounce rates on advanced features** - Users leave quickly from CI/flaky tasks/terminal UI pages
- **Reference/DevKit pages are low traffic** - Mostly used by power users for specific API lookups
- **Several pages have 0 visits** in 90 days - Candidates for removal or consolidation

---

## Top 20 Most Visited Pages

| Rank | Page | Views | Users | Bounce Rate | Assessment |
|------|------|-------|-------|-------------|------------|
| 1 | /docs/getting-started/intro | 66,328 | 35,390 | 19.4% | **Excellent** - Main entry point |
| 2 | /docs/getting-started/installation | 26,931 | 15,904 | 25.7% | **Good** - Critical onboarding |
| 3 | /docs/getting-started/start-new-project | 18,021 | 10,273 | 15.6% | **Excellent** - Low bounce |
| 4 | /docs/reference/nx-commands | 14,105 | 8,135 | 36.3% | Moderate - Power user reference |
| 5 | /docs/technologies/angular/guides/angular-nx-version-matrix | 11,463 | 5,479 | 34.1% | Version compatibility check |
| 6 | /docs/getting-started/tutorials/angular-monorepo-tutorial | 10,605 | 5,417 | 30.8% | **Good** - Tutorial engagement |
| 7 | /docs/getting-started/start-with-existing-project | 9,620 | 6,094 | 11.8% | **Excellent** - Lowest bounce! |
| 8 | /docs/features/automate-updating-dependencies | 8,639 | 5,031 | 31.7% | Moderate |
| 9 | /docs/getting-started/ai-setup | 8,562 | 5,488 | 36.9% | New feature, higher bounce |
| 10 | /docs/reference/project-configuration | 8,355 | 5,030 | 30.4% | Power user reference |
| 11 | /docs/getting-started/tutorials/react-monorepo-tutorial | 8,296 | 4,548 | 27.3% | **Good** - Tutorial |
| 12 | /docs/technologies/angular/generators | 8,010 | 3,729 | 42.3% | High bounce - needs review |
| 13 | /docs/features/run-tasks | 7,737 | 5,139 | 22.8% | **Good** - Core feature |
| 14 | /docs/features/enhance-ai | 6,956 | 4,855 | 39.2% | Higher bounce for AI features |
| 15 | /docs/technologies/node/nest/introduction | 6,885 | 3,034 | 28.6% | **Good** - NestJS popular |
| 16 | /docs/quickstart | 6,450 | 4,836 | 16.9% | **Excellent** - Quick entry |
| 17 | /docs/technologies/angular/introduction | 6,270 | 3,413 | 17.6% | **Excellent** |
| 18 | /docs/getting-started/editor-setup | 5,911 | 4,350 | 15.4% | **Excellent** - Low bounce |
| 19 | /docs/getting-started/tutorials/typescript-packages-tutorial | 5,859 | 3,652 | 20.1% | **Good** |
| 20 | /docs/features/generate-code | 5,347 | 3,577 | 24.5% | **Good** |

### Insights from Top Pages

1. **First-time user pages perform best** - `/getting-started/*` pages have consistently lower bounce rates
2. **"Start with existing project"** has the lowest bounce rate (11.8%) - Users finding exactly what they need
3. **AI-related pages** have higher bounce rates (37-39%) - May indicate unclear value proposition or setup friction
4. **Angular generators** page has 42.3% bounce rate despite high traffic - Potential UX issue

---

## Problem Pages: High Bounce Rates (>40%)

These pages have significant traffic but users leave immediately:

| Page | Views | Bounce Rate | Issue |
|------|-------|-------------|-------|
| /docs/features/ci-features/flaky-tasks | 1,999 | 47.2% | Complex topic, unclear entry point |
| /docs/troubleshooting/ci-execution-failed | 1,159 | 48.3% | Users frustrated, not finding solution |
| /docs/features/ci-features/self-healing-ci | 2,113 | 46.2% | Marketing page vs. actionable content? |
| /docs/guides/tasks--caching/skipping-cache | 1,676 | 47.2% | Users looking for quick answer |
| /docs/technologies/angular/guides/dynamic-module-federation-with-angular | 3,874 | 42.7% | Complex, needs better intro |
| /docs/technologies/angular/generators | 8,010 | 42.3% | High traffic, poor engagement |
| /docs/guides/tasks--caching/terminal-ui | 2,836 | 38.9% | New feature, may need polish |

### Recommendations for High-Bounce Pages

1. **Add TL;DR sections** at the top of complex pages
2. **Include "Quick Fix" sections** for troubleshooting pages
3. **Review page titles** - May be attracting wrong audience via search
4. **Add clear CTAs** - What should user do next?

---

## Dead Pages: Low Traffic, High Bounce

Pages that barely get visits AND users leave immediately (candidates for removal/consolidation):

| Page | Views | Bounce Rate | Recommendation |
|------|-------|-------------|----------------|
| /docs/features/ci-features/explain-with-ai | 11 | 40% | Too new or buried? |
| /docs/technologies/java/executors | 11 | 70% | Java executors barely used |
| /docs/reference/deprecated/* | <15 each | 30-40% | Archive or remove |
| /docs/extending-nx/executors | 8 | 100% | Consolidate with other extending docs |
| /docs/reference/nx-commands/migrate | 9 | 100% | Wrong URL? Should redirect |
| /docs/technologies/angular/overview | 8 | 78% | Probably orphaned page |
| /docs/recipes/other/eslint | 7 | 100% | Dead content |
| /docs/technologies/react/setup | 7 | 100% | Obsolete? |

### Pages with 0 Visits (from llms.txt comparison)

These pages exist in the documentation but received NO visits in 90 days:

- Many `/docs/guides/enforce-module-boundaries/*` subpages
- Many `/docs/guides/nx-release/*` detailed subpages
- Several `/docs/technologies/*/migrations` pages
- Various `/docs/reference/devkit/*` API pages

**Recommendation:** Either these are orphaned (no links to them) or too specific. Consider:
1. Consolidating into parent pages
2. Adding better internal linking
3. Removing if truly obsolete

---

## Section Performance Analysis

### By Traffic Volume

| Section | Est. Total Views | Avg Bounce Rate | Assessment |
|---------|------------------|-----------------|------------|
| /getting-started/* | ~150,000 | 20-30% | **Star Performer** |
| /technologies/angular/* | ~60,000 | 25-35% | High traffic, moderate engagement |
| /features/* | ~50,000 | 25-40% | Core features, varies by page |
| /reference/* | ~40,000 | 25-35% | Power user destination |
| /technologies/react/* | ~25,000 | 25-35% | Healthy |
| /technologies/node/* | ~20,000 | 20-30% | Good engagement |
| /guides/* | ~35,000 | 25-40% | Mixed results |
| /concepts/* | ~20,000 | 20-30% | Good for what it is |
| /extending-nx/* | ~8,000 | 25-35% | Niche, but engaged |
| /enterprise/* | ~2,000 | 30-40% | Low traffic (expected) |
| /troubleshooting/* | ~5,000 | 35-50% | Users frustrated |

### Technology Framework Ranking

| Framework | Views | Engagement | Notes |
|-----------|-------|------------|-------|
| Angular | #1 | Good | Historically Nx's strength |
| React/Next.js | #2 | Good | Growing |
| Node/NestJS | #3 | Excellent | Very engaged users |
| TypeScript | #4 | Good | Core tooling |
| Vite | #5 | Good | Modern build tool |
| Vue/Nuxt | Lower | Good | Smaller but engaged |
| Java/Gradle | Lower | Moderate | Niche audience |
| .NET | Lower | Moderate | Niche audience |

---

## First-Time User Optimization Recommendations

### Current First-Time User Journey (Inferred)

1. `/docs/getting-started/intro` (66K views, 19% bounce) → Working well
2. `/docs/getting-started/installation` (27K views, 26% bounce) → Good
3. `/docs/getting-started/start-new-project` OR `/start-with-existing-project` → Excellent
4. Tutorial pages → Good engagement

### Recommendations

#### 1. **Optimize the "Intro" Page**
- It's the #1 entry point - ensure it clearly segments users:
  - "New to monorepos?" → Concepts
  - "Have an existing project?" → Adding Nx guide
  - "Starting fresh?" → Tutorial picker

#### 2. **Reduce AI Setup Friction**
- `/getting-started/ai-setup` has 37% bounce rate
- Consider:
  - Clearer prerequisites
  - Video walkthrough
  - "Test your setup" checklist

#### 3. **Fix Angular Generators Page**
- 8,010 views with 42% bounce is a problem
- Users likely looking for specific generator, not finding it quickly
- Add: Table of contents, search, filtering by use case

#### 4. **Create "Quick Wins" Section**
- Show users valuable Nx features within 5 minutes
- Link to: Caching demo, Graph visualization, Run commands

#### 5. **Improve Tutorial Discoverability**
- Tutorials have great engagement but are buried
- Consider homepage cards or prominent sidebar placement

#### 6. **Address Troubleshooting Dead-Ends**
- CI execution failed page (48% bounce) = frustrated users
- Add: Common solutions, community links, search within

---

## Power User Optimization

For users who already use Nx and are looking for specific information:

### What Power Users Visit

1. **Reference pages** - nx-commands, project-configuration, nx-json
2. **Technology-specific executors/generators** - Angular, React, Node
3. **CI/Caching configurations** - self-hosted caching, inputs, outputs
4. **Migration guides** - version updates, framework migrations

### Recommendations

1. **Improve Search** - Power users search more than browse
2. **API Quick Reference** - Single-page with all commonly-used commands
3. **Version Compatibility Tables** - Angular-Nx matrix is very popular
4. **Code Examples** - More copy-pasteable snippets

---

## Content Cleanup Recommendations

### Pages to Consider Removing

1. All `/docs/reference/deprecated/*` pages (except redirects)
2. Orphaned technology overview pages with <10 views
3. Duplicate content (e.g., multiple paths to same info)

### Pages to Consolidate

1. Various ESLint plugin guides → Single comprehensive page
2. Multiple module federation concept pages → Clearer hierarchy
3. Scattered "introduction" pages → Standard template

### Pages Needing Rewrites

1. **Flaky tasks** (47% bounce) - Needs clearer problem/solution format
2. **CI execution failed** (48% bounce) - Needs diagnostic flow
3. **Angular generators** (42% bounce) - Needs better organization
4. **Terminal UI** (39% bounce) - Needs clearer value proposition

---

## Metrics to Track Going Forward

1. **First-time user conversion rate** - % who visit intro → tutorial → complete
2. **Bounce rate by section** - Alert on increases
3. **Search queries with no results** - Content gaps
4. **Time on page** for tutorials - Are users completing them?
5. **Exit pages** - Where do users give up?

---

## Summary Action Items

### Quick Wins (Do First)
- [ ] Add TL;DR to top 5 high-bounce pages
- [ ] Fix Angular generators page organization
- [ ] Create redirects for dead pages to relevant content
- [ ] Add "Quick Start" prominently on homepage

### Medium Term
- [ ] Rewrite troubleshooting pages with diagnostic flows
- [ ] Consolidate deprecated content
- [ ] Add version compatibility tables for all frameworks
- [ ] Improve internal linking to orphaned pages

### Long Term
- [ ] Create user segmentation on entry (new vs. existing user)
- [ ] Implement in-page search for reference pages
- [ ] Video content for high-friction pages
- [ ] A/B test tutorial formats

---

## Appendix: Raw Data Files

- Combined analytics data: `nx-docs-analytics-combined.csv` (in this folder)
- Source: Google Analytics 4, Nov 1 2025 - Jan 5 2026
