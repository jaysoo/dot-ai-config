# Documentation Correlation Tool - Usage Guide

## Quick Start

The main tool is `docs-correlation-tool.mjs` which orchestrates the entire workflow.

### Basic Usage

```bash
# From the raw-docs repository root
node .ai/2025-06-11/tasks/docs-correlation-tool.mjs <git-sha>

# Example: Check changes since last release
node .ai/2025-06-11/tasks/docs-correlation-tool.mjs v18.0.0

# Example: Check changes in last 10 commits
node .ai/2025-06-11/tasks/docs-correlation-tool.mjs HEAD~10
```

### Options

- `--nx-path <path>`: Path to nx repository (default: `../nx`)
- `--output <file>`: Output filename (default: `update-plan-[timestamp].md`)
- `--verbose`: Show detailed progress
- `--save-intermediate`: Save JSON files for debugging

### Example with Options

```bash
# Specify custom nx path and output file
node .ai/2025-06-11/tasks/docs-correlation-tool.mjs \
  --nx-path ~/workspace/nx \
  --output my-update-plan.md \
  abc123def

# Debug mode with all intermediate files
node .ai/2025-06-11/tasks/docs-correlation-tool.mjs \
  --verbose \
  --save-intermediate \
  main
```

## Individual Tools

You can also run each component separately for debugging:

### 1. Analyze Feature Changes

```bash
node .ai/2025-06-11/tasks/analyze-feature-changes.mjs <since-ref> [base-path]
```

Output: JSON with feature changes

### 2. Scan Nx Documentation

```bash
node .ai/2025-06-11/tasks/scan-nx-docs.mjs <nx-repo-path>
```

Output: JSON with documentation index

### 3. Correlate Features with Docs

```bash
node .ai/2025-06-11/tasks/correlate-features-docs.mjs <features.json> <docs.json>
```

Output: JSON with correlations

### 4. Generate Update Plan

```bash
node .ai/2025-06-11/tasks/generate-update-plan.mjs <correlations.json> <features.json> <docs.json>
```

Output: Markdown update plan for AI

## Output Format

The generated update plan includes:

1. **Analysis Summary**: Overview of changes
2. **Priority Sections**: High/Medium priority updates
3. **Feature Details**: Detailed change information
4. **AI Instructions**: Guidance for documentation updates

## Workflow for Docs Team

1. **Identify the reference point** (last release, specific commit, etc.)
2. **Run the tool**: `node .ai/2025-06-11/tasks/docs-correlation-tool.mjs <ref>`
3. **Review the generated plan** (e.g., `update-plan-1234567890.md`)
4. **Pass to Claude** with instructions to update documentation
5. **Review and apply** the suggested changes

## Tips

- Use git tags or branch names for easier reference points
- The `--verbose` flag helps understand what the tool is doing
- Save intermediate files when debugging correlation issues
- Higher confidence scores (>70%) usually indicate direct correlations