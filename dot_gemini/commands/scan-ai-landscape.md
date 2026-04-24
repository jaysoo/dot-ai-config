---
description: >
  Scan the AI-native development tools landscape. Tracks MCP ecosystem,
  AI coding tools (Gemini CLI, Cursor, Copilot, Codex, Windsurf), and
  AI-assisted build/CI developments. Relevant to Nx's AI roadmap
  including MCP integration and agentic experiences. Run monthly.
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - WebFetch
  - Task
---

# AI Dev Tools Landscape Scan

Monitor the AI-native development tools ecosystem for trends, new tools,
and developments relevant to Nx's AI roadmap — particularly MCP integration,
AI-assisted CI, and agentic developer experiences.

## Scope

$ARGUMENTS

Default: full scan. Can scope to "MCP only", "coding tools only", etc.

## Lookback Window

By default, scan the last **60 days** of releases and activity. The
orchestrator passes `LOOKBACK_START` (an ISO date like `2025-12-29`).
If not provided, compute:

```bash
LOOKBACK_START=$(date -v-60d '+%Y-%m-%d')
```

## File Management

Area directory: `.ai/para/areas/ai-dev-landscape/`

1. Current month as `YYYY-MM` (for report naming).
2. If report exists, **update in place**. Preserve `> NOTE:` / `<!-- manual -->`.
3. If not, create new. Ensure README.md links it.

### README.md structure

```markdown
# AI Dev Tools Landscape

Monthly scan of AI-native development tools and trends relevant to Nx's
AI roadmap. Covers MCP ecosystem, AI coding assistants, AI-powered CI/CD,
and agentic development patterns.

## Why This Matters for Nx

Nx has committed to AI-native development features including:
- MCP server (`nx-mcp`) for AI tool integration
- Agentic experiences for CI (Self-Healing CI, fix-ci)
- AI-powered code generation and migration
- Developer workflow automation

This scan tracks the ecosystem we're building into.

## Reports

- [YYYY-MM](./YYYY-MM.md) — {one-line highlight}
```

## Cached Data (from orchestrator)

If the orchestrator provides `SCAN_DATA_DIR`, read release and search data
from cached JSON files instead of calling `gh` directly.

Available:
- `$SCAN_DATA_DIR/releases/anthropics-gemini-code.json`
- `$SCAN_DATA_DIR/releases/modelcontextprotocol-specification.json`
- `$SCAN_DATA_DIR/api/ai-agent-repos.json` (search results)

## CRITICAL: Use live data, not training data

The AI tools landscape moves fast — your training data is stale within
weeks. **Every claim about tool versions, features, and adoption MUST
come from a live source** (cached data, WebFetch, WebSearch, npm view).

```bash
# Verify current versions before writing (cache or live)
cat "$SCAN_DATA_DIR/releases/anthropics-gemini-code.json" 2>/dev/null \
  || gh release list --repo anthropics/gemini-code --limit 5 --json tagName,publishedAt
cat "$SCAN_DATA_DIR/releases/modelcontextprotocol-specification.json" 2>/dev/null \
  || gh release list --repo modelcontextprotocol/specification --limit 5 --json tagName,publishedAt
```

Use `WebSearch` for recent announcements, blog posts, and product
launches. If you can't verify a claim from a live source, mark it as
"unverified (from training data)" in the report. Never state a tool
"launched feature X" or "reached version Y" without a source URL.

## Categories to Track

### 1. MCP Ecosystem

```bash
# New MCP servers published
WebFetch https://github.com/modelcontextprotocol/servers
```

Search for:
- New MCP servers relevant to build tools, CI/CD, monorepos
- MCP spec changes or new protocol features
- Adoption signals: which companies/tools are adding MCP support
- Community MCP servers that compete with or complement `nx-mcp`

```bash
# Check MCP spec for recent changes (cache or live)
cat "$SCAN_DATA_DIR/releases/modelcontextprotocol-specification.json" 2>/dev/null \
  || gh release list --repo modelcontextprotocol/specification --limit 5 --json tagName,publishedAt,body
```

### 2. AI Coding Tools

Track releases and announcements from:

| Tool | Source |
|------|--------|
| Gemini CLI | `https://github.com/anthropics/gemini-code/releases`, `https://gemini.com/blog` |
| GitHub Copilot | `https://github.blog` (filter AI/Copilot) |
| Cursor | `https://cursor.com/changelog` |
| Windsurf (Codeium) | `https://codeium.com/blog` |
| OpenAI Codex | `https://openai.com/blog` |
| Amazon Q Developer | AWS blog |
| Google Jules / Gemini Code | Google AI blog |

For each, note:
- New features relevant to monorepo development
- Changes to how they discover/use project structure
- Support for build tools, task runners, or CI integration
- Pricing or model changes that affect adoption

### 3. AI-Powered CI/CD

Search for developments in:
- AI-assisted CI failure diagnosis (competitors to Self-Healing CI)
- AI-powered test generation/selection
- Intelligent build caching or task distribution
- AI code review tools (CodeRabbit, Sourcery, etc.)

```bash
WebFetch https://github.com/topics/ai-ci-cd
```

### 4. Agentic Development Patterns

Track emerging patterns:
- Multi-agent coding workflows
- AI agents that understand monorepo structure
- Tool-use patterns (agents calling build tools, running tests)
- Agent skill/plugin ecosystems (relevant to Nx plugin story)

Search for recent blog posts and announcements:
```bash
# Search GitHub for trending repos (cache or live)
cat "$SCAN_DATA_DIR/api/ai-agent-repos.json" 2>/dev/null \
  || gh search repos "ai agent developer tools" --sort=stars --limit=10 --json name,description,stargazersCount,updatedAt
```

### 5. AI Security Threats (NEW — weight heavily)

Track AI model / agent developments that change the **threat model** for
orgs shipping code and running CI. This section is explicitly about
offensive-security uplift and misuse risk, not general model news.

Look for:

- **Frontier model releases with strong vulnerability-discovery or
  exploit-generation capability** (e.g. a hypothetical "Gemini Mythos"
  that reliably finds real CVEs in OSS). Sources: Anthropic, OpenAI,
  Google DeepMind, Meta, DeepSeek, xAI, Mistral, Qwen, and open-weight
  model announcements. Look specifically for:
  - Benchmark claims on Cybench, SWE-bench-Security, CTF benchmarks,
    HackerOne-style eval harnesses.
  - "Red-team" / "security research" framing in release blog posts.
  - Reports of real-world CVE discovery attributable to the model.
- **Jailbreak or alignment regressions** in widely-deployed models that
  lower the cost of misuse.
- **Agentic capabilities** that unlock autonomous recon, credential
  harvesting, lateral movement, or repo exfiltration (e.g. browser-use,
  computer-use, long-horizon agents with shell access).
- **Prompt-injection / indirect prompt-injection research** affecting
  tools we ship or embed: `nx-mcp`, Self-Healing CI, AI code review,
  agentic CI. Including: tool-poisoning, MCP-server-in-the-middle,
  malicious-README attacks, supply-chain-via-agent.
- **Published attacks using AI** against package registries (npm, PyPI)
  or CI/CD — AI-assisted typosquatting, dependency confusion at scale,
  malware authored by agents.

Sources to check:
```bash
WebSearch "AI model vulnerability discovery benchmark 2026"
WebSearch "LLM exploit generation CVE"
WebSearch "MCP prompt injection attack"
WebSearch "agent supply chain attack npm"
WebFetch https://simonwillison.net/tags/prompt-injection/
WebFetch https://embracethered.com/blog/
```

For each finding, record: source URL, date, brief description,
**severity** (Low / Medium / High — High means it changes what we ship
or how we defend), and **action** (monitor / evaluate / mitigate now).

### 6. Academic / Research

Search for recent papers on:
- AI-assisted software engineering
- Automated code migration
- Build system optimization with ML
- Developer productivity measurement with AI

Source: `https://arxiv.org/list/cs.SE/recent`

## Analysis Framework

For each category, assess:

**Relevance to Nx CLI**: Does this affect how developers use Nx locally?
(e.g., a new coding tool that needs better Nx integration)

**Relevance to Nx Cloud**: Does this affect CI/CD, remote caching, or
distributed execution? (e.g., AI-powered test splitting competitors)

**Relevance to Nx's AI Features**: Does this validate, threaten, or
inform our MCP/agentic strategy?

**Adoption Signal**: Is this gaining real traction or is it vaporware?
Look for GitHub stars growth, npm downloads, enterprise adoption mentions.

## Compare with last month

- Trends that strengthened or weakened
- Tools that launched, pivoted, or shut down
- Predictions from last month: how did they play out?

## Write the report

```markdown
# AI Dev Tools Landscape — {Month Year}

_Last updated: {datetime}_

## TL;DR
{3-5 bullets: most important developments for Nx this month}

## MCP Ecosystem
### New/Updated Servers
{Relevant to build tools, CI, monorepos}

### Spec Changes
{Protocol updates, new capabilities}

### Adoption Signals
{Who added MCP support, what it means}

## AI Coding Tools
### {Tool}: {version/release}
- What shipped: {summary}
- Nx relevance: {specific impact or "None"}

{Repeat for each tool with notable releases}

## AI-Powered CI/CD
{New tools or features from existing tools}

## Agentic Development
{Emerging patterns, new frameworks, notable projects}

## AI Security Threats
### Model Releases (offensive-security uplift)
{Frontier models with notable vuln-discovery or exploit-generation
capability. For each: model, source, benchmark claims, severity,
action.}

### Prompt Injection & Agent Attacks
{Research / real-world incidents affecting MCP, agents, AI code review.}

### Jailbreaks & Alignment Regressions
{Widely-deployed models with new misuse vectors.}

### Implications for Nx
{What changes in our threat model this month. Does `nx-mcp`, Self-Healing
CI, or AI code review need new mitigations? Do we need to reassess
secrets handling, CI token scope, or supply-chain posture given new
offensive capability?}

## Implications for Nx Roadmap

### Validate
{Things in the ecosystem that confirm our direction}

### Challenge
{Things that suggest we should reconsider something}

### Opportunity
{Gaps in the ecosystem Nx could fill}

### Watch
{Too early to act but worth tracking next month}
```

Save to `.ai/para/areas/ai-dev-landscape/YYYY-MM.md` and update README.md.
