---
description: >
  Scan the AI-native development tools landscape. Tracks MCP ecosystem,
  AI coding tools (Claude Code, Cursor, Copilot, Codex, Windsurf), and
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

## File Management

Area directory: `.ai/para/areas/ai-dev-landscape/`

1. Current month as `YYYY-MM`.
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
# Check MCP spec for recent changes
gh release list --repo modelcontextprotocol/specification --limit 5
```

### 2. AI Coding Tools

Track releases and announcements from:

| Tool | Source |
|------|--------|
| Claude Code | `https://github.com/anthropics/claude-code/releases`, `https://claude.com/blog` |
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
# Search GitHub for trending repos
gh search repos "ai agent developer tools" --sort=stars --limit=10 --json name,description,stargazersCount,updatedAt
```

### 5. Academic / Research

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
