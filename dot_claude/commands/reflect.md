# Reflect

Maintain living architecture documentation for your repositories by capturing file relationships, design decisions, and work history from daily development activities.

## Usage

```bash
# Regular reflection during work
@reflect

# Initial repository scan (first time setup)
@reflect --initial-scan

# Verbose mode
@reflect -v
@reflect --verbose
```

CRITICAL: Whenever I talk about ".ai" folder, it needs to be at the repo root, i.e. where `.git` lives. It should already exist, so don't create a bunch of new ones!

## Overview

The reflect command helps you build and maintain architecture documentation that captures:
- What files do and how they relate to each other
- Design decisions and alternatives considered
- Work history and context for features
- Technology choices and limitations

## Features

### Auto-Detection
- Automatically detects repository from current working directory
- Repository name derived from .git root directory name

### Initial Scan (`--initial-scan`)
- Analyzes last 3 months of commits by you
- Creates skeleton with directory structure
- Infers features from commit messages and PR titles
- Pulls relevant content from existing .ai files

### Regular Reflection
- Run anytime during work (even 10x per day)
- Updates today's SUMMARY.md in .ai/yyyy-mm-dd/
- Updates repository architecture in .ai/architectures/[repo]-architecture.md
- Quiet by default, shows summary of changes

### Smart Updates
- Extracts file paths from task/dictation files
- Updates existing feature sections
- Marks new files as "NEW: needs categorization"
- Prevents duplicates

## Architecture File Structure

The generated architecture.md includes:

1. **Directory Overview** - What key directories contain
2. **Features & Critical Paths** - Files that work together
3. **Personal Work History** - Chronological feature work
4. **Design Decisions & Gotchas** - Important context
5. **Technology Stack** - Key dependencies

Each feature section contains:
- Last updated date
- Related Linear tasks and PRs
- Quick start guide
- Files involved with descriptions
- Dependencies and limitations

## Examples

```bash
# First time setup for a repository
cd ~/projects/nx
@reflect --initial-scan

# During daily work
@reflect  # Updates architecture based on today's work

# After completing a feature
@reflect  # Captures files, decisions, and context

# Review what's being updated
@reflect -v
```

## Implementation

1. Look for file paths in .ai files under:
   - "steps", "tasks", "phases" sections
   - "Implementation Details"
   - "Files Modified"

2. Update both:
   - Today's SUMMARY.md with work performed
   - Repository's architecture.md with long-term knowledge

3. For new files not in architecture.md:
   - Add with "NEW: needs categorization" marker
   - Review and categorize in future sessions

## Notes

- Focuses only on today's work (previous days already captured)
- Creates architecture file if it doesn't exist
- One architecture.md per repository
- Files stored in .ai/architectures/[repo]-architecture.md

ARGUMENTS: [--initial-scan] [-v|--verbose]
