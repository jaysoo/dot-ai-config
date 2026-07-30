# NXC-4739: Removing axios and brace-expansion from published `nx` package (research)

Date: 2026-07-29. Fix PR (version bumps only): https://github.com/nrwl/nx/pull/36507

Baseline: `nx` publishes 120 flattened deps (expand-deps flattens the lockfile closure at publish). Node floor is ^22.12 - global fetch available everywhere.

## axios -> native fetch wrapper

- Removes 27 packages (120 -> 93, -22.5%), all reachable ONLY via axios: form-data, follow-redirects, debug, proxy-from-env, https-proxy-agent + 22 more. Also lets us delete `form-data` and `hasown` pnpm overrides.
- ~10 call sites in 8 files: nx-cloud (update-manager verify + bundle stream download, url-shorten, is-workspace-claimed, connect-to-nx-cloud), ab-testing telemetry, nx release remote clients (github/gitlab/ungh).
- No interceptors/agents/cancel tokens used. Only: baseURL, params, timeout, responseType stream (1 site), and the axios error shape (`err.response.status`, "Request failed with status code 404" string match in update-manager.ts:79).
- Plan: internal `packages/nx/src/utils/http.ts` (~150 LOC) over global fetch; `Readable.fromWeb(res.body)` for the tarball stream; `AbortSignal.timeout()`; HttpError normalizing `.response.status/.data`. Prior art: `packages/nx/src/utils/provenance.ts:60` already uses fetch.
- Effort: Medium, 3-5 days.
- BLOCKERS/RISKS:
  1. Proxy env vars (HTTP_PROXY etc.): axios honors them, native fetch does NOT. Node 24 has EnvHttpProxyAgent / NODE_USE_ENV_PROXY, Node 22.12 does not -> either keep https-proxy-agent (4 pkgs instead of 27) or undici (+1 pkg) for 22.x.
  2. `nxCloudProxyConfig` is a public contract typed as AxiosRequestConfig (customProxyConfigPath in nx.json) - enterprise customers ship JS returning axios configs. Needs shim or deprecation cycle.
  3. `RemoteReleaseClient.makeRequest(url, opts: AxiosRequestConfig)` leaks axios types into published .d.ts via ChangelogRenderer - replace with local interface.
  4. UNVERIFIED: does the downloaded nx-cloud client bundle `require('axios')` from nx's node_modules (configureLightClientRequire)? Must confirm against ocean before removal. Highest-severity unknown.

## brace-expansion -> replace minimatch with picomatch

- Chain is exactly: nx -> minimatch@10.2.5 -> brace-expansion -> balanced-match. No other parent; glob is NOT in nx's tree. Cannot keep minimatch and drop brace-expansion.
- Net -2 packages (drop 3, add picomatch@4.0.4 which is zero-dep, already in catalog, already used by @nx/js, @nx/angular, @nx/vite, etc.).
- 15 files use minimatch, all hot paths: task-hasher, project-graph config utils, target-defaults, affected locators, find-matching-projects, graph, release tags, generators glob. API needed: minimatch(), Minimatch#match, makeRe, filter, {dot:true}. Brace patterns genuinely exercised via combineGlobPatterns `{a,b}`.
- No minimatch types in public API surface (unlike axios).
- Empirical diff picomatch vs minimatch: 13/13 common nx patterns identical. 3 divergences:
  - empty pattern: minimatch false, picomatch THROWS (combineGlobPatterns([]) returns '' -> needs guard)
  - `a/**` vs `a`: minimatch false, picomatch TRUE (trailing globstar matches zero segments) - audit inputs/createNodes patterns like `libs/**`
  - backslash escape vs literal - low risk (nx normalizes to /), verify on Windows
- Plan: single internal `glob-match.ts` wrapper all 15 sites go through + differential test harness over existing spec corpora before flipping. yarn.ts min-release-age approximates micromatch anyway - picomatch likely MORE correct there.
- Effort: Small-Medium, 2-3 days.

## Bottom line

Both: 120 -> 91 published deps (-24%); kills form-data, follow-redirects, debug, brace-expansion (each caused emergency bumps recently). Sequencing: minimatch->picomatch first (self-contained), gate axios on ocean bundle require() check + proxy story decision.
