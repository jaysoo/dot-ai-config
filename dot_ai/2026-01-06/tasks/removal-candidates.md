# Documentation Removal Candidates

**Date:** 2026-01-06
**Criteria:** <50 views/90 days, >100% bounce rate, deprecated, or niche with poor engagement

---

## Summary

| Category | Pages | Action |
|----------|-------|--------|
| Deprecated (explicit) | ~15 | **Remove** - redirect to current docs |
| DevKit API (low traffic) | ~150 | **Consolidate** - single searchable API page |
| Niche Migrations | ~12 | **Remove** - only needed during upgrades |
| Enterprise/Powerpack | ~15 | **Keep but deprioritize** - sales-driven |
| Orphaned/Dead | ~8 | **Remove** - no value |

**Estimated reduction: 50-80 pages** (from ~650 to ~570-600)

---

## Tier 1: Remove Immediately (Clear candidates)

### Deprecated Pages (~15 pages)
These are explicitly marked deprecated and have <50 visits:

| Page | Views | Bounce | Action |
|------|-------|--------|--------|
| `/reference/deprecated/workspace-executors` | 8 | 114% | Remove → redirect to current executors |
| `/reference/deprecated/cacheable-operations` | 10 | 100% | Remove → redirect to caching guide |
| `/reference/deprecated/v1-nx-plugin-api` | 13 | 108% | Remove → redirect to NxPlugin docs |
| `/reference/deprecated/runtime-cache-inputs` | 14 | 108% | Remove → redirect to inputs reference |
| `/reference/deprecated/affected-graph` | 15 | 115% | Remove → redirect to explore-graph |
| `/reference/deprecated/workspace-generators` | 15 | 115% | Remove → redirect to generators |
| `/reference/deprecated/workspace-json` | 21 | 117% | Remove → redirect to project.json |
| `/reference/deprecated/angular-schematics-builders` | 25 | 139% | Remove |
| `/reference/deprecated/npm-scope` | 34 | 110% | Remove |
| `/reference/deprecated/global-implicit-dependencies` | 48 | 133% | Remove |
| `/reference/deprecated/print-affected` | 70 | 135% | Remove → redirect to affected |
| `/reference/deprecated/as-provided-vs-derived` | 86 | 162% | Remove |
| `/reference/deprecated/rescope` | 120 | 162% | Remove |
| `/reference/deprecated/integrated-vs-package-based` | 180 | 136% | Remove |
| `/reference/deprecated` (index) | 29 | 132% | Remove after above |

**Total: ~15 pages**

### Orphaned/Dead Pages (~8 pages)

| Page | Views | Bounce | Issue |
|------|-------|--------|-------|
| `/technologies/react/setup` | 7 | 100% | Orphaned - no links to it |
| `/technologies/angular/overview` | 8 | 100% | Orphaned - use /introduction |
| `/extending-nx/executors` | 8 | 100% | Wrong path - should be /local-executors |
| `/reference/nx-commands/migrate` | 9 | 100% | Malformed path |
| `/guides/enforce-module-boundaries` | 58 | 118% | Duplicate - content in features + guides |
| `/guides/installation` | 92 | 108% | Duplicate - getting-started/installation exists |

**Total: ~8 pages**

---

## Tier 2: Consolidate (Reduce page count significantly)

### DevKit API Reference (~150 pages → 1 searchable page)

The `/reference/devkit/*` pages have extremely low traffic:

| Traffic Range | Page Count | Example Pages |
|---------------|------------|---------------|
| 0-20 views | ~50 | `CreateNodesContext`, `serializeJson`, `ImplicitJsonSubsetDependency` |
| 20-50 views | ~60 | `TaskResult`, `FileChange`, `ProjectGraphProjectNode` |
| 50-100 views | ~30 | `ProjectGraph`, `Tree`, `generateFiles` |
| 100+ views | ~10 | `Tree`, `ProjectConfiguration`, `Executor` |

**Recommendation:**
- Create ONE consolidated DevKit API reference page with search/filter
- Users can Cmd+F to find what they need
- Link to GitHub source for full details
- Keep only the top 10-15 most-used types as standalone pages

**Estimated reduction: 140 pages**

### Niche Technology Migration Pages (~12 pages)

These migration guides have <50 views and are only relevant during version upgrades:

| Page | Views | Notes |
|------|-------|-------|
| `/technologies/build-tools/rsbuild/migrations` | 6 | |
| `/technologies/dotnet/migrations` | 8 | |
| `/technologies/test-tools/playwright/migrations` | 9 | |
| `/technologies/build-tools/docker/migrations` | 10 | |
| `/technologies/build-tools/rollup/migrations` | 10 | |
| `/technologies/java/migrations` | 12 | |
| `/technologies/eslint/eslint-plugin/migrations` | 23 | |
| `/technologies/vue/nuxt/migrations` | 28 | |
| `/technologies/test-tools/detox/migrations` | 29 | |
| `/technologies/build-tools/esbuild/migrations` | 33 | |
| `/technologies/java/gradle/migrations` | 81 | |
| `/technologies/java/maven/migrations` | 94 | |

**Recommendation:**
- Consolidate into parent technology page as a "Migrations" section
- Or create one "All Migrations" reference page
- Keep Angular/React/Node migrations as standalone (higher traffic)

**Estimated reduction: 10 pages**

---

## Tier 3: Keep but Deprioritize (Don't migrate with high priority)

### Enterprise/Powerpack Pages (~20 pages, <200 views each)

These are sales-driven pages for enterprise customers:

| Page | Views | Notes |
|------|-------|-------|
| `/enterprise/single-tenant/auth-saml` | 7 | |
| `/enterprise/single-tenant/auth-bitbucket-data-center` | 21 | |
| `/enterprise/powerpack/configure-conformance-rules...` | 30 | |
| `/enterprise/powerpack/publish-conformance-rules...` | 33 | |
| `/enterprise/single-tenant/auth-github` | 37 | |
| `/enterprise/single-tenant/auth-bitbucket` | 40 | |
| `/enterprise/single-tenant/auth-gitlab` | 44 | |
| `/enterprise/single-tenant/okta-saml` | 48 | |
| `/enterprise/single-tenant` | 50 | |
| `/enterprise/single-tenant/custom-github-app` | 52 | |
| `/enterprise/powerpack/owners` | 56 | |
| `/enterprise/single-tenant/azure-saml` | 62 | |
| `/enterprise/activate-license` | 66 | |
| `/enterprise/powerpack/licenses-and-trials` | 68 | |
| `/enterprise/owners` | 79 | |
| `/enterprise/metadata-only-workspace` | 105 | |
| `/enterprise/custom-workflows` | 109 | |
| `/enterprise` (index) | 128 | |

**Recommendation:** Keep all - these serve paying customers. Low priority in migration but don't remove.

### Niche Technology Pages (Low traffic but complete)

| Technology | Total Views | Recommendation |
|------------|-------------|----------------|
| Java/Gradle/Maven | ~500 | Keep - niche but complete |
| .NET | ~350 | Keep - growing audience |
| Detox | ~200 | Consider removing if no maintainer |
| Remix | ~300 | Keep - active framework |

---

## Tier 4: High-Bounce Pages to Rewrite (Not Remove)

These pages have traffic but users leave immediately - fix content, don't delete:

| Page | Views | Bounce | Issue |
|------|-------|--------|-------|
| `/features/ci-features/flaky-tasks` | 1,999 | 47% | Needs TL;DR |
| `/features/ci-features/self-healing-ci` | 2,113 | 46% | Too marketing-heavy |
| `/troubleshooting/ci-execution-failed` | 1,159 | 48% | Needs diagnostic flow |
| `/technologies/angular/generators` | 8,010 | 42% | Needs search/filter |
| `/reference/devkit/nx_devkit` | 26 | 186% | Confusing entry point |
| `/reference/deprecated/as-provided-vs-derived` | 86 | 162% | Outdated concept |
| `/enterprise/activate-powerpack` | 133 | 171% | Confusing flow |
| `/reference/powerpack/conformance/overview` | 104 | 158% | |
| `/reference/nx-cloud/release-notes` | 203 | 156% | Maybe move to changelog |

---

## Action Plan

### Phase 1: Quick Wins (Before Migration)
1. **Delete deprecated pages** - Set up redirects to current equivalents
2. **Delete orphaned pages** - No redirects needed (404 → search)
3. **Consolidate migration guides** - Into parent pages

### Phase 2: During Migration
1. **DevKit API consolidation** - Create single searchable page
2. **Don't migrate** low-value pages - Let them 404 → redirect to search

### Phase 3: After Migration
1. **Rewrite high-bounce pages** - Content fixes
2. **Monitor** new structure for emerging dead pages

---

## Estimated Impact

| Metric | Before | After |
|--------|--------|-------|
| Total pages | ~650 | ~570 |
| Deprecated pages | 15 | 0 |
| DevKit API pages | 150 | 15 |
| Migration guide pages | 20 | 8 |
| Migration effort | 650 pages | 570 pages (-12%) |

**Net reduction: ~80 pages (12%)**

The biggest win is DevKit API consolidation - 150 pages that barely anyone visits can become 1 searchable reference page.
