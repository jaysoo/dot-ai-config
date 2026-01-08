# PARA System

This folder organizes information using the [PARA method](https://fortelabs.com/blog/para/) by Tiago Forte.

## Overview

PARA is an organizational system that categorizes all information into four categories based on **actionability**:

| Category | Definition | Has End Date? |
|----------|------------|---------------|
| **Projects** | Short-term efforts with specific goals | Yes |
| **Areas** | Ongoing responsibilities requiring attention | No |
| **Resources** | Topics/materials collected for reference | No |
| **Archive** | Inactive items from the above categories | N/A |

## Structure

```
para/
├── README.md              # This file (PARA overview)
├── projects/              # Time-bound work with deadlines
│   ├── README.md          # List of active projects
│   └── my-project/        # Each project is a folder
│       └── README.md      # Project overview
├── areas/                 # Ongoing responsibilities
│   ├── README.md          # Areas overview
│   ├── personnel/         # Team member notes
│   │   ├── README.md      # Team overview table
│   │   └── alice.md       # Individual files OK here
│   ├── syncs/             # Team sync meetings
│   │   ├── README.md      # Syncs overview
│   │   └── cli/           # Each team is a folder
│   │       └── README.md  # Meeting notes for CLI team
│   └── productivity/      # Engineering metrics
│       └── README.md      # Productivity tracking
├── resources/             # Reference materials
│   ├── README.md          # Resources overview
│   ├── architectures/     # Repository architecture docs
│   │   ├── README.md      # List of architectures
│   │   └── nx-architecture.md  # Individual docs OK
│   └── scripts/           # Utility scripts
│       ├── README.md      # Scripts overview
│       └── my-script.sh   # Individual scripts OK
└── archive/               # Inactive items
    └── README.md          # Archive overview
```

## Decision Guide

**Where does this go?**

1. **Does it have a deadline or completion goal?** → `projects/`
2. **Is it an ongoing responsibility?** → `areas/`
3. **Is it reference material for future use?** → `resources/`
4. **Is it no longer active/relevant?** → `archive/`

---

## AI Instructions

**IMPORTANT**: AI tools (Claude, Cursor, etc.) MUST follow these rules when working with this folder.

### Rule 1: Every Folder Has a README.md

Each folder MUST contain a `README.md` that serves as:
- **Overview**: What this folder/topic is about
- **Index**: List of contents with descriptions
- **Instructions**: How to add new items

When creating a new folder, ALWAYS create a README.md first.

### Rule 2: No Orphaned Files at Category Level

Files MUST NOT exist directly under `projects/`, `areas/`, or `resources/`. Create a folder instead.

```
# WRONG - orphaned file
areas/productivity.md

# CORRECT - folder with README
areas/productivity/
└── README.md
```

**Exception**: Leaf-level folders (like `personnel/`, `architectures/`) may contain individual files alongside their README.md.

### Rule 3: README.md is the Primary Content

For topics that are a single document, the content goes in `README.md`:

```
# WRONG - unnecessary nesting
areas/productivity/
├── README.md           # Just says "see overview.md"
└── overview.md         # Actual content

# CORRECT - README is the content
areas/productivity/
└── README.md           # Contains all the content
```

### Rule 4: When to Create Sub-files

Create additional files (beyond README.md) only when:
- **Collection of similar items**: `personnel/alice.md`, `personnel/bob.md`
- **Large reference docs**: `architectures/nx-architecture.md`
- **Executable scripts**: `scripts/my-script.sh`
- **Templates**: `_template.md` files

### Rule 5: Preserve Structure When Archiving

When archiving, maintain the original path structure:
```
areas/old-area/ → archive/areas/old-area/
projects/done-project/ → archive/projects/done-project/
```

---

## README.md Templates

### For Category Folders (projects/, areas/, resources/)

```markdown
# [Category Name]

Brief description of what belongs here.

## Contents

| Folder | Description |
|--------|-------------|
| folder-name/ | What it contains |

## Adding New Items

Instructions for adding new content.
```

### For Topic Folders

```markdown
# [Topic Name]

## Purpose

What this topic/area/project is about.

## [Main Content Sections]

The actual content goes here.

## Notes

Additional context, history, or references.
```

### For Collection Folders (like personnel/, architectures/)

```markdown
# [Collection Name]

Brief description.

## Contents

| Item | Description |
|------|-------------|
| item.md | What it covers |

## Adding New Items

- Naming convention: `lowercase-hyphenated.md`
- Template: `_template.md` (if exists)
```

---

## MCP Integration

The MyNotes MCP server provides tools to search and navigate this structure:
- `search_ai_content` - Search across all content
- `get_task_context` - Resume specific tasks
- `find_specs` - Find specification files
- `extract_todos` - Find TODO items

## Quick Reference

| Action | Command |
|--------|---------|
| New project | `mkdir -p para/projects/my-project && touch para/projects/my-project/README.md` |
| New area | `mkdir -p para/areas/my-area && touch para/areas/my-area/README.md` |
| New resource | `mkdir -p para/resources/my-resource && touch para/resources/my-resource/README.md` |
| Archive item | `mv para/areas/old/ para/archive/areas/old/` |

## References

- [The PARA Method](https://fortelabs.com/blog/para/) - Original article by Tiago Forte
- [Building a Second Brain](https://www.buildingasecondbrain.com/) - Full methodology
