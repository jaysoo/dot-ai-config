# Summary - 2026-08-06

## Credit usage report: billing records, org rollup, licensed allowance - MERGED lighthouse #83

PR https://github.com/nrwl/lighthouse/pull/83 merged as `00e7369`. Plan:
`dot_ai/2026-08-06/tasks/credit-usage-report-billing-records.md`. Follow-up to CLOUD-4878
(already Done since 2026-07-30) with no ticket of its own - driven by Slack with Miro and
Altan.

Polygraph session `credit-usage-lighthouse-follow-up-405aebca` - nrwl/lighthouse +
nrwl/ocean -
https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/credit-usage-lighthouse-follow-up-405aebca

- **Data source switched to `billing.billingRecords`.** Altan: `workspaceCreditUsage` is a
  daily month-to-date snapshot that can miss the last minutes of a month, so it is not the
  source of truth for a whole-month invoice figure. New `billing_record_snapshots` table,
  projecting Mongo query, and a collector on the daily portal refresh scoped to the current
  month plus two prior full months (usage invoicing starts 2026-08-15). Records already exist
  in Mongo for past periods, so one run backfills the window.
- **Report is one row per org per billing month** with Credits Consumed, Remaining and Total
  against the licensed allowance, plus Execution Count read from the record rather than
  derived from credits / 500. Granularity and grouping toggles and the whole workspace
  dimension were removed once invoicing only needed org-months. Allowance now comes from the
  `planLimits` embedded on each record, so a month keeps the denominator it had at the time.
- **Portal boundary-week bug fixed.** Weekly credit figures double-counted an ISO week
  straddling a billing month, adding two months' running totals together (Celonis week 27 read
  4.5M between week 26's 3.9M and week 28's 1.2M). Differenced per billing month first, then
  merged.
- **Org is now the primary lookup.** A shared-instance customer is an org, not a tenant -
  PayFit is org `PayFit` on tenant `ProdNA`, which is why it looked missing from the report.
  Findable by its own name now.
- **Execution credits verified to count against the allowance** across five ocean sites, and
  nonzero on 53.7% of production NA usage docs, so the portal's long-standing exclusion is
  wrong and not harmless. Kept excluded in both surfaces by Jack's decision so they agree;
  `BillingRecords.credits_against_allowance/1` is the single flip point. Pending sync with Joe.
- Other verified findings: `additionalCredits` is a grant not overage (empty across prod NA);
  `runCount` is cache-enabled Nx runs including local, not CIPEs; no `executionCount` on
  `workspaceCreditUsage` (2000-doc key census) - it is on `MBillingRecord`; `aiCredits` absent
  on ~60% of docs and one collector path stored NULL where the other stored 0 (fixed);
  lighthouse collects 4 of 9 charged credit fields.
- Process: two Polygraph delegations to ocean deadlocked on permission gates (~200k subagent
  tokens, no result); Jack's own permissioned agent answered five questions in one pass. The
  `billingRecords` schema turned out to be discoverable from lighthouse's own pre-existing
  catalog query module. Final pass removed 537 lines of code left dead by the switch and
  trimmed seven over-long or stale comments.

Removed from Active Claude Sessions: `/Users/jack/projects/lighthouse`
(`feature/cloud-4878-usage-charges`) - CLOUD-4878 Done since 2026-07-30 and this follow-up
merged today.

## DOC-573 Monorepo CI best practices KB page - MERGED nx #36593

PR https://github.com/nrwl/nx/pull/36593 merged as `7dd949e953`. Plan:
`dot_ai/2026-08-05/tasks/doc-573-monorepo-ci-best-practices.md`. SEO play against Buildkite's
#1 result for "monorepo CI best practices".

Polygraph session `vivid-moose-c9937bd5` - single repo nrwl/nx -
https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/vivid-moose-c9937bd5

- New page at `/docs/kb/monorepo-ci-best-practices`, ~3000 words, ordered by payoff rather than
  by feature: understand CI waste, selective runs, base commit selection, task caching, cores
  per machine, distribution, task splitting, flaky handling, trunk-based development, keeping
  the main branch green, ownership and boundaries. Path-based filtering and graph-based
  affected each get a full GitHub Actions workflow so the contrast is visible in one page.
- Also documented `projectsAffectedByDependencyUpdates` in the `nx.json` reference under a new
  `pluginsConfig` section. It previously existed only on the affected feature page.
- **The agent prompt was live-tested twice** against a throwaway 10-package pnpm monorepo. v1
  asked for wall-clock time, queue time and serial-wait share, none of which a repository can
  answer, so it invited invented numbers. Rewritten so every check resolves to `Present`,
  `Absent` or `Needs CI access`, with run-history metrics moved to an explicit hand-off list
  for the user. v2 returned `Needs CI access` for cache hit rate and called branch lifetime
  underivable from a single-commit repo instead of guessing. First test was contaminated by a
  harness instruction to decline unanswerable steps; the second was not.
- Accuracy corrections caught in review: the lockfile row overstated what graph-based detection
  does by default (Nx marks everything affected unless `auto` is set); cached results were
  wrongly described as anchored to the branch rather than to task inputs; file-level splitting
  needed its Nx Cloud plus plugin prerequisite stated; "CI runners are ephemeral" narrowed to
  hosted runners; "graph derived from imports" widened to source, since manifests feed it too.
- Caleb reviewed with five inline nits, all addressed. His catch that the base-commit snippet
  was not valid GitHub Actions syntax was correct, replaced with a complete workflow using
  `{% meta="{10-12}" %}` highlighting. The numbering convention (the filename comment counts as
  line 1) was verified against `cypress/introduction.mdoc` rather than assumed.
- **Messaging change worth remembering:** Nx CLI and Nx Cloud may now be named as separate
  things, and features that require Nx Cloud should say so. This supersedes the DOC-549 "one
  platform Nx" rule and is recorded in the memory file.

## KB index broke on uncommitted articles - MERGED nx #36588

PR https://github.com/nrwl/nx/pull/36588 merged as `e056ef6320`. Split out of DOC-573 so it
could land on its own. `getKnowledgeBaseArticles` dates every article; the batched `git log`
added in #36461 returns no entry for an uncommitted file, and the starlight fallback
`getNewestCommitDate` throws rather than returning a date. One untracked draft 500s `/docs/kb`
and fails `astro-docs:validate-links`. Now falls back to the current date, so only the
uncommitted path changes.

## STYLE_GUIDE: three new anti-AI rules

Shipped inside the #36593 merge. Reviewing the DOC-573 draft surfaced AI-voice patterns the
guide did not cover: rhetorical-question setups, significance clauses ("X is quiet, which is
what makes it expensive"), and invented specifics that are really the reader's call (branch
lifetimes). Three existing rules sharpened: drama-beat echoes now covers both orders, not just
long-then-short; colon-expansion says to use real bullets when the tail is a list; and inflated
nouns ("fleet" of machines) joined the vocabulary watch list.

## DOC-579 Getting-started cleanup: intro, Start a New Project, Add to Existing - MERGED nx #36595

PR https://github.com/nrwl/nx/pull/36595 merged as `130727796c`. Plan:
`dot_ai/2026-08-06/tasks/doc-579-getting-started-cleanup.md`.

Polygraph session `noble-osprey-dd3ebfa3` - single repo nrwl/nx -
https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/noble-osprey-dd3ebfa3

- **"Start a New Project" is CNW only.** The "Option 2: Create via Nx Cloud" section and its
  screenshot are gone. First-time users now pick create-nx-workspace or `nx init`; Cloud stays
  on the pages where it is the subject. The template section no longer lists the four prompt
  starters (users see them in the prompt) - it points at the gallery and shows
  `--template=nrwl/tanstack-start-template` for skipping ahead.
- **Both onboarding pages now share a shape:** copyable agent prompt at the top, one terminal
  block holding the command and its sample run, then matching `## Next steps` and
  `## Keep learning`. Editor setup was swapped out for AI integrations + CI setup. The
  existing-project page's "In-depth guides" section collapsed into one Next steps bullet.
- **The timings and both agent prompts came off the live cloud.nx.app/get-started page**
  before it goes away. The AI prompt sits behind a "Set up with an AI agent" modal with
  separate tabs for init and CNW, so it needed a click rather than a fetch. Its `nx connect` /
  `nx-cloud onboard connect-workspace` steps were dropped for the docs versions.
- **New `astro-docs/ec.config.mjs` Expressive Code plugin** backs the terminal blocks. A fence
  marked `{% meta="prompt=true" %}` gets its `$ ` prefixes stripped before shiki runs, so the
  command is highlighted like any other shell block; the prompt is re-added as a span and the
  remaining lines tagged `.is-output`, both muted via `global.css`; and the copy button hands
  over the commands alone, never the sample output. Opt-in rather than auto-detected, because
  `kb/root-level-scripts.mdoc` has a transcript whose `$ node ./generateDocsSite.js` is yarn
  echoing, not something to run.
- Six dead ends worth not repeating, all recorded in the task file: EC options cannot live in
  `astro.config.mjs` (the `<Code>` component on template pages needs them JSON-serializable);
  `ec.config.mjs` cannot import a `.ts` module - the failure is swallowed and the config
  silently becomes `{}`; hast normalizes `data-code` to `dataCode`; EC colors tokens via
  `span[style^='--']:not([class])`, so a class drops the color; `addStyles` from a render hook
  never reached the CSS bundle; and Markdoc rejects unregistered fence attributes, so the
  passthrough `meta` attribute is the way in.
- Also fixed two pre-existing dangling `intro#start-small-extend-as-you-grow` anchors in
  `kb/nx-and-angular.mdoc`.

## In flight (see task files)

- **Meta-harness / Polygraph keyword + prompt discovery** (`dot_ai/2026-08-06/tasks/metaharness-keyword-research.md`):
  multi-phase research run, outputs under that folder's `output/`.
