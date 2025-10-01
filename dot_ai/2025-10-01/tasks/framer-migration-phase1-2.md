# Next.js to Framer Migration - Phase 1 & 2: Foundation + Homepage

**Timeline:** 1 Week
**Status:** Planning
**Goal:** Set up Framer design system and implement complete homepage with header/footer components

---

## Week 1: Days 1-2 - Framer Setup & Design System

### Day 1: Initial Setup

#### 1. Create Framer Project
1. Go to framer.com/projects
2. Click "New Project" → "Blank Project"
3. Name it "Nx Dev Website"
4. Set canvas size to Desktop (1440px width default)

#### 2. Configure Project Settings
1. Click project name → "Settings"
2. Under "General":
   - Set default viewport: Desktop
   - Enable "Responsive Design"
3. Under "SEO":
   - Set site name: "Nx: Smart Repos · Fast Builds"
   - Add favicon (use `/public/favicon/favicon.svg`)

#### 3. Set Up Design Tokens

**Colors (Variables Panel - Right Sidebar):**
1. Click "Variables" icon (bottom right)
2. Click "+ New Collection" → Name: "Colors"
3. Add these color variables:

```
Light Mode:
- slate-50: #F8FAFC
- slate-100: #F1F5F9
- slate-200: #E2E8F0
- slate-300: #CBD5E1
- slate-400: #94A3B8
- slate-500: #64748B
- slate-600: #475569
- slate-700: #334155 (main text)
- slate-800: #1E293B
- slate-900: #0F172A (dark bg)
- slate-950: #020617

Gradients:
- cyan-500: #06B6D4
- blue-500: #3B82F6
- pink-500: #EC4899
- fuchsia-500: #D946EF

Semantic:
- bg-light: #FFFFFF
- bg-dark: #0F172A
- text-light: #334155
- text-dark: #CBD5E1
```

4. Create "+ New Collection" → Name: "Spacing"
   - Add: 4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 96, 128, 160, 224

**Typography (Text Styles):**
1. Click "Assets" panel (left sidebar)
2. Under "Text Styles", click "+"
3. Create these styles:

**Display Heading:**
- Font: System (Inter/SF Pro)
- Size: 64px (desktop), 48px (tablet), 36px (mobile)
- Weight: 800 (ExtraBold)
- Line height: 1.1
- Letter spacing: -0.02em
- Color: Variable → text-light

**Subtitle:**
- Font: System
- Size: 24px (desktop), 20px (tablet), 18px (mobile)
- Weight: 400
- Line height: 1.5
- Color: Variable → slate-600

**Body:**
- Font: System
- Size: 16px
- Weight: 400
- Line height: 1.5
- Color: Variable → text-light

**Code:**
- Font: Monospace
- Size: 14px
- Weight: 400
- Line height: 1.5
- Color: Variable → slate-700

#### 4. Enable Dark Mode
1. Click "Variables" panel
2. Click "..." menu → "Color Modes"
3. Enable "Dark Mode"
4. Update each color variable with dark mode values:
   - bg-light → bg-dark (#0F172A)
   - text-light → text-dark (#CBD5E1)
   - slate-700 → slate-400 (text in dark)

---

## Days 2-3: Build Core Components

### Component 1: Header

#### Step 1: Create Header Frame
1. Press `F` (Frame tool) or click Frame in toolbar
2. Draw frame: 1440px width × 80px height
3. Rename frame: "Header" (double-click name in layers)
4. Set Layout:
   - Click frame → Right panel → "Layout"
   - Direction: Horizontal
   - Alignment: Center (vertical)
   - Distribute: Space Between
   - Padding: 0px 32px
   - Gap: 24px

#### Step 2: Add Logo
1. Drag SVG logo into frame (from `/public/images/nx-logo-white.svg`)
2. Size: 32px × 32px
3. Position: Left side (should auto-align due to layout)
4. Click logo → Right-click → "Create Component"
5. Name: "Logo"

#### Step 3: Create Navigation Menu
1. Create new Frame inside Header
2. Name: "Nav Menu"
3. Layout: Horizontal, Gap: 32px, Alignment: Center
4. Add Text elements for each nav item:
   - "Solutions"
   - "Enterprise"
   - "Resources"
   - "Professional Services"
5. Style text:
   - Size: 14px
   - Weight: 500
   - Color: Variable → slate-700
6. Add hover effect:
   - Select text → Right panel → "Hover"
   - Color: Variable → blue-500

#### Step 4: Create Dropdown Menus (Solutions example)
1. Select "Solutions" text
2. Right panel → "+ Interaction"
3. Trigger: "While Hovering"
4. Action: "Show/Hide" → Create new Frame
5. Create dropdown frame:
   - Position: Below "Solutions" (use absolute positioning)
   - Background: white
   - Border radius: 8px
   - Shadow: 0 10px 20px rgba(0,0,0,0.1)
   - Padding: 16px
6. Add menu items as Stack (vertical):
   - "Nx" - link to https://nx.dev
   - "Nx Cloud" - link to /nx-cloud
   - "Nx Enterprise" - link to /enterprise
7. Style menu items:
   - Size: 14px
   - Padding: 8px 12px
   - Hover background: slate-100
   - Border radius: 4px

#### Step 5: Add Search
1. Insert icon (magnifying glass) or use Iconify plugin
2. Size: 20px × 20px
3. Color: Variable → slate-600
4. Note: Full Algolia search will need code component later

#### Step 6: Add CTA Buttons
1. Create Frame for button container
2. Layout: Horizontal, Gap: 12px
3. Create "Contact" button:
   - Frame: 100px × 40px
   - Background: Variable → slate-200
   - Border radius: 8px
   - Text: "Contact", centered, 14px, weight 500
   - Hover: Background → slate-300
4. Create "Try Nx Cloud" button:
   - Frame: 120px × 40px
   - Background: Variable → blue-500
   - Text: White, centered
   - Hover: Background → blue-600

#### Step 7: Make Header Sticky
1. Select Header frame
2. Right panel → "Position"
3. Set: "Fixed"
4. Pin: Top, Left, Right
5. Z-index: 1000

#### Step 8: Mobile Menu (Hamburger)
1. Create Frame: "Mobile Menu Button" (40×40px)
2. Add hamburger icon (3 lines)
3. Right panel → "Breakpoint" dropdown → "Tablet" (768px)
4. In tablet view:
   - Hide desktop navigation
   - Show mobile menu button
5. Create interaction:
   - Trigger: "Tap"
   - Action: "Show Overlay" → New frame
6. Create mobile menu overlay:
   - Full screen frame
   - Background: white
   - Stack layout (vertical)
   - Add all nav items (vertical list)
   - Add close button (X icon) at top-right

#### Step 9: Create Component
1. Select entire Header frame
2. Right-click → "Create Component"
3. Name: "Header"
4. Add to Assets panel for reuse

---

### Component 2: Footer

#### Step 1: Create Footer Frame
1. Frame: 1440px width × auto height
2. Background: Variable → slate-900 (dark footer)
3. Padding: 64px 32px
4. Layout: Vertical, Gap: 48px

#### Step 2: Create Column Layout
1. Inside footer, create Frame: "Footer Columns"
2. Layout: Horizontal (5 columns)
3. Gap: 48px
4. Distribute: Space Between

#### Step 3: Add Columns (5 total)
For each column:
1. Create Frame
2. Layout: Vertical, Gap: 16px
3. Add heading (Text):
   - Size: 14px
   - Weight: 600
   - Color: white
   - Letter spacing: 0.05em
4. Add links (Text elements):
   - Size: 14px
   - Weight: 400
   - Color: Variable → slate-400
   - Hover: Color → white

**Column 1 - Nx:**
- Status
- Security

**Column 2 - Nx Cloud:**
- App
- Docs
- Pricing
- Terms

**Column 3 - Solutions:**
- Nx
- Nx Cloud
- Nx Enterprise

**Column 4 - Resources:**
- Blog
- Youtube
- Community
- Customers

**Column 5 - Company:**
- About us
- Careers
- Brands & Guidelines
- Contact us

#### Step 4: Social Icons Row
1. Create Frame below columns
2. Layout: Horizontal, Gap: 24px
3. Add social icons (24×24px each):
   - Discord (use Iconify plugin or import SVG)
   - GitHub
   - YouTube
   - X (Twitter)
   - LinkedIn
   - Slack
4. Color: Variable → slate-400
5. Hover: Color → white

#### Step 5: Newsletter Signup
1. Create Frame at top of footer
2. Add Text: "Subscribe to newsletter"
3. Create input field (Frame):
   - 300px × 48px
   - Background: slate-800
   - Border: 1px slate-700
   - Border radius: 8px
4. Add button: "Subscribe"
   - Background: blue-500
   - Positioned inside/next to input

#### Step 6: Theme Switcher
1. Create toggle component:
   - Frame: 56px × 28px
   - Border radius: 14px (pill shape)
   - Background: slate-700
2. Add circle (toggle button):
   - 24px × 24px circle
   - Background: white
   - Position: Left (light mode) or Right (dark mode)
3. Add icons: Sun (left) and Moon (right)
4. Add interaction:
   - Trigger: Tap
   - Action: Toggle between variants
   - Note: Actual theme switching will need code component

#### Step 7: Responsive Footer
1. Switch to Tablet breakpoint (768px)
2. Footer Columns layout → Vertical instead of Horizontal
3. Stack columns on top of each other
4. Reduce padding: 48px 24px

#### Step 8: Create Component
1. Select entire Footer frame
2. Right-click → "Create Component"
3. Name: "Footer"

---

### Component 3: Button Component (Reusable)

#### Step 1: Create Button Frame
1. Frame: 140px × 48px
2. Border radius: 8px
3. Layout: Center alignment (both axes)
4. Add Text: "Button"

#### Step 2: Create Component with Variants
1. Select frame → Right-click → "Create Component"
2. Name: "Button"
3. In component editor, click "+ Add Variant"
4. Create variants:
   - **Primary:** Background: blue-500, Text: white
   - **Secondary:** Background: slate-200, Text: slate-900
   - **Ghost:** Background: transparent, Border: 1px slate-300

#### Step 3: Add Properties
1. Component selected → Right panel → "+ Add Property"
2. Add properties:
   - **Text:** Type "Text", Default: "Button"
   - **Variant:** Type "Enum", Options: Primary, Secondary, Ghost
   - **Size:** Type "Enum", Options: Small (40px), Default (48px), Large (56px)
   - **Link:** Type "Link", Default: "/"

#### Step 4: Add Hover State
1. Select variant → Right panel → "+ State" → "Hover"
2. For Primary hover:
   - Background: blue-600
   - Transform: Scale 1.02
3. For Secondary hover:
   - Background: slate-300

#### Step 5: Connect Link Property
1. Select component → Right panel → "Link"
2. Click chain icon → Select "Link" property
3. This makes link configurable per instance

---

## Days 4-5: Build Homepage

### Homepage Structure Setup

#### Step 1: Create Homepage
1. Assets panel → "Pages"
2. Click "+" → "New Page"
3. Name: "Home"
4. Set as homepage (click "..." → "Set as Home Page")

#### Step 2: Add Layout Frame
1. On Home page, press `F` for Frame
2. Draw frame: Full width (set to "100vw" in width field)
3. Layout: Vertical (stack)
4. Alignment: Center (horizontal)
5. Gap: 128px (large spacing between sections)
6. Background: Variable → bg-light

#### Step 3: Insert Header
1. Drag "Header" component from Assets panel
2. Position at top (should be fixed position)

#### Step 4: Insert Footer
1. Drag "Footer" component from Assets panel
2. Position at bottom of page

---

### Section 1: Hero

#### Step 1: Create Hero Frame
1. Inside page layout, create new Frame: "Hero"
2. Size: 1280px max-width, auto height
3. Padding: 192px 48px 64px 48px (large top padding)
4. Layout: Vertical, Center aligned
5. Gap: 32px

#### Step 2: Add Heading with Gradient Text
1. Add Text: "Smart Repos · Fast Builds"
2. Apply "Display Heading" style
3. For gradient text "Smart":
   - Select "Smart" word only
   - Right panel → "Fill" → "Linear Gradient"
   - Gradient stops:
     - 0%: cyan-500 (#06B6D4)
     - 100%: blue-500 (#3B82F6)
   - Angle: 90deg (left to right)
4. Repeat for "Fast":
   - Gradient stops:
     - 0%: pink-500 (#EC4899)
     - 100%: fuchsia-500 (#D946EF)

**Pro tip:** To add bullet separator:
1. Add Text: "·" between phrases
2. Size: 32px
3. Color: slate-400

#### Step 3: Add Subtitle
1. Add Text below heading
2. Content: "Get to green PRs in half the time. Nx optimizes your builds, scales your CI, and fixes failed PRs. Built for developers and AI agents."
3. Apply "Subtitle" style
4. Max width: 800px (set in width field)
5. Text align: Center

**Making text bold:**
1. Select "Get to green PRs in half the time"
2. Weight: 600

#### Step 4: Add CTA Buttons
1. Create Frame: "CTA Container"
2. Layout: Horizontal, Gap: 16px, Center aligned
3. Drag 2 "Button" components:
   - Button 1: Variant: Primary, Text: "Get started", Link: "https://cloud.nx.app/get-started"
   - Button 2: Variant: Secondary, Text: "Documentation", Link: "/docs/getting-started/intro"

#### Step 5: Add "Built with" Badge
1. Create Frame
2. Layout: Horizontal, Gap: 8px, Center aligned
3. Add Text: "Built with"
4. Add Rust icon (import SVG or use Iconify)
5. Add Text: "for speed &"
6. Add TypeScript icon
7. Add Text: "for extensibility"
8. Style: 14px, italic, color: slate-600

#### Step 6: Add Background Gradient Blob
1. Click Hero frame
2. Add layer behind content: Press `Cmd+Shift+[` (send to back)
3. Create Frame at top: 1200px × 800px
4. Background: Linear gradient
   - 0%: purple-500 with 10% opacity
   - 100%: blue-500 with 15% opacity
5. Rotate: 35deg
6. Blur: 100px (Effects panel → "+ Blur" → 100)
7. Position: Absolute, centered behind heading

#### Step 7: Add Hero Video Placeholder
1. Below CTA buttons, add Frame: 1200px × 675px (16:9 aspect)
2. Background: slate-900
3. Border radius: 16px
4. Shadow: 0 20px 40px rgba(0,0,0,0.2)
5. Add placeholder text: "Video" or import video

**For actual video:**
- Right-click frame → "Insert" → "Video"
- Upload video file or embed YouTube URL
- Set autoplay: Yes, loop: Yes, controls: No

---

### Section 2: Statistics

#### Step 1: Create Statistics Frame
1. New Frame: "Statistics"
2. Max-width: 1280px
3. Layout: Horizontal (3-column grid)
4. Gap: 64px
5. Padding: 0 48px

#### Step 2: Create Stat Card Component
1. For each statistic, create Frame:
   - Size: 300px width, auto height
   - Layout: Vertical, Center aligned, Gap: 8px
2. Add large number (Text):
   - Size: 48px
   - Weight: 700
   - Color: blue-500
3. Add label (Text):
   - Size: 16px
   - Color: slate-600
   - Text align: Center

Example stats (extract from current site):
- "5B+ tasks executed"
- "500K+ developers"
- "Fortune 500 companies trust Nx"

#### Step 3: Make Responsive
1. Switch to Tablet breakpoint
2. Change layout: Vertical (stack)
3. Center align all stat cards

---

### Section 3: Problem Section

#### Step 1: Create Problem Frame
1. New Frame: "Problem"
2. Max-width: 1024px
3. Layout: Vertical, Center aligned, Gap: 32px
4. Padding: 0 48px

#### Step 2: Add Content
1. Add heading (Text):
   - Content: Extract from `ui-home/problem.tsx`
   - Size: 36px
   - Weight: 700
   - Text align: Center
2. Add body text:
   - Size: 18px
   - Color: slate-600
   - Line height: 1.6
   - Max width: 768px
   - Text align: Center
3. Add supporting visual (illustration or graphic)

---

### Section 4: Solution Section

#### Step 1: Create Solution Frame
1. New Frame: "Solution"
2. Full width (100vw)
3. Background image: Wave SVG
   - Upload `/public/images/home/wave.svg`
   - Background size: Cover
   - Background position: Center
4. Background blend mode:
   - Overlay layer: white, 50% opacity
   - Dark mode: Use `/public/images/home/wave-dark.svg`
5. Padding: 128px 48px

#### Step 2: Add Content Container
1. Inside Solution, create Frame: 1024px max-width
2. Layout: Vertical, Center, Gap: 48px
3. Add heading + content (same pattern as Problem)

#### Step 3: Add Feature Grid
1. Create Frame: "Feature Grid"
2. Layout: Grid (3 columns on desktop)
3. Gap: 32px (both row and column)
4. For each feature:
   - Icon (32px)
   - Heading (18px, weight 600)
   - Description (14px, slate-600)

**Setting up CSS Grid in Framer:**
1. Select frame → Right panel → "Layout"
2. Change from "Stack" to "Grid"
3. Columns: 3
4. Gap: 32px
5. Auto-fit rows

---

### Section 5: Features Section

#### Step 1: Create Features Frame
1. New Frame: "Features"
2. Max-width: 1280px
3. Layout: Vertical, Gap: 96px
4. Padding: 0 48px

#### Step 2: Build Feature Sections
Based on `ui-home/features/`:
- Features While Coding
- Features While Running CI
- Features While Scaling

For each:
1. Create Frame with 2-column layout (desktop)
2. Left column: Text content
3. Right column: Visual (screenshot, diagram, or video)
4. Alternate layout (left/right) for visual interest

**2-Column Layout:**
1. Frame layout: Horizontal
2. Gap: 64px
3. Columns equal width (50% each)
4. Vertical alignment: Center

**Responsive:**
1. Tablet breakpoint: Stack vertically
2. Visual always above text

---

### Section 6: Testimonial

#### Step 1: Create Testimonial Frame
1. New Frame: "Testimonial"
2. Max-width: 1024px
3. Background: Gradient (subtle)
4. Border radius: 16px
5. Padding: 64px
6. Shadow: 0 10px 30px rgba(0,0,0,0.05)

#### Step 2: Add Content
1. Quote text (large, 24px)
2. Author name + title
3. Company logo
4. Layout: Vertical, Center aligned

---

### Section 7: Team and Community

#### Step 1: Create Frame
1. New Frame: "Team and Community"
2. Max-width: 1280px
3. Layout: 2 columns

#### Step 2: Left Column - Team
1. Heading: "Built by Nrwl"
2. Description
3. CTA button: "About us"

#### Step 3: Right Column - Community
1. Heading: "Join the Community"
2. Community stats
3. Social links
4. CTA button: "Join Discord"

---

### Section 8: Final CTA

#### Step 1: Create CTA Frame
1. New Frame: "Final CTA"
2. Max-width: 800px
3. Background: Gradient (blue to purple)
4. Border radius: 16px
5. Padding: 64px
6. Text: White
7. Layout: Vertical, Center aligned, Gap: 24px

#### Step 2: Add Content
1. Heading: "Ready to get started?"
2. Subheading
3. CTA buttons (white background for contrast)

---

## Day 6: Responsive Testing & Refinement

### Breakpoint Testing
1. Click canvas size dropdown (top)
2. Test each breakpoint:
   - **Desktop:** 1440px (default)
   - **Laptop:** 1024px
   - **Tablet:** 768px
   - **Mobile:** 375px

### For each breakpoint:
1. Check all sections render correctly
2. Adjust layouts (stack vs. horizontal)
3. Adjust padding/gaps
4. Adjust font sizes
5. Hide/show elements as needed

### Common Responsive Patterns:
- **3-column grid → 2-column (tablet) → 1-column (mobile)**
  - Select grid → Breakpoint → Change "Columns" value

- **Horizontal layout → Vertical stack:**
  - Select frame → Breakpoint → Change "Direction" from Horizontal to Vertical

- **Reduce padding:**
  - Breakpoint → Adjust padding values (e.g., 64px → 48px → 32px)

---

## Day 7: Dark Mode, Polish & Preview

### Dark Mode Styling
1. Click "Variables" panel
2. Toggle "Dark Mode" preview
3. For each section, check:
   - Text is readable
   - Backgrounds have sufficient contrast
   - Hover states work
   - Images/icons adapt (or stay same)

### Adjustments:
1. Select element
2. Right panel → Find property (e.g., Background)
3. Click variable icon → Switch to dark mode value
4. Example: text-light → text-dark

### Final Polish:
- Check all links work
- Test all interactions (hover, click)
- Verify animations are smooth (60fps)
- Check loading states
- Test form inputs (if any)

### Preview & Share:
1. Click "Preview" button (top right)
2. Opens in new tab
3. Share preview link with team
4. Gather feedback

---

## Deliverables After Week 1:
- ✅ Complete design system (colors, typography, spacing)
- ✅ Header component (with mobile menu)
- ✅ Footer component
- ✅ Button component library
- ✅ Full homepage (8 sections)
- ✅ Responsive across 4 breakpoints
- ✅ Dark mode support
- ✅ Preview link for stakeholder review

---

## Pro Tips for Framer:

**Component Management:**
- Keep components organized in folders in Assets panel
- Use consistent naming: "Button/Primary", "Button/Secondary"
- Create a "Design System" page to showcase all components

**Performance:**
- Use WebP images (auto-optimized by Framer)
- Limit shadows and blurs (expensive)
- Use CSS transforms for animations (smoother)

**Variables:**
- Create semantic variables (e.g., "primary" not "blue-500")
- This makes theme changes easier later

**Keyboard Shortcuts:**
- `F` - Frame
- `T` - Text
- `Cmd+D` - Duplicate
- `Cmd+G` - Group
- `Cmd+Shift+K` - Create Component

**Getting Stuck?**
- Framer has built-in AI assistant (bottom right)
- Framer University: framer.com/academy
- Framer Community: framer.community

---

## Source Files Reference

Key files from codebase to reference:
- Header: `nx-dev/ui-common/src/lib/headers/header.tsx`
- Footer: `nx-dev/ui-common/src/lib/footer.tsx`
- Homepage: `nx-dev/nx-dev/pages/index.tsx`
- Hero: `nx-dev/ui-home/src/lib/hero/hero.tsx`
- Tailwind config: `nx-dev/nx-dev/tailwind.config.js`
- Main CSS: `nx-dev/nx-dev/styles/main.css`
