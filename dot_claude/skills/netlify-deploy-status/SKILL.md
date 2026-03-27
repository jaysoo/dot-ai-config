---
name: netlify-deploy-status
description: Check Netlify deploy status for Nx sites. Use when user asks "is it deployed?", "deploy status", "check deploy", "is main deployed?", or "did it deploy?". Auto-selects sites based on current repo.
---

# Netlify Deploy Status

Check deploy status for Nx platform sites on Netlify.

## Site Mapping

Determine which sites to check based on the current repo:

| Repo (pwd basename or git remote) | Netlify Sites |
|-------------------------------------|--------------|
| `nx` or `nx-dev` | `nx-dev`, `nx-docs` |
| `nx-blog` | `nrwl-blog` |

If the repo doesn't match any known mapping, ask the user which site to check.

## How to Check

Use the Netlify CLI API to list recent deploys:

```bash
netlify api listSiteDeploys --data '{"site_id": "SITE_ID"}' 2>&1 | \
  node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); \
  d.slice(0,5).forEach(x => console.log(x.state, x.created_at, x.commit_ref?.substring(0,7), (x.title||'').split('\n')[0].substring(0,60)))"
```

### Known Site IDs

| Site | Site ID |
|------|---------|
| `nrwl-blog` | `d32d8fc6-c66f-44ff-a076-d6ea363bfd29` |
| `nx-dev` | Look up via `netlify sites:list \| grep nx-dev` |
| `nx-docs` | Look up via `netlify sites:list \| grep nx-docs` |

Cache site IDs after first lookup — they don't change.

## Answering User Questions

### "Is it deployed?" / "Deploy status"
Show the latest 3 deploys with state, timestamp, and commit ref. Highlight whether the most recent commit on the current branch is deployed.

### "Is main deployed?" / "Did the push go through?"
1. Get the latest commit on main: `git rev-parse --short HEAD` (or `origin/main`)
2. Check if that commit ref appears in recent deploys
3. Report: deployed (ready), building, or not yet triggered

### "Is my branch deployed?" / Deploy preview check
1. Get current branch name
2. Look for deploy previews: deploys where `branch` matches or `context` is `deploy-preview`
3. Report status

## Output Format

Keep it concise:

```
nrwl-blog: 15c1450 ready (2m ago) — feat(blog): add OpenGraph meta tags
```

If multiple sites (nx repo), show each on one line. Only expand details if the user asks.
