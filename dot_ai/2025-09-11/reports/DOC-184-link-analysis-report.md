# DOC-184: Documentation Link Analysis Report

## Executive Summary

After comprehensive analysis of the nx.dev codebase, I've identified the following documentation URLs that need to be updated to conditionally use the new `/docs` prefix based on the `NEXT_PUBLIC_ASTRO_URL` environment variable:

- **37 files in nx-dev UI libraries** containing 143 documentation URLs
- **0 files in nx-dev/nx-dev/pages** (already handled by redirect rules)  
- **0 files in nx-dev/nx-dev/app**
- **124 files in docs/blog** containing over 1000 markdown documentation links

## Already Completed

### Static URLs Updated (3 files)
1. **nx-dev/ui-common/src/lib/footer.tsx** - Line 40
2. **nx-dev/nx-dev/pages/plugin-registry.tsx** - Line 238
3. **nx-dev/nx-dev/pages/changelog.tsx** - Line 77

All three have been updated to conditionally check `NEXT_PUBLIC_ASTRO_URL`.

## UI Libraries Analysis (37 files, 143 URLs)

### High-Priority Components (Customer-Facing)

#### nx-dev/ui-enterprise (11 files)
- Marketing pages with direct doc links
- Critical for enterprise customers
- Examples: `/features/*`, `/ci/features/*`, `/concepts/*`

#### nx-dev/ui-home (9 files) 
- Homepage components
- High visibility to all users
- Examples: `/getting-started/*`, `/features/*`, `/customers`

#### nx-dev/ui-react (4 files)
- React-specific documentation links
- Example: `/getting-started/tutorials/react-monorepo-tutorial`

#### nx-dev/ui-ai-landing-page (4 files)
- AI features landing page
- Example: `/features/enhance-AI`

### Medium-Priority Components

#### nx-dev/ui-gradle (3 files)
- Gradle integration pages
- Example: `/getting-started/tutorials/gradle-tutorial`

#### nx-dev/ui-remote-cache (2 files)
- Remote cache feature pages
- Example: `/ci/features/remote-cache`

#### nx-dev/ui-cloud (1 file)
#### nx-dev/ui-contact (1 file)
#### nx-dev/ui-powerpack (1 file)
#### nx-dev/ui-pricing (1 file)

## Blog Analysis (124 files, 1000+ URLs)

The blog contains markdown links in the format `[text](/path)` that point to documentation pages. These are static markdown files that would need different handling than JSX/TSX components.

### Top Blog Posts by Doc URL Count
1. **2022-03-29-the-react-cli-you-always-wanted-but-didnt-know-about.md** - 18 URLs
2. **2024-08-01-nx-19-5-update.md** - 26 URLs  
3. **2025-01-29-new-nx-experience.md** - 11 URLs
4. **2024-12-22-nx-highlights-2024.md** - 14 URLs
5. **2025-02-17-monorepos-are-ai-future-proof.md** - 13 URLs

## Dynamic URL Usage (Documented for Later)

Created `dynamic-urls-to-review.md` listing all components using dynamic href values that need manual inspection.

## Recommendations

### Phase 1: High-Priority UI Components (Immediate)
Update the 37 UI library files with conditional URL logic:
```tsx
href={process.env.NEXT_PUBLIC_ASTRO_URL ? '/docs/...' : '/...'}
```

### Phase 2: Blog Content (Consider Alternatives)
Options for blog posts:
1. **Build-time transformation** - Process markdown during build to inject correct URLs
2. **Runtime transformation** - Handle in markdown rendering pipeline
3. **Leave as-is** - Rely on redirect rules for blog links
4. **Script-based update** - Write a script to conditionally update all blog markdown files

### Phase 3: Dynamic URLs (Manual Review)
Review the documented dynamic URL usages to determine which need updates.

## Technical Considerations

1. **Environment Variable Access**: `process.env.NEXT_PUBLIC_ASTRO_URL` is replaced at build time in Next.js
2. **Link vs href**: Link components use client-side routing, regular hrefs will trigger server redirects
3. **Maintenance**: This is temporary - will be removed once fully migrated to Astro docs
4. **Testing**: Ensure both paths work correctly (with and without ASTRO_URL set)

## Next Steps

1. Should we proceed with updating all 37 UI library files?
2. What approach should we take for blog posts?
3. Priority order for components?