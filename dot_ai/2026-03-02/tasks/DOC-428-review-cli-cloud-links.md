# DOC-428: Review All CLI and Cloud Links

**Status:** In Progress
**Date:** 2026-03-02
**Linear:** https://linear.app/nxdev/issue/DOC-428/review-all-cli-and-cloud-links

## Summary

Audited all `https://nx.dev` links in the **nx** and **ocean** repos (excluding docs content, node_modules, changelogs). Found **~150 unique URLs** across **~340+ occurrences** in source files.

---

## 404s (Broken - Fix Immediately)

| # | URL | Repo | Files |
|---|-----|------|-------|
| 1 | `https://nx.dev/nx-api/nx/documents/release` | nx | `packages/nx/src/command-line/migrate/migrate.ts`, `graph/ui-project-details/.../property-info-tooltip.tsx` |
| 2 | `https://nx.dev/nx-api/nx/executors/run-commands` | nx | `graph/ui-project-details/.../get-display-header-from-target-configuration.ts` |
| 3 | `https://nx.dev/nx-api/nx/executors/run-script` | nx | `graph/ui-project-details/.../get-display-header-from-target-configuration.ts` |
| 4 | `https://nx.dev/nx-api/shared-fs-cache` | ocean | `libs/nx-packages/shared-fs-cache/package.json` |
| 5 | `https://nx.dev/nx-api/s3-cache` | ocean | `libs/nx-packages/s3-cache/package.json` |
| 6 | `https://nx.dev/nx-api/gcs-cache` | ocean | `libs/nx-packages/gcs-cache/package.json` |
| 7 | `https://nx.dev/code-owners` | ocean | `libs/nx-packages/owners/src/generators/sync-codeowners-file/generator.ts` (commented out) |
| 8 | `https://nx.dev/ci/enterprise/conformance/configure-conformance-rules-in-nx-cloud` | ocean | `libs/nx-packages/client-bundle/.../conformance.ts` |
| 9 | `https://nx.dev/ci/features/polygraph` | ocean | `libs/nx-cloud/feature-polygraph-agent-sessions/.../agent-sessions-list.tsx`, `agent-sessions-container.tsx` |
| 10 | `https://nx.dev/docs/features/ci-features/self-healing` | ocean | `libs/nx-cloud/feature-workspace-dashboard/.../workspace-spec-markers.tsx` (missing `-ci` suffix) |

### Notes on 404s:
- **#1-3**: The `/nx-api/nx/documents/` and `/nx-api/nx/executors/` paths appear to have been restructured. Need to find the new canonical paths.
- **#4-6**: The cache packages were renamed from `powerpack-*` to non-prefixed names but the `/nx-api/` pages weren't created for the new names.
- **#7**: `code-owners` page likely moved to `/docs/enterprise/owners`.
- **#8**: Conformance configure path doesn't exist; should be `/docs/enterprise/conformance` or similar.
- **#9**: Polygraph page at `/ci/features/polygraph` doesn't exist; should be `/docs/enterprise/polygraph`.
- **#10**: Typo - missing `-ci` suffix. Should be `self-healing-ci`.

---

## Redirects (301) - Update Once URL Structure Finalized

### Category: Old `/getting-started/` paths → `/docs/getting-started/`
| URL | Redirects To |
|-----|-------------|
| `/getting-started/intro` | `/docs/getting-started/intro` |
| `/getting-started/editor-setup` | `/docs/getting-started/intro` |
| `/getting-started/adding-to-existing` | `/docs/getting-started/intro` |
| `/getting-started/nx-and-angular` | `/docs/getting-started/intro` |
| `/getting-started/intro#learn-nx` | `/docs/getting-started/intro` |
| `/getting-started/tutorials` | `/docs/getting-started/intro` |
| `/getting-started/tutorials/react-monorepo-tutorial` | `/docs/getting-started/intro` |
| `/getting-started/tutorials/react-standalone-tutorial` | `/docs/getting-started/tutorials/react-monorepo-tutorial` |
| `/getting-started/tutorials/angular-standalone-tutorial` | `/docs/getting-started/tutorials/angular-monorepo-tutorial` |
| `/getting-started/tutorials/angular-monorepo-tutorial` | `/docs/getting-started/intro` |

### Category: Old `/concepts/` paths → `/docs/concepts/`
| URL | Redirects To |
|-----|-------------|
| `/concepts/inferred-tasks` | `/docs/concepts/inferred-tasks` |
| `/concepts/executors-and-configurations` | `/docs/concepts/executors-and-configurations` |
| `/concepts/how-caching-works` | `/docs/concepts/how-caching-works` |
| `/concepts/task-pipeline-configuration` | `/docs/concepts/task-pipeline-configuration` |
| `/concepts/sync-generators` | `/docs/concepts/sync-generators` |
| `/concepts/more-concepts/faster-builds-with-module-federation` | `/concepts/module-federation/...` |
| `/more-concepts/global-nx` | `/concepts/more-concepts/global-nx` |

### Category: Old `/features/` paths → `/docs/features/`
| URL | Redirects To |
|-----|-------------|
| `/features/run-tasks` | `/docs/features/run-tasks` |
| `/features/manage-releases` | `/docs/features/manage-releases` |
| `/features/manage-releases#using-the-programmatic-api...` | `/docs/features/manage-releases` (loses anchor) |
| `/features/automate-updating-dependencies` | `/docs/features/automate-updating-dependencies` |
| `/features/maintain-ts-monorepos` | `/docs/features/maintain-typescript-monorepos` |
| `/features/cache-task-results#cache-task-results` | `/docs/features/cache-task-results` |
| `/features/powerpack/conformance` | `/docs/enterprise/conformance` |
| `/features/powerpack/owners` | `/docs/enterprise/owners` |

### Category: Old `/ci/` paths → `/docs/` paths
| URL | Redirects To |
|-----|-------------|
| `/ci/features/affected` | `/docs/features/ci-features/affected` |
| `/ci/features/flaky-tasks` | `/docs/features/ci-features/flaky-tasks` |
| `/ci/features/split-e2e-tasks` | `/docs/features/ci-features/split-e2e-tasks` |
| `/ci/features/distribute-task-execution` | `/docs/features/ci-features/distribute-task-execution` |
| `/ci/features/distribute-task-execution#running-things-in-parallel` | `/docs/features/ci-features/distribute-task-execution` (loses anchor) |
| `/ci/features/remote-cache` | `/docs/features/ci-features/remote-cache` |
| `/ci/features/self-healing-ci` | `/docs/features/ci-features/self-healing-ci` |
| `/ci/intro/ci-with-nx` | `/docs/guides/nx-cloud/setup-ci` |
| `/ci/intro/why-nx-cloud` | `/docs/getting-started/nx-cloud` |
| `/ci/concepts/cache-security` | `/docs/concepts/ci-concepts/cache-security` |
| `/ci/reference/nx-cloud-cli` | `/docs/reference/nx-cloud-cli` |
| `/ci/reference/nx-cloud-cli#npx-nxcloud-startcirun` | `/docs/reference/nx-cloud-cli` (loses anchor) |
| `/ci/reference/nx-cloud-cli#npx-nxcloud-fix-ci` | `/docs/reference/nx-cloud-cli` |
| `/ci/reference/nx-cloud-cli#npx-nxcloud-logout` | `/docs/reference/nx-cloud-cli` |
| `/ci/reference/nx-cloud-cli#npx-nxcloud-stopallagents` | `/docs/reference/nx-cloud-cli` |
| `/ci/reference/nx-cloud-cli#npx-nxcloud-configure` | `/docs/reference/nx-cloud-cli` |
| `/ci/reference/nx-cloud-cli#npx-nxcloud-convert-to-nx-cloud-id` | `/docs/reference/nx-cloud-cli` |
| `/ci/reference/assignment-rules` | `/docs/reference/nx-cloud/assignment-rules` |
| `/ci/reference/launch-templates` | `/docs/reference/nx-cloud/launch-templates` |
| `/ci/reference/launch-templates#validating-launch-templates` | `/docs/reference/nx-cloud/launch-templates` (loses anchor) |
| `/ci/recipes/set-up` | `/docs/guides/nx-cloud/setup-ci` |
| `/ci/recipes/set-up/monorepo-ci-azure` | `/docs/guides/nx-cloud/setup-ci` |
| `/ci/recipes/security/personal-access-tokens` | `/docs/guides/nx-cloud/personal-access-tokens` |
| `/ci/recipes/dte` | `/docs/guides/nx-cloud/manual-dte` |
| `/ci/recipes/source-control-integration` | `/docs/guides/nx-cloud/source-control-integration` |
| `/ci/recipes/other/record-commands#recording-nonnx-commands` | `/docs/guides/nx-cloud/record-commands` |
| `/ci/recipes/enterprise/on-premise` | `https://github.com/nrwl/nx-cloud-helm` |
| `/ci/recipes/enterprise/on-premise/auth-single-admin#finding-usernames` | `https://github.com/nrwl/nx-cloud-helm` |
| `/ci/recipes/enterprise/conformance/publish-conformance-rules-to-nx-cloud` | `/docs/enterprise/publish-conformance-rules-to-nx-cloud` |

### Category: Old `/recipes/` paths → `/docs/guides/`
| URL | Redirects To |
|-----|-------------|
| `/recipes/adopting-nx` | `/docs/guides/adopting-nx/` |
| `/recipes/adopting-nx/adding-to-monorepo` | `/docs/guides/adopting-nx/adding-to-monorepo` |
| `/recipes/adopting-nx/adding-to-monorepos` | `/docs/guides/adopting-nx/adding-to-monorepos` |
| `/recipes/adopting-nx/adding-to-existing-project` | `/docs/guides/adopting-nx/adding-to-existing-project` |
| `/recipes/adopting-nx/from-turborepo` | `/docs/guides/adopting-nx/from-turborepo` |
| `/recipes/angular/migration/angular` | `/docs/technologies/angular` |
| `/recipes/installation/install-non-javascript` | `/docs/guides/installation/install-non-javascript` |
| `/recipes/running-tasks/pass-args-to-commands` | `/docs/guides/tasks--caching/pass-args-to-commands` |
| `/recipes/running-tasks/configure-inputs` | `/docs/guides/tasks--caching/configure-inputs` |
| `/recipes/running-tasks/configure-outputs` | `/docs/guides/tasks--caching/configure-outputs` |
| `/recipes/running-tasks/convert-to-inferred` | `/docs/guides/tasks--caching/convert-to-inferred` |
| `/recipes/tips-n-tricks/advanced-update` | `/docs/guides/tips-n-tricks/advanced-update` |
| `/recipes/tips-n-tricks/eslint` | `/docs/technologies/eslint` |
| `/recipes/nx-release/file-based-versioning-version-plans` | `/docs/guides/nx-release/file-based-versioning-version-plans` |
| `/recipes/nx-release/configure-custom-registries` | `/docs/guides/nx-release/configure-custom-registries` |
| `/recipes/node/application-proxies` | `/technologies/node/recipes/application-proxies` |
| `/recipes/webpack/webpack-config-setup` | `/technologies/build-tools/webpack/recipes/webpack-config-setup` |
| `/recipes/storybook/custom-builder-configs` | `/technologies/test-tools/storybook/recipes/custom-builder-configs` |

### Category: Other redirects
| URL | Redirects To |
|-----|-------------|
| `/reference/nx-json` | `/docs/reference/nx-json` |
| `/reference/nx-json#release` | `/docs/reference/nx-json` (loses anchor) |
| `/reference/project-configuration` | `/docs/reference/project-configuration` |
| `/reference/project-configuration#task-definitions-targets` | `/docs/reference/project-configuration` (loses anchor) |
| `/reference/project-configuration#parallelism` | `/docs/reference/project-configuration` (loses anchor) |
| `/reference/inputs#inputs-and-named-inputs` | `/docs/reference/inputs` (loses anchor) |
| `/plugin-registry` | `/docs/plugin-registry` |
| `/plugin-registry#powerpack` | `/docs/plugin-registry` (loses anchor) |
| `/deprecated/legacy-cache#nxrejectunknownlocalcache` | `/docs/reference/deprecated/legacy-cache` (loses anchor) |
| `/deprecated/global-implicit-dependencies` | `/docs/reference/deprecated/global-implicit-dependencies` |
| `/deprecated/custom-tasks-runner` | `/docs/reference/deprecated/custom-tasks-runner` |
| `/deprecated/affected-config` | `/docs/reference/deprecated/affected-config` |
| `/troubleshooting/troubleshoot-nx-install-issues` | `/docs/troubleshooting/troubleshoot-nx-install-issues` |
| `/troubleshooting/unknown-local-cache` | `/docs/troubleshooting/unknown-local-cache` |
| `/extending-nx/recipes/create-preset` | `/docs/extending-nx/recipes/create-preset` |
| `/extending-nx/intro/getting-started` | `/docs/extending-nx/intro` |
| `/nx/affected` | `/docs/reference/nx-commands#nx-affected` |
| `/nx-enterprise/powerpack/conformance` | `/docs/enterprise/conformance` |
| `/nx-enterprise/powerpack/owners` | `/docs/enterprise/owners` |
| `/nx-enterprise/activate-powerpack` | `/docs/enterprise/activate-license` |
| `/powerpack` | `/enterprise` |
| `/pricing` | `/nx-cloud#plans` |
| `/core-features/manage-releases` | `/features/manage-releases` (double redirect) |
| `/guides/customize-webpack` | `/recipes/webpack/webpack-config-setup` (double redirect) |
| `/guides/using-tailwind-css-in-react` | `/recipes/react/using-tailwind-css-in-react` |
| `/cypress/v10-migration-guide` | `/packages/cypress/documents/v11-migration-guide` |
| `/react-tutorial/1-code-generation` | `/docs/getting-started/tutorials/react-monorepo-tutorial` |
| `/nx-api/eslint-plugin/documents/dependency-checks` | `/technologies/eslint/eslint-plugin/recipes/dependency-checks` |
| `/nx-api/powerpack-shared-fs-cache` | `/nx-api/shared-fs-cache` (→ 404!) |
| `/nx-api/powerpack-azure-cache` | `/nx-api/azure-cache` |
| `/nx-api/powerpack-s3-cache` | `/nx-api/s3-cache` (→ 404!) |
| `/nx-api/powerpack-gcs-cache` | `/nx-api/gcs-cache` (→ 404!) |
| `/packages/jest/documents/overview` | `/nx-api/jest/documents/overview` |
| `/ai` | `/` (redirects to homepage) |
| `/launch-nx` | `/` (redirects to homepage) |

---

## 200 OK (Working)

| URL | Context |
|-----|---------|
| `https://nx.dev/` | Homepage |
| `https://nx.dev/nx-cloud` | Nx Cloud marketing page |
| `https://nx.dev/community` | Community page |
| `https://nx.dev/company` | Company page |
| `https://nx.dev/enterprise` | Enterprise page |
| `https://nx.dev/enterprise/trial` | Enterprise trial page |
| `https://nx.dev/contact/sales` | Sales contact page |
| `https://nx.dev/customers` | Customers page |
| `https://nx.dev/remote-cache` | Remote cache page |
| `https://nx.dev/nx-cloud?utm_source=nx.app` | Nx Cloud with UTM |
| `https://nx.dev/assets/powerpack/NxPowerpack-Trial-v1.1.pdf` | Powerpack trial PDF |
| `https://nx.dev/blog/nx-cloud-introducing-polygraph#...` | Blog post |
| `https://nx.dev/docs/getting-started/intro` | Docs getting started |
| `https://nx.dev/docs/getting-started/nx-cloud` | Docs Nx Cloud getting started |
| `https://nx.dev/docs/getting-started/start-with-existing-project` | Docs existing project |
| `https://nx.dev/docs/getting-started/tutorials/angular-monorepo-tutorial` | Angular tutorial |
| `https://nx.dev/docs/getting-started/tutorials/react-monorepo-tutorial` | React tutorial |
| `https://nx.dev/docs/getting-started/tutorials/typescript-packages-tutorial` | TS packages tutorial |
| `https://nx.dev/docs/technologies/node/guides/deploying-node-projects` | Node deploy guide |
| `https://nx.dev/docs/features/ci-features/distribute-task-execution` | DTE docs |
| `https://nx.dev/docs/features/ci-features/remote-cache` | Remote cache docs |
| `https://nx.dev/docs/features/ci-features/self-healing-ci` | Self-healing CI docs |
| `https://nx.dev/docs/features/ci-features/self-healing-ci#configuration-with-self_healingmd` | Self-healing config |
| `https://nx.dev/docs/features/ci-features/github-integration` | GitHub integration |
| `https://nx.dev/docs/features/ci-features/flaky-tasks#flaky-task-analytics` | Flaky tasks analytics |
| `https://nx.dev/docs/concepts/ci-concepts/cache-security` | Cache security |
| `https://nx.dev/docs/reference/inputs` | Inputs reference |
| `https://nx.dev/docs/reference/nx-cloud/credits-pricing` | Credits pricing |
| `https://nx.dev/docs/reference/nx-cloud/credits-pricing#agents-resource-classes` | Resource classes |
| `https://nx.dev/docs/reference/nx-cloud-cli` | Cloud CLI reference |
| `https://nx.dev/docs/reference/nx-cloud-cli#nx-cloud-complete-ci-run` | Complete CI run |
| `https://nx.dev/docs/reference/nx-cloud-cli#--stop-agents-after` | Stop agents after |
| `https://nx.dev/docs/guides/nx-cloud/source-control-integration/github` | GitHub integration guide |
| `https://nx.dev/docs/guides/nx-cloud/source-control-integration/github#install-the-app` | GitHub app install |
| `https://nx.dev/docs/guides/nx-cloud/source-control-integration/bitbucket` | Bitbucket guide |
| `https://nx.dev/docs/guides/nx-cloud/source-control-integration/gitlab` | GitLab guide |
| `https://nx.dev/docs/guides/nx-cloud/source-control-integration/azure-devops` | Azure DevOps guide |
| `https://nx.dev/docs/guides/nx-cloud/setup-ci` | CI setup guide |
| `https://nx.dev/docs/guides/nx-cloud/access-tokens` | Access tokens guide |
| `https://nx.dev/docs/guides/nx-cloud/access-tokens#access-types` | Access types |
| `https://nx.dev/docs/guides/nx-cloud/personal-access-tokens#personal-access-token-access-level` | PAT access level |
| `https://nx.dev/docs/guides/nx-cloud/google-auth` | Google auth guide |
| `https://nx.dev/docs/guides/tasks--caching/self-hosted-caching` | Self-hosted caching |
| `https://nx.dev/docs/enterprise/polygraph` | Polygraph docs |

---

## Double Redirects (Chains)

These redirect to another URL that itself redirects:

| Original URL | First Redirect | Final Destination |
|-------------|----------------|-------------------|
| `/core-features/manage-releases` | → `/features/manage-releases` | → `/docs/features/manage-releases` |
| `/guides/customize-webpack` | → `/recipes/webpack/webpack-config-setup` | → `/technologies/build-tools/webpack/...` |
| `/nx-api/powerpack-shared-fs-cache` | → `/nx-api/shared-fs-cache` | → **404** |
| `/nx-api/powerpack-s3-cache` | → `/nx-api/s3-cache` | → **404** |
| `/nx-api/powerpack-gcs-cache` | → `/nx-api/gcs-cache` | → **404** |

---

## Priority Actions

### P0: Fix 404s Now
1. **`/nx-api/nx/documents/release`** - Used in migrate CLI output and graph UI tooltip. Need to create page or update URL.
2. **`/nx-api/nx/executors/run-commands`** - Used in graph UI. Need page or URL fix.
3. **`/nx-api/nx/executors/run-script`** - Used in graph UI. Need page or URL fix.
4. **`/nx-api/shared-fs-cache`** - Package homepage in ocean. Create page or redirect.
5. **`/nx-api/s3-cache`** - Package homepage in ocean. Create page or redirect.
6. **`/nx-api/gcs-cache`** - Package homepage in ocean. Create page or redirect.
7. **`/ci/enterprise/conformance/configure-conformance-rules-in-nx-cloud`** - Used in ocean CLI help. Update URL.
8. **`/ci/features/polygraph`** - Used in ocean UI. Update to `/docs/enterprise/polygraph`.
9. **`/docs/features/ci-features/self-healing`** - Typo, missing `-ci`. Fix in ocean `workspace-spec-markers.tsx`.
10. **`/code-owners`** - Commented out in ocean, low priority but should be cleaned.

### P1: Follow-up - Update Redirecting URLs
Once the new URL structure is stable, update all ~80+ redirecting URLs in source code to point directly to their final destinations.

### P2: Anchors Lost in Redirects
Several URLs with `#anchor` fragments redirect to pages that strip the anchor. The content may still exist on the target page but the deep-link is broken.
