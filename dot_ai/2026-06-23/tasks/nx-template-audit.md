# Nx Template Audit

Started: 2026-06-23 11:28 ET

## Goal

Audit the template repos linked from https://nx.dev/docs/templates:

- Confirm each documented `create-nx-workspace` command runs without errors.
- Confirm only Angular and NestJS templates use `project.json`; all others use Nx target config in `package.json`.
- Check `README.md` links for 404s.
- Confirm Nx is `23.0.0` and TypeScript is `6.x`, calling out templates that legitimately require TypeScript 5.
- Run `test`, `build`, `lint`, and `typecheck` where available.

## Plan

1. Discover all template repos from the docs page.
2. Clone/template-check repos in scratch directories.
3. Delegate independent repo validation to subagents.
4. Summarize failures and repos needing follow-up.

## Notes

- Keep checks read-only unless the user asks for fixes.
