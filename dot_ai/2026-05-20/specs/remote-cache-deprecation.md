# Spec: remote cache package deprecation (README + docs page)

**Date:** 2026-05-20
**Effective:** 2026-05-21 (Thursday)
**Status:** Draft for developer handoff. Docs page already written and vale-clean (see Deliverable 1).

## Context

Four self-hosted remote cache packages are deprecated due to a design-level vulnerability ([CVE-2025-36852](https://www.cve.org/CVERecord?id=CVE-2025-36852), aka CREEP). See the [Nx blog post](https://nx.dev/blog/creep-vulnerability-build-cache-security#the-creep-vulnerability) and the [Nx security advisory PDF](https://nx.app/files/cve-2025-06/). The flaw cannot be patched within the design of these packages.

Affected packages:

- `@nx/s3-cache`
- `@nx/gcs-cache`
- `@nx/azure-cache`
- `@nx/shared-fs-cache`

Packages remain published on npm so existing builds do not break. They receive no further updates or security patches.

## Goals

1. Publish a single self-contained docs page on nx.dev explaining the deprecation, security rationale, and migration paths.
2. Update each of the 4 package READMEs (in the `ocean` repo at `libs/nx-packages/<pkg>/README.md`) with a deprecation banner at the top, preserving existing setup docs below.
3. Strip mentions of the 4 deprecated packages from existing nx.dev docs, redirecting curious readers to the new deprecation page.

## Non-goals

- Unpublishing the packages from npm.
- Documenting concrete remediation steps for users whose caches may be poisoned. Defer to the existing [CREEP blog post](https://nx.dev/blog/creep-vulnerability-build-cache-security#the-creep-vulnerability).
- Marketing copy for Nx Cloud beyond a single primary CTA.

---

## Deliverable 1: new docs page

**File:** `astro-docs/src/content/docs/deprecations/self-hosted-cache-packages.mdoc` (already created on disk)
**URL:** `/docs/deprecations/self-hosted-cache-packages`
**Layout:** `template: splash` (self-contained, no sidebar)

### Status

- File exists at the canonical path.
- `vale src/content/docs/deprecations/self-hosted-cache-packages.mdoc` passes (0 errors, 0 warnings, 0 suggestions).
- `nx run astro-docs:validate-links` running in background (results pending at spec-write time).
- Heading hierarchy: h1 -> h2 -> h3 (no skipped levels).
- Internal docs links use relative `/docs/...` paths per existing astro-docs convention.
- External blog and marketing links use absolute `https://nx.dev/...` URLs per existing convention.

### Final page content

The file content (verbatim, as it lives on disk after vale fixes):

```markdown
---
title: 'Deprecation notice: self-hosted remote cache packages'
description: '@nx/s3-cache, @nx/gcs-cache, @nx/azure-cache, and @nx/shared-fs-cache are deprecated due to CVE-2025-36852 (CREEP).'
template: splash
head:
  - tag: meta
    attrs:
      name: robots
      content: index, follow
---

# Deprecation notice: self-hosted remote cache packages

`@nx/s3-cache`, `@nx/gcs-cache`, `@nx/azure-cache`, and `@nx/shared-fs-cache` are deprecated as of 2026-05-21.
The CREEP vulnerability ([CVE-2025-36852](https://www.cve.org/CVERecord?id=CVE-2025-36852)) affects all four packages.
The flaw is in their design and cannot be patched.

The four packages use a single credential that grants read and write access across the entire cache.
Nothing in the bucket tracks which branch produced which artifact.

An attacker opens a PR off `main` with no source changes but a modified CI workflow that builds a malicious artifact.
The CI workflow isn't part of the cache key, so the PR hashes to the same key `main` will hash to.
If the PR uploads its artifact first, every later `main` build with that key gets a cache hit on the poisoned artifact and ships it without rebuilding.

Supply chain attacks against open-source ecosystems are now a near-weekly occurrence, and cache poisoning is a known vector.
We have no evidence that these packages have been exploited in the wild, but the design above guarantees that any attempt will succeed.
Treat these packages as a live risk and migrate.

The packages stay on npm so existing builds don't break.
They will not receive updates or security patches.

For background on the vulnerability, see [The CREEP vulnerability and build cache security](https://nx.dev/blog/creep-vulnerability-build-cache-security#the-creep-vulnerability).

## Affected packages

- `@nx/s3-cache`
- `@nx/gcs-cache`
- `@nx/azure-cache`
- `@nx/shared-fs-cache`

## Recommended: Migrate to Nx Cloud

[Nx Cloud](https://nx.dev/nx-cloud) is the supported remote cache.
It includes a free tier for small teams and requires no infrastructure on your side.

To connect your workspace, see [Connect to Nx Cloud](/docs/getting-started/nx-cloud).
If you need on-premises storage, see [Self-hosted caching](/docs/guides/tasks--caching/self-hosted-caching).

## Advanced: Build your own

{% aside type="caution" title="Self-hosting a remote cache is high-risk" %}
Implementing a remote cache server yourself means accepting full responsibility for the threat model that CREEP exposed.
You must understand cache poisoning, artifact integrity, and access control before you deploy one.
A misconfigured implementation reproduces the same vulnerability these deprecated packages had.

The OpenAPI spec requires a 409 Conflict response when a client tries to write a cache key that already exists.
Implementations that allow overwriting existing entries are vulnerable even without a race.
Your implementation must enforce 409 on existing keys.

Most teams should use Nx Cloud instead.
{% /aside %}

If you have the resources to harden and operate a cache server, you can implement the [Nx remote cache OpenAPI specification](/docs/guides/tasks--caching/self-hosted-caching#build-your-own-caching-server).
The four deprecated packages will not be updated to match that specification.

## FAQ

### Were these packages compromised?

No. These remote cache packages have not been compromised.
The security issue is that bucket-based cache solutions are open to cache poisoning attacks by design.

### What should I do if I'm using one of these packages today?

Migrate to Nx Cloud, or implement the OpenAPI specification yourself if you have the resources to harden it.
The packages stay on npm but will not be patched.

### Will these packages receive security patches?

No. The vulnerability is in the design of the packages, not in a fixable bug.

### Will the packages be unpublished from npm?

No. They remain on npm so existing builds do not break. They will not receive updates.
```

### Notes for the developer

- Heading colon rule (per vale): h2 with a colon must capitalize the word after it ("Recommended: Migrate to Nx Cloud", not "...migrate..."). Vale enforces this; do not regress it.
- `{% aside type="caution" %}` matches the codebase convention (Starlight aside over custom components).
- Verify `template: splash` correctly omits the page from the sidebar in a local build (`nx serve astro-docs`).

---

## Deliverable 2: README banner (per package)

**Repo:** `ocean`
**Files:** `libs/nx-packages/{s3-cache,gcs-cache,azure-cache,shared-fs-cache}/README.md`

Insert the banner at the very top of each README (before existing content). Existing setup docs stay below the banner. Each banner is rendered below in full so no substitution is needed.

### `libs/nx-packages/s3-cache/README.md`

```markdown
> [!WARNING]
> **`@nx/s3-cache` is deprecated.**
> `@nx/s3-cache` provides an S3-backed remote cache for Nx. The CREEP vulnerability ([CVE-2025-36852](https://www.cve.org/CVERecord?id=CVE-2025-36852)) affects this package. The flaw is in its design and cannot be patched. The package remains on npm but will not receive updates.
>
> See the [deprecation notice](https://nx.dev/docs/deprecations/self-hosted-cache-packages) for migration paths.

---
```

### `libs/nx-packages/gcs-cache/README.md`

```markdown
> [!WARNING]
> **`@nx/gcs-cache` is deprecated.**
> `@nx/gcs-cache` provides a Google Cloud Storage-backed remote cache for Nx. The CREEP vulnerability ([CVE-2025-36852](https://www.cve.org/CVERecord?id=CVE-2025-36852)) affects this package. The flaw is in its design and cannot be patched. The package remains on npm but will not receive updates.
>
> See the [deprecation notice](https://nx.dev/docs/deprecations/self-hosted-cache-packages) for migration paths.

---
```

### `libs/nx-packages/azure-cache/README.md`

```markdown
> [!WARNING]
> **`@nx/azure-cache` is deprecated.**
> `@nx/azure-cache` provides an Azure Blob Storage-backed remote cache for Nx. The CREEP vulnerability ([CVE-2025-36852](https://www.cve.org/CVERecord?id=CVE-2025-36852)) affects this package. The flaw is in its design and cannot be patched. The package remains on npm but will not receive updates.
>
> See the [deprecation notice](https://nx.dev/docs/deprecations/self-hosted-cache-packages) for migration paths.

---
```

### `libs/nx-packages/shared-fs-cache/README.md`

```markdown
> [!WARNING]
> **`@nx/shared-fs-cache` is deprecated.**
> `@nx/shared-fs-cache` provides a shared-filesystem remote cache for Nx. The CREEP vulnerability ([CVE-2025-36852](https://www.cve.org/CVERecord?id=CVE-2025-36852)) affects this package. The flaw is in its design and cannot be patched. The package remains on npm but will not receive updates.
>
> See the [deprecation notice](https://nx.dev/docs/deprecations/self-hosted-cache-packages) for migration paths.

---
```

### Publish steps

1. Apply banner to all four READMEs.
2. Republish each package (patch bump) so npmjs.com displays the new README.
3. After publish, run `npm deprecate` on each package. Suggested message (matches the page lede, fits in npm's CLI warning):

   ```
   npm deprecate "@nx/<package>@*" "Deprecated: CVE-2025-36852 (CREEP) cannot be patched in this package. See https://nx.dev/docs/deprecations/self-hosted-cache-packages"
   ```

   Apply to all 4 packages with the same message template.

---

## Deliverable 3: scrub existing docs

Scope per the brainstorm: strip 4-package mentions, but keep the broader "build your own caching server" / self-hosted Nx Cloud content intact. Each existing page should link out to the new deprecation page where the packages used to appear.

### Files to edit

| File | Action |
| --- | --- |
| `astro-docs/src/content/docs/guides/Tasks & Caching/self-hosted-caching.mdoc` | Remove the section listing the 4 packages. Add a short pointer at the start of the file (or in the relevant section) to the deprecation notice. Keep the "Build your own caching server" subsection and the OpenAPI reference. |
| `astro-docs/src/content/docs/concepts/CI Concepts/cache-security.mdoc` | Strip 4-package mentions. If the page discusses self-hosted cache security generally, replace package-specific guidance with a link to the deprecation notice. |
| `astro-docs/src/content/docs/reference/Remote Cache Plugins/s3-cache/overview.mdoc` | Replace page content with a short deprecation banner plus link to the new notice. Keep the page so existing links do not 404. Hide from sidebar via `sidebar: { hidden: true }` or similar. |
| `astro-docs/src/content/docs/reference/Remote Cache Plugins/gcs-cache/overview.mdoc` | Same as above. |
| `astro-docs/src/content/docs/reference/Remote Cache Plugins/azure-cache/overview.mdoc` | Same as above. |
| `astro-docs/src/content/docs/reference/Remote Cache Plugins/shared-fs-cache/overview.mdoc` | Same as above. |
| `astro-docs/src/content/docs/reference/Remote Cache Plugins/shared-fs-cache/Generators.mdoc` | Replace content with a banner plus link, OR delete and add a redirect. See Open Questions. |
| `astro-docs/sidebar.mts` | Remove "Remote Cache Plugins" entries from the sidebar so users cannot navigate to the now-stubbed overview pages. Existing URLs continue to resolve for backwards compatibility with external links. |

### Replacement banner for the reference pages

```markdown
---
title: '<Original title> (Deprecated)'
description: '<Original package> is deprecated. See the deprecation notice.'
template: splash
sidebar:
  hidden: true
---

# <Original title> (Deprecated)

This package is deprecated due to [CVE-2025-36852](https://www.cve.org/CVERecord?id=CVE-2025-36852).
See the [deprecation notice](/docs/deprecations/self-hosted-cache-packages) for details and migration paths.
```

### Verification

After edits, re-run the grep to confirm no remaining references outside the new page:

```bash
grep -rln -e '@nx/s3-cache' -e '@nx/gcs-cache' -e '@nx/azure-cache' -e '@nx/shared-fs-cache' astro-docs/src/content/
```

Expected output: only `astro-docs/src/content/docs/deprecations/self-hosted-cache-packages.mdoc`.

---

## Decisions log

| Decision | Choice |
| --- | --- |
| Affected packages | All 4: s3-cache, gcs-cache, azure-cache, shared-fs-cache |
| Package fate | Deprecated on npm, not unpublished |
| README-docs relationship | README is a pointer, full content lives on docs page |
| README structure | Banner at top, existing content preserved below |
| README per-package | Shared block plus one package-specific line |
| Docs page location | Net-new, splash layout, no sidebar |
| Existing docs treatment | Strip 4-package mentions only, keep "build your own" content |
| CTA balance | Nx Cloud primary, OpenAPI gated by sharp `caution` aside |
| FAQ | 4 questions, short answers (leads with "were these compromised? no") |
| Effective date | 2026-05-21 |
| Removal from npm | Not committed |
| Mitigation steps on page | Omitted, defer to existing CREEP blog post |
| Page title (sentence case per style guide) | "Deprecation notice: self-hosted remote cache packages" |
| Slug | `/docs/deprecations/self-hosted-cache-packages` |
| OpenAPI link target | Existing `self-hosted-caching#build-your-own-caching-server` anchor |
| Lede style | Packages-first, then CVE, then "cannot be patched" |

## Open questions (for author confirmation before publish)

1. `shared-fs-cache/Generators.mdoc`: delete entirely or stub like the overview page? Generators page only makes sense if the package is actively supported.
2. `cache-security.mdoc` scope: does this page describe self-hosted cache security in general, or is it package-specific? If general, may need a small rewrite vs simple strip. Author should review the file before editing.
3. Sidebar removal: confirm "Remote Cache Plugins" should be removed from `astro-docs/sidebar.mts` rather than left visible. Removing it is consistent with "no mentions outside the deprecation page".
4. `npm deprecate` timing: banner-republish first, then `npm deprecate`? Or simultaneous? `npm deprecate` warning is independent of README content, but a user who runs `npm install` and sees the warning will want the README to already reflect it.

## Test plan

1. Local docs build: `nx serve astro-docs`. Confirm new page renders, splash layout has no sidebar, all internal links resolve.
2. Vale: `cd astro-docs && vale src/content/docs/deprecations/self-hosted-cache-packages.mdoc`. Must report 0 errors.
3. validate-links: `pnpm nx run astro-docs:validate-links`. Must report no broken links touching the new page or the edited reference pages.
4. `nx-docs-style-check` skill: mandatory per `CLAUDE.md` after every content edit under `astro-docs/src/content/`.
5. Grep verification (see Deliverable 3): only the new page should reference any of the 4 packages after the scrub.
6. npm publish dry-run: for each of the 4 packages in the `ocean` repo, build, pack, inspect tarball `README.md` to confirm the banner ships. Do not actually publish until author approves.
7. `npm deprecate` rehearsal: confirm the message format in a scratch package first. Apply to real packages only after README republish.
8. Screenshot for handoff: per `CLAUDE.md`, take chrome-devtools or playwright screenshots of the new page and one of the updated reference pages, attach to the PR.

## Out of scope (file separately)

- Updating the Nx changelog / release notes for the affected version.
- A separate security advisory page if the CREEP blog post turns out to be insufficient for remediation guidance.
- Communications outside the docs (Twitter, Slack, customer email). Coordinate with DPE / DevRel.

## Validation log (this session)

| Check | Result |
| --- | --- |
| Style guide review | Passed after fixes: heading hierarchy h1->h2->h3, sentence-case headings, capitalize after colon (vale rule), contractions where natural, no em dashes / semicolons, relative `/docs/...` links for internal docs, absolute URLs for blog and marketing, second-person voice |
| Vale | 0 errors, 0 warnings, 0 suggestions |
| validate-links | Failed to run in this sandbox: `@nx/gradle` plugin could not acquire the gradle wrapper lock (`/Users/jack/.gradle/wrapper/...lck (Operation not permitted)`). Project graph failure, not a real link failure. Re-run outside the sandbox before publish: `pnpm nx run astro-docs:validate-links`. |
| Gemini cross-review | Skipped (interrupted by user). Re-run if desired. |
