# v0 Mockup Prompt for Nx Intro Page

## How to Use This

1. Go to https://v0.dev
2. Copy the prompt below
3. Paste and generate
4. Iterate on the design

## Full Prompt for v0

```
Create a modern, clean documentation landing page for Nx build system with these specific requirements:

Hero Section:
- Large heading: "Make Your Builds 10x Faster"
- Subheading: "Nx understands your code and only runs what's needed."
- Two buttons side by side: Primary "Install Nx" button (blue) and Secondary "Watch Demo (2 min)" button
- Lots of white space, centered content

Demo Section:
- Section title: "See It In Action"
- Terminal window showing two command executions:
  - First: "$ npm run build" with a full progress bar showing "45 seconds"
  - Second: "$ npm run build" with a short progress bar showing "4 seconds (cached)"
- Use a dark terminal theme with green text
- Add subtle animation to the progress bars

Getting Started Section:
- Section title: "Get Started in 3 Steps"
- Three numbered steps in code blocks:
  1. brew install nx
  2. nx init  
  3. nx build
- Below steps: "✨ That's it! Your builds are now cached."
- Clean spacing between steps

Visual Explanation Section:
- Section title: "What Just Happened?"
- Three bullet points with icons:
  - ⚡ Created a task graph of your dependencies
  - 💾 Cached the results of your build
  - 🚀 Will skip unchanged work on future runs
- Include a simple diagram showing connected nodes representing a task graph

Next Steps Section:
- Section title: "Ready for More?"
- Four cards in a 2x2 grid:
  1. "Advanced Caching" - Configure remote caching
  2. "New Project" - Start from scratch
  3. "CI Optimization" - Speed up your pipeline
  4. "Framework Guides" - React, Angular, Vue guides
- Cards should have subtle hover effects
- Each card has an icon, title, and one-line description

Footer:
- Simple GitHub star button
- Keep it minimal

Design requirements:
- Use Nx brand blue (#0EA5E9) for primary actions
- Green (#10B981) for speed/performance indicators  
- Clean, lots of whitespace
- Mobile responsive
- System font stack
- Subtle shadows on cards
- No unnecessary decorations
- Focus on readability and clear hierarchy

The overall feel should be professional but approachable, with the focus on getting users to value quickly rather than explaining everything upfront.
```

## Alternative Shorter Prompt

```
Create a minimal docs landing page for a build tool. Hero: "Make Your Builds 10x Faster" with Install/Demo buttons. Show terminal before/after comparison (45s vs 4s). Three install steps. Four "next steps" cards in a grid. Use blue (#0EA5E9) accent, lots of whitespace, mobile-first.
```

## Tips for Iteration

After v0 generates the initial design, you can refine with:

- "Make the hero section larger with more breathing room"
- "Add a subtle animation to the terminal demo"
- "Make the cards more prominent with stronger shadows"
- "Reduce the font size in the code blocks"
- "Add icons to the step numbers"
- "Make it feel more like Next.js docs"

## Example Components to Request

If v0 doesn't include certain elements, ask for:

1. "Add an animated progress bar component"
2. "Include a simple task graph visualization"
3. "Add a time saved calculator widget"
4. "Include keyboard shortcuts hint"
5. "Add dark mode toggle"

## Export Options

Once happy with the design:
1. Export as React components
2. Export as HTML/CSS
3. Take screenshots for stakeholder review
4. Use as reference for implementation