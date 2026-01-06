# Sidebar Restructure vs Analytics Data Analysis

**PR:** https://github.com/nrwl/nx/pull/33933
**Date:** 2026-01-06

---

## Proposed Structure Summary

| Section | Intent | Time Frame (Victor's suggestion) |
|---------|--------|----------------------------------|
| **Learn Nx** | First-time users, basics | Day 1 |
| **Build with Nx** | Active development | First month |
| **Scale with Nx** | CI, teams, enterprise | Everything after |
| **Extend Nx** | Plugin development | Power users |
| **Reference** | Lookups, configs | All users |

---

## How Analytics Data Relates to the Proposal

### ✅ What the Data SUPPORTS

#### 1. "Learn Nx" as the Entry Point is Correct
The data strongly validates putting learning content first:

| Current Path | Views | Bounce Rate | New Location |
|--------------|-------|-------------|--------------|
| /getting-started/intro | 66,328 | 19.4% | Learn Nx ✓ |
| /getting-started/installation | 26,931 | 25.7% | Learn Nx ✓ |
| /getting-started/start-new-project | 18,021 | 15.6% | Learn Nx ✓ |
| /getting-started/tutorials/* | ~30,000 | 20-30% | Learn Nx ✓ |
| /quickstart | 6,450 | 16.9% | Learn Nx ✓ |

**These are the most visited AND best-performing pages.** Keeping "Learn Nx" minimal and focused is the right call.

#### 2. Technology Pages Belong in "Build with Nx"
Technology framework pages have significant traffic from active developers:

| Technology | Est. Views | Bounce Rate | Makes sense in Build? |
|------------|------------|-------------|----------------------|
| Angular | ~60,000 | 25-35% | ✓ Yes - daily use |
| React/Next | ~25,000 | 25-35% | ✓ Yes |
| Node/Nest | ~20,000 | 20-30% | ✓ Yes |
| TypeScript | ~15,000 | 25-30% | ✓ Yes |

#### 3. Reference Section is Well-Defined
Power users already know where to look:

| Page Type | Views | Bounce Rate | Notes |
|-----------|-------|-------------|-------|
| /reference/nx-commands | 14,105 | 36% | Power user destination |
| /reference/project-configuration | 8,355 | 30% | Config lookup |
| /reference/nx-json | 4,616 | 25% | Config lookup |
| /reference/devkit/* | Low | 20-30% | API reference |

These users know what they're looking for - keep Reference separate.

---

### ⚠️ Criticisms the Data VALIDATES

#### 1. Victor's Concern: "Most of what folks should read is in Scale, not Build"

**The data shows this IS a problem.** Look at what's currently getting traffic:

| Page | Views | Proposed Location | Issue |
|------|-------|-------------------|-------|
| /features/automate-updating-dependencies | 8,639 | ??? | Core feature, should be early |
| /features/run-tasks | 7,737 | Build? | Fundamental, maybe Learn? |
| /features/cache-task-results | 3,076 | Build? | Core value prop, maybe Learn? |
| /features/ci-features/affected | 4,524 | Scale | Too advanced for Scale? |
| /guides/tasks--caching/terminal-ui | 2,836 | Build | Should be after basics |

**The boundary between Build and Scale is blurry.** Users learning Nx need to understand caching and task running early - these are THE value props of Nx.

#### 2. Caleb's Concern: "Feature Dumping" Problem

**The data 100% confirms this.** Advanced CI features have HIGH bounce rates:

| Page | Views | Bounce Rate | Issue |
|------|-------|-------------|-------|
| /features/ci-features/flaky-tasks | 1,999 | **47.2%** | Advanced, high bounce |
| /features/ci-features/self-healing-ci | 2,113 | **46.2%** | Marketing before education |
| /troubleshooting/ci-execution-failed | 1,159 | **48.3%** | Users frustrated, lost |
| /features/ci-features/distribute-task-execution | 1,621 | **33%** | Complex topic |

**Users can't use DTE/self-healing CI if they haven't learned task pipelines.** These SHOULD be in "Scale" (later), not shown early.

#### 3. Jack's Concern: "Users Shouldn't Jump Between Hierarchies"

**The data shows high engagement when content flows logically:**

| Journey | Pattern | Bounce Rate |
|---------|---------|-------------|
| intro → installation → tutorials | Linear in Learn | 15-25% ✓ |
| Angular intro → Angular generators | Stay in Technology | 25-42% (generators needs work) |
| Random landing on CI features | No context | 40-48% ✗ |

**Problem:** If a user in "Build with Nx" (working with Angular) needs to understand caching, they have to jump to a different hierarchy. Current proposal puts:
- Caching concepts in "Learn"
- Caching guides in "Build"
- CI caching in "Scale"

This fragmentation will cause confusion.

---

### 🔴 Data-Driven Concerns About the Proposal

#### 1. Where Does `/features/automate-updating-dependencies` Go?
- **8,639 views** - 8th most popular page
- Not a "learn" topic (too advanced)
- Not exactly "build" (it's maintenance)
- Not "scale" (solo devs use it)

**This doesn't fit cleanly.** Same for:
- `/features/explore-graph` (4,318 views) - Learn? Build?
- `/features/generate-code` (5,347 views) - Learn? Build?

#### 2. Module Federation is Orphaned
Currently `/technologies/module-federation/*` gets significant traffic:
- micro-frontend-architecture: 3,785 views (37% bounce)
- module-federation-and-nx: 2,594 views (28% bounce)
- faster-builds-with-module-federation: 1,913 views (29% bounce)

In the new structure, Module Federation moves to "Scale with Nx" but the Angular/React module federation guides stay in "Build with Nx" under technologies.

**Users will bounce between hierarchies** to understand the full picture.

#### 3. "Scale with Nx" May Be Too Large
The proposed Scale section includes:
- Nx Cloud + all CI features
- Module boundaries (conformance, etc.)
- Owners
- Nx Console
- Enterprise content

But the data shows very different engagement levels:
- CI features: 2,000-4,000 views each, 30-47% bounce
- Module boundaries: 400-600 views each, 20-30% bounce
- Enterprise: <200 views each

**These serve different audiences.** CI is for everyone eventually. Conformance/Owners is enterprise-only.

---

## Recommendations Based on Data

### 1. Keep "Learn Nx" Laser-Focused
The data validates minimal Learn section. Include ONLY:
- Intro/quickstart
- Installation
- Start new project / Add to existing
- Tutorials
- Mental model
- Core concepts (caching, task running - THE value props)

**Don't put**: Technology-specific content, CI features, advanced configs

### 2. Reconsider Build vs Scale Boundary

Victor's suggestion (time-based) has merit:
- **Day 1 (Learn)**: Intro, install, first project, basic concepts
- **First Month (Build)**: Technologies, generators, executors, basic caching
- **Ongoing (Scale)**: CI optimization, DTE, conformance, enterprise

But maybe rename:
- "Build with Nx" → "Develop with Nx" or "Use Nx Daily"
- "Scale with Nx" → "Optimize with Nx" or "Nx at Scale"

### 3. Don't Bury Core Value Props

These pages need to be accessible early (not just in Scale):
- Cache task results (16.9% bounce - users love it when they find it)
- Affected command (33% bounce - could be lower with better placement)
- Task graph visualization

### 4. Create Clear "Next Steps" at Section Boundaries

Since users WILL need to cross sections, add explicit bridges:
- End of Learn: "Now explore Technologies in Build →"
- End of Build basics: "Ready to speed up CI? See Scale →"

### 5. Address High-Bounce Pages Regardless of Structure

These pages need content fixes, not just reorganization:

| Page | Issue | Fix |
|------|-------|-----|
| Angular generators (42% bounce) | Can't find specific generator | Add search/filter |
| CI flaky tasks (47% bounce) | No quick answer | Add TL;DR |
| Self-healing CI (46% bounce) | Marketing-heavy | Add practical setup |
| Troubleshooting CI (48% bounce) | Dead end | Add diagnostic flow |

---

## Summary: What the Data Says

| Proposal Element | Data Support | Notes |
|------------------|--------------|-------|
| Learn Nx first, minimal | ✅ Strong | Top pages are intro/tutorials |
| Technologies in Build | ✅ Strong | Active devs need this daily |
| CI in Scale | ✅ Moderate | BUT core caching belongs earlier |
| Reference separate | ✅ Strong | Power users find it |
| Clear progression | ⚠️ Concern | Build/Scale boundary is fuzzy |
| Avoiding feature dump | ⚠️ Concern | Structure alone won't fix 47% bounce |
| No hierarchy jumping | 🔴 Risk | MF, caching split across sections |

**Bottom Line:** The 5-section concept is sound, but the Build/Scale boundary needs more thought. The data shows caching and basic CI (affected, remote cache) should be earlier than advanced CI (DTE, flaky tasks, self-healing).
