# nx.dev GA4 Category Traffic Trends - Jan 2025 -> Jun 2026

Source: `out/chart-data.json` (`monthly` = all hosts; `monthlyNxdev` = Hostname=nx.dev exactly). "Views" = client GA4 `page_view`. Internal factors: `raw/events.json`. All numbers computed via `compute.mjs` / `verify.mjs` (no eyeballing).

## 1. Executive summary

- Two distinct regimes. Read the organic trend THROUGH April 2026; May/Jun 2026 are a measurement floor, not lost traffic.
- The May 2026 cliff (client views -68% all-hosts) is the Cookiebot consent banner (2026-05-01). Consent-independent `server_page_view` moved only -6.4% over the same Apr->May window. Consistent with a measurement effect, not a traffic loss.
- Through April 2026 (post-docs-migration window, Oct 2025 -> Apr 2026), home, docs, and blog declined in a tight cluster: -36.5% / -41.2% / -37.5% (mean -38.4%, sd 2.0). Marketing diverged hard: +39.4% (all-hosts), +51.6% (nx.dev-only).
- Three unrelated page types declining by near-identical % is the signature of a shared capture-layer regression (the GTM-only cutover #34384), not three independent content losses. Marketing escaped because real new-page/campaign growth outran the same capture drag.
- Every non-partial category's single steepest MoM decline lands in 2026-05 (the Cookiebot month) EXCEPT `others`, whose steepest is 2025-09->2025-10 (the docs migration moving root-path docs out of Others). Both are structural, not organic.
- `monthly` and `monthlyNxdev` tell the same story; nxdev-only is slightly steeper on `all` and `others`, slightly milder on home/blog, and shows marketing growing MORE (+51.6% vs +39.4%). Divergences noted inline below.

## 2. Per-category MoM % table (all-hosts `monthly`)

Steepest non-partial decline per column flagged **[STEEP]**. `~` = no comparable prior (null / pre-split / docs=0).

| Month | all | home | docs | blog | marketing | others |
|---|---|---|---|---|---|---|
| 2025-02 | -6.0 | -2.2 | ~ | ~ | ~ | -6.3 |
| 2025-03 | +12.9 | +9.9 | ~ | ~ | ~ | +13.2 |
| 2025-04 | -2.4 | -0.9 | ~ | ~ | ~ | -2.5 |
| 2025-05 | -4.0 | -1.8 | ~ | ~ | ~ | -12.6 |
| 2025-06 | -2.7 | -3.8 | ~ | -14.5 | +98.3 | -5.3 |
| 2025-07 | +2.7 | +7.9 | ~ | +4.6 | -51.3 | +5.9 |
| 2025-08 | -36.3 | -19.4 | ~ | -36.9 | -48.5 | -37.7 |
| 2025-09 | +30.4 | +25.7 | ~ | +91.5 | +22.0 | +22.2 |
| 2025-10 | -1.8 | -3.0 | +1824.3 | -23.1 | +9.6 | **-85.9 [STEEP]** |
| 2025-11 | +3.3 | +31.5 | -6.9 | -7.1 | -3.6 | +46.6 |
| 2025-12 | -21.0 | -20.8 | -12.7 | -12.5 | -11.0 | -59.3 |
| 2026-01 | +18.3 | -17.7 | +35.0 | -4.8 | +7.3 | -47.0 |
| 2026-02 | +8.3 | -0.4 | +11.3 | -4.0 | -1.5 | -15.3 |
| 2026-03 | -28.6 | +1.1 | -37.2 | +8.6 | +34.5 | +31.2 |
| 2026-04 | -23.7 | -26.5 | -23.3 | -22.5 | +14.2 | -50.5 |
| 2026-05 | **-68.0 [STEEP]** | **-74.2 [STEEP]** | **-66.9 [STEEP]** | **-65.4 [STEEP]** | **-77.0 [STEEP]** | -59.4 |
| 2026-06 (PARTIAL) | -45.5 | -43.1 | -47.2 | -33.7 | -42.8 | -40.3 |

nx.dev-only (`monthlyNxdev`) steepest-decline months are identical: 2026-05 for all/home/docs/blog/marketing; 2025-10 for others (-96.6%, even sharper since nxdev-only strips non-nx.dev root-docs noise).

### Net change, key windows

Post-docs-migration window (2025-10 -> 2026-04, last full pre-Cookiebot month):

| Category | all-hosts | nx.dev-only |
|---|---|---|
| all | -43.1% | -39.4% |
| home | -36.5% | -32.6% |
| docs | -41.2% | -42.6% |
| blog | -37.5% | -34.9% |
| marketing | **+39.4%** | **+51.6%** |
| others | -82.6% | -58.6% |

Cookiebot cliff (2026-04 -> 2026-05): all -68.0%, home -74.2%, docs -66.9%, blog -65.4%, marketing -77.0%, others -59.4%. `server_page_view` same window: **-6.4%**.

## 3. Per-category narrative

### Home

- Stable Jan-Jul 2025 (~52-58k/mo, MoM within +-10%). Normal Aug dip (-19.4%), Sep recovery (+25.7%), Nov spike (+31.5% -> 75.5k, likely a release/launch).
- Organic decline onset Dec 2025 -> Apr 2026: -20.8, -17.7, -0.4, +1.1, -26.5. Net Oct->Apr -36.5%.
- Internal: home moved to Framer 2026-02-27. Home is proxied, still under the GTM container, so the capture-layer drag (#34384, GTM-only cutover, page_view now depends on a container toggle found OFF) applies. The -26.5% in Apr coincides with the 2026-04-17 nx-dev pare-down completing the content-off-next.js move.
- 2026-05 -74.2% = Cookiebot. Not organic.
- nxdev-only nearly identical (-32.6% net), so home decline is not a versioned-subdomain artifact.

### Docs

- ONLY analyzable Oct 2025+ (astro-docs /docs go-live 2025-09-29; pre-Oct docs sat in Others). The +1824% Sep->Oct step is the migration, not growth - do not read it as organic.
- Post-migration: ramped to a Feb 2026 peak (448.6k), then fell - Mar -37.2%, Apr -23.3%. Net Oct->Apr -41.2%.
- The Feb peak -> Mar/Apr drop aligns with the GTM-only cutover reaching prod (merged 2026-02-10, GA decline onset ~mid-March per events.json) and the Apr content-migration steps (blog standalone 04-16, nx-dev pared 04-17). Docs is on astro (never had the next.js double-count), yet declines in lockstep with home/blog -> points to the shared GTM container capture, not a docs-content problem.
- External candidate: AI substitution (LLMs / AI Overviews answering dev questions) would hit DOCS hardest of all categories. Plausible contributor to the docs slope but cannot be the sole driver - home and blog fell the same %, and AI substitution would not symmetrically depress a homepage. See External factors.
- 2026-05 -66.9% = Cookiebot.

### Blog

- Series starts May 2025 (pre-May folded into Others). Volatile but range-bound ~18-35k through early 2026. Aug dip -36.9%, Sep +91.5% (a viral/launch post).
- Decline Oct 2025 -> Apr 2026 net -37.5%, clustering with home/docs.
- Internal: nx-blog went standalone (Astro) on 2026-04-16 via the BLOG_URL env flip. The -22.5% Apr MoM brackets that switchover - a new app on a different tracking path is a capture-continuity risk, same family as the docs astro move.
- 2026-05 -65.4% = Cookiebot.

### Marketing (the divergence)

- Series starts May 2025. Erratic early (+98% Jun, -51% Jul - small base, campaign-driven).
- THE OUTLIER: Oct 2025 -> Apr 2026 net **+39.4%** (all-hosts) / **+51.6%** (nx.dev). Raw trajectory Dec->Apr: 10.4k -> 11.2k -> 11.0k -> 14.8k -> 16.9k - real, monotonic-ish growth Feb->Apr.
- Same Framer migration (2026-02-27), same GTM container, same capture drag as home - yet marketing GREW. Interpretation: new marketing pages / campaign landing pages added enough real sessions to overcome the shared capture loss. The other three categories had no such offsetting page growth, so the capture drag showed through as decline.
- nxdev-only growth is even stronger (+51.6%), so this is genuine on the canonical host, not a preview/subdomain artifact.
- 2026-05 -77.0% = Cookiebot (steepest of all categories that month - small absolute base amplifies the % but it is the same consent effect).

### Others

- NOT comparable across 2025-09-29. Pre-Oct-2025 Others was huge (root-path docs lived here: ~500-600k/mo). The migration moved them to /docs, collapsing Others -85.9% in Oct (all-hosts) / -96.6% (nxdev). That step is the migration, label it as such.
- Post-migration Others is a small residual bucket (~10-80k) - noisy, low signal. Continued decline through Apr is partly the long tail of root docs being deprecated/redirected.
- Steepest decline = 2025-10 (the migration), the only category whose steepest is NOT the Cookiebot month.

## 4. Overall traffic synthesis (`all_views`)

- 2025 baseline stable ~600-680k/mo Jan-Jul (ex the Aug seasonal trough at 407k).
- Apparent total decline Oct 2025 (521k) -> Apr 2026 (297k) = -43.1%. But `all` is a sum dominated by the migration-collapsed Others bucket and the capture-dragged home/docs/blog, so the headline -43% over-states real audience loss.
- The cleaner read: organic categories (home/docs/blog) fell ~38% in a tight band Oct->Apr while marketing grew ~40-52%. A tight, content-agnostic cluster of declines is the fingerprint of a shared client-capture regression (GTM-only cutover), layered on top of any real demand softening.
- May/Jun 2026 (all -68% then partial -45%) is the Cookiebot consent floor. `server_page_view` (consent-independent) was essentially flat across it (Apr->May -6.4%; the Feb-Apr server ramp 2.6M -> 3.3M -> 5.5M reflects server tracking maturing, not a traffic surge). Real audience did not drop ~70% on May 1.
- Net: there is likely SOME real organic softening through April (consistent with AI substitution + zero-click on docs, and general 2025-26 dev-traffic headwinds), but the measured client decline materially overstates it because of stacked capture changes (GTM cutover, three content-migration moves, then Cookiebot).

## 5. Measurement vs likely-real (calibrated)

Likely measurement (capture/consent), not traffic:

- May/Jun 2026 cliff across ALL client categories. Strongly consistent with the Cookiebot consent banner: server_page_view held (-6.4%) while client views fell -68% in the same window. (Consistent with, does not prove - server and client populations are not identical.)
- The tight home/docs/blog cluster (-36.5 / -41.2 / -37.5%, sd 2.0) Oct->Apr. Three unrelated page types declining within 5 points of each other is hard to explain by content-specific causes; consistent with the shared GTM container page_view capture (#34384, toggle found OFF) degrading all GTM-tracked surfaces together.
- The Sep/Oct 2025 Others collapse and docs spike. Definitionally the astro-docs migration (root docs -> /docs), not a real swing.

Likely real (or at least not pure measurement):

- Marketing growth (+39-52%). Capture changes would suppress, not inflate; the monotonic Feb->Apr raw climb is consistent with genuine new-page/campaign traffic.
- Seasonality: Aug 2025 -36.3% and Dec 2025 -21.0% are textbook summer/holiday dips, present before any capture changes.
- A residual organic docs softening is plausible (AI substitution pressure is real and docs-weighted) but UNQUANTIFIED here - it is confounded with the capture drag and cannot be isolated from this dataset alone.

What is NOT supported:

- "Docs traffic fell 41% because of AI substitution." The identical home/blog decline refutes attributing the docs slope solely to content/AI factors.
- Treating May/Jun MoM as organic. June is partial; both months are consent-floored.

## 6. Open questions + what a consent-independent source would resolve

Open:

- How much of the Oct->Apr ~38% organic-cluster decline is capture drag vs real demand? Not separable from client GA alone.
- Exact prod date the GTM-only cutover hit nx.dev (events.json: master-merge 2026-02-10, prod likely late Feb/early Mar; GA onset ~mid-March). Pinning it would tighten the correlation.
- Is the residual docs softening AI-substitution-driven? Needs external corroboration (see below).
- Did marketing's growth come from specific new landing pages? Page-level `topPages` / `topPagesBeforeAfter` (present in chart-data.json, not analyzed here) could confirm.

A consent-independent source (Netlify Analytics / server access logs) would resolve:

- Whether real audience actually dropped post-Cookiebot (server-log pageviews across Apr->Jun 2026). If flat, confirms the May cliff is pure measurement.
- The true Oct->Apr trend per section, free of GTM/consent capture - directly tests the "capture drag vs real decline" split.
- Whether docs specifically lost real sessions (AI substitution) by comparing server-log /docs hits YoY, independent of client tracking.
- `server_page_view` already partially does this (held across the cliff) but it started 2026-02 and its own ramp confounds the Feb-Apr slope; raw server logs would not have that ramp artifact.

## External factors

External web research (June 2026) confirms the AI-substitution / zero-click trend is real and well-dated, but CONCENTRATED in news + mid-tier informational/Q&A content - almost nobody has cleanly measured it for first-party REFERENCE documentation. Our data shape (content-agnostic, all page types) fits it only partially.

Macro (organic / zero-click):
- Pew (Jul 2025, Mar-2025 data): with an AI summary present, users click a result 8% of searches vs 15% without (~47% relative drop); 1% click inside the summary. https://www.pewresearch.org/short-reads/2025/07/22/google-users-are-less-likely-to-click-on-links-when-an-ai-summary-appears-in-the-results/
- Ahrefs: position-1 CTR reduction when AIO present rose 34.5% (Apr 2025) -> 58% (Dec 2025). https://ahrefs.com/blog/ai-overviews-reduce-clicks-update/
- Zero-click share: SimilarWeb 56% -> 69% of Google searches (May 2024 -> May 2025). https://www.seroundtable.com/similarweb-google-zero-click-search-growth-39706.html
- COUNTERWEIGHT: across the top 40k US sites, organic traffic was only -2.5% YoY (Google +0.8%) - Graphite/SimilarWeb, Oct 2025. The damage is concentrated, not web-wide. https://graphite.io/five-percent/debunking-the-myth-that-seo-traffic-has-dramatically-declined
- Magnitude caveat: the 35-60% figures are CTR-WHEN-AIO-APPEARS (AIO shows on ~18-35% of searches), NOT total-pageview decline. Blended effect on total search traffic is much smaller.

Docs / dev-content (closest peers):
- Stack Overflow (closest analog to nx.dev): new-question volume -64% YoY (Apr 2024->Apr 2025); traffic est. -35 to -47% since ChatGPT. https://devclass.com/2026/01/05/dramatic-drop-in-stack-overflow-questions-as-devs-look-elsewhere-for-help/
- PRECEDENT WARNING (most relevant to us): SO's original 2023 "~50% traffic drop" was substantially a Google Analytics MIGRATION ARTIFACT - corrected to ~35%, and SO's OWN first-party number was only "~5% vs 2022". A dev-reference site's large apparent GA decline was already, once, mostly a measurement artifact. https://blog.pragmaticengineer.com/are-reports-of-stackoverflows-fall-exaggerated/
- Causal anchor: PNAS Nexus (peer-reviewed, Sep 2024), diff-in-diff vs Russian/Chinese forum controls, attributes ~25% SO activity drop within 6 months to ChatGPT. https://academic.oup.com/pnasnexus/article/3/9/pgae400/7754871
- Counter for docs proper: Read the Docs founder (Jan 2025) reports docs platforms have NOT seen a comparable drop - canonical reference serves a different use case than Q&A. https://www.ericholscher.com/blog/2025/jan/21/stack-overflows-decline/
- Opposite pressure: Mintlify (vendor, Mar 2026) claims ~half of docs-site traffic is now AI agents reading docs (Cursor/Claude Code/ChatGPT) - rising BOT traffic, not falling human traffic. Matches our server_page_view ramp. https://www.mintlify.com/blog/docs-as-ai-interface

Crawl-vs-click (why server_page_view balloons while client views fall):
- Cloudflare crawl-to-refer ratios, "Computer & Electronics" industry (Aug 2025): Anthropic 8,800:1, OpenAI 402:1, Perplexity 88:1. AI consumes content heavily, refers almost no clicks. https://blog.cloudflare.com/ai-crawler-traffic-by-purpose-and-industry/
- Caveat: network-wide aggregates, not our lost human traffic. Explains the rising bot share of server hits, not the size of the client-views drop.

Measurement confounds flagged externally (reinforce section 5):
- Consent Mode v2: mandatory EEA/UK since Mar 2024, SILENTLY enforced for all EEA/UK ~Jul 21 2025; can cut reported GA4 traffic 50-95% for affected sites. Check nx.dev's consent setup vs the decline onset.
- THE decisive diagnostic these sources converge on: cross-check GA4 page_views against Google Search Console CLICKS (server-side, immune to consent/ad-block/GA4-session loss). GSC clicks flat/up while GA4 down -> measurement artifact; GSC clicks also down -> real lost audience.

Seasonality (confirmed in OUR data, not external): Aug 2025 -36.3% summer dip, Dec 2025 -21.0% holiday dip. Calendar effects, recur YoY; any window crossing Aug/Dec must control for them.

Fit to nx.dev (calibrated):
- Direction: strong. Dev-reference content + a developer audience that leads AI adoption + in-IDE assistants reading docs without a human pageview.
- Magnitude: partial. A ~40% drop ACROSS ALL PAGE TYPES (incl. homepage, which AI Overviews barely touch) is steeper than search-channel substitution alone produces, and the uniformity is itself a yellow flag for a SITE-WIDE cause - the same conclusion section 5 reached from the internal data.
- Best external estimate: AI substitution plausibly accounts for ~10-25% relative decline in SEARCH-DRIVEN docs traffic; a clean 35-45% across all page types most likely = AI substitution STACKED ON the capture/consent changes, not AI alone.
- Independent convergence: the external research and our internal cross-category-uniformity finding arrive at the SAME verdict - measurement-led decline with a real-but-smaller AI/organic residual underneath. Size it with the GSC-clicks cross-check.

Caveat: all external factors predict GRADUAL, content-weighted erosion. The data's sharp, content-agnostic steps (Oct migration, mid-March capture onset, May consent cliff) are dominated by INTERNAL factors. External pressure is the residual after removing those - real but currently unquantified; the GSC-clicks check is the way to quantify it.

---

### Caveats honored

- May/Jun 2026 read separately (Cookiebot measurement floor; server_page_view flat). Organic trend read THROUGH April 2026.
- docs/others analyzed POST-migration only (Oct 2025+); Sep/Oct step labeled as the migration.
- Prior finding CONFIRMED: home/docs/blog clustered -36.5/-41.2/-37.5% (mean -38.4, sd 2.0) while marketing +39.4% (all) / +51.6% (nxdev). Discussed as a shared-capture signature.
- Jan-Apr 2025 has no blog/marketing split (in Others); series start May 2025, marked `~` in the table.
- June 2026 partial - flagged everywhere, MoM not treated as real.
