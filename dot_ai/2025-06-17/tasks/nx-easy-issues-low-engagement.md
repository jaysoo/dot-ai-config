# Nx Low Engagement Issues for Closure

## Overview
93 issues with low engagement (<5 reactions and <5 comments) from the last 3 months.

## Top Candidates for Immediate Closure

### Issues with 0 reactions and 0 comments (Prime candidates)

#### Configuration/Setup Issues
```bash
# Close configuration issues with no engagement
gh issue close -R nrwl/nx \
  31292 30980 31495 30466 30421 30649 30831 30768 30914 31354 30614 \
  -c "Closing this issue due to inactivity. If you're still experiencing this problem with the latest version of Nx, please feel free to reopen with updated information."
```

#### Version-Specific Issues
```bash
# Close version-specific issues with no engagement
gh issue close -R nrwl/nx \
  31068 30595 30647 30763 30778 30784 31329 31515 \
  -c "Closing this version-specific issue due to no community engagement. Please update to the latest version of Nx and reopen if the issue persists."
```

### Issues with minimal engagement (1-2 reactions/comments)

#### With Reproduction but No Progress
```bash
# Close issues with repro but no follow-up
gh issue close -R nrwl/nx \
  31197 31468 30473 \
  -c "Closing this issue due to low engagement despite having a reproduction. Please reopen if this is still affecting you in the latest version of Nx."
```

#### Documentation/Question Issues
```bash
# Close documentation questions with minimal engagement
gh issue close -R nrwl/nx \
  31111 31163 31205 31309 31409 \
  -c "Closing this documentation question due to low engagement. Please check our updated documentation at https://nx.dev or open a discussion if you need further clarification."
```

## Batch Processing Script

Create this script to process all low-engagement issues:

```bash
#!/bin/bash
# File: .ai/2025-06-17/tasks/close-low-engagement-issues.sh

# Issues with 0 reactions and 0 comments
ZERO_ENGAGEMENT=(
  31292 30980 31495 30466 30421 30649 30831 30768 30914 31354
  30614 30595 30647 30763 30778 30784 31329 31515 30859 30929
  30565 30651 31479 31462 31448 31430 31398 31391 31378 31344
)

# Issues with 1-2 total engagement
LOW_ENGAGEMENT=(
  31197 31468 30473 31111 31163 31205 31309 31409 31068 31496
  31556 31104 31180 30748 31037 31286 31431 31366 31200 31185
)

echo "Closing ${#ZERO_ENGAGEMENT[@]} issues with zero engagement..."
gh issue close -R nrwl/nx ${ZERO_ENGAGEMENT[@]} \
  -c "Closing this issue due to no community engagement. If you're still experiencing this problem with the latest version of Nx (v21.1.3), please feel free to reopen with updated information and we'll investigate."

echo "Closing ${#LOW_ENGAGEMENT[@]} issues with low engagement..."
gh issue close -R nrwl/nx ${LOW_ENGAGEMENT[@]} \
  -c "Closing this issue due to low community engagement over the past 3 months. If this issue is still relevant, please reopen with updated information including reproduction steps with the latest version of Nx."
```

## Statistics

- **Total Low Engagement**: 93 issues
- **Zero Engagement** (0 reactions, 0 comments): ~60 issues
- **Minimal Engagement** (1-4 total interactions): ~33 issues

## Recommendations

1. **Immediate Action**: Close all zero-engagement issues older than 1 month
2. **Review First**: Issues with 3-4 interactions might have valuable information
3. **Preserve**: Keep issues with clear reproductions and recent activity
4. **Communication**: Use a friendly, helpful closing message that encourages reopening if needed

## Sample Closing Messages

### For Zero Engagement:
"Closing this issue due to no community engagement. If you're still experiencing this problem with the latest version of Nx (v21.1.3), please feel free to reopen with updated information and we'll investigate."

### For Low Engagement:
"Closing this issue due to low community engagement over the past 3 months. If this issue is still relevant, please reopen with updated information including reproduction steps with the latest version of Nx."

### For Documentation Issues:
"Closing this documentation question due to low engagement. Please check our updated documentation at https://nx.dev or open a discussion if you need further clarification."