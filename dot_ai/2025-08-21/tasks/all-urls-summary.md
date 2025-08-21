# Complete URL Summary for DOC-107

## Statistics
- **Total documentation URLs found**: 506
- **Successfully mapped**: 145
  - High confidence: 36
  - Medium confidence: 0  
  - Low confidence: 109
- **Need manual review**: 361

## High Confidence Redirects (35) - IMPLEMENTED ✅
These have been added to `redirect-rules-docs-to-astro.js`:

**Note**: `/webinar` was incorrectly identified in initial analysis but NOT included in implementation as it's a marketing page, not documentation.

1. `/getting-started` → `/docs/getting-started`
2. `/getting-started/intro` → `/docs/getting-started/intro`
3. `/getting-started/installation` → `/docs/getting-started/installation`
4. `/getting-started/start-new-project` → `/docs/getting-started/start-new-project`
5. `/getting-started/editor-setup` → `/docs/getting-started/editor-setup`
6. `/getting-started/tutorials` → `/docs/getting-started/tutorials`
7. `/features` → `/docs/features`
8. `/features/run-tasks` → `/docs/features/run-tasks`
9. `/features/cache-task-results` → `/docs/features/cache-task-results`
10. `/features/explore-graph` → `/docs/features/explore-graph`
11. `/features/generate-code` → `/docs/features/generate-code`
12. `/features/automate-updating-dependencies` → `/docs/features/automate-updating-dependencies`
13. `/features/enforce-module-boundaries` → `/docs/features/enforce-module-boundaries`
14. `/features/manage-releases` → `/docs/features/manage-releases`
15. `/features/ci-features` → `/docs/features/ci-features`
16. `/concepts` → `/docs/concepts`
17. `/concepts/mental-model` → `/docs/concepts/mental-model`
18. `/concepts/how-caching-works` → `/docs/concepts/how-caching-works`
19. `/concepts/task-pipeline-configuration` → `/docs/concepts/task-pipeline-configuration`
20. `/concepts/nx-plugins` → `/docs/concepts/nx-plugins`
21. `/concepts/inferred-tasks` → `/docs/concepts/inferred-tasks`
22. `/concepts/types-of-configuration` → `/docs/concepts/types-of-configuration`
23. `/concepts/executors-and-configurations` → `/docs/concepts/executors-and-configurations`
24. `/concepts/common-tasks` → `/docs/concepts/common-tasks`
25. `/concepts/sync-generators` → `/docs/concepts/sync-generators`
26. `/concepts/typescript-project-linking` → `/docs/concepts/typescript-project-linking`
27. `/concepts/buildable-and-publishable-libraries` → `/docs/concepts/buildable-and-publishable-libraries`
28. `/concepts/daemon` → `/docs/concepts/daemon`
29. `/concepts/decisions` → `/docs/concepts/decisions`
30. `/concepts/decisions/overview` → `/docs/concepts/decisions/overview`
31. `/concepts/decisions/why-monorepos` → `/docs/concepts/decisions/why-monorepos`
32. `/concepts/decisions/dependency-management` → `/docs/concepts/decisions/dependency-management`
33. `/concepts/decisions/code-ownership` → `/docs/concepts/decisions/code-ownership`
34. `/concepts/decisions/project-size` → `/docs/concepts/decisions/project-size`
35. `/concepts/decisions/project-dependency-rules` → `/docs/concepts/decisions/project-dependency-rules`
36. `/concepts/decisions/folder-structure` → `/docs/concepts/decisions/folder-structure`

## Low Confidence Mappings (109) - NEED REVIEW ⚠️
These were found but need verification as the paths changed structure:

### Recipes → Guides migrations
Most `/recipes/*` URLs appear to map to `/docs/guides/*` in the new structure:

- `/recipes/installation/*` → `/docs/guides/installation/*`
- `/recipes/running-tasks/*` → `/docs/guides/tasks--caching/*`
- `/recipes/adopting-nx/*` → `/docs/guides/adopting-nx/*`
- `/recipes/nx-release/*` → `/docs/guides/nx-release/*`
- `/recipes/nx-console/*` → `/docs/guides/nx-console/*`
- `/recipes/enforce-module-boundaries/*` → `/docs/guides/enforce-module-boundaries/*`
- `/recipes/managing-repository/*` → `/docs/guides/managing-repository/*`
- `/recipes/module-federation/*` → `/docs/guides/module-federation/*`

(Full list in `redirect-mappings-v2.json`)

## Unmapped URLs (361) - NEED INVESTIGATION 🔍

These URLs exist in nx.dev but no clear match was found in the Astro site:

### CI-related paths
- `/ci` (and many subpaths)
- `/ci/features/*`
- `/ci/concepts/*`
- `/ci/intro/*`
- `/ci/quickstart/*`
- `/ci/recipes/*`
- `/ci/reference/*`
- `/ci/tutorials/*`

### Package/Plugin documentation
- `/nx-api/*` endpoints
- `/packages/*` documentation
- Individual plugin docs (`/angular/*`, `/react/*`, `/vue/*`, etc.)

### Reference documentation
- `/reference/releases`
- `/reference/nx-json`
- `/reference/project-configuration`
- `/reference/commands`
- `/reference/environment-variables`

### Extending Nx
- `/extending-nx/*` paths

### Enterprise/PowerPack
- `/enterprise/*`
- `/powerpack/*`

## Action Items

1. **Implemented** ✅: High confidence redirects added to redirect system
2. **Needs Review**: Low confidence mappings should be manually verified
3. **Needs Investigation**: 361 unmapped URLs need to be checked against new Astro site structure
4. **Testing Required**: Verify redirects work in local development

## Files Created/Modified

### Created:
- `/nx-dev/nx-dev/redirect-rules-docs-to-astro.js` - New redirect rules
- `/.ai/2025-08-21/tasks/find-non-doc-pages.mjs` - Script to find doc links
- `/.ai/2025-08-21/tasks/create-redirect-mappings-v2.mjs` - Script to generate mappings
- `/.ai/2025-08-21/tasks/redirect-mappings-v2.md` - Human-readable mappings
- `/.ai/2025-08-21/tasks/redirect-mappings-v2.json` - JSON mappings

### Modified:
- `/nx-dev/nx-dev/redirect-rules.js` - Added import and export of new redirects
- `docs/blog/2023-09-18-introducing-playwright-support-for-nx.md` - Updated link
- `nx-dev/nx-dev/pages/changelog.tsx` - Updated link
- `nx-dev/nx-dev/pages/plugin-registry.tsx` - Updated link