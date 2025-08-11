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

### ✅ COMPLETED - All 27 tags successfully added!

#### Pre-existing (2)
- [x] install_nx_console
- [x] youtube

#### Newly Added (25)
- [x] callout - Added props export, config, and Astro component
- [x] call_to_action - Added props export, config, and Astro component  
- [x] card - Added props export, config, and Astro component
- [x] cards - Added config and Astro component
- [x] link_card - Added config and Astro component
- [x] github_repository - Added props export, config, and Astro component
- [x] stackblitz_button - Added props export, config, and Astro component
- [x] graph - Added props export, config, and Astro component
- [x] iframe - Added props export and fixed typo, config, and Astro component
- [x] video_player - Added props export, config, and Astro component
- [x] persona - Added props export, config, and Astro component
- [x] personas - Added props export, config, and Astro component
- [x] project_details - Added props export, config, and Astro component
- [x] pill - Added props export, config, and Astro component
- [x] short_embeds - Added props export, config, and Astro component
- [x] short_video - Added props export, config, and Astro component
- [x] side_by_side - Added props export, config, and Astro component
- [x] step - Added props export, config, and Astro component
- [x] steps - Added props export, config, and Astro component
- [x] tab - Added props export, config, and Astro component
- [x] tabs - Added props export, config, and Astro component
- [x] testimonial - Added props export, config, and Astro component
- [x] toc - Exported interface, config, and Astro component
- [x] tweet - Added props export, config, and Astro component
- [x] course_video - Config and Astro component (props already exported)
- [x] video_link - Added props export, config, and Astro component
- [x] metrics - Exported interface, config, and Astro component

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

## Summary

✅ **Task completed successfully!**

All 27 markdoc tags from nx-dev/ui-markdoc have been successfully integrated into the astro-docs site:
- 2 tags were already present (install_nx_console, youtube)
- 25 new tags were added with individual commits
- Props types were exported where needed
- All Astro wrapper components were created
- Configuration was updated in markdoc.config.mjs

The implementation followed all requirements:
1. ✅ All custom tags from nx-dev/ui-markdoc/src/index.ts were added
2. ✅ Hyphenated names were converted to underscored (e.g., `call-to-action` → `call_to_action`)
3. ✅ Astro wrapper components were created in astro-docs/src/components/markdoc/
4. ✅ Props types were exported from React components where needed
5. ✅ One commit was created per tag as requested