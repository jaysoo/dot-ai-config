# Runtime Tracking

Monthly reports tracking Node.js, Bun, and Deno runtime releases and their impact on the Nx platform.

## Purpose

- Track runtime releases, deprecations, and breaking changes
- Identify compatibility risks for Nx users
- Surface opportunities for Nx improvements
- Monitor TC39 proposals relevant to build tooling

## Reports

| Month | File | Key Items |
|-------|------|-----------|
| 2026-02 | `2026-02.md` | Node 20 EOL April 2026, Jan security CVEs, Node 25 breaking changes, Bun 1.3.x, Deno 2.7 |

## Report Structure

Each monthly report contains:

1. **Action Items** — Prioritized (HIGH/MEDIUM/LOW) items requiring attention
2. **Node.js** — Release table, EOL schedule, breaking changes, Nx risks/opportunities
3. **TC39 Proposals** — Stage changes relevant to Nx
4. **Bun** — Release table, compatibility notes
5. **Deno** — Release table, Node.js compat progress
6. **Recommendations** — Summary action table

## Data Sources

- Node.js: `gh release list --repo nodejs/node`, nodejs.org/blog, endoflife.date/api/nodejs.json
- Bun: `gh release list --repo oven-sh/bun`, bun.sh/blog
- Deno: `gh release list --repo denoland/deno`, deno.com/blog
- TC39: github.com/tc39/proposals
- Nx engines: npm registry (`npm view nx engines`)

## Schedule

Run monthly, looking back 60 days from current date. Reports named `YYYY-MM.md`.
