# H1 2026 Performance Evidence Dossier — Juri Strumpflohner

- **Window:** 2026-02-01 to 2026-07-31
- **Role context:** Sr. Director of Developer Experience (DevRel) — content, outreach, docs, videos, webinars, conference organization
- **Reviewer:** Jack Hsu (peer review)
- **Identifiers:** juri@nrwl.io | Slack `UQXH2ELN6` | Linear `44bdd77c-638d-4c25-91d0-4b78878af4f5` ("juri") | Notion `2a3e3669-5dc7-4ab6-aa16-8ce9b404680f` | GitHub `juristr`
- Expected-light code footprint confirmed by caller: ~26 nx commits, ~16 ocean commits in window (mostly docs). Slack/Notion/content output weighted accordingly.

## Summary

- **Owned the entire Nx release-content pipeline for H1:** wrote and shipped the Nx 22.7 (Apr 28), Nx 23 (Jun 17), and Nx 23.1 (Jul 15) release blog posts each with an accompanying YouTube video and full social rollout (X/LinkedIn/Bsky), plus feature launches (AI agent skills Feb 12, Self-Healing CI video Mar 19, Agentic Nx Import Apr 30). Sources: Slack permalinks below; nx.dev/blog.
- **Built and shipped two standalone marketing properties:** the AI ❤️ Monorepos Conf website on monorepo.tools (live May 30, conf held Jun 23 — Polygraph launch vehicle) and metaharness.tools (live Jul 10), doing design, code, PRs, promo animations, and speaker pages himself.
- **Conference/webinar organization:** core organizer of the AI ❤️ Monorepos Conf (speaker outreach emails, registration/Tito flow, promo assets, agenda input), recruited Nicolas (Payfit) as customer speaker, drove the Polygraph Product Hunt launch outreach (Jun 25), and prepped the Aug 5 "Why Everyone Is Building a Meta-Harness Right Now" webinar (he is the named speaker).
- **~19 Linear content/DevRel issues completed in window** (RedPanda/Docs teams), including 4 blog posts, 3+ videos, metaharness.tools build, demo org for Polygraph, and docs updates — plus active dogfooding of Polygraph with high-quality bug reports (Loom + repro + fix PR).
- **Collaboration is broad and responsive:** works daily with marketing (Heidi, #dev-marketing), engineering (#red-panda), sales (#sales), and leadership group DMs; received unsolicited kudos from Rareș Matei and Heidi.

## Slack highlights (permalinks)

### Launches & announcements (author/owner)
| Date | Item | Evidence |
|---|---|---|
| 2026-02-12 | **Nx AI agent skills launch** — video + blog `nx.dev/blog/nx-ai-agent-skills`, announced in #dev-marketing and #general ("We just launched our Nx AI agent skills") | [announce](https://nrwl.slack.com/archives/C01AQTFNYLX/p1770913835386899), [blog link](https://nrwl.slack.com/archives/C01AQTFNYLX/p1770913889236589), [#general](https://nrwl.slack.com/archives/C3B4VLQ30/p1770920097987439) |
| 2026-03-02 | Shipped monorepo.tools/ai **animations**; plan to reuse as short video clips with voiceover (teased in #dev-marketing Feb 27) | [permalink](https://nrwl.slack.com/archives/C01AQTFNYLX/p1772443294856149) |
| 2026-03-19 | **New Self-Healing CI video** (`youtu.be/aQUlsilNSQ8`) + docs/blog embed PR; also announced to #sales for their use | [#dev-marketing](https://nrwl.slack.com/archives/C01AQTFNYLX/p1773951534648539), [#sales](https://nrwl.slack.com/archives/C05R3M1NGH3/p1773939865867249) |
| 2026-04-28 | **Nx 22.7 blog post + video** out (blog, YouTube `1WBToDwdbGc`, X, LinkedIn) | [permalink](https://nrwl.slack.com/archives/C01AQTFNYLX/p1777401188493249) |
| 2026-04-30 | **Agentic Nx Import blog + YouTube video** shipped (`nx.dev/blog/agentic-nx-import` + socials) | [permalink](https://nrwl.slack.com/archives/C01AQTFNYLX/p1777559949239329) |
| 2026-06-17 | **Nx 23 release blog + video** ("Pulled the trigger on the Nx 23 content") — he wrote the post himself, incl. re-including a sandboxing section for enterprise messaging (Jun 5) | [launch](https://nrwl.slack.com/archives/C01AQTFNYLX/p1781706443718029), [writing the post](https://nrwl.slack.com/archives/C01AQTFNYLX/p1780661151750839) |
| 2026-07-15 | **Nx 23.1 blog + video + socials** ("3 2 1 - the Nx 23.1 blog, video, tweets are out!!") | [permalink](https://nrwl.slack.com/archives/C01AQTFNYLX/p1784129147199799) |
| 2026-07-10 | **metaharness.tools live** — "our monorepo.tools sibling site" (announced in #general) | [permalink](https://nrwl.slack.com/archives/C3B4VLQ30/p1783672335464059) |
| 2026-07-30 | Authored X article from personal account driving Nx narrative, coordinated team resharing in #reply-guys | [permalink](https://nrwl.slack.com/archives/C0BEF62A52A/p1785151006491339) (Jul 27 share ask), Jul 30 msgs in #reply-guys (month scan) |

### AI ❤️ Monorepos Conf (Jun 23) — organizer/builder role
- Built the conf site on monorepo.tools; conf website live May 30: "conf website is live: https://monorepo.tools/" (#tmp-monorepo-ai-conf-june-26, 2026-05-30, month scan) and iterated registration UX + per-speaker URLs with Tito params (2026-05-30, Loom walkthrough, month scan).
- Sent speakers promo emails with custom speaker URLs, coordinated UTM tagging with Heidi: [permalink](https://nrwl.slack.com/archives/C0B3H4B73V3/p1780941584559779) (2026-06-08).
- External speaker amplification landed — "Kent already posted": [permalink](https://nrwl.slack.com/archives/C0B3H4B73V3/p1780952813798059).
- Produced promo animation ("been punching an agent on the side… sharing this tomorrow", published as YT short): [teaser](https://nrwl.slack.com/archives/C0B3H4B73V3/p1781641698596839), [publish](https://nrwl.slack.com/archives/C0B3H4B73V3/p1781870509408049).
- Site PRs he authored/pushed: monorepo.tools [#122](https://github.com/nrwl/monorepo.tools/pull/122) ([ask for approval](https://nrwl.slack.com/archives/C0B3H4B73V3), 2026-05-31 month scan), [#135](https://nrwl.slack.com/archives/C0B3H4B73V3/p1780956366886969), [#136](https://nrwl.slack.com/archives/C0B3H4B73V3/p1781041027968749).
- Polygraph **Product Hunt launch push (Jun 25)**: personally emailed all Nx Champions, ran an outreach list (Kwinten Pisman, Nathan Walker, Wassim Chegham, Dominik/Tanstack, Hladky), pulled in Shai Reznik for amplification, and advised on PH algo rules (#general + #dev-marketing, 2026-06-25 month scan).

### Webinars
- 2026-04-30: drafted webinar abstract "Building an Autonomous Software Factory: The Primitives Agents Need to Ship" and handed to Heidi (#team-devrel-content-marketing, month scan; Notion link in message).
- 2026-03-31: recruited **Nicolas (Payfit)** for a customer webinar (#team-devrel-content-marketing, month scan).
- 2026-07-27: explained webinar-as-SEO strategy for metaharness.tools ("the whole reason why we did schedule the webinar is to get some of the Nx.dev juice"): [permalink](https://nrwl.slack.com/archives/C01AQTFNYLX/p1785173645415379).
- 2026-07-29/31: prepping the Aug 5 meta-harness webinar as main priority: [DM](https://nrwl.slack.com/archives/DSJPY4KK9/p1785319296463789), [#nxians-status](https://nrwl.slack.com/archives/C01CAVA246P/p1785484800147489).
- Attended WeAreDevelopers conf Berlin, July 2026 (#tmp-wad-conf-berlin-2026): [permalink](https://nrwl.slack.com/archives/C0B7RNF38N7/p1783581288676949).

### Product feedback / dogfooding (Polygraph)
- 2026-06-25: found a critical session-teardown bug (tmux panes recreating), reported with Loom, then **shipped the fix himself**: PR [nrwl/ocean#12097](https://github.com/nrwl/ocean/pull/12097) + Polygraph session + Loom (#red-panda, month scan; "Ok this fix seems to work, but plz test in detail").
- 2026-05-29/30: repeated detailed UX bug reports on session/PR sync in #red-panda; "Polygraph creates and pushes the PR, self-healing fixes it :nail_care:" (month scan) — dogfooding the flagship demo loop.
- 2026-05-29: PR [nrwl/ocean#11522](https://github.com/nrwl/ocean/pull/11522) (#red-panda, month scan).
- 2026-07-30: flagged Polygraph SEO gap proactively in #dev-marketing (month scan).

### Kudos / mentions
- Rareș Matei: "oh wow thanks Juri! I was so confused how to even get the card to appear!" — [permalink](https://nrwl.slack.com/archives/C3B4VLQ30/p1781702423495459) (2026-06-17).
- Heidi: "Thanks to Juri and Jack who filled out this form" — [permalink](https://nrwl.slack.com/archives/C3B4VLQ30/p1784164458053969) (2026-07-15).
- Juri crediting others (healthy collaboration signal): thanks to James Henry ([permalink](https://nrwl.slack.com/archives/C08BYTL8KNF/p1783429414145149)), Jack ([permalink](https://nrwl.slack.com/archives/C08BYTL8KNF/p1782310920944349)), Jack Butler ([permalink](https://nrwl.slack.com/archives/C01AQTFNYLX/p1782140110825419)).

## Notion

Notion user id: `2a3e3669-5dc7-4ab6-aa16-8ce9b404680f` (Juri Strumpflohner, juri@nrwl.io).

- **[Why Everyone Is Building a Meta-Harness Right Now](https://app.notion.com/p/3a369f3c238781ef8dc0f3b614424fe7)** (created ~2026-07-20; authorship **inferred** — returned under his created-by filter). Full webinar page for the Aug 5 webinar; "Speaker: Juri Strumpflohner". Well-structured abstract with the meta-harness thesis (manual→systematic, one harness→any harness, personal→organizational).
- **[The Meta-Harness: Scaling Agentic Development Beyond the CLI](https://app.notion.com/p/38769f3c2387806d93d2d09f8e9b98d4)** (2026-07-22; authorship **inferred**) — companion content doc for the meta-harness push.
- **[AI ❤️ Monorepos Conf](https://app.notion.com/p/35769f3c2387808f829be4ad8006b2f6)** (updated 2026-06-10, under Polygraph GTM Launch Plan) — mentions him twice: slated for the "Modern monorepos + AI" talk and "Juri can reach out" for the Nicolas (Payfit) customer talk; also "we already planned to have him do a dedicated webinar for June."
- **[Devrel Confs 2026 - Proposed Events](https://app.notion.com/p/2a869f3c23878085a2cec6a24878fbc6)** (2026-03-27; authorship **inferred**) — DevRel event strategy planning within window.
- **Building an Autonomous Software Factory** webinar abstract — Notion page he shared to Heidi on 2026-04-30 ([app.notion.com link in Slack message](https://app.notion.com/p/nxnrwl/Building-an-Autonomous-Software-Factory-The-Primitives-Agents-Need-to-Ship-35269f3c238781158f30c52be9fb9fd1), #team-devrel-content-marketing month scan).
- Mentioned in marketing coordination: Jack's Jul 24 catch-up notes record "Juri suggested folding [the brand guide] into the Polygraph site /brand" ([Slack ref](https://nrwl.slack.com/archives/DD4MRB5M2/p1784894988174259)).

## Linear

Assignee = juri@nrwl.io, updated in last 7 months: **33 issues returned; ~19 completed inside the window**, heavily Content-labeled (RedPanda team) plus Docs team items. No project lead roles; member of Polygraph Standalone, Self-Healing CI, and marketing-adjacent projects. **Zero project status updates authored** (get_status_updates returned empty).

Completed in window (selection, newest first):
- [NXA-2103](https://linear.app/nxdev/issue/NXA-2103/blog-post-agent-sessions-are-more-valuable-than-your-git-history) Blog post: Agent sessions are more valuable than your Git History (done Jul 30)
- [NXA-2105](https://linear.app/nxdev/issue/NXA-2105/video-agent-sessions-should-be-portable) Video: Agent sessions should be portable (done Jul 30)
- [DOC-561](https://linear.app/nxdev/issue/DOC-561/update-monorepo-tools-to-mention-nx-hermetic-builds) monorepo.tools hermetic builds update (done Jul 29; PR [monorepo.tools#151](https://github.com/nrwl/monorepo.tools/pull/151), review requested from Jack [DM permalink](https://nrwl.slack.com/archives/DSJPY4KK9/p1785326063075919))
- [NXA-2169](https://linear.app/nxdev/issue/NXA-2169/webinar-submit-webinar-abstract) Webinar abstract submitted (Jul 23)
- [NXA-2127](https://linear.app/nxdev/issue/NXA-2127/fix-codex-plugin-install-in-polygraph-config) Fix Codex plugin install in Polygraph config (Jul 20)
- [NXA-2068](https://linear.app/nxdev/issue/NXA-2068/build-metaharnesstools) Build metaharness.tools (Jul 13)
- [NXA-1848](https://linear.app/nxdev/issue/NXA-1848/new-tmux-panes-should-start-in-the-host-repo) Polygraph tmux fix (Jul 6)
- [NXA-1788](https://linear.app/nxdev/issue/NXA-1788/creating-manual-relationships-crashes-repository-graph) Polygraph bug (Jun 11)
- [DOC-514](https://linear.app/nxdev/issue/DOC-514/add-vite-mf-demo-example-to-docs) Vite MF demo docs (Jun 10)
- [NXA-1649](https://linear.app/nxdev/issue/NXA-1649/demo-steps-details) / [NXA-1522](https://linear.app/nxdev/issue/NXA-1522/create-a-demo-org-and-demo-steps) Polygraph demo org + demo steps (May 26–28)
- [NXA-1032](https://linear.app/nxdev/issue/NXA-1032/blog-post-on-agentic-importing) Blog post on agentic importing (Apr 30)
- [DOC-440](https://linear.app/nxdev/issue/DOC-440/merge-self-healing-auto-apply-video-pr-after-video-goes-live) Self-healing video docs PR (Mar 13)
- [NXA-1116](https://linear.app/nxdev/issue/NXA-1116/claude-code-worktrees-need-to-be-nxgit-ignored) (Mar 6)
- [NXA-981](https://linear.app/nxdev/issue/NXA-981/add-gifs-to-nx-ai-agents-config-to-showcase-value) GIFs for nx-ai-agents-config (Feb 16)
- [NXA-826](https://linear.app/nxdev/issue/NXA-826/create-launch-content-for-new-agent-configs-claude-plugin) Launch content for agent configs / Claude plugin (Feb 12)
- [NXA-907](https://linear.app/nxdev/issue/NXA-907/write-up-overview-of-current-onboarding-gaps-for-agents) Agent onboarding gaps write-up (Feb 5)
- [NXA-857](https://linear.app/nxdev/issue/NXA-857/write-a-post-covering-outer-ci-loop) Outer CI loop post (Feb 4)
- [NXA-825](https://linear.app/nxdev/issue/NXA-825/document-claude-plugin-other-agent-configs) Document Claude plugin / agent configs (Feb 3)

In progress at window close: [NXA-2146](https://linear.app/nxdev/issue/NXA-2146/webinar-why-everyone-is-building-a-meta-harness-right-now) (Aug 5 webinar), [NXA-2212](https://linear.app/nxdev/issue/NXA-2212/video-ephemeral-workspaces-for-ai-agents) (video), [NXA-2145](https://linear.app/nxdev/issue/NXA-2145/clipsanimations-of-polygraph-use-cases) (clips), [NXA-2213](https://linear.app/nxdev/issue/NXA-2213/herdr-multiplexer).

## Public content output (window, with URLs)

Blog posts (nx.dev, authored/shipped by Juri per Slack announcements):
- [Teach Your AI Agent How to Work in a Monorepo](https://nx.dev/blog/nx-ai-agent-skills) — Feb 12
- [Agentic Experience Is the New Developer Experience](https://nx.dev/blog/making-nx-agent-ready) — Mar 5 (per WebSearch)
- [Nx 22.7: Task Sandboxing, 7x Less Memory, Worktree-Aware Caching](https://nx.dev/blog/nx-22-7-release) — Apr 28
- [Making It Easier to Import Projects Into Your Monorepo (Agentic Nx Import)](https://nx.dev/blog/agentic-nx-import) — Apr 30
- [Nx 23 release](https://nx.dev/blog/nx-23-release) — Jun 17
- [Nx 23.1 release](https://nx.dev/blog/nx-23-1-release) — Jul 15
- Agent-sessions blog post (NXA-2103, done Jul 30; likely [nx.dev/blog/ai-agents-and-continuity](https://nx.dev/blog/ai-agents-and-continuity) family — exact URL unconfirmed)

YouTube videos (Nx channel): AI agent skills launch ([N3-PgLQK0uU](https://youtu.be/N3-PgLQK0uU), Feb 12), Self-Healing CI ([aQUlsilNSQ8](https://www.youtube.com/watch?v=aQUlsilNSQ8), Mar 19), Nx 22.7 ([1WBToDwdbGc](https://youtu.be/1WBToDwdbGc), Apr 28), Agentic Nx Import (Apr 30), Nx 23 ([XsbL0oweykk](https://www.youtube.com/watch?v=XsbL0oweykk), Jun 17), Nx 23.1 (Jul 15, embedded), agent-sessions portability video (NXA-2105, Jul 30; [-4PmA4O2qAQ](https://youtu.be/-4PmA4O2qAQ) shared in #reply-guys Jul 30), conf promo YT short (Jun 19).

Websites: [monorepo.tools/conf](https://monorepo.tools/) conference site (live May 30), [metaharness.tools](https://metaharness.tools/) (live Jul 10), monorepo.tools/ai animations (Feb–Mar), hermetic-builds category (Jul, PR #151).

## Collaboration evidence

- Daily cross-functional coordination with marketing (Heidi) on webinars, UTM/promo, Product Hunt strategy: [conf email coordination](https://nrwl.slack.com/archives/C0B3H4B73V3/p1780941584559779).
- Amplification discipline: every launch posted to #dev-marketing with reshare asks, and pushed to #sales when relevant ([Self-Healing video to sales](https://nrwl.slack.com/archives/C05R3M1NGH3/p1773939865867249)).
- Promoted teammates' content, not just his own ([sharing Altan's blog post](https://nrwl.slack.com/archives/C01AQTFNYLX/p1780688416711909), Jun 5).
- Engineering feedback loop: high-quality Polygraph bug reports (Loom + session link + PR) in #red-panda; participated in prettier/oxlint toolchain debates in leadership group DM (Mar 31, month scan; surfaced community demand signal for OXC toolchain).
- Community stewardship: Nx Champions email blast for the PH launch, Discord ownership succession chase (Apr 30 DM with Jack, month scan), personal-network speaker outreach for the conf.

## Candidate growth areas (evidence-based)

- **Linear visibility of DevRel work is thin relative to output.** No project status updates authored in the window (get_status_updates: empty), and long-lived items sit untouched (e.g. [NXA-1036](https://linear.app/nxdev/issue/NXA-1036/test-impl-and-create-some-content-around-nx-connect-agentic-mode) Todo since Feb; [NXA-2069](https://linear.app/nxdev/issue/NXA-2069/deploy-metaharnesstool) Todo since Jul 6 while the site actually shipped Jul 10). Much of the real output is only discoverable via Slack.
- **WIP juggling during event pushes.** Self-reported: "I need to wrap up my oxlint package. I have it waiting there to be tested since a week with all the conf stuff etc ongoing" (leadership group DM, 2026-03-31, month scan); webinar prep pushed into evening/weekend hours ahead of the Aug 5 webinar ([#nxians-status, Jul 31](https://nrwl.slack.com/archives/C01CAVA246P/p1785484800147489)). Suggests launch calendars could be load-balanced or delegated earlier.
- **Measurement/SEO follow-through after launches.** He himself flagged that Polygraph SEO wasn't being monitored post-launch (#dev-marketing, 2026-07-30, month scan) — a repeatable post-launch measurement checklist (SEO, video analytics) would close the loop on the strong publishing cadence; he's already moving this way (webinar-as-SEO strategy, [permalink](https://nrwl.slack.com/archives/C01AQTFNYLX/p1785173645415379)).
- **Bus-factor on community platforms.** Discord ownership was stuck on an unreachable former owner and needed chasing (DM with Jack, 2026-04-30, month scan); worth formalizing admin succession for the community properties he stewards.

## Data gaps

- **Slack search caps at ~20 results per query**, skewing month scans to end-of-month; targeted keyword searches partially compensated but early/mid-month activity is under-sampled. Some cited items come from concise month scans without individual permalinks (marked "month scan"); each has channel + date for retrieval.
- **Notion authorship is inferred** from the created-by filter; the API results did not expose explicit author fields, and the filter's enforcement by AI search is not guaranteed.
- **No YouTube/analytics data** (views, subscriber impact) and no Ahrefs pull — content reach is unquantified.
- **GitHub not deep-dived** per brief (caller supplied ~26 nx / ~16 ocean commits, mostly docs); monorepo.tools and nx-blog repo activity (PRs #122/#135/#136/#151, nx-blog#40) seen only via Slack references.
- Linear `list_issues` window is "updated in last 7 months," so a few items completed just before Feb 1 (e.g. NXA-825/857 completed Feb 3–4) sit at the window edge; counts treat completion date as the in-window criterion.
- Public-content list may be incomplete: livestream/podcast appearances and the exact URL of the agent-sessions blog post were not confirmable via WebSearch.
