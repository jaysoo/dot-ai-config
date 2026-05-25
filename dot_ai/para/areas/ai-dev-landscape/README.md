# AI Dev Tools Landscape

Monthly scan of the AI-native development tools ecosystem, tracking signals relevant to Nx CLI, Nx Cloud, and Nx's AI features (MCP integration, agentic CI).

## Reports

| Month | File | Key Themes |
|-------|------|------------|
| 2026-05 | [2026-05.md](./2026-05.md) | **MCP 2026-07-28 RC locked May 21** (stateless core, Extensions, Tasks, Auth hardening; Sampling deprecated), **Google I/O May 19-20** (Gemini 3.5 Flash, Antigravity 2.0, WebMCP in Chrome 149), **Anthropic acquires Stainless ~$300M** (SDK/MCP generator; hosted products shutting down), **TanStack+node-ipc+AntV worm wave** (3 attacks in 9 days, TeamPCP, GitHub Actions OIDC extraction + DNS exfil), **Semantic Kernel CVE-2026-25592 (CVSS 10.0) + CVE-2026-26030 (CVSS 9.8)** (prompt injection -> RCE; patched May 7), **Claude Code v2.1.150** (Agent view, `/goal`, `/code-review` with PR comments, plugin marketplace), **Copilot GPT-5.3-Codex LTS** + Desktop App + usage billing June 1, **Cursor 3.4** (agent dev envs, Composer 2.5), Claude Security GA public beta + 271 Firefox CVEs from Mythos (carryover) |
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
