# AI Dev Tools Landscape

Monthly scan of the AI-native development tools ecosystem, tracking signals relevant to Nx CLI, Nx Cloud, and Nx's AI features (MCP integration, agentic CI).

## Reports

| Month | File | Key Themes |
|-------|------|------------|
| 2026-06 | [2026-06.md](./2026-06.md) | **W26 refresh (June 29): Miasma worm Phantom Gyp bypasses install-script defenses + explicitly targets AI IDE configs; North Korea (Sapphire Sleet) backdoors 144 Mastra AI npm packages (8M downloads, LLM API keys). Claude Fable 5 (June 9, Mythos-class general-use). Windsurf -> Devin Desktop. Copilot SDK GA. Nested sub-agents 5 levels deep (Claude Code v2.1.172). Kiro Pro Max + iOS.** June 1 baseline: OpenAI breached via TanStack/Mini Shai-Hulud; Opus 4.8 + dynamic workflows; Amazon Q sunset + Kiro; Google I/O 2026 Antigravity 2.0; MCP RC stateless core; Glasswing 10,000+ vulns; LLM autonomous jailbreak 97.14% |
| 2026-05 | [2026-05.md](./2026-05.md) | **Code w/ Claude keynote (May 6): Managed Agents, Multiagent Orchestration, Outcomes, Dreaming, Remote Agents, CI auto-fix** (no new model — agent infra is the differentiator), **MCP 2026-07-28 RC (May 21)** (Tasks moves to extension), **Mini Shai-Hulud AntV/TanStack wave (May 19, 600+ pkgs, CVE-2026-45321)** = 5th worm wave in 60d, **Mythos 10k flaws claim + vuln-chaining + wolfSSL CVE-2026-5194**, Claude Code v2.1.150 (24 patches in 22 days: `/goal`, `claude agents`, background sessions, `/code-review`), Codex CLI 0.130 (`codex remote-control`, `/vim`, Goal mode GA, Desktop app), Cursor cloud-agent enterprise (Dockerfile env, audit logs), Windsurf Opus 4.7 fast mode. **Earlier in month**: Claude Security GA public beta, 271 Firefox CVEs from Mythos, Vercel/Context.ai OAuth breach, Cursor Security Review GA, Cloudflare jailbreak research |
| 2026-04 | [2026-04.md](./2026-04.md) | **Claude Mythos Preview + Project Glasswing** (offensive-security uplift, but only 1 confirmed CVE so far per CSO), **MCP RCE CVE-2026-5603** (Anthropic declined to patch), **Comment-and-Control prompt-injection** hits Claude Code Security Review / Gemini CLI Action / Copilot Agent, **Shai-Hulud 3.0** npm worm, **Unit 42 MCP-sampling attack vectors**, Claude Opus 4.7 (Apr 16) + GPT-5.5 (Apr 23) + Gemini 3 (Apr 22), Claude Code v2.1.121 (after 2.1.119/120 regression wave), Codex 0.125.0 + desktop computer-use, Cursor 3 / Windsurf+Devin Cloud / Antigravity all converge on parallel-agent UX |
| 2026-03 | [2026-03.md](./2026-03.md) | MCP spec v2 + OAuth 2.1, Claude Code v2.1.76, Google Antigravity launch, Codex desktop app, agentic CI maturing |

## Categories Tracked

1. **MCP Ecosystem** - spec changes, SDK releases, server adoption
2. **AI Coding Tools** - Claude Code, Copilot, Cursor, Windsurf, Codex, Amazon Q/Kiro, Google Jules/Antigravity
3. **AI-Powered CI/CD** - self-healing CI, AI test generation, agentic pipelines
4. **Agentic Development** - multi-agent frameworks, tool-use patterns, orchestration
5. **Academic/Research** - AI-assisted SE papers, DORA findings

## Methodology

- Cached release data from GitHub API (SCAN_DATA_DIR)
- Web searches for announcements within 60-day lookback
- Every version/feature claim sourced from live data; unverified items marked
