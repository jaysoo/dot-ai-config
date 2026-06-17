# AI Governance / AI Notice Page (customer-facing)

**Goal:** Publish a public, customer-facing page that documents Nx's AI governance posture — what our AI features do, which third-party AI providers we use, that we don't train on customer data, who owns the output, and how to turn AI features off. Prospects increasingly request this in writing before signing.

**Status:** Drafting — see [`draft.md`](draft.md).

## Why now — the demand signal (from Slack)

There are two distinct asks showing up from prospects, and we should be clear which one we're answering:

1. **A public AI transparency notice** (Framer-style "AI Notice"). Customer-facing, plain-language. This is what most prospects want.
   - **Bestow** (enterprise prospect, #red-panda, Aug–Sep 2025, Nicole Oliver): needs it *publicly* in writing that "Nx doesn't train models based on customer data" and that "we don't claim ownership over what our tools produce." Many enterprise MSAs already cover this, but Bestow wants it stated somewhere public.
   - **HEB** (#shared-nx-heb / #internal-heb, Oct 2025, Josh VanAllen): legal review resolved with the same four points — see "Canonical talking points" below.
   - Josh VanAllen (#ask-security, May 2026): *"more and more folks are asking about AI governance policies."*

2. **A standalone AI Governance *Policy*** (Vanta-style internal control doc that we attest to / share under NDA). Different artifact — describes how we *govern* our own AI use (oversight, risk review, roles).
   - **Anaplan** (#ask-security, May 2026): *"do you have plans on your roadmap to consolidate these [AI controls currently in existing policy] into a standalone AI Governance Policy to ensure broader scope, controls?"* — roadmap question for Craigory/Victor.
   - Josh asked whether Vanta can generate one.

> The draft here targets **#1 (the public AI Notice)** — that's what "a page for customers that ask for it" and the Framer reference point to. #2 is a separate security/compliance deliverable; flagged for Craigory/Victor.

## Canonical talking points (already agreed internally)

From Josh VanAllen's HEB legal resolution (Oct 2025) — these are the substance the page must convey:

1. **Data ownership.** TOS updated so Nx claims no ownership of the *input* to the AI provider, nor of the AI *output*. You retain your data; you own the output.
2. **AI providers.** Self-healing CI is powered by **Anthropic**; "Explain with AI" is powered by **OpenAI**. Used via their APIs under commercial (paid, non-enterprise) agreements. Accounts are configured so the providers **do not train** on our inputs/outputs.
3. **Single-tenant BYO keys.** Single-tenant customers can provide their own Anthropic/OpenAI API tokens to own the provider relationship directly.
4. **Off switch.** AI features can always be turned off.

## Existing legal artifacts (source of truth — don't contradict)

- **AI Addendum / AI Terms**, effective 2025-09-15 — full text captured in #red-panda (James Henry, 2026-01-29). Key clauses:
  - You retain ownership of Your Data; you own the Output (insights, recommendations, bug fixes). Nx claims no ownership of Output.
  - "We will not use Your Data to train or improve our AI Features."
  - Restrictions: don't sell/share Output to third parties; don't use Output to build competing AI models.
  - Probabilistic-nature disclaimer: output may be inaccurate/non-unique; use at your own risk; human review expected.
  - Lives at <https://cloud.nx.app/ai-terms> and folded into the main TOS <https://cloud.nx.app/terms/cloud/2025-09-15>.
- **Discoverability gap:** James Henry & Benjamin Cabanes (Jan 2026) noted the AI Addendum is hard to find — not cross-linked from the general terms or org settings. A public AI Notice page would also fix this.

## Is this "basically Framer's AI Notice"?

Yes — same genre. Framer's [AI Notice](https://www.framer.com/legal/ai-notice) is a short, plain-language transparency doc that sits alongside their TOS/DPA/AUP and covers: what AI features exist, the third-party model providers (subprocessors), that content isn't used for training, that processing follows the DPA, output disclaimers, and how it's governed. Our equivalent maps almost 1:1 onto the four canonical talking points above. (Framer's exact page text wasn't machine-fetchable — site blocks scraping — but the structure is well established across the industry.)

## Competitive / inspiration references

- **Framer — AI Notice** — <https://www.framer.com/legal/ai-notice> (the reference Jack cited; short notice next to TOS/DPA/AUP).
- **Vercel — AI Product Terms** — <https://vercel.com/legal/ai-product-terms>. Warrants v0/AI Gateway customer content isn't used to train Vercel's or third-party providers' models; names AI subprocessors (Groq, Cerebras, Baseten) in the DPA; zero-data-retention + no-prompt-training controls.
- **GitHub Copilot — Trust Center** — <https://github.com/trust-center>. Structured into Security / Privacy / IP. Business & Enterprise contractually excluded from training; lists SOC 2 Type 2, ISO 27001, CSA STAR. Good model for the "controls + certifications" framing Anaplan wants.
- **Notion AI** — documents that it and its AI subprocessors don't train on workspace data, with contractual restrictions flowed down to subprocessors.

## Open decisions / next steps

- [ ] Confirm with Nicole/Legal the final list of AI features + their providers (page must stay accurate as features ship).
- [ ] Decide hosting: standalone `cloud.nx.app/ai-notice` (or `nx.dev/ai-notice`) cross-linked from TOS, org settings, and the AI Addendum.
- [ ] Decide retention specifics (do we want to state a retention window for prompts/outputs at the providers?).
- [ ] Separately: route the standalone **AI Governance Policy** ask (Anaplan) to Craigory/Victor + Vanta.
- [ ] Legal review before publish.
