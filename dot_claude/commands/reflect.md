# Reflect

Maintain living architecture documentation for your repositories by capturing file relationships, design decisions, and work history from daily development activities.

Also reflect on our current converstation/context and provide updates to $HOME/jack/projects/dot-ai-config/dot_claude/CLAUDE.md to prevent any mistakes or confusion that YOU had while completing the current task.

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

CRITICAL: Before you update CLAUDE.md show me your suggested updates and I will approval/decline.

## Overview

The reflect command helps you build and maintain architecture documentation that captures:
- What files do and how they relate to each other
- Design decisions and alternatives considered
- Work history and context for features
- Technology choices and limitations

It also helps improve Claude Code itself by ensuring that mistakes done are not repeated:
- CLAUDE.md is updated in $HOME/jack/projects/dot-ai-config/dot_claude/CLAUDE.md

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
- Updates repository architecture in .ai/para/resources/architectures/[repo]-architecture.md
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

## CRITICAL

- Focuses mostly on today's work (previous days were probably captured)
- Creates architecture file if it doesn't exist
- One architecture.md per repository
- Files stored in .ai/para/resources/architectures/[repo]-architecture.md
- When recording "Personal Work" or featrures/changes I've made, make sure to reference date and git branches or commits (if applicable)
    - Later on, if old commits aren't found, then mark that work/feature as possibly not merged or reverted
    - It's possible a PR was opened, but it did not finish, in which case I can review and delete them from the doc manually
- Look for mistakes or places where I corrected you and make sure you do not repeat the same mistakes by updating CLAUDE.md

ARGUMENTS: [--initial-scan] [-v|--verbose]
