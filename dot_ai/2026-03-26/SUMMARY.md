# Summary — 2026-03-26

## Docs: Getting started tutorial links (PR #35024)

Added consistent "Next steps" sections across all four getting started pages (intro, installation, start-new-project, start-with-existing-project). Every page now links to the tutorial series with uniform bullet-list formatting. Replaced card grid on the "Add to Existing Project" page with simple bullet lists. Fixed sidebar label consistency ("Reduce boilerplate" → "Reducing boilerplate").

- Branch: `docs_minor_tutorial_updates`
- PR: https://github.com/nrwl/nx/pull/35024

## DOC-452: Tutorial series merged

PR #34998 (topic-based tutorial series) merged overnight. The getting started tutorial links PR above is the follow-up to connect the new tutorials into the getting started flow.

## DOC-457: Webinar banner light mode support (PR #35029)

Made the webinar banner (`WebinarNotifier`) theme-aware so it adapts to light/dark mode. Previously hardcoded to dark background, making the close button invisible in light mode. Now matches the Framer marketing site design:
- **Light mode**: White bg, subtle border, dark text, dark CTA button
- **Dark mode**: Dark bg, white text, pink CTA (unchanged)

- Branch: `DOC-457`
- PR: https://github.com/nrwl/nx/pull/35029
