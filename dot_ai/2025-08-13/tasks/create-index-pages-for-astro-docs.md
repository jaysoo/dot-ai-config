# Task: Create Index Pages for Astro Docs

## Problem Statement
The broken card links in astro-docs are due to missing index pages. URLs like `/technologies`, `/features`, `/concepts`, `/courses`, and `/getting-started` need index pages that list their child pages as cards.

## Reference Spec
- Linear Issue: DOC-116 (https://linear.app/nxdev/issue/DOC-116/card-links-on-getting-started-are-broken)
- The intro page at `/getting-started/intro` has linkcard references that need working index pages

## Solution: Option A - Static Index Pages with Custom Component

We'll create explicit index.mdoc files that use a reusable Astro component to dynamically list child pages. This maintains consistency with the existing docs structure while providing automatic card generation.

## Implementation Plan

### Phase 1: Create the Reusable Component
**File**: `astro-docs/src/components/markdoc/index_page_cards.astro`

This component will:
1. Accept a `path` prop (e.g., "technologies", "features")
2. Use `getCollection('docs')` to fetch all docs
3. Filter for immediate children of the path (not nested subdirectories)
4. Sort pages by sidebar order or alphabetically
5. Render cards using the existing LinkCard component pattern

**Component Structure**:
```astro
---
import { getCollection } from 'astro:content';
import { CardGrid } from '@astrojs/starlight/components';

const { path } = Astro.props;

// Get all immediate child pages (not index, not nested)
const childPages = await getCollection('docs', ({ id }) => {
  const parts = id.split('/');
  return id.startsWith(`${path}/`) && 
         parts.length === 2 && 
         !id.endsWith('/index');
});

// Sort by sidebar order if available, then by title
const sortedPages = childPages.sort((a, b) => {
  const orderA = a.data.sidebar?.order ?? 999;
  const orderB = b.data.sidebar?.order ?? 999;
  if (orderA !== orderB) return orderA - orderB;
  return a.data.title.localeCompare(b.data.title);
});
---

<CardGrid>
  {sortedPages.map(page => (
    <LinkCard 
      title={page.data.title}
      description={page.data.description || ''}
      href={`/${page.id.replace('.mdoc', '')}`}
    />
  ))}
</CardGrid>
```

### Phase 2: Register Component with Markdoc

**File**: Update markdoc configuration to include the new component

The component needs to be registered so it can be used in .mdoc files with a tag like:
```
{% index_page_cards path="technologies" /%}
```

### Phase 3: Create Index Pages

#### 3.1 Technologies Index
**File**: `astro-docs/src/content/docs/technologies/index.mdoc`
```markdown
---
title: Technologies
description: Explore Nx's technology integrations and how it can support your specific stack
sidebar:
  order: 1
---

Nx provides first-class support for many technologies through dedicated plugins. Each plugin offers generators, executors, and integrations tailored to that technology's best practices.

{% index_page_cards path="technologies" /%}
```

#### 3.2 Features Index
**File**: `astro-docs/src/content/docs/features/index.mdoc`
```markdown
---
title: Features
description: Discover all the powerful features that Nx provides to streamline your workflow
sidebar:
  order: 1
---

Nx offers a comprehensive set of features designed to improve developer productivity, maintain code quality, and optimize build performance.

{% index_page_cards path="features" /%}
```

#### 3.3 Concepts Index
**File**: `astro-docs/src/content/docs/concepts/index.mdoc`
```markdown
---
title: Concepts
description: Understand the core concepts of how Nx works under the hood
sidebar:
  order: 1
---

Learn about the fundamental concepts and architecture that power Nx's build system and development workflow.

{% index_page_cards path="concepts" /%}
```

#### 3.4 Getting Started Index
**File**: `astro-docs/src/content/docs/getting-started/index.mdoc`
```markdown
---
title: Getting Started
description: Get up and running with Nx in your development workflow
sidebar:
  order: 0
  label: Overview
---

Start your journey with Nx. Whether you're creating a new project or adding Nx to an existing codebase, we've got you covered.

{% index_page_cards path="getting-started" /%}
```

#### 3.5 Courses Index (if needed)
**File**: `astro-docs/src/content/docs/courses/index.mdoc`
```markdown
---
title: Courses
description: Learn Nx through comprehensive video courses and tutorials
sidebar:
  order: 1
---

Dive deeper into Nx with our curated video courses that walk you through concepts and real-world applications.

{% index_page_cards path="courses" /%}
```

### Phase 4: Handle Special Cases

1. **Nested Sections**: For sections with subdirectories (like `features/CI Features/`), we need to decide:
   - Show only immediate children (recommended)
   - Or group by subdirectory with section headers

2. **Empty Sections**: Handle cases where a section might not have any child pages

3. **Courses**: Check if `/courses` directory exists or if it needs special handling

### Phase 5: Update the Intro Page Links

**File**: `astro-docs/src/content/docs/getting-started/intro.mdoc`

Update the broken links to point to the correct paths:
- `/getting-started` → `/getting-started` (will now work with index page)
- `/technologies` → `/technologies` (will now work with index page)
- `/features` → `/features` (will now work with index page)
- `/concepts` → `/concepts` (will now work with index page)
- `/courses` → `/courses` (verify this path exists)

## Implementation Steps

### Step 1: Create Component Infrastructure
- [x] Create `index_page_cards.astro` component
- [x] Test component with hardcoded path
- [x] Register component with Markdoc configuration
- [x] Verify component can be used in .mdoc files

### Step 2: Create Index Pages
- [x] Create `/technologies/index.mdoc`
- [x] Create `/features/index.mdoc`
- [x] Create `/concepts/index.mdoc`
- [x] Create `/getting-started/index.mdoc`
- [x] Verify if `/courses` exists and create index if needed (No courses directory - linked to external URL instead)

### Step 3: Test and Refine
- [x] Test each index page renders correctly
- [x] Verify cards show correct titles and descriptions
- [x] Check that links navigate to correct pages
- [x] Test responsive layout
- [x] Handle edge cases (empty sections, missing descriptions)

### Step 4: Final Verification
- [x] Navigate from intro page to each section
- [x] Verify all broken links are fixed
- [x] Check sidebar navigation works correctly
- [x] Test on local Astro dev server

## Technical Considerations

1. **Performance**: The component fetches all docs on each render. Consider caching if needed.

2. **Sorting**: Respect sidebar order from frontmatter, fallback to alphabetical.

3. **Filtering**: Ensure we only get immediate children, not deeply nested pages.

4. **URLs**: Handle the `.mdoc` extension removal for proper routing.

5. **Consistency**: Match the card styling from existing pages like plugin-registry.

## Expected Outcome
- All index pages render with cards showing child pages
- Links from intro page work correctly
- Navigation is intuitive and consistent
- No more 404 errors on section index pages
- Maintains explicit control over each index page's content

## CRITICAL: Implementation Tracking
- Keep track of progress in this document as tasks are completed
- Update TODOs as work progresses
- Document any issues or alternatives tried
- Test each component before moving to the next phase

## Progress Log

### Commit 1: Initial Implementation (a63d9449cb)
**Completed:**
- ✅ Created index_page_cards.astro component
- ✅ Registered component in markdoc.config.mjs
- ✅ Created all 4 index pages (technologies, features, concepts, getting-started)
- ✅ Fixed links in intro.mdoc
- ✅ Updated courses link to external URL

**Current Issue:**
- Getting error on root page: `The prop 'href' expects a 'string' or 'object' in '<Link>', but got 'undefined' instead`
- Problem: LinkCard component expects `url` prop but we're passing `href`
- Need to create proper prop mapping in the LinkCard.astro wrapper

### Commit 2: Fix LinkCard Props (a837a449de)
**Fixed:**
- ✅ Updated LinkCard.astro wrapper to map `href` to `url`
- ✅ Added logic to use Card component for linkcard tags with descriptions
- ✅ Fixed undefined URL error

**Testing Status:**
- localhost:4322 - Root page should now work without errors
- Need to test: /technologies, /features, /concepts, /getting-started pages

### Commit 3: Handle Subdirectory Introduction Pages (97a176c558)
**Improved:**
- ✅ Updated filtering to find introduction.mdoc files in subdirectories
- ✅ Map `subdirectory/introduction.mdoc` to show as subdirectory card
- ✅ Added proper title mapping for technology names (Angular, React, etc.)
- ✅ Link cards to parent directory instead of introduction page

**How it works now:**
- For `/technologies`: Shows cards for each technology (Angular, React, Vue, etc.)
- Each card links to `/technologies/angular` (not `/technologies/angular/introduction`)
- Titles are properly formatted (e.g., "Angular" instead of "introduction")
- Direct child files are still included (for features like `automate-updating-dependencies.mdoc`)

### Final Status:
1. ✅ Fix the LinkCard.astro wrapper to properly map `href` to `url`
2. ✅ Ensure all props are passed correctly between markdoc and React components
3. ✅ Test all pages to ensure cards render properly
4. ✅ Handle edge cases for subdirectories with introduction pages

## Summary
Successfully implemented index pages for Astro docs that automatically generate card listings from the content structure. The solution handles both direct child pages and subdirectories with introduction pages, providing a clean navigation experience similar to the nx.dev site.
