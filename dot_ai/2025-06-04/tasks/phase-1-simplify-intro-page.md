# Phase 1: Simplify the Intro Page - Detailed Plan

## Current State Analysis

The current `/getting-started/intro` page tries to be everything to everyone:
- Comprehensive feature list
- Multiple starting paths
- Extensive resource links
- Community connections
- Technology showcase

**Problem:** This creates decision paralysis for newcomers who just want to see what Nx can do for them.

## Proposed New Structure

### Above the Fold - "Hero Section"

**Goal:** Get to value in under 60 seconds

```
# Make Your Builds 10x Faster

Nx is a build system that understands your code and only runs what's needed.

[Install Nx] [Watch 2-min Demo]
```

### Section 1: See It In Action (Interactive Demo)

**Embedded terminal demo showing:**
```bash
# Before Nx (show slow build)
$ npm run build  # Takes 45 seconds

# After Nx (same command, faster)
$ npm run build  # Takes 4 seconds (cached)
```

### Section 2: Get Started in 3 Steps

```
1. Install Nx
   brew install nx
   # or
   npm install -g nx

2. Add to Your Project
   nx init

3. Run Your First Cached Build
   nx build
```

### Section 3: What Just Happened?

Quick visual explanation:
- Task graph visualization
- Cache hit indicator
- Time saved counter

### Section 4: Ready for More?

Progressive disclosure buttons:
- "I want to see more caching features" → Advanced caching docs
- "I'm starting a new project" → Create workspace guide
- "I want CI optimization" → CI setup guide
- "Show me framework guides" → React/Angular/Vue paths

## Content to Move/Remove

### Move to Subpages:
1. **Detailed feature list** → Move to "Why Nx" page
2. **Technology grid** → Move to "Supported Technologies" page
3. **Community links** → Move to footer or "Community" page
4. **Course/tutorial links** → Move to "Learning Resources" page

### Remove/Defer:
1. Multiple installation methods (keep only the simplest)
2. Conceptual explanations before showing value
3. Links to advanced topics on the intro page

## Video Content Suggestions

### Primary Video (2 minutes):
**"See Nx in Action"**
- 0:00-0:15 - Problem: "Your builds are slow"
- 0:15-0:45 - Solution: Add Nx to existing project
- 0:45-1:30 - Demo: First cached build
- 1:30-2:00 - Result: 10x faster builds

### Secondary Videos (30-60 seconds each):
1. "Nx + Your Framework" - Quick demos for React, Angular, Vue
2. "From Local to CI" - Show same caching working in CI
3. "Task Orchestration" - Show parallel execution

## Interactive Elements

### Live Playground
Embed a CodeSandbox/StackBlitz that shows:
- A simple project with Nx already set up
- Pre-populated commands to run
- Visual feedback showing cache hits

### Speed Calculator
"How much time could Nx save you?"
- Input: Current build time
- Output: Estimated time saved per day/week/year

## Visual Mockup Resources

### v0 by Vercel Mockup
Here's a prompt for creating a mockup on v0:

```
Create a clean, modern documentation landing page for Nx build system with:
- Hero section with tagline "Make Your Builds 10x Faster"
- Two CTAs: "Install Nx" and "Watch Demo"
- Embedded terminal showing before/after build times
- 3-step getting started section with code snippets
- Visual explanation section with task graph
- Progressive disclosure section with 4 option cards
- Minimalist design, lots of whitespace
- Dark mode support
```

**Link to v0:** https://v0.dev/

### Alternative Tools:
- **Figma Community Templates:** Search for "developer documentation landing page"
- **Framer:** https://framer.com/ (for interactive prototypes)
- **Excalidraw:** https://excalidraw.com/ (for quick wireframes)

## Implementation Notes

### A/B Testing Opportunities:
1. Hero message variations
2. CTA button text
3. Video vs. interactive demo
4. Number of steps shown

### Success Metrics:
- Time to first successful `nx` command
- Bounce rate reduction
- Video completion rate
- Click-through to next steps

### Progressive Enhancement:
- Static version works without JavaScript
- Interactive elements enhance but don't block
- Mobile-first responsive design

## Next Steps

1. Create wireframes/mockups
2. Write concise copy for each section
3. Record/produce demo video
4. Build interactive terminal component
5. Set up analytics tracking
6. Plan rollout strategy (canary deployment)