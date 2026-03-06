# DOC-393: Writing Style Linting

**Linear:** https://linear.app/nxdev/issue/DOC-393/writing-style-linting
**Status:** In Progress
**Date:** 2026-03-06

## Context

Nx has a comprehensive documentation style guide (`astro-docs/STYLE_GUIDE.md`, 388 lines) covering voice, grammar, terminology, and information architecture. Today this guide is entirely manual — contributors must read and internalize it. The result is inconsistent docs quality, especially as more people (and AI tools) contribute.

This spec adds automated enforcement via [Vale](https://vale.sh) as a prose linter, a Claude skill that reviews docs changes against the style guide (including the five information architecture principles), and a CI target that catches violations before merge.

## Deliverables

### 1. Vale configuration and rules (`astro-docs/`)

All Vale config lives inside `astro-docs/` for locality. The Nx target runs with `cwd: astro-docs`.

#### File structure

```
astro-docs/
  .vale.ini
  .vale/
    styles/
      Nx/
        BannedPhrases.yml        # Tier 1: anti-AI phrases, hedging words
        Terminology.yml          # Tier 1: Nx-specific terms (executor not builder, etc.)
        ProductCapitalization.yml # Tier 1: Nx Cloud, Nx Console, Nx Agents, Nx Replay
        ProductPossessives.yml   # Tier 1: "the Nx configuration" not "Nx's configuration"
        Headings.yml             # Tier 2: sentence case, no bold, no skipped levels
        SerialComma.yml          # Tier 2: Oxford comma enforcement
        SelfReferential.yml      # Tier 2: "This page explains..." / "In this guide..."
        SentencePatterns.yml     # Tier 2: "This allows you to..." / "This enables you to..."
        TrustWords.yml           # Tier 3 (suggestion): "easily", "simply", "just", "straightforward"
        MarketingLanguage.yml    # Tier 3 (suggestion): "effortless", "game-changer", etc.
        PassiveVoice.yml         # Tier 3 (suggestion): passive voice detection
```

#### `.vale.ini`

Since `cwd` is `astro-docs/`, all paths are relative to that directory.

```ini
StylesPath = .vale/styles
MinAlertLevel = suggestion

# Alias .mdoc (Markdoc) to markdown — Vale doesn't natively recognize .mdoc
[formats]
mdoc = md

[src/content/docs/**/*.{mdoc,mdx,md}]
BasedOnStyles = Nx
```

**Notes:**
- The `[formats]` section tells Vale to treat `.mdoc` files as markdown
- No `Packages = Google` for now — start with custom Nx rules only; add Google package later if needed (requires `vale sync` step)
- Glob is relative to CWD (`astro-docs/`), not repo root

#### Rule severity tiers

| Tier | Severity | Description | False positive risk |
|------|----------|-------------|---------------------|
| 1 - Mechanical | `error` | Banned phrases, terminology, capitalization, possessives | Near zero |
| 2 - Structural | `warning` | Heading rules, serial commas, self-referential openers, sentence patterns | Low |
| 3 - Voice/Judgment | `suggestion` | Trust-undermining words, marketing language, passive voice | Medium — refine over time |

#### Tier 1 rule examples

**BannedPhrases.yml** — maps directly from STYLE_GUIDE.md "Anti-AI language" and "Hedging words" sections:
```yaml
extends: existence
message: "Avoid AI-sounding phrase '%s'. Rewrite to be direct."
level: error
tokens:
  - "It's important to note that"
  - "It's worth noting that"
  - "It should be noted that"
  - "In this section, we will explore"
  - "Let's dive into"
  - "Let's take a closer look at"
  - "Whether you're a beginner or an experienced developer"
  - "In today's fast-paced development environment"
  - "Unlock the power of"
  - "Harness the power of"
  - "Take your workspace to the next level"
  - "This comprehensive guide will"
  - "Without further ado"
  - "In conclusion"
  - "To summarize"
  - "As we've seen"
  - "Needless to say"
  - "As a matter of fact"
  # Hedging
  - "Generally speaking"
  - "It is worth mentioning"
```

**Terminology.yml** — enforces correct Nx terms:
```yaml
extends: substitution
message: "Use '%s' instead of '%s'."
level: error
swap:
  builder: executor
  schematic: generator
  memoized: cached
  stored results: cached
  task orchestration: task pipeline
  task graph: task pipeline
  nx cloud: Nx Cloud
  nx console: Nx Console
  nx agents: Nx Agents
  nx replay: Nx Replay
  Remote Caching: remote caching
  Task Pipeline: task pipeline
  Project Graph: project graph
```

### 2. Claude skill (`.claude/commands/nx-docs-style-check.md`)

A skill that triggers after writing/editing docs content. Two-phase review:

**Phase 1 — Information Architecture Audit (five principles)**

The skill loads `astro-docs/STYLE_GUIDE.md` and evaluates any new or moved pages against:

1. **Progressive disclosure ("journey" rule):** Is this content in the right section for the user's experience level? Getting Started (first 30 min), Features (first 30 days), Reference (forever).
2. **Category homogeneity ("scan" rule):** Do sibling pages in the same section share the same content type? Don't mix concepts, tasks, and products.
3. **Type-based navigation ("intent" rule):** Is this a learning page (guide) or a lookup page (reference)? Are they separated?
4. **Pen and paper test ("theory" rule):** Can the page be explained without a terminal? Yes = How Nx Works (architecture). No = Platform Features.
5. **Universal vs. specific ("placement" rule):** Does this apply to every user? Yes = Platform Features. No = Technologies.

The skill checks the page's location in `sidebar.mts`, reads the page content, and flags violations with specific recommendations for where the page should go.

**Phase 2 — Style Validation**

1. Run `vale` on changed files and surface violations with explanations.
2. For anything Vale doesn't catch, manually check against STYLE_GUIDE.md sections:
   - Customer perspective (leading with reader's action, not "Nx allows...")
   - Link density and quality
   - Code block formatting (language identifiers, relevant sections only)
   - List structure (parallel construction, not completing introductory sentences)

**Trigger:** Auto-trigger after writing or editing files in `astro-docs/src/content/`. Also trigger on explicit `/nx-docs-style-check` invocation or keywords: "check style", "style guide", "docs review", "validate docs".

### 3. Nx target (`vale` on `astro-docs`)

Add a `vale` target to `astro-docs/project.json`:

```json
{
  "vale": {
    "command": "vale src/content/docs/",
    "options": {
      "cwd": "{projectRoot}"
    },
    "cache": true,
    "inputs": [
      "{projectRoot}/src/content/docs/**/*.mdoc",
      "{projectRoot}/src/content/docs/**/*.mdx",
      "{projectRoot}/src/content/docs/**/*.md",
      "{projectRoot}/.vale.ini",
      "{projectRoot}/.vale/styles/**/*"
    ]
  }
}
```

- Participates in `nx affected` via proper `inputs`
- Cacheable — only re-runs when docs or rules change
- NOT a dependency of `test` — standalone target
- Terminal output is clear enough for Nx Cloud self-healing to parse failures (Vale's default output format works well for this)

### 4. mise.toml update

Add Vale to the existing `mise.toml`:

```toml
[tools]
vale = "latest"  # or pin to specific version like "3.9"
```

This auto-installs Vale for:
- **CI:** Already uses `jdx/mise-action@v3` on both Linux and macOS jobs
- **Local:** Contributors with mise get it automatically via `mise install`
- **Without mise:** The Nx target should print a helpful message if `vale` is not in PATH: "Vale not found. Install via `mise install` or `brew install vale`."

### 5. CI integration

No separate CI step needed. Vale runs as an Nx target, so it participates in the existing `nx affected -t lint` pipeline (or we add `vale` to the affected targets list in CI).

If `vale` is added to the CI command:
```yaml
- run: npx nx affected -t lint,vale --base=$NX_BASE --head=$NX_HEAD
```

Failures show up as standard Nx task failures with Vale's terminal output. Nx Cloud self-healing can pick these up like any other lint failure.

## Open questions / risks

1. **Markdoc parsing fidelity:** Vale's `[formats] mdoc = md` alias treats `.mdoc` as standard markdown. Markdoc-specific syntax (`{% tags %}`, `{% if %}`) may trigger false positives. We may need Vale's `BlockIgnores` / `TokenIgnores` config to skip Markdoc tag blocks.
2. **Existing violations:** Running Vale on the full `src/content/docs/` for the first time will likely produce hundreds of violations. Plan: run once, triage, and either fix or add a `vale.ini` baseline/ignore for pre-existing content. Don't let perfect block the merge.
3. **`vale sync` for packages:** If we later add `Packages = Google` or other external packages, the target command needs a `vale sync` step before `vale` runs. For now we're custom-only, so this isn't needed.

## Out of scope

- Automated self-healing fix logic specific to Vale (future work)
- Vale rules for content outside `astro-docs/`
- Editor integrations (VS Code Vale extension) — nice-to-have, not part of this spec
- Custom Vale rule for information architecture principles (too subjective — handled by Claude skill only)

## Verification

1. **Vale rules work:** Run `nx vale astro-docs` and confirm it catches known violations (create a test file with banned phrases)
2. **mise installs Vale:** Run `mise install` and confirm `which vale` resolves
3. **CI runs Vale:** Push a branch with a deliberate style violation, confirm CI fails with clear output
4. **Claude skill triggers:** Edit a `.mdoc` file, confirm the skill activates and checks both IA principles and style rules
5. **Caching works:** Run `nx vale astro-docs` twice — second run should be a cache hit
6. **Affected works:** Change a non-docs file, confirm `nx affected -t vale` does NOT run the target

## Files to create/modify

| File | Action |
|------|--------|
| `astro-docs/.vale.ini` | Create |
| `astro-docs/.vale/styles/Nx/*.yml` | Create (11 rule files) |
| `astro-docs/project.json` | Modify — add `vale` target |
| `mise.toml` | Modify — add `vale` tool |
| `.claude/commands/nx-docs-style-check.md` | Create |
| `astro-docs/STYLE_GUIDE.md` | Modify — update the Vale configuration reference (line 5) to point to actual config |
