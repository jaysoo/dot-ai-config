# Consolidation Candidates (Beyond DevKit/Reference)

**Date:** 2026-01-06
**Goal:** Reduce page count by consolidating low-traffic pages into parent pages

---

## Executive Summary

| Section | Current Pages | After Consolidation | Reduction |
|---------|---------------|---------------------|-----------|
| Technologies | ~180 | ~120 | 60 pages |
| Guides | ~80 | ~50 | 30 pages |
| Concepts | ~30 | ~20 | 10 pages |
| Getting-Started | ~12 | ~12 | 0 pages |
| Extending-Nx | ~17 | ~17 | 0 pages |
| Features | ~18 | ~18 | 0 pages |
| **Total** | **~337** | **~237** | **~100 pages** |

---

## Technologies Section (~60 pages to consolidate)

### 1. All Migration Pages → Consolidate into Parent Tech Pages

Every technology has a `/migrations` page with <200 views. Consolidate into the parent intro page as a "Migrations" section.

| Page | Views | Consolidate Into |
|------|-------|------------------|
| `/technologies/build-tools/rsbuild/migrations` | 6 | rsbuild/introduction |
| `/technologies/dotnet/migrations` | 8 | dotnet/introduction |
| `/technologies/test-tools/playwright/migrations` | 9 | playwright/introduction |
| `/technologies/build-tools/docker/migrations` | 10 | docker/introduction |
| `/technologies/build-tools/rollup/migrations` | 10 | rollup/introduction |
| `/technologies/java/migrations` | 12 | java/introduction |
| `/technologies/eslint/eslint-plugin/migrations` | 23 | eslint-plugin/introduction |
| `/technologies/vue/nuxt/migrations` | 28 | nuxt/introduction |
| `/technologies/test-tools/detox/migrations` | 29 | detox/introduction |
| `/technologies/build-tools/esbuild/migrations` | 33 | esbuild/introduction |
| `/technologies/java/gradle/migrations` | 81 | gradle/introduction |
| `/technologies/java/maven/migrations` | 94 | maven/introduction |
| `/technologies/build-tools/rspack/migrations` | 111 | rspack/introduction |
| `/technologies/build-tools/webpack/migrations` | 115 | webpack/introduction |
| `/technologies/test-tools/cypress/migrations` | 140 | cypress/introduction |
| `/technologies/vue/migrations` | 147 | vue/introduction |
| `/technologies/react/remix/migrations` | 36 | remix/introduction |
| `/technologies/react/expo/migrations` | 189 | expo/introduction |
| `/technologies/react/react-native/migrations` | 173 | react-native/introduction |
| `/technologies/test-tools/vitest/migrations` | 202 | vitest/introduction |
| `/technologies/test-tools/storybook/migrations` | 211 | storybook/introduction |
| `/technologies/build-tools/vite/migrations` | 287 | vite/introduction |

**Reduction: ~22 pages**

### 2. Java/Gradle/Maven → Consider Consolidating to Single "Java" Section

Entire Java ecosystem has low traffic:

| Page | Views | Action |
|------|-------|--------|
| `/technologies/java/gradle` | 68 | Keep as main Java page |
| `/technologies/java/maven` | 69 | Merge into Java page |
| `/technologies/java/gradle/executors` | 105 | Consolidate |
| `/technologies/java/gradle/generators` | 139 | Consolidate |
| `/technologies/java/maven/generators` | 207 | Consolidate |
| `/technologies/java` (index) | 142 | Keep |

**Recommendation:** Keep `/technologies/java/introduction` with Gradle/Maven as sections, not separate pages.

**Reduction: ~5 pages**

### 3. Detox → Remove or Minimal Docs

Detox (React Native testing) has very low traffic:

| Page | Views | Action |
|------|-------|--------|
| `/technologies/test-tools/detox` | 56 | Keep minimal intro |
| `/technologies/test-tools/detox/introduction` | 269 | Keep |
| `/technologies/test-tools/detox/generators` | 38 | Remove → link to CLI |
| `/technologies/test-tools/detox/executors` | 68 | Remove → link to CLI |
| `/technologies/test-tools/detox/migrations` | 29 | Remove |

**Reduction: ~3 pages**

### 4. Rspack/Rsbuild → Consolidate (Too New, Low Adoption)

| Page | Views | Action |
|------|-------|--------|
| `/technologies/build-tools/rsbuild` | 79 | Keep intro only |
| `/technologies/build-tools/rsbuild/generators` | 122 | Merge into intro |
| `/technologies/build-tools/rsbuild/migrations` | 6 | Remove |
| `/technologies/build-tools/rspack` | 81 | Keep intro only |
| `/technologies/build-tools/rspack/executors` | - | Merge into intro |
| `/technologies/build-tools/rspack/generators` | - | Merge into intro |
| `/technologies/build-tools/rspack/migrations` | 111 | Remove |
| `/technologies/angular/angular-rspack/*` | 30-268 | Consolidate to 1-2 pages |
| `/technologies/angular/angular-rsbuild/*` | 109-170 | Consolidate to 1 page |

**Reduction: ~10 pages**

### 5. Docker → Single Page

| Page | Views | Action |
|------|-------|--------|
| `/technologies/build-tools/docker` | 80 | Keep as single page |
| `/technologies/build-tools/docker/introduction` | - | Merge |
| `/technologies/build-tools/docker/migrations` | 10 | Remove |

**Reduction: ~2 pages**

### 6. Rollup → Single Page (Low Adoption)

| Page | Views | Action |
|------|-------|--------|
| `/technologies/build-tools/rollup` | 86 | Keep as single page |
| `/technologies/build-tools/rollup/executors` | - | Merge into intro |
| `/technologies/build-tools/rollup/generators` | 215 | Merge into intro |
| `/technologies/build-tools/rollup/migrations` | 10 | Remove |

**Reduction: ~3 pages**

### 7. Storybook Guides → Consolidate

Too many low-traffic Storybook guides:

| Page | Views | Action |
|------|-------|--------|
| `/storybook/guides/one-storybook-per-scope` | 93 | Merge into "Storybook Setup Patterns" |
| `/storybook/guides/overview-vue` | 95 | Merge into Vue docs |
| `/storybook/guides/one-storybook-with-composition` | 149 | Merge into "Storybook Setup Patterns" |
| `/storybook/guides/storybook-interaction-tests` | 154 | Keep |
| `/storybook/guides/storybook-9-setup` | 155 | Merge into intro |
| `/storybook/guides/storybook-composition-setup` | 188 | Merge into "Storybook Setup Patterns" |
| `/storybook/guides/configuring-storybook` | 200 | Keep |

**Create one "Storybook Setup Patterns" page combining: one-storybook-per-scope, one-storybook-with-composition, storybook-composition-setup**

**Reduction: ~4 pages**

### 8. Module Federation Concepts → Consolidate

| Page | Views | Action |
|------|-------|--------|
| `/module-federation/concepts` (index) | 256 | Keep |
| `/module-federation/concepts/micro-frontend-architecture` | 3,785 | Keep |
| `/module-federation/concepts/module-federation-and-nx` | 2,594 | Keep |
| `/module-federation/concepts/faster-builds-with-module-federation` | 1,913 | Keep |
| `/module-federation/concepts/manage-library-versions...` | ~500 | Merge into MF intro |
| `/module-federation/concepts/nx-module-federation-technical-overview` | ~200 | Merge into MF intro |

**Reduction: ~2 pages**

### 9. Vitest/Jest/Cypress Guides → Audit

| Page | Views | Action |
|------|-------|--------|
| `/vitest/guides/testing-without-building-dependencies` | 80 | Merge into vitest intro |
| `/vitest/guides` (index) | 92 | Remove index |
| `/cypress/guides/cypress-v11-migration` | 140 | Remove (outdated) |
| `/cypress/guides/cypress-setup-node-events` | 143 | Merge into cypress intro |

**Reduction: ~4 pages**

---

## Guides Section (~30 pages to consolidate)

### 1. Nx Cloud Guides → Too Fragmented

Many Nx Cloud subpages with <200 views:

| Page | Views | Action |
|------|-------|--------|
| `/guides/nx-cloud/google-auth` | 78 | Merge into "Authentication" page |
| `/guides/nx-cloud/encryption` | 89 | Keep |
| `/guides/nx-cloud/record-commands` | 96 | Merge into "Advanced Setup" |
| `/guides/nx-cloud/source-control-integration/bitbucket` | 99 | Keep |
| `/guides/nx-cloud/ci-resource-usage` | 101 | Merge into "Monitoring" |
| `/guides/nx-cloud` (index) | 120 | Keep |
| `/guides/nx-cloud/enable-ai-features` | 120 | Keep |
| `/guides/nx-cloud/source-control-integration/azure-devops` | 152 | Keep |
| `/guides/nx-cloud/optimize-your-ttg` | 155 | Keep |
| `/guides/nx-cloud/cipe-affected-project-graph` | 191 | Merge into DTE docs |
| `/guides/nx-cloud/source-control-integration/gitlab` | 212 | Keep |
| `/guides/nx-cloud/source-control-integration/github` | 214 | Keep |
| `/guides/nx-cloud/personal-access-tokens` | 284 | Merge into "Access Tokens" |
| `/guides/nx-cloud/manual-dte` | 389 | Keep |

**Create consolidated pages:**
- "Authentication & Access" (google-auth + personal-access-tokens + access-tokens)
- "Advanced Configuration" (record-commands + ci-resource-usage)

**Reduction: ~5 pages**

### 2. Enforce Module Boundaries → Consolidate

4 subpages that could be one comprehensive page:

| Page | Views | Action |
|------|-------|--------|
| `/guides/enforce-module-boundaries/tags-allow-list` | 287 | Merge |
| `/guides/enforce-module-boundaries/ban-external-imports` | 407 | Merge |
| `/guides/enforce-module-boundaries/ban-dependencies-with-tags` | 498 | Merge |
| `/guides/enforce-module-boundaries/tag-multiple-dimensions` | ~300 | Merge |

**Create ONE comprehensive "Module Boundaries Configuration" page**

**Reduction: ~3 pages**

### 3. Tips & Tricks → Consolidate Low-Traffic

| Page | Views | Action |
|------|-------|--------|
| `/guides/tips-n-tricks` (index) | 97 | Keep |
| `/guides/tips-n-tricks/analyze-source-files` | 193 | Keep |
| `/guides/tips-n-tricks/browser-support` | 244 | Keep |
| `/guides/tips-n-tricks/identify-dependencies-between-folders` | 310 | Keep |
| `/guides/tips-n-tricks/feature-based-testing` | 323 | Merge into testing docs |
| `/guides/tips-n-tricks/yarn-pnp` | 356 | Keep |
| `/guides/tips-n-tricks/include-all-packagejson` | 408 | Merge into project config |

**Reduction: ~2 pages**

### 4. Nx Release → Too Many Subpages

| Page | Views | Action |
|------|-------|--------|
| `/guides/nx-release/update-local-registry-setup` | 316 | Merge into "Testing Releases" |
| `/guides/nx-release/publish-rust-crates` | 448 | Keep (niche but specific) |
| Many others with 500-1500 views | | Keep |

**Reduction: ~2 pages**

### 5. Nx Console → Consolidate

| Page | Views | Action |
|------|-------|--------|
| `/guides/nx-console/console-nx-cloud` | 213 | Merge into main Nx Console page |
| `/guides/nx-console/console-project-details` | 264 | Keep |
| `/guides/nx-console/console-telemetry` | 306 | Merge into main |
| `/guides/nx-console/console-run-command` | 475 | Keep |

**Reduction: ~2 pages**

### 6. Tasks & Caching Guides → Some Consolidation

| Page | Views | Action |
|------|-------|--------|
| `/guides/tasks--caching/convert-to-inferred` | 382 | Keep |
| `/guides/tasks--caching/change-cache-location` | 416 | Merge into caching overview |
| `/guides/tasks--caching/reduce-repetitive-configuration` | 460 | Keep |

**Reduction: ~1 page**

### 7. Adopting Nx → Clean

All pages have good traffic (600-2000+), keep as-is.

---

## Concepts Section (~10 pages to consolidate)

### 1. CI Concepts → Consolidate Low-Traffic

| Page | Views | Action |
|------|-------|--------|
| `/concepts/ci-concepts` (index) | 47 | Remove index, direct to subpages |
| `/concepts/ci-concepts/heartbeat-and-manual-shutdown-handling` | 125 | Merge into Scale/troubleshooting |
| `/concepts/ci-concepts/cache-security` | 209 | Keep |
| `/concepts/ci-concepts/reduce-waste` | 232 | Merge into "Building Blocks" |
| `/concepts/ci-concepts/building-blocks-fast-ci` | 252 | Keep |
| `/concepts/ci-concepts/parallelization-distribution` | 769 | Keep |

**Reduction: ~3 pages**

### 2. Decisions → Keep (Good Traffic)

All decision pages have 380-3500 views - keep as-is.

### 3. Remove Old Paths (404s)

These are old URLs no longer in use:

| Page | Views | Action |
|------|-------|--------|
| `/concepts/integrated-monorepos` | 1 | Already redirects |
| `/concepts/monorepo-architecture` | 1 | Already redirects |
| `/concepts/monorepo-structure` | 1 | Already redirects |
| `/concepts/more-concepts/*` | 1-3 | Already redirects |

**Already handled - no action needed**

---

## Getting-Started Section (Keep All)

This section is **excellent** - don't touch it:

| Page | Views | Bounce | Verdict |
|------|-------|--------|---------|
| `/getting-started/intro` | 66,328 | 19% | ✓ Keep |
| `/getting-started/installation` | 26,931 | 26% | ✓ Keep |
| `/getting-started/start-new-project` | 18,021 | 16% | ✓ Keep |
| `/getting-started/tutorials/angular-monorepo-tutorial` | 10,605 | 31% | ✓ Keep |
| `/getting-started/start-with-existing-project` | 9,620 | 12% | ✓ Keep |
| `/getting-started/ai-setup` | 8,562 | 37% | ✓ Keep (fix bounce) |
| `/getting-started/tutorials/react-monorepo-tutorial` | 8,296 | 27% | ✓ Keep |
| `/getting-started/editor-setup` | 5,911 | 15% | ✓ Keep |
| `/getting-started/tutorials/typescript-packages-tutorial` | 5,859 | 20% | ✓ Keep |
| `/getting-started/nx-cloud` | 3,523 | 26% | ✓ Keep |
| `/getting-started/tutorials` (index) | 3,450 | 23% | ✓ Keep |
| `/getting-started/tutorials/gradle-tutorial` | 886 | 42% | ✓ Keep (niche) |

**Reduction: 0 pages**

---

## Extending-Nx Section (Keep All)

All pages have healthy traffic (188-1741 views) with reasonable bounce rates. This section serves power users well.

**Reduction: 0 pages**

---

## Features Section (Keep All)

Almost all features pages have high traffic (328-8639 views). Only exception:

| Page | Views | Action |
|------|-------|--------|
| `/features/ci-features/explain-with-ai` | 11 | Too new - keep, monitor |

**Reduction: 0 pages**

---

## Summary: Consolidation Action Plan

### High Impact (Do First)
1. **All migration pages** → Merge into parent intro pages (~22 pages)
2. **Rspack/Rsbuild ecosystem** → Consolidate to 2-3 pages (~10 pages)
3. **Nx Cloud guides** → Create consolidated auth/config pages (~5 pages)
4. **Module boundaries guides** → One comprehensive page (~3 pages)

### Medium Impact
5. **Java/Gradle/Maven** → Consolidate to 2 pages (~5 pages)
6. **Storybook guides** → Create "Setup Patterns" page (~4 pages)
7. **CI concepts** → Consolidate low-traffic (~3 pages)
8. **Detox** → Minimal docs (~3 pages)

### Low Impact (Nice to Have)
9. **Test tool guides** → Minor consolidation (~4 pages)
10. **Docker/Rollup** → Single pages each (~5 pages)
11. **Tips & tricks** → Minor cleanup (~2 pages)

---

## Total Reduction Estimate

| Category | Pages Reduced |
|----------|---------------|
| Migration pages consolidated | 22 |
| Build tools (rspack/rsbuild/docker/rollup) | 15 |
| Guides consolidation | 15 |
| Java ecosystem | 5 |
| Test tools (Detox, Storybook, etc.) | 11 |
| Concepts | 3 |
| **Total** | **~70-80 pages** |

Combined with DevKit consolidation (~140 pages) and deprecated removal (~15 pages), total reduction is **~230 pages** (from ~650 to ~420).
