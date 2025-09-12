# Mobile Menu Icon Theme Fix

Linear Issue: DOC-169
Branch: DOC-169
Date: 2025-09-12

## Goal
Fix the mobile menu icon (hamburger menu) in astro-docs to properly respect the theme color, making it visible in both light and dark modes.

## Implementation

### Files Modified
- `astro-docs/src/styles/global.css`: Added CSS styles for mobile menu button theme handling

### Solution
Used CSS-only approach in global.css instead of overriding the entire MobileMenuToggle component (which was overkill).

Added styles for:
1. Icon color (slate-600 for light, slate-200 for dark)
2. Background color (transparent normally, white/slate-900 when expanded)
3. Box shadow removal (none for all states)

### Testing
Verified with Playwright that the fix works in both light and dark themes.

## Result
Successfully fixed the mobile menu icon visibility issue with minimal CSS changes that respect the existing design system.

Commit: 06d0ce43d1 docs(misc): mobile menu icon respects theme color