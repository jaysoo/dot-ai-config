# Stefan Haas — Sandboxing / eBPF feature request origin

**Date:** 2026-04-29
**Why this note exists:** Tried to find written record of who first asked Nx for sandboxing and pointed us at eBPF. Local notes and Pylon turned up nothing. Source is a Slack thread + GitHub discussion + Stefan's blog. Capturing here so it's searchable.

## Key links

- **GitHub discussion #33535 — "Sandboxing for Nx"**: https://github.com/nrwl/nx/discussions/33535
  - Filed by Stefan Haas, Nov 19th 2025, Feature Requests category, 2 comments
  - Argues Nx's statically defined inputs/outputs (like Bazel/Buck) can produce wrong cache hits when targets are misconfigured. Lint with type-aware rules / enforce-module-boundaries reads files outside the declared input set; later, those files change and the cache returns a stale pass.
- **Internal Slack thread (Dec 7th, 2025)**: https://nrwl.slack.com/archives/C6WJMCAB1/p1765156749425959
  - Max flagged Stefan's blog post in the thread:
  - **Stefan's blog — "Tracing Nx target inputs with eBPF"**: https://stefanhaas.xyz/article/tracing-nx-target-inputs-with-ebpf
  - Max's framing: "stefan has a blog post for setting up ebpf & nx to compare inputs with actual files read. I wonder if this could be a cool feature on nx cloud."

## Context / tone

- Original GitHub discussion post was **pretty aggressive** — Stefan's framing was that Nx is "basically unusable and cannot be relied on" without this.
- I talked to him on Discord afterward and he toned it down.
- The eBPF angle was *Stefan's* — he had already built a working prototype tracing Nx target inputs via eBPF and written it up before we shipped Task Sandboxing.

## Why this matters

- This is the external origin story for Task Sandboxing / eBPF I/O tracing — the feature that became Q-team's major Q1 2026 initiative and shipped in Nx 22.6 (March 2026).
- Worth crediting / referencing if the feature ever gets a public retrospective, blog post, or conference talk.
- Stefan is not a Pylon customer (no record on either Microsoft account or under his name) — purely community / OSS contributor.
