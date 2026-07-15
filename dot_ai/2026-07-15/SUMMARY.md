# Summary - 2026-07-15

## DOC-549: Refresh/create high-impact SEO pages - MERGED (PR #36307)

Polygraph session `doc-549-0ca12dc9` - nrwl/nx - https://snapshot.app.trypolygraph.com/orgs/69cdc268b6aa527e4129c2b4/sessions/doc-549-0ca12dc9

GSC-driven refresh spanning 2026-07-11 -> 07-15 (~30 commits, squash-merged today, CI green). Started from the Linear plan (8 page groups), ran a multi-agent pipeline (4-lens SEO panel -> 8 drafting agents -> review round 1 with 117 findings -> fixes -> fresh-eyes round 2 + reader simulation), then ~2 days of live review iterations with Jack.

**Shipped:**

- `what-is-a-monorepo` (renamed from why-monorepos, redirects): definition-first, benefits aligned verbatim with monorepo.tools, monolith distinction, AI-agents summary of monorepo.tools/ai; FAQ + "wrong choice" sections cut per repeat/negativity feedback
- `monorepo-vs-polyrepo` (renamed from decisions/overview, redirects): tradeoffs table; corrected claims (release cadence is CI/CD choice not repo layout; single-version policy enforceable-but-optional; tooling-overhead row removed); Polygraph mentions x3 with meta-harness (metaharness.tools) + synthetic monorepo terms (Juri)
- pnpm/npm/yarn/bun workspace pages: standalone setup/commands/best-practices ("Tutorial" framing rejected), Nx arc restored at end (before/after tasks, targetDefaults w/ cache+dependsOn+continuous, Nx Cloud CI section)
- GitHub Actions integration (retitled from "GitHub Integration"): copy-pasteable no-Cloud GHA yaml (Node 24, checkout@v7, setup-node@v6), Cloud delta, real PR-bot screenshot, single get-started CTA; **deleted** the outdated source-control GitHub guide (title collision) with redirects
- ESLint flat-config: retitled "Migrate from .eslintrc to ESLint Flat Config"; agent llm_copy_prompt at top; convert automatically/manually as parallel sections; removed ts-eslint v8 rules encoded on-page (formatting rules, renames, ban-types split); ESLint v9 runtime changes section; Next.js native flat exports + circular-structure TypeError fix (all claims verified at source)
- MFE architecture: definition-first (microfrontend/MFE variants), v23 consumer/provider + @module-federation/vite examples, Angular = deprecated + native federation
- Rspack intro: real "what is Rspack" opening (fixes meaningless Google snippet)
- Self-hosted remote cache: retitled, 20.8 gate removed, Enterprise demoted to one line, standard Cloud CTA
- Folder structure: move/remove generators dropped (plain mv/rm), Acme Airlines
- TypeScript intro: merged features/maintain-typescript-monorepos into it (deleted + redirects); "TypeScript/JavaScript (TS/JS)" for js-monorepo queries
- 12 tech intros re-opened monorepo-first (plugin demoted to para 2): docker, esbuild, rollup, rsbuild, webpack, eslint, node, react, remix, vue, nuxt, gradle

**Shelved:** nx-vs-lerna comparison page (fully drafted, pulled pre-merge) - Jack rethinking positioning: compel existing Lerna users toward Nx, steer new users away; draft at `dot_ai/2026-07-11/tasks/nx-vs-lerna-draft-shelved.mdoc`

**Live-tested the flat-config page:** built an eslintrc fixture workspace (nx 23, eslint 9.39.5, ts-eslint 8.64) and had a fresh agent migrate it using only the page -> green lint. Two gaps found and patched on the page (only-throw-error needs typed linting; generator drops override parser). Two **generator bugs** to file (NXC): convert-to-flat-config drops `parser` from converted overrides; pins @eslint/eslintrc@^2 (v8-era) on ESLint 9. Fixture: session scratchpad `eslint-mig-test/fixture`.

**Follow-ups flagged (not filed yet):**

- NXC ticket: convert-to-flat-config generator bugs (above)
- NXC ticket: ci-workflow generator template still emits node 20 + checkout@v4 (docs now show 24/v7/v6); setup-ci.mdoc snippets also @v4
- "nx workspace" GSC anomaly: 855K impressions, pos 1.02, 0.04% CTR - needs own investigation
- FAQPage JSON-LD structured data (deferred)
- consumer-and-provider.mdoc still says Angular MF "no longer supported" (harsh wording; MFE page softened to deprecated)
- Docs sync note added (Upcoming Sync) to walk the team through the PR

## Other

- **Google organic traffic decline assessment** - started in a separate session, plan at `dot_ai/2026-07-15/tasks/google-search-traffic-decline-assessment.md` (in progress)
- Removed DOC-549 from Active Claude Sessions in TODO.md
