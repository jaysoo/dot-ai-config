# Brand Radar baseline (orchestrator, 2026-08-06)

Report `Nx` = `019f70fc-d637-7bb5-a169-c89330eb746f`, project 8558520.
Source: `brand-radar-sov-overview-entities`, `brand-radar-cited-pages-entities`,
`brand-radar-ai-responses-entities`, all `prompts=custom`, `data_source=chatgpt`.

## Scope limit found (affects Phase 2 step 5)

`prompts=ahrefs` - Ahrefs' global Brand Radar corpus - returns
`Missing addon: Brand Radar ["Chatgpt"]` on this subscription. **The plan's Phase 2 step 5
(mine the global corpus for prompts competitors win and Nx is absent from) cannot run.**
Only our own 13 custom prompts are queryable. Phase 4 prompt candidates therefore come from
People Also Ask (Phase 2 step 4), Phase 3 community verbatims, and empirical model runs -
not from Ahrefs' corpus.

## Share of voice - and why the number is meaningless as configured

| Brand | SoV |
|---|---|
| Nx | 1.00 |
| Turborepo | 1.00 |
| Moon | 0.45 |
| VitePlus | 0.00 |

Nx appears in 100% of responses because **8 of the 13 prompts name Nx in the question**.
A prompt set that names the brand cannot measure whether the brand gets recommended. Only 5
of 13 prompts are unbranded. This is the single biggest structural defect in the current
prompt set - larger than the redundancy the plan expected to find.

Fix: the expanded set must be majority-unbranded, and branded prompts must be tagged so the
dashboard can segment them out of any visibility metric.

## Citation mix (45 cited pages across the 13 prompts)

### 1. nx.dev is splitting its own citations across three URLs for one topic

| URL | Responses citing it |
|---|---|
| `nx.dev/docs/kb/nx-vs-turborepo` | 8 |
| `22.nx.dev/docs/guides/adopting-nx/nx-vs-turborepo` | 7 |
| `nx.dev/docs/guides/adopting-nx/from-turborepo` | 4 |

Site Explorer separately shows the *ranking* URL for `nx vs turborepo` is
`nx.dev/docs/guides/adopting-nx/nx-vs-turborepo` - a fourth path. The July notes flagged
this dedupe as action H1; it is still open and is now demonstrably splitting AI citations,
not just organic authority.

### 2. Versioned doc subdomains are being cited instead of canonical nx.dev

`22.nx.dev/...` (7 responses), `19.nx.dev/recipes/adopting-nx/adding-to-monorepo`,
`19.nx.dev/getting-started/why-nx`. Old versions of pages are training the answers.
`22.nx.dev` is the second-most-cited page in the entire set.

### 3. A deprecated page and a third-party mirror are cited

- `nx.dev/docs/reference/deprecated/integrated-vs-package-based` - 2 responses.
  Models are explaining Nx using a page Nx marked deprecated.
- `www.mintlify.com/nrwl/nx/getting-started/add-to-existing-project` - 2 responses.
  A third-party mirror of Nx docs is taking citations that belong to nx.dev.

### 4. The answer layer is dominated by AI-generated listicle farms

pkgpulse.com (3 distinct pages, 11 responses total), devtools.cloud, thesoftwarescout.com,
devtoollab.com, trybuildpilot.com (2 near-identical pages), digitalapplied.com,
generalistprogrammer.com, nexusbro.com, algoroq.io, codeables.dev, nexisltd.com,
devtoolhq.com. Plus `monorepovspolyrepo.com/tools/` at 6 responses - the third-most-cited
page in the set and not an Nx property.

These sites, not vendor docs, are what ChatGPT reads to answer "best monorepo tool".
Outreach/listicle placement is a distinct lever from writing more nx.dev pages.

### 5. Competitors are cited inside answers about Nx

`turborepo.dev/docs/guides/migrating-from-nx` - 2 responses. Turborepo's
migrate-away-from-Nx page is in the citation mix for Nx questions. This is the AI-layer
counterpart to the `migrate nx to turborepo` keyword the audit kept as a churn tracker.
`moonrepo.dev/docs/comparison` - 3 responses.

### 6. The ci-competitors comparison pages DO earn citations

`nx.dev/docs/kb/nx-vs-depot` - 2 responses, unprompted (no prompt names Depot).
Evidence that the Depot/Blacksmith-generation comparison pages get picked up by models even
without matching search volume. Feeds the Phase 5 recommendation on whether the
`ci-competitors` cluster deserves more dedicated content.

## Carry into Phase 4

- Majority-unbranded prompt set; tag branded prompts explicitly.
- Model coverage is the real gap: all 13 prompts are ChatGPT-only, every other data source
  is `off` in the report config.
- Prompt candidates must come from PAA + community verbatims, since the Ahrefs corpus is
  unavailable.
