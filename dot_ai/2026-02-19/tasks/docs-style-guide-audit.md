# Docs Style Guide Audit

**Date:** 2026-02-19
**Goal:** Audit Storybook, Getting Started, and How Nx Works pages against the new documentation style guide (`astro-docs/STYLE_GUIDE.md`)

## Overview

| Section | Pages | HIGH | MEDIUM | LOW | Total |
|---|---|---|---|---|---|
| Storybook | 17 | 14 | 11 | 9 | 34 |
| Getting Started | 7 | 6 | 4 | 13 | 23 |
| How Nx Works | 10 | 13 | 10 | 10 | 33 |
| **Total** | **34** | **33** | **25** | **32** | **90** |

## Worst offenders (by HIGH violations)

| File | HIGH | Key issues |
|---|---|---|
| `mental-model.mdoc` | 4 | "Nx is able to" (x2), "straightforward", hedging |
| `intro.mdoc` | 4 | "streamline your workflow", "task orchestration", "simply", "Let's take" |
| `best-practices.mdoc` (Storybook) | 4 | "Essentially" (x3), "In conclusion", self-referential |
| `how-caching-works.mdoc` | 3 | "Nx's" possessives (x2), "straightforward" |
| `one-storybook-for-all.mdoc` | 2 | "Dive into comprehensive guide", "Essentially" |
| `one-storybook-with-composition.mdoc` | 2 | "Dive into comprehensive guide", "Essentially" |
| `ai-setup.mdoc` | 2 | "Leverage" in heading, "powerful capabilities" |

## Cleanest files (0 HIGH violations)

- `start-new-project.mdoc` and `start-with-existing-project.mdoc` -- can serve as style exemplars
- `executors-and-configurations.mdoc`
- `building-blocks-fast-ci.mdoc`
- `installation.mdoc`

---

## Most common violation patterns

### 1. Product-perspective voice: "Nx allows/enables/provides" (13 instances)

Found across almost every section:

- `intro.mdoc`: "all the powerful features that Nx provides"
- `mental-model.mdoc`: "Nx is able to analyze your source code" (x2)
- `task-pipeline-configuration.mdoc`: "Nx allows you to define task dependencies"
- `nx-plugins.mdoc`: "They allow the plugin author..."
- `introduction.mdoc` (Storybook): "It allows you to browse a component library"
- `custom-builder-configs.mdoc`: "Storybook allows you to customize"
- `storybook-composition-setup.mdoc`: "Storybook Composition allows you to embed"
- `executors-and-configurations.mdoc`: "Nx comes with a Devkit that allows you to"
- `inferred-tasks.mdoc`: "Nx is able to cache the results"

**Fix pattern:** Rewrite with reader as subject. "Nx allows you to X" -> "X with Nx" or just "X."

### 2. Self-referential frontmatter/intros (17 instances)

Nearly every Storybook page starts with "This guide explains..." or "This guide will walk you through..."

- All overview pages (angular, react, vue): "This guide will walk you through..."
- All publishing guides: "In that guide, we discussed...In this guide, we are going to see..."
- Most frontmatter descriptions: "This guide explains how to..."
- `mental-model.mdoc`: "This guide covers the mental model around how Nx works..."

**Fix pattern:** Descriptions should be imperative: "Set up X" not "This guide explains how to set up X."

### 3. Banned/flagged words

| Word/Phrase | Count | Files |
|---|---|---|
| "Essentially" / "in essence" | 5 | best-practices (3x), one-storybook-for-all, one-storybook-with-composition |
| "straightforward" | 2 | mental-model, how-caching-works |
| "simply" | 3 | intro, nx-daemon, nx-daemon |
| "seamlessly" | 1 | introduction (Storybook) |
| "Leverage" | 2 | ai-setup heading, angular-storybook-compodoc |
| "streamline your workflow" | 1 | intro |
| "comprehensive guide" | 2 | one-storybook-for-all, one-storybook-with-composition |
| "It's important to note" | 1 | one-storybook-per-scope |
| "In conclusion" | 1 | best-practices |
| "Let's take" | 1 | intro |
| "powerful" | 1 | ai-setup |

### 4. Product name possessives: "Nx's" (5 instances)

- `how-caching-works.mdoc`: "Nx's computation hashing" (frontmatter), "Fine-tuning Nx's Cache" (heading)
- `mental-model.mdoc`: "Nx's computation hashing" (frontmatter)
- `parallelization-distribution.mdoc`: "Nx Cloud's distributed task execution" (x2)

**Fix:** "the Nx cache", "the Nx computation hashing", "the Nx Cloud distributed task execution"

### 5. Wrong terminology: "task orchestration" (3 instances)

- `intro.mdoc` (x2): frontmatter + body
- `types-of-configuration.mdoc`

**Fix:** "task pipeline" per the terminology table.

### 6. Non-descriptive link text "here" (5 instances)

- `overview-angular.mdoc` (x2)
- `overview-react.mdoc` (x2)
- `overview-vue.mdoc`

### 7. Bold for emphasis, not UI elements (~10 instances)

Scattered across many files. Most are "definition list" patterns (`**Term:** description`) which are borderline acceptable but technically violate the rule.

### 8. Em/en dashes (3 instances)

- `intro.mdoc`: em dash
- `nx-daemon.mdoc`: em dash
- `ai-setup.mdoc`: em dash (x2)

### 9. "Conclusion" / "In summary" headings (3 instances)

- `best-practices.mdoc`: "## Conclusion"
- `mental-model.mdoc`: "## In summary"
- `parallelization-distribution.mdoc`: "## Conclusion"

---

## Detailed violations by section

### Storybook pages

#### introduction.mdoc
- **[HIGH]** "allows you to": "It allows you to browse a component library..."
- **[HIGH]** "seamlessly": "run Storybook seamlessly"
- **[MEDIUM]** Self-referential: "This guide will briefly walk you through..."
- **[MEDIUM]** Self-referential frontmatter: "This is an overview page for..."
- **[LOW]** Bold for emphasis: "**generate stories**", "**use the framework-specific generators**"
- **[LOW]** Missing serial comma: "serve, test and build"

#### best-practices.mdoc
- **[HIGH]** "Essentially" (x3): lines 19, 23, 27 + "in essence" line 89
- **[HIGH]** "In conclusion" heading + "We have covered..."
- **[MEDIUM]** Self-referential: "The purpose of this guide is to help you..."
- **[LOW]** Em dash, missing serial comma, "don't hesitate"

#### one-storybook-for-all.mdoc
- **[HIGH]** Frontmatter: "Dive into a comprehensive guide"
- **[HIGH]** "Essentially" (line 139)
- **[MEDIUM]** Self-referential: "In that guide, we discussed..."

#### one-storybook-per-scope.mdoc
- **[HIGH]** "It's important to note that" (line 83)
- **[MEDIUM]** Self-referential: "In that guide, we discussed..."

#### one-storybook-with-composition.mdoc
- **[HIGH]** Frontmatter: "Dive into the comprehensive guide"
- **[HIGH]** "Essentially" (line 12)
- **[MEDIUM]** Self-referential boilerplate

#### custom-builder-configs.mdoc
- **[HIGH]** "Storybook allows you to" (line 9)
- **[MEDIUM]** Self-referential frontmatter

#### storybook-composition-setup.mdoc
- **[HIGH]** "allows you to" (line 9)

#### storybook-interaction-tests.mdoc
- **[HIGH]** "This allows you to" (line 97)
- **[MEDIUM]** Self-referential frontmatter

#### angular-storybook-compodoc.mdoc
- **[HIGH]** "Leverages" (line 221)
- **[MEDIUM]** Self-referential frontmatter

#### overview-angular.mdoc
- **[MEDIUM]** Self-referential: "This guide will walk you through..."
- **[MEDIUM]** Self-referential frontmatter
- **[MEDIUM]** Non-descriptive link text "here" (x2)

#### overview-react.mdoc
- **[MEDIUM]** Self-referential: "This guide will walk you through..."
- **[MEDIUM]** Self-referential frontmatter
- **[MEDIUM]** Non-descriptive link text "here" (x2)
- **[LOW]** Heading case: "Example Library" -> "Example library"

#### overview-vue.mdoc
- **[MEDIUM]** Self-referential: "This guide will walk you through..."
- **[MEDIUM]** Self-referential frontmatter
- **[MEDIUM]** Non-descriptive link text "here"

#### angular-configuring-styles.mdoc
- **[MEDIUM]** Self-referential frontmatter
- **[LOW]** Bold for emphasis in list labels

#### configuring-storybook.mdoc
- **[MEDIUM]** Self-referential frontmatter
- **[LOW]** Self-referential body: "Please also make sure to read our..."

#### upgrading-storybook.mdoc
- **[MEDIUM]** Self-referential frontmatter

### Getting Started pages

#### intro.mdoc
- **[HIGH]** "streamline your workflow" (line 118)
- **[HIGH]** "task orchestration" (lines 3, 25) -- wrong terminology
- **[HIGH]** "simply" (line 56)
- **[HIGH]** "Let's take the example" (line 43)
- **[MEDIUM]** "Nx provides" (lines 93, 118)
- **[LOW]** Bold for emphasis (lines 10, 18-21)
- **[LOW]** Em dash (line 19)

#### ai-setup.mdoc
- **[HIGH]** "provides...powerful capabilities" (line 43)
- **[HIGH]** "Leverage" in heading (line 51)
- **[MEDIUM]** "Nx also integrates AI" (line 53) -- customer perspective
- **[LOW]** Em dash (lines 12, 48)
- **[LOW]** Bold for emphasis in list items

#### nx-cloud.mdoc
- **[MEDIUM]** "Setup takes less than 2 minutes" -- trust-undermining
- **[MEDIUM]** "Nx Cloud addresses" -- customer perspective
- **[LOW]** Passive voice (line 34)
- **[LOW]** Bold for emphasis

#### installation.mdoc
- **[LOW]** Bold "**Note:**" should be aside component (x2)
- **[LOW]** Hedging: "it is recommended"

#### editor-setup.mdoc
- **[LOW]** "and more!" -- informal
- **[LOW]** Bold for emphasis (x2)

#### start-new-project.mdoc -- CLEAN
#### start-with-existing-project.mdoc -- CLEAN

### How Nx Works pages

#### mental-model.mdoc
- **[HIGH]** Hedging: "effectively" (line 10)
- **[HIGH]** "straightforward" (line 337)
- **[HIGH]** "Nx is able to" (line 410)
- **[HIGH]** "Nx is able to" (line 412)
- **[MEDIUM]** Self-referential: "This guide covers..." (line 10)
- **[MEDIUM]** "In summary" heading (line 408)
- **[MEDIUM]** Possessive: "Nx's" in frontmatter
- **[LOW]** Missing serial comma, bold for emphasis

#### how-caching-works.mdoc
- **[HIGH]** "straightforward" (line 35)
- **[HIGH]** Possessive: "Nx's" in frontmatter
- **[HIGH]** Possessive: "Fine-tuning Nx's Cache" heading (line 49)
- **[MEDIUM]** Duplicate link to configure-inputs (x3)
- **[LOW]** Bold for emphasis, missing period

#### task-pipeline-configuration.mdoc
- **[HIGH]** "Nx allows you to" (line 68)
- **[MEDIUM]** "task orchestrator" terminology (borderline)

#### types-of-configuration.mdoc
- **[HIGH]** "task orchestration" (line 9) -- wrong terminology

#### nx-plugins.mdoc
- **[HIGH]** "allow" (x2 in one sentence, line 9)

#### inferred-tasks.mdoc
- **[HIGH]** "Nx is able to" (line 9)

#### parallelization-distribution.mdoc
- **[HIGH]** "Conclusion" heading (line 108)
- **[MEDIUM]** "Nx Cloud's" possessive (x2)

#### nx-daemon.mdoc
- **[HIGH]** Em dash (line 56)
- **[MEDIUM]** Bold for emphasis (lines 72-74)
- **[MEDIUM]** "simply" (line 52)
- **[LOW]** Heading case: "Daemon Behavior in Containers"

#### executors-and-configurations.mdoc
- **[MEDIUM]** "allows you to" (line 76)

#### building-blocks-fast-ci.mdoc
- **[MEDIUM]** "Nx has many features" -- passive perspective
- **[LOW]** Typo: "you build task" -> "your build task" (line 11)

---

## Recommended fix order

1. **Quick wins (search & replace):** "Essentially" -> delete, "straightforward" -> delete, "simply" -> delete, "Nx's" -> "the Nx", "task orchestration" -> "task pipeline"
2. **Frontmatter descriptions:** Systematic pass across all Storybook files to remove "This guide explains..."
3. **Worst files first:** `best-practices.mdoc` (Storybook) and `mental-model.mdoc` need the most rewrites
4. **"allows/enables/provides" rewrites:** Each needs individual rewriting to flip to reader perspective
5. **Storybook publishing guides:** All three share identical boilerplate intros that need rewriting
