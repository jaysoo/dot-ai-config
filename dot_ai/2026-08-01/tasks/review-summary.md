# H1 2026 Review Summary: Sources, Exclusions, Confidence

Companion to review-drafts.md and commit-analysis.md. Full per-person evidence dossiers (with every permalink) are in `h1-2026-review-dossiers/` next to this file; they were compiled 2026-08-01 from Linear, Slack, Notion, GitHub search, and local git history of nrwl/nx and nrwl/ocean.

## Sources used per person

| Person | Linear | Slack | Notion | GitHub/git | Dossier |
|---|---|---|---|---|---|
| Craigory | 235 issues, 133 done in window; 11 led projects; 6 status updates | Feb-Jul month sweeps + kudos | 1:1 series, Agentic Migrations doc (inferred) | 127 nx commits, 137 merged PRs, 414 reviews | `craigory.md` |
| Caleb | 90 issues, 42 done; 1 active led project | month sweeps + kudos + customer channels | 3 docs (inferred) + meeting mentions | 47 nx / 19 ocean commits; 178 ocean reviews | `caleb.md` |
| Nicole | 147 issues, 89 done; 9 led projects; rich status updates | month sweeps + kudos + launch threads | planning docs (inferred), Quark-A syncs | 111 ocean commits, 111 merged PRs, 167 reviews | `nicole.md` |
| Ben | 243 issues, 177 done; Timeline + layout leads; 9 status updates | month sweeps + kudos | none authored (absence noted, low confidence) | 135 ocean commits, 136 merged PRs, 114 reviews | `ben.md` |
| Louie | 234 issues, 151 done; 4 led projects; 13 status updates | month sweeps + kudos + deploy threads | Quokka sync mentions; Linear docs | 180 ocean / 40 nx commits, 191 merged ocean PRs | `louie.md` |
| Heidi | 7 issues (expected near-zero) | month sweeps + kudos | primary source: GTM/messaging/microsite docs | none (expected) | `heidi.md` |
| Patrick | 133 issues, 104 done; 12 completed led projects; 15 status updates | incident/on-call threads + kudos | Podman writeup (confirmed his), 4 infra docs (inferred) | 24 ocean commits, 25 merged PRs, 47 reviews | `patrick.md` |
| Juri | 33 issues, ~19 done; no led projects | launch announcements + conf channels | webinar/meta-harness pages (inferred) | 26 nx / 16 ocean commits; public blogs/videos/sites | `juri.md` |
| Steve | 202 issues, 144 done; 14 led projects; 13 status updates | incident command + #askinfra + kudos | 9 design docs (inferred, infra hub) | 33 ocean commits, 33 merged PRs, 42 reviews | `steve.md` |
| Altan | 209 issues, 112 done; 6 completed led projects | incident + escalation + kudos (20+) | postmortem + exec/pricing docs (inferred) | 207 ocean commits, 221 merged PRs, **510 reviews** | `altan.md` |
| Jason | 212 issues, 143 done; 12 led projects; 1 status update | release train + security + JVM threads | v23 changelog (inferred), sync mentions | 387 nx commits, 393 merged PRs, **553 reviews** | `jason.md` |

## Key links (the load-bearing ones)

- Craigory: NXC-4679 (command injection fix), NXC-4565/4566 (target-defaults redesign), Extending Target Defaults project (2-month slip), Run TUI project (closed Feb 16).
- Caleb: CS-244 (workspace data API), DOC-365 (IA reorg), Content and Structure Improvements project (Feb 27 target, still open), ClickUp credit analysis thread (Apr 24).
- Nicole: One-page flow project + her May 4 metrics update (30% vs 20%), CLOUD-4708/ocean #12677 (setup guide GA), my Mar 25 #kudos post.
- Ben: ocean #11423 (Timeline ship), CLOUD-4549 (shared data model), Nicole's Jul 10 #kudos, Framer migration kudos thread (Feb 27-28).
- Louie: Q-437 (resource-usage billing), NXC-4461 + Q-331 (gradle cache correctness), Jun 1 vitest CI unblock thread, Jul 30 EU hotfix thread.
- Heidi: Polygraph Product Messaging Doc, Early Access Microsite ("Owner: Heidi"), Apr 30 pricing-page ship thread (41 replies), VOC doc (Jul 29).
- Patrick: Multi-Replica project, INF-1452 (capability routing), May 27 saturation thread (his own alerting quote), Jul 29 npm-cache cost thread.
- Juri: release blogs (nx.dev/blog/nx-22-7-release, nx-23-release, nx-23-1-release), monorepo.tools conf site, metaharness.tools, ocean #12097 (his own Polygraph fix).
- Steve: Multi-Cluster project (completed ahead of target), Feb pentest channel kickoff message, node-ipc advisory (May 15), Dedicated Compute Summary doc (pricing builds on it).
- Altan: Q-197 (continuous assignment), Q-459/467/490 (hang cluster), Tekion internal + customer threads (Jul 31), ClickUp postmortem doc (Jun 11).
- Jason: Nx 23 checklist thread (Jun 5, 43 replies), hold-the-release call (Jun 15), NXC-4593 + GHSA-vp3h-ghgh-jr7g, deprecation-sweep status update (Apr 20), his Jul 9 release-toil DM.

All permalinks are in the per-person dossiers.

## What was excluded and why

- **Anything from 1:1 notes or dictations in this repo.** Used only for role orientation (who leads what team); no review text cites them.
- **Leave, health, sick days.** Instructed exclusion; agents were told not to collect it. One dossier's month-by-month dips (Altan's June) is deliberately left unexplained rather than attributed.
- **nrwl/cloud-infrastructure evidence.** Repo not accessible this session. This mostly affects Steve and Patrick; their commit/PR numbers are floors and I said so in the drafts. January data suggests Steve had ~40 cloud-infrastructure PRs in a comparable window.
- **Group DM content.** Real but not citable; where a public proxy existed (e.g. my #kudos post covering the same work) the drafts cite that instead.
- **Slack items with no permalink.** Month sweeps return a capped, month-end-skewed sample in "concise" format; claims that only exist as channel+date are either omitted from drafts or kept with the dossier noting the retrieval path.
- **Notion authorship claims that couldn't be corroborated.** The created-by filter is unreliable; everything is marked "inferred" in dossiers except Heidi's microsite doc ("Owner: Heidi"), her VOC doc (announced as hers in #docs), and Patrick's Podman writeup (linked from his own status update). Ben's "no docs authored" is an absence claim and low confidence.
- **Reverts as quality signals.** All 34 formal reverts across both repos were resolved; none evidences a quality pattern for any reviewee (see commit-analysis.md), so none appears as a critique.
- **Pylon support volume, on-call rotas, YouTube/SEO analytics, email/calendar.** Not queried or not queryable; noted per-dossier.

## Where rating calibration is least confident

I don't know the leveling ladder, so every rating is calibrated against "what I'd expect from the role as I understand it," not against a rubric. Ranked by uncertainty:

1. **Heidi (Above level).** I'm rating a Director of Product Marketing on engineering-adjacent evidence. The ownership and craft evidence is strong, but her function's ladder may weight pipeline/revenue outcomes I didn't measure (campaign CTRs, PH final rank, conf attendance were all unretrievable).
2. **Juri (At level).** Closest call in the batch. Output and initiative say Above; the missing post-launch measurement loop is what held me, and at a senior DevRel level that may or may not be the bar. Flip to Above if the ladder emphasizes production over instrumentation.
3. **Caleb (At level).** If his level is "senior IC who also does DPE work," he's arguably Above on breadth alone. The docs-project stewardship gap is the counterweight. Depends heavily on whether project leadership is in his level expectations.
4. **Patrick (At level).** The missing repo cuts both ways: his real output is certainly higher than what I can see, but I also can't inspect the quality of the IaC work. If the infra ladder treats "12 completed projects + a third interrupt load" as exceeding, move him up.
5. **The three Above-level manager reviews (Steve, Altan, Jason)** are high confidence on evidence, but all three share the same soft spot (status/health signaling), and if the ladder treats communication cadence as a gating criterion at lead level, the ratings need a second look.

## Verify by hand before submitting

1. **Nicole's funnel numbers** (30%/20%, 75%/42%, 41% CTR, doubled GitLab claim rate) are self-reported in her status updates with PostHog dashboards linked. Spot-check one dashboard before quoting numbers in a form of record.
2. **Heidi's "Owner: Heidi" microsite doc and the GTM plan authorship.** I inferred she authored the GTM plan; the microsite doc names her. Open both before submitting.
3. **Altan's 510 / Jason's 553 review counts** use GitHub search `reviewed-by` with PR `updated:` window, which overcounts slightly (PRs reviewed before Feb but updated in-window). Directionally solid, but say "roughly" if quoting.
4. **Steve's Jul 31 tone example** (Q3): reread the thread yourself before deciding whether to keep it in the form; it's accurate but it's the single most sensitive line in the drafts.
5. **Craigory's "Above" vs Jason's release dependence**: Craigory declined to run the powerpack release in February ("don't really want to be responsible for that"); I left it out of his Q3 as a one-off, but if release bus-factor is a theme you care about, it belongs in his review too.
6. **Juri's blog/video list** was partly confirmed by WebSearch; the agent-sessions post URL (NXA-2103) was not confirmed. Check nx.dev/blog before citing the exact title.
7. **The Jan review file used a different form** (6 questions, different scale: Strongly Exceeds/Exceeds/Meets). Don't reuse January ratings as anchors; the scales don't map 1:1.
8. **Slack under-sampling of Feb-Apr** (documented in every dossier): if anyone's review reads thin on early-window evidence, that's a sampling artifact, not absence of work. Compensated with Linear, which is complete.

## Gaps in this run (for next cycle)

- Attach cloud-infrastructure to the session (or export its git log beforehand) for Steve/Patrick.
- Slack: run per-week bounded queries for Feb-Apr next time; per-month hits the 20-result cap on every busy person.
- Pylon volume would materially strengthen Caleb's and Altan's support-load claims.
- No peer-360 input was collected (out of scope); the manager reviews would benefit from a quick ask to Louie/Chau/Jon on Altan's coaching, and to the CLI team on Jason's.
