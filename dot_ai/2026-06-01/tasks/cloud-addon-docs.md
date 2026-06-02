# Nx Cloud Add-on Docs Consolidation (2026-06-01)

## Goal
Produce 6 consolidated "platform feature" docs pages in `nx/astro-docs`, one per feature. Three MUST be perfect (Resource usage, Sandboxing, Dedicated compute cluster); the other three need enough for readers to understand them (Docker layer caching, Docker read-through cache, NPM read-through cache).

Polygraph session: docs-sandbox-resource-usage-f431c8fc (repos: nrwl/nx, nrwl/ocean, nrwl/cloud-infrastructure)

## Target IA (ASSUMPTION)
All 6 live under `features/CI Features/` -> URLs `/docs/features/ci-features/<slug>`, alongside the existing `sandboxing.mdoc`. Grouped in sidebar under a new "Nx Cloud add-ons" subgroup inside "Platform features > Orchestration & CI".

| # | Feature | File | Status | Priority |
|---|---------|------|--------|----------|
| 1 | Resource usage | `features/CI Features/resource-usage.mdoc` | consolidate from `guides/nx-cloud/ci-resource-usage.mdoc` + redirect | MUST |
| 2 | Sandboxing | `features/CI Features/sandboxing.mdoc` (exists) | update to add-on model | MUST |
| 3 | Docker layer caching | `features/CI Features/docker-layer-caching.mdoc` | new | info |
| 4 | Docker read-through cache | `features/CI Features/docker-read-through-cache.mdoc` | new (GAP - see below) | info |
| 5 | NPM read-through cache | `features/CI Features/npm-read-through-cache.mdoc` | new | info |
| 6 | Dedicated compute cluster | `features/CI Features/dedicated-compute-cluster.mdoc` | new (umbrella) | MUST |

## Sources
- Steve's TODO markdowns (nx repo root): `TODO-docker-layer-caching.md` (#3), `TODO-npm-read-through-cache.md` (#5). Single-tenant framing.
- Infra research (cloud-infrastructure) - DONE. Key facts below.
- Ocean research - in progress.
- 15 product screenshots from Jack (resource usage UI, sandboxing UI, Settings>Add-ons, PR-comment CTAs, sample-data CTAs).

## Key infra facts (from cloud-infrastructure research)
- **Dedicated compute cluster = single-tenant only.** Provisions a separate `*-nx-agents` k8s cluster per customer. Enables privileged/dind agents (`enable_privileged_pods=true`), custom `enabled_images`.
- **Docker layer caching:** BuildKit registry (`registry:2`) per zone. Injected via `NX_DOCKER_CACHE_REGISTRY`. Per-zone caches (cross-zone miss). CronJob prunes non-`main` tags. Deployed to ALL agent clusters per infra, BUT Steve's doc says single-tenant-enterprise-only + requires an infra change request. -> ASSUMPTION: treat as dedicated-compute / single-tenant enterprise feature (matches Settings UI "Required for ... Docker caching"). Reconcile with infra before publish.
- **NPM read-through cache:** nginx proxy (NOT verdaccio), `http://cache.npm.svc.cluster.local:4873`, 3 pods, public-npm only, per-pod cache. Steve's doc = single-tenant framing.
- **Docker read-through cache (#4): NOT IMPLEMENTED in infra.** No registry mirror / pull-through cache. Agents pull base images from public registries directly. This is a GAP / forward-looking feature.

## Ocean research reconciliations (authoritative, code-level)
- Add-on enum `PlanAddOnFeature`: DEDICATED_COMPUTE_CLUSTER, RESOURCE_USAGE, SANDBOXING, DOCKER_LAYER_CACHING, DOCKER_READ_THROUGH_CACHE, NPM_READ_THROUGH_CACHE.
- Add-ons page `/orgs/:id/add-ons` shown only for TEAM/PRO plans (404 for ENTERPRISE + FREE). Enterprise/single-tenant get equivalents via their deployment/plan.
- Activation: self-serve immediate = RESOURCE_USAGE, SANDBOXING. Admin-approval ("Request add-on" -> Linear issue -> team provisions) = DEDICATED_COMPUTE_CLUSTER, DOCKER_LAYER_CACHING, DOCKER_READ_THROUGH_CACHE, NPM_READ_THROUGH_CACHE.
- Dependents of DEDICATED_COMPUTE_CLUSTER: SANDBOXING, DOCKER_LAYER_CACHING, DOCKER_READ_THROUGH_CACHE, NPM_READ_THROUGH_CACHE. Cancelling cluster cascade-cancels all 4. Cluster completion sets allowPrivilegedAgentCapabilities=true (dind).
- **#4 Docker read-through cache IS a real add-on** (controller `registry_mirror_enabled` TenantFeature + daemon.json registry-mirror mount). Infra base manifests lacked the mirror deployment -> treat as EARLY / provisioned per-tenant. Document as real but verify GA status.
- Resource usage: standalone add-on, NOT gated by cluster. Nx>=22.1. Auto for Nx Agents; manual DTE via `nx-cloud upload-agent-metrics`. Opt-out `NX_CLOUD_DISABLE_METRICS_COLLECTION`. In-product term "resource profiling" / "Enable resource profiling". Add-on id RESOURCE_USAGE.
- Sandboxing detection = eBPF io-trace Go sidecar. Requires DEDICATED_COMPUTE_CLUSTER. Pending badge "Activates when cluster is ready".
- **Pricing differs between staging screenshot and code.** Screenshot: resource usage 7,500 incl / 12 per agent. Code: 10,000 incl / 10 per agent. -> DO NOT hardcode allowances/overage in prose. Describe model + "see Settings > Add-ons for current pricing." Headline monthly base ($50 sandboxing/resource, $99 cluster) included as "starting at / current pricing in Settings". Per-credit rates (100/25/1 per agent or report) kept to Settings.

## ASSUMPTIONS (review these)
1. **IA:** 6 pages under `features/ci-features/`, new "Nx Cloud add-ons" sidebar subgroup. Old `guides/nx-cloud/ci-resource-usage` -> redirect to new resource-usage page.
2. **Add-on model:** Settings>Add-ons shows: Resource usage ($50/mo + usage, 7,500 credits incl then 12 credits/agent, "Enable add-on"); Dedicated compute cluster ($99/mo, "Request add-on") which gates Sandboxing ($50/mo + usage), Docker caching, read-through caches. Docs reference the add-on + credit model but defer exact $ to Settings/pricing page (prices volatile). Headline prices included with "see Settings for current pricing" hedge.
3. **Resource usage** is a STANDALONE add-on (NOT gated by dedicated compute). Works with Nx Agents (auto) + manual DTE (`nx-cloud upload-agent-metrics`). "resource profiling" is the in-product term; "Enable resource profiling" toggle.
4. **Sandboxing requires dedicated compute cluster** (single-tenant). Existing page already says single-tenant; add explicit dedicated-compute-cluster cross-link + add-on framing.
5. **Docker read-through cache (#4)** documented as EARLY/PLANNED. Page clearly flagged "coming / not yet generally available" because infra has no implementation. Must verify with infra/product before publishing this one page. (Light page, per priority.)
6. **Docker layer caching availability:** documented as requiring dedicated compute cluster (single-tenant enterprise) per Steve + Settings UI, despite infra saying it's on all clusters. Flagged for reconciliation.
7. **Screenshots:** reuse existing repo assets for resource-usage + sandboxing. New pages (#3,4,5,6) ship without screenshots (text-only is fine for "info" pages). Jack's 15 new screenshots are not yet saved as repo assets - noted as follow-up if we want to refresh resource-usage/sandboxing imagery to the new add-on UI.
8. **Credit/pricing exact numbers** may be staging values; treat as indicative.

## Steps
1. [done] Add cloud-infrastructure to session
2. [done] Read Steve TODOs + infra research + existing nx docs + IA
3. [done] Write #3, #4, #5 (infra-driven)
4. [done] Ocean research -> write #1, #2, #6 (must-be-perfect)
5. [done] sidebar.mts (new "Nx Cloud add-ons" subgroup) + redirect (old ci-resource-usage -> resource-usage)
6. [done] nx-docs-style-check: vale 0 errors/0 warnings on the 6 pages; all 17 internal links resolve
7. [done] prettier. validate-links build chain failed on env issues (sandbox pnpm install + unrelated maven), not links.

## Outcome (first iteration)
- 6 pages live under features/CI Features/ -> /docs/features/ci-features/{resource-usage,sandboxing,dedicated-compute-cluster,docker-layer-caching,docker-read-through-cache,npm-read-through-cache}
- sandboxing.mdoc updated (add-on + dedicated-compute framing, violations dashboard, pricing, em dashes removed)
- ci-resource-usage.mdoc deleted + redirected; refs in env-vars, nx-vs-turborepo, manual-dte repointed
- NOT committed - awaiting Jack review

## Open items for Jack / follow-up verification
- #4 Docker read-through cache GA status (controller plumbing exists; infra base manifests lacked the mirror deployment). Page marked "Early availability".
- #3 Docker layer caching availability: Steve+Settings say dedicated-compute-gated; infra says deployed to all clusters. Page follows product (gated). Reconcile.
- Pricing numbers kept out of prose (staging screenshot vs code differ); pages point to Settings>Add-ons.
- Screenshots: reused existing assets for resource-usage/sandboxing. Jack's 15 new add-on-UI screenshots not yet saved as repo assets - refresh imagery later if desired. Pages #3-6 ship text-only.
- npm vs NPM casing: kept "NPM" in title/sidebar (matches request), "npm" in prose (tool). Vale passes.
