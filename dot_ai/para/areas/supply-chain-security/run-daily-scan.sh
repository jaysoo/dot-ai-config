#!/usr/bin/env bash
# Daily wrapper around security-scan.sh.
# Captures output to a report file and, on failure, shows a persistent
# dialog whose "Open Report" button actually opens that file.

set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT="$DIR/last-scan-report.txt"

bash "$DIR/security-scan.sh" | tee "$REPORT"
status="${PIPESTATUS[0]}"

if [ "$status" -ne 0 ]; then
  btn="$(osascript \
    -e 'display dialog "Problems were found in the security scan. Read report for details." with title "Security Issue" buttons {"Open Report", "Dismiss"} default button "Open Report" with icon caution' \
    -e 'button returned of result' 2>/dev/null)"
  [ "$btn" = "Open Report" ] && open -e "$REPORT"
fi

exit "$status"
