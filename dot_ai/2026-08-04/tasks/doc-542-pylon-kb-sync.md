# DOC-542: Sync /docs/kb into the Pylon KB

Date: 2026-08-04
Linear: https://linear.app/nxdev/issue/DOC-542/investigate-pylon-kb-integration-with-docs-search
Related: DOC-552 (Rework KB section, merged), PR #36277 (closed)

## Goal

Mirror `/docs/kb` articles into the Pylon knowledge base so Pylon's "suggest KB
answer" feature can link support-widget askers to relevant articles.

Mirror, not move. nx.dev stays canonical. No source deletion, no 301s to
help.nx.app.

## Why the crawl is not enough

Pylon already crawls nx.dev (training data "Nx Docs", type `crawled_site`,
created 2026-02-25, 1010/1017 pages, last scraped 2026-08-03). That feeds AI
answers.

It does NOT feed "suggest KB answer" in the support widget. Per Caleb: external
training data is not part of that feature. Only real KB articles are eligible.
Same limitation applies to `POST /training-data/upload-content`.

So the markdown-only route is out. The KB article API takes `body_html` only
(verified against https://static.usepylon.com/openapi.json) - the Markdoc to
HTML converter is required.

## Current state

### Pylon (live, verified via API 2026-08-04)

Knowledge base "Nrwl Knowledge Base" `e35aaa8d-4b65-4024-98c0-8e508846a027`,
collection "Nx Knowledge Base" `bd2e85a6-896a-457f-9540-8bc5a5cb4e8b`.

- 182 articles total, 181 published, 173 unlisted
- The 173 unlisted ones are Caleb's July 8-10 migration, still live even though
  PR #36277 was closed. Stale copies of pre-DOC-552 doc paths.
- 9 listed articles are the genuine hand-written KB (SAML/SCIM/on-prem, AI API
  key, npm proxy cache, docker layer cache). Leave alone.

Token: 1Password `Engineering/Nx Docs Pylon Integration/api-token`.

### Drift vs master `/docs/kb`

184 `.mdoc` files (211 sitemap URLs incl. generated).

| Bucket | Count | Action |
| --- | --- | --- |
| Slug matches Pylon article | 157 | Adopt + re-push content |
| In docs, not in Pylon | 27 | Create |
| In Pylon, slug gone from docs | 16 | Delete |
| Title drift on matched | 10 | Docs wins |

Orphan slugs to delete: `eslint`, `angular`, `overview`, `why-monorepos`,
`maintain-typescript-monorepos`, `define-environment-variables`,
`console-troubleshooting`, `create-a-host`, `create-a-remote`,
`federate-a-module`, `module-federation-and-nx`,
`nx-module-federation-technical-overview`,
`nx-module-federation-dev-server-plugin`, `react-module-federation-with-ssr`,
`use-environment-variables-in-react`, `use-environment-variables-in-angular`.

Link check: 248 distinct nx.dev links inside Pylon article bodies. Sampled 36,
35 resolve (via DOC-552 redirects). One dead: `/img/ts-benchmark.gif`.

### Caleb's tooling (branch `origin/docs/pylon-kb-migration`)

`astro-docs/scripts/pylon/`, ~1500 lines:

| File | Verdict |
| --- | --- |
| `pylon-api.ts` | Keep as-is. REST client, retry, throttle, attachment upload. |
| `markdoc-to-html.ts` | Keep. 494 lines, handles aside/tabs/filetree/youtube/graph. |
| `migrate-articles.ts` | Keep the sync core, strip the move semantics. |
| `audit-tags.ts` | Keep. Flags unconvertible tags before adding an article. |
| `federate-search.ts` | Delete. Solved a problem mirroring does not create. |
| `migration-audit.md` | Keep as reference. Tag fidelity table + GA traffic audit. |

## Step 0 (BLOCKING): does `is_unlisted` kill suggestions?

HYPOTHESIS, needs verification before any code is written.

All 173 articles are `is_unlisted: true`. Pylon's search docs say unlisted
articles are visible and searchable to internal users. Widget askers are
authenticated Nx Cloud customers, not internal users. If suggestions share that
visibility filter, every article is invisible to the exact feature this work is
for.

Counter-argument: suggestions and search are separate features, and `unlisted`
is documented as "accessible only via direct link" - a suggestion is a direct
link.

Test: flip one article to listed in the Pylon UI, ask the widget a question that
matches it, compare against an unlisted twin. Owner: Steven or Caleb (~5 min).

If listed is required, there is a tradeoff to settle: Caleb set unlisted to keep
duplicate content out of Google, with nx.dev canonical. Pylon has no canonical
tag support found. Listed means accepting the SEO risk.

## Steps

1. **Verify the unlisted question above.** Do not build until answered.
2. **Decide scope.** All 184, or a support-relevant subset? Suggested answers
   help on troubleshooting and how-to content. The 9 `nx-vs-*` comparison pages
   are SEO/marketing - suggesting "Nx vs Bazel" to someone with a broken cache is
   noise. `migration-audit.md` has a scored litmus and 6-month GA traffic data to
   cut against.
3. **Port the tooling to master.** Copy `scripts/pylon/` from
   `origin/docs/pylon-kb-migration`, minus `federate-search.ts`.
4. **Strip move semantics from `migrate-articles.ts`**: source-file deletion,
   `netlify.toml` redirect block generation, sidebar pruning, inbound-link
   rewriting. Keep: hash-based idempotency, slug adoption, image upload to Pylon
   CDN, write throttle, `pylon-kb.json` mapping.
5. **Retarget config.** `CANDIDATE_DIRS` to `src/content/docs/kb`. Slug =
   filename. `/docs/kb` is already flat and 1:1, much simpler than the nested
   tree Caleb faced - `docsPathForSource` slugification can go.
6. **Replace `NX_AUTHOR_USER_ID`.** Currently hardcoded to Caleb's personal Pylon
   user. Wants a dedicated Nx service user.
7. **Reconcile the 173** per the drift table: adopt 157, create 27, delete 16.
8. **Automate.** Sync on docs deploy or nightly cron. Hash skip means most runs
   no-op. Needs `PYLON_API_TOKEN` in CI.

## Open questions

- Does `is_unlisted` exclude articles from suggested answers? (blocking)
- If listed is required, is the duplicate-content SEO risk acceptable?
- Full 184 or a support-relevant subset?
- Who owns the sync when it breaks? Docs team or support?

## Notes on lossy conversions

From `migration-audit.md`, tags that do not survive to HTML cleanly:

- `graph` - static PNG screenshot, interactivity lost
- `project_details` - static code block
- `tabs`/`tabitem` - flattened to sequential h3 sections (41 articles use these)
- `index_page_cards` - static link list, snapshotted at migration time
- code fence `frame="terminal"` / `meta="{6-10}"` annotations - silently dropped

Run `audit-tags.ts` against `/docs/kb` before syncing to get the current census.
