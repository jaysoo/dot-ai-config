# Nx Open-Source Repos

**Priority: LOW** | Cadence: Re-run on demand (quarterly-ish, or before OSS outreach)

Census of popular public GitHub repos that use Nx, with Nx Cloud connection status. Answers "which well-known OSS projects build with Nx, and how many are on Nx Cloud?" - useful for OSS adoption tracking, Cloud conversion outreach, and case-study candidates.

## What's tracked

Every **public** repo with an `nx.json` at its **root** and **> 500 stars**, classified by Nx Cloud connection:

| `cloudStatus` | Meaning |
|---------------|---------|
| `nxCloudId` | Modern connection - `nxCloudId` set |
| `legacy-accessToken` | Older token-based connection |
| `opted-out` | `neverConnectToCloud: true` |
| `not-connected` | Valid `nx.json`, no Cloud markers |
| `unparseable` | `nx.json` couldn't be parsed |

`connectedToCloud` = true for `nxCloudId` + `legacy-accessToken`.

## How it's collected

Script: `scripts/nx-oss-repos.mjs` (repo root), documented in `scripts/nx-oss-repos.md`.

Pipeline: GitHub code search (`filename:nx.json`, adaptively bisected by file size so no query exceeds the 1,000-result cap) -> GraphQL enrichment (stars + root `nx.json` blob) -> filter > 500 stars + classify Cloud connection.

Re-run:

```bash
export GH_TOKEN=ghp_xxx
scripts/nx-oss-repos.mjs --out ./out   # writes nx-oss-repos.{json,csv,md}
```

## Reports

| Date | File | Headline |
|------|------|----------|
| 2026-06-27 | `2026-06-27-star-tiers.md` | 235 repos > 500 stars; 63 (27%) on Nx Cloud, 59 (25%) also use Lerna. Full-coverage run (34,898 candidates scanned). |

## Data snapshots

Raw outputs land in `data/nx-oss-repos-<date>.{json,csv}` - one dated snapshot per run, so trends are diffable over time.

## Caveats

- **Public + default branch only.** Private repos and non-default branches are invisible to code search - by design, this is the OSS population.
- **> 384 KB files** aren't indexed by code search (irrelevant for `nx.json`).
- Stars and Cloud status drift; treat each snapshot as a point-in-time census.
