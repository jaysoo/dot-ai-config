#!/usr/bin/env bash
# Append PENDING line to /private/tmp/op_requests.txt, run the command, then
# rewrite the line to APPROVED/DENIED based on exit code. Invoked by the
# op-request-reason skill so Claude can log 1Password auth requests to the
# audit log without an op/gh shell-level wrapper.
#
# Usage: op-log-run.sh <reason> <command> [args...]
set -u
if [ $# -lt 2 ]; then
    echo "usage: op-log-run.sh <reason> <command> [args...]" >&2
    exit 64
fi
reason=$1; shift
log=/private/tmp/op_requests.txt
uid="$$-$RANDOM"
tab=$(printf '\t')
printf 'PENDING\t%s\t%s\t%s\t%s\t%s\n' \
    "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" "$reason" "$*" >>"$log"
"$@"; rc=$?
[ $rc -eq 0 ] && outcome=APPROVED || outcome=DENIED
if [ -f "$log" ]; then
    tmp=$(mktemp)
    sed "s|^PENDING${tab}${uid}${tab}|${outcome}${tab}${uid}${tab}|" "$log" >"$tmp" 2>/dev/null
    mv "$tmp" "$log"
fi
exit $rc
