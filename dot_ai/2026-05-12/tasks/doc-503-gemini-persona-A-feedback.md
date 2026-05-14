# Persona A (Marcus) Feedback: Setting Up CI

### 1. The opening moves: did the page hook me in 15 seconds?
Intro is half-decent because it skips the "monorepo is hard" lecture. 
- **What worked:** L66: "Connecting to Nx Cloud turns both on; the rest of this page is configuration." I'm here for the config, not a philosophy class.
- **Marketing fluff to cut:** L79-80: "instead of scrolling raw logs." I know how to use a terminal. L71-80 in general feels like a pitch for a manager, not an engineer who already has a working pipeline.

### 2. Proof and numbers
The numbers feel like "marketing averages" pulled from a slide deck. 
- **The "meh" numbers:** L72: "~65%" cache hit rate. Meaningless without context. Is that for a 5-project repo or a 500-project one? L76: "utilization... rises from ~30% to ~70%." This sounds like it was measured on a perfectly optimized demo repo.
- **What I want:** I want to see: "For a workspace with 30+ services (similar to yours), we typically see p95 PR times drop from 15m to 4m." Put that right in the "Remote cache" bullet (L70).

### 3. Reversibility / lock-in / cost / privacy
This is where the page fails me. I'm looking for the exit strategy and the "gotchas."
- **Lock-in/Reversibility:** Not mentioned. **Sentence to add:** "To revert, simply remove the `nxCloudId` from `nx.json`; your workflow remains compatible with local-only Nx."
- **Cost:** L155 mentions "Self-hosted" but doesn't tell me when I start getting billed on the cloud version. **Sentence to add:** "Free for open source and small teams; see pricing for usage limits on the Pro plan."
- **Privacy:** Nothing. **Sentence to add:** "Nx Cloud stores task metadata and artifacts; source code never leaves your infrastructure."

### 4. The GitHub Actions snippet
The snippet (L104-121) is standard.
- **New/Useful:** `nrwl/nx-set-shas@v4` is a good reminder for the base/head logic I usually have to manually pipe in.
- **No-op:** I already have node-version and npm ci set up. 
- **Missing:** Where is `nx fix-ci`? The intro mentions it in the "LLM prompt" block (L30) but it’s absent from the actual GHA YAML. If it's a "standard" part of the setup, put it in the snippet.
- **Nx Cloud variant:** The snippet doesn't show the `NX_CLOUD_ACCESS_TOKEN` usage. If I need it for write access (L160), show it commented out in the YAML so I don't have to hunt for the env var name later.

### 5. The Nx Agents section
The framing is too aggressive. It assumes I want to throw away my matrix config.
- **Failure:** It doesn't acknowledge that I already solved distribution with GHA matrices. It needs to sell me on why "Agents" is better than my hand-tuned YAML.
- **Optionality:** "Optional" is at L77, but by the time I hit L143, it feels like the "next step" I'm forced into. Move the "Optional" tag into the H2 header at L143.

### 6. Order and length
- **Cut:** L155 (Self-hosted) belongs in an "Enterprise" footer, not mid-page.
- **Re-order:** Move "Access tokens and write access" (L158) immediately after "Connect the workspace" (L85). I'm not going to bother with remote cache if it's read-only and doesn't speed up my PRs.
- **Placement:** "Getting Started" is right, but the page is too long. I want the YAML and the Access Token instructions on one screen.

### 7. Score (1-10 each)
- **Persuasiveness:** 4/10. Too much "what" and not enough "why this is better than my S3 cache."
- **Trustworthiness:** 6/10. The `nx-set-shas` inclusion shows you know how GHA actually works.
- **Density / no-fluff:** 5/10. Too many bullet points about "Failure analysis" and "Dashboards" that I don't care about yet.
- **Likelihood I'd run `nx connect` today:** 3/10. I still don't know what it costs or how to kill it if it sucks.

### 8. The one change
The "Gold" line at L94 is buried. It should be the first thing I see after the header.

**Exact Diff:**
```diff
--- a/docs/getting-started/setup-ci.mdoc
+++ b/docs/getting-started/setup-ci.mdoc
@@ -62,0 +63,2 @@
+> **Note:** Connecting to Nx Cloud is non-destructive. No workflow file changes are required for read-only cache and reporting, and it can be removed by deleting one line in `nx.json`.
+
```
