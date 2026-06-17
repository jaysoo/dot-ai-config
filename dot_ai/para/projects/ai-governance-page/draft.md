# Nx AI Notice

> **Draft for review — not yet published.** Owner: Nicole / Legal. Substance is drawn from the existing AI Addendum (eff. 2025-09-15) and the HEB legal resolution. Verify the feature/provider list is current before publishing.

_Last updated: [DATE] · This Notice supplements the [Nx Cloud Terms of Service](https://cloud.nx.app/terms), the [AI Addendum](https://cloud.nx.app/ai-terms), and our [Data Processing Addendum]. If there is any conflict, those agreements control._

## Summary

Nx Cloud offers optional AI-powered features that help your team ship faster — for example, self-healing CI and AI explanations of failures. We built these features to be safe to adopt in enterprise environments. In short:

- **We don't train on your data.** Neither Nx nor the AI providers we use train or improve their models on your code, prompts, or outputs.
- **You own your inputs and your outputs.** Nx claims no ownership over the data you send to an AI feature, or over what the feature produces.
- **You're in control.** Every AI feature can be turned off for your organization at any time.
- **You can bring your own provider.** Single-tenant customers can supply their own AI provider API keys.

The rest of this page explains the details.

## Which features use AI, and who powers them

Our AI features are built on top of leading third-party model providers, accessed through their APIs. We do not host or train our own foundation models. The current features and their providers are:

| Feature | What it does | AI provider |
|---|---|---|
| **Self-healing CI** | Diagnoses failing CI tasks and proposes fixes | Anthropic |
| **Explain with AI** | Explains task failures and cache misses in plain language | OpenAI |

_If we add, remove, or change the provider behind a feature, we will update this Notice._

## How your data is handled

When you use an AI feature, the relevant inputs (for example, failing logs, the relevant code context, and your prompt) are sent to the applicable provider through their commercial API in order to generate a response. We have configured our accounts with these providers so that:

- **Your inputs and the generated outputs are not used to train or improve the providers' models.**
- **Nx does not use your data to train or improve our own AI features.**

We process this data only to provide the feature you requested. All processing is governed by our [Data Processing Addendum], including the terms that flow these protections down to our subprocessors.

## Ownership of inputs and outputs

- **Your data stays yours.** You retain all ownership rights in the data you provide to AI features.
- **You own the output.** As between you and Nx, you own the insights, recommendations, and fixes the AI features generate ("Output"). **Nx does not claim any ownership rights in the Output.**

## Single-tenant: bring your own keys

Single-tenant customers (a private, dedicated instance of Nx Cloud managed by us) can provide their own Anthropic and/or OpenAI API keys. This lets you own the contractual relationship with the AI provider directly and apply your own provider-side controls.

## Turning AI features off

AI features are optional. An organization administrator can disable AI features at any time from your Nx Cloud organization settings. When disabled, no data is sent to AI providers for those features.

## Important limitations

AI features use machine learning, which is probabilistic by nature. As a result:

- Output may be **inaccurate, incomplete, or not unique** — the same or similar output may be generated for you or for others.
- The quality of Output depends on the quality of the inputs you provide.
- **You are responsible for reviewing Output before relying on it or merging it.** Human review is expected, especially for code changes. Use of Output is at your own risk, as further described in the [AI Addendum](https://cloud.nx.app/ai-terms).

You also agree not to sell or share Output with third parties, or use Output to develop AI models that compete with Nx.

## Subprocessors

The third-party AI providers listed above act as subprocessors for the relevant features. Our current subprocessors are listed at [link to subprocessor list], and we update that list when it changes.

## Questions

For questions about this Notice or our AI data handling, contact [security@nx.dev / legal contact]. Enterprise customers can request our security documentation through their account team.

---

### Notes for reviewers (remove before publishing)

- **Provider agreements:** We are on paid (not enterprise) commercial agreements with Anthropic and OpenAI; the no-training configuration is account-level, not a negotiated enterprise term. Confirm whether Legal wants to state the agreement tier or keep it generic.
- **Retention:** This draft is silent on how long providers retain prompts/outputs. Decide whether to add a retention statement (cf. Vercel's "zero data retention" positioning).
- **Subprocessor list:** Need a canonical public subprocessor list URL before publishing (GitHub Copilot and Vercel both expose one).
- **Discoverability:** Cross-link this from the main TOS, the AI Addendum, and org settings — the AI Addendum is currently hard to find (per James/Benjamin, Jan 2026).
- **Governance Policy:** This page is the *transparency notice*. The separate "standalone AI Governance Policy" some prospects ask for (e.g., Anaplan) is a different, controls-oriented document — route to Craigory/Victor + Vanta.
