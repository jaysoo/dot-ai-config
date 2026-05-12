---
name: op-request-reason
description: >
  Log 1Password auth requests to /private/tmp/op_requests.txt before running
  any command that triggers a 1P prompt: `op` (any subcommand), `gh` (alias
  expands to `op plugin run -- gh`), and remote `git` ops (push, pull, fetch,
  clone, ls-remote, remote update — these pull SSH keys from 1Password's
  agent). The log line shows up in Raycast so Jack sees what's pending before
  approving the 1P prompt. Triggers automatically before running any of: op,
  gh, git push, git pull, git fetch, git clone, git ls-remote, git remote
  update.
---

# op-request-reason

There is **no shell wrapper** for `op`/`gh` anymore — the audit log only gets
written if **you** write it. Before running any command that will trigger a
1Password prompt, invoke the helper:

```
/Users/jack/projects/dot-ai-config/scripts/op-log-run.sh '<reason>' <command> [args...]
```

The helper:
1. Appends a `PENDING` line to `/private/tmp/op_requests.txt` (uid, ISO ts, cwd, reason, command).
2. Runs the command, preserving stdin/stdout/stderr and exit code.
3. Rewrites the line to `APPROVED` or `DENIED` based on the command's exit code.

Raycast surfaces pending entries so Jack sees what he's approving before
tapping the 1Password prompt.

## When this applies

- **`op`** — any subcommand except `signin`, `signout`, `whoami`, `--version`,
  `--help`, `completion`. Those pass through without auth.
- **`gh`** — every subcommand. The `gh` alias expands to `op plugin run -- gh`,
  so it always routes through `op`.
- **`git` over the network** — `push`, `pull`, `fetch`, `clone`, `ls-remote`,
  `remote update`. These hit `git@github.com:...` and pull the SSH key from
  1Password's SSH agent. Local-only git ops (`status`, `log`, `diff`, `add`,
  `commit`, `branch`, `checkout`, `reset`, `stash`) do NOT need logging.

## Examples

```
/Users/jack/projects/dot-ai-config/scripts/op-log-run.sh 'reading gh token for PR comment' op read op://Personal/Github/token

/Users/jack/projects/dot-ai-config/scripts/op-log-run.sh 'listing open PRs on nrwl/nx' gh pr list --repo nrwl/nx --state open

/Users/jack/projects/dot-ai-config/scripts/op-log-run.sh 'pushing fix-NXC-3505 for review' git push -u origin fix-NXC-3505

/Users/jack/projects/dot-ai-config/scripts/op-log-run.sh 'cloning ocean for local repro' git clone git@github.com:nrwl/ocean.git

/Users/jack/projects/dot-ai-config/scripts/op-log-run.sh 'fetching latest master before rebase' git fetch origin master
```

## Reason format

- One short clause, lowercase, no trailing period.
- Name the concrete object: vault item, repo, branch, PR number.
- Tie to the immediate goal — what *for*, not what command you're running.

### Good

```
'reading gh token for PR comment'
'listing open PRs on nrwl/nx'
'pushing fix-NXC-3505 for review'
```

### Bad

```
'running gh'           # too vague
'auth'                 # useless
'user asked me to'     # not the WHY
```

## What if the helper isn't reachable?

If the helper path errors (e.g. running from a sandbox that can't see the
dot-ai-config repo), fall back to inline logging:

```bash
uid="$$-$RANDOM" log=/private/tmp/op_requests.txt
printf 'PENDING\t%s\t%s\t%s\t%s\t%s\n' \
    "$uid" "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$PWD" '<reason>' '<command>' >>"$log"
<command>; rc=$?
tab=$(printf '\t'); tmp=$(mktemp)
[ $rc -eq 0 ] && outcome=APPROVED || outcome=DENIED
sed "s|^PENDING${tab}${uid}${tab}|${outcome}${tab}${uid}${tab}|" "$log" >"$tmp" && mv "$tmp" "$log"
```

But prefer the helper — it's the canonical path.
