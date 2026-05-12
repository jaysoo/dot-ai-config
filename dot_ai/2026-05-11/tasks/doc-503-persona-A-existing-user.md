# Persona A: Marcus - existing Nx + GitHub Actions user, indifferent to Nx Cloud

## Background

- Senior backend engineer, 4 years at a mid-sized fintech.
- Owns the CI for a ~30-service Node monorepo built on Nx since v15.
- Set up the GitHub Actions pipeline himself. It works. PR builds finish in ~12 min on a good day, ~25 min when affected sprawls.
- Has heard "Nx Cloud" in release notes but never clicked through. Mental model: "the paid SaaS upsell on top of Nx."
- Doesn't read marketing pages. Skims docs for the YAML, the env vars, and the gotchas.

## What he knows cold

- Nx affected, run-many, project graph, named inputs, target defaults.
- His own GitHub Actions workflow. Custom matrix sharding. Cache restoration with actions/cache.
- He has shaved his own seconds off CI. He's proud of it.

## What he doesn't believe yet

- That Nx Cloud is meaningfully different from "more aggressive remote cache I could configure with S3."
- That the cache hit numbers ("~65%") are real for his repo, not a marketing average.
- That distribution is worth the lift over the matrix config he already maintains.
- That his code and build artifacts don't leak somewhere if he opts in.
- That "free tier" actually covers a team his size.

## What he cares about (the things that will actually move him)

1. **Concrete, repo-shaped numbers.** "We saw 12 min -> 4 min on this real workspace" beats "65% hit rate".
2. **Honest opt-out path.** If we sell him the cache, he wants to know how to rip it out cleanly.
3. **Security/privacy boilerplate, but short.** What's stored, where, who can read it, what about source code.
4. **What it costs.** Including: when does it stop being free.
5. **What changes in his workflow file.** He doesn't want a rewrite. The "no workflow file changes are required for read-only cache and reporting" line is gold but buried.
6. **The Agents pitch needs to start with "you can skip this section" or he tunes out.**

## His skim path through the page (predict it)

1. Scrolls to the GitHub Actions YAML block first.
2. Diff-reads it against his own. Notes anything new (`nrwl/nx-set-shas`, `fetch-depth: 0`).
3. Bounces back up to find the smallest delta he could try. Hunts for "what does this cost / change."
4. If he can't answer "what's the smallest reversible change I can ship today" in 30 seconds, he closes the tab.

## Critical review brief - what to tell Gemini

Read the page at `/Users/jack/projects/nx-worktrees/DOC-503/astro-docs/src/content/docs/getting-started/setup-ci.mdoc` AS Marcus. You are not a doc reviewer; you are him. Then write feedback grouped under these headings, with line refs (`L47`, etc) where possible:

### 1. The opening moves: did the page hook me in 15 seconds?
Did the intro paragraph and "What you get" section give me a reason to keep reading? Quote the exact lines that worked. Quote the exact lines that read as marketing fluff and should be cut.

### 2. Proof and numbers
Where does the page back up its claims with something concrete? Where are the numbers I should trust vs the numbers that feel made up? What specific data would you want added (and where on the page)?

### 3. Reversibility / lock-in / cost / privacy
List every question I'd have about lock-in, cost (free tier limits), what's stored on Nx's servers, and how to remove Nx Cloud later - and whether the page answers each. For each unanswered question, suggest the shortest possible sentence the page could add.

### 4. The GitHub Actions snippet
Compare the snippet (L100-121) to what an experienced Nx user already has. What's new, what's a no-op for him, what's missing. Should `nx fix-ci` be in this snippet? Should the snippet show the Nx-Cloud-aware variant explicitly?

### 5. The Nx Agents section
Is the framing right for someone who already runs a hand-tuned matrix? Where does it fail to address "I already have distribution, why switch"? Is "Optional" prominent enough?

### 6. Order and length
Pretend you've read the page in 90 seconds. What would you cut? What would you re-order? Is the page in the right place in the docs at all?

### 7. Score (1-10 each, one line of why)
- Persuasiveness to me specifically
- Trustworthiness
- Density / no-fluff
- Likelihood I'd actually run `nx connect` today

### 8. The one change
If you could make ONE edit to this page to actually convert me, what is it - exact diff or new text.

Be blunt. Don't be diplomatic. Don't soften. If a sentence is empty calories, say so and quote it.
