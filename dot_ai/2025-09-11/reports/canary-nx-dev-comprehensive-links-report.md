# Canary.nx.dev Internal Links Report

Generated: 2025-09-11

## Executive Summary

Analysis of canary.nx.dev internal links (excluding /docs) reveals:
- **16 pages returning 200 OK** (working correctly)
- **18 pages with 308 redirects** to /docs (documentation pages)
- **0 broken links (404 errors)**

## All Internal Non-Docs Pages

### ✅ Working Pages (200 OK)

#### Main Site Pages
- `/` - Homepage
- `/ai` - AI landing page
- `/nx-cloud` - Nx Cloud product page
- `/enterprise` - Nx Enterprise page
- `/contact` - Contact form
- `/community` - Community page
- `/customers` - Customer showcase
- `/webinar` - Webinar listings

#### Company Pages
- `/company` - About us
- `/careers` - Job openings
- `/brands` - Brand guidelines

#### Blog
- `/blog` - Blog index
- `/blog/payfit-success-story` - PayFit case study
- `/blog/hetzner-cloud-success-story` - Hetzner case study
- `/blog/ukg-success-story` - UKG case study
- `/blog/nx-agents-changes-the-math` - Vattenfall case study

### ↪️ Pages with Redirects (308 - Permanent Redirect)

These pages redirect to the new /docs structure on Astro:

#### Documentation Pages (Redirecting to /docs)
| Original URL | Redirects To |
|--------------|--------------|
| `/pricing` | `/nx-cloud#plans` |
| `/plugin-registry` | `/docs/plugin-registry` |
| `/getting-started/intro` | `/docs/getting-started/intro` |

#### Feature Pages (Redirecting to /docs/features)
| Original URL | Redirects To |
|--------------|--------------|
| `/features/run-tasks` | `/docs/features/run-tasks` |
| `/features/cache-task-results` | `/docs/features/cache-task-results` |
| `/features/enhance-AI` | `/docs/features/enhance-ai` |
| `/features/enforce-module-boundaries` | `/docs/features/enforce-module-boundaries` |
| `/features/generate-code` | `/docs/features/generate-code` |
| `/features/automate-updating-dependencies` | `/docs/features/automate-updating-dependencies` |

#### CI/Cloud Features (Redirecting to /docs/features/ci-features)
| Original URL | Redirects To |
|--------------|--------------|
| `/ci/features` | `/docs/features/ci-features` |
| `/ci/features/remote-cache` | `/docs/features/ci-features/remote-cache` |
| `/ci/features/distribute-task-execution` | `/docs/features/ci-features/distribute-task-execution` |
| `/ci/features/self-healing-ci` | `/docs/features/ci-features/self-healing-ci` |

#### Concepts & Recipes (Redirecting to /docs)
| Original URL | Redirects To |
|--------------|--------------|
| `/concepts/decisions/why-monorepos` | `/docs/concepts/decisions/why-monorepos` |
| `/concepts/nx-plugins` | `/docs/concepts/nx-plugins` |
| `/recipes/running-tasks/terminal-ui` | `/docs/guides/tasks--caching/terminal-ui` |

#### Enterprise/Powerpack (Redirecting to /docs/enterprise)
| Original URL | Redirects To |
|--------------|--------------|
| `/nx-enterprise/powerpack/owners` | `/docs/enterprise/powerpack/owners` |
| `/nx-enterprise/powerpack/conformance` | `/docs/enterprise/powerpack/conformance` |

## Additional Pages from Sitemap

Based on sitemap analysis, canary.nx.dev also includes many more blog posts:

### Recent Blog Posts (Sample)
- `/blog/announcing-nx-20`
- `/blog/monorepos-are-ai-future-proof`
- `/blog/android-and-nx`
- `/blog/architecting-angular-applications`
- `/blog/ci-affected-graph`
- `/blog/custom-runners-and-self-hosted-caching`
- `/blog/dynamic-targets-with-inference-tasks`
- `/blog/fast-effortless-ci`
- `/blog/improved-module-federation`
- `/blog/introducing-nx-powerpack`

### Special Pages
- `/advent-of-code` - Advent of Code challenges
- `/ai-chat` - AI chat interface
- `/blog/atom.xml` - Blog RSS feed (Atom format)
- `/blog/rss.xml` - Blog RSS feed

## Key Findings

1. **No Broken Links**: All checked internal links either work (200) or redirect appropriately (308)

2. **Documentation Migration**: 18 documentation-related URLs properly redirect to the new `/docs` structure, indicating successful migration to Astro

3. **Consistent Redirect Pattern**: All doc redirects use 308 (Permanent Redirect) status, which is appropriate for permanent URL changes

4. **Marketing Pages Intact**: All marketing, company, and blog pages return 200 OK

## Recommendations

1. **Update Internal Links**: While redirects work, updating the 18 redirecting links in the codebase would improve performance by avoiding unnecessary redirects

2. **Monitor Blog Links**: The blog contains many links to old documentation URLs that will trigger redirects

3. **Consider Link Wrapper**: For temporary backward compatibility, the conditional URL transformation approach (checking `NEXT_PUBLIC_ASTRO_URL`) is working as intended

## Technical Notes

- All redirects use HTTP 308 (Permanent Redirect), preserving the original HTTP method
- The redirect pattern consistently adds `/docs` prefix to documentation pages
- Some URLs have been restructured (e.g., `/recipes/running-tasks/terminal-ui` → `/docs/guides/tasks--caching/terminal-ui`)
- Marketing pages (`/ai`, `/nx-cloud`, `/enterprise`) remain on the Next.js app, not redirected