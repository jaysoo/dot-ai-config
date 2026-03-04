# 2026-03-02 Summary

## NXC-4020: Restore CNW Prompt Flow to v22.1.3

**Linear:** https://linear.app/nxdev/issue/NXC-4020/bring-back-nov-2025-cnw-user-flow
**Task plan:** `.ai/2026-03-02/tasks/cnw-revert-prompts-to-22.1.3.md`
**PR:** https://github.com/nrwl/nx/pull/34671

### What was done

Reverted the human-visible CNW (Create Nx Workspace) prompt flow to be identical to v22.1.3, undoing the Jan-Feb 2026 experiments (template prompt, "Try the full Nx platform?" wording, banner variants, deferred cloud connection). Preserved all agentic/NDJSON output, `--template` flag, telemetry, and error handling.

### Key changes

1. **prompts.ts**: Commented out interactive template prompt — `determineTemplate()` returns `'custom'` directly
2. **ab-testing.ts**: Restored `setupNxCloud` to v22.1.3 wording ("Would you like remote caching...?"), locked `getBannerVariant()` to `'0'` (plain text)
3. **create-nx-workspace.ts**: Simplified preset flow to v22.1.3: `determineNxCloud` → `determineIfGitHubWillBeUsed`, removed `cliNxCloudArgProvided` branching
4. **create-workspace.ts**: Major restructure — split preset and template flows completely. Preset flow passes actual `nxCloud` to `createEmptyWorkspace` (so `nxCloudId` IS set in nx.json), reads token, generates short URL. Fixed `accessToken=undefined` bug.
5. **nx-cloud.ts**: Restored `getNxCloudInfo` to v22.1.3 signature with `rawNxCloud` pattern for hiding URLs
6. **messages.ts**: Restored "Your remote cache is almost complete." title, removed github.com/new URLs

### Status

CI passed. PR #34671 ready for review.

---

## DOC-428: Review All CLI and Cloud Links

**Linear:** https://linear.app/nxdev/issue/DOC-428/review-all-cli-and-cloud-links
**Task plan:** `.ai/2026-03-02/tasks/DOC-428-review-cli-cloud-links.md`

### What was done

Full audit of every `https://nx.dev` link in the **nx** repo (~150 occurrences in source files) and **ocean** repo (~240 occurrences). Checked each unique URL with `curl`, cross-referenced against `21.nx.dev` and `20.nx.dev` for correct redirect targets, and verified all proposed targets return 200.

### Findings

- **10 URLs returning 404** (broken links in CLI output, graph UI, and cloud UI)
- **~80 URLs returning 301** (working but adding redirect latency)
- **~45 URLs returning 200** (working directly)
- **3 additional 404s** from broken redirect chains (discovered during investigation)
- **6 imprecise redirects** where specific pages existed but the wildcard caught them first (e.g., `/getting-started/editor-setup` → generic intro instead of the editor-setup page)
- **Generator bug**: `:slug*` wildcards weren't being converted to Netlify's `*`/`:splat` syntax, silently breaking ~20 wildcard redirect rules

### Changes made

1. **Deleted 4 files** (-2,248 lines): `redirect-rules.js`, `redirect-rules-docs-to-astro.js`, `redirect-rules.spec.js`, `generate-netlify-redirects.mjs` — `_redirects` is now the sole source of truth
2. **Updated `nx-dev/nx-dev/_redirects`**:
   - Fixed `:slug*` → `*`/`:splat` across all wildcard rules
   - Fixed ordering: specific `/getting-started/` rules now before the `/*` catch-all
   - Added 11 new redirect rules for 404 URLs
3. **Updated `astro-docs/netlify.toml`**: Added 3 redirects for `/docs/` path issues (typo, wrong path, trailing-s)

### Status

Changes ready for review. Not yet committed/pushed.

---

## February 2026 Cross-Functional Digest

**Task plan:** `.ai/2026-03-02/tasks/nx-digest-2026-02-crossfunctional.md`

### What was done

Generated the February 2026 monthly cross-functional update for the Nx platform, covering all four data sources: CLI GitHub releases (6 releases), Cloud public changelog (24 releases), cloud-infrastructure repo (~160 commits), and Linear (457 issues across 6 teams).

### Highlights

- Task Sandboxing shipped end-to-end (53 issues)
- Self-Healing CI exited experimental (34 issues)
- AI-Powered Development expanded (35 issues)
- Continuous Task Assignment entered testing (24 issues)
- Framer marketing site migration (44 pages)
- Detailed technical changelog companion document also generated

---

## CNW Changes Summary (Nov 2025 - Feb 2026)

**Task plan:** `.ai/2026-03-02/tasks/cnw-changes-nov-feb-summary.md`

Research document summarizing all CNW changes from Nov 2025 through Feb 2026, covering the template-based onboarding, A/B testing phases, cloud prompt experiments, agentic CNW, and telemetry improvements. Used as context for NXC-4020.
