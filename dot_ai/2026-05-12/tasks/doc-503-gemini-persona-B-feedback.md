# Priya's Feedback: Setting Up CI

*Adopted Persona: Priya (New Nx user, 2yrs exp, doesn't know Nx Cloud/CI basics)*

## 1. Vocabulary blocks
These are the words that stopped my flow because I haven't seen them in the "Intro" or "Installation" guides yet.

- **"Self-healing CI" (L4):** This sounds like magic or a marketing buzzword. Does CI break that often? How does it "heal"?
- **"Remote cache" (L102, L119):** I know my local cache is in `node_modules/.cache/nx`. Where is "remote"? Is it on my company's servers or yours? The guide says "stored centrally" (L120) but doesn't say where "center" is.
- **"Nx Cloud" (L102):** It appears here for the first time as a noun. I don't know if this is a feature I turn on in my terminal or a website I have to sign up for.
- **"Distributed task execution" (L102):** This sounds very complex. "Spread the remaining work across machines" (L116) helps a bit, but "distribution" feels like a DevOps term I'm not ready for.
- **"Content-hashed" (L119):** I know "caching" but I don't know the implementation detail of hashing. It makes me feel like I need to understand the math to use it.
- **"Matrix configuration" (L127):** I've seen `matrix` in some YAML files, but I don't know why maintaining it is bad or what the alternative is.
- **"Ephemeral machines" (L127):** This is definitely a "Google it" word. I just want to run my tests.
- **"Claim the workspace" (L151):** "Claim" sounds legally binding or permanent. What happens if I "claim" it and my boss wanted to?
- **"Orbs" (L214):** In the CircleCI tab. Is this an Nx thing or a CircleCI thing?
- **"fetch-depth: 0" (L182):** Why? What happens if I leave it at the default? The troubleshooting section (L279) explains it, but it's scary to see in the "Prerequisites" or first example without a "why" right there.

## 2. "Am I allowed / is this safe / does this cost money" questions
- **L151: "From the workspace root, run: `nx connect`"**
  - **Reaction:** Wait! I'm on a branch in my team's repo. If I run this, and it "opens a browser to claim the workspace," did I just take ownership of the company's code? Will it email my Lead? I need a warning here: *"It's safe to run this on a fork or a local branch; nothing is permanent until you merge the PR."*
- **L134: "...where minutes are going - instead of scrolling raw logs."**
  - **Reaction:** "Minutes" usually implies "billing." Is this a paid service? I'm a junior dev; I don't have a company credit card. I need a clear sentence in the "What you get" section: *"Nx Cloud has a free tier for every workspace; you won't be charged for following this guide."*
- **L102: "Connect your Nx workspace to Nx Cloud"**
  - **Reaction:** What *is* Nx Cloud? Is it owned by the same people who made the Nx CLI? Is it a separate product? A "Definition before usage" sentence is missing: *"Nx Cloud is a companion service for Nx that provides the infrastructure for sharing cache and running tasks in parallel across machines."*

## 3. Skip-friendliness
- The "Distributing tasks with Nx Agents" section (L249) is way too loud. I just got my head around "remote cache." Seeing more shell commands and "agent pool sizes" makes me want to close the tab. 
- The Agents section should start with: **"Advanced: You can skip this until your CI takes longer than 5 minutes."**
- The "Access tokens and write access" (L266) feels essential but it's buried at the bottom. I'd rather know if I *need* this to get the 65% cache hit rate mentioned at L121.

## 4. The path from zero to a working CI
If I have no CI yet, I'm actually a bit lost despite the "Prerequisites" (L141).
1. I see code snippets for GitHub Actions (L179), but I don't know where to put them. I have to look at the comment `# .github/workflows/ci.yml` inside the code block to guess the file path.
2. The guide tells me to run `nx connect` first (L149), which "opens a PR." Does that PR create the `ci.yml` file for me? (No, L163 says "No workflow file changes are required").
3. So I have to manually create the file? I'd love a step: *"1. Create a file at `.github/workflows/ci.yml` and paste the following..."*
4. **Missing Step:** There's no mention of `git push`. If I'm "Setting up CI," I need to know when to push to see the "Dashboard" mentioned in L134.

## 5. The LLM copy prompt at the top
**L8-88:** This is a wall of text that looks like code but isn't. It's totally confusing. It mentions "Use `nx-cloud onboard connect-workspace` instead" (L13), which contradicts the actual guide text at L151 (`nx connect`). 
- **Reaction:** As Priya, I'm wondering "Did I land on a page for robots?" I actually tried to read it and it made me doubt the instructions below. This should definitely be hidden or moved to a "For AI Agents" section at the very bottom.

## 6. The Agents section (L249)
- It's marked "Optional" in the summary (L127), but the big H2 at L249 makes it feel like the "Next Step." 
- **Defend:** It should be moved to its own page. I'm already struggling with the concept of "Connecting" and "YAML files." Adding `--distribute-on="8 linux-medium-js"` (L256) is information overload. If it stays, it needs a clear "STOP: Only do this if..." gate.

## 7. The troubleshooting entries
- **L284: "Cache hits show 0% even after several runs"**
- **Reaction:** This is the most likely thing to happen to me. But the solution mentions "Read & Write scope" (L269). I don't even know what a "scope" is in this context. 
- **Rewrite:** 
  > **My CI says 'Cache Miss' every time**
  > By default, CI can only *read* from the cache. To save your CI results so the next run is faster, you need a "Write" token. Follow the [Access Tokens](#access-tokens-and-write-access) section to create a token and add it to your GitHub Secrets.

## 8. Score (1-10 each)
- **Friendliness to a new Nx user: 5/10.** (Assumes I know how to navigate a cloud dashboard and understand DevOps YAML).
- **"Did I learn what Nx Cloud is" by the time I left: 3/10.** (I know it's a website I "claim" things on, but I still don't know who owns it or if it's "Nx").
- **"Could I finish this in one sitting": 7/10.** (The YAML snippets are copy-pasteable, which is nice).
- **Risk that I close the tab confused: 8/10.** (The `llm_copy_prompt` and the "Agents" complexity are very high "bounce" risks).

## 9. The one change
Add a **"What is Nx Cloud?"** callout right under the H1 (L102) that says: 
> "Nx Cloud is a free-to-start service that hosts your remote cache and manages parallel machines. It is built by the same team as the Nx CLI. Running `nx connect` is the way you link your local code to your private dashboard on the cloud."

File path: /Users/jack/projects/dot-ai-config/dot_ai/2026-05-12/tasks/doc-503-gemini-persona-B-feedback.md