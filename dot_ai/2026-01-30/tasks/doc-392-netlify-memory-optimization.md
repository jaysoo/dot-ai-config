# DOC-392: Reduce nx-dev Next.js Build Memory Usage Below 8 GB

## Issue
- Linear: https://linear.app/nxdev/issue/DOC-392
- Problem: `nx-dev:deploy-build` uses 11+ GB memory, exceeding Netlify's 8 GB limit

## Solution Implemented

### Memory Optimization
1. **Added `experimental.cpus: 1`** in `next.config.js` - limits static generation workers
2. **Upgraded Next.js** from 14.2.28 to 14.2.35 - includes memory improvements
3. **Added `NODE_OPTIONS: "--max-old-space-size=4096"`** to deploy-build target - forces earlier GC

### Netlify Deployment Configuration
4. **Created `nx-dev/nx-dev/netlify.toml`** with `@netlify/plugin-nextjs` for proper SSR deployment
5. **Added `netlify` configurations** to `build`, `build-base`, and `deploy-build` targets in project.json
6. **Updated `next-sitemap.config.js`** to detect `NETLIFY` env and use correct output paths

## Files Modified

| File | Changes |
|------|---------|
| `nx-dev/nx-dev/next.config.js` | Added `experimental: { cpus: 1 }`, webpack devtool: false |
| `nx-dev/nx-dev/project.json` | Added `netlify` configurations to multiple targets |
| `nx-dev/nx-dev/netlify.toml` | New file - Netlify plugin configuration |
| `nx-dev/nx-dev/next-sitemap.config.js` | Detect NETLIFY env for correct paths |
| `package.json` | Upgraded next to 14.2.35, added @netlify/plugin-nextjs |

## Key Technical Details

### Why `experimental.cpus: 1` Helps
- Limits the number of worker processes for static page generation
- Reduces concurrent memory usage during build
- Combined with NODE_OPTIONS, keeps memory well under 8 GB

### Netlify vs Vercel Build Outputs
- **Default (Vercel/local)**: Build to `dist/nx-dev/nx-dev/`
- **Netlify**: Build to `nx-dev/nx-dev/` (in-place for plugin compatibility)

### next-sitemap Configuration
Detects `NETLIFY=true` environment variable to use correct paths:
```javascript
const isNetlify = process.env.NETLIFY === 'true';
const buildOutputDir = isNetlify
  ? path.resolve(__dirname, '.next')
  : path.resolve(__dirname, '../../dist/nx-dev/nx-dev/.next');
```

## Verification
- Build completes successfully on Netlify
- Site deploys correctly with SSR/middleware support
- Sitemap generates in correct location

## Branch
DOC-392
