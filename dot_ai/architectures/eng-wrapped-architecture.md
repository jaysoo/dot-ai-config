# eng-wrapped Architecture

A "Spotify Wrapped" style presentation showcasing Nx Engineering team's 2025 accomplishments.

**Repository**: https://github.com/jaysoo/eng-wrapped
**Last Updated**: 2025-12-13

## Directory Overview

```
eng-wrapped/
├── src/
│   ├── EngWrapped.jsx    # Main presentation component (96KB, ~1900 lines)
│   ├── sections.jsx      # Extracted section components (highlights, stats, closing)
│   ├── components.jsx    # Reusable components (AnimatedNumber, ProjectsShowcase, etc.)
│   ├── data.js           # Team colors, commit data, slide durations, project lists
│   ├── keyframes.css     # All CSS animations
│   ├── App.jsx           # Root app component
│   └── main.jsx          # Entry point
├── public/               # Static assets (images, screenshots)
└── dist/                 # Build output
```

## Technology Stack

- **Framework**: React (Vite)
- **Styling**: Tailwind CSS + CSS keyframe animations
- **Charts**: Recharts (PieChart, BarChart)
- **Build**: Vite with image optimization

## Key Concepts

### Section-Based Slide System

The presentation is organized into 36 sections (0-35), each controlled by `activeSection` state:

```jsx
// Animations trigger when section becomes active
style={{ animation: activeSection === 2 ? 'fadeInUp 0.5s ease-out both' : 'none' }}
```

### Slide Duration Array

`data.js` contains `slideDurations` array that controls auto-play timing:
```javascript
export const slideDurations = [
  2800,  // 0: Hero
  3800,  // 1: Big Numbers
  6000,  // 2: Projects Showcase
  // ... etc
];
```

### AnimatedNumber Component

Counter animation component that requires `isActive` prop:
```jsx
// CORRECT - pass isActive prop
<AnimatedNumber value={4454661} duration={2000} isActive={isActive} />

// WRONG - conditional rendering doesn't trigger animation
{isActive && <AnimatedNumber value={4454661} duration={2000} />}
```

## Section Order (as of 2025-12-13)

0. Hero
1. Big Numbers (Commits, LOC, Teams)
2. Projects Showcase (80+ Projects with pills)
3. Team Shakeup Intro
4. RedPanda Team Formation
5. Orca Introduction
6. Meet the Teams
7. Big Features Intro
8-27. Individual Feature Slides
28. Orca Highlights
29. Infrastructure Highlights
30. RedPanda Highlights
31. Stats Intro
32. Projects Breakdown (Pie chart)
33. LOC Stats (Insertions/Deletions)
34. Top Contributors (Bar chart)
35. Closing

## Personal Work History

### December 13, 2025

**Commits**: `dd3efba`, `9ae02d8`, `a8902e2`

- Added LOC Stats section with animated counters
- Moved Projects Showcase from section 31 to section 2
- Fixed AnimatedNumber usage in LOCStats
- Fixed section numbering (30-37 → 20-27)
- Added animations to Docs Migration section

### Previous Work (December 11-12, 2025)

- Initial presentation build
- Added all feature slides
- Implemented animations (Self-Healing CI, Terminal UI, Continuous Tasks)
- Code splitting (extracted components.jsx, sections.jsx, keyframes.css, data.js)
- Image optimization during build
- Fixed various animation timing issues

## Design Decisions & Gotchas

### Section Renumbering Complexity

When inserting/moving sections, ALL section references must be updated:
- `EngWrapped.jsx` - inline `activeSection === N` checks
- `sections.jsx` - extracted component checks
- `data.js` - slideDurations array and comments

**Lesson**: Use sed carefully from highest to lowest number to avoid conflicts.

### AnimatedNumber isActive Prop

The `AnimatedNumber` component in `components.jsx` expects an `isActive` boolean prop. Without it, the counter shows 0. Don't use conditional rendering.

### CSS Animation Patterns

All entry animations use `animation-fill-mode: both` to hold final state:
```css
animation: fadeInUp 0.5s ease-out 0.1s both
```

### Team Color System

Colors defined in `data.js`:
```javascript
export const teamColors = {
  infrastructure: '#22c55e',
  cli: '#3b82f6',
  cloud: '#a855f7',
  redpanda: '#f97316',
  docs: '#ec4899'
};
```

## Files Reference

| File | Purpose | Notes |
|------|---------|-------|
| `EngWrapped.jsx` | Main slides 0-27 | Large file (~96KB) |
| `sections.jsx` | Slides 28-35 | Highlights, stats, closing |
| `components.jsx` | Reusable components | AnimatedNumber, ProjectsShowcase, Section |
| `data.js` | Static data | Colors, durations, project lists |
| `keyframes.css` | All animations | fadeInUp, bounceIn, etc. |
