# Nx Check Extensibility Spec

**Date:** 2026-01-28
**Status:** Draft
**Author:** Jack Hsu (brainstorm session)

## Overview

Extend Nx's code quality tooling beyond Prettier to support modern, high-performance tools like Biome, Oxfmt, and Oxlint. Introduce a new `nx check` command that replaces `nx format` with a plugin-based architecture for tool discovery and execution.

## Motivation

- Users have repeatedly requested Biome and Oxlint support
- Modern tools (Biome, Oxfmt, Oxlint) are 10-100x faster than Prettier/ESLint
- Current `nx format` is hardcoded to Prettier with no extensibility
- Competitive pressure from Vite+ which supports these tools out of the box

## Goals

1. Support multiple formatters/linters via plugin architecture
2. Auto-detect available tools based on config files
3. Maintain file-level filtering for performance in large monorepos
4. Provide clean migration path from `nx format`
5. Keep architecture simple - tools handle their own config, Nx orchestrates

## Non-Goals (Phase 1)

- Native module boundary rules for Biome/Oxlint (Phase 2)
- Dependency mismatch checking rules (Phase 2)
- Custom third-party adapter API (future enhancement)
- Nx-level caching (tools handle their own)

---

## Architecture

### Command Interface

```bash
nx check              # Check all detected tools (formatting + linting)
nx check --write      # Auto-fix issues where possible
nx check --affected   # Only check affected/changed files
```

**Deprecation:**
- `nx format:check` → alias to `nx check` + deprecation warning
- `nx format:write` → alias to `nx check --write` + deprecation warning
- Remove aliases after 1-2 major versions

### Plugin Architecture

Each tool gets its own plugin package:

| Plugin | Tool | Concerns |
|--------|------|----------|
| `@nx/prettier` | Prettier | Formatting |
| `@nx/biome` | Biome | Formatting + Linting |
| `@nx/oxfmt` | Oxfmt | Formatting |
| `@nx/oxlint` | Oxlint | Linting |
| `@nx/eslint` | ESLint | Linting (unchanged, per-project) |

**Rationale:** Separate plugins follow "easiest path to deletion" principle. If a tool becomes obsolete, delete the plugin rather than extracting from `@nx/js`.

### Adapter Pattern

Each plugin provides an adapter that normalizes tool invocation:

```typescript
interface CheckAdapter {
  name: string;

  // Config file patterns for auto-detection
  configPatterns: string[];  // e.g., ['biome.json', 'biome.jsonc']

  // Check if tool is available (package installed)
  isAvailable(): Promise<boolean>;

  // Get CLI command for check mode
  getCheckCommand(files: string[]): string[];

  // Get CLI command for write/fix mode
  getWriteCommand(files: string[]): string[];

  // Supported file extensions
  supportedExtensions: string[];
}
```

**Built-in adapter mappings:**

| Tool | `nx check` | `nx check --write` |
|------|------------|-------------------|
| Prettier | `prettier --check <files>` | `prettier --write <files>` |
| Biome | `biome check <files>` | `biome check --write <files>` |
| Oxfmt | `oxfmt check <files>` | `oxfmt --write <files>` |
| Oxlint | `oxlint <files>` | `oxlint --fix <files>` |

### Tool Discovery

Auto-detection based on config files in workspace root:

| Tool | Config Files |
|------|-------------|
| Prettier | `.prettierrc`, `.prettierrc.json`, `prettier.config.js`, etc. |
| Biome | `biome.json`, `biome.jsonc` |
| Oxfmt | `.oxfmtrc.json`, `oxfmt.json` (TBD - tool in alpha) |
| Oxlint | `.oxlintrc.json`, `oxlint.json` |

**Behavior:**
- Scan workspace root for config files
- Register all detected tools
- Run all by default (support transition periods, e.g., ESLint → Biome migration)

### Exclusion Configuration

Users can exclude tools via `nx.json`:

```json
{
  "check": {
    "exclude": ["prettier"]
  }
}
```

**Use case:** Team migrating from Prettier to Biome has both configs present but wants to skip Prettier.

### Invocation Model

**Workspace-level, single invocation per tool:**

```
nx check
  ├── Compute affected files (git-based)
  ├── For each detected adapter:
  │     └── Invoke tool with file list
  └── Aggregate results in TUI
```

**Why workspace-level:**
- Tools like Biome/Oxfmt are designed to run once at repo root
- 10-100x faster than ESLint, no need for per-project parallelization
- Per-project invocation across 500+ projects would be slower
- Tools handle nested config files natively for project-specific overrides

### Nested Configuration Support

Modern tools support project-specific config via nested files:

**Biome** ([docs](https://biomejs.dev/guides/big-projects/)):
```
/biome.json              # Root config
/packages/app/biome.json # Nested, uses "root": false, "extends": "//"
```

**Oxlint** ([docs](https://oxc.rs/docs/guide/usage/linter/nested-config)):
```
/.oxlintrc.json              # Root config
/packages/app/.oxlintrc.json # Nested, uses "extends": ["../../.oxlintrc.json"]
```

Nx does not need to manage this - tools handle it natively.

### File Filtering

Preserve current `nx format` file-level filtering for performance:

```bash
nx check --affected    # Only files changed since base
nx check --files=...   # Specific files
nx check --all         # All files in workspace
```

**Implementation:**
1. Compute file list using git (same as current `nx format`)
2. Filter by each adapter's `supportedExtensions`
3. Pass file list to each tool's CLI

### Output & TUI Integration

Multi-tool output displayed via TUI:
- Each tool runs in parallel
- TUI shows progress for each tool
- Keyboard navigation to view each tool's output
- Aggregated exit code (fail if any tool fails)

**Behavior:**
- Run all tools to completion (no fail-fast)
- Show summary: "Prettier: 3 issues, Biome: 5 issues, Oxlint: 2 issues"
- Non-zero exit if any tool reports issues

### ESLint Exception

`@nx/eslint` remains unchanged:
- Per-project targets (not workspace-level)
- Legacy architecture incompatible with single-invocation model
- Users can run both `nx check` (modern tools) and `nx lint` (ESLint per-project)

---

## Migration Path

### Phase 1: Introduction (Current Major)

1. Introduce `nx check` / `nx check --write`
2. Create plugin packages: `@nx/prettier`, `@nx/biome`, `@nx/oxfmt`, `@nx/oxlint`
3. Alias `nx format:check` → `nx check` with deprecation warning
4. Alias `nx format:write` → `nx check --write` with deprecation warning

### Phase 2: Deprecation Period (Next Major)

1. Continue deprecation warnings
2. Documentation emphasizes `nx check`
3. Add native module boundary rules to `@nx/biome`, `@nx/oxlint`

### Phase 3: Removal (Major + 1 or + 2)

1. Remove `nx format` command entirely
2. Remove Prettier-specific code from core

---

## Plugin Package Structure

### `@nx/prettier`

```
packages/prettier/
├── src/
│   ├── adapter.ts           # CheckAdapter implementation
│   ├── plugin.ts            # createNodes for registration
│   └── utils/
│       └── detect-config.ts # Config file detection
├── package.json
└── README.md
```

### `@nx/biome`

```
packages/biome/
├── src/
│   ├── adapter.ts           # CheckAdapter implementation
│   ├── plugin.ts            # createNodes for registration
│   └── utils/
│       └── detect-config.ts
├── package.json
└── README.md
```

Similar structure for `@nx/oxfmt` and `@nx/oxlint`.

---

## Configuration Reference

### nx.json

```json
{
  "check": {
    "exclude": ["prettier"],  // Optional: exclude specific tools
  }
}
```

### Tool-specific configuration

Each tool uses its native config file:
- Prettier: `.prettierrc`, `prettier.config.js`, etc.
- Biome: `biome.json`
- Oxfmt: `.oxfmtrc.json` (TBD)
- Oxlint: `.oxlintrc.json`

Nx does not duplicate or wrap these configs.

---

## Performance Characteristics

| Tool | Speed vs Prettier | Caching |
|------|-------------------|---------|
| Prettier | 1x (baseline) | None |
| Biome | ~25x faster | Built-in |
| Oxfmt | ~30x faster | Built-in |
| Oxlint | ~50-100x vs ESLint | Built-in |

**Nx caching:** Not implemented. Tools are fast enough, and they handle their own caching internally.

---

## Licensing Model

| Component | License |
|-----------|---------|
| `@nx/prettier` | Free/OSS |
| `@nx/biome` | Free/OSS |
| `@nx/oxfmt` | Free/OSS |
| `@nx/oxlint` | Free/OSS |
| Conformance (tool-agnostic rules) | Enterprise-only |

Module boundary rules for Biome/Oxlint (Phase 2) will be free/OSS, following the same model as `@nx/eslint`.

---

## Open Questions

1. **Oxfmt config format:** Tool is in alpha, config format not finalized
2. **TUI implementation details:** Exact keyboard navigation UX
3. **Plugin registration API:** Exact interface for third-party adapters (future)
4. **Hobby/Teams gating:** Potential license gating for some rules (GTM decision, out of scope)

---

## References

- [Biome Big Projects Guide](https://biomejs.dev/guides/big-projects/)
- [Biome v2 Announcement](https://biomejs.dev/blog/biome-v2/)
- [Oxlint Nested Config](https://oxc.rs/docs/guide/usage/linter/nested-config)
- [Oxlint 1.0 Announcement](https://voidzero.dev/posts/announcing-oxlint-1-stable)
- [Oxfmt Alpha Announcement](https://voidzero.dev/posts/announcing-oxfmt-alpha)
- [Turborepo Biome Guide](https://turborepo.dev/docs/guides/tools/biome)

---

## Appendix: Current nx format Architecture

For reference, current `nx format` implementation:

- Location: `packages/nx/src/command-line/format/`
- Hardcoded to Prettier
- Subprocess execution (not API calls)
- File filtering via git (affected, projects, etc.)
- No plugin architecture
- Commands: `format:check`, `format:write`
