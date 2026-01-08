# Architectures

Repository architecture documentation for quick context when working on different projects.

## Purpose

- Understand repository structure before diving in
- Reference key files, patterns, and conventions
- Track architectural decisions and patterns

## Current Architectures

| Repository | File | Description |
|------------|------|-------------|
| nx | `nx-architecture.md` | Nx monorepo CLI and core packages |
| nx-labs | `nx-labs-architecture.md` | Experimental Nx packages |
| ocean | `ocean-architecture.md` | Ocean project |
| console | `console-architecture.md` | Nx Cloud console |
| eng-wrapped | `eng-wrapped-architecture.md` | Engineering wrapped project |
| dot-ai-config | `dot-ai-config-architecture.md` | This config repo |

## File Naming

- Format: `[repo-name]-architecture.md`
- Use the repository name, not issue/branch names
- Example: `nx-architecture.md` not `DOC-123-architecture.md`

## Template

```markdown
# [Repository] Architecture

## Overview
Brief description of the repository purpose.

## Key Directories
- `src/` - Description
- `packages/` - Description

## Key Files
- `nx.json` - Workspace configuration
- `project.json` - Project configuration

## Common Patterns
- Pattern 1
- Pattern 2

## Notes
Additional context and learnings.
```
