# nx.dev GA traffic - monthly normalization (for Mon review with Victor)

Goal (from Slack w/ vsavkin): export basic monthly numbers - all / home / docs -
so we can read general trends, given that almost every month a code change altered
how views are counted and the raw numbers were thought to be not apples-to-apples.

Data scraped 2026-06-19 from GA4 "Nx.dev - GA4" (a88380372p309633468).
- Jan-Apr 2025: standard Reports "Pages and screens" (Explore can't go back >14 mo).
- May 2025-Jun 2026: Explore (Nth month) + server_page_view event counts.
Builder + raw numbers: `ga-monthly-traffic.mjs`. Generated table: `ga-monthly-traffic.csv`.

## TL;DR (the part worth reading)

1. **The "double-counting" never doubled the Views metric.** The clean pre-GTM
   baseline (Jan-Apr 2025) averages ~650K views/mo. May-Jul 2025, with GTM live
   (the supposed double-count window), is ~635K/mo - essentially the same. If page
   views had been counted twice we'd see ~1.3M. We don't. **So do NOT divide
   anything by 2** - raw Views are directly comparable Jan 2025 -> Apr 2026.

2. **Traffic was broadly flat for ~15 months, then declined recently.** All Views
   sat ~500-680K/mo from Jan 2025 through Feb 2026 (one Aug 2025 dip to 407K). The
   real decline is Mar 2026 (388K, -29%) and Apr 2026 (296K, -24%) - and home shows
   it too (49K Mar -> 36K Apr), so it is not purely a measurement artifact.

3. **The big May 2026 cliff = Cookiebot consent banner (May 1).** Client views drop
   ~67-74% across all segments (all -68%, home -74%, docs -67%). This is mostly a
   measurement change: client-side GA tags are now consent-gated.

4. **Server-side views confirm the May cliff is mostly measurement, not lost traffic.**
   server_page_view (consent-immune): Feb 2.6M -> Mar 3.3M -> Apr 5.5M -> May 5.1M.
   Flat/growing while client views collapse. Caveat: server_pv is mostly AI-crawler
   traffic, so it is a "site still being hit" signal, not a clean human count.

5. **The all/home/docs split only makes sense from Oct 2025.** astro-docs moved to
   `/docs` ~Sep-Oct 2025; before that docs lived at root paths (/getting-started/*,
   /reference/*, ...) and counted as non-docs. So "docs" reads ~0 before Oct 2025
   and "non-docs" correspondingly craters in Oct - structural re-bucketing, not real.
   The ALL series is the clean comparable one across the whole period.

## Monthly table (client page views unless noted)

| Month | All | MoM | Home | Docs | Non-docs | Active users | server_pv | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Jan 2025 | 642,659 |  | 53,912 | 0 | 642,659 | 110,491 | 0 | baseline; docs at root |
| Feb 2025 | 604,377 | -6% | 52,718 | 0 | 604,377 | 96,753 | 0 | baseline; docs at root |
| Mar 2025 | 682,239 | 13% | 57,917 | 0 | 682,239 | 109,880 | 0 | baseline; docs at root |
| Apr 2025 | 665,851 | -2% | 57,401 | 0 | 665,851 | 103,518 | 0 | baseline; docs at root |
| May 2025 | 639,476 | -4% | 56,349 | 0 | 639,476 | 100,623 | 0 | GTM live; no doubling seen |
| Jun 2025 | 622,307 | -3% | 54,198 | 0 | 622,307 | 111,513 | 0 | docs at root |
| Jul 2025 | 639,134 | 3% | 58,459 | 0 | 639,134 | 124,802 | 0 | docs at root |
| Aug 2025 | 406,972 | -36% | 47,105 | 0 | 406,972 | 84,165 | 0 | dip (summer? verify) |
| Sep 2025 | 530,731 | 30% | 59,194 | 19,084 | 511,647 | 111,390 | 0 | /docs starts ramping |
| Oct 2025 | 521,391 | -2% | 57,398 | 367,229 | 154,162 | 133,075 | 0 | docs split now valid |
| Nov 2025 | 538,355 | 3% | 75,499 | 341,762 | 196,593 | 183,025 | 0 |  |
| Dec 2025 | 425,089 | -21% | 59,767 | 298,518 | 126,571 | 116,247 | 0 |  |
| Jan 2026 | 502,735 | 18% | 49,193 | 403,073 | 99,662 | 95,965 | 0 |  |
| Feb 2026 | 544,268 | 8% | 49,020 | 448,565 | 95,703 | 259,793 | 2,613,475 | AU inflated by server MP |
| Mar 2026 | 388,465 | -29% | 49,556 | 281,899 | 106,566 | 169,813 | 3,341,956 | real decline begins |
| Apr 2026 | 296,525 | -24% | 36,428 | 216,101 | 80,424 | 90,842 | 5,471,799 | pre-banner decline |
| May 2026 | 94,774 | -68% | 9,388 | 71,525 | 23,249 | 19,641 | 5,119,810 | consent banner cliff |
| Jun 2026* | 51,667 | -45% | 5,339 | 37,757 | 13,910 | 10,773 | 3,228,509 | partial (through 18th) |

\* Jun 2026 is partial (~18/30 days). Active users is contaminated by server-side
Measurement Protocol events from Feb 2026 on (note the Feb AU spike, mostly in docs).

## Change timeline (for reference)

| Date | Change | Did it move the numbers? |
| --- | --- | --- |
| 2025-05-01/06 | GTM added alongside direct GA (#30977/#31090) | No visible effect on Views (baseline disproves doubling) |
| ~2025-09/10 | astro-docs live at /docs | Re-buckets docs vs non-docs (structural) |
| 2026-02-10 | removed Cookiebot + direct GA, all via GTM (#34384) | No clean step in Views; AU starts being inflated by server MP |
| 2026-02-27 | Framer migration (homepage + marketing) | Possible factor in the Mar-Apr decline |
| ~2026-02 | server_page_view via Measurement Protocol (#34883) | New server event stream (GA shows data from Feb) |
| 2026-05-01 | Cookiebot CONSENT BANNER enabled | The big May client-views cliff |

## Data-quality caveats

- **GA4 Explore is capped at ~14 months retention** -> Jan-Apr 2025 came from
  standard Reports (Pages and screens), which retains aggregated data longer. The
  two sources agree at the overlap so they stitch cleanly.
- **Active users is contaminated from Feb 2026** by server-side MP events. Treat AU
  before/after Feb 2026 as not comparable.
- **server_page_view is mostly AI-crawler/bot traffic**, not humans.
- **Definitions:** Home = pagePath "/"; Docs = pagePath begins-with /docs (0 before
  the astro migration); All = no filter; Non-docs = All - Docs.

## Open questions for Monday

1. **What drove the real Mar-Apr 2026 decline (pre-banner)?** Home dropped too, so
   it is not just measurement. Candidates: Framer migration SEO/tracking effects,
   organic search changes, real traffic loss. This is the one to dig into.
2. Confirm the May cliff = consent banner (measurement) - the server_pv flatness and
   the all-segments uniformity both support that.
3. The Aug 2025 -36% dip - real seasonality or a data gap? Quick sanity check.
4. Do we want GA4 Consent Mode modeling / a server-side human-pageview signal so
   months after the consent banner stay comparable going forward?

## Repro

GA Explore saved in the property as "Monthly views by segment (all/home/docs) -
normalization". Jan-Apr 2025 from Reports > Engagement > Pages and screens (Page
path dimension, single-month ranges). `node ga-monthly-traffic.mjs` regenerates the
table + CSV.
