# DOC-552: Sort Knowledge Base article tables

## Goal

Make the Title and Last modified headers interactive on Knowledge Base article tables while leaving Topics unsortable. Preserve the existing newest-first default order and topic filtering. Also give KB articles the same explicit back link as topic pages and remove their redundant breadcrumbs.

## Plan

### Step 1: Add accessible sorting

- [x] Convert the Title and Last modified headers into sort controls.
- [x] Add stable row sort values and client-side ascending/descending ordering.
- [x] Expose the active column and direction with `aria-sort` and visible indicators.
- [x] Keep topic filtering independent from row ordering.

### Step 2: Verify and finish

- [x] Share the Back to Knowledge Base component between topic and article pages.
- [x] Hide breadcrumbs across the complete KB experience.
- [x] Format and lint the changed component.
- [x] Build the Astro documentation site.
- [x] Verify title/date sorting, keyboard access, filtering, responsive layout, and both themes in the production preview.
- [x] Run the repository pre-push gate.
- [x] Amend the existing squashed commit without pushing.
- [x] Record results in this plan and update task tracking.

## Expected outcome

Every shared Knowledge Base article table starts newest-first. Readers can toggle Title between A-Z and Z-A or Last modified between newest-first and oldest-first. Topics remains a static header. KB articles show Back to Knowledge Base above the title without also showing breadcrumbs.

## Results

- Added accessible Title and Last modified sorting to the shared Knowledge Base article table. Last modified defaults to descending; Title starts ascending when selected. Topics remains static.
- Preserved topic filtering and newest-first server rendering. Stable tie-breakers keep equal dates and titles deterministic.
- Added a shared Back to Knowledge Base link above every topic and article title, hid KB breadcrumbs, and left non-KB navigation unchanged.
- Verified sorting in both directions, keyboard activation, topic filtering, responsive layouts, light/dark themes, and no horizontal overflow in a production preview.
- Prettier, lint, production build, the `astro-docs:test` chain, internal-link validation, and `pnpm nx prepush` passed.
- Amended the existing single commit to `a9d01937c8`; not pushed.
