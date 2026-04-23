# nx-cloud onboard: GitHub OAuth token exchange 404 regression

**Date:** 2026-04-23
**Status:** Reproducing, need Linear issue
**Severity:** High — break `npx nx-cloud onboard` "existing workspace" flow on cloud.nx.app
**Linear team:** Nx Cloud (CLOUD-)

## Symptom

`npx nx-cloud onboard` against `https://cloud.nx.app` die at "Loading repositories...":

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

Repro: `NX_CLOUD_API=https://cloud.nx.app npx nx-cloud onboard` → pick org → "GitHub already connected" → "existing" workspace → boom.

## Root cause

OAuth token endpoint live at `github.com/login/oauth/access_token`. REST API live at `api.github.com`. **Different hosts.** POST token exchange to `api.github.com/login/oauth/access_token` → 404. Path not exist on api host.

Backend now POST to wrong host. Broken URL helper from PR #10837.

## Regression commit

**Commit:** `972a17a1d6625bf58ceb1159783d288b1fa91081`
**PR:** #10837 — `feat(polygraph): add session resume command and improve local dev`
**Author:** James Henry <james@henry.sc>
**Date:** 2026-04-21

### Before

`apps/nx-api/src/main/kotlin/services/onboarding/GitHubOnboardingClient.kt` hardcode right URLs:

```kotlin
url("https://github.com/login/oauth/access_token")   // OAuth token exchange
url("https://api.github.com/user")                   // REST API
url("https://api.github.com/user/repos")             // REST API
```

### After

Both derive from single `githubApiUrl` via helpers in `apps/nx-api/src/main/kotlin/integrations/github/GithubClient.kt`:

```kotlin
private val githubApiUrl = normalizeGithubApiUrlOverride(githubApiUrlOverride)
private val githubBaseUrl = getGithubBaseUrlFromApiUrl(githubApiUrl)

// refreshToken() — call that 404s
url("$githubBaseUrl/login/oauth/access_token")
```

## Why helpers break public GitHub

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

Trace for public GitHub (no override → `githubApiUrlOverride = null`):

1. `normalizeGithubApiUrlOverride(null)` → `"https://api.github.com"` ✅
2. `getGithubBaseUrlFromApiUrl("https://api.github.com")` → `"https://api.github.com"` ❌
   - Only strip `/api/v3` suffix. No case for public-GitHub split where `api.github.com` (REST) and `github.com` (OAuth) live on **different subdomains**, not paths.
3. OAuth POST → `https://api.github.com/login/oauth/access_token` → 404.

Bad behavior baked into new test `apps/nx-api/src/test/kotlin/integrations/github/GithubClientUrlHelpersTests.kt:44-45`:

```kotlin
assertEquals(
    "https://api.github.com",
    getGithubBaseUrlFromApiUrl(PUBLIC_GITHUB_API_URL),
)
```

Test assert buggy output. On GHE (`github.example.com/api/v3` → `github.example.com`) helper work — GHE _is_ path-based. Public GitHub case missed.

## Call path hit

`nx-cloud onboard` "existing workspace" → server `listRepositories()` → `GitHubOnboardingClient.getAccessToken()` → if stored token start `ghr_` (OAuth refresh) → `refreshToken()` → POST `$githubBaseUrl/login/oauth/access_token` → 404.

Device-flow tokens (`ghu_*`) skip refresh path, safe here. `fetchRepositories` still use `$githubApiUrl/user/repos` which correct on public GitHub — that part work.

**Users with OAuth refresh tokens in DB hit bug. Anyone auth via GitHub OAuth (not device flow) fail onboard.**

## Fix options

### Option A (minimal): fix helper

`GithubClient.kt:72`:

```kotlin
fun getGithubBaseUrlFromApiUrl(githubApiUrl: String): String {
    val trimmed = githubApiUrl.trimEnd('/')
    // Public GitHub: api.github.com (REST) and github.com (OAuth) are on different hosts.
    if (trimmed == "https://api.github.com") return "https://github.com"
    // GHE: /api/v3 suffix, OAuth lives at the base.
    return trimmed.removeSuffix("/api/v3")
}
```

Update `GithubClientUrlHelpersTests.kt:44-45` → assert `"https://github.com"`.

### Option B: revert hardcoded URLs in `GitHubOnboardingClient.kt`

Revert `refreshToken()` line to `url("https://github.com/login/oauth/access_token")`. Leave GHE for later. Keep `$githubApiUrl/...` for REST (correct).

Option A preferred — fix helper for any other caller, keep GHE path alive.

## Verification plan

1. Apply fix locally
2. Run `apps/nx-api` local with `GITHUB_API_URL` unset → hit onboard → verify OAuth POST to `https://github.com/login/oauth/access_token`
3. Run existing `GithubClientUrlHelpersTests` — update asserted value
4. Add regression test: `getGithubBaseUrlFromApiUrl("https://api.github.com")` → `"https://github.com"`
5. Add e2e test for onboard `listRepositories` with `ghr_*` refresh token

## Linear issue draft

**Title:** `nx-cloud onboard fails with 404 on GitHub OAuth token exchange (regression from #10837)`

**Body:**

> `npx nx-cloud onboard` against cloud.nx.app fail at "Loading repositories..." when user's stored GitHub token is OAuth refresh (`ghr_*`). Backend POST token-refresh to `https://api.github.com/login/oauth/access_token` — wrong host, 404.
>
> Regress in #10837 (commit 972a17a1d6, 2026-04-21). URL previously hardcoded to `https://github.com/login/oauth/access_token`; now derived via `getGithubBaseUrlFromApiUrl()` in `GithubClient.kt`. Helper only handle GHE-style `/api/v3` suffix, leave public-GitHub `api.github.com` host untouched. Unit test assert buggy output.
>
> See `.ai/2026-04-23/tasks/nx-cloud-onboard-github-oauth-404-regression.md` for full analysis + fix options.
>
> **Affected:** all cloud.nx.app users with GitHub VCS linked via OAuth (stores `ghr_*`). Device-flow (`ghu_*`) unaffected on refresh step.
>
> **Fix:** patch `getGithubBaseUrlFromApiUrl` → map `https://api.github.com` → `https://github.com`. Update unit test.

## References

- Regression commit: `972a17a1d6625bf58ceb1159783d288b1fa91081` (PR #10837)
- Broken helper: `apps/nx-api/src/main/kotlin/integrations/github/GithubClient.kt:72-74`
- 404 call site: `apps/nx-api/src/main/kotlin/services/onboarding/GitHubOnboardingClient.kt:124` (`refreshToken`)
- Bad test: `apps/nx-api/src/test/kotlin/integrations/github/GithubClientUrlHelpersTests.kt:38-47`
- GitHub OAuth docs: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps — endpoints on `github.com`, not `api.github.com`
