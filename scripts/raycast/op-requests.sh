#!/usr/bin/env bash
# @raycast.schemaVersion 1
# @raycast.title 1Password: Recent Requests
# @raycast.mode fullOutput
# @raycast.icon 🔐
# @raycast.packageName 1Password
# @raycast.description Last 10 entries from /private/tmp/op_requests.txt

log=/private/tmp/op_requests.txt

if [ ! -s "$log" ]; then
    echo "No requests logged at $log"
    exit 0
fi

printf '%-8s  %-8s  %-15s  %-32s  %s\n' STATUS TIME PROJECT REASON COMMAND
printf '%-8s  %-8s  %-15s  %-32s  %s\n' -------- -------- --------------- -------------------------------- -------

tail -n 10 "$log" | tail -r | awk -F'\t' '
{
    status = $1
    time   = substr($3, 12, 8)
    n      = split($4, parts, "/")
    proj   = parts[n]
    reason = $5
    cmd    = $6
    printf "%-8s  %-8s  %-15s  %-32s  %s\n", status, time, proj, reason, cmd
}
'
