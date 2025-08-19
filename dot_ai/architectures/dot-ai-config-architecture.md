# dot-ai-config Repository Architecture

**Repository**: dot-ai-config
**Last Updated**: 2025-08-19
**Primary Contributors**: Jack Hsu

## Overview

Personal AI configuration repository containing task tracking, dictations, specifications, and architecture documentation for various Nx-related projects.

## Directory Structure

```
dot-ai-config/
├── .ai/                    # Architecture docs and command scripts (symlinked to dot_ai)
├── dot_ai/                 # Main content directory
│   ├── yyyy-mm-dd/        # Daily work folders
│   │   ├── tasks/         # Task plans and implementations
│   │   ├── specs/         # Specifications and designs
│   │   ├── dictations/    # Voice notes and meeting transcriptions
│   │   └── SUMMARY.md     # Daily summary
│   ├── architectures/     # Repository architecture docs
│   ├── TODO.md           # Pending tasks tracker
│   └── SUMMARY.md        # Overall summary
└── README.md

```

## Features & Work History

### Task Management System
**Last Updated**: 2025-08-19
- **Files**:
  - `dot_ai/TODO.md` - Central task tracking
  - `dot_ai/yyyy-mm-dd/SUMMARY.md` - Daily summaries
  - `dot_ai/yyyy-mm-dd/tasks/*.md` - Task plans and implementations

### Linear Issue Tracking (2025-08-19)
**Work Performed**: Review of stale Linear issues for Nx CLI team
- **Task**: Identify issues with no updates for 3+ months
- **Files Created**:
  - `dot_ai/2025-08-19/tasks/linear-stale-issues-review.md` - Analysis of 6 In Progress and multiple Backlog stale issues
  - `dot_ai/2025-08-19/SUMMARY.md` - Daily summary with key findings
- **Key Findings**:
  - 6 In Progress issues stale (oldest from Nov 2024)
  - Multiple assignees with overdue work
  - High-priority issues due Aug 22 not updated since Feb/May

### Documentation Work (August 2025)
- **DOC-111**: Update Astro Docs Header (2025-08-13)
- **DOC-110**: Create Index Pages for Astro Docs (2025-08-13)
- **DOC-68**: Add Markdoc Tags to Astro (2025-08-08)

### CI/CD & Release Automation (July 2025)
- **Nx Patch Release Automation** (2025-07-30)
- **Docker Release Documentation** (2025-07-30)
- **Update Nx Commands to @latest** (2025-07-29)

## Technology Stack

- **Task Management**: Markdown-based tracking system
- **Integration**: Linear API for issue management
- **Documentation**: Markdown files with structured organization
- **Version Control**: Git-based workflow

## Design Decisions

### Directory Organization
- **Decision**: Use yyyy-mm-dd folders for chronological organization
- **Rationale**: Easy to find work by date, natural archiving
- **Alternative Considered**: Project-based folders (rejected for complexity)

### Task Tracking
- **Decision**: Maintain single TODO.md with In Progress/Completed sections
- **Rationale**: Single source of truth for pending work
- **Integration**: Updates coordinated with daily SUMMARY.md files

## Dependencies & Limitations

- Requires manual updates to TODO.md when tasks complete
- Daily summaries need to be created for each work day
- Architecture files need periodic reflection to stay current

## Recent Changes

- 2025-08-19: Added Linear stale issue review capability
- 2025-08-13: Expanded documentation task tracking
- 2025-07-30: Added CI/CD automation scripts

## Notes

This repository serves as the central knowledge base for AI-assisted development work across multiple Nx-related repositories.