# Persona B: Priya - new Nx user, just learned the basics, doesn't know Nx Cloud

## Background

- Frontend engineer, ~2 years experience, joined a team that just adopted Nx.
- Spent the last week on the Nx Getting Started tutorials: she's done "Intro to Nx", "Installation", "Start a new project", "Crafting your workspace", and is partway through "Configuring tasks".
- Can confidently run `nx test myapp`, `nx build myapp`, `nx run-many -t lint`. Has poked at `project.json`.
- Has never written a GitHub Actions workflow from scratch. Has merged PRs that touched `.github/workflows` but doesn't fully read them.
- Today she clicked the next sidebar item: "Setting Up CI."

## What she knows

- Local commands are fast on the second run "because of caching" - she's seen "Nx read the output from the cache" in her terminal.
- Tasks and targets. Sort of inputs.
- The team uses GitHub. There's a CI but she didn't build it.

## What she does NOT know

- What "remote cache" is, vs the cache she sees locally.
- What "Nx Cloud" is. Is it the same product as Nx? A separate company? A subscription? Required?
- What `nx connect` actually does. The word "connect" is fuzzy.
- What `nxCloudId`, `NX_CLOUD_ACCESS_TOKEN`, `nrwl/nx-set-shas`, `fetch-depth: 0`, an "orb", "Nx Agents", "distribution", "ephemeral machines", "matrix configuration" mean.
- Whether she needs an Nx Cloud account before running any of this.
- Whether anything on this page costs money.
- What "agent pool sizes" are or why she'd pick `"8 linux-medium-js"`.

## What she cares about

1. **A story.** "Here's where you start, here's the smallest thing you can do, here's what changes."
2. **Permission to skip.** She's overwhelmed. She wants to know which sections are "do now" vs "come back later."
3. **Definitions before usage.** Don't drop a noun she has to Google.
4. **Reassurance.** Is this required? Is it free? Will my team be mad if I run `nx connect` on their workspace?
5. **A working starting example for her stack** (GitHub Actions).

## Her skim path through the page (predict it)

1. Reads the H1, reads the subtitle.
2. Reads "What you get". Gets the gist of "faster CI" but doesn't follow the agent/distribution stuff.
3. Sees "Connect the workspace" - thinks "OK I should run this command." Pauses: "wait, am I allowed to run this on my team's repo?"
4. Scrolls to the YAML, glazes over.
5. Bounces away from the Agents section because it doesn't apply to her.
6. Maybe lands on Troubleshooting if she tried something and it broke.

## Critical review brief - what to tell Gemini

Read the page at `/Users/jack/projects/nx-worktrees/DOC-503/astro-docs/src/content/docs/getting-started/setup-ci.mdoc` AS Priya. Don't be a doc reviewer; be her. Then write feedback grouped under these headings, with line refs (`L47`, etc):

### 1. Vocabulary blocks
List every term on the page that you don't already understand from the prior Getting Started tutorials. For each: should the page define it inline, link out, or restructure to avoid it? Quote the line where it first appears.

### 2. "Am I allowed / is this safe / does this cost money" questions
Every place the page assumes consent or context I don't have. Especially around `nx connect` opening a PR against my team's repo, and the existence of "Nx Cloud" as a separate product. Suggest exact sentences to add and where.

### 3. Skip-friendliness
Are the "skip this for now" cues clear enough? Which sections should be more loudly marked "advanced / come back later"? Which links pointing further into docs feel essential vs scary?

### 4. The path from zero to a working CI
Pretend I have NO `.github/workflows/ci.yml` yet. Walk through the page top to bottom and tell me at which point I'd know what file to create, where to put it, and what to commit. If the page doesn't get me there, name the missing step.

### 5. The LLM copy prompt at the top
Should I even see the `{% llm_copy_prompt %}` block? Does its presence at the top confuse Priya? Where does it actually render in the rendered page?

### 6. The Agents section
Is "Optional" clearly enough scoped? Should this whole section be moved later, hidden behind a disclosure, or moved to a separate page? Defend your answer.

### 7. The troubleshooting entries
For each entry, would Priya know that's the problem she has? Is the language too terse? Rewrite the worst one.

### 8. Score (1-10 each, one line of why)
- Friendliness to a new Nx user
- "Did I learn what Nx Cloud is" by the time I left
- "Could I finish this in one sitting"
- Risk that I close the tab confused

### 9. The one change
If you could make ONE edit to make this page click for a beginner, what is it - exact diff or new text.

Be honest. If a section made you bounce, say which line. Don't be polite.
