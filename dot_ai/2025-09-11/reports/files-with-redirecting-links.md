# Files Containing Redirecting Documentation Links

This report shows exactly which files contain the links that are currently redirecting (308) and need to be updated.

## Files to Update

### 1. **nx-dev/ui-common/src/lib/footer.tsx**
- Line 40: `/pricing` → `/nx-cloud#plans`
- Line (already fixed): `/ci/features` → `/docs/features/ci-features` ✅

### 2. **nx-dev/ui-common/src/lib/headers/documentation-header.tsx**
- `/plugin-registry` → `/docs/plugin-registry`
- `/ci/features` → `/docs/features/ci-features`

### 3. **nx-dev/ui-common/src/lib/sidebar.tsx**
- `/ci/features` → `/docs/features/ci-features`

### 4. **nx-dev/ui-home/src/lib/features/features-while-scaling-your-organization.tsx**
- Line 29: `/features/enforce-module-boundaries` → `/docs/features/enforce-module-boundaries`
- Line 37: `/nx-enterprise/powerpack/owners` → `/docs/enterprise/powerpack/owners`
- Line 44: `/nx-enterprise/powerpack/conformance` → `/docs/enterprise/powerpack/conformance`
- Line 53: `/plugin-registry` → `/docs/plugin-registry`
- Line 57: `/features/generate-code` → `/docs/features/generate-code`
- Line 62: `/features/automate-updating-dependencies` → `/docs/features/automate-updating-dependencies`

### 5. **nx-dev/ui-react/src/lib/features.tsx**
- `/features/cache-task-results` → `/docs/features/cache-task-results`
- `/ci/features/distribute-task-execution` → `/docs/features/ci-features/distribute-task-execution`

### 6. **nx-dev/ui-react/src/lib/feature-sections.tsx**
- `/features/cache-task-results` → `/docs/features/cache-task-results`

### 7. **nx-dev/ui-gradle/src/lib/features.tsx**
- `/features/cache-task-results` → `/docs/features/cache-task-results`

### 8. **nx-dev/ui-enterprise/src/lib/solutions/management/keep-teams-aligned.tsx**
- `/features/enhance-AI` → `/docs/features/enhance-ai`

### 9. **nx-dev/ui-enterprise/src/lib/solutions/leadership/build-a-modern-engineering-organization.tsx**
- `/features/enhance-AI` → `/docs/features/enhance-ai`

### 10. **nx-dev/ui-enterprise/src/lib/solutions/engineering/developer-experience-that-works-for-you.tsx**
- `/features/enhance-AI` → `/docs/features/enhance-ai`

### 11. **nx-dev/ui-enterprise/src/lib/solutions/engineering/all-speed-no-stress.tsx**
- `/ci/features/remote-cache` → `/docs/features/ci-features/remote-cache`

### 12. **nx-dev/ui-contact/src/lib/contact-links.tsx**
- `/getting-started/intro` → `/docs/getting-started/intro`

### 13. **nx-dev/ui-pricing/src/lib/plans-display.tsx**
- `/ci/features/remote-cache` → `/docs/features/ci-features/remote-cache`
- `/ci/features/distribute-task-execution` → `/docs/features/ci-features/distribute-task-execution`

### 14. **nx-dev/ui-cloud/src/lib/pricing.tsx**
- `/ci/features/remote-cache` → `/docs/features/ci-features/remote-cache`
- `/ci/features/distribute-task-execution` → `/docs/features/ci-features/distribute-task-execution`

### 15. **nx-dev/ui-powerpack/src/lib/get-started.tsx**
- `/nx-enterprise/powerpack/owners` → `/docs/enterprise/powerpack/owners`
- `/nx-enterprise/powerpack/conformance` → `/docs/enterprise/powerpack/conformance`

### 16. **nx-dev/ui-powerpack/src/lib/powerpack-features.tsx**
- `/nx-enterprise/powerpack/owners` → `/docs/enterprise/powerpack/owners`
- `/nx-enterprise/powerpack/conformance` → `/docs/enterprise/powerpack/conformance`

### 17. **nx-dev/ui-community/src/lib/connect-with-us.tsx**
- `/plugin-registry` → `/docs/plugin-registry`

## Summary by Component

| Component | Files to Update | Links to Fix |
|-----------|----------------|--------------|
| ui-common | 3 files | 4 links |
| ui-home | 1 file | 6 links |
| ui-react | 2 files | 3 links |
| ui-gradle | 1 file | 1 link |
| ui-enterprise | 3 files | 4 links |
| ui-contact | 1 file | 1 link |
| ui-pricing | 1 file | 2 links |
| ui-cloud | 1 file | 2 links |
| ui-powerpack | 2 files | 4 links |
| ui-community | 1 file | 1 link |

**Total: 16 files containing 28 links that need updating**

## Implementation Pattern

All links should be updated to conditionally check `NEXT_PUBLIC_ASTRO_URL`:

```tsx
// Before:
href="/features/cache-task-results"

// After:
href={process.env.NEXT_PUBLIC_ASTRO_URL ? "/docs/features/cache-task-results" : "/features/cache-task-results"}
```

## Links Not Found in Code

These URLs are redirecting but weren't found in the TSX/JSX files (might be in markdown, generated dynamically, or in the homepage):

- `/concepts/decisions/why-monorepos`
- `/features/run-tasks`
- `/recipes/running-tasks/terminal-ui`
- `/concepts/nx-plugins`
- `/ci/features/self-healing-ci`

These are likely referenced in:
- The homepage directly (loaded from elsewhere)
- Blog posts (markdown files)
- Dynamically generated content