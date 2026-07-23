# DOC-552 site and redirect audit

## Scope

- PR: https://github.com/nrwl/nx/pull/36414
- Production sitemap: https://nx.dev/docs/sitemap-0.xml
- Local build sitemap: `astro-docs/dist/sitemap-0.xml`
- Local site: `http://localhost:9006/docs`

Astro's local server does not execute Netlify redirect rules, so the local site was used to verify destination pages while redirect coverage was audited from `astro-docs/netlify.toml` and exercised against the deploy preview.

## Coverage

- 184 of 184 files moved into `astro-docs/src/content/docs/kb` have exact old-path redirects.
- 26 of 26 production `/docs/knowledge-base` index and topic URLs have redirects.
- 211 of 211 expected Knowledge Base routes exist in the built sitemap:
  - 1 Knowledge Base index
  - 184 articles
  - 26 topic indexes
- All 213 production sitemap URLs removed by this branch have a redirect.
- 210 of those 213 URLs now redirect directly to `/docs/kb/...`.
- The other three URLs are the environment-variable pages consolidated by master into `/docs/reference/environment-variables`; they are unrelated to the Knowledge Base move.
- No redirect targets are missing from the local sitemap.
- No conflicting duplicate sources, nonexistent local targets, redirect chains, or redirects into another moved path remain.

## Fixes made during review

Eight older aliases still pointed at legacy routes that this PR moves, creating two-hop redirects. They now point directly to their final Knowledge Base routes:

1. Storybook 9 setup -> `/docs/kb/upgrading-storybook`
2. Manual DTE -> `/docs/kb/bring-your-own-compute`
3. Decisions overview -> `/docs/kb/monorepo-vs-polyrepo`
4. Why monorepos -> `/docs/kb/what-is-a-monorepo`
5. Create preset recipe -> `/docs/kb/create-preset`
6. Adopting Nx/Turborepo comparison -> `/docs/kb/nx-vs-turborepo`
7. Angular multiple-project migration -> `/docs/kb/migrate-angular-cli-to-nx`
8. Configure Vite alias -> `/docs/kb/configure-vite`

The deploy preview's 210 production-to-KB redirects were bulk checked. Seventeen transient 500/502 responses passed on immediate sequential retry, confirming the deployed redirect rules.

## Code review

One merge-blocking regression was found and fixed: conditional breadcrumb classes omitted a separating space, producing invalid classes such as `text-smfont-medium` on non-KB documentation pages.

Non-blocking cleanup completed:

- Removed the unused direct `@pagefind/default-ui` dependency left over from reverted search customization.
- Removed unused `legacyIndex` Knowledge Base topic metadata.
- Updated the Vale exception for `next-config-setup.mdoc` to its new Knowledge Base path.

The Git-based last-modified lookup still assumes Knowledge Base files are committed. That is true for all current articles and provides an intentional failure for an untracked future article, so it is not a merge blocker.

## Validation

- `pnpm nx run astro-docs:build --skipNxCache` — passed, 777 pages built.
- `pnpm nx run astro-docs:validate-links` — passed, 770 internal links checked across 796 HTML files.
- `pnpm nx run astro-docs:lint` — passed.
- `pnpm nx run astro-docs:vale` — passed with 0 errors; existing warnings and suggestions remain.
- `git diff --check` — passed.
- Exhaustive redirect audit — passed with zero missing moves, chains, conflicting sources, invalid targets, or uncovered removed production URLs.
