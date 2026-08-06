# GitHub App organization permissions: docs accuracy + stale CLI hint

Date: 2026-08-05 (follow-up wording 2026-08-06)
Repos: nrwl/nx (docs), nrwl/ocean (CLI message)

## Goal

Review branch `docs/explain-github-app-org-permissions` against `astro-docs/STYLE_GUIDE.md`, and fix two findings Jack raised:

1. Stale CLI remediation message telling users to grant a permission the app no longer requests.
2. Inaccurate attribution of org repo listing to the `Administration` permission.

## Ground truth (verified in nrwl/ocean)

| Endpoint | File | Permission it actually needs |
|---|---|---|
| `GET /orgs/{org}/installations` | `libs/ocean/util-vcs/src/lib/github/fetch-organization-installation.server.ts` | org `Administration: read` |
| `GET /orgs/{org}/repos` | `fetch-organization-repositories.server.ts` | `Metadata: read` |
| `GET /user/installations/{id}/repositories` | `fetch-installation-repositories.server.ts` | `Metadata: read` |
| `GET /user/memberships/orgs/{org}` | `fetch-organization-membership.server.ts` | org `Members: read` |

Callers: `fetchGitHubOrganizationInstallation` -> `create-nx-cloud-organization-from-vcs-organization.server.ts` (setup) and `refresh-vcs-organization-members.server.ts` (member sync). `fetchGitHubOrganizationMembership` -> `organization-dashboard-loader.server.ts`, only for a user whose GitHub membership isn't recorded yet.

Jack confirmed against the live GitHub App settings page: org permissions are `Read access to actions, members, metadata, and organization administration`. Org read yes, org write no. The Aug 2026 permission-update prompt shows `Administration (read & write)` as "no longer required".

## Findings and fixes

**1. Stale CLI hint (nrwl/ocean).** `libs/nx-packages/client-bundle/src/lib/core/commands/onboarding/onboarding-remediation.ts:77` told users to grant `"Contents: Read & Write"` **and** `"Administration: Read & Write"`. The app dropped Administration, so users go to app settings, can't find it, and file a ticket. Fires on any 403 whose message contains "permission", plus the 502 create-repository branch. Now names `Contents: Read & Write` only.

No spec covers the module (grep for `lookupRemediation` / `renderRemediationBodyLines` in `*.spec.ts` returns nothing), so nothing to update. Version plan added: the remediation system shipped 2026-04-01 (#10587), so this is a fix against released prod code, and neither unreleased plan (`navigating-boron`, `guarding-argon`) covers onboarding.

**2. Wrong permission attributed (nrwl/nx docs).** The `Administration` entry claimed it was used for "listing every repository in the organization so you can pick which ones to connect during setup". Repo listing is `Metadata`. Moved that clause into the `Metadata` entry so the information survives; `Administration` now covers only locating the app installation.

## STYLE_GUIDE pass

vale was clean (0/0/0) on the original branch. The structural rules caught four things vale can't see:

- **Semicolon** (`Punctuation`): `...repository is added; see [Permission details] below...`. Split, and dropped the same-page pointer link entirely - the section it pointed at was the next one down.
- **One canonical home per point**: the "no need to re-grant when a repo is added" claim appeared in both the intro and the `Administration` entry. Kept the intro copy.
- **Balanced-contrast + restatement closer**: `Members` ended `...matching the same admin and member distinction GitHub already enforces instead of maintaining a separate permission system` - two clauses for one idea. Reduced to one.
- **Terminology**: `across the org` vs "organization" everywhere else.

Also rewrote each `When it's used:` line to carry a fact the `Used for:` line doesn't, instead of restating it.

## Intro wording: three rounds

Jack rejected two drafts before the final. Worth recording because the objections generalize.

- v1 (merged): `Two are scoped to the organization because the work they support isn't tied to a single repository: checking a user's role in GitHub, and finding the app's installation for the organization.` -> "too AI-sounding". The tell is the `claim because abstraction: list, list` shape - the reason clause explains nothing on its own and the colon dumps the real content as an afterthought.
- v2: `Two are scoped to the organization. In GitHub, your role and the app's installation belong to the organization, not to any single repository.` -> "next sentence basically repeating the same info, merge those".
- v3: `Two are scoped to the organization because that's where GitHub keeps your role and the app's installation.` -> "avoid 'Two are scoped' to begin sentence... more like, GitHub scopes your role and app's installation to the organization".
- Final: `GitHub scopes your role and the app's installation to the organization, so the two permissions that read them are organization permissions.` Dropped Jack's trailing "to the organization scope" (scopes -> scope doubles back). Ending on "organization permissions" hands off to the `Organization permissions:` list below.

## Outcome

- **nrwl/nx PR #36581 MERGED** as `378526cd7f` while the session was still iterating. It carries the accuracy fixes, the `Metadata` move, and the style pass - but the **v1 intro wording**, since Jack pushed and merged before the last two rounds.
- Remaining delta vs master is 2 lines. Committed on a fresh branch off `origin/master`: `docs/github-app-permissions-intro-wording`, `61c35a9305`. Not pushed, no PR.
- **nrwl/ocean**: branch `fix/onboarding-permission-hint`, `b4faebb334` (CLI message + version plan). Not pushed, no PR. Ocean PRs target `main`.

## Loose thread

The 502 `insufficient permissions.*create repository` branch in `onboarding-remediation.ts` may now be dead - creating a repo in an org needs `Administration: write`, which the app no longer requests, and browser workspace generation (the feature that needed it) was removed. Left alone; worth a separate look.
