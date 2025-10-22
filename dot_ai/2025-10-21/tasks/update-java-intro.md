# Update Java Intro Page - DOC-301

**Issue**: https://linear.app/nxdev/issue/DOC-301/update-java-intro-page
**Date**: 2025-10-21 14:34
**File**: astro-docs/src/content/docs/technologies/java/introduction.mdoc

## Goal

Update the Java introduction page to:
1. Surface shorter version of `nx init`, `nx add …` for quick start visibility
2. Mark Maven as experimental and requires Nx 22
3. Link to Gradle tutorial after `nx init`
4. Move Requirements section first

## Current Structure

1. Introduction paragraph
2. Build System Support (Gradle/Maven)
3. What Nx Adds
4. Getting Started (links to Gradle/Maven)
5. Requirements
6. Adding Nx to Existing Project

## Planned Changes

### 1. Reorganize sections
- Move "Requirements" section to appear earlier (after intro or after "What Nx Adds")
- Keep flow logical: intro → requirements → capabilities → getting started

### 2. Mark Maven as experimental
- Add note in Build System Support section
- Indicate Maven requires Nx 22
- Keep it visible but not alarming

### 3. Streamline Getting Started
- Show quick `nx init` example upfront
- Make code snippets more concise
- Add link to Gradle tutorial

### 4. Add Gradle tutorial link
- After `nx init` section
- Point users to hands-on tutorial

## Implementation Notes

- Keep Markdoc syntax (`{% aside %}`)
- Maintain existing links
- Don't change sidebar/frontmatter

## Final Implementation

All requirements completed:

1. ✅ **Requirements moved first** - Now appears right after intro
2. ✅ **Quick Start section added** - Shows:
   - Global install: `npm add --global nx@latest`
   - `nx init` command
   - Link to Gradle tutorial
3. ✅ **Build System Support enhanced** - Shows:
   - Maven marked as experimental, requires Nx 22+
   - `nx add @nx/gradle` and `nx add @nx/maven` commands
4. ✅ **Streamlined structure** - Removed redundant sections

File: astro-docs/src/content/docs/technologies/java/introduction.mdoc:1-58
