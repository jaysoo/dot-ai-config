---
name: blog-writing
description: Write, draft, edit, or review blog posts for jaysoo.ca in Jack's voice. Enforces the personal blog style guide (voice, tone, structure, words to avoid, signature phrases). Use whenever drafting, revising, restructuring, or proofreading a blog post, or when Jack says "blog post", "write a post", "draft a post", "blog voice", "blog style", or points at a file under blog-ideas/.
---

# Blog Writing (jaysoo.ca)

Write and edit blog posts in Jack's established voice. This skill is the entry point for any blog work; the authoritative rules live in the style guide.

## Step 1 — Load the style guide (always)

Read the full guide before writing or editing any prose:

`.ai/para/resources/blog-ideas/STYLE_GUIDE.md`

(Inside the `dot-ai-config` repo itself, there is no `.ai` symlink — read `dot_ai/para/resources/blog-ideas/STYLE_GUIDE.md`.)

The guide is the source of truth. Everything below is a fast reference, not a replacement. If the guide and this file ever disagree, the guide wins — and update this file.

## Step 2 — Draft or edit

Follow the guide's structure: **Problem -> Existing Solutions -> Their Limitations -> Better Solution -> Benefits.** Argue by demonstration (show it in code), not by authority. Acknowledge alternatives before advocating.

Code-example sequence, every time: (1) state what it demonstrates, (2) show it, (3) explain the takeaway. Never drop code without surrounding prose.

## Step 3 — Pre-publish checklist

Run every draft against this before calling it done. Grep the draft for the banned words.

- [ ] **Voice:** inclusive "we" by default. "I" only for series intros / flagged opinions / disagreements. No "dear reader", "imagine you're...", "you might be thinking...".
- [ ] **Opening:** context-setting declarative or a concept definition. Never opens with "I" or a personal anecdote.
- [ ] **Conclusion:** 1-3 paragraphs, no "In conclusion" / "To sum up" markers.
- [ ] **Banned words:** amazing, awesome, game-changer, revolutionary, actually, basically, obviously, simply put, of course, simple, easy. Prefer **straightforward**.
- [ ] **Sentences:** mostly 15-25 words, grammatically complete (no fragments-for-emphasis). Em dashes over semicolons.
- [ ] **Paragraphs:** 2-4 sentences, one concept each.
- [ ] **Punctuation:** near-zero exclamation marks; semicolons rare.
- [ ] **Headers:** descriptive noun phrases or declarative statements (H2 sections, H3 subsections).
- [ ] **Jargon:** concept before name; academic terms mapped to code the reader knows.
- [ ] **Title:** a thesis statement that conveys the argument.

## Signature phrases (use naturally, don't force)

"easier to reason about", "source of truth", "data in, data out", "in the context of", "straightforward", "as opposed to".

## Notes

- Post drafts and ideas live under `.ai/para/resources/blog-ideas/`.
- This is the **personal** jaysoo.ca voice. It is distinct from the Nx company blog — for that, see `.ai/para/resources/architectures/nx-blog-architecture.md`.
- After invoking this skill, bump `USAGE.md` in `dot-ai-config`.
