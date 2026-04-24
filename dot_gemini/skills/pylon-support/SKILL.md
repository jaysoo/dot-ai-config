---
name: pylon-support
description: Look up and analyze customer support issues using Pylon MCP. Use when the user mentions "customer issues", "customer support", "support issues", "support tickets", "pylon", "customer complaints", "customer friction", or asks about what customers are reporting, struggling with, or requesting. Also trigger when asking about a specific customer account's support history.
---

# Pylon Customer Support Lookup

Search and analyze customer support issues via the Pylon MCP server.

## Pylon MCP Tools

Use these tools (load via ToolSearch first):

| Tool                             | Purpose                                             |
| -------------------------------- | --------------------------------------------------- |
| `mcp__pylon__search_issues`      | Search issues by keyword, state, account            |
| `mcp__pylon__get_issue`          | Full details for a specific issue (by ID or number) |
| `mcp__pylon__get_issue_messages` | Message history for an issue                        |
| `mcp__pylon__search_accounts`    | Search for customer accounts                        |
| `mcp__pylon__get_account`        | Full account details                                |
| `mcp__pylon__get_contact`        | Contact (person) details                            |

## How to Use

1. **Specific account?** → `search_accounts` first, then `search_issues` filtered by account
2. **Specific issue number?** → `get_issue` directly
3. **Keyword/topic?** → `search_issues` with keyword
4. **General overview?** → `search_issues` for recent open issues

## Presenting Results

Organize by account, theme (auth, caching, DTE, billing), or priority depending on context.

For each issue include: number, title, account, state, priority, age, brief summary.

## Privacy

- OK to share account names and details with Jack (he's staff)
- For external-facing summaries, anonymize account names
- Never include credentials, tokens, or PII from messages

## Cross-Reference

When relevant, mention if an issue maps to:

- A GitHub issue (nrwl/nx or nrwl/nx-cloud)
- A Linear ticket (NXC- or CLOUD-)
- A pattern in community sentiment reports (`.ai/para/areas/community-sentiment/`)
