---
name: op-request-reason
description: >
  Set OP_REQUEST_REASON inline before running any command that triggers
  1Password auth: `op` (any subcommand), `gh` (alias expands to `op plugin run -- gh`),
  and remote `git` operations (push, pull, fetch, clone, ls-remote, remote update —
  these pull SSH keys from 1Password). The reason is logged to /tmp/op_requests.txt
  by the op/gh shell wrapper so Jack can see what's pending in Raycast before
  approving in 1Password. Triggers automatically before running any of: op, gh,
  git push, git pull, git fetch, git clone, git ls-remote, git remote update.
---

# op-request-reason

Whenever you are about to run a command that touches 1Password — directly or
indirectly via the SSH agent — you MUST set `OP_REQUEST_REASON='<short reason>'`
inline on that exact command. No exceptions.

## When this applies

- **`op`** — any subcommand except `signin`, `signout`, `whoami`, `--version`,
  `--help`, `completion`. Those pass through without auth.
- **`gh`** — every subcommand. The `gh` alias expands to `op plugin run -- gh`,
  so it always routes through `op`.
- **`git` over the network** — `push`, `pull`, `fetch`, `clone`, `ls-remote`,
  `remote update`. These hit `git@github.com:...` and pull the SSH key from
  1Password's SSH agent. Local-only git ops (`status`, `log`, `diff`, `add`,
  `commit`, `branch`, `checkout`, `reset`, `stash`) do NOT need the var.

## How to set it

Set the env var inline on the same command, not as a separate `export`:

```
OP_REQUEST_REASON='<reason>' <command>
```

The shell wrapper for `op`/`gh` reads it at invocation time and refuses to run
(exit 2) when running under an AI agent without it.

## Reason format

- One short clause, lowercase, no trailing period.
- Name the concrete object: vault item, repo, branch, PR number.
- Tie to the immediate goal — what *for*, not what command you're running.

### Good

```
OP_REQUEST_REASON='reading gh token for PR comment' op read op://Personal/Github/token
OP_REQUEST_REASON='listing open PRs on nrwl/nx' gh pr list --repo nrwl/nx --state open
OP_REQUEST_REASON='pushing fix-NXC-3505 for review' git push -u origin fix-NXC-3505
OP_REQUEST_REASON='cloning ocean for local repro' git clone git@github.com:nrwl/ocean.git
OP_REQUEST_REASON='fetching latest master before rebase' git fetch origin master
```

### Bad

```
OP_REQUEST_REASON='running gh' gh pr view 123          # too vague
OP_REQUEST_REASON='auth' op read ...                   # useless
OP_REQUEST_REASON='user asked me to' git push          # not the WHY
```

## What happens behind the scenes

For `op` and `gh`, the wrapper at `~/projects/dot-ai-config/fish/functions/op.fish`
(and the matching bash function in `bashrc`) appends a TSV line to
`/tmp/op_requests.txt`:

```
<uid>\t<iso-ts>\t<cwd>\t<reason>\top <args...>
```

The line is removed when the command completes. A Raycast command surfaces
pending entries so Jack sees what he's approving before tapping the 1Password
prompt.

For `git`, the SSH agent integration handles auth itself — setting
`OP_REQUEST_REASON` on git commands is required for consistency and future
tooling, even though the current wrapper only logs `op`/`gh`.

## Failure modes

- Forgetting `OP_REQUEST_REASON` on `op`/`gh` → wrapper exits 2 with an error.
  Re-run with the variable set.
- Setting it as a separate `export` line in a different invocation → variable
  isn't on the command's env. Always set inline.
