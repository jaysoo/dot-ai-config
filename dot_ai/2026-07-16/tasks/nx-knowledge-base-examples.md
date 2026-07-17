# Nx knowledge base examples

## Goal

Identify strong support-oriented knowledge bases that Nx can model, beyond Vercel and Pylon.

## Approach

- Verify current public knowledge-base examples.
- Separate true support/troubleshooting KBs from product documentation.
- Recommend a short list and note the specific pattern Nx should borrow from each.

## Status

- [x] Restore and verify the `.ai` symlink.
- [x] Research current examples.
- [x] Synthesize recommendations for Nx.
- [x] Archive the completed task.

## Recommendation

Use LaunchDarkly, Supabase, and Cloudflare as the main models:

- LaunchDarkly for a separate developer-product KB and a strict `Affected / Symptoms / Cause / Solution` article format.
- Supabase for integrating troubleshooting into the main docs with product tags, error-code metadata, last-edited dates, GitHub discussion, status, and support handoffs.
- Cloudflare for branching diagnosis, clear ownership boundaries, and a precise escalation payload.

Use CircleCI for Nx-adjacent taxonomy, GitLab for operating a large separate support KB, GitHub for its public troubleshooting content model, and Sentry Answers for error-search and SEO patterns.
