# Orchestrator verification log

Claims from cluster agents that would change a decision, re-checked against Ahrefs directly
before being carried into synthesis. Source tool named on each.

## Confirmed

**`ci analytics` is not a CI term - Phase 0 was wrong.**
`serp-overview` (us): positions 1 (+5 sitelinks), 3, 5, 6 all belong to C.I. Analytics, a
process/lab-analyzer manufacturer (cianalytics.com, its LinkedIn, DirectIndustry, Petro
Online). A knowledge panel for the company sits at 4. No CI/CD result in the top 6.
**Phase 0 verdict `keep-pending-evidence` ("50 vol, KD 0 - strongest term in the cluster")
is overturned to `prune`.** I graded it on volume and difficulty without pulling the SERP;
the ci-observability agent pulled it and was right.

**`ci/cd pipeline` (slash form) is a separate, much larger keyword than the tracked one.**
`keywords-explorer-overview`: `ci/cd pipeline` = 9,000 US, KD 49, TP 20,000, parent `ci/cd`.
The tracked `ci cd pipeline` = 4,800 US, KD 0. Different difficulty, different parent, both
unranked by nx.dev. Track both.

**Other cluster-agent numbers spot-checked and correct** (`keywords-explorer-overview`, us):
`github merge queue` 1,000 / KD 4; `github actions pricing` 1,200 / KD 45; `pnpm vs npm`
1,500 / KD 3; `nx monorepo` 600 / KD 29 / **TP 16,000**; `micro frontend architecture` 500 /
KD 19; `angular cli` 1,900 / KD 69; `test impact analysis` 150 / KD 3; `predictive test
selection` 100 / KD 3; `ci cd monitoring` 200 / KD 6; `continuous integration metrics` 150 /
KD 2; `npm workspaces` 500 / KD 5; `what is turborepo` 150 / KD 2 / TP 4,600.

## Corrected

**`what is a cache miss` is 700 US volume, not 62,000.**
The ci-performance agent reported 62,000 and called it "the cheapest large lift in the whole
cluster". `keywords-explorer-overview` gives **700 US / 77,000 global / KD 3 / TP 300**. The
agent appears to have read a global or parent figure. Still a good term - 700 at KD 3 with
nx.dev already at pos 43 on `/docs/troubleshooting/troubleshoot-cache-misses` is a real,
cheap win - but it is a mid-size term, not a headline one. Do not put the 62,000 figure in
any deliverable.

**`github actions slow` traffic potential of 65,000 is an artifact.**
Real figures: 60 US volume, KD 1, TP 65,000, **parent topic `github status`**. The traffic
potential is inherited from the GitHub status page that ranks for the query, not from
anything Nx could win. Track the term on its 60 volume and KD 1 merits; ignore the TP.

**`lerna.js.org ranks pos 1 for `nx cloud`` is wrong.**
The cli-competitors agent reported that Nx's own brand term is held by lerna.js.org.
`serp-overview` on `nx cloud` (us) shows the lerna.js.org URL appearing only as an
**AI-overview sitelink**, not an organic result. Actual organic order: 2 nx.dev/nx-cloud,
3 nxvms.com, 4 nx.dev/docs/features/ci-features, 6 networkoptix.com, 7 nx.dev/pricing,
8 cloud.nx.app, 9 github.com/apps/nx-cloud, 10 npmjs.com/package/nx-cloud.

Two real findings survive that correction, and they are different from the reported one:
1. **Position 1 organic on `nx cloud` is an AI Overview**, in which nx.dev holds most of the
   sitelinks - including `20.nx.dev/nx-cloud`, another versioned-subdomain leak.
2. **`nx cloud` is a contested brand term.** Network Optix sells a VMS product also called
   "Nx Cloud" and holds organic 3 and 6. nx.dev's best organic is 2, not 1.

The same caution applies to the branded agent's "nx.dev pos 1" on `nx cloud` - that is the
AI-overview sitelink. Organic is 2. Both agents were reading `best_position`, which folds
SERP features in.

## Standing caution for synthesis

`best_position` from `site-explorer-organic-keywords` includes AI-overview sitelinks and
other SERP features. Any position claim that drives a recommendation needs a `serp-overview`
check before it ships. This is the same class of error as the Rank Tracker desktop/mobile
discrepancy recorded in the task plan.
