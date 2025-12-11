# DOC-360: Simplify Banner JSON Schema

**Linear Issue**: https://linear.app/nxdev/issue/DOC-360
**Branch**: DOC-360
**Date**: 2025-12-10

## Overview

Simplified the banner JSON schema to support only one banner at a time instead of an array of notifications.

## Previous Schema

```json
{
  "notifications": [{
    "id": "unique-id",
    "title": "Event Title",
    "description": "Event description",
    "date": "2024-10-07",
    "type": "webinar" | "event" | "release",
    "status": "upcoming" | "live" | "past",
    "url": "https://example.com/register",
    "ctaText": "Register Now",
    "links": [{ "label": "Discord", "url": "...", "icon": "chat" }],
    "enabled": true
  }]
}
```

## New Schema

```json
{
  "title": "Event Title",
  "description": "Event description",
  "icon": "webinar",
  "primaryCtaUrl": "https://nx.dev/",
  "primaryCtaText": "Learn More",
  "secondaryCtaUrl": "https://nx.dev/register",
  "secondaryCtaText": "Register Now",
  "enabled": true
}
```

### Field Changes

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `id` | (removed) | Now uses title-based key for localStorage |
| `type` | `icon` | Renamed, same values: webinar, event, release |
| `date` | (removed) | No longer needed |
| `status` | (removed) | No longer needed |
| `url` | `primaryCtaUrl` | Renamed |
| `ctaText` | `primaryCtaText` | Renamed, now required |
| `links[]` | `secondaryCtaUrl` + `secondaryCtaText` | Simplified to single secondary CTA |
| `enabled` | `enabled` | Unchanged |

### Validation

Added `validateBannerConfig()` function that validates:
- All required fields present and correct type
- `icon` is one of: `webinar`, `event`, `release`
- Optional secondary CTA fields are strings if present

## Files Changed

1. **nx-dev/nx-dev/README.md**
   - Added "Dynamic Banner" section with configuration and schema documentation

2. **astro-docs/README.md**
   - Added "Dynamic Banner" section with configuration and schema documentation
   - Note about difference from Starlight top banner

3. **nx-dev/ui-common/src/lib/banner/banner.types.ts**
   - Removed `BannerNotification`, `BannerLink`, `BannerType`, `BannerStatus`
   - Simplified `BannerConfig` to single banner object
   - Added `BannerIcon` type and `VALID_BANNER_ICONS` array
   - Added `validateBannerConfig()` function
   - Removed `getActiveBanner()` and `getDefaultCtaText()`

4. **nx-dev/ui-common/src/lib/banner/use-banner-config.ts**
   - Changed return from `{ config, activeBanner }` to `{ banner }`
   - Uses `validateBannerConfig()` for runtime validation
   - Returns error if config format is invalid

5. **nx-dev/ui-common/src/lib/banner/dynamic-banner.tsx**
   - Removed `BannerLinkButton` component
   - Removed unused icon imports (PlayIcon, ChatBubbleLeftRightIcon)
   - Changed from `activeBanner` to `banner`
   - Uses `getBannerKey(title)` for localStorage (derived from title)
   - Shows secondary CTA inline (not as array of links)
   - Removed debug `console.log` statement

## Testing

- [x] TypeScript compiles without errors (`nx run ui-common:typecheck`)

## Example Usage

```tsx
<DynamicBanner bannerUrl={process.env.NEXT_PUBLIC_BANNER_URL} />
```

With JSON at the URL:
```json
{
  "title": "Nx Conf 2025",
  "description": "Join us for the annual Nx conference",
  "icon": "webinar",
  "primaryCtaUrl": "https://nx.dev/conf",
  "primaryCtaText": "Learn More",
  "secondaryCtaUrl": "https://nx.dev/conf/register",
  "secondaryCtaText": "Register Now",
  "enabled": true
}
```
