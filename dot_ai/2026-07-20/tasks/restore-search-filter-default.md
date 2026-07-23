# Restore Search Filter Default

## Goal

Restore the search Type facet to its production default (expanded) while preserving Knowledge Base-only result prioritization.

## Step 1: Identify the regression

- [x] Compare the branch Search component with Starlight's current/default implementation.
- [x] Confirm whether the collapsed state comes from initialization order, persisted state, or custom markup/styles.

The new hidden `section` filter gives Pagefind two filter groups. Pagefind only auto-opens a single group with six or fewer values, so the visible `type` group now starts closed even though the hidden group is removed with CSS.

## Step 2: Implement the smallest fix

- [x] Restore the production facet default without changing non-KB search ranking or filters.
- [x] Keep the KB adapter limited to `/docs/kb` routes.

## Step 3: Verify

- [x] Format changed files.
- [x] Run focused Astro docs validation.
- [x] Verify the Type facet is expanded in the built search UI and KB prioritization still works.
- [x] Update this plan as implementation proceeds.

Validation: Astro docs lint and production build passed. A headless browser check against the built site confirmed the visible Type filter is open for both docs and KB routes. The KB route still uses the KB index and returns `Nx and Angular Versions` first for `angular version`.

## Expected outcome

Search opens with the Type filter expanded on both normal docs and Knowledge Base pages, matching production, while KB pages continue to prioritize KB results.
