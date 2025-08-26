# Redirect Analysis Report for canary.nx.dev

Generated: 2025-08-25T18:47:07.574Z
URL: https://canary.nx.dev
Total redirect rules analyzed: 1078

## Summary

| Category | Count | Percentage |
|----------|-------|------------|
| ✅ Working Redirects | 1 | 0.1% |
| ⚠️ Potentially Fixed | 1076 | 99.8% |
| ❌ Broken Links | 1 | 0.1% |

## ✅ WORKING REDIRECTS (1)

Sample of working redirects:

- `/getting-started/intro` → `/docs/getting-started/intro` ✓

## ❌ BROKEN LINKS (1)

These URLs return 404 or errors:

### 404 Not Found (1)

- `/nx-api/nx/documents/affected%23skip-nx-cache` → `/docs/nx-api/nx/documents/affected%23skip-nx-cache`

## ⚠️ POTENTIALLY FIXED LINKS (1076)

These URLs redirect to a different location than specified in the redirect rules.
They may have been restructured in the new documentation:

### Other Redirects

- `/ci`
  - Redirect rule expects: `/docs/ci`
  - Actually redirects to: `/ci/getting-started/intro`
- `/extending-nx`
  - Redirect rule expects: `/docs/extending-nx`
  - Actually redirects to: `/extending-nx`
- `/plugin-registry`
  - Redirect rule expects: `/docs/plugin-registry`
  - Actually redirects to: `/plugin-registry`
- `/getting-started`
  - Redirect rule expects: `/docs/getting-started`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/installation`
  - Redirect rule expects: `/docs/getting-started/installation`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/start-new-project`
  - Redirect rule expects: `/docs/getting-started/start-new-project`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/adding-to-existing`
  - Redirect rule expects: `/docs/getting-started/adding-to-existing`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/editor-setup`
  - Redirect rule expects: `/docs/getting-started/editor-setup`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/ai-integration`
  - Redirect rule expects: `/docs/getting-started/ai-integration`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/tutorials`
  - Redirect rule expects: `/docs/getting-started/tutorials`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/tutorials/typescript-packages-tutorial`
  - Redirect rule expects: `/docs/getting-started/tutorials/typescript-packages-tutorial`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/tutorials/react-monorepo-tutorial`
  - Redirect rule expects: `/docs/getting-started/tutorials/react-monorepo-tutorial`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/tutorials/angular-monorepo-tutorial`
  - Redirect rule expects: `/docs/getting-started/tutorials/angular-monorepo-tutorial`
  - Actually redirects to: `/docs/getting-started/intro`
- `/getting-started/tutorials/gradle-tutorial`
  - Redirect rule expects: `/docs/getting-started/tutorials/gradle-tutorial`
  - Actually redirects to: `/docs/getting-started/intro`
- `/features`
  - Redirect rule expects: `/docs/features`
  - Actually redirects to: `/features`
- `/features/run-tasks`
  - Redirect rule expects: `/docs/features/run-tasks`
  - Actually redirects to: `/features/run-tasks`
- `/features/cache-task-results`
  - Redirect rule expects: `/docs/features/cache-task-results`
  - Actually redirects to: `/features/cache-task-results`
- `/features/enhance-AI`
  - Redirect rule expects: `/docs/features/enhance-AI`
  - Actually redirects to: `/features/enhance-AI`
- `/features/explore-graph`
  - Redirect rule expects: `/docs/features/explore-graph`
  - Actually redirects to: `/features/explore-graph`
- `/features/generate-code`
  - Redirect rule expects: `/docs/features/generate-code`
  - Actually redirects to: `/features/generate-code`

... and 1056 more redirects

## Recommendations

1. **Review Broken Links**: Update redirect rules for URLs that return 404
2. **Verify Potentially Fixed Links**: Check if the actual redirect destinations are correct
3. **Update Redirect Rules**: Align the redirect-rules-docs-to-astro.js file with actual redirects
4. **Consider URL Structure**: Many redirects follow patterns (e.g., `/nx-api/*` → `/technologies/*/api`)
