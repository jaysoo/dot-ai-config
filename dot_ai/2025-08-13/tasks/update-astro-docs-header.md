# Update Astro Docs Header to Match Production

**Task**: Update the Astro docs site header to match the production nx.dev header
**Linear Issue**: https://linear.app/nxdev/issue/DOC-111/update-header-to-match-production
**Date**: 2025-08-13

## Goal
Update the astro-docs site header to have the same navigation structure and appearance as the production nx.dev site.

## Plan

### Phase 1: Analysis ✅
- [x] Analyze production header on nx.dev
- [x] Analyze current Astro docs header
- [x] Identify differences between headers

### Phase 2: Implementation ✅
- [x] Create custom Header component
- [x] Add navigation menu items in correct order
- [x] Keep search functionality
- [x] Add social icons back
- [x] Add theme switcher back
- [x] Remove Solutions dropdown (per user request)
- [x] Implement Resources dropdown
- [x] Add version switcher (v21, v20, v19)
- [x] Reorder navigation to match production
- [x] Add dividers between navigation sections

### Phase 3: Testing ✅
- [x] Test on localhost:4323
- [x] Verify styling matches production
- [x] Verify responsive behavior

## Implementation Details

### Components Modified
1. **Created**: `/src/components/layout/Header.astro`
   - Custom header component with navigation menu
   - Includes all nav items from production
   - Preserves social icons and theme switcher

2. **Updated**: `astro.config.mjs`
   - Added Header component to the components override

### Final Implementation ✅

#### Header Structure (Left to Right):
1. **Left Section**:
   - Nx Logo
   - "Docs" link
   - Version switcher (v21, v20, v19)

2. **Navigation Menu**:
   - Blog
   - Resources (dropdown)
   - | (divider)
   - AI
   - Nx Cloud
   - | (divider)
   - Nx Enterprise

3. **Search Bar**

4. **Right Section**:
   - Social Icons (GitHub, YouTube, X, Discord)
   - Theme Switcher

#### Version Switcher Details:
- Current version: v21 (links to current site `/`)
- Previous versions:
  - v20 (links to https://20.nx.dev)
  - v19 (links to https://19.nx.dev)
- Styled with border and dropdown arrow
- Positioned between logo/Docs link

#### Resources Dropdown Items:
- Tutorials
- Code Examples
- Video Courses
- Webinars
- Community
- Discord

## Phase 4: Transition back to Astro (Completed)

- [x] Revert from React component back to pure Astro component
- [x] Keep all functionality (dropdowns, version switcher, navigation)
- [x] Use Starlight CSS variables instead of Tailwind classes
- [x] Ensure proper styling using Starlight's design system
- [x] Test all interactions still work

## Current Status

✅ **COMPLETED** - Header has been successfully updated to match production (nx.dev) with all requested features:
- Version switcher (v21, v20, v19) in top-left
- Navigation items in correct order: Blog, Resources (dropdown), | AI, Nx Cloud | Enterprise
- Resources dropdown with 11 items (updated list from production)
- Social icons and theme switcher maintained
- All using Starlight CSS variables for consistent theming
- Server running on localhost:4321
- Build verified working without errors

## Notes
- Astro Starlight uses virtual component imports
- Social icons and theme switcher components are from Starlight
- Dropdown menus use JavaScript for interaction
- Version switcher matches production docs page placement
- Navigation order and dividers match production exactly
- Reverted from React back to Astro due to styling issues
- Using Starlight CSS variables for consistent theming across light/dark modes