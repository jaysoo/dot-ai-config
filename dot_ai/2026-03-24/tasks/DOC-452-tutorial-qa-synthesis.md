# Tutorial Series QA Synthesis Report (Round 5 - Final)

**PR**: #34998 - Replace monolithic tutorials with focused topic-based tutorials
**Date**: 2026-03-25
**Tested across**: 4 workspace setups, 8 tutorials each, 5 rounds

## Round 5 Update

All R5 changes verified:
- **Tutorial 5 "try it" exercise moved after inputs/outputs**: VERIFIED WORKING. With outputs configured, revert-and-rebuild correctly restores dist/ from cache on first run. This was the main R5 fix.
- **Tutorial 1 restructured** (Adding a project after Creating a workspace): Better flow, verified.
- **Tutorial 1 Python/uv mentions**: uv mentioned in workspace structure, new "Non-JavaScript workspaces" aside about project.json discovery. Helpful but not sufficient alone for Python users — a dedicated Python tutorial (like Gradle's) would be the biggest improvement.
- **New finding**: Default `namedInputs.default` of `{projectRoot}/**/*` includes build artifacts (dist/, tsbuildinfo) for tsc workflows, causing cache hash to change after every build. Tutorial could note to exclude these.

---

---

## Executive Summary

After 4 rounds of testing, the tutorial series is **ready to ship**. All blocking issues from rounds 1-3 are resolved. Round 4 validated that the new "substitute your own tools" notes and guided exercises make the tutorials feel more hands-on.

### Fix Tracking Across 4 Rounds

| Issue | Found | Fixed | Status |
|---|---|---|---|
| `nx g ci-workflow` broken | R1 | R2 | RESOLVED |
| Caching section order | R1 | R2 | RESOLVED |
| Tutorial numbering 1/7 → 1/8 | R1 | R2 | RESOLVED |
| `implicitDependencies` not mentioned | R1 | R2 | RESOLVED |
| `@nx/workspace` prerequisite | R2 | R3 | RESOLVED |
| `nx-cloud fix-ci` → `nx fix-ci` | R2 | R3 | RESOLVED |
| `implicitDependencies` too weak | R2 | R3 | RESOLVED |
| Tutorials 2, 6, 7 lack prereq asides | R2 | R3 | RESOLVED |
| `npm install` after adding projects | R2 | R3 | RESOLVED |
| Scope placeholder confusion | R2 | R3 | RESOLVED |
| Vite-specific examples without alternatives | R3 | R4 | RESOLVED |
| `vite serve` → `vite dev` | R3 | R4 | RESOLVED |
| Tutorial 7 not hands-on enough | R3 | R4 | RESOLVED |

---

## Round 4 Results

### Sequential: 32/32 PASS

| Workspace | Result |
|---|---|
| CNW (empty JS) | 8/8 PASS |
| Existing JS (no Nx) | 8/8 PASS |
| Existing JS (with Nx) | 8/8 PASS |
| Python uv | 8/8 PASS |

### Standalone: Significant improvement

| Workspace | Result |
|---|---|
| CNW (empty) | 1 PASS, 6 PASS w/ friction, 1 Partial |
| Existing JS (no Nx) | 8/8 PASS (1 with caveat) |
| Existing JS (with Nx) | 8/8 PASS |
| Python uv | 4 PASS, 3 Partial, 1 Fail (CI gen) |

---

## Round 4 Focus: "Do the tutorials feel like tutorials now?"

### Verdict: Yes, tutorials 3-7 now feel hands-on. Tutorials 1-2 remain conceptual (appropriately so).

**Strongest "try it" moments:**
1. **Tutorial 5 "Try changing a source file"** - Best exercise in the series. Concrete, verifiable, demonstrates caching's core value. Works with any language including Python.
2. **Tutorial 7 "Try adding a plugin"** - Biggest qualitative improvement from R4. Transforms concept page into discovery exercise.

**"Substitute your own tools" notes:**
- **Effective in tutorials 3-5**: Widens audience beyond Vite users, reassures users concepts are tool-agnostic
- **Less effective in tutorial 7**: Plugin section is inherently tool-specific. "Substitute" doesn't help when there's nothing to substitute (Python) or users don't know which plugin to pick (tsc-only). Suggestion: mention `@nx/js` for TypeScript and link to plugin registry.

---

## Remaining Polish Items (Not Blocking)

### 1. Tutorial 5: Cache revert instruction is technically inaccurate
**Found in**: 2 workspaces, consistent

The tutorial says "Revert the change and run again to see the cache hit restored." In practice, after reverting, the first build re-executes because `dist/` outputs were overwritten by the intermediate build. Only the second run shows cache hit.

**Fix**: Either remove the revert instruction or clarify: "After reverting, you may need to run the build twice — the first run rebuilds because output files changed, and the second hits the cache."

### 2. Tutorials 3, 4, 5 still lack formal prerequisite asides
**Found in**: All solo testing consistently across 3 rounds

Tutorials 2, 6, 7, 8 have formal `{% aside %}` prereq blocks. Tutorials 3, 4, 5 only have inline text links. Inconsistent experience.

### 3. Tutorial 7: Only shows `@nx/vite` as plugin example
**Found in**: CNW, existing-no-Nx, Python

Users with tsc, Jest, or ESLint don't know which plugin to try. `@nx/js` works great for TypeScript-only workspaces. A brief mention or table of common plugins would help.

### 4. Tutorial 1 "Adding a project" uses `workspace:*` without tabs
**Found in**: CNW (npm workspace)

npm uses `"*"` not `workspace:*`. Tutorial 2 has proper tabs but tutorial 1 does not.

### 5. Python ecosystem gaps (inherent, not fixable in these tutorials)
- No Python plugins (tutorial 7 plugin section inapplicable)
- CI generator produces JS-only YAML
- `project.json` is only option (presented as secondary)
- `namedInputs` examples use `*.spec.ts` patterns
- `implicitDependencies` aside could be more prominent

---

## Tutorial-by-Tutorial Assessment (Final)

| # | Tutorial | Type | Hands-on? | Standalone? |
|---|----------|------|-----------|-------------|
| 1 | Crafting Workspace | Conceptual | Low | Yes |
| 2 | Managing Dependencies | Conceptual | Low | Yes (with prereq) |
| 3 | Configuring Tasks | Guided reference | Medium | Mostly |
| 4 | Running Tasks | Guided reference | Medium-High | Mostly |
| 5 | Caching Tasks | **Tutorial** | **High** | Mostly |
| 6 | Understanding Workspace | Guided reference | Medium | Yes (with prereq) |
| 7 | Reducing Boilerplate | **Tutorial** | **Medium-High** | Mostly |
| 8 | Setting Up CI | Guided reference | Low | Yes (with prereq) |

Tutorials 5 and 7 now have genuine hands-on exercises. Tutorials 3-4 and 6 are guided references with runnable commands. Tutorials 1-2 are appropriately conceptual for their content. Tutorial 8 is limited by external service requirements.

---

## Timing Estimate

~55-95 minutes for a human to work through all 8 tutorials. Fits the ~1 hour target. The new "try it" exercises in tutorials 5 and 7 add maybe 5 minutes total but significantly increase understanding.

---

## Final Verdict

**Ship it.** The tutorial series successfully covers all Nx fundamentals in a logical sequence. After 4 rounds of fixes:
- All blockers resolved
- Sequential path works cleanly across all 4 workspace types
- "Substitute your own tools" notes widen the audience
- Tutorials 5 and 7 have genuine hands-on moments
- Prerequisite asides guide standalone users

The remaining items are polish, not blockers.

---

## Workspace Artifacts

Test workspaces with RESULT.md files:
- `/tmp/nx-tutorial-cnw/`
- `/tmp/nx-tutorial-existing-no-nx/`
- `/tmp/nx-tutorial-existing-with-nx/`
- `/tmp/nx-tutorial-python-uv/`
