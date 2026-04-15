---
name: use-plannotator-for-review
description: >
  Route code review requests through Plannotator (https://plannotator.ai) so Jack can leave
  comments, request changes, or approve in an interactive UI instead of inline chat.
  Triggers whenever the user asks to review a branch, diff, PR, or pending changes — phrases
  like "review this", "review the branch", "review my changes", "look over this PR",
  "can you review", "ready for review", or any request for code review feedback.
  Also triggers when a task ends with "now review it" or similar handoff to a review step.
---

# use-plannotator-for-review

Jack's preferred review flow is **Plannotator** — an interactive UI where he reads diffs and
leaves comments, approvals, or change requests. Do not produce a long inline review in chat.

## When to invoke

Trigger on any review request targeting a branch, working tree, staged changes, a PR URL, or
a specific commit range. Examples:

- "review this branch"
- "can you review my changes"
- "review the PR"
- "ready for review"
- "look over the diff"

## What to do

1. **Pick the right Plannotator command** based on intent:
   - Reviewing current uncommitted changes or a PR URL → invoke `/plannotator-review`
     (skill name: `plannotator-review`).
   - Re-annotating the last assistant message Claude just rendered → `/plannotator-last`.
   - Annotating a specific markdown file → `/plannotator-annotate <path>`.

2. **Invoke via the Skill tool**, e.g. `Skill(skill: "plannotator-review", args: "<PR URL or empty>")`.
   Pass the PR URL through if the user supplied one; otherwise leave args empty so Plannotator
   picks up the current branch's changes.

3. **Do not** write a chat-based review summary first — go straight to the Plannotator skill so
   Jack can interact in the UI. A one-line "opening this in Plannotator" is fine.

## Why

Inline chat reviews are hard for Jack to act on (comment, approve, batch-resolve). Plannotator
is the source of truth for review feedback — see https://plannotator.ai/docs/getting-started/installation/.
