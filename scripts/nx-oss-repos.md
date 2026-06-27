# Collecting popular open-source Nx repos

Goal: find every **public** GitHub repo that has an `nx.json` at its **root** and
more than **500 stars**, and report whether each is **connected to Nx Cloud**
(`nxCloudId` set in `nx.json`).

`nx-oss-repos.mjs` implements this. This doc explains *why* it works the way it
does and what the alternatives are.

## The core problem

There is no single GitHub query for "repos with file X **and** stars > N":

- **Repository search** (`/search/repositories`) supports `stars:>500` and
  sorting, but **cannot** filter by "contains a file."
- **Code search** (`/search/code`) can find files (`filename:nx.json`) but
  **cannot** sort or filter by stars, only sees the **default branch**, skips
  files > 384 KB, needs auth, is rate-limited to ~10 req/min, and returns at
  most **1,000 results per query**.

So we invert the funnel: the set of repos containing `nx.json` is small
(thousands), while the set of >500★ repos is huge (tens of thousands). Start
from the *file*, then enrich with stars.

## The pipeline

```
code search (filename:nx.json, partitioned by size)
        │  candidate repos (owner/name)
        ▼
GraphQL batch (stargazerCount + HEAD:nx.json blob, ~50 repos/req)
        │  stars + root nx.json text
        ▼
filter stars > 500  +  parse nx.json  →  classify Nx Cloud connection
        │
        ▼
nx-oss-repos.{json,csv,md}
```

### Stage 1 — Discover (REST code search)

`filename:nx.json` is a pure filename search (the one case where code search
doesn't require a content term). To beat the **1,000-result cap** we partition
by file size with the `size:` qualifier (`0..511`, `512..1023`, … `>8191`).
Each bucket is independently capped at 1,000; their union covers the whole
population. The script warns if any bucket *hits* 1,000 (meaning that bucket
needs to be split further for complete coverage).

`nx.json` matched in a subdirectory is also returned here — that's fine, it's
filtered out in Stage 2.

### Stage 2 — Enrich (GraphQL)

One GraphQL request fetches, for ~50 repos at a time (via field aliasing):
`stargazerCount`, `url`, `primaryLanguage`, `isArchived`/`isFork`, `pushedAt`,
and `object(expression: "HEAD:nx.json")` — the **root** `nx.json` on the default
branch. Because we ask for `HEAD:nx.json` specifically, a repo whose only
`nx.json` lives in a subfolder resolves to `null` and is dropped — this is the
"is it really at the root?" check, for free. Batching keeps the whole enrichment
within a tiny slice of the 5,000-point/hr GraphQL budget.

### Stage 3 — Filter & classify

Keep `stars > min`, parse the `nx.json` text, and classify the Cloud connection:

| `cloudStatus`         | Meaning                                                        |
|-----------------------|----------------------------------------------------------------|
| `nxCloudId`           | Modern connection — `nxCloudId` is set ✅                        |
| `legacy-accessToken`  | Older connection — `nxCloudAccessToken` / runner `accessToken` |
| `opted-out`           | `neverConnectToCloud: true`                                    |
| `not-connected`       | Valid `nx.json`, no Cloud markers                              |
| `unparseable`         | `nx.json` couldn't be parsed                                   |

`connectedToCloud` is `true` for `nxCloudId` and `legacy-accessToken`.

## Usage

```bash
export GH_TOKEN=ghp_xxx          # PAT with public_repo / read access
./nx-oss-repos.mjs               # -> nx-oss-repos.{json,csv,md}
./nx-oss-repos.mjs --min-stars 1000 --out ./report
./nx-oss-repos.mjs --json        # also print full JSON to stdout
```

Node 18+ (global `fetch`), no dependencies. A full run takes a few minutes,
gated by the code-search rate limit. Re-running is cheap to re-do; there's no
local cache.

## Caveats

- **Public + default branch only.** Private repos and non-default branches are
  invisible to code search — but that's exactly the open-source population the
  question targets.
- **Files > 384 KB** aren't indexed by code search (irrelevant for `nx.json`).
- A token still only sees *public* code globally; no special scope is needed
  beyond basic read.

## Alternative: BigQuery (bulk, no rate limits)

For a one-shot bulk pull without API rate limits, use the public datasets:

- `bigquery-public-data.github_repos.files` — filter `path = 'nx.json'` (root =
  no `/` in path) to get `repo_name`s.
- Join with a stars proxy: count `WatchEvent`s per repo from
  `githubarchive.month.*` (the GitHub repos dataset has no star column), or
  enrich the resulting (smaller) repo list with the GraphQL step above for exact
  `stargazerCount` + `nxCloudId`.

Trade-off: the `github_repos` snapshot is **stale** (skewed toward
permissively-licensed repos, not refreshed continuously), so it's good for a
rough census but the code-search pipeline above is the source of truth for
*current* popular repos. A solid hybrid is **BigQuery to get the candidate repo
list cheaply → GraphQL to get exact stars + nx.json**.

## Why not just the web code-search UI?

The web UI uses newer search syntax and shows nice results, but there's no
stable public REST endpoint for arbitrary new-syntax queries, you still hit the
1,000-result cap, and you can't sort by stars or read file contents in bulk —
so it doesn't scale to "produce a complete classified dataset."
