# Raw Docs System Specification

## Overview

The Raw Docs system is an internal documentation workflow designed to capture developer knowledge about features as they are being built. This system serves as a bridge between feature development and user-facing documentation, ensuring that technical details and context are preserved for the documentation team.

## Objectives

1. **Capture Feature Context**: Document the "why" behind features while the context is fresh in developers' minds
2. **Reduce Documentation Debt**: Create a systematic process for documenting features before they ship
3. **Enable Async Collaboration**: Allow docs team to work independently from developers' schedules
4. **Maintain Feature History**: Track feature evolution and provide context for future maintenance
5. **Improve Documentation Quality**: Ensure user docs are based on accurate technical information

## Repository Structure

```
raw-docs/
├── README.md                    # Lists all active features with last updated dates
├── ARCHIVED.md                  # Lists archived features with archive dates and reasons
├── TEMPLATE.md                  # Template for new feature documentation
├── .github/
│   └── workflows/
│       └── weekly-review.yml    # Automated weekly report for docs team
├── archived/
│   ├── cloud-local-agents.md
│   └── ... (one file per feature)
├── scripts/
│   ├── archive-feature.js       # Script to move features to archived
│   ├── check-developers.js      # Script to verify/update developers field
│   └── generate-review.js       # Generate weekly review report
├── features-cloud
│   ├── nx-agents.md
│   ├── self-healing-ci.md
│   └── ... (one file per feature)
└── features-cli/
    ├── project-crystal.md
    ├── continuous-tasks.md
    └── ... (one file per feature)
```

## Template Format (TEMPLATE.md)

**IMPORTANT:** This should be copied to the relevant features folder. e.g. `cp TEMPLATE.md features-cli/node-backend.md`

**IMPORTANT:** For AI/LLMs (e.g. Claude, Cursor, etc.), use TEMPLATE.md and for each section, ask a question to fill in the details. Ask only one question at a time.

```markdown
# Feature Name

## Metadata
- **Created**: YYYY-MM-DD
- **Status**: draft | in-progress | shipped | deprecated
- **Developers**: @username1, @username2 (GitHub usernames)
- **Target Release**: vX.Y.Z (if known)

## Motivation

Why are we building this feature? What problem does it solve?

## Target Users

Who will use this feature? What are their use cases?

## Technical Details

### How It Works

High-level explanation of the implementation.

### Configuration & Feature Flags

Is this feature is gated behind configuration or flags?

For example, for CLI it could be a property in `nx.json`.

\`\`\`json
{
  "foo": "bar"
}
\`\`\`

Are there environment variables that control this feature?

#### `NX_FEATURE_FLAG_NAME`

Description of what it enables/disables

- Default value: enabled/disabled
- Available since: vX.Y.Z

## Code References

Key files and their purposes:
- `packages/nx/src/feature/index.ts` - Main entry point
- `packages/nx/src/feature/config.ts` - Configuration handling
- `e2e/nx/src/feature.test.ts` - E2E tests

## Examples


### Loom Demos

List any relevant Looms and what they demonstrate.

- Walkthrough of basic functionality: https://www.loom.com/share/<id>

### Basic Usage

Pages, screenshots, commands for the basic usage.

### Advanced Usage

More complex example.

## Migration Guide

Does this feature significantly change or replace existing functionality? If so, what should users do to adopt it?

## Known Limitations

Are there limitations for what this feature can do that users may try?

- Limitation 1
- Limitation 2

## Edge Cases

Are there edge cases to consider for this feature?

## Documentation Impact

List out relevant docs pages:

- `/concepts/mental-model` - Add new concept explanation
- `/reference/configuration` - Add new config options
- `/recipes/feature-usage` - Add usage examples

## FAQ

Common questions that are asked during development.

## Related Features

- Links to GitHub issues/PRs/RFCs.
- Links to related raw docs
```

## Workflows

### Developer Workflow

1. **Creating New Feature Doc**
   ```bash
   # Copy template
   cp TEMPLATE.md features/my-new-feature.md
   ```

   **Note:** AI helps a lot here.

2. **Updating Existing Doc**
   - Make changes to feature doc
   - Developers field updated manually or via script

3. **Pre-Push Hook Reminder**
   ```
   🔍 Raw Docs Reminder:
   - Have you documented any new features in raw-docs?
   - Have you updated existing raw docs for modified features?
   
   Modified files in this push:
   - packages/nx/src/new-feature/index.ts (NEW)
   - packages/angular/src/generators/... (MODIFIED)
   - ...
   
   Press Enter to continue or Ctrl+C to cancel and update raw docs first.
   ```

### Docs Team Workflow

1. **Weekly Review Process**
   - Automated weekly report generated every Monday
   - Report includes:
     - New features added
     - Features updated in last week
     - Features not updated in 3+ months (archive candidates)
     - Features with status changes

2. **Creating Plan Files**
   Plan includes:
   - Summary of raw doc content
   - Identified documentation pages to update
   - Specific changes needed per page

3. **Archive Process**
   - Features with no updates for 3-6 months flagged
   - Docs team reviews and decides on archival
   - Run `node scripts/archive-feature.mjs feature-name`
   - Moves content to ARCHIVED.md with timestamp

## Git Hooks Implementation

### Pre-Push Hook (.git/hooks/pre-push)

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Raw Docs Reminder${NC}"
echo ""

# Get list of modified files in this push
modified_files=$(git diff --name-only @{u} HEAD)

# Check for new or modified feature files
new_features=()
modified_features=()

while IFS= read -r file; do
    if [[ $file == packages/*/src/* ]] || [[ $file == e2e/* ]]; then
        if git diff --name-only @{u} HEAD~1 | grep -q "$file"; then
            modified_features+=("$file")
        else
            new_features+=("$file")
        fi
    fi
done <<< "$modified_files"

if [ ${#new_features[@]} -gt 0 ]; then
    echo -e "${RED}New feature files detected:${NC}"
    printf '%s\n' "${new_features[@]}"
    echo ""
fi

if [ ${#modified_features[@]} -gt 0 ]; then
    echo -e "${YELLOW}Modified feature files:${NC}"
    printf '%s\n' "${modified_features[@]}"
    echo ""
fi

echo "Have you:"
echo "  ✓ Documented any new features in raw-docs?"
echo "  ✓ Updated existing raw docs for modified features?"
echo ""
echo -e "${GREEN}Press Enter to continue or Ctrl+C to cancel${NC}"
read -r

# Continue with push
exit 0
```

## AI Integration Points

### 1. Developer Field Updates

```javascript
// scripts/check-developers.js
// Analyzes git history and suggests developer updates

async function updateDevelopersField(featureFile) {
  const gitLog = await getGitContributors(featureFile);
  const codeOwners = await findCodeOwners(relatedFiles);
  const suggestions = mergeDeveloperLists(gitLog, codeOwners);
  
  // Update file with suggestions
  await updateMarkdownField(featureFile, 'Developers', suggestions);
}
```

### 2. Documentation Impact Analysis

```javascript
// scripts/analyze-impact.js
// AI-powered analysis to find affected documentation

async function analyzeDocumentationImpact(rawDoc) {
  const feature = parseRawDoc(rawDoc);
  
  // Use AI to analyze which docs need updates
  const prompt = `
    Given this feature: ${feature.name}
    With these code changes: ${feature.codeReferences}
    And this functionality: ${feature.description}
    
    Which documentation pages need updates?
    Consider: concepts, references, recipes, API docs
  `;
  
  const suggestions = await aiAnalyze(prompt);
  return formatDocumentationPlan(suggestions);
}
```

### 3. Weekly Review Generation

```javascript
// scripts/generate-review.js
// Generate comprehensive weekly review

async function generateWeeklyReview() {
  const changes = await getWeeklyChanges();
  
  return {
    newFeatures: changes.new,
    updatedFeatures: changes.updated,
    staleFeatures: await findStaleFeatures(90), // 3 months
    suggestedArchives: await findArchiveCandidates(180), // 6 months
    documentationTasks: await generateDocTasks(changes)
  };
}
```

## Testing and Rollout Plan

### Phase 1: Docs Team Provide Initial Setup and Testing (Week 1)
1. Create raw-docs repository structure
2. Implement git hooks and test with small group
3. Create initial templates and examples
4. Document the process in main Nx repo
5. Test out a sample feature change

### Phase 2: Developer Onboarding (Week 2)
1. Announce system to development team
2. Provide training/examples
3. Start with new features only
4. Gather feedback and iterate

### Phase 3: Full Rollout (Week 3)
1. Require raw docs for all new features
2. Backfill documentation for recent features
3. Implement automated reminders
4. Monitor adoption and effectiveness

### Success Metrics
- % of new features with raw docs
- Time from feature merge to documentation update
- Developer satisfaction with process
- Documentation quality improvements
- Reduced back-and-forth between devs and docs team

## Example Files

### Example README.md

```markdown
# Raw Docs - Active Features

This repository contains internal developer documentation for Nx features.

## Active Features

| Feature | Last Updated | Status | Developers |
|---------|--------------|--------|------------|
| [Nx Agents](features/nx-agents.md) | 2025-06-01 | shipped | @vsavkin, @jaysoo |
| [Project Crystal](features/project-crystal.md) | 2025-06-08 | in-progress | @FrozenPandaz, @mandarini |
| [Module Federation v2](features/module-federation-v2.md) | 2025-05-15 | draft | @Coly010, @jaysoo |

## How to Use This Repo

1. Copy TEMPLATE.md when documenting a new feature
2. Fill in all sections with relevant information
3. Update regularly as the feature evolves
4. Check weekly review reports for action items

See CONTRIBUTING.md for detailed guidelines.
```

### Example ARCHIVED.md

```markdown
# Archived Features

Features that are no longer actively maintained or have been superseded.

## 2025 Archives

### Nx Cloud Local Agents
- **Archived**: 2025-06-01
- **Reason**: No longer a top priority for 2025
- **Doc**: [achived/cloud-local-agents.md](./archived/cloud-local-agents.md)

## Maintenance Guidelines

1. **Regular Reviews**: Docs team reviews all raw docs weekly
2. **Stale Content**: Flag features not updated in 3 months
3. **Archive Process**: Move to ARCHIVED.md after 6 months of inactivity
4. **Version Control**: All changes tracked in git history
5. **Access Control**: Write access limited to Nx team members

## Future Enhancements

1. **Automated PR Comments**: Bot that reminds about raw docs in PRs
2. **Metrics Dashboard**: Track documentation coverage and staleness
3. **AI-Powered Suggestions**: Suggest documentation updates based on code changes
4. **Integration with Nx Console**: Quick access to raw docs from IDE
5. **Automated Doc Generation**: Generate initial docs from code analysis

