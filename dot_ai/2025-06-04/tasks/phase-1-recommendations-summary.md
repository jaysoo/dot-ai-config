# Phase 1: Intro Page Simplification - Summary & Recommendations

## Executive Summary

The current intro page tries to showcase everything Nx can do, resulting in:
- **697 words** (should be <300 for intro)
- **19 links** competing for attention
- **6 feature descriptions** before showing value
- **23 technology options** presented at once
- Multiple pathways without clear prioritization

**Key Problem:** Users have to read through features and make choices before seeing any value.

## Specific Changes for Phase 1

### 1. **New Hero Section**
Replace current intro paragraph with:
```markdown
# Make Your Builds 10x Faster

Nx understands your code and only runs what's needed.

[Install Nx] [Watch 2-min Demo]
```

### 2. **Immediate Value Demo**
Add interactive terminal showing before/after:
- Before: `npm run build` (45 seconds)
- After: `npm run build` (4 seconds - cached)

### 3. **Simplify "Try Nx Yourself" Section**
Current: Two options side-by-side
New: Single primary path
```markdown
## Get Started in 3 Steps

1. brew install nx
2. nx init
3. nx build

✨ That's it! Your builds are now cached.
```

### 4. **Content to Remove/Relocate**

**Remove from intro page:**
- Core Features section (move to "Why Nx" page)
- Technology grid (23 options!) - move to "Supported Technologies"
- Community links - move to footer
- Multiple tutorial/video cards - consolidate to one "Learn More" section

**Keep but simplify:**
- One primary CTA: Install
- One demo video (2 minutes max)
- Progressive disclosure section at bottom

### 5. **Video Content Plan**

**Primary Video (2 minutes):**
- 0:00-0:15: "Your builds are slow"
- 0:15-0:45: Add Nx to existing project
- 0:45-1:30: First cached build demo
- 1:30-2:00: Time saved visualization

### 6. **Progressive Disclosure Section**
Replace current sections with 4 clear paths:
```
Ready for More?
┌─────────────────┐ ┌─────────────────┐
│ Advanced        │ │ New Project     │
│ Caching         │ │ Setup           │
└─────────────────┘ └─────────────────┘
┌─────────────────┐ ┌─────────────────┐
│ CI              │ │ Framework       │
│ Optimization    │ │ Guides          │
└─────────────────┘ └─────────────────┘
```

## Implementation Steps

1. **Create new intro.md** with simplified content
2. **Move existing content** to appropriate subpages
3. **Create/embed demo video**
4. **Add analytics tracking** for conversion metrics
5. **A/B test** the new page against current

## Success Metrics

- **Time to first command**: < 60 seconds
- **Bounce rate**: Reduce by 30%
- **Video completion**: > 80%
- **Installation starts**: Increase by 50%

## Quick Mockup Tools

### For Visual Design:
1. **v0 by Vercel**: https://v0.dev
   - Use prompt from phase-1-simplify-intro-page.md
   
2. **Excalidraw**: https://excalidraw.com
   - Quick wireframes (see intro-page-wireframe.md)

3. **CodeSandbox**: For interactive demo
   - Create simple Nx project
   - Pre-populate with commands
   - Show cache hits visually

### For Video Creation:
1. **Loom**: Quick screen recording
2. **ScreenFlow**: Professional editing
3. **After Effects**: For animations

## Next Actions

1. **Immediate**: Create v0 mockup for stakeholder review
2. **This week**: Write new intro.md content
3. **Next week**: Create demo video
4. **Testing**: Deploy to canary for A/B testing

## Risk Mitigation

- Keep existing content accessible via navigation
- Provide "Advanced Users" link for those wanting comprehensive info
- Monitor analytics closely for any negative impact
- Have rollback plan ready

The goal is to transform the intro from an encyclopedia to a focused onboarding experience that gets users to value in under 2 minutes.