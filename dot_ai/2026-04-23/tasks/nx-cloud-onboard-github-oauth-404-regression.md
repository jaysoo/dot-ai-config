# nx-cloud onboard: GitHub OAuth token exchange 404 regression

**Date:** 2026-04-23
**Status:** Reproducing / needs Linear issue filed
**Severity:** High — breaks `npx nx-cloud onboard` "existing workspace" flow on public GitHub (cloud.nx.app)
**Suggested Linear team:** Nx Cloud (CLOUD-)

## Symptom

`npx nx-cloud onboard` against `https://cloud.nx.app` fails at "Loading repositories..." step with:

```
NX   Upstream error

Failed to authenticate with GitHub: Client request(POST https://api.github.com/login/oauth/access_token) invalid: 404 Not Found. Text: "{
  "message": "Not Found",
  "documentation_url": "https://docs.github.com/rest",
  "status": "404"
}"

GitHub returned an error. This is usually transient — please retry.
  Retry after 10 seconds.
```

Reproduced by: `NX_CLOUD_API=https://cloud.nx.app npx nx-cloud onboard` → select org → "GitHub already connected" → "existing" workspace → fails.

## Root cause

The OAuth access-token endpoint lives at `github.com/login/oauth/access_token`. The REST API lives at `api.github.com`. They are **different hosts**. Sending the OAuth token exchange to `api.github.com/login/oauth/access_token` returns 404 (that path doesn't exist on api.github.com).

The backend is now posting to the wrong host because of a broken URL-derivation helper introduced in PR #10837.

## Regression commit

**Commit:** `972a17a1d6625bf58ceb1159783d288b1fa91081`
**PR:** #10837 — `feat(polygraph): add session resume command and improve local dev`
**Author:** James Henry <james@henry.sc>
**Date:** 2026-04-21

### Before the commit
`apps/nx-api/src/main/kotlin/services/onboarding/GitHubOnboardingClient.kt` hardcoded the correct URLs:

```kotlin
url("https://github.com/login/oauth/access_token")   // OAuth token exchange
url("https://api.github.com/user")                   // REST API
url("https://api.github.com/user/repos")             // REST API
```

### After the commit
Both are derived from a single `githubApiUrl` field via helpers in `apps/nx-api/src/main/kotlin/integrations/github/GithubClient.kt`:

```kotlin
private val githubApiUrl = normalizeGithubApiUrlOverride(githubApiUrlOverride)
private val githubBaseUrl = getGithubBaseUrlFromApiUrl(githubApiUrl)

// refreshToken() — the call that 404s
url("$githubBaseUrl/login/oauth/access_token")
```

## Why the helpers break public GitHub

From `GithubClient.kt:56-74`:

```kotlin
fun normalizeGithubApiUrlOverride(githubApiUrlOverride: String?): String {
    val resolvedOverride = resolveGithubBaseUrlOverride(githubApiUrlOverride)
    if (resolvedOverride == null) {
        return PUBLIC_GITHUB_API_URL   // "https://api.github.com"
    }
    val normalized = resolvedOverride.trimEnd('/')
    return if (normalized.endsWith("/api/v3")) normalized
           else "$normalized/api/v3"
}

fun getGithubBaseUrlFromApiUrl(githubApiUrl: String): String {
    return githubApiUrl.trimEnd('/').removeSuffix("/api/v3")
}
```

Tracing for public GitHub (no override → `githubApiUrlOverride = null`):

1. `normalizeGithubApiUrlOverride(null)` → `"https://api.github.com"` ✅
2. `getGithubBaseUrlFromApiUrl("https://api.github.com")` → `"https://api.github.com"` ❌
   - It only strips a `/api/v3` suffix. It has no case for the public-GitHub host split where `api.github.com` (REST) and `github.com` (OAuth) are **different subdomains**, not path-based.
3. OAuth POST goes to `https://api.github.com/login/oauth/access_token` → 404.

The incorrect behavior is even encoded in the new test at `apps/nx-api/src/test/kotlin/integrations/github/GithubClientUrlHelpersTests.kt:44-45`:

```kotlin
assertEquals(
    "https://api.github.com",
    getGithubBaseUrlFromApiUrl(PUBLIC_GITHUB_API_URL),
)
```

i.e., the test asserts the buggy output. On GHE (`github.example.com/api/v3` → `github.example.com`) the helper works, because GHE *is* path-based. The public-GitHub case was overlooked.

## Which call path is hit

`nx-cloud onboard` "existing workspace" → server `listRepositories()` → `GitHubOnboardingClient.getAccessToken()` → if the stored token starts with `ghr_` (OAuth refresh token), calls `refreshToken()` → POST `$githubBaseUrl/login/oauth/access_token` → 404.

Users whose stored token is a device-flow token (`ghu_*`) skip the refresh path and are unaffected for this step (but `fetchRepositories` still uses `$githubApiUrl/user/repos` which is correct on public GitHub — that part works).

So: **users with OAuth refresh tokens in the DB hit this. Anyone who authenticated via GitHub OAuth (not device flow) will fail onboard.**

## Fix options

### Option A (minimal, localized): fix the helper

In `GithubClient.kt:72`:

```kotlin
fun getGithubBaseUrlFromApiUrl(githubApiUrl: String): String {
    val trimmed = githubApiUrl.trimEnd('/')
    // Public GitHub: api.github.com (REST) and github.com (OAuth) are on different hosts.
    if (trimmed == "https://api.github.com") return "https://github.com"
    // GHE: /api/v3 suffix, OAuth lives at the base.
    return trimmed.removeSuffix("/api/v3")
}
```

Update the test at `GithubClientUrlHelpersTests.kt:44-45` to assert `"https://github.com"`.

### Option B: revert the hardcoded URLs in `GitHubOnboardingClient.kt`

Revert the `refreshToken()` line to `url("https://github.com/login/oauth/access_token")` and leave GHE support for later. Keep the `$githubApiUrl/...` for REST calls (those are correct).

Option A is preferred — fixes the helper for anyone else reusing it, and keeps the GHE path intact.

## Verification plan

1. Apply fix locally
2. Run `apps/nx-api` locally with `GITHUB_API_URL` unset → hit onboard flow → verify OAuth exchange POSTs to `https://github.com/login/oauth/access_token`
3. Run existing `GithubClientUrlHelpersTests` — update the asserted value
4. Add regression test: `getGithubBaseUrlFromApiUrl("https://api.github.com")` → `"https://github.com"`
5. Add end-to-end integration test for onboard `listRepositories` with a `ghr_*` refresh token

## Linear issue draft

**Title:** `nx-cloud onboard fails with 404 on GitHub OAuth token exchange (regression from #10837)`

**Body:**

> `npx nx-cloud onboard` against cloud.nx.app fails at "Loading repositories..." when the user's stored GitHub token is an OAuth refresh token (`ghr_*`). The backend posts the token-refresh request to `https://api.github.com/login/oauth/access_token` — wrong host, 404.
>
> Regressed in #10837 (commit 972a17a1d6, 2026-04-21). Previously the URL was hardcoded to `https://github.com/login/oauth/access_token`; it is now derived via `getGithubBaseUrlFromApiUrl()` in `GithubClient.kt`, which only handles GHE-style `/api/v3` suffixes and leaves public-GitHub's `api.github.com` host unchanged. The existing unit test asserts the buggy output.
>
> See `.ai/2026-04-23/tasks/nx-cloud-onboard-github-oauth-404-regression.md` for full analysis and fix options.
>
> **Affected:** all cloud.nx.app users whose GitHub VCS account was linked via OAuth (stores `ghr_*` refresh tokens). Device-flow users (`ghu_*`) unaffected on the refresh step.
>
> **Suggested fix:** patch `getGithubBaseUrlFromApiUrl` to map `https://api.github.com` → `https://github.com`; update the unit test assertion.

## References

- Regression commit: `972a17a1d6625bf58ceb1159783d288b1fa91081` (PR #10837)
- Broken helper: `apps/nx-api/src/main/kotlin/integrations/github/GithubClient.kt:72-74`
- Call site that 404s: `apps/nx-api/src/main/kotlin/services/onboarding/GitHubOnboardingClient.kt:124` (`refreshToken`)
- Misleading test: `apps/nx-api/src/test/kotlin/integrations/github/GithubClientUrlHelpersTests.kt:38-47`
- GitHub OAuth docs: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps — endpoints explicitly on `github.com`, not `api.github.com`
