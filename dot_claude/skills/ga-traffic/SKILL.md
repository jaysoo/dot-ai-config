---
name: ga-traffic
description: >
  Refresh and analyze nx.dev traffic: the GA4+GSC ga-traffic pipeline (raw scrapes ->
  process.mjs -> chart.html/analysis.json). Covers the fast in-page GA4 internal-RPC
  scrape method via Chrome MCP, the GSC scrape, merge + verification, and how to read
  the results (consent banner, server_page_view, GSC-clicks-as-canonical-organic).
  Triggers on "nx.dev traffic", "GA traffic", "update the traffic charts", "google
  analytics nx.dev", "docs traffic trend", "organic clicks", "refresh ga-traffic".
---

# nx.dev GA Traffic Pipeline (refresh + analysis)

Pipeline home: `.ai/2026-06-19/tasks/ga-traffic/` (in dot-ai-config: `dot_ai/...`).
Read its `README.md` FIRST - it is the authoritative doc for raw-file semantics and
caveats. Last full refresh: 2026-07-30 (data thru 2026-07-29), method + worked
example in `.ai/2026-07-30/tasks/ga-traffic-refresh/`.

## Quick answers (no scrape needed)

`out/analysis.json` has precomputed: `mom`, `trend` (+`pre_banner`), `organic`
(GSC vs GA4, `forward_tracking`, `docs_forward`), `event_impacts`, `key_findings`.
`out/chart.html` opens via `file://` (or `python3 -m http.server` + Chrome MCP -
the MCP blocks `file://` navigation). Only scrape when data is stale.

## Reading rules (do not relearn)

- **Views** = client page_view; consent-suppressed since 2026-05-01 (Cookiebot). The May cliff is measurement, NOT lost traffic.
- **GSC clicks** (`raw/gsc-daily.json`) = canonical consent-immune organic forward metric. Real organic decline confirmed (~-40% Oct25->Apr26, still ~-11%/mo as of Jul 2026).
- **server_page_view** = MP event, mostly AI crawlers, own axis, ~5M/mo. Bot/AI-Tool dims cannot isolate humans.
- **AU is contaminated** (server MP since Feb 2026) - never trend it. Recent appends set AU null on purpose.
- **gsc-docs-others-daily.json is HELD at 2026-06-24** - GSC page-filtered views got AI-Overview contamination (subset > whole = the tell). Check subset-vs-whole before un-holding.
- **Monthly source of truth** = the `raw` array in `.ai/2026-06-19/tasks/ga-monthly-traffic.mjs` -> regenerate with `node raw/_gen-monthly.mjs`. Don't hand-edit `monthly-segments.json`.

## Refresh workflow

Auth: Google account **jack@nrwl.io = authuser=1** (jack.hsu@gmail.com is authuser 0 and has no access). If "Verify it's you" appears, ask Jack to sign in - never authenticate yourself.

### 1. GA4 via internal-RPC replay (fast: ~30 queries in minutes)

Property `a88380372p309633468` ("Nx.dev - GA4", Narwhal). Open
`https://analytics.google.com/analytics/web/?authuser=1#/analysis/a88380372p309633468`,
open any saved exploration (e.g. "Server Page Requests"), then via `javascript_tool`:

1. Wrap XHR to capture the report request (URL + body + headers) - trigger a query by re-applying the date range:

```js
const oo = XMLHttpRequest.prototype.open, os = XMLHttpRequest.prototype.send,
      osh = XMLHttpRequest.prototype.setRequestHeader;
XMLHttpRequest.prototype.open = function(m,u){ this.__url=u; return oo.apply(this,arguments); };
XMLHttpRequest.prototype.setRequestHeader = function(k,v){ (this.__hdrs=this.__hdrs||{})[k]=v; return osh.apply(this,arguments); };
XMLHttpRequest.prototype.send = function(body){ const x=this;
  x.addEventListener('load',()=>{ if(typeof body==='string' && body.length>500 && (x.responseText||'').length>1000)
    window.__cap={url:x.__url,hdrs:x.__hdrs,body}; });
  return os.apply(this,arguments); };
```

2. Replay with mutated body. **Gotchas: `X-GAFE4-XSRF-TOKEN` header is required
   (else errorCode 3 / 400); every field used in `dimensionFilters` must ALSO be in
   `dimensions` with `isSecondary: true` (else errorCode 13 / 500); keep `rowAxis`
   consistent with row dims.** Response is `)]}',` + JSON; rows at
   `default.responses[0].responseRows[]` with `dimensionCompoundValues`/`metricCompoundValues`.

```js
window.runQ2 = async function({rowDims, extraDims, mets, filters, start, end, limit}) {
  const body = JSON.parse(window.__cap.body); const r = body.requests[0];
  r.dimensions = rowDims.map(d=>({name:d,isSecondary:false}))
    .concat((extraDims||[]).map(d=>({name:d,isSecondary:true})));
  r.dimensionFilters = filters||[];
  r.metrics = mets.map(m=>({name:m,isInvisible:false,isSecondary:false}));
  r.dateRanges = [{startDate:start,endDate:end}];
  r.rowAxis = {fieldNames:rowDims,sorts:[{fieldName:rowDims[0],sortType:1,isDesc:false,pivotSortInfos:[]}],limit:limit||1000,offset:0,metaAggTypes:[]};
  const resp = await fetch(window.__cap.url,{method:'POST',credentials:'include',headers:{...window.__cap.hdrs},body:JSON.stringify(body)});
  const json = JSON.parse((await resp.text()).replace(/^\)\]\}',?\s*/,''));
  if (json.er) throw new Error('API '+JSON.stringify(json.er).slice(0,100));
  return json.default.responses[0].responseRows.map(row=>({d:row.dimensionCompoundValues.map(x=>x.value),m:row.metricCompoundValues.map(x=>x.value)}));
};
const ex = (f,v)=>({filters:[{fieldName:f,expression:v,expressionList:[v],evaluation:1,complement:false,isCaseSensitive:true}]});
const re = (f,v)=>({filters:[{fieldName:f,expression:v,expressionList:[v],evaluation:5,complement:false,isCaseSensitive:true}]});
// complement:true = negation. evaluation: 1=exact, 5=regex.
```

3. Internal names: dims `date` (YYYYMMDD) / `month` / `page_path` / `hostname` /
   `event_name` / `session_default_channel_grouping` / Bot = `custom_dimensions_group2_slot_05`
   (values `''`/`'false'`/`'true'`); metrics `screen_page_views` (= Views) /
   `event_count` / `active_users`. Discover others by adding the dim in the UI and
   capturing the request. Marketing regex lives in `raw/segment-definitions.json`.

4. The full query list (11 client dailies + 9 server-by-cat + 4 monthly + 6 channels)
   is in `.ai/2026-07-30/tasks/ga-traffic-refresh/merge.mjs` + the transcript README.
   Scrape from ~9 days before the last stored date for overlap verification.

5. Ship out: `JSON.stringify(window.__data)` then POST to a localhost receiver
   (`recv.mjs` pattern, `mode:'no-cors'`) - works on analytics.google.com.
   Cleanup: undo any UI edits (explorations AUTO-SAVE - cmd+z for added dims; date
   range change is tolerated) and kill the receiver.

### 2. GSC (site-wide clicks/impressions)

`https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Anx.dev&breakdown=date&authuser=1`
-> date filter "More"/Custom -> DAYS tab. localhost POST is **CSP-blocked** here:
read the DOM instead (`document.querySelectorAll('table tr')`, ~3KB, chunk-return).
Data lags ~1 day. Multiple stale tables can coexist in the DOM - take the one whose
date span matches the applied range. Only refresh `gsc-daily.json` (unfiltered);
docs+others stays held (see Reading rules).

### 3. Merge + regenerate + verify

Adapt `.ai/2026-07-30/tasks/ga-traffic-refresh/merge.mjs` (idempotent, upserts by
date, reports overlap diffs - expect only ±1-3-view restatements):

1. Update the monthly `raw` array in `ga-monthly-traffic.mjs` (finalize completed month, add new partial with `partial: true` + comment) -> `node raw/_gen-monthly.mjs`.
2. `node merge.mjs` -> updates the 8 dailies + gsc-daily + channels-by-month.
3. `node process.mjs` - check: daily-vs-monthly integrity 14/14 (or current N/N) within 2%, source crosscheck 2/2, row counts advanced.
4. Update the pipeline README's **Data currency** bullet + file-table day counts; fix the hardcoded "partial month" caption in `process.mjs` (search "partial month").
5. Eyeball `out/chart.html` (serve via localhost for Chrome MCP). Verify any new claim (e.g. "fastest-growing category") against per-month sums before writing it down.

## Related

- `metrics-review` skill = the broad director dashboard; this skill owns the deep nx.dev GA/GSC pipeline.
- Ahrefs MCP tools (`gsc-*`, `web-analytics-*`) exist but the pipeline's GSC numbers come from the GSC UI for continuity.
