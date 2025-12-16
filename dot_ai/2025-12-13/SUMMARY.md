# Summary - December 13, 2025

## Eng Wrapped Project (eng-wrapped)

Built and refined a "Spotify Wrapped" style presentation for the Nx Engineering team showcasing 2025 accomplishments.

### Key Changes

1. **Moved Projects Showcase Section**
   - Relocated the 80+ Projects showcase (with animated project pills) from section 31 to section 2, placing it right after Big Numbers
   - Removed the 80+ Projects counter from the Big Numbers section to avoid duplication
   - Updated all section numbering throughout the presentation (36 total sections)

2. **Fixed Animation Issues**
   - Fixed LOCStats AnimatedNumber component to use `isActive` prop instead of conditional rendering (was showing 0 for all values)
   - Added missing animations to "Docs Migration to Astro Starlight" section (fadeInUp and iconBounce)
   - Fixed sections 20-27 (Helm Chart through Framework Support) which had incorrect section numbers (were 30-37)

3. **Section Renumbering**
   - Comprehensive renumbering across EngWrapped.jsx, sections.jsx, and data.js
   - Sections 2-30 shifted to 3-31 to accommodate Projects Showcase at position 2
   - Fixed collision issues where multiple sections were referencing the same number

### Files Modified
- `src/EngWrapped.jsx` - Main presentation component
- `src/sections.jsx` - Extracted section components
- `src/data.js` - Slide durations and section count

### Commits
- `dd3efba` - feat: add animated LOC Stats section
- `9ae02d8` - feat: move Projects Showcase after Big Numbers
- `a8902e2` - fix: add animations to Docs Migration section

### Repository
- GitHub: https://github.com/jaysoo/eng-wrapped
