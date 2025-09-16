# Task: Style Cookiebot Banner with TailwindCSS

**Task Type:** Enhancement  
**Date:** 2025-08-01  
**Project:** nx-dev website  

## Problem Statement

The current Cookiebot cookie consent banner:
1. Overlaps with announcement banners in the bottom-right
2. Only has a single "OK" button instead of required "Allow all", "Deny", and "Show details" buttons
3. Uses custom CSS instead of TailwindCSS
4. Is positioned at bottom center instead of bottom-left

## Requirements

1. Position banner in bottom-left corner to avoid conflicts with announcement banner
2. Style using TailwindCSS to match the WebinarNotifier component style
3. Implement three buttons:
   - "Allow all" - Accept all cookie categories
   - "Deny" - Reject all non-essential cookies  
   - "Show details" - Open Cookiebot's customization dialog
4. Make it responsive for mobile/desktop

## Implementation Plan

### Step 1: Create Cookiebot Banner Component
**TODO:**
- [x] Create `/nx-dev/ui-common/src/lib/cookiebot-banner.tsx`
- [x] Add TypeScript types for Cookiebot global object
- [x] Use TailwindCSS classes matching WebinarNotifier style
- [x] Implement responsive design

**Git commit:** `feat(nx-dev): create custom cookiebot banner component` ✅

### Step 2: Implement Button Functionality
**TODO:**
- [x] Add "Allow all" button using Cookiebot API
- [x] Add "Deny" button for rejecting non-essential cookies
- [x] Add "Show details" link to open customization dialog
- [x] Handle consent state changes

**Git commit:** `feat(nx-dev): implement cookie consent buttons` ✅

### Step 3: Style Banner with TailwindCSS
**TODO:**
- [x] Apply positioning classes: `fixed bottom-0 left-0 md:bottom-4 md:left-4`
- [x] Set width: `w-full md:w-[512px]`
- [x] Apply dark theme: `bg-slate-950 text-white`
- [x] Add rounded corners and shadow: `md:rounded-lg shadow-lg`
- [x] Style buttons to match design system

**Git commit:** `style(nx-dev): apply tailwind styling to cookie banner` ✅

### Step 4: Integrate with Existing App
**TODO:**
- [ ] Update `_app.tsx` to import and use new component
- [ ] Configure Cookiebot to use custom banner
- [ ] Ensure banner only shows when needed
- [ ] Handle localStorage for consent persistence

**Git commit:** `feat(nx-dev): integrate custom cookie banner with app`

### Step 5: Test and Refine
**TODO:**
- [ ] Test banner positioning on different screen sizes
- [ ] Verify no overlap with announcement banner
- [ ] Test all button functionalities
- [ ] Ensure consent is properly saved and respected
- [ ] Test in production mode

**Git commit:** `test(nx-dev): verify cookie banner functionality`

## Implementation Tracking

**CRITICAL: Keep track of progress in this section as we implement!**

### Progress Log:

**2025-08-01 - Implementation Started**

1. ✅ Created CookiebotBanner component with TailwindCSS styling
   - Added TypeScript types for Cookiebot global object
   - Positioned banner in bottom-left corner
   - Added responsive design for mobile/desktop
   - Exported from ui-common library

## Expected Outcome

When completed:
1. Cookie banner appears in bottom-left corner
2. Three buttons provide clear consent options
3. Banner matches Nx design system using TailwindCSS
4. No overlap with announcement banners
5. Responsive design works on all devices
6. Consent choices are properly saved and respected

## Reference Code

WebinarNotifier positioning classes:
```tsx
className="fixed bottom-0 left-0 right-0 z-30 w-full overflow-hidden bg-slate-950 text-white shadow-lg md:bottom-4 md:left-auto md:right-4 md:w-[512px] md:rounded-lg"
```

Cookiebot API methods:
- `Cookiebot.show()` - Show consent dialog
- `Cookiebot.hide()` - Hide consent dialog  
- `Cookiebot.renew()` - Reopen dialog to change consent
- `Cookiebot.submitCustomConsent()` - Submit partial consent

## Step 6: Create plain HTML/CSS/JavaScript template for Cookiebot admin

### TODO:
- [x] Create HTML template with Cookiebot placeholders
- [x] Create CSS with Tailwind-inspired styles (no actual Tailwind classes)
- [x] Create JavaScript with button handlers using Cookiebot API
- [x] Combine into single file for easy copying to Cookiebot admin

### Implementation:
- Use the React component as reference for styling
- Convert TailwindCSS classes to plain CSS
- Ensure all JavaScript uses vanilla JS (no React)

### Files Created:
- `.ai/2025-08-01/tasks/cookiebot-custom-template.html` - HTML structure
- `.ai/2025-08-01/tasks/cookiebot-custom-template.css` - CSS styles
- `.ai/2025-08-01/tasks/cookiebot-custom-template.js` - JavaScript handlers
- `.ai/2025-08-01/tasks/cookiebot-custom-template-combined.html` - Combined template ready for Cookiebot admin

### Progress Log Update:

**2025-08-01 - Plain HTML/CSS/JS Template Created**

2. ✅ Created plain HTML/CSS/JavaScript templates for Cookiebot admin
   - Created separate files for HTML, CSS, and JS
   - Combined all into single file for easy copying
   - Converted TailwindCSS classes to plain CSS
   - Implemented button handlers using Cookiebot API
   - Added animation support for banner appearance