#!/bin/bash
# Script to close low-engagement Nx issues from the last 3 months
# Date: 2025-06-17

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

# Issues with workarounds
WORKAROUND_ISSUES=(
  31292 31495 31496 31556 31104
)

# Documentation issues
DOC_ISSUES=(
  31111 31037 30831 30768 30914 30649 31354 30614 31163 31205
  31309 31409 30595 30647 30859 30929 30565 30651 30763 30778
  30784 31329 31515
)

echo "=== Nx Issue Closure Script ==="
echo "Date: $(date)"
echo ""

# Function to close issues with a specific message
close_issues() {
  local message="$1"
  shift
  local issues=("$@")
  
  if [ ${#issues[@]} -gt 0 ]; then
    echo "Closing ${#issues[@]} issues..."
    gh issue close -R nrwl/nx ${issues[@]} -c "$message"
    echo "Done."
    echo ""
  fi
}

# Close issues with workarounds
echo "1. Closing issues with workarounds (${#WORKAROUND_ISSUES[@]} issues)..."
close_issues "Closing this issue as a workaround has been provided. Please try the latest version of Nx and reopen if the issue persists." ${WORKAROUND_ISSUES[@]}

# Close documentation issues with low engagement
echo "2. Closing documentation issues (${#DOC_ISSUES[@]} issues)..."
close_issues "Closing this documentation issue due to low engagement. If this documentation gap still exists, please feel free to reopen with specific details about what information is missing in the current docs at https://nx.dev." ${DOC_ISSUES[@]}

# Close remaining zero engagement issues
echo "3. Closing zero engagement issues..."
# Remove duplicates from ZERO_ENGAGEMENT that are already in other arrays
REMAINING_ZERO=()
for issue in ${ZERO_ENGAGEMENT[@]}; do
  if [[ ! " ${WORKAROUND_ISSUES[@]} ${DOC_ISSUES[@]} " =~ " ${issue} " ]]; then
    REMAINING_ZERO+=($issue)
  fi
done
close_issues "Closing this issue due to no community engagement. If you're still experiencing this problem with the latest version of Nx (v21.1.3), please feel free to reopen with updated information and we'll investigate." ${REMAINING_ZERO[@]}

# Close low engagement issues
echo "4. Closing low engagement issues..."
# Remove duplicates from LOW_ENGAGEMENT that are already closed
REMAINING_LOW=()
for issue in ${LOW_ENGAGEMENT[@]}; do
  if [[ ! " ${WORKAROUND_ISSUES[@]} ${DOC_ISSUES[@]} " =~ " ${issue} " ]]; then
    REMAINING_LOW+=($issue)
  fi
done
close_issues "Closing this issue due to low community engagement over the past 3 months. If this issue is still relevant, please reopen with updated information including reproduction steps with the latest version of Nx." ${REMAINING_LOW[@]}

echo "=== Issue closure complete ==="
echo "Total issues processed: $(( ${#WORKAROUND_ISSUES[@]} + ${#DOC_ISSUES[@]} + ${#REMAINING_ZERO[@]} + ${#REMAINING_LOW[@]} ))"