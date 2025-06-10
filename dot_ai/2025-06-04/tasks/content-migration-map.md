# Content Migration Map for Intro Page

## What's Being Removed and Where It Goes

### 1. **Core Features Section** (lines 12-22)
**Current Location**: Main intro page
**New Location**: `/getting-started/why-nx`
**Reason**: Too detailed for first impression, better as second-level content

### 2. **Technology Stack Grid** (lines 79-108)
**Current Location**: "Pick Your Stack!" section with 23 options
**New Location**: `/getting-started/supported-technologies`
**Reason**: Overwhelming choice paradox for newcomers

### 3. **Multiple Tutorial Links** (lines 68-77)
**Current Location**: "Learn Nx" section with 8 cards
**New Location**: `/getting-started/tutorials` (consolidated page)
**Reason**: Too many options before showing value

### 4. **Connect With Us Section** (lines 110-119)
**Current Location**: Bottom of intro
**New Location**: Site footer (global) + `/community`
**Reason**: Not essential for getting started

### 5. **Recipe Cards** (lines 41-51)
**Current Location**: "Try Nx Yourself!" section
**New Location**: Progressive disclosure after user completes first steps
**Reason**: Migration paths are advanced topics

## What's Staying (But Simplified)

### 1. **Page Title & Meta**
- Keep SEO-optimized description
- Update to focus on speed benefit

### 2. **Primary CTA**
- Simplify from two options to one primary path
- Secondary option available but de-emphasized

### 3. **GitHub Star Button**
- Move to less prominent position
- Make it smaller/compact

## New Content Being Added

### 1. **Interactive Demo**
- Terminal animation showing before/after
- No user action required to see value

### 2. **Visual Explanation**
- Simple diagram of task graph
- Shows why Nx is fast

### 3. **Progressive Disclosure Cards**
- Only 4 options (not 23)
- Clear next steps based on user intent

## Content Priority Changes

### Before (Current Priority):
1. What Nx is (conceptual)
2. Feature list
3. Multiple ways to start
4. Technology choices
5. Community

### After (New Priority):
1. Value proposition (10x faster)
2. See it work (demo)
3. Do it yourself (3 steps)
4. Understand what happened
5. Choose your path

## URL Structure Recommendations

```
/getting-started/
  ├── intro (simplified - Phase 1)
  ├── why-nx (detailed features)
  ├── installation (detailed install options)
  ├── tutorials/
  │   ├── typescript-packages
  │   ├── react-monorepo
  │   ├── angular-monorepo
  │   └── gradle
  ├── supported-technologies
  └── frameworks/
      ├── react
      ├── angular
      ├── vue
      └── node
```

## Migration Checklist

- [ ] Create new simplified intro.md
- [ ] Move Core Features to why-nx.md
- [ ] Create supported-technologies.md for stack grid
- [ ] Consolidate tutorials to single index
- [ ] Update navigation menu
- [ ] Add redirects for any URL changes
- [ ] Update internal links
- [ ] Test all moved content
- [ ] Deploy to canary for testing
- [ ] Monitor analytics for impact