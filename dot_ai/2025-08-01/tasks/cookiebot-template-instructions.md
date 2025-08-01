# Cookiebot Custom Template Instructions

## Overview

These templates provide a custom cookie consent banner for Cookiebot that:
- Positions in the bottom-left corner (avoiding conflict with announcement banners)
- Includes three buttons: "Allow all", "Deny", and "Show details"
- Uses TailwindCSS-inspired styling to match the Nx design system
- Works responsively on mobile and desktop

## Files Created

1. **cookiebot-custom-template-combined.html** - Complete template ready to copy
2. **cookiebot-custom-template.html** - HTML structure only
3. **cookiebot-custom-template.css** - CSS styles only
4. **cookiebot-custom-template.js** - JavaScript functionality only

## How to Use

### Option 1: Use the Combined Template (Recommended)

1. Open `cookiebot-custom-template-combined.html`
2. Copy the entire file content
3. Log into your Cookiebot admin panel
4. Navigate to the banner customization section
5. Paste the entire content into the custom template field
6. Save and publish your changes

### Option 2: Use Individual Files

If your Cookiebot admin interface has separate fields for HTML, CSS, and JavaScript:

1. Copy content from `cookiebot-custom-template.html` → HTML field
2. Copy content from `cookiebot-custom-template.css` → CSS field  
3. Copy content from `cookiebot-custom-template.js` → JavaScript field

## Features

### Positioning
- Mobile: Full width at bottom of screen
- Desktop: 512px wide, positioned 1rem from bottom-left corner

### Buttons
- **Allow all**: Accepts all cookie categories (statistics, marketing, preferences)
- **Deny**: Rejects all non-essential cookies
- **Show details**: Opens Cookiebot's detailed consent dialog

### Styling
- Dark theme matching Nx design system (bg-slate-950)
- Smooth slide-up animation when appearing
- Responsive design with different layouts for mobile/desktop

### Cookiebot Placeholders Used
- `[#TITLE#]` - Banner title from Cookiebot settings
- `[#TEXT#]` - Banner description from Cookiebot settings
- `[#LANGUAGE#]` - Current language code
- `[#TEXTDIRECTION#]` - Text direction (ltr/rtl)

## Testing

After implementing:
1. Clear your browser cookies to see the banner appear
2. Test all three buttons work correctly
3. Verify positioning doesn't overlap with other page elements
4. Check responsive behavior on different screen sizes
5. Ensure consent choices are saved properly

## Customization

To adjust the styling:
- Colors: Modify the RGB values in the CSS
- Positioning: Change the `bottom` and `left` values
- Width: Adjust the `width` property in desktop media query
- Animation: Modify the `transition` duration or easing