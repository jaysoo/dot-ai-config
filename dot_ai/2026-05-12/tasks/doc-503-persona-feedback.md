# DOC-503: Compiled Persona Feedback

**Date:** 2026-05-12
**Page reviewed:** `/Users/jack/projects/nx-worktrees/DOC-503/astro-docs/src/content/docs/getting-started/setup-ci.mdoc` (227 lines, commit `199a979eaf`)
**Personas:** Marcus (existing Nx + GHA user, Nx Cloud skeptic), Priya (new Nx user, doesn't know Nx Cloud)
**Source reviews:**
- `doc-503-gemini-persona-A-feedback.md`
- `doc-503-gemini-persona-B-feedback.md`

**Caveat on line numbers in the Gemini reviews:** Gemini's workspace was scoped to `dot-ai-config`, so it could only read the persona briefs, not the page. It still landed on real content (every phrase it quotes is on the page), but its `L###` references are approximations. Line numbers in *this* file refer to the actual setup-ci.mdoc.

---

## Cross-cutting themes (where the personas agree)

Both reviews independently flagged the same set of weak spots. These are the highest-value changes.

| Theme | Marcus's lens | Priya's lens | Score |
|---|---|---|---|
| **Nx Cloud isn't defined** | "Is this just an upsell? What does it cost?" | "Is this a separate product? Who owns it? Free?" | 🔴 critical |
| **No reversibility / lock-in answer** | "How do I rip it out if it sucks?" | "Will my boss be mad if I run `nx connect`?" | 🔴 critical |
| **Agents section feels mandatory** | Buried "Optional" doesn't reach me | Loud H2 + agent pool jargon scares me | 🟠 high |
| **Access tokens are buried** | I need this for write-cache, why is it L197? | Wait, do I need this to get 65% cache hits? | 🟠 high |
| **`nx fix-ci` mentioned in LLM block but not the GHA snippet** | If it's standard, put it in the YAML | (didn't notice) | 🟡 medium |
| **GHA snippet doesn't show `NX_CLOUD_ACCESS_TOKEN`** | Have to hunt for env var name later | (didn't reach this depth) | 🟡 medium |
| **LLM copy prompt at the top is jarring** | (didn't flag) | "Did I land on a page for robots?" | 🟡 medium |
| **Numbers feel like marketing averages** | ~65%, ~30%→~70% need "this is from a real repo" framing | (didn't notice) | 🟢 nice-to-have |

---

## Persona A: Marcus (existing user) — key quotes

- **What works:** L45: "Connecting to Nx Cloud turns both on; the rest of this page is configuration." — "I'm here for the config, not a philosophy class."
- **Marketing fluff:** L53: "instead of scrolling raw logs" — "I know how to use a terminal."
- **Score:** Persuasiveness 4/10, Trustworthiness 6/10, Likelihood-to-run-nx-connect 3/10.
- **The one change he'd make:** Promote L81's "No workflow file changes are required for read-only cache and reporting" into a callout at the very top, paired with a one-line removal recipe.

## Persona B: Priya (new user) — key quotes

- **Vocabulary blocks:** "self-healing CI" (frontmatter description), "remote cache" vs local, "Nx Cloud" (first noun in flow), "content-hashed", "matrix configuration", "ephemeral machines", "orbs", "claim the workspace", "fetch-depth: 0", "Read & Write scope."
- **Permission anxiety:** L67 (`nx connect`) → "Wait, on my team's repo? Did I just take ownership?"
- **Cost anxiety:** "Minutes" in dashboard bullet (L53) reads as billable.
- **LLM block at top (L10-41):** "Wall of text that looks like code but isn't... contradicts the actual guide text below." Recommends moving to a "For AI Agents" footer.
- **Score:** Friendliness 5/10, "did I learn what Nx Cloud is" 3/10, Risk-of-bouncing 8/10.
- **The one change she'd make:** "What is Nx Cloud?" callout right under the H1.

---

## Ranked changes for the current `DOC-503` branch

Apply in this order. Each one is small. None of them require rewriting the page.

### 🔴 1. Add a one-line "What is Nx Cloud?" + free-tier framing right after the intro
Insert between L45 (current intro paragraph) and L47 (`## What you get`).

> Nx Cloud is the companion service built by the Nx team. It hosts the remote cache, schedules distribution, and is free to start for any workspace.

Solves both personas in one sentence: Priya gets a definition + cost reassurance, Marcus gets the "is this a separate product" question answered before he scrolls.

### 🔴 2. Add a reversibility one-liner near `nx connect`
Insert immediately after L81 (the "Merge the PR" sentence):

> To disconnect later, remove the `nxCloudId` line from `nx.json`. Your CI keeps working; it just stops sharing cache and reporting.

Directly addresses Marcus's exit-strategy concern. Honest and short.

### 🟠 3. Promote "Optional / Advanced" on the Agents H2
Change L179 from:
```
## Distributing tasks with Nx Agents
```
to:
```
## Distributing tasks with Nx Agents (optional, advanced)
```
And add a leading sentence:
> Skip this section until CI runs are longer than 5 minutes - everything above already gives you remote cache and reporting.

### 🟠 4. Move "Access tokens and write access" up, immediately after "Connect the workspace"
Both personas flagged that this is essential context (Marcus: "I won't bother if PRs don't populate cache for next run"; Priya: "Do I need this to get the 65% hit rate?"). Reorder so the page is: Intro → What you get → Prerequisites → Connect the workspace → Access tokens and write access → Constructing a CI workflow → Distributing tasks (optional) → Troubleshooting → Next steps.

### 🟡 5. Add `NX_CLOUD_ACCESS_TOKEN` as a commented-out env var in the GitHub Actions YAML
After L120 (`- run: npx nx run-many -t lint test build`), add:
```yaml
        env:
          # NX_CLOUD_ACCESS_TOKEN: ${{ secrets.NX_CLOUD_ACCESS_TOKEN }}  # uncomment for write-cache
```
Saves Marcus from hunting later; introduces the env var name where readers expect to see env vars.

### 🟡 6. Trim "Dashboard" bullet for terseness; reframe "Failure analysis"
L53 currently reads:
> **Dashboard.** Per-task timing, cache hits, slowest projects, owners, where minutes are going - instead of scrolling raw logs.

Suggested:
> **Dashboard.** Per-task timing, cache hits, slowest projects, ownership.

L52 "Failure analysis" - leave as-is (it's already terse and useful).

### 🟢 7. (Optional) Number-grounding caveat on the cache-hit / utilization figures
The "~65%" and "~30%→~70%" numbers would land better if attributed. Add a parenthetical: `(measured on Nx OSS and customer repos with 50+ projects)`. Or remove them. Currently they read as slide-deck numbers.

---

## What I would NOT change in the current branch (and why)

- **Keep the LLM copy prompt at the top.** Priya found it confusing, but DOC-503 explicitly asks for the agent-friendly hint at the top. It renders as a copy button in the actual page, not as raw text - Priya's "wall of text" complaint is a rendering misconception. Address by ensuring it renders correctly, not by moving it.
- **Don't add hand-picked benchmark numbers.** Marcus wants "12m → 4m" but we don't have a vetted real-customer figure to drop in. Leaving the existing numbers + adding a measurement-context parenthetical is safer.
- **Don't move Agents to a separate page.** Priya wants it gone; Marcus wants it visible. The "optional, advanced" framing + skip-cue resolves both.

---

## Variant branch plans

Take radical interpretations and ship them as separate branches so we can A/B / compare side-by-side.

### Variant A: `DOC-503-marcus` — for the skeptical existing user

**Frame:** "You already have CI. Here is the smallest reversible thing you can do." Page reads like a delta.

- Open with: "If you have Nx and a CI workflow already, connecting to Nx Cloud is one command and zero workflow changes. To remove it later, delete one line in `nx.json`."
- Drop "What you get" bullets entirely (or compress to one paragraph). Marcus doesn't need them; the reader who needs them is on Variant B.
- Lead with `nx connect` + the `nx.json` diff. Numbers come *after*, with a "what this looked like on customer repos" framing.
- Access tokens immediately after `nx connect`.
- Agents folded into a one-line "and if you want distribution, see the dedicated guide."
- No LLM copy prompt at top (or kept but minimized).
- Tone: dense, technical, "we won't waste your time."

### Variant B: `DOC-503-priya` — for the new user who's never heard of Nx Cloud

**Frame:** Teach, don't pitch. Every term defined inline. Linear story from "I have nothing" to "I see a CI run on the dashboard."

- Open with a **"What is Nx Cloud?"** callout: separate-but-companion product, free to start, built by the same team.
- New section: **"Before you start"** — explicit answers to: is this safe to run on my team's repo? does it cost anything? do I need to ask permission?
- Step-by-step walkthrough including: where to create `.github/workflows/ci.yml`, when to `git push`, where to look for the run.
- Every jargon term gets a one-sentence definition the first time it's used (or a link to a glossary).
- The Agents section is a **link only** to a separate "Advanced" guide. Page ends after troubleshooting.
- "Self-healing CI" in the frontmatter description removed or explained.
- Tone: warm, patient, explicit about what's optional.

Variant branch names finalized after compile review:
- `DOC-503-marcus` (Marcus-leaning, terse + delta-framed)
- `DOC-503-priya` (Priya-leaning, story + define-every-term)

---

## Next actions

1. Apply changes 1-6 above to the current `DOC-503` branch (one commit).
2. Branch `DOC-503-marcus` off the current `DOC-503` HEAD and rewrite per Variant A.
3. Branch `DOC-503-priya` off the same point and rewrite per Variant B.
4. Push all three; flag the 1Password SSH prompt to Jack each time.
5. Compare the three rendered pages and decide which to keep / merge ideas from.
