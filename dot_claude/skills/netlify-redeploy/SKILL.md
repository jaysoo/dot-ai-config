---
name: netlify-redeploy
description: Redeploy Nx documentation sites on Netlify to refresh banner data or other dynamic content. Triggers production builds for nx-docs and/or nx-dev without uploading local files. Use when you need to "redeploy", "refresh banner", "rebuild netlify", or "trigger deploy".
---

# Netlify Redeploy

Trigger production rebuilds for Nx documentation sites on Netlify.

## Sites

| Site | Netlify Dashboard |
|------|-------------------|
| `nx-docs` | https://app.netlify.com/projects/nx-docs/deploys |
| `nx-dev` | https://app.netlify.com/projects/nx-dev/deploys |

## Commands

**Important**: Run from `~` or a non-monorepo directory to avoid project detection prompts.

Redeploy both sites (most common):

```bash
cd ~ && netlify deploy --trigger --prod -s nx-docs && netlify deploy --trigger --prod -s nx-dev
```

Redeploy individual sites:

```bash
# nx-docs only
cd ~ && netlify deploy --trigger --prod -s nx-docs

# nx-dev only
cd ~ && netlify deploy --trigger --prod -s nx-dev
```

## Notes

- `--trigger` triggers a build on Netlify without uploading local files
- `--prod` deploys to production (not draft)
- `-s SITE` specifies the site by name
- Can run from any directory (no local files needed)
- Build typically takes 2-5 minutes

## When to Use

- Refresh banner data or announcements
- Force cache invalidation
- Sync with updated environment variables
- Trigger rebuild after Netlify configuration changes

## Verification

After triggering, check deploy status:
- nx-docs: https://app.netlify.com/projects/nx-docs/deploys
- nx-dev: https://app.netlify.com/projects/nx-dev/deploys
