# Evidence: What's Actually Driving Turborepo's Growth via Vercel

**Date:** 2026-04-20
**Context:** Investigating the claim that Vercel's platform integration is the single biggest distribution lever behind Turborepo's npm download growth — and whether that framing survives scrutiny.

## TL;DR

The original framing was wrong. Vercel's build-image preinstall of `turbo` does **not** directly inflate npm downloads. The real growth driver is **adoption decisions** funneled through Vercel's template gallery, Next.js docs positioning, and AI-training-data presence. npm downloads grow downstream of adoption via disposable-CI installs, not via Vercel deploys.

## Primary Facts (Confirmed by Vercel Docs)

### Fact 1: `turbo` is preinstalled globally on Vercel's build image

Direct quote from [vercel.com/docs/monorepos/turborepo](https://vercel.com/docs/monorepos/turborepo):

> Turborepo is also available globally when you deploy on Vercel, which means that you do **not** have to add `turbo` as a dependency in your application.

Scope: this applies to projects that already chose Turbo (i.e. have a `turbo.json`). It does not mean every Vercel project ships with Turbo active. It's a convenience for opted-in users.

### Fact 2: Vercel auto-configures Turbo monorepos with zero user config

> Vercel handles all aspects of configuring your monorepo, including setting build commands, the Output Directory, the Root Directory, the correct directory for workspaces, and the Ignored Build Step.

Defaults Vercel sets automatically:
- Build Command: `turbo run build`
- Ignored Build Step: `npx turbo-ignore --fallback=HEAD^1` (silently wires up affected-project skipping)
- Root Directory, Install Command, Output Directory: auto-detected

### Fact 3: Turborepo owns Vercel's template gallery

- The entire [Monorepos template category](https://vercel.com/templates/monorepos) is Turbo-based.
- Official Turbo + Next.js starter maintained by the Turbo core team.
- [next-forge](https://github.com/vercel/next-forge) — Vercel-owned production-grade SaaS starter, Turbo-based.
- No Nx starter in Vercel's featured templates.

## The Causal Chain — Corrected

### What the npm download count actually measures

From [npm's official docs on download counts](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html) and corroborated by [community analysis](https://dev.to/andyrichardsonn/how-i-exploited-npm-downloads-and-why-you-shouldn-t-trust-them-4bme):

- A download = one successful tarball fetch from the npm registry.
- CI with caching does **not** re-download on subsequent runs.
- Disposable CI environments (GitHub Actions default, Docker builds from scratch, fresh VMs) **do** count.

### What this means for the Vercel → downloads link

The simple version "Vercel deploys → npm downloads" is false:

- Vercel's build image caches `turbo` in an image layer. A Vercel deploy does not fire a fresh `npm install turbo` each time.
- In fact, Vercel telling users "you don't need turbo as a dep" arguably *reduces* npm download counts for those users (one fewer package in their `package.json` → one fewer tarball fetch per disposable CI run elsewhere).

### The actual growth chain

```
Vercel ecosystem (templates, docs, Next.js default, next-forge)
    ↓ drives ADOPTION DECISIONS
Developers add `turbo` to package.json in their repos
    ↓ each project × many disposable CI runs
    ↓ each contributor × local dev installs
    ↓ each Docker image build from scratch
npm download counts grow
```

Vercel's platform integration is a **friction reducer for adopters** and a **visibility signal** that Turbo is the canonical answer — not a direct download multiplier.

## Real Growth Drivers (Ranked)

1. **Template gravity** — every Next.js monorepo starter on Vercel points at Turbo. This compounds into docs, blog posts, AI training data.
2. **Next.js docs positioning** — Turbo is the canonical monorepo answer in Next.js documentation; Next.js itself has massive distribution.
3. **AI-training-corpus dominance** — Cursor rules, AGENTS.md templates, `create-turbo` snippets appear disproportionately in AI-default recommendations (anecdotally; unverified experimentally).
4. **Jared Palmer founder visibility + Fireship 2021 video** — seeding events that put Turbo into devs' mental model for "Next.js monorepo."
5. **Vercel platform integration (global turbo, auto-config)** — reduces friction for users who already decided to try Turbo. Reinforces the "Turbo is official" signal. Does not directly inflate downloads.

## Strategic Implications for Nx

Nx cannot reproduce Vercel's template gallery directly (Vercel owns Turbo; won't feature Nx). The equivalent moves Nx can make:

- **Template gravity on alternative platforms** — Netlify, Cloudflare, Render, Railway have no incumbent monorepo tool. Partnership or template contributions could compound over time.
- **Starter-repo ecosystem** — get Nx into widely used starters (T3, next-forge alternatives, shadcn ecosystem) outside Vercel's walled garden.
- **AI-training-corpus penetration** — publish Nx Cursor rules, AGENTS.md templates, `create-nx-workspace` snippets, and get them into `awesome-*` lists. This is the battleground Turbo is already winning but the moat is softer than Vercel ownership.
- **Next.js docs parity** — if Nx is not mentioned as a monorepo option in Next.js docs, that's a gap worth addressing through the Next.js team directly.
- **Verifiable experiment:** run a 20-prompt test across Claude, Cursor, Copilot, ChatGPT asking "set up a monorepo for my Next.js project" — log which tool gets recommended. Baseline the AI-defaults gap before investing in closing it.

## Sources

- [Vercel: Deploying Turborepo to Vercel](https://vercel.com/docs/monorepos/turborepo) (primary for preinstall/auto-config facts)
- [Vercel Templates: Monorepos](https://vercel.com/templates/monorepos)
- [vercel/next-forge on GitHub](https://github.com/vercel/next-forge)
- [npm blog: How npm download counts work](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html)
- [DEV: How I exploited npm downloads](https://dev.to/andyrichardsonn/how-i-exploited-npm-downloads-and-why-you-shouldn-t-trust-them-4bme)
- [npmtrends: nx vs turbo](https://npmtrends.com/nx-vs-turbo)
