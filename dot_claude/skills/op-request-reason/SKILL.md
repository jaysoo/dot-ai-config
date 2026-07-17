---
name: op-request-reason
description: >
  Log 1Password auth requests to /private/tmp/op_requests.txt before running
  any command that triggers a 1P prompt: `op` (any subcommand) and remote
  `git` ops (push, pull, fetch, clone, ls-remote, remote update — these pull
  SSH keys from 1Password's agent). The log line shows up in Raycast so Jack
  sees what's pending before approving the 1P prompt. Triggers automatically
  before running any of: op, git push, git pull, git fetch, git clone, git
  ls-remote, git remote update.
---

# op-request-reason

No helper script. No wrapper. You write the log line inline before the command,
then patch it after, every time. If you skip it, nothing gets logged and the
audit trail breaks.

## What to do

Before running any `op` or remote `git` command, run this exact shell block
in a single Bash call. Substitute `<reason>` and `<command>` only:

```bash
uid="$$-$RANDOM" log=/private/tmp/op_requests.txt
printf 'PENDING\t%s\t%s\t%s\t%s\t%s\n' \
    "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" '<reason>' '<command>' >>"$log"
<command>; rc=$?
tab=$(printf '\t'); tmp=$(mktemp)
[ $rc -eq 0 ] && outcome=APPROVED || outcome=DENIED
sed "s|^PENDING${tab}${uid}${tab}|${outcome}${tab}${uid}${tab}|" "$log" >"$tmp" && mv "$tmp" "$log"
exit $rc
```

The block:
1. Appends `PENDING` line to `/private/tmp/op_requests.txt` (uid, ISO ts, cwd, reason, command).
2. Runs the command, preserving exit code.
3. Rewrites the line to `APPROVED` or `DENIED` based on exit code.

Raycast surfaces pending entries so Jack sees what he's approving before
tapping the 1Password prompt.

## When this applies

- **`op`** — any subcommand except `signin`, `signout`, `whoami`, `--version`,
  `--help`, `completion`. Those pass through without auth.
- **`git` over the network** — `push`, `pull`, `fetch`, `clone`, `ls-remote`,
  `remote update`. These hit `git@github.com:...` and pull the SSH key from
  1Password's SSH agent. Local-only git ops (`status`, `log`, `diff`, `add`,
  `commit`, `branch`, `checkout`, `reset`, `stash`) do NOT need logging.

- **`gh`** — when run through the `op plugin run -- gh` wrapper it pulls a
  token from 1Password, so log it like any other `op` auth request. (`gh` is
  allowed again — see top-level CLAUDE.md. Never echo `gh auth token`.)

## Examples

Reading a vault item:

```bash
uid="$$-$RANDOM" log=/private/tmp/op_requests.txt
printf 'PENDING\t%s\t%s\t%s\t%s\t%s\n' \
    "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" 'reading mongo readonly password for cnw stats query' 'op read op://Personal/MongoReadonly/password' >>"$log"
op read op://Personal/MongoReadonly/password; rc=$?
tab=$(printf '\t'); tmp=$(mktemp)
[ $rc -eq 0 ] && outcome=APPROVED || outcome=DENIED
sed "s|^PENDING${tab}${uid}${tab}|${outcome}${tab}${uid}${tab}|" "$log" >"$tmp" && mv "$tmp" "$log"
exit $rc
```

Pushing a branch:

```bash
uid="$$-$RANDOM" log=/private/tmp/op_requests.txt
printf 'PENDING\t%s\t%s\t%s\t%s\t%s\n' \
    "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" 'pushing fix-NXC-3505 for review' 'git push -u origin fix-NXC-3505' >>"$log"
git push -u origin fix-NXC-3505; rc=$?
tab=$(printf '\t'); tmp=$(mktemp)
[ $rc -eq 0 ] && outcome=APPROVED || outcome=DENIED
sed "s|^PENDING${tab}${uid}${tab}|${outcome}${tab}${uid}${tab}|" "$log" >"$tmp" && mv "$tmp" "$log"
exit $rc
```

## Reason format

- One short clause, lowercase, no trailing period.
- Name the concrete object: vault item, repo, branch, PR number.
- Tie to the immediate goal — what *for*, not what command you're running.

### Good

```
'reading mongo readonly password for cnw stats query'
'fetching origin/main before rebase'
'pushing fix-NXC-3505 for review'
```

### Bad

```
'running op'           # too vague
'auth'                 # useless
'user asked me to'     # not the WHY
```

## Quoting gotchas

- The block uses single quotes around the reason and command strings — keep
  them single-quoted so `$` and backticks in the command don't expand at the
  `printf` step.
- If the reason or command contains a single quote, switch that string to
  double quotes and escape any `"` or `$` inside.
- The trailing `exit $rc` propagates the real exit code so callers see the
  command's true outcome, not the `sed`/`mv` exit code.
