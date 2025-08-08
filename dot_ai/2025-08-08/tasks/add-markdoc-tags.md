# Add All Markdoc Tags to Astro Docs Site

## Goal
Add support for all markdoc custom tags from nx-dev/ui-markdoc/src/index.ts into the astro-docs site.

## Requirements
1. All custom tags in nx-dev/ui-markdoc/src/index.ts must be added to the markdoc config
2. Tags with `-` are invalid so must be converted to `_` (e.g., `install-nx-console` → `install_nx_console`)
3. The Astro wrapper component must be in astro-docs/src/components/markdoc folder
4. If the React component has props, it must be exported from the original component file and imported+aliased in the Astro component
5. If the original React component did not export its props, update the file to export it
6. One commit per tag

## Implementation Steps

### Phase 1: Setup and Analysis
- [x] Analyze nx-dev/ui-markdoc/src/index.ts to identify all custom tags
- [x] Check astro-docs/markdoc.config.mjs to see which tags are already added
- [x] Create list of missing tags that need to be added

### Phase 2: Add Each Tag
For each tag:
1. Check if props type is exported from the React component
2. If not, add export for the props type
3. Add tag configuration to astro-docs/markdoc.config.mjs
4. Create Astro wrapper component in astro-docs/src/components/markdoc/
5. Create a commit with message: `docs(misc): add [tag_name] markdoc tag to astro-docs`

## Tags Status

### Completed (2 existing + 3 new)
- [x] install_nx_console (existing)
- [x] youtube (existing)
- [x] callout - Added props export, config, and Astro component
- [x] call_to_action - Added props export, config, and Astro component
- [x] card - Added props export, config, and Astro component

### In Progress
- [ ] cards - Working on this now

### Pending (24 remaining)
- [ ] cards
- [ ] link_card
- [ ] github_repository
- [ ] stackblitz_button
- [ ] graph
- [ ] iframe
- [ ] video_player
- [ ] persona
- [ ] personas
- [ ] project_details
- [ ] pill
- [ ] short_embeds
- [ ] short_video
- [ ] side_by_side
- [ ] step
- [ ] steps
- [ ] tab
- [ ] tabs
- [ ] testimonial
- [ ] toc
- [ ] tweet
- [ ] course_video
- [ ] video_link
- [ ] metrics

## Technical Details

### Tags from nx-dev/ui-markdoc/src/index.ts (lines 77-108)
```javascript
tags: {
  callout,
  'call-to-action': callToAction,
  card,
  cards,
  'link-card': linkCard,
  'github-repository': githubRepository,
  'stackblitz-button': stackblitzButton,
  graph,
  iframe,
  'install-nx-console': installNxConsole,
  'video-player': videoPlayer,
  persona,
  personas,
  'project-details': projectDetails,
  pill,
  'short-embeds': shortEmbeds,
  'short-video': shortVideo,
  'side-by-side': sideBySide,
  step,
  steps,
  tab,
  tabs,
  testimonial,
  toc: tableOfContents,
  tweet,
  youtube,
  'course-video': courseVideo,
  'video-link': videoLink,
  metrics,
}
```

### Special Cases
- Tweet and CourseVideo components are from @nx/nx-dev-ui-common
- VideoLink, VideoPlayer, Testimonial have schemas embedded in component files
- Some components use inline prop types that need to be extracted

## CRITICAL: Track Progress
Keep updating this file as we complete each tag implementation!

## Current TODO
- Continue with Card tag implementation
- Add props exports for Card, Cards, and LinkCard components
- Create configs and Astro wrappers for each