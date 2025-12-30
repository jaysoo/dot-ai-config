# DOC-330: Netlify Migration Review

**Date**: 2025-12-29
**Status**: Paused - Issues Identified
**Worktree**: `/Users/jack/projects/nx-worktrees/DOC-330`
**Branch**: `DOC-330`
**Commit**: `75313598d8`

## Summary

Reviewed the Vercel to Netlify migration configuration for nx-dev. Found several issues that need to be addressed before deployment will work reliably.

## Issues Found

### 1. Missing `@netlify/plugin-nextjs`

The `netlify.toml` doesn't include the Netlify Next.js runtime plugin. Without it:
- Middleware won't work (DOC-372 added middleware.ts for Framer proxy)
- API routes may have issues
- ISR/revalidation won't work properly
- External rewrites may not function correctly

**Fix required:**
```toml
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 2. ~959 Redirect Rules

The `redirect-rules.js` file contains approximately 959 redirect rules. Netlify has a limit of ~1000 redirect rules, and processes them differently than Vercel.

**Risk**: May hit limits as more redirects are added.

### 3. External Rewrites

The `next.config.js` contains rewrites that proxy to `NEXT_PUBLIC_ASTRO_URL` (external Astro docs site). This requires the Netlify Next.js runtime to work properly.

### 4. Middleware Compatibility

The DOC-330 branch predates DOC-372 which added `middleware.ts` for Framer proxy. If middleware is now on master, the Netlify plugin is required for it to function.

### 5. Output Mode

- Current: Default output mode (no `output` specified)
- Recommendation: Keep default - do NOT change to `standalone`
- Reason: Changing to standalone would break parallel Vercel deployment and requires manual static file handling

## Files Reviewed

- `/Users/jack/projects/nx-worktrees/DOC-330/nx-dev/nx-dev/netlify.toml` (40 lines)
- `/Users/jack/projects/nx-worktrees/DOC-330/nx-dev/nx-dev/next.config.js`
- `/Users/jack/projects/nx-worktrees/DOC-330/nx-dev/nx-dev/redirect-rules.js` (~959 rules)
- `/Users/jack/projects/nx-worktrees/DOC-330/nx-dev/nx-dev/package.json`

## Recommended Actions

1. Add `@netlify/plugin-nextjs` to `netlify.toml`
2. Test deployment on Netlify preview branch before DNS switch
3. Verify middleware works (if DOC-372 is merged)
4. Monitor redirect rule count - may need to consolidate/reduce
5. Keep default output mode for parallel Vercel/Netlify deployment

## Migration Plan (Original)

1. Deploy nx-dev to Netlify alongside existing Vercel deployment
2. Test and validate Netlify deployment
3. Update DNS to point to Netlify
4. Remove Vercel deployment after 2 weeks

## Next Steps

- [ ] Update `netlify.toml` to add Netlify Next.js plugin
- [ ] Rebase DOC-330 on master to include DOC-372 middleware changes
- [ ] Test deployment on Netlify
- [ ] Verify all routes/rewrites/redirects work
