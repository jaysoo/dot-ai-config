# Top GitHub repos using Turborepo (excluding vercel org)

**Date:** 2026-06-12
**Branch:** `claude/top-turbo-repos-github-ttwrrm`
**Status:** Research complete

## Goal

Find the top ten GitHub repositories that use Turborepo and are **not** under the
`vercel` org, ranked by stars.

## Method

- Turborepo usage was verified by confirming a **root `turbo.json`** (or `turbo.jsonc`)
  in each repo via GitHub code search — not just a mention of "turbo".
- Star counts pulled live from the GitHub API on **2026-06-12**.
- `vercel`-org repos intentionally excluded (so `vercel/turbo`, `vercel/next.js`,
  `vercel/commerce` are off the list by design).
- Candidate set was a curated list of well-known JS/TS monorepos, expanded with a
  second pass (astro, novel, chakra-ui, refine, twenty, cal.com, mui, hyperswitch).
  Not an exhaustive GitHub-wide crawl — GitHub code search can't sort `turbo.json`
  matches by stars.

## Result — Top 10 (by stars)

| #  | Repository            | Stars   | What it is                                   |
|----|-----------------------|--------:|----------------------------------------------|
| 1  | shadcn-ui/ui          | 116,316 | Component library / code-distribution platform |
| 2  | supabase/supabase     | 104,043 | Postgres dev platform (Firebase alt) — `turbo.jsonc` |
| 3  | withastro/astro       |  60,058 | Web framework for content-driven sites        |
| 4  | makeplane/plane       |  50,702 | Open-source Jira/Linear alternative           |
| 5  | payloadcms/payload    |  42,964 | Fullstack Next.js framework / headless CMS    |
| 6  | trpc/trpc             |  40,316 | End-to-end typesafe APIs                       |
| 7  | heroui-inc/heroui     |  29,609 | React UI library (formerly NextUI)            |
| 8  | nextauthjs/next-auth  |  28,270 | Authentication for the web (Auth.js)          |
| 9  | dubinc/dub            |  23,674 | Link attribution / short-link platform        |
| 10 | steven-tey/novel      |  16,313 | Notion-style WYSIWYG editor w/ AI             |

## Just missed the cut

- midday-ai/midday — 14,478
- tinacms/tinacms — 13,404
- documenso/documenso — 13,301
- formbricks/formbricks — 12,369
- t3-oss/create-t3-turbo — 6,059
- unkeyed/unkey — 5,335 (turbo.json under `web/`, not repo root)

## Checked but excluded (no root turbo.json)

- calcom/cal.com — no `turbo.json` found (uses workspaces, not Turborepo at root)
- chakra-ui/chakra-ui — none
- twentyhq/twenty — none
- mui/material-ui — none
- juspay/hyperswitch — none
- refinedev/refine — only in `examples/monorepo-with-turbo/`, not repo root

## Caveat

Top of the list (shadcn/ui, supabase, astro, plane, payload, trpc) is solid. Spots
9–10 could shift if an unchecked very-high-star repo also uses Turborepo.
