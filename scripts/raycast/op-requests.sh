#!/usr/bin/env bash
# @raycast.schemaVersion 1
# @raycast.title 1Password: Recent Requests
# @raycast.mode fullOutput
# @raycast.icon 🔐
# @raycast.packageName 1Password
# @raycast.description Last 20 gh/op credential requests from /private/tmp/op_requests.txt

# Written by auth-proxy (~/.local/bin/{gh,op}). One line per request:
#   <ISO timestamp>\t<cwd>\t<command>
log=/private/tmp/op_requests.txt

if [ ! -s "$log" ]; then
    echo "No requests logged at $log"
    exit 0
fi

printf '%-10s  %-18s  %s\n' TIME PROJECT COMMAND
printf '%-10s  %-18s  %s\n' ---------- ------------------ -------

tail -n 20 "$log" | tail -r | awk -F'\t' '
{
    time = substr($1, 12, 8)
    n    = split($2, parts, "/")
    printf "%-10s  %-18s  %s\n", time, parts[n], $3
}
'
