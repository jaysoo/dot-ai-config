# Performance Review Dossier — Nicole Oliver (H1 2026)

**Review window:** 2026-02-01 to 2026-07-31
**Subject:** Nicole Oliver — nicole@nrwl.io — Linear user `1e523cf2-5e19-440f-8b5e-142e2316e24a` — Slack `UH6AVVBMJ` — Notion `af377395-aa57-4d9f-98ba-30db60f34598`
**Role context:** Engineer, Nx Cloud (nrwl/ocean). Historically UI, VCS integrations (GitHub App), CSP, self-healing CI UI. This half: de facto owner of the onboarding/activation (PLG) surface.
**Compiled:** 2026-08-01 for Jack Hsu.

---

## Summary

- **High, steady delivery:** 89 Linear issues completed in the window (17 Feb, 13 Mar, 20 Apr, 10 May, 14 Jun, 15 Jul), with only 6 in progress at window end — the largest single body of work centered on onboarding/activation (source: Linear `list_issues`, assignee nicole@nrwl.io, updatedAt -P7M, 147 results).
- **Led and shipped the onboarding overhaul end-to-end:** one-page connect-workspace flow (30% vs 20% claim rate, 75% vs 42% completion), /get-started redesign (launched in ~3 weeks), in-app feature demo (live Jun 15), and workspace setup guide (GA Jul 31; 41% banner click-through) — each with a PostHog dashboard to prove impact (sources: her Linear status updates; Slack permalinks below).
- **Peer-recognized:** Jack's #kudos post (Mar 25) credits her (with Dillon/Chau/Ben) for a "zero to green PR in ~45 seconds" onboarding experience; repeated thanks from Rareș, Jack, Victor group DMs, and Cory (sources: Slack permalinks below).
- **Range beyond UI:** production releases (2602.26.5 to staging/prod), CVE/vulnerability remediation (OTel, uuid, yaml package updates; 3 pentest findings closed), Mongo aggregation/analytics work, and careful customer-facing change management (Cloudinary) (sources: Linear CLOUD-4936/4960/4967/4311/4313/4316; Slack #nx-cloud 2026-02-27, #nx-cloud-team 2026-07-30/31, #support 2026-04-30).
- **Main watch item is schedule reliability on projects she leads:** Feature demos target slipped 3 times (Apr 17 → May 1 → May 15, closed Jul 20), Workspace setup guide slipped 3 times (Apr 24 → May 29 → Jul 17), One-page flow finished a month past target, and OSS Credits is past its Jun 30 target with no status update after Jun 16 — largely a WIP/sequencing problem she herself flagged ("paused until we get the general demo out") (source: Linear project records + her own status updates).

---

## Linear

### Volume (assignee = nicole@nrwl.io, updated in last 7 months; 147 issues returned, no further pages)

| Bucket | Count |
|---|---|
| Completed inside window (2026-02-01 → 2026-07-31) | 89 |
| In progress at window end | 6 |
| Unstarted/backlog | 3 |
| Canceled | 25 |
| Completed outside window | 19 |

Completed by month: Feb 17 · Mar 13 · Apr 20 · May 10 · Jun 14 · Jul 15 — no dead months.

### Most significant issues (window)

1. **CLOUD-4522 — Redesign the /get-started view** (High, done 2026-05-14) — https://linear.app/nxdev/issue/CLOUD-4522/redesign-the-get-started-view — anchor of the Get started page redesign project, launched within ~2 weeks of layout decision.
2. **CLOUD-4708 — Workspace setup guide** (High, done 2026-07-13) — https://linear.app/nxdev/issue/CLOUD-4708/workspace-setup-guide — milestone-based guide, achievements framework; GA'd Jul 31 (ocean PR #12677).
3. **CLOUD-4571 — General demo** (High, done 2026-06-12) — https://linear.app/nxdev/issue/CLOUD-4571/general-demo — in-app demo live Jun 15, accessible unauthenticated at cloud.nx.app/demo/general.
4. **CLOUD-3954 — Build one-page manual flow** (Medium, done 2026-04-23) — https://linear.app/nxdev/issue/CLOUD-3954/build-one-page-manual-flow — third leg of the one-page onboarding (GitHub/GitLab/manual).
5. **CLOUD-4567 — Add a PAT option to the GH-powered connect workspace flow** (High, done 2026-06-09) — https://linear.app/nxdev/issue/CLOUD-4567/add-a-pat-option-to-the-gh-powered-connect-workspace-flow — VCS-integration depth; requested via Victor/Jack group DM, turned around in ~10 days.
6. **CLOUD-4289 — Fix installing GH app in onboarding flow for non-cloud.nx.app envs using the prod GH app** (High, done 2026-02-26) — https://linear.app/nxdev/issue/CLOUD-4289 — GitHub App expertise applied to onboarding.
7. **CLOUD-4288 — /welcome experiment Feb 16th** (High, done 2026-02-16) — https://linear.app/nxdev/issue/CLOUD-4288 — one of several A/B experiments she ran (also CLOUD-4414 CTA copy variations, done 5/7).
8. **CLOUD-4936 — Frontend/Polygraph Vulnerabilities - MEDIUM** (High, done 2026-07-31) plus **CLOUD-4960** (yaml stack overflow CVE-2026-33532) and **CLOUD-4967** (uuid CVE-2026-41907) — https://linear.app/nxdev/issue/CLOUD-4936 — July security remediation sprint.
9. **Pentest closures: CLOUD-4311, CLOUD-4313, CLOUD-4316** (Mar–May) — unauthenticated achievements endpoint, registration rate limiting, Rollbar token injection — https://linear.app/nxdev/issue/CLOUD-4316 et al.
10. **CLOUD-4774 — Nx Cloud onboarding survey** (High, done 2026-07-30) + **CLOUD-4775 — plan cancellation survey** (done 2026-07-28) — start of the Quark-a growth instrumentation.

Also notable: CLOUD-4404 (Overview branch filtering very slow), CLOUD-4411 (missing Mongo index on ciPipelineExecutions), CLOUD-4323 (P95 CIPE duration analytics) — performance/data work outside her historical UI lane.

### Projects where Nicole is LEAD (active in window)

| Project | Dates | Outcome / slippage |
|---|---|---|
| One-page "connect workspace" flow — https://linear.app/nxdev/project/one-page-connect-workspace-flow-23149e6efc77 | start 2025-11-26, target 2026-05-01, completed 2026-06-01 | Completed ~1 month past target (target itself already moved Dec 19 '25 → Jan 30 → May 1). Strong results: 30% vs 20% claim rate, 75% vs 42% completion (her 5/4 update). |
| 600 workspaces connected every week — https://linear.app/nxdev/project/600-workspaces-connected-every-week-ee99cb594b90 | start 2025-11-10, target 2026-03-20, closed 2026-07-20 | Metric-goal project; repeatedly marked offTrack in her own updates; closed 4 months past target with work absorbed into other efforts. |
| Get started page redesign — https://linear.app/nxdev/project/get-started-page-redesign-b0230b1b052e | start 2026-05-07, completed 2026-05-27 | On track throughout; decision → launch in ~3 weeks. Included removing the GH App "administration: read/write" scope (CLOUD-4508). |
| Feature demos — https://linear.app/nxdev/project/feature-demos-1a6f6084c62d | start 2026-03-11, target 2026-05-15, completed 2026-07-20 | Target moved 3x (Apr 17 → May 1 → May 15); demo live Jun 15; project closed Jul 20. Merge of Ben's + Dillon's prototypes was the acknowledged bottleneck. |
| Workspace setup guide — https://linear.app/nxdev/project/workspace-setup-guide-1a0fe6ac8668 | start 2026-03-02, target 2026-07-17, still In Progress | Target moved 3x (Apr 24 → May 29 → Jul 17); deliberately paused ~6 weeks for demo work; live in production Jul 20, GA Jul 31; project cleanup remains. |
| OSS Credits Program — Activation Campaign — https://linear.app/nxdev/project/oss-credits-program-activation-campaign-e30751b2965f | start 2026-06-10, target 2026-06-30, still In Progress | Past target; 3 of its issues done (list, badges, shareable stats) by Jun 30, 1 in progress (email to top orgs); no status update after Jun 16. |
| Quark-a growth efforts — https://linear.app/nxdev/project/quark-a-growth-efforts-97024abbbda8 | 2026-07-01 → 2026-08-31, In Progress | Current cycle: surveys shipped, analytics rollup + flag cleanup in flight. |
| Reverse trial — https://linear.app/nxdev/project/reverse-trial-7579b924d882 | target 2025-10-24, completed 2026-05-13 | Long-tail pre-window project; closed in window after bug fixes and one prospect trial. |
| Template-based onboarding — https://linear.app/nxdev/project/template-based-onboarding-d4beeddcc9da | target 2025-12-31, completed 2026-04-21 | Closed in window. |

### Status updates she authored (selection; all from `get_status_updates`, type=project, user=nicole@nrwl.io)

- **2026-05-04, One-page flow** (offTrack): the honest experiment readout — 30% vs 20% claim completion, 75% vs 42% flow completion, "I think we can consider this a win, even though we're not quite at 2x," plus a self-deprecating note on misreading PostHog experiment results. https://linear.app/nxdev/project/one-page-connect-workspace-flow-23149e6efc77/activity#project-update-4c10fad4
- **2026-04-21, One-page flow** (onTrack): "turned on the one-page Gitlab flow fully, it had over double the claimed rate as the original." #project-update-267fd354
- **2026-05-22 & 05-27, Get started redesign** (onTrack): launched with activity dashboard; closed after removing GH App admin scope. #project-update-1578932f, #project-update-b7a14382
- **2026-06-16, Feature demos** (offTrack): demo live, DAU/MAU +5% prediction, dashboard link, entry points enumerated. #project-update-badd2099
- **2026-04-27 & 05-04, Feature demos** (atRisk/offTrack): candid about the messy merge of Ben's and Dillon's prototypes — "The merge was more difficult than I expected it to be so we're pretty behind, but this is the trickiest part." #project-update-1945b30c, #project-update-64c238ac
- **2026-04-17, Workspace setup guide** (offTrack): spec finalized (milestones → first value: VCS integration, access control, CI cache hits; achievements tracking), openly re-planned into May. #project-update-a99933a0
- **2026-05-04/05-11/05-27/06-01/06-16, Workspace setup guide** (atRisk): a string of "paused still" updates while demos took priority — transparent, but a long stall on a led project. #project-update-52cd2791 etc.
- **2026-07-20, Workspace setup guide** (onTrack): "live in production… will close the project" (0% → 100% since Jun 16). #project-update-1ada1bf0

Pattern: updates are frequent, metric-anchored, and honest about health (she uses offTrack/atRisk on her own projects rather than defaulting to green).

---

## Slack highlights

(Handle `UH6AVVBMJ`, display name "Nicole". Month-bounded `from:` searches Feb–Jul 2026 plus targeted searches; the 20-result cap biases samples to month-end — see Data gaps.)

**Recognition / kudos**
- **Jack Hsu, #kudos, 2026-03-25:** "Kudos @Nicole @Dillon (I think also @chau and @ben) on the smooth onboarding workflow… from zero to green PR was ~45 seconds… I was a bit shook." https://nrwl.slack.com/archives/C9C1MKPK5/p1774466442331609
  - Her reply (2026-03-26) redirects credit: "Chau gets a lot of the credit for building the one page onboarding for Github and Gitlab."
- Repeated thanks in-window from Rareș Matei (#application 2026-04-28, 2026-07-10 "thanks Nicole :clap:", #nx-cloud-team 2026-07-24, 2026-07-30), Jack (#quark-a-task-force 2026-05-13, 2026-05-20, 2026-06-22; #grafana-irm 2026-05-04), Craigory (#nxians-status 2026-06-01), Thomas Kuehne (2026-04-13). (Search: `thanks Nicole after:2026-01-31 before:2026-08-01`.)

**Launch / impact messages**
- **Demo live** — #quark-a-task-force 2026-06-16: dashboard link, DAU/MAU prediction, entry points; 29-reply thread. https://nrwl.slack.com/archives/C0AHYCQUM39/p1781628067817749
- **Setup guide dashboard** — #nx-cloud-team 2026-07-21: "20-30 people engaging with it daily… 41% of users who see the setup banner click on it, higher than I expected." https://nrwl.slack.com/archives/C0BJP0CTX6Z/p1784667113443889
- **Setup guide GA** — #nx-cloud-team 2026-07-31: "Remove setup guide feature flag/promote it to GA" (ocean PR #12677). https://nrwl.slack.com/archives/C0BJP0CTX6Z/p1785544631857289
- **Activation readout** — #quark-a-task-force 2026-07-31: activated-workspaces-in-first-week up for <5-project workspaces; remote cache/access control/resource usage activation boosted — with a correction minutes later scoping her own claim ("makes it sound like all the boosts are from the setup guide, which they are not"). https://nrwl.slack.com/archives/C0AHYCQUM39/p1785538321116039
- **GitLab one-page experiment live** — #onboarding 2026-03-24, crediting Chau's January work.

**Operational / incident-adjacent**
- **Release management** — #nx-cloud 2026-02-27: coordinated and shipped release 2602.26.5 to staging and production, checking with Louie/Rareș before cutting.
- **Customer change management (Cloudinary)** — #support / #ask-cloud-product / #dpes 2026-04-30: hunted down the right customer contacts, then deliberately held a config change until the customer could confirm — risk-aware handling of a production customer.
- **CVE remediation with help-seeking** — #nx-cloud-team 2026-07-30/31: OTel package update PR (ocean #12631) with explicit ask "it's a lot of the codebase I haven't touched before… could I get an assist from someone more familiar?", plus uuid (#12630) and yaml PRs; all merged by Jul 31.

**Helping others / product stewardship**
- #ask-cloud-product 2026-06-30: triaged Craigory's and Jason's flaky-task feedback into concrete tickets (deep linking — shipped as CLOUD-4667 on 7/29 — plus reframing definitions).
- #application 2026-02-26: debugged duplicate-run/CIPE caching report into two root causes and filed tickets.
- Data pulls for leadership: CNW funnel scripts + spreadsheet for Jack (2026-03-25); GH Enterprise/GitLab self-hosted usage stats for Victor (2026-05-28); Mongo aggregation for init-command analysis (2026-06-26).
- Heavy use of Linear-bot to convert channel chatter into tickets (multiple "@Linear ticket" messages Feb–Jun) — keeps the tracker honest.

---

## Notion

Her Notion user id: `af377395-aa57-4d9f-98ba-30db60f34598`.

**Docs authored in window (authorship inferred — AI search with created_by filter; verify before quoting):**
- **"2026 March - April"** (2026-02-11) — cycle planning doc covering manual onboarding flow migration and feature guides. https://app.notion.com/p/2e969f3c23878094a4a3da551f7d74ee
- **"2026 July - August"** (2026-07-20) — planning for onboarding survey ("about 5 questions, mostly multiple choice, answers determine…") matching CLOUD-4774. https://app.notion.com/p/39d69f3c238780b59458fcd13e605494
- **"Montreal - Enterprise Trial Discussion"** (2026-04-15) — enterprise trial flow + onboarding discussion, action items. https://app.notion.com/p/34369f3c238780a98f51eed7bcbe22d0

**Mentions in meeting notes:**
- **Quark-A Kickoff (2026-03-10):** named "CLI/App Onboarding Lead: Nicole Oliver." https://app.notion.com/p/31869f3c2387806392d3e17340e936e7
- **Quark-A weekly syncs (May 5, May 19, May 26, Jun 17, Jun 30, Jul 14):** continuous thread of her demo/guide/survey ownership; Jun 17 notes: "Nicole landed the demo feature; it is live in production" and "demo looks great… thanks for all the work and putting that out." https://app.notion.com/p/37a69f3c238780929bc9ee9b55e404ae , https://app.notion.com/p/38269f3c238780c7971be88d1b9a84fe
- **Jul 14 sync:** action items "set up PostHog onboarding/cancellation survey" (delivered Jul 28–30 as CLOUD-4774/4775) and "started an analysis of…". https://app.notion.com/p/39d69f3c238780b4aa42f67e98f24c26
- **Jun 30 sync:** "Nicole Oliver to clean up installation source categorization and share with Cory Henderson." https://app.notion.com/p/38f69f3c23878034a869f391cffa026f

---

## Collaboration evidence

- **Integrates others' work rather than rewriting it:** merged Ben's demo prototype and Dillon's route-gating/cookie work into one framework, explicitly cataloguing whose piece was whose (Feature demos updates 4/27 & 5/4; PRs ocean #11085, #11531).
- **Credit-sharing is habitual:** Chau credited in #kudos reply and #onboarding launch post and in a Jan status update ("thanks for laying a great foundation!"); Ben/Dillon/Jack credited by name across status updates.
- **Cross-functional reach:** Cory Henderson (growth data, PLG stages — "thanks nicole… figure out how to better leverage the data", #quark-a-task-force 2026-06-26), Victor (VCS data requests, group DM 5/28–5/29 turning into CLOUD-4567), support/DPE (Cloudinary), marketing/design (framer experiments, CTA changes with Ben, #onboarding 2026-05-28), docs (nx PR #35995 adding demo CTA to setup-ci page).
- **Asks for help visibly when out of depth** (OTel validation ask, #nx-cloud-team 7/30) and answers others' review requests quickly (#application, multiple).
- **Advocated for team health:** proposed pausing the blog migration so Ben could support activation work and "Ben could also use a break" (DM to Jack, 2026-02-27).

---

## Candidate growth areas (evidence-based)

1. **Schedule reliability on led projects.** Every multi-month project she led except the Get started redesign slipped its target at least once, several 3+ times (Feature demos, Workspace setup guide, One-page flow, 600-workspaces; OSS Credits currently past target). Communication about slippage was exemplary, but estimates were consistently optimistic — especially on integration-heavy work she herself called out ("the merge was more difficult than I expected"). Sources: Linear project date diffs in her own status updates.
2. **Concurrent-WIP management.** The setup guide sat "paused" for ~6 weeks (5 consecutive atRisk updates) while demos ran long; OSS Credits went quiet after Jun 16 while Quark-a spun up. She led 5+ overlapping projects in the window; sequencing or delegating (e.g., handing a project to Dillon/Ben) would convert her transparency about pauses into fewer pauses. Sources: setup-guide status updates 5/4–6/16; OSS Credits update log.
3. **Backend/Kotlin depth.** Self-identified: on the demo data-storage option, "the maintenance work would be in kotlin so our team would need to become a lot more familiar with the aggregator" (group DM 2026-03-25); on OTel, "a lot of the codebase I haven't touched before" (7/30). Her growth surface (analytics rollups, CLOUD-5050) points the same direction; deliberate backend investment would remove a dependency on others.
4. **Follow-through on stalled project hygiene.** Projects closed months after work ended (600-workspaces closed 7/20 vs Mar target; Feature demos closed 7/20 vs mid-June launch), and she noted herself she needed to "clean out any irrelevant tickets" (4/27). Minor, but it muddies portfolio reporting. Source: Linear project completedAt vs status-update content.

(Deliberately excluded: anything related to leave/health, per review rules.)

---

## Data gaps

- **GitHub PR-level data not collected.** nrwl/ocean is private and not attached to this session; PR counts/review activity (e.g., ocean #10166, #10908, #11085, #11531, #12474–#12678 referenced in Slack/Linear) are cited only via those secondary sources.
- **Slack sampling is biased.** The search API caps at ~20 results per query; month-bounded `from:` queries returned mostly month-end messages (Feb sample = Feb 26–27; Apr sample = Apr 30). Mid-month activity is underrepresented; volume cannot be inferred.
- **Notion authorship is inferred.** AI search results with the created_by filter included pages almost certainly not hers (e.g., "[ARCHIVED] Andrew Glidden - AE Enterprise Hub V1", "Day 5" offsite notes that list her as "Product Manager", likely a template artifact). Treat all "authored" claims as inferred until opened.
- **Quantified business outcomes are self-reported.** Conversion/activation numbers come from her status updates and PostHog dashboard links (not independently re-queried).
- **No calendar/email evidence** (not in scope of the three-source sweep).
- 25 canceled issues were not analyzed for cause (scope churn vs. duplicates).
